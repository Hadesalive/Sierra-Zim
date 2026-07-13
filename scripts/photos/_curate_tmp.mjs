// TEMPORARY curation script — deleted before commit.
import fs from "node:fs";
import path from "node:path";

const P = path.join(process.cwd(), "src/content/media-manifest.json");
const manifest = JSON.parse(fs.readFileSync(P, "utf8"));
const orig = new Map(manifest.assignments.gallery.map((g) => [g.file, g]));

// Ordered keep list, grouped by category in the required sequence.
// Each: [file, category, captionOverride?, altOverride?]
const KEEP = [
  // classroom
  ["programme/theory-and-classroom-training-05.jpg", "classroom"],
  ["programme/theory-and-classroom-training-09.jpg", "classroom"],
  ["programme/theory-and-classroom-training-10.jpg", "classroom"],
  ["programme/theory-and-classroom-training-01.jpg", "classroom"],
  ["programme/theory-and-classroom-training-02.jpg", "classroom"],
  // light-vehicle
  ["programme/light-vehicle-defensive-driving-06.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-05.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-04.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-03.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-07.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-17.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-15.jpg", "light-vehicle"],
  ["programme/light-vehicle-defensive-driving-11.jpg", "light-vehicle"],
  ["gallery/students-18.jpg", "light-vehicle",
    "SierraZim training team on site",
    "A SierraZim training team in branded shirts beside a pickup"],
  // heavy-equipment
  ["programme/surface-mobile-equipment-training-08.jpg", "heavy-equipment"],
  ["programme/surface-mobile-equipment-training-10.jpg", "heavy-equipment"],
  ["programme/surface-mobile-equipment-training-03.jpg", "heavy-equipment"],
  ["programme/surface-mobile-equipment-training-04.jpg", "heavy-equipment"],
  ["programme/surface-mobile-equipment-training-12.jpg", "heavy-equipment"],
  ["programme/heavy-vehicle-defensive-driving-01.jpg", "heavy-equipment"],
  ["programme/agriculture-equipment-training-05.jpg", "heavy-equipment"],
  ["programme/agriculture-equipment-training-11.jpg", "heavy-equipment"],
  // simulator
  ["programme/simulator-training-21.jpg", "simulator"],
  ["programme/simulator-training-01.jpg", "simulator"],
  ["programme/simulator-training-05.jpg", "simulator"],
  ["programme/simulator-training-12.jpg", "simulator"],
  ["programme/simulator-training-08.jpg", "simulator"],
  ["programme/simulator-training-17.jpg", "simulator"],
  // certification
  ["gallery/certification-08.jpg", "certification"],
  ["gallery/certification-05.jpg", "certification"],
  ["gallery/certification-06.jpg", "certification"],
  ["gallery/certification-10.jpg", "certification"],
  ["gallery/certification-09.jpg", "certification"],
  ["gallery/certification-13.jpg", "certification"],
  ["programme/pre-employment-screening-03.jpg", "certification",
    "Graduating cohort in SierraZim colours",
    "A SierraZim training cohort in matching branded shirts"],
  // projects
  ["gallery/bam-natull-01.jpg", "projects"],
  ["gallery/bam-natull-03.jpg", "projects"],
  ["gallery/bam-natull-10.jpg", "projects"],
  ["gallery/bam-natull-02.jpg", "projects"],
  ["programme/theory-and-classroom-training-37.jpg", "projects",
    "On-site operator coaching at a client mine",
    "A SierraZim trainer coaching an operator trainee at a mine site"],
  ["programme/surface-mobile-equipment-training-02.jpg", "projects",
    "On-site safety briefing with trainees",
    "Trainees in PPE during an on-site safety briefing at a mine"],
  ["programme/theory-and-classroom-training-35.jpg", "projects",
    "On-site tractor operator assessment",
    "A SierraZim trainer assessing a tractor operator trainee in the field"],
  ["gallery/sembehun-opening-01.jpg", "projects"],
  ["gallery/sembehun-opening-02.jpg", "projects"],
  ["gallery/certification-01.jpg", "projects",
    "SierraZim trainer with a Sierra Rutile partner",
    "A SierraZim trainer and a Sierra Rutile Limited colleague on site"],
];

const newGallery = KEEP.map(([file, category, caption, alt], i) => {
  const src = orig.get(file);
  if (!src) throw new Error("keep file not found in original gallery: " + file);
  return {
    file,
    caption: caption ?? src.caption,
    alt: alt ?? src.alt,
    category,
    order: i,
  };
});

// sanity: no dupes
const seen = new Set();
for (const g of newGallery) {
  if (seen.has(g.file)) throw new Error("dup: " + g.file);
  seen.add(g.file);
}

manifest.assignments.gallery = newGallery;
fs.writeFileSync(P, JSON.stringify(manifest, null, 2) + "\n");

const byCat = {};
for (const g of newGallery) byCat[g.category] = (byCat[g.category] || 0) + 1;
console.log("kept:", newGallery.length);
console.log("per category:", JSON.stringify(byCat, null, 2));
