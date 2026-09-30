// J 16,25–27 — "I have spoken these things to you in figures": a gallery of little picture-plates is lowered over
// them, the figures He has used — the vine, the shepherd's sheep, the bread, the door, the lamp, the mother and child —
// seen as through a sheer gauze. "The hour comes when I will tell you plainly about the Father": the plates fly up,
// the gauze lifts, and a clear open light shines (never a figure). "In that day you will ask in My name; and I do not
// say that I will pray to the Father for you": their sealed prayers rise straight to the light, and He lets them go
// by. "For the Father Himself loves you, because you have loved Me and believed that I came from God": warm little
// hearts float down from the light onto each of them, golden threads join each of them to Him, and a line of gold
// runs from the light down to Him.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, hungPlate, fatherLight, heart, hand, headAt, arcThreads, goldArc, lantern,
  sheet, shade, mix, kf, vis, pose, lerp, C, PI, JX, NIGHT, PREDAWN,
} from './lib.js';
import { sheep } from '../mark6/lib.js';
import { loaf } from '../mark2/lib.js';
import { grapeBunch } from '../mark12/lib.js';

const LX = JX, LY = 190;          // the plain light

function sealed(c) {
  const s = sheet();
  s.p(c.cut([[-14, -9], [14, -10], [15, 9], [-13, 10]], 0.3, 4), C.cream);
  s.x(c.ribbon([[-14, -9], [0, 1], [14, -10]], 1.1), shade(C.cream, -0.2));
  s.p(c.cut(c.circ(0, 2, 5.5, 10), 0.2, 2), C.ochre);
  return `<circle r="22" fill="url(#warm-glow)" opacity=".6"/>${s.out()}`;
}

export default {
  id: 'j16-plainly',
  beats: [
    { v: 25, text: 'Mówiłem wam o tych sprawach w przypowieściach.' },
    { v: 25, cont: true, text: 'Nadchodzi godzina, kiedy już nie będę wam mówił w przypowieściach, ale całkiem otwarcie oznajmię wam o Ojcu.' },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-20, 20], y: [-80, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = pathSet(S);
    const GY = P.GY;

    // the plain light, behind a gauze
    const lightL = S.layer({ par: 0.12, sh: 2 });
    const light = lightL.add(`<g>${fatherLight(c, 70, { ray: [1.6, 2.5], glow: 3 })}</g>`);
    const gauzeL = S.layer({ par: 0.14, sh: 2 });
    const gz = sheet();
    const gw = 900, gh = 420;
    const edge = [];
    for (let i = 0; i <= 30; i++) edge.push([-gw / 2 + (gw * i) / 30, gh + Math.sin(i * 1.3) * 8]);
    gz.p(c.cut([[-gw / 2, -600], [gw / 2, -600], ...edge.reverse()], 1, 12), '#c9c3dd', 'opacity=".72"');
    let folds = '';
    for (let x = -gw / 2 + 20; x < gw / 2; x += c.rr(30, 50)) folds += c.ribbon([[x, -600], [x + c.rr(-5, 5), gh]], c.rr(3, 8));
    gz.x(folds, '#e7e2f2', 'opacity=".45"');
    gz.p(c.ribbon([[-gw / 2 - 10, -2], [gw / 2 + 10, 0]], 8), mix(C.wood2, C.indigo, 0.2));
    const gauze = gauzeL.add(`<g>${gz.out()}</g>`);

    // the gallery of figures
    const plL = S.layer({ par: 0.2, sh: 5 });
    const door = sheet().p(c.cut([[-16, 22], [-16, -6], ...c.arc(0, -6, 16, 16, PI, 2 * PI, 8), [16, 22]], 0.3, 4), C.wood2).x(c.poly(c.circ(9, 6, 2, 6)), C.ochre).out();
    const mc = sheet().p(c.cut([[-16, 24], [-12, -4], [12, -4], [16, 24]], 0.3, 4), C.skyVeil).p(c.cut(c.circ(0, -12, 8, 10), 0.2, 3), C.skin).p(c.cut(c.ell(4, 6, 10, 6, 10), 0.2, 3), C.linen).out();
    const icons = [
      `<g transform="translate(0 -4)">${grapeBunch(c, 4.4)}</g>`,
      `<g transform="translate(0 10) scale(.42)">${sheep(c)}</g>`,
      `<g transform="translate(0 2)">${loaf(c, 20)}</g>`,
      `<g>${door}</g>`,
      `<g transform="translate(0 -18) scale(1.1)">${lantern(c, 0, { glowR: 30 })}</g>`,
      `<g>${mc}</g>`,
    ];
    // phone: all six plates inside the screen, clear of the progress thread
    const GX = S.portrait ? [530, 632, 734, 836, 938, 1040] : [470, 600, 730, 870, 1000, 1130], GYs = [370, 320, 360, 320, 365, 320];
    const plates = icons.map((ic, i) => ({ i, el: plL.add(`<g>${hungPlate(c, `<g transform="scale(1.15)">${ic}</g>`, { r: 46, face: C.parchment })}</g>`) }));

    const wayL = S.layer({ par: 0.3, sh: 0, flat: true });
    const setThread = arcThreads(wayL, 11, { w: 1.8 });
    const down = goldArc(wayL, c, c.qbez([LX, LY + 40], [LX + 10, 380], [JX, GY - 200], 20), { w: 3.5, n: 26 });

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });
    const fx = S.layer({ par: 0.56, sh: 4 });
    const prayers = D.map((m, i) => ({ m, i, el: fx.add(`<g>${sealed(c)}</g>`) }));
    const hearts = D.map((m, i) => ({ m, i, el: fx.add(`<g><circle r="26" fill="url(#warm-glow)"/>${heart(c, 11)}</g>`) }));

    return (t, time) => {
      const T = time;
      P.update(T);
      /* v25a — the figures behind the gauze */
      const gIn = es(t, -0.3, 0.1, ease.out);
      const lift = es(t, 1.35, 1.8, ease.in);
      vis(gauze, { x: LX, y: 20 + (1 - gIn) * -700 - lift * 900, o: gIn > 0.01 && lift < 0.99 ? 1 : 0 });
      const lk = es(t, -0.1, 0.2);
      vis(light, { x: LX, y: LY, s: 0.7 + lift * 0.35 + (T ? Math.sin(T * 1.1) * 0.015 : 0), o: lk * (0.5 + lift * 0.5) });
      plates.forEach((p) => {
        const k = es(t, 0.1 + p.i * 0.06, 0.45 + p.i * 0.06, ease.out);
        const up = es(t, 1.05 + (p.i % 3) * 0.05, 1.4 + (p.i % 3) * 0.05, ease.in);
        const y = GYs[p.i] - (1 - k) * 700 - up * 800;
        vis(p.el, { x: GX[p.i], y, s: S.portrait ? 0.9 : 1, r: T ? Math.sin(T * 0.9 + p.i) * 1.8 : 0, o: k > 0.01 && up < 0.99 ? 1 : 0 });
      });
      const sky = es(t, 1.4, 1.9) * 0.4;
      P.sky.blend(NIGHT, PREDAWN, sky);

      /* v26 — prayers go straight up */
      prayers.forEach(({ m, i, el }) => {
        const u = (i % 5) * 0.05;
        const k = es(t, 2.2 + u, 2.75 + u);
        const [ox, oy] = hand(m.x, m.y, m.s, m.flip, 150);
        const tx = LX + (m.x - JX) * 0.15;
        vis(el, { x: lerp(ox, tx, k), y: lerp(oy - 12, LY + 30, k), s: 0.9 - k * 0.4, o: k > 0.01 && k < 0.97 ? 1 : 0 });
      });

      /* v27 — the Father's love comes down; threads to Him; the line from the light to Him */
      hearts.forEach(({ m, i, el }) => {
        const u = (i % 6) * 0.04;
        const k = es(t, 3.05 + u, 3.5 + u);
        const hx = m.x + (m.flip ? -6 : 6), hy = m.y - 112 * m.s;
        vis(el, { x: lerp(LX + (m.x - JX) * 0.2, hx, k) + Math.sin(k * 5 + i) * 10 * (1 - k), y: lerp(LY + 40, hy, k), s: 0.7 + k * 0.3, o: k > 0.01 ? 1 : 0 });
      });
      D.forEach((m, i) => {
        const d = Math.abs(m.x - JX);
        const k = es(t, 3.3 + d * 0.0004, 3.55 + d * 0.0004);
        const hx = m.x + (m.flip ? -6 : 6), hy = m.y - 112 * m.s;
        setThread(i, JX, GY - 112, lerp(JX, hx, k), lerp(GY - 112, hy, k), 10 + d * 0.04, k * 0.8);
      });
      down(es(t, 3.5, 3.8), 0.9);

      /* people */
      D.forEach((m) => {
        const pray = es(t, 2.05, 2.25) * (1 - es(t, 2.85, 3.05));
        const look = es(t, 0.2, 0.5) * (1 - es(t, 1.3, 1.5)) + es(t, 1.5, 1.8) * (1 - es(t, 3.0, 3.2));
        lampK(m, 0.85 + es(t, 3.3, 3.6) * 0.15, 0, T);
        put(m, T, { head: -look * 12 - pray * 8 + es(t, 3.4, 3.7) * 2, armB: 8 + pray * 142 });
      });
      put(J, T, { armF: 20 + bump(t, 0.1, 0.9) * 40 + bump(t, 2.1, 2.9) * 30 + es(t, 3.2, 3.5) * 40, armB: 10 + bump(t, 1.1, 1.9) * 120 + bump(t, 2.1, 2.9) * 60 + es(t, 3.2, 3.5) * 60, head: -bump(t, 1.2, 1.9) * 10 - bump(t, 2.2, 2.9) * 12 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -40], [1, -50], [2, -60], [2.9, -60], [3.4, -30], [4, -20]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2, 1.0], [3, 1.02], [4, 1.06]]);
    };
  },
};
