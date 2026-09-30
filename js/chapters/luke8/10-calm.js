// Łk 8,24b–25 — still in the storm, Jesus stands up at the stern and rebukes the wind and the raging water: a burst
// of light from His raised hand; the storm clouds are drawn up into the flies, the rain stops, the great waves sink
// away, and there is calm under a washed, clear sky. "Where is your faith?" The disciples, afraid, look at one another
// in wonder: "Who then is this, that He commands even the winds and the water, and they obey Him?"
import { C, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { stormSet, bubble, tr, PI } from './lib.js';

export default {
  id: 'lk8-calm',
  beats: [
    { v: 24, cont: true, text: 'Lecz On wstał, rozkazał wichrowi i wzburzonej fali:' },
    { v: 24, cont: true, text: 'uspokoiły się i nastała cisza.' },
    { v: 25, text: 'A do nich rzekł: «Gdzie jest wasza wiara?»' },
    { v: 25, cont: true, text: 'Oni zaś przestraszeni i pełni podziwu mówili nawzajem do siebie: «Kim właściwie On jest, że nawet wichrom i wodzie rozkazuje, a są Mu posłuszne».' },
  ],
  cam: { x: [-200, 80], y: [-40, 90], z: [0.96, 1.3] },
  build(S) {
    const st = stormSet(S);
    const c = st.c;
    const W = S.layer({ par: 0.62, sh: 3 });
    const faith = W.add(`<g opacity="0">${bubble(c, tr('Gdzie jest wasza wiara?', 'Where is your faith?'), { size: 22, fill: C.halo, dir: -1 })}</g>`);
    const who = W.add(`<g opacity="0">${bubble(c, [tr('Kim właściwie On jest, że nawet', 'Who is this, then, that he commands'), tr('wichrom i wodzie rozkazuje?', 'even the winds and the water?')], { size: 20, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      const storm = 1 - es(t, 1.02, 1.7);
      const clear = es(t, 1.4, 2.1);
      const fill = (1 - es(t, 1.2, 1.9)) * 0.85;
      const flash = bump(t, 0.4, 0.55) * 0.9;
      st.update(t, T, { storm, clear, travel: 1, fill, flash });

      /* v24b — He rises and rebukes the wind and the raging water */
      const stand = es(t, 0.05, 0.12);
      const cmd = es(t, 0.2, 0.5) * (1 - es(t, 1.8, 2.2));
      const speak = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      st.place(st.P.sit, -110, -4, { s: 0.9, o: 1 - stand, armF: 30, armB: 14, head: -6, blink: blinkAt(T) });
      st.place(st.P.stand, -118, -8, { s: 0.98, o: stand, armF: 20 + cmd * 85 + speak * 50, armB: 10 + cmd * 150 + speak * 20, head: -cmd * 10 + speak * 4, blink: blinkAt(T) });
      st.place(st.P.lie, 4, -50, { s: 0.84, r: -90, o: 0 });
      st.zs.forEach((z) => pose(z, { o: 0 }));
      const [bx, by] = st.at(-118, -210);
      pose(st.burst, { x: bx, y: by, s: 0.25 + es(t, 0.25, 0.9) * 0.75, r: T * 5, o: bump(t, 0.2, 2.2) * 0.4 });

      /* the disciples: afraid → still → ashamed → marvelling to one another */
      st.DIS.forEach((d, i) => {
        const fear = 1 - es(t, 1.2, 1.8);
        const ashamed = es(t, 2.2, 2.4) * (1 - es(t, 3.0, 3.2));
        const awe = es(t, 3.05, 3.3);
        const lean = T ? storm * Math.sin(T * 1.7 + d.seed) * 6 : 0;
        const face = awe > 0.5 ? (i % 2 ? true : false) : true;
        st.place(d.p, d.x, 4, {
          s: 0.95, flip: face,
          armF: 20 + fear * 50 + awe * (i % 2 ? 60 : 20), armB: 10 + fear * 110 + awe * (i % 2 ? 0 : 70),
          head: ashamed * 14 - awe * 6 + lean * 0.5, lean: lean - awe * (i % 2 ? 4 : -4), blink: blinkAt(T, d.seed),
        });
      });

      /* v25a — "Where is your faith?" */
      const [hx, hy] = st.at(-100, -170);
      const fb = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.92, 3.02));
      pose(faith, { x: hx + 24, y: hy - 34, s: fb, o: fb > 0.02 ? 1 : 0 });
      /* v25b — "Who then is this?" */
      const [ax, ay] = st.at(110, -210);
      const ab = es(t, 3.1, 3.3, ease.back);
      pose(who, { x: ax, y: ay, s: ab, o: ab > 0.02 ? 1 : 0 });

      S.cam.x = -120 + es(t, 0.9, 1.5) * 60 + es(t, 2.9, 3.3) * 60;
      S.cam.z = 1.2 - es(t, 0.9, 1.6) * 0.14 + es(t, 2.0, 2.3) * 0.06 - es(t, 2.9, 3.3) * 0.06;
      S.cam.y = 40 - es(t, 0.9, 1.6) * 20;
    };
  },
};
