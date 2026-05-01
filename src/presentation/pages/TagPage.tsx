import type { SiteConfig } from "../../config/site.config";
import type { TagGroup } from "../../content/usecases/buildContentIndex";
import { PostList } from "../components/PostList";

type TagPageProps = {
  siteConfig: SiteConfig;
  tag: TagGroup;
};

export const TagPage = ({ siteConfig, tag }: TagPageProps) => (
  <section class="page-section">
    <div class="page-heading">
      <p class="eyebrow">Tag</p>
      <h1>{tag.name}</h1>
      <p>
        {tag.posts.length} {tag.posts.length === 1 ? "post" : "posts"}
      </p>
    </div>
    <PostList posts={tag.posts} siteConfig={siteConfig} />
  </section>
);
