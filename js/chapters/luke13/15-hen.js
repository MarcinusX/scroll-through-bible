// Łk 13,34 — evening on the ridge, Jerusalem far off across the valley in the low gold light (Luke's lament is spoken
// on the way, still far from the city). "Jerusalem, Jerusalem!": Jesus stretches out His arms towards it, and a tear
// runs down His cheek. "You kill the prophets and stone those who are sent to you": along the road down to the city
// gate, one after another, heaps of stones rise over the graves of the sent. "How often I wanted to gather your
// children, as a bird gathers her brood under her wings, and you would not": in the grass at His feet a hen spreads
// her wings wide and calls — but the chicks run off the other way, down towards the city, and the wings stay open and
// empty.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { TWELVE } from '../mark3/lib.js';
import { viewSet, VW, still, hen, chick, cairn, withFace, faceBits, face, headAt, along, SUNSET, es, ease, bump, seg, PI } from './lib.js';

const GY = VW.GY, JX = 730;
const HEN = [1010, GY + 8];

export default {
  id: 'lk13-hen',
  beats: [
    { v: 34, text: 'Jeruzalem, Jeruzalem!' },
    { v: 34, cont: true, text: 'Ty zabijasz proroków i kamienujesz tych, którzy do ciebie są posłani.' },
    { v: 34, cont: true, text: 'Ile razy chciałem zgromadzić twoje dzieci, jak ptak swoje pisklęta pod skrzydła, a nie chcieliście.' },
  ],
  cam: { x: [-20, 40], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const V = viewSet(S, { skyCols: SUNSET, sky2: ['#8c7fab', '#dd9c86', '#efc293'], sunAt: [1240, 300] });
    const c = S.c;

    /* the heaps of stones along the road to the city */
    const CAIRN_U = [0.5, 0.62, 0.72, 0.82, 0.9];
    const cairns = CAIRN_U.map((u, i) => {
      const [x, y] = along(V.road, u);
      return { i, x, y: y + 8, s: 0.8 - i * 0.1, el: V.cairnL.add(`<g>${cairn(c, 1)}</g>`) };
    });

    /* the disciples sit behind Him; Jesus; the hen and her chicks */
    const disL = S.layer({ par: 0.4, sh: 4 });
    const dis = disL.sprite(still(c, [0, 1, 2].map((k) => ({ x: -k * 60, y: (k % 2) * 6, s: 0.92, flip: false, head: 6, armF: 30, o: { ...TWELVE[k].o, pose: 'sit' } }))), 560, GY + 4);
    void dis;
    const jEl = V.act.add(withFace(person(c, { ...CAST.jesus }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const H = hen(c);
    const wingB = V.act.add(`<g>${H.wing}</g>`);
    const body = V.act.add(`<g>${H.body}</g>`);
    const wingF = V.act.add(`<g>${H.wing}</g>`);
    // phone: the hen a little smaller and further in, so her open wings stay clear of the progress thread
    const P = S.portrait, HX = P ? 950 : HEN[0], HDX = HX - HEN[0];
    const chicks = Array.from({ length: 7 }, (_, i) => ({ i, el: V.act.add(`<g>${chick(c)}</g>`), x0: 900 + HDX + (i % 4) * (P ? 52 : 60) + (i > 3 ? 30 : 0), y0: GY + 22 + (i % 2) * 12 }));

    return (t, time) => {
      const T = time;
      V.update(T, { sunY: 300 + es(t, 0, 3) * 60 });
      V.sk2.fade(es(t, 0.3, 2.8));

      /* v34a — "Jerusalem, Jerusalem!" arms out to the city, a tear */
      const reach = es(t, 0.08, 0.4);
      const wide = es(t, 2.05, 2.35);
      jesus.set({ x: JX, y: GY, s: 1.06, flip: false, armF: 20 + reach * 70 - wide * 10, armB: 10 + reach * 100 + wide * 20, head: -reach * 6 + es(t, 2.7, 2.95) * 12, blink: blinkAt(T) });
      face(jEl, 'sad', es(t, 0.2, 0.5));
      face(jEl, 'tear', es(t, 0.4, 0.65));

      /* v34b — the stones over the prophets, along the road to the gate */
      cairns.forEach((cn) => {
        const k = es(t, 1.08 + cn.i * 0.1, 1.28 + cn.i * 0.1, ease.back);
        pose(cn.el, { x: cn.x, y: cn.y, s: cn.s * Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
      });

      /* v34c — the hen spreads her wings; the chicks run away */
      const hIn = es(t, 2.0, 2.15);
      const spread = es(t, 2.12, 2.4);
      const S0 = P ? 0.5 : 0.56;
      pose(body, { x: HX, y: HEN[1], s: S0, o: hIn });
      const wr = lerp(70, -22, spread);
      pose(wingF, { x: HX + 44 * S0, y: HEN[1] - 90 * S0, s: S0, r: wr, o: hIn });
      pose(wingB, { x: HX - 44 * S0, y: HEN[1] - 90 * S0, sx: -S0, sy: S0, r: -wr, o: hIn });
      const away = es(t, 2.4, 2.9);
      chicks.forEach((ch) => {
        const tx = 1330 + ch.i * 46, ty = GY + 4 + (ch.i % 3) * 8;
        const x = lerp(ch.x0, tx, away), y = lerp(ch.y0, ty, away);
        const run = away > 0.02 && away < 0.98;
        pose(ch.el, { x, y: y - (run ? Math.abs(Math.sin(t * 60 + ch.i)) * 4 : 0), s: lerp(1.0, 0.8, away), sx: away > 0.02 ? 1 : (ch.i % 2 ? 1 : -1), o: es(t, 2.05, 2.2) });
      });

      S.cam.x = 20;
      S.cam.y = 10;
      S.cam.z = 1.04 + es(t, 1.0, 1.4) * 0.03 * (1 - es(t, 2.0, 2.3));
      void seg; void bump; void mix; void shade; void sheet; void lerp; void headAt; void PI;
    };
  },
};
