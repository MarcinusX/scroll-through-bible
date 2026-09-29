// Mt 27,5b — told only from far away. Dusk outside the city: Jerusalem small on the left, a bare ridge on the
// right with one dark, leafless tree on its crest. A small dark figure climbs the skyline away from the city,
// passes the tree and goes down behind the hill. Nothing more is shown: the tree stands alone against the
// darkening sky, and a bird flies off from its branches.
import { C, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, rock, bush, grass, stars } from '../../assets/nature.js';
import { seg, es } from '../../core/anim.js';
import { bareTree, shadowPerson, farCity, JUDAS, MT } from './lib.js';

const TX = 1060;
const SIL = '#2c2533';

export default {
  id: 'mt27-tree',
  beats: [
    { v: 5, cont: true, text: 'potem poszedł i powiesił się.' },
  ],
  cam: { x: [0, 60], y: [-30, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, MT.dusk);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -400, x1: 2000, y0: -300, y1: 300, n: 30 }));
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 540, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.duskViolet, C.storm, 0.35) }).markup);
    far.add(`<g transform="translate(360 546)">${farCity(c, 0.55, { col: mix(C.stone, C.duskViolet, 0.5) })}</g>`);
    // the ridge (its skyline is the path)
    const ridge = (x) => (x < TX ? lerp(600, 470, Math.pow(Math.max(0, (x - 520) / (TX - 520)), 0.8)) : lerp(470, 600, Math.min(1, (x - TX) / 460)));
    const walkL = S.layer({ par: 0.16, sh: 2 });
    const judas = S.puppet(walkL.add(shadowPerson(c, JUDAS, SIL)));
    const bird = walkL.add(`<g><path d="${c.poly([[-12, 0], [-4, -5], [0, -2], [4, -5], [12, 0], [3, -1], [0, 2], [-3, -1]])}" fill="${SIL}"/></g>`);
    const hillL = S.layer({ par: 0.16, sh: 3 });
    const pts = [[-900, 1700], [-900, 600]];
    for (let x = 400; x <= 1700; x += 20) pts.push([x, ridge(x) + Math.sin(x * 0.05) * 1.5]);
    pts.push([2500, 620], [2500, 1700]);
    hillL.add(sheet().p(c.cut(pts, 1.2, 10), mix(C.rock3, C.duskViolet, 0.45)).out());
    hillL.add(`<g transform="translate(${TX} ${ridge(TX) + 4})">${bareTree(c, 200, SIL)}</g>`);
    const near = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(700, [6, 3], [700, 200]);
    near.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.duskViolet, 0.45)).out());
    near.add(grass(c, { x0: -600, x1: 2300, y: 700, fn: gfn, n: 26, h: 12, color: mix(C.olive, C.duskViolet, 0.4) }) + rock(c, 380, 716, 110, 34, mix(C.rock2, C.duskViolet, 0.35)));
    const fg = S.layer({ par: 0.95, sh: 7 });
    fg.add(rock(c, 120, 990, 320, 110, mix(C.rock3, C.duskViolet, 0.4)) + bush(c, 1560, 960, 220, mix(C.thorn, C.duskViolet, 0.3)));

    return (t, time) => {
      const T = time;
      const dk = es(t, 0, 0.9);
      sk.blend(MT.dusk, MT.dark, dk);
      starL.fade(dk * 0.5);
      /* the small figure climbs the skyline, passes the tree and goes down behind the hill */
      const u = seg(t, 0.02, 0.72);
      const x = lerp(640, 1240, u);
      const y = x <= TX ? ridge(x) + 3 : ridge(x) + 3 + (x - TX) * 0.75;
      judas.set({ x, y, s: 0.36, flip: false, walk: u > 0 && u < 1 ? x * 0.12 : undefined, amt: 0.6, head: 8, lean: x < TX ? -4 : 4, o: u < 1 ? 1 : 0 });
      /* a bird flies off the tree */
      const b = seg(t, 0.62, 0.98);
      pose(bird, { x: TX + 30 + b * 320, y: 330 - b * 140 + Math.sin(b * 9) * 6, s: 0.8 + Math.sin(T * 14) * 0.15 * (b > 0 && b < 1 ? 1 : 0), o: b > 0 && b < 1 ? 1 : 0 });
      S.cam.x = 30 + es(t, 0, 0.8) * 20;
      S.cam.y = -10;
      S.cam.z = 1.02 + es(t, 0, 0.9) * 0.04;
    };
  },
};
