const entityMap: Record<string, string> = {
  amp: "&",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

export const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const decodeHtmlEntities = (value: string): string =>
  value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, key: string) => {
    const normalizedKey = key.toLowerCase();

    if (normalizedKey.startsWith("#x")) {
      const codePoint = Number.parseInt(normalizedKey.slice(2), 16);
      return Number.isFinite(codePoint)
        ? String.fromCodePoint(codePoint)
        : entity;
    }

    if (normalizedKey.startsWith("#")) {
      const codePoint = Number.parseInt(normalizedKey.slice(1), 10);
      return Number.isFinite(codePoint)
        ? String.fromCodePoint(codePoint)
        : entity;
    }

    return entityMap[normalizedKey] ?? entity;
  });

export const stripHtml = (value: string): string =>
  value
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ");
