// J 21,17 — A third time: "Simon, son of John, do you love Me?" — three little question-hearts in a row. Peter is
// grieved (brows down, a tear, his head bowed; the last dark mark trembles under the plate). Then he goes down on his
// knees with open hands: "Lord, You know everything; You know that I love You." The third mark becomes a heart — the
// three hearts shine — and the dark plate of the rooster turns into a sunrise. "Feed My sheep": Jesus gives him the
// shepherd's staff and raises him up; the little flock gathers round Peter.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  lovestSet, JQ, PQ, PLATE_Q, MARKS, MORNING, speech, heartQ, heart, numeral, rayBurst, skyKeys, kf, headAt, hand, vis, pose, fade, sheet, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

export default {
  id: 'j21-third',
  beats: [
    { v: 17, text: 'Powiedział mu po raz trzeci: «Szymonie, synu Jana, czy kochasz Mnie?»' },
    { v: 17, cont: true, text: 'Zasmucił się Piotr, że mu po raz trzeci powiedział: «Czy kochasz Mnie?»' },
    { v: 17, cont: true, text: 'I rzekł do Niego: «Panie, Ty wszystko wiesz, Ty wiesz, że Cię kocham».' },
    { v: 17, cont: true, text: 'Rzekł do niego Jezus: «Paś owce moje!' },
  ],
  cam: { x: [-40, 60], y: [-40, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const Q = lovestSet(S, { skyCols: MORNING, sunY: 180 });
    const { K, BS, sitters, flock, jesus, pStand, pKneel, pStaff, fx } = Q;
    const fS = Q.face(pStand), fK = Q.face(pKneel);
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(0 2)">${heartQ(c, 20)}</g>`, { w: 64, h: 56 })}</g>`);
    const three = fx.add(`<g>${numeral(c, '3', { r: 14 })}</g>`);
    const row = [0, 1, 2].map(() => fx.add(`<g>${heartQ(c, 14)}</g>`));
    const yes = fx.add(`<g>${speech(c, `<g transform="translate(-14 2)">${heart(c, 11)}</g><text x="12" y="8" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.ink}">…</text>`, { w: 70, h: 48, flip: true })}</g>`);
    const burst = Q.fx.add(`<g>${rayBurst(c, { n: 20, r0: 80, r1: 300, spread: 0.03, o: 0.4 })}</g>`);
    const staffGift = fx.add(`<g>${sheet().p(c.ribbon([[0, -120], [1.5, 0], [0, 70]], 5.5), C.wood2).p(c.ribbon(c.arc(-10, -120, 10, 12, 0, -PI, 8), 5), C.wood2).out()}</g>`);
    const feed = fx.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Paś owce moje', 'Feed my sheep')}</text>`, { w: 150, h: 46 })}</g>`);

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, MORNING], [4, MORNING]]);
      K.idle(T, { sunY: 180 - es(t, 0, 4) * 20 });
      pose(K.sunPath, { x: 1250, y: 450, o: 0.45 });
      const low = bump(t, 1.0, 2.1);
      BS.idle(T, 0.25 - low * 0.12 + es(t, 2.3, 2.7) * 0.2, { breadO: 0.3, smokeO: 0.6 });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.9, flip: m.flip, armF: 24, armB: 14, head: low * 8 - es(t, 2.4, 2.7) * 6, blink: blinkAt(T, m.seed) }));

      /* v17a — the third question */
      const q3 = bump(t, 0.05, 0.95);
      const give = es(t, 3.1, 3.35);
      const lift = es(t, 3.4, 3.55);
      jesus.set({ x: JQ.x, y: JQ.y, s: 1.0, flip: false, armF: 20 + q3 * 40 + give * 60 * (1 - lift) + lift * 50, armB: 10 + bump(t, 2.5, 3.0) * 40 + lift * 40, head: q3 * 4 + es(t, 1.2, 1.5) * 6 * (1 - es(t, 2.3, 2.6)), blink: blinkAt(T) });
      const [jx, jy] = headAt(JQ.x, JQ.y, 1.0, false);
      const ak = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.9, 1.05));
      vis(ask, { x: jx + 24, y: jy - 22, s: ak, o: ak > 0.01 ? 1 : 0 });
      const tk = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.9, 1.05));
      vis(three, { x: jx - 30, y: jy - 70, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* v17b — grieved: three times the question */
      row.forEach((h, i) => {
        const k = es(t, 1.1 + i * 0.12, 1.25 + i * 0.12, ease.back) * (1 - es(t, 1.9, 2.05));
        vis(h, { x: PQ.x + 70 + i * 46, y: 510 - i * 6, s: k * (i === 2 ? 1.15 : 0.9), r: i === 2 && T ? Math.sin(T * 9) * 4 : 0, o: k > 0.01 ? (i === 2 ? 1 : 0.7) : 0 });
      });
      const grief = es(t, 1.2, 1.5) * (1 - es(t, 2.6, 2.9));
      /* v17c — kneeling with open hands */
      const kneel = seg(t, 2.1, 2.16);
      const stand = seg(t, 3.42, 3.48);
      pStand.set({ x: PQ.x, y: PQ.y, s: 0.96, flip: true, o: 1 - kneel, armF: 20 + grief * 20, armB: 12, head: grief * 14, lean: grief * 3, blink: grief > 0.5 ? 0.7 : blinkAt(T, 2) });
      fade(fS.sad, grief); fade(fS.tear, es(t, 1.5, 1.8));
      const open = es(t, 2.15, 2.4);
      pKneel.set({ x: PQ.x - 10, y: PQ.y + 4, s: 0.96, flip: true, o: kneel * (1 - stand), armF: 30 + open * 50 + bump(t, 3.1, 3.4) * 20, armB: 20 + open * 70, head: -open * 10 + grief * 6, blink: blinkAt(T, 2) });
      fade(fK.sad, grief * 0.6); fade(fK.tear, es(t, 1.5, 1.8) * (1 - es(t, 2.7, 3.0)));
      pStaff.set({ x: PQ.x, y: PQ.y, s: 0.96, flip: true, o: stand, armF: 34, armB: 14 + bump(t, 3.5, 3.95) * 30, head: -6, blink: blinkAt(T, 2) });
      const [px, py] = headAt(PQ.x - 10, PQ.y + 4, 0.96, true, 46);
      const yk = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(yes, { x: px - 24, y: py - 22, s: yk, o: yk > 0.01 ? 1 : 0 });

      /* the plate: the last mark trembles, becomes a heart; the dark plate turns to dawn */
      const plx = PLATE_Q.x, ply = PLATE_Q.y, plr = T ? Math.sin(T * 0.6) * 1.2 : 0;
      const turn = es(t, 2.42, 2.62);
      vis(Q.plate, { x: plx, y: ply, r: plr, sx: 1 - turn * 0.999, o: turn < 0.99 ? 1 : 0 });
      vis(Q.dawnPlate, { x: plx, y: ply, r: plr, sx: seg(t, 2.6, 2.62) * es(t, 2.6, 2.75) + 0.001, o: seg(t, 2.6, 2.62) });
      const conv3 = es(t, 2.25, 2.42);
      MARKS.forEach(([dx, dy], i) => {
        const cv = i < 2 ? 1 : conv3;
        const tr0 = i === 2 && T ? Math.sin(T * 14) * 3 * grief : 0;
        vis(Q.marks[i], { x: plx + dx + tr0, y: ply + dy, s: 1 - cv, r: 6, o: cv < 0.99 ? 1 : 0 });
        const glow = es(t, 2.55, 2.8);
        vis(Q.hearts[i], { x: plx + dx, y: ply + dy, s: cv * (1 + glow * 0.3 + (T ? Math.sin(T * 3 + i) * 0.04 * glow : 0)), o: cv > 0.01 ? 1 : 0 });
      });
      const bk = es(t, 2.6, 2.9);
      vis(burst, { x: plx, y: ply + 20, s: 0.6 + bk * 0.5, r: T * 4, o: bk * 0.7 * (1 - es(t, 3.6, 4) * 0.4) });

      /* v17d — the staff, and the flock gathers */
      const gk = es(t, 3.1, 3.4);
      const [hx, hy] = hand(JQ.x, JQ.y, 1.0, false, 20 + 60, 0);
      vis(staffGift, { x: lerp(hx, PQ.x + 16, gk), y: lerp(hy + 10, PQ.y - 80, gk), r: lerp(-10, 18, gk), s: 0.96, o: t > 3.05 && gk < 1 ? 1 : 0 });
      flock.forEach((f) => {
        const a = f.i < 3 ? -1 : 3.3 + (f.i - 3) * 0.12;
        const k = a < 0 ? 1 : es(t, a, a + 0.5, ease.out);
        const x = lerp(f.from[0], f.to[0], k), y = lerp(f.from[1], f.to[1], k);
        const going = k > 0 && k < 1;
        const near = es(t, 3.4, 3.9);
        f.rig.set({ x: x + (f.i < 3 ? (PQ.x + 40 + f.i * 30 - x) * near * 0.3 : 0), y, s: f.lamb ? 1.0 : 1.1, flip: f.from[0] > 800, head: going ? Math.sin(T * 8) * 4 : -8 + (T ? Math.sin(T * 0.8 + f.i) * 4 : 0), hop: going ? Math.abs(Math.sin(x * 0.05)) * 6 : 0, o: k > 0.001 ? 1 : 0 });
      });
      const fdk = es(t, 3.1, 3.3, ease.back);
      vis(feed, { x: jx + 26, y: jy - 22, s: fdk, o: fdk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 20], [2, 20], [3, 10], [4, 10]]);
      S.cam.y = kf(t, [[0, 60], [1, 90], [2, 60], [3, 70], [4, 100]]);
      S.cam.z = kf(t, [[0, 1.14], [1, 1.22], [2, 1.16], [3, 1.12], [4, 1.1]]);
    };
  },
};
