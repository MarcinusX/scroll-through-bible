// Mk 15,42–45 — evening in Pilate's hall. The sun sinks behind the city, the lamps are lit; a little plate
// comes down: the Preparation, the day before the Sabbath (two candles, not yet lit). Joseph of Arimathea
// comes in — a council member who waits for the Kingdom of God (a gate of light glows in his thoughts).
// He walks boldly up to Pilate and asks for the body of Jesus. Pilate wonders; the centurion is called and
// confirms it; Pilate hands Joseph the sealed permission.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, headAt, speech, thought, GLYPH, nameTag, strip, candle, centurion, pilate, sealedScroll, hourglass, shroudCross, hallSet, lampSet, hanging, swing, LOOK, SKIES, PI } from './lib.js';

const GY = 690;

export default {
  id: 'm15-joseph',
  beats: [
    { v: 42 },
    { v: 43, text: 'przyszedł Józef z Arymatei, poważny członek Rady,' },
    { v: 43, cont: true, text: 'który również wyczekiwał królestwa Bożego.' },
    { v: 43, cont: true, text: 'Śmiało udał się do Piłata i poprosił o ciało Jezusa.' },
    { v: 44, text: 'Piłat zdziwił się, że już skonał.' },
    { v: 44, cont: true, text: 'Kazał przywołać setnika i pytał go, czy już dawno umarł.' },
    { v: 45 },
  ],
  cam: { x: [-60, 200], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = hallSet(S, { evening: true });
    const P = H.charL;
    const pil = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const jos = S.puppet(P.add(person(c, LOOK.joseph)));
    const cen = S.puppet(P.add(centurion(c)));
    const fx = H.fxL;
    const plate = hanging(S.layer({ par: 0.2, sh: 5 }), `${sheet().p(c.cut(c.rect(-110, 0, 220, 150), 0.5, 7), C.parchment).out()}<g transform="translate(-26 112)">${candle(c, 40).replace(/<g class="flame"[\s\S]*<\/g>$/, '').replace(/<circle class="glow"[^>]*\/>/, '')}</g><g transform="translate(26 112)">${candle(c, 40).replace(/<g class="flame"[\s\S]*<\/g>$/, '').replace(/<circle class="glow"[^>]*\/>/, '')}</g><g transform="translate(0 132)">${strip(c, tr('Przygotowanie', 'the Preparation'), { size: 17 })}</g><g transform="translate(0 164)">${strip(c, tr('dzień przed szabatem', 'the day before the Sabbath'), { size: 14, fill: C.stone })}</g>`, { x: 0, y: 0, len: 900 });
    const jTag = hanging(S.layer({ par: 0.58, sh: 5 }), `${nameTag(c, tr(['Józef', 'z Arymatei'], ['Joseph', 'of Arimathaea']), { size: 17 })}<g transform="translate(0 76)">${strip(c, tr('członek Rady', 'council member'), { size: 13, fill: C.stone })}</g>`, { x: 0, y: 0, len: 900 });
    const hope = fx.add(`<g>${thought(c, `<circle r="30" fill="url(#halo-glow)"/><path d="${c.poly([[-13, 14], [-13, -4], ...c.arc(0, -4, 13, 13, PI, 2 * PI, 10), [13, 14]])}" fill="#fff6d8"/><path d="${c.ribbon([[-18, 14], [-18, -6]], 3) + c.ribbon([[18, 14], [18, -6]], 3) + c.ribbon(c.arc(0, -6, 18, 18, PI, 2 * PI, 10), 3)}" fill="${C.sun}"/>`, { w: 84, h: 66 })}</g>`);
    const glowJ = fx.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(1.1)">${shroudCross(c)}</g>`, { w: 64, h: 70 })}</g>`);
    const wow = fx.add(`<g>${speech(c, `<g transform="scale(1.2)">${GLYPH.bang(c)}</g>`, { w: 50, h: 52, flip: true })}</g>`);
    const long = fx.add(`<g>${speech(c, `<g transform="translate(-12 0)">${hourglass(c, 30)}</g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 80, h: 56 })}</g>`);
    const yes = fx.add(`<g>${speech(c, `<path d="${c.ribbon([[-12, 0], [-3, 9], [13, -11]], 4.5)}" fill="${C.moss}"/>`, { w: 50, h: 48, flip: true })}</g>`);
    const perm = fx.add(`<g>${sealedScroll(c, 54)}</g>`);

    return (t, time) => {
      const T = time;
      /* v42 — evening: the sun goes down, the lamps are lit, the Preparation */
      const sunset = es(t, -0.3, 1.2);
      H.sk.blend(SKIES.dusk, SKIES.night, sunset * 0.2 + es(t, 3, 7) * 0.35);
      pose(H.orb, { x: 800, y: 330 + sunset * 170, o: 1 - es(t, 0.9, 1.3) });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.lamps.forEach((l, i) => lampSet(l, es(t, 0.3 + i * 0.2, 0.5 + i * 0.2), T));
      const pk = es(t, 0.1, 0.5) * (1 - es(t, 0.95, 1.3));
      swing(plate, 640, 170 - (1 - pk) * 700, T, 1, 0.7);

      /* Joseph */
      const jK = [[0.9, [60, GY]], [1.6, [560, GY]], [2.9, [600, GY]], [3.4, [900, GY]]];
      const [jx, jy] = kf(t, jK);
      const up = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.05));
      const bowK = es(t, 3.35, 3.55) * (1 - es(t, 3.9, 4.1)) + bump(t, 6.3, 6.9) * 0.8;
      const receive = es(t, 6.2, 6.45);
      jos.set({ x: jx, y: jy, s: 1.04, flip: false, walk: moving(t, jK) ? jx * 0.05 : undefined, armF: 14 + bowK * 50 + receive * 40, armB: 8 + up * 20 + bowK * 20, head: -up * 16 + bowK * 14, lean: bowK * 10, blink: blinkAt(T, 2) });
      const tk = es(t, 1.2, 1.55) * (1 - es(t, 2.95, 3.2));
      const [jhx, jhy] = headAt(jx, jy, 1.04, false);
      swing(jTag, jhx, jhy - 200 - (1 - tk) * 700, T, 1.2, 0.9, 1);
      const hk = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(hope, { x: jhx + 4, y: jhy - 14, s: hk * 1.2, o: hk > 0.02 ? 1 : 0 });
      pose(glowJ, { x: jhx, y: jhy + 30, o: up * 0.6 });
      const ak = es(t, 3.5, 3.7, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(ask, { x: jhx + 20, y: jhy - 20, s: ak, o: ak > 0.02 ? 1 : 0 });

      /* Pilate */
      const marvel = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.1));
      const call = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      const give = es(t, 6.05, 6.3);
      pil.set({ x: 1116, y: 566, s: 1, flip: true, armF: 30 + marvel * 30 + call * 60 + give * 50, armB: 10 + marvel * 110 + call * 20, lean: marvel * 6, head: -4 - marvel * 6 + call * 4, blink: blinkAt(T, 1) });
      const [phx, phy] = headAt(1116, 566, 1, true, 62);
      const wk = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.05));
      pose(wow, { x: phx - 22, y: phy - 24, s: wk, o: wk > 0.02 ? 1 : 0 });
      /* the centurion is called */
      const cK = [[5.0, [1480, GY - 6]], [5.5, [1290, GY - 6]]];
      const [cx, cy] = kf(t, cK);
      const nod = bump(t, 6.05, 6.35);
      cen.set({ x: cx, y: cy, s: 1, flip: true, walk: moving(t, cK) ? cx * 0.06 : undefined, armF: 30, armB: 10 + nod * 20, head: nod * 14, o: es(t, 5.0, 5.1), blink: blinkAt(T, 5) });
      const lk = es(t, 5.5, 5.75, ease.back) * (1 - es(t, 5.95, 6.05));
      pose(long, { x: phx + 20, y: phy - 24, s: lk, o: lk > 0.02 ? 1 : 0 });
      const [chx, chy] = headAt(cx, cy, 1, true);
      const yk = es(t, 6.05, 6.25, ease.back) * (1 - es(t, 6.8, 6.95));
      pose(yes, { x: chx - 16, y: chy - 24, s: yk, o: yk > 0.02 ? 1 : 0 });
      /* the permission passes from Pilate's hand to Joseph's */
      const [pax, pay] = hand(1116, 566, 1, true, 30 + give * 50, 0, 62);
      const [jax, jay] = hand(jx, jy, 1.04, false, 14 + receive * 40);
      const pass = es(t, 6.35, 6.7);
      pose(perm, { x: lerp(pax, jax, pass), y: lerp(pay, jay, pass) - Math.sin(pass * PI) * 40, r: -10, o: give > 0.02 ? 1 : 0 });

      S.cam.x = es(t, 0.8, 1.5) * -30 + es(t, 3.0, 3.6) * 100;
      S.cam.y = 10 + es(t, 3.0, 3.6) * 20;
      S.cam.z = 1.02 + es(t, 3.0, 3.6) * 0.06;
      if (S.portrait) S.cam.x += 70;
    };
  },
};
