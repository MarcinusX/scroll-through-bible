// Mt 9,10–11 — evening in Matthew's courtyard under the vine: Jesus comes in and sits at the long table with
// Matthew and the disciples, the lanterns glowing. Then many tax collectors (bright mantles, fat purses) and
// sinners come in through the gate and from the house and sit down with them. Outside the low wall the
// Pharisees look over the gate and call to the disciple at the end of the table: "Why does your Teacher eat
// with tax collectors and sinners?"
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { feastSet, FT, FP, SEATS, lookOf, supperTable, pose3, scribe, lantern, jug, purse, bubble, glyphTag, kf, moving, hangAt, tr, EVENING } from './lib.js';

const camFor = (x) => (x - 800) / FP;

export default {
  id: 'mt9-table',
  beats: [
    { v: 10, text: 'Gdy Jezus siedział w domu za stołem,' },
    { v: 10, cont: true, text: 'przyszło wielu celników i grzeszników i siedzieli wraz z Jezusem i Jego uczniami.' },
    { v: 11, text: 'Widząc to, faryzeusze mówili do Jego uczniów:' },
    { v: 11, cont: true, text: '«Dlaczego wasz Nauczyciel jada wspólnie z celnikami i grzesznikami?»' },
  ],
  cam: { x: [camFor(640), camFor(910)], y: [60, 130], z: [1.05, 1.2] },
  build(S) {
    // the Pharisees stand in the street, behind the low wall
    let PH = null;
    const set = feastSet(S, {
      skyCols: EVENING,
      outside: (S2) => {
        const L = S2.layer({ par: FP, sh: 4 });
        PH = [0, 1, 2].map((i) => ({ i, x: (S2.portrait ? [400, 460, 520] : [310, 370, 446])[i],   // phone: in the gateway, inside the screen
        seed: S2.c.rr(0, 9), p: S2.puppet(L.add(scribe(S2.c, i + 1))) }));
        return L;
      },
    });
    const c = S.c;

    /* lanterns on the pergola */
    const lampL = S.layer({ par: FP, sh: 5 });
    const lamps = [[640, 336], [1000, 336], [1330, 336]].map(([x, y], i) => ({ i, x, y, el: lampL.add(`<g><circle cx="0" cy="30" r="70" fill="url(#warm-glow)"/><path d="M0 -40V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lantern(c, { col: [C.apricot, C.roseRobe, C.halo][i] })}</g>`) }));

    /* the seated company: a still cut-out per place */
    const L = S.layer({ par: FP, sh: 5 });
    const seat = (x, o, flip, armF = 56) => L.add(`<g>${pose3(c, [{ x: 0, y: 0, s: 1, flip, armF, armB: 16, head: 2, o: { ...o, pose: 'sit' } }])}</g>`);
    const places = SEATS.map(([x, who], i) => ({ i, x, who, guest: who.length === 2, el: who === 'jesus' ? null : seat(x, lookOf(who), x > 845) }));
    const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jWalk = S.puppet(L.add(person(c, { ...CAST.jesus })));
    // the guests walking in (then they sit)
    const walkers = places.filter((p) => p.guest).map((p, k) => {
      const o = lookOf(p.who);
      const withPurse = p.who[0] === 'T';
      return { ...p, k, from: p.x < 845 ? 440 : 1330, p: S.puppet(L.add(person(c, { ...o, holdB: withPurse ? `<g transform="translate(0 -4)">${purse(c, 1)}</g>` : '' }))), seed: c.rr(0, 9) };
    });
    const james = S.puppet(L.add(person(c, { ...CAST.james, holdF: `<g transform="translate(-2 6) scale(.62)">${jug(c)}</g>` })));
    const tableL = S.layer({ par: FP, sh: 5 });
    tableL.add(`<g transform="translate(${FT.TX} ${FT.FLOOR})">${supperTable(c)}</g>`);

    /* the Pharisees' words */
    const fx = S.layer({ par: FP, sh: 6 });
    const q = fx.add(`<g opacity="0">${bubble(c, [tr('Dlaczego wasz Nauczyciel jada', 'Why does your teacher eat'), tr('z celnikami i grzesznikami?', 'with tax collectors and sinners?')], { size: 19, dir: -1 })}</g>`);
    const frowns = [0, 1].map((i) => fx.add(`<g opacity="0">${glyphTag(c, '!', { size: 20 })}</g>`));

    const JK = [[-0.2, 1330], [0.45, 900]];
    return (t, time) => {
      const T = time;
      set.update(T);
      lamps.forEach((l) => pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.8 + l.i) * 1.5 }));

      /* v10a — Jesus comes in from the house and sits at the table */
      const jx = kf(t, JK, ease.out);
      const sit = es(t, 0.45, 0.52);
      jWalk.set({ x: jx, y: FT.FLOOR, s: 1.02, flip: true, walk: moving(t, JK) ? jx * 0.05 : undefined, o: 1 - sit, blink: blinkAt(T) });
      const bless = es(t, 0.6, 0.85) * (1 - es(t, 1.2, 1.4));
      const welcome = es(t, 1.1, 1.4);
      const turnL = es(t, 2.1, 2.3);
      jSit.set({ x: 845, y: FT.SEAT, s: 1.02, o: sit, armF: 30 + bless * 50 + welcome * 40 * (1 - turnL * 0.5), armB: 14 + welcome * 60 * (1 - turnL), head: -bless * 6, blink: blinkAt(T) });
      places.forEach((p) => { if (p.el && !p.guest) pose(p.el, { x: p.x, y: FT.SEAT }); });

      /* v10b — tax collectors and sinners come and sit down */
      walkers.forEach((w) => {
        const a = 1.05 + w.k * 0.09, b = a + 0.4;
        const x = lerp(w.from, w.x, es(t, a, b, (u) => u));
        const sat = es(t, b, b + 0.07);
        w.p.set({ x, y: FT.FLOOR + 6, s: 1, flip: w.from > w.x, walk: t > a && t < b ? x * 0.05 + w.k : undefined, o: seg(t, a - 0.05, a) * (1 - sat), armF: 20, armB: 12, blink: blinkAt(T, w.seed) });
        pose(w.el, { x: w.x, y: FT.SEAT, o: sat });
      });
      const jmx = kf(t, [[1.2, 1230], [1.6, 1205], [2.0, 1230]]);
      james.set({ x: jmx, y: FT.FLOOR, s: 1, flip: true, armF: 50 + bump(t, 1.3, 1.9) * 30, armB: 14, blink: blinkAt(T, 4) });

      /* v11 — the Pharisees look over the wall and call to the disciples */
      const look = es(t, 1.9, 2.2);
      PH.forEach((ph) => {
        const x = lerp(ph.x - 160, ph.x, es(t, 1.85 + ph.i * 0.06, 2.2 + ph.i * 0.06));
        ph.p.set({ x, y: FT.FLOOR - 6 + ph.i * 3, s: 1, walk: t > 1.85 && t < 2.3 ? x * 0.05 + ph.i : undefined, armF: 20 + (ph.i === 2 ? es(t, 2.9, 3.1) * 70 : 0) + (ph.i === 1 ? look * 40 : 0), armB: 10 + (ph.i === 0 ? es(t, 3.0, 3.2) * 60 : 0), head: -look * 4 + (ph.i === 1 ? 6 : 0), blink: blinkAt(T, ph.seed) });
      });
      frowns.forEach((f, i) => {
        const k = es(t, 2.2 + i * 0.1, 2.4 + i * 0.1, ease.back) * (1 - es(t, 2.9, 3.0));
        pose(f, { x: (S.portrait ? 420 : 330) + i * 60, y: 482, s: k, o: k > 0.02 ? 1 : 0 });
      });
      const qk = es(t, 3.05, 3.25, ease.back);
      pose(q, { x: S.portrait ? 520 : 470, y: 470, s: qk, o: qk > 0.02 ? 1 : 0 });

      /* camera: the table → over to the gate */
      S.cam.x = kf(t, [[0, camFor(900)], [1.0, camFor(845)], [2.0, camFor(830)], [2.5, camFor(S.portrait ? 670 : 700)], [3.8, camFor(S.portrait ? 660 : 690)]]);
      S.cam.z = 1.1 + es(t, 0.1, 0.6) * 0.08 - es(t, 1.0, 1.5) * 0.06;
      S.cam.y = 100 + es(t, 0.1, 0.6) * 20 - es(t, 1.0, 1.5) * 20;
    };
  },
};
