// J 2,6–8 — six stone jars for the Jewish purification rites stand in the courtyard, three on each side
// of Jesus; each holds two or three measures (the ticks on their cut-away windows). "Fill the jars with
// water!" — two servants pour until the water stands at the brim. "Now draw some out": the dipper goes
// in, and the clear water blushes to deep red wine, jar after jar, with sparks rising. They carry it off.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { canaSet, canaIdle, SERVANTS, LOOK, AFTERNOON, EVENING, stoneJar, liquid, JAR, WATER, WINE_A, jug, dipper, pourStream, drops, washIcon, measureIcon, wordTag, strip, iconBubble, miniHead, sparkle, hand, goblet, tr, PI } from './lib.js';

const FLOOR = 690;
const JS = 1.04;                                   // jar scale
const JX_WIDE = [440, 546, 652, 948, 1054, 1160];
const JX_PHONE = [500, 592, 684, 916, 1008, 1100];   // phone: all six jars on the narrow stage
const MOUTH = FLOOR - JAR.h * JS;                  // y of the jars' mouths
const WIN0 = FLOOR + JAR.win.y0 * JS;              // bottom of the windows

export default {
  id: 'j2-jars',
  beats: [
    { v: 6, text: 'Stało zaś tam sześć stągwi kamiennych przeznaczonych do żydowskich oczyszczeń,' },
    { v: 6, cont: true, text: 'z których każda mogła pomieścić dwie lub trzy miary.' },
    { v: 7, text: 'Rzekł do nich Jezus: «Napełnijcie stągwie wodą!»' },
    { v: 7, cont: true, text: 'I napełnili je aż po brzegi.' },
    { v: 8, text: 'Potem do nich powiedział: «Zaczerpnijcie teraz i zanieście staroście weselnemu!»' },
    { v: 8, cont: true, text: 'Oni zaś zanieśli.' },
  ],
  cam: { x: [-20, 120], y: [0, 90], z: [0.85, 1.2] },
  build(S) {
    const c = S.c;
    const JX = S.portrait ? JX_PHONE : JX_WIDE;
    const UP = S.portrait ? 760 : 420;               // how far the plates are pulled up into the flies
    const set = canaSet(S, { floorY: FLOOR, doorX: 1330 });

    /* words on the flies */
    const tagL = S.layer({ par: 0.08, sh: 5 });
    const washTag = hanging(tagL, `<g transform="translate(0 30)">${wordTag(c, tr('do oczyszczeń', 'for purifying'), { size: 22, w: 230 })}</g><g transform="translate(0 110) scale(1.3)">${sheet().p(c.cut(c.circ(0, 0, 40, 24), 0.4, 4), C.cream).out()}${washIcon(c)}</g>`, { x: 800, y: 150, len: 700 });
    const measureBoard = hanging(tagL, `${sheet().p(c.cut(c.rect(-160, 0, 320, 110), 0.5, 8), C.parchment).out()}<g transform="translate(-90 44)">${measureIcon(c, 'I')}</g><g transform="translate(0 44)">${measureIcon(c, 'II')}</g><g transform="translate(90 44)" opacity=".55">${measureIcon(c, 'III')}</g><g transform="translate(0 140)">${strip(c, tr('dwie lub trzy miary', 'two or three measures'), { size: 20 })}</g>`, { x: 800, y: 150, len: 700 });

    /* the jars, the servants behind them */
    const jarL = S.layer({ par: 0.5, sh: 5 });
    const glows = JX.map((x) => jarL.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`));
    const serv = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(jarL.add(person(c, SERVANTS[i]))) }));
    const jars = JX.map((x, i) => {
      const J = stoneJar(c, { col: mix(C.stone, C.rock, 0.3 + (i % 3) * 0.08) });
      const g = { x, i };
      g.back = jarL.add(`<g transform="translate(${x} ${FLOOR}) scale(${JS})">${J.back}</g>`);
      g.water = jarL.add(`<g>${liquid(c, WATER)}</g>`);
      g.wine = jarL.add(`<g>${liquid(c, WINE_A)}</g>`);
      g.front = jarL.add(`<g>${J.front}</g>`);
      g.num = jarL.add(`<g>${strip(c, String(i + 1), { size: 22 })}</g>`);
      g.brim = jarL.add(`<g>${drops(c, WATER, 14, 5)}</g>`);
      return g;
    });
    const jugs = serv.map(() => jarL.add(`<g><g transform="translate(28 45)">${jug(c, C.pot)}</g></g>`));
    const streams = serv.map(() => jarL.add(`<g>${pourStream(c, WATER, 100)}</g>`));
    const dip = jarL.add(`<g>${dipper(c, 70)}<path class="wine" d="${c.poly(c.ell(0, 68, 11, 3, 10))}" fill="${WINE_A}"/></g>`);
    const cupB = jarL.add(`<g>${goblet(c, { r: 1.5 })}</g>`);
    const sparks = Array.from({ length: 16 }, (_, i) => ({ i, j: i % 6, el: jarL.add(`<g>${sparkle(c, c.rr(8, 14), i % 3 ? C.star : C.halo)}</g>`), dx: c.rr(-30, 30), ph: c.rr(0, 1) }));

    /* Jesus */
    const frontL = S.layer({ par: 0.56, sh: 6 });
    const jGlow = frontL.add(`<g><circle r="210" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(frontL.add(person(c, { ...CAST.jesus })));
    const b7 = frontL.add(`<g>${iconBubble(c, `<g transform="translate(-4 34) scale(.42)">${stoneJar(c).front}</g><g transform="translate(26 -12)">${drops(c, WATER, 14, 5)}</g><g transform="translate(-30 -16)">${drops(c, WATER, 10, 4)}</g>`, { w: 120, h: 96 })}</g>`);
    const b8 = frontL.add(`<g>${iconBubble(c, `<g transform="translate(-34 16)">${goblet(c, { r: 1.6 })}</g><path d="M-14 -2H14M8 -8L14 -2L8 4" stroke="${C.terracotta}" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(36 2)">${miniHead(c, LOOK.steward, 17)}</g>`, { w: 140, h: 80 })}</g>`);

    // pouring plan: servant 0 fills jars 0,1,2; servant 1 fills 5,4,3
    const ORDER = [[0, 1, 2], [5, 4, 3]];
    const P0 = 3.05, PD = 0.3;

    return (t, time) => {
      const T = time;
      set.sk.blend(AFTERNOON, EVENING, 0.35 + es(t, 0, 6) * 0.4);
      canaIdle(set, T, { lit: 0.7 + es(t, 4.2, 4.8) * 0.3 });

      /* v6a — the jars stand there, numbered one to six; "for purifying" */
      jars.forEach((g) => {
        const up = es(t, -0.2 + g.i * 0.08, 0.3 + g.i * 0.08, ease.out);
        const y = FLOOR + (1 - up) * 40;
        pose(g.back, { x: g.x, y, s: JS, o: up });
        pose(g.front, { x: g.x, y, s: JS, o: up });
        const nk = es(t, 0.2 + g.i * 0.08, 0.4 + g.i * 0.08, ease.back) * (1 - es(t, 1.9, 2.1));
        pose(g.num, { x: g.x, y: MOUTH - 30, s: 0.4 + nk * 0.6, o: nk });
        // water: the servants pour it in (v7b); wine: it blushes up from the bottom (v8a)
        const s0 = ORDER[0].indexOf(g.i), s1 = ORDER[1].indexOf(g.i);
        const k = s0 >= 0 ? s0 : s1;
        const lvl = es(t, P0 + k * PD + 0.05, P0 + (k + 1) * PD - 0.02);
        pose(g.water, { x: g.x, y: WIN0, s: JS, sy: JS * Math.max(0.001, lvl), o: lvl > 0.002 ? 1 : 0 });
        const d = Math.abs(g.i - 3);
        const w = es(t, 4.35 + d * 0.08, 4.62 + d * 0.08, ease.io);
        pose(g.wine, { x: g.x, y: WIN0, s: JS, sy: JS * Math.max(0.001, w), o: w > 0.002 ? 1 : 0 });
        const brim = bump(t, P0 + (k + 1) * PD - 0.06, P0 + (k + 1) * PD + 0.18);
        pose(g.brim, { x: g.x, y: MOUTH + 6 - brim * 6, s: 0.8 + brim * 0.5, o: brim });
        pose(glows[g.i], { x: g.x, y: FLOOR - 70, s: 0.6 + w * 0.6, o: bump(t, 4.3 + d * 0.08, 6) * 0.9 });
      });
      pose(washTag, { x: 800, y: 140 - (1 - es(t, 0.25, 0.6, ease.out)) * UP - es(t, 0.95, 1.2) * UP, r: Math.sin(T * 0.8) * 1.5 });
      pose(measureBoard, { x: 800, y: 150 - (1 - es(t, 1.1, 1.45, ease.out)) * UP - es(t, 1.95, 2.2) * UP, r: Math.sin(T * 0.7 + 1) * 1.2 });

      /* the servants: come in (v7a), pour (v7b), draw and carry (v8) */
      serv.forEach((s, i) => {
        const dir = i ? -1 : 1;
        const order = ORDER[i];
        // which jar are they at, how far through the pour?
        let x, pour = 0, walking = false;
        const come = es(t, 2.3, 2.85);
        const at = (j) => JX[j] - dir * 84;
        if (t < P0) { x = lerp(i ? 1500 : 100, at(order[0]), come); walking = come > 0 && come < 1; }
        else {
          const u = Math.min(2.999, (t - P0) / PD);
          const k = Math.min(2, Math.floor(u)), f = u - k;
          const move = k < 2 ? es(f, 0.72, 1) : 0;
          x = lerp(at(order[k]), at(order[Math.min(2, k + 1)]), move);
          walking = move > 0 && move < 1;
          pour = t < P0 + 3 * PD ? bump(f, 0.05, 0.75) : 0;
        }
        // v8: servant 1 (at jar 4) dips; then both carry it away to the right
        const dipK = i === 1 ? bump(t, 4.1, 4.62) : 0;
        const leave = es(t, 5.05 + i * 0.1, 5.75 + i * 0.1, ease.in);
        x += leave * (i ? 520 : 1100);
        walking = walking || (leave > 0 && leave < 1);
        const flip = leave > 0.02 ? false : i === 1;
        const armF = 20 + pour * 110 + dipK * 70 + (i === 1 ? es(t, 4.6, 4.8) * 70 : 0) + leave * 30;
        s.p.set({ x, y: FLOOR - 18, s: 1, flip, walk: walking ? x * 0.1 : undefined, armF, armB: 10 + pour * 30, head: pour * 10 + dipK * 12, lean: dipK * 8 * (flip ? -1 : 1), blink: blinkAt(T, s.seed) });
        // the jug in the hand, tipped to pour
        const [hx, hy] = hand(x, FLOOR - 18, 1, flip, armF);
        const r = pour * 62;
        const showJug = t < P0 + 3 * PD + 0.2 ? es(t, 2.2, 2.35) : 0;
        pose(jugs[i], { x: hx, y: hy, s: 0.8, sx: flip ? -1 : 1, r: flip ? -r : r, o: showJug });
        // the stream from the spout down into the mouth of the jar
        const a = (r * PI) / 180, sx = (58 * Math.cos(a) + 25 * Math.sin(a)) * 0.8, sy = (58 * Math.sin(a) - 25 * Math.cos(a)) * 0.8;
        const spx = hx + (flip ? -sx : sx), spy = hy + sy;
        const len = Math.max(0, MOUTH + 10 - spy);
        pose(streams[i], { x: spx, y: spy, sy: len / 100, o: pour > 0.55 && len > 4 ? 1 : 0 });
        if (i === 1) {
          // the dipper goes into jar 4 and comes out red; then a cup is carried off
          const inJar = bump(t, 4.15, 4.6);
          pose(dip, { x: hx, y: hy + inJar * 26, r: flip ? 20 : -20, o: es(t, 4.02, 4.12) * (1 - es(t, 4.72, 4.8)) });
          fade(dip.querySelector('.wine'), es(t, 4.4, 4.5));
          pose(cupB, { x: hx, y: hy - 6, s: 1, o: es(t, 4.72, 4.8) * (1 - seg(t, 5.7, 5.8)) });
        }
      });

      /* sparks rise from the jars as the water becomes wine */
      sparks.forEach((sp) => {
        const on = es(t, 4.4, 4.7) * (1 - es(t, 5.6, 6));
        const k = ((T * 0.35 + sp.ph) % 1);
        const kk = T ? k : (sp.i / 16);
        pose(sp.el, { x: JX[sp.j] + sp.dx + Math.sin(kk * 6 + sp.i) * 8, y: MOUTH - 10 - kk * 150, s: 0.6 + Math.sin(kk * PI) * 0.6, r: kk * 90, o: on * Math.sin(kk * PI) });
      });

      /* Jesus */
      const speak7 = bump(t, 2.0, 3.0), speak8 = bump(t, 4.0, 5.0);
      jesus.set({ x: 800, y: FLOOR + 22, s: 1.08, flip: false, armF: 16 + speak7 * 60 + speak8 * 70, armB: 10 + speak7 * 40 + es(t, 4.4, 4.8) * 90 * (1 - es(t, 5.3, 5.8)), head: -speak7 * 4 + es(t, 4.4, 4.8) * -6, blink: blinkAt(T, 2) });
      pose(jGlow, { x: 800, y: FLOOR - 150, s: 0.8 + es(t, 4.35, 4.8) * 0.5, o: 0.35 + es(t, 4.35, 4.8) * 0.5 - es(t, 5.4, 6) * 0.3 });
      const k7 = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(b7, { x: 826, y: FLOOR - 180, s: 0.3 + 0.7 * k7, o: k7 });
      const k8 = es(t, 4.05, 4.25, ease.back) * (1 - es(t, 4.8, 4.95));
      pose(b8, { x: 826, y: FLOOR - 180, s: 0.3 + 0.7 * k8, o: k8 });

      S.cam.z = (S.portrait ? 0.88 : 1.14) + es(t, 3.9, 4.4) * 0.05 - es(t, 5, 5.6) * 0.05;
      S.cam.y = 80 + es(t, 0.9, 1.2) * -40 * (1 - es(t, 1.9, 2.2)) + es(t, 3.9, 4.4) * 10;
      S.cam.x = es(t, 5.1, 5.9) * 80;
    };
  },
};
