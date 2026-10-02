// Mt 27,20–23 — the square. The chief priests and elders go in among the crowd, whispering one name: little grey
// strips that say "Barabbas" fly out over the heads. Pilate asks again — two round portraits, which of the two?
// — and the answer comes back in jagged cries: "Barabbas!" "What then shall I do with Jesus, called the Christ?"
// "Let Him be crucified!": a sea of raised arms, dark cries rising like smoke, the morning sky clouding over.
// Pilate holds up a blank page — what evil has He done? — and they cry out all the more.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, speech, GLYPH, strip, cry, swing, squareSet, squareCast, PLAT, medallion, LOOK, SKIES, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'mt27-choice',
  beats: [
    { v: 20 },
    { v: 21, text: 'Pytał ich namiestnik: «Którego z tych dwóch chcecie, żebym wam uwolnił?»' },
    { v: 21, cont: true, text: 'Odpowiedzieli: «Barabasza».' },
    { v: 22, text: 'Rzekł do nich Piłat: «Cóż więc mam uczynić z Jezusem, którego nazywają Mesjaszem?»' },
    { v: 22, cont: true, text: 'Zawołali wszyscy: «Na krzyż z Nim!»' },
    { v: 23, text: 'Namiestnik odpowiedział: «Cóż właściwie złego uczynił?»' },
    { v: 23, cont: true, text: 'Lecz oni jeszcze głośniej krzyczeli: «Na krzyż z Nim!»' },
  ],
  cam: { x: [-40, 60], y: [-60, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const H = squareSet(S);
    const K = squareCast(S, H);
    const fx = H.fxL;
    const inX = (x, dir) => (S.portrait ? 800 + (x - 800) * 0.4 + dir * 80 : x);   // phone: the crowd's cries drawn together inside the frame (origin = tail tip, the bubble runs away from dir)
    const whispers = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g>${strip(c, tr('Barabasz', 'Barabbas'), { size: 13, fill: C.stone })}</g>`), to: [240, 360, 520, 680, 900, 1120, 1320][i], ty: c.rr(480, 560) }));
    const jesusM = `<circle r="34" fill="url(#halo-glow)"/>${medallion(c, CAST.jesus, { r: 22, rim: C.haloRim })}`;
    const which = fx.add(`<g>${speech(c, `<g transform="translate(-44 0)">${medallion(c, LOOK.barabbas, { r: 22, rim: C.rock3 })}</g><g transform="scale(.9)">${GLYPH.q(c)}</g><g transform="translate(44 0)">${jesusM}</g>`, { w: 150, h: 70, flip: true })}</g>`);
    const what = fx.add(`<g>${speech(c, `<g transform="translate(-16 0)">${jesusM}</g><g transform="translate(26 0) scale(1.1)">${GLYPH.q(c)}</g>`, { w: 104, h: 70, flip: true })}</g>`);
    const blank = sheet().p(c.cut([[-14, -18], [12, -19], [14, 18], [-13, 19]], 0.4, 4), '#fffdf6').x(c.ribbon([[-14, -18], [12, -19]], 1), C.linen2).out();
    const evil = fx.add(`<g>${speech(c, `<g transform="translate(-14 0)">${blank}</g><g transform="translate(18 0)">${GLYPH.q(c)}</g>`, { w: 86, h: 60, flip: true })}</g>`);
    const barCries = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${cry(c, tr('Barabasza!', 'Barabbas!'), { size: 17, dir: i % 2 ? 1 : -1 })}</g>`), m: [3, 9, 16, 24, 6, 13][i] }));
    const cries = Array.from({ length: 12 }, (_, i) => ({ i, el: fx.add(`<g>${cry(c, tr('Na krzyż z Nim!', 'Let him be crucified!'), { size: i < 5 ? 17 : 21, dir: i % 2 ? 1 : -1 })}</g>`), m: [2, 7, 12, 18, 25, 4, 9, 14, 20, 27, 1, 16][i], seed: c.rr(0, 6) }));

    return (t, time) => {
      const T = time;
      const gloom = es(t, 4.0, 4.6) * 0.55 + es(t, 6.0, 6.6) * 0.35;
      H.sk.blend(SKIES.morning, SKIES.grey, gloom);
      swing(H.sunEl, 1230, 150 + gloom * 60, T, 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30 + gloom * 120, 150 + gloom * 20, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30 + gloom * 90, 110 + gloom * 30, T, 1.2, 0.8, 2);
      K.rebels.forEach((r) => r.set({ o: 0 }));
      K.bar.set({ x: H.CELL.x + 2, y: H.CELL.y - 2, s: 0.66, flip: true, armF: 24 + bump(t, 2.05, 2.9) * 50, armB: 14 + bump(t, 2.05, 2.9) * 60, head: -bump(t, 2.05, 2.9) * 8, blink: blinkAt(T, 8) });
      K.sols[0].set({ x: 640, y: PLAT, s: 0.84, flip: false, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      K.sols[1].set({ x: S.portrait ? 1060 : 1110, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });
      K.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4 + es(t, 4.0, 4.3) * 4, blink: blinkAt(T) });
      const a1 = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const a2 = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const a3 = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      K.pil.set({ x: 985, y: PLAT + 2, s: 0.88, flip: true, armF: 20 + a1 * 70 + a2 * 60 + a3 * 50, armB: 10 + a1 * 30 + a2 * 20 + a3 * 70, head: -a1 * 6 - a2 * 4 - a3 * 4 + es(t, 6.2, 6.6) * 8, blink: blinkAt(T, 2) });

      /* v20 — the priests and elders persuade the crowd */
      const walkP = seg(t, 0.05, 0.6);
      K.pr.forEach((m, i) => {
        const x = m.x + walkP * (i ? 320 : 180);
        const whisper = es(t, 0.15, 0.35) * (1 - es(t, 0.95, 1.1));
        const up = es(t, 4.05, 4.3) * 0.7 + es(t, 6.05, 6.3) * 0.3;
        m.p.set({ x, y: m.y, s: 0.96, flip: false, walk: walkP > 0 && walkP < 1 ? x * 0.05 : undefined, armF: 30 + whisper * 60 + up * 70, armB: 12 + whisper * 30 + up * 90, head: -4 + whisper * 6, lean: whisper * 5, blink: blinkAt(T, 7 + i) });
      });
      whispers.forEach((w) => {
        const k = seg(t, 0.2 + w.i * 0.07, 0.6 + w.i * 0.07);
        const src = K.pr[w.i % 2];
        const sx0 = src.x + walkP * (w.i % 2 ? 320 : 180) + 30, sy0 = src.y - 170;
        pose(w.el, { x: lerp(sx0, w.to, k), y: lerp(sy0, w.ty, k) - Math.sin(k * PI) * 60, r: Math.sin(T * 3 + w.i) * 8, o: k > 0 && k < 1 ? Math.min(1, k * 6) : 0 });
      });

      /* the crowd */
      const roar0 = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1) * 0.7);
      const roar1 = es(t, 4.05, 4.3) * (1 - es(t, 4.95, 5.2) * 0.6);
      const roar2 = es(t, 6.05, 6.3);
      K.people.forEach((m) => {
        const up = m.shout ? Math.min(1, roar0 * 0.8 + roar1 + roar2) : (roar1 + roar2) * 0.3;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 20 + up * (70 + (m.seed % 1) * 20), armB: 10 + up * (100 + roar2 * 20), head: -6 - up * 8 + bump(t, 0.3, 1.0) * (m.i % 3 === 0 ? 8 : 0), blink: blinkAt(T, m.seed) });
      });
      barCries.forEach((cr) => {
        const m = K.people[cr.m % K.people.length];
        const k = es(t, 2.08 + cr.i * 0.06, 2.3 + cr.i * 0.06, ease.back) * (1 - es(t, 2.95, 3.05));
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        pose(cr.el, { x: inX(hx, cr.i % 2 ? 1 : -1) + (cr.i % 2 ? -8 : 8), y: hy - 20, s: k * 0.95, r: cr.i % 2 ? 4 : -4, o: k > 0.02 ? 1 : 0 });
      });
      cries.forEach((cr) => {
        const second = cr.i >= 5;
        const k = second ? seg(t, 6.1 + (cr.i - 5) * 0.08, 6.9 + (cr.i - 5) * 0.08) : seg(t, 4.1 + cr.i * 0.1, 5.0 + cr.i * 0.1);
        const m = K.people[cr.m % K.people.length];
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        pose(cr.el, { x: inX(hx, cr.i % 2 ? 1 : -1) + Math.sin(k * 3 + cr.seed) * 20, y: hy - 20 - k * (second ? 200 : 150), s: (0.6 + 0.5 * ease.out(Math.min(1, k * 3))) * (second ? 1.1 : 0.9), r: Math.sin(cr.seed) * 6, o: k > 0 && k < 1 ? Math.min(1, k * 6) * (1 - Math.max(0, k - 0.6) / 0.4) : 0 });
      });

      /* Pilate's questions */
      const [phx, phy] = headAt(985, PLAT + 2, 0.88, true);
      const b1 = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(which, { x: phx - 22, y: phy - 14, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const b2 = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(what, { x: phx - 22, y: phy - 14, s: b2, o: b2 > 0.02 ? 1 : 0 });
      const b3 = es(t, 5.1, 5.35, ease.back) * (1 - es(t, 5.9, 6.05));
      pose(evil, { x: phx - 22, y: phy - 14, s: b3, o: b3 > 0.02 ? 1 : 0 });

      S.cam.x = -es(t, 0, 0.5) * 20 * (1 - es(t, 0.9, 1.2)) + es(t, 0.9, 1.2) * 40 * (1 - es(t, 1.9, 2.2));
      S.cam.y = 20 - es(t, 0.9, 1.2) * 50 * (1 - es(t, 1.9, 2.2)) - es(t, 2.9, 3.2) * 50 * (1 - es(t, 3.9, 4.2)) - es(t, 4.9, 5.2) * 50 * (1 - es(t, 5.9, 6.2)) + es(t, 6.0, 6.5) * 30;
      S.cam.z = 1.02 + es(t, 0.9, 1.2) * 0.06 * (1 - es(t, 1.9, 2.2)) + es(t, 6.0, 6.6) * 0.06;
    };
  },
};
