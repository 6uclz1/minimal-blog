import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import type { SiteConfig } from "../../config/site.config";
import { createMetadata, type PageMetadata } from "../../seo/metadata";
import { createOpenGraphMetadata } from "../../seo/openGraph";
import { withBasePath } from "../../shared/path";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: Child;
  description?: string;
  metadata?: PageMetadata;
  siteConfig: SiteConfig;
  structuredData?: unknown;
  title?: string;
};

export const Layout = ({
  children,
  description,
  metadata,
  siteConfig,
  structuredData,
  title,
}: LayoutProps) => {
  const pageMetadata =
    metadata ??
    createMetadata(siteConfig, {
      description,
      path: "/",
      title,
    });
  const openGraph = createOpenGraphMetadata(siteConfig, pageMetadata);
  const jsonLd = structuredData
    ? JSON.stringify(structuredData).replaceAll("<", "\\u003c")
    : undefined;

  return (
    <>
      {raw("<!doctype html>")}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{pageMetadata.title}</title>
          <meta name="description" content={pageMetadata.description} />
          {pageMetadata.noindex ? (
            <meta name="robots" content="noindex" />
          ) : null}
          <link rel="canonical" href={pageMetadata.canonicalUrl} />
          <meta property="og:title" content={openGraph.title} />
          <meta property="og:description" content={openGraph.description} />
          <meta property="og:type" content={openGraph.type} />
          <meta property="og:url" content={openGraph.url} />
          <meta property="og:image" content={openGraph.image} />
          <meta name="twitter:card" content="summary_large_image" />
          <link
            rel="stylesheet"
            href={withBasePath(siteConfig, "/static/styles.css")}
          />
          {jsonLd ? (
            <script type="application/ld+json">{raw(jsonLd)}</script>
          ) : null}
        </head>
        <body>
          <Header siteConfig={siteConfig} />
          <main class="site-main">{children}</main>
          <Footer siteConfig={siteConfig} />
        </body>
      </html>
    </>
  );
};
