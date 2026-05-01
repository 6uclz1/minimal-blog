import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";
import { postPath, withBasePath } from "../../shared/path";
import { DateTime } from "../components/DateTime";
import { PostBody } from "../components/PostBody";
import { TagBadge } from "../components/TagBadge";

type PostPageProps = {
  post: Post;
  previousPost?: Post;
  nextPost?: Post;
  siteConfig: SiteConfig;
};

export const PostPage = ({
  nextPost,
  post,
  previousPost,
  siteConfig,
}: PostPageProps) => (
  <article class="post-page">
    <header class="post-page__header">
      <p class="post-page__meta">
        <DateTime date={post.publishedAt} />
        <span>{post.readingTimeMinutes} min read</span>
      </p>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
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
      <div class="post-nav__links">
        {previousPost ? (
          <a
            class="post-nav__link"
            href={postPath(siteConfig, previousPost.slug)}
          >
            <span>← Previous</span>
            <strong>{previousPost.title}</strong>
            <DateTime date={previousPost.publishedAt} />
          </a>
        ) : (
          <span class="post-nav__placeholder" />
        )}
        {nextPost ? (
          <a
            class="post-nav__link post-nav__link--next"
            href={postPath(siteConfig, nextPost.slug)}
          >
            <span>Next →</span>
            <strong>{nextPost.title}</strong>
            <DateTime date={nextPost.publishedAt} />
          </a>
        ) : (
          <span class="post-nav__placeholder" />
        )}
      </div>
      <a class="post-nav__back" href={withBasePath(siteConfig, "/posts/")}>
        ← Back to posts
      </a>
    </nav>
  </article>
);
