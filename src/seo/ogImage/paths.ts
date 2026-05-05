import crypto from "node:crypto";
import path from "node:path";
import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";

export const ogImageWidth = 1200;
export const ogImageHeight = 630;

export type OgImageDescriptor = {
  alt: string;
  description: string;
  height: number;
  publicPath: string;
  siteTitle: string;
  title: string;
  width: number;
};

export const createDefaultOgImageDescriptor = (
  siteConfig: SiteConfig,
): OgImageDescriptor => {
  const title = siteConfig.title;
  const hash = shortHash(
    [
      "default",
      siteConfig.title,
      siteConfig.description,
      siteConfig.defaultOgImage,
    ].join("\n"),
  );

  return {
    alt: title,
    description: siteConfig.description,
    height: ogImageHeight,
    publicPath: `/og/default-${hash}.png`,
    siteTitle: siteConfig.title,
    title,
    width: ogImageWidth,
  };
};

export const createPostOgImageDescriptor = (
  siteConfig: SiteConfig,
  post: Post,
): OgImageDescriptor => {
  const hash = shortHash(
    [
      "post",
      post.id,
      post.slug,
      post.title,
      post.description,
      post.publishedAt.toISOString(),
      post.tags.join(","),
      siteConfig.title,
    ].join("\n"),
  );

  return {
    alt: `${post.title} | ${siteConfig.title}`,
    description: post.description || post.excerpt || siteConfig.description,
    height: ogImageHeight,
    publicPath: `/og/posts/${post.slug}-${hash}.png`,
    siteTitle: siteConfig.title,
    title: post.title,
    width: ogImageWidth,
  };
};

export const resolvePageOgImagePath = (
  siteConfig: SiteConfig,
  options: { image?: string; post?: Post } = {},
): string => {
  if (options.image) {
    return options.image;
  }

  if (options.post?.ogImage) {
    return options.post.ogImage;
  }

  if (options.post) {
    return createPostOgImageDescriptor(siteConfig, options.post).publicPath;
  }

  return createDefaultOgImageDescriptor(siteConfig).publicPath;
};

export const publicOgImagePathToDistPath = (
  distDir: string,
  publicPath: string,
): string => path.join(distDir, publicPath.replace(/^\/+/, ""));

const shortHash = (value: string): string =>
  crypto.createHash("sha256").update(value).digest("hex").slice(0, 10);
