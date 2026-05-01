import type { Hono } from "hono";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { generateRssFeed } from "../../seo/rss";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerFeedRoute = (app: Hono, options: RouteOptions): void => {
  app.get("/feed.xml", (c) => {
    c.header("Content-Type", "application/xml; charset=utf-8");

    return c.body(generateRssFeed(options.siteConfig, options.contentIndex));
  });
};
