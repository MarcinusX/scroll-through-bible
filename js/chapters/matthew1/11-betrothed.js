// Mt 1,18 — Nazareth in the evening. The star at the top of the tree comes down and hangs over the little town:
// here is how the birth of Jesus Christ came about. Joseph at his workbench, Mary at her door. They meet in the street
// and are betrothed — a garland comes down over them, a ring passes from hand to hand. Each goes back to their own
// house; and before they live together, a dove comes down in a beam of light over Mary: she is with child by the Holy Spirit.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import {
  EVE, NIGHT, JOSEPH, MARY, nazarethSet, houseLight, GY, glowStar, glowDisc, dove, flapWings, hungWord, sparkle, square, kf,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { garland } from '../mark2/lib.js';
import { moving } from '../mark2/lib.js';

const JH = 646, MH = 962;         // where each stands at home
const JM = 760, MM = 850;          // where they meet

export default {
  id: 'mt1-betrothed',
  beats: [
    { v: 18, text: 'Z narodzeniem Jezusa Chrystusa było tak.' },
    { v: 18, cont: true, text: 'Po zaślubinach Matki Jego, Maryi, z Józefem,' },
    { v: 18, cont: true, text: 'wpierw nim zamieszkali razem, znalazła się brzemienną za sprawą Ducha Świętego.' },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const LATE = ['#5d5b8c', '#c99a9a', '#eeb994'];
    const N = nazarethSet(S, EVE, { k: 0.12 });
    const starEl = hanging(N.hangL, glowStar(c, 20), { x: 800, y: 150, len: 900 });

    /* ---------- the betrothal garland and the words ---------- */
    const G = S.layer({ par: 0.3, sh: 5 });
    const gar = G.add(`<g><path d="M0 0V-1600M300 0V-1600" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/>${garland(c, 300, 40)}</g>`);
    const tag = G.add(hungWord(c, tr('zaślubiny', 'betrothed'), { size: 24 }));

    /* ---------- Joseph and Mary ---------- */
    const jo = S.puppet(N.P.add(person(c, { ...JOSEPH, holdF: `<g transform="translate(0 2) rotate(-40)">${square(c)}</g>` })));
    const joE = S.puppet(N.P.add(person(c, JOSEPH)));
    const ma = S.puppet(N.P.add(person(c, MARY)));
    const ring = N.P.add(`<g><circle r="18" fill="url(#warm-glow)"/><path d="${c.ribbon(c.arc(0, 0, 5.5, 5.5, 0, PI * 2, 14), 2.2)}" fill="${C.sun}"/></g>`);

    /* ---------- the Spirit: a beam of light and a dove over Mary ---------- */
    const L = N.G;
    const beam = L.add(`<path d="${c.poly([[MH - 30, -900], [MH + 30, -900], [MH + 120, GY], [MH - 120, GY]])}" fill="#fff3cf" opacity=".34"/>`);
    const mGlow = L.add(`<g>${glowDisc(120, 'halo-glow', 1)}</g>`);
    const D = S.layer({ par: 0.3, sh: 6 });
    const womb = D.add(`<g>${glowDisc(34, 'warm-glow', 1)}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => D.add(`<g>${sparkle(c, 9 + (i % 2) * 5)}</g>`));
    const dv = D.add(dove(c));

    return (t, time) => {
      /* v18a: the star comes down over Nazareth; lamps are lit */
      const st = es(t, 0.05, 0.5, ease.out);
      swing(starEl, 800, lerp(-300, 150, st), time, 1.2, 0.7);
      N.sk.blend(EVE, LATE, es(t, 0.2, 2.6));
      N.starL.fade(es(t, 1.6, 2.6) * 0.7);
      houseLight(N.J, { open: 0.3, lit: 0.4 + es(t, 0.2, 0.6) * 0.6 });
      houseLight(N.M, { open: es(t, 0.2, 0.5) * 0.7 + es(t, 2.1, 2.3) * 0.3, lit: 0.3 + es(t, 0.3, 0.7) * 0.7 });

      /* v18b1: they meet in the street and are betrothed */
      const go = es(t, 1.02, 1.4), back = es(t, 2.0, 2.4);
      const jx = lerp(JH, JM, go) + (JH - JM) * back, mx = lerp(MH, MM, go) + (MH - MM) * back;
      const jWalk = (go > 0 && go < 1) || (back > 0 && back < 1);
      const give = bump(t, 1.4, 1.95);
      const work = t < 1.0 ? Math.max(0, Math.sin(time * 3)) * 20 : 0;
      const swap = es(t, 1.0, 1.06);
      // at the bench with the square; then empty-handed for the betrothal
      jo.set({ x: JH, y: GY, s: 1, flip: false, o: 1 - swap, armF: 50 + work, armB: 10, head: 6, blink: blinkAt(time, 1) });
      joE.set({ x: jx, y: GY, s: 1, flip: back > 0.5, o: swap, walk: jWalk ? t * 30 : undefined, armF: 10 + give * 60 + bump(t, 2.6, 3.2) * 10, armB: 8, head: back > 0.5 ? 10 * es(t, 2.4, 2.8) : 0, blink: blinkAt(time, 1) });
      /* v18b2: back to their own homes; the Spirit over Mary */
      const spirit = es(t, 2.3, 2.6);
      const wonder = es(t, 2.45, 2.7);
      ma.set({ x: mx, y: GY, s: 0.96, flip: back < 0.5, walk: jWalk ? t * 30 + 1 : undefined, armF: 10 + give * 55 + wonder * 40, armB: 6 + wonder * 50, head: -wonder * 12, blink: blinkAt(time, 3) });
      pose(ring, { x: lerp(jx + 40, mx - 40, seg(t, 1.45, 1.8)), y: GY - 90, s: bump(t, 1.4, 1.95) > 0.02 ? 1 : 0.001, o: Math.min(1, bump(t, 1.4, 1.95) * 3) });
      const gk = es(t, 1.35, 1.65, ease.out) * (1 - es(t, 2.0, 2.3, ease.in));
      pose(gar, { x: 800 - 150, y: lerp(-300, 440, gk), o: gk > 0.002 ? 1 : 0 });
      pose(tag, { x: 800, y: lerp(-400, 360, gk), r: Math.sin(t * 3) * 1.5, o: gk > 0.002 ? 1 : 0 });

      pose(beam, { o: spirit * 0.5 });
      pose(mGlow, { x: MH, y: GY - 110, s: 0.5 + spirit * 0.7, o: spirit });
      pose(womb, { x: MH + 10, y: GY - 88, s: 0.3 + wonder * 0.9, o: wonder * 0.9 });
      const dk = es(t, 2.12, 2.5, ease.out);
      pose(dv, { x: lerp(MH + 220, MH + 10, dk), y: lerp(-80, GY - 270, dk), s: 1.1, o: t > 2.1 ? 1 : 0 });
      if (t > 2.1) flapWings(dv, time || t * 3, 30, 7, -6);
      sparks.forEach((sp, i) => { const kk = seg(t, 2.45 + i * 0.05, 2.95 + i * 0.05); pose(sp, { x: MH + Math.cos(i * 1.3) * (40 + kk * 50), y: GY - 150 - kk * 90, s: 1 - kk * 0.5, r: t * 90, o: bump(t, 2.45 + i * 0.05, 2.95 + i * 0.05) }); });

      S.cam.z = 1.12 + es(t, 1.0, 1.4) * 0.04 - es(t, 2.0, 2.3) * 0.04;
      S.cam.y = 24;
      S.cam.x = es(t, 2.0, 2.4) * 30;
    };
  },
};
