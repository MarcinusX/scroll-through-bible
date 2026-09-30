// Luke 5 — the cast and cut-outs of this chapter: the lake of Gennesaret in the morning (the beach with the crowd,
// two boats at the water's edge, the fishermen rinsing their nets), the deep water seen in cut-away (the shoal of
// silver fish pouring into the net, the net tearing, the two boats heaped with fish and sinking to the gunwale),
// the golden net of "catching people", a town street for the man full of leprosy, the lonely rocks where He prays,
// the cut-away house in Capernaum with a roof of clay tiles, Levi's booth and his great feast, and the painted flats
// of the patch cut out of a new cloak and of the wineskins, and the old man who says "the old is better".
// Parallel drawings are reused from Mark 1–2, Matthew 4/8/9 and John 6/21 (origins noted per piece).
// Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, house, sun, moon, stars, cloud, rock, reeds, grass, palm, olive, cypress, bush, flowers } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, clamp, fade, attr } from '../../core/anim.js';
import { hull } from '../john6/lib.js';
import { silverFish } from '../john21/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, scrap, dust, pallet, blanket, rolledMat, rope, coin, coinStack, ledger, coinScale, taxBooth, lowTable, bowl, loaf, cup, grapes, fishDish, lantern, garland, canopy, wreath, tambourine, cloak, CLOAK_HOLE, patch, needle, wineskin, skinHalf, jug, splash, WINE, wordSlip, physicianKit, addToHead, addToBody, scribe, johnsDisciple, johnsOpts, townsfolk } from '../mark2/lib.js';
export { ZEBEDEE, LEPER, LEPER_HEALED, bell, leperSpots, priestPlate, voiceRings, castNet, netDrape, sparkle, hang2 } from '../mark1/lib.js';
export { silverFish, fullNet, emptyNet, splashCrown, SILVER, PETER_BARE, bare, netBundle, foldedMantle } from '../john21/lib.js';
export { hull, folk, group, scatter, smallSail } from '../john6/lib.js';
export { feastSet, supperTable, SEATS, lookOf, TAXMEN, SINNERS, FP, FT, PARALYTIC, HEALED, FRIENDS, matWithMan, darkKnot, heartGlow, slip } from '../matthew9/lib.js';
export { mob, thoughtCloud } from '../matthew8/lib.js';
export { lightShaft, pose3, folk4 } from '../matthew4/lib.js';
export { nameTag, bubble, strip, withFace, faceBits, tapeX, question } from '../mark3/lib.js';
export { rayBurst, glowDisc, radiance, hungWord, goldWord } from '../john1/lib.js';
export { balance } from '../mark8/lib.js';
export { vis } from '../mark14/lib.js';
export { hangAt, vpose } from '../john3/lib.js';
export { lawTablets } from '../mark10/lib.js';
export { placeTag } from '../matthew2/lib.js';
export { tr, es, ease, bump, seg, clamp, fade, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ====================================================================== skies */
export const MORNING = ['#c9dfdb', '#eeecd6', '#f8ebd0'];
export const DAY = ['#c2dcd8', '#e8ecd9', '#f5ebd1'];
export const NOON = ['#bcd8d6', '#eaefdc', '#f7eed4'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVENING = ['#a69abf', '#eab99c', '#f5d6b0'];
export const DUSK = ['#7f78a8', '#dca28f', '#f1c69c'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const DESERT = ['#d7dccf', '#f1dcb5', '#f5dcb2'];

/* ====================================================================== the cast */
export const JESUS = CAST.jesus;
export const PETER = CAST.peter;
export const ANDREW = CAST.andrew;
export const JAMES = CAST.james;
export const JOHN = CAST.john;
/** Levi the tax collector = Matthew (one cast across the Gospels) */
export const LEVI = CAST.matthew;
/** the fishermen at work: tunics, no mantles */
export const PETER_W = { ...CAST.peter, mantle: null, belt: C.rope };
export const JAMES_W = { ...CAST.james, mantle: null, belt: C.rope };
/** two hired men in Zebedee's boat */
export const HIRED = [
  { robe: C.ochreRobe, hairStyle: 'wrap', veil: C.linen2, hair: C.hair, beard: 'short', skin: C.skin4, belt: C.leather },
  { robe: C.stone, hairStyle: 'short', hair: C.hair3, beard: 'full', skin: C.skin3, belt: C.leather },
];
/** "a man full of leprosy": the grey-rose look of Mark 1 */
export const LEPER_FULL = { robe: '#b7b2a6', mantle: '#9c978c', hair: C.greyHair, hairStyle: 'wrap', veil: '#a8a397', beard: 'short', beardColor: '#8f8a80', skin: '#c9bfae', belt: null };

/* ====================================================================== the lake of Gennesaret */
/**
 * The lake in the morning: sky (+ an optional second sky to cross-fade), sun and clouds on strings, the far hills of
 * the plain of Gennesaret with villages, the lake, slow back waves. Returns handles; idle(time) sways the hangings.
 */
export function lakeSet(S, { skyCols = MORNING, sky2 = null, sunAt = [1240, 150], lakeY = 420, clouds = [[500, 150, 200], [1020, 112, 150]], rise = 1 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }) : null;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = clouds.map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  const far = S.layer({ par: 0.07, sh: 2, rise });
  far.add(band(c, { y: lakeY - 36, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.12), x0: -1400, x1: 3000 }).markup);
  const midL = S.layer({ par: 0.1, sh: 2, rise });
  const fh = hillsWith(c, { y: lakeY - 8, amps: [10, 5, 2], lens: [900, 300, 100], color: C.hillMid, trees: 34, treeColor: C.sage, treeH: 16, x0: -1400, x1: 3000 });
  midL.add(fh.markup + town(c, { x: 260, y: fh.fn(260) + 6, n: 6, spread: 220, sc: 0.36 }) + town(c, { x: 1380, y: fh.fn(1380) + 6, n: 5, spread: 200, sc: 0.36 }) + town(c, { x: -300, y: fh.fn(-300) + 6, n: 4, spread: 160, sc: 0.32 }));
  const lakeL = S.layer({ par: 0.12, sh: 1, rise });
  lakeL.add(waterBand(c, { y: lakeY, color: mix(C.lake, C.skyBlue, 0.22), foamN: 30, bottom: 1700, x0: -1400, x1: 3000 }).markup);
  const sails = [[380, lakeY + 26, 0.8], [1130, lakeY + 18, 0.6]].map(([x, y, s], i) => ({ i, x, y, el: lakeL.add(`<g transform="scale(${s})">${sail(c)}</g>`) }));
  const wB = S.layer({ par: 0.16, sh: 2, pad: 260, rise });
  wB.add(waveStrip(c, { y: lakeY + 70, len: 200, amp: 7, color: mix(C.lake, C.lake2, 0.25), x0: -1600, x1: 3200 }));
  return {
    c, sk, sk2, hangL, sunEl, cls, far, midL, lakeL, wB, sails,
    idle(time, { sunY = sunAt[1], sunX = sunAt[0], calm = 1, sunO = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6) * 0.8, o: sunO });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 24, cl.y, time, 1.2, 0.6, cl.i));
      sails.forEach((s) => pose(s.el, { x: s.x + ((time * 3 + s.i * 400) % 900) * (s.i ? -1 : 1) * 0.3, y: s.y, s: s.i ? 0.6 : 0.8 }));
      wB.shift(-((time * 10 * calm) % 200) + 100, 0);
    },
  };
}
/** a little far sail (origin: waterline) */
function sail(c) {
  const s = sheet();
  s.p(c.ribbon([[0, -2], [0, -60]], 2), C.wood2);
  s.p(c.cut([[2, -58], [30, -14], [2, -12]], 0.4, 5), C.sail);
  s.p(c.cut([[-26, -12], [26, -12], [18, 0], [-18, 0]], 0.4, 5), C.wood);
  return s.out();
}
/** a strip of front waves (a layer of its own that can slide and fade); returns the layer */
export function frontWaves(S, { y, par = 0.5, sh = 3, color = mix(C.lake, C.lake2, 0.5), amp = 10, len = 220, pad = 300, rise = 1, alpha = 1 } = {}) {
  const L = S.layer({ par, sh, pad, rise });
  L.add(waveStrip(S.c, { y, len, amp, color, x0: -1600, x1: 3200 }));
  L.fade(alpha);
  return L;
}

/* ====================================================================== boats */
/**
 * A fishing boat with people standing / sitting in it (john6 hull). The pieces are added to L in order: the back of
 * the hull, the crew, the fish heap (optional), the front of the hull. crew: [{k, o | markup, x (local), dy, s, front}] (front: in front of the fish heap).
 * Returns { back, front, heapEl, crew{k: {p, x, …}}, at(B, lx, ly), set(B) } — B = {x, y, s, r (deg), o}.
 */
export function boatRig(S, L, { w = 380, col = C.wood, stripe = C.terracotta, crew = [], heap = false, extra = '', mast = false } = {}) {
  const c = S.c;
  const H = hull(c, { w, col, stripe });
  let backM = H.back;
  if (mast) backM += sheet().p(c.cut([[-6, -60], [-6, -300], [2, -300], [2, -60]], 0.3, 8), C.wood2).p(c.cut([[-2, -296], [-120, -64], [-2, -70]], 0.8, 8), C.sail).out();
  const back = L.add(`<g>${backM}</g>`);
  const members = {};
  const addCrew = (m) => { members[m.k] = { ...m, s: m.s ?? 0.92, p: S.puppet(L.add(m.markup || person(c, m.o))), seed: c.rr(0, 9) }; };
  crew.filter((m) => !m.front).forEach(addCrew);
  const heapEl = heap ? L.add(`<g>${fishHeap(c, w * 0.72)}</g>`) : null;
  crew.filter((m) => m.front).forEach(addCrew);
  const extraEl = extra ? L.add(`<g>${extra}</g>`) : null;
  const front = L.add(`<g>${H.front}</g>`);
  const at = (B, lx, ly) => {
    const r = ((B.r || 0) * PI) / 180, s = B.s ?? 1;
    return [B.x + s * (lx * Math.cos(r) - ly * Math.sin(r)), B.y + s * (lx * Math.sin(r) + ly * Math.cos(r))];
  };
  return {
    back, front, heapEl, extraEl, crew: members, at, w,
    set(B) { const p = { x: B.x, y: B.y, s: B.s ?? 1, r: B.r || 0, o: B.o }; pose(back, p); pose(front, p); if (extraEl) pose(extraEl, p); },
    /** pose a crew member (extra: arm/head/flip/o …) at local (m.x, dy) */
    put(k, B, extra = {}) {
      const m = members[k];
      const [x, y] = at(B, extra.lx ?? m.x, extra.ly ?? (m.dy ?? -8));
      m.p.set({ s: (B.s ?? 1) * m.s, r: B.r || 0, o: B.o, ...extra, x, y });
    },
    /** the fish heap (u: 0 empty → 1 heaped over the gunwale) */
    fill(B, u, dx = 0) {
      if (!heapEl) return;
      const [x, y] = at(B, dx, lerp(40, -58, u));
      pose(heapEl, { x, y, s: B.s ?? 1, r: B.r || 0, o: u > 0.01 ? B.o ?? 1 : 0 });
    },
  };
}
/** a heap of silver fish, one cut-out (origin: its base centre, ~ w wide, 60 high) */
export function fishHeap(c, w = 260) {
  let out = '';
  const n = Math.round(w / 7);
  const items = [];
  for (let i = 0; i < n; i++) {
    const u = c.rr(-1, 1);
    const top = Math.sqrt(Math.max(0, 1 - u * u)) * 58;
    items.push({ x: u * w / 2, y: -c.rr(4, Math.max(8, top)), r: c.rr(-40, 40), s: c.rr(0.55, 0.8), i });
  }
  items.sort((a, b) => b.y - a.y);
  items.forEach((f) => { out += `<g transform="translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.r.toFixed(0)}) scale(${f.s.toFixed(2)} ${(f.i % 2 ? 1 : -1) * f.s})">${silverFish(c, f.i)}</g>`; });
  const base = sheet().p(c.cut([[-w / 2, 0], [w / 2, 0], [w * 0.4, -18], [-w * 0.4, -18]], 0.6, 8), mix(C.lake3, C.stone2, 0.4)).out();
  return base + out;
}
/** the net lowered in the water: a line of floats and the bag of mesh below (empty); origin at its left float */
export function sunkNet(c, { w = 340, h = 150, col = mix(C.rope, C.linen, 0.3) } = {}) {
  const top = (x) => Math.sin((x / w) * PI * 3) * 2;
  const bot = (x) => Math.sin((x / w) * PI) * h;
  let mesh = '';
  for (let i = 0; i <= 16; i++) { const x = (i / 16) * w; mesh += c.ribbon([[x, top(x)], [lerp(x, w / 2, 0.15), bot(x)]], 1.3); }
  for (let k = 1; k <= 4; k++) mesh += c.ribbon(Array.from({ length: 15 }, (_, i) => { const x = (i / 14) * w; return [x, lerp(top(x), bot(x), k / 4)]; }), 1.2);
  mesh += c.ribbon(Array.from({ length: 15 }, (_, i) => { const x = (i / 14) * w; return [x, top(x)]; }), 2.6);
  let fl = '';
  for (let i = 0; i <= 9; i++) { const x = (i / 9) * w; fl += c.cut(c.ell(x, top(x) - 2, 7, 4, 8), 0.2, 3); }
  return `<path d="${mesh}" fill="${col}"/><path d="${fl}" fill="${C.terracotta}"/>`;
}
/** the net bursting with fish under the water (origin at its left float, same frame as sunkNet) */
export function heavyNet(c, { w = 340, h = 170, n = 60, col = mix(C.rope, C.linen, 0.3) } = {}) {
  const top = (x) => Math.sin((x / w) * PI * 3) * 2;
  const bot = (x) => Math.sin((x / w) * PI) * h + 8;
  let fish = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(0.06, 0.94) * w;
    const y = lerp(top(x) + 12, bot(x) - 10, c.rr(0.05, 1));
    fish += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${c.rr(-40, 40).toFixed(0)}) scale(${c.rr(0.55, 0.85).toFixed(2)} ${(c.chance(0.5) ? 1 : -1) * c.rr(0.55, 0.85)})">${silverFish(c, i)}</g>`;
  }
  const bag = [];
  for (let i = 0; i <= 20; i++) bag.push([(i / 20) * w, top((i / 20) * w)]);
  for (let i = 20; i >= 0; i--) bag.push([(i / 20) * w, bot((i / 20) * w)]);
  let mesh = '';
  for (let i = 0; i <= 16; i++) { const x = (i / 16) * w; mesh += c.ribbon([[x, top(x)], [lerp(x, w / 2, 0.1), bot(x)]], 1.3); }
  for (let k = 1; k <= 4; k++) mesh += c.ribbon(Array.from({ length: 15 }, (_, i) => { const x = (i / 14) * w; return [x, lerp(top(x), bot(x), k / 4)]; }), 1.2);
  mesh += c.ribbon(Array.from({ length: 15 }, (_, i) => { const x = (i / 14) * w; return [x, top(x)]; }), 2.6);
  let fl = '';
  for (let i = 0; i <= 9; i++) { const x = (i / 9) * w; fl += c.cut(c.ell(x, top(x) - 2, 7, 4, 8), 0.2, 3); }
  return `<path d="${c.poly(bag)}" fill="${mix(C.lake3, C.lakeDeep, 0.4)}" opacity=".4"/>${fish}<path d="${mesh}" fill="${col}"/><path d="${fl}" fill="${C.terracotta}"/>`;
}
/** a snapped strand of mesh (origin centre) */
export function snapped(c, col = mix(C.rope, C.linen, 0.3)) {
  return sheet().p(c.ribbon(c.qbez([-18, -10], [-6, 4], [-2, -2], 6), 1.8) + c.ribbon(c.qbez([18, 10], [6, -4], [2, 2], 6), 1.8), col).x(c.cut(c.star(0, 0, 10, 3, 5, 0.3), 0.2, 2), C.halo).out();
}
/** an oar (origin at the grip) */
export function oar(c, len = 190) {
  return sheet().p(c.ribbon([[0, 0], [len * 0.8, 0]], 4), C.wood3).p(c.cut([[len * 0.74, -9], [len, -11], [len + 4, 0], [len, 11], [len * 0.74, 9]], 0.3, 4), C.wood2).out();
}

/* ====================================================================== the net of people */
/**
 * "From now on you will be catching people": a great net cut in gold paper spread like a wing (origin at its left
 * corner, where the hands hold it; it opens to the right, w wide). Inside it hang little paper people.
 */
export function goldNet(c, { w = 520, h = 190, n = 11 } = {}) {
  const top = (x) => -Math.sin((x / w) * PI) * 40;
  const bot = (x) => top(x) + Math.sin((x / w) * PI) * h + 6;
  let mesh = '';
  for (let i = 0; i <= 18; i++) { const x = (i / 18) * w; mesh += c.ribbon([[x, top(x)], [x + 8, bot(x)]], 1.6); }
  for (let k = 1; k <= 5; k++) mesh += c.ribbon(Array.from({ length: 19 }, (_, i) => { const x = (i / 18) * w; return [x, lerp(top(x), bot(x), k / 5)]; }), 1.5);
  mesh += c.ribbon(Array.from({ length: 19 }, (_, i) => { const x = (i / 18) * w; return [x, top(x)]; }), 3);
  const bag = [];
  for (let i = 0; i <= 20; i++) bag.push([(i / 20) * w, top((i / 20) * w)]);
  for (let i = 20; i >= 0; i--) bag.push([(i / 20) * w, bot((i / 20) * w)]);
  let folk = '';
  for (let i = 0; i < n; i++) {
    const x = ((i + 0.5) / n) * w * 0.9 + w * 0.05, y = lerp(top(x), bot(x), 0.86);
    const o = crowdPerson(c);
    folk += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(c.chance(0.5) ? -1 : 1) * 0.36} .36)">${person(c, { ...o, pose: 'stand' })}</g>`;
  }
  return `<path d="${c.poly(bag)}" fill="${C.halo}" opacity=".35"/>${folk}<path d="${mesh}" fill="${C.haloRim}"/>`;
}

/* ====================================================================== a town street (the leper) */
export const ST = { FEET: 724, WALL: 470 };
/**
 * A street in "one of the towns": sky and sun on strings, far hills, a row of house fronts (doors, windows,
 * stairs to the roofs, an arch), a well, the beaten-earth street. Returns handles.
 */
export function streetSet(S, { skyCols = DAY, sunAt = [1220, 140] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[460, 140, 180], [960, 104, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.1), x0: -1400, x1: 3000 }).markup);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const mh = hillsWith(c, { y: 450, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20, x0: -1400, x1: 3000 });
  let roofs = '';
  [[-600, 90, 60], [-420, 110, 80], [-200, 130, 60], [40, 100, 76], [260, 120, 64], [1360, 110, 80], [1560, 130, 60], [1780, 100, 70], [2000, 120, 64]].forEach(([x, w, h], i) => { roofs += house(c, x, 490 + (i % 3) * 5, w * 0.8, h * 0.7, { stairs: i % 2 === 0 }); });
  mid.add(mh.markup + roofs + cypress(c, 1240, 486, 100) + palm(c, 150, 492, 140));
  // the house fronts along the street
  const wallL = S.layer({ par: 0.45, sh: 4 });
  const w = sheet();
  const fronts = [[-700, 250, 150, C.plaster], [-450, 330, 190, mix(C.plaster, C.sand, 0.25)], [-120, 300, 160, C.plaster2], [180, 260, 210, C.plaster], [440, 150, 130, mix(C.plaster, C.dawn, 0.2)], [1150, 260, 190, mix(C.plaster, C.sand, 0.2)], [1410, 280, 150, C.plaster], [1690, 300, 200, C.plaster2], [1990, 320, 170, C.plaster]];
  const base = ST.FEET - 40;
  fronts.forEach(([x, ww, hh, col], i) => {
    w.p(c.cut([[x, base], [x, base - hh], [x + ww, base - hh], [x + ww, base]], 0.6, 10), col);
    w.p(c.cut([[x - 6, base - hh - 8], [x + ww + 6, base - hh - 8], [x + ww + 6, base - hh + 4], [x - 6, base - hh + 4]], 0.4, 8), C.roof);
    const dx = x + ww * (i % 2 ? 0.3 : 0.62);
    w.p(c.cut([[dx - 22, base], [dx - 22, base - 70], ...c.arc(dx, base - 70, 22, 20, PI, 2 * PI, 8), [dx + 22, base]], 0.4, 5), C.soilDark);
    w.p(c.ribbon([[dx - 27, base], [dx - 27, base - 70]], 5) + c.ribbon([[dx + 27, base], [dx + 27, base - 70]], 5), C.wood2);
    const wx = x + ww * (i % 2 ? 0.72 : 0.22);
    w.p(c.cut(c.rect(wx - 14, base - hh + 30, 28, 30), 0.3, 5), C.soilDark);
    w.p(c.ribbon([[wx - 18, base - hh + 62], [wx + 18, base - hh + 62]], 4), C.wood2);
  });
  let spots = '';
  for (let i = 0; i < 26; i++) spots += c.cut(c.blob(c.rr(-700, 2300), c.rr(base - 150, base - 20), c.rr(8, 22), c.rr(4, 10), 8, 0.2), 0.5, 4);
  w.x(spots, C.plaster2, 'opacity=".55"');
  // an arch over the street between the houses (the way out of town)
  w.p(c.cut([[590, base], [590, base - 240], ...c.arc(800, base - 240, 210, 70, PI, 2 * PI, 16), [1010, base - 240], [1010, base], [980, base], [980, base - 226], ...c.arc(800, base - 226, 180, 54, 2 * PI, PI, 16), [620, base - 226], [620, base]], 0.6, 10), mix(C.stone, C.sand, 0.3));
  wallL.add(w.out());
  const ground = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(base, [2, 1], [700, 180]);
  const g = sheet().p(c.ridge(gfn, -1400, 3000, 1700, 12, 0.8), mix(C.sand, C.stone, 0.35));
  let flags = '';
  for (let i = 0; i < 80; i++) { const x = c.rr(-900, 2500), y = c.rr(base + 20, base + 340); flags += c.cut(c.blob(x, y, c.rr(16, 32), c.rr(5, 9), 8, 0.2), 0.4, 4); }
  g.x(flags, shade(C.stone2, -0.04), 'opacity=".6"');
  ground.add(g.out());
  // the well
  const wl = sheet();
  wl.p(c.cut(c.rect(1180, base + 4, 110, 46), 0.4, 6), C.stone2).p(c.cut(c.rect(1176, base - 2, 118, 10), 0.3, 6), C.stone);
  wl.p(c.ribbon([[1192, base + 2], [1192, base - 80]], 5) + c.ribbon([[1278, base + 2], [1278, base - 80]], 5) + c.ribbon([[1186, base - 80], [1284, base - 80]], 5), C.wood2);
  wl.p(c.cut([[1228, base - 40], [1242, base - 40], [1246, base - 20], [1224, base - 20]], 0.3, 4), C.pot);
  ground.add(wl.out() + bush(c, 480, base + 20, 70, C.sage, C.moss) + flowers(c, { x0: 300, x1: 560, y: base + 14, n: 6 }));
  return {
    c, sk, hangL, sunEl, far, mid, wallL, ground, gfn,
    idle(time) { swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6); cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 24, cl.y, time, 1.2, 0.6, cl.i)); },
  };
}

/* ====================================================================== the house in Capernaum (cut-away) */
export const HS = { X0: 380, X1: 1220, IN0: 440, IN1: 1160, FLOOR: 600, CEIL: 300, ROOF: 268, STREET: 722, DOOR: 1280, WING: 1336, HOLE0: 700, HOLE1: 880, BENCH: 450 };
/** the stair up to the roof beyond the door: step i (0 = bottom) — top of the tread at (x, y) */
export const stairStep = (i) => [HS.WING + 212 - i * 21, HS.STREET - (i + 1) * 43];
/**
 * A Capernaum house seen as a doll's house: the far wall of the room (a window, a lamp niche, shelves, herbs), the
 * floor and the teachers' bench, a U-shaped front wall with the middle cut away, a flat roof of reed and clay topped
 * with clay tiles (the tiles and laths over the middle are loose pieces that can be lifted off), a low wing on the
 * right with the door, the stair up to the roof beyond it, and the street in front.
 * Layers (back to front): sky(+sky2), hangings, far, town, room, glowL, inL, lowL, inFront, wallL, roofL, streetL.
 * Returns handles; `tiles` / `laths` = [{el, x, y, i}] (world centre of each loose piece).
 */
export function houseSet(S, { skyCols = DAY, sky2 = null, sunAt = [1250, 140] } = {}) {
  const c = S.c;
  const { X0, X1, IN0, IN1, FLOOR, CEIL, ROOF, STREET, DOOR, WING, HOLE0, HOLE1, BENCH } = HS;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }) : null;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[520, 110, 180], [1010, 160, 130]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 350, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3000 }).markup + waterBand(c, { y: 382, color: C.lake, foamN: 14, bottom: 900, x0: -1400, x1: 3000 }).markup);
  const townL = S.layer({ par: 0.22, sh: 3 });
  const tb = hillsWith(c, { y: 460, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3000 });
  townL.add(tb.markup + town(c, { x: 60, y: tb.fn(60) + 16, n: 7, spread: 380, sc: 0.8 }) + town(c, { x: 1560, y: tb.fn(1560) + 16, n: 6, spread: 360, sc: 0.8 }) + palm(c, 260, tb.fn(260) + 20, 150) + palm(c, 1420, tb.fn(1420) + 20, 130) + olive(c, 1700, tb.fn(1700) + 18, 0.7));

  /* the room: back wall, floor, the bench */
  const roomL = S.layer({ par: 0.5, sh: 3 });
  const bw = sheet();
  bw.p(c.cut(c.rect(IN0 - 10, CEIL - 6, IN1 - IN0 + 20, FLOOR - CEIL + 12), 0.5, 12), mix(C.plaster2, C.sand2, 0.3));
  let blotch = '';
  for (let i = 0; i < 12; i++) blotch += c.cut(c.blob(c.rr(IN0 + 30, IN1 - 30), c.rr(CEIL + 50, FLOOR - 60), c.rr(20, 44), c.rr(10, 20), 9, 0.2), 0.6, 5);
  bw.x(blotch, shade(C.plaster2, -0.06), 'opacity=".6"');
  let beams = '';
  for (let x = IN0 + 14; x < IN1; x += 46) beams += c.cut(c.rect(x, CEIL - 4, 14, 24), 0.3, 5);
  bw.p(c.cut(c.rect(IN0 - 10, CEIL - 6, IN1 - IN0 + 20, 14), 0.4, 10), C.wood2);
  bw.p(beams, C.wood);
  bw.p(c.cut([[520, 420], [520, 374], ...c.arc(544, 374, 24, 22, PI, 2 * PI, 8), [568, 420]], 0.4, 5), '#cfe0dc');
  bw.p(c.ribbon([[514, 422], [574, 422]], 6), C.wood2);
  bw.p(c.cut([[1070, 430], [1070, 400], ...c.arc(1090, 400, 20, 18, PI, 2 * PI, 8), [1110, 430]], 0.4, 5), shade(C.plaster2, -0.18));
  bw.p(c.cut([[1078, 430], [1082, 422], [1098, 422], [1106, 426], [1102, 430]], 0.2, 3), C.pot);
  bw.x(`M1104 422C1101 418 1101 414 1104 408C1107 414 1107 418 1104 422Z`, C.lampFlame);
  bw.p(c.cut(c.rect(930, 380, 100, 6), 0.3, 6), C.wood2);
  bw.p(c.cut([[942, 380], [938, 362], [946, 352], [954, 362], [950, 380]], 0.3, 4) + c.cut(c.arc(986, 380, 14, 12, PI, 2 * PI, 6), 0.3, 4) + c.cut([[1012, 380], [1010, 358], [1022, 352], [1026, 380]], 0.3, 4), C.pot);
  bw.p(c.ribbon([[640, CEIL + 18], [642, 350]], 2) + c.ribbon([[656, CEIL + 18], [654, 358]], 2), C.moss);
  bw.p(c.cut(c.blob(642, 356, 9, 15, 8, 0.2), 0.4, 4) + c.cut(c.blob(655, 364, 8, 14, 8, 0.2), 0.4, 4), C.olive);
  bw.p(c.cut([[IN0 - 10, FLOOR - 18], [IN1 + 10, FLOOR - 18], [IN1 + 10, FLOOR + 6], [IN0 - 10, FLOOR + 6]], 0.6, 12), mix(C.clay, C.sand2, 0.55));
  bw.p(c.cut(c.rect(BENCH - 4, FLOOR - 58, 230, 12), 0.4, 8), C.stone);
  bw.p(c.cut(c.rect(BENCH + 6, FLOOR - 46, 20, 30), 0.3, 6) + c.cut(c.rect(BENCH + 196, FLOOR - 46, 20, 30), 0.3, 6), C.stone2);
  roomL.add(bw.out());
  const glowL = S.layer({ par: 0.5, sh: 0, flat: true });   // light behind the people inside
  const inL = S.layer({ par: 0.5, sh: 4 });
  const lowL = S.layer({ par: 0.5, sh: 5 });
  const inFront = S.layer({ par: 0.5, sh: 5 });

  /* the front wall with the cut-away, the wing with the door, the stair, the plinth */
  const wallL = S.layer({ par: 0.5, sh: 6 });
  const ws = sheet();
  const edgeL = [], edgeT = [], edgeR = [];
  for (let y = FLOOR + 2; y > CEIL + 22; y -= 22) edgeL.push([IN0 + c.rr(-6, 6), y]);
  for (let x = IN0; x < IN1; x += 26) edgeT.push([x, CEIL + 18 + c.rr(-5, 5)]);
  for (let y = CEIL + 22; y < FLOOR + 2; y += 22) edgeR.push([IN1 + c.rr(-6, 6), y]);
  ws.p(c.cut([[X0, CEIL], [X1, CEIL], [X1, FLOOR + 2], [IN1, FLOOR + 2], ...edgeR.reverse(), ...edgeT.reverse(), ...edgeL.reverse(), [IN0, FLOOR + 2], [X0, FLOOR + 2]], 1.2, 9), C.plaster);
  ws.p(c.cut([[IN0 - 2, CEIL + 14], [IN0 + 10, CEIL + 20], [IN0 + 10, FLOOR], [IN0 - 2, FLOOR]], 0.6, 8) + c.cut([[IN1 + 2, CEIL + 14], [IN1 - 10, CEIL + 20], [IN1 - 10, FLOOR], [IN1 + 2, FLOOR]], 0.6, 8), C.plaster2);
  ws.p(c.cut(c.rect(X0 + 14, 390, 24, 30), 0.4, 5), C.soilDark);
  ws.p(c.ribbon([[X0 + 10, 422], [X0 + 42, 422]], 5), C.wood2);
  // the wing on the right with the door
  const wTop = ROOF + 22;
  ws.p(c.cut([[X1 - 6, FLOOR + 2], [X1 - 6, wTop], [WING + 6, wTop], [WING + 6, FLOOR + 2]], 0.6, 8), mix(C.plaster, C.sand, 0.18));
  ws.p(c.cut([[X1 - 12, wTop - 12], [WING + 14, wTop - 12], [WING + 14, wTop], [X1 - 12, wTop]], 0.4, 8), C.roof);
  ws.p(c.cut([[DOOR - 30, FLOOR + 2], [DOOR - 30, FLOOR - 100], ...c.arc(DOOR, FLOOR - 100, 30, 28, PI, 2 * PI, 8), [DOOR + 30, FLOOR + 2]], 0.4, 5), C.soilDark);
  ws.p(c.ribbon([[DOOR - 35, FLOOR + 2], [DOOR - 35, FLOOR - 102]], 6) + c.ribbon([[DOOR + 35, FLOOR + 2], [DOOR + 35, FLOOR - 102]], 6) + c.ribbon(c.arc(DOOR, FLOOR - 100, 35, 33, PI, 2 * PI, 10), 6), C.wood2);
  let spots = '';
  for (let i = 0; i < 6; i++) spots += c.cut(c.blob(c.rr(X0 + 10, IN0 - 10), c.rr(CEIL + 30, FLOOR - 20), c.rr(6, 14), c.rr(4, 8), 8, 0.2), 0.5, 4) + c.cut(c.blob(c.rr(IN1 + 10, X1 - 10), c.rr(CEIL + 30, FLOOR - 40), c.rr(6, 14), c.rr(4, 8), 8, 0.2), 0.5, 4);
  ws.x(spots, C.plaster2, 'opacity=".6"');
  // the plinth
  ws.p(c.cut([[X0 - 10, FLOOR], [WING + 16, FLOOR], [WING + 16, STREET + 20], [X0 - 10, STREET + 20]], 0.8, 10), C.stone2);
  let blocks = '';
  for (let r = 0; r < 5; r++) { const y = FLOOR + 12 + r * 24; blocks += c.ribbon([[X0 - 8, y], [WING + 14, y + c.rr(-2, 2)]], 1.4); for (let x = X0 + (r % 2) * 30; x < WING; x += c.rr(50, 80)) blocks += c.ribbon([[x, y], [x + c.rr(-2, 2), y + 22]], 1.2); }
  ws.x(blocks, shade(C.stone2, -0.14), 'opacity=".7"');
  // steps from the door down to the street
  let dst = '';
  for (let i = 0; i < 5; i++) dst += c.cut(c.rect(DOOR - 44 - i * 6, FLOOR + i * 24, 88 + i * 12, 12), 0.3, 5);
  ws.p(dst, C.stone);
  // the stair up to the roof beyond the wing
  let st = '';
  for (let i = 0; i < 10; i++) { const [x, y] = stairStep(i); st += c.cut(c.rect(x - 14, y, WING + 240 - x, 45), 0.3, 5); }
  ws.p(st, mix(C.stone2, C.sand, 0.2));
  let stE = '';
  for (let i = 0; i < 10; i++) { const [x, y] = stairStep(i); stE += c.ribbon([[x - 14, y], [x + 24, y]], 1.3); }
  ws.x(stE, shade(C.stone2, -0.25), 'opacity=".6"');
  wallL.add(ws.out());

  /* the roof: reed and clay slab, clay tiles on top; the middle tiles and laths are loose pieces */
  const roofL = S.layer({ par: 0.5, sh: 6 });
  const slab = (x0, x1) => {
    const s = sheet();
    s.p(c.cut([[x0, ROOF + 12], [x1, ROOF + 12], [x1, CEIL + 4], [x0, CEIL + 4]], 0.6, 8), C.wood3);
    let rd = '';
    for (let x = x0 + 4; x < x1 - 4; x += 7) rd += c.ribbon([[x, ROOF + 14], [x + 2, CEIL]], 2);
    s.x(rd, C.wheat2, 'opacity=".7"');
    return s.out();
  };
  const tileRow = (x0, x1) => {
    const s = sheet();
    let d = '', d2 = '';
    for (let x = x0; x < x1 - 4; x += 30) {
      d += c.cut([[x, ROOF + 12], ...c.arc(x + 15, ROOF + 12, 15, 16, PI, 2 * PI, 6), [x + 30, ROOF + 12]], 0.4, 4);
      d2 += c.ribbon(c.arc(x + 15, ROOF + 10, 10, 9, PI * 1.15, PI * 1.85, 5), 1.6);
    }
    s.p(d, C.terracotta).x(d2, shade(C.terracotta, 0.3), 'opacity=".6"');
    return s.out();
  };
  roofL.add(slab(X0 - 16, HOLE0) + slab(HOLE1, X1 + 16) + tileRow(X0 - 16, HOLE0) + tileRow(HOLE1, X1 + 16));
  const laths = [0, 1, 2].map((i) => {
    const x0 = HOLE0 + (i * (HOLE1 - HOLE0)) / 3, x1 = HOLE0 + ((i + 1) * (HOLE1 - HOLE0)) / 3, cx = (x0 + x1) / 2, cy = (ROOF + CEIL) / 2 + 6;
    return { i, x: cx, y: cy, el: roofL.add(`<g><g transform="translate(${-cx} ${-cy})">${slab(x0, x1)}</g></g>`) };
  });
  const tiles = [];
  for (let x = HOLE0; x < HOLE1 - 4; x += 30) {
    const cx = x + 15;
    tiles.push({ i: tiles.length, x: cx, y: ROOF + 4, el: roofL.add(`<g><g transform="translate(${-cx} ${-(ROOF + 4)})">${tileRow(x, x + 30)}</g></g>`) });
  }
  [...tiles, ...laths].forEach((p) => pose(p.el, { x: p.x, y: p.y }));
  /* the street */
  const streetL = S.layer({ par: 0.56, sh: 4 });
  const sfn = c.wave(STREET, [3, 1.5], [700, 180]);
  streetL.add(sheet().p(c.ridge(sfn, -1400, 3000, 1700, 12, 1), C.sand).out());
  streetL.add(grass(c, { x0: -900, x1: 300, y: STREET, fn: sfn, n: 14, h: 12, color: C.olive }) + grass(c, { x0: 1700, x1: 2600, y: STREET, fn: sfn, n: 12, h: 12, color: C.olive }) + bush(c, 260, STREET + 10, 70, C.sage, C.moss));
  return {
    c, sk, sk2, hangL, sunEl, far, townL, roomL, glowL, inL, lowL, inFront, wallL, roofL, streetL, tiles, laths, sfn,
    idle(time, { sunY = sunAt[1] } = {}) { swing(sunEl, sunAt[0], sunY, time, 1, 0.6); cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 24, cl.y, time, 1.2, 0.6, cl.i)); },
  };
}

/* ====================================================================== the painted flat (parables) */
/**
 * A painted flat for the sayings: a big sheet framed in wood hung on two strings — a wall of a workroom inside.
 * Returns markup; origin at the top centre of the frame.
 */
export function workroom(c, { w = 900, h = 520, wall = mix(C.plaster, C.sand, 0.25), floor = mix(C.clay, C.sand2, 0.5) } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 14, -14, w + 28, h + 28), 0.6, 10), C.wood2);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 10), wall);
  let bl = '';
  for (let i = 0; i < 12; i++) bl += c.cut(c.blob(c.rr(-w / 2 + 40, w / 2 - 40), c.rr(40, h - 120), c.rr(20, 40), c.rr(8, 16), 8, 0.2), 0.5, 5);
  s.x(bl, shade(wall, -0.05), 'opacity=".6"');
  s.p(c.cut([[-w / 2, h - 90], [w / 2, h - 96], [w / 2, h], [-w / 2, h]], 0.6, 10), floor);
  let fl = '';
  for (let x = -w / 2 + 30; x < w / 2; x += 70) fl += c.ribbon([[x, h - 90], [x - 20, h]], 1.3);
  s.x(fl, shade(floor, -0.15), 'opacity=".5"');
  const str = `<path d="M${-w * 0.4} -1600V-10M${w * 0.4} -1600V-10" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>`;
  return str + s.out();
}
/** tailor's shears, open by `a` degrees (origin at the pivot) */
export function shears(c, a = 20) {
  const blade = (sgn) => sheet().p(c.cut([[0, -3], [46, -2 * sgn - 1], [52, 0], [46, 3], [0, 3]], 0.2, 3), C.stone2).p(c.cut(c.ell(-16, 0, 10, 7, 12), 0.3, 3) + c.ribbon([[-6, 0], [2, 0]], 5), C.wood2).out();
  return `<g transform="rotate(${-a / 2})">${blade(1)}</g><g transform="rotate(${a / 2})">${blade(-1)}</g><circle r="2.6" fill="${C.ink}"/>`;
}
/** a new cloak (bright, crisp) hanging from a rod; with hole: the square cut out of its hem. origin: middle of the rod */
export const NEWCLOTH = mix(C.terracotta, C.clayMantle, 0.35);
export const OLDCLOTH = mix(C.dustyBlue, C.stone, 0.5);
export const CUT = [30, 120];   // where the square is cut out of the new cloak (local)
export function newCloak(c, { hole = false, col = NEWCLOTH } = {}) {
  const s = sheet();
  const body = [[-70, 0], [-26, 0], [-18, 8], [0, 12], [18, 8], [26, 0], [70, 0], [96, 30], [84, 58], [58, 40], [58, 172], [-58, 172], [-58, 40], [-84, 58], [-96, 30]];
  const [hx, hy] = CUT;
  const holeD = hole ? c.hole([[hx - 20, hy - 18], [hx + 20, hy - 20], [hx + 22, hy + 18], [hx - 20, hy + 20]], 1.8, 4) : '';
  s.p(c.cut(body, 0.8, 9) + holeD, col);
  s.x(c.ribbon([[-58, 150], [58, 150]], 5) + c.ribbon([[-58, 160], [58, 160]], 2.4) + c.ribbon([[0, 14], [0, 170]], 1.4), shade(col, 0.3), 'opacity=".55"');
  if (hole) {
    let fr = '';
    for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; fr += c.ribbon([[hx + Math.cos(a) * 22, hy + Math.sin(a) * 20], [hx + Math.cos(a + 0.12) * 17, hy + Math.sin(a + 0.12) * 15]], 1); }
    s.x(fr, shade(col, -0.35));
  }
  return s.out();
}
/** the square piece cut from the new cloak (origin centre); stitched: with stitches round it */
export function newPiece(c, { stitched = false, col = NEWCLOTH } = {}) {
  const s = sheet().p(c.cut([[-20, -18], [20, -20], [22, 18], [-20, 20]], 0.5, 4), col);
  s.x(c.ribbon([[-18, -6], [20, -7]], 2.4) + c.ribbon([[-18, 6], [20, 5]], 2.4), shade(col, 0.3), 'opacity=".55"');
  if (stitched) {
    let st = '';
    for (let i = 0; i < 6; i++) { const x = -16 + i * 6.4; st += c.ribbon([[x, -24], [x + 2, -17]], 1.1) + c.ribbon([[x, 17], [x + 2, 24]], 1.1); }
    for (let i = 0; i < 5; i++) { const y = -13 + i * 6.4; st += c.ribbon([[-26, y], [-19, y + 2]], 1.1) + c.ribbon([[19, y], [26, y + 2]], 1.1); }
    s.x(st, C.cream);
  }
  return s.out();
}
/** a big pottery jar of old wine, dusty, sealed with clay (origin: base) */
export function oldJar(c, h = 120) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-34, -30], [-38, -70], [-26, -h + 14], [-14, -h + 4], [14, -h + 4], [26, -h + 14], [38, -70], [34, -30], [16, 0]], 0.6, 6), mix(C.pot, C.rock3, 0.35));
  s.p(c.cut(c.ell(0, -h + 2, 16, 6, 12), 0.3, 4), mix(C.clay, C.stone2, 0.5));
  s.x(c.ribbon([[-36, -60], [36, -60]], 3) + c.ribbon([[-34, -50], [34, -50]], 1.4), shade(C.pot, -0.3), 'opacity=".5"');
  let dustD = '';
  for (let i = 0; i < 8; i++) dustD += c.cut(c.blob(c.rr(-26, 26), c.rr(-h + 20, -20), c.rr(4, 9), c.rr(2, 4), 7, 0.3), 0.4, 3);
  s.x(dustD, C.stone, 'opacity=".45"');
  s.x(c.ribbon(c.qbez([-20, -h + 10], [-50, -h + 30], [-40, -h + 60], 6), 1), C.stone, 'opacity=".5"');
  return s.out();
}
/** little bubbles of new, fermenting wine (origin centre) */
export function fizz(c, n = 7, r = 20) {
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut(c.circ(c.rr(-r, r), c.rr(-r, r), c.rr(2, 4.5), 8), 0.1, 2);
  return `<path d="${d}" fill="${mix(C.plumRobe, C.roseRobe, 0.5)}" opacity=".9"/>`;
}
/** a puddle of spilt wine on the floor (origin centre; grows with sx) */
export function puddle(c, w = 120) {
  return sheet().p(c.cut(c.blob(0, 0, w / 2, 9, 14, 0.25), 0.6, 5), shade(C.plumRobe, -0.3)).x(c.poly(c.ell(-w * 0.15, -2, w * 0.12, 2, 8)), shade(C.plumRobe, 0.2), 'opacity=".5"').out();
}
/** a wine cup (goblet) held in the hand, origin at the hand */
export function wineCup(c, full = true) {
  const s = sheet().p(c.cut([[-10, -26], [10, -26], [7, -12], [2, -9], [2, -2], [8, 0], [-8, 0], [-2, -2], [-2, -9], [-7, -12]], 0.3, 4), C.sun);
  if (full) s.x(c.cut(c.ell(0, -25, 9, 2.4, 8), 0.2, 3), shade(C.plumRobe, -0.3));
  return `<g transform="translate(2 -2)">${s.out()}</g>`;
}

/* ====================================================================== out on the deep (Łk 5,4–10) */
/**
 * The open lake: the lake set, a layer under the water (the net, the fish), the boats, and the near water in front
 * of them drawn translucent (so the net, the shoal and the hulls below the waterline show through it, tinted), in a
 * light and a deep tint that can cross-fade. crewA / crewB: boatRig crew lists. Returns handles.
 */
export const DP = { WL: 566, AY: 592, AX: 780, NX: 620, NW: 290, BX: 236 };
/** where the crew stand / sit in Simon's boat (local x) */
export const CREW_A = { andrew: -124, peter: -24, jesus: 104 };
export function deepSet(S, { skyCols = MORNING, sunAt = [1250, 140], crewA = [], crewB = null, heaps = false, deep = 1, alpha = 0.8 } = {}) {
  const c = S.c;
  const K = lakeSet(S, { skyCols, sunAt, lakeY: 420 });
  const uwL = S.layer({ par: 0.5, sh: 2 });
  const boatL = S.layer({ par: 0.5, sh: 4 });
  const B = crewB ? boatRig(S, boatL, { w: 360, col: C.wood3, stripe: C.dustyBlue, crew: crewB, heap: heaps }) : null;
  const A = boatRig(S, boatL, { w: 380, col: C.wood, stripe: C.terracotta, crew: crewA, heap: heaps });
  const wLight = frontWaves(S, { y: DP.WL, par: 0.5, sh: 2, color: mix(C.lake, C.lake2, 0.4), amp: 8, len: 210, alpha: alpha * (1 - deep) });
  const wDeep = frontWaves(S, { y: DP.WL, par: 0.5, sh: 2, color: mix(C.lake3, C.lakeDeep, 0.35), amp: 8, len: 210, alpha: alpha * deep });
  const fx = S.layer({ par: 0.5, sh: 3 });
  return {
    K, uwL, boatL, A, B, wLight, wDeep, fx,
    water(T, d = deep, a = alpha) {
      wLight.fade(a * (1 - d)); wDeep.fade(a * d);
      const sx = Math.sin(T * 0.5) * 20;
      wLight.shift(sx, 0); wDeep.shift(sx, 0);
    },
  };
}

/* ====================================================================== the people in the house (Łk 5,17–26) */
import { scribe as scribeM, townsfolk as townsfolkM, addToHead as addToHeadM } from '../mark2/lib.js';
import { withFace as withFaceM, faceBits as faceBitsM } from '../mark3/lib.js';
/** the scribes' seats on the bench (world x), the place where Jesus stands, where the bed comes down */
export const SEATX = [488, 548, 608, 668];
export const JH = { x: 900, s: 0.84 };
export const BED = { x: 790, y: HS.FLOOR - 16 };
/**
 * The people of the house: four teachers of the Law seated on the bench (with brows that can frown), Jesus, the
 * listeners inside on the right (one still sprite and an amazed twin to cross-fade), the crowd jammed at the door and
 * in the street (sprites, calm / amazed). Returns handles; the scene poses them.
 */
export function houseCast(S, H, { outside = true } = {}) {
  const c = S.c, cc = makeCutter('lk5-house-cast');
  const mk = (o, men = null) => ({ ...townsfolkM(cc, men ? { man: true } : {}), ...o });
  const inside = [[990, -4, 0.72], [1040, 2, 0.74], [1090, -6, 0.72], [1134, 4, 0.76], [1016, 20, 0.78, 'sit'], [1080, 22, 0.78, 'sit']].map(([x, dy, s, P]) => ({ x, y: HS.FLOOR + dy - 6, s, flip: true, o: mk({ pose: P || 'stand' }) }));
  const insideAwe = inside.map((m) => ({ ...m }));
  const sprite = (L, mem, awe = false, seed = 'house') => L.sprite(pose3Awe('lk5-house-' + seed, mem, awe), 0, 0);
  const inCalm = sprite(H.inL, inside, false, 'in'), inAwe = sprite(H.inL, insideAwe, true, 'in');
  const scribes = SEATX.map((x, i) => ({ i, x, y: HS.FLOOR - 50, seed: c.rr(0, 9), p: S.puppet(H.inL.add(withFaceM(scribeM(c, i, { pose: 'sit' }), faceBitsM(c)))) }));
  scribes.forEach((m) => { m.angry = m.p.el.querySelector('[data-part="angry"]'); });
  const jesus = S.puppet(H.inL.add(person(c, CAST.jesus)));
  let door = null, doorAwe = null, left = null, leftAwe = null;
  if (outside) {
    const dm = [[1230, HS.FLOOR + 4, 0.7], [1270, HS.FLOOR + 30, 0.72], [1318, HS.FLOOR + 52, 0.74], [1200, HS.STREET + 12, 0.78], [1260, HS.STREET + 22, 0.8], [1330, HS.STREET + 16, 0.8], [1400, HS.STREET + 26, 0.82], [1460, HS.STREET + 14, 0.8]].map(([x, y, s]) => ({ x, y, s, flip: true, o: mk({}) }));
    door = sprite(H.streetL, dm, false, 'door'); doorAwe = sprite(H.streetL, dm, true, 'door');
    const lm = [[40, HS.STREET + 14, 0.8], [110, HS.STREET + 24, 0.82], [180, HS.STREET + 10, 0.8], [250, HS.STREET + 26, 0.84]].map(([x, y, s]) => ({ x, y, s, flip: false, o: mk({}) }));
    left = sprite(H.streetL, lm, false, 'left'); leftAwe = sprite(H.streetL, lm, true, 'left');
  }
  return {
    scribes, jesus, inCalm, inAwe, door, doorAwe, left, leftAwe,
    /** a: 0 calm → 1 amazed (arms raised); o: overall opacity */
    crowd(a = 0, o = 1) {
      const sw = a > 0.5 ? 1 : 0;
      inCalm.set({ o: o * (1 - sw) }); inAwe.set({ o: o * sw });
      if (door) { door.set({ o: o * (1 - sw) }); doorAwe.set({ o: o * sw }); left.set({ o: o * (1 - sw) }); leftAwe.set({ o: o * sw }); }
    },
  };
}
/** a still group of people as one cut-out; awe: arms thrown up (baked into the markup) */
export function pose3Awe(seed, mem, awe) {
  const c = makeCutter(seed);
  return mem.slice().sort((a, b) => a.y - b.y).map((m, i) => {
    let p = person(c, m.o);
    if (awe) p = p.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-(i % 3 ? 118 : 40)})">`).replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-(i % 2 ? 168 : 150)})">`);
    else p = p.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-((i * 7) % 22)})">`);
    return `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${p}</g>`;
  }).join('');
}

/* ====================================================================== Levi's great feast (Łk 5,29–35) */
import { feastSet as feastSetM, supperTable as supperTableM, SEATS as SEATSM, lookOf as lookOfM, FP as FPM, FT as FTM } from '../matthew9/lib.js';
import { pose3 as pose3M } from '../matthew4/lib.js';
import { lantern as lanternM, lowTable as lowTableM, bowl as bowlM, loaf as loafM, cup as cupM, jug as jugM, fishDish as fishDishM, grapes as grapesM } from '../mark2/lib.js';
import { purse as purseM } from '../mark5/lib.js';
export { purseM as purse };
export { glyphTag } from '../mark5/lib.js';
export { murmur } from '../john6/lib.js';
/**
 * Levi's courtyard at evening (the Matthew 9 set): the pergola, lanterns, the long table with the disciples, Levi,
 * Jesus and the tax collectors and sinners, a second table on the right for the rest of the great company, and the
 * low wall with the gate on the left where the Pharisees and their scribes stand. Seated guests are still cut-outs;
 * Jesus and Levi are puppets (standing and sitting), the guests who come in are walkers. Returns handles.
 */
export function levisFeast(S, { sky2 = null, pharisees = true } = {}) {
  const c = S.c;
  let PH = null;
  const set = feastSetM(S, {
    skyCols: EVENING, sky2,
    outside: (S2) => {
      const L = S2.layer({ par: FPM, sh: 4 });
      PH = pharisees ? [0, 1, 2].map((i) => ({ i, x: [300, 366, 436][i], seed: S2.c.rr(0, 9), p: S2.puppet(L.add(withFaceM(scribeM(S2.c, i + 1), faceBitsM(S2.c)))) })) : [];
      PH.forEach((m) => { m.angry = m.p.el.querySelector('[data-part="angry"]'); });
      return L;
    },
  });
  const lampL = S.layer({ par: FPM, sh: 5 });
  const lamps = [[640, 336], [1000, 336], [1330, 336]].map(([x, y], i) => ({ i, x, y, el: lampL.add(`<g><path d="M0 -40V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lanternM(c, { col: [C.apricot, C.roseRobe, C.halo][i] })}</g>`) }));
  lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); });
  const L = S.layer({ par: FPM, sh: 5 });
  // the rest of the company at a second table on the right
  const extra = [[1240, 'T', 2], [1300, 'S', 3], [1360, 'T', 0], [1420, 'S', 1]].map(([x, k, n], i) => ({ x, y: FTM.SEAT - 10, s: 0.9, flip: true, armF: 50, armB: 14, head: 2, o: { ...(k === 'T' ? TAXMEN_L[n % TAXMEN_L.length] : SINNERS_L[n % SINNERS_L.length]), pose: 'sit' } }));
  const table2 = `<g transform="translate(1330 ${FTM.FLOOR - 8}) scale(.9)">${lowTableM(c, 260)}<g transform="translate(-80 -44)">${bowlM(c, { food: 'fruit' })}</g><g transform="translate(-10 -44)">${loafM(c, 16)}</g><g transform="translate(60 -44)">${cupM(c)}</g><g transform="translate(100 -44)">${cupM(c, C.ochre)}</g></g>`;
  const company = L.sprite(`<g>${pose3M(c, extra)}${table2}</g>`, 0, 0);
  const seat = (o, flip, armF = 56) => L.add(`<g>${pose3M(c, [{ x: 0, y: 0, s: 1, flip, armF, armB: 16, head: 2, o: { ...o, pose: 'sit' } }])}</g>`);
  const places = SEATSM.map(([x, who], i) => ({ i, x, who, guest: who.length === 2, el: who === 'jesus' || who === 'matthew' ? null : seat(lookOfM(who), x > 845) }));
  const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
  const jStand = S.puppet(L.add(person(c, CAST.jesus)));
  const leviSit = S.puppet(L.add(withFaceM(person(c, { ...LEVI, pose: 'sit' }), faceBitsM(c))));
  const leviStand = S.puppet(L.add(withFaceM(person(c, { ...LEVI, holdF: `<g transform="translate(-2 6) scale(.62)">${jugM(c)}</g>` }), faceBitsM(c))));
  const walkers = places.filter((p) => p.guest).map((p, k) => {
    const o = lookOfM(p.who);
    return { ...p, k, from: p.x < 845 ? 440 : 1330, p: S.puppet(L.add(person(c, { ...o, holdB: p.who[0] === 'T' ? `<g transform="translate(0 -4)">${purseM(c, 1)}</g>` : '' }))), seed: c.rr(0, 9) };
  });
  const tableL = S.layer({ par: FPM, sh: 5 });
  tableL.add(`<g transform="translate(${FTM.TX} ${FTM.FLOOR})">${supperTableM(c)}</g>`);
  const platter = tableL.add(`<g>${sheet().p(c.cut(c.ell(0, -4, 54, 8, 16), 0.3, 4), C.stone2).out()}<g transform="translate(-20 -6)">${fishDishM(c)}</g><g transform="translate(26 -8) scale(1.2)">${grapesM(c)}</g></g>`);
  const fx = S.layer({ par: FPM, sh: 6 });
  return {
    set, PH, lamps, L, company, places, jSit, jStand, leviSit, leviStand, walkers, tableL, platter, fx,
    idle(T, lit = 1) {
      set.update(T);
      lamps.forEach((l) => { pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.8 + l.i) * 1.5 }); });
      lamps.forEach((l) => fade(l.glow, lit));
    },
    /** seat the regular company (disciples); guests: 0 → 1 (seated guests shown) */
    seatAll(guests = 1) {
      places.forEach((p) => { if (p.el) pose(p.el, { x: p.x, y: FTM.SEAT, o: p.guest ? guests : 1 }); });
      company.set({ o: guests });
    },
  };
}
const TAXMEN_L = [
  { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin2, belt: C.ochre },
  { robe: mix(C.indigo, C.plumRobe, 0.5), mantle: C.ochre, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun },
  { robe: C.tealRobe, mantle: C.terracotta, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.ochre },
];
const SINNERS_L = [
  { robe: C.roseRobe, mantle: C.mauve, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, skin: C.skin2 },
  { robe: mix(C.stone2, C.rock2, 0.4), hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin4, belt: C.rope },
  { robe: C.dustyBlue, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope },
  { robe: C.wheatRobe, mantle: C.clayMantle, hairStyle: 'veil', veil: C.ochreRobe, hair: C.hair2, skin: C.skin3 },
];
