// Mt 14,24–27 — night, far out on the lake: the boat pitches in the waves, the wind against it, the disciples
// straining at the oars. In the fourth watch Jesus comes to them, walking on the water. They see Him — "A ghost!" —
// and cry out in fear. At once He speaks: "Take heart! It is I; do not be afraid" — hung in gold, in a warm light.
import { C, person, CAST, blinkAt, pose, lerp, hanging } from '../kit.js';
import { boat, rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, speech, GLYPH, heart, oar, labelTag, hungGold, ghost, nightLake, TW, tr, PI } from './lib.js';

const BX = 640, BY = 704;
const JY = 716;

export default {
  id: 'mt14-walking',
  beats: [
    { v: 24 },
    { v: 25 },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-40, 80], y: [-20, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const N = nightLake(S);
    const watch = hanging(N.hangL, `<g transform="scale(1.1)">${labelTag(tr('czwarta straż nocna', 'the fourth watch of the night'), 20)}</g>`, { x: 0, y: 0, len: 700 });
    const far = N.hangL.add(`<g>${labelTag(tr('daleko od brzegu', 'far from the shore'), 18)}</g>`);

    /* the boat, the oars, the disciples; Jesus on the water */
    const boatL = S.layer({ par: 0.6, sh: 5 });
    const B = boat(c, {});
    const DIS = [{ o: TW.andrew, x: -110 }, { o: TW.john, x: -50 }, { o: TW.peter, x: 20 }, { o: TW.james, x: 80 }, { o: TW.thomas, x: 140 }];
    const glow = boatL.add(`<g>${rays(c, { n: 16, r0: 30, r1: 380, spread: 0.035, color: '#fff3cf' })}<circle r="160" fill="url(#halo-glow)"/></g>`);
    const boatG = boatL.add(`<g><g>${B.back}</g><g data-k="oarB">${oar(c, 180)}</g>${DIS.map((d, i) => `<g data-k="w${i}">${person(c, d.o)}</g>`).join('')}<g>${B.front}</g><g data-k="oarF">${oar(c, 180)}</g></g>`);
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(S.$('w' + i).firstElementChild), seed: c.rr(0, 6) }));
    const oarB = S.$('oarB'), oarF = S.$('oarF');
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const ripples = [0, 1, 2].map(() => boatL.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 6, 0, PI * 2, 20), 2)}" fill="${C.foam}" opacity=".8"/>`));

    /* bubbles, the word */
    const fx = S.layer({ par: 0.62, sh: 4 });
    const ghosts = [0, 1, 2].map(() => fx.add(`<g>${speech(c, `<g transform="scale(1.2)">${ghost(c)}</g>`, { w: 54, h: 56, flip: false })}</g>`));
    const cries = [0, 1].map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 38, h: 40 })}</g>`));
    const iam = fx.add(hungGold(c, tr('Odwagi! Ja jestem', 'Cheer up! It is I!'), { size: 36 }));
    const noFear = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${heart(c, 14)}</g>`, { w: 56, h: 50, flip: true })}</g>`);
    N.front();

    const jKeys = [[1.05, 1420], [2.0, 960], [3.0, 900]];
    return (t, time) => {
      const T = time;
      const { rock, heave } = N.update(t, T, { wind: 1 - es(t, 3.3, 3.9) * 0.4, moonX: 1010 - es(t, 0.9, 1.5) * 120, moonY: 150 + es(t, 0.9, 1.5) * 90 });
      const wk = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(watch, { x: 820, y: lerp(-400, 250, wk), r: Math.sin(T * 1.2) * 2.5, o: wk > 0.01 ? 1 : 0 });
      const fk = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(far, { x: 380, y: lerp(-300, 520, fk), r: Math.sin(T) * 2, o: fk > 0.01 ? 1 : 0 });

      /* v24 — tossed by the waves, the wind against them */
      pose(boatG, { x: BX, y: BY + heave, s: 1.0, r: rock });
      const row = 1 - es(t, 2.0, 2.2);
      const stroke = Math.sin(T * 2.6) * row;
      pose(oarB, { x: -40, y: -60, r: 50 + stroke * 22 });
      pose(oarF, { x: 70, y: -54, r: 50 + stroke * 22 });
      const fear = es(t, 2.05, 2.25) * (1 - es(t, 3.2, 3.6));
      const calmed = es(t, 3.3, 3.6);
      dis.forEach((d) => {
        const shake = fear * Math.sin(T * 22 + d.i * 2) * 4;
        d.p.set({
          x: d.x, y: 4, s: 0.95, flip: false,
          armF: 40 + stroke * 30 * (1 - fear) + fear * (d.i % 2 ? 100 : 60) + calmed * 20, armB: 20 + stroke * 20 * (1 - fear) + fear * (d.i % 2 ? 60 : 150),
          lean: -stroke * 8 * (1 - fear) + shake, head: -fear * 6 + shake * 0.6 - bump(t, 1.2, 1.9) * 4, blink: blinkAt(T, d.seed),
        });
      });

      /* v25 — in the fourth watch He comes, walking on the sea */
      const jx = kf(t, jKeys, (u) => u);
      const speak = bump(t, 3.05, 3.95);
      jesus.set({ x: jx, y: JY, s: 1.0, flip: true, o: es(t, 1.05, 1.15), walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 20 + speak * 80, armB: 10 + speak * 130, head: speak * -4, blink: blinkAt(T) });
      ripples.forEach((r, i) => {
        const k = (T * 0.6 + i / 3) % 1;
        pose(r, { x: jx, y: JY + 2, s: 0.4 + k * 1.2, sy: 0.9, o: (1 - k) * es(t, 1.05, 1.15) });
      });
      const shine = Math.max(es(t, 1.2, 1.5) * 0.25, speak);
      pose(glow, { x: jx, y: JY - 130, s: 0.3 + shine * 0.8, r: T * 5, o: shine * 0.24 });

      /* v26 — "A ghost!" — and they cry out */
      ghosts.forEach((g, i) => {
        const d = dis[[1, 3, 4][i]];
        const k = es(t, 2.1 + i * 0.08, 2.3 + i * 0.08, ease.back) * (1 - es(t, 2.95, 3.05));
        const [hx, hy] = headAt(BX + d.x, BY + 4 + heave, 0.95, false);
        pose(g, { x: hx + 12, y: hy - 22, s: k, r: Math.sin(T * 3 + i) * 6, o: k > 0.01 ? 1 : 0 });
      });
      cries.forEach((cr, i) => {
        const d = dis[[0, 2][i]];
        const k = es(t, 2.35 + i * 0.1, 2.5 + i * 0.1, ease.back) * (1 - es(t, 2.95, 3.05));
        const [hx, hy] = headAt(BX + d.x, BY + 4 + heave, 0.95, false);
        pose(cr, { x: hx + 12, y: hy - 22, s: k * (1 + Math.sin(T * 12) * 0.05), o: k > 0.01 ? 1 : 0 });
      });

      /* v27 — "Cheer up! It is I! Don't be afraid." */
      const ik = es(t, 3.1, 3.4, ease.out);
      pose(iam, { x: 880, y: lerp(-500, 230, ik), r: Math.sin(T * 0.8) * 1.2, o: ik > 0.01 ? 1 : 0 });
      const nk = es(t, 3.3, 3.5, ease.back);
      const [jhx, jhy] = headAt(jx, JY, 1.0, true);
      pose(noFear, { x: jhx - 22, y: jhy - 20, s: nk, o: nk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 20], [1.0, 60], [2.0, 40], [3.0, 40]]);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.02], [2.2, 1.1], [3.0, 1.1], [3.5, 1.06]]);
      S.cam.y = kf(t, [[0, 30], [2.2, 40], [3.5, 30]]);
    };
  },
};
