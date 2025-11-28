import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import type { Article } from "./types";

type Bindings = {
	ARTICLES: Article[];
};

const app = new Hono<{ Bindings: Bindings }>();

const Layout = (props: { title: string; children: unknown; stylePath?: string }) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{props.title}</title>
				<link rel="stylesheet" href={props.stylePath || "./static/styles.css"} />
			</head>
			<body class="bg-gray-50 text-gray-900 font-sans antialiased">
				<header class="bg-white shadow-sm sticky top-0 z-10">
					<nav class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
						<a href="./" class="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
							Minimal Blog
						</a>
					</nav>
				</header>
				<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{props.children}
				</main>
			</body>
		</html>
	);
};

app.get("/", (c) => {
	const articles = c.env?.ARTICLES || [];
	return c.html(
		<Layout title="Minimal Blog">
			<h1 class="text-3xl font-extrabold text-gray-900 mb-8">Recent Posts</h1>
			{articles.length === 0 ? <p class="text-gray-500">No posts found.</p> : null}
			<div class="space-y-8">
				{articles.map((article) => {
					// Strip HTML tags for excerpt
					const plainText = article.content.replace(/<[^>]+>/g, "");
					return (
						<article class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
							<header class="mb-4">
								<h2 class="text-2xl font-bold text-gray-900 mb-2">
									<a href={`posts/${article.id}`} class="hover:text-indigo-600 transition-colors">
										{article.title}
									</a>
								</h2>
								<div class="text-sm text-gray-500">
									By <span class="font-medium text-gray-700">{article.author}</span> on{" "}
									<time datetime={article.createdAt}>
										{new Date(article.createdAt).toLocaleDateString()}
									</time>
								</div>
							</header>
							<p class="text-gray-600 leading-relaxed mb-4">
								{plainText.substring(0, 200)}...
							</p>
							<a href={`posts/${article.id}`} class="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
								Read more
								<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
							</a>
						</article>
					);
				})}
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
				<article class="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
					<header class="mb-8 border-b border-gray-100 pb-8">
						<h1 class="text-4xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
						<div class="flex items-center text-sm text-gray-500">
							<span>By <span class="font-medium text-gray-700">{article.author}</span></span>
							<span class="mx-2">•</span>
							<time datetime={article.createdAt}>
								{new Date(article.createdAt).toLocaleDateString()}
							</time>
						</div>
					</header>
					<div class="prose prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
				</article>
				<div class="mt-8">
					<a href="../" class="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
						<svg class="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
						Back to Home
					</a>
				</div>
			</Layout>,
		);
	},
);

export default app;
