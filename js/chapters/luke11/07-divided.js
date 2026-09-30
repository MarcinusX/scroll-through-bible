// Łk 11,17–18 — the village square. Jesus knows their thoughts (the dark little prince still hangs over the Pharisees'
// heads) and answers with pictures: a wide painted panel comes down over the square. "Every kingdom divided against
// itself is laid waste": a walled city under its banners — red soldiers on the left towers, blue on the right — they
// shoot at each other, the city tears down the middle and the two halves sag apart, grey and smoking. "And house falls
// upon house": a row of houses stands in its place — the first one tips and knocks down the next, and the next, and
// the next. "If Satan is divided against himself, how will his kingdom stand?": the dark horned prince himself fills
// the panel, a dark crown on his head — he splits down the middle, the halves pull apart and the crown drops. "For you
// say that I cast out demons by Beelzebul": the panel is pulled up; Jesus turns His open hand to the Pharisees, and
// their dark "Beelzebul!" bubble shows over them again.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { villageSet, VQ, panel, panelSky, panelGround, tornPair, darkPrince, crown, shout, flyBug, tagText, thought, glow, headAt, kf, tr, PI, GLOOM } from './lib.js';

const F = VQ.FEET;
const PX = 800, PY = 300, PW = 470, PH = 236;

/** the kingdom: a walled city on a low hill, towers with red soldiers on the left and blue on the right (panel coords) */
function kingdom(c) {
  const s = sheet();
  const wall = mix(C.stone, C.sand, 0.3);
  s.p(c.cut([[-170, 100], [-150, 40], [150, 40], [170, 100]], 0.8, 10), mix(C.hillNear, C.sand, 0.3));
  s.p(c.cut([[-130, 50], [-130, -30], [130, -30], [130, 50]], 0.5, 8), wall);
  let bat = '';
  for (let x = -128; x < 128; x += 20) bat += c.cut(c.rect(x, -40, 11, 11), 0.3, 3);
  s.p(bat, wall);
  [[-130, -80], [-60, -64], [60, -64], [130, -80]].forEach(([x, top]) => {
    s.p(c.cut(c.rect(x - 20, top, 40, 50 - top), 0.4, 6), shade(wall, -0.06));
    s.p(c.cut(c.rect(x - 5, top + 20, 10, 16), 0.2, 3), C.soilDark);
  });
  s.p(c.cut([[-24, 50], [-24, 10], ...c.arc(0, 10, 24, 20, PI, 2 * PI, 8), [24, 10], [24, 50]], 0.3, 5), C.soilDark);
  s.p(c.ribbon([[0, -30], [0, -110]], 3), C.wood2);
  s.p(c.cut([[0, -108], [50, -100], [42, -88], [50, -76], [0, -82]], 0.4, 4), C.plumRobe);
  const soldiers = (xs, col, dir) => xs.map(([x, top]) => {
    const b = sheet();
    b.p(c.cut([[x - 6, top], [x + 6, top], [x + 7, top - 18], [x - 7, top - 18]], 0.3, 3), col);
    b.p(c.cut(c.circ(x, top - 24, 6, 8), 0.2, 3), C.skin2);
    b.p(c.ribbon([[x + dir * 3, top - 14], [x + dir * 24, top - 30]], 2), C.wood2);
    return b.out();
  }).join('');
  return s.out() + soldiers([[-138, -80], [-120, -80], [-66, -64]], C.terracotta, 1) + soldiers([[66, -64], [120, -80], [138, -80]], C.dustyBlue, -1);
}
/** one house of the row (origin: its bottom right corner) */
function rowHouse(c, w, h, col) {
  const s = sheet();
  s.p(c.cut([[-w, 0], [-w, -h], [0, -h], [0, 0]], 0.4, 6), col);
  s.p(c.cut([[-w - 4, -h], [4, -h], [4, -h - 8], [-w - 4, -h - 8]], 0.3, 5), C.roof);
  s.p(c.cut([[-w * 0.62, 0], [-w * 0.62, -h * 0.5], [-w * 0.38, -h * 0.5], [-w * 0.38, 0]], 0.2, 4), C.wood2);
  s.p(c.cut(c.rect(-w * 0.3, -h * 0.82, w * 0.18, h * 0.18), 0.2, 3), C.soilDark);
  return s.out();
}
/** a puff of grey dust (origin centre) */
function puffOf(c, r = 30, col = mix(C.rock2, C.stone, 0.4)) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.7, 10, 0.25), 0.8, 5) + c.cut(c.blob(r * 0.7, -r * 0.3, r * 0.6, r * 0.5, 9, 0.25), 0.6, 5) + c.cut(c.blob(-r * 0.6, -r * 0.2, r * 0.55, r * 0.45, 9, 0.25), 0.6, 5), col).out();
}

export default {
  id: 'lk11-divided',
  beats: [
    { v: 17, text: 'On jednak, znając ich myśli, rzekł do nich: «Każde królestwo wewnętrznie skłócone pustoszeje' },
    { v: 17, cont: true, text: 'i dom na dom się wali.' },
    { v: 18, text: 'Jeśli więc i szatan z sobą jest skłócony, jakże się ostoi jego królestwo?' },
    { v: 18, cont: true, text: 'Mówicie bowiem, że Ja przez Belzebuba wyrzucam złe duchy.' },
  ],
  cam: { x: [-20, 40], y: [-70, 50], z: [1, 1.12] },
  build(S) {
    const Q = villageSet(S, { sky2: GLOOM });
    const c = Q.c;
    const q = makeCutter('lk11-divided-panel');
    const pan = Q.flyL.add(panel(S, panelSky(S, PW, PH, ['#b9b3c2', '#f0dcc4']) + panelGround(q, PW, 90, mix(C.sand, C.hillNear, 0.35)), { w: PW, h: PH }));
    const B = S.layer({ par: 0.22, sh: 5, rise: 0 });
    const kg = tornPair(q, kingdom(q), [-180, -120, 180, 110], 0, S.id('kg'));
    const kL = B.add(`<g opacity="0">${kg.left}</g>`), kR = B.add(`<g opacity="0">${kg.right}</g>`);
    const arrows = [0, 1, 2, 3].map(() => B.add(`<g opacity="0">${sheet().p(q.ribbon([[-14, 0], [14, 0]], 2), C.wood2).p(q.cut([[14, -3], [20, 0], [14, 3]], 0.2, 2), C.rock3).out()}</g>`));
    const smokes = [0, 1, 2].map(() => B.add(`<g opacity="0">${puffOf(q, 26)}</g>`));
    const HOUSES = [[-140, 70, 84, C.plaster], [-40, 64, 92, mix(C.plaster, C.peach, 0.3)], [60, 70, 84, mix(C.plaster, C.skyVeil, 0.35)], [160, 62, 96, C.plaster]]
      .map(([x, w, h, col], i) => ({ i, x, el: B.add(`<g opacity="0">${rowHouse(q, w, h, col)}</g>`) }));
    const dust = [0, 1, 2].map(() => B.add(`<g opacity="0">${puffOf(q, 22)}</g>`));
    const pr = tornPair(q, `<g transform="scale(2.1)">${darkPrince(q, 40)}</g>`, [-100, -120, 100, 90], 0, S.id('pr'));
    const dL = B.add(`<g opacity="0">${pr.left}</g>`), dR = B.add(`<g opacity="0">${pr.right}</g>`);
    const dCrown = B.add(`<g opacity="0"><g transform="scale(3)">${crown(q, '#3b3243')}</g></g>`);
    const dSmoke = [0, 1, 2].map(() => B.add(`<g opacity="0">${puffOf(q, 30, '#4a4254')}</g>`));

    /* their thoughts, and the Beelzebul bubble */
    const thinkEls = [0, 1].map(() => Q.W.add(`<g opacity="0">${thought(c, `<g transform="scale(.5)">${darkPrince(c, 30)}</g>`, { w: 56, h: 46 })}</g>`));
    const whisper = Q.W.add(`<g opacity="0">${shout(c, `<g transform="scale(.9)">${darkPrince(c, 34)}</g>`, { w: 140, h: 116, fill: mix(C.stone2, C.storm, 0.35), flip: true })}<g transform="translate(-74 -26)">${tagText(c, tr('Belzebub!', 'Beelzebul!'), { size: 18, fill: mix(C.cream, C.rock2, 0.35) })}</g></g>`);
    const flies = [0, 1, 2, 3].map(() => Q.W.add(`<g opacity="0">${flyBug(c)}</g>`));

    return (t, time) => {
      const T = time;
      Q.sk2.layer.fade(Math.max(0, es(t, 0.3, 0.8) * 0.5 + es(t, 2.0, 2.3) * 0.3 - es(t, 3.0, 3.3) * 0.8));
      /* the panel comes down, and goes up again on the last sentence */
      const pk = es(t, 0.02, 0.3, ease.out) * (1 - es(t, 3.0, 3.25, ease.in));
      const Y = lerp(-1500, PY, pk);
      pose(pan, { x: PX, y: Y, r: T ? Math.sin(T * 0.6) * 0.4 * pk : 0, o: pk > 0.002 ? 1 : 0 });
      const vis = pk > 0.9 ? 1 : 0;

      /* v17a — the kingdom divided: arrows fly both ways, it tears apart, grey smoke */
      const tear = es(t, 0.42, 0.66, ease.out);
      const kOut = es(t, 0.95, 1.1);
      [kL, kR].forEach((el, i) => {
        const d = i ? 1 : -1;
        pose(el, { x: PX + d * tear * 40, y: Y + tear * 16, r: d * tear * 7, ox: 0, oy: 100, o: vis * (1 - kOut) });
      });
      arrows.forEach((a, i) => {
        const k = seg(t, 0.12 + i * 0.07, 0.32 + i * 0.07);
        const d = i % 2 ? -1 : 1;
        pose(a, { x: PX + lerp(d * -120, d * 110, k), y: Y - 100 - Math.sin(k * PI) * 40, sx: d, r: d * (-30 + k * 60), o: vis && k > 0 && k < 1 ? 1 : 0 });
      });
      smokes.forEach((sm, i) => {
        const k = es(t, 0.5 + i * 0.06, 0.95 + i * 0.05);
        pose(sm, { x: PX - 90 + i * 90, y: Y - 60 - k * 50, s: 0.6 + k * 0.7, o: vis * bump(t, 0.5 + i * 0.06, 1.05) * 0.9 });
      });

      /* v17b — house falls upon house */
      const hIn = es(t, 1.0, 1.12);
      HOUSES.forEach((h) => {
        const a = 1.25 + h.i * 0.1;
        const fall = es(t, a, a + 0.14, ease.in);
        const ang = fall * (h.i === 3 ? 84 : 34 + h.i * 4);
        pose(h.el, { x: PX + h.x, y: Y + 90, r: ang, o: vis * hIn * (1 - es(t, 1.95, 2.05)) });
      });
      dust.forEach((d, i) => pose(d, { x: PX - 60 + i * 100, y: Y + 70, s: 0.6 + bump(t, 1.35 + i * 0.1, 1.9) * 0.6, o: vis * bump(t, 1.35 + i * 0.1, 1.95) * 0.9 }));

      /* v18a — Satan divided: the dark prince splits, the crown drops */
      const dIn = es(t, 2.0, 2.12);
      const split = es(t, 2.3, 2.55, ease.out);
      [dL, dR].forEach((el, i) => {
        const d = i ? 1 : -1;
        pose(el, { x: PX + d * split * 60, y: Y - 6 + split * 20, r: d * split * 14, ox: 0, oy: 80, o: vis * dIn * (1 - split * 0.35) });
      });
      const cf = es(t, 2.45, 2.75, ease.in);
      pose(dCrown, { x: PX - 36 + cf * 20, y: Y - 140 + cf * 200, r: cf * 50, o: vis * dIn * (1 - es(t, 2.72, 2.8)) });
      dSmoke.forEach((sm, i) => pose(sm, { x: PX - 80 + i * 80, y: Y - 40 - es(t, 2.4, 2.9) * 60, s: 0.6 + es(t, 2.4, 2.9) * 0.8, o: vis * bump(t, 2.4 + i * 0.05, 3.0) * 0.8 }));

      /* the square: Jesus answers; their thoughts; v18b — "you say: by Beelzebul" */
      const answer = es(t, 0.05, 0.25);
      const turn = es(t, 3.05, 3.25);
      Q.pose(t, T,
        { armF: 16 + answer * 50 - turn * 10, armB: 8 + answer * 40 * (1 - turn) + turn * 30, head: -8 * (1 - turn), blink: blinkAt(T, 2) },
        (d) => ({ head: -8, blink: blinkAt(T, d.seed) }),
        (m) => ({ armF: 8 + turn * 20, head: turn * 6, blink: blinkAt(T, m.seed) }));
      Q.amaze(0);
      thinkEls.forEach((el, i) => {
        const k = es(t, -0.3 + i * 0.08, 0.0 + i * 0.08, ease.back) * (1 - es(t, 0.5, 0.7));
        const [hx, hy] = headAt(VQ.PX[i * 2], F, 0.96, true);
        pose(el, { x: hx - 10, y: hy - 16, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const wk = es(t, 3.2, 3.4, ease.back);
      const [px, py] = headAt(VQ.PX[1], F, 0.96, true);
      pose(whisper, { x: px - 30, y: py - 30, s: wk, o: wk > 0.01 ? 1 : 0 });
      flies.forEach((f, i) => {
        const a = T * (1.4 + i * 0.2) + i * 1.3;
        pose(f, { x: px - 110 + Math.cos(a) * (70 + i * 6), y: py - 110 + Math.sin(a * 1.3) * 40, r: Math.sin(a) * 30, o: es(t, 3.3 + i * 0.03, 3.45 + i * 0.03) });
      });

      S.cam.y = kf(t, [[-0.5, 20], [0.2, -40], [2.9, -40], [3.2, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.2, 1.02], [2.9, 1.02], [3.2, 1.08]]);
      S.cam.x = kf(t, [[-0.5, 0], [2.9, 0], [3.2, 30]]);
    };
  },
};
