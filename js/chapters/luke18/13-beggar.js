// Łk 18,35–38 — the road into Jericho, the city of palms ahead at the right. "As He came near Jericho, a certain blind
// man sat by the road, begging": the blind man (Mark's Bartimaeus; Luke gives no name) sits on his spread cloak with
// his bowl, eyes shut, while down the road from the left comes a crowd, the disciples and Jesus among them. "Hearing a
// multitude going by, he asked what this meant": the tramp of their feet reaches him in rings, he turns his head,
// hand raised — "What is happening?" "They told him that Jesus of Nazareth was passing by": a man from the crowd
// bends down to him and tells him. "He cried out, 'Jesus, you son of David, have mercy on me!'" — both arms up, a
// great cry.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { jerichoSet, jerichoPeople, BL, JR, words, say, manO, voiceRings, headAt, handAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { BX, BY } = BL;
const roadY = (x) => JR.GY - 4 - Math.max(0, x - 900) * 0.16;

export default {
  id: 'lk18-beggar',
  beats: [
    { v: 35 },
    { v: 36 },
    { v: 37 },
    { v: 38 },
  ],
  cam: { x: [-80, 60], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const R = jerichoSet(S);
    const c = S.c;
    const JP = jerichoPeople(S, R);
    const teller = S.puppet(R.P.add(person(c, manO(c, { robe: C.tealRobe, mantle: C.wheatRobe }))));
    const J = S.puppet(R.P.add(person(c, CAST.jesus)));
    const rings = voiceRings(R.fx, c, { n: 3, color: C.terracotta, r: 30, w: 4 });
    const feet = voiceRings(R.fx, c, { n: 3, color: shade(C.sand2, -0.2), r: 40, w: 5 });
    const what = R.fx.add(`<g opacity="0">${words(c, tr('Co się dzieje?', 'What is happening?'), { size: 18, side: -1 })}</g>`);
    const told = R.fx.add(`<g opacity="0">${words(c, tr(['Jezus z Nazaretu', 'przechodzi!'], ['Jesus of Nazareth', 'is passing by!']), { size: 18, side: 1 })}</g>`);
    const cry = R.fx.add(`<g opacity="0">${say(c, tr(['Jezusie, Synu Dawida,', 'ulituj się nade mną!'], ['Jesus, son of David,', 'have mercy on me!']), { size: 19, side: -1, jag: true })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T);

      /* the procession: the crowd in front passes him; the disciples; Jesus; the crowd behind */
      const go = (a, b) => es(t, a, b, (u) => u);
      const ax = lerp(700, 1180, go(0, 3.9));
      const bob = (x) => (T ? Math.abs(Math.sin(x * 0.05)) * -3 : 0);
      JP.ahead.set({ x: ax, y: roadY(ax) + bob(ax) });
      JP.aheadUp.set({ x: ax, y: roadY(ax), o: 0 });
      const jx = lerp(520, 720, go(0, 4));
      JP.dis.set({ x: jx - 150, y: roadY(jx - 150) + 8 + bob(jx + 40) });
      JP.behind.set({ x: jx - 330, y: roadY(jx - 330) + bob(jx + 90) });
      JP.behindUp.set({ x: jx - 330, y: roadY(jx - 330), o: 0 });
      J.set({ x: jx, y: roadY(jx) + 12, s: 1.02, flip: false, walk: jx * 0.06, head: -2, blink: blinkAt(T) });

      /* the blind man */
      const listen = es(t, 1.05, 1.25);
      const shout = bump(t, 3.05, 3.95);
      JP.sit.set({ x: BX, y: BY, s: 0.94, flip: true, armF: 40 + listen * 40 * (1 - es(t, 2.9, 3.05)) + shout * 110, armB: shout * 150 + listen * 20, head: -8 + listen * 14 * (1 - es(t, 2.1, 2.3)) - shout * 14, lean: -shout * 4, blink: 0 });
      JP.stand.set({ x: BX, y: BY, o: 0 });
      JP.see.set({ x: BX, y: BY, o: 0 });
      const [bhx, bhy] = headAt(BX, BY, 0.94, true, 'sit');
      feet(bhx + 30, bhy + 10, bump(t, 1.02, 1.95) * 0.9, T, { spread: 1.6, dir: -1 });
      pose(what, { x: bhx - 16, y: bhy - 38, s: es(t, 1.2, 1.38, ease.back), o: t > 1.2 && t < 2.05 ? 1 - es(t, 1.95, 2.05) : 0 });
      rings(bhx - 10, bhy + 4, shout * 1.1, T, { spread: 2.2, dir: -1 });
      pose(cry, { x: bhx - 16, y: bhy - 40, s: es(t, 3.08, 3.26, ease.back), o: t > 3.08 ? 1 : 0 });

      /* the man who tells him */
      const bend = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const tx = lerp(1300, BX + 110, es(t, 1.7, 2.05)) + es(t, 2.95, 3.3) * 60;
      teller.set({ x: tx, y: BY - 18, s: 0.94, flip: true, walk: (t > 1.7 && t < 2.05) || (t > 2.95 && t < 3.3) ? tx * 0.05 : undefined, armF: 20 + bend * 60, armB: 10, lean: -bend * 14, head: bend * 14, o: es(t, 1.65, 1.75), blink: blinkAt(T, 3) });
      const [thx, thy] = headAt(tx, BY - 18, 0.94, true);
      pose(told, { x: thx + 10, y: thy - 30, s: es(t, 2.1, 2.28, ease.back), o: t > 2.1 && t < 3.05 ? 1 - es(t, 2.95, 3.05) : 0 });

      S.cam.x = kf(t, [[0, -30], [1.0, 20], [2.0, 50], [3.0, 40], [4.0, 20]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.06], [3.0, 1.06], [4.0, 1.04]]);
      void mix; void sheet; void handAt; void seg; void PI;
    };
  },
};
