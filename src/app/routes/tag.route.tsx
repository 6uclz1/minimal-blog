import type { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { listTags } from "../../content/usecases/listTags";
import { Layout } from "../../presentation/components/Layout";
import { NotFoundPage } from "../../presentation/pages/NotFoundPage";
import { TagPage } from "../../presentation/pages/TagPage";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerTagRoute = (app: Hono, options: RouteOptions): void => {
  const tags = listTags(options.contentIndex);

  app.get(
    "/tags/:tag/",
    ssgParams(tags.map((tag) => ({ tag: tag.slug }))),
    (c) => {
      const tag = tags.find((tagGroup) => tagGroup.slug === c.req.param("tag"));

      if (!tag) {
        return c.html(
          <Layout siteConfig={options.siteConfig} title="Not Found">
            <NotFoundPage siteConfig={options.siteConfig} />
          </Layout>,
          404,
        );
      }

      return c.html(
        <Layout siteConfig={options.siteConfig} title={`Tag: ${tag.name}`}>
          <TagPage siteConfig={options.siteConfig} tag={tag} />
        </Layout>,
      );
    },
  );
};
