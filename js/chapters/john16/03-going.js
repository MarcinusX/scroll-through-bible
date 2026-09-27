// J 16,5–7 — "Now I go to Him who sent Me": He points along the path, and a line of gold runs from His feet up over
// the Mount of Olives, where a great light rises behind the ridge (never a figure). "And none of you asks Me, 'Where
// are You going?'": little question-bubbles begin to form over their heads — and sink back unasked. "Sorrow has
// filled your heart": grey stone hearts, bowed heads, lanterns lowered. "It is to your advantage that I go away":
// a small golden light leaves His hand and travels up the path to the ridge. "If I do not go, the Counselor will not
// come": it lingers at the top, and beyond the hill a dove waits, grey and far. "But if I go, I will send Him to
// you": the light goes over — and a dove of light comes back over the hill, brighter, to circle above them, and a
// small flame drops into every lantern.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, fatherLight, goldArc, thought, GLYPH, stoneHeart, dove, flapWings, tongue, hand,
  kf, vis, pose, lerp, C, PI, JX,
} from './lib.js';

const RX = 1150;            // where the path crosses the ridge

export default {
  id: 'j16-going',
  beats: [
    { v: 5, text: 'Teraz zaś idę do Tego, który Mnie posłał,' },
    { v: 5, cont: true, text: 'a nikt z was nie pyta Mnie: "Dokąd idziesz?"' },
    { v: 6 },
    { v: 7, text: 'Jednakże mówię wam prawdę: Pożyteczne jest dla was moje odejście.' },
    { v: 7, cont: true, text: 'Bo jeżeli nie odejdę, Pocieszyciel nie przyjdzie do was.' },
    { v: 7, cont: true, text: 'A jeżeli odejdę, poślę Go do was.' },
  ],
  cam: { x: [-20, 60], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    let B = null;
    const P = pathSet(S, {
      beyond(S2) {
        const L = S2.layer({ par: 0.13, sh: 2 });
        const light = L.add(`<g>${fatherLight(c, 70, { ray: [1.5, 2.3], glow: 2.6 })}</g>`);
        const orbB = L.add(`<g><circle r="46" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 11, 16), 0.2, 3)}" fill="${C.star}"/></g>`);
        const doveB = L.add(`<g><circle r="70" fill="url(#halo-glow)" class="dg"/>${dove(c)}</g>`);
        B = { L, light, orbB, doveB };
        return L;
      },
    });
    const GY = P.GY;
    const RY = P.ridge(RX) + 6;

    // the golden way over the hill
    const wayL = S.layer({ par: 0.3, sh: 0, flat: true });
    const wayPts = c.cbez([JX + 36, GY - 150], [900, 330], [1060, 360], [RX, RY - 10], 40);
    const way = goldArc(wayL, c, wayPts, { w: 4, n: 44, col: C.halo });

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });
    const fx = S.layer({ par: 0.56, sh: 4 });
    const qs = D.map((m, i) => ({ m, i, el: fx.add(`<g>${thought(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 50, h: 40 })}</g>`) }));
    const hearts = D.map((m) => ({ m, el: fx.add(`<g>${stoneHeart(c, 13)}</g>`) }));
    const flames = D.map((m) => ({ m, el: fx.add(`<g>${tongue(c, 18)}</g>`) }));
    const orbF = fx.add(`<g><circle r="46" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 11, 16), 0.2, 3)}" fill="${C.star}"/></g>`);
    const doveF = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/>${dove(c)}</g>`);

    const along = (u) => wayPts[Math.min(wayPts.length - 1, Math.max(0, Math.round(u * (wayPts.length - 1))))];

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v5a — the way and the light beyond */
      const wk = es(t, 0.15, 0.7);
      way(wk, 0.9 - es(t, 5.6, 5.95) * 0.5);
      const lightUp = es(t, 0.35, 0.85, ease.out);
      vis(B.light, { x: RX, y: RY + 70 - lightUp * 110, s: 0.7 + lightUp * 0.3 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: lightUp });

      /* v5b — questions that are never asked */
      qs.forEach(({ m, el, i }) => {
        const k = bump(t, 1.1 + (i % 4) * 0.08, 1.85 + (i % 4) * 0.08);
        const [hx, hy] = [m.x + (m.flip ? -4 : 4) * m.s, m.y - 170 * m.s];
        vis(el, { x: hx, y: hy - k * 10, s: 0.4 + k * 0.5, o: k * 0.75 });
      });

      /* v6 — stone hearts */
      const sorrow = es(t, 2.1, 2.45) * (1 - es(t, 5.4, 5.8));
      hearts.forEach(({ m, el }, i) => {
        const k = es(t, 2.1 + (i % 5) * 0.05, 2.4 + (i % 5) * 0.05);
        vis(el, { x: m.x + (m.flip ? -6 : 6), y: m.y - 112 * m.s + k * 6, s: 0.6 + k * 0.4, o: k * (1 - es(t, 5.4, 5.8)) });
      });

      /* v7 — the light goes; the dove comes */
      const [hx0, hy0] = hand(JX, J.y, J.s, false, 70);
      const go1 = es(t, 3.2, 3.9);                    // along the path to the ridge
      const back = bump(t, 4.2, 4.9) * 0.25;          // lingers, even draws back a little
      const over = es(t, 5.05, 5.35);                 // goes over
      const u = go1 - back;
      const [ox, oy] = along(u);
      const onFront = go1 > 0.01 && over < 0.02;
      vis(orbF, { x: go1 < 0.02 ? hx0 : ox, y: (go1 < 0.02 ? hy0 : oy) - 14, s: 0.9 + (T ? Math.sin(T * 3) * 0.05 : 0), o: onFront ? 1 : es(t, 3.05, 3.2) * (1 - es(t, 3.2, 3.25)) });
      vis(B.orbB, { x: RX + over * 30, y: RY - 14 + over * 90, s: 0.9, o: over > 0.02 && over < 0.98 ? 1 : 0 });
      // the far, grey dove that cannot come yet
      const wait = es(t, 4.1, 4.4) * (1 - es(t, 5.0, 5.2));
      const rise = es(t, 5.25, 5.55);
      vis(B.doveB, { x: RX + 60, y: RY + 40 - wait * 60 - rise * 50, s: 0.8, sx: -1, o: Math.max(wait * 0.7, rise * (1 - es(t, 5.5, 5.56))) });
      if (wait > 0.01 || rise > 0.01) flapWings(B.doveB, t * 4, 20, 7);
      // the dove of light comes over and circles above them
      const come = es(t, 5.5, 5.9);
      const circ = seg(t, 5.8, 6.0);
      const dx = lerp(RX + 60, JX + Math.cos(circ * PI * 1.2) * 180, come), dy = lerp(RY - 100, 330 + Math.sin(circ * PI * 1.2) * 30, come);
      vis(doveF, { x: dx, y: dy, s: 0.8, sx: -1, o: come > 0.01 ? 1 : 0 });
      if (come > 0.01) flapWings(doveF, t * 6 + T, 28, 3);
      flames.forEach(({ m, el }, i) => {
        const d = Math.abs(m.x - JX);
        const k = es(t, 5.7 + d * 0.0005, 5.9 + d * 0.0005);
        const [lx, ly] = hand(m.x, m.y, m.s, m.flip, m.arm);
        vis(el, { x: lerp(dx, lx, k), y: lerp(dy, ly + 18, k), s: 0.6 + (1 - k) * 0.4, o: k > 0.02 && k < 0.98 ? 1 : 0 });
      });

      /* people */
      D.forEach((m) => {
        const d = Math.abs(m.x - JX);
        const lit = es(t, 5.85 + d * 0.0005, 5.95 + d * 0.0005);
        const look = es(t, 0.3, 0.7) * (1 - es(t, 1.05, 1.3)) + es(t, 3.2, 3.6) * (1 - es(t, 5.0, 5.3)) * 0.8 + es(t, 5.5, 5.8);
        lampK(m, 0.85 - sorrow * 0.35 + lit * 0.3, 0, T);
        fade(m.sad, Math.max(sorrow, bump(t, 1.1, 2.0) * 0.6) * (1 - lit));
        fade(m.tear, sorrow * (m.i % 3 === 0 ? 1 : 0) * (1 - es(t, 3.2, 3.6)));
        put(m, T, { head: sorrow * 14 + bump(t, 1.1, 1.9) * 6 - look * 10, armF: m.arm - sorrow * 14, lean: sorrow * (m.flip ? -2 : 2) });
      });
      const point = es(t, 0.1, 0.4) * (1 - es(t, 1.0, 1.3)) + es(t, 3.05, 3.3) * (1 - es(t, 4.0, 4.3));
      fade(J.sad, sorrow * 0.5 * (1 - es(t, 3.0, 3.3)));
      put(J, T, { armF: 20 + point * 60 + bump(t, 2.1, 2.9) * 20, armB: 10 + bump(t, 5.1, 5.9) * 100, head: -point * 8 + bump(t, 1.1, 1.9) * 6 });

      S.cam.x = kf(t, [[0, 0], [0.8, 30], [1.2, 0], [3, 0], [3.8, 40], [5.4, 40], [6, 0]]);
      S.cam.y = kf(t, [[0, 0], [0.8, -30], [1.2, 0], [2.4, 20], [3.2, -20], [5.5, -40], [6, -10]]);
      S.cam.z = kf(t, [[0, 1.02], [2.5, 1.1], [3.2, 1.02], [6, 1.04]]);
    };
  },
};
