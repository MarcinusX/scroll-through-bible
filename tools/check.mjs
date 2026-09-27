// Verifies that the scenes' beats reproduce each chapter's text exactly, verse by verse, in order —
// in Polish (Biblia Tysiąclecia, the scenes' own text) and English (World English Bible, markN/beats-en.js).
// Usage: node tools/check.mjs [chapter]
import { MARK } from '../data/mark.js';
import { MARK_EN } from '../data/mark-en.js';
import { CHAPTER_COUNT, READY, loadChapter } from '../js/chapters/index.js';

let CH, SCENES, BEATS_EN, META;
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
    // verses the Biblia Tysiąclecia omits (Mk 9,44.46; 11,26) are skipped in both languages
    if (!MARK.chapters[CH - 1].verses[v - 1]) { if (got.has(v)) { good = false; console.log(`✗ [${label}] ${CH},${v} is omitted in BT — leave it out`); } continue; }
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
      const has = !!(BEATS_EN[sc.id] && BEATS_EN[sc.id][i] !== undefined);
      if (!!b.text !== has) { good = false; console.log(`✗ [en] ${sc.id} beat ${i}: ${b.text ? 'needs' : 'has an unneeded'} English split`); }
    });
  }
  console.log(good ? `✓ [${label}] ${got.size}/${MARK.chapters[CH - 1].verses.filter(Boolean).length} verses placed, all text matches` : `✗ [${label}] problems found`);
  ok = ok && good;
}

const only = +process.argv[2] || 0;
const ids = new Set();
for (let n = 1; n <= CHAPTER_COUNT; n++) {
  if (only && n !== only) continue;
  const mod = await loadChapter(n);
  if (!mod || !mod.SCENES.length) { if (READY.includes(n)) { ok = false; console.log(`✗ Mark ${n} is listed in READY but has no scenes`); } continue; }
  if (!READY.includes(n)) console.log(`… Mark ${n} has scenes but is not in READY yet (draft)`);
  ({ SCENES, BEATS_EN, META } = mod);
  CH = n;
  console.log(`— Mark ${n}: ${SCENES.length} scenes, ${SCENES.reduce((k, s) => k + s.beats.length, 0)} beats`);
  for (const sc of SCENES) { if (ids.has(sc.id)) { ok = false; console.log(`✗ scene id "${sc.id}" is used twice`); } ids.add(sc.id); }
  if (!META.plate || !META.pl.coverSub || !META.en.coverSub || !META.pl.endQ || !META.en.endQ) { ok = false; console.log(`✗ Mark ${n}: meta.js is incomplete`); }
  check('pl', MARK.chapters[n - 1].verses, (sc, b) => b.text);
  check('en', MARK_EN.chapters[n - 1].verses, (sc, b, i) => BEATS_EN[sc.id]?.[i]);
}
process.exit(ok ? 0 : 1);
