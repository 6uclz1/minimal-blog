import { describe, expect, it } from "vitest";
import { extractExcerpt } from "../../src/markdown/extractExcerpt";

describe("extractExcerpt", () => {
  it("strips HTML tags and normalizes whitespace", () => {
    const html =
      "<article><h1>Title</h1><p>Hello   <strong>world</strong>.</p></article>";

    expect(extractExcerpt(html, { maxLength: 80 })).toBe("Title Hello world.");
  });

  it("decodes common HTML entities", () => {
    const html = "<p>GitHub Issues &amp; Hono &lt;static&gt;</p>";

    expect(extractExcerpt(html, { maxLength: 80 })).toBe(
      "GitHub Issues & Hono <static>",
    );
  });

  it("supports Japanese text and truncates by character length", () => {
    const html = "<p>これはGitHub IssuesをCMSとして使う静的ブログです。</p>";

    expect(extractExcerpt(html, { maxLength: 18 })).toBe(
      "これはGitHub Issues...",
    );
  });
});
