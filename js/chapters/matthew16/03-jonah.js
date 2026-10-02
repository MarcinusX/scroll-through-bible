// Mt 16,4 — "An evil and adulterous generation seeks a sign": they clamour, and the dark flat of heaven comes down
// again with its question. "No sign will be given it, except the sign of Jonah": the flat is pulled away and a painted
// sea is let down instead — the great fish rises with Jonah praying in its belly, and three moons cross the painted
// sky. On "He left them" the fish casts Jonah onto the shore under a rising sun, the board flies up, and Jesus walks
// away to the boat with His disciples; the testers are left standing with folded arms.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease } from '../../core/anim.js';
import { kf, moving, speech, GLYPH, pharisee, sadducee, heavenPanel, bigQuestion, headAt, hangAt, magadan, magadanFront, seaBoard, greatFish, waveFront, littleMoon, JONAH, MG, PI } from './lib.js';
import { sun } from '../../assets/nature.js';

const GY = MG.GY, JX = 800;
const DIS = [{ o: CAST.peter, x: 660 }, { o: CAST.andrew, x: 596 }, { o: CAST.john, x: 540 }];
const testers = (ph) => [0, 1, 2, 3, 4].map((i) => ({ i, sad: i >= 3, x: ph ? 868 + i * 40 + (i >= 3 ? 10 : 0) : 922 + i * 54 + (i >= 3 ? 20 : 0), y: GY - 6 + (i % 2) * 10 }));
const BW = 540, BH = 270, BT = 112;      // the Jonah board (top centre at 800, BT)

export default {
  id: 'mt16-jonah',
  beats: [
    { v: 4, text: 'Plemię przewrotne i wiarołomne żąda znaku,' },
    { v: 4, cont: true, text: 'ale żaden znak nie będzie mu dany, prócz znaku Jonasza».' },
    { v: 4, cont: true, text: 'Z tym ich zostawił i odszedł.' },
  ],
  cam: { x: [-160, 20], y: [-90, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const TEST = testers(S.portrait);
    const M = magadan(S);

    /* ---------- the flat of heaven ---------- */
    const heavL = S.layer({ par: 0.06, sh: 8 });
    const heav = heavL.add(`<g>${heavenPanel(c, 440, 250)}<g transform="translate(0 125)">${bigQuestion(c, 58, C.halo)}</g><path d="M-190 0V-1400M190 0V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/></g>`);

    /* ---------- the sign of Jonah: a painted sea board ---------- */
    const bL = S.layer({ par: 0.08, sh: 7 });
    const board = bL.add(`<g><path d="M${-BW / 2 + 30} 0V-1400M${BW / 2 - 30} 0V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${seaBoard(c, BW, BH)}</g>`);
    const bSun = bL.add(`<g><circle r="60" fill="url(#warm-glow)"/>${sun(c, 22)}</g>`);
    const moons = [0, 1, 2].map(() => bL.add(`<g>${littleMoon(c, 15)}</g>`));
    const F = greatFish(c, { w: 300, h: 120 });
    const fish = bL.add(`<g><g transform="scale(-1 1)">${F.body}</g></g>`);
    const jonahIn = bL.add(`<g>${person(c, { ...JONAH, pose: 'kneel' })}</g>`);
    const jonahOut = S.puppet(bL.add(person(c, { ...JONAH })));
    const front = bL.add(`<g>${waveFront(c, BW, 58, C.lake3)}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const test = TEST.map((m) => ({ ...m, p: S.puppet(P.add(person(c, m.sad ? sadducee(m.i - 3) : pharisee(m.i)))), seed: c.rr(0, 9) }));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const bangs = [0, 1, 2, 3, 4].map((i) => fx.add(`<g>${speech(c, i % 2 ? GLYPH.q(c) : GLYPH.bang(c), { w: 38, h: 38, flip: true })}</g>`));
    magadanFront(S);

    return (t, time) => {
      const T = time;
      M.update(T);

      /* v4a — the flat of heaven is demanded again; v4b — it is pulled away */
      const hv = es(t, 0.1, 0.5, ease.back) * (1 - es(t, 1.02, 1.3));
      hangAt(heav, 800, 116 - (1 - hv) * 700, T, 0.7, 0.6, 1);

      /* v4b — the Jonah board comes down; v4c — Jonah cast ashore, the board flies up */
      const bd = es(t, 1.15, 1.5, ease.back) * (1 - es(t, 2.45, 2.75));
      const by = BT - (1 - bd) * 800, sw = T ? Math.sin(T * 0.7) * 0.6 * bd : 0;
      const bx = 800;
      pose(board, { x: bx, y: by, r: sw, oy: 0, o: by < -200 ? 0 : 1 });
      pose(front, { x: bx - BW / 2, y: by + BH - 58, o: by < -200 ? 0 : 1 });
      // the fish rises from the sea and swims across (facing right)
      const rise = es(t, 1.35, 1.6);
      const swim = es(t, 1.4, 2.05);
      const fx0 = lerp(bx - 140, bx + 30, swim), fy = by + BH * 0.68 + (1 - rise) * 40 + (T ? Math.sin(T * 1.6) * 3 : 0);
      pose(fish, { x: fx0, y: fy, s: 0.8, r: T ? Math.sin(T * 1.2) * 1.5 : 0, o: rise * (by < -200 ? 0 : 1) });
      const spit = es(t, 2.05, 2.3);
      pose(jonahIn, { x: fx0 - 4, y: fy + 30, s: 0.25, o: rise > 0.5 && spit < 0.1 ? 1 : 0 });
      // three nights: three moons cross the painted sky
      moons.forEach((m, i) => {
        const k = es(t, 1.45 + i * 0.12, 1.62 + i * 0.12);
        const x = lerp(bx - BW / 2 + 20, bx - BW / 2 + 60 + i * 52, k), y = by + 44 - Math.sin(k * PI) * 26;
        pose(m, { x, y, o: k > 0.01 && by > -200 ? 1 : 0 });
      });
      // the third morning: Jonah flies from the fish's mouth onto the shore; the sun rises behind it
      const mouthX = fx0 + 120, mouthY = fy - 6;
      const shoreX = bx + BW * 0.4, shoreY = by + BH * 0.33;
      const jx = lerp(mouthX, shoreX, spit), jy = lerp(mouthY, shoreY, spit) - Math.sin(spit * PI) * 70;
      jonahOut.set({ x: jx, y: jy, s: 0.22, flip: false, r: (1 - spit) * -60, armF: 60 + spit * 40, armB: 140, head: -10, o: spit > 0.02 ? 1 : 0 });
      const sr = es(t, 2.1, 2.35);
      pose(bSun, { x: bx + BW * 0.32, y: by + BH * 0.34 - sr * 60, s: 0.6 + sr * 0.4, o: sr > 0.01 && by > -200 ? sr : 0 });

      /* Jesus: firm, shaking His head; then leaving for the boat */
      const lk = [[2.1, JX], [2.95, 470]];
      const jx2 = kf(t, lk, (u) => u);
      const jw = moving(t, lk, 1);
      const firm = es(t, 0.15, 0.4) * (1 - es(t, 0.95, 1.05));
      const tell = es(t, 1.08, 1.3) * (1 - es(t, 1.95, 2.05));
      jesus.set({ x: jx2, y: GY, s: 1, flip: t > 2.05, walk: jw ? jx2 * 0.05 : undefined, armF: 16 + firm * 30 + tell * 50, armB: 8 + tell * 130, head: firm * (T ? Math.sin(T * 5) * 5 : 0) - tell * 10, blink: blinkAt(T) });
      dis.forEach((d) => {
        const k = [[2.2 + d.i * 0.06, d.x], [2.95, d.x - 330]];
        const x = kf(t, k, (u) => u);
        const w = moving(t, k, 1);
        const up = es(t, 1.2, 1.4) * (1 - es(t, 2.1, 2.2));
        d.p.set({ x, y: GY + 4 + (d.i % 2) * 8, s: 0.9, flip: t > 2.15, walk: w ? x * 0.05 + d.i : undefined, armF: 16 + up * 20, head: -up * 18, blink: blinkAt(T, d.seed) });
      });
      /* the testers clamour; then stand with folded arms */
      test.forEach((m) => {
        const clam = es(t, 0.05 + m.i * 0.03, 0.25 + m.i * 0.03) * (1 - es(t, 0.95, 1.1));
        const look = es(t, 1.2, 1.4);
        const fold = es(t, 2.2, 2.45);  // chins up, arms down: they stay where they are
        m.p.set({
          x: m.x + clam * -12, y: m.y, s: 0.94, flip: true,
          armF: 16 + clam * (60 + (T ? Math.sin(T * 5 + m.i * 2) * 20 : 0)) - fold * 8, armB: 8 + clam * (m.i % 2 ? 150 : 40) - fold * 4,
          head: -clam * 10 - look * 16 * (1 - fold) - fold * 10, lean: fold * 5, blink: blinkAt(T, m.seed),
        });
      });
      bangs.forEach((b, i) => {
        const k = es(t, 0.15 + i * 0.07, 0.3 + i * 0.07, ease.back) * (1 - es(t, 0.95, 1.05));
        const m = TEST[i];
        const [mx, my] = headAt(m.x, m.y, 0.94, true);
        pose(b, { x: mx - 30, y: my - 44 - (i % 2) * 14, s: k * 0.9, r: T ? Math.sin(T * 3 + i) * 5 : 0, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = -es(t, 2.1, 2.95) * (S.portrait ? 70 : 150);   // phone: follow Him less, so the testers left behind are not sliced by the edge
      S.cam.z = 1.04 - es(t, 1.05, 1.4) * 0.04 + es(t, 2.4, 2.9) * 0.04;
      S.cam.y = -30 - es(t, 1.05, 1.4) * 50 + es(t, 2.4, 2.9) * 70;
    };
  },
};
