// Mt 25,35–36 — the King tells the blessed why; each work of mercy comes down over them as its own small painted scene
// on strings. Hungry: a beggar with an empty bowl, and a woman puts a loaf into it. Thirsty: a traveller kneeling by a
// well, and a girl tips her water jar for him. A stranger at night with his staff, and a door that opens on lamplight.
// Naked: a shivering man in rags, and a warm cloak laid round his shoulders. Sick: a man on his mat, and someone
// kneeling by him with a bowl. In prison: a face behind the bars, and a visitor with bread and a lamp.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { judgementSet, JG, flockAt, judgeRest, shadeLayer, glowDisc, vignette, MERCY } from './lib.js';


export default {
  id: 'mt25-mercy',
  beats: [
    { v: 35, text: 'Bo byłem głodny, a daliście Mi jeść;' },
    { v: 35, cont: true, text: 'byłem spragniony, a daliście Mi pić;' },
    { v: 35, cont: true, text: 'byłem przybyszem, a przyjęliście Mnie;' },
    { v: 36, text: 'byłem nagi, a przyodzialiście Mnie;' },
    { v: 36, cont: true, text: 'byłem chory, a odwiedziliście Mnie;' },
    { v: 36, cont: true, text: 'byłem w więzieniu, a przyszliście do Mnie".' },
  ],
  cam: { x: [-50, 10], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const J = judgementSet(S);
    const c = J.c;
    const warmL = J.warmL;
    const coolL = shadeLayer(S);
    const vL = S.layer({ par: 0.32, sh: 6 });
    const V = MERCY.map((k) => vignette(S, vL, k, true));
    const [VX, VY, VS] = S.portrait ? [800, 150, 0.9] : [560, 335, 0.86];

    return (t, time) => {
      const T = time;
      const b = Math.max(0, Math.min(5, Math.floor(t)));
      const u = t - b;
      const say = bump(u, 0.02, 0.5);
      judgeRest(J, T, { flip: true, armF: 40 + say * 50, armB: 20 + es(u, 0.05, 0.3) * 30, head: -4 });
      flockAt(J, 1, T);
      warmL.fade(0.9);
      coolL.fade(0.3);
      V.forEach((v, i) => {
        const tt = t - i;
        const inK = es(tt, 0.0, 0.22, ease.out), outK = es(tt, 0.9, 1.0, ease.in);
        const k = es(tt, 0.25, 0.6);
        const on = tt > -0.01 && tt < 1.0 && inK > 0.01;
        v.set(VX, VY - (1 - inK) * 1600 - outK * 1600, VS, k, on ? 1 : 0, 0);
      });
      S.cam.x = S.portrait ? 0 : -es(t, 0, 0.4) * 40;
      S.cam.z = 1 + es(t, 0, 0.4) * 0.03;
    };
  },
};
