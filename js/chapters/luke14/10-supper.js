// Łk 14,16b–17 — the parable flies in: the house of "a certain man" in the city, an ochre room with three arched
// windows onto the town on the hill. He spreads his arms over a long table heaped for a great supper — roasts, bread,
// grapes, wine — and sends out invitations: little sealed scrolls fly out of the windows to the houses on the hill, and
// one after another their windows light up. Dusk comes; the paper lamps are lit. At the hour of the supper he sends his
// servant: the servant takes a lantern, goes to the wide doorway onto the street and calls out: "Come, for everything
// is ready now!"
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { supperHall, SU, MASTER, SERVANT, invitation, bubble, sparkle, headAt, hand, kf, moving, popAt, tr } from './lib.js';
import { lantern as handLantern } from '../matthew11/lib.js';

export default {
  id: 'lk14-supper',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 16, cont: true, text: '«Pewien człowiek wyprawił wielką ucztę i zaprosił wielu.' },
    { v: 17 },
  ],
  cam: { x: [-40, 140], y: [0, 120], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const H = supperHall(S);
    const master = S.puppet(H.frontL.add(person(c, MASTER)));
    const servant = S.puppet(H.frontL.add(person(c, { ...SERVANT, holdF: `<g transform="translate(0 4)">${handLantern(c, 14, C.apricot)}</g>` })));
    const INV = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ i, el: H.fx.add(`<g opacity="0">${invitation(c, 32)}</g>`), sp: H.fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`), target: H.HOUSES[(i * 5 + 1) % H.HOUSES.length] }));
    const call = H.fx.add(`<g opacity="0">${bubble(c, [tr('Przyjdźcie, bo już', 'Come, for everything'), tr('wszystko jest gotowe!', 'is ready now!')], { size: 20, dir: -1, fill: C.halo })}</g>`);

    return (t, time) => {
      const T = time;
      const lit = es(t, 1.0, 1.25);
      H.update(t, T, { lit, night: lit * 0.7 });
      /* v16b — a great supper; he invites many */
      pose(H.foodEl, { x: 0, y: 0, o: 1 });
      const spread = bump(t, 0.02, 0.5);
      const send = es(t, 0.4, 0.5) * (1 - es(t, 0.95, 1.05));
      const sendSvt = es(t, 1.05, 1.2) * (1 - es(t, 1.6, 1.8));
      master.set({ x: SU.MX, y: SU.FL, s: 1.04, flip: false, armF: 30 + spread * 60 + send * 80 + sendSvt * 70, armB: 10 + spread * 120 + send * 30, head: -2 - spread * 6, blink: blinkAt(T, 2) });
      const [mhx, mhy] = hand(SU.MX, SU.FL, 1.04, false, 110);
      INV.forEach(({ i, el, sp, target }) => {
        const u = es(t, 0.42 + i * 0.05, 0.66 + i * 0.05);
        pose(el, { x: lerp(mhx, target[0], u), y: lerp(mhy, target[1], u) - Math.sin(u * Math.PI) * 120, r: u * 300, s: 1 - u * 0.5, o: u > 0 && u < 1 ? 1 : 0 });
        const k = bump(t, 0.64 + i * 0.05, 0.84 + i * 0.05);
        pose(sp, { x: target[0], y: target[1] - 4, s: k * 0.8, r: T * 40, o: k > 0.02 ? 1 : 0 });
      });
      pose(H.winLit, { o: es(t, 0.7, 1.1) * 0.9 });
      /* v17 — at supper time he sends his servant: "Come, everything is ready" */
      const SK = [[0, 370], [1.12, 370], [1.56, SU.DOOR[0] + 30]];
      const sx = kf(t, SK);
      const calling = es(t, 1.58, 1.66);
      servant.set({ x: sx, y: SU.FL + 4, s: 0.98, flip: false, walk: moving(t, SK) ? sx * 0.05 : undefined, armF: 40, armB: 10 + calling * 130, head: -calling * 8, blink: blinkAt(T, 5) });
      const [shx, shy] = headAt(sx, SU.FL, 0.98, false);
      popAt(call, t, 1.6, undefined, shx + 12, shy - 36, { d: 0.12 });

      S.cam.x = kf(t, [[-0.5, 0], [0.9, 0], [1.3, 60], [1.6, 110]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.3, 40], [1.2, 60]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.3, 1.04], [1.3, 1.1]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -40], [0.4, 0], [1.2, 0], [1.6, 140]]); S.cam.z = 1.0; }
      void seg; void ease;
    };
  },
};
