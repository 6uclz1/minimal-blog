import type { SiteConfig } from "../config/site.config";
import type { ContentIndex } from "../content/usecases/buildContentIndex";
import { absoluteUrl } from "./url";
import { escapeXml } from "./xml";

type SitemapEntry = {
  lastModified?: Date;
  path: string;
};

export const generateSitemap = (
  siteConfig: SiteConfig,
  contentIndex: ContentIndex,
): string => {
  const entries: SitemapEntry[] = [
    { path: "/" },
    { path: "/posts/" },
    { path: "/archive/" },
    ...contentIndex.tags.map((tag) => ({
      path: `/tags/${encodeURIComponent(tag.slug)}/`,
    })),
    ...contentIndex.detailPosts
      .filter((post) => !post.noindex)
      .map((post) => ({
        lastModified: post.updatedAt,
        path: `/posts/${post.slug}/`,
      })),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) =>
      [
        "<url>",
        `<loc>${escapeXml(absoluteUrl(siteConfig, entry.path))}</loc>`,
        entry.lastModified
          ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>`
          : "",
        "</url>",
      ].join(""),
    ),
    "</urlset>",
  ].join("");
};
