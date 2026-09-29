// Mt 20,6–7 — the eleventh hour: the sun hangs low and golden over the vineyard, where everyone hired so far is at
// work. The householder comes out once more and finds three men still standing in the market — shabby, heads down.
// "Why do you stand here all day idle?" — "Because no one has hired us," with a helpless shrug. "You go into the
// vineyard too!" Their faces lift, and they hurry in at the gate.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineWorld, VW, SLOTS, SKY, OWNER, LAST, crew, worker, workPose, face, kf, moving, kfXY, movingXY, say, tr } from './lib.js';

const OX = 836;
const WAITL = [[560, 704], [636, 696], [708, 706]];

export default {
  id: 'mt20-eleventh',
  parable: true,
  beats: [
    { v: 6, text: 'Gdy wyszedł około godziny jedenastej, spotkał innych stojących' },
    { v: 6, cont: true, text: 'i zapytał ich: "Czemu tu stoicie cały dzień bezczynnie?"' },
    { v: 7, text: 'Odpowiedzieli mu: "Bo nas nikt nie najął".' },
    { v: 7, cont: true, text: 'Rzekł im: "Idźcie i wy do winnicy!"' },
  ],
  cam: { x: [0, 80], y: [0, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const W = vineWorld(S, { sky: SKY.late, sky2: SKY.evening, tags: [11] });

    const P = S.layer({ par: 0.5, sh: 5 });
    const inside = crew(S, P, c, ['first', 'third', 'midday']);
    const last = LAST.map((o, i) => { const el = P.add(worker(c, o, '')); return { i, el, p: S.puppet(el), seed: c.rr(0, 9), at: WAITL[i], sl: SLOTS.last[i] }; });
    const owner = S.puppet(P.add(person(c, OWNER)));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const why = fx.add(`<g>${say(c, tr(['Czemu tu stoicie', 'cały dzień bezczynnie?'], ['Why do you stand here', 'all day idle?']), { size: 19, side: -1 })}</g>`);
    const none = fx.add(`<g>${say(c, tr('Bo nas nikt nie najął.', 'Because no one has hired us.'), { size: 19, side: 1 })}</g>`);
    const go = fx.add(`<g>${say(c, tr('Idźcie i wy do winnicy!', 'You also go into the vineyard!'), { size: 19, side: -1 })}</g>`);

    W.front();

    return (t, time) => {
      const T = time;
      W.update(t, T, { h: lerp(10.4, 11, es(t, 0, 0.7)) + es(t, 3, 4) * 0.2, tag: 11, tagO: es(t, 0.1, 0.35, ease.out) });
      W.sk2L.fade(es(t, 0, 4) * 0.35);

      inside.forEach((m) => {
        const wp = workPose(m.wi + 3, 1);
        m.p.set({ x: m.x, y: m.y, s: m.s, ...wp, blink: blinkAt(T, m.seed) });
      });

      /* v6a — he comes out again and finds them standing */
      const OK = [[0.05, 1010], [0.25, 935], [0.62, OX]];
      const ox = kf(t, OK, (u) => u);
      const ask = es(t, 1.04, 1.2) * (1 - es(t, 1.92, 2.04));
      const send = es(t, 3.04, 3.18);
      owner.set({
        x: ox, y: VW.G + 4, s: 0.98, flip: t > 0.2 && send < 0.5, walk: moving(t, OK, 0.2) ? ox * 0.05 : undefined,
        armF: 12 + es(t, 0.62, 0.75) * 16 + ask * 60 + bump(t, 2.1, 2.9) * 10 + send * 84, armB: ask * 40 + send * 20, head: -2 + bump(t, 2.1, 2.9) * 6, blink: blinkAt(T),
      });
      const k1 = es(t, 1.06, 1.22, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(why, { x: OX - 36, y: VW.G - 214, s: k1, o: k1 > 0.02 ? 1 : 0 });
      const k3 = es(t, 3.05, 3.2, ease.back) * (1 - es(t, 3.9, 4.0));
      pose(go, { x: OX - 20, y: VW.G - 214, s: k3, o: k3 > 0.02 ? 1 : 0 });

      /* the last: slumped; they answer with a shrug; v7b — they brighten and hurry in */
      last.forEach((m) => {
        const go0 = 3.24 + m.i * 0.05;
        const keys = [[go0, m.at], [go0 + 0.14, [930, VW.G + 4]], [go0 + 0.26, m.sl]];
        const [x, y] = kfXY(t, keys);
        const walking = movingXY(t, keys);
        const inV = t > go0 + 0.26;
        const look = es(t, 0.55, 0.8);
        const shrug = es(t, 2.04, 2.2) * (1 - es(t, 2.9, 3.04));
        const glad = es(t, 3.1, 3.25);
        const wp = workPose(12 + m.i, es(t, go0 + 0.26, go0 + 0.34));
        m.p.set({
          x, y, s: lerp(0.94, 0.9, es(t, go0 + 0.14, go0 + 0.26)), flip: walking ? false : inV ? wp.flip : look < 0.5 ? m.i === 2 : false,
          walk: walking ? x * 0.06 + m.i : undefined, amt: 1.3,
          lean: inV ? wp.lean : 6 * (1 - look) * (1 - glad) - shrug * 2,
          armF: inV ? wp.armF : 8 + shrug * (m.i === 1 ? 60 : 30) + glad * (m.i === 0 ? 40 : 20),
          armB: inV ? wp.armB : shrug * (m.i === 1 ? 70 : 40) + glad * (m.i === 2 ? 120 : 0),
          head: inV ? wp.head : 14 * (1 - look) * (1 - glad) + shrug * 10 - glad * 8, blink: blinkAt(T, m.seed),
        });
        face(m.el, 'sad', (1 - glad) * 0.9);
      });
      const k2 = es(t, 2.06, 2.22, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(none, { x: WAITL[1][0] + 10, y: VW.G - 200, s: k2, o: k2 > 0.02 ? 1 : 0 });

      S.cam.x = lerp(50, 20, es(t, 0.3, 0.9)) + es(t, 3.1, 3.6) * 40;
      S.cam.z = 1 + es(t, 0.6, 1.3) * 0.06 - es(t, 3.1, 3.6) * 0.03;
      S.cam.y = 10;
    };
  },
};
