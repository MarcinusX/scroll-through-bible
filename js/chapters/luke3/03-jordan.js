// Łk 3,3 — John goes about the whole Jordan valley: staff in hand he wades along the shallows from village to
// village, and as he passes, the people of each village come down to the far bank. Then he stops at the ford
// and proclaims a baptism of repentance for the forgiveness of sins: a man bent under a
// heavy dark sack wades to him and kneels; the water is poured; the sack slips from his back into the current
// and dissolves as it drifts away, and the man stands up straight, his hands raised.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { town } from '../../assets/nature.js';
import {
  JOHN_B, hand, headAt, jordanSet, shell, drops, hungWord, voiceRings, folk, group, sinSack, stain, JORDAN_DAY,
  tr, es, ease, bump, seg, fade, PI,
} from './lib.js';

const BANK = 776, WADE = 702, JX = 800;

export default {
  id: 'lk3-jordan',
  beats: [
    { v: 3, text: 'Obchodził więc całą okolicę nad Jordanem' },
    { v: 3, cont: true, text: 'i głosił chrzest nawrócenia dla odpuszczenia grzechów,' },
  ],
  cam: { x: [-40, 60], y: [0, 110], z: [0.98, 1.18] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: JORDAN_DAY, sunAt: [1240, 150], city: false, path: false });
    const { fbFn, far, hill } = J;
    hill.add(town(c, { x: 330, y: 452, n: 6, spread: 220, sc: 0.55 }) + town(c, { x: 1060, y: 476, n: 5, spread: 200, sc: 0.5 }) + town(c, { x: 1450, y: 470, n: 5, spread: 200, sc: 0.5 }));

    /* the villagers who come down to the far bank as he passes */
    const VIL = [[1300, 3, 0.18], [1080, 2, 0.3], [620, 3, 0.52], [380, 3, 0.66]].map(([x, n, a], i) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > 800, o: folk(c) }));
      return { x, a, i, sp: far.sprite(`<g transform="scale(.42)">${group(c, mem)}</g>`, x, fbFn(x) + 8) };
    });

    /* in the river: John (after he steps in), the man with the sack, two more waiting */
    const R = J.riverLayer();
    const johnW = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g data-k="j-shell" transform="rotate(-20)">${shell(c, 15)}</g>`, holdB: `<g data-k="j-staff" transform="translate(0 -30) rotate(-8)"><path d="${c.ribbon([[0, -60], [2, 130]], 5)}" fill="${C.wood2}"/></g>` })));
    const shellEl = S.$('j-shell'), staffEl = S.$('j-staff');
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const MAN = { robe: C.dustyBlue, hairStyle: 'curly', hair: C.hair3, beard: 'short', skin: C.skin3, belt: C.leather };
    const man = S.puppet(R.add(person(c, MAN)));
    const manK = S.puppet(R.add(person(c, { ...MAN, pose: 'kneel' })));
    const sackEl = R.add(`<g>${sinSack(c, 56, 62)}</g>`);
    const WAIT = [{ o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin }, x: 1130 }, { o: { robe: C.sageRobe, hairStyle: 'wrap', veil: C.stone, hair: C.hair, beard: 'full', skin: C.skin2 }, x: 1230 }]
      .map((w, i) => ({ ...w, i, p: S.puppet(R.add(person(c, w.o))), sack: R.add(`<g>${sinSack(c, 44, 50)}</g>`) }));
    J.waterFront(R);
    const stainEl = R.add(`<g>${stain(c, 44)}</g>`);
    const bits = [0, 1, 2, 3].map((i) => R.add(`<g>${stain(c, 12 + (i % 2) * 5)}</g>`));
    const wake = [0, 1, 2].map(() => R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 40, 9, 0, PI * 2, 24), 2.6)}" fill="${C.foam}"/></g>`));
    const splash = R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 50, 11, 0, PI * 2, 26), 3)}" fill="${C.foam}"/><path d="${c.ribbon(c.arc(0, 0, 28, 6, 0, PI * 2, 20), 2.4)}" fill="${C.foam}"/></g>`);
    const voice = voiceRings(R, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });

    /* the near bank */
    J.nearBank();
    J.foreground();

    /* the words from the flies */
    const fly = S.layer({ par: 0.15, sh: 6 });
    const w1 = fly.add(hungWord(c, tr('cała okolica nad Jordanem', 'all the region around the Jordan'), { size: 22 }));
    const w2 = fly.add(hungWord(c, tr('chrzest nawrócenia', 'the baptism of repentance'), { size: 22 }));

    return (t, time) => {
      J.update(t, time);

      /* v3a — along the river, from village to village */
      const walk = es(t, 0.05, 0.98, ease.sine);
      const jx = lerp(1380, JX, walk);
      wake.forEach((w, i) => {
        const k = time ? ((time * 0.6 + i / 3) % 1) : (i + 1) / 3.5;
        pose(w, { x: jx + 30 + k * 90, y: 652, s: 0.5 + k * 0.8, o: (walk > 0.02 && walk < 1 ? 1 : 0) * (1 - k) * 0.8 });
      });
      VIL.forEach((v) => {
        const k = es(t, v.a, v.a + 0.3);
        v.sp.set({ x: lerp(v.x + (v.x > 800 ? 160 : -160), v.x, k), y: fbFn(v.x) + 8 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 18)) * 2 : 0), o: k > 0.01 ? 1 : 0 });
      });
      const k1 = es(t, 0.1, 0.4, ease.out), u1 = es(t, 0.95, 1.15, ease.in);
      pose(w1, { x: 900, y: lerp(-420, 250, k1) - u1 * 700, r: Math.sin(time * 0.8) * 1.2, o: k1 > 0.01 && u1 < 1 ? 1 : 0 });

      /* v3b — he steps into the river and proclaims the baptism of repentance */
      const inR = es(t, 1.0, 1.06);
      const pour = es(t, 1.42, 1.54) * (1 - es(t, 1.72, 1.82));
      const cry = es(t, 1.08, 1.25) * (1 - es(t, 1.4, 1.5)) + es(t, 1.8, 1.95);
      const turn = t > 1.02;
      johnW.set({ x: jx, y: WADE, s: 1.04, flip: !turn, walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined, armF: 24 + pour * 84 + cry * 50, armB: 10 + cry * 110 + (turn ? 0 : 14), head: pour * 8 - cry * 10 + (turn ? 0 : bump(t, 0.2, 0.9) * -8), blink: blinkAt(time, 2) });
      fade(staffEl, 1 - inR);
      fade(shellEl, inR);
      const [hx, hy] = headAt(JX, WADE, 1.04);
      voice(hx + 14, hy, cry * inR, time, { spread: 2.6, dir: 1 });
      const [px, py] = hand(JX, WADE, 1.04, false, 24 + pour * 84);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 1.46, 1.52) * (1 - seg(t, 1.7, 1.76)) });
      const k2 = es(t, 1.1, 1.38, ease.out), u2 = es(t, 1.95, 2.0);
      pose(w2, { x: 820, y: lerp(-420, 240, k2), r: Math.sin(time * 0.8 + 1) * 1.2, o: k2 > 0.01 && u2 < 1 ? 1 : 0 });

      /* the man bent under his sack: wades in, kneels, the sack slips into the water and dissolves */
      const come = es(t, 1.06, 1.36);
      const mx = lerp(1300, 925, come);
      const kneel = es(t, 1.36, 1.41) * (1 - es(t, 1.66, 1.71));
      const up = es(t, 1.66, 1.72);
      man.set({ x: mx, y: WADE, s: 1, flip: true, o: seg(t, 1.04, 1.08) * (1 - kneel), walk: come > 0 && come < 1 ? mx * 0.05 : undefined, lean: 12 * (1 - up), head: 10 * (1 - up) - up * 12, armF: 30 + up * 60, armB: 10 + up * 140, blink: blinkAt(time, 4) });
      manK.set({ x: 925, y: WADE, s: 1, flip: true, o: kneel, head: 14, armF: 60, armB: 40, lean: 8, blink: blinkAt(time, 4) });
      const off = es(t, 1.52, 1.66, ease.in);
      const onBackX = mx + 30, onBackY = WADE - (kneel > 0.5 ? 80 : 108);
      pose(sackEl, { x: lerp(onBackX, 985, off), y: lerp(onBackY, 668, off), r: 14 + off * 70, s: 1 - off * 0.2, o: seg(t, 1.04, 1.08) * (1 - es(t, 1.66, 1.72)) });
      pose(splash, { x: 990, y: 656, s: 0.6 + seg(t, 1.6, 1.9) * 1.2, o: bump(t, 1.6, 1.9) * 0.9 });
      const drift = seg(t, 1.64, 2.3);
      pose(stainEl, { x: 1000 + drift * 240, y: 670 + drift * 8, s: 0.7 + drift * 0.7, o: seg(t, 1.62, 1.68) * (1 - es(t, 1.85, 2.3)) });
      bits.forEach((b, i) => {
        const k = seg(t, 1.66 + i * 0.03, 2.2 + i * 0.03);
        pose(b, { x: 1000 + k * (200 + i * 60), y: 668 + (i % 2 ? -8 : 10) * k, s: 1 - k * 0.6, o: bump(t, 1.64 + i * 0.03, 2.25) * 0.8 });
      });
      WAIT.forEach((w) => {
        const k = es(t, 1.12 + w.i * 0.08, 1.4 + w.i * 0.08);
        const x = w.x + (1 - k) * 200;
        w.p.set({ x, y: WADE, s: 0.96, flip: true, o: k, walk: k > 0 && k < 1 ? x * 0.05 : undefined, lean: 10, head: 10, armF: 30, blink: blinkAt(time, 6 + w.i) });
        pose(w.sack, { x: x + 28, y: WADE - 102, r: 12, o: k });
      });

      /* camera: wide along the river, then in to the ford */
      const close = es(t, 0.95, 1.3);
      S.cam.x = 50 * (1 - walk) - 10 * walk * (1 - close) + close * 50;
      S.cam.z = 0.99 + close * 0.15;
      S.cam.y = 30 + close * 70;
    };
  },
};
