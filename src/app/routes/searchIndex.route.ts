import type { Hono } from "hono";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { createSearchIndex } from "../../seo/searchIndex";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerSearchIndexRoute = (
  app: Hono,
  options: RouteOptions,
): void => {
  app.get("/search-index.json", (c) =>
    c.json(createSearchIndex(options.siteConfig, options.contentIndex)),
  );
};
