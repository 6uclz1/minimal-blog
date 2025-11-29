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
    <Layout title="Minimal Blog">
      <Header />
      <ArticleList articles={articles} />
      <Footer />
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
        <Header />
        <ArticleDetail article={article} />
        <Footer />
      </Layout>,
    );
  },
);

export default app;
