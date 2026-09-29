// Łk 21,29–31 — the parable, as a painted set flown in: an orchard on a hillside at the very end of winter. "Look at the
// fig tree, and all the trees": the fig tree stands bare in the middle, grey twigs, and the almond and the pomegranate
// beside it bare too; a round lens comes down with one fig branch close up. "When they are already budding, you know
// that the summer is near": in the lens the sap runs green, the buds swell and the leaves unfold — and on the trees the
// leaves come out, the almond flowers, the sun climbs high and the wheat below turns gold. "So when you see these things
// happening, know that the Kingdom of God is near": on the hill beyond, a gate of light stands open, and the golden
// crown of the Kingdom comes down close over the orchard.
import { C, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix, flock } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, flowers, sun, cloud } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { figTree, kingdomDisc, kingdomArch, warm, halo, onString, SPRING, SUMMER, es, ease, bump, seg, fade, PI } from './lib.js';

const GY = 700, TREE = [800, 690];
const LENS = { x: 1050, y: 226, r: 100 };

function figLeaf(c, r = 22, col = C.leaf) {
  const pts = [];
  for (let i = 0; i < 18; i++) {
    const u = (i / 18) * PI * 2, lobe = 0.6 + 0.4 * Math.abs(Math.cos(u * 1.5));
    pts.push([Math.cos(u) * r * lobe * 0.95, -r + Math.sin(u) * r * lobe]);
  }
  return sheet().p(c.cut(pts, 0.3, 4), col).x(c.ribbon([[0, 0], [0, -r * 1.3]], 1.4) + c.ribbon([[0, -r * 0.8], [-r * 0.5, -r * 1.3]], 1.1) + c.ribbon([[0, -r * 0.8], [r * 0.5, -r * 1.3]], 1.1), shade(col, -0.25), 'opacity=".6"').out();
}
/** a small orchard tree: bare twigs (origin: foot); crown: a blob of leaves or blossom (separate) */
function smallTree(c, h = 150) {
  const bark = mix(C.stone2, C.wood3, 0.5);
  let tw = '';
  for (let i = 0; i < 9; i++) {
    const a = PI + (i + 0.5) / 9 * PI, l = c.rr(40, 70);
    const bx = c.rr(-10, 10), by = -h * 0.7;
    tw += c.ribbon(c.qbez([bx, by], [bx + Math.cos(a) * l * 0.5, by + Math.sin(a) * l * 0.3], [bx + Math.cos(a) * l, by + Math.sin(a) * l * 0.6], 6), (u) => 3.4 * (1 - u) + 0.8);
  }
  return sheet().p(c.cut([[-7, 0], [-5, -h * 0.7], [5, -h * 0.7], [8, 0]], 0.5, 6), bark).p(tw, bark).out();
}
function crownOf(c, h, col, col2, dots = null) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -h * 0.82, 62, 42, 14, 0.18), 1, 6), col);
  s.p(c.cut(c.blob(-18, -h * 0.9, 30, 22, 10, 0.2), 0.8, 5) + c.cut(c.blob(22, -h * 0.78, 26, 20, 10, 0.2), 0.8, 5), col2);
  if (dots) { let d = ''; for (let i = 0; i < 18; i++) d += c.cut(c.circ(c.rr(-56, 56), -h * 0.82 + c.rr(-34, 34), c.rr(3, 5), 6), 0.2, 2); s.p(d, dots); }
  return s.out();
}

export default {
  id: 'lk21-figtree',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 29 },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-30, 30], y: [-50, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, SPRING);
    const sk2 = sky(S, SUMMER, { name: 'summer', rise: 0 }).layer;
    sk2.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1240, y: 380, len: 900 });
    const cl = hanging(hangL, cloud(c, 180), { x: 380, y: 130, len: 800 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 50, scale: 0.4 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [18, 7, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);

    /* the far hill with the gate of the Kingdom */
    const hillL = S.layer({ par: 0.16, sh: 3 });
    const h2 = hillsWith(c, { y: 500, amps: [14, 6, 2], lens: [800, 280, 100], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 20 });
    hillL.add(h2.markup + cypress(c, 300, h2.fn(300) + 6, 110) + olive(c, 1400, h2.fn(1400) + 8, 0.7));
    const gateGlow = hillL.add(`<g>${halo(120)}</g>`);
    const gate = hillL.add(`<g>${kingdomArch(c, 60, 96)}</g>`);

    /* the field below turning gold */
    const fieldL = S.layer({ par: 0.26, sh: 3 });
    const ffn = c.wave(596, [6, 3], [700, 200]);
    fieldL.add(sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out());
    let rows = '';
    for (let i = 0; i < 5; i++) rows += c.ribbon([[-1400, 612 + i * 12], [3000, 612 + i * 12 + c.rr(-2, 2)]], 5);
    const green = fieldL.add(`<g><path d="${rows}" fill="${C.wheatGreen}"/></g>`);
    const goldRows = fieldL.add(`<g><path d="${rows}" fill="${C.wheat2}"/></g>`);

    /* the orchard */
    const treeL = S.layer({ par: 0.4, sh: 5 });
    const orchardGround = c.wave(GY - 8, [5, 2], [700, 200]);
    treeL.add(sheet().p(c.ridge(orchardGround, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sand, 0.15)).out() + grass(c, { x0: -800, x1: 2400, y: GY - 8, fn: orchardGround, n: 40, h: 12, color: C.olive }));
    const OT = [[430, 704, 150, 'almond'], [1170, 704, 140, 'pom'], [250, 714, 120, 'pom'], [1360, 716, 130, 'almond']];
    OT.forEach(([x, y, h]) => treeL.add(`<g transform="translate(${x} ${y})">${smallTree(c, h)}</g>`));
    const crowns = OT.map(([x, y, h, k], i) => ({ i, x, y, el: treeL.add(`<g>${k === 'almond' ? crownOf(c, h, mix(C.leaf, C.sage, 0.3), C.sage, '#f3d6dc') : crownOf(c, h, C.moss, C.leaf, null)}</g>`) }));
    const ft = figTree(c, 1.25);
    treeL.add(`<g transform="translate(${TREE[0]} ${TREE[1]})">${ft.withered.replace(/fill="#[0-9a-f]{6}"/, `fill="${mix(C.stone2, C.wood3, 0.45)}"`)}${ft.trunk}</g>`);
    const leaves = treeL.add(`<g>${ft.leaves}</g>`);
    const fg = S.layer({ par: 0.8, sh: 6 });
    const bank = c.wave(930, [10, 4], [520, 170]);
    fg.add(sheet().p(c.ridge(bank, -1200, 2800, 1800, 14, 1.2), C.sage).out() + grass(c, { x0: -1200, x1: 2800, y: 930, fn: bank, n: 60, h: 24, color: C.moss }) + flowers(c, { x0: -1200, x1: 2800, y: 930, fn: bank, n: 18, h: 26 }));

    /* the lens: one fig branch close up */
    const lensL = S.layer({ par: 0.3, sh: 6 });
    const lensEl = lensL.add(`<g><path d="M0 -1600V${-LENS.r - 8}" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${sheet().p(c.cut(c.circ(0, 0, LENS.r + 8, 40), 0.5, 6), C.ochre).p(c.cut(c.circ(0, 0, LENS.r, 40), 0.5, 6), mix(C.skyBlue, C.cream, 0.5)).out()}</g>`);
    const BR = c.qbez([-86, 60], [-10, 30], [74, -54], 14);
    const branch = lensL.add(`<g>${sheet().p(c.ribbon(BR, (u) => 16 - u * 10), mix(C.stone2, C.wood3, 0.45)).x(c.ribbon([[20, 12], [40, -30], [34, -64]], (u) => 7 - u * 5), mix(C.stone2, C.wood3, 0.45)).out()}</g>`);
    const sap = lensL.add(`<g><path d="${c.ribbon(BR, (u) => 7 - u * 4)}" fill="${C.wheatGreen}"/></g>`);
    const BUDS = [[-40, 42, -30], [4, 20, -10], [40, -14, 20], [72, -52, 30], [34, -62, -20], [-64, 52, -50]];
    const buds = BUDS.map(([x, y, r], i) => ({ i, x, y, r, bud: lensL.add(`<g><path d="${c.cut([[-5, 0], [0, -14], [5, 0]], 0.2, 3)}" fill="${C.wheatGreen}"/></g>`), leaf: lensL.add(`<g>${figLeaf(c, 24, i % 2 ? C.leaf : mix(C.leaf, C.sage, 0.4))}</g>`) }));

    /* the crown of the Kingdom */
    const kd = S.layer({ par: 0.3, sh: 6 }).add(`<g>${onString(`<g transform="translate(0 52)">${kingdomDisc(c, 46)}</g>`)}</g>`);

    return (t, time) => {
      const T = time;
      const summer = es(t, 1.2, 1.9);
      sk2.fade(summer);
      pose(sunEl, { x: 1240, y: lerp(380, 150, es(t, 1.05, 1.8)), r: T ? Math.sin(T * 0.6) : 0 });
      swing(cl, 380 + (T ? Math.sin(T * 0.1) * 20 : 0), 130, T, 1.2, 0.6, 1);
      birds(T, es(t, 1.2, 1.5));

      /* the lens (v29–30) */
      const kl = es(t, 0.3, 0.55, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      const ly = lerp(-1300, LENS.y, kl), on = kl > 0.002 ? 1 : 0;
      pose(lensEl, { x: LENS.x, y: ly, r: T ? Math.sin(T * 0.8) * 0.8 : 0, o: on });
      pose(branch, { x: LENS.x, y: ly, o: on });
      const sp = es(t, 1.05, 1.3);
      pose(sap, { x: LENS.x, y: ly, o: on * sp });
      buds.forEach((b) => {
        const bk = es(t, 1.15 + b.i * 0.04, 1.3 + b.i * 0.04, ease.back);
        const lk = es(t, 1.35 + b.i * 0.05, 1.6 + b.i * 0.05, ease.back);
        pose(b.bud, { x: LENS.x + b.x, y: ly + b.y, r: b.r, s: bk * (1 - lk), o: on * (bk > 0.02 && lk < 0.98 ? 1 : 0) });
        pose(b.leaf, { x: LENS.x + b.x, y: ly + b.y, r: b.r, s: lk, o: on * (lk > 0.02 ? 1 : 0) });
      });

      /* v30 — the trees come into leaf and flower, the wheat turns gold */
      const lv = es(t, 1.4, 1.75, ease.out);
      pose(leaves, { x: TREE[0], y: TREE[1], s: 0.3 + lv * 0.7, o: lv > 0.01 ? 1 : 0 });
      crowns.forEach((cr) => {
        const k = es(t, 1.3 + cr.i * 0.06, 1.6 + cr.i * 0.06, ease.back);
        pose(cr.el, { x: cr.x, y: cr.y, s: 0.3 + k * 0.7, o: k > 0.01 ? 1 : 0 });
      });
      fade(green, 1 - es(t, 1.55, 1.85));
      fade(goldRows, es(t, 1.55, 1.85));

      /* v31 — the gate of the Kingdom opens on the hill; the crown comes down */
      const gk = es(t, 2.1, 2.35, ease.back);
      const [gx, gy] = [1130, h2.fn(1130) + 6];
      pose(gate, { x: gx, y: gy, s: gk, o: gk > 0.02 ? 1 : 0 });
      pose(gateGlow, { x: gx, y: gy - 60, s: 0.8 + (T ? Math.sin(T * 1.3) * 0.04 : 0), o: es(t, 2.25, 2.5) });
      const kk = es(t, 2.2, 2.5, ease.out);
      pose(kd, { x: 800, y: lerp(-900, 150, kk) + (T ? Math.sin(T * 0.8) * 2 : 0), o: kk > 0.002 ? 1 : 0 });

      S.cam.x = es(t, 0.2, 0.6) * 20 * (1 - es(t, 1.9, 2.2));
      S.cam.y = -es(t, 2.0, 2.5) * 30;
      S.cam.z = 1 + es(t, 0.2, 0.6) * 0.03;
      void blinkAt; void seg; void fade; void bump; void warm;
    };
  },
};
