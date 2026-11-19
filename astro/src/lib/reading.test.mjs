import test from 'node:test';
import assert from 'node:assert/strict';
import { readingStats } from './reading.js';

test('counts the words that are read, not the markup', () => {
  const md = '## Title here\n\nOne <em>two</em> three.\n\n- four\n- five six\n\n```js\nconst notCounted = 1;\n```\n\n<figure class="video"><yt-facade video="x" title="No"></yt-facade></figure>';
  assert.deepEqual(readingStats(md), { words: 8, minutes: 1 });
});
test('at least one minute, and rounds by 220 words', () => {
  assert.equal(readingStats('').minutes, 1);
  assert.equal(readingStats('palabra '.repeat(660)).minutes, 3);
});
test('works on Arabic text', () => {
  assert.equal(readingStats('مرحبا بكم في موقعي').words, 4);
});
