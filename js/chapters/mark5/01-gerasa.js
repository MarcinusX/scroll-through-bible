// Mk 5,1–2 — after the storm the boat comes ashore in the land of the Gerasenes as night turns to dawn;
// Jesus steps out, and from a tomb cut in the hillside a man with an unclean spirit bursts out, crying.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, waveStrip, reeds, rock, moon, stars, grass, cypress } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { LOOK, kf, tomb, slope, boulders, shadowCloak, cry } from './lib.js';

const PI = Math.PI;
const SHORE = 700;            // where Jesus stands on the beach
const TOMB = [1236, 0];       // the man's tomb (y from the slope)

function oar(c) {
  return sheet().p(c.ribbon([[0, 0], [58, 96]], 4), C.wood2).p(c.cut([[50, 84], [66, 92], [76, 126], [60, 124]], 0.3, 4), C.wood3).out();
}

export default {
  id: 'm5-gerasa',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Ledwie wysiadł z łodzi,' },
    { v: 2, cont: true, text: 'zaraz wybiegł Mu naprzeciw z grobów człowiek opętany przez ducha nieczystego.' },
  ],
  cam: { x: [-110, 120], y: [-40, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const NIGHT = ['#161c42', '#2a336e', '#4f5a92'];
    sky(S, NIGHT, { name: 'night' });
    const dawn = sky(S, ['#8d86b0', '#e3ab93', '#f5d2a4'], { name: 'dawn' });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -500, y1: 400, n: 150 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 40)}`, { x: 560, y: 170, len: 900 });
    const glowL = S.layer({ par: 0.06, sh: 1, flat: true });
    glowL.add(`<ellipse cx="1300" cy="430" rx="900" ry="190" fill="url(#warm-glow)" opacity=".75"/>`);

    /* ---------- far hills across the water, then the lake ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    const lake = S.layer({ par: 0.2, sh: 2 });
    lake.add(waterBand(c, { y: 500, color: mix(C.lake, C.duskViolet, 0.2), foamN: 26 }).markup);
    const glint = lake.add(`<g>${Array.from({ length: 14 }, (_, i) => `<path d="${c.cut([[-30, 0], [0, -2], [30, 0], [0, 1.5]], 0.2, 8)}" fill="#fff1c4" transform="translate(${560 + c.rr(-24, 24)} ${512 + i * 12}) scale(${1 - i * 0.04} 1)"/>`).join('')}</g>`);

    /* ---------- the hillside of tombs (right) ---------- */
    const hill = S.layer({ par: 0.3, sh: 4 });
    const H = slope(c, { y0: 610, y1: 250, xa: 900, xb: 1700, color: mix(C.rock, C.hillMid, 0.4) });
    hill.add(H.markup);
    const H2 = slope(c, { y0: 640, y1: 360, xa: 1000, xb: 1900, color: mix(C.rock2, C.hillNear, 0.35), j: 3 });
    hill.add(H2.markup);
    hill.add(cypress(c, 1500, H.fn(1500) + 6, 120) + cypress(c, 1560, H.fn(1560) + 6, 90) + cypress(c, 1680, H2.fn(1680) + 4, 130));
    // tombs cut into the rock
    [[1110, 0.66], [1380, 0.8], [1560, 0.7], [1020, 0.55]].forEach(([x, s]) => {
      const y = H2.fn(x) + 4;
      hill.add(`<g transform="translate(${x} ${y}) scale(${s})">${tomb(c, 70, 84, { stone: true, face: mix(C.rock2, C.rock3, 0.3) })}</g>`);
    });
    TOMB[1] = H2.fn(TOMB[0]) + 4;
    hill.add(`<g transform="translate(${TOMB[0]} ${TOMB[1]}) scale(.9)">${tomb(c, 70, 84, { stone: false, face: mix(C.rock2, C.rock3, 0.3) })}</g>`);
    const rollStone = hill.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 34, 22), 0.8, 5), shade(C.rock2, 0.1)).x(c.ribbon(c.arc(0, 0, 24, 24, PI * 1.1, PI * 1.6, 6), 2), shade(C.rock2, -0.2), 'opacity=".6"').out()}</g>`);
    hill.add(boulders(c, H2.fn, 960, 1800, 14, { col: C.rock2 }));
    // the path down from the tombs
    const pathPts = [[TOMB[0], TOMB[1] + 2], [1180, H2.fn(1180) + 30], [1100, 640], [1020, 690], [960, 716]];

    /* ---------- the man from the tombs ---------- */
    const manL = S.layer({ par: 0.32, sh: 4 });
    const shade_ = manL.add(`<g>${shadowCloak(c, 120, 230)}</g>`);
    const man = S.puppet(manL.add(person(c, { ...LOOK.wild })));
    const cryEl = manL.add(`<g>${cry(c, ['!!'], { size: 30, w: 80, dir: 1 })}</g>`);
    const rings = [0, 1, 2].map(() => manL.add(`<path d="${c.ribbon(c.arc(0, 0, 40, 40, -0.9, 0.9, 10), 5)}" fill="#43384d"/>`));

    /* ---------- the beach ---------- */
    const beach = S.layer({ par: 0.45, sh: 3 });
    const bfn = (x) => 640 + Math.max(0, x - 900) * 0.16 + Math.max(0, 720 - x) * 0.9 + Math.sin(x / 140) * 4;
    const bpts = [];
    for (let x = 300; x <= 2500; x += 14) bpts.push([x, Math.min(bfn(x), 1700) + c.rr(-1.2, 1.2)]);
    bpts.push([2500, 1700], [300, 1700]);
    beach.add(waterBand(c, { y: 690, x1: 1000, color: mix(C.lake2, C.duskViolet, 0.18), foamN: 16, amp: 2 }).markup);
    beach.add(sheet().p(c.poly(bpts), mix(C.sand, C.duskViolet, 0.08)).out());
    beach.add(grass(c, { x0: 700, x1: 1500, y: 640, fn: bfn, n: 18, h: 13, color: C.olive }));
    beach.add(rock(c, 1010, 700, 80, 36, C.rock2) + rock(c, 1300, 690, 60, 22, C.rock));

    /* ---------- the boat with Jesus and four disciples ---------- */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const B = boat(c, {});
    const dis = [
      { k: 'andrew', x: -128, cast: CAST.andrew, oar: true },
      { k: 'james', x: -70, cast: CAST.james },
      { k: 'john', x: -14, cast: CAST.john },
      { k: 'peter', x: 44, cast: CAST.peter, oar: true },
    ];
    const boatG = boatL.add(`<g>
      <g>${B.back}</g>
      ${dis.map((d) => `<g data-k="g-${d.k}">${person(c, { ...d.cast, holdF: d.oar ? oar(c) : '' })}</g>`).join('')}
      <g data-k="jin">${person(c, { ...CAST.jesus })}</g>
      <g>${B.front}</g>
    </g>`);
    dis.forEach((d) => { d.p = S.puppet(S.$('g-' + d.k).firstElementChild); d.seed = c.rr(0, 6); });
    const jIn = S.puppet(S.$('jin').firstElementChild);
    const jOut = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const ripL = boatL.add(`<g>${[0, 1, 2].map((i) => `<path class="rp" d="${c.ribbon(c.arc(0, 0, 60, 12, 0.1, PI - 0.1, 12), 3)}" fill="${C.foam}" opacity=".7"/>`).join('')}</g>`);
    const rips = Array.from(ripL.querySelectorAll('.rp'));

    /* ---------- near water & foreground ---------- */
    const w1 = S.layer({ par: 0.62, sh: 3, pad: 170 });
    w1.add(waveStrip(c, { y: 812, len: 170, amp: 9, color: mix(C.lake2, C.duskViolet, 0.2), x0: -1400, x1: 380 }));
    const fg = S.layer({ par: 1, sh: 6 });
    fg.add(reeds(c, 150, 930, 14, 220, C.moss) + rock(c, 1420, 950, 230, 90, C.rock2) + reeds(c, 1330, 900, 8, 160, C.moss) + rock(c, 230, 960, 160, 60, C.rock));

    /* ---------- night tint over the land (lifts with the dawn) ---------- */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1a2050"/>`);

    const cur = curtains(S);

    // the boat's course: from out on the lake to the beach
    const boatKeys = [[0.6, [-260, 700, 0.74]], [1.85, [596, 716, 0.9]]];

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const day = es(t, 0.8, 3.4);
      dawn.layer.fade(day);
      starL.fade(1 - es(t, 0.6, 2.6));
      tint.fade(0.46 * (1 - day) + 0.06);
      glowL.fade(es(t, 1.4, 3.6) * 0.9);
      swing(moonEl, 560 - day * 120, 170 + day * 300, T, 0.8, 0.5);
      fade(glint, 0.7 * (1 - day));

      /* v1 — the boat glides in and grounds on the beach */
      const [bx, by, bs] = kf(t, boatKeys, ease.out);
      const afloat = 1 - es(t, 1.7, 1.9);
      const bob = Math.sin(T * 1.3) * 2.2 * afloat;
      pose(boatG, { x: bx, y: by + bob, s: bs, r: Math.sin(T * 1.1) * 0.8 * afloat + bump(t, 1.75, 1.95) * -1.5 });
      rips.forEach((r, i) => {
        const k = ((T * 0.5 + i / 3) % 1);
        const ro = afloat * es(t, 0.7, 0.9);
        pose(r, { x: -180 - (ro > 0 ? k : 0) * 90, y: -18, s: 0.6 + (ro > 0 ? k : 0), o: ro * (1 - k) * 0.8 });
      });
      const rowing = es(t, 0.6, 0.8) * (1 - es(t, 1.7, 1.85));
      dis.forEach((d, i) => {
        const look = es(t, 3.2 + i * 0.05, 3.5 + i * 0.05);
        d.p.set({
          x: d.x, y: 2, s: 0.94, flip: false,
          armF: d.oar ? 30 + rowing * Math.sin(t * 12 + i) * 24 : 14 + bump(t, 2.2, 2.9) * (i === 2 ? 50 : 0) + look * (i === 2 ? 80 : 20),
          armB: d.oar ? 20 + rowing * Math.sin(t * 12 + i + 0.6) * 18 : 10 + look * (i === 1 ? 50 : 0),
          head: -look * 12, lean: d.oar ? rowing * Math.sin(t * 12 + i) * 4 : 0, blink: blinkAt(T, d.seed),
        });
      });

      /* v2a — He steps out of the boat onto the shore */
      const out = es(t, 2.08, 2.14);
      jIn.set({ x: 128, y: -2, s: 0.96, o: 1 - out, armF: 16 + bump(t, 1.1, 1.9) * 40, armB: 6, head: 3, blink: blinkAt(T) });
      const bowX = bx + 128 * bs, bowY = by - 4;
      const jx = kf(t, [[2.1, bowX], [2.6, 800]], ease.out);
      const hop = bump(t, 2.1, 2.34) * 34;
      const sees = es(t, 3.25, 3.6);
      jOut.set({
        x: jx, y: lerp(bowY, SHORE, es(t, 2.1, 2.34)) - hop, s: 0.94 * lerp(bs / 0.9, 1, es(t, 2.1, 2.3)), o: out,
        walk: t > 2.3 && t < 2.6 ? jx * 0.06 : undefined,
        flip: false, armF: 14 + sees * 30, armB: 8 + sees * 10, head: -sees * 6, blink: blinkAt(T, 2),
      });

      /* v2b — out of a tomb on the hillside, a man bursts out crying and runs down */
      const roll = es(t, 3.0, 3.2, ease.out);
      pose(rollStone, { x: TOMB[0] + 40 + roll * 46, y: TOMB[1] - 30 + roll * 4, r: roll * 120 });
      const run = es(t, 3.12, 4, (u) => u);
      const along = (u) => {
        const n = pathPts.length - 1, f = Math.min(n - 1e-6, u * n), i = Math.floor(f), k = f - i;
        return [lerp(pathPts[i][0], pathPts[i + 1][0], k), lerp(pathPts[i][1], pathPts[i + 1][1], k)];
      };
      const [mx, my] = along(run * 0.72);
      const ms = lerp(0.5, 0.6, run);
      const on = seg(t, 3.02, 3.1);
      man.set({
        x: mx, y: my, s: ms, flip: true, o: on,
        walk: run > 0 && run < 1 ? t * 40 : undefined, amt: 1.6,
        armF: 120 + Math.sin(t * 30) * 20, armB: 140 + Math.sin(t * 26 + 1) * 16, head: -12, lean: -8, blink: 0,
      });
      pose(shade_, { x: mx + 8, y: my + 2, s: ms * (0.9 + (on > 0 ? Math.sin(T * 2) * 0.03 : 0)), o: on * 0.9 });
      const k = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      pose(cryEl, { x: mx + 14, y: my - 150 * ms, s: k * 0.9, r: k > 0.02 ? Math.sin(T * 9) * 4 : 0, o: k > 0.02 ? 1 : 0 });
      rings.forEach((r, i) => {
        const ro = on * (1 - es(t, 3.95, 4.1));
        const q = ro > 0 ? ((T * 1.2 + i / 3) % 1) : 0;
        pose(r, { x: mx - 12, y: my - 150 * ms, s: 0.5 + q * 1.4, r: 180, o: ro * (1 - q) * 0.7 });
      });

      /* camera: from the lake to the shore, then toward the hillside */
      S.cam.x = -90 + es(t, 0.9, 2.2) * 90 + es(t, 3.0, 3.8) * 110;
      S.cam.y = 20 + es(t, 1.8, 2.6) * 30 - es(t, 3.0, 3.8) * 40;
      S.cam.z = 1 + es(t, 1.8, 2.6) * 0.1 + es(t, 3.0, 3.8) * 0.02;
    };
  },
};
