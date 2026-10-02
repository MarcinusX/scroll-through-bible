// Mt 9,12–13 — Jesus hears them. He rises from the table and turns to the Pharisees at the gate. Over the table a
// painted flat comes down: a physician with his jar and bandages walks past a man who is well and kneels by one
// who is sick. Then a second flat: a smoking altar with a lamb (sacrifice) grows dim and small, while a pair of
// hands lifting a fallen man (mercy) glows and comes forward — "I desire mercy, not sacrifice". Last, the flat
// flies up and Jesus opens His arms to the tax collectors and sinners at the table: He came to call them.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { feastSet, FT, FP, SEATS, lookOf, supperTable, pose3, scribe, lantern, jug, heart, spark, L5, physicianKit, bedFrame, lyingPerson, bedBlanket, slip, kf, moving, tr, EVENING, NIGHT, PI } from './lib.js';
import { altar, puff } from '../mark12/lib.js';
import { lamb } from '../mark11/lib.js';

const camFor = (x) => (x - 800) / FP;
const FX0 = 760, FY = 130, FW = 540, FH = 290;     // the painted flat: centre x, top y, size

/** a painted flat: a wooden frame round a parchment sky and a strip of ground; origin at its top centre */
function flat(c, { w = FW, h = FH, sky = mix(C.skyBlue, C.cream, 0.4), ground = mix(C.sand, C.hillNear, 0.35) } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 10), C.wood2);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 10), sky);
  s.p(c.cut([[-w / 2, h * 0.72], [w / 2, h * 0.68], [w / 2, h], [-w / 2, h]], 0.6, 10), ground);
  const str = `<path d="M${-w / 2 + 30} -1600V-12M${w / 2 - 30} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return str + s.out();
}

export default {
  id: 'mt9-physician',
  enter: 'fly',
  beats: [
    { v: 12, text: 'On usłyszawszy to, rzekł:' },
    { v: 12, cont: true, text: '«Nie potrzebują lekarza zdrowi, lecz ci, którzy się źle mają.' },
    { v: 13, text: 'Idźcie i starajcie się zrozumieć, co znaczy: Chcę raczej miłosierdzia niż ofiary.' },
    { v: 13, cont: true, text: 'Bo nie przyszedłem powołać sprawiedliwych, ale grzeszników».' },
  ],
  cam: { x: [camFor(640), camFor(860)], y: [-40, 110], z: [1, 1.16] },
  build(S) {
    const FX = S.portrait ? 736 : FX0;     // phone: the painted flats clear of the progress thread
    let PH = null;
    const set = feastSet(S, {
      skyCols: EVENING, sky2: NIGHT,
      outside: (S2) => {
        const L = S2.layer({ par: FP, sh: 4 });
        PH = [0, 1, 2].map((i) => ({ i, x: (S2.portrait ? [400, 460, 520] : [310, 370, 446])[i],   // phone: in the gateway, inside the screen
        seed: S2.c.rr(0, 9), p: S2.puppet(L.add(scribe(S2.c, i + 1))) }));
        return L;
      },
    });
    const c = S.c;
    const lampL = S.layer({ par: FP, sh: 5 });
    const lamps = [[640, 336], [1000, 336], [1330, 336]].map(([x, y], i) => ({ i, x, y, el: lampL.add(`<g><circle cx="0" cy="30" r="80" fill="url(#warm-glow)"/><path d="M0 -40V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lantern(c, { col: [C.apricot, C.roseRobe, C.halo][i] })}</g>`) }));

    /* the company at the table */
    const L = S.layer({ par: FP, sh: 5 });
    const seatM = (o, flip, armF = 56, armB = 16, head = 2) => pose3(c, [{ x: 0, y: 0, s: 1, flip, armF, armB, head, o: { ...o, pose: 'sit' } }]);
    const places = SEATS.filter(([, who]) => who !== 'jesus').map(([x, who], i) => {
      const guest = who.length === 2;
      return { i, x, who, guest, el: L.add(`<g>${seatM(lookOf(who), x > 845)}</g>`), up: guest ? L.add(`<g>${seatM(lookOf(who), x > 845, 100, 150, -8)}</g>`) : null };
    });
    const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const tableL = S.layer({ par: FP, sh: 5 });
    tableL.add(`<g transform="translate(${FT.TX} ${FT.FLOOR})">${supperTable(c)}</g>`);
    const glowL = S.layer({ par: FP, sh: 2 });
    const warm = places.filter((p) => p.guest).map((p) => ({ p, h: glowL.add(`<g>${heart(c, 10)}</g>`) }));

    /* the painted flats */
    const fl = S.layer({ par: FP, sh: 7 });
    const f1 = fl.add(`<g>${flat(c)}</g>`);
    const G = FY + FH * 0.72;           // the flat's ground line
    const well = fl.add(`<g>${pose3(c, [{ x: 0, y: 0, s: 0.64, flip: false, armF: 150, armB: 160, head: -6, o: { robe: C.sageRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather } }])}</g>`);
    const sick = fl.add(`<g><g transform="scale(.62)">${bedFrame(c)}<g transform="translate(0 -54)">${lyingPerson(c, { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: mix(C.skin2, C.stone, 0.3) }, 0.62)}</g>${bedBlanket(c)}</g></g>`);
    const doc = S.puppet(fl.add(person(c, { ...L5.doctor, holdF: `<g transform="translate(20 10) scale(.7)">${physicianKit(c)}</g>` })));
    const docK = S.puppet(fl.add(person(c, { ...L5.doctor, pose: 'kneel' })));
    const f2 = fl.add(`<g>${flat(c, { sky: mix(C.halo, C.cream, 0.5), ground: mix(C.sand, C.dune, 0.3) })}</g>`);
    const sac = fl.add(`<g><g transform="translate(0 0)">${altar(c, 150, 86)}</g><g transform="translate(-16 -92) scale(.75)">${lamb(c)}</g><g transform="translate(0 -96)">${puff(c, 22)}</g><g transform="translate(12 -128)">${puff(c, 16)}</g><g transform="translate(0 30)">${slip(c, tr('ofiara', 'sacrifice'), { size: 18 })}</g></g>`);
    const mercy = fl.add(`<g><circle cy="-50" r="90" fill="url(#warm-glow)"/>${pose3(c, [
      { x: -28, y: 0, s: 0.6, flip: false, armF: 80, armB: 60, head: 8, o: { robe: C.roseRobe, mantle: C.clayMantle, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair2, skin: C.skin2 } },
      { x: 34, y: 0, s: 0.6, flip: true, armF: 70, armB: 20, head: -6, o: { robe: mix(C.stone2, C.rock2, 0.4), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, pose: 'kneel' } },
    ])}<g transform="translate(0 -110)">${heart(c, 12)}</g><g transform="translate(0 30)">${slip(c, tr('miłosierdzie', 'mercy'), { size: 18 })}</g></g>`);

    const DK = [[1.1, FX - 190], [1.7, FX + 66]];
    return (t, time) => {
      const T = time;
      set.update(T, { sunY: 230 + es(t, 0, 4) * 200 });
      set.sk2.layer.fade(es(t, 0.2, 3.6) * 0.75);
      lamps.forEach((l) => pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.8 + l.i) * 1.5 }));

      /* v12a — He heard it: He rises and turns to the gate */
      const up = es(t, 0.1, 0.17);
      const JK = [[0.17, 845], [0.7, 640]];
      const jx = kf(t, JK);
      const toTable = es(t, 3.05, 3.2);
      const open = es(t, 3.1, 3.4);
      jSit.set({ x: 845, y: FT.SEAT, s: 1.02, o: 1 - up, armF: 30, armB: 14, blink: blinkAt(T) });
      jesus.set({
        x: jx, y: FT.FLOOR, s: 1.02, flip: toTable < 0.5, o: up, walk: moving(t, JK) ? jx * 0.05 : undefined,
        armF: 20 + es(t, 0.6, 0.9) * 50 * (1 - es(t, 1.0, 1.2)) + bump(t, 2.05, 2.9) * 60 + open * 70, armB: 10 + open * 110, head: open * -4, blink: blinkAt(T),
      });
      PH.forEach((ph) => {
        const away = es(t, 3.3 + ph.i * 0.07, 3.8 + ph.i * 0.07);
        const x = ph.x - away * 260;
        ph.p.set({ x, y: FT.FLOOR - 6 + ph.i * 3, s: 1, flip: away > 0.02, walk: away > 0 && away < 1 ? x * 0.05 + ph.i : undefined, armF: 20 + (ph.i === 2 ? bump(t, 0.3, 1.0) * 50 : 0), armB: 10, head: 4 - bump(t, 2.1, 2.9) * 8, o: 1 - es(t, 3.7, 3.95), blink: blinkAt(T, ph.seed) });
      });

      /* v12b — the flat of the physician */
      const d1 = es(t, 1.0, 1.35, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      const y1 = lerp(-700, FY, d1);
      const oy = y1 - FY;
      pose(f1, { x: FX, y: y1, o: d1 > 0.01 ? 1 : 0 });
      pose(well, { x: FX - 180, y: G + oy, o: d1 > 0.01 ? 1 : 0 });
      pose(sick, { x: FX + 160, y: G + 6 + oy, o: d1 > 0.01 ? 1 : 0 });
      const dx = kf(t, DK);
      const kneel = es(t, 1.7, 1.75);
      doc.set({ x: dx, y: G + 4 + oy, s: 0.64, flip: false, o: (d1 > 0.01 ? 1 : 0) * (1 - kneel), walk: moving(t, DK) ? dx * 0.08 : undefined, head: bump(t, 1.2, 1.45) * 10 });
      docK.set({ x: FX + 66, y: G + 4 + oy, s: 0.64, o: (d1 > 0.01 ? 1 : 0) * kneel, armF: 80, armB: 40, head: 10 });

      /* v13a — mercy, not sacrifice */
      const d2 = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      const y2 = lerp(-700, FY, d2), oy2 = y2 - FY;
      pose(f2, { x: FX, y: y2, o: d2 > 0.01 ? 1 : 0 });
      const choose = es(t, 2.45, 2.75);
      pose(sac, { x: FX - 130 - choose * 20, y: G + oy2 - choose * 8, s: 1 - choose * 0.3, o: d2 > 0.01 ? 1 - choose * 0.55 : 0 });
      pose(mercy, { x: FX + 120 - choose * 20, y: G + oy2 + choose * 10, s: 1 + choose * 0.3, o: d2 > 0.01 ? 1 : 0 });

      /* v13b — He came to call sinners: His arms open to the table; they stand, warmed */
      places.forEach((p) => {
        pose(p.el, { x: p.x, y: FT.SEAT, o: p.guest ? 1 - es(t, 3.3, 3.4) : 1 });
        if (p.up) pose(p.up, { x: p.x, y: FT.SEAT, o: es(t, 3.3, 3.4) });
      });
      warm.forEach((w, i) => {
        const k = es(t, 3.35 + i * 0.05, 3.6 + i * 0.05, ease.back);
        pose(w.h, { x: w.p.x, y: FT.SEAT - 190 - k * 20, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* camera: the gate & the flat → the table */
      S.cam.x = kf(t, [[0, camFor(800)], [0.8, camFor(720)], [2.9, camFor(730)], [3.4, camFor(820)]]);
      S.cam.z = 1.04 - es(t, 0.9, 1.3) * 0.04 + es(t, 3.0, 3.5) * 0.1;
      S.cam.y = 60 - es(t, 0.9, 1.3) * 100 + es(t, 3.0, 3.5) * 130;
    };
  },
};
