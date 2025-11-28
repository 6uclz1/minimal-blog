import { toSSG } from 'hono/ssg';
import fs from 'node:fs/promises';
import app from './index';
import { getIssues } from './lib/github';

async function build() {
    console.log('Starting build...');

    try {
        const articles = await getIssues();
        console.log(`Fetched ${articles.length} articles.`);

        app.use('*', async (c, next) => {
            c.env = { ARTICLES: articles };
            await next();
        });

        const result = await toSSG(app, fs, {
            dir: './dist',
        });

        if (result.success) {
            console.log('Build successful!');
        } else {
            console.error('Build failed:', result.error);
            process.exit(1);
        }
    } catch (e) {
        console.error('Error during build:', e);
        process.exit(1);
    }
}

build();
