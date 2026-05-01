import { addHeadingAnchors } from "./headingAnchors";
import { escapeHtml } from "./html";
import { sanitizeHtml } from "./sanitizeHtml";

export const renderMarkdown = (markdown: string): string =>
  addHeadingAnchors(sanitizeHtml(markdownToHtml(markdown)));

const markdownToHtml = (markdown: string): string => {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isBlank(line)) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const rendered = renderCodeBlock(lines, index);
      blocks.push(rendered.html);
      index = rendered.nextIndex;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push(
        `<h${heading[1].length}>${renderInline(heading[2].trim())}</h${heading[1].length}>`,
      );
      index += 1;
      continue;
    }

    if (/^ {0,3}(?:---+|\*\*\*+|___+)\s*$/.test(line)) {
      blocks.push("<hr>");
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const rendered = renderBlockquote(lines, index);
      blocks.push(rendered.html);
      index = rendered.nextIndex;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const rendered = renderList(lines, index, "ul", /^\s*[-*+]\s+(.+)$/);
      blocks.push(rendered.html);
      index = rendered.nextIndex;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const rendered = renderList(lines, index, "ol", /^\s*\d+\.\s+(.+)$/);
      blocks.push(rendered.html);
      index = rendered.nextIndex;
      continue;
    }

    if (isTableStart(lines, index)) {
      const rendered = renderTable(lines, index);
      blocks.push(rendered.html);
      index = rendered.nextIndex;
      continue;
    }

    const rendered = renderParagraph(lines, index);
    blocks.push(rendered.html);
    index = rendered.nextIndex;
  }

  return blocks.join("");
};

type RenderedBlock = {
  html: string;
  nextIndex: number;
};

const renderCodeBlock = (
  lines: string[],
  startIndex: number,
): RenderedBlock => {
  const opening = lines[startIndex];
  const language = opening.slice(3).trim();
  const code: string[] = [];
  let index = startIndex + 1;

  while (index < lines.length && !lines[index].startsWith("```")) {
    code.push(lines[index]);
    index += 1;
  }

  const className = /^[A-Za-z0-9_-]+$/.test(language)
    ? ` class="language-${language}"`
    : "";

  return {
    html: `<pre><code${className}>${escapeHtml(code.join("\n"))}</code></pre>`,
    nextIndex: index < lines.length ? index + 1 : index,
  };
};

const renderBlockquote = (
  lines: string[],
  startIndex: number,
): RenderedBlock => {
  const quoteLines: string[] = [];
  let index = startIndex;

  while (index < lines.length && /^>\s?/.test(lines[index])) {
    quoteLines.push(lines[index].replace(/^>\s?/, ""));
    index += 1;
  }

  return {
    html: `<blockquote><p>${renderInline(quoteLines.join(" "))}</p></blockquote>`,
    nextIndex: index,
  };
};

const renderList = (
  lines: string[],
  startIndex: number,
  tagName: "ol" | "ul",
  pattern: RegExp,
): RenderedBlock => {
  const items: string[] = [];
  let index = startIndex;
  let match = lines[index]?.match(pattern) ?? null;

  while (match) {
    items.push(`<li>${renderInline(match[1].trim())}</li>`);
    index += 1;
    match = lines[index]?.match(pattern) ?? null;
  }

  return {
    html: `<${tagName}>${items.join("")}</${tagName}>`,
    nextIndex: index,
  };
};

const renderParagraph = (
  lines: string[],
  startIndex: number,
): RenderedBlock => {
  const paragraphLines: string[] = [];
  let index = startIndex;

  while (
    index < lines.length &&
    !isBlank(lines[index]) &&
    !isBlockStart(lines, index)
  ) {
    paragraphLines.push(lines[index].trim());
    index += 1;
  }

  return {
    html: `<p>${renderInline(paragraphLines.join(" "))}</p>`,
    nextIndex: index,
  };
};

const isBlockStart = (lines: string[], index: number): boolean => {
  const line = lines[index];

  return (
    line.startsWith("```") ||
    /^(#{1,6})\s+/.test(line) ||
    /^>\s?/.test(line) ||
    /^\s*[-*+]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^ {0,3}(?:---+|\*\*\*+|___+)\s*$/.test(line) ||
    isTableStart(lines, index)
  );
};

const isTableStart = (lines: string[], index: number): boolean =>
  Boolean(
    lines[index]?.includes("|") &&
      lines[index + 1] &&
      /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(
        lines[index + 1],
      ),
  );

const renderTable = (lines: string[], startIndex: number): RenderedBlock => {
  const headerCells = splitTableRow(lines[startIndex]);
  const bodyRows: string[] = [];
  let index = startIndex + 2;

  while (
    index < lines.length &&
    lines[index].includes("|") &&
    !isBlank(lines[index])
  ) {
    const cells = splitTableRow(lines[index])
      .map((cell) => `<td>${renderInline(cell)}</td>`)
      .join("");
    bodyRows.push(`<tr>${cells}</tr>`);
    index += 1;
  }

  return {
    html: `<table><thead><tr>${headerCells
      .map((cell) => `<th>${renderInline(cell)}</th>`)
      .join("")}</tr></thead><tbody>${bodyRows.join("")}</tbody></table>`,
    nextIndex: index,
  };
};

const splitTableRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const renderInline = (value: string): string => {
  const safeText = escapeHtml(stripRawHtml(value));

  return safeText
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /!\[([^\]]*)]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
      (_match, alt, src) => `<img src="${src}" alt="${alt}">`,
    )
    .replace(
      /\[([^\]]+)]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
      (_match, text, href) => `<a href="${href}">${text}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
};

const stripRawHtml = (value: string): string => value.replace(/<[^>]+>/g, "");

const isBlank = (line: string): boolean => line.trim().length === 0;
