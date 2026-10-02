// Mt 25,41–43 — the King turns to those on his left. "Depart from me, you cursed": he lifts his hand, and the shade over
// them deepens as they draw back. "Into the eternal fire prepared for the devil and his angels": a dark round picture
// comes down — a rift glowing low like embers, and dark winged shadows sinking into it (symbol only, kept restrained).
// Then the same six scenes again, but undone: the loaf carried past the beggar's empty bowl; the water jar carried
// past the kneeling traveller; the door shut on the stranger in the night; the cloak kept, the man shivering in rags;
// the sick man alone on his mat by an empty stool; the prisoner alone behind his bars.
import { C, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { judgementSet, JG, flockAt, judgeRest, shadeLayer, glowDisc, vignette, MERCY, rift, fallenShadow, plateOn, voiceRings } from './lib.js';


export default {
  id: 'mt25-left',
  beats: [
    { v: 41, text: 'Wtedy odezwie się i do tych po lewej stronie:' },
    { v: 41, cont: true, text: '"Idźcie precz ode Mnie, przeklęci,' },
    { v: 41, cont: true, text: 'w ogień wieczny, przygotowany diabłu i jego aniołom!' },
    { v: 42, text: 'Bo byłem głodny, a nie daliście Mi jeść;' },
    { v: 42, cont: true, text: 'byłem spragniony, a nie daliście Mi pić;' },
    { v: 43, text: 'byłem przybyszem, a nie przyjęliście Mnie;' },
    { v: 43, cont: true, text: 'byłem nagi, a nie przyodzialiście Mnie;' },
    { v: 43, cont: true, text: 'byłem chory i w więzieniu, a nie odwiedziliście Mnie."' },
  ],
  cam: { x: [-10, 60], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const J = judgementSet(S);
    const c = J.c;
    const warmL = J.warmL;
    const coolL = shadeLayer(S);
    const fx = S.layer({ par: 0.32, sh: 6 });
    const R = 76;
    const pit = fx.add(`<g>${plateOn(c, `<defs><clipPath id="mt25-pit"><circle r="${R - 2}"/></clipPath></defs><g clip-path="url(#mt25-pit)"><path d="M-80 -80H80V80H-80Z" fill="#2a2440"/><g transform="translate(0 34)">${rift(c, 150)}</g></g>`, { r: R, rim: mix(C.rock3, C.storm, 0.4), face: '#2a2440' })}</g>`);
    const falls = [0, 1].map(() => fx.add(`<g>${fallenShadow(c)}</g>`));
    const vL = S.layer({ par: 0.32, sh: 6 });
    const V = MERCY.map((k) => vignette(S, vL, k, false));
    const P = S.portrait;
    const VX = P ? 800 : 1040, VY = P ? 150 : 290, VS = 0.9;
    // which vignettes show in which beat (3…7), and where
    const SHOW = [[3, [[0, VX, VS]]], [4, [[1, VX, VS]]], [5, [[2, VX, VS]]], [6, [[3, VX, VS]]], [7, P ? [[4, 700, 0.6], [5, 900, 0.6]] : [[4, 945, 0.6], [5, 1115, 0.6]]]];
    const voice = voiceRings(vL, c, { n: 3, r: 26, w: 4, color: C.haloRim });

    return (t, time) => {
      const T = time;
      /* v41a — he turns to those on his left; v41b — depart */
      const lift = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.2) * 0.6);
      judgeRest(J, T, { flip: false, armF: 30 + lift * 70, armB: 10, head: -2 + lift * 4, rightNat: false });
      voice(JG.TX + 24, JG.TY - 90, es(t, 0.1, 0.3) * (1 - es(t, 2.8, 3)), T, { dir: 1, s0: 0.7 });
      const back = es(t, 1.1, 1.6);
      J.NR.back.set({ x: J.RX + back * 50, y: JG.NY - 30 - back * 12, s: 1 - back * 0.05 });
      J.NR.front.set({ x: J.RX + back * 60, y: JG.NY + 10 - back * 10, s: 1 - back * 0.05 });
      flockAt(J, 1, T, { goatX: J.GX + back * 50 });
      warmL.fade(0.8);
      coolL.fade(0.3 + back * 0.16);
      /* v41c — the fire prepared for the devil and his angels: a dark picture, restrained */
      const pk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.9, 3.0, ease.in));
      const px = P ? 880 : 1040, py = lerp(-1500, P ? 150 : 250, pk);
      pose(pit, { x: px, y: py, r: Math.sin(T * 0.7) * 1.5, o: pk > 0.01 ? 1 : 0 });
      falls.forEach((f, i) => {
        const sink = es(t, 2.3 + i * 0.15, 2.85 + i * 0.1);
        pose(f, { x: px - 26 + i * 50, y: py + lerp(-40, 40, sink), s: 0.3 - sink * 0.1, o: pk > 0.01 ? (1 - seg(sink, 0.8, 1)) : 0 });
      });
      /* v42–43 — the same six, undone */
      V.forEach((v, id) => {
        const hit = SHOW.find(([, l]) => l.some(([i]) => i === id));
        const [b, list] = hit;
        const [, x, s] = list.find(([i]) => i === id);
        const tt = t - b;
        const inK = es(tt, 0.0, 0.22, ease.out), outK = b === 7 ? 0 : es(tt, 0.9, 1.0, ease.in);
        const on = tt > -0.01 && (tt < 1.0 || b === 7) && inK > 0.01;
        v.set(x, VY - (1 - inK) * 1600 - outK * 1600, s, 0, on ? 1 : 0, 0);
      });
      S.cam.x = P ? 0 : es(t, 0.05, 0.5) * 40;
      S.cam.z = 1 + es(t, 0.05, 0.5) * 0.03;
    };
  },
};
