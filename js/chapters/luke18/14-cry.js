// Łk 18,39–40 — the same place. "Those who led the way rebuked him, that he should be quiet": two men from the front
// of the crowd turn back on him, fingers up — "Quiet!" "But he cried out all the more: Son of David, have mercy on
// me!" — a bigger cry, both hands flung up. "Standing still, Jesus commanded him to be brought to Him": Jesus stops on
// the road and holds out His hand; the man who told him and another help him up and lead him by the hand. "When he had
// come near, He asked him" — Jesus bends a little towards him.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { jerichoSet, jerichoPeople, BL, JR, words, say, manO, voiceRings, headAt, handAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { BX, BY, JSTOP } = BL;
const roadY = (x) => JR.GY - 4 - Math.max(0, x - 900) * 0.16;
const HX = JSTOP + 120;           // where he is brought to stand before Jesus

export default {
  id: 'lk18-cry',
  beats: [
    { v: 39, text: 'Ci, co szli na przedzie, nastawali na niego, żeby umilkł.' },
    { v: 39, cont: true, text: 'Lecz on jeszcze głośniej wołał: «Jezusie, Synu Dawida, ulituj się nade mną!»' },
    { v: 40, text: 'Jezus przystanął i kazał przyprowadzić go do siebie.' },
    { v: 40, cont: true, text: 'A gdy się zbliżył, zapytał go:' },
  ],
  cam: { x: [-20, 80], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const R = jerichoSet(S, { sunX: S.portrait ? 1000 : 1080 });   // phone: the sun clear of the thread
    const c = S.c;
    const JP = jerichoPeople(S, R);
    const hushers = [0, 1].map((i) => ({ i, p: S.puppet(R.P.add(person(c, manO(c, { robe: [C.ochreRobe, C.mauve][i], mantle: [C.stone, null][i] })))), seed: c.rr(0, 9) }));
    const teller = S.puppet(R.P.add(person(c, manO(c, { robe: C.tealRobe, mantle: C.wheatRobe }))));
    const J = S.puppet(R.P.add(person(c, CAST.jesus)));
    const rings = voiceRings(R.fx, c, { n: 3, color: C.terracotta, r: 30, w: 4 });
    const hush = hushers.map(() => R.fx.add(`<g opacity="0">${words(c, tr('Cicho!', 'Quiet!'), { size: 19, side: S.portrait ? -1 : 1 })}</g>`));   // phone: they open to the left
    const cry2 = R.fx.add(`<g opacity="0">${say(c, tr(['JEZUSIE, SYNU DAWIDA,', 'ULITUJ SIĘ NADE MNĄ!'], ['JESUS, SON OF DAVID,', 'HAVE MERCY ON ME!']), { size: 20, side: -1, jag: true, bold: true })}</g>`);
    const bring = R.fx.add(`<g opacity="0">${words(c, tr('Przyprowadźcie go!', 'Bring him to me!'), { size: 18, side: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T);
      const jx = lerp(700, JSTOP, es(t, 0, 2.1, (u) => u));
      const stopped = t >= 2.1;
      JP.ahead.set({ x: 1180, y: roadY(1180) });
      JP.aheadUp.set({ x: 1180, y: roadY(1180), o: 0 });
      JP.dis.set({ x: jx - 150, y: roadY(jx - 150) + 8 });
      JP.behind.set({ x: jx - 330, y: roadY(jx - 330) });
      JP.behindUp.set({ x: jx - 330, y: roadY(jx - 330), o: 0 });

      /* Jesus: walking, stops (v40a) and calls; bends to him (v40b) */
      const call = es(t, 2.1, 2.3) * (1 - es(t, 2.9, 3.1));
      const bendJ = es(t, 3.3, 3.5);
      J.set({ x: jx, y: roadY(jx) + 12, s: 1.02, flip: false, walk: stopped ? undefined : jx * 0.06, armF: 14 + call * 80 + bendJ * 50, armB: 10 + call * 40, head: bendJ * 8, lean: bendJ * 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(jx, roadY(jx) + 12, 1.02, false);
      pose(bring, { x: jhx + 20, y: jhy - 40, s: es(t, 2.15, 2.32, ease.back), o: t > 2.15 && t < 3.05 ? 1 - es(t, 2.95, 3.05) : 0 });

      /* the two who rebuke him */
      hushers.forEach((h) => {
        const k = es(t, 0.05 + h.i * 0.08, 0.3 + h.i * 0.08) * (1 - es(t, 2.1, 2.4));
        const x = lerp(1250 + h.i * 70, BX + (S.portrait ? 30 + h.i * 40 : 90 + h.i * 70), k);   // phone: the two stand inside the screen
        const r = es(t, 0.2, 0.35) * (1 - es(t, 1.9, 2.1));
        h.p.set({ x, y: BY - 22 - h.i * 10, s: 0.94, flip: true, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 20 + r * 130, armB: 10 + r * 30, lean: -r * 8, head: r * 10, o: t > 0.02 ? 1 : 0, blink: blinkAt(T, h.seed) });
        const [hx, hy] = headAt(x, BY - 22 - h.i * 10, 0.94, true);
        pose(hush[h.i], { x: hx + (S.portrait ? -6 : 10), y: hy - 30 - (S.portrait ? h.i * 46 : 0), s: es(t, 0.25 + h.i * 0.08, 0.42 + h.i * 0.08, ease.back), o: t > 0.25 && t < 1.05 ? 1 - es(t, 0.97, 1.05) : 0 });
      });

      /* the blind man: shushed (v39a), louder (v39b), helped up and led to Jesus (v40a), before Him (v40b) */
      const shout = bump(t, 1.05, 1.98);
      const up = es(t, 2.35, 2.42);
      const lead = es(t, 2.45, 3.1);
      JP.sit.set({ x: BX, y: BY, s: 0.94, flip: true, armF: 40 + shout * 130 + es(t, 2.1, 2.3) * 40, armB: shout * 165, head: -6 - shout * 16 + bump(t, 0.2, 0.9) * 10, lean: -shout * 5, o: 1 - up, blink: 0 });
      const bx = lerp(BX, HX, lead);
      JP.stand.set({ x: bx, y: BY - 6, s: 0.96, flip: true, walk: lead > 0 && lead < 1 ? bx * 0.06 : undefined, amt: 0.7, armF: 60 + es(t, 3.3, 3.5) * 20, armB: 30, head: -6, o: up, blink: 0 });
      JP.see.set({ x: bx, y: BY, o: 0 });
      const [bhx, bhy] = headAt(BX, BY, 0.94, true, 'sit');
      rings(bhx - 10, bhy + 4, shout * 1.4, T, { spread: 2.8, dir: -1 });
      pose(cry2, { x: bhx - 16, y: bhy - 40, s: es(t, 1.08, 1.26, ease.back) * 1.1, o: t > 1.08 && t < 2.05 ? 1 - es(t, 1.95, 2.05) : 0 });

      /* the man who told him leads him by the hand */
      const tx = t < 2.2 ? lerp(1360, 1300, 0) : lerp(BX + 60, HX + 60, lead);
      const inT = es(t, 2.1, 2.4);
      const tX = lerp(1360, BX + 60, inT);
      const X = t < 2.4 ? tX : tx;
      teller.set({ x: X, y: BY - 12, s: 0.94, flip: true, walk: (inT > 0 && inT < 1) || (lead > 0 && lead < 1) ? X * 0.05 : undefined, armF: 40 + inT * 30, armB: 10, lean: -inT * 6 * (1 - lead), o: es(t, 2.1, 2.2), blink: blinkAt(T, 3) });

      S.cam.x = kf(t, [[0, 60], [2.0, 50], [3.0, 30], [4.0, 30]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.06], [2.0, 1.06], [3.3, 1.08]]);
      void mix; void sheet; void handAt; void seg; void PI;
    };
  },
};
