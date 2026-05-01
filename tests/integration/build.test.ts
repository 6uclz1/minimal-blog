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
    expect(homeHtml).not.toContain('class="post-card"');

    expect(postHtml).toContain('class="post-nav"');
    expect(postHtml).toContain("Back to posts");

    expect(styles).toContain("font-weight: 100");
    expect(styles).toContain("--bg: #09090b");
    expect(styles).toContain("--noise-rgb");
    expect(styles).toContain("--readable-surface");
    expect(styles).toContain("radial-gradient(");
    expect(styles).toContain(".noise-field");
    expect(styles).toContain(".page-heading {");
    expect(styles).toContain("background: var(--readable-surface)");
    expect(styles).toContain(".post-body {");
  });
});
