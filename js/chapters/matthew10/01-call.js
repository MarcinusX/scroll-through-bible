// Mt 10,1 — the curtains open on the green hill over the lake, the crowd on the slope. Jesus on the knoll lifts
// His hand and calls: twelve men come down out of the crowd and gather round Him in a ring. Then He raises both
// hands, light goes out from Him, and a spark settles in the hands of each of the Twelve — the unclean spirits
// hovering over the crowd scatter, and a lame man in the front row lifts his crutch high.
import { C, person, CAST, blinkAt, pose, lerp, curtains } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hill, SPRING, MT12, RING, folk, group, spark, spirit, crutch, sparkle, hand, headAt, rayBurst, PI } from './lib.js';

const JX = 800;

export default {
  id: 'mt10-call',
  beats: [
    { cover: true },
    { v: 1, text: 'Wtedy przywołał do siebie dwunastu swoich uczniów' },
    { v: 1, cont: true, text: 'i udzielił im władzy nad duchami nieczystymi, aby je wypędzali i leczyli wszystkie choroby i wszelkie słabości.' },
  ],
  cam: { x: [-20, 20], y: [0, 50], z: [1, 1.08] },
  build(S) {
    let haloL;
    const H = hill(S, { skyCols: SPRING, behind: (S2) => { haloL = S.layer({ par: 0.2, sh: 1, flat: true }); } });
    const c = S.c;
    const { gfn, sfn } = H;

    /* ---------- the crowd on the slope (one still cut-out) ---------- */
    const pc = makeCutter('mt10-call-crowd');
    const mem = [];
    for (let i = 0; i < 30; i++) {
      const x = 250 + ((i * 397) % 1100) + pc.rr(-20, 20);
      if (Math.abs(x - 800) < 70) continue;
      const y = sfn(x) + 16 + (i % 4) * 16 + pc.rr(-4, 4);
      mem.push({ x, y, s: 0.42 + (y - sfn(x)) * 0.0028, flip: x > 800, o: folk(pc) });
    }
    H.slopeL.add(group(pc, mem));
    // the lame man in the front row, and the spirits hovering over the crowd
    const P0 = S.layer({ par: 0.34, sh: 4 });
    const LX = 1004, LY = sfn(1004) + 34;
    const lame = S.puppet(P0.add(person(c, { robe: C.stone2, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin3, holdF: `<g transform="rotate(180)">${crutch(c, 86)}</g>` })));
    const glowL = P0.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/></g>`);
    const stars = [0, 1, 2].map((i) => P0.add(`<g opacity="0">${sparkle(c, 10 + i * 3)}</g>`));
    const SP = [[560, 470], [700, 430], [1130, 450], [440, 500], [960, 420]].map(([x, y], i) => ({ x, y, i, el: P0.add(`<g opacity="0">${spirit(c, 1.1)}</g>`), seed: c.rr(0, 6) }));

    /* ---------- Jesus and the Twelve ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const halo = haloL.add(`<g opacity="0">${rayBurst(c, { n: 18, r0: 40, r1: 620, spread: 0.035, o: 0.6 })}<circle r="200" fill="url(#halo-glow)"/></g>`);
    const TW = MT12.map((m) => {
      const R = RING[m.i];
      const y1 = gfn(R.x) + R.dy;
      const x0 = 800 + (R.x - 800) * 1.25 + (m.i % 3 - 1) * 30, y0 = sfn(x0) + 40 + (m.i % 3) * 10;
      return { ...m, R, x1: R.x, y1, x0, y0, seed: c.rr(0, 9), at: 1.12 + (R.slot * 0.05) + (R.left ? 0 : 0.03) };
    }).sort((a, b) => a.y1 - b.y1);
    TW.forEach((m) => { m.p = S.puppet(P.add(person(c, m.o))); });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const sparks = TW.map(() => P.add(`<g opacity="0">${spark(c, 9)}</g>`));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      H.update(T);
      cur.set(es(t, 0.05, 0.85), T);

      /* v1a — He calls the Twelve to Himself */
      const call = bump(t, 1.0, 1.7);
      const JY = gfn(JX) + 10;
      const up = es(t, 2.02, 2.25) * (1 - es(t, 2.85, 3.0) * 0.4);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: t > 1.3 && t < 1.55, armB: 10 + call * 110 + up * 140, armF: 20 + call * 40 + up * 110, head: -call * 4 - up * 6, blink: blinkAt(T, 1) });
      pose(halo, { x: JX, y: JY - 190, s: 0.3 + up * 0.8, r: T * 4, o: up * 0.75 });

      TW.forEach((m, j) => {
        const k = es(t, m.at, m.at + 0.5, ease.io);
        const walking = k > 0.001 && k < 0.999;
        const x = lerp(m.x0, m.x1, k), y = lerp(m.y0, m.y1, k), s = lerp(0.5, m.R.s, k);
        // the spark of authority reaches him
        const got = es(t, 2.18 + j * 0.022, 2.42 + j * 0.022);
        const armF = 14 + got * 34;
        m.p.set({ x, y, s, flip: k > 0.6 ? m.R.flip : x > 800 ? true : false, walk: walking ? x * 0.06 + m.i : undefined, armF, armB: got * (m.i % 2 ? 70 : 115), head: -got * 6, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x1, m.y1, m.R.s, m.R.flip, armF);
        const fly = es(t, 2.12 + j * 0.022, 2.42 + j * 0.022);
        const sx = lerp(JX, hx, fly), sy = lerp(JY - 240, hy - 6, fly) - Math.sin(fly * PI) * 70;
        pose(sparks[j], { x: sx, y: sy, s: 0.7 + got * 0.3 + Math.sin(T * 3 + j) * 0.05 * got, r: T * 20, o: fly > 0.001 ? 1 - es(t, 2.95, 3.0) * 0.2 : 0 });
      });

      /* v1b — the unclean spirits scatter; the lame man is healed */
      SP.forEach((sp) => {
        const flee = es(t, 2.3 + sp.i * 0.04, 3.0 + sp.i * 0.04);
        const dir = sp.x < 800 ? -1 : 1;
        pose(sp.el, { x: sp.x + Math.sin(T * 1.3 + sp.seed) * 8 + flee * dir * 360, y: sp.y + Math.cos(T * 1.1 + sp.seed) * 6 - flee * 200, r: Math.sin(T * 2 + sp.seed) * 10 + flee * dir * 90, s: 1 - flee * 0.6, o: es(t, 1.6, 1.9) * (1 - flee) });
      });
      const heal = es(t, 2.4, 2.62);
      lame.set({ x: LX, y: LY, s: 0.56, flip: true, armF: lerp(22, 150, heal), armB: heal * 120, lean: (1 - heal) * -8, bob: (1 - heal) * 6, head: (1 - heal) * 14 - heal * 8, blink: blinkAt(T, 4) });
      const [lhx, lhy] = headAt(LX, LY, 0.56, true);
      pose(glowL, { x: lhx, y: lhy + 20, s: 0.6 + heal, o: bump(t, 2.4, 3.0) * 0.9 });
      stars.forEach((st, i) => {
        const k = es(t, 2.45 + i * 0.05, 2.7 + i * 0.05, ease.back);
        pose(st, { x: lhx + (i - 1) * 30, y: lhy - 40 - (i % 2) * 18, s: k, r: T * 30 + i * 40, o: k > 0.01 ? 1 - es(t, 2.95, 3.0) * 0.3 : 0 });
      });

      S.cam.z = 1 + es(t, 0.9, 1.6) * 0.03 + es(t, 2.0, 2.4) * 0.03;
      S.cam.y = es(t, 0.9, 1.6) * 30;
    };
  },
};
