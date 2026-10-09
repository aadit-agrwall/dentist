import {writeFile} from 'node:fs/promises';
import {site} from '../src/config/site.js';
if(site.demo){
  await writeFile(new URL('../public/robots.txt',import.meta.url),'User-agent: *\nDisallow: /\n# Clinic presentation demo.\n');
  await writeFile(new URL('../public/sitemap.xml',import.meta.url),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
  console.log('Demo indexing disabled; sitemap intentionally empty.');
  process.exit(0);
}
if(!site.url){console.log('Set site.url to the final HTTPS domain before generating the sitemap.');process.exit(0);}
const url=new URL(site.url);if(url.protocol!=='https:')throw new Error('Use the production HTTPS domain.');
const canonical=new URL('./',url).href,escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;');
await writeFile(new URL('../public/sitemap.xml',import.meta.url),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(canonical)}</loc></url></urlset>\n`);
await writeFile(new URL('../public/robots.txt',import.meta.url),`User-agent: *\nAllow: /\nDisallow: ${url.pathname}styleguide\nSitemap: ${canonical}sitemap.xml\n`);
console.log('Production sitemap and robots.txt generated.');
