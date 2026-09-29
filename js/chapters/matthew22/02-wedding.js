// Mt 22,2 — the parable flies in as a painted flat: the king's banquet hall. Garlands and lanterns come down
// and light up, servants in the king's livery lay the long table (bread, a roast, wine), and in the middle the
// king, in his crown and purple mantle, turns with open hands to his son, the bridegroom with a wreath.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { hallSet, HALL, kingPuppet, princePuppet, SERVANTS, roastPlatter, wineJar, placeSetting, loaf, grapes, bowl, sparkle, glowHeart, kf, moving } from './lib.js';
import { person } from '../kit.js';

const F = HALL.FRONT;

export default {
  id: 'mt22-wedding',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 2 },
  ],
  cam: { x: [-20, 20], y: [-20, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = hallSet(S);
    const top = set.TOP;

    /* the dishes on the table */
    const dishL = S.layer({ par: 0.45, sh: 3 });
    const places = HALL.SEATS.map((x, i) => ({ x, i, el: dishL.add(`<g>${placeSetting(c, i)}</g>`) }));
    const big = [
      { x: 540, m: roastPlatter(c, 76) }, { x: 1060, m: roastPlatter(c, 70) },
      { x: 700, m: wineJar(c, 50, C.pot) }, { x: 900, m: wineJar(c, 46, C.clay) },
      { x: 450, m: `<g transform="translate(0 -1)">${grapes(c, 5)}</g>` }, { x: 1150, m: bowl(c, { w: 40, food: 'fruit' }) },
      { x: 620, m: loaf(c, 17) }, { x: 980, m: loaf(c, 16) }, { x: 800, m: bowl(c, { w: 44, color: C.sun, food: 'bread' }) },
    ].map((d, i) => ({ ...d, i, el: dishL.add(`<g>${d.m}</g>`) }));

    /* the king, his son, the servants */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const serv = [0, 1].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...SERVANTS[i], holdF: `<g transform="translate(0 -4)">${roastPlatter(c, 46)}</g>` }))) }));
    const king = S.puppet(pl.add(kingPuppet(c)));
    const son = S.puppet(pl.add(princePuppet(c)));
    const heartEl = pl.add(`<g>${glowHeart(c, 16)}</g>`);
    const sparks = [0, 1, 2, 3].map(() => pl.add(`<g>${sparkle(c, 10)}</g>`));

    set.flies();

    return (t, time) => {
      const T = time;
      const drop = es(t, 0.02, 0.35, ease.out);
      set.update(t, T, { drop, lit: es(t, 0.25, 0.55) });

      /* the table is laid, dish by dish, from the ends to the middle */
      places.forEach((p) => {
        const k = es(t, 0.12 + (p.i % 4) * 0.03, 0.3 + (p.i % 4) * 0.03, ease.back);
        pose(p.el, { x: p.x, y: top, s: k, o: k > 0.02 ? 1 : 0 });
      });
      big.forEach((d) => {
        const k = es(t, 0.2 + d.i * 0.035, 0.36 + d.i * 0.035, ease.back);
        pose(d.el, { x: d.x, y: top + 1, s: k, o: k > 0.02 ? 1 : 0 });
      });
      serv.forEach((s) => {
        const keys = s.i ? [[0.0, 1400], [0.3, 1150], [0.7, 1150], [0.95, 1400]] : [[0.0, 200], [0.3, 450], [0.7, 450], [0.95, 200]];
        const x = kf(t, keys);
        s.p.set({ x, y: F + 6, s: 0.96, flip: s.i ? t < 0.5 : t > 0.5, walk: moving(t, keys) ? x * 0.05 : undefined, armF: 70, armB: 20, blink: blinkAt(T, s.i + 3), o: x > 150 && x < 1450 ? 1 : 0 });
      });

      /* the king presents his son, the bridegroom */
      const turn = es(t, 0.3, 0.5);
      king.set({ x: 660, y: F, s: 1.1, blink: blinkAt(T, 1), armF: 20 + turn * 60, armB: 10 + turn * 70, head: -turn * 6 });
      const come = es(t, 0.05, 0.4);
      const sx = lerp(1000, 900, come);
      son.set({ x: sx, y: F + 4, s: 1.04, flip: true, walk: come > 0 && come < 1 ? sx * 0.05 : undefined, blink: blinkAt(T, 2), armF: 20 + turn * 30, head: 4 });
      const hk = es(t, 0.45, 0.6, ease.back);
      pose(heartEl, { x: 782, y: F - 250 - hk * 8 + Math.sin(T * 1.6) * 3, s: hk, o: hk > 0.02 ? 1 : 0 });
      sparks.forEach((el, i) => {
        const k = ((T * 0.35 + i / 4) % 1);
        pose(el, { x: 700 + i * 60 + Math.sin(k * 6) * 8, y: F - 230 - k * 70, s: 0.7, o: es(t, 0.5, 0.65) * Math.sin(k * Math.PI) });
      });

      S.cam.z = 1 + es(t, 0.3, 0.9) * 0.05;
      S.cam.y = -es(t, 0.3, 0.9) * 10;
    };
  },
};
