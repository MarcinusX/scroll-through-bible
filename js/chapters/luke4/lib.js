// Luke 4 — the cast and cut-outs of this chapter. The wilderness, the tempter, the corner of the Temple and the
// summit above the clouds are Matthew 4's sets (the same places); the synagogue of Capernaum, Simon's house and
// his mother-in-law are Mark 1's. New here: the synagogue of Nazareth with its attendant, the scroll of Isaiah
// that unrolls sideways between its two rollers with a painted picture for every line, the town on its hill with
// the brow of the cliff, Elijah's widows and Elisha's lepers painted as old flats, the fever that is rebuked.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, crowd } from '../kit.js';
import { band, hillsWith, house, cypress, olive, rock, grass, flowers, town } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { sheaf } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';

export {
  desertSet, desertFront, TEMPTER, tempterAura, stoneLoaf, breadLoaf, addScroll, setScroll, lightShaft, goldSlip,
  pinnacleWall, royalPortico, valleyBelow, peakSet, cloudSea, kingdomPlate, KINGDOMS, whirl, pose3, bakeArms, tiltHead, folk4,
  DESERT, DUSK, NIGHT, DAWN, HIGH, GOLDEN, lakeShore,
} from '../matthew4/lib.js';
export {
  dove, flapWings, tallyStone, hand, headAt, voiceRings, hang2, sparkle, bubble, paperLabel, synagogueInterior, synagogueFacade,
  houseFacade, POSSESSED, MIL, LEPER, LEPER_HEALED, shadowShards, heatWave, tray, handLamp, crutch, mat, galileeMap, scrollParts, leperSpots,
  jug, breadBasket, signpost,
} from '../mark1/lib.js';
export { kf, moving, speech, thought, GLYPH, spark, wordSlip, scrollOpen, sabbathTag, physicianKit, loaf, cup, bowl, heart, candle, scrollRolled } from '../mark2/lib.js';
export { LOOK as L6, man, woman, workbench, saw, hammer, square, carpenterPlate, disc, labelTag, storyFrame, SEPIA, helmet, staff } from '../mark6/lib.js';
export { angel, crown, emptyBowl, globe } from '../mark8/lib.js';
export { rayBurst, hungWord, goldWord, hungPlate, radiance } from '../john1/lib.js';
export { jerusalem } from '../mark11/lib.js';
export { shadowPerson, stoneHeart } from '../mark3/lib.js';
export { hangAt } from '../matthew13/lib.js';
export { folk, group } from '../john6/lib.js';
export { hourglass } from '../mark15/lib.js';
export { jar } from '../mark5/lib.js';
export { WIDOW } from '../matthew11/lib.js';
export { JOSEPH, MARY } from '../matthew1/lib.js';
export { tr };

import { LOOK as L9 } from '../mark9/lib.js';
import { LEPER } from '../mark1/lib.js';
import { crowdPerson as cp } from '../../assets/people.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== the cast */
/** Elijah exactly as he stood on the mountain of the Transfiguration (Mark 9) */
export const ELIJAH = L9.elijah;
/** Elisha, who took up Elijah's mantle: the same clay mantle, a bald head, a dark beard */
export const ELISHA = { robe: mix(C.stone, C.sand2, 0.4), mantle: shade(C.clay, -0.08), hair: C.hair3, hairStyle: 'bald', beard: 'full', beardColor: C.hair3, skin: C.skin3, belt: C.leather };
/** Naaman, commander of the army of Aram: a Syrian officer's red cloak, grey with leprosy; and cleansed */
export const NAAMAN = { robe: mix(C.stone2, LEPER.robe, 0.5), mantle: mix(C.terracotta, LEPER.mantle, 0.55), hair: C.greyHair, hairStyle: 'short', beard: 'short', beardColor: '#8f8a80', skin: LEPER.skin, belt: C.leather };
export const NAAMAN_CLEAN = { robe: C.linen2, mantle: C.terracotta, hair: C.hair3, hairStyle: 'short', beard: 'short', beardColor: C.hair3, skin: C.skin3, belt: C.sun };
/** the widow of Zarephath */
export const SAREPTA = { robe: mix(C.plumRobe, C.stone, 0.35), hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair3, skin: C.skin3, beard: 'none', belt: null };
/** the attendant (hazzan) of the synagogue of Nazareth, who brings out the scroll and takes it back */
export const HAZZAN = { robe: C.linen2, mantle: C.dustyBlue, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin3, belt: null };
/** Jesus as the boy who grew up in Nazareth (for the memory plate) */
export const BOY_JESUS = { robe: C.linen, mantle: null, hair: C.hairJesus, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.jesusMantle };
/** a physician (for the proverb) */
export const PHYSICIAN = { robe: C.tealRobe, mantle: C.linen2, hairStyle: 'short', beard: 'short', hair: C.hair3, skin: C.skin2, belt: C.leather };

/* ================================================================== skies */
export const MORNING = ['#cadfdb', '#eee5cc', '#f7ead3'];
export const DAY = ['#c6ddd9', '#ecebd6', '#f6ead0'];
export const EVENING = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT2 = [C.night2, '#39407a', '#6a5f8e'];
export const DROUGHT = ['#e9c796', '#f2d5a4', '#f7e3bf'];

/* ================================================================== small helpers */
/** a person's markup with arms / head baked in, placed at (x, y) with scale s (for still groups) */
export function figure(c, o, { x = 0, y = 0, s = 1, flip = false, armF = 0, armB = 0, head = 0 } = {}) {
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})">${bake(person(c, o), armF, armB, head)}</g>`;
}
export function bake(m, armF = 0, armB = 0, head = 0) {
  if (armF) m = m.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-armF})">`);
  if (armB) m = m.replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB})">`);
  if (head) m = m.replace('<g class="headr">', `<g class="headr" transform="rotate(${head})">`);
  return m;
}
/** a man / a woman from the crowd (men never veiled) */
export function manO(c, extra = {}) { const o = cp(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanO(c, extra = {}) { return { ...cp(c), hairStyle: 'veil', beard: 'none', ...extra }; }

/* ================================================================== Isaiah's pictures */
/* six little paintings, one for each line of the prophecy; each is { base, act } drawn round (0, 0)
   in a box about 100 × 130; `act` is the part that moves when the line is read */

/** "The Spirit of the Lord is upon me": a small haloed figure with the dove coming down in light */
export function picSpirit(c) {
  const s = sheet();
  s.p(c.cut([[-48, 70], [48, 70], [44, 80], [-44, 80]], 0.4, 5), mix(C.sand, C.hillNear, 0.4));
  const fig = `<g transform="translate(0 72) scale(.56)">${person(c, { ...CAST.jesus, halo: false })}</g>`;
  const rays = `<path d="${c.poly([[-6, -56], [6, -56], [34, 40], [-34, 40]])}" fill="#fff3cf" opacity=".85"/><circle cx="0" cy="-4" r="40" fill="url(#halo-glow)" opacity=".9"/>`;
  const dv = sheet();
  dv.p(c.cut([[-18, 0], [-6, -5], [8, -5], [14, -1], [8, 4], [-8, 4]], 0.2, 3), '#fbf7ee');
  dv.p(c.cut([[-4, -2], [-16, -22], [2, -8]], 0.2, 3) + c.cut([[4, -2], [18, -22], [2, -8]], 0.2, 3), '#fbf7ee');
  dv.p(c.cut(c.circ(12, -4, 4.4, 8), 0.1, 2), '#fbf7ee');
  dv.x(c.poly([[16, -5], [21, -3], [16, -2]]), C.ochre);
  return { base: s.out() + rays + fig, act: `<circle r="22" fill="url(#halo-glow)"/>${dv.out()}` };
}
/** "…anointed me to bring good news to the poor": a horn of oil above, a beggar whose bowl receives a golden word */
export function picPoor(c) {
  const s = sheet();
  s.p(c.cut([[-48, 70], [48, 70], [44, 80], [-44, 80]], 0.4, 5), mix(C.sand, C.stone, 0.5));
  // a horn of oil, tipped
  s.p(c.cut([[-40, -58], [-34, -64], [-8, -52], [8, -40], [14, -30], [6, -28], [-4, -40], [-26, -50]], 0.3, 3), mix(C.wheat, C.wood3, 0.45));
  s.x(c.ribbon([[-30, -58], [-26, -52]], 2), shade(C.wood3, -0.2));
  const beggar = `<g transform="translate(-8 72) scale(.56)">${bake(person(c, { robe: mix(C.stone2, C.rock2, 0.4), mantle: null, hairStyle: 'wrap', veil: C.stone2, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin3, pose: 'sit' }), 60, 40, 4)}</g>`;
  const bowlM = sheet().p(c.cut([[-10, 0], [10, 0], [7, 7], [-7, 7]], 0.2, 2), C.pot).out();
  const slip = sheet().p(c.cut([[-12, -5], [12, -6], [13, 5], [-13, 6]], 0.3, 3), mix(C.halo, C.cream, 0.4)).x(c.ribbon([[-7, 0], [7, 0]], 1.4), C.sunDeep, 'opacity=".75"').out();
  return { base: s.out() + beggar + `<g transform="translate(24 38)">${bowlM}</g>`, act: `<circle r="18" fill="url(#warm-glow)"/>${slip}`, drop: `<path d="${c.cut([[0, -7], [4, 0], [2.4, 3.4], [-2.4, 3.4], [-4, 0]], 0.1, 2)}" fill="${C.sun}"/>` };
}
/** "…liberty to captives": a prison door swings open, the chain falls, a man steps into the light */
export function picCaptives(c) {
  const s = sheet();
  s.p(c.cut([[-48, -60], [48, -60], [48, 60], [-48, 60]], 0.5, 6), mix(C.rock2, C.stone2, 0.4));
  let blk = '';
  for (let y = -54; y < 56; y += 18) for (let x = -46 + ((y + 54) / 18 % 2) * 12; x < 44; x += 26) blk += c.cut(c.rect(x, y, 22, 14), 0.3, 5);
  s.x(blk, shade(C.rock2, -0.12), 'opacity=".6"');
  s.p(c.cut([[-24, 56], [-24, -18], ...c.arc(0, -18, 24, 22, PI, 2 * PI, 8), [24, 56]], 0.3, 4), '#fff1c4');
  const man = `<g transform="translate(2 58) scale(.44)">${bake(person(c, { robe: C.stone, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin3 }), 40, 150, -6)}</g>`;
  const door = sheet().p(c.cut([[0, 56], [0, -18], ...c.arc(24, -18, 24, 22, PI, 1.5 * PI, 5), [48, -40], [48, 56]], 0.3, 4), C.wood2);
  let bars = '';
  for (let x = 8; x < 46; x += 10) bars += c.ribbon([[x, -34], [x, 50]], 3);
  door.x(bars, shade(C.wood2, -0.3));
  const chain = sheet();
  let d = '';
  for (let i = 0; i < 5; i++) d += c.cut(c.ell(i * 9, 0, 5, 3.2, 8), 0.1, 2) + c.hole(c.ell(i * 9, 0, 3, 1.4, 6), 0.1, 2);
  chain.p(d, C.rock3);
  return { base: s.out() + `<circle cx="0" cy="10" r="46" fill="url(#warm-glow)"/>` + man, act: `<g transform="translate(-24 0)">${door.out()}</g>`, chainL: chain.out(), chainR: chain.out() };
}
/** "…recovery of sight to the blind": a man with a stick lifts his face; a closed eye opens */
export function picBlind(c) {
  const s = sheet();
  s.p(c.cut([[-48, 70], [48, 70], [44, 80], [-44, 80]], 0.4, 5), mix(C.sand, C.hillNear, 0.3));
  const look = { robe: C.mauve, hairStyle: 'wrap', veil: C.stone, hair: C.hair, beard: 'short', skin: C.skin3 };
  const blind = `<g transform="translate(-10 72) scale(.56)">${bake(person(c, { ...look, eyes: 'closed' }), 34, 0, 8)}</g><path d="${c.ribbon([[16, -4], [26, 72]], 2.4)}" fill="${C.wood}"/>`;
  const seeing = `<g transform="translate(-10 72) scale(.56)">${bake(person(c, look), 50, 150, -14)}</g>`;
  const eyeC = sheet().p(c.cut([...c.arc(0, 4, 22, 11, PI * 1.05, PI * 1.95, 10), ...c.arc(0, -4, 22, 11, PI * 0.05, PI * 0.95, 10)], 0.3, 3), C.skin2).x(c.ribbon(c.arc(0, -2, 18, 5, 0.1, PI - 0.1, 8), 1.6), C.inkSoft).out();
  const eyeO = sheet().p(c.cut([...c.arc(0, 9, 22, 18, PI * 1.08, PI * 1.92, 10), ...c.arc(0, -9, 22, 18, PI * 0.08, PI * 0.92, 10)], 0.3, 3), C.linen).p(c.cut(c.circ(0, 0, 7, 12), 0.1, 2), C.teal2).x(c.poly(c.circ(0, 0, 3.2, 8)), C.ink).x(c.poly(c.circ(2, -2, 1.4, 6)), C.star).out();
  return { base: s.out(), blind, seeing, eyeC: `<g transform="translate(0 -62)">${eyeC}</g>`, eyeO: `<g transform="translate(0 -62)"><circle r="30" fill="url(#warm-glow)"/>${eyeO}</g>` };
}
/** "…to set free the oppressed": a man bent under a yoke; the yoke breaks and he stands up */
export function picOppressed(c) {
  const s = sheet();
  s.p(c.cut([[-48, 70], [48, 70], [44, 80], [-44, 80]], 0.4, 5), mix(C.sand, C.stone, 0.4));
  const look = { robe: C.ochreRobe, hairStyle: 'short', hair: C.hair3, beard: 'short', skin: C.skin4, belt: C.leather };
  const bent = `<g transform="translate(0 72) scale(.56)"><g transform="rotate(24 0 -60)">${bake(person(c, look), 70, 90, 20)}</g></g>`;
  const free = `<g transform="translate(0 72) scale(.56)">${bake(person(c, look), 60, 160, -12)}</g>`;
  const half = (dir) => sheet().p(c.cut([[0, -4], [dir * 34, -8], [dir * 36, 2], [0, 5]], 0.3, 3), C.wood3).p(c.cut(c.ell(dir * 30, 5, 3, 9, 8), 0.2, 2), C.wood2).out();
  return { base: s.out(), bent, free, yokeL: half(-1), yokeR: half(1) };
}
/** "…the year of the Lord's favour": the shofar sounds under a round golden year, sheaves of the harvest */
export function picJubilee(c) {
  const s = sheet();
  s.p(c.cut([[-48, 70], [48, 70], [44, 80], [-44, 80]], 0.4, 5), mix(C.wheat, C.sand, 0.5));
  const sheaves = `<g transform="translate(-30 72) scale(.5)">${sheaf(c, 90)}</g><g transform="translate(30 72) scale(.5)">${sheaf(c, 90)}</g>`;
  const horn = sheet().p(c.cut([[-26, 20], [-20, 14], [-4, 12], [12, 2], [22, -12], [28, -10], [20, 8], [4, 22], [-20, 26]], 0.3, 3), mix(C.wheat, C.wood3, 0.4)).x(c.ribbon([[-18, 16], [-16, 25]], 1.6), shade(C.wood3, -0.2)).out();
  const sunM = sheet().p(c.cut(c.star(0, 0, 30, 24, 16, 0), 0.3, 3), C.sunDeep).p(c.cut(c.circ(0, 0, 22, 24), 0.3, 3), C.sun).x(c.ribbon(c.arc(0, 0, 14, 14, 0, PI * 2, 20), 2), shade(C.sun, 0.3)).out();
  return { base: s.out() + sheaves + horn, act: `<circle r="46" fill="url(#warm-glow)"/>${sunM}` };
}
export const PICS = [picSpirit, picPoor, picCaptives, picBlind, picOppressed, picJubilee];

/* ================================================================== the scroll of Isaiah */
/**
 * A scroll that unrolls sideways between two wooden rollers, hung on two strings. Pieces: the parchment
 * (origin: its centre; scale it with sx to unroll) and the two rollers (origin: roller centre).
 * cols: how many columns of writing; each column has lines of script above and below a picture window.
 */
export function isaiahScroll(c, { w = 740, h = 250, cols = 6, title } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 2], [w / 2, h / 2 + 1], [-w / 2, h / 2]], 0.6, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 8, -h / 2 + 10], [w / 2 - 8, -h / 2 + 9]], 1.2) + c.ribbon([[-w / 2 + 8, h / 2 - 10], [w / 2 - 8, h / 2 - 9]], 1.2), C.terracotta, 'opacity=".35"');
  const cw = (w - 40) / cols;
  let ln = '', seams = '';
  for (let k = 0; k < cols; k++) {
    const x0 = -w / 2 + 20 + k * cw, x1 = x0 + cw - 14;
    for (let i = 0; i < 2; i++) {
      const y = -h / 2 + 20 + i * 8;
      let x = x0 + 4;
      while (x < x1 - 4) { const l = Math.min(x1 - 4 - x, c.rr(6, 18)); ln += c.ribbon([[x, y + c.rr(-0.5, 0.5)], [x + l, y + c.rr(-0.5, 0.5)]], 1.8); x += l + c.rr(3, 6); }
    }
    for (let i = 0; i < 1; i++) {
      const y = h / 2 - 18;
      let x = x0 + 4;
      const end = i ? x1 - c.rr(10, 40) : x1 - 4;
      while (x < end) { const l = Math.min(end - x, c.rr(6, 18)); ln += c.ribbon([[x, y + c.rr(-0.5, 0.5)], [x + l, y + c.rr(-0.5, 0.5)]], 1.8); x += l + c.rr(3, 6); }
    }
    if (k) seams += c.ribbon([[x0 - 7, -h / 2 + 6], [x0 - 7, h / 2 - 6]], 1);
  }
  s.x(ln, C.ink, 'opacity=".5"');
  s.x(seams, shade(C.parchment, -0.2), 'opacity=".7"');
  const t = title ? `<text x="0" y="${-h / 2 - 14}" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.terracotta}">${title}</text>` : '';
  const roller = () => sheet()
    .p(c.cut(c.rect(-9, -h / 2 - 4, 18, h + 8), 0.3, 8), C.wood3)
    .p(c.cut(c.rect(-4, -h / 2 - 34, 8, 30), 0.2, 4) + c.cut(c.rect(-4, h / 2 + 4, 8, 30), 0.2, 4), C.wood2)
    .p(c.cut(c.ell(0, -h / 2 - 38, 11, 6, 10), 0.2, 3) + c.cut(c.ell(0, h / 2 + 38, 11, 6, 10), 0.2, 3), C.wood)
    .p(c.cut(c.rect(-15, -h / 2 - 8, 30, 9), 0.2, 4) + c.cut(c.rect(-15, h / 2 - 1, 30, 9), 0.2, 4), C.sun)
    .x(c.ribbon([[-4, -h / 2 + 4], [-4, h / 2 - 4]], 2.4), shade(C.wood3, 0.25), 'opacity=".6"').out();
  const string = `<path d="M0 -3000V${-h / 2 - 44}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  const colX = (k) => -w / 2 + 20 + k * cw + (cw - 14) / 2;
  return { sheet: s.out() + t, rollerL: string + roller(), rollerR: string + roller(), w, h, colX, winY: 3 };
}

/* ================================================================== the synagogue of Nazareth */
function arch(c, x, y, w, h) { return [[x - w / 2, y + h], [x - w / 2, y + w / 2], ...c.arc(x, y + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x + w / 2, y + h]]; }
/**
 * The synagogue of Nazareth (the same room as in Mark 6 and Matthew 13: two windows, the ark of the scrolls
 * behind the reading desk, lamps on chains, stone benches). Always cut with the same scissors, so it is the
 * same room in every scene. Returns { flicker(time), BACK, FRONT, FLOOR, JX, backRow(L), frontRow(L), bench(L), columns() }.
 */
export function nazSynagogue(S, { skyCols = ['#bcd6d6', '#e2ecdf', '#f3ead3'] } = {}) {
  const c = makeCutter('lk4-naz-synagogue');
  const BACK = 604, FRONT = 692, FLOOR = 650, JX = 800;
  sky(S, skyCols);
  const wall = S.layer({ par: 0.2, sh: 3 });
  const W = sheet();
  const wins = [440, 1160].map((x) => arch(c, x, 170, 100, 150));
  W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 660], [-1200, 660]], 1, 30) + wins.map((w) => c.hole(w, 0.5, 6)).join(''), mix(C.plaster, C.sand, 0.15));
  let blocks = '';
  for (let y = -200; y < 620; y += 46) for (let x = -1200 + (Math.round(y / 46) % 2 ? 60 : 0); x < 2800; x += 120) blocks += c.cut(c.rect(x + c.rr(0, 6), y + c.rr(0, 4), c.rr(90, 110), 38), 0.6, 10);
  W.x(blocks, C.plaster2, 'opacity=".4"');
  W.p([440, 1160].map((x) => c.ribbon([[x - 56, 322], [x + 56, 322]], 9) + c.ribbon([[x, 170], [x, 320]], 4)).join(''), C.wood2);
  let beams = '';
  for (let x = -600; x < 2400; x += 150) beams += c.cut(c.rect(x, 60, 22, 34), 0.3, 5);
  W.p(c.cut([[-1200, 40], [2800, 40], [2800, 64], [-1200, 64]], 0.5, 20) + beams, C.wood2);
  W.p(c.cut([[700, 612], [700, 420], ...c.arc(800, 420, 100, 64, PI, 2 * PI, 14), [900, 612]], 0.6, 8), C.wood);
  W.p(c.cut([[720, 606], [720, 430], ...c.arc(800, 430, 80, 50, PI, 2 * PI, 12), [880, 606]], 0.5, 8), C.dustyBlue);
  let pleat = '';
  for (let x = 732; x < 874; x += 15) pleat += c.ribbon([[x, 446], [x + c.rr(-2, 2), 604]], 3);
  W.x(pleat, shade(C.dustyBlue, -0.18), 'opacity=".6"');
  W.p(c.cut(c.star(800, 392, 15, 6.5, 6, 0), 0.3, 3), C.sun);
  W.p(c.cut([[-1200, 600], [2800, 600], [2800, 660], [-1200, 660]], 0.8, 14), C.plaster2);
  wall.add(W.out());
  const lampsL = S.layer({ par: 0.26, sh: 4 });
  const flames = [];
  [560, 1040].forEach((x, i) => {
    const y = 220 + i * 18;
    const s = sheet().p(c.cut([[-24, 0], [24, 0], [14, 12], [-14, 12]], 0.4, 4), C.sun).p(c.cut(c.ell(0, 0, 26, 6, 14), 0.3, 4), shade(C.sun, -0.2));
    lampsL.add(`<g transform="translate(${x} ${y})"><path d="M0 -1400V0M-18 0L0 -36L18 0" stroke="${C.inkSoft}" stroke-width="1.4" fill="none" opacity=".6"/><circle cy="-10" r="60" fill="url(#warm-glow)" opacity=".6"/>${s.out()}</g>`);
    [-12, 0, 12].forEach((dx) => { const el = lampsL.add(`<g transform="translate(${x + dx} ${y - 2})"><path d="M0 0C-5 -5 -4 -12 0 -20C4 -12 5 -5 0 0Z" fill="${C.lampFlame}"/></g>`); flames.push({ el, x: x + dx, y: y - 2, i: flames.length }); });
  });
  const floor = S.layer({ par: 0.45, sh: 3 });
  const F = sheet();
  F.p(c.cut([[-1200, 600], [2800, 600], [2800, 1700], [-1200, 1700]], 0.8, 30), mix(C.stone, C.sand, 0.4));
  let tiles = '';
  for (let y = 640; y < 1100; y += 40) for (let x = -600 + (Math.round(y / 40) % 2) * 40; x < 2200; x += 80) tiles += c.poly([[x, y - 12], [x + 14, y], [x, y + 12], [x - 14, y]]);
  F.x(tiles, shade(C.stone2, -0.06), 'opacity=".45"');
  [[-900, 670], [930, 2600]].forEach(([x0, x1]) => {
    F.p(c.cut([[x0, BACK - 8], [x1, BACK - 8], [x1, BACK + 60], [x0, BACK + 60]], 0.6, 12), C.stone2);
    F.p(c.cut([[x0, BACK - 14], [x1, BACK - 14], [x1, BACK - 4], [x0, BACK - 4]], 0.4, 12), shade(C.stone2, 0.18));
  });
  floor.add(F.out());
  return {
    c, BACK, FRONT, FLOOR, JX, flames, floor,
    flicker(time) { flames.forEach((f) => { const k = 1 + Math.sin(time * 11 + f.i * 1.7) * 0.1; pose(f.el, { x: f.x, y: f.y, sx: 1 / k, sy: k, r: Math.sin(time * 4 + f.i) * 5 }); }); },
    /** the same ten people on the back benches in every scene */
    backRow(L) { return crowd({ ...S, c: makeCutter('lk4-naz-back') }, L, [{ y: BACK - 8, s: 0.72, n: 5, x0: 380, x1: 660, pose: 'sit' }, { y: BACK - 8, s: 0.72, n: 5, x0: 940, x1: 1220, pose: 'sit' }]); },
    /** the reading desk (origin world) */
    lectern(L) {
      const lect = sheet();
      lect.p(c.cut([[906, FLOOR], [912, 566], [928, 566], [934, FLOOR]], 0.3, 5), C.wood2);
      lect.p(c.cut([[886, 560], [956, 574], [954, 586], [884, 572]], 0.4, 5), C.wood);
      return L.add(lect.out());
    },
    /** the front benches (drawn in front of the back row, behind the front-row people) */
    bench(L) {
      const bench = sheet();
      [[-900, 690], [910, 2600]].forEach(([x0, x1]) => {
        bench.p(c.cut([[x0, FRONT - 6], [x1, FRONT - 6], [x1, FRONT + 64], [x0, FRONT + 64]], 0.6, 12), C.stone);
        bench.p(c.cut([[x0, FRONT - 12], [x1, FRONT - 12], [x1, FRONT - 2], [x0, FRONT - 2]], 0.4, 12), shade(C.stone, 0.2));
      });
      return L.add(bench.out());
    },
    /** the same people on the front benches (5 left, 5 right): [{ o, x, i, seed }] (looks only) */
    frontLooks() {
      const r = makeCutter('lk4-naz-front');
      const L6x = [400, 468, 536, 604, 668], R6x = [952, 1020, 1088, 1156, 1224];
      return [...L6x.map((x, i) => ({ x, left: true, o: i % 2 ? womanO(r) : manO(r) })), ...R6x.map((x, i) => ({ x, left: false, o: i % 2 ? manO(r) : womanO(r) }))]
        .map((m, i) => ({ ...m, i, seed: r.rr(0, 6) }));
    },
    /** ceilTop: where the wooden ceiling begins (default: a sheet from far above; a phone passes a band, e.g. -150) */
    columns({ ceilTop = -1400 } = {}) {
      const fg = S.layer({ par: 0.9, sh: 8 });
      const colm = (x) => { const s = sheet(); s.p(c.cut(c.rect(x - 60, -1400, 120, 2600), 0.8, 20), C.stone2); s.p(c.cut(c.rect(x - 76, 900, 152, 40), 0.6, 10) + c.cut(c.rect(x - 70, 40, 140, 30), 0.6, 10), shade(C.stone2, -0.1)); s.x(c.ribbon([[x - 30, 80], [x - 30, 880]], 5) + c.ribbon([[x + 18, 80], [x + 18, 880]], 5), shade(C.stone2, -0.15), 'opacity=".5"'); return s.out(); };
      fg.add(colm(60) + colm(1540));
      fg.add(sheet().p(c.cut([[-1200, ceilTop], [2800, ceilTop], [2800, 50], [-1200, 62]], 0.8, 16), C.wood2).out());
      return fg;
    },
  };
}

/* ================================================================== Nazareth on its hill */
/** the hill Nazareth is built on: the town climbs it to the right, on the left the brow falls away in a cliff */
export function nazHill(c, { cliffX = 560, top = 560 } = {}) {
  const s = sheet();
  const pts = [[-900, 1800], [-900, 980], [cliffX - 260, 960], [cliffX - 170, 900], [cliffX - 120, 820], [cliffX - 60, 760], [cliffX - 34, 690], [cliffX - 10, top + 16], [cliffX + 30, top + 2], [cliffX + 200, top - 8], [cliffX + 420, top - 20], [cliffX + 640, top - 60], [cliffX + 820, top - 150], [cliffX + 980, top - 200], [2600, top - 210], [2600, 1800]];
  s.p(c.cut(pts, 1.4, 12), mix(C.hillNear, C.sand, 0.4));
  // the rock face of the cliff
  s.p(c.cut([[cliffX - 10, top + 16], [cliffX - 34, 690], [cliffX - 60, 760], [cliffX - 120, 820], [cliffX - 170, 900], [cliffX - 260, 960], [-900, 980], [-900, 1800], [cliffX - 40, 1800], [cliffX + 10, 1100], [cliffX + 20, 800]], 1.6, 10), mix(C.rock2, C.clay, 0.25));
  let cr = '';
  for (let i = 0; i < 12; i++) { const y = c.rr(top + 60, 1100), x = cliffX - 20 - (y - top) * 0.35 + c.rr(0, 60); cr += c.ribbon([[x, y], [x + c.rr(-10, 20), y + c.rr(30, 70)]], 2.4); }
  s.x(cr, shade(C.rock2, -0.3), 'opacity=".5"');
  s.p(c.cut([[cliffX - 10, top + 16], [cliffX + 30, top + 2], [cliffX + 34, top + 14], [cliffX - 6, top + 26]], 0.4, 4), shade(C.rock2, 0.2));
  return s.out();
}

/* ================================================================== a village synagogue */
/** a small synagogue seen from outside: a podium, a gabled front, columns, a dark doorway; origin: bottom centre */
export function smallSynagogue(c, { w = 240, h = 150, wall = C.cream, lit = false } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 20, -12, w + 40, 16), 0.4, 8), C.stone2);
  s.p(c.cut(c.rect(-w / 2, -h, w, h - 10), 0.5, 8), wall);
  let bl = '';
  for (let y = -h + 8; y < -24; y += 22) for (let x = -w / 2 + ((y / 22) % 2 ? 16 : 0); x < w / 2 - 30; x += 46) bl += c.cut(c.rect(x + 4, y, 38, 17), 0.3, 6);
  s.x(bl, C.plaster2, 'opacity=".5"');
  s.p(c.cut([[-w / 2 - 16, -h + 4], [0, -h - w * 0.26], [w / 2 + 16, -h + 4]], 0.5, 8), C.plaster);
  s.p(c.cut(c.star(0, -h - w * 0.1, 11, 5, 6, 0), 0.2, 3), C.sun);
  const door = [[-w * 0.13, -12], [-w * 0.13, -h * 0.5], ...c.arc(0, -h * 0.5, w * 0.13, w * 0.12, PI, 2 * PI, 8), [w * 0.13, -12]];
  s.p(c.cut(door, 0.3, 5), lit ? '#f7d58e' : C.soilDark);
  [-0.36, -0.2, 0.2, 0.36].forEach((f) => { s.p(c.cut(c.rect(w * f - 8, -h + 6, 16, h - 18), 0.3, 6), C.stone); });
  return (lit ? `<ellipse cx="0" cy="${-h * 0.4}" rx="${w * 0.4}" ry="${h * 0.5}" fill="url(#warm-glow)"/>` : '') + s.out();
}
/** a little hill village: a few houses (origin world) */
export function village(c, x, y, { n = 5, spread = 110, sc = 0.45, lit = false, wall = C.plaster, shadow = C.plaster2 } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const hx = x - spread / 2 + (spread * (i + c.rr(0.1, 0.6))) / n, w = c.rr(40, 64) * sc, h = c.rr(30, 46) * sc;
    out += house(c, hx, y - (i % 2) * 8 * sc - c.rr(0, 10) * sc, w, h, { stairs: false, lit: lit && c.chance(0.7), wall, shadow });
  }
  return out;
}

/* ================================================================== where He was brought up */
/** a round memory plate: the workshop in Nazareth — Joseph at the bench, the boy Jesus with a hammer, Mary; origin centre */
export function memoryPlate(c, r = 108) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 48), 0.5, 6), C.wood3);
  s.p(c.cut(c.circ(0, 0, r, 46), 0.5, 6), mix(C.plaster, C.parchment, 0.4));
  const a0 = Math.asin(60 / r);
  s.p(c.cut([...c.arc(0, 0, r - 1, r - 1, a0, PI - a0, 14)], 0.4, 6), mix(C.sand2, C.clay, 0.2));
  s.p(c.cut([[-70, -40], [-40, -40], [-40, 0], [-70, 0]], 0.3, 5), shade(C.plaster2, -0.05));
  s.p(c.ribbon([[-74, -40], [-36, -40]], 4) + c.ribbon([[-55, -40], [-55, 0]], 2), C.wood2);
  const bench = `<g transform="translate(-22 62) scale(.5)">${workbenchMini(c)}</g>`;
  const jos = figure(c, JOSEPH_L, { x: -62, y: 62, s: 0.44, armF: 70, armB: 60, head: 8 });
  const boy = figure(c, BOY_JESUS, { x: 22, y: 62, s: 0.32, flip: true, armF: 80, armB: 20, head: 6 });
  const mary = figure(c, MARY_L, { x: 66, y: 62, s: 0.42, flip: true, armF: 30, armB: 10, head: 4 });
  return `<circle r="${r * 1.5}" fill="url(#warm-glow)" opacity=".7"/>${s.out()}${bench}${jos}${boy}${mary}`;
}
function workbenchMini(c) {
  return sheet().p(c.cut([[-80, 0], [-70, -50], [-60, -50], [-68, 0]], 0.3, 4) + c.cut([[60, 0], [52, -50], [62, -50], [70, 0]], 0.3, 4), C.wood2)
    .p(c.cut([[-90, -50], [90, -50], [90, -62], [-90, -62]], 0.3, 6), C.wood).p(c.cut([[-60, -62], [50, -62], [50, -70], [-60, -70]], 0.3, 5), C.wood3).out();
}
import { JOSEPH as JOSEPH_L, MARY as MARY_L } from '../matthew1/lib.js';
