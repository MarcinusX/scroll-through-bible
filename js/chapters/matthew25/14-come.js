// Mt 25,34 — the King turns to those on his right and opens his arms to them. "Come, you blessed of my Father": light
// pours down on them from above — the Father is never a figure, only this light. "Inherit the Kingdom prepared for you
// from the foundation of the world": behind them a golden gate rises out of the clouds, full of light, and beside it
// the little round world comes down on its string with a golden foundation stone laid under it.
import { C, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { judgementSet, JG, flockAt, judgeRest, kingdomGateSet, shadeLayer, glowDisc, rayBurst, radiance, globe, voiceRings, PI } from './lib.js';

export default {
  id: 'mt25-come',
  beats: [
    { v: 34, text: 'Wtedy odezwie się Król do tych po prawej stronie:' },
    { v: 34, cont: true, text: '"Pójdźcie, błogosławieni Ojca mojego,' },
    { v: 34, cont: true, text: 'weźcie w posiadanie królestwo, przygotowane wam od założenia świata!' },
  ],
  cam: { x: [-60, 10], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    let gate;
    const J = judgementSet(S, { behind: (S2) => { const L = S2.layer({ par: 0.2, sh: 4 }); gate = kingdomGateSet(S2, L, { x: S2.portrait ? 560 : 450, y: 560, sc: 1.2 }); return L; } });
    const c = J.c;
    const warmL = J.warmL;
    const coolL = shadeLayer(S);
    const lightL = S.layer({ par: 0.3, sh: 0, flat: true, rise: 0, blur: 8 });
    const shaft = lightL.add(`<g><path d="${c.poly([[-60, -900], [60, -900], [210, -120], [-210, -120]])}" fill="#fff3cf" opacity=".28"/><g transform="translate(0 -520)">${rayBurst(c, { n: 14, r0: 30, r1: 260, spread: 0.06, color: '#fff3cf', o: 0.6 })}</g></g>`);
    const sun = lightL.add(`<g>${glowDisc(120, 'halo-glow', 1)}${radiance(c, 40)}</g>`);
    const fx = S.layer({ par: 0.25, sh: 5 });
    const world = fx.add(`<g><path d="M0 -56V-1600" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${glowDisc(90, 'halo-glow', 0.8)}${globe(c, 48)}<path d="${c.cut(c.rect(-30, 50, 60, 22), 0.4, 5)}" fill="${C.sun}"/><path d="${c.cut(c.rect(-24, 54, 48, 4), 0.2, 4)}" fill="${mix(C.sun, C.sunDeep, 0.4)}"/></g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 26, w: 4, color: C.haloRim });

    return (t, time) => {
      const T = time;
      /* v34a — he turns to those on his right */
      const turn = es(t, 0.05, 0.12);
      const open = es(t, 0.15, 0.4);
      judgeRest(J, T, { flip: turn > 0.5, armF: 30 + open * 60, armB: 10 + open * 90 + es(t, 1.05, 1.3) * 30, head: -4 });
      voice(JG.TX - 20, JG.TY - 90, es(t, 0.1, 0.3) * (1 - es(t, 2.8, 3)), T, { dir: -1, s0: 0.7 });
      flockAt(J, 1, T);
      warmL.fade(0.8 + es(t, 1.05, 1.4) * 0.2);
      coolL.fade(0.3);
      /* v34b — blessed of my Father: light pours down on them */
      const bl = es(t, 1.05, 1.45);
      pose(shaft, { x: J.LX, y: JG.NY - 40, o: bl });
      /* v34c — the Kingdom prepared from the foundation of the world */
      const gk = es(t, 2.05, 2.55, ease.out);
      gate.set(gk, es(t, 2.4, 2.8));
      const wk = es(t, 2.2, 2.55, ease.out);
      pose(world, { x: 640, y: lerp(-1500, 250, wk), r: Math.sin(T * 0.7) * 2, o: wk > 0.01 ? 1 : 0 });
      pose(sun, { x: J.LX, y: lerp(-200, 120, bl) - es(t, 2.0, 2.4) * 60, o: bl * (1 - es(t, 2.0, 2.3) * 0.4) });

      S.cam.x = S.portrait ? 0 : -es(t, 0.05, 0.6) * 50;
      S.cam.y = -es(t, 1.9, 2.4) * 30;
      S.cam.z = 1 + es(t, 0.05, 0.6) * 0.04;
    };
  },
};
