// Luke 18 — the cast and cut-outs of this chapter. The last stretch of the journey: down the Jordan valley towards
// Jericho, the city of palms, and from there up to Jerusalem. New here: the wayside under a great terebinth in the
// valley where Jesus teaches (the Moab mountains across the river, palm groves along the Jordan, Jericho far off);
// the little town of the parable with its gate and the unjust judge on his seat under the awning, and the widow who
// keeps coming; the Pharisee and the tax collector in the Temple court (Luke 2's court, where Simeon and Anna met the
// Child); the approach to Jericho where the blind man sits by the road.
// Borrowed so the same people look the same: the rich man and his goods, the children, the needle and the camel,
// Bartimaeus (here unnamed, as Luke tells it) and his bowl are Mark 10's; the road up to Jerusalem is Luke 9's;
// the judge's seat is Matthew 5's; the tax collector is Luke 7's; the Pharisee is Mark 3's.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, palm, olive, bush, rock, grass, flowers, sun, cloud, house, town, moon, stars } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { voiceRings } from '../mark1/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { crowdKnot, fig13 as fig13L } from '../luke13/lib.js';
import { TWELVE as T12 } from '../mark3/lib.js';
import { shadeTree, jericho as jericho10 } from '../mark10/lib.js';
import { judgeSeat } from '../matthew5/lib.js';

export { tr, es, ease, bump, seg, fade };
export { kf, moving, hand, thought, speech, GLYPH, coin, coinStack, loaf, bowl, addToHead, addToBody, wordSlip, scrollOpen, scrollRolled } from '../mark2/lib.js';
export { voiceRings, sparkle, camel, walkCamel, hang2 } from '../mark1/lib.js';
export { question, bubble, strip, nameTag, withFace, faceBits, headAt, handAt, shadowPerson, silhouette, heart, stoneHeart, pharisee as phariseeLook } from '../mark3/lib.js';
export { LOOK as L10, child, shadeTree, say, bang, qmark, slip, jericho, beggarBowl, cloakSpread, bigNeedle, treasureStar, cart, sack, frown, face, lawTablets, ring, whip, thornCrown, helmet, spark } from '../mark10/lib.js';
export { globe, phylactery, balance, glory } from '../mark8/lib.js';
export { crossX, tick, disc } from '../mark6/lib.js';
export { eternityRing, drawRing, baby } from '../john1/lib.js';
export { soldierSil } from '../mark15/lib.js';
export { hillCross, spear, reed, INK } from '../matthew20/lib.js';
export { roadSet as roadSet9, ROAD9, ROAD_NEAR, ROAD_FAR, TW9 } from '../luke9/lib.js';
export { flat, flatSky, fig, flyTo, dropK, flatHills, flatText } from '../luke1/lib.js';
export { figure, bake, manO, womanO, village } from '../luke4/lib.js';
export { templeSet, TFLOOR, inArms } from '../luke2/lib.js';
export { sinSack, lightDisc } from '../luke3/lib.js';
export { TAXMAN } from '../luke7/lib.js';
export { kingdomDisc } from '../luke8/lib.js';
export { crowdKnot };
export { knot, knotUp, fig13, wordTag, numDisc, onString, handF } from '../luke13/lib.js';
export { trumpetChest, littleHouse, purse } from '../mark12/lib.js';
export { judgeSeat, pose3 };
export { rays } from '../../assets/things.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== skies */
export const VALLEY = ['#c9dcd6', '#efe7cf', '#f8e8cc'];        // the Jordan valley by day (warm, hazy)
export const VALLEY_GOLD = ['#d9c6a8', '#f2d4a2', '#f7e2bd'];
export const VALLEY_EVE = ['#9d8fb6', '#e8ad90', '#f4d1a4'];
export const TOWN_DAY = ['#c3dbd8', '#ede8d0', '#f7e8c9'];
export const TOWN_NIGHT = ['#1c2350', '#343c76', '#6a6892'];
export const JERICHO_SKY = ['#bdd7d6', '#eee6cb', '#f7e3c1'];

/* ================================================================== the cast */
/** the judge of the parable: a heavy plum robe, an ochre mantle, a white turban with a red band, a grey beard */
export const JUDGE = { robe: mix(C.plumRobe, C.indigo, 0.3), mantle: C.ochre, mantleArm: true, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin3, belt: C.sun };
/** the widow: a faded blue-grey robe, a dark veil */
export const WIDOW = { robe: mix(C.dustyBlue, C.stone2, 0.45), mantle: null, hairStyle: 'veil', veil: mix(C.storm, C.plumRobe, 0.3), veil2: shade(mix(C.storm, C.plumRobe, 0.3), -0.15), hair: C.greyHair, skin: C.skin2, belt: C.rope };
/** her adversary: a comfortable man in ochre and clay with a gold belt */
export const ADVERSARY = { robe: C.ochreRobe, mantle: C.clayMantle, hairStyle: 'short', hair: C.hair3, beard: 'short', beardColor: C.hair3, skin: C.skin4, belt: C.sun };
/** a poor petitioner the judge sends away */
export const PETITIONER = { robe: mix(C.stone2, C.sand2, 0.35), hairStyle: 'wrap', veil: C.stone, veil2: shade(C.stone, -0.12), hair: C.hair2, beard: 'short', skin: C.skin3, belt: C.rope };
/** the Pharisee of the parable (Mark 3's Pharisee: white shawl with a blue band, cream robes) */
export const PHARISEE = { robe: C.linen, mantle: C.dustyBlue, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.indigo, beard: 'full', beardColor: C.greyHair, belt: C.sun };
/** those "who trusted in themselves" (8,9): three fine gentlemen */
export const PROUD = [
  { robe: C.linen2, mantle: C.tealRobe, skin: C.skin, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.tealRobe, beard: 'full', beardColor: C.hair3, belt: C.ochre },
  { robe: C.stone, mantle: C.plumRobe, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.plumRobe, beard: 'wild', beardColor: C.greyHair, belt: C.leather },
  { robe: C.wheatRobe, mantle: C.dustyBlue, skin: C.skin3, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, veil2: C.indigo, beard: 'full', beardColor: C.hair, belt: C.sun },
];
/** the people they look down on */
export const LOWLY = [
  { robe: mix(C.stone2, C.sand2, 0.35), hairStyle: 'wrap', veil: C.stone, hair: C.hair2, beard: 'short', skin: C.skin4, belt: C.rope },
  { robe: mix(C.roseRobe, C.stone2, 0.4), hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair3, beard: 'none', skin: C.skin3 },
];
/** mothers and fathers who bring their babies */
export const PARENTS = [
  { robe: C.lavender, hairStyle: 'veil', veil: C.cream, veil2: shade(C.cream, -0.1), hair: C.hair2, beard: 'none', skin: C.skin, belt: C.ochre },
  { robe: C.skyVeil, mantle: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, beard: 'none', skin: C.skin3 },
  { robe: C.ochreRobe, mantle: C.sageRobe, hairStyle: 'short', hair: C.hair, beard: 'full', skin: C.skin2, belt: C.leather },
  { robe: C.tealRobe, hairStyle: 'veil', veil: C.wheatRobe, veil2: shade(C.wheatRobe, -0.12), hair: C.hair, beard: 'none', skin: C.skin2, belt: C.clay },
];
/** the disciples, as Luke lists them (Luke 6's Twelve); by key */
export const DIS = Object.fromEntries(T12.map((m) => [m.k, m.o]));
export const JESUS = CAST.jesus;

/* ================================================================== small helpers */
export const halo = (r = 120, o = 1) => `<circle r="${r}" fill="url(#halo-glow)" opacity="${o}"/>`;
export const warm = (r = 120, o = 1) => `<circle r="${r}" fill="url(#warm-glow)" opacity="${o}"/>`;
/** a still group of baked people: members [{ x, y, s, flip, o, armF, armB, head }] */
export const still = (c, members) => pose3(c, members);
/** the disciples as one still group (keys from DIS), standing in a loose row; origin: the middle of the row */
export function disciples(c, keys, { s = 0.86, spread = 50, flip = false, rows = 2, arms = null, heads = null } = {}) {
  const per = Math.ceil(keys.length / rows);
  return still(c, keys.map((k, i) => {
    const r = Math.floor(i / per), j = i % per;
    return { x: (j - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-4, 4), y: r * 16, s: s * (1 - r * 0.04), flip, o: DIS[k], armF: arms ? arms[i % arms.length] : c.rr(0, 20), armB: c.rr(0, 10), head: heads ? heads[i % heads.length] : c.rr(-5, 4) };
  }));
}
/** a round hanging plate on a string with a picture (origin: its centre) */
export function plate(c, inner, { r = 56, face = C.parchment, rim = C.haloRim, frame = mix(C.wood3, C.ochre, 0.4), len = 1600 } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 8, 36), 0.5, 5), frame).p(c.cut(c.circ(0, 0, r + 3, 36), 0.4, 5), rim).p(c.cut(c.circ(0, 0, r, 36), 0.4, 5), face);
  return `<path d="M0 ${-len}V${-r - 8}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}${inner}`;
}
/** a small card on a string with an icon and a word underneath (origin: centre of the card) */
export function iconCard(c, inner, word, { w = 96, h = 108, face = C.parchment, rim = C.cream, size = 15, len = 1600 } = {}) {
  const s = sheet().p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 1.5], [w / 2 + 1.5, h / 2], [-w / 2 - 1, h / 2 + 1]], 0.5, 6), rim).p(c.cut(c.rect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 32), 0.3, 6), face);
  const txt = word ? `<text x="0" y="${(h / 2 - 9).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${word}</text>` : '';
  return `<path d="M0 ${-len}V${-h / 2}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(0 ${(-13).toFixed(1)})">${inner}</g>${txt}`;
}
/** a thought/speech bubble with a jagged or smooth outline and centred lines, origin at the tail tip (side ±1) */
export function words(c, lines, { size = 19, side = 1, fill = C.cream, ink = C.ink, w, bold = false } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.6;
  const hh = lines.length * size * 1.15 + size * 0.9;
  const cx = side * (ww / 2 - 18), cy = -hh / 2 - 24;
  const s = sheet();
  s.p(c.cut(c.blob(cx, cy, ww / 2, hh / 2, 18, 0.04), 0.6, 6), fill);
  s.p(c.cut([[side * 8, -hh * 0.2 - 18], [0, 0], [side * 26, -hh * 0.2 - 16]], 0.3, 4), fill);
  const t0 = cy - ((lines.length - 1) * size * 1.15) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="${cx.toFixed(1)}" y="${(t0 + i * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic"${bold ? ' font-weight="600"' : ''} fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}

/* ================================================================== the wayside in the Jordan valley */
/** where Jesus stands and the flats hang */
export const WY = { GY: 716, JX: 800, FX: 800, FY: 280 };
export const flatY = (k) => lerp(-1500, WY.FY, k);
/**
 * The wayside down in the Jordan valley: the flat-topped mountains of Moab across the river, the green strip of the
 * Jordan's thickets and its palm groves, Jericho far off at the right among its palms, a warm slope with the road
 * winding down from the right, a great terebinth at the left giving shade. Layers for flats (FL, bits), a sheet
 * behind the people (behind: glows), sprites of people (crowdL), the actors (act) with Jesus, and fx in front.
 * groups: [{ k, x, y, n, flip, pose, s, seed }] knots of people as sprites. dis: a still group of disciples
 * { keys, x, y, s, flip } as a sprite. Always cut the same. Returns handles and update(time).
 */
export function waySet(S, { skyCols = VALLEY, sky2 = null, sky3 = null, groups = [], dis = null, jesus = true, sunAt = [1250, 140], FLpar = 0.3 } = {}) {
  const c = makeCutter('lk18-way');
  sky(S, skyCols);
  let sk2 = null, sk3 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  if (sky3) { sk3 = sky(S, sky3, { name: 'sky3', rise: 0 }).layer; sk3.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[420, 150, 180], [1000, 100, 130]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  // the mountains of Moab: long and flat-topped, violet with distance
  const far = S.layer({ par: 0.07, sh: 2 });
  const mfn = (x) => 404 + Math.sin(x * 0.004 + 1.2) * 6 + Math.sin(x * 0.013) * 3 + Math.max(0, 300 - Math.abs(x - 420)) * -0.06;
  far.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 14, 1.2), mix(C.hillFar, C.duskViolet, 0.28)).out());
  // the valley floor: the Jordan's green thickets, its palm groves, Jericho far off at the right
  const valley = S.layer({ par: 0.14, sh: 3 });
  const vfn = c.wave(476, [6, 3], [900, 260]);
  const vs = sheet();
  vs.p(c.ridge(vfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillMid, 0.45));
  let thick = '';
  for (let x = -900; x < 2500; x += 26) thick += c.cut(c.blob(x, vfn(x) + 4, c.rr(16, 26), c.rr(7, 11), 9, 0.25), 0.5, 4);
  vs.p(thick, mix(C.moss, C.sage, 0.35));
  valley.add(vs.out());
  let palms = '';
  [[-200, 0.5], [120, 0.42], [180, 0.36], [560, 0.4], [1180, 0.46], [1240, 0.38], [1520, 0.44], [1580, 0.36], [1900, 0.4]].forEach(([x, s]) => { palms += palm(c, x, vfn(x) + 8, 150 * s, { frond: C.olive, frond2: C.sage }); });
  valley.add(palms);
  valley.add(`<g transform="translate(1370 ${vfn(1370) + 8})">${jericho10(c, 0.42)}</g>`);
  // the warm slope and the road winding down from the right
  const slope = S.layer({ par: 0.3, sh: 3 });
  const sfn = c.wave(566, [8, 4], [800, 230]);
  const sl = sheet();
  sl.p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.4));
  sl.p(c.ribbon([[2500, 566], [1760, 574], [1420, 600], [1200, 640], [1080, 690], [1030, 760]], (u) => 22 + u * 44, 1.5), mix(C.sand, C.cream, 0.3));
  slope.add(sl.out());
  slope.add(palm(c, 1470, sfn(1470) + 20, 190) + palm(c, 1540, sfn(1540) + 26, 150) + bush(c, 620, sfn(620) + 8, 60, C.sage2, C.sage) + rock(c, 1260, sfn(1260) + 30, 60, 26, C.rock) + grass(c, { x0: -800, x1: 2400, y: 566, fn: sfn, n: 56, h: 12, color: C.olive }));
  // the great terebinth at the left
  const treeL = S.layer({ par: 0.4, sh: 4 });
  treeL.add(shadeTree(c, 220, 680, 1.5, { leaf: C.moss, leaf2: C.leaf, leaf3: C.sage }) + bush(c, 380, 690, 80, C.sage, C.moss));
  const G = S.layer({ par: 0.5, sh: 3 });
  const gfn = c.wave(WY.GY - 30, [5, 2], [700, 200]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.3)).out() + grass(c, { x0: -800, x1: 2400, y: WY.GY - 30, fn: gfn, n: 44, h: 13, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: WY.GY - 26, fn: gfn, n: 12 }));
  const FL = S.layer({ par: FLpar, sh: 6 });
  const bits = S.layer({ par: FLpar, sh: 5 });
  const behind = S.layer({ par: 0.5, sh: 0, flat: true });
  const crowdL = S.layer({ par: 0.5, sh: 4 });
  const G2 = groups.map((g, i) => {
    const o = { s: g.s ?? 0.88, spread: g.spread ?? 46, rows: g.rows ?? (g.pose === 'sit' ? 1 : 2), flip: !!g.flip, pose: g.pose || 'stand', women: g.women ?? null };
    const K = (g.members ? { m: still(c, g.members) } : null) || (typeof g.markup === 'string' ? { m: g.markup } : null) || crowdKnot(g.seed || 'lk18-w-' + (g.k || i), g.n || 5, o);
    return { ...g, i, sp: crowdL.sprite(K.m, g.x, g.y) };
  });
  let disSp = null;
  if (dis) disSp = crowdL.sprite(disciples(c, dis.keys, { s: dis.s ?? 0.86, spread: dis.spread ?? 50, flip: !!dis.flip, rows: dis.rows ?? 2 }), dis.x, dis.y);
  const act = S.layer({ par: 0.5, sh: 5 });
  const J = jesus ? S.puppet(act.add(person(c, { ...CAST.jesus }))) : null;
  const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 34, w: 5 });
  const fx = S.layer({ par: 0.52, sh: 6 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  const bank = c.wave(935, [10, 4], [520, 170]);
  fg.add(sheet().p(c.ridge(bank, -1200, 2800, 1800, 14, 1.2), mix(C.sage, C.olive, 0.25)).out() + grass(c, { x0: -1200, x1: 2800, y: 935, fn: bank, n: 60, h: 24, color: C.moss }) + flowers(c, { x0: -1200, x1: 2800, y: 935, fn: bank, n: 18, h: 28 }));
  return {
    c, sk2, sk3, hangL, sunEl, far, valley, slope, treeL, G, FL, bits, behind, crowdL, groups: G2, disSp, act, jesus: J, voice, fx, fg, gfn,
    update(T, { sunY = 0 } = {}) {
      swing(sunEl, sunAt[0], sunAt[1] + sunY, T, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));
    },
  };
}
/* ================================================================== the town of the parable: the judge at the gate */
export const GT = { GY: 704, SEAT: 1000, GATE: 420, WALL: 560 };
/**
 * A small hill town's square just inside its gate: the town climbing behind, a synagogue roof with a lamp of prayer,
 * the gate in the wall at the left (the widow comes through it), the judge's seat under its red awning at the right,
 * a paved square. sky2: night (for the days that pass). Returns { sk2, starL, sunEl, moonEl, wallL, seatL, P, fx, fg, update }.
 */
export function gateSet(S, { skyCols = TOWN_DAY, sky2 = TOWN_NIGHT } = {}) {
  const c = makeCutter('lk18-gate');
  sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'night', rise: 0 }).layer : null;
  if (sk2) sk2.fade(0);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 380, n: 80 }));
  starL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 150, len: 900 });
  const moonEl = hanging(hangL, `${halo(50, 0.5)}${moon(c, 24)}`, { x: 1240, y: -1500, len: 900 });
  const cl = hanging(hangL, cloud(c, 150), { x: 560, y: 130, len: 800 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.25) }).markup);
  const townL = S.layer({ par: 0.2, sh: 3 });
  townL.add(town(c, { x: 800, y: 520, n: 11, spread: 900, sc: 0.8 }));
  const mid = S.layer({ par: 0.3, sh: 3 });
  let hs = '';
  [[640, 140, 120], [1260, 150, 130], [1420, 120, 110], [150, 120, 100]].forEach(([x, w, h]) => { hs += house(c, x, 612, w, h, { stairs: false }); });
  mid.add(hs + olive(c, 820, 614, 0.7) + palm(c, 1340, 612, 170));
  // the wall and the gate at the left
  const wallL = S.layer({ par: 0.4, sh: 4 });
  const gx = GT.GATE, gy = GT.GY - 60;
  const ws = sheet();
  const arch = [[gx - 52, gy + 64], [gx - 52, gy - 70], ...c.arc(gx, gy - 70, 52, 44, PI, 2 * PI, 12), [gx + 52, gy + 64]];
  ws.p(c.cut([[-1400, gy + 64], [-1400, gy - 190], [gx + 150, gy - 190], [gx + 150, gy + 64]], 0.6, 12) + c.hole(arch, 0.3, 6), mix(C.stone, C.sand, 0.35));
  let blocks = '';
  for (let y = gy - 180, r = 0; y < gy + 60; y += 34, r++) for (let x = -1380 + (r % 2) * 30; x < gx + 140; x += 60) { if (Math.abs(x + 26 - gx) < 66 && y > gy - 130) continue; blocks += c.ribbon([[x, y], [x + 52, y]], 1.4); }
  ws.x(blocks, shade(C.stone, -0.18), 'opacity=".5"');
  let mer = '';
  for (let x = -1400; x < gx + 150; x += 40) mer += c.cut(c.rect(x, gy - 214, 24, 26), 0.3, 4);
  ws.p(mer, mix(C.stone, C.sand, 0.35));
  // through the open gate: the road outside and the far hills
  const through = `<path d="${c.poly(arch)}" fill="${mix(C.skyBlue, C.cream, 0.35)}"/><path d="${c.poly([[gx - 52, gy - 10], [gx - 20, gy - 22], [gx + 10, gy - 16], [gx + 52, gy - 26], [gx + 52, gy + 64], [gx - 52, gy + 64]])}" fill="${mix(C.hillFar, C.sand, 0.4)}"/><path d="${c.poly([[gx - 52, gy + 20], [gx + 52, gy + 14], [gx + 52, gy + 64], [gx - 52, gy + 64]])}" fill="${mix(C.sand, C.dune, 0.3)}"/>`;
  wallL.add(`<g>${through}</g>` + ws.out());
  // the square
  const floorL = S.layer({ par: 0.45, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-1600, GT.GY - 30], [3200, GT.GY - 30], [3200, 1800], [-1600, 1800]], 0.8, 30), mix(C.stone, C.sand, 0.45));
  let tl = '';
  for (let i = 0; i < 8; i++) { const y = GT.GY - 20 + i * i * 8 + i * 12; tl += c.ribbon([[-1600, y], [3200, y + c.rr(-2, 2)]], 1.2); }
  f.x(tl, shade(C.stone, -0.16), 'opacity=".4"');
  floorL.add(f.out());
  const seatL = S.layer({ par: 0.45, sh: 4 });
  seatL.add(`<g transform="translate(${GT.SEAT} ${GT.GY})">${judgeSeat(c)}</g>`);
  const P = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 6 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  fg.add(sheet().p(c.cut([[-1400, 960], [120, 950], [260, 990], [300, 1800], [-1400, 1800]], 0.8, 14), mix(C.stone2, C.sand2, 0.3)).out() + bush(c, 1440, 990, 200, C.sage, C.moss));
  return {
    c, sk2, starL, hangL, sunEl, moonEl, wallL, seatL, P, fx, fg,
    update(T, { night = 0 } = {}) {
      if (sk2) sk2.fade(night);
      starL.fade(night * 0.9);
      swing(sunEl, 1240, 150 + night * 700, T, 1, 0.6);
      pose(moonEl, { x: 1240, y: lerp(-1500, 150, night), r: T ? Math.sin(T * 0.5) * 1.2 : 0, oy: 0, o: night > 0.002 ? 1 : 0 });
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 130 - night * 900, T, 1.2, 0.6, 1);
    },
  };
}

/* ================================================================== the road to Jericho */
export const JR = { GY: 704, CITY: 1260, BX: 1000, BY: 720 };
/**
 * The last stretch before Jericho: the city of palms ahead at the right, low on the valley floor with the Moab
 * mountains beyond; the road comes in from the left and runs to its gate; palms and a milestone by the road where
 * the blind man sits. Returns { sk2, cityL, roadL, matL, crowdL, P, fx, fg, update }.
 */
export function jerichoSet(S, { skyCols = JERICHO_SKY, sky2 = null } = {}) {
  const c = makeCutter('lk18-jericho');
  sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }).layer : null;
  if (sk2) sk2.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 42), { x: 1080, y: 150, len: 900 });
  const cls = [[700, 130, 150], [1300, 190, 120]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.07, sh: 2 });
  const mfn = (x) => 410 + Math.sin(x * 0.004 + 0.3) * 7 + Math.sin(x * 0.012) * 3;
  far.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 14, 1.2), mix(C.hillFar, C.duskViolet, 0.28)).out());
  const valley = S.layer({ par: 0.14, sh: 3 });
  const vfn = c.wave(486, [5, 2], [900, 260]);
  const vs = sheet().p(c.ridge(vfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillMid, 0.4));
  let thick = '';
  for (let x = -900; x < 2500; x += 30) thick += c.cut(c.blob(x, vfn(x) + 4, c.rr(14, 22), c.rr(6, 9), 9, 0.25), 0.5, 4);
  vs.p(thick, mix(C.moss, C.sage, 0.4));
  valley.add(vs.out());
  // Jericho, the city of palms, ahead at the right
  const cityL = S.layer({ par: 0.26, sh: 3 });
  cityL.add(`<g transform="translate(${JR.CITY} 598)">${jericho10(c, 1.5)}</g>`);
  cityL.add(palm(c, 960, 604, 170) + palm(c, 1010, 606, 140) + palm(c, 1600, 602, 200) + palm(c, 1660, 606, 150));
  // the ground and the road running in from the left to the gate
  const roadL = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(600, [5, 3], [700, 200]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dune, 0.3));
  const road = [];
  for (let i = 0; i <= 24; i++) { const x = -800 + i * 100; road.push([x, JR.GY - 4 - Math.max(0, x - 900) * 0.16]); }
  g.p(c.ribbon(road, (u) => 110 - u * 70), mix(C.sand2, C.dune, 0.12));
  let st = '';
  for (let i = 0; i < 30; i++) { const x = c.rr(-600, 2200), y = c.rr(gfn(x) + 30, 1000); st += c.cut(c.blob(x, y, c.rr(4, 10), c.rr(2, 5), 7, 0.2), 0.3, 3); }
  g.x(st, shade(mix(C.sand, C.dune, 0.3), -0.14), 'opacity=".6"');
  roadL.add(g.out() + grass(c, { x0: -500, x1: 2100, y: 600, fn: gfn, n: 30, h: 13, color: C.olive }) + palm(c, 280, gfn(280) + 60, 230) + palm(c, 360, gfn(360) + 70, 180) + bush(c, 1220, 700, 70, C.olive, C.moss));
  const matL = S.layer({ par: 0.5, sh: 3 });
  const crowdL = S.layer({ par: 0.5, sh: 4 });
  const P = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 6 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  fg.add(bush(c, 160, 1000, 230, C.olive, C.moss) + rock(c, 1440, 990, 200, 66, C.rock2) + grass(c, { x0: -300, x1: 1900, y: 980, n: 16, h: 30, color: C.olive }));
  return {
    c, sk2, hangL, sunEl, cityL, roadL, matL, crowdL, P, fx, fg, gfn,
    update(T, { sunY = 0 } = {}) {
      swing(sunEl, 1080, 150 + sunY, T, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));
    },
  };
}

/* ================================================================== pieces */
export { peopleIcon } from '../mark11/lib.js';
/** God, as the book always shows Him: light, never a figure — a sun of rays over a little cloud (origin centre) */
export function godLight(c, r = 30) {
  const s = sheet();
  let rs = '';
  for (let i = 0; i < 9; i++) { const a = PI * (1.08 + i * 0.105); rs += c.poly([[0, 2], [Math.cos(a) * r * 1.9, Math.sin(a) * r * 1.9], [Math.cos(a + 0.07) * r * 1.9, Math.sin(a + 0.07) * r * 1.9]]); }
  s.x(rs, C.halo, 'opacity=".95"');
  s.p(c.cut(c.circ(0, 0, r * 0.62, 22), 0.3, 4), C.halo);
  s.p(c.cut(c.circ(0, 0, r * 0.42, 18), 0.3, 3), '#fff6d8');
  s.p(c.cut([...c.arc(-r * 0.5, r * 0.5, r * 0.55, r * 0.4, PI, 2 * PI, 6), ...c.arc(r * 0.3, r * 0.42, r * 0.65, r * 0.52, PI, 2 * PI, 6), [r * 1.05, r * 0.62], [-r * 1.1, r * 0.62]], 0.4, 4), C.cream);
  return s.out();
}
/** the judge's verdict: a small unrolled sheet with a red wax seal (origin centre) */
export function verdict(c, w = 44, h = 56) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 5), C.parchment);
  let ln = '';
  for (let y = -h / 2 + 9; y < h / 2 - 16; y += 7) ln += c.ribbon([[-w / 2 + 7, y], [w / 2 - 7 - c.rr(0, 10), y]], 1.3);
  s.x(ln, C.ink, 'opacity=".5"');
  s.p(c.cut(c.rect(-w / 2 - 3, -h / 2 - 5, w + 6, 7), 0.3, 4) + c.cut(c.rect(-w / 2 - 3, h / 2 - 2, w + 6, 7), 0.3, 4), C.wood2);
  s.p(c.cut(c.blob(w * 0.18, h / 2 - 12, 8, 7, 9, 0.2), 0.4, 3), C.terracotta);
  s.x(c.ribbon([[w * 0.1, h / 2 - 4], [w * 0.06, h / 2 + 10]], 3) + c.ribbon([[w * 0.26, h / 2 - 4], [w * 0.32, h / 2 + 10]], 3), C.terracotta);
  return s.out();
}
/** a small round icon plate (a picture inside a rim) for thoughts and hanging tags (origin centre) */
export function iconDisc(c, inner, { r = 30, face = C.cream, rim = C.haloRim } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 4, 28), 0.4, 4), rim).p(c.cut(c.circ(0, 0, r, 28), 0.4, 4), face).out() + inner;
}

/* ================================================================== the Pharisee and the tax collector */
import { templeSet as templeSet2, TFLOOR as TF2 } from '../luke2/lib.js';
import { addToHead as addHead } from '../mark2/lib.js';
import { phylactery as phyl } from '../mark8/lib.js';
import { sinSack as sack3 } from '../luke3/lib.js';
import { trumpetChest as chest12 } from '../mark12/lib.js';
import { TAXMAN as TAX7 } from '../luke7/lib.js';
/** where they stand in the Temple court */
export const TP = { FLOOR: TF2, PHX: 690, TXX: 1116, CHX: 846 };
export const TEMPLE_GOLD = ['#dccbb0', '#f3dcb2', '#f7e6c6'];
/**
 * Luke 2's Temple court (the same place where Simeon and Anna met the Child), as the painted set of the parable:
 * the Pharisee in the middle in front of the sanctuary, the tax collector far off by the columns at the right with a
 * dark sack of sins on his back, a trumpet-mouthed offering chest. Returns the set's layers and the puppets.
 */
export function templeParable(S, { skyCols = TEMPLE_GOLD } = {}) {
  const c = makeCutter('lk18-temple');
  const TS = templeSet2(S, { skyCols, sunAt: [1230, 150] });
  const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
  const P = S.layer({ par: 0.45, sh: 5 });
  const chest = P.add(`<g>${chest12(c, { h: 96, w: 56 })}</g>`);
  pose(chest, { x: TP.CHX, y: TP.FLOOR - 6 });
  const pharM = addHead(person(c, PHARISEE), `<g transform="translate(-2 -14)">${phyl(c, 1)}</g>`);
  const phar = S.puppet(P.add(pharM));
  const taxEl = P.add(person(c, { ...TAX7, eyes: 'closed' }));
  const tax = S.puppet(taxEl);
  const taxOpen = S.puppet(P.add(person(c, { ...TAX7 })));
  const sack = P.add(`<g>${sack3(c, 42, 48)}</g>`);
  const fx = S.layer({ par: 0.47, sh: 6 });
  return { c, TS, glowL, P, fx, chest, phar, tax, taxOpen, sack };
}

/* ================================================================== the babies */
/** an ordinary swaddled baby (no halo): body along +x, head at the right; origin centre */
export function infant(c, { wrap = C.linen, band = C.skyVeil, skin = C.skin } = {}) {
  const s = sheet();
  s.p(c.cut(c.blob(-4, 0, 26, 11, 14, 0.06), 0.4, 4), wrap);
  s.x(c.ribbon([[-16, -9], [-13, 9]], 2.6) + c.ribbon([[-2, -10], [0, 10]], 2.6), band);
  s.p(c.cut(c.circ(24, -2, 10, 16), 0.3, 3), skin);
  s.p(c.cut(c.arc(24, -3, 11, 11, PI * 0.9, PI * 2.1, 10), 0.3, 3), wrap);
  s.x(c.poly(c.circ(28, 0, 1.3, 6)) + c.poly(c.circ(22, 0, 1.3, 6)), C.ink);
  s.x(c.poly(c.circ(25, 4, 2.2, 8)), C.blush, 'opacity=".6"');
  return s.out();
}
/** a baby held in the arms (hand coords, for holdF) */
export const babyHeld = (c, o) => `<g transform="rotate(-70) translate(-14 12) scale(.9)">${infant(c, o)}</g>`;

/* ================================================================== the commandments (18,20) */
import { ring as ring10, LOOK as LOOK10 } from '../mark10/lib.js';
import { purse as purse12 } from '../mark12/lib.js';
import { footprint as foot1 } from '../mark1/lib.js';
/** five picture cards for "Don't commit adultery, don't murder, don't steal, don't give false testimony, honour
 * your father and your mother" (inner markups, drawn round (0, 0) in a box about 70 × 60) and their labels */
export function commandIcons(c) {
  const dagger = sheet().p(c.cut([[-3, -26], [3, -26], [4, 6], [0, 16], [-4, 6]], 0.3, 3), mix(C.rock2, C.skyBlue2, 0.3)).p(c.cut(c.rect(-12, -30, 24, 6), 0.2, 3) + c.cut(c.rect(-3, -44, 6, 14), 0.2, 3), C.wood2).out();
  const no = (inner) => `${inner}<path d="${c.ribbon(c.arc(0, 0, 27, 27, 0, PI * 2, 24), 4)}" fill="${C.terracotta}" opacity=".85"/><path d="${c.ribbon([[-19, 19], [19, -19]], 4)}" fill="${C.terracotta}" opacity=".85"/>`;
  const tongue = sheet().p(c.cut(c.blob(0, -4, 22, 14, 12, 0.05), 0.4, 4), C.cream).p(c.cut([[-6, 6], [-12, 18], [2, 8]], 0.3, 3), C.cream).x(c.ribbon([[-12, -6], [-4, -2], [4, -8], [12, -3]], 2.4), C.ink).out();
  const parents = `<g transform="translate(-14 26)">${fig13L(c, LOOK10.father, { s: 0.26, armF: 20 })}</g><g transform="translate(14 26)">${fig13L(c, LOOK10.mother, { s: 0.25, flip: true, armF: 20 })}</g>`;
  return [
    { icon: no(`<g transform="translate(-8 0) scale(.5)">${ring10(c, 22)}</g><g transform="translate(8 2) scale(.5)">${ring10(c, 22, C.halo)}</g>`), pl: 'nie cudzołóż', en: 'no adultery' },
    { icon: no(`<g transform="rotate(30) scale(.8)">${dagger}</g>`), pl: 'nie zabijaj', en: 'no murder' },
    { icon: no(`<g transform="translate(0 -16) scale(.62)">${purse12(c)}</g>`), pl: 'nie kradnij', en: 'no stealing' },
    { icon: no(`<g transform="scale(.8)">${tongue}</g>`), pl: 'nie kłam', en: 'no false witness' },
    { icon: `<g transform="translate(0 -4)">${parents}</g>`, pl: 'czcij rodziców', en: 'honour parents' },
  ];
}
/** a pair of footprints: "follow me" (origin centre) */
export const footsteps = (c) => `<g transform="translate(-10 8) rotate(-80) scale(.8)">${foot1(c, true)}</g><g transform="translate(10 -8) rotate(-80) scale(.8)">${foot1(c, false)}</g>`;
/** where the commandment cards hang */
export const CARD_X = (i) => 590 + i * 110;
export const CARD_Y = 330;
export { kingdomGate } from '../matthew19/lib.js';
/** the rich man's goods packed on a camel's back (camel coords, facing right) */
export function camelLoad(c) {
  const s = sheet();
  s.p(c.cut(c.blob(-44, -128, 30, 36, 12, 0.15), 0.8, 5) + c.cut(c.blob(22, -126, 28, 34, 12, 0.15), 0.8, 5), mix(C.basket, C.wood3, 0.4));
  s.p(c.cut(c.rect(-30, -196, 58, 40), 0.5, 5), C.wood2);
  s.p(c.cut(c.rect(-30, -196, 58, 8), 0.3, 4) + c.cut(c.rect(-6, -180, 10, 10), 0.2, 3), C.ochre);
  s.p(c.cut([[-24, -196], [-18, -232], [-4, -240], [4, -196]], 0.4, 4), C.pot);
  s.p(c.cut(c.rect(8, -222, 26, 26), 0.3, 4), C.plumRobe);
  s.x(c.ribbon([[8, -210], [34, -210]], 3), C.sun);
  return s.out();
}

/* ================================================================== what they left (18,29–30) */
import { littleHouse as house12 } from '../mark12/lib.js';
import { child as child10 } from '../mark10/lib.js';
/** picture cards' icons for house, wife, brothers, parents, children: one of each, and "many times more" */
export function leftIcons(c) {
  const f = (o, x, y, s, flip = false) => `<g transform="translate(${x} ${y})">${fig13L(c, o, { s, flip, armF: 16 })}</g>`;
  const wife = { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair, beard: 'none', skin: C.skin2 };
  const bro = (i) => ({ robe: [C.sageRobe, C.ochreRobe, C.dustyBlue, C.tealRobe, C.clayMantle][i % 5], hairStyle: ['short', 'curly', 'wrap'][i % 3], veil: C.linen2, hair: [C.hair, C.hair2, C.hair3][i % 3], beard: ['short', 'full', 'none'][i % 3], skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4] });
  const sis = (i) => ({ ...bro(i), hairStyle: 'veil', veil: [C.cream, C.blushVeil, C.skyVeil][i % 3], beard: 'none' });
  const row = (fn, n, s, w) => Array.from({ length: n }, (_, i) => f(fn(i), -w / 2 + (i + 0.5) * (w / n), 24 + (i % 2) * 4, s, i % 2 === 1)).join('');
  const h = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${house12(c, 40, 32)}</g>`;
  return [
    { one: h(0, 20, 1), many: h(-22, 8, 0.7) + h(20, 10, 0.75) + h(-6, 26, 0.8) + h(26, 28, 0.6), pl: 'dom', en: 'house' },
    { one: f(wife, 0, 26, 0.3), many: row((i) => (i % 2 ? sis(i) : bro(i)), 5, 0.22, 74), pl: 'żona', en: 'wife' },
    { one: f(bro(0), -12, 26, 0.3) + f(bro(1), 12, 26, 0.3, true), many: row(bro, 5, 0.22, 74), pl: 'bracia', en: 'brothers' },
    { one: f(LOOK10.father, -12, 26, 0.3) + f(LOOK10.mother, 12, 26, 0.29, true), many: row((i) => (i % 2 ? LOOK10.mother : LOOK10.father), 4, 0.24, 70), pl: 'rodzice', en: 'parents' },
    { one: f(child10(c, 1), -10, 26, 0.18) + f(child10(c, 2), 10, 26, 0.17, true), many: row((i) => child10(c, i + 1), 6, 0.15, 74), pl: 'dzieci', en: 'children' },
  ];
}
/** Peter's memory: his boat on the shore of the lake and his house in Capernaum (a round plate's inner, r ≈ 60) */
export function peterMemory(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-70, -70, 140, 60), 0.3, 6), mix(C.skyBlue, C.cream, 0.3));
  s.p(c.cut([[-70, -14], [70, -18], [70, 8], [-70, 10]], 0.4, 6), C.lake2);
  s.p(c.cut([[-70, 8], [70, 6], [70, 70], [-70, 70]], 0.4, 6), mix(C.sand, C.dune, 0.2));
  s.p(c.cut([[-50, 0], [0, 2], [-8, 12], [-44, 12]], 0.4, 4), C.wood);
  s.x(c.ribbon([[-28, 0], [-28, -40]], 2), C.wood2);
  s.p(c.cut([[-26, -38], [-4, -8], [-26, -8]], 0.3, 3), C.sail);
  s.x(c.ribbon([[-60, 20], [-10, 34]], 1.4) + c.ribbon([[-54, 30], [-16, 22]], 1.4), C.rope, 'opacity=".8"');
  return s.out() + `<g transform="translate(36 22) scale(.9)">${house12(c, 40, 34)}</g>`;
}

/* ================================================================== the blind man by the road to Jericho */
import { LOOK as L10b, cloakSpread as cloak10, beggarBowl as bowl10 } from '../mark10/lib.js';
/** where the blind man sits and where Jesus stops */
export const BL = { BX: 1000, BY: 722, JSTOP: 800 };
/**
 * The people on the Jericho road (in jerichoSet's layers): the blind man's cloak and bowl, the blind man sitting,
 * standing (led) and seeing; the crowd that goes in front, the disciples and the crowd behind as sprites.
 * Returns { sit, stand, see, seeEl, ahead, aheadUp, dis, behind, behindUp, bowl, cloak }.
 */
export function jerichoPeople(S, R) {
  const c = makeCutter('lk18-jr-people');
  const cloak = R.matL.add(`<g>${cloak10(c, mix(C.sand2, C.wood3, 0.4))}</g>`);
  const bowl = R.matL.add(`<g>${bowl10(c)}</g>`);
  pose(cloak, { x: BL.BX + 6, y: BL.BY + 2, s: 0.8 });
  pose(bowl, { x: BL.BX - 58, y: BL.BY + 4 });
  const K = (seed, n, o) => crowdKnot(seed, n, { s: 0.84, spread: 44, rows: 2, ...o }).m;
  const ahead = R.crowdL.sprite(K('lk18-jr-a', 7, {}), 400, 700);
  const aheadUp = R.crowdL.sprite(K('lk18-jr-a', 7, { arms: [120, 150], armB: [130, 160], head: [-12, -6] }), 400, 700);
  const behind = R.crowdL.sprite(K('lk18-jr-b', 8, { s: 0.8 }), 200, 704);
  const behindUp = R.crowdL.sprite(K('lk18-jr-b', 8, { s: 0.8, arms: [120, 150], armB: [130, 160], head: [-12, -6] }), 200, 704);
  aheadUp.set({ x: 400, y: 700, o: 0 }); behindUp.set({ x: 200, y: 704, o: 0 });
  const dis = R.crowdL.sprite(disciples(c, ['peter', 'andrew', 'james', 'john', 'philip', 'thomas'], { s: 0.86, spread: 44, rows: 2 }), 300, 708);
  const sit = S.puppet(R.P.add(person(c, { ...L10b.bart, pose: 'sit' })));
  const stand = S.puppet(R.P.add(person(c, { ...L10b.bart, mantle: null })));
  const seeEl = R.P.add(person(c, { ...L10b.bart, mantle: null, eyes: 'open' }));
  const see = S.puppet(seeEl);
  return { c, sit, stand, see, seeEl, ahead, aheadUp, dis, behind, behindUp, bowl, cloak };
}
