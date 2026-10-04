// Mk 6,32–34 — they sail off to a lonely place, but people see them and run round the lake on foot and get
// there first. Jesus steps out, sees them — sheep without a shepherd — and begins to teach.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, reeds, rock, town, sun, cloud, grass, flowers, bush } from '../../assets/nature.js';
import { bird, boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, speech, GLYPH, heart, wordSlip, sheep, man, woman } from './lib.js';

const PI = Math.PI;
const BY = 690;             // boat waterline
const JX = 1470;            // where Jesus stands on the far shore
const PATHY = (x) => 508 + Math.sin(x * 0.004) * 6;

export default {
  id: 'm6-shore',
  beats: [
    { v: 32 },
    { v: 33, text: 'Lecz widziano ich odpływających.' },
    { v: 33, cont: true, text: 'Wielu zauważyło to i zbiegli się tam pieszo ze wszystkich miast, a nawet ich uprzedzili.' },
    { v: 34, text: 'Gdy Jezus wysiadł, ujrzał wielki tłum.' },
    { v: 34, cont: true, text: 'Zlitował się nad nimi, byli bowiem jak owce nie mające pasterza.' },
    { v: 34, cont: true, text: 'I zaczął ich nauczać.' },
  ],
  cam: { x: [-620, 1260], y: [0, 70], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const SKY = ['#c3dcdc', '#ebe6cf', '#f6ead3'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 0, y: 0, len: 700 });
    const cls = [[300, 140, 200], [900, 200, 150], [1500, 150, 190]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 }) }));
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 45, scale: 0.5, x0: -600, x1: 2600 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3400 }).markup);
    // the far shore: hills with towns, and the path round the lake
    const far = S.layer({ par: 0.25, sh: 3 });
    const fh = hillsWith(c, { y: 470, amps: [14, 7, 3], lens: [900, 320, 110], color: C.hillMid, trees: 34, treeColor: C.sage, treeH: 20, x0: -1400, x1: 3400 });
    far.add(fh.markup);
    [-500, -150, 250, 700, 1150].forEach((x) => far.add(town(c, { x, y: fh.fn(x) + 18, n: 5, spread: 200, sc: 0.5 })));
    const pp = [], pp2 = [];
    for (let x = -1400; x <= 3400; x += 20) { pp.push([x, PATHY(x) - 5]); pp2.unshift([x, PATHY(x) + 5]); }
    far.add(sheet().p(c.cut([...pp, ...pp2], 0.4, 10), C.sand).out());
    const runners = Array.from({ length: 18 }, (_, i) => ({ i, o: i % 3 ? man(c) : woman(c), d: c.rr(0, 0.35), start: c.pick([-500, -150, 250, 700]) + c.rr(-60, 60), seed: c.rr(0, 6) }));
    runners.forEach((r) => { r.p = S.puppet(far.add(person(c, r.o))); });

    /* ---------- the lake ---------- */
    const lake = S.layer({ par: 0.4, sh: 2 });
    lake.add(waterBand(c, { y: 530, color: C.lake, foamN: 40, x0: -1400, x1: 3400 }).markup);
    lake.add(reeds(c, -200, 548, 8, 50) + reeds(c, 1900, 550, 8, 50));

    /* ---------- the two shores ---------- */
    const shore = S.layer({ par: 0.5, sh: 3 });
    const L = [];
    for (let y = 600; y <= 1700; y += 30) L.push([450 - (y - 600) * 0.25 + c.rr(-4, 4), y]);
    shore.add(sheet().p(c.cut([[-1600, 600], [460, 600], ...L, [-1600, 1700]], 1, 10), C.sand).out());
    shore.add(town(c, { x: 40, y: 640, n: 6, spread: 420, sc: 1.05 }) + palm(c, 130, 650, 230) + palm(c, -520, 660, 200));
    const R = [];
    for (let y = 1700; y >= 600; y -= 30) R.push([1220 + (y - 600) * 0.3 + c.rr(-4, 4), y]);
    shore.add(sheet().p(c.cut([[1200, 600], [3400, 600], [3400, 1700], ...R], 1, 10), mix(C.hillNear, C.sand, 0.35)).out());
    shore.add(sheet().p(c.cut([[1200, 600], [3400, 600], [3400, 640], [1210, 640]], 0.8, 10), C.sand).out());
    shore.add(grass(c, { x0: 1300, x1: 2500, y: 660, n: 50, h: 14, color: C.moss }) + rock(c, 1360, 700, 90, 34, C.rock2) + palm(c, 2000, 640, 240));
    // those on the Capernaum shore who see them leave
    const watchers = crowd(S, shore, [{ y: 656, s: 0.64, n: 6, x0: 170, x1: 420 }]);
    // the crowd that got there first
    const crowdL = S.layer({ par: 0.52, sh: 4 });
    const waiting = crowd(S, crowdL, [
      { y: 640, s: 0.52, n: 11, x0: 1260, x1: 1900 },
      { y: 662, s: 0.6, n: 9, x0: 1540, x1: 1950 },
      { y: 690, s: 0.72, n: 6, x0: 1580, x1: 1900 },
    ]);
    waiting.forEach((m) => { m.d = c.rr(0, 0.5); });

    /* ---------- the boat ---------- */
    const boatL = S.layer({ par: 0.55, sh: 5 });
    const B = boat(c, { mast: true });
    const ONB = [{ o: CAST.andrew, x: -20 }, { o: CAST.john, x: 34 }, { o: CAST.peter, x: 86 }, { o: CAST.james, x: 134 }];
    const boatG = boatL.add(`<g><g>${B.back}</g><g data-k="jb">${person(c, { ...CAST.jesus })}</g>${ONB.map((d, i) => `<g data-k="d${i}">${person(c, d.o)}</g>`).join('')}<g>${B.front}</g></g>`);
    const jBoat = S.puppet(S.$('jb').firstElementChild);
    const onb = ONB.map((d, i) => ({ ...d, p: S.puppet(S.$('d' + i).firstElementChild) }));
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    // sheep among the crowd
    const flockL = S.layer({ par: 0.56, sh: 4 });
    const SHEEP = Array.from({ length: 9 }, (_, i) => ({ i, x: 1300 + i * 60 + c.rr(-20, 20), y: 700 + (i % 3) * 16, gx: JX + 60 + (i % 5) * 36 - 60 + (i > 4 ? -150 : 0), gy: 712 + (i % 2) * 14, dir: i % 2 ? 1 : -1, seed: c.rr(0, 6), el: flockL.add(sheep(c)) }));

    const fx = S.layer({ par: 0.6, sh: 4 });
    const points = [0, 1, 2].map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40 })}</g>`));
    const heartEl = fx.add(`<g>${heart(c, 18)}</g>`);
    const words = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(wordSlip(c, 28)), to: [JX + 60 + i * 60, 520 + (i % 2) * 40], seed: c.rr(0, 6) }));

    const wv = S.layer({ par: 0.72, sh: 4, pad: 200 });
    wv.add(waveStrip(c, { y: 800, len: 160, amp: 10, color: C.lake2, x0: -1400, x1: 3400 }));

    // phone: the boat lingers so it is still in sight while the shore watches it go
    const bKeys = S.portrait ? [[0.05, 470], [0.9, 560], [2.0, 760], [2.9, 1250]] : [[0.05, 470], [0.9, 640], [2.0, 1000], [2.9, 1250]];
    return (t, time) => {
      const T = time;
      swing(sunEl, 800 + S.cam.x * 0.05, 150, T, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 30, cl.y, T, 1.4, 0.6, cl.i));
      birds(T, 1);
      wv.shift(((T * 18) % 160) - 80);

      /* v32 — away in the boat */
      const bx = kf(t, bKeys, (u) => u);
      const bob = Math.sin(T * 1.4) * 2.5;
      pose(boatG, { x: bx, y: BY + bob, s: 0.72, r: Math.sin(T * 1.1) * 0.8 });
      const out = es(t, 2.95, 3.05);
      jBoat.set({ x: -118, y: -8, s: 0.98, o: 1 - out, armF: 20 + bump(t, 0.2, 0.9) * 40, blink: blinkAt(T) });
      onb.forEach((d, i) => d.p.set({ x: d.x, y: 4, s: 0.92, flip: t > 2.95, armF: 30 + bump(t, 1.1, 1.8) * (i === 2 ? 50 : 0), blink: blinkAt(T, i + 2) }));

      /* v33a — people on the shore see them go */
      watchers.forEach((m, i) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, o: 1, armF: bump(t, 1.0 + (i % 3) * 0.05, 1.95) * 95 + bump(t, 0.2, 0.9) * 40, head: -bump(t, 1.0, 1.9) * 6, blink: blinkAt(T, m.seed) }));
      points.forEach((p, i) => {
        const m = watchers[i * 2];
        const k = es(t, 1.05 + i * 0.08, 1.2 + i * 0.08, ease.back) * (1 - es(t, 1.85, 1.95));
        const [hx, hy] = headAt(m.x, m.y, m.s, false);
        pose(p, { x: hx + 12, y: hy - 16, s: k * 0.8, o: k > 0.01 ? 1 : 0 });
      });

      /* v33b — they run round on foot and get there first */
      runners.forEach((r) => {
        const k = es(t, 1.95 + r.d, 2.6 + r.d, (u) => u);
        const x = lerp(r.start, 1500 + (r.i % 6) * 30, k);
        r.p.set({ x, y: PATHY(x) + 2, s: 0.3, o: k > 0 && k < 1 ? 1 : 0, walk: x * 0.12, amt: 1.4, lean: 8, blink: 0 });
      });
      waiting.forEach((m, i) => {
        const inK = es(t, 2.4 + m.d * 0.5, 2.7 + m.d * 0.5);
        const seeK = es(t, 3.1, 3.3);
        const listen = es(t, 5.05, 5.3);
        m.p.set({ x: m.x + (1 - inK) * 120, y: m.y, s: m.s, flip: m.x > JX, o: inK, walk: inK > 0 && inK < 1 ? m.x * 0.06 : undefined, armF: seeK * (i % 3 === 0 ? 70 : 20) * (1 - listen) + listen * (i % 4 === 0 ? 20 : 0), head: -listen * 5 - (1 - seeK) * 0, blink: blinkAt(T, m.seed) });
      });

      /* v34a — he steps out and sees the great crowd */
      const step = es(t, 2.95, 3.3);
      const comp = es(t, 4.05, 4.3);
      const teach = es(t, 5.05, 5.25);
      jesus.set({ x: lerp(bx - 118 * 0.72, JX, step), y: lerp(BY - 6, 690, step) - bump(t, 2.95, 3.15) * 14, s: 0.98, o: out, walk: step > 0 && step < 1 ? step * 20 : undefined, armF: 20 + bump(t, 3.3, 3.9) * 40 + comp * 50 * (1 - teach) + teach * (70 + Math.sin(T * 1.5) * 16), armB: comp * 60 * (1 - teach) + teach * (60 + Math.sin(T * 1.1 + 1) * 14), head: -bump(t, 3.2, 3.9) * 6 + comp * 6 * (1 - teach), blink: blinkAt(T) });
      const hk = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.95, 5.1));
      pose(heartEl, { x: JX + 14, y: 430 - Math.sin(T * 1.6) * 4, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v34b — sheep without a shepherd: they wander, then gather to him */
      SHEEP.forEach((sh) => {
        const on = es(t, 4.05 + sh.i * 0.03, 4.25 + sh.i * 0.03);
        const gather = es(t, 5.05 + sh.i * 0.03, 5.5 + sh.i * 0.03);
        const wander = (t - 4) * 70 * sh.dir;
        const x = lerp(sh.x + wander, sh.gx, gather), y = lerp(sh.y + Math.sin(t * 3 + sh.seed) * 8, sh.gy, gather);
        const facing = gather > 0.5 ? (sh.gx > JX ? -1 : 1) : sh.dir;
        pose(sh.el, { x, y, s: 0.9, sx: facing, o: on });
      });
      words.forEach((w) => {
        const k = ((T * 0.25 + w.i / 7) % 1);
        pose(w.el, { x: lerp(JX + 20, w.to[0], k), y: lerp(510, w.to[1], k) - Math.sin(k * PI) * 50, r: Math.sin(T * 2 + w.seed) * 12, s: 0.5 + k * 0.5, o: teach * Math.sin(k * PI) });
      });

      S.cam.x = kf(t, [[0, -540], [1.0, -500], [1.9, S.portrait ? -480 : -440], [2.8, S.portrait ? 1000 : 900], [3.1, 1240]]);
      S.cam.z = kf(t, [[0, 1.04], [2.8, 1.0], [3.2, 1.08], [4.2, 1.12], [5.2, 1.06]]);
      S.cam.y = kf(t, [[0, 30], [3.2, 40], [4.2, 60], [5.2, 40]]);
    };
  },
};
