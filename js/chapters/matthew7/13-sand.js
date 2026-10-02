// Mt 7,26–27 — the second flat: down in the sandy riverbed itself, a merry fellow throws up his house in no time
// and lounges in front of it (far off, on its rock, the wise man's house stands). The same storm comes: rain, wind,
// lightning, and the flood roars down the riverbed from the left; the sand is washed from under the walls and the
// house leans; he runs for the bank. "And it fell, and great was its fall": the walls burst apart, stones and roof
// tumble into the flood and are swept away, while the house on the rock still stands with its window lit.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, olive, cypress, bush, rock, reeds } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { VILLAGE, FOOL, houseParts, stormKit, waveStrip, storyFrame, PI } from './lib.js';

const HX = 820, HY = 690;          // the house's foot, in the sand
const FLOOD = 648;

export default {
  id: 'mt7-sand',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 26 },
    { v: 27, text: 'Spadł deszcz, wezbrały potoki, zerwały się wichry i rzuciły się na ten dom.' },
    { v: 27, cont: true, text: 'I runął, a upadek jego był wielki».' },
  ],
  cam: { x: [-40, 130], y: [-30, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, VILLAGE);
    const K = stormKit(S);
    K.back();
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 620, y: 140, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    const hills = S.layer({ par: 0.16, sh: 3 });
    const hb = hillsWith(c, { y: 520, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
    hills.add(hb.markup);
    // far off on the left: the wise man's house on its rock, still standing
    const far = S.layer({ par: 0.2, sh: 3 });
    const fr = sheet().p(c.cut([[240, 560], [270, 500], [310, 480], [390, 478], [430, 500], [460, 560]], 1, 6), C.rock2).out();
    const fh = sheet().p(c.cut(c.rect(318, 432, 62, 48), 0.4, 5), mix(C.stone, C.plaster, 0.45)).p(c.cut(c.rect(312, 424, 74, 10), 0.3, 5), C.wood2).p(c.cut([[330, 480], [330, 458], [340, 452], [350, 458], [350, 480]], 0.2, 3), C.wood).out();
    far.add(fr + fh);
    const farLit = far.add(`<g><circle cx="366" cy="452" r="18" fill="url(#warm-glow)"/><rect x="360" y="446" width="12" height="11" fill="${C.lampFlame}"/></g>`);

    /* the banks and the sandy riverbed */
    const land = S.layer({ par: 0.34, sh: 3 });
    land.add(sheet().p(c.ridge(c.wave(590, [5, 2], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.sage3, C.sand, 0.35)).out());
    land.add(sheet().p(c.cut([[1060, 610], [1120, 596], [1260, 560], [1400, 540], [1700, 540], [2500, 560], [2500, 1700], [1000, 1700]], 1, 8), mix(C.hillNear, C.sand, 0.3)).out());
    land.add(olive(c, 1320, 560, 0.8) + cypress(c, 1440, 548, 120) + bush(c, 1220, 600, 70, C.sage, C.moss));
    const bed = S.layer({ par: 0.4, sh: 3 });
    bed.add(sheet().p(c.ridge(c.wave(HY - 8, [3, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.cream, 0.25)).out());
    bed.add(reeds(c, 1120, HY, 7, 60) + reeds(c, 460, HY + 4, 6, 50) + rock(c, 560, HY + 20, 40, 16, C.rock));

    /* the house on the sand */
    const HL = S.layer({ par: 0.4, sh: 4 });
    const HP = houseParts(c, { w: 210, h: 140, wall: mix(C.clay, C.sand, 0.45), wall2: mix(C.clay, C.sand2, 0.3), roofCol: C.wood3 });
    const blocks = HP.blocks.map((b, i) => ({ ...b, i, el: HL.add(`<g>${b.m}</g>`), dx: c.rr(80, 380), dr: c.rr(-200, 200), sink: c.rr(0, 30) }));
    const door = HL.add(`<g>${HP.door.m}</g>`);
    const win = HL.add(`<g>${HP.win.m}</g>`);
    const roof = HL.add(`<g>${HP.roof.m}</g>`);
    const FO = FOOL;
    const lounger = S.puppet(HL.add(person(c, { ...FO, pose: 'sit' })));
    const runner = S.puppet(HL.add(person(c, FO)));

    /* the flood, coming down the riverbed from the left */
    const floodL = S.layer({ par: 0.42, sh: 3, pad: 1400 });
    floodL.add(waveStrip(c, { y: FLOOD, len: 150, amp: 16, color: mix(C.lake2, C.wood3, 0.3), crest: '#f4f1e6', x0: -2200, x1: 2600 }));
    const splashL = S.layer({ par: 0.42, sh: 1, flat: true });
    const drops = Array.from({ length: 14 }, (_, i) => ({ i, a: -PI * (0.12 + (i / 13) * 0.76), v: c.rr(90, 170), el: splashL.add(`<path d="${c.cut(c.ell(0, 0, c.rr(5, 9), c.rr(4, 6), 8), 0.3, 3)}" fill="#eef2f0"/>`) }));
    const floodF = S.layer({ par: 0.5, sh: 4, pad: 1400 });
    floodF.add(waveStrip(c, { y: FLOOD + 80, len: 200, amp: 20, color: mix(C.lake3, C.wood2, 0.3), crest: '#f4f1e6', x0: -2200, x1: 2600 }));

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 990, 260, C.moss, C.sage) + bush(c, 1510, 990, 260, C.sage, C.moss));
    K.front();
    storyFrame(S);

    return (t, time) => {
      const T = time;
      const storm = es(t, 1.02, 1.3);
      const flashK = Math.max(bump(t, 1.35, 1.45), bump(t, 2.05, 2.15), bump(t, 2.5, 2.58) * 0.7);
      K.set(storm, T, flashK * storm);
      swing(sunEl, 1230, 150 + storm * 700, T, 1, 0.6);
      swing(cl, 620 + Math.sin(T * 0.1) * 20, 140 + storm * 700, T, 1.2, 0.6, 1);
      pose(farLit, { o: es(t, 1.05, 1.2) });

      /* v26 — thrown up in no time; then he lounges */
      const n = blocks.length;
      const lean = es(t, 1.5, 1.95) * 7;                  // the sand washes out: the house leans
      const burst = es(t, 2.04, 2.95, (u) => u);
      const lr = (lean * PI) / 180;
      const place = (x, y) => [HX + x * Math.cos(lr) - y * Math.sin(lr), HY + 6 * es(t, 1.5, 1.95) + x * Math.sin(lr) + y * Math.cos(lr)];
      blocks.forEach((b) => {
        const a = 0.04 + (b.i / n) * 0.3;
        const k = es(t, a, a + 0.06, ease.out);
        const [px, py] = place(b.x, b.y);
        const stays = b.r === 0 && b.i % 2 === 0;            // a few stones of the bottom row stay, a ruin
        const my = burst > 0 && !stays ? es(burst, (3 - b.r) * 0.06 + (b.i % 3) * 0.03, 0.3 + (3 - b.r) * 0.08 + (b.i % 3) * 0.04, ease.in) : 0;      // top rows go first
        const fallY = FLOOD - 8 + b.sink * 0.3;
        const drift = stays ? 0 : es(burst, 0.25, 1, (u) => u);
        pose(b.el, {
          x: px + (burst > 0 ? drift * b.dx * 0.8 + my * (b.x * 0.5) : 0), y: burst > 0 ? lerp(py, fallY, my) + Math.sin(T * 2 + b.i) * 4 * drift : py - (1 - k) * 240,
          r: lean + (burst > 0 ? my * b.dr * 0.6 + (stays ? burst * 10 : 0) : 0), o: k > 0.01 ? 1 : 0,
        });
      });
      const dk = es(t, 0.36, 0.42, ease.out), rk2 = es(t, 0.4, 0.5, ease.out);
      const [dx, dy] = place(HP.door.x, HP.door.y), [wx, wy] = place(HP.win.x, HP.win.y), [rx, ry] = place(HP.roof.x, HP.roof.y);
      const fallR = es(burst, 0.05, 0.4, ease.in);
      pose(door, { x: dx + burst * 300, y: lerp(dy, FLOOD + 10, fallR) - (1 - dk) * 200, r: lean + fallR * 80, o: (dk > 0.01 ? 1 : 0) * (1 - es(burst, 0.6, 0.9)) });
      pose(win, { x: wx + burst * 200, y: lerp(wy, FLOOD + 20, fallR), r: lean - fallR * 40, o: (dk > 0.01 ? 1 : 0) * (1 - es(burst, 0.3, 0.5)) });
      pose(roof, { x: rx + es(burst, 0.1, 1) * 420, y: lerp(ry, FLOOD - 6, es(burst, 0, 0.45, ease.in)) - (1 - rk2) * 300 + Math.sin(T * 2) * 4 * burst, r: lean + es(burst, 0, 0.45) * 22, o: rk2 > 0.01 ? 1 : 0 });

      /* the builder: lounges; runs for the bank; stands aghast */
      const up = seg(t, 1.3, 1.35);
      const run = es(t, 1.35, 1.8, (u) => u);
      const aghast = es(t, 2.15, 2.35);
      lounger.set({ x: HX + 150, y: HY + 4, s: 1.0, flip: true, armF: 150, armB: 150, head: -6 + bump(t, 1.1, 1.3) * -10, o: seg(t, 0.52, 0.56) * (1 - up), blink: blinkAt(T, 2) });
      const rx2 = lerp(HX + 150, S.portrait ? 1066 : 1086, run), ry2 = lerp(HY + 4, S.portrait ? 611 : 610, run);
      runner.set({ x: rx2, y: ry2, s: lerp(1.0, 0.86, run), flip: aghast > 0.5, walk: run > 0 && run < 1 ? rx2 * 0.09 : undefined, amt: 1.5, armF: 40 + run * 30 * (1 - aghast) + aghast * 150, armB: 30 + aghast * 160, head: aghast * 6, lean: run > 0 && run < 1 ? 8 : 0, o: up, blink: blinkAt(T, 2) });
      // before he lounges: he builds (a quick bustle in front of the house)
      if (t < 0.52) runner.set({ x: HX + 150 - Math.sin(t * 30) * 20, y: HY + 4, s: 1.0, flip: true, walk: t * 30, armF: 60 + Math.abs(Math.sin(t * 50)) * 60, armB: 20, o: 1, blink: blinkAt(T, 2) });

      /* the flood roars in from the left, rises, and carries it all off */
      const come = es(t, 1.2, 1.6);
      const rise = es(t, 1.4, 1.9);
      floodL.shift(lerp(-1500, 0, come) + ((T * 180) % 150) - 75, (1 - rise) * 60 + 20 - Math.sin(T * 1.7) * 8 * rise);
      floodF.shift(lerp(-1700, 0, come) + 100 - ((T * 220) % 200), (1 - rise) * 80 + 20 - Math.sin(T * 2 + 1) * 10 * rise);
      floodL.fade(seg(t, 1.18, 1.22));
      floodF.fade(seg(t, 1.18, 1.22));
      drops.forEach((d) => {
        const k = seg(t, 2.1 + (d.i % 4) * 0.08, 2.5 + (d.i % 4) * 0.08);
        pose(d.el, { x: HX + Math.cos(d.a) * d.v * k * 1.4, y: FLOOD - 10 + Math.sin(d.a) * d.v * k + 160 * k * k, o: k > 0 && k < 1 ? 1 : 0 });
      });

      S.cam.z = 1.06 + es(t, 2.0, 2.3) * 0.04;
      S.cam.y = 30;
      S.cam.x = Math.sin(T * 7) * storm * 2 + es(t, 1.3, 1.8) * (S.portrait ? 120 : 16);     // phone: follow him to the bank, clear of the thread
    };
  },
};
