// Łk 9,43b–45 — the same plain; the crowd still marvelling behind, hands raised. But Jesus turns away from them to His
// disciples and draws them close. "Let these words sink into your ears": a great paper ear comes down on its string and
// His words fly into it; "the Son of Man will be delivered up into the hands of men": a round plate is let down — a
// small figure of light in the middle, and hands reaching up round it from below, closing in. "But they did not
// understand this saying; it was concealed from them": a dark cloth drops over the plate and hides it; "and they were
// afraid to ask Him": a question rises over each of them — and sinks back unasked, their heads going down.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { ear } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { footSet, TW9, question, wordSlip, reachingHand, halo, shadowPerson, kf, headAt, PI } from './lib.js';

const JX = 700, FY = 724;
const DIS = [
  { k: 'john', x: 470 }, { k: 'james', x: 540 }, { k: 'peter', x: 610 },
  { k: 'thomas', x: 800 }, { k: 'philip', x: 870 }, { k: 'andrew', x: 940 },
];

export default {
  id: 'lk9-ears',
  beats: [
    { v: 43, cont: true, text: 'Gdy tak wszyscy pełni byli podziwu dla wszystkich Jego czynów, Jezus powiedział do swoich uczniów:' },
    { v: 44 },
    { v: 45 },
  ],
  cam: { x: [-80, 20], y: [0, 50], z: [1, 1.16] },
  build(S) {
    const F = footSet(S, { twin: (m, k) => ({ armF: 100 + (k % 2) * 30, armB: 140 + (k % 3) * 10, head: -10 }) });
    const c = S.c;

    /* the ear, the plate of the hands, the cloth */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const earEl = hanging(flies, `<g transform="scale(2.2)">${ear(c, C.skin2)}</g>`, { x: 0, y: -1500, len: 900 });
    const R = 92;
    const plate = (() => {
      const s = sheet();
      s.p(c.cut(c.circ(0, 0, R + 8, 44), 0.5, 6), C.haloRim);
      s.p(c.cut(c.circ(0, 0, R, 44), 0.5, 6), mix(C.parchment, C.dusk, 0.25));
      return s.out() + `<circle cy="-10" r="60" fill="url(#halo-glow)"/><g transform="translate(0 38) scale(.36)">${shadowPerson(c, CAST.jesus, '#fff3d6')}</g>`;
    })();
    const plateEl = hanging(flies, plate, { x: 0, y: -1500, len: 900 });
    const HCOL = [C.skin2, C.skin3, C.skin4, C.skin, C.skin3, C.skin2];
    const HANDS = HCOL.map((col, i) => ({ i, a: PI * (0.18 + i * 0.128), el: flies.add(`<g opacity="0">${reachingHand(c, col)}</g>`) }));
    const cloth = (() => {
      const pts = [[-R - 16, -R - 16], [R + 16, -R - 16], [R + 16, R + 10]];
      for (let x = R + 16; x > -R - 16; x -= 26) pts.push(...c.arc(x - 13, R + 10, 13, 9, 0, PI, 4));
      return sheet().p(c.cut(pts, 0.8, 8), shade(C.plumRobe, -0.35)).x(Array.from({ length: 6 }, (_, i) => c.ribbon([[-R + i * 36, -R - 14], [-R + 4 + i * 36, R]], 6)).join(''), shade(C.plumRobe, -0.5), 'opacity=".5"').out();
    })();
    const clothEl = flies.add(`<g opacity="0">${cloth}</g>`);

    /* people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = DIS.map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.55, sh: 4 });
    const WORDS = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${wordSlip(c, 24)}</g>`) }));
    const QS = D.filter((d, i) => i % 2 === 0 || i === 3).map((d, i) => ({ d, i, el: fx.add(`<g opacity="0">${question(c)}</g>`) }));

    const EX = 600, EY = 330, PX = 930, PY = 330;
    return (t, time) => {
      const T = time;
      F.update(T);
      F.crowd.forEach((m) => {
        const calm = es(t, 1.05 + (m.i % 6) * 0.04, 1.12 + (m.i % 6) * 0.04);
        m.sp.set({ x: m.x - 40, y: m.y, o: calm });
        m.alt.set({ x: m.x - 40, y: m.y, o: 1 - calm });
      });

      /* v43b — He turns from the crowd to His disciples */
      const turn = es(t, 0.1, 0.4);
      const gather = es(t, 0.2, 0.8);
      const speak = bump(t, 1.05, 1.95);
      jesus.set({ x: lerp(760, JX, gather), y: FY, s: 1.04, flip: turn > 0.5, walk: gather > 0 && gather < 1 ? t * 14 : undefined, armF: 20 + bump(t, 0.3, 0.9) * 50 + speak * 50, armB: 10 + speak * 60 + bump(t, 0.3, 0.9) * 40, head: -2, blink: blinkAt(T, 1) });
      D.forEach((d) => {
        const x = lerp(d.x + (d.x > JX ? 120 : -60), d.x, gather);
        const dunno = es(t, 2.2, 2.5);
        const bow = es(t, 2.55 + d.i * 0.02, 2.8 + d.i * 0.02);
        d.p.set({ x, y: FY + 6 + (d.i % 2) * 8, s: 0.94, flip: d.flip, walk: gather > 0 && gather < 1 ? t * 14 + d.i : undefined, armF: 20 + dunno * 40 * (1 - bow), armB: dunno * 30 * (1 - bow), head: -6 - dunno * 6 + bow * 18, lean: bow * 5, blink: blinkAt(T, d.seed) });
      });

      /* v44 — into your ears; into the hands of men */
      const ek = es(t, 1.02, 1.3, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(earEl, { x: EX, y: lerp(-1500, EY, ek), r: Math.sin(T * 0.8) * 2, oy: 0, o: ek > 0.002 ? 1 : 0 });
      const [jhx, jhy] = headAt(JX, FY, 1.04, true);
      WORDS.forEach((w) => {
        const q = T ? (T * 0.6 + w.i / 5) % 1 : (w.i + 0.5) / 5;
        pose(w.el, { x: lerp(jhx - 20, EX + 10, q), y: lerp(jhy - 10, EY + 10, q) - Math.sin(q * PI) * 40, s: 0.8 * (1 - q * 0.6), r: Math.sin(T * 2 + w.i) * 10, o: bump(t, 1.15, 1.6) * Math.sin(q * PI) });
      });
      const pk = es(t, 1.3, 1.6, ease.back) * (1 - es(t, 2.95, 3.2));
      const py = lerp(-1500, PY, pk);
      pose(plateEl, { x: PX, y: py, r: Math.sin(T * 0.7) * 1.2, oy: 0, o: pk > 0.002 ? 1 : 0 });
      HANDS.forEach((h) => {
        const k = es(t, 1.5 + h.i * 0.04, 1.8 + h.i * 0.04);
        const r = R * (1.25 - k * 0.55);
        const ang = h.a;
        pose(h.el, { x: PX + Math.cos(ang) * r, y: py + Math.sin(ang) * r * 0.9 + 20, r: (ang * 180) / PI - 90, s: 0.8, o: pk > 0.9 ? es(t, 1.5 + h.i * 0.04, 1.6 + h.i * 0.04) * (1 - es(t, 2.2, 2.3)) : 0 });
      });

      /* v45 — concealed from them; afraid to ask */
      const cl = es(t, 2.05, 2.3, ease.out);
      pose(clothEl, { x: PX, y: py - (1 - cl) * 260, o: cl > 0.01 && pk > 0.5 ? 1 : 0 });
      QS.forEach((q) => {
        const [hx, hy] = headAt(q.d.x, FY + 6 + (q.d.i % 2) * 8, 0.94, q.d.flip);
        const up = es(t, 2.3 + q.i * 0.05, 2.45 + q.i * 0.05, ease.back);
        const back = es(t, 2.6 + q.i * 0.04, 2.85 + q.i * 0.04);
        pose(q.el, { x: hx + (q.d.flip ? -8 : 8), y: hy - 40 + back * 20, s: up * (1 - back * 0.85), o: up > 0.01 && back < 0.98 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [0.8, -60], [3, -60]]);
      S.cam.z = kf(t, [[0, 1.04], [0.8, 1.1], [3, 1.1]]);
      S.cam.y = kf(t, [[0, 30], [0.8, 40], [3, 40]]);
    };
  },
};
