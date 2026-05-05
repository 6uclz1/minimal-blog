import type { Post } from "../../content/domain/Post";
import type { ContentRepository } from "../../content/ports/ContentRepository";
import { isPublicPostIssue } from "./filters";
import type { GitHubIssueClient } from "./GitHubIssueClient";
import { issueToPost } from "./issueToPost";

type GitHubIssuesContentRepositoryOptions = {
  client: Pick<GitHubIssueClient, "listIssues">;
};

export class GitHubIssuesContentRepository implements ContentRepository {
  private readonly client: Pick<GitHubIssueClient, "listIssues">;

  constructor(options: GitHubIssuesContentRepositoryOptions) {
    this.client = options.client;
  }

  async listPosts(): Promise<Post[]> {
    const issues = await this.client.listIssues();
    const posts = issues
      .filter(isPublicPostIssue)
      .map((issue) => issueToPost(issue));

    return resolveDuplicateSlugs(posts);
  }
}

const resolveDuplicateSlugs = (posts: Post[]): Post[] => {
  const seenSlugs = new Set<string>();

  return posts.map((post) => {
    if (!seenSlugs.has(post.slug)) {
      seenSlugs.add(post.slug);
      return post;
    }

    const uniqueSlug = createUniqueSlug(
      `${post.slug}-issue-${post.source.issueNumber}`,
      seenSlugs,
    );
    seenSlugs.add(uniqueSlug);

    return {
      ...post,
      slug: uniqueSlug,
    };
  });
};

const createUniqueSlug = (baseSlug: string, seenSlugs: Set<string>): string => {
  if (!seenSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  let slug = `${baseSlug}-${index}`;

  while (seenSlugs.has(slug)) {
    index += 1;
    slug = `${baseSlug}-${index}`;
  }

  return slug;
};
