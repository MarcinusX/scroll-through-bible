// Łk 9,28–29 — "About eight days after these sayings": eight little suns come down on their strings one after another
// (the last one paler — about eight). He takes Peter, John and James and goes up the mountain to pray: the four climb
// the path to the top as the day goes down, and the moon comes out. There He kneels to pray, the three a little way off.
// "As He was praying, the appearance of His face was changed": a light gathers on His face; "and His clothing became
// white and dazzling": His robe flashes white, and light breaks out round Him in the dark like lightning.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { summitSet, SUM, TW9, JESUS_WHITE, halo, rayBurst, kf, headAt, PI } from './lib.js';

const PATH = [[-160, 890], [80, 830], [300, 770], [470, 724], [600, 690], [720, 650], [800, SUM.TOP]];
const THREE = [{ k: 'james', x: 470, y: SUM.LEDGE }, { k: 'peter', x: 580, y: SUM.LEDGE + 6 }, { k: 'john', x: 1070, y: SUM.LEDGE }];

function along(u) {
  let tot = 0; const L = [];
  for (let i = 1; i < PATH.length; i++) { const l = Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]); L.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const k = Math.min(1, d / L[i]); return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * k, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * k]; } d -= L[i]; }
  return PATH[PATH.length - 1];
}

export default {
  id: 'lk9-pray',
  beats: [
    { v: 28 },
    { v: 29 },
  ],
  cam: { x: [-40, 20], y: [0, 50], z: [1, 1.16] },
  build(S) {
    const M = summitSet(S);
    const c = S.c;
    /* the eight days */
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const SUNS = Array.from({ length: 8 }, (_, i) => ({ i, el: hanging(hangL, `<g opacity="${i === 7 ? 0.6 : 1}">${sun(c, 20)}</g>`, { x: 0, y: -1500, len: 900 }) }));

    /* the light round Him */
    const glowL = S.layer({ par: 0.4, sh: 1, flat: true });
    const faceGlow = glowL.add(`<g opacity="0">${halo(90, 1)}</g>`);
    const bolt = glowL.add(`<g opacity="0">${rayBurst(c, { n: 26, r0: 40, r1: 250, spread: 0.026, color: '#ffeec2', o: 0.6 })}${halo(200, 1)}</g>`);

    /* the four */
    const act = S.layer({ par: 0.4, sh: 5 });
    const D = THREE.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), w: S.puppet(act.add(person(c, TW9[d.k]))), s: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))) }));
    const jW = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const jK = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jKW = S.puppet(act.add(person(c, { ...JESUS_WHITE, pose: 'kneel' })));
    M.front();

    return (t, time) => {
      const T = time;
      const nightK = es(t, 0.3, 1.2);
      const white = es(t, 1.42, 1.48);
      const shine = es(t, 1.4, 1.7);
      M.set(T, { k: nightK, g: shine * 0.35, moonK: es(t, 0.5, 0.8, ease.back) });

      /* v28 — eight days */
      SUNS.forEach((s) => {
        const k = es(t, 0.0 + s.i * 0.05, 0.14 + s.i * 0.05, ease.back) * (1 - es(t, 0.9, 1.1));
        pose(s.el, { x: 560 + s.i * 68, y: lerp(-1500, 170 + (s.i % 2) * 22, k), r: Math.sin(T * 0.8 + s.i) * 3, oy: 0, o: k > 0.002 ? 1 : 0 });
      });
      /* the climb: Jesus first, the three behind Him */
      const climb = (lag) => seg(t, 0.12 + lag, 0.95 + lag * 0.3);
      const uJ = climb(0);
      const [jx, jy] = along(uJ);
      const kneel = es(t, 1.02, 1.08);
      jW.set({ x: jx, y: jy, s: 1.0, walk: uJ > 0 && uJ < 1 ? t * 16 : undefined, o: (uJ > 0 ? 1 : 0) * (1 - kneel), armF: 20, blink: blinkAt(T, 1) });
      const prayF = 70 + Math.sin(T * 0.8) * 0;
      jK.set({ x: SUM.JX, y: SUM.TOP, s: 1.02, o: kneel * (1 - white), armF: prayF, armB: 60, head: -16 - es(t, 1.2, 1.4) * 6, blink: 0 });
      jKW.set({ x: SUM.JX, y: SUM.TOP, s: 1.02, o: white, armF: prayF + shine * 20, armB: 60 + shine * 60, head: -22 + shine * 4, blink: 0 });
      const [hx, hy] = headAt(SUM.JX, SUM.TOP, 1.02, false, 46);
      const face = es(t, 1.2, 1.4);
      pose(faceGlow, { x: hx, y: hy, s: 0.6 + face * 0.8, o: face });
      pose(bolt, { x: SUM.JX, y: SUM.TOP - 110, s: 0.5 + shine * 0.6 + bump(t, 1.45, 1.6) * 0.2, r: T * 4, o: shine * (0.8 + bump(t, 1.45, 1.6) * 0.2) });
      D.forEach((d) => {
        const u = climb(0.02 + d.i * 0.03);
        const [px, py] = along(u * 0.86);
        const arrive = es(t, 0.95 + d.i * 0.04, 1.1 + d.i * 0.04);
        const x = lerp(px - 40, d.x, arrive), y = lerp(py + 10, d.y, arrive);
        const sit = es(t, 1.12 + d.i * 0.04, 1.18 + d.i * 0.04);
        const walking = (u > 0 && u < 1) || (arrive > 0 && arrive < 1);
        d.w.set({ x, y, s: 0.96, flip: arrive > 0.5 && d.x > SUM.JX, walk: walking ? t * 16 + d.i : undefined, o: (u > 0 ? 1 : 0) * (1 - sit), armF: 20, blink: blinkAt(T, d.seed) });
        const drowse = es(t, 1.3, 1.9);
        const look = bump(t, 1.45, 1.75);
        d.s.set({ x: d.x, y: d.y, s: 0.96, flip: d.x > SUM.JX, o: sit, armF: 30 + look * 60, armB: 10 + look * 100, head: drowse * 14 - look * 16, lean: drowse * 6, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, -30], [0.6, -20], [1.0, 0]]);
      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.06], [1.3, 1.12], [1.9, 1.14]]);
      S.cam.y = kf(t, [[0, 40], [0.9, 40], [1.3, 30], [1.9, 20]]);
    };
  },
};
