import type { Article } from "../types";

export const ArticleDetail = (props: { article: Article }) => {
  const { article } = props;
  return (
    <>
      <article class="bg-gray-900 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-800">
        <div
          class="prose prose-lg max-w-none prose-headings:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
};
