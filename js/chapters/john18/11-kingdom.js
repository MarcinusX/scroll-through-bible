// J 18,33–36 — Pilate goes back into the praetorium and calls Jesus to him: "Are You the King of the Jews?" — a paper
// crown with a question hangs between them. "Do you say this by yourself, or did others tell you about Me?" — the
// murmur of the leaders outside comes in through the door in rings. "Am I a Jew?" (a hand on his own toga) — "Your
// own nation and the chief priests delivered You to me" (a point at the door) — "What have You done?". "My Kingdom is
// not of this world": the dim hall opens on a vision — the paper world hangs low, and high above it, not touching it, a
// kingdom of light. "If it were of this world, My servants would fight": a row of ghostly paper soldiers with swords
// rises in outline… and does not come; they fold away. "But now My Kingdom is not from here": the light lifts away
// upwards and the world stays below; only His halo keeps its glow.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  praetorium, praetoriumCast, PR, bandSil, say, question, nameTag, paperCrown, globe, lightCrown, radiance, rayBurst, voiceRings, shadowPerson, sword, lampSet, hanging, vis, kf,
  moving, headAt, hand, pose, fade, lerp, mix, shade, sheet, tr, blinkAt, C, PI, DAWN, MORNING,
} from './lib.js';

const { FLOOR, DOOR, JX } = PR;
const PXI = 1110;

export default {
  id: 'j18-kingdom',
  beats: [
    { v: 33, text: 'Wtedy powtórnie wszedł Piłat do pretorium,' },
    { v: 33, cont: true, text: 'a przywoławszy Jezusa rzekł do Niego: «Czy Ty jesteś Królem Żydowskim?»' },
    { v: 34 },
    { v: 35, text: 'Piłat odparł: «Czy ja jestem Żydem?' },
    { v: 35, cont: true, text: 'Naród Twój i arcykapłani wydali mi Ciebie.' },
    { v: 35, cont: true, text: 'Coś uczynił?»' },
    { v: 36, text: 'Odpowiedział Jezus: «Królestwo moje nie jest z tego świata.' },
    { v: 36, cont: true, text: 'Gdyby królestwo moje było z tego świata, słudzy moi biliby się, abym nie został wydany Żydom.' },
    { v: 36, cont: true, text: 'Teraz zaś królestwo moje nie jest stąd».' },
  ],
  cam: { x: [-260, 420], y: [-160, 60], z: [1, 1.36] },
  build(S) {
    const c = S.c;
    const R = praetorium(S, { skyCols: DAWN });
    // the vision's darkness sits behind the people
    const dimL = S.layer({ par: PR.P, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1f1b36" opacity=".55"/>`);
    const visL = S.layer({ par: PR.P, sh: 4 });
    const world = hanging(visL, `<circle r="110" fill="url(#halo-glow)" opacity=".3"/>${globe(c, 54)}`, { x: 0, y: 0, len: 900 });
    const kingdom = visL.add(`<g><circle r="230" fill="url(#halo-glow)"/>${radiance(c, 70)}<g transform="translate(0 6)">${lightCrown(c, 34)}</g></g>`);
    const ghosts = [0, 1, 2, 3, 4].map((i) => ({ i, el: visL.add(`<g opacity=".55">${bandSil(c, { kind: 'sword', arm: 84, roman: i % 2 === 1, i }).replace(/fill="#[0-9a-f]{6}"/g, 'fill="#efe4cc"')}</g>`) }));
    const K = praetoriumCast(S, R);

    const fx = S.layer({ par: PR.P, sh: 4 });
    const askK = fx.add(`<g>${say(c, [tr('Czy Ty jesteś', 'Are You'), tr('Królem Żydowskim?', 'the King of the Jews?')], { size: 17, side: -1 })}</g>`);
    const crownQ = hanging(fx, `<g transform="translate(0 30)">${paperCrown(c, 70)}</g><g transform="translate(46 -4) scale(.9)">${question(c)}</g>`, { x: 0, y: 0, len: 800 });
    const rings = voiceRings(fx, c, { n: 4, color: C.cream, r: 40, w: 6, both: false });
    const jew = fx.add(`<g>${say(c, tr('Czy ja jestem Żydem?', 'I’m not a Jew, am I?'), { size: 18, side: -1 })}</g>`);
    const nation = hanging(fx, nameTag(c, [tr('Twój naród', 'your own nation'), tr('i arcykapłani', 'and the chief priests')], { size: 15 }), { x: 0, y: 0, len: 800 });
    const what = fx.add(`<g transform="scale(1.3)">${question(c)}</g>`);
    const notW = hanging(fx, nameTag(c, tr('nie z tego świata', 'not of this world'), { size: 17 }), { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      R.sky.set(...DAWN);
      vis(R.sun, { x: 330, y: 250 + (T ? Math.sin(T * 0.5) * 2 : 0), o: 1 });
      const vision = es(t, 6.05, 6.4) * (1 - es(t, 8.4, 8.9) * 0.6);
      lampSet(R.lamp, 0.5 + vision * 0.4, T);
      dimL.fade(vision * 0.9);
      K.poseLead(T, (m) => (m.k === 'cai' || m.k === 'p1' ? { armF: 16 + bump(t, 2.1, 2.9) * 50, head: -bump(t, 2.1, 2.9) * 4 } : {}));
      K.poseSols(T);

      /* Pilate goes back in, calls Jesus */
      const pK = [[-0.5, [552, FLOOR + 4]], [0.05, [552, FLOOR + 4]], [0.85, [PXI, FLOOR]]];
      const [px, py] = kf(t, pK, ease.sine);
      const call = bump(t, 1.0, 1.4);
      const speak = es(t, 1.1, 1.3) * (1 - es(t, 1.9, 2.0)) + es(t, 3.05, 3.2) * (1 - es(t, 5.9, 6.0));
      const self = es(t, 3.05, 3.25) * (1 - es(t, 3.9, 4.05));
      const door = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.05));
      const step = es(t, 1.1, 1.6, ease.sine);
      const jx = lerp(JX, JX + 40, step);
      const jSpeak = es(t, 2.05, 2.2) * (1 - es(t, 2.9, 3.0)) + es(t, 6.05, 6.2) * (1 - es(t, 8.9, 9.0));
      K.J.set({ x: jx, y: FLOOR, s: 1.02, flip: false, walk: step > 0 && step < 1 ? jx * 0.05 : undefined, amt: 0.6, armF: 26, armB: 12 + jSpeak * 30, head: -jSpeak * 3 - es(t, 6.1, 6.5) * 6 * (1 - es(t, 8.1, 8.5)), blink: blinkAt(T) });
      fade(K.jEl.querySelector('[data-part="sad"]'), 0);
      K.pil.set({ x: px, y: py, s: 1.0, flip: t > 0.85, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 22 + call * 50 + speak * 16 + door * 56 - self * 10, armB: 10 + self * 70, head: -speak * 3 + door * 6 + self * 8, lean: door * -3, blink: blinkAt(T, 13) });

      /* words */
      const [phx, phy] = headAt(px, py, 1.0, true);
      const [jhx, jhy] = headAt(jx, FLOOR, 1.02, false);
      const ak = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(askK, { x: phx - 14, y: phy - 20, s: ak, o: ak > 0.01 ? 1 : 0 });
      const ck = es(t, 1.3, 1.6, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(crownQ, { x: (jx + px) / 2, y: 330 - (1 - ck) * 800, r: T ? Math.sin(T * 0.9) * 1.6 : 0, o: ck > 0.01 ? 1 : 0 });
      rings(DOOR + 20, FLOOR - 170, es(t, 2.1, 2.3) * (1 - es(t, 2.85, 2.95)), T, { spread: 2.6 });
      const jk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(jew, { x: phx - 14, y: phy - 20, s: jk, o: jk > 0.01 ? 1 : 0 });
      const nk = es(t, 4.1, 4.4, ease.out) * (1 - es(t, 4.9, 5.05, ease.in));
      vis(nation, { x: 420, y: 330 - (1 - nk) * 800, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: nk > 0.01 ? 1 : 0 });
      const wk = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.9, 6.0));
      vis(what, { x: (jx + px) / 2, y: 380, s: 1.3 * wk, o: wk > 0.01 ? 1 : 0 });

      /* v36 — the vision of a kingdom not of this world */
      const wo = es(t, 6.1, 6.5, ease.out);
      vis(world, { x: 800, y: lerp(-300, 400, wo), r: T ? Math.sin(T * 0.7) * 2 : 0, o: wo > 0.01 ? 1 : 0 });
      const up = es(t, 8.1, 8.8, ease.in);
      const kk = es(t, 6.3, 6.7, ease.out);
      vis(kingdom, { x: 1000, y: lerp(-200, 250, kk) - up * 520, s: 0.8 + kk * 0.2, r: T ? T * 3 : 0, o: kk > 0.01 ? 1 - es(t, 8.5, 8.9) : 0 });
      const tk = es(t, 6.35, 6.6, ease.out) * (1 - es(t, 6.95, 7.1, ease.in));
      vis(notW, { x: 1000, y: 380 - (1 - tk) * 800, r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: tk > 0.01 ? 1 : 0 });
      ghosts.forEach((g) => {
        const rise = es(t, 7.1 + g.i * 0.05, 7.4 + g.i * 0.05, ease.out);
        const fold = es(t, 7.75 + g.i * 0.03, 7.98 + g.i * 0.03, ease.in);
        vis(g.el, { x: [820, 880, 1060, 1160, 1230][g.i], y: FLOOR - 26, s: 0.86, sy: 0.86 * rise * (1 - fold), o: rise > 0.01 && fold < 0.99 ? 0.6 : 0, flip: g.i >= 2 });
      });

      S.cam.x = kf(t, [[0, -60], [0.8, 200], [2, 220], [2.1, 40], [2.9, 40], [3.05, 240], [4.05, 60], [4.9, 60], [5.05, 240], [6, 220], [6.4, 160], [9, 180]]);
      S.cam.y = kf(t, [[0, 0], [1, 0], [6, 10], [6.4, -90], [8, -80], [8.6, -120], [9, -120]]);
      S.cam.z = kf(t, [[0, 1.06], [0.8, 1.24], [2, 1.28], [2.1, 1.06], [2.9, 1.06], [3.05, 1.3], [4.05, 1.06], [4.9, 1.06], [5.05, 1.3], [6, 1.26], [6.4, 1.06], [9, 1.06]]);
    };
  },
};
