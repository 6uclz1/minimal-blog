# Architecture

Minimal Blog is a static blog generator, not a runtime blog application.

```text
GitHub Issues -> CMS adapter -> Post -> Markdown -> Hono SSG -> dist
```

## Layers

- `src/cms/github-issues`: GitHub Issues API types, pagination, filtering, frontmatter parsing, and Issue-to-Post conversion.
- `src/content/domain`: stable domain types such as `Post`, `PostStatus`, `Slug`, and `Tag`.
- `src/content/ports`: repository contracts used by build and usecase code.
- `src/content/usecases`: content indexing, sorting, tag grouping, archive grouping, and slug lookup.
- `src/markdown`: Markdown rendering, sanitization, heading anchors, excerpt extraction, and reading time.
- `src/app`: Hono route registration and response wiring.
- `src/presentation`: JSX components and pages that depend on domain types only.
- `src/seo`: metadata, Open Graph, RSS, sitemap, search index, and structured data generation.
- `src/build`: build orchestration, static generation, asset copying, and output validation.

## Dependency Direction

Allowed direction:

```text
build -> config -> cms/github-issues -> content/usecases -> app -> seo
app -> presentation -> content/domain
cms/github-issues -> content/domain -> content/ports -> markdown
presentation -> content/domain
```

Forbidden direction:

```text
presentation -> cms/github-issues
content/domain -> markdown
content/domain -> app
content/domain -> GitHub API
```

The CMS adapter is replaceable because the rest of the system works with `Post`, not GitHub API payloads.

## Build Pipeline

1. Select a content repository:
   - `GITHUB_REPOSITORY` set: use `GitHubIssuesContentRepository`.
   - `GITHUB_REPOSITORY` missing: use fixture posts.
2. Fetch or load posts.
3. Build `ContentIndex`.
4. Create the Hono app with content and site config.
5. Generate static route output into `dist/`.
6. Copy `src/styles.css` to `dist/static/styles.css`.
7. Validate required output files.

Generated output includes HTML pages, `feed.xml`, `sitemap.xml`, `search-index.json`, and static CSS.

## Runtime Dependencies

Runtime dependencies are intentionally limited to Hono. Markdown, sanitization, RSS, sitemap, and search index generation are implemented inside this repository.
