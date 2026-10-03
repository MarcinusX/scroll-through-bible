// Luke 11 — the cast and cut-outs of this chapter. New here: the olive-grove hillside where Jesus prays and teaches
// the Our Father; a Judean hill village with its square and well (the mute man, Beelzebul, the sign of Jonah); the
// Pharisee's midday table (Simon's dining court of Luke 7, now at noon, with another host). The parables are painted
// flats: the friend at midnight, the father and his son, the strong man's courtyard, the unclean spirit's dry places
// and swept house, the lamp, the body full of light.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, town, house, sun, cloud, grass, olive, cypress, bush, flowers, rock, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { es, ease, bump, seg, fade, attr } from '../../core/anim.js';
import { crowdMarkup as crowdMarkupM } from '../matthew12/lib.js';
import { pharisee as ph3, scribe as sc3 } from '../mark3/lib.js';
import { simonHouse as simonHouseM, couch as couchM, SH as SHM, LAWYER as LAWYER7 } from '../luke7/lib.js';
import { cushion as cushionJ, outLegs as outLegsJ } from '../john12/lib.js';
import { bowl as bowlM, cup as cupM, loaf as loafM } from '../mark2/lib.js';
import { jug as jugJ } from '../john12/lib.js';

export { kf, moving, speech, thought, GLYPH, heart, loaf, cup, bowl, wordSlip, addToHead, addToBody } from '../mark2/lib.js';
export { hand, headAt, hang2, voiceRings, sparkle, dove, flapWings, scrap, camel, walkCamel, flame, plate as plateM } from '../mark1/lib.js';
export { handAt, bubble, question, tapeX, withFace, faceBits, strip, stoneHeart, silhouette, shadowPerson, tornPair, houseSection, TWELVE, LOOK as L3 } from '../mark3/lib.js';
export { rayBurst, glowDisc, radiance, hungWord, goldWord, hungGold, drawRing } from '../john1/lib.js';
export { fatherLight } from '../john17/lib.js';
export { spirit, shadowCloak } from '../mark5/lib.js';
export { MUTE, MUTE_OK, JONAH, SACK, SOLOMON, QUEEN, darkPrince, flyBug, qMark, tagText, crowdMarkup, glow, greatFish, sinKnot, chest, shout, tick, crossX, nationsMarkup } from '../matthew12/lib.js';
export { hangAt, roundel, bang, lightBeam, beamGrad } from '../john3/lib.js';
export { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { cameo } from '../luke2/lib.js';
export { flat, flatSky, flatHills, fig, flatText, dropK, flyTo } from '../luke1/lib.js';
export { iou, iouHalf, LAWYER, SIMON, GUESTS, simonHouse, SH, couch, showAt, figure, manO, womanO, SUPPER } from '../luke7/lib.js';
export { kingdomGate, gateDoor, throne } from '../mark12/lib.js';
export { crown } from '../mark10/lib.js';
export { JOHN_B } from '../mark1/lib.js';
export { MARY } from '../matthew1/lib.js';
export { broom } from '../mark13/lib.js';
export { garland } from '../mark2/lib.js';
export { woeTag, PH, scribes, vain, bundle as loadBundle, monument, greedHeap, herb, sprig, titheDish, firstChairs, tombFacade, goldVessels, table as plainTable, streetFlat, stall } from '../matthew23/lib.js';
export { lampstand, bushel, oilLamp as clayLamp } from '../../assets/things.js';
export { say } from '../mark10/lib.js';
export { QUIET, WIFE, CHILD, secretShaft, smallLamp } from '../matthew6/lib.js';
export { purse } from '../mark12/lib.js';
export { lanternHeld } from '../john10/lib.js';
export { basket } from '../mark6/lib.js';
export { basketEmpty } from '../luke6/lib.js';
export { coin } from '../john10/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const MORNING = ['#c6dcd9', '#eee6cc', '#f8e8cc'];
export const HEAVEN = ['#f1d49a', '#f8e2b4', '#fbeed2'];
export const NOON = ['#c3dcd8', '#eeecd6', '#f7ebcf'];
export const AFTER = ['#d0dcd2', '#f2e1bf', '#f8e7c7'];
export const EVENING = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#141a3d', '#27306a', '#4d578f'];
export const JUDGE = ['#e9c98c', '#f5dcaa', '#faeac8'];
export const GLOOM = ['#5c5870', '#8f8398', '#c4b3aa'];

/* ================================================================== the cast */
/** the Pharisee who asks Him to dine (a look of his own): white linen, a deep-teal mantle, a striped prayer wrap */
export const HOST = { robe: C.linen, mantle: mix(C.teal2, C.indigo, 0.25), hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: mix(C.teal2, C.indigo, 0.3), beard: 'full', beardColor: C.hair2, skin: C.skin3, belt: C.sun };
/** the man who is mute (a little dark spirit on him), and the same man speaking */
export const DUMB = { robe: mix(C.stone2, C.rock2, 0.45), mantle: null, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin3, belt: C.rope };
export const DUMB_OK = { ...DUMB, robe: mix(C.stone2, C.dustyBlue, 0.35), hairStyle: 'curly' };
/** the woman in the crowd who cries out */
export const CRIER = { robe: C.roseRobe, hairStyle: 'veil', veil: C.wheat, veil2: C.ochre, hair: C.hair, skin: C.skin2, beard: 'none', belt: C.plumRobe };
/** the parable of the friend at midnight: the one who asks, the traveller, the one in bed */
export const ASKER = { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
export const TRAVELLER = { robe: mix(C.dustyBlue, C.stone2, 0.3), mantle: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.clayMantle, beard: 'full', skin: C.skin3, belt: C.rope };
export const SLEEPER = { robe: C.mauve, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: null };
export const SLEEPWIFE = { robe: C.skyVeil, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, skin: C.skin2, beard: 'none' };
/** a father and his little son */
export const FATHER = { robe: C.ochreRobe, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.teal2, beard: 'full', skin: C.skin3, belt: C.leather };
export const SON = { robe: C.skyVeil, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.ochre };
/** the strong man in full armour, and his goods */
export const STRONG = { robe: mix(C.storm2, C.soilDark, 0.3), mantle: mix(C.rock3, C.storm, 0.4), hair: C.hair3, hairStyle: 'wild', beard: 'full', skin: C.skin4, belt: C.rock3 };
/** Abel the shepherd, Zechariah the priest (of the Chronicles) */
export const ABEL = { robe: C.wheatRobe, mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope };
export const ZECH = { robe: C.linen, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.terracotta };
/** the Pharisees and scribes of the village square (Mark 3's looks) */
const PHC = makeCutter('lk11-ph');
export const phOpts = (i) => ph3(PHC, i);
export const scribeOpts = (i) => sc3(PHC, i);
/** a man / a woman of the crowd (men never veiled) */
export function manOf(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanOf(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }

/* ================================================================== small helpers */
/** where a sitting / kneeling puppet's head is */
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const headP = (x, y, s, flip = false, p = 'stand') => [x + (flip ? -2 : 2) * s, y + (-167 + DY[p]) * s];
/** show a piece that pops in (k 0..1, eased back) */
export function pop(el, k, x, y, { s = 1, r = 0 } = {}) { pose(el, { x, y, s: Math.max(0.001, k) * s, r, o: k > 0.01 ? 1 : 0 }); }
/** a little rising prayer flame with its glow (origin: its foot) */
export function prayerFlame(c, h = 22) {
  return `<circle cy="${-h * 0.4}" r="${h * 1.6}" fill="url(#warm-glow)" opacity=".85"/><path d="M0 0C${-h * 0.32} ${-h * 0.22} ${-h * 0.28} ${-h * 0.62} 0 ${-h}C${h * 0.28} ${-h * 0.62} ${h * 0.32} ${-h * 0.22} 0 0Z" fill="${C.lampFlame}"/><path d="M0 ${-h * 0.1}C${-h * 0.12} ${-h * 0.24} ${-h * 0.12} ${-h * 0.42} 0 ${-h * 0.6}C${h * 0.12} ${-h * 0.42} ${h * 0.12} ${-h * 0.24} 0 ${-h * 0.1}Z" fill="#fff4d2"/>`;
}
/** knock marks: three short strokes fanning out from a door (origin: the knock point; they point left unless dir 1) */
export function knockMarks(c, dir = -1, col = C.ink) {
  return sheet().p(c.ribbon([[dir * 10, -14], [dir * 26, -24]], 3) + c.ribbon([[dir * 12, 0], [dir * 30, 0]], 3) + c.ribbon([[dir * 10, 14], [dir * 26, 24]], 3), col).out();
}
/** "zzz" of sleep (origin: its lower left) */
export function zzz(c, size = 18, col = C.inkSoft) {
  return `<text x="0" y="0" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">z</text><text x="${size * 0.6}" y="${-size * 0.7}" font-family="${FONT}" font-size="${size * 1.25}" font-style="italic" fill="${col}">z</text><text x="${size * 1.4}" y="${-size * 1.6}" font-family="${FONT}" font-size="${size * 1.5}" font-style="italic" fill="${col}">z</text>`;
}
/** a word on a cream strip (origin centre) */
export function label(c, text, { size = 18, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || String(text).length * size * 0.5 + size * 1.3, hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}

/* ================================================================== the hill of prayer */
/**
 * "In a certain place": an olive grove on a hillside in the morning, the villages of the land spread out below and
 * beyond. A rocky knoll in the middle where Jesus prays; the disciples sit among the olives on either side. The light
 * of heaven (never a figure) can open at the top of the stage between two banks of cloud (hangL). Returns handles.
 */
export const HL = { X: 800, KNOLL: 640, SEAT: 722, LX: 800, LY: 150 };
export const HILL_DIS = [[-330, 'thomas'], [-250, 'andrew'], [-170, 'peter'], [170, 'john'], [250, 'james'], [330, 'matthew']];
export function hillSet(S, { skyCols = MORNING, sky2 = HEAVEN, rise = 1, villages = true } = {}) {
  const c = S.c;
  const q = makeCutter('lk11-hill');
  const sk = sky(S, skyCols);
  const gold = sky2 ? sky(S, sky2, { name: 'gold', rise: 0 }).layer : null;
  if (gold) gold.fade(0);
  /* the light of heaven, its rays, the clouds that part */
  const raysL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
  raysL.add(`<g transform="translate(${HL.LX} ${HL.LY})">${rayBurstL(q, { n: 30, r0: 60, r1: 620, spread: 0.035, color: '#fff3cf', o: 0.4 })}</g>`);
  raysL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 3, rise: 0 });
  const light = hangL.add(`<g opacity="0">${fatherLightL(q, 58)}</g>`);
  const cloudCol = [mix(C.cream, C.skyBlue, 0.25), mix(C.skyBlue, C.stone, 0.4)];
  const cloudL = hangL.add(`<g>${cloud(q, 420, cloudCol[0], cloudCol[1])}<g transform="translate(-170 40)">${cloud(q, 300, cloudCol[0], cloudCol[1])}</g></g>`);
  const cloudR = hangL.add(`<g>${cloud(q, 420, cloudCol[0], cloudCol[1])}<g transform="translate(170 40)">${cloud(q, 300, cloudCol[0], cloudCol[1])}</g></g>`);
  /* the land below: far hills, the villages, the plain */
  const far = S.layer({ par: 0.08, sh: 2, rise });
  const fb = band(q, { y: 430, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  const mid = S.layer({ par: 0.14, sh: 3, rise });
  const mh = hillsWith(q, { y: 492, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sand, 0.12), trees: 18, treeColor: C.sage, treeH: 18 });
  mid.add(mh.markup);
  const VILL = [[260, 6], [560, 5], [1040, 6], [1340, 5]];
  if (villages) VILL.forEach(([x, n]) => mid.add(town(q, { x, y: mh.fn(x) + 12, n, spread: 150, sc: 0.44 })));
  // free layers for a scene: light over the far land (flat) and cut-outs standing on the far hills
  const farFx = S.layer({ par: 0.14, sh: 1, flat: true, rise: 0 });
  const farCut = S.layer({ par: 0.14, sh: 4, rise: 0 });
  /* the slope of the grove */
  const slope = S.layer({ par: 0.24, sh: 3, rise });
  const sfn = q.wave(592, [10, 4], [800, 240]);
  slope.add(sheet().p(q.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.15)).out()
    + [[180, 0.62], [380, 0.55], [1180, 0.6], [1420, 0.66]].map(([x, s]) => olive(q, x, sfn(x) + 14, s)).join(''));
  const bloomL = S.layer({ par: 0.24, sh: 2, rise });
  const BLOOMS = [300, 460, 620, 960, 1120, 1280, 540, 1040].map((x, i) => ({ i, x, y: sfn(x) + 24 + (i > 5 ? 30 : 0), el: bloomL.add(`<g opacity="0">${flowers(q, { x0: -50, x1: 50, y: 0, n: 7 })}</g>`) }));
  /* the knoll where He prays, and the grove floor */
  const knoll = S.layer({ par: 0.5, sh: 3, rise });
  const kfn = (x) => HL.SEAT - 4 - Math.max(0, 1 - Math.abs(x - HL.X) / 300) ** 1.4 * (HL.SEAT - HL.KNOLL - 4) + Math.sin(x * 0.013) * 3;
  const ks = sheet();
  ks.p(q.ridge(kfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.sand, 0.25));
  ks.p(q.cut([[690, HL.KNOLL + 14], [712, HL.KNOLL - 6], [770, HL.KNOLL - 14], [840, HL.KNOLL - 12], [892, HL.KNOLL + 2], [912, HL.KNOLL + 22], [680, HL.KNOLL + 26]], 1, 8), mix(C.rock, C.sand, 0.25));
  ks.x(q.ribbon([[720, HL.KNOLL + 4], [790, HL.KNOLL - 4], [860, HL.KNOLL]], 1.6), shade(C.rock, -0.15), 'opacity=".6"');
  knoll.add(ks.out() + grass(q, { x0: -800, x1: 2400, y: 700, fn: kfn, n: 44, h: 12, color: C.moss }) + olive(q, 170, kfn(170) + 26, 0.95) + olive(q, 1440, kfn(1440) + 26, 1.0));
  const act = S.layer({ par: 0.5, sh: 5 });
  const dis = HILL_DIS.map(([dx, k], i) => ({ i, k, dx, x: HL.X + dx, flip: dx > 0, seed: q.rr(0, 9),
    sit: S.puppet(act.add(person(c, { ...CAST[k], pose: 'sit' }))),
    kneel: S.puppet(act.add(person(c, { ...CAST[k], pose: 'kneel' }))),
  }));
  const jGlowL = S.layer({ par: 0.5, sh: 0, flat: true });
  const jGlow = jGlowL.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/></g>`);
  const J = S.layer({ par: 0.5, sh: 5 });
  const jKneel = S.puppet(J.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
  const jesus = S.puppet(J.add(person(c, { ...CAST.jesus })));
  const sayL = S.layer({ par: 0.52, sh: 3 });
  const front = S.layer({ par: 0.85, sh: 6, rise });
  front.add(sheet().p(q.cut(q.blob(-40, 980, 240, 120, 14, 0.2), 1.4, 8) + q.cut(q.blob(1640, 990, 250, 120, 14, 0.2), 1.4, 8), mix(C.moss, C.olive, 0.4)).p(q.cut(q.blob(40, 930, 150, 60, 12, 0.2), 1.2, 7) + q.cut(q.blob(1560, 935, 150, 60, 12, 0.2), 1.2, 7), C.olive).out());
  return {
    c, q, sk, gold, raysL, hangL, light, cloudL, cloudR, far, mid, mh, farFx, farCut, sayL, slope, sfn, BLOOMS, VILL, knoll, kfn, act, dis, jGlowL, jGlow, J, jKneel, jesus, front,
    /** the clouds part (k 0 → 1) and the light opens (lk 0 → 1) */
    heaven(k, lk, T) {
      pose(cloudL, { x: HL.LX - 190 - k * 540, y: HL.LY + 60 + k * 20 });
      pose(cloudR, { x: HL.LX + 190 + k * 540, y: HL.LY + 60 + k * 20 });
      pose(light, { x: HL.LX, y: HL.LY, s: 0.5 + lk * 0.5 + (T ? Math.sin(T * 0.7) * 0.02 : 0), o: lk });
    },
    /** a disciple sitting (k = 0) or kneeling (k = 1) at his place, with arms / head */
    disc(d, kn, o = {}, vis = 1) {
      const x = d.x, y = kfn(d.x) + 8;
      const sw = kn > 0.5;
      d.sit.set({ x, y, s: 0.9, flip: d.flip, armF: 16, armB: 8, head: -2, ...o, o: sw ? 0 : vis });
      d.kneel.set({ x: x + (d.flip ? 14 : -14), y, s: 0.9, flip: d.flip, armF: 30, armB: 20, head: -4, ...o, o: sw ? vis : 0 });
    },
  };
}
import { rayBurst as rayBurstL } from '../john1/lib.js';
import { fatherLight as fatherLightL } from '../john17/lib.js';

/* ================================================================== painted panels */
let PN = 0;
/**
 * A painted panel hung on two strings, with an optional word on a strip under it. inner is in panel coords (centre
 * 0,0; face w × h) and is clipped to the face. Built up in the flies (y −1600); pose it where it hangs.
 */
export function panel(S, inner, { w = 240, h = 170, word = '', size = 18, face = C.parchment, rim = C.haloRim, frame = mix(C.wood3, C.ochre, 0.4) } = {}) {
  const c = S.c, id = S.id('pn' + PN++);
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 9, -h / 2 - 9, w + 18, h + 18), 0.6, 9), frame);
  s.p(c.cut(c.rect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8), 0.4, 9), rim);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 9), face);
  const strings = `<path d="M${(-w * 0.34).toFixed(0)} ${-h / 2 - 1800}V${-h / 2 - 9}M${(w * 0.34).toFixed(0)} ${-h / 2 - 1800}V${-h / 2 - 9}" stroke="${STRING}" stroke-width="1.2" fill="none"/>`;
  const lab = word ? `<g transform="translate(0 ${h / 2 + 22})">${label(c, word, { size })}</g>` : '';
  return `<g transform="translate(800 -1600)">${strings}${s.out()}<clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>${lab}</g>`;
}
/** a vertical gradient rect for a panel's sky */
export function panelSky(S, w, h, [top, bottom]) {
  const id = S.id('ps' + PN++);
  S.defs(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`);
  return `<rect x="${-w / 2 - 2}" y="${-h / 2 - 2}" width="${w + 4}" height="${h + 4}" fill="url(#${id})"/>`;
}
/** a strip of ground for a panel (top edge around y) */
export function panelGround(c, w, y, col, amp = 5) {
  const fn = c.wave(y, [amp, amp * 0.4], [w * 0.8, w * 0.3]);
  return sheet().p(c.ridge(fn, -w / 2 - 20, w / 2 + 20, y + 400, 10, 0.8), col).out();
}
export { lamb } from '../mark11/lib.js';
export { stoneLoaf, breadLoaf } from '../matthew4/lib.js';
export { snake } from '../mark1/lib.js';
export { smallFish } from '../mark8/lib.js';
/** an egg (origin: its bottom) */
export function egg(c, r = 11, col = mix(C.cream, C.sand, 0.3)) {
  return sheet().p(c.cut(c.ell(0, -r * 1.2, r, r * 1.25, 18), 0.2, 3), col).x(c.poly(c.ell(-r * 0.35, -r * 1.6, r * 0.22, r * 0.34, 8, 0.3)), '#fffaf0', 'opacity=".7"').out();
}
/** a scorpion seen from the side, tail curled over its back (origin: under its body) */
export function scorpion(c, col = mix(C.soilDark, C.ochre, 0.3)) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -8, 18, 7, 16), 0.4, 3), col);
  let legs = '';
  for (let i = 0; i < 4; i++) legs += c.ribbon([[-8 + i * 6, -4], [-12 + i * 7, 2], [-14 + i * 8, 4]], 1.8);
  s.p(legs, shade(col, -0.2));
  s.p(c.ribbon(c.cbez([-16, -8], [-34, -12], [-38, -40], [-20, -46], 12), (u) => 6 - u * 3), col);
  s.p(c.cut([[-20, -46], [-10, -50], [-14, -42]], 0.2, 2), shade(col, -0.35));
  s.p(c.ribbon([[16, -8], [26, -12], [30, -8]], 3) + c.ribbon([[16, -6], [26, -2], [32, -4]], 3), col);
  s.p(c.cut(c.ell(33, -10, 5, 3, 8), 0.2, 2) + c.cut(c.ell(34, -3, 5, 3, 8), 0.2, 2), shade(col, -0.15));
  return s.out();
}

/* ================================================================== the village square */
/**
 * A village in the hills of Judea at midday: the houses climb the terraced hill behind in steps, a great old sycamore
 * leans over the square on the right, a well with its stone ring on the left. Jesus stands at the centre on the low
 * step of the well-yard; two disciples on the left, Pharisees and scribes on the right; the crowd (two sprites, with
 * an "amazed" twin each) fills the square behind them. Free layers: flyL (panels hung above the square, in front of
 * the hill), backFx (a flat glow layer behind the people), W (words over the people).
 */
export const VQ = { JX: 800, FEET: 704, DX: [560, 640], PX: [990, 1070, 1150] };
export function villageSet(S, { skyCols = NOON, sky2 = null, sunAt = [1240, 170], dis = ['peter', 'john'], ph = 3, crowd = true, rise = 1, crowdSeeds = ['lk11-vL', 'lk11-vR'] } = {}) {
  const c = S.c;
  const q = makeCutter('lk11-village');
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5, rise });
  const sunEl = hanging(hangL, sun(q, 42), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[520, 210, 170], [1010, 160, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(q, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2, rise });
  far.add(hillsWith(q, { y: 430, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12), trees: 10, treeColor: C.sage2, treeH: 16 }).markup);
  /* the terraced hill with the houses stepping up it */
  const mid = S.layer({ par: 0.16, sh: 3, rise });
  const hfn = (x) => 470 + Math.abs(x - 820) * 0.05 + Math.sin(x * 0.006) * 14;
  const ms = sheet();
  ms.p(q.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.sand, 0.3));
  let terr = '';
  for (let r = 0; r < 4; r++) terr += q.ribbon([[-900, 505 + r * 26], [2500, 500 + r * 26 + q.rr(-4, 4)]], 3);
  ms.x(terr, shade(C.hillMid, -0.12), 'opacity=".5"');
  mid.add(ms.out());
  let hs = '';
  [[560, 468, 70, 44], [640, 452, 80, 50], [730, 440, 70, 56], [840, 436, 90, 60], [950, 446, 70, 50], [1040, 462, 80, 46],
   [470, 500, 90, 56], [600, 504, 80, 52], [700, 492, 90, 60], [1000, 496, 90, 58], [1110, 506, 80, 50], [1220, 514, 90, 50],
   [-300, 540, 110, 70], [-120, 548, 120, 64], [60, 540, 110, 70], [240, 546, 110, 60], [1330, 544, 120, 64], [1500, 536, 110, 72], [1680, 546, 120, 60], [1860, 540, 110, 70]]
    .forEach(([x, y, w, h]) => { hs += house(q, x - w / 2, y, w, h, { stairs: q.chance(0.5) }); });
  mid.add(hs + cypress(q, 780, 450, 110) + cypress(q, 1170, 470, 120) + olive(q, 380, 560, 0.7));
  const flyL = S.layer({ par: 0.22, sh: 6, rise: 0 });
  /* the square: its paving, the well on the left, the sycamore on the right */
  const G = S.layer({ par: 0.3, sh: 3, rise });
  const gp = sheet().p(q.cut([[-1400, 588], [3000, 588], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.45));
  let cob = '';
  for (let i = 0; i < 70; i++) cob += q.cut(q.blob(q.rr(-400, 2000), q.rr(620, 1000), q.rr(12, 24), q.rr(5, 9), 8, 0.2), 0.3, 4);
  gp.x(cob, C.stone2, 'opacity=".55"');
  G.add(gp.out());
  const tree = sheet();
  tree.p(q.ribbon([[1300, 600], [1290, 480], [1250, 380], [1180, 320]], (u) => 40 - u * 22), C.wood2);
  tree.p(q.ribbon([[1286, 440], [1360, 360], [1420, 330]], 14) + q.ribbon([[1250, 380], [1230, 300]], 10), C.wood2);
  let crown = '';
  for (let i = 0; i < 12; i++) crown += q.cut(q.blob(q.rr(1120, 1480), q.rr(250, 350), q.rr(50, 80), q.rr(34, 50), 12, 0.18), 1, 6);
  tree.p(crown, mix(C.moss, C.olive, 0.4));
  let crown2 = '';
  for (let i = 0; i < 8; i++) crown2 += q.cut(q.blob(q.rr(1140, 1460), q.rr(270, 340), q.rr(40, 60), q.rr(24, 36), 12, 0.18), 1, 6);
  tree.p(crown2, C.sage);
  const well = sheet();
  well.p(q.cut([[330, 604], [330, 560], [440, 560], [440, 604]], 0.5, 6), C.stone2);
  well.p(q.cut(q.ell(385, 560, 58, 10, 18), 0.4, 5), shade(C.stone2, 0.1));
  well.p(q.ribbon([[342, 560], [346, 480]], 6) + q.ribbon([[428, 560], [424, 480]], 6) + q.ribbon([[336, 482], [434, 480]], 6), C.wood2);
  well.x(q.ribbon([[385, 482], [385, 530]], 1.4), C.rope);
  well.p(q.cut([[374, 530], [396, 530], [392, 548], [378, 548]], 0.3, 4), C.pot);
  G.add(tree.out() + well.out());
  // light that radiates from behind Jesus sits behind the crowd and the people (flat)
  const rayFx = S.layer({ par: 0.34, sh: 0, flat: true });
  const crowdL = crowd ? S.layer({ par: 0.34, sh: 4, rise }) : null;
  const CROWD = crowd ? [
    { seed: crowdSeeds[0], x: 470, y: 630, n: 9, flip: false },
    { seed: crowdSeeds[1], x: 1130, y: 630, n: 9, flip: true },
  ].map((g) => ({
    ...g,
    calm: crowdL.sprite(crowdMarkupM(g.seed, g.n, { s: 0.62, spread: 46, rows: 2, flip: g.flip }), g.x, g.y),
    wow: crowdL.sprite(crowdMarkupM(g.seed, g.n, { s: 0.62, spread: 46, rows: 2, flip: g.flip, armF: [60, 110], armB: [100, 160], head: [-10, -2] }), g.x, g.y),
  })) : [];
  CROWD.forEach((g) => g.wow.set({ o: 0 }));
  const backFx = S.layer({ par: 0.5, sh: 0, flat: true });
  const act = S.layer({ par: 0.5, sh: 5 });
  act.add(sheet().p(q.cut([[VQ.JX - 110, VQ.FEET + 2], [VQ.JX - 96, VQ.FEET - 14], [VQ.JX + 96, VQ.FEET - 14], [VQ.JX + 110, VQ.FEET + 2]], 0.5, 8), C.stone2).p(q.cut([[VQ.JX - 116, VQ.FEET], [VQ.JX + 116, VQ.FEET], [VQ.JX + 116, VQ.FEET + 16], [VQ.JX - 116, VQ.FEET + 16]], 0.4, 8), shade(C.stone2, -0.08)).out());
  const disc = dis.map((k, i) => ({ k, i, x: VQ.DX[i], seed: q.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[k] }))) }));
  const phs = Array.from({ length: ph }, (_, i) => ({ i, x: VQ.PX[i], seed: q.rr(0, 9), p: S.puppet(act.add(person(c, i === 1 ? scribeOpts(i) : phOpts(i)))) }));
  const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
  const W = S.layer({ par: 0.52, sh: 3 });
  return {
    c, q, sk, sk2, hangL, sunEl, far, mid, flyL, G, rayFx, crowdL, CROWD, backFx, act, disc, phs, jesus, W,
    amaze(k) { CROWD.forEach((g) => { g.calm.set({ o: 1 - k }); g.wow.set({ o: k }); }); },
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.1, 0.6, cl.i));
    },
    pose(t, time, J = {}, D = () => ({}), P = () => ({})) {
      this.update(time);
      jesus.set({ x: VQ.JX, y: VQ.FEET - 14, s: 1.04, flip: false, armF: 16, armB: 8, head: 0, blink: blinkAt(time), ...J });
      disc.forEach((d) => d.p.set({ x: d.x, y: VQ.FEET + (d.i % 2 ? 6 : 0), s: 0.96, flip: false, armF: 10, armB: 6, head: -2, blink: blinkAt(time, d.seed), ...D(d) }));
      phs.forEach((m) => m.p.set({ x: m.x, y: VQ.FEET + (m.i % 2 ? -4 : 4), s: 0.96, flip: true, armF: 8, armB: 4, head: 0, blink: blinkAt(time, m.seed), ...P(m) }));
    },
  };
}
export { helmet } from '../mark10/lib.js';
export { spear } from '../john7/lib.js';
export { sack } from '../matthew3/lib.js';
export { jar, linenRoll } from '../mark15/lib.js';
/** a round shield (origin centre) */
export function shield(c, r = 30, col = mix(C.rock3, C.storm2, 0.4)) {
  return sheet().p(c.cut(c.circ(0, 0, r, 26), 0.4, 4), col).p(c.cut(c.circ(0, 0, r * 0.72, 22), 0.3, 4), shade(col, 0.12)).p(c.cut(c.circ(0, 0, r * 0.2, 10), 0.2, 3), C.rock2).out();
}
/** a dark metal breastplate over a puppet's chest (body coords) */
export function armourPlate(c, col = mix(C.rock3, C.storm2, 0.5)) {
  const s = sheet();
  s.p(c.cut([[-24, -142], [24, -142], [30, -118], [30, -86], [-30, -86], [-30, -118]], 0.4, 5), col);
  s.x(c.ribbon([[-26, -104], [26, -104]], 2) + c.ribbon([[0, -140], [0, -88]], 2), shade(col, 0.2), 'opacity=".7"');
  return s.out();
}
export { childInArms } from '../matthew1/lib.js';
export { goldSlip } from '../matthew23/lib.js';

/* ================================================================== the Pharisee's table */
export const NOONHALL = ['#c9dcd8', '#f0e4c8', '#f7e8cc'];
export const DUSKHALL = ['#8c7fa8', '#dca58f', '#f0c9a0'];
/** the guests at this table: two Pharisees and, at the far end, a teacher of the Law */
export const TABLE_GUESTS = () => [phOpts(0), phOpts(2), LAWYER7];
/**
 * The Pharisee's dining court at midday (Simon's house of Luke 7, another host): the guests behind the low table,
 * the host on his cushion at the far end, Jesus on the couch at the near end, His legs stretched back. The lamps are
 * out (it is day) unless lit is given to update(). Returns the house handles plus puppets and a pose helper.
 */
export function dinnerSet(S, { skyCols = NOONHALL, sky2 = DUSKHALL, host = true, ceilTop } = {}) {
  const c = S.c;
  // ceilTop (optional, phone): where the ceiling sheet ends above, so the top of a tall screen is sky, not planks
  const R = simonHouseM(S, ceilTop === undefined ? { skyCols, sky2 } : { skyCols, sky2, ceilTop });
  const { FLOOR, JX, SEAT, TOP } = SHM;
  const G = TABLE_GUESTS();
  const guests = G.map((o, i) => ({ i, x: SHM.GUESTS[i], p: S.puppet(R.backL.add(person(c, { ...o, pose: 'sit' }))), seed: c.rr(0, 9) }));
  [[884, bowlM(c, { food: 'bread', color: C.stone2 })], [930, cupM(c)], [968, loafM(c, 15)], [1016, bowlM(c, { food: 'fruit', color: C.skyVeil })], [1056, cupM(c, C.clay)], [1090, loafM(c, 12)], [1118, `<g transform="scale(.5)">${jugJ(c)}</g>`]]
    .forEach(([x, m]) => R.tableL.add(`<g transform="translate(${x} ${TOP - 4})">${m}</g>`));
  R.frontL.add(`<g transform="translate(${JX + 44} ${FLOOR + 2})">${couchM(c, 270)}</g>`);
  R.frontL.add(`<g transform="translate(1172 ${FLOOR + 2})">${cushionJ(c, 130, C.teal2)}</g>`);
  const legs = R.frontL.add(`<g>${outLegsJ(c, { robe: C.linen, skin: C.skin })}</g>`);
  const jesus = S.puppet(R.frontL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
  const hostP = host ? S.puppet(R.frontL.add(person(c, { ...HOST, pose: 'sit' }))) : null;
  return {
    R, c, guests, legs, jesus, host: hostP, FLOOR, JX, SEAT, TOP, HX: 1172,
    /** everyone in their places; J, H: extra puppet options; g(guest) → extra options */
    seat(t, T, { J = {}, H = {}, g = () => ({}), lit = 0 } = {}) {
      R.update(t, T, { lit });
      jesus.set({ x: JX, y: FLOOR, s: 1.0, armF: 30, armB: 10, head: 2, blink: blinkAt(T), ...J });
      pose(legs, { x: JX, y: FLOOR, sx: -1, o: J.o ?? 1 });
      guests.forEach((q) => q.p.set({ x: q.x, y: SEAT, s: 0.9, flip: true, armF: 20, armB: 10, head: -4, blink: blinkAt(T, q.seed), ...g(q) }));
      if (hostP) hostP.set({ x: 1172, y: FLOOR, s: 0.96, flip: true, armF: 30, armB: 10, head: 4, blink: blinkAt(T, 3), ...H });
    },
  };
}
export { simonFacade } from '../luke7/lib.js';
export { basin, HOUSEBOY } from '../luke7/lib.js';
export { ewer } from '../john13/lib.js';
export { goblet as bigGoblet } from '../matthew23/lib.js';
export { BEGGAR } from '../matthew6/lib.js';
/** a potter's wheel with a clay bowl on it (origin: the wheel's foot) */
export function potterWheel(c) {
  const s = sheet();
  s.p(c.cut([[-8, 0], [8, 0], [6, -60], [-6, -60]], 0.3, 4), C.wood2);
  s.p(c.cut(c.ell(0, -4, 46, 8, 16), 0.3, 4), C.wood);
  s.p(c.cut(c.ell(0, -62, 40, 7, 16), 0.3, 4), C.wood3);
  return s.out();
}
/** a clay bowl being shaped (origin: its foot) */
export function clayBowl(c, w = 60, col = mix(C.clay, C.pot, 0.4)) {
  return sheet().p(c.cut([[-w * 0.3, 0], [w * 0.3, 0], [w / 2, -w * 0.5], [w * 0.42, -w * 0.52], [0, -w * 0.28], [-w * 0.42, -w * 0.52], [-w / 2, -w * 0.5]], 0.4, 5), col).out();
}
export { pointHand } from '../matthew7/lib.js';
export { altar } from '../mark12/lib.js';
export { sanctuary as templeModel } from '../mark11/lib.js';
export { keyProp } from '../mark13/lib.js';
