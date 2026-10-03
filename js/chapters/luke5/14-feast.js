// Łk 5,29–30 — evening in Levi's courtyard: Levi leads Jesus in from the house to the head of the long table, the
// lanterns come alight one by one and a great platter is set down — a great feast in His honour. Then they come in
// through the gate and from the house, tax collectors in bright mantles with fat purses and all sorts of others, and
// sit down with them, at the long table and at a second one — a great company. At the gate the Pharisees and their
// scribes gather; they mutter and frown, lean over the wall to the disciples at the end of the table and ask: "Why do
// you eat and drink with tax collectors and sinners?"
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  levisFeast, FP, FT, bubble, murmur, glyphTag, headAt, kf, moving, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const camFor = (x) => (x - 800) / FP;

export default {
  id: 'lk5-feast',
  beats: [
    { v: 29, text: 'Potem Lewi wyprawił dla Niego wielkie przyjęcie u siebie w domu;' },
    { v: 29, cont: true, text: 'a była spora liczba celników oraz innych, którzy zasiadali z nimi do stołu.' },
    { v: 30, text: 'Na to szemrali faryzeusze i uczeni ich w Piśmie i mówili do Jego uczniów:' },
    { v: 30, cont: true, text: '«Dlaczego jecie i pijecie z celnikami i grzesznikami?»' },
  ],
  cam: { x: [camFor(620), camFor(1000)], y: [40, 130], z: [1.0, 1.2] },
  build(S) {
    const c = S.c;
    const F = levisFeast(S);
    const { fx } = F;
    const mutter = F.PH.map((m, i) => fx.add(`<g>${murmur(c, { side: 1 })}</g>`));
    const frowns = [0, 1].map(() => fx.add(`<g>${glyphTag(c, '!', { size: 20 })}</g>`));
    const q = fx.add(`<g>${bubble(c, [tr('Dlaczego jecie i pijecie', 'Why do you eat and drink'), tr('z celnikami i grzesznikami?', 'with tax collectors and sinners?')], { size: 19, tail: -1 })}</g>`);

    const JK = [[0.02, 1330], [0.5, 900]];
    const LK = [[0.0, 1260], [0.45, 720], [1.0, 720], [1.08, 773]];

    return (t, time) => {
      const T = time;
      F.idle(T, es(t, 0.15, 0.3));
      F.lamps.forEach((l) => fade(l.glow, es(t, 0.1 + l.i * 0.12, 0.25 + l.i * 0.12)));
      const guestsIn = 0;
      F.seatAll(guestsIn);

      /* v29a — Levi leads Jesus in to the head of the table; the platter is set down */
      const jx = kf(t, JK, ease.out);
      const jsit = es(t, 0.52, 0.58);
      F.jStand.set({ x: jx, y: FT.FLOOR, s: 1.02, flip: true, walk: moving(t, JK) ? jx * 0.05 : undefined, o: 1 - jsit, blink: blinkAt(T) });
      const bless = es(t, 0.65, 0.85) * (1 - es(t, 1.1, 1.3));
      const welcome = es(t, 1.2, 1.5) * (1 - es(t, 2.2, 2.5) * 0.6);
      F.jSit.set({ x: 845, y: FT.SEAT, s: 1.02, o: jsit, armF: 30 + bless * 50 + welcome * 40, armB: 14 + welcome * 50, head: -bless * 6, blink: blinkAt(T) });
      const lx = kf(t, LK, ease.out);
      const lsit = es(t, 1.06, 1.1);
      F.leviStand.set({ x: lx, y: FT.FLOOR + 4, s: 1.0, walk: moving(t, LK) ? lx * 0.05 + 1 : undefined, o: 1 - lsit, flip: t < 0.45, armF: 50 + bump(t, 0.45, 0.95) * 40, armB: 20 + bump(t, 0.05, 0.4) * 60, blink: blinkAt(T, 4) });
      F.leviSit.set({ x: 773, y: FT.SEAT, s: 1.0, flip: false, o: lsit, armF: 40 + welcome * 30, armB: 14 + welcome * 40, head: 4, blink: blinkAt(T, 4) });
      const pk = es(t, 0.6, 0.8, ease.back);
      pose(F.platter, { x: 900, y: FT.FLOOR - 44 - (1 - pk) * 60, s: pk, o: pk > 0.01 ? 1 : 0 });

      /* v29b — many tax collectors and others come in and sit with them */
      F.walkers.forEach((w) => {
        const a = 1.02 + w.k * 0.07, b = a + 0.32;
        const x = lerp(w.from, w.x, es(t, a, b, (u) => u));
        const sat = es(t, b, b + 0.07);
        w.p.set({ x, y: FT.FLOOR + 6, s: 1, flip: w.from > w.x, walk: t > a && t < b ? x * 0.05 + w.k : undefined, o: seg(t, a - 0.05, a) * (1 - sat), armF: 20, armB: 12, blink: blinkAt(T, w.seed) });
        pose(w.el, { x: w.x, y: FT.SEAT, o: sat });
      });
      F.company.set({ o: es(t, 1.4, 1.6) });

      /* v30 — the Pharisees and their scribes mutter at the gate and ask the disciples */
      const look = es(t, 2.05, 2.3);
      F.PH.forEach((ph) => {
        const x = lerp(ph.x - 180, ph.x, es(t, 1.9 + ph.i * 0.06, 2.25 + ph.i * 0.06));
        ph.p.set({ x, y: FT.FLOOR - 6 + ph.i * 3, s: 1, walk: t > 1.9 && t < 2.35 ? x * 0.05 + ph.i : undefined, armF: 20 + (ph.i === 2 ? es(t, 3.05, 3.25) * 70 : 0) + (ph.i === 1 ? look * 30 : 0), armB: 10 + (ph.i === 0 ? es(t, 3.1, 3.3) * 50 : 0), lean: ph.i === 2 ? es(t, 3.0, 3.2) * 8 : 0, head: -look * 4 + (ph.i === 1 ? 6 : 0), blink: blinkAt(T, ph.seed) });
        fade(ph.angry, look);
      });
      mutter.forEach((m, i) => {
        const k = es(t, 2.2 + i * 0.08, 2.4 + i * 0.08, ease.back) * (1 - es(t, 2.95, 3.05));
        const ph = F.PH[i], [hx, hy] = headAt(ph.x, FT.FLOOR - 6, 1, false);
        pose(m, { x: hx + 16, y: hy - 16, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });
      frowns.forEach((f, i) => { const k = es(t, 2.3 + i * 0.1, 2.5 + i * 0.1, ease.back) * (1 - es(t, 2.95, 3.0)); pose(f, { x: 330 + i * 70, y: 470, s: k, o: k > 0.02 ? 1 : 0 }); });
      const qk = es(t, 3.05, 3.25, ease.back);
      pose(q, { x: 480, y: 468, s: qk, o: qk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, camFor(960)], [0.9, camFor(880)], [1.1, camFor(900)], [1.8, camFor(920)], [2.3, camFor(S.portrait ? 620 : 680)], [4, camFor(S.portrait ? 610 : 660)]]   // phone: the Pharisees at the gate on the screen
       );
      S.cam.y = kf(t, [[0, 90], [0.9, 110], [1.8, 80], [2.3, 110], [4, 110]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.14], [1.1, 1.04], [1.8, 1.02], [2.3, 1.14], [4, 1.16]]);
    };
  },
};
