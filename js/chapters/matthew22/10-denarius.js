// Mt 22,18–22 — he sees through them: "Why do you test me, hypocrites?" The masks fall and the net is drawn up
// into the flies. He holds out his open hand for the tax coin; a purse, a small coin passes to him, and a great
// silver denarius with Caesar's head comes down: "Whose image?" — "Caesar's!" So: the coin goes to Caesar's chest,
// and a glowing heart rises to God's house. Taken aback, heads down, they leave him and go away.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, QX as QX_WIDE, pupil, herodian, moodPuppet, voiceRings, bubble, snare, maskOnStick, denarius, coin, purse, taxChest, glowHeart, headAt, hand, popBubble, tr } from './lib.js';

const JX = 770;

export default {
  id: 'mt22-denarius',
  beats: [
    { v: 18 },
    { v: 19, text: 'Pokażcie Mi monetę podatkową!»' },
    { v: 19, cont: true, text: 'Przynieśli Mu denara.' },
    { v: 20 },
    { v: 21, text: 'Odpowiedzieli: «Cezara».' },
    { v: 21, cont: true, text: 'Wówczas rzekł do nich: «Oddajcie więc Cezarowi to, co należy do Cezara, a Bogu to, co należy do Boga».' },
    { v: 22 },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    // phone: the questioners stand closer, and Caesar's chest appears inside the screen
    const QX = P ? [900, 958, 1016, 1074] : QX_WIDE;
    const CHX = P ? 516 : 404;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 3, x0: 1010, x1: 1200, pose: 'sit' }, { y: 604, s: 0.66, n: 2, x0: 250, x1: 360, pose: 'sit' }]);

    /* Caesar's chest appears on the left */
    const chestL = S.layer({ par: 0.48, sh: 5 });
    const chest = chestL.add(`<g>${taxChest(c)}</g>`);
    const chestTag = chestL.add(`<g>${bubble(c, tr('Cezarowi', 'to Caesar'), { size: 17, tail: 0 })}</g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const dis = [CAST.john, CAST.peter].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 664 - i * 54, y: F + 10 + (i % 2) * 8, i }));
    const looks = [pupil(c, 0), pupil(c, 1), herodian(c, 0), herodian(c, 1)];
    const Q = looks.map((o, i) => ({ i, p: moodPuppet(S, pl, c, o), seed: c.rr(0, 9) }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const masks = Q.map(() => pl.add(`<g>${maskOnStick(c)}</g>`));
    const bb = {
      why: pl.add(`<g>${bubble(c, tr(['Czemu Mnie wystawiacie', 'na próbę, obłudnicy?'], ['Why do you test me,', 'you hypocrites?']), { size: 18, tail: 1 })}</g>`),
      show: pl.add(`<g>${bubble(c, tr(['Pokażcie Mi', 'monetę podatkową!'], ['Show me', 'the tax money!']), { size: 18, tail: 1 })}</g>`),
      whose: pl.add(`<g>${bubble(c, tr(['Czyj jest ten', 'obraz i napis?'], ['Whose is this image', 'and inscription?']), { size: 18, tail: 1 })}</g>`),
      caesar: pl.add(`<g>${bubble(c, tr('Cezara!', 'Caesar’s!'), { size: 22, tail: -1 })}</g>`),
    };
    const pouch = pl.add(`<g>${purse(c)}</g>`);
    const smallCoin = pl.add(`<g>${coin(c, 7)}</g>`);
    const heartEl = pl.add(`<g>${glowHeart(c, 18)}</g>`);

    /* hanging: the snare, the great denarius, the glow in the sanctuary door */
    const hangs = S.layer({ par: 0.3, sh: 6 });
    const doorGlow = hangs.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/><circle r="60" fill="url(#warm-glow)"/></g>`);
    const netEl = hangs.add(`<g>${snare(c, 190, 130)}</g>`);
    const big = hanging(hangs, denarius(c, 116), { x: 800, y: -400, len: 500 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* the questioners: masks fall at his word; at the end they go away */
      const unmask = es(t, 0.3, 0.5);
      const leave = es(t, 6.35, 6.95, ease.in);
      const marvel = es(t, 6.02, 6.3) * (1 - leave);
      Q.forEach((q) => {
        const x = lerp(QX[q.i], 1520 + q.i * 70, es(t, 6.35 + q.i * 0.05, 6.9 + q.i * 0.03, ease.in));
        const bring = q.i === 2 ? es(t, 2.1, 2.3) * (1 - es(t, 2.6, 2.8)) : 0;
        const reply = q.i === 0 ? bump(t, 4.05, 4.8) : 0;
        q.p.set({
          x, y: F + 4 + (q.i % 2) * 8, s: 0.92, flip: leave < 0.05, walk: leave > 0 && leave < 1 ? x * 0.05 + q.i : undefined, blink: blinkAt(T, q.seed),
          lean: -bump(t, 5.1, 5.9) * 6, head: bump(t, 3.2, 4.0) * -10 + marvel * 16, armF: 20 + bring * 50 + reply * 50 + marvel * 10, armB: marvel * 30,
        });
        q.p.mood({ angry: unmask * (1 - es(t, 5.3, 5.6)), sad: es(t, 5.4, 5.7) * (1 - leave) });
        const [hx, hy] = headAt(x, F + 4 + (q.i % 2) * 8, 0.92, true);
        const fall = es(t, 0.3 + q.i * 0.04, 0.62 + q.i * 0.04, ease.in);
        pose(masks[q.i], { x: hx - 16 - fall * 20, y: hy + 44 + fall * 200, r: -fall * (60 + q.i * 20), s: 0.95, o: 1 - es(t, 0.55 + q.i * 0.04, 0.7 + q.i * 0.04) });
      });
      const nd = 1 - es(t, 0.35, 0.8, ease.in);
      pose(netEl, { x: JX + 4, y: lerp(-800, 312, nd), r: Math.sin(T * 1.1) * 2 * nd, o: nd > 0.01 ? 1 : 0 });

      /* Jesus */
      const open = es(t, 1.05, 1.25) * (1 - es(t, 2.3, 2.5));
      const point = es(t, 3.3, 3.5) * (1 - es(t, 4.8, 5.0));
      const give = es(t, 5.05, 5.3);
      jesus.set({
        x: JX, y: F, s: 1.04, blink: blinkAt(T), head: -point * 14 + bump(t, 0.05, 0.9) * 6,
        armF: 20 + bump(t, 0.05, 0.9) * 50 + open * 60 + point * 110 + give * 70 * (1 - es(t, 6.0, 6.3)),
        armB: 10 + bump(t, 0.1, 0.9) * 40 + give * 80 * (1 - es(t, 6.0, 6.3)),
      });
      voice(JX + 26, F - 176, bump(t, 0.02, 0.95) + bump(t, 1.02, 1.95) + bump(t, 3.02, 3.95) + bump(t, 5.02, 5.95), T, { dir: 1 });
      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.9, head: -point * 14, armF: marvel * 40, blink: blinkAt(T, d.i + 2) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -point * 14 - 4, armF: marvel * (m.i % 2 ? 50 : 0), blink: blinkAt(T, m.seed) }));

      popBubble(bb.why, t, 0.15, 0.95, JX + 44, F - 212);
      popBubble(bb.show, t, 1.12, 1.95, JX + 44, F - 212);
      popBubble(bb.whose, t, 3.12, 3.95, JX + 50, F - 214);
      popBubble(bb.caesar, t, 4.12, 4.95, QX[0] - 16, F - 206);

      /* v19b — the purse and the coin */
      const pk = es(t, 2.08, 2.2) * (1 - es(t, 2.75, 2.85));
      const [px, py] = hand(QX[2], F + 4, 0.92, true, 20 + es(t, 2.1, 2.3) * 50);
      pose(pouch, { x: px, y: py - 6, s: 0.8, o: pk });
      const ck = es(t, 2.25, 2.35), pass = es(t, 2.45, 2.75);
      const [jx, jy] = hand(JX, F, 1.04, false, 80);
      pose(smallCoin, { x: lerp(px, jx, pass), y: lerp(py - 4, jy - 4, pass) - Math.sin(pass * Math.PI) * 30, s: 1.4, o: ck * (1 - es(t, 3.05, 3.15)) });
      /* v20 — the great denarius comes down */
      const dk = es(t, 3.05, 3.5, ease.out);
      const toCaesar = es(t, 5.1, 5.5, ease.io);
      pose(big, { x: lerp(800, CHX, toCaesar), y: lerp(lerp(-800, 272, dk), 560, toCaesar), s: lerp(1, 0.12, toCaesar), r: Math.sin(T * 0.7) * 2 * (1 - toCaesar), o: 1 - es(t, 5.45, 5.55) });
      /* v21b — to Caesar his coin, to God the heart */
      const chk = es(t, 4.9, 5.15, ease.back);
      pose(chest, { x: CHX, y: F + 8, s: chk, o: chk > 0.01 ? 1 : 0 });
      pose(chestTag, { x: CHX, y: F - 120, s: chk * (1 - es(t, 6.2, 6.4)), o: chk > 0.02 ? 1 : 0 });
      const hk = es(t, 5.3, 5.5, ease.back), up = es(t, 5.55, 5.95, ease.io);
      const [bx, by] = hand(JX, F, 1.04, false, 150);
      pose(heartEl, { x: lerp(bx - 60, 800, up), y: lerp(by - 20, 300, up), s: hk * (1 - up * 0.3), o: hk > 0.01 ? 1 - es(t, 6.3, 6.6) : 0 });
      pose(doorGlow, { x: 800, y: 300, o: es(t, 5.85, 6.1) * (1 - es(t, 6.6, 6.9)) });
      S.cam.z = 1.05 * (1 - es(t, 0.3, 0.9)) + 1 * es(t, 0.3, 0.9) + es(t, 3.05, 3.6) * 0.05 * (1 - es(t, 5.0, 5.5));
      S.cam.y = -20 * (1 - es(t, 0.3, 0.9)) - es(t, 3.05, 3.6) * 20 * (1 - es(t, 5.0, 5.5));
    };
  },
};
