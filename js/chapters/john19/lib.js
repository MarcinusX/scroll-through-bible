// John 19 — the Passion as John tells it: the King crowned with thorns, "Behold the Man", the title in three
// tongues, the seamless tunic, the mother and the beloved disciple, "It is finished", water and light from His
// side, and the new tomb in a garden. Mark 15's Passion sets and cut-outs are reused (Pilate's hall, the square,
// Golgotha from afar, the soldiers, the women) so both Gospels look alike; John's own pieces live here.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, sky, hanging } from '../kit.js';
import { band, stars, cloud, sun as sunCut, rock, bush, grass, house } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { LOOK as L15, skullHill, crossSil, farCity, GOL } from '../mark15/lib.js';
import { LOOK as L3 } from '../mark3/lib.js';
import { flame } from '../mark1/lib.js';

export * from '../mark15/lib.js';
export { nicodemus, NICO } from '../john3/lib.js';
export { verseScroll } from '../john2/lib.js';
export { gardenSet, bigStone, DOOR, STONE, hungStar, spiceJar, scent, medallion, miniHead, skyKeys } from '../mark16/lib.js';
export { waterChunks, waterGlowDef, LIVING, LIVING2 } from '../john7/lib.js';
export { lamb, matzahRound, vignette } from '../mark14/lib.js';
export { lawScroll } from '../john15/lib.js';
export { oilLamp, flame };

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== the cast */

/** Jesus' mother (her blue veil from Mark and John 2), Mary of Clopas, Mary Magdalene, the beloved disciple */
export const MOTHER = L3.mary;
export const CLOPAS = L15.maryJ;
export const MAGDALENE = L15.magdalene;
export const BELOVED = CAST.john;

/** John's Passion skies: bright noon, the golden hour of glory, the stillness after, the Sabbath evening */
export const J19 = {
  court: ['#c8cfd0', '#eadcc4', '#f1dfc2'],
  noon: ['#cbdad8', '#f1e6c8', '#f8e7c3'],
  gold: ['#aaa6ba', '#ebd2a6', '#f6ddaf'],
  still: ['#77738f', '#c9a795', '#e8c7a0'],
  eve: ['#595682', '#cf9687', '#f0bf94'],
  night: ['#1c2046', '#34386a', '#5b5680'],
};

/* ================================================================== paper words and plates */

/** a luminous word plate hung on two strings (origin: the plate's top centre); lines: one or two */
export function wordPlate(c, lines, { size = 26, w, fill = C.cream, rim = C.haloRim, ink = C.ink, glow = true } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 2;
  const hh = lines.length * size * 1.2 + size * 0.9;
  const s = sheet();
  s.p(c.cut([[-ww / 2 - 6, -6], [ww / 2 + 6, -7], [ww / 2 + 7, hh + 6], [-ww / 2 - 6, hh + 7]], 0.5, 7), rim);
  s.p(c.cut([[-ww / 2, 0], [ww / 2, -1], [ww / 2 + 1, hh], [-ww / 2, hh + 1]], 0.5, 7), fill);
  const txt = lines.map((l, i) => `<text x="0" y="${(size * 1.08 + i * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  const str = `<path d="M${-ww / 2 + 14} 0L${-ww / 2 + 14} -900M${ww / 2 - 14} 0L${ww / 2 - 14} -900" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/>`;
  return `${glow ? `<circle cx="0" cy="${hh / 2}" r="${ww * 0.75}" fill="url(#halo-glow)" opacity=".7"/>` : ''}${str}${s.out()}${txt}`;
}

/**
 * The title Pilate wrote, in Hebrew, Latin and Greek, on a whitened board (origin: top centre).
 * Each line is its own group (.l0 Hebrew, .l1 Latin, .l2 Greek) so it can be written line by line.
 */
export const TITLE_LINES = ['ישוע הנצרי מלך היהודים', 'IESVS NAZARENVS REX IVDAEORVM', 'ΙΗΣΟΥΣ Ο ΝΑΖΩΡΑΙΟΣ Ο ΒΑΣΙΛΕΥΣ ΤΩΝ ΙΟΥΔΑΙΩΝ'];
export function titleBoard(c, { w = 560, h = 168 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 8, -8], [w / 2 + 8, -9], [w / 2 + 9, h + 8], [-w / 2 - 8, h + 9]], 0.6, 8), C.wood2);
  s.p(c.cut([[-w / 2, 0], [w / 2, -1], [w / 2 + 1, h], [-w / 2, h + 1]], 0.5, 8), '#fbf6ea');
  s.x(c.ribbon([[-w / 2 + 12, h / 3], [w / 2 - 12, h / 3]], 0.9) + c.ribbon([[-w / 2 + 12, (2 * h) / 3], [w / 2 - 12, (2 * h) / 3]], 0.9), C.stone2, 'opacity=".8"');
  const sz = [30, 25, 19], ink = [C.ink, C.terracotta, C.ink];
  const ls = TITLE_LINES.map((l, i) => {
    const y = (h / 3) * (i + 0.5) + sz[i] * 0.36;
    const attrs = i === 0 ? 'direction="rtl" font-family="Frank Ruhl Libre, David, Times New Roman, serif"' : `font-family="${FONT}" letter-spacing="${i === 1 ? 2 : 1}"`;
    return `<g class="l${i}"><text x="0" y="${y.toFixed(1)}" text-anchor="middle" ${attrs} font-size="${sz[i]}" font-weight="600" fill="${ink[i]}">${l}</text></g>`;
  }).join('');
  return s.out() + ls;
}
/** the same title, tiny, nailed above the head of a cross (origin: centre) */
export function miniTitle(c, w = 40) {
  const s = sheet().p(c.cut(c.rect(-w / 2, -8, w, 16), 0.3, 4), '#fbf6ea');
  s.x(c.ribbon([[-w / 2 + 5, -3.5], [w / 2 - 5, -3.5]], 1.4) + c.ribbon([[-w / 2 + 4, 0.5], [w / 2 - 4, 0.5]], 1.4) + c.ribbon([[-w / 2 + 6, 4.5], [w / 2 - 6, 4.5]], 1.2), C.ink, 'opacity=".6"');
  return `<circle r="${w * 0.9}" fill="url(#halo-glow)" opacity=".7"/>${s.out()}`;
}
/** a red wax seal with a small mark (origin centre); mark: 'eagle' (Pilate's signet) | 'true' (a witness's seal) */
export function waxSeal(c, r = 22, mark = 'true') {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.95, 14, 0.12), 0.6, 4), C.terracotta);
  s.p(c.cut(c.circ(0, 0, r * 0.66, 18), 0.3, 3), shade(C.terracotta, -0.12));
  if (mark === 'eagle') {
    s.x(c.poly([[-r * 0.45, -r * 0.1], [-r * 0.15, -r * 0.22], [0, -r * 0.42], [r * 0.15, -r * 0.22], [r * 0.45, -r * 0.1], [r * 0.12, r * 0.02], [r * 0.08, r * 0.38], [-r * 0.08, r * 0.38], [-r * 0.12, r * 0.02]]), shade(C.terracotta, 0.3));
  } else {
    s.x(c.ribbon([[-r * 0.32, 0], [-r * 0.08, r * 0.26], [r * 0.36, -r * 0.26]], r * 0.12), shade(C.terracotta, 0.35));
  }
  return s.out();
}
/** a Roman coin with Caesar's laureate head in profile (origin centre) */
export function caesarCoin(c, r = 90) {
  const s = sheet();
  const gold = mix(C.sun, C.ochre, 0.3);
  s.p(c.cut(c.circ(0, 0, r, 48), 0.6, 6), shade(gold, -0.1));
  s.p(c.cut(c.circ(0, 0, r * 0.9, 44), 0.5, 6), gold);
  let dots = '';
  for (let i = 0; i < 40; i++) { const a = (i / 40) * PI * 2; dots += c.poly(c.circ(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, r * 0.018, 5)); }
  s.x(dots, shade(gold, -0.3), 'opacity=".6"');
  // the bust, facing right: neck, head with a heavy jaw, a laurel wreath
  const k = r / 90;
  const P = (pts) => pts.map(([x, y]) => [x * k, y * k]);
  s.p(c.cut(P([[-30, 56], [-22, 30], [-20, 10], [-24, -12], [-20, -34], [-6, -46], [12, -46], [26, -36], [30, -22], [34, -10], [38, -4], [32, 0], [34, 8], [30, 12], [30, 22], [22, 28], [12, 30], [8, 44], [20, 62], [-30, 62]]), 0.5, 4), shade(gold, -0.16));
  s.x(c.ribbon(P([[4, -4], [10, 2], [18, 2]]), 1.6 * k) + c.ribbon(P([[-12, 30], [-2, 42], [10, 46]]), 1.4 * k), shade(gold, -0.4), 'opacity=".7"');
  let leaves = '';
  for (let i = 0; i < 7; i++) { const a = PI * (1.05 + i * 0.12), x = Math.cos(a) * 30 - 2, y = Math.sin(a) * 30 - 12; leaves += c.cut(c.ell(x * k, y * k, 6 * k, 3 * k, 8, a + PI / 2.4), 0.2, 2); }
  s.p(leaves, mix(C.moss, gold, 0.3));
  s.x(c.poly(c.circ(22 * k, -20 * k, 2.2 * k, 6)), shade(gold, -0.4));
  // the legend around the rim, letter by letter
  const legend = 'TI·CAESAR·DIVI·AVG·F·AVGVSTVS';
  let txt = '';
  const n = legend.length;
  for (let i = 0; i < n; i++) {
    const a = PI * (0.78 + (i / (n - 1)) * 1.44) , x = Math.cos(a) * r * 0.78, y = Math.sin(a) * r * 0.78;
    txt += `<text x="0" y="0" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((a * 180) / PI + 90).toFixed(1)})" text-anchor="middle" font-family="${FONT}" font-size="${(11 * k).toFixed(1)}" font-weight="600" fill="${shade(gold, -0.42)}">${legend[i]}</text>`;
  }
  return `<circle r="${r * 1.3}" fill="url(#warm-glow)" opacity=".5"/>${s.out()}${txt}`;
}
/** a small mosaic of the Pavement (origin: top centre), with both names beneath on paper strips */
export function pavementPlate(c, { w = 250, h = 120 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 8, -8], [w / 2 + 8, -8], [w / 2 + 8, h + 8], [-w / 2 - 8, h + 8]], 0.5, 6), C.stone2);
  const cols = [C.terracotta, C.ochre, C.cream, C.dustyBlue, C.stone, mix(C.ochre, C.cream, 0.5)];
  const t = 12;
  const by = {};
  for (let y = 0; y < h; y += t) for (let x = -w / 2; x < w / 2; x += t) {
    const cx = x + t / 2, cy = y + t / 2;
    const d = Math.max(Math.abs(cx) / (w / 2), Math.abs(cy - h / 2) / (h / 2));
    const rr = Math.hypot(cx / 1.6, cy - h / 2);
    let col = cols[4];
    if (d > 0.86) col = cols[0];
    else if (d > 0.76) col = cols[2];
    else if (rr < 14) col = cols[1];
    else if (rr < 26) col = cols[2];
    else if (rr < 38) col = cols[3];
    else if ((Math.floor(x / t) + Math.floor(y / t)) % 2 === 0 && d > 0.6) col = cols[5];
    (by[col] = by[col] || []).push(c.cut(c.rect(x + 1, y + 1, t - 2, t - 2), 0.4, 3));
  }
  Object.entries(by).forEach(([col, ds]) => s.p(ds.join(''), col));
  return s.out();
}
/** a band of mosaic tiles along a floor edge (x0 → x1, top y, height h) */
export function mosaicBand(c, x0, x1, y, h = 14) {
  const s = sheet();
  s.p(c.cut(c.rect(x0, y, x1 - x0, h), 0.4, 8), C.stone2);
  const t = h - 4;
  const a = [], b = [], d = [];
  let i = 0;
  for (let x = x0 + 2; x < x1 - t; x += t + 2, i++) (i % 3 === 0 ? a : i % 3 === 1 ? b : d).push(c.cut(c.rect(x, y + 2, t, t), 0.3, 3));
  s.p(a.join(''), C.terracotta).p(b.join(''), C.cream).p(d.join(''), C.ochre);
  return s.out();
}

/* ================================================================== props */

/** the seamless tunic, woven from the top down: { base, rows: [markup…] } (origin: the collar centre) */
export function wovenTunic(c, { w = 150, h = 230, col = C.linen } = {}) {
  const sw = w * 0.95; // sleeve span
  const outline = [[-w * 0.16, 0], [w * 0.16, 0], [sw / 2 + 18, 12], [sw / 2 + 24, h * 0.3], [w / 2 + 2, h * 0.32], [w / 2 + 8, h], [-w / 2 - 8, h], [-w / 2 - 2, h * 0.32], [-sw / 2 - 24, h * 0.3], [-sw / 2 - 18, 12]];
  const base = sheet().p(c.cut(outline, 0.6, 7), mix(col, C.stone, 0.35)).x(c.cut(c.ell(0, 4, w * 0.12, 7, 12), 0.2, 3), shade(col, -0.3), 'opacity=".5"').out();
  const halfAt = (y) => (y < h * 0.3 ? sw / 2 + 18 + (y / (h * 0.3)) * 6 : w / 2 + 2 + ((y - h * 0.3) / (h * 0.7)) * 6);
  const rows = [];
  const n = 16, rh = h / n;
  for (let i = 0; i < n; i++) {
    const y0 = i * rh + 1, hw = halfAt(y0 + rh / 2) - 2;
    const r = sheet();
    r.p(c.cut(c.rect(-hw, y0, hw * 2, rh + 0.5), 0.3, 6), col);
    let wv = '';
    for (let x = -hw + (i % 2 ? 6 : 1); x < hw - 4; x += 10) wv += c.poly(c.rect(x, y0 + rh * 0.35, 5, rh * 0.3));
    r.x(wv, shade(col, -0.1));
    rows.push(r.out());
  }
  return { base, rows, h };
}
/** a shuttle for the loom (origin centre) */
export function shuttle(c, w = 44) {
  return sheet().p(c.cut([[-w / 2, 0], [-w / 4, -6], [w / 4, -6], [w / 2, 0], [w / 4, 6], [-w / 4, 6]], 0.3, 4), C.wood3).x(c.ribbon([[-w / 4, 0], [w / 2 + 16, 3]], 1.2), C.linen2).out();
}
/** Jesus' rose mantle spread out, cut into four parts (each .q0-.q3, origin: the whole cloth's centre) */
export function mantleQuarters(c, w = 170, h = 110) {
  const col = C.jesusMantle;
  const q = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => {
    const pts = [[0, 0], [sx * w / 2, 0], [sx * w / 2, sy * h / 2], [0, sy * h / 2]].map(([x, y]) => [x * 0.98, y * 0.98]);
    const s = sheet().p(c.cut(pts, 0.8, 7), i % 2 ? shade(col, -0.05) : col);
    s.x(c.ribbon([[sx * 8, sy * 12], [sx * (w / 2 - 12), sy * 14]], 1.2), shade(col, -0.18), 'opacity=".6"');
    return `<g class="q${i}">${s.out()}</g>`;
  });
  return q.join('');
}
/** a sponge on a stalk of hyssop (origin: the hand end, stalk along -y) */
export function hyssop(c, len = 200) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [4, -len * 0.5], [2, -len], 10), 2.6), C.moss);
  let lv = '';
  for (let i = 0; i < 8; i++) { const y = -len * (0.62 + i * 0.045), sd = i % 2 ? 1 : -1; lv += c.cut(c.ell(2 + sd * 6, y, 6, 2.6, 8, sd * 0.6), 0.2, 2); }
  s.p(lv, C.sage);
  s.p(c.cut(c.blob(2, -len - 8, 10, 8, 9, 0.25), 0.4, 3), C.sand2);
  s.x(c.poly(c.circ(-1, -len - 10, 2, 5)) + c.poly(c.circ(5, -len - 6, 1.6, 5)), shade(C.sand2, -0.2));
  return s.out();
}
/** a big jar of sour wine (origin: base) */
export function wineJar(c, h = 70) {
  const col = mix(C.pot, C.clay, 0.4);
  const s = sheet();
  s.p(c.cut([[-14, -h], [14, -h], [12, -h + 8], [24, -h + 26], [24, -16], [14, 0], [-14, 0], [-24, -16], [-24, -h + 26], [-12, -h + 8]], 0.5, 5), col);
  s.p(c.cut(c.ell(0, -h, 14, 4, 12), 0.2, 3), shade(C.plumRobe, -0.45));
  s.x(c.ribbon([[-22, -h + 34], [22, -h + 34]], 1.6) + c.ribbon([[-23, -h + 42], [23, -h + 42]], 1.2), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** an empty water drop outline (thirst); origin centre */
export function emptyDrop(c, r = 30) {
  const pts = [[0, -r * 1.5], ...c.arc(0, 0, r, r, -PI * 0.15, PI * 1.15, 16)];
  const inner = [[0, -r * 1.12], ...c.arc(0, 0.1 * r, r * 0.72, r * 0.72, -PI * 0.15, PI * 1.15, 14)];
  return sheet().p(c.cut(pts, 0.3, 4) + c.hole(inner, 0.2, 4), C.lake2).out();
}
/** a bronze weight marked with a number (origin: base centre) */
export function weightStone(c, label = '100', w = 60) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 8, -w * 0.62], [-w / 6, -w * 0.7], [-w / 6, -w * 0.84], [w / 6, -w * 0.84], [w / 6, -w * 0.7], [w / 2 - 8, -w * 0.62], [w / 2, 0]], 0.4, 5), mix(C.ochre, C.rock3, 0.4));
  return s.out() + `<text x="0" y="${(-w * 0.22).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${(w * 0.34).toFixed(0)}" font-weight="600" fill="${C.cream}">${label}</text>`;
}
/** a small ring of light-points around a centre (for "all is finished"): each point .p0…; origin centre */
export function lightRing(c, r = 70, n = 12) {
  let out = `<g class="ring" opacity="0"><path d="${c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 48), 2.2)}" fill="${C.haloRim}"/></g>`;
  for (let i = 0; i < n; i++) {
    const a = -PI / 2 + (i / n) * PI * 2;
    out += `<g class="p${i}" opacity="0" transform="translate(${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)})"><circle r="16" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 7, 2.6, 4, 0))}" fill="${C.star}"/></g>`;
  }
  return out;
}
/** a little house far away whose window can light up (origin: its door foot). returns markup with .win and .wglow */
export function homeLight(c, { w = 70, h = 52, tint = 0 } = {}) {
  const T = (col) => mix(col, C.duskViolet, tint);
  const m = house(c, -w / 2, 0, w, h, { wall: T(C.plaster), shadow: T(C.plaster2), stairs: false });
  const wx = -w / 2 + w * 0.6 + w * 0.08, wy = -h * 0.72 + h * 0.09;
  return `<circle class="wglow" cx="${wx.toFixed(1)}" cy="${wy.toFixed(1)}" r="60" fill="url(#warm-glow)" opacity="0"/>${m}<path class="win" d="${c.poly(c.rect(-w / 2 + w * 0.6, -h * 0.72, w * 0.16, h * 0.18))}" fill="${C.lampFlame}" opacity="0"/>`;
}
/** a row of footlights along the front of the stage (each .f0… with a flame, origin at the lip) */
export function footlights(c, xs) {
  return xs.map((x, i) => `<g class="f${i}" transform="translate(${x} 0)"><circle cy="-14" r="46" fill="url(#warm-glow)" class="fg" opacity="0"/><g class="ff" opacity="0" transform="translate(0 -6)">${flame(c, 16)}</g>${sheet().p(c.cut([[-12, 0], [-9, -6], [9, -6], [12, 0]], 0.3, 3), C.sun).out()}</g>`).join('');
}

/* ================================================================== sets */

/**
 * Nearer to the cross: the hill fills the lower stage, the central cross stands tall (a quiet silhouette with
 * a halo), the two others lower at the sides; the city far off. returns { sk, hangL, far, hillL, crossC, crossL,
 * crossR, H, top, P, fx, fg } — the three crosses are added at their feet (x, y) and never need posing.
 */
export const NEAR = { x: 800, top: 556, H: 340, L: [470, 586, 220], R: [1130, 586, 220], col: '#4a3639' };
export function crossNearSet(S, { pal = J19.gold, tint = 0, figure = true, farCol } = {}) {
  const c = S.c;
  const T = (col) => (tint ? mix(col, C.duskViolet, tint) : col);
  const sk = sky(S, pal);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 560, amps: [14, 7, 3], lens: [900, 320, 120], color: farCol || T(mix(C.hillFar, C.stone2, 0.45)) }).markup);
  far.add(`<g transform="translate(250 566)">${farCity(c, 0.62, { col: T(mix(C.stone, C.rock, 0.3)) })}</g>`);
  const hillL = S.layer({ par: 0.2, sh: 3 });
  hillL.add(`<g transform="translate(${NEAR.x} ${NEAR.top})">${skullHill(c, { w: 1500, h: 300, col: T(mix(C.rock2, C.dune, 0.35)) })}</g>`);
  const crossL = hillL.add(`<g transform="translate(${NEAR.L[0]} ${NEAR.L[1]})">${crossSil(c, { h: NEAR.L[2], figure, col: NEAR.col })}</g>`);
  const crossR = hillL.add(`<g transform="translate(${NEAR.R[0]} ${NEAR.R[1]})">${crossSil(c, { h: NEAR.R[2], figure, col: NEAR.col })}</g>`);
  const glowL = S.layer({ par: 0.2, sh: 1, flat: true });
  const crossC = S.layer({ par: 0.2, sh: 3 }).add(`<g transform="translate(${NEAR.x} ${NEAR.top})">${crossSil(c, { h: NEAR.H, halo: true, figure, col: NEAR.col })}</g>`);
  const slope = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(690, [8, 3], [800, 220]);
  slope.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1.2), T(mix(C.sand2, C.rock2, 0.4))).out());
  slope.add(grass(c, { x0: -600, x1: 2300, y: 690, fn: gfn, n: 26, h: 12, color: T(mix(C.olive, C.rock3, 0.3)) }) + rock(c, 250, 700, 110, 36, T(C.rock2)) + rock(c, 1380, 704, 130, 40, T(C.rock3)));
  const P = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.56, sh: 4 });
  const fg = S.layer({ par: 0.95, sh: 7 });
  fg.add(rock(c, 60, 990, 300, 110, T(C.rock2)) + bush(c, 1580, 960, 220, T(mix(C.moss, C.rock3, 0.3))) + rock(c, 1760, 990, 260, 90, T(C.rock3)));
  const hd = crossC.querySelector('.hd'), hl = crossC.querySelector('.hl');
  const u = NEAR.H / 240;
  const HDY = -NEAR.H + 52 * u - 2 * u;           // the head pivot, relative to the cross foot
  const head = [NEAR.x, NEAR.top + HDY - 11 * u];   // the head centre in world units
  return { sk, hangL, far, hillL, glowL, crossC, crossL, crossR, slope, P, fx, fg, hd, hl, HDY, head, u };
}
/** hide the storm clouds of mark15's golgothaSet (John's Golgotha stands under a clear, golden sky) */
export function clearClouds(G) { G.clouds.forEach((cl) => pose(cl.el, { x: cl.x, y: -3000, o: 0 })); }
/** light paper clouds on the fly lines of a set's hanging layer */
export function lightClouds(S, L, list = [[420, 230, 190], [1180, 200, 150]], col = C.cream, col2 = C.dawn) {
  const c = S.c;
  return list.map(([x, y, w], i) => ({ x, y, el: hanging(L, cloud(c, w, col, col2), { x, y, len: 700 }) }));
}
export { GOL, tr, stars, sunCut, band };

/* ================================================================== the square before the praetorium */

import { crowdPerson, lerp } from '../kit.js';
import { priest as priestM, guard as guardM } from '../mark15/lib.js';
/**
 * The crowd below mark15's platform (squareSet): three rows of townsfolk, two chief priests at the front left
 * and two temple officers at the front right. Returns { people, pr, of } — every member { p, x, y, s, flip, i, seed }.
 */
export function squareCrowd(S, L) {
  const c = S.c;
  const ph = S.portrait;   // phone: the priests and the officers stand nearer the middle, so both groups are in view
  const gapL = ph ? 550 : 480, gapR = ph ? 1060 : 1150;
  const rows = [
    { y: 648, s: 0.72, n: 13, x0: 180, x1: 1420 },
    { y: 702, s: 0.86, n: 11, x0: 150, x1: 1450 },
    { y: 766, s: 1.02, n: 9, x0: 120, x1: 1480 },
  ];
  const all = [];
  rows.forEach((r, ri) => {
    for (let i = 0; i < r.n; i++) {
      const x = lerp(r.x0, r.x1, (i + c.rr(0.2, 0.8)) / r.n);
      if (ri === 2 && (Math.abs(x - gapL) < 110 || Math.abs(x - gapR) < 110)) continue;
      all.push({ x, y: r.y + c.rr(-4, 4), s: r.s * c.rr(0.92, 1.06), ri, opts: crowdPerson(c) });
    }
  });
  all.sort((a, b) => a.y - b.y);
  const people = all.map((m, i) => ({ ...m, p: S.puppet(L.add(person(c, m.opts))), i, flip: m.x > 800, seed: c.rr(0, 9), shout: c.chance(0.7) }));
  const pr = [0, 1].map((i) => ({ i, p: S.puppet(L.add(priestM(c, i))), x: (ph ? [500, 600] : [420, 530])[i], y: 772 - i * 6 }));
  const of = [0, 1].map((i) => ({ i, p: S.puppet(L.add(guardM(c, i))), x: (ph ? [1015, 1105] : [1110, 1210])[i], y: 770 - i * 4 }));
  return { people, pr, of };
}
/** an arched doorway in the praetorium's wall with a half-drawn curtain (origin: threshold centre) */
export function doorway(c, w = 110, h = 176) {
  const s = sheet();
  const arch = [[-w / 2, 0], [-w / 2, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [w / 2, 0]];
  s.p(c.cut(arch.map(([x, y]) => [x * 1.16, y * 1.06]), 0.5, 6), C.stone2);
  s.p(c.cut(arch, 0.4, 6), mix(C.soilRich, C.plumRobe, 0.2));
  s.p(c.cut([[-w / 2, -h + w / 2 - 20], [-w / 2 + 34, -h + w / 2 - 30], [-w / 2 + 22, -60], [-w / 2 + 30, 0], [-w / 2, 0]], 0.5, 6) + c.cut([[w / 2, -h + w / 2 - 20], [w / 2 - 34, -h + w / 2 - 30], [w / 2 - 22, -60], [w / 2 - 30, 0], [w / 2, 0]], 0.5, 6), C.curtain2);
  return s.out();
}
/** a tiny level balance with both pans empty — "I find no guilt in Him" (origin centre) */
export function noGuilt(c, r = 22) {
  const s = sheet();
  s.p(c.cut(c.rect(-1.6, -r * 0.9, 3.2, r * 1.6), 0.2, 3) + c.cut(c.rect(-r * 0.5, r * 0.64, r, 3), 0.2, 3), C.wood2);
  s.p(c.cut(c.rect(-r, -r * 0.84, r * 2, 3), 0.2, 3), C.sun);
  const pan = (x) => c.ribbon([[x, -r * 0.8], [x - r * 0.3, -r * 0.1]], 0.9) + c.ribbon([[x, -r * 0.8], [x + r * 0.3, -r * 0.1]], 0.9);
  s.x(pan(-r * 0.86) + pan(r * 0.86), C.inkSoft, 'opacity=".6"');
  s.p(c.cut([...c.arc(-r * 0.86, -r * 0.1, r * 0.36, r * 0.16, 0, PI, 8)], 0.2, 3) + c.cut([...c.arc(r * 0.86, -r * 0.1, r * 0.36, r * 0.16, 0, PI, 8)], 0.2, 3), shade(C.sun, -0.1));
  return s.out();
}

/* ================================================================== the hall: power from above */

export { bigBalance } from '../john2/lib.js';
export { HP } from '../mark14/lib.js';
/** a little golden key (origin centre) */
export function keyGlyph(c, col = C.sun) {
  return sheet().p(c.cut(c.circ(-8, 0, 6, 12), 0.2, 3) + c.cut([[-3, -2], [12, -2], [12, 2], [-3, 2]], 0.2, 3) + c.cut([[7, 2], [10, 2], [10, 7], [7, 7]], 0.2, 2) + c.cut([[2, 2], [5, 2], [5, 6], [2, 6]], 0.2, 2), col).x(c.poly(c.circ(-8, 0, 2.4, 8)), C.cream).out();
}
/** a soft shaft of light from above (origin: where it lands, centre); w0 top width, w1 bottom width */
export function lightShaft(c, { w0 = 60, w1 = 220, h = 900, col = '#fff3cf' } = {}) {
  return `<path d="${c.poly([[-w0 / 2, -h], [w0 / 2, -h], [w1 / 2, 0], [-w1 / 2, 0]])}" fill="${col}" opacity=".32"/><path d="${c.poly([[-w0 / 4, -h], [w0 / 4, -h], [w1 / 4, 0], [-w1 / 4, 0]])}" fill="${col}" opacity=".3"/><ellipse cx="0" cy="0" rx="${w1 * 0.6}" ry="${w1 * 0.12}" fill="url(#halo-glow)"/>`;
}
/** a stone weight (origin: base centre); dark: the heavier guilt */
export function guiltStone(c, r = 20, dark = false) {
  const col = dark ? mix(C.storm2, C.ink, 0.35) : C.rock2;
  return sheet().p(c.cut(c.blob(0, -r * 0.8, r, r * 0.8, 10, 0.18), 0.6, 4), col).x(c.ribbon([[-r * 0.5, -r * 1.1], [r * 0.2, -r * 1.3]], 1.6), shade(col, 0.2), 'opacity=".5"').out();
}

/* ================================================================== Gabbatha: the hour and the day */

import { lamb as lambM, matzahRound as matzahM } from '../mark14/lib.js';
/** a hanging card: the sun-dial at the sixth hour and the Passover lamb with unleavened bread (origin: top centre) */
export function hourCard(c, { w = 250, h = 130 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 6, -6], [w / 2 + 6, -7], [w / 2 + 7, h + 6], [-w / 2 - 6, h + 7]], 0.5, 6), C.haloRim);
  s.p(c.cut([[-w / 2, 0], [w / 2, -1], [w / 2 + 1, h], [-w / 2, h + 1]], 0.5, 6), C.cream);
  // the dial: a half-disc with hour lines, the gnomon's shadow straight up at VI
  const dx = -w / 4 + 4, dy = h - 26, R = 52;
  s.p(c.cut([...c.arc(dx, dy, R, R, PI, 2 * PI, 18), [dx + R, dy + 6], [dx - R, dy + 6]], 0.3, 4), C.stone);
  let ln = '';
  for (let i = 1; i < 12; i++) { const a = PI + (i / 12) * PI; ln += c.ribbon([[dx + Math.cos(a) * 12, dy + Math.sin(a) * 12], [dx + Math.cos(a) * (R - 6), dy + Math.sin(a) * (R - 6)]], i === 6 ? 2.2 : 1); }
  s.x(ln, C.inkSoft, 'opacity=".55"');
  s.p(c.cut([[dx - 3, dy], [dx + 3, dy], [dx + 1.5, dy - R + 4], [dx - 1.5, dy - R + 4]], 0.2, 3), C.ink);
  const txt = `<text x="${dx}" y="${dy - R - 6}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" font-weight="600" fill="${C.terracotta}">VI</text>`;
  return `${s.out()}${txt}<g transform="translate(${w / 4 + 6} ${h - 22}) scale(1.05)">${lambM(c)}</g><g transform="translate(${w / 4 - 30} ${h - 30}) scale(0.62)">${matzahM(c)}</g>`;
}
