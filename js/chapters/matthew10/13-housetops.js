// Mt 10,26–27 — night in a house cut open like a doll's house. Outside the window dark shadows peer in and point;
// the disciples huddle round Jesus, He lifts His hand — "do not be afraid of them" — and the shadows shrink away.
// A basket turned over on the floor is lifted off: the lamp it hid floods the room with light. Jesus leans to
// John and whispers in the dark; morning comes, and John steps out of the door into the light, speaking. Then he
// runs up the outside stairs onto the roof and proclaims it over the town; Peter does the same from the next roof,
// and the people in the street look up.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { house } from '../../assets/nature.js';
import { oilLamp, bushel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { houseSection } from '../mark3/lib.js';
import { village, DAY, INK, shadowPerson, wordSlip, voiceRings, kf, moving, hand, headAt, PI } from './lib.js';

const X0 = 480, X1 = 960, FLOOR = 650, CEIL = 360;
const JX = 700;

export default {
  id: 'mt10-housetops',
  beats: [
    { v: 26, text: 'Więc się ich nie bójcie!' },
    { v: 26, cont: true, text: 'Nie ma bowiem nic zakrytego, co by nie miało być wyjawione, ani nic tajemnego, o czym by się nie miano dowiedzieć.' },
    { v: 27, text: 'Co mówię wam w ciemności, powtarzajcie na świetle,' },
    { v: 27, cont: true, text: 'a co słyszycie na ucho, rozgłaszajcie na dachach!' },
  ],
  cam: { x: [-40, 60], y: [-120, 30], z: [1, 1.12] },
  build(S) {
    const V = village(S, { skyCols: DAY, night: true, sunAt: [1260, 150] });
    const c = S.c;
    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL });

    /* the neighbour's roof (for Peter) */
    const nb = S.layer({ par: 0.4, sh: 4 });
    nb.add(house(c, 250, FLOOR + 40, 190, 230, { stairs: false }));

    /* the shadows at the window, from outside */
    const out = S.layer({ par: 0.42, sh: 3 });
    const SHAD = [0, 1, 2].map((i) => ({ i, p: S.puppet(out.add(shadowPerson(c, crowdPerson(c), mix(INK, C.night, 0.3)))) }));
    const houseL = S.layer({ par: 0.45, sh: 4 });
    houseL.add(H.back);

    /* inside: the lamp under the basket, Jesus and three disciples */
    const inL = S.layer({ par: 0.45, sh: 4 });
    const roomGlow = inL.add(`<g opacity="0"><ellipse cx="0" cy="-120" rx="300" ry="220" fill="url(#warm-glow)"/></g>`);
    const LX = 820;
    const lamp = inL.add(`<g>${oilLamp(c)}</g>`);
    const basket = inL.add(`<g>${bushel(c, 80, 56)}</g>`);
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const DIS = [
      { k: 'peter', o: CAST.peter, x: 590, flip: false },
      { k: 'andrew', o: CAST.andrew, x: 900, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(inL.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const johnSit = S.puppet(inL.add(person(c, { ...CAST.john, pose: 'sit' })));
    const whisper = voiceRings(inL, c, { n: 3, color: C.halo, r: 14, w: 3, both: false });

    const frontL = S.layer({ par: 0.45, sh: 5 });
    frontL.add(H.front + H.stairs);

    /* outside: John goes out, up the stairs; Peter on the next roof; people in the street */
    const P = S.layer({ par: 0.47, sh: 5 });
    const street = [[1000, 0.8], [1060, 0.78], [1120, 0.8]].map(([x, s], i) => ({ x, s, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, crowdPerson(c)))) }));
    const john = S.puppet(P.add(person(c, CAST.john)));
    const peterRoof = S.puppet(P.add(person(c, CAST.peter)));
    const W = S.layer({ par: 0.5, sh: 4 });
    const words = Array.from({ length: 7 }, (_, i) => ({ i, el: W.add(wordSlip(c, 30)) }));

    return (t, time) => {
      const T = time;
      /* night until beat 2, then morning */
      const morning = es(t, 2.35, 2.65);
      V.update(t, T, { night: 1 - morning, moonX: 1180, sunO: morning });

      /* v26a — do not fear them: the shadows at the window shrink away */
      const calm = es(t, 0.25, 0.5);
      SHAD.forEach((sh) => {
        const k = 1 - es(t, 0.45 + sh.i * 0.06, 0.95 + sh.i * 0.06) * 0.85;
        sh.p.set({ x: H.win[0] + 10 + sh.i * 26, y: CEIL + 214, s: 0.62 * (0.5 + k * 0.5), o: (1 - es(t, 0.95, 1.1)) * (1 - morning), armF: 80 * k, head: 6 });
      });
      jesus.set({ x: JX, y: FLOOR, s: 0.96, flip: t > 2.0 && t < 2.5, armB: 10 + bump(t, 0.1, 0.9) * 130, armF: 20 + bump(t, 0.1, 0.9) * 40 + bump(t, 1.05, 1.6) * 60, head: bump(t, 2.0, 2.4) * 10, lean: -bump(t, 2.0, 2.4) * 8, blink: blinkAt(T, 1) });
      DIS.forEach((d) => d.p.set({ x: d.x, y: FLOOR + 4, s: 0.86, flip: d.flip, armF: 20 + (1 - calm) * 60, armB: (1 - calm) * 50, head: (1 - calm) * 12 - calm * 4 + es(t, 1.35, 1.6) * -6, blink: blinkAt(T, d.seed) }));
      const out = es(t, 2.55, 2.7);
      johnSit.set({ x: 640, y: FLOOR + 6, s: 0.86, flip: false, o: 1 - out, armF: 20 + (1 - calm) * 60, head: (1 - calm) * 12 + bump(t, 2.0, 2.45) * -8, blink: blinkAt(T, 3) });

      /* v26b — nothing hidden: the basket comes off the lamp */
      const lift = es(t, 1.2, 1.45);
      pose(basket, { x: LX + lift * 60, y: FLOOR + 6 - lift * 70, r: lift * 30, o: 1 - es(t, 1.5, 1.6) });
      pose(lamp, { x: LX, y: FLOOR + 6, s: 0.9, o: lift > 0.02 ? 1 : 0 });
      pose(roomGlow, { x: 740, y: FLOOR, s: 0.3 + lift * 0.9, o: lift * (1 - morning * 0.6) });

      /* v27a — the whisper in the dark, then out into the light */
      const [jhx, jhy] = headAt(640, FLOOR + 6, 0.86, false, 62);
      whisper(jhx - 6, jhy + 2, bump(t, 2.05, 2.4), T, { spread: 1.4, speed: 0.8, dir: -1 });
      const JK = [[2.55, [X0 + 108, FLOOR + 30]], [2.8, [X0 + 108, FLOOR + 48]], [3.0, [X1 + 70, FLOOR + 44]], [3.4, H.stepAt(1)], [3.45, [X1 - 60, H.roofY]]];
      const [jx, jy] = kf(t, JK, (x) => x);
      const onRoof = es(t, 3.4, 3.5);
      const walking = t > 2.8 && t < 3.45;
      john.set({ x: jx, y: jy, s: lerp(0.86, 0.8, onRoof), flip: t > 3.35, o: out, walk: walking ? t * 40 : undefined, armF: 20 + bump(t, 2.62, 2.95) * 60 + onRoof * 40, armB: 10 + bump(t, 2.62, 2.95) * 100 + onRoof * 140, head: -onRoof * 8, blink: blinkAt(T, 4) });
      const pr = es(t, 3.4, 3.55);
      peterRoof.set({ x: 360, y: FLOOR + 40 - 230 - 6, s: 0.72, flip: false, o: pr, armF: 60 * pr, armB: 150 * pr, head: -6, blink: blinkAt(T, 5) });
      street.forEach((m) => m.p.set({ x: m.x, y: FLOOR + 60, s: m.s, flip: true, o: es(t, 2.6, 2.8), head: -es(t, 3.4, 3.6) * 16, armF: 14 + es(t, 3.5, 3.7) * (m.i === 1 ? 110 : 20), blink: blinkAt(T, m.seed) }));
      // words: spoken in the light (beat 2), proclaimed from the roofs (beat 3)
      words.forEach((w) => {
        const roof = t > 3.4;
        const k = T ? ((T * 0.3 + w.i / 7) % 1) : (w.i + 0.5) / 7;
        const ox = roof ? (w.i % 2 ? 360 : X1 - 60) : X0 + 108, oy = roof ? H.roofY - 150 : FLOOR - 120;
        const dir = w.i % 3 === 0 ? -1 : 1;
        const on = roof ? es(t, 3.45, 3.6) : es(t, 2.7, 2.85) * (1 - es(t, 2.95, 3.05));
        pose(w.el, { x: ox + dir * k * (roof ? 420 : 200), y: oy - Math.sin(k * PI) * 80 + k * (roof ? 120 : 30), r: k * 60 * dir, s: 0.9, o: on * Math.sin(k * PI) });
      });

      S.cam.x = lerp(-20, 30, es(t, 2.8, 3.4));
      S.cam.y = -es(t, 3.0, 3.45) * 110;
      S.cam.z = 1.06 - es(t, 3.0, 3.45) * 0.04;
    };
  },
};
