// scripts/photos/config.mjs
// Pure data + helpers describing how the archive maps into the site.
// No side effects — safe to import from anywhere.

export const ARCHIVE_ENV = "PHOTO_ARCHIVE_DIR";

export const IMAGE_EXT = /\.(jpe?g|png)$/i;
export const VIDEO_EXT = /\.mp4$/i;

/** Never migrated: Office docs, phone screenshots, dotfiles. */
export const SKIP_FILE = (name) =>
  /\.docx$/i.test(name) || /^Screenshot[_-]/i.test(name) || name.startsWith(".");

export const slugify = (s) =>
  String(s).toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Source folder (exact archive folder name) → placement.
 *  - category: output subdir under media-staging/ (programme|sector|case-study|gallery|team|video)
 *  - target:   collection slug / area key the seed wires this to
 *  - label:    default caption/alt seed for images from this folder
 *  - featured: (optional) marks the client's curated web picks
 * A folder not listed falls through to the general gallery.
 *
 * NOTE: three folders need a visual confirmation during curation (Task 4) —
 * marked `// verify`. Adjust target after viewing.
 */
export const FOLDER_MAP = {
  "Light Vehicle Training":              { category: "programme", target: "light-vehicle-defensive-driving", label: "Light vehicle defensive-driving training" },
  "Heavy Duty Training":                 { category: "programme", target: "heavy-vehicle-defensive-driving", label: "Heavy vehicle defensive-driving training" }, // verify: heavy-vehicle vs surface equipment
  "Simulator Training":                  { category: "programme", target: "simulator-training", label: "Driving simulator training" },
  "Classroom Training":                  { category: "programme", target: "theory-and-classroom-training", label: "Classroom and theory training" },
  "Orial Coaching":                      { category: "programme", target: "theory-and-classroom-training", label: "Oral coaching session" },
  "On The Job Training":                 { category: "programme", target: "theory-and-classroom-training", label: "On-the-job training" },
  "Excavator Training":                  { category: "programme", target: "surface-mobile-equipment-training", label: "Excavator operator training" },
  "Grader Training":                     { category: "programme", target: "surface-mobile-equipment-training", label: "Grader operator training" },
  "FEL TRAINING":                        { category: "programme", target: "surface-mobile-equipment-training", label: "Front-end loader operator training" },
  "ADT Training":                        { category: "programme", target: "surface-mobile-equipment-training", label: "Articulated dump truck training" },
  "Tractor Training":                    { category: "programme", target: "agriculture-equipment-training", label: "Tractor and agriculture equipment training" },
  "Certification":                       { category: "programme", target: "pre-employment-screening", label: "Operator assessment and certification" }, // verify
  "Sierrazim Certification":             { category: "gallery",   target: "certification", label: "Operator certification ceremony" },
  "Sierrazim Certificates":              { category: "gallery",   target: "certification", label: "Certificates awarded to graduates" },

  "Mantrac":                             { category: "case-study", target: "mantrac", label: "Mantrac operator training" },
  "Sierrazim Launching Ceremony Rutile": { category: "case-study", target: "sierra-rutile", label: "Sierra Rutile programme launch" },

  "Bam Natull":                          { category: "gallery", target: "bam-natull", label: "BAM Natull operator training" },
  "Sembehun Official Opening":           { category: "gallery", target: "sembehun-opening", label: "Sembehun academy official opening" },
  "Sierrazim Mano Certication Ceremony": { category: "gallery", target: "mano", label: "Mano certification ceremony" },

  "Students Gallery":                    { category: "gallery", target: "students", label: "Trainees during a SierraZim programme" },
  "sierrazim Gallery":                   { category: "gallery", target: "general", label: "SierraZim training" },
  "Sierrazim Web Selection Photos":      { category: "gallery", target: "web-selection", label: "SierraZim training", featured: true },

  "Sierrazim Team":                      { category: "team",  target: "team", label: "The SierraZim team" },
  "Sierrazim Testimony":                 { category: "video", target: "testimony", label: "Client testimonial" },
};

/** Loose top-level files → placement, matched by filename. First match wins. */
export const LOOSE_FILE_RULES = [
  { test: /dadtco/i,               category: "case-study", target: "dadtco-mozambique", label: "DADTCO Mozambique training" },
  { test: /ivory|d.?ivoire|ddc/i,  category: "gallery",    target: "cote-divoire",     label: "Côte d'Ivoire training programme" },
  { test: /marie\s*stopes/i,       category: "gallery",    target: "marie-stopes",     label: "Marie Stopes driver training" },
  { test: /bam|natull/i,           category: "gallery",    target: "bam-natull",       label: "BAM Natull operator training" },
];
