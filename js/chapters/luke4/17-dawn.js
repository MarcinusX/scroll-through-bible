// Łk 4,42–44 — first light: Jesus leaves the sleeping town and goes out to a bare, rocky place, and kneels there
// as the sun comes up. The crowds come looking for Him over the hill and find Him; they cling to Him — hands on
// His mantle, on His arms — so that He will not leave them. "I must bring the good news of the kingdom of God to
// the other towns too, for that is why I was sent": light comes down on Him, He points to the villages on the far
// hills, and a gold road runs out to them. And He preaches in their synagogues: one far synagogue after another
// lights up along the ridge while He sets off down the road.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, moon, stars, rock, bush, olive, grass } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { NIGHT, DAWN, DAY, headAt, hand, voiceRings, group, folk, smallSynagogue, village, lightShaft, sparkle, figure, manO, womanO, PI } from './lib.js';

const JX = 800, GY = 700;
const ROAD = [[830, 704], [930, 690], [1040, 664], [1130, 630], [1190, 580], [1170, 520], [1080, 480], [960, 452], [820, 436]];

export default {
  id: 'lk4-dawn',
  beats: [
    { v: 42, text: 'Z nastaniem dnia wyszedł i udał się na miejsce pustynne.' },
    { v: 42, cont: true, text: 'A tłumy szukały Go i przyszły aż do Niego;' },
    { v: 42, cont: true, text: 'chciały Go zatrzymać, żeby nie odchodził od nich.' },
    { v: 43 },
    { v: 44 },
  ],
  cam: { x: [-60, 40], y: [-30, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DAWN);
    const day = sky(S, DAY, { name: 'day' }).layer;
    day.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 300, n: 80 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunGlow = hangL.add(`<circle r="260" fill="url(#warm-glow)" opacity="0"/>`);
    const SUNX = S.portrait ? 985 : 1180;   // phone: the sun rises inside the screen, not under the progress thread
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: SUNX, y: 560, len: 900 });

    /* the far hills with their villages and synagogues */
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = band(c, { y: 400, amps: [22, 9, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.2) });
    far.add(fb.markup);
    const VIL = [[330, 0.4], [520, 0.38], [760, 0.36], [1000, 0.38], [1230, 0.4]].map(([x, sc], i) => ({ x, y: fb.fn(x) + 8, sc, i }));
    VIL.forEach((v) => far.add(village(makeCutter('lk4-dv' + v.i), v.x, v.y, { sc: v.sc, n: 4, spread: 90 })));
    const syn = VIL.map((v) => ({ v, el: far.add(`<g opacity="0"><g transform="translate(${v.x + 44} ${v.y - 2}) scale(.2)">${smallSynagogue(c, { lit: true })}</g></g>`), sp: far.add(`<g opacity="0">${sparkle(c, 9)}</g>`) }));
    const mid = S.layer({ par: 0.22, sh: 3 });
    const mb = hillsWith(c, { y: 500, amps: [16, 7, 3], lens: [800, 260, 100], color: mix(C.hillMid, C.sand, 0.2), trees: 16, treeColor: C.sage, treeH: 18 });
    mid.add(mb.markup);
    // Capernaum, asleep, on the right
    mid.add(village(makeCutter('lk4-dawn-town'), 1340, mb.fn(1340) + 10, { n: 7, spread: 260, sc: 0.7 }));
    /* the bare place */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(GY - 20, [8, 3], [700, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.rock, 0.35)).out());
    G.add(rock(c, 560, GY + 10, 150, 60, C.rock2) + rock(c, 1080, GY + 4, 110, 44, C.rock) + bush(c, 420, GY + 20, 60, C.olive) + grass(c, { x0: -600, x1: 2200, y: GY - 16, fn: gfn, n: 30, h: 10, color: C.olive }));

    // the gold road out to the other towns
    const roadL = S.layer({ par: 0.5, sh: 2 });
    const dashes = [];
    for (let i = 0; i < ROAD.length - 1; i++) for (let k = 0; k < 3; k++) {
      const u0 = k / 3, u1 = u0 + 0.2, a = ROAD[i], b = ROAD[i + 1];
      const p0 = [lerp(a[0], b[0], u0), lerp(a[1], b[1], u0)], p1 = [lerp(a[0], b[0], u1), lerp(a[1], b[1], u1)];
      dashes.push(roadL.add(`<g opacity="0"><path d="${c.ribbon([p0, p1], 5)}" fill="${C.sun}"/></g>`));
    }

    /* light from above (behind Him) */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const shaft = lightL.add(`<g opacity="0">${lightShaft(c, { w0: 50, w1: 150 })}</g>`);

    /* the crowds come looking for Him */
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    // phone: the crowds that come stand closer, inside the screen
    const GR = (S.portrait ? [[950, 0], [1020, 1], [1075, 0], [600, 1], [515, 0]] : [[980, 0], [1100, 1], [1220, 0], [560, 1], [440, 0]]).map(([x, row], i) => {
      const mem = [0, 1, 2].map((k) => ({ x: (k - 1) * 30 + c.rr(-5, 5), y: c.rr(-6, 6), s: 1, flip: x > JX, o: folk(c) }));
      return { i, x, row, d: i * 0.06, sp: crowdL.sprite(`<g transform="scale(.8)">${group(c, mem)}</g>`, x, GY - 14 + row * 10) };
    });
    const PL = S.layer({ par: 0.5, sh: 5 });
    const jWalk = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const jKneel = S.puppet(PL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jStand = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    // the ones who cling to Him
    const HOLD = [{ x: 690, flip: false, o: womanO(c, { robe: C.roseRobe }) }, { x: 918, flip: true, o: manO(c, { robe: C.tealRobe }) }, { x: 990, flip: true, o: womanO(c, { robe: C.wheatRobe }) }].map((h, i) => ({ ...h, i, p: S.puppet(PL.add(person(c, h.o))) }));
    const voice = voiceRings(PL, c, { n: 3, color: C.sun, r: 40, w: 5 });

    return (t, time) => {
      /* v42a: at daybreak, out to a bare place, to pray */
      const dayK = es(t, 0.3, 1.6);
      day.fade(es(t, 1.0, 2.4));
      starL.fade(1 - es(t, 0.1, 0.8));
      const sy = lerp(560, 300, es(t, 0.2, 2.5));
      swing(sunEl, SUNX, sy, time, 0.8, 0.5);
      pose(sunGlow, { x: SUNX, y: sy, s: 0.6 + dayK * 0.6, o: dayK * 0.8 * (1 - es(t, 2.2, 3.0) * 0.6) });
      const w = es(t, 0.02, 0.6);
      const wx = lerp(1180, JX, w);
      const kneel = es(t, 0.66, 0.72) * (1 - es(t, 1.4, 1.46));
      const stand = es(t, 1.4, 1.46);
      jWalk.set({ x: wx, y: GY, s: 1.0, flip: true, o: 1 - Math.max(kneel, stand), walk: w > 0 && w < 1 ? wx * 0.05 : undefined, armF: 10, head: 4, blink: blinkAt(time) });
      jKneel.set({ x: JX, y: GY, s: 1.0, flip: true, o: kneel, armF: 60, armB: 50, head: 8, blink: 0 });
      const point = es(t, 3.1, 3.35) * (1 - es(t, 4.0, 4.2));
      const go = es(t, 4.1, 4.9);
      const held = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const along = (u) => { const f = u * 3, i = Math.min(2, Math.floor(f)), k = f - i; return [lerp(ROAD[i][0], ROAD[i + 1][0], k), lerp(ROAD[i][1], ROAD[i + 1][1], k)]; };
      const [jx, jy2] = go > 0 ? along(go * (S.portrait ? 0.45 : 1)) : [JX, GY];
      jStand.set({ x: jx, y: jy2, s: 1.0 - go * 0.12, flip: t < 3.0, o: stand, walk: go > 0 && go < 1 ? jx * 0.05 : undefined, armF: 14 + point * 70 + held * 10, armB: 10 + point * 30 + held * 20, head: -point * 8 + held * 4, blink: blinkAt(time) });

      /* v42b: the crowds look for Him and come; v42c: they hold on to Him */
      GR.forEach((g) => {
        const k = es(t, 1.05 + g.d, 1.7 + g.d);
        const from = g.x > JX ? 1500 : 100;
        const rel = es(t, 3.0, 3.4) * (g.x > JX ? 420 : S.portrait ? -340 : -160) + es(t, 4.0, 4.4) * (g.x > JX ? 120 : 0);
        g.sp.set({ x: lerp(from, g.x, k) + rel, y: GY - 14 + g.row * 10 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 24 + g.i)) * 3 : 0), s: 1, o: seg(t, 1.0 + g.d, 1.1 + g.d) });
      });
      HOLD.forEach((h) => {
        const k = es(t, 1.4 + h.i * 0.08, 1.9 + h.i * 0.05);
        const hx = lerp(h.flip ? 1400 : 200, h.x, k) + es(t, 3.0, 3.4) * (h.flip ? 380 : -170) + es(t, 4.0, 4.4) * (h.flip ? 120 : 0);
        const grip = es(t, 2.05 + h.i * 0.05, 2.25 + h.i * 0.05) * (1 - es(t, 3.9, 4.1) * 0.6);
        h.p.set({ x: hx, y: GY + 6, s: 0.96, flip: h.flip, o: seg(t, 1.35, 1.45), walk: k > 0 && k < 1 ? hx * 0.05 : undefined, armF: 20 + grip * 70 + es(t, 4.1, 4.4) * 60, armB: grip * 50 + es(t, 4.1, 4.4) * 100, lean: grip * 10, head: -grip * 6, blink: blinkAt(time, h.i + 4) });
      });

      /* v43: sent to the other towns — light from above, the road runs out to them */
      pose(shaft, { x: JX, y: GY + 4, o: es(t, 3.05, 3.4) * (1 - es(t, 4.1, 4.5)) * (0.9 + Math.sin(time * 1.3) * 0.08) });
      const [jhx, jhy] = headAt(JX, GY, 1.0, false);
      voice(jhx, jhy, point, time, { dir: 1, spread: 2 });
      const shown = seg(t, 3.3, 3.9) * dashes.length;
      dashes.forEach((d, i) => fade(d, i < shown ? 0.9 : 0));

      /* v44: He preaches in their synagogues */
      syn.forEach((s) => {
        const a = 4.05 + s.v.i * 0.13;
        const k = es(t, a, a + 0.15);
        pose(s.el, { o: k });
        const sp = bump(t, a, a + 0.5);
        pose(s.sp, { x: s.v.x + 44, y: s.v.y - 50, s: sp, r: time * 40, o: sp });
      });

      S.cam.x = lerp(40, 0, es(t, 0, 0.7)) + es(t, 4.0, 4.8) * 30;
      S.cam.z = 1.03 + es(t, 0.5, 1.0) * 0.04 - es(t, 1.0, 1.5) * 0.04 - es(t, 3.0, 3.5) * 0.02;
      S.cam.y = 30 - es(t, 3.0, 3.5) * 40;
    };
  },
};
