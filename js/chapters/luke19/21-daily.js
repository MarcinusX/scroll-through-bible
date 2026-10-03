// Łk 19,47–48 — the Temple court, under Solomon's colonnade. Day after day He teaches there: the sun on its string
// crosses the sky and sets and comes round again, three times, while He speaks and the people sit and stand around
// Him. But in the shade of the great columns on the left the chief priests, the scribes and the leaders of the people
// put their heads together, frowning, a dark knot of scheming over them: they seek to destroy Him. And they do not
// know what to do: their hands go up, a question mark over each head — for all the people hang on His words, leaning
// in closer and closer, more of them coming to listen.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { templeCourt, courtFront, priest, scribe, elder, folk, still, question, wordSlip, headAt, hand, kf, tr, es, ease, bump, seg, PI, TEMPLE, mix, shade, sheet } from './lib.js';
import { darkKnot } from '../luke12/lib.js';

const FLOOR = 676, JX = 700;
const DUSKC = ['#9a90b6', '#e6ae94', '#f4d0a8'];

export default {
  id: 'lk19-daily',
  beats: [
    { v: 47, text: 'I nauczał codziennie w świątyni.' },
    { v: 47, cont: true, text: 'Lecz arcykapłani i uczeni w Piśmie oraz przywódcy ludu czyhali na Jego życie.' },
    { v: 48 },
  ],
  cam: { x: [-240, 80], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const TC = templeCourt(S, { skyCols: TEMPLE, floorY: FLOOR + 40, sanctX: 900, sunAt: [1220, 140] });
    /* the shade of the colonnade on the left, where they plot */
    const shadeL = S.layer({ par: 0.45, sh: 0, flat: true });
    shadeL.add(`<ellipse cx="${S.portrait ? 475 : 330}" cy="${FLOOR + 16}" rx="260" ry="34" fill="${mix(C.storm2, C.plumRobe, 0.3)}" opacity=".28"/>`);
    const A = S.layer({ par: 0.5, sh: 5 });
    /* the plotters */
    const PL = [priest(c, 0), scribe(c, 1), priest(c, 1), elder(c, 0)].map((m, i) => ({ i, p: S.puppet(A.add(m)) }));
    const knot = A.add(`<g>${darkKnot(c, 26)}</g>`);
    const qs = PL.map(() => A.add(`<g>${question(c)}</g>`));
    /* the listeners: seated and standing (still sheets), a second group that comes nearer */
    const sit = A.sprite(still(c, Array.from({ length: 6 }, (_, i) => ({ x: i * 70, y: (i % 2) * 8, s: 0.86, flip: true, head: -4, armF: 20 + (i % 3) * 20, o: { ...folk(c), pose: 'sit' } }))), 860, FLOOR + 24);
    const stand = A.sprite(still(c, Array.from({ length: 7 }, (_, i) => ({ x: i * 60, y: -(i % 2) * 6, s: 0.84, flip: true, head: -4, armF: (i % 3) * 20, o: folk(c) }))), 900, FLOOR - 30);
    const more = A.sprite(still(c, Array.from({ length: 5 }, (_, i) => ({ x: i * 58, y: (i % 2) * 6, s: 0.84, flip: true, head: -6, armF: 30, o: folk(c) }))), 1160, FLOOR + 40);
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const slips = [0, 1, 2, 3].map(() => fx.add(wordSlip(c, 30)));
    courtFront(S, { xs: [40, 1560] });

    return (t, time) => {
      const T = time;
      /* v47a — He taught daily in the Temple: the sun goes round three times */
      const days = es(t, 0.02, 0.95, (x) => x) * 3;
      const ph = days % 1;
      const setting = t < 0.95 ? Math.pow(Math.sin(ph * PI), 0.6) : 1;
      const sx = t < 0.95 ? lerp(260, 1400, ph) : S.portrait ? 1000 : lerp(260, 1400, 0.72);   // phone: it rests clear of the thread
      pose(TC.sunEl, { x: sx, y: 420 - setting * 290, r: T ? Math.sin(T * 0.6) : 0, o: 1 });
      pose(TC.cl1, { x: 470 + (T ? Math.sin(T * 0.1) * 26 : 0), y: 140 });
      const teach = es(t, -0.3, 0.1);
      jesus.set({ x: JX, y: FLOOR + 6, s: 1.06, flip: false, armF: 30 + teach * 40 + Math.sin(t * 9) * 12 * teach, armB: 10 + bump(t, 0.3, 0.7) * 60 + bump(t, 2.2, 2.8) * 70, head: 2, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, FLOOR + 6, 1.06, false);
      slips.forEach((sl, i) => { const u = (t * 0.9 + i / 4) % 1; pose(sl, { x: jhx + 30 + u * 300, y: jhy + 10 - Math.sin(u * PI) * 70 + i * 6, r: -8 + i * 5, o: Math.sin(u * PI) * teach }); });
      sit.set({ x: 860 - es(t, 2.0, 2.6) * 30, y: FLOOR + 24 });
      stand.set({ x: 920 - es(t, 2.0, 2.6) * 50, y: FLOOR - 30 });
      const come = es(t, 2.05, 2.7);
      more.set({ x: lerp(1500, 1180, come), y: FLOOR + 40, o: come > 0.01 ? 1 : 0 });
      /* v47b — the chief priests, the scribes and the leaders sought to destroy Him */
      const plot = es(t, 1.02, 1.3);
      const puzzled = es(t, 2.1, 2.3);
      PL.forEach((m) => {
        const x = lerp(-60 - m.i * 70, S.portrait ? 420 + m.i * 48 : 240 + m.i * 62, plot);
        m.p.set({ x, y: FLOOR - 8 + (m.i % 2) * 10, s: 0.94, flip: m.i % 2 === 1, walk: plot > 0 && plot < 1 ? x * 0.06 : undefined, lean: (m.i % 2 ? -1 : 1) * 8 * plot * (1 - puzzled), head: 10 * plot * (1 - puzzled) - puzzled * 6, armF: 20 + puzzled * (60 + m.i * 10), armB: 10 + puzzled * (120 - m.i * 10), blink: blinkAt(T, m.i + 4) });
        const [hx, hy] = headAt(x, FLOOR - 8 + (m.i % 2) * 10, 0.94, m.i % 2 === 1);
        const qk = es(t, 2.2 + m.i * 0.06, 2.35 + m.i * 0.06, ease.back);
        pose(qs[m.i], { x: hx, y: hy - 50, s: qk * 0.8, o: qk > 0.02 ? 1 : 0 });
      });
      shadeL.fade(plot);
      const kk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 2.1, 2.3));
      pose(knot, { x: S.portrait ? 490 : 340, y: FLOOR - 240 + (T ? Math.sin(T * 1.3) * 4 : 0), s: kk * 1.4, r: T * 20, o: kk > 0.02 ? 0.9 : 0 });

      S.cam.x = kf(t, [[-0.5, 40], [0.9, 40], [1.2, -80], [2.0, -60], [2.5, -20]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.0, 20], [2.0, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [1.0, 1.04], [1.3, 1.08], [2.2, 1.04]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 60], [0.9, 60], [1.2, -240], [2.0, -240], [2.5, -120]]); S.cam.z = 1.0; }
      void hand; void shade; void sheet; void seg; void tr; void courtFront;
    };
  },
};
