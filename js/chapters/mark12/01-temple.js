// Mk 12,1a — in the Temple courts of Jerusalem: the crowd sits on the steps of Solomon's porch,
// the chief priests, the scribe and the elder stand apart; Jesus begins to speak in parables.
import { C, person, CAST, blinkAt, pose, lerp, curtains, crowd, hanging } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, LOOK, voiceRings, kf, moving, grapeBunch, paperLabel, sheet, shade, hang } from './lib.js';

export default {
  id: 'm12-temple',
  beats: [
    { cover: true },
    { v: 1, text: 'I zaczął im mówić w przypowieściach:' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    /* the crowd sitting on the steps of the porch */
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [
      { y: 604, s: 0.66, n: 5, x0: 400, x1: 660, pose: 'sit' },
      { y: 604, s: 0.66, n: 4, x0: 960, x1: 1200, pose: 'sit' },
    ]);
    const standers = crowd(S, stepL, [{ y: 616, s: 0.72, n: 3, x0: 240, x1: 400 }, { y: 616, s: 0.72, n: 3, x0: 1210, x1: 1380 }]);

    /* Jesus, his disciples, the leaders */
    const people = S.layer({ par: 0.5, sh: 5 });
    const leaders = [LOOK.elder, LOOK.priest, LOOK.lscribe].map((o, i) => ({ p: S.puppet(people.add(person(c, o))), x: 1000 + i * 70, y: F + 6 + (i % 2) * 8, i }));
    const dis = [CAST.john, CAST.peter, CAST.james, CAST.andrew].map((o, i) => ({ p: S.puppet(people.add(person(c, o))), x: 610 - i * 62, y: F + 10 + (i % 2) * 8, i }));
    const jesus = S.puppet(people.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(people, c, { n: 3, r: 26, w: 4 });

    /* a painted tag drops from the flies: a parable is coming */
    const flyL = S.layer({ par: 0.3, sh: 5 });
    const tagInner = `${sheet().p(c.cut([[-70, 0], [70, -2], [74, 70], [-72, 72]], 0.5, 6), C.cream).p(c.cut([[-62, 8], [62, 6], [66, 64], [-64, 64]], 0.3, 6), C.parchment).out()}<g transform="translate(-34 16) scale(1.5)">${grapeBunch(c, 4.4)}</g><path d="${c.ribbon(c.qbez([-58, 22], [-30, 4], [-6, 20], 8), 2.4)}" fill="${C.moss}"/>${paperLabel(tr('przypowieść', 'a parable'), { size: 17, fill: 'none' }).replace('<g', '<g transform="translate(22 44)"')}`;
    const tagEl = hanging(flyL, tagInner, { x: 800, y: -300, len: 300 });

    set.front();
    const cur = curtains(S);

    const jKeys = [[0.15, 280], [1.0, 800]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      set.update(t, T);

      /* Jesus walks in from the left, the disciples behind him */
      const jx = kf(t, jKeys, ease.out);
      const speak = es(t, 1.0, 1.3);
      jesus.set({
        x: jx, y: F, s: 1.02, walk: moving(t, jKeys) ? jx * 0.05 : undefined, blink: blinkAt(T),
        armF: speak * (70 + Math.sin(T * 1.5) * 8), armB: speak * 30, head: -speak * 4,
      });
      voice(jx + 26, F - 176, speak * (1 - es(t, 1.85, 2.1)), T, { dir: 1 });
      dis.forEach((d) => {
        const x = Math.min(d.x, jx - 150 - d.i * 62);
        d.p.set({ x, y: d.y, s: 0.92, walk: moving(t, jKeys) && x < d.x ? x * 0.05 + d.i : undefined, blink: blinkAt(T, d.i + 2), head: -speak * 4 });
      });
      leaders.forEach((l) => {
        l.p.set({ x: l.x, y: l.y, s: 0.94, flip: true, armF: 36 + speak * 10, armB: 40, head: -es(t, 0.6, 1.0) * 6 + speak * 4, blink: blinkAt(T, l.i + 5) });
      });
      // the crowd turns to Jesus as he comes in, and listens
      const look = es(t, 0.5, 1.0);
      [...sitters, ...standers].forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: look > 0.5 ? m.x > jx : m.x > 800, head: -look * 6 - speak * 4, armF: speak * (m.i % 5 === 0 ? 20 : 0), blink: blinkAt(T, m.seed) });
      });

      /* the tag with the grapes comes down on its string */
      const drop = es(t, 1.15, 1.7, ease.out);
      pose(tagEl, { x: 800, y: lerp(-800, 180, drop), r: Math.sin(T * 0.9) * 1.6 * drop });

      S.cam.z = 1 + es(t, 0.6, 1.8) * 0.06;
      S.cam.y = -es(t, 1.0, 1.8) * 20;
    };
  },
};
