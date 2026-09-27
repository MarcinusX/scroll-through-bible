// J 8,1–2a — the curtains open on the Mount of Olives at night: the moon over Jerusalem across the Kidron, the
// olive trees. Jesus climbs the slope alone and kneels to pray under an olive. Then the dawn: the stars go out,
// the moon sinks, the sun rises behind the city, the Temple begins to shine — He rises and goes down toward it.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { olivesSet, OLIVE_SKIES, nameTag, hanging, swing, kf, vis, tr, DAWN, MORNING } from './lib.js';

const NIGHTC = mix(C.night, C.indigo, 0.4);
const DEEP = ['#1b2046', '#2b3262', '#4a4876'];

export default {
  id: 'j8-olives',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'ale o brzasku zjawił się znów w świątyni.' },
  ],
  cam: { x: [-80, 120], y: [-120, 60], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const set = olivesSet(S, { skyCols: OLIVE_SKIES.night, tintCol: NIGHTC, tintK: 0.4, moonXY: [1150, 150], sunXY: [860, 520], templeGlow: 0.3, starsN: 90 });
    // the night veil over the land (lifts at dawn) — one flat sheet, faded on the compositor
    const veil = S.layer({ par: 0.3, sh: 0, flat: true });
    veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".32"/>`);
    // a dawn wash of warm light over the city
    const dawnL = S.layer({ par: 0.1, sh: 0, flat: true });
    const dawnGlow = dawnL.add(`<g><ellipse rx="900" ry="300" fill="url(#warm-glow)"/></g>`);

    /* Jesus: walking up, kneeling in prayer, rising */
    const act = S.layer({ par: 0.45, sh: 5 });
    act.add(olive(c, 930, 716, 1.15, { trunk: mix(C.wood2, C.indigo, 0.3), leaf: mix(C.olive, C.indigo, 0.3), leaf2: mix(C.sage, C.indigo, 0.35) }));
    const jWalk = S.puppet(act.add(person(c, CAST.jesus)));
    const jKneel = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const prayGlow = act.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const tagL = S.layer({ par: 0.2, sh: 4 });
    const tag = hanging(tagL, nameTag(c, tr('Góra Oliwna', 'Mount of Olives'), { size: 18 }), { x: 520, y: 300, len: 600 });
    const tagT = hanging(tagL, nameTag(c, tr('świątynia', 'the temple'), { size: 18 }), { x: set.TEMPLE[0] + 150, y: set.TEMPLE[1] - 60, len: 600 });
    set.front({ bough: true });

    const cur = curtains(S);
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      /* sky: night → deep night → dawn → morning */
      const dawn = es(t, 2.05, 2.9);
      const morn = es(t, 2.7, 3.2);
      if (dawn <= 0) set.sk.blend(OLIVE_SKIES.night, DEEP, es(t, 0.6, 1.4));
      else if (morn <= 0) set.sk.blend(DEEP, DAWN, dawn);
      else set.sk.blend(DAWN, MORNING, morn);
      const sunY = lerp(560, 190, es(t, 2.1, 3.1, ease.out));
      set.update(t, T, { sun: sunY, sunO: dawn > 0.01 ? 1 : 0, moon: lerp(150, 520, es(t, 2.05, 2.8, ease.in)), moonO: 1 - es(t, 2.5, 2.8), glow: 0.3 + dawn * 0.7, starsO: 1 - es(t, 2.05, 2.5) });
      veil.fade(1 - dawn);
      dawnL.fade(bump(t, 2.1, 3.4));
      pose(dawnGlow, { x: 820, y: 430, s: 0.6 + dawn * 0.6 });

      /* v1 — He goes up the Mount and kneels to pray */
      const up = es(t, 0.85, 1.6);
      const kneel = es(t, 1.55, 1.65);
      const rise = es(t, 2.36, 2.43);
      const down = es(t, 2.45, 3.25, ease.in);
      const jx = t < 2 ? lerp(420, 790, up) : lerp(790, 1260, down);
      const jy = t < 2 ? lerp(760, 700, up) : lerp(700, 690, down);
      const kn = kneel * (1 - rise);
      jWalk.set({ x: jx, y: jy, s: 1.0, o: 1 - kn, walk: (up > 0 && up < 1) || (down > 0 && down < 1) ? jx * 0.06 : undefined, armF: 12, armB: 8, head: -3 + (1 - rise) * 0, blink: blinkAt(T) });
      const pray = es(t, 1.62, 1.9);
      jKneel.set({ x: 790, y: 704, s: 1.0, o: kn, armF: 20 + pray * 55, armB: 20 + pray * 130, head: -14 * pray + (T ? Math.sin(T * 0.8) * 1.2 : 0), blink: pray > 0.6 ? 1 : blinkAt(T) });
      vis(prayGlow, { x: 800, y: 560, s: 0.8 + Math.sin(T * 1.3) * 0.04, o: pray * kn * 0.8 });
      // name tags come down and go up
      const tk = es(t, 0.9, 1.3, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      swing(tag, 520, 300 - (1 - tk) * 600, tk > 0.001 ? T : 0, 1.2, 0.7);
      fade(tag, tk > 0.001 ? 1 : 0);
      const tt = es(t, 2.5, 2.85, ease.out);
      swing(tagT, set.TEMPLE[0] + 150, set.TEMPLE[1] - 60 - (1 - tt) * 600, tt > 0.001 ? T : 0, 1.2, 0.7, 2);
      fade(tagT, tt > 0.001 ? 1 : 0);

      // camera: the Mount, then lifting toward the city as the day comes
      const toT = es(t, 2.4, 3.3);
      S.cam.x = kf(t, [[0, -20], [1, -30], [1.7, 0], [2.4, 0], [3.3, 60]]);
      S.cam.y = kf(t, [[0, 20], [1.7, 40], [2.4, 30], [3.3, -110]]);
      S.cam.z = kf(t, [[0, 1.02], [1.7, 1.12], [2.4, 1.08], [3.3, 1.0]]) + toT * 0;
    };
  },
};
