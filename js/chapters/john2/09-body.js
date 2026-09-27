// J 2,21–22 — "He spoke of the temple of His body": at dusk a golden outline lifts off the sanctuary,
// floats down and closes round Jesus, becoming a glowing outline of His own body. After He was raised —
// a hanging plate with the open tomb at sunrise and three day-suns — the disciples remember His word;
// and they believe the Scripture and the word He had spoken: the scroll and the word shine, lights kindle.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, DISC, templeOutline, shadowPerson, dayDisc, tombIcon, thought, heart, sparkle, verseScroll, wordTag, skyKeys, tr, PI } from './lib.js';

const FLOOR = 684;
const DUSK = ['#6d6a9a', '#c9909a', '#eab596'];
const DAWN = ['#a7b7cf', '#f2c7a4', '#f8dfb6'];

export default {
  id: 'j2-body',
  beats: [
    { v: 21 },
    { v: 22, text: 'Gdy więc zmartwychwstał, przypomnieli sobie uczniowie Jego, że to powiedział,' },
    { v: 22, cont: true, text: 'i uwierzyli Pismu i słowu, które wyrzekł Jezus.' },
  ],
  cam: { x: [0, 0], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const T0 = templeCourt(S, { skyCols: DUSK, floorY: FLOOR + 40, sanctX: 800, sunAt: [1210, 330] });
    const IW = FLOOR + 40 - 150;
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#221c46"/>`);

    /* the plate of the rising, the three days, the scroll and the word */
    const flyL = S.layer({ par: 0.12, sh: 6 });
    const plate = hanging(flyL, `<circle r="170" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.circ(0, 0, 96, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 90, 40), 0.5, 5), '#f7e3c4').out()}<g transform="translate(0 -6) scale(1.9)">${tombIcon(c, { open: true })}</g><path d="${c.cut([[-88, 30], [88, 30], [80, 60], [-80, 60]], 0.3, 6)}" fill="${mix(C.sage, C.sand, 0.4)}"/>`, { x: 0, y: 0, len: 800 });
    const days = ['I', 'II', 'III'].map((n, i) => { const el = hanging(flyL, dayDisc(c, n, 18), { x: 0, y: 0, len: 800 }); return { el, lit: el.querySelector('.lit'), i }; });
    const V = verseScroll(c, [tr('Pismo', 'the Scripture')], { w: 190, size: 24 });
    const scrollEl = hanging(flyL, `<circle cx="0" cy="40" r="120" fill="url(#warm-glow)" class="sg"/>${V.rodTop}${V.sheet}<g transform="translate(0 ${V.h})">${V.rodBottom}</g>`, { x: 0, y: 0, len: 800 });
    const wordEl = hanging(flyL, `<circle cx="0" cy="24" r="110" fill="url(#warm-glow)" class="sg"/>${wordTag(c, tr('słowo Jezusa', 'the word of Jesus'), { size: 22, w: 200 })}`, { x: 0, y: 0, len: 800 });

    /* Jesus, the disciples */
    const L = S.layer({ par: 0.5, sh: 6 });
    const glowSil = L.add(shadowPerson(c, CAST.jesus, C.halo));
    const glowG = L.add(`<g><circle r="220" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const sil = S.puppet(glowSil);
    const outline = L.add(`<g>${templeOutline(c, 1, C.sun, 5)}</g>`);
    const dis = [
      { o: DISC[2], x: 470 }, { o: DISC[0], x: 555 }, { o: DISC[1], x: 640 }, { o: DISC[3], x: 965, f: true }, { o: DISC[4], x: 1060, f: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const mem = [0, 1].map((i) => L.add(`<g>${thought(c, `<g transform="translate(0 22) scale(.2)">${templeOutline(c, 1, C.terracotta, 9)}</g>`, { w: 70, h: 60 })}</g>`));
    const lights = dis.map(() => L.add(`<g>${heart(c, 11, C.jesusMantle)}</g>`));
    const sparks = Array.from({ length: 8 }, (_, i) => ({ i, el: L.add(`<g>${sparkle(c, c.rr(8, 13))}</g>`), a: (i / 8) * PI * 2 }));

    return (t, time) => {
      const T = time;
      skyKeys(T0.sk, t, [[0, DUSK], [1.0, DUSK], [1.4, DAWN]]);
      swing(T0.sunEl, 1210, lerp(420, 170, es(t, 1.0, 1.6)), T, 1, 0.6);
      swing(T0.cl1, 470, 140, T, 1.3, 0.6, 1);
      tint.fade(0.34 * (1 - es(t, 1.0, 1.5)) + 0.08);

      /* v21 — the outline lifts off the sanctuary and closes round Him */
      const lift = es(t, 0.1, 0.35);
      const fly = es(t, 0.3, 0.75);
      const become = es(t, 0.7, 0.95);
      const ox = 800, oy = lerp(IW - lift * 30, FLOOR + 16, fly), os = lerp(1.3, 1.16, fly);
      pose(outline, { x: ox, y: oy, s: os, o: lift * (1 - become) });
      sil.set({ x: 800, y: FLOOR + 22, s: 1.12 + 0.05 * become, o: become * 0.9 });
      pose(glowG, { x: 800, y: FLOOR - 110, s: 0.7 + become * 0.4 + es(t, 1.0, 1.4) * 0.3, o: 0.3 + become * 0.6 });
      jesus.set({ x: 800, y: FLOOR + 16, s: 1.08, armF: 20 + bump(t, 0, 0.9) * 40 + es(t, 1.1, 1.5) * 40, armB: 10 + es(t, 1.1, 1.5) * 100, head: -es(t, 1.1, 1.5) * 4, blink: blinkAt(T, 1) });
      sparks.forEach((sp) => {
        const k = become * (1 - es(t, 2.6, 3));
        const a = sp.a + T * 0.3 + t * 0.5;
        pose(sp.el, { x: 800 + Math.cos(a) * 130 * k, y: FLOOR - 110 + Math.sin(a) * 150 * k, s: 0.4 + 0.6 * k, r: T * 30, o: k * 0.9 });
      });

      /* v22a — after He was raised: the tomb plate, three days; they remember */
      const pk = es(t, 1.05, 1.4, ease.out);
      pose(plate, { x: 800, y: 222 - (1 - pk) * 560, r: (1 - pk) * 4 });
      days.forEach((d) => {
        fade(d.lit, es(t, 1.3 + d.i * 0.1, 1.4 + d.i * 0.1));
        pose(d.el, { x: 690 + d.i * 110, y: 362 - (1 - pk) * 560, r: (1 - pk) * (d.i - 1) * 4 });
      });
      mem.forEach((m, i) => {
        const k = es(t, 1.45 + i * 0.1, 1.7 + i * 0.1, ease.back) * (1 - es(t, 2.05, 2.2));
        pose(m, { x: i ? 990 : 540, y: FLOOR - 200, s: (0.3 + 0.7 * k) * 1.2, o: k });
      });

      /* v22b — Scripture and the word shine; they believe */
      const sk = es(t, 2.05, 2.4, ease.out);
      pose(scrollEl, { x: 560, y: 200 - (1 - sk) * 560, r: (1 - sk) * -5 });
      pose(wordEl, { x: 1040, y: 230 - (1 - es(t, 2.15, 2.5, ease.out)) * 560, r: (1 - es(t, 2.15, 2.5)) * 5 });
      dis.forEach((d, i) => {
        const up = es(t, 1.2, 1.5);
        const bel = es(t, 2.3 + i * 0.06, 2.6 + i * 0.06);
        d.p.set({ x: d.x, y: FLOOR + 4 - (i % 2) * 8, s: 1, flip: !!d.f, armF: 20 + up * 30 + bel * 40, armB: 10 + bel * (i % 2 ? 90 : 30), head: -up * 12 + bel * 6, blink: blinkAt(T, d.seed) });
        const lk = es(t, 2.4 + i * 0.07, 2.65 + i * 0.07, ease.back);
        pose(lights[i], { x: d.x + (d.f ? -8 : 8), y: FLOOR - 225, s: lk, o: lk });
      });

      S.cam.z = 1.02 + es(t, 0.3, 0.9) * 0.08 - es(t, 1.0, 1.4) * 0.08 + es(t, 2.2, 2.9) * 0.03;
      S.cam.y = 20 + es(t, 0.3, 0.9) * 30 - es(t, 1.0, 1.4) * 40;
    };
  },
};
