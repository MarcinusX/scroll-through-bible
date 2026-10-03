// Mk 16,1 — The Sabbath is over: three stars come out over Jerusalem, the spice seller rolls up the
// cloth over his stall and lights his lamp. Mary Magdalene, Mary the mother of James, and Salome buy
// jars of ointment — to go and anoint Jesus (a little tomb in a bubble).
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, town, house, cypress, moon, stars } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { WOMEN, MERCHANT, spiceJar, spiceStall, stallCover, scent, tombIcon, hungStar, nameTag, thought, hand, headAt, walledCity, PI } from './lib.js';

const GY = 700;          // where the women stand
const SX = 1010;         // the stall
const SW = 300;

export default {
  id: 'm16-spices',
  beats: [
    { cover: true },
    { v: 1, text: 'Po upływie szabatu Maria Magdalena, Maria, matka Jakuba, i Salome' },
    { v: 1, cont: true, text: 'nakupiły wonności, żeby pójść namaścić Jezusa.' },
  ],
  cam: { x: [-20, 60], y: [-10, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const DUSK = [mix(C.indigo, C.duskViolet, 0.35), mix(C.duskViolet, C.dusk, 0.45), C.peach];
    const EVE = [mix(C.night, C.indigo, 0.4), mix(C.indigo, C.duskViolet, 0.55), mix(C.dusk, C.duskViolet, 0.3)];
    const sk = sky(S, DUSK);

    /* the three stars that close the Sabbath, a thin moon */
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starField = hangL.add(`<g opacity="0">${stars(c, { x0: -600, x1: 2200, y0: -300, y1: 300, n: 50 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 26), { x: 1180, y: 150, len: 700 });
    const STARS = [[560, 150], [760, 110], [960, 170]].map(([x, y], i) => ({ x, y, i, el: hanging(hangL, `<circle r="40" fill="url(#halo-glow)"/>${hungStar(c, 14)}`, { x, y, len: 600 }) }));

    /* Jerusalem at dusk */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 450, amps: [14, 6, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.35) });
    const wallC = mix(C.plaster, C.duskViolet, 0.25), wallS = mix(C.plaster2, C.duskViolet, 0.35);
    far.add(h1.markup + town(c, { x: 360, y: h1.fn(360) + 10, n: 9, spread: 420, sc: 0.6, wall: wallC, shadow: wallS, lit: true }) + town(c, { x: 1320, y: h1.fn(1320) + 10, n: 8, spread: 380, sc: 0.55, wall: wallC, shadow: wallS, lit: true }));
    far.add(`<g>${walledCity(c, 820, h1.fn(820) + 6, 0.9, { wall: mix(C.stone, C.duskViolet, 0.3), wall2: mix(C.stone2, C.duskViolet, 0.3), temple: mix(C.cream, C.duskViolet, 0.2) })}</g>`);

    /* the street: house fronts, paving */
    const street = S.layer({ par: 0.35, sh: 3 });
    const st = sheet();
    st.p(c.cut([[-900, 610], [2500, 610], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.sand2, 0.45));
    let slabs = '';
    for (let r = 0; r < 7; r++) {
      const y = 626 + r * r * 7 + r * 16;
      slabs += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.3);
      for (let x = -900 + c.rr(0, 60); x < 2500; x += c.rr(70, 110) + r * 12) slabs += c.ribbon([[x, y], [x + c.rr(-3, 3), y + 14 + r * 8]], 1.1);
    }
    st.x(slabs, shade(C.stone2, -0.14), 'opacity=".5"');
    street.add(st.out());
    const hw = mix(C.plaster, C.dusk, 0.15), hsd = mix(C.plaster2, C.dusk, 0.25);
    street.add(house(c, -80, 612, 300, 250, { wall: hw, shadow: hsd, lit: true, stairs: false }) + house(c, 290, 612, 170, 190, { wall: shade(hw, -0.04), shadow: hsd, lit: false, stairs: true }));
    street.add(house(c, 1230, 612, 220, 230, { wall: hw, shadow: hsd, lit: true, stairs: false }) + house(c, 1500, 612, 260, 280, { wall: shade(hw, -0.05), shadow: hsd, lit: true, stairs: false }));
    street.add(cypress(c, 520, 612, 150, mix(C.moss2, C.duskViolet, 0.3)));

    /* the spice stall and its seller */
    const stallL = S.layer({ par: 0.5, sh: 4 });
    const stall = spiceStall(c, SW, 250);
    stallL.add(`<g transform="translate(${SX} ${GY - 12})">${stall.back}</g>`);
    const seller = S.puppet(stallL.add(person(c, { ...MERCHANT })));
    stallL.add(`<g transform="translate(${SX} ${GY - 12})">${stall.front}</g>`);
    const lamp = stallL.add(`<g>${oilLamp(c)}</g>`);
    const lampFl = lamp.querySelector('.flame'), lampGl = lamp.querySelector('.glow');
    const cover = stallL.add(`<g>${stallCover(c, SW - 16, 180)}</g>`);
    // jars waiting on the counter, then handed over
    const JAR_COL = [C.cream, C.blushVeil, C.linen2];
    const jars = WOMEN.map((w, i) => ({ el: stallL.add(`<g>${spiceJar(c, JAR_COL[i], [C.clay, C.plumRobe, C.teal2][i])}</g>`), i }));

    /* the three women */
    const PL = S.layer({ par: 0.55, sh: 4 });
    const W = WOMEN.map((w, i) => ({ ...w, i, x: [770, 660, 550][i], s: [1.0, 0.98, 1.0][i], seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, { ...w.o }))) }));
    const held = W.map((w, i) => ({ el: PL.add(`<g>${spiceJar(c, JAR_COL[i], [C.clay, C.plumRobe, C.teal2][i])}</g>`) }));
    const fx = S.layer({ par: 0.58, sh: 4 });
    const tags = W.map((w) => ({ el: hanging(fx, nameTag(c, w.name(), { size: 15 }), { x: 0, y: 0, len: 600 }) }));
    const curls = W.map((w, i) => [0, 1].map((j) => ({ el: fx.add(`<g>${scent(c, 60 + j * 16)}</g>`), j })));
    const wish = fx.add(`<g>${thought(c, `<g transform="translate(0 6) scale(.9)">${tombIcon(c)}</g>`, { w: 96, h: 78 })}</g>`);

    /* foreground: pots and a doorway edge */
    const fg = S.layer({ par: 0.9, sh: 6 });
    const pot = (x, y, s, col) => sheet().p(c.cut([[x - 30 * s, y], [x - 44 * s, y - 50 * s], [x - 36 * s, y - 80 * s], [x - 20 * s, y - 92 * s], [x + 20 * s, y - 92 * s], [x + 36 * s, y - 80 * s], [x + 44 * s, y - 50 * s], [x + 30 * s, y]], 0.6, 6), col).x(c.ribbon([[x - 42 * s, y - 54 * s], [x + 42 * s, y - 54 * s]], 3 * s), shade(col, -0.2)).out();
    fg.add(pot(160, 960, 1.7, C.pot) + pot(300, 990, 1.2, C.clay) + pot(1460, 980, 1.8, C.pot));
    const baskets = sheet();
    baskets.p(c.cut([[1250, 990], [1230, 910], [1370, 910], [1350, 990]], 0.6, 8), C.basket);
    baskets.p(c.cut(c.blob(1300, 910, 66, 16, 12, 0.2), 0.6, 6), C.sun);
    fg.add(baskets.out());

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      /* evening deepens as the Sabbath ends */
      const eve = es(t, 0.6, 2.6, ease.sine);
      sk.blend(DUSK, EVE, eve);
      fade(starField, es(t, 1.2, 2.2) * 0.8);
      swing(moonEl, 1180, 150 + (1 - eve) * 30, time, 1, 0.6, 2);
      STARS.forEach((s) => {
        const d = es(t, 1.0 + s.i * 0.18, 1.35 + s.i * 0.18, ease.back);
        swing(s.el, s.x, lerp(-1000, s.y, d), time, 1.4, 0.8, s.i * 2);
        pose(s.el.querySelector('.obj'), { s: 1 + Math.sin(time * 2 + s.i) * 0.06 * d });
      });

      /* v1a: the stall opens, the lamp is lit; the three women come down the street */
      const roll = es(t, 1.1, 1.5);
      pose(cover, { x: SX, y: GY - 12 - 244, sy: Math.max(0.04, 1 - roll), o: 1 });
      const lit = es(t, 1.35, 1.55);
      pose(lamp, { x: SX + 90, y: GY - 12 - 180, s: 0.8 });
      pose(lampFl, { x: 35, y: -16, s: lit, sx: 1 + Math.sin(time * 7) * 0.08, sy: 1 + Math.sin(time * 5.3) * 0.1 });
      fade(lampGl, lit * 0.9);
      const handing = es(t, 2.05, 2.5);
      seller.set({ x: SX + 10, y: GY - 60, s: 0.92, flip: true, armF: bump(t, 1.1, 1.5) * 140 + bump(t, 1.35, 1.6) * 40 + handing * 70 - es(t, 2.5, 2.7) * 40, armB: bump(t, 1.1, 1.5) * 150, head: -bump(t, 1.35, 1.6) * 8, blink: blinkAt(time, 4) });

      const P = S.portrait;
      W.forEach((w) => {
        const d = w.i * 0.14;
        // phone: all three are in and named by the sentence's pause (Salome came in off-screen)
        const walk = P ? es(t, 1.02 + w.i * 0.08, 1.5 + w.i * 0.08, ease.out) : es(t, 1.05 + d, 1.8 + d, ease.out);
        const step = es(t, 2.0, 2.2) * 30;
        const x = lerp(-120 - w.i * 90, w.x, walk) + step;
        const got = es(t, 2.2 + w.i * 0.12, 2.4 + w.i * 0.12);
        const hug = es(t, 2.45 + w.i * 0.1, 2.7 + w.i * 0.1);
        const armF = lerp(bump(t, 2.05, 2.35) * 70, 46, got) - hug * 6;
        w.p.set({ x, y: GY, s: w.s, flip: false, walk: walk > 0 && walk < 1 ? x * 0.05 : undefined, armF, armB: 8 + hug * 14, head: -es(t, 2.6, 2.8) * 6, blink: blinkAt(time, w.seed), o: seg(t, 1.0, 1.06) });
        // jars: from the counter into their hands
        const [hx, hy] = hand(x, GY, w.s, false, armF);
        const j = jars[w.i];
        const from = [SX - 110 + w.i * 30, GY - 88];
        const tk = es(t, 2.1 + w.i * 0.12, 2.35 + w.i * 0.12);
        pose(j.el, { x: lerp(from[0], hx + 4, tk), y: lerp(from[1], hy + 10, tk) - bump(t, 2.1 + w.i * 0.12, 2.35 + w.i * 0.12) * 30, s: 0.95, o: 1 - seg(t, 2.35 + w.i * 0.12, 2.36 + w.i * 0.12) });
        pose(held[w.i].el, { x: hx + 4, y: hy + 10, s: 0.95, o: seg(t, 2.35 + w.i * 0.12, 2.36 + w.i * 0.12) });
        // their names drop in on strings as they arrive
        // phone: names hang by 1.75, and go up before the thought bubble covers Mary Magdalene's
        const tg = P ? es(t, 1.25 + w.i * 0.1, 1.55 + w.i * 0.1, ease.back) * (1 - es(t, 2.35, 2.55)) : es(t, 1.45 + w.i * 0.12, 1.8 + w.i * 0.12, ease.back) * (1 - es(t, 2.9, 3.2));
        const [tx, ty] = headAt(x, GY, w.s, false);
        pose(tags[w.i].el, { x: tx, y: lerp(-1000, ty - 118, tg), r: Math.sin(time * 1.1 + w.i) * 2 });
        // fragrance
        curls[w.i].forEach((cu) => {
          const k = time ? (time * 0.35 + cu.j * 0.5 + w.i * 0.2) % 1 : 0.5;
          const on = es(t, 2.4 + w.i * 0.1, 2.6 + w.i * 0.1);
          pose(cu.el, { x: hx + 4 + (cu.j ? 8 : -6), y: hy - 30 - k * 30, s: 0.6 + k * 0.5, o: on * Math.sin(k * PI) * 0.9 });
        });
      });

      /* "…to go and anoint Jesus": a little tomb in a thought bubble over Mary Magdalene */
      const [mx, my] = headAt(W[0].x + 30, GY, W[0].s, false);
      const th = es(t, 2.55, 2.8, ease.back);
      pose(wish, { x: mx + 10, y: my - 22, s: th, o: th > 0.01 ? 1 : 0 });

      S.cam.x = es(t, 0.6, 1.6) * 20 + es(t, 1.9, 2.4) * 30;
      S.cam.y = 20 - es(t, 2.5, 3) * 10;
      S.cam.z = 1 + es(t, 0.3, 1.4) * 0.04 + es(t, 1.9, 2.4) * 0.05;
    };
  },
};
