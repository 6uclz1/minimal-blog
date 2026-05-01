import type { Hono } from "hono";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { generateSitemap } from "../../seo/sitemap";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerSitemapRoute = (
  app: Hono,
  options: RouteOptions,
): void => {
  app.get("/sitemap.xml", (c) => {
    c.header("Content-Type", "application/xml; charset=utf-8");

    return c.body(generateSitemap(options.siteConfig, options.contentIndex));
  });
};
