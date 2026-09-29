// Łk 16,5–7 — the same court. The manager has set up a desk in the middle of it and sits behind it with the bills.
// "Calling each one of his master's debtors to him, he asked the first: How much do you owe my master?": the debtors
// come in through the gateway one after another and queue at the desk — the olive grower first; the manager holds up
// his bill. "He said: A hundred measures of oil": a tally card comes down over them — a hundred measures, ten great
// jars stacked four, three, two, one. "He said to him: Take your bill, sit down quickly and write fifty": the olive
// grower sits on the stool, takes the reed pen and writes — the hundred on the bill becomes fifty, and five jars
// vanish off the card. "Then he asked another: And how much do you owe?": the first goes off with his bill in his
// hand, the farmer steps up, and the card of jars goes up. "He said: A hundred measures of wheat": a card of ten
// sacks comes down. "He said to him: Take your bill and write eighty": the farmer writes — eighty — and two sacks go.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { estateSet, ES, say, bill, desk, stool, pen, oilJar, wheatSack, tallyCard, tallySpot, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, STEWARD, DEBTOR_OIL, DEBTOR_WHEAT, DEBTORS, FONT } from './lib.js';

const GY = ES.GY;
const DX = 820;                  // the desk
const MX = 912;                  // the manager on his stool, behind the desk's right end
const WX = 728;                  // the debtor who writes, on the stool at the left end
const QX = [700, 628, 560, 494]; // the queue
const CX = 770, CY = 290;        // the tally card

export default {
  id: 'lk16-debtors',
  parable: true,
  beats: [
    { v: 5 },
    { v: 6, text: 'Ten odpowiedział: "Sto beczek oliwy".' },
    { v: 6, cont: true, text: 'On mu rzekł: "Weź swoje zobowiązanie, siadaj prędko i napisz: pięćdziesiąt".' },
    { v: 7, text: 'Następnie pytał drugiego: "A ty ile jesteś winien?"' },
    { v: 7, cont: true, text: 'Ten odrzekł: "Sto korcy pszenicy".' },
    { v: 7, cont: true, text: 'Mówi mu: "Weź swoje zobowiązanie i napisz: osiemdziesiąt".' },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    /* the stools, the queue, the two who write, the manager */
    E.act.add(`<g transform="translate(${WX - 8} ${GY})">${stool(c)}</g><g transform="translate(${MX + 6} ${GY})">${stool(c)}</g>`);
    const q3 = S.puppet(E.act.add(person(c, DEBTORS[1])));
    const q2 = S.puppet(E.act.add(person(c, DEBTORS[0])));
    const wheat = S.puppet(E.act.add(person(c, DEBTOR_WHEAT)));
    const wheatSit = S.puppet(E.act.add(person(c, { ...DEBTOR_WHEAT, pose: 'sit', holdF: `<g transform="rotate(-150)">${pen(c)}</g>` })));
    const oil = S.puppet(E.act.add(person(c, DEBTOR_OIL)));
    const oilSit = S.puppet(E.act.add(person(c, { ...DEBTOR_OIL, pose: 'sit', holdF: `<g transform="rotate(-150)">${pen(c)}</g>` })));
    const stew = S.puppet(E.act.add(person(c, { ...STEWARD, pose: 'sit' })));
    E.front.add(`<g transform="translate(${DX} ${GY})">${desk(c)}</g>`);
    /* the bills */
    const B = {
      o100: E.front.add(`<g opacity="0">${bill(c, '100')}</g>`),
      o50: E.front.add(`<g opacity="0">${bill(c, '50')}</g>`),
      w100: E.front.add(`<g opacity="0">${bill(c, '100')}</g>`),
      w80: E.front.add(`<g opacity="0">${bill(c, '80')}</g>`),
    };
    /* the tally cards: ten jars of oil, ten sacks of wheat */
    const card = (items, lab) => {
      const el = E.fly.add(`<g opacity="0">${tallyCard(c, 200, 190)}</g>`);
      const its = Array.from({ length: 10 }, (_, i) => ({ i, el: E.fly.add(`<g opacity="0">${items(i)}</g>`) }));
      const labs = lab.map((txt) => E.fly.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="600" fill="${C.ink}">${txt}</text></g>`));
      return { el, its, labs };
    };
    const oilCard = card(() => oilJar(c, 28), ['100', '50']);
    const wheatCard = card(() => wheatSack(c, 26, 24), ['100', '80']);
    /* the words */
    const W = E.W;
    const ask1 = W.add(`<g opacity="0">${say(c, [tr('Ile jesteś winien', 'How much do you owe'), tr('mojemu panu?', 'to my lord?')], { size: 18, side: -1 })}</g>`);
    const ans1 = W.add(`<g opacity="0">${say(c, tr('Sto beczek oliwy.', 'A hundred batos of oil.'), { size: 18, side: 1 })}</g>`);
    const wr1 = W.add(`<g opacity="0">${say(c, [tr('Weź swoje zobowiązanie,', 'Take your bill,'), tr('siadaj prędko i napisz: 50!', 'sit down quickly, write fifty!')], { size: 17, side: -1 })}</g>`);
    const ask2 = W.add(`<g opacity="0">${say(c, tr('A ty ile jesteś winien?', 'How much do you owe?'), { size: 18, side: -1 })}</g>`);
    const ans2 = W.add(`<g opacity="0">${say(c, tr('Sto korcy pszenicy.', 'A hundred cors of wheat.'), { size: 18, side: 1 })}</g>`);
    const wr2 = W.add(`<g opacity="0">${say(c, [tr('Weź swoje zobowiązanie', 'Take your bill'), tr('i napisz: 80!', 'and write eighty!')], { size: 17, side: -1 })}</g>`);

    const pop = (el, k, x, y) => pose(el, { x, y, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });

    return (t, time) => {
      const T = time;
      E.update(T);
      /* the queue comes in (v5) and moves up (v7a) */
      const OK = [[-0.4, 470], [0.35, QX[0]], [2.2, QX[0]], [2.25, WX]];
      const WK = [[-0.4, 400], [0.4, QX[1]], [3.25, QX[1]], [3.55, QX[0]], [5.2, QX[0]], [5.25, WX]];
      const K2 = [[-0.4, 330], [0.45, QX[2]], [3.3, QX[2]], [3.6, QX[1]]];
      const K3 = [[-0.4, 270], [0.5, QX[3]], [3.35, QX[3]], [3.65, QX[2]]];
      const oSit = seg(t, 2.22, 2.26) * (1 - seg(t, 3.04, 3.08));
      const oGo = [[3.06, WX], [3.2, WX - 30], [3.9, 380]];
      const ox = t < 3.06 ? kf(t, OK) : kf(t, oGo);
      const oOut = 1 - es(t, 3.7, 3.9);
      oil.set({ x: ox, y: GY, s: 0.98, flip: t > 3.1, o: (1 - oSit) * oOut, walk: moving(t, OK) || (t > 3.06 && t < 3.9) ? ox * 0.06 : undefined, armF: 20 + bump(t, 1.1, 1.9) * 40 + (t > 3.06 ? 50 : 0), armB: 10 + bump(t, 1.1, 1.9) * 20, head: -2 + (t > 3.06 ? -6 : 0), blink: blinkAt(T, 2) });
      const writing1 = t > 2.3 && t < 2.62 ? Math.sin((t - 2.3) * 60) : 0;
      oilSit.set({ x: WX, y: GY - 28, s: 0.94, o: oSit, armF: 60 + writing1 * 6, armB: 20, head: 14, lean: 6, blink: 0.4 });
      const wSit = seg(t, 5.22, 5.26);
      const wx = kf(t, WK);
      wheat.set({ x: wx, y: GY, s: 0.98, o: 1 - wSit, walk: moving(t, WK) ? wx * 0.06 : undefined, armF: 20 + bump(t, 4.1, 4.9) * 40, armB: 10 + bump(t, 4.1, 4.9) * 20, head: -2, blink: blinkAt(T, 4) });
      const writing2 = t > 5.3 && t < 5.62 ? Math.sin((t - 5.3) * 60) : 0;
      wheatSit.set({ x: WX, y: GY - 28, s: 0.94, o: wSit, armF: 60 + writing2 * 6, armB: 20, head: 14, lean: 6, blink: 0.4 });
      const k2 = kf(t, K2), k3 = kf(t, K3);
      q2.set({ x: k2, y: GY + 4, s: 0.96, walk: moving(t, K2) ? k2 * 0.06 : undefined, armF: 12, armB: 6, head: 2, blink: blinkAt(T, 6) });
      q3.set({ x: k3, y: GY + 6, s: 0.96, walk: moving(t, K3) ? k3 * 0.06 : undefined, armF: 8, armB: 4, head: -2, blink: blinkAt(T, 7) });

      /* the manager behind the desk: holds up the bill, hands it over */
      const hold1 = es(t, 0.3, 0.45) * (1 - es(t, 2.1, 2.25));
      const hold2 = es(t, 3.3, 3.45) * (1 - es(t, 5.1, 5.25));
      const urge = bump(t, 2.05, 2.5) + bump(t, 5.05, 5.5);
      stew.set({ x: MX, y: GY - 30, s: 1.0, flip: true, armF: 30 + Math.max(hold1, hold2) * 60 + urge * 30, armB: 10 + urge * 60, head: -4 + urge * 6, blink: blinkAt(T, 3) });
      const [shx, shy] = handAt(MX, GY - 30, 1.0, true, 90, 'sit');
      const deskSpot = [WX + 36, GY - 84];
      // oil bill: held up (v5–v6a), put before him (v6b), 100 → 50, carried off (v7a)
      const put1 = es(t, 2.1, 2.24);
      const fix1 = es(t, 2.5, 2.62);
      const [ohx, ohy] = handAt(ox, GY, 0.98, true, 70);
      const carry1 = seg(t, 3.06, 3.1);
      const b1x = carry1 ? ohx : lerp(shx - 20, deskSpot[0], put1), b1y = carry1 ? ohy - 20 : lerp(shy - 30, deskSpot[1], put1);
      const on1 = es(t, 0.3, 0.4) * oOut;
      pose(B.o100, { x: b1x, y: b1y, s: carry1 ? 0.5 : 0.8, r: carry1 ? 10 : 0, o: on1 * (1 - fix1) });
      pose(B.o50, { x: b1x, y: b1y, s: carry1 ? 0.5 : 0.8, r: carry1 ? 10 : 0, o: fix1 * oOut });
      const put2 = es(t, 5.1, 5.24);
      const fix2 = es(t, 5.5, 5.62);
      const on2 = es(t, 3.3, 3.4);
      const b2x = lerp(shx - 20, deskSpot[0], put2), b2y = lerp(shy - 30, deskSpot[1], put2);
      pose(B.w100, { x: b2x, y: b2y, s: 0.8, o: on2 * (1 - fix2) });
      pose(B.w80, { x: b2x, y: b2y, s: 0.8, o: fix2 });

      /* the words */
      const [mhx, mhy] = headAt(MX, GY - 30, 1.0, true, 'sit');
      pop(ask1, es(t, 0.4, 0.52, ease.back) * (1 - es(t, 0.95, 1.05)), mhx - 10, mhy - 20);
      pop(wr1, es(t, 2.05, 2.18, ease.back) * (1 - es(t, 2.92, 3.0)), mhx - 10, mhy - 20);
      pop(ask2, es(t, 3.35, 3.48, ease.back) * (1 - es(t, 3.95, 4.05)), mhx - 10, mhy - 20);
      pop(wr2, es(t, 5.05, 5.18, ease.back) * (1 - es(t, 5.95, 6.0)), mhx - 10, mhy - 20);
      const [dhx, dhy] = headAt(QX[0], GY, 0.98);
      pop(ans1, es(t, 1.08, 1.2, ease.back) * (1 - es(t, 1.92, 2.02)), dhx + 10, dhy - 20);
      pop(ans2, es(t, 4.08, 4.2, ease.back) * (1 - es(t, 4.92, 5.02)), dhx + 10, dhy - 20);

      /* the tally cards */
      const cardAt = (cd, k, cut, cutAt, n0) => {
        const y = lerp(-500, CY, k);
        const on = k > 0.004 ? 1 : 0;
        const sw = T ? Math.sin(T * 0.8) * 0.8 * k : 0;
        pose(cd.el, { x: CX, y, r: sw, o: on });
        cd.its.forEach((it) => {
          const [ix, iy] = tallySpot(it.i, 40, 32, 40);
          const gone = it.i >= n0 ? es(t, cutAt + (it.i - n0) * 0.04, cutAt + 0.12 + (it.i - n0) * 0.04) : 0;
          pose(it.el, { x: CX + ix + gone * 60, y: y + iy - gone * 90, s: 1 - gone, r: gone * 60, o: on * (gone < 0.98 ? 1 : 0) });
        });
        pose(cd.labs[0], { x: CX, y: y + 70, o: on * (1 - cut) });
        pose(cd.labs[1], { x: CX, y: y + 70, o: on * cut });
      };
      cardAt(oilCard, es(t, 1.15, 1.45, ease.out) * (1 - es(t, 3.05, 3.3, ease.in)), es(t, 2.55, 2.62), 2.58, 5);
      cardAt(wheatCard, es(t, 4.15, 4.45, ease.out) * (1 - es(t, 5.97, 6.0)), es(t, 5.55, 5.62), 5.58, 8);

      S.cam.x = kf(t, [[-0.5, -20], [0.5, -10], [3.0, -10], [3.4, -20]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.6, 20], [1.2, -10], [6, -10]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.6, 1.08], [1.2, 1.04]]);
    };
  },
};
