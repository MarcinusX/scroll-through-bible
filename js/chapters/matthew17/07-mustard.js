// Mt 17,20b–21 — outside at dusk, the high mountain in the distance. "If you have faith like a grain of mustard
// seed" — a magnifying glass comes down to show the seed, and a tiny light glows in Peter's palm; "you will say to
// this mountain, 'Move from here to there,' and it will move": the paper mountain lifts on its strings, crosses the
// sky and settles on the other side in a puff of dust. "Nothing will be impossible for you": the little seed blazes
// and sparks fill the sky. "This kind goes out only by prayer and fasting": night falls; Jesus kneels in prayer
// beside an upturned empty bowl, and they kneel with Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, olive, cypress, grass, rock, stars, moon } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { TWELVE, flatMountain, mustardGlass, seedDot, hang2, bubble, sparkle, dust, emptyBowl, handAt, kf, tr, EVENING, NIGHT } from './lib.js';

const PI = Math.PI;
const FEET = 704;
const MW = 320, MH = 280, BASE = 604;

export default {
  id: 'mt17-mustard',
  beats: [
    { v: 20, cont: true, text: 'Bo zaprawdę, powiadam wam: Jeśli będziecie mieć wiarę jak ziarnko gorczycy, powiecie tej górze: "Przesuń się stąd tam!", a przesunie się.' },
    { v: 20, cont: true, text: 'I nic niemożliwego nie będzie dla was.' },
    { v: 21 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const HERE = S.portrait ? 580 : 540, THERE = S.portrait ? 1024 : 1070;
    const sk = sky(S, EVENING, { name: 'eve' });
    const nightL = sky(S, NIGHT, { name: 'night' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: 1240, y: 160, len: 900 });
    // sparks of "nothing impossible" hung across the sky
    const skySparks = Array.from({ length: 9 }, (_, i) => ({ i, x: 480 + i * 80 + (i % 2) * 20, y: 150 + (i % 3) * 60, el: hangL.add(`<g opacity="0"><circle r="24" fill="url(#halo-glow)"/>${sparkle(c, 12 + (i % 3) * 4)}</g>`) }));

    S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 520, amps: [20, 9, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    /* the mountain that moves: a flat on two strings */
    const mtL = S.layer({ par: 0.1, sh: 4 });
    const mount = mtL.add(`<g>${hang2(`<g transform="translate(0 ${MH * 0.9})">${flatMountain(c, { w: MW, h: MH, col: mix(C.hillNear, C.duskViolet, 0.18) })}</g>`, MW * 0.09, 700)}</g>`);
    const puffs = [0, 1, 2].map((i) => mtL.add(`<g opacity="0">${dust(c, 40 + i * 8, mix(C.sand, C.duskViolet, 0.2))}</g>`));
    const hills = S.layer({ par: 0.16, sh: 3 });
    const h2 = hillsWith(c, { y: 598, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.2), trees: 20, treeColor: mix(C.sage, C.duskViolet, 0.2), treeH: 18 });
    hills.add(h2.markup + town(c, { x: 800, y: h2.fn(800) + 8, n: 5, spread: 200, sc: 0.46, lit: true }));

    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(660, [4, 2], [700, 160]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.duskViolet, 0.15)).out());
    G.add(olive(c, 230, 668, 0.95) + olive(c, 1390, 670, 0.85) + cypress(c, 1500, 668, 130, C.moss2) + rock(c, 380, 700, 60, 20, C.rock2));
    G.add(grass(c, { x0: -400, x1: 2000, y: 660, fn: gfn, n: 34, h: 12, color: C.olive }));

    /* the glass that shows the seed */
    const plL = S.layer({ par: 0.12, sh: 5 });
    const glass = hanging(plL, `<g transform="rotate(-10)">${mustardGlass(c, 62)}</g>`, { x: 1010, y: 240, len: 900 });

    /* the people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [
      { k: 'peter', x: 646 }, { k: 'andrew', x: 578 }, { k: 'john', x: 512 },
      { k: 'james', x: 958 }, { k: 'matthew', x: 1024 }, { k: 'thomas', x: 1090 },
    ].map((d, i) => {
      const o = TWELVE.find((m) => m.k === d.k).o;
      return { ...d, i, flip: d.x > 800, seed: c.rr(0, 9), st: S.puppet(pL.add(person(c, o))), kn: S.puppet(pL.add(person(c, { ...o, pose: 'kneel', eyes: 'closed' }))) };
    });
    const glowUp = pL.add(`<g opacity="0"><circle r="130" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(pL.add(person(c, CAST.jesus)));
    const jPray = S.puppet(pL.add(person(c, { ...CAST.jesus, pose: 'kneel', eyes: 'closed' })));
    const bowl = pL.add(`<g opacity="0">${emptyBowl(c, 36)}</g>`);
    const seed = pL.add(`<g opacity="0">${seedDot(c, 3.2)}</g>`);
    const blaze = pL.add(`<g opacity="0"><circle r="70" fill="url(#warm-glow)"/>${rays(c, { n: 14, r0: 12, r1: 70, spread: 0.07, color: '#fff1c8' })}</g>`);
    const says = pL.add(`<g opacity="0">${bubble(c, [tr('Przesuń się', 'Move'), tr('stąd tam!', 'from here to there!')], { size: 19, tail: -1 })}</g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(150, 975, 230, 90, 14, 0.15), 1.4, 8), mix(C.rock2, C.duskViolet, 0.2)).p(c.cut(c.blob(1470, 985, 210, 80, 14, 0.15), 1.4, 8), mix(C.rock, C.duskViolet, 0.2)).out());

    return (t, time) => {
      const T = time;
      const night = es(t, 2.02, 2.5);
      nightL.fade(night);
      starL.fade(Math.max(night, es(t, 1.05, 1.4) * 0.5));
      swing(moonEl, 1240, lerp(-1000, 170, es(t, 2.0, 2.45)), T, 0.8, 0.5);

      /* the seed under the glass, and in Peter's palm */
      const gl = es(t, 0.04, 0.25, ease.back) * (1 - es(t, 0.42, 0.56));
      swing(glass, 1010, lerp(-1000, 240, gl), T, 1.1, 0.8, 1);

      /* the mountain lifts, crosses and settles */
      const lift = es(t, 0.4, 0.55) * (1 - es(t, 0.78, 0.9));
      const across = es(t, 0.48, 0.84);
      const mx = lerp(HERE, THERE, across), my = BASE - MH * 0.9 - lift * 230;
      pose(mount, { x: mx, y: my, r: Math.sin(across * PI) * -4 + Math.sin(T * 0.8) * 0.5 * lift, oy: 0 });
      const land = es(t, 0.86, 1.1);
      puffs.forEach((el, i) => pose(el, { x: THERE + (i - 1) * 120, y: BASE - 10 - land * 20, s: 0.6 + land * 0.8, o: bump(t, 0.86, 1.4) * 0.9 }));

      /* the sparks of "nothing impossible" */
      skySparks.forEach((sp) => {
        const on = es(t, 1.1 + sp.i * 0.05, 1.3 + sp.i * 0.05, ease.back) * (1 - es(t, 2.0, 2.3));
        pose(sp.el, { x: sp.x, y: sp.y + Math.sin(T * 1.2 + sp.i) * 5, s: on, r: T * 15 + sp.i * 20, o: on });
      });

      /* Jesus: teaching; at v21 he kneels in prayer */
      const pray = es(t, 2.08, 2.15);
      const teach = es(t, 0, 0.2) * (1 - es(t, 2, 2.1));
      jesus.set({ x: 800, y: FEET, s: 1.08, o: 1 - pray, armF: 20 + teach * (30 + Math.sin(T * 1.2) * 6) + bump(t, 0.3, 0.9) * 30 + es(t, 1.05, 1.3) * 40 * (1 - es(t, 1.9, 2.05)), armB: 10 + teach * 20 + es(t, 1.05, 1.3) * 100 * (1 - es(t, 1.9, 2.05)), head: -2 + bump(t, 0.35, 0.9) * -6, blink: blinkAt(T, 1) });
      jPray.set({ x: 800, y: FEET, s: 1.08, o: pray, armF: 70, armB: 60, head: -10, blink: 0 });
      pose(glowUp, { x: 800, y: FEET - 110, s: 0.6 + night * 0.5, o: es(t, 2.2, 2.6) * 0.7 });
      pose(bowl, { x: 890, y: FEET + 4, o: es(t, 2.3, 2.6) });

      /* the disciples */
      const kneel = es(t, 2.15, 2.22);
      DIS.forEach((d) => {
        const isP = d.k === 'peter';
        const hold = isP ? es(t, 0.1, 0.3) : 0;
        const point = isP ? es(t, 0.3, 0.45) * (1 - es(t, 1.9, 2.05)) : 0;
        const wonder = es(t, 1.05 + d.i * 0.04, 1.3 + d.i * 0.04) * (1 - es(t, 1.9, 2.05));
        const watch = bump(t, 0.4, 1.0);
        d.st.set({ x: d.x, y: FEET + (d.i % 3) * 4 - 6, s: 0.92, flip: point > 0.5 ? true : d.flip, o: 1 - kneel, armF: 10 + hold * 60 + point * 30 + wonder * (d.i % 2 ? 110 : 50), armB: 8 + wonder * (d.i % 2 ? 40 : 120), head: -4 - watch * 12 - wonder * 6, blink: blinkAt(T, d.seed) });
        d.kn.set({ x: d.x, y: FEET + (d.i % 3) * 4 - 6, s: 0.92, flip: d.flip, o: kneel, armF: 70, armB: 60, head: 8, lean: 6, blink: 0 });
      });
      const P = DIS[0];
      const [hx, hy] = handAt(P.x, FEET - 6, 0.92, false, 70);
      const hold = es(t, 0.12, 0.3) * (1 - es(t, 2.05, 2.15));
      pose(seed, { x: hx + 2, y: hy - 6, s: hold * (1 + es(t, 1.05, 1.3) * 0.6), o: hold });
      pose(blaze, { x: hx + 2, y: hy - 6, s: 0.3 + es(t, 1.05, 1.4) * 0.7, r: T * 8, o: es(t, 1.05, 1.3) * (1 - es(t, 1.85, 2.1)) });
      pose(says, { x: P.x - 70, y: FEET - 236, s: es(t, 0.3, 0.45, ease.back), o: bump(t, 0.28, 0.99) > 0.05 ? 1 : 0 });

      S.cam.z = 1.02 + es(t, 0, 0.3) * 0.02 - es(t, 0.35, 0.6) * 0.02 + es(t, 2.05, 2.6) * 0.06;
      S.cam.y = 10 - es(t, 0.35, 0.6) * 30 + es(t, 1.8, 2.6) * 40;
      S.cam.x = kf(t, [[0.3, 0], [0.5, -20], [0.9, 20], [1.4, 0]]);
    };
  },
};
