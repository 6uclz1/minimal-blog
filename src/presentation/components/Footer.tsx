import type { SiteConfig } from "../../config/site.config";

type FooterProps = {
  siteConfig: SiteConfig;
};

export const Footer = ({ siteConfig }: FooterProps) => (
  <footer class="site-footer">
    <p>© 2026 {siteConfig.author}</p>
  </footer>
);
