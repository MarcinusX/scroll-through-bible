// J 14,28–31 — the last words at table. "You heard Me say: I am going away and I will come back to you": on the
// hanging behind Him His shadow walks away into the distance — and turns, and comes back. "If you loved Me you would
// rejoice that I go to the Father, for the Father is greater than I": the light above opens wide, far greater than
// His halo, a path of light rises towards it, and small sparks of joy go up over the disciples. "I have told you
// before it happens": three plates come down, veiled — a cross, a tomb, a rising sun — not yet to be seen.
// "I will not speak much more with you, for the ruler of this world is coming": the lamps burn low and a ragged
// shadow creeps in at the window; "he has no hold on Me": it reaches the ring of light round Him, stops, and draws
// back. "So that the world may know that I love the Father": He rises, His heart shining up to the light.
// "Rise, let us go from here": they all stand, lamps in their hands, the walls of the room lift away into the night,
// and they walk out after Him towards the Mount of Olives under the moon.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, SEATS11, TW, shadowPerson, radiance, glowDisc, rayBurst,
  sparkle, hungPlate, plateVeil, smallCross, tombIcon, darkSheet, eternityRing, drawRing, heart, handLamp, arcThreads,
  kf, vis, headAt, hand, PI,
} from './lib.js';
import { sun } from '../../assets/nature.js';

export default {
  id: 'j14-arise',
  beats: [
    { v: 28, text: 'Słyszeliście, że wam powiedziałem: Odchodzę i przyjdę znów do was.' },
    { v: 28, cont: true, text: 'Gdybyście Mnie miłowali, rozradowalibyście się, że idę do Ojca, bo Ojciec większy jest ode Mnie.' },
    { v: 29 },
    { v: 30, text: 'Już nie będę z wami wiele mówił, nadchodzi bowiem władca tego świata.' },
    { v: 30, cont: true, text: 'Nie ma on jednak nic swego we Mnie.' },
    { v: 31, text: 'Ale niech świat się dowie, że Ja miłuję Ojca, i że tak czynię, jak Mi Ojciec nakazał.' },
    { v: 31, cont: true, text: 'Wstańcie, idźmy stąd!' },
  ],
  cam: { x: [-40, 200], y: [-80, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const R = nightRoom(S, { outside: true });
    const { SEAT, TOP, FLOOR } = R;
    // the shadow-play on the hanging (flat, on the wall)
    const shL = S.layer({ par: 0.31, sh: 0, flat: true });
    const screen = shL.add(`<g><ellipse cx="800" cy="400" rx="120" ry="90" fill="url(#warm-glow)"/></g>`);
    const shadowJ = S.puppet(shL.add(shadowPerson(c, CAST.jesus, '#3a2a36')));
    // light above, the rising path
    const hiL = S.layer({ par: 0.33, sh: 0, flat: true });
    const above = hiL.add(`<g>${glowDisc(300, 'halo-glow', 1)}${rayBurst(c, { n: 22, r0: 60, r1: 300, spread: 0.035, o: 0.22 })}<g transform="scale(.5)">${radiance(c, 150)}</g></g>`);
    const gid = S.id('up');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6dc" stop-opacity=".7"/><stop offset="1" stop-color="#fff6dc" stop-opacity=".1"/></linearGradient>`);
    const path = hiL.add(`<g><path d="${c.poly([[-24, 0], [24, 0], [60, -380], [-60, -380]])}" fill="url(#${gid})"/></g>`);
    // three veiled plates
    const plL = S.layer({ par: 0.34, sh: 4 });
    const suns = `<g transform="scale(.5)">${sun(c, 40)}</g>`;
    const icons = [`<g transform="translate(0 -30)">${smallCross(c, 80, C.wood2)}</g>`, `<g transform="scale(.9)">${tombIcon(c, { open: true })}</g>`, suns];
    const plates = icons.map((ic, i) => ({ i, x: 560 + i * 240, el: plL.add(`<g>${hungPlate(c, ic, { r: 46 })}<g opacity="0" class="vl">${plateVeil(c, 46)}</g></g>`) }));
    plates.forEach((p) => { p.veil = p.el.querySelector('.vl'); p.veil.setAttribute('opacity', '1'); });
    // the ruler's shadow (from the right window), the ring of light round Him
    const darkL = S.layer({ par: 0.45, sh: 0, flat: true, pad: 700 });
    darkL.add(`<g transform="translate(0 470)" opacity=".72">${darkSheet(c, 1, { w: 1700, h: 1300, col: '#1d1a33' })}</g>`);
    const ringL = S.layer({ par: 0.5, sh: 0, flat: true });
    const ring = ringL.add(`<g>${glowDisc(180, 'halo-glow', 0.8)}${eternityRing(c, 150, 4, 24, C.halo)}</g>`);

    // seated, then standing with lamps
    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    const cushion = seatL.add(`<g><g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g></g>`);
    const J = at.find((m) => m.k === 'jesus');
    const lamp = `<g transform="translate(-4 4) scale(.6)">${handLamp(c, { glowR: 70 })}</g>`;
    const standL = S.layer({ par: 0.52, sh: 5 });
    // added farthest-first: Jesus leads (farthest up the path), then the queue from the middle outwards (nearest last)
    const byQueue = SEATS11.map(([k, x], i) => ({ k, x, i })).sort((a, b) => (a.k === 'jesus' ? -1 : b.k === 'jesus' ? 1 : Math.abs(a.x - 800) - Math.abs(b.x - 800)));
    const up = byQueue.map(({ k, x, i }) => ({ k, x, i, s: k === 'jesus' ? 1.04 : 0.88, seed: c.rr(0, 9), p: S.puppet(standL.add(person(c, { ...(k === 'jesus' ? CAST.jesus : TW[k]), holdF: k === 'jesus' ? '' : lamp }))) }));
    const JU = up.find((m) => m.k === 'jesus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);
    const fx = S.layer({ par: 0.58, sh: 4 });
    const joys = at.filter((m) => m.k !== 'jesus').map((m) => ({ m, el: fx.add(`<g>${sparkle(c, 10)}</g>`) }));
    const jHeart = fx.add(`<g>${heart(c, 12)}</g>`);
    const thr = arcThreads(fx, 1, { w: 2.4, color: C.halo });

    return (t, time) => {
      const T = time;
      /* lamps burn low when the ruler comes, then steady */
      const low = 1 - es(t, 3.05, 3.4) * 0.5 + es(t, 4.1, 4.5) * 0.5;
      R.update(T, low);
      /* v28a — the shadow walks away and comes back */
      const away = es(t, 0.08, 0.5, ease.inOut), back = es(t, 0.55, 0.95, ease.inOut);
      const d = away * (1 - back);
      const sx = 770 + d * 110, sy = 462 - d * 50, ss = 0.72 * (1 - d * 0.72);
      fade(screen, es(t, 0.02, 0.12) * (1 - es(t, 0.95, 1.1)));
      shadowJ.set({ x: sx, y: sy, s: ss, flip: back > 0, o: es(t, 0.02, 0.1) * (1 - es(t, 0.95, 1.05)) * 0.8, walk: (away > 0 && away < 1) || (back > 0 && back < 1) ? t * 40 : undefined });
      /* v28b — the light above, greater; the path; joy */
      const gl = es(t, 1.1, 1.45) * (1 - es(t, 2.0, 2.3));
      vis(above, { x: 800, y: 210, s: 0.7 + gl * 0.5 + (T ? Math.sin(T * 1.1) * 0.01 : 0), o: gl + es(t, 5.1, 5.35) * (1 - es(t, 6.1, 6.3)) * 0.8 });
      vis(path, { x: 800, y: 590, sx: 0.5 + gl * 0.5, o: gl * 0.8 });
      joys.forEach(({ m, el }, i) => {
        const k = es(t, 1.35 + i * 0.03, 1.5 + i * 0.03);
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        const rise = seg(t, 1.35 + i * 0.03, 2.0);
        vis(el, { x: hx + Math.sin(rise * 6 + i) * 8, y: hy - 40 - rise * 60, s: 0.8, r: T ? T * 30 : t * 90, o: k * (1 - es(t, 1.85, 2.0)) });
      });
      /* v29 — the veiled plates */
      const pk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      plates.forEach((p) => {
        const k = es(t, 2.05 + p.i * 0.08, 2.35 + p.i * 0.08, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
        vis(p.el, { x: p.x, y: 300 - (1 - k) * 700, r: T ? Math.sin(T * 0.8 + p.i) * 2 : 0, o: k > 0.001 ? 1 : 0 });
        fade(p.veil, 1 - bump(t, 2.45 + p.i * 0.08, 2.85) * 0.45);
      });
      /* v30 — the ruler's shadow creeps in and is stopped */
      const creep = es(t, 3.05, 3.7, ease.out);
      const stop = es(t, 4.05, 4.5, ease.inOut);
      const gone = es(t, 5.05, 5.5, ease.in);
      const edge = lerp(1500, 972, creep) + stop * 140 + gone * 500;
      darkL.shift(edge, 0);
      darkL.fade(creep > 0 ? 1 : 0);
      const rk = es(t, 3.3, 3.7) * (1 - es(t, 6.05, 6.3));
      drawRing(ring, rk);
      vis(ring, { x: 800, y: 590, s: 1 + bump(t, 4.05, 4.4) * 0.08, o: rk > 0 ? 1 : 0 });
      /* v31a — He rises; His heart shines up to the light */
      const rise = es(t, 5.05, 5.12);
      const all = es(t, 6.05, 6.12);
      const lift = es(t, 6.08, 6.4, ease.inOut);
      R.wall.shift(0, -lift * 260); R.wall.fade(1 - lift);
      R.roofs.fade(1 - lift); R.lampL.fade(1 - lift); R.dim.fade(1 - lift); R.floor.fade(1 - lift * 0.9);
      tabL.fade(1 - es(t, 6.1, 6.3)); hiL.fade(1 - lift); fade(cushion, 1 - es(t, 6.1, 6.25));
      const walk = es(t, 6.2, 6.85, ease.inOut);
      const [jhx, jhy] = [800, 730 - 128 * 1.04];
      vis(jHeart, { x: jhx + 2, y: jhy, s: es(t, 5.15, 5.35, ease.back), o: es(t, 5.15, 5.25) * (1 - es(t, 6.0, 6.1)) });
      thr(0, jhx + 2, jhy, 800, 230, 20, es(t, 5.2, 5.5) * (1 - es(t, 6.0, 6.1)) * 0.8);

      at.forEach((m) => {
        const standing = m.k === 'jesus' ? rise : all;
        if (m.k === 'jesus') {
          sitAt(m, SEAT, T, { o: 1 - standing, armF: 30 + bump(t, 0.1, 0.9) * 30 + gl * 30, armB: 14 + gl * 110 + bump(t, 4.05, 4.6) * 40, head: -gl * 12 });
          return;
        }
        const sad = es(t, 0.3, 0.6) * (1 - es(t, 1.35, 1.6)) + es(t, 3.1, 3.4) * (1 - es(t, 4.2, 4.5));
        fade(m.sad, sad);
        sitAt(m, SEAT, T, { o: 1 - standing, head: -gl * 12 + sad * 8 - es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.1)) * 10, lean: sad * 2, flip: t > 3.1 && t < 4.6 && m.x > 800 ? true : m.flip });
      });
      const queue = up.filter((m) => m.k !== 'jesus').sort((a, b) => Math.abs(a.x - 800) - Math.abs(b.x - 800));
      up.forEach((m) => {
        const isJ = m.k === 'jesus';
        const on = isJ ? rise : all;
        const n = isJ ? -1 : queue.indexOf(m);
        const w = isJ ? walk : es(t, 6.22 + n * 0.015, 6.88, ease.inOut);
        const u = isJ ? 1 : 1 - 0.082 * (n + 1);
        const tx = lerp(560, 1030, u), ty = lerp(748, 590, u);
        const x = lerp(m.x, tx, w), y = lerp(730 + (m.i % 2) * 4, ty, w);
        const s = m.s * lerp(1, 1 - u * 0.45, w);
        const moving = w > 0 && w < 1;
        const dirRight = t > 6.2 ? tx >= m.x : m.x < 800;
        m.p.set({ x, y, s, flip: isJ || w > 0.97 ? false : !dirRight, o: on, armF: isJ ? 20 + es(t, 5.1, 5.4) * 40 + es(t, 6.05, 6.3) * 60 * (1 - walk * 0.5) : 70, armB: isJ ? 10 + es(t, 5.1, 5.4) * (1 - es(t, 6.0, 6.2)) * 120 : 12, head: isJ ? -es(t, 5.1, 5.4) * (1 - es(t, 6.0, 6.2)) * 14 : -4, walk: moving ? t * 30 + m.i : undefined, blink: blinkAt(T, m.seed) });
      });

      S.cam.x = kf(t, [[0, 0], [6.3, 0], [7, 110]]);
      S.cam.y = kf(t, [[0, 20], [1, 0], [1.4, -60], [2, -40], [3, 20], [4, 20], [5, 0], [5.4, -30], [6.2, 0], [7, -50]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.06], [1.4, 1.0], [2.2, 1.04], [3, 1.12], [4, 1.14], [5, 1.08], [6.2, 1.04], [7, 1.1]]);
    };
  },
};
