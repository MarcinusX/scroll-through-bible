// Luke 21 — the cast and cut-outs of this chapter. Luke sets the whole discourse in the Temple (21,5.37–38), so most
// scenes play in Luke 2's Temple court: Jesus stands in the middle of the court, Peter and John by Him, the people in
// knots on both sides (sprites), and the painted flats of His sayings come down in front of the sanctuary. The visions
// have their own sets: Judea round Jerusalem (the armies' camp, the flight to the mountains), the fly-system heavens
// over the roaring sea, an orchard in spring, and the Mount of Olives at night (Mark 13's set).
// Everything else is borrowed: Mark 12's offering chests, purses and coins, Mark 13's plates, masks, map, hourglass
// and shadow screen, Mark 15's standards and soldiers, Mark 11's Jerusalem and fig tree, Matthew 24's mountains.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, grass, flowers, sun, cloud, moon, stars } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeSet, TFLOOR } from '../luke2/lib.js';
import { crowdKnot } from '../luke13/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { folk as folkJ } from '../john6/lib.js';
import { voiceRings } from '../mark1/lib.js';
import { jerusalem, cityWall } from '../mark11/lib.js';
import { eagleStandard as eagle15, vexillum as vex15 } from '../mark15/lib.js';

export { tr, es, ease, bump, seg, fade };
export { templeSet, TFLOOR, TEMPLE_DAY, EVENING as EVE2, NIGHT as NIGHT2, DAWN as DAWN2 } from '../luke2/lib.js';
export { crowdKnot, knot, knotUp, knotBow, wordTag, numDisc, onString, fig13 } from '../luke13/lib.js';
export { headAt, handAt } from '../luke16/lib.js';
export { flat, flatSky, flatHills, fig, flatText, dropK, flyTo } from '../luke1/lib.js';
export { voiceRings, sparkle } from '../mark1/lib.js';
export { kf, moving, speech, thought, GLYPH, heart, coin, coinStack, dust, loaf, cup, jug, addToHead, addToBody } from '../mark2/lib.js';
export { strip, question, stoneHeart, bubble, silhouette, shadowPerson } from '../mark3/lib.js';
export { angel, glory, soulLight, globe, balance } from '../mark8/lib.js';
export { LOOK as L12, rich, trumpetChest, purse, lepton, snare, stoneBlock, grapeBunch } from '../mark12/lib.js';
export {
  mask, hourglass, emptyBowl, soldier as toySoldier, banner as pennant, crownIcon, shoot, mapSheet, shadowScreen, skyStar, handLamp,
  tornPieces, ashlar, plate, word, lightHand, olivesSet, circle, SKIES, tint, oliveBough, FOUR, JX as OJX, JY as OJY, JS as OJS, seatRock, dayCard,
} from '../mark13/lib.js';
export { soldierSil, eagleStandard, vexillum } from '../mark15/lib.js';
export { jerusalem, cityWall, figTree, figs } from '../mark11/lib.js';
export { peak, crowdStrip, shadowGroup, silh, lightMote, wineJar, beamDown } from '../matthew24/lib.js';
export { kingdomDisc } from '../luke8/lib.js';
export { tent } from '../matthew2/lib.js';
export { worryCloud, moneyBag } from '../matthew13/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== skies */
export const DAY = ['#d3dfd6', '#f2e2c4', '#f6dcbc'];
export const GOLD = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVE = ['#a69abf', '#eab99c', '#f5d6b0'];
export const DUSK = ['#6f6a96', '#b78f9e', '#e5b394'];
export const NIGHT = ['#1d2350', '#2f3668', '#4f5486'];
export const DEEP = ['#15182e', '#1f2340', '#2c2c46'];
export const STORM = ['#4d5270', '#6f6f86', '#9b9196'];
export const GLORY = ['#6b5a86', '#e3b98a', '#f8e4b8'];
export const DAWN = ['#bfb4cf', '#f1cfb2', '#f8e3c6'];
export const SPRING = ['#bcd9d6', '#eef0d6', '#f8efd6'];
export const SUMMER = ['#d9cf9e', '#f5dfa6', '#f9ebc6'];

/* ================================================================== the cast */
export const WIDOW = { robe: mix(C.stone2, C.rock2, 0.5), hairStyle: 'veil', veil: mix(C.storm, C.stone2, 0.55), veil2: mix(C.storm, C.stone2, 0.4), hair: C.greyHair, skin: C.skin3, belt: null };
/** a disciple of the later days (in the flats of persecution): a plain traveller's look */
export const WITNESS = { robe: C.sageRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
export const WITNESS2 = { robe: C.linen2, mantle: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, skin: C.skin, belt: C.ochre };
export const MOTHER = { robe: C.roseRobe, mantle: C.plumRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), hair: C.hair3, skin: C.skin2, belt: null };
export const EXPECT = { robe: C.wheatRobe, mantle: C.tealRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.hair, skin: C.skin3, belt: null };
export const HUSBAND = { robe: C.dustyBlue, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.leather };

/* ================================================================== small helpers */
export const warm = (r = 120, o = 1) => `<circle r="${r}" fill="url(#warm-glow)" opacity="${o}"/>`;
export const halo = (r = 120, o = 1) => `<circle r="${r}" fill="url(#halo-glow)" opacity="${o}"/>`;
/** a figure baked with arms / head set (for flats and sprites): origin at its feet */
export function still(c, o, { s = 1, flip = false, armF = 0, armB = 0, head = 0 } = {}) {
  let m = person(c, { holdF: '', holdB: '', ...o });
  if (armF) m = m.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-armF})">`);
  if (armB) m = m.replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB})">`);
  if (head) m = m.replace('<g class="headr">', `<g class="headr" transform="rotate(${head})">`);
  return `<g transform="scale(${flip ? -s : s} ${s})">${m}</g>`;
}
/** a silhouette of a baked figure (shadow play) */
export function shade2(markup, col = '#3b2a22') {
  return markup.replace(/fill="(?!none)[^"]*"/g, `fill="${col}"`).replace(/stroke="(?!none)[^"]*"/g, `stroke="${col}"`).replace(/opacity="[^"]*"/g, '');
}
/** a person cut from one dark paper (a shadow-play puppet that can still move its arms): markup */
export function silP(c, o, col = '#3b2a22') {
  return person(c, { ...o, halo: false }).replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${col}"`).replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${col}"`);
}
/** a line of ink dashes (neutral writing) from x0 to x1 at y */
export function inkLine(c, x0, x1, y, w = 2) {
  let d = '', x = x0;
  while (x < x1 - 6) { const l = Math.min(x1 - x, c.rr(10, 26)); d += c.ribbon([[x, y + c.rr(-0.6, 0.6)], [x + l, y + c.rr(-0.6, 0.6)]], w); x += l + c.rr(5, 9); }
  return d;
}
/** a slip of paper with ink dashes on it; origin centre */
export function dashSlip(c, w = 70, h = 34, { fill = C.cream, ink = C.inkSoft, lines = 2 } = {}) {
  const s = sheet().p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 2], [w / 2 + 2, h / 2], [-w / 2 - 1, h / 2 + 1]], 0.5, 5), fill);
  let d = '';
  for (let i = 0; i < lines; i++) d += inkLine(c, -w / 2 + 8, w / 2 - 8 - (i === lines - 1 ? w * 0.2 : 0), -h / 2 + ((i + 1) * h) / (lines + 1), 1.8);
  s.x(d, ink, 'opacity=".75"');
  return s.out();
}
/** a big cross-out stroke (X) of ink; origin centre */
export function crossX(c, r = 26, col = C.terracotta) {
  return sheet().p(c.ribbon([[-r, -r], [r, r]], 5) + c.ribbon([[-r, r], [r, -r]], 5), col).out();
}

/* ================================================================== the Temple court where He teaches */
/** where things stand in the court and where the flats hang: centre FX, FY; size FW × FH, scaled by K */
export const TT = { GY: 716, JX: 800, JS: 1.06, FX: 800, FY: 300, FW: 440, FH: 250, K: 1.12, PX: 668, JOX: 932 };
export const flatY = (k) => lerp(-1500, TT.FY, k);
/** flat coords → world */
export const FXw = (dx) => TT.FX + dx * TT.K;

/** foreground: the bases of two great columns of the portico at the edges, the balustrade edge along the bottom */
function courtFront(S, c) {
  const fg = S.layer({ par: 0.9, sh: 8 });
  const col = (x) => {
    const s = sheet();
    const cc = mix(C.stone, C.cream, 0.25);
    s.p(c.cut([[x - 58, -1400], [x + 58, -1400], [x + 62, 1100], [x - 62, 1100]], 0.8, 18), cc);
    s.x(c.ribbon([[x - 26, -1400], [x - 26, 1100]], 4) + c.ribbon([[x + 2, -1400], [x + 2, 1100]], 4) + c.ribbon([[x + 30, -1400], [x + 30, 1100]], 4), shade(cc, -0.1), 'opacity=".6"');
    s.p(c.cut(c.rect(x - 84, 800, 168, 40), 0.5, 8), mix(C.stone, C.plaster2, 0.4));
    return s.out();
  };
  fg.add(col(110) + col(1490));
  return fg;
}

/**
 * The Temple court (Luke 2's set, the same cut in every scene): sky (+ optional second sky), sun, the Mount of
 * Olives behind, the sanctuary, porticoes, paving. Then: FL (flats), bits (moving things on the flats), crowdL (the
 * people as sprites), act (Jesus, Peter, John and the actors), fx (in front) and fg. Returns handles and update().
 * opts: crowd (knots of people), dis (Peter and John by Jesus), jesus.
 */
export function templeTeach(S, { skyCols = DAY, sky2 = null, sunAt = [1220, 160], crowd = true, dis = true, jesus = true, front = true, flats = true } = {}) {
  const c = makeCutter('lk21-temple');
  const S2 = { ...S, c };
  const set = templeSet(S2, { skyCols, sunAt });
  // a second sky (night, storm, gold) with stars and a moon, slipped in right behind the sky (rise 0: no strip shows)
  let sk2 = null, starL = null, moonEl = null;
  if (sky2) {
    sk2 = sky(S, sky2, { name: 'sky2', rise: 0 });
    sk2.layer.fade(0);
    starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 420, n: 120 }));
    starL.fade(0);
    const moonL = S.layer({ par: 0.03, sh: 4, rise: 0 });
    moonEl = hanging(moonL, moon(c, 32), { x: 1150, y: -1400, len: 800 });
    set.sk.layer.el.after(sk2.layer.el);
    sk2.layer.el.after(starL.el);
    starL.el.after(moonL.el);
  }
  // a dusk/night veil over the whole court (behind the flats and the people), faded by the scene
  let dimL = null;
  if (sky2) {
    dimL = S.layer({ par: 0.4, sh: 0, flat: true, pad: 300 });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.indigo, 0.4)}" opacity=".42"/>`);
    dimL.fade(0);
  }
  const FL = flats ? S.layer({ par: 0.3, sh: 6 }) : null;
  const bits = flats ? S.layer({ par: 0.3, sh: 5 }) : null;
  const crowdL = S.layer({ par: 0.5, sh: 4 });
  const groups = [];
  if (crowd) {
    [[440, TT.GY - 6, 'a', 6, false, 'stand', 0.9], [1160, TT.GY - 6, 'b', 6, true, 'stand', 0.9], [556, TT.GY + 46, 'c', 3, false, 'sit', 0.92], [1044, TT.GY + 46, 'd', 3, true, 'sit', 0.92]].forEach(([x, y, k, n, flip, P, s], i) => {
      const o = { s, spread: 46, rows: P === 'sit' ? 1 : 2, flip, pose: P };
      const K = crowdKnot('lk21-t-' + k, n, o);
      groups.push({ i, x, y, k, n, flip, P, s, o, mem: K.mem, sp: crowdL.sprite(K.m, x, y) });
    });
  }
  const act = S.layer({ par: 0.5, sh: 5 });
  const peter = dis ? S.puppet(act.add(person(c, { ...CAST.peter }))) : null;
  const john = dis ? S.puppet(act.add(person(c, { ...CAST.john }))) : null;
  const J = jesus ? S.puppet(act.add(person(c, { ...CAST.jesus }))) : null;
  const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 34, w: 5 });
  const fx = S.layer({ par: 0.5, sh: 6 });
  const fg = front ? courtFront(S, c) : null;
  return {
    c, set, sk: set.sk, sk2, starL, moonEl, dimL, FL, bits, crowdL, act, fx, fg, jesus: J, peter, john, voice, groups,
    /** sun and cloud on their strings; the people standing still (sprites), Peter and John listening */
    update(t, T, { sunDY = 0, look = 0, sunO = 1, dis: withDis = true, crowd: withCrowd = true } = {}) {
      swing(set.sunEl, sunAt[0], sunAt[1] + sunDY, T, 1, 0.6);
      fade(set.sunEl, sunO);
      swing(set.cl1, 470 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1);
      if (withCrowd) groups.forEach((g) => g.sp.set({ x: g.x, y: g.y }));
      if (!withDis) return;
      if (peter) peter.set({ x: TT.PX, y: TT.GY + 10, s: 0.98, flip: false, head: -4 - look * 8, blink: blinkAt(T, 3) });
      if (john) john.set({ x: TT.JOX, y: TT.GY + 10, s: 0.98, flip: true, head: -4 - look * 8, blink: blinkAt(T, 5) });
    },
  };
}

/** Luke 13's knot of people (the same cut for the same seed), with something added to each member (holdF…) */
export function knotX(seed, n, { s = 0.8, spread = 40, rows = 2, flip = false, pose: P = 'stand', arms = [0, 30], armB = [0, 10], head = [-6, 4], women = null } = {}, extra = () => ({})) {
  const c = makeCutter(seed);
  const per = Math.ceil(n / rows);
  const mem = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), k = i % per;
    const man = women === null ? null : !women;
    mem.push({ x: (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-5, 5), y: r * 14 + c.rr(-2, 2), s: s * c.rr(0.93, 1.05) * (1 - r * 0.04), flip, head: c.rr(head[0], head[1]), armF: c.rr(arms[0], arms[1]), armB: c.rr(armB[0], armB[1]), o: { ...folkJ(c, man), pose: P } });
  }
  mem.forEach((m, i) => { m.o = { ...m.o, ...extra(i) }; });
  return { m: pose3(c, mem), mem };
}
/** the same knots of people in another posture (hidden until shown): kind 'up' | 'bow' | 'look' | 'point' | 'afraid' | 'kneel' */
const POSTURE = {
  up: { arms: [110, 150], armB: [120, 160], head: [-12, -6] },
  bow: { arms: [120, 140], armB: [60, 90], head: [18, 26] },
  look: { arms: [0, 20], armB: [0, 10], head: [-14, -8] },
  point: { arms: [95, 125], armB: [0, 20], head: [-10, -4] },
  afraid: { arms: [100, 130], armB: [110, 150], head: [8, 14] },
  kneel: { pose: 'kneel', arms: [60, 90], armB: [100, 140], head: [-10, -4] },
};
export function altGroups(T0, kind, extra = {}, hold = null) {
  return T0.groups.map((g) => {
    const o = { ...g.o, ...POSTURE[kind], ...extra };
    if (g.P === 'sit' && o.pose === 'kneel') o.pose = 'sit';
    const sp = T0.crowdL.sprite((hold ? knotX('lk21-t-' + g.k, g.n, o, () => ({ holdF: hold })) : crowdKnot('lk21-t-' + g.k, g.n, o)).m, g.x, g.y);
    sp.set({ x: g.x, y: g.y, o: 0 });
    return { g, sp };
  });
}
/** swap the knots to another posture by k (0 → 1), quickly, so they never ghost */
export function swapGroups(T0, alts, k) {
  const q = k >= 1 ? 1 : k <= 0 ? 0 : k;
  T0.groups.forEach((g, i) => { g.sp.set({ x: g.x, y: g.y, o: 1 - q }); alts[i].sp.set({ x: g.x, y: g.y, o: q }); });
}

/* ================================================================== Judea: Jerusalem among the mountains */
export const JU = { GY: 720, CX: 800, CY: 470, CS: 0.5 };
/**
 * Jerusalem on its hill in the middle (the Temple at x 800), the walls round it; mountains left and right behind it,
 * with paths going up them; the road in front. Returns { c, sk, sk2, hangL, cityL, campL, mtL, pathL, nearL, fx, … }.
 */
export function judeaSet(S, { skyCols = GOLD, sky2 = null, dim = false } = {}) {
  const c = makeCutter('lk21-judea');
  const sk = sky(S, skyCols);
  let sk2 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 150, len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 420, y: 130, len: 800 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [24, 10, 4], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12), x0: -1400, x1: 3000 }).markup);
  // the mountains of Judea, left and right, with paths
  const mtL = S.layer({ par: 0.14, sh: 3 });
  const mts = (x, w, h, col) => sheet().p(c.cut([[x - w / 2, 660], [x - w * 0.3, 660 - h * 0.6], [x - w * 0.1, 660 - h], [x + w * 0.08, 660 - h * 0.9], [x + w * 0.3, 660 - h * 0.55], [x + w / 2, 660]], 1, 12), col).out();
  mtL.add(mts(160, 760, 400, mix(C.hillMid, C.rock2, 0.3)) + mts(1400, 760, 380, mix(C.hillMid, C.rock2, 0.25)));
  const pathD = (pts) => c.ribbon(pts, (u) => 10 - u * 5);
  const PATH_L = [[340, 640], [300, 580], [250, 510], [200, 440], [160, 370], [130, 310]];
  const PATH_R = [[1070, 640], [1120, 580], [1180, 510], [1240, 440], [1300, 370], [1350, 310]];
  mtL.add(sheet().p(pathD(PATH_L) + pathD(PATH_R), mix(C.sand, C.cream, 0.3)).out());
  mtL.add(olive(c, 60, 560, 0.5) + olive(c, 420, 600, 0.45) + cypress(c, 1520, 500, 90) + olive(c, 1290, 600, 0.5));
  // those who flee go on this sheet, behind the city
  const pathL = S.layer({ par: 0.14, sh: 4 });
  // the city on its hill
  const cityL = S.layer({ par: 0.2, sh: 4 });
  cityL.add(`<g transform="translate(${JU.CX - 280 * JU.CS} ${JU.CY + 90})">${jerusalem(c, JU.CS, { tglow: false })}</g>`);
  // a camp ring (for the armies) sits in front of the hill
  const campL = S.layer({ par: 0.26, sh: 4 });
  // the near slopes with the road
  const nearL = S.layer({ par: 0.34, sh: 3 });
  const gfn = c.wave(660, [8, 3], [800, 230]);
  const g = sheet();
  g.p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sand, 0.2));
  g.p(c.ribbon([[-400, 780], [300, 740], [600, 700], [800, 690], [1000, 700], [1300, 740], [2000, 790]], (u) => 30 + Math.sin(u * PI) * 10), mix(C.sand, C.stone, 0.3));
  nearL.add(g.out() + grass(c, { x0: -800, x1: 2400, y: 660, fn: gfn, n: 40, h: 12, color: C.olive }));
  let dimL = null;
  if (dim) {
    dimL = S.layer({ par: 0.34, sh: 0, flat: true, pad: 300 });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.indigo, 0.4)}" opacity=".4"/>`);
    dimL.fade(0);
  }
  const fx = S.layer({ par: 0.4, sh: 5 });
  return {
    c, sk, sk2, hangL, sunEl, cityL, campL, mtL, nearL, pathL, fx, dimL, gfn, PATH_L, PATH_R,
    front() {
      const fg = S.layer({ par: 0.9, sh: 6 });
      fg.add(bush(c, 60, 940, 240, C.sage, C.moss) + rock(c, 1520, 940, 240, 90, C.rock2) + bush(c, 1640, 920, 170, C.moss));
      return fg;
    },
    update(t, T, { sunY = 150, sunO = 1 } = {}) {
      pose(sunEl, { x: 1250, y: sunY, r: Math.sin(T * 0.6) * 1, o: sunO });
      swing(cl, 420 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.6, 1);
    },
  };
}
/** the Roman camp round the city: tents, standards, fires (pieces in J.campL). show(t0, T) brings them up from t0 */
export const RING = [
  [420, 640], [490, 612], [560, 600], [640, 604], [720, 612], [880, 612], [960, 604], [1040, 600], [1110, 612], [1180, 640],
  [520, 668], [660, 676], [940, 676], [1080, 668],
];
export function campRing(J, c) {
  const L = J.campL;
  const tents = RING.map(([x, y], i) => ({ i, x, y, el: L.add(`<g>${campTent(c, 50 + (i % 3) * 8, 34 + (i % 2) * 6, [mix(C.leather, C.clay, 0.4), mix(C.leather, C.sand2, 0.3), mix(C.clay, C.wood3, 0.4)][i % 3])}</g>`) }));
  const stds = [[470, 628, 'e'], [600, 604, 'v'], [1000, 604, 'v'], [1140, 628, 'e'], [800, 690, 'e']].map(([x, y, k], i) => ({ i, x, y, el: L.add(`<g transform="scale(.3)">${k === 'e' ? eagle15(c, 300) : vex15(c, 300)}</g>`) }));
  const fires = [[455, 650], [690, 632], [910, 632], [1150, 650]].map(([x, y], i) => ({ i, x, y, el: L.add(`<g>${campfire(c, 7)}</g>`) }));
  return {
    set(t, T, t0 = 0.05) {
      tents.forEach((tn) => {
        const a = t0 + (tn.i % 10) * 0.045 + (tn.i >= 10 ? 0.2 : 0);
        const k = es(t, a, a + 0.14, ease.back);
        pose(tn.el, { x: tn.x, y: tn.y, s: k, o: k > 0.02 ? 1 : 0 });
      });
      stds.forEach((sd) => {
        const k = es(t, t0 + 0.25 + sd.i * 0.06, t0 + 0.4 + sd.i * 0.06, ease.back);
        pose(sd.el, { x: sd.x, y: sd.y + (1 - k) * 30, s: 0.3, o: k > 0.02 ? 1 : 0 });
      });
      fires.forEach((f) => {
        const k = es(t, t0 + 0.45 + f.i * 0.05, t0 + 0.57 + f.i * 0.05);
        pose(f.el, { x: f.x, y: f.y, s: k * (1 + (T ? Math.sin(T * 7 + f.i) * 0.08 : 0)), o: k });
      });
    },
  };
}
/** where a point along a path (list of points) is: [x, y] at u 0..1 */
export function along(pts, u) {
  const segs = [];
  let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; }
  let d = Math.max(0, Math.min(1, u)) * L;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) { const k = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], Math.min(1, k)), lerp(pts[i][1], pts[i + 1][1], Math.min(1, k)), pts[i + 1][0] < pts[i][0] ? -1 : 1]; }
    d -= segs[i];
  }
  return [...pts[pts.length - 1], 1];
}

/* ================================================================== props */
/** a small campaign tent (Roman leather tent), origin: bottom centre */
export function campTent(c, w = 64, h = 44, col = mix(C.leather, C.clay, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.38, -h * 0.8], [0, -h], [w * 0.38, -h * 0.8], [w / 2, 0]], 0.5, 5), col);
  s.p(c.cut([[-6, 0], [0, -h * 0.62], [6, 0]], 0.3, 3), shade(col, -0.35));
  s.x(c.ribbon([[0, -h], [0, -h * 0.72]], 1.4), shade(col, -0.2), 'opacity=".7"');
  return s.out();
}
/** a campfire with a glow (the glow is a small radial on the ground, below the flames); origin: foot */
export function campfire(c, r = 12) {
  const s = sheet();
  s.p(c.ribbon([[-r, 0], [r, -3]], 3) + c.ribbon([[-r, -3], [r, 0]], 3), C.wood2);
  const fl = `<path d="M0 -2C-${r * 0.6} -${r * 0.5} -${r * 0.5} -${r * 1.2} 0 -${r * 2}C${r * 0.5} -${r * 1.2} ${r * 0.6} -${r * 0.5} 0 -2Z" fill="${C.lampFlame}"/>`;
  return `<ellipse cy="-4" rx="${r * 3}" ry="${r * 1.4}" fill="url(#warm-glow)" opacity=".8"/>${s.out()}${fl}`;
}
/** a comet with a long tail (tail to the left); origin at its head */
export function comet(c, len = 220) {
  const tail = c.poly([[0, -7], [-len, -1], [-len * 0.6, 3], [0, 8]]);
  return `<path d="${tail}" fill="${C.halo}" opacity=".45"/><path d="${c.poly([[0, -4], [-len * 0.6, 0], [0, 4]])}" fill="${C.star}" opacity=".7"/>${warm(34, 0.8)}<path d="${c.cut(c.star(0, 0, 11, 5, 6, 0.3), 0.2, 3)}" fill="${C.star}"/>`;
}
/** a plain wooden sword (for shadow play) — pointing up; origin at the grip */
export function swordSil(c, len = 90, col = '#3b2a22') {
  return sheet().p(c.cut([[-3.4, 0], [-3.4, -len], [0, -len - 12], [3.4, -len], [3.4, 0]], 0.2, 5) + c.cut(c.rect(-14, -2, 28, 6), 0.2, 4) + c.cut(c.rect(-3, 4, 6, 18), 0.2, 4), col).out();
}
/** a length of rope/cord between captives (drawn along +x, 100 long) */
export function cord(c, len = 100, col = C.rope) {
  return sheet().p(c.ribbon(c.qbez([0, 0], [len / 2, 16], [len, 0], 10), 2.4), col).out();
}
/** iron bars (a prison window); origin: top-left */
export function bars(c, w = 90, h = 110, col = mix(C.rock3, C.storm, 0.4)) {
  const s = sheet();
  s.p(c.cut(c.rect(0, 0, w, 8), 0.3, 6) + c.cut(c.rect(0, h - 8, w, 8), 0.3, 6), col);
  let d = '';
  for (let x = 8; x < w - 4; x += 18) d += c.cut(c.rect(x, 4, 6, h - 8), 0.2, 6);
  s.p(d, col);
  return s.out();
}
/** a little gate of the Kingdom (arched, golden, light inside) — origin: foot centre */
export function kingdomArch(c, w = 90, h = 130) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 12, 0], [-w / 2 - 12, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2 + 12, w / 2 + 12, PI, 2 * PI, 12), [w / 2 + 12, 0]], 0.6, 6) + c.hole([[-w / 2, 0], [-w / 2, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [w / 2, 0]], 0.4, 5), C.ochre);
  s.x(c.ribbon(c.arc(0, -h + w / 2, w / 2 + 6, w / 2 + 6, PI, 2 * PI, 12), 2), C.sun, 'opacity=".8"');
  return `<path d="${c.poly([[-w / 2, 0], [-w / 2, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [w / 2, 0]])}" fill="${mix(C.halo, C.cream, 0.4)}"/>${s.out()}`;
}
/** a single hair (a fine curl); origin centre */
export function oneHair(c, len = 40, col = C.hair2) {
  return `<path d="${c.ribbon(c.cbez([-len / 2, 0], [-len / 6, -len * 0.4], [len / 6, len * 0.4], [len / 2, 0], 14), 2.6)}" fill="${col}"/>`;
}
/** a heavy weight (a black iron weight with a ring); origin: its top ring */
export function weight(c, w = 40, col = mix(C.rock3, C.night2, 0.3)) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 4, 6, 10), 0.2, 3) + c.hole(c.circ(0, 4, 3, 8), 0.2, 3), col);
  s.p(c.cut([[-w * 0.3, 10], [w * 0.3, 10], [w / 2, w * 0.8 + 10], [-w / 2, w * 0.8 + 10]], 0.4, 5), col);
  s.x(c.ribbon([[-w * 0.2, 16], [-w * 0.3, w * 0.7]], 2), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}
/** walls of Jerusalem from outside as a painted strip (for flats): wall with towers and a gate; origin: bottom centre */
export function wallStrip(c, w = 300, h = 60) {
  return cityWall(c, -w / 2, w / 2, -h, 0, { towers: [{ x: -w * 0.35, w: 34, h: 22 }, { x: w * 0.4, w: 34, h: 22 }], gate: { x: 0, w: 30, h: 40 }, merlon: 7 });
}
export { makeCutter, stars, moon, sun, cloud, band, hillsWith, olive, cypress, bush, rock, grass, flowers };
export { throne, crown as crown6 } from '../mark6/lib.js';
export { lightCrown } from '../mark8/lib.js';
export { soldier as roman } from '../mark15/lib.js';
