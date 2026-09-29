// Mt 23,38–39 — dusk in the Temple court. "Behold, your house is left to you desolate": the people on the steps are
// gone, the scribes and Pharisees walk off, a grey drape falls over the bright veil of the sanctuary, the light drains
// out of the court and a few dry leaves skitter over the empty paving. Jesus turns away and walks towards the gate with
// His disciples. There He looks back once: "you will not see me again until you say: Blessed is he who comes in the name
// of the Lord" — and high above, in a last warm light, a cloth banner comes down with those words, palm branches at
// its ends, like the day He rode in.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, NIGHTFALL, pose3, folk, vain, PH, SC, pharisees, clothBanner, frond, TWELVE, tr, PI } from './lib.js';

const JX0 = 800;

export default {
  id: 'mt23-desolate',
  beats: [
    { v: 38 },
    { v: 39 },
  ],
  cam: { x: [-60, 10], y: [-60, 10], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S, { skyCols: NIGHTFALL, sunY: 330 });
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitRow = (n, flip) => pose3(c, Array.from({ length: n }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } })));
    const rows = [stepL.sprite(sitRow(5, false), 330, 604), stepL.sprite(sitRow(4, true), 1030, 604)];

    /* the grey drape over the veil (same depth as the sanctuary) */
    const sanL = S.layer({ par: 0.16, sh: 3 });
    const drape = sanL.add(`<g>${sheet().p(c.cut([[-58, 0], [58, 0], [56, 168], [-56, 168]], 0.6, 8), mix(C.storm, C.stone2, 0.45)).x(c.ribbon([[-30, 4], [-32, 164]], 2) + c.ribbon([[0, 4], [2, 164]], 2) + c.ribbon([[30, 4], [28, 164]], 2), mix(C.storm2, C.stone2, 0.3), 'opacity=".6"').out()}</g>`);

    /* the leaders who leave; Jesus and the disciples who go */
    const P = S.layer({ par: 0.5, sh: 5 });
    const LEAD = [[1000, PH], [1075, SC], [1150, pharisees(1)]].map(([x, o], i) => ({ x, i, p: S.puppet(P.add(vain(c, o))) }));
    const DIS = [TWELVE[0].o, TWELVE[2].o, TWELVE[1].o, TWELVE[3].o].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const leaves = Array.from({ length: 7 }, (_, i) => ({ i, el: P.add(`<g><path d="${c.cut(c.ell(0, 0, 8, 3.6, 10, 0.4), 0.2, 3)}" fill="${[C.wood3, C.ochre, C.clay][i % 3]}"/></g>`) }));

    set.front({ lampsOn: false });
    const dim = S.layer({ par: 0, sh: 1, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night, C.plumRobe, 0.35)}"/>`);
    dim.fade(0);

    /* the banner of the promise, high above */
    const B = S.layer({ par: 0.05, sh: 5 });
    const warm = B.add(`<g><circle r="330" fill="url(#halo-glow)"/></g>`);
    const text = tr('Błogosławiony, który przychodzi w imię Pańskie', 'Blessed is he who comes in the name of the Lord');
    const banner = hanging(B, `<g transform="translate(0 0)">${clothBanner(c, text, { size: 22, col: C.cream, ink: C.terracotta })}</g><g transform="translate(-300 20) rotate(-60)">${frond(c, 120)}</g><g transform="translate(300 20) scale(-1 1) rotate(-60)">${frond(c, 120)}</g>`, { x: 800, y: -400, len: 900 });

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunDY: es(t, 0, 2) * 80 });

      /* v38 — the court empties; the veil greys; the light drains; leaves blow */
      rows.forEach((r, i) => r.set({ x: i ? 1030 : 330, y: 604, o: 1 - es(t, 0.05 + i * 0.1, 0.35 + i * 0.1) }));
      LEAD.forEach((l) => {
        const k = es(t, 0.05 + l.i * 0.05, 0.6 + l.i * 0.05);
        const x = l.x + k * 520;
        l.p.set({ x, y: F + 6 + l.i * 6, s: 0.94, walk: k > 0.02 && k < 0.98 ? x * 0.05 : undefined, head: -8, armF: 20, o: 1 - es(t, 0.55, 0.65) });
      });
      const dk = es(t, 0.3, 0.6, ease.out);
      pose(drape, { x: 800, y: lerp(-300, 244, dk), o: dk > 0.01 ? 1 : 0 });
      dim.fade(es(t, 0.2, 0.8) * 0.34 * (1 - es(t, 1.4, 1.8) * 0.4));
      leaves.forEach((lf) => {
        const k = t > 0.3 ? ((t - 0.3) * 0.8 + lf.i / 7) % 1 : 0;
        pose(lf.el, { x: lerp(1300, 300, k), y: F + 30 + (lf.i % 3) * 20 - Math.abs(Math.sin(k * 9 + lf.i)) * 30, r: k * 700, o: t > 0.3 && t < 1.95 ? Math.sin(k * PI) : 0 });
      });

      /* Jesus turns away and walks to the gate; v39 — He looks back once */
      const go = es(t, 0.45, 1.35);
      const jx = lerp(JX0, 470, go);
      const back = es(t, 1.2, 1.35);
      jesus.set({ x: jx, y: F, s: 1.04, flip: go > 0.02 && back < 0.5, walk: go > 0.02 && go < 0.98 ? jx * 0.05 : undefined, head: 10 * (1 - back) - back * 6, armF: 20 + back * 40, armB: 10 + back * 20, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = lerp(640 - d.i * 60, 300 - d.i * 60, go);
        d.p.set({ x, y: F + 10 + (d.i % 2) * 8, s: 0.92, flip: go > 0.02 && back < 0.5, walk: go > 0.02 && go < 0.98 ? x * 0.05 + d.i : undefined, head: 6, blink: blinkAt(T, d.i + 2) });
      });

      /* the banner of the promise comes down in a warm light */
      const bk = es(t, 1.2, 1.5, ease.out);
      pose(banner, { x: 800, y: lerp(-400, 175, bk), r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: bk > 0.01 ? 1 : 0 });
      pose(warm, { x: 800, y: 195, o: es(t, 1.3, 1.6) });

      S.cam.x = -es(t, 0.5, 1.4) * 50;
      S.cam.y = -es(t, 1.1, 1.5) * 20;
      S.cam.z = 1.02;
    };
  },
};
