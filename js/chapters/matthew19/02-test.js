// Mt 19,3 — Pharisees come to test Him (a fish-hook in their thought). "Is it lawful to put away one's wife for any
// reason?" A card of two paper dolls hand in hand drops from the flies, a pair of scissors hovering at the ribbon
// that ties them — and round it, on strings, the "any reasons": a burnt loaf, a cracked jug, a spilled cup.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix, hanging, swing } from '../kit.js';
import { olive, house, bush, rock } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, pharisee, TWELVE, doll, scissors, snip, thought, say, throng, plate, burntLoaf, crackedJug, spilledCup, tr } from './lib.js';

const GY = 668;
const JX = 760;
const PH = [{ x: 960, s: 0.98 }, { x: 1050, s: 0.94 }, { x: 1140, s: 0.9 }];

/** a fish-hook: the trap in a testing question */
function hook(c) {
  return sheet().p(c.ribbon([[0, -18], [0, 6], ...c.arc(-7, 6, 7, 8, 0, Math.PI, 8).slice(1), [-14, 0]], 3), C.rock3).p(c.cut([[-16, -2], [-12, -8], [-11, 2]], 0.2, 2), C.rock3).x(c.ribbon([[0, -18], [2, -30]], 1), C.ink).out();
}

export default {
  id: 'mt19-test',
  beats: [
    { v: 3, text: 'Wtedy przystąpili do Niego faryzeusze, chcąc Go wystawić na próbę, i zadali Mu pytanie:' },
    { v: 3, cont: true, text: '«Czy wolno oddalić swoją żonę z jakiegokolwiek powodu?»' },
  ],
  cam: { x: [-30, 40], y: [-20, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.08, jerX: 1180, roadX: 820, trees: 18, clouds: [[430, 140, 180], [1080, 120, 130]] });
    const vil = S.layer({ par: 0.28, sh: 3 });
    vil.add(house(c, 250, 590, 90, 64) + house(c, 350, 596, 70, 50) + house(c, 180, 600, 60, 44) + olive(c, 470, 600, 0.9) + olive(c, 1330, 600, 0.8) + bush(c, 1250, 604, 60, C.sage, C.moss));

    const back = S.layer({ par: 0.4, sh: 3 });
    back.sprite(throng(c, 7, { s: 0.5, spread: 34, rows: 1, face: 1, arms: [0, 20] }), 420, 612);
    back.sprite(throng(c, 6, { s: 0.5, spread: 34, rows: 1, face: -1, arms: [0, 20] }), 1250, 614);

    /* hanging: the card with the two dolls, the scissors, the three "any reasons" */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const cardW = 230, cardH = 170;
    const card = sheet().p(c.cut(c.rect(-cardW / 2, 0, cardW, cardH), 0.6, 8), C.cream).p(c.cut(c.rect(-cardW / 2 + 8, 8, cardW - 16, cardH - 16), 0.4, 8), mix(C.parchment, C.blushVeil, 0.25)).out();
    const cardEl = hanging(hangL, `<g>${card}</g>`, { x: 820, y: 150, len: 800 });
    const dollL = S.layer({ par: 0.3, sh: 3 });
    const hisDoll = dollL.add(`<g>${doll(c, C.dustyBlue)}</g>`);
    const herDoll = dollL.add(`<g>${doll(c, C.roseRobe, { woman: true, skin: C.skin })}</g>`);
    const tie = dollL.add(`<path d="${c.ribbon(c.qbez([-26, 0], [0, 8], [26, 0], 8), 5)}" fill="${C.sun}"/>`);
    const sciss = dollL.add(`<g>${scissors(c, 90)}</g>`);
    const REASONS = [
      { m: burntLoaf(c), x: 575, y: 190 },
      { m: crackedJug(c), x: 1075, y: 150 },
      { m: spilledCup(c), x: 1185, y: 260 },
    ].map((r, i) => ({ ...r, i, el: hanging(hangL, `<g>${plate(c, r.m, { r: 42 })}</g>`, { x: r.x, y: r.y, len: 800 }) }));

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), x: 470 + i * 62, y: GY - 26 + (i % 2) * 10, p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const PHs = PH.map((ph, i) => ({ ...ph, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, pharisee(c, i + 1)))) }));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const trap = wordL.add(`<g opacity="0">${thought(c, `<g transform="scale(1.2)">${hook(c)}</g>`, { w: 70, h: 56 })}</g>`);
    const ask = wordL.add(`<g opacity="0">${say(c, tr(['Czy wolno oddalić żonę', 'z jakiegokolwiek powodu?'], ['Is it lawful to divorce', 'a wife for any reason?']), { size: 19, side: -1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 990, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 70, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 2) * 12 });

      /* beat 0: they come, meaning to trap Him */
      const come = es(t, -0.25, 0.65);
      const askArm = es(t, 0.8, 1.05);
      PHs.forEach((ph) => {
        const x = lerp(ph.x + 520, ph.x, come);
        const arm = ph.i === 0 ? askArm : ph.i === 2 ? es(t, 1.3, 1.5) * 0.6 : 0;
        ph.p.set({ x, y: GY, s: ph.s, flip: true, walk: come > 0 && come < 1 ? x * 0.05 + ph.i : undefined, armF: arm * 72, armB: arm * 24, head: -arm * 4, blink: blinkAt(T, ph.seed) });
      });
      pose(trap, { x: PH[1].x + 520 * (1 - come) - 10, y: GY - 205, s: 0.2 + 0.8 * es(t, 0.3, 0.55, ease.back), o: es(t, 0.28, 0.4) * (1 - es(t, 0.95, 1.05)) });

      const look = es(t, 1.05, 1.3);
      jesus.set({ x: JX, y: GY, s: 1.02, flip: false, armF: 18 + bump(t, 0.5, 1.0) * 14, head: -look * 4 + Math.sin(T * 0.6) * 1.2, blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.84, head: -3 - look * 5, armF: 10 + (d.i === 1 ? bump(t, 1.2, 1.9) * 26 : 0), blink: blinkAt(T, d.seed) }));

      /* beat 1: the question — the card of the two dolls, scissors at the ribbon, and "any reasons" round it */
      const cd = es(t, 1.0, 1.35, ease.back);
      const cy = 160 - (1 - cd) * 1100;
      swing(cardEl, 820, cy, T, 0.8, 0.6);
      const tremble = es(t, 1.45, 1.7);
      pose(hisDoll, { x: 790, y: cy + 150, s: 1 });
      pose(herDoll, { x: 850 + tremble * 6, y: cy + 150, s: 1, r: tremble * (4 + Math.sin(T * 7) * 1.2) });
      pose(tie, { x: 820, y: cy + 104 });
      const sIn = es(t, 1.2, 1.6);
      pose(sciss, { x: lerp(1080, 905, sIn), y: cy + 74 + Math.sin(T * 1.3) * 3 * sIn, r: 166, s: 0.9, o: sIn });
      snip(sciss, 34 + Math.sin(T * 2.2) * 6 * sIn);
      REASONS.forEach((r) => {
        const k = es(t, 1.3 + r.i * 0.1, 1.6 + r.i * 0.1, ease.back);
        swing(r.el, r.x, r.y - (1 - k) * 1100, T, 2, 0.8, r.i + 2);
      });
      pose(ask, { x: PH[0].x - 40, y: GY - 214, s: es(t, 1.03, 1.28, ease.back), o: t > 1.03 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.6, 1.3) * 0.05;
      S.cam.y = -es(t, 0.6, 1.3) * 14;
      S.cam.x = es(t, -0.3, 0.6) * 24;
    };
  },
};
