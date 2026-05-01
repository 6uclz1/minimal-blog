import type { SiteConfig } from "../../config/site.config";

type FooterProps = {
  siteConfig: SiteConfig;
};

export const Footer = ({ siteConfig }: FooterProps) => (
  <footer class="site-footer">
    <p>
      Built as a static site by {siteConfig.author}. Content is modeled as
      normalized posts.
    </p>
  </footer>
);
