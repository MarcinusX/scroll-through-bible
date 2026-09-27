// J 13,21–25 — He is troubled in spirit: His head bows, the lamps sink low, the room darkens around the table.
// "One of you will betray Me" — the Twelve start back. They look at one another, unsure: some turn to their
// neighbours, question marks pop up over the table. The disciple whom Jesus loved is reclining on His breast
// (a warm light around them both, a tag). Simon Peter beckons to him — "Who is it?" — and John, leaning back on
// Jesus' breast, looks up: "Lord, who is it?"
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, beloved, EVE, JX, C, tr, question, speech, GLYPH, nameTag, lightHeart, vignette, kf, headAt, hand, vis, pose, fade, lerp, blinkAt, hanging, PI,
} from './lib.js';

export default {
  id: 'j13-troubled',
  beats: [
    { v: 21, text: 'To powiedziawszy Jezus doznał głębokiego wzruszenia i tak oświadczył:' },
    { v: 21, cont: true, text: '«Zaprawdę, zaprawdę, powiadam wam: Jeden z was Mnie zdradzi».' },
    { v: 22 },
    { v: 23 },
    { v: 24 },
    { v: 25 },
  ],
  cam: { x: [-120, 40], y: [0, 260], z: [1, 2.0] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: EVE });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus, JO = by.john, P = by.peter;
    const B = beloved(S, T0);
    /* the room darkens; a warm light on Him and John */
    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".3"/>`);
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: 780, cy: SEAT - 90, r: 330, col: '#1d1830', o: 0.5 }));
    const fx = S.layer({ par: 0.57, sh: 3 });
    const qs = at.filter((m) => m.k !== 'jesus' && m.k !== 'john').map((m, n) => ({ m, n, el: fx.add(`<g>${question(c)}</g>`) }));
    const love = fx.add(`<g>${lightHeart(c, 16)}</g>`);
    const warm = fx.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    const pAsk = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 50, h: 44, flip: false })}</g>`);
    const jAsk = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 50, h: 44, flip: true })}</g>`);
    const tagL = S.layer({ par: 0.5, sh: 4 });
    const tag = hanging(tagL, nameTag(c, tr(['uczeń, którego', 'Jezus miłował'], ['the disciple', 'whom Jesus loved']), { size: 16 }), { x: 0, y: 0, len: 600 });

    return (t, time) => {
      const T = time;
      const dark = es(t, 0.1, 0.6) * (1 - es(t, 3.05, 3.5) * 0.35);
      T0.idle(t, T, dark * 0.35);
      R.stars.fade(0.6 + dark * 0.3);
      R.sky.blend(EVE, ['#2a2f60', '#4d4a7c', '#7d6a8a'], es(t, 0, 2));
      shadeL.fade(dark * 0.9);
      spotL.fade(es(t, 3.05, 3.4) * 0.9);

      /* b0 — troubled in spirit; b1 — one of you will betray Me */
      const trouble = es(t, 0.1, 0.5);
      const shiver = T ? Math.sin(T * 9) * 0.8 * bump(t, 0.2, 1.0) : 0;
      const say = bump(t, 1.08, 1.9);
      const shock = es(t, 1.35, 1.5) * (1 - es(t, 2.05, 2.3) * 0.6);
      const lean = es(t, 3.05, 3.4);            // John on His breast
      const beckon = es(t, 4.05, 4.25) * (1 - es(t, 4.85, 5.05));
      const ask = es(t, 5.05, 5.3);
      at.forEach((m) => {
        if (m.k === 'jesus') {
          const head = trouble * 16 * (1 - lean * 0.6) - say * 14 + lean * -4 - ask * 4;
          T0.sit(m, T, { armF: 30 + say * 20 + lean * 10, armB: 14 + trouble * 40 * (1 - say) + say * 70 - lean * 30, head, lean: shiver + trouble * 3 - lean * 2 });
          fade(m.sad, trouble);
          return;
        }
        // b2 — they look at one another: every other one turns to his neighbour
        const lookAt = es(t, 2.08, 2.25) * (1 - es(t, 2.9, 3.05));
        const turn = lookAt > 0.5 && (m.i % 2 === 0) && m.k !== 'peter';
        const base = { armF: 36 + shock * 34, armB: 14 + shock * 40, head: -shock * 8 + lookAt * Math.sin(m.i * 1.7) * 8, lean: -shock * 5, flip: turn ? !m.flip : m.flip };
        if (m.k === 'john') {
          const up = ask;
          if (B.set(lean, T, { head: -lean * 8 - up * 18 + bump(t, 4.3, 4.9) * -6, armB: 14 + lean * 10 + up * 20 })) return;
        }
        if (m.k === 'peter') {
          base.armB = 14 + shock * 40 + beckon * (70 + Math.sin(t * PI * 8) * 18);
          base.armF = 36 + shock * 34 + beckon * 20;
          base.lean = -shock * 5 + beckon * 8;
          base.head = base.head + beckon * 6;
        }
        T0.sit(m, T, base);
        fade(m.sad, es(t, 1.45, 1.7) * (m.k === 'judas' ? 0.4 : 1) * (1 - es(t, 5.6, 6) * 0.3));
      });

      /* question marks */
      qs.forEach((q) => {
        const d = Math.abs(q.m.i - 6);
        const k = es(t, 2.1 + d * 0.05, 2.25 + d * 0.05, ease.back) * (1 - es(t, 2.9, 3.05));
        const [hx, hy] = headAt(q.m.x, SEAT, q.m.s, q.m.flip, 62);
        vis(q.el, { x: hx + (q.m.flip ? -6 : 6), y: hy - 52 - (q.m.i % 2) * 14, s: k * 0.8, r: q.m.flip ? 6 : -6, o: k > 0.01 ? 1 : 0 });
      });

      /* b3 — the beloved disciple */
      const [jhx, jhy] = headAt(JX, SEAT, J.s, false, 62);
      vis(warm, { x: 780, y: jhy + 30, s: 0.6 + lean * 0.6, o: lean * 0.45 });
      const hk = bump(t, 3.2, 4.0);
      vis(love, { x: 776, y: jhy - 40 - hk * 20, s: 0.4 + hk * 0.6, o: hk });
      const tk = es(t, 3.25, 3.55, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      vis(tag, { x: 700, y: 420 - (1 - tk) * 600, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: tk > 0.01 ? 1 : 0 });

      /* b4 — Peter: "who is it?"; b5 — John: "Lord, who is it?" */
      const [phx, phy] = headAt(P.x, SEAT, P.s, false, 62);
      const pk = es(t, 4.2, 4.4, ease.back) * (1 - es(t, 4.9, 5.05));
      vis(pAsk, { x: phx + 10, y: phy - 28, s: pk * 0.9, o: pk > 0.01 ? 1 : 0 });
      const jk = es(t, 5.3, 5.5, ease.back);
      vis(jAsk, { x: 772, y: jhy + 16, s: jk * 0.8, o: jk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [2.0, 0], [3.0, 0], [3.4, -30], [4.0, -30], [4.3, -90], [5.0, -90], [5.3, -40]]);
      S.cam.y = kf(t, [[0, 130], [1.0, 170], [2.0, 110], [3.0, 110], [3.4, 220], [4.0, 220], [4.3, 200], [5.0, 200], [5.3, 230]]);
      S.cam.z = kf(t, [[0, 1.25], [1.0, 1.5], [2.0, 1.15], [3.0, 1.15], [3.4, 1.85], [4.0, 1.85], [4.3, 1.6], [5.0, 1.6], [5.3, 1.9]]);
    };
  },
};
