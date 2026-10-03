// Łk 17,17–19 — the road by the village; the Samaritan still kneels at Jesus' feet. "Weren't the ten cleansed?":
// Jesus lifts His hands, and a garland of ten little lights comes down across the sky. "But where are the nine?": nine
// of them drift away up the road towards the city and are gone; a question mark hangs over the empty road by the gate.
// "Were there none found who returned to give glory to God, except this stranger?": the one light that is left comes
// down and hangs over the kneeling man. "Get up, and go your way. Your faith has healed you": Jesus takes his hand and
// raises him; the light sinks into his heart, and he goes off home up the road to his village, waving.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, ROAD_FAR, roadFour, LEP, lepPhone, lepS, SAMARITAN, lightMote, question, heart, strung, flyIn, voiceRings, headAt, hand, halo, warm, behindOf, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { JX, JY } = LEP;
const KNEEL = [800, 722];
const GY = 330;       // the garland

export default {
  id: 'lk17-nine',
  beats: [
    { v: 17, text: 'Jezus zaś rzekł: «Czy nie dziesięciu zostało oczyszczonych?' },
    { v: 17, cont: true, text: 'Gdzie jest dziewięciu?' },
    { v: 18 },
    { v: 19 },
  ],
  cam: { x: [0, 100], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const { DIS } = lepPhone(S);   // phone: the four closer behind Him
    const R = roadSet(S, { village: true });
    const c = S.c;
    /* the garland of ten lights */
    const gL = S.layer({ par: 0.12, sh: 3 });
    const cord = gL.add(`<g transform="translate(0 -1500)"><path d="M-900 -2400L-240 0Q0 30 240 0L900 -2400" stroke="${'rgba(74,54,34,.55)'}" stroke-width="1.3" fill="none"/></g>`);
    const LIGHTS = Array.from({ length: 10 }, (_, i) => ({ i, dx: (i - 4.5) * 50, el: gL.add(`<g opacity="0">${lightMote(c, 7)}</g>`) }));
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const oneGlow = glowL.add(`<g opacity="0">${warm(60)}</g>`);
    const F = roadFour(S, act, c);
    const kneel = S.puppet(act.add(person(c, { ...SAMARITAN, pose: 'kneel' })));
    const stand = S.puppet(act.add(person(c, SAMARITAN)));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const one = fx.add(`<g opacity="0">${lightMote(c, 9)}</g>`);
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);
    const love = fx.add(`<g opacity="0">${heart(c, 12)}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.15 + es(t, 2, 4) * 0.3, sunK: es(t, 2, 4) * 0.2 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, s: 1 + bump(t, 1.1, 1.9) * 0.3, o: 0.7 + bump(t, 1.1, 1.9) * 0.3 });

      /* Jesus: hands lifted — "weren't the ten cleansed?"; then to the man; then He raises him */
      const lift = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const toRoad = es(t, 1.05, 1.25) * (1 - es(t, 1.85, 2.0));
      const toHim = es(t, 2.1, 2.3) * (1 - es(t, 3.05, 3.2));
      const raise = es(t, 3.05, 3.3) * (1 - es(t, 3.6, 3.8));
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + lift * 50 + toRoad * 80 + toHim * 44 + raise * 50, armB: 8 + lift * 120 + toRoad * 30, head: -lift * 8 - toRoad * 10 + toHim * 10, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 0.02, 0.15) * (1 - es(t, 0.7, 0.8)) + es(t, 1.02, 1.12) * (1 - es(t, 1.6, 1.7)) + es(t, 2.02, 2.12) * (1 - es(t, 2.7, 2.8)) + es(t, 3.02, 3.1) * (1 - es(t, 3.6, 3.7)), T, { dir: 1, spread: 2 });
      F.ds.forEach((d) => {
        const [, x, y] = DIS.find((e) => e[0] === d.k);
        const look = es(t, 1.1, 1.4) * (1 - es(t, 2.1, 2.4));
        d.p.set({ x, y, s: 0.96, armF: 20, armB: 6, head: -4 - look * 8, blink: blinkAt(T, d.seed) });
      });

      /* v17a — the garland of ten; v17b — nine drift away to the city */
      const gk = es(t, 0.15, 0.45, ease.back) * (1 - es(t, 2.8, 3.0));
      const gy = lerp(-1500, GY, gk);
      pose(cord, { x: 800, y: gy - 30, o: gk > 0.002 ? 1 : 0 });
      LIGHTS.forEach((L) => {
        const on = es(t, 0.35 + L.i * 0.04, 0.45 + L.i * 0.04, ease.back);
        const lx = 800 + L.dx, ly = gy - 30 + Math.abs(L.dx) * -0.0 + (240 - Math.abs(L.dx)) * 0.0625;
        if (L.i === 9) { pose(L.el, { x: lx, y: ly, s: Math.max(0.001, on), o: on > 0.01 && t < 2.1 ? 1 : 0 }); return; }
        const go = es(t, 1.08 + L.i * 0.04, 1.6 + L.i * 0.04);
        const [cx, cy] = [ROAD9.CITY[0] + (L.i - 4) * 6, ROAD9.CITY[1] - 10];
        pose(L.el, { x: lerp(lx, cx, go), y: lerp(ly, cy, go) - Math.sin(go * PI) * 60, s: Math.max(0.001, on * (1 - go * 0.7)), o: on > 0.01 ? 1 - es(t, 1.5 + L.i * 0.04, 1.65 + L.i * 0.04) : 0 });
      });
      const qk = es(t, 1.55, 1.72, ease.back) * (1 - es(t, 2.05, 2.15));
      pose(q, { x: S.portrait ? 1030 : 1100, y: 520, s: qk * 1.5, o: qk > 0.01 ? 1 : 0 });

      /* v18 — the one light left comes down over the stranger */
      const dk = es(t, 2.1, 2.45);
      const into = es(t, 3.2, 3.45);
      const [x9, y9] = [800 + 4.5 * 50, GY - 30 + (240 - 4.5 * 50) * 0.0625];
      const ox = lerp(x9, KNEEL[0] - 4, dk), oy = lerp(y9, KNEEL[1] - 190, dk) + into * 90;
      pose(one, { x: ox, y: oy, s: 1 + dk * 0.4 - into * 0.9, o: t >= 2.1 && into < 0.98 ? 1 : 0 });
      pose(oneGlow, { x: ox, y: oy, o: dk * (1 - into) * 0.8 });

      /* the man: kneeling; v19 — raised up, he goes home to his village */
      const up = es(t, 3.25, 3.32);
      const home = es(t, 3.5, 3.98, (x) => x);
      kneel.set({ x: KNEEL[0], y: KNEEL[1], s: 0.96, flip: true, armF: 40 + dk * 30 + raise * 30, armB: 30 + dk * 90 * (1 - raise), lean: 30 * (1 - dk) + 6, head: 14 * (1 - dk) - dk * 10, o: 1 - up, blink: blinkAt(T, 4) });
      const hx = lerp(KNEEL[0], LEP.GATE[0], home), hy = lerp(KNEEL[1], LEP.GATE[1] + 16, home);
      stand.set({ x: hx, y: hy, s: lerp(0.96, lepS(LEP.GATE[1] + 16), home), flip: home < 0.05, walk: home > 0 && home < 1 ? t * 30 : undefined, armF: 30 + raise * 40, armB: 10 + bump(t, 3.55, 3.95) * 140 + (T ? Math.sin(T * 8) * 10 * bump(t, 3.55, 3.95) : 0), head: -6, o: up, blink: blinkAt(T, 4) });
      const lk = es(t, 3.4, 3.55, ease.back) * (1 - es(t, 3.9, 4));
      const [shx, shy] = headAt(hx, hy, lerp(0.96, 0.6, home), home < 0.05);
      pose(love, { x: shx, y: shy - 44, s: lk, o: lk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 30], [1, 50], [2, 50], [2.6, 30], [3.4, 40], [4, 60]]);
      S.cam.y = kf(t, [[0, 20], [0.6, -10], [2, -10], [2.6, 40], [4, 30]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.0], [2, 1.02], [2.6, 1.12], [3.4, 1.12], [4, 1.06]]);
    };
  },
};
