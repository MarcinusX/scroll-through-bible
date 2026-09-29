// Mt 14,12b–13a — back in colour, on the beach at Capernaum. John's disciples come from the town, bow, and tell
// Jesus (a candle just gone out, in their words); He bows His head. Then He goes down to the boat with the four and
// they sail away across the lake, "to a deserted place, apart".
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { boat } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, speech, johnsOpts, capShore, labelTag, snuffedCandle, DAY, tr, PI } from './lib.js';

const FEET = 716;
const BX = 470, BY = 668;      // the moored boat (layer par 0.36)

export default {
  id: 'mt14-told',
  beats: [
    { v: 12, cont: true, text: 'potem poszli i donieśli o tym Jezusowi.' },
    { v: 13, text: 'Gdy Jezus to usłyszał, oddalił się stamtąd w łodzi na miejsce pustynne, osobno.' },
  ],
  cam: { x: [-80, 40], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = capShore(S, { skyCols: DAY, sunAt: [1230, 160], beachY: 650 });

    /* the boat at the water's edge, the four already aboard */
    const boatL = S.layer({ par: 0.36, sh: 5 });
    const B = boat(c, { mast: true });
    const CREW = [[-60, CAST.andrew], [0, CAST.peter], [60, CAST.james], [112, CAST.john]];
    const boatG = boatL.add(`<g><g>${B.back}</g>${CREW.map(([x, o], i) => `<g data-k="cr${i}"><g transform="translate(${x} -8) scale(.94)">${person(c, o)}</g></g>`).join('')}<g data-k="jb"><g transform="translate(-126 -10) scale(.98)">${person(c, { ...CAST.jesus })}</g></g><g>${B.front}</g></g>`);
    const jb = S.$('jb');
    const wake = boatL.add(`<path d="${c.ribbon([[0, 0], [60, 3], [150, 1]], (u) => 6 - u * 5)}" fill="${C.foam}" opacity=".8"/>`);
    const place = hanging(set.hangL, `<g transform="scale(1.1)">${labelTag(tr('miejsce pustynne, osobno', 'a deserted place, apart'), 20)}</g>`, { x: 0, y: 0, len: 700 });

    /* on the beach: Jesus, and John's disciples coming from the town */
    const act = S.layer({ par: 0.45, sh: 5 });
    const JD = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, johnsOpts(c)))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.5, sh: 4 });
    const news = fx.add(`<g>${speech(c, `<g transform="translate(0 14) scale(1.1)">${snuffedCandle(c, 26)}</g>`, { w: 62, h: 74, flip: true })}</g>`);
    const grief = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`);

    const JK = [[1.02, 820], [1.25, BX + 60]];
    return (t, time) => {
      const T = time;
      set.update(T);

      /* v12b — they come and tell Jesus */
      JD.forEach((d) => {
        const k = es(t, -0.2 + d.i * 0.08, 0.35 + d.i * 0.06);
        const x = lerp(1500 + d.i * 90, 960 + d.i * 70, k);
        const bow = es(t, 0.4, 0.55) * (1 - es(t, 1.5, 1.8));
        const tell = d.i === 0 ? bump(t, 0.35, 0.98) : 0;
        d.p.set({ x, y: FEET + (d.i % 2) * 8, s: 0.92, flip: true, walk: k > 0 && k < 1 ? x * 0.06 + d.i : undefined, armF: 20 + tell * 70, armB: tell * 30, head: bow * 16, lean: bow * 6, blink: blinkAt(T, d.seed) });
      });
      const nk = es(t, 0.42, 0.58, ease.back) * (1 - es(t, 0.95, 1.05));
      const [dx, dy] = headAt(960, FEET, 0.92, true);
      pose(news, { x: dx - 16, y: dy - 22, s: nk, o: nk > 0.01 ? 1 : 0 });

      /* Jesus hears; bows His head — then goes down to the boat */
      const jx = kf(t, JK);
      const heard = es(t, 0.5, 0.7) * (1 - es(t, 1.0, 1.1));
      const aboard = es(t, 1.25, 1.3);
      jesus.set({ x: jx, y: FEET - 6, s: 1.02, flip: t > 1.0, o: 1 - aboard, walk: moving(t, JK) ? jx * 0.06 : undefined, armF: 20 + heard * 60, armB: heard * 30, head: heard * 18, blink: heard > 0.5 ? 0 : blinkAt(T) });
      pose(grief, { x: 810, y: FEET - 170, s: 0.8, o: heard * 0.5 });

      /* v13a — away in the boat, to a deserted place */
      const sail = es(t, 1.3, 1.9, (u) => u * (0.6 + 0.4 * u));
      const bx = lerp(BX, 600, sail), by = lerp(BY, 545, sail), bs = lerp(0.72, 0.36, sail);
      pose(boatG, { x: bx, y: by + Math.sin(T * 1.4) * 2, s: bs, r: Math.sin(T * 1.1) * 0.8 });
      pose(jb, { o: aboard });
      pose(wake, { x: bx + 150 * bs, y: by + 2, s: bs * 1.4, o: sail > 0.02 && sail < 0.98 ? 0.8 : 0 });
      const pk = es(t, 1.2, 1.5, ease.back);
      pose(place, { x: 720, y: lerp(-500, 220, pk), r: Math.sin(T * 1.1) * 2, o: pk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 20], [1.0, 20], [1.6, -40]]);
      S.cam.z = kf(t, [[0, 1.08], [0.6, 1.1], [1.1, 1.06], [1.8, 1.02]]);
      S.cam.y = kf(t, [[0, 30], [2, 20]]);
    };
  },
};
