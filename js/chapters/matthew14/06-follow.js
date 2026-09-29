// Mt 14,13b–14 — the crowds hear of it and pour out of the towns, round the lake on foot, while the little boat
// crosses; they are there first. Jesus steps out and sees the great crowd; His heart goes out to them, and the sick
// they have carried on mats get up, healed.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, reeds, rock, town, sun, cloud, grass } from '../../assets/nature.js';
import { bird, boat } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, headAt, heart, spark, mob, sickOnMat, man, woman, DAY, tr, PI } from './lib.js';

const BY = 690;             // boat waterline
const JX = 1470;            // where Jesus stands on the far shore
const PATHY = (x) => 508 + Math.sin(x * 0.004) * 6;
const SICK = [[1240, 0], [1640, 1], [1760, 2]];

export default {
  id: 'mt14-follow',
  beats: [
    { v: 13, cont: true, text: 'Lecz tłumy zwiedziały się o tym i z miast poszły za Nim pieszo.' },
    { v: 14, text: 'Gdy wysiadł, ujrzał wielki tłum.' },
    { v: 14, cont: true, text: 'Zlitował się nad nimi i uzdrowił ich chorych.' },
  ],
  cam: { x: [-560, 1260], y: [0, 70], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 0, y: 0, len: 700 });
    const cls = [[300, 140, 200], [900, 200, 150], [1500, 150, 190]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 }) }));
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 45, scale: 0.5, x0: -600, x1: 2600 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3400 }).markup);
    /* the far shore: hills, towns, the path round the lake, and the people on it */
    const far = S.layer({ par: 0.25, sh: 3 });
    const fh = hillsWith(c, { y: 470, amps: [14, 7, 3], lens: [900, 320, 110], color: C.hillMid, trees: 34, treeColor: C.sage, treeH: 20, x0: -1400, x1: 3400 });
    far.add(fh.markup);
    [-500, -150, 250, 700].forEach((x) => far.add(town(c, { x, y: fh.fn(x) + 18, n: 5, spread: 200, sc: 0.5 })));
    const pp = [], pp2 = [];
    for (let x = -1400; x <= 3400; x += 20) { pp.push([x, PATHY(x) - 5]); pp2.unshift([x, PATHY(x) + 5]); }
    far.add(sheet().p(c.cut([...pp, ...pp2], 0.4, 10), C.sand).out());
    const streams = Array.from({ length: 12 }, (_, i) => ({ i, d: (i % 4) * 0.09 + c.rr(0, 0.06), start: [-500, -150, 250][i % 3] + c.rr(-40, 40), sp: far.sprite(mob(c, 3, { s: 0.42, spread: 18, rows: 1 }), 0, PATHY(0) + 2) }));

    /* the lake */
    const lake = S.layer({ par: 0.4, sh: 2 });
    lake.add(waterBand(c, { y: 530, color: C.lake, foamN: 40, x0: -1400, x1: 3400 }).markup);
    lake.add(reeds(c, -200, 548, 8, 50) + reeds(c, 1900, 550, 8, 50));

    /* the two shores */
    const shore = S.layer({ par: 0.5, sh: 3 });
    const L = [];
    for (let y = 600; y <= 1700; y += 30) L.push([450 - (y - 600) * 0.25 + c.rr(-4, 4), y]);
    shore.add(sheet().p(c.cut([[-1600, 600], [460, 600], ...L, [-1600, 1700]], 1, 10), C.sand).out());
    shore.add(town(c, { x: 40, y: 640, n: 6, spread: 420, sc: 1.05 }) + palm(c, 130, 650, 230) + palm(c, -520, 660, 200));
    const R = [];
    for (let y = 1700; y >= 600; y -= 30) R.push([1220 + (y - 600) * 0.3 + c.rr(-4, 4), y]);
    shore.add(sheet().p(c.cut([[1200, 600], [3400, 600], [3400, 1700], ...R], 1, 10), mix(C.hillNear, C.sand, 0.35)).out());
    shore.add(sheet().p(c.cut([[1200, 600], [3400, 600], [3400, 640], [1210, 640]], 0.8, 10), C.sand).out());
    shore.add(grass(c, { x0: 1300, x1: 2500, y: 660, n: 50, h: 14, color: C.moss }) + rock(c, 1330, 700, 90, 34, C.rock2) + palm(c, 2060, 640, 240));

    /* the great crowd that got there first: rows of still cut-outs */
    const crowdL = S.layer({ par: 0.52, sh: 4 });
    const ROWS = [[1560, 642, 0.56, 9, 34], [1800, 650, 0.58, 7, 34], [1340, 648, 0.56, 4, 32], [1640, 672, 0.68, 6, 40], [1880, 690, 0.74, 4, 44]];
    const rows = ROWS.map(([x, y, s, n, sp], i) => ({ i, x, y, sp: crowdL.sprite(mob(c, n, { s, spread: sp, rows: 1, flip: true, arms: 30 }), x, y) }));

    /* the boat */
    const boatL = S.layer({ par: 0.55, sh: 5 });
    const B = boat(c, { mast: true });
    const ONB = [{ o: CAST.andrew, x: -20 }, { o: CAST.john, x: 34 }, { o: CAST.peter, x: 86 }, { o: CAST.james, x: 134 }];
    const boatG = boatL.add(`<g><g>${B.back}</g><g data-k="jb">${person(c, { ...CAST.jesus })}</g>${ONB.map((d) => `<g transform="translate(${d.x} 4) scale(.92)">${person(c, d.o)}</g>`).join('')}<g>${B.front}</g></g>`);
    const jBoat = S.puppet(S.$('jb').firstElementChild);

    /* the sick on their mats, and the same people standing, healed */
    const act = S.layer({ par: 0.56, sh: 5 });
    const ill = SICK.map(([x, i]) => {
      const look = { ...(i % 2 ? woman(c) : man(c)), skin: [C.skin2, C.skin3, C.skin4][i] };
      return { x, i, look, mat: act.add(`<g>${sickOnMat(c, look, 130)}</g>`), up: S.puppet(act.add(person(c, { ...look, mantle: null }))), seed: c.rr(0, 6) };
    });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.6, sh: 4 });
    const heartEl = fx.add(`<g>${heart(c, 18)}</g>`);
    const heals = ill.map(() => fx.add(`<g>${spark(c, 14)}</g>`));
    const joys = ill.map(() => fx.add(`<g>${heart(c, 10)}</g>`));

    const wv = S.layer({ par: 0.72, sh: 4, pad: 200 });
    wv.add(waveStrip(c, { y: 800, len: 160, amp: 10, color: C.lake2, x0: -1400, x1: 3400 }));

    const bKeys = [[-0.3, 440], [0.5, 800], [1.05, 1250]];
    return (t, time) => {
      const T = time;
      swing(sunEl, 800 + S.cam.x * 0.05, 150, T, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 30, cl.y, T, 1.4, 0.6, cl.i));
      birds(T, 1);
      wv.shift(((T * 18) % 160) - 80);

      /* v13b — out of the towns on foot, round the lake */
      streams.forEach((s) => {
        const k = es(t, -0.1 + s.d, 0.95 + s.d, (u) => u);
        const x = lerp(s.start, 1450 + (s.i % 3) * 40, k);
        s.sp.set({ x, y: PATHY(x) + 2 - Math.abs(Math.sin(x * 0.08)) * 3, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });
      rows.forEach((r) => {
        const k = es(t, 0.7 + r.i * 0.05, 1.05 + r.i * 0.05);
        r.sp.set({ x: r.x + (1 - k) * 160, y: r.y, o: k });
      });

      /* the boat crosses; He steps out */
      const bx = kf(t, bKeys, (u) => u);
      pose(boatG, { x: bx, y: BY + Math.sin(T * 1.4) * 2.5, s: 0.72, r: Math.sin(T * 1.1) * 0.8 });
      const out = es(t, 1.08, 1.14);
      jBoat.set({ x: -118, y: -8, s: 0.98, o: 1 - out, armF: 20, blink: blinkAt(T) });
      const step = es(t, 1.08, 1.4);
      const comp = es(t, 2.05, 2.25);
      const heal = bump(t, 2.3, 2.95);
      jesus.set({ x: lerp(1250 - 118 * 0.72, JX, step), y: lerp(BY - 6, 700, step) - bump(t, 1.08, 1.22) * 14, s: 1.0, o: out, walk: step > 0 && step < 1 ? step * 20 : undefined, armF: 20 + bump(t, 1.4, 1.95) * 50 + comp * 50, armB: comp * 40 + heal * 90, head: -bump(t, 1.4, 1.95) * 8 + comp * 6, blink: blinkAt(T) });
      const hk = es(t, 2.08, 2.3, ease.back);
      pose(heartEl, { x: JX + 14, y: 430 - Math.sin(T * 1.6) * 4, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v14b — the sick healed */
      ill.forEach((s) => {
        const on = es(t, 1.2, 1.4);
        const ht = 2.3 + s.i * 0.14;
        const healed = es(t, ht, ht + 0.08);
        pose(s.mat, { x: s.x, y: 716, s: 0.9, o: on * (1 - healed) });
        s.up.set({ x: s.x, y: 722, s: 0.84, flip: s.x > JX, o: healed, armF: 60, armB: 150, head: -6, blink: blinkAt(T, s.seed) });
        const k = bump(t, ht, ht + 0.5);
        pose(heals[s.i], { x: s.x, y: 580, s: k, r: T * 40, o: k > 0.02 ? 1 : 0 });
        const jk = es(t, ht + 0.15, ht + 0.35, ease.back);
        pose(joys[s.i], { x: s.x + 16, y: 540 - Math.sin(T * 2 + s.i) * 4, s: jk, o: jk > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -300], [0.9, 500], [1.2, 1240]]);
      S.cam.z = kf(t, [[0, 1.0], [1.0, 1.0], [1.4, 1.08], [2.1, 1.08], [2.5, 1.04]]);
      S.cam.y = kf(t, [[0, 20], [1.4, 60], [2.5, 60]]);
    };
  },
};
