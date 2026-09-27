// J 21,5–6 — Across the water at dawn the Man on the shore calls: "Children, have you anything to eat?" (rings of His
// voice go out over the lake; an empty bowl in His bubble). "No" — they shake their heads and hold up the empty net.
// He points: "Cast the net on the right side of the boat" — a patch of light wakes on the water beside the boat.
// They cast: the net opens like a wheel and falls into the light. And the water boils with silver: fish leap all
// round it, the net sags heavy, the boat heels over, they haul and strain — and cannot draw it in.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  dawnSet, SHORE, DAWN, SUNRISE, castNet, emptyNet, fullNet, silverFish, splashCrown, waterPatch, speech, GLYPH, sparkle,
  skyKeys, kf, headAt, hand, vis, pose, fade, attr, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const BX = SHORE.bx, BY = SHORE.by, BS = SHORE.bs;
const SPOT = [990, 690];               // the lit water on the boat's right side (the near side)

function bowlEmpty(c) {
  return sheet().p(c.cut([[-18, -10], [18, -10], [12, 4], [-12, 4]], 0.3, 4), C.pot).x(c.ribbon([[-14, -6], [14, -6]], 1.4), shade(C.pot, 0.25), 'opacity=".6"').out();
}

export default {
  id: 'j21-children',
  beats: [
    { v: 5, text: 'A Jezus rzekł do nich: «Dzieci, czy macie co na posiłek?»' },
    { v: 5, cont: true, text: 'Odpowiedzieli Mu: «Nie».' },
    { v: 6, text: 'On rzekł do nich: «Zarzućcie sieć po prawej stronie łodzi, a znajdziecie».' },
    { v: 6, cont: true, text: 'Zarzucili więc' },
    { v: 6, cont: true, text: 'i z powodu mnóstwa ryb nie mogli jej wyciągnąć.' },
  ],
  cam: { x: [0, 180], y: [0, 80], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    const D = dawnSet(S, { sunY: 400 });
    const { K, B, jesus, jGlow, fx } = D;

    /* the lit water, the net (empty / thrown / full), the leaping fish */
    const waterFx = D.boatL;
    const spot = waterFx.add(`<g><ellipse rx="120" ry="26" fill="url(#halo-glow)"/><ellipse rx="70" ry="12" fill="${C.halo}" opacity=".35"/></g>`);
    const glints = [0, 1, 2, 3].map(() => waterFx.add(`<g>${sparkle(c, 9)}</g>`));
    const empty = waterFx.add(`<g>${emptyNet(c, { w: 120, h: 96, col: C.rope })}</g>`);
    const thrown = waterFx.add(`<g>${castNet(c, 70, mix(C.rope, C.linen, 0.3))}</g>`);
    const rings = [0, 1, 2].map(() => waterFx.add(`<path d="${c.ribbon(c.arc(0, 0, 40, 9, 0, PI * 2, 24), 2)}" fill="${C.foam}"/>`));
    const full = waterFx.add(`<g>${fullNet(c, { w: 270, h: 110, n: 40 })}</g>`);
    const cover = waterFx.add(`<g>${waterPatch(c, 340, mix(C.lake2, C.lake, 0.4))}</g>`);
    const rope = waterFx.add(`<path d="M0 0H1" stroke="${C.rope}" stroke-width="3" vector-effect="non-scaling-stroke" fill="none"/>`);
    const leap = Array.from({ length: 12 }, (_, i) => ({ i, a: c.rr(0, 1), dx: c.rr(-150, 150), h: c.rr(50, 120), el: waterFx.add(`<g>${silverFish(c, i, 0.9)}</g>`) }));
    const splashes = [0, 1, 2].map(() => waterFx.add(`<g>${splashCrown(c, 18, 0)}</g>`));

    /* the voice and the words */
    const vr = [0, 1, 2].map(() => fx.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 30, -0.7, 0.7, 10), 3)}" fill="${shade(C.ochre, 0.25)}"/>`));
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-10 4)">${bowlEmpty(c)}</g><g transform="translate(16 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 84, h: 54 })}</g>`);
    const no = fx.add(`<g>${speech(c, `<text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-size="26" font-style="italic" fill="${C.ink}">${tr('Nie', 'No')}</text>`, { w: 70, h: 46, flip: true })}</g>`);
    const point = fx.add(`<g>${speech(c, `<g transform="translate(-8 2) scale(.8)">${castNet(c, 22, C.rope)}</g><path d="${c.ribbon([[14, 2], [30, 2]], 2.6)}" fill="${C.terracotta}"/><path d="${c.poly([[29, -5], [38, 2], [29, 9]])}" fill="${C.terracotta}"/>`, { w: 90, h: 52 })}</g>`);
    const strain = [0, 1].map(() => fx.add(`<g>${GLYPH.bang(c)}</g>`));

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, DAWN], [5, SUNRISE]]);
      K.idle(T, { sunY: lerp(400, 330, es(t, 0, 5)) });
      pose(K.sunPath, { x: 1250, y: 440, o: 0.8 });
      if (D.mistL) { D.mistL.fade(0.9 - es(t, 0, 2) * 0.5); D.mistL.shift(30 + Math.sin(T * 0.2) * 30, 0); }

      /* the boat heels as the full net pulls */
      const heavy = es(t, 4.1, 4.5);
      const rockA = Math.sin(T * 1.1) * 1.2 + heavy * (6 + Math.sin(T * 3) * 1.5);
      const B0 = { x: BX, y: BY + Math.sin(T * 1.3) * 2 + heavy * 6, s: BS, flip: true };
      B.set({ ...B0, r: -rockA });

      /* crew */
      const shake = bump(t, 1.05, 1.6);
      const hold = es(t, 1.1, 1.3) * (1 - es(t, 1.9, 2.05));
      const cast = es(t, 3.05, 3.3);
      const haul = heavy;
      B.crew.forEach((m) => {
        if (!m.p) return;
        const netMan = m.k === 'other2' || m.k === 'other1';
        const caster = m.k === 'thomas' || m.k === 'nathanael' || m.k === 'james';
        const look = es(t, 0.1, 0.4);
        const sw = T ? Math.sin(T * 9 + m.i) * 8 * shake : 0;
        m.p.set({
          x: m.x, y: 18, s: 0.8, flip: false,
          armF: 20 + (netMan ? hold * 100 : 0) + (caster ? bump(t, 3.0, 3.4) * 110 : 0) + haul * (caster || netMan ? 70 : 20),
          armB: 10 + (netMan ? hold * 80 : 0) + (caster ? bump(t, 3.0, 3.4) * 60 : 0) + haul * (caster || netMan ? 50 : 10),
          lean: -haul * (caster || netMan ? 12 : 4) + (T ? Math.sin(T * 5 + m.i) * haul * 2 : 0), head: -look * 4 + sw - haul * 6, blink: blinkAt(T, m.seed),
        });
        fade(m.sad, 0.6 * (1 - es(t, 2.2, 2.6)));
      });
      // the empty net held up for "No"
      const enx = BX - (-143) * BS, eny = BY - 150 * BS;
      vis(empty, { x: enx, y: eny, s: BS, r: T ? Math.sin(T * 1.5) * 3 : 0, o: hold });

      /* Jesus on the shore */
      const call = es(t, 0.05, 0.25) * (1 - es(t, 0.95, 1.1));
      const pt = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.2));
      jesus.set({ x: SHORE.jx, y: SHORE.jy, s: 1.02, flip: false, armF: 14 + call * 60 + pt * 80 + es(t, 4.2, 4.6) * 20, armB: 8 + call * 125 + pt * 20, head: -call * 6, blink: blinkAt(T) });
      pose(jGlow, { x: SHORE.jx, y: SHORE.jy - 120, s: 1 + (T ? Math.sin(T * 1.2) * 0.03 : 0), o: 0.3 + call * 0.2 + pt * 0.2 });
      vr.forEach((r, i) => {
        const k = ((T * 0.7 + i / 3) % 1);
        pose(r, { x: SHORE.jx + 40 + k * 260, y: SHORE.jy - 200 - k * 40, s: 0.6 + k * 1.2, o: call * (1 - k) * 0.8 });
      });
      const [jx, jy] = headAt(SHORE.jx, SHORE.jy, 1.02, false);
      const ak = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.95, 1.05));
      vis(ask, { x: jx + 22, y: jy - 20, s: ak, o: ak > 0.01 ? 1 : 0 });
      const nk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(no, { x: BX - 20, y: BY - 170 * BS - 20, s: nk, o: nk > 0.01 ? 1 : 0 });
      const pk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(point, { x: jx + 22, y: jy - 20, s: pk, o: pk > 0.01 ? 1 : 0 });

      /* the lit spot on the water (the right side) */
      const lit = es(t, 2.2, 2.5) * (1 - es(t, 4.6, 5) * 0.6);
      vis(spot, { x: SPOT[0], y: SPOT[1], s: 1 + (T ? Math.sin(T * 2) * 0.04 : 0), o: lit });
      glints.forEach((g, i) => {
        const k = ((T * 0.5 + i / 4) % 1);
        vis(g, { x: SPOT[0] - 70 + i * 46, y: SPOT[1] - 6 - bump(k, 0, 1) * 10, s: bump(k, 0, 1) * 0.9, r: T * 40, o: lit * (1 - es(t, 3.2, 3.4)) });
      });

      /* v6b — the cast: the net flies and opens, lands in the light */
      const fly = es(t, 3.12, 3.55, ease.out);
      const fx0 = BX - 30, fy0 = BY - 140;
      const cxN = lerp(fx0, SPOT[0], fly), cyN = lerp(fy0, SPOT[1], fly) - Math.sin(fly * PI) * 90;
      vis(thrown, { x: cxN, y: cyN, s: 0.2 + fly * 0.8, sy: lerp(1, 0.3, es(t, 3.45, 3.6)), o: seg(t, 3.1, 3.14) * (1 - es(t, 3.9, 4.05)) });
      rings.forEach((r, i) => {
        const k = es(t, 3.55 + i * 0.1, 4.0 + i * 0.1);
        vis(r, { x: SPOT[0], y: SPOT[1] + 2, s: 0.6 + k * 2.4, sy: 1, o: k > 0 && k < 1 ? (1 - k) : 0 });
      });

      /* v6c — the multitude: the full net sags at the surface, fish leap, they strain on the rope */
      const fk = es(t, 4.0, 4.3);
      vis(full, { x: SPOT[0] - 135, y: SPOT[1] - 14 + (T ? Math.sin(T * 2.2) * 3 : 0), s: 1, o: fk });
      vis(cover, { x: SPOT[0], y: SPOT[1] + 22, s: 1, o: fk });
      const [hx, hy] = [BX + 40, BY - 110 * BS];
      const rx = SPOT[0] - 135, ry = SPOT[1] - 16;
      const dx = rx - hx, dy = ry - hy;
      vis(rope, { x: hx, y: hy, s: 1, sx: Math.hypot(dx, dy), r: Math.atan2(dy, dx) * 180 / PI, o: fk });
      leap.forEach((f) => {
        const on = es(t, 4.02 + f.a * 0.3, 4.12 + f.a * 0.3);
        const k = ((t - 4) * 1.6 + f.a + (T ? T * 0.25 : 0)) % 1;
        const x = SPOT[0] + f.dx + k * 30, y = SPOT[1] - 4 - Math.sin(k * PI) * f.h;
        vis(f.el, { x, y, s: 0.9, r: lerp(-50, 50, k) * (f.dx > 0 ? 1 : -1), sx: f.dx > 0 ? 1 : -1, o: on * (k < 0.95 ? 1 : 0) });
      });
      splashes.forEach((sp, i) => {
        const k = ((T * 0.9 + i / 3) % 1);
        vis(sp, { x: SPOT[0] - 80 + i * 80, y: SPOT[1] - 2, s: 0.6 + k * 0.6, o: fk * (1 - k) });
      });
      strain.forEach((el, i) => {
        const k = es(t, 4.3 + i * 0.12, 4.5 + i * 0.12, ease.back);
        vis(el, { x: BX + 20 + i * 70, y: BY - 200 * BS - 30 - i * 10, s: k * 0.9, r: T ? Math.sin(T * 10 + i) * 6 : 0, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 30], [0.9, 40], [1.2, 110], [1.9, 110], [2.2, 50], [2.9, 60], [3.2, 140], [5, 150]]);
      S.cam.y = kf(t, [[0, 40], [1.2, 30], [2.2, 40], [3.2, 30], [5, 36]]);
      S.cam.z = kf(t, [[0, 1.04], [1.2, 1.14], [2.2, 1.04], [3.2, 1.16], [4.2, 1.22], [5, 1.22]]);
    };
  },
};
