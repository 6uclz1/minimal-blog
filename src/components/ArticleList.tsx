import type { Article } from "../types";

export const ArticleList = (props: { articles: Article[] }) => {
  return (
    <>
      {props.articles.length === 0 ? (
        <div class="text-center py-12 bg-gray-900 rounded-2xl shadow-sm border border-gray-800">
          <p class="text-gray-400 text-lg">No posts found.</p>
        </div>
      ) : null}
      <div class="space-y-8">
        {props.articles.map((article) => {
          // Strip HTML tags for excerpt
          const plainText = article.content.replace(/<[^>]+>/g, "");
          return (
            <article class="group relative overflow-hidden">
              <a
                href={`/minimal-blog/article/${article.id}`}
                class="block bg-gray-900 p-8 md:p-12 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-800 hover:border-primary-500"
              >
                <h2 class="text-2xl font-bold text-white mb-3">
                  {article.title}
                </h2>
                <p class="text-gray-300 leading-relaxed mb-6 line-clamp-3">
                  {plainText.substring(0, 200)}...
                </p>
                <div class="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <time dateTime={article.createdAt} class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(article.createdAt).toLocaleDateString('ja-JP', {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </>
  );
};
