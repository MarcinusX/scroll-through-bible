// Łk 7,9–10 — Jesus hears the message and marvels: He lifts His hands and turns round to the crowd following Him —
// "I tell you, not even in Israel have I found such faith" — and over the centurion in his doorway a flame of faith
// rises and burns bright. The friends go back into the house; its front lifts away once more: the bed is empty, the
// servant is on his feet, well, and his master holds him by the shoulders.
import { C, person, CAST, blinkAt, pose, lerp, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { capStreet, HOUSE, ELDERS, FRIENDS, SERVANT, centurion, mob, bubble, sparkle, headAt, voiceRings, kf, moving, tr, PI } from './lib.js';

const FEET = HOUSE.FEET, D = HOUSE.DOOR, JX = 690;

/** a flame of faith (origin: its foot) */
function faithFlame(c) {
  return `<circle cy="-30" r="80" fill="url(#warm-glow)"/><path d="${c.cut([[0, 0], [-16, -12], [-20, -34], [-8, -58], [-2, -80], [6, -56], [18, -40], [16, -14]], 0.4, 4)}" fill="${C.lampFlame}"/><path d="${c.cut([[0, -6], [-8, -16], [-8, -32], [0, -50], [8, -32], [8, -16]], 0.2, 3)}" fill="#fff4d2"/>`;
}

export default {
  id: 'lk7-faith',
  beats: [
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-40, 140], y: [0, 60], z: [1, 1.24] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;
    /* inside: the servant up and well, his master with him (hidden until the front lifts) */
    const B = HOUSE.BEDX;
    const well = S.puppet(st.houseL.add(person(c, SERVANT)));
    const master = S.puppet(st.houseL.add(centurion(c, { helmet: false })));
    const joy = [0, 1, 2, 3].map((i) => st.houseL.add(`<g opacity="0">${sparkle(c, 12 + (i % 2) * 5, C.halo)}</g>`));
    let cen;
    const H = st.addFront((L) => { cen = S.puppet(L.add(centurion(c, { helmet: false }))); });
    const flameEl = st.houseL.add(`<g opacity="0">${faithFlame(c)}</g>`);

    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const crowd = [0, 1].map((i) => crowdL.sprite(mob(makeCutter('lk7-fa-c' + i), 6, { s: 0.84, spread: 44 }), 170 - i * 230, 720 - i * 10));
    const P = S.layer({ par: 0.4, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.andrew].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const eld = ELDERS.map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fr = FRIENDS.map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const voice = voiceRings(P, c, { n: 3, color: C.sun, r: 34, w: 5 });
    const W = S.layer({ par: 0.42, sh: 3 });
    const said = W.add(`<g opacity="0">${bubble(c, [tr('Powiadam wam: Tak wielkiej wiary', 'I tell you, I have not found'), tr('nie znalazłem nawet w Izraelu', 'such great faith, not even in Israel')], { size: 20, dir: -1, fill: C.halo })}</g>`);

    return (t, time) => {
      const T = time;
      st.update(T);

      /* v9 — He marvels, turns to the crowd following Him */
      const marvel = bump(t, 0.05, 0.4);
      const turn = es(t, 0.34, 0.4);
      const speak = es(t, 0.42, 0.55) * (1 - es(t, 1.0, 1.15));
      jesus.set({ x: JX, y: FEET, s: 1.04, flip: turn > 0.5 && t < 1.05, armF: 14 + marvel * 60 + speak * 50, armB: 8 + marvel * 100 + speak * 40, head: -marvel * 12, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, FEET, 1.04, turn > 0.5 && t < 1.05);
      voice(hx, hy, speak, T, { dir: -1, spread: 2 });
      const sb = es(t, 0.45, 0.58, ease.back) * (1 - es(t, 1.0, 1.08));
      pose(said, { x: hx + 10, y: hy - 44, s: sb, o: sb > 0.02 ? 1 : 0 });
      DIS.forEach((d) => d.p.set({ x: 560 - d.i * 84, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, armF: 12 + speak * 10, head: -speak * 4, blink: blinkAt(T, d.seed) }));
      crowd.forEach((g, i) => g.set({ x: 170 - i * 230, y: 720 - i * 10, s: 1 - i * 0.1 }));
      eld.forEach((e) => e.p.set({ x: (S.portrait ? 1300 : 1175) + e.i * 76, y: FEET - 14 - e.i * 4, s: 0.92, flip: true, armF: 12 + speak * 30, head: speak * 6, blink: blinkAt(T, e.seed) }));
      // the flame of faith over the centurion in his doorway
      const fk = es(t, 0.5, 0.8, ease.back) * (1 - es(t, 1.2, 1.35));
      pose(flameEl, { x: D, y: HOUSE.TOP + 30 + (T ? Math.sin(T * 2) * 3 : 0), s: fk * (1 + (T ? Math.sin(T * 7) * 0.04 : 0)), o: fk > 0.02 ? 1 : 0 });
      const inDoor = 1 - seg(t, 1.3, 1.36);
      cen.set({ x: D, y: HOUSE.BASE, s: 0.56, flip: true, o: inDoor, armF: 60, armB: 20, lean: 10 + bump(t, 0.5, 1.0) * 6, head: 10 - fk * 12, blink: blinkAt(T, 4) });

      /* v10 — the friends go back and find the servant well */
      fr.forEach((f) => {
        const K = [[0, 850 + f.i * 90], [1.05, 850 + f.i * 90], [1.3 + f.i * 0.04, D]];
        const x = kf(t, K);
        f.p.set({ x, y: FEET - 2 + f.i * 8, s: 0.98, flip: t < 1.02, o: 1 - seg(t, 1.26 + f.i * 0.04, 1.32 + f.i * 0.04), walk: moving(t, K) ? x * 0.05 + f.i : undefined, armF: 14 + speak * 20, head: speak * 6, blink: blinkAt(T, f.seed) });
      });
      const open = es(t, 1.34, 1.58);
      pose(H.front, { y: -open * 140, o: 1 - open });
      pose(H.dark, { o: 1 - seg(open, 0, 0.3) });
      const inside = seg(t, 1.34, 1.4);
      const cheer = es(t, 1.5, 1.7);
      well.set({ x: B + 20, y: HOUSE.BASE, s: 0.8, o: inside, armF: 40 + cheer * 60, armB: 40 + cheer * 110, head: -cheer * 10, blink: blinkAt(T, 6) });
      master.set({ x: B + 110, y: HOUSE.BASE, s: 0.8, flip: true, o: inside, armF: 50 + cheer * 30, armB: 30, head: 6, blink: blinkAt(T, 4) });
      joy.forEach((j, i) => { const k = bump(t, 1.55 + i * 0.06, 2.0 + i * 0.03); pose(j, { x: B - 30 + i * 50, y: HOUSE.TOP + 40 + (i % 2) * 30 - seg(t, 1.55, 2.0) * 20, s: k, r: T * 40 + i * 30, o: k }); });

      // phone: the flame over the centurion's doorway stays clear of the thread
      S.cam.x = kf(t, S.portrait ? [[0, 30], [0.4, 50], [1.0, 60], [1.35, 120], [2, 130]] : [[0, 20], [0.4, -20], [1.0, -10], [1.35, 120], [2, 130]]);
      S.cam.z = kf(t, [[0, 1.06], [0.4, 1.1], [1.0, 1.08], [1.35, 1.22], [2, 1.22]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.35, 50]]);
    };
  },
};
