import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import type { Article } from "./types";

type Bindings = {
	ARTICLES: Article[];
};

const app = new Hono<{ Bindings: Bindings }>();

const Layout = (props: { title: string; children: unknown }) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{props.title}</title>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
				/>
				<style>
					{`
            body { padding: 2rem; }
            header { border-bottom: 1px solid #eee; margin-bottom: 2rem; padding-bottom: 1rem; }
            article { margin-bottom: 3rem; }
          `}
				</style>
			</head>
			<body>
				<header>
					<nav>
						<ul>
							<li>
								<strong>
									<a href="./">Minimal Blog</a>
								</strong>
							</li>
						</ul>
					</nav>
				</header>
				<main class="container">{props.children}</main>
			</body>
		</html>
	);
};

app.get("/", (c) => {
	const articles = c.env?.ARTICLES || [];
	return c.html(
		<Layout title="Minimal Blog">
			<h1>Recent Posts</h1>
			{articles.length === 0 ? <p>No posts found.</p> : null}
			{articles.map((article) => {
				// Strip HTML tags for excerpt
				const plainText = article.content.replace(/<[^>]+>/g, "");
				return (
					<article>
						<header>
							<h2>
								<a href={`posts/${article.id}`}>{article.title}</a>
							</h2>
							<small>
								By {article.author} on{" "}
								{new Date(article.createdAt).toLocaleDateString()}
							</small>
						</header>
						<p>{plainText.substring(0, 200)}...</p>
					</article>
				);
			})}
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
			<Layout title={article.title}>
				<article>
					<header>
						<h1>{article.title}</h1>
						<small>
							By {article.author} on{" "}
							{new Date(article.createdAt).toLocaleDateString()}
						</small>
					</header>
					<div dangerouslySetInnerHTML={{ __html: article.content }} />
				</article>
				<a href="../">Back to Home</a>
			</Layout>,
		);
	},
);

export default app;
