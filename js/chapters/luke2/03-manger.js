// Łk 2,6–7 — Bethlehem at nightfall. Joseph leads the donkey past the inn, whose keeper points them to the cave in
// the rock where the animals are kept; Mary gets down, Joseph lights the lantern on the beam, and her time has come.
// She gives birth to her firstborn Son — a soft light in the straw, the Child in her arms; she wraps Him in bands of
// cloth and lays Him in the manger, the ox and the donkey looking on. Then the view widens: the inn beside the cave
// is full to every window, and its door shuts — there was no room for them there.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  stableSet, ST, JOSEPH, MARY, INNKEEPER, withChild, inArms, newborn, baby, manger, donkeyRide, colt, coltRig, ox, lantern, staff,
  glowDisc, rayBurst, hangAt, vpose, fade, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const F = ST.FLOOR;
const MX = 830;               // the manger
const LX = 870, LY = 440;     // the lantern on the beam
// Joseph leads the donkey from the inn to the cave
const JK = [[0.0, 1480], [0.5, 1170]];

export default {
  id: 'lk2-manger',
  beats: [
    { v: 6 },
    { v: 7, text: 'Porodziła swego pierworodnego Syna,' },
    { v: 7, cont: true, text: 'owinęła Go w pieluszki i położyła w żłobie,' },
    { v: 7, cont: true, text: 'gdyż nie było dla nich miejsca w gospodzie.' },
  ],
  cam: { x: [-30, 130], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const B = stableSet(S, { dusk: true });
    const { A, P, glowL } = B;

    /* the lantern on the beam (dark, then lit) */
    const lamp0 = B.R.add(`<g transform="translate(${LX} ${LY - 28})"><path d="M0 -16V0" stroke="${C.wood2}" stroke-width="2"/>${lantern(c, { col: mix(C.wood3, C.stone2, 0.4) }).replace('class="glow"', 'opacity="0"')}</g>`);
    const lamp1 = B.R.add(`<g><path d="M0 -16V0" stroke="${C.wood2}" stroke-width="2"/>${lantern(c, { col: C.apricot })}</g>`);

    /* the manger, the ox; the light of the birth behind them */
    const birth = glowL.add(`<g>${glowDisc(250, 'halo-glow', 1)}${rayBurst(c, { n: 18, r0: 40, r1: 250, spread: 0.028, color: '#fff3cf', o: 0.22 })}</g>`);
    const lampGlow = glowL.add(`<g>${glowDisc(230, 'warm-glow', 0.9)}</g>`);
    A.add(`<g transform="translate(610 ${F - 2}) scale(.82)">${ox(c)}</g>`);
    A.add(`<g transform="translate(${MX} ${F - 30})">${manger(c)}</g>`);
    const babyM = A.add(`<g>${baby(c)}</g>`);

    /* people and the donkey */
    const ride = donkeyRide(c, { pregnant: true });
    const donkeyR = coltRig(P.add(colt(c, { over: ride.saddle, rider: ride.rider })));
    const donkey = coltRig(A.add(colt(c, {})));
    const keeper = S.puppet(P.add(person(c, { ...INNKEEPER })));
    const jWalk = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const jKneel = S.puppet(P.add(person(c, { ...JOSEPH, pose: 'kneel' })));
    const mStand = S.puppet(P.add(withChild(person(c, { ...MARY }), c)));
    const mNew = S.puppet(P.add(person(c, { ...MARY, pose: 'sit', holdF: inArms(c, 'new') })));
    const mSwad = S.puppet(P.add(person(c, { ...MARY, pose: 'sit', holdF: inArms(c) })));
    const mKneel = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const X = S.layer({ par: 0.34, sh: 5 });
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      /* v6 — night falls; they come to the cave; her time comes */
      if (B.dsk) B.dsk.layer.fade(1 - es(t, 0.0, 0.9));
      B.starL.fade(es(t, 0.3, 1.0));
      const jx = kf(t, JK, ease.sine);
      const walking = moving(t, JK, 0.3);
      const down = es(t, 0.55, 0.62);                   // Mary gets down
      donkeyR.set({ x: jx - 150, y: F + 10, s: 0.9, flip: true, o: 1 - down, walk: walking ? jx * 0.05 : undefined });
      donkey.set({ x: jx - 150, y: F + 10, s: 0.9, flip: true, o: down, nod: -6 });
      const reach = bump(t, 0.6, 0.95);
      const kneel1 = es(t, 1.2, 1.28) * (1 - es(t, 2.0, 2.08));
      jWalk.set({ x: t < 0.55 ? jx - 250 : lerp(jx - 250, 950, es(t, 0.55, 0.7)), y: F, s: 0.95, flip: true, o: 1 - kneel1, walk: walking ? jx * 0.06 : undefined, armF: 40 + reach * 110 - es(t, 2.1, 2.4) * 10, armB: 26, head: -reach * 14 + kneel1 * 10, blink: blinkAt(T, 2) });
      jKneel.set({ x: 950, y: F, s: 0.95, flip: true, o: kneel1, armF: 40, armB: 60, head: 10, blink: blinkAt(T, 2) });
      const kp = bump(t, 0.1, 0.62);
      keeper.set({ x: B.DX, y: F, s: 0.9, flip: true, o: 1 - es(t, 0.62, 0.72), armF: 20 + kp * 70, armB: 10, head: -4, blink: blinkAt(T, 6) });
      const lit = es(t, 0.66, 0.8);
      fade(lamp0, 1 - lit);
      pose(lamp1, { x: LX, y: LY - 28, r: Math.sin(T * 0.7) * 1.5, o: lit });
      pose(lampGlow, { x: LX, y: LY + 30, s: 0.6 + lit * 0.4, o: lit * (0.8 + Math.sin(T * 5) * 0.05) });
      pose(B.warm, { o: lit });

      const walkIn = es(t, 0.6, 0.88);
      const mx = lerp(1020, 760, walkIn);
      const born = es(t, 1.08, 1.15);
      mStand.set({ x: mx, y: F, s: 0.95, flip: true, o: es(t, 0.56, 0.62) * (1 - born), walk: walkIn > 0.01 && walkIn < 0.99 ? mx * 0.06 : undefined, armF: 36, armB: 20 + bump(t, 0.85, 1.1) * 20, head: 6, blink: blinkAt(T, 1) });

      /* v7a — she gives birth to her firstborn Son */
      const glowK = es(t, 1.05, 1.45);
      pose(birth, { x: 790, y: F - 130, s: 0.5 + glowK * 0.35 + es(t, 2.3, 2.7) * 0.1, r: T * 2, o: glowK * (1 - es(t, 3.1, 3.5) * 0.35) });
      const wrap = es(t, 2.08, 2.15);                   // swaddled
      const lay = es(t, 2.28, 2.36);                    // she kneels to lay Him down
      mNew.set({ x: 740, y: F, s: 0.95, o: born * (1 - wrap), armF: 70, armB: 30, head: 12, blink: blinkAt(T, 1) });
      mSwad.set({ x: 740, y: F, s: 0.95, o: wrap * (1 - lay), armF: 70, armB: 30, head: 12, blink: blinkAt(T, 1) });
      sparks.forEach((sp, i) => {
        const k = seg(t, 1.2 + i * 0.05, 1.8 + i * 0.05), a = (i / 5) * PI * 2 + 0.3;
        vpose(sp, { x: 800 + Math.cos(a) * (60 + k * 90), y: F - 150 + Math.sin(a) * (40 + k * 60), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 1.2 + i * 0.05, 1.8 + i * 0.05) });
      });

      /* v7b — wraps Him in bands of cloth and lays Him in the manger */
      const into = es(t, 2.36, 2.62);
      mKneel.set({ x: 736, y: F, s: 0.95, o: lay, armF: 70 - into * 20, armB: 30 + into * 10, head: 12 + into * 4, blink: blinkAt(T, 1) });
      vpose(babyM, { x: lerp(772, MX - 16, into), y: lerp(F - 118, F - 72, into), s: 0.9, r: lerp(-8, 0, into), o: into > 0.001 ? 1 : 0 });

      /* v7c — no room for them in the inn: the inn is full, its door shuts */
      const shut = es(t, 3.15, 3.45);
      pose(B.leaf, { x: B.DX - B.dw / 2, y: F, sx: Math.max(0.1, 0.12 + shut * 0.88), o: 1 });
      pose(B.sign, { x: B.DX, y: F - 200, r: Math.sin(T * 0.9) * 2 + bump(t, 3.3, 3.8) * 6 });
      pose(B.innLit, { o: 0.7 + es(t, 3.0, 3.3) * 0.3 });

      S.cam.x = kf(t, [[0, 110], [0.6, 60], [1.0, 0], [3.0, 0], [3.5, 120]], ease.sine);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.1], [3.0, 1.12], [3.5, 1.0]], ease.sine);
      S.cam.y = kf(t, [[0, 0], [1.0, 30], [3.0, 36], [3.5, -30]], ease.sine);
    };
  },
};
