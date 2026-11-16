#!/usr/bin/env python3
"""Rasterize the projects' kanji into dot grids, once.

The site ships no CJK font and the fallback differs per machine, so the dotted
kanji (the protagonist of each project card and of the open panel's field) are
data, not text: this script reads data/projects.json, finds each project's entry in
data/kanjis-repos.json by repo URL, draws its kanji in Noto Sans CJK JP Regular
(SIL OFL 1.1) and keeps the bitmap at three sizes (TIERS: the glyph's height in
dots). Each size is rasterized on its own grid, not scaled, so strokes stay one or
two dots wide at every size; the site picks the largest that fits. It writes
maqueta/shared/kanji-cells.js.

  python3 maqueta/tools/kanji-cells.py            write the module
  python3 maqueta/tools/kanji-cells.py --look     print every size as ASCII (no write)
  python3 maqueta/tools/kanji-cells.py --look 光 紋   only those kanji

Needs Pillow.
"""
import json, sys, pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONT = {w: f'/usr/share/fonts/opentype/noto/NotoSansCJK-{w}.ttc' for w in ('Regular', 'Bold')}   # Noto Sans CJK JP (index 0)
OUT = ROOT / 'maqueta/shared/kanji-cells.js'
TIERS = (24, 32, 40)   # glyph heights, in dots: a phone card, a card, the open panel's field
WEIGHT, THRESH, GROW = 'Regular', 0.42, 0.12   # light strokes, a little grown: 1–2 dots wide, never fused, never lost


MEANING = {}   # kanji → [first sense in Spanish, in English], for the tiny caption under each image


def load():
    projects = json.loads((ROOT / 'data/projects.json').read_text())
    repos = {e['url'].rstrip('/').lower(): e for e in json.loads((ROOT / 'data/kanjis-repos.json').read_text())['repos']}
    out = []
    for p in projects:
        e = repos.get((p.get('repo') or '').rstrip('/').lower())
        out.append((p['id'], e['kanji']['char'] if e else None))
        if e:
            k = e['kanji']
            first = lambda t: (t or '').split(',')[0].strip().lower()
            MEANING[k['char']] = [first(k.get('meaning')), first(k.get('meaning_en') or k.get('meaning'))]
    return out


def render(ch, n, weight=WEIGHT, thresh=THRESH, grow=GROW, hi=16):
    """The glyph fitted to an n×n grid (its own bounding box), as dot rows: the cell's
    area coverage against a threshold. Small shifts of the glyph on the grid are tried and
    the bitmap closest to the coverage wins (strokes are neither eaten nor fused by a
    bad alignment with the grid)."""
    S = n * hi
    font = ImageFont.truetype(FONT[weight], S * 2, index=0)
    im = Image.new('L', (S * 4, S * 4), 0)
    ImageDraw.Draw(im).text((S, S), ch, font=font, fill=255, stroke_width=round(grow * S * 2 / n))
    g = im.crop(im.getbbox())
    k = S / max(g.size)
    g = g.resize((max(1, round(g.width * k)), max(1, round(g.height * k))), Image.LANCZOS)
    w, h = min(n, (g.width + hi - 1) // hi), min(n, (g.height + hi - 1) // hi)
    best = None
    for dx in range(-hi // 2, hi // 2, 2):
        for dy in range(-hi // 2, hi // 2, 2):
            canvas = Image.new('L', (w * hi, h * hi), 0)
            canvas.paste(g, ((w * hi - g.width) // 2 + dx, (h * hi - g.height) // 2 + dy))
            px = canvas.resize((w, h), Image.BOX).load()
            cov = [[px[x, y] / 255 for x in range(w)] for y in range(h)]
            bm = [[1 if c >= thresh else 0 for c in r] for r in cov]
            err = sum((cov[y][x] - bm[y][x]) ** 2 for y in range(h) for x in range(w))
            if best is None or err < best[0]:
                best = (err, bm)
    rows = [''.join('#' if c else '.' for c in r) for r in best[1]]
    while rows and '#' not in rows[0]: rows.pop(0)
    while rows and '#' not in rows[-1]: rows.pop()
    cols = [x for x in range(len(rows[0])) if any(r[x] == '#' for r in rows)]
    return [r[cols[0]:cols[-1] + 1] for r in rows]


def main():
    look = '--look' in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    pairs = load()
    chars = []
    for pid, ch in pairs:
        if ch is None:
            print(f'! {pid}: no entry in data/kanjis-repos.json (matched by repo URL)', file=sys.stderr)
        elif ch not in chars:
            chars.append(ch)
    if look:
        for ch in (only or chars):
            print(f'=== {ch}')
            blocks = [render(ch, n) for n in TIERS]
            for y in range(max(len(b) for b in blocks)):
                print('   '.join((b[y] if y < len(b) else '').ljust(max(len(r) for r in b)) for b in blocks))
        return
    data = {ch: {n: render(ch, n) for n in TIERS} for ch in chars}
    lines = ["// Trama · the projects' kanji as dot cells, one string per row (# = a lit dot), like the",
             "// 3×5 digits in dots.js, at three sizes (the glyph's height in dots is the key). Made once by",
             '// maqueta/tools/kanji-cells.py from Noto Sans CJK JP Regular (SIL OFL 1.1, credited in',
             '// shared/credits.js); do not edit by hand.',
             'export const KANJI = {']
    for ch, tiers in data.items():
        lines.append(f'  {ch}: {{')
        for n, rows in tiers.items():
            lines.append(f"    {n}: {{ w: {len(rows[0])}, h: {len(rows)}, rows: [{', '.join(repr(r) for r in rows)}] }},")
        lines.append('  },')
    lines.append('};')
    lines.append('')
    lines.append('// the kanji each project id wears (matched by repo URL against data/kanjis-repos.json)')
    lines.append('export const KANJI_OF = {')
    for pid, ch in pairs:
        if ch:
            lines.append(f"  '{pid}': '{ch}',")
    lines.append('};')
    lines.append("export const kanjiOf = (id) => KANJI_OF[id] || '';")
    lines.append('')
    lines.append("// the first sense of the kanji's meaning, [es, en] (data/kanjis-repos.json: meaning, meaning_en)")
    lines.append('const MEANING = {')
    for ch in data:
        lines.append(f"  {ch}: [{MEANING[ch][0]!r}, {MEANING[ch][1]!r}],")
    lines.append('};')
    lines.append("export const kanjiGloss = (ch, lang) => (MEANING[[...(ch || '')][0]] || [])[lang === 'en' ? 1 : 0] || '';")
    OUT.write_text('\n'.join(lines) + '\n')
    print('wrote', OUT.relative_to(ROOT), {c: [f'{len(r[0])}x{len(r)}' for r in t.values()] for c, t in data.items()})


if __name__ == '__main__':
    main()
