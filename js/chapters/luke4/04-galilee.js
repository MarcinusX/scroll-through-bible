// Łk 4,14–15 — back in Galilee, green hills and villages. Jesus comes along the road "in the power of the Spirit":
// the dove glides above Him in a warm light. The news about Him goes out: paper slips of word fly from the road to
// village after village, and on every hilltop little people come out to look. Then He teaches in their
// synagogues: He stands on the steps of a village synagogue while, on the far hills, other synagogues light up
// one by one — and everyone around Him lifts their hands in praise.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, cypress, bush, rock, grass, flowers, palm } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { DAY, dove, flapWings, headAt, voiceRings, wordSlip, spark, sparkle, smallSynagogue, village, figure, manO, womanO, PI } from './lib.js';

const JX = 800, GY = 724;
const ROADY = (x) => GY + 4 + Math.sin(x * 0.005) * 5;

export default {
  id: 'lk4-galilee',
  beats: [
    { v: 14, text: 'Potem powrócił Jezus w mocy Ducha do Galilei,' },
    { v: 14, cont: true, text: 'a wieść o Nim rozeszła się po całej okolicy.' },
    { v: 15 },
  ],
  cam: { x: [-200, 30], y: [-20, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1180, y: 160, len: 800 });
    const cls = [[470, 150, 200], [900, 110, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

    /* ---------- hills with villages (their synagogues light up later) ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const farL = S.layer({ par: 0.16, sh: 3 });
    const fh = hillsWith(c, { y: 470, amps: [30, 12, 4], lens: [900, 320, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 20 });
    farL.add(fh.markup);
    const VIL = [[180, 0.4], [430, 0.42], [700, 0.36], [1000, 0.4], [1270, 0.42], [1480, 0.4]].map(([x, sc], i) => ({ x, y: fh.fn(x) + 8, sc, i }));
    VIL.forEach((v) => farL.add(village(c, v.x, v.y, { sc: v.sc, n: 5, spread: 120 })));
    // tiny synagogues on three of the hills, and their lit twins
    const SYN = [VIL[1], VIL[3], VIL[4]];
    SYN.forEach((v) => farL.add(`<g transform="translate(${v.x + 50} ${v.y - 4}) scale(.22)">${smallSynagogue(c)}</g>`));
    const synLit = SYN.map((v) => farL.add(`<g opacity="0"><g transform="translate(${v.x + 50} ${v.y - 4}) scale(.22)">${smallSynagogue(c, { lit: true })}</g></g>`));
    // the villagers who come out to look when the news arrives
    const folkL = S.layer({ par: 0.16, sh: 3 });
    const lookers = VIL.map((v) => ({ v, el: folkL.add(`<g opacity="0">${[0, 1, 2].map((k) => figure(c, k % 2 ? womanO(c) : manO(c), { x: v.x - 30 + k * 22, y: v.y + 4, s: 0.27, flip: v.x > JX, armF: k === 1 ? 80 : 20 })).join('')}</g>`) }));
    const vSparks = VIL.map(() => folkL.add(`<g opacity="0">${spark(c, 9)}</g>`));

    /* ---------- the village synagogue where He teaches ---------- */
    const synL = S.layer({ par: 0.36, sh: 4 });
    const mg = band(c, { y: 612, amps: [8, 4, 2], lens: [900, 300, 100], color: mix(C.hillNear, C.sand, 0.25) });
    synL.add(mg.markup);
    synL.add(cypress(c, 560, 620, 130) + cypress(c, 1080, 624, 120) + olive(c, 1260, 626, 0.7) + olive(c, 330, 624, 0.7));
    const synEl = synL.add(`<g><g transform="translate(830 626) scale(.9)">${smallSynagogue(c)}</g></g>`);
    const doorLit = synL.add(`<g opacity="0"><g transform="translate(830 626) scale(.9)">${smallSynagogue(c, { lit: true })}</g></g>`);

    /* ---------- the road ---------- */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(676, [5, 2], [700, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out());
    const road = [], road2 = [];
    for (let x = -900; x <= 2500; x += 20) road.push([x, ROADY(x) - 22]);
    for (let x = 2500; x >= -900; x -= 20) road2.push([x, ROADY(x) + 22]);
    G.add(sheet().p(c.cut([...road, ...road2], 1, 10), C.sand).out());
    G.add(grass(c, { x0: -600, x1: 2200, y: 680, fn: gfn, n: 40, h: 12, color: C.olive }));

    /* ---------- people: the village listeners (calm / praising) ---------- */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const light = PL.add(`<g opacity="0"><circle r="150" fill="url(#halo-glow)"/></g>`);
    const GROUPS = [[560, -1], [650, -1], [990, 1], [1090, 1]].map(([gx, side], i) => {
      const r = S.c;
      const mem = [0, 1, 2].map((k) => ({ x: gx + (k - 1) * 34 + r.rr(-6, 6), y: GY + (k % 2) * 10, s: 0.84 + r.rr(-0.04, 0.04), flip: side > 0, o: (i + k) % 2 ? womanO(r) : manO(r) }));
      const calm = PL.add(`<g opacity="0">${mem.map((m) => figure(r, m.o, { x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 20 })).join('')}</g>`);
      const praise = PL.add(`<g opacity="0">${mem.map((m, k) => figure(r, m.o, { x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 60 + k * 10, armB: 150 - k * 10, head: -8 })).join('')}</g>`);
      return { i, side, gx, calm, praise };
    });
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.sun, r: 40, w: 5 });
    const praiseSparks = [0, 1, 2, 3, 4, 5].map(() => PL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const slips = VIL.map((v, i) => ({ v, i, el: PL.add(`<g opacity="0">${wordSlip(c, 32)}</g>`) }));
    const doveEl = PL.add(dove(c));
    const doveGlow = S.layer({ par: 0.5, sh: 0, flat: true });
    const dGlow = doveGlow.add(`<circle r="120" fill="url(#halo-glow)" opacity="0"/>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 140, 880, 230, C.sage, C.moss) + bush(c, 1480, 876, 220, C.moss, C.sage) + rock(c, 330, 890, 150, 60, C.rock2) + flowers(c, { x0: 980, x1: 1400, y: 850, n: 12 }));
    fg.add(palm(c, -60, 920, 330) + palm(c, 1680, 915, 300));

    return (t, time) => {
      swing(sunEl, 1180, 160, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));

      /* v14a: along the road in the power of the Spirit */
      const w = es(t, 0.05, 0.9);
      const jx = lerp(260, JX, w);
      const teach = es(t, 2.1, 2.35);
      jesus.set({ x: jx, y: ROADY(jx), s: 1.02, walk: w > 0 && w < 1 ? jx * 0.045 : undefined, armF: 14 + bump(t, 0.9, 1.3) * 20 + teach * 42, armB: 8 + teach * 30, head: -2, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(jx, ROADY(jx), 1.02, false);
      pose(light, { x: jhx, y: jhy + 40, s: 1 + Math.sin(time * 1.1) * 0.04, o: 0.8 });
      const dx = jx + 40 + Math.sin(time * 0.9) * 10, dy = jhy - 150 + Math.sin(time * 1.3) * 8 - es(t, 1.9, 2.3) * 500;
      pose(doveEl, { x: dx, y: dy, s: 0.95, o: t < 2.3 ? 1 : 0 });
      flapWings(doveEl, time, 22, 5, -10);
      pose(dGlow, { x: dx, y: dy - 6, o: t < 2.3 ? 0.8 : 0 });

      /* v14b: the news goes out, village after village */
      slips.forEach((sl) => {
        const a = 1.08 + sl.i * 0.1, k = seg(t, a, a + 0.45);
        const x = lerp(jhx, sl.v.x, ease.out(k)), y = lerp(jhy - 30, sl.v.y - 40, k) - Math.sin(k * PI) * 120;
        pose(sl.el, { x, y, r: Math.sin(k * 8 + sl.i) * 20, s: 1.5 - k * 0.6, o: k > 0 && k < 1 ? 1 : 0 });
        const arr = es(t, a + 0.4, a + 0.55);
        pose(lookers[sl.i].el, { o: arr });
        const sp = bump(t, a + 0.4, a + 0.9);
        pose(vSparks[sl.i], { x: sl.v.x, y: sl.v.y - 40, s: sp, r: time * 40, o: sp });
      });

      /* v15: teaching in their synagogues, glorified by all */
      voice(jhx, jhy, teach * 0.8, time, { spread: 2.4 });
      const synIn = es(t, 1.75, 2.05);
      pose(synEl, { y: (1 - synIn) * 40, o: synIn });
      pose(doorLit, { o: es(t, 2.0, 2.3) });
      synLit.forEach((el, i) => pose(el, { o: es(t, 2.3 + i * 0.12, 2.45 + i * 0.12) }));
      GROUPS.forEach((g) => {
        const inK = es(t, 1.9 + g.i * 0.05, 2.25 + g.i * 0.05);
        const pr = es(t, 2.5 + g.i * 0.04, 2.56 + g.i * 0.04);
        const dx2 = (1 - inK) * g.side * 420;
        pose(g.calm, { x: dx2, o: inK * (1 - pr) });
        pose(g.praise, { x: dx2, o: inK * pr });
      });
      praiseSparks.forEach((sp, i) => { const k = bump(t, 2.55 + i * 0.05, 3.0 + i * 0.03); pose(sp, { x: [540, 640, 700, 960, 1040, 1120][i], y: 480 - (i % 2) * 40, s: k, r: time * 50, o: k }); });

      S.cam.x = lerp(-170, 0, es(t, 0.0, 0.9));
      S.cam.z = 1.03 + es(t, 1.0, 1.5) * -0.02 + es(t, 2.0, 2.5) * 0.06;
      S.cam.y = 20 + es(t, 2.0, 2.5) * 20;
    };
  },
};
