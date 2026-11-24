import test from 'node:test';
import assert from 'node:assert/strict';
import { legacyRedirects } from './legacy.js';

const map = legacyRedirects([{ id: 'luz' }, { id: 'illo-loader', hidden: true }]);

test('the old Spanish home goes to the root', () => assert.equal(map['/es/'], '/'));
test('a Spanish project page that still exists is not redirected', () => assert.equal(map['/proyectos/luz/'], undefined));
test('a hidden project goes to the list', () => {
  assert.equal(map['/proyectos/illo-loader/'], '/proyectos/');
  assert.equal(map['/projects/illo-loader/'], '/en/projects/');
});
test('the English project pages move under /en/', () => assert.equal(map['/projects/luz/'], '/en/projects/luz/'));
test('the easter eggs are published, not redirected', () => {
  for (const k of Object.keys(map)) assert.ok(!k.startsWith('/eastereggs/'), k);
});
test('no address redirects to itself or to another redirect', () => {
  for (const [from, to] of Object.entries(map)) { assert.notEqual(from, to); assert.equal(map[to], undefined); }
});
test('a post whose address changed goes to the new one, in every language', () => {
  assert.equal(map['/blog/introduccion-a-la-ia-2/'], '/blog/introduccion-a-la-ia/');
  assert.equal(map['/en/blog/introduccion-a-la-ia-2/'], '/en/blog/introduccion-a-la-ia/');
  assert.equal(map['/ar/blog/introduccion-a-la-ia-2/'], '/ar/blog/introduccion-a-la-ia/');
});
