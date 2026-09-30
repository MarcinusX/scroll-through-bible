// Łk 23,56 — a quiet ending. A room in the city at nightfall (Mark 16's room), a lamp hanging from the beam, the
// door shut. The women sit round a low table and prepare spices and ointments: a mortar, jar after jar set out,
// fragrance curling up. Then the Sabbath: two candles are lit on the shelf high above, a small stone tablet comes down
// — "Remember the Sabbath day" — the jars are covered and set aside, and the women sit still, hands folded, heads
// bowed, resting according to the commandment. Nothing moves; only the little flames.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lowTable } from '../mark2/lib.js';
import { upperRoom, spiceJar, scent, candle, withFace, faceBits, face, strip, hanging, swing, wordCard, MAGD, MARYJ, SALOME, ROOM, tr, PI } from './lib.js';

const FY = ROOM.floor + 40;

/** a stone mortar with its pestle (pestle in .pestle, pivot at the mortar's mouth); origin: base */
function mortar(c) {
  const s = sheet().p(c.cut([[-22, -30], [22, -30], [18, -8], [10, 0], [-10, 0], [-18, -8]], 0.4, 4), C.stone2).p(c.cut(c.ell(0, -30, 22, 5, 12), 0.2, 3), shade(C.stone2, -0.25));
  const p = sheet().p(c.ribbon([[0, 0], [8, -38]], 5), C.wood3).out();
  return `${s.out()}<g class="pestle" transform="translate(0 -30)">${p}</g>`;
}

export default {
  id: 'lk23-sabbath',
  beats: [
    { v: 56, text: 'Po powrocie przygotowały wonności i olejki;' },
    { v: 56, cont: true, text: 'lecz zgodnie z przykazaniem zachowały spoczynek szabatu.' },
  ],
  cam: { x: [-30, 30], y: [-80, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { dusk: 1, lamps: [[800, 230]] });
    pose(R.door, { x: ROOM.doorX + ROOM.doorW, y: ROOM.doorTop - 2, sx: 1 });
    const nightL = S.layer({ par: 0.45, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1b1d3d"/>`);
    const shelfL = S.layer({ par: 0.3, sh: 3 });
    /* the shelf with two Sabbath candles, high on the wall */
    const SY = S.portrait ? 470 : 170;
    const shelf = shelfL.add(sheet().p(c.cut([[690, SY], [910, SY], [910, SY + 12], [690, SY + 12]], 0.3, 6), C.wood).out());
    const cands = [760, 840].map((x, i) => { const el = shelfL.add(`<g transform="translate(${x} ${SY})">${candle(c, 44)}</g>`); return { i, flame: el.querySelector('.flame'), glow: el.querySelector('.glow') }; });
    const P = S.layer({ par: 0.5, sh: 5 });
    const W = [[MARYJ, 560, false], [MAGD, 1040, true], [SALOME, 660, false]].map(([o, x, f], i) => ({ i, x, f, p: S.puppet(P.add(withFace(person(c, { ...o, pose: 'sit' }), faceBits(c)))) }));
    const tableL = S.layer({ par: 0.52, sh: 5 });
    tableL.add(`<g transform="translate(850 ${FY + 6})">${lowTable(c, 300, 40)}</g>`);
    const fx = S.layer({ par: 0.55, sh: 5 });
    const mort = fx.add(`<g>${mortar(c)}</g>`);
    const pestle = mort.querySelector('.pestle');
    const jars = [[760, C.cream, C.clay], [820, C.linen, C.ochre], [880, mix(C.cream, C.apricot, 0.3), C.clay], [940, C.cream, C.terracotta]].map(([x, col, lid], i) => ({ i, x, el: fx.add(`<g>${spiceJar(c, col, lid)}</g>`) }));
    const scents = [0, 1, 2].map((i) => fx.add(`<g>${scent(c, 70)}</g>`));
    const cover = fx.add(`<g>${sheet().p(c.cut([[-120, 0], [-110, -46], [110, -48], [124, 0]], 0.8, 8), mix(C.linen2, C.stone, 0.3)).x(c.ribbon([[-80, -40], [-90, -2]], 2) + c.ribbon([[60, -42], [70, -2]], 2), C.stone2, 'opacity=".6"').out()}</g>`);
    const tabL = S.layer({ par: 0.3, sh: 5 });
    const tab = sheet().p(c.cut([[-92, 30], [-92, -40], ...c.arc(0, -40, 92, 50, PI, 2 * PI, 14), [92, 30]], 0.6, 6), C.stone).out();
    const tablet = hanging(tabL, `${tab}<text x="0" y="-26" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.ink}">${tr('Pamiętaj', 'Remember')}</text><text x="0" y="-2" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.ink}">${tr('o dniu szabatu', 'the Sabbath day')}</text><g transform="translate(0 56)">${strip(c, tr('szabat', 'the Sabbath'), { size: 15 })}</g>`, { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const rest = es(t, 1.1, 1.4);
      const T = time;
      const A = 1 - rest;
      nightL.fade(0.3 + rest * 0.08);
      R.lamps.forEach((l) => { pose(l.flame, { x: 35, y: -16, sy: 1 + (T ? Math.sin(T * 7) * 0.06 : 0), sx: 1 }); fade(l.glow, 0.8); });

      /* v56a — preparing spices and ointments */
      const grind = t < 1.1 ? Math.sin(t * 40) * 0.5 + 0.5 : 0;
      W.forEach((w) => {
        const work = es(t, 0.05, 0.25) * A;
        const arm = w.i === 0 ? 40 + grind * 30 * work : w.i === 1 ? 50 + bump(t, 0.3, 0.8) * 30 : 30 + bump(t, 0.2, 0.7) * 40;
        w.p.set({ x: w.x, y: FY, s: 1.02, flip: w.f, armF: lerp(arm, 44, rest), armB: lerp(10 + work * 20, 34, rest), head: lerp(8, 16, rest), lean: lerp(6 * work, 3, rest), blink: blinkAt(T, 3 + w.i) });
        face(w.p.el, 'sad', 0.6);
      });
      pose(mort, { x: 700, y: FY - 34 });
      pose(pestle, { x: 0, y: -30, r: -10 + grind * 20 * (1 - rest) });
      jars.forEach((j) => { const k = es(t, 0.15 + j.i * 0.12, 0.3 + j.i * 0.12, ease.back); pose(j.el, { x: j.x, y: FY - 34, s: k, o: k > 0.02 ? 1 : 0 }); });
      scents.forEach((s, i) => { const k = T ? ((T * 0.3 + i / 3) % 1) : 0.5; pose(s, { x: [780, 860, 940][i] + Math.sin(k * 5 + i) * 6, y: FY - 80 - k * 40, s: 0.6 + k * 0.4, o: Math.sin(k * PI) * 0.8 * es(t, 0.3, 0.6) * (1 - es(t, 1.05, 1.3)) }); });

      /* v56b — the Sabbath rest */
      const ck = es(t, 1.08, 1.3);
      pose(cover, { x: 850, y: FY - 34, sy: ck, oy: 0, o: ck > 0.02 ? 1 : 0 });
      cands.forEach((cd) => { const k = es(t, 1.1 + cd.i * 0.1, 1.2 + cd.i * 0.1); pose(cd.flame, { x: 0, y: -64, s: k * (1 + (T ? Math.sin(T * 8 + cd.i) * 0.05 : 0)), o: k > 0.02 ? 1 : 0 }); fade(cd.glow, k * 0.85); });
      const tk = es(t, 1.15, 1.45, ease.out);
      swing(tablet, S.portrait ? 800 : 1110, 280 - (1 - tk) * 900, T * A, 0.6, 0.6, 1);

      S.cam.y = -es(t, 1.0, 1.5) * 70;
      S.cam.z = 1.04 - es(t, 1.0, 1.5) * 0.03;
    };
  },
};
