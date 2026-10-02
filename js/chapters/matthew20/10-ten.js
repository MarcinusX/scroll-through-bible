// Mt 20,24–25 — the Ten hear of it and are indignant with the two brothers: frowns, fists, little puffs of steam, while
// James and John hang their heads. Jesus calls them all to him, and they close in round him. "You know that the rulers
// of the nations lord it over them": a picture board is let down — a crowned king high on his stepped seat, his great
// men with rods, and the people bowed low under yokes.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, withFace, faceBits, face, headAt, rulerBoard, hangAt, olive, bush, rock } from './lib.js';

const GY = 684, JX = 790;
export const POS = {
  peter: [650, GY + 6], andrew: [585, GY - 30], philip: [520, GY - 8], bartholomew: [460, GY - 32], matthew: [505, GY + 22], thomas: [580, GY + 26],
  jamesA: [1010, GY - 30], thaddaeus: [1070, GY - 8], simonZ: [1130, GY - 32], judas: [1120, GY + 22],
  james: [940, GY + 8], john: [996, GY + 26],
};
/** a puff of steam (indignation); origin centre */
function puff(c) {
  let d = '';
  for (let i = 0; i < 4; i++) d += c.cut(c.circ(i * 7 - 10, -i * 5, 6 + i, 10), 0.3, 3);
  return `<path d="${d}" fill="${C.cream}" opacity=".9"/>`;
}

export default {
  id: 'mt20-ten',
  beats: [
    { v: 24 },
    { v: 25, text: 'A Jezus przywołał ich do siebie i rzekł:' },
    { v: 25, cont: true, text: '«Wiecie, że władcy narodów uciskają je, a wielcy dają im odczuć swą władzę.' },
  ],
  cam: { x: [-30, 30], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.72, jerX: 1220, farY: 420, roadX: 840, trees: 14, clouds: [[450, 150, 160], [1080, 120, 120]] });
    const back = S.layer({ par: 0.35, sh: 3 });
    back.add(shadeTree(c, 330, 640, 1.1) + olive(c, 1400, 610, 0.9));
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const B = rulerBoard(S, hangL, c);

    const P = S.layer({ par: 0.5, sh: 5 });
    const ORDER = [...TWELVE.filter((d) => d.k !== 'james' && d.k !== 'john'), TWELVE[1], TWELVE[2]];
    // phone: the two groups stand closer to Jesus, so neither is sliced by the edges
    const DIS = ORDER.map((d, i) => { const el = P.add(withFace(person(c, d.o), faceBits(c))); const [x0, y] = POS[d.k]; const x = S.portrait ? JX + (x0 - JX) * 0.8 : x0; return { ...d, i, el, p: S.puppet(el), x, y, seed: c.rr(0, 9), flip: x > JX }; });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const puffs = DIS.map(() => fx.add(`<g><g transform="scale(1.4)">${puff(c)}</g></g>`));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: 0 });
      const angry = es(t, 0.05, 0.3) * (1 - es(t, 1.1, 1.4));
      const gather = es(t, 1.08, 1.6);
      DIS.forEach((d) => {
        const jj = d.k === 'james' || d.k === 'john';
        const x = lerp(d.x, lerp(d.x, JX, 0.2), gather);
        const walking = gather > 0 && gather < 1;
        // the ten turn on the two brothers (who stand on the right)
        const flip = jj ? d.flip : angry > 0.3 ? d.x > (S.portrait ? JX + 170 * 0.8 : 960) : d.flip;
        d.p.set({ x, y: d.y, s: 0.9 + (d.y - GY) / 500, flip, walk: walking ? x * 0.06 + d.i : undefined,
          armF: jj ? 14 : 14 + angry * (40 + (d.i % 3) * 20), armB: jj ? 0 : angry * (d.i % 2 ? 110 : 20),
          head: jj ? angry * 12 : -angry * 4 - es(t, 2.1, 2.4) * 8, lean: jj ? angry * 4 : -angry * 2, blink: blinkAt(T, d.seed) });
        face(d.el, 'angry', jj ? 0 : angry);
        face(d.el, 'sad', jj ? angry : 0);
        const [hx, hy] = headAt(x, d.y, 0.9, flip);
        pose(puffs[d.i], { x: hx + (d.i % 2 ? 24 : -24), y: hy - 34 - (T ? (T * 30) % 20 : 8), o: jj ? 0 : angry * (T ? 0.5 + 0.5 * Math.sin(T * 5 + d.i) : 1) });
      });
      const call = es(t, 1.02, 1.25) * (1 - es(t, 1.85, 2.02));
      const tell = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: GY, s: 1.04, armF: 16 + call * 110 + tell * 40, armB: call * 30 + tell * 60, head: -tell * 6, blink: blinkAt(T) });

      const bd = es(t, 2.04, 2.4, ease.back);
      hangAt(B.el, 800, 110 - (1 - bd) * 1100, T, 0.8, 0.6);
      B.king.set({ x: 0, y: 0, s: 1, armF: 70 + es(t, 2.3, 2.5) * 30, armB: 40, head: -6 });
      B.bowed.forEach((b) => b.set({ x: 0, y: 0, s: 1, lean: 24, head: 20, armF: 70 }));
      B.guards.forEach((g) => g.set({ x: 0, y: 0, s: 1, armF: 60 + es(t, 2.3, 2.5) * 40, armB: 10 }));

      S.cam.z = 1 + es(t, 0.9, 1.5) * 0.05;
      S.cam.y = -es(t, 1.9, 2.3) * 50;
    };
  },
};
