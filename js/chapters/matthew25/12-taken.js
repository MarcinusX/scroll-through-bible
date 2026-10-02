// Mt 25,28–30 — "Take the talent from him and give it to the one who has ten": the steward lifts the dull talent from
// the table and it flies to the heap of ten, where it shines again. "To everyone who has, more will be given": the heap
// swells into a glittering hill of gold. "From the one who has not, even what he has will be taken": the servant's
// hands are empty, and even his dirty cloth is pulled away. "Throw the useless servant out, into the darkness": the gate
// opens on a darkness that has fallen outside, and two of the household lead him out; the gate shuts. Over the wall, in
// the dark, a small figure sits with his face in his hands: "there will be weeping and grinding of teeth."
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { estateSet, ES, RK, court, tablePos, pilePos, talent, talentHeap, HOUSEHOLD, SERV1, tint, NIGHTC, sparkle, kf, moving } from './lib.js';

const G = ES.G;

export default {
  id: 'mt25-taken',
  parable: true,
  beats: [
    { v: 28 },
    { v: 29, text: 'Każdemu bowiem, kto ma, będzie dodane, tak że nadmiar mieć będzie.' },
    { v: 29, cont: true, text: 'Temu zaś, kto nie ma, zabiorą nawet to, co ma.' },
    { v: 30, text: 'A sługę nieużytecznego wyrzućcie na zewnątrz - w ciemności!' },
    { v: 30, cont: true, text: 'Tam będzie płacz i zgrzytanie zębów".' },
  ],
  cam: { x: [-20, 460], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    let outside = null;
    const E = estateSet(S, {
      beyond: (S2) => {
        const L = S2.layer({ par: 0.4, sh: 3 });
        outside = S2.puppet(L.add(tint(person(S2.c, { ...SERV1, pose: 'sit' }), NIGHTC, 0.35)));
        const tear = L.add(`<g><path d="${S2.c.cut([[0, -6], [3.4, 0], [0, 3], [-3.4, 0]], 0.1, 2)}" fill="${C.skyVeil}"/></g>`);
        return { L, tear };
      },
    });
    const c = E.c;
    const L = S.layer({ par: E.P, sh: 5 });
    const heap = L.add(`<g>${talentHeap(c, { w: 150, h: 90 })}</g>`);
    const K = court(S, L);
    const P = S.portrait;
    const H2 = P ? 1055 : 1110;                 // where the second of the household stands (phone: clear of the edge)
    const hh = HOUSEHOLD.slice(0, 2).map((o, i) => ({ i, p: S.puppet(L.add(person(c, o))), seed: c.rr(0, 9) }));
    const cloth = L.add(`<g>${sheet().p(c.cut([[-22, -6], [0, -12], [24, -4], [20, 8], [-18, 8]], 0.8, 4), mix(C.linen2, C.soil, 0.25)).out()}</g>`);
    const shine = L.add(`<g>${talent(c)}</g>`);
    const fx = S.layer({ par: E.P, sh: 6 });
    const sp = Array.from({ length: 8 }, () => fx.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      E.update(T);
      E.joy(1);
      K.masterSit.set({ o: 0 });
      K.s5.set({ x: RK.DOOR5, y: G, s: 0.9, armF: 30 + es(t, 1.05, 1.3) * 40, head: -2, blink: blinkAt(T, 3) });
      K.s2.set({ x: RK.DOOR2, y: G + 3, s: 0.9, armF: 30, blink: blinkAt(T, 5) });
      K.g2.forEach((el, k) => { const [tx, ty] = tablePos(2, 2, k % 2); pose(el, { x: tx - 16 + (k < 2 ? 0 : 32), y: ty, s: 0.72 }); });

      /* v28 — taken from him, given to the one with ten */
      const lift = es(t, 0.1, 0.3);
      const fly = es(t, 0.3, 0.6);
      const [dx, dy] = tablePos(1, 1, 0);
      const [px, py] = tablePos(5, 11, 10);
      const hx = 996, hy = G - 110;
      pose(K.dull, { x: lerp(lerp(dx, hx, lift), px, fly), y: lerp(lerp(dy, hy, lift), py, fly) - Math.sin(fly * Math.PI) * 60, s: 0.72, o: 1 - seg(t, 0.56, 0.62) });
      pose(shine, { x: px, y: py, s: 0.72, o: seg(t, 0.56, 0.62) * (1 - es(t, 1.2, 1.3)) });
      K.g5.forEach((el, k) => {
        if (k > 9) { pose(el, { o: 0 }); return; }
        const [tx, ty] = tablePos(5, 11, k);
        pose(el, { x: tx, y: ty, s: 0.72, o: 1 - es(t, 1.2, 1.3) });
      });
      /* v29a — more is given: the heap swells over the table */
      const grow = es(t, 1.1, 1.45, ease.back);
      pose(heap, { x: 772, y: RK.TOP + 2, sy: Math.max(0.01, grow), sx: 0.4 + grow * 0.6, s: 0.8, oy: 0, o: grow > 0.01 ? 1 : 0 });
      sp.forEach((el, i) => { const k = bump(t, 1.2 + i * 0.05, 1.9 + i * 0.03); const a = i * 0.8 + T * 0.5; pose(el, { x: 772 + Math.cos(a) * 80, y: RK.TOP - 60 + Math.sin(a) * 40, s: k, r: T * 40, o: k }); });

      /* the master: points (v28), turns to the household (v30a) */
      const orderK = bump(t, 0.05, 0.6) + es(t, 3.05, 3.2) * (1 - es(t, 3.7, 3.9));
      K.masterStand.set({ x: RK.MS + 10, y: G, s: 0.98, armF: 30 + orderK * 60, armB: 10 + bump(t, 1.05, 1.8) * 90, head: -2, blink: blinkAt(T, 1) });
      /* the household servant who takes it; then both lead him out (v30a) */
      const lead = es(t, 3.2, 3.95, (u) => u);
      const OUT = [[3.2, 930], [3.9, ES.GATE + 6]];
      const ox = kf(t, OUT, (u) => u);
      const gone = seg(t, 3.85, 3.95);
      hh.forEach((h) => {
        const HX = [[0.0, 1060 + h.i * 60], [0.1, h.i ? H2 : 990], [0.6, h.i ? H2 : 990], [3.1, h.i ? 1000 : 880], [3.2, ox + (h.i ? 44 : -44)], [3.9, ES.GATE + 6 + (h.i ? 30 : -30)]];
        const x = kf(t, HX, (u) => u);
        h.p.set({ x, y: G + 4, s: 0.9, flip: t < 3.2 ? true : false, o: 1 - gone, walk: moving(t, HX) ? x * 0.07 : undefined, armF: h.i ? 20 : 20 + lift * (1 - fly) * 90 + (t > 3.2 ? 40 : 0), head: -2, blink: blinkAt(T, h.seed) });
      });
      /* v29b — even what he has is taken; v30 he is led out */
      const up = es(t, 2.05, 2.25);
      const kneel = t < 3.1 ? 1 : 0;
      K.s1k.set({ x: 936, y: G + 6, s: 0.9, flip: true, o: kneel, armF: 30 + up * 60, armB: 10 + up * 50, head: 18 - up * 10, blink: blinkAt(T, 7) });
      K.s1.set({ x: ox, y: G + 6, s: 0.9, flip: false, o: (1 - kneel) * (1 - gone), walk: t > 3.2 && t < 3.9 ? ox * 0.07 : undefined, armF: 10, head: 16 });
      const pull = es(t, 2.3, 2.55);
      pose(cloth, { x: lerp(960, P ? 1040 : 1080, pull), y: lerp(G - 70, G - 100, pull) - Math.sin(pull * Math.PI) * 40, r: pull * 30, s: 0.9, o: t > 2.2 && pull < 1 ? 1 : 0 });
      pose(K.pack, { o: 0 });

      /* the gate opens on the darkness, and shuts */
      E.gateOpen(es(t, 3.05, 3.25) * (1 - es(t, 4.02, 4.2)));
      E.dark.fade(es(t, 3.0, 3.4) * 0.92);
      /* v30b — over the wall, in the dark */
      const sit = es(t, 4.1, 4.3);
      outside.set({ x: S.portrait ? 1210 : 1190, y: 578, s: 0.8, flip: true, o: sit, armF: 150, armB: 140, head: 18, lean: 6 });
      const tk = T ? (T * 0.6) % 1 : 0.5;
      pose(E.out.tear, { x: S.portrait ? 1195 : 1175, y: 452 + tk * 36, o: sit * (1 - tk) });

      // phone: the camera already follows them to the gate during v30a, and goes on far enough to show the dark beyond
      S.cam.x = P ? es(t, 3.05, 3.6) * 300 + es(t, 3.9, 4.3) * 150 : es(t, 3.9, 4.3) * 180;
      S.cam.z = 1 + es(t, 1.0, 1.3) * 0.04 * (1 - es(t, 1.9, 2.1)) + es(t, 3.95, 4.3) * 0.06;
      S.cam.y = -es(t, 3.95, 4.3) * 30;
    };
  },
};
