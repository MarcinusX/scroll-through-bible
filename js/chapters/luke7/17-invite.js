// Łk 7,36–37 — evening in the town. Jesus comes down the street to a fine house with a painted cornice; its master,
// Simon the Pharisee, comes out of his gateway, bows and invites Him in to eat. The street flies up: the dining court
// inside, lamps on chains, the long low table with the guests. Jesus comes in through the gateway and takes His place
// on the couch at the end of the table. Then, in the gateway on the evening street, a woman of the town appears — a
// sinner, who has heard where He is — holding an alabaster flask that glows in her hands; the guests turn to stare.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  simonHouse, simonFacade, couch, SH, SIMON, GUESTS, SINNER, outLegs, cushion, alabaster, loaf, cup, bowl, jug, bubble, nameTag, headAt, voiceRings, kf, moving,
  tr, PI,
} from './lib.js';

const { FLOOR, JX, SEAT, TOP } = SH;
const GX = (SH.GATE[0] + SH.GATE[1]) / 2;

export default {
  id: 'lk7-invite',
  beats: [
    { v: 36, text: 'Jeden z faryzeuszów zaprosił Go do siebie na posiłek.' },
    { v: 36, cont: true, text: 'Wszedł więc do domu faryzeusza i zajął miejsce za stołem.' },
    { v: 37 },
  ],
  cam: { x: [-160, 140], y: [0, 200], z: [0.8, 1.2] },
  build(S) {
    const c = S.c;
    const SX = S.portrait ? 1130 : 1172;   // phone: Simon a little in from the right edge (as in the scenes that follow)
    const roomLs = [];
    const mkLayer = S.layer;
    S.layer = (o) => { const Ly = mkLayer(o); roomLs.push(Ly); return Ly; };
    const R = simonHouse(S, S.portrait ? { ceilTop: 0 } : {});
    /* the guests behind the table, the dishes */
    const guests = GUESTS.map((o, i) => ({ i, x: SH.GUESTS[i], p: S.puppet(R.backL.add(person(c, { ...o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    [[884, bowl(c, { food: 'bread', color: C.stone2 })], [930, cup(c)], [968, loaf(c, 15)], [1016, bowl(c, { food: 'fruit', color: C.skyVeil })], [1056, cup(c, C.clay)], [1090, loaf(c, 12)], [1118, `<g transform="scale(.5)">${jug(c)}</g>`]]
      .forEach(([x, m]) => R.tableL.add(`<g transform="translate(${x} ${TOP - 4})">${m}</g>`));
    /* the couch at the end of the table; Jesus walking in, and reclining */
    R.frontL.add(`<g transform="translate(${JX + 44} ${FLOOR + 2})">${couch(c, 270)}</g>`);
    R.frontL.add(`<g transform="translate(${SX} ${FLOOR + 2})">${cushion(c, 130, C.teal2)}</g>`);
    const legs = R.frontL.add(`<g>${outLegs(c, { robe: C.linen, skin: C.skin })}</g>`);
    const jSit = S.puppet(R.frontL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jWalk = S.puppet(R.frontL.add(person(c, CAST.jesus)));
    const simon = S.puppet(R.frontL.add(person(c, { ...SIMON, pose: 'sit' })));
    /* the woman in the gateway */
    const AB = alabaster(c, 40);
    const woman = S.puppet(R.frontL.add(person(c, { ...SINNER, holdF: `<g transform="rotate(-20) translate(0 8)">${AB.body}<g transform="translate(0 ${-AB.h})">${AB.neck}</g></g>` })));
    const wGlow = R.glowL.add(`<g opacity="0"><ellipse rx="110" ry="190" fill="url(#warm-glow)"/></g>`);
    const tagW = R.fx.add(`<g opacity="0">${nameTag(c, tr('kobieta z miasta', 'a woman of the city'), { size: 16 })}</g>`);
    S.layer = mkLayer;

    /* the street in front: a drop that flies up */
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(simonFacade(S));
    const jStreet = S.puppet(drop.add(person(c, CAST.jesus)));
    const sStreet = S.puppet(drop.add(person(c, SIMON)));
    const invite = drop.add(`<g opacity="0">${bubble(c, [tr('Zapraszam Cię do siebie', 'Come and eat'), tr('na posiłek!', 'with me!')], { size: 20, dir: 1 })}</g>`);
    const talk = voiceRings(drop, c, { n: 2, color: C.clay, r: 26, w: 4 });

    return (t, time) => {
      const T = time;
      const lit = 0.6 + es(t, 1.0, 1.6) * 0.4;
      R.update(t, T, { lit });
      R.sk2.fade(es(t, 1.2, 3.0) * 0.6);
      roomLs.forEach((Ly) => Ly.fade(seg(t, 0.9, 0.96)));

      /* v36a — in the street: Simon invites Him */
      const JK = [[0, -150], [0.5, 610]];
      const jx = kf(t, JK);
      jStreet.set({ x: jx, y: 742, s: 1.04, walk: moving(t, JK) ? jx * 0.045 : undefined, amt: 0.8, armF: 14 + bump(t, 0.6, 0.95) * 30, armB: 8, head: 4 * bump(t, 0.6, 0.95), blink: blinkAt(T) });
      const SK = [[0.25, 790], [0.45, 740]];
      const sx = kf(t, SK);
      const bow = bump(t, 0.45, 0.62);
      const wave = es(t, 0.55, 0.7);
      sStreet.set({ x: sx, y: 742, s: 1.02, flip: true, o: seg(t, 0.22, 0.28), walk: moving(t, SK) ? sx * 0.05 : undefined, armF: 20 + wave * 40, armB: 10 + wave * 90, lean: bow * 14, head: bow * 16, blink: blinkAt(T, 3) });
      const [shx, shy] = headAt(740, 742, 1.02, true);
      talk(shx, shy, bump(t, 0.5, 0.98) > 0.05 ? 0.8 : 0, T, { dir: -1, spread: 1.6 });
      const ib = es(t, 0.52, 0.64, ease.back) * (1 - es(t, 0.92, 0.98));
      pose(invite, { x: shx - 30, y: shy - 40, s: ib, o: ib > 0.02 ? 1 : 0 });
      drop.shift(0, -es(t, 0.96, 1.18, ease.in) * 1450);
      drop.fade(1 - seg(t, 1.14, 1.18));

      /* v36b — He goes into the Pharisee's house and takes His place at the table */
      const WK = [[1.12, GX], [1.5, JX]];
      const wx = kf(t, WK);
      const sat = es(t, 1.52, 1.58);
      jWalk.set({ x: wx, y: FLOOR, s: 1.0, o: seg(t, 1.1, 1.16) * (1 - sat), walk: moving(t, WK) ? wx * 0.05 : undefined, amt: 0.8, armF: 14, blink: blinkAt(T) });
      const look = es(t, 2.3, 2.5);
      jSit.set({ x: JX, y: FLOOR, s: 1.0, o: sat, armF: 30 + es(t, 1.6, 1.8) * 30, armB: 10, head: 4 - look * 4, blink: blinkAt(T) });
      pose(legs, { x: JX, y: FLOOR, sx: -1, o: sat });
      guests.forEach((g) => g.p.set({ x: g.x, y: SEAT, s: 0.9, flip: true, armF: 20 + bump(t, 1.3, 1.9) * 30, armB: 10, head: -4 + look * (g.i === 1 ? -8 : 6), blink: blinkAt(T, g.seed) }));
      const frown = es(t, 2.35, 2.55);
      simon.set({ x: SX, y: FLOOR, s: 0.96, flip: true, armF: 30 + bump(t, 1.5, 1.95) * 40, armB: 10 + frown * 60, head: 4 - frown * 8, lean: -frown * 4, blink: blinkAt(T, 3) });

      /* v37 — a woman of the town, a sinner, comes with an alabaster flask */
      const inW = seg(t, 2.04, 2.14);
      const step = es(t, 2.2, 2.5);
      const wx2 = GX + step * 40;
      woman.set({ x: wx2, y: FLOOR, s: 0.98, o: inW, walk: step > 0 && step < 1 ? wx2 * 0.05 : undefined, amt: 0.5, armF: 60, armB: 30, head: 10, blink: blinkAt(T, 6) });
      pose(wGlow, { x: GX, y: FLOOR - 140, o: inW * 0.8 });
      const tk = es(t, 2.3, 2.45, ease.back);
      const [whx, why] = headAt(wx2, FLOOR, 0.98);
      pose(tagW, { x: whx, y: why - 60, s: tk, o: tk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.2, 20], [2.0, 20], [2.3, -40]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [1.3, 1.16], [2.3, 1.18]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.3, 150]]);
      if (S.portrait && t > 1.1) { S.cam.x = kf(t, [[2.0, 130], [2.3, -150]]); S.cam.z = 0.82; }
    };
  },
};
