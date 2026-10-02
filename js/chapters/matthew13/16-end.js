// Mt 13,40–43 — the end of the age, as a painted flat over a golden field. The bundles of darnel go into the
// fire as in the parable; so it will be at the end: the sky turns to gold, the Son of Man appears on a cloud in a
// great radiance and sends out His angels. They sweep down over the field and lift out the dark knots hidden
// among the wheat — all that causes stumbling and all lawlessness — and cast them into the glowing furnace at the
// edge of the world, where smoke rises (weeping is told, not shown). Then the righteous standing in the wheat shine
// like the sun, and Jesus calls: he who has ears, let him hear.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cloud, sun, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  stalkRow, darkKnot, darnelBundle, bonfire, firePit, angel, radiance, rayBurst, voiceRings, storyFrame, throng, headAt, kf, arcAt, HARVEST, KINGDOM, PI,
} from './lib.js';
import { makeCutter } from '../../core/paper.js';

const FY = 640;                         // the field's surface
const PITD = [1150, 700];
const KNOTS = [[470, 612], [590, 628], [720, 606], [880, 624], [990, 610], [620, 650], [930, 646]];

export default {
  id: 'mt13-end',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 40 },
    { v: 41 },
    { v: 42 },
    { v: 43, text: 'Wtedy sprawiedliwi jaśnieć będą jak słońce w królestwie Ojca swego.' },
    { v: 43, cont: true, text: 'Kto ma uszy, niechaj słucha!' },
  ],
  cam: { x: [-30, 30], y: [-80, 60], z: [0.94, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the furnace, the fire of the parable and the weeds the angels gather all move inside the screen
    const P = S.portrait;
    const PIT = P ? [1010, 700] : PITD;
    const FIREX = P ? 1000 : 400;
    const sk = sky(S, HARVEST);
    const glowSky = sky(S, KINGDOM, { name: 'kingdom' });
    glowSky.layer.fade(0);
    // the radiance of the Father's Kingdom (never a figure): a great round light, flat, behind everything
    const glory = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    glory.add(`<circle cx="800" cy="200" r="700" fill="url(#halo-glow)" opacity=".8"/><g transform="translate(800 200) scale(1.8)">${radiance(c, 150)}</g>`);
    glory.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 200, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.dawn, 0.3) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(hillsWith(c, { y: 530, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.wheat, 0.25), trees: 14, treeColor: C.sage, treeH: 20 }).markup);

    /* the Son of Man on a cloud, and the angels */
    const heaven = S.layer({ par: 0.12, sh: 6, rise: 0 });
    const cl = heaven.add(`<g>${cloud(c, 260)}</g>`);
    const jesus = S.puppet(heaven.add(person(c, { ...CAST.jesus })));
    const rings = voiceRings(heaven, c, { n: 3, r: 30, color: C.cream });

    /* the field */
    const field = S.layer({ par: 0.45, sh: 4 });
    const top = c.wave(FY, [3, 1.5], [600, 170]);
    field.add(sheet().p(c.ridge(top, -900, 2500, 1700, 12, 1), mix(C.wheat2, C.soil, 0.35)).out());
    const rows = S.layer({ par: 0.45, sh: 3 });
    [FY - 10, FY + 18, FY + 46].forEach((y, i) => rows.add(`<g transform="translate(0 ${y})">${stalkRow('mt13-end-' + i, { x0: -300, x1: 1900, n: 50 + i * 6, h: 96 + i * 10, kind: 'wheat', gold: true })}</g>`));
    const knots = KNOTS.map(([x0, y], i) => ({ i, x: P ? 800 + (x0 - 800) * 0.85 : x0, y, el: rows.add(`<g>${darkKnot(c, 16)}</g>`) }));
    // the fire of the parable at the left, the furnace at the right
    const fireL = S.layer({ par: 0.5, sh: 4 });
    const bundles = [0, 1].map((i) => ({ i, el: fireL.add(`<g>${darnelBundle(c, 80)}</g>`) }));
    const fire = fireL.add(`<g>${bonfire(c, 90)}</g>`);
    const fp = firePit(c, 300);
    const pit = fireL.add(`<g>${fp.pit}</g>`);
    const flames = fp.flames.map((f, i) => ({ ...f, i, el: fireL.add(`<g>${f.m}</g>`) }));
    const smoke = [0, 1, 2, 3].map((i) => ({ i, el: fireL.add(`<path d="${c.cut(c.blob(0, 0, 30, 20, 10, 0.3), 0.8, 4)}" fill="${mix(C.storm, C.stone2, 0.4)}" opacity="0"/>`) }));
    // the righteous standing in the wheat
    const folkL = S.layer({ par: 0.55, sh: 5 });
    const RY = 728;
    const halo = folkL.add(`<g><g transform="translate(0 -100)">${rayBurst(c, { n: 22, r0: 60, r1: 380, spread: 0.05, color: C.halo, o: 0.7 })}</g><ellipse cx="0" cy="-100" rx="300" ry="190" fill="url(#halo-glow)"/></g>`);
    const RIGHT = folkL.sprite(throng('mt13-righteous', 7, { s: 0.92, spread: 58, rows: 2, arms: [20, 60], armB: [10, 40], head: [-10, -2], dy: 22 }), 700, RY);
    const shine = Array.from({ length: 7 }, (_, i) => ({ i, el: folkL.add(`<g><circle r="52" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 20, 7, 8, 0))}" fill="${C.halo}"/></g>`), x: 700 + (i - 3) * 58 + (i % 2) * 20, y: RY - 200 * 0.92 + (i % 2) * 22 }));
    // the angels, in front
    const angL = S.layer({ par: 0.55, sh: 6, rise: 0 });
    const ANG = [0, 1, 2, 3].map((i) => {
      const cc = makeCutter('mt13-angel-' + i);
      return { i, seed: cc.rr(0, 6), p: S.puppet(angL.add(angel(cc, { hair: [C.wheat2, C.hair2, C.ochre, C.hair][i], skin: [C.skin, C.skin2, C.skin, C.skin3][i] }))), knots: [knots[i], knots[(i + 4) % 7]].filter(Boolean) };
    });
    storyFrame(S);

    return (t, time) => {
      const T = time;
      const gold = es(t, 0.5, 0.95);
      glowSky.layer.fade(gold);
      swing(sunEl, 1230, 200 + gold * 80, T, 1, 0.6);
      glory.fade(es(t, 0.95, 1.3) * 0.9 + es(t, 3.0, 3.4) * 0.1);

      /* v40 — the bundles burn, as it will be at the end of the age */
      bundles.forEach((b) => {
        const k = seg(t, 0.05 + b.i * 0.12, 0.4 + b.i * 0.12);
        const [x, y] = arcAt(ease.io(k), [620 + b.i * 120, FY + 10], [FIREX + b.i * 20, 700], 120);
        pose(b.el, { x, y, r: -k * 90, s: 1.1 * (1 - k * 0.3), o: k < 0.98 ? 1 : 0 });
      });
      const burn = es(t, 0.2, 0.5) * (1 - es(t, 1.0, 1.3));
      pose(fire, { x: FIREX, y: 712, s: 0.4 + burn * 0.6, o: burn });

      /* v41 — the Son of Man sends His angels */
      const come = es(t, 0.95, 1.3, ease.out);
      pose(cl, { x: 800, y: lerp(-300, 330, come), o: come > 0.01 ? 1 : 0 });
      const send = bump(t, 1.2, 1.7);
      const call = es(t, 4.05, 4.3);
      jesus.set({ x: 800, y: lerp(-300, 318, come), s: 0.72, armF: 40 + send * 80 + call * 60, armB: 20 + send * 120 + call * 110, head: -4 - call * 6, blink: blinkAt(T), o: come > 0.01 ? 1 : 0 });
      rings(800 + 4, lerp(-300, 318, come) - 167 * 0.72 + 6, call, T, { spread: 3 });
      ANG.forEach((a) => {
        const dive = es(t, 1.3 + a.i * 0.06, 1.7 + a.i * 0.06, ease.out);
        const toPit = es(t, 2.05 + a.i * 0.05, 2.45 + a.i * 0.05);
        const back = es(t, 2.8, 3.1);
        const tx = a.knots[0].x, ty = a.knots[0].y - 40;
        let x = lerp(800 + (a.i - 1.5) * 60, tx, dive), y = lerp(260, ty, dive) - Math.sin(dive * PI) * 80;
        x = lerp(x, P ? PIT[0] - 235 + a.i * 95 : PIT[0] - 250 + a.i * 110, toPit); y = lerp(y, PIT[1] - 210 + (a.i % 2) * 36, toPit) - Math.sin(toPit * PI) * 60;
        x = lerp(x, 800 + (a.i < 2 ? -1 : 1) * (P ? 165 + (a.i % 2) * 115 : 190 + (a.i % 2) * 150), back); y = lerp(y, 300 + (a.i % 2) * 40, back);
        a.x = x; a.y = y;
        a.p.set({ x, y, s: 0.62, flip: x > 800 && toPit < 0.5 ? true : toPit > 0.5 && back < 0.5 ? false : x > 800, armF: 60 + bump(t, 1.7, 2.1) * 60 + toPit * 60 * (1 - back), armB: 40 + toPit * 80 * (1 - back), head: 4, o: es(t, 1.25, 1.35), blink: blinkAt(T, a.seed) });
      });
      knots.forEach((k) => {
        const a = ANG.find((an) => an.knots.includes(k));
        const lift = es(t, 1.6 + a.i * 0.06, 1.9 + a.i * 0.06);
        const drop = seg(t, 2.35 + a.i * 0.05, 2.6 + a.i * 0.05);
        const j = a.knots.indexOf(k);
        const hx = a.x + 30 * 0.62 + j * 14, hy = a.y - 100 * 0.62;
        let x = lerp(k.x, hx, lift), y = lerp(k.y, hy, lift);
        x = lerp(x, PIT[0] - 90 + a.i * 50 + j * 14, drop); y = lerp(y, PIT[1] + 20, ease.in(drop));
        pose(k.el, { x, y, r: T * 20 * lift, s: 1 - drop * 0.5, o: drop < 0.98 ? 1 : 0 });
      });

      /* v42 — the fiery furnace */
      const pitOn = es(t, 1.9, 2.3);
      pose(pit, { x: PIT[0], y: PIT[1], s: 0.8 + pitOn * 0.2, o: pitOn });
      flames.forEach((f) => {
        const k = 1 + Math.sin(T * 8 + f.i * 1.7) * 0.12;
        pose(f.el, { x: PIT[0] + f.x, y: PIT[1] + f.y, sx: 1 / k, sy: k * (0.3 + es(t, 2.3, 2.7) * 0.7) * pitOn, o: pitOn });
      });
      smoke.forEach((sm) => {
        const k = ((T * 0.2 + sm.i / 4) % 1);
        pose(sm.el, { x: PIT[0] + Math.sin(k * 4 + sm.i) * 30, y: PIT[1] - 60 - k * 300, s: 0.6 + k * 1.4, o: es(t, 2.4, 2.8) * (1 - k) * 0.6 * (1 - es(t, 3.0, 3.4) * 0.7) });
      });

      /* v43 — the righteous shine like the sun */
      const sh = es(t, 3.05, 3.4);
      pose(halo, { x: 700, y: RY, s: 0.3 + sh * 0.9, r: T * 2, o: sh });
      shine.forEach((s) => {
        const k = es(t, 3.1 + s.i * 0.03, 3.3 + s.i * 0.03, ease.back);
        pose(s.el, { x: s.x, y: s.y, s: k * (1 + Math.sin(T * 2 + s.i) * 0.06), r: T * 12, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.0], [1.4, 0.98], [2.0, 1.04], [2.6, 1.04], [3.0, 1.02], [4.0, 1.0]]);
      S.cam.y = kf(t, [[0, 40], [0.9, -40], [1.4, -50], [2.0, 20], [2.6, 20], [3.0, 30], [4.0, -40]]);
      S.cam.x = kf(t, [[0, -20], [0.9, 0], [2.0, 20], [2.6, 20], [3.0, -10], [4.0, 0]]);
    };
  },
};
