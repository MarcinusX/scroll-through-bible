// Mt 22,1 — the same day in the Temple courts (Mark 12's court): the crowd sits on the steps of the porch,
// the chief priests and the Pharisees stand apart, still smarting from the parable of the tenants. Jesus
// speaks to them again in parables: a painted tag comes down from the flies — a king's crown and a
// bridegroom's wreath.
import { C, person, CAST, blinkAt, pose, lerp, curtains, crowd, hanging } from '../kit.js';
import { es, ease } from '../../core/anim.js';
import { templeCourt, LOOK, pharisee, voiceRings, kf, moving, wreath, strip, sheet, tr } from './lib.js';
import { crown as headCrown } from '../mark6/lib.js';

export default {
  id: 'mt22-temple',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [
      { y: 604, s: 0.66, n: 5, x0: 400, x1: 660, pose: 'sit' },
      { y: 604, s: 0.66, n: 4, x0: 960, x1: 1200, pose: 'sit' },
    ]);
    const standers = crowd(S, stepL, [{ y: 616, s: 0.72, n: 3, x0: 240, x1: 400 }, { y: 616, s: 0.72, n: 3, x0: 1210, x1: 1380 }]);

    /* Jesus, his disciples, the chief priests and the Pharisees */
    const people = S.layer({ par: 0.5, sh: 5 });
    const leaders = [LOOK.priest, pharisee(c, 0), LOOK.elder, pharisee(c, 1)].map((o, i) => ({ p: S.puppet(people.add(person(c, o))), x: 990 + i * 62, y: F + 6 + (i % 2) * 8, i }));
    const dis = [CAST.john, CAST.peter, CAST.james, CAST.andrew].map((o, i) => ({ p: S.puppet(people.add(person(c, o))), x: 610 - i * 62, y: F + 10 + (i % 2) * 8, i }));
    const jesus = S.puppet(people.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(people, c, { n: 3, r: 26, w: 4 });

    /* a painted tag drops from the flies: a crown and a wedding wreath */
    const flyL = S.layer({ par: 0.3, sh: 5 });
    const card = sheet().p(c.cut([[-84, 0], [84, -2], [88, 96], [-86, 98]], 0.5, 6), C.cream).p(c.cut([[-76, 8], [76, 6], [80, 88], [-78, 88]], 0.3, 6), C.parchment).out();
    const tagInner = `${card}<g transform="translate(-30 64) scale(1.5)">${headCrown(c)}</g><g transform="translate(32 50) scale(1.35)">${wreath(c)}</g><g transform="translate(0 78)">${strip(c, tr('przypowieść', 'a parable'), { size: 16, fill: C.cream })}</g>`;
    const tagEl = hanging(flyL, tagInner, { x: 800, y: -300, len: 300 });

    set.front();
    const cur = curtains(S);

    const jKeys = [[0.15, 280], [1.0, 800]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      set.update(t, T);

      /* Jesus walks in from the left, the disciples behind him; then he speaks */
      const jx = kf(t, jKeys, ease.out);
      const speak = es(t, 1.0, 1.25);
      jesus.set({ x: jx, y: F, s: 1.02, walk: moving(t, jKeys) ? jx * 0.05 : undefined, blink: blinkAt(T), armF: speak * 72, armB: speak * 34, head: -speak * 4 });
      voice(jx + 26, F - 176, speak, T, { dir: 1 });
      dis.forEach((d) => {
        const x = Math.min(d.x, jx - 150 - d.i * 62);
        d.p.set({ x, y: d.y, s: 0.92, walk: moving(t, jKeys) && x < d.x ? x * 0.05 + d.i : undefined, blink: blinkAt(T, d.i + 2), head: -speak * 4 });
      });
      leaders.forEach((l) => {
        l.p.set({ x: l.x, y: l.y, s: 0.94, flip: true, armF: 30 + (l.i % 2) * 16, armB: l.i === 1 ? 50 : 20, head: 4 - speak * 8, blink: blinkAt(T, l.i + 5) });
      });
      const look = es(t, 0.5, 1.0);
      [...sitters, ...standers].forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: look > 0.5 ? m.x > jx : m.x > 800, head: -look * 6 - speak * 4, armF: speak * (m.i % 5 === 0 ? 20 : 0), blink: blinkAt(T, m.seed) });
      });

      const drop = es(t, 1.12, 1.6, ease.out);
      pose(tagEl, { x: 800, y: lerp(-800, 170, drop), r: Math.sin(T * 0.9) * 1.6 * drop });

      S.cam.z = 1 + es(t, 0.6, 1.6) * 0.06;
      S.cam.y = -es(t, 1.0, 1.6) * 20;
    };
  },
};
