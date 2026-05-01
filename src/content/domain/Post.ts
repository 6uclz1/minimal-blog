import type { PostStatus } from "./PostStatus";
import type { Slug } from "./Slug";
import type { Tag } from "./Tag";

export type Post = {
  id: string;
  source: {
    type: "github-issue";
    issueNumber: number;
    issueUrl: string;
  };
  slug: Slug;
  title: string;
  description: string;
  excerpt: string;
  bodyMarkdown: string;
  bodyHtml: string;
  labels: string[];
  tags: Tag[];
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
