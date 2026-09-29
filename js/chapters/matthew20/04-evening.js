// Mt 20,8–9 — evening: the sky turns rose and the sun sinks behind the far hills; the hour slip says "evening".
// The labourers straighten up among the vines. Outside the gate the steward has set up his little pay table with the
// money bag and the ledger, and the householder turns to him: "Call the labourers and pay them their wages, beginning
// from the last to the first." The steward calls; they come out of the gate and stand in line — the last hired at the
// front, the first at the far end. Those of the eleventh hour step up one by one and each is given a whole silver
// denarius; they hold it up, astonished.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineWorld, VW, SLOTS, SKY, OWNER, STEWARD, QUEUE, PAY, qSpot, crew, worker, workPose, payTable, silver, sparkle, face, handAt, PAID, voiceRings, kf, moving, kfXY, movingXY, say, tr, bush, rock } from './lib.js';

export default {
  id: 'mt20-evening',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 8, text: 'A gdy nadszedł wieczór, rzekł właściciel winnicy do swego rządcy:' },
    { v: 8, cont: true, text: '"Zwołaj robotników i wypłać im należność, począwszy od ostatnich aż do pierwszych!"' },
    { v: 9 },
  ],
  cam: { x: [-140, 120], y: [0, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const W = vineWorld(S, { sky: SKY.late, sky2: SKY.evening, tags: ['eve'] });

    /* inside the wall: everyone at work until they are called out */
    const P = S.layer({ par: 0.5, sh: 5 });
    const inside = crew(S, P, c, ['first', 'third', 'midday', 'last']);
    W.front({ fg: false });

    /* outside, in front of the wall: the pay table, the steward, the householder, the line */
    const Q = S.layer({ par: 0.6, sh: 5 });
    const owner = S.puppet(Q.add(person(c, OWNER)));
    const stew = S.puppet(Q.add(person(c, STEWARD)));
    Q.add(`<g transform="translate(${PAY.TABLE} ${PAY.QY + 8})">${payTable(c)}</g>`);
    // added back to front, so each one stands in front of the man behind him
    const line = QUEUE.map((m, k) => ({ ...m, k })).reverse().map((m) => { const el = Q.add(worker(c, m.o, '')); return { ...m, el, p: S.puppet(el), seed: c.rr(0, 9) }; });
    const fx = S.layer({ par: 0.6, sh: 6 });
    const coins = [0, 1, 2].map(() => fx.add(`<g>${silver(c, 11)}</g>`));
    const glints = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 14)}</g>`));
    const order = fx.add(`<g>${say(c, tr(['Zwołaj robotników i wypłać im:', 'od ostatnich do pierwszych!'], ['Call the labourers and pay them,', 'from the last to the first!']), { size: 18, side: 1 })}</g>`);
    const rings = voiceRings(fx, c, { n: 3, color: C.terracotta, r: 26, w: 4, both: false });
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 150, 1010, 230, C.sage, C.moss) + rock(c, 1470, 1000, 220, 70, C.rock2));

    // when each one leaves his place among the vines, and reaches his place in the line
    const callT = (k) => 1.2 + k * 0.045;

    return (t, time) => {
      const T = time;
      W.update(t, T, { h: lerp(11.3, 12.15, es(t, 0, 1.6)), tag: 'eve', tagO: es(t, 0.15, 0.4, ease.out), drift: 0.5 });
      W.sk2L.fade(es(t, 0, 1.2));

      /* beat 0: evening — they straighten up; beat 1: called out, from the last to the first */
      inside.forEach((m) => {
        const k = QUEUE.findIndex((q) => q.g === m.g && q.i === m.i);
        const stop = es(t, 0.3 + (m.wi % 5) * 0.06, 0.55 + (m.wi % 5) * 0.06);
        const t0 = callT(k);
        const leave = es(t, t0, t0 + 0.14);
        const wp = workPose(m.wi + 4, 1 - stop);
        const x = lerp(m.x, 950, leave);
        m.p.set({ x, y: lerp(m.y, VW.G + 4, leave), s: m.s, flip: leave > 0 ? true : wp.flip, walk: leave > 0 && leave < 1 ? x * 0.06 + m.wi : undefined, lean: wp.lean, armF: wp.armF, armB: wp.armB, head: wp.head - stop * 4, o: leave < 1 ? 1 : 0, blink: blinkAt(T, m.seed) });
      });
      line.forEach((m) => {
        const t0 = callT(m.k) + 0.14;
        const [qx, qy] = qSpot(m.k);
        const keys = [[t0, [948, VW.G + 8]], [t0 + 0.1, [968, qy]], [t0 + 0.3, [qx, qy]]];
        let [x, y] = kfXY(t, keys);
        let walking = movingXY(t, keys);
        let armF = 12, armB = 0, head = 0, lean = 0;
        // v9 — the last step up and are paid, each a denarius
        let flip = true, sc = 1;
        if (m.g === 'last') {
          const p0 = 2.04 + m.i * 0.15;
          const up = es(t, p0, p0 + 0.07);
          const aside = es(t, p0 + 0.16, p0 + 0.28);
          const keysP = [[p0 + 0.16, [PAY.Q0 - 26, y]], [p0 + 0.28, PAID[m.i]]];
          if (up > 0) [x, y] = aside > 0 ? kfXY(t, keysP) : [lerp(x, PAY.Q0 - 26, up), y];
          if (aside > 0 && aside < 1) walking = true;
          flip = aside >= 1 ? false : true;
          sc = lerp(1, 0.95, aside);
          const take = es(t, p0 + 0.04, p0 + 0.1);
          const joy = es(t, p0 + 0.12, p0 + 0.2);
          armF = 12 + take * 50 * (1 - joy) + joy * (aside >= 1 ? 70 : 96);
          armB = joy * (m.i === 1 ? 120 : 30);
          head = -joy * 10;
          const [hx, hy] = handAt(x, y, sc, flip, armF);
          const fly = es(t, p0 + 0.05, p0 + 0.11);
          const [sx, sy] = handAt(PAY.STEW, PAY.QY - 4, 0.96, false, 70);
          pose(coins[m.i], { x: lerp(sx, hx, fly), y: lerp(sy, hy, fly) - Math.sin(fly * Math.PI) * 30, s: 1 + joy * 0.2, o: t > p0 + 0.04 ? 1 : 0 });
          const g = bump(t, p0 + 0.12, p0 + 0.5);
          pose(glints[m.i], { x: hx + 10, y: hy - 20 - g * 10, s: 0.5 + g * 0.6, r: T * 30, o: g });
          face(m.el, 'sad', 1 - es(t, p0 + 0.1, p0 + 0.16));
        }
        m.p.set({ x, y, s: sc, flip, o: t > t0 ? 1 : 0, walk: walking ? x * 0.06 + m.k : undefined, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
      });

      /* the householder turns to the steward; the steward calls them, then pays */
      const speak = es(t, 1.04, 1.18) * (1 - es(t, 1.9, 2.0));
      owner.set({ x: PAY.OWN, y: PAY.QY - 10, s: 0.98, flip: false, armF: 14 + es(t, 0.5, 0.7) * 30 + speak * 40, armB: speak * 30 + es(t, 2.0, 2.3) * 20, head: -2 + es(t, 0.5, 0.7) * 4, blink: blinkAt(T) });
      const ok = es(t, 1.06, 1.2, ease.back) * (1 - es(t, 1.88, 1.98));
      pose(order, { x: PAY.OWN + 40, y: PAY.QY - 226, s: ok, o: ok > 0.02 ? 1 : 0 });
      const calling = es(t, 1.25, 1.35) * (1 - es(t, 1.8, 1.9));
      const hand = [0, 1, 2].reduce((a, i) => Math.max(a, bump(t, 2.02 + i * 0.15, 2.14 + i * 0.15)), 0);
      stew.set({ x: PAY.STEW, y: PAY.QY - 4, s: 0.96, flip: false, armF: 20 + calling * 60 + hand * 50, armB: calling * 130, head: -calling * 8 + es(t, 0.6, 0.8) * 4 - 4, blink: blinkAt(T, 3) });
      const [shx, shy] = handAt(PAY.STEW, PAY.QY - 4, 0.96, false, 0);
      rings(shx + 30, shy - 40, calling, T, { dir: 1, spread: 2 });

      S.cam.x = lerp(40, 20, es(t, 0.3, 1)) + es(t, 1.2, 1.9) * 60 - es(t, 2.0, 2.5) * 110;
      S.cam.z = 1.02 + es(t, 0.3, 1) * 0.04 + es(t, 2.0, 2.3) * 0.04;
      S.cam.y = 24;
    };
  },
};
