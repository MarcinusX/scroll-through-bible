// Mt 6,14–15 — back on the mountain; two painted plates hang on either side of Jesus. Left: a man takes his
// kneeling debtor's note and tears it in two — and the dark slate of his own debts, hanging above him in a ray of
// heaven's light, is wiped clean. Right: another man turns his back on his debtor and clutches the note — the light
// over him closes like a shutter, and his own slate stays dark, chained shut.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { mount, mountFront, plateBoard, pose3, slate, noteHalf, scrap, sparkle, manOf, QUIET, tr, PI } from './lib.js';

const PW = 330, PH = 270, PY = 175;
const LXP0 = 648, RXP0 = 1010;    // plate centres (left, right)

function chain(c, w = 150) {
  let d = '';
  for (let i = 0; i < 9; i++) { const x = -w / 2 + (i * w) / 8, y = (i % 2 ? 4 : -4); d += c.cut(c.ell(x, y, 10, 5.5, 10, i % 2 ? 0.5 : -0.5), 0.2, 3) + c.hole(c.ell(x, y, 5.5, 2.2, 8, i % 2 ? 0.5 : -0.5), 0.1, 3); }
  return sheet().p(d, mix(C.rock3, C.storm, 0.3)).out();
}

export default {
  id: 'mt6-forgive',
  beats: [
    { v: 14 },
    { v: 15 },
  ],
  cam: { x: [-30, 30], y: [-70, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const M = mount(S, { sunAt: [1370, 110] });
    // phone: the two plates hang side by side across the usable width, the right one a little lower and
    // overlapping the left one's edge, so neither is cut by the frame or the thread
    const LXP = S.portrait ? 640 : LXP0, RXP = S.portrait ? 915 : RXP0, BDY = S.portrait ? 26 : 0;
    const plateL = S.layer({ par: 0.12, sh: 6 });
    const debtorA = manOf(c, { robe: C.stone2, mantle: null, hairStyle: 'short', beard: 'short' });
    const debtorB = manOf(c, { robe: C.wheatRobe, mantle: null, hairStyle: 'curly', beard: 'none' });

    /* the left plate: forgiving */
    const boardA = plateL.add(`<g>${plateBoard(c, PW, PH, { fill: mix(C.parchment, C.dawn, 0.3), ground: mix(C.sand, C.sage2, 0.4), gy: 0.78 })}</g>`);
    const figsA = plateL.add(`<g>${pose3(c, [
      { x: -30, y: 0, s: 0.62, flip: false, o: QUIET, armF: 70, armB: 40 },
      { x: 70, y: 4, s: 0.62, flip: true, o: { ...debtorA, pose: 'kneel' }, armF: 70, armB: 50, head: 10 },
    ])}</g>`);
    const halfA1 = plateL.add(`<g>${noteHalf(c, -1, 30, 38)}</g>`), halfA2 = plateL.add(`<g>${noteHalf(c, 1, 30, 38)}</g>`);
    const rayA = plateL.add(`<path d="${c.poly([[-14, 0], [14, 0], [50, 120], [-50, 120]])}" fill="#fff3cf" opacity=".6"/>`);
    const slateA = plateL.add(`<g>${slate(c, 110, 74)}</g>`);
    const MA = Array.from({ length: 5 }, (_, i) => ({ i, dx: -30 + (i % 3) * 30, dy: -10 + Math.floor(i / 3) * 22, el: plateL.add(`<g>${scrap(c, 8)}</g>`) }));
    const glowA = plateL.add(`<circle r="70" fill="url(#halo-glow)"/>`);

    /* the right plate: refusing */
    const boardB = plateL.add(`<g>${plateBoard(c, PW, PH, { fill: mix(C.parchment, C.storm, 0.18), ground: mix(C.sand2, C.storm, 0.2), gy: 0.78 })}</g>`);
    const figsB = plateL.add(`<g>${pose3(c, [
      { x: 40, y: 0, s: 0.62, flip: true, o: { robe: C.plumRobe, mantle: C.ochre, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full', belt: C.ochre, holdF: `<g transform="translate(2 4)">${noteHalf(c, -1, 30, 38)}${noteHalf(c, 1, 30, 38)}</g>` }, armF: 110, armB: 50, head: -14 },
      { x: -70, y: 4, s: 0.62, flip: false, o: { ...debtorB, pose: 'kneel' }, armF: 80, armB: 60, head: -6 },
    ])}</g>`);
    const rayB = plateL.add(`<path d="${c.poly([[-14, 0], [14, 0], [50, 120], [-50, 120]])}" fill="#fff3cf" opacity=".6"/>`);
    const shutter = plateL.add(`<g>${sheet().p(c.cut(c.rect(-60, -8, 120, 16), 0.3, 6), C.wood2).p(c.cut(c.rect(-56, -6, 112, 12), 0.2, 6), C.wood).out()}</g>`);
    const slateB = plateL.add(`<g>${slate(c, 110, 74)}</g>`);
    const MB = Array.from({ length: 5 }, (_, i) => ({ i, dx: -30 + (i % 3) * 30, dy: -10 + Math.floor(i / 3) * 22, el: plateL.add(`<g>${scrap(c, 8)}</g>`) }));
    const chainEl = plateL.add(`<g>${chain(c, 110)}</g>`);

    mountFront(S);

    return (t, time) => {
      const T = time;
      const toL = es(t, 0.02, 0.25) * (1 - es(t, 0.95, 1.1));
      const toR = es(t, 1.02, 1.25);
      M.pose(t, T, { flip: toL > 0.5, armF: 20 + toL * 70 + toR * 70, armB: 10 + (toL + toR) * 20, head: -(toL + toR) * 6, blink: blinkAt(T) });
      M.listen(T, (d) => ({ head: (d.flip ? 3 : -3) - 8, blink: blinkAt(T, d.seed) }));

      /* the plates come down */
      const ka = es(t, 0.0, 0.3, ease.out), kb = es(t, 1.0, 1.3, ease.out);
      const ay = lerp(-600, PY, ka) + (T ? Math.sin(T * 0.8) * 2 : 0), by = lerp(-600, PY + BDY, kb) + (T ? Math.sin(T * 0.8 + 1) * 2 : 0);
      const oa = ka > 0.005 ? 1 : 0, ob = kb > 0.005 ? 1 : 0;
      pose(boardA, { x: LXP, y: ay, o: oa });
      const ga = ay + PH * 0.78 + 6;
      pose(figsA, { x: LXP, y: ga, o: oa });
      // the note torn
      const tear = es(t, 0.35, 0.5);
      const fall = es(t, 0.5, 0.8);
      const nx = LXP + 2, ny = ga - 52;
      pose(halfA1, { x: nx - 8 - tear * 8 - fall * 20, y: ny + fall * 50, r: -tear * 30 - fall * 120, o: oa * (fall < 1 ? 1 : 0) });
      pose(halfA2, { x: nx + 8 + tear * 8 + fall * 18, y: ny + fall * 54, r: tear * 30 + fall * 140, o: oa * (fall < 1 ? 1 : 0) });
      // his slate, wiped clean in the light
      pose(rayA, { x: LXP - 20, y: ay + 12, o: oa * es(t, 0.45, 0.65) * 0.8 });
      pose(slateA, { x: LXP - 20, y: ay + 56, o: oa });
      MA.forEach((m) => {
        const k = es(t, 0.55 + m.i * 0.05, 0.8 + m.i * 0.05);
        pose(m.el, { x: LXP - 20 + m.dx, y: ay + 56 + m.dy - k * 60, s: 1 - k * 0.7, o: oa * (1 - k) });
      });
      const ca = es(t, 0.75, 0.95);
      pose(glowA, { x: LXP - 20, y: ay + 56, s: 0.6 + ca * 0.4, o: oa * ca });

      /* the right plate: he keeps the note; the light is shut, the slate chained */
      pose(boardB, { x: RXP, y: by, o: ob });
      const gb = by + PH * 0.78 + 6;
      pose(figsB, { x: RXP, y: gb, o: ob });
      const shut = es(t, 1.45, 1.65);
      pose(rayB, { x: RXP + 20, y: by + 12, sy: 1 - shut * 0.9, o: ob * 0.8 * (1 - shut) });
      pose(shutter, { x: RXP + 20 + (1 - shut) * 200, y: by + 20, o: ob * (shut > 0.01 ? 1 : 0) });
      pose(slateB, { x: RXP + 20, y: by + 56, o: ob });
      MB.forEach((m) => pose(m.el, { x: RXP + 20 + m.dx, y: by + 56 + m.dy, o: ob }));
      const ch = es(t, 1.6, 1.8, ease.back);
      pose(chainEl, { x: RXP + 20, y: by + 56, r: -18, s: ch, o: ob * (ch > 0.02 ? 1 : 0) });

      S.cam.z = 1.02 + es(t, 0.0, 0.5) * 0.02;
      S.cam.y = -50;
      S.cam.x = -20 * toL + 20 * toR;
    };
  },
};
