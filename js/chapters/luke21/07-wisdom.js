// Łk 21,14–15 — a painted flat of a hall of judgment: the governor on his seat under a red awning, two accusers
// pointing, and the disciple standing before them. "Settle it in your hearts not to meditate beforehand how to answer":
// a thought-cloud of prepared speeches hangs over him — the slips blow away out of it, the cloud is gone, and a small
// warm heart shows on his breast: he is at peace. "For I will give you a mouth and wisdom which none of your adversaries
// will be able to withstand or contradict": from Jesus' open hand a small flame of light floats up into the flat and
// rests over the disciple; he speaks, and golden words go out from him — the accusers' pointing hands drop, their
// questions shrink to nothing, they bow their heads; the governor sits back, hand to his chin.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, flatSky, WITNESS, thought, dashSlip, heart, speech, GLYPH, voiceRings, headAt, handAt, warm,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const W = 580, H = 280, FX = 800, FY = 300;
const GL = 108;                  // ground line (flat coords)
const FS = 0.62;                 // figures' scale
const WX = -130, AX = [70, 128], GX = 206;   // witness, accusers, governor (flat coords)
const GOV = { robe: C.linen, mantle: mix(C.plumRobe, C.indigo, 0.3), hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.sun };
const ACC = [
  { robe: C.wheatRobe, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.teal2, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre },
  { robe: C.dustyBlue, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.leather },
];

function hall(c) {
  const s = sheet();
  s.p(c.cut([[-W / 2 - 4, -H / 2 - 4], [W / 2 + 4, -H / 2 - 4], [W / 2 + 4, GL], [-W / 2 - 4, GL]], 0.5, 10), mix(C.plaster, C.stone, 0.3));
  let col = '';
  [-220, -110, 0, 110, 220].forEach((x) => { col += c.cut(c.rect(x - 16, -H / 2, 32, GL + H / 2), 0.4, 8); });
  s.p(col, mix(C.cream, C.stone, 0.2));
  s.x(c.ribbon([[-W / 2, -H / 2 + 26], [W / 2, -H / 2 + 26]], 5), C.ochre, 'opacity=".7"');
  s.p(c.cut([[-W / 2 - 4, GL], [W / 2 + 4, GL], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.5, 10), mix(C.stone2, C.sand2, 0.4));
  // the dais and the seat, the awning
  s.p(c.cut(c.rect(GX - 70, GL - 18, 150, 18), 0.4, 6), mix(C.stone, C.plaster2, 0.3));
  s.p(c.cut([[GX - 30, GL - 18], [GX - 22, GL - 58], [GX + 34, GL - 58], [GX + 40, GL - 18]], 0.4, 5), C.wood2);
  s.p(c.cut([[GX - 90, -H / 2 + 34], [GX + 90, -H / 2 + 34], [GX + 80, -H / 2 + 70], [GX + 40, -H / 2 + 60], [GX, -H / 2 + 72], [GX - 40, -H / 2 + 60], [GX - 80, -H / 2 + 70]], 0.5, 6), C.terracotta);
  return s.out();
}

export default {
  id: 'lk21-wisdom',
  beats: [
    { v: 14 },
    { v: 15 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const B = T0.bits;
    const flatEl = T0.FL.add(flat(S, hall(c), { w: W, h: H }));
    const gov = S.puppet(B.add(person(c, { ...GOV, pose: 'sit' })));
    const acc = ACC.map((o, i) => ({ i, p: S.puppet(B.add(person(c, o))), q: B.add(`<g>${speech(c, `<g transform="scale(1.2)">${GLYPH.q(c)}</g>`, { w: 44, h: 40, flip: true })}</g>`) }));
    const wit = S.puppet(B.add(person(c, WITNESS)));
    const cloud = B.add(`<g>${thought(c, '', { w: 150, h: 96 })}</g>`);
    const notes = [0, 1, 2].map((i) => ({ i, el: B.add(`<g>${dashSlip(c, 50, 26)}</g>`) }));
    const hrt = B.add(`<g>${heart(c, 9)}</g>`);
    const tongue = T0.fx.add(`<g>${warm(22, 0.9)}<path d="M0 0C-8 -7 -8 -20 0 -34C8 -20 8 -7 0 0Z" fill="${C.lampFlame}"/><path d="M0 -4C-3 -8 -3 -14 0 -20C3 -14 3 -8 0 -4Z" fill="#fff4d2"/></g>`);
    const words = [0, 1, 2, 3].map((i) => ({ i, el: B.add(`<g>${dashSlip(c, 44, 22, { fill: C.halo, ink: C.ochre })}</g>`) }));
    const wv = voiceRings(B, c, { n: 3, color: C.sun, r: 20, w: 3.4, both: false });

    return (t, time) => {
      const T = time;
      T0.update(t, T, { look: es(t, 0.1, 0.4) });

      /* Jesus: speaks gently (v14); opens His hand and gives (v15) */
      const give = es(t, 1.02, 1.2);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + bump(t, 0.05, 0.95) * 40 + give * 100, armB: 10 + bump(t, 0.05, 0.95) * 30, head: -give * 12, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, bump(t, 0.02, 0.95) * 0.7 + bump(t, 1.0, 1.4) * 0.5, T, { spread: 1.8 });

      /* the flat */
      const k = es(t, 0.0, 0.22, ease.out);
      const fy = lerp(-1300, FY, k), on = k > 0.002 ? 1 : 0;
      pose(flatEl, { x: FX, y: fy, o: on });
      const P = (lx, ly) => [FX + lx, fy + ly];
      const [gx, gy] = P(GX, GL - 18);
      gov.set({ x: gx, y: gy, s: FS, flip: true, o: on, armF: 30 + es(t, 1.6, 1.8) * 50, head: es(t, 1.6, 1.8) * 8, blink: blinkAt(T, 7) });
      const silent = es(t, 1.5, 1.7);
      acc.forEach((a) => {
        const [ax, ay] = P(AX[a.i], GL);
        a.p.set({ x: ax, y: ay, s: FS, flip: true, o: on, armF: 20 + es(t, 0.1, 0.3) * 75 * (1 - silent) + silent * 5, armB: a.i ? 30 : 10, head: -4 + silent * 14, blink: blinkAt(T, 4 + a.i) });
        const qk = es(t, 0.3 + a.i * 0.1, 0.45 + a.i * 0.1, ease.back) * (1 - es(t, 1.45, 1.6));
        const [qx, qy] = headAt(ax, ay, FS, true);
        pose(a.q, { x: qx - 6, y: qy - 24, s: qk * 0.9, o: on * (qk > 0.02 ? 1 : 0) });
      });
      const [wx, wy] = P(WX, GL);
      const speak = es(t, 1.35, 1.5);
      wit.set({ x: wx, y: wy, s: FS, flip: false, o: on, armF: 10 + speak * 70, armB: 8 + speak * 30, head: -2 - speak * 6, blink: blinkAt(T, 3) });
      const [whx, why] = headAt(wx, wy, FS, false);
      // v14 — the prepared speeches blow away; the heart
      const ck = es(t, 0.15, 0.32, ease.back) * (1 - es(t, 0.62, 0.72));
      pose(cloud, { x: whx + 2, y: why - 10, s: ck, o: on * (ck > 0.02 ? 1 : 0) });
      notes.forEach((n) => {
        const blow = es(t, 0.45 + n.i * 0.05, 0.75 + n.i * 0.05, ease.in);
        const x = whx + 18 + (n.i - 1) * 40 - blow * (120 + n.i * 50);
        const y = why - 10 - 58 + (n.i % 2) * 10 - blow * (90 + n.i * 30);
        pose(n.el, { x, y, r: (n.i - 1) * 8 - blow * (160 + n.i * 90), s: 0.9 * es(t, 0.2, 0.35), o: on * (1 - blow) });
      });
      const hk = es(t, 0.65, 0.85, ease.back);
      pose(hrt, { x: wx + 6 * FS, y: wy - 118 * FS, s: hk, o: on * (hk > 0.02 ? 1 : 0) * (1 - es(t, 1.9, 2)) });
      // v15 — the flame of wisdom floats up from Jesus' hand to rest over him; he speaks, golden words go out
      const [jhx, jhy] = handAt(JX, GY, JS, false, 120);
      const fl = es(t, 1.08, 1.4);
      const tx = lerp(jhx, whx + 2, fl), ty = lerp(jhy - 10, why - 58, fl) - Math.sin(fl * PI) * 120;
      pose(tongue, { x: tx, y: ty, s: 0.8 + (T ? Math.sin(T * 6) * 0.05 : 0), o: es(t, 1.04, 1.12) });
      wv(whx + 22, why + 6, speak, T, { dir: 1, spread: 1.6 });
      words.forEach((w) => {
        const a = 1.4 + w.i * 0.08;
        const q = seg(t, a, a + 0.35);
        const x = lerp(whx + 30, wx + 170 + w.i * 14, q), y = why + 4 - w.i * 18 - Math.sin(q * PI) * 20;
        pose(w.el, { x, y, r: (w.i - 1.5) * 6, s: 0.9, o: on * es(t, a, a + 0.05) });
      });

      S.cam.y = -es(t, 0.0, 0.4) * 30;
      S.cam.z = 1 + es(t, 0.0, 0.4) * 0.04;
      void flatSky; void shade; void tr;
    };
  },
};
