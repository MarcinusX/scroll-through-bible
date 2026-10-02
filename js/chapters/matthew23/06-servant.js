// Mt 23,11–12 — in the court. "The greatest among you shall be your servant": Peter, the first of them, kneels with a
// copper basin and pours water over John's hands, a towel on his arm. Then a long plank on a stone comes down from the
// flies and settles with its low end at Peter's knees. The Pharisee struts up the plank to its raised end and stands
// there, chin in the air — and down it goes under him: he is lowered to the floor and sits there, humbled, while the
// other end lifts Peter up, kneeling, into the light: "whoever exalts himself will be humbled, and whoever humbles
// himself will be exalted".
import { C, person, CAST, blinkAt, pose, lerp, hanging } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, voiceRings, pose3, folk, TWELVE, vain, PH, seesaw, hang2, basinBowl, ewer, towel, sparkle } from './lib.js';

const JX = 560;
const PIV0 = [960, 0];           // the see-saw's pivot (y set from the floor)
const HALF = 210, TILT = 15;

export default {
  id: 'mt23-servant',
  beats: [
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [0, 60], y: [-30, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    const PY = F - 74;
    // phone: the see-saw stands further left, so the Pharisee brought down at its far end sits on the screen; the
    // two disciples who only stand by step off the left edge instead of being cut in half by it
    const PH_ = S.portrait;
    const PIV = [PH_ ? 900 : PIV0[0], 0];
    const DX = PH_ ? -50 : 0;               // Jesus, Peter, John and the basin move with it

    const stepL = S.layer({ par: 0.45, sh: 4 });
    stepL.sprite(pose3(c, Array.from({ length: 6 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: false, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 300, 604);
    stepL.sprite(pose3(c, Array.from({ length: 5 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: true, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 1080, 604);

    /* the see-saw, coming down on strings */
    const P = S.layer({ par: 0.5, sh: 5 });
    const SS = seesaw(c, HALF * 2);
    const strings = P.add(`<g><path d="M-${HALF - 20} -1600V${-74}M${HALF - 20} -1600V${-74}M-30 -1600V-60M30 -1600V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    const base = P.add(`<g>${SS.base}</g>`);
    const plank = P.add(`<g>${SS.plank}</g>`);
    const glow = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);

    /* the disciples: Peter serves John */
    const others = (PH_ ? [[300, 3, 10], [370, 1, 0]] : [[380, 3, 10], [455, 1, 0]]).map(([x, k, dy], i) => ({ i, x, y: F + dy, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, TWELVE[k].o))) }));
    const john = S.puppet(P.add(person(c, TWELVE[2].o)));
    const peter = S.puppet(P.add(person(c, { ...TWELVE[0].o, pose: 'kneel', holdF: `<g transform="translate(0 4) rotate(-60)">${ewer(c)}</g>` })));
    const basin = P.add(`<g>${basinBowl(c, 60)}</g>`);
    const stream = P.add(`<g><path d="${c.ribbon([[0, 0], [2, 30], [1, 58]], (u) => 3 - u * 1.2)}" fill="${C.lake}" opacity=".85"/></g>`);
    const pharS = S.puppet(P.add(vain(c, PH)));
    const pharSit = S.puppet(P.add(vain(c, PH, { pose: 'sit' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 26, w: 4 });
    const fx = S.layer({ par: 0.5, sh: 4 });
    const glints = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 10)}</g>`) }));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* the plank: comes down (1.0–1.25) tilted left-down; tips right-down under the Pharisee (1.55–1.75) */
      const down = es(t, 0.95, 1.25, ease.out);
      const tip = es(t, 1.55, 1.78, ease.io);
      const r = lerp(-TILT, TILT, tip);
      const ay = lerp(-900, 0, down);
      pose(base, { x: PIV[0], y: F + 2 + ay, o: down > 0.01 ? 1 : 0 });
      pose(strings, { x: PIV[0], y: F + 2 + ay - es(t, 1.26, 1.5) * 700, o: down > 0.01 && t < 1.5 ? 1 : 0 });
      pose(plank, { x: PIV[0], y: PY + ay, r, o: down > 0.01 ? 1 : 0 });
      const rad = (r * Math.PI) / 180;
      const lx = PIV[0] - Math.cos(rad) * (HALF - 28), ly = PY - 6 - Math.sin(rad) * (HALF - 28);
      const rx = PIV[0] + Math.cos(rad) * (HALF - 40), ry = PY - 6 + Math.sin(rad) * (HALF - 40);

      /* v11 — Peter kneels and pours water over John's hands */
      const pour = es(t, 0.15, 0.35) * (1 - es(t, 0.9, 1.05));
      const onPlank = es(t, 1.22, 1.32);
      const kx = lerp(800 + DX, lx, onPlank), ky = lerp(F + 4, ly, onPlank);
      const lifted = tip;
      peter.set({ x: kx, y: ky, s: 0.92, flip: true, armF: 40 + pour * 50, armB: 20 + pour * 30, head: 10 * (1 - lifted) - lifted * 12, lean: 8 * (1 - lifted), blink: blinkAt(T, 2) });
      pose(basin, { x: 745 + DX, y: F + 8, o: 1 - es(t, 1.0, 1.15) });
      pose(stream, { x: 750 + DX, y: F - 118, sy: pour, o: pour > 0.05 ? 0.9 : 0 });
      john.set({ x: 700 + DX, y: F + 10, s: 0.92, armF: 60 * (1 - es(t, 0.95, 1.1)) + es(t, 1.6, 1.8) * 30, armB: 50 * (1 - es(t, 0.95, 1.1)), head: 8 * (1 - es(t, 0.95, 1.1)) - es(t, 1.6, 1.8) * 16, blink: blinkAt(T, 3) });
      others.forEach((o) => o.p.set({ x: o.x, y: o.y, s: 0.9, armF: 10 + es(t, 1.6, 1.8) * 30, head: -es(t, 1.6, 1.8) * 16, blink: blinkAt(T, o.seed) }));
      pose(glow, { x: lx, y: ly - 110, s: 1 + (T ? Math.sin(T * 1.5) * 0.04 : 0), o: es(t, 1.62, 1.85) });
      glints.forEach((g) => {
        const k = T ? (T * 0.5 + g.i / 5) % 1 : 0.5;
        pose(g.el, { x: lx - 60 + g.i * 30, y: ly - 150 - k * 60, s: 0.7, o: es(t, 1.65, 1.85) * Math.sin(k * Math.PI) });
      });

      /* v12 — the Pharisee struts up to the high end, is brought down and sits humbled */
      const walkIn = es(t, 1.05, 1.3), climb = es(t, 1.3, 1.52);
      const sat = es(t, 1.66, 1.72);
      let px = lerp(1320, PH_ ? 1130 : 1180, walkIn), py = F;
      px = lerp(px, rx, climb); py = lerp(py, ry, climb);
      const proud = es(t, 1.4, 1.55) * (1 - tip);
      pharS.set({ x: px, y: py, s: 0.92, flip: true, walk: (walkIn > 0 && walkIn < 1) || (climb > 0 && climb < 1) ? px * 0.06 : undefined, head: -proud * 18 + tip * 14, lean: -proud * 6 + tip * 10, armF: 20 + proud * 20 + tip * 50, armB: 10 + tip * 90, o: (t > 1.0 ? 1 : 0) * (1 - sat), blink: blinkAt(T, 5) });
      pharSit.set({ x: rx + (PH_ ? 22 : 50), y: F + 4, s: 0.9, flip: true, head: 16, lean: 12, armF: 30, armB: 10, o: sat, blink: blinkAt(T, 5) });

      /* Jesus teaches */
      jesus.set({ x: JX + DX, y: F, s: 1.04, armF: 40 + bump(t, 0.02, 0.9) * 30 + es(t, 1.05, 1.3) * 30, armB: 20, head: -4, blink: blinkAt(T) });
      voice(JX + DX + 26, F - 180, bump(t, 0.02, 0.8) + bump(t, 1.02, 1.8) * 0.8, T, { dir: 1 });

      S.cam.x = 20 + es(t, 0.9, 1.3) * 30;
      S.cam.z = 1.02 + es(t, 1.3, 1.7) * 0.04;
      S.cam.y = -es(t, 1.3, 1.7) * 20;
    };
  },
};
