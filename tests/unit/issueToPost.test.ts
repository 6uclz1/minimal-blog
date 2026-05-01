import { describe, expect, it } from "vitest";
import { issueToPost } from "../../src/cms/github-issues/issueToPost";
import { loadIssueFixture } from "./githubIssueTestUtils";

describe("issueToPost", () => {
  it("converts a published GitHub Issue into a normalized Post", async () => {
    const post = issueToPost(await loadIssueFixture("published"), {
      defaultOgImage: "/og-default.png",
    });

    expect(post).toMatchObject({
      id: "github-issue-10",
      slug: "github-issues-cms-blog",
      title: "GitHub Issues CMS Blog",
      description: "GitHub Issues as a CMS.",
      labels: [
        "post",
        "published",
        "pinned",
        "noindex",
        "tag:typescript",
        "tag:architecture",
      ],
      tags: ["typescript", "architecture"],
      status: "published",
      pinned: true,
      hidden: false,
      noindex: true,
      canonicalUrl:
        "https://6uclz1.github.io/minimal-blog/posts/github-issues-cms-blog/",
      ogImage: "/og/custom.png",
      author: "6uclz1",
      source: {
        type: "github-issue",
        issueNumber: 10,
        issueUrl: "https://github.com/6uclz1/minimal-blog/issues/10",
      },
    });
    expect(post.publishedAt.toISOString()).toBe("2026-04-30T00:00:00.000Z");
    expect(post.updatedAt.toISOString()).toBe("2026-04-30T12:00:00.000Z");
    expect(post.bodyMarkdown).toBe("# Hello\n\nThis is **published** content.");
    expect(post.bodyHtml).toContain('<h1 id="hello">Hello');
    expect(post.excerpt).toContain("Hello");
    expect(post.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it("uses fallback values when frontmatter is absent", async () => {
    const issue = {
      ...(await loadIssueFixture("published")),
      body: "Plain body content for fallback description.",
      labels: ["post", "published", "hidden", "tag:typescript"],
      title: "Fallback Title",
    };

    const post = issueToPost(issue, { defaultOgImage: "/og-default.png" });

    expect(post.slug).toBe("fallback-title");
    expect(post.description).toBe(
      "Plain body content for fallback description.",
    );
    expect(post.publishedAt.toISOString()).toBe("2026-04-29T10:00:00.000Z");
    expect(post.hidden).toBe(true);
    expect(post.ogImage).toBe("/og-default.png");
  });

  it("throws a clear error for malformed frontmatter", async () => {
    const issue = await loadIssueFixture("malformed-frontmatter");

    expect(() => issueToPost(issue)).toThrow(
      "Malformed issue frontmatter line: slug malformed",
    );
  });
});
