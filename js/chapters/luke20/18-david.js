// Łk 20,41–44 — "How can they say that the Christ is David's son?": a round plate comes down with David's crown on it
// and "David's son?" under it. "David himself says in the Book of Psalms: The Lord said to my Lord, Sit at my right
// hand": a painted panel — King David on a rock with his harp, the scroll of the psalms at his feet; and across from
// him a throne of light appears, light falls on it from above (the Lord who speaks is only light), and the one David
// calls "my Lord" sits down on it. "Until I make your enemies the footstool for your feet": dark jagged shards fly in
// from every side and fold themselves into a golden footstool under His feet. "David calls Him Lord; how then is He
// his son?": David bows his crowned head low towards the throne, and a great "?" hangs over the panel.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { courtSet, CQ, scribeOpts, panel, panelSky, panelGround, davidPuppet, harp, throne, footstool, shard, crown, scrollOpen, rayBurst, bigQuestion, label, popAt, dropIn, kf, tr, es, ease, bump, seg } from './lib.js';

const PW = 380, PH = 220, PX = 800, PY = 300;
const GY = 80;

function psalmInner(S, c) {
  let m = panelSky(S, PW, PH, [mix(C.lavender, C.cream, 0.4), '#f5e6c8']);
  m += sheet().p(c.cut([[-PW / 2 - 10, 30], [-80, 10], [40, 24], [PW / 2 + 10, 6], [PW / 2 + 10, 100], [-PW / 2 - 10, 100]], 0.8, 10), mix(C.hillMid, C.parchment, 0.35)).out();
  m += panelGround(c, PW, GY, mix(C.sage2, C.sand, 0.4), 2);
  m += sheet().p(c.cut(c.blob(-112, GY - 8, 42, 18, 10, 0.2), 0.6, 5), C.rock2).out();
  m += `<g transform="translate(-60 ${GY - 4}) scale(.5)">${scrollOpen(c, 80, 50)}</g>`;
  return m;
}

export default {
  id: 'lk20-david',
  beats: [
    { v: 41 },
    { v: 42 },
    { v: 43 },
    { v: 44 },
  ],
  cam: { x: [-20, 40], y: [-80, 30], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: [scribeOpts(0), scribeOpts(1), scribeOpts(2)] });
    const c = Q.c;
    const plate = Q.flyL.add(`<g><path d="M0 -1600V-56" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${sheet().p(c.cut(c.circ(0, 0, 56, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 50, 34), 0.5, 5), C.parchment).out()}<g transform="translate(0 20) scale(1.8)">${crown(c)}</g><g transform="translate(0 78)">${label(c, tr('syn Dawida?', 'David’s son?'), { size: 18 })}</g></g>`);
    const pan = Q.flyL.add(panel(S, psalmInner(S, c), { w: PW, h: PH, word: tr('Księga Psalmów', 'the Book of Psalms') }));
    const rays = Q.flyL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 20, r1: 110, spread: 0.05, o: 0.55 })}</g>`);
    const david = S.puppet(Q.flyL.add(davidPuppet(c, { pose: 'sit', holdF: `<g transform="translate(6 -8) rotate(-20) scale(.9)">${harp(c)}</g>` })));
    const thr = Q.flyL.add(`<g>${throne(c)}</g>`);
    const lord = S.puppet(Q.flyL.add(person(c, { robe: '#fff6dc', mantle: C.halo, skin: C.skin, hair: C.hairJesus, hairStyle: 'long', beard: 'full', halo: true, pose: 'sit' })));
    const stool = Q.flyL.add(`<g>${footstool(c, 64)}</g>`);
    const shards = Array.from({ length: 6 }, (_, i) => ({ i, el: Q.flyL.add(`<g>${shard(c, 14 + (i % 3) * 4)}</g>`), from: [[1180, 200], [420, 260], [1200, 420], [620, 120], [1040, 110], [400, 420]][i] }));
    const q = Q.flyL.add(`<g><path d="M0 -1600V-70" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${bigQuestion(c, 56, C.terracotta)}</g>`);

    return (t, time) => {
      const T = time;
      /* v41 — David's son? */
      dropIn(plate, t, 0.1, 1.2, PX, 310, { T, d: 0.28 });
      /* v42 — the panel: David; the throne; "sit at my right hand" */
      const pk = dropIn(pan, t, 1.05, undefined, PX, PY, { d: 0.28 });
      const py = lerp(-1500, PY, pk), on = pk > 0.002 ? 1 : 0;
      const bow = es(t, 3.1, 3.4);
      david.set({ x: PX - 112, y: py + GY - 2, s: 0.6, armF: 70 + (T ? Math.sin(T * 3) * 4 : 0) * (1 - bow), armB: 50 + bow * 50, head: -bump(t, 1.3, 1.9) * 12 + bow * 24, lean: bow * 16, blink: blinkAt(T, 4), o: on });
      const tk = es(t, 1.35, 1.6, ease.back);
      pose(thr, { x: PX + 96, y: py + GY - 4, s: 0.66 * Math.max(0.001, tk), o: tk > 0.01 && on ? 1 : 0 });
      pose(rays, { x: PX + 96, y: py - PH / 2 + 10, s: 1, o: es(t, 1.3, 1.5) * (1 - es(t, 3.6, 3.9) * 0.5) * on });
      const sit = es(t, 1.55, 1.75);
      lord.set({ x: PX + 88, y: py + GY - 38 - (1 - sit) * 20, s: 0.56, flip: true, o: sit * on, armF: 30, blink: blinkAt(T, 6) });
      /* v43 — the enemies become the footstool */
      shards.forEach((s) => {
        const k = es(t, 2.1 + s.i * 0.05, 2.45 + s.i * 0.05, ease.in);
        pose(s.el, { x: lerp(s.from[0], PX + 62 + (s.i - 2.5) * 6, k), y: lerp(s.from[1], py + GY - 10, k), r: k * 200 + s.i * 30, s: 1 - k * 0.4, o: (k > 0 ? 1 : 0) * (1 - es(t, 2.72, 2.8)) });
      });
      const fs = es(t, 2.72, 2.85, ease.back);
      pose(stool, { x: PX + 62, y: py + GY - 2, s: Math.max(0.001, fs), o: fs > 0.01 && on ? 1 : 0 });
      /* v44 — "how then is He his son?" */
      dropIn(q, t, 3.3, undefined, PX, 150, { T, d: 0.25 });
      Q.pose(t, T,
        { armF: 16 + es(t, 0.05, 0.3) * 50, armB: 8 + bump(t, 1.1, 3.0) * 90, head: -bump(t, 1.1, 3.9) * 8, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - bump(t, 1.1, 3.9) * 10, blink: blinkAt(T, d.seed) }),
        (m) => ({ head: -bump(t, 0.2, 3.9) * 10 + bow * 6, armF: 8 + (m.i === 1 ? bump(t, 3.2, 3.9) * 40 : 0), blink: blinkAt(T, m.seed) }));
      Q.amaze(es(t, 3.3, 3.5) * 0.5);
      void seg;

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -20], [1.0, -30], [1.3, -60], [3.9, -60]]);
      S.cam.z = kf(t, [[0, 1.04], [1.3, 1.04]]);
    };
  },
};
