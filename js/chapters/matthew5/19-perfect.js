// Mt 5,48 — back on the mountain in the golden evening, Jesus seated among the four, the crowd on the slope.
// "Be perfect, as your heavenly Father is perfect": He rises and opens His arms; above Him the sun hangs low and a
// golden ring draws itself round it until the circle is whole — nothing missing — and its light comes down over
// the four and runs out over the whole crowd on the hillside.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, SKY, JX, JY, JS, voiceRings, PI } from './lib.js';
import { eternityRing, drawRing } from '../john1/lib.js';

const SUN = [800, 250];

export default {
  id: 'mt5-perfect',
  beats: [
    { v: 48 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = mountSet(S, { skyCols: SKY.gold, sky2Cols: SKY.dusk, tintCol: C.dusk, tintK: 0.12, sunXY: SUN });
    const ringL = S.layer({ par: 0.06, sh: 4 });
    const halo = ringL.add(`<g><circle r="260" fill="url(#halo-glow)"/></g>`);
    const ring = ringL.add(`<g>${eternityRing(c, 110, 10, 28, C.haloRim)}</g>`);
    const raysL = S.layer({ par: 0.3, sh: 1 });
    const rays = raysL.add(`<g>${(() => { let d = ''; for (let i = 0; i < 13; i++) { const a = PI * 0.12 + (i / 12) * PI * 0.76, w = 0.03; d += c.poly([[Math.cos(a - w) * 120, Math.sin(a - w) * 120], [Math.cos(a) * 900, Math.sin(a) * 900], [Math.cos(a + w) * 120, Math.sin(a + w) * 120]]); } return `<path d="${d}" fill="#fff0c4" opacity=".4"/>`; })()}</g>`);
    const lights = raysL.sprite(set.lights(), 800, 560);
    const { jesus, jStand, four, jGlow } = set.circle({ stand: true, glow: true });
    const voice = voiceRings(set.L, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });
    set.front();

    return (t, time) => {
      const T = time;
      set.sk2.layer.fade(es(t, 0, 1) * 0.5);
      set.update(T, { sunX: SUN[0], sunY: SUN[1] });
      const rise = es(t, 0.06, 0.13);
      const open = es(t, 0.12, 0.34);
      jesus.set({ x: JX, y: JY, s: JS, armF: 30, armB: 10, head: -4, o: 1 - rise, blink: blinkAt(T, 1) });
      jStand.set({ x: JX, y: JY + 4, s: JS * 0.98, armF: 30 + open * 60, armB: 20 + open * 130, head: -6 - open * 4, o: rise, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 140, s: 0.8 + open * 0.4, o: 0.4 + open * 0.4 });
      voice(JX - 2, JY - 176, 0.6, T, { s0: 0.7 });
      const rk = es(t, 0.2, 0.6);
      drawRing(ring, rk);
      pose(ring, { x: SUN[0], y: SUN[1], r: T * 4, o: 1 });
      pose(halo, { x: SUN[0], y: SUN[1], s: 0.6 + es(t, 0.55, 0.72) * 0.6, o: es(t, 0.5, 0.7) });
      const light = es(t, 0.56, 0.74);
      pose(rays, { x: SUN[0], y: SUN[1], o: light });
      lights.set({ o: es(t, 0.62, 0.78) });
      four.forEach((f) => f.p.set({ x: f.x, y: f.y, s: f.s, flip: f.flip, lean: f.dir * 2, head: -10 - light * 6, armF: 20 + light * 50, armB: light * 60, blink: blinkAt(T, f.seed) }));
      S.cam.y = -30 + es(t, 0.1, 0.6) * -10;
      S.cam.z = 1.02 + es(t, 0.1, 0.7) * 0.04;
    };
  },
};
