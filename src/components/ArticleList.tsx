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
                class="block bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-800 hover:border-primary-500"
              >
                <h2 class="text-2xl font-bold text-white mb-3">
                  {article.title}
                </h2>
                <p class="text-gray-300 leading-relaxed mb-6 line-clamp-3">
                  {plainText.substring(0, 200)}...
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <time datetime={article.createdAt}>
                    {new Date(article.createdAt).toLocaleDateString(undefined, {
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
