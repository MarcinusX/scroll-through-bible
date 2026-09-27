// J 2,23–25 — Jerusalem on the feast of Passover, at evening: the full moon, lamps across the street,
// pilgrims. Many believe in His name, seeing the signs (little medallions shine above Him). But Jesus
// does not entrust Himself to them: He knows them all. Someone comes to tell Him about another — He needs
// no one's testimony. He Himself knows what is in man: small windows on each heart open in His light.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, house, moon, stars, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { guest, lantern, garland, lamb, heartWindow, openWindow, iconBubble, talkDots, miniHead, signBadge, wordTag, sparkle, skyKeys, tr, PI } from './lib.js';

const FLOOR = 690;
const EVE = ['#5e5b8e', '#b98b9c', '#e8b193'];
const NITE = ['#232a5c', '#3d4579', '#79709a'];

/** a small sign medallion with an icon (origin centre) */
function miniSign(c, kind) {
  const s = sheet().p(c.cut(c.circ(0, 0, 26, 22), 0.3, 3), C.haloRim).p(c.cut(c.circ(0, 0, 22, 22), 0.3, 3), C.cream);
  let ic = '';
  if (kind === 0) ic = `<path d="${c.cut([[-7, 10], [-10, 0], [-8, -8], [-4, -10], [4, -10], [8, -8], [10, 0], [7, 10]], 0.2, 3)}" fill="${mix(C.stone, C.rock, 0.35)}"/><path d="${c.cut([[-4, 8], [-4, -4], [4, -4], [4, 8]], 0.1, 2)}" fill="#9c3d5c"/>`;
  if (kind === 1) ic = `<path d="${c.cut([[-8, 10], [-9, -2], [-6, -12], [-3, -2], [-2, -14], [1, -2], [3, -12], [5, -1], [8, -8], [9, 4], [5, 10]], 0.2, 3)}" fill="${C.skin2}"/>`;
  if (kind === 2) ic = `<path d="${c.poly(c.star(0, 0, 12, 5, 8, 0))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 4, 8))}" fill="${C.star}"/>`;
  if (kind === 3) ic = `<path d="${c.cut(c.ell(0, 0, 12, 7, 12), 0.2, 3)}" fill="${C.cream}" stroke="${C.inkSoft}" stroke-width="1.5"/><path d="${c.poly(c.circ(0, 0, 4, 8))}" fill="${C.teal2}"/>`;
  return `<circle r="60" fill="url(#warm-glow)" opacity=".8"/>${s.out()}${ic}`;
}

export default {
  id: 'j2-hearts',
  beats: [
    { v: 23, text: 'Kiedy zaś przebywał w Jerozolimie w czasie Paschy, w dniu świątecznym,' },
    { v: 23, cont: true, text: 'wielu uwierzyło w imię Jego, widząc znaki, które czynił.' },
    { v: 24 },
    { v: 25, text: 'i nie potrzebował niczyjego świadectwa o człowieku.' },
    { v: 25, cont: true, text: 'Sam bowiem wiedział, co w człowieku się kryje.' },
  ],
  cam: { x: [-20, 20], y: [0, 90], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, EVE);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starEl = hangL.add(`<g>${stars(c, { x0: -600, x1: 2200, y0: -300, y1: 380, n: 90 })}</g>`);
    const moonEl = hanging(hangL, `<circle r="130" fill="url(#halo-glow)" opacity=".6"/>${moon(c, 46)}`, { x: 1150, y: 170, len: 800 });

    /* the city: far roofs, the Temple's glow, houses along the street */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h = band(c, { y: 470, amps: [10, 5, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.duskViolet, 0.5), x0: -1400, x1: 3000 });
    far.add(h.markup);
    let roofs = '';
    for (let x = -800; x < 2400; x += c.rr(40, 70)) roofs += house(c, x, h.fn(x) + 26, c.rr(36, 60), c.rr(26, 46), { wall: mix(C.plaster, C.duskViolet, 0.35), shadow: mix(C.plaster2, C.night, 0.3), stairs: false, lit: c.chance(0.5) });
    far.add(roofs);
    const street = S.layer({ par: 0.3, sh: 4 });
    let hs = '';
    [[-500, 150], [-330, 170], [-160, 150], [180, 130], [330, 160], [1140, 160], [1300, 140], [1450, 170], [1620, 150], [1790, 160]].forEach(([x, w]) => { hs += house(c, x, FLOOR - 60, w, c.rr(150, 210), { wall: mix(C.plaster, C.dusk, 0.25), shadow: mix(C.plaster2, C.duskViolet, 0.4), lit: true }); });
    street.add(hs + cypress(c, 560, FLOOR - 62, 150, mix(C.moss2, C.night, 0.3)) + cypress(c, 1060, FLOOR - 62, 140, mix(C.moss2, C.night, 0.3)));
    const floorL = S.layer({ par: 0.36, sh: 3 });
    const f = sheet();
    f.p(c.cut([[-1800, FLOOR - 66], [3400, FLOOR - 66], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.stone2, C.duskViolet, 0.3));
    let cob = '';
    for (let i = 0; i < 160; i++) cob += c.cut(c.blob(c.rr(-900, 2500), c.rr(FLOOR - 50, 1000), c.rr(10, 20), c.rr(5, 9), 8, 0.2), 0.4, 4);
    f.x(cob, shade(C.stone2, -0.12), 'opacity=".35"');
    floorL.add(f.out());

    /* lamps strung over the street; the Passover lamb */
    const flyL = S.layer({ par: 0.42, sh: 4 });
    const garl = flyL.add(`<g transform="translate(260 250)">${garland(c, 1080, 60)}</g>`);
    const lamps = [360, 540, 720, 880, 1060, 1240].map((x, i) => { const el = hanging(flyL, lantern(c, { col: [C.apricot, C.wheat, C.roseRobe][i % 3] }), { x, y: 280 + (i % 2) * 30, len: 800 }); return { el, x, i, glow: el.querySelector('.glow'), y: 290 + Math.sin(i * 1.2) * 26 }; });
    const pascha = hanging(flyL, `${sheet().p(c.cut(c.circ(0, 0, 50, 30), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, 45, 30), 0.4, 5), C.cream).out()}<g transform="translate(-4 18) scale(.8)">${lamb(c)}</g>`, { x: 640, y: 215, len: 800 });

    /* the name, and the signs */
    const signL = S.layer({ par: 0.46, sh: 5 });
    const name = hanging(signL, `<circle cx="0" cy="24" r="130" fill="url(#halo-glow)"/>${wordTag(c, tr('w imię Jezusa', 'in the name of Jesus'), { size: 24, w: 250 })}`, { x: 800, y: 0, len: 800 });
    const minis = [0, 1, 2, 3].map((k) => ({ k, el: signL.add(`<g>${miniSign(c, k)}</g>`), a: -PI * (0.2 + k * 0.2) }));

    /* the crowd with their heart-windows, and Jesus */
    const L = S.layer({ par: 0.52, sh: 6 });
    const KINDS = ['bright', 'cloud', 'faint', 'bright', 'faint', 'cloud', 'bright', 'faint'];
    const people = [[430, 0, 1], [510, 16, 0], [585, 4, 1], [660, 20, 0], [940, 20, 0], [1015, 4, 1], [1090, 16, 0], [1170, 0, 1]].map(([x, dy, man], i) => {
      const o = guest(c, !!man, { mantle: null });
      return { i, x, y: FLOOR + dy - 10, flip: x > 800, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))), win: L.add(`<g>${heartWindow(c, KINDS[i], 16)}</g>`) };
    });
    const teller = { seed: c.rr(0, 9), p: S.puppet(L.add(person(c, guest(c, true, { robe: C.ochreRobe, mantle: C.clayMantle })))) };
    const tellB = L.add(`<g>${iconBubble(c, `<g transform="translate(-22 4)">${miniHead(c, guest(c, true), 16)}</g><g transform="translate(22 4)">${talkDots(c)}</g>`, { w: 110, h: 70, side: -1 })}</g>`);
    const jGlow = L.add(`<g><circle r="260" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const beams = people.map((p) => L.add(`<g><path d="M0 -4L300 -12L300 12Z" fill="#fff1c4" opacity=".35"/></g>`));

    return (t, time) => {
      const T = time;
      skyKeys(sk, t, [[0, EVE], [2.2, NITE]]);
      const nite = es(t, 0.5, 2.5);
      fade(starEl, nite);
      pose(moonEl, { x: 1150, y: 170 + (1 - es(t, 0, 0.8)) * 160 });
      lamps.forEach((l) => { pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 1.1 + l.i) * 2 }); fade(l.glow, 0.6 + nite * 0.35); });
      pose(garl, { x: 260, y: 240 });
      pose(pascha, { x: 640, y: 215 - (1 - es(t, 0.1, 0.5, ease.out)) * 500 - es(t, 1.0, 1.3) * 500, r: t < 1.3 ? Math.sin(T * 0.8) * 2 : 0 });

      /* v23a — the feast; v23b — many believe, seeing the signs */
      const see = es(t, 1.05, 1.4);
      const nk = es(t, 1.15, 1.5, ease.out) * (1 - es(t, 2.0, 2.3));
      pose(name, { x: 800, y: 190 - (1 - nk) * 560 });
      minis.forEach((m) => {
        const k = es(t, 1.1 + m.k * 0.08, 1.4 + m.k * 0.08, ease.back) * (1 - es(t, 2.0, 2.2));
        const r = 190;
        pose(m.el, { x: 800 + Math.cos(m.a) * r * 1.2, y: FLOOR - 170 + Math.sin(m.a) * r * 0.9 + Math.sin(T * 1.2 + m.k) * 4, s: k, o: k });
      });

      /* v24 — He does not entrust Himself: a step apart; He knows them all */
      const apart = es(t, 2.05, 2.4);
      const knows = es(t, 2.35, 2.8);
      const hand = bump(t, 3.1, 3.95);
      const open = es(t, 4.05, 4.4);
      jesus.set({ x: 800, y: FLOOR + 10 - apart * 16, s: 1.08 - apart * 0.04, armF: 20 + see * 20 * (1 - apart) + hand * 60 + open * 30, armB: 10 + open * 50, head: -open * 4, blink: blinkAt(T, 1) });
      pose(jGlow, { x: 800, y: FLOOR - 110, s: 0.7 + knows * 0.3 + open * 0.3, o: 0.35 + knows * 0.3 + open * 0.2 });
      people.forEach((p) => {
        const inward = (p.flip ? -1 : 1);
        const come = es(t, 0.05 + p.i * 0.04, 0.6 + p.i * 0.04, ease.out);
        const x = p.x + inward * -120 * (1 - come) + inward * apart * -10;
        p.p.set({ x, y: p.y, s: 0.98, flip: p.flip, walk: come > 0.02 && come < 0.98 ? x * 0.1 : undefined, armF: 20 + see * (60 + (p.i % 2) * 40) * (1 - es(t, 2.1, 2.4) * 0.6), armB: 10 + see * (p.i % 3 === 0 ? 110 : 20) * (1 - es(t, 2.1, 2.4) * 0.8), head: -see * 10 + open * 6, blink: blinkAt(T, p.seed) });
        // the window on the heart
        const wx = x + (p.flip ? -6 : 6) * 0.98, wy = p.y - 112 * 0.98;
        const wk = es(t, 2.35 + p.i * 0.05, 2.6 + p.i * 0.05, ease.back);
        pose(p.win, { x: wx, y: wy, s: wk, o: wk });
        openWindow(p.win, es(t, 4.05 + Math.abs(p.x - 800) * 0.0003, 4.35 + Math.abs(p.x - 800) * 0.0003), 16);
        // a soft beam of His light toward each heart
        const dx = wx - 800, dy = wy - (FLOOR - 120);
        const len = Math.hypot(dx, dy);
        pose(beams[p.i], { x: 800, y: FLOOR - 120, r: (Math.atan2(dy, dx) * 180) / PI, sx: len / 300, sy: 1, o: bump(t, 2.4, 3.1) * 0.6 + es(t, 4.05, 4.4) * 0.9 });
      });

      /* v25a — someone would tell Him about another; He needs no testimony */
      const tIn = es(t, 3.0, 3.35, ease.out) * (1 - es(t, 3.9, 4.2));
      const tx = lerp(1350, 925, tIn);
      teller.p.set({ x: tx, y: FLOOR + 26, s: 1.02, flip: true, walk: tIn > 0.02 && tIn < 0.98 ? tx * 0.1 : undefined, armF: 30 + bump(t, 3.3, 3.9) * 70, armB: bump(t, 3.3, 3.9) * 50, head: 6, blink: blinkAt(T, teller.seed), o: seg(t, 2.95, 3.05) * (1 - seg(t, 4.1, 4.2)) });
      const tb = es(t, 3.3, 3.5, ease.back) * (1 - es(t, 3.72, 3.9));
      pose(tellB, { x: tx - 16, y: FLOOR - 180, s: 0.3 + 0.7 * tb, o: tb });

      S.cam.z = 1.06 + es(t, 2.1, 2.6) * 0.06 + es(t, 4.0, 4.6) * 0.04;
      S.cam.y = 40 + es(t, 2.1, 2.6) * 30;
    };
  },
};
