// Łk 14,10 — the same wedding hall. A plain guest in a sage robe comes in through the door, looks round at the long
// table and goes straight to the straw mat by the door, the last place, and sits down there. The host comes down the
// whole hall to him, opens his arms — "Friend, move up higher!" — takes him by the hand and leads him up past every
// seat to the gold couch of the first place. And there, before all who sit at table, the guests raise their cups to him
// and a wreath of flowers is set on his head.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { weddingHall, weddingTable, WH, HUMBLE, HOST, bubble, sparkle, wreath, headAt, hand, kf, moving, popAt, makeCutter, tr } from './lib.js';
import { whFirst, whLast } from './lib.js';

export default {
  id: 'lk14-higher',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 10, text: 'Lecz gdy będziesz zaproszony, idź i usiądź na ostatnim miejscu.' },
    { v: 10, cont: true, text: 'Wtedy przyjdzie gospodarz i powie ci: "Przyjacielu, przesiądź się wyżej!";' },
    { v: 10, cont: true, text: 'i spotka cię zaszczyt wobec wszystkich współbiesiadników.' },
  ],
  cam: { x: [-140, 180], y: [0, 120], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const H = weddingHall(S);
    const tMid = H.seatL.sprite(weddingTable(makeCutter('lk14-wt'), 'mid'), 780, WH.SEAT);
    const tLeft = H.seatL.sprite(weddingTable(makeCutter('lk14-wt'), 'left'), 780, WH.SEAT);
    const tToast = H.seatL.sprite(weddingTable(makeCutter('lk14-wt'), 'toast'), 780, WH.SEAT);
    const glow = H.placeL.add(`<g opacity="0"><ellipse rx="110" ry="130" fill="url(#warm-glow)"/></g>`);
    const hWalk = S.puppet(H.frontL.add(person(c, HUMBLE)));
    const hLow = S.puppet(H.frontL.add(person(c, { ...HUMBLE, pose: 'sit' })));
    const hUp = S.puppet(H.frontL.add(person(c, { ...HUMBLE, pose: 'sit' })));
    const host = S.puppet(H.frontL.add(person(c, HOST)));
    const wr = H.fx.add(`<g opacity="0">${wreath(c)}</g>`);
    const say = H.fx.add(`<g opacity="0">${bubble(c, [tr('Przyjacielu,', 'Friend,'), tr('przesiądź się wyżej!', 'move up higher.')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => H.fx.add(`<g opacity="0">${sparkle(c, 10 + (i % 3) * 3)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(t, T);
      const [FX, FY] = whFirst(S), [LX, LY] = whLast(S);
      /* v10a — he goes and sits in the last place */
      const K1 = [[0.04, 300], [0.2, 360], [0.34, 360], [0.48, LX - 6]];
      const x1 = kf(t, K1);
      const sit1 = es(t, 0.5, 0.54);
      /* v10b — the host comes: "Friend, move up higher!"; he rises; v10c — up to the first place */
      const rise = es(t, 1.84, 1.88);
      const K2 = [[1.88, LX + 6], [2.42, FX - 40]];
      const x2 = kf(t, K2);
      const sit2 = es(t, 2.44, 2.48);
      hWalk.set({ x: t < 1.8 ? x1 : x2, y: WH.FL, s: 1.0, o: t < 1.8 ? seg(t, 0.02, 0.08) * (1 - sit1) : rise * (1 - sit2), walk: t < 1.8 ? (moving(t, K1) ? x1 * 0.05 : undefined) : (moving(t, K2) ? x2 * 0.05 : undefined), amt: 0.7, armF: t < 1.8 ? 10 : 40, armB: 6, head: t < 0.4 ? -6 + bump(t, 0.2, 0.34) * 8 : 8, blink: blinkAt(T, 3) });
      const look = es(t, 1.4, 1.55);
      hLow.set({ x: LX, y: LY, s: 1.0, o: sit1 * (1 - rise), armF: 20 + look * 20, armB: 10 + look * 40, head: 10 - look * 16, blink: blinkAt(T, 3) });
      const honour = es(t, 2.5, 2.7);
      hUp.set({ x: FX, y: FY, s: 1.0, flip: true, o: sit2, armF: 30 + honour * 40, armB: 10 + honour * 30, head: 6 - honour * 4, blink: blinkAt(T, 3) });
      const HK = [[1.02, 1290], [1.42, LX + 90], [1.88, LX + 90], [2.4, FX + (S.portrait ? 50 : 70)]];
      const hx = kf(t, HK);
      const arms = es(t, 1.44, 1.56) * (1 - es(t, 1.82, 1.9));
      const lead = t > 1.86 && t < 2.44 ? 1 : 0;
      host.set({ x: hx, y: WH.FL, s: 1.02, flip: t < 2.4, walk: moving(t, HK) ? hx * 0.05 : undefined, armF: 20 + arms * 70 + lead * 50, armB: 10 + arms * 110, head: 6 - arms * 6, blink: blinkAt(T, 6) });
      const [hhx, hhy] = headAt(hx, WH.FL, 1.02, true);
      popAt(say, t, 1.46, 2.02, hhx + 6, hhy - 34, { d: 0.12 });
      /* the honour before all the guests: cups raised, a wreath, sparkles */
      const toast = es(t, 2.52, 2.58);
      const left = es(t, 1.9, 1.96) * (1 - toast);
      tMid.set({ o: 1 - Math.max(left, toast) });
      tLeft.set({ o: left });
      tToast.set({ o: toast });
      const [uhx, uhy] = headAt(FX, FY, 1.0, true, 62);
      const wk = es(t, 2.56, 2.74, ease.out);
      pose(wr, { x: uhx, y: lerp(uhy - 140, uhy, wk), r: 0, sx: -1, sy: 1, o: wk > 0.01 ? 1 : 0 });
      pose(glow, { x: FX, y: FY - 80, o: honour * 0.9 });
      sparks.forEach((e, i) => {
        const a = -Math.PI / 2 + (i - 2) * 0.55, u = seg(t, 2.6 + i * 0.03, 2.95 + i * 0.03);
        pose(e, { x: uhx + Math.cos(a) * (40 + u * 50), y: uhy + Math.sin(a) * (40 + u * 50), s: Math.sin(u * Math.PI), r: u * 90, o: u > 0 && u < 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -40], [0.5, -60], [1.0, -20], [1.4, -40], [1.9, -30], [2.4, 50]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.4, 80]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.4, 1.1], [1.0, 1.04], [1.4, 1.1], [2.4, 1.08]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -140], [1.0, -60], [1.4, -120], [1.9, -100], [2.4, 180]]); S.cam.z = 1.0; }
      void hand; void bump;
    };
  },
};
