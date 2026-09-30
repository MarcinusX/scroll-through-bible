// Łk 17,14 — the road by the village; the ten stand far off with their arms still raised. "When He saw them, He said
// to them, 'Go and show yourselves to the priests'": Jesus lifts His hand and points up the road, towards the city on
// its height; a round plate comes down over it — a priest at the Temple receiving a healed man's offering. "As they
// went, they were cleansed": they lower their arms, turn and set off for the village gate one after another — and as
// each one walks, the grey peels off him in flakes that blow away, a spark flashes, and he walks on in clean, bright
// clothes and through the gate. The last of them, nearest to Jesus, is still on the road.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, tenLepers, LEP, lepS, flake, sparkle, priestPlate, strung, flyIn, voiceRings, headAt, halo, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { JX, JY } = LEP;
const DIS = [['john', 600, 730], ['peter', 530, 740], ['andrew', 462, 746], ['james', 394, 752]];
const LAST = [1016, 660];     // where the Samaritan is when the others have gone in

export default {
  id: 'lk17-cleansed',
  beats: [
    { v: 14, text: 'Na ich widok rzekł do nich: «Idźcie, pokażcie się kapłanom!»' },
    { v: 14, cont: true, text: 'A gdy szli, zostali oczyszczeni.' },
  ],
  cam: { x: [0, 100], y: [-40, 40], z: [0.98, 1.1] },
  build(S) {
    const R = roadSet(S, { village: true });
    const c = S.c;
    const hangL = S.layer({ par: 0.1, sh: 5 });
    const plate = hangL.add(`<g transform="translate(0 -1500)">${strung(`<g transform="scale(.62)">${priestPlate(c)}</g>`, 80)}</g>`);
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const TEN = tenLepers(S, act, c, { walk: true });
    const F = roadFour(S, act, c);
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const FL = TEN.map((m) => ({ m, flakes: [0, 1, 2, 3].map((k) => ({ k, el: fx.add(`<g opacity="0">${flake(c, k)}</g>`), dx: c.rr(-10, 10), dy: c.rr(-120, -40), sp: c.rr(200, 500) })), spark: fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`) }));

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.1 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, s: 1 + es(t, 0.3, 0.7) * 0.3, o: 0.6 + es(t, 0.3, 0.7) * 0.4 });

      /* v14a — "Go and show yourselves to the priests" */
      const point = es(t, 0.12, 0.35) * (1 - es(t, 1.6, 1.9) * 0.6);
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + point * 80, armB: 8 + point * 50, head: -point * 8, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 0.08, 0.2) * (1 - es(t, 0.8, 0.95)), T, { dir: 1, spread: 2 });
      F.ds.forEach((d) => {
        const [, x, y] = DIS.find((e) => e[0] === d.k);
        const wonder = es(t, 1.3, 1.6);
        d.p.set({ x, y, s: 0.96, armF: 20 + wonder * (d.k === 'john' ? 50 : 20), armB: 6 + wonder * (d.k === 'peter' ? 90 : 0), head: -4 - wonder * 4, blink: blinkAt(T, d.seed) });
      });
      flyIn(plate, es(t, 0.3, 0.6, ease.back), ROAD9.CITY[0] + 60, 240, T, 1, 1);

      /* v14b — they turn and go; as they go they are made clean */
      const down = es(t, 0.02, 0.12);
      TEN.forEach((m) => {
        const [sx, sy] = LEP.SPOT[m.i];
        const order = m.i === 9 ? 9 : (m.i + 3) % 9;
        const a = m.i === 9 ? 1.5 : 1.02 + order * 0.065;
        const k = es(t, a, a + 0.45, (x) => x);
        const last = m.i === 9;
        const [tx, ty] = last ? LAST : LEP.GATE;
        const x = lerp(sx, tx, k), y = lerp(sy, ty, k);
        const s = lepS(y);
        const w = k > 0 && k < 1;
        const bob = w ? Math.abs(Math.sin(k * 12 + m.i)) * 3 : 0;
        const clean = es(t, a + 0.12, a + 0.2);
        const inGate = last ? 1 : 1 - es(t, a + 0.37, a + 0.45);
        const dir = tx < sx ? -1 : 1;
        const moving = t >= a;
        pose(m.call, { x: sx, y: sy, s: lepS(sy), o: 1 - down });
        pose(m.stand, { x: sx, y: sy, s: lepS(sy), o: !moving ? down : 0 });
        pose(m.walk, { x, y: y - bob, s, sx: dir, o: moving ? (1 - clean) * inGate : 0 });
        pose(m.clean, { x, y: y - bob, s, sx: last && k >= 1 ? -1 : dir, o: moving ? clean * inGate : 0 });
        const f = FL[m.i];
        f.flakes.forEach((fl) => {
          const q = seg(t, a + 0.12 + fl.k * 0.02, a + 0.45 + fl.k * 0.02);
          const bx = x + fl.dx * s;
          pose(fl.el, { x: bx + q * (60 + fl.k * 30), y: y + fl.dy * s - Math.sin(q * PI) * 40 + q * 30, r: q * fl.sp, s: 1 + q * 0.4, o: q > 0 && q < 1 ? 1 - q * q : 0 });
        });
        const sk = bump(t, a + 0.12, a + 0.3);
        pose(f.spark, { x: x + 4, y: y - 150 * s, s: sk * s * 1.2, r: T * 60, o: sk });
      });

      S.cam.x = kf(t, [[0, 60], [1, 70], [2, 60]]);
      S.cam.y = kf(t, [[0, 0], [0.6, -20], [1.2, 0], [2, 10]]);
      S.cam.z = kf(t, [[0, 1.04], [0.6, 1.0], [1.2, 1.04], [2, 1.06]]);
    };
  },
};
