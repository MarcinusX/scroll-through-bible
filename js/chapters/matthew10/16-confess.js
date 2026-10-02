// Mt 10,32–33 — two floors of the theatre: a village square below, and above it a golden floor of cloud, with the
// light of the Father (only light, no figure) and Jesus standing before it. Down in the square people crowd round
// Philip — "Are you one of His?" — he lays his hand on his heart and points up: "He is my Lord!". Above, Jesus
// turns to the light and points down to him, and a golden thread runs from Philip up to Jesus. Then a man on the
// other side waves Him away — "I do not know Him" — and above, Jesus turns His face away; that man's thread,
// half spun, fades and falls.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { village, DAY, L6, radiance, rayBurst, bubble, heart, folk, headAt, hand, tr, PI } from './lib.js';

const GY = 706;
const PX = 600, DX = 1000;       // Philip, the man who denies
const JX = 800, JY = 330;        // Jesus in glory

/** a floating floor of cloud, scalloped top and bottom; origin world */
function cloudFloor(c, y, h = 70) {
  const top = [], bot = [];
  for (let x = -900; x <= 2500; x += 46) { top.push(...c.arc(x + 23, y, 30, 22, PI, 2 * PI, 5)); }
  for (let x = 2500; x >= -900; x -= 60) { bot.push(...c.arc(x - 30, y + h, 32, 14, 0, PI, 5)); }
  return sheet().p(c.cut([...top, ...bot], 0.6, 8), mix(C.cream, C.halo, 0.4)).out();
}

export default {
  id: 'mt10-confess',
  beats: [
    { v: 32 },
    { v: 33 },
  ],
  cam: { x: [-30, 30], y: [-60, 20], z: [1, 1.06] },
  build(S) {
    const V = village(S, { skyCols: ['#e8cf9c', '#f1e2c0', '#f5ead4'], sunAt: [1300, -300] });
    const c = S.c;

    /* heaven: the Father's light, a floor of cloud, Jesus */
    const hv = S.layer({ par: 0.12, sh: 2, rise: 0 });
    const light = hv.add(`<g><circle r="300" fill="url(#halo-glow)"/>${radiance(c, 84)}</g>`);
    const floorL = S.layer({ par: 0.16, sh: 4 });
    floorL.add(cloudFloor(c, JY - 6, 60));
    const J = S.layer({ par: 0.16, sh: 5 });
    const jesus = S.puppet(J.add(person(c, { ...CAST.jesus })));
    const thread = J.add(`<g><path d="${c.ribbon([[0, 0], [0, 1]], 3)}" fill="${C.sun}"/></g>`);

    /* the square below */
    const P = S.layer({ par: 0.5, sh: 5 });
    // phone: the outer two of the crowd and the question stand inside the frame
    const CROWD = [[470, 0.84, false], [700, 0.86, true], [760, 0.82, true], [880, 0.84, false], [1110, 0.86, true]].map(([x, s, flip], i) => ({ x: S.portrait && (i === 0 || i === 4) ? (i ? 1082 : 498) : x, s, flip, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, folk(c)))) }));
    const philip = S.puppet(P.add(person(c, L6.philip)));
    const denier = S.puppet(P.add(person(c, { robe: C.stone2, mantle: C.mauve, hair: C.hair3, hairStyle: 'wrap', veil: C.plumRobe, veil2: shade(C.plumRobe, -0.2), beard: 'short', skin: C.skin2, belt: C.leather })));
    const W = S.layer({ par: 0.52, sh: 4 });
    const q = W.add(`<g>${bubble(c, tr('Jesteś jednym z Jego?', 'Are you one of His?'), { size: 19, dir: 1 })}</g>`);
    const yes = W.add(`<g>${bubble(c, tr('On jest moim Panem!', 'He is my Lord!'), { size: 21, dir: -1, fill: C.halo })}</g>`);
    const no = W.add(`<g>${bubble(c, tr('Nie znam Go!', 'I don’t know Him!'), { size: 21, dir: 1, fill: mix(C.stone2, C.storm, 0.2) })}</g>`);
    const heartEl = W.add(`<g>${heart(c, 12)}</g>`);
    const thread2 = W.add(`<g><path d="${c.ribbon([[0, 0], [0, 1]], 2)}" fill="${C.stone2}"/></g>`);

    return (t, time) => {
      const T = time;
      V.update(t, T, { sunO: 0 });
      pose(light, { x: JX, y: 150, r: T * 2, s: 1, o: 1 });

      /* v32 — Philip confesses Him; Jesus acknowledges him before the Father */
      const ask = es(t, 0.05, 0.2, ease.back) * (1 - es(t, 0.35, 0.45));
      pose(q, { x: S.portrait ? 560 : 490, y: GY - 190, s: ask, o: ask > 0.01 ? 1 : 0 });
      const conf = es(t, 0.35, 0.5, ease.back) * (1 - es(t, 1.05, 1.15));
      pose(yes, { x: PX + 30, y: GY - 196, s: conf, o: conf > 0.01 ? 1 : 0 });
      philip.set({ x: PX, y: GY, s: 0.94, flip: false, armF: 20 + es(t, 0.35, 0.5) * 70, armB: 10 + es(t, 0.4, 0.55) * 150, head: -es(t, 0.4, 0.55) * 14, blink: blinkAt(T, 1) });
      const [phx, phy] = hand(PX, GY, 0.94, false, 90);
      pose(heartEl, { x: phx - 10, y: phy - 4, s: es(t, 0.35, 0.5), o: t > 0.35 ? 1 : 0 });
      const ack = es(t, 0.5, 0.7);
      const away = es(t, 1.4, 1.6);
      jesus.set({ x: JX, y: JY, s: 0.72, flip: ack < 0.5 || away > 0.5 ? (away > 0.5 ? false : true) : true, armF: 20 + ack * 70 * (1 - away * 0.8), armB: 10 + ack * 60 * (1 - away), head: ack * 10 * (1 - away) - away * 6, blink: blinkAt(T, 2) });
      // the golden thread from Philip's heart to Jesus
      const [jhx, jhy] = hand(JX, JY, 0.72, true, 20 + ack * 70 * (1 - away * 0.8));
      const th = es(t, 0.55, 0.85);
      const x0 = phx - 10, y0 = phy - 10;
      const len = Math.hypot(jhx - x0, jhy - y0), ang = (Math.atan2(jhy - y0, jhx - x0) * 180) / PI - 90;
      pose(thread, { x: x0, y: y0, r: ang, sy: Math.max(0.01, len * th), o: th > 0.01 ? 1 : 0 });
      CROWD.forEach((m) => m.p.set({ x: m.x, y: GY + (m.i % 2) * 6, s: m.s, flip: m.flip, head: -es(t, 0.6, 0.8) * 10, armF: 14 + bump(t, 0.0, 0.4) * (m.i === 0 ? 70 : 0) + bump(t, 1.0, 1.4) * (m.i === 4 ? 70 : 0), blink: blinkAt(T, m.seed) }));

      /* v33 — the man who denies Him */
      const den = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(no, { x: DX - 30, y: GY - 196, s: den, o: den > 0.01 ? 1 : 0 });
      const wave = es(t, 1.2, 1.35);
      denier.set({ x: DX, y: GY + 4, s: 0.92, flip: wave > 0.5, armF: 20 + wave * 70 + Math.sin(T * 10) * 8 * bump(t, 1.2, 1.9), armB: 10 + wave * 40, head: wave * 8, blink: blinkAt(T, 3) });
      const [dhx, dhy] = headAt(DX, GY + 4, 0.92, true);
      const t2 = es(t, 1.05, 1.3) * (1 - es(t, 1.5, 1.75));
      const len2 = Math.hypot(JX - dhx, JY - 90 - dhy), ang2 = (Math.atan2(JY - 90 - dhy, JX - dhx) * 180) / PI - 90;
      pose(thread2, { x: dhx, y: dhy + 30, r: ang2, sy: Math.max(0.01, len2 * 0.5 * t2), o: t2 > 0.01 ? t2 : 0 });

      S.cam.y = -20;
    };
  },
};
