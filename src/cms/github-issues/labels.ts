import type { GitHubIssue, GitHubIssueLabel } from "./GitHubIssue";

export const supportedLabels = {
  archived: "archived",
  draft: "draft",
  hidden: "hidden",
  noindex: "noindex",
  pinned: "pinned",
  post: "post",
  published: "published",
  tagPrefix: "tag:",
} as const;

export const getLabelNames = (issue: Pick<GitHubIssue, "labels">): string[] =>
  issue.labels.map(getLabelName).filter((label) => label.length > 0);

export const hasLabel = (
  issue: Pick<GitHubIssue, "labels">,
  label: string,
): boolean => getLabelNames(issue).includes(label);

export const extractTags = (issue: Pick<GitHubIssue, "labels">): string[] => {
  const tags = new Set<string>();

  for (const label of getLabelNames(issue)) {
    if (!label.startsWith(supportedLabels.tagPrefix)) {
      continue;
    }

    const tag = label.slice(supportedLabels.tagPrefix.length).trim();
    if (tag) {
      tags.add(tag);
    }
  }

  return [...tags];
};

const getLabelName = (label: GitHubIssueLabel): string => {
  if (typeof label === "string") {
    return label.trim();
  }

  return label.name?.trim() ?? "";
};
