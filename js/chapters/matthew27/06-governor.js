// Mt 27,11–14 — Pilate's hall in the early morning (Mark 15's hall). The temple guard hands the rope to a Roman
// soldier: Jesus stands before the governor. Pilate on his curule seat asks about the crown; Jesus answers,
// and the light around Him grows. The chief priests and elders accuse Him — dark scraps of paper fly and pile up
// at His feet — and He answers nothing: His eyes close, three quiet dots. Pilate rises and sweeps his hand over the
// heap, "Don't you hear?" — the scraps rise around Him in a fan… and fall away. Not one word: the governor marvels.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, hand, headAt, speech, GLYPH, crown, leader, priest, guard, soldier, pilate, bonds, ropeLine, hallSet, lampSet, PI } from './lib.js';

const JX = 800, JY = 690;

/** a dark scrap of accusation: a slip with a scrawl and a pointing finger */
function accusation(c, i) {
  const w = c.rr(34, 48);
  const s = sheet().p(c.cut([[-w / 2, -9], [w / 2, -10], [w / 2 + 1, 9], [-w / 2 - 1, 10]], 0.6, 6), mix(C.storm2, C.rock3, 0.35));
  let d = '';
  let x = -w / 2 + 5;
  while (x < w / 2 - 7) { const l = c.rr(4, 9); d += c.ribbon([[x, c.rr(-2, 2)], [Math.min(x + l, w / 2 - 5), c.rr(-2, 2)]], 1.8); x += l + 3; }
  s.x(d, C.cream, 'opacity=".65"');
  if (i % 3 === 0) s.x(c.cut([[-6, -3], [8, -3], [14, -1], [8, 1], [-6, 3]], 0.2, 3), C.terracotta);
  return `<g>${s.out()}</g>`;
}

export default {
  id: 'mt27-governor',
  beats: [
    { v: 11, text: 'Jezusa zaś stawiono przed namiestnikiem.' },
    { v: 11, cont: true, text: 'Namiestnik zadał Mu pytanie: «Czy Ty jesteś królem żydowskim?»' },
    { v: 11, cont: true, text: 'Jezus odpowiedział: «Tak, Ja nim jestem».' },
    { v: 12 },
    { v: 13 },
    { v: 14 },
  ],
  cam: { x: [-40, 170], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = hallSet(S);
    const P = H.charL;
    const shine = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const pr = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(i === 1 ? priest(c, 1) : leader(c, i + 1))), x: [470, 560, 650][i], seed: c.rr(0, 9) }));
    const el2 = S.puppet(P.add(leader(c, 5)));
    const gd = S.puppet(P.add(guard(c, 0)));
    const sol = S.puppet(P.add(soldier(c, 0)));
    const sol2 = S.puppet(P.add(soldier(c, 1)));
    const pSit = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const pSt = S.puppet(P.add(pilate(c)));
    const jB = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c) })));
    const jQ = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c), eyes: 'closed' })));
    const fx = H.fxL;
    const rope = fx.add(`<g>${ropeLine(c)}</g>`);
    const slips = Array.from({ length: 14 }, (_, i) => ({ i, el: fx.add(accusation(c, i)), from: i % 3, dx: c.rr(-120, 120), land: c.rr(-2, 12), r0: c.rr(-30, 30), fan: c.rr(0, 1), seed: c.rr(0, 6) }));
    const askB = fx.add(`<g>${speech(c, `<g transform="translate(-12 22) scale(.9)">${crown(c)}</g><g transform="translate(20 2) scale(1.1)">${GLYPH.q(c)}</g>`, { w: 96, h: 64, flip: true })}</g>`);
    const yesB = fx.add(`<g>${speech(c, `<circle r="34" fill="url(#halo-glow)"/><g transform="translate(0 22)">${crown(c)}</g>`, { w: 80, h: 62 })}</g>`);
    const ear = `<path d="${c.cut([[-6, -14], [4, -16], [10, -8], [9, 2], [3, 8], [2, 14], [-4, 14], [-2, 6], [-6, 0]], 0.3, 3)}" fill="${C.skin2}"/><path d="${c.ribbon(c.arc(1, -4, 5, 7, PI * 1.2, PI * 2.3, 8), 1.6)}" fill="${shade(C.skin2, -0.3)}"/>`;
    const ask2 = fx.add(`<g>${speech(c, `<g transform="translate(-14 0)">${ear}</g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 80, h: 56, flip: true })}</g>`);
    const hush = fx.add(`<g><path d="${c.poly(c.circ(-14, 0, 3.4, 8)) + c.poly(c.circ(0, 0, 3.4, 8)) + c.poly(c.circ(14, 0, 3.4, 8))}" fill="${C.inkSoft}" opacity=".6"/></g>`);
    const wow = fx.add(`<g>${speech(c, `<g transform="translate(-10 0) scale(1.1)">${GLYPH.bang(c)}</g><g transform="translate(12 0) scale(1.1)">${GLYPH.bang(c)}</g>`, { w: 62, h: 52, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      H.lamps.forEach((l) => lampSet(l, 0, T));
      pose(H.orb, { x: 680, y: 400 - es(t, 0, 6) * 110 });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.sk.blend(H.pal, ['#b7cbd0', '#efdcc0', '#f6e0c0'], es(t, 0, 6) * 0.6);

      /* v11a — He stands before the governor: the guard hands the rope to a Roman soldier */
      const jK = [[-0.3, [520, JY]], [0.55, [JX, JY]]];
      const [jx, jy] = kf(t, jK);
      const gK = [[-0.3, [380, JY + 2]], [0.55, [660, JY + 2]], [0.75, [660, JY + 2]], [1.0, [330, JY + 6]]];
      const [gx, gy] = kf(t, gK);
      const sK = [[0.3, [1010, JY]], [0.6, [920, JY]]];
      const [sx, sy] = kf(t, sK);
      const handed = es(t, 0.58, 0.66);
      const gArm = 50 - handed * 40;
      gd.set({ x: gx, y: gy, s: 1, flip: t > 0.75, walk: moving(t, gK) ? gx * 0.06 : undefined, armF: gArm, armB: 8, o: 1 - es(t, 0.95, 1.05), blink: blinkAt(T, 3) });
      const sArm = 34 + bump(t, 0.4, 0.7) * 20;
      sol.set({ x: sx, y: sy, s: 1, flip: true, walk: moving(t, sK) ? sx * 0.06 : undefined, armF: sArm, armB: 20 + handed * 20, blink: blinkAt(T, 6) });
      sol2.set({ x: 1340, y: 668, s: 0.98, flip: true, armF: 34, armB: 6, blink: blinkAt(T, 7) });

      /* Pilate: sits and asks; rises for his second question; marvels */
      const rise = es(t, 3.9, 3.98);
      const q1 = es(t, 0.9, 1.3) * (1 - es(t, 2.0, 2.3));
      const wonder = es(t, 5.05, 5.4);
      pSit.set({ x: 1116, y: 566, s: 1, flip: true, o: 1 - rise, armF: 30 + q1 * 50 + bump(t, 0, 0.6) * 20, armB: 10 + q1 * 20, lean: q1 * -6, head: -4 + bump(t, 2.1, 2.9) * 6 - bump(t, 3, 3.8) * 6, blink: blinkAt(T, 1) });
      const sweep = es(t, 4.1, 4.4) * (1 - es(t, 4.9, 5.1));
      pSt.set({ x: 1060, y: 600, s: 1, flip: true, o: rise, armF: 40 + es(t, 4.0, 4.2) * 30 * (1 - sweep) + sweep * 40 - wonder * 30, armB: 10 + sweep * 60 + wonder * 100, lean: -es(t, 4.0, 4.2) * 5 + wonder * 6, head: -wonder * 8, blink: blinkAt(T, 1) });

      /* Jesus */
      const answer = es(t, 2.05, 2.35) * (1 - es(t, 2.95, 3.2));
      const silent = es(t, 3.4, 3.48);
      jB.set({ x: jx, y: jy, s: 1.02, flip: false, o: 1 - silent, walk: moving(t, jK) ? jx * 0.05 : undefined, amt: 0.6, armF: 30, armB: 28, head: 3 - answer * 8 + es(t, 3.05, 3.4) * 5, blink: blinkAt(T) });
      jQ.set({ x: jx, y: jy, s: 1.02, flip: false, o: silent, armF: 30, armB: 28, head: 6 });
      pose(shine, { x: jx + 4, y: jy - 150, s: 0.6 + answer * 0.8 + silent * 0.3, o: answer * 0.9 + silent * 0.45 });
      const [ax, ay] = hand(jx, jy, 1.02, false, 30);
      const [g1, g2] = hand(gx, gy, 1, t > 0.75, gArm);
      const [s1, s2] = hand(sx, sy, 1, true, sArm);
      const bx = lerp(g1, s1, handed), by = lerp(g2, s2, handed);
      const d = Math.hypot(bx - ax, by - ay);
      pose(rope, { x: ax, y: ay, r: (Math.atan2(by - ay, bx - ax) * 180) / PI, sx: d / 100 });

      /* v12 — the chief priests and elders accuse Him */
      const acc = es(t, 3.0, 3.2) * (1 - es(t, 3.9, 4.2));
      pr.forEach((m) => {
        m.p.set({ x: m.x + acc * 50, y: 684 - m.i * 4, s: 0.96, flip: false, armF: 30 + bump(t, 0, 0.8) * 50 + acc * (60 + Math.sin(T * 7 + m.i * 2) * 20), armB: 10 + acc * (40 + m.i * 30), head: -3 + acc * -4, lean: acc * 4, blink: blinkAt(T, m.seed) });
      });
      el2.set({ x: 380, y: 690, s: 0.94, flip: false, armF: 30 + acc * 50, armB: 10 + acc * 30, head: -4, blink: blinkAt(T, 9) });
      /* the scraps fly and pile at His feet; v13 they rise in a fan around Him; v14 they fall away */
      const fanK = es(t, 4.15, 4.5) * (1 - es(t, 5.0, 5.4));
      const fall = es(t, 5.0, 5.6);
      slips.forEach((sl) => {
        const k = seg(t, 3.02 + sl.i * 0.03, 3.3 + sl.i * 0.03);
        const fx0 = pr[sl.from].x + 70, fy0 = 520;
        const lx = JX + sl.dx, ly = 700 + sl.land;
        const x = lerp(fx0, lx, k), y = lerp(fy0, ly, k) - Math.sin(k * PI) * 110;
        const a = (sl.i / slips.length) * PI * 1.1 + PI * 0.95;
        const fxp = JX + Math.cos(a) * (150 + sl.fan * 40), fyp = 520 + Math.sin(a) * (170 + sl.fan * 30);
        pose(sl.el, { x: lerp(x, fxp, fanK) + Math.sin(T * 1.3 + sl.seed) * 3 * fanK, y: lerp(y, fyp, fanK) + fall * 80, r: lerp(sl.r0 + k * 200, sl.r0 * 0.3, fanK) + fall * 40, s: 1 + fanK * 0.15, o: k > 0 ? 1 - fall : 0 });
      });

      /* bubbles */
      const [phx, phy] = headAt(1116, 566, 1, true, 62);
      const b1 = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(askB, { x: phx - 26, y: phy - 20, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const [jhx, jhy] = headAt(jx, jy, 1.02, false);
      const b2 = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(yesB, { x: jhx + 26, y: jhy - 24, s: b2, o: b2 > 0.02 ? 1 : 0 });
      const [p2x, p2y] = headAt(1060, 600, 1, true);
      const b3 = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.95, 5.1));
      pose(ask2, { x: p2x - 24, y: p2y - 22, s: b3, o: b3 > 0.02 ? 1 : 0 });
      const b4 = es(t, 3.5, 3.7) * (1 - es(t, 4.0, 4.1)) + es(t, 5.1, 5.3);
      pose(hush, { x: jhx + 36, y: jhy - 36, o: Math.min(1, b4) });
      const b5 = es(t, 5.3, 5.55, ease.back);
      pose(wow, { x: p2x - 22, y: p2y - 26, s: b5, o: b5 > 0.02 ? 1 : 0 });

      S.cam.x = 30 + es(t, 0.8, 1.3) * 30 - es(t, 2.0, 2.4) * 30 + es(t, 3.95, 4.3) * 30;
      S.cam.z = 1.02 + es(t, 0.6, 1.3) * 0.05 - es(t, 2.9, 3.3) * 0.04 + es(t, 4.9, 5.6) * 0.06;
      S.cam.y = 10 + es(t, 0.6, 1.3) * 20 + es(t, 4.9, 5.6) * 20;
      if (S.portrait) S.cam.x += 70;
    };
  },
};
