// Mt 21,18–20 — morning, on the road back from Bethany to the city: Jesus is hungry. A fig tree by the road, in full
// leaf; He lifts its leaves — nothing but leaves. His word to the tree — and at once it withers: the leaves curl and
// fall, the bark turns grey. The disciples stare: "How did the fig tree wither at once?"
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass, rock, flowers } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { figTree, thought, bubble, headAt, voiceRings, question, strip, sparkle, jerusalem, tr, DAWN, DAY, PI } from './lib.js';

const ROAD = 660;
const TREE = [1080, 614];

/** an empty bowl (hunger) */
function emptyBowl(c) {
  const s = sheet();
  s.p(c.cut([[-18, -12], [18, -12], [12, 2], [6, 4], [-6, 4], [-12, 2]], 0.4, 4), C.pot);
  s.x(c.cut(c.ell(0, -12, 18, 3.4, 12), 0.2, 3), shade(C.pot, -0.35));
  return s.out();
}
/** a big three-lobed fig leaf (origin: stalk) */
function figLeaf(c, r = 22, col = C.leaf) {
  const pts = [];
  for (let i = 0; i < 15; i++) { const u = (i / 15) * PI * 2; const lobe = 0.62 + 0.38 * Math.abs(Math.cos(u * 1.5)); pts.push([Math.cos(u) * r * lobe, Math.sin(u) * r * lobe * 0.95 - r * 0.6]); }
  return sheet().p(c.cut(pts, 0.3, 4), col).x(c.ribbon([[0, 0], [0, -r * 1.2]], 1.4), C.moss2, 'opacity=".6"').out();
}

export default {
  id: 'mt21-figtree',
  beats: [
    { v: 18 },
    { v: 19, text: 'A widząc drzewo figowe przy drodze, podszedł ku niemu, lecz nic na nim nie znalazł oprócz liści.' },
    { v: 19, cont: true, text: 'I rzekł do niego: «Niechże już nigdy nie rodzi się z ciebie owoc!»' },
    { v: 19, cont: true, text: 'I drzewo figowe natychmiast uschło.' },
    { v: 20 },
  ],
  cam: { x: [-60, 300], y: [-60, 40], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, DAWN);
    const dayL = sky(S, DAY, { name: 'day', rise: 0 }).layer;
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 260, y: 360, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 820, y: 130, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1380, y: 180, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 34, scale: 0.42 });

    const farL = S.layer({ par: 0.08, sh: 2 });
    farL.add(band(c, { y: 420, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
    farL.add(`<g transform="translate(1500 430)">${jerusalem(c, 0.32)}</g>`);
    const hillL = S.layer({ par: 0.2, sh: 3 });
    const hb = hillsWith(c, { y: 490, amps: [14, 7, 3], lens: [900, 320, 120], color: C.hillMid, trees: 24, treeColor: C.olive, treeH: 20, x0: -1400, x1: 3200 });
    hillL.add(hb.markup);
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
    const trunk = treeL.add(`<g transform="translate(${TREE[0]} ${TREE[1]})">${tree.trunk}</g>`);
    const trunkDry = treeL.add(`<g transform="translate(${TREE[0]} ${TREE[1]})">${tree.trunk.replace(/fill="#[0-9a-f]{6}"/, `fill="${mix(C.stone2, C.rock3, 0.4)}"`)}</g>`);
    const dry = treeL.add(`<g><g transform="translate(0 0)">${tree.withered}</g></g>`);
    const leaves = treeL.add(`<g><g transform="translate(0 0)">${tree.leaves}</g></g>`);
    // the few leaves Jesus lifts, looking for fruit
    const lift = [0, 1, 2].map((i) => treeL.add(`<g>${figLeaf(c, 22, i % 2 ? C.leaf : C.moss)}</g>`));
    // leaves that curl, yellow and fall when it withers
    const falling = Array.from({ length: 14 }, (_, i) => ({ i, el: treeL.add(`<g>${figLeaf(c, c.rr(14, 20), [mix(C.leaf, C.ochre, 0.5), mix(C.moss, C.wood3, 0.5), mix(C.ochre, C.wood3, 0.3)][i % 3])}</g>`), x: TREE[0] + c.rr(-150, 150), y: TREE[1] - 215 + c.rr(-70, 60), dx: c.rr(-80, 80), r: c.rr(-300, 300) }));

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.james, CAST.andrew, CAST.thomas, CAST.matthew].map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))), dx: -80 - i * 58 - (i % 2) * 14, dy: (i % 2) * -14 }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* ---------- thoughts & words ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const hunger = fx.add(`<g>${thought(c, `<g transform="translate(0 4) scale(.9)">${emptyBowl(c)}</g>`, { w: 70, h: 52 })}</g>`);
    const seek = fx.add(`<g transform="scale(1.1)">${question(c)}</g>`);
    const onlyLeaves = fx.add(`<g>${strip(c, tr('tylko liście', 'nothing but leaves'), { size: 18 })}</g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: false, color: shade(C.terracotta, 0.25) });
    const how = fx.add(`<g>${bubble(c, [tr('Jak mogło tak od razu', 'How did the fig tree'), tr('uschnąć?', 'wither at once?')], { size: 19, tail: -1 })}</g>`);
    const wow = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 9, C.ochre)}</g>`));

    return (t, time) => {
      const T = time;
      dayL.fade(es(t, 0, 2.5));
      swing(sunEl, 260, 360 - es(t, 0, 4) * 200, T, 1, 0.6);
      swing(cl1, 820 + Math.sin(T * 0.1) * 26, 130, T, 1.3, 0.6, 1);
      swing(cl2, 1380 + Math.sin(T * 0.12) * 26, 180, T, 1.3, 0.7, 2);
      birds(T, 1);

      /* v18 — back towards the city in the morning; He is hungry */
      const w1 = es(t, 0.0, 0.6, ease.out);
      const w2 = es(t, 1.0, 1.4);
      const jx = lerp(420, 640, w1) + w2 * 300;
      const walking = (w1 > 0 && w1 < 1) || (w2 > 0 && w2 < 1);
      const hungry = es(t, 0.4, 0.6) * (1 - es(t, 1.0, 1.15));
      const reach = es(t, 1.4, 1.55) * (1 - es(t, 1.95, 2.1));
      const speak = es(t, 2.05, 2.2) * (1 - es(t, 2.9, 3.05));
      jesus.set({
        x: jx, y: ROAD, s: 1.02, walk: walking ? jx * 0.05 : undefined,
        armF: reach * 105 * (1 - speak) + speak * 85 + hungry * 20 + bump(t, 1.02, 1.3) * 80, armB: reach * 30 + speak * 20, head: -reach * 14 + hungry * 8, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(jx, ROAD, 1.02, false);
      const hk = es(t, 0.45, 0.65, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(hunger, { x: hx + 10, y: hy - 16, s: hk, o: hk > 0.02 ? 1 : 0 });

      /* v19a — the leafy tree; the leaves lifted: nothing there */
      lift.forEach((l, i) => {
        const up = es(t, 1.42 + i * 0.05, 1.62 + i * 0.05) * (1 - es(t, 2.0, 2.2));
        const bx = TREE[0] - 70 + i * 34, by = TREE[1] - 150 + (i % 2) * 12;
        pose(l, { x: bx + up * (i - 1) * 26, y: by - up * (40 + i * 6), r: up * (i - 1) * 40, o: 1 - seg(t, 2.95, 3.0) });
      });
      const qk = es(t, 1.6, 1.75, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(seek, { x: TREE[0] - 60, y: TREE[1] - 290, s: qk * 1.1, o: qk > 0.02 ? 1 : 0 });
      const ok = es(t, 1.65, 1.8, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(onlyLeaves, { x: TREE[0] + 30, y: TREE[1] - 350, s: ok, o: ok > 0.02 ? 1 : 0 });

      /* v19b — His word to the tree */
      voice(hx + 20, hy + 4, speak, T, { dir: 1, spread: 3 });
      const shiver = bump(t, 2.2, 2.9) * Math.sin(t * 60) * 1.4;
      /* v19c — at once it withers */
      const wither = es(t, 3.05, 3.4);
      pose(leaves, { x: TREE[0], y: TREE[1], r: shiver, o: 1 - wither });
      pose(dry, { x: TREE[0], y: TREE[1], o: wither });
      fade(trunkDry, es(t, 3.1, 3.4));
      fade(trunk, 1 - es(t, 3.3, 3.45));
      falling.forEach((f) => {
        const k = es(t, 3.05 + (f.i % 7) * 0.04, 3.6 + (f.i % 5) * 0.05, ease.in);
        pose(f.el, { x: f.x + f.dx * k + Math.sin(k * 8 + f.i) * 14, y: lerp(f.y, ROAD - 20 + (f.i % 4) * 8, k), r: f.r * k, s: 1 - k * 0.2, o: k > 0 ? 1 : 0 });
      });

      /* v20 — the disciples marvel */
      const marvel = es(t, 4.05, 4.3);
      DIS.forEach((d) => {
        const x = jx + d.dx;
        const fear = es(t, 3.1 + d.i * 0.04, 3.3 + d.i * 0.04);
        d.p.set({ x, y: ROAD + d.dy, s: 0.92 - (d.i % 2) * 0.04, walk: walking ? x * 0.05 + d.i : undefined, head: -bump(t, 1.0, 1.6) * 8 - fear * 6 + marvel * (d.i % 2 ? 8 : -4), armF: fear * (d.i === 0 ? 80 : d.i === 1 ? 40 : 0) + marvel * (d.i % 3 === 2 ? 60 : 0), armB: marvel * (d.i === 2 || d.i === 4 ? 140 : 0) + fear * (d.i === 3 ? 100 : 0), lean: -fear * 4, blink: blinkAt(T, d.seed) });
      });
      const [px, py] = headAt(jx + DIS[0].dx, ROAD, 0.92, false);
      const hw = es(t, 4.1, 4.3, ease.back);
      pose(how, { x: px + 20, y: py - 40, s: hw, o: hw > 0.02 ? 1 : 0 });
      wow.forEach((w, i) => {
        const d = DIS[i + 1];
        const [wx, wy] = headAt(jx + d.dx, ROAD + d.dy, 0.9, false);
        const k = bump(t, 4.15 + i * 0.06, 4.9);
        pose(w, { x: wx + 14, y: wy - 44, s: k * 1.2 + 0.001, r: T * 50, o: k });
      });

      S.cam.x = lerp(-40, 0, w1) + w2 * 200 + es(t, 3.9, 4.3) * -60;
      S.cam.y = 10;
      S.cam.z = 1.04 + es(t, 1.3, 1.6) * 0.06 - es(t, 3.9, 4.3) * 0.06;
    };
  },
};
