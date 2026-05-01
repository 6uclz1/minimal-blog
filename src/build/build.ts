import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanDist } from "./cleanDist";
import { copyPublicAssets } from "./copyPublicAssets";
import { createBuildContext } from "./createBuildContext";
import { generateStaticSite } from "./generateStaticSite";
import { validateOutput } from "./validateOutput";

export const buildSite = async (): Promise<void> => {
  const distDir = path.resolve("dist");
  const context = await createBuildContext();

  await cleanDist(distDir);
  await generateStaticSite(context.app, distDir);
  await copyPublicAssets(distDir);
  await validateOutput(distDir, context.contentIndex);
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
