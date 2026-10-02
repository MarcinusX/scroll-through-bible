// Mt 22,15–17 — the Pharisees go off to one side and put their heads together over a snare. They send their
// disciples with Herod's men: they come smiling behind paper masks, all flattery — "you teach the way of God"
// (a golden path unrolls to the sanctuary), "you do not look at the face of men" (a balance with a king and a
// beggar weighing the same). Then the trap: "Is it lawful to pay tax to Caesar, or not?" — and a net comes down.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { templeCourt, QX as QX_WIDE, pupil, pharisee, herodian, moodPuppet, voiceRings, bubble, thought, snare, maskOnStick, balance, headAt, popBubble, kingPuppet, ROADFOLK, crutchHeld, tr, sheet, mix } from './lib.js';

const JX = 770;
const PX_WIDE = [392, 452, 512];                // the Pharisees in council, left

export default {
  id: 'mt22-snare',
  beats: [
    { v: 15 },
    { v: 16, text: 'Posłali więc do Niego swych uczniów razem ze zwolennikami Heroda, aby Mu powiedzieli:' },
    { v: 16, cont: true, text: '«Nauczycielu, wiemy, że jesteś prawdomówny i drogi Bożej w prawdzie nauczasz.' },
    { v: 16, cont: true, text: 'Na nikim Ci też nie zależy, bo nie oglądasz się na osobę ludzką.' },
    { v: 17, text: 'Powiedz nam więc, jak Ci się zdaje?' },
    { v: 17, cont: true, text: 'Czy wolno płacić podatek Cezarowi, czy nie?»' },
  ],
  cam: { x: [-150, 30], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    // phone: the council moves in a little and the camera looks left while they plot; the questioners stand closer
    const PX = P ? [430, 488, 546] : PX_WIDE;
    const QX = P ? [900, 958, 1016, 1074] : QX_WIDE;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    // phone: the right-hand sitters sit further off, not half-peeping at the edge while the camera is on the Pharisees
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 3, x0: S.portrait ? 1200 : 1010, x1: S.portrait ? 1300 : 1200, pose: 'sit' }, { y: 604, s: 0.66, n: 2, x0: 250, x1: 360, pose: 'sit' }]);
    // the golden way of God, from his feet up the stairs to the sanctuary
    const wayL = S.layer({ par: 0.47, sh: 1 });
    const way = wayL.add(`<g><path d="${c.cut([[JX - 64, 0], [JX + 64, 0], [818, -250], [782, -250]], 0.6, 8)}" fill="${C.halo}" opacity=".85"/><path d="${c.ribbon([[JX, -4], [800, -246]], 3)}" fill="${C.star}"/></g>`);

    /* the balance that favours no one: a king and a beggar weigh the same */
    const balL = S.layer({ par: 0.3, sh: 6 });
    const bal = balance(c, { arm: 120, h: 190, drop: 80 });
    const kingSmall = `<g transform="translate(-6 76) scale(.32)">${kingPuppet(c)}</g>`;
    const beggarSmall = `<g transform="translate(6 76) scale(.32) scale(-1 1)">${person(c, { ...ROADFOLK[0], holdF: crutchHeld(c) })}</g>`;
    const balEl = balL.add(`<g><path d="M0 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="translate(0 0)">${bal.beam}</g><g transform="translate(-120 0)">${bal.pan}${kingSmall}</g><g transform="translate(120 0)">${bal.pan}${beggarSmall}</g></g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const phar = [0, 1, 4].map((k, i) => ({ i, p: moodPuppet(S, pl, c, pharisee(c, k)), seed: c.rr(0, 9) }));
    const dis = [CAST.john, CAST.peter].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 664 - i * 54, y: F + 10 + (i % 2) * 8, i }));
    const looks = [pupil(c, 0), pupil(c, 1), herodian(c, 0), herodian(c, 1)];
    const Q = looks.map((o, i) => ({ i, p: moodPuppet(S, pl, c, o), seed: c.rr(0, 9) }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const masks = Q.map(() => pl.add(`<g>${maskOnStick(c)}</g>`));
    const plot = pl.add(`<g>${thought(c, `<g transform="translate(-26 -22) scale(.3)">${snare(c, 170, 120).replace(/<path d="M0 -1400V0"[^>]*\/>/, '')}</g>`, { w: 84, h: 66 }).replace(/^/, '<g transform="scale(1.4)">') + '</g>'}</g>`);
    const bb = {
      go: pl.add(`<g>${bubble(c, tr('Idźcie!', 'Go!'), { size: 19, tail: 1 })}</g>`),
      flatter: pl.add(`<g>${bubble(c, tr(['Nauczycielu,', 'jesteś prawdomówny…'], ['Teacher,', 'you are honest…']), { size: 18, tail: -1 })}</g>`),
      face: pl.add(`<g>${bubble(c, tr(['…nie oglądasz się', 'na osobę ludzką'], ['…you are not', 'partial to anyone']), { size: 18, tail: -1 })}</g>`),
      think: pl.add(`<g>${bubble(c, tr('Jak Ci się zdaje?', 'What do you think?'), { size: 19, tail: -1 })}</g>`),
      pay: pl.add(`<g>${bubble(c, tr(['Płacić Cezarowi', 'czy nie?'], ['Pay Caesar', 'or not?']), { size: 20, tail: -1 })}</g>`),
    };

    /* the snare over his head */
    const hangs = S.layer({ par: 0.3, sh: 6 });
    const netEl = hangs.add(`<g>${snare(c, 190, 130)}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v15 — the Pharisees go aside and plot */
      phar.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.05, 0.45 + p.i * 0.05);
        const x = lerp(1180 + p.i * 60, PX[p.i], k);
        const huddle = es(t, 0.5, 0.65);
        const send = bump(t, 1.05, 1.6);
        p.p.set({ x, y: F + 4 + (p.i % 2) * 10, s: 0.92, flip: k < 1 ? true : p.i === 2, walk: k > 0 && k < 1 ? x * 0.05 + p.i : undefined, head: huddle * 14 * (1 - send), lean: huddle * (p.i === 2 ? -6 : 6) * (1 - send), armF: 26 + huddle * 30 + (p.i === 1 ? send * 70 : 0), blink: blinkAt(T, p.seed) });
        p.p.mood({ angry: huddle * 0.8, sad: 0 });
      });
      popBubble(plot, t, 0.55, 0.98, PX[1] + (P ? 40 : -10), F - 206);
      popBubble(bb.go, t, 1.1, 1.6, PX[1] + 30, F - 206);

      /* v16a — the pupils and Herod's men come across from the right */
      Q.forEach((q) => {
        const inK = es(t, 1.15 + q.i * 0.06, 1.7 + q.i * 0.06);
        const x = lerp(1460 + q.i * 50, QX[q.i], inK);
        const bow = bump(t, 2.05, 2.95) + bump(t, 3.05, 3.9) * 0.7 + bump(t, 4.05, 4.9) * 0.5;
        q.p.set({
          x, y: F + 4 + (q.i % 2) * 8, s: 0.92, flip: true, walk: inK > 0 && inK < 1 ? x * 0.05 + q.i : undefined, blink: blinkAt(T, q.seed),
          lean: -bow * 10, head: bow * 12, armF: 20 + bow * 40, armB: bow * 30 + bump(t, 5.1, 5.9) * (q.i === 0 ? 80 : 0),
        });
        q.p.mood({ angry: 0, sad: 0 });
        const [hx, hy] = headAt(x, F + 4 + (q.i % 2) * 8, 0.92, true);
        const mk = es(t, 1.7 + q.i * 0.04, 1.85 + q.i * 0.04);
        pose(masks[q.i], { x: hx - 16, y: hy + 44, s: 0.95, o: mk });
      });

      /* Jesus */
      jesus.set({ x: JX, y: F, s: 1.04, blink: blinkAt(T), head: bump(t, 1.2, 2.0) * 4 - bump(t, 5.2, 5.95) * 6, armF: 24 + bump(t, 0.05, 0.9) * 30, armB: 12 });
      voice(JX + 26, F - 176, bump(t, 0.02, 0.6) * 0.6, T, { dir: 1 });
      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.9, head: -bump(t, 5.2, 5.95) * 10, flip: t < 1.0 && d.i > 0, blink: blinkAt(T, d.i + 2) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -4, blink: blinkAt(T, m.seed) }));

      /* the flattery, the question */
      popBubble(bb.flatter, t, 2.12, 2.95, QX[0] - 10, F - 210);
      popBubble(bb.face, t, 3.12, 3.95, QX[1] - 20, F - 214);
      popBubble(bb.think, t, 4.12, 4.95, QX[0] - 10, F - 210);
      popBubble(bb.pay, t, 5.1, 5.97, QX[0] - 14, F - 210);
      const wk = es(t, 2.25, 2.7) * (1 - es(t, 2.9, 3.1));
      pose(way, { x: 0, y: F + 4, sy: Math.max(0.001, wk), o: wk > 0.01 ? 1 : 0 });
      const bd = es(t, 3.1, 3.5, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      pose(balEl, { x: 800, y: lerp(-700, 214, bd), s: 1.3, r: Math.sin(T * 0.8) * 1.2 * bd });
      const nd = es(t, 5.2, 5.7, ease.out);
      pose(netEl, { x: JX + 4, y: lerp(-800, 312, nd), r: Math.sin(T * 1.1) * 2 * nd });

      S.cam.z = 1 + es(t, 5.1, 5.6) * 0.05;
      S.cam.y = -es(t, 5.1, 5.6) * 20;
      if (P) S.cam.x = -140 * (1 - es(t, 1.0, 1.5));
    };
  },
};
