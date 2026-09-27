// J 14,15–17 — the promise of the Advocate. "If you love Me, you will keep My commandments": over each of them a
// small heart appears with a rolled scroll kept inside it. "I will ask the Father and He will give you another
// Advocate": He looks up and prays; a light opens above and a dove of light comes down. "To be with you for ever":
// the dove flies along the table and beside every disciple a small clay lamp kindles and stays burning. "The Spirit
// of truth, whom the world cannot receive, because it neither sees Him nor knows Him": the dove flies to the window —
// outside grey passers-by go by with their eyes shut, and the shutters swing closed before it. "But you know Him,
// for He dwells with you and will be in you": it comes back, and the flames of the lamps rise into their hearts.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, heart, scrollRolled, dove, flapWings, clayLamp, lightLamp,
  shutter, passerOpts, radiance, glowDisc, soulLight, kf, vis, headAt, PI,
} from './lib.js';

const WIN = { x0: 1010, x1: 1130, top: 330, bot: 520 };

export default {
  id: 'j14-advocate',
  beats: [
    { v: 15 },
    { v: 16, text: 'Ja zaś będę prosił Ojca, a innego Pocieszyciela da wam,' },
    { v: 16, cont: true, text: 'aby z wami był na zawsze -' },
    { v: 17, text: 'Ducha Prawdy, którego świat przyjąć nie może, ponieważ Go nie widzi ani nie zna.' },
    { v: 17, cont: true, text: 'Ale wy Go znacie, ponieważ u was przebywa i w was będzie.' },
  ],
  cam: { x: [-40, 260], y: [-80, 80], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    let street;
    const R = nightRoom(S, {
      between(S) {
        const L = S.layer({ par: 0.2, sh: 3 });
        const folk = [0, 1, 2].map((i) => S.puppet(L.add(person(c, passerOpts(i)))));
        return { L, folk };
      },
    });
    street = R.extra;
    const { SEAT, TOP, FLOOR } = R;
    // shutters of the right window
    const shL = S.layer({ par: 0.3, sh: 3 });
    const shutL = shL.add(`<g>${shutter(c, -1, 60, WIN.bot - WIN.top)}</g>`);
    const shutR = shL.add(`<g>${shutter(c, 1, 60, WIN.bot - WIN.top)}</g>`);
    // the light above
    const hiL = S.layer({ par: 0.33, sh: 0, flat: true });
    const above = hiL.add(`<g>${glowDisc(200, 'halo-glow', 0.9)}<g transform="scale(.36)">${radiance(c, 150)}</g></g>`);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    seatL.add(`<g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g>`);
    const J = at.find((m) => m.k === 'jesus');
    const others = at.filter((m) => m.k !== 'jesus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);
    const fx = S.layer({ par: 0.56, sh: 4 });
    const lamps = others.map((m) => ({ m, x: m.x + (m.flip ? -26 : 26), el: fx.add(`<g>${clayLamp(c)}</g>`) }));
    const hearts = others.map((m) => fx.add(`<g>${heart(c, 13)}<g transform="translate(0 2) rotate(-30) scale(.34)">${scrollRolled(c, 44)}</g></g>`));
    const flames = others.map(() => fx.add(`<g>${soulLight(c, 8)}</g>`));
    const doveL = S.layer({ par: 0.6, sh: 4 });
    const dv = doveL.add(`<g><circle r="46" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const dvBird = dv.querySelector('.bird');

    return (t, time) => {
      const T = time;
      R.update(T, 1);
      /* v15 — hearts that keep the commandments */
      others.forEach((m, i) => {
        const d = Math.abs(m.x - 800);
        const k = es(t, 0.1 + d * 0.0006, 0.3 + d * 0.0006, ease.back) * (1 - es(t, 0.95, 1.1));
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        vis(hearts[i], { x: hx, y: hy - 52 + (T ? Math.sin(T * 1.5 + i) * 2 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v16a — He prays; a light above; the dove comes down */
      const pray = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.3));
      vis(above, { x: 800, y: 240, s: 0.6 + es(t, 1.1, 1.4) * 0.4, o: es(t, 1.1, 1.35) * (1 - es(t, 2.05, 2.4)) });
      // the dove's flight
      let dx = 800, dy = 150, face = 1;
      const d1 = es(t, 1.35, 1.85, ease.inOut);
      dx = 800; dy = lerp(230, 470, d1);
      const row = seg(t, 2.05, 2.75);
      if (row > 0) { dx = lerp(420, 1180, ease.io(row)) * (row < 0.08 ? row / 0.08 : 1) + (row < 0.08 ? 800 * (1 - row / 0.08) : 0); dy = 510 + Math.sin(row * PI * 6) * 14; }
      const toWin = es(t, 3.02, 3.4, ease.inOut), back = es(t, 3.6, 3.95, ease.inOut), home = es(t, 4.05, 4.4, ease.inOut);
      if (t > 2.75) { dx = lerp(1180, 1070, toWin); dy = lerp(510, 430, toWin); }
      if (back > 0) { dx = lerp(1070, 960, back); dy = lerp(430, 470, back) - Math.sin(back * PI) * 30; face = -1; }
      if (home > 0) { dx = lerp(960, 800, home); dy = lerp(470, 440, home); face = -1; }
      if (t > 3.3 && back <= 0) face = 1;
      const dvo = es(t, 1.3, 1.45);
      vis(dv, { x: dx, y: dy + (T ? Math.sin(T * 2.2) * 3 : 0), s: 0.95, sx: face, o: dvo });
      if (dvo > 0.01) flapWings(dvBird, T || t * 3, 30, 7);
      /* v16b — a lamp kindles beside each of them and stays */
      lamps.forEach((l, i) => {
        const k = es(t, 2.08 + ((l.m.x - 420) / 760) * 0.62, 2.16 + ((l.m.x - 420) / 760) * 0.62);
        pose(l.el, { x: l.x, y: TOP - 1, s: 0.9, sx: l.m.flip ? -1 : 1 });
        lightLamp(l.el, k * (1 - es(t, 4.1, 4.5) * 0.4), T, i);
        // v17b — their flames go into their hearts
        const r = es(t, 4.15 + i * 0.02, 4.45 + i * 0.02, ease.inOut);
        const cx = l.m.x + (l.m.flip ? -4 : 4), cy = SEAT - 70 * l.m.s;
        vis(flames[i], { x: lerp(l.x + (l.m.flip ? -21 : 21), cx, r), y: lerp(TOP - 22, cy, r) - Math.sin(r * PI) * 30, s: 0.7 + r * 0.4, o: r > 0.01 ? 1 : 0 });
      });
      /* v17a — the world outside cannot receive Him */
      const world = es(t, 3.0, 3.2);
      street.L.fade(world);
      street.folk.forEach((p, i) => {
        const x = 960 + ((t - 3) * 90 + i * 70) % 220;
        p.set({ x, y: 548, s: 0.46, flip: false, walk: t * 18 + i, amt: 0.6, head: 10, blink: 1 });
      });
      const shut = es(t, 3.32, 3.58);
      const so = es(t, 3.05, 3.25);
      pose(shutL, { x: WIN.x0, y: WIN.bot, sx: lerp(-0.9, 1, shut), o: so });
      pose(shutR, { x: WIN.x1, y: WIN.bot, sx: lerp(-0.9, 1, shut), o: so });

      at.forEach((m) => {
        if (m.k === 'jesus') {
          sitAt(m, SEAT, T, { armF: 30 + pray * 70 + es(t, 4.1, 4.4) * 40, armB: 14 + pray * 130 + bump(t, 2.1, 2.8) * 40 + es(t, 4.1, 4.4) * 60, head: -pray * 16 });
          return;
        }
        const d = Math.abs(m.x - 800);
        const handOn = es(t, 0.12 + d * 0.0006, 0.3 + d * 0.0006) * (1 - es(t, 0.95, 1.15));
        const watchDove = es(t, 1.4, 1.7) * (1 - es(t, 2.9, 3.1));
        const toWindow = es(t, 3.05, 3.3) * (1 - es(t, 3.6, 3.9));
        sitAt(m, SEAT, T, { armF: 36 - handOn * 20 + es(t, 4.3, 4.6) * 10, armB: 14, head: -watchDove * 12 - toWindow * 4 + es(t, 4.3, 4.6) * 4, flip: toWindow > 0.5 && m.x < 1000 ? false : m.flip });
      });

      S.cam.x = kf(t, [[0, 0], [2.9, 0], [3.3, 220], [3.7, 220], [4.1, 0], [5, 0]]);
      S.cam.y = kf(t, [[0, 40], [1, 20], [1.4, -40], [2, 0], [2.9, 20], [3.3, -40], [3.7, -40], [4.1, 20], [5, 30]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.1], [1.4, 1.02], [2, 1.06], [2.9, 1.06], [3.3, 1.35], [3.7, 1.35], [4.1, 1.1], [5, 1.14]]);
    };
  },
};
