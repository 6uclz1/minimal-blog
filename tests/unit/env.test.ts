import { describe, expect, it } from "vitest";
import { loadGitHubIssuesEnv } from "../../src/config/env";

describe("loadGitHubIssuesEnv", () => {
  it("parses GitHub repository and optional token", () => {
    expect(
      loadGitHubIssuesEnv({
        GITHUB_REPOSITORY: "6uclz1/minimal-blog",
        GITHUB_TOKEN: "token-value",
      }),
    ).toEqual({
      githubRepository: "6uclz1/minimal-blog",
      githubToken: "token-value",
    });
  });

  it("throws a clear error when GITHUB_REPOSITORY is missing", () => {
    expect(() => loadGitHubIssuesEnv({})).toThrow(
      "GITHUB_REPOSITORY environment variable is required",
    );
  });

  it("throws a clear error when GITHUB_REPOSITORY is malformed", () => {
    expect(() =>
      loadGitHubIssuesEnv({
        GITHUB_REPOSITORY: "minimal-blog",
      }),
    ).toThrow('GITHUB_REPOSITORY must use "owner/repo" format');
  });
});
