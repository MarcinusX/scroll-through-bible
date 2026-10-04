// Mk 8,27–30 — on the road to the villages of Caesarea Philippi (rocky springs under snowy Hermon).
// "Who do people say that I am?" — three portraits are let down: John the Baptist, Elijah, a prophet.
// "But who do you say?" — Peter: "You are the Christ": a crown of light and anointing oil. Then: tell no one.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, cypress, bush, rock, sun, cloud, grass, reeds } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, speech, GLYPH, spark, say, tag, portrait, lightCrown, oilHorn, glory, cliff, hermon, wordSlip, LOOK, PI } from './lib.js';

const GY = 668, JX = 770;
const DIS = [
  { o: CAST.peter, k: 'peter', x: 880 }, { o: CAST.andrew, x: 650 }, { o: CAST.james, x: 590 },
  { o: CAST.john, x: 530 }, { o: CAST.matthew, x: 945 }, { o: CAST.thomas, x: 1005 },
];

export default {
  id: 'm8-caesarea',
  beats: [
    { v: 27, text: 'Potem Jezus udał się ze swoimi uczniami do wiosek pod Cezareą Filipową.' },
    { v: 27, cont: true, text: 'W drodze pytał uczniów: «Za kogo uważają Mnie ludzie?»' },
    { v: 28 },
    { v: 29, text: 'On ich zapytał: «A wy za kogo Mnie uważacie?»' },
    { v: 29, cont: true, text: 'Odpowiedział Mu Piotr: «Ty jesteś Mesjasz».' },
    { v: 30 },
  ],
  cam: { x: [-140, 80], y: [-40, 80], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const SKY = ['#bcd3de', '#e9e6d6', '#f4e9d4'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 380, y: 170, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 220), { x: 1000, y: 150, len: 700 });

    /* ---------- Hermon, hills, the cliff with its grotto and springs ---------- */
    S.layer({ par: 0.06, sh: 2 }).add(hermon(c, 1150, 470, 1100, 300) + hermon(c, 300, 470, 700, 150));
    const hills = S.layer({ par: 0.14, sh: 2 });
    const h2 = hillsWith(c, { y: 500, amps: [16, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3000 });
    hills.add(h2.markup + house(c, 160, h2.fn(160) + 8, 40, 26) + house(c, 214, h2.fn(214) + 6, 30, 22) + house(c, -120, h2.fn(-120) + 8, 36, 24));
    const cliffL = S.layer({ par: 0.26, sh: 4 });
    cliffL.add(`<g transform="translate(1080 604)">${cliff(c, 470, 230)}</g>`);
    // spring water pouring from the grotto into a pool and a brook
    const water = sheet();
    water.p(c.cut([[1250, 600], [1340, 600], [1356, 618], [1236, 618]], 0.6, 6), C.lake2);
    water.p(c.ribbon(c.qbez([1290, 612], [1200, 650], [960, 700], 16), (u) => 14 + u * 30), C.lake);
    water.x(c.ribbon(c.qbez([1290, 614], [1200, 652], [960, 702], 16), 2), C.foam, 'opacity=".7"');
    cliffL.add(water.out() + reeds(c, 1380, 618, 8, 60) + cypress(c, 1050, 606, 170) + cypress(c, 1600, 610, 190));
    const falls = cliffL.add(`<g>${Array.from({ length: 3 }, (_, i) => `<path d="${c.cut(c.ell(1270 + i * 26, 606, 10, 3, 8), 0.2, 3)}" fill="#f4f2e6" opacity=".8"/>`).join('')}</g>`);
    const groundL = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 40, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -1400, 3000, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).out());
    groundL.add(sheet().p(c.cut([[-1400, GY - 10], [3000, GY - 20], [3000, GY + 30], [-1400, GY + 40]], 1.2, 20), C.sand2).out());
    groundL.add(grass(c, { x0: -1000, x1: 2600, y: GY - 40, fn: gfn, n: 40, h: 14, color: C.olive }) + rock(c, 440, GY - 30, 70, 30, C.rock2) + olive(c, 250, GY - 34, 0.9));

    /* ---------- three portraits ---------- */
    const pL = S.layer({ par: 0.1, sh: 7 });
    const ports = [
      { o: LOOK.baptist, name: tr('Jan Chrzciciel', 'John the Baptist'), x: S.portrait ? 580 : 540 },
      { o: LOOK.elijah, name: tr('Eliasz', 'Elijah'), x: 800, extra: `<g transform="translate(34 58)"><path d="M0 0C-8 -10 -6 -22 0 -34C6 -22 8 -10 0 0Z" fill="${C.sunDeep}"/><path d="M0 -4C-3 -10 -3 -16 0 -22C3 -16 3 -10 0 -4Z" fill="${C.lampFlame}"/></g>` },
      { o: LOOK.prophet, name: tr('prorok', 'a prophet'), x: S.portrait ? 1020 : 1060 },   // phone: clear of the thread
    ].map((p, i) => ({ ...p, i, el: hanging(pL, portrait(S, p.o, p.name, { w: 118, h: 150, extra: p.extra || '' }), { x: p.x, y: 240, len: 900 }) }));

    /* ---------- the Messiah: glory, crown of light, oil ---------- */
    const glL = S.layer({ par: 0.55, sh: 1, flat: true });
    const gl = glL.add(`<g>${glory(c, 520, 24)}</g>`);

    /* ---------- people on the road ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const peterK = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.55, sh: 4 });
    const crownEl = fx.add(`<g>${lightCrown(c, 40)}</g>`);
    const horn = fx.add(`<g>${oilHorn(c)}</g>`);
    const drops = [0, 1, 2].map(() => fx.add(`<path d="M0 -8C-4 -2 -4 3 0 5C4 3 4 -2 0 -8Z" fill="${C.sun}"/>`));
    const banner = hanging(fx, tag(c, tr('Mesjasz', 'the Christ'), { size: 28, w: 170, fill: C.halo }), { x: JX, y: 190, len: 900 });
    const whoQ = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 44, h: 44 })}</g>`);
    const qs = [1, 3, 4].map((i) => ({ i, el: fx.add(`<g>${speech(c, GLYPH.q(c), { w: 36, h: 36, flip: true })}</g>`) }));
    const hush = fx.add(`<g>${speech(c, `${wordSlip(c, 34)}<path d="M-16 -12L16 12M16 -12L-16 12" stroke="${C.terracotta}" stroke-width="4" stroke-linecap="round"/>`, { w: 58, h: 46 })}</g>`);
    const peterSay = fx.add(`<g>${say(c, tr('Ty jesteś Mesjasz', 'You are the Christ'), { size: 21, side: 1 })}</g>`);

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 120, 930, 280, 110, C.rock2) + bush(c, 330, 900, 140, C.sage) + rock(c, 1500, 920, 220, 100, C.rock) + bush(c, 1640, 900, 160, C.moss));

    return (t, time) => {
      const T = time;
      const lum = es(t, 4.05, 4.4) * (1 - es(t, 5.1, 5.6) * 0.88);
      sk.blend(SKY, ['#e8d9b0', '#f6ebc9', '#fbf1d6'], lum * 0.8);
      swing(sunEl, 380, 170, T, 1.1, 0.7);
      swing(cl1, 1000 + Math.sin(T * 0.1) * 26, 150, T, 1.4, 0.6, 1);
      pose(falls, { x: Math.sin(T * 2) * 3, y: 0 });

      /* v27a — walking the road; v27b — He stops and asks */
      const WE = S.portrait ? 0.7 : 0.92;   // phone: they have arrived by x.75, no one half off the left edge
      const walkK = [[0, 0], [WE, 1]];
      const u = kf(t, walkK, (x) => x);
      const walking = t > 0 && t < WE;
      const off = (1 - u) * -700;
      const ask1 = bump(t, 1.05, 1.95);
      const ask2 = bump(t, 3.05, 3.95);
      const hushK = es(t, 5.05, 5.3);
      jesus.set({ x: JX + off, y: GY, s: 0.95, flip: false, walk: walking ? off * 0.05 : undefined, armF: 16 + ask1 * 50 + ask2 * 70 + hushK * 60, armB: 8 + ask1 * 20 + ask2 * 30 + hushK * 130, head: lum * -8 + hushK * 4, blink: blinkAt(T) });
      const kneel = es(t, 4.12, 4.2) * (1 - es(t, 5.5, 5.58));
      dis.forEach((d) => {
        const x = d.x + off * 0.94 - (d.k === 'peter' ? es(t, 4.02, 4.15) * 20 : 0);
        const turn = t > 0.95;
        const look = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
        const eachOther = bump(t, 3.1, 3.95);
        const awe = es(t, 4.2, 4.5);
        const nod = bump(t, 5.2, 5.9);
        d.p.set({
          x, y: GY + 4 + (d.i % 2) * 8, s: 0.86, flip: turn ? (d.x > JX) !== (eachOther > 0.3 && d.i % 2 === 0) : false,
          o: d.k === 'peter' ? 1 - kneel : 1,
          walk: walking ? x * 0.05 + d.i : undefined,
          armF: 20 + look * (d.i < 3 ? 70 : 10) + awe * (d.i % 2 ? 50 : 30) + (d.k === 'peter' ? bump(t, 4.0, 4.3) * 60 : 0),
          armB: 10 + look * (d.i >= 3 ? 110 : 20) + eachOther * 40,
          head: -look * 20 - awe * 10 + nod * 14 * Math.sin(T * 6), blink: blinkAt(T, d.seed),
        });
      });
      peterK.set({ x: 880 - 20, y: GY + 4, s: 0.86, flip: true, o: kneel, armF: 60 + lum * 30, armB: 40, head: -14, blink: blinkAt(T, 1) });

      /* v28 — the portraits; they fly out on v29 */
      ports.forEach((p) => {
        const on = es(t, 2.05 + p.i * 0.15, 2.4 + p.i * 0.15, ease.back) * (1 - es(t, 3.0 + p.i * 0.05, 3.3 + p.i * 0.05));
        swing(p.el, p.x, 240 - (1 - on) * 700, T, 1.2, 0.8, p.i * 2);
      });

      /* v29 — the question, the confession, the light */
      const [hx, hy] = headAt(JX, GY, 0.95, false);
      const wq = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.95, 2.05)) + es(t, 3.15, 3.3, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(whoQ, { x: hx + 12, y: hy - 30, s: wq, o: wq > 0.02 ? 1 : 0 });
      qs.forEach((q, j) => {
        const k = es(t, 3.3 + j * 0.1, 3.45 + j * 0.1, ease.back) * (1 - es(t, 3.95, 4.05));
        const d = dis[q.i];
        pose(q.el, { x: d.x - 10, y: GY - 220, s: k * 0.9, r: Math.sin(T * 2 + j) * 5, o: k > 0.02 ? 1 : 0 });
      });
      const ps = es(t, 4.08, 4.25, ease.back) * (1 - es(t, 4.95, 5.05));
      pose(peterSay, { x: S.portrait ? 836 : 876, y: GY - 150, s: ps, o: ps > 0.02 ? 1 : 0 });
      pose(gl, { x: hx, y: hy + 10, s: 0.5 + lum * 0.6, r: T * 3, o: lum });
      const cr = es(t, 4.2, 4.55);
      pose(crownEl, { x: hx, y: hy - 38 - (1 - cr) * 220, s: 0.7 + cr * 0.3, o: cr * (1 - es(t, 5.3, 5.8) * 0.6) });
      const hornOn = bump(t, 4.3, 5.0);
      pose(horn, { x: hx + 26, y: hy - 70 - (1 - Math.min(1, hornOn * 2)) * 100, r: -hornOn * 38, o: hornOn > 0.02 ? 1 : 0 });
      drops.forEach((d, i) => {
        const k = ((T * 0.9 + i / 3) % 1);
        pose(d, { x: hx + 22 - k * 16, y: hy - 64 + k * 50, s: 1.2, o: hornOn > 0.3 ? Math.sin(k * PI) : 0 });
      });
      const bn = es(t, 4.25, 4.6, ease.back) * (1 - es(t, 5.1, 5.4));
      swing(banner, JX, 150 - (1 - bn) * 600, T, 1, 0.8, 4);

      /* v30 — tell no one */
      const hs = es(t, 5.15, 5.3, ease.back) * (1 - es(t, 5.95, 6));
      pose(hush, { x: hx + 16, y: hy - 30, s: hs, o: hs > 0.02 ? 1 : 0 });

      S.cam.x = lerp(-160, 0, es(t, 0, 0.95));
      S.cam.z = 1.04 + es(t, 0.9, 1.3) * 0.1 - es(t, 1.95, 2.3) * 0.08 + es(t, 3.9, 4.4) * 0.14 - es(t, 5, 5.5) * 0.08;
      S.cam.y = 20 + es(t, 0.9, 1.3) * 40 - es(t, 1.95, 2.3) * 70 + es(t, 3.9, 4.4) * 30 - es(t, 5, 5.5) * 10;
    };
  },
};
