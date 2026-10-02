// Mt 8,26–27 — still in the storm, Jesus sits up and speaks to them first: "Why are you afraid, you of little
// faith?" Then He stands and rebukes the winds and the sea — a burst of light from His raised hand; the clouds are
// drawn up into the flies, the rain stops, the great waves sink away, and there is a great calm under a washed, clear
// sky. The men look at one another: "What kind of man is this, that even the winds and the sea obey Him?"
import { C, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { stormSet, bubble, tr, PI } from './lib.js';

export default {
  id: 'mt8-calm',
  beats: [
    { v: 26, text: 'A On im rzekł: «Czemu bojaźliwi jesteście, małej wiary?»' },
    { v: 26, cont: true, text: 'Potem wstał, rozkazał wichrom i jezioru,' },
    { v: 26, cont: true, text: 'i nastała głęboka cisza.' },
    { v: 27 },
  ],
  cam: { x: [-200, 60], y: [-40, 90], z: [0.96, 1.3] },
  build(S) {
    const st = stormSet(S);
    const c = st.c;
    const W = S.layer({ par: 0.62, sh: 3 });
    const why = W.add(`<g opacity="0">${bubble(c, [tr('Czemu bojaźliwi jesteście,', 'Why are you fearful,'), tr('małej wiary?', 'O you of little faith?')], { size: 22, fill: C.halo, dir: -1 })}</g>`);
    const who = W.add(`<g opacity="0">${bubble(c, [tr('Kimże On jest, że nawet wichry', 'What kind of man is this, that even'), tr('i jezioro są Mu posłuszne?', 'the wind and the sea obey him?')], { size: 21, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      const storm = 1 - es(t, 1.3, 2.25);
      const clear = es(t, 1.8, 2.6);
      const fill = (1 - es(t, 1.9, 2.8)) * 0.8;
      const flash = bump(t, 1.2, 1.35) * 0.9;
      st.update(t, T, { storm, clear, travel: 1, fill, flash });

      /* v26a — He sits up and speaks to them */
      const sit = es(t, 0.02, 0.08);
      const stand = es(t, 1.04, 1.1);
      const talkK = es(t, 0.15, 0.35) * (1 - es(t, 0.9, 1.0));
      st.place(st.P.lie, 4, -50, { s: 0.84, r: -90, o: 1 - sit, armF: 20, armB: 10 });
      st.place(st.P.sit, -112, -4, { s: 0.9, o: sit * (1 - stand), armF: 30 + talkK * 50, armB: 10 + talkK * 30, head: -4, blink: blinkAt(T) });
      const cmd = es(t, 1.1, 1.4) * (1 - es(t, 2.4, 2.8));
      const turn = es(t, 3.0, 3.3);
      st.place(st.P.stand, -118, -8, { s: 0.98, o: stand, armF: 20 + cmd * 85 + turn * 40, armB: 10 + cmd * 150, head: -cmd * 10 + turn * 4, blink: blinkAt(T) });
      st.zs.forEach((z) => pose(z, { o: 0 }));
      const [hx, hy] = st.at(-100, -170);
      const wb = es(t, 0.18, 0.38, ease.back) * (1 - es(t, 0.92, 1.0));
      pose(why, { x: hx + 20, y: hy - 30, s: wb, o: wb > 0.02 ? 1 : 0 });
      const [bx, by] = st.at(-118, -200);
      pose(st.burst, { x: bx, y: by, s: 0.25 + es(t, 1.15, 1.7) * 0.75, r: T * 5, o: bump(t, 1.1, 2.8) * 0.4 });

      /* the disciples: afraid → ashamed → still → marvelling to one another */
      st.DIS.forEach((d, i) => {
        const fear = 1 - es(t, 0.3, 0.9);
        const ashamed = bump(t, 0.3, 1.3);
        const awe = es(t, 3.05, 3.4);
        const lean = T ? storm * Math.sin(T * 1.7 + d.seed) * 6 : 0;
        const face = awe > 0.5 ? (i % 2 ? true : false) : true;
        st.place(d.p, d.x, 4, {
          s: 0.95, flip: face,
          armF: 20 + fear * 50 + awe * (i % 2 ? 60 : 20) + (d.bail ? (1 - storm) * 0 : 0), armB: 10 + fear * 110 + awe * (i % 2 ? 0 : 70),
          head: ashamed * 12 - awe * 6 + lean * 0.5, lean: lean - awe * (i % 2 ? 4 : -4), blink: blinkAt(T, d.seed),
        });
      });

      /* v27 — "What kind of man is this?" */
      const [ax, ay] = st.at(100, -200);
      const ab = es(t, 3.1, 3.3, ease.back);
      pose(who, { x: ax, y: ay, s: ab, o: ab > 0.02 ? 1 : 0 });

      S.cam.x = S.portrait ? -50 + es(t, 1.0, 1.4) * 30 + es(t, 2.0, 2.6) * 40 : -120 + es(t, 1.0, 1.4) * 40 + es(t, 2.0, 2.6) * 60;   // phone: the whole boat
      S.cam.z = 1.2 - es(t, 1.0, 1.5) * 0.12 - es(t, 2.0, 2.6) * 0.06;
      S.cam.y = 40 - es(t, 2.0, 2.6) * 20;
    };
  },
};
