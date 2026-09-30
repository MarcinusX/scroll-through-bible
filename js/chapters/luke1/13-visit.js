// Łk 1,39–41 — Mary sets out and goes in haste into the hill country of Judah: the terraced hills slide past as she
// hurries along, and Zechariah's house comes into view. She goes in and greets Elizabeth, who comes out of her door.
// At the sound of her greeting the child leaps in Elizabeth's womb — a small light gives a jump, with sparks — and
// Elizabeth is filled with the Holy Spirit: the dove comes down over her, and light behind her.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import {
  MARY, ELIZABETH, HILLDAY, hillHome, homeLight, hillFront, HGY, hungWord, voiceRings, dove, flapWings, glowDisc, rayBurst, sparkle, headAt,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const EX = 720, MX = 910;

export default {
  id: 'lk1-visit',
  beats: [
    { v: 39 },
    { v: 40 },
    { v: 41, text: 'Gdy Elżbieta usłyszała pozdrowienie Maryi, poruszyło się dzieciątko w jej łonie,' },
    { v: 41, cont: true, text: 'a Duch Święty napełnił Elżbietę.' },
  ],
  cam: { x: [-20, 420], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const W = hillHome(S, HILLDAY);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1250, y: -1500, len: 800 });
    const cls = [[500, 150, 180], [1300, 110, 150], [2000, 150, 170]].map(([x, y, w], i) => ({ x, y, i, el: hanging(W.hangL, cloud(c, w), { x, y: -1500, len: 800 }) }));
    const eGlow = W.G.add(`<g>${glowDisc(190, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 40, r1: 180, spread: 0.03, o: 0.2 })}</g>`);
    const P = W.P;
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const m = S.puppet(P.add(person(c, MARY)));
    const wombG = W.G.add(`<g>${glowDisc(34, 'warm-glow', 1)}</g>`);
    const womb = P.add(`<g><path d="${c.poly(c.star(0, 0, 8, 3, 4, 0))}" fill="${C.star}"/></g>`);
    const voice = voiceRings(P, c, { n: 3, color: shade(C.ochre, 0.2), r: 36, w: 5, both: true });
    const fly = S.layer({ par: 0.2, sh: 6 });
    const land = fly.add(hungWord(c, tr('w góry, do miasta w Judzie', 'into the hill country of Judah'), { size: 24 }));
    const dv = fly.add(dove(c));
    const sparks = [0, 1, 2, 3, 4].map((i) => fly.add(`<g>${sparkle(c, 9 + (i % 2) * 4)}</g>`));
    hillFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 160, T, 1, 0.7);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));

      /* v39: she goes in haste into the hill country — the land slides by */
      const pan = es(t, 0.0, 0.95, ease.sine);
      S.cam.x = lerp(400, 0, pan);
      const mx = lerp(1320, MX, pan);
      m.set({ x: mx, y: HGY, s: 0.96, flip: true, walk: pan > 0 && pan < 1 ? t * 44 : undefined, amt: 1.2, lean: pan < 1 ? 4 : 0, armF: 14 + es(t, 1.35, 1.6) * 60 - es(t, 2.1, 2.4) * 40, armB: 10 + es(t, 1.35, 1.6) * 40 - es(t, 2.1, 2.4) * 30, blink: blinkAt(T, 3) });
      const lk = es(t, 0.2, 0.45, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      pose(land, { x: 880, y: lerp(-1100, 360, lk), r: Math.sin(T * 0.8) * 1.2, o: lk > 0.002 ? 1 : 0 });

      /* v40: she enters Zechariah's house and greets Elizabeth */
      const eOut = es(t, 1.05, 1.4);
      homeLight(W.H, { open: es(t, 0.95, 1.1), lit: 0.4 });
      const filled = es(t, 3.05, 3.4);
      e.set({ x: lerp(W.H.doorX, EX, eOut), y: HGY, s: 0.96, flip: false, o: eOut > 0.001 ? 1 : 0, walk: eOut > 0 && eOut < 1 ? t * 28 : undefined, armF: 14 + es(t, 1.4, 1.6) * 50 + filled * 20, armB: 10 + es(t, 2.2, 2.4) * 30 + filled * 100, head: -filled * 12 - bump(t, 2.2, 2.8) * 6, blink: blinkAt(T, 1) });

      /* v41a: at her greeting the child leaps in Elizabeth's womb */
      const [hx, hy] = headAt(MX, HGY, 0.96, true);
      voice(hx - 16, hy + 8, bump(t, 1.45, 2.3), T, { dir: -1, spread: 3 });
      const leap = Math.abs(Math.sin(seg(t, 2.25, 2.75) * PI * 3)) * (t > 2.25 && t < 2.75 ? 1 : 0);
      const wk = es(t, 2.15, 2.3);
      pose(womb, { x: EX + 16, y: HGY - 72 - leap * 22, s: 0.6 + wk * 0.6 + leap * 0.3, o: wk });
      pose(wombG, { x: EX + 16, y: HGY - 72 - leap * 22, s: 0.6 + wk * 0.6 + leap * 0.3, o: wk });
      sparks.forEach((sp, i) => { const kk = seg(t, 2.35 + i * 0.05, 2.8 + i * 0.05); const a = PI * (1.1 + i * 0.2); pose(sp, { x: EX + 16 + Math.cos(a) * (30 + kk * 50), y: HGY - 80 + Math.sin(a) * (30 + kk * 50), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 2.35 + i * 0.05, 2.8 + i * 0.05) }); });

      /* v41b: filled with the Holy Spirit */
      const dk = es(t, 3.0, 3.4, ease.out);
      pose(dv, { x: lerp(EX + 250, EX + 10, dk), y: lerp(60, HGY - 300, dk), s: 1, o: t > 2.98 ? 1 : 0 });
      if (t > 2.98) flapWings(dv, T || t * 3, 30, 7, -6);
      pose(eGlow, { x: EX, y: HGY - 130, s: 0.5 + filled * 0.6, r: t * 3, o: filled });

      S.cam.z = 1.03 + es(t, 1.0, 1.5) * 0.03;
      S.cam.y = 20;
    };
  },
};
