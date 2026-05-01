import { access, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSite } from "../../src/build/build";

const distDir = path.resolve("dist");

const exists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

describe("buildSite", () => {
  it("generates static files with the shared ambient design shell", async () => {
    await rm(distDir, { recursive: true, force: true });

    await buildSite({ env: {} });

    expect(await exists(path.join(distDir, "index.html"))).toBe(true);
    expect(await exists(path.join(distDir, "posts", "index.html"))).toBe(true);
    expect(
      await exists(path.join(distDir, "posts", "hello-hono", "index.html")),
    ).toBe(true);
    expect(await exists(path.join(distDir, "archive", "index.html"))).toBe(
      true,
    );
    expect(await exists(path.join(distDir, "feed.xml"))).toBe(true);
    expect(await exists(path.join(distDir, "sitemap.xml"))).toBe(true);
    expect(await exists(path.join(distDir, "search-index.json"))).toBe(true);
    expect(await exists(path.join(distDir, "static", "styles.css"))).toBe(true);

    const [homeHtml, postHtml, styles] = await Promise.all([
      readFile(path.join(distDir, "index.html"), "utf8"),
      readFile(path.join(distDir, "posts", "hello-hono", "index.html"), "utf8"),
      readFile(path.join(distDir, "static", "styles.css"), "utf8"),
    ]);

    expect(homeHtml).toContain('class="noise-field"');
    expect(homeHtml).toContain('data-ambient-field="true"');
    expect(homeHtml).toContain("requestAnimationFrame");
    expect(homeHtml).toContain("FLOW_FIELD_SEED");
    expect(homeHtml).toContain("function stepFluidField");
    expect(homeHtml).toContain("function queueInteractionRipple");
    expect(homeHtml).toContain("Float32Array");
    expect(homeHtml).toContain("pointerdown");
    expect(homeHtml).toContain('class="theme-toggle"');
    expect(homeHtml).toContain('class="post-index"');
    expect(homeHtml).toContain('class="post-row"');
    expect(homeHtml).toContain(
      '<article class="post-row"><span class="post-row__date">',
    );
    expect(homeHtml).toContain(
      '<a class="post-row__link" href="/minimal-blog/posts/hello-hono/"><span class="post-row__title">Hello Hono</span></a>',
    );
    expect(homeHtml).not.toContain(
      '<a class="post-row__link" href="/minimal-blog/posts/hello-hono/"><span class="post-row__date">',
    );
    expect(homeHtml).not.toContain('class="post-card"');

    expect(postHtml).toContain('class="post-nav"');
    expect(postHtml).toContain("Back to posts");
    expect(postHtml).not.toContain("Previous");
    expect(postHtml).not.toContain("Next");
    expect(postHtml).not.toContain('class="post-nav__links"');
    expect(postHtml).not.toContain('class="post-nav__label"');

    expect(styles).toContain("font-weight: 100");
    expect(styles).toContain("--bg: #09090b");
    expect(styles).toContain("--noise-rgb");
    expect(styles).toContain("radial-gradient(");
    expect(styles).toContain(".noise-field");
    expect(styles).toContain("--readable-text-surface");
    expect(styles).toContain("--brand-letter-spacing: 0.14em");
    expect(styles).toContain("--brand-hover-trailing-space: 0.44rem");
    expect(styles).toContain("--hover-inline-space: 0.36rem");
    expect(styles).toContain("--link-hover-duration: 1280ms");
    expect(styles).toContain(
      "--link-hover-ease: cubic-bezier(0.22, 1, 0.36, 1)",
    );
    expect(styles).toContain(".post-page__header h1,");
    expect(styles).toContain(".post-body {");
    expect(styles).toContain(".post-body > :where(");
    expect(styles).toContain(
      "background-image: var(--hover-shape), var(--hover-surface)",
    );
    expect(styles).toContain("rgba(var(--fg-rgb) / 0.78) 0 78%");
    expect(styles).toContain("transparent 78% 100%");
    expect(styles).toContain("margin: -0.16rem -0.28rem");
    expect(styles).toContain("padding: 0.2rem var(--hover-inline-space)");
    expect(styles).toContain(
      "padding-right: calc(\n    var(--hover-inline-space) +\n    var(--brand-letter-spacing) +\n    var(--brand-hover-trailing-space)\n  )",
    );
    expect(styles).not.toContain("--hover-trailing-space");
    expect(styles).toContain("background-size:\n    0% 100%,");
    expect(styles).toContain("background-size:\n    142% 100%,");
    expect(styles).toContain("background-position:\n    0 50%,");
    expect(styles).toContain("--hover-text: #f4f4f1");
    expect(styles).toContain("color: var(--hover-text)");
    expect(styles).toContain("white-space: nowrap");
    expect(styles).toContain(".post-row__link:hover .post-row__title");
    expect(styles).toContain(".post-nav__back:hover");
    expect(styles).not.toMatch(
      /\.post-nav__back\s*\{[^}]*transition:\s*color 240ms ease;/,
    );
    expect(styles).not.toContain(".post-row__link:hover .post-row__date");
    expect(styles).not.toContain(".post-row__date,\n.tag-badge");
    expect(styles).not.toContain("--readable-surface");
    expect(styles).not.toContain("box-shadow: var(--readable-shadow)");
    expect(styles).not.toContain(".post-page__header,\n.post-body");
    expect(styles).not.toContain("text-decoration: underline");
  });
});
