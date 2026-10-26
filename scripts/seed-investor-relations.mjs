// One-time import of the Investor Relations section that used to be hard-coded (src/data/investorRelations.js,
// the files in public/investor-relations/ and the contact details in InvestorRelations.jsx) into Sanity.
// Run from the project root, logged in to the Sanity CLI:
//   npx sanity exec scripts/seed-investor-relations.mjs --with-user-token
// Safe to run again: each tab has a fixed id (investorCategory-<id>) and the contact details are the one
// investorRelations document, so a rerun overwrites them instead of adding duplicates, and Sanity
// recognises a file it already has and does not store it twice.
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { investorCategories, unclaimedDividend } from "../src/data/investorRelations.js";

const client = getCliClient({ apiVersion: "2026-10-26" });

// Every item in a Sanity array needs a key unique within that array
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// "26.09.2025" -> "2025-09-26", as a Sanity date field stores it
const isoDate = (date) => date.split(".").reverse().join("-");

// A few files are listed in more than one place; each is uploaded once
const assets = new Map();
let uploaded = 0;

const upload = async (href) => {
  if (!assets.has(href)) {
    const file = path.join("public", decodeURIComponent(href));
    const asset = await client.assets.upload("file", await readFile(file), {
      filename: path.basename(file),
    });
    assets.set(href, asset._id);
    console.log(`  ✓ ${++uploaded} ${path.basename(file)}`);
  }
  return assets.get(href);
};

const toDocuments = async (docs) => {
  const items = [];
  for (const doc of docs) {
    const item = {
      _key: key(),
      _type: "investorDocument",
      title: doc.title,
      file: { _type: "file", asset: { _type: "reference", _ref: await upload(doc.href) } },
    };
    if (doc.date) item.date = isoDate(doc.date);
    items.push(item);
  }
  return items;
};

for (const [index, category] of investorCategories.entries()) {
  console.log(`${category.title}`);
  const sections = [];
  for (const section of category.sections) {
    const item = { _key: key(), _type: "investorSection", byYear: Boolean(section.years) };
    if (section.title) item.title = section.title;
    if (section.years) {
      item.years = [];
      for (const year of section.years) {
        item.years.push({ _key: key(), _type: "investorYear", title: year.title, documents: await toDocuments(year.docs) });
      }
    } else {
      item.documents = await toDocuments(section.docs);
    }
    sections.push(item);
  }

  const doc = {
    _id: `investorCategory-${category.id}`,
    _type: "investorCategory",
    title: category.title,
    order: index + 1,
    sections,
  };
  if (category.intro) doc.intro = category.intro;
  await client.createOrReplace(doc);
}

console.log("Contact & Unclaimed Dividend");
await client.createOrReplace({
  _id: "investorRelations",
  _type: "investorRelations",
  contactName: "Ms. Pratiksha Panchal",
  contactRole: "Company Secretary and Compliance Officer",
  contactPhone: "Board line — 3364 9400",
  contactEmail: "investorrelations@muktaarts.com",
  unclaimedDividend: {
    title: unclaimedDividend.title,
    intro: unclaimedDividend.intro,
    link: unclaimedDividend.introLink,
    documents: await toDocuments(unclaimedDividend.docs),
  },
});

console.log(`\nDone: ${investorCategories.length} tabs and ${uploaded} files in Sanity.`);
