// Mt 28,6b–7 — "Come, see the place where he lay": inside the tomb (John 20's chamber). The two women stoop in through
// the low doorway, the angel's light behind them; on the ledge the linen lies flat and empty, and a soft light rests
// on it. "Go quickly and tell his disciples": they turn back to the light, and the faces of the Eleven come down on
// their strings. "He has risen from the dead and goes before you into Galilee": the map comes down in their place
// and a light runs ahead along the road from Jerusalem to the lake, the Eleven following. "There you will see him":
// the light waits on a mountain by the lake. "Behold, I have told you": a seal is pressed on the map.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { MAGD, MARYJ, ANGEL, ELEVEN, tombInside, IN, angelPerson, medallion, landMap, MAP, along, headAt, sparkle, seal, voiceRings, PI } from './lib.js';

const MX = 850, MY = 360, MS = 0.82;       // the map
const GAL = [MAP.lake[0] - 52, MAP.lake[1] + 6];   // the mountain by the lake (map coords)

export default {
  id: 'mt28-place',
  beats: [
    { v: 6, cont: true, text: 'Chodźcie, zobaczcie miejsce, gdzie leżał.' },
    { v: 7, text: 'A idźcie szybko i powiedzcie Jego uczniom:' },
    { v: 7, cont: true, text: 'Powstał z martwych i oto udaje się przed wami do Galilei.' },
    { v: 7, cont: true, text: 'Tam Go ujrzycie.' },
    { v: 7, cont: true, text: 'Oto, co wam powiedziałem».' },
  ],
  cam: { x: [-140, 120], y: [-20, 60], z: [0.88, 1.14] },
  build(S) {
    const c = S.c;
    const R = tombInside(S);
    const { FLOOR, DOOR_X, LEDGE } = IN;
    /* the angel's light at the doorway, and the angel himself seen through it */
    const outGlow = R.outside.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);
    const angel = S.puppet(R.outFig.person(angelPerson(c, ANGEL, 'stand')));

    /* the two women */
    const PL = S.layer({ par: 0.52, sh: 5 });
    const W = [MAGD, MARYJ].map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, o))) }));
    const spark = [0, 1, 2].map(() => PL.add(`<g>${sparkle(c, 13)}</g>`));
    const voice = voiceRings(R.outFig, c, { n: 3, color: C.halo, r: 30, w: 5, both: false });

    /* the Eleven, then the map */
    const fx = S.layer({ par: 0.6, sh: 7 });
    const MED = ELEVEN.map((m, i) => {
      const row = i < 6 ? 0 : 1;
      const x = row ? 740 + (i - 6) * 74 : 700 + i * 66, y = row ? 330 : 250;
      return { i, x, y, el: hanging(fx, medallion(c, m.o, { r: i === 0 ? 30 : 25 }), { x: 0, y: -1500, len: 900 }) };
    });
    const mapL = S.layer({ par: 0.62, sh: 8, rise: 0 });
    const mapEl = mapL.add(`<g><path d="M-200 -1400V-${MAP.h / 2}M200 -1400V-${MAP.h / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${landMap(c)}</g>`);
    const roadPts = c.cbez(MAP.road[0], MAP.road[1], MAP.road[3], [GAL[0] - 20, GAL[1] + 20], 40);
    const roadEl = mapL.add(`<path d="${c.line(roadPts)}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="${C.halo}" stroke-width="9" stroke-linecap="round" fill="none"/>`);
    const mount = mapL.add(`<g>${sheet().p(c.cut([[-30, 8], [-6, -26], [4, -30], [30, 8]], 0.4, 4), mix(C.hillNear, C.rock, 0.3)).out()}</g>`);
    const leader = mapL.add(`<g><circle r="46" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.circ(0, 0, 13, 16), 0.3, 3), C.halo).p(c.cut(c.circ(0, 0, 8, 12), 0.2, 3), C.jesusMantle).out()}</g>`);
    const followers = Array.from({ length: 11 }, (_, i) => mapL.add(`<path d="${c.cut(c.circ(0, 0, 5, 8), 0.2, 2)}" fill="${[C.ochre, C.dustyBlue, C.mauve, C.sageRobe, C.roseRobe, C.ochreRobe, C.plumRobe, C.tealRobe, C.linen2, C.lavender, C.clayMantle][i]}"/>`));
    const see = mapL.add(`<g>${sparkle(c, 24)}</g>`);
    const stamp = mapL.add(`<g>${seal(c, 30, C.terracotta)}</g>`);
    mapL.fade(0);

    return (t, time) => {
      /* v6b: come, see the place */
      pose(outGlow, { x: DOOR_X, y: FLOOR - 90, s: 1 + (time ? Math.sin(time * 1.2) * 0.03 : 0) });
      const call = es(t, 0.02, 0.2);
      const toDoor = es(t, 1.05, 1.3);
      angel.set({ x: DOOR_X - 40, y: FLOOR + 30, s: 1.02, armF: 20 + call * 60 * (1 - toDoor * 0.3), armB: 10 + toDoor * 100, head: -2, blink: blinkAt(time, 2) });
      const [ahx, ahy] = headAt(DOOR_X - 40, FLOOR + 30, 1.02, false);
      voice(ahx + 24, ahy, bump(t, 0.02, 0.9) + (es(t, 1.02, 1.2) * (1 - es(t, 4.8, 5))) * 0.8, time, { spread: 1.8, dir: 1 });
      const inK = es(t, 0.05, 0.6, ease.out);
      const turn = seg(t, 1.1, 1.16);
      const go = es(t, 4.3, 4.9);
      W.forEach((w) => {
        const d = w.i * 0.12;
        const e = es(t, 0.05 + d, 0.6 + d, ease.out);
        const x = lerp(DOOR_X - 10, [640, 560][w.i], e) - toDoor * [110, 60][w.i] - go * 120;
        const walking = (e > 0 && e < 1) || (toDoor > 0 && toDoor < 1) || (go > 0 && go < 1);
        w.p.set({ x, y: FLOOR, s: 1.02, flip: turn > 0.5, o: seg(t, d, 0.06 + d), walk: walking ? x * 0.05 + w.i : undefined, amt: 0.8, lean: (1 - e) * 16 + bump(t, 0.45, 1.0) * 6, armF: 22 + bump(t, 0.5, 1.0) * 40 + es(t, 3.2, 3.5) * 20 * (1 - go), armB: 10 + bump(t, 0.55, 1.0) * (w.i ? 90 : 30), head: bump(t, 0.4, 1.0) * 10 - es(t, 1.2, 1.5) * 12 * (1 - go), blink: blinkAt(time, w.seed) });
      });
      const here = es(t, 0.3, 0.7);
      pose(R.linenGlow, { x: IN.LINEN, y: LEDGE.top - 4, o: here * (1 - es(t, 1.9, 2.2) * 0.4), s: 0.8 + here * 0.3 });
      pose(R.headGlow, { x: IN.HEAD, y: LEDGE.top - 4, o: here * 0.8 * (1 - es(t, 1.9, 2.2) * 0.4) });
      spark.forEach((el, i) => { const b = bump(t, 0.4 + i * 0.1, 1.0 + i * 0.1); pose(el, { x: IN.LINEN - 80 + i * 90, y: LEDGE.top - 50 - (i % 2) * 20, s: b, r: time * 30 + i * 40, o: b }); });

      /* v7a: go and tell his disciples */
      MED.forEach((m) => {
        const k = es(t, 1.1 + m.i * 0.035, 1.45 + m.i * 0.035, ease.back) * (1 - es(t, 2.0, 2.2, ease.in));
        swing(m.el, m.x, lerp(-1000, m.y, k), k > 0.001 ? time : 0, 1.3, 0.8, m.i);
      });

      /* v7b: he goes before you into Galilee — the map, a light running ahead on the road */
      const mIn = es(t, 2.05, 2.35, ease.out);
      mapL.shift(0, (1 - mIn) * -1000);
      mapL.fade(mIn > 0.001 ? 1 : 0);
      pose(mapEl, { x: MX, y: MY, s: MS, r: -1 });
      pose(roadEl, { x: MX, y: MY, s: MS, r: -1 });
      attr(roadEl, 'stroke-dashoffset', (1 - es(t, 2.3, 2.85)).toFixed(3));
      const toMap = ([x, y]) => [MX + x * MS, MY + y * MS];
      pose(mount, { x: toMap(GAL)[0], y: toMap(GAL)[1] + 8, s: MS });
      const [lx, ly] = toMap(along(roadPts, es(t, 2.3, 2.9)));
      pose(leader, { x: lx, y: ly - es(t, 3.05, 3.3) * 14, s: 0.9 + es(t, 3.05, 3.3) * 0.3 + (time ? Math.sin(time * 3) * 0.05 : 0), o: seg(t, 2.25, 2.35) });
      followers.forEach((f, i) => {
        const [fx2, fy] = toMap(along(roadPts, Math.max(0, es(t, 2.45, 3.4) - 0.1 - i * 0.012)));
        pose(f, { x: fx2 + ((i % 3) - 1) * 6, y: fy + ((i % 2) * 6 - 3), o: seg(t, 2.45, 2.55) });
      });
      /* v7c: there you will see him */
      const sb = es(t, 3.1, 3.35, ease.back);
      pose(see, { x: lx + 34, y: ly - 44, s: sb * 1.2, r: time * 25, o: sb });
      /* v7d: behold, I have told you — the seal */
      const st = es(t, 4.05, 4.2, ease.in);
      pose(stamp, { x: MX + 210 * MS, y: MY + 150 * MS, s: lerp(2.2, 1, st), r: -12, o: st > 0.01 ? 1 : 0 });

      S.cam.x = S.portrait ? -120 + es(t, 1.9, 2.3) * 60 : lerp(-40, 40, es(t, 0.2, 0.9)) + es(t, 1.9, 2.3) * 40;
      S.cam.y = 30 - es(t, 1.9, 2.3) * 30;
      S.cam.z = (1.04 - es(t, 1.9, 2.3) * 0.04) * (S.portrait ? 0.92 : 1);
    };
  },
};
