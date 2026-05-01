import { access, rm } from "node:fs/promises";
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
  it("generates static HTML and CSS files", async () => {
    await rm(distDir, { recursive: true, force: true });

    await buildSite();

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
  });
});
