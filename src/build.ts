import fs from "node:fs/promises";
import { Hono } from "hono";
import { toSSG } from "hono/ssg";
import mainApp from "./index";
import { getIssues } from "./lib/github";

async function build() {
  console.log("Starting build...");

  try {
    const articles = await getIssues();
    console.log(`Fetched ${articles.length} articles.`);

    // Create a new parent app to inject middleware BEFORE the main app's routes
    const app = new Hono();

    app.use("*", async (c, next) => {
      c.env = { ARTICLES: articles };
      await next();
    });

    // Mount the main app
    app.route("/", mainApp);

    const result = await toSSG(app, fs, {
      dir: "./dist",
    });

    if (result.success) {
      console.log("Build successful!");
    } else {
      console.error("Build failed:", result.error);
      process.exit(1);
    }
  } catch (e) {
    console.error("Error during build:", e);
    process.exit(1);
  }
}

build();
