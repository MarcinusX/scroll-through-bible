// J 4,43–45 — after the two days He goes on to Galilee (the Samaritans wave Him off; a signpost). "A prophet has no
// honour in his own country": a grey roundel of Nazareth comes down — shut doors, turned backs, a lone prophet;
// Jesus stops, His hand on His heart. But the Galileans come running to welcome Him: they had seen what He did in
// Jerusalem at the feast — a sepia picture of the Temple court, the tables overturned, the doves flying free; "for
// they too had gone to the feast" — in the picture a line of Galilean pilgrims climbs up to the Temple.
import { C, person, CAST, blinkAt, lerp, sheet, mix } from '../kit.js';
import { seg, es, ease, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { galileeSet, DISC, samaritan, signpost, roundel, panel, templeMini, sepia, strip, shadowPerson, hanging, swing, vis, kf } from './lib.js';
import { house } from '../../assets/nature.js';

const FLOOR = 716;
const PAN = { x: 800, y: 110, w: 500, h: 250 };

export default {
  id: 'j4-galilee',
  beats: [
    { v: 43 },
    { v: 44 },
    { v: 45, text: 'Kiedy jednak przybył do Galilei, Galilejczycy przyjęli Go, ponieważ widzieli wszystko, co uczynił w Jerozolimie w czasie świąt.' },
    { v: 45, cont: true, text: 'I oni bowiem przybyli na święto.' },
  ],
  cam: { x: [-80, 80], y: [-60, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const W = galileeSet(S, {});
    const L = W.actL;
    L.add(`<g transform="translate(1010 ${FLOOR + 6})">${signpost(c, tr('Galilea', 'Galilee'), { size: 20, dir: 1 })}</g>`);
    const sams = [0, 1, 2].map((i) => ({ i, p: S.puppet(L.add(person(c, samaritan(c, i + 90)))) }));
    const disc = [0, 1, 2, 3].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, DISC[k]))) }));
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const gal = Array.from({ length: 6 }, (_, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, samaritan(c, i + 110)))), x: 930 + i * 64 }));

    const fx = S.layer({ par: 0.5, sh: 6 });
    // Nazareth: shut doors, turned backs (a grey roundel)
    const grey = (hex) => mix(hex, C.stone2, 0.55);
    const naz = `<rect x="-140" y="-140" width="280" height="280" fill="${mix(C.stone, C.skyBlue, 0.3)}"/><path d="${c.ridge(c.wave(60, [4, 2], [120, 40]), -150, 150, 160, 8, 0.8)}" fill="${grey(C.hillMid)}"/>${house(c, -110, 40, 70, 60, { wall: grey(C.plaster), shadow: grey(C.plaster2), door: C.soilDark })}${house(c, 20, 30, 80, 70, { wall: grey(C.plaster), shadow: grey(C.plaster2), door: C.soilDark })}<g transform="translate(-40 96) scale(.34)">${shadowPerson(c, samaritan(c, 1), '#8b8078')}</g><g transform="translate(-12 96) scale(-.34 .34)">${shadowPerson(c, samaritan(c, 2), '#8b8078')}</g><g transform="translate(70 100) scale(-.36 .36)">${person(c, sepia({ robe: C.dustyBlue, mantle: C.linen2, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', holdF: `<g transform="translate(0 4)">${sheet().p(c.cut(c.rect(-12, -6, 24, 12), 0.2, 3), C.parchment).out()}</g>` }, 0.3))}</g>`;
    const nazEl = hanging(fx, `${roundel(S, naz, { r: 120, k: 'naz', bg: C.stone })}<g transform="translate(0 132)">${strip(c, tr('Nazaret', 'Nazareth'), { size: 18 })}</g>`, { x: S.portrait ? 820 : 1080, y: S.portrait ? 90 : 300, len: 600 });
    // the feast in Jerusalem (sepia)
    const court = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-PAN.w / 2, 0, PAN.w, PAN.h), 0, 40), mix(C.parchment, C.dune, 0.25));
      s.p(c.cut(c.rect(-PAN.w / 2 - 10, 190, PAN.w + 20, 80), 0.5, 10), mix(C.stone, C.dune, 0.4));
      const tbl = sheet().p(c.cut([[-40, -6], [40, -20], [44, -12], [-36, 2]], 0.4, 5), mix(C.wood3, C.dune, 0.4)).p(c.cut(c.rect(-30, -4, 6, 26), 0.2, 3), mix(C.wood2, C.dune, 0.4)).out();
      let coins = '';
      for (let i = 0; i < 6; i++) coins += `<circle cx="${90 + i * 9}" cy="${214 + (i % 2) * 4}" r="4" fill="${mix(C.sun, C.dune, 0.3)}"/>`;
      return s.out() + `<g transform="translate(-10 190)">${templeMini(c, 1.4, { col: mix(C.cream, C.dune, 0.3), gold: mix(C.sun, C.dune, 0.3) })}</g><g transform="translate(110 206) rotate(-20)">${tbl}</g>${coins}`;
    })();
    const panEl = fx.add(`<g>${panel(S, court, { w: PAN.w, h: PAN.h, k: 'feast' })}</g>`);
    const pTag = fx.add(`<g>${strip(c, tr('święto w Jerozolimie', 'the feast in Jerusalem'), { size: 17 })}</g>`);
    const jMini = S.puppet(fx.add(person(c, sepia({ ...CAST.jesus, halo: false, holdF: `<path d="${c.ribbon([[0, 0], [12, -30], [4, -46]], 2)}" fill="${mix(C.rope, C.dune, 0.3)}"/>` }, 0.35))));
    const doves = [0, 1, 2].map(() => fx.add(`<path d="${c.cut([[-10, 0], [0, -4], [10, -10], [6, 0], [12, 4], [-4, 4]], 0.3, 3)}" fill="${mix(C.cream, C.dune, 0.2)}"/>`));
    const pilgrims = Array.from({ length: 5 }, (_, i) => ({ i, p: S.puppet(fx.add(person(c, sepia({ ...samaritan(c, i + 110), holdB: `<g transform="translate(0 6)">${sheet().p(c.cut(c.blob(0, 0, 10, 8, 8, 0.2), 0.3, 3), mix(C.basket, C.dune, 0.3)).out()}</g>` }, 0.4)))) }));

    return (t, time) => {
      const T = time;
      W.update(t, T);
      /* v43 — on to Galilee */
      const walk = es(t, -0.3, 0.8, ease.out);
      const jx = lerp(420, 790, walk);
      const stop = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      jesus.set({ x: jx, y: FLOOR, s: 1.06, walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined, armF: 14 + stop * 28 + es(t, 2.2, 2.5) * 60, armB: 12 + es(t, 2.2, 2.5) * 60, head: -stop * 10, blink: blinkAt(T) });
      disc.forEach((d) => {
        const x = lerp(260 - d.i * 70, 640 - d.i * 66, walk);
        d.p.set({ x, y: FLOOR + 6 + (d.i % 2) * 6, s: 1.0, walk: walk > 0 && walk < 1 ? x * 0.05 : undefined, head: -stop * 6, blink: blinkAt(T, d.seed) });
      });
      sams.forEach((s) => {
        const wave = Math.max(0, Math.sin(T * 6 + s.i)) * 30;
        s.p.set({ x: 400 + s.i * 56, y: FLOOR - 36, s: 0.72, flip: false, o: 1 - es(t, 0.9, 1.1), armB: 140 + wave * 0.4, armF: 30, blink: blinkAt(T, s.i) });
      });
      /* v44 — no honour in his own country */
      const nk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.95, 2.3, ease.in));
      swing(nazEl, S.portrait ? 820 : 1080, (S.portrait ? 90 : 300) - (1 - nk) * 700, T * nk, 1, 0.7);
      fade(nazEl, nk > 0.001 ? 1 : 0);
      /* v45a — the Galileans welcome Him; they saw the feast */
      const come = es(t, 2.0, 2.6, ease.out);
      gal.forEach((g) => {
        const x = lerp(g.x + 600, g.x, come);
        const open = es(t, 2.5, 2.7);
        const self = es(t, 3.1, 3.3);
        g.p.set({ x, y: FLOOR + 4 + (g.i % 2) * 8, s: 1.0, flip: true, walk: come > 0 && come < 1 ? x * 0.06 : undefined, armF: 20 + open * 70 * (1 - self) + self * (g.i % 2 ? 60 : 20), armB: 12 + open * 90 * (1 - self * 0.5), head: -open * 4, blink: blinkAt(T, g.seed) });
      });
      const pk = es(t, 2.1, 2.45, ease.out);
      const py = PAN.y - (1 - pk) * 700;
      const on = pk > 0.01 ? 1 : 0;
      vis(panEl, { x: PAN.x, y: py, o: on });
      vis(pTag, { x: PAN.x - 140, y: py + 26, r: -3, o: on * es(t, 2.4, 2.55) });
      const whip = Math.max(0, Math.sin(T * 5)) * es(t, 2.4, 2.6) * (1 - es(t, 3.0, 3.15));
      jMini.set({ x: PAN.x - 90, y: py + 214, s: 0.46, o: on * (1 - es(t, 3.0, 3.15) * 0.6), armF: 60 + whip * 80, armB: 20, lean: whip * 4 });
      doves.forEach((d, i) => {
        const k = ((T * 0.3 + i / 3) % 1) * es(t, 2.4, 2.6);
        vis(d, { x: PAN.x + 60 + i * 30 + k * 80, y: py + 180 - k * 150, s: 1.2, r: -20 + Math.sin(T * 12 + i) * 20, o: on && t < 3.1 ? es(t, 2.4, 2.6) * (1 - k * 0.6) : 0 });
      });
      /* v45b — they too had gone to the feast */
      pilgrims.forEach((p) => {
        const u = seg(t, 3.05 + p.i * 0.05, 3.9);
        const x = PAN.x + PAN.w / 2 - 20 - p.i * 30 - u * 170;
        p.p.set({ x, y: py + 236 - u * 14, s: 0.36, flip: true, o: on * es(t, 3.05, 3.2), walk: u > 0 && u < 1 ? x * 0.1 : undefined });
      });

      S.cam.x = kf(t, [[-0.5, -40], [0.8, 0], [1.1, 60], [1.9, 60], [2.3, 20]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.8, 40], [1.1, 0], [2.0, 0], [2.3, -20]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.8, 1.1], [1.1, 1.08], [2.3, 1.02]]);
    };
  },
};
