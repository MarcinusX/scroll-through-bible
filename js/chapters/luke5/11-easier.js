// Łk 5,22–24 — Jesus turns to the teachers on the bench and sees their thoughts: the storm-clouds over their heads
// drift across to Him. "Why do you reason so in your hearts?" — the clouds sink back into them and settle as dark
// knots at their hearts. "Which is easier to say…?" — over the bed a pair of scales comes down on its string: on one
// pan "Your sins are forgiven", on the other "Rise and walk", and the beam rocks between them. "But that you may
// know that the Son of Man has authority on earth to forgive sins" — He lifts His hand, the light rises behind Him,
// and the beam comes level and shines. Then He turns to the man on the bed: "I tell you, rise, take up your bed and
// go home" — and life runs into the man's limbs in little sparks.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  houseSet, houseCast, HS, JH, BED, matWithMan, FRIENDS, thought, GLYPH, darkKnot, balance, slip, sparkle, rayBurst, voiceRings, headAt, kf,
  DAY, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const AT_HOLE = [HS.HOLE0 - 34, HS.HOLE1 + 34, HS.HOLE0 - 74, HS.HOLE1 + 74];
const ROOFY = HS.ROOF - 2;
const BX = 790, BY = 340, ARM = 110;           // the scales hang here (the pivot)

export default {
  id: 'lk5-easier',
  beats: [
    { v: 22, text: 'Lecz Jezus przejrzał ich myśli i rzekł do nich:' },
    { v: 22, cont: true, text: '«Co za myśli nurtują w sercach waszych?' },
    { v: 23 },
    { v: 24, text: 'Lecz abyście wiedzieli, że Syn Człowieczy ma na ziemi władzę odpuszczania grzechów» -' },
    { v: 24, cont: true, text: 'rzekł do sparaliżowanego: «Mówię ci, wstań, weź swoje łoże i idź do domu!»' },
  ],
  cam: { x: [-360, 140], y: [-60, 120], z: [1, 1.32] },
  build(S) {
    const c = S.c;
    const H = houseSet(S, { skyCols: DAY });
    H.tiles.forEach((tl) => pose(tl.el, { o: 0 }));
    H.laths.forEach((l) => pose(l.el, { o: 0 }));
    const P = houseCast(S, H);
    const glow = H.glowL.add(`<g><circle r="200" fill="url(#warm-glow)"/>${rayBurst(c, { n: 18, r0: 40, r1: 230, spread: 0.04, o: 0.3 })}</g>`);
    const shaft = H.glowL.add(`<path d="M${HS.HOLE0 + 10} ${HS.CEIL}L${HS.HOLE1 - 10} ${HS.CEIL}L${HS.HOLE1 + 60} ${HS.FLOOR}L${HS.HOLE0 - 40} ${HS.FLOOR}Z" fill="#fff3cf" opacity=".4"/>`);
    const bed = H.lowL.add(`<g>${matWithMan(c, { w: 170 })}</g>`);
    pose(bed, { x: BED.x, y: BED.y, s: 0.8 });
    const frL = S.layer({ par: 0.5, sh: 5 });
    const fr = FRIENDS.map((o, i) => ({ i, p: S.puppet(frL.add(person(c, o))), seed: c.rr(0, 9) }));

    const fx = S.layer({ par: 0.5, sh: 4 });
    const clouds = P.scribes.filter((m) => m.i % 2 === 0).map((m, i) => ({ i, m, el: fx.add(`<g>${thought(c, `<g transform="scale(1.1)">${GLYPH.storm(c)}</g>`, { w: 74, h: 56 })}</g>`) }));
    const knots = P.scribes.map((m) => ({ m, el: fx.add(`<g>${darkKnot(c, 11)}</g>`) }));
    const voice = voiceRings(fx, c, { n: 3, color: C.sun, r: 34, w: 5, both: false });
    const life = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 9 + (i % 3) * 3)}</g>`), x: BED.x - 50 + i * 22, y: BED.y - 18 - (i % 2) * 14 }));

    /* the scales */
    const B = balance(c, { arm: ARM, h: 330, drop: 70 });
    const SL = S.layer({ par: 0.5, sh: 6 });
    const beam = SL.add(`<g><path d="M0 -1600V-20" stroke="rgba(74,54,34,.55)" stroke-width="1.4"/>${B.beam}</g>`);
    const panL = SL.add(`<g>${B.pan}<g transform="translate(0 ${B.drop - 16})">${slip(c, tr('«Odpuszczają ci się grzechy»', '“Your sins are forgiven”'), { size: 15 })}</g></g>`);
    const panR = SL.add(`<g>${B.pan}<g transform="translate(0 ${B.drop - 16})">${slip(c, tr('«Wstań i chodź»', '“Arise and walk”'), { size: 15 })}</g></g>`);
    const shine = SL.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      H.idle(T);
      P.crowd(0, 1);
      pose(shaft, { o: 0.7 });
      fr.forEach((f) => {
        const x = AT_HOLE[f.i], flip = x > (HS.HOLE0 + HS.HOLE1) / 2;
        f.p.set({ x, y: ROOFY, s: 0.64, flip, armF: 40, armB: 30, lean: (flip ? 1 : -1) * -14, head: 22, blink: blinkAt(T, f.seed) });
      });

      /* Jesus */
      const see = es(t, 0.05, 0.3);
      const speak = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      const ask = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const auth = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.1));
      const toMan = es(t, 4.05, 4.3);
      P.jesus.set({ x: JH.x, y: HS.FLOOR, s: JH.s, flip: true, armF: 16 + speak * 50 + ask * 40 + toMan * 50, armB: 10 + speak * 20 + ask * 30 + auth * 140, lean: toMan * 10, head: -see * 4 * (1 - toMan) - auth * 6 + toMan * 16, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JH.x, HS.FLOOR, JH.s, true);
      pose(glow, { x: jhx, y: jhy + 40, s: 0.6 + auth * 0.5 + toMan * 0.2, r: T * 3, o: 0.25 + auth * 0.75 + toMan * 0.3 });
      voice(jhx - 16, jhy, speak + ask * 0.6 + toMan * (1 - es(t, 4.8, 4.95)), T, { dir: -1, spread: 2 });

      /* the teachers: their thoughts are seen, then sink into their hearts */
      P.scribes.forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: 0.8, flip: false, armF: 24 + (m.i % 2) * 14 + es(t, 4.1, 4.4) * 20, armB: 14, head: -4 + es(t, 1.1, 1.4) * 10 * (1 - es(t, 2.1, 2.4)) + es(t, 4.1, 4.4) * 8, blink: blinkAt(T, m.seed) });
        fade(m.angry, 1 - es(t, 3.3, 3.8) * 0.6);
      });
      clouds.forEach((cl) => {
        const [sx, sy] = [cl.m.x + 20, cl.m.y - 120];
        const [tx, ty] = [jhx - 110 + cl.i * 40, jhy - 70 - cl.i * 30];
        const go = es(t, 0.1, 0.6);
        const back = es(t, 1.1, 1.5);
        const x = lerp(lerp(sx, tx, go), cl.m.x + 12, back), y = lerp(lerp(sy, ty, go), cl.m.y - 50, back);
        pose(cl.el, { x, y, s: 1 - back * 0.7, o: es(t, 0.0, 0.08) * (1 - es(t, 1.4, 1.5)) });
      });
      knots.forEach((k) => {
        const kk = es(t, 1.35 + k.m.i * 0.05, 1.55 + k.m.i * 0.05, ease.back) * (1 - es(t, 4.2, 4.5) * 0.4);
        pose(k.el, { x: k.m.x + 12, y: k.m.y - 46, s: kk, r: T ? Math.sin(T * 2 + k.m.i) * 10 : 0, o: kk > 0.01 ? 1 : 0 });
      });

      /* v23 — which is easier? the scales rock; v24a — they come level and shine */
      const hang = es(t, 2.02, 2.35, ease.out) * (1 - es(t, 4.1, 4.4, ease.in));
      const rockK = seg(t, 2.3, 3.1);
      const tilt = (rockK > 0 && rockK < 1 ? Math.sin(rockK * PI * 3) * 9 * (1 - rockK * 0.4) : 0) * (1 - es(t, 3.05, 3.3));
      const by = lerp(-420, BY, hang);
      pose(beam, { x: BX, y: by, r: tilt, o: hang > 0.01 ? 1 : 0 });
      const a = (tilt * PI) / 180;
      pose(panL, { x: BX - Math.cos(a) * ARM, y: by - Math.sin(a) * ARM, o: hang > 0.01 ? 1 : 0 });
      pose(panR, { x: BX + Math.cos(a) * ARM, y: by + Math.sin(a) * ARM, o: hang > 0.01 ? 1 : 0 });
      pose(shine, { x: BX, y: by + 50, s: 1 + auth * 0.5, o: auth * hang });

      /* v24b — "rise": life runs into his limbs */
      life.forEach((l) => { const k = bump(t, 4.3 + l.i * 0.05, 4.85 + l.i * 0.05); pose(l.el, { x: l.x, y: l.y - k * 20, s: k, r: T * 60, o: k }); });

      S.cam.x = kf(t, [[0, -60], [0.6, -60], [1.0, -200], [1.9, -220], [2.2, 0], [3.0, 0], [3.3, 40], [4.0, 40], [4.3, 60], [5, 60]]);
      S.cam.y = kf(t, [[0, 0], [1.0, 10], [2.2, -30], [3.0, -30], [4.3, 60], [5, 70]]);
      S.cam.z = kf(t, [[0, 1.16], [1.0, 1.26], [1.9, 1.28], [2.2, 1.16], [3.0, 1.16], [4.3, 1.28], [5, 1.3]]);
    };
  },
};
