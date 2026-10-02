// Mt 26,24–25 — the same table, the lamps low. "The Son of Man goes, as it is written of Him": an open scroll comes
// down. "Woe to that man…": Judas's shadow grows on the wall behind him. "Better for him if he had not been born": the
// candle before him gutters and goes out. Then Judas himself: "Surely not I, Rabbi?" — and He, quietly, turning to
// him: "You have said it." A thin light holds the two of them; Judas lowers his eyes.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { upperRoom, supperTable, seatAll, TW, kf, headAt, bowl, candle, scrollOpen, shadowPerson, say, vignette, tr, vis } from './lib.js';

const DISH = 832;

export default {
  id: 'mt26-woe',
  beats: [
    { v: 24, text: 'Wprawdzie Syn Człowieczy odchodzi, jak o Nim jest napisane,' },
    { v: 24, cont: true, text: 'lecz biada temu człowiekowi, przez którego Syn Człowieczy będzie wydany.' },
    { v: 24, cont: true, text: 'Byłoby lepiej dla tego człowieka, gdyby się nie narodził».' },
    { v: 25, text: 'Wtedy Judasz, który Go miał zdradzić, rzekł: «Czy nie ja, Rabbi?»' },
    { v: 25, cont: true, text: 'Odpowiedział mu: «Tak jest, ty».' },
  ],
  cam: { x: [-60, 120], y: [-40, 280], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { skyCols: ['#2a2f60', '#4d4a7c', '#7d6a8a'] });
    const { SEAT, TOP, FLOOR } = R;
    R.stars.fade(1);
    const shL = S.layer({ par: 0.31, sh: 0, flat: true });
    const jShadow = S.puppet(shL.add(`<g opacity=".22">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#2a2034')}</g>`).firstElementChild);
    shL.fade(0);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatAll(S, seatL);
    if (S.portrait) at.forEach((m) => { m.x = 800 + (m.x - 800) * 0.76; });   // phone: the thirteen sit closer so the table fits
    const J = at.find((m) => m.k === 'jesus'), JU = at.find((m) => m.k === 'judas');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);
    tabL.add(`<g transform="translate(${DISH} ${TOP - 2})">${bowl(c, { w: 40, food: 'stew', color: mix(C.pot, C.clay, 0.4) })}</g>`);
    const cand = tabL.add(`<g transform="translate(900 ${TOP - 2}) scale(.55)">${candle(c, 40)}</g>`);
    const cFlame = cand.querySelector('.flame'), cGlow = cand.querySelector('.glow');
    const smoke = tabL.add(`<g><path d="${c.ribbon(Array.from({ length: 12 }, (_, i) => [Math.sin(i * 0.9) * 5, -i * 6]), (u) => 2.4 - u * 1.8)}" fill="#e8e2da" opacity=".8"/></g>`);

    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".32"/>`);
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: 830, cy: SEAT - 110, r: 230, col: '#141026', o: 0.6 }));
    spotL.fade(0);

    const fx = S.layer({ par: 0.58, sh: 4 });
    const scroll = hanging(fx, `<g transform="scale(1.6)">${scrollOpen(c, 110, 60)}</g>`, { x: 800, y: -1500, len: 700 });
    const rabbi = fx.add(`<g>${say(c, tr('Czy nie ja, Rabbi?', 'It isn’t me, is it, Rabbi?'), { size: 19, side: 1 })}</g>`);
    const you = fx.add(`<g>${say(c, tr('Tak jest, ty', 'You said it'), { size: 20, side: -1, fill: mix(C.cream, C.halo, 0.35) })}</g>`);

    return (t, time) => {
      const T = time;
      shadeL.fade(0.8);
      R.lamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, i);
        const low = 0.65 - (i === 1 ? es(t, 1.05, 1.4) * 0.3 : 0);
        pose(l.fl, { x: 26, y: 36, sx: low * (1 + Math.sin(T * 7 + i) * 0.08), sy: low * (1 + Math.sin(T * 5.3 + i) * 0.12) });
        fade(l.gl, 0.85 * low);
      });

      /* v24a — as it is written */
      const sc = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 0.9, 1.2, ease.in));
      vis(scroll, { x: 800, y: 330 - (1 - sc) * 700, r: Math.sin(T * 0.8) * 1.5, o: sc > 0.01 ? 1 : 0 });
      /* v24b — woe: the shadow grows; v24c — the candle goes out */
      const woe = es(t, 1.05, 1.35);
      shL.fade(woe);
      jShadow.set({ x: JU.x + 20, y: SEAT - 10, s: 0.88 * (1.3 + woe * 0.8), flip: true, head: woe * 18 });
      const out = es(t, 2.1, 2.35);
      pose(cFlame, { x: 0, y: -60, sy: (1 - out) * (1 + Math.sin(T * 8) * 0.08), sx: 1 - out * 0.6 });
      fade(cGlow, (1 - out) * 0.6);
      vis(smoke, { x: 900, y: TOP - 40 - out * 10, sy: out, o: out * (1 - es(t, 2.8, 3.0)) * 0.8 });

      /* v25 — "Is it I, Rabbi?" — "You have said it." */
      const ask = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const answer = es(t, 4.05, 4.3);
      spotL.fade(es(t, 3.0, 3.3));
      at.forEach((m) => {
        let armF = 36, armB = 14, head = 0;
        if (m.k === 'jesus') {
          armF = 30 + bump(t, 0.1, 0.9) * 30 + answer * 26;
          armB = 16 + bump(t, 0.1, 0.9) * 50;
          head = 12 - answer * 4;
          fade(m.sad, 1);
          fade(m.tear, es(t, 2.2, 2.5) * (1 - answer * 0.5));
        } else if (m.k === 'judas') {
          armF = 30 + ask * 40 * (1 - answer);
          armB = 14 + ask * 20;
          head = woe * 12 * (1 - ask) - ask * 8 + answer * 22;
          fade(m.angry, woe * 0.6 * (1 - answer));
          fade(m.sad, answer);
        } else {
          head = 10 + es(t, 3.05, 3.3) * -6;
          fade(m.sad, 1);
        }
        m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, armF, armB, head, blink: blinkAt(T, m.seed) });
      });
      const [jhx, jhy] = headAt(JU.x, SEAT, JU.s, true, 62);
      const rk = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(rabbi, { x: jhx + 6, y: jhy - 34, s: rk, o: rk > 0.01 ? 1 : 0 });
      const [hx, hy] = headAt(800, SEAT, 1.04, false, 62);
      const yk = es(t, 4.15, 4.35, ease.back);
      vis(you, { x: hx - 4, y: hy - 46, s: yk, o: yk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 0], [0.9, 0], [1.2, 60], [2.0, 60], [2.2, 80], [3.0, 40], [4.0, 30]]) + (S.portrait ? 16 : 0);   // phone: the row sits clear of the progress thread
      const zk = kf(t, [[-0.5, 1.2], [0.9, 1.16], [1.2, 1.5], [2.0, 1.5], [2.2, 1.6], [3.0, 1.55], [4.0, 1.65]]);
      S.cam.z = S.portrait ? Math.max(1, zk - 0.12) : zk;   // phone: a little wider, so the whole table shows
      S.cam.y = kf(t, [[-0.5, 100], [0.9, 60], [1.2, 200], [2.0, 200], [2.2, 230], [3.0, 200], [4.0, 210]]);
    };
  },
};
