// Łk 23,20–22 — the square. Pilate steps forward and speaks to them again, wanting to release Jesus: in his
// bubble a golden key. The answer comes back in jagged dark cries — "Crucify, crucify him!" — a sea of raised
// arms, and the morning sky begins to cloud. A third time: a card with the numeral III comes down beside him; he
// holds up a blank page — what evil has He done? — then the empty, level balance: nothing deserving death; and
// "I will chastise Him and let Him go": a whip, then the key.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { whip } from '../mark10/lib.js';
import { headAt, speech, GLYPH, cry, strip, swing, hanging, noGuilt, keyGlyph, wordCard, squareStage, crowdSet, fitX, frameX, cryW, SKIES, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'lk23-third',
  beats: [
    { v: 20 },
    { v: 21 },
    { v: 22, text: 'Zapytał ich po raz trzeci: «Cóż On złego uczynił?' },
    { v: 22, cont: true, text: 'Nie znalazłem w Nim nic zasługującego na śmierć.' },
    { v: 22, cont: true, text: 'Każę Go więc wychłostać i uwolnię».' },
  ],
  cam: { x: [-40, 120], y: [-60, 80], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const Q = squareStage(S);
    const { H, CELL, PLAT } = Q;
    const fx = H.fxL;
    const release = fx.add(`<g>${speech(c, `<circle r="26" fill="url(#halo-glow)"/><g transform="scale(1.5)">${keyGlyph(c)}</g>`, { w: 72, h: 56 })}</g>`);
    const blank = sheet().p(c.cut([[-14, -18], [12, -19], [14, 18], [-13, 19]], 0.4, 4), '#fffdf6').x(c.ribbon([[-14, -18], [12, -19]], 1), C.linen2).out();
    const what = fx.add(`<g>${speech(c, `<g transform="translate(-14 0)">${blank}</g><g transform="translate(18 0)">${GLYPH.q(c)}</g>`, { w: 86, h: 60 })}</g>`);
    const none = fx.add(`<g>${speech(c, `<g transform="scale(1.7)">${noGuilt(c, 22)}</g>`, { w: 96, h: 70 })}</g>`);
    const letGo = fx.add(`<g>${speech(c, `<g transform="translate(-26 18) rotate(-20) scale(.42)">${whip(c)}</g><path d="${c.ribbon([[-6, 0], [8, 0]], 2.4) + c.poly([[8, -5], [15, 0], [8, 5]])}" fill="${C.inkSoft}"/><g transform="translate(30 0) scale(1.2)">${keyGlyph(c)}</g>`, { w: 104, h: 62 })}</g>`);
    const three = hanging(S.layer({ par: 0.2, sh: 5 }), `${wordCard(c, 'III', { size: 40, w: 90, italic: false })}<g transform="translate(0 92)">${strip(c, tr('po raz trzeci', 'the third time'), { size: 15 })}</g>`, { x: 0, y: -1500, len: 900 });
    const cries = Array.from({ length: 12 }, (_, i) => {
      const txt = i % 3 === 2 ? tr('Ukrzyżuj Go!', 'Crucify him!') : tr('Ukrzyżuj, ukrzyżuj Go!', 'Crucify! Crucify him!'), size = i < 5 ? 18 : 15, dir = i % 2 ? 1 : -1;
      return { i, el: fx.add(`<g>${cry(c, txt, { size, dir })}</g>`), g: [1, 4, 7, 10, 2, 5, 8, 12, 3, 9, 6, 11][i], seed: c.rr(0, 6), dir, w: cryW(txt, size) };
    });

    return (t, time) => {
      const T = time;
      S.cam.x = 30 + es(t, 1.9, 2.3) * 40;
      S.cam.y = -10 + es(t, 1.0, 1.4) * 40 * (1 - es(t, 1.9, 2.3)) - es(t, 1.9, 2.3) * 20;
      S.cam.z = 1.04 + es(t, 0, 0.5) * 0.04 + es(t, 1.9, 2.3) * 0.04 - es(t, 1.0, 1.4) * 0.06 * (1 - es(t, 1.9, 2.3));
      const [flo, fhi] = frameX(S, 0.6);
      const gloom = es(t, 1.05, 1.8) * 0.45 + es(t, 2, 5) * 0.2;
      H.sk.blend(SKIES.morning, SKIES.grey, gloom);
      swing(H.sunEl, 1230, 150 + gloom * 60, T, 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30 + gloom * 140, 150 + gloom * 30, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30 + gloom * 100, 110 + gloom * 30, T, 1.2, 0.8, 2);

      Q.sols[0].set({ x: 640, y: PLAT, s: 0.84, flip: false, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      Q.sols[1].set({ x: S.portrait ? 1065 : 1110, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });
      Q.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 5 + es(t, 1.05, 1.3) * 3, blink: blinkAt(T) });
      Q.rebels.forEach((r, i) => r.set({ x: CELL.x + [-58, 58][i], y: CELL.y - 4, s: 0.6, flip: i === 1, armF: 24, armB: 10, head: 6, blink: blinkAt(T, 3 + i) }));
      Q.bar.set({ x: CELL.x + 2, y: CELL.y - 2, s: 0.66, flip: true, armF: 24, armB: 14, head: 0, blink: blinkAt(T, 8) });
      Q.barFree.set({ x: 0, y: 0, o: 0 });

      /* Pilate */
      const step = es(t, 0.05, 0.35);
      const plead = es(t, 0.1, 0.35) * (1 - es(t, 0.9, 1.1));
      const recoil = bump(t, 1.1, 1.9);
      const blankUp = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.05));
      const px = lerp(965, 925, step);
      Q.pil.set({ x: px, y: PLAT + 2, s: 0.88, flip: true, armF: 20 + plead * 70 + blankUp * 100 + es(t, 3.1, 3.3) * 60 * (1 - es(t, 4.9, 5)), armB: 10 + plead * 50 + recoil * 20, head: -plead * 6 + recoil * 10, lean: -plead * 5 + recoil * 5, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(px, PLAT + 2, 0.88, true);
      const B = (el, a, b) => { const k = es(t, a, a + 0.25, ease.back) * (1 - es(t, b - 0.12, b)); pose(el, { x: phx + 20, y: phy - 16, s: k, o: k > 0.02 ? 1 : 0 }); };
      B(release, 0.1, 1.05); B(what, 2.1, 3.02); B(none, 3.1, 4.02); B(letGo, 4.1, 5.1);
      const tk = es(t, 2.0, 2.35, ease.out) * (1 - es(t, 4.9, 5.2));
      swing(three, S.portrait ? 1000 : 1180, (S.portrait ? 60 : 150) - (1 - tk) * 900, T, 1.2, 0.8, 1);   // phone: the III inside the frame, above Pilate's words

      /* v21 — "Crucify, crucify him!" */
      const roar = es(t, 1.05, 1.15) * (1 - es(t, 2.05, 2.15));
      crowdSet(Q.crowd, roar);
      H.crowdL.shift(T ? Math.sin(T * 26) * 2.5 * roar : 0, 0);
      const mut = es(t, 2.05, 2.3);
      Q.pr.forEach((m, i) => m.p.set({ x: m.x + [120, 240][i], y: m.y, s: 0.96, flip: i === 1, armF: 30 + roar * 70 + mut * 30, armB: 12 + roar * 100 + mut * 20, head: -6, blink: blinkAt(T, 7 + i) }));
      const side = Q.crowd.filter((g) => Math.abs(g.cx - 800) > (S.portrait ? 150 : 330));
      cries.forEach((cr) => {
        const g = side[cr.g % side.length];
        const m = g.members[cr.i % g.members.length];
        const k = seg(t, 1.1 + cr.i * 0.05, 1.95 + cr.i * 0.05);
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        const cs = 0.6 + 0.5 * ease.out(Math.min(1, k * 3));
        pose(cr.el, { x: fitX(S, hx + Math.sin(k * 3 + cr.seed) * 16, cr.w * cs, -cr.dir, flo, fhi), y: hy - 20 - k * 90, s: cs, r: Math.sin(cr.seed) * 6, o: k > 0 && k < 1 ? Math.min(1, k * 6) * (1 - Math.max(0, k - 0.7) / 0.3) : 0 });
      });

    };
  },
};
