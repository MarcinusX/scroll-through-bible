// Łk 17,15–16 — the road by the village. "One of them, when he saw that he was healed, turned back, glorifying God
// with a loud voice": the last of the ten stops before the gate and looks at his hands — clean — then turns and runs
// back down the road with both arms up, his voice ringing up to heaven in golden rings. "He fell on his face at Jesus'
// feet, giving Him thanks": he throws himself down before Jesus, face to the ground, and a warm heart glows over him.
// "And he was a Samaritan": a name tag comes down over him — "a Samaritan" — and the four look at one another.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, LEP, lepPhone, lepS, SAMARITAN, sparkle, heart, nameTag, strung, flyIn, voiceRings, headAt, halo, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { JX, JY } = LEP;
const START0 = [1016, 660], KNEEL = [800, 722];

export default {
  id: 'lk17-thanks',
  beats: [
    { v: 15 },
    { v: 16, text: 'upadł na twarz do nóg Jego i dziękował Mu.' },
    { v: 16, cont: true, text: 'A był to Samarytanin.' },
  ],
  cam: { x: [0, 100], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const { DIS, LX } = lepPhone(S);   // phone: the four closer, the Samaritan starts a step in from the thread
    const START = [START0[0] + LX, START0[1]];
    const R = roadSet(S, { village: true });
    const c = S.c;
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const F = roadFour(S, act, c);
    const sam = S.puppet(act.add(person(c, SAMARITAN)));
    const down = S.puppet(act.add(person(c, { ...SAMARITAN, pose: 'kneel' })));
    const praise = voiceRings(act, c, { n: 4, color: C.sun, r: 34, w: 6, both: true });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const sparks = [0, 1, 2, 3].map((i) => fx.add(`<g opacity="0">${sparkle(c, 10 + (i % 2) * 4)}</g>`));
    const love = fx.add(`<g opacity="0">${heart(c, 14)}</g>`);
    const tag = fx.add(`<g transform="translate(0 -1500)">${strung(nameTag(c, tr('Samarytanin', 'a Samaritan'), { size: 20 }), 0)}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.12 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, o: 0.7 });

      /* v15 — he sees he is healed, turns back, praising God aloud */
      const look = bump(t, 0.02, 0.4);
      const run = es(t, 0.35, 0.95, (x) => x);
      const x = lerp(START[0], KNEEL[0], run), y = lerp(START[1], KNEEL[1], run);
      const s = lerp(lepS(START[1]), 0.96, run);
      const fall = es(t, 1.04, 1.14);
      const up = es(t, 0.35, 0.5);
      sam.set({ x, y, s, flip: true, walk: run > 0 && run < 1 ? t * 44 : undefined, amt: 1.3, armF: 30 + look * 60 + up * 70 * (1 - es(t, 0.9, 1.0)), armB: 10 + look * 60 + up * 140 * (1 - es(t, 0.9, 1.0)), head: look * 18 - up * 16, lean: -up * 4, o: 1 - fall, blink: blinkAt(T, 4) });
      const [hx, hy] = headAt(x, y, s, true);
      praise(hx, hy - 30, up * (1 - es(t, 0.95, 1.05)), T, { spread: 2.6, s0: 0.6 });
      sparks.forEach((el, i) => {
        const k = bump(t, 0.05 + i * 0.05, 0.4 + i * 0.05);
        pose(el, { x: START[0] - 20 + i * 14, y: START[1] - 130 - (i % 2) * 30, s: k * 0.9, r: T * 40, o: k });
      });

      /* v16a — on his face at Jesus' feet, giving thanks */
      const prone = es(t, 1.1, 1.35);
      const rise = es(t, 2.05, 2.3);
      down.set({ x: KNEEL[0], y: KNEEL[1], s: 0.96, flip: true, armF: 40 + prone * 50, armB: 30 + prone * 60, lean: prone * 52 * (1 - rise * 0.6), head: prone * 22 * (1 - rise * 0.5), o: fall, blink: blinkAt(T, 4) });
      const lk = es(t, 1.3, 1.5, ease.back);
      pose(love, { x: KNEEL[0] - 30, y: KNEEL[1] - 150, s: lk, o: lk > 0.01 ? 1 : 0 });

      /* Jesus looks down on him, His hand over him */
      const over = es(t, 1.2, 1.5);
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + over * 50, armB: 8, head: over * 12, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });

      /* v16b — "and he was a Samaritan": the tag, the four look at one another */
      flyIn(tag, es(t, 2.08, 2.35, ease.back), KNEEL[0] + 30, 470, T, 1, 1.2);
      F.ds.forEach((d) => {
        const [, dx, dy] = DIS.find((e) => e[0] === d.k);
        const w = es(t, 2.3, 2.5);
        const turn = d.k === 'peter' ? w : 0;
        d.p.set({ x: dx, y: dy, s: 0.96, flip: turn > 0.5, armF: 20 + es(t, 0.4, 0.7) * 20 + w * (d.k === 'john' ? 50 : 20), armB: 6 + w * (d.k === 'peter' ? 60 : d.k === 'andrew' ? 90 : 0), head: -4 + w * (d.k === 'john' ? -8 : 6), blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, 90], [0.6, 60], [1.2, 30], [3, 30]]);
      S.cam.y = kf(t, [[0, 0], [1.2, 40], [3, 40]]);
      S.cam.z = kf(t, [[0, 1.06], [1.2, 1.12], [2.2, 1.14], [3, 1.12]]);
    };
  },
};
