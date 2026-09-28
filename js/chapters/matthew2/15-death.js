// Mt 2,19a — Herod's hall, empty and dim. His purple mantle lies over the throne; the crown slides from the seat,
// rolls down the steps and lies still; the candles go out in two thin threads of smoke.
import { C, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { HY, palaceSet, crown, smokeCurl, vpose, kf, tr, PI } from './lib.js';

export default {
  id: 'mt2-death',
  beats: [
    { v: 19, text: 'A gdy Herod umarł,' },
  ],
  cam: { x: [-20, 20], y: [0, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = palaceSet(S, { skyCols: [mix(C.night2, C.plumRobe, 0.3), mix(C.duskViolet, C.night, 0.4), mix(C.dusk, C.duskViolet, 0.5)], cityDim: 0.5 });
    const P = S.layer({ par: 0.45, sh: 5 });
    const ms = sheet();
    ms.p(c.cut([[764, HY - 150], [846, HY - 150], [872, HY - 96], [880, HY - 20], [856, HY - 30], [840, HY - 84], [790, HY - 96], [760, HY - 40], [744, HY - 36], [748, HY - 110]], 0.8, 6), C.terracotta);
    ms.x(c.ribbon([[770, HY - 140], [790, HY - 60]], 3) + c.ribbon([[830, HY - 140], [860, HY - 50]], 3), shade(C.terracotta, -0.2), 'opacity=".6"');
    P.add(ms.out());
    const cr = P.add(`<g>${crown(c)}</g>`);
    const smokes = set.cands.map((f) => ({ x: f.x, el: P.add(`<g>${smokeCurl(c, 120, mix(C.stone2, C.lavender, 0.5))}</g>`) }));
    const dark = S.layer({ par: 0.5, sh: 0, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".45"/>`);

    return (t, time) => {
      const T = time;
      const out = es(t, 0.45, 0.62);
      set.cands.forEach((f, i) => {
        const k = (1 + Math.sin(T * 9 + i * 2) * 0.08) * (1 - out);
        pose(f.el, { x: f.x, y: HY - 150, sx: 1 / Math.max(0.2, k), sy: k, o: 1 - out });
      });
      smokes.forEach((s, i) => vpose(s.el, { x: s.x, y: HY - 152, sy: 0.3 + es(t, 0.5, 0.9) * 0.9, o: bump(t, 0.5, 1.0) * 0.8 }));
      dark.fade(out);
      // the crown slides off the seat, rolls down the dais and lies still
      const x = kf(t, [[0.1, 812], [0.35, 840], [0.7, 930]], ease.io);
      const y = kf(t, [[0.1, HY - 104], [0.35, HY - 86], [0.5, HY - 34], [0.62, HY - 6], [0.7, HY + 6]], ease.in);
      pose(cr, { x, y, s: 2.4, r: kf(t, [[0.1, 0], [0.7, 348]], ease.io) });
      S.cam.z = 1.04 + es(t, 0.1, 0.9) * 0.12;
      S.cam.y = 40 + es(t, 0.1, 0.9) * 30;
      S.cam.x = es(t, 0.3, 0.8) * 10;
    };
  },
};
