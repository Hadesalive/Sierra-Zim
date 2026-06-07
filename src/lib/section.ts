/**
 * Section background rhythm.
 *
 * Rules for the whole site:
 * - Neutral content sections alternate "white" → "tint" in document order so two
 *   identical neutrals never sit next to each other.
 * - Green ("forest") bands are deliberate punctuation only (marquee strip, the
 *   impact band, the footer). They are never placed adjacent to each other; a
 *   neutral section always sits between a green band and the footer.
 */
export type SectionTone = "white" | "tint";

export const sectionToneClass: Record<SectionTone, string> = {
  white: "bg-paper",
  tint: "bg-paper-2",
};
