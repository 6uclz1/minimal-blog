import type { PostStatus } from "./PostStatus";

export type Post = {
  id: string;
  source: {
    type: "github-issue";
    issueNumber: number;
    issueUrl: string;
  };
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  bodyMarkdown: string;
  bodyHtml: string;
  labels: string[];
  tags: string[];
  status: PostStatus;
  pinned: boolean;
  hidden: boolean;
  noindex: boolean;
  canonicalUrl?: string;
  ogImage?: string;
  publishedAt: Date;
  updatedAt: Date;
  author: string;
  readingTimeMinutes: number;
};
