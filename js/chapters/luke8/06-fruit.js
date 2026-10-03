// Łk 8,14–15 — the same cut-open field, the thorny patch on the left, the good soil on the right. The man among the
// thorns hears the word — then goes on his way: as he walks, thorn tendrils climb up beside him carrying the cares
// of life (a grey cloud, an hourglass), riches (a money bag, coins) and its pleasures (a cup, a bunch of grapes); he
// reaches for them, thorns grow in his heart, and the green ear on his stalk never ripens — it droops. The woman on
// the good soil hears with a noble and good heart and holds the word fast, both hands over her heart. Then patience:
// night falls and day comes back, and again; roots go down deep under the flap, the wheat grows slowly and ripens.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade } from '../kit.js';
import { thornBush, wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { stars } from '../../assets/nature.js';
import {
  soilStage, XP, FFACE, FLAPB, FEET, LISTEN, addHeart, wordSeed, sproutRig, rootPieces, rootLines, tendril, hourglassT, worryCloud, coinsT, moneyBag,
  grapes, cup, track, arcAt, heart, sparkle, PI,
} from './lib.js';

const camFor = (x) => (x - 800) / 0.6 * 0.62;
const JY = 592;
function cupOfWine(c) {
  return sheet().p(c.cut([[-10, 0], [10, 0], [8, 12], [2, 16], [2, 26], [8, 30], [-8, 30], [-2, 26], [-2, 16], [-8, 12]], 0.2, 3), C.sun).p(c.cut(c.ell(0, 1, 9, 3, 8), 0.1, 2), shade(C.plumRobe, -0.3)).out();
}
function grapesT(c) { return `<path d="${c.ribbon([[0, 0], [0, 8]], 1.4)}" fill="${C.moss2}"/><g transform="translate(0 22)">${grapes(c, 7)}</g>`; }
const SYM = { hourglassT, worryCloud, coinsT, moneyBag, cupOfWine, grapesT };

export default {
  id: 'lk8-fruit',
  parable: true,
  beats: [
    { v: 14, text: 'To, co padło między ciernie, oznacza tych, którzy słuchają słowa, lecz potem odchodzą' },
    { v: 14, cont: true, text: 'i przez troski, bogactwa i przyjemności życia bywają zagłuszeni i nie wydają owocu.' },
    { v: 15, text: 'W końcu ziarno w żyznej ziemi oznacza tych, którzy wysłuchawszy słowa sercem szlachetnym i dobrym, zatrzymują je' },
    { v: 15, cont: true, text: 'i wydają owoc przez swą wytrwałość.' },
  ],
  cam: { x: [camFor(XP.L) - 60, camFor(XP.R) + 20], y: [0, 130], z: [0.96, 1.36] },
  build(S) {
    const St = soilStage(S, { left: 'thorn', right: 'good', sky2: ['#161c42', '#29316a', '#4b5590'] });
    if (S.portrait) { St.SUN[0] = 1000; St.SUN[1] = 40; }   // phone: the sun hangs clear of the progress thread
    const c = St.c;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 380, n: 110 }));
    starL.fade(0);
    const nightTint = S.layer({ par: 0.6, sh: 1, flat: true });
    nightTint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2250"/>`);
    nightTint.fade(0);

    /* thorny patch: a stalk that never ripens, the thorns that choke it */
    St.plants.add(thornBush(c, XP.L - 170, 596, 90, C.thorn2) + thornBush(c, XP.L + 170, 598, 96, C.thorn2));
    const X_T = XP.L + 60;
    const stalkT = St.plants.add(`<g>${wheatStalk(c, { h: 96, ear: C.wheatGreen })}</g>`);
    const earT = stalkT.querySelector('.ear');
    const choke = St.plants.add(`<g>${thornBush(c, 0, 0, 110, C.thorn2)}${thornBush(c, 16, 0, 84, C.thorn)}</g>`);
    const flapThorn = St.ground.add(`<g>${St.flap(XP.L)}</g>`);

    /* good soil: deep roots, a field of wheat that grows in stages */
    const rootGood = St.ground.add(`<g>${rootPieces(c, [XP.R - 120, XP.R - 40, XP.R + 40, XP.R + 120].flatMap((x) => rootLines(c, x, FFACE + 2, 120, 34, 4)), 3.2)}</g>`);
    const rsGood = Array.from(rootGood.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const flapGood = St.ground.add(`<g>${St.flap(XP.R)}</g>`);
    const STALKS = Array.from({ length: 16 }, (_, j) => {
      const dx = (j - 7.5) * 20 + c.rr(-5, 5);
      const el = St.plants.add(`<g>${wheatStalk(c, { h: c.rr(130, 160) - Math.abs(dx) * 0.1 })}</g>`);
      return { j, dx, el, ear: el.querySelector('.ear'), d: c.rr(0, 0.1) };
    });

    /* the tendrils with the cares, riches and pleasures of life */
    const TD = [
      { x: XP.L - 170, len: 260, lean: 40, sym: 'worryCloud', at: 1.08 },
      { x: XP.L - 110, len: 200, lean: 50, sym: 'hourglassT', at: 1.14 },
      { x: XP.L - 40, len: 300, lean: -30, sym: 'moneyBag', at: 1.22 },
      { x: XP.L + 10, len: 220, lean: -50, sym: 'coinsT', at: 1.28 },
      { x: XP.L - 240, len: 240, lean: 70, sym: 'cupOfWine', at: 1.36 },
      { x: XP.L + 70, len: 280, lean: -70, sym: 'grapesT', at: 1.42 },
    ];
    const tds = TD.map((d, i) => {
      const L = i % 2 ? St.fx : St.plants;
      const { d: path, tip } = tendril(c, d.len, d.lean);
      return { ...d, i, tip, grow: L.add(`<g>${sheet().p(path, C.thorn).out()}</g>`), symEl: L.add(`<g>${SYM[d.sym](c)}</g>`) };
    });

    /* people */
    const jesus = S.puppet(St.people.add(person(c, { ...CAST.jesus })));
    const thornM = S.puppet(St.people.add(person(c, LISTEN.thorn)));
    const thornH = addHeart(thornM, c, 'thorn', LISTEN.thorn.robe);
    const goodW = S.puppet(St.people.add(person(c, LISTEN.good)));
    const goodH = addHeart(goodW, c, 'good', LISTEN.good.robe);
    const seedT = St.fx.add(`<g opacity="0">${wordSeed(c)}</g>`);
    const seedG = St.fx.add(`<g opacity="0">${wordSeed(c)}</g>`);
    const warm = St.fx.add(`<g opacity="0">${heart(c, 13)}</g>`);
    const motes = Array.from({ length: 10 }, (_, i) => ({ i, el: St.fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`), x: XP.R - 160 + i * 34, y: 430 + (i % 3) * 22 }));

    const CAMX = [[0, camFor(620)], [0.3, camFor(XP.L - 40)], [1.95, camFor(XP.L - 40)], [2.25, camFor(XP.R)], [3.2, camFor(XP.R)], [3.6, camFor(1060)]];
    const CAMZ = [[0, 1.16], [0.3, 1.24], [1.95, 1.24], [2.25, 1.3], [2.9, 1.3], [3.2, 1.14], [3.6, 1.06]];
    const CAMY = [[0, 70], [0.3, 80], [1.95, 80], [2.25, 90], [2.9, 90], [3.2, 110], [3.6, 80]];

    return (t, time) => {
      const T = time;
      S.cam.x = track(t, CAMX); S.cam.z = track(t, CAMZ); S.cam.y = track(t, CAMY);
      // patience: night falls and day returns, twice
      const nk = Math.max(bump(t, 3.02, 3.32), bump(t, 3.34, 3.62));
      St.sk2L.fade(nk);
      starL.fade(nk);
      nightTint.fade(nk * 0.35);
      St.update(T, { hot: 0 });

      /* Jesus sows: left in v14, right in v15 */
      const sowL = bump(t, 0.0, 0.3), sowR = bump(t, 2.0, 2.3);
      jesus.set({ x: XP.J, y: JY, s: 1.1, flip: t < 1.95, armF: 20 + 118 * Math.max(sowL, sowR) + bump(t, 3.65, 4.0) * 60, armB: 12 + Math.max(sowL, sowR) * 10, head: -Math.max(sowL, sowR) * 6, blink: blinkAt(T) });

      /* v14a: he hears the word, then goes on his way */
      const tl = seg(t, 0.06, 0.3);
      {
        const [x, y] = arcAt(ease.out(tl), [XP.J - 40, 400], [X_T - 7, FEET - 116], 110);
        pose(seedT, { x, y, s: 1.4, r: (1 - tl) * 200, o: seg(t, 0.05, 0.08) * (1 - seg(t, 0.3, 0.33)) });
      }
      const go = es(t, 0.55, 1.6, (u) => u);
      const tx = X_T - go * 190;
      const reach = es(t, 1.45, 1.65);
      thornM.set({ x: tx, y: FEET, s: 1.08, flip: go > 0.01, walk: go > 0 && go < 1 && reach < 0.5 ? tx * 0.07 : undefined, armF: 6 + reach * 80, armB: 4 + reach * 40, head: bump(t, 0.3, 0.5) * 8 - reach * 14, blink: blinkAt(T, 3) });
      thornH({ open: es(t, 0.3, 0.42), seed: es(t, 0.3, 0.38) * (1 - es(t, 1.7, 1.85)), glow: es(t, 0.3, 0.38) * (1 - es(t, 1.6, 1.85)), thorn: es(t, 1.3, 1.7) });
      /* v14b: choked by cares, riches and pleasures; no fruit ripens */
      const g0 = es(t, 0.4, 0.8), droop = es(t, 1.62, 1.9);
      pose(stalkT, { x: X_T + 40, y: 612, sy: g0, sx: 0.8 + 0.2 * g0, r: -droop * 38 });
      fade(earT, es(t, 0.7, 0.9) * (1 - droop * 0.4));
      pose(choke, { x: X_T + 40, y: 616, sx: es(t, 1.5, 1.8, ease.out), sy: es(t, 1.5, 1.8, ease.out), o: es(t, 1.49, 1.52) });
      tds.forEach((d) => {
        const g = es(t, d.at, d.at + 0.28, ease.out);
        pose(d.grow, { x: d.x, y: 616, s: g, o: g > 0.01 ? 1 : 0 });
        const pop = es(t, d.at + 0.12, d.at + 0.3, ease.back);
        pose(d.symEl, { x: d.x + d.tip[0] * g, y: 616 + d.tip[1] * g, s: pop * 1.3, r: Math.sin(T * 1.6 + d.i) * 6, o: pop > 0.01 ? 1 : 0 });
      });
      pose(flapThorn, { x: 0, y: FLAPB, sy: 1 - es(t, 1.1, 1.4) * 1.12, oy: FLAPB });

      /* v15a: a noble and good heart holds the word fast */
      const gl = seg(t, 2.06, 2.3);
      {
        const [x, y] = arcAt(ease.out(gl), [XP.J + 40, 400], [XP.R - 107, FEET - 116], 110);
        pose(seedG, { x, y, s: 1.4, r: (1 - gl) * -200, o: seg(t, 2.05, 2.08) * (1 - seg(t, 2.3, 2.33)) });
      }
      const hold = es(t, 2.45, 2.65);
      const joy = es(t, 3.72, 3.9);
      goodW.set({ x: XP.R - 100, y: FEET, s: 1.08, flip: true, armF: 8 + hold * 22 * (1 - joy) + joy * 140, armB: 6 + hold * 26 * (1 - joy) + joy * 130, head: bump(t, 2.25, 2.45) * 8 + hold * 12 * (1 - joy) - joy * 10, blink: blinkAt(T, 5) });
      goodH({ open: es(t, 2.28, 2.4) * (1 - hold * 0.8), seed: es(t, 2.28, 2.34), glow: es(t, 2.28, 2.4) * (1 + hold * 0.4), sprout: es(t, 3.05, 3.3), pulse: hold * (T ? Math.sin(T * 3) : 0) });
      const wk = es(t, 2.5, 2.7) * (1 - es(t, 3.0, 3.2));
      pose(warm, { x: XP.R - 100 + 7 * 1.08 - 20, y: FEET - 200, s: wk, o: wk > 0.02 ? 1 : 0 });

      /* v15b: fruit with patience — the wheat grows through nights and days */
      pose(flapGood, { x: 0, y: FLAPB, sy: 1 - es(t, 3.0, 3.25) * 1.12, oy: FLAPB });
      const rr = seg(t, 3.05, 3.65);
      rsGood.forEach((r) => fade(r.el, rr > r.o ? 1 : 0));
      const stage = 0.25 * es(t, 3.1, 3.25) + 0.35 * es(t, 3.38, 3.55) + 0.4 * es(t, 3.6, 3.72);
      STALKS.forEach((st) => {
        const g = Math.max(0, Math.min(1, stage - st.d * 0.2));
        pose(st.el, { x: XP.R + st.dx, y: 604 + (st.j % 2) * 6, sy: g, sx: 0.8 + g * 0.2, r: g > 0.9 && T ? Math.sin(T * 1.3 + st.dx * 0.1) * 1.5 : 0, o: g > 0.01 ? 1 : 0 });
        fade(st.ear, es(t, 3.6 + st.d, 3.75 + st.d));
      });
      motes.forEach((m) => { const k = bump(t, 3.72 + m.i * 0.02, 4.0); pose(m.el, { x: m.x, y: m.y - k * 20, s: k, r: T * 40, o: k }); });
    };
  },
};
