// Mk 6,2–6a — the Sabbath in the synagogue of Nazareth: wonder turns to "isn't this the carpenter?",
// the family is named one by one, arms fold, and only a few sick people are healed.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  kf, hand, headAt, speech, thought, GLYPH, spark, heart, wordSlip, scrollOpen, sabbathTag, carpenterPlate, disc, labelTag,
  LOOK, man, woman, DY,
} from './lib.js';

const PI = Math.PI;
const BACK = 604, FRONT = 692, FLOOR = 650;
const JX = 800;

function arch(c, x, y, w, h) { return [[x - w / 2, y + h], [x - w / 2, y + w / 2], ...c.arc(x, y + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x + w / 2, y + h]]; }
function crutch(c) {
  return sheet().p(c.ribbon([[0, 0], [0, -118]], 5) + c.ribbon([[-14, -118], [14, -118]], 6), C.wood2).out();
}
/** icon: a little town on a hill */
function iconTown(c) {
  const s = sheet().p(c.cut([[-34, 18], [-20, 0], [0, -8], [22, 0], [34, 18]], 0.4, 5), C.hillNear);
  let h = '';
  [[-18, 2], [-2, -6], [12, 2]].forEach(([x, y]) => { h += c.cut(c.rect(x, y - 12, 12, 12), 0.2, 3); });
  return s.p(h, C.plaster).out();
}
function iconFamily(c) {
  let d = '', b = '';
  [[-20, 4, 9], [0, -2, 10], [20, 4, 9]].forEach(([x, y, r]) => { d += c.cut(c.circ(x, y - 12, r * 0.8, 10), 0.2, 3); b += c.cut([[x - r, y + 18], [x - r * 0.8, y], [x + r * 0.8, y], [x + r, y + 18]], 0.3, 3); });
  return sheet().p(b, C.dustyBlue).p(d, C.skin2).out();
}
function iconHouse(c) {
  return sheet().p(c.cut(c.rect(-22, -14, 44, 32), 0.3, 4), C.plaster).p(c.cut([[-26, -14], [26, -14], [26, -20], [-26, -20]], 0.2, 4), C.roof).p(c.cut([[-6, 18], [-6, 2], [6, 2], [6, 18]], 0.2, 3), C.wood2).out();
}

export default {
  id: 'm6-synagogue',
  beats: [
    { v: 2, text: 'Gdy nadszedł szabat, zaczął nauczać w synagodze;' },
    { v: 2, cont: true, text: 'a wielu, przysłuchując się, pytało ze zdziwieniem: «Skąd On to ma?' },
    { v: 2, cont: true, text: 'I co za mądrość, która Mu jest dana? I takie cuda dzieją się przez Jego ręce!' },
    { v: 3, text: 'Czy nie jest to cieśla, syn Maryi, a brat Jakuba, Józefa, Judy i Szymona?' },
    { v: 3, cont: true, text: 'Czyż nie żyją tu u nas także Jego siostry?»' },
    { v: 3, cont: true, text: 'I powątpiewali o Nim.' },
    { v: 4 },
    { v: 5 },
    { v: 6, text: 'Dziwił się też ich niedowiarstwu.' },
  ],
  cam: { x: [-240, 180], y: [-40, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, ['#bcd6d6', '#e2ecdf', '#f3ead3']);

    /* ---------- the wall with its windows and the ark of the scrolls ---------- */
    const wall = S.layer({ par: 0.2, sh: 3 });
    const W = sheet();
    const wins = [440, 1160].map((x) => arch(c, x, 170, 100, 150));
    W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 660], [-1200, 660]], 1, 30) + wins.map((w) => c.hole(w, 0.5, 6)).join(''), mix(C.plaster, C.sand, 0.15));
    let blocks = '';
    for (let y = -200; y < 620; y += 46) for (let x = -1200 + (Math.round(y / 46) % 2 ? 60 : 0); x < 2800; x += 120) blocks += c.cut(c.rect(x + c.rr(0, 6), y + c.rr(0, 4), c.rr(90, 110), 38), 0.6, 10);
    W.x(blocks, C.plaster2, 'opacity=".4"');
    W.p([440, 1160].map((x) => c.ribbon([[x - 56, 322], [x + 56, 322]], 9) + c.ribbon([[x, 170], [x, 320]], 4)).join(''), C.wood2);
    // beams
    let beams = '';
    for (let x = -600; x < 2400; x += 150) beams += c.cut(c.rect(x, 60, 22, 34), 0.3, 5);
    W.p(c.cut([[-1200, 40], [2800, 40], [2800, 64], [-1200, 64]], 0.5, 20) + beams, C.wood2);
    // the ark
    W.p(c.cut([[700, 612], [700, 420], ...c.arc(800, 420, 100, 64, PI, 2 * PI, 14), [900, 612]], 0.6, 8), C.wood);
    W.p(c.cut([[720, 606], [720, 430], ...c.arc(800, 430, 80, 50, PI, 2 * PI, 12), [880, 606]], 0.5, 8), C.dustyBlue);
    let pleat = '';
    for (let x = 732; x < 874; x += 15) pleat += c.ribbon([[x, 446], [x + c.rr(-2, 2), 604]], 3);
    W.x(pleat, shade(C.dustyBlue, -0.18), 'opacity=".6"');
    W.p(c.cut(c.star(800, 392, 15, 6.5, 6, 0), 0.3, 3), C.sun);
    W.p(c.cut([[-1200, 600], [2800, 600], [2800, 660], [-1200, 660]], 0.8, 14), C.plaster2);
    wall.add(W.out());

    // lamps on chains
    const lampsL = S.layer({ par: 0.26, sh: 4 });
    const flames = [];
    [560, 1040].forEach((x, i) => {
      const y = 220 + i * 18;
      const s = sheet().p(c.cut([[-24, 0], [24, 0], [14, 12], [-14, 12]], 0.4, 4), C.sun).p(c.cut(c.ell(0, 0, 26, 6, 14), 0.3, 4), shade(C.sun, -0.2));
      lampsL.add(`<g transform="translate(${x} ${y})"><path d="M0 -1400V0M-18 0L0 -36L18 0" stroke="${C.inkSoft}" stroke-width="1.4" fill="none" opacity=".6"/><circle cy="-10" r="60" fill="url(#warm-glow)" opacity=".6"/>${s.out()}</g>`);
      [-12, 0, 12].forEach((dx) => { const el = lampsL.add(`<g transform="translate(${x + dx} ${y - 2})"><path d="M0 0C-5 -5 -4 -12 0 -20C4 -12 5 -5 0 0Z" fill="${C.lampFlame}"/></g>`); flames.push({ el, x: x + dx, y: y - 2, i: flames.length }); });
    });

    /* ---------- hanging signs (they come down from the flies) ---------- */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const sabbath = hanging(flies, sabbathTag(c, tr('Szabat', 'Sabbath')), { x: 0, y: 0, len: 600 });
    const wisdom = hanging(flies, disc(c, `<g transform="scale(.62)">${scrollOpen(c, 90, 60)}</g><circle r="40" fill="url(#warm-glow)" opacity=".5"/>`, { r: 46 }) + `<g transform="translate(0 70)">${labelTag(tr('mądrość', 'wisdom'), 18)}</g>`, { x: 0, y: 0, len: 600 });
    const works = hanging(flies, disc(c, `<g transform="translate(-10 4)">${spark(c, 12)}</g><g transform="translate(14 -10)">${spark(c, 9)}</g><g transform="translate(6 18)">${spark(c, 7)}</g>`, { r: 46 }) + `<g transform="translate(0 70)">${labelTag(tr('cuda', 'mighty works'), 18)}</g>`, { x: 0, y: 0, len: 600 });
    const carp = hanging(flies, carpenterPlate(c, 50) + `<g transform="translate(0 76)">${labelTag(tr('cieśla', 'the carpenter'), 18)}</g>`, { x: 0, y: 0, len: 600 });
    const three = [iconTown(c), iconFamily(c), iconHouse(c)].map((ic, i) => hanging(flies, disc(c, ic, { r: 40 }) + `<g transform="translate(0 62)">${labelTag([tr('ojczyzna', 'country'), tr('krewni', 'relatives'), tr('dom', 'house')][i], 17)}</g>`, { x: 0, y: 0, len: 600 }));

    /* ---------- floor, benches, the congregation ---------- */
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

    /* ---------- Jesus, the lectern, the front benches ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const lect = sheet();
    lect.p(c.cut([[706, FLOOR], [712, 566], [728, 566], [734, FLOOR]], 0.3, 5), C.wood2);
    lect.p(c.cut([[686, 560], [756, 574], [754, 586], [684, 572]], 0.4, 5), C.wood);
    lect.p(c.cut([[690, 554], [752, 566], [750, 574], [688, 562]], 0.3, 4), C.parchment);
    act.add(lect.out());
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(6 6) rotate(-60) scale(.5)">${scrollOpen(c, 70, 50)}</g>` })));
    const jesusFree = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const bench = sheet();
    [[-900, 700], [900, 2600]].forEach(([x0, x1]) => {
      bench.p(c.cut([[x0, FRONT - 6], [x1, FRONT - 6], [x1, FRONT + 64], [x0, FRONT + 64]], 0.6, 12), C.stone);
      bench.p(c.cut([[x0, FRONT - 12], [x1, FRONT - 12], [x1, FRONT - 2], [x0, FRONT - 2]], 0.4, 12), shade(C.stone, 0.2));
    });
    act.add(bench.out());
    // the family on the left front bench (Simon, Judah, Joses, James, Mary)
    const FAM = [
      { o: LOOK.bSimon, x: 410, name: tr('Szymon', 'Simon') }, { o: LOOK.bJudas, x: 478, name: tr('Juda', 'Judah') },
      { o: LOOK.bJoses, x: 546, name: tr('Józef', 'Joses') }, { o: LOOK.bJames, x: 614, name: tr('Jakub', 'James') },
      { o: LOOK.mary, x: 676, name: tr('Maryja', 'Mary') },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...f.o, pose: 'sit' }))) }));
    // the right front bench: two sisters, then neighbours
    const RIGHT = [
      { o: LOOK.sister1, x: 944, sis: true }, { o: LOOK.sister2, x: 1004, sis: true },
      { o: man(c, { robe: C.ochreRobe, mantle: C.stone, hairStyle: 'wrap', veil: C.linen2 }), x: 1078 },
      { o: man(c, { robe: C.tealRobe, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair }), x: 1146 },
      { o: woman(c), x: 1210 },
    ].map((f, i) => ({ ...f, i, y: FRONT - 6, s: 0.8, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...f.o, pose: 'sit' }))) }));
    // the few sick who come in by the door
    const SICK = [
      { o: man(c, { robe: C.stone2, mantle: null }), x: 930, crutch: true },
      { o: woman(c, { robe: C.mauve, veil: C.stone, hair: C.greyHair }), x: 1000, bent: true },
      { o: man(c, { robe: C.wheatRobe, mantle: null }), x: 1070, arm: true },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, m.o))) }));
    const cr = act.add(`<g>${crutch(c)}</g>`);

    /* ---------- bubbles, tags, sparks ---------- */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const words = Array.from({ length: 8 }, (_, i) => ({ el: fx.add(wordSlip(c, c.rr(26, 34))), i, to: [lerp(420, 1180, i / 7) + c.rr(-20, 20), i % 2 ? c.rr(430, 470) : c.rr(500, 530)], seed: c.rr(0, 6) }));
    const asks = [back[1], back[6], RIGHT[S.portrait ? 2 : 3], back[3]].map(   // phone: a questioner clear of the thread
      (m, i) => ({ m, i, el: fx.add(`<g>${speech(c, GLYPH.q(c), { w: 42, h: 38, flip: (m.x ?? 0) > 800 })}</g>`) }));
    const handSparks = [0, 1, 2].map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    const famTags = FAM.map((f) => hanging(fx, labelTag(f.name, 17), { x: 0, y: 0, len: 500 }));
    const sisTag = hanging(fx, labelTag(tr('siostry', 'sisters'), 18), { x: 0, y: 0, len: 500 });
    const frowns = [back[0], back[4], back[7], RIGHT[2], RIGHT[3], back[9]].map((m, i) => ({ m, i, el: fx.add(`<g>${speech(c, GLYPH.frown(c), { w: 44, h: 42, flip: m.x > 800 })}</g>`) }));
    const heal = SICK.map(() => fx.add(`<g>${spark(c, 13)}</g>`));
    const stone = fx.add(`<g>${thought(c, `<g transform="scale(.9)">${heart(c, 14, C.rock2)}</g>`, { w: 62, h: 50 })}</g>`);

    /* ---------- the chill of unbelief, the columns in front ---------- */
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

      /* v2a — the Sabbath comes; he stands up with the scroll and teaches */
      const sb = es(t, -0.3, 0.35, ease.back) * (1 - es(t, 1.0, 1.3));
      pose(sabbath, { x: 800, y: lerp(-500, 140, sb), r: Math.sin(T * 1.1) * 2, o: sb > 0.01 ? 1 : 0 });
      const teach = es(t, 0.15, 0.4);
      const withScroll = 1 - es(t, 1.9, 1.96);
      const doubt = es(t, 5.05, 5.45);
      const marvel = es(t, 8.05, 8.4);
      const toSick = es(t, 7.1, 7.35) * (1 - es(t, 7.9, 8.1));
      const jx = JX + toSick * 40;
      const speak = es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.1));
      jesus.set({ x: jx, y: FLOOR, s: 1.0, o: withScroll, armF: 40 + teach * 30 + Math.sin(T * 1.4) * 6 * teach, armB: 10 + teach * 20, head: -2, blink: blinkAt(T) });
      const layIdx = Math.min(2, Math.max(0, Math.floor((t - 7.2) / 0.22)));
      const lay = t > 7.15 && t < 7.95 ? 1 : 0;
      jesusFree.set({
        x: jx, y: FLOOR, s: 1.0, o: 1 - withScroll,
        armF: 20 + bump(t, 2.0, 2.9) * 50 + speak * 70 + lay * (60 - layIdx * 6) + marvel * 40,
        armB: 10 + bump(t, 2.0, 2.9) * 70 + speak * 130 + marvel * 60,
        head: -speak * 6 + lay * 10 + marvel * (4 + Math.sin(T * 1.2) * 4), blink: blinkAt(T),
      });
      words.forEach((w) => {
        const k = ((T * 0.22 + w.i / words.length) % 1);
        const on = es(t, 0.3, 0.55) * (1 - es(t, 1.0, 1.3));
        const x = lerp(840, w.to[0], k), y = lerp(520, w.to[1], k) - Math.sin(k * PI) * 50;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.seed) * 12, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });

      /* the congregation: listen → wonder → name names → fold arms */
      const turnAway = (m) => doubt * (m.x < 800 ? -1 : 1);
      back.forEach((m, i) => {
        const ask = bump(t, 1.05 + (i % 4) * 0.08, 2.9);
        const cross = doubt * (1 - es(t, 8.9, 9.2) * 0);
        const away = doubt > 0.5 && i % 4 !== 2;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800 ? !away : away, armF: ask * (i % 2 ? 50 : 20) + cross * 28, armB: cross * 34 + ask * (i % 3 === 0 ? 90 : 0), head: -ask * 6 * (i % 2 ? 1 : -1) - cross * 10, blink: blinkAt(T, m.seed) });
      });
      const namedAt = (i) => 3.1 + (4 - i) * 0.13;
      FAM.forEach((f) => {
        const nm = bump(t, namedAt(f.i), namedAt(f.i) + 0.9);
        f.p.set({ x: f.x, y: FRONT - 6, s: 0.8, flip: false, armF: nm * 30, armB: f.i === 4 ? 20 : 0, head: -nm * 6 + (f.i === 4 ? es(t, 5.1, 5.5) * 6 : 0), blink: blinkAt(T, f.seed) });
      });
      RIGHT.forEach((f) => {
        const sis = f.sis ? bump(t, 4.1 + f.i * 0.1, 4.95) : 0;
        const point = f.i === 3 ? bump(t, 3.05, 4.9) : 0;
        const cross = f.sis ? 0 : doubt;
        f.p.set({ x: f.x, y: FRONT - 6, s: 0.8, flip: !(cross > 0.5), armF: sis * 30 + point * 95 + cross * 28, armB: cross * 34, head: -sis * 6 - cross * 10, blink: blinkAt(T, f.seed) });
      });
      asks.forEach((a) => {
        const k = es(t, 1.1 + a.i * 0.1, 1.3 + a.i * 0.1, ease.back) * (1 - es(t, 2.85, 3.0));
        const [hx, hy] = headAt(a.m.x, a.m.y, a.m.s, a.m.x > 800, DY.sit);
        pose(a.el, { x: hx + (a.m.x > 800 ? -18 : 18), y: hy - 22, s: k * 0.9, r: Math.sin(T * 2 + a.i) * 5, o: k > 0.02 ? 1 : 0 });
      });

      /* v2c — wisdom given him, mighty works by his hands */
      const wz = es(t, 2.0, 2.3, ease.back) * (1 - es(t, 3.0, 3.25));
      const wk = es(t, 2.25, 2.55, ease.back) * (1 - es(t, 3.0, 3.25));
      pose(wisdom, { x: 560, y: lerp(-500, 250, wz), r: Math.sin(T * 1.2) * 2, o: wz > 0.01 ? 1 : 0 });
      pose(works, { x: 1040, y: lerp(-500, 250, wk), r: Math.sin(T * 1.2 + 1) * 2, o: wk > 0.01 ? 1 : 0 });
      handSparks.forEach((sp, i) => {
        const on = bump(t, 2.3 + i * 0.06, 3.0);
        const [hx, hy] = hand(jx, FLOOR, 1, false, 20 + bump(t, 2.0, 2.9) * 50);
        pose(sp, { x: hx + Math.cos(T * 2 + i * 2.1) * 20, y: hy + Math.sin(T * 2 + i * 2.1) * 20, s: on * 0.9, r: T * 40, o: on > 0.02 ? 1 : 0 });
      });

      /* v3 — "isn't this the carpenter, Mary's son…?" */
      const cp = es(t, 3.0, 3.3, ease.back) * (1 - es(t, 5.05, 5.3));
      pose(carp, { x: 700, y: lerp(-500, 260, cp), r: Math.sin(T * 1.1) * 2.5, o: cp > 0.01 ? 1 : 0 });
      FAM.forEach((f, i) => {
        const k = es(t, namedAt(f.i), namedAt(f.i) + 0.25, ease.back) * (1 - es(t, 5.05, 5.3));
        const [hx, hy] = headAt(f.x, FRONT - 6, 0.8, false, DY.sit);
        pose(famTags[i], { x: hx, y: lerp(-400, hy - 50 - (i % 2) * 14, k), r: Math.sin(T * 1.3 + i) * 3, o: k > 0.01 ? 1 : 0 });
      });
      const st = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 5.05, 5.3));
      pose(sisTag, { x: 974, y: lerp(-400, 520, st), r: Math.sin(T * 1.2) * 3, o: st > 0.01 ? 1 : 0 });

      /* v3c — offended: arms fold, frowns, the room cools */
      frowns.forEach((f) => {
        const k = es(t, 5.1 + f.i * 0.07, 5.3 + f.i * 0.07, ease.back) * (1 - es(t, 6.0, 6.2));
        const [hx, hy] = headAt(f.m.x, f.m.y, f.m.s, f.m.x > 800, DY.sit);
        pose(f.el, { x: hx + (f.m.x > 800 ? -16 : 16), y: hy - 22, s: k * 0.85, o: k > 0.02 ? 1 : 0 });
      });
      tint.fade(doubt * 0.14 + marvel * 0.06 - es(t, 7.2, 7.8) * 0.05);

      /* v4 — a prophet without honour: in his country, among his relatives, in his house */
      three.forEach((el, i) => {
        const k = es(t, 6.15 + i * 0.2, 6.4 + i * 0.2, ease.back) * (1 - es(t, 6.95, 7.15));
        pose(el, { x: [560, 800, 1040][i], y: lerp(-500, 230 + (i === 1 ? -20 : 0), k), r: Math.sin(T * 1.1 + i) * 2.5, o: k > 0.01 ? 1 : 0 });
      });

      /* v5 — only a few sick: he lays his hands on them and heals them */
      SICK.forEach((m) => {
        const inK = es(t, 7.0 + m.i * 0.05, 7.25 + m.i * 0.05);
        const healed = es(t, 7.22 + m.i * 0.22, 7.36 + m.i * 0.22);
        const x = lerp(1400 + m.i * 60, m.x, inK);
        const mv = inK > 0 && inK < 1;
        m.p.set({
          x, y: FLOOR + 40 + m.i * 4, s: 0.86, flip: true, o: es(t, 6.95, 7.05),
          walk: mv ? x * 0.05 : undefined, lean: m.bent ? -18 * (1 - healed) : m.crutch ? -6 * (1 - healed) : 0,
          armF: m.arm ? 10 + healed * 140 : m.crutch ? 10 + healed * 30 : healed * 50,
          armB: m.crutch ? 20 * (1 - healed) + healed * 150 : healed * 30 + (m.arm ? 0 : 0), head: healed * -6, blink: blinkAt(T, m.seed),
        });
        const hk = bump(t, 7.22 + m.i * 0.22, 7.7 + m.i * 0.22);
        const [hx, hy] = headAt(x, FLOOR + 40 + m.i * 4, 0.86, true);
        pose(heal[m.i], { x: hx, y: hy - 40, s: hk, r: T * 30, o: hk > 0.02 ? 1 : 0 });
      });
      const cfall = es(t, 7.3, 7.45, ease.in);
      pose(cr, { x: lerp(1400, SICK[0].x, es(t, 7.0, 7.25)) - 34 + cfall * 10, y: FLOOR + 42, r: -cfall * 80, o: es(t, 6.95, 7.05) });

      /* v6a — he marvels at their unbelief */
      const sk = es(t, 8.2, 8.5, ease.back);
      pose(stone, { x: jx + 18, y: FLOOR - 190, s: sk * 0.95, r: Math.sin(T * 1.3) * 3, o: sk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [2.9, 0], [3.2, S.portrait ? -230 : -120], [3.95, S.portrait ? -230 : -120],   // phone: Simon and his name in sight
         [4.25, 130], [4.9, 130], [5.2, 0], [6.9, 0], [7.2, 80], [7.95, 80], [8.2, 0]]);
      S.cam.z = kf(t, [[0, 1.14], [0.9, 1.1], [2.9, 1.1], [3.2, 1.2], [4.9, 1.2], [5.2, 1.08], [6.9, 1.08], [7.2, 1.16], [7.95, 1.16], [8.3, 1.2]]);
      S.cam.y = kf(t, [[0, 40], [3.2, 50], [4.9, 50], [5.2, 30], [8.3, 50]]);
    };
  },
};
