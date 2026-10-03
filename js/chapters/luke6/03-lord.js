// Łk 6,5 — back in the grain field. "The Son of Man is lord of the Sabbath": Jesus lifts His hand, and the Sabbath
// tag with its two candles, that hung over the field, comes down on its string and settles above Him; its candles flare
// up, a ring of light like a crown opens round it, and rays spread behind Him. The disciples with the ears still in
// their hands look up; the Pharisees fall back a step and lower the pointing finger.
import { C, person, CAST, blinkAt, pose, lerp, hanging } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { lightCrown } from '../mark8/lib.js';
import { fieldSet, FP, kf, phOpts, scribeOpts, headAt, sabbathTag, glow, rayBurst, sparkle, tr } from './lib.js';

const JX = 800;

export default {
  id: 'lk6-lord',
  beats: [
    { v: 5 },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const F = fieldSet(S);
    const c = F.c;
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const crown = hangL.add(`<g opacity="0">${lightCrown(c, 70)}</g>`);
    const tag = hanging(hangL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: JX, y: 150, len: 900 });

    const act = S.layer({ par: 0.6, sh: 5 });
    const aura = act.add(`<g opacity="0">${glow(250, 1, 'halo-glow')}</g>`);
    const rays = act.add(`<g opacity="0">${rayBurst(c, { n: 22, r0: 50, r1: 360, spread: 0.04, color: '#fff3cf', o: 0.5 })}</g>`);
    const DIS = (S.portrait ? [{ k: 'james', x: 510 }, { k: 'peter', x: 590 }, { k: 'andrew', x: 668 }] : [{ k: 'james', x: 470 }, { k: 'peter', x: 556 }, { k: 'andrew', x: 640 }]).map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const PH = (S.portrait ? [{ x: 910, o: phOpts(0) }, { x: 970, o: scribeOpts(1) }, { x: 1028, o: phOpts(2) }] : [{ x: 990, o: phOpts(0) }, { x: 1076, o: scribeOpts(1) }, { x: 1158, o: phOpts(2) }]).map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, m.o))) }));
    const sparks = [0, 1, 2].map(() => act.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    F.front();

    return (t, time) => {
      const T = time;
      F.update(T);
      const down = es(t, 0.1, 0.5, ease.back);
      const TY = lerp(150, 262, down);
      pose(tag, { x: JX, y: TY, r: Math.sin(T * 0.9) * (1.6 - down), oy: 0 });
      const lord = es(t, 0.35, 0.65);
      pose(crown, { x: JX, y: TY + 20, s: 0.4 + lord * 0.6, o: lord });
      pose(aura, { x: JX, y: FP - 160, s: 0.7 + lord * 0.5, o: lord });
      pose(rays, { x: JX, y: FP - 170, s: 0.5 + lord * 0.6, r: T * 3, o: lord * 0.9 });

      const lift = es(t, 0.05, 0.3);
      jesus.set({ x: JX, y: FP, s: 1.06, flip: false, armF: 14 + lift * 40, armB: 10 + lift * 120, head: -4 * lift, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const up = es(t, 0.4 + d.i * 0.05, 0.6 + d.i * 0.05);
        d.p.set({ x: d.x, y: FP + (d.i % 2 ? 6 : -4), s: 0.95, flip: false, armF: 30 + up * 20, armB: 8 + up * (d.i === 1 ? 70 : 16), head: -up * 10, blink: blinkAt(T, d.seed) });
      });
      PH.forEach((m) => {
        const back = es(t, 0.45 + m.i * 0.05, 0.75);
        const point = 1 - es(t, 0.2, 0.45);
        m.p.set({ x: m.x + back * (S.portrait ? 20 : 46), y: FP + (m.i % 2 ? -6 : 4), s: 0.95, flip: true, armF: m.i === 0 ? 12 + point * 80 : 12, armB: m.i === 2 ? 26 : 8, head: 4 - back * 6, lean: -back * 5, blink: blinkAt(T, m.seed) });
      });
      sparks.forEach((sp, i) => {
        const k = es(t, 0.5 + i * 0.06, 0.66 + i * 0.06, ease.back);
        const [hx, hy] = headAt(DIS[i].x, FP, 0.95, false);
        pose(sp, { x: hx + 22, y: hy - 32, s: k * 0.9, r: T * 30, o: k > 0.01 ? bump(t, 0.5 + i * 0.06, 1.2) + 0.2 * k : 0 });
      });

      S.cam.z = kf(t, [[-0.5, 1.03], [0.2, 1.04], [0.7, 1.1]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.2, 10], [0.7, -20]]);
    };
  },
};
