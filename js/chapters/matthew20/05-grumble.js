// Mt 20,10–12 — the line has moved up: the men of the last hour stand aside with their coins; now the first come to
// the table, and over their heads a thought-cloud swells with a whole stack of silver — surely more for us. But each is
// given one denarius, like the rest, and the cloud pops. They grumble at the householder: frowns, puffs of steam, hands
// on hips. "These last have worked one hour, and you have made them equal to us, who bore the burden of the day and the
// scorching heat!" — and a pair of scales is let down between them: one hour on one pan, the whole blazing day on the
// other, a denarius on each, the beam dead level.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineWorld, VW, SKY, OWNER, STEWARD, FIRST, LAST, PAY, PAID, qSpot, worker, payTable, silver, silverStack, thought, balance, sunCut, slip, face, handAt, headAt, hangAt, say, tr, bush, rock, sheet, shade, mix, PI } from './lib.js';

/** a puff of steam (grumbling); origin centre */
function puff(c) {
  let d = '';
  for (let i = 0; i < 4; i++) d += c.cut(c.circ(i * 7 - 10, -i * 5, 6 + i, 10), 0.3, 3);
  return `<path d="${d}" fill="${C.cream}" opacity=".9"/>`;
}

export default {
  id: 'mt20-grumble',
  parable: true,
  beats: [
    { v: 10, text: 'Gdy więc przyszli pierwsi, myśleli, że więcej dostaną;' },
    { v: 10, cont: true, text: 'lecz i oni otrzymali po denarze.' },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-60, 60], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const W = vineWorld(S, { sky: SKY.evening, sky2: SKY.dusk, tags: ['eve'] });
    W.front({ fg: false });

    const Q = S.layer({ par: 0.6, sh: 5 });
    const paid = LAST.map((o, i) => { const el = Q.add(worker(c, o, '')); return { i, el, p: S.puppet(el), seed: c.rr(0, 9) }; });
    const owner = S.puppet(Q.add(person(c, OWNER)));
    const stew = S.puppet(Q.add(person(c, STEWARD)));
    Q.add(`<g transform="translate(${PAY.TABLE} ${PAY.QY + 8})">${payTable(c)}</g>`);
    const first = FIRST.map((o, k) => ({ o, k })).reverse().map(({ o, k }) => { const el = Q.add(worker(c, o, '')); return { k, el, p: S.puppet(el), seed: c.rr(0, 9) }; });

    const fx = S.layer({ par: 0.6, sh: 6 });
    const paidCoins = paid.map(() => fx.add(`<g>${silver(c, 10)}</g>`));
    const coins = FIRST.map(() => fx.add(`<g>${silver(c, 10)}</g>`));
    const hope = fx.add(`<g>${thought(c, `<g transform="translate(0 30)">${silverStack(c, 9, 16)}</g><g transform="translate(-40 30)">${silverStack(c, 6, 15)}</g><g transform="translate(40 30)">${silverStack(c, 7, 15)}</g>`, { w: 170, h: 120 })}</g>`);
    const pop = fx.add(`<g>${thought(c, `<g transform="translate(0 6)">${silver(c, 13)}</g>`, { w: 64, h: 50 })}</g>`);
    const puffs = FIRST.map(() => fx.add(`<g><g transform="scale(1.7)">${puff(c)}</g></g>`));
    const shout = fx.add(`<g>${say(c, tr(['Ci ostatni jedną godzinę pracowali,', 'a zrównałeś ich z nami!'], ['These last have spent one hour,', 'and you have made them equal to us!']), { size: 18, side: -1, jag: true })}</g>`);

    // the scales, let down between them
    const B = balance(c, { arm: 150, h: 0, drop: 80 });
    const L = sheet().p(c.cut([[-60, 0], [60, 0], [58, 16], [-58, 16]], 0.4, 5), C.cream).out();
    const scales = fx.add(`<g><path d="M0 -24V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${B.beam}
      <g transform="translate(-150 0)">${B.pan}<g transform="translate(0 ${B.drop - 10})">${silver(c, 12)}</g><g transform="translate(0 ${B.drop + 58})">${slip(c, tr('jedna godzina', 'one hour'), { size: 16 })}</g></g>
      <g transform="translate(150 0)">${B.pan}<g transform="translate(0 ${B.drop - 10})">${silver(c, 12)}</g><g transform="translate(0 ${B.drop + 58})">${slip(c, tr('cały dzień i upał', 'the whole day’s heat'), { size: 16 })}</g><g transform="translate(34 ${B.drop - 52})">${sunCut(c, 16)}</g></g>
      <circle cy="-6" r="7" fill="${C.sun}"/></g>`);
    void L;
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 150, 1010, 230, C.sage, C.moss) + rock(c, 1470, 1000, 220, 70, C.rock2));

    return (t, time) => {
      const T = time;
      W.update(t, T, { h: 12.3, tag: 'eve', tagO: 1 - es(t, 2.9, 3.1), drift: 0.4 });
      W.sk2L.fade(es(t, 0, 4) * 0.55);

      /* the last, aside with their coins */
      paid.forEach((m) => {
        const [x, y] = PAID[m.i];
        const look = es(t, 2.1, 2.5);
        const armF = 70 - look * 20;
        m.p.set({ x, y, s: 0.95, flip: false, armF, armB: m.i === 1 ? 40 : 10, head: -6 + look * 8, blink: blinkAt(T, m.seed) });
        const [hx, hy] = handAt(x, y, 0.95, false, armF);
        pose(paidCoins[m.i], { x: hx, y: hy - 6 });
      });

      /* v10a — the first step up, hoping for more; v10b — one denarius each */
      const pay0 = (k) => 1.06 + k * 0.1;
      first.forEach((m) => {
        const [qx, qy] = qSpot(m.k);
        const step = es(t, 0.05, 0.4);
        const x = qx - step * 26;
        const got = es(t, pay0(m.k) + 0.06, pay0(m.k) + 0.12);
        const grumble = es(t, 2.05, 2.3);
        const shout = m.k === 0 ? es(t, 3.05, 3.2) : 0;
        const armF = 14 + es(t, pay0(m.k), pay0(m.k) + 0.06) * 50 + grumble * (m.k % 2 ? -30 : 10) + shout * 50;
        const armB = grumble * (m.k % 2 ? 60 : 20) + shout * 30;
        m.p.set({ x, y: qy, s: 1, flip: true, armF, armB, lean: -grumble * 3, head: -es(t, 0.3, 0.6) * 6 * (1 - got) + got * 6 * (1 - grumble) - grumble * 4 + (T ? Math.sin(T * 3 + m.k) * 3 * grumble : 0), blink: blinkAt(T, m.seed) });
        face(m.el, 'sad', got * (1 - grumble));
        face(m.el, 'angry', grumble);
        const [hx, hy] = handAt(x, qy, 1, true, armF);
        const fly = es(t, pay0(m.k), pay0(m.k) + 0.06);
        const [sx, sy] = handAt(PAY.STEW, PAY.QY - 4, 0.96, false, 70);
        pose(coins[m.k], { x: lerp(sx, hx, fly), y: lerp(sy, hy - 6, fly) - Math.sin(fly * PI) * 30, o: t > pay0(m.k) ? 1 : 0 });
        const [ex, ey] = headAt(x, qy, 1, true);
        pose(puffs[m.k], { x: ex + (m.k % 2 ? 22 : -22), y: ey - 30 - (T ? (T * 30) % 20 : 8), o: grumble * (T ? 0.5 + 0.5 * Math.sin(T * 5 + m.k) : 1) });
      });
      // the thought-cloud of silver, then the single coin
      const [tx, ty] = headAt(qSpot(1)[0] - 26, PAY.QY, 1, true);
      const hk = es(t, 0.3, 0.6, ease.back) * (1 - es(t, 1.1, 1.22));
      pose(hope, { x: tx, y: ty - 26, s: hk, o: hk > 0.02 ? 1 : 0 });
      const pk = es(t, 1.2, 1.3, ease.back) * (1 - es(t, 1.9, 2.02));
      pose(pop, { x: tx, y: ty - 26, s: pk, o: pk > 0.02 ? 1 : 0 });

      /* the householder and the steward; v11 — the grumbling is at the householder */
      const hand = [0, 1, 2, 3, 4].reduce((a, k) => Math.max(a, bump(t, pay0(k) - 0.02, pay0(k) + 0.08)), 0);
      stew.set({ x: PAY.STEW, y: PAY.QY - 4, s: 0.96, flip: false, armF: 20 + hand * 50, head: -2 + es(t, 2.1, 2.4) * 6, blink: blinkAt(T, 3) });
      owner.set({ x: PAY.OWN, y: PAY.QY - 10, s: 0.98, flip: false, armF: 14 + es(t, 2.2, 2.5) * 20, armB: 10, head: 2, blink: blinkAt(T) });

      /* v12 — "you made them equal to us": the scales come down */
      const sh = es(t, 3.04, 3.2, ease.back);
      pose(shout, { x: qSpot(0)[0] - 30, y: PAY.QY - 224, s: sh, o: sh > 0.02 ? 1 : 0 });
      const sd = es(t, 3.2, 3.55, ease.back);
      hangAt(scales, 900, lerp(-400, 214, sd), T, 1.2, 0.7);

      S.cam.x = lerp(40, 30, es(t, 0, 0.6)) - es(t, 2.9, 3.3) * 20;
      S.cam.z = 1.06 + es(t, 0, 0.6) * 0.05 - es(t, 2.9, 3.3) * 0.07;
      S.cam.y = 24 + es(t, 2.9, 3.3) * 0;
    };
  },
};
