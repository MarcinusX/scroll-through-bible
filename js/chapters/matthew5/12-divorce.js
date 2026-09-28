// Mt 5,31–32 — a painted flat: a courtyard door in a village. "It was also said": the old tablet — a writing of
// divorce; the husband hands his wife the sealed scroll, and she goes out through the gate with her bundle.
// "But I tell you": above them hangs the golden knot that tied them; the paper scissors cut it, the two halves
// spring apart and go grey, and a little grey cloud settles over her — he has exposed her to adultery. Then
// another man comes and takes her hand: a ring comes down between them, and it cracks.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, cypress, grass, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SKY, LOOK, oldTablet, goldAnswer, scissors, snip, ring, greyCloud, man, hand, tr, PI, STRING } from './lib.js';

const G = 672;
const KNOT = [800, 290];

/** one half of the golden marriage knot (a loop); dir -1 left / 1 right; origin: the knot's centre */
function knotHalf(c, dir, col = C.sun) {
  const pts = [];
  for (let i = 0; i <= 30; i++) { const a = (i / 30) * PI; pts.push([dir * Math.sin(a) * 60, Math.sin(a * 2) * 22]); }
  pts.push([dir * -8, 0]);
  return sheet().p(c.ribbon(pts, 9), col).x(c.ribbon(pts.slice(4, 14), 3), '#fff8e0', 'opacity=".8"').out();
}

export default {
  id: 'mt5-divorce',
  enter: 'fly',
  beats: [
    { v: 31 },
    { v: 32, text: 'A ja wam powiadam: Każdy, kto oddala swoją żonę - poza wypadkiem nierządu - naraża ją na cudzołóstwo;' },
    { v: 32, cont: true, text: 'a kto by oddaloną wziął za żonę, dopuszcza się cudzołóstwa.' },
  ],
  cam: { x: [-30, 40], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.gold);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl = hanging(hangL, cloud(c, 160), { x: 1200, y: 160, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(hillsWith(c, { y: 530, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.2), trees: 14, treeColor: C.olive, treeH: 18, x0: -1400, x1: 3000 }).markup + house(c, 1150, 548, 80, 56) + house(c, 1250, 542, 70, 64));
    /* the courtyard wall with its gate, and the house */
    const yard = S.layer({ par: 0.3, sh: 3 });
    const y = sheet();
    y.p(c.cut([[-1400, 610], [3000, 604], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.stone, 0.35));
    y.p(c.cut([[-1400, 440], [660, 440], [660, G - 4], [-1400, G - 4]], 0.8, 12), C.plaster);
    y.p(c.cut([[180, 300], [620, 300], [620, 440], [180, 440]], 0.6, 10), C.plaster2);
    y.p(c.cut([[160, 284], [640, 284], [640, 304], [160, 304]], 0.4, 8), mix(C.clay, C.sand2, 0.4));
    y.p(c.cut([[540, G - 4], [540, 520], ...c.arc(590, 520, 50, 40, PI, 2 * PI, 10), [640, 520], [640, G - 4]], 0.4, 6), mix(C.soilDark, C.wood2, 0.3));
    y.p(c.cut([[300, 400], [300, 350], ...c.arc(330, 350, 30, 26, PI, 2 * PI, 8), [360, 400]], 0.4, 5), mix(C.soilDark, C.wood2, 0.3));
    yard.add(y.out() + olive(c, 1400, 640, 0.9) + cypress(c, 1320, 620, 110) + grass(c, { x0: 660, x1: 2400, y: 610, n: 30, h: 12, color: C.olive }));

    /* people */
    const P = S.layer({ par: 0.34, sh: 5 });
    const hus = S.puppet(P.add(person(c, LOOK.husband)));
    const wife = S.puppet(P.add(person(c, { ...LOOK.wife, holdB: `<g transform="translate(-4 6)">${sheet().p(c.cut(c.blob(0, 0, 18, 13, 10, 0.2), 0.5, 4), C.clayMantle).out()}</g>` })));
    const other = S.puppet(P.add(person(c, man(c, { robe: C.tealRobe, mantle: C.ochre }))));
    const bill = P.add(`<g>${sheet().p(c.cut(c.rect(-18, -9, 36, 18), 0.3, 4), C.parchment).p(c.cut(c.ell(-18, 0, 4, 10, 8), 0.2, 3) + c.cut(c.ell(18, 0, 4, 10, 8), 0.2, 3), shade(C.parchment, -0.12)).p(c.cut(c.blob(0, 2, 7, 6, 8, 0.2), 0.3, 3), C.terracotta).out()}</g>`);
    const cloudW = P.add(`<g>${greyCloud(c, 90, mix(C.storm, C.stone2, 0.4))}</g>`);
    const cloudO = P.add(`<g>${greyCloud(c, 80, mix(C.storm, C.stone2, 0.4))}</g>`);

    /* the knot, the scissors, the ring */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const glow = fly.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const kl = fly.add(`<g>${knotHalf(c, -1)}</g>`), kr = fly.add(`<g>${knotHalf(c, 1)}</g>`);
    const klG = fly.add(`<g>${knotHalf(c, -1, mix(C.stone2, C.rock2, 0.5))}</g>`), krG = fly.add(`<g>${knotHalf(c, 1, mix(C.stone2, C.rock2, 0.5))}</g>`);
    const str = fly.add(`<g><path d="M0 -2400V-24" stroke="${STRING}" stroke-width="1.3" fill="none"/></g>`);
    const sc = fly.add(`<g>${scissors(c, 80)}</g>`);
    const rg = fly.add(`<g><path d="M0 -2400V-30" stroke="${STRING}" stroke-width="1.3" fill="none"/>${ring(c, 24)}</g>`);
    const crack = rg.querySelector('[data-part=crack]');

    /* the old wash, the tablet, the answer */
    const wash = S.layer({ par: 0, sh: 1, flat: true });
    wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#c9ae86"/>`);
    const top = S.layer({ par: 0.3, sh: 6 });
    const tab = top.add(`<g>${oldTablet(c, tr(['List rozwodowy'], ['A writing of divorce']), { w: 320, size: 26 })}</g>`);
    const ans = top.add(`<g>${goldAnswer(c, tr('A Ja wam powiadam', 'But I tell you'), { size: 24 })}</g>`);

    return (t, time) => {
      const T = time;
      pose(cl, { x: 1200 + Math.sin(T * 0.1) * 20, y: 160, r: Math.sin(T * 0.6) });

      /* v31 — the writing of divorce; she goes out */
      wash.fade(0.34 * (1 - es(t, 0.9, 1.2)));
      const tk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 1.0, 1.2));
      pose(tab, { x: 800, y: lerp(-500, 140, tk) - es(t, 1.0, 1.2) * 300, r: Math.sin(T * 0.8) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const give = es(t, 0.12, 0.32), take = es(t, 0.3, 0.42);
      const go = es(t, 0.44, 0.72, (x) => x);
      const wx = lerp(760, 940, go);
      const look = es(t, 0.72, 0.8);
      const hx0 = 660;
      hus.set({ x: hx0, y: G + 8, s: 1.0, armF: 20 + give * 60 * (1 - take * 0.7), head: 4, blink: blinkAt(T, 1) });
      const [ghx, ghy] = hand(hx0, G + 8, 1.0, false, 20 + give * 60 * (1 - take * 0.7));
      const [wfx, wfy] = hand(wx, G + 10, 0.96, true, 30 + take * 30);
      pose(bill, { x: lerp(ghx + 10, wfx - 6, take), y: lerp(ghy - 6, wfy - 4, take), s: give > 0.01 ? 1 : 0, r: -10 });
      /* v32a — the knot is cut; the grey cloud over her; v32b — another man takes her hand; the ring cracks */
      const come = es(t, 2.08, 2.42, (x) => x), join = es(t, 2.42, 2.56);
      const ox = lerp(1260, 1040, come);
      wife.set({ x: wx, y: G + 10, s: 0.96, flip: go < 0.02 ? true : look > 0.5 && come < 0.5 ? true : false, walk: go > 0 && go < 1 ? wx * 0.06 : undefined, armF: 30 + take * 30 + join * 30, armB: 30, head: 6 + bump(t, 1.4, 1.9) * 8, blink: blinkAt(T, 2) });
      other.set({ x: ox, y: G + 12, s: 1.0, flip: true, walk: come > 0 && come < 1 ? ox * 0.06 : undefined, armF: 20 + join * 50, head: 2, o: seg(t, 2.04, 2.1), blink: blinkAt(T, 3) });

      const ak = es(t, 1.04, 1.28, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(ans, { x: 800, y: lerp(-300, 150, ak) - es(t, 1.9, 2.1) * 300, r: Math.sin(T * 0.9) * 1.2, o: ak > 0.01 ? 1 : 0 });
      const kk = es(t, 1.1, 1.3, ease.out);
      const cut = es(t, 1.38, 1.46), apart = es(t, 1.44, 1.66), grey = es(t, 1.5, 1.7);
      const ky = lerp(-400, KNOT[1] + 40, kk) + apart * 40;
      pose(str, { x: KNOT[0], y: lerp(-400, KNOT[1] + 40, kk), o: (kk > 0.01 ? 1 : 0) * (1 - cut) });
      pose(glow, { x: KNOT[0], y: ky, s: 1 - grey * 0.5, o: (kk > 0.01 ? 1 : 0) * (1 - grey) });
      [[kl, klG, -1], [kr, krG, 1]].forEach(([a, b, d]) => {
        const x = KNOT[0] + d * apart * 90, r = d * apart * 24;
        pose(a, { x, y: ky, r, o: (kk > 0.01 ? 1 : 0) * (1 - grey) });
        pose(b, { x, y: ky, r, o: (kk > 0.01 ? 1 : 0) * grey });
      });
      pose(sc, { x: KNOT[0] - 70, y: ky - 50, r: 30, o: es(t, 1.22, 1.3) * (1 - es(t, 1.5, 1.6)) });
      snip(sc, 50 * (1 - bump(t, 1.3, 1.48)));
      const cw = es(t, 1.56, 1.76, ease.back);
      pose(cloudW, { x: wx + 4, y: G - 250 + Math.sin(T * 1.2) * 3, s: cw, o: cw > 0.01 ? 0.9 : 0 });
      const rk = es(t, 2.46, 2.64, ease.back);
      pose(rg, { x: (wx + ox) / 2, y: lerp(-300, 330, rk), r: Math.sin(T * 0.9) * 2, o: rk > 0.01 ? 1 : 0 });
      fade(crack, es(t, 2.62, 2.7));
      const co = es(t, 2.6, 2.76, ease.back);
      pose(cloudO, { x: ox + 4, y: G - 250 + Math.sin(T * 1.3 + 1) * 3, s: co, o: co > 0.01 ? 0.9 : 0 });

      S.cam.x = es(t, 0.4, 0.8) * 20 + es(t, 2.0, 2.4) * 30;
      S.cam.z = 1.02;
      S.cam.y = -12;
    };
  },
};
