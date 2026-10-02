// Mt 12,27–28 — back in the square. "By whom do your sons cast them out?": to the right, two young men of the
// Pharisees' own families pray over a kneeling man, and a little dark spirit slips out of him and away. Jesus turns
// His open hand to the fathers — a question mark hangs over them. "Therefore they will be your judges": the two sons
// step up and face their fathers, arms folded, a small pair of scales over their heads, and the fathers lean back.
// "But if I cast them out by the Spirit of God, the Kingdom of God has come upon you": the dove comes down over
// Jesus, dark spirits scatter out of the square, the sky turns gold and the town gate behind Him fills with light.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { squareSet, SQ, JUDGE, manOf, headAt, handAt, kf, spirit, dove1, flapWings, qMark, scalesParts, poseScales, rayBurst, sparkle, glow, tr, PI } from './lib.js';

const F = SQ.FEET;

export default {
  id: 'mt12-sons',
  beats: [
    { v: 27, text: 'I jeśli Ja przez Belzebuba wyrzucam złe duchy, to przez kogo je wyrzucają wasi synowie?' },
    { v: 27, cont: true, text: 'Dlatego oni będą waszymi sędziami.' },
    { v: 28 },
  ],
  cam: { x: [-30, 60], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const Q = squareSet(S, { sky2: JUDGE, dis: ['peter', 'john'] });
    const c = Q.c;
    const act = Q.act;
    const SONS = [
      { robe: C.linen, mantle: C.skyVeil, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'none', skin: C.skin2, belt: C.leather },
      { robe: C.stone, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.tealRobe, beard: 'short', skin: C.skin, belt: C.leather },
    ].map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))) }));
    const kneelO = manOf(c, { robe: C.stone2, skin: C.skin3, hairStyle: 'wild', beard: 'short', hair: C.hair3 });
    const kneeler = S.puppet(act.add(person(c, { ...kneelO, pose: 'kneel' })));
    const imp = act.add(`<g>${spirit(c, 1.1, '#3d3346')}</g>`);
    const imps = [0, 1, 2, 3, 4].map((i) => act.add(`<g opacity="0">${spirit(c, 0.9 + (i % 2) * 0.3)}</g>`));
    const doveEl = act.add(dove1(c));
    const rays = act.add(`<g opacity="0">${rayBurst(c, { n: 18, r0: 40, r1: 360, spread: 0.045, color: '#fff3cf', o: 0.5 })}</g>`);
    const fx = S.layer({ par: 0.2, sh: 6 });
    const q = hanging(fx, `<g transform="scale(1.1)">${qMark(c, 60)}</g>`, { x: 1070, y: -300, len: 900 });
    const sc = scalesParts(c, { arm: 60, drop: 44 });
    const scl = { frame: fx.add(`<g>${sc.frame}</g>`), beam: fx.add(`<g>${sc.beam}</g>`), panL: fx.add(`<g>${sc.pan}</g>`), panR: fx.add(`<g>${sc.pan}</g>`) };
    const sp = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const SX = [606, 676];

    return (t, time) => {
      const T = time;
      /* the sons' deliverance of a man (v27a), then they turn to judge their fathers (v27b) */
      const out = es(t, 0.3, 0.85, ease.in);
      const turn = es(t, 1.05, 1.15);
      const up = es(t, 1.1, 1.4);
      const gold = es(t, 2.2, 2.6);
      Q.sk2.layer.fade(gold);
      pose(Q.gateLight, { o: es(t, 2.35, 2.65) });
      const lean = es(t, 1.3, 1.55);
      Q.pose(t, T,
        { flip: false, armF: 16 + es(t, 0.05, 0.25) * 60 * (1 - es(t, 1.9, 2.1)) + gold * 40, armB: 8 + es(t, 0.1, 0.3) * 30 * (1 - es(t, 1.9, 2.1)) + gold * 60, head: -2 - gold * 6, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x - 130, y: F - 30, s: 0.86, armF: 10 + gold * 50, armB: 6 + gold * (d.i ? 120 : 30), head: -2 - gold * 8, blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x, armF: 8 + lean * 30, armB: lean * 20, head: lean * 6, lean: -lean * 6, blink: Math.max(lean * 0.4, blinkAt(T, m.seed)) }));
      SONS.forEach((sn) => {
        const x = SX[sn.i] + up * 10;
        sn.p.set({ x, y: F + 24 - up * 8, s: 0.94, flip: turn < 0.5, armF: turn < 0.5 ? 60 + Math.sin(T * 1.5 + sn.i) * 0 : 34 + up * 40, armB: turn < 0.5 ? 70 : 20 + up * 40, head: turn < 0.5 ? 10 : -4, blink: blinkAt(T, 3 + sn.i) });
      });
      kneeler.set({ x: 520, y: F + 50, s: 0.9, flip: false, o: 1 - es(t, 1.0, 1.1), armF: 50 + out * 40, armB: 30 + out * 90, head: 12 - out * 18, blink: blinkAt(T, 5) });
      const [khx, khy] = headAt(520, F + 50, 0.9, false, 'kneel');
      pose(imp, { x: lerp(khx + 10, khx - 260, out), y: lerp(khy + 20, khy - 240, out), r: out * 120, s: 1 - out * 0.4, o: 1 - es(t, 0.85, 0.98) });
      const qd = es(t, 0.3, 0.6, ease.back) * (1 - es(t, 1.0, 1.2));
      pose(q, { x: S.portrait ? 1010 : 1070, y: lerp(-300, 330, qd), r: Math.sin(T * 1.1) * 1.2, oy: 0, o: qd > 0.01 ? 1 : 0 });
      const sd = es(t, 1.25, 1.55, ease.back) * (1 - es(t, 1.95, 2.2));
      poseScales(scl, 640, lerp(-300, 330, sd), Math.sin(T * 0.8) * 1.5, sd > 0.01 ? 1 : 0, 1, 60);

      /* v28 — the dove; the spirits flee; the Kingdom's light in the gate */
      const dv = es(t, 2.02, 2.45);
      const [jhx, jhy] = headAt(SQ.JX, F - 14, 1.04, false);
      pose(doveEl, { x: lerp(SQ.JX + 300, SQ.JX + 4, dv), y: lerp(100, jhy - 70, dv) - Math.sin(dv * PI) * 40, s: 0.9, sx: -1, o: dv > 0.001 ? 1 : 0 });
      flapWings(doveEl, time ? T : 0.3, dv < 1 ? 34 : 14, dv < 1 ? 7 : 2.4);
      pose(rays, { x: SQ.JX, y: jhy, s: 0.6 + gold * 0.6, r: T * 3, o: gold * 0.9 });
      imps.forEach((im, i) => {
        const k = es(t, 2.25 + i * 0.04, 2.7 + i * 0.04, ease.in);
        const a = -PI * (0.15 + i * 0.17);
        pose(im, { x: SQ.JX + Math.cos(a) * (140 + k * 700) * (i % 2 ? -1 : 1), y: 560 + Math.sin(a) * (60 + k * 300), r: k * 200, o: bump(t, 2.15 + i * 0.04, 2.75 + i * 0.04) });
      });
      sp.forEach((s_, i) => {
        const k = es(t, 2.5 + i * 0.06, 2.7 + i * 0.06, ease.back);
        pose(s_, { x: SQ.JX - 60 + i * 60, y: 450 - (i % 2) * 30, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [0.1, -10], [1.9, -10], [2.2, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.1, 1.1], [1.9, 1.1], [2.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.1, 44], [1.9, 44], [2.2, 20]]);
    };
  },
};
