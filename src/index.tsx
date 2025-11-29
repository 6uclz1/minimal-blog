import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import { ArticleDetail } from "./components/ArticleDetail";
import { ArticleList } from "./components/ArticleList";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Layout } from "./components/Layout";
import type { Article } from "./types";

type Bindings = {
  ARTICLES: Article[];
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  const articles = c.env?.ARTICLES || [];
  return c.html(
    <Layout
      title="Blog"
      description="A minimal blog built with Hono and Tailwind CSS"
      url="https://6uclz1.github.io/minimal-blog/"
    >
      <Header />
      <main class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleList articles={articles} />
      </main>
      <Footer />
    </Layout>,
  );
});

app.get(
  "/article/:id",
  ssgParams((c) => {
    const articles = (c.env as Bindings)?.ARTICLES || [];
    return articles.map((article) => ({ id: article.id }));
  }),
  (c) => {
    const id = c.req.param("id");
    const articles = c.env?.ARTICLES || [];
    const article = articles.find((a) => a.id === id);

    if (!article) {
      return c.notFound();
    }

    return c.html(
      <Layout
        title={article.title}
        stylePath="../static/styles.css"
        description={article.content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "..."}
        url={`https://example.com/article/${article.id}`}
        type="article"
      >
        <Header />
        <main class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ArticleDetail article={article} />
        </main>
        <Footer />
      </Layout>,
    );
  },
);

export default app;
