// Łk 13,10–13 — a synagogue on the Sabbath (Mark 1's, the lamps lit, the people on the stone benches). Jesus stands
// before the ark of the scrolls and teaches. A woman comes in by the side, bent double over her stick, dark cords
// wound round her shoulders; a tag "18 years" hangs over her. She tries to lift her head and cannot. Jesus sees her,
// calls her to Him, and she shuffles into the middle: "Woman, you are set free from your infirmity." He lays His hands
// on her — the cords fall away, the stick drops, and she straightens up, all in one movement, and lifts her arms to
// praise God.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import {
  synSet, BENT, bentWoman, bentHandLocal, bonds, cordBit, stick, HIP, sabbathTag, wordTag, onString, bubble, sparkle, headAt, handF, kf, moving,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const FEET = 742, JX = 820;
const BEND = 62;

export default {
  id: 'lk13-bent',
  beats: [
    { v: 10 },
    { v: 11 },
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-60, 40], y: [100, 140], z: [1.05, 1.18] },
  build(S) {
    const Y = synSet(S);
    const c = S.c;
    const I = Y.I;

    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const glow = glowL.add(`<g opacity="0"><ellipse rx="150" ry="180" fill="url(#halo-glow)"/></g>`);
    const act = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const W = bentWoman(S, act, BENT);
    const bondEl = act.add(`<g><g transform="translate(0 ${HIP})">${bonds(c)}</g></g>`);
    const stickEl = act.add(`<g>${stick(c, 100)}</g>`);
    const up = S.puppet(act.add(person(c, { ...BENT })));
    const bits = [0, 1, 2].map((i) => act.add(`<g opacity="0">${cordBit(c, 46 + i * 8)}</g>`));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const sab = hanging(fx, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 0, y: 0, len: 800 });
    const tag18 = fx.add(`<g>${onString(`<g transform="translate(0 20)">${wordTag(c, tr('18 lat', '18 years'), { size: 24, fill: mix(C.stone, C.cream, 0.5) })}</g>`, 1600)}</g>`);
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Niewiasto, jesteś wolna', 'Woman, you are freed'), tr('od swej niemocy!', 'from your infirmity!')], { size: 20, fill: C.halo, tail: -1 })}</g>`);
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => fx.add(`<g opacity="0">${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    const WK = [[1.0, 300], [1.4, 540], [2.25, 540], [2.6, 650]];

    return (t, time) => {
      const T = time;
      I.flicker(T);
      Y.set(0);
      pose(sab, { x: 1040, y: lerp(-600, 250, es(t, 0, 0.3, ease.out)), r: T ? Math.sin(T * 0.8) * 0.8 : 0, oy: 0 });

      /* v10 — He teaches; v12 — He sees her and calls her; v13 — He lays His hands on her */
      const see = es(t, 2.0, 2.12);
      const call = es(t, 2.1, 2.3) * (1 - es(t, 2.6, 2.8));
      const lay = es(t, 3.0, 3.2) * (1 - es(t, 3.62, 3.8));
      const jx = JX;
      jesus.set({ x: jx, y: FEET, s: 1.06, flip: see > 0.5, armF: 20 + bump(t, 0.1, 0.9) * 40 + call * 60 + lay * 50 + es(t, 3.7, 3.9) * 20, armB: 10 + bump(t, 0.1, 0.9) * 100 + call * 30 + lay * 60, head: -bump(t, 0.1, 0.9) * 6 + lay * 16 - es(t, 3.6, 3.8) * 8, blink: blinkAt(T) });
      const sb = es(t, 2.35, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      const [hx, hy] = headAt(jx, FEET, 1.06, true);
      pose(say, { x: hx - 30, y: hy - 40, s: sb, o: sb > 0.02 ? 1 : 0 });

      /* v11 — the woman comes in bent double; she tries to straighten and cannot */
      const wx = kf(t, WK);
      const walking = moving(t, WK);
      const tryUp = bump(t, 1.45, 1.7) * 12;
      const straight = es(t, 3.25, 3.52, ease.io);
      const bend = (BEND - tryUp) * (1 - straight) + (walking ? Math.abs(Math.sin(wx * 0.06)) * 3 : 0);
      const swapUp = es(t, 3.5, 3.56);
      const wy = FEET - (walking ? Math.abs(Math.sin(wx * 0.06)) * 3 : 0);
      W.set({ x: wx, y: wy, s: 1.05, bend, o: t > 0.98 ? 1 - swapUp : 0 });
      pose(bondEl, { x: wx, y: wy - HIP * 1.05, s: 1.05, r: bend, o: t > 0.98 ? 1 - es(t, 3.2, 3.32) : 0 });
      up.set({ x: wx, y: FEET, s: 1.05, flip: false, armF: 60 + es(t, 3.56, 3.75) * 10, armB: 60 + es(t, 3.56, 3.75) * 105, head: -es(t, 3.56, 3.75) * 14, o: swapUp, blink: blinkAt(T, 2) });
      // her stick in her hand; it falls
      const [lx, ly] = bentHandLocal(62);
      const [shx, shy] = W.at(lx, ly, wx, wy, 1.05, bend);
      const fall = es(t, 3.3, 3.5, ease.in);
      const len = Math.max(20, FEET - shy);
      pose(stickEl, { x: lerp(shx, wx + 70, fall), y: lerp(shy, FEET - 4, fall), sy: len / 100, r: lerp(0, -88, fall), o: t > 0.98 ? 1 - es(t, 3.7, 3.9) : 0 });
      // the cords fall
      bits.forEach((b, i) => {
        const k = es(t, 3.2 + i * 0.04, 3.45 + i * 0.04, ease.in);
        const [bx, by] = W.at(-10 + i * 12, -126 + i * 16, wx, wy, 1.05, BEND * (1 - straight));
        pose(b, { x: bx + (i - 1) * 24 * k, y: lerp(by, FEET - 4 - i * 2, k), r: k * (i % 2 ? 80 : -70), o: es(t, 3.2, 3.22) * (1 - es(t, 3.7, 3.95)) });
      });
      const t18 = es(t, 1.25, 1.5, ease.out) * (1 - es(t, 3.3, 3.5, ease.in));
      pose(tag18, { x: wx + 20, y: lerp(-800, 330, t18) + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.7) * 1.5 : 0 });
      pose(glow, { x: wx + 30, y: FEET - 110, s: 0.5 + es(t, 3.2, 3.6) * 0.6, o: es(t, 3.15, 3.4) * (1 - es(t, 3.9, 4.0) * 0.3) });
      sparks.forEach((sp, i) => { const k = bump(t, 3.45 + i * 0.04, 3.95); const a = (i / 6) * PI * 2; pose(sp, { x: wx + Math.cos(a) * 70, y: FEET - 150 + Math.sin(a) * 60, s: k, r: (T || t * 3) * 60, o: k }); });

      S.cam.x = kf(t, [[0, 0], [1.0, -30], [2.0, -40], [3.0, -30], [4, -30]]);
      S.cam.y = kf(t, [[0, 110], [1.0, 130], [4, 130]]);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.14], [3.0, 1.16], [4, 1.16]]);
      void handF; void shade; void sheet; void seg;
    };
  },
};
