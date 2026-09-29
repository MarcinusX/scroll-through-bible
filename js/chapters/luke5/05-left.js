// Łk 5,11 — the two heavy boats glide in to the shore and ground in the shallows by the beach. Jesus steps out first
// and walks away along the sand; and they climb out after Him — Simon, Andrew, James and John — and follow, leaving
// everything behind: the boats heaped with glinting fish, the nets hanging over the sides.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, reeds, grass } from '../../assets/nature.js';
import {
  lakeSet, boatRig, netDrape, sparkle, kf, moving, PETER_W, JAMES_W, MORNING, es, ease, bump, seg, PI,
} from './lib.js';

const P = 0.5;
const SH = 704, SAND = 738, WALK = 776;         // the shallows, the beach edge, the path along the beach
const A0 = { x: 840, y: 600, s: 0.8 }, A1 = { x: 880, y: 706, s: 1 };
const B0 = { x: 1250, y: 594, s: 0.72 }, B1 = { x: 1330, y: 704, s: 0.94 };
const WHO = [
  { k: 'peter', o: PETER_W, boat: 'A', lx: -24, t0: 1.1, gap: 115 },
  { k: 'andrew', o: CAST.andrew, boat: 'A', lx: -124, t0: 1.16, gap: 225 },
  { k: 'james', o: JAMES_W, boat: 'B', lx: 40, t0: 1.2, gap: 335 },
  { k: 'john', o: CAST.john, boat: 'B', lx: -80, t0: 1.26, gap: 445 },
];

export default {
  id: 'lk5-left',
  beats: [
    { v: 11, text: 'I przyciągnąwszy łodzie do brzegu,' },
    { v: 11, cont: true, text: 'zostawili wszystko i poszli za Nim.' },
  ],
  cam: { x: [-300, 300], y: [0, 80], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const K = lakeSet(S, { skyCols: MORNING, sunAt: [1250, 110], lakeY: 420 });
    const boatL = S.layer({ par: P, sh: 4 });
    const rigB = boatRig(S, boatL, { w: 360, col: C.wood3, stripe: C.dustyBlue, heap: true, crew: [{ k: 'john', o: CAST.john, x: -80, dy: -8, s: 0.94 }, { k: 'james', o: JAMES_W, x: 40, dy: -8, s: 0.96 }], extra: `<g transform="translate(-120 -58)">${netDrape(c, 110, 60, C.rope)}</g>` });
    const rigA = boatRig(S, boatL, {
      w: 380, heap: true,
      crew: [{ k: 'andrew', o: CAST.andrew, x: -124, dy: -8, s: 0.94 }, { k: 'peter', o: PETER_W, x: -24, dy: -8, s: 0.96 }, { k: 'jesus', o: { ...CAST.jesus, pose: 'sit' }, x: 104, dy: -34, s: 1 }],
      extra: `<g transform="translate(150 -60)">${netDrape(c, 100, 64, mix(C.rope, C.linen, 0.3))}</g>`,
    });
    // the shallows and the beach
    const shL = S.layer({ par: P, sh: 2 });
    const sfn = c.wave(SH, [2.5, 1.2], [160, 60]);
    const sw = sheet().p(c.ridge(sfn, -1400, 3000, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.45));
    let fl = '';
    for (let x = -1400; x < 3000; x += c.rr(40, 90)) fl += c.cut([[x, SH + 1], [x + 20, SH - 2], [x + 42, SH + 1], [x + 20, SH + 3]], 0.2, 6);
    sw.x(fl, C.foam, 'opacity=".7"');
    shL.add(sw.out());
    const ripples = [0, 1, 2, 3].map(() => shL.add(`<path d="${c.ribbon(c.arc(0, 0, 60, 8, 0, PI * 2, 24), 2.4)}" fill="${C.foam}"/>`));
    const beachL = S.layer({ par: P, sh: 3 });
    const bfn = c.wave(SAND, [4, 2], [700, 160]);
    beachL.add(sheet().p(c.ridge(bfn, -1400, 3000, 1700, 12, 1), mix(C.sand, C.stone, 0.2)).out());
    let peb = '';
    for (let i = 0; i < 70; i++) { const x = c.rr(-1200, 2400); peb += c.cut(c.blob(x, bfn(x) + c.rr(20, 280), c.rr(4, 9), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
    beachL.add(sheet().x(peb, C.stone2, 'opacity=".7"').out());
    beachL.add(grass(c, { x0: -1200, x1: 2400, y: 0, fn: (x) => bfn(x) + 120, n: 30, h: 12, color: C.olive }) + rock(c, -200, 790, 90, 30, C.rock2) + reeds(c, 1500, 760, 9, 90, C.moss) + rock(c, 1360, 800, 110, 36, C.rock));
    const poles = sheet().p(c.ribbon([[-60, 0], [-60, -120]], 5) + c.ribbon([[70, 0], [70, -120]], 5), C.wood2).out();
    beachL.add(`<g transform="translate(-60 760)">${poles}<g transform="translate(5 -118)">${netDrape(c, 140, 70, C.rope)}</g></g>`);
    const footL = S.layer({ par: P, sh: 1 });
    const prints = Array.from({ length: 16 }, (_, i) => ({ i, x: 960 - i * 40, el: footL.add(`<path d="${c.cut(c.ell(0, 0, 8, 3.2, 10), 0.2, 3)}" fill="${shade(C.sand, -0.14)}" opacity=".8"/>`) }));

    /* on the beach: Jesus and the four */
    const PL = S.layer({ par: P, sh: 5 });
    const walkers = WHO.map((w) => ({ ...w, p: S.puppet(PL.add(person(c, w.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(PL.add(person(c, CAST.jesus)));
    const splash = [0, 1, 2, 3, 4].map(() => PL.add(`<g>${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 14, -22], [sd * 22, -18], [sd * 8, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`));
    const glints = Array.from({ length: 8 }, (_, i) => ({ i, dx: c.rr(-110, 110), boat: i % 2, el: PL.add(`<g>${sparkle(c, 10 + (i % 3) * 3)}</g>`) }));
    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -380, 990, 14, 240, C.moss) + rock(c, 1900, 1000, 240, 90, C.rock2) + reeds(c, 2200, 980, 12, 220, C.moss));

    const JKEYS = [[1.04, 984], [1.96, 380]];

    return (t, time) => {
      const T = time;
      K.idle(T, { sunY: 110 });

      /* v11a — the boats come in and ground in the shallows */
      const inK = es(t, 0.05, 0.8, ease.out);
      const ground = es(t, 0.7, 0.85);
      const BA = { x: lerp(A0.x, A1.x, inK), y: lerp(A0.y, A1.y, inK) + (1 - ground) * Math.sin(T * 1.2) * 2, s: lerp(A0.s, A1.s, inK), r: (1 - ground) * Math.sin(T * 0.9) * 0.8 + ground * -1.5 };
      const BB = { x: lerp(B0.x, B1.x, inK), y: lerp(B0.y, B1.y, inK) + (1 - ground) * Math.sin(T * 1.3 + 1) * 2, s: lerp(B0.s, B1.s, inK), r: (1 - ground) * Math.sin(T * 0.8 + 2) * 0.8 + ground * 1.2 };
      rigA.set(BA); rigB.set(BB);
      rigA.fill(BA, 0.92, -50); rigB.fill(BB, 0.92);
      ripples.forEach((r, i) => { const k = ((T * 0.5 + i / 4) % 1); const bb = i % 2 ? BB : BA; pose(r, { x: bb.x + (i < 2 ? -1 : 1) * 120 * bb.s, y: SH + 4, s: 0.6 + k * 1.2, o: (1 - k) * bump(t, 0.3, 1.4) }); });

      /* v11b — they step out and follow Him along the beach, leaving everything */
      const jOut = es(t, 1.02, 1.06);
      rigA.put('jesus', BA, { flip: true, o: 1 - jOut, armF: 20, armB: 10 + bump(t, 0.6, 1.0) * 20, head: 4, blink: blinkAt(T) });
      const jx = kf(t, JKEYS, (u) => u);
      jesus.set({ x: jx, y: WALK, s: 1.02, flip: true, o: jOut, walk: moving(t, JKEYS) ? jx * 0.05 : undefined, armF: 14, armB: 8, blink: blinkAt(T) });
      walkers.forEach((w) => {
        const rig = w.boat === 'A' ? rigA : rigB, bb = w.boat === 'A' ? BA : BB;
        const out = es(t, w.t0, w.t0 + 0.04);
        rig.put(w.k, bb, { flip: true, o: 1 - out, armF: 30 + bump(t, 0.5, 1.0) * 30, armB: 20, head: 4, blink: blinkAt(T, w.seed) });
        const [sx] = rig.at(bb, w.lx, 0);
        const keys = [[w.t0, sx], [1.96, 380 + w.gap]];
        const x = Math.max(kf(t, keys, (u) => u), jx + w.gap);
        const xm = Math.max(kf(t + 0.02, keys, (u) => u), kf(t + 0.02, JKEYS, (u) => u) + w.gap);
        const y = lerp(WALK - 20 + (w.boat === 'B' ? 10 : 0), WALK + 6 + WHO.indexOf(w) * 4, es(t, w.t0, w.t0 + 0.2));
        w.p.set({ x, y, s: 0.98, flip: true, o: out, walk: Math.abs(xm - x) > 0.2 ? x * 0.05 + w.seed : undefined, armF: 12, armB: 6, blink: blinkAt(T, w.seed) });
      });
      splash.forEach((sp, i) => {
        const w = i === 4 ? null : walkers[i];
        const t0 = w ? w.t0 : 1.02;
        const bb = w ? (w.boat === 'A' ? BA : BB) : BA;
        const k = bump(t, t0, t0 + 0.14);
        pose(sp, { x: bb.x + (w ? w.lx : 104) * bb.s, y: SH + 6, s: k * 1.1, o: k });
      });
      prints.forEach((p) => { pose(p.el, { x: p.x, y: WALK + 4 + (p.i % 2) * 6, sx: 1, o: jx < p.x - 20 ? 0.8 : 0 }); });
      glints.forEach((g) => {
        const k = ((T * 0.6 + g.i / 8) % 1);
        const [x, y] = (g.boat ? rigB : rigA).at(g.boat ? BB : BA, g.dx - (g.boat ? 0 : 50), -92);
        pose(g.el, { x, y: y - bump(k, 0, 1) * 8, s: bump(k, 0, 1) * 0.9, r: T * 40, o: es(t, 1.2, 1.5) });
      });

      S.cam.x = kf(t, [[0, 260], [0.9, 240], [1.1, 220], [2, -260]]);
      S.cam.y = kf(t, [[0, 20], [1, 40], [2, 50]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.06], [2, 1.08]]);
    };
  },
};
