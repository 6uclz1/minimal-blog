import type { OgImageDescriptor } from "./paths";
import { ogImageHeight, ogImageWidth } from "./paths";

const titleLineLength = 22;

export const createOgImageSvg = (descriptor: OgImageDescriptor): string => {
  const titleLines = wrapText(descriptor.title, titleLineLength, 3);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ogImageWidth}" height="${ogImageHeight}" viewBox="0 0 ${ogImageWidth} ${ogImageHeight}">
  <defs>
    <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.25" fill="#f4f4f1" opacity="0.34"/>
    </pattern>
    <linearGradient id="edge-fade" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f4f4f1" stop-opacity="0.1"/>
      <stop offset="0.52" stop-color="#f4f4f1" stop-opacity="0"/>
      <stop offset="1" stop-color="#f4f4f1" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#09090b"/>
  <rect width="1200" height="630" fill="url(#dot-grid)"/>
  <rect width="1200" height="630" fill="url(#edge-fade)"/>
  <text x="96" y="126" fill="#f4f4f1" font-family="Noto Sans CJK JP, Noto Sans JP, system-ui, sans-serif" font-size="30" font-weight="600" letter-spacing="3">${escapeSvgText(descriptor.siteTitle)}</text>
  <text x="96" y="292" fill="#f4f4f1" font-family="Noto Sans CJK JP, Noto Sans JP, system-ui, sans-serif" font-size="72" font-weight="700">
${titleLines
  .map(
    (line, index) =>
      `    <tspan x="96" dy="${index === 0 ? 0 : 86}">${escapeSvgText(line)}</tspan>`,
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
