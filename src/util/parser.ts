export function cleanHtml(rawHtml: string): string {
  // Step 1: Remove CDATA wrapper
  let cleanedHtml = rawHtml.replace(/<!\[CDATA\[|\]\]>/g, "");

  // Step 2: Remove unnecessary comments
  cleanedHtml = cleanedHtml.replace(/<!--.*?-->/gs, "");

  // Step 3: Remove unwanted attributes (e.g., WordPress-specific JSON metadata)
  cleanedHtml = cleanedHtml.replace(
    /<(\w+)(\s+[^>]*?)\s*({.*?})\s*\/?>/g,
    "<$1$2>",
  );

  // Step 4: Clean up extra whitespace
  cleanedHtml = cleanedHtml.replace(/\s{2,}/g, " ");

  // Step 5: Optional - Trim around tags if needed
  cleanedHtml = cleanedHtml.trim();

  return cleanedHtml;
}
