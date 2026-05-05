import type { OgImageDescriptor } from "./paths";
import { ogImageHeight, ogImageWidth } from "./paths";

const titleLineLength = 22;
const descriptionLineLength = 42;

export const createOgImageSvg = (descriptor: OgImageDescriptor): string => {
  const titleLines = wrapText(descriptor.title, titleLineLength, 3);
  const descriptionLines = wrapText(
    descriptor.description,
    descriptionLineLength,
    2,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ogImageWidth}" height="${ogImageHeight}" viewBox="0 0 ${ogImageWidth} ${ogImageHeight}">
  <rect width="1200" height="630" fill="#f4f4f1"/>
  <rect x="56" y="56" width="1088" height="518" rx="0" fill="#09090b"/>
  <path d="M56 438 C214 350 336 532 498 454 C654 379 734 216 895 278 C1014 324 1069 245 1144 188 L1144 574 L56 574 Z" fill="#d8ff6f" opacity="0.95"/>
  <path d="M56 504 C236 423 355 609 548 526 C720 452 804 322 968 358 C1056 377 1105 336 1144 304 L1144 574 L56 574 Z" fill="#ff5a3d" opacity="0.78"/>
  <text x="104" y="132" fill="#f4f4f1" font-family="Noto Sans CJK JP, Noto Sans JP, system-ui, sans-serif" font-size="30" font-weight="600">${escapeSvgText(descriptor.siteTitle)}</text>
  <text x="104" y="264" fill="#f4f4f1" font-family="Noto Sans CJK JP, Noto Sans JP, system-ui, sans-serif" font-size="70" font-weight="700">
${titleLines
  .map(
    (line, index) =>
      `    <tspan x="104" dy="${index === 0 ? 0 : 82}">${escapeSvgText(line)}</tspan>`,
  )
  .join("\n")}
  </text>
  <text x="104" y="486" fill="#09090b" font-family="Noto Sans CJK JP, Noto Sans JP, system-ui, sans-serif" font-size="34" font-weight="600">
${descriptionLines
  .map(
    (line, index) =>
      `    <tspan x="104" dy="${index === 0 ? 0 : 44}">${escapeSvgText(line)}</tspan>`,
  )
  .join("\n")}
  </text>
</svg>`;
};

const wrapText = (value: string, maxLineLength: number, maxLines: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  const tokens = normalized.includes(" ")
    ? normalized.split(" ")
    : Array.from(normalized);
  const lines: string[] = [];
  let currentLine = "";

  for (const token of tokens) {
    const separator = normalized.includes(" ") && currentLine ? " " : "";
    const nextLine = `${currentLine}${separator}${token}`;

    if (nextLine.length > maxLineLength && currentLine) {
      lines.push(currentLine);
      currentLine = token;
    } else {
      currentLine = nextLine;
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return [""];
  }

  const usedText = lines.join(normalized.includes(" ") ? " " : "");
  if (usedText.length < normalized.length) {
    const lastLine = lines.at(-1) ?? "";
    lines[lines.length - 1] = `${lastLine.replace(/.{1,3}$/, "")}...`;
  }

  return lines;
};

const escapeSvgText = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
