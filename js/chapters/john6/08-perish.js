// J 6,26–30 — on the shore at Capernaum. "You seek Me not because you saw signs, but because you ate your fill":
// the two sign-medallions hang unnoticed while every head is full of loaves. Two plates come down: a loaf that
// goes stale and crumbles away, and a loaf of light inside a ring without end — "which the Son of Man will give";
// the Father's seal (a golden seal of light) is pressed upon Him. "What must we do?" — hammers, sickles, coins,
// scrolls. "Believe in the One He sent": one thread of light, and small hearts kindle. "What sign? What work?"
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { sickle } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { capShore, MORNING, folk, signMedal, loafIcon, waveIcon, barleyLoaf, crumb, breadOfLight, eternityRing, drawRing, radiance, lightSeal, sealMark, hungPlate, thought, speech, GLYPH, heart, coinStack, scrollOpen, eyeIcon, labelTag, headAt, hand, kf, tr, PI } from './lib.js';
import { hammer } from '../mark6/lib.js';

const JX = 800, JY = 718;

export default {
  id: 'j6-perish',
  beats: [
    { v: 26 },
    { v: 27, text: 'Troszczcie się nie o ten pokarm, który ginie, ale o ten, który trwa na wieki, a który da wam Syn Człowieczy;' },
    { v: 27, cont: true, text: 'Jego to bowiem pieczęcią swą naznaczył Bóg Ojciec».' },
    { v: 28 },
    { v: 29 },
    { v: 30, text: 'Rzekli do Niego: «Jakiego więc dokonasz znaku, abyśmy go widzieli i Tobie uwierzyli?' },
    { v: 30, cont: true, text: 'Cóż zdziałasz?' },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const K = capShore(S, { skyCols: MORNING, sunAt: [420, 190], beachY: 650 });

    /* the Father's light above (never a figure), the seal */
    const hi = S.layer({ par: 0.06, sh: 4 });
    const rad = hi.add(`<g><circle r="260" fill="url(#halo-glow)"/>${radiance(c, 70)}</g>`);
    const beam = hi.add(`<path d="${c.poly([[-30, 0], [30, 0], [110, 640], [-110, 640]])}" fill="#fff4d0" opacity="0"/>`);

    /* the crowd and Jesus */
    const L = S.layer({ par: 0.5, sh: 5 });
    const PEO = [[420, true], [510, false], [590, true], [660, false], [940, true], [1020, false], [1100, true], [1180, false]].map(([x, man], i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, man)))) }));
    const jGlow = L.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const mark = L.add(`<g>${sealMark(c, 11)}</g>`);

    /* hanging things */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const m4 = hanging(fx, signMedal(c, 4, loafIcon(c), 40), { x: 0, y: 0, len: 900 });
    const m5 = hanging(fx, signMedal(c, 5, waveIcon(c), 40), { x: 0, y: 0, len: 900 });
    const bellies = PEO.map((m, i) => fx.add(`<g>${thought(c, `<g transform="translate(0 8)">${barleyLoaf(c, 13)}</g>`, { w: 46, h: 38 })}</g>`));
    // the loaf that perishes: a plate whose loaf greys and falls apart
    const pL = fx.add(`<g>${hungPlate(c, '', { r: 70 })}</g>`);
    const stale = fx.add(`<g>${barleyLoaf(c, 42)}</g>`);
    const staleGrey = fx.add(`<g>${sheet().p(c.cut(c.arc(0, -2, 42, 26, PI, 2 * PI, 12).concat([[40, 0], [-40, 0]]), 0.3, 4), mix(C.stone2, C.olive, 0.3)).out()}</g>`);
    const bits = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g>${crumb(c, 7)}</g>`), dx: c.rr(-30, 30) }));
    // the food that endures: a loaf of light inside a ring without end
    const pR = fx.add(`<g>${hungPlate(c, '', { r: 70, fill: mix(C.cream, C.halo, 0.4) })}</g>`);
    const lightLoaf = fx.add(`<g>${breadOfLight(c, 30)}</g>`);
    const ring = fx.add(`<g>${eternityRing(c, 58, 5, 22)}</g>`);
    const seal = fx.add(`<g>${lightSeal(c, 40)}</g>`);
    // works: tools in speech bubbles
    const WORKS = [hammer(c), `<g transform="scale(.7)">${sickle(c)}</g>`, `<g transform="translate(0 10)">${coinStack(c, 6, 10)}</g>`, `<g transform="scale(.6)">${scrollOpen(c, 80, 54)}</g>`];
    const works = [0, 2, 5, 7].map((pi, i) => ({ m: PEO[pi], i, el: fx.add(`<g>${speech(c, `<g transform="scale(.8)">${WORKS[i]}</g>`, { w: 60, h: 52, flip: PEO[pi].x > JX })}</g>`) }));
    const hearts = PEO.map(() => fx.add(`<g>${heart(c, 8)}</g>`));
    const eyesQ = [1, 3, 4, 6].map((pi, i) => ({ m: PEO[pi], i, el: fx.add(`<g>${speech(c, `<g transform="translate(-12 0)">${eyeIcon(c, true, 12)}</g><g transform="translate(14 0) scale(.7)">${GLYPH.q(c)}</g>`, { w: 66, h: 44, flip: PEO[pi].x > JX })}</g>`) }));
    const qTags = PEO.map(() => fx.add(`<g>${labelTag('?', 18)}</g>`));

    return (t, time) => {
      const T = time;
      K.update(T);
      const [jhx, jhy] = headAt(JX, JY, 1.08, false);

      /* v26 — signs unnoticed; loaves in every head */
      const sg = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.95, 1.1)) + es(t, 5.05, 5.35, ease.out) * (1 - es(t, 6.9, 7.0));
      pose(m4, { x: 700, y: lerp(-500, 290, sg), r: Math.sin(T * 0.9) * 2, o: sg > 0.01 ? 1 : 0 });
      pose(m5, { x: 900, y: lerp(-500, 300, sg), r: Math.sin(T * 0.9 + 1) * 2, o: sg > 0.01 ? 1 : 0 });
      bellies.forEach((bl, i) => {
        const m = PEO[i];
        const k = es(t, 0.3 + i * 0.05, 0.45 + i * 0.05, ease.back) * (1 - es(t, 0.95, 1.05));
        const [hx, hy] = headAt(m.x, JY, 0.94, m.x > JX);
        pose(bl, { x: hx - 6, y: hy - 18, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });

      /* v27a — the food that perishes / the food that endures */
      const pk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.0, 2.2));
      const PY = lerp(-500, 320, pk);
      pose(pL, { x: 560, y: PY, r: Math.sin(T * 0.8) * 1.2, o: pk > 0.01 ? 1 : 0 });
      pose(pR, { x: 1040, y: PY, r: Math.sin(T * 0.8 + 1) * 1.2, o: pk > 0.01 ? 1 : 0 });
      const rot = es(t, 1.3, 1.7);
      pose(stale, { x: 560, y: PY + 16, o: pk > 0.01 ? (1 - rot) * (1 - es(t, 1.7, 1.8)) : 0 });
      pose(staleGrey, { x: 560, y: PY + 16, sx: 1 - es(t, 1.65, 1.85) * 0.6, sy: 1 - es(t, 1.65, 1.85) * 0.7, oy: 0, o: pk > 0.01 ? rot * (1 - es(t, 1.8, 1.9)) : 0 });
      bits.forEach((b) => {
        const k = es(t, 1.7 + b.i * 0.02, 1.95 + b.i * 0.02, ease.in);
        pose(b.el, { x: 560 + b.dx, y: PY + 10 + k * 160, r: k * 180, s: 0.8, o: k > 0.01 && k < 0.98 ? (1 - k) : 0 });
      });
      const lk = es(t, 1.25, 1.5);
      pose(lightLoaf, { x: 1040, y: PY + 4, s: 0.6 + lk * 0.4, o: pk > 0.01 ? lk : 0 });
      drawRing(ring, es(t, 1.35, 1.9));
      pose(ring, { x: 1040, y: PY, r: t * 20, o: pk > 0.01 ? 1 : 0 });

      /* v27b — God the Father has set His seal on Him */
      const rk = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2)) + es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.1));
      pose(rad, { x: JX, y: 190, s: 0.8 + rk * 0.3, r: T * 3, o: rk });
      const press = es(t, 2.3, 2.6, ease.in);
      const lift = es(t, 2.65, 2.9, ease.out);
      pose(seal, { x: JX + 6, y: lerp(230, JY - 118, press) - lift * 120, s: 1 - press * 0.3, o: es(t, 2.2, 2.3) * (1 - es(t, 2.85, 3.0)) });
      const mk = es(t, 2.58, 2.66);
      pose(mark, { x: JX + 8, y: JY - 116, o: mk * (1 - es(t, 6.8, 7.0) * 0.4) });
      pose(beam, { x: JX, y: 190, o: (bump(t, 2.3, 3.0) + bump(t, 4.1, 4.95)) * 0.5 });
      pose(jGlow, { x: JX, y: JY - 150, s: 0.8 + bump(t, 2.5, 3.0) * 0.8 + bump(t, 4.1, 4.95) * 0.5, o: 0.3 + bump(t, 2.5, 3.0) * 0.6 + bump(t, 4.1, 4.95) * 0.5 });

      /* v28 — "What must we do?" */
      works.forEach((w) => {
        const k = es(t, 3.1 + w.i * 0.07, 3.3 + w.i * 0.07, ease.back) * (1 - es(t, 4.05, 4.2));
        const [hx, hy] = headAt(w.m.x, JY, 0.94, w.m.x > JX);
        pose(w.el, { x: hx + (w.m.x > JX ? -10 : 10), y: hy - 18, s: k, r: Math.sin(T * 2 + w.i) * 3, o: k > 0.01 ? 1 : 0 });
      });
      /* v29 — believe in Him whom He sent */
      hearts.forEach((h, i) => {
        const m = PEO[i];
        const k = es(t, 4.3 + i * 0.05, 4.5 + i * 0.05, ease.back) * (1 - es(t, 5.0, 5.2) * (i % 3 ? 1 : 0.4));
        pose(h, { x: m.x + (m.x > JX ? -6 : 6), y: JY - 108 + Math.sin(T * 1.5 + i) * 3, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v30 — "What sign? that we may see and believe — what work do you do?" */
      eyesQ.forEach((e) => {
        const k = es(t, 5.15 + e.i * 0.07, 5.35 + e.i * 0.07, ease.back) * (1 - es(t, 5.95, 6.05));
        const [hx, hy] = headAt(e.m.x, JY, 0.94, e.m.x > JX);
        pose(e.el, { x: hx + (e.m.x > JX ? -10 : 10), y: hy - 18, s: k, o: k > 0.01 ? 1 : 0 });
      });
      qTags.forEach((q, i) => {
        const m = PEO[i];
        const k = es(t, 6.05 + i * 0.04, 6.25 + i * 0.04, ease.back);
        const [hx, hy] = headAt(m.x, JY, 0.94, m.x > JX);
        pose(q, { x: hx, y: hy - 44, s: k, r: Math.sin(T * 2 + i) * 8, o: k > 0.01 ? 1 : 0 });
      });

      PEO.forEach((m) => {
        const look = es(t, 0.2, 0.4) * (1 - es(t, 0.95, 1.1));
        const tool = es(t, 3.1, 3.3) * (1 - es(t, 4.05, 4.2));
        const bel = es(t, 4.3, 4.6) * (1 - es(t, 5.0, 5.2));
        const demand = es(t, 5.1, 5.35);
        const cross = m.i % 3 === 0 ? es(t, 6.05, 6.3) : 0;
        m.p.set({ x: m.x, y: JY + (m.i % 2) * 8, s: 0.94, flip: m.x > JX, armF: 20 + look * 30 + tool * 70 + bel * 40 + demand * (m.i % 2 ? 80 : 30) - cross * 20, armB: 10 + tool * (m.i % 2 ? 0 : 100) + bel * 60 + demand * (m.i % 2 ? 0 : 60), head: -look * 4 + bel * -8 + demand * 4, lean: -bel * 4, blink: blinkAt(T, m.seed) });
      });
      const teach = es(t, 1.05, 1.3);
      jesus.set({ x: JX, y: JY, s: 1.08, armF: 20 + teach * 50 + bump(t, 1.4, 2.0) * 30 - es(t, 2.1, 2.3) * 40 + bump(t, 4.1, 4.95) * 40, armB: 10 + bump(t, 1.2, 1.9) * 100 + bump(t, 2.1, 3.0) * 60 + bump(t, 4.1, 4.95) * 120, head: -bump(t, 2.1, 3.0) * 12 - bump(t, 4.1, 4.95) * 8, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.08], [2.0, 1.08], [2.6, 1.12], [3.1, 1.12], [5.0, 1.1], [6.0, 1.14]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 20], [2.0, 20], [2.6, 40], [3.1, 50], [6.0, 50]]);
    };
  },
};
