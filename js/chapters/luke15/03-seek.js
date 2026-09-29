// Łk 15,4c–5 — night in the ravines of the wilderness: the moon over black ridges, a stony gully climbing up to a
// ledge on the right. "…and go after the one that is lost, until he finds it?": the shepherd climbs the zigzag
// path with his lantern held out, calling — the rings of his voice go out into the dark — and from up on the ledge
// a thin bleat answers: the sheep is caught in a thorn bush. He climbs on until the lantern light falls on it —
// found. "And when he has found it, he lays it on his shoulders, rejoicing": he parts the thorns, lifts the sheep
// onto his shoulders and throws up his arm with the staff; behind him the warm light opens wide, hearts go up and
// the stars shine out over the ravine.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { band, rock, moon, stars } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import {
  ewe, sheepRig, SHEPHERD, staff, lanternHeld, shoulderLamb, onShoulders, heart, sparkle, voiceRings, rayBurst, glow,
  along, kf, headP, handP, es, ease, bump, seg, PI, NIGHT,
} from './lib.js';

const P = 0.45;
const LEDGE = [1076, 470];
const PATH = [[470, 716], [600, 700], [720, 672], [660, 632], [760, 606], [880, 580], [960, 546], [1010, 506], [1030, 484]];
const lantern = (c) => lanternHeld(c, 40).replace(/<circle class="glow"[^>]*\/>/, '');

export default {
  id: 'lk15-seek',
  parable: true,
  beats: [
    { v: 4, cont: true, text: 'i nie idzie za zgubioną, aż ją znajdzie?' },
    { v: 5 },
  ],
  cam: { x: [-40, 120], y: [-70, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const N = (col, k = 0.45) => mix(col, C.night, k);
    const sk = S.layer({ par: 0, sky: true });
    const sid = S.id('sky');
    S.defs(`<linearGradient id="${sid}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.min(0, S.view().y0).toFixed(0)}" x2="0" y2="760"><stop offset="0" stop-color="${NIGHT[0]}"/><stop offset=".55" stop-color="${NIGHT[1]}"/><stop offset="1" stop-color="${NIGHT[2]}"/></linearGradient>`);
    sk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${sid})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const starL = S.layer({ par: 0.02, sh: 0, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -800, y1: 420, n: 130 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const mn = hanging(hangL, moon(c, 40), { x: 0, y: -1500, len: 900 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [40, 16, 4], lens: [800, 300, 110], color: N(C.hillFar, 0.62), x0: -1400, x1: 3000 }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(band(c, { y: 500, amps: [46, 14, 4], lens: [700, 260, 100], color: N(C.dune, 0.55), x0: -1400, x1: 3000 }).markup);

    /* the gully: the rock face with its zigzag path, the ledge up on the right */
    const face = S.layer({ par: P, sh: 3 });
    const RK = N(mix(C.rock, C.dune, 0.3), 0.42);
    const f = sheet();
    f.p(c.cut([[-1400, 1800], [-1400, 600], [200, 640], [440, 690], [560, 640], [640, 600], [760, 560], [880, 530], [960, 500], [1040, 480], [1120, 476], [1150, 440], [1220, 380], [1320, 330], [1460, 320], [1700, 380], [2600, 420], [2600, 1800]], 1.4, 10), RK);
    f.p(c.cut([[1040, 484], [1124, 480], [1140, 496], [1040, 500]], 0.5, 6), shade(RK, -0.14));
    f.x(c.cut([[1180, 420], [1260, 380], [1320, 390], [1250, 430]], 0.6, 6) + c.cut([[1400, 360], [1520, 380], [1460, 400]], 0.6, 6) + c.cut([[700, 600], [780, 574], [800, 590], [730, 612]], 0.5, 6), shade(RK, 0.18), 'opacity=".7"');
    f.p(c.ribbon(PATH.map(([x, y]) => [x, y + 4]), (u) => 22 - u * 12, 2), N(mix(C.sand, C.rock, 0.4), 0.38));
    face.add(f.out());
    face.add(rock(c, 1300, 452, 130, 70, N(C.rock2, 0.4)) + rock(c, 520, 700, 150, 60, N(C.rock3, 0.4)));

    /* the lantern's light and the joy, behind the shepherd */
    const lightL = S.layer({ par: P, sh: 0, flat: true });
    const lampGlow = lightL.add(`<g>${glow(120, 0.75)}</g>`);
    const found = lightL.add(`<g opacity="0">${glow(150, 0.9)}</g>`);
    const joy = lightL.add(`<g opacity="0">${glow(110, 0.55)}${rayBurst(c, { n: 16, r0: 175, r1: 250, spread: 0.03, color: C.haloRim, o: 0.5 })}</g>`);

    /* the thorn bush and the lost sheep on the ledge */
    const act = S.layer({ par: P, sh: 5 });
    const thornBack = act.add(`<g>${thornBush(c, 0, 0, 60, N(C.thorn, 0.1))}</g>`);
    const lost = sheepRig(act.add(ewe(c, { wool: C.linen, patch: true })));
    const thornFront = act.add(`<g>${thornBush(c, 0, 0, 44, N(C.thorn2, 0.1))}</g>`);
    const shep = S.puppet(act.add(person(c, { ...SHEPHERD, holdF: lantern(c), holdB: staff(c, 200, 30) })));
    const carry = S.puppet(act.add(onShoulders(person(c, { ...SHEPHERD, holdF: lantern(c), holdB: staff(c, 200, 30) }), shoulderLamb(c, C.linen))));

    /* voice, bleat, hearts, stars */
    const fx = S.layer({ par: P, sh: 4 });
    const call = voiceRings(fx, c, { n: 3, color: shade(C.ochre, 0.3), r: 34 });
    const bleat = voiceRings(fx, c, { n: 2, color: C.cream, r: 18, w: 3.5 });
    const hearts = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${heart(c, 11 + i * 3)}</g>`));
    const twinkles = Array.from({ length: 7 }, (_, i) => ({ i, x: c.rr(420, 1300), y: c.rr(120, 330), el: fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`) }));

    return (t, time) => {
      const T = time;
      pose(mn, { x: 560, y: 150, r: T ? Math.sin(T * 0.5) : 0 });

      /* v4c — the climb, calling, the lantern held out */
      const u = es(t, 0.04, 0.84, (x) => x * 0.2 + ease.io(x) * 0.8);
      const [x, y, d] = along(PATH, u);
      const sc = lerp(1.0, 0.84, u);
      const lift = seg(t, 1.3, 1.36);
      const bend = bump(t, 1.04, 1.34);
      const hold = es(t, 0.84, 0.94);
      const climbing = u > 0 && u < 1;
      const jk = es(t, 1.4, 1.62);
      shep.set({ x, y, s: sc, flip: d < 0, o: 1 - lift, walk: climbing ? u * 70 : undefined, armF: 40 + hold * 40 + bend * 20, armB: 10 + bend * 30, lean: bend * 16, head: -6 * hold + bend * 12, blink: blinkAt(T, 2) });
      carry.set({ x, y, s: sc, flip: d < 0, o: lift, armF: 40 - jk * 10, armB: 20 + jk * 130, head: -jk * 10, bob: -jk * Math.abs(Math.sin(t * PI * 5)) * 7, blink: blinkAt(T, 2) });
      const [lx, ly] = handP(x, y, sc, d < 0, 40 + hold * 40 + bend * 20);
      pose(lampGlow, { x: lx, y: ly + 22 * sc, s: 1 + hold * 0.3 - lift * 0.5, o: 1 - lift * 0.5 });
      const callOn = (bump(t, 0.1, 0.36) + bump(t, 0.44, 0.66)) * (1 - lift);
      const [hx, hy] = headP(x, y, sc, d < 0);
      call(hx + (d < 0 ? -20 : 20), hy, callOn, T, { dir: d < 0 ? -1 : 1 });
      bleat(LEDGE[0] + 20, LEDGE[1] - 36, bump(t, 0.3, 0.52) + bump(t, 0.62, 0.8), T, { dir: -1 });
      pose(found, { x: LEDGE[0] + 6, y: LEDGE[1] - 20, o: es(t, 0.8, 0.94) * (1 - es(t, 1.3, 1.4)) });

      /* the sheep: stuck, found, freed, lifted */
      const free = es(t, 1.1, 1.26);
      lost.set({ x: LEDGE[0] + 12 - free * 18, y: LEDGE[1] + 4, s: 0.6, flip: true, head: Math.sin(t * 22) * 10 * (1 - free) * (t < 1 ? 1 : 0.3) + es(t, 0.84, 0.96) * -14, o: 1 - lift });
      pose(thornBack, { x: LEDGE[0] + 30 + free * 16, y: LEDGE[1] + 6, sx: 1 + free * 0.1 });
      pose(thornFront, { x: LEDGE[0] + 2 - free * 34, y: LEDGE[1] + 8, r: -free * 22 });

      /* v5 — on his shoulders, rejoicing */
      pose(joy, { x, y: y - 120 * sc, s: 0.7 + jk * 0.3, o: jk });
      hearts.forEach((h, i) => {
        const k = seg(t, 1.45 + i * 0.08, 1.95);
        pose(h, { x: x + (i - 1) * 34, y: y - 230 * sc - k * 60, s: Math.sin(Math.min(1, k * 1.5) * PI * 0.5), o: k > 0 && k < 1 ? 1 - Math.max(0, k - 0.75) / 0.25 : 0 });
      });
      twinkles.forEach((w) => {
        const k = es(t, 1.4 + w.i * 0.04, 1.6 + w.i * 0.04);
        pose(w.el, { x: w.x, y: w.y, s: k * (0.7 + 0.3 * Math.abs(Math.sin(T * 2 + w.i))), r: T * 20 + w.i * 10, o: k });
      });

      S.cam.x = kf(t, [[0, -30], [0.4, 10], [0.9, 90], [1.3, 100], [1.8, 90]]);
      S.cam.y = kf(t, [[0, 40], [0.4, 20], [0.9, -40], [1.3, -50], [1.8, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [0.9, 1.1], [1.3, 1.12], [1.8, 1.08]]);
    };
  },
};
