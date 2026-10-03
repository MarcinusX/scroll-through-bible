// Łk 7,1–3 — the curtains open on Capernaum's street by the lake. His sermon to the people over, Jesus comes into
// the town along the street with His disciples, the crowd from the plain behind Him. On the right stands the
// centurion's red-roofed house; its front wall lifts away: inside, his servant — dear to him — lies grey and near
// death, the centurion kneeling at the foot of the bed. A houseboy runs in from the street: "Jesus is here!" — the
// centurion lifts his head; the wall comes down again, and out of his door go three elders of the Jews to ask
// Jesus to come and save the servant.
import { C, person, CAST, blinkAt, pose, lerp, curtains, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  capStreet, HOUSE, SERVANT, HOUSEBOY, ELDERS, centurion, mob, painMarks, hungWord, hangAt, nameTag, bubble, headAt,
  kf, moving, tr, PI,
} from './lib.js';

const FEET = HOUSE.FEET, JX = 540, CK = 1112;

export default {
  id: 'lk7-capernaum',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
  ],
  cam: { x: [-150, 210], y: [0, 70], z: [1, 1.3] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;

    /* ---------- inside the house: the servant on his bed, the centurion at its foot ---------- */
    const B = HOUSE.BEDX;
    const lying = S.puppet(st.houseL.add(person(c, { ...SERVANT, skin: mix(SERVANT.skin, C.stone2, 0.4), eyes: 'closed' })));
    const pain = st.houseL.add(`<g opacity="0">${painMarks(c, 46)}</g>`);
    const cenIn = S.puppet(st.houseL.add(centurion(c, { pose: 'kneel', helmet: false })));
    const cenUp = S.puppet(st.houseL.add(centurion(c, { helmet: false })));
    const H = st.addFront();

    /* ---------- the crowd from the plain, the disciples, Jesus ---------- */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const crowd = [0, 1].map((i) => ({ i, sp: crowdL.sprite(mob(makeCutter('lk7-cap-c' + i), 6, { s: 0.84, spread: 44 }), 300, 720) }));
    const P = S.layer({ par: 0.4, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.andrew, CAST.james].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const boy = S.puppet(P.add(person(c, HOUSEBOY)));
    const elders = ELDERS.map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));

    /* ---------- words and tags ---------- */
    const W = S.layer({ par: 0.42, sh: 3 });
    const tagC = W.add(`<g opacity="0">${nameTag(c, tr('setnik', 'the centurion'), { size: 17 })}</g>`);
    const tagS = W.add(`<g opacity="0">${nameTag(c, tr('jego sługa', 'his servant'), { size: 17 })}</g>`);
    const cry = W.add(`<g opacity="0">${bubble(c, tr('Jezus przyszedł!', 'Jesus is here!'), { size: 20, dir: -1 })}</g>`);
    const ask = W.add(`<g opacity="0">${bubble(c, [tr('Niech przyjdzie', 'Let Him come'), tr('i uzdrowi mi sługę', 'and heal my servant')], { size: 19, dir: -1 })}</g>`);
    const flyL = S.layer({ par: 0.2, sh: 6 });
    const sign = flyL.add(hungWord(c, tr('Kafarnaum', 'Capernaum'), { size: 26 }));
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      st.update(T);
      cur.set(es(t, 0.05, 0.85), T);

      /* v1 — His words to the people finished, He comes into Capernaum */
      const enter = es(t, 0.7, 1.75, (u) => u * (2 - u));
      const jx = lerp(-160, JX, enter);
      const turnR = es(t, 3.2, 3.3);
      jesus.set({ x: jx, y: FEET, s: 1.04, flip: false, walk: enter > 0 && enter < 1 ? jx * 0.045 : undefined, amt: 0.8, armF: 12 + bump(t, 3.5, 4.0) * 30, armB: 8, head: -turnR * 2, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = lerp(-380 - d.i * 90, JX - 90 - d.i * 82, enter);
        d.p.set({ x, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, walk: enter > 0 && enter < 1 ? x * 0.05 + d.i : undefined, amt: 0.8, armF: 12, head: -bump(t, 2.1, 2.9) * 3, blink: blinkAt(T, d.seed) });
      });
      crowd.forEach((g) => {
        const x = lerp(-800 - g.i * 260, 120 - g.i * 230, enter);
        g.sp.set({ x, y: 716 - g.i * 10 - (enter > 0 && enter < 1 ? Math.abs(Math.sin(x * 0.04 + g.i)) * 3 : 0), s: 1 - g.i * 0.1 });
      });
      const sk = es(t, 0.9, 1.3, ease.out) * (1 - es(t, 1.85, 2.05, ease.in));
      hangAt(sign, 600, lerp(-500, 240, sk), T, 1.2, 0.7);

      /* v2 — the servant, dear to him, sick and near death: the front of the house lifts */
      const open = es(t, 2.02, 2.3) * (1 - es(t, 3.42, 3.54));
      pose(H.front, { y: -open * 140, o: 1 - open });
      pose(H.dark, { o: 1 - seg(open, 0, 0.3) });
      lying.set({ x: B + 88, y: HOUSE.BASE - 90, s: 0.84, r: -90, armF: 10 });
      pose(pain, { x: B - 30, y: HOUSE.BASE - 110, s: 1 + (T ? Math.sin(T * 4) * 0.05 : 0), o: open * 0.85 * (1 - es(t, 3.5, 3.7)) });
      const rise = es(t, 3.28, 3.34);
      const inside = seg(t, 2.02, 2.1) * (1 - seg(t, 3.5, 3.54));
      cenIn.set({ x: CK, y: HOUSE.BASE, s: 0.84, flip: true, o: (1 - rise) * inside, armF: 64, armB: 30, lean: 8, head: 10 - bump(t, 3.0, 3.3) * 22, blink: blinkAt(T, 4) });
      cenUp.set({ x: CK - 2, y: HOUSE.BASE, s: 0.84, flip: true, o: rise * inside, armF: 40 + es(t, 3.34, 3.46) * 40, armB: 10 + es(t, 3.34, 3.46) * 100, head: -6, blink: blinkAt(T, 4) });
      const tg = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(tagS, { x: B - 30, y: HOUSE.TOP + 34, s: tg, o: tg > 0.02 ? 1 : 0 });
      pose(tagC, { x: CK, y: HOUSE.TOP + 20, s: tg, o: tg > 0.02 ? 1 : 0 });

      /* v3 — he hears of Jesus; he sends the elders of the Jews */
      const BK = [[2.95, -200], [3.2, 1010], [3.5, 1010], [3.54, 1060], [3.6, 1060]];
      const bx = kf(t, BK);
      const point = bump(t, 3.18, 3.55);
      boy.set({ x: bx, y: FEET + 6, s: 0.84, o: 1 - seg(t, 3.52, 3.56), flip: t > 3.2, walk: moving(t, BK) ? bx * 0.07 : undefined, amt: 1.2, armF: 20 + point * 70, armB: 10, head: -point * 6, blink: blinkAt(T, 5) });
      const [bhx, bhy] = headAt(bx, FEET + 6, 0.84, true);
      const cb = es(t, 3.2, 3.3, ease.back) * (1 - es(t, 3.46, 3.52));
      pose(cry, { x: bhx - 16, y: bhy - 40, s: cb, o: cb > 0.02 ? 1 : 0 });
      elders.forEach((e) => {
        const d = e.i * 0.06;
        const EK = [[3.54 + d, HOUSE.DOOR], [3.84 + d * 0.5, 900 - e.i * 90]];
        const out = seg(t, 3.52 + d, 3.57 + d);
        const x = kf(t, EK);
        e.p.set({ x, y: FEET - 4 + (e.i % 2) * 8, s: 0.98, flip: true, o: out, walk: moving(t, EK) ? x * 0.05 + e.i : undefined, armF: 14, blink: blinkAt(T, e.seed) });
      });
      const ak = es(t, 3.6, 3.7, ease.back) * (1 - es(t, 3.96, 4.0));
      const ex = kf(t, [[3.54, HOUSE.DOOR], [3.84, 900]]);
      const [ehx, ehy] = headAt(ex, FEET - 4, 0.98, true);
      pose(ask, { x: ehx + 10, y: ehy - 36, s: ak * 0.95, o: ak > 0.02 ? 1 : 0 });

      /* camera */
      // phone: further left while He comes in (He is not left on the edge), further right on the room (the centurion clear of the thread)
      S.cam.x = S.portrait ? kf(t, [[0, 20], [1.0, -150], [1.8, -130], [2.2, 200], [2.9, 210], [3.25, 60], [4.0, 20]]) : kf(t, [[0, 20], [1.0, -60], [1.8, -40], [2.2, 110], [2.9, 120], [3.25, 60], [4.0, 20]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.1], [1.8, 1.06], [2.2, 1.26], [2.9, 1.26], [3.3, 1.1], [4.0, 1.06]]);
      S.cam.y = kf(t, [[0, 20], [2.2, 60], [2.9, 60], [3.3, 30]]);
    };
  },
};
