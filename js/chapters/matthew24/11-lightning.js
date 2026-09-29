// Mt 24,27–28 — deep night on the Mount, heavy clouds. "As the lightning comes from the east and shines even to the
// west, so will be the coming of the Son of Man": a bolt strikes on the far left and runs the whole width of the sky
// to the far right in one stroke, and everything — the city, the hills, the faces — is lit at once. Nobody has to be
// told where. "Wherever the carcass is, there the vultures will gather": over a hollow beyond the far hill, dark birds
// come in from every side and circle.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, voiceRings, vulture, PI } from './lib.js';

const HOLLOW = [1010, 400];

/** one long bolt across the sky, west ← east, with forks; origin at its east (left) end */
function bolt(c, len = 2000) {
  const pts = [[0, 0]];
  let y = 0;
  for (let i = 1; i <= 26; i++) { y += c.rr(-26, 26) + (i < 4 ? 18 : 0) - (i > 20 ? 6 : 0); pts.push([(len * i) / 26, Math.max(-60, Math.min(90, y))]); }
  let forks = '';
  [4, 9, 14, 19, 23].forEach((k) => {
    const [x, y0] = pts[k];
    let fy = y0, fx = x;
    const fp = [[fx, fy]];
    for (let j = 0; j < 4; j++) { fx += c.rr(10, 34); fy += c.rr(18, 34) * (k % 2 ? 1 : -1); fp.push([fx, fy]); }
    forks += c.ribbon(fp, (u) => 5 - u * 4);
  });
  return `<path d="${c.ribbon(pts, (u) => 11 - Math.abs(u - 0.5) * 6)}" fill="#fff6d8"/><path d="${forks}" fill="#fff6d8"/><path d="${c.ribbon(pts, 3)}" fill="#ffffff"/>`;
}

export default {
  id: 'mt24-lightning',
  beats: [
    { v: 27 },
    { v: 28 },
  ],
  cam: { x: [-30, 30], y: [-70, 40], z: [0.97, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.5, NIGHTC = mix(C.night2, C.storm2, 0.4);
    const set = olivesSet(S, { skyCols: ['#1a1d33', '#2a2c47', '#3e3e5a'], tintCol: NIGHTC, tintK: TK, moonXY: [1240, 110], templeGlow: 0.1, starsN: 30 });

    /* heavy clouds on strings */
    const cloudL = S.layer({ par: 0.06, sh: 4 });
    const CL = [[260, 90, 520], [760, 60, 600], [1300, 96, 540]].map(([x, y, w], i) => ({ x, y, i, el: cloudL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-20" stroke="rgba(200,190,170,.35)" stroke-width="1.2"/>${stormCloud(c, w, mix(C.storm2, C.night2, 0.4), mix(C.storm2, C.night2, 0.6))}</g>`) }));

    /* the bolt and the flash */
    const boltL = S.layer({ par: 0.05, sh: 2, rise: 0 });
    const boltEl = boltL.add(`<g transform="translate(0 -1500)"><circle r="160" fill="url(#halo-glow)"/>${bolt(c, 2200)}</g>`);
    const flashL = S.layer({ par: 0.2, sh: 1, flat: true });
    flashL.add(`<rect x="-1400" y="-1400" width="4400" height="3400" fill="#fff3d8"/>`);
    flashL.fade(0);

    /* the vultures over the hollow beyond the hill */
    const birdL = S.layer({ par: 0.12, sh: 3 });
    const VUL = Array.from({ length: 7 }, (_, i) => ({ i, el: birdL.add(`<g transform="translate(0 -1500)">${vulture(c)}</g>`), ph: (i / 7) * PI * 2, r: c.rr(0.8, 1.2), s: c.rr(0.46, 0.66), from: i % 2 ? 1 : -1, d: c.rr(0, 0.3) }));

    const P = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, P, { tintCol: NIGHTC, tintK: 0.2 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });
    const lit = S.layer({ par: 0.55, sh: 1, flat: true });
    lit.add(`<rect x="-1400" y="300" width="4400" height="1500" fill="${C.lampGlow}" opacity=".35"/>`);
    lit.fade(0);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 800, sunO: 0, moon: 110, moonO: 0.3, glow: 0.1, starsO: 0.4 });
      CL.forEach((cl) => pose(cl.el, { x: cl.x + (T ? Math.sin(T * 0.1 + cl.i) * 20 : 0), y: cl.y, r: T ? Math.sin(T * 0.5 + cl.i) : 0 }));

      /* v27 — the bolt runs from east to west in one stroke; everything lit */
      const run = es(t, 0.2, 0.42, ease.out);
      const glow = es(t, 0.2, 0.3) * (1 - es(t, 1.1, 1.4));
      pose(boltEl, { x: -300, y: 180, sx: Math.max(0.001, run), o: run > 0.001 ? glow : 0 });
      flashL.fade(bump(t, 0.2, 0.5) * 0.55 + glow * 0.12);
      lit.fade(glow * 0.9);

      /* v28 — the vultures gather and circle */
      VUL.forEach((v) => {
        const k = es(t, 1.05 + v.d, 1.6 + v.d, ease.out);
        const ph = v.ph + (T ? T * 0.45 : 0) * (v.i % 2 ? 1 : -1) * 0.9 + t * 0.8;
        const cx = HOLLOW[0] + v.from * (1 - k) * 700, cy = HOLLOW[1] - 120 - (1 - k) * 80;
        const rx = 120 * v.r * (0.5 + k * 0.5), ry = 34 * v.r;
        const x = cx + Math.cos(ph) * rx * k, y = cy + Math.sin(ph) * ry * k + v.i * 6;
        const dir = k < 0.95 ? -v.from : (Math.sin(ph) * (v.i % 2 ? 1 : -1) < 0 ? 1 : -1);
        pose(v.el, { x, y, s: v.s, sx: dir, r: (Math.cos(ph) * 8) * k, o: k > 0.01 ? 1 : 0 });
      });

      /* Jesus: a hand across the whole sky (0), then towards the far hollow (1); the four look up */
      const sweep = es(t, 0.15, 0.45) * (1 - es(t, 0.95, 1.1));
      const there = es(t, 1.15, 1.4);
      J.set({ x: JX, y: JY, s: circ.s, flip: false, armB: 10 + sweep * 150, armF: 25 + sweep * 40 + there * 75, head: -sweep * 12 - there * 4 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, Math.max(sweep, there) * 0.8, T, { s0: 0.7 });
      circ.four.forEach((m) => {
        const startle = es(t, 0.22, 0.3) * (1 - es(t, 0.8, 1.0));
        const look = es(t, 1.25, 1.5);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: look > 0.5 ? false : m.flip, lean: m.dir * (3 - startle * 6), armF: 20 + startle * 60, armB: startle * 50, head: -16 * es(t, 0.2, 0.4) + look * 6, blink: blinkAt(T, m.seed) });
      });

      S.cam.y = -es(t, 0.05, 0.4) * 60 * (1 - es(t, 1.0, 1.3) * 0.5);
      S.cam.z = 1 - es(t, 0.05, 0.4) * 0.03 + es(t, 1.1, 1.5) * 0.04;
      S.cam.x = es(t, 1.1, 1.5) * 20;
    };
  },
};
