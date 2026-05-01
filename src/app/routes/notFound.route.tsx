import type { Context } from "hono";
import type { SiteConfig } from "../../config/site.config";
import { Layout } from "../../presentation/components/Layout";
import { NotFoundPage } from "../../presentation/pages/NotFoundPage";

export const renderNotFound = (c: Context, siteConfig: SiteConfig) =>
  c.html(
    <Layout siteConfig={siteConfig} title="Not Found">
      <NotFoundPage siteConfig={siteConfig} />
    </Layout>,
    404,
  );
