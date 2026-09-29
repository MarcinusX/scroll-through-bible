// Mt 10,40–42 — the door of a welcoming house at evening. The host opens to John and embraces him — and behind
// John, in light, stands Jesus: to receive the one is to receive Him; and above Jesus the light of the One who sent
// Him opens (only light). Then an old prophet with his staff comes to the door and is taken in: a crown of light
// comes down over the host; then a plain, upright man, and a second crown comes down, over his wife. Last, by the
// well Andrew sits down, dusty and tired, and the host's little girl carries him a cup of cold water — the cup
// shines, and a star of reward lights up over her.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lightCrown } from '../mark8/lib.js';
import { village, GOLDEN, openHouse, L6, child, radiance, rayBurst, cup, sparkle, staff, kf, moving, hand, headAt, PI } from './lib.js';

const GY = 706, HB = 700;
const HX = 440, HW = 250, HH = 240;
const WX = 1060;                    // the well

export default {
  id: 'mt10-receive',
  beats: [
    { v: 40, text: 'Kto was przyjmuje, Mnie przyjmuje;' },
    { v: 40, cont: true, text: 'a kto Mnie przyjmuje, przyjmuje Tego, który Mnie posłał.' },
    { v: 41, text: 'Kto przyjmuje proroka, jako proroka, nagrodę proroka otrzyma.' },
    { v: 41, cont: true, text: 'Kto przyjmuje sprawiedliwego, jako sprawiedliwego, nagrodę sprawiedliwego otrzyma.' },
    { v: 42 },
  ],
  cam: { x: [-40, 60], y: [-50, 20], z: [1, 1.08] },
  build(S) {
    const V = village(S, { skyCols: GOLDEN, sunAt: [1240, 260] });
    const c = S.c;

    /* the light of the One who sent Him */
    const hv = S.layer({ par: 0.1, sh: 1, flat: true, rise: 0 });
    const sent = hv.add(`<g>${rayBurst(c, { n: 24, r0: 50, r1: 380, spread: 0.035, o: 0.5 })}<circle r="320" fill="url(#halo-glow)"/>${radiance(c, 70)}</g>`);

    /* the house and the well */
    const HL = S.layer({ par: 0.45, sh: 4 });
    const o = openHouse(c, { w: HW, h: HH, dw: 66, dh: 140 });
    HL.add(`<g transform="translate(${HX} ${HB})">${o.inside}</g><g transform="translate(${HX} ${HB})">${o.glow}</g><g transform="translate(${HX} ${HB})">${o.wall}</g>`);
    const DOOR = HX + o.door[0] + 33;
    const well = sheet();
    well.p(c.cut([[WX - 64, GY - 2], [WX - 58, GY - 56], [WX + 58, GY - 56], [WX + 64, GY - 2]], 0.6, 8), C.stone2);
    well.p(c.cut(c.ell(WX, GY - 56, 60, 9, 20), 0.4, 6), shade(C.stone2, 0.15));
    well.p(c.cut(c.rect(WX - 52, GY - 140, 8, 86), 0.3, 5) + c.cut(c.rect(WX + 44, GY - 140, 8, 86), 0.3, 5) + c.cut(c.rect(WX - 58, GY - 146, 116, 10), 0.3, 5), C.wood2);
    HL.add(well.out());

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const jLight = P.add(`<g><ellipse cx="0" cy="-100" rx="110" ry="170" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const HOST = { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather };
    const host = S.puppet(P.add(person(c, HOST)));
    const wife = S.puppet(P.add(person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.cream, veil2: C.linen2, skin: C.skin, beard: 'none' })));
    const john = S.puppet(P.add(person(c, CAST.john)));
    const prophet = S.puppet(P.add(person(c, { ...L6.prophet, holdF: staff(c, 190, 20) })));
    const just = S.puppet(P.add(person(c, { robe: C.linen2, mantle: C.stone2, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, beard: 'short', skin: C.skin3, belt: C.rope })));
    const andrew = S.puppet(P.add(person(c, { ...CAST.andrew, pose: 'sit' })));
    const girl = S.puppet(P.add(person(c, child(c, 1))));

    const fx = S.layer({ par: 0.52, sh: 4 });
    const crowns = [0, 1].map(() => fx.add(`<g>${lightCrown(c, 26)}</g>`));
    const cupEl = fx.add(`<g><circle r="34" fill="url(#warm-glow)"/>${cup(c, C.pot)}</g>`);
    const star = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/>${sparkle(c, 22)}</g>`);
    const stars = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));

    // arrivals walking to the door from the right, then in through it
    const walkIn = (t, a) => kf(t, [[a, 1300], [a + 0.35, DOOR + 110], [a + 0.9, DOOR + 110], [a + 1.05, DOOR + 30]]);
    return (t, time) => {
      const T = time;
      V.update(t, T);

      /* v40a — whoever receives you receives Me */
      const jx = walkIn(t, -0.35);
      john.set({ x: jx, y: GY + 4, s: 0.92, flip: true, o: 1 - es(t, 1.62, 1.7), walk: moving(t, [[-0.35, 1300], [0.0, DOOR + 110]]) ? jx * 0.06 : undefined, armF: 20 + bump(t, 0.1, 0.9) * 70, armB: bump(t, 0.1, 0.9) * 40, blink: blinkAt(T, 1) });
      const hug = bump(t, 0.08, 1.4);
      host.set({ x: DOOR + 40, y: GY, s: 0.92, flip: false, armF: 20 + hug * 70 + bump(t, 2.3, 2.9) * 70 + bump(t, 3.3, 3.9) * 70, armB: 10 + hug * 60 + es(t, 2.4, 2.6) * 60, head: -es(t, 2.4, 2.6) * 8, blink: blinkAt(T, 2) });
      const jOn = es(t, 0.25, 0.5) * (1 - es(t, 1.9, 2.1));
      jesus.set({ x: DOOR + 250, y: GY - 4, s: 1.0, flip: true, o: jOn * 0.9, armF: 30 + jOn * 40, armB: 10 + es(t, 1.05, 1.3) * 130 * (1 - es(t, 1.9, 2.1)), head: -es(t, 1.05, 1.3) * 8, blink: blinkAt(T, 3) });
      pose(jLight, { x: DOOR + 250, y: GY - 4, o: jOn });
      /* v40b — receives the One who sent Me */
      const sk = es(t, 1.05, 1.4) * (1 - es(t, 1.95, 2.2));
      pose(sent, { x: DOOR + 250, y: 170, s: 0.5 + sk * 0.6, r: T * 2, o: sk });
      hv.fade(1);

      /* v41a — a prophet; v41b — a righteous man */
      const px = walkIn(t, 2.0);
      prophet.set({ x: px, y: GY + 4, s: 0.92, flip: true, o: es(t, 2.0, 2.05) * (1 - es(t, 2.95, 3.03)), walk: t > 2.0 && t < 2.35 ? px * 0.06 : undefined, armF: 20, armB: bump(t, 2.3, 2.9) * 60, blink: blinkAt(T, 4) });
      const rx = walkIn(t, 3.0);
      just.set({ x: rx, y: GY + 4, s: 0.9, flip: true, o: es(t, 3.0, 3.05) * (1 - es(t, 3.95, 4.03)), walk: t > 3.0 && t < 3.35 ? rx * 0.06 : undefined, armF: 20 + bump(t, 3.3, 3.9) * 50, blink: blinkAt(T, 5) });
      wife.set({ x: DOOR - 20, y: GY - 6, s: 0.86, flip: false, o: es(t, 2.9, 3.05), armF: 20 + bump(t, 3.1, 3.7) * 70, armB: es(t, 3.4, 3.6) * 60, head: -es(t, 3.4, 3.6) * 8, blink: blinkAt(T, 6) });
      [[DOOR + 40, 0.92, 2.35], [DOOR - 20, 0.86, 3.35]].forEach(([x, s, a], i) => {
        const k = es(t, a, a + 0.3, ease.out);
        const [hx, hy] = headAt(x, GY, s, false);
        pose(crowns[i], { x: hx, y: lerp(-100, hy - 40, k) + Math.sin(T * 1.4 + i) * 3 * k, s: 1, o: k > 0.01 ? 1 - es(t, 4.0, 4.2) * 0.5 : 0 });
      });

      /* v42 — a cup of cold water for one of these little ones */
      const aIn = es(t, 3.85, 4.0);
      andrew.set({ x: WX + 20, y: GY - 34, s: 0.9, flip: true, o: aIn, head: 12 - es(t, 4.4, 4.6) * 16, armF: 30 + es(t, 4.4, 4.6) * 50, armB: 20, blink: blinkAt(T, 7) });
      const gk = es(t, 4.0, 4.4);
      const gx = lerp(DOOR + 30, WX - 70, gk);
      girl.set({ x: gx, y: GY + 4, s: 0.6, flip: false, o: es(t, 3.9, 4.0), walk: gk > 0.01 && gk < 0.99 ? gx * 0.1 : undefined, armF: 70 + es(t, 4.4, 4.6) * 20, blink: blinkAt(T, 8) });
      const [cx, cy] = hand(gx, GY + 4, 0.6, false, 70 + es(t, 4.4, 4.6) * 20);
      pose(cupEl, { x: cx + 4, y: cy - 4, s: 1.4, o: es(t, 3.9, 4.0) });
      const st = es(t, 4.5, 4.75, ease.back);
      pose(star, { x: gx + 10, y: GY - 180 + Math.sin(T * 1.5) * 4, s: st, r: T * 10, o: st > 0.01 ? 1 : 0 });
      stars.forEach((s2, i) => {
        const k = bump(t, 4.5 + i * 0.06, 5.0);
        pose(s2, { x: cx - 20 + i * 22, y: cy - 30 - (i % 2) * 16, s: k, r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, 0], [3.8, 0], [4.1, 50]]);
      S.cam.y = -bump(t, 0.9, 2.2) * 40 + es(t, 3.8, 4.1) * 10;
      S.cam.z = 1.04 + es(t, 3.8, 4.1) * 0.04;
    };
  },
};
