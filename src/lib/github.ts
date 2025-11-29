import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import type { Article, GitHubIssue } from "../types";

export const getIssues = async (): Promise<Article[]> => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo"

  if (!repo) {
    throw new Error("GITHUB_REPOSITORY environment variable is not set");
  }

  // Extract the owner from the repository string
  const owner = repo.split("/")[0];

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Hono-Blog-Generator",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const url = `https://api.github.com/repos/${repo}/issues?state=open&per_page=100`;

  console.log(`Fetching issues from ${url}`);
  console.log(`Filtering issues by owner: ${owner}`);

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch issues: ${response.status} ${response.statusText}`,
    );
  }

  const issues: GitHubIssue[] = await response.json();

  // Filter out pull requests and issues not created by the repository owner
  const articles = await Promise.all(
    issues
      .filter((issue) => !issue.pull_request && issue.user.login === owner)
      .map(async (issue) => {
        // Convert Markdown to HTML
        const html = await marked(issue.body || "");
        // Sanitize HTML to prevent XSS attacks
        const sanitizedContent = DOMPurify.sanitize(html);
        return {
          id: String(issue.number),
          title: issue.title,
          content: sanitizedContent,
          createdAt: issue.created_at,
          author: issue.user.login,
        };
      }),
  );

  return articles;
};
