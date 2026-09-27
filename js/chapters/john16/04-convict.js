// J 16,8–11 — "When He comes, He will convict the world about sin, righteousness and judgment": the dove of light
// comes down over a small paper globe hung above the path, and three round plates are lowered in a row.
// Sin — "because they do not believe in Me": little grey figures stand with their backs to a small light.
// Righteousness — "because I go to the Father and you will see Me no more": a small figure of Jesus walks up a
// dotted golden path into the light and is gone. Judgment — "because the ruler of this world has been judged": a dark
// crown sitting on the globe cracks in two and tumbles down out of the picture.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, roundPlate, fatherLight, globe, dove, flapWings, shadowPerson, person, hanging, swing,
  sheet, shade, mix, kf, vis, pose, lerp, tr, C, PI, JX, JESUS, NIGHT, DEEP,
} from './lib.js';

const GX = 800, GYL = 240;                 // the globe
const PX = [560, 800, 1040], PYL = 405;    // the three plates

function darkCrown(c, half = 0) {
  // half: 0 whole, -1 left half, 1 right half
  const pts = [[-40, 0], [-44, -34], [-26, -16], [-14, -44], [0, -20], [14, -44], [26, -16], [44, -34], [40, 0]];
  const s = sheet();
  const clip = half ? pts.filter(([x]) => (half < 0 ? x <= 2 : x >= -2)) : pts;
  const body = half < 0 ? [...clip, [2, -12], [-2, 0]] : half > 0 ? [[2, -12], ...clip, [-2, 0]] : clip;
  s.p(c.cut(body, 0.5, 5), '#2f2842');
  s.x(c.ribbon(half < 0 ? [[-38, -6], [0, -6]] : half > 0 ? [[0, -6], [38, -6]] : [[-38, -6], [38, -6]], 3), mix('#8c7a4e', '#2f2842', 0.3));
  return s.out();
}

export default {
  id: 'j16-convict',
  beats: [
    { v: 8 },
    { v: 9 },
    { v: 10 },
    { v: 11 },
  ],
  cam: { x: [-20, 20], y: [-80, 20], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = pathSet(S, { skyCols: NIGHT });
    const GY = P.GY;

    const hangL = S.layer({ par: 0.2, sh: 5 });
    const glob = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" class="gg" opacity="0"/>${globe(c, 56)}`, { x: GX, y: GYL, len: 700 });
    const gGlow = glob.querySelector('.gg');
    const ringL = S.layer({ par: 0.21, sh: 0, flat: true });
    const ring = ringL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 92, 30, 0, PI * 2, 40), 3)}" fill="${C.halo}"/></g>`);

    // plate 1: sin — backs turned to the light
    const back = (k, x, s) => `<g transform="translate(${x} 34) scale(${s}) scale(-1 1)">${shadowPerson(c, { hairStyle: k }, '#9496b8')}</g>`;
    const icon1 = `<g transform="translate(26 -8)"><circle r="30" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 8, 12), 0.2, 3)}" fill="${C.star}"/></g>${back('short', -34, 0.26)}${back('veil', -12, 0.24)}${back('curly', -48, 0.22)}`;
    // plate 2: righteousness — the path into the light
    let dots = '';
    const path2 = c.qbez([-36, 40], [-10, 0], [26, -24], 12);
    path2.forEach(([x, y], i) => { dots += c.cut(c.circ(x, y, i % 2 ? 1.6 : 2.4, 6), 0.1, 2); });
    const icon2 = `<g transform="translate(28 -26) scale(.28)">${fatherLight(c, 90, { ray: [1.0, 1.3], glow: 1.3 })}</g><path d="${dots}" fill="${C.haloRim}"/><g data-k="mini">${person(c, JESUS)}</g>`;
    // plate 3: judgment — the world, the crown will fall from it
    const icon3 = `<g transform="translate(0 16)">${globe(c, 30)}</g>`;
    const plates = [
      { el: hanging(hangL, roundPlate(c, icon1, tr('grzech', 'sin'), { r: 58, face: '#2e3262', ink: C.ink }), { x: PX[0], y: PYL, len: 800 }), i: 0 },
      { el: hanging(hangL, roundPlate(c, icon2, tr('sprawiedliwość', 'righteousness'), { r: 58, face: '#2e3262' }), { x: PX[1], y: PYL, len: 800 }), i: 1 },
      { el: hanging(hangL, roundPlate(c, icon3, tr('sąd', 'judgment'), { r: 58, face: '#2e3262' }), { x: PX[2], y: PYL, len: 800 }), i: 2 },
    ];
    const miniEl = S.$('mini');
    const mini = S.puppet(miniEl.firstElementChild);

    const fx = S.layer({ par: 0.22, sh: 5 });
    const crown = fx.add(`<g>${darkCrown(c)}</g>`);
    const crownL = fx.add(`<g>${darkCrown(c, -1)}</g>`), crownR = fx.add(`<g>${darkCrown(c, 1)}</g>`);
    const dv = fx.add(`<g><circle r="90" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const beam = fx.add(`<g><path d="${c.poly([[-10, 0], [10, 0], [80, 180], [-80, 180]])}" fill="#fff3cf" opacity=".22"/></g>`);

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });

    return (t, time) => {
      const T = time;
      P.update(T);
      /* v8 — the dove comes over the world, three plates are lowered */
      const gIn = es(t, -0.3, 0.2, ease.out);
      const gy = GYL - (1 - gIn) * 700;
      swing(glob, GX, gy, T, 1, 0.6); fade(glob, gIn > 0.01 ? 1 : 0);
      const come = es(t, 0.05, 0.55, ease.out);
      const orbit = t * 0.9;
      const dx = lerp(1400, GX + 130 + Math.cos(orbit * PI) * 14, come), dy = lerp(-60, gy - 50 + Math.sin(orbit * PI * 2) * 6, come);
      vis(dv, { x: dx, y: dy, s: 0.7, sx: -1, o: come > 0.01 ? 1 : 0 });
      if (come > 0.01) flapWings(dv, t * 5 + T, 26, 3);
      const conv = bump(t, 0.35, 1.1);
      vis(beam, { x: dx - 10, y: dy + 6, s: 0.5, r: 50, o: es(t, 0.3, 0.5) * (1 - es(t, 3.8, 4.0)) });
      fade(gGlow, 0.3 + conv * 0.7);
      const rk = seg(t, 0.4, 1.0);
      vis(ring, { x: GX, y: gy, s: 0.6 + rk * 0.8, o: rk > 0 && rk < 1 ? Math.sin(rk * PI) * 0.9 : 0 });
      const focus = [bump(t, 1.0, 2.05), bump(t, 2.0, 3.05), es(t, 3.0, 3.2)];
      plates.forEach((p) => {
        const k = es(t, 0.25 + p.i * 0.08, 0.6 + p.i * 0.08, ease.out);
        const f = focus[p.i], other = Math.max(...focus.filter((_, j) => j !== p.i));
        const y = PYL - (1 - k) * 800 + f * 20;
        pose(p.el, { x: PX[p.i], y, r: T ? Math.sin(T * 0.8 + p.i * 1.3) * 1.4 : 0, s: 1 + f * 0.18, o: k > 0.01 ? 1 - other * 0.45 : 0 });
        p.y = y;
      });

      /* v10 — the small Jesus walks into the light */
      const w = es(t, 2.2, 2.85);
      const [mx, my] = [lerp(-30, 22, w), lerp(40, -20, w)];
      mini.set({ x: mx, y: my, s: 0.2 - w * 0.06, o: 1 - es(t, 2.7, 2.9), walk: w > 0 && w < 1 ? w * 16 : undefined, armF: 10 });

      /* v11 — the dark crown cracks and falls */
      const p3 = plates[2];
      const cy0 = p3.y - 12;
      const crack = es(t, 3.25, 3.4);
      const fall = es(t, 3.35, 3.95, ease.in);
      vis(crown, { x: PX[2], y: cy0, s: 0.6, o: es(t, 0.9, 1.1) * (crack < 1 ? 1 : 0) });
      vis(crownL, { x: PX[2] - 3 - fall * 50, y: cy0 + fall * 520, s: 0.6, r: -fall * 80, o: crack >= 1 ? 1 - es(t, 3.85, 3.95) : 0 });
      vis(crownR, { x: PX[2] + 3 + fall * 70, y: cy0 + fall * 540, s: 0.6, r: fall * 110, o: crack >= 1 ? 1 - es(t, 3.85, 3.95) : 0 });

      /* people look up */
      D.forEach((m) => {
        const tx = PX[focus.indexOf(Math.max(...focus))] ?? GX;
        const up = es(t, 0.2, 0.6);
        const toward = (tx - m.x) / 600;
        lampK(m, 0.9, 0, T);
        fade(m.sad, bump(t, 1.1, 2.0) * 0.6);
        put(m, T, { head: -up * 12 + (m.flip ? toward : -toward) * 4, armB: 8 + (m.i % 4 === 1 ? bump(t, 3.4, 4) * 80 : 0) });
      });
      put(J, T, { armF: 20 + bump(t, 0.1, 0.9) * 50 + bump(t, 2.1, 2.9) * 40, armB: 10 + es(t, 0.2, 0.5) * 90 * (1 - es(t, 3.6, 4)) + bump(t, 3.1, 3.9) * 40, head: -8 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [1.4, -20], [2.2, 0], [3.2, 20], [4, 10]]);
      S.cam.y = kf(t, [[0, -60], [1, -70], [4, -60]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [1.5, 1.08], [2.5, 1.08], [3.4, 1.08], [4, 1.04]]);
    };
  },
};
