// J 19,40–42 — the garden at dusk. Joseph and Nicodemus carry Him in on a litter, wrapped in white; bands of
// linen are wound round with the spices (fragrance rising) as was the burial custom, and they bow their heads.
// "In the place where He was crucified there was a garden": far off stands the hill with its empty crosses, and
// around them flowers open in the grass — hope is already hidden in the garden. The new tomb in the rock, where
// no one had yet been laid, glows faintly. Because of the Preparation, and the tomb being near, they lay Jesus
// there; the great stone rolls across the door, night falls, and a single evening star comes out above it.
import { C, blinkAt, pose, lerp, sky, sheet, mix, shade } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { gardenSet, DOOR, STONE, nicodemus, litter, shroud, spiceJar, scent, nameTag, skullHill, crossSil, stars, hanging, swing, person, LOOK, tr, J19, PI } from './lib.js';

const PATH = [[-520, 810], [-120, 780], [260, 748], [620, 728], [900, 714], [1080, 700], [1150, 694]];
const pathY = (x) => { for (let i = 1; i < PATH.length; i++) if (x <= PATH[i][0]) { const [x0, y0] = PATH[i - 1], [x1, y1] = PATH[i]; return lerp(y0, y1, (x - x0) / (x1 - x0)); } return PATH[PATH.length - 1][1]; };
const pS = (y) => 0.8 + ((y - 694) / 116) * 0.24;

export default {
  id: 'j19-garden',
  beats: [
    { v: 40, text: 'Zabrali więc ciało Jezusa i obwiązali je w płótna razem z wonnościami,' },
    { v: 40, cont: true, text: 'stosownie do żydowskiego sposobu grzebania.' },
    { v: 41, text: 'A na miejscu, gdzie Go ukrzyżowano, był ogród,' },
    { v: 41, cont: true, text: 'w ogrodzie zaś nowy grób, w którym jeszcze nie złożono nikogo.' },
    { v: 42 },
  ],
  cam: { x: [-80, 400], y: [-40, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the bearers rest nearer the tomb and the camera goes further right, so the tomb, its stone and the star are in view
    const ph = S.portrait;
    const RX = ph ? 780 : 700;
    const sk = sky(S, J19.eve);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 360, n: 50 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const eve = hangL.add(`<g><circle r="70" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 18, 4, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(0, 0, 9, 3, 4, PI / 4))}" fill="${C.star}"/></g>`);
    /* far off: the hill with its empty crosses */
    const hillL = S.layer({ par: 0.06, sh: 2 });
    const hc = mix(C.rock2, C.duskViolet, 0.4);
    hillL.add(`<g transform="translate(640 420)">${skullHill(c, { w: 360, h: 120, col: hc })}</g><g transform="translate(640 422)">${crossSil(c, { h: 100, figure: false, col: mix(C.ink, C.duskViolet, 0.3) })}</g><g transform="translate(588 432)">${crossSil(c, { h: 80, figure: false, col: mix(C.ink, C.duskViolet, 0.3) })}</g><g transform="translate(692 432)">${crossSil(c, { h: 80, figure: false, col: mix(C.ink, C.duskViolet, 0.3) })}</g>`);
    const G = gardenSet(S, { tint: 0.3 });
    /* flowers that open in the grass */
    const flL = S.layer({ par: 0.5, sh: 2 });
    const blooms = Array.from({ length: 16 }, (_, i) => {
      const x = 360 + i * 44 + c.rr(-14, 14), y = pathY(x) + c.rr(24, 70) * (i % 2 ? 1 : -0.6);
      const col = [C.jesusMantle, C.lavender, C.cream, C.wheat, C.roseRobe][i % 5];
      const s = sheet().p(c.ribbon([[0, 0], [c.rr(-3, 3), -22]], 1.6), C.moss).p(c.cut(c.star(0, -24, 7, 3, 5, c.rr(0, 6)), 0.2, 3), col).x(c.poly(c.circ(0, -24, 2, 6)), C.sun);
      return { x, y, i, el: flL.add(`<g>${s.out()}</g>`) };
    });
    /* Joseph and Nicodemus with the litter */
    const W = G.walkL;
    const jars = [0, 1].map((i) => W.add(`<g>${spiceJar(c, C.cream, [C.clay, C.ochre][i])}</g>`));
    const nico = S.puppet(W.add(nicodemus(c)));
    const lit = W.add(`<g>${litter(c, 190)}<g transform="translate(0 -12)">${shroud(c, 150)}</g><g class="bands" opacity="0">${[-50, -24, 2, 28, 52].map((x) => `<path d="${c.ribbon([[x - 3, -30], [x + 5, -4]], 3.4)}" fill="${C.linen2}"/>`).join('')}</g></g>`);
    const bands = lit.querySelector('.bands');
    const jos = S.puppet(W.add(person(c, LOOK.joseph)));
    const curls = [0, 1, 2].map((i) => W.add(`<g>${scent(c, 70)}</g>`));
    const tagL = S.layer({ par: 0.4, sh: 5 });
    const newTag = hanging(tagL, nameTag(c, tr('nowy grób', 'a new tomb'), { size: 18 }), { x: 0, y: 0, len: 900 });
    const night = S.layer({ par: 0.6, sh: 1, flat: true });
    night.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d2349"/>`);

    return (t, time) => {
      const T = time;
      const dark = es(t, 4.05, 4.65);
      sk.blend(J19.eve, J19.night, es(t, 0, 4) * 0.35 + dark * 0.65);
      starL.fade(es(t, 3.0, 4.8));
      night.fade(dark * 0.3);
      const ek = es(t, 4.4, 4.7);
      pose(eve, { x: ph ? 1000 : 1110, y: lerp(-300, 235, ek), s: 0.7 + ek * 0.3 + Math.sin(T * 1.4) * 0.03, o: ek > 0.01 ? 1 : 0 });

      /* the litter: in along the path, the linen and spices, then into the tomb */
      const bx = t < 4 ? lerp(-260, RX, es(t, -0.3, 0.7)) : lerp(RX, 1110, es(t, 4.02, 4.3));
      const by = pathY(bx), s = pS(by);
      const moving = (t > -0.3 && t < 0.7) || (t > 4.02 && t < 4.3);
      const bow = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const inside = es(t, 4.25, 4.42);
      const jxp = bx + 104 * s, nxp = bx - 104 * s;
      const carry = 1 - es(t, 4.28, 4.42);
      jos.set({ x: jxp + inside * 70, y: pathY(jxp) + 2, s, walk: moving ? jxp * 0.05 : undefined, amt: 0.6, armF: 60 * carry + 10, armB: 50 * carry + 10, head: 4 + bow * 14, lean: bow * 6, blink: blinkAt(T, 2), flip: inside > 0.5 });
      nico.set({ x: nxp, y: pathY(nxp) + 4, s: s * 1.02, walk: moving ? nxp * 0.05 : undefined, amt: 0.6, armF: 60 * carry + 10, armB: 50 * carry + 10, head: 4 + bow * 14, lean: bow * 6, blink: blinkAt(T, 3) });
      pose(lit, { x: bx, y: by - 92 * s + (1 - carry) * 40, s, o: 1 - inside });
      fade(bands, es(t, 0.3, 0.8));
      jars.forEach((j, i) => pose(j, { x: RX - 60 + i * 26, y: pathY(RX - 60) + 18 + i * 4, s: 1.2, o: es(t, 0.3, 0.5) * (1 - es(t, 4.0, 4.3)) }));
      curls.forEach((cu, i) => {
        const k = ((T * 0.25 + i / 3) % 1);
        pose(cu, { x: bx - 40 + i * 40 + Math.sin(T + i) * 4, y: by - 110 * s - k * 40, s: 0.8 + k * 0.3, o: es(t, 0.4, 0.7) * (1 - es(t, 3.9, 4.2)) * Math.sin(k * PI) * 0.9 });
      });

      /* v41a — the garden: flowers open */
      blooms.forEach((b) => { const k = es(t, 2.05 + b.i * 0.03, 2.4 + b.i * 0.03, ease.back); pose(b.el, { x: b.x, y: b.y, s: k * 1.1, o: k > 0.02 ? 1 : 0 }); });
      /* v41b — a new tomb, where no one had yet been laid */
      const nk = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.15));
      swing(newTag, DOOR.x - (ph ? 70 : 0), 300 - (1 - nk) * 700, T, 1.1, 0.9, 2);
      const glowK = es(t, 3.05, 3.4) * (1 - es(t, 4.6, 4.8) * 0.6);
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: glowK * 0.5 });
      /* v42 — laid there; the stone rolls across */
      const roll = es(t, 4.35, 4.65);
      const sx = lerp(STONE.x, DOOR.x, roll);
      pose(G.stone, { x: sx, y: DOOR.y - STONE.r + 2, r: -((STONE.x - sx) / STONE.r) * (180 / PI) });

      S.cam.x = lerp(-60, 0, es(t, -0.3, 0.8)) + es(t, 2.9, 3.4) * (ph ? 330 : 120) + es(t, 4.0, 4.4) * (ph ? 60 : 20);
      S.cam.y = -10 - es(t, 1.9, 2.4) * 20 * (1 - es(t, 2.9, 3.3)) - es(t, 4.3, 4.7) * 20;
      S.cam.z = 1.03 + es(t, 1.9, 2.4) * 0.03 * (1 - es(t, 2.9, 3.3)) + es(t, 4.35, 4.7) * 0.05;
    };
  },
};
