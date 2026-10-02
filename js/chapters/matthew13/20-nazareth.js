// Mt 13,54–58 — the synagogue of His home town, Nazareth. A painted plate of the little town on its hill comes
// down; Jesus stands at the lectern with the scroll and teaches, words flying out over the benches, and the people
// are astonished: where did He get this wisdom (a scroll plate) and these mighty works (a plate of sparks)? Isn't
// this the carpenter's son (the carpenter's tools)? His mother Mary and His brothers James, Joses, Simon and Judas
// sit on the front bench, named one by one; His sisters on the other side. Arms fold, frowns rise and the room goes
// cold. "A prophet is not without honour except in his own country and in his own house" — two plates, the town and
// the house. And He did not do many mighty works there: only one sick man by the door is healed, a single spark.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  L6, man, woman, carpenterPlate, disc, labelTag, scrollOpen, wordSlip, speech, thought, GLYPH, spark, stoneHeart, headAt, hand, hangAt, kf, tr, DY, PI,
} from './lib.js';

const BACK = 604, FRONT = 692, FLOOR = 650, JX = 800;

function arch(c, x, y, w, h) { return [[x - w / 2, y + h], [x - w / 2, y + w / 2], ...c.arc(x, y + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x + w / 2, y + h]]; }
function iconTown(c) {
  const s = sheet().p(c.cut([[-40, 24], [-24, 0], [0, -14], [26, 0], [40, 24]], 0.4, 5), C.hillNear);
  let h = '';
  [[-22, 4], [-4, -8], [12, 2], [-12, 14], [6, 14]].forEach(([x, y]) => { h += c.cut(c.rect(x, y - 12, 13, 12), 0.2, 3); });
  return s.p(h, C.plaster).out();
}
function iconHouse(c) {
  return sheet().p(c.cut(c.rect(-24, -14, 48, 34), 0.3, 4), C.plaster).p(c.cut([[-28, -14], [28, -14], [28, -21], [-28, -21]], 0.2, 4), C.roof).p(c.cut([[-7, 20], [-7, 2], [7, 2], [7, 20]], 0.2, 3), C.wood2).out();
}
function crutch(c) { return sheet().p(c.ribbon([[0, 0], [0, -118]], 5) + c.ribbon([[-14, -118], [14, -118]], 6), C.wood2).out(); }

export default {
  id: 'mt13-nazareth',
  beats: [
    { v: 54, text: 'Przyszedłszy do swego miasta rodzinnego, nauczał ich w synagodze, tak że byli zdumieni i pytali:' },
    { v: 54, cont: true, text: '«Skąd u Niego ta mądrość i cuda?' },
    { v: 55, text: 'Czyż nie jest On synem cieśli?' },
    { v: 55, cont: true, text: 'Czy Jego Matce nie jest na imię Mariam, a Jego braciom Jakub, Józef, Szymon i Juda?' },
    { v: 56, text: 'Także Jego siostry czy nie żyją wszystkie u nas?' },
    { v: 56, cont: true, text: 'Skądże więc ma to wszystko?»' },
    { v: 57, text: 'I powątpiewali o Nim.' },
    { v: 57, cont: true, text: 'A Jezus rzekł do nich: «Tylko w swojej ojczyźnie i w swoim domu może być prorok lekceważony».' },
    { v: 58 },
  ],
  cam: { x: [-240, 180], y: [-40, 70], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, ['#bcd6d6', '#e2ecdf', '#f3ead3']);

    /* the wall, windows, the ark of the scrolls */
    const wall = S.layer({ par: 0.2, sh: 3 });
    const W = sheet();
    const wins = [440, 1160].map((x) => arch(c, x, 170, 100, 150));
    W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 660], [-1200, 660]], 1, 30) + wins.map((w) => c.hole(w, 0.5, 6)).join(''), mix(C.plaster, C.sand, 0.15));
    let blocks = '';
    for (let y = -200; y < 620; y += 46) for (let x = -1200 + (Math.round(y / 46) % 2 ? 60 : 0); x < 2800; x += 120) blocks += c.cut(c.rect(x + c.rr(0, 6), y + c.rr(0, 4), c.rr(90, 110), 38), 0.6, 10);
    W.x(blocks, C.plaster2, 'opacity=".4"');
    W.p([440, 1160].map((x) => c.ribbon([[x - 56, 322], [x + 56, 322]], 9) + c.ribbon([[x, 170], [x, 320]], 4)).join(''), C.wood2);
    let beams = '';
    for (let x = -600; x < 2400; x += 150) beams += c.cut(c.rect(x, 60, 22, 34), 0.3, 5);
    W.p(c.cut([[-1200, 40], [2800, 40], [2800, 64], [-1200, 64]], 0.5, 20) + beams, C.wood2);
    W.p(c.cut([[700, 612], [700, 420], ...c.arc(800, 420, 100, 64, PI, 2 * PI, 14), [900, 612]], 0.6, 8), C.wood);
    W.p(c.cut([[720, 606], [720, 430], ...c.arc(800, 430, 80, 50, PI, 2 * PI, 12), [880, 606]], 0.5, 8), C.dustyBlue);
    let pleat = '';
    for (let x = 732; x < 874; x += 15) pleat += c.ribbon([[x, 446], [x + c.rr(-2, 2), 604]], 3);
    W.x(pleat, shade(C.dustyBlue, -0.18), 'opacity=".6"');
    W.p(c.cut(c.star(800, 392, 15, 6.5, 6, 0), 0.3, 3), C.sun);
    W.p(c.cut([[-1200, 600], [2800, 600], [2800, 660], [-1200, 660]], 0.8, 14), C.plaster2);
    wall.add(W.out());
    const lampsL = S.layer({ par: 0.26, sh: 4 });
    const flames = [];
    [560, 1040].forEach((x, i) => {
      const y = 220 + i * 18;
      const s = sheet().p(c.cut([[-24, 0], [24, 0], [14, 12], [-14, 12]], 0.4, 4), C.sun).p(c.cut(c.ell(0, 0, 26, 6, 14), 0.3, 4), shade(C.sun, -0.2));
      lampsL.add(`<g transform="translate(${x} ${y})"><path d="M0 -1400V0M-18 0L0 -36L18 0" stroke="${C.inkSoft}" stroke-width="1.4" fill="none" opacity=".6"/><circle cy="-10" r="60" fill="url(#warm-glow)" opacity=".6"/>${s.out()}</g>`);
      [-12, 0, 12].forEach((dx) => { const el = lampsL.add(`<g transform="translate(${x + dx} ${y - 2})"><path d="M0 0C-5 -5 -4 -12 0 -20C4 -12 5 -5 0 0Z" fill="${C.lampFlame}"/></g>`); flames.push({ el, x: x + dx, y: y - 2, i: flames.length }); });
    });

    /* hanging plates: the home town, wisdom, mighty works, the carpenter, country and house */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const townP = hanging(flies, disc(c, `<g transform="scale(1.3)">${iconTown(c)}</g>`, { r: 56 }) + `<g transform="translate(0 80)">${labelTag(tr('Nazaret', 'Nazareth'), 20)}</g>`, { x: 0, y: 0, len: 700 });
    const wisdom = hanging(flies, disc(c, `<g transform="scale(.62)">${scrollOpen(c, 90, 60)}</g><circle r="40" fill="url(#warm-glow)" opacity=".5"/>`, { r: 46 }) + `<g transform="translate(0 70)">${labelTag(tr('mądrość', 'wisdom'), 18)}</g>`, { x: 0, y: 0, len: 700 });
    const works = hanging(flies, disc(c, `<g transform="translate(-10 4)">${spark(c, 12)}</g><g transform="translate(14 -10)">${spark(c, 9)}</g><g transform="translate(6 18)">${spark(c, 7)}</g>`, { r: 46 }) + `<g transform="translate(0 70)">${labelTag(tr('cuda', 'mighty works'), 18)}</g>`, { x: 0, y: 0, len: 700 });
    const carp = hanging(flies, carpenterPlate(c, 50) + `<g transform="translate(0 76)">${labelTag(tr('syn cieśli', 'the carpenter’s son'), 18)}</g>`, { x: 0, y: 0, len: 700 });
    const two = [iconTown(c), iconHouse(c)].map((ic, i) => hanging(flies, disc(c, ic, { r: 42 }) + `<g transform="translate(0 64)">${labelTag([tr('ojczyzna', 'his own country'), tr('dom', 'his own house')][i], 17)}</g>`, { x: 0, y: 0, len: 700 }));

    /* the floor and the back benches */
    const floor = S.layer({ par: 0.45, sh: 3 });
    const F = sheet();
    F.p(c.cut([[-1200, 600], [2800, 600], [2800, 1700], [-1200, 1700]], 0.8, 30), mix(C.stone, C.sand, 0.4));
    let tiles = '';
    for (let y = 640; y < 1100; y += 40) for (let x = -600 + (Math.round(y / 40) % 2) * 40; x < 2200; x += 80) tiles += c.poly([[x, y - 12], [x + 14, y], [x, y + 12], [x - 14, y]]);
    F.x(tiles, shade(C.stone2, -0.06), 'opacity=".45"');
    [[-900, 670], [930, 2600]].forEach(([x0, x1]) => {
      F.p(c.cut([[x0, BACK - 8], [x1, BACK - 8], [x1, BACK + 60], [x0, BACK + 60]], 0.6, 12), C.stone2);
      F.p(c.cut([[x0, BACK - 14], [x1, BACK - 14], [x1, BACK - 4], [x0, BACK - 4]], 0.4, 12), shade(C.stone2, 0.18));
    });
    floor.add(F.out());
    const backL = S.layer({ par: 0.45, sh: 4 });
    const back = crowd(S, backL, [{ y: BACK - 8, s: 0.72, n: 5, x0: 380, x1: 660, pose: 'sit' }, { y: BACK - 8, s: 0.72, n: 5, x0: 940, x1: 1220, pose: 'sit' }]);

    /* Jesus at the lectern, the front benches with His family */
    const act = S.layer({ par: 0.55, sh: 5 });
    const lect = sheet();
    lect.p(c.cut([[706, FLOOR], [712, 566], [728, 566], [734, FLOOR]], 0.3, 5), C.wood2);
    lect.p(c.cut([[686, 560], [756, 574], [754, 586], [684, 572]], 0.4, 5), C.wood);
    lect.p(c.cut([[690, 554], [752, 566], [750, 574], [688, 562]], 0.3, 4), C.parchment);
    act.add(lect.out());
    const jScroll = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(6 6) rotate(-60) scale(.5)">${scrollOpen(c, 70, 50)}</g>` })));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const bench = sheet();
    [[-900, 700], [900, 2600]].forEach(([x0, x1]) => {
      bench.p(c.cut([[x0, FRONT - 6], [x1, FRONT - 6], [x1, FRONT + 64], [x0, FRONT + 64]], 0.6, 12), C.stone);
      bench.p(c.cut([[x0, FRONT - 12], [x1, FRONT - 12], [x1, FRONT - 2], [x0, FRONT - 2]], 0.4, 12), shade(C.stone, 0.2));
    });
    act.add(bench.out());
    // Matthew's order: Mary, then James, Joses, Simon and Judas
    const FAM = [
      { o: L6.bJudas, x: 410, name: tr('Juda', 'Judas') }, { o: L6.bSimon, x: 478, name: tr('Szymon', 'Simon') },
      { o: L6.bJoses, x: 546, name: tr('Józef', 'Joses') }, { o: L6.bJames, x: 614, name: tr('Jakub', 'James') },
      { o: L6.mary, x: 676, name: tr('Mariam', 'Mary') },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...f.o, pose: 'sit' }))) }));
    const RIGHT = [
      { o: L6.sister1, x: 944, sis: true }, { o: L6.sister2, x: 1004, sis: true },
      { o: man(c, { robe: C.ochreRobe, mantle: C.stone, hairStyle: 'wrap', veil: C.linen2 }), x: 1078 },
      { o: man(c, { robe: C.tealRobe, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair }), x: 1146 },
      { o: woman(c), x: 1210 },
    ].map((f, i) => ({ ...f, i, y: FRONT - 6, s: 0.8, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...f.o, pose: 'sit' }))) }));
    const SICK = man(c, { robe: C.stone2, mantle: null });
    const sick = S.puppet(act.add(person(c, SICK)));
    const cr = act.add(`<g>${crutch(c)}</g>`);

    /* bubbles, name tags, sparks */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const words = Array.from({ length: 8 }, (_, i) => ({ el: fx.add(wordSlip(c, c.rr(26, 34))), i, to: [lerp(420, 1180, i / 7) + c.rr(-20, 20), i % 2 ? c.rr(430, 470) : c.rr(500, 530)], seed: c.rr(0, 6) }));
    const wows = [back[1], back[6], RIGHT[3], back[3], back[8]].map((m, i) => ({ m, i, el: fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 38, flip: (m.x ?? 0) > 800 })}</g>`) }));
    const asks = [back[2], back[7], RIGHT[2], back[4]].map((m, i) => ({ m, i, el: fx.add(`<g>${speech(c, GLYPH.q(c), { w: 42, h: 38, flip: (m.x ?? 0) > 800 })}</g>`) }));
    const famTags = FAM.map((f) => hanging(fx, labelTag(f.name, 17), { x: 0, y: 0, len: 500 }));
    const sisTag = hanging(fx, labelTag(tr('siostry', 'sisters'), 18), { x: 0, y: 0, len: 500 });
    const frowns = [back[0], back[4], back[7], RIGHT[2], RIGHT[3], back[9]].map((m, i) => ({ m, i, el: fx.add(`<g>${speech(c, GLYPH.frown(c), { w: 44, h: 42, flip: m.x > 800 })}</g>`) }));
    const heal = fx.add(`<g>${spark(c, 14)}</g>`);
    const stone = fx.add(`<g>${thought(c, `<g transform="scale(.9)">${stoneHeart(c, 16)}</g>`, { w: 62, h: 50 })}</g>`);

    /* the chill of unbelief, the columns in front */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#6c7898"/>`);
    const fg = S.layer({ par: 0.9, sh: 8 });
    const colm = (x) => { const s = sheet(); s.p(c.cut(c.rect(x - 60, -1400, 120, 2600), 0.8, 20), C.stone2); s.p(c.cut(c.rect(x - 76, 900, 152, 40), 0.6, 10) + c.cut(c.rect(x - 70, 40, 140, 30), 0.6, 10), shade(C.stone2, -0.1)); s.x(c.ribbon([[x - 30, 80], [x - 30, 880]], 5) + c.ribbon([[x + 18, 80], [x + 18, 880]], 5), shade(C.stone2, -0.15), 'opacity=".5"'); return s.out(); };
    fg.add(colm(90) + colm(1510));
    // phone: the ceiling is a beam, not a sheet filling the top of the tall screen
    fg.add(sheet().p(c.cut([[-1200, S.portrait ? -16 : -1400], [2800, S.portrait ? -16 : -1400], [2800, 50], [-1200, 62]], 0.8, 16), C.wood2).out());

    return (t, time) => {
      const T = time;
      flames.forEach((f) => { const k = 1 + Math.sin(T * 11 + f.i * 1.7) * 0.1; pose(f.el, { x: f.x, y: f.y, sx: 1 / k, sy: k, r: Math.sin(T * 4 + f.i) * 5 }); });

      /* v54a — in His home town, teaching in the synagogue; they are astonished */
      const tp = es(t, -0.2, 0.25, ease.back) * (1 - es(t, 0.88, 1.05));
      hangAt(townP, 800, lerp(-500, 250, tp), T, 1.3, 0.8);
      const teach = es(t, 0.3, 0.5);
      const doubt = es(t, 6.05, 6.4);
      const speak = es(t, 7.05, 7.3) * (1 - es(t, 7.85, 8.05));
      const withScroll = 1 - es(t, 0.95, 1.0);
      jScroll.set({ x: JX, y: FLOOR, s: 1.0, o: withScroll, armF: 40 + teach * 30 + Math.sin(T * 1.4) * 6 * teach, armB: 10 + teach * 20, head: -2, blink: blinkAt(T) });
      const lay = es(t, 8.1, 8.3) * (1 - es(t, 8.85, 9));
      jesus.set({
        x: JX + lay * 40, y: FLOOR, s: 1.0, o: 1 - withScroll,
        armF: 20 + bump(t, 1.0, 1.9) * 50 + speak * 70 + lay * 60, armB: 10 + bump(t, 1.0, 1.9) * 70 + speak * 130,
        head: -speak * 6 + lay * 10 + doubt * (1 - speak) * 6, blink: blinkAt(T),
      });
      words.forEach((w) => {
        const k = ((T * 0.22 + w.i / words.length) % 1);
        const on = es(t, 0.35, 0.55) * (1 - es(t, 0.95, 1.1));
        const x = lerp(840, w.to[0], k), y = lerp(520, w.to[1], k) - Math.sin(k * PI) * 50;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.seed) * 12, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });
      wows.forEach((a) => {
        const k = es(t, 0.55 + a.i * 0.06, 0.72 + a.i * 0.06, ease.back) * (1 - es(t, 0.95, 1.08));
        const [hx, hy] = headAt(a.m.x, a.m.y, a.m.s, a.m.x > 800, DY.sit);
        pose(a.el, { x: hx + (a.m.x > 800 ? -16 : 16), y: hy - 22, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* the congregation */
      back.forEach((m, i) => {
        const amaze = bump(t, 0.5, 1.95);
        const away = doubt > 0.5 && i % 4 !== 2;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800 ? !away : away, armF: amaze * (i % 2 ? 60 : 20) + doubt * 28, armB: doubt * 34 + amaze * (i % 3 === 0 ? 100 : 0), head: -amaze * 6 - doubt * 10, blink: blinkAt(T, m.seed) });
      });
      asks.forEach((a) => {
        const k = Math.max(es(t, 1.1 + a.i * 0.08, 1.3 + a.i * 0.08, ease.back) * (1 - es(t, 1.9, 2.05)), es(t, 5.1 + a.i * 0.06, 5.3 + a.i * 0.06, ease.back) * (1 - es(t, 5.9, 6.05)));
        const [hx, hy] = headAt(a.m.x, a.m.y, a.m.s, a.m.x > 800, DY.sit);
        pose(a.el, { x: hx + (a.m.x > 800 ? -18 : 18), y: hy - 22, s: k * 0.9, r: Math.sin(T * 2 + a.i) * 5, o: k > 0.02 ? 1 : 0 });
      });

      /* v54b — wisdom and mighty works */
      const wz = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.95, 2.2));
      const wk = es(t, 1.25, 1.55, ease.back) * (1 - es(t, 1.95, 2.2));
      hangAt(wisdom, 560, lerp(-500, 250, wz), T, 1.2, 0.8);
      hangAt(works, 1040, lerp(-500, 250, wk), T, 1.2, 0.8, 1);

      /* v55a — the carpenter's son */
      const cp = es(t, 2.02, 2.3, ease.back) * (1 - es(t, 2.95, 3.2));
      hangAt(carp, 800, lerp(-500, 250, cp), T, 1.4, 0.8, 2);
      /* v55b — Mary, and James, Joses, Simon and Judas */
      const namedAt = (i) => 3.1 + (4 - i) * 0.13;
      FAM.forEach((f) => {
        const nm = bump(t, namedAt(f.i), namedAt(f.i) + 0.9);
        f.p.set({ x: f.x, y: FRONT - 6, s: 0.8, flip: false, armF: nm * 30, armB: f.i === 4 ? 20 : 0, head: -nm * 6 + (f.i === 4 ? es(t, 6.1, 6.5) * 6 : 0), blink: blinkAt(T, f.seed) });
        const k = es(t, namedAt(f.i), namedAt(f.i) + 0.25, ease.back) * (1 - es(t, 5.0, 5.25));
        const [hx, hy] = headAt(f.x, FRONT - 6, 0.8, false, DY.sit);
        hangAt(famTags[f.i], hx, lerp(-400, hy - 50 - (f.i % 2) * 14, k), T, 3, 1.3, f.i);
      });
      /* v56a — His sisters */
      RIGHT.forEach((f) => {
        const sis = f.sis ? bump(t, 4.05 + f.i * 0.1, 4.95) : 0;
        const point = f.i === 3 ? bump(t, 2.05, 3.9) : 0;
        const cross = f.sis ? 0 : doubt;
        f.p.set({ x: f.x, y: f.y, s: f.s, flip: !(cross > 0.5), armF: sis * 30 + point * 95 + cross * 28, armB: cross * 34, head: -sis * 6 - cross * 10, blink: blinkAt(T, f.seed) });
      });
      const st = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 5.0, 5.25));
      hangAt(sisTag, 974, lerp(-400, 520, st), T, 3, 1.3, 7);

      /* v57a — they took offence: arms fold, frowns, the room goes cold */
      frowns.forEach((f) => {
        const k = es(t, 6.1 + f.i * 0.07, 6.3 + f.i * 0.07, ease.back) * (1 - es(t, 7.0, 7.2));
        const [hx, hy] = headAt(f.m.x, f.m.y, f.m.s, f.m.x > 800, DY.sit);
        pose(f.el, { x: hx + (f.m.x > 800 ? -16 : 16), y: hy - 22, s: k * 0.85, o: k > 0.02 ? 1 : 0 });
      });
      tint.fade(doubt * 0.16 + es(t, 8.1, 8.6) * 0.04);

      /* v57b — a prophet without honour in his country and his house */
      two.forEach((el, i) => {
        const k = es(t, 7.15 + i * 0.2, 7.4 + i * 0.2, ease.back) * (1 - es(t, 7.95, 8.15));
        hangAt(el, [620, 980][i], lerp(-500, 240, k), T, 1.3, 0.8, i);
      });

      /* v58 — not many mighty works: a single man healed by the door */
      const inK = es(t, 7.95, 8.2);
      const healed = es(t, 8.35, 8.5);
      const sx = lerp(1400, 900, inK);
      sick.set({ x: sx, y: FLOOR + 44, s: 0.9, flip: true, o: es(t, 7.9, 8.0), walk: inK > 0 && inK < 1 ? sx * 0.05 : undefined, lean: -8 * (1 - healed), armF: 10 + healed * 30, armB: 20 * (1 - healed) + healed * 150, head: -healed * 6, blink: blinkAt(T, 3) });
      const cfall = es(t, 8.42, 8.56, ease.in);
      pose(cr, { x: sx - 34 + cfall * 10, y: FLOOR + 46, r: -cfall * 80, o: es(t, 7.9, 8.0) });
      const hk = es(t, 8.35, 8.55, ease.back) * (1 + Math.sin(T * 3) * 0.08);
      const [hx, hy] = headAt(900, FLOOR + 44, 0.9, true);
      pose(heal, { x: hx, y: hy - 40, s: hk * 1.2, r: T * 30, o: hk > 0.02 ? 1 : 0 });
      const sk = es(t, 8.5, 8.7, ease.back);
      const [shx, shy] = headAt(RIGHT[3].x, RIGHT[3].y, RIGHT[3].s, true, DY.sit);
      pose(stone, { x: shx - 6, y: shy - 22, s: sk * 0.9, r: Math.sin(T * 1.3) * 3, o: sk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [2.9, 0], [3.2, S.portrait ? -230 : -120], [3.95, S.portrait ? -230 : -120],   // phone: Judas and his name in sight
       [4.25, 130], [4.9, 130], [5.2, 0], [7.9, 0], [8.2, 60]]);
      S.cam.z = kf(t, [[0, 1.12], [0.9, 1.08], [2.9, 1.08], [3.2, 1.2], [4.9, 1.2], [5.2, 1.06], [7.9, 1.06], [8.2, 1.08]]);
      S.cam.y = kf(t, [[0, 30], [3.2, 50], [4.9, 50], [5.2, 30], [7.9, 30], [8.2, -40]]);
    };
  },
};
