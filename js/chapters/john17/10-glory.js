// J 17,22–23 — The Eleven have risen and stand round Him. "The glory You gave Me I have given them": small rings of
// gold light float out from His halo and settle over each of their heads. "That they may be one, as We are one":
// a garland of light links ring to ring, and a beam joins Him to the radiance above. "I in them and You in Me": a heart
// of light glows on His breast with the radiance's light within it, and from it a thread runs to a small heart
// kindled in each of them. "That they may be perfected into one": they step in close around Him, hands reaching to
// one another. "That the world may know that You sent Me": a broad light streams from the group across the valley to
// the dark city on its hill, and its windows wake one by one. "And that You loved them as You loved Me": a great heart
// of light comes down from above and holds Him and all of them together.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, fatherLight, lightHeart, heart, curves, spark, lower, vis, kf,
  pose, fade, sheet, mix, C, JX, JY, STAND, NIGHT, HOLY, PRAY, PI, lerp,
} from './lib.js';

const RY = 150;
const bigHeart = (c, r) => {
  const pts = [...c.arc(-r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI * 0.8, PI * 2, 24), ...c.arc(r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI, PI * 2.2, 24), [0, r * 0.95]];
  return `<path d="${c.poly(pts)}" fill="#ffe9b0" opacity=".16"/><path d="${c.poly(pts)}" fill="none" stroke="${C.halo}" stroke-width="7" stroke-linejoin="round" opacity=".9"/>`;
};

export default {
  id: 'j17-glory',
  beats: [
    { v: 22, text: 'I także chwałę, którą Mi dałeś, przekazałem im,' },
    { v: 22, cont: true, text: 'aby stanowili jedno, tak jak My jedno stanowimy.' },
    { v: 23, text: 'Ja w nich, a Ty we Mnie!' },
    { v: 23, cont: true, text: 'Oby się tak zespolili w jedno,' },
    { v: 23, cont: true, text: 'aby świat poznał, żeś Ty Mnie posłał' },
    { v: 23, cont: true, text: 'i żeś Ty ich umiłował tak, jak Mnie umiłowałeś.' },
  ],
  cam: { x: [-60, 20], y: [-70, 30], z: [0.94, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: HOLY });
    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);
    // the city's windows waking; the stream of light towards it
    const winL = S.layer({ par: 0.1, sh: 0, flat: true });
    const WINS = Array.from({ length: 16 }, () => [c.rr(252, 408), c.rr(330, 356)]);
    const wins = [0, 1, 2, 3].map((g) => winL.add(`<g><path d="${WINS.filter((_, i) => i % 4 === g).map(([x, y]) => c.poly(c.rect(x, y, 4, 5))).join('')}" fill="${C.lampFlame}"/>${WINS.filter((_, i) => i % 4 === g).map(([x, y]) => `<circle cx="${x + 2}" cy="${y + 2}" r="14" fill="url(#warm-glow)" opacity=".7"/>`).join('')}</g>`));
    const sg = S.id('stream');
    S.defs(`<linearGradient id="${sg}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3cf" stop-opacity=".5"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".05"/></linearGradient>`);
    const stream = winL.add(`<g><path d="M800 470Q560 330 330 300L330 380Q560 420 800 560Z" fill="url(#${sg})"/></g>`);

    const thL = S.layer({ par: 0.3, sh: 0, flat: true });
    const beam = thL.add(`<g><path d="M-10 0L10 0L22 1L-22 1Z" fill="#fff3cf" opacity=".55"/></g>`);
    const garland = curves(thL, 11, { color: C.halo, w: 2.2 });
    const love = curves(thL, 11, { color: C.jesusMantle, w: 1.8 });

    const hL = S.layer({ par: 0.32, sh: 2 });
    const bh = hL.add(`<g><circle r="360" fill="url(#halo-glow)" opacity=".5"/>${bigHeart(c, 360)}</g>`);

    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const D = eleven(S, peopleL, { pos: STAND, pose: 'stand', s: 0.82 });
    const J = jesusOn(S, peopleL);
    const fx = S.layer({ par: 0.42, sh: 3 });
    const rings = D.map(() => fx.add(`<g><ellipse rx="26" ry="18" fill="url(#halo-glow)"/><path d="${c.ribbon(c.arc(0, 0, 14, 4.5, 0, PI * 2, 24), 2.6)}" fill="${C.halo}"/></g>`));
    const jHeart = fx.add(`<g>${lightHeart(c, 18)}<circle r="5" fill="#fffdf4"/></g>`);
    const hearts = D.map(() => fx.add(`<g><circle r="24" fill="url(#halo-glow)"/>${heart(c, 8, C.jesusMantle)}</g>`));

    // where they stand when drawn together
    const close = (m) => [lerp(m.x, JX + (m.x - JX) * 0.72, 1), m.y + (m.y < 660 ? 6 : -4)];
    const JH = [JX + 2, JY - 176], JC = chestOf(J);
    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, r: T * 1.5, o: 1 });

      /* v23b — drawn together (positions used by everything below) */
      const tog = es(t, 3.05, 3.7);
      const walking = t > 3.05 && t < 3.7;
      D.forEach((m) => {
        const [cx, cy] = close(m);
        m.cx = lerp(m.x, cx, tog); m.cy = lerp(m.y, cy, tog);
        m.x0 = m.x0 ?? m.x; m.y0 = m.y0 ?? m.y;
      });
      const at = (m) => ({ ...m, x: m.cx, y: m.cy });

      /* v22a — glory given: rings float from His halo to each head */
      D.forEach((m, i) => {
        const [hx, hy] = headOf(at(m));
        const d = Math.abs(m.x0 - JX) / 400;
        const u = es(t, 0.1 + d * 0.3, 0.55 + d * 0.3);
        const x = lerp(JH[0], hx, u), y = lerp(JH[1] - 30, hy - 32 * m.s, u) - Math.sin(u * PI) * 80;
        vis(rings[i], { x, y: y + (T && u >= 1 ? Math.sin(T * 1.6 + i) * 1.5 : 0), s: 0.7 + u * 0.3, o: u > 0.01 ? 1 : 0 });
        m.ring = [x, y];
      });
      /* v22b — one: a garland from ring to ring; the beam */
      const order = D.slice().sort((a, b) => a.x0 - b.x0);
      order.forEach((m, i) => {
        const n = order[i + 1];
        if (!n) { garland(i, m.ring, m.ring, 0, 0, 0); return; }
        const k = es(t, 1.05 + i * 0.04, 1.35 + i * 0.04);
        garland(i, m.ring, n.ring, 22, k, 0.9 * (1 - es(t, 5.0, 5.4) * 0.5));
      });
      const bk = es(t, 1.1, 1.4);
      vis(beam, { x: JX, y: RY + 50, sy: Math.max(1, bk * (JY - 230 - RY)), o: bk * (1 - es(t, 2.9, 3.2) * 0.5) });

      /* v23a — I in them, You in Me: His heart of light, threads to theirs */
      const hk = es(t, 2.05, 2.35, ease.back);
      vis(jHeart, { x: JC[0] + 4, y: JC[1] + 6, s: hk, o: hk > 0.01 ? 1 : 0 });
      D.forEach((m, i) => {
        const [cx, cy] = chestOf(at(m));
        const d = Math.abs(m.x0 - JX) / 400;
        const k = es(t, 2.35 + d * 0.25, 2.7 + d * 0.25);
        love(i, [JC[0] + 4, JC[1] + 6], [cx, cy], -40, k, 0.8 * (1 - es(t, 5.1, 5.4) * 0.4));
        const hk2 = es(t, 2.6 + d * 0.25, 2.8 + d * 0.25, ease.back);
        vis(hearts[i], { x: cx + (m.flip ? -3 : 3), y: cy + 6, s: hk2 * m.s, o: hk2 > 0.01 ? 1 : 0 });
      });

      /* the Eleven */
      D.forEach((m, i) => {
        const reach = es(t, 3.5, 3.9);
        m.p.set({ x: m.cx, y: m.cy, s: m.s, flip: m.flip, walk: walking ? m.cx * 0.07 : undefined, armF: 14 + reach * 50 * (i % 2 ? 1 : 0.6), armB: 6 + reach * 40, head: -8 - bump(t, 0.1, 1.0) * 10 - bump(t, 4.1, 4.9) * 0 - es(t, 5.1, 5.5) * 12, blink: 0 });
        pose(m.lamp, { x: m.cx + (m.flip ? -1 : 1) * 36 * m.s, y: m.cy + 2, s: 0.9 });
        lampK(m, 0.85, bump(t, 4.05, 4.7) * 0.4);
      });

      /* v23c — the world may know: light streams to the city and its windows wake */
      const sk = es(t, 4.05, 4.45) * (1 - es(t, 5.2, 5.6) * 0.6);
      vis(stream, { x: 0, y: 0, o: sk });
      wins.forEach((w, g) => fade(w, es(t, 4.3 + g * 0.1, 4.45 + g * 0.1)));

      /* v23d — loved as He is loved: the great heart */
      const gk = es(t, 5.05, 5.5, ease.out);
      vis(bh, { x: JX, y: 440 - (1 - gk) * 300, s: 0.7 + gk * 0.3, o: gk });

      put(J, T, { head: PRAY.head + bump(t, 0.05, 0.9) * 20 + bump(t, 3.1, 3.9) * 22, armF: PRAY.armF + bump(t, 0.1, 0.9) * 10 + bump(t, 4.05, 4.9) * 20, armB: PRAY.armB });

      S.cam.x = kf(t, [[0, 0], [4, 0], [4.4, -50], [5, -40], [5.5, 0]]);
      S.cam.y = kf(t, [[0, -20], [1, -10], [2, 10], [3, 20], [4, 0], [5, -40], [6, -30]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.0], [2, 1.1], [3, 1.04], [4, 0.98], [5, 0.98], [6, 1.02]]);
    };
  },
};
