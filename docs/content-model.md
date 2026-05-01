# Content Model

GitHub Issues are external CMS records. Minimal Blog converts them into the internal `Post` domain model before any route or presentation component sees them.

## Public Issue Rules

An issue becomes a public post only when:

- It does not have a `pull_request` key.
- `state` is `open`.
- It has the `post` label.
- It has the `published` label.
- It does not have the `draft` label.
- It does not have the `archived` label.

The `pull_request` check is required because GitHub's Issues API can return pull requests.

## Labels

- `post`: marks an issue as blog content.
- `published`: marks an issue as eligible for generation.
- `draft`: excludes the issue.
- `archived`: excludes the issue.
- `pinned`: sorts the post before regular posts.
- `hidden`: creates the detail page but excludes list pages.
- `noindex`: excludes the post from sitemap and search index.
- `tag:*`: creates a tag. For example, `tag:typescript` becomes `typescript`.

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
Body markdown...
```

Supported fields:

- `slug`
- `description`
- `publishedAt`
- `canonicalUrl`
- `ogImage`

Malformed frontmatter fails the conversion with a clear error.

## Fallback Behavior

- `slug`: generated from the issue title.
- `description`: generated from the sanitized HTML excerpt.
- `publishedAt`: issue `created_at`.
- `updatedAt`: issue `updated_at`.
- `tags`: labels beginning with `tag:`.
- `ogImage`: site default Open Graph image.

## Slug Rules

Slugs are lowercase and generated from letters and numbers. Other characters become `-`. Duplicate slugs are resolved in the GitHub Issues repository by appending `issue-{number}` to the later post.

## Post Shape

The internal `Post` model stores both `bodyMarkdown` and sanitized `bodyHtml`. Presentation components should render `bodyHtml` and should not parse or render raw GitHub Issue bodies.
