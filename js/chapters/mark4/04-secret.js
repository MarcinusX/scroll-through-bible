// Mk 4,10–13 — evening under an olive tree: alone with the Twelve and those close to him,
// Jesus gives them the mystery of the Kingdom; to those outside everything comes in parables.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, town, moon, stars, grass, bush } from '../../assets/nature.js';
import { oilLamp, sprout, sickle, mustardTree, bushel, wheatStalk, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';

const PI = Math.PI;

/* ---------- local cut-outs ---------- */

/** a hand-cut "?" on a little paper speech bubble (tail points down to the head) */
function question(c) {
  const s = sheet();
  s.p(c.cut([...c.blob(0, -4, 21, 24, 12, 0.07), [6, 20], [2, 30], [-5, 19]], 0.5, 5), C.cream);
  const hook = c.arc(0, -11, 8, 8, PI * 1.02, PI * 2.5, 12);
  hook.push([0, 1.5]);
  s.x(c.ribbon(hook, 4.6), C.terracotta);
  s.x(c.cut(c.circ(0, 9, 3.1, 8), 0.2, 2), C.terracotta);
  return s.out();
}

/** a little casket with a crown: the lid (data-part="lid") hinges at its left end */
function casket(c) {
  const b = sheet();
  b.p(c.cut(c.rect(-36, -38, 72, 38), 0.5, 7), C.wood3);
  b.p(c.cut(c.rect(-36, -38, 72, 6), 0.3, 7), shade(C.wood3, -0.2));
  b.p(c.cut(c.rect(-26, -38, 7, 38), 0.3, 6) + c.cut(c.rect(19, -38, 7, 38), 0.3, 6), C.ochre);
  // crown of the Kingdom
  b.p(c.cut([[-12, -12], [-12, -26], [-6, -19], [0, -29], [6, -19], [12, -26], [12, -12]], 0.3, 3), C.sun);
  b.x(c.poly(c.circ(0, -7, 2.4, 8)) + c.poly([[-1.6, -6], [1.6, -6], [2.4, -1.5], [-2.4, -1.5]]), C.soilDark);
  const lid = sheet();
  lid.p(c.cut([[0, 0], ...c.arc(37, 0, 38, 17, PI, 2 * PI, 12), [74, 0], [74, 4], [0, 4]], 0.4, 6), C.wood);
  lid.p(c.cut(c.rect(10, -14, 7, 18), 0.3, 5) + c.cut(c.rect(57, -14, 7, 18), 0.3, 5), C.ochre);
  // light inside (revealed as the lid opens)
  const inner = `<path d="${c.cut(c.ell(0, -38, 32, 7, 16), 0.3, 5)}" fill="${C.lampGlow}"/>`;
  return `<g data-part="glow" opacity="0"><circle cx="0" cy="-40" r="150" fill="url(#warm-glow)"/></g>` +
    `<g data-part="rays" opacity="0" transform="translate(0 -40)">${raysPath(c, 14, 44, 125, C.lampGlow)}</g>` +
    `${inner}${b.out()}<g data-part="lid" transform="translate(-37 -38)">${lid.out()}</g>`;
}
function raysPath(c, n, r0, r1, color) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.05, 0.05), w = 0.06 * c.rr(0.6, 1.3);
    d += c.poly([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a - w) * r1, Math.sin(a - w) * r1], [Math.cos(a + w) * r1, Math.sin(a + w) * r1]]);
  }
  return `<path d="${d}" fill="${color}" opacity=".55"/>`;
}

/** a small spark of light that settles over a head */
function spark(c) {
  const s = sheet();
  s.p(c.cut(c.star(0, 0, 11, 4, 4, 0), 0.2, 3), C.halo);
  s.x(c.poly(c.circ(0, 0, 3, 8)), C.star);
  return `<circle r="34" fill="url(#warm-glow)" opacity=".8"/>${s.out()}`;
}

/** a picture card: cream card, parchment face, icon, and (hidden) cord + wax seal */
function card(c, icon, { w = 74, h = 96, sealed = false } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.6, 8), C.cream);
  s.p(c.cut(c.rect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12), 0.4, 8), C.parchment);
  let seal = '';
  if (sealed) {
    const cord = sheet();
    cord.p(c.ribbon([[-w / 2 - 3, -4], [w / 2 + 3, 4]], 5) + c.ribbon([[-6, -h / 2 - 3], [4, h / 2 + 3]], 5), C.rope);
    const wax = sheet();
    wax.p(c.cut(c.blob(0, 0, 17, 16, 12, 0.14), 0.8, 4), C.terracotta);
    wax.p(c.cut(c.circ(0, 0, 11, 16), 0.3, 3), shade(C.terracotta, -0.15));
    wax.x(c.poly(c.star(0, 0, 7, 3, 5)), shade(C.terracotta, 0.25));
    seal = `<g data-part="cord" opacity="0">${cord.out()}</g><g data-part="seal" opacity="0">${wax.out()}</g>`;
  }
  return `${s.out()}<g>${icon}</g>${seal}`;
}

/** a gauze veil on a string, fringed at the bottom */
function veil(c, w = 40, h = 13) {
  const pts = [[-w / 2, -h / 2], [w / 2, -h / 2]];
  for (let i = 0; i <= 7; i++) { const x = w / 2 - (w * i) / 7; pts.push([x, h / 2 + (i % 2 ? 4 : 0)]); }
  const s = sheet();
  s.p(c.cut(pts, 0.6, 5), C.lavender, 'opacity=".9"');
  let folds = '';
  for (let x = -w / 2 + 7; x < w / 2; x += 8) folds += c.ribbon([[x, -h / 2 + 2], [x + c.rr(-2, 2), h / 2]], 1.4);
  s.x(folds, shade(C.lavender, -0.15), 'opacity=".6"');
  s.p(c.cut(c.rect(-w / 2 - 3, -h / 2 - 3, w + 6, 4), 0.3, 6), C.wood2);
  return s.out();
}

/** sound: three arcs, facing +x */
function waves(c) {
  let out = '';
  for (let i = 0; i < 3; i++) out += `<path data-part="w" d="${c.ribbon(c.arc(0, 0, 22, 22, -0.8, 0.8, 10), 4.4)}" fill="${C.cream}"/>`;
  return out;
}

/** a big gnarled olive tree with silvery leaf clusters (finer than the small library olive) */
function oliveTree(c, x, y, sc = 1) {
  const s = sheet();
  const X = (v) => x + v * sc, Y = (v) => y + v * sc;
  // twisted trunk splitting into three limbs
  s.p(c.cut([[X(-30), Y(0)], [X(-20), Y(-40)], [X(-34), Y(-90)], [X(-80), Y(-140)], [X(-66), Y(-150)], [X(-20), Y(-112)], [X(-6), Y(-160)], [X(8), Y(-162)], [X(10), Y(-118)], [X(60), Y(-150)], [X(74), Y(-140)], [X(22), Y(-86)], [X(20), Y(-40)], [X(34), Y(0)]], 1, 7), C.wood2);
  s.x(c.ribbon([[X(-8), Y(-10)], [X(-2), Y(-60)], [X(-14), Y(-100)]], 3 * sc) + c.ribbon([[X(12), Y(-20)], [X(8), Y(-70)]], 2.4 * sc), shade(C.wood2, -0.25), 'opacity=".7"');
  const cols = [C.sage, mix(C.sage, C.olive, 0.5), C.olive];
  const ds = ['', '', ''];
  for (let i = 0; i < 34; i++) {
    const a = c.rr(PI * 1.02, PI * 1.98), r = c.rr(0.25, 1);
    const cx = X(Math.cos(a) * 190 * r), cy = Y(-170 + Math.sin(a) * 105 * r);
    const k = i < 12 ? 2 : i < 24 ? 1 : 0;
    ds[k] += c.cut(c.blob(cx, cy, c.rr(26, 40) * sc, c.rr(18, 26) * sc, 11, 0.2), 0.9, 6);
  }
  s.p(ds[2], cols[2]).p(ds[1], cols[1]).p(ds[0], cols[0]);
  let lv = '';
  for (let i = 0; i < 70; i++) {
    const a = c.rr(PI * 1.05, PI * 1.95), r = c.rr(0.3, 0.9);
    lv += c.poly(c.ell(X(Math.cos(a) * 200 * r), Y(-170 + Math.sin(a) * 112 * r), 6 * sc, 2.2 * sc, 8, c.rr(-0.8, 0.8)));
  }
  s.x(lv, C.sage3, 'opacity=".75"');
  return s.out();
}

/** the sower parable as a small hanging plate */
function sowerPlate(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 52, 32), 0.6, 5), C.cream);
  s.p(c.cut([[-44, 22], ...c.arc(0, 18, 46, 9, PI, 2 * PI, 10), [44, 22], ...c.arc(0, 22, 44, 26, 0, PI, 10)], 0.4, 5), C.soil);
  let seeds = '';
  for (let i = 0; i < 9; i++) seeds += seedPath(c, c.rr(-2, 34), c.rr(-14, 16), 2.2, c.rr(0, 3));
  s.x(seeds, C.wheat2);
  const sower = person(c, { robe: C.wheatRobe, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin2, belt: C.leather });
  return `${s.out()}<g transform="translate(-12 25) scale(.27)">${sower.replace('class="armFr"', 'class="armFr" transform="rotate(-110)"')}</g>`;
}

export default {
  id: 'secret',
  beats: [
    { v: 10 },
    { v: 11, text: 'On im odrzekł: «Wam dana jest tajemnica królestwa Bożego,' },
    { v: 11, cont: true, text: 'dla tych zaś, którzy są poza wami, wszystko dzieje się w przypowieściach,' },
    { v: 12, text: 'aby patrzyli oczami, a nie widzieli, słuchali uszami, a nie rozumieli,' },
    { v: 12, cont: true, text: 'żeby się nie nawrócili i nie była im wydana [tajemnica]».' },
    { v: 13, text: 'I mówił im: «Nie rozumiecie tej przypowieści?' },
    { v: 13, cont: true, text: 'Jakże zrozumiecie inne przypowieści?' },
  ],
  cam: { x: [-10, 10], y: [-20, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const SKY0 = [C.duskViolet, C.dusk, C.peach];
    const SKY1 = [mix(C.indigo, C.duskViolet, 0.45), mix(C.duskViolet, C.dusk, 0.35), mix(C.dusk, C.peach, 0.4)];
    const sk = sky(S, SKY0);

    /* heavens: first stars and a moon on strings */
    const hangL = S.layer({ par: 0.04, sh: 3 });
    const starsEl = hangL.add(`<g opacity="0">${stars(c, { x0: -500, x1: 2100, y0: -200, y1: 330, n: 70 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 30), { x: 1170, y: 175, len: 600 });
    const evening = hanging(hangL, `<path d="${c.cut(c.star(0, 0, 13, 4, 4, 0), 0.2, 3)}" fill="${C.star}"/>`, { x: 470, y: 150, len: 500 });

    /* distant hills with a sleepy town */
    const hills = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 395, amps: [20, 8, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.35) });
    hills.add(h1.markup);
    hills.add(town(c, { x: 250, y: h1.fn(250) + 12, n: 7, spread: 320, sc: 0.55, wall: mix(C.plaster, C.duskViolet, 0.25), shadow: mix(C.plaster2, C.duskViolet, 0.35), lit: true }));
    hills.add(town(c, { x: 1380, y: h1.fn(1380) + 12, n: 6, spread: 280, sc: 0.5, wall: mix(C.plaster, C.duskViolet, 0.25), shadow: mix(C.plaster2, C.duskViolet, 0.35), lit: true }));
    hills.add(cypress(c, 610, h1.fn(610) + 6, 90, mix(C.moss2, C.duskViolet, 0.3)) + cypress(c, 1010, h1.fn(1010) + 6, 110, mix(C.moss2, C.duskViolet, 0.3)));

    /* the lane outside the courtyard wall: people outside, their picture-cards, veils and sounds */
    const lane = S.layer({ par: 0.26, sh: 3 });
    const tint = (col) => mix(col, C.duskViolet, 0.42);
    const OUT = [
      { x: 418, s: 0.88, flip: false }, { x: 484, s: 0.93, flip: false }, { x: 548, s: 0.86, flip: false },
      { x: 1054, s: 0.87, flip: true }, { x: 1118, s: 0.94, flip: true }, { x: 1184, s: 0.88, flip: true },
    ].map((o, i) => {
      const base = crowdPerson(c);
      const opts = { ...base, robe: tint(base.robe), mantle: base.mantle && tint(base.mantle), skin: tint(base.skin), hair: tint(base.hair), veil: tint(base.veil), belt: base.belt && tint(base.belt) };
      return { ...o, y: 530, i, seed: c.rr(0, 9), p: S.puppet(lane.add(person(c, opts))), away: o.flip ? 1900 + i * 60 : -300 - i * 60 };
    });
    const CARDS = [
      { x: 452, y: 292, icon: `<g transform="translate(0 22)">${sprout(c, { h: 40 })}</g>` },
      { x: 530, y: 262, icon: `<g transform="translate(-2 10)">${oilLamp(c).replace(/<circle class="glow"[^>]*\/>/, '')}</g>` },
      { x: 1068, y: 262, icon: `<g transform="translate(0 36) scale(.15)">${mustardTree(c, { h: 420 }).replace(/class="grow"/g, '')}</g>` },
      { x: 1148, y: 292, icon: `<g transform="translate(8 -2) scale(.62) rotate(20)">${sickle(c)}</g>` },
    ].map((cd, i) => {
      cd.el = hanging(lane, card(c, cd.icon, { sealed: true }), { x: cd.x, y: cd.y, len: 400 });
      cd.cord = cd.el.querySelector('[data-part="cord"]');
      cd.seal = cd.el.querySelector('[data-part="seal"]');
      cd.i = i;
      return cd;
    });
    OUT.forEach((o) => {
      o.veil = hanging(lane, veil(c), { x: o.x, y: 380, len: 500 });
      o.waves = lane.add(`<g>${waves(c)}</g>`);
      o.w = Array.from(o.waves.querySelectorAll('[data-part="w"]'));
    });

    /* courtyard: a low plastered wall and a paved floor */
    const yard = S.layer({ par: 0.34, sh: 4 });
    const wallTop = c.wave(442, [3, 1.5], [500, 140]);
    const ws = sheet();
    ws.p(c.ridge(wallTop, -900, 2500, 540, 14, 1.2), C.plaster);
    ws.p(c.ridge((x) => wallTop(x) - 2, -900, 2500, 456, 16, 0.8), C.stone2);
    let blocks = '';
    for (let x = -880; x < 2500; x += c.rr(70, 110)) blocks += c.ribbon([[x, 470 + c.rr(-4, 4)], [x + c.rr(-3, 3), 520]], 1.4);
    for (let x = -860; x < 2500; x += c.rr(90, 140)) blocks += c.ribbon([[x, 494], [x + c.rr(40, 80), 494 + c.rr(-2, 2)]], 1.2);
    ws.x(blocks, C.plaster2, 'opacity=".9"');
    yard.add(ws.out());
    const floor = band(c, { y: 528, amps: [3, 1.5], lens: [600, 170], color: mix(C.sand, C.stone2, 0.5) });
    yard.add(floor.markup);
    let paving = '';
    for (let r = 0; r < 7; r++) {
      const y = 556 + r * r * 9 + r * 18;
      paving += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.6);
    }
    yard.add(sheet().x(paving, shade(C.stone2, -0.08), 'opacity=".5"').out());
    yard.add(grass(c, { x0: -600, x1: 2200, y: 530, n: 36, h: 13, color: C.olive, fn: floor.fn }));
    yard.add(bush(c, 330, 535, 90, C.sage, C.moss) + bush(c, 1290, 536, 80, C.sage, C.moss));
    // clay jars along the wall
    const jar = (x, y, s) => sheet().p(c.cut([[x - 14 * s, y], [x - 20 * s, y - 22 * s], [x - 12 * s, y - 40 * s], [x - 8 * s, y - 50 * s], [x + 8 * s, y - 50 * s], [x + 12 * s, y - 40 * s], [x + 20 * s, y - 22 * s], [x + 14 * s, y]], 0.5, 5), C.pot).x(c.ribbon([[x - 18 * s, y - 26 * s], [x + 18 * s, y - 26 * s]], 2.4 * s), shade(C.pot, -0.2)).out();
    yard.add(jar(390, 540, 1) + jar(420, 542, 0.8) + jar(1230, 541, 0.9));

    /* the olive tree over Jesus, and a pool of lamplight on the floor */
    const treeL = S.layer({ par: 0.4, sh: 5 });
    const pool = treeL.add(`<ellipse cx="800" cy="660" rx="520" ry="190" fill="url(#warm-glow)" opacity=".35"/>`);
    treeL.add(oliveTree(c, 800, 600, 1.15));

    /* the circle: back row (kneeling / seated) */
    const rowA = S.layer({ par: 0.48, sh: 4 });
    const W1 = crowdPerson(c, { hairStyle: 'veil', beard: 'none', veil: C.blushVeil, robe: C.roseRobe });
    const W2 = crowdPerson(c, { hairStyle: 'veil', beard: 'none', veil: C.skyVeil, robe: C.sageRobe });
    const man = (extra = {}) => { const o = crowdPerson(c, extra); if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; } return o; };
    const SPEC = [
      // row A (back)
      { L: rowA, x: 552, y: 588, s: 0.68, o: CAST.andrew, pose: 'sit' },
      { L: rowA, x: 628, y: 584, s: 0.66, o: man(), pose: 'sit' },
      { L: rowA, x: 700, y: 578, s: 0.64, o: W1, pose: 'kneel' },
      { L: rowA, x: 900, y: 578, s: 0.64, o: W2, pose: 'kneel' },
      { L: rowA, x: 972, y: 584, s: 0.66, o: CAST.thomas, pose: 'sit' },
      { L: rowA, x: 1048, y: 588, s: 0.68, o: man(), pose: 'sit' },
    ];
    SPEC.forEach((m) => { m.p = S.puppet(rowA.add(person(c, { ...m.o, pose: m.pose }))); });

    /* Jesus, the lamp and the middle row */
    const midL = S.layer({ par: 0.58, sh: 5 });
    const lampEl = midL.add(`<g>${oilLamp(c)}</g>`);
    const lampFlame = lampEl.querySelector('.flame'), lampGlow = lampEl.querySelector('.glow');
    const jesus = S.puppet(midL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    [
      { x: 468, y: 660, s: 0.8, o: CAST.james },
      { x: 575, y: 668, s: 0.8, o: man() },
      { x: 1025, y: 668, s: 0.8, o: CAST.matthew },
      { x: 1132, y: 660, s: 0.8, o: man() },
    ].forEach((m) => { m.L = midL; m.pose = 'sit'; m.p = S.puppet(midL.add(person(c, { ...m.o, pose: 'sit' }))); SPEC.push(m); });

    /* the magic: the casket of the mystery, the sower plate, the fan of other parables */
    const magic = S.layer({ par: 0.6, sh: 6 });
    const plate = hanging(magic, sowerPlate(c), { x: 800, y: 250, len: 500 });
    const box = hanging(magic, casket(c), { x: 800, y: 440, len: 600 });
    const boxLid = box.querySelector('[data-part="lid"]'), boxGlow = box.querySelector('[data-part="glow"]'), boxRays = box.querySelector('[data-part="rays"]');
    const FAN = [
      `<g transform="translate(0 38) scale(.62)">${wheatStalk(c, { h: 70 }).replace('class="stalk"', '')}</g>`,
      `<g transform="translate(-4 12)">${oilLamp(c).replace(/<circle class="glow"[^>]*\/>/, '')}</g>`,
      `<g transform="translate(0 26) scale(.72)">${bushel(c, 64, 52)}</g>`,
      `<g transform="translate(0 38) scale(.16)">${mustardTree(c, { h: 420 }).replace(/class="grow"/g, '')}</g>`,
      `<g transform="translate(0 24)">${sprout(c, { h: 38 })}</g>`,
      `<g transform="translate(8 -2) scale(.62) rotate(20)">${sickle(c)}</g>`,
    ].map((icon, i) => ({ i, a: [-66, -42, -18, 18, 42, 66][i], el: magic.add(`<g opacity="0">${card(c, icon)}</g>`) }));

    /* front row (closest to us) */
    const rowC = S.layer({ par: 0.72, sh: 6 });
    [
      { x: 530, y: 748, s: 0.92, o: man() },
      { x: 652, y: 756, s: 0.95, o: CAST.peter },
      { x: 948, y: 756, s: 0.95, o: CAST.john },
      { x: 1070, y: 748, s: 0.92, o: man() },
    ].forEach((m) => { m.L = rowC; m.pose = 'sit'; m.p = S.puppet(rowC.add(person(c, { ...m.o, pose: 'sit' }))); SPEC.push(m); });

    // everyone in the circle faces Jesus; head position for bubbles & sparks
    SPEC.forEach((m, i) => {
      m.flip = m.x > 800; m.i = i; m.seed = c.rr(0, 9); m.dir = m.flip ? -1 : 1;
      const dy = m.pose === 'kneel' ? 46 : 62;
      m.hx = m.x + 2 * m.s * m.dir; m.hy = m.y + (-167 + dy) * m.s;
      m.spark = m.L.add(`<g opacity="0">${spark(c)}</g>`);
    });
    const ASK = [1, 4, 6, 9, 11, 12, 13].map((i) => SPEC[i]); // question marks in beat 1
    ASK.forEach((m, k) => { m.q = m.L.add(`<g opacity="0">${question(c)}</g>`); m.qk = k; });
    const PUZZLED = [6, 11, 12].map((i) => SPEC[i]); // still puzzled in beat 6

    return (t, time) => {
      const T = time;
      sk.blend(SKY0, SKY1, es(t, 0, 5.5, ease.sine));
      fade(starsEl, 0.2 + es(t, 1, 5) * 0.8);
      pose(moonEl, { x: 1170, y: 205 - es(t, -0.5, 6.5) * 50, r: Math.sin(T * 0.6) * 1.2 });
      pose(evening, { x: 470, y: 150, r: Math.sin(T * 0.8 + 1) * 2, s: 1 + Math.sin(T * 2.2) * 0.08 });

      /* people outside: leave in beat 0, come back in beat 2, veiled in 3, sealed in 4, gone in 5 */
      const leave = es(t, -0.1, 0.75), back = es(t, 2.0, 2.4), gone = es(t, 5.0, 5.5);
      OUT.forEach((o) => {
        const away = Math.max(leave * (1 - back), gone);
        const x = lerp(o.x, o.away, away);
        const moving = (t > -0.1 && t < 0.75) || (t > 2 && t < 2.4) || (t > 5 && t < 5.5);
        const confused = es(t, 3.1, 3.5) * (1 - es(t, 4.4, 4.9));
        o.p.set({
          x, y: o.y, s: o.s, flip: away > 0.5 && !(t > 2 && t < 2.4) ? !o.flip : o.flip,
          walk: moving ? x * 0.05 : undefined,
          head: confused * Math.sin(T * 0.9 + o.seed) * 6 + es(t, 4.3, 4.8) * 9 * (1 - gone) - es(t, 2.3, 2.6) * 6,
          armF: bump(t, 2.3, 2.9) * 30,
          blink: blinkAt(T, o.seed),
        });
        // veil drops in front of the eyes
        const hx = x + 2 * o.s * (o.flip ? -1 : 1), hy = o.y - 167 * o.s;
        const vDrop = es(t, 3.05 + o.i * 0.04, 3.35 + o.i * 0.04, ease.out) * (1 - gone);
        pose(o.veil, { x: hx + (o.flip ? -8 : 8) * o.s, y: lerp(-120, hy - 3 * o.s, vDrop), s: o.s, r: Math.sin(T * 1.1 + o.seed) * 2.5, o: vDrop > 0 ? 1 : 0 });
        // sound reaches the ears and bounces off
        const on = es(t, 3.4, 3.55) * (1 - es(t, 4.05, 4.3));
        const d = o.flip ? 1 : -1; // direction of travel toward the person
        o.w.forEach((w, j) => {
          const k = ((T * 0.55 + j / 3 + o.i * 0.13) % 1) || (j / 3 + 0.2);
          const inbound = k < 0.55;
          const u = inbound ? k / 0.55 : (k - 0.55) / 0.45;
          const ear = hx - d * 4;
          const px = inbound ? lerp(ear - d * 120, ear - d * 18, u) : lerp(ear - d * 18, ear - d * 70, u);
          pose(w, { x: px, y: hy - 6 - (inbound ? 0 : u * 20), sx: inbound ? -d : d, s: inbound ? 1 : 0.8 - u * 0.3, r: inbound ? 0 : -d * u * 25, o: on * (inbound ? Math.min(1, u * 3) : 1 - u) * 0.95 });
        });
      });
      CARDS.forEach((cd) => {
        const drop = es(t, 2.25 + cd.i * 0.08, 2.65 + cd.i * 0.08, ease.back) * (1 - es(t, 5.0, 5.35));
        pose(cd.el, { x: cd.x, y: lerp(-150, cd.y, drop), r: Math.sin(T * 0.8 + cd.i * 1.7) * 2.2, o: drop > 0 ? 1 : 0 });
        const tie = es(t, 4.05 + cd.i * 0.06, 4.3 + cd.i * 0.06);
        pose(cd.cord, { sx: tie, s: 1, o: tie });
        const stamp = es(t, 4.25 + cd.i * 0.07, 4.45 + cd.i * 0.07, ease.back);
        pose(cd.seal, { x: 0, y: 6, s: lerp(1.8, 1, stamp), o: stamp });
      });

      /* the lamp, and the light that gathers the circle */
      const light = es(t, 1.2, 1.8);
      fade(pool, 0.3 + light * 0.55);
      pose(lampEl, { x: 770, y: 706, s: 1.05 });
      pose(lampFlame, { x: 35, y: -16, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.1 + light * 0.1 });
      fade(lampGlow, 0.55 + light * 0.35 + Math.sin(T * 3.1) * 0.05);

      /* Jesus */
      const give = es(t, 1.05, 1.35) * (1 - es(t, 2.6, 3));
      const turn = es(t, 5.05, 5.35), fan = es(t, 6.05, 6.4);
      jesus.set({
        x: 800, y: 642, s: 1,
        armF: 25 + bump(t, 0.5, 0.95) * 25 + give * 62 + es(t, 2.55, 2.95) * (1 - turn) * 40 * (1 - es(t, 4.6, 5)) + turn * 55 * (1 - fan) + fan * 100 + Math.sin(T * 1.2) * 3,
        armB: 10 + give * 60 + turn * 35 * (1 - fan) + fan * 20,
        head: -3 + bump(t, 0.4, 1) * 4 - give * 8 - fan * 6 + Math.sin(T * 0.6) * 1.5,
        blink: blinkAt(T, 2),
      });

      /* the circle: lean in and ask, receive the spark, look puzzled again */
      SPEC.forEach((m) => {
        const lean = es(t, 0.2 + m.i * 0.02, 0.6 + m.i * 0.02) * (1 - es(t, 1.2, 1.6));
        const look = es(t, 1.3, 1.6) * (1 - es(t, 2.5, 3));
        const puzz = PUZZLED.includes(m) ? es(t, 5.3, 5.6) * (1 - es(t, 6.55, 6.9)) : 0;
        const ask = m.q ? bump(t, 0.35 + m.qk * 0.06, 1.2) : 0;
        m.p.set({
          x: m.x, y: m.y, s: m.s, flip: m.flip,
          lean: m.dir * lean * 5,
          armF: ask * 55 + look * 30 + puzz * (140 + Math.sin(T * 5 + m.seed) * 8) + (m.i % 4 === 0 ? bump(t, 6.2, 6.9) * 40 : 0),
          armB: look * 20,
          head: -look * 10 - lean * 3 + puzz * 8 - fan * 5,
          blink: blinkAt(T, m.seed),
        });
        // spark from the casket settles above each head
        const fly = es(t, 1.4 + m.i * 0.03, 1.8 + m.i * 0.03, ease.out);
        const sx = lerp(800, m.hx, fly), sy = lerp(400, m.hy - 26 * m.s - 12, fly) - Math.sin(fly * PI) * 60;
        pose(m.spark, { x: sx, y: sy + Math.sin(T * 1.6 + m.seed) * 3, s: (0.5 + 0.5 * fly) * m.s * (1 + Math.sin(T * 3 + m.seed) * 0.06), o: seg(t, 1.38, 1.5) * (1 - es(t, 5, 5.4) * 0.55) });
        if (m.q) {
          const q1 = es(t, 0.4 + m.qk * 0.06, 0.62 + m.qk * 0.06, ease.back) * (1 - es(t, 1.05, 1.25));
          const q2 = PUZZLED.includes(m) ? es(t, 5.35, 5.6, ease.back) * (1 - es(t, 6.55, 6.85)) : 0;
          const q = Math.max(q1, q2);
          pose(m.q, { x: m.hx + m.dir * 12 * m.s, y: m.hy - 60 * m.s - 18 + Math.sin(T * 2 + m.seed) * 3, s: q * m.s * 1.05, r: Math.sin(T * 1.5 + m.seed) * 6, o: q > 0.01 ? 1 : 0 });
        }
      });

      /* the sower plate: which parable? then back again */
      const pIn = es(t, 0.45, 0.85, ease.back) * (1 - es(t, 1.0, 1.3)) + es(t, 5.1, 5.5, ease.back);
      pose(plate, { x: 800, y: lerp(-160, lerp(240, 268, es(t, 5, 6)), pIn), s: 1 + fan * 0.08, r: Math.sin(T * 0.9) * 2, o: pIn > 0 ? 1 : 0 });

      /* the casket of the mystery comes down and opens; closes and rises in beat 5 */
      const bIn = es(t, 1.0, 1.35, ease.out) * (1 - es(t, 5.0, 5.3));
      const open = es(t, 1.3, 1.6) * (1 - es(t, 4.9, 5.1));
      pose(box, { x: 800, y: lerp(-150, 428, bIn), r: Math.sin(T * 0.8 + 1) * 1.5 * (1 - open * 0.6), o: bIn > 0 ? 1 : 0 });
      pose(boxLid, { x: -37, y: -38, r: -open * 78 });
      fade(boxGlow, open * 0.9);
      pose(boxRays, { x: 0, y: -40, r: t * 12, s: 0.4 + open * 0.6, o: open * 0.8 });

      /* a whole fan of other parables spreads from Jesus' raised hand */
      FAN.forEach((f) => {
        const k = es(t, 6.05 + Math.abs(f.a) * 0.003, 6.45 + Math.abs(f.a) * 0.003, ease.back);
        const a = (f.a * k * PI) / 180, R = 205;
        const px = 800, py = 480;
        pose(f.el, { x: px + Math.sin(a) * R * k, y: py - Math.cos(a) * R * k + Math.sin(T * 1.1 + f.i) * 2, r: f.a * k + Math.sin(T * 0.9 + f.i) * 1.5, s: 0.3 + 0.62 * k, o: seg(t, 6.03, 6.15) });
      });

      S.cam.z = 1 + es(t, -0.3, 0.8) * 0.06 - es(t, 2, 2.6) * 0.06 + es(t, 5, 5.6) * 0.07;
      S.cam.y = es(t, -0.3, 0.8) * 30 - es(t, 2, 2.6) * 40 + es(t, 5, 5.6) * 30 - es(t, 6, 6.4) * 30;
    };
  },
};
