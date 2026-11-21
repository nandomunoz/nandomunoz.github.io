// The addresses of the Cassette portfolio (the site nandomunoz.github.io served from the repo's root until nandomunoz.com,
// plan D5/U5). Once nandomunoz.com is the custom domain of the Pages site, GitHub answers nandomunoz.github.io/<path> with
// a 301 to nandomunoz.com/<path>, so the old paths land here: each gets a small page that sends it on to its counterpart.
// Hidden projects have no page of their own: they go to the list. The easter eggs keep their address and their pages.

/** @param {{ id: string, hidden?: boolean }[]} projects  @returns {Record<string, string>} old path → new path */
export function legacyRedirects(projects) {
  const map = { '/es/': '/' };
  for (const p of projects) {
    if (p.hidden) map[`/proyectos/${p.id}/`] = '/proyectos/';   // the others keep their address: nothing to do
    map[`/projects/${p.id}/`] = p.hidden ? '/en/projects/' : `/en/projects/${p.id}/`;
  }
  // /eastereggs/<version>/ are not here: those versions are published as they are (tools/eastereggs.mjs), the footer's barcode leads to them
  return map;
}
