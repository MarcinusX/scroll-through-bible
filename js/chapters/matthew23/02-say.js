// Mt 23,3 — closer to the seat of Moses. The scribe unrolls the Law and reads; golden slips of its words fly out to the
// listeners, who catch them and hold them to their hearts: "do and keep all they tell you". A little boy in front puffs
// out his chest and struts with his nose in the air, just like the Pharisee — his mother catches his shoulder and
// turns him round: "but do not imitate their works". Then the Pharisee talks and talks and points the way; the people
// set off along it — but he does not stir, and a spider comes down and spins its web between his feet and the dais.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, mosesSeat, vain, PH, SC, folk, child, goldSlip, cobweb, spider, scrollOpen, say, handAt, tr } from './lib.js';

const SX = 800;

export default {
  id: 'mt23-say',
  beats: [
    { v: 3, text: 'Czyńcie więc i zachowujcie wszystko, co wam polecą, lecz uczynków ich nie naśladujcie.' },
    { v: 3, cont: true, text: 'Mówią bowiem, ale sami nie czynią.' },
  ],
  cam: { x: [-20, 20], y: [-40, 10], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const L = S.layer({ par: 0.5, sh: 5 });
    L.add(`<g transform="translate(${SX} ${F + 4})">${mosesSeat(c)}</g>`);
    const scribe = S.puppet(L.add(vain(c, SC, { pose: 'sit', holdF: `<g transform="translate(6 10) rotate(-70)">${scrollOpen(c, 56, 40)}</g>` })));
    const phar = S.puppet(L.add(vain(c, PH, { pose: 'sit' })));

    /* the listeners: left and right of the seat */
    const LEFT = [[430, F + 4, 0.9], [505, F + 16, 0.94], [585, F + 8, 0.92], [655, F + 22, 0.96]];
    const RIGHT = [[1140, F + 6, 0.92], [1215, F + 18, 0.94], [1285, F + 8, 0.9]];
    const lis = [...LEFT.map((p, i) => ({ side: -1, i })), ...RIGHT.map((p, i) => ({ side: 1, i }))].map((m, j) => {
      const [x, y, s] = (m.side < 0 ? LEFT : RIGHT)[m.i];
      return { ...m, j, x, y, s, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, j % 3 !== 1)))) };
    });
    // the boy who copies the Pharisee, and his mother
    const mum = S.puppet(L.add(person(c, folk(c, false, { robe: C.roseRobe, mantle: C.wheatRobe }))));
    const BOY = child(c, false, { robe: C.sageRobe });
    const boy = S.puppet(L.add(person(c, BOY)));
    const boyV = S.puppet(L.add(vain(c, { ...BOY, veil2: C.dustyBlue })));

    /* the golden words, the talk, the spider and its web */
    const fx = S.layer({ par: 0.5, sh: 4 });
    const slips = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g>${goldSlip(c, 34)}</g>`) }));
    const talk = fx.add(`<g>${say(c, [tr('Tak trzeba!', 'Do this!'), tr('Tędy idźcie!', 'Go that way!')], { size: 19, side: 1 })}</g>`);
    const web = fx.add(`<g>${cobweb(c, 44)}</g>`);
    const web2 = fx.add(`<g>${cobweb(c, 34)}</g>`);
    const spi = fx.add(`<g>${spider(c)}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      const seatY = F - 90;

      /* v3a — the scribe reads; the words fly to the people, who keep them */
      const read = es(t, 0.02, 0.2) * (1 - es(t, 1.05, 1.25));
      scribe.set({ x: SX - 44, y: seatY, s: 0.9, flip: true, armF: 40 + read * 45, armB: 20, head: -6 - es(t, 1.2, 1.5) * 8, blink: blinkAt(T, 1) });
      const [sx0, sy0] = handAt(SX - 44, seatY, 0.9, true, 85, 'sit');
      const catchers = lis.filter((m) => m.side < 0 || m.i < 2);
      slips.forEach((sl) => {
        const who = catchers[sl.i % catchers.length];
        const k = es(t, 0.08 + sl.i * 0.05, 0.4 + sl.i * 0.05);
        const hx = who.x + 34 * who.s * (who.side < 0 ? 1 : -1), hy = who.y - 106 * who.s;
        const x = lerp(sx0, hx, k), y = lerp(sy0 - 30, hy, k) - Math.sin(k * Math.PI) * (120 + (sl.i % 3) * 30);
        const gone = es(t, 1.05, 1.3);
        pose(sl.el, { x, y: y - gone * 20, s: 0.8 + k * 0.2, r: (1 - k) * (sl.i % 2 ? 40 : -40), o: (k > 0.01 ? 1 : 0) * (1 - gone) });
      });

      /* v3b — the Pharisee talks and points the way; the right-hand listeners set off */
      const point = es(t, 1.05, 1.25);
      const chat = T ? Math.sin(T * 7) * 5 : 0;
      phar.set({ x: SX + 44, y: seatY, s: 0.9, armF: 30 + point * 70 + point * chat, armB: 20 + point * 30, head: -8 + point * chat * 0.6, lean: -2, blink: blinkAt(T, 4) });
      const tk = es(t, 1.08, 1.25, ease.back);
      pose(talk, { x: SX + 70, y: F - 222, s: tk, o: tk > 0.02 ? 1 : 0 });
      const go = es(t, 1.2, 1.95);
      lis.forEach((m) => {
        const caught = es(t, 0.3 + (m.j % 4) * 0.05, 0.45 + (m.j % 4) * 0.05);
        const leaves = m.side > 0 && m.i < 2;
        const x = leaves ? m.x + go * (170 + m.i * 60) : m.x;
        m.p.set({
          x, y: m.y, s: m.s, flip: leaves ? go < 0.02 : m.side > 0, walk: leaves && go > 0.01 && go < 0.99 ? x * 0.05 : undefined,
          armF: caught * 48 * (1 - es(t, 1.1, 1.3) * (leaves ? 1 : 0.4)) + (m.j % 3) * 4, armB: caught * 20, head: -4 - caught * 4 + point * (m.side > 0 ? 0 : 4),
          blink: blinkAt(T, m.seed),
        });
      });

      /* the boy struts like the Pharisee; his mother turns him round */
      const copy = es(t, 0.42, 0.56) * (1 - es(t, 0.86, 0.98));
      const catchK = es(t, 0.6, 0.72) * (1 - es(t, 0.92, 1.02));
      const bx = 960 + copy * 40 - catchK * 16;
      const vainOn = es(t, 0.44, 0.5) * (1 - es(t, 0.9, 0.96));
      const bo = { x: bx, y: F + 40, s: 0.72, flip: catchK > 0.5, walk: copy > 0.05 && copy < 0.95 && catchK < 0.5 ? t * 40 : undefined, amt: 0.6, head: -copy * 22 * (1 - catchK * 0.6), lean: -copy * 10 * (1 - catchK), armF: copy * 20, armB: copy * 70, blink: blinkAt(T, 7) };
      boy.set({ ...bo, o: 1 - vainOn });
      boyV.set({ ...bo, o: vainOn });
      mum.set({ x: 1060, y: F + 26, s: 0.9, flip: true, armF: 20 + catchK * 62, armB: 10, head: 6 * catchK + (T ? Math.sin(T * 5) * 4 * catchK : 0), lean: catchK * 8, blink: blinkAt(T, 8) });

      /* v3b — nobody moves on the seat: a spider spins its web between his feet and the dais */
      const drop = es(t, 1.3, 1.55, ease.out), up = es(t, 1.82, 2.0);
      pose(spi, { x: SX + 112, y: lerp(F - 520, F - 52, drop) - up * 300, o: drop > 0.01 && up < 0.99 ? 1 : 0 });
      const wk = es(t, 1.45, 1.75);
      pose(web, { x: SX + 108, y: F - 38, s: 0.3 + wk * 0.7, o: wk });
      const wk2 = es(t, 1.55, 1.85);
      pose(web2, { x: SX - 110, y: F - 36, sx: -(0.3 + wk2 * 0.7), sy: 0.3 + wk2 * 0.7, o: wk2 });

      S.cam.z = 1.04 + es(t, 0.9, 1.3) * 0.04;
      S.cam.y = -20;
      S.cam.x = es(t, 0.9, 1.3) * 12;
    };
  },
};
