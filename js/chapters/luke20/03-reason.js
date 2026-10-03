// Łk 20,5–6 — the three turn their backs on Him and put their heads together. "If we say 'From heaven', He will say:
// 'Why did you not believe him?'": over the huddle a big thought cloud — the plate of the cloud and light, and then a
// finger pointing straight back at them with a "?" — and they flinch. "But if we say 'From men', all the people will
// stone us, for they are convinced that John was a prophet": in the cloud now three men of the crowd, stones raised; the
// leaders shrink and glance over their shoulders at the real crowd — over whose heads John's medallion has come down,
// "prophet" on its strip, the people looking up at it.
import { blinkAt, pose, lerp } from '../kit.js';
import { courtSet, CQ, LEADERS, bigThought, choicePlate, pointHand, qMark, stoner, johnMedal, label, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg } from './lib.js';

export default {
  id: 'lk20-reason',
  beats: [
    { v: 5 },
    { v: 6 },
  ],
  cam: { x: [0, 90], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const Q = courtSet(S);
    const c = Q.c;
    const heavenIn = `<g transform="translate(-50 -4) scale(.62)">${choicePlate(c, 'heaven', tr('z nieba', 'from heaven')).replace(/<path d="M0 -1600V[^"]*"[^>]*\/>/, '')}</g>`;
    const TDX = S.portrait ? -70 : 0;   // phone: the clouds float a little left, clear of the thread
    const t1 = Q.W.add(`<g opacity="0">${bigThought(c, heavenIn, { w: 230, h: 120, dx: TDX })}</g>`);
    const finger = Q.W.add(`<g opacity="0"><g transform="scale(-.55 .55)">${pointHand(c, { cuff: '#d98b7a' })}</g><g transform="translate(-10 -28)">${qMark(c, 30)}</g></g>`);
    const menIn = [stoner(c, 'lk20-st1', { x: -62, y: 48, s: 0.46 }), stoner(c, 'lk20-st3', { x: 62, y: 48, s: 0.46, flip: true }), stoner(c, 'lk20-st2', { x: 0, y: 54, s: 0.5 })].join('');
    const t2 = Q.W.add(`<g opacity="0">${bigThought(c, menIn, { w: 230, h: 120, dx: TDX })}</g>`);
    const medal = Q.flyL.add(`<g><path d="M0 -1600V-56" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${johnMedal(c, S.id('jm'), 50)}<g transform="translate(0 78)">${label(c, tr('prorok', 'a prophet'), { size: 18 })}</g></g>`);

    return (t, time) => {
      const T = time;
      const hud = es(t, 0.05, 0.3);
      const flinch = bump(t, 0.6, 1.0);
      const fear = es(t, 1.4, 1.6);
      const glance = es(t, 1.55, 1.7);
      Q.pose(t, T,
        { armF: 16 + (1 - hud) * 30, armB: 8, head: 2, blink: blinkAt(T, 2) },
        (d) => ({ head: -2 + hud * 4, blink: blinkAt(T, d.seed) }),
        (m) => ({
          x: m.x + hud * [36, 4, -30][m.i] + fear * [10, 0, -6][m.i],
          flip: m.i === 0 ? (hud < 0.5 || glance > 0.5) : true,
          head: hud * [12, 10, 8][m.i] - flinch * 12 - fear * 6 + glance * (m.i === 0 ? -10 : 0),
          lean: hud * [8, 4, 6][m.i] - flinch * 8 - fear * 6,
          armF: 8 + hud * 30 * (1 - fear) + fear * 50, armB: 4 + flinch * 60 + fear * 70,
          blink: blinkAt(T, m.seed),
        }));
      /* v5 — "from heaven" → "why did you not believe him?" */
      const [hx, hy] = oppHead(1);
      popAt(t1, t, 0.2, 1.08, hx, hy - 20, { d: 0.12 });
      popAt(finger, t, 0.5, 1.08, hx + 44 + TDX, hy - 106, { d: 0.1 });
      /* v6 — "from men" → the people will stone us; John the prophet over the crowd */
      popAt(t2, t, 1.12, undefined, hx, hy - 20, { d: 0.12 });
      dropIn(medal, t, 1.45, undefined, S.portrait ? 590 : 520, 350, { T, d: 0.3 });
      Q.amaze(0);

      S.cam.x = kf(t, [[0, 30], [0.4, 70], [1.4, 70], [1.8, 30]]);
      S.cam.y = kf(t, [[0, 0], [0.4, -20], [1.4, -20], [1.8, -30]]);
      S.cam.z = kf(t, [[0, 1.04], [0.4, 1.1], [1.4, 1.1], [1.8, 1.04]]);
      void seg; void ease; void lerp; void pose;
    };
  },
};
