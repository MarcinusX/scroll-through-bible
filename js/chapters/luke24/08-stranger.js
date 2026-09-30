// Łk 24,15–17 — As they talk, a traveller in a hooded cloak comes up the road behind them and falls in between them:
// Jesus Himself — "in another form", only the faintest halo about His hood. But their eyes are kept from knowing Him:
// two soft veils of haze come down on strings between them and Him, and thin away again. He asks them what they are talking about as they walk — and they
// stand still, their faces heavy with sadness.
import { C, blinkAt, pose, lerp } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { AFTERNOON, GOLDEN, emmausSet, RD, TRIO, roadTrio, headAt, speech, talkDots, GLYPH, hazeVeil, kf, moving } from './lib.js';

const GY = RD.GY;
const GK = [[-0.2, 520], [2.9, 800]];     // the middle of the group (the Stranger's place once He is with them)

export default {
  id: 'lk24-stranger',
  beats: [
    { v: 15 },
    { v: 16 },
    { v: 17, text: 'On zaś ich zapytał: «Cóż to za rozmowy prowadzicie z sobą w drodze?»' },
    { v: 17, cont: true, text: 'Zatrzymali się smutni.' },
  ],
  cam: { x: [-600, 40], y: [0, 40], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: AFTERNOON, sky2: GOLDEN, sunAt: [1250, 170] });
    const R = roadTrio(S, E.act, E.fx);
    const veils = [0, 1].map(() => E.fx.add(`<g>${hazeVeil(c, 38)}</g>`));
    const ask = E.fx.add(`<g>${speech(c, `${talkDots(c)}<g transform="translate(24 -2) scale(.8)">${GLYPH.q(c)}</g>`, { w: 84, h: 46, flip: false })}</g>`);

    return (t, T) => {
      E.update(T, { sunY: 170 + es(t, 0, 4) * 40 });
      E.sk2.fade(es(t, 1.0, 3.8) * 0.5);
      const gx = kf(t, GK, ease.sine);
      const stop = es(t, 3.02, 3.25);
      const going = t < 3.1 && moving(t, GK, 0.1);
      /* v15: the traveller comes up behind and walks with them */
      const join = es(t, 0.1, 0.85);
      const spread = lerp(60, 120, join);
      const frx = gx - spread, clx = gx + spread;
      const stx = lerp(gx - 420, gx, join);
      const sad = es(t, 3.1, 3.4);
      const asks = es(t, 2.05, 2.25) * (1 - stop * 0.5);
      R.fr.p.set({ x: frx, y: GY - 2, s: TRIO.S, walk: going ? frx * 0.05 : undefined, amt: 0.9, armF: 20 + bump(t, 0.1, 0.8) * 30 - sad * 6, armB: 10, head: -bump(t, 0.3, 0.9) * 8 + sad * 14, blink: blinkAt(T, 1) });
      R.cl.p.set({ x: clx, y: GY + 4, s: TRIO.S, flip: stop > 0.5, walk: going ? clx * 0.05 + 2 : undefined, amt: 0.9, armF: 22 + bump(t, 0.2, 0.9) * 40 - sad * 8, armB: 12 + sad * 10, head: sad * 14, blink: blinkAt(T, 4) });
      fade(R.fr.sad, 0.4 + sad * 0.6);
      fade(R.cl.sad, 0.4 + sad * 0.6);
      const stWalk = (join > 0.01 && join < 0.99) || going;
      R.stSet({ x: stx, y: GY + 2, s: TRIO.S + 0.02, walk: stWalk ? stx * 0.05 + 1 : undefined, amt: 0.9, o: seg(t, 0.1, 0.2), armF: 34 + asks * 20, armB: 10 + asks * 40, head: -asks * 4, blink: blinkAt(T, 6) });
      R.halo(0.26);

      /* v16: their eyes are kept from recognising Him */
      const vk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.7, 1.98));
      [stx - 68, stx + 68].forEach((vx, i) => pose(veils[i], { x: vx, y: lerp(-1300, GY - 6, es(t, 1.05, 1.35, ease.out)), o: vk }));

      /* v17a: He asks them */
      const [shx, shy] = headAt(stx, GY + 2, TRIO.S + 0.02, false);
      const ak = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 3.0, 3.15));
      pose(ask, { x: shx + 14, y: shy - 34, s: ak, o: ak > 0.01 ? 1 : 0 });

      S.cam.x = (gx - 800) * 2 * 0.9;
      S.cam.y = 26 - es(t, 1.05, 1.4) * 6 * (1 - es(t, 2.0, 2.3));
      S.cam.z = (S.portrait ? 0.98 : 1.04) + es(t, 1.05, 1.4) * 0.05 * (1 - es(t, 2.0, 2.3)) + stop * 0.03;
      void C;
    };
  },
};
