import type { Article } from "../types";

export const ArticleDetail = (props: { article: Article }) => {
  const { article } = props;
  const formattedDate = new Date(article.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <article class="bg-gray-900 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-800">
        {/* Article Header */}
        <header class="mb-8 pb-8 border-b border-gray-800">
          <h1 class="text-2xl font-bold text-white mb-4">
            {article.title}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <time dateTime={article.createdAt} class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </time>
          </div>
        </header>

        {/* Article Content */}
        <div
          class="prose prose-lg max-w-none prose-headings:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Back Button */}
      <div class="mt-6 flex justify-center">
        <a
          href="/minimal-blog/"
          class="flex h-12 w-24 cursor-pointer items-center justify-center rounded-[5px] text-xs duration-300 border border-[#222] bg-black hover:border-[#0070f3]"
        >
          戻る
        </a>
      </div>
    </>
  );
};
