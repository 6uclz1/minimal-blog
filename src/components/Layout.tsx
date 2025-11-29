export const Layout = (props: {
  title: string;
  children: unknown;
  stylePath?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  const description = props.description || "A minimal blog";
  const image = props.image || "https://placehold.co/600x400";
  const url = props.url || "https://example.com";
  const type = props.type || "website";

  return (
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <meta name="description" content={description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={props.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />

        <link
          rel="stylesheet"
          href={props.stylePath || "./static/styles.css"}
        />
      </head>
      <body class="bg-black text-white font-sans antialiased min-h-screen flex flex-col">
        {props.children}
      </body>
    </html>
  );
};
