// Mk 11,12–14 — the next morning, on the road from Bethany: Jesus is hungry; a fig tree in full leaf
// seen from afar; nothing on it but leaves — it is not the season for figs. His word to the tree,
// and the disciples who heard it.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass, bush, rock, flowers } from '../../assets/nature.js';
import { bird, ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { figTree, figs, thought, plate, hand, headAt, voiceRings, strip, question, FONT } from './lib.js';

const PI = Math.PI;
const ROAD = 660;
const TREE0 = [1150, 610];

/** an empty bowl (hunger) */
function emptyBowl(c) {
  const s = sheet();
  s.p(c.cut([[-18, -12], [18, -12], [12, 2], [6, 4], [-6, 4], [-12, 2]], 0.4, 4), C.pot);
  s.x(c.cut(c.ell(0, -12, 18, 3.4, 12), 0.2, 3), shade(C.pot, -0.35));
  return s.out();
}
/** "not the season": a little unripe green fig → arrow → a ripe fig, with the words underneath */
function seasonIcon(c) {
  const s = sheet();
  s.p(c.cut(c.ell(-30, -8, 9, 11, 12), 0.3, 3), C.wheatGreen);
  s.p(c.ribbon([[-30, -19], [-28, -24]], 2), C.moss2);
  s.x(c.ribbon([[-14, -8], [8, -8]], 2.6) + c.poly([[6, -13], [14, -8], [6, -3]]), C.inkSoft);
  s.p(c.cut([[30, -22], [38, -10], [40, 2], [30, 8], [20, 2], [22, -10]], 0.3, 3), mix(C.plumRobe, C.indigo, 0.25));
  s.p(c.ribbon([[30, -22], [31, -28]], 2), C.moss2);
  return s.out();
}

export default {
  id: 'm11-figtree',
  beats: [
    { v: 12 },
    { v: 13, text: 'A widząc z daleka drzewo figowe, okryte liśćmi, podszedł ku niemu zobaczyć, czy nie znajdzie czegoś na nim.' },
    { v: 13, cont: true, text: 'Lecz przyszedłszy bliżej, nie znalazł nic prócz liści,' },
    { v: 13, cont: true, text: 'gdyż nie był to czas na figi.' },
    { v: 14, text: 'Wtedy rzekł do drzewa: «Niech nikt nigdy nie je owocu z ciebie!»' },
    { v: 14, cont: true, text: 'Słyszeli to Jego uczniowie.' },
  ],
  cam: { x: [-60, 340], y: [-60, 40], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the fig tree stands further in, Jesus stops before it, the disciples walk closer together
    const P = S.portrait;
    const TREE = P ? [1060, 610] : TREE0;
    const DAWN = ['#c9c6d8', '#f1d6bf', '#f7e3cb'], DAY = ['#d3e2dc', '#f2e6c8', '#f8ebd3'];
    const sk = sky(S, DAWN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 260, y: 360, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 820, y: 130, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1380, y: 180, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 34, scale: 0.42 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
    const hillL = S.layer({ par: 0.2, sh: 3 });
    const hb = hillsWith(c, { y: 490, amps: [14, 7, 3], lens: [900, 320, 120], color: C.hillMid, trees: 24, treeColor: C.olive, treeH: 20, x0: -1400, x1: 3200 });
    hillL.add(hb.markup);
    // Bethany behind them on the left
    hillL.add(town(c, { x: 200, y: hb.fn(200) + 14, n: 8, spread: 360, sc: 0.8 }) + cypress(c, 420, hb.fn(420) + 8, 120) + olive(c, -60, hb.fn(-60) + 10, 0.8));
    hillL.add(`<g transform="translate(200 ${hb.fn(200) - 90})">${strip(c, tr('Betania', 'Bethany'), { size: 16 })}</g>`);

    /* ---------- the road and the knoll with the fig tree ---------- */
    const roadL = S.layer({ par: 0.5, sh: 4 });
    const rfn = c.wave(606, [5, 2], [800, 200]);
    const rs = sheet();
    rs.p(c.ridge(rfn, -1400, 3200, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4));
    rs.p(c.cut([[TREE[0] - 260, 640], [TREE[0] - 170, 604], [TREE[0] - 60, 590], [TREE[0] + 90, 592], [TREE[0] + 220, 610], [TREE[0] + 320, 650]], 1.2, 10), mix(C.hillNear, C.moss, 0.2));
    rs.p(c.cut([[-1400, 632], [800, 628], [3200, 624], [3200, 706], [800, 712], [-1400, 716]], 1.4, 14), mix(C.sand, C.sand2, 0.35));
    roadL.add(rs.out());
    roadL.add(grass(c, { x0: -800, x1: 2600, y: 612, fn: (x) => rfn(x) + 12, n: 40, h: 13, color: C.olive }) + flowers(c, { x0: -400, x1: 2400, y: 614, fn: (x) => rfn(x) + 14, n: 16 }) + rock(c, TREE[0] + 190, 628, 60, 24, C.rock));
    const tree = figTree(c, 1.05);
    const treeL = S.layer({ par: 0.5, sh: 5 });
    treeL.add(`<g transform="translate(${TREE[0]} ${TREE[1]})">${tree.trunk}</g>`);
    const leaves = treeL.add(`<g><g transform="translate(0 0)">${tree.leaves}</g></g>`);
    // the few leaves Jesus lifts, looking for fruit
    const lift = [0, 1, 2].map((i) => treeL.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 24, 18, 12, 0.3), 0.4, 4), i % 2 ? C.leaf : C.moss).x(c.ribbon([[0, 10], [2, -12]], 1.2), C.moss2).out()}</g>`));

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.james, CAST.andrew, CAST.thomas, CAST.matthew].map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))), dx: -80 - i * (P ? 46 : 58) - (i % 2) * 14, dy: (i % 2) * -14 }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* ---------- thoughts & signs ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const hunger = fx.add(`<g>${thought(c, `<g transform="translate(0 4) scale(.9)">${emptyBowl(c)}</g>`, { w: 70, h: 52 })}</g>`);
    const seek = fx.add(`<g transform="scale(1.1)">${question(c)}</g>`);
    const season = hanging(fx, plate(c, `<g transform="translate(0 -8)">${seasonIcon(c)}</g><text x="0" y="36" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${tr('jeszcze nie czas', 'not yet the season')}</text>`, { r: 70 }), { x: 900, y: 250, len: 900 });
    const voice = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: false, color: shade(C.terracotta, 0.25) });
    const ears = DIS.slice(0, 4).map(() => fx.add(`<g transform="scale(.42)">${ear(c, C.skin2)}</g>`));

    return (t, time) => {
      const T = time;
      sk.blend(DAWN, DAY, es(t, 0, 2.5));
      swing(sunEl, 260, 360 - es(t, 0, 4) * 200, T, 1, 0.6);
      swing(cl1, 820 + Math.sin(T * 0.1) * 26, 130, T, 1.3, 0.6, 1);
      swing(cl2, 1380 + Math.sin(T * 0.12) * 26, 180, T, 1.3, 0.7, 2);
      birds(T, 1);

      /* v12 — out of Bethany; He is hungry */
      const w1 = es(t, 0.0, 0.7, ease.out);
      const w2 = es(t, 1.2, 1.95);
      const jx = lerp(420, 640, w1) + w2 * (P ? 330 : 420);
      const walking = (w1 > 0 && w1 < 1) || (w2 > 0 && w2 < 1);
      const hungry = es(t, 0.45, 0.65) * (1 - es(t, 1.1, 1.3));
      const see = es(t, 1.02, 1.2) * (1 - es(t, 1.4, 1.5));
      const reach = es(t, 2.05, 2.3) * (1 - es(t, 3.1, 3.3));
      const speak = es(t, 4.05, 4.25) * (1 - es(t, 4.85, 5.0));
      jesus.set({
        x: jx, y: ROAD, s: 1.02, walk: walking ? jx * 0.05 : undefined,
        armF: see * 90 + reach * 105 * (1 - speak) + speak * 80 + hungry * 20, armB: reach * 30 + speak * 20, head: -reach * 14 - see * 4 + hungry * 8, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(jx, ROAD, 1.02, false);
      const hk = es(t, 0.5, 0.7, ease.back) * (1 - es(t, 1.05, 1.2));
      pose(hunger, { x: hx + 10, y: hy - 16, s: hk, o: hk > 0.02 ? 1 : 0 });

      DIS.forEach((d) => {
        const x = jx + d.dx - (walking ? 0 : 0);
        const heard = es(t, 5.05 + d.i * 0.05, 5.3 + d.i * 0.05);
        d.p.set({ x, y: ROAD + d.dy, s: 0.92 - (d.i % 2) * 0.04, walk: walking ? x * 0.05 + d.i : undefined, head: -bump(t, 1.1, 1.6) * 8 + heard * (d.i % 2 ? 8 : -4), armF: heard * (d.i === 0 ? 60 : d.i === 1 ? 30 : 0) + bump(t, 1.1, 1.6) * (d.i === 0 ? 80 : 0), armB: heard * (d.i === 2 ? 120 : 0), lean: heard * (d.i % 2 ? 4 : -3), blink: blinkAt(T, d.seed) });
      });

      /* v13 — the leafy tree; lifting its leaves: nothing there */
      const shiver = bump(t, 4.2, 4.9) * Math.sin(t * 60) * 1.4;
      pose(leaves, { x: TREE[0], y: TREE[1], r: shiver, ox: 0, oy: 0 });
      lift.forEach((l, i) => {
        const up = es(t, 2.1 + i * 0.08, 2.4 + i * 0.08) * (1 - es(t, 3.2, 3.5));
        const bx = TREE[0] - 64 + i * 30, by = TREE[1] - 140 + (i % 2) * 12;
        pose(l, { x: bx + up * (i - 1) * 26, y: by - up * (46 + i * 6), r: up * (i - 1) * 40, o: 1 });
      });
      const qk = es(t, 2.45, 2.65, ease.back) * (1 - es(t, 3.05, 3.2));
      pose(seek, { x: TREE[0] - 70, y: TREE[1] - 270, s: qk * 1.1, o: qk > 0.02 ? 1 : 0 });
      const sd = es(t, 3.05, 3.4, ease.back) * (1 - es(t, 3.95, 4.2));
      swing(season, 910, 250 - (1 - sd) * 700, T, 1.4, 0.8, 1);

      /* v14 — His word to the tree */
      voice(hx + 20, hy + 4, speak, T, { dir: 1, spread: 3 });
      ears.forEach((e, i) => {
        const d = DIS[i];
        const [ex, ey] = headAt(jx + d.dx, ROAD + d.dy, 0.92, false);
        const k = es(t, 5.1 + i * 0.07, 5.3 + i * 0.07, ease.back);
        pose(e, { x: ex - 4, y: ey - 50, s: 0.42 * k, r: Math.sin(T * 2 + i) * 6, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = lerp(-40, 0, w1) + w2 * (P ? 320 : 260) - es(t, 3.2, 3.6) * 40 + es(t, 4.9, 5.3) * (P ? -20 : -80);
      S.cam.y = 10 - sd * 30;
      S.cam.z = 1.04 + es(t, 2.0, 2.4) * 0.06 - es(t, 4.9, 5.3) * 0.06;
    };
  },
};
