/**
 * Static site config that is NOT content-managed.
 *
 * All editable content (site settings, pages, programmes, sectors, case studies,
 * clients, FAQs, value props, gallery) now lives in Payload and is read through
 * `@/lib/content`. What remains here is structural: the canonical URL, the
 * primary navigation (which maps to fixed app routes), and the shared gallery
 * item types.
 */

export const SITE_URL = "https://www.sierrazim.com";

/**
 * Countries SierraZim has delivered training in: Sierra Leone, Mozambique and
 * Côte d'Ivoire.
 *
 * This is deliberately NOT derived. Nothing in the CMS models a country: the
 * only country-ish data is Case Studies `location` (which covers just Sierra
 * Leone and Mozambique — deriving from it would render "two") and About
 * `locations[].place` (a mix of towns, sites and countries). Rather than derive
 * a wrong number, the count lives here as one named constant, used by the home
 * hero, the About stats and the Portfolio "all records" line. Update it here
 * when a new country is added.
 */
export const COUNTRIES_SERVED = 3;

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

/**
 * Spell a small count as a capitalised word ("Seven"), falling back to the
 * digits for anything outside one..twelve. Used by headings that read as a
 * sentence ("Seven programmes.") but must follow the real data.
 */
export function numberToWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

/**
 * Split one CMS heading string across the two lines of a v2 two-tone heading
 * (plain line + accent span): at the first comma when there is one, otherwise
 * before the last word. Returns ["", ""] for empty input so callers can fall
 * back to their hardcoded copy.
 */
export function splitAccentHeading(s: string): [string, string] {
  const text = s.trim();
  if (!text) return ["", ""];
  const comma = text.indexOf(",");
  if (comma > 0 && comma < text.length - 1) {
    return [text.slice(0, comma + 1), text.slice(comma + 1).trim()];
  }
  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace <= 0) return [text, ""];
  return [text.slice(0, lastSpace), text.slice(lastSpace + 1)];
}

export type NavItem = { label: string; href: string };

// Labels follow the v2 "safety-yard" redesign (Training / Work); routes are kept
// as the original app paths (/services, /portfolio) for SEO stability.
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Training", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/** Gallery filter categories (mirrors the `category` select in the Gallery collection). */
export type GalleryCategory =
  | "classroom"
  | "light-vehicle"
  | "heavy-equipment"
  | "simulator"
  | "certification"
  | "projects"
  | "testimonials";

export type GalleryImage = {
  type?: "image";
  src: string;
  alt: string;
  caption: string;
  category?: GalleryCategory;
  w: number;
  h: number;
};

export type GalleryVideoItem = {
  type: "video";
  /** "file" → self-hosted mp4 in /public; "youtube" | "vimeo" → embed by id. */
  provider: "file" | "youtube" | "vimeo";
  /** provider "file": video path (e.g. "/gallery/clip.mp4"); otherwise the video id. */
  src: string;
  /** Poster image shown before play, and used to reserve layout space. */
  poster: string;
  alt: string;
  caption: string;
  category?: GalleryCategory;
  w: number;
  h: number;
};

export type GalleryItem = GalleryImage | GalleryVideoItem;
