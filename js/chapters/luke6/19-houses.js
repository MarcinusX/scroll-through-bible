// Łk 6,48–49 — the last parable, one painted flat by a river, the ground cut away in front like a stage trap so we see
// what lies under the two houses: brown earth, and deep down the grey rock. "He is like a man building a house, who dug
// deep and laid the foundation on the rock": the first builder digs — the slabs of earth come up one by one until the
// trench reaches the rock — sets the foundation stones on the rock, and raises his house on them, stone by stone, and
// the roof. "When the flood came, the stream burst against that house and could not shake it, for it was well built":
// the sky darkens, the river comes over its banks from the left and throws itself against the walls — the house stands,
// its window lit. "But the one who hears and does not do is like a man who built a house on the ground without a
// foundation": after the storm his neighbour throws up a house in no time right on the bare earth and lounges before it.
// "The stream burst against it, and at once it fell, and great was its ruin": the flood comes again, the house on the
// earth breaks apart and is swept away in pieces — while the house on the rock still stands.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waveStrip, sun, cloud, reeds, olive, cypress, bush } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { houseParts, stormKit, WISE, FOOL, kf, moving, storyFrame, halo, PI } from './lib.js';

const GY = 612;          // the ground surface
const ROCK = 740;        // the top of the rock, deep down
const WX = 600, FX = 1015;
const FLOOD = 578;       // how high the flood comes

function spade(c) { return sheet().p(c.ribbon([[0, 0], [0, 150]], 5), C.wood).p(c.cut([[-12, 150], [12, 150], [10, 180], [0, 188], [-10, 180]], 0.3, 4), C.stone2).out(); }

export default {
  id: 'lk6-houses',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 48, text: 'Podobny jest do człowieka, który buduje dom: wkopał się głęboko i fundament założył na skale.' },
    { v: 48, cont: true, text: 'Gdy przyszła powódź, potok wezbrany uderzył w ten dom, ale nie zdołał go naruszyć, ponieważ był dobrze zbudowany.' },
    { v: 49, text: 'Lecz ten, kto słucha, a nie wypełnia, podobny jest do człowieka, który zbudował dom na ziemi bez fundamentu.' },
    { v: 49, cont: true, text: '[Gdy] potok uderzył w niego, od razu runął, a upadek jego był wielki».' },
  ],
  cam: { x: [-40, 40], y: [-30, 70], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfe1dc', '#f1e7cc', '#f8e9cd']);
    const K = stormKit(S);
    K.back();
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 700, y: 140, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(hillsWith(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 }).markup);
    // the river, far behind on the left, bending away
    const riv = S.layer({ par: 0.22, sh: 2 });
    riv.add(sheet().p(c.ribbon([[-400, 560], [0, 548], [220, 540], [420, 532], [640, 520], [900, 512]], (u) => 60 - u * 44), C.lake).out() + reeds(c, 120, 560, 8, 60) + reeds(c, 330, 548, 6, 50));

    /* the ground, cut away in front: earth, and the rock deep down; the trench under the first house */
    const G = S.layer({ par: 0.4, sh: 3 });
    const E = sheet();
    const EC = mix(C.soil, C.clay, 0.45);
    E.p(c.cut([[-900, GY - 40], [2500, GY - 40], [2500, GY + 6], [-900, GY + 6]], 0.8, 16), mix(C.hillNear, C.sand, 0.35));
    E.p(c.cut([[-900, GY], [2500, GY], [2500, ROCK + 6], [-900, ROCK + 6]], 1, 20), EC);
    let strata = '';
    for (let i = 0; i < 3; i++) strata += c.ribbon([[-900, GY + 34 + i * 34], [2500, GY + 34 + i * 34 + c.rr(-5, 5)]], 2.4);
    E.x(strata, shade(EC, -0.14), 'opacity=".6"');
    E.p(c.cut([[-900, ROCK], [2500, ROCK - 4], [2500, 1800], [-900, 1800]], 1.4, 12), C.rock2);
    let cracks = '';
    for (let i = 0; i < 14; i++) { const x = c.rr(-400, 2000); cracks += c.ribbon([[x, ROCK + c.rr(20, 60)], [x + c.rr(-30, 30), ROCK + c.rr(80, 160)]], 2); }
    E.x(cracks, shade(C.rock2, -0.25), 'opacity=".6"');
    G.add(E.out());
    // the trench (dark), revealed as the slabs come out
    G.add(sheet().p(c.cut(c.rect(WX - 124, GY, 248, ROCK - GY + 2), 0.6, 8), mix(C.soilDark, C.night2, 0.2)).out());
    G.add(olive(c, 760, GY - 30, 0.8) + cypress(c, 1400, GY - 34, 120) + bush(c, 1300, GY - 20, 90, C.sage, C.moss));
    const pile = G.add(`<g>${sheet().p(c.cut([[-60, 0], ...c.arc(0, 0, 60, 38, PI, 2 * PI, 12), [60, 0]], 0.8, 6), EC).out()}</g>`);

    /* the slabs of earth dug out, the foundation stones */
    const W = S.layer({ par: 0.4, sh: 4 });
    const slabs = [0, 1, 2].map((i) => ({ i, el: W.add(`<g>${sheet().p(c.cut(c.rect(-124, 0, 248, (ROCK - GY) / 3 + 1), 0.8, 10), EC).x(c.ribbon([[-120, 20], [120, 18]], 2.4), shade(EC, -0.14), 'opacity=".6"').out()}</g>`) }));
    const FOUND = [];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) FOUND.push({ r, k, x: WX - 93 + k * 62 + (r % 2) * 10 - 5, y: ROCK - 20 - r * 42, el: W.add(`<g>${sheet().p(c.cut(c.rect(-30, -20, 60, 40), 0.9, 6), mix(C.stone, C.stone2, (r + k) % 2 ? 0.2 : 0.7)).out()}</g>`) });
    const lightW = W.add(`<g opacity="0">${halo(60, 0.8)}</g>`);

    /* the two houses */
    const HP1 = houseParts(c, { w: 220, h: 150 });
    const H1 = { blocks: HP1.blocks.map((b, i) => ({ ...b, i, el: W.add(`<g>${b.m}</g>`) })), door: W.add(`<g>${HP1.door.m}</g>`), win: W.add(`<g>${HP1.win.m}</g>`), lit: W.add(`<g opacity="0">${HP1.win.lit}</g>`), roof: W.add(`<g>${HP1.roof.m}</g>`) };
    const HP2 = houseParts(c, { w: 210, h: 140, wall: mix(C.clay, C.sand, 0.45), wall2: mix(C.clay, C.sand2, 0.3), roofCol: C.wood3 });
    const H2 = { blocks: HP2.blocks.map((b, i) => ({ ...b, i, el: W.add(`<g>${b.m}</g>`), dx: c.rr(30, 190), dr: c.rr(-200, 200) })), door: W.add(`<g>${HP2.door.m}</g>`), win: W.add(`<g>${HP2.win.m}</g>`), roof: W.add(`<g>${HP2.roof.m}</g>`) };
    const wise = S.puppet(W.add(person(c, { ...WISE, holdF: `<g transform="rotate(-30)">${spade(c)}</g>` })));
    const fool = S.puppet(W.add(person(c, FOOL)));
    const foolSit = S.puppet(W.add(person(c, { ...FOOL, pose: 'sit' })));

    /* the flood: two strips of water above the ground, coming from the left */
    const floodL = S.layer({ par: 0.42, sh: 3, pad: 1600 });
    floodL.add(waveStrip(c, { y: FLOOD, len: 150, amp: 16, color: mix(C.lake2, C.wood3, 0.3), crest: '#f4f1e6', x0: -2400, x1: 2600, bottom: GY + 4 }));
    const splashL = S.layer({ par: 0.42, sh: 1, flat: true });
    const drops = Array.from({ length: 24 }, (_, i) => ({ i, a: -PI * (0.12 + ((i % 12) / 11) * 0.76), v: c.rr(90, 170), el: splashL.add(`<path d="${c.cut(c.ell(0, 0, c.rr(5, 9), c.rr(4, 6), 8), 0.3, 3)}" fill="#eef2f0"/>`) }));
    const floodF = S.layer({ par: 0.44, sh: 4, pad: 1600 });
    floodF.add(waveStrip(c, { y: FLOOD + 22, len: 200, amp: 18, color: mix(C.lake3, C.wood2, 0.3), crest: '#f4f1e6', x0: -2400, x1: 2600, bottom: GY + 8 }));
    K.front({ par: 0.9 });
    storyFrame(S);

    const place = (H, hx, t0, t1, t) => {
      const n = H.blocks.length;
      H.blocks.forEach((b) => {
        const a = t0 + (b.i / n) * (t1 - t0) * 0.8;
        const k = es(t, a, a + (t1 - t0) * 0.2, ease.out);
        pose(b.el, { x: hx + b.x, y: GY + b.y - (1 - k) * 240, o: k > 0.01 ? 1 : 0 });
      });
    };

    return (t, time) => {
      const T = time;
      /* storms: the first flood (v48b) and the second (v49b) */
      const storm = es(t, 1.0, 1.2) * (1 - es(t, 1.85, 2.05)) + es(t, 3.0, 3.15);
      const flashK = Math.max(bump(t, 1.25, 1.33), bump(t, 1.6, 1.66) * 0.7, bump(t, 3.2, 3.28), bump(t, 3.42, 3.5) * 0.8);
      K.set(storm, T, flashK * storm);
      swing(sunEl, 1230, 150 + storm * 700, T, 1, 0.6);
      swing(cl, 700 + Math.sin(T * 0.1) * 20, 140 + storm * 700, T, 1.2, 0.6, 1);

      /* v48a — he digs deep, down to the rock, lays the foundation, builds */
      slabs.forEach((s) => {
        const k = es(t, 0.04 + s.i * 0.1, 0.14 + s.i * 0.1);
        const y0 = GY + s.i * ((ROCK - GY) / 3);
        pose(s.el, { x: lerp(WX, WX + 215, k), y: lerp(y0, GY - 30, k) - Math.sin(k * PI) * 60, s: 1 - k * 0.7, r: k * 20, o: 1 - es(t, 0.12 + s.i * 0.1, 0.16 + s.i * 0.1) });
      });
      pose(pile, { x: WX + 215, y: GY, sy: 0.2 + es(t, 0.1, 0.36) * 0.8, o: 1 });
      FOUND.forEach((f, i) => {
        const k = es(t, 0.36 + i * 0.018, 0.42 + i * 0.018, ease.out);
        pose(f.el, { x: f.x, y: f.y - (1 - k) * 150, o: k > 0.01 ? 1 : 0 });
      });
      pose(lightW, { x: WX, y: ROCK - 10, s: 2.2, sx: 1.8, o: bump(t, 0.34, 0.66) * 0.7 });
      place(H1, WX, 0.58, 0.9, t);
      const shake1 = storm > 0.5 && t < 2 ? Math.sin(T * 30) * 0.6 : 0;
      pose(H1.door, { x: WX + HP1.door.x, y: GY + HP1.door.y, o: es(t, 0.84, 0.88) });
      pose(H1.win, { x: WX + HP1.win.x + shake1, y: GY + HP1.win.y, o: es(t, 0.84, 0.88) });
      pose(H1.lit, { x: WX + HP1.win.x, y: GY + HP1.win.y, o: es(t, 1.1, 1.3) * (1 - es(t, 2.1, 2.3)) + es(t, 3.05, 3.2) });
      const rk = es(t, 0.88, 0.97, ease.out);
      pose(H1.roof, { x: WX + HP1.roof.x, y: GY + HP1.roof.y - (1 - rk) * 260, o: rk > 0.01 ? 1 : 0 });
      const wK = [[-0.5, WX + 190], [0.05, WX + 158], [0.4, WX + 158], [0.95, WX + 158], [1.1, WX + 140]];
      const dig = t < 0.4 ? Math.abs(Math.sin(t * 40)) : 0;
      wise.set({ x: kf(t, wK), y: GY, s: 0.96, flip: true, armF: 30 + dig * 50, armB: 20 + dig * 40, head: 12 * (t < 0.95 ? 1 : 0), lean: dig * 10, o: 1 - es(t, 1.05, 1.15), blink: blinkAt(T, 2) });

      /* the flood (twice) */
      const come1 = es(t, 1.1, 1.4), go1 = es(t, 1.8, 2.05);
      const come2 = es(t, 3.05, 3.3);
      const come = t < 2.5 ? come1 * (1 - go1) : come2;
      const off = t < 2.5 ? lerp(-2400, 0, come1) + go1 * 2600 : lerp(-2400, 300, come2);
      floodL.shift(off + (time ? ((T * 180) % 150) - 75 : 0), (1 - come) * 40 - (time ? Math.sin(T * 1.7) * 6 * come : 0));
      floodF.shift(off + 100 - (time ? ((T * 220) % 200) : 100), (1 - come) * 50 - (time ? Math.sin(T * 2 + 1) * 8 * come : 0));
      floodL.fade(come > 0.01 || (t > 1.1 && t < 2.1) ? 1 : 0);
      floodF.fade(come > 0.01 || (t > 1.1 && t < 2.1) ? 1 : 0);
      drops.forEach((d) => {
        const first = d.i < 12;
        const hx = first ? WX - 110 : FX - 105;
        const t0 = first ? 1.38 : 3.28;
        const k = time ? ((T * 0.9 + (d.i % 4) * 0.25) % 1) : seg(t, t0 + (d.i % 4) * 0.08, t0 + 0.4 + (d.i % 4) * 0.08);
        const on = first ? bump(t, 1.38, 1.9) : bump(t, 3.28, 3.7);
        pose(d.el, { x: hx + Math.cos(d.a) * d.v * k * 1.3, y: FLOOD - 10 + Math.sin(d.a) * d.v * k + 160 * k * k, o: on > 0.05 && k > 0 && k < 1 ? on : 0 });
      });

      /* v49a — the other builds on the bare earth, and lounges */
      place(H2, FX, 2.05, 2.45, t);
      const burst = es(t, 3.3, 3.95, (u) => u);
      H2.blocks.forEach((b) => {
        if (burst <= 0) return;
        const my = es(burst, (3 - b.r) * 0.06 + (b.i % 3) * 0.03, 0.3 + (3 - b.r) * 0.08 + (b.i % 3) * 0.04, ease.in);
        const drift = es(burst, 0.2, 1, (u) => u);
        pose(b.el, { x: FX + b.x + drift * b.dx + my * b.x * 0.5, y: lerp(GY + b.y, FLOOD - 12 - (b.i % 3) * 9, my) + Math.sin(T * 2 + b.i) * 4 * drift, r: my * b.dr * 0.6, o: 1 });
      });
      const dk = es(t, 2.4, 2.45);
      pose(H2.door, { x: FX + HP2.door.x + burst * 160, y: lerp(GY + HP2.door.y, FLOOD + 10, es(burst, 0.05, 0.4)), r: es(burst, 0.05, 0.4) * 80, o: dk * (1 - es(burst, 0.6, 0.9)) });
      pose(H2.win, { x: FX + HP2.win.x + burst * 120, y: lerp(GY + HP2.win.y, FLOOD + 20, es(burst, 0.05, 0.4)), r: -es(burst, 0.05, 0.4) * 40, o: dk * (1 - es(burst, 0.3, 0.5)) });
      const rk2 = es(t, 2.42, 2.5, ease.out);
      pose(H2.roof, { x: FX + HP2.roof.x + es(burst, 0.1, 1) * 150, y: lerp(GY + HP2.roof.y, FLOOD - 6, es(burst, 0, 0.45, ease.in)) - (1 - rk2) * 300 + Math.sin(T * 2) * 4 * burst, r: es(burst, 0, 0.45) * 22, o: rk2 > 0.01 ? 1 : 0 });
      const build = t > 2.0 && t < 2.5;
      const lounge = es(t, 2.52, 2.56) * (1 - es(t, 3.08, 3.12));
      const run = es(t, 3.12, 3.5, (u) => u);
      foolSit.set({ x: FX + 30, y: GY + 4, s: 0.96, flip: true, armF: 150, armB: 150, head: -6, o: lounge, blink: blinkAt(T, 3) });
      const fx = build ? FX + 140 - Math.sin(t * 30) * 20 : lerp(FX + 30, 1170, run);
      const aghast = es(t, 3.5, 3.65);
      fool.set({ x: fx, y: GY, s: 0.96, flip: run > 0 && aghast < 0.5 ? false : true, walk: build || (run > 0 && run < 1) ? fx * 0.08 : undefined, amt: 1.4, armF: build ? 60 + Math.abs(Math.sin(t * 50)) * 60 : 40 + aghast * 110, armB: build ? 20 : 30 + aghast * 150, head: aghast * 6, o: (t > 1.98 ? 1 : 0) * (1 - lounge), blink: blinkAt(T, 3) });

      S.cam.x = kf(t, [[-0.5, -10], [0.9, -10], [1.9, 0], [2.2, 10], [3.0, 10], [3.3, 10]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.3, 1.08], [0.9, 1.06], [2.9, 1.06], [3.3, 1.02]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.3, 60], [0.9, 30], [3.3, 20]]);
    };
  },
};
