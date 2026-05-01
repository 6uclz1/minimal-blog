import type { SiteConfig } from "../../config/site.config";
import { withBasePath } from "../../shared/path";

type HeaderProps = {
  siteConfig: SiteConfig;
};

export const Header = ({ siteConfig }: HeaderProps) => (
  <header class="site-header">
    <a class="site-header__brand" href={withBasePath(siteConfig, "/")}>
      {siteConfig.title}
    </a>
    <nav class="site-header__nav" aria-label="Primary navigation">
      <a href={withBasePath(siteConfig, "/posts/")}>Posts</a>
      <a href={withBasePath(siteConfig, "/archive/")}>Archive</a>
    </nav>
  </header>
);
