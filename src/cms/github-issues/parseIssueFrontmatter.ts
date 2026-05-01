export type IssueFrontmatter = {
  canonicalUrl?: string;
  description?: string;
  ogImage?: string;
  publishedAt?: string;
  slug?: string;
};

export type ParsedIssueFrontmatter = {
  bodyMarkdown: string;
  frontmatter: IssueFrontmatter;
};

const allowedKeys = new Set<keyof IssueFrontmatter>([
  "canonicalUrl",
  "description",
  "ogImage",
  "publishedAt",
  "slug",
]);

export const parseIssueFrontmatter = (body: string): ParsedIssueFrontmatter => {
  const normalizedBody = body.replace(/\r\n?/g, "\n");

  if (!normalizedBody.startsWith("---\n")) {
    return {
      bodyMarkdown: normalizedBody,
      frontmatter: {},
    };
  }

  const lines = normalizedBody.split("\n");
  const closingIndex = lines.findIndex(
    (line, index) => index > 0 && line === "---",
  );

  if (closingIndex === -1) {
    throw new Error("Issue frontmatter is missing a closing delimiter");
  }

  const frontmatter: IssueFrontmatter = {};

  for (const line of lines.slice(1, closingIndex)) {
    if (!line.trim()) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error(`Malformed issue frontmatter line: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim());

    if (allowedKeys.has(key as keyof IssueFrontmatter) && value) {
      frontmatter[key as keyof IssueFrontmatter] = value;
    }
  }

  return {
    bodyMarkdown: lines
      .slice(closingIndex + 1)
      .join("\n")
      .trimStart(),
    frontmatter,
  };
};

const stripWrappingQuotes = (value: string): string => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};
