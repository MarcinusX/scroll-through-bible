// Verifies that the scenes' beats reproduce the chapter text exactly, verse by verse, in order.
// Usage: node tools/check.mjs
import { MARK } from '../data/mark.js';
import { SCENES } from '../js/chapters/mark4/index.js';

const CH = 4;
const verses = MARK.chapters[CH - 1].verses;
const got = new Map();
const order = [];
let ok = true;
const norm = (s) => s.replace(/\s+/g, ' ').trim();

for (const sc of SCENES) {
  for (const b of sc.beats) {
    if (b.cover) continue;
    const vs = Array.isArray(b.v) ? b.v : [b.v];
    if (b.text) {
      if (vs.length !== 1) { console.log(`✗ ${sc.id}: beat with text must have a single verse`, b); ok = false; }
      got.set(vs[0], (got.get(vs[0]) ? got.get(vs[0]) + ' ' : '') + b.text);
    } else vs.forEach((v) => got.set(v, (got.get(v) ? got.get(v) + ' ' : '') + verses[v - 1]));
    vs.forEach((v) => { if (order[order.length - 1] !== v) order.push(v); });
  }
}
for (let v = 1; v <= verses.length; v++) {
  if (!got.has(v)) { console.log(`… Mk ${CH},${v} not placed yet`); continue; }
  if (norm(got.get(v)) !== norm(verses[v - 1])) {
    ok = false;
    console.log(`✗ Mk ${CH},${v} text mismatch\n   expected: ${verses[v - 1]}\n   got:      ${got.get(v)}`);
  }
}
for (let i = 1; i < order.length; i++) if (order[i] <= order[i - 1]) { ok = false; console.log(`✗ verse order: ${order[i - 1]} then ${order[i]}`); }
console.log(ok ? `✓ ${got.size}/${verses.length} verses placed, all text matches` : '✗ problems found');
process.exit(ok ? 0 : 1);
