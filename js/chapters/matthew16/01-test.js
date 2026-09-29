// Mt 16,1 — the curtains open on the beach of Magadan: the boat drawn up, Jesus with Peter, Andrew and John on the
// sand. Pharisees come along the shore from the right, and Sadducees behind them (their names come down on tags).
// Testing Him, they point to the sky: the dark flat of "heaven" is let down on its lines with a big question mark —
// show us a sign from heaven.
import { C, person, CAST, blinkAt, pose, lerp, hanging, curtains } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, moving, speech, GLYPH, wordSlip, pharisee, sadducee, heavenPanel, bigQuestion, tag, headAt, hangAt, magadan, magadanFront, MG, tr } from './lib.js';

const GY = MG.GY, JX = 800;
const DIS = [{ o: CAST.peter, x: 660 }, { o: CAST.andrew, x: 596 }, { o: CAST.john, x: 540 }];
// the testers: three Pharisees, then two Sadducees
const TEST = [0, 1, 2, 3, 4].map((i) => ({ i, sad: i >= 3, x: 922 + i * 54 + (i >= 3 ? 20 : 0), from: 1560 + i * 90, y: GY - 6 + (i % 2) * 10 }));

export default {
  id: 'mt16-test',
  beats: [
    { cover: true },
    { v: 1, text: 'Przystąpili do Niego faryzeusze i saduceusze' },
    { v: 1, cont: true, text: 'i wystawiając Go na próbę, prosili o ukazanie im znaku z nieba.' },
  ],
  cam: { x: [-40, 60], y: [-80, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const M = magadan(S);

    /* ---------- the flat of heaven, up in the flies ---------- */
    const heavL = S.layer({ par: 0.06, sh: 8 });
    const heav = heavL.add(`<g>${heavenPanel(c, 440, 250)}<g transform="translate(0 125)">${bigQuestion(c, 58, C.halo)}</g><path d="M-190 0V-1400M190 0V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/></g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const test = TEST.map((m) => ({ ...m, p: S.puppet(P.add(person(c, m.sad ? sadducee(m.i - 3) : pharisee(m.i)))), seed: c.rr(0, 9) }));

    /* ---------- tags and words ---------- */
    const fx = S.layer({ par: 0.5, sh: 4 });
    const tagPh = hanging(fx, tag(c, tr('faryzeusze', 'Pharisees'), { size: 20 }), { x: 0, y: 0, len: 900 });
    const tagSa = hanging(fx, tag(c, tr('saduceusze', 'Sadducees'), { size: 20, fill: C.linen2 }), { x: 0, y: 0, len: 900 });
    const whisper = fx.add(`<g>${speech(c, `<g transform="scale(.8)">${wordSlip(c, 30)}</g>`, { w: 50, h: 36, flip: true })}</g>`);
    const demands = [0, 2, 4].map((i, j) => ({ i, el: fx.add(`<g>${speech(c, j === 1 ? GLYPH.bang(c) : GLYPH.q(c), { w: 40, h: 40, flip: true })}</g>`) }));

    magadanFront(S);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      M.update(T);

      /* the flat of heaven comes down on the demand */
      const down = es(t, 2.12, 2.6, ease.back);
      hangAt(heav, 800, 116 - (1 - down) * 700, T, 0.7, 0.6, 1);

      /* Jesus on the beach: blessing at the cover, then turning to meet them */
      const meet = es(t, 1.3, 1.6);
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: 16 + bump(t, 0.4, 1.0) * 30 + meet * 20 + bump(t, 2.1, 2.9) * 10, armB: 8 + bump(t, 0.4, 1.0) * 70, head: -bump(t, 2.5, 3) * 8, blink: blinkAt(T) });
      dis.forEach((d) => {
        const look = es(t, 1.2, 1.5);
        const up = es(t, 2.3, 2.6);
        d.p.set({ x: d.x, y: GY + 4 + (d.i % 2) * 8, s: 0.9, flip: false, armF: 16 + look * 20 + up * (d.i === 0 ? 40 : 10), armB: 8 + up * (d.i === 1 ? 90 : 0), head: -look * 4 - up * 14, blink: blinkAt(T, d.seed) });
      });

      /* v1a — they come along the shore; v1b — they test Him and point to the sky */
      test.forEach((m) => {
        const keys = [[1.02 + m.i * 0.07, m.from], [1.6 + m.i * 0.06, m.x]];
        const x = kf(t, keys, ease.out);
        const w = moving(t, keys, 1);
        const demand = es(t, 2.08 + (m.i % 3) * 0.04, 2.3 + (m.i % 3) * 0.04);
        const sly = m.i === 1 ? bump(t, 2.02, 2.5) : 0;
        m.p.set({
          x: x - sly * 20, y: m.y, s: 0.94, flip: m.i === 2 ? sly < 0.3 : true, walk: w ? x * 0.05 : undefined,
          armF: 16 + demand * (m.i % 2 ? 50 : 80) + sly * 30, armB: 8 + demand * (m.i % 2 ? 100 : 155),
          head: -demand * 18 + sly * 10, blink: blinkAt(T, m.seed),
        });
      });
      // the name tags
      const tp = es(t, 1.35, 1.7, ease.out) * (1 - es(t, 2.05, 2.3));
      const ts = es(t, 1.5, 1.85, ease.out) * (1 - es(t, 2.05, 2.3));
      pose(tagPh, { x: TEST[1].x, y: lerp(-700, 300, tp), r: Math.sin(T * 1.2) * 1.5, o: tp > 0.01 ? 1 : 0 });
      pose(tagSa, { x: (TEST[3].x + TEST[4].x) / 2, y: lerp(-700, 330, ts), r: Math.sin(T * 1.2 + 1) * 1.5, o: ts > 0.01 ? 1 : 0 });
      // a whisper between them: "let us test Him"
      const wh = bump(t, 2.05, 2.45);
      const [whx, why] = headAt(TEST[2].x, TEST[2].y, 0.94, false);
      pose(whisper, { x: whx + 14, y: why - 24, s: wh, o: wh > 0.02 ? 1 : 0 });
      demands.forEach((d, j) => {
        const k = es(t, 2.35 + j * 0.08, 2.5 + j * 0.08, ease.back);
        const m = TEST[d.i];
        const [mx, my] = headAt(m.x, m.y, 0.94, true);
        pose(d.el, { x: mx - 30, y: my - 40, s: k * 0.9, r: T ? Math.sin(T * 3 + j) * 5 : 0, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = es(t, 1.0, 1.7) * 50;
      S.cam.z = 1.02 + es(t, 0.3, 0.9) * 0.06 - es(t, 2.0, 2.4) * 0.06;
      S.cam.y = 20 - es(t, 2.0, 2.4) * 80;
    };
  },
};
