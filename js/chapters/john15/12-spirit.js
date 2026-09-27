// J 15,26–27 — Hope comes back into the night. "When the Counsellor comes, whom I will send to you from the Father":
// the light opens above, and out of it comes a dove of light; the cold goes out of the sky, the horizon warms and the
// lanterns burn brighter. "The Spirit of truth, who comes from the Father": the dove glides down the beam from the
// light. "He will testify about Me": it circles over Jesus, light rests on Him, and the true vine glows again behind
// Him, sap shining in every branch. "And you also will testify": the eleven lift their lanterns high, all together.
// "Because you have been with Me from the beginning": a small sepia picture of the first day at the Jordan — two
// men following Him along the river — and the lanterns shine out over the whole vineyard like stars.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, radiance, lightCone, rayBurst, dove, flapWings, framed, person, tint, eternityRing, drawRing,
  vis, kf, pose, lerp, blinkAt, mix, shade, sheet, C, CAST, P, PI, JESUS, LAMP_A, COLD, HOPE,
} from './lib.js';
import { reeds } from '../../assets/nature.js';

export default {
  id: 'j15-spirit',
  beats: [
    { v: 26, text: 'Gdy jednak przyjdzie Pocieszyciel, którego Ja wam poślę od Ojca,' },
    { v: 26, cont: true, text: 'Duch Prawdy, który od Ojca pochodzi,' },
    { v: 26, cont: true, text: 'On będzie świadczył o Mnie.' },
    { v: 27, text: 'Ale wy też świadczycie,' },
    { v: 27, cont: true, text: 'bo jesteście ze Mną od początku.' },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.94, 1.25] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: COLD, beadsN: 1, before: () => {
      const upL = S.layer({ par: 0.1, sh: 0, flat: true });
      return {
        rays: upL.add(`<g>${rayBurst(c, { n: 24, r0: 70, r1: 800, spread: 0.04, o: 0.3 })}</g>`),
        cone: upL.add(`<g>${lightCone(c, { w0: 60, w1: 300, h: 720, o: 0.22 })}</g>`),
        rad: upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 58)}</g>`),
      };
    } });
    const { vine, ms, jesus, JX, JY } = tb;
    const { rays, cone, rad } = tb.pre;
    const fx = S.layer({ par: P, sh: 5 });
    const ring = tb.glowL.add(`<g><g transform="scale(1 .3)">${eternityRing(c, 90, 6, 20, C.halo)}</g></g>`);
    const dv = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/><g class="dv">${dove(c, { color: '#fffaf0', shadow: C.halo })}</g></g>`);
    const dvInner = dv.querySelector('.dv');
    const flares = ms.map(() => fx.add(`<g><circle r="46" fill="url(#warm-glow)"/></g>`));
    // "from the beginning": the first day by the Jordan
    const PW = 340, PH = 170;
    const inner = tint(`<rect x="0" y="0" width="${PW}" height="${PH}" fill="${mix(C.skyBlue, C.cream, 0.4)}"/>`
      + `<path d="${c.cut([[0, PH - 58], [PW, PH - 64], [PW, PH - 34], [0, PH - 30]], 0.8, 8)}" fill="${C.lake}"/><path d="${c.cut(c.rect(0, PH - 32, PW, 32), 0.6, 8)}" fill="${C.sand}"/>`
      + reeds(c, 26, PH - 30, 7, 50) + reeds(c, PW - 30, PH - 30, 6, 44)
      + `<g transform="translate(150 ${PH - 16}) scale(.55)">${person(c, { ...JESUS })}</g>`
      + `<g transform="translate(96 ${PH - 16}) scale(.52)">${person(c, { ...CAST.andrew })}</g><g transform="translate(58 ${PH - 16}) scale(.5)">${person(c, { ...CAST.john })}</g>`, mix(C.parchment, C.dune, 0.5), 0.45);
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const pic = hangL.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3 })}</g>`);
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.sk.blend(COLD, HOPE, es(t, 0.1, 1.4));
      tb.set.update(T);
      /* v26a — the light opens; the dove comes out of it */
      const fa = es(t, 0.05, 0.4);
      vis(rad, { x: 800, y: 118, s: 1 + (T ? Math.sin(T * 1.3) * 0.02 : 0) + es(t, 2.05, 2.4) * 0.1, o: fa });
      vis(cone, { x: 800, y: 118, o: fa * (0.7 + bump(t, 1.05, 2) * 0.3) });
      vis(rays, { x: 800, y: 118, r: t * 4, s: 0.6 + es(t, 2.05, 2.5) * 0.4, o: es(t, 2.05, 2.4) * 0.9 });
      // the dove: out of the light (v26a), down the beam (v26b), circling over Him (v26c), resting above
      const out = es(t, 0.3, 0.8), down = es(t, 1.05, 1.8), circ = seg(t, 2.05, 2.8);
      let dx = lerp(800, 860, out), dy = lerp(118, 200, out);
      dx = lerp(dx, 820, down); dy = lerp(dy, 380, down);
      if (circ > 0) { const a = -PI / 2 + circ * PI * 2; dx = lerp(820, 800 + Math.cos(a) * 110, Math.min(1, circ * 4)); dy = lerp(380, 400 + Math.sin(a) * 34, Math.min(1, circ * 4)); }
      const rest = es(t, 2.8, 3.0);
      dx = lerp(dx, 800, rest); dy = lerp(dy, 410, rest);
      vis(dv, { x: dx, y: dy + (T ? Math.sin(T * 2) * 4 : 0), s: lerp(0.4, 1.1, out), o: es(t, 0.3, 0.45) });
      if (T) flapWings(dvInner, T, 30, circ > 0 && circ < 1 ? 9 : 6);
      vis(ring, { x: 800, y: 412, o: es(t, 2.2, 2.4) });
      drawRing(ring.firstElementChild, es(t, 2.2, 2.8));
      /* the vine glows again behind Him (v26c) */
      const vg = es(t, 2.1, 2.7);
      vine.set({ o: 1, grow: 1, sap: 0.2 + vg * 0.8, fruit: 1.05, ripe: 1, glow: 0.3 + vg * 0.7, T });
      tb.beads(T, vg * (1 - es(t, 3.9, 4.2) * 0.5));
      /* v27a — the lanterns lifted high, all together; v27b — they shine out like stars */
      const lift = es(t, 3.05, 3.4);
      jesus.set({ x: JX, y: JY, s: 1.05, armB: bump(t, 0.1, 0.95) * 140 + lift * 60, armF: bump(t, 1.1, 1.9) * 60 + bump(t, 2.1, 2.9) * 30 + lift * 70, head: -bump(t, 0.1, 1.9) * 12 - bump(t, 2.1, 2.9) * 8, blink: blinkAt(T, 1) });
      ms.forEach((m, i) => {
        const up = es(t, 3.05 + (i % 5) * 0.03, 3.35 + (i % 5) * 0.03);
        placeM(m, T, { head: -es(t, 0.1, 0.4) * 14 * (1 - es(t, 2.9, 3.1)) - up * 8, armB: m.lampU ? LAMP_A + up * 54 : up * 140, armF: m.lampU ? up * 50 : up * 70 });
        const [hx, hy] = [m.x + (m.flip ? -1 : 1) * (m.lampU ? 44 : 20) * m.s, m.y - (m.lampU ? 140 : 200) * m.s];
        vis(flares[i], { x: hx, y: hy, s: 0.6 + up * 0.6 + es(t, 4.1, 4.5) * 0.5, o: up * 0.9 });
      });
      lampsAll(ms, 0.55 + es(t, 0.3, 1.2) * 0.3 + es(t, 3.1, 3.4) * 0.15);
      /* v27b — the first day, by the Jordan */
      const pk = es(t, 4.05, 4.35, ease.out);
      vis(pic, { x: 620, y: 176 - (1 - pk) * 600 + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.6) * 1 : 0, o: pk > 0.001 ? 1 : 0 });
      S.cam.y = kf(t, [[0, -50], [1, -60], [2, -30], [3, -10], [3.5, 10], [4, 0], [5, -30]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.1], [3, 1.08], [3.5, 1.1], [4, 1.02], [5, 0.95]]);
    };
  },
};
