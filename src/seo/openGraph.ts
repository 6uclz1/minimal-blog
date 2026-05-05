import type { SiteConfig } from "../config/site.config";
import type { PageMetadata } from "./metadata";
import { absoluteAssetUrl } from "./url";

export type OpenGraphMetadata = {
  description: string;
  image: string;
  imageAlt: string;
  imageHeight: number;
  imageWidth: number;
  locale: string;
  siteName: string;
  title: string;
  type: "article" | "website";
  url: string;
};

export const createOpenGraphMetadata = (
  siteConfig: SiteConfig,
  metadata: PageMetadata,
): OpenGraphMetadata => ({
  description: metadata.description,
  image: absoluteAssetUrl(siteConfig, metadata.image),
  imageAlt: metadata.imageAlt,
  imageHeight: metadata.imageHeight,
  imageWidth: metadata.imageWidth,
  locale: metadata.locale,
  siteName: metadata.siteName,
  title: metadata.title,
  type: metadata.type,
  url: metadata.url,
});
