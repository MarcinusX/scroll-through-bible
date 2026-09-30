// Łk 15,23–24 — night at the farmstead: stars, the moon, strings of lanterns from the house to the gateway, a long
// table in the courtyard. "Bring the fattened calf and kill it": a servant leads in a plump calf with a garland
// round its neck, across the courtyard and away behind the house — and soon a thread of cooking smoke rises there.
// "…let us eat and celebrate": the lanterns light one by one, platters, loaves and cups come to the table and the
// household sits down. "…for this son of mine was dead and is alive again": the father lifts his cup, his hand on
// his son's shoulder, and a round picture comes down: a bare grey tree that bursts into leaf and blossom. "…he was
// lost and is found": a second picture: a dark night over a road — and the dark lifts off it, and there is the son
// on the road home in the morning light. "And they began to celebrate": pipe, tambourine and harp strike up, the
// servants dance in the courtyard, music notes rise into the night and the lanterns swing.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import {
  farmSet, FM, FATHER, YOUNGER_ROBED, ELDER, SERVANTS, calf, lowTable, platter, steam, loaf, cup, bowl, jug, flute, tambourine, harp, note, roundel, figure, deadTree, glow, heart, sparkle, flyAt,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, NIGHT, STRING,
} from './lib.js';

const GY = FM.GY;
const TBL = 540;                 // the table's middle
const SEATS = [[420, false, SERVANTS[3]], [480, false, SERVANTS[2]], [600, true, SERVANTS[0]], [660, true, SERVANTS[1]]];
const SON = [540, false];
const FX = 760;

/** a bare tree that is dead, for a round picture; plus its leaves and blossoms as separate pieces */
function treePlate(c, id) {
  const inner = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.skyBlue, C.cream, 0.35)}"/>`
    + sheet().p(c.cut([[-90, 40], [90, 34], [90, 90], [-90, 90]], 0.5, 8), mix(C.hillNear, C.sand2, 0.3)).out()
    + `<g transform="translate(0 44)">${deadTree(c, 100, mix(C.wood2, C.rock3, 0.35))}</g>`;
  return roundel(c, inner, { r: 70, id });
}
function leaves(c) {
  const s = sheet();
  let d = '', d2 = '', fl = '';
  for (let i = 0; i < 11; i++) {
    const x = c.rr(-44, 44), y = c.rr(-50, -4) - 44 + 44 - Math.abs(x) * 0.2;
    const b = c.cut(c.blob(x, y - 44, c.rr(12, 18), c.rr(9, 13), 9, 0.2), 0.4, 4);
    if (i % 2) d += b; else d2 += b;
    if (i % 3 === 0) fl += c.cut(c.star(x + c.rr(-6, 6), y - 50, 5, 2.4, 5, i), 0.2, 2);
  }
  return s.p(d2, C.moss).p(d, C.leaf).p(fl, C.roseRobe).out();
}
/** the son lost at night on the road (dark), found in the morning (light): the light picture, and its dark cover */
function roadPlate(c, id) {
  const inner = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.dawn, C.cream, 0.3)}"/>`
    + sheet().p(c.cut([[-90, 20], [-20, 10], [40, 18], [90, 6], [90, 90], [-90, 90]], 0.5, 8), mix(C.hillNear, C.sand2, 0.3)).p(c.ribbon([[-90, 70], [-30, 50], [20, 40], [60, 26], [80, 18]], (u) => 20 - u * 14), mix(C.sand, C.dune, 0.25)).p(c.cut(c.rect(56, -8, 24, 22), 0.3, 3), C.plaster).out()
    + figure(c, YOUNGER_ROBED, { x: -10, y: 50, s: 0.36, head: -4 });
  return roundel(c, inner, { r: 70, id });
}

export default {
  id: 'lk15-feast',
  parable: true,
  beats: [
    { v: 23, text: 'Przyprowadźcie utuczone cielę i zabijcie:' },
    { v: 23, cont: true, text: 'będziemy ucztować i bawić się,' },
    { v: 24, text: 'ponieważ ten mój syn był umarły, a znów ożył;' },
    { v: 24, cont: true, text: 'zaginął, a odnalazł się".' },
    { v: 24, cont: true, text: 'I zaczęli się bawić.' },
  ],
  cam: { x: [-260, 120], y: [-30, 50], z: [1, 1.12] },
  build(S) {
    const F = farmSet(S, { skyCols: NIGHT, moonAt: [1240, 150], starsN: 110, tint: 0.26, tintCol: mix(C.night, C.indigo, 0.5), lit: 1, lanterns: true });
    const c = F.c;
    const L = F.people;

    /* the calf led away; smoke behind the house */
    const smoke = F.house.add(`<g opacity="0">${steam(c, mix(C.stone, C.cream, 0.4))}</g>`);
    const calfEl = L.add(`<g>${calf(c)}</g>`);
    const leader = S.puppet(L.add(person(c, { ...SERVANTS[0], holdF: `<path d="${c.ribbon([[0, 0], [30, 10]], 2)}" fill="${C.rope}"/>` })));
    /* the household at table */
    const seated = SEATS.map(([x, flip, o], i) => ({ x, i, el: L.add(`<g>${figure(c, { ...o, pose: 'sit' }, { x: 0, y: 0, s: 0.92, flip, armF: 40 + i * 8, armB: 10, head: flip ? 4 : -4 })}</g>`) }));
    const son = S.puppet(L.add(person(c, { ...YOUNGER_ROBED, pose: 'sit' })));
    const father = S.puppet(L.add(person(c, { ...FATHER, holdF: `<g transform="translate(0 2)">${cup(c, C.sun)}</g>` })));
    const table = F.front.add(`<g transform="translate(${TBL} ${GY + 22})">${lowTable(c, 380, 44)}</g>`);
    const dishes = [
      [TBL + 84, -46, platter(c, 100)], [TBL - 120, -48, loaf(c, 14)], [TBL - 70, -46, cup(c)], [TBL - 20, -46, cup(c, C.ochre)], [TBL + 130, -48, loaf(c, 13)], [TBL - 160, -46, bowl(c, { food: 'fruit' })], [TBL + 160, -46, jug(c)],
    ].map(([x, dy, m], i) => ({ i, x, y: GY + 22 + dy, el: F.front.add(`<g opacity="0">${m}</g>`) }));
    const dishSteam = F.front.add(`<g opacity="0">${steam(c)}</g>`);
    /* the dancers and players (they come in at the end) */
    const players = [
      { x: 880, o: SERVANTS[3], hold: `<g transform="rotate(-70) translate(-6 -10) scale(1.3)">${flute(c)}</g>`, a: 90, pose: 'stand' },
      { x: 990, o: SERVANTS[2], hold: `<g transform="translate(2 6)">${tambourine(c)}</g>`, a: 130, pose: 'stand', flip: true },
      { x: 1090, o: SERVANTS[1], hold: `<g transform="rotate(-20) translate(0 -10) scale(.9)">${harp(c)}</g>`, a: 60, pose: 'stand', flip: true },
    ].map((p, i) => ({ ...p, i, p: S.puppet(L.add(person(c, { ...p.o, holdF: p.hold }))) }));
    const notes = Array.from({ length: 8 }, (_, i) => ({ i, el: F.fx.add(`<g opacity="0">${note(c, [C.terracotta, C.plumRobe, C.teal2][i % 3])}</g>`) }));

    /* the two round pictures */
    const plL = S.layer({ par: 0.22, sh: 6 });
    const oc = makeCutter('lk15-feast-plates');
    const treeP = plL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-76" stroke="${STRING}" stroke-width="1.2" fill="none"/>${treePlate(oc, S.id('tree'))}</g>`);
    const leafEl = plL.add(`<g opacity="0">${leaves(oc)}</g>`);
    const roadP = plL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-76" stroke="${STRING}" stroke-width="1.2" fill="none"/>${roadPlate(oc, S.id('road'))}</g>`);
    const darkCover = plL.add(`<g opacity="0"><circle r="70" fill="${mix(C.night, C.indigo, 0.3)}"/><path d="${oc.poly(oc.circ(-30, -30, 2, 6)) + oc.poly(oc.circ(20, -44, 1.6, 6)) + oc.poly(oc.circ(40, -10, 1.8, 6))}" fill="${C.star}"/>${figure(oc, { ...YOUNGER_ROBED, robe: mix(C.stone2, C.night, 0.5), mantle: mix(C.stone2, C.night, 0.6), skin: mix(C.skin3, C.night, 0.5), hair: C.night2 }, { x: -10, y: 50, s: 0.36, head: 10 })}</g>`);
    const PL = [[660, 250], [900, 250]];

    return (t, time) => {
      const T = time;
      F.update(T);

      /* lanterns light up one by one (v23b), the glows behind */
      F.lampGlows.forEach((g, i) => fade(g, es(t, 1.05 + i * 0.07, 1.15 + i * 0.07)));
      F.lamps.forEach((lp, i) => pose(lp.el, { x: lp.x, y: lp.y, r: T ? Math.sin(T * 0.8 + i) * (2 + es(t, 4.0, 4.2) * 4) : 0 }));

      /* v23a — the fattened calf led across and away */
      const CK = [[0.04, 1200], [0.9, 200]];
      const cx = kf(t, CK, (x) => x);
      pose(calfEl, { x: cx + 70, y: GY - 2, sx: -1, s: 0.95, o: 1 - es(t, 0.86, 0.92) });
      leader.set({ x: cx, y: GY, s: 0.96, flip: true, o: 1 - es(t, 0.86, 0.92), walk: t < 0.9 ? cx * 0.06 : undefined, armF: 40, armB: 10, blink: blinkAt(T, 4) });
      pose(smoke, { x: 650, y: FM.TOP - 30, s: 1.4, o: es(t, 1.0, 1.3) * (1 - es(t, 4.0, 4.3) * 0.5) });

      /* v23b — the table fills, they sit down */
      dishes.forEach((d) => pose(d.el, { x: d.x, y: d.y - (1 - es(t, 1.1 + d.i * 0.06, 1.3 + d.i * 0.06)) * 20, o: es(t, 1.1 + d.i * 0.06, 1.2 + d.i * 0.06) }));
      pose(dishSteam, { x: TBL + 84, y: GY - 34, o: es(t, 1.3, 1.5) });
      seated.forEach((s) => pose(s.el, { x: s.x, y: GY, o: es(t, 1.35 + s.i * 0.06, 1.45 + s.i * 0.06) }));
      const cheer = es(t, 4.05, 4.2);
      son.set({ x: SON[0], y: GY, s: 0.96, armF: 40 + cheer * 60, armB: 10 + cheer * 100, head: -es(t, 2.0, 2.2) * 6, bob: -cheer * Math.abs(Math.sin(t * PI * 5)) * 4, blink: blinkAt(T, 1) });

      /* v24a — "this my son was dead and is alive": the cup lifted, the tree in blossom */
      const toast = es(t, 2.05, 2.25);
      father.set({ x: FX, y: GY, s: 1.02, flip: true, armF: 30 + toast * 100 - cheer * 20, armB: 20 + es(t, 2.1, 2.3) * 60 + cheer * 60, head: -toast * 6, bob: -cheer * Math.abs(Math.sin(t * PI * 5 + 1)) * 4, blink: blinkAt(T) });
      const tp = es(t, 2.08, 2.4, ease.out) * (1 - es(t, 4.0, 4.3, ease.in));
      flyAt(treeP, tp, PL[0][0], PL[0][1], T, 0);
      const bloom = es(t, 2.45, 2.75, ease.back);
      pose(leafEl, { x: PL[0][0], y: PL[0][1] + 44 + (1 - tp) * -1500, s: Math.max(0.001, bloom * tp), o: bloom > 0.01 && tp > 0.5 ? 1 : 0 });

      /* v24b — "he was lost and is found": the dark lifts off the road */
      const rp = es(t, 3.06, 3.36, ease.out) * (1 - es(t, 4.0, 4.3, ease.in));
      flyAt(roadP, rp, PL[1][0], PL[1][1], T, 1);
      pose(darkCover, { x: PL[1][0], y: PL[1][1] + (1 - rp) * -1500, o: rp > 0.5 ? 1 - es(t, 3.45, 3.7) : 0 });

      /* v24c — they begin to celebrate */
      players.forEach((p) => {
        const inn = es(t, 4.02 + p.i * 0.05, 4.22 + p.i * 0.05);
        const d = Math.sin(t * PI * 6 + p.i * 1.3);
        p.p.set({ x: p.x + (1 - inn) * 260, y: GY, s: 0.96, flip: p.flip, o: inn, armF: p.a + d * 12, armB: 60 + d * 40 + (p.i === 1 ? 60 : 0), head: d * 4, bob: -Math.abs(d) * 7 * inn, blink: blinkAt(T, p.i + 3) });
      });
      notes.forEach((n) => {
        const k = ((t - 4.1) * 1.6 + n.i / 8) % 1;
        const on = t > 4.1 ? 1 : 0;
        pose(n.el, { x: 860 + (n.i % 4) * 70 + Math.sin(k * 6 + n.i) * 16, y: 520 - k * 220, s: 0.9 + k * 0.4, r: Math.sin(k * 5 + n.i) * 14, o: on * Math.sin(k * PI) });
      });

      S.cam.x = kf(t, [[0, 40], [0.9, -200], [1.3, -240], [2.0, -170], [3.6, -120], [4.0, -20], [4.5, 40]]);
      S.cam.y = kf(t, [[0, 30], [2.0, 0], [3.6, 0], [4.3, 30]]);
      S.cam.z = kf(t, [[0, 1.02], [1.3, 1.08], [2.0, 1.02], [4.0, 1.02], [4.6, 1.08]]);
    };
  },
};
