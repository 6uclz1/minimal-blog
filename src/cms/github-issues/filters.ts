import type { GitHubIssue } from "./GitHubIssue";
import { hasLabel, supportedLabels } from "./labels";

export const isPullRequestIssue = (issue: GitHubIssue): boolean =>
  "pull_request" in issue && issue.pull_request !== undefined;

export const isPublicPostIssue = (issue: GitHubIssue): boolean =>
  !isPullRequestIssue(issue) &&
  issue.state === "open" &&
  hasLabel(issue, supportedLabels.post) &&
  hasLabel(issue, supportedLabels.published) &&
  !hasLabel(issue, supportedLabels.draft) &&
  !hasLabel(issue, supportedLabels.archived);
