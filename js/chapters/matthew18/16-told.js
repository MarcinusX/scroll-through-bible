// Mt 18,31 — the same street. Three of the other servants have seen it all: they stand before the prison, where the
// poor man's face looks out between the bars, and they grieve — heads bowed, hands to their faces, tears. Then they
// go to the king's gate; the king comes out onto his balcony above it, and they tell him everything, pointing back
// at the prison — the bars in their bubbles — and the king's brows darken.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { palaceStreet, PS, windowBars, behindWindow, moody, kingPuppets, FELLOW, SERVANTS, speech, kf, headAt, PI } from './lib.js';

const P = 0.45, FY = PS.FY;

export default {
  id: 'mt18-told',
  parable: true,
  beats: [
    { v: 31, text: 'Współsłudzy jego widząc, co się działo, bardzo się zasmucili.' },
    { v: 31, cont: true, text: 'Poszli i opowiedzieli swemu panu wszystko, co zaszło.' },
  ],
  cam: { x: [-60, 70], y: [-20, 40], z: [1, 1.08] },
  build(S) {
    const V = palaceStreet(S, { P });
    const c = S.c;
    const balL = S.layer({ par: P, sh: 5 });
    const K = kingPuppets(S, balL);
    balL.add(V.balFront);

    const L = S.layer({ par: P, sh: 5 });
    const face = behindWindow(S, L, FELLOW, [PS.PX + PS.PW * 0.12, FY - 18 - PS.PH * 0.72, PS.PX + PS.PW * 0.4, FY - 18 - PS.PH * 0.46], 'cell');
    const bars = L.add(`<g>${windowBars(c)}</g>`);
    const sv = SERVANTS.slice(0, 3).map((o, i) => ({ i, p: moody(S, L, o), seed: c.rr(0, 9) }));
    const fx = S.layer({ par: P, sh: 4 });
    const icon = `<g transform="translate(0 4) scale(.55)"><path d="${c.cut(c.rect(-31, -26, 62, 52), 0.3, 5)}" fill="${C.soilDark}"/>${windowBars(c)}</g>`;
    const tells = [0, 1, 2].map(() => fx.add(`<g opacity="0">${speech(c, icon, { w: 58, h: 48, flip: true })}</g>`));

    return (t, time) => {
      const T = time;
      V.update(T);
      face.set({ x: V.win[0] - 2, y: V.win[1] + 167 * 0.8 + 6, s: 0.8, flip: true, head: 8 - es(t, 0.3, 0.6) * 10, blink: blinkAt(T, 5) });
      face.mood({ sad: 1, tear: 1 });
      pose(bars, { x: V.win[0], y: V.win[1] });
      pose(V.door, { x: V.doorX, y: FY - 18 });

      /* v31a — they saw it and grieved */
      const go = es(t, 1.05, 1.45, (x) => x);
      sv.forEach((m) => {
        const x0 = 860 + m.i * 70, x1 = 620 + m.i * 64;
        const x = lerp(x0, x1, go);
        const grief = es(t, 0.15 + m.i * 0.08, 0.45 + m.i * 0.08) * (1 - es(t, 1.0, 1.1) * 0.6);
        const look = es(t, 1.45, 1.6);
        const tell = bump(t, 1.5 + m.i * 0.06, 2.05);
        m.p.set({ x, y: FY + 2 - m.i * 6, s: 0.9, flip: go > 0.02, walk: go > 0 && go < 1 ? x * 0.06 : undefined, armF: 20 + grief * (m.i === 1 ? 110 : 60) + tell * 30, armB: grief * (m.i === 0 ? 120 : 40) + tell * (m.i === 2 ? 70 : 0), head: grief * 16 - look * 14, blink: blinkAt(T, m.seed) });
        m.p.mood({ sad: Math.max(grief, 0.5 * es(t, 0.2, 0.4)), tear: es(t, 0.3 + m.i * 0.08, 0.5 + m.i * 0.08) * (1 - look) });
        const [hx, hy] = headAt(x1, FY + 2 - m.i * 6, 0.9, false);
        const k = es(t, 1.55 + m.i * 0.06, 1.68 + m.i * 0.06, ease.back);
        pose(tells[m.i], { x: hx - 14, y: hy - 18, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });

      /* v31b — the king on his balcony hears it all */
      const out = es(t, 1.15, 1.4);
      K.stand.set({ x: PS.GATE + 4, y: PS.BAL + 12 + (1 - out) * 40, s: 0.9, flip: false, o: out, armF: 20 + es(t, 1.8, 2.0) * 30, armB: 10, head: 10, blink: blinkAt(T, 1) });
      K.stand.mood({ angry: es(t, 1.75, 1.95) });
      K.sit.set({ o: 0 });

      S.cam.x = kf(t, [[0, 40], [1.0, 40], [1.5, -40]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.5, 0]]);
      S.cam.z = kf(t, [[0, 1.05], [1.0, 1.05], [1.5, 1.04]]);
    };
  },
};
