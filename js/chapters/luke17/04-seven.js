// Łk 17,4 — the same courtyard, the whole of one day: the sun on its string climbs out of the east and crosses to
// the west. "If he sins against you seven times in the day": seven times a dark little scrap flies from the one
// brother to the other, and each time a stroke is scored on the plastered wall — seven strokes. "And seven times
// returns, saying, 'I repent'": seven times he comes back and bows, his hand on his heart, and each time "I repent"
// pops up over him and a little heart settles under one of the strokes. "You shall forgive him": the seven strokes
// turn into seven little flames burning on the wall, the brother lifts him up and embraces him as the evening comes.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { yardSet, YARD, behindOf, BRO_A, BRO_B, darkKnot, bubble, heart, tinyFlame, headAt, hand, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const GY = YARD.GY;
const AX = 640, BX0 = 820;
const TX = 960, TY = 500;     // the tally on the wall

export default {
  id: 'lk17-seven',
  beats: [
    { v: 4, text: 'I jeśliby siedem razy na dzień zawinił przeciw tobie' },
    { v: 4, cont: true, text: 'i siedem razy zwróciłby się do ciebie, mówiąc: "Żałuję tego",' },
    { v: 4, cont: true, text: 'przebacz mu!»' },
  ],
  cam: { x: [0, 80], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const Y = yardSet(S);
    const c = S.c;
    const glowL = behindOf(S.layer({ par: 0.3, sh: 0, flat: true }), Y.floor);
    const flameL = behindOf(S.layer({ par: 0.3, sh: 3 }), Y.floor);
    const TK = Array.from({ length: 7 }, (_, i) => {
      const x = (S.portrait ? TX - 70 : TX) + i * 22 + (i > 4 ? 8 : 0);   // phone: the tally clear of the thread
      return {
        i, x,
        mark: Y.wallL.add(`<g opacity="0">${sheet().x(c.ribbon([[c.rr(-2, 2), 0], [c.rr(-2, 2), 44]], 4), C.inkSoft).out()}</g>`),
        heart: Y.wallL.add(`<g opacity="0">${sheet().p(c.cut(heartPts(6), 0.2, 3), C.jesusMantle).out()}</g>`),
        glow: glowL.add(`<g opacity="0"><circle r="30" fill="url(#warm-glow)"/></g>`),
        flame: flameL.add(`<g opacity="0">${tinyFlame(c, 22, false)}</g>`),
      };
    });
    const A = S.puppet(Y.act.add(person(c, BRO_A)));
    const B = S.puppet(Y.act.add(person(c, BRO_B)));
    const scraps = Array.from({ length: 7 }, (_, i) => ({ i, el: Y.fx.add(`<g opacity="0">${darkKnot(c, 9)}</g>`) }));
    const sorry = Y.fx.add(`<g opacity="0">${bubble(c, tr('Żałuję tego', 'I repent'), { size: 18, tail: -1 })}</g>`);
    const love = Y.fx.add(`<g opacity="0">${heart(c, 16)}</g>`);
    const seedA = c.rr(0, 9), seedB = c.rr(0, 9);

    return (t, time) => {
      const T = time;
      const sunK = es(t, 0.02, 2.6, (u) => u);
      Y.update(T, { sunK: 0.05 + sunK * (S.portrait ? 0.7 : 0.9), eveK: es(t, 2.0, 2.7), sunW: S.portrait ? 330 : 560 });   // phone: a narrower day, clear of the thread

      /* v4a — seven times in the day he sins against him: seven dark scraps, seven strokes */
      const n7 = (i) => 0.08 + i * 0.12;
      let jolt = 0;
      scraps.forEach((s) => {
        const k = seg(t, n7(s.i), n7(s.i) + 0.1);
        jolt = Math.max(jolt, bump(t, n7(s.i) + 0.07, n7(s.i) + 0.14));
        pose(s.el, { x: lerp(BX0 - 30, AX + 20, k), y: GY - 130 - Math.sin(k * PI) * 40, r: k * 300, o: k > 0 && k < 1 ? 1 : 0 });
      });
      TK.forEach((m) => {
        const on = es(t, n7(m.i) + 0.08, n7(m.i) + 0.12);
        const lit = es(t, 2.1 + m.i * 0.05, 2.25 + m.i * 0.05);
        pose(m.mark, { x: m.x, y: TY, o: on * (1 - lit) });
        const hk = es(t, 1.12 + m.i * 0.11, 1.2 + m.i * 0.11, ease.back);
        pose(m.heart, { x: m.x, y: TY + 62, s: Math.max(0.001, hk), o: hk > 0.01 ? 1 - lit : 0 });
        pose(m.flame, { x: m.x, y: TY + 44, s: Math.max(0.001, lit) * (1 + (T ? Math.sin(T * 8 + m.i) * 0.06 : 0)), o: lit > 0.01 ? 1 : 0 });
        pose(m.glow, { x: m.x, y: TY + 30, o: lit * 0.9 });
      });

      /* v4b — seven times he comes back and bows: "I repent" */
      const back = es(t, 1.02, 1.12);
      let bow = 0, pk = 0;
      for (let i = 0; i < 7; i++) { bow = Math.max(bow, bump(t, 1.08 + i * 0.11, 1.2 + i * 0.11)); pk = Math.max(pk, bump(t, 1.08 + i * 0.11, 1.19 + i * 0.11)); }
      const lift = es(t, 2.2, 2.45);
      const hug = es(t, 2.4, 2.7);
      const bx = lerp(BX0, 740, back) + hug * 10;
      B.set({ x: bx, y: GY, s: 1, flip: true, armF: 20 + bump(t, 0.05, 0.95) * 30 + hug * 60, armB: 8 + back * 60 * (1 - hug), head: jolt * -6 - bow * 20 * (1 - lift) - back * 6 * (1 - lift), lean: bow * 14 * (1 - lift) - jolt * 4, blink: blinkAt(T, seedB) });
      const [bhx, bhy] = headAt(bx, GY, 1, true);
      const sk = es(t, 1.06, 1.14, ease.back) * (1 - es(t, 1.9, 1.98));
      pose(sorry, { x: bhx - 10, y: bhy - 36 - pk * 6, s: Math.max(0.001, sk * (1 + pk * 0.08)), o: sk > 0.01 ? 1 : 0 });
      A.set({ x: AX + hug * 20, y: GY + 2, s: 1, flip: false, armF: 16 + jolt * 30 + lift * 50 + hug * 30, armB: 8 + jolt * 40 + lift * 40, head: -jolt * 8 + back * 4, lean: -jolt * 6 + hug * 6, blink: blinkAt(T, seedA) });
      const lk = es(t, 2.5, 2.75, ease.back);
      pose(love, { x: (AX + bx) / 2 + 10, y: GY - 260 - lk * 14, s: lk, o: lk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 60], [1, 60], [2, 50], [3, 40]]);
      S.cam.y = kf(t, [[0, 20], [3, 30]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2, 1.06], [3, 1.08]]);
    };
  },
};

function heartPts(r) {
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * PI * 2;
    pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]);
  }
  return pts;
}
