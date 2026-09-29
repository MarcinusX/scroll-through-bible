// Mt 26,57–61 — the high priest's palace, cut away (Mark 14's): the council hall upstairs, the courtyard and its fire
// below. They lead Him, bound, to Caiaphas (his name on a tag), where the scribes and elders are gathered. Peter follows
// at a distance, in through the gate, and sits among the servants at the fire "to see the end" (an open eye). Upstairs
// they look for false testimony: scrolls, questions; many false witnesses come, and their pieces never fit. At last two
// come forward: "I am able to destroy the temple of God, and to build it in three days" — a temple crumbles and a
// shining one rises after three suns.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  palaceDawn, palaceIdle, TW, LOOK, kf, moving, hand, headAt, withFace, faceBits, priest, highPriest, HP, scribe, guardOpts, man, cord, speech, thought, GLYPH,
  puzzle, crookedScroll, templeMini, sparkle, question, nameTag, tr, PI, vis,
} from './lib.js';

export default {
  id: 'mt26-council',
  beats: [
    { v: 57 },
    { v: 58, text: 'A Piotr szedł za Nim z daleka, aż do pałacu najwyższego kapłana.' },
    { v: 58, cont: true, text: 'Wszedł tam na dziedziniec i usiadł między służbą, aby widzieć, jaki będzie wynik.' },
    { v: 59 },
    { v: 60, text: 'Lecz nie znaleźli, jakkolwiek występowało wielu fałszywych świadków.' },
    { v: 60, cont: true, text: 'W końcu stanęli dwaj' },
    { v: 61 },
  ],
  cam: { x: [-700, 500], y: [-460, 360], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const R = palaceDawn(S);
    const { HALL, YARD, SEATX, FIRE, GATE } = R;
    const JX = 1040;

    /* the council upstairs */
    const hallL = S.layer({ par: R.P, sh: 5 });
    const COUNCIL = [
      { m: () => scribe(c, 0), x: 680 }, { m: () => priest(c, 1), x: 738 }, { m: () => scribe(c, 3), x: 796 },
      { m: () => priest(c, 3), x: 1300, flip: true }, { m: () => scribe(c, 2), x: 1370, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(hallL.add(d.m())), s: 0.7 }));
    const hpSit = S.puppet(hallL.add(addHP(c, 'sit')));
    const WIT = Array.from({ length: 4 }, (_, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(hallL.add(person(c, man(c)))) }));
    const guards = [0, 1].map((i) => S.puppet(hallL.add(person(c, guardOpts(c)))));
    const jEl = hallL.add(withFace(person(c, { ...CAST.jesus, holdF: cord(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);

    /* the courtyard below */
    const Y = R.yard();
    const yardP = S.layer({ par: R.P, sh: 5 });
    const SERV = [{ x: 610, flip: true }, { x: 680, flip: true }, { x: 440, flip: false, k: 'maidless' }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(yardP.add(person(c, { ...guardOpts(c), pose: 'sit' }))) }));
    const peterW = S.puppet(yardP.add(person(c, TW.peter)));
    const peterS = S.puppet(yardP.add(person(c, { ...TW.peter, pose: 'sit' })));
    R.porch();

    /* testimony */
    const fx = S.layer({ par: R.P, sh: 4 });
    const scrolls = [0, 1, 2].map((i) => fx.add(`<g>${crookedScroll(c, 60, 36)}</g>`));
    const qs = [0, 1, 2].map((i) => fx.add(`<g>${question(c)}</g>`));
    const pieces = WIT.map((w) => fx.add(`<g>${speech(c, `<g transform="scale(.9)">${puzzle(c, w.i, C.cream, 16)}</g>`, { w: 60, h: 52, flip: false })}</g>`));
    const templeSay = fx.add(`<g>${speech(c, `<g class="tA" transform="translate(-26 18)">${templeMini(c, 0.42)}</g><g class="suns" transform="translate(8 -16)">${[0, 1, 2].map((k) => `<path transform="translate(${k * 12} 0)" d="${c.poly(c.star(0, 0, 5, 2.4, 8, 0))}" fill="${C.sun}"/>`).join('')}</g><g class="tB" transform="translate(28 18)"><circle cy="-20" r="22" fill="url(#halo-glow)"/>${templeMini(c, 0.42, { col: C.halo, gold: C.sun })}</g>`, { w: 120, h: 80, flip: false })}</g>`);
    const tag = hanging(fx, nameTag(c, [tr('Kajfasz', 'Caiaphas'), tr('najwyższy kapłan', 'the high priest')], { size: 16 }), { x: 0, y: -1500, len: 700 });
    const eye = (() => {
      const e = sheet();
      e.p(c.cut([...c.arc(0, 0, 22, 12, PI, 2 * PI, 10), ...c.arc(0, 0, 22, 12, 0, PI, 10)], 0.3, 3), C.cream);
      e.p(c.cut(c.circ(0, 0, 7, 12), 0.2, 2), C.teal);
      e.x(c.poly(c.circ(0, 0, 3.4, 8)), C.ink);
      return e.out();
    })();
    const watch = fx.add(`<g>${thought(c, eye, { w: 70, h: 46 })}</g>`);
    const tA = templeSay.querySelector('.tA'), tB = templeSay.querySelector('.tB');

    return (t, time) => {
      const T = time;
      palaceIdle(R, Y, T);

      /* v53 — led in before the council */
      const jK = [[-0.4, [1470, HALL]], [0.7, [JX, HALL]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      jesus.set({ x: jx, y: jy, s: 0.74, flip: false, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, armF: 24, armB: 14, head: 6 + bump(t, 4.1, 7.9) * 4, blink: blinkAt(T) });
      guards.forEach((g, i) => {
        const gK = [[-0.4, [1540 + i * 60, HALL]], [0.7, [JX + 70 + i * 50, HALL]], [0.9, [JX + 70 + i * 50, HALL]], [1.4, [1470 + i * 40, HALL]]];
        const [gx, gy] = kf(t, gK, ease.sine);
        g.set({ x: gx, y: gy, s: 0.72, flip: t < 0.9, walk: moving(t, gK, 1) ? gx * 0.05 : undefined, armF: 30, o: 1 - es(t, 1.3, 1.45) });
      });
      const search = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      COUNCIL.forEach((m) => {
        const turn = es(t, 0.3 + m.i * 0.04, 0.6 + m.i * 0.04);
        m.p.set({ x: m.x, y: HALL, s: m.s, flip: !!m.flip, armF: 16 + turn * 20 + search * (40 + Math.sin(T * 3 + m.seed) * 10), armB: search * 30, head: 4 - turn * 4 + search * 10, blink: blinkAt(T, m.seed) });
      });
      hpSit.set({ x: SEATX, y: HALL - 16, s: 0.74, flip: true, armF: 30 + search * 30, armB: 12, head: -4 + search * 6, blink: blinkAt(T, 3) });

      const tk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 0.85, 1.05, ease.in));
      vis(tag, { x: SEATX - 130, y: 200 - (1 - tk) * 700, r: Math.sin(T * 0.9) * 2, o: tk > 0.01 ? 1 : 0 });
      /* v58 — Peter at a distance, through the gate, to the fire */
      const pK = [[0.9, [GATE - 40, YARD]], [1.8, [FIRE - 120, YARD]], [2.05, [FIRE - 110, YARD]]];
      const [px, py] = kf(t, pK, ease.sine);
      const sit = es(t, 2.05, 2.12);
      peterW.set({ x: px, y: py, s: 0.84, flip: false, o: seg(t, 0.9, 1.0) * (1 - sit), walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 14, head: -6, blink: blinkAt(T, 3) });
      peterS.set({ x: FIRE - 108, y: YARD + 6, s: 0.84, flip: false, o: sit, armF: 70, armB: 50, head: 8, blink: blinkAt(T, 3) });
      const wk = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.9, 3.0));
      const [pwx, pwy] = headAt(FIRE - 108, YARD + 6, 0.84, false, 62);
      vis(watch, { x: pwx + 6, y: pwy - 30, s: wk, o: wk > 0.01 ? 1 : 0 });
      SERV.forEach((sv) => sv.p.set({ x: sv.x, y: YARD + 8, s: 0.84, flip: sv.flip, armF: 64, armB: 40, head: 6, blink: blinkAt(T, sv.seed) }));

      /* v55 — they search the scrolls and find nothing */
      scrolls.forEach((el, i) => {
        const k = es(t, 3.1 + i * 0.08, 3.35 + i * 0.08, ease.back) * (1 - es(t, 3.9, 4.05));
        const x = [700, 790, 1320][i];
        vis(el, { x, y: 200 + Math.sin(T * 2 + i) * 3, s: k * 0.9, r: (i - 1) * 8, o: k > 0.01 ? 1 : 0 });
        const q = es(t, 3.45 + i * 0.08, 3.6 + i * 0.08, ease.back) * (1 - es(t, 3.9, 4.05));
        vis(qs[i], { x: x + 20, y: 160, s: q * 0.7, o: q > 0.01 ? 1 : 0 });
      });

      /* v56–59 — the witnesses */
      WIT.forEach((w) => {
        const inK = es(t, 4.05 + w.i * 0.14, 4.4 + w.i * 0.14);
        const two = w.i < 2 ? es(t, 5.05, 5.4) : 0;
        const gone = w.i >= 2 ? es(t, 4.9, 5.1) : 0;
        const x = lerp(560, 862 + (w.i % 2) * 40 - w.i * 10, inK) + two * (w.i === 0 ? 20 : 40) - gone * 280;
        const talk = w.i < 2 ? es(t, 6.05, 6.3) : 0;
        w.p.set({ x, y: HALL, s: 0.7, flip: false, o: seg(t, 4.0 + w.i * 0.14, 4.1 + w.i * 0.14) * (1 - gone), walk: (inK > 0 && inK < 1) || (gone > 0 && gone < 1) ? x * 0.05 : undefined, armF: 20 + bump(t, 4.3 + w.i * 0.14, 4.95) * 60 + talk * 60 + two * 20, armB: talk * 40, head: -talk * 4, blink: blinkAt(T, w.seed) });
      });
      pieces.forEach((el, i) => {
        const k = es(t, 4.35 + i * 0.12, 4.55 + i * 0.12, ease.back) * (1 - es(t, 4.95, 5.05));
        const ang = Math.sin(T * 2 + i) * 10 + (i - 1.5) * 12;
        vis(el, { x: 820 + i * 50, y: 210 - (i % 2) * 24, s: k * 1.1, r: ang * es(t, 4.7, 4.9), o: k > 0.01 ? 1 : 0 });
      });
      const ts = es(t, 6.1, 6.3, ease.back);
      vis(templeSay, { x: 900, y: 230, s: ts * 1.45, o: ts > 0.01 ? 1 : 0 });
      const crumble = es(t, 6.3, 6.6), rebuild = es(t, 6.6, 6.9);
      vis(tA, { x: -26, y: 18 + crumble * 16, sy: 1 - crumble * 0.85, r: crumble * 10, o: 1 - crumble * 0.6 });
      vis(tB, { x: 28, y: 18, s: rebuild, o: rebuild });
      /* camera: hall — overview — courtyard — hall */
      S.cam.x = kf(t, [[-0.5, 380], [0.8, 360], [1.05, 0], [1.4, -420], [2.9, -440], [3.2, 360], [8, 360]]);
      S.cam.y = kf(t, [[-0.5, -380], [0.8, -380], [1.05, 0], [1.4, 300], [2.9, 300], [3.2, -380], [8, -390]]);
      S.cam.z = kf(t, [[-0.5, 1.5], [0.8, 1.55], [1.05, 1.0], [1.4, 1.5], [2.9, 1.55], [3.2, 1.5], [8, 1.5]]);
    };
  },
};

function addHP(c, pose) { return highPriest(c, { pose }); }
