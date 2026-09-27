// J 21,15–16 — Breakfast is over; the fire burns low. Jesus rises and faces Simon Peter across the coals. "Simon, son
// of John, do you love Me more than these?" — His hand opens toward the others; a heart with a question hangs between
// them, and down from the flies comes a dark plate: the courtyard fire and the rooster, with three dark marks (the
// three denials by another charcoal fire). "Yes, Lord; You know that I love You" — Peter's hand on his heart, and the
// first mark becomes a heart of light. "Feed My lambs" — a lamb trots up to him. A second time the question; a second
// answer, a second heart; "Tend My sheep" — two sheep come.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  lovestSet, JQ, PQ, PLATE_Q, MARKS, MORNING, speech, heartQ, heart, numeral, lightHeart, skyKeys, kf, moving, headAt, hand, vis, pose, fade, sheet, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

export default {
  id: 'j21-lovest',
  beats: [
    { v: 15, text: 'A gdy spożyli śniadanie,' },
    { v: 15, cont: true, text: 'rzekł Jezus do Szymona Piotra: «Szymonie, synu Jana, czy miłujesz Mnie więcej aniżeli ci?»' },
    { v: 15, cont: true, text: 'Odpowiedział Mu: «Tak, Panie, Ty wiesz, że Cię kocham».' },
    { v: 15, cont: true, text: 'Rzekł do niego: «Paś baranki moje!»' },
    { v: 16, text: 'I znowu, po raz drugi, powiedział do niego: «Szymonie, synu Jana, czy miłujesz Mnie?»' },
    { v: 16, cont: true, text: 'Odparł Mu: «Tak, Panie, Ty wiesz, że Cię kocham».' },
    { v: 16, cont: true, text: 'Rzekł do niego: «Paś owce moje!».' },
  ],
  cam: { x: [-40, 60], y: [-80, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const Q = lovestSet(S, { skyCols: MORNING, sunY: 210 });
    const { K, BS, sitters, flock, jesus, pStand, fx } = Q;
    const pf = Q.face(pStand);
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(0 2)">${heartQ(c, 20)}</g>`, { w: 64, h: 56 })}</g>`);
    const two = fx.add(`<g>${numeral(c, '2', { r: 14 })}</g>`);
    const yes = fx.add(`<g>${speech(c, `<g transform="translate(0 2)">${heart(c, 13)}</g>`, { w: 56, h: 48, flip: true })}</g>`);
    const flyH = fx.add(`<g>${lightHeart(c, 12)}</g>`);
    const others = sitters.map(() => fx.add(`<circle r="46" fill="url(#halo-glow)"/>`));
    const feed = fx.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Paś baranki moje', 'Feed my lambs')}</text>`, { w: 150, h: 46 })}</g>`);
    const tend = fx.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Paś owce moje', 'Tend my sheep')}</text>`, { w: 150, h: 46 })}</g>`);

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, MORNING], [7, MORNING]]);
      K.idle(T, { sunY: 210 - es(t, 0, 7) * 30 });
      pose(K.sunPath, { x: 1250, y: 450, o: 0.45 });
      BS.idle(T, 0.4 - es(t, 0, 1) * 0.15, { breadO: 0.3, smokeO: 0.6 });

      /* v15a — breakfast done: they lean back; Jesus and Peter stand */
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.9, flip: m.flip, armF: 24, armB: 14, lean: m.flip ? 4 : -4, head: -es(t, 1.1, 1.4) * 4, blink: blinkAt(T, m.seed) }));
      const stand = es(t, 0.3, 0.6);

      /* the questions & the answers */
      const q1 = bump(t, 1.05, 1.95), q2 = bump(t, 4.05, 4.95);
      const a1 = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1)), a2 = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      const say1 = bump(t, 3.05, 3.9), say2 = bump(t, 6.05, 6.9);
      const these = es(t, 1.4, 1.6) * (1 - es(t, 1.85, 2.0));
      jesus.set({ x: JQ.x, y: JQ.y + (1 - stand) * 10, s: 1.0, flip: false, armF: 20 + (q1 + q2) * 40 + (say1 + say2) * 60, armB: 10 + these * 120 + (say1 + say2) * 30, head: (q1 + q2) * 4, blink: blinkAt(T) });
      const sad = es(t, 1.4, 1.7) * (1 - es(t, 2.1, 2.3)) + es(t, 4.4, 4.7) * (1 - es(t, 5.1, 5.3));
      pStand.set({ x: PQ.x, y: PQ.y + (1 - stand) * 10, s: 0.96, flip: true, armF: 20 + (a1 + a2) * 45 + bump(t, 3.3, 3.95) * 40 + bump(t, 6.3, 6.95) * 40, armB: 12 + (a1 + a2) * 20, head: sad * 10 - (a1 + a2) * 4, blink: sad > 0.5 ? 0.6 : blinkAt(T, 2) });
      fade(pf.sad, sad * 0.9);
      fade(pf.tear, 0);

      const [jx, jy] = headAt(JQ.x, JQ.y, 1.0, false);
      const [px, py] = headAt(PQ.x, PQ.y, 0.96, true);
      const ak = Math.max(es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.9, 2.05)), es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.9, 5.05)));
      vis(ask, { x: jx + 24, y: jy - 22, s: ak, o: ak > 0.01 ? 1 : 0 });
      const tk = es(t, 4.2, 4.4, ease.back) * (1 - es(t, 4.9, 5.05));
      vis(two, { x: jx - 30, y: jy - 70, s: tk, o: tk > 0.01 ? 1 : 0 });
      others.forEach((g, i) => { const m = sitters[i]; vis(g, { x: m.x, y: m.y - 60, s: 1.3, o: these * 0.35 }); });
      const yk = Math.max(a1, a2);
      vis(yes, { x: px - 24, y: py - 22, s: yk, o: yk > 0.01 ? 1 : 0 });

      /* the plate of the denial comes down on the first question; marks become hearts */
      const pk = es(t, 1.3, 1.7, ease.out);
      const plx = PLATE_Q.x, ply = lerp(-500, PLATE_Q.y, pk), plr = T ? Math.sin(T * 0.6) * 1.2 : 0;
      vis(Q.plate, { x: plx, y: ply, r: plr, o: pk > 0.01 ? 1 : 0 });
      vis(Q.dawnPlate, { x: plx, y: ply, o: 0 });
      const conv = [es(t, 2.45, 2.7), es(t, 5.45, 5.7), 0];
      MARKS.forEach(([dx, dy], i) => {
        const mk = es(t, 1.55 + i * 0.1, 1.7 + i * 0.1, ease.back);
        vis(Q.marks[i], { x: plx + dx, y: ply + dy, s: mk * (1 - conv[i]), r: 6, o: mk > 0.01 && conv[i] < 0.99 ? 1 : 0 });
        vis(Q.hearts[i], { x: plx + dx, y: ply + dy, s: conv[i] * (1 + bump(conv[i], 0.5, 1) * 0.3), o: conv[i] > 0.01 ? 1 : 0 });
      });
      // a heart flies from Peter's breast to the mark
      const f1 = es(t, 2.2, 2.5), f2 = es(t, 5.2, 5.5);
      const fk = f1 < 1 && f1 > 0 ? f1 : f2 < 1 && f2 > 0 ? f2 : 0;
      const tgt = f1 < 1 && f1 > 0 ? 0 : 1;
      vis(flyH, { x: lerp(PQ.x - 6, plx + MARKS[tgt][0], fk), y: lerp(PQ.y - 110, ply + MARKS[tgt][1], fk) - Math.sin(fk * PI) * 60, s: 0.9, o: fk > 0.02 && fk < 0.98 ? 1 : 0 });

      /* v15d — the lamb; v16c — the sheep */
      flock.forEach((f) => {
        const a = f.i === 0 ? 3.1 : f.i < 3 ? 6.1 + (f.i - 1) * 0.1 : 99;
        const k = es(t, a, a + 0.55, ease.out);
        const x = lerp(f.from[0], f.to[0], k), y = lerp(f.from[1], f.to[1], k);
        const going = k > 0 && k < 1;
        f.rig.set({ x, y, s: f.lamb ? 1.0 : 1.1, flip: f.from[0] > 800, head: going ? Math.sin(T * 8) * 4 : -8 + (T ? Math.sin(T * 0.8 + f.i) * 4 : 0), hop: going ? Math.abs(Math.sin(x * 0.05)) * 6 : 0, o: k > 0.001 ? 1 : 0 });
      });
      const fdk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      vis(feed, { x: jx + 26, y: jy - 22, s: fdk, o: fdk > 0.01 ? 1 : 0 });
      const tdk = es(t, 6.1, 6.3, ease.back);
      vis(tend, { x: jx + 26, y: jy - 22, s: tdk, o: tdk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 20], [3, 10], [4, 0], [5, 20], [6, 10], [7, 10]]);
      S.cam.y = kf(t, [[0, 120], [1, 60], [2, 40], [3, 110], [4, 60], [5, 40], [6, 110], [7, 110]]);
      S.cam.z = kf(t, [[0, 1.08], [1, 1.1], [2, 1.16], [3, 1.14], [4, 1.12], [5, 1.18], [6, 1.14], [7, 1.12]]);
    };
  },
};
