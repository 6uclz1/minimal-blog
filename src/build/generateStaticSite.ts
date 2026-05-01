import * as fs from "node:fs/promises";
import type { Hono } from "hono";
import { toSSG } from "hono/ssg";

export const generateStaticSite = async (
  app: Hono,
  distDir: string,
): Promise<void> => {
  const result = await toSSG(app, fs, {
    dir: distDir,
  });

  if (!result.success) {
    throw result.error ?? new Error("Static site generation failed");
  }
};
