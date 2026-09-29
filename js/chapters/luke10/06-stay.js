// Łk 10,7 — the house of the son of peace, cut open like a doll's house. "Stay in that same house, eating and
// drinking what they give you": the two sit down at the low table with the master of the house and his little son;
// his wife brings what they have — a round loaf, a bowl of lentils, the water jar — and they eat and drink. Through
// the window the day goes by, night falls and the lamp is lit, and the morning comes again: they are still there.
// "For the labourer deserves his wages": a painted plate comes down over the roof — at the end of a day in the field,
// the master of the harvest counts coins into a reaper's open hand — and at the table the host breaks bread for his
// guests. "Do not go from house to house": outside, the rich neighbour comes out of his fine house with a laden tray
// and beckons them over; a trail of footprints runs from door to door — and is crossed out: the two shake their heads,
// lay a hand on their host's shoulder and stay where they are.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { oilLamp } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { laneSet, doorHouse, barefoot, figure, glow, loaf, bowl, cup, jug, coin, crossX, footprint, sparkle, kf, moving, handAt, headAt, tr, DAY, NIGHT, SENT_A, SENT_B, HOST, HOSTWIFE, HOSTBOY, RICH, REAPER, sickleHeld, strip, STRING, es, ease, bump, seg, PI } from './lib.js';
import { houseSection } from '../mark3/lib.js';
import { lowTable } from '../mark2/lib.js';

const X0 = 330, X1 = 1010, FLOOR = 700, CEIL = 300;
const TX = 660;                         // the low table
const SEAT_Y = FLOOR + 6;

export default {
  id: 'lk10-stay',
  beats: [
    { v: 7, text: 'W tym samym domu zostańcie, jedząc i pijąc, co mają:' },
    { v: 7, cont: true, text: 'bo zasługuje robotnik na swoją zapłatę.' },
    { v: 7, cont: true, text: 'Nie przechodźcie z domu do domu.' },
  ],
  cam: { x: [-40, 360], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const V = laneSet(S, { skyCols: DAY, sky2: NIGHT, GY: 716, sunAt: [1240, 170] });
    const c = S.c;
    const moonEl = V.hangL.add(`<g>${glow(80, 0.5)}<circle r="26" fill="${C.moon}"/></g>`);

    /* the rich neighbour's fine house, outside on the right */
    const RH = S.layer({ par: 0.45, sh: 4 });
    const RLF = S.layer({ par: 0.45, sh: 4 });
    const H2 = doorHouse(S, RH, RLF, c, { x0: 1120, base: FLOOR + 10, w: 280, h: 260, wall: mix(C.plaster, C.cream, 0.5) });
    let garl = '';
    for (let i = 0; i < 9; i++) garl += c.cut(c.ell(1130 + i * 30, FLOOR - 236 + Math.sin(i * 0.9) * 8, 10, 6, 8, i), 0.2, 3);
    RH.add(sheet().p(garl, C.leaf).p(c.cut(c.circ(1160, FLOOR - 220, 5, 8), 0.2, 2) + c.cut(c.circ(1260, FLOOR - 224, 5, 8), 0.2, 2) + c.cut(c.circ(1360, FLOOR - 220, 5, 8), 0.2, 2), C.jesusMantle).out());
    const rich = S.puppet(RLF.add(person(c, { ...RICH, holdF: `<g transform="rotate(80) translate(0 -4)">${sheet().p(c.cut([[-30, 0], [30, 0], [24, 6], [-24, 6]], 0.3, 4), C.sun).out()}<g transform="translate(-12 -2)">${loaf(c, 11)}</g><g transform="translate(12 -4)"><path d="${c.cut(c.circ(0, -6, 7, 10), 0.2, 3)}" fill="${C.plumRobe}"/></g></g>` })));

    /* the house of the son of peace, cut open */
    const hs = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL, doorX: 40, doorW: 84, doorH: 180 });
    const back = S.layer({ par: 0.45, sh: 3 });
    back.add(hs.back);
    const niche = back.add(`<g>${glow(110, 0.9, 'warm-glow')}<g transform="translate(0 0) scale(.8)">${oilLamp(c)}</g></g>`);
    const table = S.layer({ par: 0.45, sh: 4 });
    const P = S.layer({ par: 0.45, sh: 5 });
    const host = S.puppet(P.add(person(c, { ...HOST, pose: 'sit' })));
    const boy = S.puppet(P.add(person(c, { ...HOSTBOY, pose: 'sit' })));
    const A = S.puppet(P.add(barefoot(person(c, { ...SENT_A, pose: 'sit', mantleArm: true }), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, { ...SENT_B, pose: 'sit' }), SENT_B.skin)));
    const Ast = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const Bst = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const wife = S.puppet(P.add(person(c, HOSTWIFE)));
    table.add(`<g transform="translate(${TX} ${FLOOR + 4})">${lowTable(c, 220, 38)}</g>`);
    const food = {
      bread: table.add(`<g>${loaf(c, 17)}</g>`),
      lentils: table.add(`<g>${bowl(c, { w: 40, food: 'stew' })}</g>`),
      jar: table.add(`<g transform="scale(.62)">${jug(c, C.pot)}</g>`),
      cupA: P.add(`<g>${cup(c, C.pot)}</g>`),
      half: P.add(`<g>${loaf(c, 12)}</g>`),
    };
    const front = S.layer({ par: 0.46, sh: 6 });
    front.add(hs.front);

    /* the painted plate of the labourer's wages */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const PW = 330, PH = 196;
    const pc = makeCutter('lk10-wages');
    const plate = sheet();
    plate.p(pc.cut(pc.rect(-PW / 2, 0, PW, PH), 0.6, 8), C.cream);
    plate.p(pc.cut(pc.rect(-PW / 2 + 9, 9, PW - 18, PH - 40), 0.4, 8), mix(C.dusk, C.apricot, 0.5));
    plate.p(pc.cut([[-PW / 2 + 9, PH - 70], [PW / 2 - 9, PH - 84], [PW / 2 - 9, PH - 31], [-PW / 2 + 9, PH - 31]], 0.5, 8), C.wheat);
    let st = '';
    for (let x = -PW / 2 + 16; x < PW / 2 - 14; x += 10) st += pc.ribbon([[x, PH - 72 - (x > 0 ? 6 : 0)], [x + 2, PH - 96 - (x > 0 ? 6 : 0)]], 2.4);
    plate.p(st, C.wheat2);
    plate.p(pc.cut(pc.circ(96, 60, 22, 16), 0.3, 3), C.sunDeep);
    const scene = figure(pc, { ...REAPER, holdB: `<g transform="rotate(20)">${sickleHeld(pc)}</g>` }, { x: -40, y: PH - 34, s: 0.52, armF: 70, armB: 10, head: 6 }) + figure(pc, { robe: C.linen2, mantle: C.plumRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.sun }, { x: 40, y: PH - 34, s: 0.52, flip: true, armF: 64, armB: 20, head: 4 });
    const lab = `<g transform="translate(0 ${PH - 14})">${strip(pc, tr('robotnik i jego zapłata', 'the laborer and his wages'), { size: 15 })}</g>`;
    const plateEl = flies.add(`<g><path d="M${-PW / 2 + 30} 0V-2000M${PW / 2 - 30} 0V-2000" stroke="${STRING}" stroke-width="1.2"/>${plate.out()}${scene}${lab}</g>`);
    const coins = [0, 1, 2].map(() => flies.add(`<g>${coin(pc, 5)}</g>`));

    /* from door to door: the footprints, crossed out */
    const trail = S.layer({ par: 0.45, sh: 2 });
    const steps = Array.from({ length: 6 }, (_, i) => trail.add(`<g transform="rotate(${-90 + (i % 2 ? 8 : -8)}) scale(.9)">${footprint(c, i % 2 === 0)}</g>`));
    const fx = S.layer({ par: 0.47, sh: 5 });
    const cross = fx.add(`<g>${crossX(c, 34)}</g>`);
    const sp = [0, 1].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      /* v7a — the table is laid; they eat and drink; a day and a night go by */
      const night = es(t, 0.32, 0.46) * (1 - es(t, 0.62, 0.78));
      V.sk2.layer.fade(night * 0.95);
      V.starL.fade(night);
      V.update(T, { sunY: 170 + night * 700, sunX: lerp(1240, 900, es(t, 0.05, 0.9)) });
      pose(moonEl, { x: 700, y: 180 + (1 - night) * 500, o: night });
      pose(niche, { x: 520, y: CEIL + 118, s: 0.9, o: 0.3 + night * 0.7 });

      const serve = [[0, 1000], [0.1, 820], [0.22, 820], [0.3, 950], [1.2, 950], [1.3, 830], [1.5, 830], [1.6, 950]];
      const wx = kf(t, serve);
      wife.set({ x: wx, y: SEAT_Y - 4, s: 0.94, flip: true, walk: moving(t, serve) ? wx * 0.05 : undefined, armF: 30 + bump(t, 0.08, 0.26) * 50 + bump(t, 1.28, 1.5) * 50, armB: 10, head: 8 * bump(t, 0.1, 0.24), blink: blinkAt(T, 6) });
      pose(food.bread, { x: TX - 50, y: FLOOR - 36, o: es(t, 0.1, 0.14) });
      pose(food.lentils, { x: TX + 6, y: FLOOR - 34, o: es(t, 0.16, 0.2) });
      pose(food.jar, { x: TX + 70, y: FLOOR - 34, o: es(t, 0.2, 0.24) });

      /* v7c — they rise to see the rich neighbour, and sit down again with the host */
      const look = es(t, 2.22, 2.36) * (1 - es(t, 2.6, 2.7));
      const stand = es(t, 2.2, 2.26) * (1 - es(t, 2.62, 2.68));
      const shake = bump(t, 2.4, 2.64);
      const eat = Math.max(bump(t, 0.24, 0.5), bump(t, 0.72, 0.95)) * (1 - stand);
      const drink = bump(t, 0.4, 0.62);
      const toHost = es(t, 2.7, 2.86);
      A.set({ x: 540, y: SEAT_Y, s: 0.96, flip: false, o: 1 - stand, armF: 30 + eat * 70 + toHost * 50, armB: 10 + drink * 90, head: -eat * 6, blink: blinkAt(T, 2) });
      B.set({ x: 790, y: SEAT_Y + 4, s: 0.94, flip: true, o: 1 - stand, armF: 30 + drink * 90 + bump(t, 1.4, 1.8) * 50, armB: 10 + eat * 40, head: -drink * 10, blink: blinkAt(T, 3) });
      Ast.set({ x: 560, y: SEAT_Y, s: 0.96, flip: false, o: stand, armF: 20, armB: 10 + look * 30, head: shake * Math.sin(t * 60) * 8 - 2, blink: blinkAt(T, 2) });
      Bst.set({ x: 780, y: SEAT_Y + 4, s: 0.94, flip: false, o: stand, armF: 20 + look * 40, armB: 10, head: shake * Math.sin(t * 60 + 1) * 8 - 2, blink: blinkAt(T, 3) });
      const [ahx, ahy] = handAt(790, SEAT_Y + 4, 0.94, true, 30 + drink * 90, 'sit');
      pose(food.cupA, { x: ahx, y: ahy + 8, s: 0.9, r: drink * -40, o: es(t, 0.3, 0.34) * (1 - stand) });

      /* v7b — the host breaks bread for them; the labourer's plate comes down */
      const breakB = bump(t, 1.3, 1.75);
      host.set({ x: 420, y: SEAT_Y - 2, s: 0.98, flip: false, armF: 30 + breakB * 50 + bump(t, 2.7, 2.95) * 20, armB: 10 + breakB * 40, head: -2 + toHost * 6, blink: blinkAt(T, 4) });
      const [hhx, hhy] = handAt(420, SEAT_Y - 2, 0.98, false, 30 + breakB * 50, 'sit');
      const giv = es(t, 1.45, 1.7);
      pose(food.half, { x: lerp(hhx + 6, 520, giv), y: lerp(hhy + 4, FLOOR - 94, giv) - Math.sin(giv * PI) * 20, o: seg(t, 1.3, 1.34) * (1 - seg(t, 1.9, 2.0)) });
      boy.set({ x: 868, y: SEAT_Y + 6, s: 0.62, flip: true, armF: 40 + eat * 40, armB: 10, head: -4, blink: blinkAt(T, 5) });
      const pk = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.92, 2.08, ease.in));
      pose(plateEl, { x: TX, y: lerp(-520, 120, pk), r: T ? Math.sin(T * 0.8) * pk : 0, o: pk > 0.002 ? 1 : 0 });
      coins.forEach((co, i) => {
        const k = seg(t, 1.4 + i * 0.1, 1.55 + i * 0.1);
        pose(co, { x: TX + 16 - k * 30, y: lerp(-520, 120, pk) + 104 + k * 30, o: pk > 0.5 && k > 0 ? 1 : 0 });
      });

      /* v7c — the rich neighbour beckons; the way from door to door is crossed out */
      const beckon = es(t, 2.05, 2.2);
      const wave = time ? Math.sin(T * 5) * 16 * beckon : 0;
      H2.open(es(t, 2.0, 2.12));
      H2.lit(es(t, 2.0, 2.15));
      rich.set({ x: 1230, y: FLOOR + 14, s: 1.0, flip: true, o: es(t, 2.04, 2.1), armF: 30 + beckon * 50, armB: 20 + beckon * 90 + wave, head: -4, blink: blinkAt(T, 7) });
      steps.forEach((el, i) => { const k = es(t, 2.22 + i * 0.04, 2.3 + i * 0.04); pose(el, { x: lerp(1040, 1170, i / 5), y: FLOOR + 10 - (i % 2) * 8, o: k }); });
      const cr = es(t, 2.48, 2.58, ease.back);
      pose(cross, { x: 1106, y: FLOOR + 2, s: cr, o: cr > 0.01 ? 1 : 0 });
      sp.forEach((s_, i) => { const k = bump(t, 2.75 + i * 0.08, 3.0 + i * 0.08); pose(s_, { x: [470, 740][i], y: FLOOR - 150, s: k, r: T * 40, o: k }); });

      S.cam.x = kf(t, [[0, -20], [1.0, -20], [1.9, -20], [2.15, 200], [2.9, 200]], ease.sine);
      S.cam.y = kf(t, [[0, 20], [0.9, 20], [1.2, -40], [1.9, -40], [2.15, 20], [3, 20]]);
      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.08], [1.2, 1.0], [1.9, 1.0], [2.15, 1.04], [3, 1.04]]);
    };
  },
};
