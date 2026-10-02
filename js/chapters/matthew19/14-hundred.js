// Mt 19,29–30 — "Everyone who has left houses, brothers, sisters, father, mother, children or fields for My name's
// sake" — a row of little picture cards comes down. "Will receive a hundredfold": each card fans out into a whole
// hand of cards. "And will inherit eternal life": a great dawn rises behind the far hills. Last: a line of paper
// dolls, numbered, stands before a gate of light — and turns round: the first will be last, and the last first.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing } from '../kit.js';
import { bush, rock, olive, sun as sunCut } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, doll, slip, card, leftIcons, kingdomGate, sheet, tr } from './lib.js';

const GY = 676;
const JX = 780;
const ETERNAL = ['#e7dcc8', '#f8e3bf', '#fbe7c6'];

export default {
  id: 'mt19-hundred',
  beats: [
    { v: 29, text: 'I każdy, kto dla mego imienia opuści dom, braci lub siostry, ojca lub matkę, dzieci lub pole,' },
    { v: 29, cont: true, text: 'stokroć tyle otrzyma' },
    { v: 29, cont: true, text: 'i życie wieczne odziedziczy.' },
    { v: 30 },
  ],
  cam: { x: [-30, 30], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // the dawn of eternal life rises behind the far hills (its layer sits between the sky and the hills)
    const R = roadSet(S, {
      sky2: ETERNAL, jer: 0.32, jerX: 1190, roadX: 820, trees: 16, sunAt: [1320, 150], clouds: [[470, 140, 160], [1080, 110, 110]],
      behind: () => {
        const dawnL = S.layer({ par: 0.06, sh: 1, flat: true });
        return {
          dawn: dawnL.add(`<g opacity="0">${rays(c, { n: 22, r0: 70, r1: 1000, spread: 0.045, color: '#fff1c6' })}<circle r="340" fill="url(#halo-glow)"/><circle r="130" fill="url(#warm-glow)"/></g>`),
          dawnSun: dawnL.add(`<g opacity="0">${sunCut(c, 70, { rays: C.sunDeep, disc: '#f3c070', inner: '#f8d9a0' })}</g>`),
        };
      },
    });
    const { dawn, dawnSun } = R.behind;
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1420, 606, 0.9));

    /* the row of picture cards, each with a hundred behind it */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const ICONS = leftIcons(c);
    const n = ICONS.length, step = S.portrait ? 82 : n > 7 ? 92 : 104;
    const XS = ICONS.map((_, i) => (S.portrait ? 790 : 800) + (i - (n - 1) / 2) * step);   // phone: the row inside the screen
    const CARDS = ICONS.map(([, icon], i) => {
      const one = card(c, icon);
      let fan = '';
      for (let k = 0; k < 6; k++) fan += `<g transform="translate(0 110) rotate(${(k - 2.5) * 11}) translate(0 -110)">${one}</g>`;
      // the fan is its own cut-out behind the card, so it grows and fades on the compositor
      const fanEl = hangL.add(`<g opacity="0">${fan}</g>`);
      const el = hanging(hangL, `<g>${one}</g>`, { x: XS[i], y: 230, len: 800 });
      return { el, fan: fanEl, i, x: XS[i] };
    });
    const times = hangL.add(`<g opacity="0">${slip(c, '× 100', { size: 32 })}</g>`);

    /* verse 30: the line of numbered dolls before a gate of light; it turns round */
    const qL = S.layer({ par: 0.3, sh: 4 });
    // (on a phone the closing card covers the top of the stage, so there the line stands on the ground in front)
    const P = S.portrait;
    const QY = P ? 850 : 268;
    const hang_ = (m) => (P ? qL.add(`<g>${m}</g>`) : hanging(qL, m, { x: 0, y: 0, len: 800 }));
    const gateEl = hang_(`<g transform="scale(.8)">${kingdomGate(c, 44, 96)}</g>`);
    const DOLLC = [C.dustyBlue, C.roseRobe, C.sageRobe, C.ochreRobe, C.lavender, C.tealRobe, C.wheatRobe, C.mauve];
    const QUEUE = DOLLC.map((col, i) => ({
      i, x: (P ? 990 : 1080) - i * (P ? 60 : 70),
      el: hang_(`<g transform="translate(0 -100)">${slip(c, String(i + 1), { size: 17, w: 28 })}</g>`),
      d: qL.add(`<g>${doll(c, col, { woman: i % 2 === 1, h: 70, skin: [C.skin, C.skin2, C.skin3][i % 3] })}</g>`),
    }));

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 3, 1, 2, 6].map((k, i) => ({ i, p: S.puppet(pL.add(person(c, TWELVE[k].o))), seed: c.rr(0, 9), x: 1000 + i * 56, y: GY - 36 + (i % 2) * 14 }));
    const LEFT = [4, 5, 7, 8].map((k, i) => ({ i, p: S.puppet(pL.add(person(c, TWELVE[k].o))), seed: c.rr(0, 9), x: 580 - i * 56, y: GY - 36 + (i % 2) * 14 }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 4) * 20 });
      const eternal = es(t, 2.02, 2.5);
      R.sk2.layer.fade(eternal * (1 - es(t, 3.0, 3.4) * 0.5));

      /* Jesus speaks */
      const speak = es(t, 0.02, 0.3);
      const up = eternal * (1 - es(t, 3.0, 3.3));
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 18 + speak * (50 + Math.sin(T * 1.2) * 8) * (1 - up) + up * 80, armB: speak * 40 + up * 90, head: -3 - up * 8 + Math.sin(T * 0.6), blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.86, flip: true, head: -3 - up * 6 - bump(t, 0.2, 1.9) * 5, armF: 10 + up * 30, blink: blinkAt(T, d.seed) }));
      LEFT.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.86, head: -3 - up * 6 - bump(t, 0.2, 1.9) * 5, armF: 10 + up * 30, blink: blinkAt(T, d.seed) }));

      /* beat 0: the cards come down; beat 1: a hundredfold */
      const fan = es(t, 1.05, 1.45);
      const rise = es(t, 2.0, 2.4);
      CARDS.forEach((cd) => {
        const d = es(t, 0.05 + cd.i * 0.08, 0.35 + cd.i * 0.08, ease.back);
        const y = 250 + (cd.i % 2) * 22 - (1 - d) * 1100 - rise * 1100, r = Math.sin(T * 0.8 + cd.i) * 1.4 * (1 - fan);
        pose(cd.el, { x: cd.x, y, r, oy: 0 });
        pose(cd.fan, { x: cd.x, y, r, s: 0.6 + fan * 0.4, o: fan });
      });
      pose(times, { x: 800, y: 440, s: es(t, 1.2, 1.45, ease.back) * 1.1, r: -4, o: t > 1.2 && t < 2.3 ? 1 - es(t, 2.0, 2.3) : 0 });

      /* beat 2: eternal life — a great dawn */
      pose(dawn, { x: 1000, y: 470, s: 0.5 + eternal * 0.6, r: t * 6, o: eternal * (1 - es(t, 2.9, 3.3) * 0.7) });
      pose(dawnSun, { x: 1000, y: 470 - eternal * 60 + es(t, 2.9, 3.4) * 140, o: eternal });

      /* beat 3: the line of dolls before the gate turns round — the last first, the first last */
      const q = es(t, 2.9, 3.25, ease.back);
      const turn = es(t, 3.35, 3.7);
      if (P) pose(gateEl, { x: 1050, y: QY + (1 - q) * 60, o: q }); else swing(gateEl, 1165, QY - (1 - q) * 1100, T, 0.8, 0.6, 5);
      QUEUE.forEach((m) => {
        const x = lerp(m.x, (P ? 1540 : 1710) - m.x, turn) + 10;
        const y = QY + (P ? (1 - q) * 60 : -(1 - q) * 1100) - Math.sin(turn * Math.PI) * 26, r = P ? 0 : Math.sin(T * 0.9 + m.i) * 1.6;
        pose(m.el, { x, y, r, oy: 0, o: P ? q : 1 });
        const cs = Math.cos(turn * Math.PI);
        pose(m.d, { x, y, sx: cs >= 0 ? Math.max(0.15, cs) : -Math.max(0.15, -cs), o: P ? q : 1 });
      });

      S.cam.y = -es(t, -0.2, 0.3) * 30 + es(t, 2.8, 3.2) * 20;
      S.cam.z = 1 + es(t, 0.9, 1.3) * 0.02 + es(t, 2.8, 3.2) * 0.02;
    };
  },
};
