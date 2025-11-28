import { marked } from "marked";
import type { Article, GitHubIssue } from "../types";

export const getIssues = async (): Promise<Article[]> => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo"

  if (!repo) {
    throw new Error("GITHUB_REPOSITORY environment variable is not set");
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Hono-Blog-Generator",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const url = `https://api.github.com/repos/${repo}/issues?state=open&per_page=100`;

  console.log(`Fetching issues from ${url}`);

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch issues: ${response.status} ${response.statusText}`,
    );
  }

  const issues: GitHubIssue[] = await response.json();

  // Filter out pull requests (issues that have pull_request property)
  const articles = await Promise.all(
    issues
      .filter((issue) => !issue.pull_request)
      .map(async (issue) => {
        const content = await marked(issue.body || "");
        return {
          id: String(issue.number),
          title: issue.title,
          content,
          createdAt: issue.created_at,
          author: issue.user.login,
        };
      }),
  );

  return articles;
};
