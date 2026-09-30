// Łk 7,47–50 — "Her sins, which are many, are forgiven, for she loved much": from the woman kneeling at His feet dark
// scraps lift away one after another and burn up into sparks of light, and a great warm heart glows over her. "The one
// who is forgiven little loves little": over Simon hangs a small, pale heart. "Your sins are forgiven," He says to her,
// and she lifts her face into the light. The guests lean together and whisper, question marks over their heads: "Who
// is this, who even forgives sins?" "Your faith has saved you; go in peace": she rises, her hair loose, and walks out
// through the gateway into the evening light while He lifts His hand over her.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { simonRoom, SH, SR7, sinnerHair, scrap, heart, sparkle, bubble, question, headAt, voiceRings, kf, moving, tr, PI } from './lib.js';

const { FLOOR, JX, SEAT } = SH;
const WX = SR7.WX;
const GX = (SH.GATE[0] + SH.GATE[1]) / 2;

export default {
  id: 'lk7-peace',
  beats: [
    { v: 47, text: 'Dlatego powiadam ci: Odpuszczone są jej liczne grzechy, ponieważ bardzo umiłowała.' },
    { v: 47, cont: true, text: 'A ten, komu mało się odpuszcza, mało miłuje».' },
    { v: 48 },
    { v: 49 },
    { v: 50 },
  ],
  cam: { x: [-130, 110], y: [0, 200], z: [0.8, 1.3] },
  build(S) {
    const M = simonRoom(S);
    const { R, c } = M;
    const herGlow = R.glowL.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/></g>`);
    const gateGlow = R.glowL.add(`<g opacity="0"><ellipse rx="120" ry="200" fill="url(#warm-glow)"/></g>`);
    const walker = S.puppet(R.frontL.add(sinnerHair(c, 'stand')));
    const walkHair = walker.el.querySelector('.lhair');
    const scraps = Array.from({ length: 9 }, (_, i) => ({ i, el: R.fx.add(`<g opacity="0">${scrap(c, 11 + (i % 3) * 3)}</g>`), sp: R.fx.add(`<g opacity="0">${sparkle(c, 9, C.halo)}</g>`), dx: c.rr(-40, 40), dy: c.rr(-20, 30) }));
    const big = R.fx.add(`<g opacity="0">${heart(c, 30)}</g>`);
    const small = R.fx.add(`<g opacity="0">${heart(c, 11, mix(C.jesusMantle, C.stone2, 0.5))}</g>`);
    const qs = [0, 1, 2].map(() => R.fx.add(`<g opacity="0">${question(c)}</g>`));
    const jv = voiceRings(R.frontL, c, { n: 3, color: C.sun, r: 30, w: 4 });
    const bF = R.fx.add(`<g opacity="0">${bubble(c, tr('Twoje grzechy są odpuszczone', 'Your sins are forgiven'), { size: 21, dir: 1, fill: C.halo })}</g>`);
    const bW = R.fx.add(`<g opacity="0">${bubble(c, [tr('Któż On jest, że nawet', 'Who is this who even'), tr('grzechy odpuszcza?', 'forgives sins?')], { size: 19, dir: 1 })}</g>`);
    const bP = R.fx.add(`<g opacity="0">${bubble(c, [tr('Twoja wiara cię ocaliła,', 'Your faith has saved you.'), tr('idź w pokoju!', 'Go in peace.')], { size: 20, dir: 1, fill: C.halo })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(t, T, { lit: 1 });
      R.sk2.fade(0.8);
      /* Jesus: turned to the woman; speaks to Simon (v47), to her (v48, v50) */
      const toSimon = t > 1.0 && t < 2.0;
      const bless = es(t, 4.1, 4.3);
      M.jesus.set({ x: JX, y: FLOOR, s: 1.0, flip: !toSimon, armF: 40 + bump(t, 0.1, 0.9) * 30 + bump(t, 2.1, 2.9) * 40 + bless * 45, armB: 10 + bless * 140, head: toSimon ? 4 : 8 - bless * 10, blink: blinkAt(T) });
      pose(M.legs, { x: JX, y: FLOOR, sx: -1 });
      const [jhx, jhy] = headAt(JX, FLOOR, 1.0, !toSimon, 62);
      jv(jhx, jhy, 0.8 * (1 - seg(t, 4.6, 4.8)), T, { dir: toSimon ? 1 : -1, spread: 1.8 });

      /* v47a — her many sins forgiven: the dark scraps lift away and burn into light */
      const up = es(t, 4.14, 4.2);
      const face = es(t, 2.15, 2.35);
      const lean = 28 - face * 26, head = 24 - face * 34;
      M.wHair.set({ x: WX, y: FLOOR, s: 0.98, o: 1 - up, armF: 50 + face * 30, armB: 30 + face * 40, lean, head, blink: face > 0.5 ? blinkAt(T, 6) : 1 });
      pose(M.hairEl, { r: -(lean + head) * 0.8 });
      M.wStand.set({ x: WX, y: FLOOR, o: 0 });
      M.wKneel.set({ x: WX, y: FLOOR, o: 0 });
      pose(M.flask, { x: WX - 64, y: FLOOR + 2 });
      pose(M.sheen, { o: 0.9 });
      const [whx, why] = headAt(WX, FLOOR, 0.98, false, 46);
      scraps.forEach((s) => {
        const a = 0.06 + s.i * 0.07;
        const k = es(t, a, a + 0.5);
        const burn = seg(k, 0.65, 1);
        pose(s.el, { x: whx - 10 + s.dx * (0.4 + k), y: why + 60 + s.dy - k * 170, r: k * 90 * (s.i % 2 ? 1 : -1), s: 1 - burn * 0.6, o: k > 0 && burn < 1 ? 1 - burn : 0 });
        const sk = bump(t, a + 0.3, a + 0.6);
        pose(s.sp, { x: whx - 10 + s.dx * 1.3, y: why + 60 + s.dy - 160, s: sk * 1.2, r: T * 40 + s.i * 30, o: sk });
      });
      const bk = es(t, 0.55, 0.8, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(big, { x: whx + 6, y: why - 90 + (T ? Math.sin(T * 2) * 3 : 0), s: bk * (1 + (T ? Math.sin(T * 3) * 0.05 : 0)), o: bk > 0.02 ? 1 : 0 });
      pose(herGlow, { x: WX, y: FLOOR - 80, s: 1, o: es(t, 0.4, 0.8) * 0.8 * (1 - es(t, 4.2, 4.5)) + face * 0.2 });

      /* v47b — the one forgiven little loves little */
      const [shx, shy] = headAt(SR7.SX, FLOOR, 0.96, true, 62);
      const sk = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 2.9, 3.1));
      pose(small, { x: shx - 30, y: shy - 64, s: sk, o: sk > 0.02 ? 1 : 0 });

      /* v48 — "Your sins are forgiven" */
      const k1 = es(t, 2.08, 2.2, ease.back) * (1 - es(t, 2.92, 2.98));
      pose(bF, { x: jhx - 40, y: jhy - 44, s: k1, o: k1 > 0.02 ? 1 : 0 });

      /* v49 — the guests whisper: who is this? */
      const whisper = es(t, 3.05, 3.2) * (1 - es(t, 3.9, 4.1));
      M.guests.forEach((g) => g.p.set({ x: g.x + (g.i === 1 ? -6 : g.i === 0 ? 8 : -8) * whisper, y: SEAT, s: 0.9, flip: g.i !== 0 || whisper < 0.5, armF: 20 + whisper * (g.i === 1 ? 60 : 30), armB: 10 + whisper * (g.i === 2 ? 90 : 20), head: 6 + whisper * 8, lean: whisper * (g.i === 0 ? -8 : 8), blink: blinkAt(T, g.seed) }));
      M.simon.set({ x: SR7.SX, y: FLOOR, s: 0.96, flip: true, armF: 30 + whisper * 50, armB: 10 + bump(t, 1.1, 1.9) * 40, head: 4 + bump(t, 1.1, 1.9) * 10, lean: -whisper * 4, blink: blinkAt(T, 3) });
      qs.forEach((q, i) => {
        const k = es(t, 3.12 + i * 0.06, 3.26 + i * 0.06, ease.back) * (1 - es(t, 3.92, 4.0));
        const x = SH.GUESTS[i] + 4, y = SEAT - 170 * 0.9 + 62 * 0.9 - 70;
        pose(q, { x, y: y + (T ? Math.sin(T * 2 + i) * 4 : 0), s: k * 0.9, r: T ? Math.sin(T * 1.6 + i) * 8 : 0, o: k > 0.02 ? 1 : 0 });
      });
      const k2 = es(t, 3.18, 3.3, ease.back) * (1 - es(t, 3.92, 3.98));
      pose(bW, { x: SH.GUESTS[1] - 20, y: SEAT - 190, s: k2, o: k2 > 0.02 ? 1 : 0 });

      /* v50 — "Your faith has saved you; go in peace" — she rises and goes out into the evening */
      const WK = [[4.2, WX], [4.9, GX + 10]];
      const wx = kf(t, WK);
      const look = bump(t, 4.2, 4.45);
      walker.set({ x: wx, y: FLOOR, s: 0.98, flip: t > 4.4, o: up * (1 - seg(t, 4.95, 5.0)), walk: moving(t, WK) ? wx * 0.05 : undefined, amt: 0.6, armF: 20 + look * 50, armB: 20 + look * 40, head: -6 - look * 6, blink: blinkAt(T, 6) });
      pose(walkHair, { r: 0 });
      pose(gateGlow, { x: GX, y: FLOOR - 150, s: 1, o: es(t, 4.2, 4.6) * 0.9 });
      const k3 = es(t, 4.06, 4.18, ease.back) * (1 - es(t, 4.55, 4.62));
      pose(bP, { x: jhx - 40, y: jhy - 44, s: k3, o: k3 > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -60], [0.9, -60], [1.2, 30], [1.9, 30], [2.2, -40], [2.9, -40], [3.1, 30], [3.95, 30], [4.2, -50]]);
      S.cam.z = kf(t, [[0, 1.24], [1.2, 1.2], [2.2, 1.26], [3.1, 1.18], [4.2, 1.14]]);
      S.cam.y = kf(t, [[0, 170], [4.2, 150]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 100], [4.1, 100], [4.4, -120]]); S.cam.z = 0.82; }
    };
  },
};
