// J 9,28–29 — they revile him: rough, jagged bubbles scribbled over (restrained — no words). "You are His
// disciple" — a small card with Jesus comes down above the man, and they point at him; "but we are disciples of
// Moses" — a great framed picture comes down above the bench: Moses under Sinai with the tablets. "We know that
// God spoke to Moses" — the cloud of glory on the mountain shines and rings of a voice go out from it (never a
// figure). "But as for this man, we don't know where He comes from" — a card of Jesus with a road that winds off
// into the mist, and a question mark.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hallSet, H, SEER, manPuppet, officials, offSet, iconBubble, say, medallion, framed, sinaiInner, whenceInner, qmark, soundRings, rayBurst, hungPlate,
  iconWord, hanging, drop, kf, headAt, vis, tr, pose, mix, sheet, PI, DY, FONT, INK,
} from './lib.js';

const MX = H.MANX + 20;

export default {
  id: 'j9-moses',
  beats: [
    { v: 28, text: 'Wówczas go zelżyli i rzekli:' },
    { v: 28, cont: true, text: '«Bądź ty sobie Jego uczniem, my jesteśmy uczniami Mojżesza.' },
    { v: 29, text: 'My wiemy, że Bóg przemówił do Mojżesza.' },
    { v: 29, cont: true, text: 'Co do Niego zaś nie wiemy, skąd pochodzi».' },
  ],
  cam: { x: [-40, 350], y: [-110, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const hall = hallSet(S);
    const offL = S.layer({ par: 0.46, sh: 5 });
    const offs = officials(S, offL);
    const act = S.layer({ par: 0.5, sh: 5 });
    const man = manPuppet(S, act, SEER, {});

    /* scribbled, jagged bubbles (reviling — no words) */
    const fx = S.layer({ par: 0.52, sh: 5 });
    const scribble = (w) => {
      const pts = [];
      for (let i = 0; i < 14; i++) pts.push([-w / 2 + (w * i) / 13, (i % 2 ? -1 : 1) * c.rr(6, 12)]);
      return `<path d="${c.ribbon(pts, 3)}" fill="${C.storm2}"/>`;
    };
    const jag = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${say(c, ' ', { size: 22, side: -1, jag: true, w: 110 })}<g transform="translate(-44 -46)">${scribble(70)}</g></g>`));

    /* plates */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const jMed = `<circle r="34" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 26 })}`;
    const hisDisc = hanging(hangL, hungPlate(c, iconWord(`<g transform="translate(0 -4)">${jMed}</g>`, tr('Jego uczeń', 'His disciple'), { y: 48, size: 16 }), { r: 66 }), { x: 0, y: 0, len: 900 });
    const W = 330, HH = 210;
    const sinai = hanging(hangL, framed(S, sinaiInner(c, W, HH) + `<text x="${W / 2}" y="${HH - 10}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${INK}">${tr('uczniowie Mojżesza', 'disciples of Moses')}</text>`, { w: W, h: HH, k: 'sinai' }), { x: 0, y: 0, len: 900 });
    const whence = hanging(hangL, framed(S, whenceInner(c, 240, 170) + `<g transform="translate(60 60)">${jMed}</g><g transform="translate(196 60) scale(1.6)">${qmark(c, C.terracotta)}</g>`, { w: 240, h: 170, k: 'whence' }), { x: 0, y: 0, len: 900 });
    const voiceL = S.layer({ par: 0.3, sh: 0, flat: true });
    const voice = soundRings(voiceL, c, { n: 3, r: 18, w: 3, col: C.haloRim });
    const beams = voiceL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 14, r1: 110, spread: 0.05, color: '#fff1c4', o: 0.8 })}</g>`);

    hall.front();
    const P = S.portrait;

    return (t, time) => {
      const T = time;
      hall.door(0, 0);
      /* the man takes it, then stands his ground */
      const hit = bump(t, 0.05, 0.95);
      man.p.set({ x: MX - hit * 20, y: H.FLOOR + 8, s: 1.02, armF: 18 + hit * 30, armB: 12 + hit * 40, head: hit * 8 - bump(t, 1.2, 1.9) * 6, lean: -hit * 4, blink: blinkAt(T, 3) });
      fade(man.sad, hit * 0.6);

      offs.forEach((o) => {
        const rev = bump(t, 0.05, 0.95) * (o.i % 2 ? 1 : 0.7);
        const atHim = bump(t, 1.05, 1.5) * (o.i === 4 ? 1 : 0.3);
        const self = bump(t, 1.45, 1.95);
        const up = bump(t, 2.05, 2.95) * (o.i === 2 || o.i === 0 ? 1 : 0.4);
        const shrug = bump(t, 3.05, 3.95);
        offSet(o, T, {
          armF: 18 + rev * 70 + atHim * 70 + self * 20 + shrug * 40, armB: 8 + rev * (o.i === 0 ? 120 : 30) + up * 150 + shrug * 50,
          head: -up * 12 + shrug * 6, lean: rev * 6, angry: Math.max(0.4, rev, atHim), sad: 0,
        });
      });
      const [o1x, o1y] = headAt(952, H.SEAT + 12, 0.98, true, DY.sit);
      const [o4x, o4y] = headAt(868, H.FLOOR + 10, 1, true);
      const [o0x, o0y] = headAt(1222, H.FLOOR + 4, 1, true);
      [[o4x, o4y, 0.05], [o1x, o1y, 0.18], [o0x, o0y, 0.3]].forEach(([x, y, a], i) => {
        const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, 0.9, 1.0));
        vis(jag[i], { x: x - 14, y: y - 24, s: k * 0.9, r: Math.sin(T * 9 + i) * 2, o: k > 0.01 ? 1 : 0 });
      });

      /* v28b — His disciple / disciples of Moses */
      const hk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      drop(hisDisc, MX + 10, 230, hk, T, { amp: 1.2 });
      const sk = es(t, 1.4, 1.75, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      drop(sinai, 1010, 120, sk, T, { amp: 0.7 });
      /* v29a — God spoke to Moses: the glory shines, a voice goes out (no figure) */
      const gx = 1010 - W / 2 + W * 0.62, gy = 120 + 56;
      const speak = bump(t, 2.08, 2.98);
      voice(gx, gy, speak * sk, T, { speed: 0.7, spread: 2.6 });
      vis(beams, { x: gx, y: gy, s: 0.6 + speak * 0.5, r: T * 5, o: speak * sk });
      /* v29b — whence? */
      drop(whence, 1000, 170, es(t, 3.1, 3.45, ease.out), T, { amp: 0.9 });

      // phone: the camera stays further right and wider, so the man and the whole bench are in view
      S.cam.x = P ? 340 : kf(t, [[0, 120], [1, 120], [1.2, 60], [1.6, 120], [2, 140], [3, 140], [4, 120]]);
      S.cam.y = kf(t, [[0, 0], [1, 0], [1.2, -50], [2.0, -100], [3, -100], [3.2, -70], [4, -70]]);
      S.cam.z = P ? 1 : kf(t, [[0, 1.12], [1, 1.12], [1.2, 1.04], [2, 1.02], [3, 1.06], [4, 1.06]]);
    };
  },
};
