// Mt 9,18–19 — morning in Matthew's courtyard, Jesus still talking with John's disciples, when a ruler of the
// synagogue hurries in through the gate and falls down before Him. "Lord, my daughter has just died" — a picture
// card: a girl on her bed, her little lamp just gone out. "But come and lay your hand on her, and she will
// live" — the card changes: a hand over her, and the flame burns again. Jesus gets up and goes with him, and the
// disciples leave the table and follow.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { feastSet, FT, FP, SEATS, lookOf, supperTable, pose3, johnsOpts, RULER, L5, card, bubble, lyingPerson, bedFrame, bedBlanket, kf, moving, tr, MORNING, PI } from './lib.js';

const camFor = (x) => (x - 800) / FP;
const JX = 640;

/** the picture of the girl on her bed; lamp: 'out' (a thread of smoke) or 'lit'; hand: Jesus' hand over her */
function girlPicture(c, { lamp = 'out', hand = false } = {}) {
  const bed = `<g transform="translate(0 30) scale(.42)">${bedFrame(c)}<g transform="translate(0 -54)">${lyingPerson(c, L5.girl, 0.62)}</g>${bedBlanket(c)}</g>`;
  const lampM = `<g transform="translate(52 20) scale(.55)"><path d="${c.cut([[-16, 0], [-18, -6], [-10, -10], [8, -10], [16, -8], [20, -10], [22, -7], [15, -1], [8, 1], [-10, 1]], 0.3, 3)}" fill="${C.pot}"/>${lamp === 'lit' ? `<circle cx="19" cy="-16" r="30" fill="url(#warm-glow)"/><path d="M19 -10C16 -13 16 -17 19 -21C22 -17 22 -13 19 -10Z" fill="${C.lampFlame}"/>` : `<path d="${c.ribbon(c.cbez([19, -12], [12, -24], [26, -30], [16, -44], 10), 2)}" fill="${C.stone2}"/>`}</g>`;
  const handM = hand ? `<g transform="translate(-14 -22) rotate(80)"><path d="${c.cut([[-7, -4], [7, -4], [8.5, 30], [-7.5, 32]], 0.4, 4)}" fill="${C.linen}"/><path d="${c.cut(c.circ(0.5, 37, 6.3, 12), 0.2, 3)}" fill="${C.skin}"/></g><circle cx="-4" cy="-4" r="40" fill="url(#halo-glow)" opacity=".7"/>` : '';
  return bed + lampM + handM;
}

export default {
  id: 'mt9-ruler',
  beats: [
    { v: 18, text: 'Gdy to mówił do nich, pewien zwierzchnik [synagogi] przyszedł do Niego i, oddając pokłon, prosił:' },
    { v: 18, cont: true, text: '«Panie, moja córka dopiero co skonała,' },
    { v: 18, cont: true, text: 'lecz przyjdź i włóż na nią rękę, a żyć będzie».' },
    { v: 19 },
  ],
  cam: { x: [camFor(430), camFor(760)], y: [40, 120], z: [1.0, 1.2] },
  build(S) {
    const set = feastSet(S, { skyCols: MORNING, sunAt: [1300, 170] });
    const c = S.c;

    /* the company at the table (still), Peter and John who will get up */
    const L = S.layer({ par: FP, sh: 5 });
    const seatM = (o, flip) => pose3(c, [{ x: 0, y: 0, s: 1, flip, armF: 40, armB: 16, head: 2, o: { ...o, pose: 'sit' } }]);
    SEATS.filter(([, who]) => !['jesus', 'peter', 'john', 'andrew'].includes(who)).forEach(([x, who]) => L.add(`<g transform="translate(${x} ${FT.SEAT})">${seatM(lookOf(who), x > 845)}</g>`));
    const DIS = ['andrew', 'peter', 'john'].map((k, i) => {
      const x = SEATS.find(([, w]) => w === k)[0];
      return { k, i, x, sit: L.add(`<g>${seatM(CAST[k], x > 845)}</g>`), p: S.puppet(L.add(person(c, { ...CAST[k] }))), seed: c.rr(0, 9) };
    });
    const tableL = S.layer({ par: FP, sh: 5 });
    tableL.add(`<g transform="translate(${FT.TX} ${FT.FLOOR})">${supperTable(c)}</g>`);

    /* in front: John's disciples listening, Jesus, the ruler */
    const front = S.layer({ par: FP, sh: 6 });
    const JD = [0, 1].map((i) => ({ i, p: S.puppet(front.add(person(c, johnsOpts(c)))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(front.add(person(c, { ...CAST.jesus })));
    const rWalk = S.puppet(front.add(person(c, RULER)));
    const rKneel = S.puppet(front.add(person(c, { ...RULER, pose: 'kneel' })));
    const words = S.layer({ par: FP, sh: 7 });
    const plea1 = words.add(`<g opacity="0">${bubble(c, [' ', ' ', ' ', ' '], { w: 280, size: 26, dir: -1 })}<g transform="translate(125 -106) scale(1.9)">${girlPicture(c, { lamp: 'out' })}</g></g>`);
    const plea2 = words.add(`<g opacity="0">${bubble(c, [' ', ' ', ' ', ' '], { w: 280, size: 26, dir: -1 })}<g transform="translate(125 -106) scale(1.9)">${girlPicture(c, { lamp: 'lit', hand: true })}</g></g>`);

    return (t, time) => {
      const T = time;
      set.update(T);

      /* v18a — the ruler comes through the gate and kneels */
      const RK = [[0.05, 180], [0.6, 500]];
      const rx = kf(t, RK);
      const down = es(t, 0.6, 0.67);
      const up = es(t, 3.0, 3.07);
      const RK2 = [[3.07, 500], [3.9, 180]];
      const rx2 = kf(t, RK2);
      rWalk.set({ x: up > 0 ? rx2 : rx, y: FT.FLOOR + 26, s: 1, flip: up > 0.5, walk: moving(t, RK) || moving(t, RK2) ? (up > 0 ? rx2 : rx) * 0.06 : undefined, amt: 1.3, armF: 30 + (up > 0 ? 50 : 0), armB: 20, lean: up > 0 ? -4 : 6, o: (1 - down) + up, blink: blinkAt(T, 3) });
      const beg = es(t, 2.05, 2.25);
      rKneel.set({ x: 500, y: FT.FLOOR + 26, s: 1, o: down * (1 - up), armF: 40 + beg * 70, armB: 30 + beg * 90, head: 8 - beg * 16, lean: 10 - beg * 8, blink: blinkAt(T, 3) });

      /* v18b / v18c — his plea, as pictures */
      const k1 = es(t, 1.05, 1.25, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(plea1, { x: 530, y: FT.FLOOR - 206, s: k1, o: k1 > 0.02 ? 1 : 0 });
      const k2 = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(plea2, { x: 530, y: FT.FLOOR - 206, s: k2, o: k2 > 0.02 ? 1 : 0 });

      /* Jesus: talking with John's disciples, turns to the ruler, then goes with him */
      const JK = [[3.05, JX], [3.9, 300]];
      const jx = kf(t, JK);
      const turn = es(t, 0.45, 0.55);
      const lean = es(t, 1.1, 1.4);
      jesus.set({ x: jx, y: FT.FLOOR + 14, s: 1.04, flip: turn > 0.5, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 20 + (1 - turn) * 40 + lean * 30 * (1 - up) + up * 10, armB: 10, head: lean * 8 * (1 - up), blink: blinkAt(T) });
      JD.forEach((d) => d.p.set({ x: 820 + d.i * 70 - es(t, 3.0, 3.4) * 0, y: FT.FLOOR + 30 - d.i * 6, s: 1, flip: true, armF: 20 + bump(t, 0.6, 1.4) * 30 * (d.i === 0 ? 1 : 0), head: 4, o: 1 - es(t, 3.2, 3.5), blink: blinkAt(T, d.seed) }));

      /* v19 — the disciples get up and follow */
      DIS.forEach((d) => {
        const rise = es(t, 3.1 + d.i * 0.06, 3.17 + d.i * 0.06);
        const K = [[3.17 + d.i * 0.06, d.x], [3.95, 300 + (d.i + 1) * 90]];
        const x = kf(t, K);
        pose(d.sit, { x: d.x, y: FT.SEAT, o: 1 - rise });
        d.p.set({ x, y: FT.FLOOR + (d.i === 0 ? 0 : 4), s: 1, flip: true, walk: moving(t, K) ? x * 0.05 + d.i : undefined, o: rise, armF: 20, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, camFor(700)], [0.6, camFor(600)], [3.0, camFor(600)], [3.9, camFor(S.portrait ? 440 : 520)]]);   // phone: follow them out to the ruler
      S.cam.z = 1.1 + es(t, 0.8, 1.3) * 0.06 - es(t, 3.0, 3.6) * 0.08;
      S.cam.y = 80 + es(t, 0.8, 1.3) * 20;
    };
  },
};
