// The three languages say the same things (plan Phase 10): every string that exists in Spanish exists in English and Arabic,
// the legal texts have the same shape, and the Arabic plurals follow the language's rules (1 and 2 have their own words,
// 3–10 the plural, 11 and up the singular after the number).
import test from 'node:test';
import assert from 'node:assert/strict';
import { blogStrings } from './blog.js';
import { CT } from './consent.js';
import { PRIVACY } from './legal/privacy.js';
import { POLICY } from './legal/cookies.js';
import { CREDITS } from './legal/credits.js';
import { ACCESSIBILITY } from './legal/accessibility.js';

const same = (a, b, what) => assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), what);

test('the blog strings are the same in es, en and ar', () => {
  same(blogStrings('es'), blogStrings('en'), 'es vs en');
  same(blogStrings('es'), blogStrings('ar'), 'es vs ar');
});
test('the cookie card and the video gate are the same in es, en and ar', () => {
  same(CT.es, CT.en, 'es vs en');
  same(CT.es, CT.ar, 'es vs ar');
  for (const l of ['es', 'en', 'ar']) for (const [k, v] of Object.entries(CT[l])) assert.ok(String(v).length > 0, `${l}.${k} is empty`);
});
test('the policy, privacy and credits pages have the same blocks in every language', () => {
  for (const [name, doc] of Object.entries({ PRIVACY, POLICY, CREDITS, ACCESSIBILITY })) {
    const shape = (l) => doc[l].blocks.map((b) => Object.keys(b)[0]).join(',');
    assert.equal(shape('en'), shape('es'), `${name}: en has other blocks than es`);
    assert.equal(shape('ar'), shape('es'), `${name}: ar has other blocks than es`);
  }
});
test('the policy never promises what the code does not do: it does not say the visitor is asked again', () => {
  // K2: LUZ stores the policy version with each choice but never compares it
  assert.ok(!/volver[áa]s a elegir|te lo volver[ée] a preguntar|asked again|will ask you again|سنسألك مرة أخرى/i.test(JSON.stringify(POLICY)));
});
test('Arabic counts: 1 and 2 have their own word, 3–10 the plural, 11 and up the singular', () => {
  const ar = blogStrings('ar');
  assert.equal(ar.countOne(1), 'مقال واحد');
  assert.equal(ar.countOne(2), 'مقالان');
  assert.equal(ar.countOne(5), '5 مقالات');
  assert.equal(ar.countOne(11), '11 مقالًا');
  assert.equal(ar.projCountOne(1), 'مشروع واحد');
  assert.equal(ar.projCountOne(13), '13 مشروعًا');
  assert.ok(ar.min(1).endsWith('دقيقة واحدة'));      // «قراءة …»: «reading …»
  assert.ok(ar.min(7).endsWith('7 دقائق'));
});
test('Spanish and English counts', () => {
  assert.equal(blogStrings('es').countOne(1), '1 artículo');
  assert.equal(blogStrings('es').countOne(11), '11 artículos');
  assert.equal(blogStrings('en').projCountOne(1), '1 project');
  assert.equal(blogStrings('en').projCountOne(13), '13 projects');
});
