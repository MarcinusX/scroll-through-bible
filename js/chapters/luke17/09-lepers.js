// Łk 17,11–13 — Luke 9's road to Jerusalem again, and the walled village beside it. "As He was on His way to
// Jerusalem, He was passing along the borders of Samaria and Galilee": Jesus walks up the road with the four, the city
// shining far off; two name boards come down over the hills — Galilee on the left, Samaria on the right — and a line
// of boundary stones runs down between them. "As He entered into a certain village, ten men who were lepers met Him":
// out of the village gate they come, one after another, in grey rags, grey-skinned. "Who stood at a distance": they
// stop far off, across a row of white stones in the grass, and keep their distance. "They lifted up their voices:
// 'Jesus, Master, have mercy on us!'": all ten lift their arms and call out to Him.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, tenLepers, LEP, lepS, signpost, bubble, strung, flyIn, voiceRings, headAt, halo, behindOf, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { JX, JY } = LEP;
const TRAIL = [[20, 780], [240, 752], [420, 734], [560, 724], [JX, JY]];
const DIS = [['john', 600, 730], ['peter', 530, 740], ['andrew', 462, 746], ['james', 394, 752]];

function along(pts, u) {
  const n = pts.length - 1, f = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(f), k = f - i;
  return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
}

export default {
  id: 'lk17-lepers',
  beats: [
    { v: 11 },
    { v: 12, text: 'Gdy wchodzili do pewnej wsi, wyszło naprzeciw Niego dziesięciu trędowatych.' },
    { v: 12, cont: true, text: 'Zatrzymali się z daleka' },
    { v: 13 },
  ],
  cam: { x: [-80, 120], y: [-40, 60], z: [0.96, 1.14] },
  build(S) {
    const R = roadSet(S, { village: true });
    const c = S.c;
    /* the border: two name boards over the hills, a line of boundary stones down the far hills */
    const bL = S.layer({ par: 0.2, sh: 2 });
    behindOf(bL, R.G);
    const stones = Array.from({ length: 9 }, (_, i) => ({ i, el: bL.add(`<g opacity="0"><path d="${c.cut(c.blob(0, -4, 6 - i * 0.3, 4 - i * 0.2, 7, 0.2), 0.3, 3)}" fill="${C.cream}"/></g>`), x: lerp(820, 700, i / 8) + Math.sin(i * 1.7) * 14, y: lerp(610, 470, i / 8) }));
    const hangL = S.layer({ par: 0.1, sh: 4 });
    const gal = hangL.add(`<g transform="translate(0 -1500)">${strung(boardText(c, tr('Galilea', 'Galilee')), 0, 2400, [-40, 40])}</g>`);
    const sam = hangL.add(`<g transform="translate(0 -1500)">${strung(boardText(c, tr('Samaria', 'Samaria')), 0, 2400, [-40, 40])}</g>`);
    /* the row of white stones that keeps the distance */
    const gapL = S.layer({ par: 0.45, sh: 2 });
    const gap = Array.from({ length: 7 }, (_, i) => ({ i, el: gapL.add(`<g opacity="0"><path d="${c.cut(c.blob(0, -3, 7, 4, 8, 0.2), 0.3, 3)}" fill="${mix(C.cream, C.stone, 0.3)}"/></g>`), x: 880 + i * 6 + Math.sin(i * 2.1) * 6, y: 676 + i * 14 }));
    /* people */
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const TEN = tenLepers(S, act, c, { walk: true });
    const F = roadFour(S, act, c);
    const voice = voiceRings(act, c, { n: 3, color: mix(C.stone2, C.cream, 0.4), r: 44, w: 6 });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const cry = fx.add(`<g opacity="0">${bubble(c, [tr('Jezusie, Mistrzu,', 'Jesus, Master,'), tr('ulituj się nad nami!', 'have mercy on us!')], { size: 19, tail: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.08 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, o: 0.5 + bump(t, 0.1, 1.0) * 0.4 });

      /* v11 — along the border of Samaria and Galilee */
      flyIn(gal, es(t, 0.15, 0.4, ease.back) * (1 - es(t, 1.05, 1.3)), 480, 300, T, 1, 1);
      flyIn(sam, es(t, 0.28, 0.52, ease.back) * (1 - es(t, 1.05, 1.3)), 1160, 300, T, 2, 1);
      stones.forEach((s) => { const k = es(t, 0.4 + s.i * 0.05, 0.5 + s.i * 0.05, ease.back) * (1 - es(t, 1.1, 1.3)); pose(s.el, { x: s.x, y: s.y, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      const u = es(t, 0.0, 0.95, (x) => x);
      const walking = u > 0 && u < 1;
      const [jx, jy] = along(TRAIL, u);
      const stopTurn = es(t, 1.3, 1.5);
      F.jesus.set({ x: jx, y: jy, s: lerp(1.08, 1.04, u), walk: walking ? jx * 0.05 : undefined, armF: 16 + bump(t, 3.2, 3.9) * 20, armB: 8, head: -2 + stopTurn * 2, blink: blinkAt(T) });
      pose(aura, { x: jx, y: jy - 150 });
      F.ds.forEach((d) => {
        const [, x1, y1] = DIS.find((e) => e[0] === d.k);
        const lag = (JX - x1) / 1000;
        const [dx, dy] = along(TRAIL.map(([x, y]) => [x - (JX - x1), y + (y1 - JY)]), es(t, 0.0 + lag * 0.3, 0.95, (x) => x));
        const look = es(t, 1.4, 1.7);
        d.p.set({ x: dx, y: dy, s: 0.96, walk: walking ? dx * 0.05 + d.i : undefined, armF: 14 + look * (d.k === 'john' ? 30 : 10), armB: 6 + look * (d.k === 'peter' ? 50 : 0), head: -2 - look * 4, lean: -look * 3, blink: blinkAt(T, d.seed) });
      });

      /* v12a — from beyond the village they come, one by one; v12b — they stop, far off */
      const calling = es(t, 3.08, 3.18);
      TEN.forEach((m) => {
        const [sx, sy] = LEP.SPOT[m.i];
        const order = m.i === 9 ? 9 : m.i;
        const k = es(t, 1.08 + order * 0.07, 1.5 + order * 0.07, (x) => x);
        const x = lerp(1330 + (m.i % 5) * 26, sx, k), y = sy;
        const s = lepS(y);
        const w = k > 0 && k < 1;
        const bob = w ? Math.abs(Math.sin(k * 14 + m.i)) * 3 : 0;
        const vis = seg(t, 1.06 + order * 0.07, 1.1 + order * 0.07);
        pose(m.walk, { x, y: y - bob, s, sx: -1, o: w ? vis : 0 });
        pose(m.stand, { x, y, s, o: !w && k >= 1 ? 1 - calling : 0 });
        pose(m.call, { x, y, s, o: k >= 1 ? calling : 0 });
        pose(m.clean, { x, y, s, o: 0 });
      });
      gap.forEach((g) => { const k = es(t, 2.2 + g.i * 0.05, 2.32 + g.i * 0.05, ease.back); pose(g.el, { x: g.x, y: g.y, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });

      /* v13 — "Jesus, Master, have mercy on us!" */
      const ck = es(t, 3.2, 3.38, ease.back);
      pose(cry, { x: 1060, y: 480, s: ck, o: ck > 0.01 ? 1 : 0 });
      voice(1000, 540, es(t, 3.1, 3.25), T, { dir: -1, spread: 2.2 });

      S.cam.x = kf(t, [[0, -60], [0.9, 0], [1.2, 60], [2.2, 60], [3, 70], [4, 70]]);
      S.cam.y = kf(t, [[0, 40], [1, 30], [2.2, 20], [3, 0], [4, 0]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.02], [2.2, 0.98], [3, 1.04], [4, 1.06]]);
    };
  },
};

/** a painted name board (a region's name); origin: top centre */
function boardText(c, text) {
  const w = 30 + text.length * 13;
  const s = sheet().p(c.cut([[-w / 2, 0], [w / 2, -2], [w / 2 + 3, 44], [-w / 2 - 2, 46]], 0.5, 6), mix(C.wood3, C.sand, 0.3)).p(c.cut([[-w / 2 + 6, 6], [w / 2 - 6, 4], [w / 2 - 4, 38], [-w / 2 + 5, 40]], 0.3, 6), C.parchment);
  return `${s.out()}<text x="0" y="31" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="24" font-style="italic" fill="${C.ink}">${text}</text>`;
}
