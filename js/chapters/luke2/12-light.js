// Łk 2,30–32 — a painted flat comes down: Simeon alone with the Child in his arms against the deep blue, the light
// growing from the Child behind them. "My eyes have seen your salvation" — he looks down at Him. "Which you prepared
// before the face of all peoples" — round them, in a great arc, the peoples come up on their little islands of cloud,
// every kind of dress. "A light for revelation to the nations and the glory of your people Israel" — the rays reach
// out to every one of them, and the Temple on its hill shines gold.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, mix, crowdPerson } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import {
  SIMEON, inArms, sanctuary, glowDisc, rayBurst, goldWord, placeTag, hangAt, vpose, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const CX = 800, CY = 600, RAD = 370;
const ANG = [172, 200, 229, 257, 285, 313];     // the peoples round the arc (degrees, 270 = straight up)
const Y = 720;

/** a little group of three people standing on an islet of cloud (one still cut-out, for a sprite) */
function nation(c, i) {
  const robes = [[C.ochreRobe, C.terracotta], [C.tealRobe, C.dustyBlue], [C.plumRobe, C.roseRobe], [C.sageRobe, C.wheatRobe], [C.clayMantle, C.stone], [C.mauve, C.skyVeil]][i % 6];
  const skins = [[C.skin4, C.skin3], [C.skin, C.skin2], [C.skin3, C.skin4], [C.skin2, C.skin], [C.skin4, C.skin2], [C.skin, C.skin3]][i % 6];
  let out = `<g transform="translate(0 6)">${cloud(c, 150, C.cream, mix(C.cream, C.lavender, 0.4))}</g>`;
  [-36, 0, 36].forEach((x, k) => {
    const o = { ...crowdPerson(c), robe: robes[k % 2], skin: skins[k % 2], holdF: '', holdB: '' };
    if (k === 1 && i % 2) { o.hairStyle = 'veil'; o.beard = 'none'; o.veil = mix(robes[1], C.cream, 0.4); }
    const s = 0.4 * (k === 1 ? 0.9 : 1);
    out += `<g transform="translate(${x} -4) scale(${x > 0 ? -s : s} ${s})">${person(c, o).replace('class="armFr"', 'class="armFr" transform="rotate(-60)"')}</g>`;
  });
  return `<g>${out}</g>`;
}

export default {
  id: 'lk2-light',
  enter: 'fly',
  beats: [
    { v: 30 },
    { v: 31 },
    { v: 32 },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the Temple on its hill inside the screen; the peoples on a taller, narrower arc
    const TX = PH ? 1030 : 1150;
    const [AXR, AYR] = PH ? [280, RAD * 1.13] : [RAD * 1.15, RAD * 0.88];
    sky(S, ['#1a2048', '#2e3670', '#5a5b92']);
    const raysL = S.layer({ par: 0.1, sh: 0, flat: true });
    const rays = raysL.add(`<g>${rayBurst(c, { n: 30, r0: 60, r1: 900, spread: 0.026, color: "#fff3cf", o: 0.34 })}</g>`);
    const core = raysL.add(`<g>${glowDisc(320, 'halo-glow', 1)}</g>`);
    const glows = ANG.map(() => raysL.add(`<g>${glowDisc(130, 'warm-glow', 1)}</g>`));
    const tglow = raysL.add(`<g>${glowDisc(200, 'halo-glow', 1)}</g>`);
    // the hill with the Temple, and Simeon's ground
    const G = S.layer({ par: 0.2, sh: 3 });
    const tEl = G.add(`<g transform="translate(${TX} ${Y - 30})">${sanctuary(c, 0.55, { glow: false })}</g>`);
    G.add(sheet().p(c.cut([[-1400, 1900], [-1400, Y + 30], ...c.qbez([-400, Y + 40], [800, Y - 60], [2000, Y + 40], 30).map(([x, y]) => [x, y]), [3000, Y + 30], [3000, 1900]], 1, 12), mix(C.indigo, C.sage, 0.35)).out());
    G.add(sheet().p(c.cut([[1000, Y - 20], [1030, Y - 36], [1290, Y - 36], [1320, Y - 20], [1320, Y + 30], [1000, Y + 30]].map(([x, y]) => [x + TX - 1150, y]), 0.6, 8), mix(C.stone, C.indigo, 0.25)).out());
    const N = S.layer({ par: 0.15, sh: 4 });
    const groups = (PH ? [172, 200, 230, 256, 288, 314] : ANG).map((a, i) => {
      const r = (a * PI) / 180;
      const gx = CX + (PH ? 25 : 0) + Math.cos(r) * AXR, gy = CY + Math.sin(r) * AYR;
      return { i, x: gx, y: gy, sp: N.sprite(nation(c, i), gx, gy) };
    });
    const P = S.layer({ par: 0.3, sh: 6 });
    const sim = S.puppet(P.add(person(c, { ...SIMEON, holdF: inArms(c) })));
    const X = S.layer({ par: 0.25, sh: 5 });
    const sal = hanging(X, goldWord(c, tr('Twoje zbawienie', 'your salvation'), { size: 26 }), { x: 0, y: 0, len: 700 });
    const tagN = X.add(`<g>${placeTag(c, tr('światło dla pogan', 'a light to the nations'), 18)}</g>`);
    const tagI = X.add(`<g>${placeTag(c, tr('chwała Izraela', 'the glory of Israel'), 18)}</g>`);
    const sparks = [0, 1, 2, 3, 4, 5].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v30 — my eyes have seen your salvation */
      const lk = es(t, 0.1, 0.6);
      const look = es(t, 0.15, 0.5) * (1 - es(t, 1.05, 1.3));
      sim.set({ x: CX - 20, y: Y, s: 1.4, armF: 70, armB: 30 + es(t, 1.1, 1.5) * 90, head: 12 * look - es(t, 1.1, 1.4) * 10, blink: blinkAt(T, 3) });
      pose(core, { x: CX + 30, y: Y - 150, s: 0.5 + lk * 0.5 + es(t, 2.05, 2.5) * 0.3, o: lk });
      const far = es(t, 2.05, 2.6);
      pose(rays, { x: CX + 30, y: Y - 150, s: 0.3 + lk * 0.3 + far * 0.5, r: T * 1.5, o: lk * (0.6 + far * 0.4) });
      const sk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangAt(sal, CX, lerp(-500, 200, sk), T, sk > 0.001 ? 1 : 0, 1, 0.7, 1);

      /* v31 — prepared before the face of all peoples */
      groups.forEach((g) => {
        const k = es(t, 1.05 + g.i * 0.08, 1.4 + g.i * 0.08, ease.out);
        const dx = (g.x - CX) * 0.25 * (1 - k), dy = (g.y - CY) * 0.25 * (1 - k);
        g.sp.set({ x: g.x - dx, y: g.y - dy + Math.sin(T * 0.8 + g.i) * 3, s: 0.6 + k * 0.4, o: k });
        const gk = es(t, 2.1 + g.i * 0.06, 2.35 + g.i * 0.06);
        pose(glows[g.i], { x: g.x, y: g.y - 40, s: 0.6 + gk * 0.6, o: gk * 0.9 });
      });

      /* v32 — a light to the nations, the glory of Israel */
      const tk = es(t, 2.3, 2.6);
      pose(tglow, { x: TX, y: Y - 110, s: 0.6 + tk * 0.6, o: tk });
      pose(tEl, { x: TX, y: Y - 30 - tk * 6 });
      const nk = es(t, 2.2, 2.4, ease.back);
      vpose(tagN, { x: PH ? 615 : 520, y: PH ? 668 : 640, s: Math.max(0.001, nk), o: nk > 0.01 ? 1 : 0 });
      const ik = es(t, 2.4, 2.6, ease.back);
      vpose(tagI, { x: PH ? TX - 10 : TX + 20, y: PH ? 410 : 470, s: Math.max(0.001, ik), o: ik > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const g = groups[i], k = es(t, 2.2 + i * 0.05, 2.4 + i * 0.05);
        vpose(sp, { x: g.x + Math.cos(T + i) * 50, y: g.y - 70 + Math.sin(T * 1.3 + i) * 12, s: k * 0.7, r: T * 40, o: k });
      });

      S.cam.z = 1.06 - es(t, 1.0, 1.5) * 0.05;
      S.cam.y = -10;
    };
  },
};
