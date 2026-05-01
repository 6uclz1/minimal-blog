import type { SiteConfig } from "../config/site.config";
import type { ContentIndex } from "../content/usecases/buildContentIndex";
import { absoluteUrl } from "./url";

export type SearchIndex = {
  posts: Array<{
    excerpt: string;
    publishedAt: string;
    slug: string;
    tags: string[];
    title: string;
    url: string;
  }>;
};

export const createSearchIndex = (
  siteConfig: SiteConfig,
  contentIndex: ContentIndex,
): SearchIndex => ({
  posts: contentIndex.detailPosts
    .filter((post) => !post.noindex)
    .map((post) => ({
      excerpt: post.excerpt,
      publishedAt: post.publishedAt.toISOString(),
      slug: post.slug,
      tags: post.tags,
      title: post.title,
      url: absoluteUrl(siteConfig, `/posts/${post.slug}/`),
    })),
});
