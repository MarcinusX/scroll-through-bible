// Łk 14,21–22 — back in the house of the great supper: evening, the lamps lit, the table heaped and every place empty.
// The servant comes back through the doorway and tells his master — in his words, three little pictures: a field, an
// ox, a bride. The master's face darkens and flushes, little red puffs of anger rise; he points out through the door:
// "Go out quickly into the streets and lanes of the city!" and the servant runs out. Then in they come from the
// street — the poor, the maimed with his arm in a sling, the blind with his stick, the lame on his crutch — and sit down
// at the table. "Sir, it is done as you commanded, and there is still room": the empty places glow.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { supperHall, supperRow, SU, MASTER, SERVANT, POOR, MAIMED, BLINDM, LAMEM, POORW, reportIcons, angryFace, puff, bubble, sling, wrap, crutchHeld, stickHeld, sparkle, headAt, hand, kf, moving, popAt, addToHead, addToBody, makeCutter, tr } from './lib.js';
import { lantern as handLantern } from '../matthew11/lib.js';

const DX = SU.DOOR[0] + 60;
const LOOKS = [POOR, MAIMED, BLINDM, LAMEM];

export default {
  id: 'lk14-streets',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 21, text: 'Sługa powrócił i oznajmił to swemu panu.' },
    { v: 21, cont: true, text: 'Wtedy rozgniewany gospodarz nakazał słudze: "Wyjdź co prędzej na ulice i zaułki miasta i wprowadź tu ubogich, ułomnych, niewidomych i chromych!"' },
    { v: 22 },
  ],
  cam: { x: [-40, 160], y: [0, 120], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const H = supperHall(S);
    const seated = H.seatL.sprite(supperRow(makeCutter('lk14-streetfolk'), [...LOOKS, POORW], SU.SEATS.slice(0, 4).concat([SU.SEATS[5]])), 800, SU.SEAT);
    const glows = [4, 6].map((k) => H.bolL.add(`<g opacity="0"><ellipse cx="${SU.SEATS[k]}" cy="${SU.TOP - 24}" rx="46" ry="40" fill="url(#warm-glow)"/></g>`));
    const sps = [4, 6].map(() => H.fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const master = S.puppet(H.frontL.add(person(c, MASTER)));
    const angry = S.puppet(H.frontL.add(addToHead(person(c, MASTER), angryFace(c))));
    const servant = S.puppet(H.frontL.add(person(c, { ...SERVANT, holdB: `<g transform="translate(0 4)">${handLantern(c, 14, C.apricot)}</g>` })));
    const walkers = LOOKS.map((o, i) => {
      let m = person(c, { ...o, holdF: i === 3 ? crutchHeld(c) : i === 2 ? stickHeld(c) : i === 1 ? wrap(c) : '' });
      if (i === 1) m = addToBody(m, sling(c));
      return S.puppet(H.frontL.add(m));
    });
    const report = H.fx.add(`<g opacity="0">${bubble(c, [' ', ' '], { size: 20, dir: 1, w: 190 })}<g transform="translate(-77 -56)">${reportIcons(c)}</g></g>`);
    const order = H.fx.add(`<g opacity="0">${bubble(c, [tr('Wyjdź co prędzej', 'Go out quickly'), tr('na ulice i zaułki!', 'into the streets and lanes!')], { size: 19, dir: -1, jag: false })}</g>`);
    const done = H.fx.add(`<g opacity="0">${bubble(c, [tr('Panie, stało się…', 'Lord, it is done…'), tr('a jeszcze jest miejsce!', 'and there is still room!')], { size: 19, dir: 1 })}</g>`);
    const puffs = [0, 1, 2].map(() => H.fx.add(`<g opacity="0">${puff(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(t, T, { lit: 1, night: 0.75 });
      /* v21a — the servant comes back and tells his master */
      const MX = S.portrait ? 540 : SU.MX, SX = S.portrait ? MX + 200 : SU.MX + 180, BX = S.portrait ? 1050 : 1090;   // phone: inside the screen
      const SK = [[0, DX], [0.4, SX], [1.3, SX], [1.62, DX + 60], [2.0, DX + 60], [2.3, BX], [2.45, BX]];
      const sx = kf(t, SK);
      const back = t > 1.28 && t < 1.66;
      const bow = es(t, 2.46, 2.56);
      servant.set({ x: sx, y: SU.FL + 4, s: 0.98, flip: !back && t < 2.1 ? true : t > 2.3, o: 1 - seg(t, 1.6, 1.66) + seg(t, 2.02, 2.08), walk: moving(t, SK) ? sx * 0.06 : undefined, amt: back ? 1.2 : 0.8, armF: 20 + bump(t, 0.45, 0.95) * 50 + bow * 20, armB: 20 + bump(t, 0.45, 0.95) * 40, lean: bow * 14, head: bow * 16, blink: blinkAt(T, 5) });
      const [svx, svy] = headAt(sx, SU.FL + 4, 0.98, true);
      popAt(report, t, 0.44, 1.0, svx - 14, svy - 30, { d: 0.12 });
      /* v21b — the master, angry: "Go out quickly…" */
      const mad = es(t, 0.8, 0.9) * (1 - es(t, 2.1, 2.2));
      const point = es(t, 1.14, 1.26) * (1 - es(t, 2.0, 2.2));
      master.set({ x: MX, y: SU.FL, s: 1.04, flip: false, o: 1 - mad, armF: 30, armB: 10, head: 2, blink: blinkAt(T, 2) });
      angry.set({ x: MX, y: SU.FL, s: 1.04, flip: false, o: mad, armF: 30 + point * 64 + bump(t, 0.9, 1.15) * 40, armB: 10 + bump(t, 0.9, 1.15) * 120, head: -4 - point * 4, lean: point * 4, blink: blinkAt(T, 2) });
      const [mhx, mhy] = headAt(MX, SU.FL, 1.04, false);
      puffs.forEach((e, i) => { const u = seg(t, 0.9 + i * 0.1, 1.4 + i * 0.1); pose(e, { x: mhx - 10 + i * 14, y: mhy - 30 - u * 60, s: Math.sin(u * Math.PI), r: u * 120, o: u > 0 && u < 1 && t < 2 ? 1 : 0 }); });
      popAt(order, t, 1.18, 2.02, mhx + 12, mhy - 36, { d: 0.12 });
      /* v22 — in they come; still room */
      walkers.forEach((p, i) => {
        const K = [[1.82 + i * 0.06, DX + 40], [2.28 + i * 0.04, SU.SEATS[i] + 30]];
        const x = kf(t, K);
        const sit = es(t, 2.34 + i * 0.03, 2.4 + i * 0.03);
        p.set({ x, y: SU.FL + (i % 2) * 5, s: 0.96, flip: true, o: seg(t, K[0][0], K[0][0] + 0.05) * (1 - sit), walk: moving(t, K) ? x * 0.05 + i : undefined, amt: i === 3 ? 0.5 : 0.8, armF: i === 2 ? 40 : 16, armB: 8, head: i === 2 ? -4 : 4, blink: blinkAt(T, i + 3) });
      });
      seated.set({ o: es(t, 2.36, 2.46) });
      const room = es(t, 2.5, 2.7);
      glows.forEach((g) => pose(g, { o: room }));
      sps.forEach((e, i) => { const x = SU.SEATS[[4, 6][i]]; pose(e, { x, y: SU.TOP - 40, s: room * (0.8 + (T ? Math.sin(T * 3 + i) * 0.15 : 0)), r: T * 30, o: room > 0.02 ? 1 : 0 }); });
      const [dvx, dvy] = headAt(BX, SU.FL + 4, 0.98, true);
      popAt(done, t, 2.52, undefined, dvx - 14, dvy - 34, { d: 0.12 });

      S.cam.x = kf(t, [[-0.5, 80], [0, 80], [0.4, 0], [1.3, 0], [1.6, 60], [2.0, 60], [2.4, 40]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.4, 60]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.4, 1.1], [2.0, 1.1], [2.4, 1.04]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 140], [0.4, 0], [1.95, 0], [2.4, 80]]); S.cam.z = 1.0; }   // phone: hold on the angry master while he speaks
      void hand; void lerp; void ease;
    };
  },
};
