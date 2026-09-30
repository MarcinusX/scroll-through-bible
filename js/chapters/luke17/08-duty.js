// Łk 17,10 — back on the road to Jerusalem in the evening. "Even so you also, when you have done all the things that
// are commanded you": the four about Jesus tie on the servant's red sash, like the servant of the parable, and over
// each of them a green tick pops up — everything done. "Say, 'We are unworthy servants. We have done our duty'": they
// bow before Him, a hand on the heart, and the ticks fold away; Jesus opens His hands over them.
import { C, person, blinkAt, pose, lerp, sheet } from '../kit.js';
import { CAST } from '../kit.js';
import { roadSet, roadFour, tick, halo, behindOf, headAt, voiceRings, addToBody, kf, es, ease, bump, seg } from './lib.js';

const JX = 800, JY = 716;
const SPOT = { peter: [640, 724, false], andrew: [556, 734, false], john: [960, 724, true], james: [1044, 734, true] };

export default {
  id: 'lk17-duty',
  beats: [
    { v: 10, text: 'Tak mówcie i wy, gdy uczynicie wszystko, co wam polecono:' },
    { v: 10, cont: true, text: '"Słudzy nieużyteczni jesteśmy; wykonaliśmy to, co powinniśmy wykonać"».' },
  ],
  cam: { x: [-20, 20], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const R = roadSet(S, { village: false });
    const c = S.c;
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(140, 0.6)}</g>`);
    const F = roadFour(S, act, c);
    // each one again, with the servant's red sash tied round him (cross-faded in as he ties it)
    const END = sheet().p(c.ribbon([[20, -92], [28, -70]], 5), C.terracotta).out();
    const girt = F.ds.map((d) => S.puppet(act.add(addToBody(person(c, { ...CAST[d.k], belt: C.terracotta }), END))));
    const fx = S.layer({ par: 0.45, sh: 5 });
    const ticks = F.ds.map(() => fx.add(`<g opacity="0">${tick(c, 16)}</g>`));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.55 + es(t, 0, 2) * 0.3, sunK: 0.5 + es(t, 0, 2) * 0.3 });
      pose(R.cityGlow, { x: 1000, y: 380, o: 0.6 });

      const bless = es(t, 1.45, 1.75);
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + bump(t, 0.05, 0.9) * 40 + bless * 60, armB: 8 + bump(t, 0.05, 0.9) * 30 + bless * 70, head: 4 * bless, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 0.02, 0.15) * (1 - es(t, 0.8, 0.95)), T, { spread: 2 });

      F.ds.forEach((d, i) => {
        const [x, y, fl] = SPOT[d.k];
        const tie = bump(t, 0.1 + i * 0.06, 0.35 + i * 0.06);
        const on = es(t, 0.2 + i * 0.06, 0.26 + i * 0.06);
        const bow = es(t, 1.08 + i * 0.05, 1.35 + i * 0.05);
        const P = { x, y, s: 0.96, flip: fl, armF: 14 + tie * 40 + bow * 26, armB: 6 + tie * 40, head: -2 + bow * 18, lean: bow * 14, blink: blinkAt(T, d.seed) };
        d.p.set({ ...P, o: on < 0.5 ? 1 : 0 });
        girt[i].set({ ...P, o: on >= 0.5 ? 1 : 0 });
        const [hx, hy] = headAt(x, y, 0.96, fl);
        const tk = es(t, 0.4 + i * 0.06, 0.52 + i * 0.06, ease.back) * (1 - es(t, 1.3, 1.45));
        pose(ticks[i], { x: hx, y: hy - 56, s: Math.max(0.001, tk), o: tk > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [2, 0]]);
      S.cam.y = kf(t, [[0, 30], [2, 40]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.1], [2, 1.12]]);
    };
  },
};
