# Agent Instructions

## Build Instructions
When building the site, always use the following command with the required environment variable:

```bash
GITHUB_REPOSITORY=6uclz1/minimal-blog npm run build
```

This will:
1. Build the CSS with Tailwind (`npm run build:css`)
2. Fetch articles from GitHub Issues
3. Generate static HTML files in the `dist` directory

## Browser Playback Verification
After making UI/styling changes, always verify the changes using browser playback:

1. Build the site with the command above
2. Use `browser_subagent` to open and verify the built HTML files:
   - Home page: `file:///Users/6uclz1/ws/minimal-blog/dist/index.html`
   - Article pages: `file:///Users/6uclz1/ws/minimal-blog/dist/article/[id].html`
3. Record the browser actions to capture visual proof of the changes
4. Include the recording in the walkthrough artifact

## Post-Work Formatting
After making any changes to the codebase, please run the following command to ensure code style consistency:

```bash
npm run format
```
