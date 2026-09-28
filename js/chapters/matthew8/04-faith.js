// Mt 8,10 — back in the street: Jesus hears him and marvels, opens His hands, and turns to the people who follow
// Him. "Not even in Israel have I found so great a faith": over the kneeling centurion's open hands a flame of faith
// rises and grows, far brighter than the little lights that flicker over the crowd.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { capStreet, HOUSE, centurion, soldier, mob, headAt, voiceRings, sparkle, flame, PI } from './lib.js';

const FEET = HOUSE.FEET, JX = 700, CX = 905;

export default {
  id: 'mt8-faith',
  beats: [
    { v: 10, text: 'Gdy Jezus to usłyszał, zdziwił się i rzekł do tych, którzy szli za Nim:' },
    { v: 10, cont: true, text: '«Zaprawdę powiadam wam: U nikogo w Izraelu nie znalazłem tak wielkiej wiary.' },
  ],
  cam: { x: [0, 40], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;
    st.addFront();

    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const crowd = [0, 1].map((i) => ({ i, sp: crowdL.sprite(mob(makeCutter('mt8-cen-c' + i), 5, { s: 0.82, spread: 44 }), 250 - i * 230, 716 - i * 10) }));
    const P = S.layer({ par: 0.4, sh: 5 });
    [[1150, 1], [1235, 2]].forEach(([x, i]) => S.puppet(P.add(soldier(c, i, { spear: 30 }))).set({ x, y: FEET - 8 + i * 4, s: 0.96, flip: true, armF: 30 }));
    const DIS = [CAST.peter, CAST.andrew, CAST.john, CAST.james].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const glowJ = P.add(`<circle r="160" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const talk = voiceRings(P, c, { n: 3, color: C.sun, r: 36, w: 5 });
    const cenK = S.puppet(P.add(centurion(c, { pose: 'kneel' })));

    /* the lights of faith */
    const FL = S.layer({ par: 0.42, sh: 2 });
    const big = FL.add(`<g opacity="0"><circle r="120" fill="url(#warm-glow)"/><g transform="scale(2.2)">${flame(c, 34)}</g></g>`);
    const rays = FL.add(`<g opacity="0">${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * PI * 2; return `<path d="${c.poly([[Math.cos(a - 0.05) * 40, Math.sin(a - 0.05) * 40], [Math.cos(a) * 130, Math.sin(a) * 130], [Math.cos(a + 0.05) * 40, Math.sin(a + 0.05) * 40]])}" fill="#fff3cf"/>`; }).join('')}</g>`);
    const small = Array.from({ length: 7 }, (_, i) => ({ i, x: 80 + i * 78 + c.rr(-10, 10), y: 470 + (i % 3) * 14, el: FL.add(`<g opacity="0"><g transform="scale(.7)">${flame(c, 30)}</g></g>`) }));
    const sparks = [0, 1, 2, 3].map(() => FL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      st.update(T);

      /* v10a — He marvels, and turns to those who follow Him */
      const wonder = bump(t, 0.05, 0.75);
      const turn = es(t, 0.5, 0.58);
      const speak = es(t, 0.62, 0.8) * (1 - es(t, 1.85, 2.0));
      const point = es(t, 1.1, 1.35);
      jesus.set({ x: JX, y: FEET, s: 1.04, flip: turn > 0.5, armF: 14 + wonder * 50 + speak * 40 * (1 - point) + point * 10, armB: 10 + wonder * 70 + point * 60, head: -wonder * 10 + speak * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, FEET, 1.04, turn > 0.5);
      talk(hx, hy, speak, T, { dir: -1, spread: 2 });
      pose(glowJ, { x: hx, y: hy + 30, s: 1, o: wonder * 0.5 + speak * 0.3 });
      DIS.forEach((d) => d.p.set({ x: 560 - d.i * 82, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, armF: 12 + speak * (d.i % 2 ? 10 : 30), head: -speak * 4, blink: blinkAt(T, d.seed) }));
      crowd.forEach((g) => g.sp.set({ x: 250 - g.i * 230, y: 716 - g.i * 10, s: 1 - g.i * 0.1 }));

      /* the centurion still kneels, his hands open */
      const lift = es(t, 1.05, 1.35);
      cenK.set({ x: CX, y: FEET + 2, s: 1.02, flip: true, armF: 60 + lift * 30, armB: 60 + lift * 30, lean: 2, head: -10 - lift * 6, blink: blinkAt(T, 4) });

      /* v10b — so great a faith: a flame over his hands, little lights over the crowd */
      const f = es(t, 1.15, 1.6, ease.out);
      const fx = CX - 50, fy = FEET - 150 - f * 60;
      pose(big, { x: fx, y: fy, s: 0.3 + f * 0.8 + (T ? Math.sin(T * 7) * 0.03 : 0), o: f });
      pose(rays, { x: fx, y: fy - 30, s: 0.4 + f * 0.8, r: T * 6, o: f * 0.5 });
      small.forEach((sl) => { const k = es(t, 1.2 + sl.i * 0.03, 1.5 + sl.i * 0.03); pose(sl.el, { x: sl.x, y: sl.y, s: 0.9 + (T ? Math.sin(T * 6 + sl.i) * 0.1 : 0), o: k * 0.85 }); });
      sparks.forEach((sp, i) => { const k = bump(t, 1.3 + i * 0.08, 1.95); const a = i * 1.6 + T * 0.8; pose(sp, { x: fx + Math.cos(a) * 90, y: fy - 40 + Math.sin(a) * 60, s: k, r: T * 40, o: k }); });

      S.cam.z = 1.06;
      S.cam.x = 30 - es(t, 0.5, 1.0) * 20;
      S.cam.y = 30;
    };
  },
};
