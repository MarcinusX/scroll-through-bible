// Mk 7,24–26 — beyond Galilee for the first time: the coast of Tyre, a different light, purple
// dye-cloths drying in the street, the island city out at sea. Jesus goes into a house and shuts
// the door, but its light cannot be hidden; the news runs from mouth to mouth to a mother whose
// little daughter lies ill under a dark spirit. She comes and falls at his feet — a Greek,
// a Syrophoenician — and begs him for her daughter.
import { C, person, CAST, blinkAt, pose, lerp, clamp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, cypress, bush, grass, rock } from '../../assets/nature.js';
import { bird, boat, bed } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, hand, headAt, townsfolk, woman, LOOK, PURPLE, MUREX, SEA, DARK, murex, nameTag, speech, thought, GLYPH, hang2 } from './lib.js';

const PI = Math.PI;
const PAR = 0.6;
const ST = 690;                                  // the street
const HJ = { x0: 640, x1: 1060, top: 430 };      // the house Jesus goes into
const DOORX = 716;
const HW = { x0: -20, x1: 320, top: 440 };       // the woman's house
const camFor = (x) => (x - 800) / PAR;

export default {
  id: 'm7-tyre',
  beats: [
    { v: 24, text: 'Wybrał się stamtąd i udał się w okolice Tyru i Sydonu.' },
    { v: 24, cont: true, text: 'Wstąpił do pewnego domu i chciał, żeby nikt o tym nie wiedział,' },
    { v: 24, cont: true, text: 'lecz nie mógł pozostać w ukryciu.' },
    { v: 25, text: 'Wnet bowiem usłyszała o Nim kobieta, której córeczka była opętana przez ducha nieczystego.' },
    { v: 25, cont: true, text: 'Przyszła, upadła Mu do nóg,' },
    { v: 26, text: 'a była to poganka, Syrofenicjanka rodem,' },
    { v: 26, cont: true, text: 'i prosiła Go, żeby złego ducha wyrzucił z jej córki.' },
  ],
  cam: { x: [camFor(120), 40], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SKY = ['#c4bfdc', '#efd8c9', '#f6e4d0'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44, { disc: C.apricot, inner: '#f4cfa4', rays: C.dusk }), { x: 560, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170, C.blushVeil, '#e6c7c2'), { x: 980, y: 150, len: 700 });
    const gulls = flock(S, hangL, 5, (cc) => bird(cc, { color: C.cream, belly: C.stone }), { y: 230, speed: 44, scale: 0.45 });

    /* ---------- the mountains of Lebanon, the sea, the island city of Tyre ---------- */
    const mts = S.layer({ par: 0.06, sh: 2 });
    const m1 = band(c, { y: 360, amps: [60, 22, 6], lens: [900, 330, 120], color: mix(C.lavender, C.hillFar, 0.4) });
    mts.add(m1.markup);
    let snow = '';
    for (let x = -600; x < 2200; x += 300) { const y = m1.fn(x); if (y < 330) snow += c.cut([[x - 26, y + 18], [x, y - 2], [x + 26, y + 18], [x + 10, y + 12], [x, y + 20], [x - 10, y + 12]], 0.6, 5); }
    mts.add(sheet().p(snow, C.cream).out());
    const sea = S.layer({ par: 0.12, sh: 1 });
    sea.add(sheet().p(c.ridge(c.wave(430, [3, 1], [200, 70]), -900, 2500, 1200, 10, 0.6), SEA).x((() => { let f = ''; for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = c.rr(446, 520), w = c.rr(20, 60); f += c.cut([[x, y], [x + w / 2, y - 2], [x + w, y], [x + w / 2, y + 1]], 0.2, 8); } return f; })(), C.foam, 'opacity=".6"').out());
    sea.add(`<g transform="translate(1180 452)">${islandCity(c)}</g>`);
    const ships = [0, 1].map((i) => ({ i, el: sea.add(`<g transform="scale(${0.3 - i * 0.06})">${ship(c)}</g>`), x: [880, 1420][i], y: [470, 458][i] }));

    /* ---------- the coast road, cypresses, a signpost ---------- */
    const coast = S.layer({ par: 0.3, sh: 3 });
    const cfn = c.wave(560, [8, 3], [700, 200]);
    coast.add(sheet().p(c.ridge(cfn, -2200, 2800, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out());
    let trees = '';
    [-1500, -1180, -900, -420, 180, 420, 1320, 1600, 2100].forEach((x, i) => { trees += cypress(c, x, cfn(x) + 8, 110 + (i % 3) * 30, i % 2 ? C.moss2 : C.moss); });
    coast.add(trees);
    coast.add(grass(c, { x0: -2000, x1: 2600, y: 560, fn: cfn, n: 50, h: 12, color: C.olive }));

    /* ---------- the street: the two houses, dye-cloths drying between them ---------- */
    const street = S.layer({ par: PAR, sh: 3 });
    const sfn = c.wave(ST - 50, [3, 1.5], [700, 180]);
    street.add(sheet().p(c.ridge(sfn, -2200, 2800, 1700, 12, 1), mix(C.sand, C.sand2, 0.4)).out());
    // dye vats and a line of purple cloths
    street.add(dyeLine(c, 360, 610, 200) + dyeLine(c, 1110, 1330, 180));
    street.add(`<g transform="translate(470 ${ST - 30})">${vat(c)}</g><g transform="translate(540 ${ST - 26})">${vat(c, 0.8)}</g><g transform="translate(1220 ${ST - 30})">${vat(c)}</g>`);
    // the woman's house: always open to us, her daughter in bed
    street.add(houseBack(c, HW, { tex: C.dustyBlue }));
    street.add(`<g transform="translate(110 ${ST - 18}) scale(.72)">${bed(c, 220)}</g>`);
    const girl = street.add(`<g transform="translate(150 ${ST - 60}) rotate(-90) scale(.5)">${person(c, { ...LOOK.girl, eyes: 'closed' })}</g>`);
    street.add(`<g transform="translate(110 ${ST - 18}) scale(.72)">${blanketOver(c)}</g>`);
    const spirit = street.add(`<g>${spiritCloud(c)}</g>`);
    // Jesus' house: inside
    street.add(houseBack(c, HJ, { tex: PURPLE }));
    const jSit = S.puppet(street.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const inPeter = S.puppet(street.add(person(c, CAST.peter)));
    const inJohn = S.puppet(street.add(person(c, CAST.john)));
    const stoolM = sheet().p(c.cut(c.rect(-30, -34, 60, 8), 0.3, 5), C.wood).p(c.cut(c.rect(-24, -26, 6, 26), 0.2, 3) + c.cut(c.rect(18, -26, 6, 26), 0.2, 3), C.wood2).out();
    // the stool is drawn in place under Jesus (a pose() of a never-moving cut-out is undone by the engine's dry run,
    // which left it at (0, 0): on a phone in the sky, on a desktop out of sight, so He sat on nothing)
    street.add(`<g><g transform="translate(904 ${ST})">${stoolM}</g></g>`);

    /* ---------- house fronts ---------- */
    const fronts = S.layer({ par: PAR, sh: 5 });
    fronts.add(houseFrame(c, HW, { open: true }));
    fronts.add(houseFrame(c, HJ, { open: false }));
    const flap = fronts.add(`<g>${frontFlap(c, HJ)}</g>`);
    const doorEl = fronts.add(`<g>${sheet().p(c.cut(c.rect(0, 0, 56, 104), 0.4, 5), C.wood2).x(c.ribbon([[14, 6], [14, 100]], 1.4) + c.ribbon([[28, 6], [28, 100]], 1.4) + c.ribbon([[42, 6], [42, 100]], 1.4), shade(C.wood2, -0.25), 'opacity=".6"').p(c.cut(c.circ(46, 52, 3, 6), 0.1, 2), C.sun).out()}</g>`);
    const shutter = fronts.add(`<g>${sheet().p(c.cut(c.rect(0, 0, 60, 50), 0.4, 5), C.wood).x(c.ribbon([[30, 2], [30, 48]], 2), C.wood2).out()}</g>`);
    const leak = fronts.add(`<g><ellipse cx="0" cy="0" rx="260" ry="170" fill="url(#warm-glow)"/></g>`);
    const leakRays = fronts.add(`<g>${raysFrom(c)}</g>`);
    fronts.add(`<g transform="translate(-140 ${ST})">${signpost(c, tr('Tyr · Sydon', 'Tyre · Sidon'))}</g>`);

    /* ---------- people in the street ---------- */
    const ppl = S.layer({ par: PAR, sh: 5 });
    const walkers = [
      { o: CAST.john, off: -210 }, { o: CAST.james, off: -160 }, { o: CAST.andrew, off: -110 }, { o: CAST.peter, off: -58 },
    ].map((w, i) => ({ ...w, i, seed: c.rr(0, 9), p: S.puppet(ppl.add(person(c, w.o))) }));
    const jWalk = S.puppet(ppl.add(person(c, CAST.jesus)));
    const NB = [
      { x: 590, flip: false, o: townsfolk(c, { hairStyle: 'veil', veil: C.blushVeil, robe: MUREX, beard: 'none' }) },
      { x: 1110, flip: true, o: townsfolk(c, { man: true, robe: C.tealRobe, hairStyle: 'curly' }) },
      { x: 1178, flip: true, o: townsfolk(c, { man: true, robe: C.ochreRobe, mantle: PURPLE }) },
      { x: 420, flip: true, o: townsfolk(c, { hairStyle: 'veil', veil: C.skyVeil, robe: C.roseRobe, beard: 'none' }) },
    ].map((n, i) => ({ ...n, i, seed: c.rr(0, 9), p: S.puppet(ppl.add(person(c, n.o))) }));
    // phone: the two neighbours on the right stand inside the frame (and slip away while the camera is with the mother)
    if (P) { NB[1].x = 1000; NB[2].x = 1046; }
    const wSit = S.puppet(ppl.add(woman(c, { pose: 'sit' })));
    const wStand = S.puppet(ppl.add(woman(c)));
    const wKneel = S.puppet(ppl.add(woman(c, { pose: 'kneel' })));

    /* ---------- whispers, the tag, her plea ---------- */
    const fx = S.layer({ par: PAR, sh: 6 });
    const whispers = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${speech(c, `<g transform="translate(0 -2)">${dots(c)}</g>`, { w: 44, h: 32, flip: i % 2 === 0 })}</g>`) }));
    const tagEl = hanging(fx, `<g>${nameTag(c, tr(['poganka,', 'Syrofenicjanka'], ['a Greek,', 'a Syrophoenician']), { size: 18 })}</g><g transform="translate(0 94)">${murex(c, 22)}</g>`, { x: 690, y: 236, len: 700 });
    const plea = fx.add(`<g>${thought(c, `<g transform="translate(-26 10) scale(.36)">${bed(c, 150)}</g><g transform="translate(-14 -8) rotate(-90) scale(.22)">${person(c, { ...LOOK.girl, eyes: 'closed' })}</g><g transform="translate(-20 -30) scale(.5)">${spiritCloud(c)}</g>`, { w: 110, h: 84 })}</g>`);
    const heartK = fx.add(`<g>${sheet().p(c.cut(c.star(0, 0, 10, 4, 4, 0), 0.2, 3), C.halo).out()}</g>`);

    const fg = S.layer({ par: 0.92, sh: 6 });
    fg.add(bush(c, -760, 880, 220, C.sage, C.moss) + bush(c, 1380, 880, 220, C.moss, C.sage) + rock(c, 360, 900, 170, 60, C.rock2));

    return (t, time) => {
      const T = time;
      swing(sunEl, 560, 170 + es(t, 0, 6) * 30, T, 1, 0.6);
      swing(cl1, 980 + Math.sin(T * 0.1) * 30, 150, T, 1.3, 0.7, 1);
      gulls(T, 1);
      sk.blend(SKY, ['#b8b0d6', '#ecc9bd', '#f3dcc6'], seg(t, 0, 7));
      ships.forEach((s) => pose(s.el, { x: s.x + Math.sin(T * 0.05 + s.i) * 40 + t * 12, y: s.y + Math.sin(T * 1.1 + s.i) * 2, r: Math.sin(T * 1.2 + s.i) * 2 }));

      /* v24a — along the coast road into the region of Tyre */
      const jx = kf(t, [[0.0, -330], [0.95, DOORX - 10], [1.18, DOORX + 20]], (u) => u);
      const inside = es(t, 1.12, 1.24);
      jWalk.set({ x: jx, y: ST, s: 0.9, o: 1 - inside, walk: t < 1.18 ? jx * 0.05 : undefined, armF: bump(t, 0.25, 0.55) * 30, blink: blinkAt(T) });
      walkers.forEach((w) => {
        const x = Math.min(jx + w.off, DOORX + 10);
        const gone = es(t, 1.2 + w.i * 0.06, 1.3 + w.i * 0.06);
        w.p.set({ x, y: ST - 2, s: 0.86, o: 1 - gone, walk: t < 1.3 + w.i * 0.06 ? x * 0.05 + w.i : undefined, blink: blinkAt(T, w.seed) });
      });

      /* v24b — in, the door shut, the shutter drawn */
      const shut = es(t, 1.3, 1.55);
      pose(doorEl, { x: DOORX - 28, y: ST - 104, sx: 0.08 + shut * 0.92, o: 1 });
      pose(shutter, { x: 920, y: 540, sy: 0.05 + es(t, 1.45, 1.7) * 0.95, o: 1 });

      /* v24c — the light won't stay inside; the neighbours notice */
      const glow = es(t, 2.0, 2.4);
      const open = es(t, 4.4, 4.7);
      pose(leak, { x: (HJ.x0 + HJ.x1) / 2, y: 560, s: 0.8 + glow * 0.3 + Math.sin(T * 2) * 0.02, o: glow * (1 - open * 0.6) });
      pose(leakRays, { x: (HJ.x0 + HJ.x1) / 2, y: HJ.top + 10, s: 0.9 + glow * 0.2, r: Math.sin(T * 0.3) * 3, o: glow * 0.7 * (1 - open) });
      NB.forEach((n) => {
        const come = es(t, 2.05 + n.i * 0.08, 2.4 + n.i * 0.08);
        const peek = bump(t, 2.3 + n.i * 0.1, 3.0) * 1;
        const gone = P && (n.i === 1 || n.i === 2) ? es(t, 3.3, 3.45) : 0;
        n.p.set({ x: n.x + (n.flip ? -1 : 1) * come * 18, y: ST + 4, s: 0.84, flip: n.flip, o: 1 - gone, armF: peek * 60 + (n.i === 0 ? bump(t, 2.5, 3.1) * 50 : 0), armB: n.i === 1 ? peek * 150 : 0, head: -peek * 6, lean: (n.flip ? -1 : 1) * peek * 4, blink: blinkAt(T, n.seed) });
      });
      // whispers pass from mouth to mouth, then away to the woman's window
      const chain = P ? [[1030, 470], [980, 460], [620, 470], [440, 470], [270, 520]] : [[1150, 470], [1090, 460], [620, 470], [440, 470], [270, 520]];
      whispers.forEach((w) => {
        const t0 = 2.35 + w.i * 0.22 - (w.i > 2 ? 0.1 : 0);
        const k = es(t, t0, t0 + 0.2, ease.back) * (1 - es(t, t0 + 0.45, t0 + 0.6));
        const p = chain[w.i];
        pose(w.el, { x: p[0], y: p[1] - k * 10, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* v25a — the mother, at her daughter's bed, hears */
      const hears = es(t, 3.25, 3.45);
      const up = es(t, 3.6, 3.68);
      wSit.set({ x: 214, y: ST - 8, s: 0.86, flip: true, o: 1 - up, armF: 60 + (1 - hears) * 10, head: hears * -14 + (1 - hears) * 12, blink: blinkAt(T, 3) });
      pose(spirit, { x: 110, y: ST - 130 + Math.sin(T * 1.4) * 4, r: Math.sin(T * 0.9) * 4, s: 1 + Math.sin(T * 1.8) * 0.04 });

      /* v25b — she comes and falls at his feet */
      const wx = kf(t, [[3.62, 230], [3.72, 250], [4.4, 756]], (u) => u);
      const kneel = es(t, 4.55, 4.62);
      wStand.set({ x: wx, y: ST, s: 0.88, o: up * (1 - kneel), walk: t > 3.7 && t < 4.4 ? wx * 0.06 : undefined, armF: 20 + bump(t, 4.3, 4.6) * 70, lean: bump(t, 4.35, 4.6) * 12, blink: blinkAt(T, 3) });
      const beg = es(t, 6.0, 6.25);
      wKneel.set({ x: 776, y: ST + 2, s: 0.88, o: kneel, armF: 60 + beg * 50 + Math.sin(T * 2) * 4 * beg, armB: 30 + beg * 60, head: -8 - beg * 10, lean: 12 - beg * 8, blink: blinkAt(T, 3) });
      // the front of the house folds open to show them inside
      pose(flap, { x: HJ.x0, y: 0, sx: 1 - open * 0.92, o: 1 - open * 0.2 });
      pose(doorEl, { x: DOORX - 28, y: ST - 104, sx: (0.08 + shut * 0.92) * (1 - open), o: 1 - open });
      pose(shutter, { x: 920, y: 540, sy: (0.05 + es(t, 1.45, 1.7) * 0.95) * (1 - open), o: 1 - open });
      const look = es(t, 4.6, 4.9);
      jSit.set({ x: 904, y: ST - 30, s: 0.94, flip: true, armF: 20 + look * 30 + es(t, 6.2, 6.5) * 20, armB: 10, head: look * 12, blink: blinkAt(T, 1) });
      inPeter.set({ x: 990, y: ST - 34, s: 0.8, flip: true, head: bump(t, 5.05, 5.9) * -8, armF: bump(t, 5.05, 5.9) * 30, blink: blinkAt(T, 4) });
      inJohn.set({ x: 1036, y: ST - 38, s: 0.78, flip: true, head: bump(t, 5.1, 5.9) * 10, blink: blinkAt(T, 7) });

      /* v26a — a Greek, a Syrophoenician: her tag with a murex shell (the purple of Tyre) */
      const tK = es(t, 5.0, 5.35, ease.back) * (1 - es(t, 6.0, 6.3));
      swing(tagEl, 690, 236 - (1 - tK) * 1150, T, 1.4, 0.8, 2);

      /* v26b — she begs for her daughter */
      const pK = es(t, 6.05, 6.3, ease.back);
      const [hx, hy] = headAt(776, ST + 2, 0.88, false, 46);
      pose(plea, { x: hx - 8, y: hy - 30, s: pK, o: pK > 0.02 ? 1 : 0 });
      const cK = es(t, 6.35, 6.55, ease.back);
      pose(heartK, { x: 904 - 30, y: ST - 160, s: cK * (1 + Math.sin(T * 3) * 0.1), r: T * 30, o: cK > 0.02 ? 0.9 : 0 });

      /* camera: follow the road, then between the two houses */
      const follow = clamp((jx - 800) / PAR, camFor(120), 0);
      const toMother = es(t, 3.0, 3.4) * (1 - es(t, 3.75, 4.4));
      S.cam.x = t < 1.2 ? follow : lerp(0, camFor(160), toMother);
      S.cam.y = es(t, 1.0, 1.6) * 20 + es(t, 4.5, 5.0) * 30;
      S.cam.z = 1 + es(t, 1.0, 1.6) * 0.04 + es(t, 4.5, 5.0) * 0.08;
    };
  },
};

/* ---------- local cut-outs ---------- */
function islandCity(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 6, 190, 18, 16, 0.08), 0.8, 8), C.sand2);
  s.p(c.cut([[-170, 4], [-170, -46], [170, -46], [170, 4]], 0.6, 8), C.stone);
  let tw = '';
  for (let x = -170; x <= 170; x += 68) tw += c.cut(c.rect(x - 12, -70, 24, 74), 0.4, 5);
  s.p(tw, C.stone2);
  let cr = '';
  for (let x = -168; x < 170; x += 12) cr += c.poly(c.rect(x, -52, 6, 6));
  s.p(cr, C.stone);
  s.p(c.cut(c.rect(-60, -100, 90, 54), 0.4, 5) + c.cut(c.rect(50, -90, 60, 44), 0.4, 5), C.plaster);
  s.p(c.cut([[-66, -100], [36, -100], [-15, -128]], 0.4, 5), C.ochre);
  let fl = '';
  [-170, -102, -34, 34, 102, 170].forEach((x) => { fl += c.ribbon([[x, -70], [x, -90]], 1.6); fl += c.cut([[x, -90], [x + 16, -86], [x, -80]], 0.2, 3); });
  s.x(fl, MUREX);
  return s.out();
}
function ship(c) {
  const s = sheet();
  s.p(c.cut([[-120, -20], [120, -20], [90, 20], [-96, 20]], 0.6, 8), C.wood);
  s.p(c.ribbon([[-110, -12], [110, -12]], 6), C.terracotta);
  s.p(c.cut(c.rect(-4, -200, 8, 180), 0.3, 6), C.wood2);
  s.p(c.cut([[-80, -190], [80, -190], [70, -60], [-70, -60]], 0.8, 8), MUREX);
  s.x(c.ribbon([[-76, -150], [76, -150]], 8) + c.ribbon([[-72, -100], [72, -100]], 8), shade(MUREX, 0.25), 'opacity=".6"');
  return s.out();
}
function dyeLine(c, x0, x1, top) {
  const s = sheet();
  s.p(c.cut(c.rect(x0 - 4, top, 8, ST - top), 0.3, 6) + c.cut(c.rect(x1 - 4, top, 8, ST - top), 0.3, 6), C.wood2);
  const line = c.qbez([x0, top + 6], [(x0 + x1) / 2, top + 26], [x1, top + 6], 16);
  s.x(c.ribbon(line, 1.6), C.rope);
  const cols = [PURPLE, MUREX, shade(PURPLE, 0.2), mix(MUREX, C.cream, 0.3)];
  const n = Math.floor((x1 - x0 - 30) / 44);
  for (let i = 0; i < n; i++) {
    const u = (i + 0.7) / (n + 0.4), px = x0 + (x1 - x0) * u, py = top + 6 + Math.sin(u * PI) * 20;
    const h = c.rr(70, 110), w = c.rr(28, 38);
    const pts = [[px - w / 2, py], [px + w / 2, py], [px + w / 2 + 2, py + h]];
    for (let x = px + w / 2; x > px - w / 2; x -= 8) pts.push([x - 4, py + h + (x % 16 ? 5 : 0)]);
    s.p(c.cut(pts, 0.6, 6), cols[i % cols.length]);
  }
  return s.out();
}
function vat(c, sc = 1) {
  const s = sheet();
  s.p(c.cut([[-34 * sc, -40 * sc], [34 * sc, -40 * sc], [30 * sc, 30], [-30 * sc, 30]], 0.5, 5), C.stone2);
  s.p(c.cut(c.ell(0, -40 * sc, 34 * sc, 7 * sc, 16), 0.3, 4), PURPLE);
  s.x(c.ribbon([[-33 * sc, -24 * sc], [33 * sc, -24 * sc]], 3), shade(C.stone2, -0.2), 'opacity=".6"');
  return s.out();
}
function houseBack(c, H, { tex = PURPLE } = {}) {
  const s = sheet();
  s.p(c.cut([[H.x0 + 10, ST], [H.x0 + 10, H.top], [H.x1 - 10, H.top], [H.x1 - 10, ST]], 0.6, 10), mix(C.plaster2, C.sand2, 0.35));
  // a hanging textile and a shelf
  const cx = (H.x0 + H.x1) / 2;
  s.p(c.cut([[cx - 70, H.top + 40], [cx + 70, H.top + 40], [cx + 64, H.top + 150], [cx - 64, H.top + 150]], 0.6, 8), tex);
  let st = '';
  for (let x = cx - 56; x < cx + 60; x += 22) st += c.cut(c.star(x, H.top + 96, 6, 2.6, 4, 0), 0.2, 3);
  s.x(st, C.cream, 'opacity=".7"');
  s.p(c.ribbon([[cx - 80, H.top + 38], [cx + 80, H.top + 38]], 5), C.wood2);
  s.p(c.cut(c.rect(H.x0 + 10, ST - 8, H.x1 - H.x0 - 20, 10), 0.4, 8), mix(C.clay, C.sand2, 0.5));
  return s.out();
}
function houseFrame(c, H, { open }) {
  const s = sheet();
  s.p(c.cut(c.rect(H.x0, H.top - 6, 18, ST - H.top + 8), 0.4, 8) + c.cut(c.rect(H.x1 - 18, H.top - 6, 18, ST - H.top + 8), 0.4, 8), C.plaster);
  s.p(c.cut([[H.x0 - 16, H.top], [H.x1 + 16, H.top], [H.x1 + 16, H.top - 18], [H.x0 - 16, H.top - 18]], 0.5, 8), C.roof);
  let ends = '';
  for (let x = H.x0 + 10; x < H.x1; x += 44) ends += c.cut(c.circ(x, H.top - 9, 5, 8), 0.2, 3);
  s.p(ends, C.wood2);
  // a striped purple awning over the front
  const aw = [[H.x0 + 20, H.top], [H.x1 - 20, H.top], [H.x1 - 10, H.top + 30]];
  for (let x = H.x1 - 10; x > H.x0 + 10; x -= 30) aw.push(...c.arc(x - 15, H.top + 30, 15, 9, 0, PI, 5));
  s.p(c.cut(aw, 0.5, 7), C.cream);
  let stripes = '';
  for (let x = H.x0 + 26; x < H.x1 - 20; x += 60) stripes += c.cut([[x, H.top + 1], [x + 28, H.top + 1], [x + 30, H.top + 36], [x + 2, H.top + 36]], 0.3, 5);
  s.x(stripes, MUREX, 'opacity=".85"');
  if (open) s.p(c.cut(c.rect(H.x0 - 10, ST - 2, H.x1 - H.x0 + 20, 12), 0.4, 8), C.stone2);
  return s.out();
}
/** the front wall of Jesus' house, drawn from its left edge (x = 0) so it can fold open */
function frontFlap(c, H) {
  const s = sheet();
  const w = H.x1 - H.x0;
  const door = [[DOORX - H.x0 - 30, ST + 2], [DOORX - H.x0 - 30, ST - 104], [DOORX - H.x0 + 30, ST - 104], [DOORX - H.x0 + 30, ST + 2]];
  const win = c.rect(920 - H.x0, 540, 60, 50);
  s.p(c.cut([[0, H.top + 30], [w, H.top + 30], [w, ST + 4], [0, ST + 4]], 0.8, 10) + c.hole(door, 0.3, 6) + c.hole(win, 0.3, 5), C.plaster);
  let spots = '';
  for (let i = 0; i < 8; i++) spots += c.cut(c.blob(c.rr(20, w - 20), c.rr(H.top + 60, ST - 30), c.rr(10, 24), c.rr(5, 10), 8, 0.2), 0.5, 4);
  s.x(spots, C.plaster2, 'opacity=".6"');
  s.p(c.ribbon([[DOORX - H.x0 - 34, ST + 2], [DOORX - H.x0 - 34, ST - 106], [DOORX - H.x0 + 34, ST - 106], [DOORX - H.x0 + 34, ST + 2]], 6), C.wood2);
  s.p(c.ribbon([[914 - H.x0, 594], [986 - H.x0, 594]], 6), C.wood2);
  // a small pot of flowers by the door
  s.p(c.cut([[DOORX - H.x0 + 60, ST + 2], [DOORX - H.x0 + 56, ST - 20], [DOORX - H.x0 + 84, ST - 20], [DOORX - H.x0 + 80, ST + 2]], 0.3, 4), C.pot);
  s.p(c.cut(c.blob(DOORX - H.x0 + 70, ST - 30, 20, 12, 9, 0.2), 0.4, 4), C.leaf);
  return `<g transform="translate(0 0)">${s.out()}</g>`;
}
function blanketOver(c) {
  const s = sheet();
  const pts = [[-40, -60], [0, -64], [70, -64], [104, -52], [106, -34], [-40, -34]];
  s.p(c.cut(pts, 0.5, 6), MUREX);
  let st = '';
  for (let x = -30; x < 100; x += 22) st += c.cut(c.star(x, -48, 5, 2.2, 4, 0), 0.2, 3);
  s.x(st, C.cream, 'opacity=".7"');
  return s.out();
}
/** the unclean spirit: a small grey-violet storm of paper over the child (no face, no horror) */
function spiritCloud(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(-18, 0, 20, 16, PI, 2 * PI, 8), ...c.arc(6, -8, 24, 22, PI, 2 * PI, 9), ...c.arc(30, 2, 16, 14, PI * 1.1, 2 * PI, 6), [44, 12], [-36, 12]], 0.8, 5), mix(DARK, C.lavender, 0.25));
  s.x(c.ribbon(c.cbez([-20, 12], [-30, 26], [-6, 30], [-18, 46], 10), (u) => 4 - u * 3), mix(DARK, C.lavender, 0.3), 'opacity=".8"');
  s.x(c.ribbon(c.cbez([18, 12], [30, 28], [8, 34], [22, 50], 10), (u) => 4 - u * 3), mix(DARK, C.lavender, 0.3), 'opacity=".8"');
  return s.out();
}
function raysFrom(c) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = -PI * (0.15 + i * 0.0875), w = 0.06; d += c.poly([[0, 0], [Math.cos(a - w) * 260, Math.sin(a - w) * 260], [Math.cos(a + w) * 260, Math.sin(a + w) * 260]]); }
  return `<path d="${d}" fill="#fff1c4" opacity=".6"/>`;
}
function dots(c) {
  return sheet().x(c.poly(c.circ(-10, 0, 3, 8)) + c.poly(c.circ(0, 0, 3, 8)) + c.poly(c.circ(10, 0, 3, 8)), C.terracotta).out();
}
function signpost(c, text) {
  const size = 18, w = size * (0.56 * text.length + 1.6), h = size * 1.5;
  const s = sheet();
  s.p(c.cut(c.rect(-4, -110, 8, 112), 0.3, 6), C.wood2);
  s.p(c.cut([[-w / 2, -104], [w / 2, -104], [w / 2 + 14, -104 + h / 2], [w / 2, -104 + h], [-w / 2, -104 + h]], 0.4, 6), C.wood3);
  return s.out() + `<text x="4" y="${(-104 + h * 0.5 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
