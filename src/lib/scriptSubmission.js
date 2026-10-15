// Shared by the Submit Script form and its API routes.

export const SUBMISSION_FOLDER = "script-submissions";
export const MAX_FILE_MB = 20;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export const PITCH_DECK_TYPES = ["application/pdf"];
export const CERTIFICATE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const ALLOWED_TYPES = [...new Set([...PITCH_DECK_TYPES, ...CERTIFICATE_TYPES])];

export const FORMATS = ["Feature Film", "Web Series"];
export const GENRES = ["Drama", "Thriller", "Comedy", "Romance", "Action", "Mystery/Crime", "Horror", "Family/Social", "Other"];
export const LOGLINE_MAX = 300;
export const SYNOPSIS_MAX = 3000;
export const SHORT_TEXT_MAX = 200;

export const DECLARATION_KEYS = ["swa", "author", "accurate"];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const positiveInt = (val) => /^\d+$/.test(String(val ?? "").trim()) && Number(val) > 0;
const text = (val) => String(val ?? "").trim();

// Checks the typed fields and declarations (not the files) and returns { field: message }.
// The form runs it before submitting and the API route runs it again on what it receives.
export function validateSubmission(values = {}, declarations = {}) {
  const e = {};
  const v = Object.fromEntries(Object.keys(values).map((key) => [key, text(values[key])]));

  if (!v.firstName) e.firstName = "Enter your first name.";
  if (!v.lastName) e.lastName = "Enter your last name.";

  if (!v.email) e.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(v.email)) e.email = "Enter a valid email address.";

  const phoneDigits = (v.phone || "").replace(/\D/g, "");
  if (!v.phone) e.phone = "Enter your phone number.";
  else if (phoneDigits.length < 7 || phoneDigits.length > 15) e.phone = "Enter a valid phone number.";

  if (!v.title) e.title = "Enter the screenplay title.";

  if (!FORMATS.includes(v.format)) e.format = "Select a format.";

  if (!GENRES.includes(v.genre)) e.genre = "Select a genre.";
  else if (v.genre === "Other" && !v.genreOther) e.genreOther = "Specify the genre.";

  if (v.format === "Feature Film" && !positiveInt(v.runtime)) {
    e.runtime = "Enter the approximate runtime in minutes.";
  }
  if (v.format === "Web Series") {
    if (!positiveInt(v.episodes)) e.episodes = "Enter the number of episodes.";
    if (!positiveInt(v.episodeDuration)) e.episodeDuration = "Enter the approximate minutes per episode.";
  }

  if (!v.logline) e.logline = "Enter a logline.";
  else if (v.logline.length > LOGLINE_MAX) e.logline = `Keep the logline under ${LOGLINE_MAX} characters.`;

  if (!v.synopsis) e.synopsis = "Enter a synopsis.";
  else if (v.synopsis.length > SYNOPSIS_MAX) e.synopsis = `Keep the synopsis under ${SYNOPSIS_MAX} characters.`;

  if (!v.swaNumber) e.swaNumber = "Enter your SWA registration number.";

  for (const key of ["firstName", "lastName", "email", "phone", "title", "genreOther", "swaNumber"]) {
    if (!e[key] && (v[key] || "").length > SHORT_TEXT_MAX) e[key] = `Keep this under ${SHORT_TEXT_MAX} characters.`;
  }

  if (!DECLARATION_KEYS.every((key) => declarations[key] === true)) {
    e.declarations = "All declarations must be confirmed before submitting.";
  }

  return e;
}

// "My Script: Draft 2.pdf" -> "my-script-draft-2.pdf"
export function safeFileName(name = "file") {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return ext ? `${base}.${ext}` : base;
}
