// Łk 23,17–19 — the square before the praetorium (Mark 15's square). Jesus stands on the platform in Herod's
// gleaming robe, Pilate beside Him; the crowd fills the square. <v17, bracketed in the text> A plate on the
// fly-lines shows the feast-day custom: a barred gate opens and one prisoner walks free. Then they all cry out
// together — arms up, jagged cries: "Away with this one!", "Release Barabbas to us!". Below the platform, behind
// bars: Barabbas and the rebels; a small dark picture hangs over them — a riot in the city, flames, a knife.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { headAt, strip, cry, hanging, swing, shadowPerson, squareStage, crowdSet, fitX, frameX, cryW, INK, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'lk23-barabbas',
  beats: [
    { v: 17 },
    { v: 18 },
    { v: 19 },
  ],
  cam: { x: [-40, 560], y: [-40, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const Q = squareStage(S);
    const { H, CELL, PLAT } = Q;

    /* the custom: a plate on the fly-lines (Mark 15's) */
    const plateL = S.layer({ par: 0.2, sh: 5 });
    const gate = sheet();
    let bars = '';
    for (let x = -18; x <= 14; x += 8) bars += c.cut(c.rect(x, -30, 3.6, 52), 0.1, 4);
    bars += c.cut(c.rect(-20, -10, 38, 3), 0.1, 4);
    gate.p(bars, C.rock3);
    const walker = shadowPerson(c, { robe: INK, hairStyle: 'short' }, INK);
    const feast = sheet().p(c.cut(c.circ(0, 0, 76, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 70, 38), 0.5, 5), C.cream)
      .p(c.cut(c.rect(-22, -32, 44, 56), 0.3, 4), C.soilDark).out();
    const plateEl = hanging(plateL, `${feast}<g class="walker">${walker}</g><g class="gate">${gate.out()}</g><g transform="translate(0 92)">${strip(c, tr('jeden więzień na święta', 'one prisoner at the feast'), { size: 16 })}</g>`, { x: 800, y: -1500, len: 800 });
    const wEl = plateEl.querySelector('.walker'), gEl = plateEl.querySelector('.gate');
    const wP = S.puppet(wEl.firstElementChild);

    /* the riot and the murder: a dark little picture above the cell */
    const riot = sheet();
    riot.p(c.cut(c.rect(-70, -52, 140, 104), 0.6, 6), shade(C.plumRobe, -0.45));
    let fl = '';
    for (let i = 0; i < 7; i++) { const x = -60 + i * 20; fl += c.cut([[x - 9, 52], [x - 4, 52 - c.rr(20, 44)], [x, 38], [x + 4, 52 - c.rr(24, 50)], [x + 9, 52]], 0.6, 4); }
    riot.x(fl, C.terracotta, 'opacity=".85"');
    riot.x(c.ribbon([[-40, 46], [10, 30]], 3) + c.poly([[10, 30], [18, 24], [16, 32]]), INK);
    const rioters = `<g transform="translate(-26 40) scale(.36)">${shadowPerson(c, { hairStyle: 'wild', beard: 'wild' }, '#1d1418')}</g><g transform="translate(28 40) scale(-.34 .34)">${shadowPerson(c, { hairStyle: 'short', beard: 'full' }, '#1d1418')}</g>`;
    const riotL = S.layer({ par: 0.32, sh: 5 });
    const riotEl = hanging(riotL, `${riot.out()}${rioters}<g transform="translate(0 74)">${strip(c, tr('rozruch i zabójstwo', 'revolt and murder'), { size: 14, fill: C.stone })}</g>`, { x: 895, y: -1500, len: 800 });

    const fx = H.fxL;
    const barTag = fx.add(`<g>${strip(c, tr('Barabasz', 'Barabbas'), { size: 22 })}</g>`);
    const cries = Array.from({ length: 10 }, (_, i) => {
      const txt = i % 2 ? tr('Uwolnij Barabasza!', 'Release Barabbas!') : tr('Strać Tego!', 'Away with this man!'), size = i < 4 ? 19 : 16, dir = i % 3 ? 1 : -1;
      return { i, el: fx.add(`<g>${cry(c, txt, { size, dir })}</g>`), g: [1, 4, 7, 10, 2, 5, 8, 12, 3, 9][i], seed: c.rr(0, 6), dir, w: cryW(txt, size) };
    });

    return (t, time) => {
      const T = time;
      const lookBar = es(t, 1.9, 2.3);
      S.cam.x = lookBar * (S.portrait ? 520 : 170);   // phone: far enough to bring the cell, its name and the riot inside the frame
      S.cam.y = lookBar * 100 - es(t, 1.0, 1.4) * 10 * (1 - lookBar);
      S.cam.z = 1.02 + lookBar * 0.22;
      const [flo, fhi] = frameX(S, 0.6);
      swing(H.sunEl, 1230, 150, T, 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30, 150, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30, 110, T, 1.2, 0.8, 2);
      H.sk.blend(['#c9d6d6', '#efe2c9', '#f6e4c6'], ['#b6bfc6', '#e2d3bd', '#eed8b8'], es(t, 1, 2) * 0.6);

      /* v17 — the custom */
      const pd = es(t, -0.3, 0.3) * (1 - es(t, 0.95, 1.3));
      swing(plateEl, S.portrait ? 800 : 1040, 150 - (1 - pd) * 800, T, 1.4, 0.7);
      const open = es(t, 0.2, 0.45);
      pose(gEl, { x: -20, y: 0, sx: 1 - open * 0.85, ox: -20 });
      const wk = seg(t, 0.35, 0.8);
      wP.set({ x: lerp(-2, 44, wk), y: 22, s: 0.2, walk: wk > 0 && wk < 1 ? wk * 20 : undefined, o: wk > 0 ? 1 - es(t, 0.8, 0.95) : 0, armB: wk > 0.9 ? 60 : 0 });

      /* the platform */
      Q.sols[0].set({ x: 640, y: PLAT, s: 0.84, flip: false, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      Q.sols[1].set({ x: S.portrait ? 1065 : 1110, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });
      Q.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4 + es(t, 1.1, 1.4) * 3, blink: blinkAt(T) });
      const offer = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      Q.pil.set({ x: 965, y: PLAT + 2, s: 0.88, flip: true, armF: 20 + offer * 70, armB: 10 + offer * 30 + bump(t, 1.2, 1.9) * 50, head: -offer * 6 + bump(t, 1.2, 1.9) * 8, blink: blinkAt(T, 2) });

      /* v18 — all cry out together */
      const roar = es(t, 1.05, 1.2) * (1 - es(t, 2.85, 3.0) * 0.4);
      const part = es(t, 1.95, 2.3);
      crowdSet(Q.crowd, roar > 0.5 ? 1 : 0, (g) => (g.ri >= 1 && Math.abs(g.cx - CELL.x) < 240 ? Math.sign(g.cx - CELL.x + 1) * 230 * part : 0));
      H.crowdL.shift(T ? Math.sin(T * 26) * 2.5 * roar : 0, 0);
      Q.pr.forEach((m, i) => m.p.set({ x: m.x + [120, 240][i], y: m.y, s: 0.96, flip: i === 1, armF: 30 + roar * 70, armB: 12 + roar * 100, head: -6, blink: blinkAt(T, 7 + i) }));
      cries.forEach((cr) => {
        const side = Q.crowd.filter((g) => Math.abs(g.cx - 800) > (S.portrait ? 150 : 330));
        const g = side[cr.g % side.length];
        const m = g.members[0];
        const k = seg(t, 1.1 + cr.i * 0.06, 1.9 + cr.i * 0.06);
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        const cs = 0.6 + 0.5 * ease.out(Math.min(1, k * 3));
        pose(cr.el, { x: fitX(S, hx + Math.sin(k * 3 + cr.seed) * 16, cr.w * cs, -cr.dir, flo, fhi), y: hy - 20 - k * 90, s: cs, r: Math.sin(cr.seed) * 6, o: k > 0 && k < 1 ? Math.min(1, k * 6) * (1 - Math.max(0, k - 0.7) / 0.3) : 0 });
      });

      /* v19 — Barabbas behind bars; the riot above him */
      const reb = 1;
      Q.rebels.forEach((r, i) => r.set({ x: CELL.x + [-58, 58][i], y: CELL.y - 4, s: 0.6, flip: i === 1, o: reb, armF: 24, armB: 10, head: 6, blink: blinkAt(T, 3 + i) }));
      const glare = bump(t, 1.3, 2.0) + es(t, 2.05, 2.3) * 0.6;
      Q.bar.set({ x: CELL.x + 2, y: CELL.y - 2, s: 0.66, flip: true, armF: 24 + glare * 40, armB: 14 + glare * 40, head: -glare * 8, blink: blinkAt(T, 8) });
      Q.barFree.set({ x: 0, y: 0, o: 0 });
      const bt = es(t, 1.35, 1.6, ease.back);
      pose(barTag, { x: S.portrait ? CELL.x - 20 : CELL.x, y: CELL.y - 176, s: bt, r: -3, o: bt > 0.02 ? 1 : 0 });
      const rd = es(t, 2.05, 2.45);
      swing(riotEl, S.portrait ? 1120 : 1265, 470 - (1 - rd) * 900, T, 1.2, 0.8, 1);

    };
  },
};
