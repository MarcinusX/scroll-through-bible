// Mt 24,3 — evening on the Mount of Olives, facing the Temple across the Kidron valley (Mark 13's set). Jesus sits on
// His rock; the disciples come to Him privately — the four sit down close, the others further off under the olives.
// Their question comes in three bubbles: when? (an hourglass), the sign of Your coming (a star of light), and the end
// of the age (the sun going down behind the world).
import { C, person, CAST, blinkAt, pose, lerp, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, FOUR, JX, JY, speech, tagOnString, hourglass, sparkle, question, tint, man, tr, PI } from './lib.js';

export default {
  id: 'mt24-olives',
  beats: [
    { v: 3, text: 'A gdy siedział na Górze Oliwnej, podeszli do Niego uczniowie i pytali na osobności:' },
    { v: 3, cont: true, text: '«Powiedz nam, kiedy to nastąpi i jaki będzie znak Twego przyjścia i końca świata?»' },
  ],
  cam: { x: [-30, 30], y: [-40, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const TK = 0.22;
    const set = olivesSet(S, { skyCols: SKIES.dusk, tintK: TK, sunXY: [1150, 250] });
    const T = (m, k = TK * 0.5) => tint(m, C.duskViolet, k);
    set.sk.blend(SKIES.dusk, SKIES.twilight, 0.2);

    /* place names on strings: the Temple across the valley, the Mount of Olives */
    const labL = S.layer({ par: 0.1, sh: 3 });
    const lab = labL.add(`<g transform="translate(0 -1500)">${tagOnString(tr('świątynia', 'the Temple'), { size: 17, len: 300, dx: 0, dy: 44 })}</g>`);
    const labL2 = S.layer({ par: 0.4, sh: 4 });
    const mount = labL2.add(`<g transform="translate(0 -1500)">${tagOnString(tr('Góra Oliwna', 'the Mount of Olives'), { size: 20, len: 400, dx: 0, dy: 0 })}</g>`);

    /* the other disciples, further off under the olives */
    const farL = S.layer({ par: 0.36, sh: 3 });
    const OTH = [
      { o: CAST.thomas, x: 300 }, { o: CAST.matthew, x: 352 }, { o: man(c), x: 404 },
      { o: man(c), x: 1250 }, { o: man(c), x: 1305 }, { o: man(c), x: 1356 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(farL.add(T(person(c, { ...m.o, pose: 'sit' }), TK * 1.2))) }));

    /* the circle: the four arrive standing, then sit */
    const P = S.layer({ par: 0.55, sh: 5 });
    const walkers = FOUR.map((f) => ({ f, p: S.puppet(P.add(T(person(c, f.o)))) }));
    const circ = circle(S, P, { tintCol: C.duskViolet, tintK: TK * 0.5 });
    const J = circ.jesus;

    /* the three questions */
    const fx = S.layer({ par: 0.55, sh: 5 });
    const qm = (x) => `<g transform="translate(${x} 2) scale(.66)">${question(c)}</g>`;
    const qWhen = fx.add(`<g transform="translate(0 -1500)">${speech(c, `<g transform="translate(-14 0) scale(.42)">${hourglass(c, 80)}</g>${qm(16)}`, { w: 84, h: 64 })}</g>`);
    const signIcon = `<circle r="26" fill="url(#halo-glow)"/><path d="${c.ribbon(c.qbez([-30, 16], [-14, 10], [-2, 0], 8), (u) => 1 + u * 7)}" fill="${C.halo}"/><path d="${c.cut(c.star(0, 0, 12, 5, 5), 0.2, 3)}" fill="${C.sun}"/>`;
    const qSign = fx.add(`<g transform="translate(0 -1500)">${speech(c, `<g transform="translate(-12 0)">${signIcon}</g>${qm(20)}`, { w: 88, h: 64, flip: true })}</g>`);
    const endIcon = `<g transform="translate(0 6)"><path d="${c.cut([[-18, 0], ...c.arc(0, 0, 18, 18, PI, 2 * PI, 12), [18, 0]], 0.3, 4)}" fill="${C.sunDeep}"/><path d="${c.poly(c.star(0, 0, 26, 18, 12, 0)).replace('Z', 'Z')}" fill="${C.sun}" opacity=".35"/><g transform="translate(0 16)">${`<path d="${c.cut([[-30, -16], [30, -16], [30, 0], [-30, 0]], 0.3, 5)}" fill="${mix(C.duskViolet, C.night, 0.3)}"/>`}</g></g>`;
    const qEnd = fx.add(`<g transform="translate(0 -1500)">${speech(c, `<g transform="translate(-12 -4)">${endIcon}</g>${qm(22)}`, { w: 92, h: 64 })}</g>`);
    const glints = [0, 1, 2].map(() => set.cityL.add(`<g transform="translate(0 -1500)">${sparkle(c, 12)}</g>`));

    set.front();

    return (t, time) => {
      const Tm = time;
      set.update(t, Tm, { sun: 250 + es(t, -0.5, 2) * 80, sunO: 1, glow: 0.7 + bump(t, 1.1, 2) * 0.3, starsO: es(t, 0.6, 2) * 0.3 });
      pose(lab, { x: set.TEMPLE[0], y: set.TEMPLE[1] - 95 - (1 - es(t, -0.3, 0.3, ease.back)) * 500 - es(t, 0.95, 1.2) * 500, r: Math.sin(Tm * 0.8) * 1.5 });
      const mk = es(t, 0.15, 0.45, ease.back) * (1 - es(t, 0.95, 1.15));
      pose(mount, { x: 1020, y: lerp(-500, 470, mk), r: Math.sin(Tm * 0.9 + 1) * 2 });

      OTH.forEach((m) => m.p.set({ x: m.x, y: 610 + (m.i % 2) * 6, s: 0.52, flip: m.x > 800, head: 4, blink: blinkAt(Tm, m.seed) }));

      /* the four come over and sit down (beat 0) */
      walkers.forEach(({ f, p }, i) => {
        const a = 0.02 + i * 0.05, k = seg(t, a, a + 0.42);
        const from = f.x < JX ? -120 - i * 60 : 1720 + i * 60;
        const x = lerp(from, f.x, ease.out(k));
        const sat = es(t, a + 0.42, a + 0.49);
        p.set({ x, y: f.y, s: f.s, flip: f.x > JX, o: 1 - sat, walk: k > 0 && k < 1 ? x * 0.05 : undefined, blink: blinkAt(Tm, i) });
        circ.four[i].sat = sat;
      });

      /* Jesus listens, turning a little to whoever asks */
      const toLeft = es(t, 1.05, 1.25) * (1 - es(t, 1.35, 1.5));
      J.set({ x: JX, y: JY, s: circ.s, flip: toLeft > 0.5, armF: 25 + bump(t, 0.2, 0.9) * 30, armB: 10, head: 3 - es(t, 1.4, 1.6) * 5 + Math.sin(Tm * 0.7) * 1.2, blink: blinkAt(Tm, 2) });

      const ASK = { peter: [1.02, 1.95], john: [1.2, 1.98], andrew: [1.38, 1.99], james: [1.5, 1.99] };
      circ.four.forEach((m) => {
        const sat = m.sat ?? 1;
        const [a, b] = ASK[m.k];
        const asks = es(t, a, a + 0.15) * (1 - es(t, b, b + 0.05));
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: sat, lean: m.dir * (3 + asks * 5), armB: asks * (m.k === 'james' ? 40 : 120), armF: 20 + asks * 40, head: -asks * 6, blink: blinkAt(Tm, m.seed) });
      });

      /* when? — the sign of Your coming? — the end of the age? */
      const pk = circ.four[1], jn = circ.four[2], an = circ.four[0];
      const w = es(t, 1.05, 1.28, ease.back);
      pose(qWhen, { x: pk.hx + 14, y: pk.hy - 40, s: w, o: w > 0.01 ? 1 : 0, r: Math.sin(Tm * 1.1) * 2 });
      const q = es(t, 1.22, 1.45, ease.back);
      pose(qSign, { x: jn.hx - 14, y: jn.hy - 40, s: q, o: q > 0.01 ? 1 : 0, r: Math.sin(Tm * 1.2) * 2 });
      const e = es(t, 1.4, 1.62, ease.back);
      pose(qEnd, { x: an.hx + 6, y: an.hy - 34, s: e * 0.95, o: e > 0.01 ? 1 : 0, r: Math.sin(Tm * 1.0 + 2) * 2 });
      glints.forEach((g, i) => pose(g, { x: set.TEMPLE[0] + (i - 1) * 34, y: set.TEMPLE[1] - 30 + (i % 2) * 20, s: bump(t, 1.2 + i * 0.1, 2) * (0.8 + 0.2 * Math.sin(Tm * 3 + i)), r: Tm * 30, o: 1 }));

      S.cam.z = 1 + es(t, 0.8, 1.4) * 0.06;
      S.cam.y = es(t, 0.8, 1.4) * 30;
    };
  },
};
