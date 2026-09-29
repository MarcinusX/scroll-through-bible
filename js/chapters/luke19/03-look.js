// Łk 19,5–6 — under the sycamore. Jesus comes down the street with the crowd behind Him, stops right beneath the
// tree and looks up into its leaves, straight at the small man sitting in the fork. He calls him by name: "Zacchaeus,
// hurry and come down, for today I must stay at your house." A little "!" jumps over the turban. Down he scrambles —
// slides down the trunk, hurries to Him with his arms wide open and bows, beaming; little hearts rise between them,
// and he sweeps his hand down the street: this way, to my house.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { jerichoSet, JR, FORK, ZACC, ZS, TWELVE, still, folk, say, heart, sparkle, headAt, hand, kf, moving, tr, es, ease, bump, seg, PI } from './lib.js';

const GY = JR.GY, TREE = 1080, TS = 1.1;
const WALK = GY + 22, JX = 880;
const SIT = [TREE + FORK[0] * TS - 4, GY - 14 + FORK[1] * TS + 10];
const ZX = 990;                      // where he stands before Jesus

export default {
  id: 'lk19-look',
  beats: [
    { v: 5, text: 'Gdy Jezus przyszedł na to miejsce, spojrzał w górę i rzekł do niego:' },
    { v: 5, cont: true, text: '«Zacheuszu, zejdź prędko, albowiem dziś muszę się zatrzymać w twoim domu».' },
    { v: 6 },
  ],
  cam: { x: [0, 420], y: [-120, 100], z: [1, 1.44] },
  build(S) {
    const J = jerichoSet(S, { tree: TREE, treeS: TS, sunAt: [1320, 140], seed: 'lk19-jericho-c' });
    const c = S.c;

    /* the crowd behind (one still cut-out), three disciples, Jesus */
    const crowd = J.crowdL.sprite(still(c, Array.from({ length: 10 }, (_, i) => ({ x: -i * 44 - (i % 2) * 12, y: (i % 3) * 7 - 8, s: 0.84 - (i % 3) * 0.03, flip: false, head: -6, armF: (i % 4) * 14, o: folk(c) }))), 560, WALK - 10);
    const DIS = [0, 2, 1].map((k, i) => ({ i, p: S.puppet(J.act.add(person(c, TWELVE[k].o))), dx: -86 - i * 56, dy: (i % 2) * 10 - 10 }));
    const jesus = S.puppet(J.act.add(person(c, CAST.jesus)));
    /* Zacchaeus in the tree, then on the ground */
    const zSit = S.puppet(J.act.add(person(c, { ...ZACC, pose: 'sit' })));
    const zStand = S.puppet(J.act.add(person(c, ZACC)));
    J.treeFront(J.fx);
    const call = J.fx.add(`<g>${say(c, tr(['Zacheuszu, zejdź prędko,', 'albowiem dziś muszę się zatrzymać', 'w twoim domu!'], ['Zacchaeus, hurry', 'and come down, for today', 'I must stay at your house!']), { size: 19, side: -1 })}</g>`);
    const bang = J.fx.add(`<g>${sparkle(c, 12)}</g>`);
    const hearts = [0, 1, 2].map((i) => J.fx.add(`<g>${heart(c, 11 + i * 2, [C.jesusMantle, C.curtain, C.apricot][i])}</g>`));
    const glad = [0, 1, 2, 3].map(() => J.fx.add(`<g>${sparkle(c, 8)}</g>`));

    return (t, time) => {
      const T = time;
      J.update(T);
      /* v5a — He comes to the place, and looks up */
      const JK = [[-0.5, 600], [0.55, JX]];
      const jx = kf(t, JK, ease.out);
      const walking = t < 0.55;
      const up = es(t, 0.55, 0.8);
      const callK = es(t, 1.05, 1.2) * (1 - es(t, 1.95, 2.05));
      const welcome = es(t, 2.5, 2.7);
      jesus.set({ x: jx, y: WALK, s: 1.02, walk: walking ? jx * 0.05 : undefined, armF: 14 + callK * 70 + welcome * 40, armB: callK * 120 * (1 - welcome), head: -up * 18 * (1 - es(t, 2.3, 2.5)) + welcome * 4, blink: blinkAt(T) });
      DIS.forEach((d) => { const x = jx + d.dx; d.p.set({ x, y: WALK + d.dy, s: 0.9, walk: walking ? x * 0.05 + d.i : undefined, head: -up * 10, armF: bump(t, 2.5, 3) * 30, blink: blinkAt(T, d.i + 2) }); });
      crowd.set({ x: lerp(360, 560, es(t, -0.5, 0.6, ease.out)), y: WALK - 10 });

      /* v6 — he hurries down and receives Him with joy */
      const down = es(t, 2.04, 2.28);
      const onGround = es(t, 2.02, 2.06);
      const toHim = es(t, 2.28, 2.5);
      const zx = lerp(TREE - 34, ZX, toHim);
      const zy = lerp(SIT[1] + 30, GY + 22, down);
      const bow = bump(t, 2.52, 2.85);
      const lead = es(t, 2.82, 2.95);
      zSit.set({ x: SIT[0], y: SIT[1], s: ZS, flip: true, o: 1 - onGround, armF: 40 + up * 30 + bump(t, 1.2, 1.5) * 50, armB: 20 + bump(t, 1.2, 1.5) * 90, head: -6 + up * 10, lean: -up * 8, blink: blinkAt(T, 3) });
      zStand.set({ x: zx, y: zy, s: ZS, flip: lead < 0.5, o: onGround, walk: toHim > 0 && toHim < 1 ? zx * 0.1 : undefined, amt: 1.2,
        armF: down < 1 ? 150 : 50 + bump(t, 2.45, 2.85) * 60 + lead * 30, armB: down < 1 ? 160 : 60 + bump(t, 2.45, 2.85) * 90 + lead * 60, lean: -bow * 18 * (1 - lead), head: 6 * bow, blink: blinkAt(T, 3) });

      const [jhx, jhy] = headAt(jx, WALK, 1.02, false);
      pose(call, { x: jhx - 4, y: jhy - 30, s: callK, o: callK > 0.02 ? 1 : 0 });
      const [zhx, zhy] = headAt(SIT[0], SIT[1], ZS, true, 62);
      const bk = bump(t, 1.25, 1.75);
      pose(bang, { x: zhx + 6, y: zhy - 44, s: bk * 1.6, r: T * 40, o: bk > 0.02 ? 1 : 0 });
      hearts.forEach((h, i) => { const k = seg(t, 2.55 + i * 0.1, 2.98 + i * 0.1); pose(h, { x: lerp(ZX - 40, jx + 30 + i * 30, 0.5) + Math.sin(k * PI * 2 + i) * 10, y: WALK - 170 - k * 90 - i * 10, s: Math.sin(Math.min(1, k * 1.4) * PI * 0.5), o: k > 0 && k < 1 ? 1 - Math.pow(k, 4) : 0 }); });
      glad.forEach((g, i) => { const k = bump(t, 2.5 + i * 0.06, 2.95 + i * 0.06); const [zhx2, zhy2] = headAt(ZX, GY + 22, ZS, true); pose(g, { x: zhx2 + Math.cos(i * 1.7) * 44, y: zhy2 + Math.sin(i * 1.7) * 36, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });

      S.cam.x = kf(t, [[-0.5, 150], [0.55, 260], [1.0, 300], [2.0, 300], [2.4, 260]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.6, -60], [1.2, -90], [2.0, -90], [2.45, 90]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.6, 1.12], [1.2, 1.22], [2.0, 1.2], [2.45, 1.44]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 150], [0.55, 300], [2.0, 330], [2.4, 280]]); S.cam.z = 1.0; }
      void moving; void hand;
    };
  },
};
