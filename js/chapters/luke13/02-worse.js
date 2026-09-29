// Łk 13,2–3 — Jesus turns to all of them. "Do you think these Galileans were worse sinners than all the other
// Galileans, because they suffered this?" A pair of scales comes down over the crowd: on one pan the three Galileans
// with their dark sack of sins, on the other all the other Galileans with theirs; and the scales tip, as the crowd
// thinks, towards the three — a question hangs over the beam. "No, I tell you": the beam swings level, the sacks weigh
// the same, and an equals sign takes the question's place. "But unless you repent, you will all perish in the same
// way": a shadow creeps over the slope and over all the people — but a man at the front lets his own dark sack
// fall from his back and kneels before Jesus, and he stays in the light.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  teachSet, TG, PILGRIMS, beamBar, pan, sinSack, fig13, question, equals, wordTag, onString, knot, headAt, handF,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX } = TG;
const PX = 800, PY = 244, ARM = 200, DROP = 96;
const PM = [684, GY + 34];            // the man who repents
const PENITENT = { robe: C.sageRobe, mantle: C.clayMantle, hairStyle: 'curly', hair: C.hair3, beard: 'short', skin: C.skin3, belt: C.leather };

export default {
  id: 'lk13-worse',
  beats: [
    { v: 2 },
    { v: 3, text: 'Bynajmniej, powiadam wam;' },
    { v: 3, cont: true, text: 'lecz jeśli się nie nawrócicie, wszyscy podobnie zginiecie.' },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S, { extra: true });
    const c = S.c;

    /* the scales */
    const balL = T0.FL;
    const beam = balL.add(`<g>${onString(beamBar(c, ARM), 1600)}</g>`);
    const pans = [-1, 1].map((side) => ({ side, el: balL.add(`<g>${pan(c, DROP, 150)}</g>`) }));
    const sackW = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">${sinSack(c, 30, 32)}</g>`;
    const left = balL.add(`<g>${PILGRIMS.map((o, i) => `<g transform="translate(${-40 + i * 34} 0)">${fig13(c, o, { s: 0.3, flip: false, head: 6 })}</g>`).join('')}${sackW(52, 0, 1.2)}</g>`);
    const rightM = knot('lk13-others', 7, { s: 0.34, spread: 22, rows: 2, flip: true });
    const right = balL.add(`<g><g transform="translate(-12 -4)">${rightM}</g>${sackW(-60, 0, 1.2)}</g>`);
    const tagL = balL.add(`<g>${wordTag(c, tr('ci Galilejczycy', 'these Galileans'), { size: 18 })}</g>`);
    const tagR = balL.add(`<g>${wordTag(c, tr('wszyscy inni', 'all the others'), { size: 18 })}</g>`);
    const q = balL.add(`<g>${question(c)}</g>`);
    const eq = balL.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 26, 20), 0.4, 4), C.cream).out()}${equals(c, 28, C.terracotta)}</g>`);

    /* v3b: the sacks on every back, the shadow, the one who kneels */
    const shadeL = T0.shadeL, glowL = T0.glowL;
    const glow = glowL.add(`<g opacity="0"><ellipse rx="190" ry="210" fill="url(#halo-glow)"/></g>`);
    const pen = S.puppet(T0.act.add(person(c, PENITENT)));
    const penK = S.puppet(T0.act.add(person(c, { ...PENITENT, pose: 'kneel' })));
    const penSack = T0.act.add(`<g>${sinSack(c, 32, 34)}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T);
      T0.groups.forEach((g) => g.sp.set({ x: g.x, y: g.y }));

      /* v2 — the scales come down and tip towards the three */
      const inK = es(t, 0.05, 0.32, ease.out) * (1 - es(t, 2.0, 2.25, ease.in));
      const py = lerp(-900, PY, inK);
      const tilt = -es(t, 0.35, 0.6, ease.out) * 9 * (1 - es(t, 1.1, 1.4, ease.back)) + (T ? Math.sin(T * 1.1) * 0.6 : 0);
      pose(beam, { x: PX, y: py, r: tilt });
      const r = (tilt * PI) / 180;
      pans.forEach((p) => {
        const ex = PX + p.side * Math.cos(r) * ARM, ey = py + p.side * Math.sin(r) * ARM;
        pose(p.el, { x: ex, y: ey });
        const [el, tg] = p.side < 0 ? [left, tagL] : [right, tagR];
        pose(el, { x: ex, y: ey + DROP });
        pose(tg, { x: ex, y: ey + DROP + 44 });
      });
      const qk = es(t, 0.4, 0.55, ease.back) * (1 - es(t, 1.15, 1.25));
      pose(q, { x: PX, y: py - 62 + (T ? Math.sin(T * 2) * 3 : 0), s: qk * 1.3, o: qk > 0.02 ? 1 : 0 });
      const ek = es(t, 1.22, 1.4, ease.back);
      pose(eq, { x: PX, y: py - 58, s: ek * 1.2, o: ek > 0.02 && inK > 0.01 ? 1 : 0 });

      /* Jesus: turns to all, asks; shakes His head; then reaches to the man who kneels */
      const shake = bump(t, 1.05, 1.5) * Math.sin(t * 40) * 8;
      const reach = es(t, 2.55, 2.75);
      T0.jesus.set({ x: JX, y: GY, s: 1.06, flip: reach > 0.5 || t < 0.5, armF: 20 + bump(t, 0.1, 0.9) * 50 + reach * 50, armB: 10 + bump(t, 0.1, 0.9) * 80 + bump(t, 2.05, 2.5) * 70, head: shake - reach * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, reach > 0.5);
      T0.voice(hx, hy, bump(t, 0.02, 0.9) * 0.7 + bump(t, 1.02, 1.8) * 0.7 + bump(t, 2.02, 2.5) * 0.7, T, { spread: 1.8 });

      /* v3b — everyone's sack; the shadow comes over them; one kneels and lays it down */
      const creep = es(t, 2.35, 2.72);
      shadeL.shift(lerp(1300, -900, creep), 0);
      shadeL.fade(creep * 0.5);
      const kneel = es(t, 2.46, 2.53);
      const inP = es(t, 2.1, 2.3);
      pen.set({ x: PM[0], y: PM[1], s: 1.0, flip: false, armF: 20 + inP * 10, armB: 10, head: -4, o: inP * (1 - kneel), blink: blinkAt(T, 3) });
      penK.set({ x: PM[0] + 6, y: PM[1], s: 1.0, flip: false, armF: 70, armB: 110, head: -10, o: kneel });
      const drop = es(t, 2.5, 2.64, ease.in);
      pose(penSack, { x: lerp(PM[0] - 18, PM[0] - 62, drop), y: lerp(PM[1] - 80, PM[1] + 2, drop) - (1 - inP) * 500, r: drop * -30, o: inP > 0.01 ? 1 - es(t, 2.72, 2.95) * 0.85 : 0 });
      pose(glow, { x: PM[0] + 60, y: PM[1] - 90, s: 0.6 + es(t, 2.55, 2.8) * 0.5, o: es(t, 2.52, 2.75) });
      void handF; void mix; void shade; void seg; void CAST; void lerp;

      S.cam.x = 0;
      S.cam.y = -12;
      S.cam.z = 1.03;
    };
  },
};
