// Mt 23,25–26 — the fifth woe, a painted flat indoors. On a long table stand a great golden goblet and a wide dish;
// the Pharisee polishes the goblet's outside till it sparkles. Then its golden skin turns to glass and we see inside:
// a dark sludge full of snatched coins, a little house swallowed whole (the widow's), spilled wine and gnawed bones —
// and the dish, bright on its rim, is black within: "full of extortion and self-indulgence". "Blind Pharisee!": a band
// falls over his eyes. "First clean the inside": a jug tips from above and pours clear water in — the sludge dissolves,
// the inside fills with light, and the outside shines as it never did before.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, PH, woeDrop, roomFlat, goblet, greedHeap, littleHouse, sparkle, jug, blindBand, addToHead, handAt, hang2, PI } from './lib.js';

const GY = 660;
const PX = 725, CX = 860, DX0 = 1085;
const TOP = GY - 84;              // the table top

export default {
  id: 'mt23-cup',
  enter: 'fly',
  beats: [
    { v: 25, text: 'Biada wam, uczeni w Piśmie i faryzeusze, obłudnicy!' },
    { v: 25, cont: true, text: 'Bo dbacie o czystość zewnętrznej strony kubka i misy, a wewnątrz pełne są one zdzierstwa i niepowściągliwości.' },
    { v: 26, text: 'Faryzeuszu ślepy!' },
    { v: 26, cont: true, text: 'Oczyść wpierw wnętrze kubka, żeby i zewnętrzna jego strona stała się czysta.' },
  ],
  cam: { x: [0, 80], y: [-60, 10], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const DX = S.portrait ? 1020 : DX0, DS = S.portrait ? 0.88 : 1;   // phone: the dish comes in (a little narrower) from under the progress thread
    sky(S, ['#d8c9a8', '#ead8b4', '#f2e2c2']);
    const back = S.layer({ par: 0.2, sh: 3 });
    back.add(roomFlat(c, { gy: GY - 30, mid: 380, wall: mix(C.plaster, C.parchment, 0.5) }));

    const P = S.layer({ par: 0.4, sh: 5 });
    // the long table
    const tb = sheet();
    tb.p(c.cut(c.rect(640, TOP + 10, 12, GY - TOP - 4), 0.3, 5) + c.cut(c.rect(1180, TOP + 10, 12, GY - TOP - 4), 0.3, 5), C.wood2);
    tb.p(c.cut([[610, TOP], [1220, TOP], [1220, TOP + 14], [610, TOP + 14]], 0.4, 10), C.wood);
    P.add(tb.out());
    const G = goblet(c, { w: 200, bh: 150, sh: 86 });
    const glow = P.add(`<g><circle r="220" fill="url(#halo-glow)"/></g>`);
    P.add(`<g transform="translate(${CX} ${TOP})">${G.stem}</g>`);
    P.add(`<g transform="translate(${CX} ${TOP})">${G.back}</g>`);
    const heap = P.add(`<g>${greedHeap(c, 150)}<g transform="translate(34 -30) scale(.9)">${littleHouse(c, 50, 40)}</g></g>`);
    const water = P.add(`<g><path d="${c.poly(c.ell(0, 0, 92, 12, 24))}" fill="#bfe0ee" opacity=".9"/><path d="${c.poly(c.ell(-10, -2, 50, 5, 16))}" fill="#fff" opacity=".6"/><circle r="120" fill="url(#halo-glow)" opacity=".8"/></g>`);
    const front = P.add(`<g>${G.front}</g>`);
    P.add(`<g transform="translate(${CX} ${TOP})">${G.rim}</g>`);
    // the dish: a wide bowl, its inside seen from above
    const dishS = sheet();
    dishS.p(c.cut([[-110, -40], [110, -40], [70, -6], [30, 0], [-30, 0], [-70, -6]], 0.4, 6), C.sun);
    dishS.p(c.cut(c.ell(0, -40, 112, 22, 30), 0.4, 5), shade(C.sun, 0.12));
    P.add(`<g transform="translate(${DX} ${TOP})${DS !== 1 ? ` scale(${DS} 1)` : ''}">${dishS.out()}</g>`);
    const dishDirt = P.add(`<g><path d="${c.cut(c.ell(0, 0, 96, 16, 24), 0.8, 5)}" fill="${mix(C.soilDark, C.thorn2, 0.4)}"/><path d="${c.cut(c.ell(-30, -2, 9, 4, 10), 0.2, 3) + c.cut(c.ell(20, 3, 8, 4, 10), 0.2, 3) + c.cut(c.ell(50, -3, 7, 3, 10), 0.2, 3)}" fill="${mix(C.sun, C.clay, 0.3)}"/></g>`);
    const dishClean = P.add(`<g><path d="${c.poly(c.ell(0, 0, 96, 16, 24))}" fill="#e6f2f2"/><circle r="90" fill="url(#halo-glow)" opacity=".7"/></g>`);
    const glints = Array.from({ length: 8 }, (_, i) => ({ i, el: P.add(`<g>${sparkle(c, 12)}</g>`) }));

    /* the Pharisee with his cloth; the jug from above */
    const cloth = `<g transform="translate(2 4)"><path d="${c.cut([[-10, -6], [12, -8], [14, 10], [-8, 12]], 0.8, 4)}" fill="${C.linen}"/></g>`;
    const phar = S.puppet(P.add(vain(c, PH, { holdF: cloth })));
    const pharB = S.puppet(P.add(addToHead(vain(c, PH, { eyes: 'closed', holdF: cloth }), blindBand(c))));
    const jugEl = P.add(`<g>${hang2(`<g transform="rotate(0)">${jug(c, C.skyVeil)}</g>`, 20, 900)}</g>`);
    const pourEl = P.add(`<g><path d="${c.ribbon([[0, 0], [4, 60], [2, 130]], (u) => 8 - u * 3)}" fill="#cfe7f1" opacity=".9"/></g>`);
    const woe = woeDrop(P, c, 5, { x: S.portrait ? 1030 : 1230, y: 150 });   // phone: the woe-tag inside the screen

    return (t, time) => {
      const T = time;
      woe(es(t, 0.02, 0.25, ease.out) * (1 - es(t, 0.9, 1.05)), T);

      /* v25a — polishing the outside; sparkles */
      const polish = es(t, 0.1, 0.2) * (1 - es(t, 1.1, 1.3));
      const rub = polish * Math.sin(t * 40) * 12;
      const blind = es(t, 2.04, 2.1);
      const grope = bump(t, 2.1, 2.95);
      const fp = { x: PX + grope * 20, y: GY, s: 1.02, armF: 60 + polish * 20 + rub + grope * 30, armB: 10 + grope * 60, head: 6 * polish - grope * 6, lean: polish * 6, walk: grope > 0.1 ? t * 30 : undefined, amt: 0.4, blink: blinkAt(T, 2) };
      phar.set({ ...fp, o: 1 - blind });
      pharB.set({ ...fp, o: blind });

      /* v25b — the outside turns to glass: inside, the greed; the dish dark within */
      const see = es(t, 1.1, 1.35) * (1 - es(t, 3.45, 3.7));
      pose(front, { x: CX, y: TOP, o: 1 - see * 0.82 });
      const clean = es(t, 3.2, 3.5);
      pose(heap, { x: CX, y: TOP - 165 + clean * 40, s: 0.85 - clean * 0.3, o: 1 - clean });
      pose(water, { x: CX, y: TOP - G.H + 24 + (1 - clean) * 60, sx: 0.7 + clean * 0.3, sy: 1, o: clean });
      pose(dishDirt, { x: DX, y: TOP - 40, sx: DS, sy: 1, o: es(t, 1.2, 1.4) * (1 - es(t, 3.3, 3.55)) });
      pose(dishClean, { x: DX, y: TOP - 40, sx: DS, sy: 1, o: es(t, 3.35, 3.6) });
      pose(glow, { x: CX, y: TOP - 150, o: es(t, 3.5, 3.8) * (0.85 + (T ? Math.sin(T * 1.6) * 0.1 : 0)) });

      /* v26b — the jug pours clear water in from above */
      const jk = es(t, 3.0, 3.18, ease.out) * (1 - es(t, 3.7, 3.9, ease.in));
      const tip = es(t, 3.1, 3.22) * (1 - es(t, 3.5, 3.6));
      pose(jugEl, { x: CX + 40, y: lerp(-500, TOP - G.H - 150, jk), r: -tip * 70, o: jk > 0.01 ? 1 : 0 });
      pose(pourEl, { x: CX + 6, y: TOP - G.H - 140, sy: tip, o: tip > 0.05 ? 1 : 0 });

      /* sparkles: on the outside while he polishes (v25a), all over at the end */
      glints.forEach((g) => {
        const k = T ? (T * 0.7 + g.i / 8) % 1 : 0.5;
        const on = es(t, 0.35, 0.55) * (1 - es(t, 1.05, 1.2)) + es(t, 3.6, 3.85);
        const a = (g.i / 8) * PI * 2;
        pose(g.el, { x: CX + Math.cos(a) * 110, y: TOP - 160 + Math.sin(a) * 90, s: 0.5 + 0.5 * Math.sin(k * PI), o: on * Math.sin(k * PI) });
      });

      S.cam.x = 40;
      S.cam.z = 1.06;
      S.cam.y = -30 - es(t, 2.9, 3.2) * 20;
    };
  },
};
