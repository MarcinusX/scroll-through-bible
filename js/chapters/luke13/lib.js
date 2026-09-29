// Luke 13 — the cast and cut-outs of this chapter. New here: the woman bent double for eighteen years (a two-piece
// puppet hinged at the hip, so she can straighten up as a whole cut-out), the ruler of the synagogue, the owner of the
// vineyard and his vinedresser, the man who asks "will only a few be saved?". The sets: a slope by a road on the way
// through Galilee where Jesus teaches and the painted flats come down (the Galileans at the altar, the tower of Siloam),
// the vineyard with its barren fig tree, the house with the narrow door, the road over the hills with Jerusalem far off.
// Everything else is borrowed: Mark 1's synagogue, Matthew 13's mustard tree and kneading trough, Matthew 23's hen,
// Mark 11's fig tree and Jerusalem, John 2's ox, Mark 11's donkey, Mark 12's patriarchs, Mark 6's Herod, Mark 1's fox.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, house, olive, cypress, bush, rock, grass, flowers, sun, cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { pose3 } from '../matthew4/lib.js';
import { folk as folkJ } from '../john6/lib.js';
import { voiceRings, synagogueInterior } from '../mark1/lib.js';
import { village } from '../luke4/lib.js';
import { jerusalem } from '../mark11/lib.js';

export { tr, es, ease, bump, seg, fade };
export { still, kingdomDisc, walledTown, roadSet, MORNING, DAY, GOLDEN, EVENING, DUSK, NIGHT } from '../luke8/lib.js';
export { flat, flatSky, flatHills, fig, flatText, flyTo, dropK } from '../luke1/lib.js';
export { figure, bake, manO, womanO, village, smallSynagogue } from '../luke4/lib.js';
export { PILATE, sinSack, lightDisc } from '../luke3/lib.js';
export { voiceRings, sparkle, fox, hourglassParts, headAt, hand, signpost, synagogueInterior } from '../mark1/lib.js';
export { kf, moving, thought, speech, heart, GLYPH, loaf, cup, sabbathTag, jug, candle } from '../mark2/lib.js';
export { bubble, question, pharisee, nameTag, strip, tapeX, withFace, faceBits, spiral } from '../mark3/lib.js';
export { crown, storyFrame, LOOK as L6 } from '../mark6/lib.js';
export { figTree, figs, jerusalem, clothBanner, frond, hungWord, lamb, colt, sanctuary } from '../mark11/lib.js';
export { LOOK as L12, altar, hoe } from '../mark12/lib.js';
export { soldier, soldierSil } from '../mark15/lib.js';
export { pose3, bakeArms, tiltHead, folk4 } from '../matthew4/lib.js';
export { mustardTree2, mustardSeed, nest, trough as kneadTrough, flourSack, leaven, oven, storeJar, bubbleDot, discPlate, cabbage, leek, onion, hangAt } from '../matthew13/lib.js';
export { hen, chick, face } from '../matthew23/lib.js';
export { doorLeafW, doorLight, bigBundle } from '../matthew7/lib.js';
export { equals } from '../luke6/lib.js';
export { roundel, standard, ISAIAH, MOSES, L9 } from '../luke7/lib.js';
export { medal } from '../matthew1/lib.js';
export { ox } from '../john2/lib.js';
export { manger } from '../john1/lib.js';
export { trough as waterTrough } from '../john4/lib.js';
export { spade } from '../matthew25/lib.js';
export { axe } from '../matthew3/lib.js';
export { crossOut } from '../john1/lib.js';
export { group, folk } from '../john6/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== skies */
export const NOON13 = ['#c9dcd6', '#eee8d0', '#f7ead0'];
export const LATE = ['#d8c7a8', '#f0d6a8', '#f6e3bf'];
export const TEMPLE_SKY = ['#e6d6b6', '#f3e2c0', '#f8ecd4'];
export const SUNSET = ['#9d8fb6', '#e9a98c', '#f4cf9c'];
export const NIGHT13 = ['#1d2350', '#313a74', '#565f96'];

/* ================================================================== the cast */
/** the woman bent double for eighteen years: a faded mauve robe, a grey-brown mantle, a stone-grey veil */
export const BENT = { robe: C.mauve, mantle: mix(C.stone2, C.plumRobe, 0.28), mantleArm: true, hairStyle: 'veil', veil: C.stone, veil2: shade(C.stone, -0.16), hair: C.greyHair, skin: C.skin2, belt: null };
/** the ruler of the synagogue: white linen, a deep blue mantle with a gold edge, a white turban */
export const RULER = { robe: C.linen2, mantle: mix(C.dustyBlue, C.indigo, 0.28), hairStyle: 'wrap', veil: C.linen, veil2: C.ochre, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin3, belt: C.ochre };
/** the two who bring the news of the Galileans */
export const TELL = [
  { robe: C.clayMantle, hairStyle: 'wrap', veil: C.linen2, veil2: shade(C.linen2, -0.12), beard: 'full', hair: C.hair3, skin: C.skin3, belt: C.leather },
  { robe: C.dustyBlue, mantle: C.stone, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2 },
];
/** the vineyard's owner and his vinedresser */
export const OWNER = { robe: C.wheatRobe, mantle: C.plumRobe, hairStyle: 'wrap', veil: C.cream, veil2: C.plumRobe, beard: 'full', beardColor: C.hair3, hair: C.hair3, skin: C.skin2, belt: C.ochre };
export const DRESSER = { robe: mix(C.sageRobe, C.olive, 0.3), hairStyle: 'wrap', veil: C.sand2, veil2: shade(C.sand2, -0.12), hair: C.hair2, beard: 'short', skin: C.skin4, belt: C.rope };
/** the man of the mustard seed; the woman with the leaven */
export const SOWER13 = { robe: C.ochreRobe, hairStyle: 'curly', hair: C.hair, beard: 'short', skin: C.skin2, belt: C.leather };
export const BAKER13 = { robe: C.tealRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.14), hair: C.hair3, skin: C.skin3, belt: C.ochre };
/** the one on the road who asks "will only a few be saved?" */
export const ASKER = { robe: C.wheatRobe, mantle: C.tealRobe, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin };
/** the Galilean pilgrims at the altar (in the flat) */
export const PILGRIMS = [
  { robe: C.sageRobe, hairStyle: 'wrap', veil: C.linen2, beard: 'full', hair: C.hair3, skin: C.skin3, belt: C.leather },
  { robe: C.ochreRobe, mantle: C.dustyBlue, hairStyle: 'short', beard: 'short', hair: C.hair2, skin: C.skin2 },
  { robe: C.roseRobe, hairStyle: 'curly', beard: 'none', hair: C.hair, skin: C.skin },
];

/* ================================================================== small helpers */
/** a whole cut-out figure, baked arms and head (origin: feet), scale s, flip faces left */
export function fig13(c, o, { s = 1, flip = false, armF = 0, armB = 0, head = 0 } = {}) {
  let m = person(c, o);
  if (armF) m = m.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-armF})">`);
  if (armB) m = m.replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB})">`);
  if (head) m = m.replace('<g class="headr">', `<g class="headr" transform="rotate(${head})">`);
  return `<g transform="scale(${flip ? -s : s} ${s})">${m}</g>`;
}
/** a hanging piece on a string from the flies (origin: where the string meets it) */
export const onString = (inner, len = 1600) => `<path d="M0 ${-len}V0" stroke="${STRING}" stroke-width="1.2" fill="none"/>${inner}`;
/** a little paper tag with a word (origin: its centre) */
export function wordTag(c, text, { size = 22, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || String(text).length * size * 0.5 + size * 1.3, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a disc tag with a number or glyph and a rim (origin centre) */
export function numDisc(c, text, { r = 26, fill = C.cream, rim = C.haloRim, ink = C.ink, size } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 4, 26), 0.4, 4), rim).p(c.cut(c.circ(0, 0, r, 26), 0.4, 4), fill);
  return `${s.out()}<text x="0" y="${((size || r) * 0.36).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size || r * 1.05}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a straight rope segment 100 long along +x (pose it with sx = length / 100, r = angle) */
export function ropeSeg(c, w = 4, col = C.rope) {
  return sheet().p(c.ribbon([[0, 0], [25, 1.2], [50, -0.6], [75, 1], [100, 0]], w), col).out();
}
/** place a unit rope from (x0, y0) to (x1, y1) */
export function ropeTo(el, x0, y0, x1, y1, o = 1) {
  const L = Math.hypot(x1 - x0, y1 - y0), r = (Math.atan2(y1 - y0, x1 - x0) * 180) / PI;
  pose(el, { x: x0, y: y0, r, sx: Math.max(0.001, L / 100), sy: 1, o });
}
/** where the front hand of a puppet is (armF in degrees), world coords */
export function handF(x, y, s, flip, a, dy = 0) {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s];
}

/** Luke 8's knot of people (same cut for the same seed), also returning where each member stands: { m, mem } */
export function crowdKnot(seed, n, { s = 0.8, spread = 40, rows = 2, flip = false, pose: P = 'stand', arms = [0, 30], armB = [0, 10], head = [-6, 4], women = null } = {}) {
  const c = makeCutter(seed);
  const per = Math.ceil(n / rows);
  const mem = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), k = i % per;
    const man = women === null ? null : !women;
    mem.push({ x: (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-5, 5), y: r * 14 + c.rr(-2, 2), s: s * c.rr(0.93, 1.05) * (1 - r * 0.04), flip, head: c.rr(head[0], head[1]), armF: c.rr(arms[0], arms[1]), armB: c.rr(armB[0], armB[1]), o: { ...folkJ(c, man), pose: P } });
  }
  return { m: pose3(c, mem), mem };
}
export const knot = (seed, n, o) => crowdKnot(seed, n, o).m;
/** the same knot with every arm raised */
export const knotUp = (seed, n, o = {}) => knot(seed, n, { ...o, arms: [110, 150], armB: [120, 160], head: [-12, -6] });
/** the same knot bowed low (heads down, hands to the face) */
export const knotBow = (seed, n, o = {}) => knot(seed, n, { ...o, arms: [120, 140], armB: [60, 90], head: [18, 26] });

/* ================================================================== the slope by the road where He teaches */
/** where the flats hang: centre FX, FY; size FW × FH, scaled by K */
export const TG = { GY: 724, JX: 800, FX: 800, FY: 290, FW: 440, FH: 250, K: 1.12 };
export const flatY = (k) => lerp(-1500, TG.FY, k);
/**
 * A green slope under the hills of Galilee: a village on the ridge with its vineyard terraces, a road winding down
 * from the right (the way to Jerusalem), olive trees. People stand and sit on both sides (sprites); painted flats come
 * down above Jesus' head (layer FL, with `bits` for pieces that move on them). The same cut in every scene.
 * Returns { c, sk2, hangL, FL, bits, crowdL, act, fx, jesus, voice, groups, update(t, T) }.
 */
export function teachSet(S, { skyCols = DAY13, sky2 = null, crowd = true, extra = false } = {}) {
  const c = makeCutter('lk13-teach');
  sky(S, skyCols);
  let sk2 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: 1270, y: 130, len: 800 });
  const cls = [[400, 150, 180], [1010, 96, 130]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 410, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.1) }).markup);
  const ridge = S.layer({ par: 0.16, sh: 3 });
  const h1 = hillsWith(c, { y: 470, amps: [20, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 22 });
  ridge.add(h1.markup);
  // the village on the ridge, and the vineyard terraces below it
  ridge.add(village(c, 300, h1.fn(300) + 10, { n: 7, spread: 240, sc: 0.55 }) + village(c, 1330, h1.fn(1330) + 10, { n: 5, spread: 160, sc: 0.5 }));
  let vines = '', walls = '';
  for (let r = 0; r < 3; r++) {
    const y = 492 + r * 18;
    walls += c.ribbon([[120, y + 6], [560, y + 4 + c.rr(-2, 2)]], 3.4);
    for (let x = 130 + (r % 2) * 14; x < 550; x += 28) vines += c.cut(c.blob(x, y - 3, 10, 7, 8, 0.25), 0.4, 3);
  }
  ridge.add(sheet().p(walls, mix(C.stone2, C.hillMid, 0.3)).p(vines, C.moss).out());
  const slope = S.layer({ par: 0.3, sh: 3 });
  const sfn = c.wave(560, [9, 4], [800, 230]);
  const sl = sheet();
  sl.p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.15));
  // the road winding down from the right
  sl.p(c.ribbon([[2500, 560], [1700, 572], [1380, 600], [1180, 640], [1060, 690], [1010, 760]], (u) => 22 + u * 40, 1.5), mix(C.sand, C.stone, 0.3));
  slope.add(sl.out());
  slope.add(olive(c, 170, 572, 0.9) + cypress(c, 260, 566, 130) + olive(c, 1480, 590, 0.8) + bush(c, 640, 574, 60, C.sage2, C.sage) + grass(c, { x0: -800, x1: 2400, y: 560, fn: sfn, n: 60, h: 12, color: C.olive }));
  const G = S.layer({ par: 0.5, sh: 3 });
  const gfn = c.wave(TG.GY - 30, [5, 2], [700, 200]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out() + grass(c, { x0: -800, x1: 2400, y: TG.GY - 30, fn: gfn, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: TG.GY - 26, fn: gfn, n: 16 }));
  const FL = S.layer({ par: 0.3, sh: 6 });
  const bits = S.layer({ par: 0.3, sh: 5 });
  // optional: a sheet behind the people (things on their backs), a shade over them and a glow sheet in front of it
  const behindL = extra ? S.layer({ par: 0.5, sh: 3 }) : null;
  const crowdL = S.layer({ par: 0.5, sh: 4 });
  let shadeL = null, glowL = null;
  if (extra) {
    const gid = S.id('shadegrad');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="470" x2="0" y2="660"><stop offset="0" stop-color="#2a2238" stop-opacity="0"/><stop offset="1" stop-color="#2a2238" stop-opacity="1"/></linearGradient>`);
    shadeL = S.layer({ par: 0.5, sh: 0, flat: true, pad: 2400 });
    let strips = '';
    [0.18, 0.36, 0.55, 0.75].forEach((o, i) => { strips += `<rect x="${300 + i * 36}" y="470" width="36" height="1300" fill="url(#${gid})" opacity="${o}"/>`; });
    shadeL.add(`<g>${strips}<rect x="444" y="470" width="4200" height="1300" fill="url(#${gid})"/></g>`);
    shadeL.fade(0);
    glowL = S.layer({ par: 0.5, sh: 0, flat: true });
  }
  const groups = [];
  if (crowd) {
    [[470, TG.GY - 8, 'a', 6, false, 'stand', 0.9], [1130, TG.GY - 8, 'b', 6, true, 'stand', 0.9], [575, TG.GY + 40, 'c', 3, false, 'sit', 0.92], [1025, TG.GY + 40, 'd', 3, true, 'sit', 0.92]].forEach(([x, y, k, n, flip, P, s], i) => {
      const o = { s, spread: 46, rows: P === 'sit' ? 1 : 2, flip, pose: P };
      const K = crowdKnot('lk13-t-' + k, n, o);
      groups.push({ i, x, y, k, n, flip, P, s, o, mem: K.mem, sp: crowdL.sprite(K.m, x, y) });
    });
  }
  const act = S.layer({ par: 0.5, sh: 5 });
  const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
  const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 34, w: 5 });
  const fx = S.layer({ par: 0.5, sh: 6 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  const bank = c.wave(935, [10, 4], [520, 170]);
  fg.add(sheet().p(c.ridge(bank, -1200, 2800, 1800, 14, 1.2), C.sage).out() + grass(c, { x0: -1200, x1: 2800, y: 935, fn: bank, n: 70, h: 26, color: C.moss }) + flowers(c, { x0: -1200, x1: 2800, y: 935, fn: bank, n: 22, h: 30 }));
  return {
    c, sk2, hangL, FL, bits, crowdL, behindL, shadeL, glowL, act, fx, fg, jesus, voice, groups, sfn,
    update(t, T) {
      swing(sunEl, 1270, 130, T, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));
    },
  };
}
export const DAY13 = ['#c9ddd8', '#ecebd6', '#f6ead0'];

/* ================================================================== the woman bent double */
/**
 * The bent woman as a two-piece cut-out hinged at the hip: legs (still) and the upper body, which turns forward
 * about the hip as one piece (the compositor turns it; nothing repaints). Both arms are baked hanging straight down
 * from the bent shoulders. Returns { set({x, y, s, bend, o, flip}), hip(x, y, s), handAt(x, y, s, bend, flip) }.
 * bend: degrees the upper body leans forward (0 = straight). The hinge is covered by a round "pin" of her mantle.
 */
export const HIP = 94;
export function bentWoman(S, L, look, { bendArms = 62, extraUpper = '' } = {}) {
  const c = S.c;
  const idA = S.id('bwA'), idB = S.id('bwB');
  const m = person(c, { ...look, holdF: '', holdB: '' })
    .replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-bendArms})">`)
    .replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-bendArms + 8})">`)
    .replace('<g class="headr">', '<g class="headr" transform="rotate(-18)">');
  const col = look.mantle || look.robe;
  const legs = L.add(`<g><clipPath id="${idA}"><rect x="-90" y="${-HIP - 4}" width="180" height="${HIP + 20}"/></clipPath><g clip-path="url(#${idA})">${m}</g>${sheet().p(c.cut(c.ell(0, -HIP + 2, 31, 14, 16), 0.4, 4), shade(col, -0.05)).out()}</g>`);
  const upper = L.add(`<g><clipPath id="${idB}"><rect x="-120" y="-420" width="240" height="${420 - HIP + 6}"/></clipPath><g transform="translate(0 ${HIP})"><g clip-path="url(#${idB})">${m}</g>${extraUpper}</g></g>`);
  return {
    legs, upper,
    set({ x, y, s = 1, bend = 0, o = 1, flip = false }) {
      const d = flip ? -1 : 1;
      pose(legs, { x, y, s, sx: d, o });
      pose(upper, { x, y: y - HIP * s, s, sx: d, r: bend * d, o });
    },
    /** a point given in the upright person's coords (feet origin), after the bend */
    at(px, py, x, y, s, bend, flip = false) {
      const d = flip ? -1 : 1, r = (bend * PI) / 180;
      const lx = px, ly = py + HIP;
      const rx = lx * Math.cos(r) - ly * Math.sin(r), ry = lx * Math.sin(r) + ly * Math.cos(r);
      return [x + d * rx * s, y - HIP * s + ry * s];
    },
  };
}
/** where the bent woman's front hand is, in upright person coords (arms baked at bendArms) */
export function bentHandLocal(bendArms = 62) {
  const r = (bendArms * PI) / 180;
  return [7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), -138 - 1.5 * Math.sin(r) + 57 * Math.cos(r)];
}
/** a plain walking stick (origin: its top, where the hand holds it) */
export function stick(c, len = 120) {
  return sheet().p(c.ribbon([[0, -4], [1.5, len * 0.5], [0, len]], (u) => 5.4 - u * 1.4), C.wood2).p(c.cut(c.ell(0, -4, 5, 4, 8), 0.2, 2), shade(C.wood2, -0.2)).out();
}
/** the dark cords that bind her: loops round the shoulders and back (drawn in upright person coords) */
export function bonds(c, col = '#4a3f52') {
  let d = '';
  [[-132, -4], [-116, 3], [-100, -2]].forEach(([y, k]) => { d += c.ribbon(c.qbez([-29, y + k], [0, y + 5], [29, y - k], 8), 3, 0.4); });
  d += c.ribbon([[-24, -134], [26, -98]], 3, 0.4);
  return sheet().p(d, col).out();
}
/** a loose, broken piece of that cord (origin centre) */
export function cordBit(c, len = 60, col = '#3b3040') {
  return sheet().p(c.ribbon(c.cbez([-len / 2, 0], [-len / 6, -10], [len / 6, 12], [len / 2, 0], 12), 4, 0.5), col).out();
}

/* ================================================================== the synagogue on the Sabbath */
/**
 * Mark 1's synagogue (the same cut as everywhere in the Gospels), with its people on the benches as still sprites.
 * Returns the interior plus { back (sprites), L (people layer at the floor's parallax) }.
 */
export function synSet(S, { up = false } = {}) {
  const I = synagogueInterior(S);
  const [BACK, FRONT] = I.benchY;
  const L = S.layer({ par: I.P, sh: 4 });
  const mk = (k, n, flip, arms) => knot('lk13-syn-' + k, n, { s: 0.78, spread: 70, rows: 1, flip, pose: 'sit', ...(arms ? { arms: [70, 110], armB: [120, 160], head: [-14, -8] } : {}) });
  const row = (list, y) => list.map(([x, k, n, flip]) => ({ x, y, a: L.sprite(mk(k, n, flip, false), x, y), b: up ? L.sprite(mk(k, n, flip, true), x, y) : null }));
  const back = row([[430, 'a', 5, false], [1170, 'b', 4, true]], BACK - 8);
  I.front(L);
  const front = row([[330, 'c', 3, false], [1270, 'd', 3, true]], FRONT - 4);
  const all = [...back, ...front];
  return {
    I, L, back, front, all, BACK, FRONT,
    /** k: 0 → seated as they are, 1 → arms raised in joy */
    set(k = 0) { all.forEach((g, i) => { const e = Math.min(1, Math.max(0, k * 1.4 - i * 0.08)); g.a.set({ x: g.x, y: g.y, o: g.b ? 1 - e : 1 }); if (g.b) g.b.set({ x: g.x, y: g.y, o: e }); }); },
  };
}

/* ================================================================== the vineyard */
export const VY = { GY: 700, TX: 800 };
/**
 * A vineyard on a hillside at the end of summer: a stone wall with a watch-hut, rows of vines on trellises
 * behind, the fig tree in the middle (its trunk, crown and roots are separate pieces), its patch of soil (dry and
 * grey, dug, then dark with manure). Returns layers and the tree's pieces.
 */
export function vineyardSet(S, { skyCols = LATE, sky2 = null } = {}) {
  const c = makeCutter('lk13-vineyard');
  sky(S, skyCols);
  let sk2 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: 1240, y: 150, len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 430, y: 140, len: 800 });
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.dune, 0.2) }).markup);
  const back = S.layer({ par: 0.2, sh: 3 });
  const h = hillsWith(c, { y: 450, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.wheat, 0.15), trees: 14, treeColor: C.sage, treeH: 20 });
  back.add(h.markup + village(c, 380, h.fn(380) + 8, { n: 6, spread: 200, sc: 0.5 }));
  // the watch-hut on the far wall
  const hut = sheet();
  hut.p(c.cut([[1080, 474], [1086, 384], [1160, 380], [1166, 474]], 0.5, 6), mix(C.stone, C.sand2, 0.3));
  hut.p(c.cut([[1070, 388], [1122, 350], [1176, 388]], 0.5, 6), C.roof);
  hut.p(c.cut(c.rect(1114, 434, 18, 40), 0.3, 4), C.soilDark);
  back.add(hut.out());
  // rows of vines on their trellises, three rows receding
  const rows = S.layer({ par: 0.3, sh: 3 });
  const rs = sheet();
  rs.p(c.ridge(c.wave(488, [4, 2], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.wheat, 0.18));
  rows.add(rs.out());
  [[500, 0.55], [540, 0.72], [590, 0.9]].forEach(([y, k], r) => {
    const s = sheet();
    let posts = '', wire = '', leaves = '', grapes = '';
    for (let x = -700 + r * 40; x < 2300; x += 70 * k) {
      if (Math.abs(x - 800) < 170 * k && r === 2) continue;
      posts += c.cut(c.rect(x - 2 * k, y - 60 * k, 4 * k, 62 * k), 0.2, 4);
      leaves += c.cut(c.blob(x + 35 * k, y - 50 * k, 32 * k, 18 * k, 10, 0.25), 0.6, 5);
      if (c.chance(0.5)) grapes += c.cut(c.blob(x + 30 * k + c.rr(-10, 10) * k, y - 34 * k, 5 * k, 8 * k, 8, 0.1), 0.2, 3);
    }
    wire += c.ribbon([[-700, y - 54 * k], [2300, y - 54 * k]], 1.4);
    s.x(wire, C.wood2, 'opacity=".6"');
    s.p(posts, C.wood2).p(leaves, r % 2 ? C.moss : C.leaf).p(grapes, C.plumRobe);
    rows.add(s.out());
  });
  const ground = S.layer({ par: 0.5, sh: 3 });
  const gs = sheet();
  gs.p(c.cut([[-900, 620], [2500, 616], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.hillNear, 0.35));
  let clods = '';
  for (let i = 0; i < 80; i++) clods += c.poly(c.circ(c.rr(-700, 2300), c.rr(640, 900), c.rr(1.5, 3.5), 5));
  gs.x(clods, shade(C.sand2, -0.1), 'opacity=".5"');
  ground.add(gs.out() + grass(c, { x0: -700, x1: 2300, y: 630, n: 40, h: 12, color: C.olive }));
  // the patch round the tree: dry & grey, dug, dark with manure — three pieces, faded between
  const patch = (col, j, dots) => {
    const s = sheet().p(c.cut(c.blob(VY.TX, VY.GY + 6, 170, 28, 18, 0.08), j, 6), col);
    if (dots) s.x(dots, shade(col, -0.25), 'opacity=".6"');
    return s.out();
  };
  let cracks = '';
  for (let i = 0; i < 10; i++) { const x = VY.TX - 140 + i * 30 + c.rr(-6, 6), y = VY.GY + c.rr(-8, 18); cracks += c.ribbon([[x, y], [x + c.rr(-8, 8), y + 5], [x + c.rr(-10, 10), y + 11]], 1.4); }
  let clumps = '';
  for (let i = 0; i < 26; i++) clumps += c.cut(c.blob(VY.TX + c.rr(-150, 150), VY.GY + c.rr(-8, 24), c.rr(5, 10), c.rr(3, 5), 7, 0.3), 0.4, 3);
  const dry = ground.add(`<g>${patch(mix(C.sand2, C.rock2, 0.5), 1, cracks)}</g>`);
  const dug = ground.add(`<g opacity="0">${patch(mix(C.soil, C.clay, 0.4), 1.4, clumps)}</g>`);
  const rich = ground.add(`<g opacity="0">${patch(mix(C.soilRich, C.soil, 0.4), 1.4, clumps)}</g>`);
  // the fig tree: trunk, roots below, crown of leaves
  const treeL = S.layer({ par: 0.5, sh: 5 });
  return { c, sk2, hangL, back, rows, ground, treeL, dry, dug, rich, sunEl, cl, update(T, sunK = 0) { swing(sunEl, lerp(1240, 900, sunK), lerp(150, 110, sunK), T, 1, 0.6); swing(cl, 430 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1); } };
}

/* ================================================================== small things */
/** the tower of Siloam: a tall stone tower (origin: its foot, centre); ~ 300 tall at sc 1 */
export function tower(c, sc = 1) {
  const P = (v) => v * sc;
  const s = sheet();
  const st = mix(C.stone, C.sand2, 0.35);
  s.p(c.cut([[P(-44), 0], [P(-40), P(-270)], [P(40), P(-270)], [P(44), 0]], 0.5, 8), st);
  let cr = '';
  for (let k = 0; k < 5; k++) cr += c.cut(c.rect(P(-46 + k * 20), P(-292), P(12), P(24)), 0.3, 4);
  s.p(cr + c.cut(c.rect(P(-48), P(-274), P(96), P(10)), 0.3, 6), shade(st, -0.08));
  let courses = '';
  for (let y = -16; y > -260; y -= 18) {
    courses += c.ribbon([[P(-40), P(y)], [P(40), P(y + c.rr(-1, 1))]], 1.2 * sc);
    for (let x = -40 + c.rr(4, 20); x < 38; x += c.rr(18, 28)) courses += c.ribbon([[P(x), P(y)], [P(x), P(y - 17)]], 1.1 * sc);
  }
  s.x(courses, shade(st, -0.2), 'opacity=".55"');
  s.p(c.cut(c.rect(P(-7), P(-200), P(14), P(26)), 0.2, 3) + c.cut(c.rect(P(-7), P(-120), P(14), P(26)), 0.2, 3), C.soilDark);
  return s.out();
}
/** a squared building block (origin centre) */
export function block(c, w = 22, h = 14, col = mix(C.stone, C.sand2, 0.35)) {
  return sheet().p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 1], [w / 2 + 1, h / 2], [-w / 2, h / 2 + 1]], 0.4, 4), col).x(c.ribbon([[-w / 2 + 3, -h / 2 + 3], [w / 2 - 3, -h / 2 + 2]], 1.4), shade(col, 0.3), 'opacity=".6"').out();
}
/** a soft cloud of dust (origin: its bottom centre) */
export function dustCloud(c, w = 200, col = mix(C.sand, C.stone, 0.4)) {
  const s = sheet();
  for (let i = 0; i < 7; i++) s.p(c.cut(c.blob(-w / 2 + (w * (i + 0.5)) / 7, -w * 0.18 - (i % 2) * w * 0.12, w * 0.17, w * 0.14, 10, 0.2), 0.8, 5), i % 2 ? col : shade(col, 0.12));
  s.p(c.cut(c.blob(0, -w * 0.3, w * 0.3, w * 0.2, 12, 0.2), 0.8, 5), shade(col, 0.2));
  return s.out();
}
/** a column of altar smoke, puffs rising and widening (origin: its foot); tint streaks some puffs dark red */
export function smoke(c, h = 150, col = '#ece6dc', tint = null) {
  const s = sheet();
  let d = '', d2 = '', d3 = '';
  const n = 9;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), y = -u * h, x = Math.sin(u * 5.2) * 12 * (0.4 + u), r = 9 + u * 20;
    const b = c.cut(c.blob(x, y, r, r * 0.8, 10, 0.16), 0.6, 4);
    if (tint && i % 3 === 1) d3 += b; else if (i % 2) d += b; else d2 += b;
  }
  s.p(d2, col).p(d, shade(col, -0.06));
  if (d3) s.p(d3, tint);
  return s.out();
}
/** a simple hanging balance: beam with two pans on cords (origin: the pivot). Pans are separate. */
export function beamBar(c, arm = 190) {
  const col = mix(C.ochre, C.wood3, 0.3);
  return sheet()
    .p(c.cut([[-arm - 8, -6], [0, -13], [arm + 8, -6], [arm + 8, 6], [0, 8], [-arm - 8, 6]], 0.4, 10), col)
    .p(c.cut(c.circ(0, 0, 14, 14), 0.3, 3), C.sun)
    .p(c.cut(c.circ(-arm, 0, 8, 10), 0.2, 3) + c.cut(c.circ(arm, 0, 8, 10), 0.2, 3), shade(col, -0.2)).out();
}
/** a pan on three cords (origin: where the cords meet at the top; the pan is `drop` below) */
export function pan(c, drop = 90, w = 130) {
  const cords = `<path d="M0 0L${-w / 2 + 6} ${drop}M0 0L${w / 2 - 6} ${drop}M0 0L0 ${drop - 4}" stroke="${STRING}" stroke-width="1.5" fill="none"/>`;
  const s = sheet().p(c.cut([[-w / 2, drop], [w / 2, drop], [w / 2 - 14, drop + 16], [-w / 2 + 14, drop + 16]], 0.4, 6), mix(C.sun, C.ochre, 0.4));
  return cords + s.out();
}
/** a heap of stones over a grave by the road (origin: its foot centre) */
export function cairn(c, sc = 1) {
  const s = sheet();
  const rows = [[5, 14], [4, 12], [3, 10], [2, 9], [1, 8]];
  let y = 0, d = '', d2 = '';
  rows.forEach(([n, r], j) => {
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * r * 1.7 * sc + c.rr(-2, 2);
      const b = c.cut(c.blob(x, y - r * 0.7 * sc, r * sc, r * 0.72 * sc, 8, 0.18), 0.4, 3);
      if ((i + j) % 2) d += b; else d2 += b;
    }
    y -= r * 1.2 * sc;
  });
  return s.p(d2, C.rock2).p(d, mix(C.rock, C.rock2, 0.4)).out();
}
/** a basket of dung / compost (origin: the handle) */
export function dungBasket(c) {
  const s = sheet();
  s.p(c.cut([[-24, 6], [24, 6], [18, 30], [-18, 30]], 0.4, 4), C.basket);
  s.p(c.ribbon([[-22, 14], [22, 14]], 1.6) + c.ribbon([[-20, 22], [20, 22]], 1.6), shade(C.basket, -0.3));
  s.p(c.cut(c.blob(0, 4, 24, 9, 10, 0.2), 0.8, 4), mix(C.soilRich, C.soil, 0.3));
  s.x(c.ribbon(c.arc(0, 6, 22, 20, PI, 2 * PI, 8), 2), shade(C.basket, -0.2));
  return s.out();
}
/** a heap of dark manure poured round the tree (origin: its middle, on the ground) */
export function dungHeap(c, w = 120) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, 16, PI, 2 * PI, 12), [w / 2, 0]], 0.9, 5), mix(C.soilRich, C.soil, 0.25));
  let d = '';
  for (let i = 0; i < 10; i++) d += c.poly(c.circ(c.rr(-w / 2.4, w / 2.4), c.rr(-12, -2), c.rr(1.5, 3), 5));
  s.x(d, shade(C.soil, 0.2), 'opacity=".6"');
  return s.out();
}
/** a sheaf of year-leaves: a little calendar tag with n notches, of which `done` are cut (origin: top of tag) */
export function yearTag(c, text, { w = 128, h = 58, n = 3 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, -2], [w / 2 + 2, h], [-w / 2 - 1, h + 1]], 0.5, 6), C.cream);
  s.p(c.cut(c.circ(0, 8, 3.2, 8), 0.2, 2), C.stone2);
  return `${s.out()}<text x="0" y="${h * 0.62}" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** one notch mark for the year tags (origin centre) */
export const notchMark = (c) => sheet().p(c.ribbon([[-2, -12], [2, 12]], 4.4, 0.4), C.terracotta).out();

/* ================================================================== the house with the narrow door */
export const DH = { GY: 700, DX: 800, DW: 44, DH: 150, TOP: 380 };
/**
 * A house on a rise at dusk: a long lit hall with a feast inside seen through its windows, and in the middle a single
 * narrow door with warm light behind it. A path climbs to it from the front. Returns layers and pieces:
 * { sk2, sk3 (night), glowL, houseL, doorLight (the light in the doorway), leaf (the door leaf, scaled from its hinge),
 * pathL, crowdL, act, fx, update(T) }.
 */
export function doorSet(S, { skyCols = SUNSET, night = NIGHT13, insideFn = null } = {}) {
  const c = makeCutter('lk13-door');
  sky(S, skyCols);
  const sk3 = sky(S, night, { name: 'night', rise: 0 }).layer;
  sk3.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const starL = S.layer({ par: 0.03, sh: 0, flat: true, rise: 0 });
  let st = '';
  for (let i = 0; i < 70; i++) st += c.poly(c.circ(c.rr(-600, 2200), c.rr(-500, 360), c.rr(1, 2.6), 6));
  starL.add(`<path d="${st}" fill="${C.star}"/>`);
  starL.fade(0);
  const moonEl = hanging(hangL, `<g>${sheet().p(c.cut(c.circ(0, 0, 30, 30), 0.4, 4), C.moon).out()}</g>`, { x: 1250, y: 150, len: 800 });
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
  const glowL = S.layer({ par: 0.3, sh: 0, flat: true });
  glowL.add(`<g transform="translate(${DH.DX} 500)"><ellipse rx="520" ry="260" fill="url(#halo-glow)"/></g>`);
  const houseL = S.layer({ par: 0.3, sh: 4 });
  // the rise
  const hs = sheet();
  hs.p(c.cut([[-900, 560], [300, 540], [560, 520], [1040, 520], [1300, 540], [2500, 560], [2500, 1700], [-900, 1700]], 1, 14), mix(C.hillNear, C.duskViolet, 0.2));
  houseL.add(hs.out());
  // the hall
  const wallC = mix(C.plaster, C.dawn, 0.2);
  const W = sheet();
  const x0 = 470, x1 = 1130, top = DH.TOP, gy = 528;
  const wins = [560, 660, 940, 1040].map((x) => [[x - 26, top + 70], [x + 26, top + 70], [x + 26, top + 118], [x - 26, top + 118]]);
  const door = [[DH.DX - DH.DW / 2, gy], [DH.DX - DH.DW / 2, gy - DH.DH + 20], ...c.arc(DH.DX, gy - DH.DH + 20, DH.DW / 2, 20, PI, 2 * PI, 8), [DH.DX + DH.DW / 2, gy - DH.DH + 20], [DH.DX + DH.DW / 2, gy]];
  W.p(c.cut([[x0, gy], [x0, top], [x1, top], [x1, gy]], 0.6, 10) + wins.map((w) => c.hole(w, 0.3, 5)).join('') + c.hole(door, 0.3, 5), wallC);
  W.p(c.cut([[x0 - 20, top + 2], [DH.DX, top - 90], [x1 + 20, top + 2]], 0.6, 10), mix(C.roof, C.terracotta, 0.25));
  W.p(c.cut(c.rect(x0 - 10, top - 4, x1 - x0 + 20, 12), 0.4, 8), shade(wallC, -0.1));
  // door frame
  W.p(c.cut([[DH.DX - DH.DW / 2 - 12, gy + 2], [DH.DX - DH.DW / 2 - 12, gy - DH.DH + 16], [DH.DX + DH.DW / 2 + 12, gy - DH.DH + 16], [DH.DX + DH.DW / 2 + 12, gy + 2], [DH.DX + DH.DW / 2, gy + 2], [DH.DX + DH.DW / 2, gy - DH.DH + 22], [DH.DX - DH.DW / 2, gy - DH.DH + 22], [DH.DX - DH.DW / 2, gy + 2]], 0.3, 5), C.wood2);
  W.p(c.cut(c.rect(DH.DX - DH.DW / 2 - 20, gy, DH.DW + 40, 10), 0.3, 5), C.stone2);
  // the lit rooms behind (seen through the holes): warm light, a table, guests' heads
  const inside = sheet();
  inside.p(c.cut(c.rect(x0 + 10, top + 10, x1 - x0 - 20, gy - top - 10), 0.3, 10), mix(C.lampGlow, C.sun, 0.35));
  let heads = '';
  [535, 585, 640, 685, 915, 965, 1020, 1065].forEach((x, i) => { heads += c.cut(c.circ(x, top + 104 + (i % 2) * 4, 9, 10), 0.2, 3); });
  inside.p(heads, mix(C.soilDark, C.sunDeep, 0.25));
  inside.p(c.cut(c.rect(x0 + 20, top + 110, x1 - x0 - 40, 8), 0.2, 6), mix(C.wood2, C.sunDeep, 0.2));
  const litL = houseL;
  litL.add(inside.out());
  const doorLight = litL.add(`<g><path d="${c.poly(door)}" fill="${mix(C.lampGlow, C.cream, 0.4)}"/></g>`);
  const ins = insideFn ? insideFn(litL) : null;
  litL.add(W.out());
  // lamps hanging at the corners
  litL.add([x0 + 20, x1 - 20].map((x) => `<g transform="translate(${x} ${top + 30})"><circle r="40" fill="url(#warm-glow)"/></g>`).join(''));
  // the door leaf (hinged at the left jamb, scales across)
  const leaf = litL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -DH.DH + 20], ...c.arc(DH.DW / 2, -DH.DH + 20, DH.DW / 2, 20, PI, 2 * PI, 8), [DH.DW, -DH.DH + 20], [DH.DW, 0]], 0.3, 5), C.wood).x(c.ribbon([[DH.DW / 2, -6], [DH.DW / 2, -DH.DH + 10]], 1.4) + c.ribbon([[4, -DH.DH * 0.3], [DH.DW - 4, -DH.DH * 0.3]], 4) + c.ribbon([[4, -DH.DH * 0.7], [DH.DW - 4, -DH.DH * 0.7]], 4), shade(C.wood, -0.25)).p(c.cut(c.circ(DH.DW - 9, -DH.DH * 0.46, 4, 8), 0.2, 2), C.rock3).out()}</g>`);
  // a spill of light down the path
  const spill = litL.add(`<g><path d="${c.poly([[DH.DX - 22, gy + 6], [DH.DX + 22, gy + 6], [DH.DX + 90, 760], [DH.DX - 90, 760]])}" fill="${C.lampGlow}" opacity=".45"/></g>`);
  // the path up from the front
  const pathL = S.layer({ par: 0.4, sh: 3 });
  const ps = sheet();
  ps.p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 1, 20), mix(C.hillNear, C.duskViolet, 0.25));
  ps.p(c.cut([[DH.DX - 40, 600], [DH.DX + 40, 600], [DH.DX + 170, 1000], [DH.DX - 170, 1000]], 1, 10), mix(C.sand, C.dusk, 0.25));
  pathL.add(ps.out() + grass(c, { x0: -800, x1: 2400, y: 606, n: 40, h: 14, color: mix(C.moss, C.duskViolet, 0.2) }));
  pathL.add(olive(c, 260, 610, 1, { leaf: mix(C.olive, C.duskViolet, 0.25), leaf2: mix(C.sage, C.duskViolet, 0.2) }) + cypress(c, 1380, 612, 170, mix(C.moss2, C.duskViolet, 0.3)) + cypress(c, 1450, 606, 130, mix(C.moss2, C.duskViolet, 0.3)));
  const crowdL = S.layer({ par: 0.4, sh: 4 });
  const act = S.layer({ par: 0.4, sh: 5 });
  const fx = S.layer({ par: 0.4, sh: 6 });
  return { c, sk3, starL, hangL, glowL, houseL, doorLight, leaf, spill, pathL, crowdL, act, fx, gy, ins, update(T) { swing(moonEl, 1250, 150, T, 1, 0.6); } };
}

/* ================================================================== the road over the hills, Jerusalem far off */
export const VW = { GY: 716, CX: 1010, CY: 506, CS: 0.36 };
/**
 * A hilltop on the road south: the ridge in front where Jesus stands, a valley, and far across it Jerusalem on its
 * hill (Mark 11's city, small). A second sky for the evening. Returns { c, sk2, sk3, hangL, cityL, city, gateY, road
 * (points along the road to the city gate, world coords at the city layer), near, act, fx, update(T) }.
 */
export function viewSet(S, { skyCols = LATE, sky2 = SUNSET, sky3 = null, sunAt = [360, 160], overCity = null } = {}) {
  const c = makeCutter('lk13-view');
  sky(S, skyCols);
  const sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer;
  sk2.fade(0);
  let sk3 = null;
  if (sky3) { sk3 = sky(S, sky3, { name: 'sky3', rise: 0 }).layer; sk3.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 36), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cl = hanging(hangL, cloud(c, 150), { x: 1220, y: 120, len: 800 });
  S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 470, amps: [14, 6, 2], lens: [1100, 380, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
  const cityL = S.layer({ par: 0.1, sh: 3 });
  const city = cityL.add(`<g transform="translate(${VW.CX} ${VW.CY})">${jerusalem(c, VW.CS, { tglow: true })}</g>`);
  const over = overCity ? overCity(S) : null;
  const valley = S.layer({ par: 0.16, sh: 3 });
  const vfn = c.wave(540, [8, 4], [700, 200]);
  const vs = sheet().p(c.ridge(vfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.dune, 0.2));
  // the road from the ridge down and across to the city gate
  const road = [[-300, 640], [200, 600], [520, 570], [760, 552], [900, 540], [980, 530]];
  vs.p(c.ribbon(road, (u) => 30 - u * 24, 1), mix(C.sand, C.stone, 0.35));
  valley.add(vs.out() + olive(c, 180, 590, 0.6) + olive(c, 1300, 560, 0.55) + cypress(c, 1400, 556, 90));
  const cairnL = S.layer({ par: 0.16, sh: 4 });
  const near = S.layer({ par: 0.4, sh: 3 });
  const nfn = c.wave(VW.GY - 36, [8, 3], [700, 220]);
  near.add(sheet().p(c.ridge(nfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.sand, 0.3)).out() + grass(c, { x0: -800, x1: 2400, y: VW.GY - 36, fn: nfn, n: 60, h: 16, color: C.moss }) + rock(c, 380, VW.GY - 20, 90, 40, C.rock) + bush(c, 1260, VW.GY - 26, 70, C.sage, C.moss));
  const act = S.layer({ par: 0.4, sh: 5 });
  const fx = S.layer({ par: 0.4, sh: 6 });
  return {
    c, sk2, sk3, hangL, cityL, city, over, valley, cairnL, road, near, act, fx, sunEl,
    update(T, { sunY = sunAt[1], sunX = sunAt[0] } = {}) { swing(sunEl, sunX, sunY, T, 1, 0.6); swing(cl, 1220 + Math.sin(T * 0.1) * 20, 120, T, 1.2, 0.6, 1); },
  };
}
/** a point u ∈ [0,1] along a polyline */
export function along(pts, u) {
  const lens = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) { const k = Math.min(1, d / lens[i]); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

/* ================================================================== the fig tree's things */
/** a plain empty basket held by its rim (origin: the hand) */
export function emptyBasket(c, w = 44) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 2], [w / 2, 2], [w / 2 - 7, 30], [-w / 2 + 7, 30]], 0.4, 4), C.basket);
  s.p(c.ribbon([[-w / 2 + 2, 12], [w / 2 - 2, 12]], 1.6) + c.ribbon([[-w / 2 + 4, 21], [w / 2 - 4, 21]], 1.6), shade(C.basket, -0.3));
  s.p(c.cut(c.ell(0, 2, w / 2, 5, 14), 0.3, 4), shade(C.basket, -0.45));
  return s.out();
}
/** one fig, ripe (plum) or young (green) (origin centre) */
export function oneFig(c, r = 10, col = mix(C.plumRobe, C.indigo, 0.25)) {
  return sheet().p(c.cut([[0, -r * 1.35], ...c.arc(0, 0, r, r * 1.02, -PI * 0.35, PI * 1.35, 12)], 0.3, 3), col).x(c.ribbon([[0, -r * 1.3], [1, -r * 1.7]], 2), C.wood2).out();
}
/** "no fruit": a fig on a round tag, crossed out (origin centre) */
export function noFig(c, r = 30) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 4, 24), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, r, 24), 0.4, 4), C.cream);
  const x = sheet().p(c.ribbon([[-r * 0.62, -r * 0.62], [r * 0.62, r * 0.62]], 5, 0.4) + c.ribbon([[r * 0.62, -r * 0.62], [-r * 0.62, r * 0.62]], 5, 0.4), C.terracotta).out();
  return `${s.out()}<g transform="translate(0 ${r * 0.18})">${oneFig(c, r * 0.36)}</g>${x}`;
}
/** a year tag for the three years: a roman numeral over a crossed-out fig (origin: its top, on a string) */
export function yearDisc(c, roman, r = 34) {
  const s = sheet().p(c.cut(c.circ(0, r + 8, r + 5, 26), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, r + 8, r, 26), 0.4, 4), C.cream);
  const x = sheet().p(c.ribbon([[-r * 0.36, r * 1.02], [r * 0.36, r * 1.62]], 4, 0.3) + c.ribbon([[r * 0.36, r * 1.02], [-r * 0.36, r * 1.62]], 4, 0.3), C.terracotta).out();
  return `<path d="M0 -1600V4" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="${r * 0.86}" text-anchor="middle" font-family="${FONT}" font-size="${r * 0.62}" font-style="italic" fill="${C.ink}">${roman}</text><g transform="translate(0 ${r * 1.34})">${oneFig(c, r * 0.24)}</g>${x}`;
}
/** young green figs scattered in the fig tree's crown (tree coords, sc as figTree) */
export function youngFigs(c, sc = 1, n = 12, col = mix(C.wheatGreen, C.leaf, 0.3)) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = c.rr(0, PI * 2), rr = Math.sqrt(c.rr(0.05, 0.85));
    const x = Math.cos(a) * 130 * rr * sc, y = (-215 + Math.sin(a) * 70 * rr) * sc, r = c.rr(6, 8) * sc;
    d += c.cut([[x, y - r * 1.35], ...c.arc(x, y, r, r, -PI * 0.35, PI * 1.35, 10)], 0.2, 3);
  }
  return sheet().p(d, col).out();
}

/* ================================================================== the six days and the Sabbath */
/** a hanging card for one day of the week: a numeral and a small picture (origin: where the string meets it) */
export function dayCard(c, text, inner, { w = 84, h = 100, face = C.cream, rim = C.parchment, ink = C.ink } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 4, 0, w + 8, h + 8), 0.5, 7), rim);
  s.p(c.cut(c.rect(-w / 2, 4, w, h), 0.4, 7), face);
  return `<path d="M0 -1600V2" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="32" text-anchor="middle" font-family="${FONT}" font-size="26" font-style="italic" fill="${ink}">${text}</text><g transform="translate(0 ${h * 0.68})">${inner}</g>`;
}
/** a little hammer (origin centre) */
export function hammer(c) {
  return sheet().p(c.ribbon([[-4, 30], [4, -18]], 5), C.wood3).p(c.cut([[-16, -30], [18, -26], [17, -14], [-15, -16]], 0.3, 4), C.rock3).out();
}
/** a small healing mark: a warm plus in a halo disc (origin centre) */
export function healMark(c, r = 16) {
  const s = sheet().p(c.cut(c.circ(0, 0, r, 18), 0.3, 3), mix(C.halo, C.cream, 0.3)).p(c.ribbon([[0, -r * 0.6], [0, r * 0.6]], r * 0.34) + c.ribbon([[-r * 0.6, 0], [r * 0.6, 0]], r * 0.34), C.sunDeep);
  return `<circle r="${r * 1.8}" fill="url(#warm-glow)"/>${s.out()}`;
}

/* ================================================================== that fox, and three days */
/** a short sword (origin: the hilt) */
export function sword(c, len = 90) {
  return sheet().p(c.cut([[-4, -6], [4, -6], [3, -len], [0, -len - 10], [-3, -len]], 0.3, 5), mix(C.stone, C.foam, 0.4)).p(c.cut(c.rect(-14, -8, 28, 6), 0.2, 3), C.sun).p(c.cut(c.rect(-3, -2, 6, 18), 0.2, 3), C.leather).out();
}
/** a round day-plate on a string with a word under it (origin: top of the string's end) */
export function dayPlate(c, word, inner, { r = 46, face = C.cream, rim = C.haloRim } = {}) {
  const s = sheet().p(c.cut(c.circ(0, r + 6, r + 5, 30), 0.4, 5), rim).p(c.cut(c.circ(0, r + 6, r, 30), 0.4, 5), face);
  const id = 'dp' + Math.floor(c.r() * 1e9);
  return `<path d="M0 -1600V6" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<clipPath id="${id}"><circle cx="0" cy="${r + 6}" r="${r - 1}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(0 ${r + 6})">${inner}</g></g><g transform="translate(0 ${2 * r + 30})">${wordTag(c, word, { size: 18 })}</g>`;
}
