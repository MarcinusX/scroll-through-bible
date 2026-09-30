// Łk 13,1 — the curtains open on the green slope by the road where Jesus is teaching the crowds (the talk of
// Luke 12 still going on). Two men come hurrying down the road from the south and break in with the news: a painted
// flat comes down over the crowd — the court of the Temple, the smoke of the altar going up, Galilean pilgrims
// bringing their lambs. Then shadows of soldiers with spears come in beside Pilate's standard, the pilgrims sink
// down grey, and a dark red streak runs into the white smoke of their sacrifice. (Told in shadow and smoke, no more.)
import { C, person, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import {
  teachSet, TG, flatY, flat, flatSky, TELL, PILGRIMS, fig13, smoke, altar, sanctuary, lamb, soldierSil, standard, headAt, kf, moving,
  es, ease, bump, seg, PI,
} from './lib.js';

const { GY, JX, FX, FW, FH, K } = TG;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk13-news',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-20, 40], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S);
    const c = S.c;

    /* the flat: the Temple court, the altar of burnt offering */
    const fl = sheet();
    fl.p(c.cut([[-FW / 2, 40], [FW / 2, 40], [FW / 2, FH / 2], [-FW / 2, FH / 2]], 0.5, 10), mix(C.stone, C.sand, 0.4));
    let tiles = '';
    for (let y = 56; y < FH / 2; y += 20) tiles += c.ribbon([[-FW / 2, y], [FW / 2, y]], 1.2);
    fl.x(tiles, shade(C.stone2, -0.1), 'opacity=".45"');
    const por = sheet();
    por.p(c.cut(c.rect(-FW / 2, -2, FW, 44), 0.4, 10), mix(C.plaster2, C.stone, 0.4));
    let cols = '';
    for (let x = -FW / 2 + 10; x < FW / 2; x += 26) cols += c.cut(c.rect(x, 4, 9, 36), 0.2, 5);
    por.p(cols, C.cream);
    por.p(c.cut(c.rect(-FW / 2, -10, FW, 11), 0.3, 8), mix(C.roof, C.wood3, 0.3));
    const inner = flatSky(S, FW, FH, ['#e8d7b6', '#f6e9cf']) + por.out() + `<g transform="translate(-110 44)">${sanctuary(c, 0.62, { glow: true })}</g>` + fl.out()
      + `<g transform="translate(40 96)">${altar(c, 120, 58)}</g>`;
    const flatEl = T0.FL.add(flat(S, inner, { w: FW, h: FH }));
    const B = T0.bits;
    const smokeW = B.add(`<g>${smoke(c, 150)}</g>`);
    const smokeR = B.add(`<g opacity="0">${smoke(c, 150, '#e7dcd4', mix(C.curtain2, C.stone2, 0.4))}</g>`);
    const PIL = PILGRIMS.map((o, i) => ({
      i, dx: [-58, -18, 118][i], flip: i === 2,
      up: B.add(`<g>${fig13(c, o, { s: 0.36, flip: i === 2, armF: 70, armB: 40, head: -8 })}</g>`),
      down: B.add(`<g opacity="0">${fig13(c, { ...o, pose: 'kneel', robe: mix(o.robe, C.stone2, 0.65), mantle: o.mantle ? mix(o.mantle, C.stone2, 0.65) : null, skin: mix(o.skin, C.stone2, 0.5) }, { s: 0.36, flip: i === 2, armF: 40, armB: 20, head: 24 })}</g>`),
    }));
    const lambEl = B.add(`<g><g transform="scale(.42)">${lamb(c)}</g></g>`);
    const shadows = [0, 1, 2].map((i) => ({ i, el: B.add(`<g opacity="0"><g transform="scale(-.34 .34)">${soldierSil(c, i, { col: '#3a2f3c' })}</g></g>`) }));
    const std = B.add(`<g opacity="0"><g transform="scale(.36)">${standard(c, 300)}</g></g>`);

    /* the two who bring the news */
    const tellers = TELL.map((o, i) => ({ i, p: S.puppet(T0.act.add(person(c, o))), seed: c.rr(0, 9) }));
    const cur = curtains(S);
    const WK = [[[1.0, 1500], [1.34, 944]], [[1.04, 1590], [1.4, 1028]]];

    return (t, time) => {
      const T = time;
      T0.update(t, T);
      cur.set(es(t, 0.05, 0.85), T);
      const g = T0.groups;
      g.forEach((m) => m.sp.set({ x: m.k === 'd' ? 1100 : m.x, y: m.y }));

      /* cover — He is teaching; v1 — two come down the road and tell Him */
      const turn = es(t, 1.2, 1.3);
      T0.jesus.set({ x: JX, y: GY, s: 1.06, flip: turn < 0.5, armF: 20 + bump(t, 0.3, 1.1) * 40 * (1 - turn) + turn * 10, armB: 10 + bump(t, 0.3, 1.1) * 60 * (1 - turn), head: turn * 6 - es(t, 1.5, 1.7) * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, turn < 0.5);
      T0.voice(hx, hy, (1 - es(t, 0.95, 1.1)) * 0.8, T, { dir: -1, spread: 1.8 });
      tellers.forEach((m) => {
        const keys = WK[m.i];
        const x = kf(t, keys);
        const walking = moving(t, keys);
        const point = es(t, 1.45 + m.i * 0.05, 1.6 + m.i * 0.05);
        m.p.set({ x, y: GY + 44, s: 1.0, flip: true, walk: walking ? x * 0.05 : undefined, armF: m.i === 0 ? 30 + point * 110 : 20 + bump(t, 1.36, 1.8) * 50, armB: m.i === 0 ? 10 : 20 + point * 30, head: m.i === 0 ? -point * 14 : 4, o: t > 0.99 ? 1 : 0, blink: blinkAt(T, m.seed) });
      });

      /* the flat: the altar, the pilgrims, the shadows of the soldiers, the reddened smoke */
      const kA = es(t, 1.22, 1.46, ease.out);
      const fy = flatY(kA), on = kA > 0.002 ? 1 : 0;
      pose(flatEl, { x: FX, y: fy, s: K, o: on });
      const Y = (dy) => fy + dy * K;
      const sway = T ? Math.sin(T * 0.9) * 2 : 0;
      const red = es(t, 1.6, 1.72);
      pose(smokeW, { x: X(40), y: Y(34), s: K, r: sway, o: on * (1 - red) });
      pose(smokeR, { x: X(40), y: Y(34), s: K, r: sway, o: on * red });
      const fall = es(t, 1.58, 1.66);
      PIL.forEach((p) => {
        pose(p.up, { x: X(p.dx), y: Y(104), s: K, o: on * (1 - fall) });
        pose(p.down, { x: X(p.dx + (p.flip ? 4 : -4)), y: Y(104), s: K, o: on * fall });
      });
      pose(lambEl, { x: X(-100), y: Y(106), s: K, o: on * (1 - fall) });
      shadows.forEach((sh) => {
        const k = es(t, 1.5 + sh.i * 0.03, 1.6 + sh.i * 0.03);
        pose(sh.el, { x: X(lerp(210, 150 + sh.i * 24, k) + sh.i * 10), y: Y(108 - sh.i * 3), s: K, o: on * k });
      });
      pose(std, { x: X(196), y: Y(110), s: K, o: on * es(t, 1.48, 1.58) });

      S.cam.x = es(t, 1.0, 1.4) * 30;
      S.cam.y = -10;
      S.cam.z = 1.02 + es(t, 0.0, 0.9) * 0.03;
      void seg; void PI; void lerp; void shade;
    };
  },
};
