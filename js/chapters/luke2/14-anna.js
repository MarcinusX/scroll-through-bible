// Łk 2,36–38 — in the same court sits Anna, a prophetess, very old, bent over her stick: daughter of Phanuel, of the
// tribe of Asher. A round picture opens over her — herself as a young bride beside her husband — and seven beads light
// up for the seven years they had together. Then he fades from the picture; she has been a widow ever since, and the
// number of her years comes down: eighty-four. She never leaves the Temple: the sky goes from day to night and back
// again, twice, the lamp lit and put out, while she kneels in prayer by an empty bowl. And at that very hour she gets
// up, comes over to the Child in Mary's arms, lifts her hands to thank God, and people gather round as she tells them
// about Him — all who were waiting for the redemption of Jerusalem.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import { emptyBowl } from '../mark8/lib.js';
import {
  templeSet, TFLOOR, NIGHT, JOSEPH, MARY, ANNA, ANNA_YOUNG, HUSBAND, inArms, staff, doveCage, cameo, numberCard, placeTag, standLamp,
  pilgrims, speech, baby, glowDisc, hangAt, vpose, kf, moving, sparkle, fade, tr, es, ease, bump, seg, PI,
} from './lib.js';

const FL = TFLOOR;
const AX0 = 980;               // Anna's place by the column
const CX = 880, CY = 280;      // the picture of her youth

export default {
  id: 'lk2-anna',
  beats: [
    { v: 36, text: 'Była tam również prorokini Anna, córka Fanuela z pokolenia Asera, bardzo podeszła w latach.' },
    { v: 36, cont: true, text: 'Od swego panieństwa siedem lat żyła z mężem' },
    { v: 37, text: 'i pozostała wdową. Liczyła już osiemdziesiąty czwarty rok życia.' },
    { v: 37, cont: true, text: 'Nie rozstawała się ze świątynią, służąc Bogu w postach i modlitwach dniem i nocą.' },
    { v: 38 },
  ],
  cam: { x: [-30, 60], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: Anna, her lamp, the sun and the listeners clear of the thread; Mary and Joseph in from the left edge
    const AX = PH ? 940 : AX0, SUNX = PH ? 1000 : 1180;
    const AK = [[4.05, AX], [4.5, 800]];
    const TS = templeSet(S, { sky2: NIGHT, sunAt: [SUNX, 160] });
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const lampG = glowL.add(`<g>${glowDisc(170, 'warm-glow', 1)}</g>`);
    const childG = glowL.add(`<g>${glowDisc(200, 'halo-glow', 1)}</g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const lampEl = P.add(`<g transform="translate(${AX + 110} ${FL + 4})">${standLamp(c, 150)}</g>`);
    const flame = lampEl.querySelector('.flame'), lglow = lampEl.querySelector('.glow');
    fade(lglow, 0);
    P.add(`<g transform="translate(${AX + 50} ${FL + 2})">${emptyBowl(c, 34)}</g>`);
    const listen = P.sprite(pilgrims(c, 4, { s: 0.86, flip: true, dx: 56 }), 1200, FL + 6);
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdF: `<g transform="rotate(-70) translate(0 -4)">${doveCage(c, { w: 50, h: 44 })}</g>` })));
    const mary = S.puppet(P.add(person(c, { ...MARY, holdF: inArms(c) })));
    const sitA = S.puppet(P.add(person(c, { ...ANNA, pose: 'sit' })));
    const knA = S.puppet(P.add(person(c, { ...ANNA, pose: 'kneel' })));
    const stA = S.puppet(P.add(person(c, { ...ANNA, holdB: staff(c, 150, 24) })));

    const X = S.layer({ par: 0.3, sh: 5 });
    const tag = hanging(X, placeTag(c, tr('prorokini Anna, córka Fanuela', 'Anna the prophetess, daughter of Phanuel'), 18), { x: 0, y: 0, len: 600 });
    const tag2 = hanging(X, placeTag(c, tr('z pokolenia Asera', 'of the tribe of Asher'), 16), { x: 0, y: 0, len: 600 });
    const pic = hanging(X, cameo(c, `<g transform="translate(-26 58) scale(.44)">${person(c, { ...ANNA_YOUNG, holdF: '', holdB: '' })}</g>`, { r: 84, rim: C.haloRim, face: mix(C.parchment, C.blushVeil, 0.4) }), { x: 0, y: 0, len: 700 });
    const hus = X.add(`<g>${person(c, { ...HUSBAND, holdF: '', holdB: '' })}</g>`);
    const beads = [0, 1, 2, 3, 4, 5, 6].map((i) => X.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 10, 12), 0.2, 3), C.haloRim).p(c.cut(c.circ(0, 0, 7, 12), 0.2, 3), C.sun).out()}</g>`));
    const n84 = hanging(X, numberCard(c, '84', { size: 46 }), { x: 0, y: 0, len: 700 });
    const tell = X.add(`<g>${speech(c, `<g transform="translate(-8 16) scale(.8)">${baby(c)}</g>`, { w: 96, h: 70 })}</g>`);
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      /* v36a — Anna the prophetess, very old */
      mary.set({ x: PH ? 640 : 560, y: FL, s: 0.95, armF: 70, armB: 30, head: 8 - es(t, 4.4, 4.7) * 6, blink: blinkAt(T, 1) });
      jos.set({ x: PH ? 545 : 440, y: FL + 4, s: 0.95, armF: 60, armB: 20, head: 4, blink: blinkAt(T, 2) });
      const nk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangAt(tag, AX - 40, lerp(-500, 300, nk), T, nk > 0.001 ? 1 : 0, 1.1, 0.9, 1);
      const nk2 = es(t, 0.25, 0.55, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangAt(tag2, AX - 40, lerp(-500, 360, nk2), T, nk2 > 0.001 ? 1 : 0, 1.1, 0.9, 2);

      /* v36b — seven years with her husband */
      const pk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.9, 3.15, ease.in));
      const py = lerp(-560, CY, pk);
      hangAt(pic, CX, py, T, pk > 0.001 ? 1 : 0, 0, 0.8, 3);
      const widow = es(t, 2.05, 2.35);
      vpose(hus, { x: CX + 28, y: py + 58, s: 0.44, sx: -1, o: pk > 0.001 ? 1 - widow : 0 });
      beads.forEach((b, i) => {
        const k = es(t, 1.35 + i * 0.07, 1.45 + i * 0.07, ease.back);
        vpose(b, { x: CX - 90 + i * 30, y: py + 116, s: Math.max(0.001, k), o: pk > 0.001 && k > 0.01 ? 1 : 0 });
      });

      /* v37a — a widow; eighty-four years */
      const k84 = es(t, 2.3, 2.6, ease.out) * (1 - es(t, 2.9, 3.15, ease.in));
      hangAt(n84, 620, lerp(-500, 260, k84), T, k84 > 0.001 ? 1 : 0, 1, 0.8, 4);

      /* v37b — night and day in the Temple, fasting and praying */
      const night = bump(t, 3.0, 3.45) + bump(t, 3.5, 3.95);
      TS.sk2.layer.fade(night * 0.95);
      TS.starL.fade(night);
      hangAt(TS.sunEl, SUNX, 160 + night * 400, T, 1 - night, 1, 0.5, 1);
      hangAt(TS.moonEl, SUNX, 560 - night * 400, T, night, 1, 0.5, 2);
      pose(flame, { x: 0, y: -160, s: night > 0.05 ? 1 + Math.sin(T * 9) * 0.05 : 0.001, o: night > 0.05 ? 1 : 0 });
      pose(lampG, { x: AX + 110, y: FL - 180, o: night * 0.9 });
      const kn = es(t, 3.0, 3.08) * (1 - es(t, 4.0, 4.08));
      const stand = es(t, 4.0, 4.08);
      sitA.set({ x: AX, y: FL, s: 0.9, flip: true, o: 1 - kn - stand, armF: 30, armB: 20 + bump(t, 1.2, 2.8) * 20, head: 10 - pk * 14, blink: blinkAt(T, 5) });
      knA.set({ x: AX, y: FL, s: 0.9, flip: true, o: kn, armF: 60, armB: 150, head: -10, blink: blinkAt(T, 5) });

      /* v38 — at that hour she comes, gives thanks, and speaks of Him */
      const ax = kf(t, AK, ease.sine);
      const thank = es(t, 4.5, 4.7);
      stA.set({ x: ax, y: FL, s: 0.9, flip: true, o: stand, walk: moving(t, AK, 0.3) ? ax * 0.05 : undefined, amt: 0.6, armF: 30 + thank * 100, armB: 24 + thank * 10, head: -thank * 12, blink: blinkAt(T, 5) });
      pose(childG, { x: 600, y: FL - 170, s: 0.6 + thank * 0.5, o: 0.3 + thank * 0.6 });
      const lk = es(t, 4.3, 4.7, ease.out);
      listen.set({ x: lerp(1500, PH ? 890 : 1010, lk), y: FL + 6, o: lk > 0.01 ? 1 : 0 });
      const tk = es(t, 4.6, 4.75, ease.back);
      vpose(tell, { x: ax + 40, y: FL - 200, s: Math.max(0.001, tk), o: tk > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = seg(t, 4.5 + i * 0.05, 4.95 + i * 0.05), a = PI * (1.1 + i * 0.25);
        vpose(sp, { x: ax - 10 + Math.cos(a) * (50 + k * 60), y: FL - 220 + Math.sin(a) * (30 + k * 30), s: 0.8 - k * 0.4, r: t * 90, o: bump(t, 4.5 + i * 0.05, 4.95 + i * 0.05) });
      });

      S.cam.x = kf(t, [[0, 30], [3.9, 30], [4.5, 0]], ease.sine);
      S.cam.y = 10;
      S.cam.z = 1.03 + es(t, 0.0, 0.8) * 0.03 - es(t, 4.0, 4.5) * 0.03;
    };
  },
};
