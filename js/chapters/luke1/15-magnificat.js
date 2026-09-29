// Łk 1,46–50 — the Magnificat, in the evening courtyard: Mary stands with lifted hands, Elizabeth sits and listens.
// "My soul magnifies the Lord" — a small flame of her soul rises into the light above; "my spirit rejoices in God my
// Saviour" — doves fly up round her. "He has looked on the lowliness of his handmaid" — she bows low, and a column of light
// comes down on her. Then painted flats come down for each line: all generations call her blessed (row after row of
// people, down the ages, towards her); the Mighty has done great things for me (a great star opens over a small house in
// Nazareth); holy is his name (the word in gold among rays); his mercy from generation to generation (a rainbow arches
// over family after family).
import { C, person, crowdPerson, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import {
  MARY, ELIZABETH, HILLEVE, hillHome, homeLight, hillFront, HGY, soulLight, dove, flapWings, glowDisc, rayBurst, sparkle, flat, flatSky, flatHills,
  fig, flatText, goldWord, dropK, folk, tr, es, ease, bump, seg, PI, FONT,
} from './lib.js';
import { house } from '../../assets/nature.js';

const MX = 800, EX = 585;
const FX = 800, FY = 285, W = 360, H = 230, K = 1.1;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-magnificat',
  beats: [
    { v: 46 },
    { v: 47 },
    { v: 48, text: 'Bo wejrzał na uniżenie Służebnicy swojej.' },
    { v: 48, cont: true, text: 'Oto bowiem błogosławić mnie będą odtąd wszystkie pokolenia,' },
    { v: 49, text: 'gdyż wielkie rzeczy uczynił mi Wszechmocny.' },
    { v: 49, cont: true, text: 'Święte jest Jego imię -' },
    { v: 50 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const EVE2 = ['#9d8fb6', '#e6b49e', '#f3d2b0'];
    const Wd = hillHome(S, HILLEVE);
    const high = Wd.G.add(`<g>${glowDisc(230, 'halo-glow', 1)}${rayBurst(c, { n: 22, r0: 40, r1: 300, spread: 0.025, o: 0.35 })}</g>`);
    const column = Wd.G.add(`<g><path d="${c.poly([[-50, -760], [50, -760], [110, 0], [-110, 0]])}" fill="#fff3cf" opacity=".55"/>${glowDisc(150, 'halo-glow', 1).replace('<circle', '<circle cy="-120"')}</g>`);
    const mGlow = Wd.G.add(`<g>${glowDisc(170, 'halo-glow', 1)}</g>`);
    const P = Wd.P;
    const e = S.puppet(P.add(person(c, { ...ELIZABETH, pose: 'sit' })));
    const m = S.puppet(P.add(person(c, MARY)));
    const mK = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const up = S.layer({ par: 0.25, sh: 6 });
    const soul = up.add(`<g>${soulLight(c, 22)}</g>`);
    const doves = [0, 1, 2].map((i) => ({ i, el: up.add(dove(c)) }));

    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });
    /* 1 — all generations: rows of people down the ages */
    const f1 = L.add(flat(S, flatSky(S, W, H, [mix(C.halo, C.cream, 0.3), mix(C.dawn, C.cream, 0.4)]) + flatHills(c, W, 20, mix(C.hillMid, C.sand, 0.35), 5)
      + `<circle cx="0" cy="-70" r="80" fill="url(#halo-glow)"/>` + fig(c, MARY, 0, -40, 0.36), { w: W, h: H }));
    const rows = [0, 1, 2].map((r) => {
      let g = '';
      const n = 7 - r, sc = 0.28 + r * 0.08;
      for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * (48 + r * 14); g += `<g transform="translate(${x.toFixed(0)} 0) scale(${x > 0 ? -sc : sc} ${sc})">${person(c, { ...folk(c), holdF: '', holdB: '' })}</g>`; }
      return bits.add(`<g>${g}</g>`);
    });
    /* 2 — great things for me: a great star over a small house */
    const f2 = L.add(flat(S, flatSky(S, W, H, [mix(C.night, C.indigo, 0.3), mix(C.duskViolet, C.indigo, 0.4)]) + flatHills(c, W, 70, mix(C.hillMid, C.indigo, 0.45), 8)
      + (() => { let d = ''; for (let i = 0; i < 30; i++) d += c.poly(c.circ(c.rr(-170, 170), c.rr(-110, 40), c.rr(1, 2.2), 6)); return `<path d="${d}" fill="${C.star}"/>`; })()
      + house(c, -30, 84, 64, 46, { lit: true }), { w: W, h: H }));
    const star = bits.add(`<g>${glowDisc(110, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 20, r1: 130, spread: 0.04, o: 0.6 })}<path d="${c.poly(c.star(0, 0, 30, 11, 8, 0))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 10, 12))}" fill="${C.star}"/></g>`);
    /* 3 — holy is his name */
    const f3 = L.add(flat(S, flatSky(S, W, H, [mix(C.indigo, C.night, 0.3), mix(C.plumRobe, C.indigo, 0.4)])
      + `<g>${rayBurst(c, { n: 24, r0: 50, r1: 260, spread: 0.03, o: 0.45 })}</g><circle r="110" fill="url(#halo-glow)"/>`
      + `<g transform="translate(0 4)">${goldWord(c, tr('Święty', 'Holy'), { size: 46 })}</g>`, { w: W, h: H }));
    /* 4 — mercy from generation to generation: a rainbow over the families */
    let fams = '';
    [-130, -60, 10, 80, 140].forEach((x, i) => { fams += fig(c, folk(c, true), x - 12, 108, 0.34) + fig(c, folk(c, false), x + 12, 108, 0.32, true) + fig(c, { ...folk(c), hairStyle: 'short', beard: 'none' }, x + 1, 108, 0.2); });
    const f4 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.cream, 0.3), mix(C.dawn, C.cream, 0.4)]) + flatHills(c, W, 70, mix(C.hillMid, C.sand, 0.35), 6) + fams, { w: W, h: H }));
    const bows = [C.jesusMantle, C.wheat, C.sageRobe, C.dustyBlue, C.lavender].map((col, i) => bits.add(`<g><path d="${c.ribbon(c.arc(0, 0, 150 - i * 11, 120 - i * 10, PI, 2 * PI, 30), 11)}" fill="${col}" opacity=".9"/></g>`));

    const flats = [f1, f2, f3, f4];
    hillFront(S);

    return (t, time) => {
      const T = time;
      Wd.sk.blend(HILLEVE, EVE2, es(t, 0, 7));
      homeLight(Wd.H, { open: 0.6, lit: 0.6 });

      /* v46: my soul magnifies the Lord */
      const praise = es(t, 0.05, 0.3);
      const bowK = es(t, 2.05, 2.12) * (1 - es(t, 2.95, 3.02));
      m.set({ x: MX, y: HGY, s: 1, flip: false, o: 1 - bowK, armF: 20 + praise * 76, armB: 20 + praise * 130, head: -praise * 14, blink: blinkAt(T, 3) });
      mK.set({ x: MX, y: HGY, s: 1, flip: false, o: bowK, armF: 40, armB: 10, head: 20, lean: 12, blink: blinkAt(T, 3) });
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, armF: 30, armB: 10, head: -8, blink: blinkAt(T, 1) });
      pose(mGlow, { x: MX, y: HGY - 130, s: 0.5 + praise * 0.6, o: praise });
      const sk = seg(t, 0.2, 0.9);
      pose(soul, { x: MX + Math.sin(sk * 8) * 10, y: lerp(HGY - 150, 170, ease.io(sk)), s: 1 - sk * 0.3, o: t > 0.2 && sk < 1 ? 1 : 0 });
      const hk = es(t, 0.6, 0.95);
      pose(high, { x: MX, y: 150, s: 0.4 + hk * 0.7, r: t * 3, o: hk * (1 - es(t, 2.9, 3.2)) });

      /* v47: my spirit rejoices — doves fly up */
      doves.forEach((d) => {
        const k = seg(t, 1.05 + d.i * 0.1, 1.9 + d.i * 0.1);
        const dir = d.i === 1 ? 0 : d.i === 0 ? -1 : 1;
        pose(d.el, { x: MX + dir * 60 + dir * k * 260, y: HGY - 200 - k * 420, s: 0.9, sx: dir < 0 ? -0.9 : 0.9, o: k > 0 && k < 1 ? Math.min(1, (1 - k) * 4) : 0 });
        if (k > 0 && k < 1) flapWings(d.el, T || t * 3, 34, 8, -4);
      });

      /* v48a: he looked on the lowliness of his handmaid */
      const ck = es(t, 2.1, 2.4);
      pose(column, { x: MX, y: HGY, o: ck * (1 - es(t, 2.95, 3.15)) });

      /* the flats */
      const KK = flats.map((f, i) => dropK(t, 3 + i, i === 3 ? 99 : 4.1 + i, 0.28));
      const Y = KK.map((k) => lerp(-1500, FY, k));
      flats.forEach((f, i) => pose(f, { x: FX, y: Y[i], s: K, o: KK[i] > 0.002 ? 1 : 0 }));
      rows.forEach((r, i) => { const k = es(t, 3.15 + i * 0.12, 3.35 + i * 0.12, ease.out); pose(r, { x: FX, y: Y[0] + (20 + i * 38) * K + (1 - k) * 30, s: K, o: KK[0] > 0.002 ? k : 0 }); });
      const st = es(t, 4.15, 4.5, ease.back);
      pose(star, { x: X(-2), y: Y[1] - 50 * K, s: Math.max(0.001, st) * K, r: t * 6, o: KK[1] > 0.002 && st > 0.01 ? 1 : 0 });
      bows.forEach((b, i) => { const k = es(t, 6.15 + i * 0.06, 6.4 + i * 0.06); pose(b, { x: FX, y: Y[3] + 98 * K, sx: K * Math.max(0.001, k), sy: K, o: KK[3] > 0.002 && k > 0.01 ? 1 : 0 }); });

      S.cam.z = 1.04 + bump(t, 1.9, 3.2) * 0.04;
      S.cam.y = 10;
    };
  },
};
