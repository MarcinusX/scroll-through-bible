// Mk 10,10–12 — in the house the disciples ask him again. Two small cards hang from the ceiling:
// on each a couple of paper dolls with a golden ring above their joined hands. When one lets go of
// the other and turns to someone else, the ring cracks and the one left behind droops, hurt.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix, hanging, swing } from '../kit.js';
import { band, hillsWith, moon, stars, olive } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { houseSection, TWELVE, doll, ring, qmark, headAt } from './lib.js';

const PAR = 0.4;
const X0 = 470, X1 = 1130, FLOOR = 652, CEIL = 290;
const JX = 800;

export default {
  id: 'm10-house',
  beats: [
    { v: 10 },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-20, 20], y: [-40, 20], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const EVE = [mix(C.duskViolet, C.indigo, 0.35), mix(C.dusk, C.duskViolet, 0.4), C.apricot];
    sky(S, EVE);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 360, n: 70 }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 1260, y: 150, len: 800 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 470, amps: [20, 9, 3], lens: [900, 300, 120], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(hillsWith(c, { y: 530, amps: [12, 6, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.25), trees: 12, treeColor: mix(C.sage, C.indigo, 0.2), treeH: 20 }).markup);

    const outL = S.layer({ par: PAR, sh: 3 });
    outL.add(sheet().p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.duskViolet, 0.18)).out() + olive(c, 300, 620, 1) + olive(c, 1320, 624, 0.9));

    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL, doorX: 50, doorW: 110, doorH: 190 });
    const houseL = S.layer({ par: PAR, sh: 4 });
    houseL.add(H.back);
    // a lamp burning in a niche: it is evening in the house
    const lamp = houseL.add(`<g>${oilLamp(c)}</g>`);
    pose(lamp, { x: 930, y: CEIL + 118, s: 0.8 });
    const warm = houseL.add(`<g><ellipse rx="300" ry="200" fill="url(#warm-glow)" opacity=".45"/></g>`);
    pose(warm, { x: 800, y: 520 });

    /* the cards on strings */
    const cardL = S.layer({ par: PAR, sh: 4 });
    const W = 214, Hc = 140;
    const makeCard = (x, other) => {
      const face = sheet().p(c.cut(c.rect(-W / 2, 0, W, Hc), 0.6, 7), C.cream).p(c.cut(c.rect(-W / 2 + 7, 7, W - 14, Hc - 14), 0.4, 7), mix(C.parchment, C.lavender, 0.18)).out();
      const el = hanging(cardL, `<g>${face}</g>`, { x, y: CEIL + 20, len: 900 });
      const his = cardL.add(`<g>${doll(c, C.dustyBlue, { h: 70 })}</g>`);
      const her = cardL.add(`<g>${doll(c, C.roseRobe, { woman: true, h: 70, skin: C.skin })}</g>`);
      const third = cardL.add(`<g>${doll(c, other === 'woman' ? C.ochreRobe : C.tealRobe, { woman: other === 'woman', h: 70, skin: C.skin3 })}</g>`);
      const rg = cardL.add(`<g>${ring(c, 13)}</g>`);
      const tear = cardL.add(`<g opacity="0"><path d="${c.cut([[0, 0], [3.4, 6], [2.6, 9.4], [0, 10], [-2.6, 9.4], [-3.4, 6]], 0.1, 2)}" fill="#bfe0ee"/></g>`);
      return { el, his, her, third, rg, crack: rg.querySelector('[data-part="crack"]'), tear, x };
    };
    const A = makeCard(655, 'woman');
    const B = makeCard(945, 'man');

    /* people in the room */
    const pL = S.layer({ par: PAR, sh: 5 });
    const SEAT = [
      { d: TWELVE[0], x: 610, y: 646, p: 'sit' }, { d: TWELVE[3], x: 555, y: 632, p: 'sit' }, { d: TWELVE[2], x: 1000, y: 646, p: 'sit', flip: true },
      { d: TWELVE[1], x: 1060, y: 632, p: 'sit', flip: true }, { d: TWELVE[6], x: 690, y: 640, p: 'kneel' }, { d: TWELVE[7], x: 930, y: 640, p: 'kneel', flip: true },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), s: 0.8, pp: S.puppet(pL.add(person(c, { ...m.d.o, pose: m.p }))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const qs = [0, 2, 4].map((k) => ({ k, el: pL.add(`<g opacity="0">${qmark(c)}</g>`) }));

    const frontL = S.layer({ par: PAR, sh: 5 });
    frontL.add(H.front);

    return (t, time) => {
      const T = time;
      swing(moonEl, 1260, 150 + es(t, 0, 3) * 20, T, 0.8, 0.5);

      /* beat 0: in the house they ask him again */
      const askK = es(t, 0.15, 0.45) * (1 - es(t, 0.95, 1.15));
      SEAT.forEach((m) => {
        const asking = m.i % 2 === 0 ? askK : 0;
        const look = es(t, 1.0, 1.3);
        m.pp.set({ x: m.x, y: m.y, s: m.s, flip: !!m.flip, armF: 20 + asking * (m.i === 0 ? 70 : 40), armB: asking * (m.i === 0 ? 30 : 0), head: -look * 10 - asking * 4, blink: blinkAt(T, m.seed) });
      });
      qs.forEach((q) => {
        const m = SEAT[q.k];
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip, m.p);
        pose(q.el, { x: hx + (m.flip ? -14 : 14), y: hy - 42 + Math.sin(T * 2 + q.k) * 3, s: es(t, 0.2 + q.k * 0.05, 0.45 + q.k * 0.05, ease.back), r: Math.sin(T * 1.3 + q.k) * 8, o: t > 0.2 && t < 1.15 ? 1 - es(t, 0.95, 1.15) : 0 });
      });
      const teach = es(t, 0.95, 1.2);
      jesus.set({ x: JX, y: FLOOR, s: 0.9, armF: 26 + teach * (40 + Math.sin(T * 1.2) * 8) + bump(t, 1.9, 2.4) * 20, armB: teach * 50 * (1 - es(t, 1.9, 2.1)) + es(t, 1.9, 2.1) * 60, head: -4 + Math.sin(T * 0.6) * 1.2, flip: t > 1.95, blink: blinkAt(T, 2) });

      /* beat 1 & 2: the two cards */
      const card = (K, t0, hisLeaves) => {
        const drop = es(t, t0 - 0.05, t0 + 0.3, ease.back);
        const y = CEIL + 26 - (1 - drop) * 1100;
        swing(K.el, K.x, y, T, 0.9, 0.7, K.x);
        const come = es(t, t0 + 0.2, t0 + 0.45), turn = es(t, t0 + 0.4, t0 + 0.65);
        const bx = K.x, fy = y + 124, side = hisLeaves ? -1 : 1;
        const leaver = hisLeaves ? K.his : K.her, stays = hisLeaves ? K.her : K.his;
        const lx = bx + side * 24, sx = bx - side * 24;
        pose(K.third, { x: bx + side * 74, y: fy, o: come, r: side * -4 * come });
        pose(leaver, { x: lx + side * turn * 22, y: fy, r: side * turn * 7 });
        pose(stays, { x: sx - side * turn * 8, y: fy, r: -side * turn * 9, o: 1 - turn * 0.25 });
        pose(K.rg, { x: bx, y: y + 44 + turn * 6, r: turn * 16 });
        fade(K.crack, turn);
        pose(K.tear, { x: sx - side * turn * 8 + 8, y: fy - 58 + es(t, t0 + 0.65, t0 + 0.95) * 12, o: es(t, t0 + 0.6, t0 + 0.7) });
        return turn;
      };
      const tA = card(A, 1.0, true);
      const tB = card(B, 2.0, false);
      S.cam.z = 1 + es(t, -0.3, 0.5) * 0.06;
      S.cam.y = -es(t, -0.3, 0.5) * 20 - es(t, 0.9, 1.3) * 20;
      S.cam.x = -es(t, 0.9, 1.3) * 15 * (1 - es(t, 1.9, 2.3)) + es(t, 1.9, 2.3) * 15;
      void tA; void tB;
    };
  },
};
