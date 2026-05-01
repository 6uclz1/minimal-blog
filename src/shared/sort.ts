import type { Post } from "../content/domain/Post";

export const comparePostsByPublishOrder = (a: Post, b: Post): number => {
  if (a.pinned !== b.pinned) {
    return a.pinned ? -1 : 1;
  }

  const publishedDiff = b.publishedAt.getTime() - a.publishedAt.getTime();
  if (publishedDiff !== 0) {
    return publishedDiff;
  }

  return a.slug.localeCompare(b.slug);
};
