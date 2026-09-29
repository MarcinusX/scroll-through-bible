// Mt 22,14 — back in the Temple court with Jesus. "Many are called": sealed invitations flutter down over the
// whole crowd, one for everybody, the chief priests and the Pharisees too. "But few are chosen": most of them
// fade, and only a few kindle to gold in the hands of those who took them up.
import { C, person, CAST, blinkAt, pose, lerp, crowd } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { templeCourt, LOOK, pharisee, voiceRings, invitation, sparkle } from './lib.js';

const JX = 780;

export default {
  id: 'mt22-chosen',
  beats: [
    { v: 14 },
  ],
  cam: { x: [-20, 20], y: [-40, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [
      { y: 604, s: 0.66, n: 5, x0: 400, x1: 660, pose: 'sit' },
      { y: 604, s: 0.66, n: 4, x0: 920, x1: 1180, pose: 'sit' },
    ]);
    const pl = S.layer({ par: 0.5, sh: 5 });
    const standers = crowd(S, pl, [{ y: F + 10, s: 0.86, n: 3, x0: 380, x1: 560 }]);
    const leaders = [LOOK.priest, pharisee(c, 0), pharisee(c, 1)].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 1010 + i * 64, y: F + 6 + (i % 2) * 8, i }));
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 640 - i * 56, i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });

    /* the invitations: one over everybody's head */
    const airL = S.layer({ par: 0.52, sh: 3 });
    const heads = [
      ...sitters.map((m) => [m.x, m.y - 110 * m.s - 40]),
      ...standers.map((m) => [m.x, m.y - 190 * m.s - 30]),
      ...leaders.map((l) => [l.x, l.y - 200]),
      ...dis.map((d) => [d.x, F - 196]),
    ];
    const chosen = new Set([1, 6, 10]);
    const inv = heads.map(([x, y], i) => {
      const lit = chosen.has(i);
      const el = airL.add(`<g>${lit ? `<g data-part="glow" opacity="0"><circle r="70" fill="url(#halo-glow)"/><circle r="34" fill="url(#warm-glow)"/></g>` : ''}<g transform="scale(1.5)">${invitation(c, 32)}</g></g>`);
      return { el, x, y, i, lit, glow: el.querySelector('[data-part="glow"]'), ph: c.rr(0, 6), x0: x + c.rr(-120, 120) };
    });
    const sparks = [0, 1, 2, 3, 4, 5].map(() => airL.add(`<g>${sparkle(c, 9)}</g>`));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* many are called: the invitations float down over everyone */
      inv.forEach((v) => {
        const k = es(t, 0.05 + (v.i % 7) * 0.03, 0.42 + (v.i % 7) * 0.03, ease.out);
        const few = es(t, 0.5, 0.66);
        const x = lerp(v.x0, v.x, k), y = lerp(-120, v.y, k) + Math.sin(T * 1.3 + v.ph) * 4 * k;
        const r = lerp(180 + v.ph * 30, Math.sin(T + v.ph) * 8, k);
        pose(v.el, { x, y: y - (v.lit ? few * 16 : -few * 10), r, s: v.lit ? 1 + few * 0.5 : 1 - few * 0.2, o: k > 0.01 ? (v.lit ? 1 : 1 - few * 0.75) : 0 });
        if (v.glow) pose(v.glow, { o: few });
      });
      sparks.forEach((el, i) => {
        const v = inv[[1, 6, 10][i % 3]];
        const k = ((T * 0.5 + i / 6) % 1);
        pose(el, { x: v.x + (i < 3 ? -1 : 1) * (18 + k * 16), y: v.y - 26 - k * 30, s: 0.7, o: es(t, 0.55, 0.7) * Math.sin(k * Math.PI) });
      });

      jesus.set({ x: JX, y: F, s: 1.04, blink: blinkAt(T), armF: 40 + bump(t, 0.05, 0.5) * 50, armB: 20 + bump(t, 0.5, 0.95) * 90, head: -6 });
      voice(JX + 26, F - 178, 1, T, { dir: 1 });
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.92, head: -6, blink: blinkAt(T, d.i + 3) }));
      leaders.forEach((l) => l.p.set({ x: l.x, y: l.y, s: 0.94, flip: true, armF: 30, armB: l.i === 1 ? 40 : 10, head: 6, blink: blinkAt(T, l.i + 5) }));
      [...sitters, ...standers].forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -8, blink: blinkAt(T, m.seed) }));

      S.cam.y = -20;
      S.cam.z = 1.03;
    };
  },
};
