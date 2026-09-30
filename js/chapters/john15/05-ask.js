// J 15,7–8 — "If you abide in Me and My words abide in you": the sap glows in the vine while little lit word-slips
// fly from Jesus to every disciple and settle in their hearts as a warm light. "Ask whatever you wish, and it will be
// done for you": they lift their hands; small lights rise from each one up to the Father's light, and come back down
// into their open hands. "By this My Father is glorified, that you bear much fruit": the light above opens into a
// glory of rays over the whole vine, heavy with grapes. "And so you will be My disciples": the eleven draw in close
// round Him, lanterns lifted.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, lampK, radiance, rayBurst, lightCone, heartLight, sparkle, headOf,
  vis, kf, pose, lerp, blinkAt, sheet, C, P, PI, LAMP_A,
} from './lib.js';

export default {
  id: 'j15-ask',
  beats: [
    { v: 7, text: 'Jeżeli we Mnie trwać będziecie, a słowa moje w was,' },
    { v: 7, cont: true, text: 'poproście, o cokolwiek chcecie, a to wam się spełni.' },
    { v: 8, text: 'Ojciec mój przez to dozna chwały, że owoc obfity przyniesiecie' },
    { v: 8, cont: true, text: 'i staniecie się moimi uczniami.' },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.25] },
  build(S) {
    const c = S.c;
    // the Father's light above, with its glory (behind the vine)
    const tb = tableau(S, { beadsN: 1, before: () => {
      const upL = S.layer({ par: 0.1, sh: 0, flat: true });
      return {
        glory: upL.add(`<g>${rayBurst(c, { n: 26, r0: 80, r1: S.portrait ? 1500 : 900, spread: 0.045, o: 0.34 })}</g>`),
        cone: upL.add(`<g>${lightCone(c, { w0: 70, w1: 460, h: 760, o: 0.16 })}</g>`),
        rad: upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 60)}</g>`),
      };
    } });
    const { vine, ms, jesus, JX, JY } = tb;
    const { glory, cone, rad } = tb.pre;
    const fx = S.layer({ par: P, sh: 3 });
    const slip = () => sheet().p(c.cut([[-11, -5], [11, -6], [12, 5], [-11, 6]], 0.4, 5), C.cream).x(c.ribbon([[-7, 0], [-1, 0]], 1.3) + c.ribbon([[2, 0], [7, 0]], 1.3), C.inkSoft, 'opacity=".5"').out();
    const words = ms.map(() => fx.add(`<g><circle r="16" fill="url(#warm-glow)" opacity=".8"/>${slip()}</g>`));
    const hearts = ms.map(() => fx.add(`<g>${heartLight(c, 8, C.halo)}</g>`));
    const ups = ms.map(() => fx.add(`<g><circle r="18" fill="url(#warm-glow)"/><circle r="4" fill="${C.star}"/></g>`));
    const gifts = ms.map(() => fx.add(`<g><circle r="22" fill="url(#halo-glow)"/>${sparkle(c, 12)}</g>`));
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.update(T);
      vine.set({ grow: 1, sap: 1, fruit: 1.05 + es(t, 2.1, 2.5) * 0.12, ripe: 1, glow: 0.8 + es(t, 2.1, 2.5) * 0.2, T });
      tb.beads(T, es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1)) + es(t, 2.1, 2.3) * 0.6);
      /* the Father's light: present in v7b (prayers go up to it) and opening into glory in v8a */
      const fa = es(t, 1.05, 1.35) ;
      vis(rad, { x: 800, y: lerp(-160, 128, es(t, 1.05, 1.35, ease.out)), s: 1 + es(t, 2.1, 2.5) * 0.25 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: fa });
      vis(cone, { x: 800, y: 128, o: fa * (0.6 + es(t, 2.1, 2.5) * 0.4) });
      vis(glory, { x: 800, y: 128, r: T ? T * 2 : 0, s: 0.4 + es(t, 2.05, 2.6) * 0.6, o: es(t, 2.05, 2.5) * (1 - es(t, 3.4, 3.8) * 0.4) });
      /* v8b — the eleven draw in round Him */
      const draw = es(t, 3.05, 3.6);
      jesus.set({ x: JX, y: JY, s: 1.05, armF: bump(t, 0.05, 0.9) * 60 + bump(t, 1.05, 1.95) * 50 + draw * 60, armB: bump(t, 1.05, 1.95) * 130 + bump(t, 2.05, 2.95) * 150 + draw * 70, head: -bump(t, 2.05, 2.95) * 12, blink: blinkAt(T, 1) });
      ms.forEach((m, i) => {
        const [hx0, hy0] = headOf(m);
        const cx = m.x + (m.flip ? -4 : 4) * m.s, cy = m.y - 104 * m.s;
        /* v7a — a word flies from Him into each heart */
        const w = es(t, 0.1 + i * 0.04, 0.5 + i * 0.04);
        vis(words[i], { x: lerp(JX + 4, cx, w), y: lerp(JY - 190, cy, w) - Math.sin(w * PI) * 70, r: (1 - w) * 30, s: 1 - w * 0.4, o: w > 0 && w < 1 ? 1 : 0 });
        const h = es(t, 0.45 + i * 0.04, 0.6 + i * 0.04, ease.back);
        /* v7b — hands lift, a light rises to the Father and a gift comes back down */
        const pray = es(t, 1.05 + (i % 3) * 0.04, 1.25 + (i % 3) * 0.04) * (1 - es(t, 2.0, 2.2));
        const up = seg(t, 1.2 + i * 0.02, 1.55 + i * 0.02);
        const down = seg(t, 1.55 + i * 0.02, 1.85 + i * 0.02);
        const [hx, hy] = [m.x + (m.flip ? -30 : 30) * m.s, m.y - 150 * m.s];
        vis(ups[i], { x: lerp(hx, 800 + (hx - 800) * 0.15, ease.io(up)), y: lerp(hy, 150, ease.io(up)), s: 1 - up * 0.4, o: up > 0 && up < 1 ? 1 : 0 });
        vis(gifts[i], { x: lerp(800 + (hx - 800) * 0.15, hx, ease.io(down)), y: lerp(150, hy - 8, ease.io(down)), r: T * 30, s: 0.6 + down * 0.4, o: down > 0 ? (1 - es(t, 2.2, 2.5)) : 0 });
        vis(hearts[i], { x: cx, y: cy, s: 0.6 + h * 0.5, o: h * (1 - es(t, 2.9, 3.1) * 0.6) });
        /* v8b — draw in */
        const tx = lerp(m.x, 800 + (m.x - 800) * 0.8, draw);
        const lampUp = es(t, 3.3, 3.6);
        placeM(m, T, { x: tx, walk: draw > 0 && draw < 1 ? draw * 12 + i : undefined, head: -es(t, 1.05, 1.3) * 14 * (1 - es(t, 2.9, 3.1)) - bump(t, 2.05, 2.95) * 6,
          armF: pray * (m.lampU ? 95 : 70) + bump(t, 2.1, 2.9) * 30, armB: m.lampU ? LAMP_A + lampUp * 70 : pray * 150 });
      });
      lampsAll(ms, 0.75 + es(t, 3.2, 3.6) * 0.25);
      S.cam.y = kf(t, [[0, 0], [1, 0], [1.4, -70], [2, -70], [2.5, -90], [3, -60], [3.6, 10], [4, 10]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.1], [1.4, 1.0], [2.5, 0.97], [3.1, 1.02], [3.7, 1.14], [4, 1.14]]);
    };
  },
};
