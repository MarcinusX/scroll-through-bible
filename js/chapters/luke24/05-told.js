// Łk 24,10–11 — The upper room by day, its windows shuttered for fear: the Eleven sit and stand about, heavy. The women
// have come in through the door on the right, still carrying their jars. Their names come down on tags: Mary
// Magdalene, Joanna, Mary the mother of James — and the other women with them. They tell it all, and their words fly
// across the room in bubbles: the open tomb, the two in white, the Lord alive. But to the apostles it seems idle
// talk: they shake their heads and wave it away, and the bubbles crumple into grey paper balls and drop to the floor.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { WOMEN, JARS, room20, roomCrew, headAt, speech, tombIcon, angelIcon, risenIcon, nameTag, hanging, spiceJar, upright, hangK, PI } from './lib.js';

const APOSTLES = [
  ['bartholomew', 420, 700], ['jamesA', 500, 702], ['thaddaeus', 580, 698], ['simonZ', 660, 702], ['matthew', 740, 700], ['philip', 820, 702],
  ['andrew', 400, 752], ['thomas', 500, 756], ['john', 600, 758], ['james', 700, 756], ['peter', 810, 752],
];
const WX = [960, 1040, 1120, 1200];

export default {
  id: 'lk24-told',
  beats: [
    { v: 10, text: 'A były to: Maria Magdalena, Joanna i Maria, matka Jakuba;' },
    { v: 10, cont: true, text: 'i inne z nimi opowiadały to Apostołom.' },
    { v: 11 },
  ],
  cam: { x: [-20, 80], y: [0, 50], z: [0.9, 1.12] },
  build(S) {
    const c = S.c;
    const RR = room20(S, { night: false });
    const { door } = RR;
    const PL = S.layer({ par: 0.52, sh: 5 });
    const crew = roomCrew(S, PL, APOSTLES);
    const W = WOMEN.map((w, i) => {
      const holdF = `<g transform="translate(2 8)">${spiceJar(c, JARS[i][0], JARS[i][1])}</g>`;
      return { ...w, i, x: WX[i], y: 744 + (i % 2) * 6, seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, { ...w.o, holdF }))) };
    });

    /* the names on tags */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const tags = W.filter((w) => w.name).map((w) => ({ w, el: hanging(fx, nameTag(c, w.name(), { size: 15 }), { x: 0, y: -1500, len: 700 }) }));
    /* their words in bubbles, and what becomes of them */
    const icons = [
      `<g transform="translate(0 10) scale(.9)">${tombIcon(c, { open: true })}</g>`,
      `<g transform="translate(0 12)">${angelIcon(c, 0.9)}</g>`,
      `<g transform="scale(.95)">${risenIcon(c)}</g>`,
    ];
    const bubbles = icons.map((ic, i) => ({ i, el: fx.add(`<g>${speech(c, ic, { w: 84, h: 70, flip: true })}</g>`) }));
    const balls = [0, 1, 2].map(() => fx.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 15, 13, 10, 0.32), 1.4, 3), mix(C.stone2, C.rock2, 0.4)).x(c.ribbon([[-8, -4], [2, 2], [9, -3]], 1.2) + c.ribbon([[-6, 6], [5, 5]], 1.1), shade(C.rock2, -0.25), 'opacity=".7"').out()}</g>`));

    return (t, T) => {
      RR.R.update(T, 0);
      door.set(1 - es(t, 2.5, 2.9) * 0.6);
      door.bolt(0);

      /* v10a: the women, named */
      W.forEach((w) => {
        const come = es(t, 0.02 + w.i * 0.06, 0.4 + w.i * 0.06, ease.out);
        const x = lerp(1230, w.x, come);
        const tell = es(t, 1.05, 1.3) * (1 - es(t, 2.3, 2.6));
        const hurt = es(t, 2.4, 2.7);
        const armF = 26 + tell * (w.i % 2 ? 30 : 50) + Math.sin(t * 9 + w.i) * 8 * tell;
        w.p.set({ x, y: w.y, s: 0.97, flip: true, walk: come > 0.001 && come < 0.999 ? x * 0.06 : undefined, amt: 0.8, armF, armB: 10 + tell * (w.i === 0 ? 90 : 30) + hurt * 20, head: -tell * 4 + hurt * 10, blink: blinkAt(T, w.seed), o: seg(t, w.i * 0.06, w.i * 0.06 + 0.04) });
        upright(w.p, 'F', armF);
      });
      tags.forEach(({ w, el }, i) => {
        const k = es(t, 0.3 + i * 0.16, 0.6 + i * 0.16, ease.back) * (1 - es(t, 1.1, 1.35, ease.in));
        const [hx, hy] = headAt(w.x, w.y, 0.97, true);
        hangK(el, k, hx, hy - 150 + (i % 2) * 20, T, i);
      });

      /* v10b: they tell it — the bubbles fly over to the apostles */
      bubbles.forEach((b) => {
        const k = es(t, 1.1 + b.i * 0.14, 1.3 + b.i * 0.14, ease.back);
        const fly = es(t, 1.4 + b.i * 0.12, 1.85 + b.i * 0.08);
        const [hx, hy] = headAt(W[b.i].x, W[b.i].y, 0.97, true);
        const x = lerp(hx - 20, 520 + b.i * 130, fly), y = lerp(hy - 30, 420 - (b.i % 2) * 40, fly) - Math.sin(fly * PI) * 40;
        /* v11: idle talk — the words crumple and fall */
        const crumple = es(t, 2.2 + b.i * 0.08, 2.4 + b.i * 0.08);
        pose(b.el, { x, y, s: k * (1 - crumple * 0.9), r: crumple * 30, o: k > 0.01 && crumple < 0.95 ? 1 : 0 });
        const fall = es(t, 2.38 + b.i * 0.08, 2.75 + b.i * 0.08, ease.in);
        const bx = x + 34, by = lerp(y - 50, 800 + b.i * 6, fall);
        pose(balls[b.i], { x: bx + fall * 20, y: by, r: fall * 200, o: crumple > 0.9 ? 1 : 0 });
      });

      /* the apostles: heavy; they listen; they shake their heads and wave it away */
      const listen = es(t, 1.2, 1.5);
      const doubt = es(t, 2.05, 2.3);
      crew.forEach((m) => {
        const shake = doubt * (1 - es(t, 2.85, 2.98)) * Math.sin(t * 28 + m.i) * 7;
        const wave = doubt * (m.i % 3 === 0 ? 1 : 0.3);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: listen > 0.5 ? false : m.i % 2 === 0, armF: 18 + wave * 60 + (m.i % 3 === 0 ? Math.sin(t * 22) * 14 * doubt : 0), armB: 10 + (m.i % 4 === 1 ? doubt * 40 : 0), head: 8 - listen * 10 + doubt * 10 + shake, blink: blinkAt(T, m.seed) });
        fade(m.sad, 0.8 - listen * 0.6 + doubt * 0.7);
      });

      S.cam.x = S.portrait ? lerp(60, 0, es(t, 1.0, 2.0)) : lerp(40, 10, es(t, 1.0, 2.0));
      S.cam.y = 40;
      S.cam.z = S.portrait ? 0.92 : 1.08;
    };
  },
};
