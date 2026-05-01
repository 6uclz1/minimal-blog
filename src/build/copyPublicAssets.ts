import { access, cp, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const exists = async (targetPath: string): Promise<boolean> => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

export const copyPublicAssets = async (distDir: string): Promise<void> => {
  const staticDir = path.join(distDir, "static");
  await mkdir(staticDir, { recursive: true });
  await cp("src/styles.css", path.join(staticDir, "styles.css"));

  if (!(await exists("public"))) {
    return;
  }

  const publicStats = await stat("public");
  if (!publicStats.isDirectory()) {
    return;
  }

  await cp("public", distDir, {
    force: true,
    recursive: true,
  });
};
