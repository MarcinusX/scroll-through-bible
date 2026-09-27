// J 13,4–5a — a quiet, reverent sequence, one action per sentence. He rises from supper (the Twelve look up);
// He lays aside His red outer garment and folds it on the table; He takes the servant's towel that lay folded
// by the dish; He ties it round His waist; then He tips the ewer and pours water into the basin — the water rises.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, EVE, JX, JESUS, JESUS_TUNIC, C, person, addToBody, towelWrap, foldedCloth, towelHeld, basinParts, ewer, waterStream, splash,
  sparkle, kf, hand, vis, pose, fade, lerp, mix, blinkAt, PI,
} from './lib.js';

export default {
  id: 'j13-towel',
  beats: [
    { v: 4, text: 'wstał od wieczerzy' },
    { v: 4, cont: true, text: 'i złożył szaty.' },
    { v: 4, cont: true, text: 'A wziąwszy prześcieradło' },
    { v: 4, cont: true, text: 'nim się przepasał.' },
    { v: 5, text: 'Potem nalał wody do miednicy.' },
  ],
  cam: { x: [-40, 60], y: [0, 240], z: [1, 2.1] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: EVE });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus;
    const SY = SEAT - 8;   // standing behind the table
    /* Jesus standing: in His mantle, in the tunic, girded with the towel */
    const jM = S.puppet(T0.seatL.add(person(c, JESUS)));
    const jT = S.puppet(T0.seatL.add(person(c, JESUS_TUNIC)));
    const jG = S.puppet(T0.seatL.add(addToBody(person(c, JESUS_TUNIC), towelWrap(c, 'stand'))));
    /* on the table: the folded towel, the basin; the laid-aside mantle */
    const bL = S.layer({ par: 0.55, sh: 4 });
    const towelF = bL.add(`<g>${foldedCloth(c, 40, 12, mix(C.linen2, C.stone2, 0.35))}</g>`);
    const mantle = bL.add(`<g>${foldedCloth(c, 52, 14, C.jesusMantle)}</g>`);
    const bas = basinParts(c, 64);
    const BX = 898;
    bL.add(`<g transform="translate(${BX} ${TOP})">${bas.back}</g>`);
    const water = bL.add(`<g>${bas.water}</g>`);
    bL.add(`<g transform="translate(${BX} ${TOP})">${bas.front}</g>`);
    const fx = S.layer({ par: 0.55, sh: 3 });
    const held = fx.add(`<g>${towelHeld(c, 50)}</g>`);
    const jug = fx.add(`<g>${ewer(c)}</g>`);
    const stream = fx.add(`<g>${waterStream(c, 60)}</g>`);
    const drops = fx.add(`<g>${splash(c, 14, 5)}</g>`);
    const glint = fx.add(`<g>${sparkle(c, 12)}</g>`);
    const glint2 = fx.add(`<g>${sparkle(c, 10)}</g>`);

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0);
      R.stars.fade(0.6);

      /* b0 — He rises from supper */
      const rise = es(t, 0.15, 0.22);
      const up = es(t, 0.15, 0.5, ease.out);
      const off = es(t, 1.2, 1.27);     // the mantle is off
      const gird = es(t, 3.3, 3.37);    // the towel is on
      const look = es(t, 0.1, 0.4);
      at.forEach((m) => {
        if (m.k === 'jesus') { T0.sit(m, T, { o: 1 - rise, armF: 30 }); return; }
        const d = Math.abs(m.x - JX);
        const near = d < 140 ? 1 : d < 260 ? 0.6 : 0.3;
        const wonder = bump(t, 0.2, 1.0) * near;
        T0.sit(m, T, { head: -look * (6 + near * 6) - wonder * 4 + es(t, 4.1, 4.5) * 6 * near, armF: 36 + wonder * 20 * near, lean: wonder * 3 * near + (m.k === 'peter' ? es(t, 2.0, 2.5) * 6 : 0) });
      });

      /* b1 — He lays aside His garments: the mantle comes off, is folded and laid on the table */
      const fold = bump(t, 1.1, 1.75);
      const [mhx, mhy] = hand(JX, SY - (1 - up) * 40, 1.02, false, 40 + fold * 30);
      const lay = es(t, 1.45, 1.8);
      const mx = lerp(mhx + 4, 734, lay), my = lerp(mhy + 8, TOP, lay);
      vis(mantle, { x: mx, y: my, s: 1, o: off });

      /* b2 — He takes the towel (it unfolds in His hand) */
      const reach = bump(t, 2.05, 2.6);
      const take = es(t, 2.35, 2.42);
      const armT = 30 + reach * 40 + take * (1 - es(t, 3.1, 3.3)) * 30;
      const [thx, thy] = hand(JX, SY, 1.02, false, armT);
      vis(towelF, { x: 930, y: TOP, o: 1 - take });
      vis(held, { x: thx, y: thy, r: -armT * 0.3, o: take * (1 - gird) });

      /* b3 — He girds Himself */
      const tie = bump(t, 3.05, 3.7);
      /* b4 — the ewer: He pours water into the basin */
      const pourA = es(t, 4.05, 4.25) * (1 - es(t, 4.8, 4.95));
      const tilt = es(t, 4.15, 4.3) * (1 - es(t, 4.75, 4.9));
      const armJ = 30 + reach * 40 + take * (1 - es(t, 3.1, 3.3)) * 30 + tie * -12 + pourA * 12;
      const armBJ = 14 + tie * 30 + fold * 60 + pourA * 20;
      const base = { x: JX, y: SY - (1 - up) * 40, s: 1.02, flip: false, head: 6 + tie * 10 + pourA * 12 - (1 - up) * 4, blink: blinkAt(T), lean: tie * 3 + pourA * 6 };
      jM.set({ ...base, o: rise * (1 - off), armF: 30 + fold * 30, armB: 14 + fold * 60 });
      jT.set({ ...base, o: off * (1 - gird), armF: armT - tie * 12, armB: armBJ });
      jG.set({ ...base, o: gird, armF: armJ, armB: armBJ });
      const tieGlint = bump(t, 3.3, 3.8);
      vis(glint, { x: JX + 26, y: SY - 96, s: 0.3 + tieGlint, r: t * 120, o: tieGlint });

      const [ex, ey] = hand(JX, SY, 1.02, false, armJ, base.lean);
      const jk = es(t, 3.95, 4.1);
      const ang = tilt * 62 * PI / 180;
      vis(jug, { x: ex - 4, y: ey + 40, r: tilt * 62, o: jk * (1 - es(t, 4.93, 5)) });
      const lip = [ex - 4 + 22 * Math.cos(ang) + 46 * Math.sin(ang), ey + 40 + 22 * Math.sin(ang) - 46 * Math.cos(ang)];
      const flow = tilt > 0.6 ? 1 : 0;
      const sl = Math.max(4, TOP - 18 - lip[1]);
      vis(stream, { x: lip[0], y: lip[1], sy: sl / 60, o: flow });
      const lvl = es(t, 4.3, 4.8);
      vis(water, { x: BX, y: TOP - bas.h + 2 + (1 - lvl) * 5, sx: 0.6 + lvl * 0.4, sy: 0.5 + lvl * 0.5, oy: -bas.h + 2, o: lvl > 0.01 ? 1 : 0 });
      vis(drops, { x: BX, y: TOP - bas.h, s: 0.6 + ((t * 3) % 1) * 0.5, o: flow * 0.8 });
      const g2 = bump(t, 4.7, 5.0);
      vis(glint2, { x: BX + 18, y: TOP - 30, s: 0.3 + g2, r: t * 90, o: g2 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.5, -30], [2.0, 30], [3.0, 10], [4.0, 50]]);
      S.cam.y = kf(t, [[0, 120], [0.6, 110], [1.0, 130], [2.0, 150], [3.0, 150], [4.0, 180], [5, 180]]);
      S.cam.z = kf(t, [[0, 1.2], [0.6, 1.35], [1.0, 1.7], [2.0, 1.8], [3.0, 1.95], [4.0, 2.05], [5, 2.05]]);
    };
  },
};
