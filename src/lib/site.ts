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

export type GalleryImage = {
  type?: "image";
  src: string;
  alt: string;
  caption: string;
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
  w: number;
  h: number;
};

export type GalleryItem = GalleryImage | GalleryVideoItem;
