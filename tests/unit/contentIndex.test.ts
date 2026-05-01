import { describe, expect, it } from "vitest";
import type { Post } from "../../src/content/domain/Post";
import { buildContentIndex } from "../../src/content/usecases/buildContentIndex";
import { getPostBySlug } from "../../src/content/usecases/getPostBySlug";
import { listArchiveMonths } from "../../src/content/usecases/listArchiveMonths";
import { listPublishedPosts } from "../../src/content/usecases/listPublishedPosts";
import { listTags } from "../../src/content/usecases/listTags";

const createPost = (overrides: Partial<Post> = {}): Post => ({
  id: overrides.id ?? "post-1",
  source: overrides.source ?? {
    type: "github-issue",
    issueNumber: 1,
    issueUrl: "https://github.com/6uclz1/minimal-blog/issues/1",
  },
  slug: overrides.slug ?? "first-post",
  title: overrides.title ?? "First Post",
  description: overrides.description ?? "Description",
  excerpt: overrides.excerpt ?? "Excerpt",
  bodyMarkdown: overrides.bodyMarkdown ?? "Body",
  bodyHtml: overrides.bodyHtml ?? "<p>Body</p>",
  labels: overrides.labels ?? ["post", "published"],
  tags: overrides.tags ?? [],
  status: overrides.status ?? "published",
  pinned: overrides.pinned ?? false,
  hidden: overrides.hidden ?? false,
  noindex: overrides.noindex ?? false,
  canonicalUrl: overrides.canonicalUrl,
  ogImage: overrides.ogImage,
  publishedAt: overrides.publishedAt ?? new Date("2026-04-28T00:00:00.000Z"),
  updatedAt: overrides.updatedAt ?? new Date("2026-04-28T00:00:00.000Z"),
  author: overrides.author ?? "6uclz1",
  readingTimeMinutes: overrides.readingTimeMinutes ?? 1,
});

describe("buildContentIndex", () => {
  it("sorts visible published posts by pinned first, then publishedAt descending", () => {
    const olderPinned = createPost({
      id: "pinned",
      slug: "pinned",
      pinned: true,
      publishedAt: new Date("2026-04-01T00:00:00.000Z"),
    });
    const newest = createPost({
      id: "newest",
      slug: "newest",
      publishedAt: new Date("2026-04-30T00:00:00.000Z"),
    });
    const older = createPost({
      id: "older",
      slug: "older",
      publishedAt: new Date("2026-04-20T00:00:00.000Z"),
    });

    const index = buildContentIndex([older, newest, olderPinned]);

    expect(listPublishedPosts(index).map((post) => post.slug)).toEqual([
      "pinned",
      "newest",
      "older",
    ]);
  });

  it("keeps hidden posts retrievable by slug but excludes them from list pages", () => {
    const visible = createPost({ id: "visible", slug: "visible" });
    const hidden = createPost({ id: "hidden", slug: "hidden", hidden: true });

    const index = buildContentIndex([hidden, visible]);

    expect(getPostBySlug(index, "hidden")).toBe(hidden);
    expect(listPublishedPosts(index).map((post) => post.slug)).toEqual([
      "visible",
    ]);
  });

  it("excludes draft and archived posts from public lists", () => {
    const published = createPost({ id: "published", slug: "published" });
    const draft = createPost({
      id: "draft",
      slug: "draft",
      status: "draft",
    });
    const archived = createPost({
      id: "archived",
      slug: "archived",
      status: "archived",
    });

    const index = buildContentIndex([draft, archived, published]);

    expect(listPublishedPosts(index).map((post) => post.slug)).toEqual([
      "published",
    ]);
  });

  it("does not expose draft or archived posts by slug", () => {
    const draft = createPost({
      id: "draft",
      slug: "draft",
      status: "draft",
    });
    const archived = createPost({
      id: "archived",
      slug: "archived",
      status: "archived",
    });

    const index = buildContentIndex([draft, archived]);

    expect(getPostBySlug(index, "draft")).toBeUndefined();
    expect(getPostBySlug(index, "archived")).toBeUndefined();
  });

  it("groups visible published posts by tag", () => {
    const typescript = createPost({
      id: "typescript",
      slug: "typescript",
      tags: ["typescript"],
    });
    const hidden = createPost({
      id: "hidden",
      slug: "hidden",
      tags: ["typescript"],
      hidden: true,
    });
    const architecture = createPost({
      id: "architecture",
      slug: "architecture",
      tags: ["architecture"],
    });

    const index = buildContentIndex([hidden, architecture, typescript]);

    expect(listTags(index).map((tag) => tag.name)).toEqual([
      "architecture",
      "typescript",
    ]);
    expect(
      listTags(index).find((tag) => tag.name === "typescript")?.posts,
    ).toEqual([typescript]);
  });

  it("normalizes tag whitespace and avoids duplicate post entries per tag", () => {
    const post = createPost({
      id: "tagged",
      slug: "tagged",
      tags: ["typescript", " typescript ", "", "architecture"],
    });

    const index = buildContentIndex([post]);

    expect(listTags(index).map((tag) => tag.name)).toEqual([
      "architecture",
      "typescript",
    ]);
    expect(
      listTags(index).find((tag) => tag.name === "typescript")?.posts,
    ).toEqual([post]);
  });

  it("groups visible published posts by archive month", () => {
    const april = createPost({
      id: "april",
      slug: "april",
      publishedAt: new Date("2026-04-30T00:00:00.000Z"),
    });
    const march = createPost({
      id: "march",
      slug: "march",
      publishedAt: new Date("2026-03-15T00:00:00.000Z"),
    });

    const index = buildContentIndex([march, april]);

    expect(listArchiveMonths(index).map((month) => month.month)).toEqual([
      "2026-04",
      "2026-03",
    ]);
  });

  it("keeps archive month posts in published listing order", () => {
    const pinned = createPost({
      id: "pinned",
      slug: "pinned",
      pinned: true,
      publishedAt: new Date("2026-04-01T00:00:00.000Z"),
    });
    const newest = createPost({
      id: "newest",
      slug: "newest",
      publishedAt: new Date("2026-04-30T00:00:00.000Z"),
    });

    const index = buildContentIndex([newest, pinned]);

    expect(listArchiveMonths(index)[0]?.posts.map((post) => post.slug)).toEqual(
      ["pinned", "newest"],
    );
  });

  it("throws a clear error for duplicate slugs", () => {
    const first = createPost({ id: "first", slug: "duplicate" });
    const second = createPost({ id: "second", slug: "duplicate" });

    expect(() => buildContentIndex([first, second])).toThrow(
      'Duplicate post slug: "duplicate"',
    );
  });
});
