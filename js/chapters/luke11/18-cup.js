// Łk 11,39–41 — at the Pharisee's table. "You Pharisees cleanse the outside of the cup and the dish": over the table a
// panel comes down — a great golden goblet on a dish, a cloth rubbing its outside till it shines — "but inside you
// are full of greed and wickedness": its golden skin goes clear as glass, and inside it is full of dark sludge, snatched
// coins and a little house swallowed whole. "Fools! Did not the one who made the outside make the inside too?": a
// second panel — a potter at his wheel, one hand inside the turning bowl and one outside, shaping both at once. "But
// give as alms what is inside, and everything will be clean for you": the host rises, takes the loaves and the fruit
// from his table and carries them out to the beggar at the gateway — and the goblet shines clean, inside and out.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { dinnerSet, SH, HOST, BEGGAR, panel, panelSky, panelGround, bigGoblet, greedHeap, potterWheel, clayBowl, figure, loaf, bowl, sparkle, glow, headAt, handAt, kf, moving, PI } from './lib.js';

const { FLOOR, JX } = SH;
const PX = 900, PY = 300, PW = 360, PH = 230;
const GX = (SH.GATE[0] + SH.GATE[1]) / 2;

export default {
  id: 'lk11-cup',
  beats: [
    { v: 39 },
    { v: 40 },
    { v: 41 },
  ],
  cam: { x: [0, 140], y: [60, 160], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    const D = dinnerSet(S);
    const R = D.R;
    const hostUp = S.puppet(R.frontL.add(person(c, { ...HOST, holdF: `<g transform="rotate(-60) translate(-4 10)">${loaf(c, 14)}<g transform="translate(22 4)">${bowl(c, { food: 'fruit', color: C.skyVeil })}</g></g>` })));
    const beggar = S.puppet(R.frontL.add(person(c, { ...BEGGAR, pose: 'kneel' })));
    const given = R.frontL.add(`<g opacity="0">${loaf(c, 14)}<g transform="translate(22 4)">${bowl(c, { food: 'fruit', color: C.skyVeil })}</g></g>`);
    /* the panels above the table */
    const PL = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const B = S.layer({ par: 0.3, sh: 5, rise: 0 });
    const p1 = PL.add(panel(S, panelSky(S, PW, PH, [mix(C.plumRobe, C.indigo, 0.4), mix(C.plumRobe, C.dusk, 0.5)]) + sheet().p(c.cut([[-PW / 2 - 4, 70], [PW / 2 + 4, 66], [PW / 2 + 4, PH / 2 + 4], [-PW / 2 - 4, PH / 2 + 4]], 0.4, 8), C.wood).out()
      + sheet().p(c.cut(c.ell(0, 82, 150, 14, 24), 0.4, 6), shade(C.sun, -0.1)).out(), { w: PW, h: PH }));
    const G = bigGoblet(c, { w: 150, bh: 104, sh: 60 });
    const gBack = B.add(`<g opacity="0">${G.back}</g>`);
    const cleanGlow = B.add(`<g opacity="0">${glow(90, 1, 'halo-glow')}</g>`);
    const greed = B.add(`<g opacity="0">${greedHeap(c, 120)}</g>`);
    const gStem = B.add(`<g opacity="0">${G.stem}</g>`);
    const gFront = B.add(`<g opacity="0">${G.front}</g>`);
    const gRim = B.add(`<g opacity="0">${G.rim}</g>`);
    const cloth = B.add(`<g opacity="0">${sheet().p(c.cut(c.blob(0, 0, 22, 14, 10, 0.25), 0.6, 4), C.linen).out()}</g>`);
    const shine = [0, 1, 2].map(() => B.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    /* the potter */
    const p2 = PL.add(panel(S, panelSky(S, PW, PH, ['#d8cdb4', '#f2e4c6']) + sheet().p(c.cut([[-PW / 2 - 4, 60], [PW / 2 + 4, 56], [PW / 2 + 4, PH / 2 + 4], [-PW / 2 - 4, PH / 2 + 4]], 0.4, 8), mix(C.sand2, C.clay, 0.25)).out()
      + [[110, 50, 1], [140, 56, 0.8], [-150, 58, 0.9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${clayBowl(c, 40, mix(C.pot, C.clay, 0.2))}</g>`).join('')
      + `<g transform="translate(40 112) scale(1.3)">${potterWheel(c)}</g>` + figure(c, { robe: C.ochreRobe, mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.leather, pose: 'sit' }, { x: -46, y: 112, s: 0.84, armF: 64, armB: 50, head: 16 }), { w: PW, h: PH }));
    const bowlEl = B.add(`<g opacity="0">${clayBowl(c, 84)}</g>`);
    const spin = B.add(`<g opacity="0">${sheet().x(c.ribbon(c.arc(0, 0, 44, 6, 0.2, PI - 0.2, 10), 1.6) + c.ribbon(c.arc(0, -4, 36, 5, PI + 0.3, 2 * PI - 0.3, 10), 1.4), C.inkSoft, 'opacity=".5"').out()}</g>`);

    return (t, time) => {
      const T = time;
      const k1 = es(t, 0.02, 0.3, ease.out) * (1 - es(t, 0.95, 1.15, ease.in)) + es(t, 2.1, 2.38, ease.out);
      const k2 = es(t, 1.1, 1.38, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      const y1 = lerp(-1500, PY, k1), y2 = lerp(-1500, PY, k2);
      pose(p1, { x: PX, y: y1, o: k1 > 0.002 ? 1 : 0 });
      pose(p2, { x: PX, y: y2, o: k2 > 0.002 ? 1 : 0 });
      const on1 = k1 > 0.002 ? 1 : 0;
      /* v39 — polished outside; inside, greed */
      const gy = y1 + 82;
      const glass = es(t, 0.5, 0.75);
      [gBack, gStem, gRim].forEach((el) => pose(el, { x: PX, y: gy, o: on1 }));
      pose(greed, { x: PX, y: gy - G.S - 30, o: on1 * (1 - es(t, 2.45, 2.7)) });
      pose(gFront, { x: PX, y: gy, o: on1 * (1 - glass * 0.8) });
      const rub = t < 0.55 ? Math.sin(t * 40) : 0;
      pose(cloth, { x: PX - 50 + rub * 14, y: gy - G.S - 50 + rub * 10, o: on1 * bump(t, 0.1, 0.55) });
      shine.forEach((s, i) => { const k = bump(t, 0.2 + i * 0.08, 0.5 + i * 0.08) + (t > 2.5 ? es(t, 2.5 + i * 0.05, 2.65 + i * 0.05) : 0); pose(s, { x: PX + [-40, 30, 10][i], y: gy - G.S - [70, 40, 100][i], s: Math.min(1, k), r: T * 40, o: on1 * Math.min(1, k) }); });
      pose(cleanGlow, { x: PX, y: gy - G.S - 50, o: on1 * es(t, 2.45, 2.7) });
      /* v40 — the potter shapes outside and inside at once */
      const on2 = k2 > 0.002 ? 1 : 0;
      pose(bowlEl, { x: PX + 40, y: y2 + 112 - 80, sx: 1 + (T ? Math.sin(T * 8) * 0.02 : 0), o: on2 });
      pose(spin, { x: PX + 40, y: y2 + 112 - 76, r: T ? Math.sin(T * 12) * 3 : 0, o: on2 });

      /* the table: Jesus speaks; v41 — the host carries what is inside out to the beggar */
      const up = seg(t, 2.1, 2.14);
      const HK = [[2.14, 1172], [2.55, GX + 70]];
      const hx = kf(t, HK);
      const giveK = es(t, 2.58, 2.7);
      const speak = es(t, 0.05, 0.2);
      D.seat(t, T, {
        J: { armF: 30 + speak * 40 + es(t, 1.05, 1.2) * 10, armB: 10 + speak * 40, head: 4 - speak * 6 },
        H: { o: 1 - up, armF: 30 + es(t, 0.3, 0.5) * 20, armB: 10, head: 10, lean: 4 },
        g: (q) => ({ head: 4 + (q.i === 2 ? es(t, 1.1, 1.3) * 6 : 0) }),
      });
      hostUp.set({ x: hx, y: FLOOR, s: 0.98, flip: true, o: up, walk: moving(t, HK) ? hx * 0.05 : undefined, armF: 60 + giveK * 20, armB: 10 + giveK * 30, head: 6, blink: blinkAt(T, 3) });
      pose(hostUp.el.querySelector('.hold'), { x: 1.5, y: 57, o: giveK > 0.9 ? 0 : 1 });
      beggar.set({ x: GX - 20, y: FLOOR + 4, s: 0.9, o: es(t, 1.9, 2.1), armF: 50 + giveK * 30, armB: 20 + giveK * 60, head: 8 - giveK * 14, blink: blinkAt(T, 7) });
      const [bx, by] = handAt(GX - 20, FLOOR + 4, 0.9, false, 80, 'kneel');
      pose(given, { x: bx + 4, y: by, o: giveK > 0.9 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 100], [2.0, 100], [2.3, 40]]);
      S.cam.y = kf(t, [[0, 110], [2.0, 110], [2.3, 140]]);
      S.cam.z = kf(t, [[0, 1.08], [2.0, 1.08], [2.3, 1.12]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 120], [2.0, 120], [2.3, 0]]); S.cam.z = 0.88; }
    };
  },
};
