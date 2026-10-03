// Mk 15,6–11 — the square before the praetorium. A plate on the fly-lines shows the feast-day custom
// (a barred door swings open and one prisoner walks free). Under the platform, behind bars: Barabbas,
// with the rebels of the uprising (a dark little picture of the riot hangs above them).
// The crowd pours in asking for the custom; Pilate offers the King of the Jews — he sees the chief priests'
// envy — but the priests go among the people whispering one name: Barabbas.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, speech, thought, GLYPH, crown, strip, cry, heart, hanging, swing, squareSet, squareCast, PLAT, shadowPerson, INK, PI } from './lib.js';

const JX = 800;

/** a little key (glyph) */
function key(c, col = C.sun) {
  return sheet().p(c.cut(c.circ(-8, 0, 6, 12), 0.2, 3) + c.cut([[-3, -2], [12, -2], [12, 2], [-3, 2]], 0.2, 3) + c.cut([[7, 2], [10, 2], [10, 7], [7, 7]], 0.2, 2) + c.cut([[2, 2], [5, 2], [5, 6], [2, 6]], 0.2, 2), col).x(c.poly(c.circ(-8, 0, 2.4, 8)), C.cream).out();
}

export default {
  id: 'm15-barabbas',
  beats: [
    { v: 6 },
    { v: 7, text: 'A był tam jeden, zwany Barabaszem,' },
    { v: 7, cont: true, text: 'uwięziony z buntownikami, którzy w rozruchu popełnili zabójstwo.' },
    { v: 8 },
    { v: 9 },
    { v: 10 },
    { v: 11 },
  ],
  cam: { x: [-40, 440], y: [-40, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const H = squareSet(S);
    const K = squareCast(S, H);
    const { CELL } = H;

    /* the custom: a plate on the fly-lines */
    const plateL = S.layer({ par: 0.2, sh: 5 });
    const gate = sheet();
    let bars = '';
    for (let x = -18; x <= 14; x += 8) bars += c.cut(c.rect(x, -30, 3.6, 52), 0.1, 4);
    bars += c.cut(c.rect(-20, -10, 38, 3), 0.1, 4);
    gate.p(bars, C.rock3);
    const walker = shadowPerson(c, { robe: INK, hairStyle: 'short' }, INK);
    const feast = sheet().p(c.cut(c.circ(0, 0, 76, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 70, 38), 0.5, 5), C.cream)
      .p(c.cut(c.rect(-22, -32, 44, 56), 0.3, 4), C.soilDark).out();
    const deco = `<g transform="translate(-38 -44) scale(.7)"><path d="${c.cut(c.ell(0, 0, 16, 5, 12), 0.3, 3)}" fill="${C.wheat}"/></g><g transform="translate(40 -46)"><path d="${c.cut([[-6, -8], [6, -8], [4, 0], [1, 2], [1, 7], [4, 9], [-4, 9], [-1, 7], [-1, 2], [-4, 0]], 0.2, 3)}" fill="${C.sun}"/></g>`;
    const plateEl = hanging(plateL, `${feast}${deco}<g class="walker">${walker}</g><g class="gate">${gate.out()}</g><g transform="translate(0 92)">${strip(c, tr('jeden więzień', 'one prisoner'), { size: 16 })}</g>`, { x: 800, y: 150, len: 800 });
    const wEl = plateEl.querySelector('.walker'), gEl = plateEl.querySelector('.gate');
    const wP = S.puppet(wEl.firstElementChild);

    /* the riot, a dark little picture above the cell */
    const riot = sheet();
    riot.p(c.cut(c.rect(-70, -52, 140, 104), 0.6, 6), shade(C.plumRobe, -0.45));
    let fl = '';
    for (let i = 0; i < 7; i++) { const x = -60 + i * 20; fl += c.cut([[x - 9, 52], [x - 4, 52 - c.rr(20, 44)], [x, 38], [x + 4, 52 - c.rr(24, 50)], [x + 9, 52]], 0.6, 4); }
    riot.x(fl, C.terracotta, 'opacity=".85"');
    riot.x(c.ribbon([[-40, 46], [10, 30]], 3) + c.poly([[10, 30], [18, 24], [16, 32]]), INK);
    const rioters = `<g transform="translate(-26 40) scale(.36)">${shadowPerson(c, { hairStyle: 'wild', beard: 'wild' }, '#1d1418').replace('class="fig"', 'class="fig" transform="translate(0 0)"')}</g><g transform="translate(28 40) scale(-.34 .34)">${shadowPerson(c, { hairStyle: 'short', beard: 'full' }, '#1d1418')}</g>`;
    const riotL = S.layer({ par: 0.32, sh: 5 });
    const riotEl = hanging(riotL, `${riot.out()}${rioters}`, { x: 1180, y: 300, len: 800 });

    const fx = H.fxL;
    const barTag = fx.add(`<g>${strip(c, tr('Barabasz', 'Barabbas'), { size: 22 })}</g>`);
    const rebTag = fx.add(`<g>${strip(c, tr('buntownicy', 'insurgents'), { size: 16, fill: C.stone })}</g>`);
    const asks = [0, 1, 2].map((i) => fx.add(`<g>${speech(c, `<g transform="scale(1.3)">${key(c)}</g>`, { w: 60, h: 44, flip: i === 2 })}</g>`));
    const offer = fx.add(`<g>${speech(c, `<g transform="translate(-14 22) scale(.85)">${crown(c)}</g><g transform="translate(20 2) scale(1.05)">${GLYPH.q(c)}</g>`, { w: 92, h: 60, flip: true })}</g>`);
    const envy = fx.add(`<g>${thought(c, `<g transform="translate(-14 0)">${heart(c, 13, mix(C.sage, C.moss2, 0.6))}</g><path d="${c.ribbon([[-18, -8], [-12, 0], [-16, 6]], 1.6)}" fill="${C.ink}"/><g transform="translate(16 2)"><path d="${c.cut(c.ell(0, 0, 11, 7, 12), 0.2, 3)}" fill="${C.cream}"/><path d="${c.poly(c.circ(1, 0, 4.5, 10))}" fill="${C.moss2}"/></g>`, { w: 84, h: 56 })}</g>`);
    const gid = S.id('envy');
    S.defs(`<radialGradient id="${gid}"><stop offset="0" stop-color="${C.moss}" stop-opacity=".8"/><stop offset="1" stop-color="${C.moss}" stop-opacity="0"/></radialGradient>`);
    const hazes = K.pr.map(() => fx.add(`<g><circle r="95" fill="url(#${gid})"/></g>`));
    const whispers = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${strip(c, tr('Barabasz', 'Barabbas'), { size: 13, fill: C.stone })}</g>`), to: [260, 380, 640, 900, 1120, 1320][i], ty: c.rr(470, 540) }));
    const shouts = [0, 1, 2, 3].map((i) => fx.add(`<g>${cry(c, tr('Barabasza!', 'Barabbas!'), { size: 17, dir: i % 2 ? 1 : -1 })}</g>`));

    return (t, time) => {
      const T = time;
      const lookBar = es(t, 0.9, 1.4) * (1 - es(t, 2.8, 3.3));

      /* sky & fly-lines */
      swing(H.sunEl, 1230, 150, T, 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30, 150, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30, 110, T, 1.2, 0.8, 2);
      // v6 — the plate comes down; a gate opens and one prisoner goes free
      const pd = es(t, -0.3, 0.3) * (1 - es(t, 0.95, 1.3));
      swing(plateEl, 800, 205 - (1 - pd) * 560, T, 1.4, 0.7);
      const open = es(t, 0.2, 0.45);
      pose(gEl, { x: -20, y: 0, sx: 1 - open * 0.85, ox: -20 });
      const wk = seg(t, 0.35, 0.8);
      wP.set({ x: lerp(-2, 44, wk), y: 22, s: 0.2, walk: wk > 0 && wk < 1 ? wk * 20 : undefined, o: wk > 0 ? 1 - es(t, 0.8, 0.95) : 0, armB: wk > 0.9 ? 60 : 0 });
      // v7 — Barabbas and the rebels in their cell, the riot above
      const rd = es(t, 1.85, 2.3) * (1 - es(t, 3.0, 3.3));
      swing(riotEl, 895, 560 - (1 - rd) * 800, T, 1.2, 0.8, 1);
      const reb = es(t, 1.9, 2.2);
      K.rebels.forEach((r, i) => r.set({ x: CELL.x + [-58, 58][i], y: CELL.y - 4, s: 0.6, flip: i === 1, o: reb, armF: 24, armB: 10, head: 6, blink: blinkAt(T, 3 + i) }));
      const glare = bump(t, 1.1, 1.8);
      K.bar.set({ x: CELL.x + 2, y: CELL.y - 2, s: 0.66, flip: true, armF: 24 + glare * 40, armB: 14 + glare * 40, head: -glare * 8, blink: blinkAt(T, 8) });
      const bt = es(t, 1.05, 1.3, ease.back);
      pose(barTag, { x: CELL.x, y: CELL.y - 176, s: bt, r: -3, o: bt > 0.02 ? 1 - es(t, 3.0, 3.2) : 0 });
      const rt = es(t, 2.1, 2.3, ease.back);
      pose(rebTag, { x: CELL.x + 10, y: CELL.y + 26, s: rt, r: 2, o: rt > 0.02 ? 1 - es(t, 3.0, 3.2) : 0 });

      /* the platform: soldiers, Jesus, Pilate */
      K.sols[0].set({ x: 640, y: PLAT, s: 0.84, flip: false, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      K.sols[1].set({ x: S.portrait ? 1045 : 1110, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });
      const offerK = es(t, 4.05, 4.35) * (1 - es(t, 5.0, 5.3));
      K.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4 - offerK * 4, blink: blinkAt(T) });
      const think = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      K.pil.set({ x: 965, y: PLAT + 2, s: 0.88, flip: true, armF: 20 + bump(t, 3.2, 3.8) * 30 + offerK * 70, armB: 10 + offerK * 30 + think * 120, head: -offerK * 6 + think * 10, lean: think * 4, blink: blinkAt(T, 2) });

      /* v8 — the crowd pours in */
      const cry1 = es(t, 3.3, 3.5) * (1 - es(t, 3.9, 4.1));
      const stir = es(t, 6.35, 6.6);
      K.people.forEach((m) => {
        const pr = seg(t, 3.0 + m.delay * 0.4, 3.45 + m.delay * 0.4);
        const x = lerp(m.from, m.x, ease.out(pr));
        const up = (m.shout ? cry1 : 0) + (m.shout ? stir : 0) * (0.6 + 0.4 * Math.sin(m.seed));
        m.p.set({
          x, y: m.y, s: m.s, flip: m.flip, walk: pr > 0 && pr < 1 ? x * 0.05 : undefined,
          armF: 20 + up * 60 + bump(t, 3.5 + m.delay * 0.2, 3.9 + m.delay * 0.2) * 10, armB: 10 + up * 70, head: -6 - up * 6, blink: blinkAt(T, m.seed),
        });
      });
      asks.forEach((a, i) => {
        const m = K.people[[4, 12, 20][i] % K.people.length];
        const k = es(t, 3.4 + i * 0.1, 3.6 + i * 0.1, ease.back) * (1 - es(t, 3.95, 4.1));
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        pose(a, { x: hx + (i === 2 ? -10 : 10), y: hy - 18, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v9 — Pilate offers the King of the Jews */
      const [phx, phy] = headAt(965, PLAT + 2, 0.88, true);
      const ok = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.05));
      pose(offer, { x: phx - 20, y: phy - 14, s: ok, o: ok > 0.02 ? 1 : 0 });
      /* v10 — he knew it was envy */
      const ek = es(t, 5.1, 5.35, ease.back) * (1 - es(t, 5.95, 6.1));
      pose(envy, { x: phx + 4, y: phy - 20, s: ek * 1.35, o: ek > 0.02 ? 1 : 0 });
      /* v11 — the priests stir up the crowd */
      const walkP = seg(t, 6.05, 6.6);
      K.pr.forEach((m, i) => {
        const x = m.x + walkP * (i ? 320 : 180);
        const whisper = es(t, 6.1, 6.3);
        m.p.set({ x, y: m.y, s: 0.96, flip: false, walk: walkP > 0 && walkP < 1 ? x * 0.05 : undefined, armF: 30 + bump(t, 5.2, 5.9) * 20 + whisper * 60, armB: 12 + whisper * 30, head: -4 + whisper * 6, lean: whisper * 5, blink: blinkAt(T, 7 + i) });
        const hz = es(t, 5.15, 5.4) * (1 - es(t, 6.8, 7));
        pose(hazes[i], { x, y: m.y - 120, o: hz });
      });
      whispers.forEach((w) => {
        const k = seg(t, 6.12 + w.i * 0.06, 6.45 + w.i * 0.06);
        const src = K.pr[w.i % 2];
        const sx0 = src.x + walkP * (w.i % 2 ? 320 : 180) + 30, sy0 = src.y - 170;
        pose(w.el, { x: lerp(sx0, w.to, k), y: lerp(sy0, w.ty, k) - Math.sin(k * PI) * 60, r: Math.sin(T * 3 + w.i) * 8, o: k > 0 && k < 1 ? Math.min(1, k * 6) : 0 });
      });
      shouts.forEach((sh, i) => {
        const m = K.people[[3, 9, 16, 24][i] % K.people.length];
        const k = es(t, 6.5 + i * 0.07, 6.7 + i * 0.07, ease.back);
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        pose(sh, { x: hx + (i % 2 ? -8 : 8), y: hy - 20, s: k * 0.95, o: k > 0.02 ? 1 : 0, r: (i % 2 ? 4 : -4) });
      });

      S.cam.x = lookBar * (S.portrait ? 420 : 170) +   // phone: pan far enough that Barabbas' cell clears the thread
         es(t, 5.0, 5.4) * 60 * (1 - es(t, 5.9, 6.2));
      S.cam.y = lookBar * 110 - es(t, 3.2, 3.8) * 10 + es(t, 5.9, 6.4) * 50;
      S.cam.z = 1.02 + lookBar * 0.24 + es(t, 5.0, 5.4) * 0.06 * (1 - es(t, 5.9, 6.2));
    };
  },
};
