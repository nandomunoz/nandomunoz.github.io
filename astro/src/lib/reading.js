/**
 * Words and minutes of reading of a post's Markdown body (plan, Phase 3). Computed at build time.
 * Like the maqueta, it counts what is read: not code, not tags, not a video or a link card.
 * @param {string} body
 * @param {number} [wordsPerMinute]
 * @returns {{ words: number, minutes: number }}
 */
export function readingStats(body, wordsPerMinute = 220) {
  const text = body
    .replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, ' ') // fenced code
    .replace(/<figure class="(?:embed|video)"[\s\S]*?<\/figure>/g, ' ') // a link or a video is not read
    .replace(/<[^>]+>/g, ' ') // tags
    .replace(/&[a-z]+;|&#\d+;/gi, ' ') // entities
    .replace(/^#{1,6}\s+/gm, '') // heading marks
    .replace(/^\s*(?:[-*]|\d+\.)\s+/gm, ''); // list marks
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return { words, minutes: Math.max(1, Math.round(words / wordsPerMinute)) };
}
