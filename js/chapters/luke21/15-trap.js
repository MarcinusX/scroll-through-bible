// Łk 21,34–35 — "So be careful, or your hearts will be loaded down with carousing, drunkenness and cares of this life,
// and that day will come on you suddenly": a painted flat of a room in the evening — a man at a table heaped with food,
// wine jars all round, cup in hand; little storm-clouds of worries gather over his head, a money-bag among them, and on
// his breast his heart has an iron weight hanging from it; his head sinks, he nods off. "For it will come like a snare
// on all those who dwell on the surface of all the earth": a net drops on him out of nowhere and snaps shut — then the
// room flies up, and the whole round earth comes down in its place with the net spreading over it, over every land.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, loaf, cup, wineJar, worryCloud, moneyBag, heart, weight, snare, globe, headAt, handAt, STRING,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';
import { zzz } from '../mark13/lib.js';
import { lowTable } from '../mark2/lib.js';

const { GY, JX, JS } = TT;
const W = 580, H = 280, FX = 800, FY = 300;
const GL = 110;                         // floor line (flat coords)
const MX = -120;                        // the man (flat coords)
const FEASTER = { robe: C.plumRobe, mantle: C.ochreRobe, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun };

function room(c) {
  const s = sheet();
  s.p(c.cut([[-W / 2 - 4, -H / 2 - 4], [W / 2 + 4, -H / 2 - 4], [W / 2 + 4, GL], [-W / 2 - 4, GL]], 0.5, 10), mix(C.plaster, C.dusk, 0.25));
  s.p(c.cut([[140, 20], [140, -50], ...c.arc(180, -50, 40, 36, PI, 2 * PI, 10), [220, 20]], 0.4, 6), mix(C.duskViolet, C.night2, 0.2));
  s.p(c.cut([[-W / 2 - 4, GL], [W / 2 + 4, GL], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.5, 10), mix(C.wood3, C.sand2, 0.4));
  return s.out() + `<g transform="translate(40 ${GL})">${lowTable(c, 220, 40)}</g>` +
    [[-30, GL - 44, 1], [10, GL - 46, 0.8], [70, GL - 44, 1.1], [110, GL - 42, 0.9]].map(([x, y, k], i) => `<g transform="translate(${x} ${y}) scale(${k})">${i % 2 ? loaf(c, 14) : loaf(c, 18, C.wheat)}</g>`).join('') +
    [[-200, GL], [-160, GL + 6], [200, GL], [240, GL + 8], [130, GL + 10]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${wineJar(c, 56 + (i % 2) * 14, i % 2 ? C.pot : C.clay)}</g>`).join('');
}
function netOver(c, r) {
  let d = '';
  for (let k = -3; k <= 3; k++) d += c.ribbon(c.arc(0, 0, Math.abs(k) / 3.5 * r + 0.1, r, -PI / 2, PI / 2, 16).map(([x, y]) => [k < 0 ? -x : x, y]), 1.8);
  for (let k = -3; k <= 3; k++) { const y = (k / 3.6) * r, w = Math.sqrt(Math.max(0, r * r - y * y)); d += c.ribbon([[-w, y], [w, y]], 1.8); }
  let knots = '';
  for (let k = -3; k <= 3; k++) for (let j = -3; j <= 3; j++) { const y = (j / 3.6) * r, w = Math.sqrt(Math.max(0, r * r - y * y)), x = (k / 3.5) * w; knots += c.poly(c.circ(x, y, 2.6, 6)); }
  return `<path d="${d}" fill="${C.rope}"/><path d="${knots}" fill="${C.wood2}"/>`;
}

export default {
  id: 'lk21-trap',
  beats: [
    { v: 34 },
    { v: 35 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const B = T0.bits;
    const flatEl = T0.FL.add(flat(S, room(c), { w: W, h: H }));
    const man = S.puppet(B.add(person(c, { ...FEASTER, pose: 'sit', holdF: `<g transform="translate(0 -4)">${cup(c, C.sun)}</g>` })));
    const cares = [[-60, -150, 'c'], [10, -168, 'c'], [80, -150, 'c'], [-110, -118, 'b']].map(([x, y, k], i) => ({ i, x, y, el: B.add(`<g>${k === 'b' ? `<g transform="scale(.8)">${moneyBag(c)}</g>` : `<g transform="scale(1.15)">${worryCloud(c)}</g>`}</g>`) }));
    const hrt = B.add(`<g>${heart(c, 10)}</g>`);
    const wt = B.add(`<g><path d="M0 0V26" stroke="${C.inkSoft}" stroke-width="1.4"/><g transform="translate(0 22)">${weight(c, 30)}</g></g>`);
    const zz = B.add(`<g>${zzz(c)}</g>`);
    const net = B.add(`<g>${snare(c, 190, 140)}</g>`);
    const G = 118;
    const globeEl = B.add(`<g><path d="M0 -1600V${-G - 4}" stroke="${STRING}" stroke-width="1.2"/>${globe(c, G)}</g>`);
    const gnet = B.add(`<g>${netOver(c, G)}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { look: es(t, 0.1, 0.4) });
      const warn = bump(t, 0.02, 0.9);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + warn * 50 + es(t, 1.4, 1.6) * 70, armB: 10 + warn * 110 + es(t, 1.4, 1.6) * 60, head: -warn * 4 - es(t, 1.4, 1.6) * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, 0.7 * (warn + es(t, 1.02, 1.2)), T, { spread: 1.8 });

      /* the room (v34) */
      const kF = es(t, 0.0, 0.2, ease.out) * (1 - es(t, 1.38, 1.55, ease.in));
      const fy = lerp(-1300, FY, kF), on = kF > 0.002 ? 1 : 0;
      pose(flatEl, { x: FX, y: fy, o: on });
      const mx = FX + MX, my = fy + GL;
      const nod = es(t, 0.7, 0.85) * (1 - es(t, 1.05, 1.1));
      const caught = es(t, 1.05, 1.12);
      man.set({ x: mx, y: my, s: 0.86, flip: false, o: on, armF: 70 - nod * 40 + caught * 30, armB: caught * 140, head: nod * 22 - caught * 10, lean: nod * 10, blink: nod > 0.5 ? 1 : blinkAt(T, 3) });
      cares.forEach((cr) => {
        const k = es(t, 0.3 + cr.i * 0.07, 0.45 + cr.i * 0.07, ease.back);
        pose(cr.el, { x: mx + cr.x, y: my + cr.y + (T ? Math.sin(T * 1.5 + cr.i) * 3 : 0), s: k, o: on * (k > 0.02 ? 1 : 0) });
      });
      const hk = es(t, 0.55, 0.7, ease.back);
      const [bx, byy] = [mx + 8 * 0.86, my - (118 - 62) * 0.86];
      pose(hrt, { x: bx, y: byy, s: hk, o: on * (hk > 0.02 ? 1 : 0) });
      const drag = es(t, 0.62, 0.8);
      pose(wt, { x: bx, y: byy + 8, s: hk * 0.9, r: T ? Math.sin(T * 1.2) * 3 : 0, o: on * (hk > 0.02 ? 1 : 0) });
      void drag;
      const zk = es(t, 0.8, 0.9) * (1 - es(t, 1.05, 1.08));
      pose(zz, { x: mx + 34, y: my - 120 - (T ? (T * 10) % 8 : 0), s: zk, o: on * (zk > 0.02 ? 1 : 0) });

      /* v35 — the snare snaps shut; the whole earth under the net */
      const dn = es(t, 1.02, 1.1, ease.in);
      pose(net, { x: mx + 8, y: lerp(fy - 500, my - 150, dn), s: 1, sx: 1 - bump(t, 1.08, 1.2) * 0.12, o: on * (dn > 0.01 ? 1 : 0) });
      const kg = es(t, 1.45, 1.7, ease.out);
      const gy = lerp(-1300, 290, kg), gOn = kg > 0.002 ? 1 : 0;
      pose(globeEl, { x: FX, y: gy, r: T ? Math.sin(T * 0.5) * 2 : 0, o: gOn });
      const spread = es(t, 1.65, 1.85);
      pose(gnet, { x: FX, y: gy - G, sy: Math.max(0.01, spread), oy: -G, o: gOn * (spread > 0.01 ? 1 : 0) });

      S.cam.y = -es(t, 0.0, 0.4) * 30;
      S.cam.z = 1 + es(t, 0.0, 0.4) * 0.04;
      void seg; void fade; void shade; void handAt; void tr;
    };
  },
};
