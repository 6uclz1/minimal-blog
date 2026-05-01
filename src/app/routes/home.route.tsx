import type { Hono } from "hono";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { listPublishedPosts } from "../../content/usecases/listPublishedPosts";
import { Layout } from "../../presentation/components/Layout";
import { HomePage } from "../../presentation/pages/HomePage";
import { createMetadata } from "../../seo/metadata";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerHomeRoute = (app: Hono, options: RouteOptions): void => {
  app.get("/", (c) =>
    c.html(
      <Layout
        metadata={createMetadata(options.siteConfig, {
          path: "/",
        })}
        siteConfig={options.siteConfig}
      >
        <HomePage
          posts={listPublishedPosts(options.contentIndex)}
          siteConfig={options.siteConfig}
        />
      </Layout>,
    ),
  );
};
