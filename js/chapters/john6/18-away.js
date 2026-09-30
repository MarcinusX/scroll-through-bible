// J 6,64–67 — evening on the road out of Capernaum. "Some of you do not believe": grey stone hearts show over
// a few of the followers. From the beginning He knew who did not believe and who would hand Him over — the old
// scroll "In the beginning" and a soft shadow that falls across the far end of the Twelve. No one can come unless
// it is given by the Father: a small light comes down into open hands. From then on many turned back and no
// longer walked with Him — they go away down the long road into the sunset, smaller and smaller. He turns to
// the Twelve: "Do you also want to go away?"
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, ROAD, roadS, along, GOLDEN, DUSK, TWELVE, folk, stoneHeart, soulLight, radiance, verseScroll, speech, GLYPH, glowDisc, headAt, hand, kf, tr, PI } from './lib.js';

const JX = 900, JY = 770;

export default {
  id: 'j6-away',
  beats: [
    { v: 64, text: 'Lecz pośród was są tacy, którzy nie wierzą».' },
    { v: 64, cont: true, text: 'Jezus bowiem na początku wiedział, którzy to są, co nie wierzą, i kto miał Go wydać.' },
    { v: 65 },
    { v: 66 },
    { v: 67 },
  ],
  cam: { x: [-20, 90], y: [-30, 40], z: [0.88, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { skyCols: GOLDEN, sunAt: [300, 300] });
    const hiL = S.layer({ par: 0.2, sh: 4 });
    const rad = hiL.add(`<g><circle r="200" fill="url(#halo-glow)"/>${radiance(c, 44)}</g>`);

    // phone: the Twelve stand closer together and the camera looks a little further right, so Judas at the far
    // end (and the shadow over him) is on the screen
    const P = S.portrait;
    const L = S.layer({ par: 0.5, sh: 5 });
    // the followers who will leave (they stand in front, left of the road start)
    const GO = Array.from({ length: 7 }, (_, i) => ({ i, x: P ? 505 + i * 50 + (i % 2) * 8 : 470 + i * 56 + (i % 2) * 10, y: 772 + (i % 2) * 14, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, i % 3 !== 2)))) }));
    // the Twelve round Jesus, on the right; Judas at the far end
    const SP = P ? [[790, 748], [975, 744], [1020, 752], [740, 756], [1065, 748], [690, 750], [1110, 754], [1000, 780], [1042, 784], [1084, 786], [1122, 780], [1156, 770]] : [[790, 748], [990, 744], [1050, 752], [740, 756], [1110, 748], [690, 750], [1160, 754], [1000, 780], [1060, 784], [1120, 786], [1180, 780], [1250, 770]];
    const SCX = P ? 700 : 620;
    const TW = TWELVE.map((m, i) => ({ ...m, i, x: SP[i][0], y: SP[i][1], seed: c.rr(0, 9), p: S.puppet(L.add(person(c, m.o))) }));
    const shId = S.id('shade');
    S.defs(`<radialGradient id="${shId}"><stop offset="0" stop-color="#2a2038" stop-opacity=".55"/><stop offset="1" stop-color="#2a2038" stop-opacity="0"/></radialGradient>`);
    const shadow = L.add(`<g><ellipse rx="80" ry="130" cy="-100" fill="url(#${shId})"/></g>`);
    const jGlow = L.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#6b3f5a"/>`);

    const fx = S.layer({ par: 0.56, sh: 5 });
    const stones = [1, 3, 5].map((gi) => ({ m: GO[gi], el: fx.add(`<g>${stoneHeart(c, 13)}</g>`) }));
    const V = verseScroll(c, tr(['Na początku', 'było Słowo'], ['In the beginning', 'was the Word']), { w: 280, size: 22, title: tr('J 1,1', 'JOHN 1:1') });
    const scrollG = fx.add(`<g>${V.sheet}</g>`);
    const rodT = hanging(fx, V.rodTop, { x: 0, y: 0, len: 900 });
    const rodB = fx.add(`<g>${V.rodBottom}</g>`);
    const gift = fx.add(`<g>${soulLight(c, 10)}</g>`);
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 48, h: 44, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 2.8, 4.8);
      R.sk.blend(GOLDEN, DUSK, dusk * 0.8);
      tint.fade(dusk * 0.12);
      R.update(T, { sunX: 300, sunY: 300 + dusk * 160 });

      /* v64a — some of you do not believe */
      stones.forEach((s, i) => {
        const k = es(t, 0.2 + i * 0.1, 0.4 + i * 0.1, ease.back) * (1 - es(t, 2.9, 3.1));
        pose(s.el, { x: s.m.x + 4, y: s.m.y - 118, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v64b — He knew from the beginning; the one who would hand Him over */
      const sk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.1));
      const un = es(t, 1.3, 1.6);
      pose(rodT, { x: SCX, y: lerp(-500, 170, sk), o: sk > 0.01 ? 1 : 0 });
      pose(scrollG, { x: SCX, y: lerp(-500, 170, sk), sy: Math.max(0.02, un), o: sk > 0.01 ? 1 : 0 });
      pose(rodB, { x: SCX, y: lerp(-500, 170, sk) + V.h * un, o: sk > 0.01 ? 1 : 0 });
      const J = TW[11];
      pose(shadow, { x: J.x, y: J.y, o: es(t, 1.5, 1.8) * (1 - es(t, 2.2, 2.5) * 0.6) });

      /* v65 — unless it is given him by the Father */
      const rk = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      pose(rad, { x: 820, y: 140, s: 0.8, r: T * 3, o: rk });
      const rec = TW[3];
      const [gx, gy] = hand(rec.x, rec.y, 0.94, false, 80);
      const gk = es(t, 2.2, 2.7);
      pose(gift, { x: lerp(820, gx, gk), y: lerp(170, gy - 10, gk), s: 1, o: seg(t, 2.2, 2.25) * (1 - es(t, 3.0, 3.2) * 0.6) });

      /* v66 — many turned back and walked no more with Him */
      GO.forEach((g) => {
        const k = es(t, 3.05 + g.i * 0.08, 3.9 + g.i * 0.05, (u) => u);
        const toRoad = es(k, 0, 0.18);
        const [rx, ry] = along(ROAD, Math.max(0, (k - 0.18) / 0.82) * 0.9);
        const x = lerp(g.x, rx, toRoad), y = lerp(g.y, ry, toRoad);
        const s = lerp(0.94, roadS(ry) * 0.94, toRoad);
        const leaving = k > 0.001 && k < 0.999;
        g.p.set({ x, y, s, flip: k > 0.01, walk: leaving ? (x + y) * 0.1 : undefined, armF: 20 + bump(t, 0.1, 0.9) * 20, armB: 10, head: k > 0.01 ? 4 : -6, o: 1 - es(k, 0.92, 1), blink: blinkAt(T, g.seed) });
      });

      /* v67 — "Do you also want to go away?" */
      const turn = es(t, 4.05, 4.3);
      TW.forEach((m) => {
        const watch = es(t, 3.1, 3.4);
        m.p.set({ x: m.x, y: m.y, s: 0.94, flip: m.x > JX ? true : watch > 0.5 && t < 4.1, armF: 20 + watch * 20, armB: m.i === 3 ? bump(t, 2.2, 3.0) * 60 : 0, head: -watch * 6 + turn * 4, blink: blinkAt(T, m.seed) });
      });
      jesus.set({ x: JX, y: JY, s: 1.08, flip: t > 3.1 && t < 4.05, armF: 20 + bump(t, 0.1, 0.95) * 40 + turn * 50, armB: 10 + turn * 30, head: bump(t, 3.2, 4.0) * 10 - turn * 2, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 130, s: 0.8, o: 0.25 + turn * 0.3 });
      const [jhx, jhy] = headAt(JX, JY, 1.08, false);
      const ak = es(t, 4.1, 4.3, ease.back);
      pose(ask, { x: jhx + 24, y: jhy - 18, s: ak, o: ak > 0.01 ? 1 : 0 });

      S.cam.x = P ? kf(t, [[0, 90], [3.0, 90], [3.8, 30], [4.1, 90]]) : kf(t, [[0, 10], [3.0, 10], [3.8, -20], [4.1, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [3.0, 1.02], [3.9, 1.0], [4.3, 1.08]]) * (P ? 0.88 : 1);
      S.cam.y = kf(t, [[0, 30], [3.0, 20], [3.9, 0], [4.3, 30]]);
    };
  },
};
