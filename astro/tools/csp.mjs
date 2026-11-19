// Content-Security-Policy as a <meta> in every page of dist/ (plan Phase 10/11). GitHub Pages cannot send headers, and the meta
// form covers what matters here: no script that is not ours runs (inline scripts are allowed by their SHA-256 hash, so an
// injected one would not), nothing is loaded from another origin but the YouTube embed (and only after the cookie «yes»),
// no plugins, no <base> tricks. It cannot do frame-ancestors, report-uri or sandbox (they are ignored in a meta).
// Runs after `astro build` (npm run build). Reads every .html, hashes the inline classic and module scripts, writes the
// policy right after <meta charset>, before everything else in <head> (a policy only counts for what comes after it).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dist = new URL('../dist/', import.meta.url).pathname;
// style-src keeps 'unsafe-inline': the pages and LUZ set style attributes and the dot engine sets custom properties; styles
// cannot run code. img-src has data: and blob: for the canvases' pictures and i.ytimg.com for a video's thumbnail (only after the cookie yes).
const policy = (hashes) => [
  "default-src 'self'",
  `script-src 'self' ${hashes.map((h) => `'sha256-${h}'`).join(' ')} 'inline-speculation-rules'`.replace('  ', ' '),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  'frame-src https://www.youtube-nocookie.com',
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'"
].join('; ');

let pages = 0, scripts = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (!e.name.endsWith('.html')) continue;
    let html = fs.readFileSync(f, 'utf8');
    if (html.includes('http-equiv="content-security-policy"')) continue;      // already done
    const hashes = new Set();
    for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      const type = m[1].match(/\btype="([^"]+)"/)?.[1];
      if (/\bsrc=/.test(m[1])) continue;                                       // external: 'self'
      if (type && type !== 'module' && type !== 'speculationrules') continue;   // JSON and JSON-LD are data, not executed (speculation rules need their hash too)
      hashes.add(crypto.createHash('sha256').update(m[2]).digest('base64')); scripts++;
    }
    const meta = `<meta http-equiv="content-security-policy" content="${policy([...hashes])}">`;
    if (!/<head[^>]*>/.test(html)) continue;                                    // a redirect stub without head: nothing to protect
    // after <meta charset> (it must stay within the first 1024 bytes), before any script or link
    html = /<meta charset="[^"]*">/.test(html) ? html.replace(/(<meta charset="[^"]*">)/, `$1${meta}`) : html.replace(/<head([^>]*)>/, `<head$1>${meta}`);
    fs.writeFileSync(f, html);
    pages++;
  }
})(dist);
console.log(`✓ CSP in ${pages} pages (${scripts} inline scripts hashed)`);
