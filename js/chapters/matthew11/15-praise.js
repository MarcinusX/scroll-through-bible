// Mt 11,25–26 — a meadow in the golden late afternoon. On the left two learned scribes pore over their open scrolls;
// on the right a band of children and simple village people. Jesus stands between them and lifts His eyes and hands:
// "I thank you, Father, Lord of heaven and earth" — high above, the Father's light opens (never a figure): rays over
// the sky and a glow over the whole land. "You hid these things from the wise and understanding": a grey cloud comes
// down between the light and the scribes, and they frown into their scrolls; "and revealed them to infants": a shaft
// of light falls on the children, little lights settle in their hands and they lift them up. "Yes, Father": He bows,
// hand on His heart, and the children skip for joy.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillsSet, scribe, scrollOpen, fatherLight, rayBurst, lightShaft, soulLight, heart, kid, kidHead, manOf, womanOf, headAt, hand, GOLDEN, HEAVEN, PI } from './lib.js';

const GY = 736, JX = 800;
const SCR0 = [[430, 0], [540, 1]];
const KIDS0 = [[980, 0], [1050, 5], [1120, 2], [1190, 3]];
const LX = 800, LY = 110;          // the Father's light

export default {
  id: 'mt11-praise',
  beats: [
    { v: 25, text: 'W owym czasie Jezus przemówił tymi słowami:' },
    { v: 25, cont: true, text: '«Wysławiam Cię, Ojcze, Panie nieba i ziemi,' },
    { v: 25, cont: true, text: 'że zakryłeś te rzeczy przed mądrymi i roztropnymi, a objawiłeś je prostaczkom.' },
    { v: 26 },
  ],
  cam: { x: [-40, 40], y: [-140, 40], z: [1, 1.3] },
  build(S) {
    // phone: the wise and the little ones inside the screen
    const SCR = S.portrait ? [[505, 0], [605, 1]] : SCR0;
    const KIDS = S.portrait ? [[900, 0], [960, 5], [1020, 2], [1080, 3]] : KIDS0;
    const SHX = S.portrait ? 990 : 1085;
    const H = hillsSet(S, { skyCols: GOLDEN, sky2: HEAVEN, sunAt: [1300, 300], gy: GY - 30, midY: 540 });
    const c = H.c;

    /* the light from above */
    const heaven = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
    const rays = heaven.add(`<g>${rayBurst(c, { n: 24, r0: 60, r1: 1100, spread: 0.035, color: '#fff3cf', o: 0.6 })}</g>`);
    const glowLand = heaven.add(`<g><ellipse rx="1100" ry="260" fill="url(#warm-glow)"/></g>`);
    const lightL = S.layer({ par: 0.06, sh: 4, rise: 0 });
    const fl = lightL.add(`<g>${fatherLight(c, 56)}</g>`);

    /* the veil over the wise, the shaft on the little ones */
    const veilL = S.layer({ par: 0.45, sh: 5 });
    const veil = veilL.add(`<g>${cloud(makeCutter('mt11-veil'), 300, mix(C.stone2, C.storm, 0.25), mix(C.storm2, C.stone2, 0.4))}</g>`);
    const shade_ = veilL.add(`<g><ellipse rx="170" ry="120" fill="${mix(C.storm2, C.plumRobe, 0.2)}" opacity=".22"/></g>`);
    const shaftL = S.layer({ par: 0.45, sh: 0, flat: true });
    const shaft = shaftL.add(`<g>${lightShaft(c, { w0: 40, w1: 190, h: 900, o: 0.45 })}</g>`);

    /* people */
    const act = S.layer({ par: 0.45, sh: 5 });
    const wise = SCR.map(([x, i]) => ({ i, x, p: S.puppet(act.add(scribe(c, i, { holdF: `<g transform="translate(8 4) rotate(${-90})">${scrollOpen(c, 70, 46)}</g>` }))) }));
    const folk = [womanOf(c, { robe: C.sageRobe }), manOf(c, { robe: C.wheatRobe, belt: C.rope })].map((o, i) => ({ i, x: [1250, 1320][i], p: S.puppet(act.add(person(c, o))) }));
    const kids = KIDS.map(([x, look], i) => ({ i, x, p: S.puppet(act.add(kid(c, look))) }));
    const lights = KIDS.map(() => act.add(`<g>${soulLight(c, 9)}</g>`));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const hrt = act.add(`<g><circle r="46" fill="url(#warm-glow)"/>${heart(c, 13)}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T, { o: 1 - es(t, 1.0, 1.4) * 0.6 });

      /* v25a — He lifts His eyes and hands */
      const lift = es(t, 0.1, 0.4);
      const bow = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: GY, s: 1.06, flip: t > 2.1 && t < 2.5, armF: 20 + lift * 70 * (1 - bow) + bow * 20 + bump(t, 2.15, 2.55) * 40, armB: 10 + lift * 140 * (1 - bow) + bow * 70, head: -lift * 18 * (1 - bow) + bow * 14, blink: blinkAt(T) });
      const hk = bow;
      pose(hrt, { x: JX + 12, y: GY - 120 * 1.06, s: 0.4 + hk * 0.7 + (T ? Math.sin(T * 4) * 0.04 * hk : 0), o: hk });

      /* v25b — the Father's light */
      const open = es(t, 1.05, 1.4);
      H.sk2.fade(open);
      pose(fl, { x: LX, y: LY, s: 0.4 + open * 0.8, r: T ? T * 2 : 0, o: open > 0.01 ? 1 : 0 });
      pose(rays, { x: LX, y: LY, s: 0.5 + open * 0.6, r: T ? T * 1.5 : 0, o: open });
      pose(glowLand, { x: 800, y: 560, o: open * 0.8 });

      /* v25c — hidden from the wise, revealed to the little ones */
      const vk = es(t, 2.05, 2.35, ease.out);
      const cx = (SCR[0][0] + SCR[1][0]) / 2;
      pose(veil, { x: cx, y: lerp(-500, 470, vk), s: 1, o: vk > 0.01 ? 1 : 0 });
      pose(shade_, { x: cx, y: GY - 110, o: vk });
      const puzzled = es(t, 2.3, 2.5);
      wise.forEach((w) => w.p.set({ x: w.x, y: GY + w.i * 6, s: 0.96, flip: false, armF: 70, armB: 20 + puzzled * 60, head: 16 + puzzled * 6, lean: 4, blink: blinkAt(T, w.i + 2) }));
      const sk = es(t, 2.3, 2.55);
      pose(shaft, { x: SHX, y: GY + 4, sx: 0.3 + sk * 0.7, o: sk });
      const skip = (i) => (T ? Math.abs(Math.sin(T * 5 + i * 1.3)) : 0.5) * bow;
      kids.forEach((k) => {
        const up = es(t, 2.45 + k.i * 0.04, 2.65 + k.i * 0.04);
        const y = GY + 6 + (k.i % 2) * 8 - skip(k.i) * 16;
        k.p.set({ x: k.x, y, s: 0.66, flip: true, armF: 30 + up * 110, armB: 20 + up * 130, head: -up * 12, blink: blinkAt(T, k.i + 4) });
        const [hx, hy] = hand(k.x, y, 0.66, true, 30 + up * 110);
        const lk = es(t, 2.35 + k.i * 0.05, 2.55 + k.i * 0.05);
        pose(lights[k.i], { x: lerp(k.x, hx, lk), y: lerp(200, hy - 10, lk), s: lk, o: lk });
      });
      folk.forEach((f) => f.p.set({ x: f.x, y: GY + 4 + f.i * 6, s: 0.94, flip: true, armF: 20 + sk * 50, armB: 10 + sk * 70, head: -sk * 12, blink: blinkAt(T, f.i + 9) }));

      S.cam.y = lerp(20, -110, es(t, 1.0, 1.35)) + es(t, 1.95, 2.3) * 110;
      S.cam.z = 1.1 - es(t, 1.0, 1.35) * 0.06 + es(t, 1.95, 2.3) * 0.06;
    };
  },
};
