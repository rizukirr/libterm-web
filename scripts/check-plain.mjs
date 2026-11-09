#!/usr/bin/env node
// Checks the docs against the plain writing rules the site is written in:
// no em or en dash, no double hyphen in prose, no semicolon outside code,
// no curly quotes, no emoji, no bold-label lists, sentence-case headings.
// Usage: node scripts/check-plain.mjs [paths...]   (default: docs README.md)
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const roots = process.argv.slice(2);
if (!roots.length) roots.push('docs', 'README.md');
const files = [];
const walk = (p) => {
  if (statSync(p).isDirectory()) readdirSync(p).forEach((f) => walk(join(p, f)));
  else if (/\.mdx?$/.test(p)) files.push(p);
};
roots.forEach(walk);

const allowedCaps = /^(UTF-8|POSIX|Windows|Unicode|API|HI_BLACK|Ctrl|CMake|GitHub|termbox2|Tutorial|Win32|Caps|Lock|LT_\w+|lt_\w+|Markus|Kuhn|SIMD|RGB|OSC|SGR|CSI|MinGW|MSVC|GCC|Clang|Linux|macOS)$/;
const problems = [];
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  let inCode = false;
  lines.forEach((raw, i) => {
    const n = i + 1;
    if (/^```/.test(raw)) { inCode = !inCode; return; }
    if (inCode) return;
    const prose = raw.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']');
    if (/[—–]/.test(raw)) problems.push(`${f}:${n} em or en dash`);
    if (/[“”‘’]/.test(raw)) problems.push(`${f}:${n} curly quote`);
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(raw)) problems.push(`${f}:${n} emoji`);
    if (/\w -- \w| -- /.test(prose)) problems.push(`${f}:${n} double hyphen used as a dash`);
    if (/;/.test(prose) && !/^\|/.test(raw)) problems.push(`${f}:${n} semicolon in prose`);
    if (/^\s*([-*]|\d+\.)\s+\*\*[^*]+\*\*\s*[:,]/.test(raw)) problems.push(`${f}:${n} bold label list`);
    const h = raw.match(/^#{1,6}\s+(.*)$/);
    if (h) {
      const words = h[1].replace(/`[^`]*`/g, '').split(/\s+/).slice(1);
      const caps = words.filter((w) => /^[A-Z][a-z]+$/.test(w) && !allowedCaps.test(w));
      if (caps.length >= 2) problems.push(`${f}:${n} heading looks title-cased: ${h[1]}`);
    }
  });
}
console.log(`${files.length} files checked, ${problems.length} problems`);
problems.forEach((p) => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
