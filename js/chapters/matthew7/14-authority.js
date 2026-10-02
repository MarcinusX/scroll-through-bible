// Mt 7,28–29 — the curtain of the parables lifts and we are back on the mountainside: Jesus has finished, and the
// crowds are amazed — the whole meadow is on its feet, hands raised, and in the front row people put their hands to
// their faces. "He taught them as one who had authority, and not as their scribes": on the side two scribes read
// out from their scrolls and quote their teachers, but nobody is listening to them; the people all turn to Jesus,
// and a quiet light spreads from the knoll where he sits.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, folk, group, manOf, womanOf, scribe, say, smallScroll, radiance, glowDisc, headAt, tr, kf, PI } from './lib.js';

const JX = 800;
const FY = 776;

export default {
  id: 'mt7-authority',
  beats: [
    { v: 28 },
    { v: 29 },
  ],
  cam: { x: [-20, 80], y: [-20, 80], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    /* the crowd on its feet: sprites between the seated rows and Jesus' layer, crossfaded with the rows */
    let ROWS = [];
    const H = mountSet(S, {
      between: (set) => {
        const standL = S.layer({ par: 0.3, sh: 3 });
        ROWS = [[16, 0.3, 14], [42, 0.35, 12], [70, 0.41, 11]].map(([dy, s, n], r) => {
          const out = [];
          for (let i = 0; i < n; i++) {
            const x = 200 + (i + 0.5 + (r % 2) * 0.4) * (1300 / n);
            if (r === 2 && Math.abs(x - JX) < 120) continue;
            const mem = Array.from({ length: 4 }, (_, k) => ({ x: (k - 1.5) * 34 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > JX, o: folk(c) }));
            const y = set.sfn(x) + dy + 12;
            out.push({ x, y, s, sp: standL.sprite(`<g transform="scale(${s})">${groupArms(c, mem, (k) => (k % 2 ? 140 : 70))}</g>`, x, y) });
          }
          return out;
        }).flat();
        return standL;
      },
    });
    const JY = H.JY;
    const seated = H.crowd.L;
    // a quiet light from the knoll, behind the crowd and the Twelve
    const glowEl = H.slopeL.add(`<g><circle r="420" fill="url(#halo-glow)"/></g>`);
    const rad = H.slopeL.add(`<g><circle r="200" fill="url(#halo-glow)"/><g opacity=".55">${radiance(c, 70)}</g></g>`);

    /* the front row, and the scribes on the right */
    const front = S.layer({ par: 0.6, sh: 5 });
    front.add(`<g>${sheet().p(c.ridge(c.wave(FY - 14, [4, 2], [500, 160]), -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.3)).out()}</g>`);
    const FR = [[330, womanOf(c, { robe: C.mauve }), false], [460, manOf(c, { robe: C.ochreRobe }), false], [600, womanOf(c, { robe: C.tealRobe, veil: C.blushVeil }), false], [S.portrait ? 930 : 990, manOf(c, { robe: C.sageRobe }), true]].map(([x, o, flip], i) => ({ x, flip, i, seed: c.rr(0, 9), sit: S.puppet(front.add(person(c, { ...o, pose: 'sit' }))), st: S.puppet(front.add(person(c, o))) }));
    const SCR = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(front.add(person(c, { ...scribe(c, i), holdF: '' }))) }));
    const scrolls = SCR.map(() => front.add(`<g>${smallScroll(c, 64, 42)}</g>`));
    const quotes = [
      front.add(`<g>${say(c, tr(['Starsi', 'uczą…'], ['The elders', 'teach…']), { size: 15, side: -1 })}</g>`),
      front.add(`<g>${say(c, tr(['A rabbi', 'mówił…'], ['But the rabbi', 'said…']), { size: 15, side: S.portrait ? -1 : 1 })}</g>`),     // phone: the second bubble opens to the left, onto the screen
    ];


    return (t, time) => {
      const T = time;
      /* v28 — he has finished; the whole meadow is on its feet */
      const up = es(t, 0.1, 0.18);
      seated.fade(1 - up);
      ROWS.forEach((r, i) => r.sp.set({ x: r.x, y: r.y - es(t, 0.1 + (i % 5) * 0.03, 0.3 + (i % 5) * 0.03) * 4, s: 1, o: up }));
      const awe = es(t, 0.2, 0.4);
      FR.forEach((m) => {
        const st = seg(t, 0.14 + m.i * 0.03, 0.18 + m.i * 0.03);
        const turn = es(t, 1.2, 1.4);
        m.sit.set({ x: m.x, y: FY, s: 0.98, flip: m.flip, armF: 20, o: 1 - st, blink: blinkAt(T, m.seed) });
        m.st.set({ x: m.x, y: FY, s: 0.98, flip: m.flip, armF: 30 + awe * (m.i % 2 ? 130 : 150), armB: 10 + awe * (m.i % 2 ? 60 : 150), head: -awe * 10 + turn * 4, o: st, blink: blinkAt(T, m.seed) });
      });
      const light = es(t, 0.3, 0.6) * 0.6 + es(t, 1.1, 1.5) * 0.4;
      pose(glowEl, { x: JX, y: JY - 180, o: light });
      pose(rad, { x: JX, y: JY - 150, s: 0.8 + light * 0.4, r: T * 3, o: light });
      const bless = es(t, 0.05, 0.3);
      H.pose(t, T, { armF: 30 + bless * 30 + bump(t, 1.1, 1.9) * 20, armB: 10 + bless * 90, head: -bless * 4, blink: blinkAt(T, 1) });
      H.listen(T, (d) => ({ armF: 16 + awe * 40, armB: 8 + awe * (d.i % 2 ? 40 : 90), head: (d.flip ? 3 : -3) - awe * 10, blink: blinkAt(T, d.seed) }));

      /* v29 — the scribes quote their teachers; nobody listens */
      const come = es(t, 1.02, 1.25);
      const read = es(t, 1.2, 1.35);
      SCR.forEach((sc) => {
        const x = lerp(1500 + sc.i * 110, S.portrait ? 1006 + sc.i * 88 : 1120 + sc.i * 116, come);     // phone: both scribes on screen
        sc.p.set({ x, y: FY + 2, s: 0.98, flip: true, walk: come > 0 && come < 1 ? x * 0.06 : undefined, armF: 40 + read * 40, armB: 10 + read * (sc.i ? 70 : 20), head: 8 - read * 4, blink: blinkAt(T, sc.seed) });
        const [hx, hy] = headAt(x, FY + 2, 0.98, true);
        pose(scrolls[sc.i], { x: x - 64, y: FY - 120, r: -8, o: seg(t, 1.0, 1.05) });
        const qk = es(t, 1.3 + sc.i * 0.12, 1.45 + sc.i * 0.12, ease.back);
        pose(quotes[sc.i], { x: hx + (sc.i && !S.portrait ? 6 : -14), y: hy - 14 - sc.i * 34, s: qk * 0.95, o: qk > 0.01 ? 0.92 : 0 });
      });

      S.cam.z = kf(t, [[0, 1.06], [0.8, 1.08], [1.1, 1.04]]);
      S.cam.y = kf(t, [[0, 60], [0.8, 50], [1.1, 40]]);
      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.3, S.portrait ? 70 : 20]]);
    };
  },
};

/** a still group of people with raised arms, drawn as one cut-out */
import { person as P0 } from '../kit.js';
function groupArms(c, members, armB) {
  return members.slice().sort((a, b) => a.y - b.y).map((m, k) => {
    const markup = P0(c, m.o).replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB(k)})">`).replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-(armB(k) > 100 ? 60 : 120)})">`);
    return `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${markup}</g>`;
  }).join('');
}
