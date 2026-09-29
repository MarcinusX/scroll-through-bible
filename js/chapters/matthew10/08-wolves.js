// Mt 10,16 — a painted flat at dusk. Jesus stands at the edge of a dark wood and sends a little flock of twelve
// sheep, two by two, up the path into it; grey wolves slink out between the trees on either side, eyes glinting.
// Then two emblems come down on strings: a coiled serpent on the left (be wise) and a white dove on the right
// (be innocent); the little sheep look up at them and go on.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, moon, stars, grass, rock, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { sheep, wolf, snake, dove, strip, kf, hand, tr, PI } from './lib.js';

const JX = 672, JY = 730;
const PATH = [[792, 800], [836, 724], [860, 662], [826, 610], [792, 576], [804, 546]];

/** a dark pine: a stack of jagged tiers; origin: foot */
function pine(c, h, col) {
  const s = sheet();
  s.p(c.cut(c.rect(-5, -h * 0.2, 10, h * 0.2 + 2), 0.3, 5), shade(col, -0.25));
  for (let i = 0; i < 4; i++) {
    const y = -h * (0.16 + i * 0.2), w = h * (0.34 - i * 0.07);
    s.p(c.cut([[-w, y], [0, y - h * 0.34], [w, y]], 1.2, 6), shade(col, i * 0.04));
  }
  return s.out();
}

export default {
  id: 'mt10-wolves',
  enter: 'fly',
  beats: [
    { v: 16, text: 'Oto Ja was posyłam jak owce między wilki.' },
    { v: 16, cont: true, text: 'Bądźcie więc roztropni jak węże, a nieskazitelni jak gołębie!' },
  ],
  cam: { x: [-20, 20], y: [-40, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, ['#7d7aa6', '#d8a08f', '#f1c89f']);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 260, n: 50 }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 30)}`, { x: 1180, y: 150, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.4) }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(hillsWith(c, { y: 480, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.35), trees: 20, treeColor: mix(C.moss2, C.night2, 0.3), treeH: 24 }).markup);

    /* the wood: back trees, the path, front trees */
    const DARK = mix(C.moss2, C.night2, 0.45);
    const wood = S.layer({ par: 0.28, sh: 3 });
    const wfn = c.wave(560, [6, 3], [700, 200]);
    wood.add(sheet().p(c.ridge(wfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.duskViolet, 0.3)).out());
    const L2 = [], R2 = [];
    PATH.forEach(([x, y], i) => { const w = lerp(70, 10, i / (PATH.length - 1)); L2.push([x - w, y]); R2.unshift([x + w, y]); });
    wood.add(sheet().p(c.cut([...L2, ...R2], 0.6, 8), mix(C.sand, C.duskViolet, 0.3)).out());
    let back = '';
    [[440, 560, 200], [520, 548, 240], [610, 552, 210], [690, 540, 180], [900, 542, 190], [980, 550, 230], [1070, 556, 210], [1160, 560, 240], [360, 570, 220], [1250, 566, 220]].forEach(([x, y, h]) => { back += `<g transform="translate(${x} ${y})">${pine(c, h * 0.78, DARK)}</g>`; });
    wood.add(back);
    // wolves among the trees (heads turn to the flock)
    const WL = S.layer({ par: 0.32, sh: 4 });
    const WOLVES = [[640, 640, 0.95, false], [1040, 646, 1.0, true], [720, 596, 0.7, false], [930, 600, 0.72, true]].map(([x, y, s, flip], i) => ({ x, y, s, flip, i, el: WL.add(wolf(c, { dark: true })), eyes: WL.add(`<g><circle r="10" fill="url(#warm-glow)"/></g>`), seed: c.rr(0, 9) }));
    WOLVES.forEach((w) => { w.hd = w.el.querySelector('.hd'); });
    const front = S.layer({ par: 0.36, sh: 4 });
    let fr = '';
    [[470, 650, 240], [1150, 656, 250], [380, 670, 220], [1240, 674, 230]].forEach(([x, y, h]) => { fr += `<g transform="translate(${x} ${y})">${pine(c, h, shade(DARK, -0.1))}</g>`; });
    front.add(fr + grass(c, { x0: -600, x1: 2200, y: 660, n: 30, h: 14, color: mix(C.moss, C.night2, 0.3) }));

    /* the flock */
    const F = S.layer({ par: 0.42, sh: 4 });
    const FLOCK = Array.from({ length: 12 }, (_, i) => ({ i, el: F.add(`<g>${sheep(c, { wool: i % 3 ? C.linen : C.cream })}</g>`), seed: c.rr(0, 9) }));

    /* the near ground and Jesus */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(720, [4, 2], [600, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 10, 1), mix(C.sage2, C.duskViolet, 0.2)).out() + rock(c, 560, 740, 120, 40, mix(C.rock2, C.duskViolet, 0.2)) + grass(c, { x0: -600, x1: 2200, y: 720, fn: gfn, n: 40, h: 14, color: C.moss }));
    const P = S.layer({ par: 0.5, sh: 5 });
    const jGlow = P.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    /* the emblems */
    const flies = S.layer({ par: 0.22, sh: 6 });
    const disc = (inner, word) => `<path d="M0 -60V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${sheet().p(c.cut(c.circ(0, 0, 66, 40), 0.5, 6), C.haloRim).p(c.cut(c.circ(0, 0, 60, 40), 0.5, 6), C.cream).out()}${inner}<g transform="translate(0 92)">${strip(c, word, { size: 18 })}</g>`;
    const serp = flies.add(`<g>${disc(`<g transform="translate(-4 26) scale(1.35)">${snake(c)}</g>`, tr('roztropni jak węże', 'wise as serpents'))}</g>`);
    const dv = flies.add(`<g>${disc(`<g transform="translate(6 10) scale(1.1)">${dove(c)}</g>`, tr('nieskazitelni jak gołębie', 'harmless as doves'))}</g>`);

    return (t, time) => {
      const T = time;
      pose(moonEl, { x: 1180, y: 150, r: Math.sin(T * 0.5) * 0.8 });

      /* v16a — sheep among wolves */
      const send = es(t, 0.05, 0.25);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 20 + send * 70 - bump(t, 1.1, 1.9) * 20, armB: 10 + bump(t, 1.05, 1.9) * 120, head: -2, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 180, o: 0.5 });
      FLOCK.forEach((f) => {
        const lead = es(t, 0.06, 0.85, (x) => x) * 0.74 + es(t, 1.1, 1.9) * 0.2;
        const u = lead - (f.i >> 1) * 0.07 + (f.i % 2) * 0.02;
        const k = Math.max(0, Math.min(0.999, u));
        const seg_ = k * (PATH.length - 1), j = Math.floor(seg_), fr = seg_ - j;
        const [x0, y0] = PATH[j], [x1, y1] = PATH[Math.min(PATH.length - 1, j + 1)];
        const x = lerp(x0, x1, fr) + (f.i % 2 ? 14 : -14) * (1 - k * 0.6), y = lerp(y0, y1, fr);
        const s = lerp(0.8, 0.36, k);
        const hop = Math.abs(Math.sin(t * 18 + f.i)) * 3 * (u > 0.01 && u < 0.77 ? 1 : 0);
        const look = bump(t, 1.35, 1.9);
        pose(f.el, { x, y: y - hop - look * 2, s, sx: x1 < x0 ? -1 : 1, o: u > 0.01 ? 1 : 0 });
      });
      WOLVES.forEach((w) => {
        const out = es(t, 0.35 + w.i * 0.08, 0.7 + w.i * 0.08);
        const x = w.x + (w.flip ? 1 : -1) * (1 - out) * 60;
        pose(w.el, { x, y: w.y, s: w.s, sx: w.flip ? -1 : 1, o: 1 });
        pose(w.hd, { x: 40, y: -52, r: Math.sin(T * 0.9 + w.seed) * 5 + out * 8 });
        pose(w.eyes, { x: x + (w.flip ? -1 : 1) * 52 * w.s, y: w.y - 56 * w.s, s: w.s * (0.8 + 0.2 * Math.sin(T * 3 + w.seed)), o: out * 0.9 });
      });

      /* v16b — wise as serpents, innocent as doves */
      const a = es(t, 1.05, 1.35, ease.back), b = es(t, 1.25, 1.55, ease.back);
      pose(serp, { x: 520, y: lerp(-400, 250, a), r: Math.sin(T * 0.9) * 1.5, o: a > 0.002 ? 1 : 0 });
      pose(dv, { x: 1080, y: lerp(-400, 240, b), r: Math.sin(T * 0.9 + 1) * 1.5, o: b > 0.002 ? 1 : 0 });

      S.cam.y = -es(t, 1.0, 1.4) * 30;
      S.cam.z = 1 + es(t, 0.1, 0.8) * 0.04;
    };
  },
};
