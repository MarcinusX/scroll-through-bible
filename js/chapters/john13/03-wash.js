// J 13,5b–7 — the disciples sit on their cushions with bare, dusty feet; the rest wait at the table behind.
// He kneels before Andrew, pours water over his feet — the dust is gone; He wipes them with the towel He is
// girded with, and goes on to John. Then He comes to Simon Peter, carrying the basin, and kneels. Peter throws up
// his hands: "Lord, You — wash my feet?" He looks up at him: a card hangs down — "now" a cloud and a question;
// the second leaf, folded, opens a little — "later": light over the basin and the towel.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  washSet, WASH, EVE, C, tr, speech, footIcon, GLYPH, nowLater, kf, hand, headAt, vis, pose, fade, lerp, blinkAt, feetAt, PI,
} from './lib.js';

export default {
  id: 'j13-wash',
  beats: [
    { v: 5, text: 'I zaczął umywać uczniom nogi' },
    { v: 5, cont: true, text: 'i ocierać prześcieradłem, którym był przepasany.' },
    { v: 6, text: 'Podszedł więc do Szymona Piotra,' },
    { v: 6, cont: true, text: 'a on rzekł do Niego: «Panie, Ty chcesz mi umyć nogi?»' },
    { v: 7 },
  ],
  cam: { x: [-680, 40], y: [60, 260], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const W = washSet(S, { skyCols: EVE });
    const { row, by, back, jK, jS, basinB, basinF, cloth, drops, F } = W;
    const A = by.andrew, JO = by.john, P = by.peter;
    const K = WASH.KNEEL;
    /* Peter's question; the now / later card */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-12 4)">${footIcon(c, C.skin2)}</g><g transform="translate(16 -2) scale(.9)">${GLYPH.q(c)}</g>`, { w: 84, h: 56 })}</g>`);
    const cardL = S.layer({ par: 0.5, sh: 4 });
    const card = cardL.add(`<g>${nowLater(c)}</g>`);
    const later = card.querySelector('.later');

    return (t, time) => {
      const T = time;
      W.idle(t, T, 0);
      W.R.stars.fade(0.6);

      /* where He kneels: Andrew (b0–b1a), John (b1b), then He rises and walks to Peter (b2) */
      const toJohn = es(t, 1.5, 1.68);
      const up = es(t, 2.05, 2.12), down = es(t, 2.6, 2.66);
      const walk = seg(t, 2.12, 2.6);
      const xA = A.x + K, xJ = JO.x + K, xP = P.x + K;
      const kx = up < 1 ? lerp(xA, xJ, toJohn) : xP;
      const wx = lerp(xJ, xP, ease.io(walk));
      const hop = Math.sin(toJohn * PI) * 10;
      // hands: pour & wash (dip), wipe (rub)
      const washA = bump(t, 0.12, 0.9), wipeA = bump(t, 1.05, 1.45), washJ = bump(t, 1.7, 1.98);
      const washing = Math.max(washA, washJ);
      const dip = washing * (0.5 + 0.5 * Math.sin(t * PI * 10));
      const rub = wipeA * Math.sin(t * PI * 12);
      const look = es(t, 4.05, 4.3);               // He looks up at Peter
      const armF = 58 + dip * 14 + wipeA * 6 + rub * 8 - look * 10;
      const lean = 20 + washing * 6 + wipeA * 4 - look * 12;
      jK.set({ x: kx, y: F - hop, s: 1, flip: true, o: (1 - up) + down, armF, armB: 30 + washing * 20 - look * 6 + bump(t, 4.3, 4.95) * 70, lean, head: 14 - look * 26, blink: blinkAt(T) });
      const [bhx, bhy] = hand(wx, F, 1, true, 34);
      jS.set({ x: wx, y: F, s: 1, flip: true, o: up * (1 - down), walk: walk > 0 && walk < 1 ? wx * 0.06 : undefined, armF: 34, armB: 30, head: 8, amt: 0.6, blink: blinkAt(T) });
      // the basin: at the feet, carried, set down at Peter's feet
      const carry = up * (1 - down);
      const bx = carry > 0.5 ? bhx - 6 : (up < 1 ? lerp(A.x, JO.x, toJohn) + 72 : P.x + 72);
      const by_ = carry > 0.5 ? bhy + 26 : F + 2;
      vis(basinB, { x: bx, y: by_, o: 1 });
      vis(basinF, { x: bx, y: by_, o: 1 });
      // the drops, the towel in His hand
      const [hx, hy] = hand(kx, F - hop, 1, true, armF, lean, 46);
      vis(drops, { x: bx, y: F - 26 - ((t * 4) % 1) * 10, s: 0.8 + ((t * 4) % 1) * 0.4, o: washing > 0.2 ? washing : 0 });
      vis(cloth, { x: hx, y: hy, r: 20 + rub * 10, o: wipeA > 0.05 ? 1 : 0 });

      /* the dust is washed off; the wet sheen, dried by the towel */
      const cleanA = es(t, 0.35, 0.85), cleanJ = es(t, 1.72, 1.96);
      fade(A.dust, 0.75 * (1 - cleanA)); fade(A.wet, 0.8 * cleanA * (1 - es(t, 1.1, 1.45)));
      fade(JO.dust, 0.75 * (1 - cleanJ)); fade(JO.wet, 0.8 * cleanJ);

      /* the row */
      const surprise = es(t, 3.05, 3.25) * (1 - es(t, 4.4, 4.8) * 0.6);
      row.forEach((m) => {
        let armF = 30, armB = 12, head = 0, lean = 0;
        const d = kx - m.x;
        head = -4 + (m.k === 'andrew' ? -washA * 4 - wipeA * 6 : 0) + (m.k === 'john' ? bump(t, 1.6, 2.0) * -6 : 0);
        if (m.k === 'peter') {
          head = -2 + es(t, 2.2, 2.6) * 6 - surprise * 10 + look * -4;
          armF = 30 + surprise * 70;
          armB = 12 + surprise * 110;
          lean = -surprise * 10;
        }
        if (m.k === 'judas') { head = 10; armF = 20; }
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
      });
      back.forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 34, armB: 12, head: 6 + (m.i % 3) * 2, blink: blinkAt(T, m.seed) });
      });

      /* b3 — Peter's question */
      const qk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      const [px, py] = headAt(P.x, F, P.s, false, 62);
      vis(ask, { x: px + 14, y: py - 26, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* b4 — now / later */
      const ck = es(t, 4.1, 4.4, ease.out);
      vis(card, { x: 780, y: 372 - (1 - ck) * 700, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: ck > 0.01 ? 1 : 0 });
      pose(later, { sx: Math.max(0.03, es(t, 4.5, 4.85)) });

      S.cam.x = kf(t, [[0, -620], [1.4, -600], [1.7, -330], [2.1, -330], [2.7, -40], [4, -40], [4.2, -40], [5, -30]]);
      S.cam.y = kf(t, [[0, 230], [1.7, 230], [2.7, 230], [3.2, 220], [4.1, 200], [5, 200]]);
      S.cam.z = kf(t, [[0, 1.6], [1.7, 1.6], [2.7, 1.5], [3.2, 1.6], [4.1, 1.32], [5, 1.32]]);
    };
  },
};
