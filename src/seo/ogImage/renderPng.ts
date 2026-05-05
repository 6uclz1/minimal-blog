import { Resvg } from "@resvg/resvg-js";

export const renderOgImagePng = (svg: string): Buffer => {
  const renderer = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  return renderer.render().asPng();
};
