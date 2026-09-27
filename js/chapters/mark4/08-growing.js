// Mk 4,26–29 — the seed that grows by itself. A farmer sows; days and nights swing past on strings
// while he sleeps and wakes; in the cut-away earth the seed splits, roots and rises; blade, ear,
// full grain; then the sickle and the sheaves.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, clamp } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, rock, sun, moon, cloud, stars } from '../../assets/nature.js';
import { bed, oilLamp, sprout, sickle, sheaf, rain, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';

const PI = Math.PI;
const GY = 545;          // field surface (top of the cut-away earth)
const HX = 860;          // the one seed we follow
const PER = 64;          // furrow spacing
const FIELD = [575, 1215];
const FARMER = { robe: C.ochreRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin3, belt: C.leather };

const GREEN = { stem: C.wheatGreen, leaf: shade(C.wheatGreen, -0.12), ear: mix(C.wheatGreen, C.sage, 0.35), awn: shade(C.wheatGreen, -0.2) };
const GOLD = { stem: C.wheat2, leaf: C.ochre, ear: C.wheat, awn: C.wheat2 };

/* ---------- local drawings ---------- */

// one stalk in a given colouring (geometry depends only on h / lean / b, so two colourings overlay)
function stalkParts(c, h, lean, col, w = 3.2, b = 1) {
  const pts = c.qbez([0, 0], [lean * 0.2, -h * 0.5], [lean, -h], 8);
  const s = sheet();
  s.p(c.ribbon(pts, (t) => w - t * w * 0.45), col.stem);
  s.p(c.ribbon(c.qbez([lean * 0.03, -h * 0.22], [h * 0.14, -h * 0.36], [h * 0.23, -h * 0.26], 7), (t) => Math.sin(t * PI) * w * 1.9 + 0.6)
    + c.ribbon(c.qbez([lean * 0.1, -h * 0.42], [-h * 0.12, -h * 0.56], [-h * 0.2, -h * 0.47], 7), (t) => Math.sin(t * PI) * w * 1.6 + 0.6), col.leaf);
  const e = sheet();
  let g = '';
  for (let i = 0; i < 7; i++) {
    const y = -i * 6.5 * b;
    g += c.cut(c.ell(-3.6 * b, y, 3.4 * b, 6 * b, 8, -0.4), 0.15, 3) + c.cut(c.ell(3.6 * b, y - 3 * b, 3.4 * b, 6 * b, 8, 0.4), 0.15, 3);
  }
  g += c.cut(c.ell(0, -46 * b, 2.6 * b, 6 * b, 8), 0.15, 3);
  e.p(g, col.ear);
  let awns = '';
  for (let i = 0; i < 6; i++) awns += c.ribbon([[0, -i * 6.5 * b - 4 * b], [(i % 2 ? 1 : -1) * 14 * b, -i * 6.5 * b - 26 * b]], 0.8 * Math.max(1, b * 0.8));
  e.x(awns, col.awn);
  return { stem: s.out(), ear: e.out() };
}
function stalk(c, { h, lean, w, b }) {
  const g = stalkParts(c, h, lean, GREEN, w, b), y = stalkParts(c, h, lean, GOLD, w, b);
  return `<g class="st"><g class="stem"><g>${g.stem}</g><g class="gold" opacity="0">${y.stem}</g></g><g class="ear" transform="translate(${lean} ${-h})"><g>${g.ear}</g><g class="gold" opacity="0">${y.ear}</g></g></g>`;
}

// farmhouse facade with a big opening (the room is cut in its own layer)
function farmhouse(c, x, y, w, h, op) {
  const s = sheet();
  s.p(c.cut([[x + w, y - h + 2], [x + w + 34, y - h + 14], [x + w + 34, y + 4], [x + w, y + 4]], 0.5, 7), C.plaster2);
  s.p(c.cut(c.rect(x, y - h, w, h + 4), 0.6, 8), C.plaster);
  s.x(c.poly(c.rect(op.x, op.y, op.w, op.h)), shade(C.plaster2, -0.3));
  // lintel & sill
  s.p(c.cut(c.rect(op.x - 8, op.y - 10, op.w + 16, 10), 0.4, 6), C.wood);
  s.p(c.cut([[x - 8, y - h - 12], [x + w + 40, y - h - 4], [x + w + 40, y - h + 6], [x - 8, y - h + 2]], 0.4, 8), C.roof);
  let beams = '';
  for (let i = 0; i < 7; i++) beams += c.cut(c.rect(x + 10 + i * (w / 6.6), y - h + 2, 8, 8), 0.2, 4);
  s.p(beams, C.wood2);
  // door
  const dx = x + w - 44;
  s.p(c.cut([[dx, y + 2], [dx, y - 60], ...c.arc(dx + 14, y - 60, 14, 12, PI, 2 * PI, 6), [dx + 28, y + 2]], 0.3, 5), C.wood2);
  s.x(c.poly(c.circ(dx + 22, y - 30, 2, 6)), C.ochre);
  // outside stairs to the roof
  let st = '';
  for (let i = 0; i < 7; i++) st += c.cut(c.rect(x + w + 4 + i * 4.5, y - (i + 1) * (h / 8), 26 - i * 3, 5), 0.2, 5);
  s.p(st, shade(C.plaster2, -0.12));
  // a drying sheaf and a jar on the roof, a big jar by the wall
  s.p(c.cut([[x + 30, y - h - 10], [x + 38, y - h - 44], [x + 46, y - h - 10]], 0.5, 5), C.wheat2);
  s.p(c.cut([[x + 66, y - h - 10], [x + 60, y - h - 26], [x + 66, y - h - 34], [x + 80, y - h - 34], [x + 86, y - h - 26], [x + 80, y - h - 10]], 0.4, 5), C.pot);
  s.p(c.cut([[x + w + 44, y + 3], [x + w + 36, y - 22], [x + w + 42, y - 40], [x + w + 62, y - 40], [x + w + 68, y - 22], [x + w + 60, y + 3]], 0.4, 5), C.pot);
  s.x(c.ribbon([[x + w + 40, y - 30], [x + w + 64, y - 30]], 3), shade(C.pot, -0.25));
  return s.out();
}

function basket(c) {
  const s = sheet();
  s.x(c.ribbon(c.arc(0, 10, 15, 16, PI * 1.05, PI * 1.95, 10), 2.6), C.wood2);
  s.p(c.cut([[-19, 8], [19, 8], [15, 34], [-15, 34]], 0.4, 5), C.basket);
  s.x(c.ribbon([[-17, 17], [17, 17]], 2.4) + c.ribbon([[-16, 26], [16, 26]], 2.4), shade(C.basket, -0.25));
  let d = '';
  for (let i = 0; i < 9; i++) d += c.poly(c.ell(-13 + i * 3.2, 6 + Math.sin(i) * 1.2, 2.4, 1.6, 6, i));
  s.x(d, C.wheat2);
  return s.out();
}
function hoe(c) {
  return sheet()
    .p(c.ribbon([[0, -58], [2, 104]], 4.5), C.wood)
    .p(c.cut([[0, 98], [26, 104], [30, 114], [2, 110]], 0.3, 4), C.stone2).out();
}

// a big seed that can split in two
function heroSeed(c) {
  const kernel = sheet().p(c.cut(c.ell(0, 0, 8, 12, 14), 0.3, 3), C.cream).out();
  const half = (a0, a1, col) => sheet().p(c.cut([[0, 13], ...c.arc(0, 0, 9.5, 14, a0, a1, 10)], 0.3, 3), col).x(c.ribbon(c.arc(0, 0, 6.5, 10, a0 + 0.4, a1 - 0.4, 6), 1), shade(col, -0.2)).out();
  return { kernel, left: half(PI * 0.5, PI * 1.5, C.wheat2), right: half(-PI * 0.5, PI * 0.5, shade(C.wheat2, 0.08)) };
}
function rootPath(c, pts, w0, col = C.linen2) {
  return sheet().p(c.ribbon(pts, (t) => w0 - t * (w0 - 0.7)), col).out();
}

export default {
  id: 'growing',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 26 },
    { v: 27, text: 'Czy śpi, czy czuwa, we dnie i w nocy' },
    { v: 27, cont: true, text: 'nasienie kiełkuje i rośnie, on sam nie wie jak.' },
    { v: 28, text: 'Ziemia sama z siebie wydaje plon,' },
    { v: 28, cont: true, text: 'najpierw źdźbło, potem kłos, a potem pełne ziarnko w kłosie.' },
    { v: 29 },
  ],
  cam: { x: [-40, 115], y: [-100, 75], z: [0.95, 2.05] },
  build(S) {
    const c = S.c;
    const DAY = [C.skyBlue, mix(C.skyBlue, C.cream, 0.6), C.cream];
    const DUSK = [C.duskViolet, C.dusk, C.peach];
    const NIGHT = [C.night2, C.night, C.indigo];
    const GOLDEN = [mix(C.skyBlue, C.peach, 0.45), C.dawn, C.parchment];
    const sk = sky(S, DAY);

    /* ---------- hills & farmyard ---------- */
    const hills = S.layer({ par: 0.12, sh: 2 });
    hills.add(band(c, { y: 415, amps: [20, 8, 3], lens: [1000, 380, 140], color: C.hillFar }).markup);
    const h2 = hillsWith(c, { y: 452, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup);

    const farm = S.layer({ par: 0.3, sh: 3 });
    const yard = c.wave(506, [4, 2], [700, 200]);
    farm.add(sheet().p(c.ridge(yard, -900, 2500, 1700, 12, 1), C.hillNear).out());
    farm.add(olive(c, 1290, 510, 0.9) + cypress(c, 1370, 512, 150) + cypress(c, 330, 510, 170) + olive(c, 230, 508, 1));
    farm.add(bush(c, 690, 510, 50, C.sage, C.moss));
    const OP = { x: 426, y: 398, w: 170, h: 110 };
    farm.add(farmhouse(c, 400, 508, 250, 170, OP));
    farm.add(grass(c, { x0: -300, x1: 2000, y: 506, fn: yard, n: 40, h: 11, color: C.moss }));

    // the far strip of the ploughed field (seen from above) with its own rows of wheat
    const back = S.layer({ par: 0.4, sh: 3 });
    const fs = sheet();
    fs.p(c.ridge(c.wave(516, [2, 1], [500, 150]), -900, 2500, 1700, 14, 0.8), mix(C.soil, C.clay, 0.55));
    let rows = '';
    for (let i = 0; i < 4; i++) { const y = 522 + i * 6; rows += c.ribbon([[-900, y], [2500, y + 1]], 1.6 + i * 0.5); }
    fs.x(rows, shade(C.soil, 0.05), 'opacity=".55"');
    back.add(fs.out());
    const backStalks = [];
    [[521, 64, 0.72], [531, 84, 0.86]].forEach(([y, h, w]) => {
      for (let x = -260; x < 1900; x += c.rr(15, 24)) {
        if (x > 385 && x < 700) continue;
        const lean = c.rr(-7, 7), hh = h * c.rr(0.85, 1.12);
        const el = back.add(stalk(c, { h: hh, lean, w: 2.4 * w, b: 0.72 * w }));
        backStalks.push({ el, stem: el.querySelector('.stem'), ear: el.querySelector('.ear'), gold: el.querySelectorAll('.gold'), x, y, h: hh, lean, d: c.rr(0, 1), ph: c.rr(0, 6) });
      }
    });

    /* ---------- the cut-away earth ---------- */
    const soil = S.layer({ par: 0.55, sh: 5 });
    const furrow = (x) => {
      const inField = clamp(1 - Math.max(FIELD[0] - x, x - FIELD[1], 0) / 50);
      return GY + 6 * inField * Math.cos((2 * PI * (x - HX)) / PER);
    };
    const so = sheet();
    const top = [];
    for (let x = -900; x <= 2500; x += 8) top.push([x, furrow(x) + c.rr(-0.8, 0.8)]);
    so.p(c.poly([...top, [2500, 1700], [-900, 1700]]), C.soil);
    so.p(c.ridge(c.wave(GY + 118, [10, 5], [520, 170]), -900, 2500, 1700, 12, 1.2), shade(C.soil, -0.18));
    so.p(c.ridge(c.wave(GY + 225, [12, 5], [600, 190]), -900, 2500, 1700, 12, 1.2), C.soilDark);
    so.p(c.ridge(c.wave(GY + 330, [10, 5], [640, 200]), -900, 2500, 1700, 12, 1.2), C.soilRich);
    // a darker topsoil lip, crumbs, stones
    let lip = '';
    top.forEach(([x, y], i) => { if (i % 2) lip += c.poly([[x - 5, y + 2], [x + 5, y + 2], [x + 4, y + 7 + c.rr(0, 4)], [x - 4, y + 6]]); });
    so.x(lip, shade(C.soil, 0.12), 'opacity=".6"');
    let crumbs = '';
    for (let i = 0; i < 160; i++) {
      const x = c.rr(-400, 2000), y = c.rr(GY + 14, GY + 420);
      if (Math.abs(x - HX) < 90 && y < GY + 190) continue;
      crumbs += c.poly(c.circ(x, y, c.rr(1.2, 3.2), 5));
    }
    so.x(crumbs, shade(C.soil, 0.22), 'opacity=".45"');
    [[640, 690, 34, 18], [1020, 640, 26, 14], [1140, 760, 48, 24], [470, 610, 30, 16], [760, 770, 38, 18], [1300, 650, 30, 15], [330, 740, 44, 20], [960, 820, 30, 14]].forEach(([x, y, w, h], i) => {
      so.p(c.cut(c.blob(x, y, w / 2, h / 2, 9, 0.2), 0.8, 5), i % 2 ? C.rock2 : C.rock3);
    });
    so.x(grass(c, { x0: -600, x1: FIELD[0] - 20, y: GY, n: 18, h: 13, color: C.moss }) + grass(c, { x0: FIELD[1] + 20, x1: 2200, y: GY, n: 18, h: 13, color: C.moss }), C.moss);
    soil.add(so.out());
    // a worm that wriggles by
    const worm = soil.add(`<g>${sheet().p(c.ribbon(c.qbez([0, 0], [14, -8], [30, 0], 10), (t) => 5 - Math.abs(t - 0.5) * 3), C.blush).out()}</g>`);

    /* ---------- seeds, roots, shoots ---------- */
    const seeds = [];
    for (let k = -4; k <= 5; k++) {
      const x = HX + k * PER, hero = k === 0;
      seeds.push({ x, y: furrow(x) + (hero ? 36 : 26), hero, i: seeds.length });
    }
    // release time of each seed: the farmer walks 530 → 1130 during 0.04–0.86
    const fx0 = 530, fx1 = 1130;
    seeds.forEach((sd) => { sd.r = 0.04 + 0.82 * clamp((sd.x - 120 - fx0) / (fx1 - fx0)); });

    const HS = heroSeed(c);
    const hero = seeds.find((s) => s.hero);
    // roots of the hero (under the seed): main root + side roots
    const heroRoot = soil.add(`<g>${rootPath(c, c.cbez([0, 8], [-10, 42], [14, 80], [-4, 124], 18), 5.4)}</g>`);
    const sideSpec = [[0.2, -1, 48], [0.32, 1, 56], [0.46, -1, 62], [0.58, 1, 58], [0.7, -1, 46], [0.82, 1, 40], [0.9, -1, 30]];
    const mainPts = c.cbez([0, 8], [-10, 42], [14, 80], [-4, 124], 18);
    const heroSide = sideSpec.map(([f, dir, L]) => {
      const p = mainPts[Math.round(f * (mainPts.length - 1))];
      const el = soil.add(`<g>${rootPath(c, c.qbez([0, 0], [dir * L * 0.5, L * 0.1], [dir * L, L * 0.55], 10), 3)}</g>`);
      return { el, x: p[0], y: p[1] };
    });
    const heroShoot = soil.add(`<g>${sheet().p(c.ribbon(c.qbez([0, 0], [-7, -16], [0, -(hero.y - furrow(HX)) - 2], 10), (t) => 4.6 - t * 1.2), C.leaf).out()}</g>`);
    const heroKernel = soil.add(`<g>${HS.kernel}</g>`);
    const heroL = soil.add(`<g>${HS.left}</g>`);
    const heroR = soil.add(`<g>${HS.right}</g>`);
    const heroSprout = soil.add(sprout(c, { h: 30, color: C.leaf }));

    // the other seeds: small roots and sprouts
    seeds.filter((s) => !s.hero).forEach((sd) => {
      sd.root = soil.add(`<g>${rootPath(c, c.qbez([0, 3], [c.rr(-10, 10), 30], [c.rr(-8, 8), c.rr(55, 75)], 10), 3)}</g>`);
      sd.sprout = soil.add(sprout(c, { h: 18, color: C.leaf }));
    });
    const seedEls = seeds.map((sd) => {
      if (sd.hero) return null;
      return soil.add(`<g>${sheet().p(c.cut(c.ell(0, 0, 4.6, 7, 10), 0.2, 3), C.wheat2).x(c.ribbon([[0, -4], [0, 4]], 0.8), shade(C.wheat2, -0.25)).out()}</g>`);
    });

    // the field: three stalks rise over every seed, a tall one over ours
    const front = [];
    seeds.forEach((sd) => {
      const n = sd.hero ? 0 : 3;
      for (let j = 0; j < n; j++) {
        const x = sd.x + (j - 1) * 13 + c.rr(-3, 3), h = c.rr(118, 150), lean = c.rr(-9, 9);
        const el = soil.add(stalk(c, { h, lean, w: 3.2, b: 1 }));
        front.push({ el, stem: el.querySelector('.stem'), ear: el.querySelector('.ear'), gold: el.querySelectorAll('.gold'), x, y: furrow(sd.x) + 3, h, lean, d: sd.i / 10 + c.rr(0, 0.12), ph: c.rr(0, 6) });
      }
    });
    const HH = 205;
    const spot = soil.add(`<ellipse cx="0" cy="0" rx="120" ry="150" fill="url(#warm-glow)" opacity="0"/>`);
    const heroEl = soil.add(stalk(c, { h: HH, lean: 6, w: 5.4, b: 1.75 }));
    const heroSt = { el: heroEl, stem: heroEl.querySelector('.stem'), ear: heroEl.querySelector('.ear'), gold: heroEl.querySelectorAll('.gold'), x: HX, y: furrow(HX) + 3, h: HH, lean: 6 };

    // sheaves that stand up after the reaping
    const sheaves = [[690, 0.9], [905, 1], [1110, 0.95]].map(([x, s]) => ({ x, s, el: soil.add(`<g>${sheaf(c, 115)}</g>`) }));

    /* ---------- the farmer ---------- */
    const folk = S.layer({ par: 0.58, sh: 6 });
    const flying = [];
    seeds.forEach((sd) => {
      flying.push({ sd, dx: 0, dy: 0, dt: 0, el: folk.add(`<g>${sheet().p(c.cut(c.ell(0, 0, sd.hero ? 6 : 4.6, sd.hero ? 9 : 7, 10), 0.2, 3), C.wheat2).out()}</g>`) });
      // a little spray of extra grains with every throw — they land on the ridges and sink in
      for (let j = 0; j < 4; j++) {
        flying.push({ sd, decoy: true, dx: c.rr(-34, 40), dt: c.rr(-0.012, 0.02), arc: c.rr(50, 110), el: folk.add(`<g>${sheet().p(c.cut(c.ell(0, 0, 3.4, 5, 8), 0.2, 3), C.wheat).out()}</g>`) });
      }
    });
    const tools = `<g data-k="hoe" transform="translate(0 0)">${hoe(c)}</g><g data-k="sickle" transform="scale(.9) translate(47 20) scale(1 -1)">${sickle(c)}</g>`;
    const farmer = S.puppet(folk.add(person(c, { ...FARMER, holdF: `<g data-k="basket" transform="rotate(-30)">${basket(c)}</g>` + tools })));
    const basketEl = S.$('basket'), hoeEl = S.$('hoe'), sickleEl = S.$('sickle');
    const stool = folk.add(`<g>${sheet().p(c.cut(c.blob(0, -14, 40, 16, 10, 0.15), 0.8, 5), C.rock2).out()}</g>`);
    const sitter = S.puppet(folk.add(person(c, { ...FARMER, pose: 'sit' })));
    const qMark = folk.add(paperLabel('?', { size: 44, w: 40 }));
    // tags for the three stages, lowered on strings
    const tags = [[tr('źdźbło', 'blade'), HX - 60, 478], [tr('kłos', 'ear'), HX + 72, 372], [tr('pełne ziarno', 'full grain'), HX - 92, 318]].map(([txt, x, y]) => ({ x, y, el: hanging(folk, paperLabel(txt, { size: 21 }), { x, y, len: 500 }) }));

    /* ---------- night veil (over land, under the lit room and the sky ornaments) ---------- */
    const veilL = S.layer({ par: 0, sky: true });
    const veil = veilL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity="0"/>`);

    /* ---------- the room inside the house ---------- */
    const room = S.layer({ par: 0.3, sh: 2 });
    const clipId = S.id('room');
    S.defs(`<clipPath id="${clipId}"><rect x="${OP.x}" y="${OP.y}" width="${OP.w}" height="${OP.h}"/></clipPath>`);
    const spill = room.add(`<ellipse cx="${OP.x + OP.w / 2}" cy="${OP.y + OP.h / 2}" rx="170" ry="110" fill="url(#warm-glow)" opacity="0"/>`);
    const wallCol = shade(C.plaster2, -0.28);
    const roomBox = room.add(`<g clip-path="url(#${clipId})"><rect data-k="wall" x="${OP.x}" y="${OP.y}" width="${OP.w}" height="${OP.h}" fill="${wallCol}"/>`
      + `<path d="${c.cut(c.rect(OP.x - 4, OP.y + OP.h - 10, OP.w + 8, 14), 0.3, 6)}" fill="${shade(C.wood2, -0.1)}"/>`
      + `<path d="${c.cut(c.rect(OP.x + 8, OP.y + 44, 44, 5), 0.2, 5)}" fill="${C.wood}"/>`
      + `<g transform="translate(${OP.x + 28} ${OP.y + 44}) scale(.52)"><g data-k="lamp">${oilLamp(c)}</g></g>`
      + `<g transform="translate(${OP.x + 92} ${OP.y + OP.h - 4})">${bed(c, 128)}</g>`
      + `<g data-k="sleeperSlot"></g>`
      + `<path data-k="blanket" d="${c.cut([[OP.x + 66, OP.y + 44], [OP.x + 110, OP.y + 36], [OP.x + 150, OP.y + 38], [OP.x + 162, OP.y + 50], [OP.x + 160, OP.y + 68], [OP.x + 62, OP.y + 70]], 0.6, 6)}" fill="${C.dustyBlue}"/>`
      + `<rect data-k="dark" x="${OP.x}" y="${OP.y}" width="${OP.w}" height="${OP.h}" fill="${C.night2}" opacity="0"/></g>`);
    const slot = S.$('sleeperSlot');
    slot.innerHTML = person(c, { ...FARMER, eyes: 'closed' });
    const sleeper = S.puppet(slot.firstElementChild);
    const blanket = S.$('blanket'), roomWall = S.$('wall'), roomDark = S.$('dark'), lampEl = S.$('lamp');
    const lampGlow = lampEl.querySelector('.glow'), lampFlame = lampEl.querySelector('.flame');
    const zs = [0, 1, 2].map(() => room.add(paperLabel('z', { size: 24, w: 22 })));

    /* ---------- sky ornaments on strings: sun, moon, stars, clouds, a rain cloud ---------- */
    const cel = S.layer({ par: 0.05, sh: 5 });
    const starEl = cel.add(`<g opacity="0">${stars(c, { x0: -300, x1: 1900, y0: -300, y1: 400, n: 110 })}</g>`);
    const sunEl = hanging(cel, sun(c, 50), { x: 800, y: 250, len: 1200 });
    const moonEl = hanging(cel, moon(c, 40), { x: -200, y: 0, len: 1200 });
    const cl1 = hanging(cel, cloud(c, 200), { x: 520, y: 170, len: 700 });
    const cl2 = hanging(cel, cloud(c, 140), { x: 1120, y: 230, len: 700 });
    const rainEl = cel.add(`<g opacity="0">${rain(c, { x0: -130, x1: 130, y0: 0, y1: 250, n: 44, slant: -14, color: C.skyBlue2 })}</g>`);
    const rainCl = hanging(cel, cloud(c, 300, mix(C.skyBlue2, C.storm, 0.25), C.storm), { x: 900, y: -200, len: 800 });

    // pendulum path of the sky ornaments: pivot high above the stage
    const PV = { x: 800, y: -900, L: 1150 };
    const swingAt = (el, a) => pose(el, { x: PV.x + PV.L * Math.sin(a), y: PV.y + PV.L * Math.cos(a), r: (-a * 180) / PI });

    return (t, time) => {
      const zHero = es(t, 3.85, 4.15) * (1 - es(t, 4.9, 5.25));
      /* --- the clock of days and nights --- */
      const P = 0.25 + 3 * seg(t, 1.03, 1.97) + 0.08 * seg(t, 2, 3) + 0.08 * seg(t, 3, 6);
      const p = P % 1;
      const night = clamp(-Math.sin(2 * PI * p) * 1.6 + 0.3);
      const dusk = Math.max(0, 1 - Math.abs(Math.sin(2 * PI * p)) * 2.6) * seg(t, 1, 1.1) * (1 - seg(t, 1.95, 2.05));
      const golden = es(t, 3.9, 5.2);
      const base = [0, 1, 2].map((i) => mix(mix(DAY[i], NIGHT[i], night), DUSK[i], dusk * 0.75));
      sk.set(...base.map((col, i) => mix(col, GOLDEN[i], golden)));
      attr(veil, 'opacity', night * 0.52);
      fade(starEl, night);

      const sunA = p < 0.5 ? -0.8 * Math.cos(PI * (p / 0.5)) : 0.85;
      const moonA = p >= 0.5 ? -0.8 * Math.cos(PI * ((p - 0.5) / 0.5)) : -0.85;
      swingAt(sunEl, sunA + Math.sin(time * 0.7) * 0.004);
      swingAt(moonEl, moonA + Math.sin(time * 0.7 + 1) * 0.004);
      const cloudO = 1 - night * 0.8;
      pose(cl1, { x: 520 + seg(t, 0, 6) * 160 + Math.sin(time * 0.12) * 20, y: 170, r: Math.sin(time * 0.6) * 1.5, o: cloudO });
      pose(cl2, { x: 1120 - seg(t, 0, 6) * 120 + Math.sin(time * 0.1 + 2) * 20, y: 230, r: Math.sin(time * 0.7 + 1) * 1.5, o: cloudO });
      // "ziemia sama z siebie" — a rain cloud is lowered, waters the field, is lifted away
      const rc = es(t, 3.0, 3.25) * (1 - es(t, 3.6, 3.85));
      pose(rainCl, { x: 900 + Math.sin(time * 0.5) * 6, y: -200 + rc * 380, r: Math.sin(time * 0.6) * 1.2 });
      pose(rainEl, { x: 900, y: 190 + ((time * 160) % 60) * (S.reduced ? 0 : 1), o: bump(t, 3.15, 3.7) * 0.85 });

      /* --- sowing --- */
      const fxS = lerp(fx0, fx1, seg(t, 0.04, 0.86));
      let throwArm = 0;
      flying.forEach(({ sd, el, decoy, dx, dt, arc }) => {
        const r0 = sd.r + (dt || 0);
        const k = seg(t, r0, r0 + 0.1);
        if (!decoy) throwArm = Math.max(throwArm, bump(t, sd.r - 0.07, sd.r + 0.03));
        const hx = lerp(fx0, fx1, seg(sd.r, 0.04, 0.86)) + 34, hy = GY - 168;
        const tx = sd.x + dx, ty = decoy ? furrow(sd.x + dx) + 4 : sd.y;
        const x = lerp(hx, tx, k), y = lerp(hy, ty, k) - Math.sin(k * PI) * (arc || 70);
        pose(el, { x, y, r: k * 400, o: k > 0 && k < 1 ? 1 : decoy && k >= 1 ? 1 - seg(t, r0 + 0.1, r0 + 0.2) : 0 });
      });
      seeds.forEach((sd, i) => {
        const landed = t >= sd.r + 0.1 ? 1 : 0;
        const split = es(t, 2.05, 2.3);
        if (sd.hero) {
          const sw = split * 24, fadeAway = 1 - es(t, 3.3, 3.8) * 0.6;
          pose(heroL, { x: HX - split * 3, y: sd.y + 13 + split * 2, r: -sw, o: landed * fadeAway, oy: 13 });
          pose(heroR, { x: HX + split * 3, y: sd.y + 13 + split * 2, r: sw, o: landed * fadeAway, oy: 13 });
          pose(heroKernel, { x: HX, y: sd.y, s: 1 - split * 0.25, o: landed * fadeAway });
        } else {
          pose(seedEls[i], { x: sd.x, y: sd.y, r: (i * 37) % 60 - 30, o: landed * (1 - es(t, 3.2, 3.7) * 0.7) });
          const g = es(t, 2.25 + i * 0.03, 2.65 + i * 0.03);
          pose(sd.root, { x: sd.x, y: sd.y, sy: Math.max(0.01, g * (1 + es(t, 3, 3.8) * 0.4)), o: g > 0 ? 1 : 0 });
          const spr = es(t, 2.45 + i * 0.03, 2.75 + i * 0.03, ease.back) * (1 - es(t, 3.15, 3.45));
          pose(sd.sprout, { x: sd.x, y: furrow(sd.x) + 3, s: spr, o: spr > 0.01 ? 1 : 0 });
        }
      });
      // hero growth underground
      const root = es(t, 2.12, 2.62);
      pose(heroRoot, { x: HX, y: hero.y, sy: Math.max(0.01, root * (1 + es(t, 3.0, 3.9) * 0.18)), o: root > 0 ? 1 : 0 });
      heroSide.forEach((r, i) => {
        const g = es(t, 2.3 + i * 0.05, 2.62 + i * 0.05) * (1 + es(t, 3.0, 3.9) * 0.3);
        pose(r.el, { x: HX + r.x, y: hero.y + r.y * (root * (1 + es(t, 3.0, 3.9) * 0.18)), s: g, o: g > 0 ? 1 : 0 });
      });
      const shoot = es(t, 2.25, 2.5);
      pose(heroShoot, { x: HX, y: hero.y - 6, sy: Math.max(0.01, shoot), o: shoot > 0 ? 1 : 0 });
      const hs = es(t, 2.45, 2.7, ease.back) * (1 - es(t, 3.25, 3.5));
      pose(heroSprout, { x: HX, y: furrow(HX) + 2, s: hs * 1.3, o: hs > 0.01 ? 1 : 0, r: Math.sin(time * 1.3) * 3 });
      pose(worm, { x: 1040 + seg(t, 1, 5) * 150, y: 700 + Math.sin(t * 7) * 6, sx: 1 + Math.sin(time * 5) * 0.12, o: seg(t, 1, 1.2) });

      /* --- the field grows: blade, ear, full grain --- */
      const reap = seg(t, 5.12, 5.88);
      const rx = lerp(520, 1220, reap);
      const cutAt = (x) => clamp((rx + 40 - x) / 40);
      const sway = (x, ph) => Math.sin(time * 1.3 + x * 0.012 + ph) * 2.2 + Math.sin(t * 3 + x * 0.01) * 1.5;
      const setStalk = (st, grow, ear, gold, r, o = 1) => {
        pose(st.el, { x: st.x, y: st.y, r, o: grow > 0.005 ? o : 0 });
        pose(st.stem, { sy: Math.max(0.01, grow) });
        pose(st.ear, { x: st.lean * grow, y: -st.h * grow, s: ear * (1 + gold * 0.12) });
        st.gold.forEach((g) => fade(g, gold));
      };
      const fieldEar = es(t, 4.25, 4.5), fieldGold = es(t, 4.45, 4.75);
      front.forEach((st) => {
        const grow = es(t, 3.1 + st.d * 0.35, 3.55 + st.d * 0.35) * 0.7 + es(t, 4.0, 4.25) * 0.3;
        const fall = ease.io(cutAt(st.x));
        const gone = seg(t, 5.2, 6) > 0 ? clamp((rx - st.x - 140) / 60) : 0;
        setStalk(st, grow, fieldEar, fieldGold, sway(st.x, st.ph) * (1 - fall) - fall * 84, 1 - gone);
      });
      backStalks.forEach((st) => {
        const grow = es(t, 3.15 + st.d * 0.4, 3.6 + st.d * 0.4) * 0.7 + es(t, 4.0, 4.25) * 0.3;
        setStalk(st, grow, fieldEar, fieldGold, Math.sin(t * 3 + st.x * 0.01) * 2);
      });
      const hGrow = es(t, 3.2, 3.7) * 0.5 + es(t, 4.02, 4.25) * 0.5;
      const hEar = es(t, 4.22, 4.42, ease.back), hGold = es(t, 4.42, 4.66);
      const hFall = ease.io(cutAt(HX));
      pose(spot, { x: HX + 4, y: GY - HH * 0.72, s: 0.6 + hGold * 0.5, o: zHero * (0.35 + hEar * 0.35 + hGold * 0.3) });
      setStalk(heroSt, hGrow, hEar, hGold, sway(HX, 0) * 0.6 * (1 - hFall) - hFall * 84, 1 - (t > 5.2 ? clamp((rx - HX - 140) / 60) : 0));
      sheaves.forEach((sh) => {
        const k = ease.back(clamp((rx - sh.x - 90) / 70));
        pose(sh.el, { x: sh.x, y: GY + 4, s: sh.s * k, o: k > 0.01 ? 1 : 0, r: Math.sin(time + sh.x) * 0.8 });
      });

      // stage tags, lowered on strings as each stage arrives
      const tagIn = [es(t, 4.03, 4.2, ease.back), es(t, 4.24, 4.4, ease.back), es(t, 4.44, 4.62, ease.back)];
      const tagOut = es(t, 4.95, 5.15);
      tags.forEach((tg, i) => pose(tg.el, { x: tg.x, y: tg.y - (1 - tagIn[i]) * 420 - tagOut * 460, r: Math.sin(time * 0.9 + i * 2) * 2.5 }));

      /* --- the farmer: sows, sleeps & wakes, wonders, rests, reaps --- */
      const asleep = t >= 1 && t < 2.05 ? clamp((night - 0.35) / 0.3) : 0;
      const day = Math.floor(P);
      const blink = blinkAt(time, 2);
      fade(basketEl, t < 1.05 ? 1 : 0);
      fade(hoeEl, t >= 1.05 && t < 2 ? 1 : 0);
      fade(sickleEl, t >= 5 ? 1 : 0);
      let fx, flip = false, armF = 0, armB = 18, head = 0, lean = 0, walk, o = 1 - asleep;
      if (t < 1.02) {
        fx = fxS; walk = t > 0.04 && t < 0.86 ? fxS * 0.055 : undefined;
        armF = 34; armB = 10 + throwArm * 120; head = -4;
      } else if (t < 2) {
        fx = [1130, 1010, 700, 740][Math.min(3, day)];
        flip = day === 1;
        const chop = Math.sin(time * 3.2 + t * 40);
        armF = 42 + chop * 22; lean = 7 + chop * 3; head = 8;
      } else if (t < 3.05) {
        const walkIn = seg(t, 2, 2.2);
        fx = lerp(700, 745, walkIn);
        walk = walkIn > 0 && walkIn < 1 ? walkIn * 8 : undefined;
        const look = es(t, 2.3, 2.5) * (1 - es(t, 2.6, 2.72));
        const scratch = es(t, 2.6, 2.75);
        lean = look * 12 - scratch * 3; head = look * 16 + scratch * 8;
        armF = 20 + look * 20 + scratch * 146 + scratch * Math.sin(time * 16 + t * 120) * 7;
        armB = 18 - scratch * 6;
      } else {
        const back = seg(t, 3.02, 3.22);
        fx = lerp(745, 700, back); flip = true;
        walk = back > 0 && back < 1 ? back * 9 : undefined;
        o = 1 - seg(t, 3.2, 3.28);
      }
      if (t >= 4.95) {
        const inn = seg(t, 4.95, 5.12);
        fx = t < 5.12 ? lerp(420, 520, inn) : rx; flip = false; o = seg(t, 4.95, 5.05);
        walk = (t > 4.95 && t < 5.88) ? (t < 5.12 ? inn * 6 : rx * 0.05) : undefined;
        const swingK = t < 5.12 ? 0 : Math.abs(Math.sin(rx * 0.045));
        armF = t < 5.12 ? 20 + es(t, 5.0, 5.12) * 70 : 90 - swingK * 75;
        armB = 30; lean = t >= 5.12 && t < 5.88 ? 14 : 0; head = 6;
        if (t >= 5.88) armF = 60 + Math.sin(time * 1.1) * 4;
      }
      farmer.set({ x: fx, y: GY + 2, s: 0.98, flip, armF, armB, head, lean, walk, o, blink });
      // resting on a stone at the edge of the field while the earth works by itself
      const rest = seg(t, 3.2, 3.3) * (1 - seg(t, 4.9, 5.0));
      sitter.set({ x: 705, y: GY + 2, s: 0.95, o: rest, armF: 55 + Math.sin(time * 0.8) * 3, armB: 40, head: -6 + es(t, 3.9, 4.3) * 10, blink });
      pose(stool, { x: 699, y: GY + 4, o: rest });
      const q = es(t, 2.62, 2.82, ease.back) * (1 - es(t, 3.0, 3.12));
      pose(qMark, { x: fx + 58 + Math.sin(time * 2) * 3, y: GY - 236 - q * 14, s: q, r: Math.sin(time * 1.6) * 6 - 6, o: q > 0.01 ? 1 : 0 });

      /* --- the room: lamp at dusk, sleeping at night, z z z --- */
      const lamp = t >= 1 && t < 2.05 ? seg(p, 0.47, 0.52) * (1 - seg(p, 0.66, 0.72)) : 0;
      fade(lampGlow, lamp); fade(lampFlame, lamp);
      attr(spill, 'opacity', lamp * 0.8);
      attr(roomWall, 'fill', mix(wallCol, C.lampGlow, lamp * 0.45));
      attr(roomDark, 'opacity', night * (1 - lamp) * 0.55);
      sleeper.set({ x: OP.x + 150, y: OP.y + 58, s: 0.5, r: -90, o: asleep, head: Math.sin(time * 0.9) * 2 });
      fade(blanket, asleep);
      const snore = t >= 1 && t < 2.05 ? seg(p, 0.7, 0.76) * (1 - seg(p, 0.93, 0.97)) * asleep : 0;
      zs.forEach((z, i) => {
        const k = (time * 0.45 + i / 3) % 1;
        pose(z, { x: OP.x + 70 + k * 60 + Math.sin(k * 7) * 6, y: OP.y + 40 - k * 110, s: 0.6 + k * 0.7, r: -12 + k * 10, o: snore * bump(k, 0, 1) * 1.2 });
      });

      /* --- camera --- */
      const zIn = es(t, 1.95, 2.3) * (1 - es(t, 2.9, 3.2));
      S.cam.z = 1.03 + es(t, 0, 0.9) * 0.03 - es(t, 1, 1.2) * 0.06 * (1 - zIn) + zIn * 0.4 + zHero * 0.98 - es(t, 5, 5.4) * 0.06;
      S.cam.x = lerp(-10 + seg(t, 0, 1) * 30, 0, es(t, 1, 1.2)) + zIn * 40 + zHero * 105;
      S.cam.y = zIn * 70 - zHero * 95;
    };
  },
};
