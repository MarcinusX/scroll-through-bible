// Łk 22,39–42 — out of the city by night, as He used to, to the Mount of Olives; the disciples follow with their small
// lanterns. At the place: "Pray that you may not enter into temptation" — they set down their lanterns and bow their
// heads. He goes on about a stone's throw (a stone arcs ahead of Him and drops where He will kneel) and kneels by a
// rock. "Father, if you are willing, remove this cup from me": a cup made of light is let down above Him — the Father
// is never shown, only the light. "Nevertheless, not my will, but yours, be done": He bows, His hands open, and the cup
// comes down closer, into reach.
import { es, ease, bump, seg } from '../../core/anim.js';
import { rock } from '../../assets/nature.js';
import {
  nightSet, gardenTrees, elevenL as eleven, lamp, TW, CAST, kf, moving, hand, headAt, withFace, faceBits, cupOfLight, stone, speech, person, sheet, hanging,
  vis, pose, fade, lerp, mix, nt, blinkAt, tr, C, PI,
} from './lib.js';

const GY = 700, KX = 900;
const POS = [
  { k: 'peter', x: 560, y: 6 }, { k: 'john', x: 514, y: -18, s: 0.86 }, { k: 'james', x: 468, y: 8 }, { k: 'andrew', x: 420, y: -20, s: 0.86 },
  { k: 'thomas', x: 376, y: 6 }, { k: 'philip', x: 332, y: -22, s: 0.84 }, { k: 'matthew', x: 290, y: 4 }, { k: 'bartholomew', x: 250, y: -22, s: 0.84 },
  { k: 'jamesA', x: 210, y: 6 }, { k: 'thaddaeus', x: 170, y: -22, s: 0.84 }, { k: 'simonZ', x: 130, y: 6 },
];

export default {
  id: 'lk22-olives',
  beats: [
    { v: 39 },
    { v: 40 },
    { v: 41 },
    { v: 42, text: 'tymi słowami: «Ojcze, jeśli chcesz, zabierz ode Mnie ten kielich!' },
    { v: 42, cont: true, text: 'Jednak nie moja wola, lecz Twoja niech się stanie!»' },
  ],
  cam: { x: [-320, 160], y: [-40, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { moonAt: [1240, 140], cityX: 250 });
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    treesL.add(rock(c, KX + 70, GY + 24, 190, 76, nt(C.rock2, 0.3)));
    // the light behind Him (never a figure): high, small, behind everything on His plane
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const above = lightL.add(`<g><circle r="170" fill="url(#halo-glow)" opacity=".6"/></g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const { J, D } = eleven(S, P, { gy: GY, pos: POS, lamps: true, arm: 28 });
    const kEl = P.add(withFace(person(c, { ...CAST.jesus, pose: 'kneel' }), faceBits(c)));
    const kneel = S.puppet(kEl);
    const kSad = kEl.querySelector('[data-part="sad"]');
    const fx = S.layer({ par: 0.52, sh: 4 });
    const stoneEl = fx.add(`<g>${stone(c, 8)}</g>`);
    const hands = sheet().p(c.cut([[-4, 16], [-12, -2], [-10, -20], [-4, -26], [0, -18], [4, -26], [10, -20], [12, -2], [4, 16]], 0.3, 3), C.skin).x(c.ribbon([[0, -18], [0, 14]], 1), mix(C.skin, C.ink, 0.3)).out();
    const prayB = fx.add(`<g>${speech(c, `<g transform="translate(0 4)">${hands}</g>`, { w: 58, h: 52 })}</g>`);
    const cupEl = hanging(fx, cupOfLight(c, 62), { x: 0, y: -1500, len: 700 });
    const cGlow = cupEl.querySelector('.glow'), cRays = cupEl.querySelector('.rays');

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v39 — out to the Mount of Olives; they follow */
      const arrive = [[-0.4, -620], [0.9, 0]];
      const dx = kf(t, arrive, ease.out);
      const walking = moving(t, arrive, 0.6);
      const settle = es(t, 1.1, 1.4);
      D.forEach((m) => {
        const x = m.x + dx;
        m.p.set({ x, y: m.y, s: m.s, flip: false, walk: walking ? x * 0.05 : undefined, armF: m.arm - settle * 20, armB: 8 + settle * 20, head: settle * 16, lean: settle * 4, blink: blinkAt(T, m.seed) });
        lamp(m, 1 - settle * 0.3, 0, T);
        fade(m.sad, settle * 0.5);
      });
      // Jesus: leads them; turns to speak; walks on a stone's throw; kneels
      const jK = [[-0.4, 20], [0.9, 640], [2.2, 640], [2.55, KX]];
      const jx = kf(t, jK, ease.sine);
      const down = es(t, 2.55, 2.62);
      const turn = es(t, 1.05, 1.12) * (1 - es(t, 1.9, 2.0));
      J.p.set({ x: jx, y: GY + 4, s: 1.04, flip: turn > 0.5, o: 1 - down, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, armF: 20 + turn * 50 + bump(t, 2.05, 2.3) * 70, armB: 10 + turn * 30, head: -turn * 4, blink: blinkAt(T) });
      fade(J.sad, es(t, 1.9, 2.3) * 0.7);
      const pb = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.9, 2.0));
      const [jhx, jhy] = headAt(640, GY + 4, 1.04, true);
      vis(prayB, { x: jhx - 16, y: jhy - 28, s: pb, o: pb > 0.01 ? 1 : 0 });

      /* v41 — a stone's throw */
      const throwK = es(t, 2.05, 2.35, (u) => u);
      const sx = lerp(680, KX + 60, throwK), sy = lerp(560, GY - 4, throwK) - Math.sin(throwK * PI) * 170;
      vis(stoneEl, { x: sx, y: sy, r: throwK * 500, o: t > 2.05 && t < 3.1 ? 1 - es(t, 3.0, 3.1) : 0 });

      /* v42 — "remove this cup"; "not my will, but yours" */
      const accept = es(t, 4.05, 4.4);
      const lift = es(t, 3.05, 3.35) * (1 - accept);
      kneel.set({ x: KX, y: GY + 6, s: 1.1, flip: false, o: down, armF: 20 + lift * 70 + accept * 60, armB: 10 + lift * 130 - accept * 0 + accept * 40, head: -lift * 20 + accept * 22, lean: accept * 8, blink: blinkAt(T, 2) });
      fade(kSad, es(t, 2.9, 3.2) * (1 - accept * 0.3));
      const cin = es(t, 3.05, 3.45, ease.out);
      const cy = 270 - (1 - cin) * 700 + accept * 60;
      vis(cupEl, { x: KX + 70, y: cy, r: T ? Math.sin(T * 0.7) * 1.5 * (1 - accept) : 0, o: cin > 0.01 ? 1 : 0 });
      fade(cGlow, 0.7 + accept * 0.3);
      vis(cRays, { r: T * 3, s: 1 + accept * 0.2, o: 0.35 + accept * 0.25 });
      vis(above, { x: KX + 70, y: 160, s: 1, o: es(t, 3.0, 3.4) * 0.8 });

      S.cam.x = S.portrait   // phone: the disciples He speaks to in view; later the nearest of them whole, not a sliver at the edge
        ? kf(t, [[-0.4, -300], [0.9, -220], [1.9, -220], [2.4, -20], [2.9, -10], [4.9, -10]])
        : kf(t, [[-0.4, -220], [0.9, -120], [1.9, -120], [2.4, 60], [2.9, 120], [4.9, 120]]);
      S.cam.z = kf(t, [[-0.4, 1.04], [0.9, 1.08], [1.2, 1.16], [1.9, 1.16], [2.4, 1.1], [3.0, 1.26], [4.0, 1.26], [4.4, 1.34]]);
      S.cam.y = kf(t, [[-0.4, 30], [1.2, 70], [1.9, 70], [2.4, 40], [3.0, 50], [4.4, 80]]);
    };
  },
};
