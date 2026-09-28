// Mt 1,20–21 — Joseph asleep on the flat roof of his house under the stars. A dream opens over him like a pale cloud,
// and in it an angel of the Lord in light. "Joseph, son of David" — David's crowned medallion shines; "do not be afraid
// to take Mary" — Mary appears, and the grey cloud of his fear over the sleeper melts. "What is conceived in her is of the
// Holy Spirit" — the dove over her. "She will bear a son, and you shall call his name Jesus" — the Child in her arms and
// the name in gold; "for he will save his people from their sins" — the dark stones over a little crowd crack and fall.
import { C, CAST, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { stars, band, town } from '../../assets/nature.js';
import {
  NIGHT, STARRY, RIM, ICON, JOSEPH, MARY, DAVID, medal, angel, lyingPerson, dreamCloud, dove, flapWings, glowDisc, rayBurst, sparkle,
  hungGold, childInArms, tint, captives, glowStar, elder,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { crowdPerson } from '../kit.js';

const RY = 612;                   // the roof
const SX = 720;                   // the sleeper (head at SX + 88)

export default {
  id: 'mt1-dream',
  beats: [
    { v: 20, text: 'Gdy powziął tę myśl, oto anioł Pański ukazał mu się we śnie i rzekł:' },
    { v: 20, cont: true, text: '«Józefie, synu Dawida, nie bój się wziąć do siebie Maryi, twej Małżonki;' },
    { v: 20, cont: true, text: 'albowiem z Ducha Świętego jest to, co się w Niej poczęło.' },
    { v: 21, text: 'Porodzi Syna, któremu nadasz imię Jezus,' },
    { v: 21, cont: true, text: 'On bowiem zbawi swój lud od jego grzechów».' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const NC = NIGHT[1];
    const sk = sky(S, STARRY);
    S.layer({ par: 0.02, sh: 1, flat: true }).add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 540, n: 260 }));

    /* ---------- the roofs of Nazareth at night; Joseph's roof in front ---------- */
    const far = S.layer({ par: 0.06, sh: 2 });
    const ffn = c.wave(560, [14, 6, 3], [900, 320, 120]);
    far.add(tint(band(c, { y: 560, color: C.hillFar }).markup + town(c, { x: 800, y: 580, n: 14, spread: 1300, sc: 0.8 }), NC, 0.62));
    const roof = S.layer({ par: 0.2, sh: 4 });
    const rs = sheet();
    rs.p(c.cut([[280, 1900], [280, RY], [1320, RY], [1320, 1900]], 0.6, 10), tint(C.plaster, NC, 0.45));
    rs.p(c.cut([[272, RY - 4], [1328, RY - 4], [1328, RY + 10], [272, RY + 10]], 0.4, 8), tint(C.roof, NC, 0.4));
    rs.p(c.cut([[272, RY - 4], [272, RY - 30], [292, RY - 32], [292, RY - 4]], 0.3, 5) + c.cut([[1308, RY - 4], [1308, RY - 30], [1328, RY - 32], [1328, RY - 4]], 0.3, 5), tint(C.plaster2, NC, 0.4));
    rs.p(c.cut([[SX - 60, RY - 2], [SX - 50, RY - 10], [SX + 130, RY - 12], [SX + 142, RY - 2]], 0.5, 6), tint(C.wheatRobe, NC, 0.3));
    rs.p(c.cut(c.blob(SX + 112, RY - 16, 26, 9, 10, 0.1), 0.4, 4), tint(C.skyVeil, NC, 0.2));
    roof.add(rs.out());
    const sleeper = roof.add(`<g>${lyingPerson(c, JOSEPH, 0.9)}</g>`);
    const fear = roof.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 40, 18, 12, 0.3), 1.2, 4) + c.cut(c.blob(-26, 8, 20, 12, 10, 0.3), 1, 4), mix(C.storm, C.stone2, 0.3)).x(c.ribbon([[-24, 0], [-12, -6], [0, 4], [12, -6], [24, 2]], 2), C.inkSoft, 'opacity=".6"').out()}</g>`);

    /* ---------- the dream ---------- */
    const DR = S.layer({ par: 0.12, sh: 2 });
    const cloud = DR.add(`<g opacity=".94">${dreamCloud(c, 820, 400, { fill: mix(mix(C.skyVeil, C.lavender, 0.4), NIGHT[2], 0.5), tx: SX + 88 - 800, ty: 240 })}</g>`);
    const glowL = S.layer({ par: 0.12, sh: 1, flat: true });
    const aGlow = glowL.add(`<g>${glowDisc(170, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 40, r1: 190, spread: 0.035, color: '#fff3cf', o: 0.3 })}</g>`);
    const mGlow = glowL.add(`<g>${glowDisc(130, 'halo-glow', 1)}</g>`);
    const cGlow = glowL.add(`<g>${glowDisc(180, 'halo-glow', 1)}${rayBurst(c, { n: 18, r0: 30, r1: 210, spread: 0.03, color: '#fff3cf', o: 0.3 })}</g>`);
    const V = S.layer({ par: 0.12, sh: 5 });
    const ang = S.puppet(V.add(angel(c, { robe: C.linen, mantle: C.halo })));
    const mary = S.puppet(V.add(person(c, MARY)));
    const maryC = S.puppet(V.add(person(c, { ...MARY, holdF: childInArms(c) })));
    const davidM = V.add(medal(S, DAVID, { r: 40, ...RIM.king, king: true, name: tr('syn Dawida', 'son of David'), size: 20 }));
    const dv = V.add(dove(c));
    const name = V.add(hungGold(c, tr('Jezus', 'Jesus'), { size: 34 }));
    // his people, and the dark stones of their sins over them
    const folkEl = V.add(`<g>${[[-80, 0], [-40, 6], [0, -2], [40, 5], [80, 0], [-60, 14], [60, 12]].map(([x, y], i) => `<g transform="translate(${x} ${y}) scale(${i % 2 ? -0.5 : 0.5} .5)">${person(c, { ...crowdPerson(c), holdF: '', holdB: '' })}</g>`).join('')}</g>`);
    const stones = [[-70, -140], [-20, -160], [30, -138], [76, -156], [0, -120]].map(([x, y], i) => ({ x, y, i, el: V.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 16, 12, 8, 0.35), 1, 3), mix(C.storm2, C.soilDark, 0.5)).out()}</g>`) }));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => V.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    const AX = 1040, AY = 500, MX = 580, MY = 500, FX = 800, FY = 506;

    return (t, time) => {
      const breathe = time ? Math.sin(time * 1.4) * 1.2 : 0;
      pose(sleeper, { x: SX, y: RY - 8 + breathe * 0.4 });

      /* v20a: the dream opens; the angel of the Lord in light */
      const dream = es(t, 0.1, 0.45, ease.out);
      pose(cloud, { x: 800, y: 330, s: Math.max(0.001, 0.3 + dream * 0.7), o: dream > 0.002 ? 1 : 0 });
      sk.blend(STARRY, ['#1c2352', '#2e3a70', '#51598c'], dream);
      const aIn = es(t, 0.36, 0.62);
      const speak = bump(t, 1.05, 1.6) + bump(t, 2.05, 2.5) + bump(t, 3.05, 3.5) + bump(t, 4.05, 4.5);
      ang.set({ x: AX, y: AY, s: 0.9, flip: true, o: aIn, armF: 40 + aIn * 30 + es(t, 1.3, 1.6) * 30 - es(t, 2.9, 3.2) * 30, armB: 30 + speak * 20, head: -4, blink: blinkAt(time, 2) });
      pose(aGlow, { x: AX - 4, y: AY - 150, s: 0.6 + aIn * 0.5, r: t * 4, o: aIn });

      /* v20b: son of David; do not fear to take Mary */
      const dm = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(davidM, { x: 800, y: 250, s: Math.max(0.001, dm), o: dm > 0.002 ? 1 : 0 });
      const mIn = es(t, 1.3, 1.6);
      const holding = es(t, 3.2, 3.3);
      mary.set({ x: MX, y: MY, s: 0.84, flip: false, o: mIn * (1 - holding), armF: 20 + es(t, 2.4, 2.7) * 30, armB: es(t, 2.4, 2.7) * 40, head: -es(t, 2.2, 2.5) * 10, blink: blinkAt(time, 3) });
      maryC.set({ x: MX, y: MY, s: 0.84, flip: false, o: holding, armF: 70, armB: 30, head: 10, blink: blinkAt(time, 3) });
      const fearK = es(t, 1.1, 1.3) * (1 - es(t, 1.55, 1.8));
      pose(fear, { x: SX + 60, y: RY - 70 - (1 - fearK) * 20, s: 0.5 + fearK * 0.5, o: fearK });

      /* v20c: of the Holy Spirit — the dove over her */
      const dk = es(t, 2.08, 2.45, ease.out);
      pose(dv, { x: lerp(820, MX + 20, dk), y: lerp(120, MY - 250, dk), s: 1, o: t > 2.05 && t < 3.1 ? 1 : es(t, 3.1, 3.3) > 0 ? 1 - es(t, 3.1, 3.3) : 0 });
      if (t > 2.05 && t < 3.3) flapWings(dv, time || t * 3, 30, 7, -6);
      const mg = es(t, 2.3, 2.6);
      pose(mGlow, { x: MX, y: MY - 110, s: 0.6 + mg * 0.5 + es(t, 3.2, 3.5) * 0.3, o: mg });

      /* v21a: she will bear a Son — the Child in her arms; his name, Jesus, in gold */
      const nk = es(t, 3.3, 3.62, ease.out);
      pose(name, { x: 800, y: lerp(-500, 214, nk), r: Math.sin(t * 3) * 1.4, o: nk > 0.002 ? 1 : 0 });
      const ck = es(t, 3.2, 3.5);
      pose(cGlow, { x: MX + 50, y: MY - 110, s: 0.5 + ck * 0.5 + es(t, 4.2, 4.5) * 0.3, r: t * 4, o: ck });

      /* v21b: he will save his people from their sins — the dark stones crack and fall */
      const pk = es(t, 4.0, 4.25);
      pose(folkEl, { x: FX, y: FY, s: 1, o: pk });
      stones.forEach((st) => {
        const fall = es(t, 4.45 + st.i * 0.04, 4.85 + st.i * 0.04, ease.in);
        pose(st.el, { x: FX + st.x + fall * st.x * 0.6, y: FY + st.y + fall * 260 + Math.sin(time * 1.5 + st.i) * 2 * (1 - fall), r: fall * 200, o: pk * (1 - fall) });
      });
      sparks.forEach((sp, i) => { const kk = seg(t, 4.4 + i * 0.04, 4.9 + i * 0.04); pose(sp, { x: FX - 70 + i * 28, y: FY - 130 - kk * 60, s: 1 - kk * 0.5, r: t * 90, o: bump(t, 4.4 + i * 0.04, 4.9 + i * 0.04) }); });

      S.cam.z = 1.02 + es(t, 0.3, 0.8) * 0.04;
      S.cam.y = -10;
    };
  },
};
