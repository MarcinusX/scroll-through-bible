// Mt 1,17 — the whole tree at once, counted: three strands of fourteen beads on a golden vine. From Abraham's stars
// to David's harp, fourteen lights come on one by one and a card "14" hangs down; from David to the chains of
// Babylon, fourteen more; from Babylon to Christ, fourteen, ending in the star.
import { C, CAST, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import {
  PARCH, RIM, ICON, medal, badge, bead, vineLink, numberCard, glowDisc, rayBurst, nameStrip, ABRAHAM, DAVID,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const X0 = 530, X1 = 1070;
const ROWY = [586, 446, 306];           // Abraham→David (left→right), David→exile (right→left), exile→Christ (left→right)

export default {
  id: 'mt1-fourteen',
  beats: [
    { v: 17, text: 'Tak więc w całości od Abrahama do Dawida jest czternaście pokoleń;' },
    { v: 17, cont: true, text: 'od Dawida do przesiedlenia babilońskiego czternaście pokoleń;' },
    { v: 17, cont: true, text: 'od przesiedlenia babilońskiego do Chrystusa czternaście pokoleń.' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [0.98, 1.04] },
  build(S) {
    const c = S.c;
    const sk = sky(S, PARCH);
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const hs = [[450, 250, 9], [1150, 180, 11], [1180, 420, 7], [420, 470, 8]].map(([x, y, r], i) => ({ x, y, i, el: hanging(hangL, `<path d="${c.cut(c.star(0, 0, r, r * 0.4, 5), 0.2, 3)}" fill="${C.sun}"/>`, { x, y, len: 600 }) }));
    const board = S.layer({ par: 0.1, sh: 2 });
    board.add(sheet().p(c.cut([[380, 170], [1220, 160], [1230, 690], [372, 700]], 1.4, 12), mix(C.parchment, C.cream, 0.4)).x(c.ribbon([[400, 190], [1200, 182], [1208, 672], [394, 680], [400, 190]], 2), C.haloRim, 'opacity=".6"').out());

    /* ---------- the serpentine vine: three strands and two turns ---------- */
    const vineL = S.layer({ par: 0.3, sh: 3 });
    const beadL = S.layer({ par: 0.3, sh: 5 });
    const litL = S.layer({ par: 0.3, sh: 1, flat: true });
    const strands = ROWY.map((y, r) => {
      const dir = r === 1 ? -1 : 1, xa = dir > 0 ? X0 : X1;
      const el = vineL.add(`<g>${vineLink(c, X1 - X0, { w: 7, bend: 0.03, n: 8 })}</g>`);
      const beads = [];
      for (let i = 0; i < 14; i++) {
        const x = xa + dir * ((X1 - X0) * (i + 0.5)) / 14;
        beads.push({ x, y, i, el: beadL.add(`<g>${bead(c, 12, [C.haloRim, C.sun, C.wood3][r], C.parchment)}</g>`), lit: litL.add(`<g>${glowDisc(30, 'halo-glow', 1)}<path d="${c.poly(c.circ(0, 0, 12, 16))}" fill="${[C.halo, C.halo, C.star][r]}"/><path d="${c.poly(c.star(0, 0, 8, 3, 4, 0))}" fill="${C.sun}"/></g>`) });
      }
      return { y, r, dir, xa, el, beads };
    });
    const turns = [[X1, ROWY[0], ROWY[1], 1], [X0, ROWY[1], ROWY[2], -1]].map(([x, y0, y1, d]) => ({ x, y0, y1, d, el: vineL.add(`<g>${vineLink(c, y0 - y1, { w: 7, bend: 0.35, n: 2 })}</g>`) }));

    /* ---------- the four ends ---------- */
    const endL = S.layer({ par: 0.3, sh: 6 });
    const ends = [
      { x: X0 - 44, y: ROWY[0], m: medal(S, ABRAHAM, { r: 30, ...RIM.night, name: tr('Abraham', 'Abraham'), size: 18 }) },
      { x: X1 + 44, y: ROWY[0] - 4, m: medal(S, DAVID, { r: 30, ...RIM.king, king: true, flip: true, name: tr('Dawid', 'David'), size: 18 }) },
      { x: X0 - 44, y: ROWY[1], m: `<g>${badge(c, ICON.chain(c), { r: 26, rim: C.rock2, fill: mix(C.stone2, C.skyVeil, 0.4) })}<g transform="translate(0 34)">${nameStrip(c, tr('Babilon', 'Babylon'), { size: 18 })}</g></g>` },
      { x: X1 + 46, y: ROWY[2] - 6, m: medal(S, { ...CAST.jesus }, { r: 36, ...RIM.holy, flip: true, name: tr('Chrystus', 'Christ'), size: 19 }) },
    ].map((e) => ({ ...e, el: endL.add(e.m) }));
    const cGlow = litL.add(`<g>${glowDisc(140, 'halo-glow', 1)}${rayBurst(c, { n: 20, r0: 40, r1: 220, spread: 0.04, color: '#fff3cf', o: 0.6 })}</g>`);

    /* ---------- the counting cards ---------- */
    const cardL = S.layer({ par: 0.3, sh: 6 });
    const cards = ROWY.map((y, r) => ({ r, y, el: hanging(cardL, numberCard(c, '14', { size: 40 }), { x: 800, y: y - 58, len: 900 }) }));

    return (t, time) => {
      hs.forEach((h) => swing(h.el, h.x, h.y, time, 1.2, 0.7, h.i));
      // each row: its strand is there from the start (faint), the lights come on during its beat
      ends.forEach((e, i) => pose(e.el, { x: e.x, y: e.y, s: 1, o: 1 }));
      strands.forEach((s) => {
        const b = s.r;
        const grow = 1;
        pose(s.el, { x: s.xa, y: s.y, r: s.dir > 0 ? 0 : 180, sx: grow, sy: s.dir > 0 ? 1 : -1, o: 1 });
        s.beads.forEach((bd) => {
          pose(bd.el, { x: bd.x, y: bd.y, s: 1, o: 1 });
          const k = es(t, b + 0.05 + bd.i * 0.035, b + 0.12 + bd.i * 0.035, ease.back);
          pose(bd.lit, { x: bd.x, y: bd.y - k * 0, s: Math.max(0.001, k), o: k > 0.002 ? 1 : 0 });
        });
      });
      turns.forEach((tu, i) => {
        const k = es(t, i + 0.7, i + 1.0);
        pose(tu.el, { x: tu.x + tu.d * 4, y: tu.y0, r: -90, sx: Math.max(0.001, k), sy: tu.d, o: k > 0.002 ? 1 : 0 });
      });
      cards.forEach((cd) => {
        const k = es(t, cd.r + 0.5, cd.r + 0.7, ease.out);
        swing(cd.el, 800, lerp(-400, cd.y - 58, k), time + cd.r, 1.2, 0.8, cd.r);
      });
      const cl = es(t, 2.55, 2.8);
      pose(cGlow, { x: X1 + 46, y: ROWY[2] - 6, s: 0.5 + cl * 0.6, r: t * 5, o: cl });
      sk.blend(PARCH, ['#ead3a6', '#f5e0b8', '#f9edd2'], cl);
      S.cam.y = -es(t, 0, 2.4) * 30;
    };
  },
};
