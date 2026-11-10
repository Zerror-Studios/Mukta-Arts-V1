// Switches the Reports tab's Board Meetings section to the year folders: the section (a plain list of PDFs) becomes
// the Board Meetings placeholder, in the same place in the tab, and the website shows the Notice, Outcome and
// Financial Results – Newspaper year folders (Investor Relations → Board Meetings in the studio).
//
// Two steps, because the live site may still run code from before the folders:
//   1. --write                    switches, but leaves the old list inside the section. Code from before the folders
//                                 keeps showing that list, the new code shows the folders. Safe at any time.
//   2. --write --remove-old-list  once the new code is live, removes that leftover list (its PDFs are already in
//                                 the 2026-27 folders).
// Run from the project root, logged in to the Sanity CLI as a member of the project (--with-user-token), or with an
// Editor token in SANITY_API_WRITE_TOKEN and no --with-user-token. Without --write it only prints what it would do:
//   npx sanity exec scripts/board-meetings-folders.mjs --with-user-token
//   npx sanity exec scripts/board-meetings-folders.mjs --with-user-token -- --write
//   npx sanity exec scripts/board-meetings-folders.mjs --with-user-token -- --write --remove-old-list
// An open draft of the Reports tab gets the same change, so publishing it later can't undo this.
import { getCliClient } from "sanity/cli";

const token = process.env.SANITY_API_WRITE_TOKEN;
const client = getCliClient({ apiVersion: "2026-10-26", ...(token && { token }) });
const write = process.argv.includes("--write");
const removeOldList = process.argv.includes("--remove-old-list");

const TAB = "investorCategory-reports";
const SECTION = "Board Meetings";

const folders = await client.fetch(`count(*[_type == "boardMeetingYear" && !(_id in path("drafts.**"))])`);
if (!folders) throw new Error("There are no Board Meetings year folders yet, so the section would be empty. Nothing was changed.");

const tabs = await client.fetch(`*[_id in [$id, "drafts." + $id]]`, { id: TAB });
let changes = 0;
const transaction = client.transaction();

for (const tab of tabs) {
  const label = tab._id.startsWith("drafts.") ? "Reports tab draft" : "Reports tab";
  const section = tab.sections?.find((s) => s.title === SECTION);
  if (!section) throw new Error(`${label} has no "${SECTION}" section.`);

  const switched = section._type === "investorBoardMeetings";
  const hasOldList = Boolean(section.documents);
  if (switched && !(removeOldList && hasOldList)) {
    console.log(`${label}: ${SECTION} already shows the ${folders} year folders${hasOldList ? " (old list still inside)" : ""}.`);
    continue;
  }

  // Same key and place in the tab, so nothing else in it moves
  const updated = { _key: section._key, _type: "investorBoardMeetings", title: section.title };
  if (hasOldList && !removeOldList) updated.documents = section.documents;
  console.log(
    switched
      ? `${label}: removes the old list (${section.documents.length} PDFs) left inside ${SECTION}`
      : `${label}: ${SECTION} switches to the ${folders} year folders` +
          (updated.documents ? `, keeping its old list (${updated.documents.length} PDFs) for code from before them` : "")
  );
  // ifRevisionId: stops if someone saves the tab in the studio in the meantime, rather than overwrite their edit
  transaction.patch(tab._id, (patch) =>
    patch.ifRevisionId(tab._rev).set({ sections: tab.sections.map((s) => (s._key === section._key ? updated : s)) })
  );
  changes++;
}

if (!changes) process.exit(0);
if (!write) {
  console.log("\nNothing written. Run again with -- --write to save this.");
} else {
  await transaction.commit();
  console.log("\nSaved.");
}
