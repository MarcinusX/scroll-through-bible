// Mt 26,39 — a little further on He falls on His face by a rock (an hourglass hangs in the dark: the hour). "My
// Father": light opens high above the olive trees — the Father is never a figure, only light — and a cup made of light
// is lowered towards Him: "if it is possible, let this cup pass away from me". "Nevertheless, not what I desire, but
// what you desire": He bows, and the light comes down over Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, olive, rock, moon, stars, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, withFace, faceBits, cupOfLight, hourglassParts, rayBurst, twoSkies, NIGHT2, PI, vis } from './lib.js';

const GY = 720;

export default {
  id: 'mt26-prayer',
  beats: [
    { v: 39, text: 'I odszedłszy nieco dalej, upadł na twarz i modlił się tymi słowami:' },
    { v: 39, cont: true, text: '«Ojcze mój, jeśli to możliwe, niech Mnie ominie ten kielich!' },
    { v: 39, cont: true, text: 'Wszakże nie jak Ja chcę, ale jak Ty».' },
  ],
  cam: { x: [-40, 60], y: [-40, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const K = twoSkies(S, NIGHT2, ['#232a58', '#3b4077', '#5d5f8e']);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 470, n: 110 }));
    // the Father's light, high above the trees (never a figure)
    const lightL = S.layer({ par: 0.06, sh: 0, flat: true });
    lightL.add(`<g transform="translate(880 -120)"><circle r="420" fill="url(#halo-glow)" opacity=".8"/>${rayBurst(c, { n: 20, r0: 40, r1: 900, spread: 0.04, color: '#fff3cf', o: 0.35 })}</g>`);
    lightL.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle class="mglow" r="170" fill="url(#halo-glow)" opacity=".6"/>${moon(c, 62)}`, { x: 560, y: 220, len: 600 });
    const mGlow = moonEl.querySelector('.mglow');
    const OL = (k) => ({ trunk: mix(C.wood2, C.indigo, k), leaf: mix(C.olive, C.indigo, k), leaf2: mix(C.sage, C.indigo, k) });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 500, amps: [18, 8, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.indigo, 0.62) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const m2 = band(c, { y: 580, amps: [10, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.indigo, 0.56) });
    mid.add(m2.markup + olive(c, 330, m2.fn(330) + 20, 1.0, OL(0.5)) + olive(c, 1250, m2.fn(1250) + 20, 1.1, OL(0.5)));
    const ground = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(GY - 40, [4, 2], [600, 160]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage, C.indigo, 0.5)).out() + grass(c, { x0: -600, x1: 2200, y: GY - 40, fn: gfn, n: 40, h: 12, color: mix(C.moss, C.indigo, 0.45) }));
    ground.add(olive(c, 120, gfn(120) + 40, 1.7, OL(0.35)) + olive(c, 1520, gfn(1520) + 40, 1.8, OL(0.35)));
    // the hour, hanging in the dark
    const hgL = S.layer({ par: 0.3, sh: 4 });
    const hg = hourglassParts(c, 110);
    const hour = hanging(hgL, `<g>${hg.frame}<g class="top">${hg.top}</g><g class="bot" transform="translate(0 ${hg.h / 2 - 12})">${hg.bottom}</g>${hg.stream}</g>`, { x: 1080, y: -1500, len: 600 });
    const hTop = hour.querySelector('.top'), hBot = hour.querySelector('.bot');
    // the cup of light
    const cupL = S.layer({ par: 0.4, sh: 3 });
    const beamId = S.id('cb');
    S.defs(`<linearGradient id="${beamId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d0" stop-opacity=".55"/><stop offset="1" stop-color="#fff4d0" stop-opacity="0"/></linearGradient>`);
    const beam = cupL.add(`<g opacity="0"><path d="${c.poly([[-40, 0], [40, 0], [140, 330], [-140, 330]])}" fill="url(#${beamId})"/></g>`);
    const cupEl = hanging(cupL, cupOfLight(c, 70), { x: 880, y: -1500, len: 700 });
    const cGlow = cupEl.querySelector('.glow'), cRays = cupEl.querySelector('.rays');

    // Him, and the rock
    const P = S.layer({ par: 0.5, sh: 5 });
    const stand = S.puppet(P.add(person(c, CAST.jesus)));
    const kEl = P.add(withFace(person(c, { ...CAST.jesus, pose: 'kneel' }), faceBits(c)));
    const kneel = S.puppet(kEl);
    const kSad = kEl.querySelector('[data-part="sad"]'), kTear = kEl.querySelector('[data-part="tear"]');
    P.add(rock(c, 930, GY + 26, 230, 90, mix(C.rock2, C.indigo, 0.25)));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(140, 930, 260, 90, 12, 0.2), 1, 8), mix(C.moss2, C.night, 0.45)).p(c.cut(c.blob(1500, 940, 280, 100, 12, 0.2), 1, 8), mix(C.moss2, C.night, 0.5)).out());

    return (t, time) => {
      const T = time;
      swing(moonEl, 560, 220, T, 0.8, 0.5);
      const accept = es(t, 2.05, 2.5);
      K.sky2.fade(accept);
      fade(mGlow, 0.5 + accept * 0.4);
      starL.fade(0.8 + accept * 0.2);

      /* v35 — a little further; He falls to the ground and prays that the hour might pass */
      const walkK = [[-0.3, [620, GY]], [0.3, [800, GY]]];
      const [wx] = kf(t, walkK, ease.sine);
      const down = es(t, 0.3, 0.36);
      const prone = es(t, 0.36, 0.6) * (1 - es(t, 1.05, 1.35));
      const lift = es(t, 1.1, 1.45) * (1 - accept);
      stand.set({ x: wx, y: GY, s: 1.16, flip: false, o: 1 - down, walk: moving(t, walkK, 1) ? wx * 0.05 : undefined, armF: 14, head: 10, blink: blinkAt(T) });
      kneel.set({
        x: 812 + prone * 10, y: GY + 4, s: 1.16, flip: false, o: down,
        lean: prone * 44 + accept * 10, head: prone * 20 - lift * 22 + accept * 24,
        armF: 20 + prone * 70 + lift * 55 - accept * 50, armB: 10 + prone * 60 + lift * 120 - accept * 110,
        blink: blinkAt(T, 2),
      });
      fade(kSad, Math.max(prone, lift * 0.8));
      fade(kTear, es(t, 0.5, 0.8) * (1 - es(t, 2.6, 2.9)));
      const hIn = es(t, 0.3, 0.7, ease.out) * (1 - es(t, 1.2, 1.5, ease.in));
      vis(hour, { x: S.portrait ? 990 : 1080, y: 300 - (1 - hIn) * 600,   // phone: clear of the edge and the thread
        r: Math.sin(T * 0.8) * 2, o: hIn > 0.01 ? 1 : 0 });
      const sand = seg(t, 0.4, 1.3);
      pose(hTop, { x: 0, y: -4, sy: 1 - sand * 0.6, oy: -4 });
      pose(hBot, { x: 0, y: hg.h / 2 - 12, sy: 0.3 + sand * 0.5 });

      lightL.fade(es(t, 1.0, 1.4) * 0.8 + accept * 0.2);
      /* v39b — the cup of light: lowered above Him; then its light comes down over Him */
      const cin = es(t, 1.05, 1.5, ease.out);
      const cy = 330 - (1 - cin) * 700 + accept * 50;
      vis(cupEl, { x: 880 - accept * 20, y: cy, r: Math.sin(T * 0.7) * 1.5 * (1 - accept), o: cin > 0.01 ? 1 : 0 });
      fade(cGlow, 0.7 + accept * 0.3);
      vis(cRays, { r: T * 3, s: 1 + accept * 0.3, o: 0.35 + accept * 0.3 });
      vis(beam, { x: 860 - accept * 20, y: cy + 40, sy: 1, o: accept * 0.9 });

      S.cam.x = kf(t, [[-0.5, -20], [0.4, 10], [1.1, 20], [2.1, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.4, 1.18], [1.1, 1.14], [1.6, 1.24], [2.1, 1.2], [2.8, 1.32]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.4, 110], [1.1, 60], [1.6, 90], [2.1, 70], [2.8, 120]]);
    };
  },
};
