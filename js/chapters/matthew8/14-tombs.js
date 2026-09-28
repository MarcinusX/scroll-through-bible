// Mt 8,28–29 — the other shore, the country of the Gadarenes (the same shore of tombs as in Mark 5). The boat
// glides in and grounds; Jesus steps out with His disciples. Two men possessed come running down from the tombs in
// the hillside, wild, torn dark shadows clinging behind them — a traveller on the road above turns and runs back: no
// one can pass that way. They cry out: "What have you to do with us, Son of God?" — and an hourglass is let down on
// its string, its sand still high: "Have you come here to torment us before the time?"
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { rock, reeds } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { shoreSet, L5, WILD2, shadowCloak, cry, chain, hungWord, hourglass, hangAt, headAt, kf, tr, PI } from './lib.js';

const FEET = 724, JX = 690;

export default {
  id: 'mt8-tombs',
  beats: [
    { v: 28, text: 'Gdy przybył na drugi brzeg do kraju Gadareńczyków,' },
    { v: 28, cont: true, text: 'wybiegli Mu naprzeciw dwaj opętani, którzy wyszli z grobów,' },
    { v: 28, cont: true, text: 'bardzo dzicy, tak że nikt nie mógł przejść tą drogą.' },
    { v: 29, text: 'Zaczęli krzyczeć: «Czego chcesz od nas, <Jezusie>, Synu Boży?' },
    { v: 29, cont: true, text: 'Przyszedłeś tu przed czasem dręczyć nas?»' },
  ],
  cam: { x: [-60, 120], y: [-60, 50], z: [1, 1.14] },
  build(S) {
    const set = shoreSet(S, { skyCols: ['#bcd3d6', '#efe2c6', '#f6e2bf'], sunAt: [1280, 140], sunR: 42 });
    const c = S.c;

    /* the traveller on the road up the hill, who turns back */
    const roadL = S.layer({ par: 0.3, sh: 3 });
    const trav = S.puppet(roadL.add(person(c, { robe: C.ochreRobe, mantle: C.stone2, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin3, belt: C.leather })));

    /* the boat */
    const boatL = S.layer({ par: 0.45, sh: 4 });
    const B = boat(c, {});
    const bBack = boatL.add(`<g>${B.back}</g>`);
    const crew = [CAST.andrew, CAST.james, CAST.john, CAST.peter].map((o, i) => ({ i, p: S.puppet(boatL.add(person(c, o))), seed: c.rr(0, 9) }));
    const jB = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const bFront = boatL.add(`<g>${B.front}</g>`);

    /* the two men and their shadows */
    const manL = S.layer({ par: 0.45, sh: 5 });
    const MEN = [{ o: L5.wild, x: 900, from: set.tombAt[0] }, { o: WILD2, x: 1010, from: set.tombAt[1] }].map((m, i) => ({
      ...m, i, sh: manL.add(`<g>${shadowCloak(c, 120, 230)}</g>`), p: S.puppet(manL.add(person(c, { ...m.o, holdF: i === 0 ? `<g transform="translate(0 6) rotate(80)">${chain(c, 4, 6)}</g>` : '' }))), seed: c.rr(0, 9),
    }));
    const jesus = S.puppet(manL.add(person(c, { ...CAST.jesus })));
    const dis = crew.map((d) => ({ ...d, q: S.puppet(manL.add(person(c, [CAST.andrew, CAST.james, CAST.john, CAST.peter][d.i]))) }));

    /* words */
    const W = S.layer({ par: 0.47, sh: 3 });
    const cry1 = W.add(`<g opacity="0">${cry(c, [tr('Czego chcesz od nas,', 'What do we have to do'), tr('Jezusie, Synu Boży?', 'with you, Jesus, Son of God?')], { size: 21, dir: 1 })}</g>`);
    const cry2 = W.add(`<g opacity="0">${cry(c, [tr('Przyszedłeś tu przed czasem', 'Have you come here to torment us'), tr('dręczyć nas?', 'before the time?')], { size: 21, dir: 1 })}</g>`);
    const flyL = S.layer({ par: 0.12, sh: 6 });
    const place = flyL.add(hungWord(c, tr('kraj Gadareńczyków', 'the country of the Gergesenes'), { size: 24 }));
    const glass = flyL.add(`<g class="hang"><path d="M0 -1600V-48" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${hourglass(c, 90)}</g></g>`);
    const sandT = glass.querySelector('.sandT'), sandB = glass.querySelector('.sandB');

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(reeds(c, 120, 940, 14, 220, C.moss) + rock(c, 1450, 960, 240, 90, C.rock2));

    const BK = [[0.0, [-240, 700]], [0.55, [400, 712]]];
    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v28a — the boat comes in to the other shore; He steps out */
      const [bx, by] = kf(t, BK, ease.out);
      const bob = T ? Math.sin(T * 1.3) * 2 * (1 - seg(t, 0.5, 0.6)) : 0;
      pose(bBack, { x: bx, y: by + bob, s: 0.8 }); pose(bFront, { x: bx, y: by + bob, s: 0.8 });
      const out = es(t, 0.6, 0.66);
      jB.set({ x: bx + 80 * 0.8, y: by - 26 + bob, s: 0.82, o: 1 - out, armF: 20 });
      const jgo = es(t, 0.62, 0.95);
      const jx = lerp(520, JX, jgo);
      const face = es(t, 1.1, 1.4);
      const calm = es(t, 3.2, 3.5);
      jesus.set({ x: jx, y: FEET, s: 1.02, o: out, walk: jgo > 0 && jgo < 1 ? jx * 0.05 : undefined, armF: 14 + face * 20 + calm * 30, armB: 10 + calm * 20, head: -face * 2, blink: blinkAt(T) });
      dis.forEach((d) => {
        const off = es(t, 0.66 + d.i * 0.06, 0.72 + d.i * 0.06);
        d.p.set({ x: bx + (-128 + d.i * 58) * 0.8, y: by - 26 + bob, s: 0.8, o: 1 - off, armF: 20 });
        const k = es(t, 0.7 + d.i * 0.06, 1.0 + d.i * 0.05);
        const x = lerp(480, 590 - d.i * 56, k);
        const fear = es(t, 1.2, 1.5);
        d.q.set({ x: x - fear * 20, y: FEET + (d.i % 2) * 6 - 4, s: 0.94, o: off, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 14 + fear * (d.i % 2 ? 60 : 30), armB: fear * (d.i % 2 ? 40 : 110), lean: -fear * 6, blink: blinkAt(T, d.seed) });
      });
      const pk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.95, 1.15));
      hangAt(place, 760, lerp(-600, 250, pk), T, 1.2, 0.7);

      /* v28b — two possessed men run down from the tombs */
      MEN.forEach((m) => {
        const k = es(t, 1.02 + m.i * 0.08, 1.6 + m.i * 0.08);
        const x = lerp(m.from[0], m.x, k), y = lerp(m.from[1], FEET + m.i * 6, k);
        const s = lerp(0.6, 1.0, k);
        const wild = es(t, 2.05, 2.3) * (1 - es(t, 4.1, 4.4));
        const shout = bump(t, 3.05, 3.95) + bump(t, 4.05, 4.95);
        const cower = es(t, 4.2, 4.5);
        const trem = T ? Math.sin(T * 12 + m.i) * 1.5 : 0;
        m.p.set({ x: x + trem, y, s, flip: true, o: seg(t, 1.0, 1.08), walk: k > 0 && k < 1 ? x * 0.06 : undefined, amt: 1.3, armF: 40 + wild * 80 + shout * 30 - cower * 20, armB: 30 + wild * 110 + shout * 20, head: 10 - wild * 16 - shout * 10 + cower * 18, lean: -wild * 6 + cower * 8, blink: blinkAt(T, m.seed) });
        pose(m.sh, { x: x + 10, y: y + 4, s: s * (1.05 + wild * 0.2 + (T ? Math.sin(T * 1.6 + m.i) * 0.03 : 0)), o: seg(t, 1.0, 1.1) * 0.9 });
      });

      /* v28c — nobody can pass that way: the traveller turns back */
      const tk = es(t, 1.5, 2.2, (u) => u);
      const flee = es(t, 2.2, 2.3);
      const tx = flee > 0.5 ? lerp(1130, 1270, es(t, 2.3, 3.0)) : lerp(1320, 1130, tk);
      trav.set({ x: tx, y: set.hfn(tx) + 6, s: 0.62, flip: flee < 0.5, o: seg(t, 1.45, 1.55) * (1 - es(t, 3.0, 3.15)), walk: (tk > 0 && tk < 1) || (flee > 0.5 && t < 3.0) ? tx * 0.08 : undefined, amt: flee > 0.5 ? 1.5 : 1, armF: 10 + flee * 60, armB: flee * 140, blink: blinkAt(T, 3) });

      /* v29 — they cry out */
      const k1 = es(t, 3.08, 3.28, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(cry1, { x: 980, y: 480, s: k1, r: k1 > 0.02 && T ? Math.sin(T * 7) * 2 : 0, o: k1 > 0.02 ? 1 : 0 });
      const k2 = es(t, 4.1, 4.3, ease.back);
      pose(cry2, { x: 980, y: 480, s: k2, r: k2 > 0.02 && T ? Math.sin(T * 7) * 2 : 0, o: k2 > 0.02 ? 1 : 0 });
      const gk = es(t, 4.05, 4.4, ease.out);
      hangAt(glass, 1180, lerp(-600, 230, gk), T, 1.4, 0.8);
      pose(sandT, { x: 0, y: -3, sy: 1 - es(t, 4.4, 6) * 0.1 });
      pose(sandB, { x: 0, y: 45, sy: 0.2 + es(t, 4.4, 6) * 0.1 });

      S.cam.z = 1.04 + es(t, 1.0, 1.6) * 0.03 + es(t, 3.0, 3.4) * 0.04;
      S.cam.x = lerp(-40, 40, es(t, 0.6, 1.6)) + es(t, 1.4, 2.0) * 40 - es(t, 2.6, 3.1) * 40;
      S.cam.y = 20 - es(t, 1.4, 2.0) * 40 + es(t, 2.6, 3.1) * 40;
    };
  },
};
