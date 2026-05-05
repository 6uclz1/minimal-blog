import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteConfig } from "../config/site.config";
import type { ContentIndex } from "../content/usecases/buildContentIndex";
import {
  createDefaultOgImageDescriptor,
  createPostOgImageDescriptor,
  publicOgImagePathToDistPath,
} from "../seo/ogImage/paths";
import { renderOgImagePng } from "../seo/ogImage/renderPng";
import { createOgImageSvg } from "../seo/ogImage/svg";

export const generateOgImages = async (
  distDir: string,
  siteConfig: SiteConfig,
  contentIndex: ContentIndex,
): Promise<void> => {
  const descriptors = [
    createDefaultOgImageDescriptor(siteConfig),
    ...contentIndex.detailPosts
      .filter((post) => !post.ogImage)
      .map((post) => createPostOgImageDescriptor(siteConfig, post)),
  ];

  for (const descriptor of descriptors) {
    const filePath = publicOgImagePathToDistPath(
      distDir,
      descriptor.publicPath,
    );
    const svg = createOgImageSvg(descriptor);
    const png = renderOgImagePng(svg);

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, png);
  }
};
