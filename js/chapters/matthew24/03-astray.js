// Mt 24,4–5 — twilight on the Mount. "Take heed that no one leads you astray": Jesus lifts a warning hand, and a
// painted plate comes down — a road climbing to a gate of light, travellers on it. "Many will come in my name,
// saying: I am the Messiah" — at the fork two figures rise, gilded masks and paper crowns, each with his slip "I am
// the Christ". "And they will lead many astray" — they beckon down the side paths and most of the travellers follow
// them off into the thorns; only a few go on up to the light.
import { C, person, blinkAt, pose, lerp, mix, shade, sheet } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, plate, mask, crownIcon, addToHead, word, along, voiceRings, folk, tr, PI } from './lib.js';

const AW = 540, AH = 262, SA = 1.14, AX = 800, AY = 126;
const ROAD = [[-40, 250], [-14, 224], [16, 196], [8, 170], [-8, 142], [-2, 116], [0, 96]];
const FORK = [16, 196];
const LEFTP = [[16, 196], [-40, 190], [-100, 184], [-160, 186], [-212, 190]];
const RIGHTP = [[16, 196], [70, 192], [128, 186], [180, 190], [222, 194]];

/** the painting on the plate (origin: the plate's top centre) */
function roadScene(c) {
  const s = sheet();
  s.p(c.cut([[-AW / 2 + 10, 10], [AW / 2 - 10, 10], [AW / 2 - 10, 130], [-AW / 2 + 10, 130]], 0.3, 10), mix(C.parchment, C.dawn, 0.5));
  s.p(c.cut([[-AW / 2 + 10, 150], [-170, 104], [-80, 124], [0, 100], [90, 120], [180, 100], [AW / 2 - 10, 132], [AW / 2 - 10, AH - 10], [-AW / 2 + 10, AH - 10]], 0.8, 8), mix(C.hillMid, C.sage, 0.3));
  s.p(c.cut([[-AW / 2 + 10, 196], [-140, 170], [-40, 186], [60, 172], [160, 168], [AW / 2 - 10, 180], [AW / 2 - 10, AH - 10], [-AW / 2 + 10, AH - 10]], 0.8, 8), C.hillNear);
  s.p(c.ribbon(ROAD, (u) => 22 - u * 16), mix(C.sand, C.cream, 0.35));
  s.p(c.ribbon(LEFTP, (u) => 12 - u * 5) + c.ribbon(RIGHTP, (u) => 12 - u * 5), mix(C.sand2, C.rock2, 0.45));
  let th = '';
  for (let i = 0; i < 9; i++) th += c.cut(c.star(-214 + c.rr(-10, 16), 182 + c.rr(-20, 10), c.rr(13, 19), c.rr(4, 7), 7, c.rr(0, 1)), 0.6, 3);
  for (let i = 0; i < 9; i++) th += c.cut(c.star(222 + c.rr(-16, 10), 186 + c.rr(-20, 10), c.rr(13, 19), c.rr(4, 7), 7, c.rr(0, 1)), 0.6, 3);
  s.p(th, mix(C.thorn2, C.night2, 0.35));
  // the gate of light at the top of the road
  s.p(c.cut([[-18, 100], [-18, 64], ...c.arc(0, 64, 18, 18, PI, 2 * PI, 8), [18, 100]], 0.4, 4), C.halo);
  s.x(c.cut([[-10, 100], [-10, 70], ...c.arc(0, 70, 10, 10, PI, 2 * PI, 6), [10, 100]], 0.3, 3), '#fffaf0');
  return s.out() + `<circle cx="0" cy="84" r="90" fill="url(#halo-glow)"/>`;
}

export default {
  id: 'mt24-astray',
  beats: [
    { v: 4 },
    { v: 5, text: 'Wielu bowiem przyjdzie pod moim imieniem i będą mówić: Ja jestem Mesjaszem.' },
    { v: 5, cont: true, text: 'I wielu w błąd wprowadzą.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.26;
    const set = olivesSet(S, { skyCols: SKIES.twilight, tintK: TK, sunXY: [1150, 420], moonXY: [1210, 150] });

    set.sk.blend(SKIES.twilight, SKIES.night, 0.25);
    const P = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, P, { tintCol: C.duskViolet, tintK: TK * 0.45 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });

    /* the plate */
    const pA = S.layer({ par: 0.3, sh: 6 });
    const A = { el: pA.add(`<g transform="translate(0 -1500)">${plate(c, AW, AH)}${roadScene(c)}</g>`) };
    const TRAV = Array.from({ length: 7 }, (_, i) => ({ i, u0: 0.02 + i * 0.07, way: [0, -1, 1, 0, -1, 1, 1][i], seed: c.rr(0, 9), p: S.puppet(pA.add(person(c, folk(c)))) }));
    const MASKS = [[C.plumRobe, C.sun, -1], [C.indigo, C.halo, 1]].map(([robe, gold, side], i) => {
      const extra = `<g transform="translate(6 0)">${mask(c, { col: gold, r: 22, stick: false })}</g><g transform="translate(2 -18)">${crownIcon(c, 34, gold)}</g>`;
      const fig = addToHead(person(c, { robe, mantle: gold, hairStyle: 'wrap', veil: robe, veil2: gold, beard: 'none', skin: C.skin2, belt: gold }), extra);
      return { i, side, p: S.puppet(pA.add(fig)), tag: pA.add(`<g transform="translate(0 -1500)">${word(c, tr('Ja jestem Mesjaszem', 'I am the Christ'), { size: 15, fill: mix(C.halo, C.cream, 0.4) })}</g>`), seed: c.rr(0, 9) };
    });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 520, sunO: 0, moon: 150 + (1 - es(t, 0.5, 3)) * 50, moonO: es(t, 0.2, 1.5), glow: 0.45, starsO: 0.3 + es(t, 0, 3) * 0.4 });

      /* the plate comes down (beat 0) */
      const aIn = es(t, 0.05, 0.45, ease.back);
      const ay = lerp(-460, AY, aIn);
      const on = aIn > 0.001 ? 1 : 0;
      pose(A.el, { x: AX, y: ay, s: SA, r: Math.sin(T * 0.7) * 0.4 * aIn, o: on });
      const at = (lx, ly) => [AX + lx * SA, ay + ly * SA];

      /* travellers walk up the road; at the fork most turn off after the masks */
      const go = (m) => es(t, 2.05 + m * 0.04, 2.85);
      TRAV.forEach((tv) => {
        const base = Math.min(0.4 - tv.i * 0.035, tv.u0 + es(t, 0.1, 1.0) * 0.4);
        let pt = along(ROAD, base), walking = (t > 0.1 && t < 1.0);
        if (tv.way === 0) {
          const up = es(t, 2.05, 2.9);
          if (up > 0) { pt = along(ROAD, base + up * (0.98 - base)); walking = up < 1; }
        } else {
          const w = go(tv.i);
          if (w > 0) {
            const q = along(tv.way < 0 ? LEFTP : RIGHTP, w * (0.95 - (tv.i % 3) * 0.08));
            const k = Math.min(1, w * 5);
            pt = [lerp(pt[0], q[0], k), lerp(pt[1], q[1], k), q[2]];
            walking = w < 1;
          }
        }
        const [x, y] = at(pt[0], pt[1]);
        const look = es(t, 1.2, 1.4) * (1 - es(t, 2.0, 2.1));
        const fade = tv.way === 0 ? 1 : 1 - es(t, 2.6 + tv.i * 0.02, 2.95) * 0.6;
        tv.p.set({ x, y, s: 0.24 * SA, flip: pt[2] < 0, o: on * fade, walk: walking ? x * 0.12 : undefined, head: -look * 8, blink: blinkAt(T, tv.seed) });
      });

      /* the masked, crowned ones rise at the fork, each with "I am the Christ" (beat 1), then lead off (beat 2) */
      MASKS.forEach((m) => {
        const up = es(t, 1.05 + m.i * 0.15, 1.4 + m.i * 0.15, ease.out);
        const lead = es(t, 2.0, 2.8);
        const path = m.side < 0 ? LEFTP : RIGHTP;
        const q = along(path, 0.3 + lead * 0.62);
        const [x, y] = at(q[0], q[1] + (1 - up) * 40);
        const beck = Math.sin(T * 3 + m.i) * 10 * lead;
        m.p.set({ x, y, s: 0.3 * SA, flip: m.side < 0 ? lead > 0.05 : !(lead > 0.05), o: on * Math.min(1, up * 3), walk: lead > 0 && lead < 1 ? x * 0.12 : undefined, armB: 130 * up * (1 - lead) + 30 * lead, armF: 50 + lead * 40 + beck, blink: blinkAt(T, m.seed) });
        const tg = es(t, 1.2 + m.i * 0.15, 1.4 + m.i * 0.15, ease.back) * (1 - es(t, 2.05, 2.25));
        pose(m.tag, { x: x - m.side * 10, y: y - 100 - m.i * 16, s: tg * 1.05, r: Math.sin(T * 1.4 + m.i) * 3, o: on * (tg > 0.01 ? 1 : 0) });
      });

      /* Jesus: warns (0), shows (1), grieves as many go (2) */
      const warn = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const show = es(t, 1.0, 1.3) * (1 - es(t, 1.9, 2.05));
      const grief = es(t, 2.05, 2.4);
      J.set({ x: JX, y: JY, s: circ.s, armB: 10 + warn * 150 + show * 20, armF: 25 + show * 80 + grief * 45, head: -show * 8 - warn * 4 + grief * 7 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, Math.max(warn, show * 0.5), T, { s0: 0.7 });

      circ.four.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, lean: m.dir * 3, armF: 20 + es(t, 1.15, 1.4) * 20 * (1 - grief), head: -6 - es(t, 0.3, 0.6) * 8 + grief * 6, blink: blinkAt(T, m.seed) }));

      S.cam.y = -es(t, 0.2, 0.9) * 30;
      S.cam.z = 1 + es(t, 0.2, 0.9) * 0.04;
    };
  },
};
