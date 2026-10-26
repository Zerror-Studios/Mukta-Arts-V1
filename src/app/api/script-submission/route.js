import { get } from "@vercel/blob";
import { createClient } from "next-sanity";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import {
  SUBMISSION_FOLDER,
  MAX_FILE_BYTES,
  MAX_FILE_MB,
  PITCH_DECK_TYPES,
  CERTIFICATE_TYPES,
  validateSubmission,
} from "@/lib/scriptSubmission";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { saveScriptSubmission } from "@/sanity/lib/saveScriptSubmission";

export const runtime = "nodejs";
export const maxDuration = 60;

/*
 * Saves a completed script submission in Sanity (Studio at /admin > Script Submissions, beside Films and Investor
 * Relations), then emails it to the client with the pitch deck and SWA certificate attached.
 * Saving is required: if it fails the writer is asked to try again, so every submission ends up in the Studio.
 * The email is a notification on top; when it is not configured or fails, the submission still goes through.
 *
 * The form sends the files one of two ways:
 *   - multipart/form-data with the files themselves (used when no Blob store is configured, e.g. locally)
 *   - JSON with the pathnames of files the browser already uploaded to private Vercel Blob storage
 *     (see ./upload), which this route reads back. Needed on Vercel for files over 4.5 MB.
 *
 * Environment (.env locally, Vercel → Project → Settings → Environment Variables in production):
 *   SANITY_API_WRITE_TOKEN    required. A Sanity API token with Editor rights (sanity.io/manage → API → Tokens),
 *                             used to save submissions and their files. Or NEXT_PUBLIC_SANITY_API_WRITE_TOKEN; it
 *                             is read at request time, so it stays on the server, but it must never be read
 *                             in a component: a NEXT_PUBLIC_ value used there is copied into the browser code.
 *   EMAIL_USER, EMAIL_PASS    the sending mailbox (a Google Workspace / Gmail app password).
 *                             NEXT_PUBLIC_EMAIL_USER / NEXT_PUBLIC_EMAIL_PASS are read too, but a
 *                             NEXT_PUBLIC_ prefix is meant for values that are safe in the browser.
 *   CLIENT_EMAIL              the inbox that receives submissions (comma separate several),
 *                             or NEXT_PUBLIC_CLIENT_EMAIL
 *   SMTP_HOST, SMTP_PORT      optional, default smtp.gmail.com / 465
 *   SMTP_SECURE               optional, "true" for port 465 (the default), "false" for 587
 *   EMAIL_FROM                optional sender address, defaults to EMAIL_USER
 *   SCRIPT_ATTACH_LIMIT_MB    optional, largest total attachment size the mail server accepts (default 24)
 *   BLOB_READ_WRITE_TOKEN     added automatically when a Vercel Blob store is connected
 */

const env = (name) => process.env[name] || process.env[`NEXT_PUBLIC_${name}`] || "";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const fail = (message, status = 400, extra = {}) => NextResponse.json({ ok: false, error: message, ...extra }, { status });

class UploadError extends Error {}

const checkFile = (label, contentType, size, allowedTypes) => {
  if (!allowedTypes.includes(contentType)) throw new UploadError(`${label} has an unsupported file type.`);
  if (size > MAX_FILE_BYTES) throw new UploadError(`${label} is larger than ${MAX_FILE_MB} MB.`);
};

const cleanName = (name, fallback) => String(name || fallback).replace(/[\r\n"\\/]/g, "").slice(0, 120) || fallback;

// A file the browser sent in the multipart request
async function readFormFile(file, allowedTypes, label) {
  if (!file || typeof file === "string" || !file.size) throw new UploadError(`${label} is missing.`);
  checkFile(label, file.type, file.size, allowedTypes);
  return {
    label,
    filename: cleanName(file.name, label),
    contentType: file.type,
    size: file.size,
    content: Buffer.from(await file.arrayBuffer()),
  };
}

// A file the browser uploaded to private Vercel Blob storage
async function readBlobFile(file, allowedTypes, label) {
  const pathname = String(file?.pathname || "");
  if (!pathname.startsWith(`${SUBMISSION_FOLDER}/`)) throw new UploadError(`${label} is missing.`);

  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) throw new UploadError(`${label} could not be found. Please upload it again.`);
  checkFile(label, result.blob.contentType, result.blob.size, allowedTypes);

  return {
    label,
    filename: cleanName(file.name, pathname.split("/").pop()),
    contentType: result.blob.contentType,
    size: result.blob.size,
    content: Buffer.from(await new Response(result.stream).arrayBuffer()),
  };
}

async function readRequest(request) {
  const type = request.headers.get("content-type") || "";

  if (type.startsWith("multipart/form-data")) {
    const form = await request.formData();
    const payload = JSON.parse(String(form.get("payload") || "{}"));
    return {
      ...payload,
      readFiles: () =>
        Promise.all([
          readFormFile(form.get("pitchDeck"), PITCH_DECK_TYPES, "Pitch deck"),
          readFormFile(form.get("swaCertificate"), CERTIFICATE_TYPES, "SWA registration certificate"),
        ]),
    };
  }

  const payload = await request.json();
  return {
    ...payload,
    readFiles: () =>
      Promise.all([
        readBlobFile(payload.files?.pitchDeck, PITCH_DECK_TYPES, "Pitch deck"),
        readBlobFile(payload.files?.swaCertificate, CERTIFICATE_TYPES, "SWA registration certificate"),
      ]),
  };
}

const formatSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

// Grouped label/value rows shared by the HTML and plain-text versions of the email
function buildSections(values, files, notAttached, submittedAt, studioUrl) {
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value ?? "").trim()]));
  const name = `${v.firstName} ${v.lastName}`;
  const genre = v.genre === "Other" ? `Other: ${v.genreOther}` : v.genre;

  return [
    {
      title: "Personal details",
      rows: [
        ["Name", name],
        ["Email", v.email, `mailto:${v.email}`],
        ["Phone", v.phone, `tel:${v.phone.replace(/[^\d+]/g, "")}`],
      ],
    },
    {
      title: "Project details",
      rows: [
        ["Screenplay title", v.title],
        ["Format", v.format],
        ["Genre", genre],
        ...(v.format === "Web Series"
          ? [
              ["Episodes", v.episodes],
              ["Duration per episode", `About ${v.episodeDuration} minutes`],
            ]
          : [["Duration", `About ${v.runtime} minutes`]]),
      ],
    },
    { title: "Logline", body: v.logline },
    { title: "Synopsis", body: v.synopsis },
    {
      title: "Documents",
      rows: [
        ["SWA registration number", v.swaNumber],
        ...files.map((f) => [
          f.label,
          `${f.filename} (${formatSize(f.size)}), ${
            notAttached.includes(f) ? "too large to attach; open it from the submission in Sanity Studio" : "attached"
          }`,
        ]),
      ],
    },
    {
      title: "Declarations",
      rows: [
        ["SWA registration", "Confirmed"],
        ["Original author / authorised to submit", "Confirmed"],
        ["Details accurate, format followed", "Confirmed"],
      ],
    },
    {
      title: "Submitted",
      rows: [
        ["Received", submittedAt],
        ["In Sanity Studio", studioUrl, studioUrl],
      ],
    },
  ];
}

function renderHtml(sections, values) {
  const cell = "padding:10px 0;border-bottom:1px solid #ececec;vertical-align:top;font-size:14px;line-height:1.5";

  const renderSection = ({ title, rows, body }) => `
    <tr><td style="padding:28px 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#888">${escapeHtml(title)}</td></tr>
    <tr><td>${
      body !== undefined
        ? `<div style="font-size:14px;line-height:1.65;color:#111;white-space:pre-wrap;border-top:1px solid #111;padding-top:12px">${escapeHtml(body)}</div>`
        : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #111">${rows
            .map(
              ([label, value, href]) => `
            <tr>
              <td width="36%" style="${cell};color:#666;padding-right:16px">${escapeHtml(label)}</td>
              <td style="${cell};color:#111;white-space:pre-wrap">${
                href ? `<a href="${escapeHtml(href)}" style="color:#111">${escapeHtml(value)}</a>` : escapeHtml(value)
              }</td>
            </tr>`
            )
            .join("")}</table>`
    }</td></tr>`;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f4f4">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#111">
        <tr><td style="background:#111;color:#fff;padding:24px 32px">
          <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#bbb">Mukta Arts · Script submission</div>
          <div style="font-size:22px;line-height:1.3;margin-top:6px">${escapeHtml(values.title)}</div>
          <div style="font-size:14px;color:#ccc;margin-top:4px">${escapeHtml(`${values.format} · from ${values.firstName} ${values.lastName}`)}</div>
        </td></tr>
        <tr><td style="padding:0 32px 32px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${sections.map(renderSection).join("")}</table>
          <p style="margin:28px 0 0;font-size:12px;color:#888;line-height:1.5">Sent from the Submit Script form on the Mukta Arts website. Reply to this email to answer the writer directly.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function renderText(sections, values) {
  const heading = `New script submission: ${values.title}`;
  const body = sections
    .map(({ title, rows, body }) => {
      const content = body !== undefined ? body : rows.map(([label, value]) => `${label}: ${value}`).join("\n");
      return `${title.toUpperCase()}\n${"-".repeat(title.length)}\n${content}`;
    })
    .join("\n\n");
  return `${heading}\n${"=".repeat(heading.length)}\n\n${body}\n\nReply to this email to answer the writer directly.\n`;
}

// Emails a submission that is already saved in Sanity. Files that don't fit within the mail server's attachment
// limit are left out, and the email links to the submission in the Studio, where both files are.
async function emailSubmission({ user, pass, to, values, files, submittedAt, studioUrl }) {
  const limit = (Number(process.env.SCRIPT_ATTACH_LIMIT_MB) || 24) * 1024 * 1024;
  let total = 0;
  const attachments = [];
  const notAttached = [];
  for (const file of files) {
    if (total + file.size <= limit) {
      total += file.size;
      attachments.push({ filename: file.filename, content: file.content, contentType: file.contentType });
    } else {
      notAttached.push(file);
    }
  }

  const name = `${values.firstName} ${values.lastName}`;
  const received = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(submittedAt);
  const sections = buildSections(values, files, notAttached, `${received} IST`, studioUrl);

  const port = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: { name: "Mukta Arts website", address: process.env.EMAIL_FROM || user },
    to,
    replyTo: { name, address: values.email },
    subject: `Script submission: "${values.title}" (${values.format}) from ${name}`.replace(/\s+/g, " "),
    text: renderText(sections, values),
    html: renderHtml(sections, values),
    attachments,
  });
}

export async function POST(request) {
  let data;
  try {
    data = await readRequest(request);
  } catch {
    return fail("Invalid request.");
  }

  // Honeypot: real visitors never see or fill this field
  if (data.website) return NextResponse.json({ ok: true });

  const values = data.values && typeof data.values === "object" ? data.values : {};
  const fields = validateSubmission(values, data.declarations || {});
  if (Object.keys(fields).length) {
    return fail("Please correct the highlighted fields and submit again.", 422, { fields });
  }

  const sanityToken = env("SANITY_API_WRITE_TOKEN");
  if (!sanityToken) {
    console.error("[script-submission] SANITY_API_WRITE_TOKEN is not set, so submissions cannot be saved.");
    return fail("Submissions are not being accepted right now. Please try again later.", 503);
  }

  let files;
  try {
    files = await data.readFiles();
  } catch (error) {
    if (!(error instanceof UploadError)) console.error("[script-submission] Reading files failed:", error);
    return fail(error instanceof UploadError ? error.message : "Your files could not be read. Please upload them again.");
  }

  const clean = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value ?? "").trim()]));
  const submittedAt = new Date();

  let savedId;
  try {
    const client = createClient({ projectId, dataset, apiVersion, token: sanityToken, useCdn: false });
    savedId = await saveScriptSubmission(client, clean, files, submittedAt);
  } catch (error) {
    console.error("[script-submission] Saving to Sanity failed:", error);
    return fail("Your submission could not be sent. Please try again in a few minutes.", 502);
  }

  const user = env("EMAIL_USER");
  const pass = env("EMAIL_PASS");
  const to = env("CLIENT_EMAIL");
  if (user && pass && to) {
    try {
      const studioUrl = `${new URL(request.url).origin}/admin/intent/edit/id=${savedId};type=scriptSubmission/`;
      await emailSubmission({ user, pass, to, values: clean, files, submittedAt, studioUrl });
    } catch (error) {
      console.error(`[script-submission] Saved as ${savedId}, but the email could not be sent:`, error);
    }
  }

  return NextResponse.json({ ok: true });
}
