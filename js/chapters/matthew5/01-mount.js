// Mt 5,1–2 — the curtains open on a green mountain over the Sea of Galilee. The crowds are gathering on the
// shore and the lower slopes; Jesus sees them, and climbs the winding path to the top. There He sits down on a
// rock; Peter, Andrew, James and John come up after Him and sit close, and the crowds settle on the slopes.
// Then He opens His mouth and teaches them: the camera draws near, rings of His voice go out over the hill.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, sky, sheet, shade, mix, flock } from '../kit.js';
import { bird } from '../../assets/things.js';
import { band, waterBand, town, sun, cloud, grass, flowers, olive, cypress, rock, bush } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, folk, group, smallSail, voiceRings, seatRock, bough8, PI } from './lib.js';

// the winding path up the mountain, foot → summit
const PATH = [[470, 800], [610, 736], [520, 676], [690, 610], [590, 560], [740, 502], [800, 464]];
const TOP = [800, 462];
function along(pts, u) {
  const seg_ = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg_.push(d); tot += d; }
  let x = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < seg_.length; i++) {
    if (x <= seg_[i] || i === seg_.length - 1) { const k = seg_[i] ? Math.min(1, x / seg_[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), pts[i + 1][0] < pts[i][0] ? -1 : 1]; }
    x -= seg_[i];
  }
  return [...pts[pts.length - 1], 1];
}

export default {
  id: 'mt5-mount',
  beats: [
    { cover: true },
    { v: 1, text: 'Jezus, widząc tłumy, wyszedł na górę.' },
    { v: 1, cont: true, text: 'A gdy usiadł, przystąpili do Niego Jego uczniowie.' },
    { v: 2 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKY.morning);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 150, len: 800 });
    const cls = [[420, 170, 200], [1010, 120, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

    const birds = flock(S, S.layer({ par: 0.06, sh: 3 }), 3, (cc) => bird(cc), { y: 250, spread: 90, speed: 40, scale: 0.55 });

    /* the far shore and the lake */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 352, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12), x0: -1400, x1: 3000 });
    far.add(fb.markup + town(c, { x: 1320, y: fb.fn(1320) + 12, n: 7, spread: 240, sc: 0.4 }));
    const lakeL = S.layer({ par: 0.12, sh: 1 });
    lakeL.add(waterBand(c, { y: 376, color: mix(C.lake, C.skyBlue, 0.25), foamN: 26, bottom: 1200, x0: -1400, x1: 3000 }).markup);
    const sails = [[300, 420, 0.5], [1340, 430, 0.44]].map(([x, y, s], i) => ({ x, y, s, i, el: lakeL.add(`<g>${smallSail(c, { w: 60 })}</g>`) }));

    /* the mountain with its winding path */
    const P = 0.55;
    const mtL = S.layer({ par: P, sh: 3 });
    const mfn = (x) => 452 + Math.min(1, Math.abs(x - 800) / 720) ** 1.7 * 240 + Math.sin(x * 0.011) * 4;
    const m = sheet();
    m.p(c.ridge(mfn, -1400, 3000, 1800, 12, 1.2), mix(C.hillNear, C.sage2, 0.3));
    // terraces and shadows on the flanks
    let terr = '';
    for (let i = 0; i < 9; i++) { const x0 = c.rr(100, 1300), y = mfn(x0) + c.rr(40, 200); terr += c.ribbon([[x0, y], [x0 + c.rr(120, 260), y + c.rr(-10, 10)]], 2.4); }
    m.x(terr, shade(C.hillNear, -0.12), 'opacity=".55"');
    m.p(c.ribbon(PATH.map(([x, y]) => [x, y + 3]), (u) => 26 - u * 16, 1.6), mix(C.sand, C.cream, 0.3));
    mtL.add(m.out());
    mtL.add(olive(c, 330, mfn(330) + 40, 0.7) + olive(c, 1250, mfn(1250) + 30, 0.75) + olive(c, 980, mfn(980) + 70, 0.5) + cypress(c, 640, mfn(640) + 26, 70) + cypress(c, 1120, mfn(1120) + 20, 90) + bush(c, 880, 560, 60, C.sage, C.moss) + bush(c, 430, 640, 70, C.moss, C.sage));
    mtL.add(grass(c, { x0: -600, x1: 2200, y: 700, fn: (x) => mfn(x) + 6, n: 60, h: 11, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 700, fn: (x) => mfn(x) + c.rr(20, 260), n: 22, h: 14 }));
    mtL.add(`<g transform="translate(${TOP[0]} ${TOP[1] + 4}) scale(.5)">${seatRock(c)}</g>`);

    /* the crowds: standing groups on the shore, then seated on the slopes */
    const crowdL = S.layer({ par: P, sh: 4 });
    const PH = S.portrait;
    // phone: the groups gather and sit closer in, so the crowds He sees stay on the narrow screen
    const inX = (x, k) => (PH ? 800 + (x - 800) * k : x);
    const G = [
      { a: [250, 716], b: [470, 612], s0: 0.62 }, { a: [370, 752], b: [560, 664], s0: 0.64 }, { a: [120, 740], b: [360, 690], s0: 0.64 },
      { a: [1190, 712], b: [1020, 606], s0: 0.62 }, { a: [1310, 748], b: [1110, 660], s0: 0.64 }, { a: [1450, 716], b: [1220, 700], s0: 0.62 },
      { a: [-40, 720], b: [640, 700], s0: 0.62 }, { a: [1080, 756], b: [930, 690], s0: 0.64 },
    ].map((g0, i) => {
      const g = { ...g0, a: [inX(g0.a[0], 0.6), g0.a[1]], b: [inX(g0.b[0], 0.6), g0.b[1]] };
      const flip = g.b[0] > 800;
      const mem = Array.from({ length: 3 + (i % 2) }, (_, k) => ({ x: (k - 1.2) * 34 + c.rr(-6, 6), y: c.rr(-5, 5), s: c.rr(0.92, 1.05), flip, o: folk(c, (k + i) % 3 !== 0) }));
      const st = crowdL.add(`<g>${group(c, mem)}</g>`);
      const si = crowdL.add(`<g>${group(c, mem.map((q) => ({ ...q, o: { ...q.o, pose: 'sit' } })))}</g>`);
      return { ...g, i, st, si, seed: c.rr(0, 9) };
    });

    /* Jesus and the four */
    const act = S.layer({ par: P, sh: 5 });
    const glow = act.add(`<g><circle r="220" fill="url(#halo-glow)"/></g>`);
    const SEAT = [[-78, 10, CAST.andrew, false], [-44, 18, CAST.peter, false], [44, 18, CAST.john, true], [78, 10, CAST.james, true]];
    const dis = SEAT.map(([dx, dy, o, flip], i) => ({ dx, dy, flip, i, seed: c.rr(0, 9), w: S.puppet(act.add(person(c, o))), s: S.puppet(act.add(person(c, { ...o, pose: 'sit' }))) }));
    const jW = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const jS = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(act, c, { n: 3, r: 22, w: 3.4, color: shade(C.ochre, 0.3) });

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 60, 960, 260, C.sage, C.moss) + bush(c, 1560, 960, 260, C.moss, C.sage) + bough8(c, 1400, -70));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      pose(sunEl, { x: 1230, y: 150, r: Math.sin(T * 0.6) });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(T * 0.1 + cl.i) * 24, y: cl.y, r: Math.sin(T * 0.6 + cl.i) * 1.2 }));
      birds(T || 20);
      sails.forEach((s) => pose(s.el, { x: s.x + Math.sin(T * 0.08 + s.i) * 30, y: s.y, s: s.s, r: Math.sin(T * 0.9 + s.i) * 2 }));

      /* v1a — He sees the crowds (they are gathering), then goes up the mountain */
      const gather = es(t, 0.4, 1.4);
      const climb = es(t, 1.3, 2.1, (x) => x);
      const [jx, jy, dir] = along(PATH, climb);
      const look = es(t, 1.02, 1.2) * (1 - es(t, 1.28, 1.36));
      const sitK = es(t, 2.14, 2.21);
      jW.set({ x: jx, y: jy, s: lerp(0.62, 0.44, climb), flip: climb > 0.001 ? dir < 0 : false, walk: climb > 0.001 && climb < 0.999 ? climb * 60 : undefined, amt: 0.8, armF: 10 + look * 70, head: -look * 6, o: 1 - sitK, blink: blinkAt(T, 1) });

      /* v1b — He sits; the four come up after Him and sit close */
      const teachK = es(t, 3.05, 3.4);
      jS.set({ x: TOP[0], y: TOP[1] + 2, s: 0.46, o: sitK, armF: 20 + teachK * 60, armB: 10 + teachK * 30, head: -2, blink: blinkAt(T, 1) });
      dis.forEach((d) => {
        // they come along the shore after Him (v1a) and wait at the foot; then climb after Him (v1b)
        const wx = (PH ? 480 : 330) + d.i * 34, wy = 760 - d.i * 6;   // phone: they wait at the foot of the path, on screen
        const arrive = es(t, 0.75 + d.i * 0.05, 1.3 + d.i * 0.04, (x) => x);
        const u = es(t, 1.9 + d.i * 0.06, 2.52 + d.i * 0.03, (x) => x);
        const DP = [[wx, wy], ...PATH.slice(1)];
        let [px, py, pdir] = along(DP, u);
        if (u <= 0) { px = lerp(-120 - d.i * 50, wx, arrive); py = wy; pdir = 1; }
        const k2 = es(t, 2.5 + d.i * 0.03, 2.62 + d.i * 0.03);
        const x = lerp(px, TOP[0] + d.dx, k2), y = lerp(py, TOP[1] + d.dy, k2);
        const sk_ = es(t, 2.62 + d.i * 0.02, 2.69 + d.i * 0.02);
        const moving_ = (arrive > 0 && arrive < 1) || (u > 0 && sk_ < 1);
        const watch = es(t, 1.3, 1.5) * (1 - es(t, 1.9, 2.0));
        d.w.set({ x, y, s: lerp(0.56, 0.42, u), flip: k2 > 0.5 ? d.dx > 0 : pdir < 0, walk: moving_ ? (u > 0 ? u * 60 : arrive * 20) + d.i : undefined, amt: 0.8, head: -watch * 10, armF: watch * 30 * (d.i % 2), o: 1 - sk_, blink: blinkAt(T, d.seed) });
        d.s.set({ x: TOP[0] + d.dx, y: TOP[1] + d.dy, s: 0.42, flip: d.flip, o: sk_, armF: 20 + (d.i % 2) * 14, head: -4 - teachK * 4, blink: blinkAt(T, d.seed) });
      });

      /* the crowds: gathering on the shore (v1a), coming up and sitting on the slopes (v1b) */
      G.forEach((g) => {
        const up = es(t, 2.05 + (g.i % 4) * 0.06, 2.6 + (g.i % 4) * 0.04);
        const sitG = es(t, 2.62 + (g.i % 4) * 0.02, 2.69 + (g.i % 4) * 0.02);
        const x0 = g.a[0] + (1 - gather) * (g.a[0] < 800 ? -260 : 260);
        const x = lerp(x0, g.b[0], up), y = lerp(g.a[1], g.b[1], up);
        const s = lerp(g.s0, 0.5, up);
        const walking = (gather > 0 && gather < 1) || (up > 0 && up < 1);
        pose(g.st, { x, y: y - (walking ? Math.abs(Math.sin(x * 0.05 + g.i)) * 3 : 0), s, sx: 1, o: 1 - sitG });
        pose(g.si, { x: g.b[0], y: g.b[1], s: 0.5, o: sitG });
      });

      /* v2 — He opened His mouth and taught them */
      voice(TOP[0] + 2, TOP[1] - 50, teachK, T, { s0: 0.6, spread: 3.2 });
      pose(glow, { x: TOP[0], y: TOP[1] - 40, s: 0.5 + teachK * 0.7, o: teachK * 0.7 });

      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.04 + es(t, 2.2, 3.6) * 0.46;
      S.cam.y = lerp(30, 0, es(t, 1.2, 2.2)) - es(t, 2.4, 3.6) * 50;
      S.cam.x = lerp(-20, 0, es(t, 1.2, 2.2));
    };
  },
};
