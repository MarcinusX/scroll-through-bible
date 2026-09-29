// Łk 1,72–75 — the Benedictus goes on as night comes: to show mercy to our fathers and remember his holy covenant (the
// tablets of the covenant glowing under a rainbow that draws itself over the three fathers); the oath he swore to our
// father Abraham (Abraham under the stars, his hand raised, a golden seal shining over him); that, delivered from our
// enemies, we might serve him without fear (a freed people walk up the road to the Temple with their offerings, the
// broken chains left behind); in holiness and righteousness all our days (the sun and then the moon pass over a family
// at prayer, and their lamp keeps burning).
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, ELIZABETH, ABRAHAM, HILLEVE, HILLNIGHT, hillHome, homeLight, hillFront, HGY, johnInArms, glowDisc, rayBurst, flat, flatSky, flatHills, fig,
  lawTablets, moonDisc, dropK, folk, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { sun as sunCut } from '../../assets/nature.js';
import { sanctuary } from '../mark11/lib.js';
import { lamb } from '../mark11/lib.js';

const ZX = 820, EX = 620;
const FX = 800, FY = 285, W = 360, H = 230, K = 1.1;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-covenant',
  beats: [
    { v: 72 },
    { v: 73 },
    { v: 74 },
    { v: 75 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const EV = ['#8f86b0', '#e0ad9a', '#f0cfae'], LATE = ['#4c4f84', '#a58aa2', '#d9a891'];
    const Wd = hillHome(S, EV);
    const zGlow = Wd.G.add(`<g>${glowDisc(180, 'halo-glow', 1)}</g>`);
    const P = Wd.P;
    const z = S.puppet(P.add(person(c, ZECHARIAH)));
    const e = S.puppet(P.add(person(c, { ...ELIZABETH, holdF: johnInArms(c) })));
    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });

    /* 1 — mercy to our fathers, his holy covenant */
    const f1 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.cream, 0.3), mix(C.dawn, C.cream, 0.4)]) + flatHills(c, W, 96, mix(C.hillMid, C.sand, 0.35), 5)
      + `<circle cx="0" cy="40" r="80" fill="url(#halo-glow)"/><g transform="translate(0 70)">${lawTablets(c, { w: 40, h: 56 })}</g>`
      + fig(c, ABRAHAM, -120, 112, 0.46) + fig(c, { ...ABRAHAM, robe: C.sageRobe, mantle: C.wood3, hairStyle: 'wrap', veil: C.stone }, -75, 112, 0.44) + fig(c, { ...ABRAHAM, robe: C.dustyBlue, mantle: C.clayMantle, beardColor: C.greyHair }, 110, 112, 0.46, true), { w: W, h: H }));
    const bows = [C.jesusMantle, C.wheat, C.sageRobe, C.dustyBlue, C.lavender].map((col, i) => bits.add(`<g><path d="${c.ribbon(c.arc(0, 0, 150 - i * 10, 130 - i * 9, PI, 2 * PI, 30), 10)}" fill="${col}" opacity=".9"/></g>`));
    /* 2 — the oath to Abraham */
    const f2 = L.add(flat(S, flatSky(S, W, H, [C.night2, mix(C.indigo, C.night, 0.3)]) + flatHills(c, W, 90, mix(C.indigo, C.soilDark, 0.4), 6)
      + (() => { let d = ''; for (let i = 0; i < 60; i++) d += c.poly(c.star(c.rr(-170, 170), c.rr(-110, 60), c.rr(1.5, 3.5), 1, 4, 0)); return `<path d="${d}" fill="${C.star}"/>`; })()
      + fig(c, { ...ABRAHAM }, -40, 112, 0.7).replace('class="armBr"', 'class="armBr" transform="rotate(-150)"'), { w: W, h: H }));
    const seal = bits.add(`<g>${glowDisc(60, 'halo-glow', 1)}${sheet().p(c.cut(c.star(0, 0, 22, 18, 14, 0), 0.3, 3), C.sun).p(c.cut(c.circ(0, 0, 13, 14), 0.3, 3), shade(C.sun, 0.25)).out()}<path d="${c.poly(c.star(0, 0, 8, 3, 5))}" fill="${C.sunDeep}"/></g>`);
    /* 3 — delivered, we serve him without fear: up the road to the Temple */
    const f3 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.halo, 0.3), mix(C.dawn, C.cream, 0.4)])
      + `<g transform="translate(120 -10) scale(.34)">${sanctuary(c, 1)}</g>` + flatHills(c, W, 60, mix(C.hillMid, C.sand, 0.35), 6)
      + `<path d="${c.poly([[-190, 120], [-190, 100], [110, -6], [140, -6], [190, 120]])}" fill="${mix(C.sand, C.cream, 0.4)}"/>`
      + (() => { let d = ''; for (let i = 0; i < 3; i++) d += c.ribbon(c.arc(-150 + i * 12, 112, 6, 4, 0, PI * 2, 10), 2.2); return `<path d="${d}" fill="${C.rock3}"/>`; })(), { w: W, h: H }));
    let walkers = '';
    for (let i = 0; i < 4; i++) walkers += `<g transform="translate(${i * 34} ${-i * 12}) scale(${0.4 - i * 0.03})">${person(c, { ...folk(c), holdF: i === 1 ? `<g transform="translate(-10 14) scale(.34)">${lamb(c)}</g>` : '', holdB: '' })}</g>`;
    const walk = bits.add(`<g>${walkers}</g>`);
    /* 4 — all our days: the sun and the moon pass over a family at prayer */
    const fam = fig(c, folk(c, true), -40, 112, 0.5) + fig(c, folk(c, false), 10, 112, 0.48) + fig(c, { ...folk(c), beard: 'none', hairStyle: 'short' }, 50, 112, 0.3);
    const f4 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.duskViolet, 0.3), mix(C.dawn, C.cream, 0.3)]) + flatHills(c, W, 96, mix(C.hillMid, C.sand, 0.3), 5) + fam
      + `<g transform="translate(110 108)">${sheet().p(c.cut([[-12, 0], [-14, -6], [-6, -10], [6, -10], [12, -7], [18, -10], [20, -7], [14, -1], [8, 1], [-8, 1]], 0.3, 3), C.pot).out()}<circle cx="19" cy="-20" r="30" fill="url(#warm-glow)"/><path d="M19 -10C15 -14 16 -20 19 -26C22 -20 23 -14 19 -10Z" fill="${C.lampFlame}"/></g>`, { w: W, h: H }));
    const sunB = bits.add(`<g transform="scale(.45)">${sunCut(c, 40)}</g>`);
    const moonB = bits.add(`<g>${moonDisc(c, 16)}</g>`);

    const flats = [f1, f2, f3, f4];
    hillFront(S);

    return (t, time) => {
      const T = time;
      const late = es(t, 0, 4);
      Wd.sk.blend(EV, LATE, late);
      Wd.dim.fade(late * 0.6);
      homeLight(Wd.H, { open: 0.6, lit: 0.8 });
      const sing = Math.max(0, Math.sin(t * PI * 2)) * 0.3;
      z.set({ x: ZX, y: HGY, s: 1, flip: true, armF: 60 + sing * 20, armB: 110 + sing * 20, head: -10, blink: blinkAt(T, 2) });
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, armF: 70, armB: 30, head: 6, blink: blinkAt(T, 1) });
      pose(zGlow, { x: ZX, y: HGY - 140, s: 1, o: 0.9 });

      const KK = flats.map((f, i) => dropK(t, i, i === 3 ? 99 : 1.1 + i, 0.28));
      const Y = KK.map((k) => lerp(-1500, FY, k));
      const YY = (i, dy) => Y[i] + dy * K;
      const on = (i, v = 1) => (KK[i] > 0.002 ? v : 0);
      flats.forEach((f, i) => pose(f, { x: FX, y: Y[i], s: K, o: KK[i] > 0.002 ? 1 : 0 }));
      bows.forEach((b, i) => { const k = es(t, 0.3 + i * 0.06, 0.55 + i * 0.06); pose(b, { x: FX, y: YY(0, 104), sx: K * Math.max(0.001, k), sy: K, o: on(0, k > 0.01 ? 1 : 0) }); });
      const sk = es(t, 1.35, 1.6, ease.back);
      pose(seal, { x: X(40), y: YY(1, -50), s: Math.max(0.001, sk) * K, r: t * 5, o: on(1, sk > 0.01 ? 1 : 0) });
      const wk = es(t, 2.2, 2.95);
      pose(walk, { x: X(-150 + wk * 150), y: YY(2, 110 - wk * 60), s: K, o: on(2) });
      const d1 = seg(t, 3.15, 3.5), d2 = seg(t, 3.5, 3.85);
      pose(sunB, { x: X(lerp(-160, 160, d1)), y: YY(3, -40 - Math.sin(d1 * PI) * 34), s: K, o: on(3, d1 > 0 && d1 < 1 ? 1 : 0) });
      pose(moonB, { x: X(lerp(-160, 160, d2)), y: YY(3, -40 - Math.sin(d2 * PI) * 34), s: K, o: on(3, d2 > 0 ? 1 : 0) });

      S.cam.z = 1.04;
      S.cam.y = 10;
    };
  },
};
