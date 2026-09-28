// Mt 3,10 — a painted flat of an orchard. Two trees are heavy with fruit; the one between them is barren.
// "The axe already lies at the root": an axe comes down and settles against the root of the barren tree,
// its edge glinting. "Every tree that does not bear good fruit is cut down and thrown into the fire":
// two strokes, chips fly, the tree falls and is dragged into the fire, which flares up; the good trees stand.
import { C, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { orchardTree, fruit, axe, chip, firePit, fireFlames, sparkle, storyFrame, HARVEST } from './lib.js';

const PI = Math.PI;
const GY = 700;                   // the orchard floor
const BX = 800;                   // the barren tree
const FX = 1025;                  // the fire

export default {
  id: 'mt3-axe',
  enter: 'fly',
  beats: [
    { v: 10, text: 'Już siekiera do korzenia drzew jest przyłożona.' },
    { v: 10, cont: true, text: 'Każde więc drzewo, które nie wydaje dobrego owocu, będzie wycięte i w ogień wrzucone.' },
  ],
  cam: { x: [-20, 60], y: [0, 110], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    sky(S, HARVEST);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1180, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170, '#f6e3d2', '#e8cdb8'), { x: 640, y: 150, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.hillFar, 0.4) }).markup);
    const hills = S.layer({ par: 0.16, sh: 3 });
    hills.add(hillsWith(c, { y: 500, amps: [16, 7, 3], lens: [900, 320, 120], color: C.hillMid, trees: 26, treeColor: C.sage, treeH: 22 }).markup);

    /* the orchard floor */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(620, [4, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).p(c.ridge(c.wave(GY + 10, [3, 1], [500, 140]), -900, 2500, 1700, 12, 1), mix(C.sage2, C.sand, 0.35)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 624, fn: gfn, n: 60, h: 14, color: C.moss }) + flowers(c, { x0: -600, x1: 2200, y: GY + 12, n: 26 }));

    /* the good trees and their fruit */
    const T = S.layer({ par: 0.4, sh: 5 });
    const good = [[520, 1.0], [1245, 0.95]].map(([x, sc], j) => {
      const tr = orchardTree(c, { sc });
      const glow = T.add(`<ellipse rx="170" ry="150" fill="url(#warm-glow)" opacity="0"/>`);
      T.add(`<g transform="translate(${x} ${GY + 6})">${tr.tree}</g>`);
      let fr = '';
      tr.fruits.forEach((f) => { fr += `<g transform="translate(${(x + f.x).toFixed(1)} ${(GY + 6 + f.y + 6).toFixed(1)})">${fruit(c, 10)}</g>`; });
      T.add(`<g>${fr}</g>`);
      return { x, sc, glow, j };
    });
    /* the barren tree (its own piece: it falls) */
    const bad = orchardTree(c, { sc: 1.08, barren: true });
    const badEl = T.add(`<g>${bad.tree}</g>`);
    const stump = T.add(`<g opacity="0">${sheet().p(c.cut([[-16, 0], [-15, -22], [-6, -26], [6, -22], [16, -24], [17, 0]], 0.5, 4), mix(C.stone2, C.wood3, 0.3)).x(c.poly(c.ell(0, -23, 13, 4, 12)), C.wood3).out()}</g>`);

    /* the fire */
    const F = S.layer({ par: 0.4, sh: 5 });
    const fGlow = F.add(`<circle r="190" fill="url(#warm-glow)" opacity=".5"/>`);
    F.add(`<g transform="translate(${FX} ${GY + 14})">${firePit(c, 130)}</g>`);
    const flames = F.add(`<g>${fireFlames(c, 130)}</g>`);

    /* the axe, chips, the glint */
    const A = S.layer({ par: 0.4, sh: 6 });
    const axeEl = A.add(`<g>${axe(c, 190)}</g>`);
    const glint = A.add(`<g opacity="0">${sparkle(c, 16, C.star)}</g>`);
    const chips = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: A.add(`<g>${chip(c, 6 + (i % 3) * 2)}</g>`), vx: -60 - i * 26, vy: -90 - (i % 3) * 30 }));

    storyFrame(S);

    return (t, time) => {
      swing(sunEl, 1180, 170, time, 1, 0.6);
      swing(cl1, 640 + Math.sin(time * 0.1) * 20, 150, time, 1.2, 0.6, 1);

      /* v10a — the axe comes down and lies at the root */
      const down = es(t, 0.08, 0.45, ease.out);
      const settle = bump(t, 0.4, 0.55);
      // at rest: head beside the trunk, blade against the root, handle down to the left
      const restX = BX - 70, restY = GY - 34, restR = 38;
      const chop1 = bump(t, 1.04, 1.22), chop2 = bump(t, 1.22, 1.4);
      const lift = Math.max(chop1, chop2);
      const leave = es(t, 1.4, 1.55);
      const ax = lerp(restX - 260, restX, down) - lift * 50 - leave * 120;
      const ay = lerp(-300, restY, down) - lift * 80 - leave * 60;
      pose(axeEl, { x: ax, y: ay, r: lerp(-80, restR, down) + settle * 4 - lift * 70 - leave * 40, o: down > 0.001 ? 1 - es(t, 1.62, 1.72) : 0 });
      const gk = bump(t, 0.55, 0.95);
      pose(glint, { x: restX + 44, y: restY + 38, s: gk * 1.2, r: time * 60, o: gk });

      /* v10b — two strokes, chips fly, the tree falls and goes into the fire */
      chips.forEach((ch) => {
        const a = ch.i < 3 ? 1.14 : 1.32;
        const k = seg(t, a, a + 0.3);
        pose(ch.el, { x: BX - 16 + ch.vx * k, y: GY - 24 + ch.vy * k + 260 * k * k, r: k * 400, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const fall = es(t, 1.4, 1.53, ease.in);
      const drag = es(t, 1.55, 1.7);
      const tx = lerp(BX, FX - 30, drag), ty = GY + 6 + drag * 10;
      pose(badEl, { x: tx, y: ty, r: fall * 82 + drag * 8, s: 1 - drag * 0.35, o: 1 - es(t, 1.64, 1.72) });
      fade(stump, seg(t, 1.39, 1.41));
      pose(stump, { x: BX, y: GY + 6 });
      const flare = bump(t, 1.62, 2.2) * 0.7 + es(t, 1.62, 1.72) * 0.4;
      const fl = time ? 1 + Math.sin(time * 9) * 0.07 : 1;
      pose(flames, { x: FX, y: GY + 14, sx: 1 + flare * 0.4, sy: (0.8 + flare) * fl });
      pose(fGlow, { x: FX, y: GY - 30, s: 0.8 + flare * 0.8, o: 0.5 + flare * 0.4 });

      /* the good trees stand in warm light */
      good.forEach((g) => pose(g.glow, { x: g.x, y: GY - 200 * g.sc, s: 1.2, o: es(t, 1.6, 1.8) * 0.7 }));

      S.cam.z = 1.04 + es(t, 0.2, 0.6) * 0.2 - es(t, 1.35, 1.6) * 0.2;
      S.cam.x = es(t, 0.2, 0.6) * 10 + es(t, 1.35, 1.6) * 30;
      S.cam.y = 40 + es(t, 0.2, 0.6) * 60 - es(t, 1.35, 1.6) * 60;
    };
  },
};
