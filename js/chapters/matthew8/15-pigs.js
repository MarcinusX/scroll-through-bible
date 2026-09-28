// Mt 8,30–32 — the mountain above the lake (the same steep bank as in Mark 5). Far off along the ridge a great herd of
// pigs is grazing with its herdsmen. Round the two kneeling men little shadow-spirits swarm and beg: "If you cast us
// out, send us into the herd of pigs!" — "Go!" says Jesus, pointing; the shadows stream up the mountainside into the
// herd, the two men sink down free and quiet, and the whole herd rushes along the ridge, over the edge, down the steep
// bank into the lake — splashes, then rings on the water.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, grass, rock, reeds, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { L5 as LOOK, WILD2, kf, herd, spirit, cry, bubble, staff, dust, headAt, glyphTag } from './lib.js';

const PI = Math.PI;
const JX = 820, FEET = 724, MX = 670;
const EDGE = [650, 318];              // where the ridge breaks off
const WATER = [548, 482];             // where the steep bank meets the lake

export default {
  id: 'mt8-pigs',
  beats: [
    { v: 30 },
    { v: 31 },
    { v: 32, text: 'Rzekł do nich: «Idźcie!»' },
    { v: 32, cont: true, text: 'Wyszły więc i weszły w świnie.' },
    { v: 32, cont: true, text: 'I naraz cała trzoda ruszyła pędem po urwistym zboczu do jeziora i zginęła w falach.' },
  ],
  cam: { x: [-80, 40], y: [-80, 70], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#c3d8da', '#f0e3c8', '#f6e4c2'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 420, y: 140, len: 620 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1000, y: 110, len: 620 });

    /* ---------- far hills, the lake, the mountain with its steep bank ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [14, 6, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.2, sh: 2 });
    lakeL.add(waterBand(c, { y: 450, color: C.lake, foamN: 22 }).markup);
    const ripples = [0, 1, 2, 3, 4].map((i) => lakeL.add(`<path d="${c.ribbon(c.arc(0, 0, 50, 10, 0, PI * 2, 24), 2.4)}" fill="${C.foam}"/>`));

    const mtL = S.layer({ par: 0.25, sh: 4 });
    const ridge = (x) => 306 - 34 * Math.exp(-Math.pow((x - 980) / 320, 2)) + Math.sin(x / 120) * 6 + Math.sin(x / 47) * 2 + Math.max(0, x - 1500) * 0.04;
    const mpts = [[WATER[0] - 40, 520], [WATER[0], WATER[1] - 6], [580, 430], [598, 390], [622, 350], EDGE];
    for (let x = EDGE[0] + 10; x <= 2500; x += 16) mpts.push([x, ridge(x) + c.rr(-1.5, 1.5)]);
    mpts.push([2500, 1700], [WATER[0] - 40, 1700]);
    const ms = sheet().p(c.cut(mpts, 1, 10), mix(C.hillMid, C.sage2, 0.4));
    // the bare rock of the steep bank
    ms.p(c.cut([[WATER[0] - 30, 520], [WATER[0], WATER[1] - 6], [580, 430], [598, 390], [622, 350], [EDGE[0], EDGE[1] + 2], [668, 360], [640, 420], [620, 470], [610, 540]], 1.2, 7), mix(C.rock, C.clay, 0.25));
    let cracks = '';
    for (let i = 0; i < 7; i++) { const y = c.rr(350, 500), x = 640 - (y - 330) * 0.55 + c.rr(-6, 10); cracks += c.ribbon([[x, y], [x + c.rr(-10, 10), y + c.rr(12, 26)]], c.rr(1.4, 2.4)); }
    ms.x(cracks, shade(C.rock2, -0.2), 'opacity=".5"');
    mtL.add(ms.out());
    mtL.add(grass(c, { x0: 680, x1: 2200, y: 300, fn: ridge, n: 40, h: 10, color: C.olive }) + olive(c, 1360, ridge(1360) + 6, 0.55) + olive(c, 1480, ridge(1480) + 8, 0.45));
    // the herd: knots of little pigs along the ridge
    const clusters = [];
    for (let i = 0; i < 22; i++) {
      const row = i % 2, x = 700 + Math.floor(i / 2) * 64 + row * 30 + c.rr(-10, 10), y = ridge(x) + 18 + row * 34 + c.rr(-4, 4);
      const el = mtL.add(`<g>${herd(c, 9, 66, 18, { sc: 0.46, face: -1 })}</g>`);
      clusters.push({ i, el, x, y, d: ((x - 700) / 700) * 0.5 + c.rr(0, 0.05), jit: c.rr(0, 6) });
    }
    // the lower slopes, nearer
    const slopeL = S.layer({ par: 0.33, sh: 3 });
    const lfn = (x) => 500 + Math.sin(x / 170) * 12 + Math.sin(x / 61) * 4 - Math.max(0, x - 1300) * 0.05;
    const lp = [[620, 560], [640, 520], [680, lfn(680) + 4]];
    for (let x = 700; x <= 2500; x += 16) lp.push([x, lfn(x) + c.rr(-1.5, 1.5)]);
    lp.push([2500, 1700], [600, 1700]);
    slopeL.add(sheet().p(c.cut(lp, 1, 10), mix(C.hillNear, C.sage, 0.3)).out());
    slopeL.add(olive(c, 760, lfn(760) + 8, 0.7) + olive(c, 1150, lfn(1150) + 8, 0.8) + olive(c, 1480, lfn(1480) + 8, 0.6) + rock(c, 930, lfn(930) + 14, 70, 30, C.rock2) + grass(c, { x0: 660, x1: 2200, y: 500, fn: lfn, n: 26, h: 12, color: C.moss }));
    // the herdsmen with their staffs
    const HERD = [LOOK.herdsman, LOOK.herdsman2].map((o, i) => ({ i, x: [1110, 1200][i], p: S.puppet(mtL.add(person(c, { ...o, holdF: `<g transform="rotate(-10)">${staff(c, 190)}</g>` }))), seed: c.rr(0, 9) }));
    const puffs = [0, 1, 2, 3, 4].map((i) => mtL.add(`<g>${dust(c, 24, C.sand2)}</g>`));
    const splashes = [0, 1, 2, 3, 4, 5].map((i) => mtL.add(`<g>${sheet().x([0, 1, 2, 3, 4].map((k) => c.cut([[-3, 0], [-6 + k * 3 - 6, -20 - (k % 2) * 12], [0, -26 - (k === 2 ? 14 : 0)], [6, 0]].map(([x, y]) => [x + (k - 2) * 7, y]), 0.3, 3)).join(''), C.foam).out(false)}</g>`));

    /* ---------- the beach in front ---------- */
    const beach = S.layer({ par: 0.45, sh: 3 });
    const bfn = (x) => 616 + Math.max(0, 420 - x) * 0.8 + Math.sin(x / 150) * 5;
    beach.add(waterBand(c, { y: 640, x1: 800, color: C.lake2, foamN: 10, amp: 2 }).markup);
    const bp = [];
    for (let x = 100; x <= 2500; x += 14) bp.push([x, bfn(x) + c.rr(-1.2, 1.2)]);
    bp.push([2500, 1700], [100, 1700]);
    beach.add(sheet().p(c.poly(bp), C.sand).out());
    beach.add(grass(c, { x0: 500, x1: 2000, y: 620, fn: bfn, n: 16, h: 12, color: C.olive }) + rock(c, 1260, 690, 90, 36, C.rock2) + reeds(c, 330, 700, 9, 90));

    /* ---------- people ---------- */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.james, CAST.andrew].map((cast, i) => ({ i, x: 990 + i * 58, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, { ...cast }))) }));
    const MEN = [LOOK.wild, WILD2].map((o, i) => ({ i, k: S.puppet(pL.add(person(c, { ...o, pose: 'kneel' }))), s: S.puppet(pL.add(person(c, { ...o, pose: 'sit', eyes: 'closed' }))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));

    /* ---------- the spirits ---------- */
    const swL = S.layer({ par: 0.4, sh: 3 });
    const beg = swL.add(`<g>${cry(c, [tr('Jeżeli nas wyrzucasz,', 'If you cast us out,'), tr('poślij nas w tę trzodę świń!', 'send us into the herd of pigs!')], { size: 19, dir: 1 })}</g>`);
    const goW = swL.add(`<g opacity="0">${bubble(c, tr('Idźcie!', 'Go!'), { size: 30, fill: C.halo, dir: -1 })}</g>`);
    const imps = Array.from({ length: 26 }, (_, i) => {
      const cl = clusters[i % clusters.length];
      return { i, cl, el: swL.add(`<g>${spirit(c, c.rr(0.7, 1.05))}</g>`), ph: c.rr(0, 6), home: [lerp(470, 700, (i * 7 % 26) / 26) + c.rr(-16, 16), c.rr(440, 560)], d: c.rr(0, 0.4) };
    });
    const bangs = [0, 1, 2, 3].map((i) => swL.add(`<g>${glyphTag(c, '!', { size: 20 })}</g>`));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1440, 960, 260, 100, C.rock2) + reeds(c, 160, 940, 14, 220, C.moss) + rock(c, 250, 985, 170, 60, C.rock));

    // the rush: along the ridge to the edge, down the bank, into the water
    const rushPos = (cl, u) => {
      const pts = [[cl.x, cl.y], [EDGE[0] + 12, EDGE[1] + 14], [604, 400], [WATER[0] + 6, WATER[1] + 2]];
      const lens = [];
      let tot = 0;
      for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); tot += l; }
      let d = u * tot;
      for (let i = 0; i < lens.length; i++) {
        if (d <= lens[i] || i === lens.length - 1) { const k = Math.min(1, d / lens[i]); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), i > 0 ? -48 : 0]; }
        d -= lens[i];
      }
      return pts[pts.length - 1];
    };

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#c9dfdc', '#f2e8cf', '#f7ead2'], seg(t, 0, 6));
      swing(sunEl, 1260, 140, T, 1.1, 0.7);
      swing(cl1, 420 + Math.sin(T * 0.1) * 24, 140, T, 1.4, 0.6, 1);
      swing(cl2, 1000 + Math.sin(T * 0.12 + 2) * 24, 110, T, 1.4, 0.8, 2);

      /* the herd: grazing → the spirits enter → the rush */
      const enter = es(t, 3.2, 3.9);
      clusters.forEach((cl) => {
        const u = es(t, 4.05 + cl.d, 4.75 + cl.d, (x) => x * x * (1.6 - 0.6 * x));
        const [x, y, r] = u > 0 ? rushPos(cl, u) : [cl.x, cl.y, 0];
        const jit = enter * (1 - u) * Math.sin(t * 60 + cl.jit) * 2;
        const gone = seg(t, 4.66 + cl.d, 4.74 + cl.d);
        pose(cl.el, { x: x + jit, y: y - Math.abs(Math.sin(t * 40 + cl.jit)) * 3 * (u > 0 && u < 1 ? 1 : 0), r, s: 1, o: 1 - gone });
      });
      puffs.forEach((p, i) => {
        const k = seg(t, 4.1 + i * 0.12, 4.5 + i * 0.12);
        pose(p, { x: 1000 - i * 70, y: ridge(1000 - i * 70) + 10 - k * 20, s: 0.5 + k, o: bump(t, 4.1 + i * 0.12, 4.5 + i * 0.12) * 0.8 });
      });
      splashes.forEach((sp, i) => {
        const a = 4.6 + i * 0.1 + (i > 2 ? 0.1 : 0);
        const k = seg(t, a, a + 0.35);
        pose(sp, { x: WATER[0] - 10 + (i % 3) * 22 - 20, y: WATER[1] + 4, s: 0.5 + Math.sin(k * PI) * 1.1, sy: 0.4 + Math.sin(k * PI) * 1.2, o: k > 0 && k < 1 ? 1 : 0 });
      });
      ripples.forEach((r, i) => {
        const k = seg(t, 4.7 + i * 0.16, 5.6 + i * 0.16);
        pose(r, { x: WATER[0] - 14 + (i % 2) * 20, y: WATER[1] + 6, s: 0.3 + k * 2.2, sy: 0.3 + k * 0.5, o: (1 - k) * 0.8 * (k > 0 ? 1 : 0) });
      });

      HERD.forEach((h) => {
        const alarm = es(t, 3.4, 3.6);
        const run = es(t, 4.1, 5.0);
        h.p.set({ x: h.x + (h.i ? 1 : -1) * run * 30, y: ridge(h.x) + 12, s: 0.44, flip: alarm > 0.5 ? h.i === 0 : true, armF: 40 + alarm * 30, armB: 20 + alarm * (130 + Math.sin(t * 30 + h.i) * 20), head: -alarm * 8, lean: -run * 4, blink: blinkAt(T, h.seed) });
      });

      /* the spirits: beg → turn toward the herd → stream up into it */
      const permit = es(t, 2.05, 2.35);
      imps.forEach((m) => {
        const fly = es(t, 3.05 + m.d, 3.75 + m.d, ease.io);
        const ph = (t < 3.85 ? T : 0) * 1.3 + m.ph;
        const tx = m.cl.x, ty = m.cl.y - 10;
        const x = lerp(m.home[0], tx, fly), y = lerp(m.home[1], ty, fly) - Math.sin(fly * PI) * 120;
        const lean = permit * (1 - fly) * -12;
        pose(m.el, { x: x + Math.cos(ph) * 7 * (1 - fly), y: y + Math.sin(ph * 1.2) * 6 * (1 - fly), r: Math.sin(ph) * 10 + lean, s: 1 - fly * 0.55, o: 1 - seg(t, 3.6 + m.d, 3.8 + m.d) });
      });
      const k = es(t, 1.08, 1.28, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(beg, { x: 590, y: 430, s: k, r: k > 0.02 ? Math.sin(T * 7) * 2 : 0, o: k > 0.02 ? 1 : 0 });
      bangs.forEach((b, i) => {
        const cl = clusters[2 + i * 3];
        const q = es(t, 3.55 + i * 0.06, 3.7 + i * 0.06, ease.back) * (1 - es(t, 4.0, 4.1));
        pose(b, { x: cl.x, y: cl.y - 40, s: q, o: q > 0.02 ? 1 : 0 });
      });

      /* Jesus, the man, the disciples */
      const point = es(t, 2.05, 2.35) * (1 - es(t, 3.9, 4.3));
      jesus.set({ x: JX, y: FEET, s: 1, flip: true, armF: 14 + point * 100 + bump(t, 0.3, 1.0) * 20, armB: 8 + point * 20, head: -point * 16 - es(t, 4, 4.4) * 6, blink: blinkAt(T) });
      const freed = es(t, 3.5, 3.58);
      const gb = es(t, 2.08, 2.28, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(goW, { x: JX + 16, y: FEET - 200, s: gb, o: gb > 0.02 ? 1 : 0 });
      MEN.forEach((m) => {
        const x = MX - m.i * 110, y = FEET + m.i * 8;
        m.k.set({ x, y, s: 1 - m.i * 0.04, flip: false, o: 1 - freed, armF: 70 + bump(t, 1, 2) * 20, armB: 60 - m.i * 20, lean: 12, head: -es(t, 0.2, 0.9) * 6, blink: blinkAt(T, 3 + m.i) });
        m.s.set({ x: x - 6, y: y + 2, s: 1 - m.i * 0.04, flip: false, o: freed, armF: 26, armB: 18, lean: 6 - es(t, 3.6, 4.4) * 6, head: 10 - es(t, 4.6, 5.6) * 10 });
      });
      DIS.forEach((d) => {
        const look = es(t, 0.2 + d.i * 0.05, 0.7 + d.i * 0.05);
        const gasp = es(t, 4.1, 4.4);
        d.p.set({ x: d.x, y: FEET - 8 + d.i * 3, s: 0.92, flip: true, armF: 10 + look * (d.i === 1 ? 70 : 0) + gasp * (d.i % 2 ? 40 : 110), armB: 6 + gasp * (d.i % 2 ? 120 : 30), head: -look * 10, blink: blinkAt(T, d.seed) });
      });

      /* camera: tilt up to the mountain, widen for the rush, settle on the calm water */
      S.cam.y = 60 - es(t, 0.1, 0.9) * 100 + es(t, 1, 1.6) * 40 - es(t, 3.0, 3.6) * 40 + es(t, 5.3, 6) * 30;
      S.cam.x = -es(t, 4.0, 4.8) * 50 + es(t, 5.4, 6) * 30;
      S.cam.z = 1.06 - es(t, 0.1, 0.9) * 0.06 + es(t, 1, 1.6) * 0.04 - es(t, 3.9, 4.6) * 0.08 + es(t, 5.3, 6) * 0.04;
    };
  },
};
