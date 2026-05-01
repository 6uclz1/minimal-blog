import type { GitHubIssue } from "./GitHubIssue";
import { createIssuesPageUrl, shouldFetchNextPage } from "./pagination";

export type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type GitHubIssueClientOptions = {
  fetcher?: Fetcher;
  repository: string;
  token?: string;
};

export class GitHubIssueClient {
  private readonly fetcher: Fetcher;
  private readonly repository: string;
  private readonly token?: string;

  constructor(options: GitHubIssueClientOptions) {
    this.fetcher = options.fetcher ?? fetch;
    this.repository = options.repository;
    this.token = options.token;
  }

  async listIssues(): Promise<GitHubIssue[]> {
    const issues: GitHubIssue[] = [];
    let page = 1;
    let shouldContinue = true;

    while (shouldContinue) {
      const pageIssues = await this.fetchIssuePage(page);
      issues.push(...pageIssues);
      shouldContinue = shouldFetchNextPage(pageIssues.length);
      page += 1;
    }

    return issues;
  }

  private async fetchIssuePage(page: number): Promise<GitHubIssue[]> {
    const response = await this.fetcher(
      createIssuesPageUrl(this.repository, page),
      {
        headers: this.createHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub issues: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as GitHubIssue[];
  }

  private createHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "minimal-blog-static-generator",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }
}
