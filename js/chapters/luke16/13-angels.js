// Łk 16,22 — the palace at nightfall. "The beggar died, and he was carried by the angels to Abraham's side": Lazarus
// sinks down on his mat at the gate, the dogs lie down by him; out of the night two angels come down, lift him up —
// now in white, his sores gone — and carry him up across the sky towards a golden light, where Abraham sits on a
// bright cloud with his arms open. "The rich man also died and was buried": in the court the lamps go out and the
// feast empties; the rich man sinks down on his cushion — and from below the stage a rock tomb rises in front of the
// court, and its round stone rolls shut.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { palaceSet, PAL, PURPLE, RICHMAN, LAZ_BLEST, ABRAHAM, lazarus, lying, angel, streetDog, tombRock, tombStone, platter, loaf, cup, glow, kf, es, ease, bump, seg, PI, FEAST, FEAST_NIGHT } from './lib.js';

const GY = PAL.GY, FL = PAL.FLOOR, TOP = PAL.TOP;
const RX = 868, LX = 570;
const AB = [640, 250];                 // Abraham's cloud
const TX = 1080;                       // the tomb

export default {
  id: 'lk16-angels',
  parable: true,
  beats: [
    { v: 22, text: 'Umarł żebrak, i aniołowie zanieśli go na łono Abrahama.' },
    { v: 22, cont: true, text: 'Umarł także bogacz i został pogrzebany.' },
  ],
  cam: { x: [-80, 60], y: [-120, 40], z: [1, 1.12] },
  build(S) {
    const P = palaceSet(S, { skyCols: FEAST, sky2: FEAST_NIGHT });
    const c = P.c;
    /* Abraham's side: a golden light and a cloud in the sky */
    const heavenL = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
    const light = heavenL.add(`<g opacity="0"><circle r="260" fill="url(#halo-glow)"/><circle r="140" fill="url(#halo-glow)"/></g>`);
    const abrL = S.layer({ par: 0.08, sh: 4, rise: 0 });
    const cl = abrL.add(`<g opacity="0">${cloud(c, 240, mix(C.cream, C.halo, 0.4), mix(C.halo, C.haloRim, 0.3))}</g>`);
    const abr = S.puppet(abrL.add(person(c, { ...ABRAHAM, pose: 'sit' })));
    /* the feast (as it was), the rich man */
    const guests = [[1060, { robe: C.linen2, mantle: C.ochre, hair: C.hair2, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun }], [1180, { robe: C.skyVeil, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun }]]
      .map(([x, o], i) => ({ i, x, p: S.puppet(P.hall.add(person(c, { ...o, pose: 'sit' }))) }));
    const food = P.table.add(`<g>${[[970, platter(c, { w: 60 })], [1110, loaf(c, 16)], [1130, cup(c, C.sun)], [1200, platter(c, { w: 50 })]].map(([x, m]) => `<g transform="translate(${x} ${TOP - 6})">${m}</g>`).join('')}</g>`);
    const cushion = P.act.add(`<g>${sheet().p(c.cut(c.blob(0, -8, 56, 12, 12, 0.1), 0.4, 4), PURPLE).x(c.ribbon([[-50, -6], [50, -6]], 2), C.sun, 'opacity=".8"').out()}</g>`);
    const rich = S.puppet(P.act.add(person(c, { ...RICHMAN, pose: 'sit' })));
    /* Lazarus at the gate: sitting, then lying dead; the dogs */
    P.act.add(`<g transform="translate(${LX + 150} ${GY + 6})">${sheet().p(c.cut([[-190, -4], [6, -6], [8, 6], [-192, 8]], 0.6, 8), mix(C.basket, C.wood3, 0.3)).out()}</g>`);
    const lazSit = S.puppet(P.act.add(lazarus(c, { pose: 'sit' })));
    const lazDead = P.act.add(`<g opacity="0"><g transform="translate(-14 -4)">${lying(lazarus(c, { eyes: 'closed' }), 0.86)}</g></g>`);
    const dogs = [0, 1].map((i) => P.act.add(`<g>${streetDog(c, { col: [mix(C.wood3, C.dune, 0.4), mix(C.stone2, C.wood2, 0.4)][i] })}</g>`));
    /* the angels and Lazarus in white */
    const flyL = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const soul = flyL.add(`<g opacity="0"><g transform="translate(-14 -4)">${lying(person(c, { ...LAZ_BLEST, eyes: 'closed' }), 0.8)}</g></g>`);
    const angels = [0, 1].map((i) => S.puppet(flyL.add(angel(c, { robe: C.linen, mantle: [C.halo, mix(C.skyVeil, C.halo, 0.4)][i] }))));
    const aglow = heavenL.add(`<g opacity="0">${glow(160, 0.9, 'halo-glow')}</g>`);
    /* the tomb that rises in front of the court */
    const tomb = P.trap.add(`<g>${tombRock(c, 340, 230)}</g>`);
    const stone = P.trap.add(`<g>${tombStone(c, 56)}</g>`);

    return (t, time) => {
      const T = time;
      const night = es(t, 0.05, 0.5);
      P.sk2.layer.fade(night * 0.85);
      const out = es(t, 1.05, 1.3);
      P.update(t, T, { lit: 1 - out, open: 0.25 });
      pose(P.feastGlow, { o: 1 - out });
      /* v22a — he dies; the angels carry him up */
      const die = es(t, 0.05, 0.15);
      lazSit.set({ x: LX + 40, y: GY + 2, s: 0.92, o: 1 - seg(t, 0.12, 0.14), armF: 30 - die * 20, armB: 10, head: die * 20, blink: 0.9 });
      pose(lazDead, { x: LX + 150, y: GY + 6, o: seg(t, 0.12, 0.14) });
      dogs.forEach((d, i) => pose(d, { x: LX - 20 - i * 60, y: GY + 10 + i * 8, s: 0.9 - i * 0.08, sy: (0.9 - i * 0.08) * (1 - es(t, 0.15, 0.3) * 0.35) }));
      const come = es(t, 0.18, 0.4, ease.out);
      const lift = es(t, 0.42, 0.9);
      const path = (k) => [lerp(LX + 40, AB[0] + 30, k), lerp(GY - 40, AB[1] + 60, k)];
      const [sx, sy] = path(lift);
      pose(soul, { x: sx + 80, y: sy, s: 1 - lift * 0.35, r: -lift * 10, o: es(t, 0.38, 0.45) * (1 - es(t, 0.95, 1.05)) });
      angels.forEach((a, i) => {
        const ax = sx + (i ? 110 : -60) * (1 - lift * 0.35), ay = sy + 20;
        const fx = lerp(i ? 1000 : 500, ax, come), fy = lerp(-300, ay, come);
        a.set({ x: fx, y: fy, s: 0.84 - lift * 0.3, flip: i === 1, o: come > 0.01 ? 1 - es(t, 0.95, 1.05) : 0, armF: 80, armB: 40, head: -6, blink: blinkAt(T, 4 + i) });
      });
      pose(aglow, { x: sx + 20, y: sy - 60, o: come * (1 - es(t, 0.9, 1.0)) });
      const hk = es(t, 0.45, 0.75);
      pose(light, { x: AB[0], y: AB[1], s: 0.6 + hk * 0.4, o: hk * (1 - es(t, 1.05, 1.3) * 0.7) });
      pose(cl, { x: AB[0], y: AB[1] + 50, o: hk });
      abr.set({ x: AB[0] + 10, y: AB[1] + 40, s: 0.62, o: hk, armF: 60 + es(t, 0.7, 0.85) * 30, armB: 40 + es(t, 0.7, 0.85) * 60, head: -4, blink: blinkAt(T, 1) });
      /* v22b — the feast empties; he dies; the tomb rises */
      guests.forEach((g) => g.p.set({ x: g.x, y: FL, s: 0.94, flip: true, o: 1 - es(t, 1.1, 1.3), armF: 30, armB: 10, head: 2, blink: blinkAt(T, 3 + g.i) }));
      pose(food, { o: 1 - es(t, 1.1, 1.3) });
      const fall = es(t, 1.15, 1.3);
      rich.set({ x: RX, y: FL + 10, s: 1.0, o: 1 - es(t, 1.5, 1.6), armF: 40 - fall * 30, armB: 10, head: fall * 24, lean: fall * 10, blink: fall > 0.3 ? 0.9 : blinkAt(T, 1) });
      pose(cushion, { x: RX, y: FL + 18, o: 1 - es(t, 1.5, 1.6) });
      const rise = es(t, 1.35, 1.6, ease.out);
      pose(tomb, { x: TX, y: lerp(GY + 420, GY + 10, rise) });
      const roll = es(t, 1.62, 1.8);
      pose(stone, { x: TX + lerp(110, 0, roll), y: lerp(GY + 420, GY + 10, rise) - 56, r: -roll * 200 });

      S.cam.x = kf(t, [[-0.5, -60], [0.3, -40], [0.9, -30], [1.1, 30]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.3, 0], [0.8, -40], [1.05, -30], [1.3, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.5, 1.02], [1.3, 1.08]]);
    };
  },
};
