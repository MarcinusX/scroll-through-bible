// Łk 2,39–40 — all that the Law asked is done, and they go home to Galilee: along the road into Nazareth, Joseph
// leading the donkey, Mary on it with the Child in her arms, to their house with the vine over the door. And the Child
// grows: by the doorpost He stands small, then taller, then a boy, and a new notch is cut in the post each time; He is
// strong, a little scroll in His hand for the wisdom that fills Him, and the grace of God rests on Him as a soft light.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  nazSet, NY, NAZ, JOSEPH, MARY, CHILD, kid, colt, coltRig, donkeyWithMary, baby, staff, workbench, notch, placeTag, glowDisc, rayBurst,
  scrollRolled, hangAt, vpose, kf, moving, sparkle, fade, tr, es, ease, bump, seg, PI,
} from './lib.js';

const JK = [[0, 1560], [0.85, 760]];
const JJ0 = [[0, 1430], [0.85, 630], [1.0, 630], [1.4, 1100]];
const KX = 525;                                   // where the Child stands by the doorpost
const SIZES = [{ s: 0.48, k: 1.42 }, { s: 0.6, k: 1.28 }, { s: 0.74, k: 1.14 }];

export default {
  id: 'lk2-return',
  beats: [
    { v: 39 },
    { v: 40 },
  ],
  cam: { x: [-60, 80], y: [-30, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    // phone: Joseph's workbench (and Joseph at it) inside the screen
    const BX = S.portrait ? 1000 : NAZ.BENCH;
    const JJ = S.portrait ? [[0, 1430], [0.85, 630], [1.0, 630], [1.4, 920]] : JJ0;
    const N = nazSet(S);
    N.G.add(`<g transform="translate(${BX} ${NY + 2})">${workbench(c, 170)}</g>`);
    const grace = N.lightL.add(`<g>${glowDisc(200, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 30, r1: 200, spread: 0.03, color: '#fff3cf', o: 0.3 })}</g>`);
    const notches = SIZES.map(() => N.markL.add(`<g>${notch(c)}</g>`));
    const P = N.P;
    const ride = donkeyWithMary(c, { infant: baby(c) });
    const donkey = coltRig(P.add(colt(c, { over: ride.saddle, rider: ride.rider })));
    const plain = coltRig(P.add(colt(c, {})));
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const kids = SIZES.map((z, i) => ({ ...z, i, p: S.puppet(P.add(kid(c, { ...CHILD, holdF: i === 2 ? `<g transform="rotate(-70)">${scrollRolled(c, 40)}</g>` : '' }, z.k))) }));
    const X = S.layer({ par: 0.3, sh: 5 });
    const tagN = hanging(X, placeTag(c, tr('Nazaret · Galilea', 'Nazareth · Galilee'), 20), { x: 0, y: 0, len: 600 });
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      N.update(T);
      /* v39 — they return to Galilee, to Nazareth */
      const jx = kf(t, JK, ease.sine);
      const walking = moving(t, JK, 0.3);
      const home = es(t, 0.9, 0.98);
      const jjx = kf(t, JJ, ease.sine);
      const work = t > 1.45 && T ? Math.sin(T * 5) * 10 : 0;
      jos.set({ x: jjx, y: NY + 4, s: 0.94, flip: t < 1.0, walk: moving(t, JJ, 0.3) ? jjx * 0.06 : undefined, armF: 40 + es(t, 1.4, 1.5) * 30 + work, armB: 30, head: es(t, 1.4, 1.5) * 10, blink: blinkAt(T, 2) });
      donkey.set({ x: jx, y: NY + 10, s: 0.9, flip: true, o: 1 - home, walk: walking ? jx * 0.05 : undefined });
      plain.set({ x: 1500, y: NY + 10, s: 0.9, flip: true, o: 0, nod: -8 });
      const nk = es(t, 0.2, 0.5, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangAt(tagN, 800, lerp(-500, 250, nk), T, nk > 0.001 ? 1 : 0, 1.2, 0.9, 1);
      mary.set({ x: lerp(jx + 20, NAZ.DOORX - 90, es(t, 0.95, 1.25)), y: NY, s: 0.95, flip: es(t, 0.95, 1.25) > 0.9 ? false : true, o: home, armF: 30 + es(t, 1.3, 1.6) * 30, armB: 20, head: 8, blink: blinkAt(T, 1) });

      /* v40 — the Child grows, strong, filled with wisdom; God's grace upon Him */
      const stage = [es(t, 1.05, 1.12), es(t, 1.35, 1.42), es(t, 1.62, 1.69)];
      kids.forEach((kd, i) => {
        const on = stage[i] * (i < 2 ? 1 - stage[i + 1] : 1);
        kd.p.set({ x: KX, y: NY + 4, s: kd.s, flip: true, o: on, armF: i === 2 ? 60 : 20 + i * 10, armB: 20, head: -4, blink: blinkAt(T, 4) });
        const h = 210 * kd.s + 8 * (kd.k - 1) * kd.s * 4;
        const nk2 = es(t, 1.12 + i * 0.28, 1.2 + i * 0.28, ease.back);
        vpose(notches[i], { x: N.postX, y: NY - h, s: Math.max(0.001, nk2 * 1.3), o: nk2 > 0.01 ? 1 : 0 });
      });
      const gk = es(t, 1.6, 1.9);
      pose(grace, { x: KX, y: NY - 110, s: 0.5 + gk * 0.5, r: T * 2, o: 0.3 + gk * 0.7 });
      sparks.forEach((sp, i) => {
        const k = seg(t, 1.7 + i * 0.05, 2.1 + i * 0.05), a = PI * (1.1 + i * 0.2);
        vpose(sp, { x: KX + Math.cos(a) * (60 + k * 60), y: NY - 170 + Math.sin(a) * (40 + k * 40), s: 0.8 - k * 0.4, r: t * 90, o: bump(t, 1.7 + i * 0.05, 2.1 + i * 0.05) });
      });

      S.cam.x = kf(t, [[0, 60], [0.9, 0], [1.1, -50]], ease.sine);
      S.cam.y = 20 - es(t, 1.0, 1.4) * 40;
      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.06;
    };
  },
};
