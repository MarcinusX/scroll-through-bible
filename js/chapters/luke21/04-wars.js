// Łk 21,9 — rumours come flying into the court like bubbles: little armies with their pennants, a burning torch of
// revolt; the people start back, hands up. "Do not be terrified": Jesus holds out His hand over them, they lower their
// arms and the bubbles stop in the air, grow pale and drift away. "These things must happen first, but the end won't
// come immediately": an hourglass comes down with most of its sand still to run, and beside it a long line of days is
// strung out across the court — a few dark ones at its start, and on and on, light ones, far past them.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, altGroups, swapGroups, speech, toySoldier, pennant, hourglass, dayCard, word, headAt, STRING,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;

function torch(c) {
  const s = sheet().p(c.ribbon([[0, 14], [3, -12]], 3.4), C.wood2).p(c.cut([[-5, -12], [8, -12], [6, -18], [-3, -18]], 0.2, 3), C.rope);
  return s.out() + `<path d="M2 -18C-8 -24 -6 -36 2 -46C10 -36 12 -26 2 -18Z" fill="${C.lampFlame}"/><path d="M2 -20C-2 -24 -2 -30 2 -35C5 -30 6 -25 2 -20Z" fill="#fff4d2"/>`;
}

export default {
  id: 'lk21-wars',
  beats: [
    { v: 9, text: 'I nie trwóżcie się, gdy posłyszycie o wojnach i przewrotach.' },
    { v: 9, cont: true, text: 'To najpierw musi się stać, ale nie zaraz nastąpi koniec».' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const afraid = altGroups(T0, 'afraid');

    /* the rumours */
    const INNER = [
      () => `<g transform="translate(-10 12)">${pennant(c, C.terracotta, { h: 36, w: 18 })}</g><g transform="translate(12 14)">${toySoldier(c, C.terracotta, { h: 30 })}</g>`,
      () => `<g transform="translate(0 14)">${torch(c)}</g>`,
      () => `<g transform="translate(-12 14)">${toySoldier(c, C.teal2, { h: 30 })}</g><g transform="translate(10 14)">${toySoldier(c, C.teal2, { h: 30 })}</g>`,
      () => `<g transform="translate(-4 12)">${pennant(c, C.plumRobe, { h: 36, w: 18 })}</g><g transform="translate(16 12) scale(.8)">${torch(c)}</g>`,
      () => `<g transform="translate(0 14)">${toySoldier(c, C.olive, { h: 32 })}</g>`,
    ];
    // on a phone the rumours stop further in, clear of the frame and the progress thread
    const RUMXY = S.portrait ? [[500, 470], [610, 360], [985, 380], [1050, 500], [1040, 270]] : [[380, 460], [560, 400], [1030, 410], [1210, 470], [1150, 330]];
    const RUM = [[-900, 300], [-700, -200], [2300, -100], [2400, 400], [1900, -400]].map(([a, b], i) => [...RUMXY[i], a, b]).map(([x, y, fx, fyy], i) => ({ i, x, y, fx, fy: fyy, el: T0.fx.add(`<g>${speech(c, INNER[i](), { w: 74, h: 60, flip: i >= 2 })}</g>`) }));

    /* the hourglass and the line of days */
    const hg = T0.FL.add(`<g><path d="M0 -1600V-48" stroke="${STRING}" stroke-width="1.2"/>${hourglass(c, 110)}</g>`);
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB'), stream = hg.querySelector('.stream');
    const N = 14;
    const line = T0.FL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [700, 60], [1400, 0], 24), 1.4)}" fill="${C.rope}"/></g>`);
    const days = Array.from({ length: N }, (_, i) => ({ i, dark: i < 3, el: T0.FL.add(`<g>${dayCard(c, i < 3, 34, 44)}</g>`) }));
    const tag = T0.bits.add(`<g>${word(c, tr('jeszcze nie koniec', 'not yet the end'), { size: 20 })}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { dis: false, crowd: false });

      /* v9a — rumours fly in; the people start; He calms them */
      const fear = es(t, 0.2, 0.27) * (1 - es(t, 0.55, 0.62));
      swapGroups(T0, afraid, fear);
      const calm = es(t, 0.38, 0.55);
      const hand = calm * (1 - es(t, 0.95, 1.1));
      RUM.forEach((r) => {
        const k = es(t, 0.02 + r.i * 0.05, 0.3 + r.i * 0.05, ease.out);
        const off = es(t, 0.85, 1.1, ease.in);
        const x = lerp(r.fx, r.x, k) + lerp(0, r.x < 800 ? -500 : 500, off);
        const y = lerp(r.fy, r.y, k) - off * 200;
        const jit = T ? Math.sin(T * 6 + r.i * 2) * 4 * (1 - calm) : 0;
        pose(r.el, { x: x + jit, y, s: 1.45 - calm * 0.2, r: jit, o: k > 0.01 && off < 1 ? 1 - calm * 0.2 : 0 });
      });
      T0.peter.set({ x: TT.PX, y: GY + 10, s: 0.98, flip: false, armF: fear * 90, armB: fear * 120, head: fear * 8 - 4, lean: -fear * 6, blink: blinkAt(T, 3) });
      T0.john.set({ x: TT.JOX, y: GY + 10, s: 0.98, flip: true, armF: fear * 80, armB: fear * 130, head: fear * 8 - 4, lean: -fear * 6, blink: blinkAt(T, 5) });

      /* v9b — the hourglass and the long line of days */
      const k2 = es(t, 1.05, 1.35, ease.out);
      const show = es(t, 1.1, 1.4);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + hand * 70 + show * 80, armB: 10 + hand * 40 + show * 20, head: -show * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, Math.max(calm * (1 - es(t, 0.9, 1.0)), show) * 0.7, T, { spread: 1.8 });
      const hy0 = lerp(-900, 250, k2);
      pose(hg, { x: 560, y: hy0 + 60 + (T ? Math.sin(T * 0.9) * 2 : 0), r: T ? Math.sin(T * 0.8) * 1.2 * k2 : 0, o: k2 > 0.002 ? 1 : 0 });
      const sand = seg(t, 1.2, 2);
      pose(sandT, { x: 0, y: -3, sy: 1 - sand * 0.12 });
      pose(sandB, { x: 0, y: 55, sy: 0.2 + sand * 0.14 });
      fade(stream, k2 > 0.5 ? 0.9 : 0);
      const lk = es(t, 1.2, 1.5, ease.out);
      const LX = 620, LY = lerp(-700, 210, lk);
      pose(line, { x: LX, y: LY, o: lk > 0.002 ? 1 : 0 });
      days.forEach((d) => {
        const u = (d.i + 1) / (N + 1);
        const a = 1.3 + d.i * 0.035;
        const on = es(t, a, a + 0.12, ease.back);
        const x = LX + 1400 * u, y = LY + 2 * (1 - u) * u * 60 + 2 - (1 - on) * 60;
        pose(d.el, { x, y, r: T ? Math.sin(T * 1.1 + d.i) * 3 : 0, o: on > 0.02 ? 1 : 0 });
      });
      const tg = es(t, 1.45, 1.6, ease.back);
      pose(tag, { x: 760, y: 356, s: tg, r: -2, o: tg > 0.02 ? 1 : 0 });

      S.cam.y = -es(t, 1.0, 1.4) * 30;
      S.cam.x = es(t, 1.0, 1.5) * 10;
      void PI; void mix; void shade;
    };
  },
};
