// Mk 7,5–9 — "Why don't your disciples walk according to the tradition of the elders?"
// Jesus answers with Isaiah: a paper face honours God with its lips while its heart drifts far away;
// the stone tablets of God's commandment are set aside for a heap of little human rule-scrolls.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  hand, headAt, pharisee, bubble, nameTag, scrollOpen, profileFace, heart, spark, scrap, tablets, ruleScroll, scrollPile, hang2, plate, bigHand, loaf,
} from './lib.js';

const PI = Math.PI;
const FLOOR = 690;
const JX = 800;
const GLOW = { x: 860, y: 205 };   // "Me": the light the lips speak towards
const FACE = { x: 640, y: 300 };    // the paper face (origin at its mouth)

export default {
  id: 'm7-isaiah',
  beats: [
    { v: 5 },
    { v: 6, text: 'Odpowiedział im: «Słusznie prorok Izajasz powiedział o was, obłudnikach, jak jest napisane:' },
    { v: 6, cont: true, text: 'Ten lud czci Mnie wargami, lecz sercem swym daleko jest ode Mnie.' },
    { v: 7 },
    { v: 8 },
    { v: 9 },
  ],
  cam: { x: [-60, 40], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SKY = ['#d3e3dc', '#f1e7cd', '#f8ecd6'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1210, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 160), { x: 420, y: 150, len: 700 });

    /* ---------- the same lakeside courtyard, closer ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 380, amps: [26, 9, 3], lens: [1200, 400, 140], color: C.hillFar }).markup);
    S.layer({ par: 0.14, sh: 1 }).add(waterBand(c, { y: 440, color: C.lake, foamN: 14, bottom: 900 }).markup);
    const hills = S.layer({ par: 0.24, sh: 3 });
    const h2 = hillsWith(c, { y: 494, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + palm(c, 1330, h2.fn(1330) + 16, 150) + palm(c, 250, h2.fn(250) + 16, 130));
    const yard = S.layer({ par: 0.45, sh: 3 });
    const ws = sheet();
    ws.p(c.cut([[-900, 540], [2500, 540], [2500, 626], [-900, 626]], 1, 20), mix(C.plaster, C.sand, 0.25));
    ws.p(c.cut([[-900, 532], [2500, 532], [2500, 544], [-900, 544]], 0.6, 12), C.stone2);
    let blotch = '';
    for (let i = 0; i < 12; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(560, 610), c.rr(18, 40), c.rr(6, 12), 9, 0.2), 0.6, 5);
    ws.x(blotch, C.plaster2, 'opacity=".6"');
    yard.add(olive(c, 1080, 540, 1, { leaf: C.moss, leaf2: C.leaf }));
    yard.add(ws.out());
    yard.add(bush(c, 380, 626, 90, C.sage, C.moss) + bush(c, 1230, 626, 100, C.sage, C.moss));
    const floor = S.layer({ par: 0.55, sh: 3 });
    const fl = sheet();
    fl.p(c.cut([[-900, 620], [2500, 620], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand, C.sand2, 0.4));
    let flags = '';
    for (let r = 0; r < 5; r++) { const y = 636 + r * r * 9 + r * 18; flags += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4); }
    fl.x(flags, shade(C.sand2, -0.15), 'opacity=".5"');
    floor.add(fl.out());

    /* ---------- people ---------- */
    const ppl = S.layer({ par: 0.6, sh: 5 });
    const PH = [
      { i: 3, x: 432 }, { i: 4, x: 484 }, { i: 1, x: 540 }, { i: 2, x: 594 }, { i: 0, x: 650 },
    ].map((m, j) => ({ ...m, j, seed: c.rr(0, 9), p: S.puppet(ppl.add(pharisee(c, m.i))) }));
    if (P) PH.forEach((m, j) => { m.x = 540 + j * 36; });   // phone: both groups closer in, no one under the frame or the thread
    const DS = [
      { o: CAST.peter, x: 960 }, { o: CAST.andrew, x: 1016 }, { o: CAST.james, x: 1076 }, { o: CAST.john, x: 1132 }, { o: CAST.thomas, x: 1186 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(ppl.add(person(c, d.o))) }));
    if (P) DS.forEach((d, i) => { d.x = 912 + i * 36; });
    const jesus = S.puppet(ppl.add(person(c, { ...CAST.jesus })));
    // scrolls in the Pharisees' hands (v7–9)
    const held = PH.map((m, j) => ppl.add(`<g>${ruleScroll(c, [C.terracotta, C.teal2, C.ochre, C.plumRobe, C.moss][j], 1.1)}</g>`));

    /* ---------- speech & the flies ---------- */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const ask = fx.add(`<g>${bubble(c, tr('Dlaczego…?', 'Why…?'), { size: 24, tail: 1 })}</g>`);
    const askPlate = fx.add(`<g>${plate(c, `<g transform="translate(-8 4) scale(.8)">${bigHand(c, { dirty: true })}</g><g transform="translate(34 -10)">${loaf(c, 12)}</g>`, { r: 50 })}</g>`);
    // Isaiah's scroll on two strings
    const isaiah = fx.add(`<g>${hang2(`${scrollOpen(c, 250, 120)}<g transform="translate(0 70)">${nameTag(c, tr('Izajasz', 'Isaiah'), { size: 20 })}</g>`, 110, 400)}</g>`);
    // the light of "Me", the face with its lips, the heart drifting away
    const glow = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, 30, 12, 8, 0), 0.4, 4), C.halo).p(c.cut(c.circ(0, 0, 11, 12), 0.3, 3), C.star).out()}</g>`);
    const pf = profileFace(c, 1.15);
    const face = hanging(fx, `${pf.face}<g data-g="lipU">${pf.lipU}</g><g data-g="lipL">${pf.lipL}</g>`, { x: FACE.x, y: FACE.y, len: 600 });
    const lipU = face.querySelector('[data-g="lipU"]'), lipL = face.querySelector('[data-g="lipL"]');
    const heartEl = hanging(fx, `<g transform="translate(0 30)">${heart(c, 30)}</g>`, { x: FACE.x, y: FACE.y + 60, len: 700 });
    const praise = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, 9)}</g>`), ph: i / 6 }));
    const vain = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${scrap(c, 8)}</g>`), ph: i / 6, dx: c.rr(-30, 30) }));
    const rules = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${ruleScroll(c, [C.terracotta, C.teal2, C.ochre, C.plumRobe, C.moss][i], 1.6)}</g>`) }));
    // God's commandment: the stone tablets; the human tradition: a heap of rule-scrolls on a board
    const tab = hanging(fx, `<g transform="translate(0 150)">${tablets(c, { w: 92, h: 128 })}</g>`, { x: JX, y: 170, len: 700 });
    const tabGlow = tab.querySelector('[data-g="iv"]');
    const board = sheet().p(c.cut(c.rect(-110, 0, 220, 12), 0.4, 8), C.wood).out();
    const pile = fx.add(`<g>${hang2(`${board}<g>${scrollPile(c, 15, 190)}</g><g transform="translate(0 46)">${nameTag(c, tr('tradycja ludzka', 'human tradition'), { size: 15 })}</g>`, 100, 400)}</g>`);
    const extra = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${ruleScroll(c, [C.terracotta, C.teal2, C.ochre, C.plumRobe][i % 4], 1.2)}</g>`), x: c.rr(-90, 90), r: c.rr(60, 120) }));

    const PILE = P ? 950 : 1080;   // phone: the heap of scrolls ends up inside the frame
    return (t, time) => {
      const T = time;
      swing(sunEl, 1210, 140, T, 1, 0.6);
      swing(cl1, 420 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.7, 1);

      /* v5 — the question */
      const asking = es(t, 0.1, 0.4) * (1 - es(t, 0.95, 1.2));
      const cling = es(t, 3.2, 3.5);                 // they take up their scrolls (v7–9)
      const hug = es(t, 4.2, 4.5);
      PH.forEach((m, j) => {
        const lead = j === 4;
        const step = lead ? es(t, 0.05, 0.35) * 40 * (1 - es(t, 1.2, 1.5)) : 0;
        const back = es(t, 1.1, 1.4) * (6 + j * 2);
        const x = m.x + step - back;
        const armF = lead ? asking * 90 + (1 - asking) * cling * 70 : cling * 70;
        m.p.set({ x, y: FLOOR - 4 + (j % 2) * 6, s: 0.92, armF: armF - hug * 14, armB: hug * 60, head: -asking * 4 + hug * 6, lean: -es(t, 1.1, 1.4) * 4, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(x, FLOOR - 4 + (j % 2) * 6, 0.92, false, armF - hug * 14);
        pose(held[j], { x: hx + 2, y: hy - 6, r: 70 - hug * 60, o: es(t, 3.25 + j * 0.05, 3.35 + j * 0.05) });
      });
      const [ax, ay] = headAt(PH[4].x + 40, FLOOR, 0.92, false);
      const askK = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.95, 1.1));
      pose(ask, { x: ax + 30, y: ay - 26, s: askK, o: askK > 0.02 ? 1 : 0 });
      const plK = es(t, 0.3, 0.55, ease.back) * (1 - es(t, 0.95, 1.1));
      pose(askPlate, { x: 900, y: 360 - (1 - plK) * 30, s: plK * 0.9, o: plK > 0.02 ? 1 : 0 });
      DS.forEach((d) => {
        const look = es(t, 0.35 + d.i * 0.05, 0.6 + d.i * 0.05) * (1 - es(t, 1.0, 1.3));
        d.p.set({ x: d.x, y: FLOOR + 4 - (d.i % 2) * 8, s: 0.9, flip: true, armF: look * 70, head: look * 16, blink: blinkAt(T, d.seed) });
      });

      /* Jesus answers (v6–9) */
      const speak = es(t, 1.05, 1.3);
      const toHeaven = es(t, 1.9, 2.2) * (1 - es(t, 3.0, 3.3));
      const toTablet = es(t, 4.0, 4.3);
      jesus.set({
        x: JX, y: FLOOR + 8, s: 1.02, flip: true,
        armF: 14 + speak * (40 + Math.sin(T * 1.5) * 8 * (1 - toHeaven)) + toHeaven * 20 - toTablet * 10 + bump(t, 5.1, 5.9) * 30,
        armB: 8 + toHeaven * 120 + toTablet * 110 * (1 - es(t, 5.0, 5.3)) + speak * 10,
        head: -toHeaven * 14 - toTablet * 10 * (1 - es(t, 5.0, 5.3)) + es(t, 5.0, 5.3) * 6, blink: blinkAt(T),
      });

      /* v6a — Isaiah's scroll comes down */
      const isK = es(t, 1.15, 1.55, ease.out) * (1 - es(t, 1.95, 2.3, ease.in));
      pose(isaiah, { x: JX, y: 250 - (1 - isK) * 1150 + Math.sin(T * 0.8) * 2, r: Math.sin(T * 0.7) * 0.8, o: isK > 0.01 ? 1 : 0 });

      /* v6b — lips near, heart far; v7 — worship in vain, human rules */
      const faceK = es(t, 1.95, 2.35, ease.out) * (1 - es(t, 3.95, 4.25, ease.in));
      swing(face, FACE.x, FACE.y - (1 - faceK) * 1150, T, 0.8, 0.6, 1);
      const talk = faceK > 0.5 ? Math.max(0, Math.sin(T * 7)) * es(t, 2.2, 2.4) * (1 - es(t, 3.9, 4.0)) : 0;
      pose(lipU, { y: -talk * 3 });
      pose(lipL, { y: talk * 5 });
      const glowK = es(t, 1.95, 2.3) * (1 - es(t, 3.95, 4.2));
      pose(glow, { x: GLOW.x, y: GLOW.y + Math.sin(T * 0.9) * 3, s: 0.7 + glowK * 0.3, o: glowK });
      const away = es(t, 2.35, 2.95, ease.io);
      const hx = lerp(FACE.x - 20, P ? 505 : 450, away), hy = lerp(FACE.y + 90, 440, away) - (1 - faceK) * 1150;
      swing(heartEl, hx, hy, T, 2.2, 0.9, 2);
      pose(heartEl.querySelector('.obj'), { s: 1 - away * 0.5, o: faceK > 0.01 ? 1 : 0 });
      const mouth = [FACE.x + 12, FACE.y - (1 - faceK) * 1150];
      praise.forEach((p) => {
        const on = es(t, 2.3, 2.5) * (1 - es(t, 3.0, 3.15));
        const k = ((T * 0.35 + p.ph) % 1);
        const x = lerp(mouth[0], GLOW.x - 30, k), y = lerp(mouth[1], GLOW.y + 20, k) - Math.sin(k * PI) * 40;
        pose(p.el, { x, y, s: 0.6 + k * 0.3, o: on * Math.min(1, k * 6) * (1 - k * 0.3) });
      });
      vain.forEach((p) => {
        const on = es(t, 3.0, 3.15) * (1 - es(t, 3.9, 4.0));
        const k = ((T * 0.4 + p.ph) % 1);
        const x = mouth[0] + 20 + k * 90 + p.dx * k, y = mouth[1] - 30 + k * k * 260 - Math.sin(k * PI) * 60;
        pose(p.el, { x, y, r: k * 200, s: 0.8, o: on * Math.min(1, k * 6) * (1 - k) });
      });
      rules.forEach((r) => {
        const k = es(t, 3.12 + r.i * 0.1, 3.5 + r.i * 0.1);
        const m = PH[r.i];
        const [tx, ty] = headAt(m.x, FLOOR, 0.92, false);
        const x = lerp(mouth[0] + 10, tx + 10, k), y = lerp(mouth[1], ty - 30, k) - Math.sin(k * PI) * 80;
        pose(r.el, { x, y, r: k * 340, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });

      /* v8 — the tablets set aside; the Pharisees hold on to their heap of scrolls */
      const tabK = es(t, 4.0, 4.35, ease.out);
      const aside = es(t, 4.45, 4.95);
      const tx = lerp(JX, P ? 1020 : 1120, aside), ty = 170 - (1 - tabK) * 1150 + aside * 40;
      pose(tab, { x: tx, y: ty + Math.sin(T * 0.8) * 2, r: aside * 16 + Math.sin(T * 0.7) * 0.6 });
      fade(tabGlow, tabK * (1 - aside) * 0.9);
      pose(tab.querySelector('.obj'), { s: 1 - aside * 0.22, o: tabK > 0.01 ? 1 - aside * 0.25 : 0 });
      const pileK = es(t, 4.5, 4.9, ease.back);
      const pileX = lerp(P ? 620 : 560, PILE, es(t, 5.1, 5.6));
      pose(pile, { x: pileX, y: 300 - (1 - pileK) * 1150 + aside * 0 + Math.sin(T * 0.8 + 1) * 2, o: pileK > 0.01 ? 1 : 0 });

      /* v9 — "full well do you set aside": more scrolls pile up in front of the tablets */
      extra.forEach((e) => {
        const k = es(t, 5.25 + e.i * 0.06, 5.55 + e.i * 0.06, ease.out);
        pose(e.el, { x: PILE + e.x * 0.9, y: lerp(-80, 270 - (e.i % 3) * 22 - Math.floor(e.i / 3) * 14, k), r: e.r, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 0.0, 0.8) * 0.03 + es(t, 1.9, 2.4) * 0.03 - es(t, 4.0, 4.4) * 0.03;
      S.cam.y = -es(t, 1.1, 1.6) * 40 + es(t, 4.0, 4.4) * 10;
      S.cam.x = es(t, 4.4, 5.0) * 30;
    };
  },
};
