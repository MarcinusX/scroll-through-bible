// Matthew 16 — the cast and cut-outs of this chapter: the lake shore where the sign from heaven is demanded, the
// red skies of evening and morning, the great fish of Jonah on a painted sea, the boat and the kneading bowls of the
// leaven, the rock cliff of Caesarea Philippi under snowy Hermon with its grotto (the "gate of Hades" of the old
// shrine of Pan) and its springs, the great rock on which the Church is built stone by stone, the gates that do not
// prevail, the keys of the Kingdom, binding and loosing on earth and in heaven, the jar of a life poured out.
// The Twelve, the Pharisees, the portraits, the heaven flat, the bowls of leaven, the shadow screen, the balance and
// the angels are Mark 8's cut-outs, so the parallel chapters look the same.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, palm, house, sun, cloud, grass, olive, cypress, bush, rock, reeds } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { hermon } from '../mark8/lib.js';

export {
  LOOK, TWELVE, pharisee, LEADERS, man, shadowPerson, angel, basket, crumb, doughBowl, bubbleDot, phylactery, crown, say, tag, bigQuestion,
  sighPuff, heavenPanel, lightCrown, oilHorn, glory, soulLight, globe, balance, smallCross, portrait, memoryCard, walledCity, hermon, crewBoat,
  staff, bundle, candle, coin, coinStack, loaf, spark, speech, GLYPH, wordSlip, kf, moving, hand, headAt, heart, signpost, dust,
} from '../mark8/lib.js';
export { sadducee, kingdomGate } from '../mark12/lib.js';
export { namedRock, radiance, rayBurst, glowDisc, hungWord, hungPlate, iconWord } from '../john1/lib.js';
export { eyeIcon } from '../john6/lib.js';
export { crutch } from '../mark1/lib.js';
export { nameTag } from '../mark3/lib.js';
export { pose3, folk4, TEMPTER, tempterAura, lightShaft, cloudSea, goldSlip } from '../matthew4/lib.js';
export { crossX } from '../mark6/lib.js';
export { hangAt, along, mob } from '../matthew8/lib.js';
export { hungStrip, plateCard, drop, carryCross } from '../matthew10/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DAY = ['#c6ddd8', '#eeebd4', '#f7ead0'];
export const EVENING = ['#b58fa6', '#eb9f7f', '#f6c48e'];      // red sky at evening
export const MORNING_RED = ['#7d6f86', '#d98a72', '#efb086']; // red and threatening morning
export const GOLDEN = ['#d8c0a8', '#f1cf9f', '#f7dfb4'];
export const DUSK = ['#8f86ad', '#d9a592', '#f0c9a2'];
export const HEAVEN = ['#f3cf7e', '#fbe7b0', '#fdf3d6'];
export const HERMON = ['#bcd3de', '#e9e6d6', '#f4e9d4'];      // clear mountain air at Caesarea

/* ================================================================== the cast */
/** Jeremiah: an old prophet with a wooden yoke on his neck (Jer 27) */
export const JEREMIAH = { robe: mix(C.stone2, C.clay, 0.25), mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: '#e6dfd2', skin: C.skin3, belt: C.rope };
/** Jonah */
export const JONAH = { robe: C.skyVeil, mantle: C.ochreRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.leather };
/** the six disciples at Caesarea (the same places in every scene there) */
export const DIS16 = [
  { o: CAST.john, x: 520 }, { o: CAST.james, x: 585 }, { o: CAST.andrew, x: 650 },
  { o: CAST.peter, x: 905, k: 'peter' }, { o: CAST.matthew, x: 975 }, { o: CAST.thomas, x: 1045 },
];

/* ================================================================== the beach of Magadan (scenes 1–3) */
export const MG = { SHORE: 610, GY: 690 };
/**
 * The lake shore where the sign is demanded, always cut with the same scissors: sky (plus optional extra skies that
 * cross-fade, created with rise: 0), sun and two clouds on strings, far hills with a town, the lake and its waves,
 * the beach with palms, reeds and the boat drawn up. Returns handles + update(T, { sunX, sunY }).
 */
export function magadan(S, { skies = [], sunAt = [1240, 150], boatAt = 360 } = {}) {
  const c = makeCutter('mt16-magadan');
  const sk = sky(S, DAY);
  const extra = skies.map((cols, i) => { const L = sky(S, cols, { name: 'sky' + i, rise: 0 }).layer; L.fade(0); return L; });
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[450, 150, 200], [1040, 230, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
  const hills = S.layer({ par: 0.16, sh: 2 });
  const h2 = hillsWith(c, { y: 470, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20, x0: -900, x1: 2500 });
  hills.add(h2.markup + town(c, { x: 1340, y: h2.fn(1340) + 8, n: 5, spread: 220, sc: 0.45 }));
  S.layer({ par: 0.2, sh: 2 }).add(waterBand(c, { y: 500, color: C.lake, foamN: 30 }).markup);
  const wv = S.layer({ par: 0.26, sh: 3, pad: 140 });
  wv.add(waveStrip(c, { y: 566, len: 130, amp: 7, color: C.lake2 }));
  const beachL = S.layer({ par: 0.36, sh: 3 });
  const bfn = c.wave(MG.SHORE, [4, 2], [700, 160]);
  beachL.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
  beachL.add(palm(c, 1390, MG.SHORE + 16, 240) + palm(c, 1500, MG.SHORE + 26, 190) + rock(c, 1240, MG.SHORE + 30, 60, 22, C.rock2) + reeds(c, 250, MG.SHORE + 12, 10, 90));
  beachL.add(grass(c, { x0: 900, x1: 2000, y: MG.SHORE + 8, fn: bfn, n: 20, h: 12, color: C.olive }));
  const B = boat(c, { mast: false });
  beachL.add(`<g transform="translate(${boatAt} ${MG.SHORE + 40}) scale(.9) rotate(-4)">${B.back}${B.front}</g>`);
  return {
    c, sk, extra, hangL, sunEl, beachL,
    update(T, { sunX = sunAt[0], sunY = sunAt[1], clouds = 1 } = {}) {
      swing(sunEl, sunX, sunY, T, 1.1, 0.7);
      cls.forEach((k) => swing(k.el, k.x + Math.sin(T * 0.1 + k.i * 2) * 26, k.y - (1 - clouds) * 700, T, 1.4, 0.6 + k.i * 0.2, k.i));
      wv.shift(((T * 16) % 130) - 65);
    },
  };
}
/** the near reeds and rocks of the beach (one sheet, par 0.9) */
export function magadanFront(S) {
  const c = makeCutter('mt16-magadan-front');
  S.layer({ par: 0.9, sh: 6 }).add(reeds(c, 150, 900, 14, 220, C.moss) + rock(c, 1440, 930, 220, 90, C.rock2) + reeds(c, 1540, 920, 10, 180, C.olive));
}

/* ================================================================== Caesarea Philippi */
/** the great cliff of Paneas: a wide rock face with strata, niches of the old shrines and a big dark grotto.
 *  Origin: the grotto's floor, centre. Returns markup. */
export function panCliff(c, { w = 900, h = 360, gw = 170, gh = 170 } = {}) {
  const s = sheet();
  const col = mix(C.rock, C.clay, 0.22);
  const pts = [[-w * 0.62, 30], [-w * 0.61, -h * 0.4], [-w * 0.57, -h * 0.72], [-w * 0.5, -h * 0.9], [-w * 0.34, -h * 0.97], [-w * 0.12, -h * 0.94], [w * 0.1, -h], [w * 0.3, -h * 1.03], [w * 0.5, -h * 0.92], [w * 0.64, -h * 0.8], [w * 0.7, -h * 0.44], [w * 0.72, 30]];
  s.p(c.cut(pts, 3, 12), col);
  // strata (kept inside the face)
  let st = '';
  for (let i = 1; i < 6; i++) { const y = -h * i / 6.4; st += c.ribbon([[-w * 0.54 + c.rr(0, 30), y], [-w * 0.1, y + c.rr(-8, 8)], [w * 0.3, y + c.rr(-6, 6)], [w * 0.62 - c.rr(0, 30), y + c.rr(-6, 6)]], c.rr(2, 5)); }
  s.x(st, mix(C.rock2, C.clay, 0.2), 'opacity=".6"');
  // lighter planes of the face
  s.x(c.cut([[-w * 0.36, -h * 0.66], [-w * 0.12, -h * 0.9], [w * 0.02, -h * 0.72], [-w * 0.2, -h * 0.52]], 1, 8) + c.cut([[w * 0.2, -h * 0.84], [w * 0.4, -h * 0.9], [w * 0.5, -h * 0.66], [w * 0.3, -h * 0.6]], 1, 8), shade(col, 0.22), 'opacity=".6"');
  // the grotto: a wide arch of darkness
  s.p(c.cut([[-gw / 2 - 16, 0], [-gw / 2 - 18, -gh * 0.55], ...c.arc(0, -gh * 0.55, gw / 2 + 18, gh * 0.5, PI, 2 * PI, 14), [gw / 2 + 18, -gh * 0.55], [gw / 2 + 16, 0]], 1.4, 6), shade(col, -0.12));
  s.p(c.cut([[-gw / 2, 0], [-gw / 2, -gh * 0.55], ...c.arc(0, -gh * 0.55, gw / 2, gh * 0.45, PI, 2 * PI, 14), [gw / 2, -gh * 0.55], [gw / 2, 0]], 1.2, 6), mix(C.soilDark, C.night2, 0.45));
  // niches of the shrines
  let ni = '';
  [[-w * 0.36, -h * 0.36], [-w * 0.22, -h * 0.44], [w * 0.26, -h * 0.4], [w * 0.42, -h * 0.34], [w * 0.36, -h * 0.62]].forEach(([x, y]) => { ni += c.cut([[x - 16, y], [x - 16, y - 26], ...c.arc(x, y - 26, 16, 14, PI, 2 * PI, 6), [x + 16, y]], 0.4, 4); });
  s.p(ni, shade(C.rock2, -0.25));
  // greenery on the ledges and the top
  let g = '';
  for (let i = 0; i < 14; i++) g += c.cut(c.blob(c.rr(-w * 0.55, w * 0.62), -h * c.rr(0.62, 0.98), c.rr(16, 32), c.rr(8, 14), 10, 0.25), 0.8, 5);
  s.p(g, C.moss);
  let g2 = '';
  for (let i = 0; i < 8; i++) g2 += c.cut(c.blob(c.rr(-w * 0.5, w * 0.6), -h * c.rr(0.2, 0.5), c.rr(10, 18), c.rr(6, 10), 9, 0.25), 0.6, 5);
  s.p(g2, C.sage);
  return s.out();
}

/** the springs of the Jordan pouring from under the cliff: a pool and a brook running to the left (origin world) */
export function springWater(c, x, y) {
  const w = sheet();
  w.p(c.cut([[x - 150, y - 2], [x + 120, y - 6], [x + 150, y + 14], [x - 170, y + 18]], 0.8, 8), C.lake2);
  w.p(c.ribbon(c.qbez([x - 120, y + 8], [x - 360, y + 40], [x - 760, y + 70], 18), (u) => 18 + u * 38), C.lake);
  w.x(c.ribbon(c.qbez([x - 120, y + 8], [x - 360, y + 42], [x - 760, y + 72], 18), 2), C.foam, 'opacity=".7"');
  return w.out();
}

/**
 * Caesarea Philippi, always cut with the same scissors so it looks the same in every scene: sky (with a golden second
 * sky), sun and cloud on strings, Hermon's snows, green hills with a village, the cliff of Paneas with its grotto
 * (layer cliffL, par 0.26), springs, and the ground (par 0.4). GX/GY: the grotto's floor in world units.
 * Returns handles + update(T, { gold }).
 */
export const CZ = { GX: 1150, GY: 588, GROUND: 668 };
export function caesareaSet(S, { skyCols = HERMON, gold = HEAVEN, sunAt = [360, 160], cloudAt = [1010, 140], between = null } = {}) {
  const c = makeCutter('mt16-caesarea');
  const sk = sky(S, skyCols);
  const goldL = sky(S, gold, { name: 'gold', rise: 0 }).layer;
  goldL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const clEl = hanging(hangL, cloud(c, 220), { x: cloudAt[0], y: cloudAt[1], len: 700 });
  S.layer({ par: 0.06, sh: 2 }).add(hermon(c, 1150, 470, 1100, 300) + hermon(c, 300, 470, 700, 150));
  const hills = S.layer({ par: 0.14, sh: 2 });
  const h2 = hillsWith(c, { y: 500, amps: [16, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3000 });
  hills.add(h2.markup + house(c, 160, h2.fn(160) + 8, 40, 26) + house(c, 214, h2.fn(214) + 6, 30, 22) + house(c, -120, h2.fn(-120) + 8, 36, 24) + house(c, 30, h2.fn(30) + 8, 34, 24));
  const cliffL = S.layer({ par: 0.26, sh: 4 });
  cliffL.add(`<g transform="translate(${CZ.GX} ${CZ.GY})">${panCliff(c, { w: 700, h: 300, gw: 150, gh: 150 })}</g>`);
  cliffL.add(springWater(c, CZ.GX - 40, CZ.GY + 6) + reeds(c, 1380, CZ.GY + 22, 8, 60) + cypress(c, 660, CZ.GY + 14, 170) + cypress(c, 1600, CZ.GY + 18, 190));
  const mid = between ? between(S, c) : null;
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(CZ.GROUND - 40, [4, 2], [600, 160]);
  ground.add(sheet().p(c.ridge(gfn, -1400, 3000, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).out());
  ground.add(sheet().p(c.cut([[-1400, CZ.GROUND - 10], [3000, CZ.GROUND - 20], [3000, CZ.GROUND + 30], [-1400, CZ.GROUND + 40]], 1.2, 20), C.sand2).out());
  ground.add(grass(c, { x0: -1000, x1: 2600, y: CZ.GROUND - 40, fn: gfn, n: 40, h: 14, color: C.olive }) + rock(c, 440, CZ.GROUND - 30, 70, 30, C.rock2) + olive(c, 230, CZ.GROUND - 34, 0.9));
  return {
    c, sk, goldL, hangL, sunEl, clEl, cliffL, ground, mid,
    update(T, { gold: gk = 0, sunY = sunAt[1] } = {}) {
      goldL.fade(gk);
      swing(sunEl, sunAt[0], sunY, T, 1.1, 0.7);
      swing(clEl, cloudAt[0] + Math.sin(T * 0.1) * 26, cloudAt[1], T, 1.4, 0.6, 1);
    },
  };
}
/** the near foreground rocks and bushes of Caesarea (one sheet, par 0.95) */
export function caesareaFront(S) {
  const c = makeCutter('mt16-front');
  S.layer({ par: 0.95, sh: 6 }).add(rock(c, 120, 930, 280, 110, C.rock2) + bush(c, 330, 900, 140, C.sage) + rock(c, 1500, 920, 220, 100, C.rock) + bush(c, 1640, 900, 160, C.moss));
}
/** gushing water drops from the grotto (one small still piece; move it as a whole) */
export function gush(c, n = 7) {
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut(c.ell(i * 22 - n * 11, c.rr(-6, 6), c.rr(7, 12), c.rr(3, 5), 8, c.rr(-0.4, 0.4)), 0.2, 3);
  return `<path d="${d}" fill="#f4f2e6" opacity=".9"/>`;
}

/* ================================================================== the great rock and the Church */
/** a massive rock with a name carved in it; origin: base centre. Returns markup. */
export function greatRock(c, text, { w = 520, h = 250, col = mix(C.rock2, C.rock3, 0.3) } = {}) {
  const s = sheet();
  const pts = [[-w / 2 - 20, 0], [-w / 2, -h * 0.32], [-w * 0.42, -h * 0.7], [-w * 0.3, -h * 0.92], [-w * 0.12, -h], [w * 0.14, -h * 0.98], [w * 0.34, -h * 0.9], [w * 0.46, -h * 0.64], [w / 2 + 6, -h * 0.3], [w / 2 + 24, 0]];
  s.p(c.cut(pts.map(([x, y]) => [x * 1.02, y * 1.02 + 4]), 2, 10), shade(col, -0.18));
  s.p(c.cut(pts, 2, 10), col);
  // flat building top
  s.p(c.cut([[-w * 0.36, -h * 0.9], [-w * 0.12, -h - 2], [w * 0.14, -h], [w * 0.36, -h * 0.9], [w * 0.2, -h * 0.84], [-w * 0.2, -h * 0.84]], 0.8, 8), shade(col, 0.2));
  // facets and cracks
  s.x(c.cut([[-w * 0.42, -h * 0.6], [-w * 0.24, -h * 0.78], [-w * 0.18, -h * 0.4], [-w * 0.36, -h * 0.24]], 1, 8) + c.cut([[w * 0.2, -h * 0.7], [w * 0.4, -h * 0.6], [w * 0.36, -h * 0.26], [w * 0.16, -h * 0.34]], 1, 8), shade(col, -0.1), 'opacity=".55"');
  s.x(c.ribbon([[-w * 0.3, -h * 0.72], [-w * 0.24, -h * 0.84]], 2.4) + c.ribbon([[w * 0.36, -h * 0.5], [w * 0.3, -h * 0.62]], 2), shade(col, -0.35), 'opacity=".5"');
  let moss = '';
  for (let i = 0; i < 6; i++) moss += c.cut(c.blob(c.rr(-w * 0.44, w * 0.44), -c.rr(4, 20), c.rr(14, 28), c.rr(6, 10), 9, 0.25), 0.6, 5);
  s.p(moss, C.moss);
  const txt = text ? `<text x="0" y="${(-h * 0.74).toFixed(0)}" text-anchor="middle" font-family="${FONT}" font-size="${(h * 0.17).toFixed(0)}" font-style="italic" letter-spacing="3" fill="${shade(col, -0.55)}">${text}</text>` : '';
  return s.out() + txt;
}

/** the Church as stones laid on the rock, as separate pieces so it can be built stone by stone.
 *  All pieces share one origin: the middle of the foundation's bottom. Returns { parts: [markup…], glow, door }. */
export function churchParts(c, { w = 300 } = {}) {
  const stone = mix(C.stone, C.cream, 0.25), stone2 = C.stone2, roof = mix(C.terracotta, C.roof, 0.45), gold = mix(C.sun, C.ochre, 0.3);
  const parts = [];
  // 1–3: the foundation: three great blocks
  const fb = (x0, x1) => sheet().p(c.cut([[x0, 0], [x0 + 2, -26], [x1 - 2, -27], [x1, 0]], 0.5, 6), mix(C.rock2, C.stone2, 0.5)).x(c.ribbon([[x0 + 6, -14], [x1 - 8, -15]], 1.2), shade(C.rock2, -0.2), 'opacity=".5"').out();
  parts.push(fb(-w / 2 - 10, -w / 6), fb(-w / 6, w / 6), fb(w / 6, w / 2 + 10));
  // 4–5: the side aisles, with small arched windows
  const aisle = (x0, x1) => {
    const s = sheet(), d = Math.sign(x1 - x0);
    s.p(c.cut([[x0, -26], [x0, -96], [x1, -116], [x1, -26]], 0.5, 6), stone2);
    const wx = (x0 + x1) / 2;
    s.x(c.cut([[wx - 7, -44], [wx - 7, -66], ...c.arc(wx, -66, 7, 7, PI, 2 * PI, 6), [wx + 7, -44]], 0.2, 3), mix(C.soilDark, C.plumRobe, 0.3));
    s.p(c.cut([[x0 - 8 * d, -92], [x1, -122], [x1, -112], [x0 - 8 * d, -84]], 0.4, 6), roof);
    return s.out();
  };
  parts.push(aisle(-w / 2, -w * 0.3), aisle(w / 2, w * 0.3));
  // 6: the nave wall with three windows and the door
  const nave = sheet();
  const nx = w * 0.3;
  nave.p(c.cut([[-nx, -26], [-nx, -170], [nx, -170], [nx, -26]], 0.5, 6), stone);
  let wins = '';
  [-nx * 0.62, nx * 0.62].forEach((x) => { wins += c.cut([[x - 10, -96], [x - 10, -128], ...c.arc(x, -128, 10, 10, PI, 2 * PI, 8), [x + 10, -96]], 0.2, 3); });
  wins += c.cut(c.circ(0, -140, 13, 16), 0.2, 3);
  nave.x(wins, mix(C.soilDark, C.plumRobe, 0.3));
  nave.p(c.cut([[-20, -26], [-20, -70], ...c.arc(0, -70, 20, 20, PI, 2 * PI, 10), [20, -26]], 0.3, 4), C.wood2);
  // courses of stone
  let crs = '';
  for (let y = -50; y > -166; y -= 24) crs += c.ribbon([[-nx + 4, y], [nx - 4, y + c.rr(-1, 1)]], 1);
  nave.x(crs, shade(stone, -0.12), 'opacity=".55"');
  parts.push(nave.out());
  // 7: the gable roof
  parts.push(sheet().p(c.cut([[-nx - 14, -166], [0, -226], [nx + 14, -166], [nx + 14, -158], [-nx - 14, -158]], 0.5, 6), roof).x(c.ribbon([[-nx - 10, -164], [0, -222], [nx + 10, -164]], 2), shade(roof, 0.25), 'opacity=".6"').out());
  // 8: the dome on its drum, with a cross
  const dome = sheet();
  dome.p(c.cut([[-46, -206], [-46, -250], [46, -250], [46, -206]], 0.4, 5), stone);
  let dw = '';
  for (let i = -2; i <= 2; i++) dw += c.cut([[i * 18 - 4, -218], [i * 18 - 4, -236], [i * 18 + 4, -236], [i * 18 + 4, -218]], 0.2, 3);
  dome.x(dw, mix(C.soilDark, C.plumRobe, 0.3));
  dome.p(c.cut([[-50, -250], ...c.arc(0, -250, 50, 46, PI, 2 * PI, 16), [50, -250]], 0.4, 5), gold);
  dome.x(c.ribbon(c.arc(0, -250, 32, 40, PI * 1.12, PI * 1.5, 6), 3), shade(gold, 0.35), 'opacity=".6"');
  dome.p(c.cut([[-3, -294], [-3, -326], [3, -326], [3, -294]], 0.2, 3) + c.cut([[-13, -316], [13, -316], [13, -310], [-13, -310]], 0.2, 3), gold);
  parts.push(dome.out());
  // the light in the windows (flat, fade in) and the open door
  let lit = '';
  [-nx * 0.62, nx * 0.62].forEach((x) => { lit += c.cut([[x - 9, -97], [x - 9, -128], ...c.arc(x, -128, 9, 9, PI, 2 * PI, 8), [x + 9, -97]], 0.2, 3); });
  lit += c.cut(c.circ(0, -140, 12, 16), 0.2, 3);
  for (let i = -2; i <= 2; i++) lit += c.cut([[i * 18 - 3, -219], [i * 18 - 3, -235], [i * 18 + 3, -235], [i * 18 + 3, -219]], 0.2, 3);
  [-w * 0.4, w * 0.4].forEach((x) => { lit += c.cut([[x - 6, -45], [x - 6, -66], ...c.arc(x, -66, 6, 6, PI, 2 * PI, 6), [x + 6, -45]], 0.2, 3); });
  const glow = `<circle cx="0" cy="-150" r="260" fill="url(#warm-glow)" opacity=".9"/><path d="${lit}" fill="${C.lampGlow}"/><path d="${c.cut([[-18, -27], [-18, -70], ...c.arc(0, -70, 18, 18, PI, 2 * PI, 10), [18, -27]], 0.3, 4)}" fill="${C.lampGlow}"/>`;
  return { parts, glow };
}

/** the iron gates of Hades, set in the grotto: one leaf (dir -1 left, 1 right), hinged at its outer edge.
 *  Origin: the hinge, at the floor. Width gw/2, height gh. */
export function gateLeaf(c, dir, { gw = 170, gh = 170, col = mix(C.ink, C.storm2, 0.45) } = {}) {
  const w = gw / 2;
  const s = sheet();
  const X = (x) => -dir * x;       // leaf runs from the hinge inward
  let bars = '';
  for (let i = 0; i < 4; i++) { const x = 8 + i * (w - 12) / 3.4; const top = -gh * 0.55 - Math.sqrt(Math.max(0, 1 - ((w - x) / w) ** 2)) * gh * 0.4; bars += c.cut([[X(x - 3), 0], [X(x - 3), top], [X(x), top - 12], [X(x + 3), top], [X(x + 3), 0]], 0.3, 4); }
  s.p(bars, col);
  s.p(c.cut([[X(0), -gh * 0.2], [X(w), -gh * 0.2], [X(w), -gh * 0.2 - 7], [X(0), -gh * 0.2 - 7]], 0.3, 5) + c.cut([[X(0), -gh * 0.58], [X(w), -gh * 0.58], [X(w), -gh * 0.58 - 7], [X(0), -gh * 0.58 - 7]], 0.3, 5), col);
  s.p(c.cut([[X(0), 0], [X(0), -gh * 0.62], [X(7), -gh * 0.62], [X(7), 0]], 0.3, 5), col);
  return s.out();
}
/** a dark tongue from the pit: a tapering arm of shadow ending in three claws; root at the origin, reaching to −x
 *  (len long). Stretch it along its axis (sx) to make it reach. */
export function darkSurge(c, len = 280, h = 60, col = '#2a2438') {
  const top = [], bot = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10, x = -len * 0.82 * u, wv = Math.sin(u * PI * 2.2) * h * 0.18, w = h * (0.5 - u * 0.36);
    top.push([x, wv - w]); bot.push([x, wv + w]);
  }
  const tip = [-len * 0.82, Math.sin(PI * 2.2) * h * 0.18];
  const claws = [[tip[0] - len * 0.18, tip[1] - h * 0.42], [tip[0] - len * 0.08, tip[1] - h * 0.1], [tip[0] - len * 0.2, tip[1] + h * 0.02], [tip[0] - len * 0.06, tip[1] + h * 0.14], [tip[0] - len * 0.15, tip[1] + h * 0.44]];
  const pts = [...top, ...claws, ...bot.reverse()];
  return sheet().p(c.cut(pts, 1.2, 8), col).x(c.ribbon(top.slice(1, 9).map(([x, y]) => [x, y + h * 0.1]), 3), mix(col, C.plumRobe, 0.5), 'opacity=".8"').out();
}
/** a splinter of shadow (the surge breaking on the rock) — origin centre */
export function shard(c, r = 18, col = '#2a2438') {
  return `<path d="${c.cut([[-r, 0], [-r * 0.2, -r * 0.5], [r, -r * 0.2], [r * 0.3, r * 0.5]], 0.4, 4)}" fill="${col}"/>`;
}

/** heaven as a band of cloud let down from the flies: scalloped along its bottom edge at y (origin world) */
export function cloudBand(c, { x0 = -900, x1 = 2500, y = 200, col = '#fbf1d8', col2 = '#f1dfb4', r0 = 40, r1 = 80 } = {}) {
  const pts = [[x0, y - 1400], [x1, y - 1400]];
  let x = x1;
  while (x > x0) { const r = c.rr(r0, r1); pts.push(...c.arc(x - r, y + c.rr(-8, 8), r, r * 0.55, 0, PI, 8)); x -= r * 2 - 6; }
  const s = sheet();
  s.p(c.cut(pts.map(([px, py]) => [px, py + 14]), 0.6, 10), col2);
  s.p(c.cut(pts, 0.6, 10), col);
  return s.out();
}
/** the whole Church on its rock as one still cut-out (origin: the rock's base centre) */
export function rockChurch(c, { w = 440, h = 220, cs = 0.8, text = '' } = {}) {
  const ch = churchParts(c);
  const parts = ch.parts.map((m) => `<g transform="translate(0 ${-h + 6}) scale(${cs})">${m}</g>`).join('');
  return `<g transform="translate(0 ${-h - 124})">${glowDisc0(300)}</g>${greatRock(c, text, { w, h })}${parts}<g transform="translate(0 ${-h + 6}) scale(${cs})">${ch.glow}</g>`;
}
const glowDisc0 = (r) => `<circle r="${r}" fill="url(#warm-glow)"/>`;

/* ================================================================== the keys and the cords */
/** one great key (origin: the middle of its shaft; bow to -x, bit to +x) */
export function bigKey(c, { len = 150, col = C.sun, dark } = {}) {
  const d2 = dark || shade(col, -0.22);
  const s = sheet();
  const bx = -len / 2;
  // a trefoil bow
  s.p(c.cut(c.circ(bx - 10, 0, 17, 20), 0.3, 4) + c.cut(c.circ(bx - 22, -16, 11, 14), 0.3, 3) + c.cut(c.circ(bx - 22, 16, 11, 14), 0.3, 3) + c.cut(c.circ(bx - 32, 0, 11, 14), 0.3, 3), col);
  s.x(c.poly(c.circ(bx - 16, 0, 8, 12)), shade(col, 0.4), 'opacity=".6"');
  // collar and shaft
  s.p(c.cut([[bx + 4, -9], [bx + 12, -9], [bx + 12, 9], [bx + 4, 9]], 0.2, 3) + c.cut([[bx + 10, -4.5], [len / 2, -4.5], [len / 2, 4.5], [bx + 10, 4.5]], 0.2, 6), col);
  // the bit, with wards
  s.p(c.cut([[len / 2 - 36, 3], [len / 2, 3], [len / 2, 30], [len / 2 - 8, 30], [len / 2 - 8, 20], [len / 2 - 16, 20], [len / 2 - 16, 30], [len / 2 - 26, 30], [len / 2 - 26, 16], [len / 2 - 36, 16]], 0.2, 4), col);
  s.x(c.ribbon([[bx + 14, -1], [len / 2 - 4, -1]], 1.4), d2, 'opacity=".6"');
  return s.out();
}
/** the keys of the Kingdom: gold and silver, crossed, tied with a red cord; origin centre */
export function crossedKeys(c, len = 150) {
  return `<circle r="${len * 0.55}" fill="url(#halo-glow)" opacity=".7"/><g transform="rotate(-38)">${bigKey(c, { len, col: mix(C.stone, C.linen, 0.3), dark: C.stone2 })}</g><g transform="rotate(38) scale(-1 1)">${bigKey(c, { len, col: C.sun })}</g>` +
    sheet().p(c.ribbon(c.qbez([-6, 4], [-22, 36], [-12, 62], 8), 4) + c.ribbon(c.qbez([6, 4], [20, 40], [14, 66], 8), 4), C.terracotta).p(c.cut(c.circ(0, 2, 8, 12), 0.3, 3), shade(C.terracotta, -0.1)).out();
}
/** a length of rope from (0,0) running right to (len, 0) with a slight sag (origin: its left end) */
export function ropeHalf(c, len = 160, { col = C.rope, w = 6, sag = 10 } = {}) {
  const pts = c.qbez([0, 0], [len / 2, sag], [len, 0], 14);
  let tw = '';
  for (let i = 1; i < pts.length - 1; i += 1) tw += c.ribbon([[pts[i][0] - 3, pts[i][1] - 2], [pts[i][0] + 3, pts[i][1] + 2]], 1.1);
  return sheet().p(c.ribbon(pts, w), col).x(tw, shade(col, -0.25), 'opacity=".6"').out();
}
/** a tied knot (origin centre) */
export function knot(c, { col = C.rope, r = 13 } = {}) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.8, 10, 0.12), 0.3, 3), col);
  s.x(c.ribbon(c.arc(0, 0, r * 0.6, r * 0.5, PI * 0.2, PI * 1.3, 8), 1.6) + c.ribbon([[-r * 0.2, -r * 0.6], [r * 0.4, r * 0.5]], 1.6), shade(col, -0.3), 'opacity=".7"');
  s.p(c.ribbon(c.qbez([r * 0.4, r * 0.5], [r * 0.9, r * 1.6], [r * 0.4, r * 2.4], 6), 4) + c.ribbon(c.qbez([-r * 0.4, r * 0.5], [-r * 1.0, r * 1.5], [-r * 0.8, r * 2.2], 6), 4), col);
  return s.out();
}

/* ================================================================== Jonah */
/** the great fish, facing left, mouth at the origin's left; its belly is a lighter window where Jonah sits.
 *  Returns { body, jaw } (jaw hinged at (−w*0.36, 6)). Origin: centre of the body. */
export function greatFish(c, { w = 300, h = 120, col = mix(C.lake3, C.storm, 0.35), belly = mix(C.lake, C.cream, 0.45) } = {}) {
  const s = sheet();
  const body = [[-w * 0.5, -h * 0.06], [-w * 0.42, -h * 0.34], [-w * 0.2, -h * 0.5], [w * 0.1, -h * 0.48], [w * 0.32, -h * 0.28], [w * 0.4, -h * 0.08], [w * 0.62, -h * 0.5], [w * 0.58, 0], [w * 0.64, h * 0.4], [w * 0.4, h * 0.1], [w * 0.26, h * 0.3], [0, h * 0.44], [-w * 0.3, h * 0.34], [-w * 0.44, h * 0.1]];
  s.p(c.cut(body, 1, 8), col);
  // fins, gill, eye
  s.p(c.cut([[-w * 0.02, -h * 0.46], [w * 0.1, -h * 0.74], [w * 0.2, -h * 0.4]], 0.4, 5) + c.cut([[-w * 0.06, h * 0.3], [w * 0.06, h * 0.56], [w * 0.14, h * 0.3]], 0.4, 5), shade(col, -0.15));
  s.x(c.ribbon(c.arc(-w * 0.28, 0, 12, h * 0.3, -PI * 0.4, PI * 0.4, 8), 2.2), shade(col, -0.3), 'opacity=".7"');
  s.x(c.poly(c.circ(-w * 0.38, -h * 0.2, 6, 10)), C.cream).x(c.poly(c.circ(-w * 0.385, -h * 0.2, 3, 8)), C.ink);
  // the belly window
  s.p(c.cut(c.ell(w * 0.02, h * 0.02, w * 0.2, h * 0.28, 24), 0.4, 5), belly);
  // scales
  let sc = '';
  for (let i = 0; i < 9; i++) { const x = w * c.rr(-0.1, 0.34), y = h * c.rr(-0.4, -0.3); sc += c.ribbon(c.arc(x, y, 7, 5, 0, PI, 5), 1.2); }
  s.x(sc, shade(col, 0.2), 'opacity=".5"');
  const jaw = sheet().p(c.cut([[0, 0], [-w * 0.12, h * 0.02], [-w * 0.1, h * 0.16], [w * 0.1, h * 0.26]], 0.5, 5), shade(col, -0.08)).out();
  return { body: s.out(), jaw };
}
/** a painted sea-and-sky board in a wooden frame (origin: top centre) — the Jonah plate */
export function seaBoard(c, w = 560, h = 300) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 8), C.wood2);
  s.p(c.cut(c.rect(-w / 2, 0, w, h * 0.46), 0.4, 8), mix(C.skyBlue, C.dawn, 0.35));
  s.p(c.cut([[-w / 2, h * 0.46], [w / 2, h * 0.46], [w / 2, h], [-w / 2, h]], 0.4, 8), C.lakeDeep);
  let wv = '';
  for (let x = -w / 2 + 20; x < w / 2 - 10; x += 46) wv += c.ribbon(c.arc(x, h * 0.46 + 4, 18, 6, PI, 2 * PI, 6), 2);
  s.x(wv, C.foam, 'opacity=".6"');
  // the shore on the right, with a hill
  s.p(c.cut([[w * 0.26, h * 0.46], [w * 0.34, h * 0.36], [w * 0.44, h * 0.3], [w / 2, h * 0.32], [w / 2, h * 0.52], [w * 0.3, h * 0.52]], 0.6, 6), C.sand2);
  return s.out();
}
/** a strip of stylised waves (front of the Jonah board): origin top-left of the strip, w wide */
export function waveFront(c, w = 560, h = 60, col = C.lake3) {
  const pts = [[0, h]];
  for (let x = 0; x < w - 1; x += w / Math.round(w / 40)) { const r = w / Math.round(w / 40) / 2; pts.push(...c.arc(x + r, 14, r, 14, PI, 2 * PI, 6)); }
  pts.push([w, h]);
  return sheet().p(c.cut(pts, 0.4, 6), col).x(c.ribbon(c.arc(w * 0.3, 16, 14, 8, PI * 1.1, PI * 1.9, 6), 2) + c.ribbon(c.arc(w * 0.7, 16, 14, 8, PI * 1.1, PI * 1.9, 6), 2), C.foam, 'opacity=".7"').out();
}
/** a small crescent-and-disc moon (origin centre) */
export function littleMoon(c, r = 16) {
  return `<path d="${c.cut(c.circ(0, 0, r, 18), 0.3, 3)}" fill="#fff8e6"/><path d="${c.cut(c.circ(r * 0.4, -r * 0.2, r * 0.86, 18), 0.3, 3)}" fill="${mix(C.skyBlue, C.dawn, 0.35)}"/>`;
}

/* ================================================================== weather & signs */
/** a small Temple facade (the Sadducees' sign): pediment and columns in gold; origin centre */
export function templeIcon(c, s = 1) {
  const g = sheet();
  const S2 = (p) => p.map(([x, y]) => [x * s, y * s]);
  g.p(c.cut(S2([[-24, 16], [24, 16], [24, 11], [-24, 11]]), 0.2, 4) + c.cut(S2([[-26, -8], [0, -22], [26, -8], [26, -4], [-26, -4]]), 0.2, 4), C.sun);
  let col = '';
  for (let i = 0; i < 5; i++) col += c.cut(S2([[-20 + i * 10, 11], [-20 + i * 10, -4], [-16 + i * 10, -4], [-16 + i * 10, 11]]), 0.1, 3);
  g.p(col, C.sun);
  return g.out();
}
/** a round weather plate: a sun on a red-gold evening sky (fair) or a storm on a red dawn (foul); origin centre */
export function weatherPlate(c, kind, r = 62) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 44), 0.5, 5), C.ochre);
  const skyC = kind === 'fair' ? '#f0a57e' : '#c98274';
  s.p(c.cut(c.circ(0, 0, r, 44), 0.5, 5), skyC);
  s.p(c.cut([[-r, r * 0.25], ...c.arc(0, r * 0.25, r, r * 0.3, PI, 0, 10).slice(1), [r, r * 0.25], ...c.arc(0, 0, r, r, 0.25, PI - 0.25, 12)], 0.5, 5), kind === 'fair' ? C.lake2 : C.waveStorm);
  if (kind === 'fair') {
    s.p(c.cut(c.circ(0, r * 0.2, r * 0.34, 20), 0.3, 4), C.sun);
    s.x(c.poly(c.circ(0, r * 0.2, r * 0.22, 16)), '#f7d48a');
  } else {
    s.p(c.cut(c.blob(-r * 0.2, -r * 0.18, r * 0.5, r * 0.24, 12, 0.2), 0.6, 5) + c.cut(c.blob(r * 0.26, -r * 0.3, r * 0.42, r * 0.2, 12, 0.2), 0.6, 5), C.storm);
    s.x(c.poly([[r * 0.06, -r * 0.08], [-r * 0.1, r * 0.2], [r * 0.02, r * 0.2], [-r * 0.08, r * 0.46], [r * 0.18, r * 0.12], [r * 0.06, r * 0.12], [r * 0.16, -r * 0.08]]), C.sun);
  }
  return s.out();
}

/* ================================================================== a life kept and a life poured out */
/** a small clay jar with a light inside (.glow fades); origin: base centre */
export function lightJar(c, { col = C.pot, h = 46 } = {}) {
  const s = sheet();
  s.p(c.cut([[-12, 0], [-18, -h * 0.4], [-14, -h * 0.72], [-8, -h * 0.82], [-9, -h], [9, -h], [8, -h * 0.82], [14, -h * 0.72], [18, -h * 0.4], [12, 0]], 0.4, 5), col);
  s.x(c.ribbon([[-15, -h * 0.5], [15, -h * 0.5]], 2), shade(col, -0.2), 'opacity=".6"');
  return `<circle class="glow" cx="0" cy="${-h - 10}" r="70" fill="url(#warm-glow)"/>${s.out()}<path class="flame" d="M0 ${-h - 2}C-6 ${-h - 8} -5 ${-h - 16} 0 ${-h - 28}C5 ${-h - 16} 6 ${-h - 8} 0 ${-h - 2}Z" fill="${C.lampFlame}"/>`;
}
/** a stream of light poured out (a ribbon from (0,0) arcing to (dx, dy)); origin at the jar's lip */
export function pourStream(c, dx = 140, dy = 90) {
  return `<path d="${c.ribbon(c.qbez([0, 0], [dx * 0.5, -40], [dx, dy], 14), (u) => 8 - u * 4)}" fill="${C.lampGlow}" opacity=".9"/>`;
}
/** a closed wooden chest (lid separate); origin base centre */
export function chest(c) {
  const base = sheet().p(c.cut(c.rect(-40, -44, 80, 44), 0.4, 6), C.wood2).p(c.ribbon([[-40, -24], [40, -24]], 4) + c.cut(c.rect(-6, -34, 12, 12), 0.2, 3), C.sun).out();
  const lid = sheet().p(c.cut([[0, 0], [82, 0], [78, -16], [4, -16]], 0.4, 5), shade(C.wood2, 0.1)).out();
  return { base, lid };
}
/** a basket of fruit (deeds bear fruit): n fruits heaped; origin bottom centre */
export function fruitBasket(c, n = 5, w = 44) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -26], [w / 2, -26], [w / 2 - 6, 0], [-w / 2 + 6, 0]], 0.4, 5), C.basket);
  s.x(c.ribbon([[-w / 2 + 4, -14], [w / 2 - 4, -14]], 1.6), shade(C.basket, -0.25), 'opacity=".7"');
  let f = '', f2 = '';
  for (let i = 0; i < n; i++) { const x = -w / 2 + 8 + (i % 4) * ((w - 16) / 3), y = -30 - Math.floor(i / 4) * 12; const p = c.cut(c.circ(x, y, 7, 10), 0.3, 3); if (i % 2) f += p; else f2 += p; }
  if (f) s.p(f, mix(C.terracotta, C.roseRobe, 0.35));
  if (f2) s.p(f2, C.wheat);
  return s.out();
}

export { C, CAST, person, sheet, shade, mix, pose, lerp, hanging, swing, makeCutter };
