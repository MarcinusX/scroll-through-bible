// Łk 8,22–24a — the lake at the Capernaum shore. Jesus steps into the boat with His disciples: "Let us go across to
// the other side of the lake." They push off; the shore slides away. As they sail He lies down on the cushion at the
// stern and falls asleep. Then a windstorm comes down on the lake — the storm clouds are let down on their strings,
// the waves rise, the rain slants, water pours into the boat. They crowd round Him and wake Him: "Master, Master,
// we are perishing!" — and He sits up.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { stormSet, bubble, cry, tr, PI } from './lib.js';

export default {
  id: 'lk8-storm',
  beats: [
    { v: 22, text: 'Pewnego dnia wsiadł ze swymi uczniami do łodzi i rzekł do nich: «Przeprawmy się na drugą stronę jeziora!»' },
    { v: 22, cont: true, text: 'I odbili od brzegu.' },
    { v: 23, text: 'A gdy płynęli, zasnął.' },
    { v: 23, cont: true, text: 'Wtedy spadł gwałtowny wicher na jezioro, tak że fale ich zalewały i byli w niebezpieczeństwie.' },
    { v: 24, text: 'Przystąpili więc do Niego i obudzili Go, wołając: «Mistrzu, Mistrzu, giniemy!»' },
  ],
  cam: { x: [-320, 120], y: [-40, 90], z: [0.96, 1.4] },
  build(S) {
    const st = stormSet(S);
    const c = st.c;
    const W = S.layer({ par: 0.62, sh: 3 });
    const across = W.add(`<g opacity="0">${bubble(c, [tr('Przeprawmy się', 'Let’s go over'), tr('na drugą stronę jeziora!', 'to the other side of the lake!')], { size: 20, dir: -1 })}</g>`);
    const help = W.add(`<g opacity="0">${cry(c, [tr('Mistrzu, Mistrzu,', 'Master, master,'), tr('giniemy!', 'we are dying!')], { size: 24, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      const travel = es(t, 1.05, 1.9);
      const storm = es(t, 3.05, 3.55);
      const fill = es(t, 3.35, 3.9) * 0.85;
      const flash = Math.max(bump(t, 3.2, 3.32), bump(t, 3.45, 3.55) * 0.7, bump(t, 4.2, 4.3) * 0.7);
      st.update(t, T, { storm, travel, fill, flash });

      /* v22a — He gets into the boat with His disciples */
      const inJ = es(t, 0.05, 0.3);
      const lie = es(t, 2.2, 2.26) * (1 - es(t, 4.62, 4.68));
      const sitUp = es(t, 4.62, 4.68);
      const say = es(t, 0.35, 0.6) * (1 - es(t, 0.95, 1.1));
      st.place(st.P.stand, -118, -8 - (1 - inJ) * 60, { s: 0.98, o: inJ * (1 - es(t, 2.2, 2.26)), armF: 20 + say * 70 + bump(t, 1.1, 1.8) * 20, armB: 10 + say * 30, head: -say * 6, blink: blinkAt(T) });
      st.place(st.P.lie, 4, -50 + (T ? Math.sin(T * 1.2) * 0.6 : 0), { s: 0.84, r: -90, o: lie, armF: 20, armB: 10 });
      st.place(st.P.sit, -110, -4, { s: 0.9, o: sitUp, armF: 30, armB: 14, head: -6, blink: blinkAt(T) });
      const [hx, hy] = st.at(-116, -200);
      const sb = es(t, 0.4, 0.55, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(across, { x: hx + 20, y: hy - 30, s: sb, o: sb > 0.02 ? 1 : 0 });
      /* v23a — as they sail, He falls asleep */
      st.zs.forEach((z, i) => {
        const k = T ? ((T * 0.45 + i / 3) % 1) : (i + 0.5) / 3;
        const [zx, zy] = st.at(-150 + i * 16 + k * 20, -100 - k * 60 - i * 10);
        pose(z, { x: zx, y: zy, o: lie * es(t, 2.3, 2.5) * (1 - es(t, 3.4, 3.6)) * Math.sin(k * PI) });
      });

      /* the disciples: climb in, row, bail, panic, wake Him */
      st.DIS.forEach((d, i) => {
        const inK = es(t, 0.15 + i * 0.08, 0.45 + i * 0.08);
        const row = bump(t, 1.05, 1.95) * (T ? Math.sin(T * 4 + i) : 0.5);
        const bail = d.bail ? es(t, 3.4, 3.6) * (1 - es(t, 4.05, 4.2)) : 0;
        const panic = es(t, 3.6, 3.8);
        const wake = d.k === 'peter' ? es(t, 4.05, 4.35) : 0;
        const shake = d.k === 'peter' ? (T ? Math.sin(T * 14) : 0) * es(t, 4.3, 4.45) * (1 - es(t, 4.6, 4.7)) : 0;
        const lean = T ? storm * Math.sin(T * 1.7 + d.seed) * 6 : 0;
        const cryK = es(t, 4.35, 4.5);
        const toward = d.k === 'peter' ? 64 : 0;
        st.place(d.p, d.x - wake * toward, 4 - (1 - inK) * 70, {
          s: 0.95, o: inK, flip: panic > 0.5 || wake > 0.3,
          armF: 20 + row * 30 + bail * (60 + (T ? Math.sin(T * 7 + d.seed) * 60 : 0)) + wake * (60 + shake * 10) + panic * (d.bail ? 20 : 40) + cryK * (d.k === 'peter' ? 0 : 40),
          armB: 10 + row * 20 + panic * (d.bail ? 40 : 90) + cryK * 70 * (d.k === 'peter' ? 0 : 1),
          head: -panic * 8 + lean * 0.5 + wake * 10, lean: lean + wake * 8, blink: blinkAt(T, d.seed),
        });
      });
      /* v24a — "Master, Master, we are perishing!" */
      const [px, py] = st.at(-10, -260);
      const hk = es(t, 4.3, 4.45, ease.back);
      pose(help, { x: px, y: py, s: hk, r: hk > 0.02 && T ? Math.sin(T * 7) * 2 : 0, o: hk > 0.02 ? 1 : 0 });

      /* camera: at the shore, follow the boat out, pull back for the storm, go close for the waking */
      S.cam.x = lerp(-260, 0, travel) - es(t, 4.0, 4.3) * 120;
      S.cam.z = 1.12 - es(t, 1.0, 1.6) * 0.1 + es(t, 2.0, 2.4) * 0.14 - es(t, 3.0, 3.4) * 0.12 + es(t, 4.0, 4.3) * 0.18;
      S.cam.y = 30 + es(t, 2.0, 2.4) * 20 - es(t, 3.0, 3.4) * 20 + es(t, 4.0, 4.3) * 30;
    };
  },
};
