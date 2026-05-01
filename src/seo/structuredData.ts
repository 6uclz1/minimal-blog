import type { SiteConfig } from "../config/site.config";
import type { Post } from "../content/domain/Post";
import { absoluteAssetUrl, absoluteUrl } from "./url";

export type ArticleStructuredData = {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  author: {
    "@type": "Person";
    name: string;
  };
  dateModified: string;
  datePublished: string;
  description: string;
  headline: string;
  image: string;
  mainEntityOfPage: string;
};

export const createArticleStructuredData = (
  siteConfig: SiteConfig,
  post: Post,
): ArticleStructuredData => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  author: {
    "@type": "Person",
    name: post.author || siteConfig.author,
  },
  dateModified: post.updatedAt.toISOString(),
  datePublished: post.publishedAt.toISOString(),
  description: post.description,
  headline: post.title,
  image: absoluteAssetUrl(
    siteConfig,
    post.ogImage ?? siteConfig.defaultOgImage,
  ),
  mainEntityOfPage: absoluteUrl(siteConfig, `/posts/${post.slug}/`),
});
