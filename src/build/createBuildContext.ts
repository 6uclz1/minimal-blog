import { createApp } from "../app/app";
import { siteConfig } from "../config/site.config";
import { FixtureContentRepository } from "../content/fixtures/FixtureContentRepository";
import { buildContentIndex } from "../content/usecases/buildContentIndex";

export const createBuildContext = async () => {
  const repository = new FixtureContentRepository();
  const posts = await repository.listPosts();
  const contentIndex = buildContentIndex(posts);
  const app = createApp({ contentIndex, siteConfig });

  return {
    app,
    contentIndex,
    siteConfig,
  };
};
