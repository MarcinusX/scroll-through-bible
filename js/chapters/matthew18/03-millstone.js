// Mt 18,6–7 — by the shore path, told as symbolic paper theatre with Jesus seated in front. A little one comes up the
// path towards Him with a small lamp (one who believes); a shadow of a man rolls a dark stone into the way, and the
// child trips — the flame gutters. Better a millstone: it comes down from the flies over a painted panel of the deep
// sea, and drops, and sinks to the bottom (no one is shown). Woe to the world: the panel goes up and a globe comes
// down, and dark stones spring up all over it while Jesus lifts His hand in sorrow; the child gets up and runs to Him.
// Woe to the man through whom they come: a grey cloud gathers over the shadow-man, Jesus points at him, the stone
// slips from his hand — and still the stones keep coming, one after another, on the world.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, olive, cloud, grass, reeds } from '../../assets/nature.js';
import { stormCloud, fish } from '../../assets/things.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { DAY, child, millstone, candle, shadowPerson, kf, hand, PI } from './lib.js';
import { globe } from '../mark8/lib.js';

const P = 0.5, GY = 682;
const PATH = [[1180, 670], [1000, 674], [880, 678], [760, 682], [640, 686]];
const STONE_X = 870;
const PAN = { x: 930, y: 110, w: 250, h: 300 };      // the sea panel (top centre)
const GL = { x: 930, y: 300, r: 118 };                // the globe

function seaPanel(c) {
  const { w, h } = PAN, s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 12, -6, w + 24, h + 18), 0.5, 8), C.wood2);
  s.p(c.cut(c.rect(-w / 2, 4, w, 60), 0.4, 8), mix(C.skyBlue, C.cream, 0.4));
  const surf = [];
  for (let x = -w / 2; x <= w / 2; x += 12) surf.push([x, 64 + Math.sin(x / 14) * 3]);
  s.p(c.poly([...surf, [w / 2, h], [-w / 2, h]]), C.lake);
  s.p(c.cut([[-w / 2, 130], [w / 2, 124], [w / 2, h], [-w / 2, h]], 0.6, 10), C.lake3);
  s.p(c.cut([[-w / 2, 200], [w / 2, 206], [w / 2, h], [-w / 2, h]], 0.6, 10), C.lakeDeep);
  s.p(c.cut([[-w / 2, 262], [w / 2, 256], [w / 2, h], [-w / 2, h]], 0.6, 10), mix(C.lakeDeep, C.night, 0.4));
  let weed = '';
  for (let i = 0; i < 9; i++) { const x = c.rr(-w / 2 + 12, w / 2 - 12); weed += c.ribbon(c.qbez([x, h - 2], [x + c.rr(-14, 14), h - 30], [x + c.rr(-10, 10), h - c.rr(40, 70)], 8), (u) => 5 - u * 4); }
  s.p(weed, mix(C.moss2, C.lakeDeep, 0.3));
  s.x(c.ribbon(surf, 2), C.foam, 'opacity=".8"');
  return `${s.out()}<g transform="translate(-70 170) scale(.8)">${fish(c, { color: C.lake2 })}</g><g transform="translate(60 230) scale(-.7 .7)">${fish(c, { color: mix(C.lake2, C.lakeDeep, 0.3) })}</g>`;
}

export default {
  id: 'mt18-millstone',
  beats: [
    { v: 6 },
    { v: 7, text: 'Biada światu z powodu zgorszeń!' },
    { v: 7, cont: true, text: 'Muszą wprawdzie przyjść zgorszenia, lecz biada człowiekowi, przez którego dokonuje się zgorszenie.' },
  ],
  cam: { x: [-20, 60], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const gloom = sky(S, ['#9aa0b4', '#d6ccc0', '#ecdcc4'], { name: 'gloom' }).layer;
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl = hanging(hangL, cloud(c, 170), { x: 480, y: 140, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.lavender, 0.2) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(band(c, { y: 540, amps: [10, 5, 2], lens: [800, 280, 110], color: C.hillMid }).markup + olive(c, 1300, 560, 0.8) + olive(c, 260, 556, 0.7));
    const G = S.layer({ par: P, sh: 3 });
    const g = sheet();
    g.p(c.cut([[-900, 610], [2500, 606], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.4));
    g.p(c.ribbon(PATH.map(([x, y]) => [x, y + 4]).concat([[-900, 692]]), 26, 2), mix(C.sand, C.sand2, 0.5));
    G.add(g.out());
    G.add(grass(c, { x0: -600, x1: 2200, y: 620, n: 40, h: 12, color: C.olive }) + reeds(c, 1250, 660, 9, 80) + rock(c, 500, GY + 24, 170, 42, C.rock2));

    /* from the flies: the deep-sea panel and the millstone; then the world */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const panel = hanging(fly, seaPanel(c), { x: PAN.x, y: PAN.y, len: 900 });
    const mStone = hanging(fly, `<g transform="scale(.62)">${millstone(c, 50)}</g>`, { x: PAN.x, y: 0, len: 900 });
    const mObj = mStone.querySelector('.obj');
    const bubbles = fly.add(`<g opacity="0">${[0, 1, 2, 3].map((i) => `<circle cx="${(i - 1.5) * 9}" cy="${-i * 14}" r="${3 + (i % 2)}" fill="${C.foam}" opacity=".8"/>`).join('')}</g>`);
    const world = hanging(fly, `<circle r="${GL.r * 1.5}" fill="url(#halo-glow)" opacity=".5"/><g transform="scale(${GL.r / 60})">${globe(c, 60)}</g>`, { x: GL.x, y: 0, len: 900 });
    const STONES = Array.from({ length: 12 }, (_, i) => {
      const a = c.rr(0, PI * 2), r = GL.r * Math.sqrt(c.rr(0.05, 0.8));
      return { i, dx: Math.cos(a) * r, dy: Math.sin(a) * r, el: fly.add(`<g>${sheet().p(c.cut(c.blob(0, 0, c.rr(9, 13), c.rr(7, 10), 8, 0.3), 0.8, 3), mix(C.storm2, C.soilDark, 0.5)).out()}</g>`) };
    });

    /* the shadow-man and his stone, the little one, Jesus */
    const L = S.layer({ par: P, sh: 5 });
    const dark = '#3b3148';
    const cloudW = L.add(`<g opacity="0">${stormCloud(c, 170, mix(C.storm, C.stone2, 0.3), mix(C.storm2, C.stone2, 0.2))}</g>`);
    const shade1 = S.puppet(L.add(shadowPerson(c, { hairStyle: 'wrap', beard: 'short', holdF: '' }, dark)));
    const heldStone = L.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 13, 10, 9, 0.3), 1, 4), mix(C.storm2, C.soilDark, 0.5)).out()}</g>`);
    const stone = L.add(`<g>${sheet().p(c.cut(c.blob(0, -12, 18, 13, 10, 0.3), 1.2, 4), mix(C.storm2, C.soilDark, 0.5)).out()}</g>`);
    const kidSt = S.puppet(L.add(child(c, { holdF: `<g transform="rotate(60) translate(0 6) scale(.42)">${candle(c, 30)}</g>` })));
    const kidFall = S.puppet(L.add(child(c, { pose: 'kneel', holdF: `<g transform="rotate(70) translate(0 6) scale(.42)">${candle(c, 30)}</g>` })));
    const flames = [kidSt, kidFall].map((p) => p.el.querySelector('.flame'));
    const glows = [kidSt, kidFall].map((p) => p.el.querySelector('.glow'));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    return (t, time) => {
      const T = time;
      swing(cl, 480 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6);
      gloom.fade(es(t, 1.0, 1.4) * 0.8 + es(t, 2.0, 2.3) * 0.2);

      /* v6 — the stone in the way; the little one falls */
      const roll = es(t, 0.12, 0.32);
      shade1.set({ x: 1010, y: 640, s: 0.86, flip: true, armF: 30 + bump(t, 0.05, 0.4) * 60 + es(t, 2.2, 2.4) * 30, armB: es(t, 2.35, 2.55) * 70, head: -es(t, 2.3, 2.5) * 10, lean: -es(t, 2.35, 2.6) * 8, o: 1, blink: 0 });
      const [hx, hy] = hand(1010, 640, 0.86, true, 30 + bump(t, 0.05, 0.4) * 60);
      const drop = es(t, 2.45, 2.7, ease.in);
      pose(heldStone, { x: hx, y: lerp(hy + 4, 646, drop), r: drop * 90, o: t < 0.12 || t > 2.0 ? 1 : 0 });
      pose(stone, { x: lerp(980, STONE_X, roll), y: GY, r: -roll * 260, o: es(t, 0.1, 0.14) });

      const walk = es(t, 0.05, 0.36, (u) => u);
      const trip = es(t, 0.36, 0.42);
      const up = es(t, 1.35, 1.42);
      const run = es(t, 1.4, 1.8);
      const kx = t < 1.4 ? lerp(1160, STONE_X + 26, walk) : lerp(STONE_X - 10, 636, run);
      kidSt.set({ x: kx, y: GY - 4, s: 0.56, flip: true, o: (1 - trip) + up, walk: (walk > 0 && walk < 1) || (run > 0 && run < 1) ? kx * 0.1 : undefined, armF: 60, armB: run * 40, head: -4, blink: blinkAt(T, 6) });
      kidFall.set({ x: STONE_X - 44, y: GY, s: 0.56, flip: true, o: trip * (1 - up), lean: -trip * 20, armF: 70, armB: 50, head: 10, blink: blinkAt(T, 6) });
      const dim = trip * (1 - up * 0.8);
      flames.forEach((f) => pose(f, { x: 0, y: -50, sy: 1 - dim * 0.6 + Math.sin(T * 8) * 0.05, sx: 1 - dim * 0.3, o: 1 - dim * 0.5 }));
      glows.forEach((g2) => fade(g2, 1 - dim * 0.7));

      /* the panel of the deep and the millstone */
      const pIn = es(t, 0.28, 0.5, ease.back) * (1 - es(t, 1.02, 1.25));
      swing(panel, PAN.x, lerp(-900, PAN.y, pIn), T, 0.8 * (1 - pIn * 0.6), 0.7, 1);
      const mIn = es(t, 0.42, 0.56, ease.back);
      const fall = es(t, 0.6, 0.72, ease.in), sink = es(t, 0.72, 0.98, ease.out);
      swing(mStone, PAN.x, lerp(-900, PAN.y - 20, mIn) - es(t, 1.02, 1.25) * 900, T, 1.1 * (1 - fall), 0.8, 2);
      pose(mObj, { y: fall * 110 + sink * 180, r: sink * 40, o: 1 - es(t, 1.0, 1.05) });
      const bb = bump(t, 0.72, 1.0);
      pose(bubbles, { x: PAN.x + 6, y: PAN.y + 150 + sink * 60 - bb * 40, o: bb });

      /* v7a — woe to the world: the globe and its stones */
      const wIn = es(t, 1.1, 1.35, ease.back);
      swing(world, GL.x, lerp(-900, GL.y, wIn), T, 0.8, 0.6, 3);
      STONES.forEach((st) => {
        const a = st.i < 8 ? 1.3 + st.i * 0.06 : 2.1 + (st.i - 8) * 0.12;
        const k = es(t, a, a + 0.14, ease.back);
        pose(st.el, { x: GL.x + st.dx + Math.sin(T * 0.6 + 3) * 0.4, y: lerp(-900, GL.y, wIn) + st.dy, s: k, r: st.i * 40, o: k > 0.01 ? 1 : 0 });
      });

      /* v7b — the cloud over the shadow-man */
      const cw = es(t, 2.05, 2.35, ease.out);
      pose(cloudW, { x: 1010 + Math.sin(T * 0.8) * 4, y: lerp(330, 440, cw), s: 0.9, o: cw });

      /* Jesus */
      const lament = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const point = es(t, 2.1, 2.3);
      const welcome = bump(t, 1.5, 2.0);
      jesus.set({ x: 520, y: GY, s: 1.02, armF: 24 + bump(t, 0.05, 0.9) * 40 + welcome * 40 + point * 64, armB: 10 + lament * 120, head: -2 + lament * 10 - point * 4, blink: blinkAt(T, 1) });

      S.cam.x = kf(t, [[0, 30], [0.5, 40], [1.2, 40], [2.0, 50]]);
      S.cam.y = kf(t, [[0, 20], [0.5, 6], [1.0, 6], [1.4, 0], [2.1, 16]]);
      S.cam.z = kf(t, [[0, 1.04], [0.4, 1.02], [2.1, 1.02], [2.5, 1.06]]);
    };
  },
};
