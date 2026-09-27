// Mk 10,33–34 — evening by the roadside fire. Jesus tells the Twelve what will happen, and it plays out as
// a shadow-play on a lit paper screen above them — restrained, symbolic: the walls of Jerusalem; the Son
// of Man handed to the chief priests and scribes; condemned and given to the Gentiles (helmets, spears);
// mocked and scourged (only a crown of thorns and a whip's shadow), killed — the lamp behind the screen
// goes out. Then three moons cross the dark screen… and on the third day the sun rises and floods it gold.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix, hanging, swing } from '../kit.js';
import { band, stars, moon as moonCut, rock, bush } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { TWELVE, shadowPerson, addToHead, priestHat, helmet, thornCrown, whip, pharisee, man, slip } from './lib.js';

const INK = '#3b2a22';
const SX0 = 500, SX1 = 1100, SY0 = 120, SY1 = 420;   // the screen
const FL = SY1 - 14;                                   // the shadow floor on the screen
const GY = 724;

/** a walled city in silhouette; origin: ground centre */
function citySil(c, sc = 1) {
  const s = sheet();
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  s.p(c.cut(P([[-170, 0], [-170, -60], [-150, -60], [-150, -92], [-122, -92], [-122, -60], [-40, -60], [-40, -120], [-30, -150], [30, -150], [40, -120], [40, -60], [120, -60], [120, -92], [148, -92], [148, -60], [170, -60], [170, 0]]), 0.6, 6), INK);
  s.p(c.cut(P([[-40, -120], [-50, -128], [50, -128], [40, -120]]), 0.3, 4), INK);
  let cr = '';
  for (let x = -166; x < 166; x += 16) cr += c.poly(P([[x, -60], [x, -68], [x + 8, -68], [x + 8, -60]]));
  s.x(cr, INK);
  return s.out();
}
/** a spear held upright; origin: grip */
function spear(c) { return `<path d="${c.ribbon([[0, 60], [0, -150]], 3)}" fill="${INK}"/><path d="${c.poly([[-6, -146], [0, -170], [6, -146]])}" fill="${INK}"/>`; }
/** a small cross on a hill, in silhouette; origin: foot of the hill */
function hillCross(c) {
  return `<path d="${c.cut([[-120, 0], [-60, -30], [0, -40], [60, -30], [120, 0]], 0.6, 6)}" fill="${INK}"/><path d="${c.poly([[-3, -40], [-3, -130], [3, -130], [3, -40]]) + c.poly([[-26, -108], [26, -108], [26, -102], [-26, -102]])}" fill="${INK}"/>`;
}

export default {
  id: 'm10-foretold',
  beats: [
    { v: 33, text: '«Oto idziemy do Jerozolimy.' },
    { v: 33, cont: true, text: 'Tam Syn Człowieczy zostanie wydany arcykapłanom i uczonym w Piśmie.' },
    { v: 33, cont: true, text: 'Oni skażą Go na śmierć i wydadzą poganom.' },
    { v: 34, text: 'I będą z Niego szydzić, oplują Go, ubiczują i zabiją,' },
    { v: 34, cont: true, text: 'a po trzech dniach zmartwychwstanie».' },
  ],
  cam: { x: [-20, 20], y: [-80, 20], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const DUSK = ['#2c2f55', '#5b4f73', '#b7897e'];
    const sk = sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 460, n: 110 }));
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 520, amps: [18, 8, 3], lens: [900, 300, 120], color: mix(C.night, C.duskViolet, 0.35) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(band(c, { y: 590, amps: [10, 5, 2], lens: [700, 260, 100], color: mix(C.night2, C.soil, 0.35) }).markup);

    /* the shadow-play screen, lit from behind */
    const scrL = S.layer({ par: 0.3, sh: 6 });
    const W = SX1 - SX0, H = SY1 - SY0;
    const gid = S.id('scr');
    S.defs(`<radialGradient id="${gid}" cx="50%" cy="55%" r="65%"><stop offset="0" stop-color="#fbe6b8"/><stop offset=".7" stop-color="#f0cf96"/><stop offset="1" stop-color="#d9a86c"/></radialGradient>`);
    const scrim = hanging(scrL, `<g><rect x="${-W / 2}" y="0" width="${W}" height="${H}" fill="url(#${gid})"/><path class="grain" d="M${-W / 2} 0H${W / 2}V${H}H${-W / 2}Z"/></g>`, { x: 800, y: SY0, len: 900 });
    const cid = S.id('clip');
    S.defs(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="${SX0}" y="${SY0}" width="${W}" height="${H}"/></clipPath>`);
    const clipAdd = (L, inner) => L.add(`<g clip-path="url(#${cid})">${inner}</g>`).firstElementChild;
    const shadowL = S.layer({ par: 0.3, sh: 1, flat: true });
    // silhouettes on the screen
    const city = clipAdd(shadowL, `<g opacity="0">${citySil(c, 1.1)}</g>`);
    const son = clipAdd(shadowL, `<g opacity="0">${addToHead(shadowPerson(c, { ...CAST.jesus, halo: false }), `<path d="${c.ribbon(c.arc(0, 0, 30, 30, 0, Math.PI * 2, 30), 2.4)}" fill="${INK}"/>`)}</g>`);
    const sonP = S.puppet(son.querySelector('.fig'));
    const PRIESTS = [0, 1, 2].map((i) => {
      const el = clipAdd(shadowL, `<g opacity="0">${addToHead(shadowPerson(c, pharisee(c, i)), i < 2 ? priestHat(c, INK) : '')}</g>`);
      return { el, p: S.puppet(el.querySelector('.fig')), i };
    });
    const SOLDIERS = [0, 1].map((i) => {
      const el = clipAdd(shadowL, `<g opacity="0">${addToHead(shadowPerson(c, man(c, { beard: 'short' })), helmet(c, INK)).replace('<g class="hold"', '<g class="hold"')}<g class="sp">${spear(c)}</g></g>`);
      return { el, p: S.puppet(el.querySelector('.fig')), sp: el.querySelector('.sp'), i };
    });
    const crownEl = clipAdd(shadowL, `<g opacity="0">${thornCrown(c, 26, INK)}</g>`);
    const whipEl = clipAdd(shadowL, `<g opacity="0">${whip(c, INK)}</g>`);
    const cross = clipAdd(shadowL, `<g opacity="0">${hillCross(c)}</g>`);
    // darkness on the screen, three moons, the dawn
    const darkL = S.layer({ par: 0.3, sh: 1, flat: true });
    const dark = clipAdd(darkL, `<g opacity="0"><rect x="${SX0}" y="${SY0}" width="${W}" height="${H}" fill="${mix(C.night2, C.soilRich, 0.3)}"/></g>`);
    const MOONS = [0, 1, 2].map((i) => ({ el: clipAdd(darkL, `<g opacity="0"><circle r="40" fill="url(#halo-glow)" opacity=".5"/>${moonCut(c, 22)}</g>`), tag: clipAdd(darkL, `<g opacity="0">${slip(c, String(i + 1), { size: 16, w: 26 })}</g>`), i }));
    const dawn = clipAdd(darkL, `<g opacity="0"><rect x="${SX0}" y="${SY0}" width="${W}" height="${H}" fill="#fde7b3"/></g>`);
    const dawnRays = clipAdd(darkL, `<g opacity="0">${rays(c, { n: 20, r0: 30, r1: 420, spread: 0.06, color: '#fff6da' })}<circle r="120" fill="url(#halo-glow)"/></g>`);
    const risenEl = clipAdd(darkL, `<g>${person(c, { ...CAST.jesus, robe: '#fffaf0', mantle: '#fbe3b0' })}</g>`);
    const risen = S.puppet(risenEl.querySelector('.fig'));
    // the screen's wooden frame
    const frameL = S.layer({ par: 0.3, sh: 6 });
    const fr = sheet();
    fr.p(c.cut([[SX0 - 18, SY0 - 18], [SX1 + 18, SY0 - 18], [SX1 + 18, SY1 + 18], [SX0 - 18, SY1 + 18]], 0.6, 10) + c.hole([[SX0, SY0], [SX1, SY0], [SX1, SY1], [SX0, SY1]], 0.4, 10), C.wood2);
    fr.p(c.cut(c.rect(SX0 - 8, SY1 + 18, 14, 330), 0.4, 8) + c.cut(c.rect(SX1 - 6, SY1 + 18, 14, 330), 0.4, 8), C.wood);
    const frameEl = frameL.add(`<g>${fr.out()}</g>`);

    /* by the fire: Jesus and the Twelve */
    const groundL = S.layer({ par: 0.45, sh: 3 });
    groundL.add(sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 1, 30), mix(C.soil, C.night, 0.35)).out());
    const fireL = S.layer({ par: 0.5, sh: 3 });
    const glow = fireL.add(`<g><circle r="260" fill="url(#warm-glow)" opacity=".75"/></g>`);
    const logs = fireL.add(`<g>${sheet().p(c.ribbon([[-30, 0], [30, -8]], 9) + c.ribbon([[-30, -8], [30, 0]], 9), C.wood2).out()}</g>`);
    const flames = [0, 1, 2].map((i) => fireL.add(`<g><path d="M0 0C-12 -10 -10 -30 0 -${54 - i * 12}C10 -30 12 -10 0 0Z" fill="${i === 1 ? '#fff0c4' : C.lampFlame}"/></g>`));
    const pL = S.layer({ par: 0.5, sh: 5 });
    const SEAT = [
      [520, GY - 30, 0.78, false], [590, GY - 44, 0.74, false], [660, GY - 50, 0.72, false], [960, GY - 50, 0.72, true], [1030, GY - 44, 0.74, true], [1100, GY - 30, 0.78, true],
      [470, GY + 4, 0.84, false], [560, GY + 14, 0.88, false], [1040, GY + 14, 0.88, true], [1130, GY + 4, 0.84, true], [640, GY + 30, 0.92, false], [960, GY + 30, 0.92, true],
    ];
    const DIS = TWELVE.map((d, i) => ({ i, p: S.puppet(pL.add(person(c, { ...d.o, pose: i % 3 === 2 ? 'kneel' : 'sit' }))), seed: c.rr(0, 9), at: SEAT[i] }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 1000, 220, mix(C.moss2, C.night, 0.4), mix(C.moss, C.night, 0.4)) + rock(c, 1440, 990, 200, 66, mix(C.rock3, C.night, 0.4)));

    return (t, time) => {
      const T = time;
      /* the lamp behind the screen, the fire */
      swing(scrim, 800, SY0, 0, 0, 0);
      const out = es(t, 3.8, 4.02);
      const dim = es(t, 3.5, 3.75) * 0.45;
      const rise = es(t, 4.55, 4.9);
      fade(dark, Math.max(dim, out) * (1 - rise));
      fade(dawn, rise * 0.9);
      pose(dawnRays, { x: 800, y: FL - 60, s: 0.5 + rise * 0.6, r: t * 10, o: rise });
      const fl = (i) => 1 + Math.sin(T * (8 + i * 3) + i) * 0.1;
      flames.forEach((f, i) => pose(f, { x: 800 + (i - 1) * 12, y: GY + 8, sx: 0.9 + i * 0.1, sy: fl(i) * (1 - out * 0.5 + rise * 0.3) }));
      pose(logs, { x: 800, y: GY + 12 });
      pose(glow, { x: 800, y: GY + 10, s: 0.9 - out * 0.3 + rise * 0.3 });
      sk.blend(DUSK, ['#1f2347', '#3f3a63', '#7d6479'], out * (1 - rise * 0.7));

      /* beat 0: Jerusalem */
      pose(city, { x: 800, y: FL + 4, s: 1, o: es(t, 0.05, 0.4) * (1 - es(t, 0.9, 1.1) * 0.75) * (1 - es(t, 3.45, 3.6)) });

      /* beat 1: the Son of Man is handed over to the chief priests and scribes */
      const led = es(t, 1.05, 1.6);
      const toGentiles = es(t, 2.35, 2.75);
      const sx = lerp(560, 780, led) + toGentiles * 120;
      sonP.set({ x: 0, y: 0, s: 1, walk: (led > 0 && led < 1) || (toGentiles > 0 && toGentiles < 1) ? sx * 0.1 : undefined, head: 8 + es(t, 3.05, 3.3) * 10, armF: 0, armB: 0 });
      pose(son, { x: sx, y: FL, s: 0.62, o: es(t, 1.0, 1.15) * (1 - es(t, 3.45, 3.6)) });
      PRIESTS.forEach((pr) => {
        const px = 840 + pr.i * 70 - toGentiles * 260 - es(t, 2.6, 2.9) * 100;
        const judge = pr.i === 0 ? bump(t, 2.0, 2.5) : 0;
        pr.p.set({ x: 0, y: 0, s: 1, flip: true, armF: 20 + judge * 110 + led * 20, armB: judge * 40, walk: toGentiles > 0 && toGentiles < 1 ? px * 0.1 : undefined });
        pose(pr.el, { x: px, y: FL, s: 0.6, o: es(t, 1.2 + pr.i * 0.06, 1.35 + pr.i * 0.06) * (1 - es(t, 2.7, 2.9)) });
      });
      /* beat 2: condemned — and handed over to the Gentiles */
      SOLDIERS.forEach((so) => {
        const x = lerp(1180 + so.i * 70, 950 + so.i * 70, es(t, 2.4, 2.8));
        so.p.set({ x: 0, y: 0, s: 1, flip: true, armF: 40, walk: t > 2.4 && t < 2.8 ? x * 0.1 : undefined });
        pose(so.el, { x, y: FL, s: 0.62, o: es(t, 2.4, 2.55) * (1 - es(t, 3.45, 3.6)) });
        pose(so.sp, { x: -14, y: -84 });
      });

      /* beat 3: mocked, spat upon, scourged, killed — a crown of thorns, a whip's shadow, the lamp goes out */
      pose(crownEl, { x: sx + 1, y: FL - 118 - (1 - es(t, 3.05, 3.2)) * 60, s: 0.62, o: es(t, 3.05, 3.2) * (1 - es(t, 3.45, 3.6)) });
      pose(whipEl, { x: sx + 70, y: FL - 20, r: -30 + bump(t, 3.2, 3.5) * 40, s: 0.8, o: bump(t, 3.15, 3.55) * 0.9 });
      pose(cross, { x: 800, y: FL + 8, s: 0.9, o: es(t, 3.5, 3.65) * (1 - out) });

      /* beat 4: three moons cross the dark screen — then the sun rises */
      MOONS.forEach((m) => {
        const k = seg(t, 4.02 + m.i * 0.16, 4.2 + m.i * 0.16);
        const x = lerp(SX0 + 40, SX1 - 40, k), y = SY1 - 40 - Math.sin(k * Math.PI) * 200;
        pose(m.el, { x, y, o: k > 0 && k < 1 ? 1 : 0 });
        pose(m.tag, { x: 600 + m.i * 200, y: SY0 + 40, o: es(t, 4.1 + m.i * 0.16, 4.2 + m.i * 0.16) * (1 - rise) });
      });
      risen.set({ x: 800, y: FL + 4 - (1 - es(t, 4.6, 4.9)) * 30, s: 0.8, o: es(t, 4.65, 4.85), armF: 90, armB: 150, blink: 0 });

      /* the listeners */
      const heavy = es(t, 3.05, 3.4) * (1 - rise);
      jesus.set({ x: 800, y: GY - 64, s: 0.9, armF: 30 + es(t, 0.05, 0.3) * 30 * (1 - heavy) + rise * 40, armB: bump(t, 1.05, 2.6) * 30 + rise * 60, head: -4 + heavy * 8 + Math.sin(T * 0.6), blink: blinkAt(T) });
      DIS.forEach((d) => {
        const [x, y, s, flip] = d.at;
        d.p.set({ x, y, s, flip, head: -10 + heavy * 18 - rise * 8, armF: 20 + rise * 30 + heavy * (d.i % 2 ? 60 : 0), armB: rise * (d.i % 3 === 0 ? 80 : 0), blink: blinkAt(T, d.seed) });
      });

      S.cam.y = -30 - es(t, -0.3, 0.4) * 30 + es(t, 4.6, 5) * 10;
      S.cam.z = 1 + es(t, -0.3, 0.4) * 0.05;
      void frameEl;
    };
  },
};
