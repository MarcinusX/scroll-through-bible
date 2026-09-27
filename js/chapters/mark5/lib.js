// Mark 5 — local cut-outs shared by this chapter's scenes: the man from the tombs, Jairus and his
// family, the woman in the crowd, pigs, little shadow-spirits, chains, tombs, paper words and a map.
// Everything returns SVG markup cut with the seeded scissors + sheet(); origins are noted per piece.

import { C, sheet, shade, mix, person, sky, hanging, swing } from '../kit.js';
import { band, waterBand, sun, cloud, cypress, grass, rock, reeds, house, palm, olive, hillsWith, town } from '../../assets/nature.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, coin, coinStack, bowl, loaf, cup, physicianKit, dust, candle, townsfolk } from '../mark2/lib.js';

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- the people of this chapter ---------- */
const RAGS = mix(C.rock3, C.soil, 0.25);
export const LOOK = {
  // the man from the tombs: torn grey-brown rags, wild hair and beard
  wild: { robe: RAGS, fur: true, hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin3, belt: null },
  // the same man, clothed and in his right mind
  healed: { robe: C.linen, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather },
  jairus: { robe: C.stone, mantle: shade(C.dustyBlue, -0.22), hairStyle: 'wrap', veil: C.linen, hair: C.hair3, beard: 'full', skin: C.skin2, belt: C.ochre },
  mother: { robe: C.roseRobe, hairStyle: 'veil', veil: C.skyVeil, hair: C.hair2, skin: C.skin2 },
  girl: { robe: C.linen, mantle: null, hairStyle: 'long', hair: C.hair2, beard: 'none', skin: C.skin },
  // the woman who touched His cloak: grey and pale while ill, warm colours when healed
  ill: { robe: mix(C.stone2, C.plumRobe, 0.28), hairStyle: 'veil', veil: mix(C.stone, C.stone2, 0.6), veil2: shade(C.stone2, -0.12), hair: C.hair2, skin: mix(C.skin2, C.stone, 0.35) },
  well: { robe: mix(C.dusk, C.jesusMantle, 0.3), hairStyle: 'veil', veil: C.halo, veil2: C.haloRim, hair: C.hair2, skin: C.skin2 },
  herdsman: { robe: C.dune, fur: true, hair: C.hair, hairStyle: 'wrap', veil: C.sand2, beard: 'full', skin: C.skin4, belt: C.leather },
  herdsman2: { robe: mix(C.sand2, C.olive, 0.3), fur: true, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.rope },
  doctor: { robe: C.parchment, mantle: C.teal2, hairStyle: 'wrap', veil: C.stone, hair: C.greyHair, beard: 'full', skin: C.skin2 },
  messenger: { robe: C.stone2, mantle: null, hairStyle: 'wrap', veil: C.linen2, hair: C.hair3, beard: 'short', skin: C.skin3, belt: C.leather },
  mourner: { robe: mix(C.storm, C.stone2, 0.55), hairStyle: 'veil', veil: mix(C.storm2, C.stone2, 0.45), hair: C.hair3, skin: C.skin3 },
};

/* ---------- small bits of the body ---------- */
/** put extra pieces on a puppet's body, drawn over the robe but under the head & front arm */
export function onBody(markup, extra) { return markup.replace('<g class="head"', `${extra}<g class="head"`); }
/** extra pieces on the face (head coords: face r≈18 at 0,0 looking +x) */
export function onFace(markup, extra) { return markup.replace('</g></g><g class="armF"', `${extra}</g></g><g class="armF"`); }

/** dark scratch marks on the arms & robe (body coords, standing); wrap in a group you can fade */
export function scratches(c, dy = 0) {
  let d = '';
  const at = [[-20, -118], [-24, -96], [-16, -70], [18, -104], [22, -80], [14, -52], [-10, -40], [24, -30]];
  at.forEach(([x, y]) => {
    const l = c.rr(6, 11), a = c.rr(-0.9, -0.4);
    d += c.ribbon([[x, y + dy], [x + Math.cos(a) * l, y + dy + Math.sin(a) * l]], 1.6);
  });
  return `<path d="${d}" fill="${C.soilDark}" opacity=".8"/>`;
}
/** marks on the front arm — pass as holdF (hand coords: shoulder at (-1.5, -57)); class "marks" so it can be faded */
export function armMarks(c, extra = '') {
  let d = '';
  for (let i = 0; i < 3; i++) { const y = -44 + i * 11; d += c.ribbon([[-6, y], [3, y - 5]], 1.5); }
  return `<g class="marks" opacity="0"><path d="${d}" fill="${C.soilDark}" opacity=".85"/></g>${extra}`;
}
/** a brow line of worry / fear (head coords) */
export function worry(c) {
  return `<path d="${c.ribbon([[1, -9], [8, -11], [14, -9]], 1.4)}" fill="${C.inkSoft}" opacity=".7"/>`;
}
/** a little open mouth (crying out / laughing) on the face */
export function mouthO(c, r = 3) {
  return `<path d="${c.cut(c.ell(10, 9, r * 0.9, r, 10), 0.2, 2)}" fill="${C.soilDark}"/>`;
}

/* ---------- creatures ---------- */
const PIGS = [mix(C.blush, C.peach, 0.45), mix(C.blush, C.peach, 0.65), mix(C.roseRobe, C.skin2, 0.5), mix(C.clay, C.soil, 0.35), mix(C.rock3, C.soil, 0.2)];
/** a small paper pig, facing right; origin between its feet. about 40 wide, 24 tall */
export function pig(c, { col, down = false } = {}) {
  col = col || c.pick(PIGS);
  const s = sheet();
  const dk = shade(col, -0.16);
  // legs
  let legs = '';
  [[-12, 0], [-6, 1], [8, 0], [13, 1]].forEach(([x, o]) => { legs += c.cut(c.rect(x - 2.2, -8, 4.4, 8 + o * 0), 0.2, 3); });
  s.p(legs, dk);
  // body
  s.p(c.cut(c.blob(-1, -13, 18, 9, 14, 0.06), 0.4, 4), col);
  // head (lowered to graze, or raised)
  const hx = 16, hy = down ? -8 : -16;
  s.p(c.cut(c.circ(hx, hy, 7.5, 12), 0.3, 3), col);
  s.p(c.cut([[hx + 5, hy - 2.5], [hx + 11, hy - 2], [hx + 11.5, hy + 3], [hx + 5, hy + 3.5]], 0.2, 2), shade(col, -0.08));
  s.p(c.poly([[hx - 3, hy - 5], [hx + 1, hy - 12], [hx + 3, hy - 5]]), dk);
  s.x(c.poly(c.circ(hx + 2.5, hy - 1.5, 1.1, 6)), C.ink);
  s.x(c.ribbon(c.arc(-21, -15, 3.2, 3.2, 0, PI * 1.6, 7), 1.2), dk);
  return s.out();
}
/** a knot of n pigs spread over w×h (origin at its centre-bottom); returns markup */
export function herd(c, n = 12, w = 150, h = 40, { sc = 0.7, face = 0 } = {}) {
  const all = [];
  for (let i = 0; i < n; i++) all.push({ x: c.rr(-w / 2, w / 2), y: c.rr(-h, 0), f: face ? (face < 0 ? !c.chance(0.12) : c.chance(0.12)) : c.chance(0.3), down: c.chance(0.55) });
  all.sort((a, b) => a.y - b.y);
  return all.map((p) => {
    const s = sc * (0.8 + ((p.y + h) / (h || 1)) * 0.25);
    return `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${(p.f ? -s : s).toFixed(3)} ${s.toFixed(3)})">${pig(c, { down: p.down })}</g>`;
  }).join('');
}

const SPIRIT = ['#3d3346', '#463a4f', '#352d3d', '#4d4056'];
/** a little shadow-spirit: a dark curl of paper with two pale eyes; origin at its middle */
export function spirit(c, sc = 1, col) {
  col = col || c.pick(SPIRIT);
  const s = sheet();
  const tail = c.cbez([0, 2], [-8 * sc, 12 * sc], [8 * sc, 18 * sc], [c.rr(-8, 8) * sc, 30 * sc], 10);
  s.p(c.ribbon(tail, (t) => (1 - t) * 11 * sc + 1), col);
  s.p(c.cut(c.blob(0, -2 * sc, 10 * sc, 11 * sc, 11, 0.2), 0.6, 3), col);
  s.p(c.poly([[-8 * sc, -8 * sc], [-6 * sc, -17 * sc], [-2 * sc, -10 * sc]]) + c.poly([[8 * sc, -8 * sc], [6 * sc, -17 * sc], [2 * sc, -10 * sc]]), col);
  s.x(c.poly(c.ell(-3.4 * sc, -3 * sc, 2 * sc, 2.6 * sc, 8)) + c.poly(c.ell(3.4 * sc, -3 * sc, 2 * sc, 2.6 * sc, 8)), '#efe6c8');
  return s.out();
}
/** a big dark shadow that clings behind the possessed man (origin: its bottom centre) */
export function shadowCloak(c, w = 150, h = 250) {
  const pts = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const a = PI + (i / n) * PI;
    const r = 1 + Math.sin(i * 1.9) * 0.07 + c.rr(-0.03, 0.03);
    pts.push([Math.cos(a) * w / 2 * r, -h * 0.55 + Math.sin(a) * h * 0.45 * r]);
  }
  pts.push([w / 2, -h * 0.5], [w * 0.42, -h * 0.2], [w * 0.5, 0], [w * 0.2, -h * 0.08], [0, 0], [-w * 0.24, -h * 0.1], [-w * 0.5, 0], [-w * 0.42, -h * 0.24], [-w / 2, -h * 0.5]);
  const s = sheet();
  s.p(c.cut(pts, 1.6, 7), '#3b3243', 'opacity=".62"');
  s.x(c.poly(c.ell(-14, -h * 0.78, 5, 7, 8)) + c.poly(c.ell(14, -h * 0.78, 5, 7, 8)), '#e9dcb4', 'opacity=".7"');
  return s.out();
}

/* ---------- the tombs & the hills of the Gerasenes ---------- */
/** a rock-cut tomb: a dark doorway in a stone face with a rolling stone beside it; origin bottom centre */
export function tomb(c, w = 70, h = 84, { stone = true, face = C.rock2 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w * 0.85, 4], [-w * 0.8, -h * 0.9], [-w * 0.45, -h * 1.22], [w * 0.4, -h * 1.25], [w * 0.85, -h * 0.9], [w * 0.95, 4]], 1.4, 8), face);
  s.p(c.cut([[-w / 2, 2], [-w / 2, -h * 0.62], ...c.arc(0, -h * 0.62, w / 2, h * 0.38, PI, 2 * PI, 10), [w / 2, 2]], 0.8, 6), mix(C.soilDark, C.storm2, 0.35));
  s.x(c.ribbon([[-w / 2 - 4, -h * 0.62], ...c.arc(0, -h * 0.62, w / 2 + 4, h * 0.38 + 4, PI, 2 * PI, 10), [w / 2 + 4, -h * 0.62]], 3), shade(face, 0.2), 'opacity=".7"');
  if (stone) {
    s.p(c.cut(c.circ(w * 0.78, -h * 0.4, h * 0.42, 22), 0.8, 5), shade(face, 0.12));
    s.x(c.ribbon(c.arc(w * 0.78, -h * 0.4, h * 0.3, h * 0.3, PI * 1.1, PI * 1.6, 6), 2), shade(face, -0.2), 'opacity=".6"');
  }
  return s.out();
}
/** a rocky slope rising to the right: returns { fn, markup } of a filled band from x0..x1 */
export function slope(c, { x0 = -900, x1 = 2500, y0, y1, xa, xb, color, bottom = 1700, j = 2 }) {
  // flat at y0 until xa, rises smoothly to y1 at xb, then rolling
  const fn = (x) => {
    const u = Math.min(1, Math.max(0, (x - xa) / (xb - xa)));
    const e = u * u * (3 - 2 * u);
    return y0 + (y1 - y0) * e + Math.sin(x / 90) * 6 * e + Math.sin(x / 37) * 2;
  };
  const pts = [];
  for (let x = x0; x <= x1; x += 14) pts.push([x, fn(x) + c.rr(-j, j)]);
  pts.push([x1, bottom], [x0, bottom]);
  return { fn, markup: sheet().p(c.poly(pts), color).out() };
}
/** scattered rocks & boulders along fn between x0..x1 (one sheet) */
export function boulders(c, fn, x0, x1, n = 10, { col = C.rock2, sz = 1 } = {}) {
  const s = sheet();
  let d = '', d2 = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), y = fn(x) + c.rr(4, 14), w = c.rr(20, 56) * sz, h = w * c.rr(0.45, 0.7);
    const pts = c.blob(x, y - h * 0.45, w / 2, h / 2, 9, 0.2).map(([px, py]) => [px, Math.min(py, y)]);
    if (i % 3) d += c.cut(pts, 1, 6); else d2 += c.cut(pts, 1, 6);
  }
  s.p(d, col).p(d2, shade(col, 0.12));
  return s.out();
}

/* ---------- chains & fetters ---------- */
/** one oval chain link, centred on its origin, long axis along x */
export function link(c, r = 9, col = C.rock3) {
  return sheet().p(c.cut(c.ell(0, 0, r, r * 0.6, 14), 0.2, 3) + c.hole(c.ell(0, 0, r * 0.62, r * 0.26, 10), 0.1, 3), col).out();
}
/** a chain of n links from (0,0) along +x; alternate links are seen edge-on */
export function chain(c, n = 8, r = 8, col = C.rock3) {
  const s = sheet();
  let d = '', e = '';
  for (let i = 0; i < n; i++) {
    const x = i * r * 1.45;
    if (i % 2) e += c.cut(c.rect(x - r, -r * 0.2, r * 2, r * 0.4), 0.2, 3);
    else d += c.cut(c.ell(x, 0, r, r * 0.6, 12), 0.2, 3) + c.hole(c.ell(x, 0, r * 0.6, r * 0.24, 8), 0.1, 3);
  }
  s.p(d, col).p(e, shade(col, -0.15));
  return s.out();
}
/** a fetter: an iron cuff; origin centre */
export function fetter(c, r = 12, col = C.rock3) {
  return sheet().p(c.cut(c.ell(0, 0, r, r * 0.55, 14), 0.2, 3) + c.hole(c.ell(0, -1, r * 0.72, r * 0.32, 12), 0.1, 3), shade(col, -0.1)).out();
}
/** a sharp stone held in the hand (origin: the grip) */
export function sharpStone(c) {
  return sheet().p(c.cut([[-7, -3], [2, -9], [9, -4], [6, 5], [-4, 6]], 0.3, 3), C.rock).out();
}

/* ---------- paper words ---------- */
/** a speech bubble with one or two lines of words; origin at the tail tip. jag: a spiky cry. dir: tail side (-1 left / 1 right) */
export function bubble(c, lines, { size = 20, fill = C.cream, ink = C.ink, dir = -1, w, jag = false, tailLen = 22 } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.46 + size * 1.7;
  const hh = lines.length * size * 1.18 + size * 0.95;
  const cx = -dir * (ww / 2 - 18), cy = -hh / 2 - tailLen;
  const s = sheet();
  let pts;
  if (jag) {
    pts = [];
    const n = Math.round((ww + hh) / 16) * 2;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * PI * 2, k = i % 2 ? 1.0 : 1.2;
      pts.push([cx + Math.cos(a) * (ww / 2) * k, cy + Math.sin(a) * (hh / 2) * k]);
    }
  } else pts = c.blob(cx, cy, ww / 2, hh / 2, 20, 0.04);
  s.p(c.cut(pts, jag ? 0.8 : 0.5, 6), fill);
  s.p(c.cut([[cx - dir * (ww * 0.18) - 8, cy + hh * 0.3], [0, 0], [cx - dir * (ww * 0.18) + 10, cy + hh * 0.38]], 0.4, 4), fill);
  const t0 = cy - ((lines.length - 1) * size * 1.18) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="${cx.toFixed(1)}" y="${(t0 + i * size * 1.18).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** a dark jagged cry bubble for the unclean spirits */
export const cry = (c, lines, o = {}) => bubble(c, lines, { jag: true, fill: '#43384d', ink: C.cream, ...o });

/** a hanging tag with words (one or more lines); origin at its hole (hang it with hanging()) */
export function tag(c, lines, { size = 22, w, fill = C.cream, face = C.parchment, ink = C.ink, italic = true, weight = 400 } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(80, Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.8);
  const h = size * (0.9 + lines.length * 1.2);
  const s = sheet();
  s.p(c.cut([[-ww / 2 + 12, 0], [ww / 2 - 12, 0], [ww / 2, 12], [ww / 2, h], [-ww / 2, h], [-ww / 2, 12]], 0.5, 6), fill);
  s.p(c.cut([[-ww / 2 + 6, 14], [ww / 2 - 6, 14], [ww / 2 - 6, h - 6], [-ww / 2 + 6, h - 6]], 0.3, 6), face);
  s.x(c.poly(c.circ(0, 7, 3.4, 10)), C.wood2);
  const y0 = 14 + (h - 20 - lines.length * size * 1.2) / 2 + size * 0.95;
  const txt = lines.map((l, i) => `<text x="0" y="${(y0 + i * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}"${italic ? ' font-style="italic"' : ''} font-weight="${weight}" fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** a picture card (cream frame, parchment face) holding an icon; origin top centre */
export function card(c, icon, { w = 96, h = 96, face = C.parchment, word, ink = C.ink } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), C.cream);
  s.p(c.cut(c.rect(-w / 2 + 6, 6, w - 12, h - 12), 0.4, 8), face);
  return `${s.out()}<g transform="translate(0 ${word ? h * 0.44 : h * 0.54})">${icon}</g>${word ? `<text x="0" y="${h - 14}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${ink}">${word}</text>` : ''}`;
}
/** a hand-cut glyph on a tiny tag: "!" "?" "♪" */
export function glyphTag(c, ch, { size = 24, ink = C.terracotta, fill = C.cream } = {}) {
  const s = sheet().p(c.cut(c.blob(0, 0, size * 0.62, size * 0.7, 10, 0.08), 0.4, 4), fill);
  return `${s.out()}<text x="0" y="${(size * 0.33).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="600" fill="${ink}">${ch}</text>`;
}
/** a music note cut from paper; origin centre */
export function note(c, col = C.ink) {
  return sheet().x(c.cut(c.ell(-4, 6, 5.4, 4, 10, -0.4), 0.2, 2) + c.cut([[0, 5], [0, -14], [3, -14], [3, 5]], 0.1, 3) + c.cut([[0, -14], [9, -9], [9, -5], [3, -9]], 0.2, 3), col).out();
}

/* ---------- things ---------- */
/** a leather purse on a cord; fill 0..1 (how plump); origin at the cord's top */
export function purse(c, fill = 1) {
  const s = sheet();
  const w = 14 + fill * 8, h = 18 + fill * 6;
  s.p(c.cut([[-5, 6], [5, 6], [w, 14 + h * 0.5], [w * 0.8, 14 + h], [-w * 0.8, 14 + h], [-w, 14 + h * 0.5]], 0.5, 4), C.leather);
  s.p(c.ribbon([[-6, 8], [6, 8]], 3), shade(C.leather, -0.3));
  s.x(c.ribbon([[0, 0], [0, 7]], 1.4), C.rope);
  return s.out();
}
/** a physician's jar; origin bottom centre */
export function jar(c, col = C.skyVeil, h = 30) {
  const s = sheet();
  s.p(c.cut([[-9, 0], [-12, -h * 0.55], [-7, -h * 0.85], [-7, -h], [7, -h], [7, -h * 0.85], [12, -h * 0.55], [9, 0]], 0.3, 4), col);
  s.p(c.cut(c.rect(-8, -h - 5, 16, 6), 0.2, 3), C.wood2);
  s.x(c.ribbon([[-11, -h * 0.5], [11, -h * 0.5]], 2.4), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
/** a shepherd's staff; origin at the hand grip, the staff runs down to the ground and up to a crook */
export function staff(c, len = 190) {
  return sheet().p(c.ribbon([[0, 70], [0, -len + 70], ...c.arc(10, -len + 70, 10, 10, PI, 2 * PI, 6)], 4), C.wood2).out();
}
/** double flute (aulos), held at the front hand, pointing forward-down; origin at the hand */
export function flute(c) {
  return sheet().p(c.ribbon([[-6, 0], [30, 18]], 3.2) + c.ribbon([[-6, 2], [28, 26]], 3), C.wood3).out();
}
/** a person lying on their back, head on the pillow of bedFrame (origin: middle of the mattress top) */
export function lyingPerson(c, o, s = 0.66, eyes = 'closed') {
  return `<g transform="translate(${(88 - 167 * s).toFixed(1)} ${(-40 * s).toFixed(1)}) scale(-1 1) rotate(-90) scale(${s})">${person(c, { ...o, eyes })}</g>`;
}
/** a low bed with a blanket (origin: floor centre) */
export function bedFrame(c, w = 230) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -40], [w / 2, -40], [w / 2, -30], [-w / 2, -30]], 0.4, 8), C.wood);
  s.p(c.cut([[-w / 2 + 6, -30], [-w / 2 + 16, -30], [-w / 2 + 14, 0], [-w / 2 + 8, 0]], 0.3, 6) + c.cut([[w / 2 - 16, -30], [w / 2 - 6, -30], [w / 2 - 8, 0], [w / 2 - 14, 0]], 0.3, 6), C.wood2);
  s.p(c.cut([[-w / 2 - 4, -54], [w / 2 + 2, -54], [w / 2 - 4, -40], [-w / 2, -40]], 0.6, 8), C.linen2);
  s.p(c.cut(c.blob(w / 2 - 30, -58, 26, 10, 10, 0.1), 0.4, 5), C.skyVeil);
  return s.out();
}
/** a blanket laid over the lower body of the lying girl (origin as bedFrame) */
export function blanket(c, w = 230) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 2, -52], [-w / 2 + 12, -80], [-w / 2 + 130, -84], [-w / 2 + 140, -60], [-w / 2 + 136, -44], [-w / 2 - 2, -40]], 0.8, 7), C.blushVeil);
  let d = '';
  for (let i = 0; i < 5; i++) d += c.cut(c.star(-w / 2 + 20 + i * 24, -62 + (i % 2) * 6, 4.5, 2, 4, 0), 0.1, 2);
  s.x(d, C.cream);
  return s.out();
}
/** a lamp niche / small lamp with glow: see things.oilLamp */

/* ---------- the Decapolis ---------- */
export const DECAPOLIS = [
  // [name, x, y] on a 600×420 map; Galilee lake at the left
  ['Damaszek', 'Damascus', 470, 42],
  ['Kanata', 'Canatha', 520, 152],
  ['Rafana', 'Raphana', 400, 118],
  ['Dion', 'Dion', 300, 150],
  ['Hippos', 'Hippos', 150, 128],
  ['Gadara', 'Gadara', 176, 212],
  ['Pella', 'Pella', 186, 300],
  ['Scytopolis', 'Scythopolis', 88, 316],
  ['Geraza', 'Gerasa', 300, 322],
  ['Filadelfia', 'Philadelphia', 360, 388],
];
/** the parchment map itself (no towns); origin at its top-left corner; 600×420 */
export function mapSheet(c, lakeLabel) {
  const s = sheet();
  s.p(c.cut([[0, 0], [600, -4], [606, 420], [-4, 424]], 1.4, 10), C.cream);
  s.p(c.cut([[12, 12], [590, 9], [594, 410], [9, 412]], 0.8, 10), C.parchment);
  // the lake of Galilee and the Jordan running south
  s.p(c.cut(c.blob(96, 150, 30, 52, 16, 0.1), 0.6, 5), C.lake);
  s.p(c.ribbon([[100, 200], [96, 250], [104, 300], [92, 360], [98, 410]], 7, 1.2), C.lake2);
  s.p(c.ribbon([[70, 20], [88, 60], [94, 98]], 5, 1), C.lake2);
  // hills
  let hills = '';
  for (let i = 0; i < 16; i++) { const x = c.rr(200, 570), y = c.rr(60, 390); hills += c.poly([[x - 16, y], [x - 2, y - 14], [x + 4, y - 10], [x + 16, y]]); }
  s.x(hills, shade(C.parchment, -0.14), 'opacity=".8"');
  // compass rose
  s.x(c.poly(c.star(550, 360, 22, 6, 4, -PI / 2)), shade(C.ochre, -0.1), 'opacity=".8"');
  return `${s.out()}<text x="56" y="${148}" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.teal}" transform="rotate(-80 56 148)">${lakeLabel}</text>`;
}
/** one Decapolis town: a cluster of little houses on the map; origin at its centre */
export function mapTown(c, sc = 1) {
  const s = sheet();
  let d = '', r = '';
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 9 * sc + c.rr(-2, 2), h = c.rr(8, 13) * sc, w = c.rr(8, 11) * sc;
    d += c.cut(c.rect(x - w / 2, -h, w, h), 0.2, 3);
    r += c.cut(c.rect(x - w / 2 - 1, -h - 2, w + 2, 3), 0.1, 3);
  }
  s.p(d, C.plaster).p(r, C.roof);
  return s.out();
}

/* ---------- the shore of the Gerasenes (shared set) ---------- */
/**
 * Sky, sun & clouds on strings, far hills, the lake, the hillside of tombs on the right and the beach.
 * Returns { sk, bfn (beach top), hfn (hillside top), update(t, time), tombAt }.
 */
export function shoreSet(S, { skyCols, sunAt = [1230, 150], sunR = 44, hillShift = 0, clouds = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl = clouds ? [[470, 150, 210], [960, 215, 140]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 620 }), x, y, i })) : [];
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
  const lake = S.layer({ par: 0.2, sh: 2 });
  lake.add(waterBand(c, { y: 470, color: C.lake, foamN: 26 }).markup);
  const hill = S.layer({ par: 0.3, sh: 4 });
  const H = slope(c, { y0: 560, y1: 230, xa: 980 + hillShift, xb: 1750 + hillShift, color: mix(C.rock, C.hillMid, 0.45) });
  hill.add(H.markup);
  const H2 = slope(c, { y0: 600, y1: 340, xa: 1060 + hillShift, xb: 1950 + hillShift, color: mix(C.rock2, C.hillNear, 0.4), j: 3 });
  hill.add(H2.markup);
  hill.add(cypress(c, 1500 + hillShift, H.fn(1500 + hillShift) + 6, 120) + cypress(c, 1560 + hillShift, H.fn(1560 + hillShift) + 6, 90) + cypress(c, 1700 + hillShift, H2.fn(1700 + hillShift) + 4, 130));
  const tombAt = [];
  [[1160, 0.7], [1330, 0.8], [1520, 0.72], [1080, 0.55]].forEach(([x, s]) => {
    x += hillShift;
    const y = H2.fn(x) + 4;
    tombAt.push([x, y]);
    hill.add(`<g transform="translate(${x} ${y}) scale(${s})">${tomb(c, 70, 84, { face: mix(C.rock2, C.rock3, 0.3) })}</g>`);
  });
  hill.add(boulders(c, H2.fn, 1000 + hillShift, 1900 + hillShift, 12, { col: C.rock2 }));
  hill.add(grass(c, { x0: 1000 + hillShift, x1: 2200, y: 600, fn: H2.fn, n: 20, h: 12, color: C.olive }));
  const beach = S.layer({ par: 0.45, sh: 3 });
  const bfn = (x) => 628 + Math.max(0, x - 1050 - hillShift) * 0.12 + Math.max(0, 470 - x) * 0.9 + Math.sin(x / 140) * 4;
  beach.add(waterBand(c, { y: 650, x1: 900, color: C.lake2, foamN: 14, amp: 2 }).markup);
  const bpts = [];
  for (let x = 60; x <= 2500; x += 14) bpts.push([x, Math.min(bfn(x), 1700) + c.rr(-1.2, 1.2)]);
  bpts.push([2500, 1700], [60, 1700]);
  beach.add(sheet().p(c.poly(bpts), C.sand).out());
  beach.add(grass(c, { x0: 900, x1: 2000, y: 640, fn: bfn, n: 16, h: 13, color: C.olive }) + rock(c, 1180, 700, 80, 34, C.rock2) + reeds(c, 330, 700, 9, 90));
  return {
    sk, bfn, hfn: H2.fn, tombAt, hangL, sunEl,
    update(t, T, { sunY = sunAt[1] } = {}) {
      swing(sunEl, sunAt[0], sunY, T, 1.1, 0.7);
      cl.forEach((k) => swing(k.el, k.x + Math.sin(T * 0.1 + k.i * 2) * 26, k.y, T, 1.4, 0.6 + k.i * 0.2, k.i));
    },
  };
}

/* ---------- Capernaum ---------- */
/** a small synagogue: stone walls, a row of columns and a low gable; origin bottom-left; w×h */
export function synagogue(c, x, y, w = 150, h = 90) {
  const s = sheet();
  s.p(c.cut(c.rect(x, y - h, w, h + 3), 0.5, 8), C.stone);
  s.p(c.cut([[x - 10, y - h], [x + w / 2, y - h - 34], [x + w + 10, y - h], [x + w + 10, y - h + 8], [x - 10, y - h + 8]], 0.5, 7), C.stone2);
  let col = '';
  const n = 5;
  for (let i = 0; i < n; i++) { const cx = x + 14 + (i * (w - 28)) / (n - 1); col += c.cut(c.rect(cx - 5, y - h + 12, 10, h - 12), 0.3, 6); }
  s.p(c.cut(c.rect(x + 8, y - h + 10, w - 16, h - 10), 0.3, 8), shade(C.stone2, -0.12));
  s.p(col, C.plaster);
  s.p(c.cut(c.rect(x - 4, y - 6, w + 8, 9), 0.3, 6), C.stone2);
  s.x(c.poly(c.star(x + w / 2, y - h - 16, 7, 3.2, 6, 0)), C.ochre);
  return s.out();
}
/** a picture of the sick girl in bed with a small lamp burning low (for cards / bubbles); origin centre */
export function sickGirlIcon(c, o) {
  return `<g transform="translate(0 30) scale(.42)">${bedFrame(c)}${`<g transform="translate(0 -54)">${lyingPerson(c, o, 0.62)}</g>`}${blanket(c)}</g><g transform="translate(46 18) scale(.5)"><path d="${c.cut([[-16, 0], [-18, -6], [-10, -10], [8, -10], [16, -8], [20, -10], [22, -7], [15, -1], [8, 1], [-10, 1]], 0.3, 3)}" fill="${C.pot}"/><path d="M19 -10C16 -13 16 -17 19 -21C22 -17 22 -13 19 -10Z" fill="${C.lampFlame}"/></g>`;
}

/** a thought cloud with words; origin at the smallest bubble (bottom); the cloud floats up and to the side dir */
export function thinkBubble(c, lines, { size = 19, fill = C.cream, ink = C.ink, dir = 1, w } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.46 + size * 2.2;
  const hh = lines.length * size * 1.18 + size * 1.4;
  const cx = dir * (ww / 2 - 20), cy = -hh / 2 - 44;
  const pts = [];
  const n = Math.max(9, Math.round((ww + hh) / 34));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, a2 = ((i + 1) / n) * PI * 2;
    const x1 = cx + Math.cos(a) * ww / 2, y1 = cy + Math.sin(a) * hh / 2, x2 = cx + Math.cos(a2) * ww / 2, y2 = cy + Math.sin(a2) * hh / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(my - cy, mx - cx);
    pts.push(...c.qbez([x1, y1], [mx + Math.cos(ang) * 14, my + Math.sin(ang) * 14], [x2, y2], 5).slice(0, -1));
  }
  const s = sheet();
  s.p(c.cut(pts, 0.4, 5), fill);
  s.p(c.cut(c.circ(0, 0, 5, 10), 0.2, 3) + c.cut(c.circ(dir * 8, -16, 8, 12), 0.2, 3), fill);
  const t0 = cy - ((lines.length - 1) * size * 1.18) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="${cx.toFixed(1)}" y="${(t0 + i * size * 1.18).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** a little grey rain-cloud of sorrow; origin at its centre. drops: class "drop" (animate them) */
export function sorrowCloud(c, w = 90) {
  const h = w * 0.36, s = sheet();
  const pts = [[-w / 2, 0]];
  for (let i = 0; i <= 3; i++) {
    const cx = -w / 2 + (w * (i + 0.5)) / 4, rr = (w / 4) * c.rr(0.7, 0.95) * (i === 0 || i === 3 ? 0.85 : 1.2);
    pts.push(...c.arc(cx, -h * 0.2, rr, rr * 0.95, PI, 2 * PI, 8).map(([x, y]) => [x, Math.min(y, 0)]));
  }
  pts.push([w / 2, 0], [w / 2 - 6, 8], [-w / 2 + 6, 8]);
  s.p(c.cut(pts, 0.6, 6), mix(C.storm, C.stone2, 0.55));
  s.p(c.cut([[-w / 2 + 8, 2], [w / 2 - 8, 2], [w / 2 - 12, 9], [-w / 2 + 12, 9]], 0.4, 6), mix(C.storm2, C.stone2, 0.4));
  let drops = '';
  for (let i = 0; i < 5; i++) drops += `<path class="drop" data-i="${i}" d="${c.cut([[0, -5], [2.6, 1], [0, 3.4], [-2.6, 1]], 0.1, 2)}" fill="${mix(C.skyBlue2, C.storm, 0.35)}"/>`;
  return s.out() + drops;
}

/* ---------- a street in Capernaum (shared set for the crowd scenes) ---------- */
/** sky, sun & clouds, hills with a far town, a row of flat-roofed houses and the street; returns { sk, gfn, update } */
export function streetSet(S, { skyCols, sunAt = [1250, 130], street = 690 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl = [[450, 150, 200], [980, 205, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 620 }), x, y, i }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
  const hl = S.layer({ par: 0.16, sh: 3 });
  const hw = hillsWith(c, { y: 450, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 22 });
  hl.add(hw.markup + town(c, { x: 300, y: hw.fn(300) + 14, n: 7, spread: 380, sc: 0.55 }) + town(c, { x: 1350, y: hw.fn(1350) + 14, n: 6, spread: 360, sc: 0.55 }));
  // a row of houses along the street
  const row = S.layer({ par: 0.3, sh: 4 });
  const base = street - 76;
  let hs = '';
  let x = -700;
  let i = 0;
  while (x < 2400) {
    const w = c.rr(110, 170), h = c.rr(90, 140);
    hs += house(c, x, base + c.rr(-4, 4), w, h, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0 });
    x += w + c.rr(40, 90);
    i++;
  }
  row.add(hs);
  row.add(palm(c, 560, base + 4, 170) + olive(c, 1040, base + 4, 0.7) + palm(c, 1500, base + 4, 150) + palm(c, 20, base + 4, 160));
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(base + 6, [3, 1.5], [700, 180]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out());
  let stones = '';
  for (let k = 0; k < 60; k++) { const px = c.rr(-600, 2200), py = c.rr(base + 30, base + 260); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
  ground.add(sheet().x(stones, C.sand2, 'opacity=".7"').out());
  ground.add(grass(c, { x0: -600, x1: 2200, y: base + 6, fn: gfn, n: 24, h: 12, color: C.olive }));
  return {
    sk, gfn,
    update(t, T) {
      swing(sunEl, sunAt[0], sunAt[1], T, 1.1, 0.7);
      cl.forEach((k) => swing(k.el, k.x + Math.sin(T * 0.1 + k.i * 2) * 26, k.y, T, 1.4, 0.6 + k.i * 0.2, k.i));
    },
  };
}
