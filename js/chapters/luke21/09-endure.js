// Łk 21,18–19 — "And not a hair of your head will perish": a round lens comes down with the disciple's head in it,
// the wind blowing through his curls; one single hair is plucked away by it, drifts down out of the lens across the
// court — and lands in Jesus' open palm, where it glints, kept. "By your endurance you will win your lives": a flat of
// a road in a storm — the disciple leans into the wind and rain with his lamp held close, step by step, on up the road;
// the rain thins, the clouds part, the sun comes up over the hill ahead, and he lifts his lamp, still burning.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, WITNESS, oneHair, sparkle, headAt, handAt, warm, sun,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const W = 580, H = 280, FX = 800, FY = 300;
const LX = 800, LY = 250, LR = 112;          // the lens
const ROAD = [[-270, 116], [-160, 96], [-60, 84], [40, 70], [140, 50], [240, 30]];

function storm(c, S) {
  const id = S.id('stormsky');
  S.defs(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e7390"/><stop offset=".55" stop-color="#a9a3ad"/><stop offset="1" stop-color="#f3cfa6"/></linearGradient>`);
  const s = sheet();
  s.p(c.cut([[-W / 2 - 4, 30], [-160, 6], [-40, 22], [80, -6], [200, 10], [W / 2 + 4, -10], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.8, 8), mix(C.hillMid, C.storm2, 0.35));
  s.p(c.cut([[-W / 2 - 4, 90], [-120, 70], [0, 80], [120, 56], [W / 2 + 4, 44], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.8, 8), mix(C.hillNear, C.storm2, 0.25));
  s.p(c.ribbon(ROAD, (u) => 22 - u * 12), mix(C.sand2, C.stone, 0.4));
  let cl = '';
  for (let i = 0; i < 6; i++) cl += c.cut(c.blob(-240 + i * 60, -100 + (i % 2) * 20, 70, 30, 10, 0.25), 0.8, 6);
  s.p(cl, mix(C.storm, C.night2, 0.2));
  return `<rect x="${-W / 2 - 2}" y="${-H / 2 - 2}" width="${W + 4}" height="${H + 4}" fill="url(#${id})"/>` + s.out();
}

export default {
  id: 'lk21-endure',
  beats: [
    { v: 18 },
    { v: 19 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const B = T0.bits;

    /* the lens with his head */
    const clip = S.id('lensclip');
    const head = `<clipPath id="${clip}"><circle r="${LR}"/></clipPath><g clip-path="url(#${clip})"><circle r="${LR}" fill="${mix(C.parchment, C.dawn, 0.3)}"/><g transform="translate(-10 ${2.6 * 167 + 18}) scale(2.6)">${person(c, { ...WITNESS, hairStyle: 'curly' })}</g></g>`;
    const lens = B.add(`<g><path d="M0 -1600V${-LR - 8}" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${sheet().p(c.cut(c.circ(0, 0, LR + 10, 40), 0.4, 5), C.haloRim).out()}${head}</g>`);
    let wind = '';
    for (let i = 0; i < 5; i++) wind += c.ribbon([[-LR * 0.8, -50 + i * 26], [LR * 0.3, -60 + i * 26]], 2.2);
    const windEl = B.add(`<g><path d="${wind}" fill="#fff" opacity=".7"/></g>`);
    const hair = T0.fx.add(`<g>${oneHair(c, 50, shade(WITNESS.hair, -0.1))}</g>`);
    const glint = T0.fx.add(`<g>${warm(16, 0.9)}${sparkle(c, 12)}</g>`);

    /* the road in the storm */
    const flatEl = T0.FL.add(flat(S, storm(c, S), { w: W, h: H }));
    const sunEl = B.add(`<g>${warm(90, 0.8)}${sun(c, 30)}</g>`);
    let rain = '';
    for (let i = 0; i < 46; i++) { const x = c.rr(-W / 2 + 20, 120), y = c.rr(-H / 2 + 40, H / 2 - 60); rain += c.ribbon([[x, y], [x - 8, y + 22]], 1.3); }
    const rainEl = B.add(`<g><path d="${rain}" fill="${mix(C.skyBlue2, C.cream, 0.4)}" opacity=".8"/></g>`);
    const walker = S.puppet(B.add(person(c, { ...WITNESS, holdF: `<g transform="translate(4 4)"><path d="M-9 4L9 4L6 -2L-6 -2Z" fill="${C.pot}"/><path d="M3 -2C0 -7 0 -12 3 -18C6 -12 6 -7 3 -2Z" fill="${C.lampFlame}"/></g>` })));
    const lampGlow = B.add(`<g>${warm(26, 0.8)}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { look: es(t, 0.1, 0.4) * (1 - es(t, 0.45, 0.7)) });

      /* v18 — the lens, the wind, one hair drifts down into His palm */
      const kL = es(t, 0.0, 0.2, ease.out) * (1 - es(t, 0.95, 1.12, ease.in));
      const ly = lerp(-1300, LY, kL), onL = kL > 0.002 ? 1 : 0;
      pose(lens, { x: LX, y: ly, r: T ? Math.sin(T * 0.8) * 0.8 : 0, o: onL });
      const wk = bump(t, 0.15, 0.55);
      pose(windEl, { x: LX + (T ? ((T * 90) % 60) - 30 : 0), y: ly, o: onL * wk });
      const palm = es(t, 0.35, 0.5);
      const [px, py] = handAt(JX, GY, JS, false, 30 + palm * 50);
      const d = es(t, 0.28, 0.72, (u) => u);
      const hx = lerp(LX + 60, px + 6, d) + Math.sin(d * PI * 3) * 40 * (1 - d);
      const hy = lerp(ly - 40, py - 6, ease.out(d));
      pose(hair, { x: hx, y: hy, r: d * 300, s: 1.5 - d * 0.3, o: t > 0.28 && t < 1.08 ? 1 : 0 });
      const gk = es(t, 0.62, 0.72);
      pose(glint, { x: px + 6, y: py - 8, s: 0.6 + gk * 0.5 + (T ? Math.sin(T * 3) * 0.05 : 0), r: T * 20, o: gk * (1 - es(t, 1.0, 1.1)) });

      /* Jesus: holds out His palm, looks at it (v18); speaks on (v19) */
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 30 + palm * 50 * (1 - es(t, 1.0, 1.15)) + es(t, 1.1, 1.3) * 30, armB: 10 + es(t, 1.1, 1.3) * 60, head: palm * 10 * (1 - es(t, 1.0, 1.15)) - es(t, 1.1, 1.3) * 6, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, GY, JS, false);
      T0.voice(jhx, jhy, 0.6 * (bump(t, 0.02, 0.4) + es(t, 1.05, 1.2)), T, { spread: 1.6 });

      /* v19 — the walker endures the storm to the dawn */
      const kF = es(t, 1.05, 1.25, ease.out);
      const fy = lerp(-1300, FY, kF), on = kF > 0.002 ? 1 : 0;
      pose(flatEl, { x: FX, y: fy, o: on });
      const clear = es(t, 1.55, 1.8);
      pose(rainEl, { x: FX, y: fy + (T ? (T * 60) % 20 : 0), o: on * (1 - clear) });
      const sk = es(t, 1.6, 1.85);
      pose(sunEl, { x: FX + 210, y: fy - 20 + (1 - sk) * 30, s: 0.8 + sk * 0.2, o: on * sk });
      const u = es(t, 1.22, 1.85, (x) => x);
      const segN = ROAD.length - 1, q = Math.min(segN - 0.001, u * segN * 0.9), i0 = Math.floor(q), f = q - i0;
      const wx = FX + lerp(ROAD[i0][0], ROAD[i0 + 1][0], f), wy = fy + lerp(ROAD[i0][1], ROAD[i0 + 1][1], f);
      const lift = es(t, 1.8, 1.95);
      walker.set({ x: wx, y: wy, s: 0.62, flip: false, o: on, walk: u > 0 && u < 1 ? wx * 0.08 : undefined, amt: 0.7, lean: 12 * (1 - clear), head: 8 * (1 - clear) - lift * 10, armF: 40 + lift * 60, blink: blinkAt(T, 3) });
      const [lx, lyy] = handAt(wx, wy, 0.62, false, 40 + lift * 60);
      pose(lampGlow, { x: lx + 4, y: lyy - 6, s: 1 + (T ? Math.sin(T * 6) * 0.06 : 0), o: on });

      S.cam.y = -es(t, 0.0, 0.4) * 30;
      S.cam.z = 1 + es(t, 0.0, 0.4) * 0.04;
      void seg; void shade; void tr;
    };
  },
};
