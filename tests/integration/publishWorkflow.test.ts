import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const workflowPath = ".github/workflows/publish.yml";

describe("publish workflow", () => {
  it("publishes the static site to GitHub Pages after checks pass", async () => {
    const workflow = await readFile(workflowPath, "utf8");

    expect(workflow).toContain("name: Publish Blog");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("issues:");
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("contents: read");
    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("check:");
    expect(workflow).toContain("build:");
    expect(workflow).toContain("deploy:");
    expect(workflow).toContain("npm run typecheck");
    expect(workflow).toContain("npm run lint");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm run build");
    expect(workflow).toContain("actions/upload-pages-artifact@v3");
    expect(workflow).toContain("actions/deploy-pages@v4");
    expect(workflow).toContain(
      ["GITHUB_TOKEN: $", "{{ secrets.GITHUB_TOKEN }}"].join(""),
    );
    expect(workflow).toContain(
      ["GITHUB_REPOSITORY: $", "{{ github.repository }}"].join(""),
    );
  });
});
