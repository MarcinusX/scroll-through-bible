// Łk 22,56–60 — by the fire in the middle of the courtyard. A servant girl sees Peter sitting in the firelight, holds
// her lamp to his face and looks hard: "This man also was with Him" — "Woman, I don't know Him" (a first grey mark
// comes down). A little later another: "You also are one of them" — "Man, I am not" (a second). About an hour later
// (the moon has moved on) another insists: "Certainly he was with Him — he is a Galilean!" (a bubble of the lake and a
// boat) — "Man, I don't know what you are talking about" (the third) — and while he is still speaking, on the wall
// the rooster crows.
import { es, ease, bump, seg } from '../../core/anim.js';
import { boat } from '../../assets/things.js';
import { courtScene, kf, moving, hand, headAt, speech, say, miniJesus, miniMan, tally, noTag, voiceRings, sheet, hanging, vis, pose, fade, lerp, mix, blinkAt, tr, C, TW, PI } from './lib.js';

const PETER_AT = 70;

export default {
  id: 'lk22-denial',
  beats: [
    { v: 56 },
    { v: 57 },
    { v: 58, text: 'Po chwili zobaczył go ktoś inny i rzekł: «I ty jesteś jednym z nich».' },
    { v: 58, cont: true, text: 'Piotr odrzekł: «Człowieku, nie jestem».' },
    { v: 59 },
    { v: 60, text: 'Piotr zaś rzekł: «Człowieku, nie wiem, co mówisz».' },
    { v: 60, cont: true, text: 'I w tej chwili, gdy on jeszcze mówił, kogut zapiał.' },
  ],
  cam: { x: [-400, 120], y: [-40, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const K = courtScene(S);
    const { YARD, HALL, FIRE, JXH } = K;
    const PX = FIRE + PETER_AT, PY = YARD + 14;
    const cry = voiceRings(K.rL, c, { n: 3, color: C.cream, r: 26, w: 4, both: false });
    const fx = S.layer({ par: K.P, sh: 4 });
    const withJ = `<g transform="translate(-14 16)">${miniJesus(c, 0.8)}</g><g transform="translate(14 16)">${miniMan(c, TW.peter.robe, TW.peter.skin, 0.8)}</g>`;
    const acc1 = fx.add(`<g>${speech(c, withJ, { w: 74, h: 56, flip: false })}</g>`);
    const group3 = `<g transform="translate(-20 18)">${miniMan(c, C.wheatRobe, C.skin, 0.66)}</g><g transform="translate(0 16)">${miniMan(c, C.mauve, C.skin3, 0.7)}</g><g transform="translate(20 18)">${miniMan(c, TW.peter.robe, TW.peter.skin, 0.66)}</g>`;
    const acc2 = fx.add(`<g>${speech(c, group3, { w: 80, h: 56, flip: true })}</g>`);
    const b = boat(c);
    const acc3 = fx.add(`<g>${speech(c, `<path d="${c.cut(c.ell(0, 12, 36, 9, 16), 0.3, 3)}" fill="${C.lake}"/><g transform="translate(0 14) scale(.17)">${b.back}${b.front}</g>${[-22, 22].map((x) => `<path d="${c.ribbon(c.qbez([x - 12, -14], [x, -24], [x + 12, -14], 8), 2)}" fill="${C.lake3}"/>`).join('')}`, { w: 92, h: 60, flip: true })}</g>`);
    const d1 = fx.add(`<g>${say(c, tr('Nie znam Go, kobieto', 'Woman, I don’t know him'), { size: 18, side: -1, fill: mix(C.cream, C.storm, 0.2) })}</g>`);
    const d2 = fx.add(`<g>${say(c, tr('Człowieku, nie jestem', 'Man, I am not!'), { size: 18, side: 1, fill: mix(C.cream, C.storm, 0.25) })}</g>`);
    const d3 = fx.add(`<g>${say(c, [tr('Człowieku, nie wiem,', 'Man, I don’t know'), tr('co mówisz', 'what you are talking about')], { size: 18, side: 1, fill: mix(C.cream, C.storm, 0.3) })}</g>`);
    const marks = hanging(fx, `${sheet().p(c.cut(c.rect(-50, 0, 100, 52), 0.5, 6), mix(C.stone2, C.storm, 0.2)).out()}${[0, 1, 2].map((i) => `<g class="mk" transform="translate(${-16 + i * 16} 42)">${tally(c, 1, C.ink, 30)}</g>`).join('')}`, { x: 0, y: -1500, len: 700 });
    const mks = Array.from(marks.querySelectorAll('.mk'));

    return (t, time) => {
      const T = time;
      K.idle(T, 1);
      K.R.dawn.fade(0);
      // an hour passes: the moon sinks
      pose(K.R.moon, { x: lerp(620, 900, es(t, 4.0, 4.5)), y: lerp(120, 200, es(t, 4.0, 4.5)), r: T ? Math.sin(T * 0.5) * 0.8 : 0 });
      K.hall(T, { head: 10 });
      fade(K.jSad, 0.6);

      /* the ring round the fire; two of them turn on him */
      K.ring.forEach((d) => {
        const accuse2 = d.i === 1 ? es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.1)) : 0;
        const accuse3 = d.i === 3 ? es(t, 4.05, 4.3) * (1 - es(t, 5.9, 6.1)) : 0;
        const look = es(t, 0.2, 0.5) * (d.i === 0 || d.i === 2 ? 1 : 0.5);
        d.sit.set({ x: d.x, y: YARD + d.y + 4, s: d.s, flip: d.f, armF: 64 - accuse2 * 0 + (accuse2 + accuse3) * 30, armB: 40 + (accuse2 + accuse3) * 40, head: 6 - look * 4 - (accuse2 + accuse3) * 8, lean: (accuse2 + accuse3) * -4, blink: blinkAt(T, d.seed) });
        d.stand.set({ x: d.x, y: YARD, o: 0 });
      });

      /* the girl with her lamp */
      const mK = [[-0.3, [940, YARD]], [0.35, [PX + 110, YARD + 4]], [1.95, [PX + 110, YARD + 4]], [2.4, [1000, YARD]]];
      const [mx, my] = kf(t, mK, ease.sine);
      const peerK = es(t, 0.35, 0.55) * (1 - es(t, 1.9, 2.0));
      K.maid.set({ x: mx, y: my, s: 0.86, flip: t < 1.95, o: 1 - es(t, 2.3, 2.45), walk: moving(t, mK, 1) ? mx * 0.05 : undefined, armF: 50 + peerK * 40, armB: 0, head: 4 * peerK, lean: peerK * 10, blink: blinkAt(T, 8) });

      /* Peter */
      const deny = (a, b) => es(t, a, a + 0.2) * (1 - es(t, b, b + 0.12));
      const dk = Math.max(deny(1.1, 1.9), deny(3.1, 3.9), deny(5.1, 5.9));
      const freeze = es(t, 6.1, 6.25);
      const face = t > 2.0 && t < 4.0 ? true : t > 4.0 && t < 6.0 ? false : true;
      K.pSit.set({ x: PX, y: PY, s: 0.9, flip: face, armF: 60 + dk * 30 - freeze * 20, armB: 40 + dk * 40, head: 6 - peerK * 8 - dk * 6 * (T ? Math.sin(T * 8) : 1) + freeze * 4, lean: -dk * 4 - freeze * 3, blink: freeze ? 0 : blinkAt(T, 3) });
      fade(K.pSitF.angry, dk * 0.8);
      fade(K.pSitF.sad, peerK * 0.6 + freeze);
      K.pSt.set({ x: PX, y: PY, o: 0 });

      /* bubbles and marks */
      const [mhx, mhy] = headAt(PX + 110, YARD + 4, 0.86, true);
      const a1 = es(t, 0.45, 0.65, ease.back) * (1 - es(t, 0.95, 1.05));
      vis(acc1, { x: mhx - 14, y: mhy - 26, s: a1, o: a1 > 0.01 ? 1 : 0 });
      const [phx, phy] = headAt(PX, PY, 0.9, face, 62);
      const b1 = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(d1, { x: phx + 6, y: phy - 30, s: b1, o: b1 > 0.01 ? 1 : 0 });
      const r1 = K.ring[1];
      const [r1x, r1y] = headAt(r1.x, YARD + r1.y + 4, r1.s, true, 62);
      const a2 = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(acc2, { x: r1x - 12, y: r1y - 26, s: a2, o: a2 > 0.01 ? 1 : 0 });
      const b2 = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(d2, { x: phx - 4, y: phy - 30, s: b2, o: b2 > 0.01 ? 1 : 0 });
      const r3 = K.ring[3];
      const [r3x, r3y] = headAt(r3.x, YARD + r3.y + 4, r3.s, true, 62);
      const a3 = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.95, 5.05));
      vis(acc3, { x: r3x - 12, y: r3y - 30, s: a3, o: a3 > 0.01 ? 1 : 0 });
      const b3 = es(t, 5.15, 5.35, ease.back) * (1 - es(t, 5.95, 6.05));
      vis(d3, { x: phx - 4, y: phy - 30, s: b3, o: b3 > 0.01 ? 1 : 0 });
      const mIn = es(t, 1.2, 1.5, ease.out);
      vis(marks, { x: 650, y: 420 - (1 - mIn) * 800, r: T ? Math.sin(T) * 2 : 0, o: mIn > 0.01 ? 1 : 0 });
      mks.forEach((m, i) => fade(m, es(t, [1.4, 3.4, 5.4][i], [1.5, 3.5, 5.5][i])));

      /* v60b — the rooster */
      const crow = bump(t, 6.1, 6.8);
      pose(K.roEl, { x: K.ROO.x, y: K.ROO.y, s: 0.9 });
      pose(K.roHead, { x: 16, y: -58, r: -crow * 28, ox: 16, oy: -58 });
      pose(K.beakL, { x: 33, y: -79, r: crow * 22, ox: 33, oy: -79 });
      cry(K.ROO.x + 36, K.ROO.y - 72, crow, T, { spread: 2.8 });

      const P = S.portrait;   // phone: a step back, so the fire's ring and Jesus in the hall both clear the edges and the thread
      S.cam.x = kf(t, [[-0.3, 0], [0.4, P ? -15 : -40], [5.9, P ? -15 : -40], [6.1, P ? -100 : -160], [7, P ? -100 : -160]]);
      S.cam.y = kf(t, [[-0.3, 130], [0.4, P ? 130 : 160], [5.9, P ? 130 : 160], [6.1, 60], [7, 60]]);
      S.cam.z = kf(t, [[-0.3, 1.24], [0.4, P ? 1.2 : 1.42], [5.9, P ? 1.2 : 1.42], [6.1, P ? 1.08 : 1.16], [7, P ? 1.08 : 1.16]]);
    };
  },
};
