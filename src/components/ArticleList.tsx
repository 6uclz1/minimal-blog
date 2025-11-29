import { html } from "hono/html";
import type { Article } from "../types";

export const ArticleList = (props: { articles: Article[] }) => {
  return (
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-12 tracking-tight">
        Recent Posts
      </h1>
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
            <article class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-primary-100 relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1 h-full bg-primary-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              <header class="mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span class="font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
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
  );
};
