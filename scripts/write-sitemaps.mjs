import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const source = await readFile(join(distDir, 'sitemap-0.xml'), 'utf8');
const urls = [...source.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => {
    const pathname = new URL(url).pathname;
    return !['/calculator/', '/tier-list/'].includes(pathname) && !pathname.startsWith('/tier-list/');
  });

if (urls.length === 0) {
  throw new Error('No URLs found in dist/sitemap-0.xml');
}

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

const text = `${urls.join('\n')}\n`;
const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <sitemap><loc>https://1-muscle-to-arm-wrestle.pages.dev/sitemap.xml</loc></sitemap>',
  '</sitemapindex>',
  '',
].join('\n');

await Promise.all([
  writeFile(join(distDir, 'sitemap.xml'), xml),
  writeFile(join(distDir, 'sitemap-index.xml'), sitemapIndex),
  writeFile(join(distDir, 'gsc-sitemap.xml'), xml),
  writeFile(join(distDir, 'sitemap.txt'), text),
]);
