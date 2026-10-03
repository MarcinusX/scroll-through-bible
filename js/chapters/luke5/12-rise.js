// Łk 5,25–26 — at once the man sits up on his bed in front of them all, stands, rolls up the bed he was lying on and
// swings it onto his shoulders, and walks out — through the door, down the steps and away up the street with his arms
// raised, glorifying God. Amazement takes hold of everyone: inside and outside the arms go up, even the teachers on
// the bench stare; and full of awe they say, "We have seen extraordinary things today!" as the evening comes on.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  houseSet, houseCast, HS, JH, BED, matWithMan, pallet, blanket, rolledMat, addToBody, HEALED, FRIENDS, sparkle, bubble, headAt, kf, moving,
  DAY, EVENING, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const AT_HOLE = [HS.HOLE0 - 34, HS.HOLE1 + 34, HS.HOLE0 - 74, HS.HOLE1 + 74];
const ROOFY = HS.ROOF - 2;
const S_ = 0.8;
const carried = (c) => `<g transform="translate(-2 -150) rotate(-6)">${rolledMat(c, 104)}</g>`;

export default {
  id: 'lk5-rise',
  beats: [
    { v: 25 },
    { v: 26, text: 'Wtedy zdumienie ogarnęło wszystkich; wielbili Boga' },
    { v: 26, cont: true, text: 'i pełni bojaźni mówili: «Przedziwne rzeczy widzieliśmy dzisiaj».' },
  ],
  cam: { x: [-80, 700], y: [-60, 100], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    const H = houseSet(S, { skyCols: DAY, sky2: EVENING });
    H.tiles.forEach((tl) => pose(tl.el, { o: 0 }));
    H.laths.forEach((l) => pose(l.el, { o: 0 }));
    const P = houseCast(S, H);
    const shaft = H.glowL.add(`<path d="M${HS.HOLE0 + 10} ${HS.CEIL}L${HS.HOLE1 - 10} ${HS.CEIL}L${HS.HOLE1 + 60} ${HS.FLOOR}L${HS.HOLE0 - 40} ${HS.FLOOR}Z" fill="#fff3cf" opacity=".4"/>`);
    // the bed with the man lying on it; the empty bed; the man sitting up, standing, carrying his rolled bed
    const bedMan = H.lowL.add(`<g>${matWithMan(c, { w: 170 })}</g>`);
    const bedEmpty = H.lowL.add(`<g>${pallet(c, 170)}<g transform="translate(40 0) rotate(8)">${blanket(c)}</g></g>`);
    const sitM = S.puppet(H.lowL.add(person(c, { ...HEALED, mantle: null, pose: 'sit' })));
    const standM = S.puppet(H.lowL.add(person(c, { ...HEALED, mantle: null })));
    const goM = S.puppet(H.lowL.add(addToBody(person(c, { ...HEALED, mantle: null }), carried(c))));
    const frL = S.layer({ par: 0.5, sh: 5 });
    const fr = FRIENDS.map((o, i) => ({ i, p: S.puppet(frL.add(person(c, o))), seed: c.rr(0, 9) }));
    const outM = S.puppet(frL.add(addToBody(person(c, { ...HEALED, mantle: null }), carried(c))));
    const fx = S.layer({ par: 0.5, sh: 5 });
    const sparks = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`), x: lerp(480, 1500, i / 9) + c.rr(-30, 30), y: c.rr(260, 520) }));
    const say = fx.add(`<g>${bubble(c, [tr('Przedziwne rzeczy', 'We have seen'), tr('widzieliśmy dzisiaj!', 'strange things today!')], { size: 20, tail: 1 })}</g>`);
    const say2 = fx.add(`<g>${bubble(c, tr('Chwała Bogu!', 'Glory to God!'), { size: 18, tail: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      H.idle(T, { sunY: 140 + es(t, 1, 3) * 120 });
      if (H.sk2) H.sk2.layer.fade(es(t, 1.8, 2.6) * 0.85);
      pose(shaft, { o: 0.7 * (1 - es(t, 1.8, 2.6) * 0.5) });
      const awe = es(t, 1.05, 1.12);
      P.crowd(awe, 1);
      fr.forEach((f) => {
        const x = AT_HOLE[f.i], flip = x > (HS.HOLE0 + HS.HOLE1) / 2;
        const up = es(t, 1.05, 1.3);
        f.p.set({ x, y: ROOFY, s: 0.64, flip, armF: 40 + up * 80, armB: 30 + up * 120, lean: (flip ? 1 : -1) * -14 * (1 - up), head: 22 * (1 - up) - up * 10, blink: blinkAt(T, f.seed) });
      });

      /* v25 — he sits up, stands, takes up his bed, goes out glorifying God */
      const sitK = es(t, 0.04, 0.08);
      const standK = es(t, 0.16, 0.2);
      const rollK = es(t, 0.3, 0.34);
      pose(bedMan, { x: BED.x, y: BED.y, s: 0.8, o: 1 - sitK });
      pose(bedEmpty, { x: BED.x, y: BED.y, s: 0.8, o: sitK * (1 - rollK) });
      sitM.set({ x: BED.x - 30, y: BED.y + 2, s: S_, flip: false, o: sitK * (1 - standK), armF: 40, armB: 20, head: -6, blink: blinkAt(T, 3) });
      standM.set({ x: BED.x, y: HS.FLOOR, s: S_, flip: false, o: standK * (1 - rollK), armF: 30 + bump(t, 0.2, 0.3) * 50, armB: 20, head: 6, blink: blinkAt(T, 3) });
      const inKeys = [[0.36, BED.x], [0.62, HS.IN1 + 30]];
      const gx = kf(t, inKeys, (u) => u);
      const outDoor = es(t, 0.62, 0.66);
      goM.set({ x: gx, y: HS.FLOOR, s: S_, flip: false, o: rollK * (1 - outDoor), walk: moving(t, inKeys) ? gx * 0.05 : undefined, armF: 40, armB: 50, blink: blinkAt(T, 3) });
      const outKeys = [[0.66, [HS.DOOR, HS.FLOOR + 4]], [0.8, [HS.DOOR + 30, HS.STREET + 16]], [1.5, [1760, HS.STREET + 20]]];
      const [ox, oy] = kf(t, outKeys, (u) => u);
      const praise = es(t, 0.7, 0.9);
      outM.set({ x: ox, y: oy, s: S_, flip: false, o: outDoor * (1 - es(t, 1.9, 2.1)), walk: t > 0.66 && t < 1.5 ? ox * 0.05 : undefined, armF: 40 + praise * 90, armB: 50 + praise * 100, head: -praise * 8, blink: blinkAt(T, 3) });

      /* Jesus watches him go */
      P.jesus.set({ x: JH.x, y: HS.FLOOR, s: JH.s, flip: gx < JH.x + 10 || t < 0.4, armF: 30 + es(t, 0.05, 0.2) * 30 * (1 - es(t, 0.6, 0.9)), armB: 12 + es(t, 1.1, 1.4) * 20, head: -4, blink: blinkAt(T) });

      /* v26 — amazement; the teachers too */
      P.scribes.forEach((m) => {
        const st = es(t, 0.08 + m.i * 0.02, 0.2 + m.i * 0.02);
        m.p.set({ x: m.x, y: m.y, s: 0.8, flip: false, armF: 24 + st * 10 + awe * (m.i % 2 ? 20 : 0), armB: 14 + st * (m.i % 2 ? 50 : 20), lean: -st * 6, head: -st * 8, blink: blinkAt(T, m.seed) });
        fade(m.angry, 1 - st);
      });
      sparks.forEach((sp) => { const k = ((t - 1) * 0.9 + sp.i / 10 + (T ? T * 0.1 : 0)) % 1; pose(sp.el, { x: sp.x, y: sp.y - k * 40, s: bump(k, 0, 1), r: T * 40, o: es(t, 1.05, 1.3) * bump(k, 0, 1) }); });
      const sk = es(t, 2.05, 2.25, ease.back);   // phone: the saying stays inside the screen, over the room
      pose(say, { x: S.portrait ? 980 : 1250, y: S.portrait ? HS.CEIL + 70 : HS.STREET - 200, s: sk, o: sk > 0.01 ? 1 : 0 });
      const sk2 = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(say2, { x: 1060, y: HS.FLOOR - 190, s: sk2, o: sk2 > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 20], [0.3, 60], [0.6, 380], [0.9, 600], [1.1, 300], [1.9, 120], [3, 120]]);
      S.cam.y = kf(t, [[0, 60], [0.3, 60], [0.9, 80], [1.1, 0], [3, -20]]);
      S.cam.z = kf(t, [[0, 1.24], [0.3, 1.22], [0.9, 1.14], [1.1, 1.02], [3, 1.0]]);
    };
  },
};
