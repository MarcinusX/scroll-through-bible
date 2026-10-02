// Mt 19,18–20 — "Which ones?" The tablets of the Law hang over them; the young man squints up at them. Jesus names
// them, and the tablets give way to small stones, one for each commandment, coming down in turn: do not murder,
// do not commit adultery, do not steal, do not bear false witness; honour father and mother — and the last, love
// your neighbour as yourself, is a heart. "All these I have kept" — he ticks them off, one by one, proudly. "What do
// I still lack?" An empty frame with a question mark swings down between them.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, LOOK, say, lawTablets, tablet, tick, cart, sack, qmark, heart, FONT, tr } from './lib.js';

const GY = 672;
const JX = 760, MX = 930;
const XS_WIDE = [545, 657, 769, 881, 993, 1110];
// phone: two rows of three (the row of six ran past both edges)
const XS_TALL = [580, 760, 940, 670, 850, 1030];

/** the heart-shaped commandment: love your neighbour as yourself; origin top-centre (on its string) */
function heartStone(c, lines) {
  const txt = lines.map((l, i) => `<text x="0" y="${(40 + i * 16).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="14" fill="${C.cream}">${l}</text>`).join('');
  return `<circle cy="44" r="70" fill="url(#warm-glow)" opacity=".6"/><g transform="translate(0 42) scale(2.7)">${heart(c, 22)}</g>${txt}`;
}

export default {
  id: 'mt19-which',
  beats: [
    { v: 18, text: 'Zapytał Go: «Które?»' },
    { v: 18, cont: true, text: 'Jezus odpowiedział: «Oto te: Nie zabijaj, nie cudzołóż, nie kradnij, nie zeznawaj fałszywie,' },
    { v: 19 },
    { v: 20, text: 'Odrzekł Mu młodzieniec: «Przestrzegałem tego wszystkiego,' },
    { v: 20, cont: true, text: 'czego mi jeszcze brakuje?»' },
  ],
  cam: { x: [-40, 40], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const XS = P ? XS_TALL : XS_WIDE;
    const R = roadSet(S, { jer: 0.21, jerX: 1170, roadX: 820, trees: 18, clouds: [[480, 150, 170], [1000, 120, 120]] });
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1400, 606, 0.9) + bush(c, 1330, 610, 60, C.sage, C.moss));
    const cartL = S.layer({ par: 0.42, sh: 4 });
    const K = cart(c, 190);
    const KX = S.portrait ? 130 : 0;   // phone: the cart and sack wait just off the right edge instead of peeping under the thread (seen whole in mt19-perfect)
    cartL.add(`<g transform="translate(${1200 + KX} ${GY - 70}) scale(.8)">${K.body}<g transform="translate(-40 0)">${K.wheel}</g><g transform="translate(50 0)">${K.wheel}</g></g>`);
    cartL.add(`<g transform="translate(${1100 + KX} ${GY - 34}) scale(.9)">${sack(c, 44)}</g>`);

    /* hanging: the tablets, then the six stones, then the empty frame */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const law = hanging(hangL, `<g transform="translate(0 150)">${lawTablets(c, { w: 76, h: 110 })}</g>`, { x: 800, y: 110, len: 900 });
    const CM = [
      tr(['nie zabijaj'], ['Do not', 'murder']), tr(['nie cudzołóż'], ['Do not commit', 'adultery']), tr(['nie kradnij'], ['Do not', 'steal']),
      tr(['nie zeznawaj', 'fałszywie'], ['No false', 'testimony']), tr(['czcij ojca', 'i matkę'], ['Honor father', 'and mother']),
    ];
    const stones = CM.map((lines, i) => ({ el: hanging(hangL, tablet(c, lines, { w: 106, size: 14 }), { x: XS[i], y: 240, len: 900 }), tk: hangL.add(`<g opacity="0">${tick(c, 17)}</g>`), i, h: 34 + lines.length * 16 }));
    const hs = { el: hanging(hangL, heartStone(c, tr(['miłuj', 'bliźniego', 'jak siebie'], ['Love your', 'neighbor as', 'yourself'])), { x: XS[5], y: 230, len: 900 }), tk: hangL.add(`<g opacity="0">${tick(c, 17)}</g>`), i: 5, h: 92 };
    stones.push(hs);
    const frame = hanging(hangL, `<g>${sheet().p(c.ribbon(c.arc(0, 0, 50, 50, 0, Math.PI * 2, 36), 6), C.ochre).out()}<circle r="45" fill="${C.cream}" opacity=".45"/><path d="${c.ribbon(c.arc(0, 0, 38, 38, 0, Math.PI * 2, 36), 1.6)}" fill="${C.inkSoft}" opacity=".45"/><g transform="scale(1.5)">${qmark(c)}</g></g>`, { x: 845, y: 400, len: 700 });

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1], TWELVE[6]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const man = S.puppet(pL.add(person(c, LOOK.rich)));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const which = wordL.add(`<g opacity="0">${say(c, tr('Które?', 'Which ones?'), { size: 22, side: 1 })}</g>`);
    const kept = wordL.add(`<g opacity="0">${say(c, tr(['Przestrzegałem', 'tego wszystkiego!'], ['All these things', 'I have observed!']), { size: 18, side: 1 })}</g>`);
    const lack = wordL.add(`<g opacity="0">${say(c, tr(['Czego mi jeszcze', 'brakuje?'], ['What do I', 'still lack?']), { size: 18, side: 1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 20 });

      /* beat 0: "Which ones?" — under the tablets */
      const q = es(t, 0.02, 0.25) * (1 - es(t, 0.9, 1.05));
      const lu = es(t, 1.0, 1.3);
      swing(law, 800, 170 - lu * 1100, T, 0.8, 0.6);
      const proud = es(t, 3.02, 3.25) * (1 - es(t, 3.95, 4.1));
      const tickK = (t - 3.1) / 0.8;
      const ask2 = es(t, 4.02, 4.25);
      man.set({ x: MX, y: GY, s: 0.96, flip: true, armF: 14 + q * 50 + proud * (60 + Math.sin(Math.max(0, Math.min(1, tickK)) * Math.PI * 6) * 15) + ask2 * 50, armB: q * 20 + proud * 30 + ask2 * 90, head: -4 - q * 12 - bump(t, 1.1, 2.9) * 10 - proud * 4 + ask2 * 3, blink: blinkAt(T, 4) });
      pose(which, { x: MX - 20, y: GY - 196, s: es(t, 0.02, 0.22, ease.back), o: t > 0.02 && t < 1.05 ? 1 - es(t, 0.9, 1.05) : 0 });
      pose(kept, { x: MX - 26, y: GY - 196, s: es(t, 3.02, 3.25, ease.back), o: t > 3.02 && t < 4.05 ? 1 - es(t, 3.9, 4.05) : 0 });
      pose(lack, { x: MX - 26, y: GY - 196, s: es(t, 4.02, 4.25, ease.back), o: t > 4.02 ? 1 : 0 });

      /* Jesus names them */
      const name = es(t, 1.02, 1.25) * (1 - es(t, 2.9, 3.05));
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 16 + name * (70 + Math.sin(T * 1.2) * 6), armB: name * 60, head: -4 - name * 6 + Math.sin(T * 0.6), blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: JX - 150 - d.i * 62, y: GY - 30 + (d.i % 2) * 12, s: 0.84, head: -3 - name * 6, armF: 10, blink: blinkAt(T, d.seed) }));

      /* the stones come down, four in beat 1, two in beat 2; ticks in beat 3; they lift in beat 4 */
      const lift = es(t, 4.0, 4.35);
      stones.forEach((st) => {
        const t0 = st.i < 4 ? 1.05 + st.i * 0.12 : 2.05 + (st.i - 4) * 0.25;
        const d = es(t, t0, t0 + 0.28, ease.back);
        const y0 = P ? (st.i < 3 ? 110 + (st.i % 2) * 16 : st.i === 5 ? 250 : 270 + (st.i % 2) * 16) : st.i === 5 ? 214 : 244 + (st.i % 2) * 30;
        const y = y0 - (1 - d) * 1100 - lift * 1100;
        swing(st.el, XS[st.i], y, T, 1.3, 0.8, st.i);
        const tk = es(t, 3.1 + st.i * 0.12, 3.25 + st.i * 0.12, ease.back);
        pose(st.tk, { x: XS[st.i] + 40, y: y + st.h - 10, s: tk, r: -8, o: tk > 0.02 ? 1 : 0 });
      });

      /* beat 4: what do I still lack? */
      const fr = es(t, 4.15, 4.5, ease.back);
      swing(frame, 845, 250 - (1 - fr) * 1100, T, 1.2, 0.8, 2);

      S.cam.z = 1 + es(t, 0.9, 1.4) * 0.03;
      S.cam.y = -es(t, 0.9, 1.4) * 26 + es(t, 3.9, 4.4) * 16;
      S.cam.x = es(t, -0.2, 0.4) * 20;
    };
  },
};
