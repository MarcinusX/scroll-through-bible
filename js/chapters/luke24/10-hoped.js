// Łk 24,20–21 — The flat turns to shadow-play at dusk: the chief priests and rulers hand Him over, bound, to a soldier;
// and on a hill the cross stands dark against a red sky (no more than that). "But we had hoped that He was the one to
// redeem Israel": a golden star of hope hangs over the two — and grows grey and sinks as they hang their heads.
// "And now it is the third day": three discs come down, two dark nights and the third a sun — today — shining right
// over the Stranger's head, though they do not see it.
import { C, CAST, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { LATE, emmausSet, RD, TRIO, roadTrio, headAt, hangK, flat, flatSky, flatHills, shadowPerson, soldierSil, crossHill, hopeStar, dayDisc3, sparkle, STRING } from './lib.js';

const GY = RD.GY;
const FW = 460, FH = 250;
const INK = '#352a38';

export default {
  id: 'lk24-hoped',
  beats: [
    { v: 20 },
    { v: 21, text: 'A myśmy się spodziewali, że On właśnie miał wyzwolić Izraela.' },
    { v: 21, cont: true, text: 'Tak, a po tym wszystkim dziś już trzeci dzień, jak się to stało.' },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: LATE, sunAt: [1250, 220] });
    const R = roadTrio(S, E.act, E.fx);

    /* the shadow-play flat */
    const sil = (o, x, y, s, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${shadowPerson(c, o, INK)}</g>`;
    const priestO = { hairStyle: 'wrap', beard: 'full', mantle: C.ink };
    const inner = flatSky(S, FW, FH, ['#6f5d86', '#e3a283'])
      + flatHills(c, FW, 86, mix(C.storm2, C.plumRobe, 0.45), 6)
      + sil(priestO, -196, 110, 0.4) + sil({ ...priestO, beard: 'short' }, -150, 112, 0.38)
      + `<g transform="translate(-96 108) scale(.4)"><g transform="rotate(8)">${shadowPerson(c, { ...CAST.jesus, halo: false }, INK)}</g></g>`
      + `<path d="${c.ribbon([[-104, 60], [-88, 62]], 3)}" fill="${C.rope}"/>`
      + `<g transform="translate(-36 110) scale(-.38 .38)">${soldierSil(c, 0, { spear: true, col: INK })}</g>`
      + `<g transform="translate(140 104)">${crossHill(c, 1.15, INK, mix(INK, C.plumRobe, 0.3))}</g>`;
    const shadow = E.FL.add(flat(S, inner, { w: FW, h: FH }));

    /* the star of hope; grey, sinking */
    const star = E.bits.add(`<g><path d="M0 -1600V-26" stroke="${STRING}" stroke-width="1.2" fill="none"/><circle r="60" fill="url(#halo-glow)"/>${hopeStar(c, 26)}</g>`);
    const grey = E.bits.add(`<g opacity="0">${hopeStar(c, 26, mix(C.stone2, C.rock3, 0.5))}</g>`);
    /* the three days */
    const days = ['dark', 'dark', 'sun'].map((k, i) => ({ i, el: E.bits.add(`<g><path d="M0 -1600V-30" stroke="${STRING}" stroke-width="1.2" fill="none"/>${i === 2 ? '<circle r="70" fill="url(#halo-glow)"/>' : ''}${dayDisc3(c, k, 28)}</g>`) }));
    const today = E.bits.add(`<g>${sparkle(c, 16)}</g>`);

    return (t, T) => {
      E.update(T, { sunY: 220 + es(t, 0, 3) * 30 });
      const tell = es(t, 0.05, 0.3) * (1 - es(t, 2.85, 3));
      const hoped = es(t, 1.05, 1.3);
      const lost = es(t, 1.5, 1.85);
      R.fr.p.set({ x: TRIO.FR, y: GY - 2, s: TRIO.S, armF: 20 + tell * 30 * (1 - lost) + hoped * (1 - lost) * 60, armB: 10 + hoped * (1 - lost) * 90, head: -hoped * (1 - lost) * 12 + lost * 16, blink: blinkAt(T, 1) });
      R.cl.p.set({ x: TRIO.CL, y: GY + 4, s: TRIO.S, flip: true, armF: 22 + tell * 50 * (1 - hoped) + es(t, 2.1, 2.35) * 40, armB: 12 + tell * 60 * (1 - hoped) + hoped * (1 - lost) * 80, head: -hoped * (1 - lost) * 12 + lost * 14, blink: blinkAt(T, 4) });
      fade(R.fr.sad, 0.7 + lost * 0.3);
      fade(R.cl.sad, 0.7 + lost * 0.3);
      R.stSet({ x: TRIO.ST, y: GY + 2, s: TRIO.S + 0.02, armF: 34, armB: 10, head: 6, blink: blinkAt(T, 6) });
      R.halo(0.26);

      /* v20: handed over and crucified — shadow-play */
      const fk = es(t, 0.02, 0.3, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangK(shadow, fk, 800, 262, T, 1);

      /* v21a: the star of hope, then grey */
      const sk = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.95, 2.15, ease.in));
      const sink = lost * 70;
      const sy = lerp(-1500, 300 + sink, sk) + (T ? Math.sin(T * 0.8) * 3 : 0);
      pose(star, { x: 800, y: sy, r: lost * 14, o: sk > 0.002 ? 1 : 0 });
      pose(grey, { x: 800, y: sy, r: lost * 14, o: sk > 0.002 ? lost : 0 });

      /* v21b: the third day */
      days.forEach((d) => {
        const k = es(t, 2.05 + d.i * 0.14, 2.3 + d.i * 0.14, ease.back);
        hangK(d.el, k, 640 + d.i * 160, 290 - (d.i === 2 ? 40 : 0), T, d.i);
      });
      const tb = bump(t, 2.55, 3.0);
      pose(today, { x: 990, y: 210, s: tb * 1.3, r: T * 30, o: tb });

      S.cam.x = 0;
      S.cam.y = 20 - fk * 16;
      S.cam.z = S.portrait ? 0.98 : 1.04;
      void seg;
    };
  },
};
