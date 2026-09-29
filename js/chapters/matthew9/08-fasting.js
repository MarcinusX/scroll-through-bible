// Mt 9,14 — the lanterns still burn in Matthew's courtyard when John's disciples come in through the gate:
// lean men in camel hair, each holding an empty bowl turned upside down, with two Pharisees behind them.
// "Why do we and the Pharisees fast often, but your disciples don't fast?" — and they point at the table,
// where Peter is breaking bread and John lifts his cup.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { feastSet, FT, FP, SEATS, lookOf, supperTable, pose3, scribe, johnsOpts, lantern, loaf, cup, bubble, kf, moving, tr, NIGHT } from './lib.js';
import { emptyBowl } from '../mark8/lib.js';

const camFor = (x) => (x - 800) / FP;
const JX = 640;

export default {
  id: 'mt9-fasting',
  beats: [
    { v: 14, text: 'Wtedy podeszli do Niego uczniowie Jana i zapytali:' },
    { v: 14, cont: true, text: '«Dlaczego my i faryzeusze dużo pościmy, Twoi zaś uczniowie nie poszczą?»' },
  ],
  cam: { x: [camFor(620), camFor(760)], y: [40, 120], z: [1.04, 1.18] },
  build(S) {
    const set = feastSet(S, { skyCols: NIGHT, night: true, sunAt: [1180, 150] });
    const c = S.c;
    const lampL = S.layer({ par: FP, sh: 5 });
    const lamps = [[640, 336], [1000, 336], [1330, 336]].map(([x, y], i) => ({ i, x, y, el: lampL.add(`<g><circle cx="0" cy="30" r="90" fill="url(#warm-glow)"/><path d="M0 -40V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lantern(c, { col: [C.apricot, C.roseRobe, C.halo][i] })}</g>`) }));

    /* the company at the table; Jesus standing at its end */
    const L = S.layer({ par: FP, sh: 5 });
    const seatM = (o, flip, armF = 56, armB = 16, head = 2, holdF = '') => pose3(c, [{ x: 0, y: 0, s: 1, flip, armF, armB, head, o: { ...o, pose: 'sit', holdF } }]);
    SEATS.filter(([, who]) => who !== 'jesus' && who !== 'peter' && who !== 'john').forEach(([x, who]) => L.add(`<g transform="translate(${x} ${FT.SEAT})">${seatM(lookOf(who), x > 845)}</g>`));
    const peter = S.puppet(L.add(person(c, { ...CAST.peter, pose: 'sit', holdF: `<g transform="translate(0 4)">${loaf(c, 14)}</g>` })));
    const john = S.puppet(L.add(person(c, { ...CAST.john, pose: 'sit', holdF: `<g transform="translate(2 12)">${cup(c)}</g>` })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const tableL = S.layer({ par: FP, sh: 5 });
    tableL.add(`<g transform="translate(${FT.TX} ${FT.FLOOR})">${supperTable(c)}</g>`);

    /* John's disciples and two Pharisees come in through the gate */
    const front = S.layer({ par: FP, sh: 6 });
    const PH = [1, 2].map((i, k) => ({ k, p: S.puppet(front.add(scribe(c, i))), seed: c.rr(0, 9) }));
    const JD = [0, 1, 2].map((i) => ({ i, p: S.puppet(front.add(person(c, { ...johnsOpts(c), holdF: `<g transform="translate(0 20) rotate(180)">${emptyBowl(c, 30)}</g>` }))), seed: c.rr(0, 9) }));
    const ask = front.add(`<g opacity="0">${bubble(c, [tr('Dlaczego my pościmy,', 'Why do we fast,'), tr('a Twoi uczniowie nie?', 'but your disciples don’t?')], { size: 21, dir: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      set.update(T);
      lamps.forEach((l) => pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.8 + l.i) * 1.5 }));

      /* v14a — they come in through the gate */
      JD.forEach((d) => {
        const K = [[0.05 + d.i * 0.1, 160 - d.i * 70], [0.7 + d.i * 0.08, 470 - d.i * 66]];
        const x = kf(t, K);
        const point = d.i === 0 ? es(t, 1.2, 1.4) : 0;
        d.p.set({ x, y: FT.FLOOR + 30 + (d.i % 2) * 8, s: 1, walk: moving(t, K) ? x * 0.05 + d.i : undefined, armF: 40 + point * 50, armB: 12 + (d.i === 1 ? es(t, 1.1, 1.3) * 60 : 0), head: -point * 4, blink: blinkAt(T, d.seed) });
      });
      PH.forEach((ph) => {
        const K = [[0.3 + ph.k * 0.1, 60 - ph.k * 60], [0.95 + ph.k * 0.08, 262 - ph.k * 64]];
        const x = kf(t, K);
        ph.p.set({ x, y: FT.FLOOR + 10 + ph.k * 6, s: 0.96, walk: moving(t, K) ? x * 0.05 + ph.k : undefined, armF: 20 + es(t, 1.2, 1.4) * 30 * ph.k, armB: 10, head: 4, blink: blinkAt(T, ph.seed) });
      });
      jesus.set({ x: JX, y: FT.FLOOR, s: 1.02, flip: es(t, 0.4, 0.5) > 0.5, armF: 20 + es(t, 0.6, 0.9) * 30, armB: 10, head: 2, blink: blinkAt(T) });

      /* v14b — "why don't your disciples fast?" — at the table Peter breaks bread and John drinks */
      const eat = es(t, 1.15, 1.4);
      peter.set({ x: 917, y: FT.SEAT, s: 1, flip: true, armF: 60 + eat * 60, armB: 20, head: -eat * 4, blink: blinkAt(T, 2) });
      john.set({ x: 989, y: FT.SEAT, s: 1, flip: true, armF: 50 + eat * 70, armB: 16, head: -eat * 8, blink: blinkAt(T, 6) });
      const k = es(t, 1.08, 1.28, ease.back);
      pose(ask, { x: 480, y: FT.FLOOR - 236, s: k, o: k > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, camFor(620)], [1.0, camFor(660)], [1.6, camFor(740)]]);
      S.cam.z = 1.08 + es(t, 0.8, 1.4) * 0.06;
      S.cam.y = 80 + es(t, 0.8, 1.4) * 20;
    };
  },
};
