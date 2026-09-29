// Łk 1,28–31 — Mary's room in Nazareth: she kneels at prayer on her mat. The doorway fills with light and the angel
// comes in: "Hail, full of grace, the Lord is with you" (the greeting hangs in gold). She is troubled at his words and
// wonders what the greeting means — she draws back, a hand to her heart. "Do not be afraid, Mary, you have found favour
// with God" — the window's light falls warm across her. "You will conceive and bear a son, and call him Jesus" — a small
// light with the Child comes down between them, and the name hangs in gold.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  MARY, maryRoom, RY, WIN, DOORW, gabriel, lily, hungGold, goldWord, thought, GLYPH, glowDisc, rayBurst, sparkle, baby,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const MX = 660, AX = 960;

export default {
  id: 'lk1-hail',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const R = maryRoom(S);
    const beam = R.G.add(`<path d="${c.poly([[WIN[0] - 70, WIN[1] - 60], [WIN[0] + 70, WIN[1] + 60], [MX + 110, RY], [MX - 90, RY]])}" fill="#fff3cf" opacity=".4"/>`);
    const mGlow = R.G.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const aGlow = R.G.add(`<g>${glowDisc(190, 'halo-glow', 1)}</g>`);
    const cGlow = R.G.add(`<g>${glowDisc(120, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 30, r1: 150, spread: 0.035, o: 0.4 })}</g>`);
    const P = R.P;
    const m = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const mT = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const ang = S.puppet(P.add(gabriel(c, { holdB: lily(c) })));
    const up = S.layer({ par: 0.3, sh: 6 });
    const hail = up.add(hungGold(c, tr('Bądź pozdrowiona, pełna łaski', 'Rejoice, highly favored one'), { size: 26 }));
    const q = up.add(`<g>${thought(c, GLYPH.q(c), { w: 62, h: 50 })}</g>`);
    const child = up.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 50, 30), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, 44, 30), 0.4, 4), C.halo).out()}<g transform="translate(-6 16)">${baby(c)}</g></g>`);
    const name = up.add(hungGold(c, tr('Jezus', 'Jesus'), { size: 36 }));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    return (t, time) => {
      const T = time;
      /* v28: the angel comes in and greets her */
      const lit = es(t, 0.05, 0.3);
      pose(R.doorLight, { o: 0.3 + lit * 0.7 });
      const walk = es(t, 0.2, 0.6);
      const ax = lerp(DOORW[0] + 10, AX, walk);
      ang.set({ x: ax, y: RY + 4, s: 1.02, flip: true, o: es(t, 0.15, 0.3), walk: walk > 0 && walk < 1 ? t * 24 : undefined, armF: 20 + es(t, 0.55, 0.75) * 60 - es(t, 1.2, 1.4) * 30 + es(t, 2.05, 2.3) * 30 - es(t, 2.9, 3.1) * 10, armB: 26, head: -4 + es(t, 0.6, 0.8) * 6, blink: blinkAt(T, 2) });
      pose(aGlow, { x: ax, y: RY - 150, s: 1, o: es(t, 0.15, 0.4) });
      const hk = es(t, 0.6, 0.85, ease.out) * (1 - es(t, 1.2, 1.4, ease.in));
      pose(hail, { x: 800, y: lerp(-1100, 300, hk), r: Math.sin(T * 0.8) * 1.2, o: hk > 0.002 ? 1 : 0 });

      /* v29: she is troubled and wonders */
      const tr1 = es(t, 1.05, 1.12) * (1 - es(t, 2.2, 2.28));
      const pray = { x: MX, y: RY, s: 1, flip: false, blink: blinkAt(T, 3) };
      m.set({ ...pray, o: 1 - tr1, armF: 60 - es(t, 0.3, 0.6) * 20 + es(t, 2.3, 2.6) * 10 + es(t, 3.2, 3.5) * 10, armB: 40 + es(t, 3.2, 3.5) * 20, head: 8 - es(t, 0.3, 0.6) * 14 + es(t, 2.3, 2.6) * 2 });
      mT.set({ ...pray, x: MX - 8, o: tr1, armF: 70, armB: 20, head: 14, lean: -6 });
      const qk = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(q, { x: MX + 10, y: RY - 170, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });

      /* v30: do not be afraid — you have found favour with God: the light falls on her */
      const g = es(t, 2.1, 2.45);
      pose(beam, { o: 0.15 + g * 0.35 });
      pose(mGlow, { x: MX, y: RY - 110, s: 0.6 + g * 0.5, o: g });

      /* v31: you will conceive and bear a son, and call him Jesus */
      const ck = es(t, 3.05, 3.35, ease.out);
      pose(child, { x: 810, y: lerp(-100, 400, ck), s: 1, r: Math.sin(T * 0.8) * 2, o: ck > 0.01 ? 1 : 0 });
      pose(cGlow, { x: 810, y: lerp(-100, 400, ck), s: 0.7 + ck * 0.4, r: t * 3, o: ck });
      const nk = es(t, 3.35, 3.6, ease.out);
      pose(name, { x: 810, y: lerp(-1100, 250, nk), r: Math.sin(T * 0.9) * 1.4, o: nk > 0.002 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 3.45 + i * 0.04, 3.9 + i * 0.04); const a = (i / 6) * PI * 2; pose(sp, { x: 810 + Math.cos(a) * (70 + kk * 50), y: 400 + Math.sin(a) * (60 + kk * 30), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 3.45 + i * 0.04, 3.9 + i * 0.04) }); });

      S.cam.z = 1.04 + es(t, 1.0, 1.4) * 0.03;
      S.cam.y = 10;
      S.cam.x = lerp(20, 0, es(t, 0.2, 0.7));
    };
  },
};
