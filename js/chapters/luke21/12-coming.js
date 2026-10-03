// Łk 21,25–28 — the whole theatre's sky over the sea (Mark 13's fly system): the sun and the moon on their strings,
// paper stars on threads, and below them the sea, the far coasts, the peoples of the earth on the shore. "There will be
// signs in the sun, moon and stars, and on the earth anxiety of nations, in perplexity at the roaring of the sea and the
// waves": a dark disc slides over the sun, the moon turns the colour of blood, the stars shiver; the sea heaves up,
// crests break on the shore and the people shrink back, hands to their heads. "Men fainting for fear": they sink to
// their knees and bow down. "For the powers of the heavens will be shaken": the whole fly system shakes, every ornament
// swings, and the stars let go of their threads and fall. "Then they will see the Son of Man coming in a cloud with
// power and great glory": the sky turns to gold, the sea lies still, and He comes down on the cloud. "When these
// things begin to happen, look up and lift up your heads, because your redemption is near": the people rise, lift
// their faces and their hands to Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waveStrip, sun, moon, cloud, stars, grass } from '../../assets/nature.js';
import { crowdKnot, sparkle, warm, es, ease, bump, seg, fade, tr, PI } from './lib.js';

const SUN = [600, 170], MOON0 = [1060, 150];
const TWI = ['#434d7a', '#72739a', '#b79ca6'];
const DARK = ['#15182e', '#1f2340', '#2c2c46'];
const GOLDEN = ['#6b5a86', '#e3b98a', '#f8e4b8'];
const SHORE = 716;

export default {
  id: 'lk21-coming',
  beats: [
    { v: 25 },
    { v: 26, text: 'Ludzie mdleć będą ze strachu, w oczekiwaniu wydarzeń zagrażających ziemi.' },
    { v: 26, cont: true, text: 'Albowiem moce niebios zostaną wstrząśnięte.' },
    { v: 27 },
    { v: 28 },
  ],
  cam: { x: [-30, 30], y: [-70, 40], z: [0.96, 1.08] },
  build(S) {
    const c = S.c;
    // on a phone the moon hangs clear of the progress thread and the peoples stand on the visible shore
    const PT = S.portrait;
    const MOON = PT ? [1000, 140] : MOON0;
    sky(S, TWI);
    const sk2 = sky(S, DARK, { name: 'dark', rise: 0 }).layer;
    const sk3 = sky(S, GOLDEN, { name: 'gold', rise: 0 }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -700, y1: 440, n: 110 }));

    /* the fly system */
    const hangL = S.layer({ par: 0.05, sh: 5, pad: 40 });
    const sunEl = hanging(hangL, sun(c, 54), { x: SUN[0], y: SUN[1], len: 700 });
    const disc = hanging(hangL, `<path d="${c.cut(c.circ(0, 0, 58, 40), 0.4, 5)}" fill="${mix(C.night2, C.storm2, 0.3)}"/><circle r="62" fill="none" stroke="${C.halo}" stroke-width="3" opacity=".5"/>`, { x: SUN[0] - 200, y: SUN[1], len: 700 });
    const moonEl = hanging(hangL, `${moon(c, 38)}<path class="blood" d="${c.cut(c.circ(0, 0, 39, 40), 0.3, 5)}" fill="${mix(C.terracotta, C.clay, 0.25)}" opacity="0"/>`, { x: MOON[0], y: MOON[1], len: 700 });
    const blood = moonEl.querySelector('.blood');
    const clouds = [[300, 120, 190], [1300, 240, 170], [900, 300, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w, mix(C.cream, C.storm, 0.35), mix('#eadcc0', C.storm, 0.4)), { x, y, len: 700 }) }));
    const STARS = Array.from({ length: 20 }, (_, i) => ({ i, x: lerp(300, 1300, (i + c.rr(0.1, 0.9)) / 20), y: c.rr(60, 360), r: c.rr(7, 11), dx: c.rr(-120, 120), spin: c.rr(-400, 400), at: 2.08 + c.rr(0, 0.5) }));
    const threadL = S.layer({ par: 0.05, sh: 1, flat: true, pad: 40 });
    threadL.add(STARS.map((st) => `<path d="M${st.x.toFixed(1)} -1400V${(st.y - st.r).toFixed(1)}" stroke="rgba(240,230,210,.4)" stroke-width="1"/>`).join(''));
    const starsL = S.layer({ par: 0.05, sh: 4 });
    STARS.forEach((st) => { st.el = starsL.add(`<g><circle r="${(st.r * 2.4).toFixed(1)}" fill="url(#warm-glow)" opacity=".5"/><path d="${c.cut(c.star(0, 0, st.r, st.r * 0.42, 5), 0.2, 3)}" fill="${C.star}"/></g>`); });

    /* the far coasts, the sea */
    const far = S.layer({ par: 0.1, sh: 2, pad: 20 });
    far.add(band(c, { y: 520, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.night2, 0.35), x0: -1400, x1: 3000 }).markup);
    const lit = S.layer({ par: 0.1, sh: 1, flat: true });
    lit.add(`<rect x="-1400" y="-800" width="4400" height="2600" fill="${C.lampGlow}" opacity=".22"/>`);
    lit.fade(0);
    const seaCols = [mix(C.lakeDeep, C.night2, 0.25), mix(C.lake3, C.night2, 0.2), mix(C.lake2, C.night2, 0.15)];
    const sea = [0, 1, 2].map((i) => {
      const L = S.layer({ par: 0.16 + i * 0.04, sh: 3, pad: 140 });
      L.add(waveStrip(c, { y: 556 + i * 34, len: 130 + i * 30, amp: 10 + i * 4, color: seaCols[i], crest: mix(C.foam, C.storm2, 0.2) }));
      return L;
    });

    /* the Son of Man on the cloud */
    const heaven = S.layer({ par: 0.2, sh: 6 });
    const cBack = heaven.add(`<g>${cloud(c, 420, '#fbf4e4', '#efe2c4')}</g>`);
    const J = S.puppet(heaven.add(person(c, { ...CAST.jesus })));
    const cFront = heaven.add(`<g>${cloud(c, 380, '#fffaf0', '#f1e6cc')}</g>`);
    const cSide = [-1, 1].map(() => heaven.add(`<g>${cloud(c, 230, '#f8f0de', '#ebdcbc')}</g>`));
    const sparks = Array.from({ length: 8 }, (_, i) => ({ i, a: (i / 8) * PI * 2, el: heaven.add(`<g>${sparkle(c, 12)}</g>`) }));

    /* the shore and the peoples */
    const shoreL = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(SHORE - 40, [6, 3], [700, 200]);
    shoreL.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.sand, C.dune, 0.3)).out() + grass(c, { x0: -800, x1: 2400, y: SHORE - 40, fn: gfn, n: 24, h: 10, color: mix(C.olive, C.sand, 0.3) }));
    const spray = [360, 620, 980, 1240].map((x, i) => ({ x, i, el: shoreL.add(`<g><path d="${c.cut(c.blob(0, 0, 40, 22, 12, 0.35), 0.8, 4)}" fill="${C.foam}"/><path d="${c.cut(c.blob(-20, -24, 18, 14, 9, 0.3), 0.6, 3)}" fill="${C.foam}"/></g>`) }));
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const G = PT
      ? [['l1', 550, SHORE + 6, 6, false], ['r1', 1010, SHORE + 6, 6, true], ['l2', 625, SHORE + 44, 4, false], ['r2', 945, SHORE + 44, 4, true]]
      : [['l1', 330, SHORE + 6, 6, false], ['r1', 1270, SHORE + 6, 6, true], ['l2', 520, SHORE + 44, 4, false], ['r2', 1080, SHORE + 44, 4, true]];
    const P = {
      calm: { arms: [0, 30], armB: [0, 10], head: [-8, -2] },
      fear: { arms: [60, 85], armB: [25, 55], head: [8, 14] },
      faint: { pose: 'kneel', arms: [10, 30], armB: [0, 15], head: [24, 30] },
      up: { arms: [100, 140], armB: [130, 160], head: [-16, -10] },
    };
    const knots = G.map(([k, x, y, n, flip]) => {
      const base = { s: 0.84, spread: 44, rows: 2, flip };
      const sp = {};
      Object.keys(P).forEach((p) => { sp[p] = crowdL.sprite(crowdKnot('lk21-sea-' + k, n, { ...base, ...P[p] }).m, x, y); });
      return { x, y, sp };
    });
    const fg = S.layer({ par: 0.8, sh: 6 });
    const bank = c.wave(930, [10, 4], [520, 170]);
    fg.add(sheet().p(c.ridge(bank, -1200, 2800, 1800, 14, 1.2), mix(C.dune, C.sage, 0.3)).out());

    return (t, time) => {
      const T = time;
      /* the skies */
      const dark = es(t, 0.05, 0.6);
      const gold = es(t, 3.05, 3.5);
      sk2.fade(dark * (1 - gold));
      sk3.fade(gold);
      starL.fade(0.8 * dark * (1 - es(t, 2.1, 2.7)) * (1 - gold));
      lit.fade(gold);
      threadL.fade(1 - gold);

      /* the shaking (v26b) */
      const shake = bump(t, 2.02, 2.98);
      const sway = (seed, amp = 1) => (Math.sin(t * 26 + seed) * 18 + Math.sin(t * 61 + seed * 2) * 8) * shake * amp;
      hangL.shift(Math.sin(t * 50) * 10 * shake, 0);
      threadL.shift(Math.sin(t * 50) * 10 * shake, 0);
      far.shift(Math.sin(t * 60 + 1) * 5 * shake, 0);
      const up = es(t, 3.0, 3.4);
      /* v25 — the sun darkened, the moon blood-red, the stars shiver */
      const ecl = es(t, 0.1, 0.55);
      pose(sunEl, { x: SUN[0], y: SUN[1] - up * 600, r: sway(1), o: 1 });
      pose(disc, { x: lerp(SUN[0] - 190, SUN[0], ecl), y: SUN[1] - up * 600, r: sway(1.2), o: ecl > 0.001 ? 1 : 0 });
      pose(moonEl, { x: MOON[0], y: MOON[1] - up * 600, r: sway(2), o: 1 });
      fade(blood, es(t, 0.3, 0.6) * 0.85);
      clouds.forEach((cl) => pose(cl.el, { x: cl.x, y: cl.y - up * 700, r: sway(cl.i + 3, 0.6) }));
      STARS.forEach((s) => {
        const f = es(t, s.at, s.at + 0.6, ease.in);
        const shiver = T ? Math.sin(T * 12 + s.i) * 3 * es(t, 0.3, 0.6) * (1 - f) : 0;
        pose(s.el, { x: s.x + f * s.dx, y: s.y + f * 700, r: f * s.spin + shiver * 4, s: 1 - f * 0.3, o: f < 0.98 && gold < 0.5 ? 1 : 0 });
      });

      /* the sea: roars (v25), still (v27) */
      const roar = es(t, 0.2, 0.7) * (1 - es(t, 3.0, 3.5));
      sea.forEach((L, i) => L.shift(Math.sin(t * 2.2 + i) * 40 * roar + (T ? Math.sin(T * (0.9 + i * 0.3) + i) * 12 * (0.3 + roar) : 0), -roar * (18 + i * 10) + (T ? Math.sin(T * 1.6 + i * 2) * 6 * roar : 0)));
      spray.forEach((sp) => {
        const k = T ? ((T * 0.7 + sp.i * 0.27) % 1) : 0.5;
        pose(sp.el, { x: sp.x + Math.sin(sp.i * 3) * 30, y: SHORE - 52 - k * 50 * roar, s: (0.3 + k * 0.45) * roar, o: roar * Math.sin(k * PI) });
      });

      /* the peoples: in dismay (v25), fainting (v26a), rising, heads up (v28) */
      const fear = es(t, 0.35, 0.42) * (1 - es(t, 1.2, 1.27));
      const faint = es(t, 1.2, 1.27) * (1 - es(t, 4.1, 4.17));
      const rise = es(t, 4.1, 4.17);
      knots.forEach((k) => {
        const calm = Math.max(0, 1 - fear - faint - rise);
        k.sp.calm.set({ x: k.x, y: k.y, o: calm });
        k.sp.fear.set({ x: k.x, y: k.y, o: fear });
        k.sp.faint.set({ x: k.x, y: k.y, o: faint });
        k.sp.up.set({ x: k.x, y: k.y, o: rise });
      });

      /* v27 — the Son of Man coming in the cloud */
      const come = es(t, 3.05, 3.8, ease.out);
      const jy = lerp(-240, 450, come);
      const on = come > 0.001 ? 1 : 0;
      pose(cBack, { x: 800, y: jy + 4, s: 1.1, o: on });
      J.set({ x: 800, y: jy, s: 1.12, o: on, armB: 30 + 120 * come * (1 - es(t, 4.05, 4.3) * 0.2), armF: 30 + 60 * come + es(t, 4.05, 4.3) * 10, head: -2 + es(t, 4.05, 4.3) * 6, blink: blinkAt(T, 1) });
      pose(cFront, { x: 790, y: jy + 28, s: 1.05, o: on });
      cSide.forEach((el, i) => pose(el, { x: 800 + (i ? 1 : -1) * 260, y: jy + 18, s: 1, o: on }));
      sparks.forEach((sp) => {
        const k = es(t, 3.4 + sp.i * 0.03, 3.6 + sp.i * 0.03);
        const rr = 250 + (T ? Math.sin(T * 1.3 + sp.i) * 12 : 0);
        pose(sp.el, { x: 800 + Math.cos(sp.a) * rr, y: jy - 90 + Math.sin(sp.a) * rr * 0.5, s: 0.7 + (T ? Math.sin(T * 3 + sp.i) * 0.15 : 0), r: T * 30, o: k });
      });

      S.cam.z = 1 - es(t, 1.9, 2.3) * 0.03 + es(t, 3.1, 3.8) * 0.04;
      S.cam.y = -es(t, 1.9, 2.4) * 30 - es(t, 3.1, 3.8) * 40 + es(t, 4.05, 4.5) * 20;
      void seg; void shade; void tr; void hillsWith; void warm;
    };
  },
};
