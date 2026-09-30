// Łk 12,49–50 — dusk on a high hill over a wide land of hills, and on every far crest a little pile of wood, waiting.
// "I came to throw fire on the earth": Jesus lifts His hand and a spark flies from it far out over the valley and drops
// on the nearest crest — a small fire catches there. "I wish it were already kindled": He stretches out His arm to the
// land; one crest after the next begins to catch — but only a few; the rest still wait in the dusk. "But I have a
// baptism to be baptized with, and how distressed I am until it is accomplished!": the sky goes dark and red, deep dark
// water rises in waves round the foot of His hill, far away a small cross shows black against the last light on a
// hill, and He bows His head, His hand on His heart.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, stars, rock, grass } from '../../assets/nature.js';
import { waveStrip } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { fireFlames } from '../luke2/lib.js';
import { DUSK, headAt, hand, halo, warm, voiceRings, spark, PI } from './lib.js';

const JX = 800, JY = 640;
const CRESTS = [[1010, 470], [560, 462], [1180, 488], [420, 484], [700, 440], [1300, 450], [300, 452]];

function pile(c) {
  return sheet().p([0, 1, 2, 3].map((i) => c.ribbon([[-14 + i * 6, 0], [-4 + i * 4, -18 - (i % 2) * 4]], 3)).join(''), C.wood2).out();
}

export default {
  id: 'lk12-fire',
  beats: [
    { v: 49, text: 'Przyszedłem rzucić ogień na ziemię' },
    { v: 49, cont: true, text: 'i jakże bardzo pragnę, żeby on już zapłonął' },
    { v: 50 },
  ],
  cam: { x: [-30, 30], y: [-10, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DUSK);
    const dark = sky(S, ['#1d1f45', '#5b3a5e', '#b0584a'], { name: 'dark', rise: 0 });
    dark.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 360, n: 70 }));
    starL.fade(0.4);
    S.layer({ par: 0.06, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.5) }).markup);
    const crossL = S.layer({ par: 0.07, sh: 1 });
    const cross = crossL.add(`<g opacity="0"><path d="${c.cut([[-3, 0], [-3, -60], [-18, -60], [-18, -66], [-3, -66], [-3, -78], [3, -78], [3, -66], [18, -66], [18, -60], [3, -60], [3, 0]], 0.3, 4)}" fill="#2b2130"/></g>`);
    const hl = S.layer({ par: 0.12, sh: 3 });
    const h1 = hillsWith(c, { y: 470, amps: [22, 9, 3], lens: [700, 260, 100], color: mix(C.hillMid, C.duskViolet, 0.35), trees: 12, treeColor: mix(C.moss2, C.night2, 0.3), treeH: 18 });
    hl.add(h1.markup);
    const fireL = S.layer({ par: 0.12, sh: 2 });
    const piles = CRESTS.map(([x], i) => { const y = h1.fn(x) + 4; return { i, x, y, pile: fireL.add(`<g transform="translate(${x} ${y})">${pile(c)}</g>`), glow: fireL.add(`<g opacity="0">${warm(60, 1)}</g>`), fl: fireL.add(`<g opacity="0">${fireFlames(c, 34)}</g>`) }; });
    const valley = S.layer({ par: 0.25, sh: 3 });
    valley.add(band(c, { y: 560, amps: [8, 4, 2], lens: [800, 300, 100], color: mix(C.hillNear, C.duskViolet, 0.35) }).markup);
    /* the dark water that rises round the hill */
    const water = S.layer({ par: 0.32, sh: 3, pad: 200 });
    water.add(waveStrip(c, { y: 0, len: 110, amp: 12, color: mix(C.waveStorm2, C.night2, 0.3), crest: mix(C.waveStorm, C.stone2, 0.3) }));
    water.add(`<g transform="translate(55 40)">${waveStrip(c, { y: 0, len: 110, amp: 10, color: mix(C.waveStorm2, C.night2, 0.5), crests: false })}</g>`);
    /* His hill */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = (x) => JY + Math.pow((x - JX) / 380, 2) * 90 + Math.sin(x * 0.02) * 3;
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.sage2, C.duskViolet, 0.3)).out() + rock(c, 700, JY + 22, 150, 40, mix(C.rock2, C.duskViolet, 0.25)) + grass(c, { x0: -600, x1: 2200, y: JY, fn: gfn, n: 40, h: 12, color: mix(C.moss, C.duskViolet, 0.25) }));
    const P = S.layer({ par: 0.45, sh: 5 });
    const aura = P.add(`<g>${halo(160, 0.5)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.3, sh: 6 });
    const sp = fx.add(`<g opacity="0">${spark(c, 12, C.sun)}</g>`);

    return (t, time) => {
      const T = time;
      /* v49a — a spark thrown onto the earth */
      const lift = es(t, 0.1, 0.3), throwK = seg(t, 0.3, 0.75);
      const reach = es(t, 1.1, 1.35) * (1 - es(t, 2.05, 2.25));
      const bow = es(t, 2.2, 2.45);
      jesus.set({ x: JX, y: JY, s: 1.06, armF: 20 + lift * 100 * (1 - throwK * 0.5) + reach * 60 - bow * 50, armB: 10 + lift * 60 * (1 - bow) + bow * 70, head: -lift * 10 + bow * 22, lean: bow * 8, blink: bow > 0.5 ? 0.85 : blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150, o: 0.6 - bow * 0.3 });
      const [hx, hy] = hand(JX, JY, 1.06, false, 120);
      const c0 = piles[0];
      pose(sp, { x: lerp(hx, c0.x, throwK), y: lerp(hy, c0.y - 10, throwK) - Math.sin(throwK * PI) * 160, s: 1 - throwK * 0.4, r: T * 60, o: throwK > 0 && throwK < 1 ? 1 : 0 });
      /* v49b — would that it were already kindled: only a few catch */
      piles.forEach((p) => {
        const at = p.i === 0 ? 0.74 : 1.2 + (p.i - 1) * 0.22;
        const k = p.i <= 2 ? es(t, at, at + 0.15) : 0;
        const fl = time ? 1 + Math.sin(T * 7 + p.i) * 0.08 : 1;
        pose(p.fl, { x: p.x, y: p.y - 6, s: k * 0.9 * fl, o: k > 0.01 ? 1 : 0 });
        pose(p.glow, { x: p.x, y: p.y - 14, s: 0.6 + k * 0.6, o: k });
      });
      /* v50 — the baptism: the dark water, His distress */
      const dk = es(t, 2.05, 2.5);
      dark.layer.fade(dk);
      starL.fade(0.4 + dk * 0.5);
      const rise = es(t, 2.1, 2.7);
      water.shift(time ? (T * 18) % 110 : 0, lerp(300, 30, rise) + 580 + (time ? Math.sin(T * 1.3) * 4 : 0));
      fade(cross, es(t, 2.4, 2.65));
      pose(cross, { x: 1240, y: h1.fn(1240) + 4 });

      S.cam.x = es(t, 0.3, 0.75) * 20 - es(t, 2.0, 2.3) * 20;
      S.cam.z = 1.1 + es(t, 2.1, 2.6) * 0.04;
      S.cam.y = 20 - es(t, 0.2, 0.6) * 20 + es(t, 2.1, 2.6) * 30;
    };
  },
};
