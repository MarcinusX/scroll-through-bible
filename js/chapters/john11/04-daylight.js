// J 11,9–10 — "Are there not twelve hours in the day?" A dial of the twelve daylight hours comes down and a little
// sun walks its arc from the first hour to the twelfth. Behind Jesus a path winds over the hills: a traveller walks it
// in the light of this world, sees the stone and steps over it. Then night falls — the sun sinks, the stage darkens —
// and the same traveller, with no light in him, strikes his foot on the stone and stumbles. Only Jesus still shines.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { band, hillsWith, grass, sun, stars, cypress, olive, bush, rock } from '../../assets/nature.js';
import { DISC, DAY, NIGHT, dayArc, hourAt, sunToken, rayBurst, hanging, sky, vis, kf, moving, pose, sheet, shade, mix, lerp, tr, PI } from './lib.js';

const F = 712;
const PY = (x) => 604 + Math.sin(x / 140) * 8;      // the path in the middle distance
const STONE = 1010;

export default {
  id: 'j11-daylight',
  beats: [
    { v: 9, text: 'Jezus im odpowiedział:' },
    { v: 9, cont: true, text: '«Czyż dzień nie liczy dwunastu godzin?' },
    { v: 9, cont: true, text: 'Jeżeli ktoś chodzi za dnia, nie potknie się, ponieważ widzi światło tego świata.' },
    { v: 10 },
  ],
  cam: { x: [-40, 60], y: [-80, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAY);
    const starL = S.layer({ par: 0.02, sh: 0, flat: true });
    starL.add(stars(c, { x0: -200, x1: 1800, y0: -200, y1: 460, n: 70 }));
    const hangL = S.layer({ par: 0.04, sh: 3 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1160, y: 200, len: 420 });
    const rays = hangL.add(`<g>${rayBurst(c, { n: 16, r0: 60, r1: 700, spread: 0.05, o: 0.35 })}</g>`);
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 470, amps: [18, 8, 3], lens: [900, 300, 120], color: mix(C.hillFar, C.sand, 0.2) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const m1 = hillsWith(c, { y: 560, amps: [10, 5, 2], lens: [700, 240, 90], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    const pts = [];
    for (let x = -700; x <= 2300; x += 40) pts.push([x, PY(x) + 6]);
    mid.add(m1.markup + sheet().p(c.ribbon(pts, 26, 1), C.sand).x(c.ribbon(pts.map(([x, y]) => [x, y + 3]), 10, 1), C.sand2, 'opacity=".5"').out() + olive(c, 330, PY(330) - 6, 0.6) + cypress(c, 1330, PY(1330) - 4, 110));
    const walkL = S.layer({ par: 0.22, sh: 3 });
    walkL.add(rock(c, STONE, PY(STONE) + 12, 40, 24, C.rock2));
    const walker = S.puppet(walkL.add(person(c, { robe: C.wheatRobe, mantle: C.clay, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.clay, beard: 'short', skin: C.skin3, belt: C.leather, holdB: `<path d="${c.ribbon([[0, -40], [0, 70]], 3.4)}" fill="${C.wood2}"/>` })));
    // night: a dark wash over the land (the front stays lit around Jesus)
    const nightL = S.layer({ par: 0.3, sh: 0, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".62"/>`);
    const ground = S.layer({ par: 0.42, sh: 3 });
    const g1 = band(c, { y: 660, amps: [5, 2], lens: [600, 200], color: mix(C.hillNear, C.sand, 0.3) });
    ground.add(g1.markup + grass(c, { x0: -800, x1: 2400, y: 660, fn: g1.fn, n: 44, h: 14, color: C.moss }) + bush(c, 420, 690, 70, C.sage, C.moss) + bush(c, 1220, 690, 80, C.moss, C.sage));
    const glowL = S.layer({ par: 0.46, sh: 0, flat: true });
    const jGlow = glowL.add(`<g><circle r="320" fill="url(#halo-glow)"/></g>`);
    const A = S.layer({ par: 0.5, sh: 5 });
    const SIDE = [[470, 0, 0], [400, 0, 5], [1130, 1, 3], [1200, 1, 1]];
    const disc = SIDE.map(([x, f, k], i) => ({ i, x, flip: !!f, p: S.puppet(A.add(person(c, DISC[k]))) }));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));

    const X = S.layer({ par: 0.56, sh: 6 });
    const dial = X.add(`<g>${dayArc(c, 120, { label: tr('12 godzin', '12 hours'), marks: [1, 3, 6, 9, 12] })}</g>`);
    const tok = X.add(`<g>${sunToken(c, 13)}</g>`);

    return (t, time) => {
      const T = time;
      /* night falls in v10 */
      const nk = es(t, 3.0, 3.35);
      sk.blend(DAY, NIGHT, nk);
      starL.fade(nk);
      nightL.fade(nk);
      pose(sunEl, { x: 1160, y: 200 + nk * 520, r: Math.sin(T * 0.6) * 1.5 });
      const lightW = es(t, 2.05, 2.35) * (1 - nk);
      vis(rays, { x: 1160, y: 200, r: T * 1.5, o: lightW });
      vis(jGlow, { x: 800, y: 540, s: 0.8 + nk * 0.4, o: 0.25 + nk * 0.75 });

      /* the dial of twelve hours */
      const dk = es(t, 0.3, 0.7, ease.out) * (1 - es(t, 2.1, 2.4, ease.in));
      const dy = 330 - (1 - dk) * 560;
      vis(dial, { x: 800, y: dy, r: Math.sin(T * 0.6) * 0.6, o: dk > 0.01 ? 1 : 0 });
      const h = es(t, 1.1, 1.9, ease.sine) * 12;
      const [ox, oy] = hourAt(120, h);
      vis(tok, { x: 800 + ox, y: dy + oy, o: dk > 0.01 ? es(t, 1.0, 1.1) : 0 });

      /* the traveller: by day he steps over the stone; at night he stumbles */
      const day = t < 3.0;
      const u = day ? es(t, 2.05, 2.95, ease.sine) : es(t, 3.25, 3.58, ease.in);
      const x = day ? lerp(380, 1260, u) : lerp(720, STONE - 12, u);
      const hop = day ? bump(x, STONE - 50, STONE + 50) * 22 : 0;
      const trip = es(t, 3.58, 3.7, ease.out);
      const on = day ? (u > 0.001 && u < 0.999 ? 1 : 0) : (t > 3.25 ? 1 : 0);
      walker.set({ x: x + trip * 20, y: PY(x) + 6 - hop + trip * 4, s: 0.62, walk: (day ? u > 0 && u < 1 : u > 0 && trip < 0.5) ? x * 0.14 : undefined, armF: 20 + trip * 70, armB: 10 + trip * 60, r: trip * 58, head: trip * 10, blink: blinkAt(T, 4), o: on });

      /* Jesus and the four who listen */
      const speak = es(t, 0.1, 0.4);
      jesus.set({ x: 800, y: F, s: 1.04, flip: t > 2.0 && t < 3.0, armF: 20 + speak * 30 + bump(t, 1.1, 1.9) * 50, armB: 10 + bump(t, 2.1, 2.9) * 70, head: -bump(t, 1.1, 1.9) * 8, blink: blinkAt(T, 1) });
      disc.forEach((d) => d.p.set({ x: d.x, y: F + 6 + (d.i % 2) * 6, s: 0.92, flip: d.flip, armF: 10 + bump(t, 3.8, 4.0) * 20, head: -bump(t, 1.1, 1.9) * 8 + nk * 4, blink: blinkAt(T, d.i + 5) }));

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 20], [3, 40], [4, 40]]);
      S.cam.y = kf(t, [[0, 0], [1, -70], [2, -40], [3, -20], [4, -20]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.06], [3, 1.08], [4, 1.1]]);
    };
  },
};
