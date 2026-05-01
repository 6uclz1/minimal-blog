# Agent Instructions

## Development Style

- Work test-first when changing behavior.
- Keep runtime `dependencies` limited to `hono` unless the architecture is explicitly revised.
- Use handwritten CSS in `src/styles.css`; do not introduce Tailwind CSS.

## Architecture Rules

- Treat GitHub Issues as an external CMS adapter.
- Normalize CMS data into the `Post` domain model before it reaches routes or presentation components.
- Keep presentation components dependent only on domain types and shared helpers.
- Keep GitHub-specific code under `src/cms/github-issues` in later phases.

## Forbidden Changes

- Do not introduce Next.js.
- Do not introduce a database.
- Do not pass raw GitHub Issue objects into routes or presentation components.
- Do not bypass Markdown sanitization when the Markdown pipeline is added.
- Do not leave placeholder URLs.

## Checks

Run these before finishing implementation work:

```sh
npm test
npm run typecheck
npm run lint
npm run build
```
