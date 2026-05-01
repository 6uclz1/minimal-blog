import { describe, expect, it } from "vitest";
import type { GitHubIssue } from "../../src/cms/github-issues/GitHubIssue";
import { GitHubIssueClient } from "../../src/cms/github-issues/GitHubIssueClient";

const createResponse = (issues: GitHubIssue[]): Response =>
  new Response(JSON.stringify(issues), {
    headers: { "content-type": "application/json" },
    status: 200,
  });

describe("GitHubIssueClient", () => {
  it("fetches all issue pages until a short page is returned", async () => {
    const requests: Array<RequestInfo | URL> = [];
    const fullPage = Array.from({ length: 100 }, (_, index) => ({
      number: index + 1,
    })) as GitHubIssue[];
    const finalPage = [{ number: 101 }] as GitHubIssue[];
    const fetcher = async (input: RequestInfo | URL): Promise<Response> => {
      requests.push(input);
      return createResponse(requests.length === 1 ? fullPage : finalPage);
    };

    const client = new GitHubIssueClient({
      fetcher,
      repository: "6uclz1/minimal-blog",
      token: "token-value",
    });

    const issues = await client.listIssues();

    expect(issues).toHaveLength(101);
    expect(String(requests[0])).toContain("per_page=100");
    expect(String(requests[0])).toContain("page=1");
    expect(String(requests[1])).toContain("page=2");
  });

  it("throws a clear error when GitHub returns an error response", async () => {
    const fetcher = async (): Promise<Response> =>
      new Response("bad credentials", {
        status: 401,
        statusText: "Unauthorized",
      });
    const client = new GitHubIssueClient({
      fetcher,
      repository: "6uclz1/minimal-blog",
    });

    await expect(client.listIssues()).rejects.toThrow(
      "Failed to fetch GitHub issues: 401 Unauthorized",
    );
  });
});
