// Łk 13,18–19 — the mustard seed, told as Luke tells it: a man and his own garden. A painted flat of a kitchen garden
// behind a house, beds of leeks, cabbages and onions, a low wattle fence. "What is the kingdom of God like? To what
// shall I compare it?" — the golden crown of the Kingdom comes down with a question beside it. "It is like a grain of
// mustard seed": the question turns into an equals sign and a plate with the tiny seed hangs beside the crown; the man
// comes out of his house with the seed glowing in his palm and plants it in the middle of his garden. "It grew and
// became a great tree": it shoots up past everything in the beds and spreads its branches, and the birds of the air
// fly in from every side and build their nests in them.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix, flap } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, flowers, sun, cloud, house } from '../../assets/nature.js';
import { sprout, bird } from '../../assets/things.js';
import {
  SOWER13, kingdomDisc, question, equals, discPlate, mustardSeed, mustardTree2, nest, cabbage, leek, onion, onString, kf, moving,
  es, ease, bump, seg, PI,
} from './lib.js';

const BED = 600, TX = 800;

export default {
  id: 'lk13-mustard',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 18 },
    { v: 19, text: 'Podobne jest do ziarnka gorczycy, które ktoś wziął i posadził w swoim ogrodzie.' },
    { v: 19, cont: true, text: 'Wyrosło i stało się wielkim drzewem, tak że ptaki powietrzne gnieździły się na jego gałęziach».' },
  ],
  cam: { x: [-20, 20], y: [-60, 40], z: [0.9, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfe0dc', '#eeead2', '#f7ecd4']);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1260, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 1000, y: 120, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [18, 7, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 470, amps: [12, 5, 2], lens: [800, 280, 100], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + olive(c, 1350, h2.fn(1350) + 8, 0.8) + cypress(c, 1440, h2.fn(1440) + 6, 120));
    // the house and the garden wall behind the beds
    const back = S.layer({ par: 0.34, sh: 3 });
    back.add(sheet().p(c.ridge(c.wave(520, [3, 1.5], [600, 170]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out());
    back.add(house(c, 250, 560, 230, 170, { stairs: true }));
    let wattle = '';
    for (let x = 500; x < 1500; x += 16) wattle += c.ribbon([[x, 560], [x + c.rr(-2, 2), 516]], 3);
    back.add(sheet().p(wattle, C.wood3).p(c.ribbon([[496, 528], [1500, 526]], 4) + c.ribbon([[496, 546], [1500, 544]], 4), C.wood2).out());
    // the beds
    const garden = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.cut([[-900, 566], [2500, 566], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.hillNear, C.sand, 0.25));
    gs.p(c.cut([[400, BED - 20], [1200, BED - 22], [1216, BED + 10], [384, BED + 12]], 0.8, 8), mix(C.soil, C.clay, 0.5));
    garden.add(gs.out());
    let veg = '';
    [[430, 'leek'], [470, 'cab'], [540, 'onion'], [590, 'leek'], [640, 'cab'], [700, 'onion'], [900, 'onion'], [950, 'cab'], [1010, 'leek'], [1060, 'onion'], [1110, 'cab'], [1170, 'leek']].forEach(([x, k]) => {
      if (k === 'leek') veg += leek(c, x, BED - 6, c.rr(80, 96));
      else if (k === 'cab') veg += cabbage(c, x, BED - 4, c.rr(24, 28));
      else veg += onion(c, x, BED - 4, 1.1);
    });
    garden.add(veg);
    const treeL = S.layer({ par: 0.4, sh: 5 });
    const T2 = mustardTree2(c, { h: 400 });
    const tree = treeL.add(`<g>${T2.markup}</g>`);
    const seedling = treeL.add(`<g>${sprout(c, { h: 22, color: C.leaf })}</g>`);
    const seedDot = treeL.add(`<g opacity="0"><circle r="20" fill="url(#warm-glow)"/><g transform="scale(1.6)">${mustardSeed(c)}</g></g>`);
    const NEST_OF = [2, 3, 6, 7, 8];
    const nests = NEST_OF.map((b, j) => ({ b, j, el: treeL.add(`<g opacity="0">${nest(c)}</g>`) }));
    const birds = [[-150, 120, C.bird], [1750, 80, C.dustyBlue], [-120, 330, C.clay], [1720, 300, C.bird], [800, -250, C.plumRobe]]
      .map(([x, y, col], j) => ({ from: [x, y], j, el: treeL.add(bird(c, { color: col })) }));
    const front = S.layer({ par: 0.6, sh: 4 });
    front.add(sheet().p(c.ridge(c.wave(700, [4, 2], [600, 170]), -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.3)).out() + grass(c, { x0: -600, x1: 2200, y: 700, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: -300, x1: 1900, y: 712, n: 26, h: 18 }));
    const act = S.layer({ par: 0.4, sh: 5 });
    const palmSeed = `<g data-k="palmSeed13" opacity="0"><circle cx="0" cy="2" r="18" fill="url(#warm-glow)"/><circle cx="0" cy="2" r="2.8" fill="${C.sunDeep}"/></g>`;
    const man = S.puppet(act.add(person(c, { ...SOWER13, holdF: palmSeed })));
    const palmEl = S.$('palmSeed13');
    const manK = S.puppet(act.add(person(c, { ...SOWER13, pose: 'kneel' })));

    /* the Kingdom and what it is like */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const kd = fx.add(`<g>${onString(`<g transform="translate(0 50)">${kingdomDisc(c, 44)}</g>`)}</g>`);
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);
    const eq = fx.add(`<g opacity="0">${sheet().p(c.cut(c.circ(0, 0, 24, 20), 0.4, 4), C.cream).out()}${equals(c, 26, C.terracotta)}</g>`);
    const plate = fx.add(`<g>${onString(`<g transform="translate(0 54)">${discPlate(c, `<circle r="22" fill="url(#warm-glow)" opacity=".7"/><g transform="scale(4)">${mustardSeed(c)}</g>`, { r: 48 })}</g>`)}</g>`);

    const MK = [[1.0, 330], [1.35, 700], [1.5, 740]];

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 150, T, 1, 0.6);
      swing(cl, 1000 + Math.sin(T * 0.1) * 20, 120, T, 1.2, 0.6, 1);

      /* v18 — what is the kingdom like? */
      const kk = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      const ky = lerp(-800, 150, kk);
      const sw = T ? Math.sin(T * 0.8) * 2 : 0;
      pose(kd, { x: 640, y: ky + sw });
      const qk = es(t, 0.35, 0.5, ease.back) * (1 - es(t, 1.05, 1.15));
      pose(q, { x: 760, y: ky + 100 + (T ? Math.sin(T * 2) * 3 : 0), s: qk * 1.3, o: qk > 0.02 ? 1 : 0 });
      const ek = es(t, 1.1, 1.25, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(eq, { x: 760, y: ky + 104, s: ek, o: ek > 0.02 ? 1 : 0 });
      const pk = es(t, 1.08, 1.3, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      pose(plate, { x: 880, y: lerp(-800, 150, pk) - sw });

      /* v19a — the man takes the seed and plants it in his garden */
      const mx = kf(t, MK);
      const kneel = es(t, 1.5, 1.56) * (1 - es(t, 1.95, 2.02));
      const inM = t > 0.98 ? 1 : 0;
      man.set({ x: mx, y: 640, s: 1.02, flip: false, walk: moving(t, MK) ? mx * 0.05 : undefined, armF: 30 + es(t, 1.2, 1.35) * 30 + es(t, 2.0, 2.2) * 20, armB: 10 + es(t, 2.2, 2.4) * 120, head: -6, o: inM * (1 - kneel), blink: blinkAt(T) });
      manK.set({ x: mx, y: 640, s: 1.02, flip: false, armF: 70, armB: 20, head: 16, o: kneel });
      pose(palmEl, { o: es(t, 1.05, 1.2) * (1 - seg(t, 1.6, 1.62)) });
      const planted = es(t, 1.62, 1.66);
      pose(seedDot, { x: TX, y: BED - 8, s: 1 + bump(t, 1.62, 1.95) * 0.8, o: planted * (1 - es(t, 2.1, 2.25)) });

      /* v19b — it grows into a great tree; the birds nest in its branches */
      const sp = es(t, 2.05, 2.15, ease.back) * (1 - es(t, 2.2, 2.3));
      pose(seedling, { x: TX, y: BED - 4, s: sp * 1.4, o: sp > 0.01 ? 1 : 0 });
      const g1 = es(t, 2.18, 2.5, ease.out);
      const ts = 0.08 + g1 * 0.92;
      pose(tree, { x: TX, y: BED - 2, s: ts, sx: 1 + g1 * 0.25, o: g1 > 0.001 ? 1 : 0 });
      nests.forEach((n) => {
        const e = T2.ends[n.b];
        const k = es(t, 2.52 + n.j * 0.03, 2.64 + n.j * 0.03, ease.back);
        pose(n.el, { x: TX + e.x * ts * (1 + g1 * 0.25), y: BED - 2 + e.y * ts + 6, s: k * 0.8, o: k > 0.01 ? 1 : 0 });
      });
      birds.forEach((b) => {
        const e = T2.ends[NEST_OF[b.j]];
        const nx = TX + e.x * ts * (1 + g1 * 0.25), ny = BED - 2 + e.y * ts - 6;
        const k = es(t, 2.5 + b.j * 0.04, 2.72 + b.j * 0.04, ease.out);
        const x = lerp(b.from[0], nx, k), y = lerp(b.from[1], ny, k) - Math.sin(k * PI) * 60;
        pose(b.el, { x, y, s: 0.9, sx: nx < b.from[0] ? -1 : 1, o: k > 0.001 ? 1 : 0 });
        flap(b.el, T + t * 20, 30 * (k >= 1 ? 0 : 1), 11);
      });

      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.06], [2.0, 1.06], [2.6, 0.94]]);
      S.cam.y = kf(t, [[0, -20], [1.0, 20], [2.0, 20], [2.6, -50]]);
      S.cam.x = 0;
    };
  },
};
