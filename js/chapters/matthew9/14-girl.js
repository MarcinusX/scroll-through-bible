// Mt 9,25–26 — the mourners and pipers are put out through the door and the room goes quiet. Jesus goes to the
// bed and takes the girl by the hand; light comes in at the window, she sits up and stands, and her mother and
// father run to her. Then a painted flat of the Galilean hills comes down: from the house the news flies out on
// little paper wings to every village around, and the villages light up with it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roomSet, girlOnBed, blanketOnBed, mourners, village, RM, RULER, L5, flute, wordSlip, glyphTag, heart, spark, rayBurst, kf, moving, tr, PI } from './lib.js';
import { band } from '../../assets/nature.js';

const FEET = RM.FLOOR + 20;

/** the painted flat of the countryside, with the villages; origin: its top centre */
function landFlat(c, w = 500, h = 220) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 10), C.wood2);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 10), mix(C.skyBlue, C.cream, 0.4));
  const b1 = band(c, { y: 120, amps: [14, 6, 2], lens: [400, 160, 60], color: mix(C.hillFar, C.duskViolet, 0.1), x0: -w / 2, x1: w / 2, bottom: h, step: 10 });
  const b2 = band(c, { y: 170, amps: [10, 5, 2], lens: [360, 140, 60], color: C.hillMid, x0: -w / 2, x1: w / 2, bottom: h, step: 10 });
  const str = `<path d="M${-w / 2 + 40} -1600V-12M${w / 2 - 40} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return str + s.out() + b1.markup + b2.markup;
}
const VIL = [[-190, 128], [-90, 168], [30, 122], [130, 172], [200, 126]];

export default {
  id: 'mt9-girl',
  beats: [
    { v: 25, text: 'Skoro jednak usunięto tłum,' },
    { v: 25, cont: true, text: 'wszedł i ujął ją za rękę,' },
    { v: 25, cont: true, text: 'a dziewczynka wstała.' },
    { v: 26 },
  ],
  cam: { x: [-120, 160], y: [-60, 40], z: [0.96, 1.2] },
  build(S) {
    const set = roomSet(S);
    const c = S.c;
    // phone: the bed, the girl, her mother and Jesus at the bedside move in from the edge
    const BD = S.portrait ? -100 : 0;
    const MD = S.portrait ? -36 : 0;     // phone: the mother kneels a little nearer, clear of the progress thread
    const girlLying = set.bedL.add(`<g>${girlOnBed(c, L5.girl)}</g>`);
    const girlSit = S.puppet(set.bedL.add(person(c, { ...L5.girl, pose: 'sit' })));
    set.bedL.add(`<g>${blanketOnBed(c)}</g>`);

    const L = S.layer({ par: 0.5, sh: 5 });
    const GX = S.portrait ? [720, 830] : [720, 880], PX = S.portrait ? [610, 920] : [610, 990];   // phone: where they stood in mt9-flutes
    const G = [[[0, 1, 2], GX[0]], [[3, 1, 0], GX[1]]].map(([idx, x], i) => ({ i, x, go: L.sprite(mourners(c, idx, 'go'), x, FEET) }));
    const pipers = [0, 1].map((i) => ({ i, x: PX[i], sp: L.sprite(mourners(c, [i + 2], 'go'), PX[i], FEET - 10) }));
    const mother = S.puppet(L.add(person(c, { ...L5.mother, pose: 'kneel' })));
    const motherUp = S.puppet(L.add(person(c, L5.mother)));
    const ruler = S.puppet(L.add(person(c, RULER)));
    const girlUp = S.puppet(L.add(person(c, L5.girl)));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jUp = S.puppet(L.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const glow = fx.add(`<g opacity="0"><circle r="160" fill="url(#halo-glow)"/></g>`);
    const hearts = [0, 1].map(() => fx.add(`<g>${heart(c, 12)}</g>`));

    /* the flat of the countryside and the news on paper wings */
    const fl = S.layer({ par: 0.3, sh: 7 });
    const land = fl.add(`<g>${landFlat(c)}</g>`);
    const vils = VIL.map(([x, y], i) => ({ i, x, y, el: fl.add(`<g>${village(c, { n: 3, w: 70, sc: 0.36, lit: true })}</g>`), bang: fl.add(`<g>${glyphTag(c, '!', { size: 16 })}</g>`) }));
    const home = fl.add(`<g>${village(c, { n: 1, w: 10, sc: 0.5 })}<circle cy="-14" r="30" fill="url(#warm-glow)"/></g>`);
    const slips = VIL.map((v, i) => ({ i, v, el: fl.add(`<g>${wordSlip(c, 26)}</g>`) }));
    const FLX = S.portrait ? 846 : 880, FLY = 120;     // phone: the flat clear of the progress thread

    return (t, time) => {
      const T = time;
      /* v25a — the crowd is put out */
      G.forEach((g) => {
        const k = es(t, 0.1 + g.i * 0.12, 0.75 + g.i * 0.12);
        const x = lerp(g.x, RM.DOOR - 40, k);
        g.go.set({ x, y: FEET - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.05)) * 3 : 0), s: 1, o: 1 - es(t, 0.7 + g.i * 0.12, 0.85 + g.i * 0.12) });
      });
      pipers.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.2, 0.7 + p.i * 0.2);
        const x = lerp(p.x, RM.DOOR - 40, k);
        p.sp.set({ x, y: FEET - 10, o: 1 - es(t, 0.65 + p.i * 0.2, 0.8 + p.i * 0.2) });
      });

      /* Jesus sends them out, then goes to the bed */
      if (BD) set.bedL.shift(BD, 0);
      const JK = [[1.0, 520], [1.4, 930 + BD]];
      const jx = kf(t, JK);
      const kneel = es(t, 1.45, 1.5);
      jesus.set({ x: jx, y: FEET, s: 1.04, walk: moving(t, JK) ? jx * 0.05 : undefined, o: 1 - kneel, armF: 20 + bump(t, 0.1, 0.9) * 60, armB: 10 + bump(t, 0.1, 0.9) * 90, flip: t < 0.9 && t > 0.1, blink: blinkAt(T) });
      /* v25b — He takes her by the hand */
      const take = es(t, 1.5, 1.75);
      const rise = es(t, 2.05, 2.12), stand = es(t, 2.4, 2.47);
      jSit.set({ x: 940 + BD, y: FEET, s: 1.04, o: kneel * (1 - stand), armF: 30 + take * 50 + rise * 20, armB: 20, head: 8 - rise * 14, blink: blinkAt(T) });
      jUp.set({ x: 900 + BD, y: FEET, s: 1.04, o: stand, armF: 50 + bump(t, 2.5, 3.5) * 20, armB: 20, head: -4, blink: blinkAt(T) });
      pose(girlLying, { o: 1 - rise });
      girlSit.set({ x: 1060 + BD, y: RM.FLOOR - 50, s: 0.78, flip: true, o: rise * (1 - stand), armF: 80, armB: 20, head: -6, blink: blinkAt(T, 2) });
      /* v25c — the girl gets up */
      girlUp.set({ x: 1040 + BD - stand * 20, y: FEET + 6, s: 0.8, flip: true, o: stand, armF: 60 + bump(t, 2.5, 3.5) * 40, armB: 30 + es(t, 2.55, 2.8) * 100, head: -6, blink: blinkAt(T, 2) });
      pose(glow, { x: 1030 + BD, y: RM.FLOOR - 110, s: 0.6 + es(t, 2.05, 2.6) * 0.6, o: es(t, 2.0, 2.4) * 0.8 });
      pose(set.winLight, { o: es(t, 1.9, 2.4) });
      const run = es(t, 2.5, 2.85);
      mother.set({ x: 1210 + BD + MD, y: FEET - 30, s: 0.94, flip: true, o: 1 - es(t, 2.4, 2.45), armF: 60, armB: 30, head: 16, blink: blinkAt(T, 7) });
      motherUp.set({ x: lerp(1210 + BD + MD, 1120 + BD, run), y: FEET, s: 0.96, flip: true, o: es(t, 2.4, 2.45), armF: 60 + run * 60, armB: 50 + run * 80, walk: run > 0 && run < 1 ? run * 20 : undefined, blink: blinkAt(T, 7) });
      const RK = [[0.0, 380], [1.2, 380], [2.5, 380], [2.85, 820 + BD]];
      const rx = kf(t, RK);
      ruler.set({ x: rx, y: FEET - 10, s: 1, walk: moving(t, RK) ? rx * 0.05 : undefined, armF: 20 + run * 110, armB: 10 + run * 120, head: 10 - run * 16, blink: blinkAt(T, 3) });
      hearts.forEach((h, i) => {
        const k = es(t, 2.6 + i * 0.12, 2.85 + i * 0.12, ease.back);
        pose(h, { x: [1080, 840][i] + BD, y: RM.FLOOR - 230 - k * 20, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v26 — the news goes out into all that land */
      const fk = es(t, 3.0, 3.35, ease.out);
      const oy = lerp(-700, FLY, fk) - FLY;
      pose(land, { x: FLX, y: FLY + oy, o: fk > 0.01 ? 1 : 0 });
      pose(home, { x: FLX - 20, y: FLY + 150 + oy, o: fk > 0.01 ? 1 : 0 });
      vils.forEach((v) => {
        pose(v.el, { x: FLX + v.x, y: FLY + v.y + oy, o: fk > 0.01 ? 1 : 0 });
        const hit = es(t, 3.4 + v.i * 0.08, 3.6 + v.i * 0.08, ease.back);
        pose(v.bang, { x: FLX + v.x, y: FLY + v.y - 40 + oy, s: hit, o: hit > 0.02 ? 1 : 0 });
      });
      slips.forEach((s) => {
        const k = es(t, 3.25 + s.i * 0.08, 3.55 + s.i * 0.08);
        const x = lerp(FLX - 20, FLX + s.v.x, k), y = lerp(FLY + 130, FLY + s.v.y - 30, k) - Math.sin(k * PI) * 50;
        pose(s.el, { x, y: y + oy, r: (s.v.x > 0 ? 1 : -1) * 20 * Math.sin(k * PI), s: 0.9, o: bump(t, 3.25 + s.i * 0.08, 3.6 + s.i * 0.08) });
      });

      S.cam.x = S.portrait ? kf(t, [[0, -100], [0.9, -110], [1.3, 60], [2.8, 70], [3.2, 60]]) : kf(t, [[0, 0], [0.9, -20], [1.3, 100], [2.8, 110], [3.2, 80]]);   // phone: the door the mourners go out of, then the bed
      S.cam.z = 1.06 + es(t, 1.3, 1.7) * 0.1 - es(t, 2.6, 3.2) * 0.14;
      S.cam.y = 30 - es(t, 2.9, 3.3) * 80;
    };
  },
};
