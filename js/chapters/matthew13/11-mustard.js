// Mt 13,31–32 — the mustard seed, in Mark 4's kitchen garden with its leeks, cabbages and onions. A plate with the
// seed comes down for "another parable"; a man walks into his field with the seed glowing in his palm and sows it in
// the middle of the bed. The line-up of seeds hangs in — bean, olive, wheat, lentil and the mustard seed under the
// magnifying glass: the smallest of all. Then it grows past all the vegetables into a great tree, and the birds of
// the air fly in and make their nests in its branches.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix, flap } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, flowers, sun, cloud, town } from '../../assets/nature.js';
import { sprout, bird, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { mustardTree2, mustardSeed, magnifier, cabbage, leek, onion, nest, discPlate, storyFrame, DIGGER, kf, moving, hangAt, tr, PI } from './lib.js';

const BED = 520, TX = 800, SEED_Y = 540;

/* Mark 4's seed line-up, drawn at true relative size */
function seedIcon(c, kind) {
  const s = sheet();
  if (kind === 'bean') {
    s.p(c.cut([...c.arc(0, 0, 26, 17, PI * 0.1, PI * 1.9, 18), [22, -3], [16, 0], [22, 3]], 0.3, 4), C.clay);
    let sp = '';
    for (let i = 0; i < 9; i++) sp += c.poly(c.circ(c.rr(-18, 14), c.rr(-10, 10), c.rr(1.2, 2.4), 5));
    s.x(sp, shade(C.clay, -0.3), 'opacity=".6"');
  } else if (kind === 'olive') {
    s.p(c.cut(c.ell(0, 0, 10, 20, 16).map(([x, y]) => [x * (1 - Math.abs(y) / 40), y]), 0.3, 3), C.wood3);
    s.x(c.ribbon([[0, -18], [2, -4], [0, 18]], 1.2), shade(C.wood3, -0.3));
  } else if (kind === 'wheat') {
    s.p(c.cut(c.ell(0, 0, 6.5, 12, 14), 0.2, 3), C.wheat2);
    s.x(c.ribbon([[0, -10], [0.6, 10]], 1.1), shade(C.wheat2, -0.3));
  } else if (kind === 'lentil') {
    s.p(c.cut(c.ell(0, 0, 7, 6, 14), 0.2, 3), C.olive);
  } else return mustardSeed(c);
  return s.out();
}
function card(c, w, h, inner) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10), 0.6, 8), C.parchment);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 8), C.cream);
  return s.out() + inner;
}

export default {
  id: 'mt13-mustard',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 31, text: 'Inną przypowieść im przedłożył:' },
    { v: 31, cont: true, text: '«Królestwo niebieskie podobne jest do ziarnka gorczycy, które ktoś wziął i posiał na swej roli.' },
    { v: 32, text: 'Jest ono najmniejsze ze wszystkich nasion,' },
    { v: 32, cont: true, text: 'lecz gdy wyrośnie, jest większe od innych jarzyn i staje się drzewem,' },
    { v: 32, cont: true, text: 'tak że ptaki przylatują z powietrza i gnieżdżą się na jego gałęziach».' },
  ],
  cam: { x: [-20, 20], y: [-80, 60], z: [0.86, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = [C.skyBlue, mix(C.skyBlue, C.cream, 0.55), C.cream];
    const SKY2 = [mix(C.skyBlue, C.skyBlue2, 0.5), mix(C.skyBlue, C.dawn, 0.5), C.dawn];
    sky(S, SKY);
    const eveL = sky(S, SKY2, { name: 'eve' }).layer;
    eveL.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1250, y: 150, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 1020, y: 170, len: 700 });

    const hills = S.layer({ par: 0.12, sh: 2 });
    hills.add(band(c, { y: 400, amps: [22, 8, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    const h2 = hillsWith(c, { y: 440, amps: [14, 6, 2], lens: [800, 280, 100], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + town(c, { x: 1250, y: h2.fn(1250) + 8, n: 6, spread: 220, sc: 0.5 }));
    const mid = S.layer({ par: 0.22, sh: 3 });
    mid.add(sheet().p(c.ridge(c.wave(478, [8, 3], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.hillMid, C.hillNear, 0.5)).out());
    mid.add(olive(c, 330, 482, 1.1) + cypress(c, 420, 484, 150) + olive(c, 1300, 483, 1) + cypress(c, 1400, 484, 170));

    /* the garden: back row of vegetables */
    const garden = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(494, [3, 1.5], [600, 170]), -900, 2500, 1700, 12, 1), C.hillNear);
    gs.p(c.cut([[400, 500], [1200, 498], [1216, 526], [384, 528]], 0.8, 8), mix(C.soil, C.clay, 0.5));
    garden.add(gs.out());
    let veg = '';
    [[440, 'leek'], [476, 'leek'], [520, 'cab'], [590, 'onion'], [630, 'onion'], [680, 'cab'], [740, 'leek'], [870, 'leek'], [920, 'cab'], [990, 'onion'], [1030, 'onion'], [1080, 'cab'], [1140, 'leek'], [1172, 'leek']].forEach(([x, k]) => {
      if (k === 'leek') veg += leek(c, x, 512, c.rr(92, 112));
      else if (k === 'cab') veg += cabbage(c, x, 514, c.rr(28, 33));
      else veg += onion(c, x, 514, 1.2);
    });
    garden.add(veg);

    /* the tree */
    const treeL = S.layer({ par: 0.4, sh: 5 });
    const shadeEl = treeL.add(`<ellipse cx="0" cy="0" rx="430" ry="46" fill="${C.moss2}" opacity="0"/>`);
    const TH = 380;
    const T2 = mustardTree2(c, { h: TH });
    const tree = treeL.add(`<g>${T2.markup}</g>`);
    const branches = Array.from(tree.querySelectorAll('.branch')).map((b) => ({ g: b.querySelector('.grow'), i: +b.dataset.i }));
    const crown = tree.querySelector('.crown .grow');
    const seedling = treeL.add(sprout(c, { h: 22, color: C.leaf }));
    const NEST_OF = [2, 3, 6, 7, 8];
    const nests = NEST_OF.map((b, j) => ({ b, j, el: treeL.add(`<g>${nest(c)}</g>`) }));
    const birds = [
      { from: [-150, 120], col: C.bird }, { from: [1750, 80], col: C.dustyBlue }, { from: [-120, 330], col: C.clay },
      { from: [1720, 300], col: C.bird }, { from: [800, -250], col: C.plumRobe },
    ].map((b, j) => ({ ...b, j, el: treeL.add(bird(c, { color: b.col })) }));

    /* bed front, the seed in the soil, the path */
    const front = S.layer({ par: 0.4, sh: 4 });
    const fs = sheet();
    const top = [];
    for (let x = 384; x <= 1216; x += 10) top.push([x, BED + Math.sin(x * 0.09) * 1.5]);
    fs.p(c.cut([...top, [1216, 572], [384, 572]], 0.6, 8), C.soil);
    let crumbs = '';
    for (let i = 0; i < 60; i++) crumbs += c.poly(c.circ(c.rr(392, 1208), c.rr(BED + 8, 566), c.rr(1, 2.6), 5));
    fs.x(crumbs, shade(C.soil, 0.22), 'opacity=".5"');
    fs.p(c.cut(c.rect(376, 566, 848, 16), 0.5, 8), C.wood);
    fs.p(c.cut(c.rect(372, 514, 14, 70), 0.4, 6) + c.cut(c.rect(1214, 514, 14, 70), 0.4, 6), C.wood2);
    fs.p(c.ridge(c.wave(578, [3, 1.5], [600, 170]), -900, 2500, 1700, 12, 1), C.sage2);
    front.add(fs.out());
    front.add(grass(c, { x0: -600, x1: 2200, y: 580, n: 50, h: 12, color: C.moss }) + flowers(c, { x0: -300, x1: 1900, y: 700, n: 26, h: 16 }));
    let fveg = '';
    [[430, 'cab'], [505, 'onion'], [560, 'cab'], [655, 'onion'], [705, 'cab'], [900, 'cab'], [955, 'onion'], [1045, 'cab'], [1100, 'onion'], [1170, 'cab']].forEach(([x, k]) => {
      fveg += k === 'cab' ? cabbage(c, x, BED + 5, c.rr(20, 24)) : onion(c, x, BED + 5, 0.95);
    });
    front.add(fveg);
    const seedDot = front.add(`<g><circle r="18" fill="url(#warm-glow)"/><g transform="scale(1.6)">${mustardSeed(c)}</g></g>`);
    const seedRing = front.add(`<circle r="14" fill="none" stroke="${C.cream}" stroke-width="2" opacity="0"/>`);

    /* the man with the seed */
    const folk = S.layer({ par: 0.6, sh: 6 });
    const palmSeed = `<g data-k="palmSeed" opacity="0"><circle cx="0" cy="2" r="18" fill="url(#warm-glow)"/><circle cx="0" cy="2" r="2.6" fill="${C.sunDeep}"/></g>`;
    const man = S.puppet(folk.add(person(c, { ...DIGGER, holdF: palmSeed })));
    const palmSeedEl = S.$('palmSeed');
    const tossed = folk.add(`<g><circle r="22" fill="url(#warm-glow)"/><circle r="3.4" fill="${C.sunDeep}"/></g>`);
    const manSit = S.puppet(folk.add(person(c, { ...DIGGER, pose: 'sit' })));

    /* plate, seed cards, magnifier, the label */
    const cards = S.layer({ par: 0.55, sh: 7 });
    const plate = hanging(cards, `<g transform="scale(1.3)">${discPlate(c, `<g transform="scale(4)">${mustardSeed(c)}</g><circle r="22" fill="url(#warm-glow)" opacity=".7"/>`, { r: 54 })}</g>`, { x: 0, y: 0, len: 900 });
    const KINDS = [['bean', tr('fasola', 'bean')], ['olive', tr('oliwka', 'olive')], ['wheat', tr('pszenica', 'wheat')], ['lentil', tr('soczewica', 'lentil')], ['mustard', tr('gorczyca', 'mustard')]];
    const lineup = KINDS.map(([k, name], i) => {
      const inner = `<g transform="translate(0 -10)">${seedIcon(c, k)}</g><g transform="translate(0 38) scale(.5)">${paperLabel(name, { size: 30, fill: C.parchment })}</g>`;
      return { i, x: S.portrait ? 545 + i * 112 : 540 + i * 130, y: 300,   // phone: the row of cards fits the screen
         el: hanging(cards, card(c, 100, 104, inner), { x: 0, y: 0, len: 800 }) };
    });
    const smallest = hanging(cards, paperLabel(tr('najmniejsze', 'the smallest'), { size: 26, fill: C.halo }), { x: 0, y: 0, len: 800 });
    const mag = hanging(cards, magnifier(c, `<g transform="scale(6.5)">${mustardSeed(c)}</g><circle cx="-5" cy="-5" r="4.5" fill="${C.cream}" opacity=".55"/>`), { x: 0, y: 0, len: 800 });
    storyFrame(S);

    const SITX = S.portrait ? 530 : 470;   // phone: he sits down inside the screen
    // phone: he walks in earlier, so he is not half in the frame while the parable is announced
    const MK = [S.portrait ? [0.1, 120] : [0.3, -120], [S.portrait ? 0.6 : 1.0, 640], [1.35, 700], [2.0, 700], [2.2, SITX]];
    const LX = lineup[4].x;

    return (t, time) => {
      eveL.fade(es(t, 3, 5));
      swing(sunEl, 1250 - es(t, 0, 5) * 60, 150, time, 1.2, 0.6);
      swing(cl1, 1020 + Math.sin(time * 0.1) * 20, 170, time, 1.4, 0.6, 1);

      /* v31a — another parable: the seed plate */
      const pl = es(t, 0.0, 0.3, ease.back) * (1 - es(t, 1.0, 1.2));
      hangAt(plate, 800, lerp(-400, 300, pl), time, 1.5, 0.8);

      /* v31b — the man takes the seed and sows it */
      const mx = kf(t, MK);
      const toss = seg(t, 1.35, 1.6);
      const sat = es(t, 2.2, 2.3);
      man.set({
        x: mx, y: 700, s: 1.05, flip: t > 2.0, o: 1 - sat, walk: moving(t, MK) ? mx * 0.05 : undefined,
        armF: 30 + es(t, 0.5, 0.8) * 30 + bump(t, 1.3, 1.6) * 50, armB: 10, head: -es(t, 0.6, 0.9) * 8 + bump(t, 1.3, 1.6) * 8, blink: blinkAt(time),
      });
      fade(palmSeedEl, es(t, 0.55, 0.75) * (1 - seg(t, 1.35, 1.38)));
      manSit.set({ x: SITX, y: 700, s: 1.0, flip: false, o: sat, armF: 30, armB: 40, head: -8 - es(t, 3.1, 3.5) * 10, blink: blinkAt(time, 3) });
      pose(tossed, { x: lerp(740, TX, toss), y: lerp(560, SEED_Y, toss) - Math.sin(toss * PI) * 120, o: toss > 0 && toss < 1 ? 1 : 0 });
      const planted = t >= 1.6 ? 1 : 0;
      const sprouted = es(t, 3.02, 3.2);
      pose(seedDot, { x: TX, y: SEED_Y, s: 1 + bump(t, 1.6, 1.85) * 1.2 + bump(t, 2.1, 2.9) * 0.6, o: planted * (1 - es(t, 3.3, 3.6)) });
      const rk = seg(t, 1.6, 1.95);
      pose(seedRing, { x: TX, y: SEED_Y, s: 0.4 + rk * 2.2, o: rk > 0 && rk < 1 ? (1 - rk) * 0.9 : 0 });

      /* v32a — the smallest of all seeds */
      lineup.forEach((l) => {
        const inn = es(t, 2.05 + l.i * 0.06, 2.25 + l.i * 0.06, ease.back);
        const out = es(t, 2.92 + (4 - l.i) * 0.02, 3.08 + (4 - l.i) * 0.02);
        pose(l.el, { x: l.x, y: l.y - (1 - inn) * 520 - out * 560, r: Math.sin(time * 0.8 + l.i * 1.7) * 2, o: inn > 0.001 && out < 0.999 ? 1 : 0 });
      });
      const mIn = es(t, 2.4, 2.58, ease.back) * (1 - es(t, 2.92, 3.05));
      pose(mag, { x: LX + 8, y: 292 - (1 - mIn) * 600, s: 0.72, r: Math.sin(time * 0.9) * 2, o: mIn > 0.01 ? 1 : 0 });
      const sIn = es(t, 2.5, 2.66, ease.back) * (1 - es(t, 2.92, 3.06));
      pose(smallest, { x: LX, y: 400 - (1 - sIn) * 700, r: Math.sin(time + 2) * 3, o: sIn > 0.01 ? 1 : 0 });

      /* v32b — it grows past the vegetables into a tree */
      const g1 = es(t, 3.1, 3.55);
      const g2 = es(t, 3.5, 3.85);
      const ts = 0.06 + g1 * 0.42 + g2 * 0.52;
      const tsx = ts * lerp(1, 1.6, g2);
      pose(tree, { x: TX, y: BED + 3, sx: tsx / ts, s: ts, o: g1 > 0.001 ? 1 : 0 });
      pose(seedling, { x: TX, y: BED + 2, s: sprouted * (1 - g1) * 1.3, o: sprouted > 0.01 && g1 < 1 ? 1 : 0 });
      branches.forEach((b) => {
        const k = b.i < 4 ? es(t, 3.2 + b.i * 0.08, 3.45 + b.i * 0.08, ease.back) : es(t, 3.5 + (b.i - 4) * 0.05, 3.72 + (b.i - 4) * 0.05, ease.back);
        pose(b.g, { s: Math.max(0.001, k) });
      });
      pose(crown, { s: Math.max(0.001, es(t, 3.7, 3.9, ease.back)) * 0.8, sx: 1 / lerp(1, 1.6, g2) * 1.3, sy: 0.85 });
      const shadeK = es(t, 3.6, 4.0);
      pose(shadeEl, { x: TX, y: 580, s: 0.3 + shadeK * 0.7, o: shadeK * 0.3 });

      /* v32c — the birds of the air come and nest */
      nests.forEach((n) => {
        const e = T2.ends[n.b];
        const k = es(t, 4.05 + n.j * 0.04, 4.2 + n.j * 0.04, ease.back);
        pose(n.el, { x: TX + e.x * tsx, y: BED + 3 + e.y * ts, s: k * ts, o: k > 0.01 ? 1 : 0 });
      });
      birds.forEach((b) => {
        const e = T2.ends[NEST_OF[b.j]];
        const nx = TX + e.x * tsx, ny = BED + 3 + e.y * ts - 10;
        const k = es(t, 4.1 + b.j * 0.07, 4.5 + b.j * 0.07, ease.out);
        const x = lerp(b.from[0], nx, k), y = lerp(b.from[1], ny, k) - Math.sin(k * PI) * 60;
        const settled = k >= 1;
        pose(b.el, { x, y: y + (settled ? 0 : Math.sin(time * 3 + b.j) * 4), s: 0.9, sx: nx < b.from[0] ? -1 : 1, o: k > 0.001 ? 1 : 0 });
        flap(b.el, time + t * 20, 30 * (settled ? Math.max(0, Math.sin(time * 0.9 + b.j * 1.7) - 0.7) * 3 : 1), 11);
      });

      S.cam.z = kf(t, [[0, 1.02], [0.9, 1.08], [1.6, 1.1], [2.0, 1.04], [3.0, 1.04], [3.9, 0.88]]);
      S.cam.y = kf(t, [[0, 0], [0.9, 30], [1.6, 40], [2.0, 0], [3.0, 0], [3.9, -70]]);
    };
  },
};
