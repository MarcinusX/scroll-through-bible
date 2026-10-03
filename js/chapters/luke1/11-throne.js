// Łk 1,32–33 — Mary kneels, the angel speaks, and his words come down as painted flats between them: great, and called
// the Son of the Most High (the Child in the light that streams from on high); the Lord God will give him the throne of
// his father David (David with his harp beside an empty golden throne, and a crown comes down onto it); he will reign over
// the house of Jacob for ever (the twelve tents of the tribes round the throne); and of his kingdom there will be no end
// (a ring without end draws itself round the crown).
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  MARY, DAVID, maryRoom, RY, gabriel, lily, flat, flatSky, flatHills, fig, flatText, baby, throne, harp, crown, tent,
  eternityRing, drawRing, glowDisc, rayBurst, sparkle, dropK,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const MX = 640, AX = 990;
const FX = 815, FY = 300, W = 360, H = 236, K = 1.12;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-throne',
  beats: [
    { v: 32, text: 'Będzie On wielki i będzie nazwany Synem Najwyższego,' },
    { v: 32, cont: true, text: 'a Pan Bóg da Mu tron Jego praojca, Dawida.' },
    { v: 33, text: 'Będzie panował nad domem Jakuba na wieki,' },
    { v: 33, cont: true, text: 'a Jego panowaniu nie będzie końca».' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = maryRoom(S, undefined, { tableX: S.portrait ? 490 : 330 });   // phone: the table and the rod inside the screen
    const mGlow = R.G.add(`<g>${glowDisc(130, 'halo-glow', 1)}</g>`);
    const aGlow = R.G.add(`<g>${glowDisc(180, 'halo-glow', 1)}</g>`);
    const P = R.P;
    const m = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const ang = S.puppet(P.add(gabriel(c, { holdB: lily(c) })));
    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });

    /* 1 — Son of the Most High */
    const f1 = L.add(flat(S, flatSky(S, W, H, [mix(C.halo, C.cream, 0.1), mix(C.skyVeil, C.cream, 0.4)])
      + `<g transform="translate(0 -118)">${rayBurst(c, { n: 16, r0: 10, r1: 260, spread: 0.05, o: 0.6 })}</g><circle cx="0" cy="-118" r="140" fill="url(#halo-glow)"/>`
      + `<path d="${c.poly([[-40, -118], [40, -118], [70, 60], [-70, 60]])}" fill="#fff3cf" opacity=".6"/><circle cx="0" cy="30" r="80" fill="url(#halo-glow)"/>`
      + `<g transform="translate(-14 52) scale(1.5)">${baby(c)}</g>` + flatText(0, 100, tr('Syn Najwyższego', 'Son of the Most High'), 22), { w: W, h: H }));
    /* 2 — the throne of his father David */
    const f2 = L.add(flat(S, flatSky(S, W, H, [mix(C.halo, C.cream, 0.4), mix(C.peach, C.cream, 0.5)])
      + flatHills(c, W, 96, mix(C.sand2, C.hillMid, 0.3), 5) + `<circle cx="40" cy="-10" r="120" fill="url(#halo-glow)"/>`
      + fig(c, { ...DAVID, holdF: `<g transform="translate(0 30) rotate(20)">${harp(c)}</g>` }, -110, 112, 0.62)
      + `<g transform="translate(-106 -12)">${crown(c)}</g>`
      + `<g transform="translate(50 108) scale(.72)">${throne(c)}</g>`, { w: W, h: H }));
    const cr = bits.add(`<g>${glowDisc(40, 'halo-glow', 1)}<g transform="scale(1.3)">${crown(c)}</g></g>`);
    /* 3 — the house of Jacob for ever: twelve tents round the throne */
    let tents = '';
    for (let i = 0; i < 12; i++) { const a = PI * (0.05 + (i / 11) * 0.9); tents += `<g transform="translate(${(-Math.cos(a) * 150).toFixed(0)} ${(80 - Math.sin(a) * 50).toFixed(0)}) scale(.36)">${tent(c, { col: [C.wheatRobe, C.sageRobe, C.roseRobe, C.skyVeil][i % 4] })}</g>`; }
    const f3 = L.add(flat(S, flatSky(S, W, H, [mix(C.duskViolet, C.skyVeil, 0.4), mix(C.dawn, C.cream, 0.4)])
      + flatHills(c, W, 40, mix(C.sand2, C.dune, 0.3), 6) + `<circle cx="0" cy="-10" r="110" fill="url(#halo-glow)"/>`
      + `<g transform="translate(0 40) scale(.5)">${throne(c)}</g>` + tents, { w: W, h: H }));
    /* 4 — no end to his kingdom */
    const f4 = L.add(flat(S, flatSky(S, W, H, [mix(C.night, C.indigo, 0.4), mix(C.indigo, C.duskViolet, 0.5)])
      + (() => { let d = ''; for (let i = 0; i < 40; i++) d += c.poly(c.circ(c.rr(-170, 170), c.rr(-110, 110), c.rr(1, 2.4), 6)); return `<path d="${d}" fill="${C.star}"/>`; })()
      + `<circle r="120" fill="url(#halo-glow)" opacity=".7"/><g transform="translate(0 18) scale(2)">${crown(c)}</g>`, { w: W, h: H }));
    const ring = bits.add(`<g>${eternityRing(c, 96, 7, 24)}</g>`);

    const flats = [f1, f2, f3, f4];
    return (t, time) => {
      const T = time;
      const speak = Math.max(0, Math.sin(t * PI * 2)) * 0.5;
      ang.set({ x: AX, y: RY + 4, s: 1.02, flip: true, armF: 50 + speak * 30, armB: 26, head: -4, blink: blinkAt(T, 2) });
      m.set({ x: MX, y: RY, s: 1, flip: false, armF: 60, armB: 40, head: -10, blink: blinkAt(T, 3) });
      pose(mGlow, { x: MX, y: RY - 110, s: 1, o: 0.8 });
      pose(aGlow, { x: AX, y: RY - 150, s: 1, o: 1 });
      pose(R.doorLight, { o: 1 });

      const KK = flats.map((f, i) => dropK(t, i, i === 3 ? 99 : i + 1.1, 0.28));
      const Y = KK.map((k) => lerp(-1500, FY, k));
      flats.forEach((f, i) => pose(f, { x: FX, y: Y[i], s: K, o: KK[i] > 0.002 ? 1 : 0 }));
      /* the crown comes down onto David's throne */
      const ck = es(t, 1.3, 1.62, ease.out);
      pose(cr, { x: X(50), y: Y[1] + lerp(-150, 2, ck) * K, s: K * 0.8, o: KK[1] > 0.002 ? 1 : 0 });
      /* the ring without end */
      drawRing(ring, es(t, 3.15, 3.7));
      pose(ring, { x: FX, y: Y[3] + 6 * K, s: K, r: t * 8, o: KK[3] > 0.002 ? 1 : 0 });

      S.cam.z = 1.04;
      S.cam.y = -10;
    };
  },
};
