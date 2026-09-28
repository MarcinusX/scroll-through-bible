// Matthew 6 — the Sermon on the Mount, part two. The mountain is John 6's green hill over the lake (the
// same knoll, the same seated rows), so the discourse keeps returning to Jesus teaching there. This file adds
// the chapter's own images: the hypocrites' trumpet and the praise-wreath that withers, the shaft of light of
// "your Father who sees in secret", the inner room, a Galilean street with its synagogue, the paper-doll chains
// of heaven and earth, the moth, the rust and the thief, the lantern-body of the eye, Mammon, the lilies.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, hanging, sky } from '../kit.js';
import { band, house, grass, flowers, rock, bush, olive, cypress, palm, hillsWith, waterBand, town, sun, cloud } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { meadowRows, folk, group, TW } from '../john6/lib.js';

export { meadowRows, folk, group, TW, paperCrown, eyeIcon } from '../john6/lib.js';
export { kf, moving, hand, addToHead, coin, coinStack, heart, loaf, cup, ledger, scrap, speech, thought, wordSlip } from '../mark2/lib.js';
export { headAt, handAt, bubble, strip, question, stoneHeart, faceBits, withFace } from '../mark3/lib.js';
export { soulLight, lightCrown, glory, phylactery, balance, say, tag, bigQuestion } from '../mark8/lib.js';
export { fatherLight, idol } from '../john17/lib.js';
export { worryCloud, prayerLantern } from '../john14/lib.js';
export { scalesParts, poseScales } from '../john8/lib.js';
export { trumpetChest, purse, maskOnStick, throne } from '../mark12/lib.js';
export { hourglass, oven, keyProp, emptyBowl } from '../mark13/lib.js';
export { oilFlask, crown, oilDrop, tunic } from '../mark6/lib.js';
export { basinParts, ewer, waterStream, splash } from '../john13/lib.js';
export { beggarBowl, frown, face } from '../mark10/lib.js';
export { shadowHand } from '../mark14/lib.js';
export { lightShaft } from '../john19/lib.js';
export { casket } from '../matthew2/lib.js';
export { granary, sack } from '../matthew3/lib.js';
export { dollChain, pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { hungWord, rayBurst, glowDisc } from '../john1/lib.js';
export { sparkle, hang2 } from '../mark1/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const SPRING = ['#c9e0da', '#eef0d8', '#f8ecd0'];
export const NOON = ['#c2dcd8', '#ecefd9', '#f7eccf'];
export const GOLDEN = ['#dcc6b0', '#f2d3a2', '#f7e2bd'];
export const DUSK = ['#77709f', '#dca690', '#f3c99c'];
export const NIGHT = ['#171c42', '#29306a', '#4a5288'];
export const DAWN = ['#9a98bf', '#ecbfa6', '#f6dcbc'];
export const HEAVEN = ['#f1d49a', '#f8e2b4', '#fbeed2'];
export const GLOOM = ['#3b3552', '#5f5670', '#8a7c86'];

/* ================================================================== the cast */
/** a hypocrite: fine robes, a wide blue-banded prayer shawl, long beard (a look of his own, not a Pharisee's) */
export function hypocrite(i = 0) {
  return [
    { robe: C.linen, mantle: C.plumRobe, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.indigo, beard: 'full', beardColor: C.greyHair, belt: C.ochre },
    { robe: C.wheatRobe, mantle: C.tealRobe, skin: C.skin, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'wild', beardColor: C.hair3, belt: C.ochre },
    { robe: C.stone, mantle: C.mauve, skin: C.skin3, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, veil2: C.plumRobe, beard: 'full', beardColor: C.hair, belt: C.leather },
  ][i % 3];
}
/** the one who gives, prays and fasts "in secret": a plain man of Galilee (the same in every scene) */
export const QUIET = { robe: C.sageRobe, mantle: null, skin: C.skin3, hair: C.hair2, hairStyle: 'short', beard: 'short', belt: C.rope };
/** his wife and child (the home in the Our Father) */
export const WIFE = { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), skin: C.skin2, hair: C.hair, beard: 'none' };
export const CHILD = { robe: C.skyVeil, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.ochre };
export const BEGGAR = { robe: mix(C.stone2, C.rock2, 0.5), mantle: mix(C.wood3, C.stone2, 0.5), skin: C.skin4, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: C.greyHair };
export const SOLOMON = { robe: C.sun, mantle: C.plumRobe, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full', belt: C.terracotta };

/** a man / a woman of the crowd */
export function manOf(c, extra = {}) { return folk(c, true, extra); }
export function womanOf(c, extra = {}) { return folk(c, false, extra); }

/* ================================================================== the mountain */
/**
 * John 6's hillSet (the green mountain over the Sea of Tiberias), copied so that a second sky can sit right above
 * the first one (for evening falling): sky2 = [top, mid, bottom] adds a faded-out sky layer, returned as sky2.
 */
export function hillSet(S, { skyCols = SPRING, sky2 = null, sunAt = [1200, 150], knollX = 800, meadow = C.hillNear } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }).layer : null;
  if (sk2) sk2.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[580, 215, 200], [1010, 190, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 392, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  far.add(town(c, { x: 330, y: fb.fn(330) + 14, n: 7, spread: 240, sc: 0.42 }));
  const lake = S.layer({ par: 0.1, sh: 1 });
  lake.add(waterBand(c, { y: 418, color: mix(C.lake, C.skyBlue, 0.25), foamN: 18, bottom: 900 }).markup);
  const mid = S.layer({ par: 0.16, sh: 3 });
  const mh = hillsWith(c, { y: 486, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
  mid.add(mh.markup);
  const slopeL = S.layer({ par: 0.3, sh: 3 });
  const sfn = c.wave(560, [9, 4], [760, 240]);
  slopeL.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(meadow, C.sand, 0.22)).out());
  slopeL.add(olive(c, 170, 590, 0.8) + olive(c, 1460, 600, 0.85) + cypress(c, 1320, 580, 110));
  const G = S.layer({ par: 0.5, sh: 3 });
  const gfn0 = c.wave(700, [5, 2], [700, 180]);
  const gfn = (x) => gfn0(x) - Math.max(0, 1 - Math.abs(x - knollX) / 260) ** 2 * 34;
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 10, 1), mix(C.sage2, C.hillNear, 0.5)).out());
  G.add(rock(c, knollX - 10, gfn(knollX) + 16, 150, 44, C.rock2) + rock(c, knollX + 150, gfn(knollX + 150) + 14, 70, 26, C.rock));
  G.add(grass(c, { x0: -800, x1: 2400, y: 700, fn: gfn, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 700, fn: gfn, n: 14 }));
  return {
    sk, sky2: sk2, hangL, sunEl, slopeL, sfn, G, gfn, lake, far, mid,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 24, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2, o }));
    },
  };
}
/**
 * The mountain of the Sermon (John 6's hill over the lake): the seated rows on the slope, Jesus seated on the
 * knoll, six of the Twelve seated round Him. Returns handles; update(t, time, { armF, armB, head, lean }) poses Jesus.
 */
export const KX = 800;
const SEATS = [[-300, 'thomas'], [-220, 'andrew'], [-135, 'peter'], [135, 'john'], [220, 'james'], [300, 'matthew']];
export function mount(S, { skyCols = SPRING, sky2 = null, sunAt = [1210, 150], rows = true, dis = true } = {}) {
  const c = S.c;
  const set = hillSet(S, { skyCols, sky2, sunAt, knollX: KX });
  const crowd = rows ? meadowRows(S, set.sfn, { par: 0.3 }) : null;
  const act = S.layer({ par: 0.5, sh: 5 });
  const disc = dis ? SEATS.map(([dx, k], i) => {
    const x = KX + dx;
    return { k, i, x, y: set.gfn(x) + 14, flip: dx > 0, p: S.puppet(act.add(person(c, { ...(TW[k] || CAST[k]), pose: 'sit' }))), seed: c.rr(0, 9) };
  }) : [];
  const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
  const JY = set.gfn(KX) + 6;
  return {
    ...set, crowd, act, disc, jesus, JX: KX, JY,
    /** head of Jesus (for voice / light) */
    jHead: [KX + 2 * 0.92, JY + (-167 + 62) * 0.92],
    pose(t, time, { armF = 20, armB = 10, head = 0, lean = 0, blink = 0, o = 1, s = 0.92, flip = false } = {}) {
      set.update(time);
      jesus.set({ x: KX, y: JY, s, flip, armF, armB, head, lean, blink, o });
    },
    listen(time, fn = () => ({})) {
      disc.forEach((d) => {
        const e = fn(d) || {};
        d.p.set({ x: d.x, y: d.y, s: 0.78, flip: d.flip, armF: e.armF ?? 16 + (d.i % 3) * 8, armB: e.armB ?? 8, head: e.head ?? (d.flip ? 3 : -3), blink: e.blink ?? 0, o: e.o ?? 1 });
      });
    },
  };
}
/** the near foreground of the mountain (bushes left and right) */
export function mountFront(S) {
  const c = S.c;
  const fg = S.layer({ par: 0.9, sh: 6 });
  fg.add(bush(c, 90, 960, 260, C.sage, C.moss) + bush(c, 1530, 960, 260, C.moss, C.sage));
  return fg;
}

/* ================================================================== hanging plates */
/**
 * A painted plate on two strings (a flat let down from the flies), origin at its top centre.
 * Returns markup; the picture inside is drawn separately by the scene (so it can move).
 */
export function plateBoard(c, w, h, { fill = C.parchment, rim = C.wood3, sky: skyCol = null, ground = null, gy = 0.72 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 10, -10, w + 20, h + 20), 0.8, 10), rim);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 10), fill);
  if (skyCol) s.x(c.poly(c.rect(-w / 2 + 2, 2, w - 4, h * gy)), skyCol, 'opacity=".55"');
  if (ground) s.p(c.cut([[-w / 2, h * gy], ...Array.from({ length: 9 }, (_, i) => [-w / 2 + (w * (i + 0.5)) / 9, h * gy + c.rr(-8, 4)]), [w / 2, h * gy], [w / 2, h], [-w / 2, h]], 0.6, 8), ground);
  const str = `<path d="M${-w / 2 + 30} -10V-1600M${w / 2 - 30} -10V-1600" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return str + s.out();
}

/* ================================================================== the Father who sees in secret */
/** a soft shaft of light from the flies down to (0,0); origin at its foot */
export function secretShaft(c, { w0 = 26, w1 = 170, h = 1300 } = {}) {
  return `<path d="${c.poly([[-w0 / 2, -h], [w0 / 2, -h], [w1 / 2, 0], [-w1 / 2, 0]])}" fill="#fff3cf" opacity=".34"/><path d="${c.poly([[-w0 / 5, -h], [w0 / 5, -h], [w1 / 5, 0], [-w1 / 5, 0]])}" fill="#fff8e2" opacity=".42"/><ellipse rx="${w1 * 0.62}" ry="${w1 * 0.14}" fill="url(#halo-glow)"/>`;
}
/** the reward: a little gold star with a glow (origin centre) */
export function rewardStar(c, r = 14) {
  const s = sheet().p(c.cut(c.star(0, 0, r, r * 0.45, 5, -PI / 2), 0.2, 3), C.sun).x(c.poly(c.star(0, 0, r * 0.5, r * 0.22, 5, -PI / 2)), C.star);
  return `<circle r="${r * 3}" fill="url(#halo-glow)"/>${s.out()}`;
}

/* ================================================================== the hypocrites' reward */
/** a laurel wreath (green, or withered brown); origin centre; worn on the head at about (0, -8) head coords */
export function wreath(c, { r = 21, col = C.moss, col2 = C.leaf, dry = false } = {}) {
  const a = dry ? mix(C.wood3, C.sand2, 0.4) : col, b = dry ? mix(C.wood2, C.ochre, 0.3) : col2;
  let d1 = '', d2 = '';
  for (let i = 0; i < 14; i++) {
    const ang = PI * (0.98 + (i / 13) * 1.04);
    const x = Math.cos(ang) * r, y = Math.sin(ang) * r * 0.62;
    const leaf = c.cut(c.ell(x, y, 6.5, 3, 8, ang + PI / 2 + (i % 2 ? 0.5 : -0.5)), 0.2, 3);
    if (i % 2) d1 += leaf; else d2 += leaf;
  }
  const s = sheet().p(c.ribbon(c.arc(0, 0, r, r * 0.62, PI * 0.98, PI * 2.02, 14), 2.4), shade(a, -0.2)).p(d2, a).p(d1, b);
  if (!dry) s.x(c.ribbon([[-r - 2, 2], [-r - 8, 14]], 3) + c.ribbon([[r + 2, 2], [r + 8, 14]], 3), C.terracotta);
  return s.out();
}
/** a falling dry leaf (origin centre) */
export function dryLeaf(c, col = mix(C.wood3, C.sand2, 0.4)) { return `<path d="${c.cut(c.ell(0, 0, 6, 2.8, 8, 0.4), 0.2, 3)}" fill="${col}"/>`; }
/** applause: little strokes flying off two clapping hands (origin centre) */
export function clapMarks(c, r = 16, col = C.ochre) {
  let d = '';
  for (let i = 0; i < 5; i++) { const a = -PI * (0.15 + i * 0.17); d += c.ribbon([[Math.cos(a) * r, Math.sin(a) * r], [Math.cos(a) * r * 1.8, Math.sin(a) * r * 1.8]], 2.6); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a watching paper eye (origin centre) */
export function watchEye(c, r = 16, { iris = C.teal2 } = {}) {
  const s = sheet();
  const lid = [...c.arc(0, 0, r, r * 0.62, PI, 2 * PI, 10), ...c.arc(0, 0, r, r * 0.62, 0, PI, 10)];
  s.p(c.cut(lid, 0.3, 4), C.cream);
  s.x(c.poly(c.circ(0, 0, r * 0.42, 12)), iris);
  s.x(c.poly(c.circ(0, 0, r * 0.2, 10)), C.ink);
  s.x(c.poly(c.circ(-r * 0.14, -r * 0.14, r * 0.08, 6)), '#fff');
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.66, PI, 2 * PI, 10), 1.6), C.inkSoft);
  return s.out();
}
/** a long straight trumpet held by a herald (hold coords: grip at origin, bell forward +x and up) */
export function trumpet(c, len = 120) {
  const brass = mix(C.sun, C.ochre, 0.4);
  const s = sheet();
  s.p(c.ribbon([[-6, 4], [len * 0.9, -len * 0.22]], (u) => 5 + u * 3), brass);
  s.p(c.cut([[len * 0.82, -len * 0.18], [len + 6, -len * 0.4], [len + 18, -len * 0.1], [len * 0.9, -len * 0.16]], 0.2, 3), brass);
  s.x(c.ribbon([[len * 0.3, -len * 0.06], [len * 0.36, -len * 0.08]], 6), shade(brass, -0.25));
  s.x(c.ribbon([[-4, 2], [len * 0.84, -len * 0.2]], 1.2), shade(brass, 0.4), 'opacity=".7"');
  return s.out();
}
/** musical blast lines from a trumpet's bell (origin at the bell) */
export function blast(c, col = C.ochre) {
  let d = '';
  [-0.5, -0.1, 0.3].forEach((a, i) => { const r0 = 10, r1 = 36 + i * 6; d += c.ribbon([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], 3.4); });
  return `<path d="${d}" fill="${col}"/>`;
}

/* ================================================================== town */
/** a small synagogue facade with steps and columns; origin: the middle of its bottom step */
export function synagogue(c, { w = 420, h = 280 } = {}) {
  const s = sheet();
  const x0 = -w / 2, x1 = w / 2, base = -40, top = -h;
  s.p(c.cut(c.rect(x0 - 50, -20, w + 100, 22), 0.4, 8) + c.cut(c.rect(x0 - 30, -40, w + 60, 22), 0.4, 8), C.stone2);
  s.p(c.cut(c.rect(x0, top, w, base - top), 0.6, 10), C.cream);
  let bl = '';
  for (let y = top + 12; y < base - 24; y += 32) for (let x = x0 + (((y - top) / 32) % 2 ? 30 : 4); x < x1 - 50; x += 64) bl += c.cut(c.rect(x, y, 56, 26), 0.3, 7);
  s.x(bl, C.plaster2, 'opacity=".5"');
  s.p(c.cut([[x0 - 26, top + 4], [0, top - 96], [x1 + 26, top + 4]], 0.6, 10), C.plaster);
  s.p(c.cut([[x0 - 12, top - 4], [0, top - 82], [x1 + 12, top - 4]], 0.4, 10), shade(C.plaster, -0.05));
  s.p(c.cut(c.star(0, top - 36, 15, 7, 6, 0), 0.3, 3), C.sun);
  [[0, 70, 124], [-w * 0.3, 48, 92], [w * 0.3, 48, 92]].forEach(([x, dw, dh]) => s.p(c.cut([[x - dw / 2, base], [x - dw / 2, base - dh + dw / 2], ...c.arc(x, base - dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 10), [x + dw / 2, base]], 0.4, 6), C.soilDark));
  [-0.43, -0.15, 0.15, 0.43].forEach((f) => { const x = f * w; s.p(c.cut(c.rect(x - 12, top + 6, 24, base - top - 6), 0.4, 8), C.stone); s.p(c.cut(c.rect(x - 17, top + 2, 34, 10), 0.3, 6), C.stone2); });
  return s.out();
}
/** a long row of houses along a street (one sheet); origin world; returns markup */
export function streetRow(c, { x0 = -900, x1 = 2500, base = 600, skip = [], sc = 1 } = {}) {
  let hs = '';
  let x = x0, i = 0;
  while (x < x1) {
    const w = c.rr(120, 180) * sc, h = c.rr(100, 150) * sc;
    if (!skip.some(([a, b]) => x + w > a && x < b)) hs += house(c, x, base + c.rr(-3, 3), w, h, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0 });
    x += w + c.rr(30, 80) * sc;
    i++;
  }
  return hs;
}
/** cobbled street ground as one sheet; origin world */
export function street(c, { y = 640, col = mix(C.sand, C.stone, 0.4), x0 = -1100, x1 = 2700 } = {}) {
  const s = sheet();
  s.p(c.cut([[x0, y], [x1, y], [x1, 1900], [x0, 1900]], 0.8, 20), col);
  let cob = '';
  for (let i = 0; i < 110; i++) cob += c.cut(c.blob(c.rr(x0 + 200, x1 - 200), c.rr(y + 20, y + 420), c.rr(10, 22), c.rr(5, 9), 8, 0.2), 0.3, 4);
  s.x(cob, C.stone2, 'opacity=".55"');
  return s.out();
}

/* ================================================================== the inner room */
/**
 * A cutaway of a small house: the front wall is cut away so we see the inner store-room with its door,
 * a shelf and jars, a small high window. Origin: floor centre of the room. Returns { back, doorFrame, w, h }.
 */
export function innerRoom(c, { w = 360, h = 260, wall = mix(C.plaster2, C.clay, 0.2), dark = mix(C.soilDark, C.plumRobe, 0.2) } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.5, 10), wall);
  s.p(c.cut(c.rect(-w / 2, -8, w, 8), 0.3, 8), shade(wall, -0.2));
  // a little high window
  s.p(c.cut(c.rect(w * 0.12, -h + 40, 40, 30), 0.3, 4), mix(C.skyBlue, C.cream, 0.4));
  s.x(c.ribbon([[w * 0.12 + 20, -h + 40], [w * 0.12 + 20, -h + 70]], 3), C.wood2);
  // a shelf with jars
  s.p(c.cut(c.rect(-w / 2 + 20, -h + 120, 120, 8), 0.3, 5), C.wood);
  let jars = '';
  [-w / 2 + 40, -w / 2 + 76, -w / 2 + 112].forEach((x, i) => { jars += c.cut([[x - 10, -h + 120], [x - 13, -h + 104], [x - 6, -h + 94 - i * 3], [x + 6, -h + 94 - i * 3], [x + 13, -h + 104], [x + 10, -h + 120]], 0.3, 4); });
  s.p(jars, C.pot);
  // the doorway on the right (dark), the door leaf is separate
  const dw = 70, dh = 150, dx = w / 2 - dw - 24;
  s.p(c.cut(c.rect(dx, -dh, dw, dh), 0.3, 6), dark);
  return { back: s.out(), w, h, door: { x: dx, w: dw, h: dh } };
}
/** a plank door leaf hinged on its left edge (origin at the hinge, bottom) */
export function doorPlank(c, w = 70, h = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(0, -h, w, h), 0.3, 6), C.wood);
  s.x(c.ribbon([[w * 0.33, -h + 4], [w * 0.33, -4]], 1.6) + c.ribbon([[w * 0.66, -h + 4], [w * 0.66, -4]], 1.6), shade(C.wood, -0.25), 'opacity=".6"');
  s.p(c.ribbon([[4, -h * 0.25], [w - 4, -h * 0.25]], 7) + c.ribbon([[4, -h * 0.75], [w - 4, -h * 0.75]], 7), C.wood2);
  s.x(c.poly(c.circ(w - 12, -h * 0.5, 3.4, 8)), C.ochre);
  return s.out();
}

/* ================================================================== paper-doll chains */
/**
 * A chain of paper dolls holding hands, cut from one folded strip: n dolls h tall, each in its own colour
 * (cols cycles). Origin: the middle of their feet. gold: a gold chain with little halos (heaven's).
 */
export function peopleChain(c, n = 9, { h = 80, cols = [C.dustyBlue, C.roseRobe, C.sageRobe, C.wheatRobe, C.mauve, C.tealRobe], skin = [C.skin, C.skin2, C.skin3, C.skin4], gold = false } = {}) {
  const w = h * 0.62, r = h * 0.14;
  const s = sheet();
  let arms = '', faces = '', halos = '';
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * w;
    const body = c.cut([[x - h * 0.09, -h + r * 1.9], [x + h * 0.09, -h + r * 1.9], [x + h * 0.2, -h * 0.5], [x + h * 0.27, 0], [x - h * 0.27, 0], [x - h * 0.2, -h * 0.5]], 0.4, 4);
    s.p(body, gold ? (i % 2 ? C.halo : mix(C.halo, C.sun, 0.4)) : cols[i % cols.length]);
    faces += c.cut(c.circ(x, -h + r, r, 14), 0.3, 3);
    if (gold) halos += c.cut(c.circ(x, -h + r - 2, r * 1.5, 16), 0.3, 3);
    if (i < n - 1) arms += c.ribbon([[x + h * 0.1, -h * 0.66], [x + w * 0.5, -h * 0.6], [x + w - h * 0.1, -h * 0.66]], h * 0.07);
  }
  const out = sheet();
  if (gold) out.p(halos, C.haloRim);
  const armCol = gold ? mix(C.halo, C.sun, 0.25) : mix(C.skin2, C.wheatRobe, 0.2);
  return out.out() + s.out() + sheet().p(arms, armCol).p(faces, gold ? C.star : skin[0]).out();
}

/* ================================================================== debts */
/** the slate: a wooden frame with dark wax (origin centre) */
export function slate(c, w = 150, h = 104) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), C.wood2);
  s.p(c.cut(c.rect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20), 0.3, 6), mix(C.ochre, C.wood3, 0.4));
  return `<path d="M-30 ${-h / 2}L0 ${-h / 2 - 50}L30 ${-h / 2}" stroke="${C.inkSoft}" stroke-width="1.6" fill="none" opacity=".6"/>` + s.out() + `<circle cy="${-h / 2 - 50}" r="3.4" fill="${C.soilDark}"/>`;
}
/** a note of debt: a small parchment with scribbles and a seal, as two halves (origin centre of the whole) */
export function noteHalf(c, side, w = 46, h = 58) {
  const s = sheet();
  const x0 = side < 0 ? -w / 2 : 0, x1 = side < 0 ? 0 : w / 2;
  const tear = [];
  for (let i = 0; i <= 6; i++) tear.push([c.rr(-3, 3), -h / 2 + (h * i) / 6]);
  const pts = side < 0 ? [[x0, -h / 2], ...tear, [x0, h / 2]] : [[x1, -h / 2], [x1, h / 2], ...tear.slice().reverse()];
  s.p(c.cut(side < 0 ? [[x0, -h / 2], ...tear, [x0, h / 2]] : [...tear, [x1, h / 2], [x1, -h / 2]], 0.3, 4), C.parchment);
  let ln = '';
  for (let y = -h / 2 + 10; y < h / 2 - 12; y += 8) ln += c.ribbon([[x0 + 4, y], [x1 - 4, y]], 1.2);
  s.x(ln, C.ink, 'opacity=".45"');
  if (side > 0) s.x(c.poly(c.circ(w / 4 - 2, h / 2 - 10, 5, 10)), C.terracotta);
  return s.out();
}

/* ================================================================== days */
/** John 2's day-disc, with the word fitted inside the disc (English "tomorrow" is long): .off (unlit) and .lit */
export function dayDisc(c, label, r = 24) {
  const size = Math.min(r * 0.95, (r * 1.7) / (0.5 * String(label).length));
  const off = sheet().p(c.cut(c.circ(0, 0, r + 4, 20), 0.3, 3), C.stone2).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), C.parchment).out();
  const on = sheet().p(c.cut(c.star(0, 0, r * 1.45, r * 1.1, 14, 0), 0.3, 3), C.sunDeep).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), C.sun).out();
  const txt = (col) => `<text x="0" y="${(size * 0.36).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size.toFixed(1)}" font-style="italic" fill="${col}">${label}</text>`;
  return `<g class="off">${off}${txt(C.inkSoft)}</g><g class="lit" opacity="0"><circle r="${r * 2.4}" fill="url(#warm-glow)"/>${on}${txt(C.cream)}</g>`;
}

/* ================================================================== misc */
/** a heap of paper slips (origin: bottom centre) */
export function slipHeap(c, w, h) {
  const s = sheet();
  const pts = [[-w / 2, 0], ...c.arc(0, 0, w / 2, h, PI, 2 * PI, 12), [w / 2, 0]];
  s.p(c.cut(pts, 1.4, 6), mix(C.cream, C.parchment, 0.4));
  let sl = '', ink = '';
  for (let i = 0; i < w * h / 500; i++) {
    const a = c.rr(PI * 1.05, PI * 1.95), r = Math.sqrt(c.rr(0.05, 0.95));
    const x = Math.cos(a) * w / 2 * r, y = Math.sin(a) * h * r;
    const rot = c.rr(-0.8, 0.8), L = c.rr(14, 22);
    sl += c.cut([[x - L * Math.cos(rot), y - L * Math.sin(rot) - 5], [x + L * Math.cos(rot), y + L * Math.sin(rot) - 5], [x + L * Math.cos(rot), y + L * Math.sin(rot) + 5], [x - L * Math.cos(rot), y - L * Math.sin(rot) + 5]], 0.3, 6);
    ink += c.ribbon([[x - L * 0.6 * Math.cos(rot), y - L * 0.6 * Math.sin(rot)], [x + L * 0.5 * Math.cos(rot), y + L * 0.5 * Math.sin(rot)]], 1.4);
  }
  s.p(sl, C.cream);
  s.x(ink, C.ink, 'opacity=".4"');
  return s.out();
}


/** a clay lamp on a small stand (lit), origin: base */
export function smallLamp(c, { lit = true } = {}) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [28, -9], [18, -2], [10, 0]], 0.3, 4), C.pot);
  return `${lit ? `<circle cx="26" cy="-22" r="60" fill="url(#warm-glow)"/>` : ''}${s.out()}${lit ? `<path d="M26 -12C21 -16 22 -24 26 -32C30 -24 31 -16 26 -12Z" fill="${C.lampFlame}"/>` : ''}`;
}
export { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, hanging };
