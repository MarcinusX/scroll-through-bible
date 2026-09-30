// Łk 7,6–7 — Jesus goes with the elders down the street towards the red-roofed house. Not far from it, two friends
// of the centurion come out of his door to meet Him, and the centurion himself stays in his doorway: "Lord, do not
// trouble yourself, I am not worthy that you should come under my roof" — the roof glows over them. "I did not even
// think myself worthy to come to you": in the doorway the officer bows low, his hand on his heart, and goes no
// further. "But say the word": the friend opens his empty hands before Jesus — a golden word hangs between Him and
// the house, and the window of the sick-room begins to glow.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { capStreet, HOUSE, ELDERS, FRIENDS, centurion, nameTag, bubble, goldSlip, sparkle, headAt, hand, voiceRings, kf, moving, tr, PI } from './lib.js';

const FEET = HOUSE.FEET, D = HOUSE.DOOR;
const JK = [[0.05, 400], [0.85, 690]];

export default {
  id: 'lk7-roof',
  beats: [
    { v: 6, text: 'Jezus przeto wybrał się z nimi.' },
    { v: 6, cont: true, text: 'A gdy był już niedaleko domu, setnik wysłał do Niego przyjaciół z prośbą: «Panie, nie trudź się, bo nie jestem godzien, abyś wszedł pod dach mój.' },
    { v: 7, text: 'I dlatego ja sam nie uważałem się za godnego przyjść do Ciebie.' },
    { v: 7, cont: true, text: 'Lecz powiedz słowo, a mój sługa będzie uzdrowiony.' },
  ],
  cam: { x: [-40, 110], y: [0, 60], z: [1, 1.2] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;
    let cen;
    const H = st.addFront((L) => { cen = S.puppet(L.add(centurion(c, { helmet: false }))); });
    const winGlow = st.houseL.add(`<circle r="60" fill="url(#warm-glow)" opacity="0"/>`);

    const P = S.layer({ par: 0.4, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.andrew].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const eld = ELDERS.map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fr = FRIENDS.map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), kn: S.puppet(P.add(person(c, { ...o, pose: 'kneel' }))), seed: c.rr(0, 9) }));
    const talk = voiceRings(P, c, { n: 2, color: C.clay, r: 26, w: 4 });

    const W = S.layer({ par: 0.42, sh: 3 });
    const b1 = W.add(`<g opacity="0">${bubble(c, [tr('Panie, nie trudź się,', 'Lord, don’t trouble yourself,'), tr('nie jestem godzien, abyś wszedł', 'I am not worthy for you'), tr('pod dach mój', 'to come under my roof')], { size: 19, dir: 1 })}</g>`);
    const b2 = W.add(`<g opacity="0">${bubble(c, [tr('Sam nie uważałem się za godnego', 'I didn’t think myself worthy'), tr('przyjść do Ciebie', 'to come to you')], { size: 19, dir: 1 })}</g>`);
    const b3 = W.add(`<g opacity="0">${bubble(c, [tr('Lecz powiedz słowo,', 'But say the word,'), tr('a mój sługa będzie uzdrowiony', 'and my servant will be healed')], { size: 19, dir: 1 })}</g>`);
    const tagC = W.add(`<g opacity="0">${nameTag(c, tr('setnik', 'the centurion'), { size: 16 })}</g>`);
    const word = W.add(`<g opacity="0">${goldSlip(c, 50)}</g>`);
    const sp = W.add(`<g opacity="0">${sparkle(c, 16, C.halo)}</g>`);

    return (t, time) => {
      const T = time;
      st.update(T);

      /* v6a — He goes with them */
      const jx = kf(t, JK);
      const jMove = moving(t, JK);
      const hear = es(t, 1.4, 1.6);
      jesus.set({ x: jx, y: FEET, s: 1.04, walk: jMove ? jx * 0.045 : undefined, amt: 0.8, armF: 12 + es(t, 3.2, 3.45) * 50, armB: 8 + es(t, 3.2, 3.45) * 30, head: -es(t, 2.1, 2.3) * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const K = [[0.05, 280 - d.i * 84], [0.9, 560 - d.i * 84]];
        const x = kf(t, K);
        d.p.set({ x, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, walk: moving(t, K) ? x * 0.05 + d.i : undefined, amt: 0.8, armF: 12, head: -hear * 4, blink: blinkAt(T, d.seed) });
      });
      eld.forEach((e) => {
        const K = [[0.0, 560 + e.i * 76], [0.95, 1175 + e.i * 76]];
        const x = kf(t, K);
        const back = t > 0.95;
        e.p.set({ x, y: FEET - 14 - e.i * 4, s: 0.92, flip: back, walk: moving(t, K) ? x * 0.05 + e.i : undefined, amt: 0.8, armF: 12 + (e.i === 0 ? bump(t, 0.1, 0.8) * 40 : 0), head: -4, blink: blinkAt(T, e.seed) });
      });

      /* v6b — the friends come out; the centurion stays in his door: "not worthy that you come under my roof" */
      const inDoor = seg(t, 1.0, 1.08);
      const bow = es(t, 2.1, 2.35) * (1 - es(t, 3.1, 3.3) * 0.6);
      cen.set({ x: D, y: HOUSE.BASE, s: 0.56, flip: true, o: inDoor, armF: 20 + bow * 60, armB: 10, lean: bow * 20, head: bow * 14, blink: blinkAt(T, 4) });
      fr.forEach((f) => {
        const K = [[1.02 + f.i * 0.06, D], [1.3 + f.i * 0.06, 850 + f.i * 90]];
        const x = kf(t, K);
        const kneel = f.i === 0 ? es(t, 3.06, 3.12) : 0;
        const open = f.i === 0 ? es(t, 3.14, 3.3) : 0;
        const plead = bump(t, 1.35, 2.0) + bump(t, 2.1, 2.95) * (f.i === 1 ? 1 : 0.3);
        f.p.set({ x, y: FEET - 2 + f.i * 8, s: 0.98, flip: true, o: seg(t, 1.0 + f.i * 0.06, 1.05 + f.i * 0.06) * (1 - kneel), walk: moving(t, K) ? x * 0.05 + f.i : undefined, armF: 14 + plead * 50, armB: 8 + plead * (f.i ? 30 : 90), head: plead * 4, blink: blinkAt(T, f.seed) });
        f.kn.set({ x: 850, y: FEET - 2, s: 0.98, flip: true, o: kneel, armF: 60 + open * 30, armB: 50 + open * 60, head: -open * 10, blink: blinkAt(T, f.seed) });
      });
      const [f0x, f0y] = headAt(850, FEET - 2, 0.98, true);
      const [f1x, f1y] = headAt(940, FEET + 6, 0.98, true);
      const pb = (a, b) => es(t, a, a + 0.12, ease.back) * (1 - es(t, b - 0.06, b));
      const k1 = pb(1.36, 1.98), k2 = pb(2.36, 2.98), k3 = pb(3.2, 3.98);
      pose(b1, { x: f0x - 26, y: f0y - 36, s: k1, o: k1 > 0.02 ? 1 : 0 });
      pose(b2, { x: f1x - 26, y: f1y - 36, s: k2, o: k2 > 0.02 ? 1 : 0 });
      pose(b3, { x: f0x - 26, y: f0y + 10, s: k3, o: k3 > 0.02 ? 1 : 0 });
      talk(t < 2.2 ? f0x : f1x, t < 2.2 ? f0y : f1y, (k1 + k2) > 0.1 ? 0.8 : 0, T, { dir: -1, spread: 1.6 });
      const tk = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 2.85, 2.95));
      pose(tagC, { x: D, y: HOUSE.TOP + 44, s: tk, o: tk > 0.02 ? 1 : 0 });
      pose(H.glow, { o: bump(t, 1.5, 2.1) * (0.6 + (T ? Math.sin(T * 4) * 0.12 : 0.1)) });

      /* v7b — "say the word": a golden word hangs between Him and the house; the sick-room window glows */
      const wk = es(t, 3.36, 3.6, ease.back);
      const [jhx, jhy] = headAt(jx, FEET, 1.04);
      pose(word, { x: lerp(jhx + 70, jhx + 120, wk), y: jhy - 90 + (T ? Math.sin(T * 2) * 4 : 0), s: wk * 1.2, r: T ? Math.sin(T * 1.6) * 5 : 0, o: wk > 0.02 ? 1 : 0 });
      const gk = es(t, 3.55, 3.8);
      pose(winGlow, { x: HOUSE.X0 + 114, y: HOUSE.TOP + 96, s: 0.6 + gk * 0.5, o: gk * 0.9 });
      const sk = bump(t, 3.6, 4.0);
      pose(sp, { x: HOUSE.X0 + 130, y: HOUSE.TOP + 60, s: sk, r: T * 40, o: sk });

      S.cam.x = kf(t, [[0, 0], [0.9, 60], [1.2, 90], [2.0, 90], [2.3, 100], [3.1, 80], [3.4, 60]]);
      S.cam.z = kf(t, [[0, 1.04], [1.2, 1.1], [2.3, 1.16], [3.1, 1.12], [3.4, 1.08]]);
      S.cam.y = kf(t, [[0, 20], [1.2, 30], [2.3, 50], [3.4, 30]]);
    };
  },
};
