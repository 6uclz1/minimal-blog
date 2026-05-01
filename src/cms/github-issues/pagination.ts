const githubApiBaseUrl = "https://api.github.com";
const perPage = 100;

export const createIssuesPageUrl = (
  repository: string,
  page: number,
): string => {
  const url = new URL(`${githubApiBaseUrl}/repos/${repository}/issues`);
  url.searchParams.set("state", "all");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));

  return url.toString();
};

export const shouldFetchNextPage = (itemCount: number): boolean =>
  itemCount === perPage;
