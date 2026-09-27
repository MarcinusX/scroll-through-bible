// John 5 — the cast and cut-outs of this chapter: the pool of Bethesda by the Sheep Gate with its five
// porticoes (a turquoise pool between colonnades, a plan of the five porches, the stirring of the water),
// the man ill for thirty-eight years and his mat, the Sabbath, and the props of the great discourse:
// the carpenter's bench in the Father's light, grey and coloured sheets, tombs with small lights, John's
// lamp, the scrolls of the Scriptures, a glittering mask, and Moses with the tablets.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, grass, sun, cloud, cypress, olive, rock, flowers } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { portico, jerusalem } from '../mark11/lib.js';
import { bigBalance as bigBalance2 } from '../john2/lib.js';
import { saw as sawM, hammer as hammerM, square as squareM } from '../mark6/lib.js';

export { kf, moving, hand, speech, thought, GLYPH, spark, heart, wordSlip, rolledMat, pallet, candle, sabbathTag, scrollOpen, scrollRolled, addToHead, turban } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, card, headAt, handAt, silhouette, shadowPerson, pharisee, scribe as scribeOpts } from '../mark3/lib.js';
export { voiceRings, hang2, tagOnString, plate, crutch, sparkle, JOHN_B, flame, footprint } from '../mark1/lib.js';
export { say, qmark, bang, slip, lawTablets, lightThrone, tick } from '../mark10/lib.js';
export { priest, elder, templeCourt, courtFront, portico, pennant, clothBanner, jerusalem, sanctuary } from '../mark11/lib.js';
export { soulLight, glory, heavenPanel, lightCrown } from '../mark8/lib.js';
export { workbench, saw, hammer, square, sheep, storyFrame, SEPIA, crossX, portrait } from '../mark6/lib.js';
export { maskOnStick, longScroll, purse } from '../mark12/lib.js';
export { mask, hourglass, word as wordLabel } from '../mark13/lib.js';
export { tomb } from '../mark5/lib.js';
export { eyePatch } from '../mark9/lib.js';
export { vis, wordTag, discPlate } from '../mark14/lib.js';
export { miniHead, medallion, tombIcon } from '../mark16/lib.js';
export { MOSES, LEVITE, wordFlame, radiance, rayBurst, eternityRing, drawRing, hungWord, hungPlate, smallAngel, darkSheet, glowDisc } from '../john1/lib.js';
export { signBadge, bigBalance, heartWindow, openWindow, iconBubble, verseScroll, dayDisc } from '../john2/lib.js';
export { ghost, roundel, panel, sepia } from '../john4/lib.js';
export { beamGrad, lightBeam, darkPool, cradle } from '../john3/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, crowdPerson, lerp };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== palettes */
export const DAY = ['#cfe2dc', '#f0e7cd', '#f7ead0'];
export const FEAST = ['#c9e0dc', '#f2e4c4', '#f8e2bf'];
export const WARM = ['#e8d3b0', '#f3dfbc', '#f7e8cd'];
export const DUSK = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
export const NIGHT = ['#1e2552', '#2f3668', '#50507e'];
export const GOLD = ['#f1d9a8', '#f6e6c4', '#f8eed8'];
export const GREY = ['#b9b8b6', '#cfcdc8', '#dcd9d2'];

/* water of the pool: turquoise cut from the lake papers */
export const POOL = mix(C.lake, C.teal2, 0.12);
export const POOL_LT = mix(C.lake, C.skyBlue, 0.45);
export const POOL_DK = mix(C.lake2, C.teal2, 0.3);

/* ================================================================== the cast */
/** the man who had been ill for thirty-eight years: a worn, sand-grey robe, a grizzled beard */
export const LAME = { robe: mix(C.sand2, C.stone2, 0.45), mantle: null, belt: C.rope, hair: mix(C.hair2, C.greyHair, 0.45), hairStyle: 'short', beard: 'full', beardColor: mix(C.hair2, C.greyHair, 0.55), skin: C.skin3 };
/** the same man healed: the same robe, a clean sash of colour */
export const HEALED = { ...LAME, belt: C.terracotta };
/** the sick lying and sitting in the porticoes */
export function sickLook(c, i = 0) {
  const o = crowdPerson(c);
  o.robe = [C.stone2, mix(C.sand2, C.stone, 0.4), C.linen2, mix(C.dustyBlue, C.stone, 0.45), mix(C.sageRobe, C.stone, 0.4), mix(C.mauve, C.stone, 0.45)][i % 6];
  o.mantle = null;
  return o;
}
/** a cloth band tied over the eyes of a blind man (head coords) */
export function blindBand(c) {
  return `<path d="${c.ribbon([[-18, -4], [4, -5], [20, -3]], 7)}" fill="${C.stone2}"/><path d="${c.ribbon([[-18, -4], [-26, 4], [-24, 12]], 3)}" fill="${C.stone2}"/>`;
}
/** a leader among "the Jews" (mark11 priests & elders, the mark3 Pharisees): opts only */
export function leaderOpts(i = 0) {
  const robes = [C.linen2, C.stone, C.linen, C.wheatRobe];
  const mantles = [C.dustyBlue, shade(C.indigo, 0.25), C.tealRobe, C.plumRobe];
  return {
    robe: robes[i % 4], mantle: mantles[i % 4], skin: [C.skin2, C.skin, C.skin3][i % 3],
    hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: [C.dustyBlue, C.indigo, C.tealRobe, C.plumRobe][i % 4],
    beard: i % 2 ? 'wild' : 'full', beardColor: [C.greyHair, C.hair3, C.hair][i % 3], belt: i % 2 ? C.sun : C.leather,
  };
}

/* ================================================================== small props */
/** a string of little festival pennants (origin: left end of the cord), sagging `sag` in the middle */
export function bunting(c, w = 900, sag = 50, cols = [C.terracotta, C.ochre, C.teal2, C.roseRobe, C.sageRobe]) {
  const cord = c.qbez([0, 0], [w / 2, sag * 2], [w, 0], 24);
  const s = sheet();
  const n = Math.round(w / 38);
  const fl = cols.map(() => '');
  for (let i = 1; i < n; i++) {
    const u = i / n, x = w * u, y = (1 - u) * u * 4 * sag;
    fl[i % cols.length] += c.cut([[x - 12, y], [x + 12, y + 1], [x + 1, y + 30]], 0.3, 4);
  }
  fl.forEach((d, i) => { if (d) s.p(d, cols[i]); });
  return `<path d="${c.line(cord)}" stroke="${C.wood2}" stroke-width="1.6" fill="none"/>${s.out()}`;
}
/** ripple ring on a flat water surface (origin centre), ellipse r × r·0.24 */
export function ripple(c, r = 60, col = C.foam, w = 3.2) {
  return `<path d="${c.ribbon(c.arc(0, 0, r, r * 0.24, 0, PI * 2, 30), w)}" fill="${col}" opacity=".85"/>`;
}
/** the Sheep Gate: a stone gate-tower with a round arch; origin: middle of its base */
export function sheepGate(c, { w = 170, h = 250 } = {}) {
  const s = sheet();
  const col = mix(C.stone, C.sand, 0.3), col2 = shade(col, -0.08);
  const pts = [[-w / 2, 0], [-w / 2, -h]];
  for (let x = -w / 2; x < w / 2 - 12; x += 24) pts.push([x, -h], [x, -h - 14], [x + 12, -h - 14], [x + 12, -h]);
  pts.push([w / 2, -h], [w / 2, 0]);
  const aw = w * 0.46, ah = h * 0.58;
  const arch = [[-aw / 2, 1], [-aw / 2, -ah + aw / 2], ...c.arc(0, -ah + aw / 2, aw / 2, aw / 2, PI, 2 * PI, 12), [aw / 2, 1]];
  s.p(c.cut(pts, 0.5, 8) + c.hole(arch, 0.3, 5), col);
  let d = '';
  for (let y = -h + 18; y < -4; y += 16) {
    d += c.ribbon([[-w / 2 + 2, y], [w / 2 - 2, y + c.rr(-1, 1)]], 1.1);
    for (let x = -w / 2 + c.rr(4, 30); x < w / 2 - 4; x += c.rr(26, 46)) if (Math.abs(x) > aw / 2 + 4 || y < -ah - 6) d += c.ribbon([[x, y], [x, y + 15]], 1);
  }
  s.x(d, shade(col, -0.18), 'opacity=".5"');
  s.p(c.ribbon(c.arc(0, -ah + aw / 2, aw / 2 + 6, aw / 2 + 6, PI, 2 * PI, 12), 9), col2);
  // the gate's two wooden leaves, folded open
  s.p(c.cut([[-aw / 2 - 2, 0], [-aw / 2 - 2, -ah + aw / 2], [-aw / 2 - 16, -ah + aw / 2 + 6], [-aw / 2 - 16, -4]], 0.3, 4) + c.cut([[aw / 2 + 2, 0], [aw / 2 + 2, -ah + aw / 2], [aw / 2 + 16, -ah + aw / 2 + 6], [aw / 2 + 16, -4]], 0.3, 4), C.wood2);
  // a small window slit and a carved lamb over the arch
  s.x(c.poly(c.rect(-4, -h + 26, 8, 20)), mix(C.soilDark, C.wood2, 0.3), 'opacity=".8"');
  const lamb = sheet().p(c.cut(c.blob(0, -ah - 28, 17, 10, 12, 0.22), 0.6, 3), C.linen).p(c.cut(c.ell(15, -ah - 33, 6, 5, 10), 0.2, 2), mix(C.inkSoft, C.stone2, 0.4)).p(c.ribbon([[-8, -ah - 20], [-8, -ah - 12]], 2.4) + c.ribbon([[8, -ah - 20], [8, -ah - 12]], 2.4), mix(C.inkSoft, C.stone2, 0.4));
  return s.out() + lamb.out();
}

/**
 * The plan of the pool, seen from above: two basins, four colonnades round the edge and a fifth across the
 * middle. Origin centre. Returns { base, cols: [markup ×5] (gold overlays, numbered) } — light them one by one.
 */
export function planPlate(c, { w = 340, h = 230 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 16, -h / 2 - 16, w + 32, h + 32), 0.6, 8), C.wood3);
  s.p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12), 0.5, 8), C.parchment);
  // the basins (a trapezoid double pool, as it was dug)
  const m = 20;
  s.p(c.cut([[-w / 2 + m + 14, -h / 2 + m + 14], [-10, -h / 2 + m + 18], [-12, h / 2 - m - 14], [-w / 2 + m + 18, h / 2 - m - 10]], 0.6, 6), POOL);
  s.p(c.cut([[12, -h / 2 + m + 18], [w / 2 - m - 14, -h / 2 + m + 12], [w / 2 - m - 18, h / 2 - m - 12], [10, h / 2 - m - 14]], 0.6, 6), POOL);
  s.x(c.ribbon([[-w / 2 + 60, -20], [-50, -24]], 2) + c.ribbon([[-w / 2 + 80, 20], [-40, 16]], 2) + c.ribbon([[50, -10], [w / 2 - 60, -14]], 2) + c.ribbon([[40, 30], [w / 2 - 70, 26]], 2), C.foam, 'opacity=".7"');
  // colonnades: a roof strip with little round columns
  const rows = [
    [[-w / 2 + m, -h / 2 + m], [w / 2 - m, -h / 2 + m]],
    [[w / 2 - m, -h / 2 + m], [w / 2 - m, h / 2 - m]],
    [[w / 2 - m, h / 2 - m], [-w / 2 + m, h / 2 - m]],
    [[-w / 2 + m, h / 2 - m], [-w / 2 + m, -h / 2 + m]],
    [[0, -h / 2 + m], [0, h / 2 - m]],
  ];
  const colDots = (a, b, col) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 22);
    let d = c.ribbon([a, b], 12);
    let dots = '';
    for (let i = 0; i <= n; i++) dots += c.poly(c.circ(lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n), 4.2, 8));
    return `<path d="${d}" fill="${col}"/><path d="${dots}" fill="${shade(col, -0.25)}"/>`;
  };
  let grey = '';
  rows.forEach(([a, b]) => { grey += colDots(a, b, mix(C.stone2, C.parchment, 0.2)); });
  const numAt = [[0, -h / 2 - 2], [w / 2 + 2, 0], [0, h / 2 + 2], [-w / 2 - 2, 0], [0, 0]];
  const cols = rows.map(([a, b], i) => {
    const [nx, ny] = numAt[i];
    const off = i === 4 ? [0, 0] : [nx * 0.12, ny * 0.14];
    return `${colDots(a, b, C.sun)}<g transform="translate(${(nx + off[0]).toFixed(1)} ${(ny + off[1]).toFixed(1)})"><circle r="15" fill="${C.terracotta}"/><text x="0" y="6.5" text-anchor="middle" font-family="${FONT}" font-size="19" font-style="italic" fill="${C.cream}">${i + 1}</text></g>`;
  });
  return { base: s.out() + grey, cols };
}

/** a hanging board of 38 tally marks in bundles of five (origin: top centre); marks carry data-i, .num is the counter */
export function tallyBoard(c, n = 38, { w = 470, h = 150 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 10, 0, w + 20, h + 10), 0.6, 8), C.wood3);
  s.p(c.cut(c.rect(-w / 2, 8, w, h - 6), 0.5, 8), C.parchment);
  s.x(c.ribbon([[w / 2 - 112, 22], [w / 2 - 112, h - 12]], 1.4), C.terracotta, 'opacity=".35"');
  let marks = '';
  for (let i = 0; i < n; i++) {
    const b = Math.floor(i / 5), k = i % 5;
    const row = Math.floor(b / 4), col = b % 4;
    const bx = -w / 2 + 30 + col * 76, by = 28 + row * 58;
    const d = k < 4 ? c.ribbon([[bx + k * 12, by], [bx + k * 12 + c.rr(-2, 2), by + 42]], 3.4) : c.ribbon([[bx - 6, by + 32], [bx + 48, by + 8]], 3.4);
    marks += `<path data-i="${i}" d="${d}" fill="${C.ink}" opacity="0"/>`;
  }
  const hang = `<path d="M${-w * 0.36} -1600V4M${w * 0.36} -1600V4" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return `${hang}${s.out()}${marks}<text class="num" x="${w / 2 - 56}" y="${h / 2 + 14}" text-anchor="middle" font-family="${FONT}" font-size="46" font-style="italic" fill="${C.terracotta}"></text><text x="${w / 2 - 56}" y="${h / 2 + 44}" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.inkSoft}">${tr('lat', 'years')}</text>`;
}

/* ================================================================== people on mats */
/**
 * A person lying on his back on a mat, head to the right: returns markup of a group whose inner .fig can be
 * made a puppet (arms/head/blink). Origin: the middle of the mat on the floor. s: puppet scale.
 */
export function lyingOn(c, o, { s = 0.72, w = 190, mat = true, eyes = 'open', k } = {}) {
  const matM = mat ? `<g transform="translate(0 -12)">${matFlat(c, w)}</g>` : '';
  // rotate a standing puppet onto its back: feet at the left, head at the right
  const L = 167 * s;
  const px = -L / 2 - 6, py = -24 * s - 10;
  return `<g${k_(k)}>${matM}<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(-1 1) rotate(-90) scale(${s})"><g class="rot">${person(c, { ...o, eyes })}</g></g></g>`;
}
/** a flat woven sleeping-mat seen from the front (origin centre of its top) */
export function matFlat(c, w = 190) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, -1], [w / 2 + 3, 10], [-w / 2 - 3, 11]], 0.4, 8), C.basket);
  let weave = '';
  for (let x = -w / 2 + 8; x < w / 2 - 4; x += 11) weave += c.ribbon([[x, 1], [x + 3, 9]], 2.2);
  s.x(weave, shade(C.basket, -0.22), 'opacity=".7"');
  let fr = '';
  for (let i = 0; i < 4; i++) fr += c.ribbon([[-w / 2 - 2, 2 + i * 2.6], [-w / 2 - 10, 3 + i * 3]], 1.2) + c.ribbon([[w / 2 + 2, 2 + i * 2.6], [w / 2 + 10, 3 + i * 3]], 1.2);
  s.x(fr, C.wheat2);
  return s.out();
}
/** the mat rolled up and tied, carried on the shoulder (origin: its centre) */
export function matRoll(c, w = 110) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -9], [w / 2, -9], [w / 2, 9], [-w / 2, 9]], 0.4, 8), C.basket);
  let weave = '';
  for (let x = -w / 2 + 6; x < w / 2; x += 10) weave += c.ribbon([[x, -8], [x + 2, 8]], 1.8);
  s.x(weave, shade(C.basket, -0.22), 'opacity=".6"');
  s.p(c.cut(c.ell(w / 2, 0, 5, 10, 12), 0.3, 3), shade(C.basket, 0.14));
  s.x(c.ribbon(c.arc(w / 2, 0, 3.4, 6.4, 0, PI * 3, 12), 1.1), C.wood2);
  s.p(c.ribbon([[-w * 0.28, -10], [-w * 0.28 + 2, 10]], 3.6) + c.ribbon([[w * 0.24, -10], [w * 0.24 + 2, 10]], 3.6), C.rope);
  return s.out();
}
/** a plain walking staff (origin at its foot, rising to -h) */
export function staff(c, h = 150) {
  return sheet().p(c.ribbon([[0, 0], [c.rr(-2, 2), -h * 0.5], [0, -h]], 4.4), C.wood2).p(c.cut(c.circ(0, -h, 4, 8), 0.2, 2), C.wood).out();
}
/** little marks for "a long time": a sand-glass cut from paper (origin centre) */
export function sandGlass(c, h = 70) {
  const s = sheet();
  const w = h * 0.5;
  s.p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 8, w + 12, 8), 0.2, 4) + c.cut(c.rect(-w / 2 - 6, h / 2, w + 12, 8), 0.2, 4), C.wood2);
  s.p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2], [3, -2], [3, 2], [w / 2, h / 2], [-w / 2, h / 2], [-3, 2], [-3, -2]], 0.3, 4), mix(C.skyBlue, C.cream, 0.4));
  s.p(c.cut([[-w * 0.18, -h * 0.12], [w * 0.18, -h * 0.12], [2, -2], [-2, -2]], 0.2, 3) + c.cut([[-w / 2 + 4, h / 2 - 2], [w / 2 - 4, h / 2 - 2], [w * 0.1, h * 0.14], [-w * 0.1, h * 0.14]], 0.2, 3), C.sand2);
  return s.out();
}

/* ================================================================== Bethesda */
export const BZ = { floor: 700, back: 548, waterFront: 628, rim: 664, stepX: 1040, stepW: 116, porticoY: 540 };
/**
 * The pool of Bethesda: sky, hills and Jerusalem with the Temple, the long back portico with the Sheep Gate
 * on the left, the turquoise water, the near waterline (in front of anyone standing in the pool), the stone rim
 * with steps going down, the paved walk in front and tall near columns framing the stage.
 * Returns { sk, hangL, sunEl, cl, backL, sickBackL, poolL, rippleL, actL, frontL, flyL, F } — put bathers in
 * actL *before* calling set.waterline() (the waterline piece is added by that call); add everyone else after it.
 */
export function bethesdaSet(S, { skyCols = DAY, sunAt = [1220, 150], frontCols = true } = {}) {
  const c = S.c;
  const F = BZ;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl = hanging(hangL, cloud(c, 190), { x: 470, y: 140, len: 700 });

  // hills & the city with the Temple on its platform
  const far = S.layer({ par: 0.1, sh: 2 });
  far.add(hillsWith(c, { y: 400, amps: [20, 8, 3], lens: [1200, 400, 140], color: mix(C.hillMid, C.hillFar, 0.5), trees: 30, treeColor: mix(C.olive, C.hillMid, 0.3), treeH: 16, x0: -1400, x1: 3000 }).markup);
  const city = S.layer({ par: 0.14, sh: 3 });
  city.add(`<g transform="translate(560 452)">${jerusalem(c, 0.62)}</g>`);

  // the back portico, broken by the Sheep Gate on the left
  const backL = S.layer({ par: 0.24, sh: 4 });
  const PY = F.porticoY, gx = 300;
  const walk = sheet().p(c.cut([[-1600, PY - 4], [3200, PY - 4], [3200, F.back + 14], [-1600, F.back + 14]], 0.6, 20), mix(C.stone, C.sand, 0.4));
  backL.add(walk.out());
  backL.add(portico(c, -1400, gx - 80, PY, 170, { step: 58 }) + portico(c, gx + 80, 3000, PY, 170, { step: 58 }));
  backL.add(`<g transform="translate(${gx} ${PY + 2})">${sheepGate(c)}</g>`);
  const sickBackL = S.layer({ par: 0.24, sh: 3 });

  // the water
  const poolL = S.layer({ par: 0.4, sh: 2 });
  const w = sheet();
  w.p(c.cut([[-1600, F.back], [3200, F.back], [3200, 760], [-1600, 760]], 0.4, 20), POOL);
  // the far edge of the basin: a stone lip with its reflection
  w.p(c.cut([[-1600, F.back - 8], [3200, F.back - 8], [3200, F.back + 6], [-1600, F.back + 6]], 0.4, 20), mix(C.stone, C.sand, 0.25));
  w.x(c.cut([[-1600, F.back + 6], [3200, F.back + 6], [3200, F.back + 26], [-1600, F.back + 26]], 0.8, 30), POOL_DK, 'opacity=".55"');
  // reflected columns shimmer in the water
  let refl = '';
  for (let x = -1400; x < 3000; x += 58) if (Math.abs(x - gx) > 90) refl += c.cut([[x - 6, F.back + 12], [x + 6, F.back + 12], [x + 4 + c.rr(-2, 2), F.back + 64], [x - 4 + c.rr(-2, 2), F.back + 64]], 0.8, 6);
  w.x(refl, POOL_LT, 'opacity=".45"');
  let gl = '';
  for (let i = 0; i < 60; i++) { const x = c.rr(-1400, 3000), y = c.rr(F.back + 30, F.waterFront - 6), l = c.rr(16, 60); gl += c.ribbon([[x, y], [x + l * 0.5, y - 1.5], [x + l, y]], 2); }
  w.x(gl, C.foam, 'opacity=".6"');
  poolL.add(w.out());
  const rippleL = S.layer({ par: 0.4, sh: 1, flat: true });

  // the paved walk (behind anyone on it)
  const actL = S.layer({ par: 0.4, sh: 5 });
  const f = sheet();
  f.p(c.cut([[-1800, F.rim + 18], [3400, F.rim + 18], [3400, 1800], [-1800, 1800]], 0.6, 30), mix(C.stone, C.sand, 0.35));
  let tiles = '';
  for (let i = 0; i < 8; i++) { const y = F.rim + 30 + i * i * 8 + i * 12; tiles += c.ribbon([[-1800, y], [3400, y + c.rr(-2, 2)]], 1.3); }
  for (let x = -1800; x < 3400; x += 96) tiles += c.ribbon([[x, F.rim + 20], [800 + (x - 800) * 2.3, 1800]], 1.2);
  f.x(tiles, shade(C.stone, -0.18), 'opacity=".4"');
  actL.add(f.out());

  /** the near waterline + stone rim with its steps: call after adding the bathers to actL */
  const waterline = () => {
    const s = sheet();
    const x0 = F.stepX - F.stepW / 2, x1 = F.stepX + F.stepW / 2;
    const fn = c.wave(F.waterFront, [3, 1.2], [140, 50]);
    const top = [];
    for (let x = -1800; x <= 3400; x += 14) top.push([x, fn(x)]);
    s.p(c.poly([...top, [3400, F.rim + 10], [-1800, F.rim + 10]]), POOL);
    s.x(c.ribbon(top.map(([x, y]) => [x, y + 1.5]), 2.6), POOL_LT, 'opacity=".9"');
    let gl2 = '';
    for (let i = 0; i < 40; i++) { const x = c.rr(-1400, 3000), y = c.rr(F.waterFront + 8, F.rim - 4), l = c.rr(14, 44); gl2 += c.ribbon([[x, y], [x + l * 0.5, y - 1.2], [x + l, y]], 1.8); }
    s.x(gl2, C.foam, 'opacity=".5"');
    // the stone rim, broken where the steps go down
    const stone = mix(C.stone, C.sand, 0.2);
    s.p(c.cut([[-1800, F.rim - 2], [x0, F.rim - 2], [x0, F.rim + 22], [-1800, F.rim + 22]], 0.4, 12) + c.cut([[x1, F.rim - 2], [3400, F.rim - 2], [3400, F.rim + 22], [x1, F.rim + 22]], 0.4, 12), stone);
    s.x(c.ribbon([[-1800, F.rim + 1], [x0, F.rim + 1]], 3) + c.ribbon([[x1, F.rim + 1], [3400, F.rim + 1]], 3), shade(stone, 0.3), 'opacity=".8"');
    let joints = '';
    for (let x = -1800 + 40; x < 3400; x += c.rr(70, 120)) if (x < x0 - 4 || x > x1 + 4) joints += c.ribbon([[x, F.rim + 2], [x, F.rim + 21]], 1.2);
    s.x(joints, shade(stone, -0.22), 'opacity=".55"');
    // the steps, going down under the water
    for (let k = 0; k < 4; k++) {
      const y = F.rim + 16 - k * 11, ww = F.stepW - 4 - k * 6;
      s.p(c.cut(c.rect(F.stepX - ww / 2, y - 6, ww, 11), 0.3, 6), shade(stone, -0.07 * k));
      s.x(c.ribbon([[F.stepX - ww / 2 + 2, y - 5], [F.stepX + ww / 2 - 2, y - 5]], 2), shade(stone, 0.3), 'opacity=".7"');
    }
    s.x(c.poly([[x0, F.waterFront + 4], [x1, F.waterFront + 4], [x1, F.rim + 1], [x0, F.rim + 1]]), POOL, 'opacity=".6"');
    s.x(c.ribbon([[x0 + 2, F.rim], [x1 - 2, F.rim - 1]], 2.4), POOL_LT, 'opacity=".9"');
    s.p(c.cut([[x0 - 8, F.rim - 14], [x0, F.rim - 14], [x0, F.rim + 22], [x0 - 8, F.rim + 22]], 0.3, 4) + c.cut([[x1, F.rim - 14], [x1 + 8, F.rim - 14], [x1 + 8, F.rim + 22], [x1, F.rim + 22]], 0.3, 4), shade(stone, -0.08));
    actL.add(s.out());
  };

  // tall near columns and the architrave of the near portico, framing the stage
  let frontL = null;
  if (frontCols) {
    frontL = S.layer({ par: 0.9, sh: 7 });
    const COL = mix(C.stone, C.cream, 0.35);
    const s = sheet();
    [200, 1400].forEach((x) => {
      const y = 1040, h = 920;
      s.p(c.cut([[x - 42, y], [x - 38, y - h], [x + 38, y - h], [x + 42, y]], 0.5, 12), COL);
      s.p(c.cut([[x - 60, y - h + 36], [x - 52, y - h], [x + 52, y - h], [x + 60, y - h + 36]], 0.4, 8), shade(COL, -0.06));
      let fl = '';
      for (let k = -3; k <= 3; k++) fl += c.ribbon([[x + k * 10, y - 10], [x + k * 9.5, y - h + 46]], 2.2);
      s.x(fl, shade(COL, -0.14), 'opacity=".55"');
    });
    s.p(c.cut([[-900, -700], [2500, -700], [2500, 120], [-900, 120]], 0.6, 20), mix(COL, C.sand, 0.2));
    let dent = '';
    for (let x = -900; x < 2500; x += 22) dent += c.poly(c.rect(x, 100, 11, 12));
    s.x(dent, shade(COL, -0.2), 'opacity=".6"');
    frontL.add(s.out());
  }
  const flyL = S.layer({ par: 0.3, sh: 5 });
  return { sk, hangL, sunEl, cl, far, city, backL, sickBackL, poolL, rippleL, actL, frontL, flyL, waterline, F };
}
/** idle for the Bethesda set: sun & cloud on their strings */
export function bethesdaIdle(set, T, { sunX = 1220, sunY = 150 } = {}) {
  swing(set.sunEl, sunX, sunY, T, 1, 0.6);
  swing(set.cl, 470 + Math.sin(T * 0.1) * 24, 140, T, 1.3, 0.6, 1);
}
/** a few of the sick lying and sitting far back under the portico (static cut-outs, into set.sickBackL) */
export function backSick(S, set, xs = [120, 470, 620, 780, 950, 1110, 1280, 1460]) {
  const c = S.c, L = set.sickBackL, y = BZ.porticoY - 2;
  xs.forEach((x, i) => {
    const o = sickLook(c, i + 3);
    if (i % 3 === 0) L.add(`<g transform="translate(${x} ${y})">${lyingOn(c, o, { s: 0.42, w: 100, eyes: 'closed' })}</g>`);
    else L.add(`<g transform="translate(${x} ${y}) scale(${i % 2 ? -0.46 : 0.46} 0.46)">${person(c, { ...o, pose: 'sit' })}</g>`);
  });
}

/* ================================================================== the balance (judgment) */
/**
 * A great hanging balance as a rig: stand, beam and two pans are separate pieces in layer L.
 * set(x, y, tilt°, o) → returns [[lx, ly], [rx, ry]], the tops of the two pans (things sit at +~86 below).
 */
export function balanceRig(S, L, arm = 150) {
  const c = S.c;
  const B = bigBalance2(c, arm);
  const stand = L.add(`<g><path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${B.stand}</g>`);
  const beam = L.add(`<g>${B.beam}</g>`);
  const pans = [-1, 1].map((d) => ({ d, el: L.add(`<g>${B.pan}</g>`) }));
  return {
    stand, beam, pans,
    set(x, y, tilt = 0, o = 1) {
      if (o <= 0.001) { [stand, beam, ...pans.map((p) => p.el)].forEach((e) => pose(e, { x, y, o: 0 })); return [[x, y], [x, y]]; }
      pose(stand, { x, y, o });
      pose(beam, { x, y: y + 44, r: tilt, o });
      const a = (tilt * PI) / 180;
      return pans.map((p) => {
        const px = x + Math.cos(a) * arm * p.d, py = y + 44 + Math.sin(a) * arm * p.d;
        pose(p.el, { x: px, y: py, o });
        return [px, py];
      });
    },
  };
}
/** a little sprouting plant that grows (scale sy from its root); origin at the root */
export function sprout(c, h = 90) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [6, -h * 0.5], [-2, -h], 12), (u) => 4 - u * 2), C.moss2);
  const leaf = (x, y, dir, l) => c.cut([[x, y], [x + dir * l * 0.5, y - l * 0.5], [x + dir * l, y - l * 0.2], [x + dir * l * 0.5, y + l * 0.12]], 0.3, 4);
  s.p(leaf(2, -h * 0.3, 1, 30) + leaf(3, -h * 0.55, -1, 26) + leaf(0, -h * 0.78, 1, 22), C.leaf);
  s.p(c.cut(c.star(-2, -h - 6, 13, 6, 6, 0), 0.3, 3), C.jesusMantle).x(c.poly(c.circ(-2, -h - 6, 4, 8)), C.sun);
  return s.out();
}

/* ================================================================== the workshop (J 5,19–20) */
/** a dove as a closed outline (origin centre, ~90 wide) */
export const DOVE = [[-46, 2], [-30, -4], [-14, -6], [-6, -18], [-14, -40], [2, -32], [14, -12], [24, -12], [32, -19], [41, -17], [48, -10], [39, -7], [30, 4], [14, 12], [-10, 12], [-30, 10], [-52, 16]];
/** a carpenter's workshop: warm walls, a beamed ceiling, tools on the wall, an arched window on the left
 *  (with the Father's light behind it) and a door on the right. Returns { sk, glowL, winLight, floor } */
export function workshopSet(S, { floor = 700, winX = 600, winY = 300, doorX = 1290, rackX = 820 } = {}) {
  const c = S.c;
  const sk = sky(S, WARM);
  const glowL = S.layer({ par: 0.1, sh: 0, flat: true });
  const winLight = glowL.add(`<g transform="translate(${winX} ${winY})">${radianceLite(c)}</g>`);
  const wall = S.layer({ par: 0.2, sh: 4 });
  const w = sheet();
  const WC = mix(C.plaster, C.peach, 0.25);
  const ww = 150, wh = 200;
  const win = [[winX - ww / 2, winY + wh / 2], [winX - ww / 2, winY - wh / 2 + ww / 2], ...c.arc(winX, winY - wh / 2 + ww / 2, ww / 2, ww / 2, PI, 2 * PI, 14), [winX + ww / 2, winY + wh / 2]];
  const dw = 150, dh = 300;
  const door = [[doorX - dw / 2, floor], [doorX - dw / 2, floor - dh + dw / 2], ...c.arc(doorX, floor - dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 14), [doorX + dw / 2, floor]];
  w.p(c.cut([[-1600, -900], [3200, -900], [3200, floor + 20], [-1600, floor + 20]], 0.6, 20) + c.hole(win, 0.4, 6) + c.hole(door, 0.4, 6), WC);
  let cr = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = c.rr(100, floor - 20); cr += c.ribbon([[x, y], [x + c.rr(10, 40), y + c.rr(-3, 3)]], 1.2); }
  w.x(cr, shade(WC, -0.12), 'opacity=".5"');
  w.p(c.ribbon([...win.slice(1, -1)], 12), C.wood2);
  w.p(c.cut(c.rect(winX - ww / 2 - 14, winY + wh / 2, ww + 28, 14), 0.3, 6), C.wood);
  w.p(c.ribbon(door.slice(1, -1), 14), C.wood2);
  // ceiling beams
  for (let x = -600; x < 2400; x += 260) w.p(c.cut(c.rect(x, 20, 40, 60), 0.3, 6), C.wood2);
  w.p(c.cut(c.rect(-1600, 70, 4800, 26), 0.4, 20), C.wood);
  // a tool rack on the wall: saw, hammer, square, a coil of rope
  w.p(c.cut(c.rect(rackX, 300, 300, 12), 0.3, 8), C.wood2);
  wall.add(w.out());
  wall.add(`<g transform="translate(${rackX + 50} 350) rotate(90)">${sawM(c)}</g><g transform="translate(${rackX + 130} 372)">${hammerM(c)}</g><g transform="translate(${rackX + 190} 360) rotate(180)">${squareM(c)}</g><g transform="translate(${rackX + 260} 350)"><path d="${c.ribbon(c.arc(0, 0, 18, 22, 0, PI * 1.9, 16), 5)}" fill="${C.rope}"/></g>`);
  // through the door: a bright Jerusalem street
  const outL = S.layer({ par: 0.12, sh: 2 });
  outL.add(`<g><rect x="${doorX - 90}" y="${floor - dh - 20}" width="180" height="${dh + 30}" fill="${mix(C.skyBlue, C.cream, 0.4)}"/><path d="${c.cut([[doorX - 90, floor - 120], [doorX - 20, floor - 150], [doorX + 40, floor - 130], [doorX + 90, floor - 160], [doorX + 90, floor + 10], [doorX - 90, floor + 10]], 0.6, 8)}" fill="${C.plaster2}"/></g>`);
  // floorboards
  const fl = S.layer({ par: 0.3, sh: 2 });
  const f = sheet();
  f.p(c.cut([[-1800, floor + 10], [3400, floor + 10], [3400, 1800], [-1800, 1800]], 0.6, 30), mix(C.wood3, C.sand2, 0.45));
  let bd = '';
  for (let x = -1800; x < 3400; x += 90) bd += c.ribbon([[x, floor + 12], [800 + (x - 800) * 2.2, 1800]], 1.4);
  f.x(bd, shade(C.wood3, -0.2), 'opacity=".45"');
  fl.add(f.out());
  wall.el.parentNode.insertBefore(outL.el, wall.el);
  return { sk, glowL, winLight, wall, floor };
}
function radianceLite(c) {
  let d = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; d += c.poly([[Math.cos(a - 0.04) * 60, Math.sin(a - 0.04) * 60], [Math.cos(a - 0.1) * 300, Math.sin(a - 0.1) * 300], [Math.cos(a + 0.1) * 300, Math.sin(a + 0.1) * 300], [Math.cos(a + 0.04) * 60, Math.sin(a + 0.04) * 60]]); }
  return `<circle r="200" fill="url(#halo-glow)"/><path d="${d}" fill="#fff3cf" opacity=".6"/><circle r="70" fill="#fffaf0"/>`;
}

/* ================================================================== witnesses (J 5,31–38) */
/** a stone bench with two witness seats, numbered I and II (origin: floor centre) */
export function witnessBench(c, w = 300) {
  const s = sheet();
  const col = mix(C.stone, C.cream, 0.2);
  s.p(c.cut(c.rect(-w / 2, -54, w, 16), 0.4, 8), shade(col, 0.1));
  [-1, 1].forEach((d) => s.p(c.cut(c.rect(d * w * 0.25 - 50, -40, 100, 40), 0.4, 6), col));
  s.p(c.cut(c.rect(-w / 2 + 10, -140, 14, 90), 0.3, 5) + c.cut(c.rect(w / 2 - 24, -140, 14, 90), 0.3, 5), shade(col, -0.06));
  s.p(c.cut(c.rect(-w / 2, -150, w, 14), 0.4, 8), shade(col, -0.1));
  const num = (x, n) => `<g transform="translate(${x} -20)"><circle r="13" fill="${C.terracotta}"/><text y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.cream}">${n}</text></g>`;
  return s.out() + num(-w * 0.25, 'I') + num(w * 0.25, 'II');
}
/** a big clay oil lamp hanging from three chains (origin: the ring at the top); .flame (pivot at the wick), .glow */
export function bigLamp(c, { r = 260 } = {}) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [-40, 90]], 1.6) + c.ribbon([[0, 0], [40, 90]], 1.6) + c.ribbon([[0, 0], [0, 86]], 1.6), shade(C.wood2, -0.2));
  s.p(c.cut([[-62, 94], [-58, 86], [-30, 80], [30, 80], [60, 86], [80, 80], [92, 84], [80, 96], [50, 110], [0, 116], [-44, 110]], 0.5, 6), C.pot);
  s.p(c.cut(c.ell(-4, 86, 18, 5, 12), 0.2, 3), shade(C.pot, -0.35));
  s.x(c.ribbon([[-50, 100], [50, 100]], 2.4), C.cream, 'opacity=".4"');
  s.p(c.cut(c.circ(0, 0, 6, 10), 0.3, 3), C.wood2);
  return `<circle class="glow" cx="88" cy="40" r="${r}" fill="url(#warm-glow)"/><path d="M0 -1600V-6" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>${s.out()}<g class="flame" transform="translate(88 82)"><path d="M0 0C-14 -12 -12 -34 0 -62C12 -34 14 -12 0 0Z" fill="${C.lampFlame}"/><path d="M0 -4C-6 -12 -6 -24 0 -38C6 -24 6 -12 0 -4Z" fill="#fff4d2"/></g>`;
}

/* ================================================================== the Scriptures (J 5,39–47) */
/** a laurel wreath of honour (origin centre) */
export function laurel(c, r = 22, col = C.sun) {
  let d = '';
  for (let i = 0; i < 14; i++) {
    const a = PI * (0.65 + (i / 13) * 1.7);
    const x = Math.cos(a) * r, y = Math.sin(a) * r, o = a + PI / 2;
    d += c.poly(c.ell(x, y, 6, 2.6, 8, o + (i % 2 ? 0.5 : -0.5)));
  }
  return `<path d="${d}" fill="${col}"/><path d="${c.ribbon(c.arc(0, 0, r, r, PI * 0.62, PI * 2.38, 20), 1.6)}" fill="${shade(col, -0.25)}"/>`;
}
/** a scribes' hall: plaster walls with niches full of scroll rolls, a high window, a floor; returns { sk, winLight } */
export function scrollHall(S, { floor = 700, winX = 800, winY = 220 } = {}) {
  const c = S.c;
  const sk = sky(S, WARM);
  const glowL = S.layer({ par: 0.1, sh: 0, flat: true });
  const winLight = glowL.add(`<g transform="translate(${winX} ${winY})"><circle r="160" fill="url(#halo-glow)"/></g>`);
  const wall = S.layer({ par: 0.2, sh: 4 });
  const w = sheet();
  const WC = mix(C.plaster, C.sand, 0.3);
  const win = c.circ(winX, winY, 44, 24);
  const niches = [];
  [[-220, 3], [300, 3], [960, 3], [1480, 3]].forEach(([x0, n]) => { for (let r = 0; r < 3; r++) for (let k = 0; k < n; k++) niches.push([x0 + k * 112, 250 + r * 84]); });
  w.p(c.cut([[-1600, -900], [3200, -900], [3200, floor + 20], [-1600, floor + 20]], 0.6, 20) + c.hole(win, 0.3, 5), WC);
  w.p(c.ribbon([...win, win[0]], 8), C.wood2);
  // wooden shelf frames round each block of niches
  [[-220], [300], [960], [1480]].forEach(([x0]) => { w.p(c.cut(c.rect(x0 - 14, 236, 3 * 112 + 4, 3 * 84 + 18), 0.4, 8), C.wood3); });
  let nd = '';
  niches.forEach(([x, y]) => { nd += c.cut(c.rect(x, y, 96, 66), 0.3, 6); });
  w.p(nd, mix(C.wood2, C.soilDark, 0.25));
  let sc = '', ends = '';
  niches.forEach(([x, y]) => {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
      const cx = x + 14 + i * 23, cy = y + 18 + j * 30;
      if (c.chance(0.2)) continue;
      sc += c.cut(c.circ(cx, cy, 10.5, 12), 0.2, 3);
      ends += c.ribbon(c.arc(cx, cy, 5, 5, 0, PI * 1.8, 8), 1.4);
    }
  });
  w.p(sc, C.parchment).x(ends, C.wood3, 'opacity=".8"');
  wall.add(w.out());
  const fl = S.layer({ par: 0.3, sh: 2 });
  const f = sheet();
  f.p(c.cut([[-1800, floor + 10], [3400, floor + 10], [3400, 1800], [-1800, 1800]], 0.6, 30), mix(C.stone, C.sand2, 0.4));
  let tl = '';
  for (let x = -1800; x < 3400; x += 100) tl += c.ribbon([[x, floor + 12], [800 + (x - 800) * 2.2, 1800]], 1.3);
  for (let i = 0; i < 6; i++) { const y = floor + 24 + i * i * 9 + i * 14; tl += c.ribbon([[-1800, y], [3400, y]], 1.3); }
  f.x(tl, shade(C.stone, -0.2), 'opacity=".4"');
  fl.add(f.out());
  return { sk, winLight, wall };
}
/** an open scroll on a reading desk (origin: floor centre); .lines carry data-i (for golden letters) */
export function readingDesk(c, w = 260) {
  const s = sheet();
  s.p(c.cut([[-w / 2 + 20, 0], [-w / 2 + 30, -70], [-w / 2 + 44, -70], [-w / 2 + 36, 0]], 0.3, 5) + c.cut([[w / 2 - 36, 0], [w / 2 - 44, -70], [w / 2 - 30, -70], [w / 2 - 20, 0]], 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2, -84, w, 14), 0.4, 8), C.wood);
  s.p(c.cut([[-w / 2 + 30, -84], [w / 2 - 30, -84], [w / 2 - 30, -98], [-w / 2 + 30, -98]], 0.3, 6), C.parchment);
  s.p(c.cut(c.ell(-w / 2 + 26, -92, 10, 14, 12), 0.2, 3) + c.cut(c.ell(w / 2 - 26, -92, 10, 14, 12), 0.2, 3), mix(C.parchment, C.wood3, 0.3));
  let ln = '';
  for (let x = -w / 2 + 44; x < w / 2 - 44; x += 14) ln += c.ribbon([[x, -95], [x + 9, -95]], 1.3) + c.ribbon([[x, -90], [x + 7, -90]], 1.3);
  s.x(ln, C.ink, 'opacity=".5"');
  return s.out();
}
