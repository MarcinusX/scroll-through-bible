// Mk 15,12–15 — "Crucify him!" The crowd becomes a sea of raised arms; dark jagged cries rise like smoke
// and the morning sky clouds over. Pilate holds up a blank page (what evil has He done?) — they cry louder.
// To please the crowd he frees Barabbas: the barred door swings open, the chains fall, the crowd parts.
// Then the soldiers take Jesus, and a dark curtain is lowered over Him; only the shadow of a column shows on it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, speech, GLYPH, crown, cry, hanging, swing, squareSet, squareCast, PLAT, SKIES, PI } from './lib.js';

const JX = 800;

export default {
  id: 'm15-crucify',
  beats: [
    { v: 12 },
    { v: 13 },
    { v: 14, text: 'Piłat odparł: «Cóż więc złego uczynił?»' },
    { v: 14, cont: true, text: 'Lecz oni jeszcze głośniej krzyczeli: «Ukrzyżuj Go!»' },
    { v: 15, text: 'Wtedy Piłat, chcąc zadowolić tłum, uwolnił Barabasza,' },
    { v: 15, cont: true, text: 'Jezusa zaś kazał ubiczować i wydał na ukrzyżowanie.' },
  ],
  cam: { x: [-40, 420], y: [-60, 100], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const H = squareSet(S);
    const K = squareCast(S, H);
    const { CELL } = H;

    /* the curtain lowered over the platform, with a column's shadow on it */
    const curL = S.layer({ par: 0.32, sh: 6 });
    const CW = 430, CH = 300;
    const cs = sheet();
    const pts = [[-CW / 2, 0], [CW / 2, 0], [CW / 2, CH]];
    for (let x = CW / 2; x > -CW / 2; x -= 36) pts.push(...c.arc(x - 18, CH, 18, 12, 0, PI, 5));
    cs.p(c.cut(pts, 0.8, 8), mix(C.plumRobe, C.storm2, 0.55));
    let folds = '';
    for (let x = -CW / 2 + 30; x < CW / 2; x += 46) folds += c.ribbon([[x, 4], [x + c.rr(-4, 4), CH - 6]], c.rr(6, 12));
    cs.x(folds, shade(mix(C.plumRobe, C.storm2, 0.55), -0.25), 'opacity=".5"');
    cs.p(c.ribbon([[-CW / 2 - 8, 2], [CW / 2 + 8, 2]], 8), C.wood2);
    const colSh = `<path d="${c.poly([[-22, 30], [22, 30], [26, 44], [18, 44], [18, CH - 30], [26, CH - 24], [-26, CH - 24], [-18, CH - 30], [-18, 44], [-26, 44]])}" fill="#2a2030" opacity=".45"/>`;
    const curtainEl = hanging(curL, `${cs.out()}<g transform="translate(40 0)">${colSh}</g>`, { x: JX, y: 160, len: 900 });

    const fx = H.fxL;
    const askB = fx.add(`<g>${speech(c, `<g transform="translate(-16 22) scale(.9)">${crown(c)}</g><g transform="translate(20 2) scale(1.1)">${GLYPH.q(c)}</g>`, { w: 98, h: 62, flip: true })}</g>`);
    const blank = sheet().p(c.cut([[-14, -18], [12, -19], [14, 18], [-13, 19]], 0.4, 4), '#fffdf6').x(c.ribbon([[-14, -18], [12, -19]], 1), C.linen2).out();
    const whatB = fx.add(`<g>${speech(c, `<g transform="translate(-14 0)">${blank}</g><g transform="translate(18 0)">${GLYPH.q(c)}</g>`, { w: 86, h: 60, flip: true })}</g>`);
    const cries = Array.from({ length: 12 }, (_, i) => ({ i, el: fx.add(`<g>${cry(c, tr('Ukrzyżuj Go!', 'Crucify him!'), { size: i < 5 ? 17 : 21, dir: i % 2 ? 1 : -1 })}</g>`), m: [2, 7, 12, 18, 25, 4, 9, 14, 20, 27, 1, 16][i], seed: c.rr(0, 6) }));
    const chains = [0, 1].map(() => fx.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [8, 10], [18, 4], 8), 3)}" fill="${C.rock3}"/></g>`));

    return (t, time) => {
      const T = time;
      /* the sky clouds over as the cries rise */
      const gloom = es(t, 1.0, 1.6) * 0.5 + es(t, 3.0, 3.6) * 0.35 + es(t, 5.0, 5.8) * 0.15;
      H.sk.blend(SKIES.morning, SKIES.grey, gloom);
      swing(H.sunEl, 1230, 150 + gloom * 60, T * (1 - gloom * 0.5), 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30 + gloom * 120, 150 + gloom * 20, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30 + gloom * 90, 110 + gloom * 30, T, 1.2, 0.8, 2);

      /* platform */
      const take = es(t, 5.05, 5.35);
      K.sols[0].set({ x: 640 + take * 100, y: PLAT, s: 0.84, flip: false, walk: take > 0 && take < 1 ? take * 12 : undefined, armF: 34 + take * 20, armB: 8 + take * 50, blink: blinkAt(T, 4) });
      K.sols[1].set({ x: (S.portrait ? 1045 : 1110) - take * 200, y: PLAT, s: 0.84, flip: true, walk: take > 0 && take < 1 ? take * 12 : undefined, armF: 34, armB: 8 + take * 60, blink: blinkAt(T, 5) });
      K.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4 + es(t, 1.0, 1.3) * 4 + take * 4, blink: blinkAt(T) });
      const ask = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const open = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const give = es(t, 4.05, 4.35) * (1 - es(t, 4.9, 5.1));
      const away = es(t, 5.3, 5.5);
      K.pil.set({ x: 985 + away * 30, y: PLAT + 2, s: 0.88, flip: away < 0.5, armF: 20 + ask * 70 + open * 50 + give * 60, armB: 10 + ask * 20 + open * 70 + give * 20, head: -ask * 6 + open * -4 + give * 8 + away * 10, lean: give * 5, blink: blinkAt(T, 2) });

      /* the crowd */
      const roar1 = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.2) * 0.6);
      const roar2 = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.3) * 0.7);
      const part = es(t, 4.2, 4.55);
      K.people.forEach((m) => {
        const up = m.shout ? Math.min(1, roar1 + roar2) : roar1 * 0.3;
        const jitter = 0;
        // phone: the camera pans far (par .3 cell vs .55 crowd), so the crowd parts where Barabbas appears on the screen, not over the cell's world x
        const PC = S.portrait ? CELL.x + 135 : CELL.x + 40, PR = S.portrait ? 150 : 130;
        const near = Math.abs(m.x - PC) < PR ? (m.x < PC ? -1 : 1) : 0;
        m.p.set({
          x: m.x + near * part * 150, y: m.y, s: m.s, flip: m.flip,
          armF: 20 + up * (70 + (m.seed % 1) * 20) + jitter, armB: 10 + up * (100 + roar2 * 20) - jitter,
          head: -6 - up * 8, blink: blinkAt(T, m.seed),
        });
      });
      K.pr.forEach((m, i) => {
        const up = roar1 * 0.7 + roar2;
        m.p.set({ x: m.x + [180, 320][i], y: m.y, s: 0.96, flip: i === 1, armF: 30 + up * 70, armB: 12 + up * 90, head: -6, blink: blinkAt(T, 7 + i) });
      });
      // cries rise like dark smoke
      cries.forEach((cr) => {
        const second = cr.i >= 5;
        const k = second ? seg(t, 3.1 + (cr.i - 5) * 0.08, 3.9 + (cr.i - 5) * 0.08) : seg(t, 1.1 + cr.i * 0.1, 2.0 + cr.i * 0.1);
        const m = K.people[cr.m % K.people.length];
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        const cs = (0.6 + 0.5 * ease.out(Math.min(1, k * 3))) * (second ? 1.1 : 0.9);
        let cx0 = hx + Math.sin(k * 3 + cr.seed) * 20;
        if (S.portrait) {   // phone: keep the whole cry inside the frame and off the thread (origin is the tail tip, the bubble sits to one side)
          const sz = cr.i < 5 ? 17 : 21, ww = 12 * sz * 0.46 + sz * 1.7, off = -(cr.i % 2 ? 1 : -1) * (ww / 2 - 18) * cs, hw = (ww / 2) * 1.2 * cs;
          cx0 = Math.max(465 + hw, Math.min(1085 - hw, cx0 + off)) - off;
        }
        pose(cr.el, { x: cx0, y: hy - 20 - k * (second ? 200 : 150), s: cs, r: Math.sin(cr.seed) * 6, o: k > 0 && k < 1 ? Math.min(1, k * 6) * (1 - Math.max(0, k - 0.6) / 0.4) : 0 });
      });
      H.crowdL.shift(Math.sin(t * 40) * 3 * roar2, 0);

      /* bubbles */
      const [phx, phy] = headAt(985, PLAT + 2, 0.88, true);
      const a1 = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 0.9, 1.05));
      pose(askB, { x: phx - 22, y: phy - 14, s: a1, o: a1 > 0.02 ? 1 : 0 });
      const a2 = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(whatB, { x: phx - 22, y: phy - 14, s: a2, o: a2 > 0.02 ? 1 : 0 });

      /* v15a — Barabbas goes free */
      const opened = es(t, 4.1, 4.35);
      pose(H.door, { x: CELL.x - CELL.w / 2, y: 0, sx: 1 - opened * 0.8, ox: CELL.x - CELL.w / 2 });
      const bK = [[4.3, [CELL.x + 2, CELL.y - 2]], [4.85, [CELL.x + 40, CELL.y + 90]]];
      const [bx, by] = kf(t, bK);
      const free = es(t, 4.75, 4.95);
      K.bar.set({ x: bx, y: by, s: 0.66 + es(t, 4.3, 4.85) * 0.2, flip: false, walk: moving(t, bK) ? bx * 0.08 : undefined, armF: 24 + free * 90, armB: 14 + free * 120, head: -free * 10, blink: blinkAt(T, 8) });
      K.rebels.forEach((r, i) => r.set({ x: CELL.x + [-58, 58][i], y: CELL.y - 4, s: 0.6, flip: i === 1, armF: 24, armB: 10, head: 6 + bump(t, 4.3, 5) * 8, blink: blinkAt(T, 3 + i) }));
      chains.forEach((ch, i) => {
        const k = es(t, 4.75, 5.0, ease.in);
        pose(ch, { x: bx + 20 + i * 14, y: by - 70 + k * 64, r: k * (i ? 80 : -60), o: free > 0.02 ? 1 - es(t, 5.4, 5.6) : 0 });
      });

      /* v15b — the curtain comes down over Him */
      const down = es(t, 5.25, 5.75, ease.out);
      swing(curtainEl, JX, 160 - (1 - down) * 520, T * down, 0.4, 0.5);

      S.cam.x = es(t, 4.0, 4.4) * (S.portrait ? 400 : 160) * (1 - es(t, 4.95, 5.3));   // phone: Barabbas walks out of a cell that is otherwise under the thread
      S.cam.y = -20 + es(t, 1.0, 1.4) * 40 * (1 - es(t, 2.0, 2.3)) + es(t, 3.0, 3.4) * 60 * (1 - es(t, 4.0, 4.3)) + es(t, 4.0, 4.4) * 80 * (1 - es(t, 4.95, 5.3)) - es(t, 5.1, 5.6) * 30;
      S.cam.z = 1.02 + es(t, 4.0, 4.4) * 0.16 * (1 - es(t, 4.95, 5.3)) + es(t, 5.1, 5.7) * 0.08;
    };
  },
};
