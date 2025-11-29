import { html } from "hono/html";
import type { Article } from "../types";

export const ArticleList = (props: { articles: Article[] }) => {
  return (
    <div class="max-w-3xl mx-auto">
      {props.articles.length === 0 ? (
        <div class="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-lg">No posts found.</p>
        </div>
      ) : null}
      <div class="space-y-8">
        {props.articles.map((article) => {
          // Strip HTML tags for excerpt
          const plainText = article.content.replace(/<[^>]+>/g, "");
          return (
            <article class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary-100 relative overflow-hidden">
              <header class="mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <time datetime={article.createdAt}>
                    {new Date(article.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  <a href={`posts/${article.id}`}>{article.title}</a>
                </h2>
              </header>
              <p class="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {plainText.substring(0, 200)}...
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
