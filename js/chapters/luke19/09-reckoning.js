// Łk 19,15b–19 — the hall of the new king: warm light through tall arched windows, a violet hanging and the carved
// throne on its dais; he sits there crowned. His steward calls in the servants who were given the money, and they
// come in along the carpet. The first kneels before the table and pours out his purse: his one mina, and ten more,
// ring down into a heap — "your mina has made ten minas." "Well done, good servant! You were faithful in a very little
// thing: have authority over ten cities" — ten little walled towns come down on their strings in an arc over his
// head. The second pours out his: five more — "and you, be over five cities" — and five towns come down over him.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { hallSet, storyFrame, KH, NOBLE, SERV, GUARD, crown, addToHead, mina, cityToken, lowTable, say, label, sparkle, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix } from './lib.js';
import { moneyBagHeld } from '../matthew22/lib.js';

const FL = KH.FL, KX = KH.THX, KY = FL - KH.DAIS * 2 - 58;
const TX = 596, TOP = FL - 44;
const PX = 740;                               // where a servant stands to give account
const TOWNS10 = Array.from({ length: 10 }, (_, i) => [560 + i * 58, 250 + Math.abs(i - 4.5) * 14]);
const TOWNS5 = Array.from({ length: 5 }, (_, i) => [640 + i * 64, 262 + Math.abs(i - 2) * 16]);

export default {
  id: 'lk19-reckoning',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 15, cont: true, text: 'kazał przywołać do siebie te sługi, którym dał pieniądze, aby się dowiedzieć, co każdy zyskał.' },
    { v: 16 },
    { v: 17 },
    { v: 18 },
    { v: 19 },
  ],
  cam: { x: [-280, 120], y: [-60, 60], z: [1, 1.26] },
  build(S) {
    const H = hallSet(S);
    const c = S.c;
    const A = H.act;
    const king = S.puppet(A.add(addToHead(person(c, { ...NOBLE, pose: 'sit' }), crown(c))));
    const steward = S.puppet(A.add(person(c, GUARD)));
    A.add(`<g transform="translate(${TX} ${FL + 4})">${lowTable(c, 130, 40)}</g>`);
    const pile1 = Array.from({ length: 11 }, () => A.add(`<g>${mina(c, 10)}</g>`));
    const pile2 = Array.from({ length: 6 }, () => A.add(`<g>${mina(c, 10)}</g>`));
    const s1 = S.puppet(A.add(person(c, { ...SERV[0], holdF: moneyBagHeld(c) })));
    const s1k = S.puppet(A.add(person(c, { ...SERV[0], pose: 'kneel' })));
    const s2 = S.puppet(A.add(person(c, { ...SERV[1], holdF: moneyBagHeld(c) })));
    const s2k = S.puppet(A.add(person(c, { ...SERV[1], pose: 'kneel' })));
    const s3 = S.puppet(A.add(person(c, SERV[2])));
    const hangL = S.layer({ par: 0.3, sh: 4 });
    const t10 = TOWNS10.map(() => hangL.add(`<g>${cityToken(c, { r: 24 })}</g>`));
    const t5 = TOWNS5.map(() => hangL.add(`<g>${cityToken(c, { r: 24, col: mix(C.cream, C.halo, 0.4) })}</g>`));
    const fx = H.fx;
    const callB = fx.add(`<g>${say(c, tr('Przywołajcie sługi!', 'Call the servants!'), { size: 19, side: 1 })}</g>`);
    const said1 = fx.add(`<g>${say(c, tr(['Panie, twoja mina', 'przysporzyła dziesięć min.'], ['Lord, your mina has', 'made ten more minas.']), { size: 18, side: 1 })}</g>`);
    const well = fx.add(`<g>${say(c, tr(['Dobrze, sługo dobry!', 'Władaj dziesięciu miastami!'], ['Well done, good servant!', 'Rule over ten cities!']), { size: 18, side: 1 })}</g>`);
    const said2 = fx.add(`<g>${say(c, tr(['Panie, twoja mina', 'przyniosła pięć min.'], ['Lord, your mina', 'has made five minas.']), { size: 18, side: 1 })}</g>`);
    const five = fx.add(`<g>${say(c, tr(['I ty miej władzę', 'nad pięciu miastami!'], ['And you, be over', 'five cities!']), { size: 18, side: 1 })}</g>`);
    const tag10 = fx.add(`<g>${label(c, '1 + 10', { size: 20, fill: C.halo })}</g>`);
    const tag5 = fx.add(`<g>${label(c, '1 + 5', { size: 20, fill: C.halo })}</g>`);
    const shine = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    storyFrame(S);

    const pop = (el, t, a, b, x, y, s = 1) => { const k = es(t, a, a + 0.14, ease.back) * (b === undefined ? 1 : 1 - es(t, b - 0.1, b)); pose(el, { x, y, s: k * s, o: k > 0.02 ? 1 : 0 }); };
    const pileSpot = (n, i, x0) => { const row = i < 4 ? 0 : i < 7 ? 1 : i < 9 ? 2 : 3; const k = [0, 4, 7, 9][row], per = [4, 3, 2, 2][row]; return [x0 + (i - k - (per - 1) / 2) * 19, TOP - 10 - row * 14]; };

    return (t, time) => {
      const T = time;
      /* v15b — he has the servants called in */
      const sp = es(t, 0.1, 0.3) * (1 - es(t, 0.9, 1.0));
      king.set({ x: KX + 4, y: KY, s: 1.02, flip: false, armF: 30 + sp * 60 + es(t, 2.05, 2.2) * (1 - es(t, 2.9, 3.0)) * 60 + es(t, 4.05, 4.2) * 60, armB: 20 + sp * 40, head: 4, blink: blinkAt(T) });
      const st = es(t, 0.9, 1.1);
      steward.set({ x: lerp(820, 1000, st), y: lerp(FL + 10, FL - 16, st), s: 0.94 - st * 0.08, flip: st > 0.5, walk: st > 0 && st < 1 ? st * 30 : undefined, armF: 20 + sp * 40, armB: 10 + sp * 140, head: -sp * 6, blink: blinkAt(T, 3) });
      pop(callB, t, 0.15, 0.95, 830, FL - 200);
      /* the three come in along the carpet */
      const inK = (i) => es(t, 0.35 + i * 0.1, 0.9 + i * 0.1);
      /* v16 — the first: ten minas more */
      const f1 = es(t, 1.0, 1.2);
      const k1 = es(t, 1.22, 1.26);
      const aside1 = es(t, 2.95, 3.25);
      const x1 = aside1 > 0 ? lerp(PX, 1170, aside1) : lerp(1360, 960, inK(0)) - f1 * (960 - PX);
      s1.set({ x: x1, y: FL + 12, s: 0.9, flip: aside1 < 0.5, o: (1 - k1) + (aside1 > 0 ? 1 : 0), walk: (inK(0) > 0 && inK(0) < 1) || (f1 > 0 && f1 < 1) || (aside1 > 0 && aside1 < 1) ? x1 * 0.06 : undefined, armF: aside1 > 0 ? 20 : 40, head: 4, blink: blinkAt(T, 4) });
      s1k.set({ x: PX, y: FL + 12, s: 0.9, flip: true, o: k1 * (1 - (aside1 > 0 ? 1 : 0)), armF: 70 + bump(t, 1.3, 1.7) * 30, armB: 20, head: 6 - es(t, 2.05, 2.3) * 12, lean: -es(t, 2.3, 2.6) * 10, blink: blinkAt(T, 4) });
      pile1.forEach((el, i) => { const [x, y] = pileSpot(11, i, TX - 30); pop(el, t, 1.3 + i * 0.04, undefined, x, y); });
      pop(tag10, t, 1.45, 2.0, TX - 30, TOP - 110);
      const [s1hx, s1hy] = headAt(PX, FL + 12, 0.9, true, 46);
      pop(said1, t, 1.1, 1.95, s1hx + 16, s1hy - 24);
      /* v17 — well done: ten cities */
      const [khx, khy] = headAt(KX + 4, KY, 1.02, false, 62);
      pop(well, t, 2.05, 2.95, khx + 20, khy - 30);
      t10.forEach((el, i) => {
        const [x, y] = TOWNS10[i];
        const k = es(t, 2.15 + i * 0.04, 2.45 + i * 0.04, ease.back);
        const away = es(t, 2.95, 3.3);
        const cx = lerp(x, 1060 + (i % 5) * 50, away), cy = lerp(y, 190 + Math.floor(i / 5) * 70, away);
        pose(el, { x: cx, y: lerp(-1300, cy, k), s: 1 - away * 0.35, o: k > 0.001 ? 1 : 0 });
      });
      shine.forEach((e, i) => { const k = bump(t, 2.3 + i * 0.1, 2.9 + i * 0.1) + bump(t, 4.3 + i * 0.1, 4.9 + i * 0.1); pose(e, { x: 620 + i * 140, y: 330 + (i % 2) * 40, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });
      /* v18 — the second: five minas */
      const f2 = es(t, 3.1, 3.3);
      const k2 = es(t, 3.32, 3.36);
      const x2 = lerp(1360, 1040, inK(1)) - f2 * (1040 - PX);
      s2.set({ x: x2, y: FL + 12, s: 0.9, flip: true, o: 1 - k2, walk: (inK(1) > 0 && inK(1) < 1) || (f2 > 0 && f2 < 1) ? x2 * 0.06 : undefined, armF: 40, head: 4, blink: blinkAt(T, 6) });
      s2k.set({ x: PX, y: FL + 12, s: 0.9, flip: true, o: k2, armF: 70 + bump(t, 3.4, 3.7) * 30, armB: 20, head: 6 - es(t, 4.05, 4.3) * 12, lean: -es(t, 4.3, 4.6) * 10, blink: blinkAt(T, 6) });
      pile2.forEach((el, i) => { const [x, y] = pileSpot(6, i, TX + 36); pop(el, t, 3.4 + i * 0.05, undefined, x, y); });
      pop(tag5, t, 3.55, 4.0, TX + 36, TOP - 90);
      pop(said2, t, 3.1, 3.95, s1hx + 16, s1hy - 24);
      /* v19 — five cities */
      pop(five, t, 4.05, 5.2, khx + 20, khy - 30);
      t5.forEach((el, i) => {
        const [x, y] = TOWNS5[i];
        const k = es(t, 4.15 + i * 0.06, 4.45 + i * 0.06, ease.back);
        pose(el, { x, y: lerp(-1300, y, k), o: k > 0.001 ? 1 : 0 });
      });
      /* the third waits at the back */
      const x3 = lerp(1400, 1120, inK(2));
      s3.set({ x: x3, y: FL + 10, s: 0.9, flip: true, walk: inK(2) > 0 && inK(2) < 1 ? x3 * 0.06 : undefined, armF: 30, armB: 30, head: 8, lean: 3, blink: blinkAt(T, 8) });

      S.cam.x = kf(t, [[-0.5, 40], [0.8, 60], [1.2, -240], [3.0, -220], [3.3, -240]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.0, 50], [2.1, -30], [2.9, 40], [4.1, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.0, 1.26], [2.1, 1.14], [3.0, 1.26], [4.1, 1.14]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 100], [0.8, 100], [1.2, -240], [3.0, -220]]); S.cam.z = 1.0; }
    };
  },
};
