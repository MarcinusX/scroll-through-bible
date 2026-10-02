// Mt 2,6 — the prophet's words as a painted flat, framed like an old page: the hills of Judah with their great
// walled cities, and little Bethlehem low between them. "By no means least": its hill rises, crowned with light.
// "From you shall come a ruler who will shepherd my people Israel": a golden shepherd's crook with a crown rises
// over it, and the flock of Israel comes in from every side.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, grass, rock } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  LOOK, hillTown, crookCrown, sheep, placeTag, storyFrame, scrollOpen, hangAt, vpose, sparkle, radiance, glory, tr, PI,
} from './lib.js';

const BX = 800;             // Bethlehem

export default {
  id: 'mt2-micah',
  enter: 'fly',
  beats: [
    { v: 6, text: 'A ty, Betlejem, ziemio Judy, nie jesteś zgoła najlichsze spośród głównych miast Judy,' },
    { v: 6, cont: true, text: 'albowiem z ciebie wyjdzie władca, który będzie pasterzem ludu mego, Izraela».' },
  ],
  cam: { x: [-20, 20], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const P = (col) => mix(col, C.parchment, 0.35);
    sky(S, [mix(C.parchment, C.dawn, 0.4), mix(C.parchment, C.cream, 0.5), mix(C.parchment, C.peach, 0.3)]);

    /* the hills of Judah and its chief cities */
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(band(c, { y: 430, amps: [26, 10, 3], lens: [900, 330, 120], color: P(mix(C.hillFar, C.dune, 0.3)) }).markup);
    const cities = S.layer({ par: 0.14, sh: 3 });
    const cfn = c.wave(520, [8, 3], [700, 200]);
    const hill = (x, h, w) => (xx) => cfn(xx) - Math.max(0, 1 - Math.abs(xx - x) / w) ** 1.6 * h;
    const big = [[400, 120, 380], [1210, 110, 380]];
    const cf = (xx) => Math.min(...big.map(([x, h, w]) => hill(x, h, w)(xx)));
    cities.add(sheet().p(c.ridge(cf, -900, 2500, 1700, 12, 1), P(mix(C.hillMid, C.dune, 0.35))).out());
    big.forEach(([x, h]) => cities.add(`<g transform="translate(${x} ${cfn(x) - h + 30})">${hillTown(c, { w: 220, h: 50, col: P(mix(C.hillMid, C.dune, 0.35)), wall: P(C.plaster), wall2: P(C.plaster2), roof: P(C.roof), n: 9, towers: true })}</g>`));
    // Bethlehem's own little hill (rises as a whole)
    const bL = S.layer({ par: 0.2, sh: 4 });
    const bh = sheet();
    bh.p(c.cut([[BX - 200, 700], ...c.qbez([BX - 200, 660], [BX, 540], [BX + 200, 660], 16), [BX + 200, 700], [BX + 200, 1200], [BX - 200, 1200]], 1, 10), P(mix(C.hillNear, C.sand2, 0.3)));
    const bEl = bL.add(`<g>${bh.out()}<g transform="translate(${BX} 610)">${hillTown(c, { w: 130, h: 26, col: P(mix(C.hillNear, C.sand2, 0.3)), wall: P(C.plaster), wall2: P(C.plaster2), roof: P(C.roof), n: 6 })}</g></g>`);
    const glowL = S.layer({ par: 0.2, sh: 0, flat: true });
    const halo = glowL.add(`<g>${glory(c, 260, 18)}</g>`);

    /* the near fields: the flock gathers here */
    const G = S.layer({ par: 0.35, sh: 3 });
    const gfn = c.wave(690, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), P(mix(C.sage2, C.hillNear, 0.5))).out());
    G.add(olive(c, 250, gfn(250) + 20, 0.9, { leaf: P(C.olive), leaf2: P(C.sage), trunk: P(C.wood2) }) + cypress(c, 1370, gfn(1370) + 10, 140, P(C.moss2)) + grass(c, { x0: -800, x1: 2400, y: 690, fn: gfn, n: 40, h: 12, color: P(C.moss) }));
    const flockL = S.layer({ par: 0.4, sh: 4 });
    const flock = Array.from({ length: 10 }, (_, i) => {
      const side = i % 2 ? 1 : -1, row = Math.floor(i / 2);
      const hx = BX + side * (70 + row * 58) + c.rr(-10, 10), hy = gfn(hx) + 26 + (row % 2) * 12;
      return { i, side, hx, hy, el: flockL.add(sheep(c)), d: c.rr(0, 0.25) };
    });

    /* the crook with a crown; the prophet reading at the side */
    const crookL = S.layer({ par: 0.22, sh: 5 });
    const crook = crookL.add(`<g>${crookCrown(c, 220)}</g>`);
    const P2 = S.layer({ par: 0.45, sh: 5 });
    const micah = S.puppet(P2.add(person(c, { ...LOOK.micah, holdF: `<g transform="translate(18 8) rotate(-70)">${scrollOpen(c, 60, 40)}</g>` })));

    const X = S.layer({ par: 0.3, sh: 5 });
    const tagB = hanging(X, placeTag(c, tr('Betlejem', 'Bethlehem'), 22), { x: 0, y: 0, len: 600 });
    const tagJ = hanging(X, placeTag(c, tr('główne miasta Judy', 'the princes of Judah'), 17), { x: 0, y: 0, len: 600 });
    const tagI = hanging(X, placeTag(c, tr('mój lud, Izrael', 'my people, Israel'), 19), { x: 0, y: 0, len: 600 });
    const tagM = hanging(X, placeTag(c, tr('Prorok', 'the prophet'), 16), { x: 0, y: 0, len: 600 });
    const glints = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 11)}</g>`));

    storyFrame(S, { col: mix(C.parchment, C.wood3, 0.45) });

    return (t, time) => {
      const T = time;
      /* v6a — little Bethlehem among the great cities: its hill rises, by no means least */
      const rise = es(t, 0.45, 0.95, ease.out);
      pose(bEl, { y: -rise * 90 });
      vpose(halo, { x: BX, y: 580 - rise * 90, s: 0.5 + rise * 0.5, r: T * 3, o: rise * 0.55 });
      const tb = es(t, 0.08, 0.35, ease.out);
      hangAt(tagB, BX - es(t, 1.0, 1.3) * 190, lerp(-500, 330 - rise * 60, tb), T, tb > 0.001 ? 1 : 0, 1.2, 0.9, 1);
      const tj = es(t, 0.15, 0.4, ease.out) * (1 - es(t, 0.95, 1.1, ease.in));
      hangAt(tagJ, S.portrait ? 1000 : 1190, lerp(-500, 220, tj), T, tj > 0.001 ? 1 : 0, 1.2, 0.9, 2);
      micah.set({ x: S.portrait ? 545 : 470, y: 716, s: 0.9, armF: 70, armB: 20 + bump(t, 0.3, 0.9) * 60, head: 6, blink: blinkAt(T, 2) });
      const tm = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.0, 1.15, ease.in));
      hangAt(tagM, S.portrait ? 610 : 470, lerp(-500, 420, tm), T, tm > 0.001 ? 1 : 0, 1.2, 0.9, 4);

      /* v6b — a ruler comes from her, the shepherd of Israel: the crook rises, the flock gathers */
      const ck = es(t, 1.05, 1.45, ease.out);
      vpose(crook, { x: BX - 12, y: 560 - rise * 90 + (1 - ck) * 200, s: 0.6 + ck * 0.4, o: ck > 0.01 ? 1 : 0 });
      flock.forEach((f) => {
        const k = es(t, 1.2 + f.d, 1.75 + f.d, ease.out);
        const x = lerp(f.hx + f.side * 800, f.hx, k);
        const hop = k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.06)) * 5 : 0;
        pose(f.el, { x, y: f.hy - hop, s: 0.9, sx: f.side > 0 ? -1 : 1, o: k > 0.01 ? 1 : 0 });
      });
      const ti = es(t, 1.4, 1.7, ease.out);
      hangAt(tagI, S.portrait ? 1030 : 1150, lerp(-500, 360, ti), T, ti > 0.001 ? 1 : 0, 1.2, 0.9, 5);
      glints.forEach((g, i) => {
        const k = es(t, 1.3 + i * 0.05, 1.5 + i * 0.05), a = T * 0.7 + i * 1.6;
        vpose(g, { x: BX + Math.cos(a) * 120, y: 300 + Math.sin(a) * 70, s: k * 0.8, r: T * 30, o: k });
      });

      S.cam.z = 1 + es(t, 1.0, 1.6) * 0.05;
      S.cam.y = es(t, 1.0, 1.6) * 20;
      S.cam.x = 0;
    };
  },
};
