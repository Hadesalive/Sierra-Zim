/**
 * Renders a JSON-LD structured-data script. Safe for Server Components.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static and author-controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
