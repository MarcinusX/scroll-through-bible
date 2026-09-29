// Mt 24,14 — still night on the Mount. "This Good News of the Kingdom will be preached in the whole world": a paper
// globe comes down over the circle; paths of light run out from Jerusalem to every side, and the peoples of the
// earth stand up all round its rim, each with a little light. "And then the end will come": the great theatre
// curtains begin to close from both sides, the stars go out one by one, and only the globe and the circle stay lit.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, shade, mix, curtains, attr } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, worldGlobe, voiceRings, lightMote, PI } from './lib.js';

const GR = 136, GX = 800, GY0 = 318;

export default {
  id: 'mt24-gospel',
  beats: [
    { v: 14, text: 'A ta Ewangelia o królestwie będzie głoszona po całej ziemi, na świadectwo wszystkim narodom.' },
    { v: 14, cont: true, text: 'I wtedy nadejdzie koniec.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.4, NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: TK, moonXY: [1250, 120], templeGlow: 0.3 });

    /* the globe with the peoples round its rim */
    const worldL = S.layer({ par: 0.3, sh: 6 });
    const peoples = Array.from({ length: 14 }, (_, i) => {
      const o = crowdPerson(c, { skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4] });
      return `<g transform="scale(.26)">${person(c, o)}</g><g transform="translate(${i % 2 ? -8 : 8} -30)">${lightMote(c, 3.4)}</g>`;
    });
    const rim = peoples.map((m, i) => ({ m, a: -PI - 0.5 + (i / (peoples.length - 1)) * (PI + 1.0) }));
    const globeEl = worldL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V${-GR - 4}" stroke="rgba(230,210,180,.45)" stroke-width="1.2"/>${worldGlobe(c, GR, rim)}</g>`);
    const rayEls = Array.from(globeEl.querySelectorAll('.ray'));
    const whoEls = Array.from(globeEl.querySelectorAll('.who'));

    /* the circle */
    const P = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, P, { tintCol: NIGHTC, tintK: 0.16 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });
    const glow = P.add(`<g transform="translate(0 -1500)"><circle r="200" fill="url(#warm-glow)"/></g>`);

    set.front();
    const cur = curtains(S);
    cur.set(1, 0);

    return (t, time) => {
      const T = time;
      const end = es(t, 1.05, 1.9);
      set.update(t, T, { sun: 800, sunO: 0, moon: 120 + end * 60, moonO: 1 - end * 0.6, glow: 0.3, starsO: 1 - end * 0.8 });

      /* v14a — the globe comes down and turns; light runs out to every side; the peoples stand round it */
      const g = es(t, 0.02, 0.4, ease.back);
      pose(globeEl, { x: GX, y: lerp(-400, GY0, g), r: (T ? Math.sin(T * 0.5) * 2 : 0) + t * 4, o: g > 0.001 ? 1 : 0 });
      rayEls.forEach((r, i) => attr(r, 'stroke-dashoffset', (1 - es(t, 0.3 + i * 0.025, 0.55 + i * 0.025)).toFixed(3)));
      whoEls.forEach((w, i) => { const k = es(t, 0.45 + i * 0.025, 0.65 + i * 0.025, ease.back); attr(w, 'transform', `scale(${k.toFixed(3)})`); });

      /* Jesus sends it out with both hands; the four look up */
      const send = es(t, 0.1, 0.4) * (1 - es(t, 1.0, 1.2) * 0.5);
      const still = es(t, 1.1, 1.5);
      J.set({ x: JX, y: JY, s: circ.s, armF: 25 + send * 80 - still * 30, armB: 10 + send * 120 - still * 60, head: -send * 10 + still * 4 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, send * (1 - still), T, { s0: 0.7 });
      circ.four.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, lean: m.dir * 3, armF: 20 + es(t, 0.5, 0.8) * 40 * (1 - still), head: -es(t, 0.2, 0.5) * 14 + still * 6, blink: blinkAt(T, m.seed) }));
      pose(glow, { x: JX, y: JY - 110, s: 1, o: 0.5 + still * 0.4 });

      /* v14b — and then the end: the curtains draw in */
      cur.set(1 - end * 0.8, T);

      S.cam.y = -es(t, 0.1, 0.6) * 8 + end * 20;
      S.cam.z = 1 + es(t, 0.1, 0.6) * 0.03;
    };
  },
};
