// Łk 5,17 — Capernaum, the house cut open like a doll's house. One day Jesus is teaching inside: the room is full,
// people crowd the doorway and the street, and slips of His words fly out over all of them. On the bench along the
// wall sit the Pharisees and teachers of the Law — and little tags come down over them on strings: from Galilee,
// from Judea, from Jerusalem. And the power of the Lord was with Him to heal: a warm light rises behind Him and
// sparks drift out through the room and the door to the sick waiting outside.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  houseSet, houseCast, HS, JH, SEATX, placeTag, wordSlip, sparkle, rayBurst, headAt, kf, DAY, es, ease, bump, seg, tr, PI,
} from './lib.js';

export default {
  id: 'lk5-teachers',
  beats: [
    { v: 17, text: 'Pewnego dnia, gdy nauczał,' },
    { v: 17, cont: true, text: 'siedzieli przy tym faryzeusze i uczeni w Prawie, którzy przyszli ze wszystkich miejscowości Galilei, Judei i Jerozolimy.' },
    { v: 17, cont: true, text: 'A była w Nim moc Pańska, że mógł uzdrawiać.' },
  ],
  cam: { x: [-300, 180], y: [-40, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const H = houseSet(S, { skyCols: DAY });
    const P = houseCast(S, H);
    const glow = H.glowL.add(`<g><circle r="220" fill="url(#warm-glow)"/>${rayBurst(c, { n: 18, r0: 40, r1: 240, spread: 0.04, o: 0.3 })}</g>`);

    const fx = S.layer({ par: 0.5, sh: 4 });
    const words = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(24, 34))), to: [lerp(460, 1400, i / 9) + c.rr(-20, 20), i % 2 ? c.rr(360, 420) : c.rr(460, 540)], seed: c.rr(0, 6) }));
    const TAGS = [tr('z Galilei', 'from Galilee'), tr('z Judei', 'from Judea'), tr('z Jerozolimy', 'from Jerusalem')];
    const tags = TAGS.map((txt, i) => ({ i, el: fx.add(`<g><path d="M0 -1600V-14" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${placeTag(c, txt, 17)}</g>`) }));
    const sparks = Array.from({ length: 9 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 9 + (i % 3) * 4)}</g>`), to: [lerp(980, 1480, (i % 5) / 4) + c.rr(-30, 30), c.rr(420, 640)], d: c.rr(0, 1) }));

    return (t, time) => {
      const T = time;
      H.idle(T);
      P.crowd(0, 1);

      /* v17a — He teaches; the words fly out */
      const teach = es(t, 0.05, 0.3) * (1 - es(t, 2.1, 2.3) * 0.5);
      P.jesus.set({ x: JH.x, y: HS.FLOOR, s: JH.s, flip: true, armF: 16 + teach * (50 + (T ? Math.sin(T * 1.5) * 16 : 0)), armB: 10 + teach * 30 + es(t, 2.05, 2.3) * 40, head: -teach * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JH.x, HS.FLOOR, JH.s, true);
      words.forEach((w) => {
        const k = ((T * 0.2 + w.i / words.length) % 1);
        const on = es(t, 0.1, 0.35) * (1 - es(t, 1.9, 2.1));
        const x = lerp(hx, w.to[0], k), y = lerp(hy - 10, w.to[1], k) - Math.sin(k * PI) * 50;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.seed) * 12, s: 0.45 + k * 0.4, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });

      /* v17b — the teachers of the Law on the bench, and where they came from */
      P.scribes.forEach((m) => {
        const look = es(t, 1.05 + m.i * 0.05, 1.3 + m.i * 0.05);
        m.p.set({ x: m.x, y: m.y, s: 0.8, flip: false, armF: 24 + (m.i % 2) * 14 + (m.i === 2 ? look * 40 : 0), armB: 14 + (m.i === 1 ? look * 30 : 0), head: (m.i % 2 ? -4 : 4) - look * 4, blink: blinkAt(T, m.seed) });
      });
      tags.forEach((g) => {
        const k = es(t, 1.08 + g.i * 0.12, 1.4 + g.i * 0.12, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
        const x = [SEATX[0] + 10, (SEATX[1] + SEATX[2]) / 2 + 10, SEATX[3] + 30][g.i];
        pose(g.el, { x, y: lerp(-400, 386 + (g.i % 2) * 22, k), r: T ? Math.sin(T * 0.8 + g.i) * 1.5 : 0, o: k > 0.01 ? 1 : 0 });
      });

      /* v17c — the power of the Lord to heal: light behind Him, sparks drifting out to the sick */
      const pw = es(t, 2.05, 2.4);
      pose(glow, { x: hx, y: hy + 40, s: 0.6 + pw * 0.5 + (T ? Math.sin(T * 1.3) * 0.03 : 0), r: T * 3, o: 0.15 + pw * 0.85 });
      sparks.forEach((sp) => {
        const k = ((t - 2.1) * 0.8 + sp.d + (T ? T * 0.15 : 0)) % 1;
        pose(sp.el, { x: lerp(hx, sp.to[0], k), y: lerp(hy + 30, sp.to[1], k) - Math.sin(k * PI) * 40, s: 0.4 + bump(k, 0, 1) * 0.7, r: T * 50, o: pw * bump(k, 0, 1) });
      });

      S.cam.x = kf(t, [[0, 40], [0.9, 40], [1.2, -220], [1.95, -240], [2.2, 60], [3, 100]]);
      S.cam.y = kf(t, [[0, 10], [1.2, 30], [2.2, 10], [3, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [0.9, 1.02], [1.2, 1.14], [1.95, 1.16], [2.2, 1.06], [3, 1.08]]);
    };
  },
};
