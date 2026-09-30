// Łk 12,41 — night on the plain; Jesus on the rise with the four, each holding his little lit lamp. Peter steps forward
// with his lamp and asks: "Lord, are you telling this parable to us, or to everybody?" — over him two small paper
// bubbles: the few of them round a lamp, and a whole crowd of little heads, with a "?" between.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { behindOf, plainSet, standNear, RISE, NIGHT, lampBody, lampFire, WICK, palm, speech, headAt, figure, folk, manO, womanO, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const JX = 800;

export default {
  id: 'lk12-peter',
  beats: [
    { v: 41 },
  ],
  cam: { x: [-60, 20], y: [-30, 30], z: [1, 1.14] },
  build(S) {
    const P = plainSet(S, { skyCols: NIGHT, crowd: false, near: true });
    const c = S.c;
    const starL = behindOf(S.layer({ par: 0.02, sh: 1, flat: true }), P.hangL);
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 380, n: 130 }));
    const dim = S.layer({ par: 0, sh: 0, flat: true });
    behindOf(dim, P.act);
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2150" opacity=".45"/>`);
    const glowL = behindOf(S.layer({ par: 0.4, sh: 0, flat: true }), P.act);
    const bodies = P.near.map(() => P.act.add(`<g>${lampBody(c)}</g>`));
    const fires = P.near.map(() => P.fx.add(`<g>${lampFire(c, 0)}</g>`));
    const glows = P.near.map(() => glowL.add(`<g><circle r="80" fill="url(#warm-glow)"/></g>`));
    const jGlow = glowL.add(`<g><circle r="170" fill="url(#halo-glow)" opacity=".7"/></g>`);
    const pc = makeCutter('lk12-us-all');
    const few = `<g transform="translate(0 -4)">${[-16, 0, 16].map((x, i) => figure(pc, i === 1 ? CAST.peter : manO(pc), { x, y: 18, s: 0.16 })).join('')}</g>`;
    const all = `<g transform="translate(0 -4)">${Array.from({ length: 9 }, (_, i) => figure(pc, i % 2 ? womanO(pc) : manO(pc), { x: (i % 5 - 2) * 11 + (i > 4 ? 5 : 0), y: 12 + (i > 4 ? 10 : 0), s: 0.12 })).join('')}</g>`;
    const bubA = P.fx.add(`<g opacity="0">${speech(c, few, { w: 78, h: 56 })}</g>`);
    const bubB = P.fx.add(`<g opacity="0">${speech(c, all, { w: 86, h: 60, flip: true })}</g>`);
    const q = P.fx.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="46" font-weight="600" fill="${C.sun}">?</text></g>`);

    return (t, time) => {
      const T = time;
      P.update(T, { sunY: 1200 });
      const step = es(t, 0.05, 0.3);
      const ask = bump(t, 0.25, 0.95);
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, flip: true, armF: 16 + es(t, 0.7, 0.9) * 30, armB: 8, head: 6, blink: blinkAt(T) });
      pose(jGlow, { x: JX, y: RISE - 120 });
      standNear(P, T, (d) => {
        const peter = d.k === 'peter';
        const x = peter ? d.x - step * 20 : d.x;
        return { x, y: d.y + (peter ? step * 34 : 0), armF: 56 + (peter ? ask * 20 : 0), armB: 6 + (peter ? ask * 80 : 0), head: peter ? -ask * 6 : -4 };
      });
      P.near.forEach((d, i) => {
        const peter = d.k === 'peter';
        const x = peter ? d.x - step * 20 : d.x;
        const [px, py] = palm(x, d.y + (peter ? step * 34 : 0), 0.94, d.flip, 56 + (peter ? ask * 20 : 0));
        pose(bodies[i], { x: px, y: py, sx: d.flip ? -1 : 1 });
        const wx = px + (d.flip ? -1 : 1) * WICK[0], wy = py + WICK[1];
        pose(fires[i], { x: wx, y: wy, s: 1 + (time ? Math.sin(T * 9 + i) * 0.05 : 0) });
        pose(glows[i], { x: wx, y: wy - 10 });
      });
      const pd = P.near.find((d) => d.k === 'peter');
      const [hx, hy] = headAt(pd.x - step * 20, pd.y + step * 34, 0.94, false);
      const ka = es(t, 0.3, 0.45, ease.back), kb = es(t, 0.45, 0.6, ease.back);
      pose(bubA, { x: hx + 16, y: hy - 50, s: ka * 1.3, o: ka > 0.01 ? 1 : 0 });
      pose(bubB, { x: hx + 300, y: hy - 80, s: kb * 1.3, o: kb > 0.01 ? 1 : 0 });
      const qk = es(t, 0.55, 0.7, ease.back);
      pose(q, { x: hx + 170, y: hy - 130, s: qk, o: qk > 0.01 ? 1 : 0 });
      S.cam.x = -40 + es(t, 0.2, 0.5) * 20;
      S.cam.z = 1.14;
      S.cam.y = 30 - es(t, 0.3, 0.6) * 30;
    };
  },
};
