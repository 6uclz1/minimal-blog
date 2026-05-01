import { describe, expect, it } from "vitest";
import { createBuildContext } from "../../src/build/createBuildContext";
import type { GitHubIssue } from "../../src/cms/github-issues/GitHubIssue";
import { loadIssueFixture } from "../unit/githubIssueTestUtils";

const createResponse = (issues: GitHubIssue[]): Response =>
  new Response(JSON.stringify(issues), {
    headers: { "content-type": "application/json" },
    status: 200,
  });

describe("createBuildContext", () => {
  it("uses fixture content when GITHUB_REPOSITORY is not set", async () => {
    const context = await createBuildContext({
      env: {},
    });

    expect(context.contentIndex.detailPosts.map((post) => post.slug)).toContain(
      "hello-hono",
    );
  });

  it("uses GitHub Issues content when GITHUB_REPOSITORY is set", async () => {
    const issue = await loadIssueFixture("published");
    const context = await createBuildContext({
      env: {
        GITHUB_REPOSITORY: "6uclz1/minimal-blog",
        GITHUB_TOKEN: "token-value",
      },
      fetcher: async () => createResponse([issue]),
    });

    expect(context.contentIndex.detailPosts.map((post) => post.slug)).toEqual([
      "github-issues-cms-blog",
    ]);
  });
});
