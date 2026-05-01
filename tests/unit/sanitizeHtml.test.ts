import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "../../src/markdown/sanitizeHtml";

describe("sanitizeHtml", () => {
  it("removes script tags and their contents", () => {
    const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>';

    expect(sanitizeHtml(html)).toBe("<p>Hello</p><p>World</p>");
  });

  it("removes event handler attributes and dangerous URLs", () => {
    const html =
      '<p><img src="javascript:alert(1)" onerror="alert(1)" alt="bad"></p><a href="javascript:alert(1)" onclick="alert(1)">link</a>';

    expect(sanitizeHtml(html)).toBe('<p><img alt="bad"></p><a>link</a>');
  });

  it("removes disallowed inline HTML while preserving safe text", () => {
    const html =
      '<p>Safe <span style="color:red">text</span></p><iframe src="/x"></iframe>';

    expect(sanitizeHtml(html)).toBe("<p>Safe text</p>");
  });

  it("keeps allowed block and code tags", () => {
    const html =
      "<blockquote><p>Quote</p></blockquote><pre><code>const value = 1;</code></pre><hr>";

    expect(sanitizeHtml(html)).toBe(html);
  });

  it('adds noopener noreferrer to target="_blank" links', () => {
    const html = '<a href="https://github.com" target="_blank">GitHub</a>';

    expect(sanitizeHtml(html)).toBe(
      '<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>',
    );
  });
});
