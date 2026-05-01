import { rm } from "node:fs/promises";

export const cleanDist = async (distDir: string): Promise<void> => {
  await rm(distDir, { force: true, recursive: true });
};
