// Mk 2,1–4 — back in Capernaum: the house fills up, four friends carry a paralysed man,
// climb onto the flat roof, dig through it and let his mat down in front of Jesus.
// The house is a cut-away doll's house: we see the room inside and the street outside at once.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, town, sun, cloud, palm, olive, bush, grass } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, townsfolk, pallet, blanket, rope, dust, wordSlip, speech, GLYPH } from './lib.js';

const PI = Math.PI;
const STREET = 690, FLOOR = 580, CEIL = 372, ROOF = 330;
const HX0 = 440, HX1 = 1100;            // house
const CUT0 = 520, CUT1 = 960;           // the cut-away in the front wall
const HOLE0 = 668, HOLE1 = 872;         // the hole they dig in the roof
const LAD = [[1152, STREET], [1090, ROOF - 2]];
const MAT_W = 190, MAT_X = 770;

/** the paralysed man lying on his mat, blanket over his legs; origin: middle of the mat's top */
export function matWithMan(c, w = MAT_W) {
  const s = 0.72;
  const man = person(c, { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, eyes: 'open' });
  return `${pallet(c, w)}<g transform="translate(${w / 2 - 34} ${-40 * s}) rotate(-90) scale(${s})">${man}</g>${blanket(c)}`;
}

export default {
  id: 'm2-house',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Zebrało się tyle ludzi, że nawet przed drzwiami nie było miejsca,' },
    { v: 2, cont: true, text: 'a On głosił im naukę.' },
    { v: 3 },
    { v: 4, text: 'Nie mogąc z powodu tłumu przynieść go do Niego,' },
    { v: 4, cont: true, text: 'odkryli dach nad miejscem, gdzie Jezus się znajdował,' },
    { v: 4, cont: true, text: 'i przez otwór spuścili łoże, na którym leżał paralityk.' },
  ],
  cam: { x: [-40, 470], y: [-70, 60], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe0dc', '#efe5cb', '#f7ead3'];
    const sk = sky(S, SKY);

    /* ---------- heavens ---------- */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 520, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 990, y: 205, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 45, scale: 0.5 });

    /* ---------- the lake behind Capernaum, hills, the town ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 360, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.12, sh: 1 });
    lakeL.add(waterBand(c, { y: 392, color: C.lake, foamN: 16, bottom: 900 }).markup);
    const townL = S.layer({ par: 0.24, sh: 3 });
    const tb = hillsWith(c, { y: 470, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    townL.add(tb.markup);
    townL.add(town(c, { x: 200, y: tb.fn(200) + 16, n: 7, spread: 380, sc: 0.8 }) + town(c, { x: 1390, y: tb.fn(1390) + 16, n: 6, spread: 360, sc: 0.8 }));
    townL.add(town(c, { x: 780, y: tb.fn(780) + 10, n: 5, spread: 420, sc: 0.62 }));
    townL.add(palm(c, 360, tb.fn(360) + 20, 150) + palm(c, 1250, tb.fn(1250) + 20, 130) + olive(c, 1500, tb.fn(1500) + 18, 0.7));
    // townsfolk far away who hear the news and come out of their doors
    const far = [[150, 0], [300, 1], [1330, 2], [1450, 3], [610, 4], [980, 5]].map(([x, i]) => {
      const y = tb.fn(x) + 18;
      return { x, y, i, p: S.puppet(townL.add(person(c, townsfolk(c, { pose: 'stand' })))), dir: x < 800 ? 1 : -1 };
    });

    /* ---------- the house: back wall and floor of the room ---------- */
    const backL = S.layer({ par: 0.5, sh: 3 });
    const bw = sheet();
    bw.p(c.cut(c.rect(CUT0 - 10, CEIL - 6, CUT1 - CUT0 + 20, FLOOR - CEIL + 10), 0.5, 12), mix(C.plaster2, C.sand2, 0.35));
    let blotch = '';
    for (let i = 0; i < 9; i++) blotch += c.cut(c.blob(c.rr(CUT0 + 30, CUT1 - 30), c.rr(CEIL + 40, FLOOR - 60), c.rr(20, 44), c.rr(10, 20), 9, 0.2), 0.6, 5);
    bw.x(blotch, shade(C.plaster2, -0.06), 'opacity=".6"');
    // ceiling beams seen from inside
    let beams = '';
    for (let x = CUT0 + 14; x < CUT1; x += 48) beams += c.cut(c.rect(x, CEIL - 4, 14, 26), 0.3, 5);
    bw.p(c.cut(c.rect(CUT0 - 10, CEIL - 6, CUT1 - CUT0 + 20, 14), 0.4, 10), C.wood2);
    bw.p(beams, C.wood);
    // a small high window, a niche with a lamp, a shelf with jars
    bw.p(c.cut([[590, 470], [590, 430], ...c.arc(612, 430, 22, 20, PI, 2 * PI, 8), [634, 470]], 0.4, 5), '#cfe0dc');
    bw.p(c.ribbon([[586, 472], [638, 472]], 6), C.wood2);
    bw.p(c.cut([[872, 470], [872, 440], ...c.arc(892, 440, 20, 18, PI, 2 * PI, 8), [912, 470]], 0.4, 5), shade(C.plaster2, -0.18));
    bw.p(c.cut([[880, 470], [884, 462], [900, 462], [908, 466], [904, 470]], 0.2, 3), C.pot);
    bw.x(`M906 462C903 458 903 454 906 448C909 454 909 458 906 462Z`, C.lampFlame);
    bw.p(c.cut(c.rect(700, 452, 110, 6), 0.3, 6), C.wood2);
    bw.p(c.cut([[712, 452], [708, 436], [716, 426], [724, 436], [720, 452]], 0.3, 4) + c.cut(c.arc(760, 452, 14, 12, PI, 2 * PI, 6), 0.3, 4) + c.cut([[786, 452], [784, 430], [796, 424], [800, 452]], 0.3, 4), C.pot);
    // herbs hanging from a beam
    bw.p(c.ribbon([[660, 380], [662, 414]], 2) + c.ribbon([[676, 380], [674, 420]], 2), C.moss);
    bw.p(c.cut(c.blob(662, 420, 9, 15, 8, 0.2), 0.4, 4) + c.cut(c.blob(675, 428, 8, 14, 8, 0.2), 0.4, 4), C.olive);
    // the floor
    bw.p(c.cut([[CUT0 - 10, FLOOR - 16], [CUT1 + 10, FLOOR - 16], [CUT1 + 10, FLOOR + 4], [CUT0 - 10, FLOOR + 4]], 0.6, 12), mix(C.clay, C.sand2, 0.55));
    backL.add(bw.out());

    /* ---------- people inside ---------- */
    const inL = S.layer({ par: 0.5, sh: 4 });
    const IN = [
      { x: 548, y: FLOOR - 6, s: 0.6, from: 470 }, { x: 596, y: FLOOR - 4, s: 0.62, from: 470 }, { x: 648, y: FLOOR - 6, s: 0.6, from: 470 },
      { x: 904, y: FLOOR - 6, s: 0.6, from: 1010 }, { x: 944, y: FLOOR - 4, s: 0.62, from: 1010 },
      { x: 566, y: FLOOR + 4, s: 0.64, from: 470, pose: 'sit' }, { x: 634, y: FLOOR + 6, s: 0.64, from: 470, pose: 'sit' }, { x: 930, y: FLOOR + 6, s: 0.64, from: 1010, pose: 'sit' },
    ].map((m, i) => ({ ...m, i, flip: m.x > 800, d: i * 0.05, seed: c.rr(0, 9) }));
    IN.filter((m) => !m.pose).forEach((m) => { m.p = S.puppet(inL.add(person(c, townsfolk(c)))); });
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus })));
    IN.filter((m) => m.pose).forEach((m) => { m.p = S.puppet(inL.add(person(c, townsfolk(c, { pose: 'sit' })))); });

    /* ---------- the mat as it comes down through the roof ---------- */
    const lowL = S.layer({ par: 0.5, sh: 5 });
    const shaft = lowL.add(`<path d="M${HOLE0 + 10} ${ROOF}L${HOLE1 - 10} ${ROOF}L${HOLE1 + 60} ${FLOOR}L${HOLE0 - 40} ${FLOOR}Z" fill="#fff3cf" opacity="0"/>`);
    const ropesIn = [0, 1, 2, 3].map(() => lowL.add(rope(c, 100)));
    const matIn = lowL.add(`<g>${matWithMan(c)}</g>`);
    const dustIn = [0, 1, 2, 3, 4].map((i) => ({ el: lowL.add(`<g>${dust(c, 18 + i * 3)}</g>`), x: HOLE0 + 20 + i * 42, i }));

    /* ---------- front wall, plinth, roof ---------- */
    const wallL = S.layer({ par: 0.5, sh: 6 });
    const ws = sheet();
    // U-shaped front wall with a ragged cut-away
    const edgeL = [], edgeT = [], edgeR = [];
    for (let y = FLOOR + 2; y > CEIL + 22; y -= 22) edgeL.push([CUT0 + c.rr(-6, 6), y]);
    for (let x = CUT0; x < CUT1; x += 26) edgeT.push([x, CEIL + 20 + c.rr(-5, 5)]);
    for (let y = CEIL + 22; y < FLOOR + 2; y += 22) edgeR.push([CUT1 + c.rr(-6, 6), y]);
    const wallPts = [[HX0, CEIL], [HX1, CEIL], [HX1, FLOOR + 2], [CUT1, FLOOR + 2], ...edgeR.reverse(), ...edgeT.reverse(), ...edgeL.reverse(), [CUT0, FLOOR + 2], [HX0, FLOOR + 2]];
    ws.p(c.cut(wallPts, 1.2, 9), C.plaster);
    // wall thickness at the cut edges
    ws.p(c.cut([[CUT0 - 2, CEIL + 16], [CUT0 + 10, CEIL + 22], [CUT0 + 10, FLOOR], [CUT0 - 2, FLOOR]], 0.6, 8) + c.cut([[CUT1 + 2, CEIL + 16], [CUT1 - 10, CEIL + 22], [CUT1 - 10, FLOOR], [CUT1 + 2, FLOOR]], 0.6, 8), C.plaster2);
    let spots = '';
    for (let i = 0; i < 6; i++) spots += c.cut(c.blob(c.rr(HX0 + 10, CUT0 - 10), c.rr(CEIL + 30, FLOOR - 20), c.rr(8, 20), c.rr(5, 10), 8, 0.2), 0.5, 4) + c.cut(c.blob(c.rr(CUT1 + 20, HX1 - 20), c.rr(CEIL + 30, FLOOR - 40), c.rr(8, 22), c.rr(5, 10), 8, 0.2), 0.5, 4);
    ws.x(spots, C.plaster2, 'opacity=".6"');
    // small window on the left pier; the door on the right
    ws.p(c.cut(c.rect(466, 430, 32, 38), 0.4, 5), C.soilDark);
    ws.p(c.ribbon([[462, 470], [502, 470]], 5), C.wood2);
    ws.p(c.cut([[992, FLOOR + 2], [992, 506], ...c.arc(1018, 506, 26, 24, PI, 2 * PI, 8), [1044, FLOOR + 2]], 0.4, 5), C.soilDark);
    ws.p(c.ribbon([[988, FLOOR + 2], [988, 504]], 6) + c.ribbon([[1048, FLOOR + 2], [1048, 504]], 6) + c.ribbon(c.arc(1018, 506, 30, 28, PI, 2 * PI, 10), 6), C.wood2);
    ws.p(c.cut([[1052, FLOOR + 2], [1052, 500], [1076, 512], [1076, FLOOR + 2]], 0.4, 6), C.wood);
    // plinth / terrace the house stands on
    ws.p(c.cut([[HX0 - 10, FLOOR], [HX1 + 10, FLOOR], [HX1 + 10, STREET + 30], [HX0 - 10, STREET + 30]], 0.8, 10), C.stone2);
    let blocks = '';
    for (let r = 0; r < 4; r++) { const y = FLOOR + 10 + r * 28; blocks += c.ribbon([[HX0 - 8, y], [HX1 + 8, y + c.rr(-2, 2)]], 1.4); for (let x = HX0 + (r % 2) * 30; x < HX1; x += c.rr(50, 80)) blocks += c.ribbon([[x, y], [x + c.rr(-2, 2), y + 26]], 1.2); }
    ws.x(blocks, shade(C.stone2, -0.14), 'opacity=".7"');
    // steps from the door down to the street
    let st = '';
    for (let i = 0; i < 4; i++) st += c.cut(c.rect(1040 + i * 18, FLOOR + i * 27, 90 - i * 18 + 30, 10), 0.3, 5);
    ws.p(st, C.stone);
    wallL.add(ws.out());
    // the roof slab: solid ends, and five loose pieces over the place where Jesus is
    const slab = (x0, x1) => {
      const s = sheet();
      s.p(c.cut([[x0, ROOF + 4], [x1, ROOF + 4], [x1, CEIL + 2], [x0, CEIL + 2]], 0.6, 8), C.wood3);
      s.p(c.cut([[x0 - 2, ROOF], [x1 + 2, ROOF], [x1 + 2, ROOF + 16], [x0 - 2, ROOF + 16]], 1.1, 6), mix(C.clay, C.sand2, 0.4));
      let reeds = '';
      for (let x = x0 + 4; x < x1 - 4; x += 7) reeds += c.ribbon([[x, ROOF + 17], [x + 2, ROOF + 27]], 2);
      s.x(reeds, C.wheat2, 'opacity=".8"');
      let ends = '';
      for (let x = x0 + 14; x < x1 - 8; x += 48) ends += c.cut(c.circ(x, CEIL - 5, 5.5, 10), 0.3, 3);
      s.p(ends, C.wood2);
      return s.out();
    };
    wallL.add(slab(HX0 - 16, HOLE0) + slab(HOLE1, HX1 + 16));
    const chunks = [0, 1, 2, 3, 4].map((i) => {
      const x0 = HOLE0 + (i * (HOLE1 - HOLE0)) / 5, x1 = HOLE0 + ((i + 1) * (HOLE1 - HOLE0)) / 5;
      const cx = (x0 + x1) / 2;
      const el = wallL.add(`<g><g transform="translate(${-cx} ${-(ROOF + 20)})">${slab(x0, x1)}</g></g>`);
      const side = i < 2 || (i === 2 && c.chance(0.5)) ? -1 : 1;
      return { el, cx, i, side, to: [side < 0 ? 596 - i * 20 : 900 + (4 - i) * 22, ROOF - 8 - (i % 2) * 10], rot: c.rr(-30, 30), t0: 6.42 + [0, 2, 4, 1, 3][i] * 0.07 };
    });
    // the ladder
    const lad = sheet();
    const [[lx0, ly0], [lx1, ly1]] = LAD;
    lad.p(c.ribbon([[lx0 - 14, ly0], [lx1 - 14, ly1 - 16]], 6) + c.ribbon([[lx0 + 14, ly0], [lx1 + 14, ly1 - 16]], 6), C.wood2);
    let rungs = '';
    for (let u = 0.06; u < 1; u += 0.085) { const x = lerp(lx0, lx1, u), y = lerp(ly0, ly1, u); rungs += c.ribbon([[x - 14, y], [x + 14, y - 1]], 4); }
    lad.p(rungs, C.wood);
    wallL.add(lad.out());

    /* ---------- the street and the crowd outside ---------- */
    const streetL = S.layer({ par: 0.56, sh: 4 });
    const sfn = c.wave(STREET, [3, 1.5], [700, 180]);
    streetL.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), C.sand).out());
    streetL.add(grass(c, { x0: -600, x1: 380, y: STREET, fn: sfn, n: 12, h: 12, color: C.olive }) + grass(c, { x0: 1300, x1: 2200, y: STREET, fn: sfn, n: 12, h: 12, color: C.olive }));
    const out = crowd(S, streetL, [
      { y: STREET + 4, s: 0.58, n: 9, x0: 420, x1: 980 },
      { y: STREET + 14, s: 0.63, n: 7, x0: 380, x1: 1060 },
    ]);
    // three are already in the street and hear the news
    const early = [out[1], out[5], out[10]].filter(Boolean);
    out.forEach((m, i) => { m.from = early.includes(m) ? m.x : m.x < 760 ? c.rr(-400, -120) : c.rr(1600, 1900); m.d = c.rr(0, 0.45); m.i = i; });
    // people pressed on the door steps
    const stepsP = [[1060, FLOOR + 4, 0.56], [1086, FLOOR + 30, 0.57], [1112, FLOOR + 56, 0.58], [1134, FLOOR + 82, 0.6]].map(([x, y, s], i) => ({ x, y, s, i, from: 1500 + i * 70, p: S.puppet(streetL.add(person(c, townsfolk(c)))), seed: c.rr(0, 9) }));
    const jS = S.puppet(streetL.add(person(c, { ...CAST.jesus })));
    const bangs = early.map((m) => ({ m, el: streetL.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40 })}</g>`) }));

    /* ---------- the four friends and the man on the mat ---------- */
    const frL = S.layer({ par: 0.56, sh: 5 });
    const FR = [
      townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather }),
      townsfolk(c, { man: true, robe: C.clayMantle, mantle: null, hairStyle: 'curly' }),
      townsfolk(c, { man: true, robe: C.ochreRobe, mantle: C.sageRobe }),
      townsfolk(c, { man: true, robe: C.roseRobe, mantle: null, belt: C.leather, hairStyle: 'wrap', veil: C.linen2 }),
    ];
    // 0,1 walk behind the mat; 2,3 in front of it
    const fr = FR.map((o, i) => ({ i, o, seed: c.rr(0, 9) }));
    fr.slice(0, 2).forEach((f) => { f.p = S.puppet(frL.add(person(c, f.o))); });
    const matOut = frL.add(`<g>${matWithMan(c)}</g>`);
    fr.slice(2).forEach((f) => { f.p = S.puppet(frL.add(person(c, f.o))); });
    const idea = frL.add(`<g>${speech(c, GLYPH.bang(c, C.teal), { w: 40, h: 40 })}</g>`);
    const noRoom = frL.add(`<g>${speech(c, GLYPH.q(c), { w: 40, h: 40, flip: true })}</g>`);
    const dustOut = [0, 1, 2, 3].map((i) => frL.add(`<g>${dust(c, 22, C.sand2)}</g>`));

    /* ---------- Jesus teaches: words fly out over the listeners ---------- */
    const wordL = S.layer({ par: 0.56, sh: 3 });
    const words = Array.from({ length: 9 }, (_, i) => ({ el: wordL.add(wordSlip(c, c.rr(26, 36))), i, to: [lerp(420, 1180, i / 8) + c.rr(-20, 20), i % 2 ? c.rr(380, 440) : c.rr(470, 520)], seed: c.rr(0, 6) }));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, S.portrait ? 1720 : 1330, 850, 200, C.sage, C.moss) +   // phone: out of the way of the pan to the right
       bush(c, 250, 860, 220, C.moss, C.sage) + bush(c, 120, 880, 160, C.sage));

    const cur = curtains(S);

    /* ---------- choreography ---------- */
    // where each friend carries the mat along the street (mat centre x)
    const carryX = [[4.0, 1560], [4.7, 1250], [5.2, 1190], [5.32, 1215], [5.62, 1235]];
    const offs = [-66, 62, -74, 70];
    // the mat's path: street → up the ladder → onto the roof → over the hole → down into the room
    const matKeys = [[5.62, [1235, STREET - 72]], [6.05, [1235, STREET - 72]], [6.2, [1195, 470]], [6.36, [1110, ROOF - 50]], [6.46, [1000, ROOF - 16]], [7.02, [1000, ROOF - 16]], [7.16, [MAT_X, ROOF - 30]], [7.22, [MAT_X, ROOF - 16]]];
    // friends on the roof: holding spots while digging and lowering
    const roofSpot = [HOLE0 - 36, HOLE1 + 30, HOLE0 - 70, HOLE1 + 66];

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      sk.blend(SKY, ['#d7e5de', '#f3e8cf', '#f9eedb'], seg(t, 1, 8));
      swing(sunEl, 1230, 160 - es(t, 0, 3) * 26, T, 1.1, 0.7);
      swing(cl1, 520 + Math.sin(T * 0.1) * 26, 150, T, 1.4, 0.6, 1);
      swing(cl2, 990 + Math.sin(T * 0.13 + 2) * 26, 205, T, 1.4, 0.8, 2);
      birds(T, 1);

      /* v1 — Jesus walks up the street and into the house; the neighbours hear */
      const jKeys = [[0.4, 150], [1.3, 1000]];
      const jx = kf(t, jKeys, (u) => u);
      const inDoor = es(t, 1.3, 1.36);
      const jInX = kf(t, [[1.36, 1010], [1.72, 800]], ease.out);
      const teach = es(t, 3.02, 3.25) * (1 - es(t, 4.4, 4.8));
      const lookUp = es(t, 6.55, 6.8);
      const toMan = es(t, 7.4, 7.8);
      jesus.set({
        x: inDoor < 1 ? 800 : jInX, y: FLOOR - 2, s: 0.74, o: inDoor, flip: t < 1.72,
        walk: t > 1.36 && t < 1.72 ? jInX * 0.05 : undefined,
        armF: 12 + teach * (55 + Math.sin(T * 1.6) * 22) + toMan * 40 + bump(t, 1.8, 2.6) * 30,
        armB: 8 + teach * (30 + Math.sin(T * 1.2 + 1) * 14) + toMan * 16,
        head: -lookUp * 16 * (1 - toMan) + toMan * 10, blink: blinkAt(T),
      });
      const stepUp = seg(t, 1.18, 1.3);
      jS.set({
        x: jx, y: STREET + 6 - stepUp * 70, s: 0.62, o: 1 - inDoor,
        walk: t > 0.4 && t < 1.3 ? jx * 0.055 : undefined, blink: blinkAt(T, 1),
        armF: bump(t, 0.95, 1.2) * 30,
      });

      far.forEach((f) => {
        const outK = es(t, 1.2 + f.i * 0.07, 1.5 + f.i * 0.07);
        const go = es(t, 2.0 + f.i * 0.05, 2.7 + f.i * 0.05);
        const x = f.x + f.dir * (outK * 18 + go * 160);
        f.p.set({ x, y: f.y, s: 0.28, flip: f.dir < 0, o: outK * (1 - go), walk: go > 0 && go < 1 ? x * 0.08 : undefined, armF: bump(t, 1.4, 2.0) * 90 });
      });
      bangs.forEach((b, i) => {
        const k = es(t, 1.15 + i * 0.1, 1.35 + i * 0.1, ease.back) * (1 - es(t, 1.9, 2.1));
        pose(b.el, { x: b.m.x + (b.m.x > 800 ? -24 : 24), y: b.m.y - 215 * b.m.s, s: k * 0.9, r: Math.sin(T * 2 + i) * 5, o: k > 0.02 ? 1 : 0 });
      });

      /* v2 — the crowd gathers inside and out */
      const listen = es(t, 3.05, 3.4);
      out.forEach((m) => {
        const pr = seg(t, 2.0 + m.d, 2.5 + m.d);
        const early_ = m.from === m.x;
        const x = lerp(m.from, m.x, ease.out(pr));
        const turn = early_ ? es(t, 1.1, 1.3) : 0;
        const press = bump(t, 5.08, 5.5) * (m.x > 900 ? 1 : 0);
        m.p.set({
          x: x - press * 8, y: m.y, s: m.s, flip: early_ ? t > 1.2 && t < 2.2 ? m.x > 800 : m.x > 800 : m.x > 800,
          walk: pr > 0 && pr < 1 ? x * 0.05 : undefined,
          armF: bump(t, 1.12, 1.9) * (early_ ? 70 : 0) + press * 80 + listen * (m.i % 4 === 0 ? 20 : 0) + lookUp * (m.i % 3 === 0 ? 70 : 0),
          head: -listen * 6 - lookUp * 10 + turn * 4, blink: blinkAt(T, m.seed),
        });
      });
      stepsP.forEach((m) => {
        const pr = seg(t, 2.1 + m.i * 0.08, 2.6 + m.i * 0.08);
        const x = lerp(m.from, m.x, ease.out(pr));
        const shove = m.i === 3 ? bump(t, 5.05, 5.5) : 0;
        m.p.set({ x: x + shove * 6, y: m.y, s: m.s, flip: true, walk: pr > 0 && pr < 1 ? x * 0.05 : undefined, armB: shove * 110, armF: shove * 60, head: -listen * 5 + shove * 8, blink: blinkAt(T, m.seed) });
      });
      IN.forEach((m) => {
        const pr = seg(t, 2.05 + m.d, 2.45 + m.d);
        const x = lerp(m.from, m.x, ease.out(pr));
        const room = es(t, 7.1, 7.4) * (m.x < 800 ? -1 : 1) * (m.pose ? 0 : 10);
        m.p.set({
          x: x + room, y: m.y, s: m.s, flip: pr < 1 ? m.from > m.x : m.flip, o: seg(t, 2.02 + m.d, 2.1 + m.d),
          walk: pr > 0 && pr < 1 && !m.pose ? x * 0.06 : undefined,
          head: -listen * 5 - lookUp * 18 + toMan * 12, armF: lookUp * (m.i % 2 ? 60 : 0) * (1 - toMan), blink: blinkAt(T, m.seed),
        });
      });

      // words fly from Jesus out to everybody
      const src = [790, 470];
      words.forEach((w) => {
        const k = ((T * 0.22 + w.i / words.length) % 1);
        const on = es(t, 3.05, 3.3) * (1 - es(t, 4.1, 4.5));
        const x = lerp(src[0], w.to[0], k), y = lerp(src[1], w.to[1], k) - Math.sin(k * PI) * 60;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.seed) * 12 + (w.to[0] - src[0]) * 0.02, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });

      /* v3–v4 — the four friends */
      const cx_ = kf(t, carryX);
      const walking = moving(t, carryX);
      const onRoof = t >= 6.0;
      fr.forEach((f) => {
        const i = f.i;
        let x, y, flip = true, walk, armF = 50, armB = 30, head = 0, o = 1;
        if (!onRoof) {
          x = cx_ + offs[i]; y = STREET + 8 + (i < 2 ? -6 : 4);
          walk = walking ? x * 0.05 + i : undefined;
          if (t > 5.62) { head = -14 * es(t, 5.62, 5.8); }
          if (t > 5.2 && t < 5.62) armF = 50 + bump(t, 5.2, 5.5) * 20;
        } else {
          // climb one after another, then take their places on the roof
          const t0 = 6.0 + i * 0.07, t1 = t0 + 0.24;
          const start = [1235 + offs[i], STREET + 8];
          const climbKeys = [[t0, start], [t0 + 0.04, [LAD[0][0] + 6, LAD[0][1] + 2]], [t1, [LAD[1][0], LAD[1][1] + 2]], [t1 + 0.12, [roofSpot[i] + (i < 2 ? 0 : 0), ROOF + 2]]];
          const digAt = [[HOLE0 + 40, HOLE1 - 36, HOLE0 - 20, HOLE1 + 20][i], ROOF + 2];
          [x, y] = kf(t, [...climbKeys, [6.42, digAt], [6.95, digAt], [7.1, [roofSpot[i], ROOF + 2]]]);
          const moveNow = (t > t0 && t < t1 + 0.12) || (t > 6.38 && t < 6.42) || (t > 6.95 && t < 7.1);
          walk = moveNow ? (x + y) * 0.06 : undefined;
          flip = t < t1 + 0.12 ? true : t < 6.95 ? digAt[0] > HOLE0 + 100 : roofSpot[i] > 800;
          const dig = bump(t, 6.42 + i * 0.03, 6.95);
          armF = t < t1 ? 150 : dig > 0 ? 40 + Math.max(0, Math.sin(t * 90 + i)) * 70 * Math.min(1, dig * 3) : 30;
          armB = t < t1 ? 120 : dig > 0 ? 20 + Math.max(0, Math.sin(t * 90 + i + 1.5)) * 50 : 20;
          if (t > 7.1) { armF = 28 + Math.sin(T * 1.4 + i) * 3; armB = 22; }
          head = t > 6.4 ? 18 : 0;
          f.lean = dig * 14 * (flip ? -1 : 1);
        }
        f.p.set({ x, y, s: 0.64, flip, walk, armF, armB, head, lean: f.lean || 0, o, blink: blinkAt(T, f.seed) });
      });

      // the mat outside (street → roof), then the one inside (over the hole → the floor)
      let mx, my;
      if (t < 6.0) { mx = cx_; my = STREET - 72 + (walking ? Math.abs(Math.sin(cx_ * 0.05)) * 2 : 0); }
      else [mx, my] = kf(t, matKeys);
      const swap = es(t, 7.2, 7.24);
      pose(matOut, { x: mx, y: my, o: (1 - swap) * seg(t, 3.9, 4.0) });
      const lower = es(t, 7.24, 7.78, ease.sine);
      const inY = lerp(ROOF - 16, FLOOR - 14, lower);
      pose(matIn, { x: MAT_X, y: inY, o: swap });
      // ropes from the friends' hands to the corners of the mat
      ropesIn.forEach((r, i) => {
        const f = fr[i];
        const [hx, hy] = hand(roofSpot[i], ROOF + 2, 0.64, roofSpot[i] > 800, 28);
        const ax = MAT_X + (i % 2 ? 1 : -1) * (MAT_W / 2 - (i < 2 ? 8 : 28)), ay = inY - 2;
        const dx = hx - ax, dy = hy - ay, L = Math.hypot(dx, dy);
        pose(r, { x: ax, y: ay, r: (Math.atan2(dx, -dy) * 180) / PI, sy: L / 100, o: swap * (1 - es(t, 7.85, 8)) });
      });
      fade(shaft, es(t, 6.7, 7.0) * 0.4);
      pose(idea, { x: 1250, y: STREET - 150, s: es(t, 5.62, 5.78, ease.back) * (1 - es(t, 5.95, 6.05)) * 0.9, o: t > 5.6 && t < 6.05 ? 1 : 0 });
      pose(noRoom, { x: 1128, y: FLOOR - 94, s: es(t, 5.18, 5.35, ease.back) * (1 - es(t, 5.62, 5.75)) * 0.9, o: t > 5.15 && t < 5.75 ? 1 : 0 });

      // the roof comes apart
      chunks.forEach((ch) => {
        const lift = es(t, ch.t0, ch.t0 + 0.2);
        const x = lerp(ch.cx, ch.to[0], lift), y = lerp(ROOF + 20, ch.to[1], lift) - Math.sin(lift * PI) * 50;
        pose(ch.el, { x, y, r: lift * ch.rot, s: 1 - lift * 0.25 });
      });
      dustOut.forEach((d, i) => {
        const k = seg(t, 6.45 + i * 0.1, 6.75 + i * 0.1);
        pose(d, { x: HOLE0 + 30 + i * 50, y: ROOF - 10 - k * 40, s: 0.6 + k * 1.2, o: bump(t, 6.45 + i * 0.1, 6.75 + i * 0.1) * 0.9 });
      });
      dustIn.forEach((d) => {
        const k = seg(t, 6.5 + d.i * 0.06, 7.0 + d.i * 0.06);
        pose(d.el, { x: d.x, y: CEIL + 10 + k * 150, s: 0.5 + k, o: bump(t, 6.5 + d.i * 0.06, 7.0 + d.i * 0.06) * 0.8 });
      });

      /* camera: the whole house → up to the roof → into the room */
      S.cam.z = 1 + es(t, 0.8, 1.8) * 0.04 + es(t, 3.9, 4.8) * 0.02 - es(t, 5.8, 6.3) * 0.04 + es(t, 7.05, 7.8) * 0.16;
      S.cam.y = es(t, 0.8, 1.8) * 20 - es(t, 5.8, 6.3) * 70 + es(t, 7.05, 7.8) * 90;
      // phone: pan further right so the four friends with the mat (x ≈ 1150–1320) are on screen
      const PAN = S.portrait ? 470 : 60;
      // phone: while the crowd presses at the door, lean right so the people on the steps are clear of the thread
      const STEP = S.portrait ? 100 : 0;
      S.cam.x = es(t, 1.8, 2.4) * STEP + es(t, 3.9, 4.6) * (PAN - STEP) - es(t, 6.3, 6.9) * (PAN - STEP) - es(t, 7.05, 7.8) * 20;
    };
  },
};
