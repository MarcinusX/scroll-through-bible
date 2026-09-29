// Łk 14,8–9 — the parable flies in as a painted flat: a wedding hall with lanterns and garlands, the bride and groom
// under their canopy in the middle of the long table, the gold couch of the first place at its right end and a straw
// mat, the last place, by the door. A guest in a bright festive mantle struts in, chin in the air, all the way up the
// hall and settles himself on the gold couch. Then, in the doorway, someone more honourable than he: an old man in a
// purple mantle with a gold band. The host comes over to the couch: "Give this man your place!" — and blushing to the
// ears, head down, the first guest gets up and walks the whole length of the table, past every seat already taken,
// to the straw mat by the door, while the honoured guest is seated in the first place.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { weddingHall, weddingTable, WH, PROUD, NOBLE, HOST, shameCheeks, drops, bubble, nameTag, headAt, hand, kf, moving, popAt, addToHead, makeCutter, tr } from './lib.js';

export default {
  id: 'lk14-wedding',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 8 },
    { v: 9, text: 'Wówczas przyjdzie ten, kto was obu zaprosił, i powie ci: "Ustąp temu miejsca!";' },
    { v: 9, cont: true, text: 'i musiałbyś ze wstydem zająć ostatnie miejsce.' },
  ],
  cam: { x: [-80, 60], y: [0, 120], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const H = weddingHall(S);
    const tMid = H.seatL.sprite(weddingTable(makeCutter('lk14-wt'), 'mid'), 780, WH.SEAT);
    const tLeft = H.seatL.sprite(weddingTable(makeCutter('lk14-wt'), 'left'), 780, WH.SEAT);
    const glow = H.placeL.add(`<g opacity="0"><ellipse rx="90" ry="150" fill="url(#warm-glow)"/></g>`);
    const pWalk = S.puppet(H.frontL.add(person(c, PROUD)));
    const pSit = S.puppet(H.frontL.add(person(c, { ...PROUD, pose: 'sit' })));
    const pShame = S.puppet(H.frontL.add(addToHead(person(c, PROUD), shameCheeks(c))));
    const pLow = S.puppet(H.frontL.add(addToHead(person(c, { ...PROUD, pose: 'sit' }), shameCheeks(c))));
    const nWalk = S.puppet(H.frontL.add(person(c, NOBLE)));
    const nSit = S.puppet(H.frontL.add(person(c, { ...NOBLE, pose: 'sit' })));
    const host = S.puppet(H.frontL.add(person(c, HOST)));
    const say = H.fx.add(`<g opacity="0">${bubble(c, tr('Ustąp temu miejsca!', 'Make room for this person.'), { size: 20, dir: 1 })}</g>`);
    const tag = H.fx.add(`<g opacity="0">${nameTag(c, tr('ktoś znakomitszy', 'someone more honourable'), { size: 16 })}</g>`);
    const sweat = H.fx.add(`<g opacity="0">${drops(c)}</g>`);

    return (t, time) => {
      const T = time;
      H.update(t, T);
      const [FX, FY] = WH.FIRST, [LX, LY] = WH.LAST;
      /* v8 — the proud guest takes the first place; someone more honourable appears at the door */
      const PK = [[0.02, 320], [0.44, 1080]];
      const px = kf(t, PK);
      const sat = es(t, 0.44, 0.48);
      const up = es(t, 2.04, 2.08);
      pWalk.set({ x: px, y: WH.FL, s: 1.0, o: seg(t, 0, 0.04) * (1 - sat), walk: moving(t, PK) ? px * 0.05 : undefined, amt: 1.1, armF: 20, armB: 60, head: -10, lean: -4, blink: blinkAt(T, 2) });
      const told = es(t, 1.35, 1.5);
      pSit.set({ x: FX, y: FY, s: 1.0, flip: true, o: sat * (1 - up), armF: 30 + told * 30, armB: 70 - told * 40, head: -10 + told * 14, lean: -6 + told * 8, blink: blinkAt(T, 2) });
      /* v9b — with shame to the last place */
      const SK = [[2.08, FX - 30], [2.6, LX + 10]];
      const sx = kf(t, SK);
      const low = es(t, 2.6, 2.64);
      pShame.set({ x: sx, y: WH.FL, s: 1.0, flip: true, o: up * (1 - low), walk: moving(t, SK) ? sx * 0.04 : undefined, amt: 0.6, armF: 6, armB: 4, head: 20, lean: 6, blink: 0.4 });
      pLow.set({ x: LX, y: LY, s: 1.0, flip: false, o: low, armF: 20, armB: 10, head: 18, lean: 4, blink: 0.4 });
      const [shx, shy] = t < 2.6 ? headAt(sx, WH.FL, 1.0, true) : headAt(LX, LY, 1.0, false, 62);
      pose(sweat, { x: shx + (t < 2.6 ? -26 : 20), y: shy - 22, o: es(t, 2.12, 2.2) });
      /* the honoured guest */
      const NK = [[0.56, 330], [0.72, 420], [1.1, 420], [1.6, 990], [2.2, 990], [2.4, FX - 30]];
      const nx = kf(t, NK);
      const nsat = es(t, 2.42, 2.46);
      nWalk.set({ x: nx, y: WH.FL, s: 1.0, o: seg(t, 0.56, 0.62) * (1 - nsat), walk: moving(t, NK) ? nx * 0.04 : undefined, amt: 0.7, armF: 16, armB: 8, head: 2, blink: blinkAt(T, 4) });
      nSit.set({ x: FX, y: FY, s: 1.0, flip: true, o: nsat, armF: 30, armB: 10, head: 2, blink: blinkAt(T, 4) });
      pose(glow, { x: nx, y: WH.FL - 110, o: seg(t, 0.56, 0.7) * (1 - es(t, 1.1, 1.4)) * 0.9 });
      const [nhx, nhy] = headAt(nx, WH.FL, 1.0, false);
      popAt(tag, t, 0.68, 1.45, nhx, nhy - 76, { d: 0.12 });
      /* v9a — the host comes: "Give this man your place!" */
      const HK = [[1.02, 1290], [1.3, FX + 70]];
      const hx = kf(t, HK);
      const point = es(t, 1.32, 1.45) * (1 - es(t, 2.5, 2.7));
      host.set({ x: hx, y: WH.FL, s: 1.02, flip: true, walk: moving(t, HK) ? hx * 0.05 : undefined, armF: 20 + point * 104, armB: 10 + point * 40, head: 4, lean: point * 4, blink: blinkAt(T, 6) });
      const [hhx, hhy] = headAt(hx, WH.FL, 1.02, true);
      popAt(say, t, 1.34, 2.08, hhx - 16, hhy - 34, { d: 0.12 });
      /* the table: at ease, then everyone turns to watch him go down */
      const turn = es(t, 2.14, 2.2);
      tMid.set({ o: 1 - turn });
      tLeft.set({ o: turn });

      S.cam.x = kf(t, [[-0.5, -40], [0, -40], [0.44, 30], [0.7, -10], [1.1, 40], [2.0, 50], [2.6, -40]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.4, 80], [2.0, 80]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.4, 1.08], [2.0, 1.1], [2.5, 1.04]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -120], [0.44, 80], [0.7, -120], [1.1, 60], [2.0, 80], [2.6, -100]]); S.cam.z = 1.0; }
      void hand; void lerp; void bump;
    };
  },
};
