import { decodeHtmlEntities, stripHtml } from "./html";

type ExtractExcerptOptions = {
  maxLength?: number;
  suffix?: string;
};

export const extractExcerpt = (
  html: string,
  options: ExtractExcerptOptions = {},
): string => {
  const maxLength = options.maxLength ?? 160;
  const suffix = options.suffix ?? "...";
  const text = decodeHtmlEntities(stripHtml(html))
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();

  return truncate(text, maxLength, suffix);
};

const truncate = (text: string, maxLength: number, suffix: string): string => {
  const characters = Array.from(text);

  if (characters.length <= maxLength) {
    return text;
  }

  if (maxLength <= suffix.length) {
    return characters.slice(0, maxLength).join("");
  }

  let endIndex = maxLength - suffix.length;

  while (
    endIndex < characters.length &&
    isAsciiWordCharacter(characters[endIndex - 1] ?? "") &&
    isAsciiWordCharacter(characters[endIndex] ?? "")
  ) {
    endIndex += 1;
  }

  return `${characters.slice(0, endIndex).join("").trimEnd()}${suffix}`;
};

const isAsciiWordCharacter = (character: string): boolean =>
  /^[A-Za-z0-9]$/.test(character);
