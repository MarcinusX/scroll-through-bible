// Łk 9,22 — the same quiet place, the day going; Jesus sits on the flat rock with the disciples round Him, and a lit
// paper screen is let down for a shadow play. "The Son of Man must suffer many things": His shadow walks the long road
// towards the city on the hill, past thorns and stones, stooping lower. "…and be rejected by the elders, the chief
// priests and the scribes": three shadows come out of the gate, lift their hands against Him and turn Him back. "…and
// be killed, and on the third day be raised up": a cross stands on the hill and the screen goes dark; three moons pass
// over it, one after another — then the sun comes up behind the hill, and He stands there in light, the cross empty.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { restSet, REST_SIT, TW9, shadowPerson, halo, kf, tr, PI } from './lib.js';
import { LEADERS } from '../mark8/lib.js';
import { walledCity } from '../mark1/lib.js';

const JX = 800, JY = 712;
const SW = 540, SH = 250, SX = 820, STOP = 176;   // the screen: centre x, top y
const INK = '#3b2a22';
const PAPER = '#f7e6c4';

export default {
  id: 'lk9-must',
  beats: [
    { v: 22, text: 'I dodał: «Syn Człowieczy musi wiele wycierpieć:' },
    { v: 22, cont: true, text: 'będzie odrzucony przez starszyznę, arcykapłanów i uczonych w Piśmie;' },
    { v: 22, cont: true, text: 'będzie zabity, a trzeciego dnia zmartwychwstanie».' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const R = restSet(S, { skyCols: ['#b9c9cf', '#ecd9c0', '#f4d9b8'], nightCols: ['#433f6b', '#8b6f8a', '#c79a8e'] });
    const c = S.c;
    // phone: the screen hangs a little left (its city clear of the thread), the disciples sit closer
    const SXp = S.portrait ? 772 : SX;
    const IN = (x) => (S.portrait ? 800 + (x - 800) * 0.78 : x);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 60 }));
    starL.fade(0);

    /* ---------- the screen ---------- */
    const scrL = S.layer({ par: 0.3, sh: 7 });
    const hillPts = [[-SW / 2, SH], [-SW / 2, 236], [-160, 226], [-40, 206], [40, 180], [110, 156], [170, 148], [SW / 2, 146], [SW / 2, SH]];
    const road = c.ribbon(c.qbez([-SW / 2, 246], [-60, 236], [150, 158], 14), (u) => 12 - u * 8);
    let thorns = '';
    [[-200, 238], [-120, 230], [-30, 212]].forEach(([x, y]) => {
      for (let k = 0; k < 7; k++) { const a = -PI / 2 + (k - 3) * 0.32; thorns += c.ribbon([[x, y], [x + Math.cos(a) * 26, y + Math.sin(a) * 24]], (u) => 3 - u * 2.6); }
      thorns += c.cut(c.blob(x, y - 2, 14, 6, 8, 0.2), 0.4, 3);
    });
    const city = walledCity(c, 196, 150, 0.56, { wall: INK, wall2: INK, temple: INK }).split(C.sun).join(INK).split(C.soilDark).join(PAPER).split(C.plaster).join(INK).split('#d9a45b').join(INK);
    const frame = sheet().p(c.cut(c.rect(-SW / 2 - 12, -12, SW + 24, SH + 24), 0.6, 8), C.wood2).out();
    const screen = scrL.add(`<g><path d="M${-SW / 2 + 30} -12V-1600M${SW / 2 - 30} -12V-1600" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${frame}<rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="${PAPER}"/><circle cx="0" cy="${SH * 0.55}" r="${SW * 0.6}" fill="url(#warm-glow)" opacity=".6"/><path d="${c.cut(hillPts, 1, 10)}" fill="${INK}"/><path d="${road}" fill="#6b5240"/><path d="${thorns}" fill="${INK}"/>${city}</g>`);
    // the pieces that move on the screen (each its own cut-out; placed in screen coords)
    const sunS = scrL.add(`<g opacity="0"><path d="${c.poly(c.star(0, 0, 66, 42, 16, 0))}" fill="#f5c35c" opacity=".75"/><path d="${c.cut(c.circ(0, 0, 36, 30), 0.4, 4)}" fill="${C.sun}"/></g>`);
    const hillCover = scrL.add(`<g><path d="${c.cut(hillPts.map(([x, y]) => [x, y]), 1, 10)}" fill="${INK}"/><path d="${road}" fill="#6b5240"/></g>`);
    const crossS = scrL.add(`<g opacity="0">${sheet().p(c.cut([[-3.5, -70], [3.5, -70], [3.5, 0], [-3.5, 0]], 0.2, 4) + c.cut([[-22, -54], [22, -54], [22, -47], [-22, -47]], 0.2, 4), INK).out(false)}</g>`);
    const son = S.puppet(scrL.add(shadowPerson(c, CAST.jesus, INK)));
    const LEAD = LEADERS.map((o) => S.puppet(scrL.add(shadowPerson(c, o, INK))));
    const risen = scrL.add(`<g opacity="0"><circle cy="-70" r="80" fill="url(#halo-glow)"/><g transform="scale(.36)">${shadowPerson(c, CAST.jesus, INK).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-60)">').replace('<g class="armBr">', '<g class="armBr" transform="rotate(-150)">')}</g></g>`);
    const darkS = scrL.add(`<g opacity="0"><rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="#2a2030" opacity=".78"/></g>`);
    const MOONS = [0, 1, 2].map(() => scrL.add(`<g opacity="0"><path d="${c.cut([...c.arc(0, 0, 18, 18, -PI * 0.6, PI * 0.6, 12), ...c.arc(-7, 0, 14, 16, PI * 0.5, -PI * 0.5, 10)], 0.3, 3)}" fill="${C.moon}"/></g>`));
    const TICKS = [0, 1, 2].map(() => scrL.add(`<g opacity="0"><path d="${c.ribbon([[0, -12], [1, 12]], 5)}" fill="${C.moon}"/></g>`));

    /* ---------- Jesus and the disciples ---------- */
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = REST_SIT.map((d, i) => ({ ...d, x: IN(d.x), i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))) })).sort((a, b) => a.y - b.y);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    return (t, time) => {
      const T = time;
      R.update(T, { sunX: 1230, sunY: 170 + es(t, 0, 3) * 200 });
      const dark = es(t, 2.1, 2.25) * (1 - es(t, 2.48, 2.62));
      R.night.fade(0.3 + dark * 0.6);
      starL.fade(dark * 0.8);

      /* the screen comes down */
      const down = es(t, -0.3, 0.12, ease.back);
      const sy = STOP - (1 - down) * 900;
      pose(screen, { x: SXp, y: sy });
      pose(hillCover, { x: SXp, y: sy });
      const P = (x, y) => [SXp + x, sy + y];

      /* v22a — the long road, the thorns, stooping lower */
      const u = seg(t, 0.05, 0.9);
      const back = bump(t, 1.35, 1.9);
      const wx = lerp(-260, -10, u) - back * 36, wy = lerp(246, 204, u) + back * 6;
      const bow = es(t, 0.3, 0.9) * 0.6 + es(t, 1.4, 1.7) * 0.4;
      const [sx_, sy_] = P(wx, wy);
      son.set({ x: sx_, y: sy_, s: 0.34, walk: t < 0.9 ? t * 20 : undefined, lean: 4 + bow * 16, head: 8 + bow * 14, o: (t > -0.3 ? 1 : 0) * (1 - es(t, 2.05, 2.15)) });

      /* v22b — the elders, the chief priests and the scribes turn Him away */
      LEAD.forEach((p, i) => {
        const on = es(t, 1.05 + i * 0.08, 1.3 + i * 0.08);
        const [lx, ly] = P(118 + i * 34 - on * 26, 158 - i * 3);
        p.set({ x: lx, y: ly, s: 0.34, flip: true, o: on * (1 - es(t, 2.0, 2.12)), armF: on * (70 + i * 20), armB: on * (i === 1 ? 150 : 30), head: -6 });
      });

      /* v22c — the cross, the dark, three moons; the sun rises and He stands in light */
      const cr = es(t, 2.05, 2.2);
      const [cx, cy] = P(40, 182);
      pose(crossS, { x: cx, y: cy, s: 0.4 + cr * 0.6, o: cr });
      pose(darkS, { x: SXp, y: sy, o: dark });
      MOONS.forEach((m, i) => {
        const k = seg(t, 2.16 + i * 0.08, 2.32 + i * 0.08);
        const [mx, my] = P(lerp(-240, 240, k), 60 - Math.sin(k * PI) * 30);
        pose(m, { x: mx, y: my, o: k > 0 && k < 1 ? 1 : 0 });
        const tk = es(t, 2.24 + i * 0.08, 2.3 + i * 0.08, ease.back);
        const [tx, ty] = P(-SW / 2 + 36 + i * 24, 34);
        pose(TICKS[i], { x: tx, y: ty, s: tk, r: 8, o: tk > 0.02 ? 1 - es(t, 2.9, 3.0) : 0 });
      });
      const rise = es(t, 2.46, 2.68);
      const [ux, uy] = P(-110, 226 - rise * 150);
      pose(sunS, { x: ux, y: uy, s: 0.6 + rise * 0.5, r: T * 8, o: rise > 0.01 ? 1 : 0 });
      const up = es(t, 2.54, 2.68);
      const [rx, ry] = P(70, 172 - (1 - up) * 16);
      pose(risen, { x: rx, y: ry, o: up });

      /* Jesus tells them; they listen, darken, lift their heads */
      jesus.set({ x: JX, y: JY - 4, s: 0.98, armF: 30 + bump(t, 0.05, 0.9) * 40 + bump(t, 1.05, 1.9) * 30 + es(t, 2.55, 2.75) * 60, armB: 20 + bump(t, 0.05, 0.9) * 50 + es(t, 2.55, 2.75) * 90, head: -6 + bump(t, 2.05, 2.55) * 14, blink: blinkAt(T, 1) });
      D.forEach((d) => {
        const shock = bump(t, 1.9, 2.7);
        const joy = es(t, 2.55, 2.75);
        d.p.set({ x: d.x, y: d.y, s: 0.92, flip: d.x > JX, armF: 20 + shock * 40 + joy * 30, armB: shock * 60 * (d.i % 2), head: -8 + shock * 16 - joy * 10, blink: blinkAt(T, d.seed) });
      });

      S.cam.z = 1.02 + es(t, 0.1, 0.6) * 0.03;
      S.cam.y = kf(t, [[0, 0], [0.6, -10], [3, -10]]);
    };
  },
};
