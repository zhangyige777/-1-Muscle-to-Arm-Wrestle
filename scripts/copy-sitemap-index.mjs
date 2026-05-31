import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

await copyFile(
  join(distDir, 'sitemap-0.xml'),
  join(distDir, 'sitemap.xml'),
);
