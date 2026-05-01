import type { SiteConfig } from "../config/site.config";
import type { PageMetadata } from "./metadata";
import { absoluteAssetUrl } from "./url";

export type OpenGraphMetadata = {
  description: string;
  image: string;
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
  title: metadata.title,
  type: metadata.type,
  url: metadata.canonicalUrl,
});
