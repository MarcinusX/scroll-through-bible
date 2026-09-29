// Łk 21,8 — "Watch out that you are not led astray": Jesus lifts a warning hand and a painted flat comes down — a road
// climbing through the hills to a gate of light, travellers walking up it. "Many will come in my name, saying 'I am he'
// and 'The time is at hand'": at a fork two figures rise in gilded masks, each lifting a slip — "I am he", "The time is
// at hand" — and beckon down a side path that runs off into the thorns; the travellers stop and look. "Do not go after
// them!": Jesus' hand goes up, the travellers turn their backs on the masks and walk on up to the light; the masks'
// slips droop and they are left standing alone.
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, flatSky, flatY, along, mask, word, addToHead, headAt, halo,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, JS, FX, FW, FH, K } = TT;
const ROAD = [[-214, 118], [-140, 98], [-70, 84], [-6, 64], [56, 40], [110, 12], [148, -18], [168, -40]];
const WRONG = [[-6, 64], [-46, 46], [-104, 34], [-168, 24], [-222, 18]];
const FORK = 0.4; // where on ROAD the side path branches off

function roadPainting(c) {
  const s = sheet();
  s.p(c.cut([[-FW / 2 - 4, -10], [-150, -46], [-60, -26], [40, -58], [130, -44], [FW / 2 + 4, -70], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.8, 8), mix(C.hillMid, C.sage, 0.3));
  s.p(c.cut([[-FW / 2 - 4, 40], [-100, 14], [0, 30], [110, 2], [FW / 2 + 4, -6], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.8, 8), C.hillNear);
  s.p(c.ribbon(ROAD, (u) => 18 - u * 11), mix(C.sand, C.cream, 0.3));
  s.p(c.ribbon(WRONG, (u) => 12 - u * 6), mix(C.sand2, C.rock2, 0.45));
  let th = '';
  for (let i = 0; i < 10; i++) th += c.cut(c.star(-206 + c.rr(-10, 22), 8 + c.rr(-20, 14), c.rr(12, 18), c.rr(4, 7), 7, c.rr(0, 1)), 0.6, 3);
  s.p(th, mix(C.thorn2, C.night2, 0.3));
  s.p(c.cut([[152, -36], [152, -72], ...c.arc(168, -72, 16, 16, PI, 2 * PI, 8), [184, -36]], 0.4, 4), C.halo);
  return `${halo(70)}`.replace('<circle', '<circle cx="168" cy="-58"') + s.out();
}

export default {
  id: 'lk21-astray',
  beats: [
    { v: 8, text: 'Jezus odpowiedział: «Strzeżcie się, żeby was nie zwiedziono.' },
    { v: 8, cont: true, text: 'Wielu bowiem przyjdzie pod moim imieniem i będą mówić: "Ja jestem" oraz: "Nadszedł czas".' },
    { v: 8, cont: true, text: 'Nie chodźcie za nimi!' },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const inner = flatSky(S, FW, FH, ['#e3d7c4', '#f5e8cf']) + roadPainting(c);
    const flatEl = T0.FL.add(flat(S, inner, { w: FW, h: FH }));
    const B = T0.bits;
    const TRAV = Array.from({ length: 5 }, (_, i) => ({ i, u0: 0.02 + i * 0.075, seed: c.rr(0, 9), p: S.puppet(B.add(person(c, crowdPerson(c)))) }));
    const MASKS = [[C.plumRobe, C.sun, tr('Ja jestem', 'I am he')], [C.terracotta, C.halo, tr('Nadszedł czas', 'The time is at hand')]].map(([robe, gold, text], i) => {
      const fig = addToHead(person(c, { robe, mantle: gold, hairStyle: 'wrap', veil: robe, veil2: gold, beard: 'none', skin: C.skin2, belt: gold }), `<g transform="translate(6 0)">${mask(c, { col: gold, r: 22, stick: false })}</g>`);
      return { i, p: S.puppet(B.add(fig)), tag: B.add(`<g>${word(c, text, { size: 17, fill: mix(C.halo, C.cream, 0.4) })}</g>`), seed: c.rr(0, 9) };
    });

    return (t, time) => {
      const T = time;
      T0.update(t, T);

      /* Jesus: warns (0), shows (1), forbids (2) */
      const warn = bump(t, 0.05, 0.95);
      const show = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.05));
      const stop = es(t, 2.05, 2.25);
      T0.jesus.set({ x: JX, y: GY, s: JS, armB: 10 + warn * 125 + stop * 115, armF: 20 + show * 80 + stop * 60, head: -show * 6 - stop * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, Math.max(warn, stop) * 0.8, T, { spread: 1.8 });

      /* the flat */
      const kF = es(t, 0.15, 0.4, ease.out);
      const fy = flatY(kF), on = kF > 0.002 ? 1 : 0;
      pose(flatEl, { x: FX, y: fy, s: K, o: on });
      const W = (lx, ly) => [FX + lx * K, fy + ly * K];

      /* the travellers: walk up, stop at the masks (1), then turn away and go on to the light (2) */
      TRAV.forEach((tv) => {
        let u = Math.min(FORK - 0.03 - tv.i * 0.05, tv.u0 + es(t, 0.3, 1.2) * 0.4);
        const go = es(t, 2.12 + tv.i * 0.04, 2.9);
        u += go * (0.98 - u) * (1 - tv.i * 0.12);
        const [lx, ly] = along(ROAD, u);
        const [x, y] = W(lx, ly);
        const look = es(t, 1.2, 1.4) * (1 - es(t, 2.1, 2.2));
        const walking = (t > 0.3 && t < 1.2) || (go > 0 && go < 1);
        tv.p.set({ x, y, s: 0.26 * K, flip: look > 0.5, o: on, walk: walking ? x * 0.12 + tv.i : undefined, head: -look * 6, armF: look * (tv.i % 2 ? 30 : 0), blink: blinkAt(T, tv.seed) });
      });

      /* the masks rise at the fork with their slips and beckon; then sink */
      MASKS.forEach((m) => {
        const up = es(t, 1.05 + m.i * 0.15, 1.4 + m.i * 0.15, ease.out);
        const sink = 0;
        const [lx, ly] = along(WRONG, 0.18 + m.i * 0.3);
        const [x, y] = W(lx + 6, ly + (1 - up) * 40 + sink * 40);
        const beck = T ? Math.sin(T * 3 + m.i) * 12 : 0;
        m.p.set({ x, y, s: 0.3 * K, flip: false, o: on * Math.min(1, up * 3) * (1 - sink), armB: 130 * up * (1 - es(t, 2.1, 2.3)), armF: 60 + beck * up * (1 - sink), blink: blinkAt(T, m.seed) });
        const tg = es(t, 1.2 + m.i * 0.15, 1.4 + m.i * 0.15, ease.back) * (1 - es(t, 2.3, 2.45) * 0.25);
        const droop = es(t, 2.1, 2.3);
        pose(m.tag, { x: x + (m.i ? 44 : -30), y: y - 86 - m.i * 18 + droop * 26, s: tg * 0.95, r: (T ? Math.sin(T * 1.4 + m.i) * 3 : 0) + droop * (m.i ? 18 : -18), o: on * (tg > 0.01 ? 1 : 0) });
      });

      S.cam.y = -es(t, 0.2, 0.9) * 30;
      S.cam.z = 1 + es(t, 0.2, 0.9) * 0.04;
      void seg; void shade; void lerp; void PI;
    };
  },
};
