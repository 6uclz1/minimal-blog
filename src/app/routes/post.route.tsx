import type { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import type { SiteConfig } from "../../config/site.config";
import type { ContentIndex } from "../../content/usecases/buildContentIndex";
import { getPostBySlug } from "../../content/usecases/getPostBySlug";
import { listPublishedPosts } from "../../content/usecases/listPublishedPosts";
import { Layout } from "../../presentation/components/Layout";
import { HomePage } from "../../presentation/pages/HomePage";
import { NotFoundPage } from "../../presentation/pages/NotFoundPage";
import { PostPage } from "../../presentation/pages/PostPage";
import { createMetadata } from "../../seo/metadata";
import { createArticleStructuredData } from "../../seo/structuredData";

type RouteOptions = {
  contentIndex: ContentIndex;
  siteConfig: SiteConfig;
};

export const registerPostRoutes = (app: Hono, options: RouteOptions): void => {
  app.get("/posts/", (c) =>
    c.html(
      <Layout
        metadata={createMetadata(options.siteConfig, {
          path: "/posts/",
          title: "Posts",
        })}
        siteConfig={options.siteConfig}
      >
        <HomePage
          posts={listPublishedPosts(options.contentIndex)}
          siteConfig={options.siteConfig}
        />
      </Layout>,
    ),
  );

  app.get(
    "/posts/:slug/",
    ssgParams(
      options.contentIndex.detailPosts.map((post) => ({
        slug: post.slug,
      })),
    ),
    (c) => {
      const post = getPostBySlug(options.contentIndex, c.req.param("slug"));

      if (!post) {
        return c.html(
          <Layout siteConfig={options.siteConfig} title="Not Found">
            <NotFoundPage siteConfig={options.siteConfig} />
          </Layout>,
          404,
        );
      }

      return c.html(
        <Layout
          metadata={createMetadata(options.siteConfig, {
            canonicalUrl: post.canonicalUrl,
            description: post.description,
            noindex: post.noindex,
            path: `/posts/${post.slug}/`,
            post,
            title: post.title,
            type: "article",
          })}
          siteConfig={options.siteConfig}
          structuredData={createArticleStructuredData(options.siteConfig, post)}
        >
          <PostPage post={post} siteConfig={options.siteConfig} />
        </Layout>,
      );
    },
  );
};
