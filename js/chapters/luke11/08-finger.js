// Łk 11,19–20 — the village square. "By whom do your sons cast them out?": on the right, in front of the crowd, two
// young men of the Pharisees' own families lay their hands on a kneeling man and a little dark spirit slips out of him
// and away; Jesus turns His open hand to their fathers, and a question hangs over them. "Therefore they will be your
// judges": the two sons turn round to face their fathers, and a pair of scales comes down over them and tips against
// the Pharisees. "But if I cast out demons by the finger of God": Jesus lifts one finger — a thin line of light comes
// down from the sky to it, and the last little spirits clinging to people in the crowd shoot away and fade. "Then the
// kingdom of God has come upon you": a golden gate comes down onto the hill behind Him and opens, and its light
// spills out over the whole square.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { villageSet, VQ, phOpts, manOf, spirit, qMark, kingdomGate, gateDoor, rayBurst, glow, sparkle, handAt, headAt, hand, kf, moving, PI, HEAVEN } from './lib.js';

const F = VQ.FEET;
const GX = 800, GY = 468;     // the gate of the kingdom on the hill behind

/** a pair of scales on a string (origin: the pivot); .beam tilts, pans hang from its ends */
function scales(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 6, 10), 0.2, 3), C.sun);
  const beam = sheet().p(c.ribbon([[-70, 0], [70, 0]], 5), C.sun).out();
  const pan = (x) => sheet().x(c.ribbon([[x, 0], [x - 22, 40]], 1.2) + c.ribbon([[x, 0], [x + 22, 40]], 1.2), C.ochre).p(c.cut(c.arc(x, 40, 26, 10, 0, PI, 10), 0.3, 4), C.sun).out();
  return `<path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="beam">${beam}<g class="panL">${pan(-70)}</g><g class="panR">${pan(70)}</g></g>${s.out()}`;
}

export default {
  id: 'lk11-finger',
  beats: [
    { v: 19, text: 'Lecz jeśli Ja przez Belzebuba wyrzucam złe duchy, to przez kogo je wyrzucają wasi synowie?' },
    { v: 19, cont: true, text: 'Dlatego oni będą waszymi sędziami.' },
    { v: 20 },
  ],
  cam: { x: [-20, 160], y: [-70, 50], z: [1, 1.12] },
  build(S) {
    const Q = villageSet(S, { sky2: HEAVEN });
    const c = Q.c;
    /* the gate of the kingdom (on the hill behind, in front of the houses) */
    const gk = kingdomGate(c, 120, 170);
    const gLight = Q.flyL.add(`<g opacity="0"><circle cy="-70" r="220" fill="url(#halo-glow)"/>${gk.light}</g>`);
    const gFrame = Q.flyL.add(`<g opacity="0">${gk.frame}</g>`);
    const dL = Q.flyL.add(`<g opacity="0">${gateDoor(c, 60, 116)}</g>`);
    const dR = Q.flyL.add(`<g opacity="0"><g transform="scale(-1 1)">${gateDoor(c, 60, 116)}</g></g>`);
    const spill = Q.rayFx.add(`<g opacity="0">${rayBurst(c, { n: 20, r0: 40, r1: 700, spread: 0.04, color: '#fff3cf', o: 0.45 })}</g>`);
    const beam = Q.backFx.add(`<g opacity="0"><path d="${c.poly([[-3, -900], [3, -900], [2, 0], [-2, 0]])}" fill="#fff6d8"/><circle r="30" fill="url(#halo-glow)"/></g>`);
    const spot = Q.rayFx.add(`<g opacity="0"><ellipse rx="150" ry="130" fill="url(#halo-glow)"/></g>`);
    const floor = Q.rayFx.add(`<g opacity="0"><ellipse rx="700" ry="120" fill="url(#halo-glow)"/></g>`);

    /* the sons casting out a spirit, and the man they pray over */
    const SONS = [0, 1].map((i) => ({ i, p: S.puppet(Q.act.add(person(c, { ...phOpts(i), hair: [C.hair2, C.hair][i], beardColor: [C.hair2, C.hair][i], beard: 'short' }))) }));
    const kneeler = S.puppet(Q.act.add(person(c, { ...manOf(c, { robe: C.sageRobe, hairStyle: 'short', beard: 'short' }), pose: 'kneel' })));
    const imp = Q.act.add(`<g>${spirit(c, 1.1)}</g>`);
    const qm = Q.W.add(`<g opacity="0">${qMark(c, 60)}</g>`);
    const sc = Q.W.add(`<g opacity="0">${scales(c)}</g>`);
    const beamEl = sc.querySelector('.beam'), panL = sc.querySelector('.panL'), panR = sc.querySelector('.panR');
    /* little spirits still clinging to people in the crowd */
    const CL = [[430, 560], [520, 570], [1090, 566], [1200, 556]].map(([x, y], i) => ({ i, x, y, el: Q.W.add(`<g>${spirit(c, 0.8)}</g>`) }));
    const sp = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    const SX = [1000, 1086];     // where the sons stand
    const KX = 1044;

    return (t, time) => {
      const T = time;
      /* v19a — their sons cast out a spirit; Jesus asks the fathers */
      const hands = es(t, 0.1, 0.3) * (1 - es(t, 1.0, 1.2));
      const judge = es(t, 1.05, 1.3);
      SONS.forEach((m) => {
        const x = SX[m.i];
        m.p.set({ x: x + judge * (m.i ? 20 : -30), y: F + 30, s: 0.9, flip: judge > 0.5 ? false : m.i === 1, o: es(t, -0.5, -0.3), armF: 20 + hands * 60 + judge * (m.i ? 70 : 20), armB: 10 + judge * 30, head: 8 * hands - judge * 4, blink: blinkAt(T, 4 + m.i) });
      });
      const up = es(t, 0.5, 0.8);
      kneeler.set({ x: KX, y: F + 32, s: 0.86, flip: true, o: 1 - es(t, 1.0, 1.2), armF: 40 + up * 50, armB: 20 + up * 80, head: 12 - up * 20, blink: blinkAt(T, 6) });
      const flee = es(t, 0.35, 0.8, ease.in);
      const [khx, khy] = headAt(KX, F + 32, 0.86, true, 46);
      pose(imp, { x: lerp(khx + 20, khx + 300, flee), y: lerp(khy - 10, khy - 280, flee), r: flee * 120, s: 1 - flee * 0.4, o: 1 - es(t, 0.6, 0.8) });
      pose(spot, { x: KX, y: F - 60, o: es(t, -0.2, 0.2) * (1 - es(t, 1.9, 2.1)) });
      const qk = es(t, 0.45, 0.6, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(qm, { x: VQ.PX[1] + 10, y: 390, s: qk, r: T ? Math.sin(T * 1.5) * 6 : 0, o: qk > 0.01 ? 1 : 0 });

      /* v19b — they will be your judges: the scales tip against the fathers */
      const sk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      pose(sc, { x: 1060, y: lerp(-500, 330, sk), o: sk > 0.004 ? 1 : 0 });
      const tip = es(t, 1.4, 1.6) * 18;
      pose(beamEl, { r: tip });
      pose(panL, { x: -70, y: 0, r: -tip, ox: -70, oy: 0 });
      pose(panR, { x: 70, y: 0, r: -tip, ox: 70, oy: 0 });

      /* v20 — the finger of God; the kingdom comes */
      const finger = es(t, 2.05, 2.2);
      const turnJ = es(t, 0.2, 0.35) * (1 - es(t, 1.9, 2.05));
      Q.pose(t, T,
        { armF: 16 + turnJ * 50 + finger * 100 - es(t, 2.6, 2.8) * 40, armB: 8 + es(t, 2.6, 2.8) * 70, head: -2 - finger * 10 * (1 - es(t, 2.6, 2.8)), blink: blinkAt(T, 2) },
        (d) => ({ head: -6, armF: 10 + es(t, 2.6, 2.8) * 50, armB: 6 + es(t, 2.6, 2.8) * 90, blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x + 40, y: F - 28 + (m.i % 2) * 6, s: 0.9, head: judge * 10, lean: judge * 4, blink: Math.max(judge * 0.4, blinkAt(T, m.seed)) }));
      Q.amaze(es(t, 2.6, 2.85));
      Q.sk2.layer.fade(es(t, 2.1, 2.5) * 0.4 + es(t, 2.55, 2.8) * 0.4);
      const [fx, fy] = hand(VQ.JX, F - 14, 1.04, false, 116);
      const bk = es(t, 2.1, 2.25) * (1 - es(t, 2.6, 2.75));
      pose(beam, { x: fx, y: fy - 2, sy: bk, o: bk });
      CL.forEach((s) => {
        const f = es(t, 2.25 + s.i * 0.04, 2.55 + s.i * 0.04, ease.in);
        pose(s.el, { x: s.x + (s.x < 800 ? -1 : 1) * f * 260, y: s.y - f * 300 + (T ? Math.sin(T * 2 + s.i) * 4 : 0) * (1 - f), r: f * 140, s: 1 - f * 0.4, o: (1 - es(t, 2.4 + s.i * 0.04, 2.58 + s.i * 0.04)) * es(t, -0.5, -0.2) });
      });
      const gd = es(t, 2.5, 2.8, ease.out);
      const gOn = gd > 0.004 ? 1 : 0;
      const gy = lerp(-200, GY, gd);
      pose(gFrame, { x: GX, y: gy, o: gOn });
      pose(gLight, { x: GX, y: gy, o: gOn });
      const open = es(t, 2.8, 2.95);
      pose(dL, { x: GX - 60, y: gy, sx: 1 - open * 0.85, o: gOn });
      pose(dR, { x: GX + 60, y: gy, sx: 1 - open * 0.85, o: gOn });
      pose(spill, { x: GX, y: GY - 70, s: 0.5 + open * 0.6, r: T * 3, o: open * 0.9 });
      pose(floor, { x: 800, y: F, s: 0.5 + open * 0.5, o: open * 0.8 });
      sp.forEach((s, i) => pose(s, { x: [620, 800, 980][i], y: [520, 360, 520][i], s: bump(t, 2.85 + i * 0.05, 3.0), r: T * 40, o: es(t, 2.85 + i * 0.05, 2.95 + i * 0.05) }));

      S.cam.x = kf(t, [[-0.5, 30], [1.9, 30], [2.1, 0]]);
      if (S.portrait) S.cam.x = kf(t, [[-0.5, 140], [1.9, 140], [2.1, 0]]);   // phone: the sons and the scales clear of the thread
      S.cam.y = kf(t, [[-0.5, 30], [1.0, 20], [1.9, 20], [2.1, 30], [2.5, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [1.9, 1.08], [2.1, 1.1], [2.5, 1.02]]);
    };
  },
};
