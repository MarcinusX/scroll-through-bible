// Mk 13,12–13 — night, a storm gathering over a village. A family portrait hangs in the dark: it tears
// between the brothers (and between father and child), then again between child and mother; the
// pieces turn away and darken. Then one disciple alone with a lamp, shadows all round pointing at
// him; he walks on through wind and rain, the lamp still burning — and at the end, the dawn.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, attr } from '../kit.js';
import { band, hillsWith, town, moon, stars, grass, rock, cypress, olive } from '../../assets/nature.js';
import { rain, stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { plate, tornPieces, handLamp, shadowPerson, lightCrown, woman, INK, SKIES, PI } from './lib.js';

const GY = 690;
const PW = 440, PH = 260, PX = 800, PY = 118, PS = 1.3;

/** the family, painted inside the portrait (local coords: origin at the plate's top centre) */
function family(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-PW / 2 + 12, 12, PW - 24, PH - 24), 0.3, 10), mix(C.parchment, C.dawn, 0.4));
  s.p(c.cut([[-PW / 2 + 12, 200], [PW / 2 - 12, 196], [PW / 2 - 12, PH - 12], [-PW / 2 + 12, PH - 12]], 0.4, 10), mix(C.sand, C.clay, 0.25));
  s.x(c.poly(c.ell(0, 110, 150, 80, 24)), C.lampGlow, 'opacity=".35"');
  const F = [
    { x: -162, s: 0.6, o: { robe: C.clayMantle, mantle: C.wood3, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather } }, // father
    { x: -94, s: 0.56, o: { robe: C.sageRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather } },  // elder brother
    { x: 2, s: 0.55, o: { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope } },       // younger brother
    { x: 70, s: 0.38, o: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin } },                       // the child
    { x: 150, s: 0.57, o: { robe: C.linen2, mantle: C.mauve, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2 } },                   // mother
  ];
  let figs = '';
  F.forEach((f, i) => { figs += `<g transform="translate(${f.x} 222) scale(${f.s * 1.25})">${person(c, { ...f.o, eyes: 'open' }).replace('class="armFr"', `class="armFr" transform="rotate(${i === 3 ? -30 : -12})"`)}</g>`; });
  return s.out() + figs;
}

export default {
  id: 'm13-family',
  beats: [
    { v: 12, text: 'Brat wyda brata na śmierć i ojciec swoje dziecko;' },
    { v: 12, cont: true, text: 'powstaną dzieci przeciw rodzicom i o śmierć ich przyprawią.' },
    { v: 13, text: 'I będziecie w nienawiści u wszystkich z powodu mojego imienia.' },
    { v: 13, cont: true, text: 'Lecz kto wytrwa do końca, ten będzie zbawiony.' },
  ],
  cam: { x: [-20, 40], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const NIGHT = ['#232a52', '#3a3a64', '#5d5270'];
    const DAWN = ['#8f86ad', '#e3a58e', '#f6d2a4'];
    const sk = sky(S, NIGHT);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 380, n: 50 }));
    const dawnL = S.layer({ par: 0.05, sh: 1, flat: true });
    dawnL.add(`<circle cx="1180" cy="470" r="520" fill="url(#halo-glow)"/>`);

    /* storm clouds on strings */
    const cloudL = S.layer({ par: 0.06, sh: 5 });
    const clouds = [[430, 150, 380], [1000, 110, 460], [1400, 190, 340]].map(([x, y, w], i) => ({ x, y, i, el: hanging(cloudL, stormCloud(c, w, mix(C.storm, C.night, 0.3), C.storm2), { x, y, len: 700 }) }));

    /* the village on its hill, the land */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.night2, 0.55), x0: -1400, x1: 3000 });
    far.add(h1.markup + town(c, { x: 360, y: h1.fn(360) + 10, n: 8, spread: 360, sc: 0.6, wall: mix(C.plaster, C.night2, 0.45), shadow: mix(C.plaster2, C.night2, 0.55), lit: true }) + cypress(c, 640, h1.fn(640) + 6, 90, mix(C.moss2, C.night2, 0.5)) + town(c, { x: 1320, y: h1.fn(1320) + 10, n: 6, spread: 260, sc: 0.55, wall: mix(C.plaster, C.night2, 0.45), shadow: mix(C.plaster2, C.night2, 0.55), lit: true }));
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(hillsWith(c, { y: 560, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.night2, 0.5), trees: 18, treeColor: mix(C.moss2, C.night2, 0.5), treeH: 20, x0: -1400, x1: 3000 }).markup);
    const groundL = S.layer({ par: 0.42, sh: 3 });
    const gfn = c.wave(640, [5, 2], [700, 170]);
    groundL.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.night2, 0.45)).out() + sheet().p(c.cut([[-1400, 676], [3000, 668], [3000, 716], [-1400, 724]], 1.2, 14), mix(C.sand2, C.night2, 0.45)).out() + grass(c, { x0: -800, x1: 2400, y: 640, fn: gfn, n: 34, h: 12, color: mix(C.olive, C.night2, 0.4) }) + olive(c, 250, 650, 0.9, { trunk: mix(C.wood2, C.night2, 0.4), leaf: mix(C.olive, C.night2, 0.45), leaf2: mix(C.sage, C.night2, 0.45) }));

    /* the portrait and its torn pieces */
    const PHONE = S.portrait;   // phone: a smaller portrait inside the screen, flown well out; the shadows closer in
    const PSc = PHONE ? 0.98 : PS, DRc = PHONE ? 0.45 : 1, UPc = PHONE ? 1100 : 620;
    const pL = S.layer({ par: 0.3, sh: 6 });
    const frame = pL.add(`<g>${plate(c, PW, PH, { face: C.parchment })}</g>`);
    const { pieces, defs } = tornPieces(c, family(c), [-PW / 2 + 12, 12, PW / 2 - 12, PH - 12], [-50, 110], S.id('tear'));
    S.defs(defs);
    const P3 = pieces.map((p, k) => {
      const el = pL.add(`<g>${p.markup}<rect class="dim" x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="${C.night2}" opacity="0" clip-path="url(#${S.id('tear')}-${k})"/></g>`);
      return { ...p, k, el, dim: el.querySelector('.dim') };
    });
    const whole = pL.add(`<g>${family(c)}</g>`);

    /* one disciple, a lamp; the shadows around */
    const P = S.layer({ par: 0.5, sh: 5 });
    const shadows = [
      { x: 420, flip: false }, { x: 500, flip: false }, { x: 1110, flip: true }, { x: 1190, flip: true }, { x: 560, flip: false }, { x: 1040, flip: true },
    ].map((m, i) => ({ ...m, x: PHONE ? 800 + (m.x - 800) * 0.66 : m.x, i, seed: c.rr(0, 9), p: S.puppet(P.add(shadowPerson(c, i % 2 ? woman(c) : crowdPerson(c), mix(INK, C.night2, 0.4)))) }));
    const lamp = handLamp(c, { glowR: 150 });
    const dis = S.puppet(P.add(person(c, { ...CAST.john, holdF: `<g transform="translate(-4 4)">${lamp}</g>` })));
    const flameEl = P.el.querySelector('.flame'), lampGlow = P.el.querySelector('.glow');
    const crownL = P.add(`<g>${lightCrown(c, 34)}</g>`);

    /* rain sheets sliding on the compositor */
    const r1 = S.layer({ par: 0.6, sh: 1, flat: true, pad: 200 });
    r1.add(rain(c, { x0: -1400, x1: 3000, y0: -900, y1: 1600, n: 420, slant: -46, color: '#cfd7e6' }));
    const r2 = S.layer({ par: 0.8, sh: 1, flat: true, pad: 260 });
    r2.add(rain(c, { x0: -1400, x1: 3000, y0: -900, y1: 1600, n: 260, slant: -52, color: '#e3e8f1' }));

    return (t, time) => {
      const T = time;
      const dawn = es(t, 3.35, 3.95);
      sk.blend(NIGHT, DAWN, dawn);
      starL.fade(0.6 * (1 - es(t, 2.9, 3.4)));
      dawnL.fade(dawn);
      clouds.forEach((cl) => {
        const up = es(t, 3.4, 3.95);
        pose(cl.el, { x: cl.x + Math.sin(T * 0.3 + cl.i) * 20 + es(t, 2.8, 3.4) * (cl.i - 1) * 40, y: cl.y - up * (PHONE ? 900 : 500), r: Math.sin(T * 0.8 + cl.i) * 1.5 });
      });

      /* the portrait: hangs whole, then tears (beat 0), tears again (beat 1), flies out (beat 2) */
      const pin = es(t, -0.4, 0.1, ease.back);
      const out = es(t, 2.0, 2.35);
      const py = lerp(-500, PY, pin) - out * UPc;
      const t1 = es(t, 0.3, 0.6), t2 = es(t, 1.3, 1.6);
      fade(whole, t1 > 0 ? 0 : 1);
      pose(whole, { x: PX, y: py, s: PSc });
      pose(frame, { x: PX, y: py, s: PSc, o: 1 - es(t, 0.3, 0.45) });
      P3.forEach((p) => {
        // piece 0 (father, brother) goes left; piece 1 (brother, child) right; piece 2 (mother) further right in beat 1
        const dx = p.k === 0 ? -t1 * 80 - t2 * 24 : p.k === 1 ? t1 * 40 - t2 * 34 : t1 * 40 + t2 * 80;
        const r = p.k === 0 ? -t1 * 6 - t2 * 3 : p.k === 1 ? -t2 * 5 : t2 * 9;
        const dy = p.k === 1 ? t2 * 16 : p.k === 2 ? -t2 * 10 : t1 * 6;
        const wob = p.k === 0 ? t1 : t2;
        pose(p.el, { x: PX + (p.cx + dx * DRc) * PSc, y: py + (p.cy + dy) * PSc + Math.sin(T * 0.8 + p.k) * 2 * wob, s: PSc, r: r + Math.sin(T * 0.7 + p.k * 2) * 0.8 * wob, ox: p.cx, oy: p.cy, o: t1 > 0 ? 1 : 0 });
        attr(p.dim, 'opacity', (t1 * 0.2 + t2 * 0.3));
      });

      /* the shadows gather and point (beat 2) */
      const hate = es(t, 2.1, 2.5);
      shadows.forEach((m) => {
        const k = es(t, 2.05 + m.i * 0.05, 2.45 + m.i * 0.05);
        const x = lerp(m.flip ? 1700 : -100, m.x, k);
        const leave = es(t, 3.05, 3.4);
        m.p.set({ x: lerp(x, m.flip ? 1800 : -200, leave), y: GY - 4 + (m.i % 2) * 6, s: 0.92, flip: m.flip, o: k > 0.01 ? 0.9 * (1 - leave * 0.8) : 0, walk: (k > 0 && k < 1) || (leave > 0 && leave < 1) ? x * 0.05 : undefined, armF: hate * (60 + (m.i % 3) * 15) * (1 - leave), head: -hate * 4 });
      });

      /* the disciple with his lamp: stands among them, then walks on through the storm to the dawn */
      const inn = es(t, 1.95, 2.3);
      const go = seg(t, 3.02, 3.8);
      const x = lerp(lerp(-120, 780, inn), 960, ease.io(go));
      const walking = (t > 1.95 && t < 2.3) || (go > 0 && go < 1);
      const storm = es(t, 2.8, 3.05) * (1 - es(t, 3.6, 3.9));
      dis.set({ x, y: GY + 2, s: 1, walk: walking ? x * 0.05 : undefined, amt: 0.8, lean: storm * 8 + hate * (1 - storm) * -2, armF: 70 + Math.sin(T * 1.6) * 3 * storm, armB: 10 + storm * 30, head: 4 * storm - dawn * 10, blink: blinkAt(T, 1), o: inn > 0.01 ? 1 : 0 });
      const gust = 1 - storm * (0.35 + 0.25 * Math.sin(T * 7));
      pose(flameEl, { x: 27, y: -12, sx: gust, sy: gust * (1 + Math.sin(T * 9) * 0.08), r: -storm * 20 });
      fade(lampGlow, 0.75 + Math.sin(T * 3) * 0.05 - storm * 0.15);
      const cr = es(t, 3.6, 3.95, ease.back);
      pose(crownL, { x: x + 2, y: GY - 196 - (1 - cr) * 120, s: cr * 0.9, r: Math.sin(T * 0.8) * 3, o: cr > 0.01 ? 1 : 0 });

      /* rain */
      const rOn = es(t, 2.7, 3.0) * (1 - es(t, 3.55, 3.85));
      r1.fade(rOn * 0.9); r2.fade(rOn);
      r1.shift(((T * 60) % 200) - 100 - ((T * 60) % 200) * 0.2, ((T * 420) % 400) - 200);
      r2.shift(((T * 80) % 260) * -0.3, ((T * 560) % 520) - 260);

      S.cam.x = es(t, 3.0, 3.8) * 30;
      S.cam.y = es(t, 1.9, 2.4) * 30;
      S.cam.z = 1 + es(t, 1.9, 2.4) * 0.04;
    };
  },
};
