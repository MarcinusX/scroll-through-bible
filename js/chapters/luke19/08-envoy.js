// Łk 19,14–15a — the flat stretches from his own town, on the left, to the far country on the right. At the town
// gate his fellow citizens gather, scowling; they hated him: fists up, little puffs of anger. They send a delegation
// after him — an elder in a red mantle sets off down the road with a sealed scroll. Far away, under the white columns
// of the great king's portico, the nobleman kneels before the throne of the ruler who gives kingdoms; the envoy comes
// in, bows, and unrolls the scroll: "We do not want this man to reign over us." And yet the ruler lifts a golden crown
// and sets it on the nobleman's head — and, a king now, he rises and turns for home.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, cloud, sun, palm, cypress, olive, grass } from '../../assets/nature.js';
import { NOBLE, CITIZ, ENVOY, SEA, caesar, crown, addToHead, angryFace, puff, decree, scrollRolled, still, folk, storyFrame, walledCityM, kingThrone, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix, shade, sheet } from './lib.js';

const FL = 716, P = 0.6;
const GATE = 330, THX = 1290, NK = 1150;

export default {
  id: 'lk19-envoy',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 14, text: 'Ale jego współobywatele nienawidzili go i wysłali za nim poselstwo z oświadczeniem:' },
    { v: 14, cont: true, text: '"Nie chcemy, żeby ten królował nad nami".' },
    { v: 15, text: 'Gdy po otrzymaniu godności królewskiej wrócił,' },
  ],
  cam: { x: [-520, 680], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, SEA, { rise: 0 });
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 36), { x: 1100, y: 140, len: 800 });
    const cls = [[300, 150, 160], [800, 110, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.lavender, 0.2), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(hillsWith(c, { y: 520, amps: [10, 5, 2], lens: [800, 300, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 18, x0: -1400, x1: 3000 }).markup);
    /* the ground, the road from the town gate to the portico */
    const gL = S.layer({ par: P, sh: 3 });
    const g = sheet().p(c.ridge(c.wave(FL - 36, [4, 2], [600, 200]), -1400, 3000, 1800, 12, 1), mix(C.sand, C.sage2, 0.35));
    g.p(c.ribbon([[-600, FL + 6], [400, FL + 4], [900, FL - 4], [1600, FL + 8], [2400, FL]], 70), mix(C.sand2, C.stone, 0.3));
    gL.add(g.out() + grass(c, { x0: -800, x1: 2400, y: FL + 70, n: 36, h: 12, color: C.olive }) + olive(c, 760, FL - 30, 0.8) + cypress(c, 880, FL - 30, 120));
    /* his town's gate on the left */
    const townL = S.layer({ par: P, sh: 4 });
    townL.add(`<g transform="translate(${GATE - 60} ${FL - 20})">${walledCityM(c, 0, 0, 1.5, { wall: mix(C.stone, C.sand, 0.4), wall2: mix(C.stone2, C.sand2, 0.4) })}</g>` + palm(c, GATE - 250, FL - 20, 200));
    /* the great king's portico on the right */
    const porL = S.layer({ par: P, sh: 4 });
    porL.add(portico(c, 1040, 1560, FL - 16));
    porL.add(`<g transform="translate(${THX} ${FL - 20}) scale(.82)">${kingThrone(c, { cushion: mix(C.curtain2, C.plumRobe, 0.3) })}</g>`);

    /* people */
    const act = S.layer({ par: P, sh: 5 });
    const citL = CITIZ.map((o, i) => ({ i, x: GATE + 60 + i * 66, p: S.puppet(act.add(addToHead(person(c, o), `<g class="ang">${angryFace(c)}</g>`))) }));
    const back = act.sprite(still(c, Array.from({ length: 5 }, (_, i) => ({ x: -i * 50, y: -10 + (i % 2) * 6, s: 0.8, flip: false, armF: 30 + (i % 2) * 60, armB: (i % 3) * 50, o: folk(c) }))), GATE + 20, FL - 6);
    const puffs = citL.map(() => act.add(`<g>${puff(c, 13)}</g>`));
    const envoy = S.puppet(act.add(person(c, { ...ENVOY, holdF: `<g transform="translate(0 10)">${scrollRolled(c, 40)}</g>` })));
    const emperor = S.puppet(act.add(caesar(c, { pose: 'sit' })));
    const kneel = S.puppet(act.add(person(c, { ...NOBLE, pose: 'kneel' })));
    const kingUp = S.puppet(act.add(addToHead(person(c, NOBLE), crown(c))));
    const gift = act.add(`<g><g transform="scale(1.3)">${crown(c)}</g></g>`);
    const fx = S.layer({ par: P, sh: 6 });
    const scroll = fx.add(`<g>${decree(c, tr(['Nie chcemy,', 'żeby ten królował', 'nad nami!'], ['We don’t want', 'this man to reign', 'over us!']), { size: 22, ink: C.curtain2 })}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1100, 140, T, 1, 0.6);
      cls.forEach((k) => swing(k.el, k.x + (T ? Math.sin(T * 0.1 + k.i) * 16 : 0), k.y, T, 1.1, 0.6, k.i));
      back.set({ x: GATE + 20, y: FL - 6 });
      /* v14a — they hated him: they send an envoy after him */
      const hate = es(t, -0.2, 0.3);
      citL.forEach((m) => {
        const k = hate * (1 - es(t, 2.9, 3.0) * 0);
        m.p.set({ x: m.x, y: FL + 6 + (m.i % 2) * 8, s: 0.9, flip: false, armF: 20 + k * [70, 30, 80, 40][m.i], armB: 10 + k * [40, 140, 20, 120][m.i], lean: -k * 4, head: 4, blink: blinkAt(T, m.i + 5) });
        const pk = bump(t, 0.1 + m.i * 0.08, 1.0 + m.i * 0.05);
        const [hx, hy] = headAt(m.x, FL + 6, 0.9, false);
        pose(puffs[m.i], { x: hx + 18, y: hy - 40 - pk * 16, s: pk, r: T * 30 + m.i * 40, o: pk > 0.02 ? 1 : 0 });
      });
      const EK = [[0.35, GATE + 320], [1.15, NK + 40 - 180 + 60]];
      const ex = kf(t, EK, (x) => x);
      const eIn = seg(t, 0.3, 0.38);
      const unroll = es(t, 1.2, 1.4);
      envoy.set({ x: ex, y: FL + 6, s: 0.92, flip: false, o: eIn * (1 - es(t, 2.5, 2.7)), walk: t > 0.35 && t < 1.15 ? ex * 0.06 : undefined, lean: bump(t, 1.12, 1.3) * 12, armF: 30 + unroll * 50, armB: unroll * 40, head: 2, blink: blinkAt(T, 9) });
      /* v14b — "We do not want this man to reign over us" */
      const dk = es(t, 1.2, 1.45, ease.back) * (1 - es(t, 2.1, 2.3));
      pose(scroll, { x: 1010, y: lerp(-1300, 330, dk), r: T ? Math.sin(T * 0.8) * 1 : 0, o: dk > 0.001 ? 1 : 0 });
      /* the great king on his throne; the nobleman kneels */
      emperor.set({ x: THX + 6, y: FL - 40, s: 1.0, flip: true, armF: 30 + es(t, 2.0, 2.2) * 60 + bump(t, 1.3, 1.9) * 20, armB: 20, head: bump(t, 1.3, 1.9) * -6 + es(t, 2.0, 2.2) * 8, blink: blinkAt(T, 2) });
      /* v15a — having received the kingdom, he returns */
      const crowned = es(t, 2.3, 2.34);
      const turnHome = es(t, 2.4, 2.45);
      const home = es(t, 2.45, 3.0);
      kneel.set({ x: NK, y: FL + 6, s: 0.96, flip: false, o: 1 - crowned, armF: 60, armB: 30, head: 8 - es(t, 1.3, 1.6) * 6, blink: blinkAt(T, 4) });
      const kx = lerp(NK, NK - 330, home);
      kingUp.set({ x: kx, y: FL + 6, s: 0.98, flip: turnHome > 0.5, o: crowned, walk: home > 0 && home < 1 ? kx * 0.06 : undefined, armF: 20 + bump(t, 2.3, 2.45) * 40, armB: 10, head: -4, blink: blinkAt(T, 4) });
      const ck = es(t, 2.02, 2.3);
      const [ehx, ehy] = hand(THX + 6, FL - 40, 1.0, true, 90, 0, 62);
      const [nhx, nhy] = headAt(NK, FL + 6, 0.96, false, 46);
      pose(gift, { x: lerp(ehx, nhx, ck), y: lerp(ehy - 20, nhy - 26, ck) - Math.sin(ck * PI) * 40, s: lerp(1, 0.75, ck), o: ck > 0.01 && crowned < 1 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -440], [0.35, -420], [1.1, 560], [2.4, 580], [2.95, 420]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 30], [1.2, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.5, 1.1], [1.2, 1.08], [2.2, 1.12]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -380], [0.35, -380], [1.1, 600], [2.4, 640], [2.95, 480]]); S.cam.z = 1.0; }
      void shade; void ease;
    };
  },
};
/** the great king's portico: a stepped podium, white columns under a pediment (origin world) */
function portico(c, x0, x1, y) {
  const s = sheet();
  const col = mix(C.cream, C.stone, 0.25);
  s.p(c.cut([[x0 - 30, y + 30], [x0 - 20, y - 4], [x1 + 20, y - 4], [x1 + 30, y + 30]], 0.4, 10), mix(C.stone, C.cream, 0.4));
  s.p(c.cut([[x0, y - 300], [x1, y - 300], [x1, y - 4], [x0, y - 4]], 0.5, 12), mix(C.plaster2, C.lavender, 0.2));
  let cl = '';
  for (let x = x0 + 20; x <= x1 - 20; x += 86) cl += c.cut([[x - 18, y - 4], [x - 15, y - 300], [x + 15, y - 300], [x + 18, y - 4]], 0.3, 8);
  s.p(cl, col);
  s.p(c.cut([[x0 - 30, y - 300], [x1 + 30, y - 300], [x1 + 30, y - 330], [x0 - 30, y - 330]], 0.4, 10), col);
  s.p(c.cut([[x0 - 40, y - 330], [(x0 + x1) / 2, y - 400], [x1 + 40, y - 330]], 0.4, 10), mix(C.cream, C.stone, 0.1));
  s.x(c.poly(c.circ((x0 + x1) / 2, y - 356, 14, 14)), C.sun);
  return s.out();
}
