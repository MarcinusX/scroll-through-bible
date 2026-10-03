// Łk 18,41–43 — the same place; the blind man stands before Jesus. "What do you want me to do?" "Lord, that I may see
// again" — both hands held out. "Receive your sight. Your faith has healed you": Jesus lifts His hand to the man's
// eyes, and a small light shines there. "Immediately he received his sight, and followed Him, glorifying God": a soft
// light blooms behind his head, his eyes open, he throws up his hands — and as Jesus walks on towards Jericho he goes
// after Him, arms still raised. "All the people, when they saw it, praised God": the whole crowd, in front and behind,
// lifts its hands, and sparks of praise go up over the road.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { jerichoSet, jerichoPeople, BL, JR, words, sparkle, spark, halo, warm, headAt, handAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { BY, JSTOP } = BL;
const HX = JSTOP + 120;
const roadY = (x) => JR.GY - 4 - Math.max(0, x - 900) * 0.16;

export default {
  id: 'lk18-sight',
  beats: [
    { v: 41, text: '«Co chcesz, abym ci uczynił?»' },
    { v: 41, cont: true, text: 'Odpowiedział: «Panie, żebym przejrzał».' },
    { v: 42 },
    { v: 43, text: 'Natychmiast przejrzał i szedł za Nim, wielbiąc Boga.' },
    { v: 43, cont: true, text: 'Także cały lud, który to widział, oddał chwałę Bogu.' },
  ],
  cam: { x: [-20, 80], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const R = jerichoSet(S, { sunX: S.portrait ? 1000 : 1080 });   // phone: the sun clear of the thread
    const c = S.c;
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    R.P.el.parentNode.insertBefore(glowL.el, R.P.el);
    const bloom = glowL.add(`<g opacity="0">${halo(90)}</g>`);
    const JP = jerichoPeople(S, R);
    const J = S.puppet(R.P.add(person(c, CAST.jesus)));
    const what = R.fx.add(`<g opacity="0">${words(c, tr(['Co chcesz,', 'abym ci uczynił?'], ['What do you', 'want me to do?']), { size: 18, side: 1 })}</g>`);
    const see = R.fx.add(`<g opacity="0">${words(c, tr(['Panie,', 'żebym przejrzał!'], ['Lord, that I', 'may see again!']), { size: 18, side: -1 })}</g>`);
    const go = R.fx.add(`<g opacity="0">${words(c, tr(['Przejrzyj, twoja wiara', 'cię uzdrowiła.'], ['Receive your sight.', 'Your faith has healed you.']), { size: 18, side: 1 })}</g>`);
    const eyeLight = R.fx.add(`<g opacity="0">${spark(c, 10)}</g>`);
    const praise = Array.from({ length: 9 }, (_, i) => ({ i, el: R.fx.add(`<g opacity="0">${sparkle(c, 12, C.halo)}</g>`) }));

    return (t, time) => {
      const T = time;
      R.update(T);

      /* Jesus: asks (41a), answers (42), walks on towards Jericho (43a) */
      const touch = es(t, 2.05, 2.25) * (1 - es(t, 2.95, 3.1));
      const on = es(t, 3.35, 3.95);
      const jx = lerp(JSTOP, JSTOP + 190, on);
      J.set({ x: jx, y: roadY(jx) + 12, s: 1.02, flip: false, walk: on > 0 && on < 1 ? jx * 0.06 : undefined, armF: 20 + bump(t, 0.05, 0.95) * 50 + touch * 90, armB: 10 + bump(t, 2.05, 2.95) * 30 + es(t, 4.05, 4.3) * 100, head: 6 * (1 - on) - es(t, 4.05, 4.3) * 12, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JSTOP, roadY(JSTOP) + 12, 1.02, false);
      pose(what, { x: jhx + 10, y: jhy - 44, s: es(t, 0.05, 0.22, ease.back), o: t > 0.05 && t < 1.05 ? 1 - es(t, 0.97, 1.05) : 0 });
      pose(go, { x: jhx + 10, y: jhy - 44, s: es(t, 2.05, 2.22, ease.back), o: t > 2.05 && t < 3.05 ? 1 - es(t, 2.97, 3.05) : 0 });

      /* the man: asks for sight (41b), touched (42), sees (43a), follows glorifying God */
      const healed = es(t, 3.02, 3.08);
      const follow = es(t, 3.35, 3.7);
      const bx = lerp(HX, JSTOP + 30, follow);
      const by = BY - 6 + follow * 34;
      JP.sit.set({ x: 0, y: 0, o: 0 });
      JP.stand.set({ x: HX, y: BY - 6, s: 0.96, flip: true, armF: 60 + bump(t, 1.05, 1.95) * 50, armB: 30 + bump(t, 1.05, 1.95) * 60, head: -6 + touch * -4, o: 1 - healed, blink: 0 });
      const joy = es(t, 3.08, 3.25);
      const walking = follow > 0 && follow < 1;
      JP.see.set({ x: bx, y: by, s: 0.96 + follow * 0.03, flip: t < 3.7, walk: walking ? bx * 0.06 : undefined, armF: 30 + joy * 130, armB: 30 + joy * 140, head: -12 * joy, o: healed, blink: blinkAt(T, 6) });
      const [mhx, mhy] = headAt(HX, BY - 6, 0.96, true);
      pose(see, { x: mhx - 10, y: mhy - 38, s: es(t, 1.05, 1.22, ease.back), o: t > 1.05 && t < 2.05 ? 1 - es(t, 1.97, 2.05) : 0 });
      pose(eyeLight, { x: mhx - 8, y: mhy - 2, s: 0.6 + touch * 0.6, o: es(t, 2.25, 2.4) * (1 - es(t, 3.0, 3.1)) });
      const [shx, shy] = headAt(bx, by, 0.96, t < 3.7);
      pose(bloom, { x: shx, y: shy - 10, s: 0.6 + es(t, 3.02, 3.2) * 0.5, o: es(t, 3.0, 3.15) * (1 - es(t, 3.6, 3.9) * 0.6) });

      /* the crowd, the disciples */
      const up = es(t, 4.05, 4.15);
      const AX = S.portrait ? 1100 : 1180;   // phone: the crowd ahead stands where its praise can be seen
      JP.ahead.set({ x: AX, y: roadY(AX), o: 1 - up });
      JP.aheadUp.set({ x: AX, y: roadY(AX), o: up });
      // the disciples and the crowd behind them stand apart, so the crowd's praising hands are not hidden
      const DXO = S.portrait ? -140 : -170, BXO = S.portrait ? -350 : -410;
      JP.dis.set({ x: JSTOP + DXO + on * 40, y: roadY(JSTOP - 150) + 8 });
      JP.behind.set({ x: JSTOP + BXO + on * 80, y: roadY(JSTOP - 330), o: 1 - up });
      JP.behindUp.set({ x: JSTOP + BXO + on * 80, y: roadY(JSTOP - 330), o: up });
      praise.forEach((p) => {
        const k = T ? (T * 0.35 + p.i / 9) % 1 : (p.i + 0.5) / 9;
        const x = 460 + p.i * 100 + Math.sin(k * 6 + p.i) * 10;
        pose(p.el, { x, y: 520 - k * 180, s: 0.8, o: es(t, 4.1, 4.3) * Math.sin(k * PI) });
      });

      S.cam.x = kf(t, [[0, 40], [3.0, 40], [4.0, 50]]);
      S.cam.y = kf(t, [[0, 20], [3.0, 20], [4.1, 36]]);
      S.cam.z = kf(t, [[0, 1.08], [2.5, 1.1], [3.4, 1.06], [4.2, 1.02]]);
      void mix; void sheet; void shade; void handAt; void seg; void warm;
    };
  },
};
