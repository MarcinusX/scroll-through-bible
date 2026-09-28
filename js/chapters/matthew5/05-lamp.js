// Mt 5,15–16 — a painted flat of a village at night: a house cut open like a doll's house, and the street beside
// it. The mother lights a little oil lamp; the father brings the bushel basket to cover it — no: it is taken
// away, and the lamp goes up on the lampstand, and the whole house is lit. "Let your light shine before men":
// the door opens, the light runs out into the street, the boy carries bread to the beggar by the wall, and the
// neighbours who see it lift their hands to the Father in heaven, as light comes down over the street.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { house, stars, moon, band } from '../../assets/nature.js';
import { lampstand } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, hand, heldLamp, smallFlame, bushelBasket, loaf, beam, folk, tint, DY, PI } from './lib.js';

const FLOOR = 640, X0 = 300, X1 = 900, ROOF = 300;
const STAND = [650, FLOOR];

export default {
  id: 'mt5-lamp',
  enter: 'fly',
  beats: [
    { v: 15 },
    { v: 16 },
  ],
  cam: { x: [-60, 80], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const N = (m, k = 0.35) => tint(m, C.indigo, k);
    const sk = sky(S, SKY.night);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 460, n: 150 }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 30)}`, { x: 1120, y: 150, len: 800 });

    /* the village behind */
    const back = S.layer({ par: 0.12, sh: 2 });
    back.add(N(band(c, { y: 520, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillFar, x0: -1400, x1: 3000 }).markup, 0.5));
    let vh = '';
    [[960, 560, 90, 70], [1060, 546, 70, 84], [1160, 560, 100, 62], [1290, 552, 80, 76], [-40, 560, 90, 70], [80, 548, 80, 80], [180, 560, 90, 60]].forEach(([x, y, w, h]) => { vh += house(c, x, y, w, h, { stairs: false }); });
    back.add(N(vh, 0.45));

    /* the street */
    const street = S.layer({ par: 0.3, sh: 3 });
    street.add(N(sheet().p(c.cut([[-1400, 640], [3000, 632], [3000, 1800], [-1400, 1800]], 0.8, 14), mix(C.sand, C.stone, 0.35)).x(c.ribbon([[900, 700], [1500, 690]], 2), shade(C.sand, -0.2), 'opacity=".5"').out(), 0.35));
    // the neighbour's wall where the beggar sits
    street.add(N(house(c, 1010, 650, 170, 150, { stairs: false }), 0.3));

    /* the house, cut open */
    const houseL = S.layer({ par: 0.34, sh: 4 });
    const h = sheet();
    h.p(c.cut([[X0, ROOF], [X1, ROOF], [X1, FLOOR + 6], [X0, FLOOR + 6]], 0.8, 12), C.plaster);
    let patch = '';
    for (let i = 0; i < 8; i++) patch += c.cut(c.blob(c.rr(X0 + 40, X1 - 40), c.rr(ROOF + 40, FLOOR - 60), c.rr(20, 50), c.rr(10, 22), 10, 0.2), 0.6, 6);
    h.x(patch, C.plaster2, 'opacity=".6"');
    h.p(c.cut([[X0, FLOOR - 50], [X1, FLOOR - 50], [X1, FLOOR + 6], [X0, FLOOR + 6]], 0.6, 10), C.plaster2);
    // a window and a shelf with jars
    h.p(c.cut([[430, 470], [430, 410], ...c.arc(460, 410, 30, 26, PI, 2 * PI, 8), [490, 470]], 0.4, 5), mix(C.night, C.indigo, 0.3));
    h.p(c.cut(c.rect(730, 430, 110, 8), 0.3, 6), C.wood2);
    h.p(c.cut([[745, 430], [742, 404], [756, 396], [770, 404], [767, 430]], 0.3, 4) + c.cut([[790, 430], [788, 414], [806, 410], [822, 414], [820, 430]], 0.3, 4), C.pot);
    // the floor and a mat
    h.p(c.cut([[X0 - 20, FLOOR], [X1 + 20, FLOOR], [X1 + 40, FLOOR + 50], [X0 - 40, FLOOR + 50]], 0.6, 10), mix(C.sand2, C.stone2, 0.4));
    h.p(c.cut(c.ell(480, FLOOR + 14, 90, 12, 18), 0.5, 6), C.curtain);
    houseL.add(h.out());
    // the cut walls, the front wall with its door, the roof slab
    const w = sheet();
    w.p(c.cut([[X0 - 28, ROOF - 4], [X0, ROOF - 4], [X0, FLOOR + 8], [X0 - 28, FLOOR + 8]], 0.5, 8), shade(C.plaster2, -0.08));
    w.p(c.cut([[X1, ROOF - 4], [X1 + 100, ROOF - 4], [X1 + 100, FLOOR + 8], [X1, FLOOR + 8]], 0.6, 8) + c.hole([[X1 + 20, FLOOR + 2], [X1 + 20, FLOOR - 130], ...c.arc(X1 + 48, FLOOR - 130, 28, 26, PI, 2 * PI, 8), [X1 + 76, FLOOR - 130], [X1 + 76, FLOOR + 2]], 0.3, 6), C.plaster);
    w.p(c.cut([[X0 - 44, ROOF - 36], [X1 + 116, ROOF - 36], [X1 + 116, ROOF + 2], [X0 - 44, ROOF + 2]], 0.6, 10), mix(C.clay, C.sand2, 0.4));
    let ends = '';
    for (let x = X0 - 30; x < X1 + 110; x += 38) ends += c.cut(c.circ(x, ROOF - 14, 6, 10), 0.3, 3);
    w.x(ends, C.wood2, 'opacity=".8"');
    w.p(c.cut([[X0 - 44, ROOF - 58], [X0 - 20, ROOF - 58], [X0 - 20, ROOF - 36], [X0 - 44, ROOF - 36]], 0.4, 5) + c.cut([[X1 + 92, ROOF - 58], [X1 + 116, ROOF - 58], [X1 + 116, ROOF - 36], [X1 + 92, ROOF - 36]], 0.4, 5), mix(C.clay, C.sand2, 0.3));
    houseL.add(w.out());
    houseL.add(sheet().p(c.cut([[X1 + 20, FLOOR], [X1 + 20, FLOOR - 130], ...c.arc(X1 + 48, FLOOR - 130, 28, 26, PI, 2 * PI, 8), [X1 + 76, FLOOR - 130], [X1 + 76, FLOOR]], 0.3, 6), mix(C.night, C.indigo, 0.3)).out());
    const standEl = houseL.add(`<g transform="translate(${STAND[0]} ${STAND[1]})">${lampstand(c, 150)}</g>`);

    /* the family */
    const P = S.layer({ par: 0.34, sh: 5 });
    const child = S.puppet(P.add(person(c, { ...LOOK.child, pose: 'sit' })));
    const mother = S.puppet(P.add(person(c, { ...LOOK.wife, pose: 'kneel' })));
    const father = S.puppet(P.add(person(c, LOOK.husband)));
    const boy = S.puppet(P.add(person(c, { ...LOOK.child, robe: C.sageRobe })));
    const bread = P.add(`<g>${loaf(c, 12)}</g>`);
    const glow = P.add(`<g><circle r="260" fill="url(#warm-glow)"/></g>`);
    const lamp = P.add(`<g>${heldLamp(c)}</g>`);
    const basket = P.add(`<g>${bushelBasket(c, 76, 60)}</g>`);
    // the dark of the room (one sheet, faded)
    const darkL = S.layer({ par: 0.34, sh: 1, flat: true });
    const dark = darkL.add(`<g><rect x="${X0}" y="${ROOF}" width="${X1 - X0}" height="${FLOOR - ROOF + 50}" fill="${C.night2}"/></g>`);
    // the door leaf and the light running out into the street
    const doorL = S.layer({ par: 0.34, sh: 4 });
    const spill = doorL.add(`<g><path d="${c.poly([[0, -150], [56, -150], [300, 70], [-40, 70]])}" fill="#fff0c0" opacity=".32"/><path d="${c.cut(c.ell(40, 40, 170, 30, 20), 0.5, 8)}" fill="#fff0c0" opacity=".3"/></g>`);
    const door = doorL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -130], ...c.arc(28, -130, 28, 26, PI, 1.5 * PI, 5), [56, -156], [56, 0]], 0.4, 6), C.wood2).x(c.ribbon([[4, -110], [52, -110]], 3) + c.ribbon([[4, -24], [52, -24]], 3), shade(C.wood2, -0.3)).out()}</g>`);

    /* the street people */
    const SP = S.layer({ par: 0.34, sh: 5 });
    const beggar = S.puppet(SP.add(person(c, { ...LOOK.poor, pose: 'sit' })));
    const NB = [[1105, 0], [1165, 1]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(SP.add(person(c, folk(c, i === 0)))) }));
    const skyBeam = SP.add(`<g>${beam(c, 80, 300, 700)}</g>`);

    return (t, time) => {
      const T = time;
      pose(moonEl, { x: 1120, y: 150, r: Math.sin(T * 0.6) });

      /* v15 — lit; the basket comes; taken away; the lamp on the stand; the whole house lit */
      const lit = es(t, 0.06, 0.16);
      const cover = es(t, 0.18, 0.32) * (1 - es(t, 0.4, 0.52));
      const up = es(t, 0.5, 0.64);
      const onStand = es(t, 0.6, 0.72);
      const lx = lerp(606, STAND[0] + 2, up), ly = lerp(FLOOR - 2, STAND[1] - 152, up) - Math.sin(up * PI) * 20;
      const covered = es(t, 0.26, 0.32) * (1 - es(t, 0.4, 0.46));
      const bright = lit * (1 - covered) * (0.35 + onStand * 0.65);
      pose(lamp, { x: lx - 4, y: ly, s: 1.4, o: 1 });
      pose(glow, { x: lx + 20, y: ly - 20, s: 0.5 + bright * 0.9 + Math.sin(T * 5) * 0.02, o: bright });
      pose(dark, { o: 0.62 * (1 - bright * 0.85) + (1 - lit) * 0.05 });
      // the father brings the basket, holds it over the lamp, then puts it aside
      const bx = lerp(lerp(760, 612, es(t, 0.18, 0.3)), 860, es(t, 0.42, 0.56));
      const by = lerp(lerp(560, FLOOR - 2, es(t, 0.2, 0.32)), FLOOR, es(t, 0.42, 0.56)) - bump(t, 0.38, 0.5) * 70;
      pose(basket, { x: bx, y: by, o: 1 });
      const fx = lerp(820, 690, es(t, 0.14, 0.3)) + es(t, 0.42, 0.56) * 90;
      father.set({ x: fx, y: FLOOR + 8, s: 1, flip: true, walk: (t > 0.14 && t < 0.3) || (t > 0.42 && t < 0.56) ? fx * 0.05 : undefined, armF: 30 + cover * 40 + bump(t, 0.38, 0.52) * 40, armB: 10 + cover * 30, head: 8 * cover, blink: blinkAt(T, 2) });
      const reach = bump(t, 0.02, 0.2) + bump(t, 0.46, 0.66);
      mother.set({ x: 540, y: FLOOR + 8, s: 1, armF: 30 + reach * 50 + up * 40 * (1 - es(t, 0.64, 0.72)), armB: 10 + es(t, 0.66, 0.74) * 20, head: 10 - onStand * 18, blink: blinkAt(T, 3) });
      child.set({ x: 440, y: FLOOR + 14, s: 0.62, armF: 20 + onStand * 40, head: 6 - onStand * 14, blink: blinkAt(T, 4) });

      /* v16 — the door opens; the boy takes bread to the beggar; the neighbours praise the Father */
      const dk = es(t, 1.04, 1.2);
      pose(door, { x: X1 + 20, y: FLOOR, sx: Math.max(0.1, 1 - dk * 0.9), o: 1 });
      pose(spill, { x: X1 + 20, y: FLOOR, o: dk * bright });
      const walkK = es(t, 1.12, 1.46, (x) => x);
      const bxk = lerp(720, 960, walkK);
      const give = es(t, 1.46, 1.58);
      boy.set({ x: bxk, y: FLOOR + 22, s: 0.66, walk: walkK > 0 && walkK < 1 ? bxk * 0.08 : undefined, armF: 50 + give * 30, o: seg(t, 1.1, 1.16), blink: blinkAt(T, 5) });
      const [hx, hy] = hand(bxk, FLOOR + 22, 0.66, false, 50 + give * 30);
      const bgx = lerp(hx + 6, 1006, es(t, 1.52, 1.62)), bgy = lerp(hy + 4, FLOOR - 16, es(t, 1.52, 1.62));
      pose(bread, { x: bgx, y: bgy, o: seg(t, 1.1, 1.16) });
      beggar.set({ x: 1030, y: FLOOR + 30, s: 0.84, flip: true, armF: 30 + give * 50, head: 10 - give * 16, blink: blinkAt(T, 6) });
      NB.forEach((n) => {
        const see = es(t, 1.4 + n.i * 0.06, 1.56 + n.i * 0.06), praise = es(t, 1.56 + n.i * 0.05, 1.72 + n.i * 0.05);
        n.p.set({ x: n.x, y: FLOOR + 18, s: 0.86, flip: see > 0.5, armB: praise * 150, armF: 20 + praise * 70, head: -praise * 18, blink: blinkAt(T, n.seed) });
      });
      pose(skyBeam, { x: 1080, y: -60, r: 6, sx: 0.6, o: es(t, 1.55, 1.75) * 0.45 });
      starL.fade(0.7 + es(t, 1.55, 1.75) * 0.3);

      S.cam.x = lerp(-40, 60, es(t, 1.0, 1.5));
      S.cam.z = 1.04 + es(t, 0.4, 0.7) * 0.02;
    };
  },
};
