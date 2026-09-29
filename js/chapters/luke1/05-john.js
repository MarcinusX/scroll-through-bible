// Łk 1,14–17 — still in the Holy Place: Zechariah on his knees, the angel speaking. What he says comes down from the
// flies as painted flats over the altar, one for each saying: joy at the birth (the parents with the child, neighbours
// with lifted hands); great before the Lord (John in a column of light) and no wine nor strong drink (the cup and jar
// crossed out); filled with the Holy Spirit in his mother's womb (the dove over Elizabeth); many of Israel turn back to
// the Lord (a row of people turn round, one by one, towards the light); in the spirit and power of Elijah (the fiery
// chariot lets fall its mantle on John, who walks ahead of the coming light); fathers' hearts turned to their children,
// the disobedient to the wisdom of the just; a people made ready for the Lord.
import { C, CAST, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, ELIZABETH, JOHN_B, LOOK8, holyPlace, HY, gabriel, lily, flat, flatSky, flatHills, fig, johnInArms, babyJohn, dropK,
  wineCup, wineJar, crossOut, dove, flapWings, heart, sparkle, fireWheel, glowDisc, rayBurst, folk,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const ZX = 590, AX = 1010;
const FX = 800, FY = 296, W = 360, H = 236, K = 1.16;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-john',
  beats: [
    { v: 14 },
    { v: 15, text: 'Będzie bowiem wielki w oczach Pana; wina i sycery pić nie będzie' },
    { v: 15, cont: true, text: 'i już w łonie matki napełniony będzie Duchem Świętym.' },
    { v: 16 },
    { v: 17, text: 'on sam pójdzie przed Nim w duchu i mocy Eliasza,' },
    { v: 17, cont: true, text: 'żeby serca ojców nakłonić ku dzieciom, a nieposłusznych - do usposobienia sprawiedliwych,' },
    { v: 17, cont: true, text: 'by przygotować Panu lud doskonały».' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const Hs = holyPlace(S);
    const aGlow = Hs.G.add(`<g>${glowDisc(150, 'halo-glow', 0.85)}</g>`);
    const P = Hs.P;
    const zK = S.puppet(P.add(person(c, { ...ZECHARIAH, pose: 'kneel' })));
    const ang = S.puppet(P.add(gabriel(c, { holdB: lily(c) })));

    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 4 });
    const sky = (a, b) => flatSky(S, W, H, [a, b]);
    const ground = (col, y = 86) => flatHills(c, W, y, col, 6);
    const raise = (m) => m.replace(/class="armBr"/, 'class="armBr" transform="rotate(-150)"').replace(/class="armFr"/, 'class="armFr" transform="rotate(-60)"');
    const figR = (o, x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${raise(person(c, { holdF: '', holdB: '', ...o }))}</g>`;

    /* 1 — joy and gladness; many rejoice at his birth */
    const garl = (() => { let d = ''; for (let i = 0; i < 9; i++) d += c.cut(c.star(-150 + i * 37, -92 + Math.sin(i / 8 * PI) * 16, 8, 4, 5, i), 0.2, 3); return `<path d="${c.ribbon(c.qbez([-170, -100], [0, -60], [170, -100], 16), 2.4)}" fill="${C.moss2}"/><path d="${d}" fill="${C.roseRobe}"/>`; })();
    const f1 = L.add(flat(S, sky(mix(C.halo, C.cream, 0.3), mix(C.peach, C.cream, 0.4)) + ground(mix(C.hillMid, C.sand, 0.4))
      + figR(crowdPerson(c), -140, 104, 0.5, false) + figR(crowdPerson(c), -100, 110, 0.52, false)
      + figR(crowdPerson(c), 110, 106, 0.5, true) + figR(crowdPerson(c), 146, 110, 0.5, true)
      + fig(c, ZECHARIAH, -34, 112, 0.56) + fig(c, { ...ELIZABETH, holdF: johnInArms(c) }, 36, 112, 0.54, true) + garl, { w: W, h: H }));
    const hearts = [0, 1, 2, 3].map((i) => bits.add(`<g>${heart(c, 9, [C.jesusMantle, C.roseRobe][i % 2])}</g>`));

    /* 2 — great before the Lord; no wine, no strong drink */
    const f2 = L.add(flat(S, sky(mix(C.halo, C.cream, 0.2), mix(C.sand, C.cream, 0.5)) + ground(mix(C.sand2, C.dune, 0.3))
      + `<path d="${c.poly([[-90, -118], [-40, -118], [-30, 100], [-100, 100]])}" fill="#fff3cf" opacity=".85"/><circle cx="-65" cy="-40" r="90" fill="url(#halo-glow)"/>`
      + fig(c, JOHN_B, -66, 104, 0.8) + `<g transform="translate(70 90)">${wineCup(c)}</g><g transform="translate(118 90)">${wineJar(c, 66)}</g>`, { w: W, h: H }));
    const xOut = bits.add(`<g>${crossOut(c, 40)}</g>`);

    /* 3 — filled with the Holy Spirit from his mother's womb */
    const f3 = L.add(flat(S, sky(mix(C.skyVeil, C.cream, 0.3), mix(C.halo, C.cream, 0.5)) + ground(mix(C.hillMid, C.sage3, 0.4))
      + `<circle cx="0" cy="-10" r="130" fill="url(#halo-glow)"/>` + fig(c, ELIZABETH, 0, 118, 0.84), { w: W, h: H }));
    const womb = bits.add(`<g>${glowDisc(30, 'warm-glow', 1)}<path d="${c.poly(c.star(0, 0, 9, 3.4, 4, 0))}" fill="${C.star}"/></g>`);
    const dv = bits.add(dove(c));

    /* 4 — many of Israel turn to the Lord: six turn round towards the light */
    const f4 = L.add(flat(S, sky(mix(C.storm, C.skyVeil, 0.55), mix(C.halo, C.cream, 0.2)) + `<rect x="${W / 2 - 110}" y="${-H / 2}" width="120" height="${H}" fill="url(#halo-glow)"/><circle cx="${W / 2 - 10}" cy="-20" r="110" fill="url(#halo-glow)"/>` + ground(mix(C.hillMid, C.sand, 0.3)), { w: W, h: H }));
    const turners = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: bits.add(`<g>${person(c, { ...folk(c), holdF: '', holdB: '' })}</g>`) }));

    /* 5 — in the spirit and power of Elijah, before the Lord */
    const f5 = L.add(flat(S, sky(mix(C.duskViolet, C.peach, 0.4), mix(C.dawn, C.cream, 0.4))
      + `<circle cx="${-W / 2}" cy="40" r="170" fill="url(#halo-glow)"/><path d="${rayBurst(c, { n: 14, r0: 30, r1: 200, spread: 0.04 }).match(/d="([^"]+)"/)[1]}" transform="translate(${-W / 2} 40)" fill="#fff3cf" opacity=".6"/>`
      + ground(mix(C.sand2, C.dune, 0.3), 80) + `<path d="${c.ribbon([[-190, 108], [0, 92], [190, 86]], 16)}" fill="${mix(C.sand, C.cream, 0.4)}"/>`
      + `<g transform="translate(100 -70) scale(.7)">${fireWheel(c, 40)}</g><g transform="translate(60 -64) scale(.6)"><path d="${c.cut([[-40, 10], [40, -20], [70, 0], [40, 20], [-30, 30]], 1, 5)}" fill="${C.sunDeep}"/></g>`, { w: W, h: H }));
    const jWalk = S.puppet(bits.add(person(c, { ...JOHN_B, mantle: null })));
    const jMant = S.puppet(bits.add(person(c, { ...JOHN_B, mantle: shade(C.leather, 0.1) })));
    const mantle = bits.add(`<g>${sheet().p(c.cut([[-26, -10], [26, -14], [30, 10], [0, 18], [-30, 12]], 0.8, 5), shade(C.leather, 0.1)).out()}</g>`);

    /* 6 — fathers' hearts to the children; the disobedient to the wisdom of the just */
    const f6 = L.add(flat(S, sky(mix(C.skyVeil, C.cream, 0.4), mix(C.peach, C.cream, 0.5)) + ground(mix(C.hillMid, C.sand, 0.4))
      + `<path d="${c.ribbon([[-6, -118], [-6, 118]], 3)}" fill="${C.haloRim}" opacity=".7"/>`
      + fig(c, { ...crowdPerson(c), hairStyle: 'short', robe: C.roseRobe }, -40, 112, 0.36, true)
      + `<path d="${c.ribbon([[20, 104], [70, 92], [110, 70], [160, 50]], 12)}" fill="${mix(C.halo, C.sand, 0.4)}"/><path d="${c.ribbon([[20, 108], [40, 118], [30, 130]], 10)}" fill="${mix(C.storm, C.sand2, 0.5)}"/>`
      + `<circle cx="170" cy="30" r="70" fill="url(#halo-glow)"/>` + fig(c, CAST.john, 120, 76, 0.42, true) + fig(c, CAST.andrew, 150, 64, 0.38, true), { w: W, h: H }));
    const father = bits.add(`<g>${person(c, { ...crowdPerson(c), hairStyle: 'short', beard: 'full', robe: C.dustyBlue, holdF: '', holdB: '' })}</g>`);
    const rebel = bits.add(`<g>${person(c, { ...crowdPerson(c), hairStyle: 'curly', beard: 'short', robe: C.plumRobe, holdF: '', holdB: '' })}</g>`);
    const fHeart = bits.add(`<g>${heart(c, 11)}</g>`);

    /* 7 — a people made ready for the Lord */
    const people = []; for (let i = 0; i < 9; i++) people.push({ x: -150 + i * 26 + c.rr(-5, 5), y: 104 + (i % 3) * 6, s: 0.4, o: folk(c) });
    const f7 = L.add(flat(S, sky(mix(C.dawn, C.halo, 0.4), mix(C.cream, C.halo, 0.4))
      + `<circle cx="${W / 2 - 20}" cy="0" r="150" fill="url(#halo-glow)"/>` + ground(mix(C.hillMid, C.sand, 0.4), 70)
      + `<path d="${c.poly([[-190, 120], [-190, 96], [170, 20], [190, 20], [190, 120]])}" fill="${mix(C.halo, C.sand, 0.45)}"/>`
      + people.sort((a, b) => a.y - b.y).map((m) => fig(c, m.o, m.x, m.y, m.s)).join('')
      + `<g transform="translate(150 16)"><path d="${c.poly(c.star(0, -8, 14, 5, 8, 0))}" fill="${C.star}"/></g>`, { w: W, h: H }));

    const flats = [f1, f2, f3, f4, f5, f6, f7];

    return (t, time) => {
      const T = time;
      Hs.smoke(t, T, 1, 0.3);
      const speak = Math.max(0, Math.sin(t * PI * 2)) * 0.5;
      ang.set({ x: AX, y: HY + 4, s: 1.02, flip: true, armF: 50 + speak * 30, armB: 26, head: -4, blink: blinkAt(T, 2) });
      pose(aGlow, { x: AX, y: HY - 150, s: 1, o: 1 });
      zK.set({ x: ZX, y: HY, s: 1, flip: false, armF: 50, armB: 30, head: -10, blink: blinkAt(T, 1) });

      const KK = flats.map((f, i) => dropK(t, i, i === 6 ? 99 : i + 1.1, 0.28));
      const Y = KK.map((k) => lerp(-1500, FY, k));
      const YY = (i, dy) => Y[i] + dy * K;
      flats.forEach((f, i) => pose(f, { x: FX, y: Y[i], s: K, o: KK[i] > 0.002 ? 1 : 0 }));
      const on = (i, extra = 1) => (KK[i] > 0.002 ? extra : 0);

      /* 1 */ hearts.forEach((h, i) => { const kk = seg(t, 0.35 + i * 0.1, 0.95 + i * 0.1); pose(h, { x: X(-90 + i * 60), y: YY(0, 20 - kk * 70), s: K * 0.6 + K * bump(t, 0.35 + i * 0.1, 0.95 + i * 0.1) * 0.6, o: on(0, bump(t, 0.35 + i * 0.1, 0.95 + i * 0.1)) }); });
      /* 2 */ const xk = es(t, 1.5, 1.62, ease.back);
      pose(xOut, { x: X(94), y: YY(1, 58), s: Math.max(0.001, xk * K), o: on(1, xk > 0.01 ? 1 : 0) });
      /* 3 */ const dk = es(t, 2.2, 2.55, ease.out);
      pose(dv, { x: X(lerp(150, 20, dk)), y: YY(2, -60 - (1 - dk) * 40), s: 0.8 * K, o: on(2) });
      if (KK[2] > 0.002) flapWings(dv, T || t * 3, 30, 7, -6);
      pose(womb, { x: X(8), y: YY(2, 48), s: K * (0.5 + es(t, 2.45, 2.7) * 0.8), o: on(2, es(t, 2.45, 2.7)) });
      /* 4 */ turners.forEach((p) => { const tk = es(t, 3.3 + p.i * 0.07, 3.38 + p.i * 0.07); pose(p.el, { x: X(-150 + p.i * 48), y: YY(3, 104 + (p.i % 2) * 6), sx: (tk > 0.5 ? 1 : -1) * 0.42 * K, sy: 0.42 * K, o: on(3) }); });
      /* 5 */ const wk = seg(t, 4.2, 5.0);
      const jo = { x: X(-60 + wk * 60), y: YY(4, 96), s: 0.52 * K, flip: false, walk: t > 4.2 && t < 5 ? t * 26 : undefined, armF: 16, armB: 10 };
      const worn = t > 4.66;
      jWalk.set({ ...jo, o: on(4, worn ? 0 : 1) });
      jMant.set({ ...jo, o: on(4, worn ? 1 : 0) });
      const mk = es(t, 4.3, 4.65, ease.in);
      pose(mantle, { x: X(lerp(60, -60 + seg(t, 4.2, 5.0) * 60, mk)), y: YY(4, lerp(-60, 20, mk)), r: (1 - mk) * 60, s: 0.8 * K, o: on(4, t > 4.28 && !worn ? 1 : 0) });
      /* 6 */ const ft = es(t, 5.25, 5.33), rt = es(t, 5.5, 5.58);
      pose(father, { x: X(-90), y: YY(5, 112), sx: (ft > 0.5 ? 1 : -1) * 0.5 * K, sy: 0.5 * K, o: on(5) });
      pose(fHeart, { x: X(-62), y: YY(5, 30), s: Math.max(0.001, es(t, 5.33, 5.5, ease.back) * K), o: on(5, es(t, 5.33, 5.4)) });
      pose(rebel, { x: X(50), y: YY(5, 112), sx: (rt > 0.5 ? 1 : -1) * 0.46 * K, sy: 0.46 * K, o: on(5) });

      S.cam.z = 1.04;
      S.cam.y = -10;
    };
  },
};
