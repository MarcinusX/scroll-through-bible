// Mt 23,1–2 — the curtains open on the Temple court of Mark 12: the crowd sits on the steps of Solomon's porch. Jesus
// comes in with His disciples and speaks, first to the crowds, then to His own. Beside the stairs stands an empty seat
// of carved stone, the tablets of the Law on its high back: the seat of Moses. A scribe and a Pharisee stroll over,
// climb the dais and sit down on it side by side, chins up — "the scribes and the Pharisees sit on Moses' seat".
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { templeCourt, voiceRings, kf, moving, nameTag, pose3, mosesSeat, vain, PH, SC, folk, TWELVE, tr } from './lib.js';

const JX = 760;
const SX = 1045;                 // the seat of Moses

export default {
  id: 'mt23-seat',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-20, 50], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    /* the crowd sitting on the steps of the porch, and a few standing (still sheets) */
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitRow = (x0, n, flip) => pose3(c, Array.from({ length: n }, (_, i) => ({ x: x0 + i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66 * c.rr(0.94, 1.05), flip, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } })));
    stepL.sprite(sitRow(0, 5, false), 400, 604);
    stepL.sprite(sitRow(0, 4, true), 1000, 604);
    stepL.sprite(pose3(c, Array.from({ length: 3 }, (_, i) => ({ x: i * 56, y: (i % 2) * 8, s: 0.74, flip: false, head: -4, o: folk(c) }))), 240, 616);

    /* the seat of Moses, empty at first */
    const people = S.layer({ par: 0.5, sh: 5 });
    people.add(`<g transform="translate(${SX} ${F + 4})">${mosesSeat(c)}</g>`);
    const tag = hanging(people, nameTag(c, tr('katedra Mojżesza', 'Moses’ seat'), { size: 17 }), { x: SX, y: -500, len: 900 });

    /* the standing crowd on the right */
    people.add(`<g>${pose3(c, Array.from({ length: 4 }, (_, i) => ({ x: 1300 + i * 56 + c.rr(-6, 6), y: F + 10 + (i % 2) * 10, s: 0.84, flip: true, head: -4, armF: c.rr(0, 16), o: folk(c) })))}</g>`);

    /* the scribe and the Pharisee: walking, then sitting on the seat */
    const pair = [SC, PH].map((o, i) => ({
      i,
      w: S.puppet(people.add(vain(c, o))),
      s: S.puppet(people.add(vain(c, o, { pose: 'sit' }))),
      seed: c.rr(0, 9),
    }));

    /* Jesus and the disciples */
    const dis = [TWELVE[2].o, TWELVE[0].o, TWELVE[1].o, TWELVE[3].o, TWELVE[6].o].map((o, i) => ({ p: S.puppet(people.add(person(c, o))), x: 610 - i * 58, y: F + 10 + (i % 2) * 10, i }));
    const jesus = S.puppet(people.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(people, c, { n: 3, r: 26, w: 4 });

    set.front();
    const cur = curtains(S);

    const jKeys = [[0.1, 240], [0.95, JX]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.8), T);
      set.update(t, T);

      /* cover: Jesus walks in, the disciples behind Him */
      const jx = kf(t, jKeys, ease.out);
      const walking = moving(t, jKeys);
      /* v1: He speaks — first to the crowds (right), then to His disciples (left) */
      const speak = es(t, 1.05, 1.3);
      const toDis = es(t, 1.5, 1.62);
      /* v2: He shows them the seat */
      const show = es(t, 2.05, 2.3);
      jesus.set({
        x: jx, y: F, s: 1.04, walk: walking ? jx * 0.05 : undefined, blink: blinkAt(T),
        flip: toDis > 0.5 && show < 0.5,
        armF: speak * (60 + (T ? Math.sin(T * 1.4) * 6 : 0)) * (1 - show) + show * 80, armB: speak * 50 * (1 - show) + show * 20,
        head: -speak * 4 + show * 4,
      });
      const hdir = toDis > 0.5 && show < 0.5 ? -1 : 1;
      voice(jx + 28 * hdir, F - 180, speak * (1 - es(t, 2.6, 2.9)), T, { dir: hdir });
      dis.forEach((d) => {
        const x = Math.min(d.x, jx - 150 - d.i * 58);
        d.p.set({ x, y: d.y, s: 0.92, walk: walking && x < d.x ? x * 0.05 + d.i : undefined, blink: blinkAt(T, d.i + 2), head: -speak * 4 + toDis * 6 * (1 - show) });
      });

      /* v2: the scribe and the Pharisee stroll to the seat, climb it and sit down */
      pair.forEach((p) => {
        const start = 1215 + p.i * 70, seatX = SX - 44 + p.i * 88;
        const k = es(t, 2.02 + p.i * 0.04, 2.42 + p.i * 0.04);
        const x = lerp(start, seatX, k);
        const up = es(t, 2.36 + p.i * 0.04, 2.46 + p.i * 0.04);
        const sat = es(t, 2.46 + p.i * 0.04, 2.52 + p.i * 0.04);
        const proud = es(t, 2.5, 2.7);
        p.w.set({ x, y: F + 6 - up * 38, s: 0.9, flip: true, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 30 + p.i * 10, armB: 20, head: -4 - proud * 6, o: 1 - sat, blink: blinkAt(T, p.seed) });
        p.s.set({ x: seatX, y: F - 90, s: 0.9, flip: true, armF: 40 - p.i * 10, armB: 10 + p.i * 30, head: -proud * 14, lean: -proud * 4, o: sat, blink: blinkAt(T, p.seed) });
      });
      const tk = es(t, 2.35, 2.7, ease.out);
      pose(tag, { x: SX, y: lerp(-500, F - 330, tk), r: T ? Math.sin(T * 0.9) * 2 : 0, o: tk > 0.01 ? 1 : 0 });

      S.cam.x = es(t, 1.9, 2.4) * 40;
      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.03 + es(t, 1.9, 2.4) * 0.04;
      S.cam.y = -es(t, 0.8, 1.6) * 16;
    };
  },
};
