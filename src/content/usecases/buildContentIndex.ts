import type { Post } from "../domain/Post";
import { normalizeTag } from "../domain/Tag";

export type TagGroup = {
  name: string;
  slug: string;
  posts: Post[];
};

export type ArchiveMonth = {
  month: string;
  label: string;
  posts: Post[];
};

export type ContentIndex = {
  allPosts: Post[];
  detailPosts: Post[];
  publishedPosts: Post[];
  postsBySlug: Map<string, Post>;
  tags: TagGroup[];
  archiveMonths: ArchiveMonth[];
};

export const buildContentIndex = (posts: Post[]): ContentIndex => {
  assertUniqueSlugs(posts);

  const allPosts = sortPosts(posts);
  const detailPosts = allPosts.filter((post) => post.status === "published");
  const visiblePublishedPosts = detailPosts.filter((post) => !post.hidden);

  return {
    allPosts,
    detailPosts,
    publishedPosts: visiblePublishedPosts,
    postsBySlug: new Map(detailPosts.map((post) => [post.slug, post])),
    tags: buildTagGroups(visiblePublishedPosts),
    archiveMonths: buildArchiveMonths(visiblePublishedPosts),
  };
};

const assertUniqueSlugs = (posts: Post[]): void => {
  const seen = new Set<string>();

  for (const post of posts) {
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate post slug: "${post.slug}"`);
    }
    seen.add(post.slug);
  }
};

const sortPosts = (posts: Post[]): Post[] =>
  [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    const publishedDiff = b.publishedAt.getTime() - a.publishedAt.getTime();
    if (publishedDiff !== 0) {
      return publishedDiff;
    }

    return a.slug.localeCompare(b.slug);
  });

const buildTagGroups = (posts: Post[]): TagGroup[] => {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const seenTagsForPost = new Set<string>();

    for (const tag of post.tags) {
      const normalizedTag = normalizeTag(tag);
      if (!normalizedTag || seenTagsForPost.has(normalizedTag)) {
        continue;
      }

      seenTagsForPost.add(normalizedTag);
      groups.set(normalizedTag, [...(groups.get(normalizedTag) ?? []), post]);
    }
  }

  return [...groups.entries()]
    .map(([name, taggedPosts]) => ({
      name,
      slug: name,
      posts: taggedPosts,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const buildArchiveMonths = (posts: Post[]): ArchiveMonth[] => {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const month = toArchiveMonth(post.publishedAt);
    groups.set(month, [...(groups.get(month) ?? []), post]);
  }

  return [...groups.entries()]
    .map(([month, archivedPosts]) => ({
      month,
      label: formatArchiveMonthLabel(month),
      posts: archivedPosts,
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
};

const toArchiveMonth = (date: Date): string => date.toISOString().slice(0, 7);

const formatArchiveMonthLabel = (month: string): string => {
  const [year, monthNumber] = month.split("-");
  const date = new Date(`${year}-${monthNumber}-01T00:00:00.000Z`);

  return new Intl.DateTimeFormat("en", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
};
