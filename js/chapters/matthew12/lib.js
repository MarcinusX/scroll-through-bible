// Matthew 12 — the cast and cut-outs of this chapter: the Sabbath grain field, the synagogue of Mark 1, a town square
// in Galilee where Jesus answers the Pharisees, and the painted flats for the sayings (David and the holy bread, the
// priests in the Temple, the sheep in the pit, the bruised reed, the divided kingdom, the strong man, the two trees,
// Jonah and the great fish, Nineveh and the queen of the South, the empty house).
// Parallel drawings are reused from Mark 2 (grain field, the Sabbath tag, David's bread) and Mark 3 (Pharisees, the
// withered hand, stone hearts, the dove, the house cut open), so the same events look the same across the Gospels.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, sun, cloud, olive, cypress, bush, rock, grass, flowers, palm } from '../../assets/nature.js';
import { wheatStalk } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
import { wheatField } from '../mark2/lib.js';

export { pharisee, scribe, man, woman, witheredHand, stoneHeart, heart, tapeX, tapeCross, question, strip, bubble, dove, wisp, houseSection, tornPair, withFace, faceBits, sparkle, spark, nameTag, handAt, headAt, shadowPerson, silhouette, waxTablet, card, scrollRoll, TWELVE, LOOK as L3 } from '../mark3/lib.js';
export { kf, moving, wheatField, sabbathTag, speech, thought, GLYPH, scrollOpen, loaf, menorah, candle, turban, breastplate, circlet, addToHead, addToBody, plateDisc, garland, wordSlip, bowl, jug, cup } from '../mark2/lib.js';
export { synagogueInterior, voiceRings, hang2, POSSESSED, camel, walkCamel, crutch, mat, dove as dove1, flapWings } from '../mark1/lib.js';
export { ewe, sheepRig, onShoulders, shoulderLamb, WOOLS, pastureSet, foldParts } from '../john10/lib.js';
export { scalesParts, poseScales } from '../john8/lib.js';
export { lamb } from '../mark11/lib.js';
export { altar, puff, harp, throne, davidPuppet } from '../mark12/lib.js';
export { broom } from '../mark13/lib.js';
export { crown } from '../mark6/lib.js';
export { openBook } from '../john20/lib.js';
export { spirit, shadowCloak } from '../mark5/lib.js';
export { ziggurat } from '../matthew2/lib.js';
export { hungWord, goldWord, rayBurst, glowDisc, radiance } from '../john1/lib.js';
export { MARY, DAVID, ISAIAH } from '../matthew1/lib.js';
export { viper, orchardTree, fruit } from '../matthew3/lib.js';
export { rottenFruit, worm, eyeAt } from '../matthew7/lib.js';
export { hangAt, along, mob } from '../matthew8/lib.js';
export { capShore, folk, group, hillSet as hillSet6 } from '../john6/lib.js';
export { pose3, bakeArms, tiltHead };
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const SABBATH = ['#cfe1dc', '#f2e8cc', '#f8e9cf'];
export const NOON = ['#c3dcd8', '#eeecd6', '#f7ebcf'];
export const WARM = ['#d4dccf', '#f3e0bd', '#f8e6c6'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const JUDGE = ['#e9c98c', '#f5dcaa', '#faeac8'];
export const PARCH = [mix(C.parchment, C.dawn, 0.4), C.parchment, mix(C.cream, C.sand, 0.4)];
export const DESERT = ['#e2cfa6', '#f0dcb2', '#f6e4c0'];
export const SEA = ['#bcd6d6', '#e3ecdf', '#f3ead3'];
export const DEEP = ['#2c4d63', '#3f6a7c', '#5f8d95'];

/* ================================================================== the cast */
/** the disciples who walk with Him through the grain (Mark 2's four, plus Matthew and Thomas) */
export const DIS = ['peter', 'andrew', 'james', 'john', 'matthew', 'thomas'];
/** the man whose hand was withered (Mark 3's) */
export const WITHERED = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
/** the blind and mute possessed man, and the same man healed */
export const MUTE = { robe: mix(C.stone2, C.rock2, 0.4), mantle: null, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin3, belt: C.rope, eyes: 'closed' };
export const MUTE_OK = { ...MUTE, robe: mix(C.stone2, C.dustyBlue, 0.3), hairStyle: 'curly', eyes: 'open' };
/** a shepherd of Galilee (the sheep in the pit) */
export const SHEPHERD = { robe: C.ochreRobe, mantle: mix(C.wood3, C.sand2, 0.4), hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.clayMantle, beard: 'full', skin: C.skin3, belt: C.leather };
/** Jonah the prophet: a sea-blue mantle */
export const JONAH = { robe: C.linen2, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.skyVeil, veil2: C.teal2, beard: 'full', beardColor: C.hair3, skin: C.skin3, belt: C.rope };
/** the people of Nineveh in sackcloth */
export const SACK = mix(C.soil, C.rock3, 0.45);
/** Solomon in his glory and the queen of the South */
export const SOLOMON = { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.ochre };
export const QUEEN = { robe: mix(C.terracotta, C.roseRobe, 0.3), mantle: C.sun, hair: C.hair3, hairStyle: 'veil', veil: C.ochre, veil2: C.sunDeep, beard: 'none', skin: C.skin4, belt: C.sun };
/** the priest at the house of God (Ahimelech) and the priests in the Temple */
export const PRIEST = { robe: C.linen, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.terracotta };
export const LEVITE = { robe: C.linen, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.dustyBlue };
/** a man of the crowd (never veiled) / a woman */
export function manOf(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanOf(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }

/* ================================================================== small helpers */
/** a still crowd as one sprite: n people in rows; arms {F: [lo, hi], B: [lo, hi]}; the same seed gives the same people */
export function crowdMarkup(seed, n, { s = 0.7, spread = 44, rows = 2, flip = false, faceIn = 0, armF = [0, 30], armB = [0, 10], head = [-6, 4], pose: P = 'stand', dy = 18 } = {}) {
  const c = makeCutter(seed);
  const oc = makeCutter(seed + '-o');
  const per = Math.ceil(n / rows);
  const mem = Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / per), k = i % per;
    const o = crowdPerson(oc);
    const x = (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + oc.rr(-8, 8);
    const fl = faceIn ? x * faceIn > 0 : flip;
    return { x, y: r * dy + oc.rr(-3, 3), s: s * oc.rr(0.92, 1.05) * (1 + r * 0.06), flip: fl, head: oc.rr(head[0], head[1]), armF: oc.rr(armF[0], armF[1]), armB: oc.rr(armB[0], armB[1]), o: { ...o, pose: P } };
  });
  return pose3(c, mem);
}
/** a soft light disc (flat) */
export const glow = (r = 120, o = 1, id = 'warm-glow') => `<circle r="${r}" fill="url(#${id})" opacity="${o}"/>`;
/** a paper "?" (big), origin centre */
export function qMark(c, h = 60, col = C.terracotta) {
  const s = sheet();
  const hook = c.arc(0, -h * 0.22, h * 0.24, h * 0.24, PI * 1.02, PI * 2.5, 14);
  hook.push([0, h * 0.18]);
  s.p(c.ribbon(hook, h * 0.1), col);
  s.p(c.cut(c.circ(0, h * 0.36, h * 0.07, 10), 0.2, 3), col);
  return s.out();
}
/** a hand-cut "!" , origin centre */
export function bang(c, h = 50, col = C.terracotta) {
  return sheet().p(c.cut([[-h * 0.08, -h * 0.5], [h * 0.08, -h * 0.5], [h * 0.04, h * 0.2], [-h * 0.04, h * 0.2]], 0.3, 4) + c.cut(c.circ(0, h * 0.38, h * 0.07, 10), 0.2, 3), col).out();
}
/** a tick (✓) in green paper, origin centre */
export function tick(c, r = 20, col = C.moss) {
  return sheet().p(c.ribbon([[-r * 0.6, 0], [-r * 0.15, r * 0.45], [r * 0.7, -r * 0.55]], r * 0.28), col).out();
}
/** a cross-out (✗) in terracotta paper, origin centre */
export function crossX(c, r = 20, col = C.terracotta) {
  return sheet().p(c.ribbon([[-r * 0.6, -r * 0.6], [r * 0.6, r * 0.6]], r * 0.26) + c.ribbon([[-r * 0.6, r * 0.6], [r * 0.6, -r * 0.6]], r * 0.26), col).out();
}
/** words on a hanging cream strip (with its string) — origin: the strip's centre */
export function tagText(c, text, { size = 20, fill = C.cream, ink = C.ink, w, len = 0 } = {}) {
  const ww = w || String(text).length * size * 0.5 + size * 1.3, hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${len ? `<path d="M0 ${-len}V${-hh / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>` : ''}${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a round plate on a string with an icon and an optional word under it; origin: plate centre */
export function plate(c, icon, { r = 58, word = '', fill = C.cream, rim = C.haloRim, face = C.parchment, size = 16, len = 0 } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill).p(c.cut(c.circ(0, 0, r - 7, 32), 0.4, 5), face);
  const w = word ? `<text x="0" y="${r * 0.62}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${word}</text>` : '';
  return `${len ? `<path d="M0 ${-len}V${-r - 6}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>` : ''}${s.out()}<g transform="translate(0 ${word ? -8 : 0})">${icon}</g>${w}`;
}

/* ================================================================== the Sabbath field */
/**
 * The grain field of Mark 2, seen again: sky, sun and clouds on strings, far hills, a hill with olives, the back field
 * with the path (backF, slides while they walk), the people's layer at the path, the front band of wheat (frontF).
 * FP: feet on the path. Returns handles and update(time) + shift(dx).
 */
export const FP = 700;
export function fieldSet(S, { skyCols = SABBATH, walk = 0, sunAt = [1220, 150] } = {}) {
  const c = S.c;
  const fc = makeCutter('mt12-field');           // the same field in every scene
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(fc, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[430, 250, 190], [1000, 210, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(fc, w), { x, y, len: 800 }) }));
  const pad = walk ? walk + 200 : 0;
  const far = S.layer({ par: 0.1, sh: 2, pad: pad * 0.2 });
  far.add(hillsWith(fc, { y: 430, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, trees: 14, treeColor: C.sage2, treeH: 20, x0: -1400, x1: 3000 }).markup + town(fc, { x: 1340, y: 432, n: 5, spread: 200, sc: 0.42 }));
  const hills = S.layer({ par: 0.2, sh: 3, pad: pad * 0.4 });
  const h2 = band(fc, { y: 500, amps: [14, 6, 2], lens: [900, 300, 120], color: mix(C.hillMid, C.wheat, 0.35), x0: -1400, x1: 3000 });
  hills.add(h2.markup + olive(fc, 200, h2.fn(200) + 8, 0.7) + olive(fc, 1420, h2.fn(1420) + 8, 0.8) + olive(fc, 2100, h2.fn(2100) + 8, 0.6) + cypress(fc, 1560, h2.fn(1560) + 10, 90));
  const backF = S.layer({ par: 0.6, sh: 3, pad });
  backF.add(sheet().p(fc.cut([[-1600, 590], [3400, 590], [3400, 1700], [-1600, 1700]], 1, 30), mix(C.wheat2, C.dune, 0.4)).out());
  backF.add(wheatField(fc, { x0: -1600, x1: 3400, y: 606, h: 70, n: 300, color: shade(C.wheat2, -0.05), ear: C.wheat2 }));
  backF.add(wheatField(fc, { x0: -1600, x1: 3400, y: 648, h: 96, n: 280, color: C.wheat2, ear: C.wheat }));
  backF.add(sheet().p(fc.cut([[-1600, FP - 26], [3400, FP - 26], [3400, FP + 34], [-1600, FP + 34]], 1.2, 12), C.sand).out());
  return {
    c, fc, sk, hangL, sunEl, far, hills, backF,
    /** the front wheat (call after adding the people's layers) */
    front() {
      const frontF = S.layer({ par: 0.7, sh: 5, pad: pad * 1.2 });
      frontF.add(wheatField(fc, { x0: -1600, x1: 3400, y: 812, h: 116, n: 240, color: C.wheat2, ear: C.wheat, back: mix(C.wheat2, C.dune, 0.3) }));
      this.frontF = frontF;
      return frontF;
    },
    shift(dx) {
      far.shift(-dx * 0.15, 0); hills.shift(-dx * 0.35, 0); backF.shift(-dx, 0);
      if (this.frontF) this.frontF.shift(-dx * 1.15, 0);
    },
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 22, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}
/** one stalk of wheat that can be plucked: returns { el, ear, stem, ex0, ey0 } after L.add */
export function pluckStalk(L, c, h = 124) {
  const el = L.add(`<g>${wheatStalk(c, { h, color: C.wheat2, ear: C.wheat })}</g>`);
  const ear = el.querySelector('.ear');
  const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(ear.getAttribute('transform')) || [0, 0, -h];
  return { el, ear, stem: el.querySelector('.stem'), ex0: +m[1], ey0: +m[2] };
}

/* ================================================================== the town square */
/**
 * A square in a Galilean town, late morning: sky (+ an optional second sky to fade in), hills, a row of flat-roofed
 * houses with a gate, the paved square, a crowd (two sprites, left and right, with an "amazed" twin each), Jesus at
 * the centre on the low step of the well-house, disciples to the left, Pharisees and scribes to the right.
 */
export const SQ = { JX: 800, FEET: 704, DX: [560, 640], PX: [990, 1070, 1150] };
export function squareSet(S, { skyCols = NOON, sky2 = null, sunAt = [1230, 200], dis = ['peter', 'john'], ph = 3, crowd = true, rise = 1 } = {}) {
  const c = S.c;
  const q = makeCutter('mt12-square');
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5, rise });
  const sunEl = hanging(hangL, sun(q, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[560, 240, 180], [1040, 200, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(q, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2, rise });
  far.add(hillsWith(q, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.1), trees: 12, treeColor: C.sage2, treeH: 18 }).markup);
  // the houses round the square
  const mid = S.layer({ par: 0.18, sh: 3, rise });
  let hs = '';
  [[-420, 150, 110], [-250, 120, 150], [-110, 170, 120], [70, 130, 100], [210, 150, 130], [370, 120, 96], [1090, 140, 110], [1250, 160, 136], [1420, 120, 104], [1560, 150, 124], [1720, 130, 110], [1870, 160, 140]].forEach(([x, w, h]) => { hs += house(q, x, 590, w, h, { stairs: q.chance(0.5) }); });
  mid.add(hs + palm(q, 480, 596, 230) + cypress(q, 1060, 594, 150) + olive(q, 1700, 600, 0.9));
  // the gate of the town behind Jesus: a wide arch in a wall
  const gs = sheet();
  const GX = 800;
  gs.p(q.cut([[500, 594], [500, 470], [1100, 470], [1100, 594]], 0.6, 10) + q.hole([[GX - 70, 596], [GX - 70, 500], ...q.arc(GX, 500, 70, 56, PI, 2 * PI, 12), [GX + 70, 500], [GX + 70, 596]], 0.5, 6), mix(C.stone, C.sand, 0.3));
  let blocks = '';
  for (let y = 482; y < 590; y += 22) for (let x = 506 + ((y / 22) % 2) * 20; x < 1094; x += 44) if (Math.abs(x - GX) > 80 || y < 440) blocks += q.ribbon([[x, y], [x + 38, y]], 1);
  gs.x(blocks, shade(C.stone, -0.15), 'opacity=".6"');
  gs.p(q.cut([[490, 470], [1110, 470], [1110, 456], [490, 456]], 0.4, 8), C.stone2);
  gs.p(q.ribbon(q.arc(GX, 500, 74, 60, PI, 2 * PI, 12), 8), C.stone2);
  mid.add(`<g>${gs.out()}<path d="${q.poly([[GX - 66, 596], [GX - 66, 502], ...q.arc(GX, 502, 66, 52, PI, 2 * PI, 12), [GX + 66, 502], [GX + 66, 596]])}" fill="${mix(C.hillNear, C.skyBlue, 0.3)}" opacity=".9"/></g>`);
  // the gate filled with light (hidden): the Kingdom has come
  const gateLight = mid.add(`<g opacity="0"><circle cx="${GX}" cy="530" r="200" fill="url(#halo-glow)"/><path d="${q.poly([[GX - 66, 596], [GX - 66, 502], ...q.arc(GX, 502, 66, 52, PI, 2 * PI, 12), [GX + 66, 502], [GX + 66, 596]])}" fill="#fff4d2"/></g>`);
  // the paved square
  const G = S.layer({ par: 0.3, sh: 3, rise });
  const gp = sheet().p(q.cut([[-1400, 588], [3000, 588], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.4));
  let cob = '';
  for (let i = 0; i < 70; i++) cob += q.cut(q.blob(q.rr(-400, 2000), q.rr(620, 1000), q.rr(12, 24), q.rr(5, 9), 8, 0.2), 0.3, 4);
  gp.x(cob, C.stone2, 'opacity=".55"');
  G.add(gp.out());
  const crowdL = crowd ? S.layer({ par: 0.34, sh: 4, rise }) : null;
  const CROWD = crowd ? [
    { seed: 'mt12-sqL', x: 530, y: 628, n: 9, flip: false },
    { seed: 'mt12-sqR', x: 1080, y: 628, n: 9, flip: true },
  ].map((g) => ({
    ...g,
    calm: crowdL.sprite(crowdMarkup(g.seed, g.n, { s: 0.62, spread: 46, rows: 2, flip: g.flip }), g.x, g.y),
    wow: crowdL.sprite(crowdMarkup(g.seed, g.n, { s: 0.62, spread: 46, rows: 2, flip: g.flip, armF: [60, 110], armB: [100, 160], head: [-10, -2] }), g.x, g.y),
  })) : [];
  CROWD.forEach((g) => g.wow.set({ o: 0 }));
  // people
  const act = S.layer({ par: 0.5, sh: 5 });
  // the low step Jesus stands on
  act.add(sheet().p(q.cut([[SQ.JX - 110, SQ.FEET + 2], [SQ.JX - 96, SQ.FEET - 14], [SQ.JX + 96, SQ.FEET - 14], [SQ.JX + 110, SQ.FEET + 2]], 0.5, 8), C.stone2).p(q.cut([[SQ.JX - 116, SQ.FEET], [SQ.JX + 116, SQ.FEET], [SQ.JX + 116, SQ.FEET + 16], [SQ.JX - 116, SQ.FEET + 16]], 0.4, 8), shade(C.stone2, -0.08)).out());
  const disc = dis.map((k, i) => ({ k, i, x: SQ.DX[i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[k] }))) }));
  const phs = Array.from({ length: ph }, (_, i) => ({ i, x: SQ.PX[i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, i === 1 ? scribeOpts(i) : phOpts(i)))) }));
  const jesusEl = act.add(person(c, { ...CAST.jesus }));
  const jesus = S.puppet(jesusEl);
  return {
    c, q, sk, sk2, hangL, sunEl, far, mid, G, crowdL, CROWD, act, disc, phs, jesus, jesusEl, gateLight,
    /** crowd amazement 0..1 (cross-fades each sprite with its amazed twin) */
    amaze(k) { CROWD.forEach((g) => { g.calm.set({ o: 1 - k }); g.wow.set({ o: k }); }); },
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.1, 0.6, cl.i));
    },
    /** standard poses: Jesus at the centre (JY feet), the disciples left, the Pharisees right */
    pose(t, time, J = {}, D = () => ({}), P = () => ({})) {
      this.update(time);
      jesus.set({ x: SQ.JX, y: SQ.FEET - 14, s: 1.04, flip: false, armF: 16, armB: 8, head: 0, ...J });
      disc.forEach((d) => d.p.set({ x: d.x, y: SQ.FEET + (d.i % 2 ? 6 : 0), s: 0.96, flip: false, armF: 10, armB: 6, head: -2, ...D(d) }));
      phs.forEach((m) => m.p.set({ x: m.x, y: SQ.FEET + (m.i % 2 ? -4 : 4), s: 0.96, flip: true, armF: 8, armB: 4, head: 0, ...P(m) }));
    },
  };
}
import { pharisee as ph3, scribe as sc3 } from '../mark3/lib.js';
const PHC = makeCutter('mt12-ph');
export const phOpts = (i) => ph3(PHC, i);
export const scribeOpts = (i) => sc3(PHC, i);

/* ================================================================== parchment flats */
/** a painted flat of an old story: parchment sky, sepia hills, a sandy ground; returns { c, gfn, ground, update } */
export function parchSet(S, { gy = 640, sunAt = [470, 170], hills = true } = {}) {
  const c = S.c;
  sky(S, PARCH);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = sunAt ? hanging(hangL, sun(c, 42, { rays: C.ochre, disc: mix(C.sun, C.parchment, 0.3), inner: mix(C.sun, C.cream, 0.5) }), { x: sunAt[0], y: sunAt[1], len: 700 }) : null;
  const cl = hanging(hangL, cloud(c, 170, C.cream, C.parchment), { x: 1150, y: 230, len: 700 });
  if (hills) {
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: gy - 190, amps: [26, 10, 3], lens: [900, 330, 120], color: mix(C.dune, C.parchment, 0.45) }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(band(c, { y: gy - 100, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.sand2, C.dune, 0.4) }).markup);
  }
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(gy, [4, 2], [700, 180]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.4)).out());
  return {
    c, gfn, ground, hangL,
    update(time) {
      if (sunEl) swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      swing(cl, 1150 + Math.sin(time * 0.1) * 20, 230, time, 1.1, 0.6, 1);
    },
  };
}

/* ================================================================== voices */
/** a jagged shouting bubble with an inner glyph; origin at the tip of its tail (points down-left unless flip) */
export function shout(c, inner, { w = 70, h = 54, fill = C.cream, flip = false } = {}) {
  const d = flip ? -1 : 1;
  const cx = d * (w / 2 - 4), cy = -h / 2 - 18;
  const p = [];
  const n = 18;
  for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2, r = i % 2 ? 0.78 : 1.12; p.push([cx + Math.cos(a) * w / 2 * r, cy + Math.sin(a) * h / 2 * r]); }
  const s = sheet().p(c.cut(p, 0.4, 4), fill).p(c.cut([[d * 6, -14], [0, 0], [d * 18, -12]], 0.3, 3), fill);
  return `${s.out()}<g transform="translate(${cx} ${cy})">${inner}</g>`;
}
/** people of the nations: many lands, many kinds of dress; a still group as markup (origin: feet of the front row) */
export function nationsMarkup(seed, n, { s = 0.6, spread = 46, flip = false, armF = [10, 40], armB = [0, 20] } = {}) {
  const c = makeCutter(seed);
  const oc = makeCutter(seed + '-o');
  const ROBES = [C.ochreRobe, C.indigo, C.terracotta, C.tealRobe, C.plumRobe, C.wheatRobe, C.roseRobe, C.clayMantle];
  const HEAD = [C.ochre, C.sun, C.linen, C.terracotta, C.dustyBlue, C.cream];
  const mem = Array.from({ length: n }, (_, i) => {
    const woman = oc.chance(0.4);
    const o = {
      robe: oc.pick(ROBES), mantle: oc.chance(0.5) ? oc.pick(ROBES) : null, skin: oc.pick([C.skin, C.skin2, C.skin3, C.skin4, C.skin4]),
      hair: oc.pick([C.hair, C.hair3, C.greyHair]), hairStyle: woman ? 'veil' : oc.pick(['wrap', 'wrap', 'curly', 'short']), veil: oc.pick(HEAD), veil2: oc.pick(HEAD),
      beard: woman ? 'none' : oc.pick(['full', 'short', 'none']), belt: oc.chance(0.5) ? C.sun : null,
    };
    const r = i % 2;
    return { x: (i - (n - 1) / 2) * spread + oc.rr(-6, 6), y: r * 14 + oc.rr(-3, 3), s: s * oc.rr(0.92, 1.05), flip, head: oc.rr(-8, 2), armF: oc.rr(armF[0], armF[1]), armB: oc.rr(armB[0], armB[1]), o };
  });
  return pose3(c, mem);
}

/* ================================================================== shadows of the enemy (restrained: dark paper, never gore) */
/** a little black fly; origin centre */
export function flyBug(c) {
  return sheet().p(c.cut(c.ell(0, 0, 5, 3.2, 10), 0.2, 3), '#2b2530').x(c.poly(c.ell(-1, -4, 3, 2, 8, -0.4)) + c.poly(c.ell(2, -4, 3, 2, 8, 0.4)), '#cfd6e0', 'opacity=".75"').out();
}
/** "the prince of demons": a dark cut-paper head with horns and a spiky crown, two pale eyes (a shadow, no face); origin centre */
export function darkPrince(c, r = 40, col = '#3b3243') {
  const s = sheet();
  const pts = [];
  for (let i = 0; i < 20; i++) { const a = PI + (i / 19) * PI; pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.9]); }
  pts.push([r * 0.9, r * 0.3], [r * 0.5, r * 0.8], [0, r], [-r * 0.5, r * 0.8], [-r * 0.9, r * 0.3]);
  s.p(c.cut(pts, 1.2, 5), col);
  // horns
  s.p(c.cut([[-r * 0.7, -r * 0.5], [-r * 1.3, -r * 1.3], [-r * 0.95, -r * 0.55]], 0.4, 4) + c.cut([[r * 0.7, -r * 0.5], [r * 1.3, -r * 1.3], [r * 0.95, -r * 0.55]], 0.4, 4), col);
  // a spiky crown
  s.p(c.cut([[-r * 0.55, -r * 0.8], [-r * 0.45, -r * 1.3], [-r * 0.25, -r * 0.95], [0, -r * 1.45], [r * 0.25, -r * 0.95], [r * 0.45, -r * 1.3], [r * 0.55, -r * 0.8]], 0.4, 4), mix(col, C.ochre, 0.3));
  s.x(c.poly(c.ell(-r * 0.32, -r * 0.1, r * 0.13, r * 0.08, 8, 0.3)) + c.poly(c.ell(r * 0.32, -r * 0.1, r * 0.13, r * 0.08, 8, -0.3)), '#e9dcb4');
  return s.out();
}
/** a sin: a tangled dark knot of paper; origin centre */
export function sinKnot(c, r = 14, col = '#3f3647') {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.8, 10, 0.3), 1, 3), col);
  let sc = '';
  for (let i = 0; i < 3; i++) sc += c.ribbon(c.cbez([c.rr(-r, 0), c.rr(-r, r)], [c.rr(-r, r), c.rr(-r, r)], [c.rr(-r, r), c.rr(-r, r)], [c.rr(0, r), c.rr(-r, r)], 10), 1.4);
  s.x(sc, shade(col, 0.3), 'opacity=".8"');
  return s.out();
}
/** a treasure chest: { box, lid } markup; origin: bottom centre of the box; the lid hinges at its back edge (0, -h) */
export function chest(c, { w = 90, h = 50, dark = false } = {}) {
  const wood = dark ? mix(C.soilDark, C.storm2, 0.3) : C.wood, band = dark ? C.rock3 : C.sun;
  const b = sheet();
  b.p(c.cut(c.rect(-w / 2, -h, w, h), 0.5, 6), wood);
  b.p(c.cut(c.rect(-w / 2, -h, w, 7), 0.3, 6) + c.cut(c.rect(-w / 2 + 12, -h, 8, h), 0.3, 5) + c.cut(c.rect(w / 2 - 20, -h, 8, h), 0.3, 5), band);
  b.p(c.cut(c.rect(-7, -h + 8, 14, 14), 0.2, 4), band);
  const l = sheet();
  l.p(c.cut([[-w / 2 - 2, 0], [-w / 2 - 2, -12], ...c.arc(0, -12, w / 2 + 2, 14, PI, 2 * PI, 12), [w / 2 + 2, -12], [w / 2 + 2, 0]], 0.4, 5), shade(wood, 0.06));
  l.p(c.cut(c.rect(-w / 2 + 12, -24, 8, 24), 0.3, 4) + c.cut(c.rect(w / 2 - 20, -24, 8, 24), 0.3, 4), band);
  return { box: b.out(), lid: l.out() };
}

/* ================================================================== Jonah */
/** the great fish, facing left, mouth a little open; origin: its middle; ~w wide. Parts: .jaw (pivot at the hinge) */
export function greatFish(c, { w = 420, col = mix(C.teal2, C.dustyBlue, 0.35), belly = mix(C.stone, C.skyBlue, 0.4) } = {}) {
  const h = w * 0.36;
  const s = sheet();
  const body = [];
  for (let i = 0; i <= 24; i++) { const a = PI * 0.08 + (i / 24) * PI * 1.84; body.push([Math.cos(a) * w * 0.42 - w * 0.02, Math.sin(a) * h * 0.5 * (1 - Math.max(0, Math.cos(a)) * 0.35)]); }
  s.p(c.cut(body, 0.8, 8), col);
  // tail
  s.p(c.cut([[w * 0.36, -h * 0.05], [w * 0.52, -h * 0.5], [w * 0.58, -h * 0.42], [w * 0.5, 0], [w * 0.58, h * 0.4], [w * 0.52, h * 0.46], [w * 0.36, h * 0.08]], 0.6, 6), shade(col, -0.08));
  // belly
  s.p(c.cut([...c.arc(-w * 0.04, h * 0.02, w * 0.36, h * 0.42, PI * 0.12, PI * 0.9, 16)], 0.6, 6), belly);
  let grooves = '';
  for (let k = 1; k < 5; k++) grooves += c.ribbon(c.arc(-w * 0.06, h * 0.02 - k * 3, w * 0.34 - k * 6, h * 0.42 - k * 8, PI * 0.2, PI * 0.8, 10), 1.4);
  s.x(grooves, shade(belly, -0.15), 'opacity=".6"');
  // fin, eye
  s.p(c.cut([[-w * 0.02, h * 0.14], [w * 0.1, h * 0.36], [w * 0.14, h * 0.16]], 0.4, 4), shade(col, -0.15));
  s.x(c.poly(c.circ(-w * 0.3, -h * 0.14, w * 0.018, 8)), C.ink);
  s.x(c.poly(c.circ(-w * 0.297, -h * 0.15, w * 0.006, 6)), '#fff');
  // spots
  let sp = '';
  for (let k = 0; k < 8; k++) sp += c.cut(c.circ(c.rr(-w * 0.2, w * 0.3), c.rr(-h * 0.36, -h * 0.1), c.rr(3, 6), 8), 0.2, 3);
  s.x(sp, shade(col, 0.25), 'opacity=".6"');
  const jaw = sheet().p(c.cut([[0, 0], [-w * 0.1, h * 0.06], [-w * 0.2, h * 0.14], [-w * 0.1, h * 0.2], [0, h * 0.14]], 0.4, 4), shade(col, -0.05)).out();
  return `${s.out()}<g class="jaw" transform="translate(${-w * 0.26} ${h * 0.02})">${jaw}</g>`;
}
