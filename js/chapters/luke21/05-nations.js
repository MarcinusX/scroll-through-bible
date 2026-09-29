// Łk 21,10–11 — "Then He said to them": a parchment map of the world comes down on its rods over the court. "Nation
// will rise against nation, and kingdom against kingdom": little armies march at each other across it, a crown over
// each, clashes flare where they meet. "There will be great earthquakes, famines and plagues in various places": the
// map shakes and cracks, empty bowls come down on strings, a grey pall creeps over the towns. "There will be terrors
// and great signs from heaven": the map flies up, the sky over the Temple goes dark, a comet sweeps across it and
// strange lights burn — the people shrink back and look up.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, altGroups, swapGroups, mapSheet, toySoldier, pennant, crownIcon, emptyBowl, comet, headAt, STRING, STORM,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const BW = 520, BH = 262;
const CRACK = [[-248, 150], [-190, 138], [-150, 156], [-96, 128], [-44, 148], [6, 122], [52, 144], [100, 118], [150, 136], [200, 112], [250, 126]];
const TOWNS = [[-110, 110], [-20, 200], [120, 70], [30, 40], [200, 170], [-40, 90]];

function mapScene(c) {
  const s = sheet();
  const coast = [[-BW / 2 + 4, 8], [-150, 8], [-162, 40], [-140, 70], [-170, 110], [-150, 150], [-176, 196], [-160, BH - 4], [-BW / 2 + 4, BH - 4]];
  s.p(c.cut(coast, 0.8, 7), mix(C.lake, C.parchment, 0.4));
  let waves = '';
  for (let i = 0; i < 9; i++) { const x = -BW / 2 + 20 + (i % 3) * 30, y = 30 + i * 24; waves += c.ribbon(c.arc(x, y, 8, 3, PI, 2 * PI, 5), 1.2) + c.ribbon(c.arc(x + 16, y, 8, 3, PI, 2 * PI, 5), 1.2); }
  s.x(waves, shade(C.lake2, -0.1), 'opacity=".6"');
  s.x(c.ribbon(c.qbez([60, 8], [20, 120], [80, BH - 4], 14), 3) + c.ribbon(c.qbez([200, 30], [160, 100], [80, 120], 10), 2), mix(C.lake2, C.parchment, 0.2), 'opacity=".8"');
  let mt = '';
  [[-90, 60], [-60, 52], [-30, 66], [150, 210], [180, 200], [210, 214], [-60, 226], [200, 60]].forEach(([x, y]) => { mt += c.cut([[x - 14, y + 8], [x, y - 14], [x + 14, y + 8]], 0.3, 4); });
  s.p(mt, mix(C.rock2, C.parchment, 0.3));
  let tw = '';
  TOWNS.forEach(([x, y]) => { tw += c.cut(c.rect(x - 6, y - 6, 12, 12), 0.2, 3) + c.cut([[x - 8, y - 6], [x, y - 13], [x + 8, y - 6]], 0.2, 3); });
  s.p(tw, C.clay);
  let rd = '';
  c.qbez([-110, 110], [0, 150], [120, 70], 18).forEach(([x, y], i) => { if (i % 2) rd += c.poly(c.circ(x, y, 1.8, 6)); });
  c.qbez([-20, 200], [80, 180], [200, 170], 16).forEach(([x, y], i) => { if (i % 2) rd += c.poly(c.circ(x, y, 1.8, 6)); });
  s.x(rd, C.inkSoft, 'opacity=".5"');
  s.x(c.poly(c.star(214, 34, 16, 4, 4, 0)), C.terracotta, 'opacity=".6"');
  return s.out();
}

export default {
  id: 'lk21-nations',
  beats: [
    { v: 10 },
    { v: 11, text: 'Będą silne trzęsienia ziemi, a miejscami głód i zaraza;' },
    { v: 11, cont: true, text: 'ukażą się straszne zjawiska i wielkie znaki na niebie.' },
  ],
  cam: { x: [-20, 20], y: [-60, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S, { sky2: STORM });
    const c = S.c;
    const up = altGroups(T0, 'afraid', { head: [-16, -10] });

    /* the map */
    const pB = T0.FL;
    const SB = 1.12;
    const mapEl = pB.add(`<g>${mapSheet(c, BW, BH)}${mapScene(c)}</g>`);
    const crackEl = pB.add(`<g><path d="${c.ribbon(CRACK, (u) => 3 + Math.sin(u * PI) * 5, 2)}" fill="${mix(C.soilDark, C.night2, 0.3)}"/></g>`);
    const pall = TOWNS.slice(0, 4).map(([x, y], i) => ({ x, y, i, el: pB.add(`<g><path d="${c.cut(c.blob(0, 0, 34, 18, 10, 0.25), 0.8, 4)}" fill="${mix(C.storm2, C.olive, 0.3)}" opacity=".7"/></g>`) }));
    const ARMY = [
      { col: C.terracotta, from: [-230, 190], to: [-80, 176], n: 4 },
      { col: C.teal2, from: [230, 176], to: [60, 170], n: 4 },
      { col: C.olive, from: [-40, 20], to: [-30, 90], n: 3 },
      { col: C.plumRobe, from: [240, 60], to: [110, 84], n: 3 },
    ].map((a, g) => ({
      ...a, g, dir: a.to[0] > a.from[0] ? 1 : -1,
      men: Array.from({ length: a.n }, (_, i) => ({ i, el: pB.add(`<g>${i === 0 ? pennant(c, a.col, { h: 34, w: 18 }) : ''}<g transform="translate(${i === 0 ? 8 : 0} 0)">${toySoldier(c, a.col, { h: 22 })}</g></g>`) })),
      crown: pB.add(`<g>${crownIcon(c, 22, g % 2 ? mix(C.sun, C.stone, 0.3) : C.sun)}</g>`),
    }));
    const clashes = [[-10, 170], [80, 110], [-40, 110]].map(([x, y], i) => ({ x, y, i, el: pB.add(`<g><path d="${c.poly(c.star(0, 0, 16, 5, 8, 0.2))}" fill="${C.halo}"/><path d="${c.poly(c.star(0, 0, 8, 3, 8, 0))}" fill="${C.cream}"/></g>`) }));
    const bowls = [0, 1, 2].map((i) => ({ i, el: T0.bits.add(`<g><path d="M0 -1600V-16" stroke="${STRING}" stroke-width="1.2"/><path d="M-24 -16L0 -40L24 -16" stroke="${STRING}" stroke-width="1.2" fill="none"/>${emptyBowl(c, 48, [C.pot, C.clay, shade(C.pot, 0.1)][i])}</g>`) }));

    /* the signs in the sky */
    const skyL = S.layer({ par: 0.04, sh: 3, rise: 0 });
    T0.set.hangL.el.before(skyL.el);
    const cometEl = skyL.add(`<g>${comet(c, 260)}</g>`);
    const fires = [[330, 240], [560, 130], [1250, 330]].map(([x, y], i) => ({ x, y, i, el: skyL.add(`<g><circle r="40" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 16, 6, 7, 0.3), 0.3, 3)}" fill="${[C.lampFlame, C.sunDeep, C.terracotta][i]}"/></g>`) }));
    const redMoon = skyL.add(`<g><circle r="44" fill="url(#warm-glow)" opacity=".7"/><path d="${c.cut(c.circ(0, 0, 26, 30), 0.3, 4)}" fill="${mix(C.terracotta, C.clay, 0.3)}"/></g>`);

    return (t, time) => {
      const T = time;
      const dark = es(t, 2.05, 2.5);
      T0.update(t, T, { sunDY: dark * 300, sunO: 1 - dark, dis: false, crowd: false });
      T0.sk2.layer.fade(dark);
      T0.dimL.fade(dark);
      T0.starL.fade(dark * 0.8);
      const fear = es(t, 2.3, 2.37);
      swapGroups(T0, up, fear);

      /* Jesus */
      const show = es(t, 0.05, 0.3);
      const grief = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.2));
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + show * 70 * (1 - grief * 0.6) + es(t, 2.1, 2.3) * 20, armB: 10 + es(t, 2.1, 2.3) * 100, head: -show * 6 + grief * 8 - es(t, 2.1, 2.3) * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, (show * (1 - es(t, 2.9, 3))) * 0.7, T, { spread: 1.8 });
      const look = es(t, 2.1, 2.4);
      T0.peter.set({ x: TT.PX, y: GY + 10, s: 0.98, flip: false, head: -4 - look * 14 + es(t, 1.2, 1.5) * 6 * (1 - look), armF: look * 70, armB: look * 110, lean: -look * 5, blink: blinkAt(T, 3) });
      T0.john.set({ x: TT.JOX, y: GY + 10, s: 0.98, flip: true, head: -4 - look * 14 + es(t, 1.2, 1.5) * 6 * (1 - look), armF: look * 90, armB: look * 60, lean: -look * 5, blink: blinkAt(T, 5) });

      /* the map: armies (v10), quake, famine, plague (v11a); flies up (v11b) */
      const bIn = es(t, 0.02, 0.32, ease.back) * (1 - es(t, 2.0, 2.25, ease.in));
      const quake = bump(t, 1.05, 1.7);
      const shake = (T ? Math.sin(T * 38) * 5 : 0) * quake + Math.sin(t * 90) * 4 * quake;
      const bx = 800 + shake, by = lerp(-900, 150, bIn);
      const bOn = bIn > 0.002 ? 1 : 0;
      pose(mapEl, { x: bx, y: by, s: SB, r: shake * 0.1, o: bOn });
      const onB = (lx, ly) => [bx + lx * SB, by + ly * SB];
      ARMY.forEach((a) => {
        const k = es(t, 0.15 + a.g * 0.1, 0.8 + a.g * 0.05);
        a.men.forEach((m) => {
          const lx = lerp(a.from[0], a.to[0], k * (1 - m.i * 0.04)) - a.dir * m.i * 17;
          const ly = lerp(a.from[1], a.to[1], k) + (m.i % 2) * 4;
          const [x, y] = onB(lx, ly);
          const bob = k > 0 && k < 1 ? Math.abs(Math.sin(lx * 0.3)) * 2 : 0;
          pose(m.el, { x, y: y - bob, s: SB * 1.15, sx: a.dir, o: bOn * Math.min(1, k * 4) });
        });
        const cr = es(t, 0.35 + a.g * 0.1, 0.55 + a.g * 0.1, ease.back);
        const [cx, cy] = onB(lerp(a.from[0], a.to[0], k), lerp(a.from[1], a.to[1], k) - 46);
        pose(a.crown, { x: cx, y: cy + (T ? Math.sin(T * 2 + a.g) * 2 : 0), s: cr * SB, o: bOn * (cr > 0.01 ? 1 : 0) });
      });
      clashes.forEach((cl) => {
        const k = t > 0.7 && t < 1.2 ? 0.7 + 0.3 * (T ? Math.sin(T * 7 + cl.i * 2) : 1) : 0;
        const [x, y] = onB(cl.x, cl.y);
        pose(cl.el, { x, y, s: k * es(t, 0.7 + cl.i * 0.05, 0.85 + cl.i * 0.05) * (1 - es(t, 1.1, 1.25)), r: T * 40, o: bOn });
      });
      const ck = es(t, 1.08, 1.4);
      const [c0x, c0y] = onB(-248, 0);
      pose(crackEl, { x: c0x, y: c0y, s: SB, sx: Math.max(0.001, ck), ox: -248, o: bOn * (ck > 0.01 ? 1 : 0) });
      pall.forEach((p) => {
        const k = es(t, 1.35 + p.i * 0.06, 1.6 + p.i * 0.06);
        const [x, y] = onB(p.x + (T ? Math.sin(T * 0.6 + p.i) * 6 : 0), p.y - 6);
        pose(p.el, { x, y, s: SB * (0.5 + k * 0.6), o: bOn * k });
      });
      bowls.forEach((b) => {
        const k = es(t, 1.25 + b.i * 0.1, 1.5 + b.i * 0.1, ease.back) * (1 - es(t, 2.0, 2.2, ease.in));
        pose(b.el, { x: [470, 1130, 1210][b.i], y: lerp(-300, [372, 330, 432][b.i], k) + (T ? Math.sin(T * 1.1 + b.i) * 2 : 0), r: (T ? Math.sin(T * 0.9 + b.i * 2) * 4 * k : 0) + (b.i - 1) * 6, o: k > 0.01 ? 1 : 0 });
      });

      /* v11b — the comet, burning lights, a red moon */
      const ck2 = seg(t, 2.2, 2.95);
      pose(cometEl, { x: lerp(150, 1350, ck2), y: lerp(70, 170, ck2) - Math.sin(ck2 * PI) * 30, r: 12, o: ck2 > 0 && ck2 < 1 ? 1 : ck2 >= 1 ? 1 : 0 });
      fires.forEach((f) => {
        const k = es(t, 2.3 + f.i * 0.1, 2.5 + f.i * 0.1, ease.back);
        pose(f.el, { x: f.x, y: f.y, s: k * (1 + (T ? Math.sin(T * 5 + f.i) * 0.08 : 0)), r: T * 30, o: k > 0.01 ? 1 : 0 });
      });
      const rm = es(t, 2.15, 2.4);
      pose(redMoon, { x: 1070, y: 270, s: 0.6 + rm * 0.4, o: rm });

      S.cam.y = -es(t, 0.02, 0.4) * 30 * (1 - es(t, 2.0, 2.5)) - es(t, 2.1, 2.6) * 50;
      S.cam.z = 1 + es(t, 0.1, 0.5) * 0.03;
      void fade; void tr;
    };
  },
};
