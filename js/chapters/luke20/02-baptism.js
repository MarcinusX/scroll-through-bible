// Łk 20,3–4 — "He answered them: I also will ask you a question. Tell Me": the red seal of their authority and the
// empty one over Jesus go up into the flies; He lifts one finger, and a single paper "?" pops up by His hand, turned
// towards the chief priest. "Was the baptism of John from heaven, or from men?": a painted panel comes down between
// them — John in the Jordan pouring water over a kneeling man — and on either side a round plate on its string: a
// cloud with light, "from heaven", and three people, "from men". The panel swings on its strings, towards the one,
// towards the other.
import { blinkAt, pose, lerp } from '../kit.js';
import { courtSet, CQ, LEADERS, priest, waxSeal, sealedScroll, question, panel, jordanInner, choicePlate, popAt, dropIn, oppHead, jHead, kf, tr, es, ease, bump, seg } from './lib.js';

const PW = 300, PH = 190;

export default {
  id: 'lk20-baptism',
  beats: [
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [-20, 40], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: [(c) => priest(c, 1, { holdB: `<g transform="rotate(-60) translate(4 -2)">${sealedScroll(c, 50)}</g>` }), LEADERS[1], LEADERS[2]] });
    const c = Q.c;
    const full = Q.flyL.add(`<g><path d="M0 -1600V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${waxSeal(c, 34)}</g>`);
    const empty = Q.flyL.add(`<g><path d="M0 -1600V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${waxSeal(c, 40, { blank: true })}</g>`);
    const pan = Q.flyL.add(panel(S, jordanInner(S, c, PW, PH), { w: PW, h: PH, word: tr('chrzest Janowy', 'the baptism of John') }));
    const heaven = Q.flyL.add(`<g>${choicePlate(c, 'heaven', tr('z nieba?', 'from heaven?'))}</g>`);
    const men = Q.flyL.add(`<g>${choicePlate(c, 'men', tr('od ludzi?', 'from men?'))}</g>`);
    const q = Q.W.add(`<g opacity="0">${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      /* v3 — "I also will ask you a question" */
      const up = es(t, 0.05, 0.35, ease.in);
      pose(full, { x: 1075, y: lerp(370, -1500, up), r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: up < 0.999 ? 1 : 0 });
      pose(empty, { x: CQ.JX, y: lerp(330, -1500, up), r: T ? Math.sin(T * 0.8 + 1) * 1.2 : 0, o: up < 0.999 ? 1 : 0 });
      const finger = es(t, 0.2, 0.4) * (1 - es(t, 1.1, 1.3) * 0.5);
      const [jx, jy] = jHead();
      popAt(q, t, 0.4, 1.25, jx + 70, jy - 40 + (T ? Math.sin(T * 1.6) * 3 : 0), { d: 0.12, s: 1.3 });
      /* v4 — the panel of John's baptism, between the two plates, swinging */
      const pk = dropIn(pan, t, 1.02, undefined, CQ.JX, 290, { d: 0.3 });
      const sw = bump(t, 1.4, 1.95);
      const tilt = Math.sin(seg(t, 1.4, 1.95) * Math.PI * 2) * 5 * sw;
      pose(pan, { x: CQ.JX, y: lerp(-1500, 290, pk), r: tilt, o: pk > 0.002 ? 1 : 0 });
      const hk = dropIn(heaven, t, 1.2, undefined, 540, 250, { T, d: 0.25 });
      const mk = dropIn(men, t, 1.3, undefined, 1060, 250, { T, d: 0.25 });
      pose(heaven, { x: 540, y: lerp(-1500, 250, hk), s: 1 + bump(t, 1.4, 1.67) * 0.12, r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: hk > 0.002 ? 1 : 0 });
      pose(men, { x: 1060, y: lerp(-1500, 250, mk), s: 1 + bump(t, 1.67, 1.95) * 0.12, r: T ? Math.sin(T * 0.8 + 2) * 1.2 : 0, o: mk > 0.002 ? 1 : 0 });
      const look = es(t, 1.1, 1.3);
      Q.pose(t, T,
        { armF: 16 + finger * 84 + look * 20, armB: 8 + look * 30, head: -look * 4, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - look * 6, blink: blinkAt(T, d.seed) }),
        (m) => ({ armB: m.i === 0 ? 4 + (1 - es(t, 0.1, 0.4)) * 150 : 4, armF: 8 + (m.i === 1 ? bump(t, 1.4, 1.95) * 30 : 0), head: -look * 8 + bump(t, 1.4, 1.67) * -6 + bump(t, 1.67, 1.95) * 6, blink: blinkAt(T, m.seed) }));
      Q.amaze(bump(t, 1.35, 1.95) * 0.6);
      void oppHead; void kf;

      S.cam.x = 20;
      S.cam.y = lerp(-10, -50, es(t, 1.0, 1.35));
      S.cam.z = 1.04;
    };
  },
};
