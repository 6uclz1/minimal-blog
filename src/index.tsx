import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import type { Article } from "./types";
import { Layout } from "./components/Layout";
import { ArticleList } from "./components/ArticleList";
import { ArticleDetail } from "./components/ArticleDetail";

type Bindings = {
  ARTICLES: Article[];
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  const articles = c.env?.ARTICLES || [];
  return c.html(
    <Layout title="Minimal Blog">
      <ArticleList articles={articles} />
    </Layout>,
  );
});

app.get(
  "/posts/:id",
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
      <Layout title={article.title} stylePath="../static/styles.css">
        <ArticleDetail article={article} />
      </Layout>,
    );
  },
);

export default app;
