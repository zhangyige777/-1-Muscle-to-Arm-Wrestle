import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

await copyFile(
  join(distDir, 'sitemap-index.xml'),
  join(distDir, 'sitemap.xml'),
);

