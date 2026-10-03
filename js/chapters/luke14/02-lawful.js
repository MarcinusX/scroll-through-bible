// Łk 14,3–4 — Jesus turns to the lawyers and Pharisees along the table: "Is it lawful to heal on the sabbath, or not?"
// The question hangs over the table beside the sabbath tag. They are silent: little bubbles with nothing but three dots
// rise over their heads and they look down at their plates. Then He stands up at His place, leans over the table and
// lays His hand on the swollen man's head — sparkles, and the swelling is gone: the man straightens, drops his stick,
// throws up his hands, and Jesus sends him away; he goes off through the gateway, light on his feet.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { rulerHouse, rulerTable, RH, rhHX, DROPSY, dropsyMan, bubble, hush, question, sparkle, voiceRings, headAt, hand, kf, moving, popAt, tr, sheet } from './lib.js';

const MX = 700;          // where the sick man stands, before Him

export default {
  id: 'lk14-lawful',
  beats: [
    { v: 3 },
    { v: 4, text: 'Lecz oni milczeli.' },
    { v: 4, cont: true, text: 'On zaś dotknął go, uzdrowił i odprawił.' },
  ],
  cam: { x: [-90, 20], y: [0, 160], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    const R = rulerHouse(S);
    const T0 = rulerTable(S, R, { seats: [0, 1, 2, 3] });
    const jSit = S.puppet(R.backL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jUp = S.puppet(R.backL.add(person(c, CAST.jesus)));
    const sick = S.puppet(R.frontL.add(dropsyMan(c)));
    const well = S.puppet(R.frontL.add(person(c, DROPSY)));
    const stick = R.frontL.add(`<g opacity="0">${sheet().p(c.ribbon([[0, 0], [4, 102]], 3.4), C.wood2).out()}</g>`);
    const voice = voiceRings(R.fx, c, { n: 3, color: C.sun, r: 26, w: 4 });
    const ask = R.fx.add(`<g opacity="0">${bubble(c, [tr('Czy wolno w szabat', 'Is it lawful'), tr('uzdrawiać, czy też nie?', 'to heal on the Sabbath?')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const q = R.fx.add(`<g opacity="0">${question(c)}</g>`);
    const hushes = [0, 1, 2, 3, 4].map((i) => R.fx.add(`<g opacity="0">${hush(c, { dir: i === 3 || i === 4 ? -1 : 1 })}</g>`));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => R.fx.add(`<g opacity="0">${sparkle(c, 12 + (i % 3) * 3)}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T);
      /* v3 — "Is it lawful to heal on the sabbath, or not?" */
      const speak = es(t, 0.06, 0.18) * (1 - es(t, 0.9, 1.0));
      const up = es(t, 2.04, 2.1);
      const reach = es(t, 2.14, 2.34) * (1 - es(t, 2.52, 2.62));
      const send = es(t, 2.56, 2.7);
      jSit.set({ x: RH.JX, y: RH.SEAT, s: 1.02, flip: true, o: 1 - up, armF: 30 + speak * 50, armB: 10 + speak * 40, head: 6 - speak * 4 + es(t, 1.2, 1.4) * 6, blink: blinkAt(T) });
      jUp.set({ x: RH.JX - 6, y: RH.SEAT, s: 1.02, flip: true, o: up, armF: 20 + reach * 32 + send * 64, armB: 10 + send * 20, lean: reach * 10, head: 8 + reach * 8 - send * 10, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(RH.JX, RH.SEAT, 1.02, true, 62);
      voice(jhx - 4, jhy, speak, T, { dir: -1, spread: 1.8 });
      const k = popAt(ask, t, 0.1, 1.02, jhx + 10, jhy - 46, { d: 0.14 });
      popAt(q, t, 0.45, 1.9, 590, 370 + (T ? Math.sin(T * 1.6) * 4 : 0), { d: 0.12, s: 1.3, r: T ? Math.sin(T * 1.2) * 6 : 0 });
      void k;
      /* v4a — they were silent */
      const bow = es(t, 1.1, 1.3) * (1 - es(t, 2.3, 2.5));
      const turn = es(t, 2.1, 2.3);
      T0.set(t, T, {
        heads: { 0: 6 + bow * 16 - turn * 10, 1: 10 + bow * 14, 2: 10 + bow * 18 - turn * 20, 3: 8 + bow * 16 },
        arms: { 0: [20 + bow * 40, 10 + bow * 50], 1: [60 - bow * 20, 10], 2: [20 + bow * 30, 10], 3: [40 + bow * 20, 10 + bow * 40] },
        hostArmF: 30 + bow * 40, hostArmB: 10 + bow * 60, hostHead: 6 + bow * 14,
      });
      const HP = [[RH.SEATS[0], RH.SEAT, 0.98, false], [RH.SEATS[1], RH.SEAT, 0.98, false], [RH.SEATS[2], RH.SEAT, 0.98, false], [RH.SEATS[3], RH.SEAT, 0.98, true], [rhHX(S), RH.HY, 1.02, true]];
      hushes.forEach((e, i) => {
        const [x, y, s, fl] = HP[i];
        const [hx, hy] = headAt(x, y, s, fl, 62);
        popAt(e, t, 1.14 + i * 0.06, 1.98, hx + (fl ? -14 : 14), hy - 30, { d: 0.12 });
      });
      /* v4b — He touched him, healed him and sent him away */
      const healed = es(t, 2.4, 2.46);
      const joy = bump(t, 2.46, 2.66);
      const GO = [[2.64, MX], [2.98, 300]];
      const gx = kf(t, GO);
      sick.set({ x: MX, y: RH.FL, s: 1.0, o: 1 - healed, armF: 18, armB: 6, lean: 4 - reach * 6, head: -4 + reach * 10, blink: blinkAt(T, 4) });
      well.set({ x: gx, y: RH.FL, s: 1.0, o: healed, flip: t > 2.62, walk: moving(t, GO) ? gx * 0.05 : undefined, amt: 0.9, armF: 20 + joy * 130, armB: 10 + joy * 150, head: -joy * 14, blink: blinkAt(T, 4) });
      const fall = seg(t, 2.42, 2.56);
      const [shx, shy] = hand(MX, RH.FL, 1.0, false, 18);
      pose(stick, { x: shx + fall * 30, y: shy - 10 + fall * 20, r: -8 - fall * 76, o: t > 2.4 && t < 2.98 ? 1 - seg(t, 2.9, 2.98) : 0 });
      const [mhx, mhy] = headAt(MX, RH.FL, 1.0, false);
      sparks.forEach((e, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.4, u = seg(t, 2.36 + i * 0.015, 2.62 + i * 0.015);
        pose(e, { x: mhx + Math.cos(a) * (30 + u * 60), y: mhy + 50 + Math.sin(a) * (40 + u * 70), s: Math.sin(u * Math.PI), r: u * 90, o: u > 0 && u < 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -10], [1.0, -10], [1.9, -40], [2.3, -50], [2.9, -80]]);
      S.cam.y = kf(t, [[0, 120], [1.0, 110], [2.0, 150]]);
      S.cam.z = kf(t, [[0, 1.2], [1.0, 1.16], [2.0, 1.26], [2.9, 1.22]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 0], [2.0, 0], [2.6, -40], [2.9, -90]]); S.cam.z = 1.0; }
    };
  },
};
