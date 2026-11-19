// The addresses of the Cassette portfolio (the site nandomunoz.github.io served from the repo's root until nandomunoz.com,
// plan D5/U5). Once nandomunoz.com is the custom domain of the Pages site, GitHub answers nandomunoz.github.io/<path> with
// a 301 to nandomunoz.com/<path>, so the old paths land here: each gets a small page that sends it on to its counterpart.
// Hidden projects have no page of their own: they go to the list.

/** @param {{ id: string, hidden?: boolean }[]} projects  @returns {Record<string, string>} old path → new path */
export function legacyRedirects(projects) {
  const map = { '/es/': '/' };
  for (const p of projects) {
    if (p.hidden) map[`/proyectos/${p.id}/`] = '/proyectos/';   // the others keep their address: nothing to do
    map[`/projects/${p.id}/`] = p.hidden ? '/en/projects/' : `/en/projects/${p.id}/`;
  }
  for (const v of ['cassette', 'disquetes', 'vhs', 'digital']) {
    map[`/eastereggs/${v}/`] = '/';
    map[`/eastereggs/${v}/es/`] = '/';
    map[`/eastereggs/${v}/en/`] = '/en/';
  }
  return map;
}
