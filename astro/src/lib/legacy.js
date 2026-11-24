// The addresses of the Cassette portfolio (the site nandomunoz.github.io served from the repo's root until nandomunoz.com,
// plan D5/U5). Once nandomunoz.com is the custom domain of the Pages site, GitHub answers nandomunoz.github.io/<path> with
// a 301 to nandomunoz.com/<path>, so the old paths land here: each gets a small page that sends it on to its counterpart.
// Hidden projects have no page of their own: they go to the list. The easter eggs keep their address and their pages.

/** removed post → the post that replaces it */
const MOVED_POSTS = { 'introduccion-a-la-ia-2': 'introduccion-a-la-ia' };

/** @param {{ id: string, hidden?: boolean }[]} projects  @returns {Record<string, string>} old path → new path */
export function legacyRedirects(projects) {
  const map = { '/es/': '/' };
  for (const p of projects) {
    if (p.hidden) map[`/proyectos/${p.id}/`] = '/proyectos/';   // the others keep their address: nothing to do
    map[`/projects/${p.id}/`] = p.hidden ? '/en/projects/' : `/en/projects/${p.id}/`;
  }
  // posts whose address changed (a post published twice kept the plain slug): the old address, in every language, goes to the new one
  for (const [from, to] of Object.entries(MOVED_POSTS)) for (const pre of ['', '/en', '/ar']) map[`${pre}/blog/${from}/`] = `${pre}/blog/${to}/`;
  // /eastereggs/<version>/ are not here: those versions are published as they are (tools/eastereggs.mjs), the footer's barcode leads to them
  return map;
}
