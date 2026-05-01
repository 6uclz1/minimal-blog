import { Hono } from "hono";
import type { SiteConfig } from "../config/site.config";
import type { ContentIndex } from "../content/usecases/buildContentIndex";
import { registerArchiveRoute } from "./routes/archive.route";
import { registerHomeRoute } from "./routes/home.route";
import { renderNotFound } from "./routes/notFound.route";
import { registerPostRoutes } from "./routes/post.route";
import { registerTagRoute } from "./routes/tag.route";

type CreateAppOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const createApp = (options: CreateAppOptions): Hono => {
  const app = new Hono();

  registerHomeRoute(app, options);
  registerPostRoutes(app, options);
  registerTagRoute(app, options);
  registerArchiveRoute(app, options);

  app.notFound((c) => renderNotFound(c, options.siteConfig));

  return app;
};
