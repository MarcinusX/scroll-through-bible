// Łk 12,4–5 — dusk on a hilltop. Jesus opens His arms to the four round Him — "my friends" — and they draw close.
// Over them a lit shadow-screen comes down: a soldier's shadow lifts his sword over a kneeling disciple; the stroke,
// and the kneeling shadow sinks down — but a small bright light, his soul, rises out of the top of the screen; the
// sword is lifted after it and cannot reach it, and then the soldier lets his arm fall: after that he has nothing
// more he can do. "I will show you whom to fear": the screen goes up, the dusk turns gold, and high above the great
// round radiance opens (no figure, only light); far down on the right the ravine of Gehenna smoulders red. Jesus
// points up; the little soul-light rises into the radiance. "Yes, I tell you, fear Him": the four go down on their
// knees and bow before the light.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, stars, rock, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { soldier } from '../mark15/lib.js';
import { rayBurst, radiance } from '../john1/lib.js';
import { DUSK, shadowScreen, silh, soulLight, headAt, halo, tr, PI } from './lib.js';

const JX = 800, JY = 712;
const FR = [{ o: CAST.andrew, x: 560, y: 722 }, { o: CAST.peter, x: 660, y: 716 }, { o: CAST.john, x: 940, y: 716 }, { o: CAST.james, x: 1040, y: 724 }];
const SX = 800, SY = 150, SW = 390, SH = 220;   // the shadow screen (top centre, size)
const INK = '#3b2a22';

export default {
  id: 'lk12-friends',
  beats: [
    { v: 4 },
    { v: 5, text: 'Pokażę wam, kogo się macie obawiać: bójcie się Tego, który po zabiciu ma moc wtrącić do piekła.' },
    { v: 5, cont: true, text: 'Tak, mówię wam: Tego się bójcie!' },
  ],
  cam: { x: [-30, 30], y: [-70, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, DUSK);
    const gold = sky(S, ['#d9c29a', '#f1d6a4', '#f6e3bd'], { name: 'gold', rise: 0 });
    gold.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 320, n: 60 }));
    const lightL = S.layer({ par: 0.04, sh: 2, rise: 0 });
    const rays = lightL.add(`<g opacity="0">${rayBurst(c, { n: 30, r0: 60, r1: 950, spread: 0.035, o: 0.6 })}<circle r="420" fill="url(#halo-glow)"/></g>`);
    const rad = lightL.add(`<g transform="translate(0 -1500)">${radiance(c, 104)}</g>`);

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.4) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.3), trees: 12, treeColor: mix(C.moss2, C.night2, 0.25), treeH: 20 }).markup);
    /* Gehenna: the smouldering ravine down on the right */
    const gh = S.layer({ par: 0.3, sh: 3 });
    const ravine = gh.add(`<g opacity="0">${sheet().p(c.cut([[900, 704], [960, 646], [1040, 632], [1130, 620], [1250, 626], [1380, 652], [1380, 704]], 1.4, 8), mix(C.soilDark, C.duskViolet, 0.25)).out()}</g>`);
    const ghGlow = gh.add(`<g opacity="0"><ellipse cx="1140" cy="650" rx="230" ry="46" fill="url(#warm-glow)"/><path d="${c.cut([[980, 654], [1060, 644], [1150, 638], [1250, 644], [1320, 656], [1250, 666], [1100, 668]], 0.8, 8)}" fill="${mix(C.terracotta, C.soilDark, 0.35)}"/><path d="${c.cut([[1040, 652], [1140, 646], [1240, 652], [1140, 658]], 0.6, 6)}" fill="${C.sunDeep}" opacity=".7"/></g>`);
    const smoke = [0, 1, 2, 3].map(() => gh.add(`<g><path d="${c.ribbon(c.cbez([0, 0], [-20, -40], [20, -80], [-6, -140], 14), (u) => 16 - u * 10)}" fill="${mix(C.storm, C.rock3, 0.4)}" opacity=".55"/></g>`));

    /* the hilltop */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(694, [6, 3], [700, 200]);
    G.add(sheet().p(c.ridge((x) => gfn(x) + Math.max(0, x - 900) * 0.16, -900, 2500, 1700, 12, 1), mix(C.sage2, C.duskViolet, 0.3)).out());
    G.add(rock(c, 380, 744, 140, 44, mix(C.rock2, C.duskViolet, 0.25)) + grass(c, { x0: -600, x1: 1000, y: 690, fn: gfn, n: 30, h: 12, color: mix(C.moss, C.duskViolet, 0.2) }));

    /* the shadow screen and its figures */
    const scrL = S.layer({ par: 0.3, sh: 5 });
    const screen = scrL.add(`<g>${shadowScreen(c, SW, SH)}</g>`);
    const SWORD = `<path d="${c.cut([[-3, 0], [3, 0], [2.4, 86], [0, 98], [-2.4, 86]], 0.2, 5)}" fill="${INK}"/><path d="${c.poly(c.rect(-12, -2, 24, 5))}" fill="${INK}"/>`;
    const sold = S.puppet(scrL.add(silh(soldier(c, 0, { spear: false, extra: { holdB: `<g transform="rotate(180)">${SWORD}</g>` } }), INK)));
    const knee = scrL.add(`<g>${silh(person(c, { ...CAST.thomas, pose: 'kneel' }), INK)}</g>`);
    const shade0 = scrL.add(`<g opacity="0"><rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="#2a2440"/></g>`);

    /* the friends and Jesus */
    const P = S.layer({ par: 0.5, sh: 5 });
    const warmth = P.add(`<g opacity="0">${halo(260, 1)}</g>`);
    const fr = FR.map((f, i) => ({ ...f, i, seed: c.rr(0, 9), flip: f.x > JX, st: S.puppet(P.add(person(c, f.o))), kn: S.puppet(P.add(person(c, { ...f.o, pose: 'kneel' }))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.32, sh: 6 });
    const soul = fx.add(`<g opacity="0">${soulLight(c, 14)}</g>`);

    return (t, time) => {
      const T = time;
      if (S.portrait) gh.shift(-130, 0);   // phone: Gehenna smoulders between John and James, not under the thread
      /* v4 — my friends; the shadow that kills the body, and can do no more */
      const open = es(t, 0.05, 0.3);
      const sd = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.02, 1.3, ease.in));
      const sy = lerp(-1500, SY, sd);
      pose(screen, { x: SX, y: sy, r: Math.sin(T * 0.7) * 0.5 * sd });
      const base = sy + SH - 16;
      const raise = es(t, 0.3, 0.44), strike = es(t, 0.44, 0.5), again = bump(t, 0.64, 0.84), drop = es(t, 0.84, 0.95);
      sold.set({ x: SX - 60, y: base, s: 0.62, armB: 10 + raise * 150 * (1 - strike * 0.7) + again * 90 * (1 - drop), armF: 20 + strike * 30, head: 6 - again * 20, lean: strike * 10 - again * 6, o: sd > 0.01 ? 1 : 0 });
      const fall = es(t, 0.5, 0.62);
      pose(knee, { x: SX + 50 + fall * 10, y: base + fall * 8, s: 0.62, r: fall * 38, o: sd > 0.01 ? 1 - fall * 0.5 : 0 });
      fade(shade0, es(t, 0.9, 1.05) * 0.55 * (sd > 0.01 ? 1 : 0));
      const up = es(t, 0.55, 0.9), toLight = es(t, 1.25, 1.85);
      const sx0 = SX + 58, sy0 = base - 78;
      pose(soul, { x: lerp(lerp(sx0, SX + 150, up), 800, toLight), y: lerp(lerp(sy0, SY + 20, up), 150, toLight) + (time ? Math.sin(T * 2) * 4 : 0), s: 0.7 + up * 0.6 - toLight * 0.4, o: es(t, 0.52, 0.6) * (1 - es(t, 1.8, 1.95)) });

      /* v5a — the light above, Gehenna below */
      const lk = es(t, 1.1, 1.5);
      gold.layer.fade(lk * 0.85);
      starL.fade(1 - lk);
      pose(rays, { x: 800, y: 150, s: 0.5 + lk * 0.6 + es(t, 2.05, 2.4) * 0.2, r: T * 2, o: lk });
      pose(rad, { x: 800, y: lerp(-1500, 150, es(t, 1.1, 1.45, ease.out)), s: 0.9 + es(t, 2.05, 2.4) * 0.1 });
      fade(ravine, es(t, 1.3, 1.5));
      fade(ghGlow, es(t, 1.4, 1.65) * (0.85 + (time ? Math.sin(T * 3) * 0.1 : 0)));
      smoke.forEach((sm, i) => {
        const k = time ? (T * 0.2 + i / 4) % 1 : (i + 0.5) / 4;
        pose(sm, { x: 1000 + i * 70, y: 646 - k * 60, s: 0.6 + k * 0.6, o: es(t, 1.4, 1.65) * Math.sin(k * PI) });
      });
      const point = es(t, 1.15, 1.4);
      jesus.set({ x: JX, y: JY, s: 1.04, armF: 20 + open * 40 * (1 - point) + point * 20 + bump(t, 1.5, 1.95) * 50, armB: 10 + open * 50 * (1 - point) + point * 150, head: -point * 12 + es(t, 2.1, 2.4) * 6, blink: blinkAt(T) });
      pose(warmth, { x: JX, y: JY - 120, s: 1, o: open * 0.35 * (1 - lk * 0.5) });

      /* v5b — they kneel before Him who has that power */
      fr.forEach((f) => {
        const k = es(t, 0.05 + f.i * 0.03, 0.3 + f.i * 0.03);
        const x = lerp(f.x + (f.flip ? 40 : -40), f.x, k);
        const kk = es(t, 2.05 + f.i * 0.04, 2.13 + f.i * 0.04);
        const look = es(t, 1.15, 1.4);
        f.st.set({ x, y: f.y, s: 0.94, flip: f.flip, o: 1 - kk, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 14 + look * 20, armB: 8, head: -2 - look * 14, blink: blinkAt(T, f.seed) });
        f.kn.set({ x, y: f.y, s: 0.94, flip: f.flip, o: kk, armF: 60, armB: 40, head: 14, lean: 12, blink: blinkAt(T, f.seed) });
      });

      S.cam.y = -es(t, 1.0, 1.4) * 60 + es(t, 2.0, 2.4) * 30;
      S.cam.z = 1 + es(t, 0.1, 0.6) * 0.04 - es(t, 1.0, 1.4) * 0.03;
      S.cam.x = -es(t, 0.1, 0.5) * 20 + es(t, 1.0, 1.4) * 30;
    };
  },
};
