import { renderToString } from "hono/jsx/dom/server";
import { describe, expect, it } from "vitest";
import { siteConfig } from "../../src/config/site.config";
import type { Post } from "../../src/content/domain/Post";
import { PostPage } from "../../src/presentation/pages/PostPage";

const createPost = (overrides: Partial<Post> = {}): Post => ({
  id: "github-issue-1",
  source: {
    type: "github-issue",
    issueNumber: 1,
    issueUrl: "https://github.com/6uclz1/minimal-blog/issues/1",
  },
  slug: "duplicated-summary",
  title: "Duplicated Summary",
  description: "This paragraph is also the start of the post body.",
  excerpt: "This paragraph is also the start of the post body.",
  bodyMarkdown: "This paragraph is also the start of the post body.",
  bodyHtml: "<p>This paragraph is also the start of the post body.</p>",
  labels: ["post", "published"],
  tags: [],
  status: "published",
  pinned: false,
  hidden: false,
  noindex: false,
  publishedAt: new Date("2026-04-30T00:00:00.000Z"),
  updatedAt: new Date("2026-04-30T00:00:00.000Z"),
  author: "6uclz1",
  readingTimeMinutes: 1,
  ...overrides,
});

describe("PostPage", () => {
  it("does not render the post description as duplicated body content", () => {
    const html = renderToString(PostPage({ post: createPost(), siteConfig }));

    expect(html).toContain(
      '<div class="post-body"><p>This paragraph is also the start of the post body.</p></div>',
    );
    expect(
      html.match(/This paragraph is also the start of the post body\./g),
    ).toHaveLength(1);
  });
});
