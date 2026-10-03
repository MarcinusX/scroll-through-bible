// Łk 23,23–25 — the square under a clouding sky. They press on with loud cries, demanding that He be crucified:
// raised arms, dark jagged cries rising like smoke — and the cries grow, bigger and darker, until they fill the
// sky; Pilate puts a hand to his brow. He gives sentence as they ask: a decree is sealed with his red seal. He
// releases the one they asked for: the barred door swings open, the chains fall, and Barabbas walks out through
// the crowd. And he hands Jesus over to their will: the soldiers step to Him, and a dark curtain is lowered over
// the platform — only the shadow of a column shows on it.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, hand, headAt, cry, strip, swing, hanging, sealedScroll, waxSeal, squareStage, crowdSet, fitX, frameX, cryW, SKIES, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'lk23-handed',
  beats: [
    { v: 23, text: 'Lecz oni nalegali z wielkim wrzaskiem, domagając się, aby Go ukrzyżowano;' },
    { v: 23, cont: true, text: 'i wzmagały się ich krzyki.' },
    { v: 24 },
    { v: 25, text: 'Uwolnił im tego, którego się domagali, a który za rozruch i zabójstwo był wtrącony do więzienia;' },
    { v: 25, cont: true, text: 'Jezusa zaś zdał na ich wolę.' },
  ],
  cam: { x: [-40, 420], y: [-60, 110], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const Q = squareStage(S, { pal: SKIES.grey });
    const { H, CELL, PLAT } = Q;
    const fx = H.fxL;

    /* the curtain lowered over the platform, with a column's shadow on it (Mark 15's) */
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
    const curtainEl = hanging(curL, `${cs.out()}<g transform="translate(40 0)">${colSh}</g>`, { x: JX, y: -1500, len: 900 });

    const cries = Array.from({ length: 16 }, (_, i) => ({ i, txt: i % 3 === 1 ? tr('Ukrzyżuj Go!', 'Crucify him!') : i % 3 === 2 ? tr('Na krzyż!', 'Crucify!') : tr('Ukrzyżuj, ukrzyżuj!', 'Crucify! Crucify!'), size: i < 8 ? 16 : 22, dir: i % 2 ? 1 : -1 })).map(({ i, txt, size, dir }) => ({ i, el: fx.add(`<g>${cry(c, txt, { size, dir })}</g>`), dir, w: cryW(txt, size), g: [1, 4, 7, 10, 2, 5, 8, 12, 3, 9, 6, 11, 0, 13, 14, 15][i], seed: c.rr(0, 6), hx: [0, 0, 0, 0, 0, 0, 0, 0, 480, 1380, 600, 1040, 500, 1250, 700, 910][i], hy: [0, 0, 0, 0, 0, 0, 0, 0, 300, 300, 150, 120, 220, 200, 100, 90][i] }));
    const decree = fx.add(`<g><circle r="70" fill="url(#halo-glow)" opacity=".4"/>${sealedScroll(c, 84)}<g class="seal" transform="translate(28 8)">${waxSeal(c, 16, 'eagle')}</g></g>`);
    const sealEl = decree.querySelector('.seal');
    const chains = [0, 1].map(() => fx.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [8, 10], [18, 4], 8), 3)}" fill="${C.rock3}"/></g>`));
    const freeTag = fx.add(`<g>${strip(c, tr('uwolniony', 'released'), { size: 16 })}</g>`);

    return (t, time) => {
      const T = time;
      S.cam.x = es(t, 2.9, 3.3) * (S.portrait ? 400 : 160) * (1 - es(t, 3.95, 4.3));
      S.cam.y = -30 + es(t, 0.9, 1.3) * -30 * (1 - es(t, 1.95, 2.3)) + es(t, 2.9, 3.3) * 110 * (1 - es(t, 3.95, 4.3));
      S.cam.z = 1.0 + es(t, 2.9, 3.3) * 0.16 * (1 - es(t, 3.95, 4.3)) + es(t, 4.1, 4.6) * 0.06;
      const [flo, fhi] = frameX(S, 0.6);
      const gloom = 0.3 + es(t, 0, 2) * 0.5;
      H.sk.blend(SKIES.morning, SKIES.grey, gloom);
      swing(H.sunEl, 1230, 220 + gloom * 60, T * 0.5, 1, 0.6);
      swing(H.cl1, 560 + Math.sin(T * 0.1) * 30 + gloom * 80, 150, T, 1.2, 0.6, 1);
      swing(H.cl2, 1150 + Math.sin(T * 0.12 + 2) * 30, 130, T, 1.2, 0.8, 2);

      /* the crowd presses; then parts for Barabbas */
      const roar = es(t, 0.05, 0.15) * (1 - es(t, 2.05, 2.15));
      const part = es(t, 3.05, 3.4);
      crowdSet(Q.crowd, roar, (g) => (g.ri >= 1 && Math.abs(g.cx - (CELL.x + 40)) < 240 ? Math.sign(g.cx - CELL.x - 39) * 230 * part : 0));
      H.crowdL.shift(T ? Math.sin(T * 26) * (2 + es(t, 1, 1.3) * 3) * roar : 0, 0);
      Q.pr.forEach((m, i) => m.p.set({ x: m.x + [120, 240][i], y: m.y, s: 0.96, flip: i === 1, armF: 30 + roar * 70, armB: 12 + roar * 100 + bump(t, 4.1, 4.9) * 40, head: -6, blink: blinkAt(T, 7 + i) }));
      cries.forEach((cr) => {
        const big = cr.i >= 8;
        const k = big ? seg(t, 1.05 + (cr.i - 8) * 0.06, 1.95 + (cr.i - 8) * 0.06) : seg(t, 0.08 + cr.i * 0.07, 1.0 + cr.i * 0.07);
        const side = Q.crowd.filter((g) => Math.abs(g.cx - 800) > (S.portrait ? 150 : 330));
        const g = side[cr.g % side.length], m = g.members[0];
        const [mx, my] = headAt(m.x, m.y, m.s, m.flip);
        const x = big ? lerp(mx, cr.hx, ease.out(k)) : mx + Math.sin(k * 3 + cr.seed) * 16;
        const y = big ? lerp(my - 30, cr.hy, ease.out(k)) : my - 20 - k * 90;
        const o = k > 0 && k < 1 ? Math.min(1, k * 6) * (big ? 1 - Math.max(0, k - 0.85) / 0.15 : 1 - Math.max(0, k - 0.7) / 0.3) : 0;
        const cs = big ? 0.7 + k * 0.5 : 0.6 + 0.5 * ease.out(Math.min(1, k * 3));
        pose(cr.el, { x: fitX(S, x, cr.w * cs, -cr.dir, flo, fhi), y, s: cs, r: Math.sin(cr.seed) * 6, o: t < 2.1 ? o : 0 });
      });

      /* the platform */
      const take = es(t, 4.05, 4.35);
      Q.sols[0].set({ x: 640 + take * 110, y: PLAT, s: 0.84, flip: false, walk: take > 0 && take < 1 ? take * 12 : undefined, armF: 34 + take * 20, armB: 8 + take * 50, blink: blinkAt(T, 4) });
      Q.sols[1].set({ x: (S.portrait ? 1065 : 1110) - take * (S.portrait ? 155 : 200), y: PLAT, s: 0.84, flip: true, walk: take > 0 && take < 1 ? take * 12 : undefined, armF: 34, armB: 8 + take * 60, blink: blinkAt(T, 5) });
      Q.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 6 + take * 3, blink: blinkAt(T) });
      const brow = es(t, 1.1, 1.4) * (1 - es(t, 1.95, 2.15));
      const give = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const away = es(t, 4.2, 4.45);
      const px = lerp(965, 1000, away);
      Q.pil.set({ x: px, y: PLAT + 2, s: 0.88, flip: away < 0.5, armF: 20 + give * 60 + brow * 20, armB: 10 + brow * 150, head: brow * 12 - give * 4 + away * 8, lean: brow * 6, blink: blinkAt(T, 2) });
      /* v24 — the decree, sealed */
      const dk = es(t, 2.05, 2.35, ease.back);
      const stamp = es(t, 2.4, 2.5, ease.back);
      pose(decree, { x: 965, y: lerp(PLAT - 150, 250, dk), s: dk * (1 + bump(t, 2.45, 2.6) * 0.12), r: -4, o: dk > 0.02 ? 1 - es(t, 2.95, 3.1) : 0 });
      pose(sealEl, { x: 28, y: 8, s: 1.6 - stamp * 0.6, o: stamp > 0.01 ? 1 : 0 });

      /* v25a — Barabbas goes free */
      const opened = es(t, 3.05, 3.3);
      pose(H.door, { x: CELL.x - CELL.w / 2, y: 0, sx: 1 - opened * 0.8, ox: CELL.x - CELL.w / 2 });
      const bK = [[3.25, [CELL.x + 2, CELL.y - 2]], [3.8, [CELL.x + 40, CELL.y + 100]], [4.6, [CELL.x + 420, CELL.y + 140]]];
      const [bx, by] = kf(t, bK);
      const out = t > 3.25;
      const free = es(t, 3.6, 3.8);
      Q.bar.set({ x: CELL.x + 2, y: CELL.y - 2, s: 0.66, flip: true, armF: 24, armB: 14, head: -bump(t, 2.9, 3.3) * 8, o: out ? 0 : 1, blink: blinkAt(T, 8) });
      Q.barFree.set({ x: bx, y: by, s: 0.66 + es(t, 3.25, 3.8) * 0.3, flip: false, walk: moving(t, bK) ? bx * 0.08 : undefined, armF: 24 + free * 90, armB: 14 + free * 110, head: -free * 10, o: out ? 1 : 0, blink: blinkAt(T, 8) });
      Q.rebels.forEach((r, i) => r.set({ x: CELL.x + [-58, 58][i], y: CELL.y - 4, s: 0.6, flip: i === 1, armF: 24, armB: 10, head: 6 + bump(t, 3.2, 4) * 8, blink: blinkAt(T, 3 + i) }));
      chains.forEach((ch, i) => {
        const k = es(t, 3.6, 3.85, ease.in);
        pose(ch, { x: bx + 20 + i * 14, y: by - 90 + k * 84, r: k * (i ? 80 : -60), o: free > 0.02 ? 1 - es(t, 4.3, 4.5) : 0 });
      });
      const fk = es(t, 3.6, 3.8, ease.back) * (1 - es(t, 4.05, 4.2));
      const [bhx, bhy] = headAt(bx, by, 0.96, false);
      pose(freeTag, { x: bhx, y: bhy - 70, s: fk, o: fk > 0.02 ? 1 : 0 });

      /* v25b — the curtain comes down over Him */
      const down = es(t, 4.2, 4.65, ease.out);
      swing(curtainEl, JX, 160 - (1 - down) * 900, T * down, 0.4, 0.5);

    };
  },
};
