// J 14,1 — the curtains open on the upper room at night, after Judas has gone out: the Eleven at the long table,
// his cushion empty; the lamps burn low and over every head hangs a small grey storm cloud. "Let not your hearts
// be troubled": He lifts His hand, a ring of calm goes out from Him and the clouds melt away one by one, from the
// middle outwards. "Believe in God": a light kindles above the room and a beam comes down onto Him; "believe also
// in Me": golden threads run from Him to each of them and a small flame kindles on every heart.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, worryCloud, soulLight, radiance, glowDisc, arcThreads,
  nameTag, hanging, swing, kf, vis, headAt, tr, PI,
} from './lib.js';

export default {
  id: 'j14-hearts',
  beats: [
    { cover: true },
    { v: 1, text: 'Niech się nie trwoży serce wasze.' },
    { v: 1, cont: true, text: 'Wierzycie w Boga? I we Mnie wierzcie!' },
  ],
  cam: { x: [-40, 40], y: [-80, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const R = nightRoom(S);
    const { SEAT, TOP, FLOOR } = R;

    // the light above (never a figure) and its beam
    const hi = S.layer({ par: 0.33, sh: 0, flat: true });
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".0"/><stop offset=".2" stop-color="#fff6dc" stop-opacity=".6"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>`);
    const beam = hi.add(`<g><path d="${c.poly([[760, 230], [840, 230], [930, TOP + 10], [670, TOP + 10]])}" fill="url(#${gid})"/></g>`);
    const lightL = S.layer({ par: 0.34, sh: 3 });
    const above = lightL.add(`<g>${glowDisc(190, 'halo-glow', 0.9)}<g transform="scale(.42)">${radiance(c, 150)}</g></g>`);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    const J = at.find((m) => m.k === 'jesus');
    seatL.add(`<g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g>`);
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);

    // golden threads and the small flames on the hearts
    const thrL = S.layer({ par: 0.56, sh: 0, flat: true });
    const others = at.filter((m) => m.k !== 'jesus');
    const setThread = arcThreads(thrL, others.length, { w: 1.8 });
    const fx = S.layer({ par: 0.58, sh: 4 });
    const flames = others.map(() => fx.add(`<g>${soulLight(c, 9)}</g>`));
    const ring = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 100, 100, 0, PI * 2, 40), 4)}" fill="${C.halo}"/></g>`);
    const clouds = others.map((m) => ({ m, el: fx.add(`<g>${worryCloud(c, 58)}</g>`), d: Math.abs(m.x - 800) }));
    const tagL = S.layer({ par: 0.3, sh: 4 });
    const tag = hanging(tagL, nameTag(c, tr('Wieczernik', 'The upper room'), { size: 18 }), { x: 800, y: 240, len: 600 });
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      R.update(T, 0.7 + es(t, 1.1, 1.8) * 0.3);
      const k1 = es(t, 1.1, 1.7);                   // calm
      const god = es(t, 2.05, 2.4), me = es(t, 2.45, 2.85);
      // the tag hangs during the cover, then flies out
      const tg = es(t, 0.3, 0.8, ease.out) * (1 - es(t, 1.0, 1.3, ease.in));
      swing(tag, 800, 250 - (1 - tg) * 600, tg > 0.001 ? T : 0, 1.2, 0.8); fade(tag, tg > 0.001 ? 1 : 0);

      /* the light above and the beam (believe in God) */
      vis(above, { x: 800, y: 250, s: 0.5 + god * 0.5 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: god });
      fade(beam, god * (1 - me * 0.3));

      /* people */
      at.forEach((m) => {
        if (m.k === 'jesus') {
          const lift = bump(t, 1.08, 1.95);
          sitAt(m, SEAT, T, { armF: 30 + lift * 40 + me * 30, armB: 16 + lift * 100 + god * (1 - me) * 60, head: -god * (1 - me) * 10 + me * 4 });
          return;
        }
        const d = Math.abs(m.x - 800);
        const calm = es(t, 1.15 + d * 0.0012, 1.35 + d * 0.0012);
        fade(m.sad, 1 - calm);
        const look = god * (1 - me);
        sitAt(m, SEAT, T, { armF: 30 + me * 10, armB: 12, head: 10 * (1 - calm) - look * 12 + me * 2, lean: (1 - calm) * 2 });
      });

      /* the troubled clouds tremble, then melt away from the middle outwards */
      clouds.forEach(({ m, el, d }, i) => {
        const gone = es(t, 1.15 + d * 0.0012, 1.4 + d * 0.0012);
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        const tremble = (1 - gone) * Math.sin(t * 40 + i * 2) * 1.6;
        vis(el, { x: hx + tremble, y: hy - 30 - gone * 40, s: (0.9 + (i % 3) * 0.08) * (1 - gone * 0.5), o: (1 - gone) * es(t, 0.2, 0.6) });
      });
      // the ring of calm goes out from Him
      const rk = seg(t, 1.1, 1.6);
      vis(ring, { x: 800, y: 560, s: 0.4 + rk * 4.2, sy: 0.4, o: rk > 0 && rk < 1 ? (1 - rk) * 0.8 : 0 });

      /* believe also in Me: threads to their hearts, a small flame on each */
      others.forEach((m, i) => {
        const d = Math.abs(m.x - 800);
        const k = es(t, 2.45 + d * 0.0005, 2.7 + d * 0.0005);
        const hx = m.x + (m.flip ? -4 : 4), hy = SEAT - 70 * m.s;
        setThread(i, 800, 624, lerp(800, hx, k), lerp(624, hy, k), -(8 + d * 0.05), k * 0.85);
        vis(flames[i], { x: hx, y: hy + (T ? Math.sin(T * 2 + i) * 1.2 : 0), s: es(t, 2.6 + d * 0.0005, 2.8 + d * 0.0005, ease.back), o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [1, 10], [1.8, 40], [2.1, -40], [2.5, -20], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [1.8, 1.14], [2.2, 1.04], [3, 1.06]]);
    };
  },
};
