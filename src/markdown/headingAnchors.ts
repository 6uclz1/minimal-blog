import { decodeHtmlEntities, stripHtml } from "./html";

export const addHeadingAnchors = (html: string): string => {
  const seenIds = new Map<string, number>();

  return html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, rawAttributes: string, content: string) => {
      const existingId = rawAttributes.match(
        /\sid=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i,
      );
      const baseId =
        existingId?.[1] ??
        existingId?.[2] ??
        existingId?.[3] ??
        slugify(content);
      const id = uniqueId(baseId, seenIds);
      const attributesWithoutId = rawAttributes.replace(
        /\s+id=(?:"[^"]+"|'[^']+'|[^\s>]+)/i,
        "",
      );

      return `<h${level}${attributesWithoutId} id="${id}">${content}<a class="heading-anchor" href="#${id}" aria-label="Link to section">#</a></h${level}>`;
    },
  );
};

const slugify = (html: string): string => {
  const text = decodeHtmlEntities(stripHtml(html)).trim().toLowerCase();
  const slug = Array.from(text)
    .map((character) => {
      if (/[\p{Letter}\p{Number}]/u.test(character)) {
        return character;
      }

      return "-";
    })
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "section";
};

const uniqueId = (baseId: string, seenIds: Map<string, number>): string => {
  const count = seenIds.get(baseId) ?? 0;
  seenIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
};
