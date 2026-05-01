import type { SiteConfig } from "../config/site.config";

export const withBasePath = (
  siteConfig: Pick<SiteConfig, "basePath">,
  pathname: string,
): string => {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (!siteConfig.basePath) {
    return normalizedPath;
  }

  return `${siteConfig.basePath}${normalizedPath}`;
};

export const postPath = (
  siteConfig: Pick<SiteConfig, "basePath">,
  slug: string,
): string => withBasePath(siteConfig, `/posts/${slug}/`);

export const tagPath = (
  siteConfig: Pick<SiteConfig, "basePath">,
  tag: string,
): string => withBasePath(siteConfig, `/tags/${encodeURIComponent(tag)}/`);
