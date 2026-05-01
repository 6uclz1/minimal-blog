import { access } from "node:fs/promises";
import path from "node:path";
import type { ContentIndex } from "../content/usecases/buildContentIndex";

export const validateOutput = async (
  distDir: string,
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
};

const assertFileExists = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
  } catch {
    throw new Error(`Expected generated file is missing: ${filePath}`);
  }
};
