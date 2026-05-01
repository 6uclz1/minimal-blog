import type { SiteConfig } from "../../config/site.config";
import { withBasePath } from "../../shared/path";

type NotFoundPageProps = {
  siteConfig: SiteConfig;
};

export const NotFoundPage = ({ siteConfig }: NotFoundPageProps) => (
  <section class="page-section">
    <div class="page-heading">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The requested page is not available in the generated site.</p>
      <a class="button-link" href={withBasePath(siteConfig, "/")}>
        Go home
      </a>
    </div>
  </section>
);
