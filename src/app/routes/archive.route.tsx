import type { Hono } from "hono";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { listArchiveMonths } from "../../content/usecases/listArchiveMonths";
import { Layout } from "../../presentation/components/Layout";
import { ArchivePage } from "../../presentation/pages/ArchivePage";
import { createMetadata } from "../../seo/metadata";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerArchiveRoute = (
  app: Hono,
  options: RouteOptions,
): void => {
  app.get("/archive/", (c) =>
    c.html(
      <Layout
        metadata={createMetadata(options.siteConfig, {
          path: "/archive/",
          title: "Archive",
        })}
        siteConfig={options.siteConfig}
      >
        <ArchivePage
          archiveMonths={listArchiveMonths(options.contentIndex)}
          siteConfig={options.siteConfig}
        />
      </Layout>,
    ),
  );
};
