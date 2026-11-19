// «Cite yes, train no» (plan Phase 9, GEO): search engines and AI assistants may read and cite the site; the
// Content-Signal line (Cloudflare's convention) says it may not be used to train models. Same as the WordPress it replaces.
export const GET = ({ site }: { site: URL }) =>
  new Response(`User-agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
