// J 11,38–40 — the tomb in the evening light. Jesus comes to it, deeply moved again (His heart trembles, soft rings
// spread). It is a cave, and a round stone lies against it — two little labels point them out. "Take away the stone!"
// He points, and Peter and Andrew step up to it. Martha, gentle and practical, lifts a hand: "Lord, by now there is a
// smell" — a faint grey wisp by the stone — "for he has been dead four days": four day-discs light over the rock.
// "Did I not tell you that if you believe you will see the glory of God?" — a small plate: a heart, and glory shining
// out of it. And they roll the stone away; the doorway stands open and dark.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  tombSet, DOOR, EVENING, DISC, mournerOpts, martha, mary, faceBits, heart, voiceRings, strip, dayDisc, hang2, hungPlate, glory,
  vis, kf, moving, pose, attr, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = 706;
const SR = 80;                 // the stone's radius
const SY = DOOR.y - SR + 4;    // its centre when it lies against the cave

/** a faint grey wisp (origin bottom) */
function wisp(c, h = 60) {
  let d = '';
  for (let i = -1; i <= 1; i++) d += c.ribbon(c.cbez([i * 12, 0], [i * 12 + 12, -h * 0.33], [i * 12 - 12, -h * 0.66], [i * 12 + 4, -h], 14), 2.4);
  return `<path d="${d}" fill="${mix(C.stone2, C.storm, 0.35)}" opacity=".7"/>`;
}

export default {
  id: 'j11-tomb',
  beats: [
    { v: 38, text: 'A Jezus ponownie, okazując głębokie wzruszenie, przyszedł do grobu.' },
    { v: 38, cont: true, text: 'Była to pieczara, a na niej spoczywał kamień.' },
    { v: 39, text: 'Jezus rzekł: «Usuńcie kamień!»' },
    { v: 39, cont: true, text: 'Siostra zmarłego, Marta, rzekła do Niego: «Panie, już cuchnie.' },
    { v: 39, cont: true, text: 'Leży bowiem od czterech dni w grobie».' },
    { v: 40 },
  ],
  cam: { x: [-60, 340], y: [-80, 30], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = tombSet(S, { skyCols: EVENING, sunAt: [640, 290] });
    const stone = set.stone;
    const A = S.layer({ par: 0.52, sh: 5 });
    const MO = [330, 395, 455].map((x, i) => ({ i, x, p: S.puppet(A.add(person(c, mournerOpts(i + 1)))) }));
    const DP = [[640, F + 12], [585, F + 2], [525, F + 14]];
    const disc = [DISC[3], DISC[4], DISC[5]].map((o, i) => ({ i, x: DP[i][0], y: DP[i][1], p: S.puppet(A.add(person(c, o))) }));
    const peter = S.puppet(A.add(person(c, DISC[0]))), andrew = S.puppet(A.add(person(c, DISC[1])));
    const my = S.puppet(A.add(mary(c, {}, faceBits(c))));
    attr(my.el.querySelector('[data-part="sad"]'), 'opacity', 1);
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const mt = S.puppet(A.add(martha(c)));
    set.front();

    const X = S.layer({ par: 0.56, sh: 6 });
    const jHeart = X.add(`<g>${heart(c, 14, C.jesusMantle)}</g>`);
    const rings = voiceRings(X, c, { n: 3, r: 30, w: 4, color: mix(C.roseRobe, C.lavender, 0.4) });
    const caveT = X.add(`<g>${hang2(strip(c, tr('pieczara', 'a cave'), { size: 18 }), 20, 300)}</g>`);
    const stoneT = X.add(`<g>${hang2(strip(c, tr('kamień', 'a stone'), { size: 18 }), 20, 300)}</g>`);
    const smell = [0, 1].map(() => X.add(`<g>${wisp(c, 50)}</g>`));
    const days = ['I', 'II', 'III', 'IV'].map((n, i) => ({ i, el: X.add(`<g>${hang2(dayDisc(c, n, 24), 0.01, 300)}</g>`) }));
    days.forEach((d) => { d.lit = d.el.querySelector('.lit'); });
    const faithP = X.add(`<g>${hungPlate(c, `<g transform="translate(0 4)">${glory(c, 60, 14)}</g><g transform="translate(0 6)">${heart(c, 22, C.jesusMantle)}</g>`, { r: 58, fill: mix(C.halo, C.cream, 0.5) })}</g>`);

    const JK = [[0, 420], [0.7, 790]];
    return (t, time) => {
      const T = time;
      pose(set.sunEl, { x: 640, y: 290 + es(t, 0, 6) * 30, r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 900 + Math.sin(T * 0.1) * 20, y: 150, r: 0 });

      /* v38a — He comes to the tomb, deeply moved */
      const jx = kf(t, JK, ease.out);
      const point = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const turn = es(t, 5.05, 5.3) * (1 - es(t, 5.5, 5.7));
      jesus.set({ x: jx, y: F + 12, s: 1.04, walk: moving(t, JK) ? jx * 0.1 : undefined, armF: 14 + point * 76 + turn * 40, armB: 8 + turn * 30, head: es(t, 0.6, 0.9) * (1 - es(t, 1.8, 2.0)) * 8 - point * 4, blink: blinkAt(T, 1) });
      const moved = es(t, 0.45, 0.75) * (1 - es(t, 1.4, 1.6));
      vis(jHeart, { x: jx + 4, y: F + 12 - 118, s: moved * (1 + Math.sin(T * 7) * 0.06), o: moved > 0.01 ? 1 : 0 });
      rings(jx + 4, F + 12 - 118, moved, T, { spread: 2.6, speed: 0.35 });
      MO.forEach((m) => {
        const K = [[0.1 + m.i * 0.06, m.x - 380], [0.9 + m.i * 0.06, m.x]];
        const x = kf(t, K, ease.out);
        m.p.set({ x, y: F + 6 + (m.i % 2) * 10, s: 0.9, walk: moving(t, K) ? x * 0.1 : undefined, armF: 12 + es(t, 5.6, 5.9) * 30, head: 10 - es(t, 5.6, 5.9) * 14, blink: blinkAt(T, m.i + 6) });
      });
      disc.forEach((d) => {
        const K = [[0.05 + d.i * 0.05, d.x - 380], [0.8 + d.i * 0.05, d.x]];
        const x = kf(t, K, ease.out);
        d.p.set({ x, y: d.y, s: 0.92, walk: moving(t, K) ? x * 0.1 : undefined, armF: 10, head: 4 - es(t, 5.6, 5.9) * 10, blink: blinkAt(T, d.i + 4) });
      });
      const MYK = [[0, 300], [0.75, 700]];
      const myx = kf(t, MYK, ease.out);
      my.set({ x: myx, y: F + 14, s: 0.95, walk: moving(t, MYK) ? myx * 0.1 : undefined, armF: 30, armB: 20, head: 12, blink: blinkAt(T, 4) });

      /* Peter and Andrew go to the stone — and roll it away */
      const PK = [[2.25, 660], [2.75, 930]], AK = [[2.3, 600], [2.8, 880]];
      const push = es(t, 5.4, 5.78, ease.io);
      const back = es(t, 5.8, 6.0, ease.io);
      const px = t < 2.25 ? 660 : kf(t, PK) + push * 120 - back * 190, ax = t < 2.3 ? 600 : kf(t, AK) + push * 120 - back * 200;
      const stepping = (push > 0 && push < 1) || (back > 0 && back < 1);
      peter.set({ x: px, y: F + 16, s: 0.94, flip: back > 0.02 && back < 0.98, walk: moving(t, PK) || stepping ? px * 0.1 : undefined, armF: 14 + es(t, 5.3, 5.42) * 80 * (1 - back), armB: 8 + es(t, 5.3, 5.42) * 70 * (1 - back), lean: es(t, 5.3, 5.42) * 12 * (1 - es(t, 5.78, 5.85)), blink: blinkAt(T, 7) });
      andrew.set({ x: ax, y: F + 4, s: 0.9, flip: back > 0.02 && back < 0.98, walk: moving(t, AK) || stepping ? ax * 0.1 : undefined, armF: 14 + es(t, 5.3, 5.42) * 80 * (1 - back), armB: 8 + es(t, 5.3, 5.42) * 70 * (1 - back), lean: es(t, 5.3, 5.42) * 12 * (1 - es(t, 5.78, 5.85)), blink: blinkAt(T, 8) });
      pose(stone, { x: DOOR.x + push * 175, y: SY, r: push * 150 });

      /* v38b — a cave, and a stone */
      const lk = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.95, 2.15));
      vis(caveT, { x: DOOR.x - 20, y: 400 - (1 - lk) * 420, r: Math.sin(T * 0.8) * 2, o: lk > 0.01 ? 1 : 0 });
      vis(stoneT, { x: DOOR.x + (S.portrait ? 85 : 120), y: 490 - (1 - es(t, 1.2, 1.5, ease.back) * (1 - es(t, 1.95, 2.15))) * 420, r: Math.sin(T * 0.9 + 1) * 2, o: lk > 0.01 ? 1 : 0 });

      /* v39b — Martha: "Lord, there is a smell"; v39c — four days */
      const MK = [[3.0, 1180], [3.35, 920]];
      const mx = kf(t, MK, ease.out);
      const stop = es(t, 3.3, 3.55) * (1 - es(t, 5.1, 5.4));
      mt.set({ x: mx, y: F + 10, s: 0.98, flip: true, walk: moving(t, MK) ? mx * 0.11 : undefined, armF: 20 + stop * 60, armB: 10 + stop * 100 * (1 - es(t, 4.0, 4.2)), head: stop * 6 + es(t, 5.1, 5.4) * -6, blink: blinkAt(T, 2), o: t > 3.0 ? 1 : 0 });
      smell.forEach((w, i) => {
        const k = es(t, 3.4, 3.6) * (1 - es(t, 4.0, 4.2));
        const u = T ? (T * 0.4 + i * 0.5) % 1 : 0.5;
        vis(w, { x: DOOR.x - 60 + i * 110, y: DOOR.y - 60 - u * 40, s: 0.8, o: k * Math.sin(u * PI) });
      });
      days.forEach((d) => {
        const k = es(t, 4.05, 4.35, ease.out) * (1 - es(t, 4.95, 5.15));
        vis(d.el, { x: DOOR.x - 110 + d.i * 72, y: 330 - (1 - k) * 520, r: Math.sin(T * 0.8 + d.i) * 2, o: k > 0.01 ? 1 : 0 });
        if (d.lit) d.lit.setAttribute('opacity', es(t, 4.25 + d.i * 0.1, 4.32 + d.i * 0.1).toFixed(2));
      });

      /* v40 — "you will see the glory of God"; the stone is taken away */
      const fk = es(t, 5.02, 5.25, ease.back) * (1 - es(t, 5.45, 5.6));
      vis(faithP, { x: 870, y: 330 - (1 - fk) * 520, r: Math.sin(T * 0.8) * 1.5, o: fk > 0.01 ? 1 : 0 });

      // phone: the camera goes on to the cave, so the stone, its labels, the four days and the open door are in view
      S.cam.x = S.portrait ? kf(t, [[0, -40], [1, 20], [1.4, 200], [2, 220], [5, 230], [5.4, 240], [6, 330]])
        : kf(t, [[0, -40], [1, 20], [2, 120], [3, 60], [4, 80], [5, 100], [6, 130]]);
      S.cam.y = kf(t, [[0, 0], [1, -20], [2, -40], [3, -20], [4, -20], [5, -60], [6, -30]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.08], [3, 1.04], [4, 1.06], [5, 1.02], [6, 1.06]]);
    };
  },
};
