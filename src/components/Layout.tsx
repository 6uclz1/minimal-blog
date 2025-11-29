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
        <link
          rel="stylesheet"
          href={props.stylePath || "./static/styles.css"}
        />
      </head>
      <body class="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
        {props.children}
      </body>
    </html>
  );
};
