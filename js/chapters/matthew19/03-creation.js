// Mt 19,4–6 — "Have you not read…?" A scroll unrolls in the flies: "In the beginning". Dawn over a garden, and two
// figures pop up out of the paper like a pop-up book, male and female. A son takes leave of his father and mother,
// walks to his wife and takes her hands; two ribbons braid upwards. No longer two but one: the braid squeezes into a
// single golden cord. What God has joined — a knot of light ties it from above, and the scissors that come to cut
// it glance off and tumble away.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix, hanging, swing, flock } from '../kit.js';
import { band, hillsWith, sun, cloud, palm, olive, bush, flowers, grass, house } from '../../assets/nature.js';
import { rays, bird } from '../../assets/things.js';
import { seg, es, ease, bump, attr } from '../../core/anim.js';
import { LOOK, scissors, snip, lightKnot, heart, scrollParts, tr } from './lib.js';

const GY = 676;
const MX = 740, WX = 880;
const HAND_Y = GY - 104;

export default {
  id: 'mt19-creation',
  enter: 'fly',
  beats: [
    { v: 4 },
    { v: 5 },
    { v: 6, text: 'A tak już nie są dwoje, lecz jedno ciało.' },
    { v: 6, cont: true, text: 'Co więc Bóg złączył, niech człowiek nie rozdziela».' },
  ],
  cam: { x: [-30, 30], y: [-60, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DAWN = ['#c9bcd4', '#f1d2bd', '#f8e4c8'], DAYC = ['#cfe3dc', '#f2ead0', '#f9eed8'];
    sky(S, DAWN, { rise: 0 });
    const dayL = sky(S, DAYC, { name: 'day', rise: 0 });
    const glowL = S.layer({ par: 0.04, sh: 1, flat: true, rise: 0 });
    const burst = glowL.add(`<g opacity="0">${rays(c, { n: 20, r0: 60, r1: 900, spread: 0.05, color: '#fff3cf' })}<circle r="260" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const SX = S.portrait ? 1000 : 1130;   // phone: the first sunrise inside the screen, not halved by the edge and the thread
    const sunEl = hanging(hangL, sun(c, 52), { x: SX, y: 330, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 150), { x: 1300, y: 140, len: 600 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.plumRobe }), { y: 250, speed: 40, scale: 0.45 });
    // the scroll of Genesis
    const sc = scrollParts(c, { w: 250, h: 104, title: tr('Na początku…', 'In the beginning…'), lines: 3 });
    const scrollEl = hanging(hangL, `<g><g class="sheet">${sc.sheet.replace('font-size="30"', 'font-size="26"')}</g><g>${sc.rod}</g></g>`, { x: 650, y: 125, len: 800 });
    const scrollSheet = scrollEl.querySelector('.sheet');

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [16, 8, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.lavender, 0.25) }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(hillsWith(c, { y: 525, amps: [14, 6, 2], lens: [800, 280, 100], color: C.hillMid, trees: 24, treeColor: C.leaf, treeH: 24 }).markup);

    /* the garden */
    const garden = S.layer({ par: 0.32, sh: 3 });
    const gfn = c.wave(596, [5, 2], [600, 160]);
    const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5));
    const riv = [];
    for (let i = 0; i <= 18; i++) { const u = i / 18; riv.push([1080 + Math.sin(u * 5) * 60 + u * 200, lerp(598, 1700, Math.pow(u, 1.3))]); }
    g.p(c.ribbon(riv, (u) => 10 + u * 160), C.lake).x(c.ribbon(riv.slice(2), (u) => 2 + u * 24), C.lake2, 'opacity=".6"');
    garden.add(g.out());
    garden.add(palm(c, 250, 610, 220) + olive(c, 390, 606, 1.1) + palm(c, 1340, 610, 200) + olive(c, 1480, 610, 1) + bush(c, 560, 612, 80, C.leaf, C.moss) + bush(c, 1030, 612, 70, C.sage, C.leaf));
    let fruit = '';
    for (let i = 0; i < 14; i++) fruit += c.cut(c.circ(390 + c.rr(-66, 66), 606 - c.rr(88, 150), 5, 8), 0.2, 3) + c.cut(c.circ(1480 + c.rr(-60, 60), 610 - c.rr(80, 135), 5, 8), 0.2, 3);
    garden.add(sheet().p(fruit, C.terracotta).out());
    garden.add(flowers(c, { x0: -300, x1: 1900, y: 600, fn: gfn, n: 60, h: 18 }) + grass(c, { x0: -400, x1: 2000, y: 600, fn: gfn, n: 40, h: 14, color: C.moss }));

    /* the parents' house slides in */
    const homeL = S.layer({ par: 0.45, sh: 4 });
    const home = homeL.add(`<g>${house(c, -120, 0, 150, 110, { stairs: false })}</g>`);
    const father = S.puppet(homeL.add(person(c, LOOK.father)));
    const mother = S.puppet(homeL.add(person(c, LOOK.mother)));

    /* the braid rising from the joined hands */
    const braidL = S.layer({ par: 0.5, sh: 2 });
    const H = 290;
    const strand = (ph) => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60; p.push([Math.sin(u * Math.PI * 6 + ph) * 20 * (1 - u * 0.25), -u * H]); } return 'M' + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L'); };
    const LEN = 600;
    const braid = braidL.add(`<g><path class="s1" d="${strand(0)}" fill="none" stroke="${C.dustyBlue}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${LEN}" stroke-dashoffset="${LEN}"/><path class="s2" d="${strand(Math.PI)}" fill="none" stroke="${C.roseRobe}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${LEN}" stroke-dashoffset="${LEN}"/><path class="gold" d="${strand(0)}" fill="none" stroke="${C.sun}" stroke-width="6" stroke-linecap="round" opacity="0"/></g>`);
    const s1 = braid.querySelector('.s1'), s2 = braid.querySelector('.s2'), gold = braid.querySelector('.gold');

    /* the couple — cut-outs that pop up out of the ground */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const oneGlow = pL.add(`<g opacity="0"><ellipse rx="170" ry="170" fill="url(#halo-glow)"/></g>`);
    const manW = pL.add(`<g>${person(c, LOOK.man0)}</g>`);
    const wifeW = pL.add(`<g>${person(c, LOOK.wife0)}</g>`);
    const man = S.puppet(manW.firstElementChild), wife = S.puppet(wifeW.firstElementChild);
    const outline = () => pL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, GY + 2, 50, 12, 0, Math.PI * 2, 30), 3)}" fill="${C.halo}"/></g>`);
    const o1 = outline(), o2 = outline();
    const hrt = pL.add(`<g opacity="0">${heart(c, 16)}</g>`);

    const topL = S.layer({ par: 0.5, sh: 6 });
    const knot = topL.add(`<g opacity="0">${lightKnot(c, 34)}</g>`);
    const scis = topL.add(`<g opacity="0">${scissors(c, 100)}</g>`);

    return (t, time) => {
      const T = time;
      /* beat 0: "have you not read" — the scroll; dawn of creation; two figures pop up */
      dayL.layer.fade(es(t, 0, 0.9));
      const sd = es(t, -0.1, 0.25, ease.back) * (1 - es(t, 0.95, 1.2));
      swing(scrollEl, 650, 125 - (1 - sd) * 1100, T, 0.8, 0.6, 1);
      pose(scrollSheet, { sy: 0.05 + 0.95 * es(t, 0.12, 0.4) });
      swing(sunEl, SX, 440 - es(t, 0.1, 0.8) * 290, T, 0.8, 0.5);
      swing(cl1, 1300 - t * 8, 140, T, 1.2, 0.7, 2);
      birds(T, es(t, 0.6, 1));
      pose(burst, { x: SX, y: 160, s: 0.6 + es(t, 0.2, 0.7) * 0.5, r: t * 12, o: bump(t, 0.25, 1.35) * 0.7 });
      const popM = es(t, 0.35, 0.6, ease.back), popW = es(t, 0.48, 0.72, ease.back);

      /* beat 1: the parents slide in; he bows to them, walks to his wife, and they take hands; the braid grows */
      const hs = es(t, 1.0, 1.18);
      const leave = es(t, 1.36, 1.6);
      const hx = lerp(-300, S.portrait ? 470 : 400, hs);   // phone: the parents inside the left edge
      pose(home, { x: hx, y: GY - 6 });
      father.set({ x: hx + 60, y: GY, s: 0.94, armF: bump(t, 1.18, 1.6) * 90 + es(t, 1.45, 1.6) * 30, armB: bump(t, 1.2, 1.7) * 120, head: -4, blink: blinkAt(T, 1) });
      mother.set({ x: hx + 118, y: GY + 2, s: 0.9, armF: bump(t, 1.15, 1.55) * 70 + es(t, 1.45, 1.6) * 50, head: -6, blink: blinkAt(T, 2) });
      const toParents = es(t, 1.08, 1.2) * (1 - leave);
      const bow = bump(t, 1.18, 1.36);
      const join = es(t, 1.55, 1.7);
      let mx = lerp(700, MX, leave);
      mx = lerp(mx, 590, toParents * 0.4);
      const walking = (t > 1.08 && t < 1.2) || (t > 1.36 && t < 1.6);
      pose(manW, { x: mx, y: GY, sy: popM, o: seg(t, 0.3, 0.4) });
      man.set({ x: 0, y: 0, s: 1, flip: toParents > 0.5 && leave < 0.5, walk: walking ? mx * 0.07 : undefined, lean: bow * -8, head: bow * 10 - join * 3, armF: 8 + join * 58 + bump(t, 0.6, 0.95) * 30, armB: bump(t, 0.6, 0.95) * 60, blink: blinkAt(T, 3) });
      const wx = lerp(900, WX, join);
      pose(wifeW, { x: wx, y: GY, sy: popW, o: seg(t, 0.43, 0.53) });
      wife.set({ x: 0, y: 0, s: 0.96, flip: true, walk: t > 1.55 && t < 1.7 ? wx * 0.08 : undefined, head: -join * 3, armF: 8 + join * 58 + bump(t, 0.65, 1.0) * 30, armB: bump(t, 0.65, 1.0) * 50, blink: blinkAt(T, 4) });
      pose(o1, { x: 700, o: bump(t, 0.25, 0.8) });
      pose(o2, { x: 900, o: bump(t, 0.35, 0.9) });

      const grow = es(t, 1.6, 1.95);
      const bx = (MX + WX) / 2;
      attr(s1, 'stroke-dashoffset', (LEN * (1 - grow)).toFixed(1));
      attr(s2, 'stroke-dashoffset', (LEN * (1 - grow)).toFixed(1));
      /* beat 2: no longer two, but one */
      const one = es(t, 2.05, 2.55);
      pose(braid, { x: bx, y: HAND_Y + 6, sx: 1 - one * 0.7 });
      attr(gold, 'opacity', (one * 0.9).toFixed(2));
      pose(oneGlow, { x: bx, y: GY - 110, s: 0.6 + one * 0.6, o: one * 0.9 });
      pose(hrt, { x: bx, y: HAND_Y - 40, s: es(t, 2.3, 2.6, ease.back) * 1.3, o: t > 2.3 ? 1 : 0 });

      /* beat 3: what God has joined — a knot of light; the scissors glance off and fall */
      const kn = es(t, 3.02, 3.3, ease.back);
      pose(knot, { x: bx, y: HAND_Y - H - 4, s: kn, r: Math.sin(T * 0.8) * 4, o: kn > 0.01 ? 1 : 0 });
      const sIn = es(t, 3.2, 3.45), hit = es(t, 3.45, 3.72);
      pose(scis, { x: lerp(1180, bx + 110, sIn) + hit * 120, y: lerp(260, HAND_Y - H + 40, sIn) + hit * hit * 520, r: 180 + hit * 260, s: 0.9, o: sIn * (1 - es(t, 3.66, 3.74)) });
      snip(scis, 40 - bump(t, 3.36, 3.5) * 30 + hit * 30);

      S.cam.z = 1 + es(t, 1.4, 1.9) * 0.1 - es(t, 2.9, 3.3) * 0.06;
      S.cam.y = -es(t, 1.4, 1.9) * 20 - es(t, 2.9, 3.3) * 40;
      S.cam.x = -es(t, 1.0, 1.2) * 20 * (1 - es(t, 1.45, 1.7));
    };
  },
};
