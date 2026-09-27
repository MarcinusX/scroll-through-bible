// J 7,6–9 — the same courtyard. Jesus answers His brothers. An hourglass comes down beside Him, still full:
// "My time has not yet come"; over the brothers hangs a gate standing wide open onto a sunny road: "your time is
// always here". The world, a paper globe, rests calm above them — but over Him it clouds, because He shows up
// its works: His light falls on it and dark blots appear. The brothers take their lulavs and bundles and set off
// for the feast; the hourglass runs on, not yet empty. Jesus stays in Galilee and sits down under the fig tree.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { bundle } from '../mark8/lib.js';
import { sun as _s } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  yardSet, YARD, BROS, headAt, hand, voiceRings, strip, nameTag, roundel, globe, hourglassRig, lulav, etrogHeld, scrap,
  beamGrad, lightBeam, signpost, hangAt, vpose, tr, PI,
} from './lib.js';

const F = YARD.F;
const JX = 690, SITX = 560;
const BX = [880, 968, 1056, 1144];

export default {
  id: 'j7-time',
  beats: [
    { v: 6, text: 'Powiedział więc do nich Jezus:' },
    { v: 6, cont: true, text: '«Dla Mnie stosowny czas jeszcze nie nadszedł, ale dla was - zawsze jest do rozporządzenia.' },
    { v: 7, text: 'Was świat nie może nienawidzić,' },
    { v: 7, cont: true, text: 'ale Mnie nienawidzi, bo Ja o nim świadczę, że złe są jego uczynki.' },
    { v: 8, text: 'Wy idźcie na święto;' },
    { v: 8, cont: true, text: 'Ja jeszcze nie idę na to święto, bo czas mój jeszcze się nie wypełnił».' },
    { v: 9 },
  ],
  cam: { x: [-300, 80], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const Y = yardSet(S, { skyCols: ['#d3e2d9', '#f0e6c8', '#f7e4c2'], sunAt: [1230, 150] });

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(P, c, { n: 3, r: 28, w: 4, both: false });
    // each brother twice: empty-handed, and ready for the road (lulav, etrog / bundle)
    const bros = BROS.map((o, i) => ({
      i, seed: c.rr(0, 9),
      a: S.puppet(P.add(person(c, { ...o }))),
      b: S.puppet(P.add(person(c, { ...o, holdF: lulav(c, 70, 120), holdB: i % 2 ? bundle(c) : etrogHeld(c) }))),
    }));

    /* plates */
    const X = S.layer({ par: 0.5, sh: 6 });
    const hg = hourglassRig(X, c, 120);
    const hgT = X.add(`<g>${strip(c, tr('mój czas: jeszcze nie', 'my time: not yet'), { size: 16 })}</g>`);
    // the open gate onto a sunny road — "your time is always here"
    const gateIn = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-100, -100, 200, 200), 0, 20), '#e9eedf');
      s.p(c.ridge(c.wave(26, [6, 3], [120, 50]), -100, 100, 100, 8, 1), mix(C.hillMid, C.sage3, 0.4));
      s.p(c.cut([[-12, 100], [-4, 26], [4, 26], [12, 100]], 0.3, 5), mix(C.sand2, C.dune, 0.3));
      s.p(c.cut([[-46, 100], [-46, -50], [46, -50], [46, 100]], 0, 10) + c.hole([[-34, 100], [-34, -38], [34, -38], [34, 100]], 0, 10), C.wood2);
      s.p(c.cut([[-34, -38], [-64, -48], [-64, 96], [-34, 100]], 0.3, 5) + c.cut([[34, -38], [64, -48], [64, 96], [34, 100]], 0.3, 5), C.wood3);
      return `<circle cx="0" cy="-6" r="40" fill="url(#warm-glow)"/>${s.out()}<g transform="translate(0 -4)">${_s(c, 14)}</g>`;
    })();
    const gate = hanging(X, roundel(c, gateIn, { r: 80, face: C.parchment, id: S.id('gate-clip') }), { x: 1040, y: 250, len: 600 });
    const gateT = X.add(`<g>${strip(c, tr('dla was: zawsze', 'for you: always'), { size: 16 })}</g>`);
    // the world — calm over the brothers, clouded over Jesus
    const W = S.layer({ par: 0.5, sh: 6 });
    const world = W.add(`<g><circle r="120" fill="url(#halo-glow)" opacity=".6"/>${globe(c, 66)}</g>`);
    const worldDark = W.add(`<g><circle r="72" fill="${mix(C.night, C.storm2, 0.4)}" opacity=".55"/></g>`);
    const blots = [[-26, -18, 12], [18, 10, 10], [-8, 30, 9], [30, -24, 8], [-36, 14, 7]].map(([x, y, r]) => ({ x, y, el: W.add(`<g>${scrap(c, r)}</g>`) }));
    const worldT = W.add(`<g>${strip(c, tr('świat', 'the world'), { size: 17 })}</g>`);
    const evilT = W.add(`<g>${strip(c, tr('złe są jego uczynki', 'its works are evil'), { size: 16 })}</g>`);
    const bid = beamGrad(S, 'testify', '#fff3cf');
    const beamEl = W.add(`<g>${lightBeam(bid, 20, 150, 260)}</g>`);
    const road = hanging(X, signpost(c, tr('na święto', 'to the feast'), { size: 20, dir: 1 }), { x: 1180, y: 320, len: 700 });
    const galTag = hanging(X, nameTag(c, tr(['pozostał', 'w Galilei'], ['He stayed', 'in Galilee']), { size: 18 }), { x: 640, y: 300, len: 600 });

    return (t, time) => {
      const T = time;
      Y.update(t, T, { sunX: 1230 - es(t, 6.0, 6.9) * 120, sunY: 150 + es(t, 6.0, 6.9) * 40 });

      /* Jesus: speaks, then sits under the fig tree (v9) */
      const speak = es(t, 0.05, 0.3) * (1 - es(t, 5.9, 6.05));
      const testify = es(t, 3.3, 3.5) * (1 - es(t, 3.95, 4.1));
      const go = es(t, 6.05, 6.55, ease.sine), sat = es(t, 6.55, 6.62);
      const jx = lerp(JX, SITX, go);
      jesus.set({
        x: jx, y: F + 4, s: 1.02, flip: go > 0 && go < 1, walk: go > 0 && go < 1 ? jx * 0.06 : undefined, o: 1 - sat,
        armF: 14 + speak * 22 + bump(t, 1.1, 1.9) * 26 + testify * 90 + bump(t, 5.1, 5.9) * 30, armB: 8 + bump(t, 1.2, 1.6) * 30,
        head: -2 - testify * 6 + bump(t, 5.2, 5.9) * 6, blink: blinkAt(T, 1),
      });
      jSit.set({ x: SITX, y: F + 6, s: 1.02, o: sat, armF: 20, armB: 10, head: 4, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(JX, F + 4, 1.02, false);
      voice(hx + 26, hy + 4, speak * (bump(t, 0.05, 1.0) + bump(t, 1.1, 1.95) * 0.6 + bump(t, 3.1, 3.95) * 0.6 + bump(t, 5.1, 5.95) * 0.6), T, { dir: 1, spread: 1.6 });

      /* the brothers: listen, then pick up their things and set off (v8a) */
      const ready = es(t, 4.05, 4.12);
      const leave = es(t, 4.35, 4.95, ease.in);
      bros.forEach((b) => {
        const x = BX[b.i] + leave * (560 + b.i * 20);
        const calm = bump(t, 2.05, 3.0);
        const shared = { x, y: F + (b.i % 2) * 6, s: 0.95, blink: blinkAt(T, b.seed), head: -calm * 4 };
        b.a.set({ ...shared, flip: true, o: 1 - ready, armF: 22 + calm * 10, armB: 12 });
        b.b.set({ ...shared, flip: leave < 0.02, o: ready, walk: leave > 0 && leave < 1 ? x * 0.06 + b.i : undefined, armF: 70, armB: 20, head: 0 });
      });

      /* v6b — the hourglass (still full) and the open gate */
      const hk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.9, 2.1, ease.in)) + es(t, 5.1, 5.4, ease.out) * (1 - es(t, 5.95, 6.15, ease.in));
      const hy2 = lerp(-300, 300, hk);
      if (hk > 0.001) pose(hg.el, { x: 560, y: hy2, r: Math.sin(T * 0.9) * 1.4, o: 1 }); else fade(hg.el, 0);
      hg.set(t < 3 ? 0.97 - seg(t, 1.3, 1.9) * 0.04 : 0.93 - seg(t, 5.2, 6.0) * 0.1, t < 3 ? seg(t, 1.3, 1.35) : seg(t, 5.2, 5.25));
      vpose(hgT, { x: 560, y: hy2 + 88, o: hk > 0.3 ? seg(hk, 0.3, 1) : 0 });
      const gk = es(t, 1.35, 1.65, ease.out), gu = es(t, 1.95, 2.15, ease.in);
      const gy = lerp(-300, 250, gk) - gu * 800;
      hangAt(gate, 1040, gy, T, gk > 0 && gu < 1 ? 1 : 0, 1.3, 0.8, 1);
      vpose(gateT, { x: 1040, y: gy + 102, o: gk > 0 && gu < 1 ? seg(t, 1.55, 1.65) : 0 });

      /* v7 — the world: calm over the brothers, then clouded over Jesus, its dark works shown up */
      const wk = es(t, 2.05, 2.4, ease.out), wu = es(t, 3.95, 4.15, ease.in);
      const over = es(t, 3.05, 3.4);
      const wx = lerp(1000, 820, over), wy = lerp(-300, 250, wk) - wu * 800;
      const on = wk > 0 && wu < 1;
      vpose(world, { x: wx, y: wy, r: Math.sin(T * 0.4) * 6, o: on ? 1 : 0 });
      vpose(worldDark, { x: wx, y: wy, o: on ? over : 0 });
      const lit = es(t, 3.45, 3.7);
      blots.forEach((b, i) => vpose(b.el, { x: wx + b.x, y: wy + b.y, s: es(t, 3.5 + i * 0.05, 3.65 + i * 0.05, ease.back), o: on ? seg(t, 3.5 + i * 0.05, 3.55 + i * 0.05) : 0 }));
      vpose(worldT, { x: wx, y: wy + 94, o: on ? seg(t, 2.3, 2.4) * (1 - seg(t, 3.4, 3.5)) : 0 });
      vpose(evilT, { x: wx, y: wy + 94, o: on ? seg(t, 3.6, 3.7) : 0 });
      const [fx, fy] = hand(JX, F + 4, 1.02, false, 14 + speak * 22 + testify * 90);
      const bdx = wx - fx, bdy = wy - fy, bl = Math.hypot(bdx, bdy);
      vpose(beamEl, { x: fx, y: fy, r: (Math.atan2(-bdx, bdy) * 180) / PI, sy: lit * (bl / 260), o: lit * (1 - es(t, 3.95, 4.05)) * 0.9 });

      /* v8a — to the feast */
      const rk = es(t, 4.1, 4.35, ease.out), ru = es(t, 4.95, 5.1, ease.in);
      hangAt(road, 1180, lerp(-300, 320, rk) - ru * 700, T, rk > 0 && ru < 1 ? 1 : 0, 1.2, 0.9, 3);

      /* v9 — He stayed in Galilee */
      const tk = es(t, 6.3, 6.6, ease.out);
      hangAt(galTag, 700, lerp(-300, 300, tk), T, tk > 0 ? 1 : 0, 1.3, 0.8, 4);

      S.cam.x = 30 - es(t, 5.0, 5.8) * 90 - es(t, 6.05, 6.7) * 200;
      S.cam.y = -20;
      S.cam.z = 1.06 + bump(t, 3.0, 4.0) * 0.04;
    };
  },
};
