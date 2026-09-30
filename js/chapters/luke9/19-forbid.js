// Łk 9,49–50 — the same courtyard, the child still at His side. John steps forward: "Master, we saw someone casting out
// demons in your name, and we forbade him, because he doesn't follow with us" — and his story comes down as a painted
// flat: a stranger holding up a small golden star (the Name) over a man, a dark spirit fleeing from him; and two of
// the Twelve striding up with their hands raised to stop him, a red cross laid over him. "Don't forbid him, for he who
// is not against us is for us": Jesus lifts His hand, the red cross falls away, and a ring of gold opens round the
// stranger and the two disciples together; John lowers his head.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { yardSet, CHILD, STRANGER, TW9, bubble, crossX, heart, sparkle, halo, flat, flatSky, flatHills, figure, flyTo, folk, spirit, withFace, faceBits, kf, headAt, tr, PI } from './lib.js';

const JX = 780, FY = 716, CX = 862;
const DIS = [
  { k: 'james', x: 560, y: FY + 14 }, { k: 'peter', x: 480, y: FY + 6 },
  { k: 'andrew', x: 990, y: FY + 6 }, { k: 'thomas', x: 1070, y: FY + 14 }, { k: 'matthew', x: 1150, y: FY + 6 },
];
const W = 440, H = 240, FX = 800, FY0 = 300;

export default {
  id: 'lk9-forbid',
  beats: [
    { v: 49 },
    { v: 50 },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const Y = yardSet(S);
    const c = S.c;

    /* John's story, painted */
    const flatL = S.layer({ par: 0.3, sh: 6 });
    const star = `<g transform="translate(0 8)"><circle r="18" fill="url(#halo-glow)"/><path d="${c.cut(c.star(0, 0, 11, 5, 5), 0.2, 3)}" fill="${C.sun}"/></g>`;
    const inner = flatSky(S, W, H, [mix(C.skyBlue, C.cream, 0.3), C.cream]) + flatHills(c, W, 40, mix(C.hillMid, C.sand, 0.3))
      + sheet().p(c.cut(c.rect(-W / 2 - 4, 76, W + 8, 60), 0.6, 10), mix(C.sand, C.hillNear, 0.4)).out()
      + figure(c, { ...folk(c, true, { robe: C.stone }), pose: 'kneel' }, { x: -140, y: 100, s: 0.52, armF: 40, head: -8 })
      + figure(c, { ...STRANGER, holdF: star }, { x: -60, y: 100, s: 0.56, flip: true, armF: 100, armB: 30 })
      + figure(c, TW9.john, { x: 90, y: 100, s: 0.56, flip: true, armF: 100, armB: 120 }) + figure(c, TW9.james, { x: 156, y: 102, s: 0.56, flip: true, armF: 90, armB: 130 });
    const f1 = flatL.add(flat(S, inner, { w: W, h: H }));
    const ov = S.layer({ par: 0.3, sh: 5 });
    const sp = ov.add(`<g opacity="0">${spirit(c, 1, '#43384d')}</g>`);
    const X = ov.add(`<g opacity="0">${crossX(c, 30)}</g>`);
    const ring = ov.add(`<g opacity="0"><ellipse rx="120" ry="18" fill="none" stroke="${C.sun}" stroke-width="6"/><ellipse rx="120" ry="18" fill="url(#halo-glow)" opacity=".6"/></g>`);
    const hrt = ov.add(`<g opacity="0">${heart(c, 11)}</g>`);

    /* people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = DIS.map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const john = S.puppet(act.add(withFace(person(c, TW9.john), faceBits(c))));
    const jSad = john.el.querySelector('[data-part="sad"]');
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const child = S.puppet(act.add(person(c, CHILD)));
    const fx = S.layer({ par: 0.55, sh: 4 });
    const says = fx.add(`<g opacity="0">${bubble(c, tr('Mistrzu!', 'Master!'), { size: 22, tail: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      Y.update(T);
      /* v49 — John tells; the flat of what they did */
      const step = es(t, 0.02, 0.2);
      const jx = lerp(640, 680, step);
      john.set({ x: jx, y: FY + 6, s: 0.96, walk: step > 0 && step < 1 ? t * 20 : undefined, armF: 20 + bump(t, 0.1, 0.95) * 70, armB: bump(t, 0.2, 0.9) * 60, head: -4 + es(t, 1.2, 1.4) * 16, lean: es(t, 1.2, 1.4) * 5, blink: blinkAt(T, 2) });
      pose(jSad, { o: es(t, 1.2, 1.4) });
      const [hx, hy] = headAt(jx, FY + 6, 0.96, false);
      const sk = es(t, 0.08, 0.22, ease.back) * (1 - es(t, 0.5, 0.6));
      pose(says, { x: hx + 10, y: hy - 30, s: sk, o: sk > 0.01 ? 1 : 0 });
      const k1 = es(t, 0.15, 0.45, ease.out);
      flyTo(f1, k1, FX, FY0, T, 0);
      const oy = lerp(-1500, FY0, k1);
      const flee = seg(t, 0.4, 1.3);
      pose(sp, { x: FX - 140 + flee * 70, y: oy + 10 - flee * 70, s: 1.2, r: Math.sin(T * 3) * 10, o: k1 > 0.9 ? 1 - flee * 0.8 : 0 });
      const xk = es(t, 0.55, 0.7, ease.back) * (1 - es(t, 1.2, 1.35));
      pose(X, { x: FX - 60, y: oy + 44, s: xk, r: -es(t, 1.2, 1.35) * 40, o: xk > 0.01 ? 1 : 0 });

      /* v50 — do not forbid him */
      const rk = es(t, 1.3, 1.6);
      pose(ring, { x: FX + 40, y: oy + 100, s: 0.4 + rk * 0.8, o: rk });
      const hk = es(t, 1.45, 1.6, ease.back);
      pose(hrt, { x: FX + 40, y: oy - 40, s: hk, o: hk > 0.01 ? 1 : 0 });
      jesus.set({ x: JX, y: FY, s: 1.04, flip: t > 0.3 && t < 1.05, armF: 20 + bump(t, 1.05, 1.9) * 70, armB: 10 + bump(t, 1.05, 1.9) * 40, head: -2, blink: blinkAt(T, 1) });
      child.set({ x: CX, y: FY + 8, s: 0.6, armF: 20, head: -10, blink: blinkAt(T, 8) });
      D.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.94, flip: d.flip, armF: 20, head: -6 + bump(t, 1.2, 1.9) * 6, blink: blinkAt(T, d.seed) }));

      S.cam.z = kf(t, [[0, 1.04], [0.5, 1.02], [2, 1.02]]);
      S.cam.y = kf(t, [[0, 40], [0.5, 20], [2, 20]]);
    };
  },
};
