// Mt 8,20 — a painted flat flies in: a hillside at evening. "Foxes have holes": a fox trots in and curls up in its
// den in the bank. "The birds of the air have nests": two birds fly to their nest in the tree, where the chicks
// wait. "But the Son of Man has nowhere to lay His head": night falls, the den and the nest glow warm — and Jesus,
// walking alone, sits down on the bare ground under the open sky, His mantle round Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, flap } from '../kit.js';
import { band, olive, grass, rock, stars, moon } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { fox, hangAt, PI, GOLDEN, NIGHT } from './lib.js';

const DEN = [560, 690], NEST = [1030, 486], FEET = 752;
const DX = DEN[0] - 470;

export default {
  id: 'mt8-foxes',
  enter: 'fly',
  beats: [
    { v: 20, text: 'Jezus mu odpowiedział: «Lisy mają nory' },
    { v: 20, cont: true, text: 'i ptaki powietrzne - gniazda,' },
    { v: 20, cont: true, text: 'lecz Syn Człowieczy nie ma miejsca, gdzie by głowę mógł oprzeć».' },
  ],
  cam: { x: [-20, 20], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    sky(S, GOLDEN);
    const nightSky = sky(S, NIGHT, { name: 'night' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -600, y1: 440, n: 150 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 34)}`, { x: 800, y: -500, len: 900 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [22, 9, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(band(c, { y: 560, amps: [14, 6, 2], lens: [800, 260, 100], color: mix(C.hillMid, C.duskViolet, 0.12) }).markup);

    /* ---------- the ground, the bank with the den, the tree with the nest ---------- */
    const G = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(724, [5, 2], [700, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out());
    G.add(grass(c, { x0: -800, x1: 2400, y: 724, fn: gfn, n: 50, h: 13, color: C.moss }) + rock(c, 920, 764, 60, 20, C.rock2));
    G.add(olive(c, NEST[0] + 14, 736, 1.7));
    // the bank: a mound with a round burrow in it (dark chamber behind, lip in front)
    const bankBack = sheet().p(c.cut([[180, 740], [230, 600], [330, 540], [470, 520], [600, 560], [680, 660], [720, 740]].map(([x, y]) => [x + DX, y]), 1.2, 8), mix(C.clay, C.sand2, 0.4))
      .p(c.cut(c.blob(DEN[0], DEN[1] - 44, 70, 52, 16, 0.08), 0.6, 5), mix(C.soilDark, C.soil, 0.3)).out();
    G.add(bankBack);
    const denGlow = G.add(`<g opacity="0"><ellipse cx="${DEN[0]}" cy="${DEN[1] - 44}" rx="64" ry="46" fill="url(#warm-glow)"/></g>`);
    const FX = S.layer({ par: 0.36, sh: 4 });
    const foxEl = FX.add(`<g>${fox(c)}</g>`);
    FX.add(sheet().p(c.cut([[DEN[0] - 90, 750], [DEN[0] - 84, DEN[1] - 8], [DEN[0] - 40, DEN[1] + 2], [DEN[0] + 40, DEN[1] + 2], [DEN[0] + 86, DEN[1] - 10], [DEN[0] + 94, 750]], 1, 6), mix(C.clay, C.sand2, 0.25)).out() + grass(c, { x0: DEN[0] - 90, x1: DEN[0] + 90, y: DEN[1] + 2, n: 6, h: 12, color: C.moss }));
    // the nest and the chicks
    const nestGlow = FX.add(`<g opacity="0"><circle cx="${NEST[0]}" cy="${NEST[1] - 10}" r="70" fill="url(#warm-glow)"/></g>`);
    const chicks = FX.add(`<g>${sheet().p(c.cut(c.circ(NEST[0] - 12, NEST[1] - 16, 7, 10), 0.2, 3) + c.cut(c.circ(NEST[0] + 8, NEST[1] - 18, 7, 10), 0.2, 3), C.birdLight).x(c.poly([[NEST[0] - 6, NEST[1] - 18], [NEST[0] - 1, NEST[1] - 16], [NEST[0] - 6, NEST[1] - 14]]) + c.poly([[NEST[0] + 14, NEST[1] - 20], [NEST[0] + 19, NEST[1] - 18], [NEST[0] + 14, NEST[1] - 16]]), C.ochre).out()}</g>`);
    const birds = [0, 1].map((i) => ({ i, el: FX.add(bird(c, { color: i ? C.bird : shade(C.bird, 0.2) })) }));
    let straw = '';
    for (let i = 0; i < 14; i++) straw += c.ribbon([[NEST[0] - 40 + c.rr(0, 10), NEST[1] - 10 + c.rr(-4, 8)], [NEST[0] + 40 - c.rr(0, 10), NEST[1] - 8 + c.rr(-6, 8)]], 2);
    FX.add(sheet().p(c.cut([...c.arc(NEST[0], NEST[1] - 12, 44, 22, 0, PI, 12)], 0.8, 4), C.wood3).x(straw, C.wood2, 'opacity=".7"').out());

    /* ---------- the Son of Man ---------- */
    const P = S.layer({ par: 0.36, sh: 5 });
    const walk = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const sit = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const dark = S.layer({ par: 0.36, sh: 1, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1b2150"/>`);

    return (t, time) => {
      const T = time;
      /* v20a — the fox goes to its den */
      const trot = es(t, 0.05, 0.6, (u) => u);
      const fx = lerp(-120, DEN[0] - 10, trot);
      const inDen = es(t, 0.6, 0.8);
      pose(foxEl, { x: fx, y: lerp(752, DEN[1] - 6, inDen) - (trot > 0 && trot < 1 ? Math.abs(Math.sin(fx * 0.08)) * 5 : 0), s: lerp(0.9, 0.62, inDen), sx: 1 });

      /* v20b — the birds fly home to their nest */
      birds.forEach((b) => {
        const k = es(t, 1.05 + b.i * 0.1, 1.6 + b.i * 0.1, ease.out);
        const x = lerp(1700 + b.i * 120, NEST[0] - 22 + b.i * 40, k), y = lerp(200 + b.i * 60, NEST[1] - 24 - b.i * 4, k) - Math.sin(k * PI) * 60;
        pose(b.el, { x, y, s: 0.9, sx: -1, o: t > 1.0 ? 1 : 0 });
        if (k < 1 && T) flap(b.el, T + b.i, 28, 10); else { pose(b.el.querySelector('.wingF'), { x: -2, y: -5, r: 10 }); pose(b.el.querySelector('.wingB'), { x: -2, y: -6, r: 8 }); }
      });
      pose(chicks, { y: -bump(t, 1.4, 1.9) * 6 });

      /* v20c — night; the den and the nest glow; He has nowhere to lay His head */
      const nk = es(t, 2.0, 2.5);
      nightSky.fade(nk);
      starL.fade(es(t, 2.2, 2.6));
      dark.fade(nk * 0.3);
      hangAt(moonEl, 1260, lerp(-500, 170, es(t, 2.1, 2.5, ease.out)), T, 0.8, 0.5);
      pose(denGlow, { o: es(t, 2.2, 2.5) });
      pose(nestGlow, { o: es(t, 2.25, 2.55) });
      const come = es(t, 2.0, 2.45);
      const jx = lerp(1300, 850, come);
      const sitK = es(t, 2.48, 2.54);
      walk.set({ x: jx, y: FEET, s: 1.02, flip: true, o: (t > 1.95 ? 1 : 0) * (1 - sitK), walk: come > 0 && come < 1 ? jx * 0.045 : undefined, armF: 10, blink: blinkAt(T) });
      sit.set({ x: 840, y: FEET, s: 1.02, flip: true, o: sitK, armF: 70, armB: 40, head: 12, lean: 6, blink: blinkAt(T) });

      S.cam.z = 1.02 + es(t, 2.2, 2.8) * 0.03;
      S.cam.x = -10 + es(t, 0.8, 1.3) * 20 - es(t, 1.8, 2.3) * 10;
      S.cam.y = 20;
    };
  },
};
