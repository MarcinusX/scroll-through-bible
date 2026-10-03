// Łk 2,16–20 — the shepherds come running down into Bethlehem and find them in the cave: Mary, Joseph, and the
// Baby lying in the manger; they kneel. The old shepherd tells what they were told — a picture of the angel and the
// star in his bubble. Townsfolk come out with their lamps and wonder at it. But Mary keeps all these things: the
// camera draws close to her, and the pictures of that night — the angel, the star, the sheep, the manger — float
// down into a small paper heart at her breast. The shepherds go back into the dawn, arms raised, praising God.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import {
  stableSet, ST, DAWN, JOSEPH, MARY, baby, manger, ox, colt, lantern, shepherdCast, setShep, pilgrims, speech, thought, GLYPH,
  choirAngel, bigStar, ewe, cameo, keepHeart, glowDisc, rayBurst, hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const F = ST.FLOOR;
const MX = 830;
const LX = 870, LY = 440;
const KN0 = [930, 1010, 1090, 1170];          // where the shepherds kneel
const HEART = [748, 630];                    // Mary's heart (kneeling at 736)

export default {
  id: 'lk2-found',
  beats: [
    { v: 16 },
    { v: 17 },
    { v: 18 },
    { v: 19 },
    { v: 20 },
  ],
  cam: { x: [-90, 370], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const KN = PH ? [905, 965, 1025, 1085] : KN0;   // phone: the last one clear of the thread
    const B = stableSet(S, { dusk: DAWN });
    const { A, P, glowL } = B;
    B.R.add(`<g transform="translate(${LX} ${LY - 28})"><path d="M0 -16V0" stroke="${C.wood2}" stroke-width="2"/>${lantern(c, { col: C.apricot })}</g>`);
    const birth = glowL.add(`<g>${glowDisc(250, 'halo-glow', 1)}${rayBurst(c, { n: 18, r0: 40, r1: 230, spread: 0.028, color: '#fff3cf', o: 0.2 })}</g>`);
    glowL.add(`<g transform="translate(${LX} ${LY + 30})">${glowDisc(230, 'warm-glow', 0.9)}</g>`);
    A.add(`<g transform="translate(610 ${F - 2}) scale(.82)">${ox(c)}</g>`);
    A.add(`<g transform="translate(1030 ${F + 10}) scale(-.9 .9)">${colt(c, {})}</g>`);
    A.add(`<g transform="translate(${MX} ${F - 30})">${manger(c)}</g><g transform="translate(${MX - 16} ${F - 72}) scale(.9)">${baby(c)}</g>`);

    /* townsfolk who come to look (a sprite) */
    const folkL = S.layer({ par: 0.32, sh: 5 });
    const town = folkL.sprite(pilgrims(c, 5, { s: 0.84, flip: true, dx: PH ? 36 : 50 }), 1280, F + 6);
    const wows = [0, 1, 2].map((i) => folkL.add(`<g>${thought(c, GLYPH.bang(c), { w: 44, h: 36 })}</g>`));

    const mary = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const joseph = S.puppet(P.add(person(c, { ...JOSEPH })));
    const SH = shepherdCast(S, P);
    const heartEl = P.add(`<g>${keepHeart(c, 21)}</g>`);

    const X = S.layer({ par: 0.34, sh: 5 });
    const tell = X.add(`<g>${speech(c, `<g transform="translate(-26 34) scale(.42)">${choirAngel(c, 2, 0)}</g><g transform="translate(30 -6)">${bigStar(c, 9, { glow: false })}</g>`, { w: 120, h: 92, flip: true })}</g>`);
    const cams = [
      cameo(c, `<g transform="translate(0 20) scale(.3)">${choirAngel(c, 1, 0)}</g>`, { r: 26 }),
      cameo(c, bigStar(c, 9, { glow: false }), { r: 26, face: mix(C.night, C.indigo, 0.4) }),
      cameo(c, `<g transform="translate(-14 12) scale(.5)">${ewe(c)}</g>`, { r: 26, face: mix(C.sage3, C.parchment, 0.4) }),
      cameo(c, `<g transform="translate(0 12) scale(.3)">${manger(c)}</g><g transform="translate(-6 -2) scale(.34)">${baby(c)}</g>`, { r: 26 }),
    ].map((m, i) => ({ i, el: X.add(`<g>${m}</g>`) }));
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      B.dsk.layer.fade(es(t, 4.1, 4.9) * 0.9);
      B.starL.fade(1 - es(t, 4.1, 4.9) * 0.7);
      pose(birth, { x: 790, y: F - 130, s: 0.85, r: T * 2, o: 0.85 });

      /* v16 — they hurry and find Mary, Joseph and the Baby lying in the manger */
      const kneelK = es(t, 0.55, 0.65);
      const leave = es(t, 4.1, 4.2);
      const go = es(t, 4.25, 5.2, (u) => u);
      const raise = es(t, 4.15, 4.4);
      SH.forEach((sh, i) => {
        const arrive = es(t, 0.0 + i * 0.05, 0.55 + i * 0.03, ease.out);
        const x = leave > 0 ? KN[i] + go * (560 - i * 40) : lerp(1560 + i * 90, KN[i], arrive);
        const walking = (arrive > 0.01 && arrive < 0.99) || (go > 0.01 && go < 0.99);
        const k = i === 3 ? 0 : kneelK * (1 - leave);
        setShep(sh, { kneel: k, stand: 1 - k }, {
          x, y: F + (i === 3 ? 4 : 0), flip: leave > 0.5 ? false : true, walk: walking && k < 0.5 ? x * 0.08 + i : undefined, amt: 1.3,
          armF: 40 + (i === 1 ? bump(t, 1.1, 1.95) * 50 : 0) + raise * 100, armB: 30 + raise * 120, armBs: 20,
          head: (1 - leave) * (6 + kneelK * 6) - raise * 14, blink: blinkAt(T, 1 + i * 2),
        });
      });
      mary.set({ x: 736, y: F, s: 0.95, armF: 50 - es(t, 3.1, 3.5) * 10, armB: 20 + es(t, 3.1, 3.5) * 40, head: 12 - bump(t, 0.3, 1.9) * 8 + es(t, 3.1, 3.5) * 6, blink: blinkAt(T, 1) });
      joseph.set({ x: 640, y: F, s: 0.95, armF: 30 + bump(t, 0.4, 1.0) * 30, armB: 20, head: 4, blink: blinkAt(T, 3) });

      /* v17 — they make known what was told them about the Child */
      const tk = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.9, 2.0));
      vpose(tell, { x: KN[1] - 10, y: F - 150, s: Math.max(0.001, tk), o: tk > 0.01 ? 1 : 0 });

      /* v18 — all who heard wondered */
      const fk = es(t, 2.0, 2.5, ease.out) * (1 - es(t, 4.2, 4.8));
      town.set({ x: lerp(1600, PH ? 1050 : 1220, fk), y: F + 6, o: fk > 0.01 ? 1 : 0 });
      wows.forEach((w, i) => {
        const k = es(t, 2.4 + i * 0.08, 2.55 + i * 0.08, ease.back) * (1 - es(t, 2.95, 3.05));
        vpose(w, { x: (PH ? 975 : 1240) + i * 60, y: F - 190 + (i % 2) * 14, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
      });

      /* v19 — Mary keeps all these things, pondering them in her heart */
      cams.forEach((m) => {
        const show = es(t, 3.08 + m.i * 0.08, 3.3 + m.i * 0.08, ease.back);
        const k = es(t, 3.82 + m.i * 0.05, 4.08 + m.i * 0.05, ease.io);
        const a = PI * (1.12 + m.i * 0.25);
        const x0 = HEART[0] + 10 + Math.cos(a) * 190, y0 = HEART[1] - 150 + Math.sin(a) * 110 + Math.sin(T * 1.2 + m.i) * 4;
        vpose(m.el, { x: lerp(x0, HEART[0], k), y: lerp(y0, HEART[1], k), s: Math.max(0.001, show * (1 - k * 0.8)), o: show > 0.01 && k < 0.98 ? 1 : 0 });
      });
      const hk = es(t, 3.3, 3.55, ease.back) * (1 - es(t, 4.5, 4.8));
      vpose(heartEl, { x: HEART[0], y: HEART[1], s: Math.max(0.001, hk * (1 + bump(t, 3.95, 4.25) * 0.2)), o: hk > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = seg(t, 4.0 + i * 0.04, 4.4 + i * 0.04), a = (i / 5) * PI * 2;
        vpose(sp, { x: HEART[0] + Math.cos(a) * (18 + k * 50), y: HEART[1] + Math.sin(a) * (18 + k * 40), s: 0.7 - k * 0.4, r: t * 90, o: bump(t, 4.0 + i * 0.04, 4.4 + i * 0.04) });
      });

      S.cam.x = PH   // phone: the camera holds on the townsfolk through their beat
        ? kf(t, [[0, 90], [0.6, 85], [2.0, 85], [2.45, 370], [2.95, 370], [3.3, -80], [4.1, -80], [4.5, 90]], ease.sine)
        : kf(t, [[0, 90], [0.6, 60], [2.0, 60], [2.5, 100], [3.0, 60], [3.3, -80], [4.1, -80], [4.5, 90]], ease.sine);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.06], [3.0, 1.06], [3.3, 1.2], [4.1, 1.2], [4.5, 1.0]], ease.sine);
      S.cam.y = kf(t, [[0, 20], [3.0, 20], [3.3, 60], [4.1, 60], [4.5, 0]], ease.sine);
    };
  },
};
