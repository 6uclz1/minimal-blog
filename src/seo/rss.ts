import type { SiteConfig } from "../config/site.config";
import type { ContentIndex } from "../content/usecases/buildContentIndex";
import { absoluteUrl } from "./url";
import { escapeXml } from "./xml";

export const generateRssFeed = (
  siteConfig: SiteConfig,
  contentIndex: ContentIndex,
): string => {
  const siteUrl = absoluteUrl(siteConfig, "/");
  const lastBuildDate =
    contentIndex.detailPosts[0]?.updatedAt.toUTCString() ??
    new Date(0).toUTCString();
  const items = contentIndex.publishedPosts.map((post) => {
    const postUrl = absoluteUrl(siteConfig, `/posts/${post.slug}/`);

    return [
      "<item>",
      `<title>${escapeXml(post.title)}</title>`,
      `<link>${escapeXml(postUrl)}</link>`,
      `<guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
      `<description>${escapeXml(post.description)}</description>`,
      `<pubDate>${post.publishedAt.toUTCString()}</pubDate>`,
      `<updated>${post.updatedAt.toISOString()}</updated>`,
      "</item>",
    ].join("");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(siteConfig.title)}</title>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<atom:link href="${escapeXml(absoluteUrl(siteConfig, "/feed.xml"))}" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...items,
    "</channel>",
    "</rss>",
  ].join("");
};
