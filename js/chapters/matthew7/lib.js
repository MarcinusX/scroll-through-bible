// Matthew 7 — the end of the Sermon on the Mount. The green mountainside over the lake is John 6's (hillSet,
// meadowRows), so the three chapters of the Sermon share one hill. This file adds the chapter's own cut-outs:
// the big pointing hand, the plank and the speck, street dogs and pearls, the three doors, the two gates,
// the fleece of the false prophet, thorns and thistles, the builders' houses and the storm.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, rock, sun, cloud, grass } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';

export { hillSet, meadowRows, folk, group, SPRING, NOON, GOLDEN, DUSK, MORNING, hull } from '../john6/lib.js';
export { kf, moving, speech, thought, GLYPH, heart, loaf, grapes } from '../mark2/lib.js';
export { hand, headAt, voiceRings, hang2, sparkle, scrollParts, snake } from '../mark1/lib.js';
export { hungWord, hungGold, goldWord, glowDisc, rayBurst, radiance } from '../john1/lib.js';
export { strip, scribe, pharisee } from '../mark3/lib.js';
export { say, tag } from '../mark8/lib.js';
export { scalesParts } from '../john8/lib.js';
export { guiltStone } from '../john19/lib.js';
export { puppy } from '../mark7/lib.js';
export { pig } from '../mark5/lib.js';
export { ewe, sheepRig, wolf } from '../john10/lib.js';
export { stoneLoaf, breadLoaf } from '../matthew4/lib.js';
export { smallFish } from '../mark8/lib.js';
export { orchardTree, fruit, axe, chip, fireLine, standRock } from '../matthew3/lib.js';
export { firePit, fireFlames } from '../mark14/lib.js';
export { figs } from '../mark11/lib.js';
export { grapeBunch, kingdomGate, gateDoor } from '../mark12/lib.js';
export { storyFrame } from '../mark6/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const VILLAGE = ['#cfe1dc', '#f1e7cc', '#f8e9cd'];
export const WARMDAY = ['#d6dfd2', '#f3e0bd', '#f8e6c6'];
export const STORM = ['#4d5570', '#6f7890', '#9aa0ae'];
export const DARKSTORM = ['#343a55', '#525a76', '#7b8298'];
export const AFTER = ['#b9cbd3', '#e9dfc8', '#f5e3c4'];
export const THATDAY = ['#e9c98c', '#f5dcaa', '#faeac8'];
export const FAR = ['#8d8aa6', '#c6b3b2', '#e3cdb6'];
export const HARVEST_SKY = ['#e7c9a2', '#f2d7a6', '#f8e5c0'];

/* ================================================================== people */
/** a man of the crowd (never veiled) / a woman */
export function manOf(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanOf(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
/** a child (drawn at s ≈ 0.55) */
export function childOf(i = 0, extra = {}) {
  const girl = i % 2 === 1;
  return {
    robe: [C.roseRobe, C.skyVeil, C.wheatRobe, C.sageRobe][i % 4], skin: [C.skin, C.skin2, C.skin3][i % 3], hair: [C.hair2, C.hair3, C.hair][i % 3],
    hairStyle: girl ? 'veil' : 'curly', veil: [C.blushVeil, C.skyVeil][i % 2], beard: 'none', belt: C.ochre, ...extra,
  };
}
/** the two brothers of the plank and the speck */
export const BRO_A = { robe: C.ochreRobe, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.leather };
export const BRO_B = { robe: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.ochre };
/** the false prophet: a white fleece mantle over a dark robe, a prophet's staff */
export const PROPHET = { robe: mix(C.linen, C.cream, 0.4), fur: true, hair: C.hair3, hairStyle: 'wrap', veil: mix(C.linen, C.cream, 0.4), veil2: C.stone, beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: mix(C.storm2, C.plumRobe, 0.4) };
/** a true prophet (for the fruits): plain homespun */
export const TRUE_P = { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
/** the wise and the foolish builder */
export const WISE = { robe: C.dustyBlue, mantle: C.wood3, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.dustyBlue, beard: 'full', skin: C.skin3, belt: C.leather };
export const FOOL = { robe: C.roseRobe, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.ochre };

/** where a point of a puppet's head is (default: its front eye), following the head's tilt and the body's lean */
export function eyeAt(x, y, s, flip, head = 0, dy = 0, lean = 0, ex = 8, ey = -2.5) {
  const r = (head * PI) / 180, l = (lean * PI) / 180;
  const hx = 2 + ex * Math.cos(r) - ey * Math.sin(r), hy = -167 + dy + ex * Math.sin(r) + ey * Math.cos(r);
  const bx = hx * Math.cos(l) - hy * Math.sin(l), by = hx * Math.sin(l) + hy * Math.cos(l);
  return [x + (flip ? -1 : 1) * bx * s, y + by * s];
}
/** a puppet's front hand with the body's lean (armF in degrees); back: the back hand (armB) */
export function handAt(x, y, s, flip, a, lean = 0, dy = 0, back = false) {
  const r = (a * PI) / 180, l = (lean * PI) / 180;
  const hx = (back ? -9 : 7) + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  const bx = hx * Math.cos(l) - hy * Math.sin(l), by = hx * Math.sin(l) + hy * Math.cos(l);
  return [x + (flip ? -1 : 1) * bx * s, y + by * s];
}

/* ================================================================== the mountainside */
/**
 * The Sermon's mountainside — Matthew 6's mount() (John 6's green hill over the lake with the seated crowd, Jesus on
 * the knoll, six of the Twelve round Him), so that chapters 5–7 read as one sermon. pose()/listen() drive Jesus and
 * the disciples; sky2 adds a second sky that can be faded in.
 */
import { hillSet as hillSet6, mountFront as mountFront6 } from '../matthew6/lib.js';
import { meadowRows as rows6, TW as TW6 } from '../john6/lib.js';
export { mountFront6 as mountFront };
const SEATS = [[-300, 'thomas'], [-220, 'andrew'], [-135, 'peter'], [135, 'john'], [220, 'james'], [300, 'matthew']];
/** Matthew 6's mount(), copied with one addition: between(set) is called after the crowd, before Jesus' layer */
export function mountSet(S, { skyCols, sky2 = null, sunAt = [1210, 150], rows = true, dis = true, between = null } = {}) {
  const c = S.c;
  const KX = 800;
  const set = hillSet6(S, { ...(skyCols ? { skyCols } : {}), sky2, sunAt, knollX: KX });
  const crowd = rows ? rows6(S, set.sfn, { par: 0.3 }) : null;
  const extra = between ? between(set) : null;
  const act = S.layer({ par: 0.5, sh: 5 });
  const disc = dis ? SEATS.map(([dx, k], i) => {
    const x = KX + dx;
    return { k, i, x, y: set.gfn(x) + 14, flip: dx > 0, p: S.puppet(act.add(person(c, { ...(TW6[k] || CAST[k]), pose: 'sit' }))), seed: c.rr(0, 9) };
  }) : [];
  const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
  const JY = set.gfn(KX) + 6;
  return {
    ...set, crowd, extra, act, disc, jesus, JX: KX, JY,
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

/* ================================================================== judging */
/** a big paper hand pointing its finger to the right (origin: the wrist); ~120 long */
export function pointHand(c, { skin = C.skin2, cuff = C.dustyBlue } = {}) {
  const s = sheet();
  s.p(c.cut([[-58, -20], [-24, -24], [-22, 22], [-58, 18]], 0.6, 6), cuff);
  s.p(c.cut([[-26, -22], [8, -26], [22, -22], [60, -24], [70, -18], [66, -10], [26, -8], [28, 4], [26, 16], [18, 26], [-4, 28], [-24, 22]], 0.6, 5), skin);
  s.x(c.ribbon([[6, 4], [20, 3]], 1.6) + c.ribbon([[4, 14], [16, 13]], 1.6) + c.ribbon([[40, -16], [56, -17]], 1.2), shade(skin, -0.22), 'opacity=".7"');
  // the thumb
  s.p(c.cut([[-6, -22], [4, -40], [14, -42], [16, -34], [8, -22]], 0.4, 4), shade(skin, -0.06));
  s.x(c.poly(c.ell(64, -18, 4, 3, 8)), shade(skin, 0.25), 'opacity=".8"');
  return s.out();
}
/** a small measuring scoop (origin: bottom centre), about 30 wide */
export function scoop(c, w = 30, col = C.wood3) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -w * 0.62], [w / 2, -w * 0.62], [w * 0.38, 0], [-w * 0.38, 0]], 0.3, 4), col);
  s.x(c.ribbon([[-w * 0.44, -w * 0.4], [w * 0.44, -w * 0.4]], 2), shade(col, -0.25), 'opacity=".7"');
  s.p(c.cut(c.ell(0, -w * 0.62, w / 2, 3.6, 12), 0.2, 3), shade(col, -0.4));
  return s.out();
}
/** a heaped basket (origin: bottom centre) */
export function heapBasket(c, w = 90, { fill = true, col = C.basket } = {}) {
  const h = w * 0.5;
  const s = sheet();
  if (fill) {
    s.p(c.cut([[-w * 0.46, -h + 2], ...c.arc(0, -h + 2, w * 0.46, h * 0.62, PI, 2 * PI, 14)], 0.6, 5), C.wheat);
    let d = '';
    for (let i = 0; i < 22; i++) { const a = c.rr(PI * 1.1, PI * 1.9), r = c.rr(0.2, 0.9); d += c.poly(c.ell(Math.cos(a) * w * 0.46 * r, -h + 2 + Math.sin(a) * h * 0.62 * r, 3, 1.9, 8, c.rr(0, 3))); }
    s.x(d, C.wheat2, 'opacity=".8"');
  }
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w * 0.4, 0], [-w * 0.4, 0]], 0.6, 6), col);
  let wv = '';
  for (let i = 1; i < 4; i++) wv += c.ribbon([[-w / 2 + i * 2.5, -h + i * h / 4], [w / 2 - i * 2.5, -h + i * h / 4]], 2.4);
  s.x(wv, shade(col, -0.22), 'opacity=".7"');
  s.p(c.cut([[-w / 2 - 3, -h - 4], [w / 2 + 3, -h - 4], [w / 2 + 2, -h + 4], [-w / 2 - 2, -h + 4]], 0.3, 6), shade(col, -0.12));
  return s.out();
}
/** a grain of wheat (origin centre) */
export function grain(c, r = 3.4) { return `<path d="${c.poly(c.ell(0, 0, r, r * 0.62, 8, 0.4))}" fill="${C.wheat2}"/>`; }
/** a small open bowl held out (origin: bottom centre) */
export function openBowl(c, w = 44, col = C.pot) {
  return sheet().p(c.cut([[-w / 2, -w * 0.34], [w / 2, -w * 0.34], ...c.arc(0, -w * 0.34, w / 2, w * 0.34, 0, PI, 10).slice(1, -1)], 0.3, 4), col).p(c.cut(c.ell(0, -w * 0.34, w / 2, 3.4, 12), 0.2, 3), shade(col, -0.4)).out();
}

/* ================================================================== the plank and the speck */
/** the plank: a long rough beam of wood (origin: its tip, which sits in the eye; extends to +x) */
export function plank(c, len = 330, w = 26) {
  const s = sheet();
  s.p(c.cut([[0, -w * 0.3], [18, -w / 2], [len, -w / 2 - 2], [len + 4, w / 2], [16, w / 2], [0, w * 0.3]], 0.9, 9), C.wood3);
  let gr = '';
  for (let i = 0; i < 5; i++) { const y = -w / 2 + 5 + i * (w - 10) / 4; gr += c.ribbon([[30 + c.rr(0, 30), y + c.rr(-1, 1)], [len - c.rr(10, 60), y + c.rr(-1, 1)]], 1.2); }
  s.x(gr, shade(C.wood3, -0.25), 'opacity=".55"');
  s.p(c.cut(c.ell(len * 0.55, 0, 9, 5, 10), 0.3, 3), shade(C.wood3, -0.3));
  s.p(c.cut([[len - 2, -w / 2 - 2], [len + 4, w / 2], [len - 6, w / 2 - 2], [len - 8, -w / 2]], 0.4, 4), shade(C.wood3, 0.2));
  return s.out();
}
/** the tiny speck (a splinter) with a glint (origin centre) */
export function speck(c, r = 5) {
  return `<path d="${c.poly([[-r, -1], [r, -2], [r * 0.8, 1.4], [-r * 0.9, 1.6]])}" fill="${C.wood2}"/>`;
}
/** tweezers (origin: the tips, pointing +x) */
export function tweezers(c, len = 44) {
  const s = sheet();
  s.p(c.ribbon([[0, -1], [len * 0.5, -4], [len, -3]], 3) + c.ribbon([[0, 1], [len * 0.5, 4], [len, 3]], 3), C.stone2);
  s.p(c.cut(c.circ(len, 0, 4.6, 10), 0.2, 3), shade(C.stone2, -0.2));
  return s.out();
}
/** a big round magnifier (origin: centre of the lens); handle down-right */
export function magnifier(c, r = 34) {
  const s = sheet();
  s.p(c.ribbon([[r * 0.7, r * 0.7], [r * 1.9, r * 1.9]], 9), C.wood2);
  s.p(c.cut(c.circ(0, 0, r + 6, 30), 0.4, 4) + c.hole(c.circ(0, 0, r, 30), 0.3, 4), C.ochre);
  return `<circle r="${r}" fill="${C.skyVeil}" opacity=".35"/>${s.out()}<path d="${c.ribbon(c.arc(0, 0, r * 0.7, r * 0.7, PI * 1.15, PI * 1.45, 6), 3)}" fill="#fff" opacity=".7"/>`;
}

/* ================================================================== dogs, pigs, pearls */
/** a lean street dog, facing right (origin: between the feet); jaw on .jaw */
export function streetDog(c, { col = mix(C.wood3, C.dune, 0.4), k } = {}) {
  const dk = shade(col, -0.2);
  const s = sheet();
  let legs = '';
  [[-26, 0], [-18, 1], [18, 0], [26, 1]].forEach(([x], i) => { legs += c.cut([[x - 3, -34], [x + 3, -34], [x + (i < 2 ? -2 : 3), 0], [x + (i < 2 ? -7 : -3), 0]], 0.3, 3); });
  s.p(legs, dk);
  s.p(c.cut([[-36, -40], [-24, -50], [0, -48], [24, -52], [36, -48], [38, -30], [28, -30], [0, -32], [-22, -30], [-34, -32]], 0.6, 4), col);
  let ribs = '';
  for (let i = 0; i < 4; i++) ribs += c.ribbon([[-6 + i * 7, -46], [-4 + i * 7, -36]], 1.2);
  s.x(ribs, dk, 'opacity=".5"');
  s.p(c.ribbon(c.qbez([-34, -44], [-50, -54], [-54, -72], 6), (u) => 5 - u * 3), col);
  const h = sheet();
  h.p(c.cut([[-8, -10], [6, -16], [16, -12], [32, -6], [34, 0], [16, 2], [-4, 6]], 0.4, 3), col);
  h.p(c.cut([[-2, -12], [2, -26], [10, -14]], 0.3, 2), dk);
  h.x(c.poly(c.circ(12, -8, 2, 6)), C.ink);
  h.x(c.poly(c.circ(33, -4, 2.2, 6)), C.ink);
  // the lower jaw with teeth
  const jaw = `<g class="jaw" transform="translate(4 2)">${sheet().p(c.cut([[-6, -2], [26, 0], [28, 5], [4, 8], [-6, 4]], 0.3, 2), dk).x(c.poly([[10, -1], [12, 3], [14, -1]]) + c.poly([[18, -1], [20, 3], [22, -1]]), C.cream).out()}</g>`;
  return `<g${k_(k)}>${s.out()}<g class="hd" transform="translate(34 -50)">${jaw}${h.out()}</g></g>`;
}
/** a single pearl (origin centre) */
export function pearl(r = 6) {
  return `<circle r="${r}" fill="#f7f1e6"/><circle r="${r * 0.72}" cx="${-r * 0.1}" cy="${-r * 0.1}" fill="#fdfaf3"/><circle r="${r * 0.28}" cx="${-r * 0.35}" cy="${-r * 0.35}" fill="#fff"/><circle r="${r}" fill="none" stroke="${C.stone2}" stroke-width=".8"/>`;
}
/** a little cloth pouch (origin: bottom centre) */
export function pouch(c, col = C.plumRobe) {
  return sheet().p(c.cut([[-16, -4], [-20, -18], [-10, -30], [-4, -32], [-8, -40], [8, -40], [4, -32], [10, -30], [20, -18], [16, -4], [0, 2]], 0.4, 4), col).p(c.ribbon([[-7, -32], [7, -32]], 3), C.rope).out();
}
/** the holy thing: a golden dish with the holy bread under a small glow (origin: bottom centre) */
export function holyDish(c) {
  const s = sheet();
  s.p(c.cut([[-40, -8], [40, -8], [30, 0], [-30, 0]], 0.3, 5), C.sun);
  s.p(c.cut(c.ell(0, -8, 42, 5, 16), 0.3, 4), shade(C.sun, 0.2));
  s.p(c.cut([[-22, -10], ...c.arc(0, -10, 22, 14, PI, 2 * PI, 10), [22, -10]], 0.3, 4), C.wheat);
  s.p(c.cut([[-14, -12], ...c.arc(4, -12, 14, 7, PI, 2 * PI, 8), [18, -12]], 0.3, 3), mix(C.wheat, C.cream, 0.4));
  s.x(c.ribbon([[-8, -18], [8, -18]], 1.6) + c.ribbon([[0, -24], [0, -12]], 1.6), shade(C.wheat2, -0.2), 'opacity=".7"');
  return `<circle cy="-14" r="70" fill="url(#halo-glow)" opacity=".85"/>${s.out()}`;
}
/** a mud puddle (origin centre) */
export function mud(c, w = 300, h = 40, col = mix(C.soil, C.clay, 0.3)) {
  return sheet().p(c.cut(c.blob(0, 0, w / 2, h / 2, 16, 0.12), 0.8, 7), col).x(c.cut(c.blob(-w * 0.15, -h * 0.1, w * 0.2, h * 0.15, 10, 0.2), 0.4, 5), shade(col, 0.15), 'opacity=".6"').out();
}
/** a torn scrap of cloth (origin centre) */
export function rag(c, col = C.clayMantle, r = 14) {
  return sheet().p(c.cut([[-r, -r * 0.4], [-r * 0.2, -r * 0.7], [r * 0.3, -r * 0.3], [r, -r * 0.6], [r * 0.8, r * 0.2], [r * 0.2, r * 0.5], [-r * 0.5, r * 0.3]], 0.6, 3), col).out();
}

/* ================================================================== the three doors */
export { coin } from '../mark2/lib.js';
export { traveller } from '../mark8/lib.js';
/** a plank door leaf, hinged on its left edge (origin: bottom of the hinge; extends to +x, up to -h) */
export function doorLeafW(c, w = 96, h = 190, col = C.wood) {
  const s = sheet();
  s.p(c.cut([[0, 0], [0, -h + 30], ...c.arc(w / 2, -h + 30, w / 2, 30, PI, 2 * PI, 10), [w, -h + 30], [w, 0]], 0.4, 6), col);
  let pl = '';
  for (let i = 1; i < 4; i++) pl += c.ribbon([[(w * i) / 4, -4], [(w * i) / 4, -h + 18]], 1.4);
  s.x(pl, shade(col, -0.25), 'opacity=".55"');
  s.p(c.ribbon([[4, -h * 0.25], [w - 4, -h * 0.25]], 6) + c.ribbon([[4, -h * 0.7], [w - 4, -h * 0.7]], 6), shade(col, -0.18));
  s.p(c.cut(c.circ(w - 16, -h * 0.47, 6, 10), 0.2, 3), C.rock3);
  s.x(c.ribbon(c.arc(w - 16, -h * 0.47 + 10, 7, 9, 0, PI, 8), 2.4), C.rock3);
  return s.out();
}
/** a row of house fronts with arched doorway holes at xs (origin world); returns markup */
export function streetFronts(c, xs, { gy = 700, top = 390, dw = 96, dh = 190, cols = [C.plaster, mix(C.plaster, C.peach, 0.3), mix(C.plaster, C.skyVeil, 0.35)], winSide = null } = {}) {
  let out = '';
  const edges = [-900, ...xs.slice(1).map((x, i) => (xs[i] + x) / 2), 2500];
  xs.forEach((x, i) => {
    const x0 = edges[i], x1 = edges[i + 1], ty = top + (i % 2) * 26;
    const s = sheet();
    const hole = [[x - dw / 2, gy], [x - dw / 2, gy - dh + dw / 2], ...c.arc(x, gy - dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 12), [x + dw / 2, gy - dh + dw / 2], [x + dw / 2, gy]];
    s.p(c.cut([[x0, ty], [x1, ty], [x1, gy + 30], [x0, gy + 30]], 0.8, 12) + c.hole(hole, 0.4, 6), cols[i % cols.length]);
    s.p(c.cut([[x0 - 4, ty - 12], [x1 + 4, ty - 12], [x1 + 4, ty + 4], [x0 - 4, ty + 4]], 0.5, 10), C.roof);
    // the door frame and step
    s.p(c.ribbon(hole.map(([px, py]) => [x + (px - x) * 1.08, py - 4]), 9), shade(cols[i % cols.length], -0.14));
    s.p(c.cut([[x - dw / 2 - 16, gy], [x + dw / 2 + 16, gy], [x + dw / 2 + 12, gy + 10], [x - dw / 2 - 12, gy + 10]], 0.4, 6), C.stone2);
    // a window and a potted plant
    const wx = x + (winSide ? winSide[i] : i % 2 ? -1 : 1) * (dw / 2 + 60);     // winSide: optional per-house side (±1) of the window
    s.p(c.cut(c.rect(wx - 22, ty + 50, 44, 40), 0.4, 5), C.soilDark);
    s.p(c.ribbon([[wx - 26, ty + 92], [wx + 26, ty + 92]], 6), shade(cols[i % cols.length], -0.2));
    out += s.out();
  });
  return out;
}
/** the lit inside of a doorway (origin: bottom centre of the doorway) */
export function doorLight(c, dw = 96, dh = 190) {
  const pts = [[-dw / 2, 0], [-dw / 2, -dh + dw / 2], ...c.arc(0, -dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 12), [dw / 2, -dh + dw / 2], [dw / 2, 0]];
  return `<path d="${c.poly(pts)}" fill="${mix(C.lampGlow, C.sun, 0.25)}"/><circle cy="${-dh * 0.5}" r="${dh * 0.9}" fill="url(#warm-glow)"/>`;
}
/** light spilling out of a doorway onto the street (origin: bottom centre of the doorway) */
export function doorSpill(dw = 96, len = 120) {
  return `<path d="M${-dw / 2} 0L${dw / 2} 0L${dw / 2 + 60} ${len}L${-dw / 2 - 60} ${len}Z" fill="#ffe9b0" opacity=".45"/>`;
}

/* ================================================================== the golden rule */
export { well, hydria, cupJ, bucketRope } from '../john4/lib.js';
export { drawRing } from '../john1/lib.js';
/** a golden loop (an ellipse drawn in segments, for drawRing); origin centre */
export function goldLoop(c, rx = 200, ry = 120, w = 8, n = 28, col = C.haloRim) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * PI * 2 + PI / 2, a1 = ((i + 1.08) / n) * PI * 2 + PI / 2;
    out += `<path data-i="${i}" d="${c.ribbon(c.arc(0, 0, rx, ry, a0, a1, 4), w)}" fill="${col}"/>`;
  }
  let st = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2; st += c.poly(c.star(Math.cos(a) * rx, Math.sin(a) * ry, 8, 2.6, 4, 0)); }
  return `<g class="segs">${out}</g><path class="ringStars" d="${st}" fill="${C.star}"/>`;
}
/** a golden thread along a polyline (segments, for drawRing); origin world */
export function goldThread(c, pts, w = 5, col = C.haloRim) {
  let out = '';
  for (let i = 0; i < pts.length - 1; i++) out += `<path data-i="${i}" d="${c.ribbon([pts[i], [pts[i + 1][0] + (pts[i + 1][0] - pts[i][0]) * 0.08, pts[i + 1][1] + (pts[i + 1][1] - pts[i][1]) * 0.08]], w)}" fill="${col}"/>`;
  return out;
}
/** a hanging scroll with a title (origin: the top rod; hangs on two strings) */
export function hangScroll(c, title, lines, { w = 170, h = 220, size = 26 } = {}) {
  const rod = (y) => sheet().p(c.cut([[-w / 2 - 10, y - 8], [w / 2 + 10, y - 8], [w / 2 + 10, y + 8], [-w / 2 - 10, y + 8]], 0.3, 6), C.wood2).p(c.cut(c.ell(-w / 2 - 16, y, 7, 12, 10), 0.2, 3) + c.cut(c.ell(w / 2 + 16, y, 7, 12, 10), 0.2, 3), C.wood).out();
  const s = sheet().p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 2, h], [-w / 2 + 2, h]], 0.5, 8), C.parchment);
  let ln = '';
  for (let i = 0; i < lines; i++) { const y = 70 + i * ((h - 90) / lines); let x = -w / 2 + 20; const end = w / 2 - 20 - c.rr(0, 30); while (x < end) { const l = Math.min(end - x, c.rr(14, 40)); ln += c.ribbon([[x, y], [x + l, y]], 2.2); x += l + c.rr(6, 10); } }
  s.x(ln, C.ink, 'opacity=".45"');
  return `<path d="M${-w * 0.35} -1600V0M${w * 0.35} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${rod(0)}${rod(h)}<text x="0" y="44" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.terracotta}">${title}</text>`;
}

/* ================================================================== the two gates */
export { along } from '../john6/lib.js';
/** a big travelling bundle for the back (origin: its strap, on the shoulder) */
export function bigBundle(c, col = C.linen2) {
  const s = sheet();
  s.p(c.cut(c.blob(-8, 30, 34, 30, 12, 0.14), 0.7, 5), col);
  s.p(c.cut(c.blob(-2, 4, 22, 14, 10, 0.2), 0.5, 4), shade(col, -0.1));
  s.x(c.ribbon([[-36, 26], [22, 20]], 3) + c.ribbon([[-10, 0], [-14, 58]], 3), C.rope);
  return s.out();
}
/** the wide gate: a showy arch with gilding and pennants (origin: bottom centre); w wide */
export function wideGate(c, w = 300, h = 250) {
  const s = sheet();
  const pw = 42;
  const pier = (x0) => c.cut([[x0, 0], [x0, -h + 60], [x0 + pw, -h + 60], [x0 + pw, 0]], 0.5, 8);
  s.p(pier(-w / 2 - pw) + pier(w / 2), mix(C.plaster, C.roseRobe, 0.25));
  s.p(c.cut([[-w / 2 - pw - 10, -h + 70], [w / 2 + pw + 10, -h + 70], [w / 2 + pw + 10, -h + 30], ...c.arc(0, -h + 30, w / 2 + pw + 10, 70, 0, -PI, 16).slice(1, -1), [-w / 2 - pw - 10, -h + 30]], 0.6, 8)
    + c.hole([[-w / 2, -h + 72], [w / 2, -h + 72], ...c.arc(0, -h + 72, w / 2, 60, 0, -PI, 16).slice(1, -1)], 0.4, 6), mix(C.plaster, C.roseRobe, 0.25));
  s.p(c.ribbon(c.arc(0, -h + 72, w / 2 + 12, 72, PI, 2 * PI, 20), 10), C.sun);
  s.p(c.cut(c.rect(-w / 2 - pw - 14, -h + 50, w + 2 * pw + 28, 16), 0.4, 8), C.sun);
  let orn = '';
  for (let i = 0; i < 11; i++) { const a = PI + (i + 0.5) / 11 * PI; orn += c.poly(c.star(Math.cos(a) * (w / 2 + 12), -h + 72 + Math.sin(a) * 72, 6, 2.4, 4, 0)); }
  s.x(orn, C.star);
  // pennants on poles
  [[-w / 2 - pw / 2, C.terracotta], [w / 2 + pw / 2, C.dustyBlue]].forEach(([x, col]) => {
    s.p(c.ribbon([[x, -h + 50], [x, -h - 90]], 4), C.wood2);
    s.p(c.cut([[x + 2, -h - 88], [x + 70, -h - 70], [x + 2, -h - 52]], 0.4, 5), col);
  });
  return s.out();
}
/** the narrow gate: a slit between two rock pillars (origin: bottom centre of the opening); gap wide */
export function narrowGate(c, gap = 34, h = 110, col = C.rock2) {
  const s = sheet();
  s.p(c.cut([[-gap / 2, 4], [-gap / 2 - 2, -h * 0.7], [-gap / 2 + 2, -h], [-gap / 2 - 20, -h - 30], [-gap / 2 - 70, -h - 10], [-gap / 2 - 90, -h * 0.4], [-gap / 2 - 110, 4]], 1, 6), col);
  s.p(c.cut([[gap / 2, 4], [gap / 2 + 2, -h * 0.75], [gap / 2 - 1, -h], [gap / 2 + 26, -h - 26], [gap / 2 + 76, -h - 6], [gap / 2 + 96, -h * 0.5], [gap / 2 + 120, 4]], 1, 6), shade(col, -0.06));
  s.p(c.cut([[-gap / 2 - 6, -h - 4], [gap / 2 + 6, -h - 4], [gap / 2 + 4, -h - 18], [-gap / 2 - 4, -h - 20]], 0.4, 4), shade(col, -0.18));
  s.x(c.ribbon([[-gap / 2 - 60, -h * 0.5], [-gap / 2 - 30, -h * 0.3]], 2) + c.ribbon([[gap / 2 + 40, -h * 0.6], [gap / 2 + 70, -h * 0.4]], 2), shade(col, 0.25), 'opacity=".6"');
  return s.out();
}

/* ================================================================== the wolf in sheep's clothing */
export { shadowPerson, silhouette } from '../mark3/lib.js';
/** the wolf's shadow: head and shoulders with open jaws, facing right (origin: bottom centre, ~290 tall) */
export function wolfShadow(c, col = '#2e2638') {
  const pts = [[-130, 0], [-124, -110], [-96, -180], [-70, -222], [-52, -290], [-24, -236], [2, -240], [22, -300], [44, -232], [74, -214], [128, -196], [172, -184], [178, -168],
    [160, -164], [150, -152], [140, -162], [128, -150], [118, -160], [106, -148], [96, -158], [84, -146], [70, -150],
    [84, -128], [98, -138], [108, -126], [120, -136], [130, -124], [142, -134], [160, -126], [150, -108], [104, -92], [78, -60], [86, 0]];
  const s = sheet().p(c.cut(pts, 1.4, 6), col);
  return `${s.out(false)}<path d="${c.poly(c.ell(84, -206, 9, 5, 10, -0.2))}" fill="#f3d27a"/>`;
}

/* ================================================================== thorns, thistles, vines, figs */
export { figTree, figs as figsRow } from '../mark11/lib.js';
export { vineStock } from '../mark12/lib.js';
export { thornBush } from '../../assets/things.js';
/** a thistle plant with spiky leaves and purple heads (origin: its foot) */
export function thistle(c, h = 120) {
  const s = sheet();
  let stems = '', lv = '', heads = '', spikes = '';
  for (let i = 0; i < 3; i++) {
    const lean = (i - 1) * 18 + c.rr(-6, 6), hh = h * c.rr(0.75, 1.05);
    stems += c.ribbon(c.qbez([i * 6 - 6, 0], [lean * 0.3, -hh * 0.5], [lean, -hh], 8), (u) => 4 - u * 2);
    for (let k = 0; k < 3; k++) {
      const y = -hh * (0.25 + k * 0.2), x = lean * (0.25 + k * 0.2), d = k % 2 ? 1 : -1;
      const pts = [[x, y]];
      for (let j = 1; j <= 5; j++) pts.push([x + d * j * 7, y - j * 3 + (j % 2 ? -7 : 3)]);
      pts.push([x + d * 34, y - 10], [x + d * 4, y + 4]);
      lv += c.poly(pts);
    }
    heads += c.cut(c.ell(lean, -hh - 10, 11, 13, 12), 0.4, 3);
    spikes += c.cut([[lean - 12, -hh + 2], [lean - 8, -hh - 8], [lean, -hh + 4], [lean + 8, -hh - 8], [lean + 12, -hh + 2], [lean, -hh + 8]], 0.3, 3);
  }
  s.p(stems, mix(C.olive, C.sage, 0.4)).p(lv, mix(C.sage, C.skyBlue2, 0.35)).p(heads, mix(C.plumRobe, C.lavender, 0.3)).p(spikes, mix(C.sage, C.olive, 0.5));
  return s.out();
}
/** a grapevine on a trellis, loaded with bunches (origin: its foot centre; ~220 wide) */
export function trellisVine(c, w = 230, h = 170) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [-w / 2 + 9, -h], [-w / 2 + 9, 0]], 0.3, 6) + c.cut([[w / 2 - 9, 0], [w / 2 - 9, -h], [w / 2, -h], [w / 2, 0]], 0.3, 6), C.wood2);
  s.p(c.ribbon([[-w / 2 - 8, -h + 4], [w / 2 + 8, -h + 4]], 7), C.wood);
  s.p(c.ribbon(c.cbez([0, 0], [-8, -h * 0.4], [10, -h * 0.7], [0, -h + 6], 10), (u) => 9 - u * 5) + c.ribbon(c.qbez([0, -h + 6], [-w * 0.3, -h - 6], [-w / 2, -h + 2], 8), 4) + c.ribbon(c.qbez([0, -h + 6], [w * 0.3, -h - 6], [w / 2, -h + 2], 8), 4), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(-w / 2, w / 2), y = -h + c.rr(-18, 30); const l = c.cut(c.star(x, y, c.rr(13, 18), c.rr(8, 11), 5, c.rr(0, 6)), 0.4, 3); if (i % 2) lv += l; else lv2 += l; }
  s.p(lv2, C.moss).p(lv, C.leaf);
  let gb = '';
  [-0.36, -0.1, 0.16, 0.38].forEach((f, i) => { const x = f * w, y = -h + 22 + (i % 2) * 10; const rows = [4, 3, 3, 2, 1]; rows.forEach((n, r) => { for (let k = 0; k < n; k++) gb += c.cut(c.circ(x + (k - (n - 1) / 2) * 8, y + r * 7, 4.6, 8), 0.1, 2); }); });
  s.p(gb, mix(C.plumRobe, C.indigo, 0.25));
  return s.out();
}
/** a fruit basket; content 'fruit' (grapes and figs) or 'thorns' (thorny sprigs and thistle heads) (origin: bottom centre) */
export function contentBasket(c, kind = 'fruit', w = 80) {
  const h = w * 0.46;
  const s = sheet();
  if (kind === 'fruit') {
    let gb = '';
    [[-w * 0.2, -h - 6], [w * 0.12, -h - 10]].forEach(([x, y]) => { [3, 3, 2, 1].forEach((n, r) => { for (let k = 0; k < n; k++) gb += c.cut(c.circ(x + (k - (n - 1) / 2) * 8, y - 10 + r * 7, 4.6, 8), 0.1, 2); }); });
    s.p(gb, mix(C.plumRobe, C.indigo, 0.25));
    let fg = '';
    [[-w * 0.34, -h - 2], [w * 0.32, -h - 4], [0, -h - 2]].forEach(([x, y]) => { fg += c.cut([[x - 9, y], ...c.arc(x, y, 9, 10, PI * 0.1, PI * 0.9, 8), [x + 2, y - 14], [x - 2, y - 14]].map(([px, py]) => [px, py - 4]), 0.3, 3); });
    s.p(fg, mix(C.plumRobe, C.terracotta, 0.3));
  } else {
    let tw = '';
    for (let i = 0; i < 6; i++) { const x = c.rr(-w * 0.35, w * 0.35), a = c.rr(-0.8, 0.8); const pts = [[x, -h], [x + Math.sin(a) * 30, -h - 30 - c.rr(0, 16)]]; tw += c.ribbon(pts, 3); for (let k = 1; k < 4; k++) { const px = x + Math.sin(a) * 30 * k / 4, py = -h - (30 * k) / 4; tw += c.poly([[px - 1.5, py], [px + (k % 2 ? 9 : -9), py - 4], [px + 1.5, py - 2]]); } }
    s.p(tw, C.thorn);
    s.p(c.cut(c.ell(-w * 0.12, -h - 12, 9, 10, 10), 0.3, 3) + c.cut(c.ell(w * 0.22, -h - 8, 8, 9, 10), 0.3, 3), mix(C.plumRobe, C.lavender, 0.3));
  }
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w * 0.4, 0], [-w * 0.4, 0]], 0.5, 6), C.basket);
  let wv = '';
  for (let i = 1; i < 4; i++) wv += c.ribbon([[-w / 2 + i * 2.5, -h + i * h / 4], [w / 2 - i * 2.5, -h + i * h / 4]], 2.2);
  s.x(wv, shade(C.basket, -0.22), 'opacity=".7"');
  return s.out();
}
/** a cloth that covers a basket (origin: bottom centre of the basket it sits on) */
export function basketCloth(c, w = 80, col = C.linen2) {
  const h = w * 0.46;
  return sheet().p(c.cut([[-w / 2 - 4, -h + 6], ...c.arc(0, -h + 2, w / 2 + 4, 26, PI, 2 * PI, 12), [w / 2 + 4, -h + 6], [w / 2 - 6, -h + 16], [-w / 2 + 6, -h + 16]], 0.5, 5), col).x(c.ribbon([[-w / 2 + 6, -h + 10], [w / 2 - 6, -h + 10]], 2), shade(col, -0.2), 'opacity=".6"').out();
}

/* ================================================================== good tree, bad tree */
/** a shrivelled, rotten fruit with a worm hole (origin centre) */
export function rottenFruit(c, r = 9) {
  const col = mix(C.wood2, C.olive, 0.3);
  const pts = c.blob(0, 0, r, r * 0.9, 10, 0.22);
  return sheet().p(c.cut(pts, 0.6, 3), col).x(c.ribbon([[-r * 0.5, -r * 0.2], [r * 0.3, r * 0.1]], 1.2) + c.ribbon([[-r * 0.2, r * 0.4], [r * 0.4, -r * 0.3]], 1), shade(col, -0.3), 'opacity=".7"').x(c.poly(c.circ(r * 0.3, -r * 0.2, r * 0.22, 6)), C.soilDark).x(c.ribbon([[0, -r], [2, -r - 5]], 1.6), C.wood2).out();
}
/** a little worm (origin: its head) */
export function worm(c) {
  return sheet().p(c.ribbon(c.qbez([0, 0], [6, -8], [14, -4], 8), (u) => 4.4 - u * 1.6), mix(C.roseRobe, C.blush, 0.4)).x(c.poly(c.circ(-1, -1, 1, 5)), C.ink).out();
}
/** roots below a tree (origin: the trunk's foot); dry roots are thin and grey */
export function roots(c, { sc = 1, dry = false } = {}) {
  let d = '';
  for (let i = 0; i < 8; i++) {
    const a = PI * (0.1 + (i / 7) * 0.8), l = sc * c.rr(80, 130) * (dry ? 0.7 : 1);
    const pts = c.qbez([sc * c.rr(-10, 10), 0], [Math.cos(a) * l * 0.5, sc * 24], [Math.cos(a) * l, Math.sin(a) * l * 0.6 + sc * 14], 8);
    d += c.ribbon(pts, (u) => sc * (dry ? 4.4 : 8) * (1 - u) + 1);
    if (!dry) { const m = pts[5]; d += c.ribbon([m, [m[0] + c.rr(-26, 26), m[1] + c.rr(16, 30)]], 2.4); }
  }
  return sheet().p(d, dry ? mix(C.rock3, C.stone2, 0.4) : mix(C.wood2, C.soil, 0.3)).out();
}

/* ================================================================== "Lord, Lord" */
export { spirit } from '../mark5/lib.js';
/** a small open scroll held up (origin centre) */
export function smallScroll(c, w = 60, h = 40) {
  const s = sheet().p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.3, 5), C.parchment);
  let ln = '';
  for (let i = 0; i < 4; i++) ln += c.ribbon([[-w / 2 + 8, -h / 2 + 9 + i * 7], [w / 2 - 8 - (i % 2) * 10, -h / 2 + 9 + i * 7]], 1.6);
  s.x(ln, C.ink, 'opacity=".5"');
  s.p(c.cut(c.ell(-w / 2, 0, 5, h / 2 + 4, 10), 0.2, 3) + c.cut(c.ell(w / 2, 0, 5, h / 2 + 4, 10), 0.2, 3), C.wood3);
  return s.out();
}
/** a rich man's look (the ones who boast of their works) */
export function boaster(i = 0) {
  return [
    { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.terracotta, beard: 'full', skin: C.skin2, belt: C.sun },
    { robe: C.tealRobe, mantle: C.roseRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.sun, beard: 'wild', beardColor: C.greyHair, skin: C.skin, belt: C.sun },
    { robe: C.dustyBlue, mantle: C.ochreRobe, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, veil2: C.plumRobe, beard: 'full', skin: C.skin3, belt: C.terracotta },
  ][i % 3];
}

/* ================================================================== the two houses and the storm */
export { rain, lightning, stormCloud } from '../../assets/things.js';
export { waveStrip } from '../../assets/nature.js';
/**
 * A house cut into pieces so it can be built stone by stone (and fall apart): returns
 * { blocks: [{x, y, m, r}], door: {x, y, m}, win: {x, y, m, lit}, roof: {x, y, m} } — positions relative to the house's
 * foot (bottom centre); every m is centred on its own position.
 */
export function houseParts(c, { w = 230, h = 150, wall = mix(C.stone, C.plaster, 0.45), wall2 = mix(C.stone2, C.plaster2, 0.4), rows = 4, roofCol = C.wood2 } = {}) {
  const rh = h / rows, bw = w / 4;
  const blocks = [];
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? -bw / 2 : 0;
    for (let x = -w / 2 + off; x < w / 2 - 1; x += bw) {
      const x0 = Math.max(-w / 2, x), x1 = Math.min(w / 2, x + bw);
      if (x1 - x0 < 8) continue;
      const cx = (x0 + x1) / 2, cy = -r * rh - rh / 2, ww = x1 - x0;
      const s = sheet().p(c.cut(c.rect(-ww / 2, -rh / 2, ww, rh), 0.7, 6), (blocks.length + r) % 3 ? wall : wall2);
      s.x(c.ribbon([[-ww / 2 + 3, -rh / 2 + 2], [ww / 2 - 3, -rh / 2 + 2]], 1.2), shade(wall, 0.25), 'opacity=".6"');
      blocks.push({ x: cx, y: cy, r, m: s.out() });
    }
  }
  const dw = w * 0.2, dh = h * 0.56;
  const door = { x: -w * 0.18, y: -dh / 2, m: sheet().p(c.cut([[-dw / 2, dh / 2], [-dw / 2, -dh / 2 + dw / 2], ...c.arc(0, -dh / 2 + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 8), [dw / 2, -dh / 2 + dw / 2], [dw / 2, dh / 2]], 0.4, 5), C.wood).x(c.ribbon([[0, -dh / 2 + 6], [0, dh / 2 - 2]], 1.4), shade(C.wood, -0.3), 'opacity=".6"').out() };
  const ws = w * 0.14;
  const win = { x: w * 0.22, y: -h * 0.62, m: sheet().p(c.cut(c.rect(-ws / 2, -ws / 2, ws, ws), 0.3, 4), C.soilDark).out(), lit: `<circle r="${ws * 2.4}" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(-ws / 2 + 2, -ws / 2 + 2, ws - 4, ws - 4))}" fill="${C.lampFlame}"/>` };
  const rs = sheet();
  rs.p(c.cut([[-w / 2 - 14, -8], [w / 2 + 14, -8], [w / 2 + 14, 8], [-w / 2 - 14, 8]], 0.5, 8), roofCol);
  rs.p(c.cut([[-w / 2 - 6, -22], [w / 2 + 6, -22], [w / 2 + 6, -8], [-w / 2 - 6, -8]], 0.5, 8), shade(wall, -0.06));
  let ends = '';
  for (let i = 0; i < 6; i++) ends += c.cut(c.circ(-w / 2 + 10 + i * (w - 20) / 5, 2, 4, 8), 0.2, 3);
  rs.x(ends, shade(roofCol, -0.3));
  const roof = { x: 0, y: -h - 8, m: rs.out() };
  return { blocks, door, win, roof, w, h };
}
/** a pale rainbow (origin: the centre of its arc) */
export function rainbow(c, r = 520, w = 16) {
  const cols = ['#e9a0a0', '#efc28c', '#efe0a0', '#b9d8a8', '#a8c8dc', '#c0acd6'];
  return cols.map((col, i) => `<path d="${c.ribbon(c.arc(0, 0, r - i * w, r - i * w, PI * 1.08, PI * 1.92, 40), w)}" fill="${col}" opacity=".55"/>`).join('');
}
/** a curl of wind (origin: its tail) */
export function windCurl(c, len = 180) {
  return `<path d="${c.ribbon([[0, 0], [len * 0.6, -4], [len * 0.8, -2], ...c.arc(len * 0.86, -18, 22, 16, PI * 0.5, PI * 2.2, 12)], 4)}" fill="#e8ecf2" opacity=".85"/>`;
}
/**
 * The storm kit. back(): storm sky and clouds on strings (call right after the day sky); front(): rain, a dark
 * tint, lightning and the flash (call last). set(storm, time, flashK) drives them all.
 */
export function stormKit(S) {
  const c = S.c;
  const K = {};
  K.back = () => {
    K.sky = sky(S, STORM, { name: 'storm' }).layer;
    K.sky.fade(0);
    K.cloudL = S.layer({ par: 0.06, sh: 7 });
    K.clouds = [[300, 190, 600], [780, 150, 680], [1250, 200, 620], [1700, 170, 560], [-120, 170, 520], [560, 250, 380], [1020, 260, 360]].map(([x, y, w], i) => ({ el: hanging(K.cloudL, stormCloud3(c, w, i), { x, y, len: 1200 }), x, y, i }));
    K.bolt = K.cloudL.add(`<g>${lightning3(c, 300)}</g>`);
  };
  K.front = ({ par = 0.9 } = {}) => {
    K.rainL = S.layer({ par, sh: 1, flat: true, pad: 420 });
    K.rainL.add(rain3(c, { x0: -1400, x1: 3000, y0: -900, y1: 1500, n: 380, slant: -52 }));
    K.windL = S.layer({ par: 0.6, sh: 1, flat: true });
    K.winds = [0, 1, 2, 3].map((i) => ({ i, y: 260 + i * 110, el: K.windL.add(`<g>${windCurl(c, 160 + i * 20)}</g>`) }));
    K.tint = S.layer({ par: 0, sh: 1, flat: true });
    K.tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2238"/>`);
    K.flash = S.layer({ par: 0, sh: 1, flat: true });
    K.flash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#f4f1ff"/>`);
  };
  K.set = (storm, time, flashK = 0, wind = storm) => {
    const T = time;
    K.sky.fade(storm);
    K.clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.3 + cl.i) * 30 * storm, cl.y - (1 - storm) * 900 + cl.i * 5, T, 2.2 * storm + 0.3, 0.9, cl.i));
    K.rainL.shift(-((T * 300) % 400) * 0.9 + 200, ((T * 1000) % 400) - 200);
    K.rainL.fade(Math.min(1, storm * 1.3));
    K.tint.fade(storm * 0.1);
    const flicker = Math.pow(Math.max(0, Math.sin(T * 1.9) * Math.sin(T * 0.7)), 30) * storm;
    const f = Math.max(flashK, flicker * 0.8);
    K.flash.fade(f * 0.45);
    pose(K.bolt, { x: 640 + Math.round(T * 2) % 3 * 220, y: 250, o: f > 0.25 ? 1 : 0 });
    K.winds.forEach((w) => {
      const k = time ? (T * 0.5 + w.i * 0.27) % 1 : (w.i + 0.5) / 4;
      pose(w.el, { x: 1700 - k * 1900, y: w.y + Math.sin(k * 9 + w.i) * 20, sx: -1, o: wind * Math.sin(k * PI) });
    });
  };
  return K;
}
import { rain as rain3, lightning as lightning3, stormCloud as stormCloud0 } from '../../assets/things.js';
import { swing } from '../kit.js';
const stormCloud3 = (c, w, i) => stormCloud0(c, w, i % 2 ? '#7a82a2' : '#687092', i % 2 ? '#5f6789' : '#555d7e');
