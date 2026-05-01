import type { SiteConfig } from "../../config/site.config";
import type { Post } from "../../content/domain/Post";
import { PostList } from "../components/PostList";

type HomePageProps = {
  posts: Post[];
  siteConfig: SiteConfig;
};

export const HomePage = ({ posts, siteConfig }: HomePageProps) => (
  <section class="page-section">
    <div class="page-heading">
      <h1>Posts</h1>
    </div>
    <PostList posts={posts} siteConfig={siteConfig} />
  </section>
);
