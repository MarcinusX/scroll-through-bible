// Mt 15,29 — back in Galilee: the green mountain above the lake (Matthew 8's, where the Sermon was preached). Jesus
// walks along the lakeside road with His disciples, a hanging tag naming the Sea of Galilee; then He turns up the
// winding path, climbs, growing small against the slope, and sits down on the top. The camera follows Him up.
import { C, person, CAST, blinkAt, pose, lerp, hanging } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { mountSet, PATH, MP, along, pathS } from '../matthew8/lib.js';
import { nameTag, kf, moving, tr } from './lib.js';

const FEET = 758, FOOT = 742;
const UP = PATH.slice().reverse();
const TOP = PATH[0];

export default {
  id: 'mt15-ascent',
  beats: [
    { v: 29, text: 'Stamtąd podążył Jezus dalej i przyszedł nad Jezioro Galilejskie.' },
    { v: 29, cont: true, text: 'Wszedł na górę i tam siedział.' },
  ],
  cam: { x: [-240, 160], y: [-190, 20], z: [1, 1.32] },
  build(S) {
    const M = mountSet(S, { skyCols: ['#cde0da', '#f0e9d0', '#f7e9cc'] });
    const c = M.c;
    const tagEl = hanging(M.hangL, nameTag(c, tr('Jezioro Galilejskie', 'Sea of Galilee'), { size: 17 }), { x: 1060, y: 250, len: 800 });

    const L = S.layer({ par: MP, sh: 5 });
    const DIS = [CAST.peter, CAST.andrew, CAST.john, CAST.james].map((o, i) => ({ i, o, p: S.puppet(L.add(person(c, o))), sit: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const glow = L.add(`<circle r="60" fill="url(#halo-glow)" opacity="0"/>`);
    // where the disciples sit round Him on the top
    const SEATS = [[TOP[0] - 70, TOP[1] + 10], [TOP[0] + 64, TOP[1] + 12], [TOP[0] - 120, TOP[1] + 22], [TOP[0] + 116, TOP[1] + 26]];

    return (t, time) => {
      const T = time;
      M.update(T);

      /* v29a — along the lakeside road to the foot of the mountain */
      const RK = [[-0.15, 1340], [0.9, FOOT]];
      const rx = kf(t, RK, (u) => u);
      const tk = es(t, 0.2, 0.55, ease.back);
      pose(tagEl, { x: 1060, y: 250 - (1 - tk) * 1150, r: T ? Math.sin(T * 0.7) * 1.2 : 0 });

      /* v29b — up the winding path, and He sits down on the top */
      const uJ = es(t, 1.0, 1.55, (u) => u);
      const [px, py, pdir] = along(UP, uJ);
      const onRoad = t < 1.0;
      const jx = onRoad ? rx : px, jy = onRoad ? FEET : py;
      const sat = es(t, 1.56, 1.62);
      jesus.set({ x: jx, y: jy, s: onRoad ? 1.03 : pathS(jy) * 1.03, flip: onRoad ? true : pdir < 0, walk: (onRoad && moving(t, RK)) || (t > 1.0 && t < 1.56) ? (onRoad ? rx * 0.05 : uJ * 90) : undefined, amt: onRoad ? 1 : 0.8, armF: 12 + bump(t, 0.9, 1.0) * 20, o: 1 - sat, blink: blinkAt(T) });
      jSit.set({ x: TOP[0], y: TOP[1] + 4, s: pathS(TOP[1]) * 1.06, o: sat, armF: 20 + es(t, 1.65, 1.85) * 30, armB: 10 + es(t, 1.65, 1.85) * 40, head: 4, blink: blinkAt(T) });
      pose(glow, { x: TOP[0], y: TOP[1] - 40, s: 1, o: sat * 0.7 });
      DIS.forEach((d) => {
        const rxi = kf(t, [[-0.15 + d.i * 0.05, 1440 + d.i * 70], [1.0 + d.i * 0.05, FOOT + 60 + d.i * 50]], (u) => u);
        const u = es(t, 1.04 + d.i * 0.03, 1.5 + d.i * 0.03, (x) => x);
        const [qx, qy, qd] = along(UP, u * 0.97);
        const onR = u <= 0;
        const x = onR ? rxi : qx + (d.i % 2 ? 14 : -14), y = onR ? FEET + (d.i % 2) * 8 : qy;
        const down = es(t, 1.5 + d.i * 0.03, 1.56 + d.i * 0.03);
        const walking = onR ? rxi > FOOT + 60 + d.i * 50 + 1 : u < 1;
        d.p.set({ x, y, s: onR ? 0.98 : pathS(y), flip: onR ? true : qd < 0, walk: walking ? (onR ? x * 0.05 : u * 90) : undefined, amt: onR ? 1 : 0.8, o: 1 - down, blink: blinkAt(T, d.seed) });
        d.sit.set({ x: SEATS[d.i][0], y: SEATS[d.i][1], s: pathS(SEATS[d.i][1]) * 0.98, flip: SEATS[d.i][0] > TOP[0], o: down, head: SEATS[d.i][0] > TOP[0] ? 4 : -4, blink: blinkAt(T, d.seed) });
      });

      /* camera: along the road, then up the mountain to the top */
      const up = es(t, 1.0, 1.6);
      S.cam.x = lerp(kf(t, [[-0.15, 150], [0.9, 0]]), -220, up);
      S.cam.y = lerp(10, -180, up);
      S.cam.z = lerp(1.04, 1.3, up);
    };
  },
};
