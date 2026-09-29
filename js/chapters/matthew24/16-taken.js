// Mt 24,40–41 — an ordinary early morning. On the left, two men at work in a field with their hoes; on the right, in a
// courtyard, two women sitting at a hand-mill, turning the stone between them. "Two men will be in the field: one
// taken, one left": a shaft of light comes down on one — he is lifted up into it and is gone; the other stands with
// his hoe, looking round. "Two women grinding at the mill: one taken, one left": the light comes down on one of them,
// and the other is left with her hand on the handle and the flour still on the stone.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, cypress, grass, house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { fieldPatch, quern, beamDown, sparkle, folk, SPRING } from './lib.js';

const GY = 700;
const MEN = [520, 660], WOMEN = [950, 1090], MILL = 1020;

export default {
  id: 'mt24-taken',
  enter: 'fly',
  beats: [
    { v: 40 },
    { v: 41 },
  ],
  cam: { x: [-60, 60], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, SPRING);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: -1500, len: 700 });
    const cl = hanging(hangL, cloud(c, 180), { x: 560, y: -1500, len: 700 });

    const farL = S.layer({ par: 0.1, sh: 2 });
    farL.add(band(c, { y: 470, amps: [16, 6, 3], lens: [1000, 360, 130], color: C.hillFar, x0: -1400, x1: 3000 }).markup);
    const midL = S.layer({ par: 0.2, sh: 3 });
    midL.add(hillsWith(c, { y: 540, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 20, x0: -1400, x1: 3000 }).markup);

    /* the ground: a field on the left, a courtyard on the right */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(620, [5, 2], [700, 170]);
    G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sand2, 0.2)).out());
    G.add(fieldPatch(c, { x0: 300, x1: 760, y0: 650, y1: 740, post: 0 }) + olive(c, 250, 650, 0.9) + grass(c, { x0: -600, x1: 800, y: 620, fn: gfn, n: 20, h: 13, color: C.olive }));
    const yard = sheet();
    yard.p(c.cut([[820, 740], [820, 520], [860, 510], [1300, 510], [1300, 740]], 0.6, 10), mix(C.plaster, C.sand, 0.25));
    yard.p(c.cut([[812, 522], [1308, 522], [1308, 508], [812, 508]], 0.4, 10), C.roof);
    yard.p(c.cut([[1180, 700], [1180, 590], ...[[1180, 590]], [1230, 590], [1230, 700]], 0.4, 6), mix(C.soilDark, C.wood2, 0.3));
    yard.p(c.cut([[820, 690], [1300, 690], [1300, 760], [820, 760]], 0.5, 10), mix(C.sand2, C.stone2, 0.4));
    G.add(yard.out() + cypress(c, 1330, 690, 170));

    /* the men in the field */
    const P = S.layer({ par: 0.45, sh: 5 });
    const HOE = `<g transform="translate(0 -6) rotate(10)">${sheet().p(c.ribbon([[0, -40], [2, 70]], 4), C.wood3).p(c.cut([[-12, 66], [14, 64], [12, 86], [-10, 86]], 0.3, 4), mix(C.stone2, C.rock3, 0.4)).out()}</g>`;
    const men = MEN.map((x, i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...folk(c, true), robe: [C.wheatRobe, C.sageRobe][i], belt: C.rope, holdF: HOE }))) }));
    /* the women at the mill */
    const Q = quern(c);
    const millBase = P.add(`<g transform="translate(${MILL} ${GY + 4})">${Q.base}</g>`);
    const upper = P.add(`<g transform="translate(${MILL} ${GY + 4})">${Q.upper}</g>`);
    const peg = P.add(`<g transform="translate(0 -1500)">${Q.peg}</g>`);
    const women = WOMEN.map((x, i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...folk(c, false), robe: [C.roseRobe, C.skyVeil][i], veil: [C.blushVeil, C.linen2][i], pose: 'sit' }))) }));

    /* the light that comes down, and the one taken up into it */
    const fx = S.layer({ par: 0.45, sh: 1, flat: true });
    const beams = [MEN[1], WOMEN[1]].map((x) => fx.add(`<g transform="translate(0 -1500)">${beamDown(c, 80, 1000)}</g>`));
    const sparks = [0, 1].map(() => [0, 1, 2].map((k) => fx.add(`<g transform="translate(0 -1500)">${sparkle(c, 12 + k * 3)}</g>`)));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1240, 170, T, 1, 0.6);
      swing(cl, 560 + (T ? Math.sin(T * 0.1) * 20 : 0), 150, T, 1.2, 0.7, 1);

      /* v40 — the field */
      const b0 = es(t, 0.15, 0.35) * (1 - es(t, 0.95, 1.2));
      const up0 = es(t, 0.3, 0.7, ease.in);
      const left0 = es(t, 0.6, 0.8);
      men.forEach((m) => {
        const hoe = T ? Math.sin(t * 9 + m.i * 2) * 14 : 0;
        const taken = m.i === 1;
        const work = taken ? 1 - es(t, 0.2, 0.3) : 1 - es(t, 0.3, 0.4);
        const look = taken ? 0 : left0;
        m.p.set({ x: m.x, y: GY - (taken ? up0 * 260 : 0), s: 0.95, flip: taken ? true : look > 0.5, o: taken ? 1 - es(t, 0.55, 0.72) : 1, armF: 40 + hoe * work + (taken ? up0 * 30 : 0), armB: taken ? up0 * 120 : look * 40, head: taken ? -up0 * 14 : -look * 6 + work * 8, lean: work * 6, blink: blinkAt(T, m.seed) });
      });
      pose(beams[0], { x: MEN[1], y: GY + 4, o: b0 });

      /* v41 — the mill */
      const b1 = es(t, 1.15, 1.35) * (1 - es(t, 1.95, 2.2));
      const up1 = es(t, 1.3, 1.7, ease.in);
      const turn = T ? Math.sin(t * 8) : 0;
      const stop = es(t, 1.2, 1.3);
      women.forEach((w) => {
        const taken = w.i === 1;
        const k = taken ? up1 : 0;
        const look = taken ? 0 : es(t, 1.55, 1.75);
        w.p.set({ x: w.x, y: GY - k * 240, s: 0.9, flip: w.i === 1, o: taken ? 1 - es(t, 1.55, 1.72) : 1, armF: taken ? 70 + k * 60 : 70 + turn * 10 * (1 - stop), armB: taken ? k * 130 : 10, head: taken ? -k * 14 : 10 - look * 14, blink: blinkAt(T, w.seed) });
      });
      pose(peg, { x: MILL + turn * 22 * (1 - stop), y: GY - 36, o: 1 });
      pose(beams[1], { x: WOMEN[1], y: GY + 4, o: b1 });

      [[0, 0.35, MEN[1]], [1, 1.35, WOMEN[1]]].forEach(([i, a, x]) => sparks[i].forEach((sp, k) => {
        const kk = bump(t, a + k * 0.08, a + 0.6 + k * 0.08);
        pose(sp, { x: x + (k - 1) * 40, y: GY - 200 - k * 60 - kk * 80, s: kk, r: T * 40, o: kk > 0.01 ? 1 : 0 });
      }));

      S.cam.x = lerp(-50, 50, es(t, 0.85, 1.25));
      S.cam.z = 1.06;
      S.cam.y = 10;
    };
  },
};
