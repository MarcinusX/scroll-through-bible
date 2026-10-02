// Mt 24,29–31 — the whole theatre's sky (Mark 13's fly system): the sun and the moon on their strings, paper stars on
// threads. A dark disc slides over the sun and the moon goes grey; the stars let go of their threads and tumble, the
// fly system shakes. Then, high in the dark, the sign of the Son of Man: a cross of light. The peoples of the earth on
// the hills mourn — they kneel and hide their faces. The sky turns to gold and He comes on the clouds with power and
// great glory. He sends out His angels with trumpets; they fly to the four corners, and come back gathering the
// chosen — little lights from one end of the sky to the other.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, moon, cloud, stars, olive, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { jerusalem, glory, angel, soulLight, crossSign, trumpet, blast, pose3, folk, PI } from './lib.js';

const SUN = [690, 190], MOON_W = [1110, 150];
const CORNERS_W = [[330, 380], [1280, 200], [450, 630], [1160, 630]];
// phone: the moon comes out from under the thread, and the angels fly to corners of the phone's screen
const MOON_P = [1040, 160];
const CORNERS_P = [[545, 360], [1055, 210], [560, 630], [1045, 630]];

export default {
  id: 'mt24-heavens',
  beats: [
    { v: 29, text: 'Zaraz też po ucisku owych dni słońce się zaćmi i księżyc nie da swego blasku;' },
    { v: 29, cont: true, text: 'gwiazdy zaczną padać z nieba i moce niebios zostaną wstrząśnięte.' },
    { v: 30, text: 'Wówczas ukaże się na niebie znak Syna Człowieczego,' },
    { v: 30, cont: true, text: 'i wtedy będą narzekać wszystkie narody ziemi;' },
    { v: 30, cont: true, text: 'i ujrzą Syna Człowieczego, przychodzącego na obłokach niebieskich z wielką mocą i chwałą.' },
    { v: 31, text: 'Pośle On swoich aniołów z trąbą o głosie potężnym,' },
    { v: 31, cont: true, text: 'i zgromadzą Jego wybranych z czterech stron świata, od jednego krańca nieba aż do drugiego.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const MOON = S.portrait ? MOON_P : MOON_W, CORNERS = S.portrait ? CORNERS_P : CORNERS_W;
    const TWI = ['#3d4775', '#6d6f96', '#b49aa4'];
    const DARK = ['#15182e', '#1f2340', '#2c2c46'];
    const GLORY = ['#6b5a86', '#e3b98a', '#f8e4b8'];
    sky(S, TWI);
    const skD = sky(S, DARK, { name: 'sky-dark', rise: 0 });
    const skG = sky(S, GLORY, { name: 'sky-glory', rise: 0 });
    skD.layer.fade(0); skG.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 90 }));
    const gloryL = S.layer({ par: 0.06, sh: 1, flat: true, rise: 0 });
    gloryL.add(`<g transform="translate(800 330)">${glory(c, 900, 30)}</g>`);
    gloryL.fade(0);

    /* the fly system: sun (with the eclipsing disc), moon, clouds, stars on threads */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 56), { x: SUN[0], y: -1500, len: 700 });
    const disc = hanging(hangL, `<path d="${c.cut(c.circ(0, 0, 60, 40), 0.4, 5)}" fill="${mix(C.night2, C.storm2, 0.3)}"/><circle r="64" fill="none" stroke="${C.halo}" stroke-width="3" opacity=".5"/>`, { x: SUN[0] - 200, y: -1500, len: 700 });
    const moonEl = hanging(hangL, `<circle class="mglow" r="110" fill="url(#halo-glow)"/>${moon(c, 40)}<path class="mdim" d="${c.cut(c.circ(0, 0, 41, 40), 0.3, 5)}" fill="${mix(C.rock3, C.storm2, 0.5)}" opacity="0"/>`, { x: MOON[0], y: -1500, len: 700 });
    const mglow = moonEl.querySelector('.mglow'), mdim = moonEl.querySelector('.mdim');
    const clouds = [[900, 100, 200], [980, 250, 150], [420, 300, 170]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w, mix(C.cream, C.storm, 0.35), mix('#eadcc0', C.storm, 0.4)), { x, y: -1500, len: 700 }) }));
    const STARS = Array.from({ length: 22 }, (_, i) => ({ i, x: lerp(360, 1260, (i + c.rr(0.1, 0.9)) / 22), y: c.rr(90, 360), r: c.rr(7, 12), dx: c.rr(-120, 120), spin: c.rr(-400, 400), at: 1.02 + c.rr(0, 0.55) }));
    const threadL = S.layer({ par: 0.05, sh: 1, flat: true });
    threadL.add(STARS.map((st) => `<path d="M${st.x.toFixed(1)} -1400V${(st.y - st.r).toFixed(1)}" stroke="rgba(240,230,210,.4)" stroke-width="1"/>`).join(''));
    const starsL = S.layer({ par: 0.05, sh: 4 });
    STARS.forEach((st) => { st.el = starsL.add(`<g transform="translate(0 -1500)"><circle r="${(st.r * 2.6).toFixed(1)}" fill="url(#warm-glow)" opacity=".55"/><path d="${c.cut(c.star(0, 0, st.r, st.r * 0.42, 5), 0.2, 3)}" fill="${C.star}"/></g>`); });

    /* the sign of the Son of Man */
    const signL = S.layer({ par: 0.07, sh: 2, rise: 0 });
    const sign = signL.add(`<g transform="translate(0 -1500)">${crossSign(c, 150)}</g>`);

    /* the earth and its peoples */
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 520, amps: [14, 6, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.night2, 0.45), x0: -1400, x1: 3000 });
    far.add(h1.markup + `<g transform="translate(560 522)">${jerusalem(c, 0.3, { tglow: false }).replace(/#[0-9a-fA-F]{6}\b/g, (h) => mix(h, C.night2, 0.45))}</g>` + town(c, { x: 1250, y: h1.fn(1250) + 8, n: 6, spread: 240, sc: 0.5, wall: mix(C.plaster, C.night2, 0.45), shadow: mix(C.plaster2, C.night2, 0.5), lit: true }));
    const nearL = S.layer({ par: 0.3, sh: 3 });
    nearL.add(hillsWith(c, { y: 600, amps: [16, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.night2, 0.4), trees: 16, treeColor: mix(C.moss2, C.night2, 0.4), treeH: 22, x0: -1400, x1: 3000 }).markup);
    const G = S.layer({ par: 0.42, sh: 4 });
    const gfn = c.wave(676, [5, 2], [700, 170]);
    G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.night2, 0.4)).out() + grass(c, { x0: -800, x1: 2400, y: 676, fn: gfn, n: 34, h: 12, color: mix(C.olive, C.night2, 0.4) }) + olive(c, 230, 690, 0.9, { trunk: mix(C.wood2, C.night2, 0.4), leaf: mix(C.olive, C.night2, 0.4), leaf2: mix(C.sage, C.night2, 0.4) }));
    const lit = S.layer({ par: 0.3, sh: 1, flat: true });
    lit.add(`<rect x="-1400" y="400" width="4400" height="1400" fill="${C.lampGlow}" opacity=".25"/>`);
    lit.fade(0);
    /* the peoples: still cut-outs in three states — looking up, mourning, lifting their hands (cross-faded) */
    const P = S.layer({ par: 0.42, sh: 4 });
    const GROUPS = [{ x: 520, w: 380 }, { x: 1080, w: 380 }].map((g, gi) => {
      const ms = [];
      for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) {
        const x = -g.w / 2 + (g.w * (i + 0.5)) / 7 + (r ? g.w / 14 : 0) + c.rr(-8, 8);
        ms.push({ x, y: r * 26 + c.rr(-3, 3), s: (r ? 0.6 : 0.5) * c.rr(0.92, 1.06), flip: g.x + x > 800, o: folk(c) });
      }
      const state = (k) => pose3(c, ms.map((m, i) => {
        if (k === 0) return { ...m, head: -12, armF: 10, armB: 0 };
        if (k === 1) return { ...m, o: { ...m.o, pose: i % 4 === 0 ? 'stand' : 'kneel' }, head: 30, armF: i % 3 === 0 ? 105 : 45, armB: 6 };
        return { ...m, head: -14, armF: i % 2 ? 100 : 60, armB: i % 3 === 0 ? 150 : 40 };
      }));
      return { ...g, sp: [0, 1, 2].map((k) => P.sprite(state(k), g.x, 700)) };
    });

    /* the Son of Man on the clouds, the angels, the gathered */
    const heaven = S.layer({ par: 0.16, sh: 6, rise: 0 });
    const cloudBack = heaven.add(`<g transform="translate(0 -1500)">${cloud(c, 420, '#fbf4e4', '#efe2c4')}</g>`);
    const J = S.puppet(heaven.add(person(c, { ...CAST.jesus, robe: C.linen, mantle: mix(C.jesusMantle, C.halo, 0.35) })));
    const cloudFront = heaven.add(`<g transform="translate(0 -1500)">${cloud(c, 360, '#fffaf0', '#f1e6cc')}</g>`);
    const cloudSide = [-1, 1].map(() => heaven.add(`<g transform="translate(0 -1500)">${cloud(c, 240, '#f8f0de', '#ebdcbc')}</g>`));
    const angels = CORNERS.map(([x, y], i) => ({ i, x, y, p: S.puppet(heaven.add(angel(c, { holdF: `<g transform="rotate(64)">${trumpet(c, 62)}</g>` }))), bl: heaven.add(`<g transform="translate(0 -1500)">${blast(c, C.halo)}</g>`) }));
    const elect = [];
    CORNERS.forEach(([x, y], ci) => { for (let k = 0; k < 5; k++) elect.push({ ci, k, x: x + c.rr(-60, 60), y: y + c.rr(-30, 40), el: heaven.add(`<g transform="translate(0 -1500)">${soulLight(c, 8)}</g>`), a: ((ci * 5 + k) / 20) * PI * 2 }); });

    return (t, time) => {
      const T = time;
      /* the sky: twilight → dark → glory (cross-faded sheets) */
      const dark = es(t, 0.1, 1.2);
      const gl = es(t, 4.05, 4.6);
      skD.layer.fade(dark);
      skG.layer.fade(gl);
      starL.fade((1 - es(t, 1.1, 1.9)) * 0.8 * (1 - gl));
      gloryL.fade(gl);
      lit.fade(gl);

      const shake = bump(t, 1.4, 2.0);
      const sway = (seed, amp = 1) => (Math.sin(t * 26 + seed) * 18 + Math.sin(t * 61 + seed * 2) * 8) * shake * amp;
      hangL.shift(Math.sin(t * 50) * 8 * shake, 0);
      threadL.shift(Math.sin(t * 50) * 8 * shake, 0);
      far.shift(Math.sin(t * 60 + 1) * 4 * shake, 0);

      /* v29a — the sun darkened, the moon gives no light */
      const ecl = es(t, 0.1, 0.5);
      const up = es(t, 4.0, 4.4);
      pose(sunEl, { x: SUN[0], y: SUN[1] - up * 500, r: sway(1), o: 1 });
      pose(disc, { x: lerp(SUN[0] - 190, SUN[0], ecl), y: SUN[1] - up * 500, r: sway(1.2), o: ecl > 0.001 ? 1 : 0 });
      const md = es(t, 0.45, 0.75);
      pose(moonEl, { x: MOON[0], y: MOON[1] - up * 500, r: sway(2), o: 1 });
      fade(mglow, 0.8 * (1 - md)); fade(mdim, md * 0.85);
      clouds.forEach((cl) => pose(cl.el, { x: cl.x, y: cl.y - up * 600, r: sway(cl.i + 3, 0.6) }));

      /* v29b — the stars fall, the powers of heaven are shaken */
      STARS.forEach((s) => {
        const f = es(t, s.at, s.at + 0.6, ease.in);
        pose(s.el, { x: s.x + f * s.dx, y: s.y + f * 700, r: f * s.spin, s: 1 - f * 0.3, o: f < 0.98 ? 1 : 0 });
      });

      /* v30a — the sign of the Son of Man in the sky */
      const sg = es(t, 2.05, 2.45, ease.out) * (1 - es(t, 4.05, 4.35));
      pose(sign, { x: 800, y: 250 - (1 - sg) * 30, s: 0.7 + sg * 0.3, o: sg });

      /* the peoples: look up (0–2), mourn (3), lift their hands (4–6) */
      const mourn = es(t, 3.05, 3.12) * (1 - es(t, 4.1, 4.17));
      const awe = es(t, 4.1, 4.17);
      GROUPS.forEach((g) => {
        g.sp[0].set({ x: g.x, y: 700, s: 1, o: 1 - Math.max(mourn, awe) });
        g.sp[1].set({ x: g.x, y: 700, s: 1, o: mourn });
        g.sp[2].set({ x: g.x, y: 700, s: 1, o: awe });
      });

      /* v30c — the Son of Man comes on the clouds */
      const come = es(t, 4.05, 4.7, ease.out);
      const jy = lerp(-200, 440, come);
      const on = come > 0.001 ? 1 : 0;
      pose(cloudBack, { x: 800, y: jy + 6, s: 1.1, o: on });
      J.set({ x: 800, y: jy, s: 1.12, o: on, armB: 150 * come, armF: 80 * come - bump(t, 5.05, 5.6) * 25, head: -4, blink: blinkAt(T, 1) });
      pose(cloudFront, { x: 790, y: jy + 26, s: 1.05, o: on });
      cloudSide.forEach((el, i) => pose(el, { x: 800 + (i ? 1 : -1) * 250, y: jy + 16, s: 1, o: on }));

      /* v31 — angels with trumpets fly out to the four corners … and come back with the chosen */
      const send = es(t, 5.05, 5.65);
      const back = es(t, 6.1, 6.85);
      angels.forEach((a) => {
        const ox = 800 + (a.i % 2 ? 60 : -60), oy = 300;
        const x = lerp(lerp(ox, a.x, send), ox + (a.i % 2 ? 150 : -150), back);
        const y = lerp(lerp(oy, a.y, send), a.i < 2 ? 190 : 420, back);
        const flying = (send > 0 && send < 1) || (back > 0 && back < 1);
        const flip = back > 0 ? a.i % 2 === 1 : a.i % 2 === 0;
        const bob = T ? Math.sin(T * 1.6 + a.i) * 5 : 0;
        a.p.set({ x, y: y + bob, s: 0.5, flip, o: send > 0.02 ? 1 : 0, lean: flying ? 22 : 8, armF: 100, armB: 130 });
        const bk = bump(t, 5.45, 6.1) * (1 - back);
        const bx = x + (flip ? -1 : 1) * 58, by = y + bob - 104;
        pose(a.bl, { x: bx, y: by, s: 0.8 + bk * 0.5 + (T ? Math.sin(T * 8 + a.i) * 0.05 : 0), sx: flip ? -1 : 1, r: flip ? 20 : -20, o: bk });
      });
      elect.forEach((e) => {
        const onE = es(t, 5.9 + e.k * 0.04, 6.15 + e.k * 0.04);
        const k = es(t, 6.15 + e.k * 0.05, 6.9);
        const rx = 800 + Math.cos(e.a) * 250, ry = 330 + Math.sin(e.a) * 170;
        pose(e.el, { x: lerp(e.x, rx, k), y: lerp(e.y, ry, k) + (T ? Math.sin(T * 2 + e.a) * 4 : 0), s: 0.8 + k * 0.4, o: onE });
      });

      S.cam.z = 1 - es(t, 1.4, 1.9) * 0.03 + es(t, 4.1, 4.8) * 0.05 - es(t, 5.0, 5.6) * 0.06;
      S.cam.y = -es(t, 0.9, 1.4) * 20 - es(t, 4.1, 4.8) * 30;
    };
  },
};
