// Łk 9,61–62 — the road to Jerusalem runs past a farmer's field; his ox stands yoked to the plough, his house on the slope
// behind. The farmer comes to the roadside: "I want to follow you, Lord, but first allow me to say good-bye to those at
// my house" — he points back, and at the house door his wife and child wave to him. "No one, having put his hand to the
// plough, and looking back, is fit for God's Kingdom": he takes the plough and the ox pulls — but he walks looking back
// towards his house, and the furrow behind him wanders crooked; then he turns his face forward, towards the light over
// the city, and the new furrow runs straight as a string.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, ROAD9, TW9, FARMER, bubble, thought, folk, figure, halo, kf, headAt, hand, tr, PI } from './lib.js';
import { house } from '../../assets/nature.js';
import { ox } from '../john2/lib.js';

const { JY } = ROAD9;
const JX = 660;
const PY = 704;                 // the line the plough cuts
const P0 = 840, P1 = 940, P2 = 1050;   // where the ploughing starts, where he turns his face, where it ends

/** a wooden plough (an ard): origin at the tip of the share, in the ground; the beam runs forward (+x) to the yoke */
function plough(c) {
  const s = sheet();
  s.p(c.ribbon([[-4, -2], [60, -34], [120, -52]], 6), C.wood2);             // the beam to the yoke
  s.p(c.cut([[-14, -6], [8, -2], [0, 4], [-18, 2]], 0.3, 3), C.stone2);       // the share
  s.p(c.ribbon([[-6, -2], [-30, -60], [-40, -82]], 6), C.wood);              // the handle
  s.p(c.ribbon([[-44, -84], [-30, -80]], 5), C.wood3);
  return s.out();
}

export default {
  id: 'lk9-plough',
  beats: [
    { v: 61 },
    { v: 62 },
  ],
  cam: { x: [-20, 60], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const R = roadSet(S, { village: false, field: true });
    const c = S.c;
    const [hx0, hy0] = R.houseAt;
    /* the family at the house door */
    const famL = S.layer({ par: 0.4, sh: 4 });
    famL.el.parentNode.insertBefore(famL.el, R.fieldL.el);
    const wife = S.puppet(famL.add(person(c, folk(c, false, { robe: C.roseRobe }))));
    const kid = S.puppet(famL.add(person(c, { robe: C.skyVeil, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: C.ochre })));

    /* the furrows (behind the plough), the plough, the ox */
    const fL = S.layer({ par: 0.45, sh: 2 });
    const FC = mix(C.soilDark, C.soil, 0.3);
    const crooked = fL.add(`<g>${sheet().p(c.ribbon(Array.from({ length: 21 }, (_, i) => [i / 20 * (P1 - P0), Math.sin(i * 0.9) * 9 + Math.sin(i * 2.1) * 4]), 7), FC).out()}</g>`);
    const straight = fL.add(`<g>${sheet().p(c.ribbon([[0, 0], [P2 - P1, 0]], 7), FC).out()}</g>`);
    const act = S.layer({ par: 0.45, sh: 5 });
    const oxEl = act.add(`<g>${ox(c)}</g>`);
    const pl = act.add(`<g>${plough(c)}</g>`);
    const farmer = S.puppet(act.add(person(c, FARMER)));
    const glowL = S.layer({ par: 0.45, sh: 1, flat: true });
    glowL.el.parentNode.insertBefore(glowL.el, act.el);
    const aura = glowL.add(`<g>${halo(140, 0.8)}</g>`);
    const DIS = [{ k: 'peter', x: 530, y: 758 }, { k: 'john', x: 460, y: 780 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.45, sh: 4 });
    const home = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(-16 10) scale(.8)">${house(c, 0, 0, 40, 28, { stairs: false })}</g>`, { w: 60, h: 48 })}</g>`);
    const asks = fx.add(`<g opacity="0">${bubble(c, [tr('Panie, pozwól mi najpierw', 'Lord, first allow me'), tr('pożegnać się z moimi w domu!', 'to say good-bye at home!')], { size: 17, tail: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.25 + es(t, 1.0, 2.0) * 0.35 });
      const bright = es(t, 1.45, 1.75);
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, s: 1 + bright * 0.4, o: 0.7 + bright * 0.3 });
      pose(R.rays, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 30, o: 0.5 + bright * 0.5 });

      /* v61 — "first let me say good-bye at home" */
      const toRoad = es(t, 0.0, 0.25);
      const back2 = es(t, 0.95, 1.1);
      const plowing = t > 1.1;
      const u = seg(t, 1.1, 1.92);
      const px = plowing ? lerp(P0, P2, u) : lerp(P0, P0 - 30, toRoad) + back2 * 30;
      const lookBack = plowing ? 1 - es(t, 1.44, 1.5) : 0;
      const point = bump(t, 0.3, 0.95);
      const fy = PY - (plowing ? 0 : toRoad * 10);
      // while ploughing he walks forward (right) but faces back towards the house until he turns
      farmer.set({ x: px - 60, y: fy + 2, s: 0.96, flip: plowing ? lookBack > 0.5 : toRoad > 0.5 && back2 < 0.5, walk: plowing && u < 1 ? t * 16 : undefined, armF: plowing ? 60 : 20 + point * 20, armB: plowing ? 50 : point * 120, head: plowing ? (lookBack > 0.5 ? -6 : -10) : -4, lean: plowing ? 10 : 0, blink: blinkAt(T, 4) });
      const [fhx, fhy] = headAt(px - 60, fy + 2, 0.96, true);
      const ak = es(t, 0.2, 0.35, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(asks, { x: fhx - 20, y: fhy - 40, s: ak, o: ak > 0.01 ? 1 : 0 });
      const hk = es(t, 1.15, 1.25, ease.back) * (1 - es(t, 1.44, 1.5));
      const [thx, thy] = headAt(px - 60, fy + 2, 0.96, true);
      pose(home, { x: thx - 4, y: thy - 6, s: hk, o: hk > 0.01 ? 1 : 0 });
      // the plough and the ox (still until he takes the handle)
      const wob = plowing && t < 1.47 ? Math.sin(u * 30) * 7 : 0;
      pose(pl, { x: px - 18, y: PY + wob * 0.6, r: wob * 0.4 });
      pose(oxEl, { x: px + 138, y: PY + 4 + wob * 0.8, r: wob * 0.2 });
      if (plowing && u < 1) pose(oxEl.querySelector('.oxhead'), { x: 58, y: -80 + Math.sin(t * 40) * 2 });
      // the furrows: crooked while he looks back, straight when he looks ahead
      const cr = Math.min(1, Math.max(0, (px - P0) / (P1 - P0)));
      pose(crooked, { x: P0 - 12, y: PY + 2, sx: Math.max(0.001, cr), o: cr > 0.005 ? 1 : 0 });
      const st = Math.min(1, Math.max(0, (px - P1) / (P2 - P1)));
      pose(straight, { x: P1 - 12, y: PY + 2, sx: Math.max(0.001, st), o: st > 0.005 ? 1 : 0 });

      /* the wife and child wave at the door */
      const wave = es(t, 0.35, 0.55) * (1 - es(t, 1.6, 1.9) * 0.6);
      wife.set({ x: hx0 - 30, y: hy0 + 4, s: 0.52, flip: true, o: wave > 0.01 ? 1 : 0, armF: 20, armB: 60 + wave * 90 + Math.sin(t * 22) * 15 * wave, head: -4, blink: blinkAt(T, 9) });
      kid.set({ x: hx0 - 58, y: hy0 + 6, s: 0.34, flip: true, o: wave > 0.01 ? 1 : 0, armF: 60 + wave * 80 + Math.sin(t * 26) * 15 * wave, head: -8, blink: blinkAt(T, 10) });

      /* Jesus on the road, and two disciples */
      jesus.set({ x: JX, y: JY + 6, s: 1.04, flip: false, armF: 20 + bump(t, 0.2, 0.95) * 20 + bump(t, 1.05, 1.95) * 70, armB: 10 + es(t, 1.5, 1.8) * 40, head: -2 - bright * 6, blink: blinkAt(T, 1) });
      pose(aura, { x: JX, y: JY - 150, o: 0.6 });
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 1.0, armF: 20, head: -4, blink: blinkAt(T, d.seed) }));

      S.cam.x = kf(t, [[0, 30], [1.0, 30], [1.9, 30]]);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.08], [1.9, 1.04]]);
      S.cam.y = kf(t, [[0, 40], [1.9, 50]]);
    };
  },
};
