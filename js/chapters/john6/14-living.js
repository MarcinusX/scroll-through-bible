// J 6,51–53 — "I am the living bread that came down from heaven": an ear of wheat grows up out of the light and
// becomes a loaf of light. Whoever eats of it lives forever — a small light is given and a ring without end is drawn.
// "The bread I will give is My flesh, for the life of the world": the loaf of light over the paper world, and behind
// Jesus a faint cross of light. The people argue — "How can He give us His flesh to eat?" "Unless you eat… and
// drink…": the bread of light and the cup of light hang beside Him; without them, no life — the little grey lamps.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, folk, radiance, breadOfLight, cupOfLight, hungGold, globe, eternityRing, drawRing, soulLight, murmur, labelTag, sparkle, glowDisc, headAt, hand, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 742;

export default {
  id: 'j6-living',
  beats: [
    { v: 51, text: 'Ja jestem chlebem żywym, który zstąpił z nieba.' },
    { v: 51, cont: true, text: 'Jeśli kto spożywa ten chleb, będzie żył na wieki.' },
    { v: 51, cont: true, text: 'Chlebem, który Ja dam, jest moje ciało za życie świata».' },
    { v: 52 },
    { v: 53, text: 'Rzekł do nich Jezus: «Zaprawdę, zaprawdę, powiadam wam: Jeżeli nie będziecie spożywali Ciała Syna Człowieczego i nie będziecie pili Krwi Jego,' },
    { v: 53, cont: true, text: 'nie będziecie mieli życia w sobie.' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    const hiL = S.layer({ par: 0.3, sh: 4 });
    const rad = hiL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 52)}</g>`);
    const crossL = S.layer({ par: 0.4, sh: 1, flat: true });
    const cross = crossL.add(`<g><path d="${c.poly([[-16, -330], [16, -330], [16, 120], [-16, 120]])}" fill="#fff4d0"/><path d="${c.poly([[-150, -210], [150, -210], [150, -180], [-150, -180]])}" fill="#fff4d0"/></g>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    // phone: those who argue stand at the inner ends of the benches, on the screen
    const P = S.portrait;
    const ARG = (P ? [[500, true], [585, true], [1015, true], [1100, false]] : [[340, true], [430, true], [1180, true], [1280, false]]).map(([x, man], i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, man)))) }));
    const jGlow = L.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    I.addColumns();

    const fx = S.layer({ par: 0.6, sh: 5 });
    const wheat = fx.add(`<g>${wheatStalk(c, { h: 150 })}</g>`);
    const loaf = fx.add(`<g>${breadOfLight(c, 46)}</g>`);
    const word = fx.add(hungGold(c, tr('Ja jestem chlebem żywym', 'I am the living bread'), { size: 30 }));
    const gift = fx.add(`<g>${soulLight(c, 9)}</g>`);
    const ring = fx.add(`<g>${eternityRing(c, 40, 4, 20)}</g>`);
    const world = hanging(fx, `<circle r="110" fill="url(#halo-glow)"/>${globe(c, 50)}`, { x: 0, y: 0, len: 900 });
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    const MUR = ARG.map((a) => fx.add(`<g>${murmur(c, { side: a.x > JX ? -1 : 1 })}</g>`));
    const qs = ARG.map(() => fx.add(`<g>${labelTag('?', 18)}</g>`));
    const cup = fx.add(`<g>${cupOfLight(c, 46)}</g>`);
    const greys = ARG.map(() => fx.add(`<g><path d="${c.cut([[0, -12], [7, -2], [5, 6], [-5, 6], [-7, -2]], 0.2, 3)}" fill="${C.stone2}"/></g>`));

    const NEAR = cong.slice().sort((a, b) => Math.abs(a.x - JX) - Math.abs(b.x - JX))[0];
    return (t, time) => {
      const T = time;
      I.flicker(T);
      const rk = es(t, 0.05, 0.35);
      pose(rad, { x: JX, y: 160, s: 0.8, r: T * 3, o: rk * (1 - es(t, 3.0, 3.3) * 0.5) });
      /* v51a — the living bread: wheat grows into a loaf of light */
      const grow = es(t, 0.1, 0.45);
      const become = es(t, 0.45, 0.65);
      pose(wheat, { x: JX, y: 470, sy: grow, oy: 0, o: grow > 0.01 ? 1 - become : 0 });
      const LX = kf(t, [[0, JX], [2.0, JX], [2.4, 640], [4.0, 640], [4.4, 690]]);
      const LY = kf(t, [[0, 380], [2.0, 380], [2.4, 300], [4.0, 300], [4.4, 400]]);
      pose(loaf, { x: LX, y: LY, s: 0.4 + become * 0.6 + Math.sin(T * 1.2) * 0.02, o: become });
      const wk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 0.95, 1.1));
      pose(word, { x: JX, y: lerp(-500, 170, wk), r: Math.sin(T * 0.8), o: wk > 0.01 ? 1 : 0 });
      /* v51b — whoever eats of this bread will live forever */
      const m = P ? NEAR : cong[3];
      const [mx, my] = headAt(m.x, m.y, m.s, m.x > JX, 62);
      const gk = es(t, 1.05, 1.4);
      pose(gift, { x: lerp(LX, mx, gk), y: lerp(LY, my + 30, gk) - Math.sin(gk * PI) * 60, s: 1, o: seg(t, 1.05, 1.1) * (1 - es(t, 1.9, 2.1)) });
      drawRing(ring, es(t, 1.35, 1.8));
      pose(ring, { x: mx, y: my + 20, r: t * 30, o: seg(t, 1.35, 1.4) * (1 - es(t, 1.95, 2.1)) });
      /* v51c — My flesh, for the life of the world */
      const wl = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.1));
      pose(world, { x: 960, y: lerp(-500, 300, wl), r: Math.sin(T * 0.7) * 2, o: wl > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = es(t, 2.3 + i * 0.05, 2.5 + i * 0.05) * (1 - es(t, 2.95, 3.1));
        const a = (i / 5) * PI * 2 + T * 0.5;
        pose(sp, { x: 960 + Math.cos(a) * 76, y: 300 + Math.sin(a) * 76, s: k * 0.8, r: T * 40, o: k });
      });
      pose(cross, { x: JX, y: FEET - 150, o: es(t, 2.2, 2.6) * 0.55 * (1 - es(t, 3.0, 3.3)) });
      /* v52 — they argue among themselves */
      const argue = es(t, 3.05, 3.3) * (1 - es(t, 4.9, 5.1) * 0.4);
      ARG.forEach((a, i) => {
        const face = a.i % 2 ? a.x > JX ? false : false : true;
        const fl = i === 0 ? false : i === 1 ? true : i === 2 ? false : true;
        const shake = argue * Math.sin(T * 6 + i) * 10 * (1 - es(t, 4.0, 4.2));
        a.p.set({ x: a.x, y: FEET - 4 + (i % 2) * 6, s: 0.92, flip: argue > 0.3 ? fl : a.x > JX, armF: 20 + argue * (70 + shake), armB: argue * (i % 2 ? 110 : 30), head: argue * 6, lean: argue * 4 * (face ? 1 : -1), blink: blinkAt(T, a.seed) });
        const [hx, hy] = headAt(a.x, FEET - 4 + (i % 2) * 6, 0.92, argue > 0.3 ? fl : a.x > JX);
        const k = es(t, 3.1 + i * 0.07, 3.3 + i * 0.07, ease.back) * (1 - es(t, 3.95, 4.05));
        pose(MUR[i], { x: hx + (fl ? -8 : 8), y: hy - 18, s: k, o: k > 0.01 ? 1 : 0 });
        const q = es(t, 3.35 + i * 0.07, 3.55 + i * 0.07, ease.back) * (1 - es(t, 3.95, 4.05));
        pose(qs[i], { x: hx, y: hy - 70, s: q, r: Math.sin(T * 2 + i) * 8, o: q > 0.01 ? 1 : 0 });
        /* v53b — no life in you: small grey unlit lamps */
        const gk2 = es(t, 5.1 + i * 0.06, 5.3 + i * 0.06, ease.back);
        pose(greys[i], { x: hx, y: hy - 44, s: gk2, o: gk2 > 0.01 ? 0.9 : 0 });
      });
      cong.forEach((mm, i) => mm.p.set({ x: mm.x, y: mm.y, s: mm.s, flip: mm.x > JX, armF: 20 + argue * (i % 2 ? 50 : 0), armB: argue * (i % 3 ? 0 : 70), head: argue * (i % 2 ? 8 : -6), blink: blinkAt(T, mm.seed) }));
      /* v53a — the bread and the cup of light, side by side */
      const ck = es(t, 4.1, 4.5, ease.out);
      pose(cup, { x: lerp(1200, 910, ck), y: lerp(-300, 410, ck), o: ck > 0.01 ? 1 : 0 });
      const shine = es(t, 4.1, 4.5);
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.8 + shine * 0.5, o: 0.25 + shine * 0.45 });
      jesus.set({ x: JX, y: FEET, s: 1.08, armF: 20 + rk * 30 + bump(t, 2.05, 2.95) * 40 + shine * 50, armB: 10 + bump(t, 0.1, 0.9) * 120 + bump(t, 2.05, 2.95) * 110 + shine * 100, head: -bump(t, 0.1, 0.9) * 10, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [2.0, 1.04], [3.1, 1.02], [4.1, 1.06]]);
      S.cam.y = kf(t, [[0, 0], [1.0, 20], [2.0, 0], [3.1, 20], [4.1, 10]]);
    };
  },
};
