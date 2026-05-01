export type GitHubIssueLabel =
  | string
  | {
      name?: string | null;
    };

export type GitHubIssue = {
  number: number;
  html_url: string;
  title: string;
  body: string | null;
  state: "open" | "closed" | string;
  labels: GitHubIssueLabel[];
  user: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  pull_request?: unknown;
};
