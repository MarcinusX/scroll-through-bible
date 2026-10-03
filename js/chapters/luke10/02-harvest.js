// Łk 10,2 — at the edge of the harvest. Jesus stands on a path between the fields with some of the seventy-two;
// below them the whole valley is ripe. "The harvest is plentiful": He sweeps His hand over it and the green wheat
// turns gold from the path to the far hills; "but the labourers are few": out in the great field only two reapers are
// at work, bent over their sickles, lost in all that gold. "Pray the Lord of the harvest to send out labourers into
// His harvest": the disciples kneel on the path and lift their hands, a light pours down over the valley from above —
// and out of the villages on the hills labourers come streaming down the roads with their sickles, and into the field.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { grass, olive, rock } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { countrySet, ROADS, VILLAGES, roadS, along, glow, lightFall, folk, wheatBand, REAPER, sickleHeld, figure, sparkle, kf, DAY, SENT_A, SENT_B, es, bump, seg } from './lib.js';

const GY = 744, JX = 800;
/* the disciples on the path, on His left (the field opens on His right) */
const DIS = [
  { o: SENT_A, x: 650, s: 0.98 }, { o: SENT_B, x: 574, s: 0.94 }, { o: null, x: 496, s: 0.96 }, { o: null, x: 420, s: 0.92 }, { o: null, x: 344, s: 0.94 },
];
const REAPERS = [[1010, 0], [1160, 1]];
const NEW = [[930, 0, 0.58], [1090, 1, 0.6], [1250, 2, 0.58], [1340, 3, 0.56], [860, 4, 0.52], [1200, 5, 0.52]];

export default {
  id: 'lk10-harvest',
  beats: [
    { v: 2, text: 'Powiedział też do nich: «Żniwo wprawdzie wielkie, ale robotników mało;' },
    { v: 2, cont: true, text: 'proście więc Pana żniwa, żeby wyprawił robotników na swoje żniwo.' },
  ],
  cam: { x: [-40, 60], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    let light;
    const K = countrySet(S, {
      skyCols: DAY, sunAt: [1230, 170], fields: true, knoll: false,
      // the light from above goes behind the land
      behind: (S2) => { const L = S2.layer({ par: 0.05, sh: 1, flat: true, rise: 0 }); light = L.add(`<g>${lightFall(S2.c, { n: 11, len: 1100, spread: 0.5 })}</g>`); return L; },
    });
    const c = S.c;
    const pc = makeCutter('lk10-harvest-people');

    /* labourers streaming down the roads (small sprites, three to a group) */
    const LAB = [];
    ROADS.forEach((r, ri) => {
      const left = VILLAGES[ri][0] < 800;
      for (let j = 0; j < 2; j++) {
        const m = [0, 1, 2].map((k) => figure(pc, { ...folk(pc, true), holdF: `<g transform="rotate(-30)">${sickleHeld(pc)}</g>` }, { x: (k - 1) * 30, y: (k % 2) * 4, s: 1, flip: !left, armF: 50, armB: -10 })).join('');
        LAB.push({ ri, j, sp: K.walk.sprite(`<g transform="scale(.46)">${m}</g>`, VILLAGES[ri][0], VILLAGES[ri][1]), d: 1.28 + j * 0.2 + ri * 0.04 });
      }
    });

    /* the great field: a back row of wheat (green, then gold), the reapers, a front row */
    const f1 = (x) => 640 + 5 * Math.sin(x / 120);
    const greenBack = S.layer({ par: 0.32, sh: 3 });
    greenBack.add(wheatBand(c, { fn: f1, h: 58, n: 380, color: C.wheatGreen, ear: mix(C.wheatGreen, C.leaf, 0.3) }));
    const goldBack = S.layer({ par: 0.32, sh: 3 });
    goldBack.add(wheatBand(c, { fn: f1, h: 64, n: 380 }));
    const RL = S.layer({ par: 0.33, sh: 4 });
    const PT = S.portrait;
    const reapers = REAPERS.map(([x0, i]) => ({ x: PT ? [960, 1085][i] : x0, i })).map(({ x, i }) => ({ x, i, p: S.puppet(RL.add(person(c, { ...REAPER, ...(i ? { robe: C.wheatRobe, veil: C.linen2, skin: C.skin2 } : {}), holdF: sickleHeld(c) }))) }));
    const fresh = NEW.map(([x0, i, s]) => [PT ? 800 + (x0 - 800) * 0.72 : x0, i, s]).map(([x, i, s]) => ({ x, i, s, p: S.puppet(RL.add(person(c, { ...folk(pc, true), holdF: sickleHeld(c) }))) }));
    const f2 = (x) => 684 + 4 * Math.sin(x / 90 + 1);
    const greenFront = S.layer({ par: 0.36, sh: 3 });
    greenFront.add(wheatBand(c, { fn: f2, h: 62, n: 460, color: C.wheatGreen, ear: mix(C.wheatGreen, C.leaf, 0.3) }));
    const goldFront = S.layer({ par: 0.36, sh: 3 });
    goldFront.add(wheatBand(c, { fn: f2, h: 68, n: 460 }));
    const F2 = S.layer({ par: 0.36, sh: 3 });
    const glints = Array.from({ length: 12 }, (_, i) => ({ i, x: 300 + i * 90 + c.rr(-20, 20), y: c.rr(560, 640), el: F2.add(`<g>${sparkle(c, 9)}</g>`) }));

    /* the path in front, Jesus and the disciples (standing / kneeling) */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = (x) => GY - 30 + 6 * Math.sin(x / 170);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.sand, C.hillNear, 0.35)).x(c.ribbon([[-900, GY + 20], [800, GY + 12], [2500, GY + 22]], 70, 2), mix(C.sand, C.cream, 0.3), 'opacity=".7"').out());
    G.add(grass(c, { x0: -800, x1: 2400, y: 0, fn: (x) => gfn(x) + 2, n: 50, h: 16, color: C.olive }) + olive(c, 160, GY - 10, 1.15) + rock(c, 1440, GY + 6, 130, 44, C.rock2));
    const P = S.layer({ par: 0.5, sh: 5 });
    const aura = P.add(`<g>${glow(160, 0.5)}</g>`);
    const dis = DIS.map((d, i) => {
      const o = d.o || folk(pc, true);
      // phone: the four nearest close up beside Him; the fifth (off the edge) is left out
      return { ...d, ...(PT ? { x: [684, 622, 560, 498, 436][i], hide: i === 4 } : {}), i, st: S.puppet(P.add(person(c, o))), kn: S.puppet(P.add(person(c, { ...o, pose: 'kneel' }))), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      K.update(T);

      /* v2a — the whole valley ripens; only two reapers in it */
      greenBack.fade(1 - es(t, 0.3, 0.6));
      goldBack.fade(es(t, 0.1, 0.45));
      greenFront.fade(1 - es(t, 0.45, 0.75));
      goldFront.fade(es(t, 0.25, 0.6));
      glints.forEach((g) => { const k = bump(t, 0.4 + g.i * 0.03, 0.9 + g.i * 0.03); pose(g.el, { x: g.x, y: g.y, s: k, r: T * 30, o: k }); });
      reapers.forEach((r) => {
        const sw = time ? Math.sin(T * 2.2 + r.i * 1.7) : 0.3;
        r.p.set({ x: r.x, y: 676, s: 0.62, flip: r.i === 1, armF: 70 + sw * 30, armB: 20, lean: 18 + sw * 4, head: 10, blink: blinkAt(T, r.i + 4) });
      });

      /* Jesus: the sweep of His hand over the field; then His eyes lifted in prayer */
      const sweep = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.1));
      const pray = es(t, 1.05, 1.3);
      jesus.set({ x: JX, y: GY, s: 1.04, flip: false, armF: 16 + sweep * 76 + pray * 60, armB: 10 + sweep * 20 + pray * 110, head: -pray * 16, blink: blinkAt(T) });
      pose(aura, { x: JX, y: GY - 120, s: 1 + pray * 0.3, o: 0.35 + pray * 0.5 });

      /* v2b — the disciples kneel and pray; light pours down; the labourers come */
      dis.forEach((d) => {
        const k = es(t, 1.05 + d.i * 0.04, 1.12 + d.i * 0.04);
        const look = es(t, 0.2, 0.5) * (1 - k);
        const base = { x: d.x, y: GY + (d.i % 2 ? 6 : 0), s: d.s, flip: false, blink: blinkAt(T, d.seed) };
        d.st.set({ ...base, o: d.hide ? 0 : 1 - k, armF: 14 + look * 16, armB: 8, head: -look * 4 });
        d.kn.set({ ...base, o: d.hide ? 0 : k, armF: 96, armB: 160, head: -18 });
      });
      pose(light, { x: 800, y: -160, o: es(t, 1.15, 1.5) });
      LAB.forEach((w) => {
        const u = es(t, w.d, w.d + 0.5, (x) => x);
        const [x, y] = along(ROADS[w.ri], 1 - u);
        const s = roadS(y) / 0.46;
        w.sp.set({ x, y: y - (u > 0 && u < 1 ? Math.abs(Math.sin(u * 30 + w.ri)) * 2 : 0), s, o: seg(t, w.d, w.d + 0.03) * (1 - seg(t, w.d + 0.44, w.d + 0.5)) });
      });
      fresh.forEach((n) => {
        const k = es(t, 1.6 + n.i * 0.05, 1.78 + n.i * 0.05);
        const sw = time ? Math.sin(T * 2.2 + n.i * 1.3) : 0.3;
        n.p.set({ x: n.x + 40 * (1 - k), y: 676 - (1 - k) * 24, s: n.s - (1 - k) * 0.08, flip: n.i % 2 === 1, o: k, armF: 70 + sw * 30 * k, armB: 20, lean: 18 * k + sw * 4 * k, head: 10 * k, blink: blinkAt(T, n.i) });
      });

      S.cam.x = PT ? 0 : kf(t, [[0, 20], [0.3, 50], [0.9, 50], [1.2, 30], [2, 30]]);
      S.cam.y = kf(t, [[0, 10], [0.4, -20], [1.0, -20], [1.3, -40], [2, -40]]);
      S.cam.z = kf(t, [[0, 1.05], [0.5, 1.02], [1.2, 1.0], [2, 1.0]]);
    };
  },
};
