// Łk 4,29b–30 — the brow of the hill Nazareth is built on: the town above on the right, on the left the rock falls
// away sheer to the valley far below. The crowd drives Him to the very edge — pebbles skitter over — to throw Him
// down. But He turns and walks straight through the middle of them: the ranks draw apart as He passes, fists still
// raised, nobody moves, and He goes on His way along the hillside path, a quiet light with Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, olive, cypress, grass, sun, cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { GOLDEN, figure, manO, womanO, village, headAt, PI } from './lib.js';

const EDGE = 590;
const gy = (x) => (x < EDGE ? 2000 : 540 - Math.max(0, x - 1500) * 0.08 + Math.sin(x * 0.01) * 3);

export default {
  id: 'lk4-brow',
  beats: [
    { v: 29, cont: true, text: 'i wyprowadzili aż na stok góry, na której ich miasto było zbudowane, aby Go strącić.' },
    { v: 30 },
  ],
  cam: { x: [-40, 420], y: [-20, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 380, y: 230, len: 800 });
    const cl = hanging(hangL, cloud(c, 180, '#f6e3d2', '#e8cdb8'), { x: 1100, y: 150, len: 800 });

    /* far valley, far below the brow */
    S.layer({ par: 0.06, sh: 2 }).add(band(c, { y: 470, amps: [14, 6, 2], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    const vall = S.layer({ par: 0.14, sh: 2 });
    const vb = sheet().p(c.ridge(c.wave(640, [6, 3], [800, 200]), -900, 2600, 1800, 14, 0.6), mix(mix(C.sage2, C.sand, 0.4), C.skyBlue2, 0.35));
    let fields = '';
    for (let i = 0; i < 40; i++) { const x = c.rr(-600, 1400), y = c.rr(660, 950); fields += c.cut(c.rect(x, y, c.rr(60, 140), c.rr(14, 30)), 0.4, 8); }
    vb.x(fields, mix(C.wheat, C.sage2, 0.5), 'opacity=".6"');
    vall.add(vb.out());

    /* the town above on its hill */
    const townL = S.layer({ par: 0.3, sh: 3 });
    const tfn = (x) => 520 - 180 * Math.exp(-Math.pow((x - 1500) / 420, 2));
    const tp = [];
    for (let x = 700; x <= 2800; x += 14) tp.push([x, tfn(x) + c.rr(-1, 1)]);
    tp.push([2800, 1700], [700, 1700]);
    townL.add(sheet().p(c.poly(tp), mix(C.hillNear, C.sand, 0.3)).out());
    const r = makeCutter('lk4-brow-town');
    townL.add(village(r, 1380, tfn(1380) + 6, { n: 6, spread: 260, sc: 0.8 }) + village(r, 1650, tfn(1650) + 6, { n: 5, spread: 220, sc: 0.8 }) + village(r, 1180, tfn(1180) + 8, { n: 4, spread: 160, sc: 0.75 }) + cypress(c, 1060, tfn(1060) + 6, 110));

    /* the brow and the cliff */
    const G = S.layer({ par: 0.5, sh: 4, pad: 360 });
    const gp = [[EDGE - 260, 2000], [EDGE - 170, 900], [EDGE - 120, 780], [EDGE - 40, 640], [EDGE, 546]];
    for (let x = EDGE + 10; x <= 2900; x += 20) gp.push([x, gy(x)]);
    gp.push([2900, 2000]);
    const g = sheet().p(c.cut(gp, 1.2, 10), mix(C.hillNear, C.sand, 0.45));
    g.p(c.cut([[EDGE, 546], [EDGE - 40, 640], [EDGE - 120, 780], [EDGE - 170, 900], [EDGE - 260, 2000], [EDGE + 60, 2000], [EDGE + 40, 900], [EDGE + 24, 640]], 1.6, 8), mix(C.rock2, C.clay, 0.25));
    let cr = '';
    for (let i = 0; i < 14; i++) { const y = c.rr(580, 1000), x = EDGE - (y - 546) * 0.5 + c.rr(10, 60); cr += c.ribbon([[x, y], [x + c.rr(-10, 10), y + c.rr(40, 80)]], 2.4); }
    g.x(cr, shade(C.rock2, -0.3), 'opacity=".5"');
    G.add(g.out());
    G.add(grass(c, { x0: EDGE + 30, x1: 2800, y: 540, fn: gy, n: 60, h: 14, color: C.olive }) + rock(c, EDGE + 40, 552, 70, 26, C.rock2) + olive(c, 2050, gy(2050) + 4, 0.9));
    const pebbles = [0, 1, 2, 3].map((i) => G.add(`<g>${rock(c, 0, 0, 12 + i * 3, 8 + i, C.rock2)}</g>`));

    /* the crowd in two ranks, and Jesus between them */
    const back = S.layer({ par: 0.5, sh: 5, pad: 360 });
    const mid = S.layer({ par: 0.5, sh: 5, pad: 360 });
    const front = S.layer({ par: 0.5, sh: 5, pad: 360 });
    const glow = mid.add(`<circle r="140" fill="url(#halo-glow)" opacity="0"/>`);
    const grp = (L, n, y, s, i0) => Array.from({ length: n }, (_, k) => {
      const mem = [0, 1, 2].map((q) => ({ o: (k + q + i0) % 3 === 1 ? womanO(r) : manO(r), dx: q * 40 + r.rr(-6, 6), dy: r.rr(-4, 4) }));
      const hot = mem.map((m, q) => figure(r, m.o, { x: m.dx, y: y + m.dy, s, flip: true, armF: 80 + q * 10, armB: 150 - q * 15, head: -6 })).join('');
      return { k, i0, y, el: L.add(`<g>${hot}</g>`) };
    });
    const rankB = grp(back, 4, 518, 0.86, 0);
    const rankF = grp(front, 4, 580, 0.98, 1);
    // He walks in front of both ranks, through the gap they open
    const top = S.layer({ par: 0.5, sh: 5, pad: 360 });
    const jesus = S.puppet(top.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      swing(sunEl, 380, lerp(230, 280, es(t, 0, 2)), time, 0.8, 0.5);
      swing(cl, 1100 + Math.sin(time * 0.1) * 20, 150, time, 1.2, 0.6, 1);

      /* v29b: driven to the brow, to throw Him down */
      const drive = es(t, 0.05, 0.75);
      const pass = es(t, 1.1, 2.0, (x) => x);
      const turn = t > 1.05;
      const jx0 = lerp(930, 640, drive);
      const jx = turn ? lerp(640, 1020, pass) : jx0;
      const jy = 546;
      jesus.set({ x: jx, y: jy, s: 1.0, flip: !turn, walk: (drive > 0 && drive < 1) || (pass > 0 && pass < 1) ? jx * 0.045 : undefined, lean: turn ? 0 : -drive * 6, armF: 12 + (turn ? 6 : 0), head: turn ? -2 : 8, blink: blinkAt(time) });
      const [hx, hy] = headAt(jx, jy, 1.0, !turn);
      pose(glow, { x: hx, y: hy + 40, s: 1 + Math.sin(time * 1.1) * 0.04, o: es(t, 1.0, 1.3) * 0.6 });
      pebbles.forEach((p, i) => {
        const k = seg(t, 0.6 + i * 0.1, 1.0 + i * 0.1);
        pose(p, { x: EDGE + 10 - k * 90 - i * 8, y: 548 + k * k * 420, r: k * 300 * (i % 2 ? 1 : -1), s: 1 - k * 0.5, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* the ranks press after Him — then part as He walks through, and stand frozen */
      const place = (R, dir) => R.forEach((g) => {
        const home = lerp(1140 + g.k * 160 + g.i0 * 50, 770 + g.k * 150 + g.i0 * 60, drive);
        const part = es(t, 1.02, 1.3);
        const side = Math.tanh((home + 60 - jx) / 70);
        pose(g.el, { x: home + side * 120 * part, y: -part * (dir < 0 ? 10 : -6) - (drive > 0 && drive < 1 ? Math.abs(Math.sin(t * 30 + g.k)) * 4 : 0), s: 1 });
      });
      place(rankB, -1);
      place(rankF, 1);

      S.cam.x = turn ? Math.max(-20, (jx - 800) * 1.8) : lerp(80, -20, drive);
      S.cam.z = 1.03 + es(t, 0.4, 0.9) * 0.04 - es(t, 1.1, 1.5) * 0.03;
      S.cam.y = 10 + es(t, 0.4, 0.9) * 20;
    };
  },
};
