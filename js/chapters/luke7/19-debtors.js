// Łk 7,41–42 — the parable flies in as a painted set: a moneylender's courtyard, his table with the scales and the
// stacks of silver. "A certain lender had two debtors": two men come in and bow. "One owed five hundred denarii, the
// other fifty": over each of them his debt comes down on a wax tablet — a great one for the first, a little one for the
// second — and the silver on the table grows to match. "When they could not pay, he forgave them both": they turn out
// their empty purses; the lender stands and tears both tablets in two, the halves flutter to the floor. "Which of
// them, then, will love him more?": a heart rises from each man — a great heart and a little one — and a question
// hangs between them.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, house, cypress } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { iou, iouHalf, heart, coinStack, question, purse, headAt, hand, kf, moving, tr, PI } from './lib.js';

const FL = 740;
const LX = 1030;                   // the lender
const D1 = 610, D2 = 760;          // the two debtors
const LENDER = { robe: C.plumRobe, mantle: C.sun, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.sun, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.sun };
const DEBT1 = { robe: mix(C.stone2, C.soil, 0.2), mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope };
const DEBT2 = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin2, belt: C.rope };

export default {
  id: 'lk7-debtors',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 41, text: '«Pewien wierzyciel miał dwóch dłużników.' },
    { v: 41, cont: true, text: 'Jeden winien mu był pięćset denarów, a drugi pięćdziesiąt.' },
    { v: 42, text: 'Gdy nie mieli z czego oddać, darował obydwom.' },
    { v: 42, cont: true, text: 'Który więc z nich będzie go bardziej miłował?»' },
  ],
  cam: { x: [-30, 40], y: [-40, 80], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, ['#e7cfa6', '#f3dcb2', '#f8e8c8']);
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [10, 4, 2], lens: [800, 300, 110], color: mix(C.hillFar, C.dune, 0.3) }).markup);
    /* the courtyard wall with arches and an awning */
    const wallL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plaster, C.peach, 0.3);
    const w = sheet();
    const arches = [380, 800, 1220].map((x) => [[x - 80, FL - 60], [x - 80, 420], ...c.arc(x, 420, 80, 70, PI, 2 * PI, 12), [x + 80, FL - 60]]);
    w.p(c.cut([[-900, 260], [2500, 260], [2500, FL - 50], [-900, FL - 50]], 0.8, 20) + arches.map((a) => c.hole(a, 0.5, 6)).join(''), wcol);
    w.p(arches.map((a) => c.ribbon(a.slice(1, -1), 10)).join(''), shade(wcol, -0.12));
    w.p(c.cut(c.rect(-900, 240, 3400, 26), 0.4, 20), C.terracotta);
    let st = '';
    for (let x = -880; x < 2500; x += 60) st += c.cut([[x, 266], [x + 30, 266], [x + 26, 300], [x + 4, 300]], 0.3, 5);
    w.p(st, C.cream);
    wallL.add(sheet().p(c.cut([[-900, 380], [2500, 380], [2500, FL], [-900, FL]], 0.5, 20), mix(C.skyBlue, C.cream, 0.4)).out() + [300, 380, 460, 720, 790, 880, 1140, 1210, 1300].map((x, i) => house(c, x - 40, 600 - (i % 3) * 16, 60 + (i % 2) * 20, 50 + (i % 3) * 14, { stairs: false, wall: mix(C.plaster, C.dusk, 0.2), shadow: mix(C.plaster2, C.dusk, 0.3) })).join('') + cypress(c, 820, FL - 60, 150, mix(C.moss2, C.dusk, 0.2)) + cypress(c, 1250, FL - 60, 120, mix(C.moss2, C.dusk, 0.2)));
    wallL.add(w.out());
    const G = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet().p(c.cut([[-900, FL - 56], [2500, FL - 56], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.stone, C.sand2, 0.4));
    let tl = '';
    for (let y = FL - 30; y < 1100; y += 36) tl += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.2);
    gs.x(tl, shade(C.stone2, -0.1), 'opacity=".5"');
    G.add(gs.out());

    /* the lender at his table */
    const P = S.layer({ par: 0.4, sh: 5 });
    const lender = S.puppet(P.add(person(c, { ...LENDER, pose: 'sit' })));
    const lenderUp = S.puppet(P.add(person(c, LENDER)));
    const T = sheet();
    T.p(c.cut([[LX - 150, FL - 70], [LX - 20, FL - 70], [LX - 24, FL - 58], [LX - 146, FL - 58]], 0.4, 6), C.wood);
    T.p(c.cut(c.rect(LX - 140, FL - 58, 10, 58), 0.3, 4) + c.cut(c.rect(LX - 42, FL - 58, 10, 58), 0.3, 4), C.wood2);
    // the scales
    T.p(c.ribbon([[LX - 70, FL - 70], [LX - 70, FL - 150]], 3) + c.ribbon([[LX - 100, FL - 146], [LX - 40, FL - 146]], 3), C.sun);
    T.p(c.cut(c.arc(LX - 100, FL - 118, 14, 7, 0, PI, 8), 0.2, 3) + c.cut(c.arc(LX - 40, FL - 118, 14, 7, 0, PI, 8), 0.2, 3), C.sun);
    T.x(c.ribbon([[LX - 100, FL - 146], [LX - 110, FL - 118]], 1) + c.ribbon([[LX - 100, FL - 146], [LX - 90, FL - 118]], 1) + c.ribbon([[LX - 40, FL - 146], [LX - 50, FL - 118]], 1) + c.ribbon([[LX - 40, FL - 146], [LX - 30, FL - 118]], 1), C.ochre);
    P.add(T.out());
    const bigStack = P.add(`<g opacity="0">${coinStack(c, 10, 13)}<g transform="translate(28 0)">${coinStack(c, 8, 13)}</g></g>`);
    const smallStack = P.add(`<g opacity="0">${coinStack(c, 2, 11)}</g>`);
    /* the two debtors */
    const d1 = S.puppet(P.add(person(c, { ...DEBT1, holdF: `<g data-k="p1" transform="translate(0 2)">${purse(c, 0.2)}</g>` })));
    const d2 = S.puppet(P.add(person(c, { ...DEBT2, holdF: `<g data-k="p2" transform="translate(0 2)">${purse(c, 0.2)}</g>` })));
    /* the debts, the tearing, the hearts */
    const FX = S.layer({ par: 0.42, sh: 4 });
    const t1 = FX.add(`<g opacity="0">${iou(c, '500', { w: 150, h: 96, size: 44 })}</g>`);
    const t2 = FX.add(`<g opacity="0">${iou(c, '50', { w: 80, h: 56, size: 28 })}</g>`);
    const t1a = FX.add(`<g opacity="0">${iouHalf(c, '500', -1, { w: 150, h: 96, size: 44 })}</g>`), t1b = FX.add(`<g opacity="0">${iouHalf(c, '500', 1, { w: 150, h: 96, size: 44 })}</g>`);
    const t2a = FX.add(`<g opacity="0">${iouHalf(c, '50', -1, { w: 80, h: 56, size: 28 })}</g>`), t2b = FX.add(`<g opacity="0">${iouHalf(c, '50', 1, { w: 80, h: 56, size: 28 })}</g>`);
    const lbl = FX.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.ink}">${tr('denarów', 'denarii')}</text></g>`);
    const h1 = FX.add(`<g opacity="0">${heart(c, 30)}</g>`);
    const h2 = FX.add(`<g opacity="0">${heart(c, 12)}</g>`);
    const q = FX.add(`<g opacity="0">${question(c)}</g>`);

    return (t, time) => {
      const Tm = time;
      /* v41a — two debtors come in and bow */
      const K1 = [[0.05, 150], [0.5, D1]], K2 = [[0.1, 60], [0.55, D2]];
      const x1 = kf(t, K1), x2 = kf(t, K2);
      const bow = bump(t, 0.55, 0.8);
      const empty = es(t, 2.05, 2.18) * (1 - es(t, 2.52, 2.6));
      const joy = es(t, 2.56, 2.72);
      const shake = empty ? Math.sin(t * 60) * 6 * empty : 0;
      d1.set({ x: x1, y: FL, s: 1.02, walk: moving(t, K1) ? x1 * 0.05 : undefined, armF: 20 + bump(t, 1.1, 1.9) * 10 + empty * 70 + shake + joy * 70, armB: 10 + joy * 150, lean: bow * 10 + bump(t, 1.2, 1.9) * 6, head: bow * 16 + bump(t, 1.2, 1.9) * 14 - joy * 16, blink: blinkAt(Tm, 1) });
      d2.set({ x: x2, y: FL + 6, s: 0.96, walk: moving(t, K2) ? x2 * 0.05 : undefined, armF: 20 + empty * 70 - shake + joy * 40, armB: 10 + joy * 110, lean: bow * 10, head: bow * 16 - joy * 12, blink: blinkAt(Tm, 2) });
      /* the lender: sits, then stands to tear the tablets */
      const up = es(t, 2.2, 2.26);
      const tear = es(t, 2.26, 2.42);
      lender.set({ x: LX, y: FL, s: 1.0, flip: true, o: 1 - up, armF: 40 + bump(t, 1.1, 1.9) * 50, armB: 20, head: 4, blink: blinkAt(Tm, 3) });
      lenderUp.set({ x: LX - 20, y: FL, s: 1.02, flip: true, o: up, armF: 90 + tear * 40, armB: 90 + tear * 50, head: -tear * 4 + es(t, 3.1, 3.3) * 8, blink: blinkAt(Tm, 3) });
      /* v41b — the debts: 500 and 50 */
      const [h1x, h1y] = headAt(D1, FL, 1.02), [h2x, h2y] = headAt(D2, FL + 6, 0.96);
      const k1 = es(t, 1.08, 1.22, ease.back), k2 = es(t, 1.26, 1.4, ease.back);
      const torn = t > 2.42;
      const Y1 = h1y - 110, Y2 = h2y - 80;
      pose(t1, { x: h1x, y: Y1 + (Tm ? Math.sin(Tm * 1.2) * 3 : 0), s: k1, o: k1 > 0.02 && !torn ? 1 : 0 });
      pose(t2, { x: h2x + 20, y: Y2 + (Tm ? Math.sin(Tm * 1.2 + 1) * 3 : 0), s: k2, o: k2 > 0.02 && !torn ? 1 : 0 });
      pose(lbl, { x: (h1x + h2x) / 2 + 10, y: Y1 + 70, o: k1 > 0.5 && !torn ? es(t, 1.3, 1.45) * (1 - seg(t, 2.3, 2.42)) : 0 });
      pose(bigStack, { x: LX - 128, y: FL - 70, s: 1, o: es(t, 1.1, 1.25) * (1 - es(t, 2.5, 2.7)) });
      pose(smallStack, { x: LX - 150 + 130, y: FL - 70, o: es(t, 1.28, 1.4) * (1 - es(t, 2.5, 2.7)) });
      /* v42a — they cannot pay; he forgives both: the tablets torn in two */
      const fall = seg(t, 2.42, 2.7);
      const halves = [[t1a, h1x, Y1, -1, 1], [t1b, h1x, Y1, 1, 1], [t2a, h2x + 20, Y2, -1, 0.7], [t2b, h2x + 20, Y2, 1, 0.7]];
      halves.forEach(([el, x, y, d, k]) => pose(el, { x: x + d * (10 + fall * (S.portrait ? 30 : 110) * k),   // phone: the halves fall closer, inside the screen
 y: y + fall * fall * (FL - y - 40), r: d * fall * 80, s: 1 - fall * 0.3, o: torn ? 1 - seg(t, 2.92, 3.0) : 0 }));
      /* v42b — which will love him more? */
      const hk1 = es(t, 3.08, 3.3, ease.back), hk2 = es(t, 3.18, 3.36, ease.back);
      pose(h1, { x: h1x + 10, y: h1y - 80 - hk1 * 20 + (Tm ? Math.sin(Tm * 2) * 3 : 0), s: hk1 * (1 + (Tm ? Math.sin(Tm * 3) * 0.05 : 0)), o: hk1 > 0.02 ? 1 : 0 });
      pose(h2, { x: h2x + 10, y: h2y - 60 - hk2 * 10, s: hk2, o: hk2 > 0.02 ? 1 : 0 });
      const qk = es(t, 3.3, 3.45, ease.back);
      pose(q, { x: (h1x + h2x) / 2 + 12, y: h1y - 170 + (Tm ? Math.sin(Tm * 2) * 4 : 0), s: qk * 1.3, r: Tm ? Math.sin(Tm * 1.5) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.0, 20]]);
      S.cam.y = kf(t, [[0, 60], [1.0, 20], [2.4, 40], [3.0, 10]]);
      S.cam.z = kf(t, [[0, 1.2], [1.0, 1.14], [2.4, 1.18], [3.0, 1.12]]);
      void hand; void house;
    };
  },
};
