// Mt 8,16–17 — sunset over Capernaum at Peter's door: the sun sinks on its string, lamps are lit, and the sick are
// brought from both sides — a lame man on a crutch, a blind man led by a boy, a paralysed man carried on a mat — and
// two men hunched under torn dark shadows. Jesus speaks one word: a golden slip flies out, the shadows tear away and
// flee, light bursts over each of the sick and they stand healed. Then Isaiah's scroll comes down and unrolls — "He
// took our infirmities and bore our diseases" — and the grey flakes of all that sickness drift over to Jesus and settle
// on His shoulders as a grey bundle, which He carries.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, moon, stars, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { POSSESSED, shadowShards, crutch, handLamp, headAt, voiceRings, sparkle, goldSlip, rayBurst, pose3, folk4, mob, addScroll, setScroll, hangAt, tr, PI } from './lib.js';
import { houseFacade } from '../mark1/lib.js';
import { sickOnMat } from '../mark6/lib.js';
import { blindBand } from '../john5/lib.js';
import { rolledMat } from '../mark2/lib.js';

const DOOR = 800, JY = 716;

/** a grey bundle of sickness carried on the shoulders (origin: the shoulder point of a standing puppet) */
function bundle(c) {
  const s = sheet();
  s.p(c.cut(c.blob(-14, -8, 34, 24, 14, 0.14), 0.8, 5), mix(C.storm, C.stone2, 0.45));
  s.p(c.cut(c.blob(4, -20, 22, 16, 12, 0.14), 0.6, 5), mix(C.storm2, C.stone2, 0.4));
  s.x(c.ribbon([[-40, 6], [-4, -26], [24, -8]], 3) + c.ribbon([[-30, -24], [10, 12]], 2.4), mix(C.rope, C.stone2, 0.4));
  return s.out();
}

export default {
  id: 'mt8-evening',
  beats: [
    { v: 16, text: 'Z nastaniem wieczora przyprowadzono Mu wielu opętanych.' },
    { v: 16, cont: true, text: 'On słowem wypędził złe duchy i wszystkich chorych uzdrowił.' },
    { v: 17, text: 'Tak oto spełniło się słowo proroka Izajasza:' },
    { v: 17, cont: true, text: 'On wziął na siebie nasze słabości i nosił nasze choroby.' },
  ],
  cam: { x: [-20, 20], y: [-40, 70], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#8f86ad', '#e3a58e', '#f3c79e']);
    const night = sky(S, [C.night2, '#39407a', '#6a5f8e'], { name: 'night' }).layer;
    night.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 1230, y: 260, len: 900 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 32)}`, { x: 420, y: -200, len: 900 });

    /* ---------- the lake, the town, Peter's house ---------- */
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 470, amps: [12, 6, 2], lens: [1000, 330, 120], color: '#b9a7b4' }).markup + waterBand(c, { y: 505, color: '#9fb7bf', foamN: 10 }).markup);
    const townR = makeCutter('mt8-ev-town');
    const houses = (lit) => [[140, 560, 60, 44], [230, 566, 70, 50], [1330, 562, 66, 46], [1430, 568, 58, 40], [1520, 560, 70, 50]].map(([x, y, w, h], i) => house(makeCutter('mt8-evh' + i), x, y, w, h, { lit: lit && i % 2 === 0 })).join('');
    S.layer({ par: 0.2, sh: 3 }).add(houses(false));
    const townLit = S.layer({ par: 0.2, sh: 3 });
    townLit.add(houses(true));
    townLit.fade(0);
    const H = S.layer({ par: 0.3, sh: 4 });
    H.add(`<g transform="translate(${DOOR - 950} 0)">${houseFacade(S, { withSky: false })}</g>`);
    const doorLit = H.add(`<g opacity="0"><ellipse cx="${DOOR}" cy="600" rx="130" ry="150" fill="url(#warm-glow)"/><path d="${c.poly([[DOOR - 48, 660], [DOOR - 48, 500], ...c.arc(DOOR, 500, 48, 42, PI, 2 * PI, 10), [DOOR + 48, 660]])}" fill="#f7d58e"/></g>`);
    const dusk = S.layer({ par: 0.3, sh: 1, flat: true });
    dusk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2c2a55"/>`);
    dusk.fade(0);

    /* ---------- the crowd at the back (sprites), with lamps ---------- */
    const pc = makeCutter('mt8-ev-people');
    const backL = S.layer({ par: 0.4, sh: 4 });
    const backs = [{ x0: -400, x1: 470, m: mob(makeCutter('mt8-ev-b0'), 5, { s: 0.7, spread: 40, rows: 1 }) }, { x0: 2000, x1: 1150, m: mob(makeCutter('mt8-ev-b1'), 5, { s: 0.7, spread: 40, rows: 1, flip: true }) }].map((b) => ({ ...b, sp: backL.sprite(b.m, b.x1, 690) }));
    const lamps = [[400, 0], [520, 0], [1100, 1], [1210, 1]].map(([x, i]) => ({ x, i, el: backL.add(`<g opacity="0">${handLamp(c)}</g>`) }));

    /* ---------- the sick (sprites: sick → healed) ---------- */
    const GL = S.layer({ par: 0.45, sh: 4 });
    const LAME = folk4(pc, true, { robe: C.stone2, mantle: null, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair });
    const WIFE = folk4(pc, false, { robe: C.roseRobe, veil: C.linen2 });
    const g1 = (well) => pose3(pc, [
      { x: 0, y: 0, s: 0.94, head: well ? -10 : 8, armF: well ? 60 : 40, armB: well ? 150 : 10, o: well ? { ...LAME, holdB: `<g transform="translate(0 -4)">${crutch(c)}</g>` } : { ...LAME, holdF: `<g transform="translate(0 -4) rotate(-6)">${crutch(c)}</g>` } },
      { x: -70, y: -6, s: 0.9, head: well ? -8 : 4, armF: well ? 80 : 70, armB: well ? 120 : 20, o: WIFE },
    ]);
    const BLIND = folk4(pc, true, { robe: C.mauve, hairStyle: 'wrap', veil: C.stone, beard: 'short' });
    const BOY = { robe: C.skyVeil, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2 };
    const g2 = (well) => {
      const m = pose3(pc, [
        { x: 0, y: 0, s: 0.94, flip: true, head: well ? -12 : 6, armF: well ? 50 : 60, armB: well ? 140 : 0, o: well ? BLIND : { ...BLIND, eyes: 'closed' } },
        { x: -64, y: 8, s: 0.6, flip: true, head: -6, armF: well ? 120 : 70, armB: well ? 150 : 20, o: BOY },
      ]);
      return well ? m : m.replace('</g></g><g class="armF"', `${blindBand(c)}</g></g><g class="armF"`);
    };
    const CAR = [folk4(pc, true, { robe: C.ochreRobe }), folk4(pc, true, { robe: C.sageRobe })];
    const PARA = { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3 };
    const g3 = (well) => (well
      ? pose3(pc, [{ x: -110, y: 0, s: 0.9, head: -6, armF: 60, armB: 100, o: CAR[0] }, { x: 110, y: 4, s: 0.9, flip: true, head: -6, armF: 60, armB: 110, o: CAR[1] }, { x: 0, y: 10, s: 0.94, head: -12, armF: 150, armB: 160, o: { ...PARA, holdB: `<g transform="translate(0 -10) rotate(80)">${rolledMat(c, 110)}</g>` } }])
      : pose3(pc, [{ x: -110, y: 0, s: 0.9, armF: 70, armB: 50, o: CAR[0] }, { x: 110, y: 4, s: 0.9, flip: true, armF: 70, armB: 50, o: CAR[1] }]) + `<g transform="translate(0 -84)">${sickOnMat(c, PARA, 200)}</g>`);
    const GX = S.portrait ? [540, 1075, 1000] : [470, 1150, 1020];   // phone: the sick stand inside the screen
    const groups = [
      { x: GX[0], y: 760, from: -300, a: 0.15, h: 1.3, m: g1 },
      { x: GX[1], y: 764, from: 1900, a: 0.25, h: 1.45, m: g2 },
      { x: GX[2], y: 818, from: 1900, a: 0.4, h: 1.2, m: g3 },
    ].map((g) => ({ ...g, sick: GL.sprite(g.m(false), g.x, g.y), well: GL.sprite(g.m(true), g.x, g.y) }));

    /* ---------- the possessed, and Jesus ---------- */
    const PL = S.layer({ par: 0.45, sh: 5 });
    const poss = [{ x: 620, y: 792, flip: false, o: POSSESSED }, { x: 840, y: 808, flip: true, o: { ...POSSESSED, robe: C.clayMantle, hair: C.hair, beard: 'none' } }].map((pp, i) => ({
      ...pp, i, p: S.puppet(PL.add(person(c, pp.o))),
      shards: shadowShards(c, { n: 7, r: 62 }).map((sh) => ({ ...sh, el: PL.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.2) })),
    }));
    const load = PL.add(`<g opacity="0">${bundle(c)}</g>`);
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const talk = voiceRings(PL, c, { n: 3, color: C.sun, r: 36, w: 5 });
    const word = PL.add(`<g opacity="0">${goldSlip(c, 50)}</g>`);
    const bursts = [0, 1, 2, 3, 4].map(() => PL.add(`<g opacity="0"><circle r="80" fill="url(#halo-glow)"/>${rayBurst(c, { n: 10, r0: 20, r1: 100, spread: 0.08, o: 0.8 })}</g>`));
    // the grey flakes of the sicknesses that drift over to Him
    const flakes = Array.from({ length: 14 }, (_, i) => ({ i, g: i % 5, el: PL.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, c.rr(7, 12), c.rr(5, 9), 8, 0.3), 0.6, 3)}" fill="${i % 2 ? mix(C.storm, C.stone2, 0.45) : mix(C.storm2, C.stone2, 0.35)}"/></g>`), dx: c.rr(-40, 40), dy: c.rr(-60, 20), d: c.rr(0, 0.25) }));

    /* ---------- Isaiah's scroll ---------- */
    const scL = S.layer({ par: 0.2, sh: 6 });
    const scroll = addScroll(scL, c, [tr('Izajasz 53,4', 'Isaiah 53:4'), tr('On wziął na siebie nasze słabości', 'He took our infirmities,'), tr('i nosił nasze choroby', 'and bore our diseases')], { w: 470, h: 160, size: 25 });

    return (t, time) => {
      const T = time;
      /* v16a — evening: the sun goes down, lamps are lit, the sick and the possessed are brought */
      const set = es(t, 0.0, 0.8);
      hangAt(sunEl, 1230, lerp(260, 620, set), T, 0.8, 0.5);
      const nk = es(t, 0.3, 1.2);
      night.fade(nk);
      starL.fade(es(t, 0.7, 1.4));
      dusk.fade(nk * 0.3);
      hangAt(moonEl, 420, lerp(-300, 150, es(t, 0.9, 1.6)), T, 0.8, 0.5, 1);
      townLit.fade(es(t, 0.5, 0.9));
      fade(doorLit, es(t, 0.3, 0.6));
      backs.forEach((b, i) => {
        const k = es(t, 0.1 + i * 0.08, 0.8 + i * 0.08, ease.out);
        const x = lerp(b.x0, b.x1, k);
        b.sp.set({ x, y: 690 - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.03)) * 3 : 0), o: k > 0 ? 1 : 0 });
        lamps.filter((l) => l.i === i).forEach((l) => pose(l.el, { x: x + (l.x - b.x1), y: 580, s: 0.9, o: k > 0 ? es(t, 0.5, 0.8) * (T ? 0.9 + Math.sin(T * 9 + l.x) * 0.08 : 0.9) : 0 }));
      });
      groups.forEach((g) => {
        const k = es(t, g.a, g.a + 0.55, ease.out);
        const x = lerp(g.from, g.x, k);
        const w = es(t, g.h, g.h + 0.06);
        g.sick.set({ x, y: g.y - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.035)) * 4 : 0), o: (k > 0 ? 1 : 0) * (1 - w) });
        g.well.set({ x, y: g.y, o: w });
      });

      /* Jesus comes out of the lit door; v16b — He casts out the spirits with a word */
      const out = es(t, 0.35, 0.7);
      const cast = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.05));
      const carry = es(t, 3.3, 3.7);
      jesus.set({ x: DOOR, y: lerp(664, JY, out), s: lerp(0.9, 1.0, out), o: es(t, 0.3, 0.4), walk: out > 0 && out < 1 ? out * 20 : undefined, armF: 14 + cast * 80 + bump(t, 2.1, 2.9) * 30, armB: 10 + cast * 110 + carry * 150, lean: carry * 6, head: -cast * 4 + carry * 8, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(DOOR, JY, 1.0);
      talk(jhx, jhy, cast, T, { spread: 2.2 });
      const wk = es(t, 1.08, 1.35);
      pose(word, { x: jhx + 30 + wk * 60, y: jhy - 30 - Math.sin(wk * PI) * 40, s: 0.6 + wk * 0.6, r: T ? Math.sin(T * 3) * 6 : 0, o: bump(t, 1.06, 1.5) });
      poss.forEach((pp) => {
        const k = es(t, 0.2 + pp.i * 0.12, 0.8 + pp.i * 0.12);
        const px = pp.x + (1 - k) * (pp.flip ? 900 : -900);
        const free = es(t, 1.2 + pp.i * 0.08, 1.28 + pp.i * 0.08);
        const trem = (1 - free) * (T ? Math.sin(T * 14 + pp.i) * 2 : 0);
        pp.p.set({ x: px + trem, y: pp.y, s: 0.92, flip: pp.flip, o: k > 0 ? 1 : 0, walk: k > 0 && k < 1 ? px * 0.05 : undefined, armF: 30 + free * 40, armB: 20 + free * 120 * (1 - es(t, 2.2, 2.6)), head: 10 - free * 18, blink: blinkAt(T, pp.i + 12) });
        const tear = es(t, 1.2 + pp.i * 0.08, 1.7 + pp.i * 0.08);
        const flee = es(t, 1.6, 1.95);
        pp.shards.forEach((sh) => {
          pose(sh.el, { x: px + trem + Math.cos(sh.a) * tear * 120 * sh.drift + (pp.flip ? 1 : -1) * tear * 60, y: pp.y - 100 + Math.sin(sh.a) * tear * 80 - tear * 260 - flee * 500, s: 1 - tear * 0.4, r: tear * 120 * (sh.i % 2 ? 1 : -1), o: (k > 0 ? 0.9 : 0) * (1 - flee) });
        });
      });
      const BURST = [[GX[0], 600, 1.25], [GX[1], 600, 1.4], [GX[2], 650, 1.15], [620, 640, 1.2], [840, 650, 1.3]];
      bursts.forEach((b, i) => { const k = bump(t, BURST[i][2], BURST[i][2] + 0.5); pose(b, { x: BURST[i][0], y: BURST[i][1], s: 0.4 + k * 0.9, r: T * 20, o: k * 0.9 }); });

      /* v17a — Isaiah's word comes down and unrolls */
      const sd = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 3.2, 3.45, ease.in) * 0.55);
      setScroll(scroll, 800, lerp(-400, 120, sd), es(t, 2.3, 2.7), sd > 0.01 ? 1 : 0, T ? Math.sin(T * 0.6) * 0.4 : 0);

      /* v17b — He takes our sicknesses on Himself: grey flakes drift from the people onto His shoulders */
      const from = [[GX[0], 620], [GX[1], 620], [GX[2], 660], [620, 650], [840, 660]];
      flakes.forEach((f) => {
        const k = es(t, 3.05 + f.d, 3.55 + f.d);
        const [sx, sy] = from[f.g];
        const tx = DOOR - 36, ty = JY - 136;
        pose(f.el, { x: lerp(sx + f.dx, tx, k), y: lerp(sy + f.dy, ty, k) - Math.sin(k * PI) * 80, r: k * 200, s: 1 - k * 0.4, o: t > 3.0 ? seg(t, 3.0 + f.d, 3.1 + f.d) * (1 - seg(t, 3.5 + f.d, 3.6 + f.d)) : 0 });
      });
      const lk = es(t, 3.45, 3.75);
      pose(load, { x: DOOR - 20, y: JY - 122 + (1 - lk) * -20, s: 0.8 + lk * 0.5, o: lk });

      S.cam.z = 1.02 + es(t, 0.3, 0.8) * 0.05 - es(t, 2.0, 2.4) * 0.04 + es(t, 3.0, 3.5) * 0.05;
      S.cam.y = 30 - es(t, 2.0, 2.4) * 50 + es(t, 3.0, 3.5) * 40;
    };
  },
};
