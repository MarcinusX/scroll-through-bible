// Łk 12,13–15 — back on the plain among the thousands. A man pushes out of the crowd, pulling his elder brother by the
// sleeve; between them lies their father's estate on a cloth — the money chest, a jar, a sack, the rolled deed — and he
// points at it: "Teacher, tell my brother to divide the inheritance with me". "Man, who made me a judge or an arbitrator
// over you?": a judge's seat with its awning is let down beside Jesus; He lifts His palm against it, and it goes back
// up into the flies. "Beware, keep yourselves from all covetousness": He turns to them all with a raised hand; the two
// brothers have each seized a corner of the cloth and tug, and a dark knot of greed tangles over their heads. "For a
// man's life does not consist in the abundance of his possessions": the heap swells and swells into a great mound of
// goods — while over the younger brother the little flame of his life stays just as it was, a "≠" hung between them.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { plainSet, RISE, BRO_A, BRO_B, goodsHeap, judgeSeat, notEq, darkKnot, soulLight, headAt, hand, voiceRings, hangAt, crossX, onString, kf, PI } from './lib.js';

const JX = 800, AX = 590, BX = 706, GY = 706, HX = 648;

export default {
  id: 'lk12-inherit',
  beats: [
    { v: 13 },
    { v: 14 },
    { v: 15, text: 'Powiedział też do nich: «Uważajcie i strzeżcie się wszelkiej chciwości,' },
    { v: 15, cont: true, text: 'bo nawet gdy ktoś opływa [we wszystko], życie jego nie jest zależne od jego mienia».' },
  ],
  cam: { x: [-80, 20], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const P = plainSet(S, { near: false });
    const c = S.c;
    const heap = P.act.add(`<g>${goodsHeap(c)}</g>`);
    const extra = [0, 1, 2, 3, 4].map((i) => P.act.add(`<g opacity="0">${goodsHeap(c, { w: 120 + i * 10 })}</g>`));
    const broA = S.puppet(P.act.add(person(c, BRO_A)));
    const broB = S.puppet(P.act.add(person(c, BRO_B)));
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });

    const fx = P.fx;
    const seat = P.hangL.add(`<g transform="translate(0 -1500)"><path d="M-70 -2400V-170M70 -2400V-170" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${judgeSeat(c)}</g>`);
    const no = fx.add(`<g opacity="0">${crossX(c, 22)}</g>`);
    const greed = [0, 1].map(() => fx.add(`<g opacity="0">${darkKnot(c, 18)}</g>`));
    const life = fx.add(`<g opacity="0">${soulLight(c, 13)}</g>`);
    const ne = P.hangL.add(`<g transform="translate(0 -1500)">${onString(notEq(c, 34), 22)}</g>`);
    const small = fx.add(`<g opacity="0"><g transform="scale(.5)">${goodsHeap(c)}</g></g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      P.crowd.forEach((g) => g.sp.set({ x: g.x, y: g.y, s: 1, o: g.y > 640 && g.x > 400 && g.x < 800 ? 0 : 1 }));

      /* v13 — "tell my brother to divide the inheritance with me" */
      const come = es(t, 0.02, 0.35);
      const ax = lerp(420, AX, come), bx = lerp(360, BX, es(t, 0.05, 0.4));
      const plead = bump(t, 0.35, 1.0);
      const tug = es(t, 2.1, 2.3);
      const pull = time ? Math.sin(T * 3) * 4 * tug * (1 - es(t, 3.4, 3.6)) : 0;
      broA.set({ x: ax - pull, y: GY, s: 0.96, walk: come > 0 && come < 1 ? ax * 0.05 : undefined, armF: 20 + plead * 70 + tug * 40, armB: 10 + plead * 40 + tug * 30, head: -plead * 8 + tug * 10, lean: -tug * 6, blink: blinkAt(T, 1) });
      broB.set({ x: bx + pull, y: GY + 6, s: 0.96, flip: come >= 1, walk: bx < BX - 1 && t > 0.05 ? bx * 0.05 : undefined, armF: 20 + tug * 40, armB: 10 + bump(t, 0.3, 0.9) * 40 + tug * 20, head: 6 + tug * 8, lean: tug * 6, blink: blinkAt(T, 2) });
      const grow = es(t, 3.15, 3.7);
      pose(heap, { x: HX, y: GY + 10, s: 1 + grow * 0.25, o: seg(t, 0.2, 0.26) });
      extra.forEach((el, i) => {
        const k = es(t, 3.15 + i * 0.08, 3.4 + i * 0.08, ease.back);
        const pos = [[-44, -26], [44, -30], [0, -60], [-30, -92], [30, -98]][i];
        pose(el, { x: HX + pos[0], y: GY + 10 + pos[1], s: k * (0.8 - i * 0.06), o: k > 0.01 ? 1 : 0 });
      });

      /* v14 — "who made me a judge or an arbitrator over you?" */
      const sk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.6, 1.95, ease.in));
      hangAt(seat, 1000, lerp(-1500, 620, sk), T, 1, 0.6);
      const nk = bump(t, 1.35, 1.75);
      pose(no, { x: 1000, y: 520, s: nk, o: nk > 0.02 ? 1 : 0 });
      const palm = bump(t, 1.2, 1.9);
      const warn = es(t, 2.05, 2.25) * (1 - es(t, 3.0, 3.2));
      const open = es(t, 3.2, 3.4);
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, flip: t < 1.05 || (t > 1.95 && t < 3.05), armF: 16 + bump(t, 0.4, 1.0) * 30 + palm * 60 + open * 40, armB: 8 + warn * 120 + open * 30, head: palm * 6 - warn * 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, RISE, P.J.s, false);
      voice(jhx, jhy, palm * 0.7 + warn, T, { spread: 2 });

      /* v15a — beware of all covetousness */
      const [ahx, ahy] = headAt(ax, GY, 0.96, false);
      const [bhx, bhy] = headAt(bx, GY + 6, 0.96, true);
      greed.forEach((el, i) => {
        const k = es(t, 2.2 + i * 0.08, 2.4 + i * 0.08, ease.back) * (1 - es(t, 3.1, 3.3));
        pose(el, { x: (i ? bhx : ahx) + (i ? -6 : 6), y: (i ? bhy : ahy) - 56, s: k, r: time ? T * 20 * (i ? -1 : 1) : 0, o: k > 0.01 ? 1 : 0 });
      });

      /* v15b — his life does not come from what he has */
      const lk = es(t, 3.2, 3.3, ease.back), lu = es(t, 3.3, 3.6);
      pose(life, { x: lerp(ahx, S.portrait ? 610 : 560, lu), y: lerp(ahy - 60, 330, lu) + (time ? Math.sin(T * 2) * 3 : 0), s: lk * (1 + lu * 0.5), o: lk > 0.01 ? 1 : 0 });
      const gu = es(t, 3.35, 3.65);
      pose(small, { x: lerp(HX, S.portrait ? 955 : 1000, gu), y: lerp(GY - 60, 350, gu), s: 0.6 + gu * 0.8, o: gu > 0.01 ? 1 : 0 });
      const ek = es(t, 3.5, 3.75, ease.out);
      hangAt(ne, 780, lerp(-1500, 330, ek), T, 1.4, 0.8);

      S.cam.x = kf(t, [[-0.5, -60], [1.0, -60], [1.3, 0], [1.95, 0], [2.2, -60]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.0, 1.1], [1.3, 1.04], [1.95, 1.04], [2.2, 1.1]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.0, 30], [1.3, 0], [1.95, 0], [2.2, 20], [3.1, 20], [3.4, -30]]);
      if (t > 3.1) S.cam.x = lerp(-60, 0, es(t, 3.1, 3.4));
    };
  },
};
