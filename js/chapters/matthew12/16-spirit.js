// Mt 12,31–32 — the square again. Over the heads of the crowd hang little dark knots of paper — sins and hard words.
// "Every sin and blasphemy will be forgiven": one by one they loosen into sparks of light and rise away. "But not
// blasphemy against the Spirit": high over Jesus the dove shines in its light, and one scribe turns and shakes his fist
// at it — his knot does not loosen but grows heavier. "A word against the Son of Man will be forgiven": a man in the
// crowd shouts at Jesus; He only looks at him kindly, the jagged bubble turns white and flutters away, and the man
// bows his head. "But against the Holy Spirit — not in this age, nor in the age to come": the scribe shouts his dark
// word up at the light; the light draws back from him, a shadow closes round him, and two tags hang crossed out over
// him — this age, the age to come.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { squareSet, SQ, manOf, headAt, kf, sinKnot, shout, bang, dove1, flapWings, rayBurst, tagText, crossX, sparkle, glow, tr, PI } from './lib.js';

const F = SQ.FEET;

export default {
  id: 'mt12-spirit',
  beats: [
    { v: 31, text: 'Dlatego powiadam wam: Każdy grzech i bluźnierstwo będą odpuszczone ludziom,' },
    { v: 31, cont: true, text: 'ale bluźnierstwo przeciwko Duchowi nie będzie odpuszczone.' },
    { v: 32, text: 'Jeśli ktoś powie słowo przeciw Synowi Człowieczemu, będzie mu odpuszczone,' },
    { v: 32, cont: true, text: 'lecz jeśli powie przeciw Duchowi Świętemu, nie będzie mu odpuszczone ani w tym wieku, ani w przyszłym.' },
  ],
  cam: { x: [-30, 40], y: [-40, 50], z: [1, 1.14] },
  build(S) {
    const Q = squareSet(S, { dis: ['peter', 'john'], ph: 2 });
    const c = Q.c;
    const act = Q.act;
    const AX = 610;
    const shouter = S.puppet(act.add(person(c, manOf(c, { robe: C.clayMantle, beard: 'full', hairStyle: 'curly', skin: C.skin3 }))));

    /* the shadow that closes round the scribe (a flat sheet: no paper shadow of its own) */
    const shadeL = S.layer({ par: 0.5, sh: 1, flat: true });
    const dg = S.id('dark');
    S.defs(`<radialGradient id="${dg}"><stop offset="0" stop-color="#2a2338" stop-opacity=".6"/><stop offset=".6" stop-color="#2a2338" stop-opacity=".35"/><stop offset="1" stop-color="#2a2338" stop-opacity="0"/></radialGradient>`);
    const shadow = shadeL.add(`<g opacity="0"><ellipse cy="-110" rx="130" ry="170" fill="url(#${dg})"/></g>`);
    /* the knots over the heads */
    const fx = S.layer({ par: 0.4, sh: 4 });
    const KN = [[430, 520], [500, 505], [560, 528], [640, 510], [940, 515], [1060, 508], [1130, 525], [1190, 505], [AX, 480]]
      .map(([x, y], i) => ({ i, x, y, el: fx.add(`<g>${sinKnot(c, 12 + (i % 3) * 2)}</g>`), sp: fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`), at: 0.15 + (i % 8) * 0.06 }));
    const hard = fx.add(`<g>${sinKnot(c, 16)}</g>`);
    const bubbleA = fx.add(`<g opacity="0"><g data-part="dark">${shout(c, bang(c, 26), { w: 64, h: 50, fill: mix(C.stone2, C.storm, 0.3) })}</g><g data-part="white" opacity="0">${shout(c, sparkle(c, 12, C.sun), { w: 64, h: 50, fill: C.cream })}</g></g>`);
    const bDark = bubbleA.querySelector('[data-part="dark"]'), bWhite = bubbleA.querySelector('[data-part="white"]');
    const bubbleP = fx.add(`<g opacity="0">${shout(c, bang(c, 28, C.cream), { w: 70, h: 56, fill: '#3b3243', flip: true })}</g>`);

    /* the dove in its light */
    const hangL = S.layer({ par: 0.2, sh: 5 });
    const rays = hangL.add(`<g opacity="0">${glow(160, 1, 'halo-glow')}${rayBurst(c, { n: 18, r0: 40, r1: 260, spread: 0.045, color: '#fff3cf', o: 0.55 })}</g>`);
    const doveEl = hangL.add(dove1(c));
    const ages = [tr('w tym wieku', 'in this age'), tr('w przyszłym', 'in the age to come')].map((w, i) => hanging(hangL, `${tagText(c, w, { size: 18 })}<g transform="translate(${w.length * 4.5 + 20} 0)">${crossX(c, 12)}</g>`, { x: 0, y: -300, len: 900 }));

    return (t, time) => {
      const T = time;
      const turn = es(t, 1.2, 1.3);
      const shake = bump(t, 1.3, 1.9) + bump(t, 3.1, 3.6);
      const dark = es(t, 3.35, 3.6);
      Q.pose(t, T,
        { flip: t > 2.05 && t < 2.95, armF: 16 + bump(t, 0.1, 0.9) * 40 + es(t, 2.3, 2.5) * (1 - es(t, 2.9, 3.0)) * 40, armB: 8 + bump(t, 0.1, 0.9) * 60, head: -2 + es(t, 2.3, 2.5) * (1 - es(t, 2.9, 3.0)) * 6 - es(t, 3.2, 3.4) * 4, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x - 150, y: F - 30, s: 0.86, blink: blinkAt(T, d.seed) }),
        (m) => (m.i === 0
          ? { x: 1000, y: F + 10, flip: turn < 0.5, armF: 10 + shake * 110, armB: 10 + shake * 30, head: turn > 0.5 ? -10 - shake * 8 : 0, lean: -shake * 4, blink: blinkAt(T, m.seed) }
          : { x: 1100, armF: 8, armB: 4, head: es(t, 1.3, 1.5) * 8, blink: blinkAt(T, m.seed) }));

      /* v31a — the knots loosen into light */
      KN.forEach((k) => {
        const at = k.i === 8 ? 2.55 : k.at;
        const u = es(t, at, at + 0.2);
        pose(k.el, { x: k.x, y: k.y - u * 30, s: 1 - u * 0.7, r: u * 180 + Math.sin(T * 0.8 + k.i) * 6 * (1 - u), o: 1 - u });
        const v = seg(t, at + 0.1, at + 0.7);
        pose(k.sp, { x: k.x, y: k.y - 20 - v * 140, s: Math.sin(v * PI), r: v * 120, o: v > 0 && v < 1 ? 1 : 0 });
      });
      const [phx, phy] = headAt(1000, F + 10, 0.96, turn < 0.5);
      pose(hard, { x: phx, y: phy - 58, s: 1 + es(t, 1.4, 1.7) * 0.5 + dark * 0.3, r: Math.sin(T * 0.8) * 5 });

      /* v31b — the dove in its light; the scribe shakes his fist at it */
      const dv = es(t, 1.02, 1.4);
      const DX = 800, DY = 250;
      pose(doveEl, { x: lerp(DX + 320, DX, dv), y: lerp(90, DY, dv), s: 1.1, sx: -1, o: dv > 0.001 ? 1 : 0 });
      flapWings(doveEl, time ? T : 0.3, dv < 1 ? 34 : 18, dv < 1 ? 7 : 2.6);
      pose(rays, { x: DX, y: DY - 10, s: 0.7 + dv * 0.4 - dark * 0.2, r: T * 3, o: dv * (1 - dark * 0.3) });

      /* v32a — a word against the Son of Man, forgiven */
      const aShout = bump(t, 2.05, 2.5);
      const bow = es(t, 2.55, 2.8);
      shouter.set({ x: AX, y: F + 18, s: 0.97, flip: false, armF: 20 + aShout * 90 - bow * 10, armB: 10 + aShout * 40, head: -aShout * 8 + bow * 14, lean: bow * 6, blink: bow > 0.5 ? 0.9 : blinkAt(T, 3) });
      const [ahx, ahy] = headAt(AX, F + 18, 0.97, false);
      const ba = es(t, 2.08, 2.2, ease.back);
      const wh = es(t, 2.45, 2.6);
      const fly = es(t, 2.6, 2.95, ease.in);
      pose(bubbleA, { x: ahx + 20 + fly * 60, y: ahy - 20 - fly * 200, s: ba * (1 - fly * 0.5), r: fly * 40, o: ba > 0.01 ? 1 - fly : 0 });
      pose(bDark, { o: 1 - wh });
      pose(bWhite, { o: wh });

      /* v32b — a word against the Spirit: the light draws back, the shadow closes in */
      const bp = es(t, 3.12, 3.25, ease.back);
      pose(bubbleP, { x: phx - 20, y: phy - 90, s: bp, r: -10, o: bp > 0.01 ? 1 : 0 });
      pose(shadow, { x: 1000, y: F + 10, sx: 0.9 + dark * 0.2, o: dark });
      ages.forEach((a, i) => {
        const k = es(t, 3.45 + i * 0.1, 3.7 + i * 0.1, ease.back);
        pose(a, { x: 1030 + (i ? 70 : -60), y: lerp(-300, 340 + i * 44, k), r: Math.sin(T * 0.9 + i) * 1, oy: 0, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [1.1, 0], [1.4, 30], [1.95, 30], [2.2, -30], [2.95, -30], [3.2, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.1, 1.06], [1.4, 1.08], [2.2, 1.12], [2.95, 1.12], [3.2, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.1, 10], [1.4, 0], [2.2, 40], [2.95, 40], [3.2, 10]]);
    };
  },
};
