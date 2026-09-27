// Mk 13,24–27 — the whole theatre's sky: the sun and the moon on their strings, paper stars on threads.
// A dark disc slides over the sun; the moon goes grey; the stars' threads let go and they tumble down;
// the fly system shakes, every ornament swinging. Then, in the dark, clouds come down with the Son of
// Man in great power and glory; angels fly out on their strings to the four corners and come back
// gathering the chosen, little lights from the ends of the earth and the heights of heaven.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, crowd } from '../kit.js';
import { band, hillsWith, town, sun, moon, cloud, stars, olive, cypress, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { jerusalem, skyStar, glory, angel, soulLight, PI } from './lib.js';

const SUN = [610, 175], MOON = [1110, 150];

export default {
  id: 'm13-heavens',
  beats: [
    { v: 24, text: 'W owe dni, po tym ucisku, słońce się zaćmi' },
    { v: 24, cont: true, text: 'i księżyc nie da swego blasku.' },
    { v: 25, text: 'Gwiazdy będą padać z nieba' },
    { v: 25, cont: true, text: 'i moce na niebie zostaną wstrząśnięte.' },
    { v: 26 },
    { v: 27, text: 'Wtedy pośle On aniołów' },
    { v: 27, cont: true, text: 'i zbierze swoich wybranych z czterech stron świata, od krańca ziemi aż do szczytu nieba.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const TWI = ['#3d4775', '#6d6f96', '#b49aa4'];
    const DARK = ['#15182e', '#1f2340', '#2c2c46'];
    const GLORY = ['#6b5a86', '#e3b98a', '#f8e4b8'];
    const sk = sky(S, TWI);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 90 }));
    const gloryL = S.layer({ par: 0.06, sh: 1, flat: true });
    gloryL.add(`<g transform="translate(800 330)">${glory(c, 900, 30)}</g>`);

    /* the fly system: sun (with the eclipsing disc), moon, clouds, stars on threads */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 56), { x: SUN[0], y: SUN[1], len: 700 });
    const disc = hanging(hangL, `<path d="${c.cut(c.circ(0, 0, 60, 40), 0.4, 5)}" fill="${mix(C.night2, C.storm2, 0.3)}"/><circle r="64" fill="none" stroke="${C.halo}" stroke-width="3" opacity=".5"/>`, { x: SUN[0] - 200, y: SUN[1], len: 700 });
    const moonEl = hanging(hangL, `<circle class="mglow" r="110" fill="url(#halo-glow)"/>${moon(c, 40)}<path class="mdim" d="${c.cut(c.circ(0, 0, 41, 40), 0.3, 5)}" fill="${mix(C.rock3, C.storm2, 0.5)}" opacity="0"/>`, { x: MOON[0], y: MOON[1], len: 700 });
    const mglow = moonEl.querySelector('.mglow'), mdim = moonEl.querySelector('.mdim');
    const clouds = [[700, 120, 200], [960, 230, 150], [300, 300, 170]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w, mix(C.cream, C.storm, 0.35), mix('#eadcc0', C.storm, 0.4)), { x, y, len: 700 }) }));
    // "shaking" marks: little cut arcs that flicker round the sun, the moon and a cloud
    const marks = [SUN, MOON, [700, 120]].map(([x, y], i) => ({ x, y, i, el: hangL.add(`<g>${[0, 1].map((k) => `<path d="${c.ribbon(c.arc(0, 0, 80 + k * 16, 80 + k * 16, -0.5, 0.5, 8), 4)}" fill="${C.halo}" opacity=".7"/><path d="${c.ribbon(c.arc(0, 0, 80 + k * 16, 80 + k * 16, PI - 0.5, PI + 0.5, 8), 4)}" fill="${C.halo}" opacity=".7"/>`).join('')}</g>`) }));
    // stars on threads: the threads are one still cut-out (they stay dangling when the stars fall)
    const STARS = Array.from({ length: 22 }, (_, i) => ({ i, x: lerp(360, 1260, (i + c.rr(0.1, 0.9)) / 22), y: c.rr(90, 360), r: c.rr(7, 12), seed: c.rr(0, 9), dx: c.rr(-120, 120), spin: c.rr(-400, 400), at: 2.02 + c.rr(0, 0.6) }));
    const threadL = S.layer({ par: 0.05, sh: 1, flat: true });
    threadL.add(STARS.map((st) => `<path d="M${st.x.toFixed(1)} -1400V${(st.y - st.r).toFixed(1)}" stroke="rgba(240,230,210,.4)" stroke-width="1"/>`).join(''));
    const starsL = S.layer({ par: 0.05, sh: 4 });
    STARS.forEach((st) => { st.el = starsL.add(`<g><circle r="${(st.r * 2.6).toFixed(1)}" fill="url(#warm-glow)" opacity=".55"/><path d="${c.cut(c.star(0, 0, st.r, st.r * 0.42, 5), 0.2, 3)}" fill="${C.star}"/></g>`); });

    /* the earth: the city, the hills, people looking up */
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 520, amps: [14, 6, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.night2, 0.45), x0: -1400, x1: 3000 });
    far.add(h1.markup + `<g transform="translate(560 522)">${jerusalem(c, 0.3, { tglow: false }).replace(/#[0-9a-fA-F]{6}\b/g, (h) => mix(h, C.night2, 0.45))}</g>` + town(c, { x: 1250, y: h1.fn(1250) + 8, n: 6, spread: 240, sc: 0.5, wall: mix(C.plaster, C.night2, 0.45), shadow: mix(C.plaster2, C.night2, 0.5), lit: true }));
    const nearL = S.layer({ par: 0.3, sh: 3 });
    const h2 = hillsWith(c, { y: 600, amps: [16, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.night2, 0.4), trees: 16, treeColor: mix(C.moss2, C.night2, 0.4), treeH: 22, x0: -1400, x1: 3000 });
    nearL.add(h2.markup);
    const lit = S.layer({ par: 0.3, sh: 1, flat: true });
    lit.add(`<rect x="-1400" y="400" width="4400" height="1400" fill="${C.lampGlow}" opacity=".25"/>`);
    const G = S.layer({ par: 0.42, sh: 4 });
    const gfn = c.wave(676, [5, 2], [700, 170]);
    G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.night2, 0.4)).out() + grass(c, { x0: -800, x1: 2400, y: 676, fn: gfn, n: 34, h: 12, color: mix(C.olive, C.night2, 0.4) }) + olive(c, 230, 690, 0.9, { trunk: mix(C.wood2, C.night2, 0.4), leaf: mix(C.olive, C.night2, 0.4), leaf2: mix(C.sage, C.night2, 0.4) }));
    const P = S.layer({ par: 0.42, sh: 4 });
    const people = crowd(S, P, [{ y: 700, s: 0.5, n: 9, x0: 380, x1: 700 }, { y: 700, s: 0.5, n: 8, x0: 900, x1: 1240 }, { y: 724, s: 0.58, n: 5, x0: 300, x1: 560 }, { y: 724, s: 0.58, n: 5, x0: 1050, x1: 1330 }]);

    /* the Son of Man on the clouds, the angels, the gathered */
    const heaven = S.layer({ par: 0.16, sh: 6 });
    const cloudBack = heaven.add(`<g>${cloud(c, 420, '#fbf4e4', '#efe2c4')}</g>`);
    const J = S.puppet(heaven.add(person(c, { ...CAST.jesus, robe: C.linen, mantle: mix(C.jesusMantle, C.halo, 0.35) })));
    const cloudFront = heaven.add(`<g>${cloud(c, 360, '#fffaf0', '#f1e6cc')}</g>`);
    const cloudSide = [-1, 1].map((d) => heaven.add(`<g>${cloud(c, 240, '#f8f0de', '#ebdcbc')}</g>`));
    const CORNERS = [[300, 380], [1290, 190], [430, 640], [1170, 640]];
    const angels = CORNERS.map(([x, y], i) => ({ i, x, y, p: S.puppet(heaven.add(angel(c))) }));
    const elect = [];
    CORNERS.forEach(([x, y], ci) => { for (let k = 0; k < 5; k++) elect.push({ ci, k, x: x + c.rr(-60, 60), y: y + c.rr(-30, 40), el: heaven.add(`<g>${soulLight(c, 8)}</g>`), a: (ci * 5 + k) / 20 * PI * 2 }); });

    return (t, time) => {
      const T = time;
      /* the sky: twilight → dark → glory */
      const dark = es(t, 0.2, 1.8);
      const gl = es(t, 4.05, 4.6);
      if (gl > 0) sk.blend(DARK, GLORY, gl); else sk.blend(TWI, DARK, dark);
      starL.fade((1 - es(t, 2.1, 3)) * 0.8 * (1 - gl));
      gloryL.fade(gl);
      lit.fade(gl);

      const shake = bump(t, 3.0, 3.95);
      const sway = (seed, amp = 1) => (Math.sin(t * 26 + seed) * 18 + Math.sin(t * 61 + seed * 2) * 8) * shake * amp;
      hangL.shift(Math.sin(t * 50) * 8 * shake, 0);
      threadL.shift(Math.sin(t * 50) * 8 * shake, 0);
      far.shift(Math.sin(t * 60 + 1) * 4 * shake, 0);

      /* v24: the sun darkened — a dark disc slides across it */
      const ecl = es(t, 0.1, 0.8);
      const up = es(t, 4.0, 4.4);
      pose(sunEl, { x: SUN[0], y: SUN[1] - up * 500, r: sway(1), o: 1 });
      pose(disc, { x: lerp(SUN[0] - 190, SUN[0], ecl), y: SUN[1] - up * 500, r: sway(1.2), o: ecl > 0.001 ? 1 : 0 });
      /* the moon gives no light */
      const md = es(t, 1.1, 1.6);
      pose(moonEl, { x: MOON[0], y: MOON[1] - up * 500, r: sway(2), o: 1 });
      fade(mglow, 0.8 * (1 - md)); fade(mdim, md * 0.85);
      clouds.forEach((cl) => pose(cl.el, { x: cl.x, y: cl.y - up * 600, r: sway(cl.i + 3, 0.6) }));

      marks.forEach((m) => pose(m.el, { x: m.x, y: m.y, s: (m.i === 2 ? 1.3 : 0.8) + Math.sin(t * 30 + m.i) * 0.06, r: Math.sin(t * 22 + m.i) * 12, o: shake }));

      /* v25: the stars let go of their threads and fall */
      STARS.forEach((s) => {
        const f = es(t, s.at, s.at + 0.7, ease.in);
        pose(s.el, { x: s.x + f * s.dx, y: s.y + f * 700, r: f * s.spin, s: 1 - f * 0.3, o: f < 0.98 ? 1 : 0 });
      });

      /* people on the earth look up */
      const look = es(t, 0.3, 0.8), awe = es(t, 4.2, 4.6);
      people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -look * 10 - awe * 8, armF: awe * (m.i % 2 ? 110 : 60), armB: awe * (m.i % 3 === 0 ? 140 : 0), blink: blinkAt(T, m.seed) }));

      /* v26: the Son of Man comes in the clouds */
      const come = es(t, 4.05, 4.7, ease.out);
      const jy = lerp(-200, 452, come);
      pose(cloudBack, { x: 800, y: jy + 6, s: 1.1, o: come > 0.001 ? 1 : 0 });
      J.set({ x: 800, y: jy, s: 1.12, o: come > 0.001 ? 1 : 0, armB: 150 * come, armF: 80 * come - bump(t, 5.05, 5.6) * 25, head: -4, blink: blinkAt(T, 1) });
      pose(cloudFront, { x: 790, y: jy + 26, s: 1.05, o: come > 0.001 ? 1 : 0 });
      cloudSide.forEach((el, i) => pose(el, { x: 800 + (i ? 1 : -1) * 250, y: jy + 16, s: 1, o: come > 0.001 ? 1 : 0 }));

      /* v27: angels fly out to the four corners … and come back with the chosen */
      const send = es(t, 5.05, 5.7);
      const back = es(t, 6.1, 6.85);
      angels.forEach((a) => {
        const ox = 800 + (a.i % 2 ? 60 : -60), oy = 300;
        const x = lerp(lerp(ox, a.x, send), ox + (a.i % 2 ? 150 : -150), back);
        const y = lerp(lerp(oy, a.y, send), a.i < 2 ? 190 : 420, back);
        const flying = (send > 0 && send < 1) || (back > 0 && back < 1);
        a.p.set({ x, y: y + Math.sin(t * 9 + a.i) * 6, s: 0.5, flip: back > 0 ? a.i % 2 === 1 : a.i % 2 === 0, o: send > 0.02 ? 1 : 0, lean: flying ? 22 : 8, armF: 100, armB: 130 + Math.sin(t * 20 + a.i) * 10 });
      });
      elect.forEach((e) => {
        const on = es(t, 5.9 + e.k * 0.04, 6.15 + e.k * 0.04);
        const k = es(t, 6.15 + e.k * 0.05, 6.9);
        const rx = 800 + Math.cos(e.a) * 250, ry = 330 + Math.sin(e.a) * 170;
        pose(e.el, { x: lerp(e.x, rx, k), y: lerp(e.y, ry, k) + Math.sin(t * 8 + e.a) * 4, s: 0.8 + k * 0.4, o: on });
      });

      S.cam.z = 1 - es(t, 2.9, 3.4) * 0.03 + es(t, 4.1, 4.8) * 0.05 - es(t, 5.0, 5.6) * 0.06;
      S.cam.y = -es(t, 1.9, 2.4) * 20 - es(t, 4.1, 4.8) * 30;
    };
  },
};
