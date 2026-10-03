// Łk 20,25–26 — "Then give to Caesar what is Caesar's, and to God what is God's": the great denarius swings over and
// drops into Caesar's tax chest with its eagle on the right; and from the people on the left a glowing heart rises and
// floats back to the sanctuary, where a warm light opens behind the doors. "And they could not catch Him in His words
// before the people": the net over the court is drawn up empty into the flies, and the people lift their hands.
// "Marvelling at His answer, they fell silent": the three stand with their heads bowed and their hands down, and
// nothing in their bubble but three dots of ink.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { courtSet, CQ, SPY, snare, denarius, taxChest, glowHeart, glowDisc, dots, speech, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg, PI } from './lib.js';

const CHY = 470;

export default {
  id: 'lk20-caesar',
  beats: [
    { v: 25 },
    { v: 26, text: 'I nie mogli podchwycić Go w żadnym słowie wobec ludu.' },
    { v: 26, cont: true, text: 'Zmieszani Jego odpowiedzią, zamilkli.' },
  ],
  cam: { x: [-20, 60], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const Q = courtSet(S, { opp: SPY });
    const c = Q.c;
    const CHX = S.portrait ? 1040 : 1110;   // phone: Caesar's chest clear of the thread
    const holy = Q.holyL.add(`<g opacity="0">${glowDisc(260, 'halo-glow', 1)}</g>`);
    const chest = Q.flyL.add(`<g><path d="M-40 -1600V-60M40 -1600V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${taxChest(c)}</g>`);
    const big = Q.flyL.add(`<g><path d="M0 -1600V-100" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${denarius(c, 100)}</g>`);
    const heart = Q.flyL.add(`<g opacity="0">${glowHeart(c, 22)}</g>`);
    const net = Q.flyL.add(`<g>${snare(c, 170, 120)}</g>`);
    const hush = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${speech(c, `<g transform="translate(0 0)">${dots(c)}</g>`, { w: 66, h: 40, flip: true })}</g>`));

    return (t, time) => {
      const T = time;
      /* v25 — the coin to Caesar's chest; the heart to God */
      dropIn(chest, t, 0.08, undefined, CHX, CHY, { T, d: 0.22, sw: 0.6 });
      const go = es(t, 0.3, 0.55, ease.in);
      const bx = lerp(CQ.JX, CHX, go), by = lerp(300, CHY - 70, go) - Math.sin(go * PI) * 60;
      pose(big, { x: bx, y: by, s: lerp(1, 0.18, go), r: go * 30, o: go < 0.99 ? 1 : 0 });
      const hk = es(t, 0.5, 0.62, ease.back);
      const hu = es(t, 0.6, 0.9);
      pose(heart, { x: lerp(560, CQ.JX, hu), y: lerp(470, 260, hu) + (T ? Math.sin(T * 2) * 3 : 0), s: hk * (1 - hu * 0.4), o: hk > 0.01 ? 1 - es(t, 0.95, 1.1) : 0 });
      pose(holy, { x: CQ.JX, y: 300, o: es(t, 0.75, 0.95) * (1 - es(t, 1.6, 1.9) * 0.6) });
      /* v26a — the net drawn up empty */
      const up = es(t, 1.1, 1.45, ease.in);
      pose(net, { x: CQ.JX, y: lerp(250, -1500, up), r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: up < 0.999 ? 1 : 0 });
      const glad = es(t, 1.2, 1.4) * (1 - es(t, 2.0, 2.2) * 0.5);
      /* v26b — silent */
      const mute = es(t, 2.05, 2.25);
      hush.forEach((el, i) => { const [hx, hy] = oppHead(i); popAt(el, t, 2.2 + i * 0.07, undefined, hx - 16, hy - 12, { d: 0.1, s: 0.9 }); });
      Q.pose(t, T,
        { armF: 16 + bump(t, 0.1, 0.6) * 60, armB: 8 + bump(t, 0.5, 0.95) * 90, head: -bump(t, 0.5, 0.95) * 10, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - bump(t, 0.5, 0.95) * 10, armF: 10 + glad * 50, blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x + mute * 20, armF: 8 + bump(t, 1.1, 1.6) * 40 * (1 - mute), armB: 4 + bump(t, 1.1, 1.6) * 30, head: mute * 20 + bump(t, 0.2, 0.6) * -8, lean: mute * 7, blink: blinkAt(T, m.seed) }));
      Q.amaze(glad);

      S.cam.x = kf(t, [[0, 30], [1.0, 20], [2.0, 30]]);
      S.cam.y = kf(t, [[0, -30], [1.0, -30], [1.4, -10], [2.0, 0]]);
      S.cam.z = kf(t, [[0, 1.04], [2.0, 1.08]]);
      void seg; void tr; void C;
    };
  },
};
