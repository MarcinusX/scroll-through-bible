// Łk 13,31–33 — the same day, on the road over the hills; far across the valley Jerusalem waits in the afternoon
// light. Some Pharisees hurry up: "Get away from here, for Herod wants to kill you!" — Herod's medallion comes down,
// crowned, a sword beside it. "Go and tell that fox": the medallion turns over, and on its other face is a fox with a
// little crown. "Behold, I cast out demons and perform cures today and tomorrow, and on the third day I finish my
// course": three plates hang over the valley — today, a dark spirit fleeing in a burst of sparks; tomorrow, a crutch
// thrown aside by the one who is healed; the third day, a sunrise. "Yet I must go on my way today and tomorrow and the
// day after; for it cannot be that a prophet should perish outside Jerusalem": He sets off down the road towards the
// city, His disciples after Him, and the Pharisees are left standing.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { TWELVE } from '../mark3/lib.js';
import { wisp } from '../mark3/lib.js';
import {
  viewSet, VW, pharisee, still, medal, L6, fox, crown, sword, dayPlate, healMark, stick, bubble, headAt, kf, moving, lightDisc,
  es, ease, bump, seg, tr, PI, STRING,
} from './lib.js';
import { sun as sunDisc } from '../../assets/nature.js';

const GY = VW.GY, JX = 780;

export default {
  id: 'lk13-fox',
  beats: [
    { v: 31 },
    { v: 32, text: 'Lecz On im odpowiedział: «Idźcie i powiedzcie temu lisowi:' },
    { v: 32, cont: true, text: 'Oto wyrzucam złe duchy i dokonuję uzdrowień dziś i jutro, a trzeciego dnia będę u kresu.' },
    { v: 33 },
  ],
  cam: { x: [-20, 60], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const V = viewSet(S);
    const c = S.c;

    /* the disciples, Jesus, the Pharisees */
    const disL = S.layer({ par: 0.4, sh: 4 });
    const dis = [0, 1].map((g) => ({ g, x: 600 - g * 140, sp: disL.sprite(still(c, [0, 1, 2].map((k) => ({ x: -k * 42, y: (k % 2) * 8, s: 0.92, flip: false, armF: 14 + k * 6, armB: 8, head: -2, o: TWELVE[g * 3 + k].o }))), 600 - g * 140, GY - 6) }));
    const jesus = S.puppet(V.act.add(person(c, { ...CAST.jesus })));
    const phs = [0, 3].map((i, j) => ({ j, p: S.puppet(V.act.add(person(c, pharisee(c, i)))) }));
    const say = V.fx.add(`<g opacity="0">${bubble(c, [tr('Wyjdź i uchodź stąd,', 'Get out of here,'), tr('bo Herod chce Cię zabić!', 'Herod wants to kill you!')], { size: 20, tail: -1 })}</g>`);

    /* Herod's medallion, and its other face: a fox with a crown */
    const hL = S.layer({ par: 0.3, sh: 6 });
    const herodM = hL.add(`<g><g transform="translate(0 70)">${medal(S, L6.herod, { r: 54, king: true, name: tr('Herod', 'Herod') })}</g></g>`);
    const foxFace = `<g transform="translate(-6 40) scale(.9)">${fox(c)}</g><g transform="translate(20 -44) scale(.9)">${crown(c)}</g>`;
    const foxM = hL.add(`<g><g transform="translate(0 70)">${medal(S, null, { r: 54, name: tr('lis', 'the fox'), back: mix(C.parchment, C.wheat, 0.3), front: foxFace })}</g></g>`);
    const strng = hL.add(`<g><path d="M0 -1600V16" stroke="${STRING}" stroke-width="1.2" fill="none"/></g>`);
    const swordEl = hL.add(`<g opacity="0">${sword(c, 90)}</g>`);

    /* the three days */
    const today = `<g transform="translate(-4 24)">${wisp(c, 1.6, '#3f3448')}</g>`;
    const tomorrow = `<g transform="translate(-14 30) rotate(-70)">${stick(c, 70)}</g><g transform="translate(14 -6)">${healMark(c, 14)}</g>`;
    const third = `<rect x="-60" y="-60" width="120" height="120" fill="${mix(C.dawn, C.peach, 0.4)}"/><g transform="translate(0 20)">${sunDisc(c, 22)}</g><path d="${c.ridge(c.wave(22, [4, 2], [60, 24]), -60, 60, 70, 6, 0.5)}" fill="${mix(C.hillMid, C.dune, 0.3)}"/>`;
    const plates = [[tr('dziś', 'today'), today], [tr('jutro', 'tomorrow'), tomorrow], [tr('trzeciego dnia', 'the third day'), third]].map(([w, inner], i) => ({ i, el: hL.add(`<g>${dayPlate(c, w, inner, { r: 42 })}</g>`) }));
    const flee = hL.add(`<g opacity="0">${wisp(c, 1.2, '#3f3448')}</g>`);
    const burst = [0, 1, 2, 3].map(() => hL.add(`<g opacity="0"><path d="${c.cut(c.star(0, 0, 9, 3, 4, 0), 0.2, 2)}" fill="${C.halo}"/></g>`));

    const JK = [[3.0, JX], [3.9, 930]];

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v31 — the Pharisees' warning; Herod */
      const run = es(t, 0.02, 0.35);
      phs.forEach((p) => {
        const x = lerp(1500 + p.j * 90, 960 + p.j * 90, run);
        const back = es(t, 3.02, 3.4);
        p.p.set({ x: x + back * (S.portrait ? (p.j ? 10 : 55) : 70 + 40 * p.j),   // phone: a short step back, the second one stays clear of the thread
           y: GY + 10 + p.j * 6 + back * 24, s: 1.02, flip: back < 0.5 || p.j === 0, walk: run > 0 && run < 1 ? x * 0.05 : undefined, armF: 20 + es(t, 0.35, 0.5) * 60 * (1 - p.j) * (1 - back), armB: 10 + es(t, 0.35, 0.5) * 100 * p.j * (1 - back), head: -6, blink: blinkAt(T, 4 + p.j) });
      });
      const sb = es(t, 0.4, 0.55, ease.back) * (1 - es(t, 0.95, 1.05));
      const [phx, phy] = headAt(960, GY + 10, 1.02, true);
      pose(say, { x: phx - 20, y: phy - 36, s: sb, o: sb > 0.02 ? 1 : 0 });
      // phone: the medallion hangs clear of the progress thread
      const hk = es(t, 0.45, 0.7, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      const hx = S.portrait ? 960 : 1040, hy = lerp(-900, 130, hk) + (T ? Math.sin(T * 0.8) * 2 : 0);
      const flipK = es(t, 1.2, 1.5);
      const sx = Math.cos(flipK * PI);
      pose(strng, { x: hx, y: hy });
      pose(herodM, { x: hx, y: hy, sx: Math.max(0.001, sx), o: sx > 0 ? 1 : 0 });
      pose(foxM, { x: hx, y: hy, sx: Math.max(0.001, -sx), o: sx < 0 ? 1 : 0 });
      pose(swordEl, { x: hx + 76, y: hy + 150, r: 20, o: hk > 0.5 ? 1 - flipK : 0 });

      /* Jesus: listens; points to the fox; the three days; walks on towards Jerusalem */
      const jx = kf(t, JK);
      const walking = moving(t, JK);
      const point = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      const count = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.0));
      jesus.set({ x: jx, y: GY - es(t, 3.0, 3.9) * 40, s: 1.04 - es(t, 3.0, 3.9) * 0.16, flip: false, walk: walking ? jx * 0.05 : undefined, armF: 20 + point * 20 + count * 40, armB: 10 + point * 140 + count * 100, head: -point * 10 - count * 8, blink: blinkAt(T) });
      dis.forEach((d) => {
        const k = es(t, 3.1 + d.g * 0.1, 3.95);
        d.sp.set({ x: d.x + k * 200, y: GY - 6 - k * 26 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 30 + d.g)) * 3 : 0), s: 1 - k * 0.12 });
      });

      /* v32b — today, tomorrow, the third day */
      plates.forEach((p) => {
        const k = es(t, 2.05 + p.i * 0.18, 2.3 + p.i * 0.18, ease.out) * (1 - es(t, 3.7, 3.95, ease.in) * 0);
        pose(p.el, { x: 620 + p.i * 180, y: lerp(-900, 200, k) + (T ? Math.sin(T * 0.8 + p.i) * 2 : 0), r: T ? Math.sin(T * 0.6 + p.i * 2) * 1.5 : 0 });
      });
      const fk = es(t, 2.3, 2.7);
      pose(flee, { x: 620 - fk * 90, y: 250 - fk * 120, s: 1 - fk * 0.6, r: -fk * 30, o: fk > 0.01 && fk < 1 ? 1 - fk : 0 });
      burst.forEach((b, i) => { const k = bump(t, 2.28 + i * 0.03, 2.7); const a = (i / 4) * PI * 2 + 0.4; pose(b, { x: 620 + Math.cos(a) * 60 * k, y: 248 + Math.sin(a) * 60 * k, s: k * 1.4, o: k }); });

      S.cam.x = kf(t, [[0, 20], [1.0, 40], [2.0, 20], [3.0, 20], [3.9, 50]]);
      if (S.portrait && t > 3.0) S.cam.x = 20;   // phone: no drift right at the end
      S.cam.y = 0;
      S.cam.z = 1.04;
      void lightDisc; void seg; void mix; void shade; void sheet;
    };
  },
};
