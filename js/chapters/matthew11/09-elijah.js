// Mt 11,14–15 — the Jordan again, late in the afternoon, the place where Elijah was taken up. "He is Elijah who is to
// come": at Jesus' word John appears in a golden light on the bank; the chariot of fire with its horses of flame sweeps
// across the sky, and Elijah's mantle comes fluttering down from it onto John's shoulders. "He who has ears to hear,
// let him hear": the vision fades; Jesus cups His hand to His ear — some in the crowd lean in and do the same, and
// two turn their backs and walk off.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { riverSet, JOHN_B, L9, throng, earGlyph, headAt, voiceRings, kf, moving, manOf, womanOf, PI } from './lib.js';

const GY = 752, JX = 780;
const MANTLE = shade(C.clay, -0.08);

/** a horse of fire, galloping to the right (origin: its belly) */
function fireHorse(c, col = C.sunDeep) {
  const s = sheet();
  s.p(c.cut([[-60, -10], [-40, -30], [20, -32], [44, -26], [60, -50], [76, -70], [96, -72], [100, -60], [84, -50], [70, -26], [62, -8], [40, 2], [-40, 4], [-62, 0]], 0.8, 6), col);
  s.p(c.cut([[-50, 0], [-80, 30], [-74, 36], [-40, 6]], 0.4, 4) + c.cut([[-30, 2], [-40, 44], [-32, 46], [-20, 4]], 0.4, 4) + c.cut([[34, 0], [60, 34], [66, 30], [44, -4]], 0.4, 4) + c.cut([[46, -6], [84, 10], [86, 4], [52, -14]], 0.4, 4), shade(col, -0.1));
  let mane = '';
  for (let i = 0; i < 6; i++) { const x = 50 + i * 6, y = -40 - i * 5; mane += c.cut([[x, y], [x - 24 - i * 3, y - 14 + i], [x - 8, y + 6]], 0.3, 3); }
  mane += c.cut([[-60, -14], [-110, -40], [-96, -16], [-120, -8], [-62, 0]], 0.6, 4);
  s.p(mane, C.lampFlame);
  s.x(c.poly(c.circ(88, -64, 2.2, 6)), C.ink);
  return s.out();
}
/** the chariot of fire with Elijah in it (origin: the axle) */
function chariot(c) {
  const s = sheet();
  let fl = '';
  for (let i = 0; i < 7; i++) { const x = -70 + i * 16; fl += c.cut([[x, -40], [x - 20, -90 - (i % 3) * 18], [x + 10, -56], [x + 16, -40]], 0.4, 4); }
  s.p(fl, C.apricot);
  s.p(c.cut([[-70, -44], [40, -44], [52, -10], [-62, -6]], 0.6, 6), C.sunDeep);
  s.p(c.cut(c.circ(-10, 0, 34, 20), 0.5, 5), C.sun);
  let sp = '';
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI; sp += c.ribbon([[-10 - Math.cos(a) * 30, -Math.sin(a) * 30], [-10 + Math.cos(a) * 30, Math.sin(a) * 30]], 3); }
  s.x(sp, C.sunRay);
  s.p(c.cut(c.circ(-10, 0, 8, 10), 0.3, 3), C.sunRay);
  return `<circle r="150" fill="url(#warm-glow)"/>${`<g transform="translate(-20 -40) scale(.6)">${person(c, { ...L9.elijah, mantle: null })}</g>`}${s.out()}`;
}
/** Elijah's mantle, fluttering (origin: its top centre) */
function mantle(c) {
  return sheet().p(c.cut([[-30, 0], [30, -4], [40, 30], [30, 70], [8, 64], [-10, 76], [-36, 60], [-40, 26]], 0.8, 5), MANTLE).x(c.ribbon([[-14, 6], [-20, 64]], 2.4) + c.ribbon([[14, 4], [16, 60]], 2.4), shade(MANTLE, 0.2), 'opacity=".7"').out();
}

export default {
  id: 'mt11-elijah',
  beats: [
    { v: 14 },
    { v: 15 },
  ],
  cam: { x: [-40, 80], y: [-60, 40], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const JNX = PH ? 1030 : 1080;   // phone: John and the listeners inside the screen
    const skL = S.layer({ par: 0, sky: true });
    const skyId = S.id('sky');
    S.defs(`<linearGradient id="${skyId}" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="700"><stop offset="0" stop-color="#b9b3cc"/><stop offset=".55" stop-color="#efcfae"/><stop offset="1" stop-color="#f6dcb4"/></linearGradient>`);
    skL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${skyId})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const R = riverSet(S, { sunAt: [1260, 250], sunR: 42 });
    const W = R.riverLayer();
    R.waterFront(W);

    /* the chariot in the sky */
    const skyL = S.layer({ par: 0.1, sh: 5 });
    const horses = [0, 1].map((i) => skyL.add(`<g>${fireHorse(c, i ? C.sunDeep : C.apricot)}</g>`));
    const car = skyL.add(`<g>${chariot(c)}</g>`);
    const reins = skyL.add(`<path d="M0 0L140 -10" stroke="${C.sunRay}" stroke-width="3" fill="none"/>`);

    /* the near bank: crowd, listeners, John in a vision, Jesus */
    const { N } = R.nearBank();
    N.sprite(throng(makeCutter('mt11-el-a'), 5, { s: 0.8, rows: 2, spread: 44 }), 300, GY + 4);
    const act = S.layer({ par: 0.45, sh: 5 });
    const vision = act.add(`<g><circle r="170" fill="url(#halo-glow)"/><circle r="260" fill="url(#warm-glow)" opacity=".7"/></g>`);
    const john = S.puppet(act.add(person(c, JOHN_B)));
    const johnM = S.puppet(act.add(person(c, { ...JOHN_B, mantle: MANTLE })));
    const cloak = act.add(`<g>${mantle(c)}</g>`);
    const LIS = [manOf(c, { robe: C.dustyBlue }), womanOf(c, { robe: C.roseRobe }), manOf(c, { robe: C.sageRobe, mantle: C.ochre })].map((o, i) => ({ i, x: PH ? 525 + i * 62 : 490 + i * 75, p: S.puppet(act.add(person(c, o))) }));
    const AWAY = [manOf(c, { robe: C.stone, mantle: C.teal2 }), manOf(c, { robe: C.wheatRobe })].map((o, i) => ({ i, x: (PH ? 440 : 380) + i * 60, p: S.puppet(act.add(person(c, o))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const ears = [0, 1, 2].map((i) => act.add(`<g>${earGlyph(c, 20 + (i === 1 ? 6 : 0), [C.skin2, C.skin, C.skin3][i])}</g>`));

    return (t, time) => {
      const T = time;
      R.update(t, T);

      /* v14 — "he is Elijah": the vision of John, the chariot, the mantle */
      const vis = es(t, 0.05, 0.25) * (1 - es(t, 1.0, 1.2));
      // phone: the chariot's path runs CSH further left, so at the pause it is not under the progress thread
      const CSH = PH ? 90 : 0;
      const [cx0, cy] = kf(t, [[0.02, [1680, 600]], [0.4, [1260, 450]], [0.75, [1020, 390]], [1.1, [720, 290]]], (u) => u), cx = cx0 - CSH;
      const onSky = t > 0.02 && t < 1.2 ? 1 : 0;
      const gal = T ? Math.sin(T * 14) : 0;
      const CS = 1.25;
      pose(car, { x: cx, y: cy, sx: -CS, sy: CS, r: -gal * 2 + 8, o: onSky });
      horses.forEach((h, i) => pose(h, { x: cx - (170 + i * 30) * CS, y: cy - (40 + i * 16) * CS + gal * 4 * (i ? -1 : 1), r: 20 - gal * 5, sx: -CS * 0.9, sy: CS * 0.9, o: onSky }));
      pose(reins, { x: cx - 10 * CS, y: cy - 60 * CS, sx: -CS, sy: CS, r: 14, o: onSky });
      // the mantle drops from the chariot as it passes over John, and settles on him
      const drop = seg(t, 0.38, 0.62);
      const [jhx, jhy] = headAt(JNX, GY, 1.0, true);
      const mx = lerp(1230 - CSH, jhx + 4, drop) + Math.sin(drop * 9) * 30 * (1 - drop), my = lerp(480, jhy + 14, ease.io(drop));
      const settled = es(t, 0.6, 0.64);
      pose(cloak, { x: mx, y: my, r: Math.sin(drop * 7) * 30 * (1 - drop), s: 0.9, o: drop > 0 ? (1 - settled) * vis : 0 });
      john.set({ x: JNX, y: GY, s: 1.0, flip: true, armF: 20 + bump(t, 0.3, 0.7) * 40, armB: 20 + es(t, 0.3, 0.5) * 60 * (1 - settled), head: -10 * (1 - settled), o: vis * (1 - settled), blink: blinkAt(T, 2) });
      johnM.set({ x: JNX, y: GY, s: 1.0, flip: true, armF: 30, armB: 30, head: 4, o: vis * settled, blink: blinkAt(T, 2) });
      pose(vision, { x: JNX, y: GY - 110, s: 0.8 + vis * 0.3 + settled * 0.2, o: vis });

      /* Jesus: speaks of John (points to him), then "let him hear" */
      const speak = es(t, 0.02, 0.15);
      const pointJ = es(t, 0.15, 0.3) * (1 - es(t, 0.95, 1.05));
      const earK = es(t, 1.1, 1.3);
      jesus.set({ x: JX, y: GY, s: 1.06, flip: earK > 0.5, armF: 20 + pointJ * 70 + earK * 30, armB: 10 + earK * 150, head: -earK * 6, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, earK > 0.5);
      voice(hx, hy, speak * 0.8, T, { dir: earK > 0.5 ? -1 : 1, spread: 2.2 });

      /* v15 — listeners cup their ears; two walk away */
      LIS.forEach((l) => {
        const k = es(t, 1.25 + l.i * 0.08, 1.45 + l.i * 0.08);
        l.p.set({ x: l.x + k * 20, y: GY + 4 + (l.i % 2) * 8, s: 0.94, armF: 20, armB: 20 + k * 150, head: -k * 4, lean: k * 8, blink: blinkAt(T, l.i + 4) });
        const [ex, ey] = headAt(l.x + k * 20, GY + 4 + (l.i % 2) * 8, 0.94);
        const ek = es(t, 1.35 + l.i * 0.08, 1.5 + l.i * 0.08, ease.back);
        pose(ears[l.i], { x: ex - 6, y: ey - 58, s: ek, r: T ? Math.sin(T * 2 + l.i) * 6 : 0, o: ek > 0.02 ? 1 : 0 });
      });
      AWAY.forEach((a) => {
        const K = [[1.3 + a.i * 0.08, a.x], [1.9, a.x - 500]];
        const x = kf(t, K, (u) => u);
        const going = t > 1.3 + a.i * 0.08;
        a.p.set({ x, y: GY + 10 + a.i * 8, s: 0.94, flip: going, walk: moving(t, K) ? x * 0.05 : undefined, armF: 16, armB: 10, head: going ? 6 : 0, blink: blinkAt(T, a.i + 8), o: 1 - seg(t, 1.8, 1.9) });
      });

      S.cam.y = kf(t, [[0, -40], [0.8, -40], [1.1, 30]]);
      S.cam.x = kf(t, [[0, 40], [0.8, 40], [1.1, 0]]);
      S.cam.z = kf(t, [[0, 1.1], [0.8, 1.1], [1.1, 1.2]]);
    };
  },
};
