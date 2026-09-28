// Mt 7,16 — a painted flat of a hillside garden: a thorn bush and thistles on the left, a vine on its trellis and
// a fig tree heavy with fruit on the right. "By their fruits you will know them": two preachers hold covered
// baskets; the cloths fly up — the true one's is full of grapes and figs, the fleece-wearer's of thorns and thistle
// heads. "Do you gather grapes from thorns?": a harvester reaches into the thorn bush — ouch — and into the thistle
// for figs — ouch again — and stands with an empty basket, looking over at the vine and the fig tree.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers, bush } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { NOON, PROPHET, TRUE_P, manOf, handAt, thistle, trellisVine, figTree, figsRow, contentBasket, basketCloth, heapBasket, sparkle, glowDisc, storyFrame, PI } from './lib.js';

const GY = 722;

export default {
  id: 'mt7-thorns',
  enter: 'fly',
  beats: [
    { v: 16, text: 'Poznacie ich po ich owocach.' },
    { v: 16, cont: true, text: 'Czy zbiera się winogrona z ciernia, albo z ostu figi?' },
  ],
  cam: { x: [-40, 40], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, NOON);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 140, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [800, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 20 }).markup);

    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(640, [5, 2], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.3)).p(c.ridge(c.wave(GY - 4, [3, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.soil, 0.12)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 640, n: 40, h: 12, color: C.olive }));
    // the thorn bush and the thistles on the left, the vine and the fig tree on the right
    ground.add(`<g transform="translate(470 ${GY + 2}) scale(1.45)">${thornBush(c, -14, 0, 110)}${thornBush(c, 16, 0, 96)}</g>`);
    ground.add(`<g transform="translate(626 ${GY + 2}) scale(1.3)">${thistle(c, 118)}</g><g transform="translate(680 ${GY + 4}) scale(1.05)">${thistle(c, 110)}</g>`);
    ground.add(`<g transform="translate(1010 ${GY + 2})">${trellisVine(c, 230, 176)}</g>`);
    const F = figTree(c, 0.78);
    let fg = '';
    [[-70, -175], [-30, -150], [10, -190], [60, -160], [90, -185], [-90, -150], [30, -210]].forEach(([x, y]) => { fg += `<g transform="translate(${x} ${y})">${figsRow(c, 1, 9)}</g>`; });
    ground.add(`<g transform="translate(1250 ${GY + 2})">${F.trunk}${F.leaves}${fg}</g>`);
    ground.add(flowers(c, { x0: 700, x1: 950, y: GY + 8, n: 8, h: 14 }));

    /* the two preachers with their covered baskets; the harvester */
    const act = S.layer({ par: 0.5, sh: 5 });
    const glow = act.add(`<g>${glowDisc(90, 'warm-glow', 1)}</g>`);
    const falseP = S.puppet(act.add(person(c, PROPHET)));
    const trueP = S.puppet(act.add(person(c, TRUE_P)));
    const bF = act.add(`<g>${contentBasket(c, 'thorns', 76)}</g>`);
    const bT = act.add(`<g>${contentBasket(c, 'fruit', 76)}</g>`);
    const HO = manOf(c, { robe: C.wheatRobe, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather });
    const harv = S.puppet(act.add(person(c, HO)));
    const hBasket = act.add(`<g>${heapBasket(c, 60, { fill: false })}</g>`);
    const ouch = [0, 1].map(() => act.add(`<g>${sparkle(c, 14, C.terracotta)}</g>`));

    const fly = S.layer({ par: 0.5, sh: 6 });
    const cloths = [0, 1].map((i) => hanging(fly, `<g transform="translate(0 0)">${basketCloth(c, 76, i ? C.linen2 : C.stone)}</g>`, { x: 0, y: 0, len: 900 }));

    const fgL = S.layer({ par: 0.85, sh: 7 });
    fgL.add(bush(c, 100, 990, 260, C.moss, C.sage) + bush(c, 1510, 990, 260, C.sage, C.moss));
    storyFrame(S);

    const FPX = 700, TPX = 900;
    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 150, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1);

      /* v16a — the cloths come off: fruit … and thorns */
      const lift = es(t, 0.22, 0.45, ease.in);
      const show = es(t, 0.4, 0.55);
      const leave = es(t, 1.0, 1.25, (u) => u);
      const fx = FPX - leave * 520, tx = TPX + leave * 560;
      falseP.set({ x: fx, y: GY, s: 1.12, flip: leave > 0, walk: leave > 0 && leave < 1 ? fx * 0.06 : undefined, armF: 36 + show * 20, armB: 10 + show * 30, head: 2, o: 1 - es(t, 1.15, 1.25), blink: blinkAt(T, 3) });
      trueP.set({ x: tx, y: GY, s: 1.12, flip: leave <= 0, walk: leave > 0 && leave < 1 ? tx * 0.06 : undefined, armF: 36 + show * 30, armB: 10, head: -show * 6, o: 1 - es(t, 1.15, 1.25), blink: blinkAt(T, 5) });
      const [ax, ay] = handAt(fx, GY, 1.12, leave > 0, 36 + show * 20);
      const [bx, by] = handAt(tx, GY, 1.12, leave <= 0, 36 + show * 30);
      pose(bF, { x: ax + (leave > 0 ? -4 : 4), y: ay + 28, s: 1, o: 1 - es(t, 1.15, 1.25) });
      pose(bT, { x: bx + (leave > 0 ? 4 : -4), y: by + 28, s: 1, o: 1 - es(t, 1.15, 1.25) });
      pose(glow, { x: bx, y: by + 6, s: 0.8 + show * 0.5, o: show * (1 - es(t, 1.0, 1.15)) });
      cloths.forEach((cl2, i) => {
        const [px, py] = i ? [bx - 4, by + 28] : [ax + 4, ay + 28];
        pose(cl2, { x: px, y: lerp(py, -500, lift), r: lift * (i ? 20 : -20), o: lift < 0.99 ? 1 : 0 });
      });

      /* v16b — grapes from thorns? figs from thistles? */
      const enter = es(t, 1.04, 1.24);
      const toThistle = es(t, 1.44, 1.56);
      const hx = lerp(300, 560, enter) + toThistle * 20;
      const hFlip = t >= 1.22 && t < 1.44;
      const reach1 = es(t, 1.24, 1.32) * (1 - seg(t, 1.34, 1.38));
      const reach2 = es(t, 1.56, 1.62) * (1 - seg(t, 1.64, 1.68));
      const jerk = bump(t, 1.34, 1.46) + bump(t, 1.64, 1.78);
      const lookR = es(t, 1.8, 1.95);
      const walking = (enter > 0 && enter < 1) || (toThistle > 0 && toThistle < 1);
      const shakeA = jerk * Math.sin(t * 80) * 14;
      harv.set({ x: hx, y: GY, s: 1.1, flip: hFlip, walk: walking ? hx * 0.06 : undefined, armF: 20 + reach1 * 70 + reach2 * 60 + jerk * 120 + shakeA, armB: 30, head: 10 * (reach1 + reach2) - jerk * 10 - lookR * 4, lean: (reach1 + reach2) * 8 - jerk * 4, o: seg(t, 1.02, 1.06) });
      const [hbx, hby] = handAt(hx, GY, 1.1, hFlip, 30, 0, 0, true);
      pose(hBasket, { x: hbx, y: hby + 26, o: seg(t, 1.02, 1.06) });
      ouch.forEach((el, i) => {
        const k = i ? bump(t, 1.64, 1.8) : bump(t, 1.34, 1.5);
        const [ox, oy] = i ? [650, GY - 120] : [490, GY - 150];
        pose(el, { x: ox, y: oy - k * 20, s: k * 1.4, r: T * 90, o: k });
      });

      S.cam.x = kf2(t);
      S.cam.z = 1.06 + es(t, 1.0, 1.3) * 0.06;
      S.cam.y = 30;
    };
  },
};
// the camera drifts from the preachers to the thorns
function kf2(t) { return lerp(0, -40, es(t, 0.95, 1.3)); }
