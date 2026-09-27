// J 17,17–19 — "Sanctify them in the truth": a soft rain of light falls from the radiance over the Eleven and a pale
// glow wakes around each of them. "Your word is truth": a great scroll unrolls on its strings with the words written
// on it, and every lantern brightens. "As You sent Me into the world": a paper globe is lowered; a star comes down
// a ray from the radiance and settles on it at Jerusalem. "So I have sent them into the world": roads of light run
// out from that star over the globe to its edges, and eleven small lights travel along them. "For their sakes I
// consecrate Myself": the globe is drawn up; behind Him, faint and tall, a cross of pale light stands on the slope,
// and He bows His head with open hands. "That they too may be sanctified in truth": the light flows from Him to each
// of them, and their flames shine white-gold.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, lifeFlames, fatherLight, globe, spark, scrollOpen, lightPath,
  drawPath, lineD, curves, arcAt, arcPts, lower, vis, kf, pose, fade, tr, sheet, mix, C, JX, JY, NIGHT, HOLY, PRAY, PI, lerp, FONT,
} from './lib.js';

const RY = 150;
const GW = [1030, 330], GR = 100;
const JER = [GW[0] - 12, GW[1] - 22];
const ROADS = Array.from({ length: 11 }, (_, i) => { const a = -PI / 2 + (i / 11) * PI * 2 + 0.2; return [GW[0] + Math.cos(a) * GR * 0.96, GW[1] + Math.sin(a) * GR * 0.96, a]; });

export default {
  id: 'j17-truth',
  beats: [
    { v: 17, text: 'Uświęć ich w prawdzie.' },
    { v: 17, cont: true, text: 'Słowo Twoje jest prawdą.' },
    { v: 18, text: 'Jak Ty Mnie posłałeś na świat,' },
    { v: 18, cont: true, text: 'tak i Ja ich na świat posłałem.' },
    { v: 19, text: 'A za nich Ja poświęcam w ofierze samego siebie,' },
    { v: 19, cont: true, text: 'aby i oni byli uświęceni w prawdzie.' },
  ],
  cam: { x: [-20, 20], y: [-70, 30], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: HOLY });
    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);

    // the cross of light on the slope behind Him
    const crossL = S.layer({ par: 0.3, sh: 0, flat: true });
    const cg = S.id('cross');
    S.defs(`<linearGradient id="${cg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".7"/><stop offset="1" stop-color="#fff6dc" stop-opacity=".05"/></linearGradient>`);
    const cross = crossL.add(`<g><circle cy="-330" r="160" fill="url(#halo-glow)" opacity=".7"/><path d="M-11 0L-9 -420L9 -420L11 0Z" fill="url(#${cg})"/><path d="M-110 -318L110 -322L110 -300L-110 -298Z" fill="url(#${cg})"/></g>`);

    // the rain of light
    const rainL = S.layer({ par: 0.32, sh: 0, flat: true, pad: 400 });
    let drops = '';
    for (let i = 0; i < 90; i++) { const x = c.rr(380, 1220), y = c.rr(-200, 560), l = c.rr(10, 22); drops += c.ribbon([[x, y], [x, y + l]], 1.6) + c.poly(c.circ(x, y + l + 2, 2.2, 6)); }
    rainL.add(`<path d="${drops}" fill="${C.star}" opacity=".7"/>`);

    // the scroll, the globe, the roads
    const hangL = S.layer({ par: 0.2, sh: 4 });
    const lines = tr(['Słowo Twoje', 'jest prawdą'], ['Your word', 'is truth']);
    const scroll = hangL.add(`<g><path d="M-120 -1600V-80M120 -1600V-80" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/><circle r="220" fill="url(#halo-glow)" opacity=".7"/><g transform="scale(3.1 2.4)">${scrollOpen(c, 96, 60)}</g><rect x="-126" y="-58" width="252" height="116" fill="${C.parchment}"/>${lines.map((l, i) => `<text x="0" y="${-8 + i * 40}" text-anchor="middle" font-family="${FONT}" font-size="34" font-style="italic" fill="${C.ink}">${l}</text>`).join('')}</g>`);
    const world = hangL.add(`<g><path d="M0 -1600V-${GR}" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${globe(c, GR)}</g>`);
    const roadsL = S.layer({ par: 0.2, sh: 0, flat: true });
    const roadEls = ROADS.map(([x, y]) => roadsL.add(`<g>${lightPath(lineD(arcPts([0, 0], [x - JER[0], y - JER[1]], 18, 14)), { w: 3.4, col: C.halo })}</g>`));
    const roadPs = roadEls.map((e) => e.firstElementChild);
    const travellers = ROADS.map(() => roadsL.add(`<g>${spark(3.2)}</g>`));
    const jerStar = roadsL.add(`<g><circle r="30" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 11, 4, 5))}" fill="${C.star}"/></g>`);
    const ray = roadsL.add(`<g><path d="M-2 0L2 0L6 1L-6 1Z" fill="#fff3cf" opacity=".6"/></g>`);

    const glowL = S.layer({ par: 0.38, sh: 0, flat: true });
    const glows = Array.from({ length: 11 }, () => glowL.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`));
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);
    const fx = S.layer({ par: 0.42, sh: 3 });
    const flames = lifeFlames(S, fx, D, 16);
    const flow = curves(fx, 11, { color: '#fff3cf', w: 2.4 });

    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, r: T * 1.5, s: 1 + bump(t, 0.1, 0.9) * 0.1, o: 1 });

      /* v17a — the rain of light, a glow round each */
      const rk = bump(t, 0.05, 1.3);
      rainL.fade(rk);
      rainL.shift(0, (T ? (T * 60) % 200 : 0) + t * 120 - 100);
      /* v17b — the scroll of truth */
      lower(scroll, es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in)), JX, 300, { len: 700, s: 0.9, r: T ? Math.sin(T * 0.6) * 0.8 : 0 });

      /* v18a — sent into the world: the globe, the star coming down to it */
      const gk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 4.0, 4.3, ease.in));
      lower(world, gk, GW[0], GW[1], { len: 700 });
      const off = (1 - gk) * 700;
      const sd = es(t, 2.35, 2.75);
      const [sx, sy] = [lerp(JX, JER[0], sd), lerp(RY + 40, JER[1], sd)];
      vis(jerStar, { x: sx, y: sy - off, r: T * 10, s: 0.8 + sd * 0.3, o: sd > 0.01 && gk > 0.01 ? 1 : 0 });
      const rdx = JER[0] - JX, rdy = JER[1] - RY - 40;
      vis(ray, { x: JX, y: RY + 40, r: (-Math.atan2(rdx, rdy) * 180) / PI, sy: Math.max(1, Math.hypot(rdx, rdy) * es(t, 2.1, 2.4)), sx: 2, o: gk * (1 - es(t, 3.0, 3.3)) * es(t, 2.1, 2.3) });
      /* v18b — roads out from the star; eleven lights along them */
      ROADS.forEach(([x, y], i) => {
        const k = es(t, 3.05 + (i % 4) * 0.05, 3.5 + (i % 4) * 0.05);
        vis(roadEls[i], { x: JER[0], y: JER[1] - off, o: gk > 0.01 && k > 0.001 ? 1 : 0 });
        drawPath(roadPs[i], k);
        const [tx, ty] = arcAt(JER, [x, y], 18, k);
        vis(travellers[i], { x: tx, y: ty - off, o: k > 0.02 && gk > 0.01 ? 1 : 0 });
      });

      /* v19a — He consecrates Himself: the cross of light, He bows */
      const ck = es(t, 4.1, 4.6);
      vis(cross, { x: JX, y: JY - 10, sy: 0.3 + ck * 0.7, o: ck * (1 - es(t, 5.6, 6) * 0.3) });

      /* v19b — sanctified in truth: light flows from Him to them */
      D.forEach((m, i) => {
        const [cx, cy] = chestOf(m);
        const d = Math.abs(m.x - JX) / 400;
        const g = Math.max(es(t, 0.3 + d * 0.3, 0.8 + d * 0.3) * (1 - es(t, 1.8, 2.2) * 0.7), es(t, 5.3 + d * 0.2, 5.6 + d * 0.2));
        vis(glows[i], { x: cx, y: cy, s: m.s * (0.8 + g * 0.3), o: g });
        flow(i, [JX, JY - 120], [cx, cy], -70, es(t, 5.05 + d * 0.2, 5.4 + d * 0.2), 0.85);
        lampK(m, 0.8 + bump(t, 1.2, 2.0) * 0.2, bump(t, 1.2, 2.0) * 0.8 + es(t, 5.3 + d * 0.2, 5.6 + d * 0.2) * 0.4);
        put(m, T, { head: -8 - bump(t, 0.1, 1.2) * 10 - bump(t, 2.1, 3.9) * 16, armF: 14 + es(t, 5.4, 5.8) * 20 });
      });
      flames(1, T, { boost: es(t, 5.3, 5.8) * 0.5 });

      const bow = es(t, 4.1, 4.5) * (1 - es(t, 5.1, 5.4));
      put(J, T, {
        head: PRAY.head + bow * 44,
        armF: PRAY.armF - bow * 30 + es(t, 5.1, 5.4) * 0,
        armB: PRAY.armB - bow * 60,
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -40], [1, -30], [2, -40], [3, -50], [4, -30], [5, 0], [6, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.0], [3, 1.06], [4, 1.02], [5, 1.0], [6, 1.08]]);
    };
  },
};
