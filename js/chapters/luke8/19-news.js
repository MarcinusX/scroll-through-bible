// Łk 8,49–53 — while He is still speaking, a man comes running out of Jairus' house: "Your daughter is dead; do not
// trouble the Teacher any more." Jairus sinks to his knees. Jesus lays a hand on him: "Do not be afraid; only
// believe, and she will be saved." At the house He lets no one go in with Him but Peter, James and John and the
// girl's father and mother — a raised hand stops the crowd in the street. Everyone is weeping and wailing for her;
// "Do not weep; she is not dead but asleep" — through the window the girl lies quietly in a soft light. And they
// laugh at Him, knowing that she was dead.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { streetSet, RULER, L5, MESSENGER, knot, mourners, bubble, headAt, hand, kf, girlOnBed, sickGirlIcon, DAY, tr, PI } from './lib.js';

const FEET = 722, JX = 760, DOOR = 1110;

/** Jairus' house: two storeys of plaster, an arched door, a window with the girl's room behind (origin world) */
function jairHouse(c) {
  const s = sheet();
  s.p(c.cut(c.rect(930, 360, 420, FEET - 14 - 360), 0.6, 10), mix(C.plaster, C.sand, 0.12));
  s.p(c.cut(c.rect(916, 346, 448, 18), 0.4, 8), C.plaster2);
  let bl = '';
  for (let y = 380; y < FEET - 30; y += 34) for (let x = 940 + ((y / 34) % 2) * 26; x < 1340; x += 60) bl += c.cut(c.rect(x, y, 50, 26), 0.3, 5);
  s.x(bl, C.plaster2, 'opacity=".4"');
  s.p(c.cut([[DOOR - 44, FEET - 12], [DOOR - 44, 560], ...c.arc(DOOR, 560, 44, 40, PI, 2 * PI, 10), [DOOR + 44, FEET - 12]], 0.4, 6), C.soilDark);
  s.p(c.ribbon([[DOOR - 52, FEET - 12], [DOOR - 52, 558]], 8) + c.ribbon([[DOOR + 52, FEET - 12], [DOOR + 52, 558]], 8) + c.ribbon(c.arc(DOOR, 560, 52, 48, PI, 2 * PI, 10), 8), C.wood2);
  s.p(c.cut(c.rect(955, 430, 110, 80), 0.4, 6), C.wood2);
  return s.out();
}

export default {
  id: 'lk8-news',
  beats: [
    { v: 49 },
    { v: 50 },
    { v: 51 },
    { v: 52, text: 'A wszyscy płakali i żałowali jej.' },
    { v: 52, cont: true, text: 'Lecz On rzekł: «Nie płaczcie, bo nie umarła, tylko śpi».' },
    { v: 53 },
  ],
  cam: { x: [-60, 140], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = streetSet(S, { skyCols: ['#c9d6d6', '#efe2c6', '#f5dcb8'], sunAt: [1250, 150] });
    const houseL = S.layer({ par: 0.4, sh: 4 });
    // the girl's room through the window: a soft light, the girl lying still
    const winGlow = houseL.add(`<g opacity="0"><rect x="957" y="432" width="106" height="76" fill="${C.lampGlow}"/><circle cx="1010" cy="470" r="60" fill="url(#warm-glow)"/></g>`);
    houseL.add(jairHouse(c));
    const winIn = houseL.add(`<g opacity="0"><rect x="961" y="436" width="98" height="68" fill="${mix(C.plaster2, C.lampGlow, 0.5)}"/><g transform="translate(1010 486) scale(.62)">${sickGirlIcon(c, L5.girl)}</g></g>`);

    /* the crowd in the street (stopped at the house) */
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const CR = [[300, 690, 'a', 4], [430, 716, 'b', 4], [540, 690, 'c', 3]].map(([x, y, k, n], i) => ({ i, x, y, sp: crowdL.sprite(knot('lk8-news-' + k, n, { s: 0.9, spread: 40, rows: 1, flip: false, arms: [10, 40] }), x, y) }));
    /* the mourners at the house */
    const MG = [[[0, 1, 2], 975, 0], [[3, 1, 0], 1085, 1]].map(([idx, x, i]) => ({ i, x, wail: crowdL.sprite(mourners(c, idx, 'wail'), x, FEET - 8), laugh: crowdL.sprite(mourners(c, idx, 'laugh'), x, FEET - 8) }));

    /* the people of the story */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [['peter', 660], ['james', 610], ['john', 700]].map(([k, x], i) => ({ i, k, x, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...CAST[k] }))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jair = S.puppet(L.add(person(c, RULER)));
    const jairK = S.puppet(L.add(person(c, { ...RULER, pose: 'kneel' })));
    const msg = S.puppet(L.add(person(c, MESSENGER)));
    const mother = S.puppet(L.add(person(c, L5.mother)));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const dead = fx.add(`<g opacity="0">${bubble(c, [tr('Twoja córka umarła,', 'Your daughter is dead.'), tr('nie trudź już Nauczyciela!', 'Don’t trouble the Teacher.')], { size: 18, dir: 1 })}</g>`);
    const believe = fx.add(`<g opacity="0">${bubble(c, [tr('Nie bój się;', 'Don’t be afraid.'), tr('wierz tylko,', 'Only believe,'), tr('a będzie ocalona', 'and she will be healed.')], { size: 18, dir: 1, fill: C.halo })}</g>`);
    const sleep = fx.add(`<g opacity="0">${bubble(c, [tr('Nie płaczcie, bo nie umarła,', 'Don’t weep. She isn’t dead,'), tr('tylko śpi', 'but sleeping.')], { size: 18, dir: 1, fill: C.halo })}</g>`);
    const hands = fx.add(`<g opacity="0"><circle r="70" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* where they are: walking up the street, then at the door */
      const JK = [[2.02, JX], [2.6, 850]];
      const jx = kf(t, JK);
      const walkJ = t > 2.02 && t < 2.6;
      /* v49 — "Your daughter is dead" */
      const MK = [[0.05, DOOR], [0.45, 960], [1.8, 960], [2.3, 1180]];
      const mx = kf(t, MK);
      msg.set({ x: mx, y: FEET + 4, s: 0.98, flip: t < 1.8, o: seg(t, 0.03, 0.08) * (1 - seg(t, 2.25, 2.35)), walk: (t > 0.05 && t < 0.45) || (t > 1.8 && t < 2.3) ? mx * 0.06 : undefined, amt: 1.3, armF: 30 + bump(t, 0.45, 1.0) * 50, armB: 10, head: 6, blink: blinkAt(T, 6) });
      const [mhx, mhy] = headAt(mx, FEET + 4, 0.98, true);
      const db = es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.95, 1.02));
      pose(dead, { x: mhx + 10, y: mhy - 28, s: db, o: db > 0.02 ? 1 : 0 });
      const sink = es(t, 0.6, 0.66) * (1 - es(t, 2.0, 2.06));
      const JRK = [[2.02, 860], [2.6, 1190]];
      const jrx = kf(t, JRK);
      jair.set({ x: jrx, y: FEET, s: 1.0, flip: t < 2.0 ? false : false, o: 1 - sink, walk: t > 2.02 && t < 2.6 ? jrx * 0.06 : undefined, armF: 20 + (t < 0.6 ? bump(t, 0.4, 0.6) * 40 : 0), armB: 10, head: 4, blink: blinkAt(T, 3) });
      jairK.set({ x: 860, y: FEET + 4, s: 1.0, flip: false, o: sink, armF: 150, armB: 40, head: 16, lean: 10, blink: 1 });
      /* v50 — "Do not be afraid; only believe" */
      const touch = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.05));
      const stop = es(t, 2.1, 2.3) * (1 - es(t, 2.85, 3.0));
      const speak = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.0));
      jesus.set({ x: jx, y: FEET, s: 1.04, flip: stop > 0.5, walk: walkJ ? jx * 0.06 : undefined, armF: 16 + touch * 70 + stop * 90 + speak * 60, armB: 8 + stop * 60 + speak * 20, head: touch * 12 - speak * 4, lean: touch * 6, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(jx, FEET, 1.04, false);
      const bb = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.92, 2.0));
      pose(believe, { x: jhx - 30, y: jhy - 36, s: bb, o: bb > 0.02 ? 1 : 0 });
      const [thx, thy] = hand(jx, FEET, 1.04, false, 16 + touch * 70, touch * 6);
      pose(hands, { x: thx, y: thy, s: 0.5 + touch * 0.6, o: touch * 0.8 });
      /* v51 — only Peter, James and John, and the father and mother */
      DIS.forEach((d) => {
        const DK = [[2.05 + d.i * 0.04, d.x], [2.65 + d.i * 0.04, 700 + d.i * 44]];
        const dx = kf(t, DK);
        d.p.set({ x: dx, y: FEET - 6 + (d.i % 2) * 10, s: 0.96, walk: t > 2.05 + d.i * 0.04 && t < 2.65 + d.i * 0.04 ? dx * 0.06 : undefined, armF: 14 + (d.k === 'peter' ? bump(t, 5.1, 5.9) * 40 : 0), head: -2, blink: blinkAt(T, d.seed) });
      });
      CR.forEach((g) => { const k = es(t, 2.05, 2.6); g.sp.set({ x: g.x + k * 60 - es(t, 2.3, 2.6) * 20, y: g.y }); });
      const momIn = es(t, 2.3, 2.6);
      mother.set({ x: lerp(DOOR, DOOR + 40, momIn), y: FEET - 4, s: 0.96, flip: true, o: momIn, armF: 30 + es(t, 3.05, 3.3) * 120 * (1 - es(t, 4.0, 4.2)), armB: 20 + es(t, 3.05, 3.3) * 100 * (1 - es(t, 4.0, 4.2)), head: 14 - es(t, 3.05, 3.3) * 20, blink: blinkAt(T, 7) });
      /* v52a — all are weeping and mourning her */
      MG.forEach((g) => {
        const inK = es(t, 3.05 + g.i * 0.1, 3.4 + g.i * 0.1);
        const laugh = es(t, 5.05 + g.i * 0.05, 5.12 + g.i * 0.05);
        const x = g.x + (1 - inK) * 120;
        g.wail.set({ x, y: FEET - 8, o: inK * (1 - laugh) });
        g.laugh.set({ x, y: FEET - 8, o: laugh });
      });
      /* v52b — "she is not dead but asleep": the girl through the window */
      const sb = es(t, 4.1, 4.28, ease.back) * (1 - es(t, 4.92, 5.0));
      const [j2x, j2y] = headAt(jx, FEET, 1.04, false);
      pose(sleep, { x: j2x - 20, y: j2y - 40, s: sb, o: sb > 0.02 ? 1 : 0 });
      fade(winGlow, es(t, 4.2, 4.5) * (1 - es(t, 5.0, 5.2) * 0.6));
      fade(winIn, es(t, 4.2, 4.4));

      S.cam.x = kf(t, [[0, 60], [1.9, 60], [2.6, 110]]);
      S.cam.z = 1.04 + es(t, 0.3, 0.8) * 0.06 - es(t, 2.0, 2.5) * 0.06 + es(t, 4.0, 4.3) * 0.04;
      S.cam.y = 20;
    };
  },
};
