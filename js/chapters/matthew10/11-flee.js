// Mt 10,23 — the towns of Israel strung along a winding road over the hills. In the nearest town the people shake
// their fists and slam the gate, and Peter and Andrew hurry away along the road to the next one. There they
// preach, and the town lights up; on they go, town after town — but before they have reached the last, the sky
// opens above the hills and the Son of Man comes on the clouds in light.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, house, sun, cloud, grass, olive, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { DAY, rayBurst, radiance, wordSlip, headAt, PI } from './lib.js';

const ROAD0 = [[380, 736], [520, 700], [640, 664], [760, 640], [880, 606], [980, 566], [1070, 530], [1150, 500], [1220, 476]];
const TOWNS0 = [[470, 706, 1.0], [720, 640, 0.78], [930, 586, 0.62], [1080, 526, 0.5], [1190, 482, 0.42]];

// phone: the whole land is squeezed towards x 800 so the first town and its angry people are on the screen
const SQ = 0.76, sq = (x) => 800 + (x - 800) * SQ;
/** the road position at u (0..1) */
function along(u, ROAD) {
  const k = Math.max(0, Math.min(0.9999, u)) * (ROAD.length - 1), j = Math.floor(k), f = k - j;
  return [lerp(ROAD[j][0], ROAD[j + 1][0], f), lerp(ROAD[j][1], ROAD[j + 1][1], f)];
}

export default {
  id: 'mt10-flee',
  beats: [
    { v: 23, text: 'Gdy was prześladować będą w tym mieście, uciekajcie do innego.' },
    { v: 23, cont: true, text: 'Zaprawdę, powiadam wam: Nie zdążycie obejść miast Izraela, nim przyjdzie Syn Człowieczy.' },
  ],
  cam: { x: [-40, 40], y: [-60, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const X = PH ? sq : (x) => x;
    const ROAD = PH ? ROAD0.map(([x, y]) => [sq(x), y]) : ROAD0;
    const TOWNS = PH ? TOWNS0.map(([x, y, s]) => [sq(x), y, s]) : TOWNS0;
    const sk = sky(S, DAY);
    const glory = S.layer({ par: 0.03, sh: 1, flat: true });
    glory.add(`<g transform="translate(800 190)">${rayBurst(c, { n: 26, r0: 40, r1: 900, spread: 0.04, o: 0.7 })}<circle r="380" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 150, len: 800 });
    const clouds = [[560, 190, 240, -1], [1040, 200, 260, 1], [800, 120, 200, 0]].map(([x, y, w, d], i) => ({ x, y, d, i, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    const mh = hillsWith(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 20 });
    mid.add(mh.markup);

    /* the land with the road and the towns */
    const G = S.layer({ par: 0.35, sh: 3 });
    const gfn0 = (x) => 500 + (1220 - x) * 0.02 + Math.sin(x * 0.01) * 6;
    const gfn = PH ? (x) => gfn0(800 + (x - 800) / SQ) : gfn0;
    const gp = [];
    for (let x = -900; x <= 2500; x += 14) gp.push([x, gfn(x) + c.rr(-1, 1)]);
    gp.push([2500, 1700], [-900, 1700]);
    G.add(sheet().p(c.poly(gp), C.hillNear).out());
    const L2 = [], R2 = [];
    ROAD.forEach(([x, y], i) => { const w = lerp(26, 6, i / (ROAD.length - 1)); L2.push([x, y - w]); R2.unshift([x, y + w * 0.7]); });
    G.add(sheet().p(c.cut([...L2, ...R2], 0.6, 8), C.sand).out());
    G.add(olive(c, X(300), 760, 0.8) + cypress(c, X(820), 660, 90) + cypress(c, X(1010), 600, 70) + olive(c, X(1260), 560, 0.4));
    const lights = [];
    TOWNS.forEach(([x, y, s], i) => {
      const glow = G.add(`<g opacity="0"><circle r="${160 * s}" fill="url(#warm-glow)"/></g>`);
      G.add(`<g transform="translate(${x} ${y})">${town(c, { x: 0, y: 0, n: 6, spread: 200 * s, sc: 0.9 * s })}</g>`);
      lights.push({ x, y, s, glow });
    });
    G.add(grass(c, { x0: -600, x1: 2200, y: 740, fn: (x) => 740 + Math.sin(x * 0.02) * 4, n: 30, h: 12, color: C.moss }));
    // the gate of the first town, slamming shut
    const gate = G.add(`<g>${sheet().p(c.cut(c.rect(0, -80, 44, 80), 0.3, 5), C.wood2).x(c.ribbon([[10, -74], [10, -4]], 2) + c.ribbon([[30, -74], [30, -4]], 2), shade(C.wood2, -0.25), 'opacity=".6"').out()}</g>`);

    /* the people */
    const P = S.layer({ par: 0.4, sh: 5 });
    const ANGRY = [[410, 740], [455, 752], [510, 744]].map(([x, y], i) => ({ x: X(x), y, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...crowdPerson(c), hairStyle: ['wrap', 'short', 'curly'][i], beard: 'full' }))) }));
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const andrew = S.puppet(P.add(person(c, CAST.andrew)));
    const slips = [0, 1, 2].map(() => P.add(wordSlip(c, 26)));

    /* the Son of Man coming on the clouds */
    const top = S.layer({ par: 0.1, sh: 5 });
    const rad = top.add(`<g>${radiance(c, 90)}</g>`);
    const seat = top.add(`<g>${cloud(c, 260, C.cream, C.halo)}</g>`);
    const jesus = S.puppet(top.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 150, T, 1, 0.6);
      const open = es(t, 1.2, 1.6);
      clouds.forEach((cl) => swing(cl.el, cl.x + cl.d * open * 380, cl.y - (cl.d === 0 ? open * 500 : 0), T, 1.2, 0.6, cl.i));
      sk.blend(DAY, ['#e8c894', '#f4dcae', '#f8e8c8'], open * 0.8);
      glory.fade(open);

      /* v23a — driven out of this town, on to the next */
      ANGRY.forEach((a) => {
        const k = es(t, 0.05 + a.i * 0.05, 0.25 + a.i * 0.05);
        a.p.set({ x: a.x, y: a.y, s: 0.9, flip: false, armB: k * (140 + Math.sin(T * 8 + a.seed) * 10), armF: k * 60, head: -4, blink: blinkAt(T, a.seed) });
      });
      const shut = es(t, 0.45, 0.6);
      pose(gate, { x: X(540), y: 716, sx: Math.max(0.05, shut), o: shut > 0.01 ? 1 : 0 });
      // the pair runs along the road (beat 0 to the second town), then town to town (beat 1)
      const u = lerp(0.12, 0.34, es(t, 0.15, 0.8)) + es(t, 1.05, 1.9) * 0.34;
      const running = (t > 0.15 && t < 0.8) || (t > 1.05 && t < 1.9);
      [peter, andrew].forEach((p, i) => {
        const [x, y] = along(u - i * 0.03, ROAD);
        const s = lerp(0.95, 0.35, (u - i * 0.03 - 0.1) / 0.8);
        const preach = (u > 0.33 && u < 0.36) || (t > 0.8 && t < 1.05);
        p.set({ x, y, s, flip: false, walk: running ? t * 50 + i : undefined, amt: 1.4, lean: running ? 6 : 0, armF: preach ? 60 : 20, armB: preach && i === 0 ? 120 : 10, head: -open * 10, blink: blinkAt(T, i + 1) });
      });
      slips.forEach((w, i) => {
        const k = seg(t, 0.2 + i * 0.1, 0.55 + i * 0.1);
        pose(w, { x: X(500 + k * 180), y: 610 - Math.sin(k * PI) * 50, r: k * 200, s: 0.7, o: bump(t, 0.2 + i * 0.1, 0.55 + i * 0.1) });
      });
      lights.forEach((l, i) => {
        const at = [9, 0.82, 1.3, 1.62, 9][i];
        fade(l.glow, es(t, at, at + 0.15));
        pose(l.glow, { x: l.x, y: l.y - 30 * l.s, o: es(t, at, at + 0.15) });
      });

      /* v23b — the Son of Man comes */
      const come = es(t, 1.35, 1.7, ease.out);
      const JY = lerp(-300, 330, come);
      pose(rad, { x: 800, y: JY - 150, s: 0.6 + come * 0.6, r: T * 3, o: come });
      pose(seat, { x: 800, y: JY + 8, s: 1, o: come > 0.01 ? 1 : 0 });
      jesus.set({ x: 800, y: JY, s: 0.9, armF: 50 + come * 40, armB: 60 + come * 80, head: -4, o: come > 0.01 ? 1 : 0, blink: blinkAt(T, 3) });

      S.cam.y = -es(t, 1.2, 1.7) * 50;
      S.cam.z = 1 + es(t, 0, 0.8) * 0.04;
    };
  },
};
