// Mt 12,25–26 — Jesus reads their thoughts and answers with pictures, on a painted flat under a darkening sky.
// "Every kingdom divided against itself is laid waste": a walled city on its hill, its crown-banner on the gate — but
// the red soldiers on the left towers and the blue ones on the right shoot at each other, the picture tears down the
// middle and the two halves sag apart, grey and smoking. "No city or house divided will stand": a house comes down
// in its place; husband and wife shout at each other in its door, it cracks in two and the halves fall away.
// "If Satan casts out Satan…": two dark horned shadows grab the one dark crown and tug — it snaps, and they tumble
// apart into smoke: how could such a kingdom stand?
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, house, olive, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tornPair, manOf, womanOf, shout, bang, puff, crown, silhouette, withFace, headAt, kf, glow, tr, PI } from './lib.js';

const Y = 690;

/** the kingdom: a walled city on a hill, a crown banner on its gate, soldiers of two colours on its towers (origin world) */
function kingdom(c) {
  const s = sheet();
  s.p(c.cut([[480, Y + 10], [560, 560], [700, 520], [900, 520], [1040, 560], [1120, Y + 10]], 1.2, 12), mix(C.hillNear, C.sand, 0.3));
  const wall = mix(C.stone, C.sand, 0.3);
  s.p(c.cut([[590, 560], [590, 440], [1010, 440], [1010, 560]], 0.6, 10), wall);
  let bat = '';
  for (let x = 594; x < 1006; x += 26) bat += c.cut(c.rect(x, 428, 14, 14), 0.3, 4);
  s.p(bat, wall);
  [[590, 380], [700, 400], [900, 400], [1010, 380]].forEach(([x, top]) => {
    s.p(c.cut(c.rect(x - 30, top, 60, 560 - top), 0.5, 8), shade(wall, -0.06));
    let b2 = '';
    for (let k = 0; k < 3; k++) b2 += c.cut(c.rect(x - 30 + k * 22, top - 12, 14, 13), 0.3, 4);
    s.p(b2, shade(wall, -0.06));
    s.p(c.cut(c.rect(x - 7, top + 30, 14, 22), 0.2, 4), C.soilDark);
  });
  // the gate with the crown banner above it
  s.p(c.cut([[760, 560], [760, 490], ...c.arc(800, 490, 40, 34, PI, 2 * PI, 10), [840, 490], [840, 560]], 0.4, 6), C.soilDark);
  s.p(c.ribbon([[800, 450], [800, 330]], 4), C.wood2);
  s.p(c.cut([[800, 334], [880, 344], [868, 366], [880, 388], [800, 380]], 0.4, 5), C.plumRobe);
  const soldiers = (xs, col, dir) => xs.map(([x, top]) => {
    const b = sheet();
    b.p(c.cut([[x - 8, top], [x + 8, top], [x + 10, top - 26], [x - 10, top - 26]], 0.3, 4), col);
    b.p(c.cut(c.circ(x, top - 34, 8, 10), 0.2, 3), C.skin2);
    b.p(c.cut(c.arc(x, top - 36, 9, 8, PI, 2 * PI, 8), 0.2, 3), shade(col, -0.2));
    b.p(c.ribbon([[x + dir * 4, top - 20], [x + dir * 34, top - 44]], 2.4), C.wood2);
    b.p(c.cut([[x + dir * 34, top - 44], [x + dir * 44, top - 52], [x + dir * 38, top - 40]], 0.2, 2), C.rock3);
    return b.out();
  }).join('');
  return s.out() + soldiers([[578, 368], [604, 368], [690, 388], [712, 388]], C.terracotta, 1) + soldiers([[888, 388], [910, 388], [996, 368], [1022, 368]], C.dustyBlue, -1);
}
/** a village house with a door and a window (origin world), for tearing */
function houseM(c) {
  const s = sheet();
  const x0 = 640, x1 = 960, top = 430;
  s.p(c.cut([[x0, Y + 4], [x0, top], [x1, top], [x1, Y + 4]], 0.6, 10), C.plaster);
  s.p(c.cut([[x0 - 14, top + 4], [x1 + 14, top + 4], [x1 + 14, top - 16], [x0 - 14, top - 16]], 0.4, 8), C.roof);
  s.p(c.cut([[760, Y + 4], [760, 560], ...c.arc(800, 560, 40, 34, PI, 2 * PI, 10), [840, 560], [840, Y + 4]], 0.4, 6), C.wood2);
  s.p(c.cut(c.rect(680, 480, 44, 40), 0.3, 5) + c.cut(c.rect(876, 480, 44, 40), 0.3, 5), C.soilDark);
  s.x(c.ribbon([[702, 480], [702, 520]], 2) + c.ribbon([[898, 480], [898, 520]], 2), C.wood3);
  s.p(c.cut([[x1 + 14, top + 20], [x1 + 60, top + 60], [x1 + 60, Y + 4], [x1, Y + 4]], 0.4, 6), C.plaster2);
  return s.out();
}
/** a dark horned shadow puppet */
function shadowDevil(c) {
  const o = silhouette({ robe: '#2f2838', mantle: null, hairStyle: 'wild', beard: 'none', skin: '#2f2838', hair: '#2f2838' }, '#2f2838');
  const horns = `<path d="${c.cut([[-12, -14], [-22, -36], [-6, -18]], 0.3, 3)}" fill="#2f2838"/><path d="${c.cut([[8, -16], [20, -38], [14, -14]], 0.3, 3)}" fill="#2f2838"/><path d="${c.poly(c.ell(10, -2, 3.4, 2.2, 8, 0.2))}" fill="#e9dcb4"/>`;
  return withFace(person(c, o).split(`fill="${C.blush}"`).join('fill="#2f2838"'), horns);
}

export default {
  id: 'mt12-divided',
  enter: 'fly',
  beats: [
    { v: 25, text: 'Jezus, znając ich myśli, rzekł do nich: «Każde królestwo, wewnętrznie skłócone, pustoszeje.' },
    { v: 25, cont: true, text: 'I żadne miasto ani dom, wewnętrznie skłócony, się nie ostoi.' },
    { v: 26 },
  ],
  cam: { x: [-20, 20], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#b9b3c2', '#e8d6c2', '#f2e2ca']);
    const dark = sky(S, ['#5c5870', '#8f8398', '#c4b3aa'], { name: 'dark' });
    dark.layer.fade(0);
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 480, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.25), trees: 12, treeColor: mix(C.sage2, C.duskViolet, 0.25), treeH: 18 }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(Y - 10, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out() + grass(c, { x0: -600, x1: 2200, y: Y - 6, n: 36, h: 12, color: C.moss }) + olive(c, 330, Y, 0.8) + olive(c, 1280, Y, 0.7));

    /* the kingdom, torn in two */
    const kL = S.layer({ par: 0.36, sh: 5 });
    const kh = tornPair(c, kingdom(c), [480, 320, 1120, Y + 12], 800, S.id('kg'));
    const kLeft = kL.add(`<g>${kh.left}</g>`), kRight = kL.add(`<g>${kh.right}</g>`);
    const arrows = [0, 1, 2, 3].map((i) => kL.add(`<g opacity="0">${sheet().p(c.ribbon([[-18, 0], [18, 0]], 2), C.wood2).p(c.cut([[18, -4], [26, 0], [18, 4]], 0.2, 2), C.rock3).out()}</g>`));
    const smokes = [0, 1, 2, 3].map((i) => kL.add(`<g opacity="0">${puff(c, 34, mix(C.rock2, C.stone, 0.4))}</g>`));

    /* the house, torn in two, and its quarrelling pair */
    const hL = S.layer({ par: 0.4, sh: 5 });
    const hh = tornPair(c, houseM(c), [620, 400, 1030, Y + 8], 802, S.id('hs'));
    const hLeft = hL.add(`<g>${hh.left}</g>`), hRight = hL.add(`<g>${hh.right}</g>`);
    const pair = [manOf(c, { robe: C.tealRobe, belt: C.leather }), womanOf(c, { robe: C.roseRobe, veil: C.ochreRobe })].map((o, i) => ({ i, p: S.puppet(hL.add(person(c, o))) }));
    const shouts = [0, 1].map((i) => hL.add(`<g opacity="0">${shout(c, bang(c, 28), { w: 58, h: 48, flip: i === 1 })}</g>`));

    /* Satan against Satan */
    const dL = S.layer({ par: 0.45, sh: 5 });
    const crownT = tornPair(c, `<g transform="translate(800 470) scale(4)">${crown(c, '#3b3243')}</g>`, [720, 340, 880, 440], 800, S.id('cr'));
    const cLeft = dL.add(`<g>${crownT.left}</g>`), cRight = dL.add(`<g>${crownT.right}</g>`);
    const devils = [0, 1].map((i) => ({ i, p: S.puppet(dL.add(shadowDevil(c))) }));
    const dSmoke = [0, 1, 2, 3].map(() => dL.add(`<g opacity="0">${puff(c, 40, '#4a4254')}</g>`));

    return (t, time) => {
      const T = time;
      dark.layer.fade(es(t, 0.3, 0.7) * 0.6 + es(t, 2.3, 2.7) * 0.4);

      /* v25a — the kingdom at war with itself tears apart */
      const kIn = es(t, -0.6, -0.1, ease.out);
      const kOut = es(t, 1.0, 1.25, ease.in);
      const tear = es(t, 0.35, 0.62, ease.out);
      [kLeft, kRight].forEach((el, i) => {
        const d = i ? 1 : -1;
        pose(el, { x: 800 + d * tear * 70 + d * kOut * 900, y: Y + tear * 26 + (1 - kIn) * -600, r: d * tear * 6, ox: 800, oy: Y, o: 1 - tear * 0.35 });
      });
      arrows.forEach((a, i) => {
        const k = seg(t, 0.05 + i * 0.07, 0.3 + i * 0.07);
        const d = i % 2 ? -1 : 1;
        const x0 = d > 0 ? 640 : 960, x1 = d > 0 ? 920 : 680;
        pose(a, { x: lerp(x0, x1, k), y: 340 - Math.sin(k * PI) * 60 + i * 8, sx: d, r: d * (-30 + k * 60), o: k > 0 && k < 1 ? 1 : 0 });
      });
      smokes.forEach((sm, i) => {
        const k = es(t, 0.45 + i * 0.05, 0.9 + i * 0.05);
        pose(sm, { x: [620, 720, 900, 1000][i] + (i < 2 ? -tear * 70 : tear * 70), y: 440 - k * 100, s: 0.5 + k * 0.8, o: bump(t, 0.45 + i * 0.05, 1.05) * 0.8 });
      });

      /* v25b — the house divided */
      const hIn = es(t, 1.0, 1.3, ease.out);
      const htear = es(t, 1.45, 1.65, ease.in);
      const hOut = es(t, 2.0, 2.2, ease.in);
      [hLeft, hRight].forEach((el, i) => {
        const d = i ? 1 : -1;
        pose(el, { x: 800 + d * 150 + d * htear * 40 + d * hOut * 900, y: Y + (1 - hIn) * -700 + htear * 30, r: d * htear * 14, ox: 800 + d * 150, oy: Y, o: hIn > 0.001 ? 1 : 0 });
      });
      pair.forEach((m) => {
        const d = m.i ? 1 : -1;
        const run = es(t, 1.55, 1.9);
        const x = 800 + d * 96 + d * run * 290;
        m.p.set({ x, y: Y + 10, s: 0.96, flip: m.i ? run < 0.5 : run > 0.5, o: es(t, 1.2, 1.3) * (1 - es(t, 2.0, 2.1)), walk: run > 0 && run < 1 ? x * 0.07 : undefined, amt: 1.4, armF: 24 + bump(t, 1.2, 1.55) * 46, armB: 10 + bump(t, 1.25, 1.6) * (m.i ? 40 : 20), head: -6 + run * 10, lean: bump(t, 1.2, 1.55) * 8, blink: 0 });
      });
      shouts.forEach((sh, i) => {
        const k = es(t, 1.22 + i * 0.08, 1.32 + i * 0.08, ease.back) * (1 - es(t, 1.5, 1.6));
        const [hx, hy] = headAt(800 + (i ? 96 : -96), Y + 10, 0.96, i === 1);
        pose(sh, { x: hx + (i ? -10 : 10), y: hy - 20, s: k, r: Math.sin(t * 40 + i) * 5 * k, o: k > 0.01 ? 1 : 0 });
      });

      /* v26 — Satan against Satan; the dark crown snaps */
      const dIn = es(t, 2.0, 2.25);
      const tug = bump(t, 2.25, 2.55);
      const snap = es(t, 2.5, 2.62, ease.out);
      const fall = es(t, 2.6, 2.95);
      devils.forEach((dv) => {
        const d = dv.i ? 1 : -1;
        const x = 800 + d * (120 + tug * 14 + snap * 60 + fall * 60);
        dv.p.set({ x, y: Y + 6 + fall * 20, s: 1.05, flip: dv.i === 1, o: dIn * (1 - fall * 0.7), armF: 130 - snap * 60, armB: 110 - snap * 40, lean: d * (tug * 10 + snap * 18 + fall * 26), head: d * 8, blink: 0 });
      });
      [cLeft, cRight].forEach((el, i) => {
        const d = i ? 1 : -1;
        pose(el, { x: 800 + d * (snap * 50 + fall * 40), y: 400 + fall * 180, r: d * (snap * 20 + fall * 40), ox: 800, oy: 400, o: dIn * (1 - fall * 0.8) });
      });
      dSmoke.forEach((sm, i) => {
        const k = es(t, 2.6 + i * 0.05, 3.0 + i * 0.05);
        pose(sm, { x: [620, 700, 900, 980][i], y: Y - 120 - k * 90, s: 0.6 + k, o: k * (1 - k) * 3 * 0.8 });
      });

      S.cam.z = kf(t, [[-0.5, 1.06], [0.9, 1.08], [1.2, 1.1], [2.0, 1.1], [2.3, 1.12]]);
      S.cam.y = kf(t, [[-0.5, 10], [0.9, 10], [1.2, 30], [2.3, 36]]);
    };
  },
};
