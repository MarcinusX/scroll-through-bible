// J 17,1–2 — the curtains open on a quiet moonlit slope above the Kidron: the Eleven rest on the ground around a flat
// rock, their lanterns set low; Jesus stands on the rock among them. He lifts His eyes to heaven and His arms rise:
// high above, a radiance opens (the Father — never a figure). "Father, the hour has come": an hourglass is lowered
// and its last sand runs out. "Glorify Your Son, that the Son may glorify You": a column of light comes down and
// surrounds Him with rays — and sparks of light rise from Him back up into the radiance. "By the authority You gave
// Him over every human being": a long chain of paper people of every colour is let down across the sky and His
// light runs along it. "To give eternal life to all whom You gave Him": sparks fly from Him to each of the Eleven,
// and a small flame of life kindles above every one of them.
import { curtains } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, fatherLight, beamGrad, beamPath, spark, smallFlame, dollChain,
  hourglassRig, glory, lower, arcAt, vis, kf, hand, pose, fade, C, JX, JY, NIGHT, HOLY,
} from './lib.js';

export default {
  id: 'j17-hour',
  beats: [
    { cover: true },
    { v: 1, text: 'To powiedział Jezus, a podniósłszy oczy ku niebu, rzekł:' },
    { v: 1, cont: true, text: '«Ojcze, nadeszła godzina.' },
    { v: 1, cont: true, text: 'Otocz swego Syna chwałą, aby Syn Ciebie nią otoczył' },
    { v: 2, text: 'i aby mocą władzy udzielonej Mu przez Ciebie nad każdym człowiekiem' },
    { v: 2, cont: true, text: 'dał życie wieczne wszystkim tym, których Mu dałeś.' },
  ],
  cam: { x: [-20, 20], y: [-80, 30], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: NIGHT });

    // the light above
    const hiL = S.layer({ par: 0.08, sh: 2 });
    const high = hiL.add(`<g>${fatherLight(c, 58)}</g>`);
    const RY = 150;
    // the chain of all people
    const chainL = S.layer({ par: 0.12, sh: 4 });
    const chain = chainL.add(`<g><path d="M-400 -1600V0M400 -1600V0" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${dollChain(c, 15, 58)}</g>`);
    const sweep = chainL.add(`<g><ellipse rx="70" ry="60" fill="url(#halo-glow)"/></g>`);
    // the beam
    const beamL = S.layer({ par: 0.3, sh: 0, flat: true });
    const bid = beamGrad(S);
    const beam = beamL.add(`<g>${beamPath(c, bid, 34, 130, JY - 60 - RY)}</g>`);
    const rays = beamL.add(`<g>${glory(c, 230, 24)}</g>`);
    // the hourglass
    const hgL = S.layer({ par: 0.3, sh: 4 });
    const hg = hourglassRig(hgL, c, 100);
    const hgStr = hgL.add(`<g><path d="M0 -1600V-50" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/></g>`);

    // the people
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);

    // sparks and flames of life
    const fx = S.layer({ par: 0.42, sh: 2 });
    const up = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${spark(5)}</g>`));
    const gift = D.map(() => fx.add(`<g>${spark(4.5)}</g>`));
    const flames = D.map(() => fx.add(`<g>${smallFlame(c, 20)}</g>`));
    const cur = curtains(S);

    const JC = chestOf(J);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      P.update(T);

      /* v1a — He lifts His eyes; the radiance opens above */
      const lift = es(t, 1.1, 1.6);
      const hk = es(t, 1.3, 1.85);
      const flare = bump(t, 3.55, 4.05);
      vis(high, { x: JX, y: RY - (1 - hk) * 60, s: (0.5 + hk * 0.5) * (1 + flare * 0.25), r: T * 1.5, o: hk });
      const warm = es(t, 1.3, 1.9) * 0.55 + es(t, 3.05, 3.5) * 0.3;
      P.sky.blend(NIGHT, HOLY, warm);

      /* v1b — the hour has come: the hourglass runs out */
      const hIn = es(t, 1.95, 2.3, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      const HX = 1010, HY = 300;
      vis(hg.el, { x: HX, y: HY - (1 - hIn) * 600, r: T ? Math.sin(T * 0.9) : 0, o: hIn > 0.01 ? 1 : 0 });
      vis(hgStr, { x: HX, y: HY - (1 - hIn) * 600, o: hIn > 0.01 ? 1 : 0 });
      const lvl = 0.3 - es(t, 2.2, 2.75) * 0.3;
      hg.set(Math.max(0.001, lvl), t > 2.2 && t < 2.78 ? 1 : 0);

      /* v1c — glory comes down on Him, and rises back to the Father */
      const b = es(t, 3.05, 3.4);
      vis(beam, { x: JX, y: RY + 40, sy: Math.max(0.02, b), o: b * (1 - es(t, 4.8, 5.1) * 0.6) });
      const g = es(t, 3.25, 3.6, ease.out);
      vis(rays, { x: JX, y: JY - 120, s: 0.25 + g * 0.5, r: T * 3, o: g * 0.6 * (1 - es(t, 4.9, 5.2) * 0.5) });
      up.forEach((el, i) => {
        const u = es(t, 3.45 + i * 0.07, 3.85 + i * 0.07);
        const [x, y] = arcAt([JX, JY - 170], [JX, RY + 30], (i - 2) * 50, u);
        vis(el, { x: x + (i - 2) * 10 * Math.sin(u * 3.14), y, s: 1 - u * 0.4, o: u > 0.01 && u < 0.99 ? 1 : 0 });
      });

      /* v2a — authority over every human being: the chain of people comes down, His light runs along it */
      const ch = es(t, 4.05, 4.45, ease.out) * (1 - es(t, 5.0, 5.35, ease.in));
      lower(chain, ch, JX, 300, { len: 700 });
      const sw = es(t, 4.35, 4.95);
      vis(sweep, { x: JX - 420 + sw * 840, y: 300, sx: 1.2, s: 1, o: bump(t, 4.35, 4.95) * ch });

      /* v2b — eternal life for those He was given */
      D.forEach((m, i) => {
        const [hx, hy] = headOf(m);
        const d = Math.abs(m.x - JX) / 400;
        const u = es(t, 5.05 + d * 0.15, 5.45 + d * 0.15);
        const [x, y] = arcAt(JC, [hx, hy - 30 * m.s], -90, u);
        vis(gift[i], { x, y, s: 1, o: u > 0.01 && u < 0.98 ? 1 : 0 });
        const f = es(t, 5.4 + d * 0.15, 5.6 + d * 0.15, ease.back);
        vis(flames[i], { x: hx, y: hy - 30 * m.s + (T ? Math.sin(T * 2 + i) * 1.5 : 0), s: f, o: f > 0.01 ? 1 : 0 });
        const look = es(t, 1.2, 1.7) * 0.6 + es(t, 5.3, 5.7) * 0.4;
        put(m, T, { head: -8 - look * 10, armF: 14 + es(t, 5.4 + d * 0.15, 5.7 + d * 0.15) * 30 });
        lampK(m, 0.85);
      });

      /* Jesus */
      const open = es(t, 4.05, 4.4) * (1 - es(t, 4.95, 5.1));
      const give = es(t, 5.0, 5.3);
      put(J, T, {
        head: 6 - lift * 34 + give * 16,
        armB: 8 + lift * 100 - give * 40 + open * 20,
        armF: 12 + lift * 62 + open * 20 - give * 0,
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 20], [1, 20], [1.8, -40], [3, -50], [4, -70], [5, -20], [6, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.08], [3, 1.06], [4, 0.98], [5, 1.04], [6, 1.08]]);
    };
  },
};
