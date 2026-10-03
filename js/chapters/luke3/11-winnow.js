// Łk 3,17 — a painted flat at sunset, told as shadow play: on a hilltop threshing floor the one who is coming
// stands dark against the low sun, a gold rim of light round his head, the winnowing fork in his hand. He tosses
// the threshed heap into the evening wind: the grain falls back as a clean golden heap, the chaff streams away.
// The wheat is gathered in sacks into the granary and its door swings shut; the chaff is blown into the fire,
// which flares up and goes on burning.
import { C, CAST, person, blinkAt, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass } from '../../assets/nature.js';
import { grainPile } from '../../assets/things.js';
import { silhouette } from '../mark3/lib.js';
import { hand, winnowFork, granary, sack, chaffFlake, kernel, firePit, fireFlames, storyFrame, lightDisc, es, ease, bump, seg, fade, pose, lerp, PI } from './lib.js';

const GY = 652, WX = 860, HX = 730, BX0 = 500, FX0 = 1110;
const SUNSET = ['#b98aa2', '#eea57e', '#f6cf98'];
const INK = '#3b2a22';

export default {
  id: 'lk3-winnow',
  enter: 'fly',
  beats: [
    { v: 17, text: 'Ma On wiejadło w ręku dla oczyszczenia swego omłotu:' },
    { v: 17, cont: true, text: 'pszenicę zbierze do spichlerza,' },
    { v: 17, cont: true, text: 'a plewy spali w ogniu nieugaszonym».' },
  ],
  cam: { x: [-80, 80], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const BX = S.portrait ? 572 : BX0, FX = S.portrait ? 1048 : FX0;   // phone: the granary and the fire come inward
    sky(S, SUNSET);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunGlow = hangL.add(`<g>${lightDisc(c, 260, { grad: 'warm-glow' })}</g>`);
    const sunEl = hanging(hangL, sun(c, 70, { rays: C.sunRay, disc: C.sunDeep, inner: C.sun }), { x: WX + 20, y: 470, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170, '#f3d3c2', '#e2b3a2'), { x: 480, y: 170, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130, '#f3d3c2', '#e2b3a2'), { x: 1180, y: 230, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 520, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.plumRobe, 0.35) }).markup);

    /* wind: pale strokes sliding to the right */
    const wind = S.layer({ par: 0.3, sh: 1, flat: true, pad: 400 });
    let wd = '';
    for (let i = 0; i < 14; i++) { const x = c.rr(-900, 2400), y = c.rr(260, 620); wd += c.ribbon(c.cbez([x, y], [x + 60, y - 20], [x + 140, y + 16], [x + 220, y - 4], 14), (u) => Math.sin(u * PI) * 4 + 0.5); }
    wind.add(`<path d="${wd}" fill="${C.cream}" opacity=".6"/>`);

    /* the hilltop and the stone floor */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = (x) => 610 - Math.max(0, 1 - Math.abs(x - 800) / 900) ** 1.4 * 40 + Math.sin(x * 0.01) * 4;
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.wheat2, C.clay, 0.3)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 600, fn: gfn, n: 50, h: 16, color: mix(C.wheat2, C.soil, 0.3) }));
    G.add(sheet().p(c.cut(c.ell(800, GY + 6, 330, 52, 40), 0.8, 10), mix(C.stone2, C.clay, 0.3)).p(c.cut(c.ell(800, GY + 2, 312, 44, 40), 0.6, 10), mix(C.stone, C.peach, 0.35)).out());

    /* the granary and its door */
    const B = S.layer({ par: 0.4, sh: 5 });
    const gr = granary(c, { w: 210, h: 196, k: 'lw-door' });
    B.add(`<g transform="translate(${BX} ${GY - 4})">${gr.body}</g>`);
    const door = B.add(gr.door);
    const barnGlow = B.add(`<g>${lightDisc(c, 90, { grad: 'warm-glow' })}</g>`);

    /* the fire */
    const F = S.layer({ par: 0.4, sh: 5 });
    const fGlow = F.add(`<circle r="200" fill="url(#warm-glow)"/>`);
    F.add(`<g transform="translate(${FX} ${GY + 10})">${firePit(c, 130)}</g>`);
    const flames = F.add(`<g>${fireFlames(c, 130)}</g>`);
    const chaffHeap = F.add(`<g>${grainPile(c, 90, 22, mix(C.sand, C.cream, 0.5))}</g>`);

    /* the heaps, the winnower (shadow play, a rim of gold round his head), the sacks */
    const backL = S.layer({ par: 0.4, sh: 1, flat: true });
    const halo = backL.add(`<g>${lightDisc(c, 120)}</g>`);
    const A = S.layer({ par: 0.4, sh: 6 });
    const messy = A.add(`<g>${grainPile(c, 190, 60, mix(C.wheat2, C.stone2, 0.45))}</g>`);
    const clean = A.add(`<g>${grainPile(c, 170, 56, C.wheat)}</g>`);
    const forkM = `<g transform="rotate(180) translate(0 -10)">${winnowFork(c, 200, INK)}</g>`;
    const fig = person(c, { ...silhouette(CAST.jesus, INK), halo: true, holdF: forkM }).split(`fill="${C.blush}"`).join(`fill="${INK}"`);
    const figure = S.puppet(A.add(fig));
    const SACKS = [0, 1, 2].map((i) => ({ i, el: A.add(`<g>${sack(c, 52, 64, [C.linen2, C.linen, C.parchment][i], [C.terracotta, C.dustyBlue, C.sageRobe][i])}</g>`), x: HX - 40 + i * 50 }));

    /* the tossed grain and chaff */
    const P = S.layer({ par: 0.4, sh: 3 });
    const GRAIN = Array.from({ length: 14 }, (_, i) => ({ i, el: P.add(`<g>${kernel(c, 5.5)}</g>`), dx: c.rr(-50, 50), up: c.rr(160, 240), toss: i % 2 }));
    const CHAFF = Array.from({ length: 18 }, (_, i) => ({ i, el: P.add(`<g>${chaffFlake(c, c.rr(7, 11), mix(C.dune, C.cream, 0.35))}</g>`), dy: c.rr(-60, 40), up: c.rr(150, 250), toss: i % 2 }));
    const BURN = Array.from({ length: 10 }, (_, i) => ({ i, el: P.add(`<g>${chaffFlake(c, c.rr(5, 8))}</g>`), dx: c.rr(-40, 40), dy: c.rr(-30, 10) }));
    const EMB = Array.from({ length: 8 }, (_, i) => ({ i, el: P.add(`<g><path d="${c.cut(c.circ(0, 0, 3, 6), 0.2, 2)}" fill="${C.lampFlame}"/></g>`) }));

    storyFrame(S, { col: mix(C.parchment, C.clay, 0.35) });

    return (t, time) => {
      swing(sunEl, WX + 20, 470, time, 0.8, 0.5);
      pose(sunGlow, { x: WX + 20, y: 470, o: 0.8 });
      swing(cl1, 480 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      swing(cl2, 1180 + Math.sin(time * 0.1 + 1) * 20, 230, time, 1.2, 0.6, 2);
      wind.shift(((time * 50) % 400) - 200, 0);

      /* v17a — the fork in his hand: two tosses; grain falls back clean, chaff flies away */
      const tosses = [[0.1, 0.5], [0.45, 0.95]];
      let arm = 20 + es(t, 0.95, 1.1) * 35;
      tosses.forEach(([a], i) => { arm += bump(t, a, a + (i ? 0.46 : 0.3)) * 120; });
      const point = es(t, 1.05, 1.25) * (1 - es(t, 1.85, 2.0));
      figure.set({ x: WX, y: GY, s: 1.1, flip: true, armF: arm + point * 20, armB: 10 + point * 60, head: -bump(t, 0.1, 0.95) * 6, lean: bump(t, 0.1, 0.95) * 4 });
      pose(halo, { x: WX - 2, y: GY - 184, s: 1, o: 0.85 });
      const [tx] = hand(WX, GY, 1.1, true, 90);
      const clean_ = es(t, 0.2, 0.95);
      pose(messy, { x: HX, y: GY + 4, sy: 1 - clean_ * 0.8, o: 1 - es(t, 0.9, 1.0) });
      const gone = es(t, 1.35, 1.8);
      pose(clean, { x: HX - 10, y: GY + 6, sx: 0.4 + clean_ * 0.6, sy: (0.2 + clean_ * 0.8) * (1 - gone * 0.95), o: seg(t, 0.2, 0.25) * (1 - seg(t, 1.75, 1.8)) });
      GRAIN.forEach((g) => {
        const [a, b] = tosses[g.toss];
        const k = seg(t, a + 0.1, b);
        const x = lerp(tx - 20, HX + g.dx, k), y = GY - 30 - Math.sin(k * PI) * g.up * 0.6 - (1 - k) * 40;
        pose(g.el, { x, y, r: k * 300, o: k > 0 && k < 1 ? 1 : 0 });
      });
      CHAFF.forEach((f) => {
        const [a, b] = tosses[f.toss];
        const k = seg(t, a + 0.12 + (f.i % 4) * 0.03, b + 0.35);
        const x = lerp(tx - 10, FX - 60 + f.dy, k), y = GY - 60 - Math.sin(k * PI * 0.9) * f.up + k * 40 + f.dy * k * 0.3;
        pose(f.el, { x, y, r: k * 500 + f.i * 30, o: k > 0 && k < 1 ? 1 - k * 0.3 : 0 });
      });
      const heapK = es(t, 0.45, 1.1);
      pose(chaffHeap, { x: FX - 110, y: GY + 8, sx: 0.3 + heapK * 0.7, sy: Math.max(0.001, heapK * (1 - es(t, 2.1, 2.4))), o: heapK > 0.01 ? 1 - es(t, 2.3, 2.4) : 0 });

      /* v17b — the wheat into the granary: sacks fill, go in, the door shuts */
      SACKS.forEach((sk) => {
        const appear = es(t, 1.05 + sk.i * 0.08, 1.25 + sk.i * 0.08, ease.back);
        const go = es(t, 1.35 + sk.i * 0.1, 1.65 + sk.i * 0.1);
        const x = lerp(sk.x, BX, go);
        pose(sk.el, { x, y: GY + 4 - Math.abs(Math.sin(go * PI * 3)) * 16, s: appear * (1 - go * 0.3), o: appear > 0.01 && go < 0.97 ? 1 : 0 });
      });
      const shut = es(t, 1.8, 1.92);
      pose(door, { x: BX - gr.dw / 2, y: GY - 4, sx: lerp(0.12, 1, shut) });
      pose(barnGlow, { x: BX, y: GY - 60, o: bump(t, 1.4, 1.9) * 0.8 });

      /* v17c — the chaff into the fire, which flares and goes on burning */
      BURN.forEach((b) => {
        const k = seg(t, 2.05 + b.i * 0.03, 2.4 + b.i * 0.03);
        pose(b.el, { x: lerp(FX - 110 + b.dx, FX + b.dx * 0.3, k), y: GY - 10 + b.dy - Math.sin(k * PI) * 60, r: k * 400, o: k > 0 && k < 1 ? 1 - k * 0.6 : 0 });
      });
      const burn = es(t, 2.25, 2.55);
      const fl = time ? 1 + Math.sin(time * 9) * 0.07 + Math.sin(time * 13.3) * 0.04 : 1;
      pose(flames, { x: FX, y: GY + 10, sx: 1 + burn * 0.5, sy: (0.8 + burn * 1.1) * fl });
      pose(fGlow, { x: FX, y: GY - 40, s: 0.7 + burn * 0.9, o: 0.5 + burn * 0.45 });
      EMB.forEach((e) => {
        const k = time ? ((time * 0.5 + e.i / 8) % 1) : (e.i + 1) / 9;
        pose(e.el, { x: FX + (e.i - 4) * 12 + Math.sin(k * 8 + e.i) * 10, y: GY - 60 - k * 200 * (0.5 + burn), o: burn * (1 - k) });
      });

      const toB = es(t, 1.2, 1.6) * (1 - es(t, 1.95, 2.25));
      S.cam.x = -toB * 60 + es(t, 2.0, 2.4) * 50;
      S.cam.z = 1.04 + es(t, 0, 0.4) * 0.06 - toB * 0.04;
      S.cam.y = 30;
    };
  },
};
