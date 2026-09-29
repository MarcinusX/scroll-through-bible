// Mt 27,6 — back in the Temple court. The silver still lies scattered at the foot of the stairs. The chief
// priests bend and gather it: the coins hop up into the high priest's hand. He carries the little stack to the
// trumpet-mouthed offering chests of the treasury and holds it over the mouth… and draws his hand back. A paper
// strip comes down: "the price of blood". The others shake their heads: it may not go in.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { templeCourt, trumpetChest, kf, moving, hand, headAt, leader, priest, silverFlat, silverStack, strip, MT, tr, PI } from './lib.js';

const GY = 676;
const CH = [1050, 1180];      // the chests
const CY = 640;

export default {
  id: 'mt27-price',
  beats: [
    { v: 6, text: 'Arcykapłani zaś wzięli srebrniki i orzekli:' },
    { v: 6, cont: true, text: '«Nie wolno kłaść ich do skarbca świątyni, bo są zapłatą za krew».' },
  ],
  cam: { x: [0, 120], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S, { skyCols: MT.temple });
    const chL = S.layer({ par: 0.47, sh: 5 });
    CH.forEach((x) => chL.add(`<g transform="translate(${x} ${CY}) scale(1.1)">${trumpetChest(c)}</g>`));
    const mouth = [CH[0], CY - 130];

    const P = S.layer({ par: 0.5, sh: 5 });
    const lords = [1, 2, 3, 4].map((i) => ({ i, p: S.puppet(P.add(leader(c, i + 1))), x: [560, 660, 1250, 1330][i - 1], y: GY - [6, 0, 8, 2][i - 1], seed: c.rr(0, 9) }));
    const stack = `<g transform="translate(0 -2) scale(.8)">${silverStack(c, 6, 10)}</g>`;
    const hp = S.puppet(P.add(priest(c, 0)));
    const hpS = S.puppet(P.add(priest(c, 0, { holdF: stack })));
    const fx = S.layer({ par: 0.52, sh: 4 });
    const coins = Array.from({ length: 18 }, (_, i) => ({ i, el: fx.add(`<g>${silverFlat(c, 7)}</g>`), x: c.rr(660, 960), y: c.rr(GY - 26, GY + 26), d: c.rr(0, 0.25) }));
    const tagL = S.layer({ par: 0.3, sh: 5 });
    const tag = hanging(tagL, `<g>${strip(c, tr('zapłata za krew', 'the price of blood'), { size: 24, fill: mix(C.cream, C.curtain, 0.2) })}</g>`, { x: 0, y: -1500, len: 900 });
    set.front({ lampsOn: false });

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v6a — gathered up */
      const hK = [[-0.3, [780, GY]], [0.1, [800, GY]], [0.9, [800, GY]], [1.35, [960, GY]]];
      const [hx, hy] = kf(t, hK);
      const stoop = es(t, 0.05, 0.25) * (1 - es(t, 0.55, 0.75));
      const hold = es(t, 0.55, 0.6);
      const over = es(t, 1.3, 1.5) * (1 - es(t, 1.62, 1.8));
      const back = es(t, 1.62, 1.8);
      const arm = 30 + stoop * 20 + hold * 30 + over * 60 - back * 20;
      const common = { x: hx, y: hy, s: 1, flip: false, walk: moving(t, hK) ? hx * 0.05 : undefined, armF: arm, armB: 10 + stoop * 30 + back * 60, lean: stoop * 18 - back * 4, head: stoop * 16 - over * 8 + back * 6, blink: blinkAt(T, 2) };
      hp.set({ ...common, o: 1 - hold });
      hpS.set({ ...common, o: hold });
      const [ax, ay] = hand(hx, hy, 1, false, arm, stoop * 18);
      coins.forEach((k) => {
        const u = seg(t, 0.15 + k.d, 0.5 + k.d);
        pose(k.el, { x: lerp(k.x, ax, ease.io(u)), y: lerp(k.y, ay, u) - Math.sin(u * PI) * 80, sy: u > 0 ? 1 : 0.55, r: u * 360, o: u < 1 ? 1 : 0 });
      });
      lords.forEach((m) => {
        const bend = m.i <= 2 ? es(t, 0.05 + m.i * 0.05, 0.25 + m.i * 0.05) * (1 - es(t, 0.55, 0.75)) : 0;
        const shake = es(t, 1.55, 1.7) * Math.sin(T * 6 + m.seed) * 8 * (1 - es(t, 1.95, 2));
        const toward = m.i <= 2 ? es(t, 0.9, 1.3) * 90 : 0;
        m.p.set({ x: m.x + toward, y: m.y, s: 0.98, flip: m.x > 1000, walk: m.i <= 2 && t > 0.9 && t < 1.3 ? m.x * 0.05 + t * 20 : undefined, armF: 20 + bend * 40 + es(t, 1.55, 1.75) * 40, armB: 10 + bend * 20 + es(t, 1.55, 1.75) * 30, lean: bend * 16, head: bend * 14 + shake, blink: blinkAt(T, m.seed) });
      });
      /* v6b — not into the treasury: the price of blood */
      const tk = es(t, 1.55, 1.9, ease.out);
      swing(tag, mouth[0] - 60, 350 - (1 - tk) * 900, T, 1.1, 0.8, 1);
      S.cam.x = 40 + es(t, 0.8, 1.4) * 70;
      S.cam.y = 20 + es(t, 0.8, 1.4) * 20;
      S.cam.z = 1.04 + es(t, 0.8, 1.4) * 0.06;
    };
  },
};
