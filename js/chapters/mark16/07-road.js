// Mk 16,12–13 — Afternoon on a country road. Two of them walk out towards a village; a traveller in a
// hooded cloak catches them up and walks between them — the Risen One "in another form" (only a faint halo
// gives Him away). At the village the halo blazes, they know Him, and He is gone in light. Night falls as
// they run all the way back to the others at the house — who shake their heads: they do not believe them either.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, rock, sun, moon, stars, town, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { WALKERS, STRANGER, LOOK, headAt, speech, thought, risenIcon, GLYPH, sparkle, glory, walledCity, kf, moving, skyKeys, PI } from './lib.js';
import { CAST } from '../kit.js';

const DAYP = [C.skyBlue, mix(C.cream, C.skyBlue, 0.3), C.dawn];
const DUSKP = [mix(C.duskViolet, C.skyBlue2, 0.3), C.dusk, C.peach];
const NIGHTP = [C.night2, C.indigo, mix(C.indigo, C.duskViolet, 0.5)];
const GY = 712;

export default {
  id: 'm16-road',
  beats: [
    { v: 12, text: 'Potem ukazał się w innej postaci dwom z nich' },
    { v: 12, cont: true, text: 'na drodze, gdy szli do wsi.' },
    { v: 13, text: 'Oni powrócili i oznajmili pozostałym.' },
    { v: 13, cont: true, text: 'Lecz im też nie uwierzyli.' },
  ],
  cam: { x: [-500, 280], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAYP);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starEl = hangL.add(`<g opacity="0">${stars(c, { x0: -900, x1: 2400, y0: -400, y1: 360, n: 80 })}</g>`);
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: 1250, y: 200, len: 900 });
    const moonEl = hanging(hangL, moon(c, 30), { x: 300, y: 160, len: 800 });

    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 120], color: C.hillFar });
    far.add(h1.markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 540, amps: [26, 10, 3], lens: [900, 300, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 24 });
    mid.add(h2.markup + `<g>${walledCity(c, 60, h2.fn(60) + 8, 0.9)}</g>` + town(c, { x: 1360, y: h2.fn(1360) + 6, n: 6, spread: 220, sc: 0.62 }));
    const lit = mid.add(`<g opacity="0">${town(c, { x: 1360, y: h2.fn(1360) + 6, n: 6, spread: 220, sc: 0.62, lit: true })}</g>`);

    const ground = S.layer({ par: 0.5, sh: 3 });
    const gy = c.wave(640, [6, 2], [800, 200]);
    const gs = sheet();
    gs.p(c.ridge(gy, -1400, 2800, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.3));
    gs.p(c.ribbon([[-1400, 740], [0, 732], [600, 726], [1200, 722], [2800, 716]], 64, 3), C.sand);
    gs.x(c.ribbon([[-1400, 752], [600, 740], [2800, 730]], 16, 2), C.sand2, 'opacity=".5"');
    ground.add(gs.out());
    ground.add(grass(c, { x0: -1400, x1: 2800, y: 640, fn: gy, n: 70, h: 16, color: C.moss }) + olive(c, 820, 668, 1.1) + cypress(c, 1060, 660, 150) + olive(c, 1500, 666, 1) + bush(c, 1250, 690, 80, C.sage, C.moss) + rock(c, 700, 690, 60, 24));
    // the house back in the city, where the others are
    ground.add(house(c, 250, 700, 220, 190, { stairs: false }));
    const houseLit = ground.add(`<g opacity="0">${house(c, 250, 700, 220, 190, { stairs: false, lit: true })}<path d="${c.poly(c.rect(294, 620, 40, 82))}" fill="${C.lampGlow}" opacity=".9"/></g>`);

    /* the two, the traveller, the others */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const others = [CAST.peter, CAST.thomas, LOOK.bartholomew, CAST.john].map((o, i) => ({ i, x: 320 + i * 62, seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, { ...o }))) }));
    const doubters = others.filter((m) => m.i !== 1);
    const stGlow = PL.add(`<g opacity="0">${glory(c, 150, 16)}</g>`);
    const stranger = S.puppet(PL.add(person(c, { ...STRANGER, holdF: `<path d="${c.ribbon([[0, 70], [2, -64]], 4)}" fill="${C.wood2}"/>` })));
    const halos = stranger.el.querySelectorAll('.halo, .halo-glow');
    const two = WALKERS.map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, { ...o }))) }));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, -60, 1000, 240, C.moss, C.sage) + bush(c, 1660, 1000, 220, C.moss2, C.sage) + grass(c, { x0: -700, x1: 300, y: 975, n: 20, h: 44, color: C.moss2 }) + grass(c, { x0: 1300, x1: 2300, y: 975, n: 20, h: 44, color: C.moss2 }) + flowers(c, { x0: 150, x1: 380, y: 975, n: 8, h: 36 }));
    // night falls over everything on the stage (a sheet of blue, faded on the compositor)
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}"/>`);
    const FX = S.layer({ par: 0.5, sh: 5 });
    const doubts = doubters.map((m) => ({ m, el: FX.add(`<g>${thought(c, `<g transform="scale(1.1)">${GLYPH.q(c)}</g>`, { w: 50, h: 40 })}</g>`) }));
    const tell = FX.add(`<g>${speech(c, `<g transform="scale(.95)">${risenIcon(c)}</g>`, { w: 84, h: 70, flip: true })}</g>`);
    const burst = [0, 1, 2, 3].map((i) => FX.add(`<g>${sparkle(c, 16)}</g>`));

    // group walk: key x of the middle of the group
    const GK = [[-0.3, 500], [1.0, 700], [1.75, 1000]];
    const RK = [[2.0, 1000], [2.75, 610]];

    return (t, time) => {
      skyKeys(sk, t, [[1.0, DAYP], [1.95, DUSKP], [2.7, NIGHTP]]);
      const night = es(t, 2.2, 2.8);
      fade(starEl, night);
      tint.fade(es(t, 1.5, 2.0) * 0.12 + night * 0.3);
      swing(sunEl, 1250, lerp(200, 560, es(t, 1.0, 2.2)), time, 0.8, 0.5);
      swing(moonEl, 300, lerp(700, 160, es(t, 2.2, 3.0)), time, 1, 0.6, 1);
      fade(houseLit, night);
      fade(lit, es(t, 1.6, 2.0) * (1 - night * 0.3));

      /* v12: the two walk out; the traveller joins them */
      const back = t >= 2.0;
      const gx = back ? kf(t, RK) : kf(t, GK);
      const going = back ? moving(t, RK) : moving(t, GK);
      const stop = es(t, 1.72, 1.8) * (1 - seg(t, 2.0, 2.02));
      const know = es(t, 1.75, 1.9);
      two.forEach((w) => {
        const x = gx + (w.i ? 80 : -80) * (back ? -0.6 : 1);
        const arrive = back ? es(t, 2.75, 2.85) : 0;
        const talk = w.i === 0 ? es(t, 2.8, 2.95) * (1 - es(t, 3.6, 3.8)) : 0;
        const sad = es(t, 3.3, 3.6);
        w.p.set({ x, y: GY + (w.i ? 6 : -4), s: 1.05, flip: back, walk: going ? x * (back ? 0.08 : 0.05) + w.i : undefined, amt: back ? 1.3 : 1, lean: back ? 6 * (1 - arrive) : 0, armF: 20 + know * (1 - seg(t, 2.0, 2.1)) * 80 + talk * 70 - sad * 10, armB: 10 + know * (1 - seg(t, 2.0, 2.1)) * 110 + talk * 60 * (1 - sad), head: (back ? 0 : bump(t, 0.4, 1.8) * -4) - know * (1 - seg(t, 2.0, 2.1)) * 10 + sad * 12, blink: blinkAt(time, w.seed), o: seg(t, -0.5, -0.4) });
      });
      // the traveller: from behind, in between them — and then gone in light
      const catchUp = es(t, 0.1, 0.8);
      const sx = lerp(260, gx + 4, catchUp);
      const vanish = es(t, 1.82, 1.98);
      stranger.set({ x: sx, y: GY + 2, s: 1.07, flip: false, o: seg(t, 0.1, 0.25) * (1 - vanish), walk: (catchUp > 0 && catchUp < 1) || (going && !back) ? sx * 0.05 + 2 : undefined, armF: 36, armB: 10 + bump(t, 1.1, 1.6) * 40, head: bump(t, 1.0, 1.6) * -4, blink: blinkAt(time, 5) });
      halos.forEach((h) => fade(h, 0.28 + know * 0.72));
      pose(stGlow, { x: sx, y: GY - 110, s: 0.4 + know * 0.8, r: t * 8, o: know * (1 - es(t, 2.0, 2.3)) });
      burst.forEach((b, i) => {
        const k = bump(t, 1.85 + i * 0.04, 2.3 + i * 0.04);
        pose(b, { x: sx + Math.cos(i * 1.6) * 40, y: GY - 120 + Math.sin(i * 1.6) * 60 - k * 40, s: k, r: time * 40, o: k });
      });

      /* v13a: they run back and tell the others */
      const [thx, thy] = headAt(gx + 48, GY - 4, 1.05, true);
      const tb = es(t, 2.8, 3.0, ease.back) * (1 - es(t, 3.4, 3.6) * 0.25);
      pose(tell, { x: thx - 14, y: thy - 26, s: tb, o: tb > 0.01 ? 1 : 0, r: -es(t, 3.4, 3.6) * 6 });
      /* v13b: they don't believe them either */
      const shake = es(t, 3.05, 3.2) * (1 - es(t, 3.85, 3.95));
      others.forEach((m) => {
        const come = es(t, 2.4 + m.i * 0.04, 2.6 + m.i * 0.04);   // they are all there (not half-faded) by the middle of the beat
        m.p.set({ x: m.x, y: GY - 10 - (m.i % 2) * 8, s: 0.98, flip: false, o: come, armF: 30 + es(t, 3.05, 3.3) * (m.i % 2 ? 50 : 20), armB: 20 + es(t, 3.05, 3.3) * (m.i % 2 ? 60 : 0), head: Math.sin(time * 9 + m.i) * 10 * shake + 6 * es(t, 3.2, 3.5), blink: blinkAt(time, m.seed) });
      });
      doubts.forEach(({ m, el }, i) => {
        const [hx, hy] = headAt(m.x, GY - 10 - (m.i % 2) * 8, 0.98, false);
        const b = es(t, 3.1 + i * 0.08, 3.3 + i * 0.08, ease.back);
        pose(el, { x: hx + 6, y: hy - 20, s: b * 0.9, o: b > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -240], [1.0, -120], [1.9, 260], [2.1, 260], [2.85, S.portrait ? -480 : -400]]);   // phone: the others by the house are all on the screen
      S.cam.y = 20;
      S.cam.z = 1.03 + es(t, 2.9, 3.4) * 0.05;
    };
  },
};
