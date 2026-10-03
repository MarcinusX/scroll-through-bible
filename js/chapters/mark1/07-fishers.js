// Mk 1,16–20 — along the Sea of Galilee: Simon casts a round net that opens in the air and lands on the water;
// "Come after me — fishers of people" (a hanging plate turns from a fish to a person); they drop the net and follow.
// The camera walks on with Jesus to Zebedee's boat, where James and John mend their nets; they too step out and follow,
// leaving their father waving in the boat with the hired men.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, reeds, rock, sun, cloud, town, grass } from '../../assets/nature.js';
import { boat, bird, fish, ripples } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { ZEBEDEE, hand, headAt, castNet, netDrape, plate, voiceRings } from './lib.js';

const PI = Math.PI;
const P = 0.55;
const SHORE = 774;         // people walking on the beach
const WADE = 700;          // Simon and Andrew in the shallows
const BX = 1870, BY = 668; // Zebedee's boat
const HIRED = { robe: C.ochreRobe, hairStyle: 'wrap', veil: C.linen2, hair: C.hair, beard: 'short', skin: C.skin4, belt: C.leather };
const HIRED2 = { robe: C.stone, hairStyle: 'short', hair: C.hair3, beard: 'full', skin: C.skin3, belt: C.leather };

export default {
  id: 'm1-fishers',
  beats: [
    { v: 16, text: 'Przechodząc obok Jeziora Galilejskiego, ujrzał Szymona i brata Szymonowego, Andrzeja,' },
    { v: 16, cont: true, text: 'jak zarzucali sieć w jezioro; byli bowiem rybakami.' },
    { v: 17 },
    { v: 18 },
    { v: 19, text: 'Idąc dalej, ujrzał Jakuba, syna Zebedeusza, i brata jego Jana,' },
    { v: 19, cont: true, text: 'którzy też byli w łodzi i naprawiali sieci.' },
    { v: 20, text: 'Zaraz ich powołał,' },
    { v: 20, cont: true, text: 'a oni zostawili ojca swego, Zebedeusza, razem z najemnikami w łodzi i poszli za Nim.' },
  ],
  cam: { x: [(560 - 800) / P, (1720 - 800) / P], y: [0, 80], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the camera leans toward the net and the boat, the boat comes closer
    const BXP = PH ? 1745 : BX, DB = BX - BXP;
    const K = PH ? 0.8 : 1;   // phone: the crew sits closer together in the boat
    sky(S, ['#c2dcd8', '#e8ecd9', '#f5ebd1']);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1250, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 520, y: 150, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1050, y: 110, len: 700 });
    const gulls = flock(S, hangL, 4, (cc) => bird(cc, { color: C.birdLight, belly: C.cream }), { y: 260, speed: 45, scale: 0.5 });

    /* ---------- the far shore ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 340, 120], color: C.hillFar, x0: -900, x1: 3200 }).markup);
    const far = S.layer({ par: 0.14, sh: 2 });
    const fh = hillsWith(c, { y: 486, amps: [14, 6, 2], lens: [900, 300, 100], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 18, x0: -900, x1: 3200 });
    far.add(fh.markup + town(c, { x: 300, y: fh.fn(300) + 6, n: 6, spread: 220, sc: 0.4 }) + town(c, { x: 1350, y: fh.fn(1350) + 6, n: 5, spread: 200, sc: 0.4 }));

    /* ---------- the lake ---------- */
    const L = S.layer({ par: P, sh: 3 });
    L.add(waterBand(c, { y: 530, color: C.lake, foamN: 40, x0: -900, x1: 3400 }).markup);
    const rip = [0, 1, 2].map(() => L.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 70, 70, 0, PI * 2, 30), 3)}" fill="${C.foam}"/></g>`));
    const fishes = [0, 1, 2].map((i) => L.add(`<g opacity="0">${fish(c, { color: i % 2 ? C.lake3 : C.lakeDeep })}</g>`));

    /* ---------- Simon & Andrew in the shallows, the net ---------- */
    const W = S.layer({ par: P, sh: 4 });
    const simonW = S.puppet(W.add(person(c, { ...CAST.peter })));
    const andrewW = S.puppet(W.add(person(c, { ...CAST.andrew, holdB: `<g transform="translate(0 6)">${sheet().p(c.cut([[-16, -8], [16, -8], [12, 14], [-12, 14]], 0.4, 4), C.basket).x(c.ribbon([[-14, 0], [14, 0]], 2), shade(C.basket, -0.25)).out()}</g>` })));
    const netEl = W.add(`<g>${castNet(c, 92)}</g>`);
    const bundle = W.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 16, 12, 10, 0.25), 0.6, 4), C.rope).x(c.ribbon([[-10, -4], [10, 4]], 1.2) + c.ribbon([[-8, 5], [9, -5]], 1.2), shade(C.rope, -0.25)).out()}</g>`);

    /* ---------- Zebedee's boat ---------- */
    const B = boat(c, { mast: true, hull: C.wood, stripe: C.dustyBlue });
    const boatG = W.add(`<g>
      <g>${B.back}</g>
      <g data-k="zeb">${person(c, { ...ZEBEDEE, pose: 'sit' })}</g>
      <g data-k="h1">${person(c, HIRED)}</g>
      <g data-k="h2">${person(c, HIRED2)}</g>
      <g data-k="jamesB">${person(c, { ...CAST.james, pose: 'sit' })}</g>
      <g data-k="johnB">${person(c, { ...CAST.john, pose: 'sit' })}</g>
      <g>${B.front}</g>
      <g transform="translate(-10 -34)">${netDrape(c, 200, 50)}</g>
    </g>`);
    const pz = (k) => S.puppet(S.$(k).firstElementChild);
    const zeb = pz('zeb'), h1 = pz('h1'), h2 = pz('h2'), jamesB = pz('jamesB'), johnB = pz('johnB');

    /* ---------- water in front of the legs, the beach ---------- */
    const wl = sheet();
    wl.p(c.ridge(c.wave(652, [2.5, 1.2], [160, 60]), -900, 3400, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.45));
    let fl = '';
    for (let x = -900; x < 3400; x += c.rr(40, 90)) fl += c.cut([[x, 653], [x + 20, 650], [x + 42, 653], [x + 20, 655]], 0.2, 6);
    wl.x(fl, C.foam, 'opacity=".7"');
    W.add(wl.out());
    const splash = [0, 1].map(() => W.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 16, -26], [sd * 26, -22], [sd * 10, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`));
    const beach = S.layer({ par: P, sh: 3 });
    const bfn = c.wave(716, [5, 2], [700, 160]);
    beach.add(sheet().p(c.ridge(bfn, -900, 3400, 1700, 12, 1), C.sand).out());
    beach.add(grass(c, { x0: -900, x1: 3400, y: 740, fn: (x) => bfn(x) + 30, n: 40, h: 12, color: C.olive }) + rock(c, 480, 740, 60, 22, C.rock2) + rock(c, 2100, 745, 80, 28));
    // a drying net on poles and baskets further along the beach
    beach.add(`<g transform="translate(330 732)">${sheet().p(c.ribbon([[-70, 0], [-70, -110]], 5) + c.ribbon([[70, 0], [70, -110]], 5), C.wood2).out()}<g transform="translate(0 -108)">${netDrape(c, 140, 70, C.rope)}</g></g>`);

    /* ---------- on the beach: Jesus and the followers ---------- */
    const PL = S.layer({ par: P, sh: 5 });
    const simon = S.puppet(PL.add(person(c, { ...CAST.peter })));
    const andrew = S.puppet(PL.add(person(c, { ...CAST.andrew })));
    const james = S.puppet(PL.add(person(c, { ...CAST.james })));
    const john = S.puppet(PL.add(person(c, { ...CAST.john })));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.clay, r: 36, w: 5, both: false });

    /* ---------- "fishers of people": a plate that turns ---------- */
    const PT = S.layer({ par: 0.3, sh: 6 });
    const fishIcon = `<g transform="scale(1.6)">${fish(c, { color: C.lake3 })}</g>`;
    const manIcon = `<g transform="translate(0 50) scale(.44)">${person(c, { ...CAST.peter })}</g>`;
    const plateEl = hanging(PT, `<g data-k="pl">${plate(c, `<g data-k="plFish">${fishIcon}</g><g data-k="plMan" opacity="0">${manIcon}</g>`, { r: 56, fill: '#e7f0ec', rim: C.lake2 })}</g>`, { x: 900, y: 250, len: 700 });
    const plG = S.$('pl'), plFish = S.$('plFish'), plMan = S.$('plMan');

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -300, 960, 14, 230, C.moss) + rock(c, 380, 985, 240, 90, C.rock2) + reeds(c, 1400, 965, 12, 220, C.moss) + rock(c, 2100, 980, 260, 100, C.rock) + reeds(c, 2700, 960, 14, 230, C.moss));

    const jesusX = (t) => {
      if (t < 0.95) return lerp(360, 760, es(t, 0.02, 0.95, ease.sine));
      if (t < 3.6) return 760;
      if (t < 4.9) return lerp(760, 1540, es(t, 3.6, 4.9, ease.sine));
      if (t < 7.55) return 1540;
      return lerp(1540, PH ? 1550 : 1580, es(t, 7.55, 7.98));
    };

    return (t, time) => {
      swing(sunEl, 1250, 160, time, 1, 0.6);
      swing(cl1, 520 + Math.sin(time * 0.1) * 20, 150, time, 1.2, 0.6, 1);
      swing(cl2, 1050 + Math.sin(time * 0.12 + 1) * 20, 110, time, 1.2, 0.7, 2);
      gulls(time, 1);

      const jx = jesusX(t), jmov = Math.abs(jesusX(t + 0.02) - jx) > 0.1;
      const call1 = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.2));
      const call2 = es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.2));
      const faceLeft = false;
      jesus.set({ x: jx, y: SHORE, s: 1.05, flip: faceLeft, walk: jmov ? jx * 0.045 : undefined, armF: 14 + call1 * 76 + call2 * 76, armB: 8 + call1 * 30 + call2 * 30, head: -call1 * 4 - call2 * 4, blink: blinkAt(time) });
      const [hx, hy] = headAt(jx, SHORE, 1.05);
      voice(hx + 14, hy, Math.max(call1, call2), time, { dir: 1, spread: 2.4 });

      /* v16: Simon casts the net, Andrew holds the basket */
      const out = es(t, 3.0, 3.1);                        // they step out of the water (puppet swap)
      const wind = es(t, 1.02, 1.2), fling = es(t, 1.2, 1.32);
      const turn = es(t, 2.1, 2.2);
      simonW.set({ x: 950, y: WADE, s: 1.02, flip: turn > 0.5, o: 1 - out, armF: 40 + wind * 110 - fling * 150 + turn * 30, armB: 20 + wind * 60 - fling * 40, lean: -wind * 8 + fling * 12, head: -fling * 6, blink: blinkAt(time, 1) });
      andrewW.set({ x: 1068, y: WADE, s: 1.0, flip: turn > 0.5, o: 1 - out, armF: 20 + bump(t, 1.5, 2.0) * 40, armB: 30, head: -bump(t, 1.25, 1.6) * 8, blink: blinkAt(time, 2) });
      // net: a bundle in the hand, thrown, opening in the air, landing flat on the water
      const [nhx, nhy] = hand(950, WADE, 1.02, false, 40 + wind * 110 - fling * 150, -wind * 8 + fling * 12);
      const fly = seg(t, 1.3, 1.62), land = es(t, 1.55, 1.68);
      const tx = PH ? 1165 : 1190, ty = 600;
      const nx = lerp(nhx, tx, ease.out(fly)), ny = lerp(nhy, ty, fly) - Math.sin(fly * PI) * 150;
      pose(bundle, { x: nhx, y: nhy, o: t < 1.3 ? seg(t, -0.1, 0) : 0, r: 20 });
      const open = ease.out(seg(t, 1.3, 1.55));
      pose(netEl, { x: nx, y: ny, s: 0.15 + open * 0.85, sy: (0.15 + open * 0.85) * lerp(0.5, 0.26, land), r: (1 - land) * 12, o: fly > 0 ? 1 : 0 });
      rip.forEach((r, i) => {
        const k = time ? ((time * 0.4 + i / 3) % 1) : (i + 1) / 3.5;
        pose(r, { x: tx, y: ty + 4, s: 0.9 + k * 1.2, sy: 0.24 + k * 0.3, o: bump(t, 1.6, 2.6) * (1 - k) * 0.9 });
      });
      fishes.forEach((f, i) => {
        const k = seg(t, 1.75 + i * 0.12, 2.05 + i * 0.12);
        pose(f, { x: tx - 50 + i * 50 + k * 30, y: ty - Math.sin(k * PI) * 60, r: -40 + k * 80, s: 1.1, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v17: the plate turns from a fish into a person */
      const pIn = es(t, 2.1, 2.35, ease.out), pOut = es(t, 3.3, 3.6, ease.in);
      swing(plateEl, 900, lerp(-380, 250, pIn) - pOut * 700, time, 1.2, 0.8);
      fade(plateEl, pIn > 0 ? 1 : 0);
      const spin = es(t, 2.45, 2.75);
      pose(plG, { sx: Math.cos(spin * PI) });
      fade(plFish, spin < 0.5 ? 1 : 0); fade(plMan, spin >= 0.5 ? 1 : 0);
      pose(plMan, { sx: -1 });

      /* v18: they leave the net and follow */
      splash.forEach((sp, i) => pose(sp, { x: i ? 1068 : 950, y: 654, s: bump(t, 3.0, 3.2) * 1.2, o: bump(t, 3.0, 3.2) }));
      const approach = es(t, 3.1, 3.5);
      const sBase = lerp(950, 880, approach), aBase = lerp(1068, 990, approach);
      const FS = PH ? 95 : 125, FA = PH ? 168 : 235;   // phone: Simon and Andrew follow closer behind
      const sx = Math.max(sBase, jx - FS), ax = Math.max(aBase, jx - FA);
      const sMov = Math.abs(Math.max(lerp(950, 880, es(t + 0.02, 3.1, 3.5)), jesusX(t + 0.02) - FS) - sx) > 0.1;
      const aMov = Math.abs(Math.max(lerp(1068, 990, es(t + 0.02, 3.1, 3.5)), jesusX(t + 0.02) - FA) - ax) > 0.1;
      simon.set({ x: sx, y: SHORE - 4, s: 1.02, flip: jx < sx - 10, o: out, walk: sMov ? sx * 0.05 : undefined, armF: 14, blink: blinkAt(time, 1) });
      andrew.set({ x: ax, y: SHORE + 4, s: 1.0, flip: jx < ax - 10, o: out, walk: aMov ? ax * 0.05 : undefined, armF: 12, blink: blinkAt(time, 2) });

      /* v19: James and John in the boat mending the nets; Zebedee at the stern */
      const bob = Math.sin(time * 1.3) * 2;
      pose(boatG, { x: BXP, y: BY + bob, s: 1.12, r: Math.sin(time * 0.9) * 0.6 });
      const mend = (k) => 50 + Math.sin(time * 5 + k) * 18;
      const look = es(t, 4.7, 4.9);
      const leave = es(t, 7.05, 7.12);
      jamesB.set({ x: -60 * K, y: -16, s: 0.95, o: 1 - leave, armF: mend(0) * (1 - look * 0.6) + look * 10, armB: 30, head: 8 - look * 8, blink: blinkAt(time, 3), flip: look > 0.5 });
      johnB.set({ x: 20 * K, y: -16, s: 0.95, o: 1 - leave, armF: mend(2) * (1 - look * 0.6) + look * 10, armB: 26, head: 10 - look * 10, blink: blinkAt(time, 4), flip: look > 0.5 });
      const wave = es(t, 7.45, 7.65);
      zeb.set({ x: -140 * K, y: -16, s: 0.95, armF: 30 + bump(t, 7.1, 7.5) * 40 + wave * 60, armB: 20 + wave * (110 + Math.sin(time * 6) * 20), head: -wave * 6, flip: true, blink: blinkAt(time, 5) });
      h1.set({ x: 110 * K, y: 2, s: 0.9, flip: true, armF: 40 + Math.sin(time * 1.3) * 6, armB: 60, blink: blinkAt(time, 6) });
      h2.set({ x: 160 * K, y: 2, s: 0.88, flip: true, armF: 30 + bump(t, 7.2, 7.8) * 30, armB: 20, head: 4, blink: blinkAt(time, 7) });

      /* v20: they step out of the boat and fall in behind */
      const walk2 = es(t, 7.15, 7.75);
      const jmx = lerp(1690 - DB, 1225, walk2), jnx = lerp(1780 - DB, 1115, walk2);
      const moving2 = walk2 > 0 && walk2 < 1;
      const fin = es(t, 7.55, 7.98);
      james.set({ x: jmx + fin * 80, y: lerp(784, SHORE + 2, walk2), s: 1.0, flip: moving2, o: leave, walk: moving2 || (fin > 0 && fin < 1) ? jmx * 0.05 : undefined, blink: blinkAt(time, 3) });
      john.set({ x: jnx + fin * 80, y: lerp(790, SHORE + 6, walk2), s: 0.98, flip: moving2, o: leave, walk: moving2 || (fin > 0 && fin < 1) ? jnx * 0.05 : undefined, blink: blinkAt(time, 4) });

      /* camera walks along the shore with Jesus */
      let cx;
      const C1 = PH ? 900 : 860, C2 = PH ? 1660 : 1690, C3 = PH ? 1440 : 1480;
      if (t < 1) cx = lerp(640, C1, es(t, 0, 1));
      else if (t < 3.6) cx = C1;
      else if (t < 4.95) cx = lerp(C1, C2, es(t, 3.6, PH ? 4.7 : 4.95, ease.sine));
      else if (t < 7.1) cx = C2;
      else cx = lerp(C2, C3, es(t, 7.1, 7.9));
      S.cam.x = (cx - 800) / P;
      S.cam.y = 60;
      S.cam.z = 1.04 + bump(t, 1.0, 2.0) * 0.03;
    };
  },
};
