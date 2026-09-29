// Łk 19,3–4 — further along the street the townspeople stand shoulder to shoulder, all turned towards the gate where
// Jesus is coming in with His followers. Zacchaeus, at the end of the row, reaches only to their shoulders: he rises on
// his toes, hops, ducks to peer between them — a little "?" over his turban — and sees nothing but backs and mantles.
// So he runs ahead down the street to the great sycamore-fig by the road, hitches up his mantle, clambers up the
// trunk and settles in the fork of its limbs, among the leaves, looking back up the road: that is the way He will pass.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { jerichoSet, JR, FORK, ZACC, ZS, TWELVE, still, folk, question, headAt, kf, moving, es, ease, bump, seg, PI } from './lib.js';

const GY = JR.GY, TREE = 1480, TS = 1.1;
const ROW = GY + 26;                 // the watchers' feet
const ZY = GY + 6;                   // Zacchaeus behind them
const SIT = [TREE + FORK[0] * TS - 4, GY - 14 + FORK[1] * TS + 10];

export default {
  id: 'lk19-sycamore',
  beats: [
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [280, 1340], y: [-160, 60], z: [1, 1.5] },
  build(S) {
    const J = jerichoSet(S, { tree: TREE, treeS: TS, sunAt: [1300, 130], seed: 'lk19-jericho-b' });
    const c = S.c;

    /* the procession far up the street (left): Jesus, disciples, the crowd */
    const procL = S.layer({ par: 0.4, sh: 4 });
    const proc = procL.sprite(still(c, [
      ...Array.from({ length: 7 }, (_, i) => ({ x: -120 - i * 40, y: (i % 2) * 8, s: 0.72, o: folk(c) })),
      { x: -60, y: 4, s: 0.74, o: TWELVE[0].o }, { x: -90, y: -4, s: 0.72, o: TWELVE[2].o },
      { x: 0, y: 6, s: 0.8, o: CAST.jesus },
    ]), 560, GY - 8);

    /* Zacchaeus: on the street (stand), climbing (arms up), sitting in the fork */
    const zStand = S.puppet(J.act.add(person(c, ZACC)));
    const zSit = S.puppet(J.act.add(person(c, { ...ZACC, pose: 'sit' })));
    const q = J.act.add(`<g>${question(c)}</g>`);
    J.treeFront(J.fx);

    /* the watchers, shoulder to shoulder, all turned towards the gate (one cut-out, still) */
    const rowL = S.layer({ par: 0.5, sh: 5 });
    const RX = [800, 860, 926, 982, 1046, 1102, 1164];
    const row = rowL.sprite(still(c, RX.map((x, i) => ({ x: x - 980, y: (i % 2) * 6, s: 0.98 + (i % 3) * 0.03, flip: true, head: -4, armF: (i % 3) * 12, o: folk(c, i % 3 !== 1) }))), 980, ROW);

    return (t, time) => {
      const T = time;
      J.update(T);
      proc.set({ x: lerp(440, 700, es(t, 0, 2, (x) => x)), y: GY - 8 });
      row.set({ x: 980, y: ROW });

      /* v3 — he cannot see for the crowd: he is too short */
      const peek = [[0, 1230], [0.25, 1230], [0.45, 1150], [0.65, 1070], [0.85, 1210], [1.0, 1230]];
      const px = kf(t, peek);
      const hop = t < 1 ? Math.abs(Math.sin(seg(t, 0.12, 0.98) * PI * 5)) * 42 * (t > 0.12 && t < 0.98 ? 1 : 0) : 0;
      /* v4 — he runs ahead and climbs the sycamore */
      const RUN = [[1.0, 1230], [1.3, TREE - 40]];
      const rx = kf(t, RUN);
      const climb = es(t, 1.3, 1.56);
      const sat = es(t, 1.56, 1.6);
      const x = t < 1.3 ? (t < 1 ? px : rx) : lerp(TREE - 40, SIT[0] - 10, climb);
      const y = t < 1.3 ? ZY - hop : lerp(ZY, SIT[1] + 40, climb);
      const running = (t > 1.0 && t < 1.3) || (t > 0.25 && t < 0.85 && hop < 4);
      zStand.set({ x, y, s: ZS, flip: t < 1 ? true : climb > 0 ? false : false, o: 1 - sat, walk: running ? x * 0.09 : undefined, amt: 1.3,
        armF: t < 1 ? 20 + hop * 1.2 : 20 + climb * 140, armB: t < 1 ? 10 + hop * 2 : 10 + climb * 150, head: t < 1 ? -10 - hop * 0.2 : -climb * 12, lean: t > 1.0 && t < 1.3 ? 8 : 0, blink: blinkAt(T, 3) });
      zSit.set({ x: SIT[0], y: SIT[1], s: ZS, flip: true, o: sat, armF: 40 + es(t, 1.8, 2.0) * 50, armB: 20, head: -6 + es(t, 1.8, 2.0) * -6, blink: blinkAt(T, 3) });
      const [qx, qy] = headAt(px, ZY - hop, ZS, true);
      const qk = es(t, 0.3, 0.42, ease.back) * (1 - es(t, 0.95, 1.02));
      pose(q, { x: qx - 30, y: qy - 50, s: qk * 0.9, r: -8, o: qk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 300], [0.9, 380], [1.3, 1000], [1.8, 1260]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.9, 40], [1.4, -80], [1.9, -150]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.9, 1.2], [1.4, 1.2], [1.9, 1.5]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 500], [0.9, 640], [1.3, 1100], [1.8, 1320]]); S.cam.z = kf(t, [[1.4, 1.0], [1.9, 1.3]]); }
      void moving; void C;
    };
  },
};
