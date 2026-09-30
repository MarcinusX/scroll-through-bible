// Łk 17,22–23 — dusk on the road to Jerusalem; Jesus turns to the four. "The days will come, when you will desire to
// see one of the days of the Son of Man, and you will not see it": a long line of days is strung across the sky, grey
// card after grey card, and one golden among them with Him in it; they reach up for it — and it turns grey like the
// rest. "They will tell you, 'Look, here!' or 'Look, there!'": at either side of the road a man lifts a lantern and
// beckons, calling. "Don't go away, nor follow after them": John starts off after one of them — Jesus lifts His hand,
// John stops and comes back, and the two callers fade into the dusk.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, dayCard, bubble, folk, voiceRings, headAt, hand, halo, warm, behindOf, kf, es, ease, bump, seg, tr, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const JX = 780, JY = 716;
const SPOT = { peter: [626, 726, false], andrew: [546, 738, false], john: [930, 726, true], james: [1010, 738, true] };
const CARD_Y = 250, N = 9, GOLD = 4;

export default {
  id: 'lk17-days',
  beats: [
    { v: 22 },
    { v: 23, text: 'Powiedzą wam: "Oto tam" lub: "Oto tu".' },
    { v: 23, cont: true, text: 'Nie chodźcie tam i nie biegnijcie za nimi!' },
  ],
  cam: { x: [-40, 40], y: [-40, 50], z: [1, 1.12] },
  build(S) {
    const R = roadSet(S, { village: false });
    const c = S.c;
    const hangL = S.layer({ par: 0.1, sh: 4 });
    const cord = hangL.add(`<g transform="translate(0 -1500)"><path d="M-1300 -2400L-560 0Q0 34 560 0L1300 -2400" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/></g>`);
    const cards = Array.from({ length: N }, (_, i) => ({ i, dx: (i - (N - 1) / 2) * 116, grey: hangL.add(`<g opacity="0">${dayCard(c, false)}</g>`), gold: i === GOLD ? hangL.add(`<g opacity="0">${dayCard(c, true)}</g>`) : null }));
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const F = roadFour(S, act, c);
    const pc = makeCutter('lk17-callers');
    const LANTERN = `<g transform="rotate(150) translate(0 10)"><path d="M0 -4V14" stroke="${C.inkSoft}" stroke-width="1.5"/>${sheet().p(pc.cut(pc.rect(-9, 14, 18, 24), 0.3, 4), C.wood2).p(pc.cut(pc.rect(-6, 17, 12, 18), 0.2, 3), C.lampFlame).out()}</g>`;
    const callers = [[476, 744, false], [1124, 744, true]].map(([x, y, fl], i) => ({ i, x, y, fl, p: S.puppet(act.add(person(pc, { ...folk(pc, true, { robe: [C.plumRobe, C.tealRobe][i], mantle: mix(C.night2, C.plumRobe, 0.4) }), holdB: LANTERN }))), g: glowL.add(`<g opacity="0">${warm(60)}</g>`) }));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const calls = [tr('Oto tu!', 'Look, here!'), tr('Oto tam!', 'Look, there!')].map((txt, i) => fx.add(`<g opacity="0">${bubble(c, txt, { size: 19, tail: i ? -1 : 1 })}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.7 + es(t, 0, 3) * 0.3, nightK: es(t, 1.2, 3) * 0.45, sunK: 0.8 + es(t, 0, 3) * 0.2 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, o: 0.5 });

      /* v22 — a line of days; one golden, reached for, not seen */
      const ck = es(t, 0.05, 0.35, ease.back) * (1 - es(t, 1.9, 2.2));
      const cy = lerp(-1500, CARD_Y, ck);
      pose(cord, { x: 800, y: cy - 10, o: ck > 0.002 ? 1 : 0 });
      const fadeGold = es(t, 0.7, 0.9);
      cards.forEach((k) => {
        const sag = (1 - Math.pow(k.dx / 560, 2)) * 17;
        const x = 800 + k.dx, y = cy - 10 + sag;
        const r = T ? Math.sin(T * 0.8 + k.i) * 2 : 0;
        pose(k.grey, { x, y, r, o: ck > 0.002 ? (k.gold ? fadeGold : 1) : 0 });
        if (k.gold) pose(k.gold, { x, y, r, s: 1 + bump(t, 0.3, 0.7) * 0.12, o: ck > 0.002 ? 1 - fadeGold : 0 });
      });

      /* Jesus; the four reach for the golden day */
      const stop = es(t, 2.05, 2.2);
      F.jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 16 + bump(t, 0.05, 0.9) * 30 + stop * 60, armB: 8 + bump(t, 0.05, 0.9) * 40 + stop * 120, head: -2, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 0.02, 0.12) * (1 - es(t, 0.6, 0.7)) + es(t, 2.02, 2.12) * (1 - es(t, 2.7, 2.8)), T, { dir: 1, spread: 2 });
      const reach = bump(t, 0.3, 0.95);
      const run = es(t, 1.5, 1.85) * (1 - es(t, 2.2, 2.5));
      F.ds.forEach((d) => {
        const [x0, y0, fl] = SPOT[d.k];
        const john = d.k === 'john';
        const x = x0 + (john ? run * 120 : 0);
        const lookR = john ? 0 : es(t, 1.1, 1.3) * (d.k === 'james' ? 1 : 0);
        d.p.set({ x, y: y0, s: 0.96, flip: john ? !(run > 0.05 && t < 2.2) : fl, walk: john && run > 0.02 && run < 0.98 ? x * 0.08 : undefined, armF: 14 + reach * 70 + (john ? run * 30 : 0), armB: 6 + reach * 120, head: -6 - reach * 10 + lookR * 4, blink: blinkAt(T, d.seed) });
      });

      /* v23a — callers with lanterns, left and right */
      callers.forEach((m) => {
        const k = es(t, 1.05 + m.i * 0.1, 1.3 + m.i * 0.1);
        const gone = es(t, 2.45, 2.75);
        const beck = T ? Math.sin(T * 5 + m.i) * 0.5 + 0.5 : 0.5;
        m.p.set({ x: m.x + (m.fl ? 1 : -1) * (1 - k) * 80, y: m.y, s: 0.96, flip: m.fl, armF: 40 + beck * 50 * k, armB: 150, head: -6, o: k * (1 - gone), blink: blinkAt(T, m.i + 2) });
        const [lx, ly] = hand(m.x, m.y, 0.96, m.fl, 150);
        pose(m.g, { x: lx + (m.fl ? 18 : -18), y: ly + 20, o: k * (1 - gone) * 0.9 });
        const [hx, hy] = headAt(m.x, m.y, 0.96, m.fl);
        const bk = es(t, 1.15 + m.i * 0.1, 1.3 + m.i * 0.1, ease.back) * (1 - es(t, 2.1, 2.2));
        pose(calls[m.i], { x: hx + (m.fl ? -40 : 40), y: hy - 40, s: bk, o: bk > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 10], [3, 0]]);
      S.cam.y = kf(t, [[0, -20], [0.9, -20], [1.2, 30], [3, 30]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [1.3, 1.06], [3, 1.08]]);
    };
  },
};
