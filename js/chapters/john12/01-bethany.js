// J 12,1 — the curtains open on Bethany at dusk: the six days before the Passover hang from the flies as six
// little day-discs and the Passover plate, the first one kindles. Jesus comes up the road with Peter, John and Judas;
// Lazarus steps out of his lit doorway to meet Him — and across the hillside, the tomb he walked out of glows, a
// trail of small golden footprints running from it to the man who now stands alive at his own door.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { bethanySet, BE, DUSK, LAZ, TW, sixDays, litDays, nameTag, hanging, swing, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j12-bethany',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-40, 120], y: [-60, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const set = bethanySet(S, { skyCols: DUSK });
    const G = BE.GROUND;
    // footprints from the tomb to the house (behind the actors)
    const stepsL = S.layer({ par: 0.45, sh: 1 });
    const steps = Array.from({ length: 9 }, (_, i) => stepsL.add(`<g>${sheet().p(c.cut(c.ell(0, 0, 7, 3.2, 10, 0), 0.2, 3), C.haloRim).out()}<circle r="12" fill="url(#halo-glow)"/></g>`));
    const stepPts = Array.from({ length: 9 }, (_, i) => { const u = i / 8; return [lerp(BE.TOMB[0] + 40, 920, u) + (i % 2 ? 8 : -8), lerp(BE.TOMB[1] + 20, G + 30, Math.pow(u, 0.7))]; });

    const act = S.layer({ par: 0.5, sh: 5 });
    const disc = [TW.judas, CAST.john, CAST.peter].map((o) => S.puppet(act.add(person(c, o))));
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const laz = S.puppet(act.add(person(c, LAZ)));
    const fx = S.layer({ par: 0.3, sh: 4 });
    const days = hanging(fx, `<g transform="translate(-230 0)">${sixDays(c)}</g>`, { x: 800, y: 200, len: 0 });
    const tagB = hanging(fx, nameTag(c, tr('Betania', 'Bethany'), { size: 19 }), { x: 600, y: 420, len: 600 });
    const tagL = S.layer({ par: 0.52, sh: 4 });
    const tagLaz = hanging(tagL, nameTag(c, tr('Łazarz', 'Lazarus'), { size: 17 }), { x: 925, y: 400, len: 600 });
    set.fg();
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      set.update(t, T, { sunY: 250 + es(t, 0, 2) * 60, sunO: 1, moonY: 170, moonO: 0.5 + es(t, 1, 2) * 0.4, starsO: es(t, 1.2, 2) * 0.5, night: 0.25 + es(t, 1, 2) * 0.2, door: es(t, 1.2, 1.35), tomb: es(t, 1.5, 1.7) * (0.8 + (T ? Math.sin(T * 1.6) * 0.1 : 0)) });

      /* they come up the road */
      const walkK = es(t, 0.3, 1.45, ease.out);
      const jx = lerp(250, 790, walkK);
      const walking = walkK > 0 && walkK < 0.995;
      const greet = es(t, 1.55, 1.75);
      jesus.set({ x: jx, y: G + 4, s: 1.0, walk: walking ? jx * 0.055 : undefined, armF: 14 + greet * 30, armB: 8 + greet * 120, head: -2 + greet * 3, blink: blinkAt(T) });
      disc.forEach((p, i) => {
        const x = jx - 230 + i * 78 - (1 - walkK) * 20 * i;
        p.set({ x, y: G - 8 + i * 4, s: 0.94, walk: walking ? x * 0.055 + i : undefined, armF: 10 + (i === 2 ? greet * 30 : 0), head: i === 0 ? -3 : 2, blink: blinkAt(T, i + 2) });
      });
      /* Lazarus comes out of the lit door to meet Him */
      const out = es(t, 1.28, 1.58);
      const lx = lerp(BE.DOOR, 925, out);
      const bow = bump(t, 1.62, 1.95);
      laz.set({ x: lx, y: G + 2, s: 0.98, flip: true, o: es(t, 1.22, 1.3), walk: out > 0 && out < 1 ? lx * 0.06 : undefined, armF: 20 + greet * 40, armB: 10 + greet * 30, head: 4 - bow * 8, lean: -bow * 7, blink: blinkAt(T, 5) });

      /* the six days before the Passover */
      const dk = es(t, 1.0, 1.35, ease.out);
      swing(days, 800, 196 - (1 - dk) * 500, T, 0.6, 0.5);
      fade(days, dk > 0.001 ? 1 : 0);
      litDays(days, (i) => (i === 0 ? es(t, 1.3, 1.45) : 0));
      const bk = es(t, 1.05, 1.3, ease.out) * (1 - es(t, 1.7, 1.9));
      swing(tagB, 470, 420 - (1 - bk) * 600, bk > 0.001 ? T : 0, 1.2, 0.7);
      fade(tagB, bk > 0.001 ? 1 : 0);
      const lk = es(t, 1.45, 1.7, ease.out);
      swing(tagLaz, 925, 430 - (1 - lk) * 600, lk > 0.001 ? T : 0, 1.4, 0.8, 1);
      fade(tagLaz, lk > 0.001 ? 1 : 0);
      /* "whom Jesus raised": golden footprints from the tomb to him */
      steps.forEach((el, i) => {
        const k = es(t, 1.52 + i * 0.03, 1.6 + i * 0.03);
        vis(el, { x: stepPts[i][0], y: stepPts[i][1], r: -12, s: 0.9, o: k * 0.9 });
      });

      S.cam.x = kf(t, [[0, -20], [1, 20], [1.4, 70], [2, 90]]);
      S.cam.y = kf(t, [[0, -30], [1.2, 0], [2, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [1.6, 1.12], [2, 1.14]]);
    };
  },
};
