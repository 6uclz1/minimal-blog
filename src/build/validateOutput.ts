import { access, readFile } from "node:fs/promises";
import path from "node:path";
import type { SiteConfig } from "../config/site.config";
import type { ContentIndex } from "../content/usecases/buildContentIndex";
import {
  createDefaultOgImageDescriptor,
  createPostOgImageDescriptor,
  publicOgImagePathToDistPath,
} from "../seo/ogImage/paths";

export const validateOutput = async (
  distDir: string,
  siteConfig: SiteConfig,
  contentIndex: ContentIndex,
): Promise<void> => {
  const requiredFiles = [
    "index.html",
    path.join("posts", "index.html"),
    path.join("archive", "index.html"),
    "feed.xml",
    "sitemap.xml",
    "search-index.json",
    path.join("static", "styles.css"),
    ...contentIndex.detailPosts.map((post) =>
      path.join("posts", post.slug, "index.html"),
    ),
  ];

  for (const requiredFile of requiredFiles) {
    await assertFileExists(path.join(distDir, requiredFile));
  }

  const requiredOgImages = [
    createDefaultOgImageDescriptor(siteConfig),
    ...contentIndex.detailPosts
      .filter((post) => !post.ogImage)
      .map((post) => createPostOgImageDescriptor(siteConfig, post)),
  ];

  for (const descriptor of requiredOgImages) {
    await assertPngSize(
      publicOgImagePathToDistPath(distDir, descriptor.publicPath),
      descriptor.width,
      descriptor.height,
    );
  }
};

const assertFileExists = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
  } catch {
    throw new Error(`Expected generated file is missing: ${filePath}`);
  }
};

const assertPngSize = async (
  filePath: string,
  expectedWidth: number,
  expectedHeight: number,
): Promise<void> => {
  const png = await readFile(filePath);
  const signature = png.subarray(0, 8).toString("hex");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);

  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`Expected generated OGP image to be a PNG: ${filePath}`);
  }

  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(
      `Expected generated OGP image to be ${expectedWidth}x${expectedHeight}: ${filePath}`,
    );
  }
};
