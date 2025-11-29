import { html } from "hono/html";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = (props: {
  title: string;
  children: unknown;
  stylePath?: string;
}) => {
  return (
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href={props.stylePath || "./static/styles.css"}
        />
      </head>
      <body class="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main class="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          {props.children}
        </main>
        <Footer />
      </body>
    </html>
  );
};
