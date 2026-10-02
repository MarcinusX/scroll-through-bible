// Mt 10,21–22 — night. Over a village hangs a lit shadow-play screen: a family at its table, a lamp between them.
// A brother rises and points at his brother, and a soldier's shadow leads him away; the father points at his son.
// Then the children stand up against their parents, the parents bow their heads, and the lamp goes out (all in
// shadow, nothing more). The screen goes up: Andrew alone in the dark street, pointing hands and grey murmurs all
// round him because of the Name. But he walks on, up the long road, his little lamp burning, into the dawn — and
// a crown of light waits at the end.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, stars, grass, cypress, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lightCrown } from '../mark8/lib.js';
import { murmur } from '../john6/lib.js';
import { INK, shadowPerson, shadowScreen, handLamp, kf, moving, hand, headAt, PI } from './lib.js';

const GY = 700;
const SW = 560, SH = 290, SX = 800, SY = 150;
const NIGHTS = ['#1a1f45', '#2b3262', '#4a4876'], DAWNS = ['#8d8fb5', '#e3b3a6', '#f4d2ae'];
const ROAD0 = [[520, 712], [700, 700], [880, 672], [1000, 632], [1080, 596], [1130, 566]];
// phone: the hill, the road up it and the crown at its end are drawn narrower (squeezed towards x 800), so that
// Andrew's arrival at the top is not under the thread
const SQ = 0.8, sq = (x) => 800 + (x - 800) * SQ, unsq = (x) => 800 + (x - 800) / SQ;

export default {
  id: 'mt10-family',
  beats: [
    { v: 21, text: 'Brat wyda brata na śmierć i ojciec syna;' },
    { v: 21, cont: true, text: 'dzieci powstaną przeciw rodzicom i o śmierć ich przyprawią.' },
    { v: 22, text: 'Będziecie w nienawiści u wszystkich z powodu mego imienia.' },
    { v: 22, cont: true, text: 'Lecz kto wytrwa do końca, ten będzie zbawiony.' },
  ],
  cam: { x: [-20, 60], y: [-50, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const ROAD = PH ? ROAD0.map(([x, y]) => [sq(x), y]) : ROAD0;
    const sk = sky(S, NIGHTS);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 400, n: 90 }));
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.night, 0.55) }).markup);
    const dawnL = S.layer({ par: 0.06, sh: 1, flat: true });
    dawnL.add(`<circle cx="${PH ? sq(1180) : 1180}" cy="470" r="420" fill="url(#warm-glow)"/>`);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const mh = hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.night, 0.45), trees: 14, treeColor: mix(C.moss2, C.night, 0.4), treeH: 22 });
    mid.add(mh.markup + town(c, { x: 420, y: mh.fn(420) + 20, n: 8, spread: 380, sc: 0.62, wall: mix(C.plaster, C.night, 0.45), shadow: mix(C.plaster2, C.night, 0.5) }));
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn0 = (x) => 700 - Math.max(0, (x - 760) * 0.34);
    const gfn = PH ? (x) => gfn0(unsq(x)) : gfn0;
    const gp = [];
    for (let x = -900; x <= 2500; x += 14) gp.push([x, gfn(x) + c.rr(-1, 1)]);
    gp.push([2500, 1700], [-900, 1700]);
    G.add(sheet().p(c.poly(gp), mix(C.hillNear, C.night, 0.42)).out());
    const L2 = [], R2 = [];
    ROAD.forEach(([x, y], i) => { const w = lerp(34, 8, i / (ROAD.length - 1)); L2.push([x, y - w]); R2.unshift([x, y + w * 0.6]); });
    G.add(sheet().p(c.cut([...L2, ...R2], 0.6, 8), mix(C.sand, C.night, 0.35)).out());
    const CYX = PH ? sq(1230) : 1230;
    G.add(cypress(c, CYX, gfn(CYX) + 6, 120, mix(C.moss2, C.night, 0.4)) + olive(c, 330, 706, 0.8, { leaf: mix(C.olive, C.night, 0.4), leaf2: mix(C.sage, C.night, 0.4), trunk: mix(C.wood2, C.night, 0.3) }));
    const crownEl = G.add(`<g opacity="0">${lightCrown(c, 36)}</g>`);

    /* the shadow screen */
    const scrL = S.layer({ par: 0.3, sh: 6 });
    const scr = scrL.add(`<g>${shadowScreen(c, SW, SH)}<path d="${c.cut([[-SW / 2, SH], [-SW / 2, SH - 34], [SW / 2, SH - 38], [SW / 2, SH]], 0.6, 8)}" fill="${INK}"/><path d="${c.cut([[-120, SH - 34], [-120, SH - 90], [120, SH - 90], [120, SH - 34], [106, SH - 34], [106, SH - 80], [-106, SH - 80], [-106, SH - 34]], 0.4, 6)}" fill="${INK}"/></g>`);
    const dimScr = scrL.add(`<g opacity="0"><rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="${C.night2}" opacity=".55"/></g>`);
    const lampGlow = scrL.add(`<g><circle r="90" fill="url(#warm-glow)"/><path d="M0 0C-6 -6 -5 -14 0 -26C5 -14 6 -6 0 0Z" fill="${C.lampFlame}"/></g>`);
    const sil = (o) => S.puppet(scrL.add(shadowPerson(c, o)));
    const MAN = (h, b) => ({ robe: INK, hairStyle: h, beard: b });
    const FAM = {
      father: { p: sil({ ...MAN('wrap', 'full'), pose: 'sit' }), x: -60 },
      mother: { p: sil({ hairStyle: 'veil', beard: 'none', pose: 'sit' }), x: 60 },
      brotherA: { p: sil(MAN('short', 'short')), x: -210 },
      brotherB: { p: sil(MAN('curly', 'short')), x: -160 },
      son: { p: sil(MAN('short', 'none')), x: 150 },
      kid1: { p: sil({ hairStyle: 'curly', beard: 'none' }), x: 196 },
      kid2: { p: sil({ hairStyle: 'veil', beard: 'none' }), x: 232 },
    };
    const soldiers = [0, 1].map(() => sil({ ...MAN('short', 'short'), holdF: `<path d="M-2 10L2 10L3 -150L-1 -150Z" fill="${INK}"/><path d="M-4 -150L1 -170L6 -150Z" fill="${INK}"/>` }));

    /* the street at night: Andrew, and the people who hate him */
    const P = S.layer({ par: 0.5, sh: 5 });
    const HATERS = [[470, 0.84, false], [560, 0.88, false], [1000, 0.88, true], [1090, 0.84, true], [640, 0.8, false], [940, 0.8, true]].map(([x, s, flip], i) => ({ x: PH ? 800 + (x - 800) * 0.88 : x, s, flip, i, seed: c.rr(0, 9), p: S.puppet(P.add(shadowPerson(c, crowdPerson(c), mix(INK, C.night, 0.3)))) }));
    const andrew = S.puppet(P.add(person(c, { ...CAST.andrew, holdF: `<g transform="rotate(20)">${handLamp(c)}</g>` })));
    const aGlow = P.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    const murs = HATERS.map((h) => P.add(`<g>${murmur(c, { side: h.flip ? -1 : 1 })}</g>`));

    return (t, time) => {
      const T = time;
      /* the screen: down at the start, up after beat 1 */
      const up = es(t, 1.9, 2.2);
      const sy = SY - up * 700;
      pose(scr, { x: SX, y: sy, o: up < 0.99 ? 1 : 0 });
      const lampOn = 1 - es(t, 1.55, 1.7);
      pose(lampGlow, { x: SX, y: sy + SH - 92, s: 0.8 + Math.sin(T * 5) * 0.03, o: lampOn * (up < 0.99 ? 1 : 0) });
      const base = sy + SH - 34, S2 = 0.6;
      pose(dimScr, { x: SX, y: sy, o: es(t, 1.55, 1.75) * (up < 0.99 ? 1 : 0) });
      const on = up < 0.99 ? 1 : 0;
      // brother against brother, father against son (beat 0)
      const pointA = es(t, 0.1, 0.25), leadB = es(t, 0.3, 0.8);
      const f = FAM;
      f.brotherA.p.set({ x: SX + f.brotherA.x, y: base, s: S2, o: on, armF: pointA * 90, head: -4 });
      f.brotherB.p.set({ x: SX + f.brotherB.x + leadB * 360, y: base, s: S2, o: on * (1 - es(t, 0.62, 0.8)), flip: leadB > 0.1, walk: leadB > 0 && leadB < 1 ? t * 30 : undefined, head: 10 });
      const pointF = es(t, 0.45, 0.6), leadS = es(t, 0.6, 0.95);
      f.father.p.set({ x: SX + f.father.x, y: base, s: S2, o: on, armF: pointF * 80 * (1 - es(t, 1.2, 1.35)), head: es(t, 1.3, 1.5) * 16, lean: es(t, 1.3, 1.5) * 8 });
      f.son.p.set({ x: SX + f.son.x + leadS * 90, y: base, s: S2, o: on * (1 - es(t, 0.85, 0.99)), flip: true, walk: leadS > 0 && leadS < 1 ? t * 30 : undefined, head: 10 });
      f.mother.p.set({ x: SX + f.mother.x, y: base, s: S2, o: on, flip: true, armF: 20, head: es(t, 1.3, 1.5) * 16, lean: -es(t, 1.3, 1.5) * 8 });
      // the children against their parents (beat 1)
      const rise = es(t, 1.08, 1.3);
      [f.kid1, f.kid2].forEach((k, i) => k.p.set({ x: SX + k.x - rise * 30, y: base, s: 0.46, o: on, flip: true, armF: rise * 90, head: -rise * 6 }));
      soldiers.forEach((sd, i) => {
        const k = i === 0 ? bump(t, 0.25, 0.95) : es(t, 1.35, 1.6);
        sd.set({ x: SX + (i === 0 ? lerp(250, -100 + leadB * 340, es(t, 0.25, 0.4)) : lerp(250, 140, k)), y: base, s: S2, o: on * k, flip: i === 0 ? leadB > 0.1 : true, walk: (t > 0.25 && t < 0.9) || (i === 1 && k > 0 && k < 1) ? t * 30 : undefined, armF: 12 });
      });

      /* the dark street (beat 2) and the road to the dawn (beat 3) */
      const dawn = es(t, 3.1, 3.7);
      sk.blend(NIGHTS, DAWNS, dawn);
      starL.fade(1 - dawn);
      dawnL.fade(dawn);
      const walk = seg(t, 3.0, 3.85);
      const u = ease.io(walk);
      const seg_ = u * (ROAD.length - 1), j = Math.min(ROAD.length - 2, Math.floor(seg_)), fr = seg_ - j;
      const ax = walk > 0 ? lerp(ROAD[j][0], ROAD[j + 1][0], fr) : lerp(-150, 760, es(t, 1.95, 2.3));
      const ay = walk > 0 ? lerp(ROAD[j][1], ROAD[j + 1][1], fr) : GY + 6;
      const as = walk > 0 ? lerp(0.96, 0.56, u) : 0.96;
      const cower = es(t, 2.3, 2.5) * (1 - es(t, 2.95, 3.1));
      andrew.set({ x: ax, y: ay, s: as, flip: false, o: es(t, 1.95, 2.05), walk: (t > 1.95 && t < 2.3) || (walk > 0 && walk < 1) ? t * 30 : undefined, armF: 60, armB: 10 + cower * 20, head: cower * 12 - dawn * 8, lean: walk > 0 ? -4 : 0, blink: blinkAt(T, 1) });
      const [lx, ly] = hand(ax, ay, as, false, 60);
      pose(aGlow, { x: lx + 8, y: ly - 10, s: as, o: es(t, 1.95, 2.1) * (0.8 + Math.sin(T * 4) * 0.05) });
      HATERS.forEach((h, i) => {
        const k = es(t, 2.1 + i * 0.05, 2.35 + i * 0.05) * (1 - es(t, 3.2, 3.5) * 0.7);
        h.p.set({ x: h.x + (h.flip ? 1 : -1) * (1 - k) * 200, y: GY + (i % 2) * 8, s: h.s, flip: h.flip, o: es(t, 2.05, 2.15) * (1 - es(t, 3.4, 3.7)), armF: k * 88, armB: k * (i % 2 ? 30 : 0), head: -k * 3 });
        const mk = es(t, 2.3 + i * 0.06, 2.45 + i * 0.06, ease.back) * (1 - es(t, 2.95, 3.1));
        const [hx, hy] = headAt(h.x, GY + (i % 2) * 8, h.s, h.flip);
        pose(murs[i], { x: hx + (h.flip ? -10 : 10), y: hy - 22, s: mk, o: mk > 0.01 ? 1 : 0 });
      });
      const ck = es(t, 3.45, 3.75, ease.back);
      pose(crownEl, { x: PH ? sq(1130) : 1130, y: 460 - Math.sin(T * 1.2) * 4, s: ck, o: ck > 0.01 ? 1 : 0 });

      S.cam.x = es(t, 3.0, 3.7) * (PH ? 30 : 60);
      S.cam.y = -es(t, 3.0, 3.7) * 40;
      S.cam.z = 1 + bump(t, 2.0, 3.0) * 0.06;
    };
  },
};
