// Mk 10,2–5 — Pharisees come to test him: "Is it lawful for a man to put away his wife?"
// A card with two paper dolls hand in hand drops from the flies, a pair of scissors hovering near it.
// "What did Moses command you?" — Moses' portrait comes down; "a bill of divorce" — a scroll unrolls
// and the scissors snip the dolls apart. "Because of the hardness of your hearts" — hearts of stone.
import { C, person, CAST, blinkAt, pose, lerp, crowd, sheet, shade, mix, hanging, swing } from '../kit.js';
import { olive, house, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, pharisee, TWELVE, LOOK, doll, scissors, snip, stoneHeart, scrollParts, lawTablets, thought, say, qmark, hang2 } from './lib.js';

const GY = 668;
const JX = 740;
const PH = [{ x: 950, s: 0.98 }, { x: 1045, s: 0.94 }, { x: 1135, s: 0.9 }];

/** a fish-hook: the trap in a testing question */
function hook(c) {
  return sheet().p(c.ribbon([[0, -18], [0, 6], ...c.arc(-7, 6, 7, 8, 0, Math.PI, 8).slice(1), [-14, 0]], 3), C.rock3).p(c.cut([[-16, -2], [-12, -8], [-11, 2]], 0.2, 2), C.rock3).x(c.ribbon([[0, -18], [2, -30]], 1), C.ink).out();
}

export default {
  id: 'm10-test',
  beats: [
    { v: 2, text: 'Przystąpili do Niego faryzeusze i chcąc Go wystawić na próbę,' },
    { v: 2, cont: true, text: 'pytali Go, czy wolno mężowi oddalić żonę.' },
    { v: 3 },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-40, 60], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.1, jerX: 1180, roadX: 820, trees: 18, clouds: [[420, 140, 180], [1060, 120, 130]] });
    const vil = S.layer({ par: 0.28, sh: 3 });
    vil.add(house(c, 250, 590, 90, 64) + house(c, 350, 596, 70, 50) + house(c, 180, 600, 60, 44) + olive(c, 470, 600, 0.9) + olive(c, 1330, 600, 0.8) + bush(c, 1250, 604, 60, C.sage, C.moss));

    const back = S.layer({ par: 0.4, sh: 3 });
    const folk = crowd(S, back, [{ y: 612, s: 0.5, n: 9, x0: 300, x1: 1400 }]).filter((m) => Math.abs(m.x - JX) > 80);

    /* hanging things */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    // the card with the two dolls
    const cardW = 230, cardH = 170;
    const card = sheet().p(c.cut(c.rect(-cardW / 2, 0, cardW, cardH), 0.6, 8), C.cream).p(c.cut(c.rect(-cardW / 2 + 8, 8, cardW - 16, cardH - 16), 0.4, 8), mix(C.parchment, C.blushVeil, 0.25)).out();
    const cardEl = hanging(hangL, `<g>${card}</g>`, { x: 830, y: 170, len: 800 });
    const dollL = S.layer({ par: 0.3, sh: 3 });
    const hisDoll = dollL.add(`<g>${doll(c, C.dustyBlue)}</g>`);
    const herDoll = dollL.add(`<g>${doll(c, C.roseRobe, { woman: true, skin: C.skin })}</g>`);
    const tie = dollL.add(`<path d="${c.ribbon(c.qbez([-26, 0], [0, 8], [26, 0], 8), 5)}" fill="${C.sun}"/>`);
    const tieCut = dollL.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([-26, 0], [-12, 6], [-4, 12], 6), 5)}" fill="${C.sun}"/></g>`);
    const tieCut2 = dollL.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([4, 12], [12, 6], [26, 0], 6), 5)}" fill="${C.sun}"/></g>`);
    const sciss = dollL.add(`<g>${scissors(c, 90)}</g>`);
    // Moses in a round portrait on strings
    const mosesPlate = `${sheet().p(c.cut(c.circ(0, 0, 86, 40), 0.6, 6), C.ochre).p(c.cut(c.circ(0, 0, 78, 40), 0.5, 6), mix(C.parchment, C.dune, 0.3)).out()}<g transform="translate(-8 72) scale(.62)">${person(c, { ...LOOK.moses, holdF: `<g transform="translate(20 -30) rotate(-20) scale(.9)">${lawTablets(c, { w: 40, h: 58 })}</g>` })}</g>`;
    const moses = hanging(hangL, `<g transform="translate(0 70) scale(.8)">${mosesPlate}</g>`, { x: 590, y: 110, len: 800 });
    const mosesP = S.puppet(moses.querySelector('.fig'));
    // the bill of divorce
    const sc = scrollParts(c, { w: 190, h: 150, title: tr('list rozwodowy', 'certificate'), lines: 5 });
    const scrollEl = hanging(hangL, `<g><g class="sheet">${sc.sheet.replace('font-size="30"', 'font-size="22"').replace('y="42"', 'y="36"')}</g><g>${sc.rod}</g></g>`, { x: 1060, y: 150, len: 800 });
    const scrollSheet = scrollEl.querySelector('.sheet');
    const heavy = hangL.add(`<g opacity="0"><g transform="scale(1.9)">${stoneHeart(c, 22)}</g></g>`);

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), x: 470 + i * 60, y: GY - 26 + (i % 2) * 10, p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const PHs = PH.map((ph, i) => ({ ...ph, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, { ...pharisee(c, i + 1), holdF: i === 0 ? '' : '' }))) }));
    const hearts = PHs.map(() => pL.add(`<g opacity="0">${stoneHeart(c, 12)}</g>`));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const trap = wordL.add(`<g opacity="0">${thought(c, `<g transform="scale(1.2)">${hook(c)}</g>`, { w: 70, h: 56 })}</g>`);
    const ask = wordL.add(`<g opacity="0">${say(c, [tr('Czy wolno', 'Is it lawful'), tr('oddalić żonę?', 'to divorce a wife?')], { size: 19, side: -1 })}</g>`);
    const jq = wordL.add(`<g opacity="0">${say(c, tr('Co nakazał Mojżesz?', 'What did Moses command?'), { size: 19, side: 1 })}</g>`);
    const q2 = wordL.add(`<g opacity="0"><g transform="scale(1.4)">${qmark(c)}</g></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 990, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 70, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 20 });

      /* beat 0: they come, meaning to trap him */
      const come = es(t, -0.2, 0.7);
      PHs.forEach((ph) => {
        const x = lerp(ph.x + 520, ph.x, come);
        const askArm = ph.i === 0 ? es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.1)) : 0;
        const answer = ph.i === 1 ? es(t, 3.02, 3.25) * (1 - es(t, 3.9, 4.1)) : 0;
        const stung = es(t, 4.2, 4.5);
        ph.p.set({ x, y: GY, s: ph.s, flip: true, walk: come > 0 && come < 1 ? x * 0.05 + ph.i : undefined, armF: askArm * 70 + answer * 80 + stung * 10, armB: askArm * 20 + answer * 40, head: -askArm * 5 + stung * 6, lean: stung * -2, blink: blinkAt(T, ph.seed) });
        pose(hearts[ph.i], { x: x - 6 * ph.s, y: GY - 112 * ph.s, s: ph.s * es(t, 4.1 + ph.i * 0.1, 4.35 + ph.i * 0.1, ease.back), o: t > 4.08 ? 1 : 0 });
      });
      pose(trap, { x: PH[0].x + 520 * (1 - come) - 10, y: GY - 200, s: 0.2 + 0.8 * es(t, 0.35, 0.6, ease.back), o: es(t, 0.3, 0.45) * (1 - es(t, 0.95, 1.05)) });

      /* Jesus faces them */
      const answerJ = es(t, 2.0, 2.25) * (1 - es(t, 2.85, 3.05));
      const point = es(t, 4.02, 4.3);
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 20 + answerJ * 55 + point * 70 + bump(t, 1.4, 2) * 10, armB: answerJ * 40 + point * 20, head: -answerJ * 4 + Math.sin(T * 0.6) * 1.2, blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.84, head: -3 + es(t, 1, 1.4) * -4, armF: 10 + (d.i === 0 ? bump(t, 3.1, 4) * 30 : 0), blink: blinkAt(T, d.seed) }));
      folk.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -es(t, 1, 1.5) * 4, blink: blinkAt(T, m.seed) }));

      /* beat 1: the question — the card of the two dolls, scissors hovering */
      const card = es(t, 1.0, 1.4, ease.back);
      const cy = 175 - (1 - card) * 1100;
      swing(cardEl, 830, cy, T, 0.8, 0.6);
      const part = es(t, 3.3, 3.8);
      pose(hisDoll, { x: 800 - part * 16, y: cy + 150, s: 1, r: part * -3 });
      pose(herDoll, { x: 860 + part * 60, y: cy + 150, s: 1, r: part * 6, o: 1 - part * 0.35 });
      pose(tie, { x: 830, y: cy + 104, o: part > 0.02 ? 0 : 1 });
      pose(tieCut, { x: 830 - part * 16, y: cy + 104 + part * 6, r: part * -20, o: part > 0.02 ? 1 : 0 });
      pose(tieCut2, { x: 830 + part * 60, y: cy + 104 + part * 10, r: part * 24, o: part > 0.02 ? 1 : 0 });
      const sIn = es(t, 1.2, 1.7);
      const cut = bump(t, 3.1, 3.45);
      pose(sciss, { x: lerp(1070, 930, sIn) - cut * 30, y: cy + 74 + cut * 8 + Math.sin(T * 1.3) * 3 * sIn, r: 166, s: 0.9, o: sIn * (1 - es(t, 4.4, 4.8)) });
      snip(sciss, 36 - cut * 34 + Math.sin(T * 2) * 3 * sIn * (1 - cut));
      pose(ask, { x: PH[0].x - 44, y: GY - 216, s: es(t, 1.05, 1.3, ease.back), o: t > 1.05 && t < 2 ? 1 - es(t, 1.85, 2) : 0 });

      /* beat 2: "What did Moses command you?" — Moses comes down on strings */
      pose(jq, { x: JX + 30, y: GY - 222, s: es(t, 2.02, 2.25, ease.back), o: t > 2.02 && t < 3 ? 1 - es(t, 2.85, 3) : 0 });
      const mo = es(t, 2.2, 2.7, ease.back);
      swing(moses, 590, 100 - (1 - mo) * 1100, T, 1, 0.7, 1);
      mosesP.set({ x: 0, y: 0, s: 1, armF: 70, armB: 20, head: -4, blink: blinkAt(T, 5) });
      pose(q2, { x: 680, y: 120 - (1 - mo) * 1100, o: bump(t, 2.3, 3.0), r: Math.sin(T) * 6 });

      /* beat 3: "Moses allowed a bill of divorce" — the scroll unrolls and the dolls are cut apart */
      const sc = es(t, 3.0, 3.4, ease.back);
      swing(scrollEl, 1085, 130 - (1 - sc) * 1100, T, 1, 0.6, 2);
      pose(scrollSheet, { sy: 0.05 + 0.95 * es(t, 3.2, 3.6) });

      /* beat 4: hardness of heart */
      pose(heavy, { x: 1085, y: 300 - (1 - es(t, 4.25, 4.6, ease.back)) * 60, o: es(t, 4.25, 4.4), r: Math.sin(T * 0.8) * 3 });

      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.05 + es(t, 3.9, 4.6) * 0.04;
      S.cam.y = -es(t, 0.6, 1.4) * 10;
      S.cam.x = es(t, -0.3, 0.6) * 20 + es(t, 2.2, 2.6) * -30 + es(t, 3, 3.4) * 50;
    };
  },
};
