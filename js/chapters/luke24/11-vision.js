// Łk 24,22–24 — "Some women of our company amazed us": another flat comes down — the garden tomb at dawn, the stone
// rolled aside, the women standing at the open doorway. "They did not find His body, and came back saying they had
// seen a vision of angels, who said that He is alive": two small figures in white appear in a glow beside the tomb,
// a little sun of life rising in their words. "Some of us went to the tomb and found it just as the women had said,
// but Him they did not see": the women give place to Peter and John at the doorway — and where He should be, only a
// dotted outline, empty. All the while the Stranger listens.
import { C, CAST, blinkAt, pose, lerp, mix, sheet } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import {
  LATE, emmausSet, RD, TRIO, roadTrio, headAt, hangK, flat, flatSky, flatHills, emptyTomb, still, angelPerson, ANGEL_A, ANGEL_B,
  MAGD, JOANNA, MARYJ, PETER, TW, speech, risenIcon, sparkle, GLYPH,
} from './lib.js';

const GY = RD.GY;
const FW = 460, FH = 250;
const FX = 800, FY = 262;

export default {
  id: 'lk24-vision',
  beats: [
    { v: 22 },
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: LATE, sunAt: [1250, 240] });
    const R = roadTrio(S, E.act, E.fx);

    const inner = flatSky(S, FW, FH, ['#d9c4cc', '#f8e2c2'])
      + flatHills(c, FW, 50, mix(C.hillFar, C.duskViolet, 0.2), 10)
      + flatHills(c, FW, 96, mix(C.hillNear, C.sage2, 0.4), 5)
      + `<g transform="translate(90 100)">${emptyTomb(c, 2.3)}</g>`;
    const scene = E.FL.add(flat(S, inner, { w: FW, h: FH }));
    const B = E.bits;
    const women = B.add(`<g>${still(c, [
      { x: -40, y: 0, s: 0.36, o: MAGD, armF: 50, armB: 20, head: -4 },
      { x: -80, y: 4, s: 0.35, o: JOANNA, armF: 30, armB: 10 },
      { x: -118, y: 2, s: 0.35, o: MARYJ, armF: 20, armB: 60, head: -6 },
    ])}</g>`);
    const angels = B.add(`<g><ellipse cx="0" cy="-40" rx="80" ry="60" fill="url(#halo-glow)"/><g transform="translate(-26 0) scale(-.3 .3)">${angelPerson(c, ANGEL_A, 'stand')}</g><g transform="translate(26 2) scale(-.3 .3)">${angelPerson(c, ANGEL_B, 'stand')}</g></g>`);
    const alive = B.add(`<g>${speech(c, `<g transform="scale(.8)">${risenIcon(c)}</g>`, { w: 66, h: 58, flip: true })}</g>`);
    const men = B.add(`<g>${still(c, [
      { x: -40, y: 0, s: 0.37, o: PETER, armF: 40, armB: 20, head: 10 },
      { x: -84, y: 4, s: 0.36, o: TW.john, armF: 30, armB: 10, head: 4 },
    ])}</g>`);
    // the one they did not see: a dotted outline, empty
    const outline = `<path d="${c.poly([[-14, -150], [14, -150], [26, -138], [32, -70], [42, -6], [-42, -6], [-32, -70], [-26, -138]])}" fill="none" stroke="${C.inkSoft}" stroke-width="3" stroke-dasharray="7 6" opacity=".7"/><circle cx="0" cy="-167" r="18" fill="none" stroke="${C.inkSoft}" stroke-width="3" stroke-dasharray="7 6" opacity=".7"/>`;
    const notSeen = B.add(`<g>${outline}</g>`);
    const q = B.add(`<g>${GLYPH.q(c)}</g>`);
    const glints = [0, 1].map(() => B.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, T) => {
      E.update(T, { sunY: 240 + es(t, 0, 3) * 30 });
      const tellF = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.1)) + es(t, 2.05, 2.3);
      const tellC = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      R.fr.p.set({ x: TRIO.FR, y: GY - 2, s: TRIO.S, armF: 20 + tellF * 60 + Math.sin(t * 8) * 6 * tellF, armB: 10 + tellF * 50, head: -tellF * 10 + 6, blink: blinkAt(T, 1) });
      R.cl.p.set({ x: TRIO.CL, y: GY + 4, s: TRIO.S, flip: true, armF: 22 + tellC * 70, armB: 12 + tellC * 100, head: -tellC * 12 + 6, blink: blinkAt(T, 4) });
      fade(R.fr.sad, 0.8 - tellF * 0.3);
      fade(R.cl.sad, 0.8 - tellC * 0.3);
      R.stSet({ x: TRIO.ST, y: GY + 2, s: TRIO.S + 0.02, armF: 34, armB: 10, head: -es(t, 1.2, 1.5) * 8 + es(t, 2.2, 2.5) * 12, blink: blinkAt(T, 6) });
      R.halo(0.26);

      /* the flat */
      const fk = es(t, 0.02, 0.3, ease.out);
      hangK(scene, fk, FX, FY, 0, 0);
      const fy = lerp(-1500, FY, fk);
      const on = fk > 0.002 ? 1 : 0;
      const at = (dx, dy) => [FX + dx, fy + dy];
      /* v22: the women at the tomb early */
      const [wx, wy] = at(-40, 112);
      pose(women, { x: wx, y: wy, o: on * (1 - es(t, 2.05, 2.25)) });
      /* v23: a vision of angels, who say that He is alive */
      const ak = es(t, 1.05, 1.35);
      const [ax, ay] = at(20, 104);
      pose(angels, { x: ax, y: ay, o: on * ak * (1 - es(t, 2.05, 2.25)) });
      const bk = es(t, 1.35, 1.55, ease.back) * (1 - es(t, 2.0, 2.1));
      const [bx, by] = at(10, 40);
      pose(alive, { x: bx, y: by, s: bk, o: on && bk > 0.01 ? 1 : 0 });
      /* v24: some of us went — found it so — but Him they did not see */
      const mk = es(t, 2.1, 2.35);
      pose(men, { x: wx, y: wy, o: on * mk });
      const nk = es(t, 2.4, 2.7);
      const [ox, oy] = at(90, 98);
      pose(notSeen, { x: ox, y: oy, s: 0.4, o: on * nk });
      const qk = es(t, 2.55, 2.75, ease.back);
      pose(q, { x: ox + 26, y: oy - 90, s: qk, o: on && qk > 0.01 ? 1 : 0 });
      glints.forEach((g, i) => {
        const b = bump(t, 0.3 + i * 0.15, 0.9 + i * 0.15);
        const [gx, gy] = at(60 + i * 60, 30 - i * 16);
        pose(g, { x: gx, y: gy, s: b, r: T * 30, o: on * b });
      });

      S.cam.x = 0;
      S.cam.y = 4;
      S.cam.z = S.portrait ? 0.98 : 1.02;
      void seg; void sheet; void CAST;
    };
  },
};
