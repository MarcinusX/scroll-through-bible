// Mt 25,8–9 — the foolish turn to the wise and hold out their lamps: "Give us some of your oil" — and one by one
// their little flames sink and go out, leaving curls of smoke. The wise hold their flasks close and shake their
// heads: there might not be enough for both; they point down the lane, where the oil-seller's lantern is lit and he
// lifts a jar — and the five foolish hurry off towards his stall.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { weddingSet, WD, SPOTS, maidens, setMaiden, smoke, say, oilJar, question, oilDrop, tr } from './lib.js';

export default {
  id: 'mt25-oil',
  parable: true,
  beats: [
    { v: 8, text: 'A nierozsądne rzekły do roztropnych: "Użyczcie nam swej oliwy,' },
    { v: 8, cont: true, text: 'bo nasze lampy gasną".' },
    { v: 9, text: 'Odpowiedziały roztropne: "Mogłoby i nam, i wam nie wystarczyć.' },
    { v: 9, cont: true, text: 'Idźcie raczej do sprzedających i kupcie sobie!"' },
  ],
  cam: { x: [-120, 30], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const W = weddingSet(S, { moonAt: [1060, 110] });
    const c = W.c;
    const act = S.layer({ par: 0.45, sh: 5 });
    const fireL = S.layer({ par: 0.45, sh: 0, flat: true });
    const M = maidens(S, act, { fireL, sit: false });
    const fx = S.layer({ par: 0.45, sh: 4 });
    const smokes = M.filter((m) => !m.wise).map(() => fx.add(`<g>${smoke(c)}</g>`));
    const ask = fx.add(`<g>${say(c, [tr('Użyczcie nam', 'Give us some'), tr('oliwy!', 'of your oil!')], { size: 20, side: 1 })}</g>`);
    const doubt = fx.add(`<g>${say(c, '', { size: 22, side: -1, w: 110 })}<g transform="translate(-64 -64)">${oilJar(c, true, 30)}</g><g transform="translate(-30 -60) scale(.6)">${question(c)}</g></g>`);
    const go = fx.add(`<g>${say(c, tr('Idźcie i kupcie!', 'Go and buy!'), { size: 20, side: -1 })}</g>`);
    const jarUp = fx.add(`<g>${oilJar(c, true, 34)}</g>`);

    return (t, time) => {
      const T = time;
      W.night.layer.fade(1);
      W.update(T, { moonY: 110, moonX: 1060 });
      W.door(0);
      pose(W.bar, { o: 0 });
      pose(W.shutter, { x: WD.WIN[0] - 26, y: WD.WIN[1] - 2 });
      W.torches.forEach((el, i) => {
        pose(el, { x: 1560 - i * 70 - es(t, 0, 4) * 150, y: 500 + i * 12 + es(t, 0, 4) * 30, s: 0.8 + Math.sin(T * 8 + i) * 0.06 });
      });
      /* v9b — the seller's lantern, and his jar */
      const shop = es(t, 3.05, 3.35);
      pose(W.stallGlow, { x: WD.STALL + 70, y: 530, s: 0.8 + shop * 0.5, o: 0.2 + shop * 0.8 });
      W.seller.set({ x: WD.STALL - 10, y: 640, s: 0.62, armF: shop * 120, blink: blinkAt(T, 4) });
      pose(jarUp, { x: WD.STALL - 10 + 40, y: 640 - 172 * 0.62 + (1 - shop) * 40, s: 0.8, o: shop });

      /* the ten: foolish ask (v8a), their lamps die (v8b), the wise refuse (v9a) and send them off (v9b) */
      const askK = es(t, 0.05, 0.3) * (1 - es(t, 3.2, 3.4));
      const refuse = es(t, 2.05, 2.3);
      const point = es(t, 3.05, 3.3);
      const leave = es(t, 3.35, 3.95, (u) => u);
      M.forEach((m) => {
        const j = m.i % 5;
        if (m.wise) {
          const shake = refuse * (1 - point) * Math.sin(t * 20 + j) * 6;
          setMaiden(m, {
            x: SPOTS[m.i] + 16, y: WD.G + (m.i % 2) * 6, s: 0.8, flip: es(t, 0.3 + j * 0.03, 0.36 + j * 0.03) > 0.5,
            armF: 46 + (j === 0 ? point * 50 : 0), armB: 6 + refuse * 40 * (1 - point * (j === 0 ? 1 : 0)), head: shake + (j === 0 ? -point * 6 : 0), blink: blinkAt(T, m.seed), fire: 1.3, time: T,
          });
        } else {
          const out = es(t, 1.05 + j * 0.12, 1.35 + j * 0.12);
          const x0 = SPOTS[m.i] - 16;
          const x = lerp(x0, 318 + j * 36, ease.io(leave));
          const turn = leave > 0.02;
          setMaiden(m, {
            x, y: WD.G + (m.i % 2) * 6, s: 0.8, flip: turn, walk: leave > 0 && leave < 1 ? x * 0.06 : 0,
            armF: 44 + askK * 40, armB: 6 + askK * 30, head: askK * -6 + out * 12 * (1 - leave), blink: blinkAt(T, m.seed),
            fire: (1 - out) * (0.7 + Math.sin(T * 17 + m.seed) * 0.12 * (out > 0 ? 1 : 0.5)), time: T,
          });
          const sk = bump(t, 1.2 + j * 0.12, 2.4 + j * 0.1);
          pose(smokes[j], { x: x0 + 34 * 0.8 + 26, y: WD.G - 140, s: 0.6 + sk * 0.5, o: sk * (1 - leave) });
        }
      });
      const ak = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 0.95, 1.1));
      pose(ask, { x: 660, y: WD.G - 176, s: ak, o: ak > 0.01 ? 1 : 0 });
      const dk = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(doubt, { x: 790, y: WD.G - 176, s: dk, o: dk > 0.01 ? 1 : 0 });
      const gk = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.9, 4));
      pose(go, { x: 770, y: WD.G - 176, s: gk, o: gk > 0.01 ? 1 : 0 });

      S.cam.x = -es(t, 1.0, 1.4) * 30 * (1 - es(t, 2.0, 2.3)) - es(t, 3.05, 3.6) * 110;
      S.cam.z = 1 + es(t, 0.0, 0.4) * 0.05 * (1 - es(t, 3.0, 3.4));
      S.cam.y = es(t, 0.0, 0.4) * 20;
    };
  },
};
