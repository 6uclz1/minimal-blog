import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";
import { withBasePath } from "../../shared/path";
import { DateTime } from "../components/DateTime";
import { PostBody } from "../components/PostBody";
import { TagBadge } from "../components/TagBadge";

type PostPageProps = {
  post: Post;
  siteConfig: SiteConfig;
};

export const PostPage = ({ post, siteConfig }: PostPageProps) => (
  <article class="post-page">
    <header class="post-page__header">
      <p class="post-page__meta">
        <DateTime date={post.publishedAt} />
        <span>{post.readingTimeMinutes} min read</span>
      </p>
      <h1>{post.title}</h1>
      {post.tags.length > 0 ? (
        <div class="tag-list">
          {post.tags.map((tag) => (
            <TagBadge key={tag} siteConfig={siteConfig} tag={tag} />
          ))}
        </div>
      ) : null}
    </header>
    <PostBody post={post} />
    <nav class="post-nav" aria-label="Post navigation">
      <a class="post-nav__back" href={withBasePath(siteConfig, "/posts/")}>
        ← Back to posts
      </a>
    </nav>
  </article>
);
