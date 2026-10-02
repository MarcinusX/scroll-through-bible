// Mt 4,3–4 — dusk on the fortieth day. The tempter comes out of the dunes in his shadow and points at the
// round desert stones: they glint and turn into loaves. Jesus rises: "It is written" — a scroll comes down
// on its strings, the loaves are stones again. "…but by every word from the mouth of God": a shaft of light
// comes down from above, golden slips of the Word float down into His open hands, and the tempter shrinks back.
import { C, person, CAST, blinkAt, pose, lerp, swing } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { desertSet, desertFront, DUSK, TEMPTER, tempterAura, stoneLoaf, breadLoaf, addScroll, setScroll, lightShaft, goldSlip, sparkle, tr, PI } from './lib.js';

const GY = 742;
const JX = 870;
const TX = 560;

export default {
  id: 'mt4-bread',
  beats: [
    { v: 3, text: 'Wtedy przystąpił kusiciel i rzekł do Niego:' },
    { v: 3, cont: true, text: '«Jeśli jesteś Synem Bożym, powiedz, żeby te kamienie stały się chlebem».' },
    { v: 4, text: 'Lecz On mu odparł: «Napisane jest: Nie samym chlebem żyje człowiek,' },
    { v: 4, cont: true, text: 'lecz każdym słowem, które pochodzi z ust Bożych».' },
  ],
  cam: { x: [-30, 30], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const TXp = S.portrait ? 600 : TX;     // phone: the tempter and his shadow stand inside the screen
    const D = desertSet(S, { skyCols: DUSK, night: false, dusk: false, sunAt: [1250, 520] });
    const c = D.c;

    /* ---------- the light from above (behind the people) ---------- */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const shaft = lightL.add(`<g opacity="0">${lightShaft(c, { w0: 50, w1: 150 })}</g>`);

    /* ---------- the stones that would be bread ---------- */
    const SL = S.layer({ par: 0.5, sh: 3 });
    const STONES = [[640, 736, 22], [690, 744, 27], [742, 734, 21], [786, 742, 24], [712, 724, 17]];
    const stones = STONES.map(([x, y, r], i) => ({
      i, x, y,
      st: SL.add(`<g transform="translate(${x} ${y})">${stoneLoaf(c, r)}</g>`),
      br: SL.add(`<g transform="translate(${x} ${y})" opacity="0"><ellipse cy="-8" rx="${r * 1.8}" ry="${r}" fill="url(#warm-glow)"/>${breadLoaf(c, r * 1.15)}</g>`),
      gl: SL.add(`<g opacity="0">${sparkle(c, 10)}</g>`),
    }));

    /* ---------- the tempter and Jesus ---------- */
    const A = S.layer({ par: 0.5, sh: 4 });
    const aura = A.add(`<g opacity="0">${tempterAura(c, 136)}</g>`);
    const tempter = S.puppet(A.add(person(c, { ...TEMPTER })));
    const JL = S.layer({ par: 0.5, sh: 5 });
    const jSit = S.puppet(JL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jStand = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const slips = Array.from({ length: 7 }, (_, i) => ({ i, dx: c.rr(-60, 60), el: JL.add(`<g opacity="0">${goldSlip(c, 46 + (i % 3) * 8)}</g>`) }));

    /* ---------- "it is written" ---------- */
    const scL = S.layer({ par: 0.12, sh: 6 });
    const scroll = addScroll(scL, c, [tr('Napisane jest:', 'It is written:'), tr('«Nie samym chlebem', '“Man shall not live'), tr('żyje człowiek…»', 'by bread alone…”')], { w: 380, h: 170, size: 27 });

    desertFront(S);

    return (t, time) => {
      swing(D.sunEl, 1250, lerp(520, 600, es(t, 0, 4)), time, 1, 0.6);

      /* v3a: the tempter comes; Jesus rises to meet him */
      const tin = es(t, 0.05, 0.8);
      const back = es(t, 3.2, 3.8);
      const tx = lerp(300, TXp, tin) - back * (S.portrait ? 40 : 70);
      const point = es(t, 1.05, 1.3) * (1 - es(t, 2.3, 2.6));
      const cower = es(t, 3.3, 3.7);
      const ts = 1.06 - back * 0.1;
      tempter.set({ x: tx, y: GY, s: ts, o: seg(t, 0, 0.12), walk: (tin > 0 && tin < 1) || (back > 0 && back < 1) ? tx * 0.05 : undefined, flip: back > 0 && back < 1, armF: 16 + point * 40 + bump(t, 0.7, 1.0) * 20, armB: 10 + point * 30 + bump(t, 1.2, 1.9) * 30, head: point * 10 + cower * 14, lean: point * 10 - cower * 6, blink: blinkAt(time, 5) });
      pose(aura, { x: tx - 6, y: GY + 10, s: ts * (1 - cower * 0.35) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4, o: seg(t, 0, 0.3) * 0.9 * (1 - cower * 0.4) });
      const up = es(t, 0.55, 0.62);
      jSit.set({ x: JX - 14, y: GY - 14, s: 1.05, flip: true, o: 1 - up, armF: 20, armB: 10, head: 14 - es(t, 0.3, 0.5) * 10, blink: blinkAt(time) });
      const answer = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const recv = es(t, 3.15, 3.45);
      jStand.set({ x: JX, y: GY, s: 1.05, flip: true, o: up, armF: 14 + answer * 60 + recv * 50, armB: 10 + answer * 110 + recv * 40, head: -answer * 4 - recv * 12, blink: blinkAt(time) });

      /* v3b: the stones turn to bread … v4a: and back to stones */
      stones.forEach((s) => {
        const k = es(t, 1.3 + s.i * 0.07, 1.42 + s.i * 0.07) * (1 - es(t, 2.35 + s.i * 0.06, 2.47 + s.i * 0.06));
        pose(s.st, { x: s.x, y: s.y, o: 1 - k });
        pose(s.br, { x: s.x, y: s.y, o: k });
        const g = bump(t, 1.28 + s.i * 0.07, 1.6 + s.i * 0.07);
        pose(s.gl, { x: s.x + 6, y: s.y - 22, s: g * 1.2, r: time * 60, o: g });
      });

      /* v4a: "it is written" — the scroll comes down and unrolls */
      const down = es(t, 2.0, 2.3, ease.out);
      const lift = es(t, 3.0, 3.35, ease.in);
      const roll = es(t, 2.2, 2.5);
      setScroll(scroll, 800, lerp(-440, 176, down) - lift * 600 + Math.sin(time * 0.8) * 2, roll * (1 - es(t, 3.0, 3.2)), down, Math.sin(time * 0.6) * 0.6);

      /* v4b: the Word comes down in the light */
      const sh = es(t, 3.0, 3.35);
      pose(shaft, { x: JX, y: GY + 4, o: sh * (0.9 + Math.sin(time * 1.3) * 0.08) });
      slips.forEach((s) => {
        const k = seg(t, 3.1 + s.i * 0.09, 3.6 + s.i * 0.05);
        const y = lerp(40, 590, ease.out(k));
        pose(s.el, { x: JX - 40 + s.dx * (1 - k) + Math.sin(k * PI * 2 + s.i) * 16, y, r: Math.sin(k * 5 + s.i) * 20 + (time ? Math.sin(time * 1.4 + s.i) * 4 : 0), s: 1 - k * 0.5, o: k > 0 ? Math.min(1, k * 6) * (1 - seg(k, 0.85, 1) * 0.7) : 0 });
      });

      S.cam.z = 1.03 + es(t, 1.0, 1.4) * 0.05 - es(t, 2.0, 2.4) * 0.05 + es(t, 3.0, 3.5) * 0.04;
      S.cam.x = -es(t, 1.0, 1.4) * 20 * (1 - es(t, 2.0, 2.4));
      S.cam.y = 40 - es(t, 2.0, 2.4) * 20 * (1 - es(t, 3.0, 3.4));
    };
  },
};
