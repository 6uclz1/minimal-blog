import type { SiteConfig } from "../config/site.config";
import { absoluteUrl } from "./url";

export type PageMetadataInput = {
  canonicalUrl?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  path: string;
  title?: string;
  type?: "article" | "website";
};

export type PageMetadata = {
  canonicalUrl: string;
  description: string;
  image: string;
  noindex: boolean;
  title: string;
  type: "article" | "website";
};

export const createMetadata = (
  siteConfig: SiteConfig,
  input: PageMetadataInput,
): PageMetadata => {
  const pageTitle = input.title
    ? `${input.title} | ${siteConfig.title}`
    : siteConfig.title;

  return {
    canonicalUrl: input.canonicalUrl ?? absoluteUrl(siteConfig, input.path),
    description: input.description ?? siteConfig.description,
    image: input.image ?? siteConfig.defaultOgImage,
    noindex: input.noindex ?? false,
    title: pageTitle,
    type: input.type ?? "website",
  };
};
