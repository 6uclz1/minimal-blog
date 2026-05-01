import { decodeHtmlEntities, escapeHtml } from "./html";

const allowedTags = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
]);

const voidTags = new Set(["br", "hr", "img"]);
const dangerousContentTags = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "svg",
  "math",
  "template",
];

const allowedAttributes: Record<string, Set<string>> = {
  a: new Set(["href", "rel", "target", "title"]),
  code: new Set(["class"]),
  h1: new Set(["id"]),
  h2: new Set(["id"]),
  h3: new Set(["id"]),
  h4: new Set(["id"]),
  h5: new Set(["id"]),
  h6: new Set(["id"]),
  img: new Set(["alt", "height", "loading", "src", "title", "width"]),
};

type Attribute = {
  name: string;
  value: string;
};

export const sanitizeHtml = (html: string): string => {
  const withoutDangerousContent = removeDangerousContent(html);

  return withoutDangerousContent.replace(
    /<\/?([a-zA-Z][\w:-]*)([^>]*)>/g,
    (tag, rawName: string, rawAttributes: string) => {
      const name = rawName.toLowerCase();
      const isClosingTag = tag.startsWith("</");

      if (!allowedTags.has(name)) {
        return "";
      }

      if (isClosingTag) {
        return voidTags.has(name) ? "" : `</${name}>`;
      }

      const attributes = sanitizeAttributes(
        name,
        parseAttributes(rawAttributes),
      );
      const attributeText = attributes
        .map(
          (attribute) => `${attribute.name}="${escapeHtml(attribute.value)}"`,
        )
        .join(" ");
      const suffix = attributeText ? ` ${attributeText}` : "";

      return `<${name}${suffix}>`;
    },
  );
};

const removeDangerousContent = (html: string): string => {
  let sanitized = html;

  for (const tag of dangerousContentTags) {
    sanitized = sanitized.replace(
      new RegExp(`<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`, "gi"),
      "",
    );
    sanitized = sanitized.replace(
      new RegExp(`<\\s*${tag}\\b[^>]*\\/?>`, "gi"),
      "",
    );
  }

  return sanitized.replace(/<!--[\s\S]*?-->/g, "");
};

const parseAttributes = (rawAttributes: string): Attribute[] => {
  const attributes: Attribute[] = [];
  const attributePattern =
    /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match = attributePattern.exec(rawAttributes);

  while (match) {
    attributes.push({
      name: match[1].toLowerCase(),
      value: match[2] ?? match[3] ?? match[4] ?? "",
    });
    match = attributePattern.exec(rawAttributes);
  }

  return attributes;
};

const sanitizeAttributes = (
  tagName: string,
  attributes: Attribute[],
): Attribute[] => {
  const allowed = allowedAttributes[tagName] ?? new Set<string>();
  const sanitized: Attribute[] = [];
  let hasBlankTarget = false;
  let relValue = "";

  for (const attribute of attributes) {
    if (attribute.name.startsWith("on") || !allowed.has(attribute.name)) {
      continue;
    }

    if (isUrlAttribute(attribute.name) && !isSafeUrl(attribute.value)) {
      continue;
    }

    if (tagName === "code" && attribute.name === "class") {
      if (!/^language-[\w-]+$/.test(attribute.value)) {
        continue;
      }
    }

    if (attribute.name === "target" && attribute.value === "_blank") {
      hasBlankTarget = true;
    }

    if (attribute.name === "rel") {
      relValue = attribute.value;
    }

    sanitized.push(attribute);
  }

  if (tagName === "a" && hasBlankTarget) {
    const relTokens = new Set(relValue.split(/\s+/).filter(Boolean));
    relTokens.add("noopener");
    relTokens.add("noreferrer");
    const rel = [...relTokens].join(" ");
    const existingRel = sanitized.find((attribute) => attribute.name === "rel");

    if (existingRel) {
      existingRel.value = rel;
    } else {
      sanitized.push({ name: "rel", value: rel });
    }
  }

  return sanitized;
};

const isUrlAttribute = (name: string): boolean =>
  name === "href" || name === "src";

const isSafeUrl = (url: string): boolean => {
  const decodedUrl = Array.from(decodeHtmlEntities(url).trim())
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;

      return codePoint > 0x20 && codePoint !== 0x7f && character.trim() !== "";
    })
    .join("");

  if (!decodedUrl) {
    return false;
  }

  if (/^(https?:|mailto:|tel:|\/|#|\.\/|\.\.\/)/i.test(decodedUrl)) {
    return true;
  }

  return !/^[a-z][a-z\d+.-]*:/i.test(decodedUrl);
};
