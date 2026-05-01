import { describe, expect, it } from "vitest";
import { parseIssueFrontmatter } from "../../src/cms/github-issues/parseIssueFrontmatter";

describe("parseIssueFrontmatter", () => {
  it("parses optional frontmatter at the top of an issue body", () => {
    const result = parseIssueFrontmatter(
      "---\nslug: my-post\ndescription: Short description\npublishedAt: 2026-04-30\ncanonicalUrl:\nogImage: /og.png\n---\nBody markdown.",
    );

    expect(result.frontmatter).toEqual({
      slug: "my-post",
      description: "Short description",
      publishedAt: "2026-04-30",
      ogImage: "/og.png",
    });
    expect(result.bodyMarkdown).toBe("Body markdown.");
  });

  it("returns the whole body when frontmatter is absent", () => {
    const result = parseIssueFrontmatter("Body only.");

    expect(result.frontmatter).toEqual({});
    expect(result.bodyMarkdown).toBe("Body only.");
  });

  it("throws a clear error for malformed frontmatter", () => {
    expect(() =>
      parseIssueFrontmatter("---\nslug malformed\n---\nBody"),
    ).toThrow("Malformed issue frontmatter line: slug malformed");
  });

  it("throws a clear error when frontmatter is not closed", () => {
    expect(() => parseIssueFrontmatter("---\nslug: never-closed")).toThrow(
      "Issue frontmatter is missing a closing delimiter",
    );
  });
});
