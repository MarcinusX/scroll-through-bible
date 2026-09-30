// Łk 5,15–16 — the green hills of Galilee dotted with villages. From the meadow where Jesus stands, the news about Him
// flies out like paper slips to village after village, and each one wakes with a spark; then the people come streaming
// down every path — families, a man on a crutch, a blind man with his stick, a sick woman carried on a mat — to hear
// Him and to be healed. But the sky reddens: He walks away alone, beyond the last fields, into the bare rocks of the
// wilderness, and kneels there to pray in the dusk, the light coming down behind Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, moon, stars, cloud, rock, grass, flowers, bush, olive, cypress } from '../../assets/nature.js';
import { acacia, scrub } from '../mark1/lib.js';
import { crutch } from '../mark3/lib.js';
import {
  wordSlip, sparkle, group, folk, lightShaft, kf, moving, headAt, pallet, DAY, DUSK, es, ease, bump, seg, PI,
} from './lib.js';

const P = 0.5;
const G = (x) => 712 + Math.sin(x * 0.004) * 8;         // the meadow (people walk here)
const VILL = [[-120, 468, 0.5], [230, 452, 0.55], [540, 470, 0.42], [1060, 462, 0.48], [1330, 450, 0.52]];
const RX = 1560, RY = 690;                               // the rock where He prays

export default {
  id: 'lk5-desert',
  beats: [
    { v: 15, text: 'Lecz tym szerzej rozchodziła się Jego sława,' },
    { v: 15, cont: true, text: 'a liczne tłumy zbierały się, aby Go słuchać i znaleźć uzdrowienie ze swych niedomagań.' },
    { v: 16 },
  ],
  cam: { x: [-60, 1400], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const dusk = sky(S, DUSK, { name: 'dusk' });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: 600, x1: 3000, y0: -500, y1: 330, n: 90 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1250, y: 150, len: 1200 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 30)}`, { x: 1900, y: 160, len: 1200 });
    const cls = [[420, 150, 190], [960, 110, 150], [1700, 140, 170]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 1200 }) }));
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 390, amps: [22, 9, 3], lens: [1100, 400, 130], color: mix(C.hillFar, C.duskViolet, 0.15), x0: -1400, x1: 3600 }).markup);
    const midL = S.layer({ par: 0.2, sh: 3 });
    const mh = hillsWith(c, { y: 470, amps: [20, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 22, x0: -1400, x1: 1500 });
    midL.add(mh.markup + VILL.map(([x, y, s]) => town(c, { x, y: y + 8, n: 5, spread: 110, sc: s })).join('') + cypress(c, 700, 470, 80) + olive(c, 880, 476, 0.6));
    // the wilderness beyond: bare, pale hills and rocks
    const wild = S.layer({ par: 0.2, sh: 3 });
    const wfn = c.wave(470, [30, 12, 4], [700, 260, 90]);
    wild.add(sheet().p(c.ridge((x) => wfn(x) + Math.max(0, 1500 - x) * 0.7, 1150, 3600, 1700, 12, 1.2), mix(C.dune, C.sand2, 0.4)).out());
    // the meadow and the paths
    const meadow = S.layer({ par: P, sh: 3 });
    const mfn = (x) => 600 + Math.sin(x * 0.003 + 1) * 14;
    meadow.add(sheet().p(c.ridge(mfn, -1400, 1700, 1700, 12, 1), C.hillNear).out());
    meadow.add(grass(c, { x0: -900, x1: 1200, y: 0, fn: (x) => mfn(x) + 40, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: -300, x1: 1100, y: 0, fn: (x) => mfn(x) + 70, n: 24 }) + bush(c, 120, 700, 80, C.sage, C.moss));
    const desertL = S.layer({ par: P, sh: 3 });
    const dfn = (x) => 640 + Math.sin(x * 0.006) * 16;
    desertL.add(sheet().p(c.ridge((x) => lerp(900, dfn(x), Math.min(1, Math.max(0, (x - 1080) / 320))), 1000, 3600, 1800, 12, 1.2), mix(C.sand2, C.dune, 0.3)).out());
    desertL.add(rock(c, RX, RY + 4, 190, 60, C.rock2) + rock(c, RX + 260, 700, 150, 70, C.rock) + rock(c, 1340, 710, 90, 40, C.rock2) + acacia(c, 1860, 690, 0.9) + scrub(c, 1420, 700, 40) + scrub(c, 1700, 706, 34));

    /* crowds streaming down the paths (sprites, drawn once) */
    const crowdL = S.layer({ par: P, sh: 4 });
    const sick = (o) => ({ ...folk(c, true), ...o });
    const GROUPS = [
      { from: [-360, 612, 0.4], to: [420, 718, 0.9], d: 0.0, mem: () => [{ x: 0, y: 0, s: 1, o: folk(c) }, { x: -44, y: 4, s: 0.96, o: sick({ holdF: `<g transform="rotate(-8)">${crutch(c, 118)}</g>` }) }, { x: -90, y: -2, s: 0.7, o: { ...folk(c), hairStyle: 'short' } }] },
      { from: [240, 604, 0.36], to: [580, 730, 0.92], d: 0.12, mem: () => [{ x: 0, y: 0, s: 1, o: sick({ eyes: 'closed', holdF: `<g transform="rotate(-24)">${sheet().p(c.ribbon([[0, -6], [18, 110]], 4), C.wood3).out()}</g>` }) }, { x: -40, y: 6, s: 1, o: folk(c, false) }] },
      { from: [1080, 606, 0.36], to: [1000, 726, 0.92], d: 0.08, mem: () => [{ x: 0, y: 0, s: 1, o: folk(c, true) }, { x: 44, y: 4, s: 1, o: folk(c, false) }, { x: 88, y: -2, s: 0.96, o: folk(c, true) }], flip: true },
      { from: [1480, 640, 0.42], to: [1150, 736, 0.94], d: 0.2, mem: () => [{ x: 0, y: 0, s: 1, o: folk(c, true) }, { x: 110, y: 0, s: 1, o: folk(c, true) }], mat: true, flip: true },
      { from: [-600, 700, 0.8], to: [260, 760, 1.0], d: 0.25, mem: () => [{ x: 0, y: 0, s: 1, o: folk(c, false) }, { x: -46, y: 6, s: 1, o: folk(c, true) }, { x: -92, y: 0, s: 0.72, o: folk(c) }] },
    ].map((g, i) => {
      const mem = g.mem().map((m) => ({ ...m, flip: !!g.flip }));
      let extra = '';
      if (g.mat) {
        const man = person(c, { robe: C.linen2, hair: C.hair2, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin3, eyes: 'closed' });
        extra = `<g transform="translate(55 -96)">${pallet(c, 120)}<g transform="translate(30 -28) rotate(-90) scale(.6)">${man}</g></g>`;
      }
      return { ...g, i, sp: crowdL.sprite(`<g transform="scale(.9)">${extra}${group(c, mem)}</g>`, g.to[0], g.to[1]) };
    });

    /* Jesus: on the meadow, then walking away alone into the wilderness to pray */
    const lightL = S.layer({ par: P, sh: 0, flat: true });
    const shaft = lightL.add(`<g>${lightShaft(c, { w0: 60, w1: 220, h: 1500, o: 0.55 })}</g>`);
    const PL = S.layer({ par: P, sh: 5 });
    const jesus = S.puppet(PL.add(person(c, CAST.jesus)));
    const kneel = S.puppet(PL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const slips = VILL.map(([x, y], i) => ({ i, x, y, el: PL.add(wordSlip(c, 30)) }));
    const pops = VILL.map(() => PL.add(`<g>${sparkle(c, 16)}</g>`));
    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, -200, 960, 240, C.moss, C.sage) + rock(c, 2300, 980, 240, 80, C.rock2) + scrub(c, 2100, 950, 90));

    const JKEYS = [[2.02, 800], [2.5, RX - 40]];

    return (t, time) => {
      const T = time;
      const dk = es(t, 1.9, 2.6);
      dusk.layer.fade(dk);
      starL.fade(es(t, 2.4, 2.9) * 0.8);
      pose(sunEl, { x: 1250 + dk * 200, y: 150 + dk * 380, r: Math.sin(T * 0.6) * 0.8, o: 1 - es(t, 2.5, 2.8) });
      pose(moonEl, { x: 1900, y: lerp(560, 170, es(t, 2.4, 2.95)), r: Math.sin(T * 0.6) * 0.8, o: es(t, 2.3, 2.5) });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(T * 0.1 + cl.i) * 24, y: cl.y, r: Math.sin(T * 0.6 + cl.i) * 1.2 }));

      /* v15a — the news flies out to every village; each wakes with a spark */
      const [hx, hy] = headAt(800, G(800), 1.04, false);
      slips.forEach((s) => {
        const k = es(t, 0.05 + s.i * 0.1, 0.45 + s.i * 0.1, ease.sine);
        pose(s.el, { x: lerp(hx, s.x, k), y: lerp(hy - 20, s.y - 30, k) - Math.sin(k * PI) * 120, r: Math.sin(k * 12 + s.i) * 20, s: 1 - k * 0.4, o: k > 0.01 && k < 0.99 ? 1 : 0 });
        const p = bump(t, 0.4 + s.i * 0.1, 0.75 + s.i * 0.1) + es(t, 0.75 + s.i * 0.1, 0.8 + s.i * 0.1) * 0.5 * (1 - es(t, 1.9, 2.1));
        pose(pops[s.i], { x: s.x, y: s.y - 30, s: 0.4 + p * 0.8, r: T * 40, o: p });
      });

      /* v15b — crowds stream down every path to Him */
      GROUPS.forEach((g) => {
        const k = es(t, 1.02 + g.d, 1.6 + g.d, ease.out);
        const leave = es(t, 2.1, 2.7);
        const x = lerp(g.from[0], g.to[0], k) - leave * (g.to[0] < 800 ? 120 : -60);
        const y = lerp(g.from[1], g.to[1], k);
        g.sp.set({ x, y, s: lerp(g.from[2], g.to[2], k), o: es(t, 0.95 + g.d, 1.05 + g.d) * (1 - leave) });
      });

      /* v16 — He withdraws into the wilderness and prays */
      const jx = kf(t, JKEYS, ease.sine);
      const down = es(t, 2.5, 2.56);
      const y = jx < 1250 ? G(jx) : lerp(G(1250), RY - 14, Math.min(1, (jx - 1250) / 260));
      const teach = es(t, 1.2, 1.4) * (1 - es(t, 1.9, 2.05));
      jesus.set({ x: jx, y, s: 1.04, flip: false, o: 1 - down, walk: moving(t, JKEYS) ? jx * 0.05 : undefined, armF: 14 + teach * (50 + (T ? Math.sin(T * 1.5) * 14 : 0)), armB: 8 + teach * 30 + bump(t, 0.02, 0.4) * 30, head: -teach * 4, blink: blinkAt(T) });
      const pray = es(t, 2.56, 2.72);
      kneel.set({ x: RX - 40, y: RY - 14, s: 1.04, flip: false, o: down, armF: 40 + pray * 70, armB: 30 + pray * 90, head: -pray * 12, blink: 0 });
      pose(shaft, { x: RX - 30, y: RY - 20, s: 1, o: es(t, 2.5, 2.72) });

      S.cam.x = kf(t, [[0, 0], [0.4, -40], [1.0, -40], [1.8, 0], [2.1, 60], [2.6, 1400], [3, 1400]]);
      S.cam.y = kf(t, [[0, 20], [0.5, -30], [1.0, 20], [2, 30], [3, 40]]);
      S.cam.z = kf(t, [[0, 1.04], [0.5, 1.0], [1.0, 1.02], [2.0, 1.04], [2.6, 1.1], [3, 1.12]]);
    };
  },
};
