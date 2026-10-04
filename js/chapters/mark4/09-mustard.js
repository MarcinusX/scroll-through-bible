// Mk 4,30–32 — the mustard seed. Jesus weighs possible images (crown, palace, mountain) and
// chooses the tiniest seed; it is compared with other seeds, sown among the vegetables, and grows
// past them into a great tree where the birds nest and people rest in its shade.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, clamp, flap } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, rock, sun, cloud, town } from '../../assets/nature.js';
import { mustardTree, sprout, bird, paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';

const PI = Math.PI;
const BED = 500;            // garden soil surface
const TX = 800;             // where the seed goes in
const SEED_Y = 522;

/* ---------- local drawings ---------- */
function card(c, w, h, inner) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10), 0.6, 8), C.parchment);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 8), C.cream);
  return s.out() + inner;
}
function crownIcon(c) {
  const s = sheet();
  s.p(c.cut([[-40, 22], [-44, -18], [-24, 2], [-12, -30], [0, -2], [12, -30], [24, 2], [44, -18], [40, 22]], 0.5, 5), C.sun);
  s.p(c.cut(c.rect(-40, 14, 80, 12), 0.3, 5), C.sunDeep);
  s.x(c.poly(c.circ(-20, 20, 4, 8)) + c.poly(c.circ(20, 20, 4, 8)), C.jesusMantle);
  s.x(c.poly(c.circ(0, 20, 5, 8)), C.dustyBlue);
  s.x(c.poly(c.circ(-44, -20, 4, 8)) + c.poly(c.circ(-12, -32, 4, 8)) + c.poly(c.circ(12, -32, 4, 8)) + c.poly(c.circ(44, -20, 4, 8)), C.halo);
  return s.out();
}
function palaceIcon(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-46, -6, 92, 36), 0.4, 6), C.plaster);
  s.p(c.cut(c.rect(-50, -22, 18, 52), 0.4, 6) + c.cut(c.rect(32, -22, 18, 52), 0.4, 6), C.plaster2);
  s.p(c.cut([[-22, -6], ...c.arc(0, -6, 22, 26, PI, 2 * PI, 10), [22, -6]], 0.4, 5) + c.cut([[-50, -22], [-41, -38], [-32, -22]], 0.3, 4) + c.cut([[32, -22], [41, -38], [50, -22]], 0.3, 4), C.sun);
  s.x(c.poly([[-6, 30], [-6, 12], [0, 6], [6, 12], [6, 30]]), C.wood2);
  s.x(c.poly(c.rect(-34, 4, 8, 10)) + c.poly(c.rect(26, 4, 8, 10)), C.soilDark);
  s.x(c.ribbon([[0, -32], [0, -46]], 1.4) + c.poly([[0, -46], [12, -42], [0, -38]]), C.terracotta);
  return s.out();
}
function mountainIcon(c) {
  const s = sheet();
  s.p(c.cut([[-52, 30], [-18, -26], [4, 4], [22, -38], [54, 30]], 0.6, 6), C.rock2);
  s.p(c.cut([[-18, -26], [-8, -10], [-14, -6], [-22, -12], [-28, -10]], 0.3, 4) + c.cut([[22, -38], [32, -20], [24, -16], [16, -22], [12, -20]], 0.3, 4), C.cream);
  s.p(c.cut([[-52, 30], [-30, 16], [-8, 24], [14, 14], [54, 30]], 0.4, 6), C.sage);
  s.x(c.poly(c.circ(38, -34, 7, 10)), C.sun);
  return s.out();
}
// seed shapes for the line-up (drawn at true relative size)
function seedIcon(c, kind) {
  const s = sheet();
  if (kind === 'bean') {
    s.p(c.cut([...c.arc(0, 0, 26, 17, PI * 0.1, PI * 1.9, 18), [22, -3], [16, 0], [22, 3]], 0.3, 4), C.clay);
    let sp = '';
    for (let i = 0; i < 9; i++) sp += c.poly(c.circ(c.rr(-18, 14), c.rr(-10, 10), c.rr(1.2, 2.4), 5));
    s.x(sp, shade(C.clay, -0.3), 'opacity=".6"');
    s.x(c.ribbon(c.arc(-4, -2, 12, 8, PI * 1.1, PI * 1.6, 5), 2), shade(C.clay, 0.35), 'opacity=".7"');
  } else if (kind === 'olive') {
    s.p(c.cut(c.ell(0, 0, 10, 20, 16).map(([x, y]) => [x * (1 - Math.abs(y) / 40), y]), 0.3, 3), C.wood3);
    s.x(c.ribbon([[0, -18], [2, -4], [0, 18]], 1.2) + c.ribbon([[-4, -10], [-5, 8]], 1), shade(C.wood3, -0.3));
  } else if (kind === 'wheat') {
    s.p(c.cut(c.ell(0, 0, 6.5, 12, 14), 0.2, 3), C.wheat2);
    s.x(c.ribbon([[0, -10], [0.6, 10]], 1.1), shade(C.wheat2, -0.3));
  } else if (kind === 'lentil') {
    s.p(c.cut(c.ell(0, 0, 7, 6, 14), 0.2, 3), C.olive);
    s.x(c.ribbon(c.arc(0, 0, 5, 4, PI * 1.1, PI * 1.6, 4), 1), shade(C.olive, 0.35));
  } else {
    s.x(c.poly(c.circ(0, 0, 2.4, 22)), mix(C.sunDeep, C.wood2, 0.3));
    s.x(c.poly(c.circ(0.9, 0.7, 1.2, 14)), C.sunDeep);
    s.x(c.poly(c.circ(-0.3, 1.5, 0.35, 8)), C.soilDark);
  }
  return s.out();
}
function magnifier(c, inner) {
  const s = sheet();
  s.p(c.ribbon([[44, 44], [92, 92]], 13), C.wood2);
  s.p(c.cut(c.circ(0, 0, 66, 40), 0.3, 5), C.ochre);
  s.x(c.poly(c.circ(0, 0, 57, 40)), C.skyVeil, 'opacity=".92"');
  const lens = `<g>${inner}</g>`;
  const glint = `<path d="${c.ribbon(c.arc(0, 0, 44, 44, PI * 1.1, PI * 1.45, 8), 6)}" fill="${C.cream}" opacity=".75"/>`;
  return s.out() + lens + glint;
}
function cabbage(c, x, y, r) {
  const s = sheet();
  s.p(c.cut(c.blob(x, y - r * 0.55, r * 1.25, r * 0.6, 12, 0.2), 0.7, 5), C.moss);
  s.p(c.cut(c.blob(x, y - r * 0.8, r * 0.9, r * 0.75, 12, 0.12), 0.5, 5), C.sage);
  s.p(c.cut(c.blob(x + r * 0.1, y - r * 0.95, r * 0.55, r * 0.5, 10, 0.1), 0.4, 4), C.sage3);
  s.x(c.ribbon([[x - r * 0.5, y - r * 0.5], [x - r * 0.1, y - r * 1.1]], 1.4) + c.ribbon([[x + r * 0.6, y - r * 0.5], [x + r * 0.25, y - r * 1.05]], 1.4), shade(C.sage, 0.3), 'opacity=".8"');
  return s.out();
}
function leek(c, x, y, h) {
  const s = sheet();
  let lv = '';
  for (let i = 0; i < 4; i++) {
    const a = (i - 1.5) * 0.35, L = h * c.rr(0.55, 0.8);
    lv += c.ribbon(c.qbez([x, y - h * 0.35], [x + Math.sin(a) * L * 0.5, y - h * 0.35 - L * 0.7], [x + Math.sin(a) * L * 1.1, y - h * 0.35 - L * 0.9 + Math.abs(a) * 30], 8), (t) => 7 - t * 5);
  }
  s.p(lv, C.moss2);
  s.p(c.cut(c.rect(x - 6, y - h * 0.4, 12, h * 0.4 + 2), 0.3, 5), C.linen);
  s.x(c.poly(c.rect(x - 6, y - h * 0.42, 12, 6)), C.sage2);
  return s.out();
}
function onion(c, x, y, s0 = 1) {
  const s = sheet();
  let st = '';
  for (let i = 0; i < 3; i++) st += c.ribbon(c.qbez([x, y - 18 * s0], [x + (i - 1) * 6, y - 40 * s0], [x + (i - 1) * 14, y - 58 * s0], 6), (t) => 3.2 - t * 2.2);
  s.p(st, C.leaf);
  s.p(c.cut([[x - 14 * s0, y], ...c.arc(x, y - 6 * s0, 14 * s0, 14 * s0, PI, 2 * PI, 10), [x + 14 * s0, y], [x, y + 2]], 0.3, 4).replace(/Z$/, 'Z'), C.plumRobe);
  s.x(c.ribbon([[x - 4 * s0, y - 16 * s0], [x - 6 * s0, y - 2 * s0]], 1.2), shade(C.plumRobe, 0.35), 'opacity=".7"');
  return s.out();
}
function bigHand(c) {
  const s = sheet();
  s.p(c.cut([[-360, 300], [-250, 70], [-160, 40], [-112, 96], [-230, 330]], 0.8, 8), C.jesusMantle);
  s.x(c.ribbon([[-300, 190], [-200, 60]], 3), shade(C.jesusMantle, 0.25), 'opacity=".7"');
  s.p(c.cut([[-196, 44], [-150, 24], [-116, 76], [-160, 104]], 0.5, 6), C.linen);
  // cupped palm
  s.p(c.cut([[-180, 30], ...c.arc(0, 10, 185, 80, PI * 0.98, PI * 0.02, 20), [175, -8], [120, -2], [0, -10], [-120, 0]], 0.7, 7), C.skin);
  s.p(c.cut(c.ell(-6, 4, 140, 24, 24), 0.4, 6), shade(C.skin, 0.12));
  // fingers curling up on the right, thumb on the left
  const fingers = [[120, -2, 160, -84], [140, 2, 186, -64], [156, 6, 204, -42], [170, 12, 214, -16]];
  let f = '';
  fingers.forEach(([x0, y0, x1, y1], i) => { f += c.ribbon(c.qbez([x0, y0 + 20], [x1 - 10, y0 + 6], [x1, y1], 10), 30 - i * 3); });
  s.p(f, C.skin);
  let tips = '';
  fingers.forEach(([, , x1, y1], i) => { tips += c.cut(c.circ(x1, y1, 15 - i * 1.5, 12), 0.3, 4); });
  s.p(tips, C.skin);
  s.x(fingers.map(([x0, y0, x1, y1]) => c.ribbon([[x1 - 12, y1 + 22], [x1 + 4, y1 + 20]], 1.6)).join(''), shade(C.skin, -0.18), 'opacity=".6"');
  s.p(c.ribbon(c.qbez([-150, 40], [-196, 10], [-176, -60], 10), (t) => 40 - t * 10), shade(C.skin, -0.04));
  s.p(c.cut(c.circ(-176, -62, 17, 12), 0.3, 4), shade(C.skin, -0.04));
  s.x(c.ribbon(c.arc(-10, 30, 110, 30, PI * 0.15, PI * 0.85, 12), 2), shade(C.skin, -0.14), 'opacity=".55"');
  return s.out();
}
function nest(c) {
  const s = sheet();
  s.p(c.cut([[-26, -4], [26, -4], [20, 10], [0, 15], [-20, 10]], 1.2, 4), C.wood3);
  let tw = '';
  for (let i = 0; i < 7; i++) tw += c.ribbon([[-24 + i * 7, -3 + c.rr(-2, 2)], [-16 + i * 7, 9 + c.rr(-2, 2)]], 1.3);
  s.x(tw + c.ribbon(c.arc(0, 0, 25, 6, 0.1, PI - 0.1, 8), 1.4), C.wood2, 'opacity=".8"');
  return s.out();
}

export default {
  id: 'mustard',
  parable: true,
  beats: [
    { v: 30 },
    { v: 31, text: 'Jest ono jak ziarnko gorczycy;' },
    { v: 31, cont: true, text: 'gdy się je wsiewa w ziemię, jest najmniejsze ze wszystkich nasion na ziemi.' },
    { v: 32, text: 'Lecz wsiane wyrasta i staje się większe od jarzyn;' },
    { v: 32, cont: true, text: 'wypuszcza wielkie gałęzie, tak że ptaki powietrzne gnieżdżą się w jego cieniu».' },
  ],
  cam: { x: [-20, 20], y: [-70, 50], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    // phone: cards, seeds and labels hang inward, clear of the frame and the thread, and wait far above the
    // tall screen (K stretches every parking distance); the sun and the travellers come inward too
    const P = S.portrait, K = P ? 2 : 1;
    const SKY = [C.skyBlue, mix(C.skyBlue, C.cream, 0.55), C.cream];
    const SKY2 = [mix(C.skyBlue, C.skyBlue2, 0.5), mix(C.skyBlue, C.dawn, 0.5), C.dawn];
    const sk = sky(S, SKY);

    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: P ? 1040 : 1250, y: P ? 40 : 150, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 150, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1080, y: 230, len: 700 });

    /* ---------- land ---------- */
    const hills = S.layer({ par: 0.12, sh: 2 });
    hills.add(band(c, { y: 385, amps: [22, 8, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    const h2 = hillsWith(c, { y: 425, amps: [14, 6, 2], lens: [800, 280, 100], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup);
    hills.add(town(c, { x: 1250, y: h2.fn(1250) + 8, n: 6, spread: 220, sc: 0.5 }));

    const mid = S.layer({ par: 0.22, sh: 3 });
    const m = c.wave(462, [8, 3], [700, 200]);
    mid.add(sheet().p(c.ridge(m, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.hillNear, 0.5)).out());
    mid.add(olive(c, 330, 466, 1.1) + cypress(c, 420, 468, 150) + olive(c, 1300, 467, 1) + cypress(c, 1200, 468, 130) + cypress(c, 1400, 468, 170));

    // the garden: ground, top of the bed, back row of vegetables
    const garden = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(476, [3, 1.5], [600, 170]), -900, 2500, 1700, 12, 1), C.hillNear);
    gs.p(c.cut([[400, 482], [1200, 480], [1216, 508], [384, 510]], 0.8, 8), mix(C.soil, C.clay, 0.5));
    let furrows = '';
    for (let i = 0; i < 3; i++) furrows += c.ribbon([[404 - i * 5, 487 + i * 6], [1200 + i * 5, 486 + i * 6]], 1.6);
    gs.x(furrows, shade(C.soil, 0.05), 'opacity=".6"');
    garden.add(gs.out());
    let veg = '';
    const backVeg = [[440, 'leek'], [476, 'leek'], [520, 'cab'], [590, 'onion'], [630, 'onion'], [680, 'cab'], [740, 'leek'], [870, 'leek'], [920, 'cab'], [990, 'onion'], [1030, 'onion'], [1080, 'cab'], [1140, 'leek'], [1172, 'leek']];
    backVeg.forEach(([x, k]) => {
      if (k === 'leek') veg += leek(c, x, 494, c.rr(92, 112));
      else if (k === 'cab') veg += cabbage(c, x, 496, c.rr(28, 33));
      else veg += onion(c, x, 496, 1.2);
    });
    garden.add(veg);

    /* ---------- the tree (grows from the seed) ---------- */
    const treeL = S.layer({ par: 0.4, sh: 5 });
    const shadeEl = treeL.add(`<ellipse cx="0" cy="0" rx="430" ry="46" fill="${C.moss2}" opacity="0"/>`);
    const TH = 380;
    const tree = treeL.add(`<g>${mustardTree(c, { h: TH })}<g class="nests"></g></g>`);
    const branches = Array.from(tree.querySelectorAll('.branch')).map((b) => ({ g: b.querySelector('.grow'), inner: b.querySelector('.grow > g'), i: +b.dataset.i }));
    const crown = tree.querySelector('.crown .grow');
    const trunk = tree.querySelector('.trunk');
    const nestHolder = tree.querySelector('.nests');
    const NEST_OF = [2, 3, 6, 7, 8];
    nestHolder.innerHTML = NEST_OF.map(() => `<g opacity="0">${nest(c)}</g>`).join('');
    const nests = Array.from(nestHolder.children).map((el, j) => ({ el, b: NEST_OF[j], x: 0, y: 0 }));
    let nestsPlaced = false;
    const TREE_S = 1.0, TREE_SX = 1.6;
    const seedling = treeL.add(sprout(c, { h: 22, color: C.leaf }));
    const birds = [
      { from: [-150, 120], col: C.bird }, { from: [1750, 80], col: C.dustyBlue }, { from: [-120, 330], col: C.clay },
      { from: [1720, 300], col: C.bird }, { from: [800, -250], col: C.plumRobe },
    ].map((b, j) => ({ ...b, j, el: treeL.add(bird(c, { color: b.col })) }));

    /* ---------- bed front, the seed, the ground where people sit ---------- */
    const front = S.layer({ par: 0.4, sh: 4 });
    const fs = sheet();
    const top = [];
    for (let x = 384; x <= 1216; x += 10) top.push([x, BED + Math.sin(x * 0.09) * 1.5]);
    fs.p(c.cut([...top, [1216, 552], [384, 552]], 0.6, 8), C.soil);
    let crumbs = '';
    for (let i = 0; i < 60; i++) crumbs += c.poly(c.circ(c.rr(392, 1208), c.rr(BED + 8, 546), c.rr(1, 2.6), 5));
    fs.x(crumbs, shade(C.soil, 0.22), 'opacity=".5"');
    fs.p(c.cut(c.rect(376, 546, 848, 16), 0.5, 8), C.wood);
    fs.p(c.cut(c.rect(372, 494, 14, 70), 0.4, 6) + c.cut(c.rect(1214, 494, 14, 70), 0.4, 6), C.wood2);
    fs.p(c.ridge(c.wave(558, [3, 1.5], [600, 170]), -900, 2500, 1700, 12, 1), C.sage2);
    fs.p(c.ridge(c.wave(660, [10, 4], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5));
    front.add(fs.out());
    front.add(grass(c, { x0: -600, x1: 2200, y: 560, n: 50, h: 12, color: C.moss }) + flowers(c, { x0: -300, x1: 1900, y: 650, n: 30, h: 16 }));
    let fveg = '';
    [[430, 'cab'], [505, 'onion'], [560, 'cab'], [655, 'onion'], [705, 'cab'], [900, 'cab'], [955, 'onion'], [1045, 'cab'], [1100, 'onion'], [1170, 'cab']].forEach(([x, k]) => {
      fveg += k === 'cab' ? cabbage(c, x, BED + 5, c.rr(20, 24)) : onion(c, x, BED + 5, 0.95);
    });
    front.add(fveg);
    const seedDot = front.add(`<g><circle r="18" fill="url(#warm-glow)"/><g transform="scale(1.4)">${seedIcon(c, "mustard")}</g></g>`);
    const seedRing = front.add(`<circle r="14" fill="none" stroke="${C.cream}" stroke-width="2" opacity="0"/>`);
    const rootEl = front.add(`<g>${sheet().p(c.ribbon(c.cbez([0, 0], [-6, 12], [8, 22], [0, 34], 10), (t) => 2.6 - t * 1.8), C.linen2).out()}</g>`);
    const shadeFront = front.add(`<ellipse cx="0" cy="0" rx="520" ry="70" fill="${C.moss2}" opacity="0"/>`);

    /* ---------- Jesus, the disciples, travellers ---------- */
    const folk = S.layer({ par: 0.6, sh: 6 });
    folk.add(rock(c, 800, 712, 170, 56, C.rock));
    const palmSeed = `<g data-k="palmSeed" opacity="0"><circle cx="6" cy="-2" r="16" fill="url(#warm-glow)"/><circle cx="6" cy="-2" r="2.4" fill="${C.sunDeep}"/></g>`;
    const disc = [
      { cast: CAST.peter, x: 585, y: 690, s: 1.0, flip: false },
      { cast: CAST.john, x: 672, y: 718, s: 1.02, flip: false },
      { cast: CAST.andrew, x: 935, y: 718, s: 1.02, flip: true },
      { cast: CAST.james, x: 1020, y: 690, s: 1.0, flip: true },
    ].map((d, i) => ({ ...d, i, p: S.puppet(folk.add(person(c, { ...d.cast, pose: 'sit' }))) }));
    const jesus = S.puppet(folk.add(person(c, { ...CAST.jesus, pose: 'sit', holdF: palmSeed })));
    const palmSeedEl = S.$('palmSeed');
    const tossed = folk.add(`<g><circle r="24" fill="url(#warm-glow)"/><circle r="3.6" fill="${C.sunDeep}"/></g>`);
    // two travellers come to rest in the shade
    const trav = [
      { opts: { robe: C.tealRobe, mantle: C.stone, hair: C.hair3, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'full', skin: C.skin4 }, from: -120, x: 470, y: 648, flip: false },
      { opts: { robe: C.roseRobe, hair: C.hair, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin }, from: 1720, x: 1135, y: 652, flip: true },
    ].map((tv) => ({ ...tv, walk: S.puppet(folk.add(person(c, tv.opts))), sit: S.puppet(folk.add(person(c, { ...tv.opts, pose: 'sit' }))) }));
    if (P) { trav[0].x = 500; trav[1].x = 1085; }

    /* ---------- picture cards, the seed line-up, the magnifier ---------- */
    const cards = S.layer({ par: 0.55, sh: 7 });
    const ideas = [
      { icon: crownIcon(c), x: P ? 590 : 545, y: 300 },
      { icon: palaceIcon(c), x: 800, y: 235 },
      { icon: mountainIcon(c), x: P ? 1010 : 1055, y: 300 },
    ].map((d, i) => ({ ...d, i, el: hanging(cards, card(c, 140, 118, d.icon), { x: d.x, y: d.y, len: 700 }) }));
    const KINDS = [['bean', tr('fasola', 'bean')], ['olive', tr('oliwka', 'olive')], ['wheat', tr('pszenica', 'wheat')], ['lentil', tr('soczewica', 'lentil')], ['mustard', tr('gorczyca', 'mustard')]];
    const lineup = KINDS.map(([k, name], i) => {
      const inner = `<g transform="translate(0 -10)">${seedIcon(c, k)}</g><g transform="translate(0 38) scale(.5)">${paperLabel(name, { size: 30, fill: C.parchment })}</g>`;
      return { i, x: P ? 535 + i * 114 : 520 + i * 140, y: 285, el: hanging(cards, card(c, 104, 104, inner), { x: 0, y: 0, len: 700 }) };
    });
    const smallest = hanging(cards, paperLabel(tr('najmniejsze', 'the smallest'), { size: 26, fill: C.halo }), { x: 0, y: 0, len: 800 });
    const mag = hanging(cards, magnifier(c, `<g transform="scale(6.5)">${seedIcon(c, 'mustard')}</g><circle cx="-5" cy="-5" r="4.5" fill="${C.cream}" opacity=".55"/>`), { x: 0, y: 0, len: 800 });

    /* ---------- the close-up of the palm ---------- */
    const closeL = S.layer({ par: 0.9, sh: 9 });
    const plate = closeL.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 330, 90), 0.8, 8), C.parchment).p(c.cut(c.circ(0, 0, 316, 90), 0.6, 8), C.cream).out()}</g>`);
    const hand = closeL.add(`<g>${bigHand(c)}<g transform="translate(-4 -12)"><circle r="16" fill="url(#warm-glow)"/>${seedIcon(c, 'mustard')}</g></g>`);
    const gorLabel = hanging(closeL, paperLabel(tr('ziarnko gorczycy', 'a mustard seed'), { size: 28, fill: C.halo }), { x: 0, y: 0, len: 800 });
    const bigMag = hanging(closeL, `<g transform="scale(1.25)">${magnifier(c, `<g transform="scale(9)">${seedIcon(c, 'mustard')}</g><circle cx="-7" cy="-7" r="6" fill="${C.cream}" opacity=".55"/>`)}</g>`, { x: 0, y: 0, len: 800 });

    return (t, time) => {
      sk.blend(SKY, SKY2, es(t, 3, 5));
      pose(sunEl, { x: (P ? 1040 : 1250) - es(t, 0, 5) * 60, y: (P ? 40 : 150) + Math.sin(time * 0.6) * 3, r: Math.sin(time * 0.7) * 1.2 });
      pose(cl1, { x: 420 + seg(t, 0, 5) * 120 + Math.sin(time * 0.12) * 15, y: 150, r: Math.sin(time * 0.6) * 1.5 });
      pose(cl2, { x: 1080 - seg(t, 0, 5) * 90 + Math.sin(time * 0.1 + 2) * 15, y: 230, r: Math.sin(time * 0.7 + 1) * 1.5 });
      const blink = blinkAt(time);

      /* --- beat 0: which image? crown, palace, mountain... then a seed --- */
      ideas.forEach((d) => {
        const inn = es(t, 0.08 + d.i * 0.12, 0.3 + d.i * 0.12, ease.back);
        const out = es(t, 0.62 + d.i * 0.04, 0.8 + d.i * 0.04);
        const doubt = bump(t, 0.5 + d.i * 0.03, 0.66 + d.i * 0.03);
        pose(d.el, { x: d.x, y: d.y - (1 - inn) * 520 * K - out * 560 * K, r: Math.sin(time * 0.9 + d.i * 2) * 2 + doubt * Math.sin(t * 90 + d.i) * 7, o: inn > 0.001 && out < 0.999 ? 1 : 0 });
      });
      const look = t < 0.62 ? [(-1), 0, 1][Math.min(2, Math.floor(seg(t, 0.12, 0.6) * 3))] : 0;
      const seedIn = es(t, 0.72, 0.9);
      fade(palmSeedEl, seedIn * (1 - seg(t, 2.02, 2.06)));

      /* --- beat 1: close-up of the palm, magnifier, name --- */
      const close = es(t, 0.95, 1.25) * (1 - es(t, 1.9, 2.1));
      pose(plate, { x: 800, y: 470 + (1 - close) * 700, s: 0.6 + close * 0.4, r: (1 - close) * 8, o: close > 0.001 ? 1 : 0 });
      pose(hand, { x: 800, y: 530 + (1 - close) * 760 + Math.sin(time * 0.8) * 3, r: (1 - close) * -10, o: close > 0.001 ? 1 : 0 });
      const magIn = es(t, 1.25, 1.5, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(bigMag, { x: 800 - 5, y: 518 - (1 - magIn) * 700 * K, r: Math.sin(time * 0.8) * 1.5 });
      const nameIn = es(t, 1.4, 1.6, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(gorLabel, { x: P ? 925 : 1045, y: 330 - (1 - nameIn) * 600 * K, r: Math.sin(time * 0.9 + 1) * 2.5 });

      /* --- beat 2: sown into the garden; the smallest of all seeds --- */
      const toss = seg(t, 2.02, 2.28);
      const hx = 868, hy = 640;
      pose(tossed, { x: lerp(hx, TX, toss), y: lerp(hy, SEED_Y, toss) - Math.sin(toss * PI) * 150, o: toss > 0 && toss < 1 ? 1 : 0 });
      const planted = t >= 2.28 ? 1 : 0;
      const sprouted = es(t, 3.02, 3.2);
      pose(seedDot, { x: TX, y: SEED_Y, s: 1 + bump(t, 2.28, 2.5) * 1.2, o: planted * (1 - es(t, 3.4, 3.8)) });
      const rk = seg(t, 2.28, 2.62);
      pose(seedRing, { x: TX, y: SEED_Y, s: 0.4 + rk * 2.2, o: rk > 0 && rk < 1 ? (1 - rk) * 0.9 : 0 });
      pose(rootEl, { x: TX, y: SEED_Y + 2, sy: Math.max(0.01, sprouted * (1 + es(t, 3.2, 3.9) * 0.5)), s: 1, o: sprouted > 0 ? 1 - es(t, 3.7, 3.95) : 0 });
      lineup.forEach((l) => {
        const inn = es(t, 2.3 + l.i * 0.07, 2.5 + l.i * 0.07, ease.back);
        const out = es(t, 2.9 + (4 - l.i) * 0.03, 3.08 + (4 - l.i) * 0.03);
        pose(l.el, { x: l.x, y: l.y - (1 - inn) * 520 * K - out * 560 * K, r: Math.sin(time * 0.8 + l.i * 1.7) * 2, o: inn > 0.001 && out < 0.999 ? 1 : 0 });
      });
      const mIn = es(t, 2.62, 2.8, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(mag, { x: (P ? 991 : 1080) + 8, y: 275 - (1 - mIn) * 600 * K, s: 0.72, r: Math.sin(time * 0.9) * 2 });
      const sIn = es(t, 2.72, 2.88, ease.back) * (1 - es(t, 2.92, 3.06));
      pose(smallest, { x: P ? 965 : 1080, y: 380 - (1 - sIn) * 700 * K, r: Math.sin(time + 2) * 3 });

      /* --- beats 3–4: it grows past the vegetables into a great tree --- */
      const g1 = es(t, 3.15, 3.85);                  // young tree
      const g2 = es(t, 4.0, 4.45);                   // great tree
      const ts = 0.06 + g1 * 0.42 + g2 * (TREE_S - 0.48);
      const tsx = ts * lerp(1, TREE_SX, g2);
      pose(tree, { x: TX, y: BED + 3, sx: tsx / ts, s: ts, o: g1 > 0.001 ? 1 : 0 });
      pose(seedling, { x: TX, y: BED + 2, s: sprouted * (1 - g1) * 1.3, o: sprouted > 0.01 && g1 < 1 ? 1 : 0, r: Math.sin(time * 1.4) * 4 });
      branches.forEach((b) => {
        const k = b.i < 4 ? es(t, 3.3 + b.i * 0.12, 3.62 + b.i * 0.12, ease.back) : es(t, 4.0 + (b.i - 4) * 0.06, 4.28 + (b.i - 4) * 0.06, ease.back);
        pose(b.g, { s: Math.max(0.001, k), r: Math.sin(time * 0.6 + b.i) * 1.2 * k });
      });
      pose(crown, { s: Math.max(0.001, es(t, 4.25, 4.5, ease.back)) * 0.8, sx: 1 / lerp(1, TREE_SX, g2) * 1.3, sy: 0.85 });
      pose(trunk, {});
      const shadeK = es(t, 3.9, 4.5);
      pose(shadeEl, { x: TX, y: 560, s: 0.3 + shadeK * 0.7, o: shadeK * 0.3 });
      pose(shadeFront, { x: TX, y: 640, s: 0.3 + shadeK * 0.7, o: shadeK * 0.22 });

      // nests: sit on branch ends (measured once the tree is on stage)
      if (!nestsPlaced) {
        const bb = branches.map((b) => { try { return b.inner.getBBox(); } catch (e) { return null; } });
        if (bb.every((r) => r && r.width > 0)) {
          nests.forEach((n) => {
            const r = bb[n.b], left = r.x + r.width / 2 < 0;
            n.x = left ? r.x + r.width * 0.34 : r.x + r.width * 0.66; n.y = r.y + r.height * 0.42;
          });
          nestsPlaced = true;
        }
      }
      nests.forEach((n, j) => {
        const k = es(t, 4.3 + j * 0.04, 4.45 + j * 0.04, ease.back);
        pose(n.el, { x: n.x, y: n.y, s: k, sx: 1 / lerp(1, TREE_SX, g2), o: k > 0.01 ? 1 : 0 });
      });
      // birds of the air fly in and settle, flapping
      birds.forEach((b) => {
        const n = nests[b.j];
        const nx = TX + n.x * ts * (tsx / ts), ny = BED + 3 + n.y * ts - 8;
        const k = es(t, 4.35 + b.j * 0.07, 4.72 + b.j * 0.07, ease.out);
        const x = lerp(b.from[0], nx, k), y = lerp(b.from[1], ny, k) - Math.sin(k * PI) * 60;
        const settled = k >= 1;
        const faceLeft = nx < b.from[0];
        pose(b.el, { x, y: y + (settled ? 0 : Math.sin(time * 3 + b.j) * 4), s: 0.9, sx: faceLeft ? -1 : 1, o: k > 0.001 ? 1 : 0 });
        const flapAmt = settled ? Math.max(0, Math.sin(time * 0.9 + b.j * 1.7) - 0.7) * 3 : 1;
        flap(b.el, time + t * 20, 30 * flapAmt, 11);
      });

      /* --- Jesus & the disciples --- */
      const thinking = es(t, 0.05, 0.2) * (1 - es(t, 0.66, 0.78));
      const offer = es(t, 0.7, 0.88) * (1 - es(t, 2.0, 2.12));
      const throwA = bump(t, 1.98, 2.22);
      const lookUp = es(t, 3.1, 3.5);
      jesus.set({
        x: 800, y: 702, s: 1.12, blink,
        armF: thinking * 30 + offer * 62 + throwA * 70 + lookUp * (70 + es(t, 4.0, 4.4) * 40) + Math.sin(time * 0.9) * 3,
        armB: 12 + thinking * 20 + lookUp * 10,
        head: thinking * (look * 8 - 12) + offer * 8 + throwA * -12 - lookUp * 14 + Math.sin(time * 0.6) * 1.5,
      });
      disc.forEach((d) => {
        const lk = d.flip ? 1 : 1;
        d.p.set({
          x: d.x, y: d.y, s: d.s, flip: d.flip, blink: blinkAt(time, d.i + 1),
          armF: 20 + bump(t, 0.3 + d.i * 0.08, 0.7 + d.i * 0.08) * 20 + es(t, 4.1 + d.i * 0.05, 4.4) * (d.i % 2 ? 125 : 25),
          armB: 15,
          head: -es(t, 0.05, 0.2) * 8 * lk + es(t, 0.8, 1) * 6 - es(t, 3.2, 3.6) * 16 + Math.sin(time * 0.7 + d.i) * 1.5,
        });
      });
      trav.forEach((tv, i) => {
        const w = seg(t, 4.3 + i * 0.1, 4.72 + i * 0.1);
        const sat = seg(t, 4.72 + i * 0.1, 4.8 + i * 0.1);
        tv.walk.set({ x: lerp(tv.from, tv.x, ease.out(w)), y: tv.y + 22, s: 0.92, flip: tv.flip, walk: w > 0 && w < 1 ? w * 16 : undefined, o: w > 0 ? 1 - sat : 0, armF: 10, blink });
        tv.sit.set({ x: tv.x, y: tv.y + 22, s: 0.92, flip: !tv.flip, o: sat, armF: 30, armB: 40, head: -10 + Math.sin(time * 0.5 + i) * 2, blink: blinkAt(time, 5 + i) });
      });

      /* --- camera --- */
      S.cam.z = 1.04 - es(t, 0.9, 1.3) * 0.04 + es(t, 2.2, 2.5) * 0.06 * (1 - es(t, 3, 3.3)) - es(t, 3.5, 4.6) * 0.2;
      S.cam.y = es(t, 3.3, 4.6) * -60;
      S.cam.x = 0;
    };
  },
};
