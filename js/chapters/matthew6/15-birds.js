// Mt 6,26–27 — a valley of fields below the mountain, a granary, an old olive tree. "Look at the birds of the air":
// a flock wheels over the valley. "They do not sow or reap or gather into barns": down in the fields men sow, reap and
// carry sacks into the granary, while the birds only settle in the tree; "and your heavenly Father feeds them": a shaft
// of light falls under the tree, grain glitters in the grass and the birds hop down and peck. "Are you not of more value
// than they?": a balance comes down — a sparrow on one pan, a child on the other, and the child's pan sinks. "Which of
// you by worrying can add a single moment to his life?": a worried man tips a handful of sand onto a great hourglass;
// it runs off the glass, and the sand inside runs on just the same.
import { C, person, blinkAt, pose, lerp, sky, hanging, flap, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, grass, cloud, sun } from '../../assets/nature.js';
import { bird, sickle, sheaf, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SPRING, CHILD, QUIET, manOf, granary, sack, scalesParts, poseScales, worryCloud, secretShaft, hourglass, headAt, handAt, tr, PI } from './lib.js';

const GY = 700;
const TREE = [470, 612];           // the olive where the birds sit
const GRX = 1180;                  // the granary
const BX = 800, BY = 230, ARM = 130;
const HGX = 900, HGY = 470;        // the hourglass (centre)

export default {
  id: 'mt6-birds',
  beats: [
    { v: 26, text: 'Przypatrzcie się ptakom w powietrzu:' },
    { v: 26, cont: true, text: 'nie sieją ani żną i nie zbierają do spichrzów, a Ojciec wasz niebieski je żywi.' },
    { v: 26, cont: true, text: 'Czyż wy nie jesteście ważniejsi niż one?' },
    { v: 27 },
  ],
  cam: { x: [-40, 40], y: [-120, 40], z: [0.98, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, SPRING);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1240, y: 130, len: 900 });
    const cls = [[520, 120, 190], [990, 90, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
    const flyL = S.layer({ par: 0.06, sh: 3 });
    const flockUp = flock(S, flyL, 11, (cc) => bird(cc), { y: 320, spread: 200, speed: 70, scale: 2, x0: 0, x1: 1600 });

    /* the valley */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 3], lens: [1000, 340, 120], color: C.hillFar }).markup);
    const hl = S.layer({ par: 0.2, sh: 3 });
    const hw = hillsWith(c, { y: 500, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 18 });
    hl.add(hw.markup);
    const field = S.layer({ par: 0.4, sh: 3 });
    const fs = sheet();
    fs.p(c.ridge(c.wave(590, [8, 3], [700, 200]), -1100, 2700, 1900, 14, 1), mix(C.wheatGreen, C.hillNear, 0.4));
    let rows = '';
    for (let k = 0; k < 6; k++) rows += c.ribbon([[420, 620 + k * 16], [1700, 626 + k * 18]], 3);
    fs.x(rows, shade(C.wheatGreen, -0.2), 'opacity=".5"');
    fs.p(c.cut([[900, 606], [1060, 604], [1080, 700], [880, 704]], 0.6, 8), C.wheat);
    field.add(fs.out());
    const G = granary(c, { w: 200, h: 170 });
    field.add(`<g transform="translate(${GRX} 640)">${G.body}</g>`);
    field.add(olive(c, TREE[0], TREE[1] + 60, 1.5, { leaf: C.olive, leaf2: C.sage }));
    const seedGlow = field.add(`<g><ellipse rx="110" ry="18" fill="url(#halo-glow)"/>${Array.from({ length: 16 }, () => `<path d="${seedPath(c, c.rr(-80, 80), c.rr(-8, 8), 3.4, c.rr(0, 3))}" fill="${C.wheat2}"/>`).join('')}</g>`);
    const shaftL = S.layer({ par: 0.4, sh: 0, flat: true });
    const shaft = shaftL.add(`<g>${secretShaft(c, { w0: 40, w1: 230, h: 900 })}</g>`);

    /* the workers */
    const act = S.layer({ par: 0.4, sh: 5 });
    const bag = sheet().p(c.cut([[-12, 0], [12, 0], [16, 26], [-16, 26]], 0.4, 4), C.basket).out();
    const sower = S.puppet(act.add(person(c, { ...manOf(c, { robe: C.ochreRobe, mantle: null, belt: C.leather }), holdB: `<g transform="translate(2 4)">${bag}</g>` })));
    const reaper = S.puppet(act.add(person(c, { ...manOf(c, { robe: C.dustyBlue, mantle: null }), pose: 'kneel', holdF: `<g transform="translate(0 8) rotate(-40) scale(.8)">${sickle(c)}</g>` })));
    const carrier = S.puppet(act.add(person(c, { ...manOf(c, { robe: C.sageRobe, mantle: null, belt: C.rope }), holdF: `<g transform="translate(-6 -30) rotate(80)">${sack(c, 40, 50)}</g>` })));
    const sheafEl = act.add(`<g>${sheaf(c, 80)}</g>`);
    const seeds = [0, 1, 2, 3, 4].map(() => act.add(`<path d="${seedPath(c, 0, 0, 3.4, 0.4)}" fill="${C.wheat2}"/>`));
    const BIRDS = [[-60, -150], [10, -170], [70, -140], [-20, -120]].map(([dx, dy], i) => ({ i, dx, dy, el: act.add(bird(c, { k: `pb${i}` })) }));

    /* the balance: a sparrow and a child */
    const balL = S.layer({ par: 0.12, sh: 6 });
    const B = scalesParts(c, { arm: ARM, drop: 80 });
    const kid = person(c, { ...CHILD });
    const els = { frame: balL.add(`<g>${B.frame}</g>`), beam: balL.add(`<g>${B.beam}</g>`), panL: balL.add(`<g>${B.pan}<g transform="translate(0 76) scale(1.1)">${bird(c)}</g></g>`), panR: balL.add(`<g>${B.pan}<g transform="translate(0 80) scale(.42)">${kid}</g></g>`) };

    /* the hourglass and the worried man */
    const hgL = S.layer({ par: 0.4, sh: 6 });
    const hg = hgL.add(`<g>${hourglass(c, 200)}</g>`);
    const sandB = hg.querySelector('.sandB'), sandT = hg.querySelector('.sandT');
    const worried = S.puppet(hgL.add(person(c, { ...QUIET, robe: C.mauve })));
    const clouds = [0, 1].map(() => hgL.add(`<g>${worryCloud(c, 70)}</g>`));
    const grains = Array.from({ length: 8 }, () => hgL.add(`<path d="${c.poly(c.circ(0, 0, 2.6, 6))}" fill="${C.wheat2}"/>`));

    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(grass(c, { x0: -800, x1: 2400, y: 900, n: 60, h: 40, color: C.moss }));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1240, y: 130, r: T ? Math.sin(T * 0.6) : 0 });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + (T ? Math.sin(T * 0.1 + cl.i) * 20 : 0), y: cl.y, r: T ? Math.sin(T * 0.6 + cl.i) : 0 }));
      /* v26a — the flock */
      flockUp(T || 3, es(t, 0.0, 0.2) * (1 - es(t, 1.9, 2.1)));

      /* v26b — they sow, reap and gather; the birds only sit, and are fed */
      const work = t > 0.9 && t < 3;
      const wo = seg(t, 0.9, 0.95) * (1 - es(t, 2.95, 3.1));
      const SXp = lerp(640, 820, es(t, 0.95, 1.9, (u) => u));
      const cast = T ? Math.max(0, Math.sin(T * 3)) : 0.5;
      sower.set({ x: SXp, y: GY - 36, s: 0.78, walk: t > 0.95 && t < 1.9 ? SXp * 0.07 : undefined, armF: 30 + cast * 70, armB: 20, blink: blinkAt(T, 1), o: wo });
      seeds.forEach((sd, i) => {
        const k = T ? (T * 1.5 + i / 5) % 1 : i / 5;
        const [hx, hy] = handAt(SXp, GY - 36, 0.78, false, 90);
        pose(sd, { x: hx + k * 60, y: hy + k * k * 110, o: work ? (1 - k) : 0 });
      });
      const cut = T ? Math.sin(T * 4) : 0;
      reaper.set({ x: 960, y: GY - 40, s: 0.78, armF: 50 + cut * 30, armB: 30, lean: 10, head: 10, blink: blinkAt(T, 4), o: wo });
      pose(sheafEl, { x: 1040, y: GY - 42, o: wo });
      const cx = lerp(1000, GRX - 30, es(t, 1.0, 1.7, (u) => u));
      carrier.set({ x: cx, y: GY - 30, s: 0.8, walk: t > 1.0 && t < 1.7 ? cx * 0.07 : undefined, armF: 150, armB: 150, head: 6, blink: blinkAt(T, 6), o: seg(t, 0.9, 0.95) * (1 - es(t, 1.64, 1.68)) });
      const fed = es(t, 1.4, 1.6);
      pose(shaft, { x: TREE[0] + 20, y: GY - 30, sx: 0.3 + fed * 0.7, o: fed * (1 - es(t, 1.95, 2.15)) });
      pose(seedGlow, { x: TREE[0] + 20, y: GY - 32, o: fed });
      BIRDS.forEach((b) => {
        const land = es(t, 1.0 + b.i * 0.06, 1.3 + b.i * 0.06);
        const hop = es(t, 1.55 + b.i * 0.04, 1.72 + b.i * 0.04);
        const peck = T ? Math.max(0, Math.sin(T * 6 + b.i * 2)) : 0;
        const x = lerp(lerp(TREE[0] - 400 + b.i * 200, TREE[0] + b.dx, land), TREE[0] - 40 + b.i * 34, hop);
        const y = lerp(lerp(160, TREE[1] + b.dy, land), GY - 40, hop) - Math.sin(hop * PI) * 40;
        pose(b.el, { x, y, r: hop >= 1 ? peck * 30 : 0, o: land > 0 ? 1 : 0, sx: b.i % 2 ? -1.1 : 1.1, sy: 1.1 });
        if ((land > 0 && land < 1) || (hop > 0 && hop < 1)) flap(b.el, T); else flap(b.el, 0, 0);
      });

      /* v26c — more than the birds */
      const bk = es(t, 2.02, 2.3, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      const tilt = -es(t, 2.35, 2.6, ease.back) * 14;
      poseScales(els, BX, lerp(-500, BY, bk), -tilt, bk > 0.01 ? 1 : 0, 1, ARM);

      /* v27 — the worried man and the hourglass */
      const hk = es(t, 3.0, 3.25);
      const run = T ? (T * 0.05) % 1 : 0.4;
      pose(hg, { x: HGX, y: HGY, o: hk });
      pose(sandT, { y: -3, sy: 1 - run * 0.6 });
      pose(sandB, { y: 100, sy: 0.4 + run * 0.6 });
      const pour = es(t, 3.3, 3.5);
      worried.set({ x: HGX - 160, y: GY - 10, s: 1.0, armF: 20 + pour * 130, armB: 20 + pour * 60, head: -pour * 14, blink: blinkAt(T, 3), o: hk });
      const [wx, wy] = headAt(HGX - 160, GY - 10, 1.0, false);
      clouds.forEach((cl, i) => pose(cl, { x: wx - 30 + i * 50, y: wy - 70 - i * 20 + (T ? Math.sin(T + i) * 4 : 0), o: hk }));
      grains.forEach((g, i) => {
        const k = T ? (T * 0.9 + i / 8) % 1 : i / 8;
        const x0 = HGX - 40, y0 = HGY - 140;
        pose(g, { x: x0 + i * 4 + k * (i % 2 ? 90 : 60), y: y0 + k * k * 220, o: pour > 0.5 ? 1 - k : 0 });
      });

      S.cam.y = -60 + es(t, 0.8, 1.2) * 70 - es(t, 1.95, 2.2) * 50 + es(t, 2.95, 3.2) * 50;
      S.cam.z = 1.0 + es(t, 0.8, 1.2) * 0.04;
      S.cam.x = -es(t, 1.3, 1.6) * 20 + es(t, 2.95, 3.2) * 30;
    };
  },
};
