// Runs every old-site URL in legacy-redirects-test.csv through legacyDestination() (the rules the
// proxy uses) and checks it against the expected result. Not shipped; run with:
//   npm run test:redirects
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { legacyDestination } from "../src/lib/seo/legacy-redirects.js";

const csvPath = fileURLToPath(new URL("./legacy-redirects-test.csv", import.meta.url));

// Quoted CSV: fields may contain commas, "" is an escaped quote
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0]);
}

const [, ...rows] = parseCsv(readFileSync(csvPath, "utf8"));
const failures = [];
for (const [url, expected] of rows) {
  const dest = legacyDestination(url);
  const actual = dest === 410 ? "410 Gone" : dest === null ? "not redirected" : `301 -> ${dest}`;
  if (actual !== expected) failures.push({ url, expected, actual });
}

// New routes and assets must never be redirected
const untouched = [
  "/", "/about", "/subhash-ghai", "/our-films", "/whistling-woods", "/mukta-a2-cinemas", "/sgm-studios",
  "/submit-script", "/contact", "/api/script-submission", "/img/logo/logo-4k.png", "/fonts/Switzer-Regular.woff2",
  "/model/x.glb", "/investor-relations/report.pdf", "/video/x.mp4", "/robots.txt", "/sitemap.xml", "/llms.txt",
  "/manifest.webmanifest",
];
for (const url of untouched) {
  const dest = legacyDestination(url);
  if (dest !== null) failures.push({ url, expected: "not redirected", actual: String(dest) });
}

console.log(`${rows.length} legacy URLs + ${untouched.length} new URLs checked, ${failures.length} failed`);
for (const f of failures.slice(0, 50)) console.log(`  ${f.url}\n    expected ${f.expected}, got ${f.actual}`);
process.exit(failures.length ? 1 : 0);
