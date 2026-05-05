import type { SiteConfig } from "../config/site.config";

export const absoluteUrl = (
  siteConfig: Pick<SiteConfig, "url">,
  path: string,
): string => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const baseUrl = siteConfig.url.endsWith("/")
    ? siteConfig.url
    : `${siteConfig.url}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, baseUrl).toString();
};

export const absoluteAssetUrl = (
  siteConfig: Pick<SiteConfig, "url">,
  path: string,
): string => absoluteUrl(siteConfig, path);
