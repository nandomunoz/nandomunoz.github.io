// What the home computes at build time (plan Phase 6): the same project always gets the same block, the newer the denser,
// the longer the text the taller.
import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURED, DENSITY, densityOf, hashStr, projectBlocks } from './home.js';

const project = (id, year, words) => ({ data: { id, year, kanji: { char: '光', meaning: { es: 'luz', en: 'light', ar: 'نور' } }, es: { body: ['x'.repeat(words)] }, en: { body: ['x'.repeat(words)] }, ar: null } });

test('five featured projects, in a fixed order', () => {
  assert.deepEqual(FEATURED, ['luz', 'quien-canta-hoy', 'streetcai', 'ikay', 'toolbar-aem']);
});
test('the hash is stable and spreads ids', () => {
  assert.equal(hashStr('luz'), hashStr('luz'));
  assert.notEqual(hashStr('luz'), hashStr('ikay'));
  assert.ok(Number.isInteger(hashStr('¿Quién canta hoy?')) && hashStr('x') >= 0);
});
test('the newer the project, the denser its block; an unknown year gets the middle', () => {
  assert.ok(densityOf(2023) < densityOf(2024) && densityOf(2024) < densityOf(2025) && densityOf(2025) < densityOf(2026));
  assert.equal(densityOf(2019), 0.6);
  assert.deepEqual(Object.keys(DENSITY), ['2023', '2024', '2025', '2026']);
});
test('the longest text gets the tallest block, the shortest the shortest, and a phone gets fewer rows', () => {
  const [short, long] = projectBlocks([project('a', 2024, 100), project('b', 2025, 900)], 'es');
  assert.ok(long.front.rows > short.front.rows);
  assert.equal(short.front.rows, 11);
  assert.equal(long.front.rows, 37);
  assert.ok(short.front.narrow.rows < short.front.rows && long.front.narrow.rows < long.front.rows);
  assert.equal(long.gloss, 'luz');
});
test('the back layer is a ghost of the front: half as dense, its own pattern, no frame', () => {
  const [b] = projectBlocks([project('a', 2025, 300)], 'en');
  assert.equal(b.back.ghost, true);
  assert.equal(b.back.frame, false);
  assert.equal(b.back.density, b.front.density * 0.5);
  assert.equal(b.gloss, 'light');
});
test('a project with no text in the language falls back to the Spanish one for its length', () => {
  const [b] = projectBlocks([project('a', 2025, 300)], 'ar');
  assert.ok(Number.isFinite(b.front.rows));
});
