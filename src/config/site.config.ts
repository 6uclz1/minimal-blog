export type SiteConfig = {
  title: string;
  description: string;
  url: string;
  basePath: string;
  author: string;
  defaultOgImage: string;
};

export const siteConfig: SiteConfig = {
  title: "6uclz1's Blog",
  description:
    "A zero-runtime-dependency static blog generator backed by GitHub Issues.",
  url: "https://6uclz1.github.io/minimal-blog",
  basePath: "/minimal-blog",
  author: "6uclz1",
  defaultOgImage: "/og-default.png",
};
