// Mt 2,23 — morning in the green hills of Galilee. The family comes along the road to a little town on the hillside,
// Nazareth, and makes its home there: Mary at the door, Joseph's bench under the vine. The boy Jesus stands in the
// middle; the prophets' word comes down — "He will be called a Nazarene" — and beside Him a green shoot springs
// up from the ground and blossoms: the branch.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, grass, flowers, rock, sun, cloud } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  LOOK, DAY, colt, coltRig, donkeyWithMary, childPerson, staff, flatHouse, hillTown, workbench, prophecyPlate, placeTag,
  glory, hangAt, vpose, kf, moving, sparkle, tr, PI,
} from './lib.js';

const Y = 712;
const CX = 820;            // where the boy stands
const JK = [[-0.3, 180], [0.75, 640]];
const JK2 = [[-0.3, 180], [0.75, 640], [0.85, 660], [1.15, 1230]];

export default {
  id: 'mt2-nazareth',
  beats: [
    { v: 23, text: 'Przybył do miasta, zwanego Nazaret, i tam osiadł.' },
    { v: 23, cont: true, text: 'Tak miało się spełnić słowo Proroków: Nazwany będzie Nazarejczykiem.' },
  ],
  cam: { x: [-40, 40], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 0, y: 0, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 0, y: 0, len: 800 });
    const far = S.layer({ par: 0.07, sh: 2 });
    far.add(band(c, { y: 440, amps: [24, 9, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.hillMid, 0.4) }).markup);
    const mid = S.layer({ par: 0.18, sh: 3 });
    const mfn = (x) => 540 - Math.max(0, 1 - Math.abs(x - 1050) / 500) ** 1.3 * 110 + Math.sin(x * 0.012) * 6;
    mid.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), C.hillMid).out());
    mid.add(`<g transform="translate(1060 ${mfn(1060) + 12})">${hillTown(c, { w: 300, h: 60, col: C.hillMid, n: 11 })}</g>`);
    mid.add(olive(c, 700, mfn(700) + 10, 0.6) + cypress(c, 1380, mfn(1380) + 8, 110) + olive(c, 1500, mfn(1500) + 10, 0.55));

    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(Y - 40, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5)).p(c.ribbon([[-900, Y + 6], [700, Y + 4], [1100, Y - 6]], 34, 2), mix(C.sand, C.cream, 0.35)).out());
    // their house, with a vine over the door and the bench under it
    G.add(flatHouse(c, 900, Y - 20, 280, 190, { wall: mix(C.plaster, C.dawn, 0.2), lit: false }));
    const vine = sheet();
    vine.p(c.ribbon([[905, Y - 20], [912, Y - 140], [960, Y - 200], [1100, Y - 210]], 5), C.wood2);
    let lv = '';
    for (let i = 0; i < 16; i++) lv += c.cut(c.blob(c.rr(930, 1150), c.rr(Y - 225, Y - 190), c.rr(12, 20), c.rr(8, 12), 8, 0.2), 0.5, 4);
    vine.p(lv, C.leaf);
    G.add(vine.out());
    G.add(`<g transform="translate(1250 ${Y})">${workbench(c, 170)}</g>`);
    G.add(grass(c, { x0: -800, x1: 2400, y: Y, fn: (x) => gfn(x) + 22, n: 50, h: 12, color: C.moss }) + flowers(c, { x0: 300, x1: 1500, y: Y, fn: (x) => gfn(x) + 26, n: 18 }));

    const lightL = S.layer({ par: 0.45, sh: 0, flat: true });
    const gl = lightL.add(`<g>${glory(c, 300, 20)}</g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const ride = donkeyWithMary(c, {});
    const donkey = coltRig(P.add(colt(c, { over: ride.saddle, rider: ride.rider })));
    const plain = coltRig(P.add(colt(c, {})));
    const mary = S.puppet(P.add(person(c, { ...LOOK.mary })));
    const joseph = S.puppet(P.add(person(c, { ...LOOK.joseph, holdB: staff(c, 190, 30) })));
    const kid = S.puppet(P.add(childPerson(c, { ...LOOK.child })));
    // the shoot: a stem that grows from the ground, then leaves and a blossom
    const shoot = P.add(`<g>${sheet().p(c.ribbon(c.qbez([0, 0], [-8, -40], [4, -90], 10), (u) => 6 - u * 3.5), C.moss).out()}</g>`);
    const leaves = P.add(`<g>${sheet().p(c.cut([[0, 0], [-18, -10], [-34, -6], [-20, 4]], 0.3, 3) + c.cut([[0, -8], [18, -20], [34, -16], [20, -4]], 0.3, 3), C.leaf).p(c.cut(c.star(4, -40, 12, 6, 5, 0.3), 0.3, 3), C.blushVeil).p(c.cut(c.circ(4, -40, 4, 8), 0.2, 2), C.sun).out()}</g>`);

    const X = S.layer({ par: 0.3, sh: 5 });
    const tagN = hanging(X, placeTag(c, tr('Nazaret', 'Nazareth'), 22), { x: 0, y: 0, len: 600 });
    const word = hanging(X, prophecyPlate(c, tr(['Nazwany będzie', 'Nazarejczykiem'], ['He will be called', 'a Nazarene']), { size: 24 }), { x: 0, y: 0, len: 700 });
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1240, y: 150, r: Math.sin(T * 0.6) });
      pose(cl, { x: 480 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6) * 1.2 });

      /* v23a — they come to Nazareth and settle there */
      const jx = kf(t, JK, ease.out);
      const walking = moving(t, JK, 0.3);
      const home = es(t, 0.8, 0.88);
      const jx2 = kf(t, JK2, ease.sine);
      joseph.set({ x: jx2, y: Y + 4, s: 0.92, flip: t > 1.15, walk: moving(t, JK2, 0.3) ? jx2 * 0.06 : undefined, armF: 30, armB: 30 + home * 20, head: home * 4, blink: blinkAt(T, 2) });
      const DXO = S.portrait ? 120 : 220;   // phone: the donkey stops whole inside the frame, not as a head at the edge
      const dx = jx - DXO;
      donkey.set({ x: dx, y: Y + 10, s: 0.9, o: 1 - home, walk: walking ? dx * 0.05 : undefined });
      plain.set({ x: 640 - DXO, y: Y + 10, s: 0.9, o: home, nod: Math.sin(T * 0.8) * 3 - 8 });
      mary.set({ x: S.portrait ? 985 : 1070, y: Y, s: 0.95, flip: true, o: home, armF: 30 + es(t, 1.2, 1.5) * 40, armB: 20, head: 6, blink: blinkAt(T, 1) });
      const kx = lerp(jx - 80, CX, es(t, 0.75, 1.05));
      const wonder = es(t, 1.3, 1.6);
      kid.set({ x: kx, y: Y + 10, s: 0.58, walk: t < 1.05 && (walking || t > 0.75) ? kx * 0.1 : undefined, armF: 20 + wonder * 50, armB: 10 + wonder * 130, head: -wonder * 12, blink: blinkAt(T, 4) });
      const nk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      hangAt(tagN, S.portrait ? 990 : 1060, lerp(-500, 260, nk), T, nk > 0.001 ? 1 : 0, 1.2, 0.9, 1);

      /* v23b — "He will be called a Nazarene": the word comes down, the shoot springs up */
      const wk = es(t, 1.1, 1.45, ease.out);
      hangAt(word, CX, lerp(-500, 250, wk), T, wk > 0.001 ? 1 : 0, 1.1, 0.8, 2);
      const lk = es(t, 1.25, 1.6);
      vpose(gl, { x: CX, y: 250, s: 0.5 + lk * 0.5, r: T * 3, o: lk * 0.45 });
      const grow = es(t, 1.35, 1.7, ease.out);
      vpose(shoot, { x: CX + 70, y: Y + 8, s: 1.4, sy: grow * 1.4, o: grow > 0.01 ? 1 : 0 });
      const bloom = es(t, 1.6, 1.8, ease.back);
      vpose(leaves, { x: CX + 76, y: Y + 8 - 70 * grow, s: bloom * 1.4, o: bloom > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = es(t, 1.5 + i * 0.05, 1.7 + i * 0.05), a = T * 0.7 + i * 1.3;
        vpose(sp, { x: CX + Math.cos(a) * 200, y: 250 + Math.sin(a) * 80, s: k * 0.8, r: T * 30, o: k });
      });

      S.cam.x = lerp(-30, 10, es(t, 0.2, 1.0));
      S.cam.y = 30 - es(t, 1.1, 1.5) * 10;
      S.cam.z = 1.02 + es(t, 1.1, 1.5) * 0.06;
    };
  },
};
