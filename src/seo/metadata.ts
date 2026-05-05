import type { SiteConfig } from "../config/site.config";
import type { Post } from "../content/domain/Post";
import {
  ogImageHeight,
  ogImageWidth,
  resolvePageOgImagePath,
} from "./ogImage/paths";
import { absoluteUrl } from "./url";

export type PageMetadataInput = {
  canonicalUrl?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  locale?: string;
  noindex?: boolean;
  path: string;
  post?: Post;
  title?: string;
  type?: "article" | "website";
};

export type PageMetadata = {
  canonicalUrl: string;
  description: string;
  image: string;
  imageAlt: string;
  imageHeight: number;
  imageWidth: number;
  locale: string;
  noindex: boolean;
  siteName: string;
  title: string;
  type: "article" | "website";
  url: string;
};

export const createMetadata = (
  siteConfig: SiteConfig,
  input: PageMetadataInput,
): PageMetadata => {
  const pageTitle = input.title
    ? `${input.title} | ${siteConfig.title}`
    : siteConfig.title;
  const url = absoluteUrl(siteConfig, input.path);

  return {
    canonicalUrl: input.canonicalUrl ?? url,
    description: input.description ?? siteConfig.description,
    image: resolvePageOgImagePath(siteConfig, {
      image: input.image,
      post: input.post,
    }),
    imageAlt: input.imageAlt ?? pageTitle,
    imageHeight: ogImageHeight,
    imageWidth: ogImageWidth,
    locale: input.locale ?? "ja_JP",
    noindex: input.noindex ?? false,
    siteName: siteConfig.title,
    title: pageTitle,
    type: input.type ?? "website",
    url,
  };
};
