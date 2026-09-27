// Adds chapters to a book's READY list (sorted, deduplicated) — the only thing that makes a chapter public.
// Usage: node tools/publish.mjs <book> <chapter> [chapter ...]      e.g. node tools/publish.mjs john 20
import { readFileSync, writeFileSync } from 'node:fs';
const [book, ...chs] = process.argv.slice(2);
const file = new URL('../js/chapters/index.js', import.meta.url);
let s = readFileSync(file, 'utf8');
const start = s.indexOf(`  ${book}: {`);
if (start < 0) { console.error(`no book "${book}"`); process.exit(1); }
const m = /READY: \[([^\]]*)\]/.exec(s.slice(start));
const at = start + m.index;
const list = [...new Set([...m[1].split(',').map(Number).filter(Boolean), ...chs.map(Number)])].sort((a, b) => a - b);
s = s.slice(0, at) + `READY: [${list.join(', ')}]` + s.slice(at + m[0].length);
writeFileSync(file, s);
console.log(`${book} READY: [${list.join(', ')}]`);
