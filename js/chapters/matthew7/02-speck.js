// Mt 7,3–5 — a painted flat of a carpenter's yard, gently comic. One brother has a long plank sticking out of his
// eye and doesn't notice it (a sparrow even lands on it); he peers at the tiny speck in his brother's eye, which a
// big lens on a string shows for everyone. "Let me take the speck out": he comes at him with tweezers, and the plank
// knocks his brother's cap off. "First take the beam out of your own eye": he tugs it out and tosses it on the
// woodpile, his eye clears — and now he can gently take out the speck.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix, flap } from '../kit.js';
import { band, sun, cloud, grass, flowers, bush } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { BRO_A, BRO_B, VILLAGE, eyeAt, handAt, plank, speck, tweezers, magnifier, speech, sparkle, storyFrame, tr, PI } from './lib.js';
import { workbench, saw } from '../mark6/lib.js';

const GY = 742;
const SC = 1.25;
const BX = 992;
const BASE = -19;          // the plank's tilt

export default {
  id: 'mt7-speck',
  enter: 'fly',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-20, 40], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, VILLAGE);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1220, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 640, y: 150, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);

    /* the yard: a plastered wall with a door, the woodpile, the bench */
    const yard = S.layer({ par: 0.3, sh: 3 });
    const w = sheet();
    w.p(c.cut([[-900, 360], [2500, 360], [2500, 700], [-900, 700]], 1, 14), mix(C.plaster, C.parchment, 0.3));
    w.p(c.cut([[-900, 346], [2500, 346], [2500, 364], [-900, 364]], 0.6, 14), C.roof);
    let bricks = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-400, 2000), y = c.rr(390, 660); bricks += c.cut(c.rect(x, y, c.rr(30, 60), 14), 0.4, 6); }
    w.x(bricks, C.plaster2, 'opacity=".5"');
    w.p(c.cut([[1270, 700], [1270, 520], ...c.arc(1320, 520, 50, 36, PI, 2 * PI, 10), [1370, 520], [1370, 700]], 0.5, 6), C.wood2);
    w.x(c.ribbon([[1280, 600], [1360, 600]], 3), shade(C.wood2, -0.3), 'opacity=".6"');
    w.p(c.cut(c.rect(440, 440, 60, 50), 0.4, 5), C.soilDark);
    yard.add(w.out());
    // a vine along the top of the wall, pegs with a coil of rope and a mallet
    const vn = sheet();
    const vpts = []; for (let x = -200; x <= 1800; x += 40) vpts.push([x, 374 + Math.sin(x / 90) * 10]);
    vn.p(c.ribbon(vpts, 4), C.wood2);
    let lv = '', lv2 = '';
    for (let x = -180; x < 1800; x += c.rr(26, 44)) { const y = 374 + Math.sin(x / 90) * 10; const l = c.cut(c.blob(x, y + c.rr(4, 16), c.rr(12, 18), c.rr(9, 13), 9, 0.2), 0.5, 4); if (c.chance(0.5)) lv += l; else lv2 += l; }
    vn.p(lv, C.leaf).p(lv2, C.moss);
    let gb = '';
    [[300, 400], [620, 398], [1080, 402], [1440, 396]].forEach(([x, y]) => { for (let r = 0; r < 4; r++) for (let i = 0; i <= 3 - r; i++) gb += c.cut(c.circ(x + (i - (3 - r) / 2) * 8, y + r * 7, 4.4, 8), 0.1, 2); });
    vn.p(gb, mix(C.plumRobe, C.indigo, 0.2));
    yard.add(vn.out());
    const pegs = sheet();
    pegs.p(c.cut(c.circ(250, 470, 5, 8), 0.2, 3) + c.cut(c.circ(330, 472, 5, 8), 0.2, 3), C.wood2);
    let coil = '';
    for (let i = 0; i < 4; i++) coil += c.ribbon(c.arc(250, 502, 20 - i * 2, 28 - i * 2, 0, PI * 2, 18), 2.4);
    pegs.p(coil, C.rope);
    pegs.p(c.ribbon([[330, 472], [340, 540]], 5), C.wood).p(c.cut(c.rect(322, 536, 36, 20), 0.3, 4), C.wood2);
    yard.add(pegs.out());
    yard.add(bush(c, 1450, 700, 120, C.sage, C.moss) + bush(c, 160, 700, 100, C.moss, C.sage));
    // the woodpile of long planks on the left
    const pile = sheet();
    for (let i = 0; i < 5; i++) pile.p(c.cut([[180 + i * 6, 700 - i * 18], [470 - i * 4, 700 - i * 18], [474 - i * 4, 684 - i * 18], [176 + i * 6, 684 - i * 18]], 0.5, 8), i % 2 ? C.wood3 : mix(C.wood3, C.wood, 0.4));
    yard.add(pile.out());

    const floor = S.layer({ par: 0.4, sh: 3 });
    const f = sheet().p(c.ridge(c.wave(700, [3, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.4));
    let sh = '';
    for (let i = 0; i < 16; i++) { const x = c.rr(200, 1400); sh += c.ribbon(c.arc(x, c.rr(720, 800), c.rr(4, 8), c.rr(3, 5), 0, PI * 1.6, 8), 2); }
    f.x(sh, C.wood3);
    floor.add(f.out());
    floor.add(`<g transform="translate(1180 716) scale(.9)">${workbench(c, 220)}</g><g transform="translate(1130 640) rotate(-8)">${saw(c)}</g>`);

    /* the brothers */
    const act = S.layer({ par: 0.5, sh: 5 });
    const tossed = act.add(`<g>${plank(c, 300, 26)}</g>`);
    const A = S.puppet(act.add(person(c, BRO_A)));
    const B = S.puppet(act.add(person(c, BRO_B)));
    const Bk = S.puppet(act.add(person(c, { ...BRO_B, pose: 'kneel' })));
    const capEl = act.add(`<g>${sheet().p(c.cut([[-20, 0], ...c.arc(0, 0, 20, 15, PI, 2 * PI, 12), [20, 0], [16, 4], [-16, 4]], 0.4, 4), C.terracotta).p(c.ribbon([[-19, 0], [19, 0]], 4), C.sun).out()}</g>`);
    const plankEl = act.add(`<g>${plank(c, 300, 26)}</g>`);
    const speckEl = act.add(`<g>${speck(c, 4)}</g>`);
    const tw = act.add(`<g>${tweezers(c, 44)}</g>`);
    const glint = act.add(`<g>${sparkle(c, 16, C.star)}</g>`);
    const sparrow = act.add(bird(c, { color: shade(C.wood3, -0.2), belly: C.cream }));

    /* from the flies: the big lens, A's words */
    const fly = S.layer({ par: 0.5, sh: 6 });
    const lens = hanging(fly, `<g transform="translate(0 40)">${magnifier(c, 46)}</g>`, { x: 0, y: 0, len: 900 });
    const bigSpeck = fly.add(`<g><circle r="46" fill="#fff" opacity=".35"/><g transform="scale(3.2)">${speck(c, 4)}</g></g>`);
    const words = fly.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.ink}">${tr('Pozwól…', 'Let me…')}</text><g transform="translate(-6 -2) rotate(-20) scale(.5)"></g>`, { w: 96, h: 44 })}</g>`);

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 980, 240, C.moss, C.sage) + bush(c, 1520, 990, 260, C.sage, C.moss));
    fg.add(grass(c, { x0: -300, x1: 1900, y: 930, n: 30, h: 26, color: C.moss }));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 150, T, 1, 0.6);
      swing(cl, 640 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* where A stands: 610 → (v4) 730 → (v5) back a step, then in to 846 */
      const step1 = es(t, 1.12, 1.42), back = es(t, 2.36, 2.48), step2 = es(t, 2.52, 2.7);
      const ax = 610 + step1 * 100 - back * 30 + step2 * 166;
      const walking = (step1 > 0 && step1 < 1) || (step2 > 0 && step2 < 1);
      const peer = es(t, 0.2, 0.45) * (1 - es(t, 1.0, 1.15));
      const grab = es(t, 2.04, 2.2) * (1 - es(t, 2.4, 2.5));
      const tug = bump(t, 2.2, 2.3) + bump(t, 2.28, 2.38);
      const reach1 = es(t, 1.12, 1.4) * (1 - es(t, 1.9, 2.02));
      const reach2 = es(t, 2.55, 2.72);
      const aLean = peer * 5 + reach1 * 6 - tug * 6 - bump(t, 2.36, 2.5) * 8 + reach2 * 4;
      const aHead = -peer * 2 + reach1 * 8 - tug * 6 + reach2 * 2;
      const aArmF = 20 + peer * 70 + reach1 * 92 + grab * 80 + reach2 * 90;
      A.set({ x: ax, y: GY, s: SC, walk: walking ? ax * 0.05 : undefined, armF: aArmF, armB: 10 + grab * 70, head: aHead, lean: aLean, blink: t > 2.45 ? blinkAt(T, 2) : 0 });

      /* B: ducks under the plank (v4), then stands still for the speck (v5) */
      const duck = seg(t, 1.3, 1.36) * (1 - seg(t, 2.0, 2.06));
      const cower = es(t, 1.3, 1.45) * (1 - es(t, 1.95, 2.05));
      const bHead = duck ? 10 : es(t, 2.6, 2.75) * 4;
      const bLean = duck ? -6 : 0;
      B.set({ x: BX, y: GY, s: SC, flip: true, o: 1 - duck, armF: 20, armB: 10, head: bHead, blink: blinkAt(T, 5) });
      Bk.set({ x: BX + 10, y: GY, s: SC, flip: true, o: duck, armF: 30 + cower * 60, armB: 10 + cower * 150, head: 10, lean: -6, blink: blinkAt(T, 5) });

      /* the plank in A's eye (until it comes out) */
      const [ex, ey] = eyeAt(ax, GY, SC, false, aHead, 0, aLean);
      const pull = es(t, 2.3, 2.4);
      const out = seg(t, 2.4, 2.41);
      const ang = BASE + aHead + aLean;
      const ra = (ang * PI) / 180;
      pose(plankEl, { x: ex + Math.cos(ra) * pull * 60 - 2, y: ey + Math.sin(ra) * pull * 60, r: ang, s: 1, o: 1 - out });
      // tossed on the woodpile
      const toss = es(t, 2.4, 2.56, ease.out);
      pose(tossed, { x: lerp(ex + Math.cos(ra) * 60, 176, toss), y: lerp(ey + Math.sin(ra) * 60, 612, toss) - Math.sin(toss * PI) * 120, r: lerp(ang, 360 + 0, toss), o: out });

      /* the sparrow lands on the plank's end — and flies off when he moves */
      const land = es(t, 0.4, 0.62), off = es(t, 1.12, 1.4);
      const tipX = ex + Math.cos(ra) * 170, tipY = ey + Math.sin(ra) * 170 - 14;
      const bxp = lerp(lerp(1240, tipX, land), 1500, off), byp = lerp(lerp(260, tipY, land), 200, off) - Math.sin(off * PI) * 60;
      pose(sparrow, { x: bxp, y: byp, s: 0.9, sx: off > 0 ? 1 : -1, o: land > 0.01 && off < 1 ? 1 : 0 });
      flap(sparrow, land > 0 && land < 1 || off > 0 ? T * 1.6 : 0.2, land > 0.98 && off <= 0 ? 4 : 26);

      /* B's cap: knocked off by the plank */
      const [cx, cy] = eyeAt(BX, GY, SC, true, 0, 0, 0, -2, -18);
      const fall = es(t, 1.34, 1.66, ease.in);
      pose(capEl, { x: lerp(cx, 1170, fall), y: lerp(cy, 760, fall) - Math.sin(fall * PI) * 50, r: fall * 200 + bHead * -1, s: SC * 0.9 });

      /* the speck in B's eye */
      const [bex, bey] = duck ? eyeAt(BX + 10, GY, SC, true, 10, 46, -6, 12, -2.5) : eyeAt(BX, GY, SC, true, bHead, 0, 0, 12, -2.5);
      const pluck = es(t, 2.74, 2.9);
      pose(speckEl, { x: bex - pluck * 50, y: bey + 1 - pluck * 10, s: SC, o: 1 - es(t, 2.92, 3.0) });

      /* the big lens (v3) */
      const lk = es(t, 0.22, 0.45, ease.out) * (1 - es(t, 1.0, 1.15, ease.in));
      const lx = bex - 76, ly = lerp(-500, bey - 150, lk);
      pose(lens, { x: lx, y: ly, r: Math.sin(T * 0.9) * 1.5, o: lk > 0.01 ? 1 : 0 });
      pose(bigSpeck, { x: lx, y: ly + 40, s: lk, o: lk > 0.5 ? 1 : 0 });

      /* v4 — "Let me take the speck out": the tweezers; v5 — he sees clearly and takes it out */
      const wk = es(t, 1.05, 1.22, ease.back) * (1 - es(t, 1.62, 1.72));
      const [hx0, hy0] = eyeAt(ax, GY, SC, false, aHead, 0, aLean, 20, -20);
      pose(words, { x: hx0 + 6, y: hy0 - 6, s: wk, o: wk > 0.01 ? 1 : 0 });
      const [hx, hy] = handAt(ax, GY, SC, false, aArmF, aLean);
      const hasTw = es(t, 1.1, 1.2) * (1 - seg(t, 2.0, 2.05)) + seg(t, 2.52, 2.56);
      pose(tw, { x: hx + 2, y: hy - 2, r: -14, s: SC, o: hasTw });
      const see = bump(t, 2.44, 2.62);
      pose(glint, { x: ex + 4, y: ey - 4, s: see * 1.3, r: T * 80, o: see });

      S.cam.z = 1.02 + es(t, 0.1, 0.4) * 0.06 + es(t, 2.5, 2.8) * 0.04;
      S.cam.x = es(t, 0.1, 0.4) * 20 + es(t, 2.5, 2.8) * 16;
      S.cam.y = 20 + es(t, 0.1, 0.4) * 20;
    };
  },
};
