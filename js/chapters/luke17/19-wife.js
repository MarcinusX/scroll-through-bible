// Łk 17,32–33 — the painted flat of Sodom again, now under a grey sky of ash, the city charred and smoking. On the road
// to the hills Lot hurries on ahead with his daughters; his wife comes behind with a little lamp in her hands.
// "Remember Lot's wife!": she stops, turns round and looks back at the city — and turns white, a pillar of salt, a
// glitter of salt round her feet. "Whoever seeks to save his life loses it": the little flame in her hands shivers and
// goes out, and only a thread of smoke goes up. "But whoever loses his life preserves it": Lot, who left everything
// behind him, climbs on up the road with his daughters, and the morning light rises over the hills before them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { hand } from '../mark2/lib.js';
import { sodomSet, SODOM, LOT, LOTWIFE, DAUGHTERS, SALT, SALT2, clayLamp, tinyFlame, smokeWisp, figure, dust, warm, halo, behindOf, kf, es, ease, bump, seg, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const W0 = [600, 722];         // where the wife stops (phone: further right, clear of Lot and the girls)
const LAMP = `<g transform="rotate(60) translate(-2 4)">`;

function alongRoad(u) {
  const P = SODOM.ROAD, n = P.length - 1, f = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(f), k = f - i;
  return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)];
}
/** a person recoloured as salt (every fill → salt white, shaded) */
function salted(markup) {
  return markup.replace(/fill="#[0-9a-fA-F]{6}"/g, (m) => {
    const h = m.slice(6, 13);
    const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
    const L = (r * 0.3 + g * 0.59 + b * 0.11) / 255;
    return `fill="${mix(SALT2, SALT, Math.min(1, L * 1.1))}"`;
  });
}

export default {
  id: 'lk17-wife',
  enter: 'fly',
  beats: [
    { v: 32 },
    { v: 33, text: 'Kto będzie się starał zachować swoje życie, straci je;' },
    { v: 33, cont: true, text: 'a kto je straci, zachowa je.' },
  ],
  cam: { x: [-260, 60], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const W = S.portrait ? [690, W0[1]] : W0;
    const Z = sodomSet(S, { fire: false, ash: true, burnt: 1 });
    const c = S.c;
    /* the morning over the hills of Zoar (behind the hills) */
    const dawnL = S.layer({ par: 0.12, sh: 0, flat: true });
    behindOf(dawnL, Z.mid);
    const dawn = dawnL.add(`<g opacity="0"><circle r="420" fill="url(#halo-glow)"/><circle r="200" fill="url(#warm-glow)"/></g>`);
    const smokes = [0, 1, 2, 3].map((i) => Z.fx.add(`<g opacity="0">${dust(c, 60, mix(C.storm2, C.soilDark, 0.3))}</g>`));
    /* Lot and his daughters; his wife, and her salt likeness */
    const pc = makeCutter('lk17-lotfam');
    const fam = [[LOT, 0.94], [DAUGHTERS[0], 0.84], [DAUGHTERS[1], 0.8]].map(([o, s], i) => ({ i, s, p: S.puppet(Z.act.add(person(pc, o))) }));
    const glowL = S.layer({ par: 0.42, sh: 0, flat: true });
    behindOf(glowL, Z.act);
    const lampGlow = glowL.add(`<g>${warm(40, 0.9)}</g>`);
    const wife = S.puppet(Z.act.add(person(pc, { ...LOTWIFE, holdF: `${LAMP}${clayLamp(pc)}</g>` })));
    const turned = figure(pc, { ...LOTWIFE, holdF: `${LAMP}${clayLamp(pc)}</g>` }, { x: 0, y: 0, s: 0.9, flip: false, armF: 60, armB: 40, head: -6 });
    const saltEl = Z.act.add(`<g opacity="0">${salted(turned).replace(/<g class="fl"[\s\S]*?<\/g>/, '')}</g>`);
    const glitter = [0, 1, 2, 3, 4, 5].map((i) => Z.act.add(`<g opacity="0"><path d="${c.poly(c.star(0, 0, 4, 1.4, 4, 0))}" fill="#ffffff"/></g>`));
    const wisp = Z.fx.add(`<g opacity="0">${smokeWisp(c, 50)}</g>`);
    const outFlame = Z.fx.add(`<g opacity="0">${tinyFlame(c, 16, false)}</g>`);
    const flameEl = wife.el.querySelector('.fl');

    return (t, time) => {
      const T = time;
      Z.update(T, { ashK: 1 - es(t, 2.0, 2.7) * 0.45, burn: 1 });
      smokes.forEach((el, i) => {
        const k = T ? ((T * 0.12 + i / 4) % 1) : (i + 1) / 5;
        pose(el, { x: 760 + i * 130 + Math.sin(k * 5 + i) * 20, y: 560 - k * 280, s: 0.9 + k * 1.3, o: (1 - k) * 0.7 });
      });

      /* Lot and his daughters go on up the road */
      const go = es(t, 0.0, 2.9, (x) => x);
      fam.forEach((f) => {
        // phone: they go only a little way, so Lot is still on the screen as he walks into the morning (v33b)
        const u = (S.portrait ? 0.34 + go * 0.04 : 0.4 + go * 0.24) - f.i * 0.03;
        const [x, y] = alongRoad(u);
        f.p.set({ x, y: y + f.i * 3, s: f.s * lerp(1, 0.78, go), flip: true, walk: go > 0 && go < 1 ? t * 26 + f.i : undefined, armF: 14 + (f.i === 0 ? es(t, 2.2, 2.6) * 60 : 0), armB: 6 + (f.i === 0 ? es(t, 2.2, 2.6) * 60 : 0), head: -4 - es(t, 2.2, 2.6) * 8, blink: blinkAt(T, f.i + 5) });
      });
      pose(dawn, { x: 300, y: 560, s: 0.6 + es(t, 2.0, 2.7) * 0.6, o: es(t, 2.0, 2.6) });

      /* v32 — she stops and looks back; she turns to salt */
      const walkW = es(t, 0.0, 0.3, (x) => x);
      const turn = es(t, 0.3, 0.4);
      const salt = es(t, 0.55, 0.75);
      const wx = W[0] + (1 - walkW) * 60;
      wife.set({ x: wx, y: W[1], s: 0.9, flip: turn < 0.5, walk: walkW > 0 && walkW < 1 ? t * 26 : undefined, armF: 60, armB: 6 + turn * 34, head: -turn * 6, o: 1 - salt, blink: blinkAt(T, 9) });
      pose(saltEl, { x: wx, y: W[1], o: salt });
      glitter.forEach((g, i) => {
        const k = es(t, 0.6 + i * 0.03, 0.75 + i * 0.03, ease.back);
        pose(g, { x: wx - 30 + i * 12, y: W[1] + 2 - (i % 2) * 6, s: Math.max(0.001, k) * (1 + (T ? Math.sin(T * 6 + i) * 0.3 : 0)), o: k > 0.01 ? 1 : 0 });
      });
      const [hx0, hy0] = hand(wx, W[1], 0.9, false, 60);
      const lx = hx0 + 17 * 0.9 - 12, ly = hy0 - 5 * 0.9 + 4;

      /* v33a — the flame in her hands goes out */
      const gutter = es(t, 1.15, 1.6);
      if (flameEl) pose(flameEl, { x: 19, y: -9, s: 1 + (T ? Math.sin(T * 9) * 0.05 : 0) });
      pose(outFlame, { x: lx + 12, y: ly - 4, sx: 1 - gutter * 0.6, sy: 1 - gutter, r: T ? Math.sin(T * 14) * 10 * gutter : 0, o: salt > 0.5 ? 1 - es(t, 1.5, 1.6) : 0 });
      pose(lampGlow, { x: lx + 8, y: ly - 14, s: 1 - gutter * 0.8, o: (1 - gutter) * 0.9 });
      const wk = seg(t, 1.55, 2.1);
      pose(wisp, { x: lx + 12, y: ly - 8 - wk * 30, s: 0.7 + wk * 0.6, o: wk > 0 ? (1 - wk) * 0.9 : 0 });

      /* v33b — Lot, who left all, into the morning light (see above) */

      S.cam.x = kf(t, [[0, -60], [1, -70], [1.9, -80], [2.6, -140], [3, -150]]);
      S.cam.y = kf(t, [[0, 10], [1, 20], [2, 20], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.1], [1.9, 1.12], [2.6, 1.06], [3, 1.04]]);
    };
  },
};
