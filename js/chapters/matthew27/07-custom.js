// Mt 27,15–18 — the square before the praetorium (Mark 15's square). A plate on the fly-lines shows the feast-day
// custom: a barred gate opens and one prisoner walks free. Under the platform, behind bars, sits the notorious
// prisoner, Barabbas; his name comes down. The crowd pours in and gathers; Pilate holds out the choice — two
// round portraits in his bubble, Barabbas or Jesus called the Christ. He knows why they handed Him over: in his
// thoughts a sour green heart and a narrowed eye, and a green haze hangs over the chief priests.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, speech, thought, GLYPH, strip, heart, hanging, swing, squareSet, squareCast, PLAT, shadowPerson, medallion, LOOK, INK, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'mt27-custom',
  beats: [
    { v: 15 },
    { v: 16 },
    { v: 17 },
    { v: 18 },
  ],
  cam: { x: [-40, 200], y: [-40, 120], z: [1, 1.3] },
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
    const feast = sheet().p(c.cut(c.circ(0, 0, 76, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 70, 38), 0.5, 5), C.cream).p(c.cut(c.rect(-22, -32, 44, 56), 0.3, 4), C.soilDark).out();
    const deco = `<g transform="translate(-38 -44) scale(.7)"><path d="${c.cut(c.ell(0, 0, 16, 5, 12), 0.3, 3)}" fill="${C.wheat}"/></g><g transform="translate(40 -46)"><path d="${c.cut([[-6, -8], [6, -8], [4, 0], [1, 2], [1, 7], [4, 9], [-4, 9], [-1, 7], [-1, 2], [-4, 0]], 0.2, 3)}" fill="${C.sun}"/></g>`;
    const plateEl = hanging(plateL, `<g transform="scale(.7)">${feast}${deco}<g class="walker">${walker}</g><g class="gate">${gate.out()}</g><g transform="translate(0 92)">${strip(c, tr('na każde święto', 'at the feast'), { size: 16 })}</g><g transform="translate(0 122)">${strip(c, tr('jeden więzień', 'one prisoner'), { size: 16, fill: C.stone })}</g></g>`, { x: 800, y: -1500, len: 800 });
    const wEl = plateEl.querySelector('.walker'), gEl = plateEl.querySelector('.gate');
    const wP = S.puppet(wEl.firstElementChild);

    const fx = H.fxL;
    const barTag = hanging(S.layer({ par: 0.3, sh: 5 }), `${strip(c, tr('Barabasz', 'Barabbas'), { size: 24 })}<g transform="translate(0 34)">${strip(c, tr('znaczny więzień', 'a notable prisoner'), { size: 15, fill: C.stone })}</g>`, { x: 0, y: -1500, len: 900 });
    const offer = fx.add(`<g>${speech(c, `<g transform="translate(-44 0)">${medallion(c, LOOK.barabbas, { r: 22, rim: C.rock3 })}</g><g transform="translate(0 0) scale(.9)">${GLYPH.q(c)}</g><g transform="translate(44 0)"><circle r="34" fill="url(#halo-glow)"/>${medallion(c, CAST.jesus, { r: 22, rim: C.haloRim })}</g>`, { w: 150, h: 70, flip: true })}</g>`);
    const envy = fx.add(`<g>${thought(c, `<g transform="translate(-14 0)">${heart(c, 13, mix(C.sage, C.moss2, 0.6))}</g><path d="${c.ribbon([[-18, -8], [-12, 0], [-16, 6]], 1.6)}" fill="${C.ink}"/><g transform="translate(16 2)"><path d="${c.cut(c.ell(0, 0, 11, 7, 12), 0.2, 3)}" fill="${C.cream}"/><path d="${c.poly(c.circ(1, 0, 4.5, 10))}" fill="${C.moss2}"/></g>`, { w: 84, h: 56 })}</g>`);
    const gid = S.id('envy');
    S.defs(`<radialGradient id="${gid}"><stop offset="0" stop-color="${C.moss}" stop-opacity=".8"/><stop offset="1" stop-color="${C.moss}" stop-opacity="0"/></radialGradient>`);
    const hazes = K.pr.map(() => fx.add(`<g><circle r="95" fill="url(#${gid})"/></g>`));

    return (t, time) => {
      const T = time;
      const lookBar = es(t, 0.9, 1.3) * (1 - es(t, 1.85, 2.2));
      swing(H.sunEl, 1230, 150, T, 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30, 150, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30, 110, T, 1.2, 0.8, 2);
      /* v15 — the custom */
      const pd = es(t, -0.3, 0.3) * (1 - es(t, 0.95, 1.3));
      swing(plateEl, 800, 172 - (1 - pd) * 560, T, 1.4, 0.7);
      const open = es(t, 0.2, 0.45);
      pose(gEl, { x: -20, y: 0, sx: 1 - open * 0.85, ox: -20 });
      const wk = seg(t, 0.35, 0.8);
      wP.set({ x: lerp(-2, 44, wk), y: 22, s: 0.2, walk: wk > 0 && wk < 1 ? wk * 20 : undefined, o: wk > 0 ? 1 - es(t, 0.8, 0.95) : 0, armB: wk > 0.9 ? 60 : 0 });
      /* v16 — Barabbas behind bars */
      K.rebels.forEach((r) => r.set({ o: 0 }));
      const glare = bump(t, 1.1, 1.8);
      K.bar.set({ x: CELL.x + 2, y: CELL.y - 2, s: 0.66, flip: true, armF: 24 + glare * 40, armB: 14 + glare * 40, head: -glare * 8, blink: blinkAt(T, 8) });
      const bt = es(t, 1.05, 1.35) * (1 - es(t, 1.9, 2.2));
      swing(barTag, S.portrait ? CELL.x - 10 : CELL.x + 150, CELL.y - 110 - (1 - bt) * 800, T, 1.2, 0.8, 1);

      /* the platform */
      K.sols[0].set({ x: 640, y: PLAT, s: 0.84, flip: false, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      K.sols[1].set({ x: S.portrait ? 1055 : 1110, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });
      const offerK = es(t, 2.2, 2.45) * (1 - es(t, 2.95, 3.2));
      K.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4 - offerK * 4, blink: blinkAt(T) });
      const think = es(t, 3.05, 3.3);
      K.pil.set({ x: 965, y: PLAT + 2, s: 0.88, flip: true, armF: 20 + bump(t, 2.05, 2.5) * 30 + offerK * 70, armB: 10 + offerK * 30 + think * 120, head: -offerK * 6 + think * 10, lean: think * 4, blink: blinkAt(T, 2) });

      /* v17 — the crowd gathers */
      K.people.forEach((m) => {
        const pr = seg(t, 2.0 + m.delay * 0.3, 2.35 + m.delay * 0.3);
        const x = lerp(m.from, m.x, ease.out(pr));
        m.p.set({ x, y: m.y, s: m.s, flip: m.flip, walk: pr > 0 && pr < 1 ? x * 0.05 : undefined, armF: 20 + bump(t, 2.5 + m.delay * 0.2, 2.9 + m.delay * 0.2) * 20, armB: 10, head: -6 - offerK * 4, blink: blinkAt(T, m.seed) });
      });
      const [phx, phy] = headAt(965, PLAT + 2, 0.88, true);
      const ok = es(t, 2.3, 2.55, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(offer, { x: phx - 20, y: phy - 14, s: ok, o: ok > 0.02 ? 1 : 0 });
      /* v18 — envy */
      const ek = es(t, 3.1, 3.35, ease.back);
      pose(envy, { x: phx + 4, y: phy - 20, s: ek * 1.35, o: ek > 0.02 ? 1 : 0 });
      K.pr.forEach((m, i) => {
        m.p.set({ x: m.x, y: m.y, s: 0.96, flip: false, walk: undefined, armF: 30 + bump(t, 3.2, 3.9) * 20, armB: 12, head: -4, blink: blinkAt(T, 7 + i) });
        pose(hazes[i], { x: m.x, y: m.y - 190, o: es(t, 3.15, 3.4) * 0.6 });
      });

      S.cam.x = lookBar * 170 - es(t, 3.0, 3.4) * 30;
      S.cam.y = lookBar * 110 - es(t, 2.0, 2.6) * 10;
      S.cam.z = 1.02 + lookBar * 0.24;
    };
  },
};
