import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";
import { postPath } from "../../shared/path";
import { DateTime } from "./DateTime";

type PostCardProps = {
  post: Post;
  siteConfig: SiteConfig;
};

export const PostCard = ({ post, siteConfig }: PostCardProps) => (
  <article class="post-row">
    <a class="post-row__link" href={postPath(siteConfig, post.slug)}>
      <span class="post-row__date">
        <DateTime date={post.publishedAt} />
      </span>
      <span class="post-row__title">{post.title}</span>
    </a>
  </article>
);
