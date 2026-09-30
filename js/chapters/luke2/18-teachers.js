// Łk 2,46–47 — three day-discs light one after the other: on the third day, back in the Temple court, Mary and Joseph
// find Him. The boy sits in the middle of the teachers of the Law, on the paving among their scrolls: He listens to them,
// and He asks — a question goes up from Him, an answer comes back on an open scroll. And all who hear Him are amazed at
// His understanding and His answers: the old men lift their hands, the people standing round lean in, little sparks
// of wonder go up.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import { scrollOpen, scrollRolled } from '../mark2/lib.js';
import {
  templeSet, TFLOOR, JOSEPH, MARY, BOY, kid, priest, scribe, staff, pilgrims, daysString, question, speech, thought, GLYPH,
  glowDisc, hangAt, vpose, kf, moving, sparkle, fade, tr, es, ease, bump, seg, PI,
} from './lib.js';

const FL = TFLOOR;
const BX = 800;
const TEACH = [{ x: 610, f: false, k: 'p', i: 1 }, { x: 690, f: false, k: 's', i: 0 }, { x: 910, f: true, k: 's', i: 2 }, { x: 990, f: true, k: 'p', i: 3 }];
const MK = [[0, 140], [0.85, 400]];

export default {
  id: 'lk2-teachers',
  beats: [
    { v: 46, text: 'Dopiero po trzech dniach odnaleźli Go w świątyni,' },
    { v: 46, cont: true, text: 'gdzie siedział między nauczycielami, przysłuchiwał się im i zadawał pytania.' },
    { v: 47 },
  ],
  cam: { x: [-60, 20], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const TS = templeSet(S, {});
    const holy = TS.holyL.add(`<g>${glowDisc(240, 'halo-glow', 1)}</g>`);
    const back = S.layer({ par: 0.42, sh: 5 });
    const crowd = back.sprite(pilgrims(c, 3, { s: 0.8, dx: 62, flip: true }), 1130, FL - 14);
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const bglow = glowL.add(`<g>${glowDisc(180, 'halo-glow', 1)}</g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const teachers = TEACH.map((o) => {
      const hold = o.i === 1 ? `<g transform="rotate(-80) translate(0 -6)">${scrollRolled(c, 44)}</g>` : '';
      const m = o.k === 'p' ? priest(c, o.i, { pose: 'sit', holdF: hold }) : scribe(c, o.i, { pose: 'sit', holdF: hold });
      return { ...o, p: S.puppet(P.add(m)) };
    });
    P.add(`<g transform="translate(${BX + 60} ${FL - 4}) scale(1 .5)">${scrollOpen(c, 80, 50)}</g>`);
    const boy = S.puppet(P.add(kid(c, { ...BOY, pose: 'sit' }, 1.1)));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));

    const X = S.layer({ par: 0.35, sh: 5 });
    const days = X.add(`<g>${daysString(c, 3, 80, 22)}</g>`);
    const dayEls = Array.from(days.querySelectorAll('.day')).map((d) => ({ off: d.querySelector('.off'), lit: d.querySelector('.lit') }));
    const q = X.add(`<g>${speech(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 60, h: 48 })}</g>`);
    const ans = X.add(`<g>${speech(c, `<g transform="translate(0 2)">${scrollOpen(c, 44, 28)}</g>`, { w: 76, h: 54, flip: true })}</g>`);
    const wows = [0, 1, 2, 3].map(() => X.add(`<g>${thought(c, GLYPH.bang(c), { w: 44, h: 36 })}</g>`));
    const sparks = [0, 1, 2, 3, 4, 5].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      pose(holy, { x: TS.sanctX, y: TS.IW - 180, o: 0.5 });
      /* v46a — after three days they find Him in the Temple */
      const dk = es(t, 0.0, 0.2, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      pose(days, { x: BX - 80, y: lerp(-400, 210, dk), o: dk > 0.001 ? 1 : 0 });
      dayEls.forEach((d, i) => { const k = es(t, 0.15 + i * 0.15, 0.25 + i * 0.15); fade(d.lit, k); fade(d.off, 1 - k); });
      const mx = kf(t, MK, ease.sine);
      const walking = moving(t, MK, 0.3);
      const see = es(t, 0.7, 0.9);
      mary.set({ x: mx, y: FL, s: 0.95, walk: walking ? mx * 0.07 : undefined, armF: 30 + see * 60, armB: 20 + see * 80, head: -see * 6, blink: blinkAt(T, 1) });
      jos.set({ x: mx - 110, y: FL + 4, s: 0.95, walk: walking ? mx * 0.07 + 1 : undefined, armF: 30 + see * 50, armB: 30, head: -see * 4, blink: blinkAt(T, 2) });

      /* v46b — among the teachers, listening and asking */
      const ask = bump(t, 1.1, 1.5);
      const listen = bump(t, 1.5, 1.95);
      const wonder = es(t, 2.05, 2.35);
      boy.set({ x: BX, y: FL, s: 0.8, flip: t > 1.5 && t < 2.0, armF: 30 + ask * 80 + wonder * 20, armB: 20 + ask * 30, head: -ask * 8 + listen * 6, blink: blinkAt(T, 4) });
      pose(bglow, { x: BX, y: FL - 110, s: 0.7 + wonder * 0.3, o: 0.4 + wonder * 0.5 });
      teachers.forEach((tc, i) => {
        const turn = i === 1 ? bump(t, 1.5, 1.95) : 0;
        tc.p.set({ x: tc.x, y: FL, s: 0.9, flip: tc.f, armF: 30 + turn * 50 + wonder * (40 + i * 10), armB: 20 + wonder * (100 + (i % 2) * 30), head: 6 - wonder * 12, lean: wonder * (tc.f ? -4 : 4), blink: blinkAt(T, 3 + i) });
      });
      const qk = es(t, 1.1, 1.2, ease.back) * (1 - es(t, 1.45, 1.52));
      vpose(q, { x: BX + 20, y: FL - 150, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });
      const ak = es(t, 1.52, 1.62, ease.back) * (1 - es(t, 1.95, 2.02));
      vpose(ans, { x: 700, y: FL - 150, s: Math.max(0.001, ak), o: ak > 0.01 ? 1 : 0 });

      /* v47 — all who heard were amazed */
      crowd.set({ x: 1130 - wonder * 20, y: FL - 14 });
      wows.forEach((w, i) => {
        const k = es(t, 2.1 + i * 0.07, 2.25 + i * 0.07, ease.back);
        vpose(w, { x: TEACH[i].x + 10, y: FL - 170, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
      });
      sparks.forEach((sp, i) => {
        const k = seg(t, 2.2 + i * 0.05, 2.75 + i * 0.05), a = PI * (1.05 + i * 0.18);
        vpose(sp, { x: BX + Math.cos(a) * (70 + k * 90), y: FL - 150 + Math.sin(a) * (50 + k * 60), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 2.2 + i * 0.05, 2.75 + i * 0.05) });
      });

      S.cam.x = kf(t, [[0, -50], [0.9, -20], [1.2, 0]], ease.sine);
      S.cam.y = 20;
      S.cam.z = 1.04 + es(t, 1.0, 1.4) * 0.05;
    };
  },
};
