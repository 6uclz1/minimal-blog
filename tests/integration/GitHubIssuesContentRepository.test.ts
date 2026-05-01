import { describe, expect, it } from "vitest";
import type { GitHubIssueClient } from "../../src/cms/github-issues/GitHubIssueClient";
import { GitHubIssuesContentRepository } from "../../src/cms/github-issues/GitHubIssuesContentRepository";
import { loadIssueFixture } from "../unit/githubIssueTestUtils";

describe("GitHubIssuesContentRepository", () => {
  it("filters public issues, converts them to posts, and resolves duplicate slugs", async () => {
    const first = {
      ...(await loadIssueFixture("published")),
      number: 20,
      title: "Duplicate Title",
      body: "First body.",
    };
    const second = {
      ...(await loadIssueFixture("published")),
      number: 21,
      title: "Duplicate Title",
      body: "Second body.",
    };
    const draft = await loadIssueFixture("draft");
    const pr = await loadIssueFixture("pr");
    const client = {
      listIssues: async () => [first, second, draft, pr],
    } satisfies Pick<GitHubIssueClient, "listIssues">;
    const repository = new GitHubIssuesContentRepository({
      client,
      defaultOgImage: "/og-default.png",
    });

    const posts = await repository.listPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "duplicate-title",
      "duplicate-title-issue-21",
    ]);
  });
});
