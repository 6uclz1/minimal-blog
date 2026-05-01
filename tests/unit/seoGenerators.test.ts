import { describe, expect, it } from "vitest";
import type { SiteConfig } from "../../src/config/site.config";
import type { Post } from "../../src/content/domain/Post";
import { buildContentIndex } from "../../src/content/usecases/buildContentIndex";
import { createMetadata } from "../../src/seo/metadata";
import { createOpenGraphMetadata } from "../../src/seo/openGraph";
import { generateRssFeed } from "../../src/seo/rss";
import { createSearchIndex } from "../../src/seo/searchIndex";
import { generateSitemap } from "../../src/seo/sitemap";
import { createArticleStructuredData } from "../../src/seo/structuredData";

const siteConfig: SiteConfig = {
  author: "6uclz1",
  basePath: "/minimal-blog",
  defaultOgImage: "/og-default.png",
  description: "Site description",
  title: "Minimal Blog",
  url: "https://6uclz1.github.io/minimal-blog",
};

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
  tags: overrides.tags ?? ["typescript"],
  status: overrides.status ?? "published",
  pinned: overrides.pinned ?? false,
  hidden: overrides.hidden ?? false,
  noindex: overrides.noindex ?? false,
  canonicalUrl: overrides.canonicalUrl,
  ogImage: overrides.ogImage,
  publishedAt: overrides.publishedAt ?? new Date("2026-04-30T00:00:00.000Z"),
  updatedAt: overrides.updatedAt ?? new Date("2026-05-01T00:00:00.000Z"),
  author: overrides.author ?? "6uclz1",
  readingTimeMinutes: overrides.readingTimeMinutes ?? 1,
});

describe("SEO generators", () => {
  it("creates page metadata and Open Graph metadata with absolute URLs", () => {
    const metadata = createMetadata(siteConfig, {
      path: "/posts/first-post/",
      title: "First Post",
    });
    const openGraph = createOpenGraphMetadata(siteConfig, metadata);

    expect(metadata).toMatchObject({
      canonicalUrl: "https://6uclz1.github.io/minimal-blog/posts/first-post/",
      description: "Site description",
      title: "First Post | Minimal Blog",
    });
    expect(openGraph).toMatchObject({
      image: "https://6uclz1.github.io/minimal-blog/og-default.png",
      title: "First Post | Minimal Blog",
      type: "website",
      url: "https://6uclz1.github.io/minimal-blog/posts/first-post/",
    });
  });

  it("generates an RSS feed with absolute post URLs and escaped XML", () => {
    const index = buildContentIndex([
      createPost({
        slug: "first-post",
        title: "First & Post",
      }),
    ]);

    const rss = generateRssFeed(siteConfig, index);

    expect(rss).toContain("<title>Minimal Blog</title>");
    expect(rss).toContain(
      "<link>https://6uclz1.github.io/minimal-blog/posts/first-post/</link>",
    );
    expect(rss).toContain("<title>First &amp; Post</title>");
  });

  it("generates a sitemap that excludes noindex posts", () => {
    const index = buildContentIndex([
      createPost({
        slug: "public-post",
        publishedAt: new Date("2026-04-30T00:00:00.000Z"),
      }),
      createPost({
        slug: "hidden-post",
        hidden: true,
        publishedAt: new Date("2026-04-29T00:00:00.000Z"),
      }),
      createPost({ slug: "noindex-post", noindex: true }),
    ]);

    const sitemap = generateSitemap(siteConfig, index);

    expect(sitemap).toContain(
      "<loc>https://6uclz1.github.io/minimal-blog/posts/public-post/</loc>",
    );
    expect(sitemap).toContain(
      "<loc>https://6uclz1.github.io/minimal-blog/posts/hidden-post/</loc>",
    );
    expect(sitemap).not.toContain("noindex-post");
  });

  it("creates a search index that excludes noindex posts but keeps hidden public posts", () => {
    const index = buildContentIndex([
      createPost({
        slug: "public-post",
        publishedAt: new Date("2026-04-30T00:00:00.000Z"),
      }),
      createPost({
        slug: "hidden-post",
        hidden: true,
        publishedAt: new Date("2026-04-29T00:00:00.000Z"),
      }),
      createPost({ slug: "noindex-post", noindex: true }),
    ]);

    const searchIndex = createSearchIndex(siteConfig, index);

    expect(searchIndex.posts.map((post) => post.slug)).toEqual([
      "public-post",
      "hidden-post",
    ]);
    expect(searchIndex.posts[0]?.url).toBe(
      "https://6uclz1.github.io/minimal-blog/posts/public-post/",
    );
  });

  it("creates article structured data from a post", () => {
    const post = createPost({
      ogImage: "/custom-og.png",
      slug: "structured-post",
    });

    expect(createArticleStructuredData(siteConfig, post)).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "First Post",
      image: "https://6uclz1.github.io/minimal-blog/custom-og.png",
      mainEntityOfPage:
        "https://6uclz1.github.io/minimal-blog/posts/structured-post/",
    });
  });
});
