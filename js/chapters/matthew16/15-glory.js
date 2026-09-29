// Mt 16,27–28 — "The Son of Man will come in the glory of His Father with His angels": the sky turns to gold, Jesus is
// raised on a cloud with the glory behind Him, and the holy angels are let down on their strings. "…and then He will
// render to everyone according to his deeds": the people below lift up their baskets of fruit, and a crown of light
// comes down on each, great or small as its fruit. "Some standing here will not taste death until they see the Son of
// Man coming in His Kingdom": the gold fades to evening, He stands again among His disciples, and far off on the right a
// high mountain's summit begins to shine; Peter, James and John look up at it.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, cloud, sun } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { angel, glory, crown, fruitBasket, pose3, folk4, headAt, hangAt, rayBurst, DAY, HEAVEN, PI } from './lib.js';

const GY = 690, JX = 800;
const FOLK = [[430, 5], [510, 2], [590, 6], [1010, 3], [1090, 1], [1170, 4]];     // x, fruit
const DIS = [{ o: CAST.andrew, x: 560 }, { o: CAST.matthew, x: 500 }, { o: CAST.thomas, x: 620 }, { o: CAST.peter, x: 990, k: 1 }, { o: CAST.james, x: 1060, k: 1 }, { o: CAST.john, x: 1130, k: 1 }];

export default {
  id: 'mt16-glory',
  beats: [
    { v: 27, text: 'Albowiem Syn Człowieczy przyjdzie w chwale Ojca swego razem z aniołami swoimi,' },
    { v: 27, cont: true, text: 'i wtedy odda każdemu według jego postępowania.' },
    { v: 28 },
  ],
  cam: { x: [-20, 40], y: [-120, 40], z: [0.94, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAY);
    const goldL = sky(S, HEAVEN, { name: 'gold', rise: 0 }).layer;
    const eveL = sky(S, ['#9b8fb2', '#e6ae90', '#f4cea3'], { name: 'eve', rise: 0 }).layer;
    goldL.fade(0); eveL.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1290, y: 150, len: 800 });
    const clEl = hanging(hangL, cloud(c, 190), { x: 380, y: 150, len: 700 });

    /* ---------- land and the high mountain far off ---------- */
    const mtL = S.layer({ par: 0.06, sh: 2 });
    const mx = 1120, my = 470;
    mtL.add(sheet().p(c.cut([[mx - 330, my], [mx - 150, my - 170], [mx - 60, my - 250], [mx, my - 280], [mx + 50, my - 246], [mx + 170, my - 150], [mx + 360, my]], 2, 12), mix(C.lavender, C.hillFar, 0.4)).p(c.cut([[mx - 60, my - 250], [mx, my - 280], [mx + 50, my - 246], [mx + 20, my - 232], [mx - 10, my - 250], [mx - 34, my - 232]], 1, 6), C.linen).out());
    const summit = mtL.add(`<g><circle r="150" fill="url(#halo-glow)"/>${rayBurst(c, { n: 16, r0: 20, r1: 190, spread: 0.06, o: 0.7 })}</g>`);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 480, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.18, sh: 2 });
    hills.add(hillsWith(c, { y: 530, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 }).markup);
    const groundL = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 60, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out() + grass(c, { x0: -600, x1: 2200, y: GY - 60, fn: gfn, n: 30, h: 12, color: C.olive }) + olive(c, 280, GY - 56, 1) + cypress(c, 1350, GY - 54, 170));

    /* ---------- the glory and the angels ---------- */
    const glL = S.layer({ par: 0.3, sh: 1, flat: true, rise: 0 });
    const gl = glL.add(`<g>${glory(c, 700, 28)}</g>`);
    const angL = S.layer({ par: 0.2, sh: 6 });
    const angels = [[430, 250, false], [590, 170, false], [1010, 170, true], [1170, 250, true]].map(([x, y, flip], i) => {
      const el = hanging(angL, `<g data-k="ang${i}">${angel(c)}</g>`, { x, y, len: 1100 });
      return { i, x, y, flip, el, p: S.puppet(S.$('ang' + i).firstElementChild) };
    });

    /* ---------- the people with their baskets (two still groups), their crowns ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const fc = makeCutter('mt16-glory-folk');
    const grp = (list) => pose3(fc, list.map(([x, n], i) => ({ x: x - list[0][0], y: (i % 2) * 8, s: 0.86, flip: x > JX, head: -14, armF: 70, armB: 20, o: { ...folk4(fc), holdF: `<g transform="rotate(70) translate(0 16)">${fruitBasket(fc, n, 40)}</g>` } })));
    const gA = P.sprite(grp(FOLK.slice(0, 3)), FOLK[0][0], GY + 6);
    const gB = P.sprite(grp(FOLK.slice(3)), FOLK[3][0], GY + 6);
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jCloud = P.add(`<g>${cloud(c, 260, C.cream, C.halo)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const crowns = FOLK.map(([x, n], i) => ({ i, x, n, el: fx.add(`<g><circle r="40" fill="url(#halo-glow)"/>${crown(c, 30)}</g>`) }));

    return (t, time) => {
      const T = time;
      const gold = es(t, 0.05, 0.4) * (1 - es(t, 2.02, 2.4));
      goldL.fade(gold);
      eveL.fade(es(t, 2.05, 2.5));
      pose(sunEl, { x: 1290, y: 150 + es(t, 2.05, 2.6) * 200, r: T ? Math.sin(T * 0.6) : 0 });
      pose(clEl, { x: 380, y: 150 - gold * 700, r: T ? Math.sin(T * 0.5) * 1.2 : 0 });

      /* v27a — raised on a cloud in the glory; the angels come down */
      const rise = es(t, 0.1, 0.55) * (1 - es(t, 2.02, 2.4));
      const jy = GY - rise * 150;
      jesus.set({ x: JX, y: jy, s: 0.98 + rise * 0.1, flip: false, armF: 20 + rise * 50 + bump(t, 1.05, 1.9) * 30 + es(t, 2.4, 2.7) * 60, armB: 10 + rise * 130 - es(t, 2.4, 2.7) * 0, head: -rise * 6, blink: blinkAt(T) });
      pose(jCloud, { x: JX, y: jy + 14, s: 0.9, o: rise });
      const [hx, hy] = headAt(JX, jy, 0.98 + rise * 0.1, false);
      pose(gl, { x: hx, y: hy + 40, s: 0.6 + rise * 0.6, r: T * 2, o: gold });
      angels.forEach((an) => {
        const d = es(t, 0.15 + an.i * 0.08, 0.6 + an.i * 0.08, ease.back) * (1 - es(t, 2.02, 2.35));
        hangAt(an.el, an.x, an.y - (1 - d) * 800, T, 1.4, 0.7, an.i);
        an.p.set({ x: 0, y: 150, s: 0.72, flip: an.flip, armF: 60, armB: 140, head: -8, blink: blinkAt(T, an.i) });
      });

      /* v27b — the baskets lifted; a crown on each, as great as its fruit */
      const folkOn = 1 - es(t, 2.02, 2.25);
      gA.set({ x: FOLK[0][0], y: GY + 6, o: folkOn });
      gB.set({ x: FOLK[3][0], y: GY + 6, o: folkOn });
      crowns.forEach((cr) => {
        const k = es(t, 1.1 + cr.i * 0.06, 1.4 + cr.i * 0.06);
        const [cx, cy] = headAt(cr.x, GY + 6 + (cr.i % 3 === 1 ? 8 : 0), 0.86, cr.x > JX);
        const size = 0.45 + cr.n * 0.12;
        pose(cr.el, { x: lerp(hx, cx, k), y: lerp(hy, cy - 26, k) - Math.sin(k * PI) * 80, s: size * (0.4 + k * 0.6), o: k > 0.01 ? folkOn : 0 });
      });

      /* v28 — back on the ground among His disciples; the summit far off begins to shine */
      const here = es(t, 2.1, 2.35);
      const shine = es(t, 2.35, 2.7);
      pose(summit, { x: mx, y: my - 280, s: 0.6 + shine * 0.5, r: T ? T * 3 : 0, o: shine });
      dis.forEach((d) => {
        const look = d.k ? shine : 0;
        d.p.set({ x: d.x + (d.x < JX ? -1 : 1) * (1 - here) * 60, y: GY + 4 + (d.i % 2) * 8, s: 0.88, flip: d.k ? false : false, o: here, armF: 18 + look * 30, armB: 10 + look * 40, head: -look * 18, blink: blinkAt(T, d.seed) });
      });

      S.cam.z = 1.02 - es(t, 0.05, 0.45) * 0.08 + es(t, 2.05, 2.45) * 0.08;
      S.cam.y = -30 - es(t, 0.05, 0.45) * 80 + es(t, 2.05, 2.45) * 60;
      S.cam.x = es(t, 2.05, 2.45) * 30;
    };
  },
};
