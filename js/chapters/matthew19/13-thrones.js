// Mt 19,28 — "Truly I tell you": He stands among the Twelve. "In the new world, when the Son of Man sits on the throne
// of His glory" — the sky turns to gold, the ground breaks into flowers, a throne of light comes down and He is
// raised up and seated on it. "You who have followed Me will also sit on twelve thrones" — twelve small seats of
// light rise under the Twelve, and they are seated round Him; "judging the twelve tribes of Israel" — the twelve
// banners of the tribes rise in a row in front of them.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, flowers, grass, olive, palm } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { TWELVE, lightThrone, throneOfLight, banner, sparkle, DAY } from './lib.js';

const GY = 690;
const TX = 800, TY = 420;        // the throne of glory (seat)
const GOLD = ['#e9d3a6', '#f8e2b0', '#fbeccb'];
// the twelve seats: six on each side, in an arc
// (phone: a narrower arc, so the outermost seats are not past the edges)
const seatsFor = (P) => Array.from({ length: 12 }, (_, k) => {
  const side = k < 6 ? -1 : 1, i = k % 6;
  return { k, side, i, x: TX + side * (P ? 100 + i * 32 : 132 + i * 46), y: 596 + i * 11 };
});

export default {
  id: 'mt19-thrones',
  enter: 'fly',
  beats: [
    { v: 28, text: 'Jezus zaś rzekł do nich: «Zaprawdę, powiadam wam:' },
    { v: 28, cont: true, text: 'Przy odrodzeniu, gdy Syn Człowieczy zasiądzie na swym tronie chwały,' },
    { v: 28, cont: true, text: 'wy, którzy poszliście za Mną, zasiądziecie również na dwunastu tronach, sądząc dwanaście pokoleń Izraela.' },
  ],
  cam: { x: [-20, 20], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SEATS = seatsFor(P);
    sky(S, DAY);
    const gold = sky(S, GOLD, { name: 'gold' });
    const glowL = S.layer({ par: 0.04, sh: 1, flat: true, rise: 0 });
    const burst = glowL.add(`<g opacity="0">${rays(c, { n: 24, r0: 80, r1: 1000, spread: 0.045, color: '#fff3cf' })}<circle r="320" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 150, len: 700 });
    const cls = [[430, 150, 170], [1150, 120, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 }) }));

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 450, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.halo, 0.2) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(hillsWith(c, { y: 520, amps: [14, 6, 2], lens: [800, 280, 100], color: C.hillMid, trees: 22, treeColor: C.leaf, treeH: 22 }).markup);
    const groundL = S.layer({ par: 0.32, sh: 3 });
    const gfn = c.wave(585, [5, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.45)).out());
    groundL.add(olive(c, 250, 600, 1.05) + palm(c, 1380, 600, 210) + olive(c, 1500, 604, 0.9) + palm(c, 120, 604, 180));
    groundL.add(grass(c, { x0: -400, x1: 2000, y: 590, fn: gfn, n: 40, h: 14, color: C.moss }));
    // the new world: flowers break out all over the ground
    const bloomL = S.layer({ par: 0.32, sh: 2 });
    bloomL.add(flowers(c, { x0: -400, x1: 2000, y: 590, fn: gfn, n: 90, h: 20 }) + flowers(c, { x0: -400, x1: 2000, y: 640, fn: (x) => gfn(x) + 60, n: 70, h: 22 }) + flowers(c, { x0: -400, x1: 2000, y: 720, fn: (x) => gfn(x) + 140, n: 60, h: 26 }));

    /* the throne of glory */
    const thL = S.layer({ par: 0.45, sh: 4 });
    const throne = thL.add(`<g opacity="0"><g transform="scale(.9)">${throneOfLight(c)}</g></g>`);
    const jSit = S.puppet(thL.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    /* the twelve seats and the Twelve */
    const seatL = S.layer({ par: 0.48, sh: 4 });
    const seats = SEATS.map((s) => seatL.add(`<g opacity="0"><g transform="scale(${s.side < 0 ? 0.55 : -0.55} .55)">${lightThrone(c, 1)}</g></g>`));
    const pL = S.layer({ par: 0.48, sh: 5 });
    const ORDER = [0, 2, 4, 6, 8, 10, 1, 3, 5, 7, 9, 11];     // who sits where (Peter nearest on the left, Andrew on the right)
    const DIS = SEATS.map((s) => {
      const o = TWELVE[ORDER[s.k]].o;
      return { ...s, seed: c.rr(0, 9), stand: S.puppet(pL.add(person(c, o))), sit: S.puppet(pL.add(person(c, { ...o, pose: 'sit' }))) };
    });
    const jStand = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const sparks = SEATS.map(() => pL.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    /* the banners of the twelve tribes */
    const banL = S.layer({ par: 0.6, sh: 4 });
    const BAN = Array.from({ length: 12 }, (_, i) => ({ i, x: P ? 580 + i * 40 : 452 + i * 63.5, el: banL.add(`<g>${banner(c, i, 140)}</g>`) }));

    return (t, time) => {
      const T = time;
      /* beat 1: the new world — gold sky, flowers, the throne comes down */
      const renew = es(t, 1.02, 1.5);
      gold.layer.fade(renew);
      bloomL.fade(renew);
      pose(burst, { x: TX, y: TY - 80, s: 0.7 + renew * 0.4, r: t * 5, o: renew * 0.75 });
      swing(sunEl, 1260, 150 + renew * 400, T, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y - renew * 700, T, 1.4, 0.7, cl.i));
      const th = es(t, 1.1, 1.45, ease.out);
      pose(throne, { x: TX, y: TY - (1 - th) * 700, o: th > 0.01 ? 1 : 0 });

      /* Jesus: standing among them (0), raised up to the throne and seated (1) */
      const rise = es(t, 1.35, 1.62);
      const seated = es(t, 1.6, 1.66);
      const speak = es(t, 0.02, 0.25) * (1 - es(t, 0.9, 1.1));
      jStand.set({ x: TX, y: lerp(GY - 10, TY + 18, rise), s: lerp(1.02, 0.94, rise), o: 1 - seated, armF: 20 + speak * 50 + rise * 40, armB: speak * 40 + rise * 60, head: -3 - rise * 4 + Math.sin(T * 0.6), blink: blinkAt(T) });
      jSit.set({ x: TX - 6, y: TY + 20, s: 0.94, o: seated, armF: 40 + es(t, 2.05, 2.3) * 40, armB: 20 + es(t, 2.05, 2.3) * 110, head: -2, blink: blinkAt(T, 1) });

      /* beat 2: the twelve seats rise under the Twelve; the tribes' banners come up in front */
      DIS.forEach((d) => {
        const k = es(t, 2.1 + d.i * 0.06, 2.35 + d.i * 0.06, ease.back);
        const sw = es(t, 2.25 + d.i * 0.06, 2.31 + d.i * 0.06);
        const fl = d.side > 0;
        const look = es(t, 0.1, 0.4) * (1 - rise) + rise;
        d.stand.set({ x: d.x - d.side * 6, y: d.y + 58, s: 0.64, flip: fl, o: 1 - sw, armF: 10 + bump(t, 1.4, 2.0) * 20, head: -4 - look * 10, blink: blinkAt(T, d.seed) });
        d.sit.set({ x: d.x + (fl ? -6 : 6), y: d.y - 22, s: 0.58, flip: fl, o: sw, armF: 30, head: -8, blink: blinkAt(T, d.seed) });
        pose(seats[d.k], { x: d.x, y: d.y + 6, s: k, o: k > 0.01 ? 1 : 0 });
        const sp = bump(t, 2.25 + d.i * 0.06, 2.8 + d.i * 0.06);
        pose(sparks[d.k], { x: d.x, y: d.y - 90, s: sp, r: T * 30, o: sp > 0.02 ? 1 : 0 });
      });
      BAN.forEach((b) => {
        const k = es(t, 2.4 + Math.abs(b.i - 5.5) * 0.04, 2.7 + Math.abs(b.i - 5.5) * 0.04, ease.back);
        pose(b.el, { x: b.x, y: 772 + (1 - k) * 280, r: Math.sin(T * 1.2 + b.i) * 1.5, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 1.0, 1.6) * 0.02 + es(t, 2.0, 2.5) * 0.02;
      S.cam.y = -es(t, 1.0, 1.6) * 50 + es(t, 2.0, 2.5) * 30;
    };
  },
};
