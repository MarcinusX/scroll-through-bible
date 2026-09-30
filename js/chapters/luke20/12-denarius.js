// Łk 20,23–24 — "But He saw through their craftiness and said to them": He looks at the three, and what they are
// thinking shows over their pious heads — each a little cloud with a net in it. "Show Me a denarius": He holds out His
// open hand; the first fishes a small silver coin out of his purse and gives it to Him. "Whose image and inscription
// does it bear?": the coin comes down from the flies as a great silver denarius — the emperor's laurelled head and the
// lettering round the rim — and He points up at it. "They answered: Caesar's": "Caesar's!" — and beside the coin a
// cameo of Caesar himself, in the same laurel wreath.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { courtSet, CQ, SPY, snare, thought, denarius, silverCoin, purse, caesar, cameo, bubble, hand, popAt, dropIn, oppHead, jHead, kf, tr, es, ease, bump, seg } from './lib.js';

export default {
  id: 'lk20-denarius',
  beats: [
    { v: 23 },
    { v: 24, text: '«Pokażcie Mi denara.' },
    { v: 24, cont: true, text: 'Czyj nosi obraz i napis?»' },
    { v: 24, cont: true, text: 'Odpowiedzieli: «Cezara».' },
  ],
  cam: { x: [-20, 60], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const Q = courtSet(S, { opp: [{ ...SPY[0], holdB: '' }, SPY[1], SPY[2]] });
    const c = Q.c;
    const net = Q.flyL.add(`<g>${snare(c, 170, 120)}</g>`);
    const netIcon = `<g transform="translate(0 -24) scale(.3)">${snare(c, 150, 110).replace(/<path d="M0 -1400V0"[^>]*\/>/, '')}</g>`;
    const thoughts = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${thought(c, netIcon, { w: 70, h: 54 })}</g>`));
    const purseEl = Q.W.add(`<g opacity="0">${purse(c)}</g>`);
    const small = Q.W.add(`<g opacity="0">${silverCoin(c, 8)}</g>`);
    const big = Q.flyL.add(`<g><path d="M0 -1600V-100" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${denarius(c, 100)}</g>`);
    const cid = S.id('cz');
    const cam = Q.flyL.add(`<g><path d="M0 -1600V-58" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${cameo(c, `<defs><clipPath id="${cid}"><circle r="49"/></clipPath></defs><g clip-path="url(#${cid})"><g transform="translate(-4 140) scale(.9)">${caesar(c)}</g></g>`, { r: 52 })}</g>`);
    const answer = Q.W.add(`<g opacity="0">${bubble(c, tr('Cezara!', 'Caesar’s!'), { size: 22, tail: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v23 — He sees through them */
      const look = es(t, 0.1, 0.3);
      const up = es(t, 0.55, 0.9, ease.in);
      pose(net, { x: CQ.JX, y: lerp(250, -1500, up), r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: up < 0.999 ? 1 : 0 });
      thoughts.forEach((el, i) => { const [hx, hy] = oppHead(i); popAt(el, t, 0.3 + i * 0.07, 1.1, hx - 6, hy - 18, { d: 0.1 }); });
      /* v24a — "show Me a denarius" */
      const open = es(t, 1.05, 1.2);
      const [px, py] = oppHead(0);
      const pk = es(t, 1.15, 1.3) * (1 - es(t, 1.7, 1.8));
      pose(purseEl, { x: px - 24, y: py + 70, s: 0.9, o: pk > 0.01 ? 1 : 0 });
      const give = es(t, 1.35, 1.62);
      const [jhx, jhy] = hand(CQ.JX, CQ.FEET - 14, 1.04, false, 16 + open * 64);
      pose(small, { x: lerp(px - 24, jhx + 4, give), y: lerp(py + 70, jhy - 6, give) - Math.sin(give * Math.PI) * 40, s: 1.2, o: t > 1.3 && t < 2.1 ? 1 : 0 });
      /* v24b — the great denarius */
      dropIn(big, t, 2.02, undefined, CQ.JX, 300, { T, d: 0.3, sw: 0.8 });
      const point = es(t, 2.1, 2.3);
      /* v24c — "Caesar's!" and his cameo */
      const [hx, hy] = oppHead(1);
      popAt(answer, t, 3.08, undefined, hx - 10, hy - 20, { d: 0.1 });
      dropIn(cam, t, 3.15, undefined, 1030, 280, { T, d: 0.25 });
      Q.pose(t, T,
        { armF: 16 + open * 64 * (1 - point) + point * 20, armB: 8 + point * 100 * (1 - es(t, 3.1, 3.3) * 0.4), head: -look * 2 - point * 10, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - point * 12, blink: blinkAt(T, d.seed) }),
        (m) => ({ armF: 8 + (m.i === 0 ? bump(t, 1.2, 1.7) * 60 : 0) + (m.i === 1 ? es(t, 3.05, 3.2) * 50 : 0), armB: 4, head: -point * 10 + look * 4 * (1 - point), lean: -look * 3, blink: blinkAt(T, m.seed) }));
      Q.amaze(es(t, 2.2, 2.4) * 0.8);
      void jHead; void seg; void C;

      S.cam.x = kf(t, [[0, 40], [1.0, 40], [1.3, 20], [2.0, 10], [3.0, 20]]);
      S.cam.y = kf(t, [[0, -10], [1.0, -10], [1.3, 10], [2.0, 10], [2.3, -40]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.3, 1.1], [2.0, 1.1], [2.3, 1.04]]);
    };
  },
};
