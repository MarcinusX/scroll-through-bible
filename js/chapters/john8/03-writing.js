// J 8,6–8 — it is a snare: a net comes down over the accusers, who trade sly looks. Jesus bends down and writes
// with His finger on the ground — small unreadable marks in the dust that glow faintly. They keep asking ("?" after
// "?"); He straightens: "Let him who is without sin cast the first stone" — the words go out over the row and
// each one looks down at the stone in his own hand. He bends down again and goes on writing.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { trialSet, CT, voiceRings, question, snare, writeMarks, hanging, swing, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j8-writing',
  beats: [
    { v: 6, text: 'Mówili to wystawiając Go na próbę, aby mieli o co Go oskarżyć.' },
    { v: 6, cont: true, text: 'Lecz Jezus nachyliwszy się pisał palcem po ziemi.' },
    { v: 7, text: 'A kiedy w dalszym ciągu Go pytali, podniósł się i rzekł do nich:' },
    { v: 7, cont: true, text: '«Kto z was jest bez grzechu, niech pierwszy rzuci na nią kamień».' },
    { v: 8 },
  ],
  cam: { x: [-40, 120], y: [-40, 150], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const set = set0(S);
    const K = set.cast;
    const net = set.fx.add(`<g>${snare(c, 190, 120)}</g>`);
    const qs = [0, 1, 2, 3].map((i) => set.fx.add(`<g>${question(c)}</g>`));
    const rings = voiceRings(set.fx, c, { n: 4, r: 40, w: 6, both: false, color: shade(C.halo, -0.05) });
    const sweep = set.glowL.add(`<g><ellipse rx="160" ry="260" fill="url(#halo-glow)"/></g>`);
    const markGlow = set.glowL.add(`<g><ellipse rx="130" ry="40" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T);
      K.crowd.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, head: -6 + es(t, 1.2, 1.5) * 8 * (1 - es(t, 2.5, 2.8)), blink: blinkAt(T, m.seed) }));
      /* v6a — a test, a snare */
      const nk = es(t, 0.1, 0.5, ease.out) * (1 - es(t, 1.0, 1.3, ease.in));
      swing(net, 1090, 300 - (1 - nk) * 700, nk > 0.001 ? T : 0, 1.4, 0.8);
      fade(net, nk > 0.001 ? 1 : 0);
      const sly = bump(t, 0.2, 0.95);
      /* v6b — He bends down and writes; v7a — they keep asking, He straightens; v8 — bends again */
      const bend1 = es(t, 1.08, 1.16) * (1 - es(t, 2.52, 2.59));
      const bend2 = es(t, 4.1, 4.17);
      const bend = Math.max(bend1, bend2);
      const sitK = 1 - es(t, 1.08, 1.16);
      const stand = t > 2 ? 1 - bend : 0;
      const write1 = seg(t, 1.3, 1.95), write2 = seg(t, 4.3, 4.95);
      const writing = (write1 > 0 && write1 < 1) || (write2 > 0 && write2 < 1);
      const scrib = writing && T ? Math.sin(T * 9) * 6 : 0;
      const open = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.1));
      const armF = bend > 0.5 ? 28 + scrib : 18 + open * 22 + bump(t, 2.6, 3.0) * 20;
      const lean = bend > 0.5 ? 20 : 0;
      K.jesus(T, { sit: sitK, bend, stand, armF, armB: bend > 0.5 ? 12 : 10 + open * 110, head: bend > 0.5 ? 18 : -2, lean });
      const [fx, fy] = K.finger(28, 20);
      pose(K.marks, { x: fx - 16, y: CT.FLOOR + 16, s: 1 });
      writeMarks(K.marks, Math.max(write1, t > 2 ? 1 : 0) * 1, 1);
      pose(K.marks2, { x: fx + 4, y: CT.FLOOR + 34, s: 1 });
      writeMarks(K.marks2, write2, 1);
      vis(markGlow, { x: fx + 30, y: CT.FLOOR + 22, s: 1, o: Math.max(es(t, 1.3, 1.6), 0) * (0.7 + (T ? Math.sin(T * 1.6) * 0.1 : 0)) });

      /* the woman waits, head bowed */
      K.woman.set({ x: CT.WX, y: CT.FLOOR + 4, s: 1, flip: true, armF: 36, armB: 40, head: 18 - bump(t, 3.1, 4.0) * 6, lean: 4, blink: blinkAt(T, 7) });
      K.womanFree.set({ x: CT.WX, y: CT.FLOOR + 4, o: 0 });
      fade(K.wSad, 1); fade(K.wSmile, 0); fade(K.wDown, 1); fade(K.wTear, es(t, 0.3, 0.6) * (1 - es(t, 3.3, 3.8)));

      /* the accusers: sly looks, questions, then each looks at his own stone */
      const ask = es(t, 2.0, 2.3) * (1 - es(t, 2.7, 2.9));
      const self = es(t, 3.35, 3.8);
      K.acc.forEach((a) => {
        const lookSide = a.i % 2 ? -1 : 1;
        const askA = bump(t, 2.0 + a.i * 0.08, 2.5 + a.i * 0.08);
        const peek = es(t, 1.3, 1.6) * (1 - es(t, 1.95, 2.05)) + es(t, 4.35, 4.7);
        K.accuser(a, T, {
          flip: sly * lookSide > 0.4 ? false : true,
          armF: 56 - self * 26 + askA * 20, armB: 10 + askA * 70, head: -2 + peek * 14 + self * 16 - askA * 6, lean: peek * 4 + self * 3,
          angry: 1 - self * 0.85, drop: 0, grip: 1,
        });
      });
      qs.forEach((q, i) => {
        const a = K.acc[i];
        const k = es(t, 2.0 + i * 0.12, 2.2 + i * 0.12, ease.back) * (1 - es(t, 2.7, 2.85));
        vis(q, { x: a.x - 20, y: a.y - 250 - i * 6, s: k, r: Math.sin(T * 2 + i) * 6, o: k > 0.01 ? 1 : 0 });
      });
      /* v7b — the word goes out over them; a quiet light passes along the row */
      rings(CT.JX + 30, CT.FLOOR - 160, es(t, 3.0, 3.15) * (1 - es(t, 3.85, 4.0)), T, { dir: 1, s0: 0.8, spread: 2.2 });
      const sw = seg(t, 3.15, 3.95);
      vis(sweep, { x: lerp(950, 1260, sw), y: CT.FLOOR - 120, s: 1, o: Math.sin(sw * PI) * 0.9 });

      S.cam.x = kf(t, [[0, 40], [0.9, 80], [1.2, 10], [2.0, 20], [2.4, 60], [3.0, 60], [3.3, 90], [3.9, 90], [4.2, 20]]);
      S.cam.y = kf(t, [[0, 0], [0.9, -20], [1.3, 130], [2.0, 130], [2.4, 0], [4.2, 0], [4.5, 130]]);
      S.cam.z = kf(t, [[0, 1.12], [0.9, 1.12], [1.3, 1.46], [2.0, 1.46], [2.4, 1.14], [3.3, 1.18], [3.9, 1.2], [4.2, 1.14], [4.6, 1.42]]);
    };
  },
};

function set0(S) { return trialSet(S); }
