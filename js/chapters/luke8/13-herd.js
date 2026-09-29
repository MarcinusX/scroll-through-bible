// Łk 8,32–33 — up on the mountain behind the shore a great herd of pigs is feeding, knot after knot along the
// ridge, with two herdsmen and their staffs. The little dark spirits of the legion lean towards them and beg: "Let us
// go into them!" — and Jesus lets them. They pour out of the man, who sinks down quiet on the sand, and stream up
// into the herd; the pigs start and jostle — and the whole herd rushes along the ridge to where it breaks off, down
// the steep bank into the lake, splash after splash, until only rings are left on the water.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, grass, rock, reeds, olive } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { L5, WILD, herd, spirit, cry, staff, dust, headAt, hand, still, tr, PI } from './lib.js';

const JX = 690, FEET = 716, MX = 860;
const EDGE = [1160, 392];            // where the ridge breaks off
const WATER = [1250, 486];           // where the steep bank meets the lake

export default {
  id: 'lk8-herd',
  beats: [
    { v: 32, text: 'A była tam duża trzoda świń, pasących się na górze.' },
    { v: 32, cont: true, text: 'Prosiły Go więc [złe duchy], żeby im pozwolił wejść w nie.' },
    { v: 32, cont: true, text: 'I pozwolił im.' },
    { v: 33, text: 'Wtedy złe duchy wyszły z człowieka i weszły w świnie,' },
    { v: 33, cont: true, text: 'a trzoda ruszyła pędem po urwistym zboczu do jeziora i utonęła.' },
  ],
  cam: { x: [-40, 80], y: [-80, 60], z: [0.98, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#c3d8da', '#f0e3c8', '#f6e4c2'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 420, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 900, y: 120, len: 620 });

    /* far hills, the lake, the mountain with its steep bank on the right */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [14, 6, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.2, sh: 2 });
    lakeL.add(waterBand(c, { y: 450, color: C.lake, foamN: 22 }).markup);
    const ripples = [0, 1, 2, 3, 4].map(() => lakeL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 50, 10, 0, PI * 2, 24), 2.4)}" fill="${C.foam}"/></g>`));
    const mtL = S.layer({ par: 0.25, sh: 4 });
    const ridge = (x) => Math.min(640, 384 - 18 * Math.exp(-Math.pow((x - 900) / 220, 2)) + Math.sin(x / 120) * 5 + Math.sin(x / 47) * 2 + Math.max(0, 660 - x) * 0.62);
    const mpts = [[-900, 1700], [-900, ridge(-900)]];
    for (let x = -880; x <= EDGE[0] - 10; x += 16) mpts.push([x, ridge(x) + c.rr(-1.5, 1.5)]);
    mpts.push(EDGE, [EDGE[0] + 18, 414], [EDGE[0] + 40, 440], [EDGE[0] + 66, 466], [WATER[0], WATER[1] - 4], [WATER[0] + 40, 520], [WATER[0] + 40, 1700]);
    const ms = sheet().p(c.cut(mpts, 1, 10), mix(C.hillMid, C.sage2, 0.4));
    ms.p(c.cut([[EDGE[0], EDGE[1] + 2], [EDGE[0] + 18, 414], [EDGE[0] + 40, 440], [EDGE[0] + 66, 466], [WATER[0], WATER[1] - 4], [WATER[0] + 30, 520], [EDGE[0] + 50, 520], [EDGE[0] + 24, 480], [EDGE[0] + 6, 440], [EDGE[0] - 14, 410]], 1.2, 7), mix(C.rock, C.clay, 0.25));
    // the lower slopes: a lighter band with olives
    const lfn = (x) => Math.min(660, 520 + Math.sin(x / 150) * 10 + Math.max(0, 560 - x) * 0.5);
    const lp = [[-900, 1700]];
    for (let x = -900; x <= EDGE[0] - 40; x += 16) lp.push([x, lfn(x) + c.rr(-1.2, 1.2)]);
    lp.push([EDGE[0] + 20, 540], [EDGE[0] + 30, 1700]);
    ms.p(c.cut(lp, 1, 8), mix(C.hillNear, C.sage, 0.3));
    let cracks = '';
    for (let i = 0; i < 6; i++) { const y = c.rr(410, 500), x = EDGE[0] + (y - 390) * 0.8 + c.rr(-10, 6); cracks += c.ribbon([[x, y], [x + c.rr(-10, 10), y + c.rr(12, 26)]], c.rr(1.4, 2.4)); }
    ms.x(cracks, shade(C.rock2, -0.2), 'opacity=".5"');
    mtL.add(ms.out());
    mtL.add(grass(c, { x0: 300, x1: EDGE[0] - 20, y: 380, fn: ridge, n: 40, h: 10, color: C.olive }) + olive(c, 560, 540, 0.6) + olive(c, 820, 536, 0.7) + olive(c, 1060, 540, 0.55) + grass(c, { x0: -600, x1: EDGE[0] - 40, y: 520, fn: (x) => Math.min(660, 520 + Math.sin(x / 150) * 10 + Math.max(0, 560 - x) * 0.5), n: 40, h: 12, color: C.moss }));
    const clusters = [];
    for (let i = 0; i < 20; i++) {
      const row = i % 2, x = 660 + Math.floor(i / 2) * 48 + row * 24 + c.rr(-8, 8), y = ridge(x) + 16 + row * 30 + c.rr(-4, 4);
      clusters.push({ i, x, y, el: mtL.add(`<g opacity="0">${herd(c, 9, 66, 18, { sc: 0.46, face: 1 })}</g>`), d: ((EDGE[0] - x) / 500) * 0.4 + c.rr(0, 0.05), jit: c.rr(0, 6) });
    }
    const HERD = [L5.herdsman, L5.herdsman2].map((o, i) => ({ i, x: [590, 630][i], p: S.puppet(mtL.add(person(c, { ...o, holdF: `<g transform="rotate(-10)">${staff(c, 190)}</g>` }))), seed: c.rr(0, 9) }));
    const puffs = [0, 1, 2, 3, 4].map(() => mtL.add(`<g opacity="0">${dust(c, 24, C.sand2)}</g>`));
    const splashes = [0, 1, 2, 3, 4, 5].map(() => mtL.add(`<g opacity="0">${sheet().x([0, 1, 2, 3, 4].map((k) => c.cut([[-3, 0], [-6 + k * 3 - 6, -20 - (k % 2) * 12], [0, -26 - (k === 2 ? 14 : 0)], [6, 0]].map(([x, y]) => [x + (k - 2) * 7, y]), 0.3, 3)).join(''), C.foam).out(false)}</g>`));

    /* the beach in front, the boat, the disciples */
    const beach = S.layer({ par: 0.45, sh: 3 });
    const bfn = (x) => 626 + Math.max(0, 440 - x) * 0.8 + Math.sin(x / 150) * 5;
    const bp = [];
    for (let x = 100; x <= 2500; x += 14) bp.push([x, bfn(x) + c.rr(-1.2, 1.2)]);
    bp.push([2500, 1700], [100, 1700]);
    beach.add(waterBand(c, { y: 650, x1: 700, color: C.lake2, foamN: 10, amp: 2 }).markup);
    beach.add(sheet().p(c.poly(bp), C.sand).out() + grass(c, { x0: 500, x1: 2000, y: 630, fn: bfn, n: 16, h: 12, color: C.olive }) + rock(c, 1180, 690, 90, 36, C.rock2));
    const B = boat(c, {});
    beach.add(`<g transform="translate(390 734) scale(.88)">${B.back}${still(c, [CAST.james, CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ x: -110 + i * 56, y: 2, s: 0.92, flip: false, armF: 14 + (i % 2) * 20, armB: 8, head: -8, o })))}${B.front}</g>`);

    /* Jesus and the man */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const man = S.puppet(pL.add(person(c, { ...WILD, pose: 'kneel' })));
    const manSit = S.puppet(pL.add(person(c, { ...WILD, pose: 'sit', eyes: 'closed' })));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));

    /* the spirits */
    const swL = S.layer({ par: 0.4, sh: 3 });
    const beg = swL.add(`<g opacity="0">${cry(c, [tr('Pozwól nam', 'Let us'), tr('wejść w nie!', 'go into them!')], { size: 20, dir: -1 })}</g>`);
    const imps = Array.from({ length: 22 }, (_, i) => {
      const cl = clusters[i % clusters.length];
      return { i, cl, el: swL.add(`<g opacity="0">${spirit(c, c.rr(0.7, 1.0))}</g>`), ph: c.rr(0, 6), home: [900 + (i % 6) * 36 + c.rr(-8, 8), 480 + Math.floor(i / 6) * 40 + c.rr(-8, 8)], d: c.rr(0, 0.3) };
    });

    const rushPos = (cl, u) => {
      const pts = [[cl.x, cl.y], [EDGE[0] - 12, EDGE[1] + 14], [EDGE[0] + 50, 400], [WATER[0] - 6, WATER[1] + 2]];
      const lens = [];
      let tot = 0;
      for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); tot += l; }
      let d = u * tot;
      for (let i = 0; i < lens.length; i++) {
        if (d <= lens[i] || i === lens.length - 1) { const k = Math.min(1, d / lens[i]); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), i > 0 ? 48 : 0]; }
        d -= lens[i];
      }
      return [...pts[pts.length - 1], 48];
    };

    return (t, time) => {
      const T = time;
      swing(sunEl, 420, 150, T, 1.1, 0.7);
      swing(cl1, 900 + Math.sin(T * 0.1) * 24, 120, T, 1.4, 0.6, 1);

      /* v32a — the herd feeding on the mountain */
      const enter = es(t, 3.25, 3.9);
      clusters.forEach((cl) => {
        const inK = es(t, 0.05 + cl.i * 0.02, 0.35 + cl.i * 0.02);
        const u = es(t, 4.05 + cl.d, 4.7 + cl.d, (x) => x * x * (1.6 - 0.6 * x));
        const [x, y, r] = u > 0 ? rushPos(cl, u) : [cl.x, cl.y, 0];
        const jit = T ? enter * (1 - u) * Math.sin(T * 30 + cl.jit) * 2 : 0;
        const gone = seg(t, 4.62 + cl.d, 4.7 + cl.d);
        pose(cl.el, { x: x + jit, y: y - (u > 0 && u < 1 ? Math.abs(Math.sin(t * 40 + cl.jit)) * 3 : 0) + (1 - inK) * 10, r, s: 1, o: inK * (1 - gone) });
      });
      HERD.forEach((h) => {
        const alarm = es(t, 3.4, 3.6), run = es(t, 4.1, 5.0);
        h.p.set({ x: h.x - run * 30 * (h.i ? 1 : 0.5), y: ridge(h.x) + 12, s: 0.5, flip: alarm > 0.5 ? h.i === 1 : false, armF: 40 + alarm * 30, armB: 20 + alarm * (130 + (T ? Math.sin(T * 30 + h.i) * 20 : 0)), head: -alarm * 8, blink: blinkAt(T, h.seed) });
      });
      puffs.forEach((p, i) => { const k = seg(t, 4.1 + i * 0.12, 4.5 + i * 0.12); pose(p, { x: 700 + i * 90, y: ridge(700 + i * 90) + 10 - k * 20, s: 0.5 + k, o: bump(t, 4.1 + i * 0.12, 4.5 + i * 0.12) * 0.8 }); });
      splashes.forEach((sp, i) => { const a = 4.55 + i * 0.07; const k = seg(t, a, a + 0.3); pose(sp, { x: WATER[0] - 10 + (i % 3) * 22, y: WATER[1] + 4, s: 0.5 + Math.sin(k * PI) * 1.1, sy: 0.4 + Math.sin(k * PI) * 1.2, o: k > 0 && k < 1 ? 1 : 0 }); });
      ripples.forEach((r, i) => { const k = seg(t, 4.65 + i * 0.07, 5.0 + i * 0.03); pose(r, { x: WATER[0] + (i % 2) * 24, y: WATER[1] + 8, s: 0.3 + k * 2.2, sy: 0.3 + k * 0.5, o: (1 - k) * 0.8 * (k > 0 ? 1 : 0) }); });

      /* v32b — the spirits beg; v32c — He lets them */
      const permit = es(t, 2.05, 2.35) * (1 - es(t, 3.9, 4.2));
      jesus.set({ x: JX, y: FEET, s: 1.0, armF: 16 + permit * 110 + bump(t, 0.2, 0.9) * 20, armB: 8 + permit * 16, head: -permit * 16 - es(t, 4.0, 4.4) * 6, blink: blinkAt(T) });
      const freed = es(t, 3.5, 3.58);
      man.set({ x: MX, y: FEET + 4, s: 1.0, flip: true, o: 1 - freed, armF: 70 + bump(t, 1.0, 2.0) * 20, armB: 60, lean: 12, head: -6, blink: blinkAt(T, 4) });
      manSit.set({ x: MX + 4, y: FEET + 6, s: 1.0, flip: true, o: freed, armF: 26, armB: 18, lean: 6 - es(t, 3.6, 4.4) * 6, head: 10 - es(t, 4.4, 4.9) * 10 });
      const bb = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(beg, { x: 1010, y: 440, s: bb, r: bb > 0.02 && T ? Math.sin(T * 7) * 2 : 0, o: bb > 0.02 ? 1 : 0 });
      /* v33a — out of the man and into the pigs */
      imps.forEach((m) => {
        const fly = es(t, 3.05 + m.d, 3.7 + m.d, ease.io);
        const ph = (t < 3.8 && T ? T : 0) * 1.3 + m.ph;
        const tx = m.cl.x, ty = m.cl.y - 10;
        const lean = es(t, 1.1, 1.4) * (1 - fly) * 14;
        const x = lerp(m.home[0], tx, fly), y = lerp(m.home[1], ty, fly) - Math.sin(fly * PI) * 120;
        pose(m.el, { x: x + Math.cos(ph) * 7 * (1 - fly), y: y + Math.sin(ph * 1.2) * 6 * (1 - fly), r: Math.sin(ph) * 10 - lean, s: 1 - fly * 0.55, o: seg(t, 0.02, 0.1) * (1 - seg(t, 3.6 + m.d, 3.75 + m.d)) });
      });

      S.cam.y = 30 - es(t, 0.05, 0.6) * 50 + es(t, 1.0, 1.5) * 30 - es(t, 3.0, 3.5) * 20 + es(t, 4.7, 5.0) * 10;
      S.cam.x = es(t, 3.8, 4.4) * 60;
      S.cam.z = 1.06 - es(t, 3.9, 4.4) * 0.06;
    };
  },
};
