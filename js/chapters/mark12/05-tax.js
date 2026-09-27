// Mk 12,13–17 — the question of taxes. The leaders send Pharisees and Herodians with a snare of words.
// They come smiling behind paper masks, all flattery; they praise him for teaching "the way of God" (a golden
// path unrolls to the sanctuary); then the trap: pay or not? He sees through the masks (they fall), asks for
// a denarius — a great silver coin with Caesar's head comes down — "Caesar's". The coin goes to Caesar's chest,
// a glowing heart goes up to God's house. They marvel.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, LOOK, pharisee, herodian, moodPuppet, voiceRings, bubble, thought, snare, maskOnStick, denarius, coin, purse, taxChest, glowHeart, sparkle, headAt, hand, sheet } from './lib.js';

const QX = [944, 1012, 1080, 1148];     // the questioners' places
const JX = 770;

export default {
  id: 'm12-tax',
  beats: [
    { v: 13 },
    { v: 14, text: 'Ci przyszli i rzekli do Niego: «Nauczycielu, wiemy, że jesteś prawdomówny i na nikim Ci nie zależy.' },
    { v: 14, cont: true, text: 'Bo nie oglądasz się na osobę ludzką, lecz drogi Bożej w prawdzie nauczasz.' },
    { v: 14, cont: true, text: 'Czy wolno płacić podatek Cezarowi, czy nie? Mamy płacić czy nie płacić?»' },
    { v: 15, text: 'Lecz On poznał ich obłudę i rzekł do nich: «Czemu Mnie wystawiacie na próbę?' },
    { v: 15, cont: true, text: 'Przynieście Mi denara, chcę zobaczyć».' },
    { v: 16, text: 'Przynieśli, a On ich zapytał: «Czyj jest ten obraz i napis?»' },
    { v: 16, cont: true, text: 'Odpowiedzieli Mu: «Cezara».' },
    { v: 17, text: 'Wówczas Jezus rzekł do nich: «Oddajcie więc Cezarowi to, co należy do Cezara, a Bogu to, co należy do Boga».' },
    { v: 17, cont: true, text: 'I byli pełni podziwu dla Niego.' },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 420, x1: 640, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 1010, x1: 1200, pose: 'sit' }]);
    // the golden way of God, from his feet up the stairs to the sanctuary
    const wayL = S.layer({ par: 0.47, sh: 1 });
    const way = wayL.add(`<g><path d="${c.cut([[JX - 64, 0], [JX + 64, 0], [818, -250], [782, -250]], 0.6, 8)}" fill="${C.halo}" opacity=".85"/><path d="${c.ribbon([[JX, -4], [800, -246]], 3)}" fill="${C.star}"/></g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const leaders = [LOOK.elder, LOOK.priest, LOOK.lscribe].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 300 + i * 56, i, seed: c.rr(0, 9) }));
    const dis = [CAST.john, CAST.peter, CAST.james].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 600 - i * 58, y: F + 10 + (i % 2) * 8, i }));
    const looks = [pharisee(c, 0), pharisee(c, 1), herodian(c, 0), herodian(c, 1)];
    const Q = looks.map((o, i) => ({ i, p: moodPuppet(S, pl, c, o), seed: c.rr(0, 9) }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const masks = Q.map(() => pl.add(`<g>${maskOnStick(c)}</g>`));
    const bb = {
      flatter: pl.add(`<g>${bubble(c, tr(['Nauczycielu,', 'jesteś prawdomówny…'], ['Teacher,', 'you are honest…']), { size: 18, tail: -1 })}</g>`),
      way: pl.add(`<g>${bubble(c, tr(['…drogi Bożej', 'w prawdzie nauczasz'], ['…you truly teach', 'the way of God']), { size: 18, tail: -1 })}</g>`),
      pay: pl.add(`<g>${bubble(c, tr(['Płacić Cezarowi', 'czy nie płacić?'], ['Pay Caesar', 'or not?']), { size: 19, tail: -1 })}</g>`),
      why: pl.add(`<g>${bubble(c, tr(['Czemu Mnie', 'wystawiacie na próbę?'], ['Why do you', 'test me?']), { size: 18, tail: 1 })}</g>`),
      whose: pl.add(`<g>${bubble(c, tr('Czyj to obraz?', 'Whose image?'), { size: 19, tail: 1 })}</g>`),
      caesar: pl.add(`<g>${bubble(c, tr('Cezara!', 'Caesar’s!'), { size: 22, tail: -1 })}</g>`),
    };
    const net = pl.add(`<g>${thought(c, `<g transform="translate(-26 -22) scale(.3)">${snare(c, 170, 120).replace(/<path d="M0 -1400V0"[^>]*\/>/, '')}</g>`, { w: 84, h: 66 })}</g>`);
    const pouch = pl.add(`<g>${purse(c)}</g>`);
    const smallCoin = pl.add(`<g>${coin(c, 7)}</g>`);
    const heartEl = pl.add(`<g>${glowHeart(c, 18)}</g>`);
    const sparks = [0, 1, 2, 3, 4].map(() => pl.add(`<g>${sparkle(c, 10)}</g>`));

    /* Caesar's chest appears on the left */
    const chestL = S.layer({ par: 0.52, sh: 5 });
    const chest = chestL.add(`<g>${taxChest(c)}</g>`);
    const chestTag = chestL.add(`<g>${bubble(c, tr('Cezarowi', 'to Caesar'), { size: 17, tail: 0 }).replace(/<path[^>]*>/, (m) => m)}</g>`);

    /* hanging: the snare over his head, the great denarius, the glow in the sanctuary door */
    const hangs = S.layer({ par: 0.3, sh: 6 });
    const doorGlow = hangs.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/><circle r="60" fill="url(#warm-glow)"/></g>`);
    const netEl = hangs.add(`<g>${snare(c, 190, 130)}</g>`);
    const big = hanging(hangs, denarius(c, 116), { x: 800, y: -400, len: 500 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v13 — the leaders, over on the left, send them; they come in from the right */
      const lead = es(t, 0.02, 0.2) * (1 - es(t, 0.75, 1.0));
      leaders.forEach((l) => {
        const x = l.x - (1 - lead) * 260;
        l.p.set({ x, y: F + 4, s: 0.9, flip: t > 0.75, walk: (lead > 0 && lead < 1) ? x * 0.05 : undefined, armF: 30 + bump(t, 0.2, 0.7) * (l.i === 1 ? 60 : 0), head: -6, blink: blinkAt(T, l.seed), o: lead > 0.001 ? 1 : 0 });
      });
      const unmask = es(t, 4.05, 4.3);
      const marvel = es(t, 9.05, 9.3);
      Q.forEach((q) => {
        const inK = es(t, 0.2 + q.i * 0.06, 0.65 + q.i * 0.06);
        const x = lerp(1450 + q.i * 50, QX[q.i], inK) + marvel * 30;
        const bow = bump(t, 1.05, 1.95) + bump(t, 2.05, 2.8) * 0.6;
        const reply = q.i === 2 ? bump(t, 7.05, 7.7) : 0;
        q.p.set({
          x, y: F + 4 + (q.i % 2) * 8, s: 0.92, flip: true, walk: inK > 0 && inK < 1 ? x * 0.05 + q.i : undefined, blink: blinkAt(T, q.seed),
          lean: -bow * 10 + marvel * 6, head: bow * 12 - marvel * 8,
          armF: 20 + bow * 40 + (q.i === 2 ? es(t, 5.3, 5.5) * 50 * (1 - es(t, 6.0, 6.2)) : 0) + reply * 50 + marvel * 70, armB: bow * 30 + marvel * 60 + bump(t, 3.1, 3.9) * (q.i === 1 ? 90 : 0),
        });
        q.p.mood({ angry: unmask * (1 - es(t, 8.5, 8.8)), sad: 0 });
        // the masks: held before their faces, then they fall away
        const [hx, hy] = headAt(x, F + 4 + (q.i % 2) * 8, 0.92, true);
        const mk = es(t, 1.0 + q.i * 0.03, 1.12 + q.i * 0.03);
        const fall = es(t, 4.05 + q.i * 0.04, 4.4 + q.i * 0.04, ease.in);
        pose(masks[q.i], { x: hx - 16 - fall * 20, y: hy + 44 + fall * 200, r: -fall * (60 + q.i * 20), s: 0.95, o: mk * (1 - es(t, 4.3, 4.45)) });
      });
      const nk = es(t, 0.65, 0.8, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(net, { x: QX[1] - 10, y: F - 210, s: nk, o: nk > 0.02 ? 1 : 0 });

      /* Jesus */
      const open = es(t, 5.05, 5.3) * (1 - es(t, 6.1, 6.3));
      const point = es(t, 6.35, 6.6) * (1 - es(t, 7.8, 8.0));
      const give = es(t, 8.05, 8.3);
      jesus.set({
        x: JX, y: F, s: 1.02, blink: blinkAt(T), head: -point * 14 + bump(t, 4.0, 4.9) * 6,
        armF: 20 + bump(t, 4.05, 4.9) * 50 + open * 60 + point * 110 + give * 70 * (1 - es(t, 9.0, 9.3)),
        armB: 10 + bump(t, 4.1, 4.9) * 40 + give * 80 * (1 - es(t, 9.0, 9.3)),
      });
      voice(JX + 26, F - 176, bump(t, 4.02, 4.95) + bump(t, 5.02, 5.95) + bump(t, 8.02, 8.95), T, { dir: 1 });
      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.9, head: -point * 14, armF: marvel * 40, blink: blinkAt(T, d.i + 2) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -point * 14 - 4, armF: marvel * (m.i % 2 ? 50 : 0), blink: blinkAt(T, m.seed) }));

      /* bubbles */
      const bub = (el, a, b, x, y) => { const k = es(t, a, a + 0.15, ease.back) * (1 - es(t, b - 0.1, b)); pose(el, { x, y, s: k, o: k > 0.02 ? 1 : 0 }); };
      bub(bb.flatter, 1.15, 1.95, QX[0] - 10, F - 210);
      bub(bb.way, 2.15, 2.95, QX[1] - 20, F - 214);
      bub(bb.pay, 3.1, 3.95, QX[0] - 14, F - 210);
      bub(bb.why, 4.2, 4.95, JX + 40, F - 212);
      bub(bb.whose, 6.4, 6.95, JX + 50, F - 214);
      bub(bb.caesar, 7.15, 7.95, QX[2] - 16, F - 206);

      /* v14b — the way of God */
      const wk = es(t, 2.2, 2.7) * (1 - es(t, 2.9, 3.1));
      pose(way, { x: 0, y: F + 4, sy: Math.max(0.001, wk), o: wk > 0.01 ? 1 : 0 });
      /* v14c — the snare comes down over him … v15a — and is drawn up again */
      const nd = es(t, 3.15, 3.6, ease.out) * (1 - es(t, 4.1, 4.5, ease.in));
      pose(netEl, { x: JX + 4, y: lerp(-800, 312, nd), r: Math.sin(T * 1.1) * 2 * nd });

      /* v15b — a purse, a coin; v16a — the coin to Jesus, the great denarius comes down */
      const hx = QX[2], pk = es(t, 5.3, 5.45) * (1 - es(t, 6.0, 6.1));
      const [px, py] = hand(hx, F + 4, 0.92, true, 20 + es(t, 5.3, 5.5) * 50);
      pose(pouch, { x: px, y: py - 6, s: 0.8, o: pk });
      const ck = es(t, 5.55, 5.7), pass = es(t, 6.02, 6.3);
      const [jx, jy] = hand(JX, F, 1.02, false, 80);
      pose(smallCoin, { x: lerp(px, jx, pass), y: lerp(py - 4, jy - 4, pass) - Math.sin(pass * Math.PI) * 30, s: 1.4, o: ck * (1 - es(t, 6.3, 6.4)) });
      const dk = es(t, 6.3, 6.75, ease.out);
      const toCaesar = es(t, 8.1, 8.5, ease.io);
      pose(big, {
        x: lerp(800, 404, toCaesar), y: lerp(lerp(-800, 272, dk), 560, toCaesar), s: lerp(1, 0.12, toCaesar), r: Math.sin(T * 0.7) * 2 * (1 - toCaesar),
        o: 1 - es(t, 8.45, 8.55),
      });
      /* v17 — to Caesar his coin, to God the heart */
      const chk = es(t, 7.9, 8.15, ease.back);
      pose(chest, { x: 404, y: F + 8, s: chk, o: chk > 0.01 ? 1 : 0 });
      pose(chestTag, { x: 404, y: F - 120, s: chk * (1 - es(t, 9.4, 9.5)), o: chk > 0.02 ? 1 : 0 });
      const hk = es(t, 8.3, 8.5, ease.back), up = es(t, 8.55, 8.95, ease.io);
      const [bx, by] = hand(JX, F, 1.02, false, 150);
      pose(heartEl, { x: lerp(bx - 60, 800, up), y: lerp(by - 20, 300, up), s: hk * (1 - up * 0.3), o: hk > 0.01 ? 1 - es(t, 9.3, 9.6) : 0 });
      pose(doorGlow, { x: 800, y: 300, o: es(t, 8.85, 9.1) * (1 - es(t, 9.6, 9.9)) });
      sparks.forEach((el, i) => {
        const a = (i / 5) * Math.PI * 2, k = seg(t, 9.05, 9.8);
        pose(el, { x: 1040 + Math.cos(a) * (40 + k * 60), y: F - 230 + Math.sin(a) * (20 + k * 30) - k * 20, s: 1 - k * 0.4, o: bump(t, 9.05, 9.8) });
      });

      S.cam.z = 1 + es(t, 6.3, 6.8) * 0.05 * (1 - es(t, 8.0, 8.5));
      S.cam.y = -es(t, 6.3, 6.8) * 20 * (1 - es(t, 8.0, 8.5));
    };
  },
};
