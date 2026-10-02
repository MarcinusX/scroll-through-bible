// Mt 17,22–23 — gathered together in Galilee, at dusk on a hillside above the lake, round a little fire. "The Son
// of Man is about to be delivered into the hands of men": a plate comes down — a small figure of light, and hands
// reaching up around it. "They will kill him" — the plate goes dark, night falls, three moons pass on their strings —
// "and on the third day he will be raised": a sun rises and the figure of light stands up in it. "And they were
// exceedingly sorry": the plate is gone; they sit with bowed heads and grieving faces in the grey evening.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, hillsWith, rock, grass, olive, sun, moon, stars, cypress, bush, town } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { TWELVE, plate, reachingHand, silhouette, withFace, faceBits, DUSK, DEEP, DAWN } from './lib.js';

const PI = Math.PI;
const FEET = 700;
const GREY = ['#8e8aa6', '#c4b2b0', '#dcc7b4'];

export default {
  id: 'mt17-galilee',
  beats: [
    { v: 22 },
    { v: 23, text: 'Oni zabiją Go, ale trzeciego dnia zmartwychwstanie».' },
    { v: 23, cont: true, text: 'I bardzo się zasmucili.' },
  ],
  cam: { x: [-30, 30], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DUSK, { name: 'dusk' });
    const nightL = sky(S, DEEP, { name: 'deep' }).layer;
    const dawnSky = sky(S, DAWN, { name: 'dawn' }).layer;
    const greyL = sky(S, GREY, { name: 'grey' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunDown = hanging(hangL, sun(c, 36, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 1220, y: 360, len: 900 });
    const moons = [0, 1, 2].map((i) => ({ i, x: 900 + i * 110, el: hanging(hangL, `<circle r="80" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 26)}`, { x: 900 + i * 110, y: 170, len: 900 }) }));
    const dawnL = S.layer({ par: 0.05, sh: 1, flat: true });
    const dawnRays = dawnL.add(`<g opacity="0"><circle r="300" fill="url(#warm-glow)"/>${rays(c, { n: 18, r0: 60, r1: 700, spread: 0.05, color: '#fff1c8' })}</g>`);
    const risingSun = hanging(hangL, sun(c, 46), { x: 1010, y: 470, len: 1000 });

    /* ---------- Galilee: far hills over the lake ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    const lakeL = S.layer({ par: 0.12, sh: 1 });
    lakeL.add(waterBand(c, { y: 470, color: mix(C.lake, C.duskViolet, 0.3), foamN: 16, bottom: 1000 }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 560, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.25), trees: 22, treeColor: mix(C.sage, C.duskViolet, 0.25), treeH: 20 });
    hills.add(h2.markup + town(c, { x: 330, y: h2.fn(330) + 8, n: 6, spread: 220, sc: 0.46, lit: true }));

    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(640, [5, 2], [700, 160]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.duskViolet, 0.18)).out());
    G.add(olive(c, 250, 650, 0.95, { leaf: mix(C.olive, C.duskViolet, 0.2) }) + cypress(c, 1440, 650, 130, mix(C.moss2, C.duskViolet, 0.2)) + rock(c, 800, FEET - 6, 110, 26, C.rock2) + bush(c, 1300, 690, 70, mix(C.sage, C.duskViolet, 0.2), C.moss));
    G.add(grass(c, { x0: -400, x1: 2000, y: 640, fn: gfn, n: 30, h: 12, color: mix(C.olive, C.duskViolet, 0.2) }));

    /* ---------- Jesus and the disciples round the fire ---------- */
    const pL = S.layer({ par: 0.45, sh: 5 });
    const SEAT = [[520, 0.86, 'sit'], [590, 0.9, 'sit'], [664, 0.92, 'sit'], [936, 0.92, 'sit'], [1010, 0.9, 'sit'], [1080, 0.86, 'sit'], [470, 0.84, 'stand'], [1130, 0.84, 'stand']];
    const KS = [0, 3, 6, 1, 2, 7, 4, 5];
    const PH = S.portrait;   // phone: the circle sits closer round the fire, so the outer two aren't cut by the frame / the thread
    const DIS = SEAT.map(([x0, s, p], i) => {
      const x = PH ? (p === 'stand' ? (x0 < 800 ? 540 : 1046) : 800 + (x0 - 800) * 0.8) : x0;
      const o = TWELVE[KS[i]].o;
      const pp = S.puppet(pL.add(withFace(person(c, { ...o, pose: p }), faceBits(c))));
      return { i, x, s, p, flip: x > 800, seed: c.rr(0, 9), pp, sad: pp.el.querySelector('[data-part="sad"]'), tear: pp.el.querySelector('[data-part="tear"]') };
    });
    const jSit = S.puppet(pL.add(withFace(person(c, { ...CAST.jesus, pose: 'sit' }), faceBits(c))));
    const jSad = jSit.el.querySelector('[data-part="sad"]');
    // a small fire in front
    const fire = pL.add(`<g><ellipse cx="0" cy="-10" rx="120" ry="60" fill="url(#warm-glow)"/>${sheet().p(c.cut([[-28, 0], [28, 0], [22, 6], [-22, 6]], 0.3, 4) + c.ribbon([[-26, 2], [24, -8]], 5) + c.ribbon([[-22, -8], [26, 3]], 5), C.wood2).out()}<g class="fl"><path d="M-12 -2C-18 -14 -8 -24 -2 -40C6 -26 16 -18 12 -2Z" fill="${C.sunDeep}"/><path d="M-5 -3C-8 -12 -2 -18 1 -27C5 -18 8 -12 5 -3Z" fill="${C.lampFlame}"/></g></g>`);
    const flame = fire.querySelector('.fl');

    /* ---------- the plate: into the hands of men ---------- */
    const plL = S.layer({ par: 0.12, sh: 5 });
    const light = `<g transform="translate(0 44) scale(.42)">${person(c, { ...silhouette(CAST.jesus, '#fff6dc'), halo: false })}</g>`;
    const handCols = [C.skin2, C.skin3, C.skin4, C.skin, C.skin3, C.skin2];
    const hands = handCols.map((col, i) => `<g transform="translate(${-56 + i * 22} ${96 + (i % 2) * 8}) rotate(${(i - 2.5) * 8})">${reachingHand(c, col)}</g>`).join('');
    S.defs(`<clipPath id="${S.id('pl')}"><circle r="84"/></clipPath>`);
    const handPlate = hanging(plL, `${plate(c, '', { r: 84, fill: C.parchment })}<g clip-path="url(#${S.id('pl')})"><g data-k="dawnIn" opacity="0"><circle cy="-10" r="90" fill="url(#warm-glow)"/></g><g data-k="lightfig"><circle cy="-10" r="60" fill="url(#halo-glow)"/>${light}</g><g data-k="hands">${hands}</g><rect data-k="plshade" x="-90" y="-90" width="180" height="180" fill="#2a2446" opacity="0"/></g>`, { x: 640, y: 250, len: 900 });
    const handsEl = S.$('hands'), lightFig = S.$('lightfig'), plShade = S.$('plshade'), dawnIn = S.$('dawnIn');

    return (t, time) => {
      const T = time;
      /* the sky: dusk → night (three nights) → dawn → grey evening of grief */
      const night = es(t, 1.08, 1.3) * (1 - es(t, 1.6, 1.8));
      const dawn = es(t, 1.6, 1.8) * (1 - es(t, 2.05, 2.4));
      nightL.fade(night);
      dawnSky.fade(dawn);
      greyL.fade(es(t, 2.05, 2.4));
      starL.fade(night);
      swing(sunDown, 1220, 360 + es(t, 0, 1.1) * 300, T, 1, 0.6);
      moons.forEach((m) => {
        const on = es(t, 1.2 + m.i * 0.12, 1.3 + m.i * 0.12, ease.back) * (1 - es(t, 1.58, 1.7));
        swing(m.el, m.x, lerp(-1000, 170, on), T, 1, 0.6, m.i);
      });
      const up = es(t, 1.62, 1.9, ease.out) * (1 - es(t, 2.05, 2.4));
      swing(risingSun, 1010, lerp(660, 300, up), T, 0.8, 0.5, 4);
      pose(dawnRays, { x: 1010, y: lerp(660, 300, up), s: 0.5 + up * 0.6, r: t * 6, o: up * 0.8 });

      /* the plate */
      const pl = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 2.02, 2.25));
      swing(handPlate, 640, lerp(-1000, 250, pl), T, 1, 0.7, 2);
      pose(handsEl, { x: 0, y: -es(t, 0.35, 0.8) * 34 });
      const dark = es(t, 1.05, 1.25) * (1 - es(t, 1.6, 1.8));
      fade(plShade, dark * 0.78);
      fade(dawnIn, es(t, 1.62, 1.85));
      pose(lightFig, { x: 0, y: -es(t, 1.62, 1.9) * 18, s: 1 + es(t, 1.62, 1.9) * 0.1 });

      /* Jesus speaks; the disciples listen, and grieve */
      const speak = es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.1));
      jSit.set({ x: 800, y: FEET - 10, s: 1.0, armF: 20 + speak * (30 + Math.sin(T * 1.3) * 8) + es(t, 1.62, 1.85) * 40 * (1 - es(t, 2.0, 2.2)), armB: 10 + speak * 20 + es(t, 1.62, 1.85) * 100 * (1 - es(t, 2.0, 2.2)), head: -2 + es(t, 1.05, 1.3) * 8 * (1 - es(t, 1.6, 1.8)) + es(t, 2.1, 2.4) * 6, blink: blinkAt(T, 1) });
      pose(jSad, { o: es(t, 2.1, 2.4) * 0.8 });
      const grief = es(t, 2.05, 2.4);
      DIS.forEach((d) => {
        const look = es(t, 0.3, 0.6) * (1 - grief);
        const shock = bump(t, 1.05, 1.9);
        d.pp.set({ x: d.x, y: FEET + (d.p === 'stand' ? -14 : 4), s: d.s, flip: d.flip, head: -4 - look * 10 + shock * 6 + grief * (14 + (d.i % 3) * 3), armF: 20 + shock * (d.i % 2 ? 40 : 10) + grief * (d.i % 3 === 0 ? 100 : 40), armB: 10 + grief * (d.i % 3 === 0 ? 110 : 20), lean: grief * 6, blink: grief > 0.5 ? 0 : blinkAt(T, d.seed) });
        pose(d.sad, { o: Math.max(shock * 0.6, grief) });
        pose(d.tear, { o: grief * (d.i % 2) });
      });
      pose(fire, { x: 800, y: FEET + 40, s: 0.9 });
      pose(flame, { x: 0, y: 0, sy: 1 + Math.sin(T * 7) * 0.08 - grief * 0.3, sx: 1 + Math.sin(T * 5) * 0.05 });

      S.cam.z = 1.03 + es(t, 0.1, 0.6) * 0.05 + es(t, 2.05, 2.5) * 0.04;
      S.cam.y = 16 + es(t, 0.1, 0.6) * 10 + es(t, 2.05, 2.5) * 16;
    };
  },
};
