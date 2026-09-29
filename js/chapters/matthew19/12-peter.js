// Mt 19,27 — Peter steps out from among the Twelve: "Look, we have left everything and followed You" — behind him a
// sepia card swings down: the lake, the boat, the nets, the house by the shore, all left behind. "What then shall we
// have?" He opens his empty hands; the others lean in to hear the answer.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, say, qmark, memoryCard, pose3, footprint, tr } from './lib.js';

const GY = 672;
const JX = 760, PX = 900;

export default {
  id: 'mt19-peter',
  beats: [
    { v: 27, text: 'Wtedy Piotr rzekł do Niego: «Oto my opuściliśmy wszystko i poszliśmy za Tobą,' },
    { v: 27, cont: true, text: 'cóż więc otrzymamy?»' },
  ],
  cam: { x: [-20, 40], y: [-30, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.3, jerX: 1190, roadX: 820, trees: 16, clouds: [[470, 140, 160], [1080, 110, 110]] });
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1420, 606, 0.9));

    const hangL = S.layer({ par: 0.3, sh: 5 });
    const b = boat(c, { mast: true });
    const memory = hanging(hangL, `<g>${memoryCard(c, b.back + b.front)}</g>`, { x: 1040, y: 130, len: 800 });
    const q = hangL.add(`<g opacity="0"><g transform="scale(1.6)">${qmark(c)}</g></g>`);

    /* the Twelve: two still groups behind, Peter in front */
    const backL = S.layer({ par: 0.45, sh: 4 });
    const L = [1, 3, 5, 9, 11].map((k, i) => ({ x: -110 + i * 55, y: (i % 2) * 14, s: 0.8 - (i % 2 ? 0 : 0.04), flip: false, head: -4, armF: 10, o: TWELVE[k].o }));
    const Rr = [2, 4, 6, 7, 8, 10].map((k, i) => ({ x: -130 + i * 52, y: (i % 2) * 14, s: 0.8 - (i % 2 ? 0 : 0.04), flip: true, head: -4, armF: 10, o: TWELVE[k].o }));
    const leftG = backL.sprite(pose3(c, L), 560, GY - 34);
    const rightG = backL.sprite(pose3(c, Rr), 1120, GY - 34);
    const leanL = backL.sprite(pose3(c, L.map((m) => ({ ...m, head: 6, armF: 30 }))), 560, GY - 34);
    const leanR = backL.sprite(pose3(c, Rr.map((m) => ({ ...m, head: 6, armF: 30 }))), 1120, GY - 34);

    const pL = S.layer({ par: 0.5, sh: 5 });
    const prints = Array.from({ length: 6 }, (_, i) => pL.add(`<g opacity="0">${footprint(c, i % 2 === 0)}</g>`));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const peter = S.puppet(pL.add(person(c, TWELVE[0].o)));
    const wordL = S.layer({ par: 0.5, sh: 6 });
    const left = wordL.add(`<g opacity="0">${say(c, tr(['Oto my opuściliśmy wszystko', 'i poszliśmy za Tobą!'], ['We have left everything', 'and followed you!']), { size: 18, side: 1 })}</g>`);
    const what = wordL.add(`<g opacity="0">${say(c, tr(['Cóż więc', 'otrzymamy?'], ['What then', 'will we have?']), { size: 20, side: 1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 2) * 12 });

      /* beat 0: Peter steps out — we have left everything and followed You */
      const step = es(t, -0.1, 0.35);
      const px = lerp(PX + 110, PX, step);
      const back = bump(t, 0.3, 0.75);
      const open = es(t, 1.02, 1.25);
      peter.set({ x: px, y: GY, s: 0.98, flip: back < 0.5, walk: step > 0 && step < 1 ? px * 0.08 : undefined, armF: 16 + back * 60 * 0 + es(t, 0.7, 0.9) * (1 - open) * 50 + open * 70, armB: back * 90 + open * 60, head: -3 - open * 4, blink: blinkAt(T, 3) });
      pose(left, { x: PX - 20, y: GY - 206, s: es(t, 0.05, 0.3, ease.back), o: t > 0.05 && t < 1.05 ? 1 - es(t, 0.92, 1.05) : 0 });
      pose(what, { x: PX - 20, y: GY - 206, s: es(t, 1.02, 1.25, ease.back), o: t > 1.02 ? 1 : 0 });
      const mem = es(t, 0.15, 0.5, ease.back);
      swing(memory, 1040, 130 - (1 - mem) * 1100, T, 1, 0.7, 1);
      pose(q, { x: 1040, y: 330 - es(t, 1.1, 1.4) * 20, s: es(t, 1.1, 1.35, ease.back), r: Math.sin(T) * 6, o: t > 1.1 ? 1 : 0 });
      prints.forEach((p, i) => pose(p, { x: JX + 30 + i * 30, y: GY + 20 + (i % 2) * 8, s: 0.6, o: es(t, 0.45 + i * 0.05, 0.6 + i * 0.05) * 0.5 }));

      const lean = es(t, 1.1, 1.18);
      leftG.set({ o: 1 - lean }); rightG.set({ o: 1 - lean });
      leanL.set({ o: lean }); leanR.set({ o: lean });
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 18 + es(t, 1.4, 1.7) * 20, head: -2 - es(t, 0.1, 0.4) * 3 + Math.sin(T * 0.6), blink: blinkAt(T) });

      S.cam.z = 1 + es(t, 0.2, 0.8) * 0.05;
      S.cam.x = es(t, 0.2, 0.8) * 30;
      S.cam.y = -es(t, 0.2, 0.8) * 16;
    };
  },
};
