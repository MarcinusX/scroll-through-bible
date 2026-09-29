// Łk 2,8–9 — the fields below Bethlehem at night: the moon, the stars, the little town asleep on its ridge. The
// shepherds keep the night watch round their fire, the flock folded beside them; the young one stands with his crook.
// Suddenly an angel of the Lord stands by them and the glory of the Lord shines all round — the night turns to gold,
// light pours from behind the angel — and they are terribly afraid: they fall back, shield their eyes, kneel and
// tremble, the boy hides behind the old man, the sheep crowd together.
import { C, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  fieldSet, FY, flicker, shepherdCast, setShep, SH_AT, flockGroup, ewe, sheepRig, angel, glory, glowDisc, rayBurst,
  hangAt, vpose, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const AX = 1070;          // where the angel stands

export default {
  id: 'lk2-shepherds',
  beats: [
    { v: 8 },
    { v: 9, text: 'Naraz stanął przy nich anioł Pański i chwała Pańska zewsząd ich oświeciła,' },
    { v: 9, cont: true, text: 'tak że bardzo się przestraszyli.' },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const F = fieldSet(S);
    const { P, gloryL } = F;

    /* the flock by the fold, two sheep near the fire */
    const flock = P.add(flockGroup(c, 10, 300, 540, FY - 14, { s: 0.74 }));
    const e1 = sheepRig(P.add(ewe(c, { wool: mix(C.linen, C.indigo, 0.12) })));
    const e2 = sheepRig(P.add(ewe(c, { wool: mix(C.cream, C.indigo, 0.12), lamb: true })), true);

    /* the glory of the Lord (behind everybody) and the angel */
    const gl = gloryL.add(`<g>${glory(c, 520, 22)}</g>`);
    const wide = gloryL.add(`<g>${glowDisc(520, 'warm-glow', 0.9)}</g>`);
    const ang = S.puppet(P.add(angel(c, { robe: C.linen, mantle: C.halo, hair: C.wheat2, skin: C.skin })));
    const SH = shepherdCast(S, P);
    const X = S.layer({ par: 0.34, sh: 5 });
    const sparks = [0, 1, 2, 3, 4, 5].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v8 — shepherds keeping the night watch over their flock */
      hangAt(F.moonEl, 1250, 150, T, 1, 1, 0.5, 1);
      flicker(F.flames, T, 740, FY + 2, 1 - es(t, 1.2, 1.5) * 0.35);
      const look = es(t, 0.3, 0.7) * (1 - es(t, 1.1, 1.3));
      const glow = es(t, 1.05, 1.45);
      const fear = es(t, 2.05, 2.2);
      const tremble = (i) => (t > 2.1 && T ? Math.sin(T * 26 + i * 2) * 1.4 * fear : 0);

      // the young watchman looks out over the flock; then turns to the light
      const turn0 = es(t, 1.05, 1.15);
      setShep(SH[0], { stand: 1 - fear, kneel: fear }, { x: SH_AT[0].x - fear * 30 + tremble(0), y: FY, flip: turn0 < 0.5 ? true : false, armF: 20 + look * 20 + fear * 70, armB: 30 + fear * 120, armBs: 20, head: -look * 4 - glow * 10 + fear * 14, blink: blinkAt(T, 1) });
      setShep(SH[1], { sit: 1 }, { x: SH_AT[1].x - fear * 10 + tremble(1), y: FY, flip: false, armF: 40 + glow * 40 + fear * 60, armB: 20 + fear * 130, head: -glow * 12 + fear * 16, lean: -fear * 10, blink: blinkAt(T, 3) });
      setShep(SH[2], { sit: 1 - fear, kneel: fear }, { x: SH_AT[2].x + fear * 20 + tremble(2), y: FY, flip: glow < 0.5, armF: 30 + fear * 70, armB: 30 + fear * 120, armBs: 20, head: -glow * 10 + fear * 18, blink: blinkAt(T, 5) });
      // the boy dozes, wakes, and hides behind the old man
      const hide = es(t, 2.05, 2.35);
      setShep(SH[3], { sit: 1 - fear, stand: fear }, { x: lerp(SH_AT[3].x, 600, hide) + tremble(3), y: FY + 4, flip: hide > 0.5 ? false : true, walk: hide > 0.02 && hide < 0.98 ? t * 30 : undefined, armF: 30 + glow * 30 + fear * 40, armB: 20 + fear * 60, head: -glow * 12 + fear * 10, blink: blinkAt(T, 7) });
      e1.set({ x: 980, y: FY + 16, s: 0.8, flip: true, head: -glow * 20 + Math.sin(T * 0.6) * 2 });
      e2.set({ y: FY + 18, s: 0.8, flip: fear > 0.5 ? false : true, head: -glow * 24, hop: bump(t, 2.05, 2.3) * 14, x: lerp(1000, 960, fear) });
      pose(flock, { x: 420 - fear * 24, y: 0, sx: 1 - fear * 0.08, ox: 420 });

      /* v9a — an angel of the Lord stands by them; the glory of the Lord shines round them */
      const ak = es(t, 1.0, 1.35, ease.out);
      ang.set({ x: AX, y: lerp(FY - 420, FY, ak), s: 1.12, flip: true, o: es(t, 1.0, 1.15), armF: 30 + ak * 30, armB: 40 + ak * 70, head: -4, blink: blinkAt(T, 2) });
      if (F.gsk) F.gsk.layer.fade(glow);
      F.starL.fade(1 - glow * 0.8);
      pose(gl, { x: AX, y: FY - 170, s: 0.4 + glow * 0.6, r: T * 2, o: glow * 0.45 });
      pose(wide, { x: 780, y: FY - 120, s: 0.5 + glow * 0.5, o: glow * 0.8 });
      sparks.forEach((sp, i) => {
        const k = seg(t, 1.15 + i * 0.05, 1.75 + i * 0.05), a = (i / 6) * PI * 2 + 0.5;
        vpose(sp, { x: AX + Math.cos(a) * (70 + k * 120), y: FY - 170 + Math.sin(a) * (60 + k * 90), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 1.15 + i * 0.05, 1.75 + i * 0.05) });
      });

      S.cam.z = 1.02 + es(t, 0.2, 0.9) * 0.04 - es(t, 1.0, 1.4) * 0.04 + es(t, 2.0, 2.4) * 0.05;
      S.cam.x = lerp(-10, 30, es(t, 0.9, 1.4)) - es(t, 2.0, 2.4) * 10;
      S.cam.y = 20;
    };
  },
};
