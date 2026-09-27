// J 8,2b–5 — the Temple court in the morning: the people gather and Jesus sits down to teach them. Then the
// scribes and Pharisees push a veiled woman into the middle, the eldest calls Him "Teacher" and points at her;
// the tablets of the Law come down on their strings and the stones come up in their hands (held, never thrown);
// they all turn to Him — a great "?" hangs between them.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { trialSet, CT, voiceRings, bubble, question, lawTablets, plateR, strip, hanging, swing, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j8-accused',
  beats: [
    { v: 2, cont: true, text: 'Cały lud schodził się do Niego, a On usiadłszy nauczał ich.' },
    { v: 3 },
    { v: 4 },
    { v: 5, text: 'W Prawie Mojżesz nakazał nam takie kamienować.' },
    { v: 5, cont: true, text: 'A Ty co mówisz?»' },
  ],
  cam: { x: [-40, 140], y: [-40, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = trialSet(S);
    const K = set.cast;
    const rings = voiceRings(set.fx, c, { n: 3, r: 34, w: 5, both: false });
    const says = set.fx.add(`<g>${bubble(c, tr('Nauczycielu!', 'Teacher!'), { size: 22, tail: 1 })}</g>`);
    const law = hanging(set.fx, `${plateR(S, `<g transform="translate(0 44)">${lawTablets(c, { w: 42, h: 70 })}</g>`, { r: 70, bg: C.parchment, rim: C.wood3, k: 'law' })}<g transform="translate(0 96)">${strip(c, tr('Prawo Mojżesza', 'the Law of Moses'), { size: 16 })}</g>`, { x: 1060, y: 250, len: 700 });
    const q = set.fx.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v2b — the people come, He sits and teaches */
      K.crowd.forEach((m) => {
        const k = es(t, 0.02 + m.i * 0.035, 0.42 + m.i * 0.035, ease.out);
        const turn = es(t, 1.2, 1.5) * (m.ri === 0 ? 1 : 0);
        if (m.ri === 0) m.p.set({ x: lerp(m.x - 380, m.x, k), y: m.y, s: m.s, walk: k > 0 && k < 1 ? m.x * 0.05 + k * 20 : undefined, head: -turn * 4, blink: blinkAt(T, m.seed) });
        else m.p.set({ x: m.x, y: m.y + (1 - k) * 30, s: m.s, o: k, head: -4 + bump(t, 0.5, 1.0) * -4 + es(t, 4.1, 4.4) * -6, blink: blinkAt(T, m.seed) });
      });
      const sit = es(t, 0.28, 0.35);
      const talk = (t > 0.4 && t < 1.2 ? 1 : 0);
      const teach = Math.max(bump(t, 0.4, 0.75), bump(t, 0.7, 1.05)) * (1 - es(t, 1.2, 1.4));
      const lookAt = es(t, 1.45, 1.75);
      K.jesus(T, {
        stand: 1 - sit, sit, x: lerp(600, CT.JX, es(t, 0.0, 0.28)), walk: t < 0.28 ? t * 30 : undefined, flip: t > 0.33 && t < 1.25,
        armF: 16 + teach * 60 + es(t, 4.2, 4.6) * 0, armB: 10 + teach * 30, head: -lookAt * 2 + es(t, 4.4, 4.8) * 10,
      });
      rings(CT.JX - 20, CT.FLOOR - 160, talk * (1 - es(t, 1.1, 1.2)), T, { dir: -1, s0: 0.7, spread: 1.8 });

      /* v3 — they bring the woman and set her in the middle */
      const wIn = es(t, 1.0, 1.55, ease.out);
      const wx = lerp(CT.WX + 420, CT.WX, wIn);
      const hide = es(t, 2.15, 2.4) * (1 - es(t, 3.3, 3.6) * 0.5);
      K.woman.set({
        x: wx, y: CT.FLOOR + 4, s: 1, flip: true, walk: wIn > 0 && wIn < 1 ? wx * 0.05 : undefined,
        armF: 24 + hide * 14, armB: 20 + hide * 22, head: 10 + hide * 10 + es(t, 4.1, 4.4) * -4, lean: 2 + hide * 3, blink: blinkAt(T, 7),
      });
      K.womanFree.set({ x: wx, y: CT.FLOOR + 4, o: 0 });
      fade(K.wSad, es(t, 1.6, 1.9));
      fade(K.wSmile, 0);
      fade(K.wDown, 1);
      fade(K.wTear, 0);
      const raise = es(t, 3.05, 3.4);
      K.acc.forEach((a) => {
        const k = es(t, 1.05 + a.i * 0.06, 1.6 + a.i * 0.06, ease.out);
        const x = lerp(a.x + 460, a.x, k);
        const eldest = a.i === 0;
        const point = eldest ? Math.max(es(t, 1.65, 1.85) * (1 - es(t, 1.95, 2.05)) * 0.6, bump(t, 2.05, 2.95)) : 0;
        const toJ = es(t, 4.05, 4.35);
        a.accuserSet = true;
        K.accuser(a, T, {
          x, flip: true, walk: k > 0 && k < 1 ? x * 0.05 : undefined,
          armF: 26 + raise * 30 + (eldest ? point * 70 : 0) + toJ * (a.i % 2 ? 10 : 0), armB: 10 + (eldest ? point * 40 : 0) + (a.i === 1 ? bump(t, 4.05, 4.95) * 80 : 0),
          head: -2 + toJ * -4, lean: (eldest ? point * 4 : 0), angry: es(t, 2.4 + a.i * 0.05, 2.7 + a.i * 0.05), drop: 0, grip: 1,
        });
      });

      /* v4 — "Teacher!" */
      const sk = es(t, 2.08, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(says, { x: 970, y: 470, s: sk, o: sk > 0.01 ? 1 : 0 });
      /* v5a — the Law of Moses, the stones come up */
      const lk = es(t, 3.0, 3.4, ease.out) * (1 - es(t, 4.1, 4.4, ease.in));
      swing(law, 1060, 250 - (1 - lk) * 700, lk > 0.001 ? T : 0, 1, 0.7);
      fade(law, lk > 0.001 ? 1 : 0);
      /* v5b — "And what do You say?" */
      const qk = es(t, 4.1, 4.35, ease.back);
      vis(q, { x: 860 + Math.sin(T * 1.4) * 3, y: 440, s: qk * 1.7, r: Math.sin(T * 1.1) * 4, o: qk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -40], [0.8, -30], [1.3, 60], [2.0, 70], [3.0, 60], [3.4, 70], [4.2, 30]]);
      S.cam.y = kf(t, [[0, 20], [1.3, 10], [3.0, 0], [3.4, -30], [4.2, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [0.8, 1.1], [1.3, 1.06], [2.1, 1.14], [3.0, 1.12], [3.4, 1.04], [4.2, 1.1]]);
    };
  },
};
