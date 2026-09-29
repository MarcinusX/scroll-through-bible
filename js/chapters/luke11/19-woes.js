// Łk 11,42–44 — at the Pharisee's table Jesus speaks the woes; for each a dark tag "Woe" drops on its string and a
// panel comes down over the table. "Woe to you Pharisees, for you tithe mint and rue and every herb": in his herb
// garden a Pharisee counts his sprigs and lays every tenth in the tithe dish — "and neglect justice and the love of
// God": behind him, in the weeds, lie a pair of scales and a heart, grey with dust. "These you ought to have done,
// without neglecting the others": the scales and the heart are lifted up, shining, and set beside the tithe dish. "Woe
// to you, for you love the first seat in the synagogues and greetings in the market places": he sits on the highest
// of the first chairs, and in the market everyone bows to him as he passes. "Woe to you, for you are like unmarked
// graves, which people walk over without knowing": the ground of a lane is cut away — under the path lies a hidden
// grave, and the people walking over it do not see it; grey creeps up over their feet.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { dinnerSet, SH, PH, phOpts, woeTag, panel, panelSky, panelGround, herb, sprig, titheDish, firstChairs, stall, figure, heart, tick, sparkle, glow, label, kf, moving, tr, PI } from './lib.js';

const PX = 900, PY = 300, PW = 420, PH_ = 240;
const ROMAN = ['I', 'II', 'III'];

/** a small pair of scales standing on its post (origin: foot) */
function scalesStand(c, col = C.sun) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -60]], 3) + c.ribbon([[-34, -58], [34, -58]], 3), col);
  s.p(c.cut(c.arc(-34, -36, 12, 6, 0, PI, 8), 0.2, 3) + c.cut(c.arc(34, -36, 12, 6, 0, PI, 8), 0.2, 3), col);
  s.x(c.ribbon([[-34, -58], [-44, -36]], 0.9) + c.ribbon([[-34, -58], [-24, -36]], 0.9) + c.ribbon([[34, -58], [24, -36]], 0.9) + c.ribbon([[34, -58], [44, -36]], 0.9), shade(col, -0.2));
  s.p(c.cut([[-12, 0], [12, 0], [8, -6], [-8, -6]], 0.2, 3), col);
  return s.out();
}

export default {
  id: 'lk11-woes',
  beats: [
    { v: 42, text: 'Lecz biada wam, faryzeuszom, bo dajecie dziesięcinę z mięty i ruty, i z wszelkiego rodzaju jarzyny, a pomijacie sprawiedliwość i miłość Bożą.' },
    { v: 42, cont: true, text: 'Tymczasem to należało czynić, i tamtego nie opuszczać.' },
    { v: 43 },
    { v: 44 },
  ],
  cam: { x: [0, 140], y: [60, 160], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    const D = dinnerSet(S);
    const PL = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const B = S.layer({ par: 0.3, sh: 5, rise: 0 });
    const tags = ROMAN.map((n) => hanging(PL, woeTag(c, n), { x: 0, y: -1500, len: 900 }));

    /* 1 — the herb garden, the tithe, the forgotten scales and heart */
    const bed = [[-150, 'mint'], [-110, 'cumin'], [-70, 'mint'], [-30, 'dill'], [10, 'cumin']].map(([x, k]) => `<g transform="translate(${x} 70)">${herb(c, k, 50)}</g>`).join('');
    const weeds = [[110, 88], [150, 92], [180, 86]].map(([x, y]) => `<path d="${c.ribbon([[x, y], [x - 6, y - 26]], 2) + c.ribbon([[x + 4, y], [x + 12, y - 22]], 2)}" fill="${C.olive}"/>`).join('');
    const p1 = PL.add(panel(S, panelSky(S, PW, PH_, ['#cfe0d8', '#f4e6c6']) + panelGround(c, PW, 70, mix(C.soil, C.sand2, 0.5)) + bed
      + figure(c, { ...PH, pose: 'kneel' }, { x: 50, y: 96, s: 0.5, flip: false, armF: 60, armB: 30, head: 14 }) + weeds, { w: PW, h: PH_ }));
    const dish = B.add(`<g opacity="0">${titheDish(c, 44)}</g>`);
    const sprigs = Array.from({ length: 6 }, (_, i) => B.add(`<g opacity="0">${sprig(c, i % 2 ? C.leaf : C.moss)}</g>`));
    const count = B.add(`<g opacity="0">${label(c, tr('dziesięcina', 'the tithe'), { size: 16 })}</g>`);
    const scalesGrey = B.add(`<g opacity="0">${scalesStand(c, mix(C.stone2, C.rock2, 0.4))}</g>`);
    const heartGrey = B.add(`<g opacity="0"><g transform="scale(.8)">${heart(c, 14, mix(C.stone2, C.rock2, 0.3)).replace(/<circle[^>]*\/>/, '')}</g></g>`);
    const scalesGold = B.add(`<g opacity="0">${glow(60, 0.8, 'halo-glow')}${scalesStand(c)}</g>`);
    const heartGold = B.add(`<g opacity="0">${heart(c, 14)}</g>`);
    const ticks = [0, 1, 2].map(() => B.add(`<g opacity="0">${tick(c, 16)}</g>`));

    /* 2 — the first chairs, the greetings in the market */
    const p2 = PL.add(panel(S, panelSky(S, PW, PH_, ['#e4d6bb', '#f4e6c8'])
      + sheet().p(c.cut([[-PW / 2 - 4, -PH_ / 2 - 4], [-4, -PH_ / 2 - 4], [-4, PH_ / 2 + 4], [-PW / 2 - 4, PH_ / 2 + 4]], 0.4, 6), mix(C.plaster, C.parchment, 0.4)).out()
      + sheet().p(c.cut([[-PW / 2 - 4, 80], [-4, 80], [-4, PH_ / 2 + 4], [-PW / 2 - 4, PH_ / 2 + 4]], 0.4, 6), mix(C.stone, C.sand, 0.4)).p(c.cut([[4, 76], [PW / 2 + 4, 72], [PW / 2 + 4, PH_ / 2 + 4], [4, PH_ / 2 + 4]], 0.4, 6), mix(C.sand, C.stone, 0.3)).out()
      + `<g transform="translate(-130 86) scale(.62)">${firstChairs(c)}</g>` + figure(c, { ...PH, pose: 'sit' }, { x: -86, y: 64, s: 0.46, flip: true, armF: 30, armB: 20, head: -10 })
      + figure(c, phOpts(2), { x: -170, y: 90, s: 0.42, armF: 20, head: 10 }) + figure(c, phOpts(1), { x: -40, y: 90, s: 0.42, flip: true, armF: 20, head: 10 })
      + `<g transform="translate(150 80) scale(.62)">${stall(c, 150)}</g>` + `<path d="${c.ribbon([[-4, -PH_ / 2], [-4, PH_ / 2]], 6)}" fill="${C.wood2}"/>`, { w: PW, h: PH_ }));
    const walker = S.puppet(B.add(person(c, PH)));
    const bowers = [0, 1, 2].map((i) => ({ i, p: S.puppet(B.add(person(c, [{ robe: C.dustyBlue, hairStyle: 'short', beard: 'full', hair: C.hair3, skin: C.skin2 }, { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, beard: 'none', skin: C.skin }, { robe: C.sageRobe, hairStyle: 'wrap', veil: C.stone, beard: 'short', hair: C.hair, skin: C.skin3 }][i]))) }));

    /* 3 — the unmarked grave under the lane */
    const g3 = sheet();
    g3.p(c.cut([[-PW / 2 - 4, 0], [PW / 2 + 4, -4], [PW / 2 + 4, PH_ / 2 + 4], [-PW / 2 - 4, PH_ / 2 + 4]], 0.4, 6), mix(C.soil, C.sand2, 0.45));
    g3.p(c.cut([[-PW / 2 - 4, -6], [PW / 2 + 4, -10], [PW / 2 + 4, 4], [-PW / 2 - 4, 8]], 0.4, 6), mix(C.sand, C.stone, 0.3));
    g3.p(c.cut([[-70, 40], [-70, 24], ...c.arc(0, 24, 70, 18, PI, 2 * PI, 10), [70, 24], [70, 96], [-70, 96]], 0.5, 6), mix(C.soilDark, C.night, 0.35));
    g3.x(c.ribbon([[-40, 80], [-10, 76]], 3) + c.ribbon([[10, 84], [36, 80]], 3), mix(C.stone2, C.soilDark, 0.4), 'opacity=".7"');
    const p3 = PL.add(panel(S, panelSky(S, PW, PH_, ['#cfdcd8', '#f2e4c6']) + sheet().p(c.cut(c.blob(-150, -40, 60, 30, 10, 0.2), 0.6, 5), mix(C.plaster, C.sand, 0.3)).out() + g3.out(), { w: PW, h: PH_ }));
    const lane = [0, 1].map((i) => ({ i, p: S.puppet(B.add(person(c, [{ robe: C.ochreRobe, hairStyle: 'wrap', veil: C.linen2, beard: 'full', hair: C.hair2, skin: C.skin3, belt: C.leather }, { robe: C.mauve, hairStyle: 'veil', veil: C.blushVeil, beard: 'none', skin: C.skin }][i]))), grey: B.add(`<g opacity="0"><ellipse rx="22" ry="12" fill="${mix(C.rock3, C.night, 0.3)}" opacity=".7"/></g>`) }));

    return (t, time) => {
      const T = time;
      /* Jesus speaking at the table */
      const speak = es(t, 0.02, 0.2);
      D.seat(t, T, {
        J: { armF: 30 + speak * 40, armB: 10 + speak * 50 + bump(t, 1.05, 1.9) * 30, head: 2 - speak * 6 },
        H: { head: 10 + es(t, 2.1, 2.3) * 4, lean: 4, armF: 20 },
        g: (q) => ({ head: 4 + (q.i === 1 ? es(t, 3.1, 3.3) * 8 : 0) }),
      });
      /* the woe tags */
      tags.forEach((tg, i) => {
        const a = [0.02, 2.02, 3.02][i];
        const k = es(t, a, a + 0.25, ease.out) * (1 - es(t, [1.9, 2.9, 99][i], [2.1, 3.1, 100][i]));
        pose(tg, { x: S.portrait ? 900 : 1150, y: lerp(-500, S.portrait ? 40 : 170, k), r: T ? Math.sin(T * 0.9 + i) * 2 : 0, o: k > 0.004 ? 1 : 0 });
      });
      const kin = (a, b) => es(t, a, a + 0.28, ease.out) * (1 - es(t, b - 0.2, b, ease.in));
      const k1 = kin(0.05, 2.1), k2 = kin(2.05, 3.1), k3 = kin(3.05, 99);
      [[p1, k1], [p2, k2], [p3, k3]].forEach(([el, k]) => pose(el, { x: PX, y: lerp(-1500, PY, k), o: k > 0.002 ? 1 : 0 }));
      const Y1 = lerp(-1500, PY, k1), on1 = k1 > 0.9 ? 1 : 0;

      /* v42a — every tenth sprig into the dish; justice and love lie forgotten */
      pose(dish, { x: PX + 90, y: Y1 + 96, o: on1 });
      sprigs.forEach((sp, i) => {
        const a = 0.3 + i * 0.07;
        const k = es(t, a, a + 0.12);
        pose(sp, { x: lerp(PX + 60, PX + 86 + (i % 3) * 5, k), y: lerp(Y1 + 40, Y1 + 84 - Math.floor(i / 3) * 3, k) - Math.sin(k * PI) * 30, r: k * 70, o: on1 * (k > 0 ? 1 : 0) });
      });
      pose(count, { x: PX + 96, y: Y1 + 30, o: on1 * es(t, 0.3, 0.4) * (1 - es(t, 1.0, 1.1)) });
      const lift = es(t, 1.1, 1.35);
      pose(scalesGrey, { x: PX + 150, y: Y1 + 104, r: 70, o: on1 * (1 - lift) * es(t, 0.05, 0.4) });
      pose(heartGrey, { x: PX + 180, y: Y1 + 100, r: -30, o: on1 * (1 - lift) * es(t, 0.05, 0.4) });
      pose(scalesGold, { x: PX + 140, y: Y1 + 96 - lift * 10, o: on1 * lift });
      pose(heartGold, { x: PX + 172, y: Y1 + 60, s: 0.6 + lift * 0.4, o: on1 * lift });
      ticks.forEach((tk, i) => { const k = es(t, 1.4 + i * 0.08, 1.52 + i * 0.08, ease.back); pose(tk, { x: PX + [90, 140, 172][i], y: Y1 + [52, 20, 30][i], s: k, o: on1 * (k > 0.01 ? 1 : 0) }); });

      /* v43 — the first seat and the greetings */
      const Y2 = lerp(-1500, PY, k2), on2 = k2 > 0.9 ? 1 : 0;
      const WK = [[2.3, PX + 30], [2.7, PX + 110]];
      const wx = kf(t, WK);
      walker.set({ x: wx, y: Y2 + 100, s: 0.46, o: on2, walk: moving(t, WK) ? wx * 0.2 : undefined, armF: 20, head: -10, lean: -4, blink: blinkAt(T, 4) });
      bowers.forEach((b) => {
        const bow = es(t, 2.45 + b.i * 0.06, 2.6 + b.i * 0.06);
        b.p.set({ x: PX + 160 + b.i * 20, y: Y2 + 104 + (b.i % 2) * 4, s: 0.42, flip: true, o: on2, armF: 20 + bow * 40, head: bow * 20, lean: bow * 20, blink: 0 });
      });

      /* v44 — they walk over the hidden grave and do not know it */
      const Y3 = lerp(-1500, PY, k3), on3 = k3 > 0.9 ? 1 : 0;
      lane.forEach((m) => {
        const K = [[3.2 + m.i * 0.1, PX - 180 + m.i * 20], [3.9, PX + 90 - m.i * 80]];
        const x = kf(t, K, (u) => u);
        m.p.set({ x, y: Y3 - 6, s: 0.4, o: on3, walk: moving(t, K) ? x * 0.2 : undefined, armF: 14, head: 0, blink: blinkAt(T, 8 + m.i) });
        const over = Math.abs(x - PX) < 90 || x > PX ? 1 : 0;
        pose(m.grey, { x, y: Y3 - 10, o: on3 * over * es(t, 3.4, 3.6) });
      });

      S.cam.x = kf(t, [[0, 100]]);
      S.cam.y = kf(t, [[0, 100]]);
      S.cam.z = kf(t, [[0, 1.06]]);
      if (S.portrait) { S.cam.x = 120; S.cam.z = 0.88; }
    };
  },
};
