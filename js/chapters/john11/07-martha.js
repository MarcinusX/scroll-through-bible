// J 11,21–24 — on the road below Bethany Martha meets Jesus. "Lord, if You had been here, my brother would not have
// died": a small frame shows the bed and, beside it, the dotted outline of Someone who was not there. "Even now I
// know that God will give You whatever You ask": she lifts her face; far above, the Father's light (never a figure)
// and a golden thread from Jesus's raised hand to it, with sparks coming down. "Your brother will rise again": a
// little cave-plate, and the friend's portrait rising out of it in light. "I know he will rise … on the last day":
// Martha points far away — a string of day-discs dwindles toward the horizon, to a tiny dawn at the very end.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  bethanySet, WARM, DISC, LAZARUS, martha, withFace, faceBits, framed, bedIcon, absentOutline, radiance, caveIcon, medallion, hungPlate, spark,
  strip, hang2, dayDisc, vis, kf, moving, hand, pose, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = 706;

export default {
  id: 'j11-martha',
  beats: [
    { v: 21 },
    { v: 22 },
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-60, 150], y: [-90, 30], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = bethanySet(S, { skyCols: WARM, sunAt: [560, 150] });
    const skyL = S.layer({ par: 0.06, sh: 1 });
    const light = skyL.add(`<g><circle r="260" fill="url(#halo-glow)"/>${radiance(c, 70)}</g>`);
    const thrL = S.layer({ par: 0.5, sh: 1 });
    const thread = thrL.add(`<g><path d="" fill="${C.haloRim}"/></g>`);
    const threadP = thread.querySelector('path');
    const sparks = [0, 1, 2, 3].map(() => thrL.add(`<g>${spark(c, 9)}</g>`));

    const A = S.layer({ par: 0.52, sh: 5 });
    const DP = [[640, F + 4], [570, F + 16], [505, F + 6], [445, F + 18], [390, F + 8], [330, F + 14]];
    const disc = DISC.map((o, i) => ({ i, x: DP[i][0], y: DP[i][1], p: S.puppet(A.add(person(c, o))) }));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const mt = S.puppet(A.add(martha(c, {}, faceBits(c))));
    const tear = mt.el.querySelector('[data-part="tear"]'), sad = mt.el.querySelector('[data-part="sad"]');
    set.front();

    const X = S.layer({ par: 0.56, sh: 6 });
    // "if You had been here"
    const PW = 300, PH = 180;
    const inner = `<rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" fill="${mix(C.plaster, C.parchment, 0.4)}"/><rect x="${-PW / 2}" y="${PH / 2 - 30}" width="${PW}" height="30" fill="${mix(C.sand2, C.stone2, 0.4)}"/>` +
      `<g transform="translate(40 ${PH / 2 - 28}) scale(1.5)">${bedIcon(c, LAZARUS)}</g><g class="ghost" transform="translate(-70 ${PH / 2 - 26}) scale(.7)"><circle cy="-100" r="90" fill="url(#halo-glow)"/>${absentOutline(c, 1.1, C.terracotta)}</g>`;
    const ifP = X.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'if' })}</g>`);
    const ghost = ifP.querySelector('.ghost');
    // "your brother will rise"
    const rise = X.add(`<g>${hungPlate(c, `<g transform="translate(0 44)">${caveIcon(c, { sc: 1.1, open: true })}</g>`, { r: 74, fill: mix(C.skyBlue, C.cream, 0.5) })}</g>`);
    const riseHead = X.add(`<g><circle r="40" fill="url(#halo-glow)"/>${medallion(c, LAZARUS, { r: 20, rim: C.haloRim, back: C.cream })}</g>`);
    // "on the last day": a string of days toward a far dawn
    const N = 8;
    const trail = Array.from({ length: N }, (_, i) => ({ i, el: X.add(`<g>${hang2(dayDisc(c, '', 20), 0.01, 300)}</g>`) }));
    const lastDay = X.add(`<g><circle r="70" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, 22, 16, 14, 0), 0.3, 3), C.sunDeep).p(c.cut(c.circ(0, 0, 13, 14), 0.3, 3), C.sun).out()}</g>`);
    const lastT = X.add(`<g>${strip(c, tr('dzień ostateczny', 'the last day'), { size: 16 })}</g>`);

    const P = S.portrait;   // phone: the string of days and the last day inside the screen
    return (t, time) => {
      const T = time;
      pose(set.sunEl, { x: 560, y: 150, r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 900 + Math.sin(T * 0.1) * 20, y: 170, r: 0 });

      /* Martha before Jesus */
      const plead = es(t, 0.1, 0.4) * (1 - es(t, 0.9, 1.1));
      const lift = es(t, 1.05, 1.35) * (1 - es(t, 1.9, 2.1));
      const far = es(t, 3.1, 3.4);
      mt.set({ x: 930, y: F + 12, s: 0.98, flip: true, armF: 20 + plead * 60 + lift * 70 + far * 80 * (1 - es(t, 3.8, 4)), armB: 10 + plead * 40 + lift * 60, head: 8 * plead - lift * 12 - far * 6, lean: -plead * 3, blink: blinkAt(T, 2) });
      if (tear) tear.setAttribute('opacity', (es(t, 0.2, 0.4) * (1 - es(t, 1.9, 2.2))).toFixed(2));
      if (sad) sad.setAttribute('opacity', (es(t, 0.1, 0.3) * (1 - es(t, 1.2, 1.4))).toFixed(2));
      const pray = es(t, 1.3, 1.6) * (1 - es(t, 1.95, 2.1));
      const speak = es(t, 2.05, 2.3) * (1 - es(t, 2.85, 3.0));
      jesus.set({ x: 800, y: F + 12, s: 1.04, armF: 16 + speak * 55, armB: 10 + pray * 120, head: -pray * 12 + es(t, 3.2, 3.5) * 3, blink: blinkAt(T, 1) });
      disc.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.92, armF: 10, head: -pray * 8, blink: blinkAt(T, d.i + 4) }));

      /* v21 — the frame: the bed, and the outline of the One who was not there */
      const fk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 0.95, 1.15));
      vis(ifP, { x: 860, y: 300 - (1 - fk) * 520, r: Math.sin(T * 0.7) * 0.8, o: fk > 0.01 ? 1 : 0 });
      if (ghost) ghost.setAttribute('opacity', (0.6 + 0.3 * Math.sin(T * 2)).toFixed(2));

      /* v22 — the Father's light and the golden thread */
      const lk = es(t, 1.1, 1.4) * (1 - es(t, 1.95, 2.15));
      vis(light, { x: 800, y: 120, s: 0.8 + lk * 0.3, r: T * 3, o: lk });
      const [hx, hy] = hand(800, F + 12, 1.04, false, 10 + pray * 120, 0);
      const bx = hx - 18, by = hy - 20;
      const tk = es(t, 1.35, 1.65);
      if (tk > 0.01 && lk > 0.01) {
        const ey = lerp(by, 170, tk);
        threadP.setAttribute('d', c.ribbon([[bx, by], [lerp(bx, 800, 0.5) + Math.sin(T) * 4, lerp(by, ey, 0.5)], [lerp(bx, 800, tk), ey]], 2.2));
      }
      pose(thread, { o: tk * lk });
      sparks.forEach((sp, i) => {
        const u = T ? ((T * 0.3 + i / 4) % 1) : (i + 0.5) / 4;
        vis(sp, { x: lerp(800, bx, u), y: lerp(170, by, u), s: 0.8, o: tk * lk * Math.sin(u * PI) });
      });

      /* v23 — the brother will rise */
      const rk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.15));
      const ry = 300 - (1 - rk) * 520;
      vis(rise, { x: 860, y: ry, r: Math.sin(T * 0.7) * 1.2, o: rk > 0.01 ? 1 : 0 });
      const up = es(t, 2.35, 2.8, ease.out);
      vis(riseHead, { x: 860, y: ry + 10 - up * 44, s: up, o: rk > 0.01 && up > 0.01 ? 1 : 0 });

      /* v24 — far off, the last day */
      trail.forEach((d) => {
        const u = d.i / (N - 1);
        const k = es(t, 3.1 + d.i * 0.06, 3.35 + d.i * 0.06, ease.out);
        vis(d.el, { x: lerp(P ? 985 : 1000, P ? 1105 : 1180, u), y: lerp(380, 250, Math.pow(u, 0.8)) - (1 - k) * 520, s: lerp(1, 0.4, u), r: Math.sin(T * 0.8 + d.i) * 2, o: k > 0.01 ? 1 : 0 });
      });
      const lk2 = es(t, 3.6, 3.85, ease.back);
      vis(lastDay, { x: P ? 1122 : 1200, y: 236, s: lk2 * 0.8, r: T * 4, o: lk2 > 0.01 ? 1 : 0 });
      vis(lastT, { x: P ? 1095 : 1160, y: P ? 296 : 290, o: lk2 });

      S.cam.x = kf(t, [[0, 40], [1, 20], [2, 20], [3, 60], [4, P ? 140 : 110]]);
      S.cam.y = kf(t, [[0, -40], [1, -80], [2, -40], [3, -40], [4, -40]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.0], [2, 1.08], [3, 1.04], [4, 1.06]]);
    };
  },
};
