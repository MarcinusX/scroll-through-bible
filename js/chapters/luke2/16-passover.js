// Łk 2,41–43 — every year the pilgrims go up to Jerusalem for the Passover, and Joseph and Mary with them: as they
// walk the road the Child walks beside them a little taller each year, the Passover plate with its lamb hanging over
// the way. When He is twelve they go up again — the number comes down — the boy of twelve at their side. The feast is
// over and the whole caravan turns for home; but the boy stays behind by the city, looking up at the Temple, while
// His parents walk on among their relatives, talking, not knowing He is not with them.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  roadSet, RY, JOSEPH, MARY, CHILD, BOY, kid, staff, pilgrims, jerusalem, numberCard, placeTag, hungPlate, lamb, glowDisc,
  hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { matzahRound } from '../mark14/lib.js';

const FK = [[0, 300], [1.9, 860], [2.12, 860], [3.9, 330]];       // the family along the road (and back)
const YEARS = [{ s: 0.48, k: 1.4 }, { s: 0.6, k: 1.28 }, { s: 0.7, k: 1.18 }];

export default {
  id: 'lk2-passover',
  beats: [
    { v: 41 },
    { v: 42 },
    { v: 43, text: 'Kiedy wracali po skończonych uroczystościach, został Jezus w Jerozolimie,' },
    { v: 43, cont: true, text: 'a tego nie zauważyli Jego Rodzice.' },
  ],
  cam: { x: [-90, 90], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { sunAt: [880, 130] });
    const cityL = S.layer({ par: 0.12, sh: 3 });
    const tglow = cityL.add(`<g>${glowDisc(200, 'halo-glow', 1)}</g>`);
    cityL.add(`<g transform="translate(1080 566) scale(.5)">${jerusalem(c, 1)}</g>`);
    const W = S.layer({ par: 0.36, sh: 5 });
    const goR = [0, 1].map((i) => ({ i, sp: W.sprite(pilgrims(c, 4, { s: 0.82 }), 800, RY + 2) }));
    const goL = [0, 1].map((i) => ({ i, sp: W.sprite(pilgrims(c, 4, { s: 0.82, flip: true }), 800, RY + 2) }));
    const P = S.layer({ par: 0.4, sh: 5 });
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const kids = YEARS.map((z) => ({ ...z, p: S.puppet(P.add(kid(c, { ...CHILD }, z.k))) }));
    const boy = S.puppet(P.add(kid(c, { ...BOY }, 1.1)));
    const X = S.layer({ par: 0.3, sh: 5 });
    const plate = hanging(X, `${sheet().p(c.cut(c.circ(0, 0, 60, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 54, 36), 0.5, 5), C.cream).out()}<g transform="translate(-18 12) scale(.5)">${lamb(c)}</g><g transform="translate(24 -8) scale(.55)">${matzahRound(c, 30)}</g><g transform="translate(0 82)">${placeTag(c, tr('Pascha · co roku', 'Passover · every year'), 17)}</g>`, { x: 0, y: 0, len: 700 });
    const n12 = hanging(X, numberCard(c, '12', { size: 46 }), { x: 0, y: 0, len: 700 });
    const tag = hanging(X, placeTag(c, tr('Jerozolima', 'Jerusalem'), 20), { x: 0, y: 0, len: 600 });
    const chat = X.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 34, 20, 12, 0.08), 0.4, 4), C.cream).out()}<path d="${c.ribbon([[-18, -4], [16, -4]], 2) + c.ribbon([[-18, 5], [8, 5]], 2)}" fill="${C.ink}" opacity=".45"/></g>`);

    return (t, time) => {
      const T = time;
      R.update(T);
      pose(tglow, { x: 1080 + 280 * 0.5, y: 566 - 200 * 0.5, s: 0.8, o: 0.5 + es(t, 2.1, 2.5) * 0.4 });
      /* v41 — every year to Jerusalem for the Passover */
      goR.forEach((g) => {
        const x = lerp(-400 - g.i * 500, 1500 - g.i * 500, es(t, -0.2, 2.0, (u) => u));
        g.sp.set({ x, y: RY + 2, o: t < 2.05 ? 1 : 0 });
      });
      goL.forEach((g) => {
        const x = lerp(1300 + g.i * 420, -500 + g.i * 420, es(t, 2.05, 4.0, (u) => u));
        g.sp.set({ x, y: RY + 2, o: t > 2.05 ? 1 : 0 });
      });
      const fx = kf(t, FK, ease.sine);
      const back = t > 2.05;
      const walking = moving(t, FK, 0.3);
      const talk = bump(t, 3.05, 3.95);
      jos.set({ x: fx - (back ? -60 : 60), y: RY + 6, s: 0.94, flip: back, walk: walking ? fx * 0.06 : undefined, armF: 30 + talk * 30, armB: 30, head: talk * -6, blink: blinkAt(T, 2) });
      mary.set({ x: fx, y: RY + 4, s: 0.94, flip: back, walk: walking ? fx * 0.06 + 1 : undefined, armF: 30 + talk * 40, armB: 20, head: -talk * 4, blink: blinkAt(T, 1) });
      const yr = [es(t, 0.0, 0.05), es(t, 0.35, 0.42), es(t, 0.65, 0.72)];
      const twelve = es(t, 1.0, 1.08);
      kids.forEach((kd, i) => {
        const on = yr[i] * (i < 2 ? 1 - yr[i + 1] : 1) * (1 - twelve);
        kd.p.set({ x: fx + 70, y: RY + 8, s: kd.s, o: on, walk: walking ? fx * 0.08 : undefined, armF: 20, blink: blinkAt(T, 4) });
      });
      const stay = es(t, 2.05, 2.4);
      const bx = back ? lerp(fx + 70, 1010, stay) : fx + 70;
      boy.set({ x: bx, y: RY + 8, s: 0.8, o: twelve, flip: false, walk: (walking && !back) || (stay > 0.01 && stay < 0.99) ? bx * 0.07 : undefined, armF: 20 + es(t, 2.4, 2.7) * 30, armB: 20, head: -es(t, 2.4, 2.7) * 14, blink: blinkAt(T, 4) });
      const pk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      hangAt(plate, 640, lerp(-520, 250, pk), T, pk > 0.001 ? 1 : 0, 1.2, 0.8, 1);
      const k12 = es(t, 1.08, 1.35, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      hangAt(n12, 700, lerp(-520, 260, k12), T, k12 > 0.001 ? 1 : 0, 1.2, 0.8, 2);
      const tk = es(t, 1.25, 1.5, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      hangAt(tag, 1140, lerp(-520, 250, tk), T, tk > 0.001 ? 1 : 0, 1.2, 0.8, 3);
      /* v43b — the parents walk on, talking with the others, and do not notice */
      const ck = es(t, 3.1, 3.25, ease.back) * (1 - es(t, 3.9, 4.0));
      vpose(chat, { x: fx - 30, y: RY - 230, s: Math.max(0.001, ck), o: ck > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -40], [1.9, 60], [2.4, 80], [3.9, -40]], ease.sine);
      S.cam.y = 10;
      S.cam.z = 1.02 + es(t, 3.0, 3.8) * -0.02;
    };
  },
};
