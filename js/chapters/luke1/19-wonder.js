// Łk 1,64–66 — at once the cord at Zechariah's mouth comes untied and falls, his tongue is loosed, and he lifts his
// hands and blesses God, golden rings of voice going out. Fear comes on all the neighbours — they draw back. And the
// news runs through all the hill country of Judea: little written slips fly off over the hills and the far villages
// light up one after another. All who hear lay it up in their hearts (hearts glow) and ask "What then will this child
// be?" — a great question over the baby; for the hand of the Lord was with him: a quiet light rests on the child.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import {
  ZECHARIAH, ELIZABETH, zechMute, knot, HILLDAY, hillHome, homeLight, hillFront, HGY, johnInArms, voiceRings, thought, GLYPH, glowDisc, rayBurst,
  sparkle, heart, plainHeart, wordSlip, folk, headAt, tr, es, ease, bump, seg, PI,
} from './lib.js';

const ZX = 800, EX = 640;

export default {
  id: 'lk1-wonder',
  beats: [
    { v: 64 },
    { v: 65, text: 'I padł strach na wszystkich ich sąsiadów.' },
    { v: 65, cont: true, text: 'W całej górskiej krainie Judei rozpowiadano o tym wszystkim, co się zdarzyło.' },
    { v: 66, text: 'A wszyscy, którzy o tym słyszeli, brali to sobie do serca i pytali: «Kimże będzie to dziecię?»' },
    { v: 66, cont: true, text: 'Bo istotnie ręka Pańska była z nim.' },
  ],
  cam: { x: [-30, 30], y: [-80, 40], z: [0.94, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the neighbours stand closer and draw back less, so they stay on the screen when fear falls on them
    const PH = S.portrait;
    const LX = PH ? 520 : 400, RX = PH ? 915 : 960, BK = PH ? 15 : 110;
    const W = hillHome(S, HILLDAY);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1220, y: -1500, len: 800 });
    // far villages that light up as the news reaches them
    const farL = S.layer({ par: 0.07, sh: 1, flat: true });
    const VIL = [[150, 488], [320, 470], [1000, 470], [1250, 486], [1450, 478], [-60, 480]];
    const vLights = VIL.map(([x, y]) => farL.add(`<g transform="translate(${x} ${y})">${glowDisc(80, 'warm-glow', 1)}<path d="${c.poly(c.star(0, -10, 10, 3.5, 4, 0))}" fill="${C.star}"/></g>`));
    const zGlow = W.G.add(`<g>${glowDisc(160, 'halo-glow', 0.85)}${rayBurst(c, { n: 16, r0: 60, r1: 170, spread: 0.03, o: 0.18 })}</g>`);
    const beam = W.G.add(`<g><path d="${c.poly([[-40, -700], [40, -700], [80, 0], [-80, 0]])}" fill="#fff3cf" opacity=".6"/>${glowDisc(90, 'halo-glow', 1)}</g>`);
    const P = W.P;
    const zM = S.puppet(P.add(zechMute(c)));
    const z = S.puppet(P.add(person(c, ZECHARIAH)));
    const e = S.puppet(P.add(person(c, { ...ELIZABETH, holdF: johnInArms(c) })));
    const falling = P.add(`<g>${knot(c)}</g>`);
    const voice = voiceRings(P, c, { n: 3, color: C.sun, r: 40, w: 6, both: true });
    const crowdL = S.layer({ par: 0.45, sh: 5 });
    const grp = (n, dir) => { const mem = []; for (let i = 0; i < n; i++) mem.push({ x: i * (PH ? 40 : 58) + c.rr(-8, 8), y: (i % 2) * 20, s: 0.86 * c.rr(0.94, 1.04), flip: dir < 0, o: folk(c) }); return mem.sort((a, b) => a.y - b.y).map((mm) => `<g transform="translate(${mm.x.toFixed(1)} ${mm.y.toFixed(1)}) scale(${mm.flip ? -mm.s : mm.s} ${mm.s})">${person(c, { ...mm.o, holdF: '', holdB: '' })}</g>`).join(''); };
    const left = crowdL.sprite(grp(3, 1), LX, 770);
    const right = crowdL.sprite(grp(3, -1), RX, 770);
    const up = S.layer({ par: 0.3, sh: 6 });
    const slips = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g transform="scale(1.6)">${wordSlip(c, 30)}</g>`));
    const bangs = (PH ? [[530, 560], [600, 575], [935, 560], [1010, 570]] : [[430, 560], [520, 575], [1000, 560], [1110, 570]]).map(([x, y], i) => ({ x, y, i, el: up.add(`<g>${thought(c, GLYPH.bang(c), { w: 50, h: 42 })}</g>`) }));
    const hearts = [0, 1, 2, 3, 4, 5, 6].map((i) => up.add(`<g>${plainHeart(c, 9, [C.jesusMantle, C.roseRobe][i % 2])}</g>`));
    const q = up.add(`<g>${thought(c, GLYPH.q(c), { w: 96, h: 76 })}</g>`);
    hillFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 160, T, 1, 0.7);
      homeLight(W.H, { open: 0.8, lit: 0.3 });
      const [hx, hy] = headAt(ZX, HGY, 1, false);

      /* v64: his mouth is opened, his tongue loosed, he blesses God */
      const free = es(t, 0.15, 0.2);
      const praise = es(t, 0.3, 0.55) * (1 - es(t, 2.9, 3.2) * 0.5);
      const zo = { x: ZX, y: HGY, s: 1, flip: false, blink: blinkAt(T, 2) };
      zM.set({ ...zo, o: 1 - free, armF: 30, armB: 10, head: 4 });
      z.set({ ...zo, o: free, armF: 30 + praise * 50, armB: 20 + praise * 130, head: -praise * 14 });
      const kf = es(t, 0.15, 0.55, ease.in);
      pose(falling, { x: hx + 2 + kf * 20, y: hy + kf * 150, r: kf * 200, s: 1.3, o: t > 0.15 && kf < 1 ? 1 : 0 });
      voice(hx + 12, hy + 8, bump(t, 0.4, 1.95), T, { spread: 3.4 });
      pose(zGlow, { x: ZX, y: HGY - 140, s: 0.5 + praise * 0.6, r: t * 3, o: praise * (1 - es(t, 2.9, 3.2)) });

      /* v65a: fear on all the neighbours — they draw back */
      const inK = es(t, 0.0, 0.2, ease.out);
      const back = es(t, 1.05, 1.4);
      bangs.forEach((b) => { const k = es(t, 1.1 + b.i * 0.06, 1.3 + b.i * 0.06, ease.back) * (1 - es(t, 1.95, 2.05)); pose(b.el, { x: b.x + (b.x < 800 ? -1 : 1) * back * BK, y: b.y, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      left.set({ x: lerp(-200, LX, inK) - back * BK, y: 770, o: inK > 0.01 ? 1 : 0 });
      right.set({ x: lerp(1700, RX, inK) + back * BK, y: 770, o: inK > 0.01 ? 1 : 0 });

      /* v65b: talked about through all the hill country */
      slips.forEach((s, i) => {
        const k = seg(t, 2.0 + i * 0.07, 2.5 + i * 0.07), [vx, vy] = VIL[i];
        pose(s, { x: lerp(ZX, vx, ease.io(k)), y: lerp(hy - 40, vy - 30, ease.io(k)) - Math.sin(k * PI) * 160, r: k * 30, s: 1.6 - k * 0.8, o: k > 0 && k < 1 ? 1 : 0 });
      });
      vLights.forEach((v, i) => { const [vx, vy] = VIL[i]; pose(v, { x: vx, y: vy, s: 0.6 + bump(t, 2.45 + i * 0.07, 2.9 + i * 0.07) * 0.6, o: es(t, 2.45 + i * 0.07, 2.6 + i * 0.07) * (1 - es(t, 3.9, 4.2) * 0.5) }); });

      /* v66a: they lay it up in their hearts: what will this child be? */
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, armF: 70, armB: 30, head: 10, blink: blinkAt(T, 1) });
      hearts.forEach((h, i) => { const k = es(t, 3.1 + i * 0.05, 3.3 + i * 0.05, ease.back) * (1 - es(t, 3.95, 4.1)); const x = PH ? (i < 3 ? 480 + i * 50 : 925 + (i - 3) * 50) : i < 3 ? 330 + i * 60 : 900 + (i - 3) * 60; pose(h, { x, y: 600 - (i % 2) * 20, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      const qk = es(t, 3.3, 3.55, ease.back);
      pose(q, { x: EX + 20, y: HGY - 180, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });

      /* v66b: the hand of the Lord was with him — a light rests on the child */
      const lk = es(t, 4.1, 4.5);
      pose(beam, { x: EX + 30, y: HGY - 110, o: lk });

      S.cam.z = 1.03 - es(t, 2.0, 2.4) * 0.07 + es(t, 3.0, 3.4) * 0.07;
      S.cam.y = 20 - es(t, 2.0, 2.4) * 80 + es(t, 3.0, 3.4) * 80;
    };
  },
};
