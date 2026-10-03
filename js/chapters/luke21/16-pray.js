// Łk 21,36 — "Therefore be watchful all the time, praying": evening falls over the Temple court, the stars come out and
// the moon rises over the Mount of Olives; the people kneel, each with a small lamp held out in the dark, Peter and John
// on their knees beside Jesus — "that you may be counted worthy to escape all these things that will happen, and to
// stand before the Son of Man": then they all rise and stand, lamps lifted, facing Him in the middle of the court.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, altGroups, swapGroups, handAt, headAt, warm, NIGHT,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const PRAY = { pose: 'kneel', arms: [60, 80], armB: [0, 20], head: [-8, -4] };
const HOLD = { arms: [55, 75], armB: [0, 20], head: [-12, -6] };

/** a small clay lamp held out in the front hand (holdF), lit */
function lampHeld(c) {
  return `<g transform="translate(6 -2)">${warm(12, 0.85)}<path d="M-7 3L7 3L5 -1L-5 -1Z" fill="${C.pot}"/><path d="M2 -1C-1 -4 -1 -8 2 -12C5 -8 5 -4 2 -1Z" fill="${C.lampFlame}"/></g>`;
}
function flameM(c) {
  return `<g>${warm(14, 0.9)}<path d="M-6 3L6 3L4 -1L-4 -1Z" fill="${C.pot}"/><path d="M2 -1C-1 -4 -1 -8 2 -12C5 -8 5 -4 2 -1Z" fill="${C.lampFlame}"/></g>`;
}

export default {
  id: 'lk21-pray',
  beats: [
    { v: 36 },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const T0 = templeTeach(S, { sky2: NIGHT, flats: false });
    const c = S.c;
    // the lamps are cut into the knots themselves (one still sprite per posture)
    const pray = altGroups(T0, 'kneel', PRAY, lampHeld(c));
    const hold = altGroups(T0, 'look', HOLD, lampHeld(c));
    const peterK = S.puppet(T0.act.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const johnK = S.puppet(T0.act.add(person(c, { ...CAST.john, pose: 'kneel' })));
    const pl = [T0.fx.add(flameM(c)), T0.fx.add(flameM(c))];

    return (t, time) => {
      const T = time;
      const night = es(t, 0.02, 0.3);
      T0.update(t, T, { sunDY: night * 300, sunO: 1 - night, dis: false, crowd: false });
      T0.sk2.layer.fade(night);
      T0.starL.fade(night * 0.9);
      T0.dimL.fade(night * 0.9);
      pose(T0.moonEl, { x: S.portrait ? 1050 : 1150, y: lerp(560, 150, es(t, 0.1, 0.45)), r: T ? Math.sin(T * 0.6) : 0, o: es(t, 0.1, 0.2) });

      /* kneel and pray (0.15–0.6), then rise and stand before Him (0.6–0.75) */
      const kneel = es(t, 0.14, 0.2);
      const rise = es(t, 0.6, 0.66);
      T0.groups.forEach((g, i) => {
        g.sp.set({ x: g.x, y: g.y, o: 1 - kneel });
        pray[i].sp.set({ x: g.x, y: g.y, o: kneel * (1 - rise) });
        hold[i].sp.set({ x: g.x, y: g.y, o: rise });
      });
      const lit = es(t, 0.16, 0.22);
      // Peter and John: kneel with their lamps, then stand
      const pk = kneel * (1 - rise);
      T0.peter.set({ x: TT.PX, y: GY + 10, s: 0.98, flip: false, armF: rise * 60, head: -rise * 10, o: 1 - pk, blink: blinkAt(T, 3) });
      T0.john.set({ x: TT.JOX, y: GY + 10, s: 0.98, flip: true, armF: rise * 60, head: -rise * 10, o: 1 - pk, blink: blinkAt(T, 5) });
      peterK.set({ x: TT.PX, y: GY + 10, s: 0.98, flip: false, armF: 70, head: -6, o: pk, blink: blinkAt(T, 3) });
      johnK.set({ x: TT.JOX, y: GY + 10, s: 0.98, flip: true, armF: 70, head: -6, o: pk, blink: blinkAt(T, 5) });
      [[TT.PX, false], [TT.JOX, true]].forEach(([x, flip], i) => {
        const [ax, ay] = handAt(x, GY + 10, 0.98, flip, 70, 'kneel');
        const [bx, by] = handAt(x, GY + 10, 0.98, flip, 60);
        const [px, py] = rise < 0.5 ? [ax, ay] : [bx, by];
        pose(pl[i], { x: px, y: py - 2, o: lit * (rise > 0 && rise < 1 ? 0 : 1) });
      });

      /* Jesus: speaks; opens His arms to them as they stand */
      const open = es(t, 0.62, 0.75);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + bump(t, 0.02, 0.5) * 50 + open * 60, armB: 10 + bump(t, 0.02, 0.5) * 60 + open * 110, head: -open * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, 0.7 * bump(t, 0.02, 0.6), T, { spread: 1.8 });

      S.cam.z = 1 + es(t, 0.1, 0.7) * 0.06;
      S.cam.y = es(t, 0.1, 0.7) * 20;
      void seg; void fade; void shade; void tr; void PI; void swapGroups;
    };
  },
};
