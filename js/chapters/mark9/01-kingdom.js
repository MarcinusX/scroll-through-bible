// Mk 9,1 — on a hillside among the crowd Jesus speaks: some standing here will see
// the Kingdom of God come with power — and far on the horizon a crown of light begins to rise.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, crowd, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, olive, town, sun, cloud, cypress, flowers } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { voiceRings, spark, crownOfLight } from './lib.js';

const PI = Math.PI;

export default {
  id: 'm9-kingdom',
  beats: [
    { cover: true },
    { v: 1, text: 'Mówił także do nich: «Zaprawdę, powiadam wam:' },
    { v: 1, cont: true, text: 'Niektórzy z tych, co tu stoją, nie zaznają śmierci, aż ujrzą królestwo Boże przychodzące w mocy».' },
  ],
  cam: { x: [-20, 20], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#c9dcd8', '#ede4cb', '#f5e3c6'];
    const GOLD = ['#d9d2c4', '#f3dfb4', '#f7d8a8'];
    const sk = sky(S, SKY);

    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1190, y: 170, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 500, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1000, y: 230, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 50, scale: 0.5 });

    // the far range, and behind it the crown of light that will rise
    const farL = S.layer({ par: 0.08, sh: 2 });
    farL.add(band(c, { y: 440, amps: [26, 10, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.lavender, 0.25) }).markup);
    const glowL = S.layer({ par: 0.07, sh: 1, flat: true });
    const glow = glowL.add(`<g><circle r="520" fill="url(#halo-glow)"/>${rays(c, { n: 20, r0: 60, r1: 620, spread: 0.05, color: '#fff1c8' })}</g>`);
    const crownL = S.layer({ par: 0.07, sh: 4 });
    const crownEl = crownL.add(`<g>${crownOfLight(c, 64)}</g>`);
    const nearFar = S.layer({ par: 0.1, sh: 2 });
    nearFar.add(band(c, { y: 470, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.hillMid, 0.4) }).markup);

    const hills = S.layer({ par: 0.18, sh: 3 });
    const h2 = hillsWith(c, { y: 505, amps: [20, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup);
    hills.add(town(c, { x: 330, y: h2.fn(330) + 8, n: 6, spread: 240, sc: 0.5 }));

    // the hillside where they stand
    const ground = S.layer({ par: 0.3, sh: 3 });
    const gfn = (x) => 585 + Math.pow((x - 800) / 700, 2) * 50;
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1.2), mix(C.hillNear, C.sage2, 0.4)).out());
    ground.add(olive(c, 170, 612, 1) + olive(c, 1450, 614, 0.9) + cypress(c, 1320, 600, 140) + rock(c, 800, 612, 150, 32, C.rock));
    ground.add(grass(c, { x0: -400, x1: 2000, y: 590, fn: gfn, n: 40, h: 12, color: C.olive }));
    ground.add(flowers(c, { x0: 300, x1: 1300, y: 600, fn: gfn, n: 16, h: 12 }));

    // the crowd stands around him in a wide half-ring
    const crowdL = S.layer({ par: 0.34, sh: 3 });
    const people = crowd(S, crowdL, [
      { y: 578, s: 0.38, n: 14, x0: 380, x1: 1220 },
      { y: 598, s: 0.46, n: 16, x0: 300, x1: 1300 },
      { y: 628, s: 0.54, n: 12, x0: 260, x1: 1340 },
    ]).filter((m) => Math.abs(m.x - 800) > 110);
    // a few will be marked by a little light: "some of those who stand here"
    const chosen = [2, 7, 11, 16, 20].filter((i) => i < people.length);
    const sparks = chosen.map((i) => ({ m: people[i], el: crowdL.add(`<g opacity="0">${spark(c, 9)}</g>`) }));

    // Jesus on the rock, the disciples close by
    const mainL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [
      { o: CAST.peter, x: 600, s: 0.84 }, { o: CAST.john, x: 680, s: 0.8 },
      { o: CAST.james, x: 930, s: 0.82 }, { o: CAST.andrew, x: 1010, s: 0.84 },
    ].map((d, i) => ({ ...d, i, y: 690, flip: d.x > 800, seed: c.rr(0, 9), p: S.puppet(mainL.add(person(c, d.o))) }));
    const jesus = S.puppet(mainL.add(person(c, CAST.jesus)));
    const disSparks = DIS.map((d) => ({ d, el: mainL.add(`<g opacity="0">${spark(c, 11)}</g>`) }));
    const voice = voiceRings(mainL, c, { n: 3, r: 34, w: 5 });

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(rock(c, 150, 960, 240, 90, C.rock2) + rock(c, 1450, 970, 200, 70, C.rock));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const power = es(t, 2.05, 2.8);
      sk.blend(SKY, GOLD, power * 0.8);
      swing(sunEl, 1190, 170, T, 1.1, 0.7);
      swing(cl1, 500 + Math.sin(T * 0.1) * 24, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1000 + Math.sin(T * 0.12 + 2) * 24, 230, T, 1.4, 0.7, 2);
      birds(T, 1 - power);

      // the crown of light rises from behind the far hills
      const rise = es(t, 2.1, 2.9, ease.out);
      pose(crownEl, { x: 800, y: lerp(520, 330, rise) + Math.sin(T * 0.8) * 3 * rise, s: 0.8 + rise * 0.3, o: seg(t, 2.05, 2.3) });
      pose(glow, { x: 800, y: lerp(560, 330, rise), s: 0.4 + rise * 0.7, r: t * 6, o: rise * 0.62 });

      // the crowd listens; turns towards him as he speaks
      const listen = es(t, 1, 1.4);
      const look = es(t, 2.6, 3);
      people.forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -listen * 5 - look * 10, armF: look * (m.i % 4 === 0 ? 70 : 0), blink: blinkAt(T, m.seed) });
      });
      sparks.forEach(({ m, el }, i) => {
        const on = es(t, 2.2 + i * 0.08, 2.45 + i * 0.08, ease.back);
        pose(el, { x: m.x, y: m.y - 205 * m.s + Math.sin(T * 1.4 + i) * 3, s: on, o: on });
      });

      // Jesus speaks to them
      const speak = es(t, 1, 1.3);
      const point = es(t, 2.1, 2.5);
      jesus.set({ x: 800, y: 612, s: 1.02, armF: 20 + speak * 40 - point * 20 + Math.sin(T * 1.2) * 4 * speak, armB: 10 + speak * 30 + point * 110, head: -2 - point * 6, blink: blinkAt(T, 1) });
      voice(806, 612 - 172 * 1.02, bump(t, 1.05, 1.95), T, { spread: 2.2, speed: 0.5 });
      DIS.forEach((d) => {
        d.p.set({ x: d.x, y: d.y, s: d.s, flip: d.flip, head: -listen * 4 - look * 12, armF: 10 + look * (d.i % 2 ? 50 : 20), armB: look * (d.i === 0 ? 60 : 0), blink: blinkAt(T, d.seed) });
      });
      disSparks.forEach(({ d, el }, i) => {
        if (d.i === 3) { pose(el, { o: 0 }); return; }
        const on = es(t, 2.3 + i * 0.1, 2.55 + i * 0.1, ease.back);
        pose(el, { x: d.x, y: d.y - 212 * d.s + Math.sin(T * 1.3 + i) * 3, s: on, o: on });
      });

      S.cam.z = 1 + es(t, 0.6, 1.6) * 0.06 - es(t, 2.1, 2.9) * 0.04;
      S.cam.y = es(t, 0.6, 1.6) * 30 - es(t, 2.1, 2.9) * 50;
    };
  },
};
