import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanDist } from "./cleanDist";
import { copyPublicAssets } from "./copyPublicAssets";
import {
  type CreateBuildContextOptions,
  createBuildContext,
} from "./createBuildContext";
import { generateOgImages } from "./generateOgImages";
import { generateStaticSite } from "./generateStaticSite";
import { validateOutput } from "./validateOutput";

export const buildSite = async (
  options: CreateBuildContextOptions = {},
): Promise<void> => {
  const distDir = path.resolve("dist");
  const context = await createBuildContext(options);

  await cleanDist(distDir);
  await generateStaticSite(context.app, distDir);
  await copyPublicAssets(distDir);
  await generateOgImages(distDir, context.siteConfig, context.contentIndex);
  await validateOutput(distDir, context.siteConfig, context.contentIndex);
};

const isMainModule = (): boolean => {
  if (!process.argv[1]) {
    return false;
  }

  return fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
};

if (isMainModule()) {
  buildSite().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
