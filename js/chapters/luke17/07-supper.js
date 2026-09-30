// Łk 17,8–9 — the same farm as night comes on; the front wall of the house lifts away into the flies: the room, the
// lamp in its niche, the low table, the clay oven. "Prepare my supper, clothe yourself properly, and serve me while I
// eat and drink": the master sits down at the table; the servant, still dusty from the field, ties up his robe with a
// red sash, takes the bread from the oven, brings the dish and the cup and pours. "Afterward you shall eat and drink":
// he waits by the wall with the jug while the master eats and drinks; only then does he sit down by the oven with his
// own small bowl. "Does he thank that servant because he did the things that were commanded?": the list of the
// evening's orders comes down with every line ticked off — and the master, stretching, goes off to bed without a
// word; over the servant hangs an empty question.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { farmSet, FARM, SERVANT, SERVANT_GIRT, MASTER, supperTable, loaf, cup, bowl, jug, orders, tick, strung, flyIn, question, clayLamp, warm, behindOf, hand, headAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const FL = FARM.FLOOR;
const MX = 870, TB = 960, OV = FARM.OVEN;

export default {
  id: 'lk17-supper',
  parable: true,
  beats: [
    { v: 8, text: 'Czy nie powie mu raczej: "Przygotuj mi wieczerzę, przepasz się i usługuj mi, aż zjem i napiję się,' },
    { v: 8, cont: true, text: 'a potem ty będziesz jadł i pił?"' },
    { v: 9 },
  ],
  cam: { x: [60, 180], y: [0, 60], z: [1, 1.2] },
  build(S) {
    const F = farmSet(S);
    const c = S.c;
    /* the lamp in the niche, the table */
    const lampL = F.inL;
    const glowNiche = F.H.add(`<g><circle r="60" fill="url(#warm-glow)"/></g>`);
    lampL.add(`<g transform="translate(900 580)">${clayLamp(c)}</g>`);
    lampL.add(`<g transform="translate(${TB} ${FL})">${supperTable(c, 170)}</g>`);
    const master = S.puppet(lampL.add(person(c, { ...MASTER, pose: 'sit' })));
    const masterUp = S.puppet(lampL.add(person(c, MASTER)));
    const dish = lampL.add(`<g opacity="0">${bowl(c, { w: 40 })}</g>`);
    const bread = lampL.add(`<g opacity="0">${loaf(c, 16)}</g>`);
    const cupEl = lampL.add(`<g opacity="0">${cup(c)}</g>`);
    const serv = S.puppet(F.act.add(person(c, SERVANT)));
    const girt = S.puppet(F.act.add(person(c, { ...SERVANT_GIRT, holdF: `<g transform="rotate(20) translate(0 30) scale(.6)">${jug(c)}</g>` })));
    const sat = S.puppet(F.act.add(person(c, { ...SERVANT_GIRT, pose: 'sit', holdF: `<g transform="rotate(70) translate(0 6)">${bowl(c, { w: 26 })}</g>` })));
    const sash = F.fx.add(`<g opacity="0">${sheet().p(c.ribbon([[-26, 0], [28, -2]], 8), C.terracotta).p(c.ribbon([[20, 0], [30, 20]], 5), C.terracotta).out()}</g>`);
    const list = F.fx.add(`<g transform="translate(0 -1500)">${strung(orders(c, 120, 90), 50, 2400, [-40, 40])}</g>`);
    const ticks = [0, 1, 2, 3].map((i) => F.fx.add(`<g opacity="0">${tick(c, 8)}</g>`));
    const q = F.fx.add(`<g opacity="0">${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      F.update(T, { eveK: 0.85, nightK: es(t, 0.3, 1.2) * 0.8, open: es(t, 0.02, 0.3, ease.in) });
      pose(glowNiche, { x: 920, y: 570, o: 0.9 });
      pose(F.glow, { x: 0, y: 0, o: 0.8 });

      /* v8a — he girds himself, brings the bread, the dish and the cup */
      const inside = es(t, 0.08, 0.25);
      const gird = es(t, 0.25, 0.32);
      const tie = bump(t, 0.18, 0.34);
      const toOven = es(t, 0.36, 0.5), toTable = es(t, 0.56, 0.72);
      const pour = bump(t, 0.76, 0.96);
      const waitK = es(t, 1.05, 1.2);
      const sitDown = t > 1.62;
      const sx0 = lerp(760, 1040, inside);
      const sx = t < 0.36 ? sx0 : t < 0.56 ? lerp(1040, OV - 60, toOven) : t < 1.05 ? lerp(OV - 60, TB + 70, toTable) : lerp(TB + 70, 1100, waitK);
      const moving = (inside > 0 && inside < 1) || (toOven > 0 && toOven < 1) || (toTable > 0 && toTable < 1) || (waitK > 0 && waitK < 1);
      const fl = t < 0.36 ? false : t < 0.56 ? false : t < 1.05 ? true : waitK > 0.5 ? false : true;
      const pose1 = { x: sx, y: FL + 4, s: 0.96, flip: fl, walk: moving ? sx * 0.06 : undefined, armF: 20 + tie * 40 + bump(t, 0.44, 0.56) * 60 + pour * 40, armB: 8 + tie * 40, head: 4 + pour * 10, lean: pour * 10, blink: blinkAt(T, 5) };
      serv.set({ ...pose1, o: gird < 0.5 ? 1 : 0 });
      girt.set({ ...pose1, o: gird >= 0.5 && !sitDown ? 1 : 0 });
      sat.set({ x: OV - 70, y: FL + 4, s: 0.96, flip: true, armF: 60 + bump(t, 1.7, 1.85) * 40 + bump(t, 1.88, 1.98) * 40, armB: 10, head: 6, o: sitDown ? 1 : 0, blink: blinkAt(T, 5) });
      pose(sash, { x: sx + 2, y: FL + 4 - 92 * 0.96, s: 0.96, o: tie > 0.2 && gird < 0.5 ? tie : 0 });
      // what he carries to the table
      const [shx, shy] = hand(sx, FL + 4, 0.96, fl, 20 + bump(t, 0.44, 0.56) * 60);
      const breadK = es(t, 0.5, 0.56);
      pose(bread, { x: t < 0.72 ? shx : TB + 20, y: t < 0.72 ? shy - 4 : FL - 46, o: breadK > 0.5 ? 1 : 0 });
      pose(dish, { x: TB - 20, y: FL - 42, o: seg(t, 0.72, 0.74) });
      pose(cupEl, { x: TB + 50, y: FL - 40, o: seg(t, 0.8, 0.82) });

      /* the master sits and eats and drinks; afterwards he stretches and goes off to bed */
      const eat = bump(t, 0.82, 0.95) + bump(t, 1.1, 1.25) + bump(t, 1.3, 1.45);
      const done = es(t, 2.2, 2.35);
      const leave = es(t, 2.35, 2.85);
      master.set({ x: MX, y: FL + 4, s: 0.98, armF: 40 + eat * 70, armB: 10 + bump(t, 1.5, 1.62) * 40, head: -eat * 6 + bump(t, 1.5, 1.62) * -10, o: done < 0.5 ? 1 : 0, blink: blinkAt(T, 2) });
      masterUp.set({ x: lerp(MX, 700, leave), y: FL + 4, s: 0.98, flip: true, walk: leave > 0 && leave < 1 ? leave * 30 : undefined, armF: 20 + bump(t, 2.2, 2.4) * 120, armB: 10 + bump(t, 2.2, 2.4) * 140, head: -6, o: done >= 0.5 ? 1 - es(t, 2.8, 2.9) : 0, blink: blinkAt(T, 2) });

      /* v9 — the list of orders, all ticked; no thanks: a question over the servant */
      const lk = es(t, 2.05, 2.3, ease.back);
      flyIn(list, lk, 1030, 360, T, 1, 0.8);
      ticks.forEach((el, i) => {
        const k = es(t, 2.25 + i * 0.07, 2.35 + i * 0.07, ease.back);
        pose(el, { x: 1030 - 44, y: lerp(-1500, 360, lk) - 26 + i * 16, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
      });
      const [hx, hy] = headAt(OV - 70, FL + 4, 0.96, true, 62);
      const qk = es(t, 2.55, 2.72, ease.back);
      pose(q, { x: hx + 6, y: hy - 150, s: qk * 1.2, o: qk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 120], [1, 130], [2, 140], [3, 140]]);
      S.cam.y = kf(t, [[0, 30], [1, 50], [3, 40]]);
      S.cam.z = kf(t, [[0, 1.06], [0.4, 1.14], [2, 1.16], [3, 1.12]]);
    };
  },
};
