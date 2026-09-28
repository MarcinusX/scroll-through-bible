// Mt 5,40–42 — a painted flat of a Roman road. A man comes with a claim to take a traveller's tunic — the
// traveller takes off his cloak too and gives it to him. A Roman soldier makes him carry his pack for a mile: they
// set off, the road rolls past, the milestone "I" goes by and the soldier stops, astonished — but the traveller
// walks on with the pack to milestone "II". There a beggar asks, and he gives; a neighbour wants to borrow, and
// he does not turn away but hands him his purse.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, rock, sun, cloud, house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, milestone, pack, flyingCloak, soldier, coin, purse, bang, man, hand, PI } from './lib.js';

const G = 690;
const DX = 700;           // where the traveller walks (the road rolls past him)
const ROLL = 820;         // how far the road rolls in v41

export default {
  id: 'mt5-mile',
  enter: 'fly',
  beats: [
    { v: 40 },
    { v: 41 },
    { v: 42 },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.day);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 980, y: 170, len: 800 });
    const farL = S.layer({ par: 0.08, sh: 2, pad: 200 });
    farL.add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.2), x0: -1400, x1: 3400 }).markup);
    const midL = S.layer({ par: 0.16, sh: 3, pad: 500 });
    midL.add(hillsWith(c, { y: 530, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 18, x0: -1400, x1: 3800 }).markup + house(c, 1500, 548, 80, 56) + house(c, 1580, 540, 70, 64));
    /* the road with its milestones (the whole sheet rolls past) */
    const roadL = S.layer({ par: 0.3, sh: 3, pad: ROLL + 100 });
    const r = sheet();
    r.p(c.cut([[-1400, 612], [3800, 604], [3800, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.hillNear, 0.4));
    r.p(c.cut([[-1400, 660], [3800, 652], [3800, 720], [-1400, 728]], 0.6, 14), mix(C.stone, C.sand, 0.5));
    let joints = '';
    for (let x = -1400; x < 3800; x += 46) joints += c.ribbon([[x, 660], [x - 8, 726]], 1.2);
    r.x(joints, shade(C.stone, -0.2), 'opacity=".45"');
    roadL.add(r.out());
    roadL.add(olive(c, 300, 640, 0.8) + cypress(c, 1240, 626, 110) + olive(c, 1880, 640, 0.9) + rock(c, 2300, 650, 60, 20) + cypress(c, 2600, 626, 100) + grass(c, { x0: -800, x1: 3400, y: 612, n: 60, h: 12, color: C.olive }));
    roadL.add(`<g transform="translate(1000 668)">${milestone(c, 'I')}</g><g transform="translate(${DX + ROLL + 110} 668)">${milestone(c, 'II')}</g>`);

    /* people */
    const P = S.layer({ par: 0.34, sh: 5 });
    const lit = S.puppet(P.add(person(c, { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.sun })));
    const tunic = P.add(`<g>${sheet().p(c.cut([[-18, -26], [18, -26], [24, 20], [-24, 20]], 0.5, 5), C.linen2).out()}</g>`);
    const cloak = P.add(`<g>${flyingCloak(c, C.wheatRobe, 80)}</g>`);
    const sol = S.puppet(P.add(soldier(c, 1, { spear: 30 })));
    const bangE = P.add(`<g>${bang(c, C.terracotta, 1)}</g>`);
    const beggar = S.puppet(P.add(person(c, { ...LOOK.poor, pose: 'sit' })));
    const nb = S.puppet(P.add(person(c, man(c, { robe: C.tealRobe, mantle: null }))));
    const withM = S.puppet(P.add(person(c, { ...LOOK.shepherd })));
    const noM = S.puppet(P.add(person(c, { ...LOOK.shepherd, mantle: null })));
    const packE = P.add(`<g>${pack(c)}</g>`);
    const cn = P.add(`<g>${coin(c, 7)}</g>`);
    const pu = P.add(`<g>${purse(c)}</g>`);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1240, y: 140, r: Math.sin(T * 0.6) });
      pose(cl, { x: 980 + Math.sin(T * 0.1) * 20, y: 170, r: Math.sin(T * 0.6 + 1) });

      /* v41 — the road rolls past as they walk */
      const roll = es(t, 1.2, 1.9, (x) => x);
      const sh = -roll * ROLL;
      roadL.shift(sh, 0);
      midL.shift(sh * 0.4, 0);
      farL.shift(sh * 0.15, 0);
      const walking = roll > 0 && roll < 1;

      /* v40 — the tunic is claimed; he gives his cloak as well */
      const claim = es(t, 0.05, 0.3), off = es(t, 0.38, 0.46), give = es(t, 0.44, 0.66);
      const leave = es(t, 1.0, 1.3, (x) => x);
      const lx = lerp(lerp(420, 560, claim), 260, leave);
      lit.set({ x: lx, y: G + 8, s: 1.0, flip: leave > 0.01, walk: (claim > 0 && claim < 1) || (leave > 0 && leave < 1) ? lx * 0.05 : undefined, armF: 40 + claim * 40, armB: 20 + give * 40, head: -2, o: 1 - es(t, 1.2, 1.3), blink: blinkAt(T, 1) });
      const [thx, thy] = hand(lx, G + 8, 1.0, leave > 0.01, 40 + claim * 40);
      pose(tunic, { x: thx + 8, y: thy + 10, o: (1 - es(t, 1.2, 1.3)) });
      const cx = lerp(DX - 10, thx + 20, give), cy = lerp(G - 130, thy - 10, give) - Math.sin(give * PI) * 60;
      pose(cloak, { x: cx, y: cy, r: give * 40 - 20, s: 0.9, o: off * (1 - es(t, 1.2, 1.3)) });
      const DXs = DX;
      /* v41 — the soldier puts his pack on him; at "I" he stops, astonished; the traveller walks on */
      const come = es(t, 1.0, 1.2, (x) => x);
      const loaded = es(t, 1.15, 1.22);
      const passI = 1000 + sh;              // milestone I on screen
      const solX = t < 1.0 ? 1400 : t < 1.2 ? lerp(1100, DX + 90, come) : DX - 90 + (passI < DX - 60 ? passI - (DX - 60) : 0);
      const surprised = es(t, 1.6, 1.75);
      sol.set({ x: solX, y: G + 10, s: 1.0, flip: t < 1.2, walk: (come > 0 && come < 1) || (walking && passI >= DX - 60) ? solX * 0.05 + roll * 30 : undefined, armF: 30 + surprised * 50, armB: surprised * 60, head: -surprised * 6, o: seg(t, 0.98, 1.04), blink: blinkAt(T, 3) });
      pose(bangE, { x: solX + 20, y: G - 230, s: surprised, o: surprised > 0.01 ? 1 : 0 });
      const trav = { x: DXs, y: G + 12, s: 1.0, walk: walking ? roll * 50 : undefined, head: -2, blink: blinkAt(T, 2) };
      pose(packE, { x: DXs + 4, y: G - 132, o: loaded * (1 - es(t, 2.0, 2.1)) });

      /* v42 — he gives to the beggar, and lends to his neighbour */
      const bx = DX + ROLL + 190 + sh;
      beggar.set({ x: bx, y: G + 18, s: 0.9, flip: true, armF: 40 + es(t, 2.05, 2.2) * 40, head: 8 - es(t, 2.2, 2.4) * 12, blink: blinkAt(T, 4) });
      const gv = es(t, 2.12, 2.34);
      const [ghx, ghy] = hand(DXs, G + 12, 1.0, false, 60);
      pose(cn, { x: lerp(ghx, bx - 30, gv), y: lerp(ghy, G - 50, gv) - Math.sin(gv * PI) * 30, o: seg(t, 2.1, 2.14) });
      const nk = es(t, 2.3, 2.5, (x) => x);
      const nx = lerp(DX - 380, DX - 110, nk);
      const lend = es(t, 2.5, 2.66);
      nb.set({ x: nx, y: G + 16, s: 1.0, walk: nk > 0 && nk < 1 ? nx * 0.05 : undefined, armF: 30 + es(t, 2.4, 2.5) * 40 + lend * 10, o: seg(t, 2.28, 2.34), blink: blinkAt(T, 5) });
      const turnBack = es(t, 2.4, 2.46);
      const carry = loaded * (1 - es(t, 2.0, 2.1));
      const tArmF = 20 + give * 60 * (1 - es(t, 0.9, 1.05)) + carry * 40 + bump(t, 2.1, 2.4) * 50 + lend * 60;
      withM.set({ ...trav, flip: turnBack > 0.5, armF: tArmF, armB: carry * 30, o: 1 - off });
      noM.set({ ...trav, flip: turnBack > 0.5, armF: tArmF, armB: carry * 30, o: off });
      const [phx, phy] = hand(DXs, G + 12, 1.0, turnBack > 0.5, 20 + lend * 60);
      pose(pu, { x: lerp(phx, nx + 40, es(t, 2.56, 2.7)), y: lerp(phy + 6, G - 90, es(t, 2.56, 2.7)), s: 0.8, o: seg(t, 2.5, 2.54) });

      S.cam.z = 1.02;
      S.cam.y = -10;
    };
  },
};
