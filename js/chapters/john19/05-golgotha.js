// J 19,17–18 — John's way of the cross, seen from afar: Jesus Himself carries the cross, walking steadily and
// upright out of the city along the road, two soldiers behind. A tag comes down: the Place of the Skull, in
// Hebrew Golgotha. He climbs; the central cross rises on the hill — a quiet silhouette with a ring of light — and
// behind the hill a soft glory opens: the hour of glory. Then the two other crosses rise, one on each side, and
// Jesus in the middle.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, addToHead, soldier, thornWreath, carriedCross, nameTag, strip, golgothaSet, setCrosses, clearClouds, lightClouds, glory, hanging, swing, tr, GOL, J19 } from './lib.js';

const RY = 700;

export default {
  id: 'j19-golgotha',
  beats: [
    { v: 17, text: 'A On sam dźwigając krzyż wyszedł na miejsce zwane Miejscem Czaszki,' },
    { v: 17, cont: true, text: 'które po hebrajsku nazywa się Golgota.' },
    { v: 18, text: 'Tam Go ukrzyżowano,' },
    { v: 18, cont: true, text: 'a z Nim dwóch innych, z jednej i drugiej strony, pośrodku zaś Jezusa.' },
  ],
  cam: { x: [-80, 40], y: [-60, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { pal: J19.noon });
    clearClouds(G);
    const gl = G.hangL.add(`<g>${glory(c, 420, 20)}</g>`);
    const clouds = lightClouds(S, G.hangL);
    const P = G.P;
    const sols = [0, 1].map((i) => S.puppet(P.add(soldier(c, i))));
    const jes = S.puppet(P.add(addToHead(person(c, CAST.jesus), thornWreath(c))));
    const crossL = S.layer({ par: 0.55, sh: 6 });
    const cross = crossL.add(`<g>${carriedCross(c)}</g>`);
    const tagL = S.layer({ par: 0.3, sh: 5 });
    const golTag = hanging(tagL, `${nameTag(c, tr('Golgota', 'Golgotha'), { size: 24 })}<g transform="translate(0 74)">${strip(c, tr('Miejsce Czaszki', 'the Place of a Skull'), { size: 16 })}</g><g transform="translate(0 104)">${strip(c, 'גלגלתא', { size: 16, fill: C.parchment, italic: false })}</g>`, { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      const up = es(t, 2.05, 2.6);
      G.sk.blend(J19.noon, J19.gold, up * 0.8);
      clouds.forEach((cl, i) => swing(cl.el, cl.x + Math.sin(T * 0.07 + i * 2) * 26, cl.y, T, 0.8, 0.5, i));

      /* v17a — He carries the cross Himself, out along the road */
      const jK = [[-0.3, [200, RY]], [1.0, [640, RY]], [1.7, [760, RY - 40]], [2.2, [800, RY - 110]]];
      const [jx, jy] = kf(t, jK, (x) => x);
      const far = es(t, 1.05, 2.2);
      const js = lerp(0.64, 0.4, far);
      const jo = 1 - es(t, 1.95, 2.2);
      const step = moving(t, jK, 0.2);
      jes.set({ x: jx, y: jy, s: js, walk: step ? jx * 0.06 : undefined, amt: 0.6, lean: 5, head: 3, armF: 70, armB: 40, blink: blinkAt(T), o: jo });
      pose(cross, { x: jx - 12 * js, y: jy - 116 * js, s: js, r: 60 + (step ? Math.sin(jx * 0.06) * 1.2 : 0), o: jo });
      const sK = (i) => [[-0.3, [60 - i * 90, RY + 6]], [1.0, [500 - i * 90, RY + 6]], [1.8, [640 - i * 70, RY - 10]], [2.4, [700 - i * 60, RY - 40]]];
      sols.forEach((p, i) => {
        const k = sK(i), [x, y] = kf(t, k, (x) => x);
        p.set({ x, y, s: lerp(0.62, 0.48, far), walk: moving(t, k, 0.2) ? x * 0.06 : undefined, armF: 34, armB: 10, blink: blinkAt(T, 3 + i), o: 1 - es(t, 3.3, 3.7) * 0 });
      });

      /* v17b — "Golgotha" */
      const gt = es(t, 1.05, 1.45) * (1 - es(t, 1.95, 2.2));
      swing(golTag, S.portrait ? 1000 : 1100, 180 - (1 - gt) * 800, T, 1, 0.8, 1);

      /* v18 — the crosses rise: His in the middle first, then one on each side */
      const kC = es(t, 2.1, 2.55);
      const kS = es(t, 3.1, 3.5);
      setCrosses(G, kC, kS, es(t, 3.2, 3.6));
      const hl = G.crossC.querySelector('.hl');
      fade(hl, kC * (0.8 + bump(t, 3.5, 4.0) * 0.2));
      pose(gl, { x: GOL.x, y: GOL.top - 150, s: 0.6 + up * 0.35 + es(t, 3.4, 3.9) * 0.1, r: T * 1.2, o: up * (0.35 + es(t, 3.4, 3.9) * 0.2) });

      S.cam.x = lerp(-60, 0, es(t, 0, 1.4));
      S.cam.y = -10 - es(t, 1.4, 2.4) * 30;
      S.cam.z = 1.03 + es(t, 1.4, 2.4) * 0.08 + es(t, 3.3, 3.9) * 0.03;
    };
  },
};
