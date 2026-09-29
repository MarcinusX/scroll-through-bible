// Mt 20,1–2 — the curtains open on the painted set of the parable at first light: the householder's house on the
// left, the village market with its well, the walled vineyard on the right, the sun just lifting over the hills.
// Labourers already wait in the square with their hoes. The door opens and the householder comes out early to hire
// them. "A denarius a day": he and the first of them shake hands, and a great silver denarius is let down above them
// on its string. Then he points them to his vineyard and they go in at the gate, to their places among the vines.
import { C, person, blinkAt, pose, lerp, curtains } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineWorld, VW, SLOTS, workPose, SKY, OWNER, FIRST, worker, denarius, kf, moving, kfXY, movingXY, hangAt, say, tr } from './lib.js';

// where the first labourers wait, and their places inside the vineyard
const WAIT = [[636, 708], [694, 690], [748, 706], [806, 690], [858, 704]];
const SLOT = SLOTS.first;
const OX = 522;          // where the householder stops to bargain

export default {
  id: 'mt20-dawn',
  parable: true,
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-90, 110], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const W = vineWorld(S, { sky: SKY.dawn, sky2: SKY.morning, tags: ['dawn'] });

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const men = FIRST.map((o, i) => ({ i, p: S.puppet(P.add(worker(c, o, i === 1 || i === 3 ? 'basket' : 'hoe'))), seed: c.rr(0, 9), w: WAIT[i], sl: SLOT[i] }));
    const owner = S.puppet(P.add(person(c, OWNER)));

    const fx = S.layer({ par: 0.3, sh: 5 });
    const coinEl = fx.add(`<g><path d="M0 -84V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><circle r="120" fill="url(#halo-glow)" opacity=".6"/>${denarius(c, 70)}</g>`);
    const dayTag = fx.add(`<g>${say(c, tr('denar za dzień', 'a denarius a day'), { size: 19, side: 1 })}</g>`);
    const toVine = fx.add(`<g>${say(c, tr('Do mojej winnicy!', 'Into my vineyard!'), { size: 19, side: 1 })}</g>`);

    W.front();
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      /* the sun lifts over the hills; dawn brightens into morning */
      const h = lerp(-0.5, 1.2, es(t, 0, 3));
      W.update(t, T, { h, tag: 'dawn', tagO: es(t, 1.05, 1.3, ease.out) });
      W.sk2L.fade(es(t, 0.8, 3));

      /* v1 — the door opens and the householder goes out early to hire labourers */
      const door = es(t, 1.02, 1.12);
      pose(W.doorEl, { x: VW.DOOR - 18, y: VW.DOORY, sx: 1 - door * 0.82 });
      const OK = [[1.1, VW.DOOR], [1.65, OX]];
      const ox = kf(t, OK, (u) => u);
      const point = es(t, 2.4, 2.55) * (1 - es(t, 2.95, 3.2));
      const shake = es(t, 2.05, 2.22) * (1 - es(t, 2.38, 2.48));
      owner.set({
        x: ox, y: lerp(VW.DOORY, VW.G + 4, es(t, 1.12, 1.6)), s: lerp(0.8, 0.98, es(t, 1.12, 1.6)), o: es(t, 1.08, 1.16), walk: moving(t, OK) ? ox * 0.05 : undefined,
        armF: 14 + bump(t, 1.62, 2.02) * 50 + shake * 62 + point * 76, armB: bump(t, 1.62, 2.02) * 40 + point * 30,
        head: -bump(t, 1.62, 2.02) * 4 + point * -6, blink: blinkAt(T),
      });

      /* the men look up as he comes; v2 — the first steps forward and shakes hands; then they go in */
      men.forEach((m) => {
        const go0 = 2.42 + m.i * 0.06;
        const [wx, wy] = m.w, [sx, sy] = m.sl;
        const step = m.i === 0 ? es(t, 1.95, 2.1) * (1 - es(t, 2.4, 2.45)) : 0;
        const stepX = step * 10;
        const keys = [[go0, [wx - stepX, wy]], [go0 + 0.3, [930, VW.G + 2]], [go0 + 0.5, [sx, sy]]];
        const [x, y] = t < go0 ? [wx - stepX, wy] : kfXY(t, keys);
        const walking = movingXY(t, keys);
        const inside = t > go0 + 0.5;
        const look = es(t, 1.35, 1.6) * (1 - es(t, go0, go0 + 0.05));
        const work = inside ? es(t, go0 + 0.5, go0 + 0.6) : 0;
        const wp = workPose(m.i, work);
        m.p.set({
          x, y, s: lerp(0.94, 0.86, es(t, go0 + 0.3, go0 + 0.5)), flip: t < go0 ? true : inside ? wp.flip : false,
          walk: walking ? x * 0.05 + m.i : undefined, lean: wp.lean,
          armF: (m.i === 0 ? shake * 62 : 0) + look * 10 + (inside ? wp.armF : 10), armB: inside ? wp.armB : 0,
          head: -look * 4 + (inside ? wp.head : 0), blink: blinkAt(T, m.seed),
        });
      });

      /* the denarius let down above the handshake */
      const cd = es(t, 2.08, 2.4, ease.back) * (1 - es(t, 2.85, 3.2, ease.in));
      hangAt(coinEl, 700, lerp(-300, 300, cd), T, 1.4, 0.7);
      const dt = es(t, 2.2, 2.35, ease.back) * (1 - es(t, 2.6, 2.7));
      pose(dayTag, { x: 772, y: 350, s: dt, o: dt > 0.02 ? 1 : 0 });
      const tv = es(t, 2.5, 2.62, ease.back) * (1 - es(t, 2.93, 3.05));
      pose(toVine, { x: OX + 26, y: VW.G - 214, s: tv, o: tv > 0.02 ? 1 : 0 });

      S.cam.x = lerp(0, -80, es(t, 0.7, 1.4)) + es(t, 1.9, 2.4) * 40 + es(t, 2.45, 3.0) * 130;
      S.cam.z = 1 + es(t, 0.7, 1.4) * 0.07 - es(t, 2.45, 3.0) * 0.04;
      S.cam.y = 10;
    };
  },
};
