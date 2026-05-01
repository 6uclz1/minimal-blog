import { stripHtml } from "./html";

type ReadingTimeOptions = {
  japaneseCharsPerMinute?: number;
  wordsPerMinute?: number;
};

const cjkPattern =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const wordPattern = /[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g;

export const readingTime = (
  content: string,
  options: ReadingTimeOptions = {},
): number => {
  const wordsPerMinute = options.wordsPerMinute ?? 200;
  const japaneseCharsPerMinute = options.japaneseCharsPerMinute ?? 500;
  const text = stripMarkdown(stripHtml(content)).trim();

  if (!text) {
    return 0;
  }

  const cjkCharacterCount = text.match(cjkPattern)?.length ?? 0;
  const nonCjkText = text.replace(cjkPattern, " ");
  const wordCount = nonCjkText.match(wordPattern)?.length ?? 0;
  const minutes =
    wordCount / wordsPerMinute + cjkCharacterCount / japaneseCharsPerMinute;

  return Math.max(1, Math.ceil(minutes));
};

const stripMarkdown = (value: string): string =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_~>#-]/g, " ");
