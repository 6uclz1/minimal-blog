import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";
import { postPath } from "../../shared/path";
import { DateTime } from "./DateTime";
import { TagBadge } from "./TagBadge";

type PostCardProps = {
  post: Post;
  siteConfig: SiteConfig;
};

export const PostCard = ({ post, siteConfig }: PostCardProps) => (
  <article class="post-card">
    <header class="post-card__header">
      <p class="post-card__meta">
        <DateTime date={post.publishedAt} />
        <span>{post.readingTimeMinutes} min read</span>
      </p>
      <h2 class="post-card__title">
        <a href={postPath(siteConfig, post.slug)}>{post.title}</a>
      </h2>
    </header>
    <p class="post-card__excerpt">{post.excerpt}</p>
    {post.tags.length > 0 ? (
      <div class="tag-list">
        {post.tags.map((tag) => (
          <TagBadge key={tag} siteConfig={siteConfig} tag={tag} />
        ))}
      </div>
    ) : null}
  </article>
);
