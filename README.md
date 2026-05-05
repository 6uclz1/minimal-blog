# Minimal Blog

Minimal Blog is a GitHub Issues backed static blog generator. It treats GitHub Issues as an external CMS, normalizes them into a `Post` domain model, renders Markdown into sanitized HTML, and generates a static site for GitHub Pages.

The runtime dependency goal is deliberately small: Zero runtime dependencies except Hono. Tooling dependencies are limited to TypeScript, Vitest, Biome, and `tsx`.

## Architecture

```text
GitHub Issues
  -> CMS adapter
  -> Post domain model
  -> Markdown pipeline
  -> Hono SSG
  -> GitHub Pages
```

The app does not pass raw GitHub Issue objects into routes or presentation components. UI code receives normalized `Post` values only.

## Local Development

Install dependencies:

```sh
npm ci
```

Run the validation suite:

```sh
npm test
npm run typecheck
npm run lint
```

Build the static site:

```sh
npm run build
```

The generated files are written to `dist/`. When `GITHUB_REPOSITORY` is not set, the build uses fixture posts so local builds and tests do not need network access.

## GitHub Issues CMS

Set these environment variables to build from GitHub Issues:

```sh
GITHUB_REPOSITORY=6uclz1/minimal-blog
GITHUB_TOKEN=github_token
npm run build
```

`GITHUB_TOKEN` is optional for public repositories but recommended for API rate limits. In GitHub Actions, the publish workflow passes `${{ github.repository }}` and `${{ secrets.GITHUB_TOKEN }}` automatically.

## Label Rules

Published posts must satisfy all of these rules:

- The issue is not a pull request; the GitHub Issues API can return pull requests, so items with `pull_request` are excluded.
- `state` is `open`.
- Labels include `post`.
- Labels include `published`.
- Labels do not include `draft`.
- Labels do not include `archived`.

Supported labels:

- `post`: article candidate
- `published`: public article
- `draft`: excluded from public output
- `archived`: excluded from public output
- `pinned`: sorted before regular posts
- `hidden`: detail URL is generated, but list pages exclude it
- `noindex`: excluded from sitemap and search index
- `tag:typescript`: creates the `typescript` tag

## Frontmatter

Issue bodies can start with optional frontmatter:

```md
---
slug: github-issues-cms-blog
description: GitHub Issues as a CMS.
publishedAt: 2026-04-30
canonicalUrl: https://6uclz1.github.io/minimal-blog/posts/github-issues-cms-blog/
ogImage: /og/custom.png
---
# Body
```

Fallbacks:

- `slug`: generated from ASCII URL text in the issue title, or `issue-<number>` when the title has no ASCII URL text
- `description`: generated from the rendered excerpt
- `publishedAt`: issue `created_at`
- `updatedAt`: issue `updated_at`
- `tags`: labels that start with `tag:`
- `ogImage`: optional; when omitted, an article-specific OGP PNG is generated at build time

`ogImage` overrides the generated article image. Root-relative paths such as `/og/custom.png` are resolved against `siteConfig.url`, and fully qualified HTTPS URLs are preserved. Use 1200x630 images for custom social preview assets.

## Social previews / OGP

`npm run build` writes social preview metadata into the initial HTML head and generates PNG images under `dist/og/`.

Article pages use an article-specific OGP PNG unless frontmatter provides `ogImage`. Home, posts, archive, and tag pages use the generated default site OGP image. Generated and custom image URLs are emitted as absolute URLs under `siteConfig.url`.

To verify locally:

```sh
npm run build
```

Then inspect `dist/posts/<slug>/index.html` for `og:image` and `twitter:image`, and inspect generated images under `dist/og/`. After deployment, external social preview debuggers can be used against the GitHub Pages URL.

## Deployment

The `Publish Blog` workflow builds and deploys to GitHub Pages on:

- push to `main`
- issue changes
- manual `workflow_dispatch`

The workflow runs checks before deploy, builds `dist/`, uploads it as a Pages artifact, and deploys with the official GitHub Pages action.
