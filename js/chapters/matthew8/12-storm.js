// Mt 8,23–25 — Jesus steps into the boat and His disciples climb in after Him; they push off from Capernaum and
// He lies down on the cushion at the stern. Suddenly the storm comes down: the sky darkens, clouds drop on their
// strings, lightning, rain, and great waves rise; they break over the boat and it fills while two of them bail — and
// He sleeps (the camera goes close: paper z's float up). They come to Him and shake Him awake: "Lord, save us, we
// are perishing!"
import { C, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { stormSet, cry, tr, PI } from './lib.js';

export default {
  id: 'mt8-storm',
  beats: [
    { v: 23 },
    { v: 24, text: 'Nagle zerwała się gwałtowna burza na jeziorze,' },
    { v: 24, cont: true, text: 'tak że fale zalewały łódź;' },
    { v: 24, cont: true, text: 'On zaś spał.' },
    { v: 25, text: 'Wtedy przystąpili do Niego i obudzili Go, mówiąc:' },
    { v: 25, cont: true, text: '«Panie, ratuj, giniemy!»' },
  ],
  cam: { x: [-320, 100], y: [-40, 90], z: [0.96, 1.4] },
  build(S) {
    const st = stormSet(S);
    const c = st.c;
    const W = S.layer({ par: 0.62, sh: 3 });
    const help = W.add(`<g opacity="0">${cry(c, tr('Panie, ratuj, giniemy!', 'Save us, Lord! We are dying!'), { size: 24, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      const storm = es(t, 1.0, 1.6);
      const travel = es(t, 0.8, 1.8);
      const fill = es(t, 2.05, 2.7) * 0.8;
      const flash = Math.max(bump(t, 1.2, 1.35), bump(t, 1.45, 1.55) * 0.7, bump(t, 2.4, 2.5) * 0.8, bump(t, 5.3, 5.4) * 0.7);
      const b = st.update(t, T, { storm, travel, fill, flash });

      /* v23 — He steps in; the disciples follow; He lies down at the stern */
      const inJ = es(t, 0.02, 0.2);
      const lie = es(t, 0.95, 1.01);
      st.place(st.P.stand, -118, -8 - (1 - inJ) * 60, { s: 0.98, o: inJ * (1 - lie), armF: 20 + bump(t, 0.15, 0.6) * 40, blink: blinkAt(T) });
      st.place(st.P.lie, 4, -50 + (T ? Math.sin(T * 1.2) * 0.6 : 0), { s: 0.84, r: -90, o: lie, armF: 20, armB: 10 });
      st.place(st.P.sit, -110, -4, { s: 0.9, o: 0 });
      st.zs.forEach((z, i) => {
        const k = T ? ((T * 0.45 + i / 3) % 1) : (i + 0.5) / 3;
        const [zx, zy] = st.at(-160 + i * 16 + k * 20, -110 - k * 60 - i * 10);
        pose(z, { x: zx, y: zy, o: lie * es(t, 3.05, 3.3) * (1 - es(t, 4.2, 4.4)) * Math.sin(k * PI) });
      });

      /* the disciples: climb in, row, bail, panic, wake Him */
      st.DIS.forEach((d, i) => {
        const inK = es(t, 0.2 + i * 0.08, 0.45 + i * 0.08);
        const bail = d.bail ? es(t, 2.1, 2.3) * (1 - es(t, 4.0, 4.2)) : 0;
        const panic = es(t, 4.05, 4.3);
        const wake = d.k === 'peter' ? es(t, 4.05, 4.4) : 0;
        const shake = d.k === 'peter' ? (T ? Math.sin(T * 14) : 0) * es(t, 4.3, 4.5) * (1 - es(t, 5.4, 5.8)) : 0;
        const lean = T ? storm * Math.sin(T * 1.7 + d.seed) * 6 : 0;
        const cryK = es(t, 5.05, 5.25);
        st.place(d.p, d.x - wake * 150, 4 - (1 - inK) * 70, {
          s: 0.95, o: inK, flip: panic > 0.5 || (d.k === 'peter' && wake > 0.3),
          armF: 20 + bail * (60 + (T ? Math.sin(T * 7 + d.seed) * 60 : 0)) + wake * (60 + shake * 10) + panic * (d.bail ? 20 : 40) + cryK * (d.k === 'peter' ? 0 : 30),
          armB: 10 + panic * (d.bail ? 40 : 90) + cryK * 70 * (d.k === 'peter' ? 0 : 1),
          head: -panic * 8 + lean * 0.5 + wake * 10, lean: lean + wake * 18, blink: blinkAt(T, d.seed),
        });
      });

      /* v25b — "Lord, save us, we are perishing!" */
      const [px, py] = st.at(-20, -250);
      const hk = es(t, 5.08, 5.28, ease.back);
      pose(help, { x: px, y: py, s: hk, r: hk > 0.02 && T ? Math.sin(T * 7) * 2 : 0, o: hk > 0.02 ? 1 : 0 });

      /* camera: follow the boat out, pull back for the storm, go close to the sleeper, then back */
      S.cam.x = lerp(-150, 0, travel) - es(t, 3.0, 3.4) * 200 + es(t, 4.8, 5.2) * 150;
      S.cam.z = 1.05 - es(t, 1.0, 1.5) * 0.06 + es(t, 3.0, 3.4) * 0.3 - es(t, 4.8, 5.2) * 0.2;
      S.cam.y = 30 + es(t, 3.0, 3.4) * 40 - es(t, 4.8, 5.2) * 40;
    };
  },
};
