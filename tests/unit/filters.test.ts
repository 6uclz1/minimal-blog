import { describe, expect, it } from "vitest";
import { isPublicPostIssue } from "../../src/cms/github-issues/filters";
import { loadIssueFixture } from "./githubIssueTestUtils";

describe("isPublicPostIssue", () => {
  it("accepts open published post issues", async () => {
    expect(isPublicPostIssue(await loadIssueFixture("published"))).toBe(true);
  });

  it("excludes pull requests returned by the issues API", async () => {
    expect(isPublicPostIssue(await loadIssueFixture("pr"))).toBe(false);
  });

  it("excludes draft and archived issues", async () => {
    expect(isPublicPostIssue(await loadIssueFixture("draft"))).toBe(false);
    expect(isPublicPostIssue(await loadIssueFixture("archived"))).toBe(false);
  });

  it("excludes closed issues and issues without required labels", async () => {
    const issue = await loadIssueFixture("published");

    expect(isPublicPostIssue({ ...issue, state: "closed" })).toBe(false);
    expect(isPublicPostIssue({ ...issue, labels: [{ name: "post" }] })).toBe(
      false,
    );
  });
});
