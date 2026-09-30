// Łk 10,3 — a painted flat of the stony hill road at dusk. "Go!" Jesus stretches out His hand, and the two of the
// seventy-two set off along the road. They pass behind a great rock — and out on the other side come two little lambs,
// trotting close together up the winding road. Among the rocks on either side the wolves are waiting: grey shapes rise,
// their eyes glint yellow, their heads turn after the lambs. The lambs go on between them, never leaving each other's
// side, a small warm light going with them up into the hills.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, mix } from '../kit.js';
import { band, moon, stars, rock, grass, bush } from '../../assets/nature.js';
import { along, glow, ewe, sheepRig, wolf, pairWalk, kf, EVENING, SENT_A, SENT_B, es, bump, seg } from './lib.js';

const JX = 560, JY = 772;
const ROAD = [[650, 774], [780, 760], [900, 742], [1000, 716], [1070, 690], [1100, 662], [1090, 632], [1040, 606], [980, 588], [930, 574]];
const sAt = (y) => lerp(0.5, 1, (y - 574) / (774 - 574));
const TINT = (col, k = 0.22) => mix(col, C.duskViolet, k);

export default {
  id: 'lk10-lambs',
  enter: 'fly',
  beats: [
    { v: 3 },
  ],
  cam: { x: [0, 60], y: [-20, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, EVENING);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 300, n: 40 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, `${glow(90, 0.5)}${moon(c, 28)}`, { x: 1150, y: 190, len: 900 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [26, 10, 3], lens: [900, 330, 120], color: TINT(C.hillFar, 0.45) }).markup);

    /* the stony slope with the winding road */
    const slope = S.layer({ par: 0.2, sh: 3 });
    const sfn = (x) => 540 + 16 * Math.sin(x / 170 + 1);
    const ss = sheet().p(c.ridge(sfn, -900, 2500, 1700, 10, 1.4), TINT(C.dune, 0.3));
    let st = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-400, 2000); st += c.cut(c.blob(x, sfn(x) + c.rr(14, 60), c.rr(14, 30), c.rr(7, 14), 8, 0.25), 0.6, 5); }
    ss.p(st, TINT(C.rock2, 0.3));
    ss.p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 1, 14), TINT(C.sand2));
    ss.p(c.ribbon(ROAD, (u) => lerp(70, 24, u), 1), TINT(C.sand, 0.1));
    ss.x(c.ribbon(ROAD.map(([x, y]) => [x, y + 4]), (u) => lerp(22, 6, u)), TINT(C.sand2, 0.2), 'opacity=".6"');
    slope.add(ss.out());

    /* wolves behind the road (on the upper side) */
    const WB = S.layer({ par: 0.2, sh: 4 });
    const mkWolf = (L, w, i) => { const el = L.add(wolf(c, { col: mix(C.storm, C.rock3, 0.5) })); return { ...w, i, el, hd: el.querySelector('.hd'), eye: L.add(`<g>${glow(12, 1, 'warm-glow')}</g>`) }; };
    const back = [{ x: 820, y: 612, s: 0.62, flip: false }, { x: 1250, y: 606, s: 0.66, flip: true }, { x: 1010, y: 568, s: 0.48, flip: true }].map((w, i) => mkWolf(WB, w, i));
    // the rocks they crouch behind (in front of their legs)
    WB.add(rock(c, 830, 648, 170, 44, TINT(C.rock2, 0.3)) + rock(c, 1244, 644, 190, 46, TINT(C.rock, 0.3)) + rock(c, 1004, 596, 120, 30, TINT(C.rock2, 0.35)));

    /* the pair (people), the lambs and the light that goes with them */
    const PL = S.layer({ par: 0.3, sh: 4 });
    const lGlow = PL.add(`<g>${glow(80, 0.85)}</g>`);
    const pair = PL.add(`<g>${pairWalk(c, SENT_A, SENT_B, { s: 1 })}</g>`);
    const lambs = [0, 1].map((i) => ({ i, r: sheepRig(PL.add(ewe(c, { lamb: true, wool: i ? C.cream : C.linen })), true) }));

    /* the rock that hides the change, and a wolf in front of the road */
    const RK = S.layer({ par: 0.32, sh: 5 });
    RK.add(rock(c, 930, 800, 250, 190, TINT(C.rock, 0.18)) + bush(c, 1030, 800, 100, TINT(C.moss, 0.3), TINT(C.sage, 0.3)));
    const WF = S.layer({ par: 0.34, sh: 4 });
    const front = [{ x: 1236, y: 756, s: 0.86, flip: true }].map((w, i) => mkWolf(WF, w, i + 3));
    WF.add(rock(c, 1250, 800, 230, 64, TINT(C.rock2, 0.2)));
    const WOLVES = [...back, ...front];

    /* the near ground and Jesus */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = (x) => 764 + 6 * Math.sin(x / 140);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 10, 1), TINT(C.sand, 0.16)).out() + grass(c, { x0: -800, x1: 2400, y: 0, fn: (x) => gfn(x) + 2, n: 40, h: 14, color: TINT(C.olive, 0.2) }) + rock(c, 250, 790, 160, 60, TINT(C.rock2, 0.2)));
    const P = S.layer({ par: 0.4, sh: 5 });
    const aura = P.add(`<g>${glow(150, 0.5)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      pose(moonEl, { x: 1150, y: 190, r: T ? Math.sin(T * 0.5) * 0.8 : 0 });

      /* "Go!" */
      const send = es(t, 0.02, 0.18);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 20 + send * 70, armB: 10 + bump(t, 0.3, 0.9) * 30, head: -2, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 120, o: 0.5 });

      /* the two walk off — behind the rock — and come out as two lambs */
      const u = es(t, 0.04, 0.9, (x) => x);
      const SW = 0.3;                                  // where they turn into lambs (behind the rock)
      const [px, py] = along(ROAD, Math.min(u, SW));
      const pw = seg(u, 0, SW);
      pose(pair, { x: px, y: py - Math.abs(Math.sin(pw * 16)) * 3, s: sAt(py) * 0.95, o: u > 0 && u < SW ? 1 : 0 });
      let lx = 0, ly = 0;
      lambs.forEach((l) => {
        const lu = Math.max(SW, u - l.i * 0.06);
        const [x, y] = along(ROAD, lu);
        const [x2] = along(ROAD, Math.min(1, lu + 0.01));
        const s = sAt(y) * 1.7;
        const hop = u > SW && u < 0.999 ? Math.abs(Math.sin(u * 60 + l.i * 1.4)) * 4 * s : 0;
        l.r.set({ x: x + (l.i ? -10 : 10) * s, y: y + l.i * 8, s, flip: x2 < x, hop, head: -6 + Math.sin(u * 30 + l.i) * 5, o: u >= SW ? 1 : 0 });
        if (l.i === 0) { lx = x; ly = y; }
      });
      pose(lGlow, { x: u < SW ? px : lx, y: (u < SW ? py - 90 : ly - 24), s: u < SW ? 1.4 : sAt(ly), o: u > 0.02 ? 0.85 : 0 });

      /* the wolves rise and watch them pass */
      WOLVES.forEach((w) => {
        const up = es(t, 0.2 + w.i * 0.06, 0.42 + w.i * 0.06);
        const dx = lx - w.x;
        pose(w.el, { x: w.x, y: w.y + (1 - up) * 30 * w.s, s: w.s, sx: w.flip ? -1 : 1, o: 1 });
        pose(w.hd, { x: 40, y: -52, r: 4 * up + Math.max(-14, Math.min(14, (w.flip ? dx : -dx) * 0.05)) * up });
        pose(w.eye, { x: w.x + (w.flip ? -1 : 1) * 52 * w.s, y: w.y - 56 * w.s + (1 - up) * 30 * w.s, s: w.s * (0.9 + (T ? 0.15 * Math.sin(T * 3 + w.i) : 0)), o: up * 0.95 });
      });

      S.cam.x = kf(t, [[0, 0], [0.4, 30], [1, 50]]);
      S.cam.y = kf(t, [[0, 20], [0.6, 0], [1, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.06], [1, 1.06]]);
    };
  },
};
