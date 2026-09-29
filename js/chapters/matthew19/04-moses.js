// Mt 19,7–8 — "Why then did Moses command…?" Moses comes down in his round portrait, the bill of divorce unrolls,
// and the scissors snip the ribbon: the paper wife is sent away to the edge of the card. "Because of the hardness of
// your hearts" — the Pharisees' hearts turn to stone, and a great stone heart hangs by the bill. "But from the
// beginning it was not so": bill, portrait and card are drawn up, and the dawn of the first garden comes down in
// their place, the first man and woman hand in hand.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix, hanging, swing } from '../kit.js';
import { olive, house, bush, rock } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, pharisee, TWELVE, LOOK, doll, scissors, snip, stoneHeart, scrollParts, lawTablets, say, throng, beginningDisc, tr } from './lib.js';

const GY = 668;
const JX = 760;
const PH = [{ x: 960, s: 0.98 }, { x: 1050, s: 0.94 }, { x: 1140, s: 0.9 }];

export default {
  id: 'mt19-moses',
  beats: [
    { v: 7 },
    { v: 8, text: 'Odpowiedział im: «Przez wzgląd na zatwardziałość serc waszych pozwolił wam Mojżesz oddalać wasze żony;' },
    { v: 8, cont: true, text: 'lecz od początku tak nie było.' },
  ],
  cam: { x: [-40, 40], y: [-30, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.1, jerX: 1180, roadX: 820, trees: 18, clouds: [[430, 140, 180], [1080, 120, 130]] });
    const vil = S.layer({ par: 0.28, sh: 3 });
    vil.add(house(c, 250, 590, 90, 64) + house(c, 350, 596, 70, 50) + house(c, 180, 600, 60, 44) + olive(c, 470, 600, 0.9) + olive(c, 1330, 600, 0.8) + bush(c, 1250, 604, 60, C.sage, C.moss));
    const back = S.layer({ par: 0.4, sh: 3 });
    back.sprite(throng(c, 7, { s: 0.5, spread: 34, rows: 1, face: 1, arms: [0, 20] }), 420, 612);
    back.sprite(throng(c, 6, { s: 0.5, spread: 34, rows: 1, face: -1, arms: [0, 20] }), 1250, 614);

    /* hanging things */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const cardW = 230, cardH = 170;
    const card = sheet().p(c.cut(c.rect(-cardW / 2, 0, cardW, cardH), 0.6, 8), C.cream).p(c.cut(c.rect(-cardW / 2 + 8, 8, cardW - 16, cardH - 16), 0.4, 8), mix(C.parchment, C.blushVeil, 0.25)).out();
    const cardEl = hanging(hangL, `<g>${card}</g>`, { x: 830, y: 160, len: 800 });
    const dollL = S.layer({ par: 0.3, sh: 3 });
    const hisDoll = dollL.add(`<g>${doll(c, C.dustyBlue)}</g>`);
    const herDoll = dollL.add(`<g>${doll(c, C.roseRobe, { woman: true, skin: C.skin })}</g>`);
    const tie = dollL.add(`<path d="${c.ribbon(c.qbez([-26, 0], [0, 8], [26, 0], 8), 5)}" fill="${C.sun}"/>`);
    const tieCut = dollL.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([-26, 0], [-12, 6], [-4, 12], 6), 5)}" fill="${C.sun}"/></g>`);
    const tieCut2 = dollL.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([4, 12], [12, 6], [26, 0], 6), 5)}" fill="${C.sun}"/></g>`);
    const sciss = dollL.add(`<g>${scissors(c, 90)}</g>`);
    // Moses in a round portrait
    const mosesPlate = `${sheet().p(c.cut(c.circ(0, 0, 86, 40), 0.6, 6), C.ochre).p(c.cut(c.circ(0, 0, 78, 40), 0.5, 6), mix(C.parchment, C.dune, 0.3)).out()}<g transform="translate(-8 72) scale(.62)">${person(c, { ...LOOK.moses, holdF: `<g transform="translate(20 -30) rotate(-20) scale(.9)">${lawTablets(c, { w: 40, h: 58 })}</g>` })}</g>`;
    const moses = hanging(hangL, `<g transform="translate(0 70) scale(.8)">${mosesPlate}</g>`, { x: 590, y: 110, len: 800 });
    const mosesP = S.puppet(moses.querySelector('.fig'));
    // the bill of divorce
    const sc = scrollParts(c, { w: 190, h: 150, title: tr('list rozwodowy', 'bill of divorce'), lines: 5 });
    const scrollEl = hanging(hangL, `<g><g class="sheet">${sc.sheet.replace('font-size="30"', 'font-size="22"').replace('y="42"', 'y="36"')}</g><g>${sc.rod}</g></g>`, { x: 1080, y: 130, len: 800 });
    const scrollSheet = scrollEl.querySelector('.sheet');
    const heavy = hanging(hangL, `<g transform="translate(0 40) scale(1.8)">${stoneHeart(c, 22)}</g>`, { x: 1200, y: 300, len: 800 });
    // from the beginning
    const begin = hanging(hangL, `<g transform="translate(0 100)">${beginningDisc(c, 92)}</g>`, { x: 830, y: 130, len: 800 });

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), x: 470 + i * 62, y: GY - 26 + (i % 2) * 10, p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const PHs = PH.map((ph, i) => ({ ...ph, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, pharisee(c, i + 1)))) }));
    const hearts = PHs.map(() => pL.add(`<g opacity="0">${stoneHeart(c, 12)}</g>`));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const why = wordL.add(`<g opacity="0">${say(c, tr(['Czemu więc Mojżesz', 'polecił dać list rozwodowy?'], ['Why then did Moses', 'command a bill of divorce?']), { size: 18, side: -1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 990, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 70, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 3) * 16 });

      /* beat 0: "why then did Moses command…?" */
      const obj = es(t, 0.02, 0.25) * (1 - es(t, 0.9, 1.05));
      const stung = es(t, 1.2, 1.45);
      PHs.forEach((ph) => {
        const arm = ph.i === 1 ? obj : 0;
        ph.p.set({ x: ph.x, y: GY, s: ph.s, flip: true, armF: 10 + arm * 76 + stung * 6, armB: arm * 30, head: -arm * 4 + stung * 7, lean: stung * -2, blink: blinkAt(T, ph.seed) });
        pose(hearts[ph.i], { x: ph.x - 6 * ph.s, y: GY - 112 * ph.s, s: ph.s * es(t, 1.15 + ph.i * 0.08, 1.4 + ph.i * 0.08, ease.back), o: t > 1.14 ? 1 : 0 });
      });
      pose(why, { x: PH[1].x - 40, y: GY - 214, s: es(t, 0.04, 0.28, ease.back), o: t > 0.04 && t < 1.05 ? 1 - es(t, 0.92, 1.05) : 0 });

      const card = 1 - es(t, 2.0, 2.3);
      const cy = 170 - (1 - card) * 1100;
      swing(cardEl, 830, cy, T, 0.8, 0.6);
      const cut = bump(t, 0.45, 0.7), part = es(t, 0.6, 0.95);
      pose(hisDoll, { x: 800 - part * 12, y: cy + 150, s: 1, r: part * -3 });
      pose(herDoll, { x: 860 + part * 56, y: cy + 150, s: 1, r: part * 8, o: 1 - part * 0.35 });
      pose(tie, { x: 830, y: cy + 104, o: part > 0.02 ? 0 : 1 });
      pose(tieCut, { x: 830 - part * 12, y: cy + 104 + part * 6, r: part * -20, o: part > 0.02 ? 1 : 0 });
      pose(tieCut2, { x: 830 + part * 56, y: cy + 104 + part * 10, r: part * 24, o: part > 0.02 ? 1 : 0 });
      const sIn = es(t, 0.2, 0.45);
      pose(sciss, { x: lerp(1080, 915, sIn) - cut * 30, y: cy + 74 + cut * 8, r: 166, s: 0.9, o: sIn * (1 - es(t, 0.95, 1.2)) });
      snip(sciss, 36 - cut * 34);

      const mo = es(t, 0.1, 0.45, ease.back) * (1 - es(t, 2.0, 2.3));
      swing(moses, 590, 100 - (1 - mo) * 1100, T, 1, 0.7, 1);
      mosesP.set({ x: 0, y: 0, s: 1, armF: 70, armB: 20 + es(t, 1.1, 1.4) * 40, head: -4, blink: blinkAt(T, 5) });
      const sd = es(t, 0.25, 0.55, ease.back) * (1 - es(t, 2.05, 2.35));
      swing(scrollEl, 1080, 130 - (1 - sd) * 1100, T, 1, 0.6, 2);
      pose(scrollSheet, { sy: 0.05 + 0.95 * es(t, 0.4, 0.75) * (1 - es(t, 2.0, 2.2)) });

      /* beat 1: hardness of heart */
      const hv = es(t, 1.2, 1.55, ease.back) * (1 - es(t, 2.4, 2.7) * 0.0);
      swing(heavy, 1195, 300 - (1 - hv) * 1100, T, 1.2, 0.8, 3);

      /* beat 2: from the beginning it was not so */
      const bg = es(t, 2.12, 2.45, ease.back);
      swing(begin, 830, 110 - (1 - bg) * 1100, T, 0.8, 0.5, 4);

      /* Jesus */
      const answer = es(t, 1.03, 1.25) * (1 - es(t, 1.95, 2.1));
      const up = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 18 + answer * 72 + up * 40, armB: answer * 30 + up * 140, head: -answer * 3 - up * 10 + Math.sin(T * 0.6) * 1.2, blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.84, head: -3 - up * 8, armF: 10 + (d.i === 0 ? bump(t, 2.3, 2.95) * 24 : 0), blink: blinkAt(T, d.seed) }));

      S.cam.z = 1 + es(t, -0.2, 0.5) * 0.04 + es(t, 1.9, 2.4) * 0.02;
      S.cam.y = -es(t, -0.2, 0.5) * 10 - es(t, 1.9, 2.4) * 20;
      S.cam.x = es(t, 1.0, 1.4) * 30 * (1 - es(t, 1.9, 2.3));
    };
  },
};
