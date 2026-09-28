// Mt 4,18–20 — morning on the Sea of Galilee. Jesus walks along the beach; two brothers stand in a small boat
// close to shore, and their names come down on tags: Simon called Peter, and Andrew. They cast: the round net
// flies up, opens and falls flat on the water behind the boat, and fish leap. "Come after me, and I will make you
// fishers of men": out of the net rises a chain of paper people holding hands, unfolding on its strings. At once
// they let the net go, jump into the shallows, wade ashore and follow Him along the beach.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, reeds, rock, sun, cloud, town, grass } from '../../assets/nature.js';
import { boat, bird, fish } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { castNet, dollChain, nameTag, hand, headAt, voiceRings, tr, DAY, PI } from './lib.js';

const P = 0.5;
const BX = 560, BY = 700;       // the boat
const SHORE = 772;              // people on the beach
const NX = 834, NY = 636;       // where the net lands
const PAN = 170;

export default {
  id: 'mt4-net',
  beats: [
    { v: 18, text: 'Gdy [Jezus] przechodził obok Jeziora Galilejskiego, ujrzał dwóch braci: Szymona, zwanego Piotrem, i brata jego, Andrzeja,' },
    { v: 18, cont: true, text: 'jak zarzucali sieć w jezioro; byli bowiem rybakami.' },
    { v: 19 },
    { v: 20 },
  ],
  cam: { x: [-40, PAN / P], y: [0, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1250, y: 160, len: 800 });
    const cls = [[500, 150, 200], [1010, 110, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    const gulls = flock(S, hangL, 4, (cc) => bird(cc, { color: C.birdLight, belly: C.cream }), { y: 260, speed: 40, scale: 0.5 });

    /* ---------- far shore, the lake ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 340, 120], color: C.hillFar }).markup);
    const farL = S.layer({ par: 0.14, sh: 2 });
    const fh = hillsWith(c, { y: 486, amps: [14, 6, 2], lens: [900, 300, 100], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 18 });
    farL.add(fh.markup + town(c, { x: 360, y: fh.fn(360) + 6, n: 6, spread: 220, sc: 0.4 }) + town(c, { x: 1320, y: fh.fn(1320) + 6, n: 5, spread: 200, sc: 0.4 }));
    const lakeL = S.layer({ par: P, sh: 3 });
    lakeL.add(waterBand(c, { y: 520, color: C.lake, foamN: 40 }).markup);
    const rip = [0, 1, 2].map(() => lakeL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 70, 70, 0, PI * 2, 30), 3)}" fill="${C.foam}"/></g>`));
    const fishes = [0, 1, 2].map((i) => lakeL.add(`<g opacity="0">${fish(c, { color: i % 2 ? C.lake3 : C.lakeDeep })}</g>`));
    const netEl = lakeL.add(`<g opacity="0">${castNet(c, 92)}</g>`);
    const chain = hanging(lakeL, dollChain(c, 7, { h: 96 }), { x: NX, y: 0, len: 800 });

    /* ---------- the boat with Simon and Andrew ---------- */
    const BL = S.layer({ par: P, sh: 4 });
    const B = boat(c, { hull: C.wood, stripe: C.dustyBlue });
    const bBack = BL.add(`<g>${B.back}</g>`);
    const peterB = S.puppet(BL.add(person(c, { ...CAST.peter })));
    const andrewB = S.puppet(BL.add(person(c, { ...CAST.andrew })));
    const bundle = BL.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 16, 12, 10, 0.25), 0.6, 4), C.rope).x(c.ribbon([[-10, -4], [10, 4]], 1.2) + c.ribbon([[-8, 5], [9, -5]], 1.2), shade(C.rope, -0.25)).out()}</g>`);
    const bFront = BL.add(`<g>${B.front}</g>`);
    // the shallows in front of the hull, the beach
    const W = S.layer({ par: P, sh: 3 });
    const wl = sheet();
    wl.p(c.ridge(c.wave(706, [2.5, 1.2], [160, 60]), -900, 2500, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.45));
    let fl = '';
    for (let x = -900; x < 2500; x += c.rr(40, 90)) fl += c.cut([[x, 707], [x + 20, 704], [x + 42, 707], [x + 20, 709]], 0.2, 6);
    wl.x(fl, C.foam, 'opacity=".7"');
    W.add(wl.out());
    const splash = [0, 1].map(() => W.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 16, -26], [sd * 26, -22], [sd * 10, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`));
    const beach = S.layer({ par: P, sh: 3 });
    const bfn = c.wave(736, [4, 2], [700, 160]);
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
    beach.add(grass(c, { x0: -900, x1: 2500, y: 760, fn: (x) => bfn(x) + 26, n: 30, h: 12, color: C.olive }) + rock(c, 1180, 758, 70, 26, C.rock2) + reeds(c, 170, 752, 9, 100, C.moss));

    /* ---------- on the beach ---------- */
    const PL = S.layer({ par: P, sh: 5 });
    const peter = S.puppet(PL.add(person(c, { ...CAST.peter })));
    const andrew = S.puppet(PL.add(person(c, { ...CAST.andrew })));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.clay, r: 36, w: 5, both: false });

    /* ---------- their names ---------- */
    const TL = S.layer({ par: 0.3, sh: 6 });
    const tagP = hanging(TL, nameTag(c, [tr('Szymon', 'Simon'), tr('zwany Piotrem', 'called Peter')], { size: 19 }), { x: 0, y: 0, len: 800 });
    const tagA = hanging(TL, nameTag(c, tr('Andrzej', 'Andrew'), { size: 19 }), { x: 0, y: 0, len: 800 });

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -200, 980, 14, 230, C.moss) + rock(c, 1500, 985, 260, 100, C.rock));

    const jesusX = (t) => lerp(1300, 960, es(t, 0.02, 0.8, ease.sine)) + es(t, 3.35, 3.98, ease.sine) * 200;

    return (t, time) => {
      swing(sunEl, 1250, 160, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
      gulls(time, 1);

      /* the boat bobs */
      const bob = Math.sin(time * 1.3) * 2;
      pose(bBack, { x: BX, y: BY + bob });
      pose(bFront, { x: BX, y: BY + bob });

      /* v18a: Jesus walks along the shore and sees them; their names come down */
      const jx = jesusX(t), jmov = Math.abs(jesusX(t + 0.02) - jx) > 0.1;
      const call = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.2));
      const turned = t > 3.3;
      jesus.set({ x: jx, y: SHORE, s: 1.05, flip: !turned, walk: jmov ? jx * 0.045 : undefined, armF: 14 + call * 76 + bump(t, 0.7, 1.0) * 20, armB: 8 + call * 40, head: -call * 4, blink: blinkAt(time) });
      const [hx, hy] = headAt(jx, SHORE, 1.05, true);
      voice(hx - 14, hy, call, time, { dir: -1, spread: 2.4 });
      const tk = es(t, 0.35, 0.65, ease.out) * (1 - es(t, 1.2, 1.45, ease.in));
      pose(tagP, { x: 470, y: lerp(-400, 300, tk), r: Math.sin(time * 0.8 + 1) * 1.2, o: tk > 0.01 ? 1 : 0 });
      pose(tagA, { x: 660, y: lerp(-400, 318, es(t, 0.42, 0.72, ease.out) * (1 - es(t, 1.2, 1.45, ease.in))), r: Math.sin(time * 0.8 + 2) * 1.2, o: tk > 0.01 ? 1 : 0 });

      /* v18b: the cast */
      const out = es(t, 3.05, 3.12);
      const wind = es(t, 1.02, 1.2), fling = es(t, 1.2, 1.32);
      const aF = 40 + wind * 110 - fling * 150, lean = -wind * 8 + fling * 12;
      peterB.set({ x: BX - 50, y: BY + bob - 4, s: 1.0, flip: false, o: 1 - out, armF: aF + (t > 2 ? es(t, 2.2, 2.5) * 30 : 0), armB: 20 + wind * 60 - fling * 40, lean, head: -fling * 6 + es(t, 2.1, 2.4) * -4, blink: blinkAt(time, 1) });
      andrewB.set({ x: BX + 80, y: BY + bob - 2, s: 0.98, flip: t < 2.0, o: 1 - out, armF: 30 + bump(t, 1.5, 2.0) * 40 + es(t, 2.2, 2.5) * 30, armB: 20, head: -bump(t, 1.25, 1.6) * 8, blink: blinkAt(time, 2) });
      const [nhx, nhy] = hand(BX - 50, BY + bob - 4, 1.0, false, aF, lean);
      const fly = seg(t, 1.3, 1.62), land = es(t, 1.55, 1.68);
      const nx = lerp(nhx, NX, ease.out(fly)), ny = lerp(nhy, NY, fly) - Math.sin(fly * PI) * 150;
      pose(bundle, { x: nhx, y: nhy, o: t < 1.3 ? 1 : 0, r: 20 });
      const open = ease.out(seg(t, 1.3, 1.55));
      const sink = es(t, 3.2, 3.9);
      pose(netEl, { x: nx, y: ny + sink * 4, s: 0.15 + open * 0.85, sy: (0.15 + open * 0.85) * lerp(0.5, 0.24, land), r: (1 - land) * 12, o: fly > 0 ? 1 - sink * 0.5 : 0 });
      rip.forEach((r, i) => {
        const k = time ? ((time * 0.4 + i / 3) % 1) : (i + 1) / 3.5;
        pose(r, { x: NX, y: NY + 4, s: 0.9 + k * 1.2, sy: 0.24 + k * 0.3, o: bump(t, 1.6, 2.6) * (1 - k) * 0.9 });
      });
      fishes.forEach((f, i) => {
        const k = seg(t, 1.7 + i * 0.1, 2.0 + i * 0.1);
        pose(f, { x: NX - 50 + i * 50 + k * 30, y: NY - Math.sin(k * PI) * 60, r: -40 + k * 80, s: 1.1, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v19: fishers of men — the paper people rise out of the net and unfold */
      const ch = es(t, 2.1, 2.45, ease.out), unfold = es(t, 2.3, 2.7, ease.out), chUp = es(t, 3.1, 3.4, ease.in);
      pose(chain, { x: NX, y: lerp(NY + 10, 440, ch) - chUp * 700, sx: 0.12 + unfold * 0.88, sy: 1, r: Math.sin(time * 0.8) * 1.2 * unfold, o: ch > 0.01 ? 1 : 0 });

      /* v20: they leave the net and follow */
      splash.forEach((sp, i) => pose(sp, { x: i ? BX + 120 : BX - 80, y: 708, s: bump(t, 3.02, 3.22) * 1.2, o: bump(t, 3.02, 3.22) }));
      const wade = es(t, 3.1, 3.4);
      const followK = es(t, 3.36, 3.98, ease.sine);
      const px = lerp(lerp(BX - 50, BX - 10, wade), 960, followK), ax = lerp(lerp(BX + 80, BX + 60, wade), 840, followK);
      const py = lerp(BY + 10, SHORE - 2, wade), ay = lerp(BY + 14, SHORE + 6, wade);
      const moving = (wade > 0 && wade < 1) || (followK > 0 && followK < 1);
      peter.set({ x: px, y: py, s: 1.0, o: out, walk: moving ? px * 0.05 : undefined, armF: 14, blink: blinkAt(time, 1) });
      andrew.set({ x: ax, y: ay, s: 0.98, o: out, walk: moving ? ax * 0.05 + 1 : undefined, armF: 12, blink: blinkAt(time, 2) });

      S.cam.x = (es(t, 3.3, 3.95, ease.sine) * PAN) / P - 20 * (1 - es(t, 0, 0.8));
      S.cam.y = 40;
      S.cam.z = 1.03 + bump(t, 1.0, 2.0) * 0.03;
    };
  },
};
