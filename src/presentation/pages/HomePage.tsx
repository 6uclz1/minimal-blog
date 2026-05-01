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
      <p class="eyebrow">GitHub Issues backed static blog</p>
      <h1>{siteConfig.title}</h1>
      <p>{siteConfig.description}</p>
    </div>
    <PostList posts={posts} siteConfig={siteConfig} />
  </section>
);
