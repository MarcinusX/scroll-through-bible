// J 7,11–13 — Jerusalem in festival dress: booths of branches on every roof and in the street, garlands and
// lanterns strung across. Three leaders walk the street looking for Him, peering behind the booths: "Where is he?"
// The crowd murmurs in little knots behind their hands. Some say "He is good!" (a warm bubble with a heart),
// others "No — he leads the people astray!" (a dark, jagged one). But when the leaders turn round, every bubble
// folds away: no one speaks of Him openly, for fear.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { bubble as bubble5 } from '../mark5/lib.js';
import { talkDots } from '../mark16/lib.js';
import {
  feastStreet, STREET, PH, townMan, townWoman, pilgrim, lulav, etrogHeld, headAt, say, heart, nameTag, question, strip,
  hangAt, vpose, FEAST, tr, PI,
} from './lib.js';

const F = STREET.F;
const LG = [{ x: 410, w: 0 }, { x: 490, w: 1 }, { x: 566, w: 0 }];       // the group who say "He is good"
const RG = [{ x: 1036, w: 0 }, { x: 1112, w: 1 }, { x: 1190, w: 0 }];    // the group who say "he misleads"

export default {
  id: 'j7-where',
  beats: [
    { v: 11 },
    { v: 12, text: '«Gdzie On jest?» Wśród tłumów zaś wiele mówiono o Nim pokątnie.' },
    { v: 12, cont: true, text: 'Jedni mówili: «Jest dobry».' },
    { v: 12, cont: true, text: 'Inni zaś mówili: «Nie, przeciwnie - zwodzi tłumy».' },
    { v: 13 },
  ],
  cam: { x: [-40, 60], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const St = feastStreet(S, { skyCols: FEAST, sunAt: [1230, 150] });
    const A = St.actL;

    /* a back row of festive townsfolk (still; they only blink and turn) */
    const BL = S.layer({ par: 0.47, sh: 4 });
    const back = [[530, 0.74, 0], [620, 0.72, 1], [980, 0.74, 2], [1070, 0.72, 3]].map(([x, s, i]) => ({ x, s, i, seed: c.rr(0, 9), p: S.puppet(BL.add(pilgrim(c, i + 4, { lulavA: 60 }))) }));
    /* the two knots of people */
    const mk = (g, k) => g.map((m, i) => ({ ...m, i, k, seed: c.rr(0, 9), p: S.puppet(A.add(person(c, m.w ? townWoman(c, { holdB: etrogHeld(c) }) : { ...townMan(c), holdF: i === 2 ? lulav(c, 60, 110) : '' }))) }));
    const left = mk(LG, 0), right = mk(RG, 1);
    /* the leaders searching */
    const phs = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(A.add(person(c, PH(c, i + 1)))) }));

    /* words */
    const X = S.layer({ par: 0.5, sh: 6 });
    const q = X.add(`<g>${question(c)}</g>`);
    const where = X.add(`<g>${say(c, tr('Gdzie On jest?', 'Where is he?'), { size: 28, side: 1 })}</g>`);
    const whisper = [...left, ...right].filter((m) => m.i !== 1).map((m) => ({ m, el: X.add(`<g>${say(c, ' ', { size: 16, side: m.k ? 1 : -1, w: 54 })}<g transform="translate(${m.k ? 22 : -22} -34)">${talkDots(c)}</g></g>`) }));
    const good = X.add(`<g>${bubble5(c, tr('Jest dobry!', 'He is good!'), { size: 24, dir: -1 })}<g transform="translate(150 -78) scale(.8)">${heart(c, 14)}</g></g>`);
    const bad = X.add(`<g>${bubble5(c, tr(['Nie — zwodzi', 'tłumy!'], ['No — he leads', 'the people astray!']), { size: 20, dir: 1, jag: true, fill: '#4a3f52', ink: C.cream })}</g>`);
    const hush = hanging(X, nameTag(c, tr(['nikt nie mówił', 'o Nim jawnie'], ['no one spoke', 'of Him openly']), { size: 18 }), { x: 800, y: 250, len: 600 });

    return (t, time) => {
      const T = time;
      St.update(t, T, { lit: 0 });

      /* v11 — the leaders walk down the street looking for Him */
      const walk = es(t, -0.2, 0.75, ease.sine);
      const turn = es(t, 3.95, 4.15);          // v13 — they turn round; everyone falls silent
      phs.forEach((m) => {
        const x = lerp(-140 - m.i * 90, 700 + m.i * 96, walk);
        const peer = m.i === 0 ? bump(t, 0.2, 0.6) : m.i === 2 ? bump(t, 0.5, 0.95) : 0;
        const ask = m.i === 1 ? bump(t, 0.72, 1.6) : 0;
        m.p.set({
          x, y: F + 16 + (m.i % 2) * 6, s: 1, flip: m.i === 0 ? (peer > 0.4 || turn > 0.5) : m.i === 2 ? turn < 0.5 && t > 1 : false,
          walk: walk > 0 && walk < 1 ? x * 0.05 + m.i : undefined, armF: 20 + ask * 60 + peer * 30, armB: 10 + ask * 30,
          head: -peer * 8 + bump(t, 1.1, 3.9) * 4 + turn * 4, lean: peer * 6, blink: blinkAt(T, m.seed),
        });
      });
      const [qx, qy] = headAt(lerp(-140, 700, walk), F + 16, 1, false);
      vpose(q, { x: qx + 40, y: qy - 50, s: es(t, 0.25, 0.4, ease.back) * 0.9, r: Math.sin(T * 2) * 6, o: seg(t, 0.25, 0.3) * (1 - es(t, 0.65, 0.75)) });
      const [wx, wy] = headAt(796, F + 22, 1, false);
      vpose(where, { x: wx + 20, y: wy - 18, s: es(t, 0.72, 0.9, ease.back), o: seg(t, 0.72, 0.78) * (1 - es(t, 1.55, 1.7)) });

      /* v12 — the murmuring crowd: little knots behind their hands */
      const mur = es(t, 1.2, 1.4) * (1 - es(t, 2.0, 2.1));
      const all = [...left, ...right];
      all.forEach((m) => {
        const lean = mur * (m.i === 1 ? 0 : 6);
        const say1 = m.k === 0 ? bump(t, 2.1, 2.95) : bump(t, 3.1, 3.95);
        const shush = es(t, 4.05, 4.25);
        m.p.set({
          x: m.x, y: F + 26 + (m.i % 2) * 8, s: 0.93, flip: shush > 0.5 ? m.k === 1 : m.k === 0 ? m.i === 2 : m.i !== 0,
          armF: 18 + mur * 70 * (m.i === 1 ? 0 : 1) + say1 * (m.i === 1 ? 70 : 20) * (1 - shush), armB: 10 + say1 * 30 * (1 - shush),
          head: lean * 1.4 + shush * 12 + (m.i === 1 ? -say1 * 6 : 0), lean: lean - shush * 3, blink: blinkAt(T, m.seed),
        });
      });
      whisper.forEach(({ m, el }, i) => {
        const [hx, hy] = headAt(m.x, F + 26 + (m.i % 2) * 8, 0.93, false);
        const k = es(t, 1.25 + i * 0.05, 1.4 + i * 0.05, ease.back);
        vpose(el, { x: hx + (m.k ? 10 : -10), y: hy - 20, s: k * 0.9, o: seg(t, 1.25 + i * 0.05, 1.3 + i * 0.05) * (1 - es(t, 1.95, 2.05)) });
      });
      back.forEach((m) => m.p.set({ x: m.x, y: F - 30, s: m.s, flip: m.i % 2 === 1, armF: 60, armB: 14, head: bump(t, 1.2, 2.0) * 5 - es(t, 4.05, 4.3) * 8, blink: blinkAt(T, m.seed) }));

      /* v12b / v12c — "He is good!" / "No, he leads the people astray!" */
      const [gx, gy] = headAt(LG[1].x, F + 34, 0.93, false);
      const gk = es(t, 2.1, 2.3, ease.back), gOff = es(t, 4.05, 4.25, ease.in);
      vpose(good, { x: gx + 8, y: gy - 22 + gOff * 30, s: gk * (1 - gOff), o: seg(t, 2.1, 2.15) * (1 - gOff) });
      const [bx, by] = headAt(RG[1].x, F + 34, 0.93, true);
      const bk = es(t, 3.1, 3.3, ease.back);
      vpose(bad, { x: bx - 8, y: by - 22 + gOff * 30, s: bk * (1 - gOff), o: seg(t, 3.1, 3.15) * (1 - gOff) });

      /* v13 — for fear, no one speaks openly: the street dims a little */
      St.dusk.fade(es(t, 4.05, 4.4) * 0.55);
      const hk = es(t, 4.2, 4.5, ease.out);
      hangAt(hush, 800, lerp(-300, 250, hk), T, hk > 0 ? 1 : 0, 1.3, 0.9, 3);

      S.cam.x = lerp(-30, 10, es(t, 0.2, 1.0)) - bump(t, 1.95, 2.95) * 30 + bump(t, 2.95, 3.95) * 40;
      S.cam.z = 1.04 + bump(t, 1.9, 4.0) * 0.04;
    };
  },
};
