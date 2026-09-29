// Mt 18,1–2 — the curtains open on the house at Capernaum (Mark 9's). Jesus sits in the room; outside by the door a
// child is bowling a hoop. The disciples come in one after another, and over each head a paper crown pops up; they
// stretch on tiptoe by the measuring rod, and Peter asks, a crown and a question mark in his bubble: who is the
// greatest? Jesus beckons; the child leaves the hoop, comes in through the door, and Jesus stands him in the middle,
// before them all — the crowns stop bobbing and the disciples look down at him.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { capHouse, SEATS, FLOOR, HX1, TWELVE, child, paperCrown, measureRod, speech, GLYPH, kf, kidHead, PI } from './lib.js';

const JX = 800, JY = 628;

export default {
  id: 'mt18-greatest',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-90, 20], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const H = capHouse(S);
    const c = S.c;
    H.houseL.add(`<g transform="translate(${HX1 - 70} ${FLOOR + 4})">${measureRod(c, 220)}</g>`);

    /* outside: the child with a hoop */
    const outL = S.layer({ par: H.P, sh: 5 });
    const hoop = outL.add(`<g>${sheet().p(c.ribbon(c.arc(0, -22, 22, 22, 0, PI * 2, 28), 4), C.wood3).x(c.ribbon(c.arc(0, -22, 22, 22, 0.4, 1.4, 6), 1.6), C.wood2).out()}</g>`);

    /* inside */
    const inL = S.layer({ par: H.P, sh: 5 });
    const dx = H.door;
    const TEN = TWELVE.slice(0, 10);
    const SEAT_OF = [4, 5, 3, 6, 2, 7, 1, 8, 0, 9];
    const dis = TEN.map((d, i) => { const [x, s] = SEATS[SEAT_OF[i]]; return { ...d, i, x, s, flip: x > JX, seed: c.rr(0, 9), p: S.puppet(inL.add(person(c, d.o))) }; });
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const kidP = S.puppet(inL.add(child(c)));
    const crowns = dis.map((d) => ({ d, el: inL.add(`<g opacity="0">${paperCrown(c, 30, [C.sun, C.ochre, C.wheat][d.i % 3])}</g>`) }));
    const ask = inL.add(`<g opacity="0">${speech(c, `<g transform="translate(-12 10) scale(1.1)">${paperCrown(c, 26)}</g><g transform="translate(14 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 84, h: 56 })}</g>`);
    const glowC = inL.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/></g>`);
    H.front();
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      H.update(T);
      cur.set(es(t, 0.05, 0.85), T);

      /* the child bowls the hoop by the door, until he is called */
      const called = es(t, 2.12, 2.2);
      const roll = kf(t, [[0, 230], [2.1, 380]], (u) => u);
      const inside = t > 2.3;
      const kx = t < 2.2 ? roll - 40 : inside ? kf(t, [[2.3, dx], [2.62, 856]]) : kf(t, [[2.2, 340], [2.3, 440]]);
      const ky = inside ? lerp(FLOOR - 4, 670, es(t, 2.3, 2.62)) : 692;
      const ks = inside ? lerp(0.5, 0.58, es(t, 2.3, 2.62)) : 0.58;
      kidP.set({ x: kx, y: ky, s: ks, flip: false, o: inside ? es(t, 2.3, 2.34) : 1 - es(t, 2.26, 2.3), walk: (t > 0 && t < 2.1) || (t > 2.2 && t < 2.62) ? kx * 0.09 : undefined, amt: 0.7, armF: (1 - called) * 64 + es(t, 2.7, 2.9) * 16, head: -called * 8 + es(t, 2.7, 2.9) * 4, blink: blinkAt(T, 7) });
      pose(hoop, { x: roll + called * 14, y: 694, r: roll * 2.6 + called * 30, o: 1 });

      /* v1 — they come in and ask */
      dis.forEach((d) => {
        const w = es(t, 1 + d.i * 0.035, 1.34 + d.i * 0.035);
        const x = lerp(dx, d.x, w), y = lerp(FLOOR - 4, 644, w);
        const crownOn = es(t, 1.4 + d.i * 0.03, 1.6 + d.i * 0.03) * (1 - es(t, 2.6, 2.9) * 0.0);
        const calm = es(t, 2.55, 2.85);
        const tip = crownOn * (1 - calm) * (Math.sin(t * PI * 4 + d.i * 1.3) * 0.5 + 0.5) * (d.i % 2 ? 1 : 0.5);
        const look = es(t, 2.5, 2.8);
        d.p.set({ x, y: y - tip * 10, s: lerp(0.7, d.s, w), flip: w < 1 ? d.x < dx : d.flip, o: es(t, 0.98 + d.i * 0.035, 1.04 + d.i * 0.035), walk: w > 0 && w < 1 ? w * 30 : undefined, head: -tip * 6 + look * 12, armF: 12 + crownOn * (1 - calm) * (d.i % 3 === 0 ? 60 : 20) + (d.i === 0 ? bump(t, 1.45, 2.05) * 60 : 0), armB: tip * 30, blink: blinkAt(T, d.seed) });
        d.cx = x; d.cy = y - tip * 10; d.cs = lerp(0.7, d.s, w); d.tip = tip; d.calm = calm;
      });
      crowns.forEach(({ d, el }) => {
        const pop = es(t, 1.4 + d.i * 0.03, 1.62 + d.i * 0.03, ease.back);
        const hx = d.cx + (d.flip ? -2 : 2) * d.cs, hy = d.cy - 196 * d.cs;
        pose(el, { x: hx, y: hy - 8 + d.calm * 6, s: pop * (1 - d.calm * 0.25), r: Math.sin(t * PI * 3 + d.i) * 8 * (1 - d.calm) + d.calm * (d.i % 2 ? 14 : -14), o: pop > 0.01 ? 1 - d.calm * 0.55 : 0 });
      });
      const ak = es(t, 1.5, 1.7, ease.back) * (1 - es(t, 2.05, 2.2));
      pose(ask, { x: SEATS[4][0] + 14, y: 644 - 196 * SEATS[4][1] - 12, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v2 — He calls the child and stands him in the middle */
      const beckon = bump(t, 2.0, 2.5);
      const present = es(t, 2.6, 2.85);
      jesus.set({ x: JX, y: JY, s: 0.94, armF: 20 + es(t, 1.4, 1.7) * 10 + beckon * 70 + present * 40, armB: 10 + beckon * 30, head: -2 + beckon * 4 + present * 8, blink: blinkAt(T, 1) });
      const [chx, chy] = kidHead(856, 670, 0.58, false);
      pose(glowC, { x: chx, y: chy + 30, s: 0.6 + present * 0.5, o: present * 0.55 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [2.0, -20], [2.35, -40], [2.7, 0]]);
      S.cam.z = kf(t, [[0, 1], [1, 1.02], [1.6, 1.05], [2.6, 1.05], [2.9, 1.1]]);
      S.cam.y = kf(t, [[0, 20], [1.6, 20], [2.9, 40]]);
    };
  },
};
