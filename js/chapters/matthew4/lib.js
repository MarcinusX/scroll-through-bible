// Matthew 4 — the cast and cut-outs of this chapter: the Judean desert (the same wilderness as Mark 1),
// the tempter in his shadow, a written scroll that unrolls on its strings, the pinnacle of the Temple,
// the very high mountain above the clouds with the kingdoms of the world, the lake of Galilee,
// the map of Zebulun and Naphtali, a paper-doll chain of "fishers of men", crowds as sprites.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, town, sun, moon, cloud, stars, rock, grass, olive, cypress, bush, reeds } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { es, seg, ease, bump } from '../../core/anim.js';
import { scrub, acacia } from '../mark1/lib.js';

export { dove, flapWings, scrub, acacia, wings, breadBasket, jug, tallyStone, hand, headAt, voiceRings, hang2, castNet, netDrape, ZEBEDEE, JOHN_B, prisonWall, bars, signpost, shadowShards, synagogueInterior, crutch, mat, bubble, sparkle, plate, paperLabel, camel, POSSESSED, walledCity } from '../mark1/lib.js';
export { kf, moving, loaf, thought, wordSlip, bowl, spark, dust, cup, rolledMat, johnsDisciple, heart, scrap } from '../mark2/lib.js';
export { hungWord, rayBurst, glowDisc, darkSheet, goldWord, radiance } from '../john1/lib.js';
export { jerusalem, sanctuary, cityWall, portico } from '../mark11/lib.js';
export { angel, crown, lightCrown, globe, emptyBowl, cloth } from '../mark8/lib.js';
export { kingdomGate } from '../mark12/lib.js';
export { nameTag } from '../mark3/lib.js';
export { folk, group } from '../john6/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== the cast */
/** the tempter exactly as Mark 1 drew him: a hooded figure of dusk-coloured fur, a pale grey face */
export const TEMPTER = { robe: '#3d3650', fur: true, hairStyle: 'wrap', veil: '#2b2640', veil2: '#211c33', skin: '#a39cb0', hair: '#211c33', beard: 'none', eyes: 'open' };
export const ANGEL = { robe: C.linen, mantle: C.skyVeil, hairStyle: 'long', hair: C.wheat2, skin: C.skin, beard: 'none' };
/** the jagged shadow he casts around himself (origin at his feet) */
export function tempterAura(c, r = 130) {
  return `<path d="${c.cut(c.star(0, -110, r, r * 0.62, 13, 0.2), 3, 8)}" fill="#1e1a2e" opacity=".45"/>`;
}

/* ================================================================== skies */
export const DESERT = ['#d7dccf', '#f1dcb5', '#f5dcb2'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = [C.night2, C.night, '#4a4f86'];
export const DAWN = ['#b8a9c9', '#f0bfa2', '#f7d9b4'];
export const DAY = ['#c2dcd8', '#e8ecd9', '#f5ebd1'];
export const HIGH = ['#a9c6d6', '#d8e6e4', '#f1ead6'];     // thin air above the clouds

/* ================================================================== the desert of Judea */
/**
 * The same wilderness as Mark 1: dunes, rocky hills, an acacia, scrub; sand where people stand (GY).
 * Adds sky (+ night and dusk skies that fade), the hanging sun and moon, and the ground. Returns handles.
 */
export function desertSet(S, { skyCols = DESERT, night = true, dusk = true, sunAt = [1200, 170] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const duskL = dusk ? sky(S, DUSK, { name: 'dusk' }).layer : null;
  const nightL = night ? sky(S, NIGHT, { name: 'night' }).layer : null;
  let starL = null;
  if (night) { starL = S.layer({ par: 0.02, sh: 1, flat: true }); starL.add(stars(c, { x0: -600, x1: 2200, y0: -600, y1: 520, n: 150 })); }
  duskL && duskL.fade(0); nightL && nightL.fade(0); starL && starL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 900 });
  const moonEl = night ? hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 36)}`, { x: 800, y: -400, len: 900 }) : null;
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [30, 12, 4], lens: [800, 300, 110], color: mix(C.dune, C.duskViolet, 0.35) }).markup);
  const mid = S.layer({ par: 0.25, sh: 3 });
  mid.add(band(c, { y: 560, amps: [26, 10, 3], lens: [700, 260, 100], color: C.dune }).markup);
  mid.add(rock(c, 250, 566, 180, 90, C.rock2) + rock(c, 1420, 570, 160, 70, C.rock3) + acacia(c, 1180, 575, 0.7) + acacia(c, 330, 572, 0.55));
  const G = S.layer({ par: 0.5, sh: 3 });
  const gfn = c.wave(640, [10, 4], [700, 200]);
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand);
  let peb = '';
  for (let i = 0; i < 40; i++) peb += c.cut(c.blob(c.rr(-600, 2200), c.rr(660, 900), c.rr(3, 8), c.rr(2, 4), 7, 0.2), 0.3, 3);
  gs.x(peb, C.rock2, 'opacity=".6"');
  G.add(gs.out());
  G.add(scrub(c, 470, 660, 34) + scrub(c, 1130, 668, 30) + rock(c, 1300, 704, 120, 54, C.rock));
  return { c, sk, duskL, nightL, starL, hangL, sunEl, moonEl, mid, G, gfn };
}
/** the foreground rocks and scrub of the desert (one sheet, par 0.9) */
export function desertFront(S) {
  const c = S.c;
  const fg = S.layer({ par: 0.9, sh: 7 });
  fg.add(rock(c, 110, 985, 290, 120, C.rock3) + rock(c, 1510, 980, 260, 110, C.rock2) + scrub(c, 330, 950, 60) + scrub(c, 1290, 958, 56));
  return fg;
}
/** the desert stones that the tempter would turn into bread: a round grey stone (origin: bottom centre) */
export function stoneLoaf(c, r = 20, col = C.rock2) {
  const s = sheet();
  s.p(c.cut([[-r, 0], ...c.arc(0, 0, r, r * 0.62, PI, 2 * PI, 12), [r, 0], [r * 0.6, 3], [-r * 0.6, 3]], 0.6, 4), col);
  s.x(c.ribbon(c.arc(-r * 0.2, -r * 0.35, r * 0.34, r * 0.16, PI * 1.1, PI * 1.7, 5), 1.6), shade(col, 0.3), 'opacity=".7"');
  return s.out();
}
/** the same stone as a loaf of bread (origin: bottom centre) */
export function breadLoaf(c, r = 20, col = C.wheat2) {
  const s = sheet();
  s.p(c.cut([[-r, 0], ...c.arc(0, 0, r, r * 0.66, PI, 2 * PI, 12), [r, 0], [r * 0.6, 3], [-r * 0.6, 3]], 0.5, 4), col);
  s.p(c.cut([[-r * 0.8, -r * 0.2], ...c.arc(0, -r * 0.18, r * 0.8, r * 0.4, PI, 2 * PI, 10)], 0.3, 4), shade(col, 0.12));
  s.x(c.ribbon([[-r * 0.4, -r * 0.5], [-r * 0.2, -r * 0.2]], 2) + c.ribbon([[0, -r * 0.6], [r * 0.2, -r * 0.25]], 2) + c.ribbon([[r * 0.4, -r * 0.5], [r * 0.56, -r * 0.2]], 2), shade(col, -0.25), 'opacity=".7"');
  return s.out();
}

/* ================================================================== "it is written": a scroll on strings */
/**
 * A written scroll in three pieces so it unrolls on the compositor: the parchment (origin: top edge,
 * scale it with sy), the top rod (with its two strings) and the bottom rod. lines: [title, line, …]
 */
export function writtenScroll(c, lines, { w = 400, h = 190, size = 25, title = C.terracotta, ink = C.ink, len = 900 } = {}) {
  const rod = () => sheet()
    .p(c.cut([[-w / 2, -9], [w / 2, -9], [w / 2, 9], [-w / 2, 9]], 0.3, 6), C.parchment)
    .p(c.cut([[-w / 2 - 2, -5], [-w / 2 - 24, -5], [-w / 2 - 24, 5], [-w / 2 - 2, 5]], 0.2, 5) + c.cut([[w / 2 + 2, -5], [w / 2 + 24, -5], [w / 2 + 24, 5], [w / 2 + 2, 5]], 0.2, 5), C.wood2)
    .p(c.cut(c.ell(-w / 2 - 28, 0, 6, 11, 10), 0.2, 3) + c.cut(c.ell(w / 2 + 28, 0, 6, 11, 10), 0.2, 3), C.wood)
    .x(c.ribbon([[-w / 2, 3], [w / 2, 3]], 2), shade(C.parchment, -0.18)).out();
  const s = sheet();
  s.p(c.cut([[-w / 2 + 4, 0], [w / 2 - 4, 0], [w / 2 - 6, h], [-w / 2 + 6, h]], 0.5, 8), C.parchment);
  s.x(c.ribbon([[-w / 2 + 14, 8], [-w / 2 + 14, h - 8]], 1.2) + c.ribbon([[w / 2 - 14, 8], [w / 2 - 14, h - 8]], 1.2), C.terracotta, 'opacity=".35"');
  const n = lines.length;
  const gap = (h - 24) / n;
  const txt = lines.map((l, i) => `<text x="0" y="${(14 + gap * (i + 0.5) + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${i ? size : size * 0.92}" font-style="italic" fill="${i ? ink : title}">${l}</text>`).join('');
  const strings = `<path d="M${-w / 2 + 20} ${-len - 1400}V0M${w / 2 - 20} ${-len - 1400}V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return { sheet: s.out() + txt, top: strings + rod(), bottom: rod(), h };
}
/** place a writtenScroll: k = 0 rolled up … 1 open; y = the top rod */
export function setScroll(p, x, y, k, o = 1, r = 0) {
  const vis = o > 0.01 ? 1 : 0;
  pose(p.top, { x, y, r, o: vis });
  pose(p.sheet, { x, y, sy: 0.02 + k * 0.98, r, o: vis && k > 0.01 ? 1 : 0 });
  pose(p.bottom, { x, y: y + p.h * (0.02 + k * 0.98), r, o: vis });
}
/** add a writtenScroll's pieces to a layer; returns { top, sheet, bottom, h } */
export function addScroll(L, c, lines, o = {}) {
  const m = writtenScroll(c, lines, o);
  const sh = L.add(`<g>${m.sheet}</g>`);
  const bottom = L.add(`<g>${m.bottom}</g>`);
  const top = L.add(`<g>${m.top}</g>`);
  return { top, sheet: sh, bottom, h: m.h };
}

/* ================================================================== light from above */
/** a shaft of pale-gold light coming down from the top of the box (origin: its foot) */
export function lightShaft(c, { w0 = 40, w1 = 170, h = 1400, col = '#fff3cf', o = 0.4 } = {}) {
  return `<path d="${c.poly([[-w0, -h], [w0, -h], [w1, 0], [-w1, 0]])}" fill="${col}" opacity="${o}"/><path d="${c.poly([[-w0 * 0.5, -h], [w0 * 0.5, -h], [w1 * 0.5, 0], [-w1 * 0.5, 0]])}" fill="${col}" opacity="${o * 0.9}"/><ellipse cx="0" cy="0" rx="${w1 * 1.2}" ry="${w1 * 0.3}" fill="url(#warm-glow)" opacity=".9"/>`;
}
/** a little slip of the Word: a golden glowing strip with a line of writing (origin centre) */
export function goldSlip(c, w = 40) {
  const s = sheet().p(c.cut([[-w / 2, -8], [w / 2, -9], [w / 2 + 1, 8], [-w / 2 - 1, 9]], 0.4, 6), mix(C.halo, C.cream, 0.4));
  let d = '';
  let x = -w / 2 + 5;
  while (x < w / 2 - 6) { const l = c.rr(4, 10); d += c.ribbon([[x, c.rr(-1, 1)], [Math.min(x + l, w / 2 - 5), c.rr(-1, 1)]], 1.8); x += l + 3; }
  s.x(d, C.sunDeep, 'opacity=".75"');
  return `<circle r="${w * 0.9}" fill="url(#warm-glow)" opacity=".8"/>${s.out()}`;
}

/* ================================================================== sprites & groups */
/** bake a head tilt (degrees, + = down) into a person's markup, for still groups and sprites */
export function tiltHead(markup, deg) {
  return deg ? markup.replace('<g class="headr">', `<g class="headr" transform="rotate(${deg})">`) : markup;
}
/** bake arm angles into a person's markup (degrees raised forward, as Puppet.set) */
export function bakeArms(markup, armF = 0, armB = 0) {
  let m = markup;
  if (armF) m = m.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-armF})">`);
  if (armB) m = m.replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB})">`);
  return m;
}
/** a still group of people as one cut-out: members [{x, y, s, flip, o, head, armF, armB}] */
export function pose3(c, members) {
  return members.slice().sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${bakeArms(tiltHead(person(c, m.o), m.head || 0), m.armF || 0, m.armB || 0)}</g>`).join('');
}
/** a man / woman of the crowd (men are never veiled) */
export function folk4(c, man = null, extra = {}) {
  const o = crowdPerson(c);
  const isMan = man === null ? o.hairStyle !== 'veil' : man;
  if (isMan && o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  if (!isMan) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}

/* ================================================================== the pinnacle of the Temple */
export const GOLDEN = ['#e6c9a0', '#f2d3a2', '#f7e2bd'];
const ASHLAR = mix(C.stone, C.sand, 0.35);
/**
 * The south-east corner of the Temple platform seen close, from the air beside it: the great wall of
 * drafted Herodian blocks (x ≥ edge), its shaded east face receding, the raised corner where one can stand
 * (top at `top`), the roofs of the royal portico beyond. Origin world.
 */
export function pinnacleWall(c, { edge = 752, top = 520, wallTop = 548, x1 = 2600, y1 = 1800 } = {}) {
  const s = sheet();
  // east face in shadow, narrowing with depth
  s.p(c.cut([[edge, top - 2], [edge, y1], [edge - 90, y1], [edge - 26, top + 4]], 0.5, 12), shade(ASHLAR, -0.2));
  let eb = '';
  for (let y = top + 30; y < y1; y += 36) { const k = (y - top) / (y1 - top); eb += c.ribbon([[edge - 26 - k * 64, y], [edge - 2, y]], 1.4); }
  s.x(eb, shade(ASHLAR, -0.35), 'opacity=".5"');
  // south face
  s.p(c.cut([[edge, top], [edge + 190, top], [edge + 190, wallTop], [x1, wallTop], [x1, y1], [edge, y1]], 0.5, 14), ASHLAR);
  let blocks = '', drafts = '';
  for (let y = top + 6, row = 0; y < y1 - 10; y += 38, row++) {
    let x = edge + 4 - (row % 2) * 60;
    while (x < x1) {
      const l = c.rr(100, 170), x0 = Math.max(x, edge + 4), xe = Math.min(x + l - 5, x1);
      if (y < wallTop + 2 && x0 > edge + 186) { x += l; continue; }
      if (xe - x0 > 24) {
        blocks += c.cut(c.rect(x0, y, xe - x0, 33), 0.5, 10);
        drafts += c.cut(c.rect(x0 + 6, y + 5, xe - x0 - 12, 23), 0.3, 10);
      }
      x += l;
    }
  }
  s.x(blocks, shade(ASHLAR, -0.12), 'opacity=".55"');
  s.x(drafts, shade(ASHLAR, 0.16), 'opacity=".6"');
  // the raised corner: a coping stone on top
  s.p(c.cut([[edge - 8, top - 12], [edge + 200, top - 12], [edge + 200, top + 4], [edge - 8, top + 4]], 0.4, 8), shade(ASHLAR, 0.18));
  s.p(c.cut([[edge + 190, wallTop - 10], [x1, wallTop - 10], [x1, wallTop + 4], [edge + 190, wallTop + 4]], 0.4, 10), shade(ASHLAR, 0.1));
  return s.out();
}
/** the royal portico standing on the platform behind the corner (origin world) */
export function royalPortico(c, x0 = 960, x1 = 2600, y = 548) {
  const s = sheet();
  const col = mix(C.cream, C.stone, 0.4);
  s.p(c.cut(c.rect(x0, y - 150, x1 - x0, 150), 0.5, 12), mix(C.plaster2, C.sand2, 0.35));
  let cols = '';
  for (let x = x0 + 24; x < x1; x += 56) cols += c.cut([[x - 8, y], [x - 7, y - 124], [x + 7, y - 124], [x + 8, y]], 0.3, 8);
  s.p(cols, col);
  s.p(c.cut(c.rect(x0 - 8, y - 160, x1 - x0 + 16, 28), 0.4, 10), mix(col, C.sand, 0.25));
  s.p(c.cut([[x0 - 16, y - 158], [x0 + 60, y - 214], [x1, y - 214], [x1, y - 158]], 0.5, 12), mix(C.roof, C.wood3, 0.3));
  let sp = '';
  for (let x = x0 + 70; x < x1; x += 22) sp += c.poly([[x - 2, y - 214], [x, y - 226], [x + 2, y - 214]]);
  s.x(sp, C.sun);
  return s.out();
}
/** the Kidron valley seen from high above: a far ridge, then fields, the brook, a road, a village, olive
 *  trees — all small, growing a little towards the bottom (origin world; the ridge top is at y0) */
export function valleyBelow(c, { y0 = 330 } = {}) {
  const s = sheet();
  s.p(c.ridge(c.wave(y0, [12, 5], [900, 260]), -900, 2500, 1800, 14, 0.8), mix(C.hillFar, C.duskViolet, 0.22));
  let od = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = y0 + c.rr(8, 30); od += c.cut(c.blob(x, y, 5, 3.4, 7, 0.2), 0.2, 3); }
  s.x(od, mix(C.olive, C.duskViolet, 0.3), 'opacity=".7"');
  const base = y0 + 34;
  s.p(c.ridge(c.wave(base, [4, 2], [700, 200]), -900, 2500, 1800, 14, 0.6), mix(C.sage2, C.sand, 0.45));
  // a patchwork of fields in rows that widen towards the bottom
  const fb = mix(C.sage2, C.sand, 0.45);
  const cols = [mix(C.sage3, C.sand, 0.3), mix(C.wheat, C.sand, 0.55), C.sage2, mix(C.hillMid, C.sand, 0.3), mix(C.sand2, C.cream, 0.3), mix(C.olive, C.sage3, 0.5)].map((col) => mix(col, fb, 0.45));
  const byCol = cols.map(() => '');
  let y = base + 10;
  for (let row = 0; y < 1100; row++) {
    const h = 16 + (y - base) * 0.12;
    let x = -700 + c.rr(0, 60);
    while (x < 2300) {
      const w = c.rr(90, 210) * (1 + (y - base) * 0.004);
      const k = c.ri(0, cols.length - 1);
      byCol[k] += c.cut([[x + 3, y + 2], [x + w - 3, y + 2 + c.rr(-2, 2)], [x + w - 3, y + h - 2], [x + 3, y + h - 2]], 0.4, 8);
      x += w;
    }
    y += h;
  }
  byCol.forEach((d, i) => { if (d) s.p(d, cols[i]); });
  // the brook and the road winding down the valley
  s.p(c.ribbon(c.cbez([180, base + 4], [420, 520], [120, 760], [520, 1100], 30), (u) => 3 + u * 9), mix(C.lake2, C.skyBlue, 0.3));
  s.p(c.ribbon(c.cbez([-400, base + 30], [300, 470], [640, 560], [980, 1100], 30), (u) => 3 + u * 10), mix(C.sand, C.cream, 0.45));
  // a village of tiny white houses, olive trees
  let hs = '', rf = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(250, 620) + (i % 3) * 20, yy = c.rr(base + 50, base + 190), w = 7 + (yy - base) * 0.05; hs += c.cut(c.rect(x, yy - w * 0.8, w, w * 0.8), 0.2, 3); rf += c.poly(c.rect(x - 1, yy - w * 0.8 - 1.6, w + 2, 2.4)); }
  s.p(hs, C.plaster);
  s.x(rf, C.roof);
  let trees = '';
  for (let i = 0; i < 60; i++) { const x = c.rr(-600, 760), yy = c.rr(base + 20, 1000), r = 2.5 + (yy - base) * 0.02; trees += c.cut(c.blob(x, yy, r * 1.3, r, 8, 0.2), 0.3, 3); }
  s.p(trees, mix(C.olive, C.moss, 0.3));
  return s.out();
}

/* ================================================================== the very high mountain */
/** a scalloped sea of cloud tops (origin world), top edge near y */
export function cloudSea(c, y, { col = C.cream, col2 = '#eadcc0', x0 = -900, x1 = 2500, r0 = 40, r1 = 90 } = {}) {
  const pts = [[x0, 1800]];
  let x = x0;
  while (x < x1) { const r = c.rr(r0, r1); pts.push(...c.arc(x + r, y + c.rr(-10, 10), r, r * 0.6, PI, 2 * PI, 8)); x += r * 2 - 6; }
  pts.push([x1, 1800]);
  const s = sheet();
  s.p(c.cut(pts.map(([px, py]) => [px, py + 16]), 0.6, 10), col2);
  s.p(c.cut(pts, 0.6, 10), col);
  return s.out();
}
/**
 * Above the clouds: a thin bright sky, far peaks, a sea of cloud tops, and a rocky summit whose flat top
 * (y ≈ top) is where people stand. Returns handles; update(t, time) drifts the clouds.
 */
export function peakSet(S, { skyCols = HIGH, sky2 = null, sunAt = [1230, 180], top = 700, dawn = false } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }).layer : null;
  if (sk2) sk2.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, dawn ? 52 : 40, dawn ? { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' } : undefined), { x: sunAt[0], y: sunAt[1], len: 900 });
  const far = S.layer({ par: 0.08, sh: 2 });
  const fp = [[-900, 1800], [-900, 640]];
  for (let x = -900; x < 2500; x += c.rr(120, 260)) { const h = c.rr(40, 150); fp.push([x + c.rr(40, 70), 640 - h], [x + c.rr(110, 160), 640 - c.rr(0, 20)]); }
  fp.push([2500, 640], [2500, 1800]);
  far.add(sheet().p(c.cut(fp, 1, 10), mix(C.skyBlue2, C.duskViolet, 0.3)).out());
  const seaL = S.layer({ par: 0.16, sh: 2, pad: 160 });
  seaL.add(cloudSea(c, 640, { col: mix(C.cream, C.skyBlue, 0.25), col2: mix(C.skyBlue2, C.cream, 0.4) }));
  seaL.add(cloudSea(c, 700, { r0: 60, r1: 120 }));
  const G = S.layer({ par: 0.5, sh: 4 });
  const rockC = mix(C.rock, C.duskViolet, 0.18);
  const pk = [[-500, 1800], [120, 1100], [300, 930], [400, 800], [452, 700], [480, 632], [512, 690], [560, top + 30], [600, top + 6], [700, top - 2], [820, top + 4], [940, top - 4], [1010, top + 8], [1070, top + 34], [1110, 640], [1140, 590], [1172, 660], [1210, 780], [1320, 930], [1480, 1100], [2100, 1800]];
  const g = sheet();
  g.p(c.cut(pk, 1.6, 10), rockC);
  g.p(c.cut([[600, top + 6], [700, top - 2], [820, top + 4], [940, top - 4], [1010, top + 8], [990, top + 40], [620, top + 36]], 0.8, 8), shade(rockC, 0.2));
  g.p(c.cut([[1110, 640], [1140, 590], [1172, 660], [1210, 780], [1320, 930], [1480, 1100], [1700, 1400], [1300, 1120], [1150, 900], [1120, 760]], 1.2, 10) + c.cut([[480, 632], [452, 700], [400, 800], [300, 930], [120, 1100], [-100, 1400], [260, 1100], [430, 900], [500, 760]], 1.2, 10), shade(rockC, -0.14));
  g.p(c.cut([[1140, 590], [1150, 620], [1128, 640]], 0.3, 4) + c.cut([[480, 632], [492, 660], [470, 668]], 0.3, 4), shade(rockC, 0.3));
  let cr = '';
  for (let i = 0; i < 18; i++) { const x = c.rr(420, 1200), y = c.rr(top + 50, 1000); cr += c.ribbon([[x, y], [x + c.rr(-30, 30), y + c.rr(20, 50)]], 2); }
  g.x(cr, shade(rockC, -0.3), 'opacity=".45"');
  G.add(g.out());
  // wisps of cloud caught on the slopes
  const wisp = S.layer({ par: 0.6, sh: 3, pad: 120 });
  wisp.add(cloudSea(c, 900, { r0: 40, r1: 80, col: mix(C.cream, C.skyBlue, 0.15) }));
  const fg = S.layer({ par: 0.85, sh: 6, pad: 200 });
  fg.add(cloudSea(c, 1060, { r0: 70, r1: 140 }));
  return {
    c, sk, sk2, hangL, sunEl, seaL, G, fg, wisp, top,
    update(t, time) { seaL.shift(-t * 24, 0); fg.shift(t * 30, 0); wisp.shift(t * 12, 0); },
  };
}

/* ================================================================== the kingdoms of the world, on painted plates */
const GOLDRIM = C.haloRim;
function plateFrame(c, w, h, bg) {
  const outer = [[-w / 2 - 7, h / 2 + 7], [-w / 2 - 7, -h / 2 + w / 2 - 20], ...c.arc(0, -h / 2 + w / 2 - 20, w / 2 + 7, w / 2 - 10, PI, 2 * PI, 18), [w / 2 + 7, h / 2 + 7]];
  const inner = [[-w / 2, h / 2], [-w / 2, -h / 2 + w / 2 - 20], ...c.arc(0, -h / 2 + w / 2 - 20, w / 2, w / 2 - 17, PI, 2 * PI, 18), [w / 2, h / 2]];
  return { outer, inner, s: sheet().p(c.cut(outer, 0.5, 6), GOLDRIM).p(c.cut(inner, 0.4, 6), bg) };
}
/** a kingdom of the world on an arched gold-rimmed plate (origin: plate centre). kind: egypt|babylon|rome|east|sea|greece */
export function kingdomPlate(c, kind, { w = 150, h = 160 } = {}) {
  const bgs = { egypt: '#f3dcae', babylon: '#e9d2b8', rome: '#dfe6dc', east: '#e8d9e6', sea: '#d8e8e6', greece: '#e6e8d6' };
  const { s } = plateFrame(c, w, h, bgs[kind]);
  const g = h / 2 - 16; // ground line inside
  const gold = C.sun, gold2 = C.haloRim;
  if (kind === 'egypt') {
    s.p(c.cut([[-w / 2 + 2, g - 6], [w / 2 - 2, g - 10], [w / 2 - 2, h / 2 - 2], [-w / 2 + 2, h / 2 - 2]], 0.4, 6), C.dune);
    s.p(c.cut([[-58, g - 4], [-16, -44], [26, g - 6]], 0.4, 6) + c.cut([[10, g - 8], [40, -8], [70, g - 10]], 0.4, 6), C.sand2);
    s.x(c.poly([[-16, -44], [26, g - 6], [-2, g - 6]]) + c.poly([[40, -8], [70, g - 10], [52, g - 10]]), shade(C.sand2, -0.15));
    s.p(c.cut([[-16, -44], [-22, -34], [-10, -34]], 0.2, 3) + c.cut([[40, -8], [36, -2], [44, -2]], 0.2, 3), gold);
    s.p(c.ribbon([[-w / 2 + 4, g + 6], [w / 2 - 4, g + 2]], 7), C.lake2);
    s.p(c.ribbon([[-54, g - 2], [-50, -12]], 3), C.wood2).p(c.cut(c.star(-50, -14, 18, 6, 7, 0.2), 0.4, 3), C.moss);
  } else if (kind === 'babylon') {
    s.p(c.cut([[-w / 2 + 2, g], [w / 2 - 2, g], [w / 2 - 2, h / 2 - 2], [-w / 2 + 2, h / 2 - 2]], 0.4, 6), C.sand2);
    [[70, 0], [54, 22], [38, 44], [22, 64]].forEach(([hw, d], i) => s.p(c.cut(c.rect(-hw + 6, g - 22 - d, hw * 2, 22), 0.3, 5), i % 2 ? C.clay : shade(C.clay, 0.2)));
    s.p(c.cut(c.rect(-10, g - 100, 32, 14), 0.3, 4), gold);
    s.x(c.ribbon([[6, g], [6, g - 86]], 5), shade(C.clay, -0.2), 'opacity=".6"');
    s.p(c.ribbon([[-w / 2 + 6, g - 10], [-44, g - 10]], 12) + c.ribbon([[52, g - 10], [w / 2 - 6, g - 10]], 12), C.dustyBlue);
  } else if (kind === 'rome') {
    s.p(c.cut([[-w / 2 + 2, g], [w / 2 - 2, g], [w / 2 - 2, h / 2 - 2], [-w / 2 + 2, h / 2 - 2]], 0.4, 6), C.sage2);
    s.p(c.cut(c.rect(-50, g - 12, 100, 12), 0.3, 5), C.stone2);
    let cols = '';
    for (let i = 0; i < 6; i++) cols += c.cut(c.rect(-44 + i * 17, g - 62, 8, 50), 0.2, 4);
    s.p(cols, C.linen);
    s.p(c.cut(c.rect(-52, g - 72, 104, 10), 0.3, 5), C.stone);
    s.p(c.cut([[-56, g - 72], [0, g - 100], [56, g - 72]], 0.3, 5), C.stone);
    s.p(c.cut(c.circ(0, g - 83, 6, 10), 0.2, 3), gold);
    s.p(c.ribbon([[58, g], [58, g - 78]], 3), C.wood2).p(c.cut([[48, g - 90], [58, g - 80], [68, g - 90], [64, g - 78], [52, g - 78]], 0.3, 3), gold).p(c.cut(c.rect(50, g - 76, 16, 14), 0.2, 3), C.terracotta);
  } else if (kind === 'east') {
    s.p(c.cut([[-w / 2 + 2, g], [w / 2 - 2, g], [w / 2 - 2, h / 2 - 2], [-w / 2 + 2, h / 2 - 2]], 0.4, 6), mix(C.sand, C.mauve, 0.3));
    s.p(c.cut(c.rect(-46, g - 50, 92, 50), 0.3, 5), C.plaster);
    s.p(c.cut([[-30, g - 50], ...c.arc(0, g - 50, 30, 40, PI, 2 * PI, 12), [0, g - 96], [30, g - 50]], 0.3, 5), C.teal2);
    s.p(c.cut(c.rect(-64, g - 84, 14, 84), 0.3, 5) + c.cut(c.rect(50, g - 84, 14, 84), 0.3, 5), C.plaster2);
    s.p(c.cut([[-64, g - 84], [-57, g - 102], [-50, g - 84]], 0.2, 3) + c.cut([[50, g - 84], [57, g - 102], [64, g - 84]], 0.2, 3) + c.cut(c.circ(0, g - 100, 5, 8), 0.2, 3), gold);
    s.x(c.cut([[-10, g], [-10, g - 22], ...c.arc(0, g - 22, 10, 10, PI, 2 * PI, 6), [10, g]], 0.2, 3), C.soilDark);
  } else if (kind === 'sea') {
    s.p(c.cut([[-w / 2 + 2, g - 16], [w / 2 - 2, g - 20], [w / 2 - 2, h / 2 - 2], [-w / 2 + 2, h / 2 - 2]], 0.4, 6), C.lake2);
    s.x(c.ribbon([[-50, g - 2], [-20, g - 4]], 2) + c.ribbon([[10, g + 6], [50, g + 4]], 2), C.foam, 'opacity=".8"');
    [[-26, 1], [34, 0.8]].forEach(([x, k]) => {
      s.p(c.cut([[x - 30 * k, g - 22], [x + 30 * k, g - 22], [x + 20 * k, g - 8], [x - 22 * k, g - 8]], 0.3, 4), C.wood);
      s.p(c.ribbon([[x, g - 22], [x, g - 86 * k]], 2.4), C.wood2);
      s.p(c.cut([[x + 2, g - 82 * k], [x + 32 * k, g - 30], [x + 2, g - 28]], 0.3, 4) + c.cut([[x - 2, g - 76 * k], [x - 24 * k, g - 30], [x - 2, g - 28]], 0.3, 4), C.sail);
      s.p(c.cut([[x, g - 88 * k], [x + 10 * k, g - 84 * k], [x, g - 80 * k]], 0.2, 3), C.terracotta);
    });
    s.p(c.cut(c.rect(52, g - 90, 16, 70), 0.3, 4), C.stone).p(c.cut(c.circ(60, g - 96, 8, 10), 0.2, 3), gold);
  } else {
    s.p(c.cut([[-w / 2 + 2, g], [-30, g - 34], [30, g - 36], [w / 2 - 2, g], [w / 2 - 2, h / 2 - 2], [-w / 2 + 2, h / 2 - 2]], 0.5, 6), C.olive);
    s.p(c.cut(c.rect(-34, g - 70, 68, 34), 0.3, 5), C.linen);
    let cols = '';
    for (let i = 0; i < 5; i++) cols += c.cut(c.rect(-30 + i * 14, g - 66, 5, 28), 0.2, 3);
    s.x(cols, shade(C.linen, -0.15));
    s.p(c.cut([[-38, g - 70], [0, g - 88], [38, g - 70]], 0.3, 4), C.stone);
    s.p(c.ribbon([[-58, g - 4], [-58, g - 40]], 3), C.wood2).p(c.cut(c.blob(-58, g - 44, 12, 9, 8, 0.2), 0.3, 3), C.moss);
  }
  // glitter of gold (their splendour)
  let gl = '';
  for (let i = 0; i < 5; i++) gl += c.poly(c.star(c.rr(-w * 0.36, w * 0.36), c.rr(-h * 0.36, h * 0.2), c.rr(4, 7), 1.4, 4, 0));
  s.x(gl, C.star);
  return `<circle r="${w * 0.95}" fill="url(#warm-glow)" opacity=".55"/>${s.out()}`;
}
export const KINGDOMS = ['egypt', 'babylon', 'rome', 'east', 'sea', 'greece'];

/** a whirl of shadow ribbons — how the tempter carries Him off (origin centre) */
export function whirl(c, sc = 1) {
  let d = '';
  for (let i = 0; i < 5; i++) d += c.ribbon(c.arc(0, 0, 60 - i * 8, 26 - i * 3, i * 1.3, i * 1.3 + PI * 1.4, 14), (u) => 7 * Math.sin(u * PI) + 1);
  return `<path d="${d}" fill="#2b2640" opacity=".75" transform="scale(${sc})"/>`;
}

/* ================================================================== the map of Zebulun and Naphtali */
export const MAP4 = {
  w: 900, h: 560,
  naz: [-90, 120], kaf: [118, -92], lake: [140, -10],
  zeb: [-150, 70], naf: [30, -175], trans: [330, 30],
  // the Way of the Sea: up the coast, across Galilee past Capernaum, on to Damascus
  road: [[-420, 268], [-372, 150], [-340, 40], [-250, -10], [-120, -30], [20, -60], [118, -92], [230, -150], [330, -210], [430, -262]],
  walk: [[-90, 120], [-40, 70], [10, 20], [60, -30], [118, -92]],
};
const mapBlob = (c, [x, y], rx, ry, seed = 0.18) => c.blob(x, y, rx, ry, 16, seed);
/** the parchment map of Galilee (origin centre, MAP4 coordinates). Returns { base, zeb, naf, trans, border, road } */
export function galilee4Map(c) {
  const { w, h } = MAP4;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2.2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 18, -h / 2 + 18], [w / 2 - 18, -h / 2 + 18], [w / 2 - 18, h / 2 - 18], [-w / 2 + 18, h / 2 - 18], [-w / 2 + 18, -h / 2 + 20]], 2), C.clay, 'opacity=".5"');
  // the Great Sea on the left
  const coast = [[-w / 2 + 20, -h / 2 + 20], [-330, -h / 2 + 20], [-350, -150], [-330, -60], [-360, 40], [-392, 150], [-410, 250], [-400, h / 2 - 20], [-w / 2 + 20, h / 2 - 20]];
  s.p(c.cut(coast, 1.2, 8), C.lake);
  s.x(c.ribbon([[-420, -100], [-380, -104]], 2) + c.ribbon([[-430, 60], [-390, 56]], 2) + c.ribbon([[-424, 180], [-400, 176]], 2), C.foam, 'opacity=".7"');
  // hills
  let hills = '';
  [[-250, -150], [-200, -220], [-60, 180], [-20, 230], [-240, 160], [60, -230], [-80, -120], [280, -200], [300, 150], [360, 220], [-160, -80]].forEach(([x, y]) => { hills += c.cut([[x - 24, y + 10], [x, y - 18], [x + 24, y + 10]], 0.6, 6); });
  s.x(hills, shade(C.parchment, -0.14));
  // the Jordan and the lake
  s.p(c.ribbon([[170, -h / 2 + 20], [160, -210], [178, -170], [158, -130], [146, -104]], 5), C.lake2);
  s.p(c.ribbon([[140, 76], [156, 130], [138, 180], [166, 230], [156, h / 2 - 20]], 5), C.lake2);
  const lake = [[112, -108], [160, -100], [196, -60], [206, 0], [188, 50], [158, 86], [124, 90], [100, 56], [88, 0], [92, -60]];
  s.p(c.cut(lake, 1, 6), C.lake);
  s.x(c.ribbon([[120, -20], [170, -26]], 2) + c.ribbon([[118, 30], [160, 24]], 2), C.foam, 'opacity=".7"');
  const base = s.out();
  const text = (x, y, t, size = 20, col = C.inkSoft, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}"${extra}>${t}</text>`;
  const town = ([x, y]) => c.cut(c.rect(x - 8, y - 7, 16, 11), 0.3, 4) + c.cut([[x - 10, y - 7], [x, y - 16], [x + 10, y - 7]], 0.3, 4);
  const towns = sheet().p(town(MAP4.naz) + town(MAP4.kaf), C.clay).out();
  const labels = text(MAP4.naz[0] + 16, MAP4.naz[1] + 26, tr('Nazaret', 'Nazareth'), 20, C.inkSoft, 'start')
    + text(MAP4.kaf[0] - 16, MAP4.kaf[1] - 12, tr('Kafarnaum', 'Capernaum'), 20, C.inkSoft, 'end')
    + text(-400, -200, tr('Morze Wielkie', 'the Great Sea'), 16, shade(C.lakeDeep, -0.1), 'middle', ' transform="rotate(-80 -400 -200)"')
    + text(w / 2 - 44, -h / 2 + 62, tr('Galilea', 'Galilee'), 32, C.terracotta, 'end');
  // tribal lands (overlays, faded in by the scene)
  const land = (pts, col) => sheet().p(c.cut(pts, 1.4, 8), col).out();
  const zebPts = mapBlob(c, MAP4.zeb, 150, 100);
  const nafPts = mapBlob(c, MAP4.naf, 190, 110);
  const zeb = `<g opacity=".55">${land(zebPts, C.sageRobe)}</g>` + text(MAP4.zeb[0] - 20, MAP4.zeb[1] + 2, tr('Zabulon', 'Zebulun'), 30, shade(C.moss2, -0.25));
  const naf = `<g opacity=".55">${land(nafPts, C.wheatRobe)}</g>` + text(MAP4.naf[0] - 30, MAP4.naf[1] - 10, tr('Neftali', 'Naphtali'), 30, shade(C.wood2, -0.1));
  const trans = `<g opacity=".5">${land(mapBlob(c, MAP4.trans, 90, 170, 0.12), C.mauve)}</g>` + text(MAP4.trans[0] + 20, MAP4.trans[1] + 90, tr('Zajordanie', 'beyond the Jordan'), 24, shade(C.plumRobe, -0.35));
  // the border between them, dashed
  const border = `<path d="M-330 -50 Q-200 -30 -80 -40 T110 -60" fill="none" stroke="${C.terracotta}" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>`;
  const roadD = 'M' + MAP4.road.map(([x, y]) => `${x} ${y}`).join('L');
  const road = `<path d="${roadD}" fill="none" stroke="${C.sun}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path d="${roadD}" fill="none" stroke="${C.sunDeep}" stroke-width="2.4" stroke-dasharray="7 7"/>` + text(-330, 250, tr('Droga morska', 'the way of the sea'), 22, C.sunDeep, 'start') + text(410, -228, tr('do Damaszku', 'to Damascus'), 16, C.sunDeep, 'end');
  const walkD = 'M' + MAP4.walk.map(([x, y]) => `${x} ${y}`).join('L');
  const walk = `<path d="${walkD}" fill="none" stroke="${C.jesusMantle}" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  const gentiles = text(-40, -255, tr('Galilea pogan', 'Galilee of the Gentiles'), 28, C.terracotta);
  return { base: base + towns, labels, zeb, naf, trans, border, road, walk, gentiles };
}
/** a point along a polyline, u in 0..1 */
export function along(pts, u) {
  const seg = [];
  let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let r = Math.max(0, Math.min(1, u)) * L;
  for (let i = 0; i < seg.length; i++) {
    if (r <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, r / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), pts[i + 1][0] >= pts[i][0] ? 1 : -1]; }
    r -= seg[i];
  }
  return [...pts[pts.length - 1], 1];
}

/* ================================================================== fishers of men */
/** a chain of paper dolls holding hands, cut from one folded strip (origin: centre of the chain, feet at 0) */
export function dollChain(c, n = 7, { h = 90, col = C.cream, col2 = shade(C.cream, -0.08) } = {}) {
  const w = h * 0.62;
  let d = '', d2 = '';
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * w;
    const r = h * 0.13;
    d += c.cut(c.circ(x, -h + r, r, 14), 0.3, 3);
    d += c.cut([[x - h * 0.08, -h + r * 1.9], [x + h * 0.08, -h + r * 1.9], [x + h * 0.26, -h * 0.28], [x + h * 0.1, -h * 0.26], [x + h * 0.12, 0], [x + h * 0.02, 0], [x, -h * 0.22], [x - h * 0.02, 0], [x - h * 0.12, 0], [x - h * 0.1, -h * 0.26], [x - h * 0.26, -h * 0.28]], 0.4, 4);
    if (i < n - 1) d += c.ribbon([[x + h * 0.08, -h * 0.6], [x + w - h * 0.08, -h * 0.6]], h * 0.07);
    if (i % 2) d2 += c.cut(c.circ(x, -h + r, r * 0.5, 8), 0.2, 2);
  }
  const s = sheet().p(d, col);
  let fold = '';
  for (let i = 0; i < n - 1; i++) { const x = (i + 0.5 - (n - 1) / 2) * w; fold += c.ribbon([[x, -h * 0.64], [x, -h * 0.56]], 1); }
  s.x(fold, col2);
  return s.out();
}

/* ================================================================== the lake shore of Galilee */
/** sky, sun and clouds, the far shore with villages, the lake, a sandy beach (fn bfn). Returns handles + update(time) */
export function lakeShore(S, { skyCols = DAY, beachY = 736, lakeY = 520, sunAt = [1250, 160], par = 0.5 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[500, 150, 200], [1010, 110, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: lakeY - 80, amps: [16, 7, 3], lens: [1000, 340, 120], color: C.hillFar }).markup);
  const farL = S.layer({ par: 0.14, sh: 2 });
  const fh = hillsWith(c, { y: lakeY - 34, amps: [14, 6, 2], lens: [900, 300, 100], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 18 });
  farL.add(fh.markup + town(c, { x: 360, y: fh.fn(360) + 6, n: 6, spread: 220, sc: 0.4 }) + town(c, { x: 1320, y: fh.fn(1320) + 6, n: 5, spread: 200, sc: 0.4 }));
  const lakeL = S.layer({ par, sh: 3 });
  lakeL.add(waterBand(c, { y: lakeY, color: C.lake, foamN: 40 }).markup);
  const beach = S.layer({ par, sh: 3 });
  const bfn = c.wave(beachY, [4, 2], [700, 160]);
  beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
  let fl = '';
  for (let x = -900; x < 2500; x += c.rr(40, 90)) fl += c.cut([[x, bfn(x) - 2], [x + 22, bfn(x) - 5], [x + 44, bfn(x) - 2], [x + 22, bfn(x)]], 0.2, 6);
  beach.add(sheet().x(fl, C.foam, 'opacity=".8"').out());
  return {
    c, sk, hangL, sunEl, lakeL, beach, bfn,
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}

/* ================================================================== the report goes out into all Syria */
export const SYR = { w: 640, h: 440, kaf: [40, 120], towns: [
  { pl: 'Damaszek', en: 'Damascus', x: 190, y: -60 }, { pl: 'Sydon', en: 'Sidon', x: -150, y: -100 }, { pl: 'Tyr', en: 'Tyre', x: -170, y: -10 },
  { pl: 'Antiochia', en: 'Antioch', x: -40, y: -180 }, { pl: 'Cezarea', en: 'Caesarea', x: -210, y: 150 }, { pl: 'Dekapol', en: 'Decapolis', x: 200, y: 140 },
] };
/** a parchment map from Galilee up to Syria (origin centre). Returns { base, towns: [{x,y}] } */
export function syriaMap(c) {
  const { w, h } = SYR;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 14, -h / 2 + 14], [w / 2 - 14, -h / 2 + 14], [w / 2 - 14, h / 2 - 14], [-w / 2 + 14, h / 2 - 14], [-w / 2 + 14, -h / 2 + 16]], 1.8), C.clay, 'opacity=".5"');
  s.p(c.cut([[-w / 2 + 16, -h / 2 + 16], [-120, -h / 2 + 16], [-160, -150], [-190, -60], [-200, 40], [-236, 150], [-250, h / 2 - 16], [-w / 2 + 16, h / 2 - 16]], 1.2, 8), C.lake);
  let hills = '';
  [[-60, -120], [60, -150], [120, -20], [0, 40], [240, -140], [-120, 60], [150, 60], [90, -90]].forEach(([x, y]) => { hills += c.cut([[x - 20, y + 8], [x, y - 16], [x + 20, y + 8]], 0.5, 5); });
  s.x(hills, shade(C.parchment, -0.14));
  s.p(c.cut([[36, 104], [58, 100], [66, 130], [56, 160], [38, 160], [30, 130]], 0.6, 5), C.lake2);
  s.p(c.ribbon([[50, 160], [60, 210]], 3.5) + c.ribbon([[44, 102], [50, 40], [40, -10]], 3.5), C.lake2);
  const dot = ([x, y]) => c.cut(c.rect(x - 6, y - 5, 12, 9), 0.2, 3) + c.cut([[x - 8, y - 5], [x, y - 12], [x + 8, y - 5]], 0.2, 3);
  s.p(SYR.towns.map((t) => dot([t.x, t.y])).join('') + dot(SYR.kaf), C.clay);
  const lab = SYR.towns.map((t) => `<text x="${t.x}" y="${t.y + 24}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.inkSoft}">${tr(t.pl, t.en)}</text>`).join('')
    + `<text x="${SYR.kaf[0] + 12}" y="${SYR.kaf[1] + 4}" text-anchor="start" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.inkSoft}">${tr('Kafarnaum', 'Capernaum')}</text>`
    + `<text x="${w / 2 - 36}" y="${-h / 2 + 56}" text-anchor="end" font-family="${FONT}" font-size="36" font-style="italic" fill="${C.terracotta}">${tr('Syria', 'Syria')}</text>`
    + `<text x="-40" y="${h / 2 - 34}" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.moss2}">${tr('Galilea', 'Galilee')}</text>`;
  return { base: s.out() + lab };
}
