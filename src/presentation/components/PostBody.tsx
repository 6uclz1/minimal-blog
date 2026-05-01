import { raw } from "hono/html";
import type { Post } from "../../content/domain/Post";

type PostBodyProps = {
  post: Post;
};

export const PostBody = ({ post }: PostBodyProps) => (
  <div class="post-body">{raw(post.bodyHtml)}</div>
);
