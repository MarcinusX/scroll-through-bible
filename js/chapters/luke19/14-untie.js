// Łk 19,32–34 — Bethphage, a village lane on the slope of the mount. The two who were sent come in round the corner
// and there it is, just as He said: a young colt tied by its halter to an iron ring beside a door — a little sparkle
// over its back, never yet ridden. One kneels to work the knot loose, the other strokes the colt's neck. The door opens
// and its owners come out: "Why are you untying the colt?" "The Lord needs it," says the disciple, pointing back up
// the road to the Mount — and the old owner nods and smiles and waves them on.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, house, sun, cloud, olive, palm, cypress, grass } from '../../assets/nature.js';
import { TWO, OWNER, OWNER2, colt, coltRig, say, sparkle, headAt, hand, kf, tr, es, ease, bump, seg, PI, OLIVET, mix, shade, sheet } from './lib.js';

const FL = 712, DX = 860, RING = [930, 560];
const CX = 1010;                         // the colt

export default {
  id: 'lk19-untie',
  beats: [
    { v: 32 },
    { v: 33 },
    { v: 34 },
  ],
  cam: { x: [-80, 200], y: [-40, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, OLIVET);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 36), { x: 360, y: 150, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.lavender, 0.15) }).markup);
    const mid = S.layer({ par: 0.18, sh: 3 });
    mid.add(hillsWith(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 26, treeColor: mix(C.olive, C.sage, 0.4), treeH: 20 }).markup);
    /* the lane: houses behind, the owner's house with its door and ring */
    const back = S.layer({ par: 0.3, sh: 3 });
    let bh = '';
    [[-200, 120, 110], [-40, 100, 90], [1240, 130, 120], [1420, 100, 90], [1600, 120, 110]].forEach(([x, w, h]) => { bh += house(c, x, 600, w, h, { stairs: true }); });
    back.add(bh + olive(c, 280, 610, 0.9) + cypress(c, 1180, 606, 130) + palm(c, 1560, 600, 200));
    const houseL = S.layer({ par: 0.45, sh: 4 });
    houseL.add(ownerHouse(c));
    const groundL = S.layer({ par: 0.45, sh: 3 });
    const g = sheet().p(c.cut([[-900, FL - 6], [2500, FL - 6], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.sand, C.stone, 0.4));
    let pb = '';
    for (let i = 0; i < 40; i++) pb += c.cut(c.blob(c.rr(-600, 2200), c.rr(FL + 10, 1000), c.rr(6, 12), c.rr(3, 5), 7, 0.2), 0.3, 3);
    g.x(pb, shade(C.stone, -0.12), 'opacity=".5"');
    groundL.add(g.out() + grass(c, { x0: -600, x1: 2200, y: FL + 4, n: 30, h: 12, color: C.olive }));

    const A = S.layer({ par: 0.5, sh: 5 });
    const rope = A.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [30, 30], [60, 18], 10), 3)}" fill="${C.rope}"/></g>`);
    const ropeLoose = A.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [10, 30], [6, 54], 10), 3)}" fill="${C.rope}"/></g>`);
    const coltR = coltRig(A.add(colt(c)));
    const owners = [OWNER, OWNER2].map((o, i) => ({ i, p: S.puppet(A.add(person(c, o))) }));
    const d0 = S.puppet(A.add(person(c, TWO[0])));
    const d0k = S.puppet(A.add(person(c, { ...TWO[0], pose: 'kneel' })));
    const d1 = S.puppet(A.add(person(c, TWO[1])));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const spk = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    const ask = fx.add(`<g>${say(c, tr(['Czemu odwiązujecie', 'oślę?'], ['Why are you', 'untying the colt?']), { size: 19, side: -1 })}</g>`);
    const need = fx.add(`<g>${say(c, tr('Pan go potrzebuje!', 'The Lord needs it!'), { size: 20, side: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 360, 150, T, 1, 0.6);
      /* v32 — they went and found it just as He had told them */
      const come = es(t, -0.5, 0.45);
      const x0 = lerp(360, 880, come), x1 = lerp(280, 700, come);
      const kneel = es(t, 1.02, 1.08) * (1 - es(t, 2.0, 2.06));
      d0.set({ x: x0, y: FL + 10, s: 0.94, walk: come > 0 && come < 1 ? x0 * 0.06 : undefined, armF: 14 + es(t, 0.5, 0.7) * 60 * (1 - kneel) + es(t, 2.1, 2.3) * 80, armB: es(t, 2.1, 2.3) * 40, head: 2, o: 1 - kneel, flip: t > 2.05, blink: blinkAt(T, 3) });
      d0k.set({ x: 880, y: FL + 10, s: 0.94, o: kneel, armF: 100 + Math.sin(T * 6) * 8 * (t > 1.1 && t < 2 ? 1 : 0), armB: 60, head: -8, blink: blinkAt(T, 3) });
      const d1x = x1 + es(t, 0.5, 0.9) * 360;
      d1.set({ x: d1x, y: FL + 14, s: 0.92, flip: false, walk: (come > 0 && come < 1) || (t > 0.5 && t < 0.9) ? d1x * 0.06 : undefined, armF: 30 + es(t, 0.9, 1.1) * 60, armB: 10, head: 6, blink: blinkAt(T, 4) });
      const lead = 0;
      coltR.set({ x: CX - lead * 120, y: FL + 6, s: 0.92, flip: lead > 0.02, walk: lead > 0 && lead < 1 ? lead * 12 : undefined, nod: bump(t, 0.5, 0.9) * 8 + (T ? Math.sin(T * 0.8) * 2 : 0), ear: (T ? Math.sin(T * 1.3) * 6 : 0) + bump(t, 1.2, 1.6) * 14, tail: T ? Math.sin(T * 1.7) * 8 : 0 });
      const untied = es(t, 1.8, 1.95);
      pose(rope, { x: RING[0], y: RING[1], o: 1 - untied });
      pose(ropeLoose, { x: RING[0], y: RING[1], o: untied * (1 - lead) });
      spk.forEach((e, i) => { const k = bump(t, 0.45 + i * 0.1, 0.95 + i * 0.1); pose(e, { x: CX - 30 + i * 36, y: FL - 170 - (i % 2) * 20, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });
      /* v33 — the owners: "Why are you untying the colt?" */
      owners.forEach((m) => {
        const out = es(t, 1.05 + m.i * 0.1, 1.4 + m.i * 0.1);
        const x = lerp(DX, 700 - m.i * 70, out);
        m.p.set({ x, y: FL + 8 - m.i * 4, s: 0.94 - m.i * 0.02, flip: false, o: seg(t, 1.05 + m.i * 0.1, 1.12 + m.i * 0.1), walk: out > 0 && out < 1 ? x * 0.06 : undefined, armF: 20 + es(t, 1.4, 1.6) * 50 * (1 - es(t, 2.4, 2.6)) + es(t, 2.45, 2.65) * 70, armB: es(t, 2.45, 2.65) * (m.i ? 120 : 40), head: es(t, 2.2, 2.4) * 8, blink: blinkAt(T, 7 + m.i) });
      });
      const [ohx, ohy] = headAt(700, FL + 8, 0.94, false);
      const ak = es(t, 1.4, 1.55, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(ask, { x: ohx - 6, y: ohy - 26, s: ak, o: ak > 0.02 ? 1 : 0 });
      /* v34 — "The Lord needs it" */
      const [dhx, dhy] = headAt(880, FL + 10, 0.94, true);
      const nk = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(need, { x: dhx + 10, y: dhy - 40, s: nk, o: nk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -40], [0.5, 60], [1.2, 20], [2.1, 40]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 40], [1.2, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.18], [1.2, 1.2], [2.6, 1.14]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -40], [0.5, 200], [1.0, 180], [1.4, 0], [2.1, 40]]); S.cam.z = 1.0; }
      void hand; void cloud; void PI;
    };
  },
};
/** the owner's house: a plastered front with a wooden door (the owners come out of it) and an iron ring by the door */
function ownerHouse(c) {
  const s = sheet();
  const x0 = 640, x1 = 1120, top = 380;
  s.p(c.cut([[x0, FL], [x0, top], [x1, top], [x1, FL]], 0.6, 12), mix(C.plaster, C.sand, 0.3));
  s.p(c.cut([[x0 - 10, top - 12], [x1 + 10, top - 12], [x1 + 10, top + 4], [x0 - 10, top + 4]], 0.4, 10), C.roof);
  s.p(c.cut([[DX - 44, FL], [DX - 44, FL - 150], ...c.arc(DX, FL - 150, 44, 30, PI, 2 * PI, 10), [DX + 44, FL - 150], [DX + 44, FL]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
  s.p(c.ribbon([[DX - 50, FL], [DX - 50, FL - 150]], 8) + c.ribbon([[DX + 50, FL], [DX + 50, FL - 150]], 8), C.stone2);
  s.p(c.cut(c.rect(x0 + 60, top + 60, 50, 50), 0.3, 5) + c.cut(c.rect(x1 - 110, top + 60, 50, 50), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
  let sp = '';
  for (let i = 0; i < 8; i++) sp += c.cut(c.blob(c.rr(x0 + 30, x1 - 30), c.rr(top + 30, FL - 30), c.rr(10, 22), c.rr(4, 8), 8, 0.2), 0.5, 4);
  s.x(sp, C.plaster2, 'opacity=".6"');
  s.x(`M${RING[0] + 6} ${RING[1]}a6 6 0 1 1 -12 0a6 6 0 1 1 12 0Z`, 'none', `stroke="${C.soilDark}" stroke-width="3"`);
  return s.out();
}
