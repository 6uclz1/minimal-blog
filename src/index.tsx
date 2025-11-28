import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import type { Article } from "./types";

type Bindings = {
  ARTICLES: Article[];
};

const app = new Hono<{ Bindings: Bindings }>();

const Layout = (props: {
  title: string;
  children: unknown;
  stylePath?: string;
}) => {
  return (
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href={props.stylePath || "./static/styles.css"}
        />
      </head>
      <body class="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
        <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-colors duration-300">
          <nav class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a
              href="./"
              class="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors tracking-tight flex items-center gap-2"
            >
              <span class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                M
              </span>
              Minimal Blog
            </a>
            <div class="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <span class="sr-only">GitHub</span>
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </nav>
        </header>
        <main class="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          {props.children}
        </main>
        <footer class="bg-white border-t border-gray-200 mt-auto">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p class="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Minimal Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
};

app.get("/", (c) => {
  const articles = c.env?.ARTICLES || [];
  return c.html(
    <Layout title="Minimal Blog">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-12 tracking-tight">
          Recent Posts
        </h1>
        {articles.length === 0 ? (
          <div class="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p class="text-gray-500 text-lg">No posts found.</p>
          </div>
        ) : null}
        <div class="space-y-8">
          {articles.map((article) => {
            // Strip HTML tags for excerpt
            const plainText = article.content.replace(/<[^>]+>/g, "");
            return (
              <article class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-primary-100 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1 h-full bg-primary-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <header class="mb-4">
                  <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span class="font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                      Article
                    </span>
                    <span>•</span>
                    <time datetime={article.createdAt}>
                      {new Date(article.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </time>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    <a
                      href={`posts/${article.id}`}
                      class="before:absolute before:inset-0"
                    >
                      {article.title}
                    </a>
                  </h2>
                </header>
                <p class="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {plainText.substring(0, 200)}...
                </p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      {article.author.charAt(0).toUpperCase()}
                    </div>
                    <span class="font-medium">{article.author}</span>
                  </div>
                  <span class="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read article
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
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
        <article class="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <header class="mb-10 text-center">
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <span class="font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Article
              </span>
              <span>•</span>
              <time datetime={article.createdAt}>
                {new Date(article.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              {article.title}
            </h1>
            <div class="flex items-center justify-center gap-3 text-sm text-gray-500">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <div class="text-left">
                <p class="text-gray-900 font-semibold">{article.author}</p>
                <p class="text-gray-500 text-xs">Author</p>
              </div>
            </div>
          </header>
          <div
            class="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
        <div class="max-w-3xl mx-auto mt-12 mb-8">
          <a
            href="../"
            class="inline-flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors group"
          >
            <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-primary-200 group-hover:bg-primary-50 transition-all">
              <svg
                class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </div>
            Back to Home
          </a>
        </div>
      </Layout>,
    );
  },
);

export default app;
