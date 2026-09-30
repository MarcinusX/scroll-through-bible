// Łk 8,4 — a level plain under the hills. From the walled towns and the villages on every side people come down
// the roads, knot after knot, and settle round the low green rise where Jesus stands, until the plain is full.
// Then He lifts His hand and begins "in parables": a little round plate of a sower comes down over Him on a string.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { plainSet, plainCrowd, plainS, ROADS, RISE, alongPts, sowerPlate, discPlate, voiceRings, headAt, hangAt, glyphTag, PI } from './lib.js';

const JX = 800;

export default {
  id: 'lk8-crowd',
  beats: [
    { v: 4, text: 'Gdy zebrał się wielki tłum i z miast przychodzili do Niego;' },
    { v: 4, cont: true, text: 'rzekł w przypowieściach:' },
  ],
  cam: { x: [-40, 40], y: [-60, 60], z: [0.96, 1.14] },
  build(S) {
    const P = plainSet(S);
    const c = P.c;
    const crowd = plainCrowd(P.crowdL);
    // each knot walks down its road and then out to its place
    crowd.forEach((g) => {
      const road = ROADS[g.road];
      g.path = [...road.slice(0, -1), [lerp(road[road.length - 2][0], g.x, 0.5), lerp(road[road.length - 2][1], g.y, 0.5)], [g.x, g.y]];
      g.d = (g.i % 5) * 0.09 + (g.road === 1 ? 0.12 : 0);
    });
    const bangs = [[140, 0], [800, 0.1], [1480, 0.05]].map(([x, d], i) => ({ x, d, el: P.fx.add(`<g opacity="0">${glyphTag(c, '!', { size: 18 })}</g>`) }));

    const jesus = S.puppet(P.act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 40, w: 5 });
    const plate = P.hangL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-84" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${discPlate(c, `<g transform="scale(1.1)">${sowerPlate(c)}</g>`, { r: 76 })}</g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      /* v4a — a great crowd, from town after town */
      crowd.forEach((g) => {
        const u = es(t, 0.02 + g.d, 0.72 + g.d, (x) => x * (2 - x));
        const [x, y] = alongPts(g.path, u);
        const walking = u > 0 && u < 1;
        g.sp.set({ x, y: y - (walking ? Math.abs(Math.sin(u * 40 + g.i)) * 2 : 0), s: Math.min(1, plainS(y) / g.s), o: seg(t, 0.0 + g.d, 0.06 + g.d) });
      });
      bangs.forEach((b) => {
        const k = bump(t, 0.05 + b.d, 0.6 + b.d);
        pose(b.el, { x: b.x, y: P.hfn(b.x) - 70, s: k, o: k });
      });

      /* v4b — He speaks to them in parables */
      const speak = es(t, 1.05, 1.35);
      jesus.set({ x: JX, y: RISE, s: 1.02, armF: 16 + speak * 60 + bump(t, 0.3, 0.9) * 30, armB: 8 + speak * 110, head: -speak * 6, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, RISE, 1.02, false);
      voice(hx, hy, speak * (1 - es(t, 1.85, 2)), T, { spread: 2.6 });
      const pk = es(t, 1.2, 1.6, ease.out);
      hangAt(plate, JX, lerp(-1500, 250, pk), T, 1.2, 0.7);

      S.cam.z = 0.98 + es(t, 0.6, 1.4) * 0.12;
      S.cam.y = -20 + es(t, 0.6, 1.4) * 30;
      S.cam.x = 0;
    };
  },
};
