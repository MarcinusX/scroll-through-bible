// Mk 5,38–40 — Jairus's house as a cut-away doll's house: in the front room mourners wail and flute players
// play; the child lies still in the inner room. Jesus comes in: "Why the uproar? The child is not dead but
// asleep" — they laugh at Him; He puts them all out, and goes in with the parents and the three.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, palm, olive, grass, bush } from '../../assets/nature.js';
import { oilLamp, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, moving, bubble, glyphTag, note, flute, bedFrame, blanket, lyingPerson, townsfolk, headAt, onFace, mouthO } from './lib.js';

const PI = Math.PI;
const STREET = 704, FLOOR = 630, CEIL = 356, ROOF = 330;
const HX0 = 300, HX1 = 1250, CUT0 = 420, CUT1 = 1196;
const IW = 868;                         // inner wall (x) between the front room and the child's room
const DOOR = 360;                       // the house door (in the left pier)
const BED = 1062;

export default {
  id: 'm5-mourners',
  beats: [
    { v: 38, text: 'Tak przyszli do domu przełożonego synagogi.' },
    { v: 38, cont: true, text: 'Wobec zamieszania, płaczu i głośnego zawodzenia,' },
    { v: 39, text: 'wszedł i rzekł do nich: «Czemu robicie zgiełk i płaczecie?' },
    { v: 39, cont: true, text: 'Dziecko nie umarło, tylko śpi».' },
    { v: 40, text: 'I wyśmiewali Go.' },
    { v: 40, cont: true, text: 'Lecz On odsunął wszystkich,' },
    { v: 40, cont: true, text: 'wziął z sobą tylko ojca, matkę dziecka oraz tych, którzy z Nim byli, i wszedł tam, gdzie dziecko leżało.' },
  ],
  cam: { x: [-160, 220], y: [-40, 70], z: [0.96, 1.28] },
  build(S) {
    const c = S.c;
    const SKY = ['#cbd2d6', '#efd9bd', '#f3cfa4'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42, { disc: '#efb46a', inner: '#f3c88a' }), { x: 1260, y: 190, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 560, y: 150, len: 620 });

    /* ---------- hills & town behind ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
    const hl = S.layer({ par: 0.16, sh: 3 });
    const hw = hillsWith(c, { y: 450, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    hl.add(hw.markup + town(c, { x: 150, y: hw.fn(150) + 14, n: 7, spread: 380, sc: 0.55 }) + town(c, { x: 1500, y: hw.fn(1500) + 14, n: 6, spread: 360, sc: 0.55 }));

    /* ---------- inside: back wall, floor, the child's room ---------- */
    const backL = S.layer({ par: 0.5, sh: 3 });
    const bw = sheet();
    bw.p(c.cut(c.rect(CUT0 - 10, CEIL - 6, CUT1 - CUT0 + 20, FLOOR - CEIL + 10), 0.5, 12), mix(C.plaster2, C.sand2, 0.3));
    bw.p(c.cut(c.rect(IW + 10, CEIL - 6, CUT1 - IW, FLOOR - CEIL + 10), 0.5, 12), mix(C.plaster2, C.blushVeil, 0.3));
    let beams = '';
    for (let x = CUT0 + 14; x < CUT1; x += 50) beams += c.cut(c.rect(x, CEIL - 4, 14, 24), 0.3, 5);
    bw.p(c.cut(c.rect(CUT0 - 10, CEIL - 6, CUT1 - CUT0 + 20, 14), 0.4, 10), C.wood2);
    bw.p(beams, C.wood);
    // a window & a shelf in the front room, a niche with a lamp in the child's room
    bw.p(c.cut([[520, 480], [520, 440], ...c.arc(544, 440, 24, 22, PI, 2 * PI, 8), [568, 480]], 0.4, 5), '#d9d6c6');
    bw.p(c.ribbon([[516, 482], [572, 482]], 6), C.wood2);
    bw.p(c.cut(c.rect(640, 454, 120, 6), 0.3, 6), C.wood2);
    bw.p(c.cut([[654, 454], [650, 436], [660, 426], [668, 436], [664, 454]], 0.3, 4) + c.cut(c.arc(700, 454, 14, 12, PI, 2 * PI, 6), 0.3, 4) + c.cut([[734, 454], [732, 432], [744, 426], [748, 454]], 0.3, 4), C.pot);
    bw.p(c.cut([[1120, 500], [1120, 468], ...c.arc(1142, 468, 22, 20, PI, 2 * PI, 8), [1164, 500]], 0.4, 5), shade(C.plaster2, -0.18));
    bw.p(c.cut([[CUT0 - 10, FLOOR - 16], [CUT1 + 10, FLOOR - 16], [CUT1 + 10, FLOOR + 4], [CUT0 - 10, FLOOR + 4]], 0.6, 12), mix(C.clay, C.sand2, 0.55));
    // a rug in the child's room
    bw.p(c.cut([[IW + 40, FLOOR - 14], [CUT1 - 20, FLOOR - 14], [CUT1 - 10, FLOOR - 4], [IW + 30, FLOOR - 4]], 0.4, 8), mix(C.terracotta, C.roseRobe, 0.6));
    backL.add(bw.out());
    const lampEl = backL.add(`<g transform="translate(1136 498) scale(.7)">${oilLamp(c)}</g>`);
    // the inner wall with its doorway and a curtain
    const iw = sheet();
    iw.p(c.cut([[IW - 4, CEIL + 8], [IW + 18, CEIL + 8], [IW + 18, FLOOR - 196], [IW - 4, FLOOR - 196]], 0.4, 6), C.plaster);
    iw.p(c.cut([[IW - 6, FLOOR - 200], [IW + 20, FLOOR - 200], [IW + 20, FLOOR - 190], [IW - 6, FLOOR - 190]], 0.3, 6), C.wood2);
    backL.add(iw.out());

    /* ---------- the child ---------- */
    const bedL = S.layer({ par: 0.5, sh: 4 });
    bedL.add(`<g transform="translate(${BED} ${FLOOR})">${bedFrame(c, 210)}<g transform="translate(0 -54)">${lyingPerson(c, LOOK.girl, 0.6)}</g>${blanket(c, 210)}</g>`);
    const zs = ['z', 'z', 'Z'].map((z, i) => bedL.add(`<g>${paperLabel(z, { size: 16 + i * 4 })}</g>`));

    /* ---------- people in the house ---------- */
    const inL = S.layer({ par: 0.5, sh: 4 });
    const wail = (o) => onFace(person(c, o), mouthO(c, 3));
    const MOURN = [
      { x: 700, k: 'w', o: { ...LOOK.mourner } },
      { x: 770, k: 'w', o: { ...LOOK.mourner, robe: mix(C.plumRobe, C.stone2, 0.5), veil: mix(C.storm, C.stone2, 0.5) } },
      { x: 630, k: 'f', o: townsfolk(c, { man: true, robe: C.stone2, mantle: null, holdF: flute(c) }) },
      { x: 838, k: 'w', o: { ...LOOK.mourner, robe: mix(C.tealRobe, C.stone2, 0.5) } },
      { x: 570, k: 'f', o: townsfolk(c, { man: true, robe: C.wheatRobe, mantle: C.stone2, holdF: flute(c) }) },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(inL.add(m.k === 'w' ? wail(m.o) : person(c, m.o))) }));
    const mother = S.puppet(inL.add(person(c, { ...LOOK.mother, pose: 'kneel' })));
    const motherS = S.puppet(inL.add(person(c, { ...LOOK.mother })));
    const THREE = [CAST.john, CAST.james, CAST.peter].map((cast, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(inL.add(person(c, { ...cast }))) }));
    const jairus = S.puppet(inL.add(person(c, { ...LOOK.jairus })));
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus })));
    const notes = Array.from({ length: 6 }, (_, i) => ({ i, el: inL.add(`<g>${note(c, C.inkSoft)}</g>`) }));

    /* ---------- the front wall, roof, curtain; the street ---------- */
    const wallL = S.layer({ par: 0.5, sh: 6 });
    const ws = sheet();
    const eL = [], eT = [], eR = [];
    for (let y = FLOOR + 2; y > CEIL + 22; y -= 22) eL.push([CUT0 + c.rr(-6, 6), y]);
    for (let x = CUT0; x < CUT1; x += 26) eT.push([x, CEIL + 20 + c.rr(-5, 5)]);
    for (let y = CEIL + 22; y < FLOOR + 2; y += 22) eR.push([CUT1 + c.rr(-6, 6), y]);
    ws.p(c.cut([[HX0, CEIL], [HX1, CEIL], [HX1, FLOOR + 2], [CUT1, FLOOR + 2], ...eR.reverse(), ...eT.reverse(), ...eL.reverse(), [CUT0, FLOOR + 2], [HX0, FLOOR + 2]], 1.2, 9), C.plaster);
    ws.p(c.cut([[CUT0 - 2, CEIL + 16], [CUT0 + 10, CEIL + 22], [CUT0 + 10, FLOOR], [CUT0 - 2, FLOOR]], 0.6, 8) + c.cut([[CUT1 + 2, CEIL + 16], [CUT1 - 10, CEIL + 22], [CUT1 - 10, FLOOR], [CUT1 + 2, FLOOR]], 0.6, 8), C.plaster2);
    // the door in the left pier
    ws.p(c.cut([[DOOR - 26, FLOOR + 2], [DOOR - 26, FLOOR - 120], ...c.arc(DOOR, FLOOR - 120, 26, 24, PI, 2 * PI, 8), [DOOR + 26, FLOOR + 2]], 0.4, 5), C.soilDark);
    ws.p(c.ribbon([[DOOR - 30, FLOOR + 2], [DOOR - 30, FLOOR - 118]], 6) + c.ribbon([[DOOR + 30, FLOOR + 2], [DOOR + 30, FLOOR - 118]], 6) + c.ribbon(c.arc(DOOR, FLOOR - 120, 30, 28, PI, 2 * PI, 10), 6), C.wood2);
    // terrace & steps
    ws.p(c.cut([[HX0 - 10, FLOOR], [HX1 + 10, FLOOR], [HX1 + 10, STREET + 30], [HX0 - 10, STREET + 30]], 0.8, 10), C.stone2);
    let blocks = '';
    for (let r = 0; r < 3; r++) { const y = FLOOR + 12 + r * 26; blocks += c.ribbon([[HX0 - 8, y], [HX1 + 8, y + c.rr(-2, 2)]], 1.4); for (let x = HX0 + (r % 2) * 30; x < HX1; x += c.rr(50, 80)) blocks += c.ribbon([[x, y], [x + c.rr(-2, 2), y + 24]], 1.2); }
    ws.x(blocks, shade(C.stone2, -0.14), 'opacity=".7"');
    let st = '';
    for (let i = 0; i < 4; i++) st += c.cut(c.rect(HX0 - 40 - (3 - i) * 0 - i * 20, FLOOR + i * 19, 70, 10), 0.3, 5);
    ws.p(st, C.stone);
    // roof slab
    ws.p(c.cut([[HX0 - 16, ROOF + 4], [HX1 + 16, ROOF + 4], [HX1 + 16, CEIL + 2], [HX0 - 16, CEIL + 2]], 0.6, 8), C.wood3);
    ws.p(c.cut([[HX0 - 18, ROOF], [HX1 + 18, ROOF], [HX1 + 18, ROOF + 16], [HX0 - 18, ROOF + 16]], 1.1, 6), mix(C.clay, C.sand2, 0.4));
    let ends = '';
    for (let x = HX0; x < HX1; x += 48) ends += c.cut(c.circ(x, CEIL - 5, 5.5, 10), 0.3, 3);
    ws.p(ends, C.wood2);
    wallL.add(ws.out());
    const curtain = wallL.add(`<g>${sheet().p(c.cut([[0, 0], [30, 0], [34, 190], [4, 192]], 0.6, 8), mix(C.mauve, C.stone, 0.3)).x(c.ribbon([[10, 4], [12, 186]], 2) + c.ribbon([[22, 4], [24, 186]], 2), shade(C.mauve, -0.12), 'opacity=".6"').out()}</g>`);

    // street, a bush and a palm
    const streetL = S.layer({ par: 0.56, sh: 4 });
    const sfn = c.wave(STREET, [3, 1.5], [700, 180]);
    streetL.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), C.sand).out());
    streetL.add(grass(c, { x0: -600, x1: 2200, y: STREET, fn: sfn, n: 22, h: 12, color: C.olive }) + palm(c, 1330, STREET + 4, 200) + bush(c, 180, STREET + 6, 110, C.sage, C.moss));
    // the arrivals outside, and the mourners once they are put out
    const outL = S.layer({ par: 0.56, sh: 5 });
    const jOut = S.puppet(outL.add(person(c, { ...CAST.jesus })));
    const jaOut = S.puppet(outL.add(person(c, { ...LOOK.jairus })));
    const threeOut = [CAST.john, CAST.james, CAST.peter].map((cast, i) => ({ i, p: S.puppet(outL.add(person(c, { ...cast }))) }));
    const outside = MOURN.map((m) => ({ m, p: S.puppet(outL.add(m.k === 'w' ? person(c, m.o) : person(c, m.o))) }));

    /* ---------- words ---------- */
    const wL = S.layer({ par: 0.58, sh: 4 });
    const cries = [0, 1, 2].map((i) => wL.add(`<g>${glyphTag(c, i === 1 ? tr('ach!', 'oh!') : tr('oj!', 'ah!'), { size: 16, ink: C.inkSoft, fill: mix(C.stone, C.cream, 0.5) })}</g>`));
    const why = wL.add(`<g>${bubble(c, [tr('Czemu robicie zgiełk', 'Why do you make an uproar'), tr('i płaczecie?', 'and weep?')], { size: 19, dir: -1 })}</g>`);
    const sleep = wL.add(`<g>${bubble(c, [tr('Dziecko nie umarło,', 'The child is not dead,'), tr('tylko śpi.', 'but is asleep.')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const has = [0, 1, 2, 3].map((i) => wL.add(`<g>${glyphTag(c, tr('ha!', 'ha!'), { size: 17, ink: C.terracotta })}</g>`));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#c3bfcf', '#eccdb1', '#efc091'], seg(t, 0, 7));
      swing(sunEl, 1260, 190 + es(t, 0, 7) * 60, T, 1.1, 0.7);
      swing(cl1, 560 + Math.sin(T * 0.1) * 24, 150, T, 1.4, 0.6, 1);

      /* v38a — along the street to the door */
      const arr = [[0, -260], [0.9, DOOR - 20]];
      const ax = kf(t, arr, (u) => u);
      const inside = es(t, 2.02, 2.08);
      const walking = t < 0.9;
      const climb = (x) => x > HX0 - 110 ? Math.min(1, (x - (HX0 - 110)) / 70) : 0;
      jOut.set({ x: ax, y: STREET - climb(ax) * 74, s: 0.9, o: 1 - inside, walk: walking ? ax * 0.06 : undefined, armF: 12 + bump(t, 1.1, 2) * 30, head: -bump(t, 1.1, 2) * 4, blink: blinkAt(T) });
      jaOut.set({ x: ax + 70, y: STREET - climb(ax + 70) * 74, s: 0.9, o: 1 - es(t, 1.9, 1.96), walk: walking ? ax * 0.06 + 1 : undefined, armF: 30, blink: blinkAt(T, 5) });
      threeOut.forEach((d) => { const x = ax - 70 - d.i * 56; d.p.set({ x, y: STREET - climb(x) * 74, s: 0.88, o: 1 - es(t, 2.1 + d.i * 0.05, 2.16 + d.i * 0.05), walk: walking || (t > 2 && t < 2.3) ? x * 0.06 + d.i : undefined, blink: blinkAt(T, d.i + 1) }); });

      /* v38b — wailing and flutes */
      const noise = es(t, 1.02, 1.3) * (1 - es(t, 2.2, 2.5));
      const laugh = es(t, 4.02, 4.25) * (1 - es(t, 4.9, 5.1));
      const outK = (m) => es(t, 5.05 + m.i * 0.1, 5.7 + m.i * 0.1, (u) => u);
      MOURN.forEach((m) => {
        const o = outK(m);
        const x = lerp(m.x, DOOR + 10, o);
        const sway = noise * Math.sin(T * 5 + m.seed) * 1;
        m.p.set({
          x, y: FLOOR, s: 0.84, flip: o > 0 ? true : m.x < 700, o: 1 - seg(t, 5.55 + m.i * 0.1, 5.7 + m.i * 0.1),
          walk: o > 0 && o < 1 ? x * 0.07 : undefined,
          armF: m.k === 'f' ? 70 + noise * 6 * Math.sin(T * 9 + m.i) : 20 + noise * (140 + sway * 16) + laugh * 60,
          armB: m.k === 'f' ? 60 : 10 + noise * (120 + sway * 20) + laugh * 20,
          head: m.k === 'f' ? -4 : noise * -14 + sway * 4 - laugh * 16, lean: m.k === 'f' ? noise * Math.sin(T * 3 + m.i) * 3 : noise * 4 - laugh * 6, blink: blinkAt(T, m.seed),
        });
      });
      outside.forEach((q) => {
        const m = q.m;
        const k = es(t, 5.6 + m.i * 0.1, 6.3 + m.i * 0.1, (u) => u);
        const x = lerp(DOOR - 40, -220 - m.i * 40, k);
        q.p.set({ x, y: STREET - climb(x) * 74, s: 0.9, flip: true, o: seg(t, 5.58 + m.i * 0.1, 5.64 + m.i * 0.1), walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: 20, head: 6, blink: blinkAt(T, m.seed) });
      });
      cries.forEach((g, i) => {
        const m = MOURN[[0, 1, 3][i]];
        const Tn = noise > 0 ? T : 0;
        const k = noise * Math.max(0, Math.sin(Tn * 2.2 + i * 2));
        pose(g, { x: m.x + 26, y: FLOOR - 196 - Math.sin(Tn * 2 + i) * 6, s: 0.6 + k * 0.5, r: Math.sin(Tn * 4 + i) * 8, o: k });
      });
      notes.forEach((n) => {
        const m = MOURN[n.i % 2 ? 2 : 4];
        const Tn = noise > 0 ? T : 0;
        const k = ((Tn * 0.5 + n.i / 6) % 1);
        pose(n.el, { x: m.x + 40 + k * 30 + Math.sin(k * 8) * 6, y: FLOOR - 130 - k * 90, r: Math.sin(Tn * 3 + n.i) * 14, s: 1.1, o: noise * Math.sin(k * PI) });
      });
      has.forEach((h, i) => {
        const m = MOURN[i];
        const k = es(t, 4.05 + i * 0.07, 4.25 + i * 0.07, ease.back) * (1 - es(t, 4.85, 5.0));
        pose(h, { x: m.x + 20, y: FLOOR - 200 - (i % 2) * 20, s: k, r: k > 0.02 ? Math.sin(T * 6 + i) * 10 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* the mother: weeping by the doorway, then goes in with them */
      const toBed = es(t, 6.1, 6.7);
      const mStand = es(t, 5.9, 5.96);
      mother.set({ x: 820, y: FLOOR, s: 0.84, flip: false, o: 1 - mStand, armF: 150 - noise * 10, armB: 120, lean: 18, head: 16, blink: blinkAt(T, 3) });
      const mx = lerp(840, 960, toBed);
      motherS.set({ x: mx, y: FLOOR, s: 0.84, flip: false, o: mStand, walk: toBed > 0 && toBed < 1 ? mx * 0.07 : undefined, armF: 40 + toBed * 20, armB: 30, head: 8, blink: blinkAt(T, 3) });

      /* v39 — He comes in and speaks */
      const jKeys = [[2.02, DOOR + 30], [2.4, 610], [6.1, 610], [6.8, 1150]];
      const jx = kf(t, jKeys);
      const speak = es(t, 2.2, 2.5) * (1 - es(t, 3.9, 4.1));
      const shoo = es(t, 5.02, 5.3) * (1 - es(t, 5.8, 6.0));
      jesus.set({
        x: jx, y: FLOOR, s: 0.86, flip: t > 6.75 || (t > 5 && t < 5.9 ? true : false), o: inside,
        walk: moving(t, jKeys) ? jx * 0.07 : undefined,
        armF: 14 + speak * 60 + shoo * 70 + es(t, 6.7, 7) * 40, armB: 8 + speak * 30 + shoo * 60, head: -laugh * 4, blink: blinkAt(T),
      });
      const jaKeys = [[2.0, DOOR + 30], [2.4, 540], [6.1, 540], [6.8, 1010]];
      const jax = kf(t, jaKeys);
      jairus.set({ x: jax, y: FLOOR, s: 0.86, o: es(t, 1.96, 2.02), walk: moving(t, jaKeys) ? jax * 0.07 : undefined, armF: 20 + toBed * 30, head: 6, blink: blinkAt(T, 5) });
      THREE.forEach((d) => {
        const keys = [[2.1 + d.i * 0.05, DOOR + 30], [2.5 + d.i * 0.05, 440 + d.i * 50], [6.2, 440 + d.i * 50], [6.9, 900 + d.i * 44]];
        const x = kf(t, keys);
        d.p.set({ x, y: FLOOR, s: 0.84, o: es(t, 2.1 + d.i * 0.05, 2.16 + d.i * 0.05), walk: moving(t, keys) ? x * 0.07 + d.i : undefined, armF: 10 + laugh * 0, head: 4, blink: blinkAt(T, d.i + 1) });
      });
      pose(curtain, { x: IW - 8, y: FLOOR - 190, sx: 1 - es(t, 6.0, 6.3) * 0.6 });

      /* the bubbles */
      const [hx, hy] = headAt(jx, FLOOR, 0.86, false);
      const b1 = es(t, 2.25, 2.45, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(why, { x: hx + 10, y: hy - 30, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const b2 = es(t, 3.05, 3.25, ease.back) * (1 - es(t, 3.9, 4.0));
      pose(sleep, { x: hx + 10, y: hy - 30, s: b2, o: b2 > 0.02 ? 1 : 0 });
      zs.forEach((z, i) => {
        const zo = es(t, 3.2, 3.5) * (1 - es(t, 6.4, 6.8));
        const k = zo > 0 ? ((T * 0.35 + i / 3) % 1) : 0.5;
        pose(z, { x: BED + 70 + i * 12 + k * 16, y: FLOOR - 110 - k * 60 - i * 8, o: es(t, 3.2, 3.5) * (1 - es(t, 6.4, 6.8)) * Math.sin(k * PI) });
      });

      /* camera: the street → into the front room → through to the child's room */
      S.cam.x = -120 + es(t, 0.6, 1.6) * 60 + es(t, 2.9, 3.4) * 60 - es(t, 3.9, 4.3) * 40 - es(t, 5.0, 5.5) * 30 + es(t, 6.1, 6.9) * 260;
      S.cam.y = 10 + es(t, 0.6, 1.6) * 20;
      S.cam.z = 1.0 + es(t, 0.6, 1.6) * 0.12 - es(t, 5.0, 5.5) * 0.06 + es(t, 6.1, 6.9) * 0.14;
    };
  },
};
