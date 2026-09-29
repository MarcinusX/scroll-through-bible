// Mt 13,47–50 — the dragnet, a painted flat of the sea cut open like an aquarium: fish of every kind swim under
// the surface. Two boats let the net down between them and sweep it through the water, and the fish crowd into it.
// Full, it is hauled up onto the beach; the fishermen sit down beside it and sort the catch — good fish into baskets
// and jars, the spoiled grey ones thrown away. So at the end of the age: the sky turns to gold, angels come down and
// part the dark figures from among the righteous on the shore, leading them away to the glowing furnace, where the
// smoke rises; the righteous stay in the light.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, rock, palm, waveStrip } from '../../assets/nature.js';
import { fish } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  boatIn, placeBoat, dragnet, badFish, storeJar, basket, FISHERS, angel, firePit, shadowPerson, throng, storyFrame, kf, arcAt, HARVEST, PI,
} from './lib.js';

const SEA = 500;                 // the water's surface
const SHORE = 540;               // the top of the sand bank
const FEETY = 660;               // where people stand on the beach
const PIT = [330, 704];

export default {
  id: 'mt13-net',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 47 },
    { v: 48, text: 'Gdy się napełniła, wyciągnęli ją na brzeg' },
    { v: 48, cont: true, text: 'i usiadłszy, dobre zebrali w naczynia, a złe odrzucili.' },
    { v: 49 },
    { v: 50 },
  ],
  cam: { x: [-60, 60], y: [0, 110], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, ['#c9dfdd', '#eceadb', '#f6ecd6']);
    const gold = sky(S, HARVEST, { name: 'gold' }).layer;
    gold.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1220, y: 170, len: 800 });
    const cl = hanging(hangL, cloud(c, 180), { x: 560, y: 150, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);

    /* the sea cut open, the beach on the left */
    const stage = S.layer({ par: 0.45, sh: 3 });
    const st = sheet();
    const surf = [];
    for (let x = -900; x <= 2600; x += 20) surf.push([x, SEA + Math.sin(x * 0.03) * 2]);
    st.p(c.cut([...surf, [2600, 1700], [-900, 1700]], 0.5, 12), C.lake);
    st.p(c.cut([[-900, SEA + 90], [2600, SEA + 80], [2600, 1700], [-900, 1700]], 0.8, 14), C.lake2);
    st.p(c.cut([[-900, SEA + 200], [2600, SEA + 190], [2600, 1700], [-900, 1700]], 0.8, 14), C.lake3);
    let weeds = '';
    for (let i = 0; i < 14; i++) { const x = c.rr(1000, 2200), h = c.rr(40, 90); weeds += c.ribbon(c.qbez([x, 830], [x + c.rr(-20, 20), 830 - h * 0.5], [x + c.rr(-14, 14), 830 - h], 6), (u) => 4 - u * 3); }
    st.p(weeds, mix(C.moss2, C.teal2, 0.4));
    st.p(c.ridge(c.wave(830, [8, 4], [400, 120]), -900, 2600, 1700, 12, 1), mix(C.sand2, C.lake3, 0.3));
    st.x(c.ribbon(surf, 2.4), C.foam, 'opacity=".8"');
    // the sand bank of the shore, sloping down under the water
    const bank = [[-900, SHORE], [560, SHORE - 2], [640, SHORE + 6], [700, SHORE + 30], [820, 640], [960, 760], [1060, 850], [1200, 1700], [-900, 1700]];
    st.p(c.cut(bank, 0.8, 10), C.sand);
    st.p(c.cut([[700, SHORE + 30], [820, 640], [960, 760], [1060, 850], [1120, 1100], [1000, 1100], [880, 800], [760, 680]], 0.6, 8), mix(C.sand, C.lake2, 0.3));
    let peb = '';
    for (let i = 0; i < 30; i++) { const x = c.rr(-600, 620); peb += c.cut(c.blob(x, c.rr(SHORE + 20, 900), c.rr(4, 9), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
    st.x(peb, C.stone2, 'opacity=".7"');
    stage.add(st.out());
    stage.add(palm(c, 100, SHORE + 20, 240) + rock(c, 660, SHORE + 30, 60, 22, C.rock2) + grass(c, { x0: -800, x1: 560, y: SHORE, n: 20, h: 14, color: C.olive }));

    /* the fish of every kind */
    const fishL = S.layer({ par: 0.45, sh: 2 });
    const KINDS = [C.lake3, C.clay, C.ochre, C.dustyBlue, C.roseRobe, C.sageRobe, C.plumRobe, C.wheat2];
    const FISH = Array.from({ length: 16 }, (_, i) => {
      const bad = i % 5 === 3;
      const cc = makeCutter('mt13-fish-' + i);
      const m = bad ? badFish(cc) : fish(cc, { color: KINDS[i % KINDS.length] });
      return { i, bad, x0: cc.rr(1050, 1750), y0: cc.rr(SEA + 60, 800), sp: cc.rr(0.6, 1.2) * (i % 2 ? 1 : -1), ph: cc.rr(0, 6), s: cc.rr(0.9, 1.3), el: fishL.add(`<g>${m}</g>`), bx: 420 + (i % 6) * 22 + cc.rr(-6, 6), by: FEETY - 26 - Math.floor(i / 6) * 11 };
    });

    /* the boats and the net */
    const boatsL = S.layer({ par: 0.45, sh: 4 });
    const B1 = boatIn(boatsL, c, () => S.puppet(boatsL.add(person(c, FISHERS[0]))));
    const B2 = boatIn(boatsL, c, () => S.puppet(boatsL.add(person(c, FISHERS[1]))));
    const net = boatsL.add(`<g>${dragnet(c, 520, 200)}</g>`);
    let mesh = '';
    for (let i = -6; i <= 6; i++) mesh += c.ribbon([[i * 18 - 20, -64], [i * 18 + 20, 4]], 1.3) + c.ribbon([[i * 18 + 20, -64], [i * 18 - 20, 4]], 1.3);
    const catchNet = boatsL.add(`<g><path d="${c.cut(c.blob(0, -30, 130, 36, 16, 0.12), 0.8, 6)}" fill="${mix(C.rope, C.lake2, 0.25)}" opacity=".55"/><path d="${mesh}" fill="${C.rope}" opacity=".9"/><path d="${c.ribbon(c.arc(0, -30, 130, 36, 0, PI * 2, 30), 3)}" fill="${C.rope}"/></g>`);

    /* the beach: fishermen, baskets and jars, the angels' sorting */
    const beachL = S.layer({ par: 0.5, sh: 5 });
    const pit = firePit(c, 240);
    const pitEl = beachL.add(`<g>${pit.pit}</g>`);
    const flames = pit.flames.map((f, i) => ({ ...f, i, el: beachL.add(`<g>${f.m}</g>`) }));
    const smoke = [0, 1, 2].map((i) => ({ i, el: beachL.add(`<path d="${c.cut(c.blob(0, 0, 28, 18, 10, 0.3), 0.8, 4)}" fill="${mix(C.storm, C.stone2, 0.4)}" opacity="0"/>`) }));
    const bask = beachL.add(`<g>${basket(c, { w: 60, h: 36 })}</g>`);
    const jars = [0, 1].map((i) => beachL.add(`<g>${storeJar(c, 54 - i * 8, i ? C.clay : C.pot)}</g>`));
    const FS = FISHERS.map((o, i) => ({ i, stand: S.puppet(beachL.add(person(c, o))), sit: S.puppet(beachL.add(person(c, { ...o, pose: 'sit' }))), seed: c.rr(0, 6) }));
    // at the end: the righteous in the light, the dark figures led away
    const righteous = beachL.sprite(throng('mt13-net-right', 6, { s: 0.78, spread: 44, rows: 2, arms: [10, 50], head: [-12, -4], dy: 18 }), 560, 712);
    const lightR = beachL.add(`<ellipse cx="0" cy="-80" rx="170" ry="120" fill="url(#halo-glow)"/>`);
    const DARK = [0, 1, 2].map((i) => ({ i, el: beachL.add(`<g>${shadowPerson(makeCutter('mt13-dk' + i), { hairStyle: ['short', 'wrap', 'curly'][i] }, ['#3f3647', '#453b4e', '#3a3243'][i])}</g>`) }));
    const ANG = [0, 1, 2].map((i) => ({ i, p: S.puppet(beachL.add(angel(makeCutter('mt13-nang' + i), { hair: [C.wheat2, C.hair2, C.ochre][i] }))) }));

    const fg = S.layer({ par: 0.8, sh: 6, pad: 200 });
    fg.add(waveStrip(c, { y: 930, len: 180, amp: 12, color: mix(C.lake2, C.lake3, 0.5) }));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      const g = es(t, 3.0, 3.4);
      gold.fade(g);
      swing(sunEl, 1220, 170 + g * 40, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);
      fg.shift((T * 16) % 180 - 90);

      /* v47 — the net let down and swept through the sea */
      const drop = es(t, 0.05, 0.35);
      const sweep = es(t, 0.3, 0.85);
      const haul = es(t, 1.05, 1.6);
      const bx1 = lerp(980, 900, sweep) - haul * 110, bx2 = lerp(1460, 1280, sweep) - haul * 320;
      const bob = Math.sin(T * 1.4) * 2;
      placeBoat(B1, bx1, SEA + 8 + bob, 0.62, Math.sin(T * 1.1));
      placeBoat(B2, bx2, SEA + 8 - bob, 0.62, -Math.sin(T * 1.1));
      const pull = bump(t, 0.3, 0.9);
      B1.inside.set({ x: bx1 - 6, y: SEA - 10 + bob, s: 0.6, flip: false, armF: 60 + pull * 50, armB: 40 + pull * 40, lean: pull * 8, blink: blinkAt(T) });
      B2.inside.set({ x: bx2 - 6, y: SEA - 10 - bob, s: 0.6, flip: true, armF: 60 + pull * 50, armB: 40 + pull * 40, lean: -pull * 8, blink: blinkAt(T, 2) });
      const nx = (bx1 + bx2) / 2, ny = SEA + 4;
      pose(net, { x: nx, y: ny, sx: (bx2 - bx1) / 520, sy: 0.2 + drop * 0.8 - haul * 0.4, o: drop > 0.01 && haul < 0.5 ? 1 : 0 });
      const onBeach = es(t, 1.35, 1.7);
      pose(catchNet, { x: lerp(nx, 470, onBeach), y: lerp(SEA + 150, FEETY - 4, onBeach), s: lerp(1.3, 1, onBeach), o: es(t, 1.1, 1.3) * (1 - es(t, 2.85, 3.0)) });

      /* the fish: swimming, caught, landed, sorted */
      FISH.forEach((f) => {
        const swim = Math.sin(T * 0.5 * f.sp + f.ph);
        const wx = f.x0 + swim * 60, wy = f.y0 + Math.sin(T * 0.8 + f.ph) * 8;
        const caught = es(t, 0.35 + (f.i % 5) * 0.08, 0.8 + (f.i % 5) * 0.06);
        const netx = nx + ((f.i % 6) - 2.5) * 34, nety = SEA + 90 + Math.floor(f.i / 6) * 34;
        let x = lerp(wx, netx, caught), y = lerp(wy, nety, caught);
        const land = onBeach;
        x = lerp(x, f.bx, land); y = lerp(y, f.by, land);
        const sort = seg(t, 2.05 + (f.i % 8) * 0.07, 2.3 + (f.i % 8) * 0.07);
        let r = caught > 0.99 ? (f.i % 2 ? 20 : -20) : 0, o = 1, sc = f.s * (1 - land * 0.25);
        if (sort > 0) {
          const [tx, ty] = f.bad ? [900, SEA + 30] : f.i % 3 === 0 ? [668, FEETY - 70] : [600, FEETY - 40];
          const [ax, ay] = arcAt(ease.io(sort), [x, y], [tx, ty], f.bad ? 120 : 70);
          x = ax; y = ay; r = sort * (f.bad ? 400 : 200);
          o = sort > 0.96 ? 0 : 1;
        }
        const flipX = f.sp > 0 ? 1 : -1;
        pose(f.el, { x, y, s: sc, sx: caught < 0.5 ? flipX : 1, r, o: o * (1 - es(t, 2.95, 3.05)) });
      });

      /* v48 — hauled ashore, they sit down and sort */
      const sitK = es(t, 1.95, 2.05);
      FS.forEach((f) => {
        const x = [330, 440, 690][f.i], y = FEETY + 16 + (f.i === 1 ? 10 : 0);
        const come = es(t, 1.0 + f.i * 0.05, 1.3 + f.i * 0.05);
        const sx = lerp(-200 - f.i * 80, x, come);
        const tug = bump(t, 1.35, 1.75);
        f.stand.set({ x: sx, y, s: 0.82, flip: false, o: (1 - sitK) * (1 - es(t, 2.9, 3.05)), walk: come > 0 && come < 1 ? sx * 0.06 : undefined, armF: 60 + tug * 40, armB: 40 + tug * 30, lean: -tug * 10, blink: blinkAt(T, f.seed) });
        f.sit.set({ x, y, s: 0.82, flip: f.i === 2, o: sitK * (1 - es(t, 2.9, 3.05)), armF: 40 + bump(t, 2.05 + f.i * 0.1, 2.5 + f.i * 0.1) * 60, armB: 20, head: 10, blink: blinkAt(T, f.seed) });
      });
      pose(bask, { x: 600, y: FEETY + 4, o: es(t, 1.9, 2.0) * (1 - es(t, 2.9, 3.05)) });
      jars.forEach((j, i) => pose(j, { x: 650 + i * 36, y: FEETY + 2, o: es(t, 1.9, 2.0) * (1 - es(t, 2.9, 3.05)) }));

      /* v49–50 — at the end of the age: the angels part the wicked from the righteous */
      const ppl = es(t, 3.0, 3.2);
      righteous.set({ x: 560, y: 712, o: ppl });
      pose(lightR, { x: 560, y: 712, s: 0.6 + es(t, 3.4, 3.8) * 0.6, o: es(t, 3.3, 3.7) });
      const lead = es(t, 3.4, 3.9);
      const inPit = es(t, 4.1, 4.5);
      DARK.forEach((d) => {
        const x0 = 500 + d.i * 56;
        const x = lerp(lerp(x0, PIT[0] + 60 + d.i * 30, lead), PIT[0] + (d.i - 1) * 30, inPit);
        const y = lerp(716 + (d.i % 2) * 14, PIT[1] + 6, inPit);
        pose(d.el, { x, y, s: 0.74 * (1 - inPit * 0.5), sx: lead > 0.05 ? -1 : 1, o: ppl * (1 - inPit) });
      });
      ANG.forEach((a) => {
        const down = es(t, 3.05 + a.i * 0.08, 3.35 + a.i * 0.08, ease.out);
        const home = [[430, 650], [520, 626], [700, 640]][a.i];
        const walkL = a.i < 2 ? lead * 130 : 0;
        const x = lerp(760 + a.i * 90, home[0] - walkL, down);
        const y = lerp(180, home[1], down);
        a.p.set({ x, y, s: 0.72, flip: a.i < 2, o: es(t, 3.0, 3.1), armF: 60 + (a.i < 2 ? lead * 50 : 40), armB: 40 + (a.i < 2 ? lead * 60 : 90), blink: blinkAt(T, a.i) });
      });
      const pitOn = es(t, 3.9, 4.2);
      pose(pitEl, { x: PIT[0], y: PIT[1], s: 0.8 + pitOn * 0.2, o: pitOn });
      flames.forEach((f) => {
        const k = 1 + Math.sin(T * 8 + f.i * 1.7) * 0.12;
        pose(f.el, { x: PIT[0] + f.x * 0.8, y: PIT[1] + f.y, sx: 0.8 / k, sy: k * pitOn * 0.9, o: pitOn });
      });
      smoke.forEach((sm) => {
        const k = ((T * 0.2 + sm.i / 3) % 1);
        pose(sm.el, { x: PIT[0] + Math.sin(k * 4 + sm.i) * 24, y: PIT[1] - 60 - k * 260, s: 0.6 + k * 1.2, o: es(t, 4.2, 4.5) * (1 - k) * 0.6 });
      });

      S.cam.x = kf(t, [[0, 60], [0.9, 40], [1.3, -40], [2.9, -40], [3.2, -60], [4.0, -60]]);
      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.06], [1.3, 1.12], [2.0, 1.2], [2.9, 1.2], [3.2, 1.08], [4.0, 1.1]]);
      S.cam.y = kf(t, [[0, 60], [0.9, 70], [1.3, 60], [2.0, 90], [2.9, 90], [3.2, 60], [4.0, 70]]);
    };
  },
};
