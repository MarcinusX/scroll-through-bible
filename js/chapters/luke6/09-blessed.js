// Łk 6,20–23 — the Sermon on the Plain. Jesus stands on the level place, the Twelve sitting at His feet, the crowd
// behind; He lifts His eyes to His disciples. Over the plain a great balance comes down from the flies: its left arm
// will carry the four blessings, its right arm the four woes, mirrored like the two pans of a pair of scales. For each
// blessing a painted plate comes down, first showing "now" — and then it turns round on its string to show "then":
// the beggar by the wall stands crowned in the open gate of the Kingdom; the empty bowl becomes a full table; the woman
// weeping in the rain laughs in the sun among flowers; the man thrown out of the door under dark words leaps for joy
// under the star of his reward (and the Twelve throw up their hands). Each plate then shrinks into its place under the
// left arm of the balance. "So their fathers did to the prophets": three old sepia portraits of the prophets come down.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { plainSet, PL, BAL, addBalance, addPlates, drivePlate, longString, beamPlaque, beamAt, prophetCameo, ISAIAH, JEREMIAH, L9, kf, headAt, sparkle, halo, darkWordsCloud, tr, PI } from './lib.js';

/* the big spot where a blessing plate is shown before it takes its place */
const BIG = [624, 404];
const PLAN = [
  { drop: [0.12, 0.38], flip: [0.5, 0.62], shrink: [0.9, 1.1] },
  { drop: [1.06, 1.3], flip: [1.46, 1.58], shrink: [1.9, 2.1] },
  { drop: [2.06, 2.3], flip: [2.46, 2.58], shrink: [2.9, 3.1] },
  { drop: [3.06, 3.3], flip: [4.14, 4.28], shrink: [4.9, 5.1] },
];

export default {
  id: 'lk6-blessed',
  beats: [
    { v: 20 },
    { v: 21, text: 'Błogosławieni wy, którzy teraz głodujecie, albowiem będziecie nasyceni.' },
    { v: 21, cont: true, text: 'Błogosławieni wy, którzy teraz płaczecie, albowiem śmiać się będziecie.' },
    { v: 22 },
    { v: 23, text: 'cieszcie się i radujcie w owym dniu, bo wielka jest wasza nagroda w niebie.' },
    { v: 23, cont: true, text: 'Tak samo bowiem przodkowie ich czynili prorokom.' },
  ],
  cam: { x: [-40, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const P = plainSet(S);
    const c = S.c;
    // phone: a shorter beam with the plates closer together, so both arms stay inside the screen
    const ARM = S.portrait ? 196 : BAL.ARM, SPREAD = S.portrait ? 50 : 56;
    const aura = P.aura;
    const joy = P.dis.map(() => P.fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    /* the balance and the plates */
    const BL = S.layer({ par: 0.12, sh: 6, rise: 0 });
    const bal = addBalance(BL, c, { arm: ARM });
    const plaque = BL.add(`<g>${beamPlaque(c, tr('Błogosławieni', 'Blessed'), { size: 19, drop: 30 })}</g>`);
    const PLL = S.layer({ par: 0.14, sh: 6, rise: 0 });
    const strs = [0, 1, 2, 3].map(() => PLL.add(`<g>${longString}</g>`));
    const plates = addPlates(S, PLL, c, 0);
    /* the prophets who were treated the same */
    const PR = [[ISAIAH, tr('Izajasz', 'Isaiah')], [JEREMIAH, tr('Jeremiasz', 'Jeremiah')], [L9.elijah, tr('Eliasz', 'Elijah')]].map(([o, name], i) => ({ i, el: hanging(PLL, prophetCameo(c, S.id(`pr${i}`), o, name), { x: 0, y: -400, len: 1400 }) }));
    const stones = PR.map(() => PLL.add(`<g opacity="0">${darkWordsCloud(c)}</g>`));

    return (t, time) => {
      const T = time;
      P.update(T);
      const lower = es(t, -0.6, 0.1, ease.out);
      const tilt = Math.sin(T * 0.5) * 0.4;
      bal.set(tilt, { y: lerp(-300, BAL.Y, lower) });
      const [px, py] = beamAt(-150, tilt, lerp(-300, BAL.Y, lower));
      pose(plaque, { x: px, y: py, r: Math.sin(T * 0.9) * 1.5 });

      plates.forEach((pl) => drivePlate(pl, strs[pl.i], t, T, { bx: S.portrait ? 650 : BIG[0], by: BIG[1], ...PLAN[pl.i], slot: BAL.slot(-1, pl.i, tilt, ARM, SPREAD) }, es, ease.back));

      /* the prophets */
      PR.forEach((p) => {
        const k = es(t, 5.08 + p.i * 0.08, 5.34 + p.i * 0.08, ease.back);
        const x = S.portrait ? 764 + p.i * 76 : 700 + p.i * 100;   // phone: closer in, clear of the blessings' plates on the left arm
        pose(p.el, { x, y: lerp(-400, 360, k), s: S.portrait ? 0.84 : 1, r: Math.sin(T * 0.9 + p.i) * 1.2, oy: 0, o: k > 0.01 ? 1 : 0 });
        const sk = bump(t, 5.3 + p.i * 0.08, 5.95);
        pose(stones[p.i], { x: x + 30, y: 330, s: 0.8, r: Math.sin(T * 2 + p.i) * 6, o: sk * 0.9 });
      });

      /* Jesus lifts His eyes to His disciples and speaks; He shows each plate */
      const cur = Math.min(3, Math.max(0, Math.floor(t)));
      const show = t < 5 ? bump(t % 1, 0.2, 0.9) : 0;
      jesus(P, t, T, show);
      pose(aura, { x: PL.JX, y: PL.JY - 120, o: 0.5 });

      /* the Twelve: they look up; at "rejoice" they throw up their hands */
      const leap = es(t, 4.1, 4.3) * (1 - es(t, 5.0, 5.3) * 0.7);
      P.seat(T, (d) => ({ armF: 20 + leap * 60, armB: 10 + leap * 140, head: -4 - es(t, -0.2, 0.3) * 8 - leap * 6, y: d.y - leap * (d.i % 2 ? 6 : 12) }));
      P.dis.forEach((d, i) => {
        const k = bump(t, 4.12 + i * 0.04, 4.8 + i * 0.04);
        const [hx, hy] = headAt(d.x, d.y, 0.9, d.flip, 'sit');
        pose(joy[i], { x: hx, y: hy - 40, s: k, r: T * 40, o: k });
      });

      S.cam.z = kf(t, [[-0.5, 1.0], [0.2, 1.03], [5.0, 1.03], [5.4, 1.05]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.2, -20], [5.0, -20], [5.4, -10]]);
      S.cam.x = kf(t, [[-0.5, 0], [0.2, -20], [5.0, -20], [5.4, 0]]);
    };
  },
};

/** Jesus: eyes lifted to the disciples, then a hand towards the plate being shown */
export function jesus(P, t, T, show, { side = -1 } = {}) {
  const look = es(t, -0.2, 0.2);
  P.jesus.set({ x: PL.JX, y: PL.JY, s: PL.JS, flip: side < 0, armF: 18 + show * 60, armB: 10 + show * 20, head: 6 * look * (1 - show) - show * 8, blink: blinkAt(T) });
}
