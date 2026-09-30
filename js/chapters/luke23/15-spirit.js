// Łk 23,46 — near the cross, in the darkness (John 19's near set, darkened). Only a soft light behind the middle
// cross shows it as a silhouette, and a small lamp burns at the front of the stage. Jesus cries out with a loud
// voice — rings of light go out from Him, and His words hang above in gold: "Father, into Your hands I commit My
// spirit". High above, far off, a quiet light waits (no figure: only light). Having said this He breathes His last:
// the head bows, the ring of light fades, a single small breath of light rises up towards the light above, the lamp
// goes out, and everything is still.
import { C, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { crossNearDark, wordPlate, voiceRings, soulLight, oilLamp, wisp, hanging, swing, NEAR, tr, PI } from './lib.js';

const PAL = ['#16172c', '#25243c', '#3b3249'];
const GY = 704;

export default {
  id: 'lk23-spirit',
  beats: [
    { v: 46, text: 'Wtedy Jezus zawołał donośnym głosem: Ojcze, w Twoje ręce powierzam ducha mojego.' },
    { v: 46, cont: true, text: 'Po tych słowach wyzionął ducha.' },
  ],
  cam: { x: [-30, 30], y: [-80, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const N = crossNearDark(S, { pal: PAL, tint: 0.68 });
    const [HX, HY] = N.head;
    const glow = N.glowL.add(`<g><circle r="140" fill="url(#halo-glow)"/></g>`);
    // the light far above (behind everything but the sky)
    const above = S.layer({ par: 0.03, sh: 1, flat: true });
    N.sk.layer.el.parentNode.insertBefore(above.el, N.sk.layer.el.nextSibling);
    const high = above.add(`<g><circle r="260" fill="url(#halo-glow)"/><circle r="120" fill="url(#halo-glow)"/></g>`);
    const rings = voiceRings(N.glowL, c, { n: 3, color: C.halo, r: 30, w: 4 });
    const fx = N.fx;
    const soul = fx.add(`<g>${soulLight(c, 13)}</g>`);
    const lamp = fx.add(`<g>${sheet().p(c.cut(c.blob(0, 8, 46, 14, 12, 0.2), 0.8, 6), '#4a4254').out()}<g transform="translate(-6 -4)">${oilLamp(c)}</g></g>`);
    const flame = lamp.querySelector('.flame'), lglow = lamp.querySelector('.glow');
    const smoke = fx.add(`<g>${wisp(c, 1.2, '#8c8494')}</g>`);
    const plL = S.layer({ par: 0.3, sh: 6 });
    const words = hanging(plL, wordPlate(c, tr(['Ojcze, w Twoje ręce', 'powierzam ducha mojego'], ['Father, into your hands', 'I commit my spirit!']), { size: 25, fill: '#fff6dc' }), { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const still = es(t, 1.1, 1.6);
      const T = time * (1 - still);
      N.sk.set(...PAL);
      /* v46a — the loud cry, the words */
      const cry = bump(t, 0.05, 0.95);
      rings(HX + 6, HY, cry * 1.3, T, { spread: 3, speed: 0.6 });
      const wk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 1.05, 1.3));
      swing(words, 800, 120 - (1 - wk) * 900, T, 0.6, 0.6, 1);
      const bow = es(t, 1.08, 1.45);
      pose(N.hd, { x: 0, y: N.HDY, r: bow * 28 });
      fade(N.hl, 0.85 - bow * 0.6);
      pose(glow, { x: HX, y: HY + 30, s: 1 + cry * 0.15, o: 0.6 - bow * 0.3 });
      pose(high, { x: 800, y: -120, s: 1, o: 0.25 + es(t, 0.2, 0.7) * 0.35 + bump(t, 1.2, 1.95) * 0.3 });
      /* v46b — He breathes His last */
      const rise = seg(t, 1.12, 1.98);
      pose(soul, { x: HX + Math.sin(rise * 5) * 6, y: HY - 30 - rise * 170, s: 0.8 + rise * 0.4, o: rise > 0 ? Math.sin(Math.min(1, rise * 1.25) * PI * 0.5) * (1 - rise * rise * 0.5) : 0 });
      const out = es(t, 1.15, 1.4);
      pose(lamp, { x: 640, y: GY - 34 });
      pose(flame, { x: 35, y: -16, sy: (1 - out) * (1 + (T ? Math.sin(T * 9) * 0.07 : 0)), sx: 1 - out * 0.7, o: out < 0.99 ? 1 : 0 });
      fade(lglow, 0.8 * (1 - out));
      const sm = seg(t, 1.35, 1.95);
      pose(smoke, { x: 669, y: GY - 56 - sm * 60, s: 0.6 + sm * 0.6, o: sm > 0 ? bump(t, 1.35, 1.95) * 0.8 : 0 });
      S.cam.y = -20 - es(t, 1.0, 1.9) * 40;
      S.cam.z = 1.04 + es(t, 1.0, 1.9) * 0.05;
    };
  },
};
