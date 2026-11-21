import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { code128, QUIET } from './barcode.js';

test('a symbol is start + data + check + stop, with quiet zones', () => {
  const { bars, width } = code128('AB');
  // 11 modules per code (start, A, B, check) plus the 13-module stop, plus the quiet zones on both sides
  assert.equal(width, 11 * 4 + 13 + QUIET * 2);
  assert.deepEqual(bars[0], [QUIET, 2]);                  // start B begins 11010010000
  const [x, w] = bars.at(-1);
  assert.equal(x + w, width - QUIET);                      // the stop's last bar ends the symbol
});
test('only printable ASCII can be encoded', () => assert.throws(() => code128('VERSIÓN'), /cannot encode/));

// The Cassette draws the same symbol in build.mjs; its page for the cassette version carries "NANDOMUNOZ.COM" (the way back to the home). Both
// encoders must give the very same bars (skipped if that page is not in this checkout).
const page = new URL('../../../eastereggs/cassette/es/index.html', import.meta.url);
test('it draws the same bars as the Cassette build', { skip: !fs.existsSync(page) }, () => {
  const svg = fs.readFileSync(page, 'utf8').match(/<svg class="barcode" viewBox="0 0 (\d+) 40"[^>]*>(.*?)<\/svg>/s);
  const theirs = [...svg[2].matchAll(/<rect x="(\d+)" width="(\d+)"/g)].map((m) => [+m[1], +m[2]]);
  const { bars, width } = code128('NANDOMUNOZ.COM');
  assert.equal(width, +svg[1]);
  assert.deepEqual(bars, theirs);
});
