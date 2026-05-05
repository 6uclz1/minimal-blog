import type { Post } from "../domain/Post";

export const fixturePosts: Post[] = [
  {
    id: "github-issue-1",
    source: {
      type: "github-issue",
      issueNumber: 1,
      issueUrl: "https://github.com/6uclz1/minimal-blog/issues/1",
    },
    slug: "hello-hono",
    title: "Hello Hono",
    description: "A first fixture post for the v2 static generator.",
    excerpt: "A first fixture post for the v2 static generator.",
    bodyMarkdown:
      "This fixture already contains rendered HTML for the Phase 1 skeleton.",
    bodyHtml:
      "<p>This fixture already contains rendered HTML for the Phase 1 skeleton.</p>",
    labels: ["post", "published", "tag:hono"],
    tags: ["hono"],
    status: "published",
    pinned: true,
    hidden: false,
    noindex: false,
    publishedAt: new Date("2026-04-30T00:00:00.000Z"),
    updatedAt: new Date("2026-04-30T00:00:00.000Z"),
    author: "6uclz1",
    readingTimeMinutes: 1,
  },
  {
    id: "github-issue-2",
    source: {
      type: "github-issue",
      issueNumber: 2,
      issueUrl: "https://github.com/6uclz1/minimal-blog/issues/2",
    },
    slug: "content-model-first",
    title: "Content Model First",
    description: "A fixture post about keeping CMS data out of presentation.",
    excerpt: "A fixture post about keeping CMS data out of presentation.",
    bodyMarkdown:
      "Routes and components receive normalized Post objects, not GitHub Issue payloads.",
    bodyHtml:
      "<p>Routes and components receive normalized Post objects, not GitHub Issue payloads.</p>",
    labels: ["post", "published", "tag:architecture"],
    tags: ["architecture"],
    status: "published",
    pinned: false,
    hidden: false,
    noindex: false,
    ogImage: "/og/custom-fixture.png",
    publishedAt: new Date("2026-04-29T00:00:00.000Z"),
    updatedAt: new Date("2026-04-29T00:00:00.000Z"),
    author: "6uclz1",
    readingTimeMinutes: 1,
  },
  {
    id: "github-issue-3",
    source: {
      type: "github-issue",
      issueNumber: 3,
      issueUrl: "https://github.com/6uclz1/minimal-blog/issues/3",
    },
    slug: "hidden-implementation-note",
    title: "Hidden Implementation Note",
    description: "A hidden fixture post that still gets a detail page.",
    excerpt: "A hidden fixture post that still gets a detail page.",
    bodyMarkdown:
      "Hidden posts are excluded from list pages but remain addressable by slug.",
    bodyHtml:
      "<p>Hidden posts are excluded from list pages but remain addressable by slug.</p>",
    labels: ["post", "published", "hidden", "tag:architecture"],
    tags: ["architecture"],
    status: "published",
    pinned: false,
    hidden: true,
    noindex: false,
    publishedAt: new Date("2026-04-28T00:00:00.000Z"),
    updatedAt: new Date("2026-04-28T00:00:00.000Z"),
    author: "6uclz1",
    readingTimeMinutes: 1,
  },
];
