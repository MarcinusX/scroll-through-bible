// Verifies that the scenes' beats reproduce the chapter text exactly, verse by verse, in order —
// in Polish (Biblia Tysiąclecia, the scenes' own text) and English (World English Bible, data/beats-en.js).
// Usage: node tools/check.mjs
import { MARK } from '../data/mark.js';
import { MARK_EN } from '../data/mark-en.js';
import { BEATS_EN } from '../data/beats-en.js';
import { SCENES } from '../js/chapters/mark4/index.js';

const CH = 4;
const norm = (s) => s.replace(/\s+/g, ' ').trim();
let ok = true;

function check(label, verses, textOf) {
  const got = new Map();
  const order = [];
  for (const sc of SCENES) {
    sc.beats.forEach((b, i) => {
      if (b.cover) return;
      const vs = Array.isArray(b.v) ? b.v : [b.v];
      const text = textOf(sc, b, i);
      if (text) {
        if (vs.length !== 1) { console.log(`✗ [${label}] ${sc.id}: beat with text must have a single verse`, b); ok = false; }
        got.set(vs[0], (got.get(vs[0]) ? got.get(vs[0]) + ' ' : '') + text);
      } else vs.forEach((v) => got.set(v, (got.get(v) ? got.get(v) + ' ' : '') + verses[v - 1]));
      vs.forEach((v) => { if (order[order.length - 1] !== v) order.push(v); });
    });
  }
  let good = true;
  for (let v = 1; v <= verses.length; v++) {
    if (!got.has(v)) { console.log(`… [${label}] ${CH},${v} not placed yet`); continue; }
    if (norm(got.get(v)) !== norm(verses[v - 1])) {
      good = false;
      console.log(`✗ [${label}] ${CH},${v} text mismatch\n   expected: ${verses[v - 1]}\n   got:      ${got.get(v)}`);
    }
  }
  for (let i = 1; i < order.length; i++) if (order[i] <= order[i - 1]) { good = false; console.log(`✗ [${label}] verse order: ${order[i - 1]} then ${order[i]}`); }
  // an English override must exist exactly where the Polish scene splits a verse
  if (label === 'en') {
    for (const sc of SCENES) sc.beats.forEach((b, i) => {
      const has = BEATS_EN[sc.id] && BEATS_EN[sc.id][i] !== undefined;
      if (!!b.text !== has) { good = false; console.log(`✗ [en] ${sc.id} beat ${i}: ${b.text ? 'needs' : 'has an unneeded'} English split`); }
    });
  }
  console.log(good ? `✓ [${label}] ${got.size}/${verses.length} verses placed, all text matches` : `✗ [${label}] problems found`);
  ok = ok && good;
}

check('pl', MARK.chapters[CH - 1].verses, (sc, b) => b.text);
check('en', MARK_EN.chapters[CH - 1].verses, (sc, b, i) => BEATS_EN[sc.id]?.[i]);
process.exit(ok ? 0 : 1);
