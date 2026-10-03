// Łk 14,28–30 — a painted flat: a vineyard on a hillside, and a builder at a little table beside his building site. Over
// the site his plan hangs in the air, a tall tower drawn in dotted ink. But does he sit down first and count the cost?
// No: he counts only a few coins into a stack, and starts. The courses of stone go up one after another, a scaffold and
// a ladder rise against them — and at half height his purse is empty: he turns it out and a moth flutters from it. The
// building stops. Neighbours stop on the path, point and laugh: "This man began to build and was not able to finish!"
// A crow settles on the unfinished wall, and the builder hides his face in his hands.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, olive, cypress, grass, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { TW, BUILDER, towerCourse, towerPlan, scaffold, moth, crowStand, coin, coinStack, purse5, bubble, label, question, storyFrame, pose3, folk, headAt, hand, kf, popAt, makeCutter, tr, sheet, mix, shade, DAY } from './lib.js';

const BX = 540, TX = TW.X, GY = TW.GY;

function vines(c, y0, n, x0, x1) {
  const s = sheet();
  let posts = '', lv = '', gr = '';
  for (let r = 0; r < n; r++) {
    const y = y0 + r * 18;
    for (let x = x0 + (r % 2) * 20; x < x1; x += 46) {
      posts += c.ribbon([[x, y], [x, y - 26]], 2.2);
      lv += c.cut(c.blob(x, y - 24, 16, 9, 8, 0.25), 0.6, 3);
      if (c.chance(0.4)) gr += c.poly(c.circ(x + 5, y - 16, 3, 6)) + c.poly(c.circ(x + 9, y - 13, 3, 6));
    }
    posts += c.ribbon([[x0, y - 22], [x1, y - 22]], 1);
  }
  s.x(posts, C.wood2).p(lv, C.moss).p(gr, mix(C.plumRobe, C.indigo, 0.3));
  return s.out();
}

export default {
  id: 'lk14-tower',
  enter: 'fly',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-60, 90], y: [0, 140], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 170, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 480, y: 150, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = hillsWith(c, { y: 460, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillMid, C.hillFar, 0.3), trees: 16, treeColor: C.sage, treeH: 18 });
    far.add(h1.markup + town(c, { x: 1150, y: h1.fn(1150) + 12, n: 7, spread: 300, sc: 0.5 }));
    const mid = S.layer({ par: 0.22, sh: 3 });
    mid.add(band(c, { y: 540, amps: [8, 3], lens: [700, 220], color: C.hillNear }).markup + vines(c, 580, 3, -300, 1900) + cypress(c, 300, 560, 120) + olive(c, 1280, 566, 0.7));
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 40, [4, 2], [700, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.35)).out() + grass(c, { x0: -600, x1: 2200, y: GY - 40, fn: gfn, n: 40, h: 12, color: C.moss }));
    G.add(sheet().p(c.cut([[TX - TW.W / 2 - 30, GY + 2], [TX + TW.W / 2 + 30, GY + 2], [TX + TW.W / 2 + 20, GY - 8], [TX - TW.W / 2 - 20, GY - 8]], 0.5, 8), mix(C.soil, C.sand2, 0.4)).out());
    const planL = S.layer({ par: 0.4, sh: 0, flat: true });
    const plan = planL.add(`<g>${towerPlan(c)}</g>`);
    const tL = S.layer({ par: 0.42, sh: 4 });
    const courses = Array.from({ length: TW.N }, (_, i) => tL.add(`<g opacity="0">${towerCourse(c, i)}</g>`));
    const scaf = tL.add(`<g opacity="0">${scaffold(c)}</g>`);
    const heap = tL.add(`<g>${sheet().p(c.cut(c.blob(0, -14, 50, 16, 10, 0.2), 0.6, 4), mix(C.stone2, C.sand2, 0.4)).x(c.cut(c.rect(-30, -24, 26, 14), 0.3, 3) + c.cut(c.rect(4, -30, 30, 16), 0.3, 3), shade(C.stone2, -0.1)).out()}</g>`);
    const crow = tL.add(`<g opacity="0">${crowStand(c)}</g>`);
    const pL = S.layer({ par: 0.44, sh: 5 });
    pL.add(sheet().p(c.cut([[BX + 30, GY - 60], [BX + 150, GY - 60], [BX + 150, GY - 50], [BX + 30, GY - 50]], 0.4, 6), C.wood).p(c.cut(c.rect(BX + 38, GY - 50, 8, 50), 0.3, 4) + c.cut(c.rect(BX + 134, GY - 50, 8, 50), 0.3, 4), C.wood2).out());
    const tablet = pL.add(`<g>${sheet().p(c.cut(c.rect(-22, -14, 44, 28), 0.3, 4), C.wood3).p(c.cut(c.rect(-18, -10, 36, 20), 0.3, 4), mix(C.wheat, C.cream, 0.4)).out()}</g>`);
    const stack = pL.add(`<g>${coinStack(c, 3, 9)}</g>`);
    const hop = [0, 1, 2].map(() => pL.add(`<g opacity="0">${coin(c, 8)}</g>`));
    const seated = S.puppet(pL.add(person(c, { ...BUILDER, pose: 'sit' })));
    const stand = S.puppet(pL.add(person(c, { ...BUILDER, holdF: `<g transform="translate(0 6)">${purse5(c, 0)}</g>` })));
    const hide = S.puppet(pL.add(person(c, BUILDER)));
    const mothEl = pL.add(`<g opacity="0">${moth(c)}</g>`);
    const mk = makeCutter('lk14-mockers');
    const mockers = pL.sprite(pose3(mk, [0, 1, 2].map((k) => ({ x: k * 50 - 50, y: (k % 2) * 8, s: 0.94, flip: true, head: -10 + k * 4, armF: k === 1 ? 60 : 90, armB: k === 1 ? 150 : 40, o: folk(mk, k !== 1) }))), 1110, GY + 4);
    const ha = [0, 1].map(() => pL.add(`<g opacity="0">${label(c, 'ha ha!', { size: 16 })}</g>`));
    const q = pL.add(`<g opacity="0">${question(c)}</g>`);
    const say = pL.add(`<g opacity="0">${bubble(c, [tr('Ten człowiek zaczął budować,', 'This man began to build,'), tr('a nie zdołał wykończyć!', 'and wasn’t able to finish!')], { size: 19, dir: 1 })}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1240, 170, T, 1, 0.6);
      swing(cl, 480 + Math.sin(T * 0.1) * 16, 150, T, 1.2, 0.6, 1);
      /* v28 — does he sit down first and count the cost? */
      pose(plan, { x: TX, y: GY, o: 0.9 * (1 - es(t, 2.2, 2.6) * 0.5) });
      const up = es(t, 1.0, 1.06);
      seated.set({ x: BX, y: GY, s: 1.0, flip: false, o: 1 - up, armF: 60 + (T ? Math.sin(t * 30) * 8 * bump(t, 0.2, 0.8) : 0), armB: 30, head: 10 - bump(t, 0.3, 0.7) * 20, blink: blinkAt(T, 2) });
      pose(tablet, { x: BX + 110, y: GY - 74 });
      pose(stack, { x: BX + 70, y: GY - 60, sy: 1, o: 1 });
      hop.forEach((e, i) => { const u = seg(t, 0.2 + i * 0.15, 0.34 + i * 0.15); pose(e, { x: lerp(BX + 50, BX + 70, u), y: GY - 90 - Math.sin(u * Math.PI) * 30 - i * 6 + u * 10, o: u > 0 && u < 1 ? 1 : 0 }); });
      popAt(q, t, 0.3, 1.05, TX + 140, 300 + (T ? Math.sin(T * 1.6) * 4 : 0), { d: 0.12, s: 1.3 });
      /* v29 — the foundation, the courses, and then nothing left */
      courses.forEach((e, i) => {
        const k = es(t, 1.04 + i * 0.09, 1.14 + i * 0.09, ease.out);
        pose(e, { x: TX, y: GY - i * TW.COURSE - (1 - k) * 30, o: k > 0.01 ? 1 : 0 });
      });
      pose(scaf, { x: TX, y: GY, o: es(t, 1.2, 1.3) });
      pose(heap, { x: TX + 160, y: GY + 4, sy: 1 - es(t, 1.04, 1.5) * 0.7, o: 1 });
      const empty = es(t, 1.52, 1.62);
      const shame = es(t, 2.3, 2.45);
      stand.set({ x: BX + 40, y: GY, s: 1.0, flip: false, o: up * (1 - shame), armF: 30 + empty * 90, armB: 10 + empty * 20, head: -4 + empty * 10, blink: blinkAt(T, 2) });
      hide.set({ x: BX + 40, y: GY, s: 1.0, flip: false, o: shame, armF: 150, armB: 140, head: 22, lean: 8, blink: 1 });
      const [phx, phy] = hand(BX + 40, GY, 1.0, false, 120);
      const mu = seg(t, 1.6, 2.3);
      pose(mothEl, { x: phx + mu * 80 + Math.sin(mu * 20) * 10, y: phy - 10 - mu * 180, r: Math.sin(mu * 30) * 20, s: 1 + Math.sin(mu * 40) * 0.2, o: mu > 0 && mu < 1 ? 1 : 0 });
      /* the neighbours laugh */
      const come = es(t, 1.55, 1.8);
      const MX = S.portrait ? 1060 : 1110, HAX = S.portrait ? 1000 : 1080;   // phone: the mockers and their laughter inside the screen
      mockers.set({ x: lerp(1300, MX, come), y: GY + 4, o: seg(t, 1.5, 1.56) });
      ha.forEach((e, i) => popAt(e, t, 1.62 + i * 0.08, 2.08 + i * 0.1, HAX + i * 70, 470 - i * 30 + (T ? Math.sin(T * 5 + i) * 4 : 0), { d: 0.08 }));
      /* v30 — "This man began to build…" */
      popAt(say, t, 2.08, undefined, 1050, 500, { d: 0.12 });
      const ck = es(t, 2.2, 2.5, ease.out);
      pose(crow, { x: lerp(TX + 300, TX - 40, ck), y: lerp(300, GY - TW.N * TW.COURSE, ck), o: ck > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -30], [0.6, -40], [1.2, 0], [1.8, 20], [2.2, 20]]);
      S.cam.y = kf(t, [[-0.5, 80], [0.4, 120], [1.2, 80]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.4, 1.16], [1.2, 1.06]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -60], [0.8, -60], [1.2, 0], [1.55, 90], [2.2, 90]]); S.cam.z = 1.0; }
      void headAt;
    };
  },
};
