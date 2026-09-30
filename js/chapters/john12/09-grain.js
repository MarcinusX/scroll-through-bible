// J 12,24–25 — a flat descends: a field under a golden sky, the earth cut away beneath it like a drawer. Jesus
// stands on the field's edge and lets a single grain of wheat fall; it drops through the soil and lies there — alone,
// a little ring around it. Then it dies: the husk darkens and splits, roots thread down, a green shoot climbs to the
// light — and rows of wheat rise all across the field, heavy golden ears: much fruit. "Who loves his life loses it":
// a man clutches a glowing grain to his chest and it crumbles to dust in his fist. "Who hates his life in this world
// keeps it": another opens his hand, lets the grain go into the earth — and a golden ring of eternal life closes
// round the new ear that springs up.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, rock } from '../../assets/nature.js';
import { wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { man, nameTag, hanging, swing, kf, vis, hand, lightPath, drawPath, eternityRing, drawRing, glowDisc, tr, PI, FONT } from './lib.js';

const GY = 540;            // the field's surface
const SX = 880;            // where the grain goes in
const SY = 640;            // where it rests
const GOLDEN = ['#e9cf9f', '#f3d9a8', '#f8e7c4'];

export default {
  id: 'j12-grain',
  enter: 'fly',
  beats: [
    { v: 24, text: 'Zaprawdę, zaprawdę, powiadam wam: Jeżeli ziarno pszenicy wpadłszy w ziemię nie obumrze, zostanie tylko samo,' },
    { v: 24, cont: true, text: 'ale jeżeli obumrze, przynosi plon obfity.' },
    { v: 25, text: 'Ten, kto kocha swoje życie, traci je,' },
    { v: 25, cont: true, text: 'a kto nienawidzi swego życia na tym świecie, zachowa je na życie wieczne.' },
  ],
  cam: { x: [-60, 60], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1190, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 520, y: 150, len: 700 });
    S.layer({ par: 0.1, sh: 2 }).add(hillsWith(c, { y: 470, amps: [16, 6, 2], lens: [1100, 360, 120], color: mix(C.hillMid, C.wheat, 0.25), trees: 18, treeColor: C.olive, treeH: 14, x0: -1400, x1: 3000 }).markup);
    /* rows of wheat that will rise from behind the earth's edge */
    const row = (n, y, h, sc, seed) => {
      const L = S.layer({ par: 0.3 + seed * 0.04, sh: 3, pad: 260 });
      let m = '';
      for (let i = 0; i < n; i++) { const x = -500 + (i + c.rr(0.1, 0.9)) * (2600 / n); m += `<g transform="translate(${x.toFixed(0)} ${y}) scale(${(sc * c.rr(0.85, 1.1)).toFixed(2)})">${wheatStalk(c, { h: h * c.rr(0.85, 1.1), color: C.wheatGreen, ear: C.wheat })}</g>`; }
      L.add(m);
      return L;
    };
    const rows = [row(46, GY + 4, 130, 0.8, 0), row(40, GY + 6, 150, 0.95, 1), row(34, GY + 10, 160, 1.1, 2)];
    /* the cut-away earth */
    const soilL = S.layer({ par: 0.45, sh: 5 });
    const s = sheet();
    s.p(c.cut([[-1400, GY], [3200, GY], [3200, 1800], [-1400, 1800]], 1.6, 14), C.soil);
    s.p(c.cut([[-1400, GY + 70], ...Array.from({ length: 30 }, (_, i) => [-1400 + i * 160, GY + 70 + Math.sin(i) * 8]), [3200, GY + 72], [3200, 1800], [-1400, 1800]], 1.4, 14), shade(C.soil, -0.1));
    s.p(c.cut([[-1400, GY + 170], ...Array.from({ length: 30 }, (_, i) => [-1400 + i * 160, GY + 170 + Math.cos(i * 1.3) * 10]), [3200, GY + 172], [3200, 1800], [-1400, 1800]], 1.4, 14), C.soilDark);
    s.p(c.cut([[-1400, GY - 8], [3200, GY - 8], [3200, GY + 10], [-1400, GY + 12]], 1.2, 10), mix(C.moss, C.olive, 0.4));
    let peb = '';
    for (let i = 0; i < 40; i++) peb += c.cut(c.blob(c.rr(-600, 2200), c.rr(GY + 30, GY + 300), c.rr(5, 12), c.rr(4, 8), 8, 0.2), 0.4, 3);
    s.x(peb, mix(C.rock3, C.soil, 0.3), 'opacity=".8"');
    let fib = '';
    for (let i = 0; i < 30; i++) { const x = c.rr(-600, 2200); fib += c.ribbon(c.qbez([x, GY + 6], [x + c.rr(-20, 20), GY + 30], [x + c.rr(-30, 30), GY + c.rr(40, 70)], 6), 1.2); }
    s.x(fib, shade(C.soil, 0.25), 'opacity=".6"');
    soilL.add(s.out() + grass(c, { x0: -1400, x1: 3000, y: GY - 4, n: 70, h: 12, color: C.moss }));
    /* the grain and what becomes of it */
    const fx = S.layer({ par: 0.5, sh: 4 });
    const grain = (col) => sheet().p(c.cut(c.ell(0, 0, 9, 5.4, 12, -0.3), 0.2, 3), col).x(c.ribbon([[-6, 1.5], [6, -1.5]], 1), shade(col, -0.25), 'opacity=".7"').out();
    const seed = fx.add(`<g><circle r="26" fill="url(#halo-glow)"/>${grain(C.wheat)}</g>`);
    const alone = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 30, 24, 0, PI * 2, 30), 1.4)}" fill="${C.cream}" opacity=".8"/><g transform="translate(0 -46)">${nameTag(c, tr('samo', 'alone'), { size: 14 })}</g></g>`);
    const halfA = fx.add(`<g>${sheet().p(c.cut([[-9, 0], ...c.arc(0, 0, 9, 5.4, PI, 2 * PI, 8)], 0.2, 3), mix(C.wheat2, C.soilDark, 0.5)).out()}</g>`);
    const halfB = fx.add(`<g>${sheet().p(c.cut([[9, 0], ...c.arc(0, 0, 9, 5.4, 0, PI, 8)], 0.2, 3), mix(C.wheat2, C.soilDark, 0.5)).out()}</g>`);
    const roots = [[-30, 70], [0, 110], [34, 80], [-60, 40], [60, 50]].map(([dx, dy]) => { const g = fx.add(`<g>${lightPath(c.line(c.qbez([SX, SY + 4], [SX + dx * 0.3, SY + dy * 0.6], [SX + dx, SY + dy], 10)), { w: 2.4, col: shade(C.wheat, 0.2) })}</g>`); return g.querySelector('path'); });
    const shootEl = fx.add(`<g>${lightPath(c.line(c.qbez([SX, SY - 4], [SX - 10, (SY + GY) / 2], [SX, GY - 2], 10)), { w: 4, col: C.leaf })}</g>`);
    const shoot = shootEl.querySelector('path');
    const act = S.layer({ par: 0.52, sh: 5 });
    const mine = act.add(wheatStalk(c, { h: 170, color: C.wheatGreen, ear: C.wheat }));
    const mineStem = mine.querySelector('.stem'), mineEar = mine.querySelector('.ear');
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const fall = fx.add(`<g>${grain(C.wheat)}</g>`);
    const glow = fx.add(`<g>${glowDisc(260, 'halo-glow', 0.9)}</g>`);
    /* v25 — the two men */
    const clutch = S.puppet(act.add(person(c, man(c, { robe: C.plumRobe, mantle: C.ochre, beard: 'full', hairStyle: 'short' }))));
    const giver = S.puppet(act.add(person(c, man(c, { robe: C.sageRobe, mantle: null, beard: 'short', hairStyle: 'curly' }))));
    const held = fx.add(`<g><circle r="30" fill="url(#halo-glow)"/>${grain(C.wheat)}</g>`);
    const dust = Array.from({ length: 10 }, (_, i) => ({ i, dx: c.rr(-10, 60), dy: c.rr(-60, 10), el: fx.add(`<g><path d="${c.cut(c.circ(0, 0, c.rr(1.6, 3), 6), 0.2, 2)}" fill="${mix(C.dune, C.stone2, 0.4)}"/></g>`) }));
    const gift = fx.add(`<g><circle r="30" fill="url(#halo-glow)"/>${grain(C.wheat)}</g>`);
    const GX = S.portrait ? 1005 : 1110;   // phone: both men stand closer in
    const CX = S.portrait ? 575 : 520;
    const ear2 = act.add(wheatStalk(c, { h: 120, color: C.wheatGreen, ear: C.sun }));
    const ear2Stem = ear2.querySelector('.stem'), ear2Ear = ear2.querySelector('.ear');
    const ring = fx.add(`<g>${glowDisc(120, 'halo-glow', 0.8)}${eternityRing(c, 80, 6, 24, C.haloRim)}</g>`);
    const tagE = hanging(fx, nameTag(c, tr('życie wieczne', 'eternal life'), { size: 16 }), { x: GX, y: 300, len: 700 });
    const tagP = hanging(fx, nameTag(c, tr('plon obfity', 'much fruit'), { size: 17 }), { x: 560, y: 260, len: 700 });

    return (t, time) => {
      const T = time;
      swing(sunEl, 1190, 150, T, 1, 0.6);
      swing(cl, 520 + (T ? Math.sin(T * 0.1) * 20 : 0), 150, T, 1.2, 0.6, 1);
      /* v24a — the grain falls into the earth and lies alone */
      const drop = es(t, 0.15, 0.3);
      const [hx, hy] = hand(790, GY, 1.0, false, 60);
      jesus.set({ x: 790, y: GY, s: 1.0, armF: 20 + es(t, 0.02, 0.15) * 40 * (1 - es(t, 0.5, 0.8)) + bump(t, 1.1, 1.9) * 60, armB: 10 + bump(t, 1.2, 1.9) * 110, head: 6 * es(t, 0.1, 0.4) * (1 - es(t, 1.2, 1.5)) - bump(t, 1.4, 1.9) * 6, blink: blinkAt(T) });
      const fk = seg(t, 0.3, 0.55);
      const fy = fk < 0.45 ? lerp(hy + 4, GY, fk / 0.45) : lerp(GY, SY, ease.out((fk - 0.45) / 0.55));
      const fx0 = lerp(hx + 4, SX, Math.min(1, fk / 0.45));
      vis(fall, { x: fx0, y: fy, r: fk * 200, o: drop > 0 && fk < 1 ? 1 : 0 });
      const dies = es(t, 1.05, 1.3);
      const split = es(t, 1.25, 1.45);
      vis(seed, { x: SX, y: SY, r: -17, o: fk >= 1 ? 1 - split : 0, s: 1 + bump(t, 0.6, 0.95) * 0.1 });
      fade(seed.querySelector('circle'), 1 - dies);
      const ak = es(t, 0.55, 0.75) * (1 - es(t, 1.0, 1.15));
      vis(alone, { x: SX, y: SY, s: 0.9 + ak * 0.1, o: ak });
      /* v24b — it dies and bears much fruit */
      vis(halfA, { x: SX - split * 7, y: SY + split * 3, r: -17 - split * 30, o: split > 0.01 ? 1 - es(t, 1.8, 2.0) * 0.6 : 0 });
      vis(halfB, { x: SX + split * 7, y: SY + split * 3, r: -17 + split * 30, o: split > 0.01 ? 1 - es(t, 1.8, 2.0) * 0.6 : 0 });
      roots.forEach((p, i) => drawPath(p, es(t, 1.3 + i * 0.03, 1.6 + i * 0.03)));
      drawPath(shoot, es(t, 1.35, 1.55));
      const grow = es(t, 1.5, 1.85);
      pose(mine, { x: SX, y: GY, o: grow > 0.01 ? 1 : 0 });
      pose(mineStem, { sy: Math.max(0.02, grow) });
      pose(mineEar, { x: 0, y: -170 * grow, s: es(t, 1.7, 1.95) });
      rows.forEach((L, i) => L.shift(0, (1 - es(t, 1.55 + i * 0.1, 1.95 + i * 0.05, ease.out)) * (160 + i * 30)));
      const pk = es(t, 1.45, 1.7, ease.out) * (1 - es(t, 2.05, 2.25, ease.in));
      swing(tagP, S.portrait ? 620 : 560, 280 - (1 - pk) * 700, pk > 0.001 ? T : 0, 1.2, 0.8); fade(tagP, pk > 0.001 ? 1 : 0);
      vis(glow, { x: SX, y: GY - 100, s: 0.5 + es(t, 1.6, 2) * 0.8, o: bump(t, 1.55, 2.3) * 0.8 });
      /* v25a — clutching his life, he loses it */
      const inL = es(t, 2.0, 2.25);
      const crumble = es(t, 2.35, 2.62);
      clutch.set({ x: lerp(300, CX, inL), y: GY, s: 1.0, walk: inL > 0 && inL < 1 ? t * 30 : undefined, armF: 34, armB: 24, lean: 4 - crumble * 6, head: 12 + crumble * 6, o: inL > 0 ? 1 : 0, blink: blinkAt(T, 3) });
      const [chx, chy] = hand(lerp(300, CX, inL), GY, 1.0, false, 34, 4 - crumble * 6);
      vis(held, { x: chx + 2, y: chy - 2, s: 1 - crumble * 0.6, o: inL > 0.2 ? 1 - crumble : 0 });
      fade(held.querySelector('circle'), 1 - crumble);
      dust.forEach((d) => { const k = seg(t, 2.4 + d.i * 0.02, 2.85 + d.i * 0.02); vis(d.el, { x: chx + d.dx * k * 2 + k * 40, y: chy + d.dy * k * 2 - k * 30, o: k > 0 && k < 1 ? 1 - k : 0 }); });
      /* v25b — letting go, he keeps it for eternal life */
      const inR = es(t, 3.0, 3.2);
      const let_ = es(t, 3.18, 3.3);
      giver.set({ x: lerp(1320, GX + 60, inR), y: GY, s: 1.0, flip: true, walk: inR > 0 && inR < 1 ? t * 30 : undefined, armF: 30 + let_ * 50, armB: 20, head: 6 + let_ * 6 - es(t, 3.7, 3.95) * 12, o: inR > 0 ? 1 : 0, blink: blinkAt(T, 5) });
      const [ghx, ghy] = hand(lerp(1320, GX + 60, inR), GY, 1.0, true, 30 + let_ * 50);
      const gk = seg(t, 3.28, 3.42);
      vis(gift, { x: lerp(ghx, GX, gk), y: lerp(ghy, GY + 30, gk), r: gk * 180, o: inR > 0.2 && gk < 1 ? 1 : 0 });
      const g2 = es(t, 3.38, 3.6);
      pose(ear2, { x: GX, y: GY, o: g2 > 0.01 ? 1 : 0 });
      pose(ear2Stem, { sy: Math.max(0.02, g2) });
      pose(ear2Ear, { x: 0, y: -120 * g2, s: es(t, 3.5, 3.65) });
      const rk = es(t, 3.5, 3.72);
      vis(ring, { x: GX, y: GY - 110, s: 1, o: rk > 0.01 ? 1 : 0, r: T ? T * 4 : 0 });
      drawRing(ring, rk);
      const ek = es(t, 3.52, 3.72, ease.out);
      swing(tagE, GX, 270 - (1 - ek) * 700, ek > 0.001 ? T : 0, 1.2, 0.8); fade(tagE, ek > 0.001 ? 1 : 0);

      S.cam.x = kf(t, [[0, 0], [0.5, 30], [1.0, 40], [1.5, 30], [2.0, 0], [2.3, -50], [3.0, -40], [3.3, 50], [4, 50]]);
      S.cam.y = kf(t, [[0, -20], [0.4, 30], [1.2, 50], [1.6, 20], [2.0, -20], [3, -10], [4, -30]]);
      S.cam.z = kf(t, [[0, 1.02], [0.5, 1.12], [1.3, 1.16], [1.8, 1.04], [2.3, 1.1], [3.0, 1.08], [3.4, 1.1], [4, 1.04]]);
    };
  },
};
