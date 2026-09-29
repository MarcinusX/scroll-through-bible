// Mt 11,7 — on the bank of the Jordan, where the crowds once went out to John. His two disciples walk off along the
// bank to take the answer back; Jesus watches them go, then turns to the crowd and begins to speak about John.
// "What did you go out into the wilderness to see? A reed shaken by the wind?" — a gust comes down the valley,
// streaks of wind run across the stage and the tall reeds at the water's edge bow and toss; He points at them.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { riverSet, JD, reedClump, throng, headAt, voiceRings, question, kf, moving, PI } from './lib.js';

const GY = 752, JX = 800;

export default {
  id: 'mt11-reed',
  beats: [
    { v: 7, text: 'Gdy oni odchodzili, Jezus zaczął mówić do tłumów o Janie:' },
    { v: 7, cont: true, text: '«Coście wyszli oglądać na pustyni? Trzcinę kołyszącą się na wietrze?' },
  ],
  cam: { x: [-40, 160], y: [0, 50], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const sk = S.layer({ par: 0, sky: true });
    const skyId = S.id('sky');
    S.defs(`<linearGradient id="${skyId}" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="700"><stop offset="0" stop-color="#bfd6d6"/><stop offset=".55" stop-color="#e9ead6"/><stop offset="1" stop-color="#f4e6c8"/></linearGradient>`);
    sk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${skyId})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const R = riverSet(S, { sunAt: [1240, 150] });
    const W = R.riverLayer();
    R.waterFront(W);

    /* the reeds at the water's edge (each clump its own cut-out, so bending it is free) */
    const reedL = S.layer({ par: 0.45, sh: 4 });
    const CL = [[470, 712, 250, 10], [600, 716, 190, 7], [1060, 712, 230, 9], [1180, 716, 170, 6], [330, 714, 160, 6], [1330, 714, 200, 8]]
      .map(([x, y, h, n], i) => ({ i, x, y, el: reedL.add(`<g>${reedClump(makeCutter('mt11-rd' + i), { n, h, col: i % 2 ? C.moss : C.olive })}</g>`), k: 0.7 + (i % 3) * 0.2 }));

    /* the near bank, the crowd, the two disciples, Jesus */
    const { N } = R.nearBank();
    N.sprite(throng(makeCutter('mt11-rd-a'), 6, { s: 0.84, rows: 2, spread: 46 }), 400, GY + 6);
    N.sprite(throng(makeCutter('mt11-rd-b'), 5, { s: 0.84, rows: 2, spread: 46, flip: true }), 1230, GY + 6);
    const act = S.layer({ par: 0.45, sh: 5 });
    const dis = JD.map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const q = act.add(`<g>${question(c)}</g>`);

    /* the wind: pale streaks sliding across */
    const windL = S.layer({ par: 0.5, sh: 0, flat: true, pad: 700 });
    let d = '';
    for (let i = 0; i < 16; i++) {
      const x = c.rr(-700, 2300), y = c.rr(120, 640), w = c.rr(120, 260);
      d += c.ribbon(c.qbez([x, y], [x + w * 0.5, y - c.rr(10, 26)], [x + w, y + c.rr(-6, 8)], 10), (u) => 1 + Math.sin(u * PI) * 4);
    }
    windL.add(`<path d="${d}" fill="#fffaf0" opacity=".75"/>`);

    return (t, time) => {
      const T = time;
      R.update(t, T);

      /* v7a — the two go; He turns to the crowd */
      const turn = es(t, 0.4, 0.46);
      dis.forEach((dd) => {
        const K = [[-0.3, 930 + dd.i * 80], [0.02, 930 + dd.i * 80], [1.0, 1480 + dd.i * 80]];
        const x = kf(t, K, (u) => u);
        dd.p.set({ x, y: GY - 6 + dd.i * 8, s: 0.98, walk: moving(t, K) ? x * 0.05 + dd.i : undefined, armF: 16, armB: 10, blink: blinkAt(T, 3 + dd.i), o: 1 - seg(t, 0.9, 1.0) });
      });
      const speak = es(t, 0.45, 0.6);
      const point = es(t, 1.2, 1.4);
      jesus.set({
        x: JX, y: GY, s: 1.06, flip: turn > 0.5,
        armF: 16 + (1 - turn) * 20 + speak * 40 * (1 - point) + point * 78 + (T ? Math.sin(T * 1.4) * 4 * speak : 0), armB: 10 + speak * 50 * (1 - point) + point * 20, head: -point * 6, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(JX, GY, 1.06, turn > 0.5);
      voice(hx, hy, speak, T, { dir: -1, spread: 2.2 });
      const qk = es(t, 1.05, 1.25, ease.back);
      pose(q, { x: hx - 40, y: hy - 80 + (T ? Math.sin(T * 2) * 3 : 0), s: qk, r: T ? Math.sin(T * 1.6) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      /* v7b — the wind, and the reeds bow */
      const wind = es(t, 1.08, 1.4);
      CL.forEach((cl) => {
        const gust = T ? Math.sin(T * 2.2 + cl.i * 0.8) * 0.5 + Math.sin(T * 3.7 + cl.i) * 0.25 : 0;
        pose(cl.el, { x: cl.x, y: cl.y, r: -wind * (22 + gust * 14) * cl.k });
      });
      windL.shift(T ? ((T * 220) % 1400) - 700 : 0, 0);
      windL.fade(wind * 0.9);

      S.cam.x = lerp(160, -40, es(t, 0.8, 1.2));
      S.cam.z = 1.14 + es(t, 1.0, 1.4) * 0.1;
      S.cam.y = 40;
    };
  },
};
