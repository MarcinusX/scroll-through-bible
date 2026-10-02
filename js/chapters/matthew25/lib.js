// Matthew 25 — the cast and cut-outs of this chapter. The night street with the wedding house, the ten bridesmaids and
// their little clay lamps (the flames are cut-outs of their own, so they flicker without repainting anyone), the
// oil-seller's stall and the bridegroom with his torch-bearers; the master's courtyard with the door into his joy and
// the gate onto the outer darkness, the gold talents, the market and the field; and the Last Judgement: the throne of
// glory on a floor of cloud, the King, the angels, all the nations, the sheep and the goats, and the six small painted
// scenes of mercy. The Mount of Olives comes from Mark 13, the throne of light from John 12, the sheep from John 10,
// the angels from Mark 8, the nations from Matthew 12, the talent heap and the cloud floor from Matthew 18.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, house, town, olive, cypress, palm, bush, rock, grass, flowers, sun, moon, cloud, stars } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { makeCutter } from '../../core/paper.js';
import { garland as garland2, lowTable as lowTable2, loaf as loaf2, bowl as bowl2, cup as cup2, headAt as headAt2, addToHead as addToHead2 } from '../mark2/lib.js';
import { oilFlask as oilFlask6, crown as crown6, sickOnMat as sickOnMat6 } from '../mark6/lib.js';
import { angel as angel8 } from '../mark8/lib.js';
import { tint as tint13 } from '../mark13/lib.js';
import { ewe as ewe10 } from '../john10/lib.js';
import { pose3 as pose3_4 } from '../matthew4/lib.js';
import { nationsMarkup as nations12 } from '../matthew12/lib.js';
import { hydria as hydria4, well as well4, cupJ as cup4 } from '../john4/lib.js';
import { stall as stall9 } from '../john9/lib.js';
import { storeJar as jar13, stall as stall13 } from '../matthew13/lib.js';
import { beggarBowl as bb10 } from '../mark10/lib.js';
import { bars as bars1 } from '../mark1/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, coin, coinStack, ledger, lowTable, bowl, loaf, cup, jug, heart, dust, garland, wreath } from '../mark2/lib.js';
export { voiceRings, sparkle, flame, hang2 } from '../mark1/lib.js';
export { bubble, question, shadowPerson, withFace, faceBits } from '../mark3/lib.js';
export { angel, glory, lightCrown, globe, soulLight, say } from '../mark8/lib.js';
export { handLamp, zzz, hourglass, keyProp, tint, olivesSet, circle, FOUR, SKIES, roundel, oliveBough } from '../mark13/lib.js';
export { crown, oilFlask, oilDrop, storyFrame, sickOnMat } from '../mark6/lib.js';
export { throneOfLight } from '../john12/lib.js';
export { ewe, sheepRig } from '../john10/lib.js';
export { crook } from '../matthew15/lib.js';
export { smokeCurl } from '../matthew2/lib.js';
export { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { nationsMarkup, tick, crossX } from '../matthew12/lib.js';
export { kingdomGate } from '../mark12/lib.js';
import { kingdomGate as kGate12 } from '../mark12/lib.js';
export { bigKey, smallFlame } from '../matthew5/lib.js';
export { glowDisc, rayBurst, radiance, hungWord, hungGold, goldWord } from '../john1/lib.js';
export { talentHeap, cloudFloor, SERVANTS as HOUSEHOLD } from '../matthew18/lib.js';
export { torch } from '../mark14/lib.js';
export { chest } from '../matthew13/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DUSK = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
export const NIGHT = ['#1d2349', '#2b3262', '#4a4876'];
export const MIDNIGHT = ['#10152f', '#1b2146', '#2f3566'];
export const DAY = ['#c6dcda', '#ebe6d0', '#f4e6cc'];
export const WARM = ['#d9d2c0', '#f0e2c6', '#f6e3c4'];
export const EVENING = ['#b7a2bd', '#eeb993', '#f6d6aa'];
export const HEAVEN = ['#e9d3a6', '#f8e2b0', '#fbeccb'];
export const TWILIGHT = ['#4f4d7d', '#9d86a2', '#dcb29a'];
export const NIGHTC = mix(C.night, C.indigo, 0.4);

/* ================================================================== the ten bridesmaids */
const veil = (col, extra = {}) => ({ hairStyle: 'veil', veil: col, veil2: shade(col, -0.14), beard: 'none', ...extra });
/** 0–4 the foolish, 5–9 the wise: festive white robes, coloured veils and sashes */
export const MAIDENS = [
  { robe: C.linen, ...veil(C.lavender), hair: C.hair2, skin: C.skin, belt: C.plumRobe },
  { robe: C.linen2, ...veil(C.skyVeil), hair: C.hair3, skin: C.skin3, belt: C.dustyBlue },
  { robe: C.linen, ...veil(C.roseRobe), hair: C.hair, skin: C.skin2, belt: C.terracotta },
  { robe: C.cream, ...veil(C.mauve), hair: C.hair3, skin: C.skin4, belt: C.ochre },
  { robe: C.linen2, ...veil(C.tealRobe), hair: C.hair2, skin: C.skin, belt: C.sageRobe },
  { robe: C.linen, ...veil(C.blushVeil), hair: C.hair2, skin: C.skin2, belt: C.ochre },
  { robe: C.linen2, ...veil(C.wheatRobe), hair: C.hair3, skin: C.skin3, belt: C.clayMantle },
  { robe: C.linen, ...veil(C.sageRobe), hair: C.hair, skin: C.skin, belt: C.ochre },
  { robe: C.cream, ...veil(C.ochreRobe), hair: C.hair3, skin: C.skin4, belt: C.terracotta },
  { robe: C.linen2, ...veil(C.dustyBlue), hair: C.hair2, skin: C.skin2, belt: C.ochre },
];
/** the bridegroom: festive, with a wreath; his friends carry torches */
export const GROOM = { robe: C.linen, mantle: C.sun, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.terracotta, mantleArm: true };
export const FRIENDS = [
  { robe: C.dustyBlue, mantle: C.ochre, hair: C.hair2, hairStyle: 'wrap', veil: C.cream, beard: 'short', skin: C.skin3, belt: C.leather },
  { robe: C.plumRobe, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.ochre },
];
export const SELLER = { robe: C.ochreRobe, mantle: C.wood3, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };

/** where the lamp's wick is, relative to the lamp's foot */
export const WICK = [21, -9];
/** a small clay oil lamp resting on the palm, no flame (origin: its foot) */
export function lampBody(c) {
  return sheet()
    .p(c.cut([[-15, 0], [-18, -5], [-10, -10], [7, -10], [15, -8], [20, -10], [22, -8], [15, -1], [7, 1], [-10, 1]], 0.3, 4), C.pot)
    .p(c.cut(c.circ(-2, -9, 4, 8), 0.2, 3), shade(C.pot, -0.32))
    .x(c.ribbon([[-14, -4], [12, -4]], 1.2), shade(C.pot, 0.25), 'opacity=".6"').out();
}
/** a lamp flame with its glow (origin: the wick) — posed as a whole, so its flicker costs nothing */
export function lampFire(c, glowR = 46) {
  return `<circle cy="-10" r="${glowR}" fill="url(#warm-glow)"/><path d="M0 0C-6 -4 -5.5 -12 0 -21C5.5 -12 6 -4 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2.4 -5 -2.4 -8 0 -12C2.4 -8 2.4 -5 0 -2Z" fill="#fff4d2"/>`;
}
/** a thin curl of smoke over a lamp that has gone out (origin: its base) */
export function smoke(c, h = 46) {
  const pts = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([Math.sin(u * PI * 2.4) * 6 * (0.4 + u), -u * h]); }
  return `<path d="${c.ribbon(pts, (u) => 3.6 - u * 2.6)}" fill="${C.stone2}" opacity=".7"/>`;
}

/**
 * The ten as puppets in layer L: standing, and (sit) seated asleep. Each carries her own lamp as separate
 * cut-outs (body in L, flame in fireL). Returns [{ i, wise, stand, sleep, body, fire, seed }].
 */
export function maidens(S, L, { fireL = L, sit = true, only = null } = {}) {
  const c = S.c;
  return MAIDENS.map((o, i) => {
    if (only && !only.includes(i)) return null;
    const wise = i >= 5;
    const hold = wise ? `<g transform="translate(0 4)">${oilFlask6(c)}</g>` : '';
    const stand = S.puppet(L.add(person(c, { ...o, holdB: hold })));
    const sleep = sit ? S.puppet(L.add(person(c, { ...o, pose: 'sit', eyes: 'closed', holdB: '' }))) : null;
    const body = L.add(`<g>${lampBody(c)}</g>`);
    const fire = fireL.add(`<g>${lampFire(c)}</g>`);
    return { i, wise, stand, sleep, body, fire, seed: c.rr(0, 9) };
  }).filter(Boolean);
}
/** the palm of a puppet's front hand (armF degrees), as hand() but resting under the hand */
function palm_(x, y, s, flip, a) {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s + 5 * s];
}
/**
 * Place a maiden and her lamp. sleep 0→1 cross-fades to her seated sleeping cut-out with the lamp set down
 * beside her; fire is the flame's size (0 = out), glow its brightness.
 */
export function setMaiden(m, { x, y, s = 0.78, flip = false, armF = 46, armB = 8, head = 0, o = 1, sleep = 0, blink = 0, fire = 1, time = 0, walk = 0, sleepHead = 22 }) {
  const sw = sleep > 0.5 ? 1 : 0;
  const bob = walk ? -Math.abs(Math.sin(walk)) * 4 : 0;
  m.stand.set({ x, y: y + bob, s, flip, o: o * (1 - sw), armF, armB, head, blink });
  if (m.sleep) m.sleep.set({ x, y: y + 2, s, flip, o: o * sw, armF: 10, armB: 0, head: sleepHead });
  const dir = flip ? -1 : 1;
  const [hx, hy] = palm_(x, y + bob, s, flip, armF);
  const gx = x + dir * 40 * s, gy = y + 2;
  const k = sleep;
  const lx = lerp(hx, gx, k), ly = lerp(hy, gy, k);
  pose(m.body, { x: lx, y: ly, s, sx: dir, o });
  const fl = fire * (1 + (time ? Math.sin(time * 9 + m.seed) * 0.08 + Math.sin(time * 13 + m.seed * 2) * 0.05 : 0));
  pose(m.fire, { x: lx + dir * WICK[0] * s, y: ly + WICK[1] * s, s: s * Math.max(0.001, fl), o: o * (fire > 0.02 ? 1 : 0) });
}

/* ================================================================== the night street with the wedding house */
export const WD = { G: 708, DOOR: 1110, DW: 96, DH: 176, WIN: [972, 470], STALL: 392 };
/** the ten stand here (x), the foolish on the left, the wise nearer the house */
export const SPOTS = [452, 508, 564, 620, 676, 772, 828, 884, 940, 996];
/** on a phone (portrait) the row closes up a little so all ten stay inside the screen */
export const SPOTS_P = [516, 566, 616, 666, 716, 794, 844, 894, 944, 994];
/** on a phone the oil-seller's stall stands further in, so he is not cut off by the edge (weddingSet's stall) */
export const STALL_P = 440;
export const spotsFor = (S) => (S.portrait ? SPOTS_P : SPOTS);
/**
 * The street at dusk/night: dusk and night skies (fade night.layer), moon and a cloud on strings, far hills with a
 * lit village, the hill road the bridegroom comes down (with far torch lights), the wedding house on the right
 * (door opening, a small window), the oil-seller's stall on the left, the street. Returns handles.
 */
export function weddingSet(S, { moonAt = [1260, 150], stall = WD.STALL } = {}) {
  const c = S.c;
  const T = (m, k) => tint13(m, NIGHTC, k);
  sky(S, DUSK);
  const night = sky(S, NIGHT, { name: 'night', rise: 0 });
  night.layer.add(`<g>${stars(c, { x0: -700, x1: 2300, y0: -500, y1: 380, n: 90 })}</g>`);
  night.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="130" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 32)}`, { x: moonAt[0], y: moonAt[1], len: 900 });
  const cl = hanging(hangL, T(cloud(c, 180), 0.45), { x: 460, y: 170, len: 900 });

  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.indigo, 0.42) });
  far.add(fb.markup + T(town(c, { x: 260, y: fb.fn(260) + 14, n: 8, spread: 300, sc: 0.46, lit: true }), 0.35));

  // the hill road the bridegroom comes down
  const roadL = S.layer({ par: 0.16, sh: 3 });
  const hfn = c.wave(510, [12, 5], [900, 300]);
  const hs = sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.indigo, 0.34));
  const ROAD = [[1700, 486], [1560, 498], [1440, 516], [1330, 540], [1250, 572]];
  hs.p(c.ribbon(ROAD, (u) => 6 + u * 16), mix(C.sand, C.indigo, 0.3));
  roadL.add(hs.out());
  roadL.add(T(olive(c, 1480, hfn(1480) + 30, 0.5) + olive(c, 640, hfn(640) + 14, 0.5) + cypress(c, 1620, hfn(1620) + 20, 90) + cypress(c, 180, hfn(180) + 12, 80), 0.4));
  const torches = [0, 1, 2].map((i) => roadL.add(`<g><circle r="22" fill="url(#warm-glow)"/><circle r="3.4" fill="${C.lampFlame}"/></g>`));

  // behind the wedding house's door and window: warm light and the feast
  const P = 0.42;
  const inside = S.layer({ par: P, sh: 1 });
  const D = WD.DOOR, G = WD.G, [wx, wy] = WD.WIN;
  const ins = sheet();
  ins.p(c.cut([[D - 70, 500], [D + 70, 500], [D + 70, G + 4], [D - 70, G + 4]], 0.4, 8), mix(C.lampGlow, C.apricot, 0.35));
  ins.p(c.cut([[wx - 40, wy - 40], [wx + 40, wy - 40], [wx + 40, wy + 40], [wx - 40, wy + 40]], 0.4, 6), mix(C.lampGlow, C.apricot, 0.3));
  inside.add(ins.out() + `<g transform="translate(${D - 48} 568)">${garland2(c, 96, 12)}</g>`);
  inside.add(`<circle cx="${D}" cy="590" r="120" fill="url(#warm-glow)"/>`);
  // guests at the feast, glimpsed through the doorway (a still cut-out)
  const guests = [{ x: D - 30, y: G - 26, s: 0.52, o: crowdPerson(c, { pose: 'sit' }) }, { x: D + 28, y: G - 24, s: 0.54, flip: true, o: crowdPerson(c, { pose: 'sit' }) }];
  inside.add(`<g>${pose3_4(c, guests.map((g) => ({ ...g, armF: 40 })))}</g><g transform="translate(${D} ${G - 6})">${lowTable2(c, 130, 30)}</g>`);

  // the wedding house
  const houseL = S.layer({ par: P, sh: 4 });
  const W = sheet();
  const doorHole = [[D - WD.DW / 2, G + 2], [D - WD.DW / 2, G - WD.DH + 48], ...c.arc(D, G - WD.DH + 48, WD.DW / 2, 48, PI, 2 * PI, 12), [D + WD.DW / 2, G - WD.DH + 48], [D + WD.DW / 2, G + 2]];
  const winHole = [[wx - 26, wy + 24], [wx - 26, wy - 8], ...c.arc(wx, wy - 8, 26, 20, PI, 2 * PI, 8), [wx + 26, wy - 8], [wx + 26, wy + 24]];
  const wall = mix(C.plaster, C.lavender, 0.3);
  W.p(c.cut([[880, 360], [2300, 360], [2300, G + 6], [880, G + 6]], 0.8, 14) + c.hole(doorHole, 0.4, 6) + c.hole(winHole, 0.3, 5), wall);
  let sp = '';
  for (let i = 0; i < 12; i++) sp += c.cut(c.blob(c.rr(900, 1700), c.rr(390, 680), c.rr(12, 26), c.rr(5, 10), 8, 0.2), 0.5, 4);
  W.x(sp, shade(wall, -0.08), 'opacity=".55"');
  W.p(c.cut([[870, 348], [2300, 348], [2300, 366], [870, 366]], 0.4, 12), mix(C.roof, C.indigo, 0.2));
  W.p(c.ribbon([[D - WD.DW / 2 - 6, G + 2], [D - WD.DW / 2 - 6, G - WD.DH + 48]], 10) + c.ribbon([[D + WD.DW / 2 + 6, G + 2], [D + WD.DW / 2 + 6, G - WD.DH + 48]], 10) + c.ribbon(c.arc(D, G - WD.DH + 48, WD.DW / 2 + 6, 54, PI, 2 * PI, 14), 10), mix(C.stone2, C.indigo, 0.15));
  W.p(c.cut(c.rect(1240, 440, 48, 56), 0.3, 5) + c.cut(c.rect(1400, 440, 48, 56), 0.3, 5), mix(C.lampGlow, C.apricot, 0.45));
  W.p(c.ribbon([[1234, 498], [1294, 498]], 5) + c.ribbon([[1394, 498], [1454, 498]], 5) + c.ribbon([[wx - 32, wy + 26], [wx + 32, wy + 26]], 5), C.wood2);
  houseL.add(W.out());
  houseL.add(`<g transform="translate(${D - 118} ${G - WD.DH - 8})">${garland2(c, 236, 26)}</g>`);
  // two lanterns by the door
  const lant = [D - 86, D + 86].map((x) => houseL.add(`<g><circle r="46" fill="url(#warm-glow)"/><path d="${c.cut(c.ell(0, 0, 10, 13, 12), 0.3, 3)}" fill="${C.apricot}"/><path d="${c.ribbon([[0, -13], [0, -30]], 1.6)}" fill="${C.wood2}"/></g>`));
  // the door leaf (hinged on its left) and the window shutter
  const doorLeaf = houseL.add(`<g>${sheet().p(c.cut([[0, 2], [0, -WD.DH + 48], ...c.arc(WD.DW / 2, -WD.DH + 48, WD.DW / 2, 48, PI, 1.5 * PI, 8), [WD.DW / 2, -WD.DH], [WD.DW / 2, 2]], 0.4, 6), C.wood2).p(c.cut([[WD.DW / 2, 2], [WD.DW / 2, -WD.DH], ...c.arc(WD.DW / 2, -WD.DH + 48, WD.DW / 2, 48, 1.5 * PI, 2 * PI, 8), [WD.DW, -WD.DH + 48], [WD.DW, 2]], 0.4, 6), shade(C.wood2, 0.08)).x(c.ribbon([[4, -40], [WD.DW - 4, -40]], 4) + c.ribbon([[4, -110], [WD.DW - 4, -110]], 4), C.soilDark, 'opacity=".6"').x(c.poly(c.circ(WD.DW / 2 + 14, -74, 4, 8)), C.ochre).out()}</g>`);
  const bar = houseL.add(`<g>${sheet().p(c.cut(c.rect(-62, -7, 124, 14), 0.3, 6), C.wood).out()}</g>`);
  const shutter = houseL.add(`<g>${sheet().p(c.cut(c.rect(0, -30, 52, 56), 0.3, 5), C.wood2).x(c.ribbon([[4, -14], [48, -14]], 2) + c.ribbon([[4, 4], [48, 4]], 2), C.soilDark, 'opacity=".5"').out()}</g>`);

  // the oil-seller's stall down the lane on the left
  const lane = S.layer({ par: 0.36, sh: 3 });
  lane.add(T(house(c, 110, 600, 150, 120, { stairs: false, lit: true }) + house(c, 520, 598, 110, 90, { stairs: true }), 0.3));
  lane.add(`<g transform="translate(${stall} 640) scale(.8)">${T(stall9(c, 190), 0.2)}</g>`);
  lane.add(`<g transform="translate(${stall - 50} 598)">${jar13(c, 40, C.pot)}</g><g transform="translate(${stall + 36} 600)">${jar13(c, 34, C.clay)}</g>`);
  const stallGlow = lane.add(`<g><circle r="110" fill="url(#warm-glow)"/><path d="${c.cut(c.ell(0, 0, 9, 12, 12), 0.3, 3)}" fill="${C.apricot}"/></g>`);
  const seller = S.puppet(lane.add(person(c, SELLER)));

  // the street
  const groundL = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(G - 10, [3, 1.5], [700, 180]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 0.8), mix(C.sand, C.indigo, 0.2));
  let cob = '';
  for (let i = 0; i < 80; i++) cob += c.cut(c.blob(c.rr(-700, 2300), c.rr(G + 10, 1000), c.rr(10, 24), c.rr(4, 8), 8, 0.2), 0.4, 4);
  g.x(cob, mix(C.sand2, C.indigo, 0.25), 'opacity=".55"');
  groundL.add(g.out());
  groundL.add(T(palm(c, 790, G - 4, 250) + bush(c, 360, G + 4, 90, C.sage, C.moss), 0.35));
  return {
    c, STALL: stall, night, hangL, moonEl, cl, far, roadL, torches, ROAD, inside, houseL, lant, doorLeaf, bar, shutter, lane, stallGlow, seller, groundL, gfn, P,
    /** the door: open 0 (shut) … 1 (wide) */
    door(open) { pose(doorLeaf, { x: D - WD.DW / 2, y: G, sx: 1 - open * 0.86 }); },
    update(time, { moonY = moonAt[1], moonX = moonAt[0], moonO = 1 } = {}) {
      pose(moonEl, { x: moonX, y: moonY, r: Math.sin(time * 0.6) * 1.2, o: moonO });
      swing(cl, 460 + Math.sin(time * 0.1) * 20, 170, time, 1.1, 0.6, 1);
      lant.forEach((l, i) => pose(l, { x: D + (i ? 86 : -86), y: 470, s: 1 + Math.sin(time * 5 + i * 2) * 0.03, r: Math.sin(time * 0.9 + i) * 3 }));
    },
  };
}
/** a point along a polyline, u in [0, 1] */
export function along(pts, u) {
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  let x = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (x <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, x / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; }
    x -= seg[i];
  }
  return pts[pts.length - 1];
}

/* ================================================================== the talents */
/** a gold talent: a heavy round disc of gold (origin centre) */
export function talent(c, r = 13) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 18), 0.3, 3), mix(C.sun, C.sunDeep, 0.25));
  s.p(c.cut(c.circ(0, 0, r * 0.74, 16), 0.2, 3), C.sun);
  s.x(c.poly(c.star(0, 0, r * 0.42, r * 0.18, 6, 0)), mix(C.sun, C.sunDeep, 0.35));
  s.x(c.poly(c.ell(-r * 0.36, -r * 0.4, r * 0.22, r * 0.12, 8, -0.6)), C.star, 'opacity=".9"');
  return s.out();
}
/** a dull, earth-stained talent in a dirty cloth (origin centre) */
export function dirtyTalent(c, r = 13) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 18), 0.3, 3), mix(C.sun, C.soil, 0.45));
  s.p(c.cut(c.circ(0, 0, r * 0.74, 16), 0.2, 3), mix(C.sun, C.soil, 0.35));
  let d = '';
  for (let i = 0; i < 5; i++) d += c.cut(c.blob(c.rr(-r * 0.6, r * 0.6), c.rr(-r * 0.6, r * 0.6), c.rr(2, 4), c.rr(1.5, 3), 6, 0.3), 0.2, 2);
  s.x(d, C.soilDark, 'opacity=".6"');
  return s.out();
}
/** a cloth bundle (the talent wrapped up); origin: bottom centre */
export function bundle(c, col = mix(C.linen2, C.soil, 0.25)) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-22, -14], [-12, -24], [-4, -22], [0, -34], [6, -22], [14, -24], [22, -12], [18, 0]], 0.6, 4), col);
  s.x(c.ribbon([[-6, -22], [8, -21]], 2.4), C.rope);
  let d = '';
  for (let i = 0; i < 4; i++) d += c.cut(c.blob(c.rr(-14, 14), c.rr(-18, -4), c.rr(2, 4), c.rr(1.5, 3), 6, 0.3), 0.2, 2);
  s.x(d, C.soil, 'opacity=".5"');
  return s.out();
}
/** the slots of n talents held in a pile against the chest (3 on the bottom row, then 2, …), relative to the palm */
export function pileAt(n, i, r = 13) {
  const rows = n <= 1 ? [1] : n === 2 ? [2] : n === 3 ? [2, 1] : n === 4 ? [2, 2] : n === 5 ? [3, 2] : n <= 7 ? [3, 2, n - 5] : n <= 10 ? [4, 3, 2, n - 9 > 0 ? n - 9 : 1].slice(0, n <= 9 ? 3 : 4) : [4, 3, 3, n - 10];
  let k = i;
  for (let row = 0; row < rows.length; row++) {
    if (k < rows[row]) return [(k - (rows[row] - 1) / 2) * r * 1.9, -row * r * 1.55];
    k -= rows[row];
  }
  return [0, -rows.length * r * 1.55];
}

/** place talent cut-outs as a pile held on a puppet's palm (armF degrees); els may be a subset (n = pile size) */
export function holdPile(els, x, y, s, flip, armF, { n = els.length, o = 1, from = 0 } = {}) {
  const [hx, hy] = palm_(x, y, s, flip, armF);
  els.forEach((el, i) => { const [dx, dy] = pileAt(n, i + from); pose(el, { x: hx + (flip ? -8 : 8) * s + dx * s * 0.8, y: hy - 10 * s + dy * s * 0.8, s: s * 0.8, o }); });
  return [hx, hy];
}
/** where talent i of a pile of n held on the palm lies */
export function pilePos(x, y, s, flip, armF, n, i) {
  const [hx, hy] = palm_(x, y, s, flip, armF);
  const [dx, dy] = pileAt(n, i);
  return [hx + (flip ? -8 : 8) * s + dx * s * 0.8, hy - 10 * s + dy * s * 0.8];
}
/** where talent i of a pile of n lies on a table top at (x, y) */
export const tableSpot = (x, y, n, i, sc = 1) => { const [dx, dy] = pileAt(n, i); return [x + dx * sc, y - 12 * sc + dy * sc]; };

/** the master of the talents and his three servants */
export const MASTER = { robe: C.linen, mantle: C.plumRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.sun, mantleArm: true };
export const SERV5 = { robe: C.tealRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.ochre };
export const SERV2 = { robe: C.wheatRobe, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.leather };
export const SERV1 = { robe: mix(C.stone2, C.sageRobe, 0.4), mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin4, belt: C.rope };
export const TRADER = { robe: C.ochreRobe, mantle: C.terracotta, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'full', skin: C.skin4, belt: C.leather };
export const BANKER = { robe: C.dustyBlue, mantle: C.linen2, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre };

/* ================================================================== the master's courtyard */
export const ES = { G: 700, JOY: 520, JW: 120, JH: 200, GATE: 1150, GW: 76, GH: 150, TABLE: 800, MX: 700 };
/**
 * The master's courtyard: sky, sun and clouds on strings, far hills and a town, the house front with the great inner
 * door (behind it, golden light and the feast: "the joy of your master"), the courtyard wall on the right with the
 * gate onto the road (and a darkness that can fall outside it: dark.fade), the paved yard. Returns handles.
 */
export function estateSet(S, { skyCols = DAY, sunAt = [1280, 150], beyond = null } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[430, 150, 180], [980, 110, 140]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 430, amps: [16, 7, 3], lens: [1000, 360, 130], color: C.hillFar });
  far.add(fb.markup + town(c, { x: 1500, y: fb.fn(1500) + 12, n: 8, spread: 320, sc: 0.5 }));
  const mid = S.layer({ par: 0.16, sh: 3 });
  const m = hillsWith(c, { y: 500, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 20 });
  mid.add(m.markup);
  let rows = '';
  for (let i = 0; i < 5; i++) rows += c.ribbon([[1200, 540 + i * 14], [2400, 530 + i * 16]], 3);
  mid.add(`<path d="${rows}" fill="${C.wheatGreen}" opacity=".6"/>` + olive(c, 1330, 560, 0.6) + olive(c, 1480, 566, 0.55));
  // outer darkness (falls outside the gate)
  const dark = S.layer({ par: 0.3, sh: 1, flat: true, blur: 18 });
  dark.add(`<g>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${ES.GATE - 30 + i * 26} -2000H3200V2400H${ES.GATE - 30 + i * 26}Z" fill="#161a33" opacity=".38"/>`).join('')}${stars(c, { x0: 1300, x1: 2200, y0: 60, y1: 420, n: 10, color: '#8b8fb0' })}</g>`);
  dark.fade(0);
  const out = beyond ? beyond(S) : null;
  // the joy: golden light and the feast behind the inner door
  const P = 0.45;
  const joyL = S.layer({ par: P, sh: 1 });
  const J = ES.JOY, G = ES.G;
  joyL.add(sheet().p(c.cut(c.rect(J - 90, 420, 180, G - 420 + 4), 0.4, 8), mix(C.lampGlow, C.sun, 0.3)).out());
  const joyGlow = joyL.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);
  joyL.add(`<g transform="translate(${J - 60} 520)">${garland2(c, 120, 16)}</g>` + `<g>${pose3_4(c, [{ x: J - 34, y: G - 30, s: 0.48, o: crowdPerson(c, { pose: 'sit' }), armF: 60 }, { x: J + 34, y: G - 28, s: 0.5, flip: true, o: crowdPerson(c, { pose: 'sit' }), armF: 30 }])}</g><g transform="translate(${J} ${G - 8})">${lowTable2(c, 120, 30)}</g>`);
  // the house front with the great door and the courtyard wall with the gate
  const houseL = S.layer({ par: P, sh: 4 });
  const H = sheet();
  const jh = [[J - ES.JW / 2, G + 2], [J - ES.JW / 2, G - ES.JH + 60], ...c.arc(J, G - ES.JH + 60, ES.JW / 2, 60, PI, 2 * PI, 14), [J + ES.JW / 2, G - ES.JH + 60], [J + ES.JW / 2, G + 2]];
  H.p(c.cut([[260, 330], [1110, 330], [1110, G + 4], [260, G + 4]], 0.8, 14) + c.hole(jh, 0.4, 6), C.plaster);
  H.p(c.cut([[250, 316], [1120, 316], [1120, 334], [250, 334]], 0.4, 10), C.roof);
  let sp = '';
  for (let i = 0; i < 10; i++) sp += c.cut(c.blob(c.rr(300, 1080), c.rr(360, 660), c.rr(12, 26), c.rr(5, 10), 8, 0.2), 0.5, 4);
  H.x(sp, C.plaster2, 'opacity=".6"');
  H.p(c.ribbon([[J - ES.JW / 2 - 7, G + 2], [J - ES.JW / 2 - 7, G - ES.JH + 60]], 12) + c.ribbon([[J + ES.JW / 2 + 7, G + 2], [J + ES.JW / 2 + 7, G - ES.JH + 60]], 12) + c.ribbon(c.arc(J, G - ES.JH + 60, ES.JW / 2 + 7, 67, PI, 2 * PI, 16), 12), C.stone2);
  [760, 960].forEach((x) => { H.p(c.cut(c.rect(x - 24, 400, 48, 58), 0.3, 5), C.soilDark); H.p(c.ribbon([[x - 30, 460], [x + 30, 460]], 5), C.wood2); });
  // the courtyard wall to the right, with the gate
  const GX = ES.GATE, GW = ES.GW, GH = ES.GH;
  H.p(c.cut([[1110, 520], [GX - GW / 2, 520], [GX - GW / 2, G + 4], [1110, G + 4]], 0.5, 8) + c.cut([[GX + GW / 2, 520], [2400, 520], [2400, G + 4], [GX + GW / 2, G + 4]], 0.5, 8), C.plaster2);
  H.p(c.cut(c.rect(GX - GW / 2 - 14, G - GH - 16, 16, GH + 20), 0.3, 6) + c.cut(c.rect(GX + GW / 2 - 2, G - GH - 16, 16, GH + 20), 0.3, 6), C.stone2);
  H.p(c.cut(c.rect(GX - GW / 2 - 18, G - GH - 26, GW + 36, 14), 0.3, 6), C.stone);
  H.p(c.cut([[1106, 512], [2400, 512], [2400, 524], [1106, 524]], 0.3, 8), C.stone2);
  houseL.add(H.out());
  // a fig tree and jars in the yard
  houseL.add(`<g transform="translate(330 ${G})">${figTree(c)}</g><g transform="translate(410 ${G + 2})">${jar13(c, 56, C.pot)}</g><g transform="translate(446 ${G + 2})">${jar13(c, 44, C.clay)}</g>`);
  const doorL = houseL.add(`<g>${sheet().p(c.cut([[0, 2], [0, -ES.JH + 60], ...c.arc(ES.JW / 4, -ES.JH + 60, ES.JW / 4, 60, PI, 1.5 * PI, 8), [ES.JW / 4, -ES.JH], [ES.JW / 2, -ES.JH + 6], [ES.JW / 2, 2]], 0.4, 6), C.wood).x(c.ribbon([[4, -50], [ES.JW / 2 - 4, -50]], 3) + c.ribbon([[4, -130], [ES.JW / 2 - 4, -130]], 3), C.wood2, 'opacity=".7"').out()}</g>`);
  const doorR = houseL.add(`<g>${sheet().p(c.cut([[0, 2], [0, -ES.JH + 60], ...c.arc(ES.JW / 4, -ES.JH + 60, ES.JW / 4, 60, PI, 1.5 * PI, 8), [ES.JW / 4, -ES.JH], [ES.JW / 2, -ES.JH + 6], [ES.JW / 2, 2]], 0.4, 6), shade(C.wood, 0.06)).x(c.ribbon([[4, -50], [ES.JW / 2 - 4, -50]], 3) + c.ribbon([[4, -130], [ES.JW / 2 - 4, -130]], 3), C.wood2, 'opacity=".7"').out()}</g>`);
  const gate = houseL.add(`<g>${sheet().p(c.cut(c.rect(0, -GH + 6, GW, GH - 4), 0.4, 6), C.wood2).x(c.ribbon([[3, -GH + 30], [GW - 3, -GH + 30]], 3) + c.ribbon([[3, -30], [GW - 3, -30]], 3), C.soilDark, 'opacity=".55"').out()}</g>`);
  const floor = S.layer({ par: P, sh: 3 });
  const f = sheet().p(c.cut([[-900, G - 4], [2500, G - 4], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.stone, C.sand, 0.45));
  let fl = '';
  for (let y = G + 8; y < 1100; y += 40) for (let x = -600 + (Math.round(y / 40) % 2) * 45; x < 2200; x += 90) fl += c.cut(c.rect(x + c.rr(0, 4), y, 84, 34), 0.5, 10);
  f.x(fl, shade(C.stone, -0.06), 'opacity=".45"');
  floor.add(f.out());
  return {
    c, sk, hangL, sunEl, cls, far, mid, dark, out, joyL, joyGlow, houseL, doorL, doorR, gate, floor, P,
    /** the great inner door: 0 shut … 1 open wide */
    joy(open) {
      pose(doorL, { x: J - ES.JW / 2, y: G, sx: 1 - open * 0.84 });
      pose(doorR, { x: J + ES.JW / 2, y: G, sx: -(1 - open * 0.84) });
      pose(joyGlow, { x: J, y: 560, s: 0.6 + open * 0.5, o: open });
    },
    /** the gate: 0 shut … 1 open */
    gateOpen(open) { pose(gate, { x: GX - GW / 2, y: G, sx: 1 - open * 0.84 }); },
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.1, 0.6, cl.i));
    },
  };
}
/** a fig tree in a pot-less yard (origin: foot) */
export function figTree(c, h = 220) {
  const s = sheet();
  s.p(c.cut([[-8, 0], [-6, -h * 0.5], [-28, -h * 0.7], [-24, -h * 0.74], [-2, -h * 0.58], [4, -h * 0.78], [10, -h * 0.76], [8, -h * 0.5], [30, -h * 0.66], [34, -h * 0.62], [10, -h * 0.42], [9, 0]], 0.5, 6), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 22; i++) {
    const a = c.rr(PI * 1.05, PI * 1.95), r = c.rr(0.2, 1), x = Math.cos(a) * 80 * r, y = -h * 0.74 + Math.sin(a) * 70 * r;
    const leaf = c.cut(c.blob(x, y, c.rr(14, 22), c.rr(10, 15), 8, 0.25), 0.5, 4);
    if (i % 2) lv += leaf; else lv2 += leaf;
  }
  s.p(lv2, C.moss).p(lv, C.leaf);
  return s.out();
}
/** a money-changer's table with a little balance and stacks of coins (origin: floor centre) */
export function bankTable(c, w = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 10, -52, 10, 52), 0.3, 5) + c.cut(c.rect(w / 2 - 20, -52, 10, 52), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2, -60, w, 10), 0.3, 6), C.wood);
  s.p(c.cut(c.rect(-w / 2 + 4, -50, w - 8, 26), 0.4, 6), C.dustyBlue);
  s.x(c.ribbon([[-w / 2 + 6, -38], [w / 2 - 6, -38]], 2), C.cream, 'opacity=".6"');
  let st = '';
  [[-44, 6], [-22, 4], [24, 5], [46, 3]].forEach(([x, n]) => { for (let i = 0; i < n; i++) st += c.cut([[x - 9, -60 - i * 4], [x + 9, -60 - i * 4], [x + 9, -64 - i * 4], [x - 9, -64 - i * 4]], 0.2, 4); });
  s.p(st, C.sun);
  s.p(c.ribbon([[0, -60], [0, -100]], 3) + c.ribbon([[-26, -98], [26, -98]], 2.4), C.wood2);
  s.p(c.cut(c.arc(-26, -76, 10, 5, 0, PI, 6), 0.2, 3) + c.cut(c.arc(26, -76, 10, 5, 0, PI, 6), 0.2, 3), C.ochre);
  s.x(c.ribbon([[-26, -98], [-26, -76]], 0.8) + c.ribbon([[26, -98], [26, -76]], 0.8), C.ink, 'opacity=".6"');
  return s.out();
}
/** a spade (held: arm-local, hand at 0,0) */
export function spade(c, len = 110) {
  return sheet().p(c.ribbon([[0, -len * 0.3], [0, len * 0.66]], 4.4), C.wood2).p(c.cut([[-9, len * 0.64], [9, len * 0.64], [8, len * 0.9], [0, len * 0.98], [-8, len * 0.9]], 0.3, 4), C.stone2).out();
}
/** a heap of fresh earth (origin: bottom centre) */
export function mound(c, w = 70, h = 22, col = mix(C.soil, C.clay, 0.35)) {
  return sheet().p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, h, PI, 2 * PI, 12), [w / 2, 0]], 0.8, 5), col).out();
}
/** a bale of goods tied with rope (origin: bottom centre) */
export function bale(c, col = C.linen2) {
  return sheet().p(c.cut(c.rect(-24, -34, 48, 34), 0.6, 5), col).p(c.ribbon([[-24, -22], [24, -22]], 3) + c.ribbon([[-24, -10], [24, -10]], 3), C.rope).out();
}
/**
 * The market and the field (one long flat, ground layer par P): a street of stalls on the left (x 250–1050), a
 * money-changer's table, then the edge of town and a field with a lone tree (the hole is dug at FIELD.HOLE).
 */
export const MK = { G: 690, P: 0.6, HOLE: 1520, TREE: 1640, STALLS: [420, 700, 980] };
export function marketSet(S, { skyCols = DAY } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 42), { x: 1200, y: 140, len: 900 });
  const cls = [[500, 150, 180], [1500, 120, 160]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 130], color: C.hillFar, x0: -900, x1: 3400 }).markup);
  const mid = S.layer({ par: 0.25, sh: 3 });
  const m = hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 26, treeColor: C.sage, treeH: 20, x0: -900, x1: 3400 });
  mid.add(m.markup + town(c, { x: 500, y: m.fn(500) + 10, n: 10, spread: 700, sc: 0.62 }));
  const ground = S.layer({ par: MK.P, sh: 3 });
  const G = MK.G;
  const g = sheet();
  g.p(c.cut([[-900, G - 20], [1290, G - 20], [1290, 1700], [-900, 1700]], 0.8, 20), mix(C.stone, C.sand, 0.45));
  g.p(c.ridge(c.wave(G - 22, [4, 2], [600, 160]), 1290, 3400, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5));
  let cob = '';
  for (let i = 0; i < 60; i++) cob += c.cut(c.blob(c.rr(-600, 1280), c.rr(G, 1000), c.rr(8, 16), c.rr(4, 7), 8, 0.2), 0.3, 4);
  g.x(cob, C.stone2, 'opacity=".6"');
  let fur = '';
  for (let i = 0; i < 5; i++) fur += c.ribbon([[1330, G - 6 + i * 16], [2600, G - 8 + i * 17]], 3);
  g.x(fur, C.moss, 'opacity=".35"');
  ground.add(g.out());
  ground.add(house(c, 1150, G - 20, 110, 96, { stairs: false }) + cypress(c, 1300, G - 18, 120) + bush(c, 1780, G - 10, 70, C.sage, C.moss));
  ground.add(`<g transform="translate(${MK.TREE} ${G - 10})">${figTree(c, 260)}</g>`);
  MK.STALLS.forEach((x, i) => ground.add(`<g transform="translate(${x} ${G + 4})">${stall13(c, { w: 220, h: 190, awn: [C.dustyBlue, C.terracotta, C.sageRobe][i] })}</g>`));
  // goods on the counters
  ground.add(`<g transform="translate(${MK.STALLS[0] - 60} ${G - 76})">${bale(c)}</g><g transform="translate(${MK.STALLS[0]} ${G - 76})">${bale(c, C.wheatRobe)}</g><g transform="translate(${MK.STALLS[1] - 50} ${G - 76})">${jar13(c, 44)}</g><g transform="translate(${MK.STALLS[1] + 10} ${G - 76})">${jar13(c, 36, C.clay)}</g><g transform="translate(${MK.STALLS[2] - 40} ${G - 76})">${bale(c, C.mauve)}</g>`);
  return {
    c, sk, hangL, sunEl, cls, ground, G,
    update(time) {
      swing(sunEl, 1200, 140, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.1, 0.6, cl.i));
    },
  };
}

/* ================================================================== the Last Judgement */
/** the King: Jesus crowned (a golden crown over the halo) */
export const KING = { ...CAST.jesus };
export function kingMarkup(c, o = {}) {
  return addToHead2(person(c, { ...KING, ...o }), `<g transform="translate(-1 -24) scale(1.05)">${crown6(c)}</g>`);
}
/** a goat facing right: brown coat, horns swept back, a beard; origin between its feet (~70 long) */
export function goat(c, { k, coat = mix(C.wood3, C.wood2, 0.4), face } = {}) {
  const fc = face || shade(coat, -0.12);
  const b = sheet();
  let legs = '';
  [[-20, 0], [-11, 1], [12, 0], [20, 1]].forEach(([x]) => { legs += c.cut([[x - 2.4, -18], [x + 2.4, -18], [x + 2, 0], [x - 2, 0]], 0.2, 3); });
  b.p(legs, shade(coat, -0.2));
  b.p(c.cut([[-30, -36], [-22, -44], [0, -46], [20, -44], [30, -38], [28, -22], [18, -16], [-20, -16], [-30, -22]], 0.6, 4), coat);
  b.p(c.cut([[-30, -40], [-38, -52], [-33, -40]], 0.2, 3), coat);
  b.x(c.ribbon([[-20, -28], [18, -30]], 2) + c.ribbon([[-14, -20], [10, -21]], 1.4), shade(coat, -0.18), 'opacity=".5"');
  const h = sheet();
  h.p(c.cut([[-4, -4], [4, -10], [12, -8], [20, 0], [18, 5], [10, 5], [2, 4], [-4, 2]], 0.3, 3), fc);
  h.p(c.cut([[0, -8], [-6, -16], [-16, -18], [-24, -12], [-18, -14], [-8, -10], [-3, -5]], 0.3, 3), mix(C.stone2, C.wood3, 0.3));
  h.p(c.cut([[2, -6], [-6, -2], [-8, 3], [-1, 0]], 0.2, 2), shade(fc, -0.1));
  h.p(c.cut([[8, 4], [12, 5], [11, 16], [8, 12]], 0.2, 2), shade(coat, -0.28));
  h.x(c.poly(c.circ(9, -3, 1.3, 6)), '#fff');
  return `<g${k_(k)}><g class="bd">${b.out()}</g><g class="hd" transform="translate(26 -44)">${h.out()}</g></g>`;
}
const GOATS = [mix(C.wood3, C.wood2, 0.4), mix(C.hair2, C.wood3, 0.3), mix(C.stone2, C.rock3, 0.5), mix(C.clay, C.wood3, 0.5), mix(C.hair3, C.wood2, 0.4), mix(C.wood3, C.sand2, 0.3)];
export const goatCoat = (i) => GOATS[i % GOATS.length];
export const WOOLS = [C.linen, '#f4ece0', C.cream, '#efe6da', C.linen2, '#f7f1e6'];

/** the six works of mercy: the "least" of the King's brothers, as they are in the vignettes */
export const LEAST = {
  hungry: { robe: mix(C.stone2, C.sand2, 0.5), hair: C.greyHair, hairStyle: 'wrap', veil: mix(C.stone2, C.sand, 0.4), beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope },
  thirsty: { robe: mix(C.ochreRobe, C.sand2, 0.4), mantle: C.wood3, hair: C.hair3, hairStyle: 'wrap', veil: C.sand, beard: 'short', skin: C.skin4, belt: C.leather },
  stranger: { robe: C.indigo, mantle: C.terracotta, hair: C.hair3, hairStyle: 'wrap', veil: C.ochre, veil2: C.terracotta, beard: 'full', skin: C.skin4, belt: C.sun },
  naked: { robe: mix(C.stone2, C.rock2, 0.4), hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin2 },
  sick: { robe: C.linen2, hair: C.hair, hairStyle: 'short', beard: 'short', skin: mix(C.skin, C.stone, 0.25) },
  prison: { robe: mix(C.rock2, C.stone2, 0.4), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope },
};
export const MERCY = ['hungry', 'thirsty', 'stranger', 'naked', 'sick', 'prison'];
/** the righteous who helped (the same six), and those who passed by */
export const HELPERS = [
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair2, beard: 'none', skin: C.skin },
  { robe: C.skyVeil, hairStyle: 'veil', veil: C.linen, hair: C.hair3, beard: 'none', skin: C.skin2, belt: C.ochre },
  { robe: C.sageRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: C.wheatRobe, mantle: C.dustyBlue, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin3 },
  { robe: C.mauve, hairStyle: 'veil', veil: C.linen2, hair: C.hair, beard: 'none', skin: C.skin4 },
  { robe: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.leather },
];

/** a torn, ragged short cloth for the naked one (worn round the loins/shoulders; body coords) */
function rags(c, col = mix(C.stone2, C.rock2, 0.4)) {
  return sheet().p(c.cut([[-22, -96], [22, -96], [26, -54], [16, -58], [10, -48], [0, -56], [-10, -46], [-18, -56], [-26, -52]], 0.8, 5), col).out();
}
/** a warm cloak put round someone's shoulders (body coords of a sitting puppet: dy 62) */
function cloakOn(c, col = C.clayMantle, dy = 62) {
  return sheet().p(c.cut([[-26, -140 + dy], [-10, -150 + dy], [8, -150 + dy], [26, -140 + dy], [34, -96 + dy], [30, -60 + dy], [-32, -58 + dy], [-36, -96 + dy]], 0.6, 5), col).x(c.ribbon([[-20, -120 + dy], [22, -122 + dy]], 1.6), shade(col, -0.2), 'opacity=".6"').out();
}
/**
 * One work of mercy as a small painted scene in a frame (≈ 300 × 220, origin centre, floor at y 70).
 * done: the righteous helping; not done: the needy one alone, the passer-by turned away.
 * Returns { base, prop, from, to, head } — prop is the thing handed over (moved from → to), head the needy one's
 * head (for the light of v40).
 */
export function mercyVig(c, kind, done = true, { w = 300, h = 220 } = {}) {
  const F = 70;
  const nightK = kind === 'stranger' || kind === 'prison';
  const bg = sheet();
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 12, -h / 2 - 12, w + 24, h + 24), 0.6, 8), done ? C.haloRim : mix(C.rock2, C.storm, 0.25)).p(c.cut(c.rect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8), 0.4, 8), done ? C.ochre : C.rock3);
  bg.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.3, 10), nightK ? mix(C.night, C.indigo, 0.5) : done ? mix(C.dawn, C.parchment, 0.5) : mix(C.stone, C.skyBlue2, 0.3));
  bg.p(c.cut(c.rect(-w / 2, F - 6, w, h / 2 - F + 6), 0.4, 10), nightK ? mix(C.sand2, C.indigo, 0.4) : mix(C.sand, C.stone2, 0.4));
  const P = (o, x, y, s, flip = false, extra = {}) => pose3_4(c, [{ o, x, y, s, flip, ...extra }]);
  const L = LEAST[kind], H = HELPERS[MERCY.indexOf(kind)];
  let fig = '', prop = '', from = [0, 0], to = [0, 0], head = [0, 0];
  if (kind === 'hungry') {
    bg.p(c.cut(c.rect(40, -h / 2, w / 2 - 40, F + h / 2 - 6), 0.4, 8), C.plaster2).p(c.cut([[70, F - 6], [70, -20], ...c.arc(96, -20, 26, 22, PI, 2 * PI, 8), [122, -20], [122, F - 6]], 0.3, 5), C.soilDark);
    fig += P({ ...L, pose: 'sit', holdF: `<g transform="translate(0 2)">${bb10(c)}</g>` }, -70, F, 0.7, false, { armF: 70, head: done ? -6 : 16 });
    head = [-70 + 2 * 0.7, F - 105 * 0.7];
    if (done) { fig += P({ ...H, holdF: '' }, 40, F, 0.7, true, { armF: 76, head: 8 }); from = [0, -40]; to = [-26, -8]; prop = loaf2(c, 12); }
    else { fig += P({ ...H, holdF: `<g transform="translate(-4 0)">${loaf2(c, 12)}</g>` }, 70, F, 0.7, false, { armF: 20, head: -6 }); }
  }
  if (kind === 'thirsty') {
    fig += `<g transform="translate(-10 ${F}) scale(.5)">${well4(c)}</g>`;
    fig += P({ ...L, pose: 'kneel' }, -82, F, 0.7, false, { armF: 80, armB: 60, head: done ? -10 : 18 });
    head = [-82 + 2 * 0.7, F - 121 * 0.7];
    if (done) { fig += P({ ...H }, 76, F, 0.7, true, { armF: 90, armB: 70, head: 12 }); prop = hydria4(c, { sc: 0.5 }); from = [38, -40]; to = [-10, -50]; }
    else { fig += P({ ...H, holdF: `<g transform="translate(0 -6)">${hydria4(c, { sc: 0.4 })}</g>` }, 110, F, 0.7, false, { armF: 20, head: -4 }); }
  }
  if (kind === 'stranger') {
    bg.p(c.cut(c.rect(20, -h / 2, w / 2 - 20, F + h / 2 - 6), 0.4, 8), mix(C.plaster2, C.indigo, 0.35));
    bg.p(c.cut([[48, F - 6], [48, -26], ...c.arc(78, -26, 30, 26, PI, 2 * PI, 8), [108, -26], [108, F - 6]], 0.3, 5), done ? mix(C.lampGlow, C.apricot, 0.3) : C.soilDark);
    bg.x(c.poly(c.star(-100, -70, 4, 1.5, 4, 0)) + c.poly(c.star(-40, -88, 3, 1.2, 4, 0)) + c.poly(c.star(-10, -60, 3.4, 1.3, 4, 0)), C.star);
    fig += P({ ...L, holdB: `<g transform="translate(0 -4)">${sheet().p(c.ribbon([[0, -80], [0, 60]], 3.4), C.wood2).out()}</g>` }, -70, F, 0.7, false, { armF: done ? 40 : 10, armB: 20, head: done ? -4 : 14 });
    head = [-70 + 2 * 0.7, F - 167 * 0.7];
    if (done) { fig += `<circle cx="78" cy="10" r="90" fill="url(#warm-glow)"/>` + P({ ...H }, 30, F, 0.7, true, { armF: 90, armB: 60, head: 6 }); }
    else { prop = sheet().p(c.cut(c.rect(0, -92, 60, 92), 0.3, 5), C.wood2).out(); }
    from = [48, F - 6]; to = [48, F - 6];
  }
  if (kind === 'naked') {
    bg.p(c.cut(c.blob(-110, 30, 40, 50, 10, 0.2), 0.6, 6), mix(C.skyBlue2, C.stone, 0.3));
    fig += P({ ...L, pose: 'sit', robe: mix(C.skin2, C.stone2, 0.2), holdF: '' }, -40, F, 0.74, false, { armF: 30, armB: 20, head: done ? -4 : 16 });
    fig += `<g transform="translate(-40 ${F}) scale(.74)">${rags(c)}</g>`;
    head = [-40 + 2 * 0.74, F - 105 * 0.74];
    if (done) { fig += P({ ...H }, 70, F, 0.7, true, { armF: 80, armB: 70, head: 10 }); prop = cloakOn(c); from = [60, -30]; to = [-40, F]; }
    else { fig += P({ ...H, mantle: C.clayMantle }, 100, F, 0.7, false, { armF: 10, head: -6 }); }
  }
  if (kind === 'sick') {
    fig += `<g transform="translate(-30 ${F}) scale(.8)">${sickOnMat6(c, L, 170)}</g>`;
    head = [-30 + 170 * 0.8 * 0.5 - 30 * 0.8, F - 40];
    if (done) { fig += P({ ...H, pose: 'kneel', holdF: `<g transform="translate(0 2)">${bowl2(c, { w: 26, food: 'stew' })}</g>` }, -90, F, 0.7, false, { armF: 70, head: 14 }); }
    else { fig += `<g transform="translate(-100 ${F})">${sheet().p(c.cut(c.rect(-16, -30, 32, 8), 0.3, 4), C.wood).p(c.cut(c.rect(-14, -22, 5, 22), 0.2, 3) + c.cut(c.rect(9, -22, 5, 22), 0.2, 3), C.wood2).out()}</g>`; }
    head = [60, F - 28];
  }
  if (kind === 'prison') {
    bg.p(c.cut(c.rect(-w / 2, -h / 2, w, F + h / 2 - 6), 0.3, 8), mix(C.stone2, C.indigo, 0.35));
    let bl = '';
    for (let y = -h / 2 + 8, r = 0; y < F - 20; y += 26, r++) for (let x = -w / 2 + 4 + (r % 2) * 20; x < w / 2 - 20; x += 40) bl += c.cut(c.rect(x, y, 36, 22), 0.4, 6);
    bg.x(bl, mix(C.stone, C.indigo, 0.3), 'opacity=".6"');
    bg.p(c.cut(c.rect(-100, -70, 90, 80), 0.3, 5), mix(C.soilDark, C.indigo, 0.4));
    fig += `<g transform="translate(-58 22) scale(.6)"><g transform="translate(0 0)">${person(c, { ...L })}</g></g>`;
    fig += `<g transform="translate(-100 -70)">${bars1(c, 90, 80, 4)}</g>`;
    head = [-58 + 1, 22 - 167 * 0.6];
    if (done) { fig += `<circle cx="-10" cy="0" r="70" fill="url(#warm-glow)"/>` + P({ ...H, holdB: `<g transform="translate(0 4)">${loaf2(c, 12)}</g>` }, 60, F, 0.72, true, { armF: 96, armB: 40, head: 4 }); }
    else { fig += P({ ...H }, 120, F, 0.7, false, { armF: 10, head: -4 }); }
  }
  const strings = `<path d="M${-w / 2 + 30} ${-h / 2 - 12}V-1800M${w / 2 - 30} ${-h / 2 - 12}V-1800" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>`;
  return { base: strings + fr.out() + bg.out() + fig, prop, from, to, head };
}
/** a vignette as separate cut-outs: frame+scene (base) and the moving prop; set(x, y, s, k, o) with k the act 0→1 */
export function vignette(S, L, kind, done = true, opts = {}) {
  const c = S.c;
  const V = mercyVig(c, kind, done, opts);
  const base = L.add(`<g>${V.base}</g>`);
  const prop = V.prop ? L.add(`<g>${V.prop}</g>`) : null;
  const glowEl = L.add(`<g><circle r="46" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 14, 16), 0.3, 3)}" fill="none" stroke="${C.haloRim}" stroke-width="2.4"/></g>`);
  return {
    kind, V, base, prop, glowEl,
    set(x, y, s, k = 1, o = 1, lit = 0) {
      pose(base, { x, y, s, o });
      if (prop) {
        if (kind === 'stranger') pose(prop, { x: x + V.from[0] * s, y: y + V.from[1] * s, s, sx: 1 - (done ? k : 0) * 0.8, o });
        else { const px = lerp(V.from[0], V.to[0], k), py = lerp(V.from[1], V.to[1], k) - Math.sin(k * PI) * 20; pose(prop, { x: x + px * s, y: y + py * s, s, o: o * (done ? 1 : 0) }); }
      }
      pose(glowEl, { x: x + V.head[0] * s, y: y + V.head[1] * s, s: s * (0.6 + lit * 0.6), o: o * lit });
    },
  };
}

/**
 * The stage of the Judgement: a gold heaven (a dusk sky first, faded out with dusk.layer.fade), slow rays of glory, the
 * floor of cloud, the throne of light (throneEl), the King seated (kingSit) and standing (kingStand), two choirs of
 * angels as sprites, the nations (left / right sprites), the flock (sheep and goats, each its own cut-out).
 */
export const JG = { TX: 800, TY: 400, CLOUD: 470, LX: 560, RX: 1040, NY: 640, FY: 694 };
export function judgementSet(S, { dusk = false, flock = true, nations = true, angels = true, behind = null } = {}) {
  const c = S.c;
  sky(S, HEAVEN);
  const duskSky = dusk ? sky(S, TWILIGHT, { name: 'dusk', rise: 0 }) : null;
  const raysL = S.layer({ par: 0.05, sh: 1, flat: true, rise: 0 });
  const rays = raysL.add(`<g><circle r="520" fill="url(#halo-glow)" opacity=".85"/>${raysMarkup(c, 30, 1300)}</g>`);
  // banks of cloud: far, the floor under the throne, and the plain where the nations stand
  const farCl = S.layer({ par: 0.1, sh: 2 });
  farCl.add(`<g transform="translate(800 520)">${cloudBank(c, 3400, mix(C.cream, C.halo, 0.4), '#efdcb6')}</g>`);
  const plain = S.layer({ par: 0.25, sh: 3 });
  plain.add(sheet().p(c.ridge(c.wave(590, [8, 3], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.halo, 0.35)).out());
  plain.add(`<g transform="translate(800 600)">${cloudBank(c, 3400, mix(C.cream, C.halo, 0.25), '#eadcc0', 0.7)}</g>`);
  const back = behind ? behind(S) : null;
  // the throne on its cloud
  const thL = S.layer({ par: 0.3, sh: 4 });
  const angelsL = S.layer({ par: 0.29, sh: 4 });
  const choir = (side) => {
    const cc = makeCutter('mt25-choir' + side);
    const mem = [0, 1, 2].map((i) => ({ o: { hairStyle: 'long' }, x: side * (i * 58 + (i % 2) * 6), y: -i * 26 + (i % 2) * 14, s: 0.62 - i * 0.04, flip: side > 0, armF: 40 + i * 10, armB: 20 }));
    return mem.sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x} ${m.y}) scale(${m.flip ? -m.s : m.s} ${m.s})">${angel8(cc).replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-m.armF})">`)}</g>`).join('');
  };
  const angL = angels ? angelsL.sprite(choir(-1), JG.TX - 170, JG.CLOUD - 30) : null;
  const angR = angels ? angelsL.sprite(choir(1), JG.TX + 170, JG.CLOUD - 30) : null;
  const throneEl = thL.add(`<g><g transform="scale(.82)">${throneOfLightNoGlow(c)}</g></g>`);
  const cloudFront = S.layer({ par: 0.3, sh: 3 });
  const cf = cloudFront.add(`<g>${puffCloud(c, 420)}</g>`);
  const kingL = S.layer({ par: 0.3, sh: 5 });
  const kingSit = S.puppet(kingL.add(kingMarkup(c, { pose: 'sit' })));
  const kingStand = S.puppet(kingL.add(kingMarkup(c)));
  // a warm blessing glow behind those on the King's right (faded by the scenes)
  // on a phone the two peoples and the two flocks stand closer in, so neither is sliced by the screen's edge
  const LX = S.portrait ? 580 : JG.LX, RX = S.portrait ? 1020 : JG.RX, SX = S.portrait ? 510 : 470, GX = S.portrait ? 890 : 930;
  const warmL = S.layer({ par: 0.4, sh: 0, flat: true });
  warmL.add(`<g transform="translate(${LX} ${JG.NY - 60})"><circle r="260" fill="url(#halo-glow)" opacity=".9"/></g>`);
  warmL.fade(0);
  // the nations
  const natL = S.layer({ par: 0.4, sh: 4 });
  const natBack = (side) => nations12('mt25-nb' + side, 9, { s: 0.5, spread: 36, flip: side > 0, armF: [10, 40], armB: [0, 20] });
  const natFront = (side) => nations12('mt25-nf' + side, 7, { s: 0.6, spread: 44, flip: side > 0, armF: [10, 50], armB: [0, 20] });
  const NL = nations ? { back: natL.sprite(natBack(-1), LX, JG.NY - 30), front: natL.sprite(natFront(-1), LX, JG.NY + 10) } : null;
  const NR = nations ? { back: natL.sprite(natBack(1), RX, JG.NY - 30), front: natL.sprite(natFront(1), RX, JG.NY + 10) } : null;
  // the flock
  const flockL = S.layer({ par: 0.45, sh: 4 });
  const sheepEls = flock ? WOOLS.map((w, i) => ({ i, el: flockL.add(`<g>${ewe10(c, { wool: w })}</g>`) })) : [];
  const goatEls = flock ? GOATS.map((col, i) => ({ i, el: flockL.add(`<g>${goat(c, { coat: col })}</g>`) })) : [];
  return {
    c, LX, RX, SX, GX, duskSky, raysL, rays, back, warmL, thL, throneEl, cloudFront, cf, kingL, kingSit, kingStand, angelsL, angL, angR, natL, NL, NR, flockL, sheepEls, goatEls,
    /** the throne and its cloud at (x, y) (seat centre) */
    throne(x = JG.TX, y = JG.TY, o = 1) { pose(throneEl, { x, y, o }); pose(cf, { x, y: y + 72, o }); },
    glory(time, o = 1, x = JG.TX, y = JG.TY - 120) { pose(rays, { x, y, r: time * 1.2, s: 1, o }); },
  };
}
/** long soft rays of glory (origin centre) */
function raysMarkup(c, n = 30, r1 = 1300) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.03, 0.03), w = 0.035 * c.rr(0.7, 1.3), rr = r1 * c.rr(0.75, 1);
    d += c.poly([[Math.cos(a - w * 0.3) * 60, Math.sin(a - w * 0.3) * 60], [Math.cos(a - w) * rr, Math.sin(a - w) * rr], [Math.cos(a + w) * rr, Math.sin(a + w) * rr], [Math.cos(a + w * 0.3) * 60, Math.sin(a + w * 0.3) * 60]]);
  }
  return `<path d="${d}" fill="#fff3cf" opacity=".6"/>`;
}
/** the throne of glory without its own great glow (the scene has its rays) — John 12's throne of light */
function throneOfLightNoGlow(c) {
  const s = sheet();
  s.p(c.cut([[-58, 0], [-58, -110], ...c.arc(0, -110, 58, 58, PI, 2 * PI, 14), [58, -110], [58, 0]], 0.5, 6), mix(C.halo, C.haloRim, 0.35));
  s.p(c.cut([[-40, -6], [-40, -104], ...c.arc(0, -104, 40, 40, PI, 2 * PI, 12), [40, -104], [40, -6]], 0.4, 6), C.halo);
  s.p(c.cut([[-84, -40], [-58, -40], [-58, 0], [-84, 0]], 0.3, 4) + c.cut([[58, -40], [84, -40], [84, 0], [58, 0]], 0.3, 4), C.haloRim);
  s.p(c.cut([[-76, -4], [76, -4], [76, 14], [-76, 14]], 0.4, 6), mix(C.halo, C.haloRim, 0.5));
  s.p(c.cut([[-96, 14], [96, 14], [104, 30], [-104, 30]], 0.4, 6) + c.cut([[-116, 30], [116, 30], [124, 46], [-124, 46]], 0.4, 6), mix(C.halo, C.star, 0.3));
  s.x(c.poly(c.star(0, -140, 16, 6, 6, 0)), C.star);
  return `<circle cy="-60" r="200" fill="url(#halo-glow)" opacity=".7"/>${s.out()}`;
}
/** a long bank of cloud (origin: top centre) */
export function cloudBank(c, w = 1600, col = C.cream, under = '#eadcc0', k = 1) {
  const s = sheet();
  const pts = [[-w / 2, 40]];
  for (let x = -w / 2; x <= w / 2; x += 80) pts.push(...c.arc(x + 40, 16, 48, (26 + c.rr(-6, 10)) * k, PI, 2 * PI, 6));
  pts.push([w / 2, 40], [w / 2, 110], [-w / 2, 110]);
  s.p(c.cut([[-w / 2, 44], [w / 2, 44], [w / 2, 116], [-w / 2, 116]], 0.8, 20), under);
  s.p(c.cut(pts, 0.8, 8), col);
  return s.out();
}
/** a soft veil of shadow over one side (the left of the King) — a flat sheet faded by the scene; origin world */
export function shadeSheet(c, cx = 1040, cy = 610, { col = '#2a2748', rx = 340, ry = 170 } = {}) {
  let out = '';
  for (let i = 0; i < 7; i++) { const k = 1 - i * 0.12; out += `<ellipse cx="${cx}" cy="${cy}" rx="${(rx * k).toFixed(0)}" ry="${(ry * k).toFixed(0)}" fill="${col}" opacity=".32"/>`; }
  return out;
}
/** the pit prepared for the devil and his angels: a dark rift with a low ember glow (origin: centre of its lip) */
export function rift(c, w = 360) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.34, 18], [-w * 0.16, 30], [0, 34], [w * 0.18, 28], [w * 0.36, 16], [w / 2, 0], [w * 0.36, -8], [0, -12], [-w * 0.36, -8]], 1.2, 7), '#241c2c');
  s.x(c.cut(c.ell(0, 12, w * 0.3, 10, 16), 0.8, 6), C.sunRay, 'opacity=".45"');
  return `<ellipse cx="0" cy="8" rx="${w * 0.62}" ry="70" fill="url(#warm-glow)" opacity=".35"/>${s.out()}`;
}
/** a fallen angel as a dark silhouette with ragged wings (origin: feet) */
export function fallenShadow(c) {
  const col = '#2c2436';
  const s = sheet();
  const wing = (dir) => c.cut([[0, -120], [dir * 30, -150], [dir * 70, -170], [dir * 96, -150], [dir * 80, -132], [dir * 100, -118], [dir * 70, -110], [dir * 84, -92], [dir * 40, -96]], 1.6, 5);
  s.p(wing(-1) + wing(1), col);
  s.p(c.cut([[-20, 0], [-16, -110], [-10, -130], [10, -130], [16, -110], [20, 0]], 0.8, 6), col);
  s.p(c.cut(c.circ(0, -146, 15, 14), 0.5, 4), col);
  return s.out();
}

/* ================================================================== small things */
/** a round plate on its string (origin: plate centre): icon inside, rim */
export function plateOn(c, inner, { r = 50, rim = C.haloRim, face = C.cream } = {}) {
  return `<path d="M0 ${-r}V-1600" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${sheet().p(c.cut(c.circ(0, 0, r + 6, 32), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 32), 0.5, 5), face).out()}${inner}`;
}
/** a word hanging on its string (origin: the word's centre) */
export function wordOn(c, text, { size = 22, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.3, hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `<path d="M0 ${-hh / 2}V-1600" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** an oil jar icon, full (golden oil at its mouth) or empty (origin: base) */
export function oilJar(c, full = true, h = 40) {
  const s = sheet();
  s.p(c.cut([[-h * 0.24, 0], [-h * 0.36, -h * 0.4], [-h * 0.26, -h * 0.8], [-h * 0.12, -h * 0.86], [-h * 0.14, -h], [h * 0.14, -h], [h * 0.12, -h * 0.86], [h * 0.26, -h * 0.8], [h * 0.36, -h * 0.4], [h * 0.24, 0]], 0.4, 4), C.cream);
  s.x(c.ribbon([[-h * 0.32, -h * 0.5], [h * 0.32, -h * 0.5]], 2), C.ochre, 'opacity=".7"');
  if (full) s.p(c.cut(c.ell(0, -h, h * 0.13, h * 0.05, 8), 0.1, 2), C.sun);
  return s.out() + (full ? `<path d="${c.cut([[0, -h * 1.5], [h * 0.12, -h * 1.22], [0, -h * 1.1], [-h * 0.12, -h * 1.22]], 0.1, 2)}" fill="${C.sun}"/>` : '');
}
/** the joy of the master: a golden ring of light with little stars (origin centre) */
export function joyStars(c, r = 60) {
  let d = '';
  for (let i = 0; i < 8; i++) { const a = (i / 8) * PI * 2; d += c.poly(c.star(Math.cos(a) * r, Math.sin(a) * r * 0.6, 6, 2, 4, 0)); }
  return `<path d="${d}" fill="${C.star}"/>`;
}
/** a sickle (held) */
export function sickle(c) {
  return sheet().p(c.ribbon([[0, 10], [0, -20]], 4), C.wood2).p(c.ribbon(c.arc(14, -20, 14, 16, PI, 2 * PI + 0.6, 10), 3.4), C.stone2).out();
}
/** a sheaf of wheat standing (origin: foot) */
export function sheaf(c, h = 70) {
  const s = sheet();
  let st = '', ears = '';
  for (let i = -3; i <= 3; i++) { st += c.ribbon([[i * 2, 0], [i * 5, -h * 0.8]], 2); ears += c.cut(c.ell(i * 5.6, -h * 0.86, 3.4, 9, 8, i * 0.12), 0.2, 3); }
  s.p(st, C.wheat2).p(ears, C.wheat).p(c.ribbon([[-8, -h * 0.4], [8, -h * 0.4]], 3), C.rope);
  return s.out();
}
/** a hard man's great shadow: a grey silhouette of the master, larger than life (origin: feet) */
export function hardShadow(c, o = MASTER) {
  const col = mix(C.storm2, C.plumRobe, 0.2);
  const s = { ...o, robe: col, mantle: shade(col, 0.06), skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: shade(col, 0.1), halo: false, holdF: `<g transform="rotate(20)">${sickle(c).replace(/fill="[^"]+"/g, `fill="${shade(col, -0.2)}"`)}</g>`, holdB: '' };
  return person(c, s).split(`fill="${C.blush}"`).join(`fill="${col}"`).split(`fill="${C.inkSoft}"`).join(`fill="${shade(col, -0.15)}"`);
}

/* ================================================================== the reckoning in the courtyard */
export const RK = { TABLE: 820, TOP: ES.G - 50, MS: 716, S: [930, 1010, 1080], DOOR5: 500, DOOR2: 546 };
/** where the talents lie on the table: S5's pile, S2's pile, the third's */
export const TSPOT = { 5: 772, 2: 846, 1: 902 };
/**
 * The master's table and the people of the reckoning in layer L: the master seated and standing, the three
 * servants (the third also kneeling), their talents (10, 4, and the one — dull — with its bundle).
 */
export function court(S, L) {
  const c = S.c;
  const masterSit = S.puppet(L.add(person(c, { ...MASTER, pose: 'sit' })));
  const masterStand = S.puppet(L.add(person(c, MASTER)));
  L.add(`<g transform="translate(${RK.TABLE} ${ES.G + 2})">${lowTable2(c, 210, 50)}</g><g transform="translate(${RK.TABLE - 70} ${RK.TOP})">${ledgerM(c)}</g>`);
  const s5 = S.puppet(L.add(person(c, SERV5)));
  const s2 = S.puppet(L.add(person(c, SERV2)));
  const s1 = S.puppet(L.add(person(c, SERV1)));
  const s1k = S.puppet(L.add(person(c, { ...SERV1, pose: 'kneel' })));
  const g5 = Array.from({ length: 11 }, () => L.add(`<g>${talent(c)}</g>`));
  const g2 = Array.from({ length: 4 }, () => L.add(`<g>${talent(c)}</g>`));
  const dull = L.add(`<g>${dirtyTalent(c)}</g>`);
  const pack = L.add(`<g>${bundle(c)}</g>`);
  return { masterSit, masterStand, s5, s2, s1, s1k, g5, g2, dull, pack };
}
function ledgerM(c) {
  return sheet().p(c.cut([[-26, 0], [26, 0], [22, -12], [-22, -12]], 0.3, 4), C.parchment).x(c.ribbon([[-16, -6], [14, -6]], 1.2), C.ink, 'opacity=".5"').out();
}
/** where talent i of a pile of n lies on the table, at who's place */
export const tablePos = (who, n, i) => tableSpot(TSPOT[who], RK.TOP, n, i, 0.72);
/** place a pile of talents on the table (n in the pile, i-th element) */
export function onTable(el, who, n, i, o = 1) {
  const [x, y] = tableSpot(TSPOT[who], RK.TOP, n, i, 0.72);
  pose(el, { x, y, s: 0.72, o });
  return [x, y];
}

/** the six sheep and six goats: mixed together in front of the throne (k = 0), or parted (k = 1) */
export function flockAt(J, k, time = 0, { x0 = 650, sheepX = J.SX ?? 470, goatX = J.GX ?? 930, y = JG.FY, goatO = 1 } = {}) {
  const hopT = (i) => (k > 0 && k < 1 ? Math.abs(Math.sin(k * PI * 5 + i)) * 6 : 0);
  J.sheepEls.forEach((m) => {
    const i = m.i, mx = x0 + i * 56 + 4, px = sheepX + i * 44;
    const x = lerp(mx, px, k);
    pose(m.el, { x, y: y + (i % 2) * 6 - hopT(i), s: 0.82, sx: k > 0.02 && k < 0.98 ? -1 : 1 });
  });
  J.goatEls.forEach((m) => {
    const i = m.i, mx = x0 + i * 56 + 32, px = goatX + i * 44;
    const x = lerp(mx, px, k);
    pose(m.el, { x, y: y + ((i + 1) % 2) * 6 - hopT(i + 3), s: 0.82, sx: k > 0.98 ? -1 : 1, o: goatO });
  });
}
/** everything in its place at the Judgement (the King seated or standing) */
export function judgeRest(J, T, { sit = 1, flip = false, armF = 30, armB = 10, head = 0, x = JG.TX, glowO = 1, nat = 1, natSpread = 1, leftNat = true, rightNat = true } = {}) {
  J.throne(JG.TX, JG.TY, 1);
  J.glory(T, glowO);
  J.kingSit.set({ x: x - 6, y: JG.TY + 20, s: 0.9, flip, o: sit, armF, armB, head, blink: blinkAt(T, 1) });
  J.kingStand.set({ x, y: JG.TY + 72, s: 0.94, flip, o: 1 - sit, armF, armB, head, blink: blinkAt(T, 1) });
  if (J.angL) { J.angL.set({ x: JG.TX - 170, y: JG.CLOUD - 30 }); J.angR.set({ x: JG.TX + 170, y: JG.CLOUD - 30 }); }
  if (J.NL) {
    const lx = lerp(700, J.LX ?? JG.LX, natSpread), rx = lerp(900, J.RX ?? JG.RX, natSpread);
    if (leftNat) { J.NL.back.set({ x: lx, y: JG.NY - 30, o: nat }); J.NL.front.set({ x: lx, y: JG.NY + 10, o: nat }); }
    if (rightNat) { J.NR.back.set({ x: rx, y: JG.NY - 30, o: nat }); J.NR.front.set({ x: rx, y: JG.NY + 10, o: nat }); }
  }
}

/** the gate of the Kingdom: a golden arch with light in it, rising out of the clouds (layer L); returns handles */
export function kingdomGateSet(S, L, { x = 470, y = 560, sc = 1.5 } = {}) {
  const c = S.c;
  const g = kGate12(c, 150, 220);
  const glow = L.add(`<g><circle r="260" fill="url(#halo-glow)"/></g>`);
  const light = L.add(`<g>${g.light}</g>`);
  const frame = L.add(`<g>${g.frame}</g>`);
  return {
    set(k, open = 0) {
      const yy = y + (1 - k) * 420;
      pose(glow, { x, y: yy - 150 * sc, s: sc * (0.6 + open * 0.8), o: k * (0.5 + open * 0.5) });
      pose(light, { x, y: yy, s: sc, o: k * (0.5 + open * 0.5) });
      pose(frame, { x, y: yy, s: sc, o: k > 0.01 ? 1 : 0 });
    },
  };
}

/** a soft cloud to stand the throne on (origin: top centre) */
export function puffCloud(c, w = 420, col = C.cream, under = '#eadcc0') {
  const s = sheet();
  const pts = [];
  const n = 7;
  for (let i = 0; i < n; i++) { const x = -w / 2 + (w * (i + 0.5)) / n, r = (w / n) * (i === 0 || i === n - 1 ? 0.7 : 0.95); pts.push(...c.arc(x, 20, r, r * 0.8, PI, 2 * PI, 6)); }
  pts.push(...c.arc(0, 30, w / 2, 40, 0, PI, 16));
  s.p(c.cut(c.arc(0, 42, w / 2 - 10, 40, 0, PI, 16).concat([[-w / 2 + 10, 30], [w / 2 - 10, 30]]), 0.6, 8), under);
  s.p(c.cut(pts, 0.8, 7), col);
  return s.out();
}

/** the shade over those on the King's left: a soft (compositor-blurred) sheet, faded by the scene */
export function shadeLayer(S) {
  const L = S.layer({ par: 0.4, sh: 0, flat: true, blur: 34 });
  L.add(shadeSheet(S.c, S.portrait ? 1020 : 1040));
  return L;
}
