import { readFile } from "node:fs/promises";
import path from "node:path";
import type { GitHubIssue } from "../../src/cms/github-issues/GitHubIssue";

export const loadIssueFixture = async (name: string): Promise<GitHubIssue> => {
  const fixturePath = path.join(
    "tests",
    "fixtures",
    "github-issues",
    `${name}.json`,
  );
  const json = await readFile(fixturePath, "utf8");

  return JSON.parse(json) as GitHubIssue;
};
