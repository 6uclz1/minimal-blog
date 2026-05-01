import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const readText = (path: string): Promise<string> => readFile(path, "utf8");

describe("project documentation", () => {
  it("documents the architecture, content model, deployment, and agent rules", async () => {
    const [readme, agentInstructions, architecture, contentModel, deployment] =
      await Promise.all([
        readText("README.md"),
        readText("AGENTS.md"),
        readText("docs/architecture.md"),
        readText("docs/content-model.md"),
        readText("docs/deployment.md"),
      ]);

    expect(readme).toContain("GitHub Issues backed static blog generator");
    expect(readme).toContain("Zero runtime dependencies except Hono");
    expect(readme).toContain("npm run build");
    expect(readme).toContain("tag:typescript");

    expect(agentInstructions).toContain("Do not introduce Next.js");
    expect(agentInstructions).toContain("Do not introduce a database");
    expect(agentInstructions).toContain("npm run typecheck");

    expect(architecture).toContain("GitHub Issues -> CMS adapter -> Post");
    expect(architecture).toContain("presentation -> cms/github-issues");

    expect(contentModel).toContain("pull_request");
    expect(contentModel).toContain("slug");
    expect(contentModel).toContain("publishedAt");

    expect(deployment).toContain("Publish Blog");
    expect(deployment).toContain("GITHUB_REPOSITORY");
    expect(deployment).toContain("GitHub Pages");
  });

  it("does not include placeholder URLs in docs", async () => {
    const docs = await Promise.all([
      readText("README.md"),
      readText("AGENTS.md"),
      readText("docs/architecture.md"),
      readText("docs/content-model.md"),
      readText("docs/deployment.md"),
    ]);

    expect(docs.join("\n")).not.toContain(["example", ".com"].join(""));
  });
});
