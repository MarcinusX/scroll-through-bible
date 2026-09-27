// John 1 — cut-outs and sets shared by this chapter's scenes.
// The Prologue plays on a dark stage where the Word is a paper flame; the Jordan scenes reuse Mark's cast.
import { C, sheet, shade, mix, pose, attr, person, CAST, crowdPerson, lerp, sky, hanging } from '../kit.js';
import { band, reeds, rock, sun, cloud, grass, hillsWith, waterBand, olive, cypress, flowers, town } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';

export { JOHN_B, hand, headAt, hang2, voiceRings, scrollParts, dove, flapWings, acacia, scrub, walledCity, sparkle, shell, drops, tagOnString, sandalBig, plate, signpost, tearLine, flame } from '../mark1/lib.js';
export { kf, moving, speech, thought, GLYPH, addToHead, turban, spark } from '../mark2/lib.js';
export { LOOK, nameTag, bubble, strip, question, withFace, faceBits, houseSection, along, heart, pharisee, man, woman, shadowPerson, scrollRoll } from '../mark3/lib.js';
export { storyFrame, SEPIA, crossX, tick, disc, crown, sheep } from '../mark6/lib.js';
export { angel, glory, soulLight, globe, oilHorn, lightCrown } from '../mark8/lib.js';
export { fireWheel, tent } from '../mark9/lib.js';
export { lawTablets } from '../mark10/lib.js';
export { priest, lamb, figTree, figs } from '../mark11/lib.js';
export { tint, handLamp } from '../mark13/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== palettes */
export const VOID = ['#10132b', '#181c3f', '#22274f'];
export const DAY = ['#cfe0da', '#f1e5c9', '#f7e9cf'];
export const MORNING = ['#d6e3dd', '#f4e4c8', '#f8e8cc'];
export const GOLDEN = ['#e6c9a0', '#f2d3a2', '#f7e2bd'];
export const NIGHT = ['#1d2349', '#2b3262', '#4a4876'];
export const GOLD_LIGHT = '#fff3cf';

/* ================================================================== cast */
export const MOSES = { robe: mix(C.dustyBlue, C.stone, 0.3), mantle: C.clayMantle, hair: '#e8e1d4', hairStyle: 'wrap', veil: C.linen2, veil2: C.clay, beard: 'wild', beardColor: '#eee7da', skin: C.skin3, belt: C.leather };
export const LEVITE = (i = 0) => ({ robe: [C.linen, C.linen2, C.stone][i % 3], mantle: [C.skyVeil, C.stone2, C.sageRobe][i % 3], hair: [C.hair2, C.hair3, C.hair][i % 3], hairStyle: 'wrap', veil: C.linen, veil2: [C.dustyBlue, C.teal2, C.ochre][i % 3], beard: ['short', 'full', 'short'][i % 3], skin: [C.skin, C.skin3, C.skin2][i % 3], belt: C.ochre });
// Jesus as a traveller in the crowd (not yet recognised): a plain mantle over his head, a faint halo only we can see
export const JESUS_HOODED = { ...CAST.jesus, halo: false, mantle: C.stone2, hairStyle: 'veil', veil: C.stone2, veil2: shade(C.stone2, -0.1) };

/* ================================================================== the Word: a paper flame */
function dropPts(c, h, w, lean = 0) {
  const r = w / 2, cy = -r;
  const pts = c.arc(0, cy, r, r, 0, PI, 10);
  pts.push(...c.qbez([-r, cy], [-r * 0.95 + lean * 0.2, cy - (h - r) * 0.5], [lean, -h], 10).slice(1));
  pts.push(...c.qbez([lean, -h], [r * 0.95 + lean * 0.2, cy - (h - r) * 0.5], [r, cy], 10).slice(1, -1));
  return pts;
}
/** the Word — a flame cut from gold and cream paper; origin at the flame's base (it rises to -h) */
export function wordFlame(c, h = 90) {
  const s = sheet();
  s.p(c.cut(dropPts(c, h * 0.72, h * 0.36, -h * 0.12).map(([x, y]) => [x - h * 0.16, y + 2]), 0.3, 5) + c.cut(dropPts(c, h * 0.66, h * 0.32, h * 0.14).map(([x, y]) => [x + h * 0.17, y + 2]), 0.3, 5), C.sunDeep);
  s.p(c.cut(dropPts(c, h, h * 0.56), 0.4, 5), C.sun);
  s.p(c.cut(dropPts(c, h * 0.78, h * 0.42, h * 0.03), 0.3, 5), C.lampFlame);
  s.p(c.cut(dropPts(c, h * 0.52, h * 0.26, -h * 0.02).map(([x, y]) => [x, y - h * 0.04]), 0.3, 4), '#fff4d2');
  return s.out();
}
/** a warm radial glow (flat, no paper); origin centre */
export const glowDisc = (r = 200, id = 'warm-glow', o = 1) => `<circle r="${r}" fill="url(#${id})" opacity="${o}"/>`;
/** thin rays around a centre (flat) */
export function rayBurst(c, { n = 18, r0 = 40, r1 = 600, spread = 0.05, color = GOLD_LIGHT, o = 0.8 } = {}) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.05, 0.05), w = spread * c.rr(0.6, 1.3), rr = r1 * c.rr(0.7, 1.05);
    d += c.poly([[Math.cos(a - w * 0.25) * r0, Math.sin(a - w * 0.25) * r0], [Math.cos(a - w) * rr, Math.sin(a - w) * rr], [Math.cos(a + w) * rr, Math.sin(a + w) * rr], [Math.cos(a + w * 0.25) * r0, Math.sin(a + w * 0.25) * r0]]);
  }
  return `<path d="${d}" fill="${color}" opacity="${o}"/>`;
}
/** the light of the Father: never a figure — a great round radiance of layered pale-gold paper; origin centre */
export function radiance(c, r = 150) {
  const s = sheet();
  s.p(c.cut(c.star(0, 0, r * 1.18, r * 0.98, 28, 0), 0.6, 6), mix(C.halo, C.haloRim, 0.35));
  s.p(c.cut(c.circ(0, 0, r, 48), 0.6, 6), C.halo);
  s.p(c.cut(c.star(0, 0, r * 0.8, r * 0.68, 20, 0.1), 0.4, 5), mix(C.halo, C.star, 0.5));
  s.p(c.cut(c.circ(0, 0, r * 0.56, 36), 0.4, 5), C.star);
  s.x(c.poly(c.circ(0, 0, r * 0.34, 28)), '#fffdf4');
  return s.out();
}
/** a ring without end (eternity), cut into n arc pieces so it can draw itself: pieces carry data-i */
export function eternityRing(c, r = 170, w = 9, n = 24, col = C.haloRim) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * PI * 2 - PI / 2, a1 = ((i + 1.08) / n) * PI * 2 - PI / 2;
    out += `<path data-i="${i}" d="${c.ribbon(c.arc(0, 0, r, r, a0, a1, 4), w)}" fill="${col}"/>`;
  }
  // tiny stars sit on the ring
  let st = '';
  for (let i = 0; i < 8; i++) { const a = (i / 8) * PI * 2 - PI / 2; st += c.poly(c.star(Math.cos(a) * r, Math.sin(a) * r, 9, 3, 4, 0)); }
  return `<g class="segs">${out}</g><path class="ringStars" d="${st}" fill="${C.star}"/>`;
}
/** draw the ring (k 0→1) by revealing its pieces */
export function drawRing(el, k) {
  const segs = el.__segs || (el.__segs = Array.from(el.querySelectorAll('[data-i]')));
  const n = segs.length;
  segs.forEach((p, i) => attr(p, 'opacity', Math.max(0, Math.min(1, k * n - i))));
  attr(el.__st || (el.__st = el.querySelector('.ringStars')), 'opacity', Math.max(0, (k - 0.85) / 0.15));
}

/* ================================================================== golden threads (the world hangs on the Word) */
/** a set of n straight threads in one piece; returns set(i, x1, y1, x2, y2, o) */
export function threads(L, n, { color = C.haloRim, w = 1.6 } = {}) {
  let inner = '';
  for (let i = 0; i < n; i++) inner += `<path data-i="${i}" d="M0 0L0 0" stroke="${color}" stroke-width="${w}" fill="none" opacity="0" stroke-linecap="round"/>`;
  const g = L.add(`<g>${inner}</g>`);
  const ps = Array.from(g.querySelectorAll('path'));
  return (i, x1, y1, x2, y2, o) => {
    const p = ps[i];
    if (o <= 0.01) { attr(p, 'opacity', 0); return; }
    attr(p, 'd', `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`);
    attr(p, 'opacity', o);
  };
}

/* ================================================================== darkness */
/** a ragged sheet of darkness that reaches in from one side; origin at its inner edge (x=0) */
export function darkSheet(c, dir = -1, { w = 1600, h = 2600, col = '#1c1f45' } = {}) {
  const pts = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const y = -h / 2 + (h * i) / n;
    pts.push([(i % 2 ? -1 : 1) * c.rr(16, 60) + Math.sin(i * 0.9) * 40, y]);
  }
  const outer = dir < 0 ? [[-w, h / 2], [-w, -h / 2]] : [[w, h / 2], [w, -h / 2]];
  const d = c.poly([...pts.map(([x, y]) => [x * -dir, y]), ...outer]);
  let claws = '';
  for (let i = 0; i < 5; i++) { const y = -340 + i * 70 + c.rr(-14, 14), l = c.rr(80, 140); claws += c.poly([[dir * 10, y - 20], [-dir * l * 0.6, y - 8 + c.rr(-6, 6)], [-dir * l, y + c.rr(-14, 14)], [-dir * l * 0.5, y + 6], [dir * 10, y + 20]]); }
  return `<path d="${d}" fill="${col}"/><path d="${claws}" fill="${col}"/><path class="grain" d="${d}"/>`;
}

/* ================================================================== the world on the dark stage */
/** a house front whose door can close: { wall, leaf } — wall origin bottom-left; leaf pivots at its left edge */
export function doorHouse(c, { w = 150, h = 120, wall = C.plaster, shadow = C.plaster2, roof = C.roof, dw = 44, dh = 74 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(0, -h, w, h + 4), 0.6, 8), wall);
  s.p(c.cut([[w, -h], [w + w * 0.16, -h + 10], [w + w * 0.16, 4], [w, 4]], 0.4, 6), shadow);
  s.p(c.cut([[-5, -h - 7], [w + 5, -h - 7], [w + 5, -h + 1], [-5, -h + 1]], 0.3, 6), roof);
  const dx = w * 0.18;
  const doorPts = [[dx, 2], [dx, -dh + dw / 2], ...c.arc(dx + dw / 2, -dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 8), [dx + dw, 2]];
  s.x(c.poly(doorPts), mix(C.soilDark, C.night, 0.3));
  const wx = w * 0.64, wy = -h * 0.7;
  s.x(c.poly(c.rect(wx, wy, 26, 22)), mix(C.soilDark, C.night, 0.3));
  const inside = `<path d="${c.poly(doorPts)}" fill="${C.lampGlow}"/><path d="${c.poly(c.rect(wx, wy, 26, 22))}" fill="${C.lampGlow}"/>`;
  const leaf = sheet().p(c.cut(doorPts.map(([x, y]) => [x - dx, y]), 0.3, 5), C.wood2).x(c.ribbon([[dw * 0.2, -8], [dw * 0.2, -dh + 16]], 2) + c.ribbon([[dw * 0.55, -8], [dw * 0.55, -dh + 12]], 2), shade(C.wood2, -0.2), 'opacity=".6"').out();
  const shutter = sheet().p(c.cut(c.rect(0, 0, 26, 22), 0.2, 4), C.wood3).out();
  return { wall: s.out(), inside, leaf, shutter, door: [dx, dw, dh], win: [wx, wy] };
}

/* ================================================================== the Word made flesh */
/** a swaddled baby with a little halo, lying on straw in a manger; origin bottom centre */
export function manger(c) {
  const s = sheet();
  s.p(c.cut([[-60, -40], [60, -40], [48, 0], [-48, 0]], 0.5, 6), C.wood);
  s.p(c.ribbon([[-58, -38], [58, -38]], 6), C.wood2);
  s.p(c.cut([[-40, 0], [-52, 30], [-44, 30], [-32, 0]], 0.3, 4) + c.cut([[40, 0], [52, 30], [44, 30], [32, 0]], 0.3, 4), C.wood2);
  let straw = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-62, 62); straw += c.ribbon([[x, -38], [x + c.rr(-14, 14), -46 - c.rr(0, 12)]], 2); }
  s.p(straw, C.wheat);
  return s.out();
}
export function baby(c) {
  const s = sheet();
  s.x(c.poly(c.circ(26, -18, 20, 20)), C.halo, 'opacity=".95"');
  s.p(c.cut(c.star(26, -18, 21, 18, 14, 0), 0.3, 3), C.haloRim);
  s.p(c.cut(c.circ(26, -18, 17, 18), 0.3, 3), C.halo);
  s.p(c.cut(c.blob(-6, -12, 34, 14, 14, 0.06), 0.4, 4), C.linen);
  s.x(c.ribbon([[-24, -22], [-20, -2]], 2.4) + c.ribbon([[-8, -25], [-4, -1]], 2.4) + c.ribbon([[8, -24], [10, -2]], 2.4), C.linen2);
  s.p(c.cut(c.circ(26, -16, 11, 14), 0.2, 3), C.skin);
  s.p(c.cut([...c.arc(26, -16, 11.5, 11.5, PI * 0.95, PI * 1.9, 8), [30, -22], [20, -20]], 0.3, 3), C.hairJesus);
  s.x(c.ribbon(c.arc(29, -16, 2, 1.4, 0.2, PI - 0.2, 4), 0.9) + c.ribbon(c.arc(34, -16, 1.8, 1.4, 0.2, PI - 0.2, 4), 0.9), C.inkSoft);
  s.x(c.poly(c.circ(31, -10, 2.4, 8)), C.blush, 'opacity=".6"');
  return s.out();
}

/** the tent of meeting: a big striped tent whose two front flaps open (flap origin at the apex); origin: base centre */
export function bigTent(c, { w = 300, h = 250, col = C.wheatRobe, stripe = C.terracotta, inside = '#6b4a3a' } = {}) {
  const back = sheet();
  back.p(c.cut([[-w / 2 - 20, 0], [0, -h], [w / 2 + 20, 0]], 0.6, 8), shade(col, -0.18));
  back.p(c.cut([[-w * 0.36, 0], [0, -h + 14], [w * 0.36, 0]], 0.5, 8), inside);
  back.p(c.ribbon([[0, -h - 20], [0, 0]], 7), C.wood2);
  back.x(c.cut([[0, -h - 20], [22, -h - 14], [0, -h - 8]], 0.2, 3), stripe);
  back.x(c.ribbon([[-w / 2 - 20, 0], [-w / 2 - 60, 10]], 1.6) + c.ribbon([[w / 2 + 20, 0], [w / 2 + 60, 10]], 1.6), C.rope);
  const flap = (dir) => {
    const s = sheet();
    const pts = [[0, 0], [dir * (w / 2 + 6), h], [dir * 4, h]];
    s.p(c.cut(pts, 0.5, 8), dir < 0 ? col : shade(col, 0.1));
    let st = '';
    for (let i = 1; i < 4; i++) { const u = i / 4; st += c.ribbon([[dir * 3, h * u], [dir * (w / 2) * u, h * u + 6]], 5); }
    s.x(st, stripe, 'opacity=".7"');
    s.x(c.ribbon([[0, 0], [dir * (w / 2 + 6), h]], 3), shade(col, -0.25), 'opacity=".6"');
    return s.out();
  };
  return { back: back.out(), flapL: flap(-1), flapR: flap(1) };
}

/* ================================================================== words, cards, plates */
/** a word written in gold on a dark-paper strip (for the dark stage); origin centre */
export function goldWord(c, text, { size = 30, fill = '#2a2e5a', ink = C.halo, w } = {}) {
  const ww = w || text.length * size * 0.52 + size * 1.4, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.6, 7), fill);
  s.x(c.ribbon([[-ww / 2 + 8, -hh / 2 + 6], [ww / 2 - 8, -hh / 2 + 5]], 1.2) + c.ribbon([[-ww / 2 + 8, hh / 2 - 6], [ww / 2 - 8, hh / 2 - 5]], 1.2), C.haloRim, 'opacity=".7"');
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** hung from the flies */
export function hungGold(c, text, o = {}) {
  return `<g class="hang"><path d="M0 ${-1600}V${-(o.size || 30) * 0.75}" stroke="rgba(233,196,111,.6)" stroke-width="1.2" fill="none"/><g class="obj">${goldWord(c, text, o)}</g></g>`;
}
/** a word on a cream strip, hung from the flies; origin at the strip's centre */
export function hungWord(c, text, { size = 24, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.3, hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `<g class="hang"><path d="M${-ww * 0.3} -1600V${-hh / 2}M${ww * 0.3} -1600V${-hh / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text></g></g>`;
}
/** a round picture plate hung from one string; origin at the plate centre */
export function hungPlate(c, icon, { r = 56, fill = C.cream, rim = C.haloRim, face } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill);
  if (face) s.p(c.cut(c.circ(0, 0, r - 7, 32), 0.4, 5), face);
  return `<g class="hang"><path d="M0 -1600V${-r - 6}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${s.out()}${icon}</g></g>`;
}
/** an icon with a word written under it, for a round plate (origin: plate centre) */
export function iconWord(icon, word, { size = 17, y = 36, ink = C.ink } = {}) {
  return `<g transform="translate(0 -10)">${icon}</g><text x="0" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${word}</text>`;
}
/** a red cross (X) laid over a plate */
export function crossOut(c, r = 34) {
  return sheet().p(c.ribbon([[-r, -r], [r, r]], 8, 0.6) + c.ribbon([[r, -r], [-r, r]], 8, 0.6), C.terracotta).out();
}
/** a head-and-shoulders portrait (for the plates); o = puppet options; origin centre */
export function bust(c, o, sc = 1) {
  return `<g transform="scale(${sc}) translate(-2 150)">${person(c, { ...o, holdF: '', holdB: '' })}</g>`;
}

/* ================================================================== icons for the plates */
/** a blood drop (origin centre) */
export function dropIcon(c, r = 18, col = shade(C.terracotta, -0.1)) {
  return sheet().p(c.cut([[0, -r * 1.6], [r * 0.7, -r * 0.2], [r, r * 0.3], ...c.arc(0, r * 0.3, r, r, 0, PI, 10), [-r, r * 0.3], [-r * 0.7, -r * 0.2]], 0.3, 4), col).out();
}
/** a man's signet ring / will: a ring with a seal (origin centre) */
export function ringIcon(c, r = 18) {
  return sheet().p(c.ribbon(c.arc(0, 6, r, r, 0, PI * 2, 24), 6), C.sun).p(c.cut(c.ell(0, -r + 4, 10, 8, 12), 0.3, 3), C.terracotta).out();
}
/** little figure (origin at feet) */
export function figureIcon(c, col = C.dustyBlue, skin = C.skin2, h = 60) {
  const k = h / 60;
  return sheet().p(c.cut([[-14 * k, 0], [-11 * k, -34 * k], [11 * k, -34 * k], [14 * k, 0]], 0.3, 4), col).p(c.cut(c.circ(0, -44 * k, 9 * k, 12), 0.2, 3), skin).out();
}
/** a stone tablet with a sundial shadow — the tenth hour; origin centre */
export function sundial(c, r = 60, hour = 10) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, 0, r, r, PI, 2 * PI, 20), [r, 8], [-r, 8]], 0.6, 6), C.stone);
  let ticks = '';
  for (let i = 0; i <= 12; i++) { const a = PI + (i / 12) * PI; ticks += c.ribbon([[Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62], [Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86]], i % 3 ? 1.6 : 3); }
  s.x(ticks, C.rock3);
  s.p(c.cut(c.circ(0, 0, 6, 10), 0.2, 3), C.wood2);
  // the shadow at the tenth hour (of twelve daylight hours)
  const a = PI + (hour / 12) * PI;
  const shadow = `<path class="dialShadow" d="${c.poly([[0, -3], [Math.cos(a) * r * 0.84, Math.sin(a) * r * 0.84], [0, 3]])}" fill="${C.inkSoft}" opacity=".75"/>`;
  return s.out() + shadow;
}

/* ================================================================== the Jordan */
/**
 * The Jordan at Bethany beyond the Jordan: sky, sun and clouds on strings, the mountains, a far bank
 * with a road coming down from Jerusalem, the river. Returns handles; the scene then adds its own layers:
 *   R = riverLayer() (people standing in the river), waterFront(R), then nearBank().
 */
export function jordanSet(S, { skyCols = DAY, sunAt = [1200, 160], sunR = 48, city = false, clouds = true, tents = false, path = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const glowEl = hangL.add(`<g>${glowDisc(200, 'warm-glow', 0.7)}</g>`);
  const sunEl = hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = clouds ? [
    { el: hanging(hangL, cloud(c, 190), { x: 520, y: 150, len: 700 }), x: 520, y: 150, ph: 1 },
    { el: hanging(hangL, cloud(c, 140), { x: 930, y: 110, len: 700 }), x: 930, y: 110, ph: 2 },
  ] : [];
  // the mountains of Moab and the hills of Judea
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [22, 9, 3], lens: [1000, 360, 130], color: mix(C.duskViolet, C.dune, 0.5), x0: -1300 }).markup);
  const hill = S.layer({ par: 0.16, sh: 3 });
  const hs = sheet();
  hs.p(c.cut([[-1300, 700], [-1300, 470], [-600, 440], [80, 400], [330, 360], [560, 356], [700, 420], [860, 470], [1100, 480], [1500, 462], [2600, 470], [2600, 700]], 1.2, 12), mix(C.dune, C.sand2, 0.4));
  hs.x(c.cut([[700, 420], [860, 470], [800, 480], [680, 440]], 0.6, 8), C.sand, 'opacity=".6"');
  const PATH = [[450, 362], [560, 392], [440, 424], [600, 456], [500, 490], [690, 522]];
  if (path) hs.p(c.ribbon(PATH, (u) => 5 + u * 10, 0.6), C.sand);
  hill.add(hs.out());
  if (city) hill.add(walledCityLocal(c, 450, 360, 0.9));
  // the far bank
  const L = S.layer({ par: 0.45, sh: 3 });
  const fbFn = c.wave(578, [5, 2], [600, 170]);
  L.add(sheet().p(c.ridge(fbFn, -1300, 2600, 1700, 12, 1), mix(C.sand, C.sage3, 0.35)).out());
  L.add(grass(c, { x0: -1300, x1: 2600, y: 578, fn: fbFn, n: 50, h: 14, color: C.olive }));
  L.add(reeds(c, 260, 604, 9, 70) + reeds(c, 1350, 606, 10, 80) + reeds(c, 560, 602, 6, 50));
  if (tents) L.add(tentsRow(c, fbFn));
  // the river
  const W = S.layer({ par: 0.45, sh: 2 });
  W.add(sheet().p(c.ridge(c.wave(600, [3, 1.2], [140, 52]), -1300, 2600, 1700, 10, 0.6), C.lake).out());
  const flow = S.layer({ par: 0.45, sh: 1, flat: true, pad: 200 });
  let st = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-1300, 2600), y = c.rr(612, 700), w = c.rr(30, 90); st += c.cut([[x, y], [x + w * 0.5, y - 1.6], [x + w, y], [x + w * 0.5, y + 1.2]], 0.2, 8); }
  flow.add(`<path d="${st}" fill="${C.foam}" opacity=".55"/>`);
  return {
    sk, hangL, sunEl, fbFn, far: L, PATH, hill,
    riverLayer: () => S.layer({ par: 0.45, sh: 4 }),
    waterFront(R) {
      const wl = sheet();
      wl.p(c.ridge(c.wave(648, [2.5, 1.2], [160, 60]), -1300, 2600, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.4));
      let fl = '';
      for (let x = -1300; x < 2600; x += c.rr(40, 90)) fl += c.cut([[x, 649], [x + 20, 646], [x + 42, 649], [x + 20, 651]], 0.2, 6);
      wl.x(fl, C.foam, 'opacity=".7"');
      R.add(wl.out());
    },
    nearBank({ fg = true } = {}) {
      const N = S.layer({ par: 0.45, sh: 4 });
      const nbFn = c.wave(708, [4, 2], [500, 150]);
      N.add(sheet().p(c.ridge(nbFn, -1300, 2600, 1700, 12, 1), C.sand2).out());
      N.add(grass(c, { x0: -1300, x1: 2600, y: 708, fn: nbFn, n: 40, h: 16, color: C.olive }) + rock(c, 380, 760, 70, 24, C.rock2));
      return { N, nbFn };
    },
    foreground() {
      const fg = S.layer({ par: 0.85, sh: 7 });
      fg.add(reeds(c, 150, 960, 16, 260, C.moss) + reeds(c, 1480, 950, 14, 240, C.moss) + rock(c, 1360, 980, 220, 90, C.rock2));
      return fg;
    },
    update(t, time, { sunY = sunAt[1], sunX = sunAt[0], glow = 0 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6) * 1 });
      pose(glowEl, { x: sunX, y: sunY, s: 1 + glow * 0.6, o: 0.5 + glow * 0.5 });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.ph) * 22, y: cl.y, r: Math.sin(time * 0.6 + cl.ph) * 1.2 }));
      flow.shift((time * 18) % 200 - 100, 0);
    },
  };
}
function walledCityLocal(c, x, y, sc) {
  // Jerusalem on its hill (same drawing as Mark 1)
  const s = sheet();
  const W = 190 * sc, H = 44 * sc;
  s.p(c.cut(c.rect(x - 34 * sc, y - H - 64 * sc, 68 * sc, 64 * sc), 0.4, 6), C.cream);
  s.p(c.cut(c.rect(x - 40 * sc, y - H - 70 * sc, 80 * sc, 8 * sc), 0.3, 6), C.sun);
  let cols = '';
  for (let i = 0; i < 5; i++) cols += c.cut(c.rect(x - 28 * sc + i * 13 * sc, y - H - 56 * sc, 4 * sc, 40 * sc), 0.2, 4);
  s.x(cols, shade(C.cream, -0.15));
  let hs = '';
  for (let i = 0; i < 7; i++) { const hx = x - W / 2 + 10 * sc + i * 26 * sc, hh = c.rr(16, 34) * sc; if (Math.abs(hx - x) < 40 * sc) continue; hs += c.cut(c.rect(hx, y - H - hh, 22 * sc, hh + 4), 0.3, 5); }
  s.p(hs, C.plaster);
  const pts = [[x - W / 2, y], [x - W / 2, y - H]];
  for (let xx = x - W / 2; xx < x + W / 2 - 8 * sc; xx += 16 * sc) pts.push([xx, y - H], [xx, y - H - 7 * sc], [xx + 8 * sc, y - H - 7 * sc], [xx + 8 * sc, y - H]);
  pts.push([x + W / 2, y - H], [x + W / 2, y]);
  s.p(c.cut(pts, 0.3, 6), C.stone);
  s.p(c.cut(c.rect(x - W / 2 - 12 * sc, y - H - 22 * sc, 26 * sc, H + 22 * sc), 0.3, 5) + c.cut(c.rect(x + W / 2 - 14 * sc, y - H - 22 * sc, 26 * sc, H + 22 * sc), 0.3, 5), C.stone2);
  s.x(c.cut([[x - 12 * sc, y], [x - 12 * sc, y - 22 * sc], ...c.arc(x, y - 22 * sc, 12 * sc, 12 * sc, PI, 2 * PI, 6), [x + 12 * sc, y]], 0.2, 4), C.soilDark);
  return s.out();
}
/** a row of small tents on the far bank (people camping by John) */
function tentsRow(c, fn) {
  let out = '';
  [[140, C.wheatRobe], [330, C.clayMantle], [1250, C.stone], [1430, C.ochreRobe]].forEach(([x, col]) => {
    const s = sheet(), w = 70, h = 52, y = fn(x) + 4;
    s.p(c.cut([[x - w / 2, y], [x, y - h], [x + w / 2, y]], 0.5, 6), col);
    s.p(c.cut([[x - 5, y], [x, y - h * 0.5], [x + 7, y]], 0.3, 4), shade(col, -0.45));
    out += s.out();
  });
  return out;
}

/* ================================================================== a field in Galilee */
/** open country by the lake: sky, sun and clouds on strings, lake, hills with a town, green ground with a road */
export function fieldSet(S, { skyCols = DAY, sunAt = [1180, 150], figAt = null } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const glowEl = hangL.add(`<g>${glowDisc(200, 'warm-glow', 0.7)}</g>`);
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = [[480, 160, 190], [980, 120, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 700 }), x, y, i }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
  S.layer({ par: 0.14, sh: 2 }).add(waterBand(c, { y: 470, color: mix(C.lake, C.skyBlue, 0.3), foamN: 20 }).markup);
  const hills = hillsWith(c, { y: 530, amps: [22, 9, 3], lens: [900, 300, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 24 });
  const H = S.layer({ par: 0.22, sh: 3 });
  H.add(hills.markup + town(c, { x: 1300, y: hills.fn(1300) + 12, n: 6, spread: 220, sc: 0.5 }));
  const G = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(690, [8, 3], [700, 180]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).out());
  G.add(sheet().p(c.ribbon([[-900, 752], [300, 756], [900, 750], [1500, 758], [2500, 754]], 60, 2), mix(C.sand, C.cream, 0.4)).out());
  G.add(grass(c, { x0: -900, x1: 2500, y: 690, fn: gfn, n: 70, h: 16, color: C.moss }) + flowers(c, { x0: -800, x1: 2400, y: 690, fn: gfn, n: 30 }) + olive(c, 200, 700, 0.9) + cypress(c, 1420, 700, 140));
  return {
    sk, hangL, sunEl, G, gfn,
    update(t, time, { sunX = sunAt[0], sunY = sunAt[1], glow = 0, o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o });
      pose(glowEl, { x: sunX, y: sunY, s: 1 + glow, o: glow * o });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 22, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2, o }));
    },
  };
}

/* ================================================================== the map of the land */
export const LAND = { w: 520, h: 600, jer: [-140, 150], beth: [74, 110], lake: [40, -170], bsd: [66, -212], naz: [-110, -120], cana: [-120, -178] };
/** a parchment map: the lake of Galilee, the Jordan, the Dead Sea, Jerusalem and Bethany beyond the Jordan; origin centre */
export function landMap(c) {
  const { w, h } = LAND;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 16, -h / 2 + 16], [w / 2 - 16, -h / 2 + 16], [w / 2 - 16, h / 2 - 16], [-w / 2 + 16, h / 2 - 16], [-w / 2 + 16, -h / 2 + 18]], 2), C.clay, 'opacity=".5"');
  let hills = '';
  [[-180, -60], [-60, -30], [150, -80], [-190, 60], [-40, 60], [170, 40], [-180, 220], [180, 220], [-60, 240]].forEach(([x, y]) => { hills += c.cut([[x - 22, y + 8], [x, y - 16], [x + 22, y + 8]], 0.5, 6); });
  s.x(hills, shade(C.parchment, -0.14));
  const [lx, ly] = LAND.lake;
  s.p(c.cut([[lx - 12, ly - 46], [lx + 22, ly - 42], [lx + 34, ly - 10], [lx + 26, ly + 24], [lx + 4, ly + 44], [lx - 16, ly + 30], [lx - 26, ly], [lx - 24, ly - 30]], 0.6, 5), C.lake);
  const river = [[lx + 4, ly + 42], [lx + 20, ly + 100], [lx + 2, ly + 160], [lx + 24, ly + 220], [lx + 8, ly + 270], [lx + 20, 180]];
  s.p(c.ribbon(river, 5), C.lake2);
  s.p(c.cut(c.blob(lx + 22, 232, 22, 46, 10, 0.12), 0.6, 5), C.lake2);
  const txt = (x, y, t, size = 17, col = C.inkSoft, anchor = 'start') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${t}</text>`;
  const town = (x, y) => c.cut(c.rect(x - 8, y - 6, 16, 10), 0.3, 4) + c.cut([[x - 10, y - 6], [x, y - 15], [x + 10, y - 6]], 0.3, 4);
  s.p(town(...LAND.jer) + town(...LAND.naz) + town(...LAND.bsd) + town(...LAND.cana), C.clay);
  const labels = txt(LAND.jer[0] - 14, LAND.jer[1] + 6, tr('Jerozolima', 'Jerusalem'), 18, C.inkSoft, 'end')
    + txt(LAND.naz[0] - 14, LAND.naz[1] + 5, tr('Nazaret', 'Nazareth'), 16, C.inkSoft, 'end')
    + txt(LAND.cana[0] - 14, LAND.cana[1] + 5, tr('Kana', 'Cana'), 16, C.inkSoft, 'end')
    + txt(LAND.bsd[0] + 14, LAND.bsd[1] + 2, tr('Betsaida', 'Bethsaida'), 16)
    + txt(LAND.beth[0] + 18, LAND.beth[1] + 5, tr('Betania', 'Bethany'), 17)
    + txt(lx + 44, ly + 30, tr('Galilea', 'Galilee'), 26, C.terracotta)
    + txt(lx + 40, ly + 170, tr('Jordan', 'Jordan'), 15, shade(C.lakeDeep, -0.1));
  return s.out() + labels;
}
/** a pin (origin at its point) */
export function pin(c, col = C.terracotta) {
  return sheet().p(c.cut([[0, 0], [-9, -16], ...c.arc(0, -20, 10, 10, PI * 0.8, PI * 2.2, 10), [9, -16]], 0.3, 3), col).x(c.poly(c.circ(0, -21, 3.5, 8)), C.cream).out();
}

/* ================================================================== heaven opened */
/** Jacob's ladder of light; origin at its foot, rising to -h; rails narrow towards the top */
export function ladder(c, h = 620, w0 = 90, w1 = 46) {
  const s = sheet();
  const railL = [[-w0 / 2, 0], [-w1 / 2, -h]], railR = [[w0 / 2, 0], [w1 / 2, -h]];
  s.p(c.ribbon(railL, 8) + c.ribbon(railR, 8), C.halo);
  let rungs = '';
  const n = 14;
  for (let i = 1; i < n; i++) {
    const u = i / n, y = -h * u, hw = lerp(w0, w1, u) / 2;
    rungs += c.ribbon([[-hw, y], [hw, y]], 5);
  }
  s.p(rungs, mix(C.halo, C.star, 0.4));
  return `<path d="${c.poly([[-w0 * 1.1, 0], [-w1 * 1.4, -h], [w1 * 1.4, -h], [w0 * 1.1, 0]])}" fill="${GOLD_LIGHT}" opacity=".35"/>${s.out()}`;
}
/** a small flying angel on a string (wings spread, robe trailing); origin at the string's end */
export function smallAngel(c, { robe = C.linen, hair = C.wheat2, skin = C.skin } = {}) {
  const s = sheet();
  const wing = (dir) => c.cut([[0, 0], [dir * 18, -26], [dir * 44, -40], [dir * 60, -36], [dir * 48, -24], [dir * 58, -16], [dir * 38, -8], [dir * 44, 2], [dir * 16, 6]], 0.5, 4);
  s.p(wing(-1) + wing(1), '#fbf7ee');
  s.x(c.ribbon([[-20, -10], [-44, -26]], 1.2) + c.ribbon([[20, -10], [44, -26]], 1.2), '#e3dccd');
  s.p(c.cut([[-10, -6], [10, -6], [16, 40], [6, 52], [-6, 50], [-16, 40]], 0.4, 5), robe);
  s.p(c.cut(c.circ(0, -16, 10, 12), 0.3, 3), skin);
  s.p(c.cut([...c.arc(0, -17, 11, 11, PI * 0.9, PI * 2.1, 10), [11, -12], [6, -20], [-6, -20], [-11, -12]], 0.3, 3), hair);
  s.x(c.ribbon(c.arc(0, -30, 9, 3, 0, PI * 2, 14), 1.6), C.haloRim);
  return `<g class="hang"><path d="M0 -1600V-30" stroke="rgba(233,196,111,.55)" stroke-width="1" fill="none"/><g class="obj">${s.out()}</g></g>`;
}
/** two doors of the sky (paper panels that swing open); origin at the hinge; w wide, h tall */
export function skyDoor(c, dir, { w = 360, h = 520, col = NIGHT[1], star = C.star } = {}) {
  const s = sheet();
  const pts = dir < 0 ? [[0, -h / 2], [-w, -h / 2], [-w, h / 2], [0, h / 2]] : [[0, -h / 2], [w, -h / 2], [w, h / 2], [0, h / 2]];
  s.p(c.cut(pts, 1.2, 12), col);
  s.x(c.ribbon([[dir * 14, -h / 2 + 12], [dir * 14, h / 2 - 12]], 3), C.haloRim, 'opacity=".7"');
  let st = '';
  for (let i = 0; i < 18; i++) { const x = dir * c.rr(30, w - 20), y = c.rr(-h / 2 + 20, h / 2 - 20), r = c.rr(2, 5); st += r > 4 ? c.poly(c.star(x, y, r * 1.8, r * 0.5, 4, 0)) : c.poly(c.circ(x, y, r * 0.6, 6)); }
  s.x(st, star);
  return s.out();
}

/* ================================================================== small bits */
/** a rock with a word carved in it (Kefas); origin at the base centre */
export function namedRock(c, text, { w = 220, h = 150, col = C.rock } = {}) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -h * 0.48, w / 2, h / 2, 14, 0.12).map(([x, y]) => [x, Math.min(y, 0)]), 1.2, 7), col);
  s.x(c.cut([[-w * 0.3, -h * 0.62], [-w * 0.05, -h * 0.9], [w * 0.2, -h * 0.66], [-w * 0.05, -h * 0.55]], 0.5, 6), shade(col, 0.3), 'opacity=".7"');
  s.x(c.ribbon([[w * 0.1, -h * 0.2], [w * 0.3, -h * 0.35]], 2) + c.ribbon([[-w * 0.35, -h * 0.3], [-w * 0.22, -h * 0.12]], 2), shade(col, -0.25), 'opacity=".6"');
  return `${s.out()}<text x="0" y="${-h * 0.4}" text-anchor="middle" font-family="${FONT}" font-size="${h * 0.26}" font-style="italic" fill="${shade(col, -0.55)}">${text}</text>`;
}
/** the small tongues of light the Spirit gives (origin centre) */
export function tongue(c, h = 26) {
  return `<path d="${c.cut(dropPts(c, h, h * 0.5), 0.3, 3)}" fill="${C.lampFlame}"/><path d="${c.cut(dropPts(c, h * 0.55, h * 0.26), 0.2, 3)}" fill="#fff4d2"/>`;
}
/** a crowd member's options (men only) */
export function villager(c, extra = {}) {
  const o = crowdPerson(c, extra);
  return o;
}
export { person, CAST };
