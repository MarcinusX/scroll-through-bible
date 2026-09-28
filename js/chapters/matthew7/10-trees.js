// Mt 7,17–20 — a painted flat of an orchard with two trees. "Every good tree bears good fruit": red fruit swells on
// the green tree; on the grey, crooked one the fruit comes brown and shrivelled, and a worm looks out. "A good tree
// cannot bear bad fruit": the ground in front slides down like a curtain to show the roots — the good tree's drink
// from a spring, the bad tree's are dry and grey. "Cut down and thrown into the fire": the axe, two strokes, the bad
// tree falls into the fire. "By their fruits you will know them": the two preachers come by once more with their
// baskets — fruit, and thorns.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers, bush } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { HARVEST_SKY, PROPHET, TRUE_P, handAt, orchardTree, fruit, rottenFruit, worm, roots, axe, chip, firePit, fireFlames, contentBasket, sparkle, glowDisc, storyFrame, kf, PI } from './lib.js';

const GL = 596;               // the ground line (the trees stand on it)
const TG = 570, TB = 900;    // the good tree, the bad tree
const FX = 1080;              // the fire
const PY = 744;               // where the preachers walk (v20)

export default {
  id: 'mt7-trees',
  enter: 'fly',
  beats: [
    { v: 17 },
    { v: 18 },
    { v: 19 },
    { v: 20 },
  ],
  cam: { x: [-30, 40], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, HARVEST_SKY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1240, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 160, '#f6e3d2', '#e8cdb8'), { x: 760, y: 130, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.hillFar, 0.45) }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(hillsWith(c, { y: 500, amps: [14, 6, 3], lens: [900, 320, 120], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 20 }).markup);

    /* the soil in section: roots, a spring under the good tree */
    const soil = S.layer({ par: 0.4, sh: 2 });
    const sd = sheet().p(c.ridge(c.wave(GL, [2, 1], [400, 130]), -900, 2500, 1700, 12, 0.6), mix(C.soil, C.clay, 0.25));
    let stones = '';
    for (let i = 0; i < 40; i++) stones += c.cut(c.blob(c.rr(-300, 1900), c.rr(GL + 20, 900), c.rr(5, 12), c.rr(3, 7), 7, 0.2), 0.3, 3);
    sd.x(stones, shade(C.soil, 0.2), 'opacity=".6"');
    // the layers of earth
    sd.x(c.ribbon([[-900, GL + 60], [2500, GL + 64]], 3) + c.ribbon([[-900, GL + 130], [2500, GL + 126]], 3), shade(C.soil, -0.2), 'opacity=".5"');
    soil.add(sd.out());
    soil.add(`<path d="${c.cut(c.blob(TG - 10, GL + 92, 90, 16, 14, 0.1), 0.6, 5)}" fill="${C.lake2}"/>`);
    soil.add(`<g transform="translate(${TG} ${GL})">${roots(c, { sc: 1.05 })}</g><g transform="translate(${TB} ${GL})">${roots(c, { sc: 0.9, dry: true })}</g>`);
    const drops = Array.from({ length: 6 }, (_, i) => ({ i, el: soil.add(`<circle r="4" fill="${C.skyVeil}"/>`) }));

    /* the ground's surface: a curtain of turf that slides down to show the section */
    const turf = S.layer({ par: 0.4, sh: 3, pad: 320 });
    turf.add(sheet().p(c.ridge(c.wave(GL - 4, [3, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out());
    turf.add(grass(c, { x0: -900, x1: 2500, y: GL - 2, n: 70, h: 14, color: C.moss }) + flowers(c, { x0: -300, x1: 1900, y: GL + 30, n: 30 }));

    /* the two trees and their fruit */
    const T = S.layer({ par: 0.4, sh: 5 });
    const good = orchardTree(c, { sc: 1.1 });
    T.add(`<g transform="translate(${TG} ${GL + 4})">${good.tree}</g>`);
    const bad = orchardTree(c, { sc: 1.0, leaf: mix(C.olive, C.sand2, 0.45), leaf2: mix(C.moss2, C.rock3, 0.4), trunk: mix(C.rock3, C.wood2, 0.4) });
    const badEl = T.add(`<g>${bad.tree}</g>`);
    const stump = T.add(`<g>${sheet().p(c.cut([[-16, 0], [-15, -22], [-6, -26], [6, -22], [16, -24], [17, 0]], 0.5, 4), mix(C.rock3, C.wood2, 0.4)).x(c.poly(c.ell(0, -23, 13, 4, 12)), C.wood3).out()}</g>`);
    const gF = good.fruits.map((f, i) => ({ i, x: TG + f.x, y: GL + 10 + f.y, el: T.add(`<g>${fruit(c, 11)}</g>`) }));
    const bF = bad.fruits.map((f, i) => ({ i, x: f.x, y: 10 + f.y, green: T.add(`<g>${fruit(c, 8, mix(C.wheatGreen, C.olive, 0.3))}</g>`), rot: T.add(`<g>${rottenFruit(c, 9)}</g>`) }));
    const wormEl = T.add(`<g>${worm(c)}</g>`);
    const gGlow = T.add(`<g>${glowDisc(210, 'warm-glow', 1)}</g>`);

    /* the fire, the axe */
    const F = S.layer({ par: 0.4, sh: 5 });
    const fGlow = F.add(`<circle r="170" fill="url(#warm-glow)"/>`);
    F.add(`<g transform="translate(${FX} ${GL + 14})">${firePit(c, 130)}</g>`);
    const flames = F.add(`<g>${fireFlames(c, 130)}</g>`);
    const A = S.layer({ par: 0.4, sh: 6 });
    const axeEl = A.add(`<g>${axe(c, 190)}</g>`);
    const chips = [0, 1, 2, 3, 4].map((i) => ({ i, el: A.add(`<g>${chip(c, 6 + (i % 3) * 2)}</g>`) }));

    /* v20 — the two preachers with their baskets */
    const act = S.layer({ par: 0.5, sh: 5 });
    const pT = S.puppet(act.add(person(c, TRUE_P)));
    const pF = S.puppet(act.add(person(c, PROPHET)));
    const bT = act.add(`<g>${contentBasket(c, 'fruit', 76)}</g>`);
    const bFk = act.add(`<g>${contentBasket(c, 'thorns', 76)}</g>`);
    const shine = act.add(`<g>${glowDisc(80, 'warm-glow', 1)}</g>`);

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 990, 260, C.moss, C.sage) + bush(c, 1510, 990, 260, C.sage, C.moss));
    storyFrame(S);

    return (t, time) => {
      const T_ = time;
      swing(sunEl, 1240, 150, T_, 1, 0.6);
      swing(cl, 760 + Math.sin(T_ * 0.1) * 20, 130, T_, 1.2, 0.6, 1);

      /* v17 — good fruit swells on the good tree; on the bad one it comes brown and wormy */
      gF.forEach((f) => { const k = es(t, 0.08 + f.i * 0.03, 0.3 + f.i * 0.03, ease.back); pose(f.el, { x: f.x, y: f.y, s: k, o: k > 0.01 ? 1 : 0 }); });
      const gk = es(t, 0.4, 0.6) * (1 - es(t, 3.0, 3.2) * 0.3) ;
      pose(gGlow, { x: TG, y: GL - 230, s: 1.1, o: gk * 0.7 });

      /* v19 — the axe, two strokes, the fall, the fire */
      const down = es(t, 2.04, 2.22, ease.out);
      const chop1 = bump(t, 2.22, 2.34), chop2 = bump(t, 2.34, 2.46);
      const lift = Math.max(chop1, chop2);
      const leave = es(t, 2.46, 2.58);
      const restX = TB - 70, restY = GL - 34;
      pose(axeEl, { x: lerp(restX - 260, restX, down) - lift * 50 - leave * 140, y: lerp(-300, restY, down) - lift * 80 - leave * 80, r: lerp(-80, 38, down) - lift * 70 - leave * 50, o: down > 0.001 ? 1 - es(t, 2.6, 2.7) : 0 });
      chips.forEach((ch) => {
        const a = ch.i < 3 ? 2.3 : 2.42, k = seg(t, a, a + 0.25);
        pose(ch.el, { x: TB - 16 - (60 + ch.i * 24) * k, y: GL - 24 - (90 + (ch.i % 3) * 30) * k + 260 * k * k, r: k * 400, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const fall = es(t, 2.44, 2.56, ease.in);
      const drag = es(t, 2.56, 2.7);
      const tx = lerp(TB, FX - 200, drag), ty = GL + 4 - drag * 4;
      const tr = fall * 72 + drag * 2, ts = 1 - drag * 0.2;
      const burn = es(t, 2.7, 3.0);
      const gone = es(t, 2.92, 3.02);
      pose(badEl, { x: tx, y: ty, r: tr, s: ts, o: 1 - gone });
      pose(stump, { x: TB, y: GL + 4, o: seg(t, 2.45, 2.47) });
      // the bad tree's fruit rides with it
      const rt = (tr * PI) / 180;
      bF.forEach((f) => {
        const grow = es(t, 0.1 + f.i * 0.03, 0.3 + f.i * 0.03, ease.back);
        const rot = es(t, 0.5 + f.i * 0.02, 0.62 + f.i * 0.02);
        const fx = tx + (f.x * Math.cos(rt) - f.y * Math.sin(rt)) * ts, fy = ty + (f.x * Math.sin(rt) + f.y * Math.cos(rt)) * ts;
        pose(f.green, { x: fx, y: fy, s: grow, o: grow > 0.01 ? 1 - rot : 0 });
        pose(f.rot, { x: fx, y: fy, s: grow * ts, o: rot * (1 - gone) });
      });
      const wk = es(t, 0.66, 0.78) * (1 - es(t, 1.9, 2.0));
      const w0 = bF[0];
      pose(wormEl, { x: TB + w0.x + 4, y: GL + 4 + w0.y - 4 - wk * 6, s: wk * 1.3, r: Math.sin(T_ * 3) * 10, o: wk > 0.01 ? 1 : 0 });
      const flare = bump(t, 2.64, 3.3) * 0.8 + es(t, 2.64, 2.72) * 0.3;
      const fl = time ? 1 + Math.sin(T_ * 9) * 0.07 : 1;
      pose(flames, { x: FX, y: GL + 14, sx: 1 + flare * 0.7, sy: (0.8 + flare * 1.2) * fl });
      pose(fGlow, { x: FX, y: GL - 30, s: 0.8 + flare * 0.8, o: 0.4 + flare * 0.5 });

      /* v18 — the turf slides down: the roots; water rises in the good tree's */
      const open = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.05));
      turf.shift(0, open * 300);
      F.fade(1 - open);
      drops.forEach((d) => {
        const k = time ? (T_ * 0.35 + d.i / 6) % 1 : (d.i + 0.5) / 6;
        pose(d.el, { x: TG - 30 + (d.i % 3) * 22 + Math.sin(k * 6 + d.i) * 8, y: GL + 84 - k * 84, o: open * (1 - k) });
      });

      /* v20 — the two preachers go by with their baskets */
      const walk = es(t, 3.02, 3.4);
      const txp = lerp(-80, 660, walk), fxp = lerp(1680, 940, walk);
      pT.set({ x: txp, y: PY, s: 1.1, walk: walk > 0 && walk < 1 ? txp * 0.06 : undefined, armF: 40 + es(t, 3.4, 3.55) * 30, armB: 10, head: -2, o: seg(t, 3.0, 3.04), blink: blinkAt(T_, 3) });
      pF.set({ x: fxp, y: PY, s: 1.1, flip: true, walk: walk > 0 && walk < 1 ? fxp * 0.06 : undefined, armF: 40 + es(t, 3.4, 3.55) * 30, armB: 10, head: 2, o: seg(t, 3.0, 3.04), blink: blinkAt(T_, 5) });
      const [ax, ay] = handAt(txp, PY, 1.1, false, 40 + es(t, 3.4, 3.55) * 30);
      const [bx, by] = handAt(fxp, PY, 1.1, true, 40 + es(t, 3.4, 3.55) * 30);
      pose(bT, { x: ax + 6, y: ay + 28, o: seg(t, 3.0, 3.04) });
      pose(bFk, { x: bx - 6, y: by + 28, o: seg(t, 3.0, 3.04) });
      pose(shine, { x: ax + 6, y: ay + 6, s: 1 + Math.sin(T_ * 2) * 0.05, o: es(t, 3.4, 3.6) });

      S.cam.y = kf(t, [[0, 0], [0.9, 0], [1.2, 50], [1.9, 50], [2.1, 0], [2.9, 0], [3.2, 40]]);
      S.cam.x = kf(t, [[0, -20], [0.9, 20], [1.9, 0], [2.1, 30], [2.9, 30], [3.2, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.06], [1.2, 1.1], [1.9, 1.1], [2.1, 1.04], [2.9, 1.04], [3.2, 1.06]]);
    };
  },
};
