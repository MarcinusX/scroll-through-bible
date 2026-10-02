// Mt 25,31–33 — the Last Judgement. The dusk sky breaks into gold and long rays turn slowly: the Son of Man comes down
// in his glory, crowned as King, and the angels come in from both sides on the clouds. The throne of light comes down
// behind him and he sits on it. All the nations are gathered before him — people of every land and dress, pressing in
// from far away. As a shepherd parts his flock, a mixed flock of sheep and goats at his feet separates: the sheep go to
// his right, the goats to his left, and the peoples part with them; a warm light falls on the right, a shade on the left.
import { C, blinkAt, pose, lerp, sheet } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { judgementSet, JG, flockAt, shadeLayer, glowDisc, voiceRings, PI } from './lib.js';

export default {
  id: 'mt25-glory',
  beats: [
    { v: 31, text: 'Gdy Syn Człowieczy przyjdzie w swej chwale i wszyscy aniołowie z Nim,' },
    { v: 31, cont: true, text: 'wtedy zasiądzie na swoim tronie pełnym chwały.' },
    { v: 32, text: 'I zgromadzą się przed Nim wszystkie narody,' },
    { v: 32, cont: true, text: 'a On oddzieli jednych [ludzi] od drugich, jak pasterz oddziela owce od kozłów.' },
    { v: 33 },
  ],
  cam: { x: [-20, 20], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const J = judgementSet(S, { dusk: true });
    const c = J.c;
    const warmL = J.warmL;
    const coolL = shadeLayer(S);

    return (t, time) => {
      const T = time;
      /* v31a — he comes in glory with all the angels */
      const gold = es(t, 0.05, 0.6);
      J.duskSky.layer.fade(1 - gold);
      J.glory(T, gold);
      const come = es(t, 0.1, 0.75, ease.out);
      const throneK = es(t, 1.05, 1.4, ease.out);
      const seated = es(t, 1.42, 1.5);
      pose(J.throneEl, { x: JG.TX, y: lerp(-1500, JG.TY, throneK), o: throneK > 0.01 ? 1 : 0 });
      pose(J.cf, { x: JG.TX, y: lerp(-300, JG.TY + 72, come), o: come > 0.01 ? 1 : 0 });
      const bless = es(t, 0.6, 0.9) * (1 - es(t, 1.4, 1.5));
      J.kingStand.set({ x: JG.TX, y: lerp(-230, JG.TY + 72, come), s: 0.94, o: 1 - seated, armF: 30 + bless * 60, armB: 20 + bless * 100, head: -2, blink: blinkAt(T, 1) });
      const judge = es(t, 3.05, 3.3) * (1 - es(t, 4.6, 4.9));
      const right = es(t, 4.05, 4.3);
      J.kingSit.set({ x: JG.TX - 6, y: JG.TY + 20, s: 0.9, o: seated, armF: 30 + judge * 50 + right * 20, armB: 10 + judge * 90 * (1 - right) + right * 60, head: -2, blink: blinkAt(T, 1) });
      const ang = es(t, 0.3, 0.9, ease.out);
      J.angL.set({ x: JG.TX - 170 - (1 - ang) * 700, y: JG.CLOUD - 30 - (1 - ang) * 300, o: ang > 0.01 ? 1 : 0 });
      J.angR.set({ x: JG.TX + 170 + (1 - ang) * 700, y: JG.CLOUD - 30 - (1 - ang) * 300, o: ang > 0.01 ? 1 : 0 });

      /* v32a — all the nations gathered; v32b–33 parted like sheep and goats */
      const gather = es(t, 2.05, 2.7, ease.out);
      const part = es(t, 3.35, 3.95);
      const lx = lerp(700, J.LX, part), rx = lerp(900, J.RX, part);
      const s0 = lerp(0.8, 1, gather);
      J.NL.back.set({ x: lx - (1 - gather) * 400, y: JG.NY - 30 - (1 - gather) * 40, s: s0, o: gather });
      J.NL.front.set({ x: lx - (1 - gather) * 500, y: JG.NY + 10 - (1 - gather) * 30, s: s0, o: gather });
      J.NR.back.set({ x: rx + (1 - gather) * 400, y: JG.NY - 30 - (1 - gather) * 40, s: s0, o: gather });
      J.NR.front.set({ x: rx + (1 - gather) * 500, y: JG.NY + 10 - (1 - gather) * 30, s: s0, o: gather });
      const flockIn = es(t, 3.02, 3.3);
      J.flockL.fade(flockIn);
      flockAt(J, part, T, { y: JG.FY + (1 - flockIn) * 60 });
      warmL.fade(es(t, 4.1, 4.5) * 0.8);
      coolL.fade(es(t, 4.1, 4.5) * 0.3);

      S.cam.y = -es(t, 0, 0.8) * 50 * (1 - es(t, 1.9, 2.4)) + es(t, 2.9, 3.4) * 20;
      S.cam.z = 1 + es(t, 1.0, 1.5) * 0.03 * (1 - es(t, 1.9, 2.3)) + es(t, 2.9, 3.4) * 0.02;
    };
  },
};
