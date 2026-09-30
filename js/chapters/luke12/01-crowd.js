// Łk 12,1 — the curtains open on Luke 8's level plain: Jesus on the low rise with Peter, Andrew, John and James.
// Then the thousands come down every road at once and crowd in on the rise until they tread on one another: the
// knots press together and jostle, dust puffs up round their feet. He turns first to His disciples, who close in round
// Him. "Beware of the leaven of the Pharisees, which is hypocrisy": over the plain a kneading bowl comes down on its
// strings and the dough swells up over the rim, bubbling; beside it an "=" and a round tag with a smiling golden mask —
// and at the edge of the crowd a Pharisee lifts just such a mask on its stick in front of his own sour face.
import { C, person, blinkAt, pose, lerp, curtains, sheet } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { plainSet, standNear, ROADS, RISE, plainS, alongPts, doughBowl, bubbleDot, mask, pharisee, iconTag, onString, dustPuff, hand, headAt, voiceRings, hangAt, tr, PI } from './lib.js';

const JX = 800;
const PH = [{ x: 1062, y: 734, i: 0 }, { x: 1128, y: 722, i: 1 }];

export default {
  id: 'lk12-crowd',
  beats: [
    { cover: true },
    { v: 1, text: 'Kiedy wielotysięczne tłumy zebrały się koło Niego, tak że jedni cisnęli się na drugich, zaczął mówić najpierw do swoich uczniów:' },
    { v: 1, cont: true, text: '«Strzeżcie się kwasu, to znaczy obłudy faryzeuszów.' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [0.96, 1.12] },
  build(S) {
    const P = plainSet(S);
    const c = S.c;
    // each knot walks down its road, then out to its place
    P.crowd.forEach((g) => {
      const road = ROADS[g.road];
      g.path = [...road.slice(0, -1), [lerp(road[road.length - 2][0], g.x, 0.5), lerp(road[road.length - 2][1], g.y, 0.5)], [g.x, g.y]];
      g.d = (g.i % 5) * 0.06 + (g.road === 1 ? 0.08 : 0);
    });
    /* two Pharisees at the edge of the crowd; one has a mask on a stick */
    const phs = PH.map((m) => ({ ...m, seed: c.rr(0, 9), p: S.puppet(P.act.add(person(c, pharisee(m.i + 1)))) }));
    const maskEl = P.act.add(`<g>${mask(c, { r: 21 })}</g>`);
    const puffs = [[520, 690], [650, 668], [980, 668], [1110, 690], [720, 640], [890, 640], [400, 700], [1230, 700]].map(([x, y], i) => ({ x, y, i, el: P.fx.add(`<g opacity="0">${dustPuff(c, 18)}</g>`) }));
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });

    /* from the flies: the kneading bowl, "=", the mask */
    const hangs = P.hangL;
    const bowlEl = hangs.add(`<g transform="translate(0 -1500)">${[-50, 0, 50].map((x) => `<path d="M${x} -2400L${x * 0.2} -150L${x} -36" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`).join('')}${doughBowl(c, { w: 130 })}</g>`);
    const dough = bowlEl.querySelector('.dough');
    const bubbles = [0, 1, 2, 3, 4].map((i) => ({ i, dx: (i - 2) * 20 + c.rr(-6, 6), el: hangs.add(`<g opacity="0">${bubbleDot(c, 5 + (i % 3))}</g>`) }));
    const eq = hangs.add(`<g transform="translate(0 -1500)">${onString(sheet().p(c.ribbon([[-16, -6], [16, -6]], 6) + c.ribbon([[-16, 7], [16, 7]], 6), C.ochre).out(), 12)}</g>`);
    const maskTag = hangs.add(`<g transform="translate(0 -1500)">${onString(iconTag(c, `<g transform="translate(0 -10)">${mask(c, { r: 22, stick: false })}</g>`, tr('obłuda', 'hypocrisy'), { r: 50, size: 16 }), 56)}</g>`);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      P.update(T);

      /* v1a — the thousands come down every road and press in on one another */
      const press = es(t, 1.45, 1.8);
      const settle = es(t, 2.0, 2.4);
      P.crowd.forEach((g) => {
        const u = es(t, 1.0 + g.d, 1.55 + g.d, (x) => x * (2 - x));
        const [x0, y0] = alongPts(g.path, u);
        const walking = u > 0 && u < 1;
        const jost = press * (1 - settle) * Math.sin(t * 38 + g.i * 1.7) * 5;
        const x = x0 + (JX - x0) * 0.1 * press + jost;
        const y = y0 - (y0 - 560) * 0.05 * press - (walking ? Math.abs(Math.sin(u * 40 + g.i)) * 2 : 0) - Math.abs(jost) * 0.4;
        g.sp.set({ x, y, s: Math.min(1, plainS(y) / g.s), o: seg(t, 0.98 + g.d, 1.04 + g.d) });
      });
      puffs.forEach((p) => {
        const k = bump(t, 1.4 + (p.i % 4) * 0.06, 2.0 + (p.i % 4) * 0.06);
        pose(p.el, { x: p.x + Math.sin(p.i) * 10, y: p.y - k * 10, s: 0.6 + k * 0.6, o: k * 0.9 });
      });

      /* He turns first to His disciples; they close in round Him */
      const toDis = es(t, 1.6, 1.85);
      const warn = es(t, 2.05, 2.3);
      const jArmF = 16 + toDis * 30 * (1 - warn) + warn * 14, jArmB = 8 + toDis * 30 + warn * 112;
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, armF: jArmF, armB: jArmB, head: -toDis * 4 + warn * 4, blink: blinkAt(T) });
      standNear(P, T, (d) => ({ x: d.x - Math.sign(d.dx) * toDis * 12, head: -2 - warn * 6, armF: 14 + (d.i === 1 ? bump(t, 2.3, 2.9) * 30 : 0) }));
      const [hx, hy] = headAt(JX, RISE, P.J.s, false);
      voice(hx, hy, bump(t, 1.6, 2.0) * 0.7 + warn * (1 - es(t, 2.85, 3.0)), T, { spread: 2 });

      /* v1b — the leaven that swells, and it is hypocrisy */
      const bk = es(t, 2.05, 2.35, ease.out);
      hangAt(bowlEl, 620, lerp(-1500, 330, bk), T, 1, 0.7);
      const swell = es(t, 2.25, 2.7);
      pose(dough, { x: 0, y: -34, sx: 1 + swell * 0.12, sy: 1 + swell * 1.3 });
      bubbles.forEach((b) => {
        const k = time ? ((T * 0.4 + b.i / 5) % 1) : (b.i + 1) / 6;
        pose(b.el, { x: 620 + b.dx, y: 330 - 70 - swell * 40 - k * 40, s: 0.6 + k * 0.6, o: swell * (1 - k) });
      });
      const ek = es(t, 2.3, 2.55, ease.out);
      hangAt(eq, 800, lerp(-1500, 300, ek), T, 1.4, 0.8, 1);
      const mk = es(t, 2.38, 2.65, ease.out);
      hangAt(maskTag, 972, lerp(-1500, 316, mk), T, 1.2, 0.7, 2);
      const lift = es(t, 2.45, 2.7);
      phs.forEach((m) => {
        const k = es(t, 1.2 + m.i * 0.08, 1.7 + m.i * 0.08);
        const x = lerp(m.x + 420, m.x, k);
        const a = m.i === 0 ? 20 + lift * 42 : 24 + bump(t, 2.5, 2.95) * 20;
        m.p.set({ x, y: m.y, s: 0.96, flip: true, walk: k > 0 && k < 1 ? x * 0.05 : undefined, o: seg(t, 1.18, 1.24), armF: a, armB: 8, head: m.i === 0 ? 6 : 10, blink: blinkAt(T, m.seed) });
      });
      const m0 = phs[0];
      const [mx, my] = hand(lerp(m0.x + 420, m0.x, es(t, 1.2, 1.7)), m0.y, 0.96, true, 20 + lift * 42);
      const [fx] = headAt(lerp(m0.x + 420, m0.x, es(t, 1.2, 1.7)), m0.y, 0.96, true);
      pose(maskEl, { x: lerp(mx, fx - 24, lift), y: my - 21 * 2.6 * 0.96 * lift - (1 - lift) * 20, s: 0.96, r: (1 - lift) * 60, o: seg(t, 1.18, 1.24) });

      S.cam.z = 1.0 - es(t, 0.9, 1.5) * 0.03 + es(t, 1.7, 2.3) * 0.11;
      S.cam.y = -es(t, 0.9, 1.5) * 10 - es(t, 1.9, 2.4) * 30;
      S.cam.x = es(t, 1.9, 2.4) * 10;
    };
  },
};
