#!/usr/bin/env node
// Leak check for the AI folder (.ai/: plans, reports, review roles, the WordPress extract) before it leaves
// this machine. It looks for what must never be published: secrets and tokens, private keys, e-mail
// addresses that are not on the allow list, phone numbers, absolute paths of a personal machine, and files
// that must never be versioned (local settings, .env, keys). It blocks; it does not fix.
//
//   node tools/ai-leak-check.mjs            the files of .ai/ as they are on disk
//   node tools/ai-leak-check.mjs --staged   the files of .ai/ in the index (what the next commit holds)
//   node tools/ai-leak-check.mjs --push     the pre-push hook (.githooks/pre-push): every version of every
//                                           file of .ai/ in the commits about to be pushed, read from stdin
//
// Allowed e-mail addresses and known false positives: tools/ai-leak-check.json. Exit 1 when something is found.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const SCOPE = '.ai/';
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/ai-leak-check.json'), 'utf8'));
const allowEmail = (e) => cfg.allowEmails.some((a) => (a.startsWith('@') ? e.toLowerCase().endsWith(a) : e.toLowerCase() === a));
const allowLine = (line) => cfg.allowSnippets.some((s) => line.includes(s));
const MAX_BYTES = 2 * 1024 * 1024;

const FORBIDDEN_FILES = [
  /(^|\/)settings\.local\.json/, /(^|\/)\.env(\.|$)/, /\.(pem|key|p12|pfx|keystore|jks)$/i,
  /(^|\/)id_(rsa|ed25519|ecdsa|dsa)(\.pub)?$/, /(^|\/)credentials(\.|$)/i, /(^|\/)\.netrc$/, /(^|\/)\.npmrc$/,
];
const RULES = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b/],
  ['API key (sk-)', /\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}/],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{10,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['secret in an assignment', /\b(api[_-]?key|secret|access[_-]?token|auth[_-]?token|passw(or)?d|client[_-]?secret)\b["']?\s*[:=]\s*["']?(?!\$\{|<|\*{3}|x{4})[A-Za-z0-9_\-/+=.]{12,}/i],
  ['bearer token', /\bBearer\s+[A-Za-z0-9_\-.=]{20,}/],
  ['local path', /(\/home\/[a-z_][a-z0-9_-]*\/|\/Users\/[A-Za-z][^/\s]*\/|[A-Z]:\\Users\\)/],
  // a Spanish-style number written for people (6xx xxx xxx, +34 …); not the decimals of an SVG path or a JSON value
  ['phone number', /(?<![\d.,+\-])(\+34[\s.-]?)?[6-9]\d{2}[\s-]\d{3}[\s-]\d{3}(?![\d.,])|\+34[\s.-]?[6-9]\d{8}(?!\d)/],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const mask = (s) => (s.length <= 8 ? '***' : s.slice(0, 4) + '…' + s.slice(-2));

/** findings for one file's text (or its name alone) */
function scan(file, buf) {
  const out = [];
  if (FORBIDDEN_FILES.some((r) => r.test(file))) out.push({ file, line: 0, kind: 'file that must never be versioned', hit: path.basename(file) });
  if (buf.length > MAX_BYTES) out.push({ file, line: 0, kind: `file over ${MAX_BYTES / 1048576} MB`, hit: `${(buf.length / 1048576).toFixed(1)} MB` });
  if (buf.includes(0)) return out;   // binary: the name and size checks are all we can do
  buf.toString('utf8').split('\n').forEach((line, i) => {
    if (allowLine(line)) return;
    for (const [kind, re] of RULES) { const m = line.match(re); if (m) out.push({ file, line: i + 1, kind, hit: mask(m[0]) }); }
    for (const e of line.match(EMAIL) || []) if (!allowEmail(e) && !/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(e)) out.push({ file, line: i + 1, kind: 'e-mail not on the allow list', hit: mask(e) });
  });
  return out;
}

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'buffer', maxBuffer: 256 * 1024 * 1024 });
const mode = process.argv[2] || '';
let findings = [], checked = 0;

if (mode === '--push') {
  const ZERO = /^0+$/;
  const lines = fs.readFileSync(0, 'utf8').trim().split('\n').filter(Boolean);
  const seen = new Set();
  for (const l of lines) {
    const [, localSha, , remoteSha] = l.split(' ');
    if (ZERO.test(localSha)) continue;   // a deletion of a remote branch sends nothing
    const range = ZERO.test(remoteSha) ? [localSha, '--not', '--remotes'] : [`${remoteSha}..${localSha}`];
    // every blob the pushed commits bring, with its path: intermediate versions travel too
    const objs = git('rev-list', '--objects', ...range).toString('utf8').split('\n');
    for (const o of objs) {
      const sp = o.indexOf(' ');
      if (sp < 0) continue;
      const sha = o.slice(0, sp), file = o.slice(sp + 1);
      if (!file.startsWith(SCOPE) || seen.has(sha)) continue;
      if (git('cat-file', '-t', sha).toString().trim() !== 'blob') continue;
      seen.add(sha); checked++;
      findings.push(...scan(file, git('cat-file', 'blob', sha)));
    }
  }
} else {
  const files = git('ls-files', '-z', ...(mode === '--staged' ? ['--cached'] : ['--cached', '--others', '--exclude-standard']), '--', SCOPE)
    .toString('utf8').split('\0').filter(Boolean);
  for (const f of files) {
    let buf;
    if (mode === '--staged') { try { buf = git('show', `:${f}`); } catch { continue; } }
    else { if (!fs.existsSync(path.join(ROOT, f))) continue; buf = fs.readFileSync(path.join(ROOT, f)); }
    checked++;
    findings.push(...scan(f, buf));
  }
}

if (!findings.length) {
  console.log(`✓ ai-leak-check: ${checked} file version(s) of ${SCOPE} checked, nothing to hide`);
  process.exit(0);
}
console.error(`✗ ai-leak-check: ${findings.length} finding(s) in ${SCOPE} — nothing was pushed\n`);
for (const f of findings) console.error(`  ${f.file}${f.line ? ':' + f.line : ''}  ${f.kind}  (${f.hit})`);
console.error(`\nRemove it from the file (and from the commits being pushed), or, if it is public on purpose,\nadd it to tools/ai-leak-check.json. Last resort, at your own risk: git push --no-verify.`);
process.exit(1);
