// Łk 2,3–5 — the roads of the land fill up: families with bundles and donkeys walk every way, each to his own town,
// past a signpost. Out of Nazareth in Galilee (up on the left) Joseph leads the donkey south towards Bethlehem on
// the right, the city of David — David's crowned medallion comes down over it: he is of David's house. At the
// gate a Roman clerk sits at the census table; Joseph gives their names and they are written down together:
// Joseph, and Mary, who rides the donkey, expecting her child.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { cypress, olive } from '../../assets/nature.js';
import { lowTable, scrollOpen } from '../mark2/lib.js';
import {
  roadSet, RY, JOSEPH, MARY, CLERK, donkeyRide, colt, coltRig, staff, pilgrims, hillTown, placeTag, medal, RIM, soldier, signpost,
  glowDisc, hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { DAVID } from '../matthew1/lib.js';

const TX = 1110;        // the census table
// Joseph's walk: out of Nazareth, along the road, to the table
const JK = [[1.0, 250], [2.05, 930], [2.2, 960]];

export default {
  id: 'lk2-roads',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-140, 120], y: [-30, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { sunAt: [860, 130] });
    // Nazareth on the hill to the left, Bethlehem to the right
    R.mid.add(`<g transform="translate(330 ${R.mfn(330) + 14})">${hillTown(c, { w: 280, h: 70, col: C.hillMid, n: 9 })}</g>`);
    R.mid.add(`<g transform="translate(1240 ${R.mfn(1240) + 14})">${hillTown(c, { w: 300, h: 80, col: C.hillMid, n: 11, towers: true })}</g>`);
    R.mid.add(olive(c, 700, R.mfn(700) + 12, 0.6) + cypress(c, 880, R.mfn(880) + 8, 90) + olive(c, 1560, R.mfn(1560) + 12, 0.7));
    // an upper path along the ridge, for those going the other way
    R.mid.add(sheet().p(c.ribbon([[-1400, 612], [400, 604], [1200, 610], [3000, 604]], 22, 2), mix(C.sand, C.hillMid, 0.4)).out());
    const upWalk = R.midWalk;
    const UP = [0, 1, 2].map((i) => ({ i, sp: upWalk.sprite(pilgrims(c, 3 + (i % 2), { s: 0.42, dx: 30, flip: true }), 800, 612) }));
    // the signpost in the middle of the land
    R.G.add(`<g transform="translate(660 ${RY - 6})">${signpost(c, tr('Betlejem', 'Bethlehem'), { size: 18 })}</g>`);

    /* the census table at the gate of Bethlehem */
    const T = S.layer({ par: 0.4, sh: 5 });
    const clerk = S.puppet(T.add(person(c, { ...CLERK, pose: 'sit', holdF: `<g transform="rotate(-80) translate(-4 4)"><path d="${c.ribbon([[0, 0], [0, 22]], 2.2)}" fill="${C.wood2}"/></g>` })));
    T.add(`<g transform="translate(${TX} ${RY + 8})">${lowTable(c, 170, 50)}</g>`);
    T.add(`<g transform="translate(${TX - 10} ${RY - 50}) scale(1 .45)">${scrollOpen(c, 110, 70)}</g>`);
    const sold = S.puppet(T.add(soldier(c, 1, { spear: 20 })));
    const names = T.add(`<g>${placeTag(c, tr('Józef · Maryja', 'Joseph · Mary'), 17)}</g>`);

    /* the travellers on the road (sprites: whole groups sliding) */
    const W = S.layer({ par: 0.45, sh: 5 });
    const donkeyGroup = coltRig(W.add(colt(c, { over: sheet().p(c.cut(c.blob(-10, -110, 40, 20, 10, 0.2), 0.6, 5), C.basket).out() })));
    const GR = [
      { x0: 100, x1: 1900, n: 4, flip: false, a: -0.5, b: 2.6 },
      { x0: 1700, x1: -300, n: 3, flip: true, a: -0.3, b: 2.8 },
      { x0: 2000, x1: -500, n: 5, flip: true, a: 1.2, b: 3.6 },
    ].map((g, i) => ({ ...g, i, sp: W.sprite(pilgrims(c, g.n, { s: 0.78, flip: g.flip }), 800, RY + 8) }));

    /* Joseph, Mary on the donkey */
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const mGlow = glowL.add(`<g>${glowDisc(120, 'halo-glow', 0.9)}</g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const ride = donkeyRide(c, { pregnant: true });
    const donkey = coltRig(P.add(colt(c, { over: ride.saddle, rider: ride.rider })));
    const joseph = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));

    /* place names and David's medallion */
    const X = S.layer({ par: 0.3, sh: 5 });
    const tagN = hanging(X, placeTag(c, tr('Nazaret · Galilea', 'Nazareth · Galilee'), 19), { x: 0, y: 0, len: 600 });
    const tagB = hanging(X, placeTag(c, tr('Betlejem · miasto Dawida', 'Bethlehem · David’s city'), 19), { x: 0, y: 0, len: 600 });
    const dav = hanging(X, medal(S, DAVID, { r: 44, ...RIM.king, king: true, name: tr('dom Dawida', 'the house of David'), size: 17 }), { x: 0, y: 0, len: 700 });
    const sparks = [0, 1, 2].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T_ = time;
      R.update(T_);

      /* v3 — all go to be enrolled, each to his own town */
      GR.forEach((g) => {
        const k = es(t, g.a, g.b, (u) => u);
        const x = lerp(g.x0, g.x1, k);
        g.sp.set({ x, y: RY + 8 - Math.abs(Math.sin(x * 0.03)) * 2, o: 1 });
      });
      UP.forEach((u) => {
        const x = lerp(1500 + u.i * 260, 200 + u.i * 260, es(t, -0.3, 2.6, (v) => v));
        u.sp.set({ x, y: 612, o: 1 });
      });
      const dgx = lerp(-100, 820, es(t, -0.2, 1.6, (u) => u));
      donkeyGroup.set({ x: dgx, y: RY + 12, s: 0.72, walk: t < 1.6 ? dgx * 0.05 : undefined });

      /* v4 — Joseph goes up from Nazareth to Bethlehem, for he is of David's house */
      const jx = kf(t, JK, ease.sine);
      const walking = moving(t, JK, 0.3);
      const on = es(t, 0.9, 1.1);
      joseph.set({ x: jx + 90, y: RY + 6, s: 0.92, o: on, walk: walking ? jx * 0.06 : undefined, armF: 40 + es(t, 2.2, 2.4) * 30, armB: 30, head: -2, blink: blinkAt(T_, 2) });
      donkey.set({ x: jx - 60, y: RY + 12, s: 0.9, o: on, walk: walking ? jx * 0.05 : undefined, nod: walking ? 0 : Math.sin(T_ * 0.8) * 3 });
      pose(mGlow, { x: jx - 30, y: RY - 150, s: 0.6 + es(t, 2.1, 2.4) * 0.5, o: es(t, 2.1, 2.4) * 0.8 });
      const nk = es(t, 1.0, 1.25, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      hangAt(tagN, 440, lerp(-500, 280, nk), T_, nk > 0.001 ? 1 : 0, 1.2, 0.9, 1);
      const bk = es(t, 1.2, 1.45, ease.out);
      hangAt(tagB, 1110, lerp(-500, 380, bk), T_, bk > 0.001 ? 1 : 0, 1.2, 0.9, 2);
      const dk = es(t, 1.4, 1.7, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      hangAt(dav, 1000, lerp(-500, 200, dk), T_, dk > 0.001 ? 1 : 0, 1, 0.8, 3);
      sparks.forEach((sp, i) => {
        const a = T_ * 0.8 + i * 2.1, k = es(t, 1.6 + i * 0.05, 1.8 + i * 0.05) * (1 - es(t, 1.95, 2.1));
        vpose(sp, { x: 1000 + Math.cos(a) * 70, y: 200 + Math.sin(a) * 50, s: k * 0.8, r: T_ * 30, o: k });
      });

      /* v5 — to be enrolled with Mary, who is expecting a child: their names go into the list */
      const write = t > 2.2 && t < 2.7 ? Math.sin(T_ * 9) * 8 : 0;
      clerk.set({ x: TX + 20, y: RY - 4, s: 0.86, flip: true, armF: 50 + write + es(t, 2.2, 2.3) * 10, armB: 20, head: 8, blink: blinkAt(T_, 3) });
      sold.set({ x: TX + 150, y: RY + 10, s: 0.88, flip: true, armF: 20, blink: blinkAt(T_, 5) });
      const wk = es(t, 2.35, 2.55, ease.back);
      vpose(names, { x: TX + 40, y: RY - 200, s: Math.max(0.001, wk), r: -4, o: wk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [0.9, 0], [1.15, -120], [2.05, 90], [3, 110]], ease.sine);
      S.cam.y = 20;
      S.cam.z = 1.02 + es(t, 2.05, 2.4) * 0.06;
    };
  },
};
