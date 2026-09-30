// Łk 3,23 — the road of the generations begins. Jesus, about thirty years old, stands at the start of a road
// that runs back to the horizon; a wooden sign comes down: "about thirty years". Then the line goes back from
// him into time: garlands of medallions hang between poles along the road, receding into the distance. The
// first comes near — Joseph (hung on a thread of dots: "as was supposed"), with his carpenter's square, and Heli.
import { C, person, CAST, blinkAt, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, hillsWith } from '../../assets/nature.js';
import {
  eraSet, lineRoad, gen, ICON3, JOSEPH, labelTag, lightDisc, strip, numberCard, VP, tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const JX = 800, JY = 792;

export default {
  id: 'lk3-thirty',
  beats: [
    { v: 23, text: 'Sam zaś Jezus rozpoczynając swoją działalność miał lat około trzydziestu.' },
    { v: 23, cont: true, text: 'Był, jak mniemano, synem Józefa, syna Helego,' },
  ],
  cam: { x: [-20, 20], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const E = eraSet(S, { skyCols: ['#c8dcd8', '#f1e3c4', '#f8e7c6'], far: mix(C.duskViolet, C.hillFar, 0.5), mid: mix(C.hillMid, C.sand2, 0.4), ground: mix(C.sage2, C.sand, 0.4), road: mix(C.sand, C.cream, 0.45) });
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 470, y: 190, len: 700 });
    E.midL.add(hillsWith(c, { y: VP[1] - 10, amps: [10, 4, 2], lens: [700, 260, 100], color: mix(C.hillMid, C.sand2, 0.3), trees: 14, treeColor: C.sage, treeH: 14, houses: 6, houseColor: C.plaster }).markup);

    const L = lineRoad(S, [
      { people: [
        gen(c, tr('Józef', 'Joseph'), { o: JOSEPH, r: 58, rim: 'humble', icon: ICON3.square, dotted: true }),
        gen(c, tr('Heli', 'Heli'), { r: 52 }),
      ] },
    ], [1], { extra: 2 });

    /* Jesus at the start of the road, light behind him */
    const back = S.layer({ par: 0.4, sh: 1, flat: true });
    const glow = back.add(`<g>${lightDisc(c, 150)}</g>`);
    const act = S.layer({ par: 0.4, sh: 5 });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* from the flies: "about thirty years", "as was supposed" */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const sign = fly.add(`<g><path d="M-40 -1600V-40M40 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${numberCard(c, tr('ok. 30', 'c. 30'), { size: 50 })}<g transform="translate(0 64)">${strip(c, tr('lat', 'years old'), { size: 18 })}</g></g>`);
    const supposed = fly.add(`<g><path d="M0 -1600V-14" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${labelTag(tr('jak mniemano', 'as was supposed'), 17)}</g>`);

    return (t, time) => {
      swing(sunEl, 1240, 150, time, 1, 0.6);
      swing(cl, 470 + Math.sin(time * 0.1) * 20, 190, time, 1.2, 0.6, 1);
      L.update(t);

      /* v23a — Jesus, about thirty, at the beginning */
      const come = es(t, 0.04, 0.5);
      const jx = lerp(1180, JX, come);
      const turn = come > 0.98;
      jesus.set({ x: jx, y: JY, s: 1.14, flip: !turn, walk: come > 0 && come < 1 ? jx * 0.05 : undefined, armF: 14 + es(t, 0.6, 0.8) * 30 + es(t, 1.4, 1.6) * 10, armB: 10 + es(t, 0.6, 0.8) * 20, head: -es(t, 1.1, 1.4) * 10, blink: blinkAt(time, 3) });
      pose(glow, { x: jx, y: JY - 180, s: 1, o: 0.5 + es(t, 0.5, 0.8) * 0.4 });
      const sk = es(t, 0.3, 0.6, ease.out), sUp = es(t, 1.0, 1.25, ease.in);
      pose(sign, { x: 1040, y: lerp(-500, 320, sk) - sUp * 800, r: Math.sin(time * 0.8) * 1.2, o: sk > 0.01 && sUp < 1 ? 1 : 0 });

      /* v23b — son (as was supposed) of Joseph, son of Heli */
      const tk = es(t, 1.5, 1.72, ease.back);
      pose(supposed, { x: 590, y: lerp(-400, 236, tk), r: Math.sin(time * 1.1) * 2, o: tk > 0.01 ? 1 : 0 });

      S.cam.z = 1.02 + es(t, 1.0, 1.45) * 0.03;
      S.cam.y = 20;
    };
  },
};
