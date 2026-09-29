// Łk 1,21–22 — the Temple court again: the people wait for Zechariah and wonder why he is so long inside (the sun on
// its string creeps across, question marks over their heads). He comes out of the sanctuary and down to them, but
// cannot speak — the cord at his mouth; they understand he has seen a vision (a little angel in their thought).
// He keeps making signs to them — up to heaven, a child in the arms — and stays mute.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  zechMute, templeCourt, folk, thought, GLYPH, gabriel, glowDisc, sparkle,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const FLOOR = 716, ZY = 700;

export default {
  id: 'lk1-signs',
  beats: [
    { v: 21 },
    { v: 22, text: 'Kiedy wyszedł, nie mógł do nich mówić, i zrozumieli, że miał widzenie w przybytku.' },
    { v: 22, cont: true, text: 'On zaś dawał im znaki i pozostał niemy.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const GOLD = ['#dcc3a3', '#f2d3a2', '#f7e2bd'], LATE = ['#c9a9a0', '#eec39c', '#f6d9b4'];
    const { sk, sunEl, cl1 } = templeCourt(S, { skyCols: GOLD, floorY: FLOOR, sanctX: 800, sunAt: [1230, 150] });
    const DOOR = [800, FLOOR - 150];

    const G = S.layer({ par: 0.34, sh: 1, flat: true });
    const zGlow = G.add(`<g>${glowDisc(110, 'halo-glow', 1)}</g>`);
    const P = S.layer({ par: 0.34, sh: 5 });
    const z = S.puppet(P.add(zechMute(c)));

    /* the waiting people (whole groups) */
    const crowdL = S.layer({ par: 0.5, sh: 5 });
    const grp = (n, dir) => {
      const mem = [];
      for (let i = 0; i < n; i++) mem.push({ x: i * 64 + c.rr(-10, 10), y: (i % 2) * 24 + c.rr(-4, 4), s: 0.9 * c.rr(0.94, 1.04), flip: dir < 0, o: folk(c) });
      return mem.sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${person(c, { ...m.o, holdF: '', holdB: '' })}</g>`).join('');
    };
    const left = crowdL.sprite(grp(4, 1), 390, 780);
    const right = crowdL.sprite(grp(4, -1), 960, 780);
    const up = S.layer({ par: 0.5, sh: 6 });
    const qs = [[450, 560], [590, 580], [1020, 560], [1140, 575]].map(([x, y], i) => ({ x, y, i, el: up.add(`<g>${thought(c, GLYPH.q(c), { w: 56, h: 44 })}</g>`) }));
    const vision = up.add(`<g>${thought(c, `<g transform="translate(0 30) scale(.32)">${gabriel(c)}</g>`, { w: 100, h: 90 })}</g>`);
    const vision2 = up.add(`<g>${thought(c, `<g transform="translate(0 30) scale(.32) scale(-1 1)">${gabriel(c)}</g>`, { w: 100, h: 90 })}</g>`);
    const sparks = [0, 1, 2].map((i) => up.add(`<g>${sparkle(c, 11)}</g>`));

    return (t, time) => {
      const T = time;
      /* v21: they wait and wonder that he stays so long */
      const late = es(t, 0.1, 1.0);
      sk.blend(GOLD, LATE, late);
      pose(sunEl, { x: lerp(1230, 1150, late), y: 150 + late * 90, r: Math.sin(T * 0.6) });
      pose(cl1, { x: 470 + Math.sin(T * 0.1) * 24, y: 140, r: Math.sin(T * 0.6 + 1) * 1.2 });
      const inK = es(t, 0.0, 0.3, ease.out);
      left.set({ x: 390, y: 780 + (1 - inK) * 240, o: inK > 0.01 ? 1 : 0 });
      right.set({ x: 960, y: 780 + (1 - inK) * 240, o: inK > 0.01 ? 1 : 0 });
      qs.forEach((q) => { const k = es(t, 0.3 + q.i * 0.08, 0.5 + q.i * 0.08, ease.back) * (1 - es(t, 1.2, 1.35)); pose(q.el, { x: q.x, y: q.y + Math.sin(T * 1.2 + q.i) * 3, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });

      /* v22a: he comes out and cannot speak; they understand he saw a vision */
      const go = es(t, 1.0, 1.45);
      const zy = lerp(DOOR[1] + 4, ZY, go), zs = lerp(0.58, 1, go);
      const sign = seg(t, 2.05, 2.95);
      const ph = sign * PI * 3;
      z.set({ x: 800, y: zy, s: zs, flip: false, o: es(t, 0.95, 1.02), walk: go > 0 && go < 1 ? t * 30 : undefined,
        armF: 20 + bump(t, 1.5, 1.8) * 40 + (sign > 0 && sign < 1 ? 60 + Math.sin(ph) * 40 : 0),
        armB: 10 + bump(t, 1.5, 1.8) * 30 + (sign > 0 && sign < 1 ? 90 + Math.cos(ph) * 60 : 0),
        head: -bump(t, 1.5, 1.8) * 8, blink: blinkAt(T, 1) });
      pose(zGlow, { x: 800, y: zy - 110 * zs, s: zs, o: bump(t, 1.0, 1.9) * 0.7 });
      const vk = es(t, 1.55, 1.8, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(vision, { x: 480, y: 540, s: Math.max(0.001, vk), o: vk > 0.01 ? 1 : 0 });
      pose(vision2, { x: 1080, y: 540, s: Math.max(0.001, vk), o: vk > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 1.6 + i * 0.05, 2.0 + i * 0.05); pose(sp, { x: 500 + i * 300, y: 450 - kk * 40, s: 1 - kk * 0.5, r: t * 90, o: bump(t, 1.6 + i * 0.05, 2.0 + i * 0.05) }); });

      S.cam.z = 1.04 + es(t, 1.2, 1.6) * 0.04;
      S.cam.y = 10;
    };
  },
};
