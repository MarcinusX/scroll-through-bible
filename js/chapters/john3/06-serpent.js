// J 3,14–15 — A sepia flashback in a torn frame: the camp in the wilderness, people bitten by snakes lie on
// the sand; Moses lifts up the bronze serpent on its pole, they look up and rise, and the snakes slip away.
// "So must the Son of Man be lifted up": the old picture warms into gold, and on the hill behind, a cross
// rises against the dawn. "That whoever believes in Him may have eternal life": they turn to it, a small
// light kindles over each of them and the desert flowers.
import { C, person, crowdPerson, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky } from '../kit.js';
import { band, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { storyFrame, SEPIA, MOSES, serpentPole, tent, desertSnake, crossSil, glory, soulLight, headAt, word, tr, PI , hangAt, vpose } from './lib.js';

const GY = 700, POLE = 640, CX = 965, HILL = 520;
const sep = (col, k = 0.55) => mix(col, SEPIA.wall, k);

export default {
  id: 'j3-serpent',
  beats: [
    { v: 14, text: 'A jak Mojżesz wywyższył węża na pustyni,' },
    { v: 14, cont: true, text: 'tak potrzeba, by wywyższono Syna Człowieczego,' },
    { v: 15 },
  ],
  cam: { x: [-40, 120], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SEPIA.sky);
    const DAWNS = ['#f0c9a4', '#f6dcb6', '#f8e8cc'];
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46, { rays: sep(C.sunRay, 0.4), disc: sep(C.sun, 0.35), inner: sep('#efc57d', 0.3) }), { x: 470, y: 170, len: 700 });
    const cl = hanging(hangL, cloud(c, 180, sep(C.cream, 0.3), sep('#eadcc0', 0.4)), { x: 1150, y: 190, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [26, 10, 3], lens: [1100, 380, 140], color: sep(C.duskViolet, 0.5) }).markup);
    // the glory and the cross behind the hill
    const G = S.layer({ par: 0.2, sh: 0, flat: true });
    const glo = G.add(`<g>${glory(c, 420, 24)}</g>`);
    const X = S.layer({ par: 0.2, sh: 4 });
    const cross = X.add(crossSil(c, { h: 250, figure: true, halo: true, col: mix(C.ink, C.wood2, 0.3) }));
    const hill = S.layer({ par: 0.2, sh: 3 });
    const hs = sheet();
    const hp = [[-900, 1700], [-900, 560], [400, 560], [700, 548], [860, HILL + 4], [CX, HILL - 6], [1070, HILL + 4], [1240, 548], [1600, 560], [2500, 560], [2500, 1700]];
    hs.p(c.cut(hp, 1.2, 12), sep(C.dune, 0.4));
    hill.add(hs.out());

    // the camp
    const camp = S.layer({ par: 0.34, sh: 3 });
    const cfn = c.wave(600, [6, 3], [700, 180]);
    camp.add(sheet().p(c.ridge(cfn, -900, 2500, 1700, 12, 1), sep(C.sand2, 0.45)).out());
    camp.add([[-200, 1], [120, 0.8], [360, 0.9], [1250, 0.85], [1480, 1], [1760, 0.9]].map(([x, k]) => `<g transform="translate(${x} ${cfn(x) + 6}) scale(${k})">${tent(c, 170, 100, sep(c.pick([C.wood3, C.clay, C.dune, C.ochreRobe]), 0.45))}</g>`).join(''));

    // the ground where they lie
    const L = S.layer({ par: 0.5, sh: 4 });
    const gfn = c.wave(GY - 20, [5, 2], [600, 160]);
    L.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), sep(C.sand, 0.4)).out());
    let dots = '';
    for (let i = 0; i < 60; i++) dots += c.cut(c.ell(c.rr(-900, 2500), c.rr(GY, 1000), c.rr(4, 10), c.rr(2, 3), 6), 0.2, 3);
    L.add(`<path d="${dots}" fill="${sep(C.dune, 0.4)}" opacity=".6"/>`);
    // flowers that bloom at the end
    const flowers = Array.from({ length: 16 }, (_, i) => {
      const x = lerp(380, 1250, (i + c.rr(0.2, 0.8)) / 16), y = GY + c.rr(10, 70);
      const col = c.pick([C.jesusMantle, C.lavender, C.wheat, C.roseRobe, C.cream]);
      const el = L.add(`<g>${sheet().p(c.ribbon([[0, 0], [c.rr(-3, 3), -22]], 1.8), C.moss).p(c.cut(c.star(0, -24, 8, 4, 5, c.rr(0, 6)), 0.2, 3), col).x(c.poly(c.circ(0, -24, 2.4, 6)), C.sun).out()}</g>`);
      return { el, x, y, i };
    });

    // Moses and the pole
    const P = S.layer({ par: 0.5, sh: 5 });
    const poleEl = P.add(`<g>${serpentPole(c, 300)}</g>`);
    const poleGlow = poleEl.querySelector('.glow');
    const moses = S.puppet(P.add(person(c, { ...MOSES, robe: sep(MOSES.robe, 0.2), mantle: sep(MOSES.mantle, 0.3) })));
    // the bitten, lying — then standing
    const SPOTS = [[420, 0.9, false], [320, 0.95, false], [1060, 0.95, true], [1170, 0.9, true], [1290, 0.85, true], [215, 0.85, false]];
    const folk = SPOTS.map(([x, s, flip], i) => {
      const o = crowdPerson(c);
      if (i === 1) Object.assign(o, { hairStyle: 'veil', beard: 'none' });
      const col = { ...o, robe: sep(o.robe, 0.35), mantle: o.mantle ? sep(o.mantle, 0.35) : null, veil: sep(o.veil, 0.3) };
      return {
        x, s, flip, i, seed: c.rr(0, 9),
        lie: S.puppet(P.add(person(c, { ...col, pose: 'sit' }))),
        up: S.puppet(P.add(person(c, col))),
        snake: P.add(`<g>${desertSnake(c)}</g>`),
        light: P.add(`<g>${soulLight(c, 12)}</g>`),
      };
    });
    const frame = storyFrame(S);
    const T1 = S.layer({ par: 0.5, sh: 5 });
    const tagM = hanging(T1, word(c, tr('Mojżesz', 'Moses'), { size: 18 }), { x: 600, y: 330, len: 600 });
    const tagS = hanging(T1, word(c, tr('Syn Człowieczy', 'the Son of Man'), { size: 18 }), { x: CX, y: 250, len: 600 });

    return (t, time) => {
      const T = time;
      const warm = es(t, 1.05, 1.7);
      sk.blend(SEPIA.sky, DAWNS, warm);
      frame.fade(1 - warm * 0.85);
      swing(sunEl, 470, 170 + warm * 40, T, 1, 0.6);
      swing(cl, 1150 + Math.sin(T * 0.1) * 20, 190, T, 1.2, 0.6, 1);

      /* v14a — Moses lifts up the serpent */
      const lift = es(t, 0.1, 0.55, ease.out);
      vpose(poleEl, { x: POLE, y: GY + 20 - lift * 30, r: (1 - lift) * -40, oy: 0 });
      fade(poleGlow, es(t, 0.5, 0.7) * (1 - warm * 0.6));
      moses.set({ x: POLE - 112, y: GY + 4, s: 1.05, armF: 60 + lift * 70, armB: 40 + lift * 110, head: -lift * 12 + warm * 6, blink: blinkAt(T, 3) });
      const mk = es(t, 0.2, 0.5, ease.out);
      hangAt(tagM, 560, lerp(-300, 330, mk) - es(t, 1.0, 1.2) * 700, T, mk > 0 && t < 1.25 ? 1 : 0, 1.2, 0.8, 1);

      /* the bitten look up, rise; the snakes slide away */
      const look = es(t, 0.5, 0.7);
      folk.forEach((f) => {
        const rise = es(t, 0.72 + f.i * 0.03, 0.8 + f.i * 0.03);
        const toCross = es(t, 2.05, 2.35);
        const dir = f.x < POLE ? false : true;
        f.lie.set({ x: f.x, y: GY + 12, s: f.s, flip: dir, o: 1 - rise, head: 16 - look * 30, lean: (dir ? -1 : 1) * (8 - look * 8), armF: 20 + look * 30, armB: 50 - look * 20, blink: blinkAt(T, f.seed) });
        const faceCross = f.x > CX ? true : false;
        f.up.set({ x: f.x, y: GY + 12, s: f.s, flip: toCross > 0.5 ? faceCross : dir, o: rise, head: -10 - toCross * 8, armF: 30 + bump(t, 0.8, 1.2) * 60 + toCross * 50, armB: 20 + toCross * 90 * (f.i % 2), blink: blinkAt(T, f.seed) });
        const away = es(t, 0.75, 1.2);
        vpose(f.snake, { x: f.x + (dir ? -40 : 40) * f.s + (dir ? 1 : -1) * away * -260 * 0 + (f.x < 800 ? -away * 300 : away * 300), y: GY + 16, sx: f.x < 800 ? -0.9 : 0.9, sy: 0.9, o: 1 - es(t, 1.0, 1.2) });
        const [hx, hy] = headAt(f.x, GY + 12, f.s, false);
        const lk = es(t, 2.2 + f.i * 0.06, 2.45 + f.i * 0.06, ease.back);
        vpose(f.light, { x: hx, y: hy - 44 + Math.sin(T * 2 + f.i) * 3, s: lk, o: seg(t, 2.2 + f.i * 0.06, 2.25 + f.i * 0.06) });
      });

      /* v14b — the Son of Man lifted up */
      const rise = es(t, 1.1, 1.6, ease.out);
      vpose(cross, { x: CX, y: HILL + 250 - rise * 250 + 6, o: rise > 0 ? 1 : 0 });
      vpose(glo, { x: CX, y: HILL - 180, s: 0.4 + rise * 0.6 + es(t, 2.1, 2.6) * 0.2, r: rise * 10, o: rise * 0.75 });
      const sk2 = es(t, 1.45, 1.75, ease.out);
      hangAt(tagS, CX, lerp(-300, 230, sk2), T, sk2 > 0 ? 1 : 0, 1, 0.7, 2);

      /* v15 — eternal life: the desert flowers */
      flowers.forEach((fl) => vpose(fl.el, { x: fl.x, y: fl.y, s: 1.7 * es(t, 2.35 + fl.i * 0.025, 2.6 + fl.i * 0.025, ease.back), o: seg(t, 2.35 + fl.i * 0.025, 2.4 + fl.i * 0.025) }));

      S.cam.x = rise * 100;
      S.cam.y = -rise * 30 + es(t, 2, 2.5) * 40;
      S.cam.z = 1.04 + es(t, 2, 2.5) * 0.06;
    };
  },
};
