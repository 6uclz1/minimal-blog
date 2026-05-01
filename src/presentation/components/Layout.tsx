import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import type { SiteConfig } from "../../config/site.config";
import { withBasePath } from "../../shared/path";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: Child;
  description?: string;
  siteConfig: SiteConfig;
  title?: string;
};

export const Layout = ({
  children,
  description,
  siteConfig,
  title,
}: LayoutProps) => {
  const pageTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;
  const pageDescription = description ?? siteConfig.description;

  return (
    <>
      {raw("<!doctype html>")}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link
            rel="stylesheet"
            href={withBasePath(siteConfig, "/static/styles.css")}
          />
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
