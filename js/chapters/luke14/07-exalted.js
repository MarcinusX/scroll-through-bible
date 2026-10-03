// Łk 14,11–12a — back at the ruler's table, where the two late guests now sit on the gold bolsters. A painted board
// comes down over the table: on a tall pedestal a little proud man stands with his chin in the air, and beside it a
// humble man kneels on the ground. "Everyone who exalts himself will be humbled": the pedestal sinks into the ground
// under the proud one, and he is left sitting in the dust; "whoever humbles himself will be exalted": a golden pedestal
// rises under the kneeling one and lifts him up into the light. The board flies up again and Jesus turns to His host
// on the couch at the head of the table: "When you give a dinner or a supper…" — a little sun and a little moon come
// down beside him.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { rulerHouse, rulerTable, RH, rhHX, LATE, PROUD, HUMBLE, EMB, emblemParts, fig, label, voiceRings, headAt, kf, popAt, shameCheeks, addToHead, tr, sheet, mix } from './lib.js';
import { sun, moon } from '../../assets/nature.js';

const BX = 800, BY = 190;           // the board's top centre, when hung

export default {
  id: 'lk14-exalted',
  beats: [
    { v: 11 },
    { v: 12, text: 'Do tego zaś, który Go zaprosił, rzekł: «Gdy wydajesz obiad albo wieczerzę,' },
  ],
  cam: { x: [-40, 100], y: [0, 160], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    const R = rulerHouse(S);
    const late = LATE.map((o, i) => S.puppet(R.backL.add(person(c, { ...o, pose: 'sit' }))));
    const T0 = rulerTable(S, R, { seats: [0, 1, 2, 3] });
    const jSit = S.puppet(R.backL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(R.fx, c, { n: 3, color: C.sun, r: 26, w: 4 });
    // the emblem board (all its pieces move together with the board)
    const E = emblemParts(S);
    const embL = S.layer({ par: 0.36, sh: 6 });
    const back = embL.add(`<g>${E.back}</g>`);
    const glow = embL.add(`<g opacity="0"><ellipse rx="60" ry="70" fill="url(#warm-glow)"/></g>`);
    const pedL = embL.add(`<g>${E.pedL}</g>`), pedR = embL.add(`<g>${E.pedR}</g>`);
    const proud = embL.add(`<g>${fig(c, PROUD, { s: 0.5, head: -12, armB: 60, armF: 10 })}</g>`);
    const proudLow = embL.add(`<g opacity="0">${fig(c, { ...PROUD, pose: 'sit' }, { s: 0.5, head: 18 }).replace('<g class="headr">', '<g class="headr">')}</g>`);
    const humble = embL.add(`<g>${fig(c, { ...HUMBLE, pose: 'kneel' }, { s: 0.5, flip: true, head: 14, armF: 40 })}</g>`);
    const humbleUp = embL.add(`<g opacity="0">${fig(c, HUMBLE, { s: 0.5, flip: true, head: -8, armF: 30, armB: 150 })}</g>`);
    const strip = embL.add(`<g>${E.strip}</g>`);
    // the dinner and the supper
    const dn = R.fx.add(`<g opacity="0">${sheet().p(c.cut(c.circ(0, 0, 40, 30), 0.4, 5), C.cream).out()}<g transform="scale(.42)">${sun(c, 40)}</g><g transform="translate(0 56)">${label(c, tr('obiad', 'dinner'), { size: 16 })}</g></g>`);
    const sp = R.fx.add(`<g opacity="0">${sheet().p(c.cut(c.circ(0, 0, 40, 30), 0.4, 5), mix(C.indigo, C.duskViolet, 0.4)).out()}<g transform="scale(.6)">${moon(c, 30)}</g><g transform="translate(0 56)">${label(c, tr('wieczerza', 'supper'), { size: 16 })}</g></g>`);

    return (t, time) => {
      const T = time;
      R.update(T);
      /* the board comes down, then flies up */
      const k = es(t, -0.1, 0.18, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      const by = lerp(-1500, BY, k), bx = BX + (T ? Math.sin(T * 0.7) * 0 : 0);
      const on = k > 0.002 ? 1 : 0;
      pose(back, { x: bx, y: by, o: on });
      pose(strip, { x: bx, y: by, o: on });
      const G = by + EMB.GROUND;
      const sink = es(t, 0.28, 0.5), lift = es(t, 0.5, 0.72);
      pose(pedL, { x: bx + EMB.LX, y: G - EMB.PED * (1 - sink), o: on });
      pose(pedR, { x: bx + EMB.RX, y: G - EMB.PED * lift, o: on });
      const pTop = G - EMB.PED * (1 - sink) - 6;
      const down = es(t, 0.5, 0.54);
      pose(proud, { x: bx + EMB.LX, y: pTop, o: on * (1 - down) });
      pose(proudLow, { x: bx + EMB.LX, y: G + 2, o: on * down });
      const rTop = G - EMB.PED * lift - 6;
      const stood = es(t, 0.72, 0.76);
      pose(humble, { x: bx + EMB.RX + 4, y: Math.min(G + 2, rTop + 2), o: on * (1 - stood) });
      pose(humbleUp, { x: bx + EMB.RX, y: rTop, o: on * stood });
      pose(glow, { x: bx + EMB.RX, y: rTop - 60, o: on * es(t, 0.55, 0.8) });
      /* the table: the late guests on the gold bolsters */
      late.forEach((p, i) => p.set({ x: RH.HONOUR[1 - i], y: RH.SEAT, s: 0.98, flip: false, armF: 24, armB: 10, head: -4 + es(t, 0.2, 0.4) * -6, blink: blinkAt(T, i + 5) }));
      /* v12a — He turns to His host */
      const turn = es(t, 1.08, 1.2);
      const speak = es(t, 1.1, 1.22) * (1 - es(t, 1.92, 2.0));
      jSit.set({ x: RH.JX, y: RH.SEAT, s: 1.02, flip: false, armF: 30 + speak * 40 + (1 - turn) * bump(t, 0.1, 0.9) * 30, armB: 10 + (1 - turn) * bump(t, 0.1, 0.9) * 100 + speak * 30, head: -6 + turn * 8, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(RH.JX, RH.SEAT, 1.02, false, 62);
      voice(jhx, jhy, Math.max(bump(t, 0.05, 0.95) * 0.8, speak), T, { spread: 1.8, dir: t > 1.05 ? 1 : 0 });
      T0.set(t, T, { heads: { 0: -4, 1: 2 - es(t, 0.3, 0.5) * 10, 2: -2, 3: 2 }, hostArmF: 30 + es(t, 1.3, 1.5) * 20, hostArmB: 10, hostHead: 4 + es(t, 1.2, 1.4) * 6 });
      const [hhx, hhy] = headAt(rhHX(S), RH.HY, 1.02, true, 62);
      popAt(dn, t, 1.4, undefined, hhx - 70, hhy - 150 + (T ? Math.sin(T * 1.3) * 3 : 0), { d: 0.12 });
      popAt(sp, t, 1.55, undefined, hhx + 30, hhy - 190 + (T ? Math.sin(T * 1.3 + 1) * 3 : 0), { d: 0.12 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.3, 60]]);
      S.cam.y = kf(t, [[0, 60], [1.0, 70], [1.3, 110]]);
      S.cam.z = kf(t, [[0, 1.12], [1.0, 1.12], [1.3, 1.2]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.3, 90]]); S.cam.z = 1.0; }
      void seg; void shameCheeks; void addToHead;
    };
  },
};
