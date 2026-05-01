import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";
import { PostCard } from "./PostCard";

type PostListProps = {
  emptyMessage?: string;
  posts: Post[];
  siteConfig: SiteConfig;
};

export const PostList = ({
  emptyMessage = "No posts yet.",
  posts,
  siteConfig,
}: PostListProps) => {
  if (posts.length === 0) {
    return <p class="empty-state">{emptyMessage}</p>;
  }

  return (
    <div class="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} siteConfig={siteConfig} />
      ))}
    </div>
  );
};
