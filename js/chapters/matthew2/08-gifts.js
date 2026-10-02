// Mt 2,11 — inside the house the star's light falls through the window on the Child in His mother's lap. The Magi
// come in through the door and see Him with Mary; they fall down and worship Him. Then they open their treasures:
// a casket of gold, a censer of frankincense that sends up its smoke, a jar of myrrh.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, attr } from '../../core/anim.js';
import {
  LOOK, FLOOR, roomSet, magus, childPerson, casket, incenseBox, smokeCurl, myrrhJar, bigStar, beamGrad, placeTag,
  hangAt, vpose, kf, moving, flicker, sparkle, tr, PI,
} from './lib.js';

const MY = 660;                 // Mary
const KX0 = [950, 1060, 1170];  // where the Magi kneel
const KXP = [915, 1000, 1085];  // phone: inside the frame
const GX = [790, 860, 920];     // the gifts

export default {
  id: 'mt2-gifts',
  beats: [
    { v: 11, text: 'Weszli do domu i zobaczyli Dziecię z Matką Jego, Maryją;' },
    { v: 11, cont: true, text: 'upadli na twarz i oddali Mu pokłon.' },
    { v: 11, cont: true, text: 'I otworzywszy swe skarby, ofiarowali Mu dary: złoto, kadzidło i mirrę.' },
  ],
  cam: { x: [-20, 100], y: [0, 80], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const KX = S.portrait ? KXP : KX0;
    const room = roomSet(S, { night: true, bench: false, doorX: S.portrait ? 1060 : 1200 });   // phone: the door whole behind the Magi, not a dark strip at the edge
    const starEl = hanging(room.out, bigStar(c, 12), { x: 0, y: 0, len: 600 });

    /* the light of the star through the window */
    const lightL = S.layer({ par: 0.35, sh: 0, flat: true });
    const bid = beamGrad(S, 'beam');
    const beam = lightL.add(`<g><path d="M-30 0L30 0L130 300L-50 300Z" fill="url(#${bid})"/><ellipse cx="40" cy="300" rx="120" ry="24" fill="#fff3cf" opacity=".3"/></g>`);

    /* Mary on her cushion with the Child on her lap */
    const P = S.layer({ par: 0.45, sh: 5 });
    P.add(sheet().p(c.cut(c.blob(MY + 6, FLOOR + 4, 80, 13, 12, 0.1), 0.4, 5), mix(C.jesusMantle, C.clay, 0.3)).out());
    const mary = S.puppet(P.add(person(c, { ...LOOK.mary, pose: 'sit' })));
    const child = S.puppet(P.add(childPerson(c, { ...LOOK.child, pose: 'sit' })));

    /* the gifts */
    const G = S.layer({ par: 0.45, sh: 4 });
    const gold = casket(c, { w: 40, h: 24 });
    const goldB = G.add(`<g>${gold.base}</g>`);
    const goldL = G.add(`<g>${gold.lid}</g>`);
    const censer = G.add(`<g>${incenseBox(c, 34)}</g>`);
    const jar = G.add(`<g>${myrrhJar(c, 50)}</g>`);
    const smoke = [0, 1, 2].map((i) => G.add(`<g>${smokeCurl(c, 110, i % 2 ? C.lavender : mix(C.cream, C.lavender, 0.5))}</g>`));
    const glints = [0, 1, 2, 3].map(() => G.add(`<g>${sparkle(c, 9)}</g>`));

    /* the Magi */
    const M = S.layer({ par: 0.5, sh: 5 });
    const magi = [0, 1, 2].map((i) => ({ i, st: S.puppet(M.add(magus(c, i))), kn: S.puppet(M.add(magus(c, i, { pose: 'kneel' }))), seed: c.rr(0, 9) }));

    const X = S.layer({ par: 0.4, sh: 5 });
    const tags = [tr('złoto', 'gold'), tr('kadzidło', 'frankincense'), tr('mirra', 'myrrh')].map((w, i) => hanging(X, placeTag(c, w, 17), { x: 0, y: 0, len: 600 }));
    const tagM = hanging(X, placeTag(c, tr('Dziecię z Matką, Maryją', 'the Child with Mary, His mother'), 18), { x: 0, y: 0, len: 600 });

    return (t, time) => {
      const T = time;
      flicker(room.lamp, T);
      hangAt(starEl, 590, 330, T, 1, 1, 0.6, 0);
      vpose(beam, { x: 580, y: 420, o: 0.75 });

      /* Mary and the Child */
      const bless = es(t, 2.3, 2.6);
      mary.set({ x: MY, y: FLOOR + 4, s: 1.14, armF: 46, armB: 30, head: 8 - es(t, 0.5, 0.8) * 8, blink: blinkAt(T, 1) });
      child.set({ x: MY + 42, y: FLOOR - 34, s: 0.53, armF: 20 + bump(t, 0.6, 1.2) * 30 + bless * 40, armB: 10 + bless * 110, head: -4, blink: blinkAt(T, 2) });
      const mk = es(t, 0.45, 0.75, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      hangAt(tagM, 760, lerp(-500, 330, mk), T, mk > 0.001 ? 1 : 0, 1.2, 0.9, 1);

      /* v11a — they come in through the door; v11b — they fall down and worship */
      const kneel = es(t, 1.05, 1.12);
      const bow = es(t, 1.12, 1.5) * (1 - es(t, 2.0, 2.3));
      magi.forEach((m) => {
        const k = es(t, -0.1 + m.i * 0.12, 0.55 + m.i * 0.12, ease.out);
        const x = lerp(1300 + m.i * 60, KX[m.i] + 20, k);
        const wonder = es(t, 0.6, 0.9);
        m.st.set({ x, y: FLOOR + 6 + m.i * 3, s: 1.04, flip: true, walk: k > 0 && k < 1 ? x * 0.06 + m.i : undefined, o: (k > 0.01 ? 1 : 0) * (1 - kneel), armF: 20 + wonder * 30, armB: 10 + wonder * (m.i === 1 ? 60 : 20), head: -wonder * 4, blink: blinkAt(T, m.seed) });
        const offer = es(t, 2.05 + m.i * 0.1, 2.35 + m.i * 0.1);
        m.kn.set({ x: KX[m.i], y: FLOOR + 6 + m.i * 3, s: 1.04, flip: true, o: kneel, armF: 50 + bow * 20 + offer * 30 - offer * 20, armB: 30 + bow * 30, head: bow * 26 + offer * 4, lean: bow * 34, blink: 0 });
      });

      /* v11c — the treasures opened: gold, frankincense, myrrh */
      const gifts = [[goldB, 0], [censer, 1], [jar, 2]];
      gifts.forEach(([el, i]) => {
        const k = es(t, 2.0 + i * 0.1, 2.3 + i * 0.1, ease.out);
        pose(el, { x: lerp(KX[i] - 60, GX[i], k), y: FLOOR + 8 - bump(t, 2.0 + i * 0.1, 2.3 + i * 0.1) * 30, s: 1.35, o: k > 0.01 ? 1 : 0 });
      });
      const gk = es(t, 2.0, 2.3, ease.out), open = es(t, 2.35, 2.55);
      pose(goldL, { x: lerp(KX[0] - 60, GX[0], gk) - 20 * 1.35, y: FLOOR + 8 - bump(t, 2.0, 2.3) * 30 - 24 * 1.35, s: 1.35, r: -open * 110, o: gk > 0.01 ? 1 : 0 });
      smoke.forEach((sm, i) => {
        const on = es(t, 2.35, 2.55);
        const ph = ((T * 0.25 + i / 3) % 1);
        const live = T ? ph : 0.3 + i * 0.2;
        vpose(sm, { x: GX[1] + Math.sin(T * 0.7 + i) * 4, y: FLOOR + 8 - 54, sx: 0.8 + live * 0.4, sy: 0.4 + live * 0.8, o: on * (1 - live) * 0.9 });
      });
      glints.forEach((g, i) => {
        const k = es(t, 2.5 + i * 0.05, 2.7 + i * 0.05), a = T * 0.9 + i * 1.7;
        vpose(g, { x: GX[0] + Math.cos(a) * 30, y: FLOOR - 40 + Math.sin(a) * 18, s: k * 0.7, r: T * 40, o: k });
      });
      tags.forEach((el, i) => {
        const k = es(t, 2.35 + i * 0.12, 2.6 + i * 0.12, ease.out);
        hangAt(el, [770, 860, 950][i], lerp(-500, [500, 450, 500][i], k), T, k > 0.001 ? 1 : 0, 1.2, 0.9, i);
      });

      S.cam.x = lerp(60, 40, es(t, 0.5, 1.2)) + es(t, 1.8, 2.2) * 10 + (S.portrait ? 40 : 0);
      S.cam.y = 40 + es(t, 0.7, 1.3) * 20;
      S.cam.z = 1.08 + es(t, 0.7, 1.3) * 0.08;
    };
  },
};
