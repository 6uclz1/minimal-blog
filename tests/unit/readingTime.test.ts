import { describe, expect, it } from "vitest";
import { readingTime } from "../../src/markdown/readingTime";

describe("readingTime", () => {
  it("returns at least one minute for non-empty content", () => {
    expect(readingTime("Short post.")).toBe(1);
  });

  it("counts English words deterministically", () => {
    const words = Array.from(
      { length: 240 },
      (_, index) => `word${index}`,
    ).join(" ");

    expect(readingTime(words, { wordsPerMinute: 120 })).toBe(2);
  });

  it("counts Japanese characters deterministically", () => {
    const text = "静的ブログ".repeat(120);

    expect(readingTime(text, { japaneseCharsPerMinute: 300 })).toBe(2);
  });
});
