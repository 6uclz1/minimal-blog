# Deployment

Minimal Blog deploys as a static site to GitHub Pages.

## Workflow

The `.github/workflows/publish.yml` workflow is named `Publish Blog`.

Triggers:

- `push` to `main`
- GitHub issue changes
- `workflow_dispatch`

The workflow has three jobs:

- `check`: installs dependencies and runs `npm run typecheck`, `npm run lint`, and `npm test`.
- `build`: installs dependencies, runs `npm run build`, and uploads `dist/` as a GitHub Pages artifact.
- `deploy`: deploys the artifact with `actions/deploy-pages`.

## Environment

The build job passes:

- `GITHUB_REPOSITORY`: `${{ github.repository }}`
- `GITHUB_TOKEN`: `${{ secrets.GITHUB_TOKEN }}`

When `GITHUB_REPOSITORY` is present, the build uses the GitHub Issues CMS adapter. When it is missing, local builds use fixture content.

## GitHub Pages

Repository settings must allow GitHub Pages deployment from GitHub Actions. The workflow uses these permissions:

- `contents: read`
- `pages: write`
- `id-token: write`

## Local Verification

Before changing deployment behavior, run:

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run build` validates that required files exist in `dist/`, including `index.html`, post pages, `feed.xml`, `sitemap.xml`, `search-index.json`, and `static/styles.css`.
