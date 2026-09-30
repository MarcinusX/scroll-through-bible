// Łk 1,5–7 — the hill country of Judah in the days of King Herod (his crowned medallion comes down). An old priest,
// Zechariah, of the division of Abijah, comes out of his house; then his wife Elizabeth, of the daughters of Aaron.
// Both righteous before God: the tablets of the commandments come down in light and they lift their hands in prayer.
// But they had no child — an empty cradle by the door — and both were old: the sun goes down, they lean on their staffs.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import {
  ZECHARIAH, ELIZABETH, HILLDAY, HILLEVE, hillHome, homeLight, hillFront, HGY, medal, RIM, hungWord, lawTablets, cradle, oldStaff,
  glowDisc, rayBurst, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { LOOK as LOOK6 } from '../mark6/lib.js';

const ZX = 720, EX = 880;

export default {
  id: 'lk1-couple',
  beats: [
    { v: 5, text: 'Za czasów Heroda, króla Judei, żył pewien kapłan, imieniem Zachariasz, z oddziału Abiasza.' },
    { v: 5, cont: true, text: 'Miał on żonę z rodu Aarona, a na imię było jej Elżbieta.' },
    { v: 6 },
    { v: 7 },
  ],
  cam: { x: [-30, 30], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const W = hillHome(S, HILLDAY);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1180, y: -1500, len: 800 });
    const cl = hanging(W.hangL, cloud(c, 170), { x: 480, y: -1500, len: 800 });

    /* ---------- from the flies: King Herod's medallion, the names, the tablets ---------- */
    const tabGlow = S.layer({ par: 0.2, sh: 1, flat: true });
    const fly = S.layer({ par: 0.2, sh: 6 });
    const herod = hanging(fly, medal(S, LOOK6.herod, { r: 50, ...RIM.king, king: true, name: tr('król Herod', 'King Herod'), flip: true }), { x: 960, y: -1500, len: 900 });
    const zName = fly.add(hungWord(c, tr('Zachariasz · kapłan', 'Zacharias · priest'), { size: 22 }));
    const eName = fly.add(hungWord(c, tr('Elżbieta · z rodu Aarona', 'Elizabeth · of Aaron'), { size: 22 }));
    const tGlow = tabGlow.add(`<g>${glowDisc(170, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 50, r1: 200, spread: 0.035, o: 0.4 })}</g>`);
    const tabs = hanging(fly, `<g transform="translate(0 52)">${lawTablets(c, { w: 58, h: 80 })}</g>`, { x: 800, y: -1500, len: 900 });

    /* ---------- the couple ---------- */
    const P = W.P;
    const cr = P.add(`<g>${cradle(c, 84)}</g>`);
    const z = S.puppet(P.add(person(c, ZECHARIAH)));
    const zOld = S.puppet(P.add(person(c, { ...ZECHARIAH, holdF: oldStaff(c, 190, 24) })));
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const eOld = S.puppet(P.add(person(c, { ...ELIZABETH, holdF: oldStaff(c, 180, 24) })));
    const sparks = [0, 1, 2, 3].map((i) => P.add(`<g>${sparkle(c, 10)}</g>`));
    hillFront(S);

    return (t, time) => {
      const T = time;
      /* the day goes down in v7 */
      const eve = es(t, 3.05, 3.7);
      W.sk.blend(HILLDAY, HILLEVE, eve);
      swing(sunEl, 1180, lerp(170, 330, eve), T, 1, 0.7);
      swing(cl, 480 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);
      homeLight(W.H, { open: es(t, 0.3, 0.45) * (1 - es(t, 1.9, 2.1)) + es(t, 3.2, 3.4) * 0.4, lit: eve * 0.8 });

      /* v5a: in the days of Herod … a priest named Zechariah */
      const hk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 1.1, 1.35, ease.in));
      swing(herod, 960, lerp(-1500, 230, hk), T, 1.2, 0.7, 2);
      const zOut = es(t, 0.4, 0.85);
      const zx = lerp(W.H.doorX, ZX, zOut);
      const old = es(t, 3.45, 3.52);
      const pray = es(t, 2.25, 2.55) * (1 - es(t, 3.0, 3.25));
      const look = es(t, 3.3, 3.6);
      z.set({ x: zx, y: HGY, s: 1, flip: false, o: (zOut > 0.001 ? 1 : 0) * (1 - old), walk: zOut > 0 && zOut < 1 ? t * 28 : undefined, armF: 10 + pray * 60 + bump(t, 0.9, 1.3) * 20, armB: 8 + pray * 120, head: -pray * 14 + look * 14, blink: blinkAt(T, 1) });
      zOld.set({ x: ZX - 30, y: HGY, s: 1, flip: false, o: old, armF: 24, armB: 6, head: 14, lean: 5, blink: blinkAt(T, 1) });
      const zk = es(t, 0.7, 0.95, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      pose(zName, { x: ZX - 20, y: lerp(-1100, 330, zk), r: Math.sin(T * 0.8) * 1.2, o: zk > 0.002 ? 1 : 0 });

      /* v5b: his wife Elizabeth, of the daughters of Aaron */
      const eOut = es(t, 1.1, 1.55);
      const ex = lerp(W.H.doorX, EX, eOut);
      e.set({ x: ex, y: HGY, s: 0.96, flip: eOut > 0.9, o: (eOut > 0.001 ? 1 : 0) * (1 - old), walk: eOut > 0 && eOut < 1 ? t * 28 + 1 : undefined, armF: 12 + pray * 60, armB: 8 + pray * 120, head: -pray * 14 + look * 14, blink: blinkAt(T, 3) });
      eOld.set({ x: EX + 30, y: HGY, s: 0.96, flip: true, o: old, armF: 24, armB: 6, head: 14, lean: 6, blink: blinkAt(T, 3) });
      const ek = es(t, 1.4, 1.65, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      pose(eName, { x: EX + 40, y: lerp(-1100, 400, ek), r: Math.sin(T * 0.8 + 1) * 1.2, o: ek > 0.002 ? 1 : 0 });

      /* v6: both righteous before God — the commandments come down in light, they pray */
      const tk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      swing(tabs, 800, lerp(-1500, 300, tk), T, 1, 0.7, 3);
      pose(tGlow, { x: 800, y: 380, s: 0.6 + tk * 0.5, r: t * 4, o: tk });
      sparks.forEach((sp, i) => { const kk = seg(t, 2.4 + i * 0.07, 2.9 + i * 0.07); pose(sp, { x: 800 + Math.cos(i * 1.6) * (70 + kk * 60), y: 380 + Math.sin(i * 1.6) * (40 + kk * 30), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 2.4 + i * 0.07, 2.9 + i * 0.07) }); });

      /* v7: no child — an empty cradle between them; both old */
      const ck = es(t, 3.1, 3.35);
      pose(cr, { x: 800, y: HGY - (1 - ck) * 30, o: ck });

      S.cam.z = 1.03 + es(t, 0.3, 1.0) * 0.03 + es(t, 3.1, 3.6) * 0.03;
      S.cam.y = 20;
      S.cam.x = 0;
    };
  },
};
