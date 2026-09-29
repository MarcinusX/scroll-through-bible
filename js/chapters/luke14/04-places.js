// Łk 14,6–7 — they could not answer Him: the old lawyer unrolls his scroll of the Law on the table, runs his finger down
// it, and rolls it up again with a shrug; the others look at their plates. Then two late guests hurry in through the
// gateway, their eyes on the two gold bolsters beside the host. Behind the table they race each other for them — one
// slips past the other with an elbow and drops onto the first place at the host's side, the other takes the second,
// with a huff. Jesus watches them choose. And He begins to speak to the guests.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { rulerHouse, rulerTable, RH, LATE, scrollOpen, scrollRolled, puff, question, voiceRings, headAt, hand, kf, moving, popAt } from './lib.js';

export default {
  id: 'lk14-places',
  beats: [
    { v: 6 },
    { v: 7, text: 'Potem opowiedział zaproszonym przypowieść, gdy zauważył, jak sobie pierwsze miejsca wybierali.' },
    { v: 7, cont: true, text: 'Tak mówił do nich:' },
  ],
  cam: { x: [-60, 100], y: [0, 160], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    const R = rulerHouse(S);
    // the late-comers walk behind the seated guests (in front of the bolsters)
    const late = LATE.map((o, i) => ({ i, walk: S.puppet(R.bolL.add(person(c, o))), sit: S.puppet(R.backL.add(person(c, { ...o, pose: 'sit' }))) }));
    const T0 = rulerTable(S, R, { seats: [0, 1, 2, 3] });
    const jSit = S.puppet(R.backL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const roll = R.tableL.add(`<g>${scrollRolled(c, 40)}</g>`);
    const open = R.tableL.add(`<g opacity="0">${scrollOpen(c, 110, 50)}</g>`);
    const q = R.fx.add(`<g opacity="0">${question(c)}</g>`);
    const huff = R.fx.add(`<g opacity="0">${puff(c, 14)}</g>`);
    const voice = voiceRings(R.fx, c, { n: 3, color: C.sun, r: 26, w: 4 });

    return (t, time) => {
      const T = time;
      R.update(T);
      /* v6 — no answer: the lawyer searches the Law and rolls it up again */
      const unroll = es(t, 0.12, 0.3) * (1 - es(t, 0.62, 0.78));
      const shrug = bump(t, 0.7, 1.05);
      pose(roll, { x: 650 + unroll * 0, y: RH.TOP - 18, r: 90, o: unroll < 0.05 ? 1 : 0 });
      pose(open, { x: 650, y: RH.TOP - 26, sx: Math.max(0.15, unroll), sy: 1, o: unroll >= 0.05 ? 1 : 0 });
      popAt(q, t, 0.3, 1.0, 640, 390 + (T ? Math.sin(T * 1.6) * 4 : 0), { d: 0.12, s: 1.2 });
      /* v7a — two late guests race for the places of honour */
      const K0 = [[1.04, 300], [1.2, 520], [1.42, 1000], [1.5, RH.HONOUR[1]]];
      const K1 = [[1.0, 340], [1.2, 600], [1.38, 880], [1.5, RH.HONOUR[0]]];
      const sat0 = es(t, 1.52, 1.56), sat1 = es(t, 1.54, 1.58);
      late.forEach((L, i) => {
        const K = i ? K1 : K0;
        const x = kf(t, K);
        const sat = i ? sat1 : sat0;
        const elbow = i === 0 ? bump(t, 1.22, 1.38) : 0;
        const bumped = i === 1 ? bump(t, 1.26, 1.4) : 0;
        L.walk.set({ x, y: RH.SEAT, s: 0.98, o: seg(t, 1.0 + i * 0.02, 1.06 + i * 0.02) * (1 - sat), walk: moving(t, K) ? x * 0.06 : undefined, amt: 1.1, armF: 30 + elbow * 40, armB: 20 + elbow * 90, lean: 8 + elbow * 6 - bumped * 12, head: -6 - bumped * 10, blink: blinkAt(T, i + 5) });
        const huffK = i === 1 ? bump(t, 1.58, 2.3) : 0;
        L.sit.set({ x: RH.HONOUR[1 - i], y: RH.SEAT, s: 0.98, flip: false, o: sat, armF: 20 + (i ? huffK * 40 : bump(t, 1.56, 1.9) * 50), armB: 10 + (i ? huffK * 50 : 0), head: i ? 10 * huffK - 4 : -6, lean: i ? 0 : -4 * bump(t, 1.56, 1.9), blink: blinkAt(T, i + 5) });
      });
      const [hx1, hy1] = headAt(RH.HONOUR[0], RH.SEAT, 0.98, false, 62);
      popAt(huff, t, 1.6, 2.2, hx1 + 30, hy1 - 20, { d: 0.1, r: T ? T * 20 : 0 });
      /* Jesus: watches them choose, then speaks */
      const follow = es(t, 1.1, 1.3);
      const speak = es(t, 2.08, 2.2);
      jSit.set({ x: RH.JX, y: RH.SEAT, s: 1.02, flip: t < 1.1 ? true : t > 2.05, armF: 30 + speak * 40, armB: 10 + speak * 70, head: 4 - follow * 6 * (1 - speak), blink: blinkAt(T) });
      const [jhx, jhy] = headAt(RH.JX, RH.SEAT, 1.02, t > 2.05, 62);
      voice(jhx, jhy, speak * (1 - es(t, 2.9, 3.0)), T, { spread: 1.8 });
      // the table: bowed after the question; then they all turn to Him
      const listen = es(t, 2.1, 2.3);
      T0.set(t, T, {
        heads: { 0: 14 - listen * 14, 1: 10 + unroll * 14 - listen * 4, 2: 12 - listen * 8, 3: 12 - listen * 6 },
        arms: { 0: [20 + shrug * 50, 10 + shrug * 60], 1: [60 + unroll * 20, 30 + unroll * 30], 2: [20 + shrug * 40, 10 + shrug * 60], 3: [30, 10] },
        hostArmF: 30, hostArmB: 10, hostHead: 6 - bump(t, 1.4, 2.0) * 10,
      });

      S.cam.x = kf(t, [[0, -60], [1.0, -40], [1.2, 0], [1.5, 60], [2.0, 50], [2.3, 0]]);
      S.cam.y = kf(t, [[0, 150], [1.0, 130], [2.3, 120]]);
      S.cam.z = kf(t, [[0, 1.26], [1.0, 1.18], [1.5, 1.24], [2.3, 1.14]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -60], [1.0, -40], [1.3, 60], [2.0, 80], [2.3, 0]]); S.cam.z = 1.0; }
      void hand; void lerp;
    };
  },
};
