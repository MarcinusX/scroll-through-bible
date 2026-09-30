// Łk 6,41–42 — a painted flat, gently comic: a threshing floor on a windy hill at harvest (Luke's "speck" is a bit of
// chaff). One brother winnows, tossing the grain into the wind; the chaff blows about and a speck of it lands in his
// eye — he blinks and rubs it. His brother comes over to look, and does not notice the great beam sticking out of his
// own eye; a lens comes down on a string and shows the tiny speck for everyone. "Brother, let me take out the speck":
// he leans in with tweezers — and his beam swings round and knocks the sheaves flying. "Hypocrite, first take the beam
// out of your own eye": he grips it, heaves it out, tosses it on the woodpile — his eye shines clear — and now he can
// see to take the speck out, gently, and his brother blinks and smiles.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, bush, grass } from '../../assets/nature.js';
import { sheaf } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { winnowFork } from '../matthew3/lib.js';
import { handAt as handAt7 } from '../matthew7/lib.js';
import { plank, speck, tweezers, magnifier, eyeAt, BRO_A, BRO_B, kf, moving, bubble, sparkle, storyFrame, AFTERNOON, handAt, headAt, tr, PI } from './lib.js';

const GY = 700;
const AX = 640, BX0 = 1120, BX = 960;

export default {
  id: 'lk6-speck',
  enter: 'fly',
  beats: [
    { v: 41 },
    { v: 42, text: 'Jak możesz mówić swemu bratu: "Bracie, pozwól, że usunę drzazgę, która jest w twoim oku", gdy sam belki w swoim oku nie widzisz?' },
    { v: 42, cont: true, text: 'Obłudniku, wyrzuć najpierw belkę ze swego oka, a wtedy przejrzysz, ażeby usunąć drzazgę z oka swego brata.' },
  ],
  cam: { x: [-30, 40], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, AFTERNOON);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1230, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 560, y: 150, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.wheat, 0.15) }).markup);
    S.layer({ par: 0.18, sh: 3 }).add(hillsWith(c, { y: 520, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.wheat, 0.35), trees: 10, treeColor: C.olive, treeH: 18 }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-1400, 590], [3000, 590], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.wheat2, C.sand, 0.5)).out());
    // the threshing floor: a round of beaten earth ringed with stones, a heap of grain and chaff
    const tf = sheet();
    tf.p(c.cut(c.ell(800, GY + 10, 520, 70, 40), 0.6, 10), mix(C.sand, C.stone, 0.3));
    let ring = '';
    for (let i = 0; i < 40; i++) { const a = (i / 40) * PI * 2; ring += c.cut(c.blob(800 + Math.cos(a) * 520, GY + 10 + Math.sin(a) * 70, 12, 6, 8, 0.2), 0.3, 3); }
    tf.p(ring, C.stone2);
    tf.p(c.cut([[430, GY - 4], ...c.arc(500, GY - 4, 70, 40, PI, 2 * PI, 12), [570, GY - 4]], 0.6, 5), C.wheat);
    G.add(tf.out());
    G.add(olive(c, 250, 600, 0.9) + olive(c, 1440, 604, 0.8) + bush(c, 1300, 620, 90, C.sage, C.moss));
    // the woodpile, where the beam will land
    G.add(sheet().p([0, 1, 2, 3, 4].map((i) => c.ribbon([[1170 + (i % 2) * 20, GY - 8 - i * 12], [1330 - (i % 2) * 20, GY - 12 - i * 12]], 12)).join(''), C.wood3).out());

    const L = S.layer({ par: 0.4, sh: 5 });
    const sheaves = [0, 1, 2].map((i) => ({ i, x: 780 + i * 34, el: L.add(`<g>${sheaf(c, 96)}</g>`) }));
    const a = S.puppet(L.add(person(c, { ...BRO_A, holdF: `<g transform="translate(0 0) rotate(-60)">${winnowFork(c, 180)}</g>` })));
    const aNo = S.puppet(L.add(person(c, BRO_A)));
    const b = S.puppet(L.add(person(c, BRO_B)));
    const beam = L.add(`<g>${plank(c, 330, 26)}</g>`);
    const tw = L.add(`<g>${tweezers(c, 40)}</g>`);
    const sp = L.add(`<g>${speck(c, 5)}</g>`);
    const chaff = Array.from({ length: 16 }, (_, i) => ({ i, el: L.add(`<path d="${c.cut(c.ell(0, 0, c.rr(3, 6), c.rr(1.2, 2), 8, c.rr(0, 3)), 0.3, 2)}" fill="${C.wheat}"/>`), dx: c.rr(40, 260), dy: c.rr(-140, -20), ph: c.rr(0, 0.3) }));
    const fx = S.layer({ par: 0.42, sh: 5 });
    const lens = hanging(fx, magnifier(c, 40), { x: 0, y: -400, len: 900 });
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Bracie, pozwól,', 'Brother, let me'), tr('że usunę drzazgę…', 'remove the speck…')], { size: 18, tail: 1 })}</g>`);
    const clear = fx.add(`<g opacity="0">${sparkle(c, 14)}</g>`);
    const thanks = fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 150, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* A winnows; a speck of chaff lands in his eye */
      const toss = t < 0.4 ? Math.max(0, Math.sin(t * 16)) : 0;
      const drop = es(t, 0.36, 0.42);
      const rub = bump(t, 0.4, 0.62) + bump(t, 1.0, 1.2) * 0.5;
      const glad = es(t, 2.82, 2.95);
      const lookUp = es(t, 0.66, 0.8) * (1 - glad);
      const aSet = { x: AX, y: GY, s: 0.98, flip: false, armF: 40 + toss * 60 + rub * 110 + glad * 30, armB: 30 + toss * 40 + glad * 100, head: -8 * toss + rub * 10 - lookUp * 6 - glad * 6, blink: Math.max(rub > 0.3 ? 1 : 0.5 * (1 - glad), blinkAt(T, 2) * glad) };
      a.set({ ...aSet, o: 1 - drop });
      aNo.set({ ...aSet, o: drop });
      chaff.forEach((ch) => {
        const k = seg(t, 0.05 + ch.ph, 0.45 + ch.ph);
        pose(ch.el, { x: AX + 40 + k * ch.dx, y: GY - 230 + k * ch.dy + k * k * 120, r: k * 500, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const [aex, aey] = eyeAt(AX, GY, 0.98, false, aSet.head);
      const out = es(t, 2.72, 2.84);
      pose(sp, { x: lerp(aex + 60, aex, es(t, 0.3, 0.38)) + out * 40, y: lerp(aey - 60, aey, es(t, 0.3, 0.38)) - out * 6, o: es(t, 0.3, 0.32) * (1 - es(t, 2.9, 2.95)) });

      /* B comes over, the beam sticking out of his eye */
      const bK = [[-0.3, BX0], [0.62, BX], [1.05, BX], [1.3, BX - 50], [2.0, BX - 50], [2.1, BX - 10], [2.55, BX - 10], [2.65, AX + 110]];
      const bx = kf(t, bK);
      const lean = es(t, 1.1, 1.3) * (1 - es(t, 2.0, 2.1)) * 10 + es(t, 2.62, 2.72) * 8;
      const heave = es(t, 2.12, 2.32);
      const throwK = es(t, 2.32, 2.5);
      const bHead = -4 + bump(t, 1.35, 1.8) * 26 * Math.sin(t * 14);   // turning about, beam swinging
      const bSet = { x: bx, y: GY, s: 1.0, flip: true, walk: moving(t, bK) ? bx * 0.05 : undefined, armF: 20 + es(t, 1.1, 1.3) * (1 - es(t, 2.0, 2.1)) * 60 + heave * 100 * (1 - throwK) + es(t, 2.6, 2.72) * 70, armB: 10 + heave * 110 * (1 - throwK), head: bHead, lean, blink: blinkAt(T, 4) };
      b.set(bSet);
      const [bex, bey] = eyeAt(bx, GY, 1.0, true, bHead, 0, lean);
      const pulled = heave * 40;
      const fly = seg(t, 2.36, 2.56);
      const [pbx, pby] = [lerp(bex - pulled, 1250, fly), lerp(bey, GY - 60, fly) - Math.sin(fly * PI) * 160];
      pose(beam, { x: pbx, y: pby, r: 192 - bHead * 1.2 + fly * 170, o: 1 });
      pose(clear, { x: bex, y: bey, s: bump(t, 2.5, 2.9), r: T * 40, o: bump(t, 2.5, 2.9) });

      /* the lens shows the speck */
      const ld = es(t, 0.55, 0.8, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(lens, { x: aex + 6, y: lerp(-400, aey + 4, ld), r: Math.sin(T * 0.9) * 1.2, oy: 0, o: ld > 0.01 ? 1 : 0 });

      /* "Brother, let me…" — the tweezers; the beam knocks the sheaves over */
      const sk = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.9, 2.0));
      const [bhx, bhy] = headAt(bx, GY, 1.0, true);
      pose(say, { x: bhx + 40, y: bhy - 60, s: sk, o: sk > 0.01 ? 1 : 0 });
      const [thx, thy] = handAt7(bx, GY, 1.0, true, bSet.armF, lean);
      pose(tw, { x: thx, y: thy, r: 180 + 10, o: es(t, 1.15, 1.2) * (1 - es(t, 2.05, 2.1)) + es(t, 2.6, 2.65) * (1 - es(t, 2.95, 3.0)) });
      sheaves.forEach((s) => {
        const k = seg(t, 1.5 + s.i * 0.05, 1.8 + s.i * 0.05);
        pose(s.el, { x: s.x - k * (60 + s.i * 30), y: GY - Math.sin(k * PI) * 70, r: -k * 90, o: 1 });
      });
      pose(thanks, { x: aex - 30, y: aey - 40, s: bump(t, 2.9, 3.3), r: T * 30, o: bump(t, 2.9, 3.3) });

      S.cam.x = kf(t, [[-0.5, 20], [0.4, -10], [1.0, 0], [2.0, 0], [2.4, 20], [2.7, -10]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.4, 1.08], [0.8, 1.12], [2.0, 1.08], [2.7, 1.14]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.8, 50], [2.0, 30], [2.7, 50]]);
    };
  },
};
