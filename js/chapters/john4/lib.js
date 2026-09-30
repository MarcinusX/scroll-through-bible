// John 4 — the cast and cut-outs of this chapter: the Samaritan woman and her jar, Jacob's well, Sychar under
// Mount Gerizim, the day-arc of the hours, the paper map of the Holy Land, the royal official and his son.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, grass, flowers, rock, house, sun, cloud, olive, cypress, bush } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, loaf, bowl, cup, addToHead, addToBody, dust } from '../mark2/lib.js';
export { LOOK, withFace, faceBits, nameTag, bubble, strip, shadowPerson, silhouette, along, question, sparkle, card } from '../mark3/lib.js';
export { voiceRings, hang2, tagOnString, plate, signpost, flame, JOHN_B, footprint } from '../mark1/lib.js';
export { say, qmark, bang, child, shadeTree, slip, doll } from '../mark10/lib.js';
export { glory, globe, soulLight, lightCrown, tag, heavenPanel, oilHorn } from '../mark8/lib.js';
export { sheep, storyFrame, SEPIA, basket, fishCut, drop as dropIn } from '../mark6/lib.js';
export { vis, templeMini } from '../mark14/lib.js';
export { stoneJar } from '../mark7/lib.js';
export { jerusalem, mountain } from '../mark11/lib.js';
export { bedFrame, blanket as bedBlanket } from '../mark5/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, crowdPerson };

import { LOOK as L3, pharisee as ph3, withFace as withFace3, faceBits as faceBits3, headAt as headAt3 } from '../mark3/lib.js';
import { blinkAt } from '../../assets/people.js';
import { shadeTree } from '../mark10/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ====================================================================== the cast */
/** the Samaritan woman: golden robe, deep teal mantle and veil, a terracotta sash — dignified, unmistakable */
export const SAM = {
  robe: C.ochreRobe, mantle: C.teal2, hairStyle: 'veil', veil: C.teal2, veil2: shade(C.teal2, 0.18), hair: C.hair3,
  skin: C.skin3, belt: C.terracotta, mantleArm: false,
};
/** the disciples of the first days (Jn 1): Peter, Andrew, John, Philip, Nathanael */
export const DISC = [CAST.peter, CAST.andrew, CAST.john, L3.philip, L3.bartholomew];
/** the royal official of Capernaum: fine indigo robe, gold-trimmed saffron cloak */
export const OFFICIAL = { robe: C.indigo, mantle: C.ochre, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.sun, beard: 'short' };
export const SON = { robe: C.linen, skin: C.skin2, hair: C.hair3, hairStyle: 'curly', beard: 'none', belt: C.sun };
export const MOTHER = { robe: C.roseRobe, mantle: C.lavender, hairStyle: 'veil', veil: C.lavender, veil2: shade(C.lavender, -0.12), hair: C.hair3, skin: C.skin2, belt: C.sun };
export const SERVANTS = [
  { robe: C.stone, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather },
  { robe: C.sageRobe, mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'none', skin: C.skin4, belt: C.leather },
];
export const pharisee = (c, i = 0) => ph3(c, i);

/** a Samaritan of Sychar (robes of the town; `white`: the white robes of the harvest) */
export function samaritan(c, i = 0, { white = false, man = null } = {}) {
  const o = crowdPerson(c);
  const isMan = man ?? i % 2 === 0;
  if (isMan) { o.hairStyle = ['short', 'wrap', 'curly', 'wrap'][i % 4]; o.beard = ['full', 'short', 'full'][i % 3]; o.veil = [C.linen2, C.stone, C.ochreRobe][i % 3]; }
  else { o.hairStyle = 'veil'; o.beard = 'none'; }
  if (white) {
    o.robe = [C.linen, C.cream, C.linen2, '#fbf7ee'][i % 4];
    o.mantle = i % 3 === 0 ? mix(C.linen2, C.wheat, 0.25) : null;
    if (o.hairStyle === 'veil' || o.hairStyle === 'wrap') o.veil = [C.linen, C.cream, C.linen2][i % 3];
  }
  return o;
}

/* ====================================================================== props */
/** a tall clay water jar with two handles (origin: its foot) */
export function hydria(c, { col = C.pot, sc = 1 } = {}) {
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  const s = sheet();
  s.p(c.cut(P([[-13, -64], [-16, -80], [-9, -86], [-11, -72]]), 0.2, 3) + c.cut(P([[13, -64], [16, -80], [9, -86], [11, -72]]), 0.2, 3), shade(col, -0.18));
  s.p(c.cut(P([[-8, 0], [-18, -8], [-24, -28], [-22, -50], [-12, -64], [-8, -76], [-11, -84], [11, -84], [8, -76], [12, -64], [22, -50], [24, -28], [18, -8], [8, 0]]), 0.5, 5), col);
  s.x(c.ribbon(P([[-22, -40], [22, -40]]), 2.4 * sc) + c.ribbon(P([[-23, -32], [23, -32]]), 1.4 * sc), C.cream, 'opacity=".55"');
  s.x(c.cut(P(c.ell(0, -84, 10, 2.6, 10)), 0.2, 2), shade(col, -0.45));
  s.x(c.poly(P([[-15, -56], [-10, -60], [-12, -30], [-17, -30]])), '#fff', 'opacity=".18"');
  return s.out();
}
/** a coil of rope with a small leather bucket (origin: the bucket's rim centre) */
export function bucketRope(c) {
  const s = sheet();
  s.p(c.cut([[-12, 0], [12, 0], [9, 18], [-9, 18]], 0.3, 4), C.leather);
  s.x(c.ribbon(c.arc(0, 0, 12, 3, 0, PI * 2, 12), 2), shade(C.leather, -0.3));
  s.p(c.ribbon(c.arc(0, 0, 12, 16, PI * 1.05, PI * 1.95, 10), 2), C.rope);
  return s.out();
}
/** a hanging rope with the bucket at its end (origin: top of the rope; len along +y) */
export function ropeDown(c, len = 200) {
  return sheet().x(c.ribbon([[0, 0], [0.5, len]], 2.2), C.rope).out() + `<g transform="translate(0 ${len})">${bucketRope(c)}</g>`;
}
/** Jacob's well: a round stone parapet with a wooden beam and a pulley (origin: foot centre) */
export function well(c, { r = 64, h = 48 } = {}) {
  const s = sheet();
  // posts & beam (behind)
  s.p(c.cut(c.rect(-r + 6, -h - 118, 9, 120), 0.3, 6) + c.cut(c.rect(r - 15, -h - 118, 9, 120), 0.3, 6), C.wood2);
  s.p(c.cut(c.rect(-r - 4, -h - 126, 2 * r + 8, 11), 0.4, 6), C.wood);
  s.p(c.cut(c.circ(0, -h - 108, 11, 14), 0.3, 4), C.wood3);
  s.x(c.poly(c.circ(0, -h - 108, 3, 8)), C.wood2);
  // the dark mouth
  s.p(c.cut(c.ell(0, -h, r, 15, 26), 0.4, 5), shade(C.stone, -0.25));
  s.p(c.cut(c.ell(0, -h + 2, r - 9, 10, 24), 0.3, 5), mix(C.soilDark, C.lakeDeep, 0.35));
  // the drum of stones
  s.p(c.cut([[-r, -h], ...c.arc(0, -h, r, 15, PI, 0, 14).reverse(), [r, -h], [r, 0], ...c.arc(0, 0, r, 12, 0, PI, 14), [-r, 0]], 0.6, 6), C.stone);
  let st = '';
  for (let row = 0; row < 3; row++) {
    const y = -h + 12 + row * 14;
    st += c.ribbon(c.arc(0, y, r, 12, 0.05, PI - 0.05, 14), 1.3);
    for (let k = 0; k < 6; k++) { const a = 0.35 + k * 0.45 + (row % 2) * 0.22; if (a > PI - 0.2) continue; const x = Math.cos(a) * r; st += c.ribbon([[x, y + Math.sin(a) * 12], [x, y + Math.sin(a) * 12 + 13]], 1.2); }
  }
  s.x(st, shade(C.stone, -0.2), 'opacity=".55"');
  s.p(c.ribbon(c.arc(0, -h, r + 2, 16, 0, PI, 16), 7), shade(C.stone, 0.12));
  s.x(c.cut(c.blob(-r * 0.55, -h + 22, 12, 6, 7, 0.2), 0.3, 3) + c.cut(c.blob(r * 0.4, -12, 9, 5, 7, 0.2), 0.3, 3), C.moss, 'opacity=".6"');
  return s.out();
}
/** a plain cup (origin foot) */
export function cupJ(c, col = C.pot) {
  return sheet().p(c.cut([[-12, -24], [12, -24], [8, -4], [4, 0], [-4, 0], [-8, -4]], 0.3, 4), col).x(c.cut(c.ell(0, -24, 12, 3, 10), 0.2, 2), shade(col, -0.35)).out();
}
/** a gift tied with a ribbon (origin centre); .lid can be lifted */
export function gift(c, w = 70) {
  const b = sheet();
  b.p(c.cut(c.rect(-w / 2, -w * 0.25, w, w * 0.62), 0.4, 6), C.cream);
  b.p(c.cut(c.rect(-6, -w * 0.25, 12, w * 0.62), 0.2, 4), C.terracotta);
  const l = sheet();
  l.p(c.cut(c.rect(-w / 2 - 5, -w * 0.25 - 16, w + 10, 17), 0.4, 6), shade(C.cream, -0.06));
  l.p(c.cut(c.rect(-6, -w * 0.25 - 16, 12, 17), 0.2, 4), C.terracotta);
  l.p(c.cut([[0, -w * 0.25 - 16], [-24, -w * 0.25 - 34], [-20, -w * 0.25 - 16]], 0.3, 4) + c.cut([[0, -w * 0.25 - 16], [24, -w * 0.25 - 34], [20, -w * 0.25 - 16]], 0.3, 4), C.terracotta);
  return `<g class="glow" opacity="0"><circle cy="-${w * 0.3}" r="${w * 1.2}" fill="url(#halo-glow)"/></g>${b.out()}<g class="lid">${l.out()}</g>`;
}
/** a stream of water as a ribbon along pts, with glints (fill `col`) */
export function streamPath(c, pts, w = 12, col = '#bfe3ea') {
  return sheet().p(c.ribbon(pts, (u) => w * (0.55 + 0.45 * Math.sin(u * PI))), col).x(c.ribbon(pts.map(([x, y]) => [x, y - w * 0.18]), w * 0.25), '#ffffff', 'opacity=".7"').out();
}
/** a thin paper ring (hoop) — origin centre */
export function hoop(c, r = 26, col = C.sun) {
  return sheet().p(c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 28), 5), col).out();
}
/** a hoop cut short: a ring that does not close (dashed) */
export function brokenHoop(c, r = 26, col = C.stone2) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a0 = (i / 9) * PI * 2, a1 = a0 + 0.42; d += c.ribbon(c.arc(0, 0, r, r, a0, a1, 4), 4); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a little light of truth — a candle flame on a small clay lamp (origin: lamp foot) */
export function truthLamp(c) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [28, -8], [18, -2], [10, 1], [-12, 1]], 0.3, 4), C.pot);
  return `<circle cx="26" cy="-26" r="80" fill="url(#warm-glow)" class="glow"/>${s.out()}<g class="flame" transform="translate(26 -12)"><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -10 0 -15C3 -10 3 -6 0 -2Z" fill="#fff4d2"/></g>`;
}
/** an hourglass (origin centre); .sandT / .sandB are scaled by the scene */
export function hourglassJ(c, h = 90) {
  const s = sheet();
  s.p(c.cut(c.rect(-h * 0.36, -h / 2 - 8, h * 0.72, 9), 0.3, 5) + c.cut(c.rect(-h * 0.36, h / 2 - 1, h * 0.72, 9), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-h * 0.33, -h / 2, 5, h), 0.2, 5) + c.cut(c.rect(h * 0.33 - 5, -h / 2, 5, h), 0.2, 5), C.wood);
  const glass = c.poly([[-h * 0.26, -h / 2], [h * 0.26, -h / 2], [h * 0.04, -3], [h * 0.26, h / 2], [-h * 0.26, h / 2], [-h * 0.04, -3]]);
  return `${s.out()}<path d="${glass}" fill="#eef6f4" opacity=".7"/><g class="sandT"><path d="${c.poly([[-h * 0.22, 0], [h * 0.22, 0], [0, h * 0.42]])}" fill="${C.sand2}" transform="translate(0 ${-h * 0.46})"/></g><g class="sandB" transform="translate(0 ${h / 2})"><path d="${c.poly([[-h * 0.24, 0], [h * 0.24, 0], [0, -h * 0.3]])}" fill="${C.sand2}"/></g><path class="sandS" d="M-1 -4H1V${h / 2}H-1Z" fill="${C.sand2}"/>`;
}

/* ---------- the hours of the day: a half-dial from sunrise (1st hour) to sunset (12th hour) ---------- */
/** a paper day-arc (origin: centre of its base). The little sun is a separate piece posed with hourAt(). */
export function dayArc(c, r = 110, { label = '', marks = [6, 7] } = {}) {
  const s = sheet();
  const fill = mix(C.parchment, C.skyBlue, 0.25);
  s.p(c.cut([[-r - 18, 8], ...c.arc(0, 0, r + 18, r + 18, PI, 2 * PI, 26), [r + 18, 8]], 0.6, 6), C.wood3);
  s.p(c.cut([[-r - 46, 8], ...c.arc(0, 0, r + 46, r + 46, PI, 2 * PI, 30), [r + 46, 8], [r + 18, 8], ...c.arc(0, 0, r + 18, r + 18, 2 * PI, PI, 26), [-r - 18, 8]], 0.5, 6), C.cream);
  s.p(c.cut([[-r - 8, 0], ...c.arc(0, 0, r + 8, r + 8, PI, 2 * PI, 26), [r + 8, 0]], 0.5, 6), fill);
  let ticks = '';
  for (let h = 0; h <= 12; h++) {
    const a = PI + (h / 12) * PI, r0 = r - 8, r1 = r + 4 + (h % 3 === 0 ? 3 : 0);
    ticks += c.ribbon([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], h % 3 === 0 ? 2.6 : 1.6);
  }
  s.x(ticks, C.inkSoft, 'opacity=".6"');
  s.x(c.ribbon(c.arc(0, 0, r - 8, r - 8, PI, 2 * PI, 24), 1.2), C.inkSoft, 'opacity=".35"');
  const RN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  let txt = '';
  marks.forEach((h) => {
    const a = PI + (h / 12) * PI, rr = r + 32;
    txt += `<text x="${(Math.cos(a) * rr).toFixed(1)}" y="${(Math.sin(a) * rr + 6).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.terracotta}">${RN[h]}</text>`;
  });
  if (label) txt += `<text x="0" y="-10" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.inkSoft}">${label}</text>`;
  return `<path d="M0 -1600V${-r - 46}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${txt}`;
}
/** where the little sun sits on a dayArc for hour h (middle of the h-th hour = h - 0.5) */
export function hourAt(r, h) { const a = PI + (h / 12) * PI; return [Math.cos(a) * r, Math.sin(a) * r]; }
/** the little sun token for dayArc */
export function sunToken(c, r = 13) {
  return `<circle r="${r * 2.6}" fill="url(#warm-glow)"/>${sheet().p(c.cut(c.star(0, 0, r * 1.35, r * 1.02, 12, 0), 0.3, 3), C.sunRay).p(c.cut(c.circ(0, 0, r, 16), 0.3, 3), C.sun).out()}`;
}

/* ====================================================================== places */
/** Mount Gerizim with the ruins of the Samaritan temple on its flat top (origin: middle of its foot) */
export function gerizim(c, w = 620, h = 250, col = mix(C.hillFar, C.rock, 0.35)) {
  const s = sheet();
  const pts = [[-w / 2 - 200, 60], [-w / 2, 0], [-w * 0.34, -h * 0.55], [-w * 0.2, -h * 0.9], [-w * 0.08, -h], [w * 0.12, -h * 1.0], [w * 0.22, -h * 0.9], [w * 0.36, -h * 0.5], [w / 2, -h * 0.1], [w / 2 + 200, 60]];
  s.p(c.cut(pts, 1.2, 12), col);
  s.p(c.cut([[-w * 0.2, -h * 0.9], [-w * 0.1, -h * 0.98], [-w * 0.18, -h * 0.6], [-w * 0.3, -h * 0.45]], 0.8, 8), shade(col, 0.18));
  let terr = '';
  for (let i = 0; i < 5; i++) { const y = -h * (0.2 + i * 0.13); terr += c.ribbon([[-w * (0.4 - i * 0.05), y], [w * (0.4 - i * 0.05), y + c.rr(-4, 4)]], 1.4); }
  s.x(terr, shade(col, -0.12), 'opacity=".5"');
  // ruins
  const R = sheet();
  const top = -h + 2;
  R.p(c.cut(c.rect(-70, top - 10, 150, 12), 0.4, 6), mix(C.stone2, C.rock, 0.3));
  let cols = '';
  [[-60, 46], [-36, 30], [-10, 54], [18, 20], [44, 40], [66, 14]].forEach(([x, hh]) => { cols += c.cut([[x - 5, top - 10], [x - 5, top - 10 - hh], [x - 2, top - 14 - hh], [x + 5, top - 8 - hh], [x + 5, top - 10]], 0.3, 4); });
  R.p(cols, mix(C.stone, C.rock, 0.25));
  R.p(c.cut([[-16, top - 66], [30, top - 60], [28, top - 54], [-18, top - 60]], 0.3, 4), mix(C.stone, C.rock, 0.3));
  R.p(c.cut(c.rect(80, top - 16, 26, 7), 0.3, 4), mix(C.stone2, C.rock, 0.4));
  let trees = '';
  for (let i = 0; i < 9; i++) { const x = c.rr(-w * 0.36, w * 0.36), y = -h * c.rr(0.15, 0.75) * (1 - Math.abs(x) / w); trees += c.cut(c.blob(x, y, 9, 7, 8, 0.2), 0.4, 3); }
  s.p(trees, C.olive);
  return s.out() + R.out();
}
/** Sychar: a small hill town with a low wall and a gate (origin: foot of the gate) */
export function sychar(c, sc = 1, { lit = false } = {}) {
  let out = '';
  const P = (v) => v * sc;
  const hill = sheet().p(c.cut([[P(-360), P(40)], [P(-300), P(-40)], [P(-160), P(-96)], [P(0), P(-110)], [P(170), P(-90)], [P(300), P(-40)], [P(360), P(40)]], 1, 10), mix(C.hillMid, C.sand2, 0.35)).out();
  out += hill;
  const hs = [[-230, -70, 54, 40], [-170, -96, 60, 46], [-100, -112, 50, 38], [-40, -118, 64, 50], [30, -114, 56, 44], [96, -100, 60, 40], [160, -84, 50, 36], [-130, -60, 48, 34], [70, -66, 52, 36]];
  hs.forEach(([x, y, w, h]) => { out += house(c, P(x), P(y), P(w), P(h), { stairs: c.chance(0.4), lit: lit && c.chance(0.7) }); });
  const w = sheet();
  const wc = mix(C.stone, C.sand2, 0.35);
  w.p(c.cut([[P(-280), P(-8)], [P(-40), P(-24)], [P(-40), P(4)], [P(-280), P(18)]], 0.5, 8) + c.cut([[P(40), P(-24)], [P(270), P(-10)], [P(270), P(16)], [P(40), P(4)]], 0.5, 8), wc);
  w.p(c.cut([[P(-44), P(8)], [P(-44), P(-54)], [P(44), P(-54)], [P(44), P(8)]], 0.5, 6), shade(wc, 0.08));
  w.p(c.cut([[P(-22), P(8)], [P(-22), P(-22)], ...c.arc(0, P(-22), P(22), P(22), PI, 2 * PI, 8), [P(22), P(8)]], 0.3, 5), mix(C.soilDark, C.wood2, 0.4));
  out += w.out();
  out += cypress(c, P(-310), P(-20), P(70)) + cypress(c, P(230), P(-50), P(60)) + olive(c, P(300), P(10), 0.5 * sc);
  return out;
}

/* ---------- the well by Sychar: the chapter's main set ---------- */
export const NOON = ['#e9d6a6', '#f6e5bd', '#faefd4'];
export const MORN = ['#cfe0da', '#efe6cd', '#f6e8cf'];
export const AFTER = ['#dcd8bc', '#f3e2c0', '#f8ead0'];
export const G = { floor: 700, well: 845, jx: 716, wx: 985, road: [[980, 712], [1110, 690], [1220, 650], [1300, 606], [1350, 570], [1392, 546]] };
/**
 * wellSet(S, o) — sky with a hanging sun, Gerizim with its ruins (left), Sychar on its hill (right), young
 * green fields, the plaza of beaten earth, the shade tree and Jacob's well. Returns layers and an update().
 * o: skyCols, sunAt, act (par of the action layer), fields ('green' | 'white'), town (bool), extraFar(fn)
 */
export function wellSet(S, o = {}) {
  const c = S.c;
  const { skyCols = NOON, sunAt = [1060, 150], sunR = 46, act = 0.55, fields = 'green', clouds = [[430, 160, 170], [1260, 230, 120]] } = o;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunGlow = hangL.add(`<circle r="190" fill="url(#warm-glow)" opacity=".55"/>`);
  const sunEl = hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = clouds.map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 600 }), x, y, i }));
  // far: Gerizim (left) and Ebal (right)
  const farL = S.layer({ par: 0.1, sh: 2 });
  farL.add(band(c, { y: 470, amps: [16, 8, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
  const ger = farL.add(`<g>${gerizim(c, 560, 170, mix(C.hillFar, C.sage2, 0.25))}</g>`);
  const gerX = S.portrait ? 600 : 520;       // phone: the mountain and its ruins clear of the screen edge
  pose(ger, { x: gerX, y: 478 });
  farL.add(sheet().p(c.cut([[1000, 520], [1180, 420], [1330, 372], [1480, 360], [1640, 392], [1900, 470], [2200, 520]], 1.2, 12), mix(C.hillFar, C.sage2, 0.3)).out());
  // mid: Sychar on its hill, fields
  const midL = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 530, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
  midL.add(h2.markup);
  midL.add(`<g transform="translate(1400 ${h2.fn(1400) + 6})">${sychar(c, 0.62, { lit: o.lit })}</g>`);
  const fieldL = S.layer({ par: 0.3, sh: 3 });
  const ffn = c.wave(585, [5, 2], [700, 160]);
  const fs = sheet();
  fs.p(c.ridge(ffn, -900, 2500, 1700, 12, 1), fields === 'white' ? mix(C.wheat, C.cream, 0.35) : mix(C.wheatGreen, C.sage2, 0.4));
  let rows = '';
  for (let i = 0; i < 6; i++) { const y = 598 + i * 9; rows += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4 + i * 0.3); }
  fs.x(rows, fields === 'white' ? shade(C.wheat2, -0.05) : shade(C.wheatGreen, -0.2), 'opacity=".5"');
  fieldL.add(fs.out());
  fieldL.add(olive(c, 120, ffn(120) + 8, 0.7) + olive(c, 1560, ffn(1560) + 8, 0.65) + cypress(c, 260, ffn(260) + 4, 110));
  // the plaza, the road up to the town, the shade tree
  const groundL = S.layer({ par: 0.42, sh: 3 });
  const gfn = c.wave(640, [4, 2], [600, 150]);
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.4));
  gs.p(c.ribbon([[1000, 1100], [1060, 760], [1170, 690], [1300, 652], [1500, 626], [1800, 612]], (u) => 170 * (1 - u) + 22), mix(C.sand2, C.dune, 0.3));
  let stones = '';
  for (let i = 0; i < 30; i++) { const x = c.rr(-500, 2100), y = c.rr(gfn(x) + 20, 1000); stones += c.cut(c.blob(x, y, c.rr(4, 10), c.rr(2, 5), 7, 0.2), 0.3, 3); }
  gs.x(stones, shade(C.sand2, -0.16), 'opacity=".6"');
  groundL.add(gs.out());
  groundL.add(grass(c, { x0: -600, x1: 2200, y: 640, fn: gfn, n: 30, h: 13, color: C.olive }));
  const tree = groundL.add(`<g>${shadeTree(c, 470, 648, 1.25)}</g>`);
  const treeShadow = groundL.add(`<ellipse cx="470" cy="652" rx="150" ry="12" fill="${shade(C.sand2, -0.3)}" opacity=".35"/>`);
  groundL.add(rock(c, 1180, 660, 60, 22, C.rock) + rock(c, 230, 656, 70, 26, C.rock2) + bush(c, 1300, 650, 60, C.sage, C.moss));
  // layers a scene wants between the landscape and the action (glows behind the people)
  const behind = o.behind ? o.behind(S) : null;
  // the action layer: well + people
  const actL = S.layer({ par: act, sh: 5 });
  const wellEl = actL.add(`<g>${well(c)}</g>`);
  pose(wellEl, { x: G.well, y: G.floor + 6, s: 1.1 });
  const benchEl = actL.add(sheet().p(c.cut([[G.jx - 40, G.floor], [G.jx - 36, G.floor - 32], [G.jx + 30, G.floor - 34], [G.jx + 38, G.floor]], 0.6, 6), mix(C.stone, C.rock, 0.3)).out());
  // foreground
  const fgL = S.layer({ par: 0.95, sh: 6 });
  const fgf = c.wave(960, [8, 4], [500, 150]);
  fgL.add(sheet().p(c.ridge(fgf, -1400, 3000, 1800, 14, 1.4), C.moss2).out());
  fgL.add(grass(c, { x0: -1400, x1: 3000, y: 960, fn: fgf, n: 60, h: 30, color: C.moss2 }));
  fgL.add(flowers(c, { x0: -1400, x1: 3000, y: 960, fn: fgf, n: 30, h: 30 }));
  return {
    sk, hangL, farL, midL, fieldL, groundL, actL, fgL, behind, sunEl, sunGlow, cls, ger, gerX, gfn, tree, treeShadow, wellEl, benchEl,
    update(t, time, { sunX = sunAt[0], sunY = sunAt[1], glow = 0.55, drift = 1 } = {}) {
      swing(sunEl, sunX, sunY, time, 1.1, 0.6);
      pose(sunGlow, { x: sunX, y: sunY, s: 0.8 + glow * 0.6, o: glow });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 24 * drift, cl.y, time, 1.4, 0.7, cl.i));
    },
  };
}

/** carry a jar on the back shoulder: where the jar goes for a puppet at (x, y, s, flip) */
export function jarOnShoulder(x, y, s, flip, bob = 0) {
  const d = flip ? -1 : 1;
  return { x: x - d * 20 * s, y: y - 146 * s + bob, s: s * 0.78, r: -d * 10 };
}
/** the Samaritan woman as a puppet (with face bits) + her own jar; returns { p, el, jar, face(part, o) } */
export function womanRig(S, L, { pose: P = 'stand', jar = true } = {}) {
  const c = S.c;
  const el = L.add(withFace3(person(c, { ...SAM, pose: P }), faceBits3(c)));
  const jarEl = jar ? L.add(`<g>${hydria(c)}</g>`) : null;
  return { p: S.puppet(el), el, jar: jarEl, face: (part, o) => { const n = el.querySelector(`[data-part="${part}"]`); if (n) pose(n, { o }); } };
}

/* ====================================================================== the map */
/** the Holy Land on parchment: Galilee, Samaria, Judea, the Jordan; returns { markup, spots } (origin centre) */
export function holyLandMap(c, { w = 700, h = 520 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2.2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 16, -h / 2 + 16], [w / 2 - 16, -h / 2 + 16], [w / 2 - 16, h / 2 - 16], [-w / 2 + 16, h / 2 - 16], [-w / 2 + 16, -h / 2 + 18]], 2), C.clay, 'opacity=".5"');
  // the sea on the left
  const coast = [[-w / 2 + 18, -h / 2 + 18], [-190, -h / 2 + 18], [-176, -170], [-196, -80], [-212, 20], [-232, 120], [-252, h / 2 - 18], [-w / 2 + 18, h / 2 - 18]];
  s.p(c.cut(coast, 1.2, 8), mix(C.lake, C.skyBlue, 0.3));
  let waves = '';
  for (let i = 0; i < 7; i++) { const x = -300 + c.rr(-20, 20), y = -200 + i * 62; waves += c.ribbon(c.arc(x, y, 12, 5, PI * 1.1, PI * 1.9, 5), 1.6); }
  s.x(waves, C.foam, 'opacity=".7"');
  // regions
  const galilee = [[-176, -h / 2 + 22], [150, -h / 2 + 22], [140, -120], [60, -86], [-190, -96]];
  const samaria = [[-192, -92], [60, -82], [120, -60], [130, 50], [-210, 60]];
  const judea = [[-212, 64], [130, 54], [150, h / 2 - 22], [-246, h / 2 - 22]];
  s.p(c.cut(galilee, 1.2, 10), mix(C.parchment, C.sage2, 0.45));
  s.p(c.cut(samaria, 1.2, 10), mix(C.parchment, C.ochre, 0.28));
  s.p(c.cut(judea, 1.2, 10), mix(C.parchment, C.clay, 0.25));
  // hills
  let hills = '';
  [[-120, -170], [-60, -140], [-100, -20], [-40, 10], [-130, 150], [-60, 190], [20, 140], [30, -30], [60, 170]].forEach(([x, y]) => { hills += c.cut([[x - 18, y + 8], [x, y - 14], [x + 18, y + 8]], 0.5, 5); });
  s.x(hills, shade(C.parchment, -0.18), 'opacity=".7"');
  // Jordan, the lake and the Dead Sea
  const lakeG = [[120, -190], [150, -186], [166, -160], [160, -130], [140, -112], [118, -124], [110, -158]];
  const dead = [[150, 120], [176, 118], [184, 170], [176, 222], [156, 230], [146, 180]];
  s.p(c.ribbon([[140, -112], [150, -60], [140, 0], [156, 50], [150, 120]], 5), C.lake2);
  s.p(c.cut(lakeG, 0.8, 5), C.lake);
  s.p(c.cut(dead, 0.8, 5), mix(C.lake, C.stone, 0.4));
  s.x(c.poly(c.star(w / 2 - 60, -h / 2 + 64, 24, 5, 4, 0)), C.clay, 'opacity=".6"');
  const spots = {
    jordan: [146, 70], jerusalem: [40, 128], sychar: [-10, -18], gerizim: [-30, -6], nazareth: [-40, -134], cana: [-10, -160], capernaum: [120, -180],
    route: [[146, 70], [130, 40], [90, 10], [40, -8], [-10, -18], [-20, -60], [-30, -110], [-10, -160]],
  };
  const T = (x, y, text, { size = 16, anchor = 'start', col = C.inkSoft } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${text}</text>`;
  let dots = '';
  [['jerusalem', 1.3], ['nazareth', 1], ['cana', 1], ['capernaum', 1]].forEach(([k, sz]) => { const [x, y] = spots[k]; dots += c.cut(c.rect(x - 6 * sz, y - 5 * sz, 12 * sz, 9 * sz), 0.3, 4) + c.cut([[x - 8 * sz, y - 5 * sz], [x, y - 12 * sz], [x + 8 * sz, y - 5 * sz]], 0.3, 4); });
  s.p(dots, C.clay);
  let labels = '';
  labels += T(-60, -206, tr('Galilea', 'Galilee'), { size: 30, anchor: 'middle', col: C.terracotta });
  labels += T(-110, 34, tr('Samaria', 'Samaria'), { size: 28, anchor: 'middle', col: C.terracotta });
  labels += T(-80, 206, tr('Judea', 'Judea'), { size: 30, anchor: 'middle', col: C.terracotta });
  labels += T(52, 136, tr('Jerozolima', 'Jerusalem'));
  labels += T(-28, -130, tr('Nazaret', 'Nazareth'));
  labels += T(4, -164, tr('Kana', 'Cana'));
  labels += T(96, -204, tr('Kafarnaum', 'Capernaum'), { anchor: 'middle' });
  labels += T(166, 40, tr('Jordan', 'Jordan'), { size: 14, col: shade(C.lakeDeep, -0.1) });
  labels += T(-290, -120, tr('Morze Wielkie', 'Great Sea'), { size: 15, anchor: 'middle', col: shade(C.lakeDeep, -0.1) });
  return { markup: s.out() + labels, spots, regions: { galilee, samaria, judea } };
}

/* ====================================================================== the split stage (Jn 4,46–54) */
/** a framed round window (a hanging inset) — returns markup; the inner is clipped; origin centre */
export function roundel(S, inner, { r = 150, rim = C.wood3, bg = C.skyBlue, k } = {}) {
  const c = S.c;
  const id = S.id('rnd' + (k || Math.round(c.rr(0, 1e6))));
  S.defs(`<clipPath id="${id}"><circle r="${r}"/></clipPath>`);
  const fr = sheet().p(c.cut(c.circ(0, 0, r + 12, 48), 0.5, 6), rim).out();
  return `${fr}<g clip-path="url(#${id})"><circle r="${r + 2}" fill="${bg}"/>${inner}</g>`;
}
/** a rectangular hanging inset (origin: top centre); inner is clipped to w×h */
export function panel(S, inner, { w = 420, h = 280, rim = C.wood2, bg = C.parchment, k } = {}) {
  const c = S.c;
  const id = S.id('pnl' + (k || Math.round(c.rr(0, 1e6))));
  S.defs(`<clipPath id="${id}"><rect x="${-w / 2}" y="0" width="${w}" height="${h}"/></clipPath>`);
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 11, -11, w + 22, h + 22), 0.6, 8), rim).out();
  return `<path d="M${-w * 0.3} -1600V-10M${w * 0.3} -1600V-10" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${fr}<g clip-path="url(#${id})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${bg}"/>${inner}</g>`;
}
/** fever: three wavy red ribbons rising (origin bottom centre) */
export function feverWaves(c, h = 60, col = '#e0664f') {
  let d = '';
  for (let i = -1; i <= 1; i++) d += c.ribbon(c.cbez([i * 14, 0], [i * 14 + 10, -h * 0.33], [i * 14 - 10, -h * 0.66], [i * 14, -h], 14), 3.2);
  return `<path d="${d}" fill="${col}" opacity=".75"/>`;
}
/** the number of a sign on a round tag (origin at the string hole) */
export function signTag(c, n, icon = '') {
  const s = sheet();
  s.p(c.cut(c.circ(0, 44, 40, 30), 0.5, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 44, 33, 30), 0.4, 5), C.cream);
  s.x(c.poly(c.circ(0, 6, 3.4, 8)), C.wood2);
  return `<circle cy="44" r="80" fill="url(#halo-glow)"/>${s.out()}${icon}<text x="0" y="${icon ? 70 : 58}" text-anchor="middle" font-family="${FONT}" font-size="${icon ? 22 : 40}" font-style="italic" fill="${C.terracotta}">${n}</text>`;
}

/** the two at the well: Jesus seated on the bench, the woman standing to the right, her jar on the rim, the bucket
 *  at her feet. set({ T, jF, jB, jH, jLean, wx, wF, wB, wH, wLean, wo, jarAt }) */
export function wellCast(S, W, { bucket = true, jar = true } = {}) {
  const c = S.c, L = W.actL;
  const jEl = L.add(withFace3(person(c, { ...CAST.jesus, pose: 'sit' }), faceBits3(c)));
  const j = S.puppet(jEl);
  const w = womanRig(S, L, { jar });
  const bk = bucket ? L.add(`<g>${bucketRope(c)}</g>`) : null;
  const RIM = { x: G.well + 44, y: G.floor - 48 };
  const JS = 1.05, JY = G.floor - 28;
  return {
    j, jEl, w, bk, RIM, JS, JY,
    head: () => headAt3(G.jx, JY, JS, false, 'sit'),
    wHead: (wx = G.wx) => headAt3(wx, G.floor, JS, true),
    set({ T = 0, jo = 1, jF = 22, jB = 12, jH = 0, jLean = 0, wx = G.wx, wF = 24, wB = 16, wH = 0, wLean = 0, wo = 1, wWalk, wFlip = true, jarAt } = {}) {
      j.set({ x: G.jx, y: JY, s: JS, o: jo, armF: jF, armB: jB, head: jH, lean: jLean, blink: blinkAt(T) });
      w.p.set({ x: wx, y: G.floor, s: JS, flip: wFlip, o: wo, armF: wF, armB: wB, head: wH, lean: wLean, walk: wWalk, blink: blinkAt(T, 3) });
      if (w.jar) pose(w.jar, jarAt || { x: RIM.x, y: RIM.y, s: 0.78, o: 1 });
      if (bk) pose(bk, { x: G.well + 96, y: G.floor + 2, s: 1.1, r: 0, o: 1 });
    },
  };
}

/* ====================================================================== the old days (sepia) */
const SEPIA_TO = mix(C.parchment, C.dune, 0.5);
/** fade a person's colours toward sepia */
export function sepia(o, k = 0.5) {
  const out = { ...o };
  ['robe', 'mantle', 'skin', 'hair', 'veil', 'veil2', 'belt', 'beardColor'].forEach((f) => { if (out[f]) out[f] = mix(out[f], SEPIA_TO, k); });
  return out;
}
export const JACOB = { robe: mix(C.dune, C.wood3, 0.3), mantle: C.clay, hair: '#e8e1d4', hairStyle: 'wrap', veil: C.linen2, beard: 'wild', beardColor: '#eee7da', skin: C.skin3, belt: C.leather };
/** a paper cow, head down or up via .head (pivot at the neck); origin between its feet */
export function cow(c, { col = C.wood3, k } = {}) {
  const s = sheet();
  let legs = '';
  [-34, -22, 20, 32].forEach((x) => { legs += c.cut([[x - 4, -30], [x + 4, -30], [x + 3.5, 0], [x - 3.5, 0]], 0.3, 4); });
  s.p(legs, shade(col, -0.15));
  s.p(c.cut([[-44, -62], [30, -66], [44, -56], [42, -30], [30, -24], [-36, -24], [-46, -34]], 0.6, 6), col);
  s.p(c.cut(c.blob(-10, -44, 14, 10, 9, 0.3), 0.4, 4) + c.cut(c.blob(18, -54, 9, 6, 8, 0.3), 0.3, 3), shade(col, 0.35));
  s.p(c.ribbon([[-44, -58], [-52, -44], [-50, -30]], 3), shade(col, -0.2));
  const h = sheet();
  h.p(c.cut([[0, -8], [22, -4], [34, 10], [30, 20], [18, 18], [4, 8]], 0.4, 4), col);
  h.p(c.cut([[6, -8], [2, -20], [10, -10]], 0.2, 3) + c.cut([[14, -6], [18, -18], [20, -4]], 0.2, 3), C.cream);
  h.x(c.poly(c.circ(20, 2, 1.8, 6)), C.ink);
  return `<g${k ? ` data-k="${k}"` : ''}>${s.out()}<g class="head" transform="translate(36 -56)"><g class="headr">${h.out()}</g></g></g>`;
}
/** a stone trough (origin foot centre) */
export function trough(c, w = 110, col = C.stone2) {
  return sheet().p(c.cut([[-w / 2, -24], [w / 2, -24], [w / 2 - 6, 0], [-w / 2 + 6, 0]], 0.5, 6), col).x(c.cut(c.rect(-w / 2 + 6, -24, w - 12, 5), 0.2, 5), C.lake2).out();
}
/** an empty place: a dashed outline of a standing man (origin at his feet) */
export function ghost(c, col = C.inkSoft) {
  const head = c.circ(2, -167, 19, 20);
  const body = [[-16, -146], [16, -146], [28, -134], [34, -70], [42, -6], [-42, -6], [-34, -70], [-28, -134]];
  const d = c.poly(head) + c.poly(body);
  return `<path d="${d}" fill="${mix(C.cream, C.parchment, 0.5)}" opacity=".25"/><path d="${d}" fill="none" stroke="${col}" stroke-width="2.6" stroke-dasharray="7 7" stroke-linecap="round" opacity=".75"/>`;
}

/* ====================================================================== Galilee */
export const GAL = ['#cfe0da', '#eee8d0', '#f6ead2'];
/**
 * galileeSet(S, o) — green Galilean hills, the lake on the right, a road across the near ground.
 * o: skyCols, cana (x of Cana on the mid hills, or null), lakeX, behind(S)
 */
export function galileeSet(S, o = {}) {
  const c = S.c;
  // phone: the sun hangs inside the frame, high in the tall sky, clear of the hanging pictures
  const { skyCols = GAL, sunAt = S.portrait ? [1040, -60] : [1180, 170], cana = null, act = 0.55, groundY = 640, lakeX = 1150 } = o;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = [[470, 150, 180], [980, 230, 130]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 600 }), x, y, i }));
  const farL = S.layer({ par: 0.1, sh: 2 });
  farL.add(band(c, { y: 450, amps: [20, 9, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.sage3, 0.3) }).markup);
  const midL = S.layer({ par: 0.22, sh: 3 });
  const h2 = hillsWith(c, { y: 548, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.hillNear, 0.5), trees: 36, treeColor: C.moss, treeH: 24, houses: 4, houseColor: C.plaster, x0: -900, x1: 2500 });
  midL.add(h2.markup);
  const lakeL = S.layer({ par: 0.23, sh: 2 });
  lakeL.add(sheet().p(c.cut([[lakeX - 300, 520], [lakeX - 120, 500], [lakeX + 300, 496], [lakeX + 900, 500], [lakeX + 900, 560], [lakeX - 340, 556]], 1, 10), C.lake).x(c.ribbon([[lakeX - 100, 520], [lakeX + 40, 518]], 2) + c.ribbon([[lakeX + 120, 530], [lakeX + 260, 528]], 2), C.foam, 'opacity=".7"').out());
  if (cana !== null) midL.add(`<g transform="translate(${cana} ${h2.fn(cana) + 6})">${sychar(c, 0.55)}</g>`);
  const groundL = S.layer({ par: 0.42, sh: 3 });
  const gfn = c.wave(groundY, [5, 2], [600, 150]);
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.sand, 0.35));
  gs.p(c.ribbon([[-900, 760], [200, 740], [600, 720], [1000, 716], [1400, 726], [2500, 760]], 110), mix(C.sand2, C.dune, 0.25));
  groundL.add(gs.out());
  groundL.add(grass(c, { x0: -600, x1: 2200, y: groundY, fn: gfn, n: 40, h: 14, color: C.olive }) + flowers(c, { x0: -600, x1: 2200, y: groundY, fn: gfn, n: 24, h: 18 }));
  groundL.add(olive(c, 220, gfn(220) + 8, 0.9) + olive(c, 1480, gfn(1480) + 8, 0.8) + cypress(c, 330, gfn(330) + 6, 120));
  const behind = o.behind ? o.behind(S) : null;
  const actL = S.layer({ par: act, sh: 5 });
  const fgL = S.layer({ par: 0.95, sh: 6 });
  const fgf = c.wave(970, [8, 4], [500, 150]);
  fgL.add(sheet().p(c.ridge(fgf, -1400, 3000, 1800, 14, 1.4), C.moss2).out());
  fgL.add(grass(c, { x0: -1400, x1: 3000, y: 970, fn: fgf, n: 60, h: 30, color: C.moss2 }));
  return {
    sk, hangL, farL, lakeL, midL, groundL, actL, fgL, behind, sunEl, sunAt, gfn, h2,
    update(t, time, { sunX = sunAt[0], sunY = sunAt[1] } = {}) {
      swing(sunEl, sunX, sunY, time, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 24, cl.y, time, 1.4, 0.7, cl.i));
    },
  };
}

/* ---------- the official's house in Capernaum (the inside of a hanging picture; origin top centre) ---------- */
export const HOUSE_P = { w: 400, h: 290, floor: 250, bedX: 20, lampX: -130 };
export function homeInside(c) {
  const { w, h, floor } = HOUSE_P;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0, 40), mix(C.plaster, C.blushVeil, 0.25));
  // a window onto the lake
  s.p(c.cut([[100, 150], [100, 70], ...c.arc(140, 70, 40, 36, PI, 2 * PI, 10), [180, 150]], 0.4, 5), C.lake);
  s.p(c.cut([[100, 150], [100, 120], [180, 116], [180, 150]], 0.3, 5), mix(C.hillMid, C.lake, 0.3));
  s.p(c.ribbon([[96, 152], [184, 152]], 6) + c.ribbon([[140, 34], [140, 150]], 3), C.wood2);
  // a rich hanging
  s.p(c.cut([[-60, 30], [60, 30], [56, 120], [-56, 120]], 0.6, 6), C.indigo);
  let st = '';
  for (let x = -46; x < 50; x += 22) st += c.cut(c.star(x, 60 + (x % 44 ? 20 : 0), 5, 2.4, 4, 0), 0.2, 3);
  s.x(st, C.sun, 'opacity=".8"');
  s.p(c.cut(c.rect(-w / 2, floor, w, h - floor), 0.5, 8), mix(C.clay, C.sand2, 0.5));
  // the lamp stand
  s.p(c.cut([[HOUSE_P.lampX - 16, floor], [HOUSE_P.lampX - 4, floor - 80], [HOUSE_P.lampX + 4, floor - 80], [HOUSE_P.lampX + 16, floor]], 0.3, 4), C.wood2);
  return s.out();
}
/** a dashed empty star (a sign not given) */
export function emptyStar(c, r = 22) {
  return `<path d="${c.poly(c.star(0, 0, r, r * 0.45, 5, -PI / 2))}" fill="none" stroke="${C.ochre}" stroke-width="2.4" stroke-dasharray="5 5" stroke-linejoin="round"/>`;
}
