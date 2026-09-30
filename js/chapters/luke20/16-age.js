// Łk 20,34–36 — Jesus answers. "The children of this age marry and are given in marriage": a painted panel comes down
// over the court — a wedding under its canopy in a village street, bride and groom, a girl with a tambourine, a gold
// ring glinting. "But those counted worthy to attain that age and the resurrection from the dead neither marry nor are
// given in marriage": the wedding flies up, and a golden panel comes down in its place — a hillside at sunrise, the
// tombs standing open and empty, the risen in white coming up out of them with their hands raised; the two rings rise
// from the wedding and fade away above. "For they can no longer die; they are like the angels, and are children of
// God, being children of the resurrection": two angels come down on their strings either side of the golden panel,
// and over it a gold word: "children of the resurrection".
import { C, blinkAt, pose, lerp, sheet, mix, shade, crowdPerson } from '../kit.js';
import { courtSet, CQ, SADDUCEES, panel, panelSky, panelGround, figure, BRIDE, BROTHERS, angelFig, risen, ring, tombIcon, goldWord, popAt, dropIn, kf, tr, es, ease, bump, seg, PI, makeCutter } from './lib.js';

const PW = 340, PH = 200;

function weddingInner(S, c) {
  let m = panelSky(S, PW, PH, ['#d6dcd4', '#f3e4c4']);
  const s = sheet();
  let hs = '';
  [[-170, 90], [-80, 70], [30, 100], [120, 80]].forEach(([x, h]) => { hs += c.cut(c.rect(x, 40 - h, 86, h + 40), 0.4, 6); });
  s.p(hs, mix(C.plaster2, C.sand, 0.3));
  m += s.out() + panelGround(c, PW, 70, mix(C.sand, C.stone, 0.4), 2);
  // the canopy on four poles
  const cn = sheet();
  cn.p(c.ribbon([[-60, 74], [-60, -40]], 4) + c.ribbon([[60, 74], [60, -40]], 4), C.wood2);
  cn.p(c.cut([[-74, -40], [74, -44], [70, -24], [50, -30], [30, -22], [10, -30], [-10, -22], [-30, -30], [-50, -22], [-72, -28]], 0.5, 5), C.roseRobe);
  m += cn.out();
  m += figure(c, { ...BROTHERS[2], mantle: C.tealRobe }, { x: -22, y: 78, s: 0.5, armF: 40, head: 6 });
  m += figure(c, BRIDE, { x: 24, y: 78, s: 0.48, flip: true, armF: 40, head: -4 });
  const g = makeCutter('lk20-guest');
  m += figure(c, { ...crowdPerson(g), hairStyle: 'veil', beard: 'none' }, { x: -120, y: 80, s: 0.44, armF: 120, armB: 150 });
  m += figure(c, crowdPerson(makeCutter('lk20-guest2')), { x: 118, y: 80, s: 0.46, flip: true, armF: 60 });
  return m;
}
function ageInner(S, c) {
  let m = panelSky(S, PW, PH, ['#f3d9a4', '#fbefd6']);
  m += `<circle cx="0" cy="10" r="70" fill="${mix(C.sun, C.halo, 0.5)}" opacity=".8"/>`;
  m += sheet().p(c.cut([[-PW / 2 - 10, 20], [-60, 4], [70, 14], [PW / 2 + 10, 0], [PW / 2 + 10, 80], [-PW / 2 - 10, 80]], 0.8, 10), mix(C.hillMid, C.halo, 0.35)).out();
  m += panelGround(c, PW, 70, mix(C.sand, C.halo, 0.4), 2);
  [-120, 0, 120].forEach((x, i) => { m += `<g transform="translate(${x + (i === 1 ? 0 : 10)} ${i === 1 ? 44 : 50}) scale(1.1)">${tombIcon(c, { open: true }).replace(/<circle[^>]*\/>/, '')}</g>`; });
  [[-150, 0, 0], [-76, 3, 1], [52, 5, 1], [140, 1, 0]].forEach(([x, k, f]) => { m += figure(c, risen(BROTHERS[k]), { x, y: 82, s: 0.46, flip: !!f, armF: 110, armB: 150, head: -8 }); });
  return m;
}

export default {
  id: 'lk20-age',
  beats: [
    { v: 34 },
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-20, 40], y: [-80, 20], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: SADDUCEES });
    const c = Q.c;
    const wed = Q.flyL.add(panel(S, weddingInner(S, c), { w: PW, h: PH, word: tr('synowie tego świata', 'the children of this age') }));
    const age = Q.flyL.add(panel(S, ageInner(S, c), { w: PW, h: PH, word: tr('świat przyszły', 'that age'), face: C.halo }));
    const rings = [0, 1].map(() => Q.flyL.add(`<g>${ring(c, 12)}</g>`));
    const angels = [0, 1].map((i) => Q.flyL.add(`<g><path d="M0 -1600V-170" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${angelFig(c, { s: 0.62, flip: i === 1, armF: 70, armB: 130, head: -6 })}</g>`));
    const word = Q.flyL.add(`<g>${goldWord(c, tr('dzieci zmartwychwstania', 'children of the resurrection'), { size: 22 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v34 — the wedding of this age */
      const wk = dropIn(wed, t, 0.05, 1.3, CQ.JX, 290, { d: 0.28 });
      const wy = lerp(-1500, 290, wk);
      /* v35 — that age: the golden panel; the rings float away */
      dropIn(age, t, 1.15, undefined, CQ.JX, 290, { d: 0.3 });
      rings.forEach((el, i) => {
        const on = es(t, 0.35, 0.5, ease.back);
        const u = es(t, 1.05, 1.7);
        const x = CQ.JX + (i ? 12 : -10) + u * (i ? 260 : -260), y = lerp(wy + 10, 60, u);
        pose(el, { x, y, s: Math.max(0.001, on * (1 - u * 0.5)), r: u * (i ? 200 : -200), o: on > 0.01 ? 1 - es(t, 1.55, 1.75) : 0 });
      });
      /* v36 — like the angels; children of the resurrection */
      angels.forEach((el, i) => dropIn(el, t, 2.08 + i * 0.08, undefined, i ? 1080 : 520, 330, { T, d: 0.3, sw: 1.5 }));
      dropIn(word, t, 2.3, undefined, CQ.JX, 150, { d: 0.25 });
      const up = bump(t, 1.1, 2.9);
      Q.pose(t, T,
        { armF: 16 + es(t, 0.05, 0.3) * 40, armB: 8 + es(t, 1.1, 1.4) * 100, head: -up * 8, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - up * 10, blink: blinkAt(T, d.seed) }),
        (m) => ({ head: -up * 10, armF: 8 + (m.i === 1 ? es(t, 2.3, 2.6) * 30 : 0), blink: blinkAt(T, m.seed) }));
      Q.amaze(es(t, 2.2, 2.5) * 0.8);
      void seg; void PI; void shade; void C;

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -20], [0.4, -50], [2.0, -50], [2.4, -60]]);
      S.cam.z = kf(t, [[0, 1.04], [2.0, 1.04], [2.4, 1.0]]);
    };
  },
};
