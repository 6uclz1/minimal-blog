import type { Post } from "../../content/domain/Post";
import { extractExcerpt } from "../../markdown/extractExcerpt";
import { readingTime } from "../../markdown/readingTime";
import { renderMarkdown } from "../../markdown/renderMarkdown";
import type { GitHubIssue } from "./GitHubIssue";
import {
  extractTags,
  getLabelNames,
  hasLabel,
  supportedLabels,
} from "./labels";
import { parseIssueFrontmatter } from "./parseIssueFrontmatter";

type IssueToPostOptions = {
  defaultOgImage?: string;
};

export const issueToPost = (
  issue: GitHubIssue,
  options: IssueToPostOptions = {},
): Post => {
  const parsedBody = parseIssueFrontmatter(issue.body ?? "");
  const bodyHtml = renderMarkdown(parsedBody.bodyMarkdown);
  const excerpt = extractExcerpt(bodyHtml);
  const labels = getLabelNames(issue);

  return {
    id: `github-issue-${issue.number}`,
    source: {
      type: "github-issue",
      issueNumber: issue.number,
      issueUrl: issue.html_url,
    },
    slug: createSlug(parsedBody.frontmatter.slug ?? issue.title, issue.number),
    title: issue.title,
    description: parsedBody.frontmatter.description ?? excerpt,
    excerpt,
    bodyMarkdown: parsedBody.bodyMarkdown,
    bodyHtml,
    labels,
    tags: extractTags(issue),
    status: getPostStatus(issue),
    pinned: hasLabel(issue, supportedLabels.pinned),
    hidden: hasLabel(issue, supportedLabels.hidden),
    noindex: hasLabel(issue, supportedLabels.noindex),
    canonicalUrl: parsedBody.frontmatter.canonicalUrl,
    ogImage: parsedBody.frontmatter.ogImage ?? options.defaultOgImage,
    publishedAt: parseDate(
      parsedBody.frontmatter.publishedAt ?? issue.created_at,
      "publishedAt",
    ),
    updatedAt: parseDate(issue.updated_at, "updatedAt"),
    author: issue.user.login,
    readingTimeMinutes: readingTime(parsedBody.bodyMarkdown),
  };
};

export const createSlug = (value: string, issueNumber?: number): string => {
  const slug = Array.from(value.trim().toLowerCase())
    .map((character) => {
      if (/[\p{Letter}\p{Number}]/u.test(character)) {
        return character;
      }

      return "-";
    })
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || (issueNumber ? `issue-${issueNumber}` : "post");
};

const getPostStatus = (issue: GitHubIssue): Post["status"] => {
  if (hasLabel(issue, supportedLabels.archived)) {
    return "archived";
  }

  if (hasLabel(issue, supportedLabels.draft)) {
    return "draft";
  }

  return "published";
};

const parseDate = (value: string, fieldName: string): Date => {
  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : value;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid issue ${fieldName}: ${value}`);
  }

  return date;
};
