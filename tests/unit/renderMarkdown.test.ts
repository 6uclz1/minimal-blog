import { describe, expect, it } from "vitest";
import { addHeadingAnchors } from "../../src/markdown/headingAnchors";
import { renderMarkdown } from "../../src/markdown/renderMarkdown";

describe("renderMarkdown", () => {
  it("renders headings, paragraphs, emphasis, links, and lists", () => {
    const markdown = [
      "# Hello Hono",
      "",
      "A **small** static [site](/posts/) generator.",
      "",
      "- Fast",
      "- Typed",
    ].join("\n");

    expect(renderMarkdown(markdown)).toContain(
      '<h1 id="hello-hono">Hello Hono<a class="heading-anchor" href="#hello-hono" aria-label="Link to section">#</a></h1>',
    );
    expect(renderMarkdown(markdown)).toContain(
      '<p>A <strong>small</strong> static <a href="/posts/">site</a> generator.</p>',
    );
    expect(renderMarkdown(markdown)).toContain(
      "<ul><li>Fast</li><li>Typed</li></ul>",
    );
  });

  it("renders fenced code blocks with escaped code", () => {
    const markdown = ["```ts", "const value = '<script>';", "```"].join("\n");

    expect(renderMarkdown(markdown)).toContain(
      '<pre><code class="language-ts">const value = &#39;&lt;script&gt;&#39;;</code></pre>',
    );
  });

  it("does not pass raw dangerous HTML through as executable markup", () => {
    const html = renderMarkdown('<img src=x onerror="alert(1)">');

    expect(html).not.toContain("<img");
    expect(html).not.toContain("onerror");
  });
});

describe("addHeadingAnchors", () => {
  it("adds stable unique heading ids", () => {
    const html = "<h2>Intro</h2><h2>Intro</h2><h3>設計メモ</h3>";

    expect(addHeadingAnchors(html)).toBe(
      '<h2 id="intro">Intro<a class="heading-anchor" href="#intro" aria-label="Link to section">#</a></h2><h2 id="intro-2">Intro<a class="heading-anchor" href="#intro-2" aria-label="Link to section">#</a></h2><h3 id="設計メモ">設計メモ<a class="heading-anchor" href="#設計メモ" aria-label="Link to section">#</a></h3>',
    );
  });
});
