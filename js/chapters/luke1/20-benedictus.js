// Łk 1,67–71 — the Benedictus, at evening in the courtyard: the dove comes down over Zechariah and he prophesies, hands
// lifted, Elizabeth beside him with the child. Painted flats come down over them: blessed be the Lord who has visited and
// redeemed his people (a star comes down to a people in chains, and the chains fall); he has raised up a horn of salvation
// in the house of David (a golden horn rises shining from a little house with David's crown on its door); as he spoke by
// his holy prophets of old (the prophets in a row with their scrolls); salvation from our enemies (the shadows with their
// spears fall back from a people behind a shield of light).
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, ELIZABETH, LOOK8, HILLEVE, hillHome, homeLight, hillFront, HGY, johnInArms, dove, flapWings, voiceRings, glowDisc, rayBurst,
  flat, flatSky, flatHills, fig, crown, dropK, folk, headAt, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { house } from '../../assets/nature.js';
import { shadowPerson } from '../mark8/lib.js';

const ZX = 820, EX = 620;
const FX = 800, FY = 285, W = 360, H = 230, K = 1.1;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-benedictus',
  beats: [
    { v: 67 },
    { v: 68 },
    { v: 69 },
    { v: 70 },
    { v: 71 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const Wd = hillHome(S, HILLEVE);
    const zGlow = Wd.G.add(`<g>${glowDisc(160, 'halo-glow', 0.85)}${rayBurst(c, { n: 16, r0: 60, r1: 170, spread: 0.03, o: 0.18 })}</g>`);
    const P = Wd.P;
    const z = S.puppet(P.add(person(c, ZECHARIAH)));
    const e = S.puppet(P.add(person(c, { ...ELIZABETH, holdF: johnInArms(c) })));
    const voice = voiceRings(P, c, { n: 3, color: C.sun, r: 40, w: 6, both: true });
    const up = S.layer({ par: 0.25, sh: 6 });
    const dv = up.add(dove(c));
    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });

    /* 1 — he has visited and redeemed his people: the chains fall */
    let ppl = '';
    for (let i = 0; i < 6; i++) ppl += fig(c, folk(c), -125 + i * 50, 108 + (i % 2) * 4, 0.44, i > 2);
    const f1 = L.add(flat(S, flatSky(S, W, H, [mix(C.night, C.indigo, 0.4), mix(C.duskViolet, C.dawn, 0.4)]) + flatHills(c, W, 90, mix(C.hillMid, C.indigo, 0.4), 6) + ppl, { w: W, h: H }));
    const chains = [0, 1, 2, 3, 4].map((i) => { let d = ''; for (let k = 0; k < 4; k++) d += c.ribbon(c.arc(k * 9, (k % 2) * 2, 6, 4, 0, PI * 2, 10), 2.4); return bits.add(`<g><path d="${d}" fill="${C.rock3}"/></g>`); });
    const vstar = bits.add(`<g>${glowDisc(80, 'halo-glow', 1)}<path d="${c.poly(c.star(0, 0, 22, 8, 8, 0))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 7, 10))}" fill="${C.star}"/></g>`);
    /* 2 — a horn of salvation in the house of David */
    const f2 = L.add(flat(S, flatSky(S, W, H, [mix(C.halo, C.cream, 0.3), mix(C.peach, C.cream, 0.4)]) + flatHills(c, W, 96, mix(C.sand2, C.hillMid, 0.35), 5)
      + house(c, -70, 108, 140, 96, { stairs: false }) + `<g transform="translate(-24 26)">${crown(c)}</g>`, { w: W, h: H }));
    const horn = bits.add(`<g>${glowDisc(90, 'halo-glow', 1)}${sheet().p(c.cut([[-8, 40], [8, 40], [14, 10], [22, -20], [40, -50], [30, -54], [8, -26], [-6, 6]], 0.4, 4), C.sun).p(c.ribbon([[-6, 30], [10, 30]], 3) + c.ribbon([[2, 0], [18, 4]], 3), C.sunDeep).out()}</g>`);
    /* 3 — by the mouth of his holy prophets from of old */
    const scroll = `<g transform="translate(0 4)"><path d="${c.cut(c.rect(-10, -4, 20, 8), 0.2, 2)}" fill="${C.parchment}"/><path d="${c.cut(c.ell(-10, 0, 3, 6, 8), 0.2, 2) + c.cut(c.ell(10, 0, 3, 6, 8), 0.2, 2)}" fill="${C.wood2}"/></g>`;
    const PROPH = [LOOK8.prophet, LOOK8.elijah, { ...LOOK8.prophet, robe: C.sageRobe, mantle: C.plumRobe }, { ...LOOK8.prophet, robe: C.wheatRobe, mantle: C.teal2, beard: 'wild' }, { ...LOOK8.prophet, robe: C.linen2, mantle: C.clayMantle }];
    const f3 = L.add(flat(S, flatSky(S, W, H, [mix(C.parchment, C.halo, 0.3), mix(C.sand, C.cream, 0.4)]) + `<g transform="translate(0 -120)">${rayBurst(c, { n: 14, r0: 10, r1: 220, spread: 0.05, o: 0.5 })}</g>`
      + flatHills(c, W, 98, mix(C.sand2, C.dune, 0.3), 5) + PROPH.map((o, i) => fig(c, { ...o, holdF: scroll }, -130 + i * 66, 112 - (i % 2) * 4, 0.5)).join(''), { w: W, h: H }));
    /* 4 — salvation from our enemies */
    let foes = ''; for (let i = 0; i < 4; i++) foes += `<g transform="translate(${i * 40} ${(i % 2) * 6}) scale(-.5 .5)">${shadowPerson(c, { ...folk(c, true), holdF: `<g transform="translate(0 -60)"><path d="${c.ribbon([[0, -40], [0, 120]], 3)}" fill="#3b2a22"/><path d="${c.poly([[0, -56], [-6, -40], [6, -40]])}" fill="#3b2a22"/></g>` }, '#3b2a22')}</g>`;
    let flock = ''; for (let i = 0; i < 4; i++) flock += fig(c, folk(c), -150 + i * 34, 110 + (i % 2) * 4, 0.44);
    const f4 = L.add(flat(S, flatSky(S, W, H, [mix(C.storm, C.duskViolet, 0.4), mix(C.dusk, C.cream, 0.4)]) + flatHills(c, W, 96, mix(C.hillMid, C.storm, 0.3), 5) + flock, { w: W, h: H }));
    const shield = bits.add(`<g>${glowDisc(110, 'halo-glow', 1)}<path d="${c.cut([[0, -70], [44, -52], [40, 20], [0, 64], [-40, 20], [-44, -52]], 0.4, 4)}" fill="${mix(C.halo, C.cream, 0.4)}" opacity=".85"/><path d="${c.poly(c.star(0, -4, 20, 8, 8, 0))}" fill="${C.sun}"/></g>`);
    const enemy = bits.add(`<g>${foes}</g>`);

    const flats = [f1, f2, f3, f4];
    hillFront(S);

    return (t, time) => {
      const T = time;
      Wd.sk.blend(HILLEVE, ['#8f86b0', '#e0ad9a', '#f0cfae'], es(t, 0, 5));
      homeLight(Wd.H, { open: 0.6, lit: 0.7 });
      const [hx, hy] = headAt(ZX, HGY, 1, false);

      /* v67: filled with the Holy Spirit, he prophesies */
      const dk = es(t, 0.05, 0.45, ease.out);
      pose(dv, { x: lerp(ZX + 260, ZX + 10, dk), y: lerp(60, HGY - 300, dk), s: 1, o: 1 - es(t, 0.9, 1.05) });
      if (t < 1.05) flapWings(dv, T || t * 3, 30, 7, -6);
      const fill = es(t, 0.35, 0.6);
      const sing = Math.max(0, Math.sin(t * PI * 2)) * 0.3;
      z.set({ x: ZX, y: HGY, s: 1, flip: true, armF: 30 + fill * 40 + sing * 20, armB: 20 + fill * 110, head: -fill * 12, blink: blinkAt(T, 2) });
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, armF: 70, armB: 30, head: 6, blink: blinkAt(T, 1) });
      pose(zGlow, { x: ZX, y: HGY - 140, s: 0.5 + fill * 0.6, r: t * 3, o: fill });
      voice(hx - 12, hy + 8, bump(t, 0.5, 1.0) * 0.8, T, { spread: 3 });

      const KK = flats.map((f, i) => dropK(t, 1 + i, i === 3 ? 99 : 2.1 + i, 0.28));
      const Y = KK.map((k) => lerp(-1500, FY, k));
      const YY = (i, dy) => Y[i] + dy * K;
      const on = (i, v = 1) => (KK[i] > 0.002 ? v : 0);
      flats.forEach((f, i) => pose(f, { x: FX, y: Y[i], s: K, o: KK[i] > 0.002 ? 1 : 0 }));
      /* 1: the star visits; the chains fall */
      const vs = es(t, 1.15, 1.45, ease.out);
      pose(vstar, { x: X(0), y: YY(0, lerp(-130, -60, vs)), s: K, r: t * 8, o: on(0, vs > 0.01 ? 1 : 0) });
      chains.forEach((ch, i) => { const f = es(t, 1.45 + i * 0.05, 1.7 + i * 0.05, ease.in); pose(ch, { x: X(-110 + i * 50), y: YY(0, 64 + f * 42), r: f * 90, s: K, o: on(0) }); });
      /* 2: the horn rises from David's house */
      const hk = es(t, 2.15, 2.5, ease.out);
      pose(horn, { x: X(20), y: YY(1, lerp(40, -40, hk)), s: K * (0.6 + hk * 0.4), o: on(1, hk > 0.01 ? 1 : 0) });
      /* 4: the enemies fall back before the shield of light */
      const sh = es(t, 4.15, 4.4, ease.back);
      pose(shield, { x: X(-40), y: YY(3, 40), s: Math.max(0.001, sh) * K, o: on(3, sh > 0.01 ? 1 : 0) });
      const ret = es(t, 4.35, 4.8);
      pose(enemy, { x: X(20 + ret * (S.portrait ? 22 : 50)), y: YY(3, 110), s: K, o: on(3, 1 - ret * 0.75) });   // phone: they fall back but stay inside the picture

      S.cam.z = 1.04;
      S.cam.y = 10;
    };
  },
};
