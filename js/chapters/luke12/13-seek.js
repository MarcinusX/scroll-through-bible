// Łk 12,29–31 — Jesus on the rise with the disciples sitting round Him. "Do not seek what you will eat or what you will
// drink; neither be anxious": little paper questions pop up over them — a loaf? a cup? — and He shakes His head and they
// fold away. "For the nations of the world seek after all these things": a paper globe comes down on its string and tiny
// people run round and round it, chasing a loaf and a jug that dangle ahead of them, never reaching them; "but your
// Father knows that you need them": on the other side a soft light opens from above (no figure), and in it the loaf, the
// cup and a cloak hang quietly, kept. "But seek His Kingdom": a golden crown of light comes down over the rise and the
// disciples lift their faces to it — "and these things will be added to you": the loaf, the cup and the cloak float
// down out of the light and are set on the grass beside them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tunic } from '../mark6/lib.js';
import { behindOf, plainSet, RISE, DAY, seatDisciples, poseSeated, globe, kingdomDisc, loaf, cup, jug, bubble, headAt, voiceRings, onString, halo, figure, manO, womanO, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const JX = 800;
const GX = 600, GYY = 300, GR = 84;       // the globe

export default {
  id: 'lk12-seek',
  beats: [
    { v: 29 },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const P = plainSet(S, { skyCols: DAY, crowd: false, near: false });
    const c = S.c;
    const dis = seatDisciples(S, P);
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    /* the questions */
    const QI = [`<g transform="translate(0 6)">${loaf(c, 13)}</g>`, `<g transform="translate(0 10)">${cup(c, C.pot)}</g>`, `<g transform="translate(0 2) scale(.5)">${tunic(c)}</g>`];
    const qs = [0, 2, 3, 5].map((d, i) => ({ i, d, el: P.fx.add(`<g opacity="0">${qBubble(c, QI[i % 3])}</g>`) }));
    /* the globe and the running nations */
    const fl = P.hangL;
    const gl = fl.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V${-GR}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${globe(c, GR)}</g>`);
    const pc = makeCutter('lk12-nations');
    const runners = Array.from({ length: 6 }, (_, i) => ({ i, el: fl.add(`<g opacity="0">${figure(pc, i % 2 ? womanO(pc) : manO(pc), { s: 0.2 })}</g>`) }));
    const lures = [loaf(c, 10), jug(c, C.pot)].map((m, i) => ({ i, el: fl.add(`<g opacity="0"><path d="M0 -26V-4" stroke="rgba(74,54,34,.55)" stroke-width="1"/><g transform="scale(${i ? 0.36 : 1})">${m}</g></g>`) }));
    /* the light that knows, and the things kept in it */
    const lightL = behindOf(S.layer({ par: 0.4, sh: 0, flat: true }), P.crowdL);
    const light = lightL.add(`<g opacity="0"><path d="${c.poly([[-40, -700], [40, -700], [100, 0], [-100, 0]])}" fill="#fff3cf" opacity=".45"/>${halo(110, 1)}</g>`);
    const kept = [`<g transform="translate(0 8)">${loaf(c, 16)}</g>`, `<g transform="translate(0 12)">${cup(c, C.pot)}</g>`, `<g transform="translate(0 0) scale(.62)">${tunic(c)}</g>`].map((m, i) => ({ i, el: P.fx.add(`<g opacity="0">${m}</g>`) }));
    const crownEl = fl.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-52" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${halo(140, 1)}${kingdomDisc(c, 46)}</g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      /* v29 — do not seek what to eat and drink */
      const no = bump(t, 0.45, 0.95);
      const seek = es(t, 2.05, 2.3);
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, armF: 16 + no * 50 + bump(t, 1.1, 1.8) * 40, armB: 8 + no * 30 + seek * 150, head: no * 6 * Math.sin(t * 30) - seek * 12, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, RISE, P.J.s, false);
      voice(hx, hy, bump(t, 0.3, 1.0) + bump(t, 1.05, 1.8) * 0.7 + seek * (1 - es(t, 2.8, 3.0)), T, { spread: 2 });
      qs.forEach((q) => {
        const d = dis[q.d];
        const [dx, dy] = headAt(d.x, d.y, 0.92, d.flip, 62);
        const k = es(t, 0.05 + q.i * 0.07, 0.22 + q.i * 0.07, ease.back) * (1 - es(t, 0.6 + q.i * 0.04, 0.8 + q.i * 0.04));
        pose(q.el, { x: dx + (d.flip ? -14 : 14), y: dy - 30, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v30 — the nations run after these things; your Father knows */
      const gk = es(t, 1.02, 1.3, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      const gy = lerp(-1500, GYY, gk);
      pose(gl, { x: GX, y: gy, r: time ? Math.sin(T * 0.6) * 1 : 0, oy: 0 });
      const spin = t * 5;
      runners.forEach((r) => {
        const ang = -PI / 2 + ((spin * 0.5 + r.i / 6) % 1 - 0.5) * 2.4;
        const x = GX + Math.cos(ang) * (GR + 1), y = gy + Math.sin(ang) * (GR + 1);
        pose(r.el, { x, y, r: ((ang + PI / 2) * 180) / PI, o: gk > 0.3 ? 1 : 0 });
      });
      lures.forEach((l) => {
        const ang = -PI / 2 + (((spin * 0.5 + 0.2 + l.i * 0.5) % 1) - 0.5) * 2.4;
        pose(l.el, { x: GX + Math.cos(ang) * (GR + 64), y: gy + Math.sin(ang) * (GR + 64), r: ((ang + PI / 2) * 180) / PI, o: gk > 0.3 ? 1 : 0 });
      });
      const lk = es(t, 1.35, 1.65);
      pose(light, { x: 1000, y: 500, o: lk * (1 - es(t, 2.9, 3.0) * 0.4) });
      /* v31 — seek His Kingdom; the rest is added */
      const ck = es(t, 2.05, 2.35, ease.out);
      pose(crownEl, { x: JX, y: lerp(-1500, 250, ck), r: time ? Math.sin(T * 0.7) * 1.2 : 0, oy: 0, o: ck > 0.01 ? 1 : 0 });
      const lift = es(t, 2.3, 2.5);
      poseSeated(dis, T, (d) => ({ head: -6 - lift * 18, armF: 22 + lift * 30, armB: 10 + lift * (d.i % 2 ? 60 : 20) }));
      kept.forEach((k) => {
        const inL = es(t, 1.45 + k.i * 0.08, 1.7 + k.i * 0.08);
        const down = es(t, 2.55 + k.i * 0.08, 2.85 + k.i * 0.08);
        const d = dis[[2, 3, 4][k.i]];
        const hx0 = 940 + k.i * 70, hy0 = 470 + (k.i % 2) * 20;
        pose(k.el, { x: lerp(hx0, d.x + (d.flip ? 34 : -34), down), y: lerp(hy0 + (time ? Math.sin(T + k.i) * 4 : 0), d.y + 4, down), s: 1 + (1 - down) * 0.2, o: inL });
      });

      S.cam.x = -es(t, 1.0, 1.3) * 20 + es(t, 1.4, 1.7) * 40 - es(t, 2.0, 2.3) * 20;
      S.cam.y = 20 - es(t, 1.0, 1.3) * 60 + es(t, 2.5, 2.8) * 30;
      S.cam.z = 1.06 - es(t, 1.0, 1.3) * 0.04;
    };
  },
};

/** a little question bubble with a picture in it (origin: the tail tip) */
import { speech } from './lib.js';
function qBubble(c, icon) {
  return speech(c, `${icon}<text x="16" y="-6" font-family="EB Garamond, Georgia, serif" font-size="18" font-weight="600" fill="${C.terracotta}">?</text>`, { w: 64, h: 50 });
}
