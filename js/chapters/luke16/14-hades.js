// Łk 16,23–24 — the world beyond death. Low on the right the dim, parched land of Hades: cracked rust-brown ground,
// low paper flames licking along it, an ember glow; high on the left, far off across a chasm, the green height in
// light, with its spring and pool. "In Hades, being in torment, he lifted up his eyes and saw Abraham far off and
// Lazarus at his side": the rich man, stripped of his purple, lies on the hot ground with his arm over his face; he
// lifts his head — and the view opens up the height: Abraham sitting in the light, and Lazarus, in white, resting
// against his breast. "He called out: Father Abraham, have mercy on me, and send Lazarus to dip the tip of his finger
// in water and cool my tongue, for I am in anguish in this flame": he gets to his knees and stretches out both arms
// across the chasm, and his cry hangs over him, with a fingertip and a drop of water; on the height the spring shines.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { afterSet, AF, RICH_DEAD, LAZ_BLEST, ABRAHAM, say, fingerDrop, sparkle, lying, headAt, kf, tr, es, ease, bump, seg, PI } from './lib.js';

const HY = AF.HY, TOP = AF.TOP;

export default {
  id: 'lk16-hades',
  parable: true,
  beats: [
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-40, 120], y: [-60, 60], z: [1, 1.16] },
  build(S) {
    const A = afterSet(S);
    const c = A.c;
    /* Abraham, and Lazarus at his breast */
    const abr = S.puppet(A.abr.add(person(c, { ...ABRAHAM, pose: 'sit' })));
    const laz = S.puppet(A.abr.add(person(c, { ...LAZ_BLEST, pose: 'sit' })));
    const spring = A.abr.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
    /* the rich man: lying, then kneeling */
    const lie = A.act.add(`<g><g transform="translate(-10 -2)">${lying(person(c, { ...RICH_DEAD, eyes: 'closed' }), 0.92)}</g></g>`);
    const kneel = S.puppet(A.act.add(person(c, { ...RICH_DEAD, pose: 'kneel' })));
    const cry = A.W.add(`<g opacity="0">${say(c, [tr('Ojcze Abrahamie,', 'Father Abraham,'), tr('ulituj się nade mną!', 'have mercy on me!')], { size: 19, side: -1 })}</g>`);
    const drop = A.W.add(`<g opacity="0"><circle r="34" fill="${C.cream}" opacity=".92"/>${fingerDrop(c)}</g>`);

    return (t, time) => {
      const T = time;
      A.update(t, T, { fl: 1, heatX: AF.RX + 20 });
      const RX = AF.RX + 30;
      /* v23 — he lifts his eyes and sees them far off */
      const lift = es(t, 0.15, 0.35);
      const kn = seg(t, 1.05, 1.1);
      pose(lie, { x: RX + 90, y: HY + 4, r: -lift * 14, o: 1 - kn, ox: 0 });
      const reach = es(t, 1.1, 1.3);
      kneel.set({ x: RX, y: HY + 2, s: 1.0, flip: true, o: kn, armF: 90 + reach * 40, armB: 110 + reach * 40, head: -14, blink: blinkAt(T, 2) });
      abr.set({ x: AF.AX, y: A.hfn(AF.AX) + 4, s: 0.9, armF: 60, armB: 40, head: 4, blink: blinkAt(T, 1) });
      laz.set({ x: AF.AX + 52, y: A.hfn(AF.AX + 52) + 8, s: 0.8, armF: 20, armB: 10, head: -4, lean: -8, blink: blinkAt(T, 3) });
      /* v24 — the cry; the fingertip and the water */
      const [hx, hy] = headAt(RX, HY + 2, 1.0, true, 'kneel');
      const ck = es(t, 1.2, 1.35, ease.back);
      pose(cry, { x: hx - 20, y: hy - 30, s: ck, o: ck > 0.01 ? 1 : 0 });
      const dk = es(t, 1.4, 1.55, ease.back);
      pose(drop, { x: hx - 60, y: hy - 150, s: dk, o: dk > 0.01 ? 1 : 0 });
      const sk = bump(t, 1.4, 1.95);
      pose(spring, { x: AF.POOL - 50, y: TOP - 10, s: sk, r: T * 30, o: sk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 120], [0.3, 120], [0.8, 0], [1.2, 30]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.3, 60], [0.8, 30], [1.2, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.16], [0.3, 1.16], [0.8, 1.0], [1.2, 1.02]]);
    };
  },
};
