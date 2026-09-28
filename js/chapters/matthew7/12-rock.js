// Mt 7,24–25 — the parable of the two builders, first flat. Above a dry riverbed stands a great rock; the wise man
// builds his house on it, stone by stone, and puts on the roof. Then the storm: the sky goes dark, clouds come down
// on their strings, rain slants, the wind blows, lightning flashes and a flood fills the riverbed and beats against
// the rock — the house stands, its window lit. The storm passes, the flood drains away, and the man steps out of his
// door under a pale rainbow: it did not fall, for it was founded on the rock.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers, olive, cypress, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { VILLAGE, WISE, houseParts, rainbow, stormKit, waveStrip, handAt, storyFrame, PI } from './lib.js';

const HX = 850, HY = 566;          // the house's foot on the rock
const BED = 716;                   // the dry riverbed
const FLOOD = 664;                 // how high the flood comes

export default {
  id: 'mt7-rock',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 24 },
    { v: 25, text: 'Spadł deszcz, wezbrały potoki, zerwały się wichry i uderzyły w ten dom.' },
    { v: 25, cont: true, text: 'On jednak nie runął, bo na skale był utwierdzony.' },
  ],
  cam: { x: [-30, 30], y: [-30, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, VILLAGE);
    const bowL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    bowL.add(`<g transform="translate(900 760)">${rainbow(c, 560, 16)}</g>`);
    const K = stormKit(S);
    K.back();
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1250, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 520, y: 150, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(hillsWith(c, { y: 510, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 }).markup);

    /* the banks and the great rock */
    const land = S.layer({ par: 0.36, sh: 3 });
    land.add(sheet().p(c.ridge(c.wave(600, [6, 3], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.sage3, C.sand, 0.35)).out());
    const rk = sheet();
    const rpts = [[560, 760], [600, 660], [640, 600], [700, HY + 4], [760, HY - 2], [900, HY - 4], [1000, HY + 2], [1060, HY + 20], [1110, 620], [1150, 690], [1190, 760]];
    rk.p(c.cut(rpts, 1.6, 8), C.rock2);
    rk.p(c.cut([[640, 610], [700, HY + 10], [800, HY + 8], [760, 640], [680, 680]], 1, 7), shade(C.rock2, 0.18));
    rk.x(c.ribbon([[900, HY + 30], [950, 660]], 3) + c.ribbon([[1050, 620], [1080, 700]], 3) + c.ribbon([[700, 650], [740, 720]], 3), shade(C.rock2, -0.25), 'opacity=".6"');
    land.add(rk.out());
    land.add(olive(c, 330, 610, 0.9) + cypress(c, 1330, 600, 130) + bush(c, 1250, 640, 80, C.sage, C.moss) + grass(c, { x0: -600, x1: 2200, y: 602, n: 30, h: 12, color: C.olive }));
    // the tree that bends in the wind
    const treeL = S.layer({ par: 0.36, sh: 4 });
    const tree = treeL.add(`<g>${olive(c, 0, 0, 1.1)}</g>`);

    /* the house, built stone by stone */
    const HL = S.layer({ par: 0.36, sh: 4 });
    const HP = houseParts(c, { w: 230, h: 150 });
    const blocks = HP.blocks.map((b, i) => ({ ...b, i, el: HL.add(`<g>${b.m}</g>`) }));
    const door = HL.add(`<g>${HP.door.m}</g>`);
    const win = HL.add(`<g>${HP.win.m}</g>`);
    const lit = HL.add(`<g>${HP.win.lit}</g>`);
    const roof = HL.add(`<g>${HP.roof.m}</g>`);
    const man = S.puppet(HL.add(person(c, { ...WISE, holdF: `<g transform="translate(0 2) rotate(-60)"><path d="${c.ribbon([[0, 0], [0, -34]], 4)}" fill="${C.wood2}"/><path d="${c.cut(c.rect(-10, -46, 20, 14), 0.3, 3)}" fill="${C.wood}"/></g>` })));
    const manFree = S.puppet(HL.add(person(c, WISE)));

    /* the riverbed and the flood */
    const bed = S.layer({ par: 0.42, sh: 3 });
    const bs = sheet().p(c.ridge(c.wave(BED, [3, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.stone2, 0.4));
    let peb = '';
    for (let i = 0; i < 60; i++) { const x = c.rr(-400, 2000); peb += c.cut(c.blob(x, c.rr(BED + 10, 900), c.rr(4, 10), c.rr(3, 6), 7, 0.2), 0.3, 3); }
    bs.x(peb, C.stone2, 'opacity=".8"');
    bed.add(bs.out());
    const floodL = S.layer({ par: 0.44, sh: 3, pad: 320 });
    floodL.add(waveStrip(c, { y: FLOOD, len: 150, amp: 14, color: mix(C.lake2, C.wood3, 0.3), crest: '#f4f1e6' }));
    const floodF = S.layer({ par: 0.5, sh: 4, pad: 320 });
    floodF.add(waveStrip(c, { y: FLOOD + 70, len: 190, amp: 18, color: mix(C.lake3, C.wood2, 0.3), crest: '#f4f1e6' }));
    const splashL = S.layer({ par: 0.44, sh: 1, flat: true });
    const splashes = [640, 700, 1080, 1140].map((x, i) => ({ x, i, el: splashL.add(`<g>${sheet().p(c.cut([[-30, 0], [-20, -30], [-6, -14], [0, -44], [8, -16], [22, -34], [30, 0]], 0.6, 5), '#eef0ee').out(false)}</g>`) }));

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 990, 260, C.moss, C.sage) + bush(c, 1510, 990, 260, C.sage, C.moss));
    K.front();
    storyFrame(S);

    return (t, time) => {
      const T = time;
      /* the weather: fair → storm (v25a) → clearing (v25b) */
      const storm = es(t, 1.02, 1.3) * (1 - es(t, 2.05, 2.4));
      const flashK = Math.max(bump(t, 1.4, 1.5), bump(t, 1.72, 1.8) * 0.8);
      K.set(storm, T, flashK * storm);
      swing(sunEl, 1250, 150 + storm * 700, T, 1, 0.6);
      swing(cl, 520 + Math.sin(T * 0.1) * 20, 150 + storm * 700, T, 1.2, 0.6, 1);
      bowL.fade(es(t, 2.4, 2.7));
      pose(tree, { x: 330, y: 612, r: storm * (-8 + Math.sin(T * 2.3) * 4), ox: 0, oy: 0 });

      /* v24 — stone by stone, then the roof */
      const n = blocks.length;
      blocks.forEach((b) => {
        const a = 0.06 + (b.i / n) * 0.46;
        const k = es(t, a, a + 0.1, ease.out);
        const shake = storm * Math.sin(T * 20 + b.i) * 0.4;
        pose(b.el, { x: HX + b.x + shake, y: HY + b.y - (1 - k) * 260, o: k > 0.01 ? 1 : 0 });
      });
      const dk = es(t, 0.54, 0.62, ease.out), rk2 = es(t, 0.6, 0.72, ease.out);
      pose(door, { x: HX + HP.door.x, y: HY + HP.door.y - (1 - dk) * 200, o: dk > 0.01 ? 1 : 0 });
      pose(win, { x: HX + HP.win.x, y: HY + HP.win.y - (1 - dk) * 200, o: dk > 0.01 ? 1 : 0 });
      pose(roof, { x: HX + HP.roof.x, y: HY + HP.roof.y - (1 - rk2) * 300, o: rk2 > 0.01 ? 1 : 0 });
      pose(lit, { x: HX + HP.win.x, y: HY + HP.win.y, o: es(t, 1.02, 1.15) * (1 - es(t, 2.7, 2.9) * 0.5) });

      /* the builder: taps each stone; goes indoors for the storm; steps out after it */
      const tap = t < 0.72 ? Math.abs(Math.sin(t * 60)) : 0;
      const done = es(t, 0.74, 0.86);
      const goIn = es(t, 1.02, 1.12);
      const out = es(t, 2.42, 2.56);
      const thanks = es(t, 2.58, 2.72);
      const mx = lerp(1010, HX + HP.door.x + 6, goIn);
      man.set({ x: mx, y: HY, s: 0.9, flip: true, walk: goIn > 0 && goIn < 1 ? mx * 0.08 : undefined, armF: 40 + tap * 50 - done * 30, armB: 10 + done * 20, head: -done * 8, o: 1 - es(t, 1.08, 1.12), blink: blinkAt(T, 2) });
      manFree.set({ x: HX + HP.door.x + 30 * out, y: HY, s: 0.9, flip: false, armF: 20 + thanks * 110, armB: 10 + thanks * 150, head: -thanks * 14, o: seg(t, 2.42, 2.46), blink: blinkAt(T, 2) });

      /* the flood: rises in the riverbed and beats on the rock, then drains away */
      const rise = es(t, 1.2, 1.55) * (1 - es(t, 2.15, 2.55));
      floodL.shift(((T * 120) % 150) - 75, (1 - rise) * 300 - Math.sin(T * 1.6) * 8 * rise);
      floodF.shift(95 - ((T * 160) % 190), (1 - rise) * 300 - Math.sin(T * 1.9 + 1) * 10 * rise);
      splashes.forEach((sp) => {
        const k = time ? (T * 0.9 + sp.i * 0.3) % 1 : 0.5;
        pose(sp.el, { x: sp.x + (sp.i < 2 ? 0 : 0), y: FLOOD - 6, sy: Math.sin(k * PI) * 1.4, s: 1, o: rise * Math.sin(k * PI) });
      });

      S.cam.z = 1.04 + es(t, 0.8, 1.1) * 0.02 - storm * 0.02;
      S.cam.y = 30 - es(t, 1.0, 1.3) * 20 + es(t, 2.2, 2.5) * 20;
      S.cam.x = Math.sin(T * 7) * storm * 2;
    };
  },
};
