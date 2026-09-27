// John 10 — the cut-outs of the chapter: the stone sheepfold with its gate and gatekeeper, the sheep (each with a
// name), a lamb carried on the shoulders, the paper wolf, the hired hand and the thief; the green pasture; the
// Temple in winter for the Feast of Dedication — Solomon's Portico with snow on the roofs and little lamps kindled
// along the colonnade; a hand of light. Everything returns SVG markup (origin noted), cut with the seeded scissors.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, lerp } from '../kit.js';
import { band, hillsWith, grass, rock, bush, sun, moon, cloud, stars, cypress, olive, flowers as flowersN } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, addToHead, speech, thought, GLYPH, spark, heart as heart2, wordSlip } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, sparkle, tornPair } from '../mark3/lib.js';
export { voiceRings, hang2, tagOnString, JOHN_B } from '../mark1/lib.js';
export { glory, soulLight, shadowPerson, globe } from '../mark8/lib.js';
export { storyFrame, SEPIA, tick, crossX, staff } from '../mark6/lib.js';
export { vis } from '../mark14/lib.js';
export { templeCourt, courtFront, sanctuary, portico } from '../mark11/lib.js';
export { tint, handLamp } from '../mark13/lib.js';
export { leader, listener, iAm, framed, stone, numberCard, lightPath, drawPath } from '../john8/lib.js';
export { leaderOpts } from '../john5/lib.js';
export { jordanSet, rayBurst, radiance, eternityRing, drawRing, glowDisc, threads, hungWord, darkSheet } from '../john1/lib.js';
export { beamGrad, lightBeam, darkPool, word, bang } from '../john3/lib.js';
export { verseScroll } from '../john2/lib.js';
export { eyeIcon } from '../john6/lib.js';
export { sepia } from '../john4/lib.js';
export { tr, sky, hanging, pose, sheet, shade, mix, C, CAST, person, crowdPerson, lerp };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== palettes */
export const DAWN = ['#c9bfd2', '#f1d3b8', '#f8e3c6'];
export const MORNING = ['#d4e4dc', '#f2e8cc', '#f8ecd2'];
export const DAY = ['#cfe2dc', '#f0e7cd', '#f7ead0'];
export const GOLDEN = ['#e6c9a0', '#f2d3a2', '#f7e2bd'];
export const DUSK = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
export const TWILIGHT = ['#5a5a8a', '#a8849c', '#e0ab92'];
export const NIGHT = ['#1d2349', '#2b3262', '#4a4876'];
export const WINTER = ['#b9c6d0', '#dfe2de', '#eeeae0'];
export const WINTER_DUSK = ['#6e7898', '#b3a9b8', '#e2cdb8'];
export const WINTER_NIGHT = ['#1c2447', '#313a66', '#5b5f86'];
export const SNOW = '#fbf8f1';
export const SNOW2 = '#e7eaee';

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
/** the shepherd of the parable: a young herdsman in a warm sheepskin-coloured mantle */
export const SHEPHERD = { robe: C.wheatRobe, mantle: mix(C.clayMantle, C.ochre, 0.3), hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'short', skin: C.skin2, belt: C.leather };
/** the old gatekeeper of the fold */
export const KEEPER = { robe: mix(C.wood3, C.stone, 0.4), mantle: mix(C.sageRobe, C.stone2, 0.4), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, veil2: C.wood2, beard: 'full', beardColor: '#e4ddd0', skin: C.skin3, belt: C.rope };
/** the thief: a hood pulled low, clothes the colour of the night */
export const THIEF = { robe: mix(C.storm2, C.soilDark, 0.35), mantle: mix(C.storm, C.soilDark, 0.2), hair: C.hair3, hairStyle: 'wrap', veil: mix(C.storm2, C.night2, 0.3), veil2: C.night2, beard: 'short', beardColor: C.hair3, skin: mix(C.skin4, C.storm, 0.35), belt: null };
/** a stranger on the road (the voice the sheep do not know) */
export const STRANGER = { robe: mix(C.dustyBlue, C.stone2, 0.5), mantle: mix(C.plumRobe, C.storm, 0.3), hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.leather };
/** the hired hand */
export const HIRELING = { robe: mix(C.stone2, C.sand2, 0.4), mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.rope };
/** the man born blind, now seeing (Jn 9) — a sand robe, a new sash of sky blue */
export const SEEING = { robe: mix(C.sand2, C.linen, 0.3), mantle: null, belt: C.skyVeil, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3 };
/** people who came to Him beyond the Jordan */
export function villager(c, i, extra = {}) {
  const o = crowdPerson(c);
  if (i % 3 === 1) { o.hairStyle = 'veil'; o.beard = 'none'; } else if (o.hairStyle === 'veil') { o.hairStyle = ['short', 'wrap', 'curly'][i % 3]; o.beard = ['full', 'short', 'none'][i % 3]; }
  return { ...o, ...extra };
}

/* ================================================================== sheep & wolf */
export const WOOLS = [C.linen, mix(C.cream, C.wheat, 0.25), mix(C.linen, C.stone, 0.35), C.cream, mix(C.linen, C.blushVeil, 0.3), mix(C.cream, C.stone2, 0.2)];
export const FACE = mix(C.inkSoft, C.stone2, 0.35);
export const NAMES = { pl: ['Bielka', 'Łatka', 'Kędzior', 'Puszek', 'Beza', 'Śnieżka'], en: ['Blanche', 'Patch', 'Curly', 'Fluff', 'Daisy', 'Snowy'] };
export const nameOf = (i) => tr(NAMES.pl[i % 6], NAMES.en[i % 6]);

/**
 * a paper sheep facing right; origin between its feet (~70 long, ~55 tall at s 1).
 * Parts: .hd (head, pivot at the neck: pose(hd, {x: 24, y: -36, r})), .tg (a name tag on the neck ribbon, hidden).
 */
export function ewe(c, { k, wool = C.linen, face = FACE, tag = '', lamb = false, patch = false } = {}) {
  const b = sheet();
  let legs = '';
  [[-18, 0], [-9, 1], [10, 0], [19, 1]].forEach(([x]) => { legs += c.cut([[x - 2.6, -16], [x + 2.6, -16], [x + 2.1, 0], [x - 2.1, 0]], 0.2, 3); });
  b.p(legs, face);
  const body = [];
  const RX = lamb ? 22 : 28, RY = lamb ? 14 : 17, CY = lamb ? -26 : -31;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * PI * 2, x = Math.cos(a) * RX, y = CY + Math.sin(a) * RY;
    body.push(...c.arc(x, y, 5.6, 5.6, a - 1.2, a + 1.2, 3));
  }
  b.p(c.cut(body, 0.3, 3), wool);
  b.p(c.cut(c.blob(-RX - 3, CY - 6, 5, 4, 8, 0.2), 0.3, 3), wool);
  let curls = '';
  for (let i = 0; i < 6; i++) curls += c.ribbon(c.arc(c.rr(-RX * 0.6, RX * 0.5), CY + c.rr(-RY * 0.4, RY * 0.4), 4, 3, 0.2, PI * 1.3, 5), 1);
  b.x(curls, shade(wool, -0.12), 'opacity=".6"');
  if (patch) b.p(c.cut(c.blob(-6, CY - 2, 10, 8, 9, 0.25), 0.4, 3), mix(C.hair2, C.wood2, 0.4));
  const h = sheet();
  const hs = lamb ? 0.85 : 1;
  const P = (pts) => pts.map(([x, y]) => [x * hs, y * hs]);
  h.p(c.cut(P([[-4, -6], [5, -11], [13, -8], [19, -1], [18, 5], [12, 8], [3, 6], [-3, 2]]), 0.3, 3), face);
  h.p(c.cut(P([[2, -8], [-9, -14], [-10, -9], [-2, -4]]), 0.2, 2), shade(face, -0.1));
  h.x(c.poly(c.circ(9 * hs, -3 * hs, 1.4, 6)), '#fff');
  h.p(c.cut(c.blob(2 * hs, -10 * hs, 7 * hs, 5 * hs, 8, 0.2), 0.3, 3), wool);
  const tg = tag ? `<g class="tg" opacity="0"><path d="${c.ribbon(c.arc(18, -34, 8, 11, PI * 0.35, PI * 1.05, 6), 2.4)}" fill="${C.terracotta}"/><path d="${c.ribbon([[16, -24], [18, -8]], 0.8)}" fill="${C.ink}"/><g class="tgt" transform="translate(18 -8)">${sheet().p(c.cut([[-tag.length * 3.4 - 6, 0], [tag.length * 3.4 + 6, 0], [tag.length * 3.4 + 6, 16], [-tag.length * 3.4 - 6, 16]], 0.3, 4), C.cream).out()}<text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-size="12.5" font-style="italic" fill="${C.ink}">${tag}</text></g></g>` : '';
  return `<g${k_(k)}><g class="bd">${b.out()}</g><g class="hd" transform="translate(${RX - 4} ${CY - 5})">${h.out()}</g>${tg}</g>`;
}
/** head pivot of a sheep made by ewe() */
export const HEAD = { x: 24, y: -36 };
export const LAMB_HEAD = { x: 18, y: -31 };
/** wrap a sheep element with a tiny controller: set({x, y, s, flip, head, o, r, hop}) */
export function sheepRig(el, lamb = false) {
  const hd = el.querySelector('.hd'), tg = el.querySelector('.tg'), tgt = el.querySelector('.tgt');
  const H = lamb ? LAMB_HEAD : HEAD;
  return {
    el, hd, tg,
    set({ x = 0, y = 0, s = 1, flip = false, head = 0, o = 1, r = 0, hop = 0, tag = 0 }) {
      pose(el, { x, y: y - hop, s, sx: flip ? -1 : 1, r, o });
      pose(hd, { x: H.x, y: H.y, r: head });
      if (tg) { fade(tg, tag); if (tag > 0.01) pose(tgt, { x: 18, y: -8, sx: flip ? -1 : 1 }); }
    },
  };
}
/** a lamb lying over someone's shoulders — insert into a puppet's body with onShoulders() */
export function shoulderLamb(c, wool = C.linen) {
  const s = sheet();
  // legs hanging down over the chest (front) and the back
  s.p(c.cut([[20, -140], [25, -140], [27, -114], [22, -114]], 0.2, 3) + c.cut([[28, -138], [33, -137], [36, -116], [31, -115]], 0.2, 3), FACE);
  s.p(c.cut([[-40, -140], [-35, -140], [-37, -118], [-42, -118]], 0.2, 3) + c.cut([[-32, -140], [-27, -140], [-29, -120], [-34, -120]], 0.2, 3), FACE);
  const body = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * PI * 2, x = -4 + Math.cos(a) * 42, y = -146 + Math.sin(a) * 15;
    body.push(...c.arc(x, y, 6, 6, a - 1.2, a + 1.2, 3));
  }
  s.p(c.cut(body, 0.3, 3), wool);
  let curls = '';
  for (let i = 0; i < 7; i++) curls += c.ribbon(c.arc(c.rr(-36, 26), -146 + c.rr(-6, 6), 4, 3, 0.2, PI * 1.3, 5), 1);
  s.x(curls, shade(wool, -0.12), 'opacity=".6"');
  // the lamb's head out in front, below the shepherd's chin
  s.p(c.cut([[32, -150], [42, -160], [53, -157], [60, -148], [55, -140], [43, -138], [35, -142]], 0.3, 3), FACE);
  s.p(c.cut([[37, -154], [26, -162], [25, -154]], 0.2, 2), shade(FACE, -0.1));
  s.x(c.poly(c.circ(48, -151, 1.5, 6)), '#fff');
  s.p(c.cut(c.blob(38, -158, 7, 5, 8, 0.2), 0.3, 3), wool);
  s.p(c.cut(c.blob(-48, -150, 6, 5, 8, 0.2), 0.3, 3), wool);
  return s.out();
}
/** put a lamb on a puppet's shoulders (behind the head, in front of the robe) */
export function onShoulders(markup, lambM) {
  return markup.replace('<g class="head"', `<g class="lambOn">${lambM}</g><g class="head"`);
}

/** a paper wolf facing right, stylised (no teeth); origin between its feet; parts .hd (pivot 40,-52), .tl tail */
export function wolf(c, { k, col = mix(C.storm, C.rock3, 0.45), dark = false } = {}) {
  const fur = dark ? mix(col, C.night2, 0.5) : col;
  const s = sheet();
  let legs = '';
  [[-30, 0], [-20, 1], [22, 0], [32, 1]].forEach(([x], i) => { legs += c.cut([[x - 3.4, -30], [x + 3.4, -30], [x + (i < 2 ? -1 : 3), 0], [x + (i < 2 ? -6 : -3), 0]], 0.3, 3); });
  s.p(legs, shade(fur, -0.15));
  s.p(c.cut([[-44, -40], [-30, -56], [0, -60], [30, -58], [44, -50], [46, -30], [34, -24], [0, -26], [-30, -24], [-44, -28]], 0.8, 4), fur);
  s.x(c.cut([[-30, -30], [0, -30], [30, -30], [40, -36], [30, -34], [0, -36], [-28, -36]], 0.4, 4), shade(fur, 0.25), 'opacity=".7"');
  let ruff = '';
  for (let i = 0; i < 6; i++) ruff += c.poly([[20 + i * 4, -56], [24 + i * 4, -66 + (i % 2) * 4], [28 + i * 4, -56]]);
  s.p(ruff, fur);
  const t = sheet().p(c.cut([[-40, -46], [-58, -52], [-76, -48], [-86, -38], [-74, -40], [-60, -38], [-44, -36]], 0.8, 4), fur).x(c.cut([[-78, -44], [-86, -38], [-76, -40]], 0.2, 2), shade(fur, 0.35)).out();
  const h = sheet();
  h.p(c.cut([[-8, -8], [4, -14], [14, -12], [34, -4], [36, 2], [22, 4], [8, 8], [-6, 6]], 0.5, 3), fur);
  h.p(c.cut([[0, -12], [2, -26], [10, -12]], 0.3, 2) + c.cut([[-6, -9], [-8, -22], [2, -12]], 0.3, 2), shade(fur, -0.12));
  h.x(c.cut(c.ell(12, -4, 3.2, 1.6, 8, -0.2), 0.1, 2), dark ? '#f3d27a' : C.cream);
  h.x(c.poly(c.circ(35, 0, 2.2, 6)), C.ink);
  return `<g${k_(k)}><g class="tl">${t}</g>${s.out()}<g class="hd" transform="translate(40 -52)">${h.out()}</g></g>`;
}

/* ================================================================== the fold */
/**
 * A round dry-stone sheepfold seen from the front, a little from above: floor ellipse, back wall, the two halves
 * of the front wall with a gap for the gate, two gate-stones, thorn brush along the top.
 * { cx, gy (front wall foot at the gate), w, d (depth), h (wall height), gw (gate width) } → { floor, back, front, gate, G }
 * gate: the wooden hurdle, origin at its hinge (the left gate-stone) foot. G: handy coordinates.
 */
export function foldParts(c, { cx = 780, gy = 640, w = 560, d = 150, h = 62, gw = 86, wall = mix(C.rock, C.stone2, 0.4), wall2 = C.rock2, floor = mix(C.sand2, C.hillNear, 0.3), thorn = C.thorn } = {}) {
  const rx = w / 2, ry = d / 2, cy = gy - ry;
  const E = (a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  const band = (a0, a1, n = 24) => {
    const bot = [], top = [];
    for (let i = 0; i <= n; i++) { const [x, y] = E(a0 + ((a1 - a0) * i) / n); bot.push([x, y]); top.push([x, y - h + Math.sin(i * 1.7) * 2]); }
    return [...bot, ...top.reverse()];
  };
  const stonesOn = (a0, a1, rows = 3) => {
    let d2 = '';
    const L = rx * Math.abs(a1 - a0) * 0.9;
    const n = Math.max(3, Math.round(L / 34));
    for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) {
      const [x, y] = E(a0 + ((a1 - a0) * (i + (r % 2) * 0.5 + 0.25)) / n);
      const yy = y - 10 - r * (h - 14) / rows - 4;
      d2 += c.cut(c.blob(x, yy, c.rr(12, 17), c.rr(6.5, 9), 9, 0.2), 0.5, 4);
    }
    return d2;
  };
  const thornsOn = (a0, a1) => {
    let d2 = '';
    const n = Math.round(rx * Math.abs(a1 - a0) / 16);
    for (let i = 0; i <= n; i++) {
      const [x, y] = E(a0 + ((a1 - a0) * i) / n);
      const yy = y - h + 2;
      for (let j = 0; j < 3; j++) { const a = -PI / 2 + c.rr(-1.1, 1.1), l = c.rr(9, 18); d2 += c.ribbon([[x, yy], [x + Math.cos(a) * l, yy + Math.sin(a) * l]], 1.6); }
    }
    return d2;
  };
  const fl = sheet().p(c.cut(c.ell(cx, cy, rx - 4, ry - 3, 40), 0.8, 10), floor).x(c.cut(c.ell(cx, cy + 6, rx * 0.8, ry * 0.6, 30), 0.6, 10), shade(floor, 0.1), 'opacity=".6"');
  const bk = sheet().p(c.cut(band(PI, 2 * PI, 30), 0.8, 8), shade(wall, -0.06)).x(stonesOn(PI, 2 * PI), shade(wall2, -0.02), 'opacity=".55"').x(thornsOn(PI, 2 * PI), thorn, 'opacity=".9"');
  const ag = Math.acos(Math.min(0.95, gw / w));
  const fr = sheet();
  fr.p(c.cut(band(0, ag, 12), 0.8, 8) + c.cut(band(PI - ag, PI, 12), 0.8, 8), wall);
  fr.x(stonesOn(0, ag) + stonesOn(PI - ag, PI), wall2, 'opacity=".55"');
  fr.x(thornsOn(0.05, ag - 0.05) + thornsOn(PI - ag + 0.05, PI - 0.05), thorn, 'opacity=".9"');
  // the two gate stones
  const [gxL, gyL] = E(PI - ag), [gxR, gyR] = E(ag);
  const post = (x, y) => c.cut([[x - 13, y + 2], [x - 14, y - h - 24], [x - 6, y - h - 32], [x + 8, y - h - 30], [x + 14, y - h - 20], [x + 13, y + 2]], 0.6, 5);
  fr.p(post(gxL, gyL) + post(gxR, gyR), mix(wall, C.stone, 0.3));
  fr.x(c.ribbon([[gxL - 6, gyL - 20], [gxL - 8, gyL - h]], 1.6) + c.ribbon([[gxR + 5, gyR - 16], [gxR + 7, gyR - h - 6]], 1.6), shade(wall, -0.2), 'opacity=".5"');
  const gh = h - 4, gwid = gxR - gxL - 22;
  const g = sheet();
  let slats = '';
  for (let i = 0; i < 5; i++) { const x = 6 + (i * (gwid - 12)) / 4; slats += c.cut([[x - 3.4, 0], [x + 3.4, 0], [x + 3, -gh], [x - 3, -gh]], 0.3, 4); }
  g.p(slats, C.wood3);
  g.p(c.cut([[0, -gh * 0.22 - 4], [gwid, -gh * 0.22 - 4], [gwid, -gh * 0.22 + 4], [0, -gh * 0.22 + 4]], 0.3, 4) + c.cut([[0, -gh * 0.78 - 4], [gwid, -gh * 0.78 - 4], [gwid, -gh * 0.78 + 4], [0, -gh * 0.78 + 4]], 0.3, 4), C.wood2);
  g.x(c.ribbon([[2, -gh * 0.2], [gwid - 2, -gh * 0.78]], 3.4), C.wood2);
  const G = { cx, cy, gy, rx, ry, h, gxL: gxL + 11, gxR: gxR - 11, gw: gwid, gateY: (gyL + gyR) / 2, inside: (u, v) => [cx + u * rx * 0.78, cy + v * ry * 0.6] };
  return { floor: fl.out(), back: bk.out(), front: fr.out(), gate: g.out(), G };
}
/** a tiny far-off fold on a hill (origin: its front foot), sheep dots inside */
export function farFold(c, sc = 1, { wall = mix(C.rock, C.stone2, 0.4) } = {}) {
  const s = sheet();
  const w = 90 * sc, d = 26 * sc, h = 12 * sc;
  const pts = [];
  for (let i = 0; i <= 20; i++) { const a = (i / 20) * PI * 2; pts.push([Math.cos(a) * w / 2, -d / 2 + Math.sin(a) * d / 2]); }
  s.p(c.cut(pts, 0.4, 5), mix(C.sand2, C.hillNear, 0.3));
  s.p(c.cut([...c.arc(0, -d / 2, w / 2, d / 2, PI, 2 * PI, 12), ...c.arc(0, -d / 2 - h, w / 2, d / 2, 2 * PI, PI, 12)], 0.4, 4), shade(wall, -0.06));
  s.p(c.cut([...c.arc(0, -d / 2, w / 2, d / 2, 0, PI * 0.42, 6), ...c.arc(0, -d / 2 - h, w / 2, d / 2, PI * 0.42, 0, 6)], 0.3, 4) + c.cut([...c.arc(0, -d / 2, w / 2, d / 2, PI * 0.58, PI, 6), ...c.arc(0, -d / 2 - h, w / 2, d / 2, PI, PI * 0.58, 6)], 0.3, 4), wall);
  return s.out();
}

/* ================================================================== the land */
/**
 * Open pasture land of Judea: sky, hanging sun (+moon) and clouds, far hills, mid hills with olive trees,
 * the meadow at groundY. Returns { sk, hangL, sunEl, moonEl, update(T, {sunX, sunY, moonY, moonO}) }.
 */
export function pastureSet(S, { skyCols = MORNING, sunAt = [1200, 150], sunR = 46, moonAt = null, starsN = 0, groundY = 640, far = mix(C.hillFar, C.duskViolet, 0.2), mid = mix(C.hillMid, C.sand2, 0.2), meadow = C.hillNear, clouds = true, tintCol = null, tintK = 0 } = {}) {
  const c = S.c;
  const T = (col) => (tintCol ? mix(col, tintCol, tintK) : col);
  const sk = sky(S, skyCols);
  let starL = null;
  if (starsN) { starL = S.layer({ par: 0.02, sh: 0, flat: true }); starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: starsN })); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const glowEl = hangL.add(`<g><circle r="210" fill="url(#warm-glow)"/></g>`);
  const sunEl = hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 900 });
  const moonEl = moonAt ? hanging(hangL, moon(c, 36), { x: moonAt[0], y: moonAt[1], len: 900 }) : null;
  const cls = clouds ? [
    { el: hanging(hangL, cloud(c, 180, T(C.cream), T('#eadcc0')), { x: 470, y: 150, len: 800 }), x: 470, y: 150, ph: 1 },
    { el: hanging(hangL, cloud(c, 130, T(C.cream), T('#eadcc0')), { x: 1010, y: 105, len: 800 }), x: 1010, y: 105, ph: 2.4 },
  ] : [];
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: groundY - 230, amps: [26, 10, 3], lens: [1100, 380, 130], color: T(far), x0: -1400, x1: 3000 }).markup);
  const midL = S.layer({ par: 0.16, sh: 3 });
  const m = hillsWith(c, { y: groundY - 150, amps: [22, 9, 3], lens: [900, 320, 120], color: T(mid), trees: 22, treeColor: T(mix(C.olive, C.moss, 0.3)), treeH: 18, x0: -1400, x1: 3000 });
  midL.add(m.markup);
  const groundL = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(groundY - 60, [8, 3], [700, 180]);
  groundL.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), T(meadow)).out());
  groundL.add(grass(c, { x0: -1200, x1: 2800, y: groundY - 60, fn: gfn, n: 70, h: 14, color: T(C.moss) }));
  return {
    sk, hangL, starL, sunEl, moonEl, midFn: m.fn, gfn, groundL, midL,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], glow = 0.5, moonX = moonAt ? moonAt[0] : 0, moonY = moonAt ? moonAt[1] : 0, moonO = 1, sunO = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6) * 1, o: sunO });
      pose(glowEl, { x: sunX, y: sunY, s: 0.8 + glow * 0.8, o: glow * sunO });
      if (moonEl) pose(moonEl, { x: moonX, y: moonY, r: Math.sin(time * 0.5 + 1) * 1, o: moonO });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.ph) * 20, y: cl.y, r: Math.sin(time * 0.6 + cl.ph) * 1.2 }));
    },
  };
}
/** a meadow foreground strip (grass, flowers, a rock) at par ~0.8 */
export function meadowFront(S, { y = 930, tintCol = null, tintK = 0, par = 0.85 } = {}) {
  const c = S.c;
  const T = (col) => (tintCol ? mix(col, tintCol, tintK) : col);
  const L = S.layer({ par, sh: 7 });
  L.add(bush(c, 120, y, 230, T(mix(C.sage, C.moss, 0.4)), T(C.moss)) + rock(c, 1470, y + 20, 230, 90, T(C.rock2)) + bush(c, 1640, y - 10, 170, T(C.moss)));
  return L;
}
/** a clump of meadow flowers (origin: ground centre), for "life in abundance" */
export function flowerClump(c, { n = 7, w = 70, h = 34, cols = [C.jesusMantle, C.lavender, C.cream, C.wheat, C.roseRobe] } = {}) {
  const s = sheet();
  let stems = '', leaves = '';
  const heads = [];
  for (let i = 0; i < n; i++) {
    const x = c.rr(-w / 2, w / 2), hh = h * c.rr(0.55, 1.1);
    stems += c.ribbon([[x, 0], [x + c.rr(-4, 4), -hh]], 1.6);
    if (i % 2) leaves += c.cut(c.ell(x + 4, -hh * 0.4, 5, 2.4, 8, -0.5), 0.2, 3);
    heads.push([x, -hh, c.pick(cols)]);
  }
  s.x(stems, C.moss2).x(leaves, C.leaf);
  heads.forEach(([x, y, col]) => { s.p(c.cut(c.star(x, y, 6.5, 3, 5, c.rr(0, 1)), 0.3, 3), col); s.x(c.poly(c.circ(x, y, 1.8, 6)), C.sun); });
  return s.out();
}

/* ================================================================== things */
/** a hand lantern hanging from the hand (hold coords; arm angle `base` keeps it upright) */
export function lanternHeld(c, base = 40) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 8, 7, 8, PI, 2 * PI, 6), 1.8), C.wood2);
  s.p(c.cut([[-9, 8], [9, 8], [11, 30], [-11, 30]], 0.3, 4), C.wood2);
  s.x(c.cut([[-6, 11], [6, 11], [7.5, 27], [-7.5, 27]], 0.2, 3), C.lampGlow);
  s.x(c.poly([[0, 14], [3, 22], [0, 25], [-3, 22]]), C.lampFlame);
  return `<g transform="rotate(${base})"><circle class="glow" cx="0" cy="20" r="60" fill="url(#warm-glow)" opacity=".8"/>${s.out()}</g>`;
}
/** a little coin pouch at the belt (hold coords) */
export function pouch(c) {
  return sheet().p(c.cut([[-8, 0], [8, 0], [11, 14], [0, 19], [-11, 14]], 0.3, 3), C.leather).x(c.ribbon([[-6, 3], [6, 3]], 1.4), C.rope).out();
}
/** a paper coin (origin centre) */
export function coin(c, r = 9) {
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.2, 3), C.sun).x(c.ribbon(c.arc(0, 0, r * 0.6, r * 0.6, 0, PI * 2, 12), 1.2), shade(C.sun, -0.25), 'opacity=".7"').out();
}
/** a dark sack slung over a thief's shoulder (hold coords) */
export function sack(c) {
  return sheet().p(c.cut(c.blob(0, 24, 16, 20, 10, 0.18), 0.5, 4), mix(C.soilDark, C.storm2, 0.4)).x(c.ribbon([[-4, 4], [4, 6]], 3), C.rope).out();
}
/**
 * a cupped hand of light, palm up, fingers toward the right (origin: centre of the palm; ~260 wide).
 * Cut from gold and cream paper, with a soft glow.
 */
export function lightHand(c, { w = 260, col = C.halo, rim = C.haloRim } = {}) {
  const k = w / 260;
  const P = (pts) => pts.map(([x, y]) => [x * k, y * k]);
  const s = sheet();
  // the forearm coming in from the lower left
  s.p(c.cut(P([[-250, 120], [-120, 22], [-84, 58], [-210, 150]]), 0.6, 8), mix(col, C.cream, 0.45));
  // the palm (a shallow cup)
  const palm = P([[-126, 20], [-110, -6], [-60, -2], [0, 2], [56, 0], [82, 8], [80, 34], [40, 50], [-30, 54], [-90, 48]]);
  s.p(c.cut(palm, 0.5, 5), rim);
  s.p(c.cut(palm.map(([x, y]) => [x * 0.97, y * 0.97 - 1]), 0.4, 5), col);
  // four fingers, from the far one to the near one, curling up at the tips
  const finger = (y0, len, lift, wd) => P(c.cbez([60, y0], [60 + len * 0.55, y0 + 4], [60 + len, y0 - lift * 0.4], [60 + len * 0.92, y0 - lift], 12));
  [[-2, 64, 40, 17], [8, 72, 44, 18], [20, 70, 40, 18], [32, 58, 32, 16]].forEach(([y0, len, lift, wd]) => {
    const f = finger(y0, len, lift, wd);
    s.p(c.ribbon(f, (u) => (wd + 3) * k * (1 - u * 0.25)), rim);
    s.p(c.ribbon(f, (u) => wd * k * (1 - u * 0.25)), col);
  });
  // the thumb rising at the back
  const th = P(c.cbez([-96, 4], [-104, -30], [-86, -62], [-66, -70], 10));
  s.p(c.ribbon(th, (u) => 24 * k * (1 - u * 0.3)), rim);
  s.p(c.ribbon(th, (u) => 20 * k * (1 - u * 0.3)), col);
  s.x(c.ribbon(P(c.arc(-20, 16, 70, 14, 0.2, PI - 0.2, 10)), 1.4 * k), rim, 'opacity=".6"');
  return `<circle r="${200 * k}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a sealed scroll (origin centre) — "this commandment I received from my Father" */
export function sealedScroll(c, w = 110) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -16], [w / 2, -16], [w / 2, 16], [-w / 2, 16]], 0.3, 6), C.parchment);
  s.p(c.cut(c.ell(-w / 2, 0, 7, 17, 12), 0.2, 3) + c.cut(c.ell(w / 2, 0, 7, 17, 12), 0.2, 3), shade(C.parchment, -0.12));
  s.p(c.ribbon([[-6, -17], [-6, 17]], 5) + c.ribbon([[6, -17], [6, 17]], 5), C.terracotta);
  s.p(c.cut(c.star(0, 0, 13, 9, 10, 0), 0.3, 3), C.sun);
  s.x(c.poly(c.star(0, 0, 6, 2.5, 5, 0)), C.star);
  return `<circle r="${w * 0.9}" fill="url(#halo-glow)" opacity=".8"/>${s.out()}`;
}
/** a reaching shadow hand (for "no one takes it / no one snatches them"); origin at the wrist, fingers to +x */
export function shadowHand(c, col = '#2a2238') {
  const s = sheet();
  s.p(c.cut([[-160, -16], [-10, -20], [10, -34], [44, -40], [60, -34], [42, -28], [30, -22], [70, -24], [76, -16], [40, -10], [72, -8], [74, 0], [38, 2], [66, 8], [62, 14], [30, 12], [10, 18], [-160, 18]], 0.8, 6), col);
  return s.out();
}
/** a small round picture plate of one of His works (origin centre): 'jar' | 'mat' | 'bread' | 'eye' | 'boy' */
export function workPlate(c, icon, { r = 46 } = {}) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 6, 32), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 32), 0.4, 5), C.cream);
  const i = sheet();
  if (icon === 'jar') {
    i.p(c.cut([[-12, 24], [-18, 6], [-19, -8], [-13, -18], [-8, -20], [-9, -26], [9, -26], [8, -20], [13, -18], [19, -8], [18, 6], [12, 24]], 0.3, 3), mix(C.stone, C.rock, 0.35));
    i.x(c.cut([[-8, 14], [-9, -9], [9, -9], [8, 14]], 0.2, 3), '#a8475a');
  } else if (icon === 'mat') {
    i.p(c.cut([[-26, 10], [26, 10], [26, 22], [-26, 22]], 0.3, 4), mix(C.wheat, C.sand2, 0.4));
    i.x(c.ribbon([[-22, 16], [22, 16]], 1.2), shade(C.wheat, -0.3));
    i.p(c.cut([[-4, 8], [-2, -20], [4, -20], [6, 8]], 0.3, 3) + c.cut(c.circ(1, -27, 7, 10), 0.3, 3), mix(C.sand2, C.stone2, 0.4));
    i.p(c.ribbon([[-2, -12], [-14, -22]], 3) + c.ribbon([[4, -12], [16, -22]], 3), mix(C.sand2, C.stone2, 0.4));
  } else if (icon === 'bread') {
    i.p(c.cut(c.blob(-10, 4, 15, 10, 10, 0.1), 0.4, 3) + c.cut(c.blob(12, 8, 13, 9, 10, 0.1), 0.4, 3) + c.cut(c.blob(0, -10, 14, 9, 10, 0.1), 0.4, 3), C.wheat2);
    i.p(c.cut([[-24, 22], [-6, 14], [12, 16], [22, 22], [12, 28], [-6, 28]], 0.3, 3), C.lake3);
  } else if (icon === 'eye') {
    i.p(c.cut([...c.arc(0, 2, 26, 16, PI, 2 * PI, 10), ...c.arc(0, -2, 26, 16, 0, PI, 10)], 0.2, 3), C.linen);
    i.x(c.poly(c.circ(0, 0, 9, 12)), C.lake3).x(c.poly(c.circ(0, 0, 4.4, 10)), C.ink).x(c.poly(c.circ(3, -3, 1.8, 6)), '#fff');
    let rays = '';
    for (let j = 0; j < 7; j++) { const a = PI + 0.3 + j * 0.42; rays += c.ribbon([[Math.cos(a) * 30, Math.sin(a) * 22], [Math.cos(a) * 38, Math.sin(a) * 30]], 2); }
    i.x(rays, C.sun);
  } else if (icon === 'boy') {
    i.p(c.cut([[-8, 24], [-10, -4], [10, -4], [8, 24]], 0.3, 3), C.skyVeil);
    i.p(c.cut(c.circ(0, -13, 9, 12), 0.3, 3), C.skin);
    i.x(c.poly(c.star(20, -18, 9, 4, 8, 0)), C.sun);
  }
  return `<circle r="${r * 1.9}" fill="url(#halo-glow)" class="pglow"/>${s.out()}${i.out()}`;
}

/* ================================================================== the Temple in winter */
/** a snow cap along a roof line from x0 to x1 at y (origin world) */
export function snowCap(c, x0, x1, y, th = 12) {
  const pts = [];
  for (let x = x0; x <= x1; x += 18) pts.push([x, y - th * c.rr(0.5, 1.1)]);
  for (let x = x1; x >= x0; x -= 26) pts.push([x, y + c.rr(2, 8)]);
  return c.cut(pts, 0.8, 8);
}
/** a small clay oil lamp on a ledge (origin: its foot); .fl flame group, .gl glow (hidden until lit) */
export function clayLamp(c) {
  const s = sheet();
  s.p(c.cut([[-12, 0], [-15, -5], [-8, -10], [6, -10], [13, -8], [20, -10], [22, -7], [14, -2], [8, 0]], 0.3, 3), C.pot);
  s.p(c.cut(c.circ(-2, -9, 3.5, 8), 0.2, 2), shade(C.pot, -0.3));
  return `${s.out()}<g class="gl" opacity="0"><circle cx="21" cy="-18" r="34" fill="url(#warm-glow)"/></g><g class="fl" opacity="0" transform="translate(21 -9)"><path d="M0 0C-4 -3 -3.5 -9 0 -16C3.5 -9 4 -3 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-1.6 -4 -1.6 -6 0 -9C1.6 -6 1.6 -4 0 -2Z" fill="#fff4d2"/></g>`;
}
/** light a clayLamp element by k (0..1) with a tiny flicker */
export function lightLamp(el, k, time = 0, seed = 0) {
  const fl = el.__fl || (el.__fl = el.querySelector('.fl'));
  const gl = el.__gl || (el.__gl = el.querySelector('.gl'));
  fade(fl, k);
  fade(gl, k * (0.8 + (time ? Math.sin(time * 7 + seed) * 0.1 : 0)));
  if (k > 0.01) pose(fl, { x: 21, y: -9, sy: 0.6 + k * 0.4 + (time ? Math.sin(time * 9 + seed * 3) * 0.06 : 0) });
}

/**
 * Solomon's Portico in winter: a grey snow sky, the Mount of Olives white-capped, the sanctuary behind with snow on
 * its roofs, the long colonnade (back wall + columns) with a ledge of clay lamps, the paved court dusted with snow,
 * falling snow in two sheets. Call front() after the actors for the near row of columns.
 * Returns { sk, lamps: [{el, x, y}], update(T, {lit, snow}), front(), PY, FLOOR }.
 */
export function winterPortico(S, { skyCols = WINTER, lamps = 16, flakes = 1, FLOOR = 700, veil = 0 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const cl = [
    hanging(hangL, cloud(c, 240, mix(C.cream, C.stone2, 0.4), mix(C.stone2, C.storm, 0.2)), { x: 420, y: 140, len: 800 }),
    hanging(hangL, cloud(c, 200, mix(C.cream, C.stone2, 0.3), mix(C.stone2, C.storm, 0.2)), { x: 1150, y: 110, len: 800 }),
  ];
  // the Mount of Olives in snow
  const far = S.layer({ par: 0.08, sh: 2 });
  const hf = c.wave(380, [22, 8], [1000, 300]);
  far.add(sheet().p(c.ridge(hf, -1400, 3000, 1400, 14, 1), mix(C.hillFar, C.stone2, 0.4)).x(c.ridge((x) => hf(x) + 6, -1400, 3000, 1400, 14, 1), mix(C.hillFar, C.stone2, 0.4)).out());
  far.add(`<path d="${c.cut([...Array.from({ length: 60 }, (_, i) => { const x = -1400 + i * 75; return [x, hf(x) - 2]; }), ...Array.from({ length: 60 }, (_, i) => { const x = -1400 + (59 - i) * 75; return [x, hf(x) + 16 + Math.sin(x * 0.03) * 7]; })], 0.6, 10)}" fill="${SNOW}"/>`);
  let trees = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-600, 2200); trees += c.cut(c.blob(x, hf(x) + 26 + c.rr(0, 30), 10, 7, 8, 0.2), 0.4, 3); }
  far.add(`<path d="${trees}" fill="${mix(C.olive, C.stone2, 0.45)}"/>`);
  // the sanctuary rising behind its court, roofs in snow
  const sL = S.layer({ par: 0.14, sh: 4 });
  const PY = FLOOR - 70;
  sL.add(`<g transform="translate(800 ${PY - 150})">${tintW(sanctuaryW(c, 1.25))}</g>`);
  const sn = sheet();
  const SC = 1.25;
  sn.p(snowCap(c, 800 - 60 * SC - 6, 800 + 60 * SC + 6, PY - 150 - 250 * SC - 8, 10) + snowCap(c, 800 - 96 * SC - 6, 800 - 60 * SC, PY - 150 - 150 * SC - 6, 8) + snowCap(c, 800 + 60 * SC, 800 + 96 * SC + 6, PY - 150 - 150 * SC - 6, 8), SNOW);
  sL.add(sn.out());
  const iw = sheet();
  iw.p(c.cut([[180, PY - 90], [200, PY - 150], [1400, PY - 150], [1420, PY - 90]], 0.6, 12), mix(C.cream, C.stone, 0.4));
  iw.p(snowCap(c, 196, 1404, PY - 150, 9), SNOW);
  sL.add(iw.out());
  // Solomon's Portico: the back wall and columns of the colonnade
  const back = S.layer({ par: 0.3, sh: 4 });
  back.add(tintW(portico(c, -1400, 3000, PY, 196, { step: 104 })));
  back.add(sheet().p(snowCap(c, -1410, 3010, PY - 218, 14), SNOW).out());
  // the paved court, snow in the corners
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-1800, PY], [3400, PY], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.stone, C.stone2, 0.4));
  let tiles = '';
  for (let i = 0; i < 9; i++) { const y = PY + 12 + i * i * 7 + i * 10; tiles += c.ribbon([[-1800, y], [3400, y + c.rr(-2, 2)]], 1.3); }
  for (let x = -1800; x < 3400; x += 100) tiles += c.ribbon([[x, PY], [800 + (x - 800) * 2.2, 1800]], 1.2);
  f.x(tiles, shade(C.stone2, -0.16), 'opacity=".45"');
  let drifts = '';
  for (let i = 0; i < 18; i++) { const x = c.rr(-900, 2500), y = PY + c.rr(8, 300); if (Math.abs(x - 800) < 330 && y > PY + 40) continue; drifts += c.cut(c.blob(x, y, c.rr(40, 110), c.rr(5, 12), 12, 0.3), 0.6, 8); }
  f.x(drifts, SNOW, 'opacity=".85"');
  f.p(c.cut([[-1800, PY - 4], [3400, PY - 4], [3400, PY + 8], [-1800, PY + 8]], 0.4, 20), SNOW);
  floorL.add(f.out());
  // evening / night falling over the stones (the lamps stay bright above it)
  if (veil) S.layer({ par: 0.4, sh: 0, flat: true }).add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity="${veil}"/>`);
  // the ledge of little lamps along the portico's step
  const lampL = S.layer({ par: 0.4, sh: 2 });
  const ls = [];
  for (let i = 0; i < lamps; i++) {
    const x = lerp(-120, 1720, (i + 0.5) / lamps);
    ls.push({ x, y: PY + 2, el: lampL.add(`<g transform="translate(${x.toFixed(1)} ${PY + 2}) scale(1.4)">${clayLamp(c)}</g>`) });
  }
  // falling snow: two sheets that slide on the compositor
  const mkSnow = (n, r0, r1, par, o) => {
    const L = S.layer({ par, sh: 0, flat: true, pad: 320 });
    let d = '';
    for (let i = 0; i < n; i++) { const x = c.rr(-1200, 2800), y = c.rr(-900, 1600), r = c.rr(r0, r1); d += c.poly(c.circ(x, y, r, 6)); }
    L.add(`<path d="${d}" fill="#ffffff" opacity="${o}"/>`);
    return L;
  };
  const snowA = flakes ? mkSnow(220, 2.2, 4.2, 0.2, 0.85) : null;
  return {
    sk, back, lampL, floorL, lamps: ls, PY, FLOOR, hangL,
    update(T, { lit = 1, snow = 1 } = {}) {
      cl.forEach((el, i) => pose(el, { x: [420, 1150][i] + Math.sin(T * 0.08 + i) * 20, y: [140, 110][i], r: Math.sin(T * 0.5 + i) * 1 }));
      ls.forEach((l, i) => lightLamp(l.el, typeof lit === 'function' ? lit(i) : lit, T, i));
      if (snowA) { snowA.shift(Math.sin(T * 0.3) * 30, ((T * 26) % 300) - 150); snowA.fade(snow); }
    },
    snowFront() {
      const L = mkSnow(80, 4, 7, 0.8, 0.9);
      return { L, update(T, o = 1) { L.shift(Math.sin(T * 0.4 + 1) * 40, ((T * 48) % 300) - 150); L.fade(o); } };
    },
    front({ xs = [170, 1430] } = {}) { return frontColumns(S, xs); },
  };
}
const WTINT = '#cdd6e0';
function tintW(markup) { return markup.replace(/#[0-9a-fA-F]{6}\b/g, (h) => (h.toLowerCase() === '#ffffff' ? h : mix(h, WTINT, 0.18))); }
function sanctuaryW(c, sc) { return sanctuaryM(c, sc, { glow: false }); }
import { sanctuary as sanctuaryM, portico } from '../mark11/lib.js';
/** two great snowy columns in the foreground framing the portico */
function frontColumns(S, xs) {
  const c = S.c;
  const L = S.layer({ par: 0.9, sh: 7 });
  const COL = mix(mix(C.cream, C.stone, 0.4), WTINT, 0.2);
  const s = sheet();
  const y = 1000, h = 860;
  xs.forEach((x) => {
    s.p(c.cut([[x - 46, y], [x - 42, y - h], [x + 42, y - h], [x + 46, y]], 0.5, 12), COL);
    s.p(c.cut([[x - 66, y - h + 40], [x - 58, y - h], [x + 58, y - h], [x + 66, y - h + 40]], 0.4, 8), shade(COL, -0.06));
    let fl = '';
    for (let k = -3; k <= 3; k++) fl += c.ribbon([[x + k * 11, y - 10], [x + k * 10.5, y - h + 50]], 2.4);
    s.x(fl, shade(COL, -0.14), 'opacity=".55"');
  });
  s.p(c.cut([[-900, -600], [2500, -600], [2500, y - h - 6], [-900, y - h - 6]], 0.6, 20), mix(COL, C.sand, 0.15));
  let dent = '';
  for (let x = -900; x < 2500; x += 22) dent += c.poly(c.rect(x, y - h - 26, 11, 12));
  s.x(dent, shade(COL, -0.2), 'opacity=".6"');
  L.add(s.out());
  return L;
}

/* ================================================================== people helpers */
/** make puppets from a list of { look, x, y, s, flip, face } on layer L */
export function cast(S, L, list, seed = 'cast') {
  const c = makeCutter(S.c.rr(0, 1e6) + seed);
  return list.map((o, i) => {
    let m = person(c, o.look);
    if (o.face) m = m.replace('</g></g><g class="armF"', `${faceBitsL(c)}</g></g><g class="armF"`);
    const el = L.add(m);
    return { ...o, i, seed: c.rr(0, 9), p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]') };
  });
}
import { faceBits as faceBitsL } from '../mark3/lib.js';
/** hide face bits */
export function mood(m, { angry = 0, sad = 0 } = {}) { fade(m.angry, angry); fade(m.sad, sad); }

/* ================================================================== the Temple court by day (Jn 10,1 and 10,19–21) */
import { templeCourt as court11, courtFront as front11 } from '../mark11/lib.js';
import { leader as leader8, listener as listener8 } from '../john8/lib.js';
import { blinkAt } from '../../assets/people.js';
export const DC = { FLOOR: 700, JX: 800 };
/**
 * The Court of the Gentiles in the morning: listeners and the man who now sees on the left, some of the leaders
 * on the right, Jesus between. Returns { court, back, act, fx, jesus, seer, lis, lead, set(T, {...}), front() }.
 */
export function dayCourt(S, { skyCols = MORNING, nLis = 4, nLead = 5 } = {}) {
  const court = court11(S, { skyCols, floorY: 640, sunAt: [1240, 140] });
  const back = S.layer({ par: 0.48, sh: 4 });
  const act = S.layer({ par: 0.54, sh: 6 });
  const cc = makeCutter('j10-day-court');
  const LIS = [[452, 700, 0.98], [540, 706, 1.02], [500, 664, 0.9], [586, 668, 0.9]].slice(0, nLis);
  const LEAD = [[972, 706, 1.02], [1060, 700, 1.0], [1146, 708, 1.02], [1016, 666, 0.9], [1104, 664, 0.9]].slice(0, nLead);
  const lisLooks = [listener8(cc, 0), listener8(cc, 1), listener8(cc, 4), listener8(cc, 3)];
  const lead = cast(S, back, LEAD.slice(3).map(([x, y, s], i) => ({ look: leader8(i + 3), x, y, s, face: true })), 'lb')
    .concat(cast(S, act, LEAD.slice(0, 3).map(([x, y, s], i) => ({ look: leader8(i), x, y, s, face: true })), 'la'));
  lead.sort((a, b) => a.x - b.x).forEach((m, i) => (m.i = i));
  const lis = cast(S, back, LIS.slice(2).map(([x, y, s], i) => ({ look: lisLooks[i + 2], x, y, s, face: true })), 'sb')
    .concat(cast(S, act, LIS.slice(0, 2).map(([x, y, s], i) => ({ look: lisLooks[i], x, y, s, face: true })), 'sa'));
  lis.sort((a, b) => a.x - b.x).forEach((m, i) => (m.i = i));
  const seer = cast(S, act, [{ look: SEEING, x: 672, y: 704, s: 1.0, face: true }], 'seer')[0];
  const jesus = S.puppet(act.add(person(cc, CAST.jesus)));
  const fx = S.layer({ par: 0.58, sh: 5 });
  return {
    court, back, act, fx, jesus, seer, lis, lead,
    set(T, { j = {}, seerO = {}, lisF = () => ({}), leadF = () => ({}) } = {}) {
      jesus.set({ x: DC.JX, y: DC.FLOOR + 8, s: 1.06, armF: 14, armB: 8, blink: blinkAt(T, 1), ...j });
      const so = seerO || {};
      seer.p.set({ x: seer.x, y: seer.y, s: seer.s, armF: 12, armB: 6, blink: blinkAt(T, 3), ...so }); mood(seer, so);
      lis.forEach((m) => { const o = lisF(m) || {}; m.p.set({ x: m.x, y: m.y, s: m.s, armF: 12, armB: 8, blink: blinkAt(T, m.seed), ...o }); mood(m, o); });
      lead.forEach((m) => { const o = leadF(m) || {}; m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, armF: 18, armB: 10, blink: blinkAt(T, m.seed), ...o }); mood(m, { angry: 0.25, ...o }); });
    },
    front() { return front11(S, { xs: [200, 1400] }); },
  };
}

/* ================================================================== paths */
/** point at fraction u (0..1, by length) along a polyline; returns [x, y, dirX] */
export function polyAt(pts, u) {
  const L = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let s = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < L.length; i++) {
    if (s <= L[i] || i === L.length - 1) {
      const k = L[i] ? Math.min(1, s / L[i]) : 0, a = pts[i], b = pts[i + 1];
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.sign(b[0] - a[0]) || 1];
    }
    s -= L[i];
  }
  const e = pts[pts.length - 1];
  return [e[0], e[1], 1];
}
/** total length of a polyline */
export function polyLen(pts) { let t = 0; for (let i = 1; i < pts.length; i++) t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return t; }
/** a clip group (world coords) around a puppet: returns markup; get the puppet via el.firstElementChild */
export function clipped(S, name, [x0, y0, x1, y1], inner) {
  const id = S.id('clip-' + name);
  S.defs(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`);
  return `<g clip-path="url(#${id})">${inner}</g>`;
}
