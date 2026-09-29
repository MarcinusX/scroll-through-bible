// Luke 6 — the cast and cut-outs of this chapter. The Sabbath grain field, the synagogue with the withered hand,
// David's holy bread are the sets of Matthew 12 / Mark 1–3 (the same places look the same). New here: the mountain
// where He prays all night (night falling, the moon going over, dawn) and chooses the Twelve; the level place at its
// foot where the crowds from Judea, Jerusalem and the coast of Tyre and Sidon come to Him; the great balance hung over
// the plain for the four blessings and the four woes, with a painted plate for each saying that turns from "now" to
// "then"; and the small painted flats of the Sermon on the Plain.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, town, house, sun, moon, cloud, stars, rock, grass, flowers, olive, cypress, bush, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { folk, group } from '../john6/lib.js';
import { figure, bake, manO, womanO } from '../luke4/lib.js';
import { TWELVE as T12 } from '../mark3/lib.js';

export {
  fieldSet, pluckStalk, wheatField, FP, phOpts, scribeOpts, WITHERED, witheredHand, PRIEST, LEVITE, parchSet, glow, qMark, bang, tick, crossX,
  tagText, plate, chest, crowdMarkup, shout, question, heart, bubble, strip, nameTag, sparkle, spark, handAt, headAt, shadowPerson, wisp,
  waxTablet, synagogueInterior, voiceRings, scalesParts, poseScales, rayBurst, radiance, hungWord, goldWord, davidPuppet, turban, breastplate,
  addToHead, addToBody, menorah, loaf, bowl, cup, jug, thought, speech, sabbathTag, kf, moving, stoneHeart, faceBits, withFace, SABBATH, NOON,
  WARM, GOLDEN, DUSK, NIGHT, PARCH, pose3, bakeArms, tiltHead, manOf, womanOf, sinKnot, flyBug,
} from '../matthew12/lib.js';
export { TWELVE, LOOK as L3, pharisee, scribe, card, tapeX, thunderCloud } from '../mark3/lib.js';
export { plank, speck, tweezers, magnifier, houseParts, stormKit, rainbow, windCurl, thistle, trellisVine, rottenFruit, worm, roots, scoop, heapBasket, grain, FOOL, WISE, PROPHET, TRUE_P, BRO_A, BRO_B, eyeAt, pointHand, openBowl, contentBasket } from '../matthew7/lib.js';
export { prophetCameo, sep, LOOK as L5, beam, heldLamp, wordCard, tagWord, oldTablet, goldAnswer } from '../matthew5/lib.js';
export { blindBand } from '../john5/lib.js';
export { stick } from '../matthew9/lib.js';
export { BLIND, LAME } from '../matthew11/lib.js';
export { coin, coinStack, ledger, cloak, dust, scrap, wordSlip, GLYPH, hand } from '../mark2/lib.js';
export { POSSESSED, handLamp, crutch, flame, shadowShards, hang2 } from '../mark1/lib.js';
export { storyFrame, labelTag, SEPIA, sheep } from '../mark6/lib.js';
export { orchardTree, fruit } from '../matthew3/lib.js';
export { ISAIAH, DAVID } from '../matthew1/lib.js';
export { LOOK as L9 } from '../mark9/lib.js';
export { figure, bake, manO, womanO, MORNING, DAY, EVENING, NIGHT2 } from '../luke4/lib.js';
export { folk, group } from '../john6/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== the cast */
/** the Twelve as Luke names them (Luke 6,14–16): the same looks as in Mark 3; "Judas son of James" is Mark's Thaddaeus */
const BY = Object.fromEntries(T12.map((m) => [m.k, m]));
export const LK12 = [
  ['peter', () => tr('Szymon', 'Simon')], ['andrew', () => tr('Andrzej', 'Andrew')], ['james', () => tr('Jakub', 'James')], ['john', () => tr('Jan', 'John')],
  ['philip', () => tr('Filip', 'Philip')], ['bartholomew', () => tr('Bartłomiej', 'Bartholomew')], ['matthew', () => tr('Mateusz', 'Matthew')], ['thomas', () => tr('Tomasz', 'Thomas')],
  ['jamesA', () => tr(['Jakub,', 'syn Alfeusza'], ['James,', 'son of Alphaeus'])], ['simonZ', () => tr(['Szymon', 'Gorliwy'], ['Simon', 'the Zealot'])],
  ['thaddaeus', () => tr(['Juda,', 'syn Jakuba'], ['Judas,', 'son of James'])], ['judas', () => tr(['Judasz', 'Iskariota'], ['Judas', 'Iscariot'])],
].map(([k, name], i) => ({ k, i, o: BY[k].o, name }));

/** the man who loves his enemy, and his neighbour who hates him (the flats of 6,27–35) */
export const HERO = { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
export const HERO_BARE = { ...HERO, mantle: null };
export const ENEMY = { robe: mix(C.plumRobe, C.storm, 0.35), mantle: mix(C.clay, C.soil, 0.35), hair: C.hair3, hairStyle: 'wild', beard: 'short', beardColor: C.hair3, skin: C.skin4, belt: C.ochre };
/** the "sinners" of 6,32–34: a tax collector and a rough companion */
export const TAXMAN = { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.sun };
export const ROUGH = { robe: mix(C.clayMantle, C.rock3, 0.3), hair: C.hair, hairStyle: 'wrap', veil: C.terracotta, veil2: shade(C.terracotta, -0.15), beard: 'full', skin: C.skin4, belt: C.leather };
/** Jeremiah (for the frieze of the prophets) */
export const JEREMIAH = { robe: mix(C.stone, C.sand2, 0.3), mantle: C.dustyBlue, hair: C.hair3, hairStyle: 'wrap', veil: C.stone2, veil2: C.dustyBlue, beard: 'full', beardColor: C.hair3, skin: C.skin3, belt: C.rope };

/* ================================================================== skies */
export const DAWN6 = ['#8f93b9', '#e6b9a6', '#f5d6b0'];
export const NIGHT6 = ['#141a3d', '#27306a', '#4d578f'];
export const DUSK6 = ['#6d6b9c', '#d69e90', '#f0c29d'];
export const PLAIN = ['#c7dfda', '#eeeed6', '#f8ebcf'];
export const AFTERNOON = ['#d0ddd2', '#f3e2bf', '#f8e7c7'];

/* ================================================================== small helpers */
const k_ = (k) => (k ? ` data-k="${k}"` : '');
/** a soft glow disc (flat, goes behind figures) */
export const halo = (r = 120, o = 1) => `<circle r="${r}" fill="url(#halo-glow)" opacity="${o}"/>`;
/** keyframes without easing */
export function kfl(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return va + (vb - va) * (b > a ? (t - a) / (b - a) : 1); }
  return keys[keys.length - 1][1];
}
/** a paper "=" (origin centre) */
export function equals(c, w = 34, col = C.ochre) {
  return sheet().p(c.ribbon([[-w / 2, -6], [w / 2, -6]], 6) + c.ribbon([[-w / 2, 7], [w / 2, 7]], 6), col).out();
}
/** a laurel wreath of thanks/credit (origin centre), empty or full of gold */
export function wreath6(c, r = 40, { gold = false } = {}) {
  const s = sheet();
  let lv = '';
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 9; i++) {
      const a = PI / 2 + side * (0.25 + i * 0.3);
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      lv += c.cut(c.ell(x, y, 9, 4.4, 10, a + side * 0.9), 0.3, 3);
    }
  }
  s.p(lv, gold ? C.sun : C.moss);
  s.p(c.ribbon([[-8, r + 2], [0, r - 4], [8, r + 2]], 4), gold ? C.terracotta : C.clay);
  return s.out();
}
/** a hung painted plate with two faces (now / then), both centred on its middle; returns { now, then } markup */
export function twoFaced(c, id, r, nowInner, thenInner, { rim = C.haloRim, rimThen, len = 0 } = {}) {
  const face = (inner, rimCol, key) => {
    const s = sheet().p(c.cut(c.circ(0, 0, r + 12, 48), 0.5, 6), rimCol).p(c.cut(c.circ(0, 0, r + 5, 48), 0.4, 6), C.cream);
    const ring = sheet().x(c.ribbon(c.arc(0, 0, r + 1, r + 1, 0, PI * 2, 48), 2.4), shade(rimCol, -0.15), 'opacity=".7"').out(false);
    return `${len ? `<path d="M0 ${-len}V${-r - 12}" stroke="${STRING}" stroke-width="1.6" fill="none"/>` : ''}${s.out()}<defs><clipPath id="${id}-${key}"><circle r="${r}"/></clipPath></defs><g clip-path="url(#${id}-${key})">${inner}</g>${ring}`;
  };
  return { now: face(nowInner, rim, 'a'), then: face(thenInner, rimThen || rim, 'b') };
}
/** a painted backdrop for a plate (local coords, radius ~r): sky, a hill line, ground at gy */
export function plateLand(c, r, { skyCol = C.skyBlue, far = C.hillFar, ground = C.hillNear, gy = r * 0.42 } = {}) {
  const s = sheet();
  s.p(c.poly(c.rect(-r - 10, -r - 10, 2 * r + 20, 2 * r + 20)), skyCol);
  s.p(c.cut([[-r - 10, gy - 4], ...Array.from({ length: 9 }, (_, i) => [-r + (i * 2 * r) / 8, gy - 22 - Math.sin(i * 1.3) * 12]), [r + 10, gy - 4], [r + 10, r + 10], [-r - 10, r + 10]], 0.8, 8), far);
  s.p(c.cut([[-r - 10, gy + 4], [-r * 0.3, gy - 4], [r * 0.4, gy + 2], [r + 10, gy - 6], [r + 10, r + 10], [-r - 10, r + 10]], 0.8, 8), ground);
  return s.out();
}

/* ================================================================== the mountain of prayer */
/**
 * The summit where He prays all night and chooses the Twelve: a night sky and a dawn sky (fade the dawn one in with
 * setDawn), stars, the moon that crosses the sky, the sun rising behind the summit, the lake and hills far below,
 * the rocky summit with a flat top (TOP) and a path climbing to it from the lower left.
 * Always cut with the same scissors. Returns handles and update(t, time, { dawn, moonU, sunUp }).
 */
export const SUMMIT = { X: 800, TOP: 640 };
export const SUMMIT_PATH = [[260, 980], [360, 900], [470, 850], [560, 790], [640, 740], [720, 690], [800, SUMMIT.TOP]];
export function summitSet(S, { startDawn = 0 } = {}) {
  const c = makeCutter('lk6-summit');
  const night = sky(S, NIGHT6, { name: 'n6' });
  const dawn = sky(S, DAWN6, { name: 'd6', rise: 0 });
  const day = sky(S, MORNING6, { name: 'm6', rise: 0 });
  dawn.layer.fade(startDawn); day.layer.fade(0);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 480, n: 150 }));
  const hangL = S.layer({ par: 0.04, sh: 5, rise: 0 });
  const moonEl = hanging(hangL, `${halo(110, 0.45)}${moon(c, 30)}`, { x: 300, y: -1500, len: 1400 });
  const sunL = S.layer({ par: 0.06, sh: 4, rise: 0 });
  const sunEl = sunL.add(`<g><circle r="220" fill="url(#warm-glow)" opacity=".85"/>${sun(c, 56, { rays: C.sunDeep, disc: '#f3b772', inner: '#f7cf94' })}</g>`);
  const far = S.layer({ par: 0.09, sh: 2 });
  far.add(band(c, { y: 520, amps: [12, 5, 2], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup);
  far.add(waterBand(c, { y: 548, color: mix(C.lake, C.duskViolet, 0.2), foamN: 12, bottom: 700 }).markup);
  const farNight = S.layer({ par: 0.09, sh: 1, flat: true });
  farNight.add(`<rect x="-3000" y="400" width="8000" height="400" fill="#1b2150"/>`);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const m1 = hillsWith(c, { y: 620, amps: [30, 12, 3], lens: [900, 320, 120], color: mix(C.hillMid, C.duskViolet, 0.15), trees: 16, treeColor: C.sage, treeH: 18 });
  mid.add(m1.markup);
  // the summit: a big rocky shoulder rising from the lower left to a flat top at the centre
  const peak = S.layer({ par: 0.4, sh: 4 });
  const pf = (x) => SUMMIT.TOP + Math.pow((x - 800) / 420, 2) * 110 + (x < 800 ? 0 : 12 * Math.min(1, (x - 800) / 400));
  const pts = [];
  for (let x = -900; x <= 2500; x += 14) pts.push([x, Math.min(1400, pf(x)) + c.rr(-1.5, 1.5)]);
  pts.push([2500, 1800], [-900, 1800]);
  const P = sheet();
  P.p(c.poly(pts), mix(C.hillNear, C.rock, 0.35));
  let cr = '';
  for (let i = 0; i < 16; i++) { const x = c.rr(200, 1400); cr += c.cut(c.blob(x, pf(x) + c.rr(40, 260), c.rr(20, 50), c.rr(10, 20), 9, 0.25), 0.6, 5); }
  P.p(cr, mix(C.rock2, C.hillNear, 0.3));
  // the path up
  P.x(c.ribbon(SUMMIT_PATH.map(([x, y]) => [x, y + 8]), (u) => 40 - u * 30), mix(C.sand, C.rock, 0.3));
  peak.add(P.out());
  peak.add(grass(c, { x0: -600, x1: 2200, y: 0, fn: (x) => pf(x) + 4, n: 60, h: 12, color: C.olive }));
  peak.add(rock(c, 880, SUMMIT.TOP + 10, 150, 48, C.rock2) + rock(c, 690, SUMMIT.TOP + 16, 90, 28, C.rock) + olive(c, 1220, pf(1220) + 12, 0.95) + cypress(c, 380, pf(380) + 10, 130));
  const peakNight = S.layer({ par: 0.4, sh: 1, flat: true });
  peakNight.add(`<path d="${c.poly(pts)}" fill="#161c44"/>`);
  return {
    c, pf, night, dawn, day, starL, hangL, moonEl, sunEl, far, farNight, mid, peak, peakNight,
    /** night 0..1 (dark tint over the land), dawn 0..1, day 0..1; moonU 0..1 across the sky; sunUp 0..1 */
    update(time, { dark = 1, dawnK = 0, dayK = 0, moonU = -1, sunUp = 0, starsK = dark } = {}) {
      dawn.layer.fade(dawnK); day.layer.fade(dayK);
      starL.fade(starsK);
      farNight.fade(dark * 0.55); peakNight.fade(dark * 0.5);
      const mu = Math.max(0, Math.min(1, moonU));
      pose(moonEl, { x: lerp(260, 1350, mu), y: 260 - Math.sin(mu * PI) * 170, r: Math.sin(time * 0.5) * 0.8, oy: 0, o: moonU < 0 || moonU > 1 ? 0 : 1 });
      pose(sunEl, { x: 800, y: lerp(760, 470, sunUp), s: 1, o: sunUp > 0.01 ? 1 : 0 });
    },
  };
}
export const MORNING6 = ['#c8dfdc', '#f1ead0', '#f9ead0'];

/* ================================================================== the level place */
/**
 * The plain at the foot of the mountain: sky, far hills and the mountain of prayer on the left, a level meadow; the
 * crowd as still sprites in three rows (optionally with a "reaching" twin for each), the seated disciples in front
 * (optional), and Jesus standing at the centre. Always cut with the same scissors.
 * Returns { sk, update(time), crowd:[{sp, alt, x, y, side, row, i}], dis:[{p, k, x, y, flip}], jesus, act, fx, JX, JY }.
 */
export const PL = { JX: 800, JY: 712, JS: 1.04, SEATY: 760 };
export const SEATS6 = [[-300, 'thomas', false], [-222, 'andrew', false], [-140, 'peter', false], [140, 'john', true], [222, 'james', true], [300, 'matthew', true]];
export function plainSet(S, { skyCols = PLAIN, crowd = true, twins = false, dis = true, sunAt = [1250, 150], mountain = true, jesus = true, rise = 1, behind = null } = {}) {
  const c = makeCutter('lk6-plain');
  const pc = makeCutter('lk6-plain-people');
  const sk = sky(S, skyCols);
  const extra = behind ? behind(S) : null;
  const hangL = S.layer({ par: 0.04, sh: 5, rise });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[520, 150, 190], [1010, 118, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));
  const far = S.layer({ par: 0.08, sh: 2, rise });
  const fb = band(c, { y: 440, amps: [14, 6, 2], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  if (mountain) {
    // the mountain of prayer, behind on the left
    const mp = [];
    for (let x = -900; x <= 900; x += 14) mp.push([x, 460 - 190 * Math.exp(-Math.pow((x - 120) / 230, 2)) - 30 * Math.exp(-Math.pow((x - 330) / 120, 2)) + c.rr(-1.2, 1.2)]);
    mp.push([900, 900], [-900, 900]);
    const ms = sheet().p(c.poly(mp), mix(C.hillMid, C.sage2, 0.3));
    let tr_ = '';
    for (let i = 0; i < 16; i++) { const x = c.rr(-80, 420), y = 460 - 190 * Math.exp(-Math.pow((x - 120) / 230, 2)) + c.rr(14, 80); tr_ += c.cut(c.blob(x, y, c.rr(7, 11), c.rr(5, 8), 8, 0.2), 0.3, 3); }
    ms.p(tr_, mix(C.sage, C.hillMid, 0.3));
    ms.x(c.ribbon([[380, 470], [300, 420], [220, 360], [150, 300], [120, 276]], 5), mix(C.sand, C.hillMid, 0.4), 'opacity=".8"');
    far.add(ms.out());
  }
  far.add(town(c, { x: 1320, y: fb.fn(1320) + 12, n: 6, spread: 220, sc: 0.4 }));
  const mid = S.layer({ par: 0.16, sh: 3, rise });
  const mh = hillsWith(c, { y: 510, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 18 });
  mid.add(mh.markup);
  const G = S.layer({ par: 0.3, sh: 3, rise });
  const gfn = c.wave(566, [3, 1.5], [800, 200]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 0.8), mix(C.hillNear, C.sand, 0.3)).out());
  G.add(olive(c, 130, 580, 0.9) + olive(c, 1500, 584, 0.8) + palm(c, 1640, 590, 230));
  G.add(flowers(c, { x0: -200, x1: 1800, y: 600, n: 26, h: 12, fn: (x) => gfn(x) + 40 }));
  /* the crowd, in three rows, as still sprites */
  const crowdL = crowd ? S.layer({ par: 0.34, sh: 4, rise }) : null;
  const CR = [];
  if (crowd) {
    const ROWS = [
      { y: 604, s: 0.5, xs: [300, 430, 560, 690, 910, 1040, 1170, 1300] },
      { y: 634, s: 0.58, xs: [240, 380, 520, 660, 940, 1080, 1220, 1360] },
      { y: 668, s: 0.66, xs: [200, 350, 500, 1100, 1250, 1400] },
    ];
    ROWS.forEach((row, r) => row.xs.forEach((x, i) => {
      const side = x < 800 ? -1 : 1;
      const mem = Array.from({ length: 4 }, (_, k) => ({ x: (k - 1.5) * 32 + pc.rr(-5, 5), y: pc.rr(-5, 5), s: 1, flip: side > 0, o: folk(pc), head: pc.rr(-6, 2), armF: pc.rr(0, 24), armB: pc.rr(0, 12) }));
      const calm = mem.map((m) => ({ ...m }));
      const reach = mem.map((m, k) => ({ ...m, armF: 80 + pc.rr(0, 40), armB: k % 2 ? 130 + pc.rr(0, 30) : 40, head: -8 }));
      const draw = (ms) => `<g transform="scale(${row.s})">${stillGroup(pc, ms)}</g>`;
      const sp = crowdL.sprite(draw(calm), x, row.y);
      const alt = twins ? crowdL.sprite(draw(reach), x, row.y) : null;
      if (alt) alt.set({ x, y: row.y, s: 1, o: 0 });
      CR.push({ sp, alt, x, y: row.y, side, row: r, i: CR.length });
    }));
  }
  const act = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 5 });
  const aura = jesus ? act.add(`<g opacity=".5">${halo(160, 1)}</g>`) : null;
  const DIS = dis ? SEATS6.map(([dx, k, flip], i) => ({ k, i, x: PL.JX + dx, y: PL.SEATY + (i % 3 === 1 ? 6 : 0), flip, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[k], pose: 'sit' }))) })) : [];
  const J = jesus ? S.puppet(act.add(person(c, { ...CAST.jesus }))) : null;
  const front = S.layer({ par: 0.85, sh: 6, rise });
  front.add(grass(c, { x0: -800, x1: 2400, y: 900, n: 70, h: 26, color: C.moss }) + bush(c, 60, 960, 240, C.sage, C.moss) + bush(c, 1560, 970, 240, C.moss, C.sage));
  return {
    c, pc, sk, extra, hangL, sunEl, far, mid, G, gfn, crowdL, crowd: CR, act, fx, dis: DIS, jesus: J, aura, front,
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 22, cl.y, time, 1.2, 0.6, cl.i));
    },
    /** the seated disciples, facing Jesus (extra(d) → overrides) */
    seat(time, extra = () => ({})) {
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.9, flip: d.flip, armF: 20, armB: 10, head: -4, blink: blinkAt6(time, d.seed), ...extra(d) }));
    },
  };
}
import { blinkAt } from '../../assets/people.js';
const blinkAt6 = blinkAt;
/** a still group of people with baked arms/heads (members [{x, y, s, flip, o, head, armF, armB}]) */
export function stillGroup(c, members) {
  return members.slice().sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${bake(person(c, m.o), m.armF || 0, m.armB || 0, m.head || 0)}</g>`).join('');
}

/* ================================================================== the great balance of the blessings and the woes */
/**
 * A great balance hung over the plain: its beam pivots at (BAL.X, BAL.Y); from each end a wooden rod hangs, and from
 * each rod two rows of two plates (slots). The blessings hang on the left, the woes on the right.
 * BAL.slot(side, i, tilt) → [x, y] of a plate's centre when the beam is turned by tilt degrees.
 */
export const BAL = {
  X: 800, Y: 222, ARM: 244, ROD: 60, SLOT_S: 0.42,
  // plates: row 1 hangs 118 below the beam end, row 2 another 104 below; ±60 from the rod's middle
  slot(side, i, tilt = 0) {
    const r = (tilt * PI) / 180;
    const ex = this.X + side * Math.cos(r) * this.ARM, ey = this.Y + side * Math.sin(r) * this.ARM;
    const dx = (i % 2 ? 1 : -1) * 56, dy = 118 + (i >> 1) * 104;
    return [ex + dx, ey + dy];
  },
  end(side, tilt = 0) { const r = (tilt * PI) / 180; return [this.X + side * Math.cos(r) * this.ARM, this.Y + side * Math.sin(r) * this.ARM]; },
};
export function balanceParts(c) {
  const col = mix(C.ochre, C.wood3, 0.3);
  const beam = sheet()
    .p(c.cut([[-BAL.ARM - 10, -7], [-40, -9], [0, -16], [40, -9], [BAL.ARM + 10, -7], [BAL.ARM + 10, 7], [0, 9], [-BAL.ARM - 10, 7]], 0.4, 10), col)
    .p(c.cut(c.circ(-BAL.ARM, 0, 10, 12), 0.2, 3) + c.cut(c.circ(BAL.ARM, 0, 10, 12), 0.2, 3), shade(col, -0.2))
    .p(c.cut(c.circ(0, 0, 16, 16), 0.3, 3), C.sun)
    .x(c.ribbon([[-BAL.ARM + 20, -2], [BAL.ARM - 20, -2]], 1.4), shade(col, 0.3), 'opacity=".6"').out();
  const pivot = `<path d="M0 -1800V-14" stroke="${STRING}" stroke-width="1.6" fill="none"/>${sheet().p(c.cut([[-22, -30], [22, -30], [0, -6]], 0.3, 4), shade(col, -0.25)).out()}`;
  const rod = `<path d="M0 0V${BAL.ROD}" stroke="${STRING}" stroke-width="1.6" fill="none"/>${sheet().p(c.cut([[-70, BAL.ROD - 5], [70, BAL.ROD - 5], [70, BAL.ROD + 5], [-70, BAL.ROD + 5]], 0.3, 8), C.wood2).p(c.cut(c.circ(-66, BAL.ROD, 5, 8), 0.2, 2) + c.cut(c.circ(66, BAL.ROD, 5, 8), 0.2, 2), C.ochre).out()}`;
  return { beam, pivot, rod };
}
/** add the balance to layer L; returns { set(tilt, o) } that places beam, pivot and both rods */
export function addBalance(L, c) {
  const P = balanceParts(c);
  const pivot = L.add(`<g>${P.pivot}</g>`);
  const rods = [-1, 1].map((side) => ({ side, el: L.add(`<g>${P.rod}</g>`) }));
  const beam = L.add(`<g>${P.beam}</g>`);
  return {
    set(tilt = 0, { y = BAL.Y, o = 1 } = {}) {
      pose(pivot, { x: BAL.X, y, o });
      pose(beam, { x: BAL.X, y, r: tilt, o });
      rods.forEach((r) => { const [ex, ey] = BAL.end(r.side, tilt); pose(r.el, { x: ex, y: ey + (y - BAL.Y), o }); });
    },
  };
}
/** plate strings: from the rod (row 0) or from the plate above (row 1); drawn with the plate (origin: plate centre) */
export function plateString(i, r) {
  return `<path d="M0 ${-r - 40}V${-r - 12}" stroke="${STRING}" stroke-width="${(1.6 / BAL.SLOT_S).toFixed(1)}" fill="none"/>`;
}
/** a long string from the flies down to a plate's top (origin: the plate's top) */
export const longString = `<path d="M0 -2200V0" stroke="${STRING}" stroke-width="1.6" fill="none"/>`;

/* ================================================================== the paintings of the blessings and the woes */
/* each painting is drawn round (0, 0) inside a plate of radius R (big: it is shown large, then shrunk into its slot) */
export const R6 = 104;
const POORMAN = { robe: mix(C.stone2, C.sand2, 0.35), hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };
const WEEPER = { robe: C.dustyBlue, hairStyle: 'veil', veil: mix(C.indigo, C.dustyBlue, 0.45), veil2: C.indigo, beard: 'none', skin: C.skin };
const RICHMAN = { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.ochre, beard: 'full', skin: C.skin2, belt: C.sun };
const REVELLER = { robe: C.roseRobe, mantle: C.ochreRobe, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.sun };
const FAVOURITE = { robe: C.tealRobe, mantle: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin, belt: C.ochre };
const GREY = (o) => ({ ...o, robe: mix(o.robe, C.stone2, 0.6), mantle: o.mantle ? mix(o.mantle, C.stone2, 0.6) : null, veil: o.veil ? mix(o.veil, C.stone2, 0.5) : o.veil, belt: o.belt ? mix(o.belt, C.stone2, 0.6) : null });
const tears = (c, x, y) => `<path d="${c.cut([[x, y], [x + 3, y + 7], [x, y + 10], [x - 3, y + 7]], 0.1, 2) + c.cut([[x + 5, y + 12], [x + 8, y + 19], [x + 5, y + 22], [x + 2, y + 19]], 0.1, 2)}" fill="#bfe0ee"/>`;
const joyLines = (c, x, y, r = 30, col = C.ochre) => { let d = ''; for (let i = 0; i < 7; i++) { const a = -PI * (0.1 + i * 0.13); d += c.ribbon([[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)]], 3); } return `<path d="${d}" fill="${col}"/>`; };
const rainLines = (c, x0, x1, y0, y1, n = 20) => { let d = ''; for (let i = 0; i < n; i++) { const x = c.rr(x0, x1), y = c.rr(y0, y1); d += c.ribbon([[x, y], [x - 5, y + 16]], 1.6); } return `<path d="${d}" fill="#dfe6f0" opacity=".85"/>`; };
function coinsHeap(c, n = 9) { let s = ''; for (let i = 0; i < n; i++) s += `<g transform="translate(${c.rr(-22, 22).toFixed(1)} ${(-c.rr(0, 14)).toFixed(1)})">${sheet().p(c.cut(c.circ(0, 0, 6, 10), 0.2, 2), C.sun).x(c.poly(c.circ(-1.5, -1.5, 1.4, 6)), C.star).out()}</g>`; return s; }
function coffer(c, { open = true, full = true, grey = false } = {}) {
  const wood = grey ? mix(C.wood, C.stone2, 0.5) : C.wood, band = grey ? C.rock3 : C.sun;
  const s = sheet();
  if (open) s.p(c.cut([[-34, -44], [34, -44], [30, -62], [-30, -62]], 0.3, 4), shade(wood, 0.1));
  s.p(c.cut(c.rect(-34, -40, 68, 40), 0.4, 5), wood);
  s.p(c.cut(c.rect(-34, -40, 68, 6), 0.2, 5) + c.cut(c.rect(-24, -40, 6, 40), 0.2, 4) + c.cut(c.rect(18, -40, 6, 40), 0.2, 4), band);
  return (full && open ? `<g transform="translate(0 -38)">${coinsHeap(c, 12)}</g>` : '') + s.out() + (open && !full ? `<path d="${c.poly(c.rect(-30, -42, 60, 4))}" fill="${shade(wood, -0.4)}"/>` : '');
}
function table(c, w = 90, col = C.wood) {
  return sheet().p(c.cut([[-w / 2, -30], [w / 2, -30], [w / 2, -24], [-w / 2, -24]], 0.3, 5), col).p(c.cut(c.rect(-w / 2 + 6, -24, 6, 24), 0.2, 3) + c.cut(c.rect(w / 2 - 12, -24, 6, 24), 0.2, 3), shade(col, -0.2)).out();
}
function feast(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(-18, -32, 16, 12, PI, 2 * PI, 10)], 0.3, 3), C.clay);       // a roast
  s.p(c.cut(c.ell(-18, -33, 18, 4, 10), 0.2, 3), C.pot);
  let g = '';
  for (let i = 0; i < 7; i++) g += c.cut(c.circ(14 + (i % 3) * 5, -40 + Math.floor(i / 3) * 5, 3.2, 8), 0.1, 2);
  s.p(g, C.plumRobe);
  s.p(c.cut([[28, -30], [36, -30], [34, -46], [30, -46]], 0.2, 3), C.sun);
  s.p(c.cut([...c.arc(0, -32, 10, 7, PI, 2 * PI, 8)], 0.2, 3), C.wheat2);
  return s.out();
}
function garland(c, r = 12) { let d = ''; for (let i = 0; i < 9; i++) { const a = PI * (1 + i / 8); d += c.cut(c.ell(Math.cos(a) * r, Math.sin(a) * r * 0.5, 4, 2.4, 8, a), 0.2, 2); } return `<path d="${d}" fill="${C.leaf}"/>`; }
function goldenGate(c, w = 70, h = 110) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 12, 0], [-w / 2 - 12, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2 + 12, w / 2 + 12, PI, 2 * PI, 14), [w / 2 + 12, 0]], 0.4, 5) + c.hole([[-w / 2, 0], [-w / 2, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [w / 2, 0]], 0.3, 5), mix(C.sun, C.ochre, 0.35));
  s.p(c.cut(c.star(0, -h - 12, 9, 4, 6, 0), 0.2, 3), C.sun);
  return `<path d="${c.poly([[-w / 2, 0], [-w / 2, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [w / 2, 0]])}" fill="#fff3cf"/><circle cx="0" cy="${-h / 2}" r="${w}" fill="url(#halo-glow)"/>${s.out()}`;
}
function starCrown(c, r = 16) {
  return `<circle r="${r * 2.2}" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, r, r * 0.46, 8, -PI / 2), 0.3, 3), C.sun).p(c.cut(c.circ(0, 0, r * 0.34, 10), 0.2, 2), C.star).out()}`;
}
function darkWords(c, n = 5) {
  let d = '';
  for (let i = 0; i < n; i++) { const x = c.rr(-20, 30), y = c.rr(-30, 10); d += c.cut(c.star(x, y, c.rr(8, 12), c.rr(3, 5), 5, c.rr(0, 3)), 0.4, 3); }
  return `<path d="${d}" fill="#3e3448"/>`;
}
function clapHands(c, x, y) { return `<path d="${c.cut(c.ell(x - 4, y, 4, 6, 8, -0.4), 0.2, 2) + c.cut(c.ell(x + 4, y, 4, 6, 8, 0.4), 0.2, 2)}" fill="${C.skin2}"/>`; }

/** the eight paintings: [{ now, then }] markup (without the plate), index 0–3 blessings, 4–7 woes */
export function paintings(c) {
  const R = R6, G = R * 0.46;
  const P = [];
  /* 0 — the poor: a beggar by a wall with an empty bowl → he stands in the open gate of the Kingdom, crowned with light */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.dusk, C.stone, 0.4), far: mix(C.hillFar, C.rock2, 0.4), ground: mix(C.sand2, C.rock2, 0.3), gy: G })
      + sheet().p(c.cut(c.rect(-R - 10, G - 110, 90, 112), 0.6, 8), mix(C.stone2, C.plaster2, 0.4)).out()
      + figure(c, { ...POORMAN, pose: 'sit' }, { x: -20, y: G + 8, s: 0.56, armF: 70, armB: 10, head: 14 })
      + `<g transform="translate(26 ${G - 36})">${sheet().p(c.cut([[-12, -8], [12, -8], [8, 2], [-8, 2]], 0.2, 3), C.clay).out()}</g>`,
    then: plateLand(c, R, { skyCol: mix(C.halo, C.dawn, 0.4), far: mix(C.hillFar, C.sun, 0.15), ground: mix(C.hillNear, C.wheat, 0.25), gy: G })
      + `<g transform="translate(0 ${G + 6})">${goldenGate(c, 76, 124)}</g>`
      + figure(c, POORMAN, { x: 0, y: G + 10, s: 0.56, armF: 60, armB: 150, head: -10 })
      + `<g transform="translate(2 ${G - 118})">${starCrown(c, 13)}</g>`,
  });
  /* 1 — the hungry: an empty bowl, an empty basket → a full table */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.sand, C.stone, 0.4), far: mix(C.dune, C.rock2, 0.3), ground: mix(C.sand2, C.dune, 0.3), gy: G })
      + figure(c, { ...POORMAN, robe: mix(C.stone2, C.dustyBlue, 0.3), hair: C.hair3, pose: 'kneel' }, { x: -14, y: G + 10, s: 0.56, armF: 80, armB: 30, head: 16 })
      + `<g transform="translate(28 ${G - 34})">${sheet().p(c.cut([[-14, -9], [14, -9], [9, 2], [-9, 2]], 0.2, 3), C.clay).out()}</g>`
      + `<g transform="translate(-68 ${G + 6}) scale(.8)">${basketEmpty(c)}</g>`,
    then: plateLand(c, R, { skyCol: mix(C.skyBlue, C.halo, 0.3), far: C.hillFar, ground: mix(C.hillNear, C.wheat, 0.3), gy: G })
      + figure(c, { ...POORMAN, robe: mix(C.stone2, C.dustyBlue, 0.3), hair: C.hair3, pose: 'sit' }, { x: -34, y: G + 10, s: 0.56, armF: 60, armB: 110, head: -8 })
      + `<g transform="translate(34 ${G + 10})">${table(c, 84)}<g transform="translate(-4 0)">${feast(c)}</g></g>`
      + joyLines(c, -30, G - 90, 24),
  });
  /* 2 — those who weep: a woman in the rain with her hands to her face → laughing in the sun, among flowers */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.storm, C.dustyBlue, 0.5), far: mix(C.hillFar, C.storm, 0.35), ground: mix(C.hillNear, C.storm, 0.25), gy: G })
      + rainLines(c, -R, R, -R, G, 26)
      + figure(c, WEEPER, { x: 0, y: G + 10, s: 0.58, armF: 150, armB: 120, head: 22 }) + tears(c, 14, G - 94),
    then: plateLand(c, R, { skyCol: mix(C.halo, C.skyBlue, 0.4), far: C.hillFar, ground: mix(C.hillNear, C.sage2, 0.3), gy: G })
      + `<g transform="translate(58 -58)">${sun(c, 22)}</g>`
      + flowers(c, { x0: -R, x1: R, y: G + 16, n: 16, h: 14 })
      + figure(c, WEEPER, { x: 0, y: G + 10, s: 0.58, armF: 120, armB: 160, head: -20 }) + joyLines(c, 4, G - 94, 28),
  });
  /* 3 — hated and cast out → leaping for joy, a great reward in heaven */
  const DISC = { robe: C.linen2, mantle: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.dusk, C.duskViolet, 0.5), far: mix(C.hillFar, C.duskViolet, 0.4), ground: mix(C.sand2, C.clay, 0.25), gy: G })
      + sheet().p(c.cut([[10, G + 4], [10, -70], [R + 10, -70], [R + 10, G + 4]], 0.5, 8), mix(C.plaster, C.plaster2, 0.5)).p(c.cut([[36, G + 4], [36, -30], ...c.arc(58, -30, 22, 20, PI, 2 * PI, 8), [80, G + 4]], 0.4, 5), C.wood2).out()
      + figure(c, DISC, { x: -44, y: G + 10, s: 0.56, flip: true, armF: 40, armB: 90, head: 12 })
      + `<g transform="translate(-4 ${G - 80})">${darkWords(c, 6)}</g>`,
    then: plateLand(c, R, { skyCol: mix(C.halo, C.dawn, 0.35), far: mix(C.hillFar, C.sun, 0.1), ground: mix(C.hillNear, C.wheat, 0.2), gy: G })
      + `<g transform="translate(0 -62)">${starCrown(c, 22)}</g>`
      + figure(c, DISC, { x: 0, y: G - 14, s: 0.56, armF: 150, armB: 160, head: -16 })
      + `<path d="${c.ribbon([[-24, G + 4], [24, G + 4]], 3)}" fill="${shade(C.hillNear, -0.2)}" opacity=".5"/>` + joyLines(c, 2, G - 110, 30),
  });
  /* 4 — the rich: on cushions by a full coffer → the coffer empty, the consolation already paid out */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.halo, C.peach, 0.4), far: mix(C.hillFar, C.peach, 0.2), ground: mix(C.sand, C.wheat, 0.35), gy: G })
      + sheet().p(c.cut([[-70, G + 6], [-66, G - 10], [0, G - 14], [4, G + 6]], 0.4, 5), C.terracotta).out()
      + figure(c, { ...RICHMAN, pose: 'sit' }, { x: -40, y: G + 2, s: 0.56, armF: 60, armB: 30, head: -6 })
      + `<g transform="translate(46 ${G + 6})">${coffer(c)}</g>`,
    then: plateLand(c, R, { skyCol: mix(C.stone, C.storm, 0.35), far: mix(C.hillFar, C.storm, 0.35), ground: mix(C.sand2, C.rock2, 0.4), gy: G })
      + figure(c, GREY(RICHMAN), { x: -30, y: G + 10, s: 0.56, armF: 70, armB: 50, head: 18 })
      + `<g transform="translate(40 ${G + 6})">${coffer(c, { full: false, grey: true })}</g>`,
  });
  /* 5 — the full: at a laden table → an empty bowl */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.halo, C.peach, 0.35), far: C.hillFar, ground: mix(C.sand, C.wheat, 0.3), gy: G })
      + figure(c, { ...REVELLER, pose: 'sit' }, { x: -44, y: G + 10, s: 0.6, armF: 80, armB: 20, head: 0 })
      + `<g transform="translate(34 ${G + 10})">${table(c, 96)}${feast(c)}</g>`,
    then: plateLand(c, R, { skyCol: mix(C.stone, C.storm, 0.4), far: mix(C.hillFar, C.storm, 0.35), ground: mix(C.sand2, C.rock2, 0.4), gy: G })
      + figure(c, { ...GREY(REVELLER), pose: 'sit' }, { x: -44, y: G + 10, s: 0.6, armF: 70, armB: 10, head: 18 })
      + `<g transform="translate(34 ${G + 10})">${table(c, 96, mix(C.wood, C.stone2, 0.5))}<g transform="translate(0 -30)">${sheet().p(c.cut([[-14, -9], [14, -9], [9, 2], [-9, 2]], 0.2, 3), mix(C.clay, C.stone2, 0.4)).out()}</g></g>`,
  });
  /* 6 — those who laugh now, cup raised → weeping in the rain */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.halo, C.peach, 0.3), far: C.hillFar, ground: mix(C.hillNear, C.wheat, 0.3), gy: G })
      + figure(c, { ...REVELLER, robe: C.ochreRobe, mantle: C.roseRobe, holdF: `<g transform="translate(-2 -6)">${sheet().p(c.cut([[-7, -14], [7, -14], [4, 0], [-4, 0]], 0.2, 2), C.sun).out()}</g>` }, { x: 0, y: G + 10, s: 0.6, armF: 150, armB: 60, head: -18 })
      + `<g transform="translate(2 ${G - 112})">${garland(c, 14)}</g>` + joyLines(c, 6, G - 96, 28, C.terracotta),
    then: plateLand(c, R, { skyCol: mix(C.storm, C.stone2, 0.4), far: mix(C.hillFar, C.storm, 0.4), ground: mix(C.hillNear, C.storm, 0.3), gy: G })
      + rainLines(c, -R, R, -R, G, 28)
      + figure(c, { ...GREY(REVELLER), robe: mix(C.ochreRobe, C.stone2, 0.6) }, { x: 0, y: G + 10, s: 0.6, armF: 150, armB: 120, head: 22 }) + tears(c, 14, G - 98),
  });
  /* 7 — praised by all: on a step, everyone clapping and throwing flowers → a false prophet in a borrowed fleece */
  P.push({
    now: plateLand(c, R, { skyCol: mix(C.halo, C.skyBlue, 0.3), far: C.hillFar, ground: mix(C.sand, C.stone, 0.4), gy: G })
      + sheet().p(c.cut(c.rect(-30, G - 16, 60, 22), 0.3, 5), C.stone2).out()
      + figure(c, FAVOURITE, { x: 0, y: G - 14, s: 0.52, armF: 70, armB: 150, head: -10 })
      + stillGroup(c, [{ x: -72, y: G + 18, s: 0.4, o: { ...FAVOURITE, robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.blushVeil, beard: 'none' }, armF: 110, armB: 120 }, { x: 70, y: G + 18, s: 0.4, flip: true, o: { ...FAVOURITE, robe: C.ochreRobe, mantle: null }, armF: 110, armB: 130 }])
      + clapHands(c, -54, G - 44) + clapHands(c, 52, G - 44)
      + `<g transform="translate(-34 -60)">${garland(c, 10)}</g><g transform="translate(38 -70)">${garland(c, 10)}</g>`,
    then: plateLand(c, R, { skyCol: mix(C.stone, C.storm, 0.35), far: mix(C.hillFar, C.storm, 0.35), ground: mix(C.sand2, C.rock2, 0.4), gy: G })
      + sheet().p(c.cut(c.rect(-30, G - 16, 60, 22), 0.3, 5), mix(C.stone2, C.rock3, 0.3)).out()
      + figure(c, GREY({ ...PROPHET_F }), { x: 0, y: G - 14, s: 0.52, armF: 70, armB: 150, head: -10 })
      + stillGroup(c, [{ x: -72, y: G + 18, s: 0.4, o: GREY({ ...FAVOURITE, robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.blushVeil, beard: 'none' }), armF: 110, armB: 120 }, { x: 70, y: G + 18, s: 0.4, flip: true, o: GREY({ ...FAVOURITE, robe: C.ochreRobe, mantle: null }), armF: 110, armB: 130 }]),
  });
  return P;
}
const PROPHET_F = { robe: mix(C.linen, C.cream, 0.4), fur: true, hair: C.hair3, hairStyle: 'wrap', veil: mix(C.linen, C.cream, 0.4), veil2: C.stone, beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: mix(C.storm2, C.plumRobe, 0.4) };
export function basketEmpty(c) {
  const s = sheet();
  s.p(c.cut([[-30, -30], [30, -30], [24, 0], [-24, 0]], 0.4, 5), C.basket);
  s.p(c.cut(c.ell(0, -30, 30, 5, 12), 0.3, 3), shade(C.basket, -0.35));
  let wv = '';
  for (let i = 1; i < 4; i++) wv += c.ribbon([[-30 + i * 2, -30 + i * 7.5], [30 - i * 2, -30 + i * 7.5]], 2);
  s.x(wv, shade(C.basket, -0.2), 'opacity=".7"');
  return s.out();
}

/**
 * The plates of the balance for one side (0 blessings, 1 woes): adds, for each of the four, its "now" and "then"
 * faces to L. Returns [{ i, now, then }]; place with placePlate().
 */
export function addPlates(S, L, c, side) {
  const P = paintings(c).slice(side * 4, side * 4 + 4);
  return P.map((p, i) => {
    const f = twoFaced(c, S.id(`pl${side}${i}`), R6, p.now, p.then, { rim: side ? C.ochre : C.haloRim, rimThen: side ? mix(C.rock3, C.stone2, 0.4) : C.sun });
    const str = plateString(i, R6);
    return { i, side, now: L.add(`<g>${str}${f.now}</g>`), then: L.add(`<g>${str}${f.then}</g>`) };
  });
}
/** place a plate: at (x, y) with scale s; flip 0 = "now" face, 1 = "then" face (turns about its string); o */
export function placePlate(pl, x, y, s, flip, o = 1, r = 0) {
  const k = Math.max(0, Math.min(1, flip));
  const a = Math.cos(k * PI);
  pose(pl.now, { x, y, s, sx: Math.max(0.03, a), r, o: k < 0.5 ? o : 0 });
  pose(pl.then, { x, y, s, sx: Math.max(0.03, -a), r, o: k >= 0.5 ? o : 0 });
}

/** a word plaque that hangs from the beam (origin: the hook on the beam); offset below by drop */
export function beamPlaque(c, text, { size = 20, drop = 36, fill = C.cream, ink = C.ink } = {}) {
  const ww = text.length * size * 0.5 + size * 1.4, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, drop], [ww / 2, drop - 1.5], [ww / 2 + 1.5, drop + hh], [-ww / 2 - 1, drop + hh + 1]], 0.5, 6), fill);
  return `<path d="M${-ww * 0.3} ${drop}L0 0L${ww * 0.3} ${drop}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}<text x="0" y="${(drop + hh / 2 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** the point on the beam dx from the pivot, with the beam turned by tilt */
export function beamAt(dx, tilt = 0, y = BAL.Y) { const r = (tilt * PI) / 180; return [BAL.X + Math.cos(r) * dx, y + Math.sin(r) * dx]; }
/**
 * Drive one plate: it drops in big at (bx, by) during drop=[a,b], turns from "now" to "then" during flip=[a,b],
 * then shrinks into its slot during shrink=[a,b]. Also places its long string (strEl) while it hangs big.
 */
export function drivePlate(pl, strEl, t, time, { bx, by, drop, flip, shrink, slot, big = 1 }, esf, easeBack) {
  const d = drop ? esf(t, drop[0], drop[1], easeBack) : 1;
  const f = flip ? esf(t, flip[0], flip[1]) : 0;
  const k = shrink ? esf(t, shrink[0], shrink[1]) : 0;
  const [sx, sy] = slot;
  const x = lerp(bx, sx, k), y = lerp(lerp(-500, by, d), sy, k), s = lerp(big, BAL.SLOT_S, k);
  const on = d > 0.001 ? 1 : 0;
  const sway = Math.sin(time * 0.8 + pl.i + pl.side * 2) * (1 - k) * 1.2;
  placePlate(pl, x, y, s, f, on, sway);
  pose(strEl, { x, y: y - (R6 + 12) * s, o: on * (1 - k) });
}
/** a small cloud of dark thrown words (origin centre) */
export const darkWordsCloud = (c) => darkWords(c, 7);
export { PROPHET_F };
/** a small portrait in an oval frame (sepia, or dull grey for the false prophets); name optional; origin centre */
export function cameo(c, id, look, name = '', { w = 74, h = 92, grey = false } = {}) {
  const oval = c.ell(0, 0, w / 2, h / 2, 30);
  const fr = sheet().p(c.cut(c.ell(0, 0, w / 2 + 7, h / 2 + 7, 30), 0.4, 5), grey ? mix(C.rock3, C.stone2, 0.3) : C.ochre).p(c.cut(oval, 0.3, 5), grey ? mix(C.stone, C.rock2, 0.4) : mix(C.parchment, C.dawn, 0.3)).out();
  const bust = `<g clip-path="url(#${id})"><g transform="translate(-2 ${h * 1.08}) scale(${h / 150})">${person(c, look)}</g></g>`;
  const ww = name.length * 7.6 + 24;
  const lab = name ? `<g transform="translate(0 ${h / 2 + 18})">${sheet().p(c.cut([[-ww / 2, -11], [ww / 2, -12], [ww / 2 + 2, 11], [-ww / 2 - 1, 12]], 0.3, 4), grey ? mix(C.stone2, C.cream, 0.4) : C.cream).out()}<text x="0" y="5" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${name}</text></g>` : '';
  return `<defs><clipPath id="${id}"><path d="${c.poly(oval)}"/></clipPath></defs>${sepT(fr + bust, grey ? 0.5 : 0.45, grey)}${lab}`;
}
import { tint } from '../mark13/lib.js';
const sepT = (m, k, grey) => tint(m, grey ? '#8e8a88' : '#c9ae86', k);
