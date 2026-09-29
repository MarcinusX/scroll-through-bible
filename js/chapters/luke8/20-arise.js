// Łk 8,54–56 — the quiet room: the girl on her bed, her father and mother and Peter, James and John by the door.
// Jesus kneels at the bedside, takes her by the hand and calls: "Child, arise!" A small light comes in at the window
// and settles on her — her spirit returns — and at once she sits up and stands. "Give her something to eat": her
// mother brings bread and a bowl, and the girl eats. Her parents stand amazed. And He tells them to tell no one: a
// slip of news is sealed with two strips of tape, high over the room.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roomSet, girlOnBed, blanketOnBed, RM, RULER, L5, bubble, loaf, headAt, hand, heart, sparkle, glyphTag, newsSlip, tapeCross, kf, tr, PI } from './lib.js';

const FEET = RM.FLOOR + 20;

export default {
  id: 'lk8-arise',
  beats: [
    { v: 54 },
    { v: 55, text: 'Duch jej powrócił, i zaraz wstała.' },
    { v: 55, cont: true, text: 'Polecił też, aby jej dano jeść.' },
    { v: 56, text: 'Rodzice jej osłupieli ze zdumienia,' },
    { v: 56, cont: true, text: 'lecz On przykazał im, żeby nikomu nie mówili o tym, co się stało.' },
  ],
  cam: { x: [-40, 160], y: [-60, 40], z: [0.96, 1.2] },
  build(S) {
    const set = roomSet(S);
    const c = S.c;
    const light = set.room.add(`<g opacity="0"><circle r="150" fill="url(#halo-glow)"/></g>`);
    const girlLying = set.bedL.add(`<g>${girlOnBed(c, L5.girl)}</g>`);
    const girlSit = S.puppet(set.bedL.add(person(c, { ...L5.girl, pose: 'sit' })));
    set.bedL.add(`<g>${blanketOnBed(c)}</g>`);

    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [['john', 560], ['james', 620], ['peter', 680]].map(([k, x], i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...CAST[k] }))) }));
    const father = S.puppet(L.add(person(c, RULER)));
    const mother = S.puppet(L.add(person(c, { ...L5.mother, holdF: `<g transform="translate(0 2)">${sheet().p(c.cut([[-12, 0], [12, 0], [8, 10], [-8, 10]], 0.3, 3), C.pot).p(c.cut(c.ell(0, 0, 11, 3, 8), 0.2, 2), C.wheat2).out()}</g>` })));
    const girlUp = S.puppet(L.add(person(c, { ...L5.girl, holdF: `<g class="bread" opacity="0" transform="translate(0 -2)">${loaf(c, 8)}</g>` })));
    const bread = girlUp.el.querySelector('.bread');
    const jK = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jUp = S.puppet(L.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const call = fx.add(`<g opacity="0">${bubble(c, tr('Dziewczynko, wstań!', 'Child, arise!'), { size: 26, dir: -1, fill: C.halo })}</g>`);
    const spirit = fx.add(`<g opacity="0"><circle r="34" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 11, 4, 4, 0))}" fill="${C.star}"/></g>`);
    const eat = fx.add(`<g opacity="0">${bubble(c, tr('Dajcie jej jeść', 'Give her something to eat'), { size: 19, dir: -1 })}</g>`);
    const wow = [0, 1].map(() => fx.add(`<g opacity="0">${bubble(c, '!', { size: 30, w: 58, dir: 1, fill: C.halo })}</g>`));
    const tapes = [0, 1].map(() => fx.add(`<g opacity="0">${tapeCross(c, 62, 48, 11)}</g>`));
    const hearts = [0, 1].map(() => fx.add(`<g opacity="0">${heart(c, 12)}</g>`));
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      /* v54 — He takes her by the hand: "Child, arise!" */
      const take = es(t, 0.1, 0.4);
      const rise = es(t, 1.2, 1.26), stand = es(t, 1.55, 1.61);
      const up = es(t, 1.55, 1.6);
      jK.set({ x: 960, y: FEET, s: 1.04, o: 1 - up, armF: 30 + take * 50 + rise * 16, armB: 20, head: 8 - take * 6 - rise * 10, blink: blinkAt(T) });
      const hushK = es(t, 4.1, 4.35);
      jUp.set({ x: 930, y: FEET, s: 1.04, o: up, flip: t > 2.9, armF: 40 + bump(t, 2.05, 2.8) * 40 + hushK * 60, armB: 20 + hushK * 100, head: -4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(960, FEET, 1.04, false, 46);
      const cb = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.02));
      pose(call, { x: jhx + 10, y: jhy - 40, s: cb, o: cb > 0.02 ? 1 : 0 });
      /* v55a — her spirit returns and she gets up at once */
      const sk = seg(t, 1.02, 1.22);
      pose(spirit, { x: lerp(RM.WIN, 1080, sk), y: lerp(360, RM.FLOOR - 70, sk) - Math.sin(sk * PI) * 30, s: 1 - sk * 0.3, o: sk > 0 && sk < 1 ? 1 : 0 });
      pose(light, { x: 1060, y: RM.FLOOR - 100, s: 0.6 + es(t, 1.15, 1.5) * 0.6, o: es(t, 1.15, 1.45) * 0.8 });
      pose(set.winLight, { o: es(t, 1.0, 1.4) });
      pose(girlLying, { o: 1 - rise });
      girlSit.set({ x: 1060, y: RM.FLOOR - 50, s: 0.78, flip: true, o: rise * (1 - stand), armF: 80, armB: 20, head: -6, blink: blinkAt(T, 2) });
      const eatK = es(t, 2.45, 2.7);
      girlUp.set({ x: 1040, y: FEET + 6, s: 0.8, flip: true, o: stand, armF: 40 + eatK * 70, armB: 30 + bump(t, 3.1, 3.9) * 60, head: -6 + eatK * 6, blink: blinkAt(T, 2) });
      fade(bread, es(t, 2.5, 2.6));
      sparks.forEach((s, i) => { const k = bump(t, 1.25 + i * 0.05, 1.9); pose(s, { x: 980 + i * 34, y: RM.FLOOR - 230 - (i % 2) * 24, s: k, r: T * 40, o: k }); });
      /* v55b — He says to give her something to eat */
      const eb = es(t, 2.05, 2.2, ease.back) * (1 - es(t, 2.9, 3.0));
      const [uhx, uhy] = headAt(930, FEET, 1.04, false);
      pose(eat, { x: uhx + 16, y: uhy - 36, s: eb, o: eb > 0.02 ? 1 : 0 });
      const MK = [[0, 470], [2.1, 470], [2.45, 1130]];
      const mx = kf(t, MK);
      const amaze = es(t, 3.05, 3.3) * (1 - es(t, 4.1, 4.3) * 0.6);
      mother.set({ x: mx, y: FEET - 4, s: 0.96, flip: t > 2.4, walk: t > 2.1 && t < 2.45 ? mx * 0.06 : undefined, armF: 30 + es(t, 2.1, 2.3) * 30 * (1 - amaze) + amaze * 120, armB: 20 + amaze * 130, head: 8 - amaze * 16, blink: blinkAt(T, 7) });
      const hold = mother.el.querySelector('.hold');
      if (hold) fade(hold, 1 - es(t, 2.5, 2.6));
      /* v56a — her parents are amazed */
      const FK = [[0, 420], [3.0, 420], [3.3, 560]];
      const fx_ = kf(t, FK);
      father.set({ x: fx_, y: FEET - 6, s: 1.0, walk: t > 3.0 && t < 3.3 ? fx_ * 0.06 : undefined, armF: 20 + amaze * 110, armB: 10 + amaze * 140, head: -amaze * 12, blink: blinkAt(T, 3) });
      const WP = [[mx + 6, 330], [fx_ + 16, 340]];
      wow.forEach((w, i) => { const k = es(t, 3.15 + i * 0.08, 3.3 + i * 0.08, ease.back); pose(w, { x: WP[i][0], y: WP[i][1], s: k, o: k > 0.02 ? 1 : 0 }); });
      tapes.forEach((tp, i) => { const k = es(t, 4.2 + i * 0.08, 4.38 + i * 0.08, ease.back); pose(tp, { x: WP[i][0] - 11, y: WP[i][1] - 54, s: k, r: -8 + i * 12, o: k > 0.02 ? 1 : 0 }); });
      hearts.forEach((h, i) => { const k = es(t, 3.2 + i * 0.1, 3.4 + i * 0.1, ease.back) * (1 - es(t, 4.1, 4.3)); pose(h, { x: [1000, 1080][i], y: 430 - k * 10, s: k * 0.9, o: k > 0.02 ? 1 : 0 }); });
      DIS.forEach((d) => d.p.set({ x: d.x - es(t, 2.9, 3.3) * 60, y: FEET - 10 + (d.i % 2) * 8, s: 0.94, armF: 14 + amaze * (d.i === 1 ? 60 : 30), armB: 8 + amaze * (d.i === 1 ? 90 : 40), head: -amaze * 6, blink: blinkAt(T, d.seed) }));
      /* v56b — but He tells them to tell no one */

      S.cam.x = kf(t, [[0, 120], [1.9, 120], [2.3, 40], [3.9, 40], [4.3, 0]]);
      S.cam.z = 1.1 + es(t, 0.0, 0.5) * 0.04 - es(t, 2.0, 2.4) * 0.08 - es(t, 3.9, 4.3) * 0.04;
      S.cam.y = 20;
    };
  },
};
