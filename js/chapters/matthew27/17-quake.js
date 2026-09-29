// Mt 27,51b–53 — outside the city, a rocky slope with tombs cut in it, under the grey light after the darkness.
// The earth quakes: the whole set shakes, cracks run down the rock face and a great boulder by the road splits
// in two. The round stones roll away from the tombs, a soft light glows inside, and pale figures of light stand
// in the doorways — many of the holy ones who had fallen asleep, raised. Then a paper strip comes down, "after His
// resurrection": the sky turns to dawn gold and the figures of light walk along the road to the gate of the holy
// city, where people look up and see them.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, bush, grass, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { rockTomb, tombDisc, lightFigure, cityWall, strip, man, woman, SKIES, tr, PI } from './lib.js';

const GY = 700;
const TOMBS = [[520, 596], [760, 572], [1000, 590]];

export default {
  id: 'mt27-quake',
  beats: [
    { v: 51, cont: true, text: 'ziemia zadrżała i skały zaczęły pękać.' },
    { v: 52 },
    { v: 53 },
  ],
  cam: { x: [-20, 310], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKIES.grey);
    const far = S.layer({ par: 0.08, sh: 2, pad: 12 });
    far.add(band(c, { y: 470, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.hillFar, C.stone2, 0.4) }).markup);
    const cityL = S.layer({ par: 0.2, sh: 4, pad: 12 });
    cityL.add(cityWall(c, 1180, 2400, 470, 640, { towers: [{ x: 1230, w: 60, h: 40 }, { x: 1560 }], gate: { x: 1360, w: 76, h: 120 } }));
    /* the rock face with its tombs */
    const rockL = S.layer({ par: 0.26, sh: 4, pad: 14 });
    const R = sheet();
    R.p(c.cut([[-900, 700], [-900, 520], [200, 470], [380, 440], [560, 420], [760, 400], [960, 420], [1120, 470], [1200, 540], [1230, 700]], 2.4, 12), mix(C.rock, C.rock2, 0.4));
    R.x(c.cut(c.blob(640, 480, 90, 26, 9, 0.3), 1, 6) + c.cut(c.blob(900, 470, 70, 20, 9, 0.3), 1, 6) + c.cut(c.blob(300, 520, 80, 22, 9, 0.3), 1, 6), shade(C.rock, 0.18), 'opacity=".55"');
    rockL.add(R.out());
    const tombs = TOMBS.map(([x, y]) => ({ x, y, el: rockL.add(`<g transform="translate(${x} ${y})">${rockTomb(c, { stone: false })}</g>`) }));
    tombs.forEach((tb) => { tb.glow = tb.el.querySelector('.glow'); });
    const cracks = [[430, 440, 110], [690, 410, 150], [900, 425, 120], [1090, 470, 90]].map(([x, y, h]) => {
      const pts = [[0, 0]];
      for (let i = 1; i <= 6; i++) pts.push([c.rr(-12, 12), (h * i) / 6]);
      return { x, y, el: rockL.add(`<g>${sheet().p(c.ribbon(pts, (u) => 5 - u * 4), mix(C.soilRich, C.storm2, 0.3)).out()}</g>`) };
    });
    const stoneL = S.layer({ par: 0.26, sh: 5, pad: 14 });
    const stones = TOMBS.map(([x, y]) => ({ x, y, el: stoneL.add(`<g>${tombDisc(c)}</g>`) }));
    const figL = S.layer({ par: 0.26, sh: 3 });
    const figs = TOMBS.map(([x, y], i) => ({ i, x, y, el: figL.add(`<g>${lightFigure(c, { hairStyle: i === 1 ? 'veil' : 'short' })}</g>`) }));
    const extra = [0, 1].map((i) => ({ i, el: figL.add(`<g>${lightFigure(c, { hairStyle: i ? 'short' : 'veil' })}</g>`) }));
    /* the road and the split boulder */
    const ground = S.layer({ par: 0.4, sh: 3, pad: 14 });
    const gfn = c.wave(660, [6, 3], [700, 200]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.rock2, 0.4)).out());
    ground.add(sheet().p(c.ribbon([[-900, GY + 6], [2500, GY - 6]], 60), mix(C.sand, C.stone2, 0.35)).out());
    ground.add(grass(c, { x0: -600, x1: 2300, y: 660, fn: gfn, n: 26, h: 12, color: mix(C.olive, C.rock3, 0.3) }) + cypress(c, 1150, 668, 150, C.moss2) + bush(c, 200, 670, 80, C.sage));
    const bL = S.layer({ par: 0.45, sh: 5, pad: 14 });
    const half = (sx) => sheet().p(c.cut(sx < 0 ? [[0, 0], [-6, -30], [2, -58], [-4, -92], [-60, -96], [-100, -60], [-96, 0]] : [[0, 0], [-6, -30], [2, -58], [-4, -92], [50, -94], [92, -56], [96, 0]], 1, 6), sx < 0 ? C.rock2 : shade(C.rock2, 0.06)).out();
    const bLeft = bL.add(`<g>${half(-1)}</g>`), bRight = bL.add(`<g>${half(1)}</g>`);
    /* people at the gate */
    const P = S.layer({ par: 0.4, sh: 4 });
    const townP = [0, 1].map((i) => ({ i, p: S.puppet(P.add(person(c, i ? woman(c) : man(c)))) }));
    const tagL = S.layer({ par: 0.3, sh: 5 });
    const after = hanging(tagL, strip(c, tr('po Jego zmartwychwstaniu', 'after his resurrection'), { size: 20 }), { x: 0, y: -1500, len: 900 });
    const fg = S.layer({ par: 0.95, sh: 7, pad: 14 });
    fg.add(rock(c, 80, 990, 320, 110, C.rock3) + bush(c, 1600, 960, 220, mix(C.moss, C.rock3, 0.3)));

    return (t, time) => {
      const T = time;
      const dawn = es(t, 2.0, 2.5);
      sk.blend(SKIES.grey, SKIES.dawn, dawn);
      /* v51b — the earth quakes, the rocks split */
      const q = bump(t, 0.05, 0.75) + bump(t, 1.02, 1.3) * 0.4;
      const jx = Math.sin(t * 90) * 7 * q, jy = Math.cos(t * 71) * 4 * q;
      [rockL, stoneL, ground, bL, fg].forEach((L, i) => L.shift(jx * (0.6 + i * 0.15), jy));
      cityL.shift(jx * 0.4, jy * 0.5); far.shift(jx * 0.2, 0);
      cracks.forEach((k, i) => pose(k.el, { x: k.x, y: k.y, sx: 1, sy: Math.max(0.01, es(t, 0.15 + i * 0.07, 0.45 + i * 0.07)), o: t > 0.15 + i * 0.07 ? 1 : 0 }));
      const split = es(t, 0.3, 0.6, ease.out);
      pose(bLeft, { x: 330 - split * 24, y: 730, r: -split * 8, ox: 0, oy: 0 });
      pose(bRight, { x: 330 + split * 24, y: 730, r: split * 8 });
      /* v52 — the tombs open; the holy ones raised */
      stones.forEach((st, i) => {
        const k = es(t, 1.05 + i * 0.06, 1.4 + i * 0.06);
        pose(st.el, { x: st.x + k * 64, y: st.y - 31 + 2, r: k * 150 });
      });
      tombs.forEach((tb, i) => fade(tb.glow, es(t, 1.2 + i * 0.05, 1.5 + i * 0.05)));
      const out = seg(t, 2.3, 2.95);
      figs.forEach((f) => {
        const k = es(t, 1.4 + f.i * 0.08, 1.7 + f.i * 0.08);
        const u = Math.max(0, Math.min(1, (out - f.i * 0.12) / 0.8));
        const x = lerp(f.x, 1250 + f.i * 50, ease.io(u)), y = lerp(f.y, GY - 4, Math.min(1, u * 2.5));
        pose(f.el, { x, y: y - Math.abs(Math.sin(u * 14)) * 3, s: lerp(0.34, 0.6, Math.min(1, u * 2.5)), o: k });
      });
      extra.forEach((f) => {
        const k = seg(t, 2.45 + f.i * 0.12, 2.95 + f.i * 0.1);
        pose(f.el, { x: lerp(700 - f.i * 90, 1180 - f.i * 60, k), y: GY - 2, s: 0.6, o: es(t, 2.3, 2.45) * (k < 1 ? 1 : 1) });
      });
      /* v53 — after His resurrection: into the holy city */
      const ak = es(t, 2.05, 2.35) * (1 - es(t, 3.3, 3.6));
      swing(after, 900, 170 - (1 - ak) * 800, T, 1, 0.8, 1);
      const see = es(t, 2.6, 2.85);
      townP.forEach((m) => m.p.set({ x: 1330 + m.i * 70, y: GY - 16, s: 0.66, flip: true, armF: 20 + see * 70, armB: 10 + see * (m.i ? 120 : 40), head: -see * 6, o: dawn, blink: blinkAt(T, m.i + 3) }));

      S.cam.x = es(t, 2.15, 2.8) * (S.portrait ? 300 : 160);
      S.cam.y = 10 + es(t, 0.9, 1.3) * 20 * (1 - es(t, 2.1, 2.5));
      S.cam.z = 1.02 + es(t, 0.9, 1.3) * 0.08 * (1 - es(t, 2.1, 2.5));
    };
  },
};
