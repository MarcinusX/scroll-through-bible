// Mt 12,33 — a painted flat of an orchard. "Make the tree good and its fruit good": on the left a gardener waters a
// young tree; it shoots up green and full, blossoms, and the blossoms swell into red fruit. "Make the tree bad and its
// fruit bad": on the right a second tree grows up grey and crooked, and its fruit comes brown and shrivelled. "The tree
// is known by its fruit": a girl with a basket picks one of each — the red one shines in her hand and goes into the
// basket; out of the brown one a worm pokes its head, and she drops it.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix, sky, hanging } from '../kit.js';
import { band, hillsWith, grass, flowers, cloud, sun } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { orchardTree, fruit, rottenFruit, worm, manOf, womanOf, handAt, headAt, kf, jug, sparkle, glow, PI } from './lib.js';

const Y = 700;
const GX = 600, BX = 1010;       // the good tree, the bad tree

export default {
  id: 'mt12-tree',
  enter: 'fly',
  beats: [
    { v: 33, text: 'Albo uznajcie, że drzewo jest dobre, wtedy i jego owoc jest dobry,' },
    { v: 33, cont: true, text: 'albo uznajcie, że drzewo jest złe, wtedy i owoc jego jest zły;' },
    { v: 33, cont: true, text: 'bo z owocu poznaje się drzewo.' },
  ],
  cam: { x: [-30, 30], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfe2d6', '#f0ead0', '#f8e9cf']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 820, y: 170, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 1180, y: 230, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 130], color: C.hillFar, trees: 16, treeColor: C.sage2, treeH: 18 }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(band(c, { y: 560, amps: [12, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.sand, 0.2) }).markup);
    const G = S.layer({ par: 0.34, sh: 3 });
    const gfn = c.wave(Y - 30, [4, 2], [700, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.2)).out() + grass(c, { x0: -600, x1: 2200, y: Y - 26, fn: gfn, n: 40, h: 12, color: C.moss }) + flowers(c, { x0: 380, x1: 720, y: Y - 10, n: 10 }));

    /* the two trees (grown by scaling the whole cut-out) */
    const T_L = S.layer({ par: 0.4, sh: 5 });
    const good = orchardTree(c, { sc: 1.25 });
    const bad = orchardTree(c, { sc: 1.1, leaf: mix(C.olive, C.sand2, 0.5), leaf2: mix(C.moss2, C.rock3, 0.5), trunk: mix(C.rock3, C.wood2, 0.4) });
    const goodEl = T_L.add(`<g>${good.tree}</g>`);
    const badEl = T_L.add(`<g><g transform="skewX(-6)">${bad.tree}</g></g>`);
    const bloom = good.fruits.map((f) => ({ ...f, b: T_L.add(`<g opacity="0">${sheet().p(c.cut(c.star(0, 0, 8, 4.5, 5, 0), 0.2, 3), '#fbe9e4').x(c.poly(c.circ(0, 0, 2.4, 6)), C.sun).out()}</g>`), f: T_L.add(`<g opacity="0">${fruit(c, 11)}</g>`) }));
    const rot = bad.fruits.slice(0, 7).map((f) => ({ ...f, f: T_L.add(`<g opacity="0">${rottenFruit(c, 10)}</g>`) }));

    /* people */
    const act = S.layer({ par: 0.45, sh: 5 });
    const gard = S.puppet(act.add(person(c, manOf(c, { robe: C.ochreRobe, mantle: null, belt: C.rope, hairStyle: 'wrap', veil: C.linen2, beard: 'full', holdF: `<g transform="rotate(-60) scale(.8)">${jug(c)}</g>` }))));
    const drops = [0, 1, 2, 3].map(() => act.add(`<g opacity="0"><path d="${c.cut([[0, -5], [3, 1], [0, 4], [-3, 1]], 0.2, 2)}" fill="${C.lake2}"/></g>`));
    const basket = `<g transform="translate(0 30)"><path d="${c.cut([[-22, 0], [22, 0], [18, 22], [-18, 22]], 0.4, 4)}" fill="${C.basket}"/><path d="${c.ribbon(c.arc(0, 0, 20, 22, PI, 2 * PI, 10), 2.4)}" fill="${shade(C.basket, -0.2)}"/><g data-k="inB" opacity="0" transform="translate(0 -2)">${fruit(c, 9)}</g></g>`;
    const girl = S.puppet(act.add(person(c, womanOf(c, { robe: C.roseRobe, veil: C.skyVeil, skin: C.skin2, holdB: basket }))));
    const inB = S.$('inB');
    const pickG = act.add(`<g opacity="0">${glow(50, 0.9)}${fruit(c, 11)}</g>`);
    const pickB = act.add(`<g opacity="0">${rottenFruit(c, 10)}<g data-k="wm" transform="translate(4 -6)" opacity="0">${worm(c)}</g></g>`);
    const wm = S.$('wm');
    const sp = [0, 1, 2].map(() => act.add(`<g opacity="0">${sparkle(c, 10)}</g>`));
    const gK = [[1.55, 1240], [2.05, 800]];

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 820, y: 170, r: Math.sin(T * 0.6) });
      pose(cl, { x: 1180 + Math.sin(T * 0.1) * 20, y: 230, r: Math.sin(T * 0.6 + 1) });

      /* v33a — the good tree grows and bears good fruit */
      const gg = es(t, -0.3, 0.45);
      const sG = 0.25 + gg * 0.75;
      pose(goodEl, { x: GX, y: Y, s: sG });
      bloom.forEach((b, i) => {
        const bl = es(t, 0.35 + i * 0.03, 0.45 + i * 0.03) * (1 - es(t, 0.55 + i * 0.03, 0.65 + i * 0.03));
        const fr = es(t, 0.55 + i * 0.03, 0.7 + i * 0.03, ease.back);
        pose(b.b, { x: GX + b.x * sG, y: Y + b.y * sG, s: bl, o: bl > 0.01 ? 1 : 0 });
        const picked = i === 0 ? es(t, 2.2, 2.25) : 0;
        pose(b.f, { x: GX + b.x * sG, y: Y + b.y * sG + 10, s: fr, o: fr > 0.01 ? 1 - picked : 0 });
      });
      const water = bump(t, -0.2, 0.55);
      gard.set({ x: GX - 150, y: Y + 6, s: 0.96, flip: false, armF: 40 + water * 40, armB: 20, head: 8, lean: water * 5, blink: blinkAt(T, 3) });
      const [wx, wy] = handAt(GX - 150, Y + 6, 0.96, false, 40 + water * 40);
      drops.forEach((d, i) => {
        const k = time ? ((T * 1.4 + i / 4) % 1) : (i + 0.5) / 4;
        pose(d, { x: wx + 34 + k * 20, y: wy + 10 + k * 90, o: water > 0.3 ? 0.9 : 0 });
      });

      /* v33b — the bad tree grows crooked and bears bad fruit */
      const bg = es(t, 0.8, 1.45);
      pose(badEl, { x: BX, y: Y, s: 0.25 + bg * 0.75, r: bg * 3 });
      rot.forEach((r, i) => {
        const k = es(t, 1.35 + i * 0.04, 1.55 + i * 0.04, ease.back);
        const picked = i === 0 ? es(t, 2.4, 2.45) : 0;
        pose(r.f, { x: BX + r.x * (0.25 + bg * 0.75) - r.y * (0.25 + bg * 0.75) * Math.tan(-6 * PI / 180) * -1, y: Y + r.y * (0.25 + bg * 0.75) + 12, s: k, o: k > 0.01 ? 1 - picked : 0 });
      });

      /* v33c — known by its fruit */
      const gx = kf(t, gK);
      const reachG = bump(t, 2.1, 2.4);
      const reachB = bump(t, 2.3, 2.6);
      girl.set({ x: gx, y: Y + 10, s: 0.9, flip: true, o: es(t, 1.55, 1.65), walk: t > 1.55 && t < 2.05 ? gx * 0.07 : undefined, armF: 30 + Math.max(reachG, reachB) * 100, armB: 30, head: -4 - reachG * 10 + es(t, 2.55, 2.7) * 10, blink: blinkAt(T, 6) });
      pose(inB, { o: es(t, 2.38, 2.42) });
      const [hx, hy] = handAt(gx, Y + 10, 0.9, true, 130);
      const g0 = bloom[0];
      const gk = es(t, 2.2, 2.4);
      pose(pickG, { x: lerp(GX + g0.x, hx, gk), y: lerp(Y + g0.y + 10, hy, gk), s: 1, o: t > 2.2 && t < 2.42 ? 1 : 0 });
      const r0 = rot[0];
      const bk = es(t, 2.42, 2.55);
      const drop = es(t, 2.62, 2.75, ease.in);
      pose(pickB, { x: lerp(BX + r0.x + r0.y * Math.tan(-6 * PI / 180), hx - 10, bk), y: lerp(Y + r0.y + 12, hy, bk) + drop * 110, r: drop * 90, s: 1.4, o: t > 2.42 ? 1 : 0 });
      pose(wm, { x: 4, y: -6 - es(t, 2.55, 2.62) * 6, o: es(t, 2.55, 2.6) });
      sp.forEach((s_, i) => {
        const k = es(t, 2.3 + i * 0.05, 2.45 + i * 0.05, ease.back);
        pose(s_, { x: GX - 40 + i * 50, y: 330 - (i % 2) * 30, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -30], [0.7, -30], [1.0, 30], [1.6, 30], [2.0, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.7, 1.1], [1.0, 1.1], [2.0, 1.1]]);
      S.cam.y = kf(t, [[-0.5, 30], [2.0, 36]]);
    };
  },
};
