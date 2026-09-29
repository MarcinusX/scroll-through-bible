// Łk 6,24–26 — the four woes, on the right arm of the same balance, mirroring the four blessings that now hang, turned
// to their "then", under its left arm. For each woe a plate comes down showing "now" in warm gold — and turns to its
// "then" in grey: the rich man on his cushions by a full coffer — the coffer empty, his consolation already paid out;
// the reveller at a laden table — an empty bowl; the laughter with a raised cup — tears in the rain; the favourite on
// his step whom everyone applauds — a false prophet in a borrowed fleece. "So their fathers did to the false
// prophets": their portraits come down, cut from dull grey paper, garlanded — and the great balance tips: the arm of
// the blessings rises into the light, the arm of the woes sinks.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { plainSet, PL, BAL, addBalance, addPlates, drivePlate, placePlate, longString, beamPlaque, beamAt, cameo, PROPHET_F, kf, halo, glow, tr, PI } from './lib.js';
import { jesus } from './09-blessed.js';

const BIG = [976, 404];
const PLAN = [
  { drop: [0.1, 0.36], flip: [0.5, 0.62], shrink: [0.9, 1.1] },
  { drop: [1.06, 1.3], flip: [1.46, 1.58], shrink: [1.9, 2.1] },
  { drop: [2.06, 2.3], flip: [2.46, 2.58], shrink: [2.9, 3.1] },
  { drop: [3.06, 3.3], flip: [3.5, 3.62], shrink: [3.9, 4.1] },
];

export default {
  id: 'lk6-woe',
  beats: [
    { v: 24 },
    { v: 25, text: 'Biada wam, którzy teraz jesteście syci, albowiem głód cierpieć będziecie.' },
    { v: 25, cont: true, text: 'Biada wam, którzy się teraz śmiejecie, albowiem smucić się i płakać będziecie.' },
    { v: 26, text: 'Biada wam, gdy wszyscy ludzie chwalić was będą.' },
    { v: 26, cont: true, text: 'Tak samo bowiem przodkowie ich czynili fałszywym prorokom.' },
  ],
  cam: { x: [-20, 40], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const P = plainSet(S);
    const c = S.c;
    const aura = P.aura;

    const BL = S.layer({ par: 0.12, sh: 6, rise: 0 });
    const lightL = BL.add(`<g opacity="0">${glow(210, 1, 'halo-glow')}</g>`);
    const bal = addBalance(BL, c);
    const plaqueL = BL.add(`<g>${beamPlaque(c, tr('Błogosławieni', 'Blessed'), { size: 19, drop: 30 })}</g>`);
    const plaqueR = BL.add(`<g>${beamPlaque(c, tr('Biada', 'Woe'), { size: 19, drop: 30, fill: mix(C.stone2, C.cream, 0.4) })}</g>`);
    const PLL = S.layer({ par: 0.14, sh: 6, rise: 0 });
    const blessed = addPlates(S, PLL, c, 0);
    const strs = [0, 1, 2, 3].map(() => PLL.add(`<g>${longString}</g>`));
    const woes = addPlates(S, PLL, c, 1);
    const FP = [0, 1, 2].map((i) => {
      const o = { ...PROPHET_F, robe: mix(PROPHET_F.robe, C.stone2, 0.3 + i * 0.1), veil2: [C.stone, C.plumRobe, C.ochre][i] };
      return { i, el: hanging(PLL, `<g transform="translate(0 -52)">${garlandTop(c)}</g>${cameo(c, S.id(`fp${i}`), o, i === 1 ? tr('fałszywi prorocy', 'false prophets') : '', { grey: true })}`, { x: 0, y: -400, len: 1400 }) };
    });

    return (t, time) => {
      const T = time;
      P.update(T);
      const tip = es(t, 4.35, 4.8, ease.out) * 8;
      const tilt = tip + Math.sin(T * 0.5) * 0.4 * (1 - tip / 8);
      bal.set(tilt);
      const [lx, ly] = beamAt(-150, tilt), [rx, ry] = beamAt(150, tilt);
      pose(plaqueL, { x: lx, y: ly, r: Math.sin(T * 0.9) * 1.5 - tilt * 0.3 });
      pose(plaqueR, { x: rx, y: ry, r: Math.sin(T * 0.8 + 1) * 1.5 - tilt * 0.3 });
      const [ex, ey] = BAL.end(-1, tilt);
      pose(lightL, { x: ex, y: ey + 170, s: 1.2, o: es(t, 4.4, 4.9) * 0.9 });

      blessed.forEach((pl) => { const [sx, sy] = BAL.slot(-1, pl.i, tilt); placePlate(pl, sx, sy, BAL.SLOT_S, 1, 1, Math.sin(T * 0.8 + pl.i) * 0.6); });
      woes.forEach((pl) => drivePlate(pl, strs[pl.i], t, T, { bx: BIG[0], by: BIG[1], ...PLAN[pl.i], slot: BAL.slot(1, pl.i, tilt) }, es, ease.back));

      FP.forEach((p) => {
        const k = es(t, 4.06 + p.i * 0.08, 4.32 + p.i * 0.08, ease.back);
        pose(p.el, { x: 700 + p.i * 100, y: lerp(-400, 380, k), r: Math.sin(T * 0.9 + p.i) * 1.2, oy: 0, o: k > 0.01 ? 1 : 0 });
      });

      const show = t < 4 ? bump(t % 1, 0.2, 0.9) : 0;
      jesus(P, t, T, show, { side: 1 });
      pose(aura, { x: PL.JX, y: PL.JY - 120, o: 0.5 });
      P.seat(T, (d) => ({ head: -8 + (d.flip ? 0 : 0) }));

      S.cam.z = kf(t, [[-0.5, 1.03], [4.0, 1.03], [4.5, 1.0]]);
      S.cam.y = kf(t, [[-0.5, -20], [4.0, -20], [4.5, -30]]);
      S.cam.x = kf(t, [[-0.5, 20], [4.0, 20], [4.5, 0]]);
    };
  },
};
function garlandTop(c) {
  let d = '';
  for (let i = 0; i < 11; i++) { const a = PI * (1.05 + i * 0.09); d += c.cut(c.ell(Math.cos(a) * 40, Math.sin(a) * 18, 6, 3, 8, a), 0.2, 2); }
  return `<path d="${d}" fill="${mix(C.leaf, C.stone2, 0.4)}"/>`;
}
