import { createApp } from "../app/app";
import type { Fetcher } from "../cms/github-issues/GitHubIssueClient";
import { GitHubIssueClient } from "../cms/github-issues/GitHubIssueClient";
import { GitHubIssuesContentRepository } from "../cms/github-issues/GitHubIssuesContentRepository";
import { loadGitHubIssuesEnv } from "../config/env";
import { siteConfig } from "../config/site.config";
import { FixtureContentRepository } from "../content/fixtures/FixtureContentRepository";
import type { ContentRepository } from "../content/ports/ContentRepository";
import { buildContentIndex } from "../content/usecases/buildContentIndex";

type CreateBuildContextOptions = {
  env?: NodeJS.ProcessEnv;
  fetcher?: Fetcher;
};

export const createBuildContext = async (
  options: CreateBuildContextOptions = {},
) => {
  const repository = createContentRepository(options);
  const posts = await repository.listPosts();
  const contentIndex = buildContentIndex(posts);
  const app = createApp({ contentIndex, siteConfig });

  return {
    app,
    contentIndex,
    siteConfig,
  };
};

const createContentRepository = (
  options: CreateBuildContextOptions,
): ContentRepository => {
  const env = options.env ?? process.env;

  if (!env.GITHUB_REPOSITORY?.trim()) {
    return new FixtureContentRepository();
  }

  const githubIssuesEnv = loadGitHubIssuesEnv(env);
  const client = new GitHubIssueClient({
    fetcher: options.fetcher,
    repository: githubIssuesEnv.githubRepository,
    token: githubIssuesEnv.githubToken,
  });

  return new GitHubIssuesContentRepository({
    client,
    defaultOgImage: siteConfig.defaultOgImage,
  });
};
