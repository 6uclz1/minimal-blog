export type AppEnv = {
  nodeEnv: string;
};

export type GitHubIssuesEnv = {
  githubRepository: string;
  githubToken?: string;
};

export const loadEnv = (): AppEnv => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
});

export const loadGitHubIssuesEnv = (
  env: NodeJS.ProcessEnv = process.env,
): GitHubIssuesEnv => {
  const githubRepository = env.GITHUB_REPOSITORY?.trim();
  const githubToken = env.GITHUB_TOKEN?.trim();

  if (!githubRepository) {
    throw new Error("GITHUB_REPOSITORY environment variable is required");
  }

  if (!/^[^/\s]+\/[^/\s]+$/.test(githubRepository)) {
    throw new Error('GITHUB_REPOSITORY must use "owner/repo" format');
  }

  return {
    githubRepository,
    ...(githubToken ? { githubToken } : {}),
  };
};
