// Łk 21,5–7 — in the Temple court. Some of the people talk of the Temple, adorned with beautiful stones and gifts:
// they point up, the gold on the sanctuary glints, and three golden gifts come down on their strings beside it —
// a golden vine cluster, a gilded shield, a lamp of gold. "The days will come when not one stone will be left upon
// another": a painted flat comes down — the same sanctuary in miniature on its hill — and its stones lift apart and
// tumble into a heap in the dust. "Teacher, when will these things be?" — Peter's bubble holds an hourglass and a
// question; "and what will be the sign?" — John's holds a star.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, flatSky, flatY, altGroups, swapGroups, sparkle, grapeBunch, dust, speech, GLYPH, hourglass, question, onString, headAt,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, JS, FX, FW, FH, K } = TT;
const GROUND = 86; // the flat's ground line (flat coords, from its centre)

/** the little sanctuary of the flat, as separate blocks: [{x, y, w, h, col}] (origin: its foot on the flat's ground) */
function templeBlocks(c) {
  const B = [];
  const st = mix(C.cream, C.stone, 0.3), gold = C.sun;
  for (let i = 0; i < 6; i++) B.push({ x: -150 + i * 50, y: -16, w: 50, h: 16, col: mix(C.stone2, st, 0.4) });
  for (let r = 0; r < 3; r++) { B.push({ x: -118, y: -38 - r * 22, w: 42, h: 22, col: C.plaster2 }); B.push({ x: 76, y: -38 - r * 22, w: 42, h: 22, col: C.plaster2 }); }
  B.push({ x: -122, y: -90, w: 50, h: 8, col: gold }); B.push({ x: 72, y: -90, w: 50, h: 8, col: gold });
  for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) {
    const portal = k === 1 && r < 3;
    B.push({ x: -66 + k * 44, y: -38 - r * 22, w: 44, h: 22, col: portal ? mix(C.plumRobe, C.lavender, 0.3) : st });
  }
  B.push({ x: -74, y: -178, w: 148, h: 12, col: gold });
  return B.map((b) => ({ ...b, r0: c.rr(-30, 30), ex: c.rr(-160, 150), rot: c.rr(-70, 70) }));
}
/** a gilded round shield (votive gift); origin centre */
function shield(c, r = 24) {
  return sheet().p(c.cut(c.circ(0, 0, r, 26), 0.3, 4), shade(C.sun, -0.12)).p(c.cut(c.circ(0, 0, r * 0.72, 22), 0.3, 4), C.sun).p(c.cut(c.circ(0, 0, r * 0.22, 12), 0.2, 3), C.halo).out();
}
/** a golden hanging lamp (votive gift); origin: its top */
function goldLamp(c) {
  const s = sheet();
  s.p(c.cut([[-24, 10], [24, 10], [16, 26], [-16, 26]], 0.3, 4), C.sun);
  s.p(c.cut(c.ell(0, 10, 25, 5, 14), 0.2, 3), shade(C.sun, -0.2));
  s.x(c.ribbon([[0, 0], [-18, 9]], 1) + c.ribbon([[0, 0], [18, 9]], 1), shade(C.sun, -0.3));
  return s.out() + `<path d="M-12 8C-15 4 -14 -2 -12 -6C-10 -2 -9 4 -12 8ZM12 8C9 4 10 -2 12 -6C14 -2 15 4 12 8Z" fill="${C.lampFlame}"/>`;
}

export default {
  id: 'lk21-stones',
  beats: [
    { v: 5 },
    { v: 6 },
    { v: 7, text: 'Zapytali Go: «Nauczycielu, kiedy to nastąpi?' },
    { v: 7, cont: true, text: 'I jaki będzie znak, gdy się to dziać zacznie?»' },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const point = altGroups(T0, 'point');

    /* the glints on the sanctuary and the golden gifts */
    const glints = [[716, 206], [884, 206], [800, 262], [644, 362], [956, 362], [800, 400]].map(([x, y], i) => ({ x, y, i, el: T0.bits.add(`<g>${sparkle(c, 16)}</g>`) }));
    const gifts = [
      { x: 548, y: 330, m: `<g transform="scale(2.2)">${grapeBunch(c, 4.4, C.sun)}</g>` },
      { x: 1052, y: 318, m: shield(c, 26) },
      { x: 1156, y: 250, m: goldLamp(c) },
    ].map((g, i) => ({ ...g, i, el: T0.bits.add(`<g>${onString(`<g transform="translate(0 20)">${g.m}</g>`, 1600)}</g>`) }));

    /* the flat: the little sanctuary on its hill; its stones come apart */
    const inner = flatSky(S, FW, FH, ['#e4d4b6', '#f4e6cb']) + sheet()
      .p(c.cut([[-FW / 2 - 4, GROUND - 10], [-120, GROUND - 26], [0, GROUND - 30], [140, GROUND - 22], [FW / 2 + 4, GROUND - 8], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.8, 8), mix(C.sand2, C.dune, 0.4))
      .p(c.cut([[-FW / 2 - 4, 60], [-150, 36], [-60, 50], [40, 30], [160, 44], [FW / 2 + 4, 34], [FW / 2 + 4, 80], [-FW / 2 - 4, 80]], 0.8, 8), mix(C.hillMid, C.sage, 0.3)).out();
    const flatEl = T0.FL.add(flat(S, inner, { w: FW, h: FH }));
    const blocks = templeBlocks(c).map((b, i) => ({ ...b, i, el: T0.bits.add(`<g>${sheet().p(c.cut(c.rect(-b.w / 2, -b.h / 2, b.w - 1.5, b.h - 1.5), 0.3, 5), b.col).x(c.ribbon([[-b.w / 2 + 3, b.h / 2 - 4], [b.w / 2 - 4, b.h / 2 - 4]], 1.1), shade(b.col, -0.2), 'opacity=".6"').out()}</g>`) }));
    const NB = blocks.length;
    const puffs = [0, 1, 2, 3].map(() => T0.bits.add(`<g>${dust(c, 22)}</g>`));

    /* the questions */
    const qWhen = T0.fx.add(`<g>${speech(c, `<g transform="translate(-16 2)">${hourglass(c, 40)}</g><g transform="translate(18 2) scale(1.3)">${GLYPH.q(c)}</g>`, { w: 96, h: 64, flip: true })}</g>`);
    const qSign = T0.fx.add(`<g>${speech(c, `<g transform="translate(-18 0) scale(1.1)">${GLYPH.star(c)}</g><g transform="translate(16 2) scale(1.3)">${GLYPH.q(c)}</g>`, { w: 96, h: 64 })}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { dis: false, crowd: false });

      /* v5 — the people point up at the Temple, its gold glints, the gifts come down */
      const adm = es(t, 0.05, 0.12) * (1 - es(t, 1.0, 1.07));
      swapGroups(T0, point, adm);
      const shine = es(t, 0.1, 0.4) * (1 - es(t, 1.0, 1.3));
      glints.forEach((g) => {
        const tw = T ? 0.5 + 0.5 * Math.sin(T * 2.2 + g.i * 1.7) : 0.8;
        pose(g.el, { x: g.x, y: g.y, s: (0.5 + shine * 0.7) * (0.7 + tw * 0.4), r: T * 20 + g.i * 30, o: shine * (0.4 + 0.6 * tw) });
      });
      gifts.forEach((g) => {
        const k = es(t, 0.2 + g.i * 0.12, 0.5 + g.i * 0.12, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
        pose(g.el, { x: g.x, y: lerp(-500, g.y, k), r: T ? Math.sin(T * 0.9 + g.i) * 2 : 0, o: k > 0.002 ? 1 : 0 });
      });
      T0.peter.set({ x: TT.PX, y: GY + 10, s: 0.98, flip: false, armB: adm * 150 + es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05)) * 30, armF: es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05)) * 70, head: -4 - adm * 12 - es(t, 1.3, 1.5) * 4 * (1 - es(t, 2.0, 2.1)), blink: blinkAt(T, 3) });
      T0.john.set({ x: TT.JOX, y: GY + 10, s: 0.98, flip: true, armB: adm * 120 * (1 - es(t, 0.6, 0.8)) + es(t, 3.05, 3.25) * 40, armF: es(t, 3.05, 3.25) * 70, head: -4 - adm * 10, blink: blinkAt(T, 5) });

      /* Jesus: looks up with them; speaks (v6); listens to their questions (v7) */
      const say = es(t, 1.02, 1.2) * (1 - es(t, 1.85, 2.0));
      const toP = es(t, 2.02, 2.15) * (1 - es(t, 2.95, 3.05));
      jesus(T0, t, T, { flip: toP > 0.5, armF: 20 + say * 70, armB: 10 + say * 110 * (1 - es(t, 1.5, 1.7)), head: -adm * 8 - say * 4 });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, say * 0.8, T, { dir: 1, spread: 1.8 });

      /* v6 — the flat, and the stones fall */
      const kF = es(t, 1.08, 1.3, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      const fy = flatY(kF), on = kF > 0.002 ? 1 : 0;
      pose(flatEl, { x: FX, y: fy, s: K, r: T ? Math.sin(T * 0.7) * 0.4 * kF : 0, o: on });
      const gy = fy + GROUND * K;
      blocks.forEach((bk) => {
        const order = (NB - 1 - bk.i) / NB;
        const a = 1.36 + order * 0.24;
        const lift = es(t, a, a + 0.1);
        const fall = es(t, a + 0.06, a + 0.26, ease.in);
        const bx0 = bk.x + bk.w / 2, by0 = bk.y + bk.h / 2;
        const x = bx0 + lift * bx0 * 0.12 + fall * (bk.ex - bx0) * 0.8;
        const restY = -bk.h * 0.35 - (bk.i % 4) * 7 * (1 - Math.abs(bk.ex) / 180);
        const y = lerp(by0 - lift * 12, restY, fall);
        pose(bk.el, { x: FX + x * K, y: gy + y * K, s: K, r: lift * bk.r0 * 0.2 + fall * bk.rot, o: on });
      });
      puffs.forEach((p, i) => {
        const k = seg(t, 1.56 + i * 0.07, 1.95 + i * 0.07);
        pose(p, { x: FX + (-120 + i * 80) * K, y: gy - 12 - k * 26, s: 0.6 + k * 1.1, o: on * bump(t, 1.56 + i * 0.07, 1.95 + i * 0.07) * 0.8 });
      });

      /* v7 — Peter: when? John: what sign? */
      const [px, py] = headAt(TT.PX, GY + 10, 0.98, false);
      const w1 = es(t, 2.1, 2.3, ease.back);
      pose(qWhen, { x: px - 10, y: py - 34, s: w1 * 1.2, r: T ? Math.sin(T * 1.2) * 2 : 0, o: w1 > 0.02 ? 1 : 0 });
      const [jx, jy] = headAt(TT.JOX, GY + 10, 0.98, true);
      const w2 = es(t, 3.1, 3.3, ease.back);
      pose(qSign, { x: jx + 10, y: jy - 34, s: w2 * 1.2, r: T ? Math.sin(T * 1.2 + 1) * 2 : 0, o: w2 > 0.02 ? 1 : 0 });

      S.cam.y = -es(t, 0.1, 0.6) * 40 * (1 - es(t, 1.9, 2.4)) + es(t, 2.0, 2.4) * 10;
      S.cam.z = 1 + es(t, 1.0, 1.4) * 0.03 + es(t, 2.1, 2.5) * 0.03;
    };
  },
};

/** Jesus standing in the middle of the court */
function jesus(T0, t, T, { flip = false, armF = 20, armB = 10, head = 0 } = {}) {
  T0.jesus.set({ x: JX, y: GY, s: JS, flip, armF, armB, head, blink: blinkAt(T) });
}
