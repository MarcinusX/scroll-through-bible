// Łk 16,14–15 — back in the village square in the afternoon. "The Pharisees, who were lovers of money, heard all
// this and they scoffed at Him": the three on the right, fat purses at their belts, throw back their heads and laugh,
// and one points at Him. "He said to them: You are those who justify yourselves in the sight of men, but God knows
// your hearts": Jesus turns to them; they draw themselves up before the people, and the crowd gazes at them — but a
// thin light comes down from above, and on each of their breasts a heart shows: grey, with a gold coin set in it.
// "For what is exalted among men is an abomination in the sight of God": behind them a gilded column rises, a money
// bag of gold on its top, and the people look up at it in wonder — and then, in the light from above, it goes grey,
// cracks and crumbles away.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { villageSet, VQ, beltPurse, laughMarks, stoneHeart, coin, purse, glow, headAt, kf, tr, es, ease, bump, seg, PI, AFTER } from './lib.js';

const F = VQ.FEET;
const COLX = 990;

/** the gilded column with a money bag on top (origin: its foot); grey: the same, dead and cracked */
function column(c, grey = false) {
  const g = grey ? mix(C.rock2, C.rock3, 0.6) : mix(C.sun, C.ochre, 0.3), g2 = shade(g, -0.18);
  const s = sheet();
  s.p(c.cut(c.rect(-50, -30, 100, 30), 0.4, 5), grey ? shade(g, -0.1) : mix(C.rock2, C.plumRobe, 0.2));
  s.p(c.cut([[-26, -30], [-22, -300], [22, -300], [26, -30]], 0.4, 8), g);
  s.x(c.ribbon([[-8, -40], [-6, -290]], 3) + c.ribbon([[9, -40], [8, -290]], 3), g2, 'opacity=".6"');
  s.p(c.cut(c.rect(-38, -320, 76, 22), 0.3, 5), g2);
  s.p(c.cut([[-6, -320], [-30, -340], [-38, -372], [-26, -400], [-8, -410], [-12, -420], [12, -420], [8, -410], [26, -400], [38, -372], [30, -340], [6, -320]], 0.5, 5), g);
  s.x(c.ribbon([[-10, -412], [10, -412]], 3), grey ? C.rock3 : C.terracotta);
  if (grey) s.x(c.ribbon([[-20, -120], [-4, -160], [-14, -200], [6, -250]], 2.4) + c.ribbon([[18, -60], [4, -100]], 2) + c.ribbon([[-20, -380], [4, -360], [-6, -340]], 2), shade(C.rock3, -0.3));
  else {
    let cs = '';
    for (let i = 0; i < 6; i++) cs += c.cut(c.circ(c.rr(-24, 24), c.rr(-400, -340), c.rr(4, 6), 8), 0.2, 2);
    s.x(cs, shade(C.sun, 0.25), 'opacity=".8"');
  }
  return s.out();
}
function chunk(c, w, h) { return sheet().p(c.cut(c.blob(0, 0, w, h, 8, 0.3), 0.8, 4), mix(C.stone2, C.rock3, 0.5)).out(); }

export default {
  id: 'lk16-scoff',
  beats: [
    { v: 14 },
    { v: 15, text: 'Powiedział więc do nich: «To wy właśnie wobec ludzi udajecie sprawiedliwych, ale Bóg zna wasze serca.' },
    { v: 15, cont: true, text: 'To bowiem, co za wielkie uchodzi między ludźmi, obrzydliwością jest w oczach Bożych.' },
  ],
  cam: { x: [-10, 110], y: [-80, 40], z: [0.94, 1.12] },
  build(S) {
    const Q = villageSet(S, { skyCols: AFTER, dis: ['peter', 'john'], ph: 3, crowdSeeds: ['lk16-vL', 'lk16-vR'], sunAt: [1250, 190] });
    const c = Q.c;
    const gold = Q.flyL.add(`<g>${column(c)}</g>`);
    const dead = Q.flyL.add(`<g opacity="0">${column(c, true)}</g>`);
    const chunks = [[30, 16, -20, -380], [22, 14, 20, -300], [26, 12, -10, -220], [18, 12, 14, -140]].map(([w, h, x, y], i) => ({ i, x, y, el: Q.flyL.add(`<g opacity="0">${chunk(c, w, h)}</g>`) }));
    const beam = Q.backFx.add(`<g opacity="0"><path d="${c.poly([[-60, -900], [60, -900], [140, -40], [-140, -40]])}" fill="#fff4d6" opacity=".35"/></g>`);
    const purses = Q.phs.map(() => Q.act.add(`<g>${beltPurse(c)}</g>`));
    const hearts = Q.phs.map(() => Q.W.add(`<g opacity="0">${stoneHeart(c, 22)}<g transform="translate(0 -2)">${coin(c, 7)}</g></g>`));
    const laughs = Q.phs.map(() => Q.W.add(`<g opacity="0">${laughMarks(c)}</g>`));
    const PS = S.portrait ? [-20, -40, -60] : [0, 0, 0];   // phone: the scoffing Pharisees drawn in from under the thread

    return (t, time) => {
      const T = time;
      /* v14 — they scoff */
      const laugh = es(t, 0.15, 0.3) * (1 - es(t, 0.95, 1.1));
      const shake = laugh * Math.sin(t * 40);
      /* v15a — Jesus turns to them; they preen; the hearts */
      const turn = es(t, 1.02, 1.15);
      const preen = es(t, 1.15, 1.3) * (1 - es(t, 1.55, 1.7));
      const seen = es(t, 1.5, 1.65);
      /* v15b — the column rises, then dies */
      const rise = es(t, 2.05, 2.4, ease.out);
      const grey = es(t, 2.5, 2.6);
      const fall = es(t, 2.62, 2.95, ease.in);
      Q.pose(t, T,
        { flip: false, armF: 16 + turn * 60 - rise * 20, armB: 8 + turn * 20, head: -2 - rise * 8 * (1 - grey), blink: blinkAt(T, 2) },
        (d) => ({ head: -4 + laugh * 4, blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x + PS[m.i], head: -laugh * 16 + shake * 3 - preen * 10 + seen * 10 * (1 - rise) - rise * 14 * (1 - grey), lean: -laugh * 8 - preen * 6, armF: 10 + (m.i === 0 ? laugh * 80 : laugh * 30) + preen * 20, armB: 8 + laugh * 40, blink: blinkAt(T, m.seed) }));
      Q.amaze(Math.max(preen, rise * (1 - grey)) * 0.9);
      Q.phs.forEach((m, i) => {
        const x = m.x + PS[m.i], y = F + (m.i % 2 ? -4 : 4);
        pose(purses[i], { x: x - 12, y: y - 90 * 0.96, r: shake * 8 });
        const [hx, hy] = headAt(x, y, 0.96, true);
        const lk = laugh;
        pose(laughs[i], { x: hx - 26, y: hy - 20 - (T ? Math.sin(T * 6 + i) * 3 : 0), s: lk, o: lk > 0.02 ? 1 : 0 });
        const hk = es(t, 1.52 + i * 0.05, 1.64 + i * 0.05, ease.back) * (1 - es(t, 2.0, 2.1));
        pose(hearts[i], { x: x - 4, y: y - 112, s: hk, o: hk > 0.01 ? 1 : 0 });
      });
      pose(beam, { x: COLX, y: F - 110, o: es(t, 1.4, 1.55) * (1 - es(t, 2.0, 2.1)) + es(t, 2.45, 2.55) * (1 - es(t, 2.95, 3.0)) });
      const cy = lerp(F + 360, F - 60, rise);
      pose(gold, { x: COLX, y: cy, o: (rise > 0.01 ? 1 : 0) * (1 - grey) });
      pose(dead, { x: COLX, y: cy, s: 1, sy: 1 - fall * 0.5, o: grey * (1 - es(t, 2.85, 2.98)) });
      chunks.forEach((ch) => {
        const k = es(t, 2.64 + ch.i * 0.04, 2.9 + ch.i * 0.03, ease.in);
        pose(ch.el, { x: COLX + ch.x + (ch.i % 2 ? 1 : -1) * k * 40, y: cy + ch.y + k * (F - 60 - (cy + ch.y)), r: k * 120, o: grey > 0.5 && k < 0.98 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 40], [1.0, 40], [2.0, 30]]);
      S.cam.y = kf(t, [[-0.5, 30], [1.0, 20], [2.0, 10], [2.3, -50]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [1.0, 1.1], [2.0, 1.06], [2.3, 1.0]]);
      if (S.portrait) { S.cam.x += 50; S.cam.z -= 0.06; }
    };
  },
};
