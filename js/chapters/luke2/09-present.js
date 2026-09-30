// Łk 2,22–24 — forty days on, the road up to Jerusalem: the city on its hill, the Temple gleaming white and gold.
// Joseph and Mary walk up with the Child to present Him to the Lord. The scroll of the Law comes down: every firstborn
// male shall be called holy to the Lord — Mary lifts the Child towards the Temple. By the gate a man sells doves;
// the Law asks a pair of turtledoves or two young pigeons (a plate shows both, the offering of the poor), and Joseph
// takes a little cage with two doves in it.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  roadSet, RY, JOSEPH, MARY, inArms, jerusalem, staff, doveCage, offeringPlate, verseScroll, placeTag, glowDisc, rayBurst,
  hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const SX = 1110;            // the dove seller
const MK = [[0, 280], [0.9, 640]];
const JK = [[0, 170], [0.9, 520], [2.05, 520], [2.42, 960]];

export default {
  id: 'lk2-present',
  beats: [
    { v: 22 },
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-40, 80], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { sunAt: [1240, 140] });
    // Jerusalem on its hill, the Temple with its glow
    const cityL = S.layer({ par: 0.12, sh: 3 });
    const tglow = cityL.add(`<g>${glowDisc(220, 'halo-glow', 1)}</g>`);
    cityL.add(`<g transform="translate(700 560) scale(.62)">${jerusalem(c, 1)}</g>`);
    // the seller's stall by the road
    const stall = S.layer({ par: 0.4, sh: 4 });
    stall.add(`<g transform="translate(${SX + 70} ${RY})">${doveCage(c, { turtle: true })}</g><g transform="translate(${SX + 110} ${RY - 4})">${doveCage(c, { turtle: false })}</g><g transform="translate(${SX + 90} ${RY - 58})">${doveCage(c, { turtle: true, w: 54, h: 46 })}</g>`);

    const P = S.layer({ par: 0.45, sh: 5 });
    const seller = S.puppet(P.add(person(c, { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'full', skin: C.skin4, belt: C.leather, holdF: `<g transform="rotate(-70) translate(0 -4)">${doveCage(c, { w: 50, h: 44 })}</g>` })));
    const mary = S.puppet(P.add(person(c, { ...MARY, holdF: inArms(c) })));
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const josC = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30), holdF: `<g transform="rotate(-70) translate(0 -4)">${doveCage(c, { w: 50, h: 44 })}</g>` })));

    const X = S.layer({ par: 0.3, sh: 5 });
    const tagJ = hanging(X, placeTag(c, tr('Jerozolima', 'Jerusalem'), 20), { x: 0, y: 0, len: 600 });
    const vs = verseScroll(c, tr(['Każde pierworodne dziecko', 'płci męskiej będzie', 'poświęcone Panu'], ['Every male who opens', 'the womb shall be called', 'holy to the Lord']), { w: 340, size: 23, title: tr('PRAWO PAŃSKIE', 'THE LAW OF THE LORD') });
    const lawRod = hanging(X, vs.rodTop, { x: 0, y: 0, len: 700 });
    const lawSheet = X.add(`<g>${vs.sheet}</g>`);
    const lawRod2 = X.add(`<g>${vs.rodBottom}</g>`);
    const plate = hanging(X, offeringPlate(c), { x: 0, y: 0, len: 700 });
    const holy = X.add(`<g>${rayBurst(c, { n: 14, r0: 20, r1: 120, spread: 0.05, color: '#fff3cf', o: 0.6 })}</g>`);
    const sparks = [0, 1, 2].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T);
      /* v22 — they bring Him up to Jerusalem to present Him to the Lord */
      const mx = kf(t, MK, ease.sine), jx = kf(t, JK, ease.sine);
      const offer = es(t, 1.2, 1.5) * (1 - es(t, 2.0, 2.2));
      mary.set({ x: mx, y: RY + 4, s: 0.95, walk: moving(t, MK, 0.3) ? mx * 0.06 : undefined, armF: 70 + offer * 40, armB: 30 + offer * 40, head: 8 - offer * 18, blink: blinkAt(T, 1) });
      const got = es(t, 2.42, 2.5);
      const jw = moving(t, JK, 0.3) ? jx * 0.06 : undefined;
      jos.set({ x: jx, y: RY + 6, s: 0.95, flip: false, o: 1 - got, walk: jw, armF: 30 + bump(t, 2.3, 2.5) * 50, armB: 30, head: -2, blink: blinkAt(T, 2) });
      josC.set({ x: jx, y: RY + 6, s: 0.95, flip: es(t, 2.6, 2.65) > 0.5, o: got, armF: 60, armB: 30, head: 4, blink: blinkAt(T, 2) });
      const nk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangAt(tagJ, 700, lerp(-500, 250, nk), T, nk > 0.001 ? 1 : 0, 1.2, 0.9, 1);
      pose(tglow, { x: 700 + 280 * 0.62, y: 560 - 190 * 0.62, s: 0.6 + es(t, 0.3, 0.8) * 0.4 + offer * 0.3, o: 0.4 + es(t, 0.3, 0.8) * 0.4 });

      /* v23 — every firstborn male shall be called holy to the Lord */
      const lk = es(t, 1.05, 1.3, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      const un = es(t, 1.2, 1.45) * (1 - es(t, 1.9, 2.0));
      const ly = lerp(-560, 150, lk);
      hangAt(lawRod, 1000, ly, T, lk > 0.001 ? 1 : 0, 0.6, 0.7, 2);
      vpose(lawSheet, { x: 1000, y: ly, sy: Math.max(0.01, un), o: lk > 0.001 && un > 0.01 ? 1 : 0 });
      vpose(lawRod2, { x: 1000, y: ly + vs.h * un, o: lk > 0.001 && un > 0.01 ? 1 : 0 });
      const [hx, hy] = [mx + 60, RY - 150 - offer * 40];
      vpose(holy, { x: hx, y: hy, s: 0.5 + offer * 0.5, r: T * 10, o: offer * 0.8 });

      /* v24 — the offering: a pair of turtledoves or two young pigeons */
      seller.set({ x: SX, y: RY + 6, s: 0.92, flip: true, armF: 40 + bump(t, 2.15, 2.5) * 40, armB: 20, head: 4, blink: blinkAt(T, 5) });
      const pk = es(t, 2.05, 2.35, ease.out);
      hangAt(plate, 820, lerp(-520, 250, pk), T, pk > 0.001 ? 1 : 0, 1, 0.7, 3);
      sparks.forEach((sp, i) => {
        const k = es(t, 2.5 + i * 0.06, 2.7 + i * 0.06), a = T * 0.8 + i * 2.1;
        vpose(sp, { x: jx + 60 + Math.cos(a) * 50, y: RY - 140 + Math.sin(a) * 30, s: k * 0.7, r: T * 30, o: k * (1 - es(t, 2.95, 3.0)) });
      });

      S.cam.x = kf(t, [[0, -20], [0.9, 0], [2.0, 20], [2.5, 60]], ease.sine);
      S.cam.y = 10;
      S.cam.z = 1.02 + es(t, 2.0, 2.5) * 0.05;
    };
  },
};
