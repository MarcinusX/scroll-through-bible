// Łk 19,43–44 — the same view, as a vision in the failing light. "Days will come when your enemies will throw up a
// barricade against you, surround you and hem you in on every side": the sky darkens, a ring of sharpened stakes rises
// out of the ground round the walls, and dark ranks of soldiers with spears close in from both sides of the valley.
// "They will dash you to the ground, and not leave one stone upon another": the city breaks into its pieces, which
// tilt and sink behind the ridge in dust. "Because you did not recognise the time of your visitation": the vision
// fades — the city stands whole again in the dusk, a little hourglass hangs over it with its sand run out, and Jesus
// stands there with the tear on His cheek.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { olivetSet, OV, TWELVE, still, colt, coltRig, saddleCloaks, withFace, faceBits, face, jerusalem, hourglass, strip, shadowPerson, GUARD, dust, headAt, kf, tr, es, ease, bump, seg, PI, LAMENT, LAMENT2, mix, shade, sheet, STRING } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const GY = OV.GY, JX = 470;
const CITY = [1030, 520], CS = 0.7, NS = 7, SW = 140;
const DARKSKY = [mix(C.night, C.storm2, 0.5), mix(C.storm2, C.curtain2, 0.35), mix(C.dusk, C.storm, 0.4)];
const SHADE = '#3d3040';

export default {
  id: 'lk19-siege',
  beats: [
    { v: 43 },
    { v: 44, text: 'Powalą na ziemię ciebie i twoje dzieci z tobą i nie zostawią w tobie kamienia na kamieniu' },
    { v: 44, cont: true, text: 'za to, żeś nie rozpoznało czasu twojego nawiedzenia».' },
  ],
  cam: { x: [-60, 120], y: [-60, 60], z: [1, 1.14] },
  build(S) {
    let P = null;
    const O = olivetSet(S, {
      skyCols: LAMENT2, sky2: DARKSKY, cityX: CITY[0], cityY: CITY[1], cityS: CS, sunAt: [1320, 300], slopeY: 600, seed: 'lk19-olivet-d', grove2: false, noCity: true,
      atCity: (S2, c2) => {
        const cc = makeCutter('lk19-siege-city');
        const M = jerusalem(cc, CS);
        const L = S2.layer({ par: 0.1, sh: 3 });
        const whole = L.add(`<g><g transform="translate(${CITY[0]} ${CITY[1]})">${M}</g></g>`);
        const x0 = CITY[0] - (NS * SW) / 2;
        const slices = Array.from({ length: NS }, (_, i) => {
          const id = S2.id('slice' + i);
          const sx = x0 + i * SW;
          return { i, sx, el: L.add(`<g><clipPath id="${id}"><path d="M${sx - CITY[0]} -900H${sx - CITY[0] + SW + 1}V200H${sx - CITY[0]}Z"/></clipPath><g transform="translate(${CITY[0]} ${CITY[1]})"><g clip-path="url(#${id})">${M}</g></g></g>`) };
        });
        // the enemies: dark ranks on the hills either side, spears up
        const ranks = [-1, 1].map((side) => L.sprite(ranksM(cc, side), CITY[0] + side * 520, CITY[1] + 10));
        // the ring of stakes round the walls
        const stakes = L.add(`<g>${stakesM(cc, CITY[0], CITY[1] + 12, 560)}</g>`);
        const dusts = Array.from({ length: 5 }, () => L.add(`<g>${dust(cc, 60, mix(C.stone, C.dune, 0.4))}</g>`));
        const glass = S2.layer({ par: 0.1, sh: 4 });
        const hg = glass.add(`<g><path d="M0 -2000V-52" stroke="${STRING}" stroke-width="1.3"/>${hourglass(cc, 90)}<g transform="translate(0 78)">${strip(cc, tr('czas twojego nawiedzenia', 'the time of your visitation'), { size: 17 })}</g></g>`);
        P = { whole, slices, ranks, stakes, dusts, hg };
        return L;
      },
    });
    const c = S.c;
    const A = O.act;
    const dis = A.sprite(still(c, [0, 2, 3].map((k, i) => ({ x: -i * 56, y: (i % 2) * 8, s: 0.9, head: 6 + i, armF: 20, o: TWELVE[k].o }))), 250, GY + 4);
    const cR = coltRig(A.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]) })));
    const jEl = A.add(withFace(person(c, CAST.jesus), faceBits(c)));
    const jesus = S.puppet(jEl);
    O.front();

    return (t, time) => {
      const T = time;
      /* v43 — the barricade, the siege on every side (the sky darkens) */
      const dark = es(t, 0.05, 0.5) * (1 - es(t, 2.05, 2.5));
      O.sk2.fade(dark);
      O.update(T, { glow: 0.35 * (1 - dark), sunY: 300 + dark * 120 });
      const rise = es(t, 0.15, 0.55);
      pose(P.stakes, { x: 0, y: (1 - rise) * 90, o: rise > 0.01 ? 1 - es(t, 2.05, 2.4) : 0 });
      P.ranks.forEach((r, i) => { const k = es(t, 0.3 + i * 0.08, 0.85 + i * 0.08); r.set({ x: CITY[0] + (i ? 1 : -1) * lerp(700, 400, k), y: CITY[1] + 10, o: k > 0.01 ? Math.min(1, k * 3) * (1 - es(t, 2.05, 2.4)) : 0 }); });
      /* v44a — dashed to the ground; not one stone upon another */
      const fallOn = t > 1.0 && t < 2.5;
      P.slices.forEach((sl) => {
        const k = es(t, 1.08 + ((sl.i * 3) % NS) * 0.06, 1.55 + ((sl.i * 3) % NS) * 0.06, ease.in);
        const dir = sl.i < NS / 2 ? -1 : 1;
        pose(sl.el, { x: sl.sx + SW / 2 + dir * k * 30, y: CITY[1] + k * 170, r: dir * k * (14 + (sl.i % 3) * 8), ox: sl.sx + SW / 2, oy: CITY[1], o: fallOn ? 1 - es(t, 2.05, 2.4) : 0 });
      });
      pose(P.whole, { o: fallOn ? 0 : 1 });
      P.dusts.forEach((d, i) => { const k = bump(t, 1.3 + i * 0.06, 2.0 + i * 0.06); pose(d, { x: CITY[0] - 360 + i * 180, y: CITY[1] + 20 - k * 30, s: 0.6 + k * 1.2, o: k * 0.9 }); });
      /* v44b — the time of your visitation: the vision fades; the tear */
      const hk = es(t, 2.2, 2.5, ease.back);
      pose(P.hg, { x: CITY[0] + 10, y: lerp(-1300, 270, hk), r: T ? Math.sin(T * 0.7) * 1.5 : 0, o: hk > 0.001 ? 1 : 0 });
      dis.set({ x: 250, y: GY + 4 });
      cR.set({ x: JX - 150, y: GY + 2, s: 0.96, nod: 12, ear: T ? Math.sin(T * 1.2) * 5 : 0, tail: T ? Math.sin(T * 1.6) * 6 : 0 });
      jesus.set({ x: JX, y: GY, s: 1.08, flip: false, armF: 20 + dark * 30, armB: 10 + dark * 20, head: 6 + es(t, 2.1, 2.4) * 6, blink: blinkAt(T) * 0.5 });
      face(jEl, 'sad', 1);
      face(jEl, 'tear', 1);

      S.cam.x = kf(t, [[-0.5, 60], [0.5, 80], [2.1, 60], [2.5, -40]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.5, -20], [2.1, 0], [2.5, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.5, 1.04], [2.1, 1.02], [2.5, 1.14]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -40], [2.1, -40], [2.5, -100]]); S.cam.z = 1.0; }
      void headAt; void shade; void sheet; void seg; void PI; void shadowPerson; void GUARD;
    };
  },
};
/** a ring of sharpened stakes seen across the valley: a front arc below the walls, the ends curling back (origin world) */
function stakesM(c, cx, cy, rx) {
  const s = sheet();
  let d = '', d2 = '';
  for (let i = 0; i <= 44; i++) {
    const u = i / 44, a = PI * (1 - u);
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * 26 - 4;
    const h = 36 + Math.sin(a) * 18, w = 5;
    const stake = c.cut([[x - w, y], [x - w, y - h], [x, y - h - 10], [x + w, y - h], [x + w, y]], 0.3, 4);
    if (i % 2) d += stake; else d2 += stake;
  }
  s.p(d2, mix(C.wood2, C.soilDark, 0.35)).p(d, mix(C.wood, C.soilDark, 0.2));
  s.p(c.ribbon(Array.from({ length: 23 }, (_, i) => { const a = PI * (1 - i / 22); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * 26 - 22]; }), 4), C.soilDark);
  return s.out();
}
/** a dark rank of soldiers with spears, as one shadow cut-out (origin: its foot centre); side -1 left, 1 right */
function ranksM(c, side) {
  let out = '';
  for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) {
    const x = (i - 3) * 30 + r * 14, y = r * 10;
    const fig = shadowPerson(c, { ...GUARD, hairStyle: 'short' }, SHADE);
    out += `<g transform="translate(${x} ${y}) scale(${side < 0 ? 0.3 : -0.3} 0.3)">${fig}<path d="${c.ribbon([[30, -40], [36, -260]], 5)}" fill="${SHADE}"/><path d="${c.poly([[30, -270], [42, -262], [36, -290]])}" fill="${SHADE}"/></g>`;
  }
  return out;
}
