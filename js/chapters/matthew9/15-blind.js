// Mt 9,27–28a — Jesus walks on down the street with Peter and John; behind Him come two blind men, eyes shut,
// tapping with their sticks, the second with his hand on the first one's shoulder. They cry out loud: "Have mercy
// on us, Son of David!" (their cry rings out in jagged bubbles). Jesus goes into a house; they grope their way to
// the door after Him and in.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { streetSet, BLIND, stick, mob, bubble, voiceRings, kf, moving, tr, DAY } from './lib.js';
import { doorHouse } from '../john1/lib.js';

const FEET = 722;
const HX = 1040, HW = 300;         // the house: left edge, width
const DOORX = HX + HW * 0.18 + 45; // the middle of its door

export default {
  id: 'mt9-blind',
  beats: [
    { v: 27, text: 'Gdy Jezus odchodził stamtąd, szli za Nim dwaj niewidomi' },
    { v: 27, cont: true, text: 'którzy wołali głośno: «Ulituj się nad nami, Synu Dawida!»' },
    { v: 28, text: 'Gdy wszedł do domu niewidomi przystąpili do Niego,' },
  ],
  cam: { x: [-120, 220], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const set = streetSet(S, { skyCols: DAY, sunAt: [420, 140] });
    const c = S.c;

    /* the house He goes into */
    const hL = S.layer({ par: 0.5, sh: 4 });
    const H = doorHouse(c, { w: HW, h: 270, dw: 90, dh: 200 });
    hL.add(`<g transform="translate(${HX} ${FEET - 30})">${H.wall}${H.inside}</g>`);
    const leaf = hL.add(`<g>${H.leaf}</g>`);

    /* onlookers (still), the disciples, Jesus, the blind men */
    const back = S.layer({ par: 0.5, sh: 4 });
    const look = back.sprite(mob(makeCutter('mt9-blind-l'), 4, { s: 0.86, spread: 44, rows: 1, flip: true, arms: 10 }), 700, FEET - 40);
    const L = S.layer({ par: 0.5, sh: 5 });
    const peter = S.puppet(L.add(person(c, { ...CAST.peter })));
    const john = S.puppet(L.add(person(c, { ...CAST.john })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const B = BLIND.map((o, i) => ({ i, p: S.puppet(L.add(person(c, { ...o, eyes: 'closed', holdF: i === 0 ? stick(c) : '' }))), seed: c.rr(0, 9) }));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const cry = fx.add(`<g opacity="0">${bubble(c, [tr('Ulituj się nad nami,', 'Have mercy on us,'), tr('Synu Dawida!', 'son of David!')], { size: 22, jag: true, dir: -1 })}</g>`);
    const rings = voiceRings(fx, c, { n: 3, r: 30 });

    // Jesus: along the street → to the door → in
    const JK = [[-0.3, 640], [1.1, 900], [2.05, 900], [2.45, DOORX]];
    // the blind men shuffle behind, more slowly
    const BK = S.portrait ? [[0.05, 450], [1.2, 640], [2.0, 680], [2.85, DOORX - 110]] : [[0.05, 380], [1.2, 600], [2.0, 640], [2.85, DOORX - 110]];   // phone: closer behind Him
    return (t, time) => {
      const T = time;
      set.update(t, T);
      look.set({ x: 700, y: FEET - 40 });
      const jx = kf(t, JK);
      const inside = es(t, 2.4, 2.55);
      const turn = es(t, 1.1, 1.2) * (1 - es(t, 1.95, 2.05)) + es(t, 2.5, 2.6);
      const welcome = es(t, 2.7, 2.95);
      jesus.set({ x: jx, y: FEET - inside * 26, s: 1.04, flip: turn > 0.5, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 14 + turn * 30 * (1 - welcome) + welcome * 60, armB: 8 + welcome * 30, head: turn * 4, blink: blinkAt(T) });
      const px = kf(t - 0.08, JK) + 110, jnx = kf(t - 0.12, JK) + 60;
      peter.set({ x: Math.min(px, DOORX + 30), y: FEET - 12, s: 0.98, flip: turn > 0.5, walk: moving(t - 0.08, JK) ? px * 0.05 : undefined, armF: 14 + bump(t, 1.2, 1.9) * 40, o: 1 - es(t, 2.3, 2.45), blink: blinkAt(T, 2) });
      john.set({ x: Math.min(jnx, DOORX), y: FEET + 12, s: 1, flip: turn > 0.5, walk: moving(t - 0.12, JK) ? jnx * 0.05 : undefined, o: 1 - es(t, 2.45, 2.6), blink: blinkAt(T, 6) });
      pose(leaf, { x: HX + HW * 0.18, y: FEET - 28, sx: 1 - es(t, 2.2, 2.4) * 0.85 });

      /* the two blind men */
      const bx = kf(t, BK, (u) => u);
      const walking = moving(t, BK);
      const call = bump(t, 1.05, 2.0);
      B.forEach((b) => {
        const x = bx - b.i * 70;
        b.p.set({
          x, y: FEET + 10 + b.i * 6, s: 0.98, walk: walking ? x * 0.04 + b.i : undefined, amt: 0.6,
          armF: b.i === 0 ? 40 + call * 40 : 70, armB: b.i === 0 ? 30 + call * 60 : 10 + call * 100, head: -10 - call * 10, lean: 4,
          blink: 0,
        });
      });
      const ck = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(cry, { x: bx + 30, y: FEET - 220, s: ck, o: ck > 0.02 ? 1 : 0 });
      rings(bx + 26, FEET - 186, call, T, { dir: 1 });

      S.cam.x = S.portrait ? kf(t, [[0, -100], [1.0, -30], [2.0, 70], [2.8, 190]]) : kf(t, [[0, 0], [1.0, 60], [2.0, 100], [2.8, 190]]);   // phone: the blind men in view
      S.cam.z = 1.04 + es(t, 0.9, 1.3) * 0.06 - es(t, 2.0, 2.6) * 0.04;
      S.cam.y = 20;
    };
  },
};
