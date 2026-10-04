// Mk 10,6–9 — "From the beginning of creation God made them male and female."
// A garden set flies in: the sun rises, two figures pop up out of the paper like a pop-up book.
// A son takes leave of his father and mother; he and his wife take hands and two ribbons braid
// upwards into one cord — no longer two. A knot of light ties it from above, and the scissors
// that came to cut it glance off and tumble away.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix, hanging, swing } from '../kit.js';
import { band, hillsWith, sun, cloud, palm, olive, bush, flowers, grass, house, rock } from '../../assets/nature.js';
import { rays, bird } from '../../assets/things.js';
import { flock } from '../kit.js';
import { seg, es, ease, bump, attr } from '../../core/anim.js';
import { LOOK, scissors, snip, lightKnot, heart } from './lib.js';

const GY = 676;
const MX = 740, WX = 880;       // where the man / the woman stand at the end
const HAND_Y = GY - 104;

export default {
  id: 'm10-creation',
  enter: 'fly',
  beats: [
    { v: 6 },
    { v: 7 },
    { v: 8, text: 'i złączy się ze swoją żoną, i będą oboje jednym ciałem.' },
    { v: 8, cont: true, text: 'A tak już nie są dwoje, lecz jedno ciało.' },
    { v: 9 },
  ],
  cam: { x: [-30, 30], y: [-60, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DAWN = ['#c9bcd4', '#f1d2bd', '#f8e4c8'], DAY = ['#cfe3dc', '#f2ead0', '#f9eed8'];
    const sk = sky(S, DAWN);
    const glowL = S.layer({ par: 0.04, sh: 1, flat: true });
    const burst = glowL.add(`<g opacity="0">${rays(c, { n: 20, r0: 60, r1: 900, spread: 0.05, color: '#fff3cf' })}<circle r="260" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 58), { x: 800, y: 330, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 480, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1130, y: 190, len: 600 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.plumRobe }), { y: 230, speed: 40, scale: 0.45 });

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [16, 8, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.lavender, 0.25) }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    hills.add(hillsWith(c, { y: 525, amps: [14, 6, 2], lens: [800, 280, 100], color: C.hillMid, trees: 24, treeColor: C.leaf, treeH: 24 }).markup);

    // the garden
    const garden = S.layer({ par: 0.32, sh: 3 });
    const gfn = c.wave(596, [5, 2], [600, 160]);
    const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5));
    const riv = [];
    for (let i = 0; i <= 18; i++) { const u = i / 18; riv.push([1080 + Math.sin(u * 5) * 60 + u * 200, lerp(598, 1700, Math.pow(u, 1.3))]); }
    g.p(c.ribbon(riv, (u) => 10 + u * 160), C.lake).x(c.ribbon(riv.slice(2), (u) => 2 + u * 24), C.lake2, 'opacity=".6"');
    garden.add(g.out());
    garden.add(palm(c, 250, 610, 220) + olive(c, 390, 606, 1.1) + palm(c, 1330, 610, 200) + olive(c, 1480, 610, 1) + bush(c, 560, 612, 80, C.leaf, C.moss) + bush(c, 1040, 612, 70, C.sage, C.leaf));
    // fruit on the trees
    let fruit = '';
    for (let i = 0; i < 14; i++) fruit += c.cut(c.circ(390 + c.rr(-60, 60) * 1.1, 606 - c.rr(80, 140) * 1.1, 5, 8), 0.2, 3) + c.cut(c.circ(1480 + c.rr(-60, 60), 610 - c.rr(80, 135), 5, 8), 0.2, 3);
    garden.add(sheet().p(fruit, C.terracotta).out());
    garden.add(flowers(c, { x0: -300, x1: 1900, y: 600, fn: gfn, n: 60, h: 18 }) + grass(c, { x0: -400, x1: 2000, y: 600, fn: gfn, n: 40, h: 14, color: C.moss }));

    // the parents' house slides in on a track for verse 7
    const homeL = S.layer({ par: 0.45, sh: 4 });
    const home = homeL.add(`<g>${house(c, -120, 0, 150, 110, { stairs: false })}</g>`);
    const father = S.puppet(homeL.add(person(c, LOOK.father)));
    const mother = S.puppet(homeL.add(person(c, LOOK.mother)));

    // the braid rising from the joined hands (two strands; squeezed together they become one cord)
    const braidL = S.layer({ par: 0.5, sh: 2 });
    const H = 300;
    const strand = (ph) => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60; p.push([Math.sin(u * Math.PI * 6 + ph) * 20 * (1 - u * 0.25), -u * H]); } return 'M' + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L'); };
    const LEN = 620;
    const braid = braidL.add(`<g><path class="s1" d="${strand(0)}" fill="none" stroke="${C.dustyBlue}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${LEN}" stroke-dashoffset="${LEN}"/><path class="s2" d="${strand(Math.PI)}" fill="none" stroke="${C.roseRobe}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${LEN}" stroke-dashoffset="${LEN}"/><path class="gold" d="${strand(0)}" fill="none" stroke="${C.sun}" stroke-width="6" stroke-linecap="round" opacity="0"/></g>`);
    const s1 = braid.querySelector('.s1'), s2 = braid.querySelector('.s2'), gold = braid.querySelector('.gold');

    // the couple — cut-outs that pop up out of the ground like a pop-up book
    const pL = S.layer({ par: 0.5, sh: 5 });
    const oneGlow = pL.add(`<g opacity="0"><ellipse rx="170" ry="170" fill="url(#halo-glow)"/></g>`);
    const manW = pL.add(`<g>${person(c, LOOK.man0)}</g>`);
    const wifeW = pL.add(`<g>${person(c, LOOK.wife0)}</g>`);
    const man = S.puppet(manW.firstElementChild), wife = S.puppet(wifeW.firstElementChild);
    const outline = (x) => pL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(x, GY + 2, 50, 12, 0, Math.PI * 2, 30), 3)}" fill="${C.halo}"/></g>`);
    const o1 = outline(0), o2 = outline(0);
    const hrt = pL.add(`<g opacity="0">${heart(c, 16)}</g>`);

    // the knot of light and the scissors that cannot cut it
    const topL = S.layer({ par: 0.5, sh: 6 });
    const knot = topL.add(`<g opacity="0">${lightKnot(c, 34)}</g>`);
    const sc = topL.add(`<g opacity="0">${scissors(c, 100)}</g>`);

    return (t, time) => {
      const T = time;
      /* beat 0: the beginning of creation — dawn, a burst of light, two figures pop up */
      sk.blend(DAWN, DAY, es(t, 0, 0.9));
      swing(sunEl, 800, 480 - es(t, -0.2, 0.7) * 330, T, 0.8, 0.5);
      swing(cl1, 480 + t * 10, 150, T, 1.2, 0.6, 1);
      swing(cl2, 1130 - t * 8, 190, T, 1.2, 0.7, 2);
      birds(T, es(t, 0.6, 1));
      pose(burst, { x: 800, y: 160, s: 0.6 + es(t, 0.05, 0.6) * 0.5, r: t * 12, o: bump(t, 0.05, 1.3) * 0.7 });
      const popM = es(t, 0.25, 0.55, ease.back), popW = es(t, 0.4, 0.7, ease.back);

      /* beat 1: the parents slide in; he bows to them and walks to his wife */
      const hs = es(t, 0.9, 1.2);
      const leave = es(t, 1.45, 1.95);
      const hx = lerp(-300, S.portrait ? 490 : 400, hs);   // phone: the parents stand inside the screen
      pose(home, { x: hx, y: GY - 6 });
      father.set({ x: hx + 60, y: GY, s: 0.94, armF: bump(t, 1.3, 2.1) * 90 + es(t, 1.6, 1.9) * 30, armB: bump(t, 1.4, 2.2) * 120, head: -4, blink: blinkAt(T, 1) });
      mother.set({ x: hx + 118, y: GY + 2, s: 0.9, armF: bump(t, 1.25, 1.8) * 70 + es(t, 1.6, 1.9) * 50, head: -6, blink: blinkAt(T, 2) });

      const toParents = es(t, 1.1, 1.35) * (1 - leave);
      const bow = bump(t, 1.25, 1.55);
      const join = es(t, 2.0, 2.35);
      let mx = lerp(700, MX, leave);
      mx = lerp(mx, S.portrait ? 640 : 590, toParents * 0.4);
      const walking = (t > 1.1 && t < 1.35) || (t > 1.45 && t < 1.95);
      pose(manW, { x: mx, y: GY, sy: popM, o: seg(t, 0.2, 0.3) });
      man.set({ x: 0, y: 0, s: 1, flip: toParents > 0.5 && leave < 0.5, walk: walking ? mx * 0.07 : undefined, lean: bow * -8, head: bow * 10 - join * 3, armF: 8 + join * 58 + bump(t, 0.6, 1.0) * 30, armB: bump(t, 0.6, 1.0) * 60, blink: blinkAt(T, 3) });
      const wx = lerp(900, WX, join);
      pose(wifeW, { x: wx, y: GY, sy: popW, o: seg(t, 0.35, 0.45) });
      wife.set({ x: 0, y: 0, s: 0.96, flip: true, walk: t > 2 && t < 2.35 ? wx * 0.08 : undefined, head: -join * 3, armF: 8 + join * 58 + bump(t, 0.7, 1.1) * 30, armB: bump(t, 0.7, 1.1) * 50, blink: blinkAt(T, 4) });
      pose(o1, { x: 700, o: bump(t, 0.1, 0.7) });
      pose(o2, { x: 900, o: bump(t, 0.2, 0.8) });

      /* beat 2: they take hands; two ribbons braid upwards */
      const grow = es(t, 2.2, 2.95);
      const bx = (MX + WX) / 2;
      attr(s1, 'stroke-dashoffset', (LEN * (1 - grow)).toFixed(1));
      attr(s2, 'stroke-dashoffset', (LEN * (1 - grow)).toFixed(1));
      /* beat 3: no longer two, but one — the braid squeezes into one cord, one glow round both */
      const one = es(t, 3.05, 3.6);
      pose(braid, { x: bx, y: HAND_Y + 6, sx: 1 - one * 0.7 });
      attr(gold, 'opacity', (one * 0.9).toFixed(2));
      pose(oneGlow, { x: bx, y: GY - 110, s: 0.6 + one * 0.6, o: one * 0.9 });
      pose(hrt, { x: bx, y: HAND_Y - 40, s: es(t, 3.3, 3.6, ease.back) * 1.3, o: t > 3.3 ? 1 : 0 });

      /* beat 4: God has joined them — a knot of light; the scissors glance off and fall */
      const kn = es(t, 4.02, 4.35, ease.back);
      pose(knot, { x: bx, y: HAND_Y - H - 4, s: kn, r: Math.sin(T * 0.8) * 4, o: kn > 0.01 ? 1 : 0 });
      const sIn = es(t, 4.25, 4.55), hit = es(t, 4.55, 4.95);
      pose(sc, { x: lerp(1180, bx + 110, sIn) + hit * 120, y: lerp(260, HAND_Y - H + 40, sIn) + hit * hit * 520, r: 180 + hit * 260, s: 0.9, o: sIn * (1 - es(t, 4.85, 4.98)) });
      snip(sc, 40 - bump(t, 4.45, 4.6) * 30 + hit * 30);

      S.cam.z = 1 + es(t, 1.9, 2.6) * 0.1 - es(t, 3.9, 4.3) * 0.06;
      S.cam.y = -es(t, 1.9, 2.6) * 20 - es(t, 3.9, 4.3) * 40;
      S.cam.x = -es(t, 0.9, 1.3) * 20 * (1 - es(t, 1.9, 2.3));
    };
  },
};
