// Mt 3,8–9 — on the bank between John and the leaders stands a young tree. "Bear fruit worthy of
// repentance": it blossoms and its fruit ripens. "Do not say, 'We have Abraham for our father'": they lift
// their chins, and Abraham's portrait comes down over them. "God can raise children to Abraham from these
// stones": the river stones at their feet hop, turn — and stand up as children.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, voiceRings, jordanSet, pharisee, sadducee, orchardTree, fruit, blossom, portrait, ABRAHAM, child, sparkle, DAY, tr } from './lib.js';

const PI = Math.PI;
const JX = 530, BANK = 772, TX = 775, TY = 732;

export default {
  id: 'mt3-stones',
  beats: [
    { v: 8 },
    { v: 9, text: 'a nie myślcie, że możecie sobie mówić: "Abrahama mamy za ojca",' },
    { v: 9, cont: true, text: 'bo powiadam wam, że z tych kamieni może Bóg wzbudzić dzieci Abrahamowi.' },
  ],
  cam: { x: [-20, 30], y: [60, 130], z: [1.08, 1.22] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: stones a little closer together, the leaders closer, Abraham inside the screen
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1220, 150], city: false, path: false });
    const { N } = J.nearBank();

    /* the young tree, its blossoms and fruit */
    const T = S.layer({ par: 0.45, sh: 5 });
    const tr_ = orchardTree(c, { sc: 0.95, leaf: C.leaf, leaf2: C.moss });
    T.add(`<g transform="translate(${TX} ${TY})">${tr_.tree}</g>`);
    const blooms = tr_.fruits.map((f, i) => ({ ...f, i, el: T.add(`<g>${blossom(c, 7)}</g>`) }));
    const fruits = tr_.fruits.map((f, i) => ({ ...f, i, el: T.add(`<g>${fruit(c, 10)}</g>`) }));

    /* the stones on the bank and the children they become */
    const P = S.layer({ par: 0.45, sh: 5 });
    const STONES = [[640, 758, 40], [706, 770, 34], [776, 764, 44], [846, 772, 36], [912, 760, 40]].map(([x, y, w], i) => ({
      x: PH ? 624 + i * 60 : x, y, w, i,
      el: P.add(`<g>${rock(c, 0, 0, w, w * 0.55, i % 2 ? C.rock : C.rock2)}</g>`),
      kid: S.puppet(P.add(person(c, child(c, i)))),
      spark: P.add(`<g opacity="0">${sparkle(c, 16, C.halo)}</g>`),
      glow: P.add(`<circle r="40" fill="url(#halo-glow)" opacity="0"/>`),
    }));

    /* John on the left, the leaders on the right */
    const john = S.puppet(P.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(P, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });
    const LEAD = [
      { o: pharisee(c, 1), x: 1010, s: 1.0 }, { o: sadducee(0), x: 1090, s: 0.98 },
      { o: pharisee(c, 3), x: 1170, s: 1.02 }, { o: sadducee(1), x: 1250, s: 0.97 },
    ].map((m, i) => ({ ...m, x: PH ? 868 + i * 44 : m.x, i, p: S.puppet(P.add(person(c, m.o))), seed: c.rr(0, 9) }));

    /* Abraham's portrait, from the flies */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const abr = fly.add(`<g class="hang"><path d="M0 -1600V-90" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${portrait(S, ABRAHAM, tr('Abraham', 'Abraham'), { w: 130, h: 160 })}</g></g>`);

    J.foreground();

    return (t, time) => {
      J.update(t, time);

      /* v8 — bear fruit: blossoms open, fruit ripens */
      const tell = es(t, 0.05, 0.25) * (1 - es(t, 0.9, 1.05));
      blooms.forEach((b) => {
        const k = es(t, 0.12 + b.i * 0.03, 0.3 + b.i * 0.03, ease.back), gone = es(t, 0.5 + b.i * 0.02, 0.6 + b.i * 0.02);
        pose(b.el, { x: TX + b.x, y: TY + b.y, s: k * (1 - gone), r: t * 40, o: k > 0.01 && gone < 1 ? 1 : 0 });
      });
      fruits.forEach((f) => {
        const k = es(t, 0.48 + f.i * 0.025, 0.7 + f.i * 0.025, ease.back);
        pose(f.el, { x: TX + f.x, y: TY + f.y + 6, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v9a — "we have Abraham for our father": chins up, the portrait comes down over them */
      const proud = es(t, 1.08, 1.3) * (1 - es(t, 2.05, 2.25));
      const ak = es(t, 1.15, 1.45, ease.out);
      pose(abr, { x: PH ? 990 : 1100, y: lerp(-420, 290, ak), r: Math.sin(time * 0.7) * 1.2, o: ak > 0.01 ? 1 : 0 });

      /* v9b — the stones hop and stand up as children */
      const pointS = es(t, 2.05, 2.2);
      const surprise = es(t, 2.45, 2.65);
      LEAD.forEach((m) => {
        m.p.set({
          x: m.x + surprise * 10, y: BANK + (m.i % 2) * 6, s: m.s, flip: true,
          head: -proud * 12 + surprise * 6, lean: proud * -4 + surprise * -5,
          armF: 20 + (m.i === 0 ? proud * 120 : proud * 30) + surprise * 40, armB: 10 + (m.i === 2 ? proud * 150 : 0) + surprise * (m.i % 2 ? 60 : 20),
          blink: blinkAt(time, m.seed),
        });
      });
      STONES.forEach((s) => {
        const a = 2.18 + s.i * 0.07;
        const hop = es(t, a, a + 0.14), stand = es(t, a + 0.12, a + 0.17);
        pose(s.el, { x: s.x, y: s.y - Math.sin(hop * PI) * 30 - s.w * 0.2, r: hop * 180, ox: 0, oy: 0, o: 1 - stand });
        pose(s.glow, { x: s.x, y: s.y - 20, s: 1 + bump(t, a - 0.1, a + 0.3), o: bump(t, a - 0.1, a + 0.35) });
        const sk = bump(t, a + 0.1, a + 0.4);
        pose(s.spark, { x: s.x + 18, y: s.y - 80, s: sk, r: time * 40, o: sk });
        const joy = es(t, a + 0.25, a + 0.45);
        s.kid.set({
          x: s.x, y: s.y + 6, s: 0.6 * (0.7 + stand * 0.3), flip: s.i % 2 === 1, o: stand,
          armF: 10 + joy * (s.i % 2 ? 60 : 120), armB: joy * (s.i % 2 ? 130 : 30), head: -joy * 8, blink: blinkAt(time, s.i),
        });
      });

      john.set({
        x: JX, y: BANK, s: 1.06, flip: false,
        armF: 20 + tell * 60 + bump(t, 1.3, 1.9) * 20 + pointS * 55 * (1 - es(t, 2.8, 3)), armB: 10 + tell * 30 + bump(t, 1.3, 1.9) * 40,
        head: Math.sin(seg(t, 1.35, 1.85) * PI * 3) * 6 * bump(t, 1.35, 1.85) + pointS * 8, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(JX, BANK, 1.06, false);
      voice(hx + 14, hy, Math.max(tell, bump(t, 1.3, 1.9), pointS * (1 - es(t, 2.7, 2.9))), time, { spread: 2.4, dir: 1 });

      S.cam.z = 1.1 + es(t, 0.0, 0.4) * 0.06 - es(t, 1.0, 1.3) * 0.04 + es(t, 2.0, 2.3) * 0.06;
      S.cam.x = -10 + es(t, 1.0, 1.3) * 30 - es(t, 2.0, 2.3) * 20;
      S.cam.y = 90 - es(t, 1.0, 1.3) * 20 + es(t, 2.0, 2.3) * 30;
    };
  },
};
