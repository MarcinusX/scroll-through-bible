// Mt 25,1–4 — the curtains open on a street at dusk: the wedding house on the right, its door garlanded and its
// windows lit; down the lane on the left the oil-seller's stall. Ten bridesmaids come along the street with their
// lamps lit, going out to meet the bridegroom, and stop looking up the hill road. Five were foolish and five wise:
// the two little groups, each with its word on a string. The foolish lift their lamps and turn up empty hands —
// no oil; the wise hold up their flasks of oil beside their lamps.
import { C, blinkAt, pose, lerp, curtains } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { weddingSet, WD, SPOTS, maidens, setMaiden, plateOn, wordOn, oilJar, crossX, tick, oilDrop, sparkle, tr } from './lib.js';

export default {
  id: 'mt25-virgins',
  parable: true,
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [-60, 50], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const W = weddingSet(S, { moonAt: [1270, 190] });
    const c = W.c;
    const act = S.layer({ par: 0.45, sh: 5 });
    const fireL = S.layer({ par: 0.45, sh: 0, flat: true });
    const M = maidens(S, act, { fireL, sit: false });

    const fx = S.layer({ par: 0.3, sh: 6 });
    const wFool = fx.add(`<g>${wordOn(c, tr('pięć nierozsądnych', 'five foolish'), { size: 24 })}</g>`);
    const wWise = fx.add(`<g>${wordOn(c, tr('pięć roztropnych', 'five wise'), { size: 24 })}</g>`);
    const pFool = fx.add(`<g>${plateOn(c, `<g transform="translate(0 20)">${oilJar(c, false, 50)}</g><g transform="translate(2 -2)">${crossX(c, 26)}</g>`, { r: 46 })}</g>`);
    const pWise = fx.add(`<g>${plateOn(c, `<g transform="translate(-8 22)">${oilJar(c, true, 50)}</g><g transform="translate(24 12)">${tick(c, 18)}</g>`, { r: 46 })}</g>`);
    const drops = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${oilDrop(c, 5)}</g>`));
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      W.update(T, { moonY: 190 });
      W.night.layer.fade(es(t, 1.0, 4.9) * 0.35);
      W.door(0);
      pose(W.bar, { o: 0 });
      pose(W.shutter, { x: WD.WIN[0] - 26, y: WD.WIN[1] - 2 });
      pose(W.stallGlow, { x: WD.STALL + 70, y: 530, o: 0.35 });
      W.seller.set({ x: WD.STALL - 10, y: 640, s: 0.62, blink: blinkAt(T, 4) });
      W.torches.forEach((el) => pose(el, { o: 0 }));

      /* v1 — ten bridesmaids take their lamps and go out along the street */
      const split = es(t, 2.05, 2.4);
      const foolUp = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const wiseUp = es(t, 4.05, 4.3);
      M.forEach((m) => {
        const d = 9 - m.i;
        const k = es(t, 1.02 + d * 0.02, 1.52 + d * 0.022, (u) => u);
        const x0 = SPOTS[m.i] - 1000;
        const x = lerp(x0, SPOTS[m.i], ease.out(k)) + (m.wise ? 16 : -16) * split;
        const walking = k > 0 && k < 1;
        const look = es(t, 1.55, 1.8);
        const up = m.wise ? wiseUp : foolUp;
        setMaiden(m, {
          x, y: WD.G + (m.i % 2) * 6, s: 0.8, walk: walking ? x * 0.06 : 0,
          armF: 40 + look * 18 + (m.wise ? 0 : foolUp * 34), armB: 6 + up * (m.wise ? 104 : 112),
          head: -look * 8 - up * 6, blink: blinkAt(T, m.seed), fire: 1, time: T, o: k > 0 ? 1 : 0,
        });
      });

      /* v2 — five foolish, five wise: a word over each group */
      const wk = es(t, 2.1, 2.45, ease.out) * (1 - es(t, 2.95, 3.12, ease.in));
      pose(wFool, { x: 564, y: lerp(-1500, 300, wk), r: Math.sin(T * 0.8) * 1.5, o: wk > 0.01 ? 1 : 0 });
      const wk2 = es(t, 2.18, 2.53, ease.out) * (1 - es(t, 2.95, 3.12, ease.in));
      pose(wWise, { x: 884, y: lerp(-1500, 300, wk2), r: Math.sin(T * 0.8 + 1) * 1.5, o: wk2 > 0.01 ? 1 : 0 });
      /* v3 — the foolish: lamps, but no oil */
      const fk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 4.85, 5));
      pose(pFool, { x: 564, y: lerp(-1500, 300, fk), r: Math.sin(T * 0.9) * 2, o: fk > 0.01 ? 1 : 0 });
      /* v4 — the wise: oil in flasks with their lamps */
      const pk = es(t, 4.05, 4.4, ease.out);
      pose(pWise, { x: 884, y: lerp(-1500, 300, pk), r: Math.sin(T * 0.9 + 2) * 2, o: pk > 0.01 ? 1 : 0 });
      drops.forEach((d, i) => {
        const k = seg(t, 4.25 + i * 0.07, 4.7 + i * 0.07);
        const x = SPOTS[5 + i] + 16 + 44 * 0.8, y = WD.G - 196 - Math.sin(k * Math.PI) * 30;
        pose(d, { x, y: y - k * 10, s: 1 + bump(t, 4.25 + i * 0.07, 4.7 + i * 0.07) * 0.4, o: bump(t, 4.25 + i * 0.07, 4.9 + i * 0.07) });
        const sk = bump(t, 4.3 + i * 0.08, 4.8 + i * 0.08);
        pose(sparks[i], { x: x + 12, y: y - 26, s: sk, r: T * 40, o: sk });
      });

      S.cam.x = -es(t, 2.9, 3.3) * 50 * (1 - es(t, 3.9, 4.2)) + es(t, 3.95, 4.3) * 40;
      S.cam.z = 1 + es(t, 0.9, 1.6) * 0.02 + es(t, 2.9, 3.3) * 0.05;
      S.cam.y = es(t, 2.9, 3.3) * 20;
    };
  },
};
