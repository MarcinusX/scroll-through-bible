// J 17,4–5 — "I glorified You on the earth": a golden trail lights up across the land, His way from Galilee down to
// Jerusalem, and at seven places on it a light flares. "By finishing the work You gave Me to do": from those seven
// places the seven signs rise (the wine at Cana, the official's son, the mat at Bethesda, the loaves, the boat on the
// water, the eye opened, the tomb opened) and hang in an arc over Him; a golden line joins them — the work is done.
// "And now, Father, glorify Me with Yourself": the signs rise into the radiance, which comes down and grows; the set
// begins to fly away into the flies. "With the glory I had with You before the world existed": the whole world has
// folded away — hills, city, moon and stars gone — and in the timeless dark there is only the great light, with the
// Word's flame (John 1) at its heart and a ring without end around them; He stands praying in it.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, lifeFlames, fatherLight, signPlate, lightPath, drawPath, eternityRing, drawRing, wordFlame,
  radiance, rayBurst, lineD, vis, kf, pose, fade, C, JX, JY, NIGHT, HOLY, VOID, PRAY, PI, lerp,
} from './lib.js';

// the trail across the land (Galilee → the Jordan → … → Jerusalem) and the seven sign places on it
const TRAIL = [[1560, 470], [1400, 488], [1240, 470], [1080, 500], [930, 488], [780, 470], [640, 452], [520, 418], [420, 392], [340, 372]];
const STOPS = [[1470, 480], [1330, 482], [1180, 482], [1040, 496], [880, 484], [700, 462], [560, 430]];
// where the signs hang: an arc over Him
const ARC = STOPS.map((_, i) => { const a = PI * (1.1 + (i / 6) * 0.8); return [JX + Math.cos(a) * 305, 450 + Math.sin(a) * 236]; });

export default {
  id: 'j17-work',
  beats: [
    { v: 4, text: 'Ja Ciebie otoczyłem chwałą na ziemi' },
    { v: 4, cont: true, text: 'przez to, że wypełniłem dzieło, które Mi dałeś do wykonania.' },
    { v: 5, text: 'A teraz Ty, Ojcze, otocz Mnie u siebie tą chwałą,' },
    { v: 5, cont: true, text: 'którą miałem u Ciebie pierwej, zanim świat powstał.' },
  ],
  cam: { x: [-20, 20], y: [-60, 30], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: NIGHT });

    // the timeless light (behind everything that folds away)
    const tlL = S.layer({ par: 0.06, sh: 2 });
    const great = tlL.add(`<g>${rayBurst(c, { n: 30, r0: 60, r1: 520, spread: 0.03, o: 0.16 })}<circle r="420" fill="url(#halo-glow)"/><g transform="scale(1.3)">${radiance(c, 120)}</g></g>`);
    const flame = tlL.add(`<g>${wordFlame(c, 96)}</g>`);
    const ring = tlL.add(`<g>${eternityRing(c, 250, 7, 36)}</g>`);

    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 58)}</g>`);
    // the trail on the land
    const trL = S.layer({ par: 0.12, sh: 0, flat: true });
    const trail = trL.add(`<g>${lightPath(lineD(TRAIL), { w: 5, col: C.halo })}</g>`);
    const trailP = trail.firstElementChild;
    const flares = STOPS.map(() => trL.add(`<g><circle r="46" fill="url(#halo-glow)"/><circle r="5" fill="#fffdf4"/></g>`));
    const upG = S.id('up');
    S.defs(`<linearGradient id="${upG}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff3cf" stop-opacity=".5"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></linearGradient>`);
    const upR = trL.add(`<g>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${STOPS[i][0] - 3} ${STOPS[i][1]}L${STOPS[i][0] + 3} ${STOPS[i][1]}L${STOPS[i][0] + 18} 120L${STOPS[i][0] - 18} 120Z" fill="url(#${upG})"/>`).join('')}</g>`);
    // the seven signs + the line joining them
    const sgL = S.layer({ par: 0.3, sh: 4 });
    const done = sgL.add(`<g>${lightPath(lineD(ARC), { w: 4, col: C.haloRim })}</g>`);
    const doneP = done.firstElementChild;
    const signs = STOPS.map((_, i) => sgL.add(`<g>${signPlate(c, i, 36)}</g>`));

    const dL = S.layer({ par: 0.4, sh: 5 });
    const D = eleven(S, dL);
    const jL = S.layer({ par: 0.4, sh: 5 });
    const jGlow = jL.add(`<g><circle r="130" fill="url(#halo-glow)"/></g>`);
    const J = jesusOn(S, jL);
    const fx = S.layer({ par: 0.42, sh: 2 });
    const flames = lifeFlames(S, fx, D);

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v4a — glory on the earth: the trail lights up, light rises from it */
      const tk = es(t, 0.1, 0.75);
      drawPath(trailP, tk);
      const TR = 1 - es(t, 2.1, 2.5);
      fade(trail, TR);
      STOPS.forEach(([x, y], i) => {
        const on = es(t, 0.15 + i * 0.08, 0.3 + i * 0.08) * (1 - es(t, 1.1 + i * 0.07, 1.3 + i * 0.07));
        vis(flares[i], { x, y, s: 0.6 + on * 0.6, o: on });
      });
      vis(upR, { x: 0, y: 0, o: bump(t, 0.5, 1.15) });

      /* v4b — the seven signs rise and hang in an arc; the line joins them */
      const lift = es(t, 2.05, 2.55, ease.in);
      signs.forEach((el, i) => {
        const u = es(t, 1.05 + i * 0.07, 1.4 + i * 0.07, ease.out);
        const [ax, ay] = ARC[i];
        const x = lerp(STOPS[i][0], ax, u), y = lerp(STOPS[i][1], ay, u) - Math.sin(u * PI) * 40;
        const gy = lerp(y, 150, lift), gx = lerp(x, JX + (ax - JX) * 0.15, lift);
        const glow = el.__g || (el.__g = el.querySelector('.sg'));
        fade(glow, es(t, 1.45 + i * 0.04, 1.6 + i * 0.04));
        vis(el, { x: gx, y: gy + (T ? Math.sin(T * 1.2 + i) * 2 : 0), s: (0.5 + u * 0.5) * (1 - lift * 0.7), o: u > 0.01 ? 1 - es(t, 2.35, 2.6) : 0 });
      });
      drawPath(doneP, es(t, 1.55, 1.9));
      fade(done, 1 - es(t, 2.0, 2.2));

      /* v5a — glorify Me with Yourself: the light comes down and grows; the world starts to fold away */
      const fold = es(t, 2.3, 3.4);
      P.fold(fold);
      dL.fade(1 - es(t, 2.4, 3.0));
      dL.shift(0, fold * 370);   // with the ground they sit on
      fx.fade(1 - es(t, 2.3, 2.8));
      fx.shift(0, fold * 370);
      flames(1, T);
      D.forEach((m) => { put(m, T, { head: -12 - es(t, 1.1, 1.5) * 6 }); lampK(m, 0.85 * (1 - fold)); });
      const hk = 1 - es(t, 2.8, 3.2);
      vis(high, { x: JX, y: 150 + es(t, 2.1, 2.6) * 30, s: 1 + es(t, 2.2, 2.9) * 0.4, r: T * 1.5, o: hk });
      const dark = es(t, 2.5, 3.2);
      if (dark > 0.001) P.sky.blend(HOLY, VOID, dark); else P.sky.blend(NIGHT, HOLY, es(t, 0.1, 0.8) * 0.6 + es(t, 2.1, 2.5) * 0.4);

      /* v5b — before the world was: the timeless light */
      const gk = es(t, 2.75, 3.3);
      vis(great, { x: JX, y: 300, s: 0.6 + gk * 0.4, r: t * 6, o: gk });
      const fk = es(t, 3.15, 3.5, ease.back);
      vis(flame, { x: JX, y: 300 + 48, s: fk * 0.9 * (1 + (T ? Math.sin(T * 3) * 0.02 : 0)), o: fk > 0.01 ? 1 : 0 });
      const rk = es(t, 3.3, 3.8);
      vis(ring, { x: JX, y: 330, sy: 1.18, r: -T * 2, o: rk > 0.01 ? 1 : 0 });
      drawRing(ring, rk);
      vis(jGlow, { x: JX, y: JY - 110, s: 0.8 + gk * 0.6, o: 0.3 + gk * 0.5 });

      /* Jesus */
      const open = es(t, 1.9, 2.3);
      put(J, T, {
        y: JY - gk * 24,
        head: -8 + bump(t, 0.1, 1.0) * 6 - open * 22,
        armF: 20 + bump(t, 0.1, 1.1) * 50 + bump(t, 1.1, 2.0) * 50 + open * 50,
        armB: 8 + open * 96,
      });

      S.cam.x = kf(t, [[0, 10], [1, 0], [2, 0]]);
      S.cam.y = kf(t, [[0, 0], [1, -30], [2, -40], [3, -30], [4, -30]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.0], [2, 0.98], [3, 1.04], [4, 1.1]]);
    };
  },
};
