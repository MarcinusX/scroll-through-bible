// Łk 9,14–15 — evening on the hillside. "There were about five thousand men": the view draws back and the slope fills
// from end to end, row behind row, and a tag comes down with the number. "Make them sit down in groups of about fifty":
// Jesus points out over the slope, four of the Twelve go out among the people, and pale rings open in the grass where
// each company is to sit. "They did so, and made them all sit down": company by company, from the front to the back,
// the standing crowd sits down in round companies on the grass.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { bethSet, bethCrowd, moreCrowd, ringSprites, RINGS, TW9, labelTag, halo, kf, tr, PI } from './lib.js';

const JX = 790;
const GO = [{ k: 'peter', to: 600 }, { k: 'john', to: 1000 }, { k: 'andrew', to: 400 }, { k: 'james', to: 1190 }];

export default {
  id: 'lk9-fifty',
  beats: [
    { v: 14, text: 'Było bowiem około pięciu tysięcy mężczyzn.' },
    { v: 14, cont: true, text: 'Wtedy rzekł do swych uczniów: «Każcie im rozsiąść się gromadami mniej więcej po pięćdziesięciu!»' },
    { v: 15 },
  ],
  cam: { x: [-20, 20], y: [0, 70], z: [0.98, 1.14] },
  build(S) {
    const B = bethSet(S, { eveCols: ['#7d78a6', '#e3a78b', '#f4cf9f'] });
    const c = S.c;
    B.eve.fade(0.85);
    const gy = (x) => B.gfn(x) + 18;
    const CR = bethCrowd(B);
    const MORE = moreCrowd(S, B);
    // the pale rings in the grass where the companies will sit
    const RG = RINGS.map(([x, y, s], i) => ({ i, x, y, s, el: B.slopeL.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 90, 22, 26), 0.8, 6)}" fill="${mix(C.sage3, C.cream, 0.4)}"/></g>`) }));
    const SEAT = ringSprites(B);

    /* Jesus and the Twelve */
    const act = S.layer({ par: 0.5, sh: 5 });
    const STAY = [{ k: 'philip', x: 930 }, { k: 'matthew', x: 1000 }, { k: 'thomas', x: 650 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))), q: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))) }));
    const D = GO.map((d, i) => ({ ...d, i, x0: i % 2 ? 900 + i * 30 : 690 - i * 30, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))), q: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'kneel' }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.4, sh: 5 });
    const count = hanging(fx, `<g transform="scale(1.25)">${labelTag(tr('około 5000 mężczyzn', 'about 5,000 men'), 20)}</g>`, { x: 0, y: -1500, len: 900 });
    const fifty = hanging(fx, `<g transform="scale(1.1)">${labelTag(tr('po pięćdziesięciu', 'about fifty each'), 19)}</g>`, { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const T = time;
      B.update(T, { sunX: 1120, sunY: 400 });

      /* v14a — about five thousand */
      const fill = es(t, 0.05, 0.6);
      CR.forEach((m) => m.sp.set({ x: m.x, y: m.y, o: 1 - es(t, 2.05 + (m.i % 6) * 0.08, 2.12 + (m.i % 6) * 0.08) }));
      MORE.forEach((m) => {
        const k = es(t, 0.05 + (m.i % 7) * 0.05, 0.3 + (m.i % 7) * 0.05);
        m.sp.set({ x: m.x, y: m.y + (1 - k) * 30, o: k * (1 - es(t, 2.05 + (m.i % 6) * 0.08, 2.12 + (m.i % 6) * 0.08)) });
      });
      const ck = es(t, 0.25, 0.5, ease.back) * (1 - es(t, 1.0, 1.25));
      pose(count, { x: 800, y: lerp(-1500, 250, ck), r: Math.sin(T * 0.9) * 2, oy: 0, o: ck > 0.002 ? 1 : 0 });

      /* v14b — groups of about fifty */
      const point = bump(t, 1.05, 1.95);
      jesus.set({ x: JX, y: gy(JX), s: 1.02, flip: Math.floor(t * 2) % 2 === 1 && t > 1.05 && t < 2, armF: 20 + point * 80, armB: 10 + bump(t, 2.1, 2.95) * 60, head: -4, blink: blinkAt(T, 1) });
      const fk = es(t, 1.15, 1.4, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(fifty, { x: 800, y: lerp(-1500, 260, fk), r: Math.sin(T * 0.9) * 2, oy: 0, o: fk > 0.002 ? 1 : 0 });
      RG.forEach((r) => {
        const k = es(t, 1.35 + (r.i % 6) * 0.05, 1.55 + (r.i % 6) * 0.05);
        pose(r.el, { x: r.x, y: r.y + 4, s: r.s * (0.6 + k * 0.4), o: k * (1 - es(t, 2.1, 2.6)) });
      });
      D.forEach((d) => {
        const go = es(t, 1.2 + d.i * 0.05, 1.7 + d.i * 0.05);
        const x = lerp(d.x0, d.to, go);
        const wave = bump(t, 1.7, 2.9);
        const kn = es(t, 2.1 + d.i * 0.05, 2.17 + d.i * 0.05);
        const flip = d.to < JX ? go < 1 && go > 0 : !(go < 1 && go > 0);
        d.p.set({ x, y: gy(x) + 8 + (d.i % 2) * 8, s: 0.92, flip, o: 1 - kn, walk: go > 0 && go < 1 ? x * 0.07 : undefined, armF: 30 + wave * 40 + Math.sin(t * 10 + d.i) * 10 * wave, armB: wave * 20, lean: wave * 6, blink: blinkAt(T, d.seed) });
        d.q.set({ x, y: gy(x) + 8 + (d.i % 2) * 8, s: 0.92, flip, o: kn, armF: 60, armB: 30, lean: 8, blink: blinkAt(T, d.seed) });
      });
      STAY.forEach((d) => {
        const sit = es(t, 2.05 + d.i * 0.04, 2.12 + d.i * 0.04);
        d.p.set({ x: d.x, y: gy(d.x) + 10, s: 0.92, flip: d.x > JX, armF: 20, head: -6, o: 1 - sit, blink: blinkAt(T, d.seed) });
        d.q.set({ x: d.x, y: gy(d.x) + 14, s: 0.92, flip: d.x > JX, armF: 30, head: -6, o: sit, blink: blinkAt(T, d.seed) });
      });

      /* v15 — they all sit down, company by company */
      SEAT.forEach((g) => {
        const a = 2.08 + (g.i % 6) * 0.08;
        g.sp.set({ x: g.x, y: g.y, o: es(t, a, a + 0.07) });
      });

      S.cam.z = kf(t, [[0, 1.12], [0.6, 1.0], [1.0, 1.0], [1.4, 1.03], [2.0, 1.03], [2.6, 0.99]]);
      S.cam.y = kf(t, [[0, 60], [0.6, 20], [1.0, 20], [1.4, 30], [2.6, 20]]);
    };
  },
};
