// Łk 1,11–13 — the Holy Place: cedar and gold, the veil at the back, the lampstand, the table of the bread, and the
// golden altar of incense where Zechariah stands with the censer. A light opens at the right of the altar and the angel
// of the Lord is standing there. Zechariah starts back and falls to his knees; a grey cloud of fear comes down on him.
// "Do not be afraid" — the angel's hand, and the cloud breaks up. "Your prayer is heard" — his old prayer for a child
// (a little empty cradle) rises with the smoke to the light above, which answers. "Elizabeth will bear you a son" —
// a flat comes down: Elizabeth with the child in her arms; and his name hangs in gold: John.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, ELIZABETH, holyPlace, HY, ALTAR, gabriel, lily, censer, cradle, thought, glowDisc, rayBurst, sparkle, hungGold, flat, flatSky,
  fig, johnInArms, dropK, flyTo, tr, es, ease, bump, seg, PI,
} from './lib.js';

const ZX = 630, AX = 985;

export default {
  id: 'lk1-angel',
  beats: [
    { v: 11 },
    { v: 12 },
    { v: 13, text: 'Lecz anioł rzekł do niego: «Nie bój się Zachariaszu!' },
    { v: 13, cont: true, text: 'Twoja prośba została wysłuchana:' },
    { v: 13, cont: true, text: 'żona twoja Elżbieta urodzi ci syna, któremu nadasz imię Jan.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const H = holyPlace(S);

    /* ---------- light: the angel's glory, the light above that answers ---------- */
    const aGlow = H.G.add(`<g>${glowDisc(170, 'halo-glow', 0.9)}${rayBurst(c, { n: 18, r0: 70, r1: 180, spread: 0.026, o: 0.18 })}</g>`);
    const topGlow = H.G.add(`<g>${glowDisc(200, 'halo-glow', 1)}${rayBurst(c, { n: 20, r0: 40, r1: 200, spread: 0.026, o: 0.25 })}</g>`);

    /* ---------- Zechariah and the angel ---------- */
    const P = H.P;
    const zC = S.puppet(P.add(person(c, { ...ZECHARIAH, holdF: censer(c) })));
    const zF = S.puppet(P.add(person(c, ZECHARIAH)));
    const zK = S.puppet(P.add(person(c, { ...ZECHARIAH, pose: 'kneel' })));
    const ang = S.puppet(P.add(gabriel(c, { holdB: lily(c) })));
    const fear = P.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 50, 20, 12, 0.3), 1.2, 4) + c.cut(c.blob(-30, 10, 24, 13, 10, 0.3), 1, 4) + c.cut(c.blob(32, 8, 22, 12, 10, 0.3), 1, 4), mix(C.storm, C.stone2, 0.35)).x(c.ribbon([[-30, 0], [-15, -6], [0, 4], [15, -6], [30, 2]], 2), C.inkSoft, 'opacity=".6"').out()}</g>`);
    const bits = [0, 1, 2, 3, 4].map((i) => P.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 10, 7, 8, 0.3), 1, 3), mix(C.storm, C.stone2, 0.35)).out()}</g>`));

    /* ---------- the prayer rising, the answer coming down ---------- */
    const up = S.layer({ par: 0.3, sh: 5 });
    const prayer = up.add(`<g>${thought(c, `<g transform="translate(0 16) scale(.55)">${cradle(c, 84)}</g>`, { w: 96, h: 70 })}</g>`);
    const W = 300, Hh = 200;
    const inner = flatSky(S, W, Hh, [mix(C.halo, C.cream, 0.4), mix(C.peach, C.cream, 0.5)])
      + `<circle cx="0" cy="-10" r="120" fill="url(#halo-glow)"/>`
      + `<path d="${c.ridge(c.wave(70, [6, 3], [300, 100]), -170, 170, 200, 10, 0.6)}" fill="${mix(C.hillMid, C.sand, 0.4)}"/>`
      + fig(c, { ...ELIZABETH, holdF: johnInArms(c) }, 0, 128, 0.86, false);
    const vision = up.add(flat(S, inner, { w: W, h: Hh }));
    const name = up.add(hungGold(c, tr('Jan', 'John'), { size: 34 }));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    return (t, time) => {
      const T = time;
      H.smoke(t, T, 1, 0.3 + es(t, 3.0, 3.4) * 0.7 * (1 - es(t, 4.2, 4.6)));

      /* v11: the angel of the Lord, standing at the right of the altar */
      const aIn = es(t, 0.2, 0.62);
      const speak = bump(t, 2.05, 2.5) + bump(t, 3.05, 3.4) + bump(t, 4.05, 4.5);
      ang.set({ x: AX, y: HY + 4, s: 0.94 + aIn * 0.08, flip: true, o: aIn, armF: 20 + es(t, 2.0, 2.3) * 55 - es(t, 3.6, 3.9) * 20, armB: 20 + speak * 12, head: -4, blink: blinkAt(T, 2) });
      pose(aGlow, { x: AX, y: HY - 150, s: 0.4 + aIn * 0.7, r: t * 3, o: aIn });

      /* v12: he is troubled, and fear falls on him */
      const start = es(t, 1.02, 1.1);
      const kneel = es(t, 1.4, 1.47);
      zC.set({ x: ZX, y: HY, s: 1, flip: false, o: 1 - start, armF: 55 + bump(t, 0.05, 0.4) * 10, armB: 10, head: -es(t, 0.45, 0.7) * 6, blink: blinkAt(T, 1) });
      zF.set({ x: ZX - 10, y: HY, s: 1, flip: false, o: start * (1 - kneel), armF: 80, armB: 120, head: -12, lean: -10, blink: blinkAt(T, 1) });
      const lift = es(t, 2.2, 2.5);
      zK.set({ x: ZX - 20, y: HY, s: 1, flip: false, o: kneel, armF: 60 - lift * 20 + es(t, 3.0, 3.3) * 30, armB: 40 + es(t, 3.0, 3.3) * 60, head: 18 - lift * 26, lean: 8 - lift * 8, blink: blinkAt(T, 1) });
      const fk = es(t, 1.35, 1.65, ease.out);
      const brk = es(t, 2.15, 2.3);
      pose(fear, { x: ZX - 10, y: lerp(260, 505, fk), s: 1.25, o: fk * (1 - brk) });
      bits.forEach((b, i) => { const k = seg(t, 2.2, 2.7); pose(b, { x: ZX - 10 + (i - 2) * 26 + (i - 2) * k * 40, y: 470 - k * 120 - (i % 2) * 20, r: k * 180 * (i % 2 ? 1 : -1), s: 1 - k * 0.6, o: brk * (1 - k) }); });

      /* v13b: the prayer rises with the smoke to the light above */
      const r = es(t, 3.02, 3.55);
      pose(prayer, { x: lerp(ZX + 20, 800, r), y: lerp(470, 270, r), s: lerp(0.8, 1, r), o: (t > 3.0 ? 1 : 0) * (1 - es(t, 3.9, 4.1)) });
      const ans = es(t, 3.5, 3.75);
      pose(topGlow, { x: 800, y: 215, s: 0.4 + ans * 0.7 + bump(t, 3.5, 3.9) * 0.2, r: t * 3, o: ans * (1 - es(t, 4.1, 4.4) * 0.6) });

      /* v13c: Elizabeth will bear a son — and you shall call him John */
      const vk = dropK(t, 4.05, 99);
      flyTo(vision, vk, 800, 290, T, 0);
      const nk = es(t, 4.4, 4.68, ease.out);
      pose(name, { x: 800, y: lerp(-1100, 455, nk), r: Math.sin(T * 0.9) * 1.4, o: nk > 0.002 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 4.5 + i * 0.04, 4.95 + i * 0.04); const a = (i / 6) * PI * 2; pose(sp, { x: 800 + Math.cos(a) * (60 + kk * 60), y: 455 + Math.sin(a) * (24 + kk * 30), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 4.5 + i * 0.04, 4.95 + i * 0.04) }); });

      S.cam.z = 1.04 + es(t, 0.2, 0.8) * 0.03 + bump(t, 1.0, 2.2) * 0.03;
      S.cam.y = 10 - es(t, 3.0, 3.5) * 30;
      S.cam.x = 0;
    };
  },
};
