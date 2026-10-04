// Mk 13,3–4 — evening on the Mount of Olives, facing the Temple across the valley. Jesus sits on a
// rock; Peter, James, John and Andrew come close (their name tags drop from the flies) and ask him
// privately: when? and what will be the sign?
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { olivesSet, circle, SKIES, FOUR, JX, JY, speech, nameTag, tagOnString, hourglass, sparkle, question, tint, man, PI } from './lib.js';

export default {
  id: 'm13-olives',
  beats: [
    { v: 3 },
    { v: 4, text: '«Powiedz nam, kiedy to nastąpi?' },
    { v: 4, cont: true, text: 'I jaki będzie znak, gdy to wszystko zacznie się spełniać?»' },
  ],
  cam: { x: [-30, 30], y: [-40, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const TK = 0.22;
    const PH = S.portrait;   // phone: the sun clear of the thread, the Temple's label parked out of sight
    const set = olivesSet(S, { skyCols: SKIES.dusk, tintK: TK, sunXY: [PH ? 1005 : 1150, 250] });
    const UP = PH ? 800 : 300;
    const T = (m, k = TK * 0.5) => tint(m, C.duskViolet, k);

    // the Temple is named on a string over it
    const labL = S.layer({ par: 0.1, sh: 3 });
    const lab = labL.add(`<g>${tagOnString(tr('świątynia', 'the Temple'), { size: 17, len: 300, dx: 0, dy: 44 })}</g>`);

    /* the other disciples, further off under the olives ("privately") */
    const farL = S.layer({ par: 0.36, sh: 3 });
    const OTH = [
      { o: CAST.thomas, x: 300 }, { o: CAST.matthew, x: 352 }, { o: man(c), x: 404 },
      { o: man(c), x: 1250 }, { o: man(c), x: 1305 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(farL.add(T(person(c, { ...m.o, pose: 'sit' }), TK * 1.2))) }));

    /* the circle: the four arrive standing, then sit */
    const P = S.layer({ par: 0.55, sh: 5 });
    const walkers = FOUR.map((f) => ({ f, p: S.puppet(P.add(T(person(c, f.o)))) }));
    const circ = circle(S, P, { tintCol: C.duskViolet, tintK: TK * 0.5 });
    const J = circ.jesus;

    /* tags with their names, in the order Mark gives them: Peter, James, John, Andrew */
    const fx = S.layer({ par: 0.55, sh: 5 });
    const ORDER = [1, 3, 2, 0];
    const tags = ORDER.map((fi, n) => ({ n, m: circ.four[fi], el: fx.add(`<g>${hangTag(c, circ.four[fi].name())}</g>`) }));

    /* the questions: when? (an hourglass) — which sign? (a star with a tail) */
    const qWhen = fx.add(`<g>${speech(c, `<g transform="translate(-12 0) scale(.42)">${hourglass(c, 80)}</g><g transform="translate(16 2) scale(.7)">${question(c)}</g>`, { w: 84, h: 64 })}</g>`);
    const signIcon = `<path d="${c.ribbon(c.qbez([-30, 16], [-14, 10], [-2, 0], 8), (u) => 1 + u * 7)}" fill="${C.halo}"/><path d="${c.cut(c.star(0, 0, 11, 4.5, 5), 0.2, 3)}" fill="${C.sun}"/>`;
    const qSign = fx.add(`<g>${speech(c, `<g transform="translate(-10 0)">${signIcon}</g><g transform="translate(18 2) scale(.7)">${question(c)}</g>`, { w: 84, h: 64, flip: true })}</g>`);
    const glints = [0, 1, 2].map((i) => set.cityL.add(`<g>${sparkle(c, 12)}</g>`));

    set.front();

    return (t, time) => {
      const Tm = time;
      set.sk.blend(SKIES.dusk, SKIES.twilight, es(t, 0, 3.4) * 0.45);
      set.update(t, Tm, { sun: 250 + es(t, -0.5, 3.4) * 90, sunO: 1, glow: 0.7 + bump(t, 2.1, 3) * 0.3, starsO: es(t, 1, 3) * 0.3 });
      pose(lab, { x: set.TEMPLE[0], y: set.TEMPLE[1] - 95 - (1 - es(t, -0.3, 0.3, ease.back)) * UP + es(t, 0.9, 1.3) * -UP, r: Math.sin(Tm * 0.8) * 1.5 });

      OTH.forEach((m) => m.p.set({ x: m.x, y: 610 + (m.i % 2) * 6, s: 0.52, flip: m.x > 800, head: 4, blink: blinkAt(Tm, m.seed) }));

      /* the four come over and sit down (beat 0) */
      walkers.forEach(({ f, p }, i) => {
        const a = 0.02 + i * 0.04, k = seg(t, a, a + 0.4);
        const from = f.x < JX ? -120 - i * 60 : 1720 + i * 60;
        const x = lerp(from, f.x, ease.out(k));
        const sat = es(t, a + 0.4, a + 0.47);
        p.set({ x, y: f.y, s: f.s, flip: f.x > JX, o: 1 - sat, walk: k > 0 && k < 1 ? x * 0.05 : undefined, blink: blinkAt(Tm, i) });
        circ.four[i].sat = sat;
      });

      /* Jesus listens, turning to whoever speaks */
      const toPeter = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const toJohn = es(t, 2.05, 2.3);
      J.set({ x: JX, y: JY, s: circ.s, flip: toPeter > 0.5, armF: 25 + bump(t, 0.2, 0.9) * 30, armB: 10, head: 3 - toJohn * 5 + Math.sin(Tm * 0.7) * 1.2, blink: blinkAt(Tm, 2) });

      circ.four.forEach((m, i) => {
        const sat = m.sat ?? 1;
        const asks = (m.k === 'peter' ? bump(t, 1.02, 1.95) : 0) + (m.k === 'john' ? bump(t, 2.02, 2.95) : 0) + (m.k === 'andrew' ? bump(t, 2.2, 2.95) * 0.5 : 0);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: sat, lean: m.dir * (3 + asks * 5), armB: asks * 120, armF: 20 + asks * 40, head: -asks * 6, blink: blinkAt(Tm, m.seed) });
      });

      /* name tags drop in as they are named, then fly out */
      tags.forEach(({ n, m, el }) => {
        const k = es(t, 0.3 + n * 0.1, 0.5 + n * 0.1, ease.back) * (1 - es(t, 0.92, 1.1));
        pose(el, { x: m.hx, y: lerp(-200, m.hy - 76 * m.s, k), r: Math.sin(Tm * 1.3 + n) * 3, o: k > 0.01 ? 1 : 0 });
      });

      /* when? — which sign? */
      const pk = circ.four[1], jn = circ.four[2];
      const w = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(qWhen, { x: pk.hx + 16, y: pk.hy - 36, s: w, o: w > 0.01 ? 1 : 0, r: Math.sin(Tm * 1.1) * 2 });
      const q = es(t, 2.1, 2.35, ease.back);
      pose(qSign, { x: jn.hx - 16, y: jn.hy - 36, s: q, o: q > 0.01 ? 1 : 0, r: Math.sin(Tm * 1.2) * 2 });
      glints.forEach((g, i) => pose(g, { x: set.TEMPLE[0] + (i - 1) * 34, y: set.TEMPLE[1] - 30 + (i % 2) * 20, s: bump(t, 2.2 + i * 0.1, 2.95) * (0.8 + 0.2 * Math.sin(Tm * 3 + i)), r: Tm * 30, o: 1 }));

      S.cam.z = 1 + es(t, 0.8, 1.6) * 0.05;
      S.cam.y = es(t, 0.8, 1.6) * 25;
    };
  },
};

/** a name tag on its own string (the tag's hole at the origin) */
function hangTag(c, text) {
  return `<path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${nameTag(c, text, { size: 16 })}`;
}
