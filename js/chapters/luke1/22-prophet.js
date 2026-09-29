// Łk 1,76–77 — night; by the lit doorway Zechariah takes the child in his arms and lifts him up: "And you, child, will be
// called the prophet of the Most High" — a small star of light over the baby and the words in gold. "For you will go before
// the Lord to prepare his ways" — a flat: the grown John in the wilderness, and the crooked road ahead of the coming light
// straightens itself as he walks. "To give his people knowledge of salvation by the forgiveness of their sins" — a flat:
// people at the Jordan, and the dark stones of their sins fall from them into the water.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, ELIZABETH, JOHN_B, HILLNIGHT, hillHome, homeLight, hillFront, HGY, johnInArms, glowDisc, rayBurst, sparkle, hungGold, flat, flatSky, flatHills,
  fig, dropK, folk, hand, tr, es, ease, bump, seg, PI,
} from './lib.js';

const ZX = 800, EX = 640;
const FX = 800, FY = 285, W = 360, H = 230, K = 1.1;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-prophet',
  beats: [
    { v: 76, text: 'A i ty, dziecię, prorokiem Najwyższego zwać się będziesz,' },
    { v: 76, cont: true, text: 'bo pójdziesz przed Panem torując Mu drogi;' },
    { v: 77 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const Wd = hillHome(S, HILLNIGHT, { starsOn: true });
    Wd.dim.fade(1);
    const lampG = Wd.G.add(`<g>${glowDisc(260, 'warm-glow', 1)}</g>`);
    const cGlow = Wd.G.add(`<g>${glowDisc(110, 'halo-glow', 0.9)}${rayBurst(c, { n: 16, r0: 60, r1: 150, spread: 0.03, o: 0.22 })}</g>`);
    const star = Wd.G.add(`<g>${glowDisc(40, 'halo-glow', 1)}<path d="${c.poly(c.star(0, 0, 14, 5, 8, 0))}" fill="${C.sun}"/></g>`);
    const P = Wd.P;
    const z = S.puppet(P.add(person(c, { ...ZECHARIAH, holdF: johnInArms(c) })));
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const up = S.layer({ par: 0.3, sh: 6 });
    const title = up.add(hungGold(c, tr('prorok Najwyższego', 'prophet of the Most High'), { size: 28 }));
    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });
    /* 1 — the way prepared before the Lord */
    const f1 = L.add(flat(S, flatSky(S, W, H, [mix(C.duskViolet, C.peach, 0.4), mix(C.dawn, C.cream, 0.4)])
      + `<circle cx="${-W / 2}" cy="40" r="170" fill="url(#halo-glow)"/>` + flatHills(c, W, 60, mix(C.sand2, C.dune, 0.35), 10), { w: W, h: H }));
    const crooked = bits.add(`<g><path d="${c.ribbon([[-172, 92], [-120, 78], [-60, 94], [0, 66], [60, 84], [120, 56], [172, 68]], 14)}" fill="${mix(C.sand2, C.rock2, 0.4)}"/>${sheet().p(c.cut(c.blob(-20, 70, 16, 10, 8, 0.3), 0.6, 3) + c.cut(c.blob(90, 62, 14, 9, 8, 0.3), 0.6, 3), C.rock2).out()}</g>`);
    const straight = bits.add(`<g><path d="${c.ribbon([[-172, 88], [172, 64]], 18)}" fill="${mix(C.halo, C.sand, 0.4)}"/></g>`);
    const jn = S.puppet(bits.add(person(c, JOHN_B)));
    /* 2 — knowledge of salvation by the forgiveness of sins */
    let ppl = '';
    for (let i = 0; i < 5; i++) ppl += fig(c, folk(c), -130 + i * 60, 96, 0.46, i > 2);
    const f2 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.halo, 0.3), mix(C.cream, C.halo, 0.3)]) + `<circle cx="0" cy="-110" r="140" fill="url(#halo-glow)"/>`
      + flatHills(c, W, 40, mix(C.hillMid, C.sand, 0.35), 5) + ppl + `<path d="${c.ridge(c.wave(82, [3, 2], [120, 50]), -200, 200, 200, 8, 0.6)}" fill="${C.lake2}"/>`, { w: W, h: H }));
    const stones = [0, 1, 2, 3, 4].map((i) => bits.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 11, 8, 8, 0.35), 1, 3), mix(C.storm2, C.soilDark, 0.5)).out()}</g>`));
    hillFront(S);

    return (t, time) => {
      const T = time;
      homeLight(Wd.H, { open: 0.8, lit: 1 });
      pose(lampG, { x: Wd.H.doorX + 40, y: HGY - 80, s: T ? 1 + Math.sin(T * 5) * 0.03 : 1, o: 0.9 });
      /* v76a: he lifts the child: prophet of the Most High */
      const lift = es(t, 0.05, 0.35);
      const aF = 70 + lift * 40;
      z.set({ x: ZX, y: HGY, s: 1, flip: true, armF: aF, armB: 30 + lift * 40, head: -lift * 10, blink: blinkAt(T, 2) });
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, armF: 20 + lift * 40, armB: 10, head: -6, blink: blinkAt(T, 1) });
      const [hx, hy] = hand(ZX, HGY, 1, true, aF);
      const sk = es(t, 0.35, 0.6);
      pose(star, { x: hx - 10, y: hy - 80, s: 0.5 + sk * 0.6, r: t * 10, o: sk * (1 - es(t, 1.0, 1.2)) });
      pose(cGlow, { x: hx - 10, y: hy - 40, s: 0.5 + sk * 0.6, r: t * 3, o: sk });
      const tk = es(t, 0.4, 0.65, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      pose(title, { x: 800, y: lerp(-1100, 280, tk), r: Math.sin(T * 0.9) * 1.4, o: tk > 0.002 ? 1 : 0 });

      const KK = [dropK(t, 1, 2.1, 0.28), dropK(t, 2, 99, 0.28)];
      const Y = KK.map((k) => lerp(-1500, FY, k));
      const YY = (i, dy) => Y[i] + dy * K;
      const on = (i, v = 1) => (KK[i] > 0.002 ? v : 0);
      pose(f1, { x: FX, y: Y[0], s: K, o: on(0) });
      pose(f2, { x: FX, y: Y[1], s: K, o: on(1) });
      /* v76b: he walks ahead; the crooked road straightens before the light */
      const wk = seg(t, 1.15, 1.95);
      const str = es(t, 1.35, 1.7);
      pose(crooked, { x: FX, y: Y[0], s: K, o: on(0, 1 - str) });
      pose(straight, { x: FX, y: Y[0], s: K, sx: K * Math.max(0.001, str), o: on(0, str > 0.01 ? 1 : 0) });
      jn.set({ x: X(-110 + wk * 150), y: YY(0, 82 - wk * 16), s: 0.5 * K, flip: false, walk: wk > 0 && wk < 1 ? t * 26 : undefined, o: on(0), armF: 20, armB: 10 });
      /* v77: the sins fall into the water */
      stones.forEach((s, i) => { const f = es(t, 2.35 + i * 0.07, 2.8 + i * 0.07, ease.in); pose(s, { x: X(-130 + i * 60 + 6), y: YY(1, lerp(-10, 96, f)), r: f * 120, s: K, o: on(1, 1 - es(t, 2.85 + i * 0.03, 2.95 + i * 0.03)) }); });

      S.cam.z = 1.05;
      S.cam.y = 10;
    };
  },
};
