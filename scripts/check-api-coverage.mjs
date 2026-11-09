#!/usr/bin/env node
// Fails when a public lt_ or LT_ identifier declared in libterm.h is not
// mentioned anywhere under docs/. Usage: node scripts/check-api-coverage.mjs <path/to/libterm.h>
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const header = process.argv[2];
if (!header) {
  console.error('usage: check-api-coverage.mjs <libterm.h>');
  process.exit(2);
}
const src = readFileSync(header, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const ids = new Set();
for (const m of src.matchAll(/^\s*#define\s+(LT_[A-Z0-9_]+)/gm)) ids.add(m[1]);
for (const m of src.matchAll(/\b(lt_[a-z0-9_]+)\s*\(/g)) ids.add(m[1]);
for (const m of src.matchAll(/typedef\s+\w+\s+(lt_\w+);/g)) ids.add(m[1]);
for (const m of src.matchAll(/struct\s+(lt_\w+)\s*\{/g)) ids.add('struct ' + m[1]);
ids.delete('LIBTERM_H');

const files = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(f) && files.push(p);
});
walk('docs');
const corpus = files.map((f) => readFileSync(f, 'utf8')).join('\n');

const missing = [...ids].filter((id) => !corpus.includes(id)).sort();
console.log(`${ids.size} public identifiers, ${ids.size - missing.length} documented`);
if (missing.length) {
  console.log('missing:\n  ' + missing.join('\n  '));
  process.exit(1);
}
