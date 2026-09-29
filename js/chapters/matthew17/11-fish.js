// Mt 17,27 — "So as not to offend them, go to the sea and cast a hook": on the shore of the lake Jesus points out
// over the water; Peter climbs onto a rock at the water's edge and casts, the line dropping between the painted
// waves, and a fish comes swimming. "Take the first fish that comes up, open its mouth: you will find a stater" —
// the fish is pulled up, its jaw opens, and a silver coin comes out, shining (a big stater hangs down from the flies).
// "Take that and give it to them for me and for you" — the two collectors come along the beach, and Peter puts the
// coin into their hands, while Jesus looks on.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, waveStrip, hillsWith, town, sun, cloud, rock, palm, grass } from '../../assets/nature.js';
import { boat, rays } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { COLLECTORS, stater, bigFish, rod, lineDown, hook, handAt, sparkle, bubble, kf, tr, LAKE } from './lib.js';

const PI = Math.PI;
const JX = 890, JY = 690;
const ROCK = [676, 684];        // Peter's rock at the water's edge
const HOOKX = 470;
const SURF = 614, CREST = 700;  // back water surface, front wave crest

export default {
  id: 'mt17-fish',
  beats: [
    { v: 27, text: 'żebyśmy jednak nie dali im powodu do zgorszenia, idź nad jezioro i zarzuć wędkę!' },
    { v: 27, cont: true, text: 'Weź pierwszą rybę, którą wyciągniesz, i otwórz jej pyszczek: znajdziesz statera.' },
    { v: 27, cont: true, text: 'Weź go i daj im za Mnie i za siebie!»' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, LAKE);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 470, y: 140, len: 800 });
    const cls = [[700, 120, 170], [1330, 170, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 340, 120], color: C.hillFar }).markup);
    const farL = S.layer({ par: 0.12, sh: 2 });
    const fh = hillsWith(c, { y: 476, amps: [12, 5, 2], lens: [900, 300, 100], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 16 });
    farL.add(fh.markup + town(c, { x: 1200, y: fh.fn(1200) + 6, n: 6, spread: 240, sc: 0.42 }));
    const lakeL = S.layer({ par: 0.2, sh: 2 });
    lakeL.add(waterBand(c, { y: 500, color: C.lake, foamN: 30 }).markup);
    const b = boat(c, { mast: true });
    lakeL.add(`<g transform="translate(300 540) scale(.3)">${b.back}${b.front}</g>`);

    /* ---------- the near water on the left: back sheet, the fish, the front waves ---------- */
    const backW = S.layer({ par: 0.45, sh: 2 });
    backW.add(sheet().p(c.cut([[-900, SURF], [680, SURF + 2], [760, SURF + 30], [830, 690], [740, 1700], [-900, 1700]], 0.6, 12), mix(C.lake, C.lake2, 0.55)).x(c.ribbon([[-900, SURF + 1], [680, SURF + 3], [756, SURF + 30]], 2), C.foam, 'opacity=".6"').out());
    const fishL = S.layer({ par: 0.45, sh: 3 });
    const fish = fishL.add(`<g>${bigFish(c, { w: 80 })}</g>`);
    const jaw = fish.querySelector('.jaw'), inCoin = fish.querySelector('.inCoin');
    const lineEl = fishL.add(`<g opacity="0">${lineDown(100)}</g>`);
    const hookEl = fishL.add(`<g opacity="0">${hook(c, 6)}</g>`);
    const frontW = S.layer({ par: 0.47, sh: 3, pad: 60 });
    frontW.add(waveStrip(c, { y: CREST, len: 110, amp: 10, x0: -1000, x1: 740, color: mix(C.lake3, C.lakeDeep, 0.3) }));

    /* ---------- the beach on the right ---------- */
    const beach = S.layer({ par: 0.47, sh: 3 });
    const bs = sheet();
    bs.p(c.cut([[560, 1700], [600, 860], [660, 760], [720, 704], [800, 688], [940, 684], [2500, 688], [2500, 1700]], 1, 12), C.sand);
    let pb = '';
    for (let k = 0; k < 40; k++) { const px = c.rr(760, 2200), py = c.rr(720, 980); pb += c.cut(c.blob(px, py, c.rr(6, 14), c.rr(3, 6), 8, 0.2), 0.4, 4); }
    bs.x(pb, C.sand2, 'opacity=".7"');
    bs.x(c.ribbon([[560, 1000], [606, 860], [666, 762], [726, 706], [804, 690], [940, 687]], 4), C.foam, 'opacity=".8"');
    beach.add(bs.out());
    beach.add(palm(c, 1380, 690, 200) + palm(c, 1470, 694, 160));
    beach.add(rock(c, ROCK[0], ROCK[1] + 26, 140, 52, C.rock2));

    /* ---------- people ---------- */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const COLL = COLLECTORS.map((o, i) => ({ i, o, xe: [1060, 1130][i], seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, o))) }));
    const jesus = S.puppet(pL.add(person(c, CAST.jesus)));
    const rodEl = pL.add(`<g opacity="0">${rod(c, 180)}</g>`);
    const peter = S.puppet(pL.add(person(c, CAST.peter)));
    const coinEl = pL.add(`<g opacity="0"><circle r="40" fill="url(#halo-glow)"/>${stater(c, 12)}</g>`);
    const heldFish = pL.add(`<g opacity="0">${bigFish(c, { w: 80 })}</g>`);
    const hJaw = heldFish.querySelector('.jaw'), hCoin = heldFish.querySelector('.inCoin');
    const go = pL.add(`<g opacity="0">${bubble(c, tr('Idź nad jezioro!', 'Go to the sea!'), { size: 19, tail: -1 })}</g>`);
    const giveSp = [0, 1, 2].map((i) => pL.add(`<g opacity="0">${sparkle(c, 10 + i * 2)}</g>`));

    /* ---------- the big stater, from the flies ---------- */
    const bigL = S.layer({ par: 0.1, sh: 5 });
    const big = hanging(bigL, `<g><circle r="150" fill="url(#halo-glow)"/>${rays(c, { n: 16, r0: 60, r1: 160, spread: 0.05, color: '#fff3cf' })}${stater(c, 62)}</g>`, { x: 1050, y: 250, len: 900 });

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(rock(c, 1460, 990, 230, 90, C.rock) + rock(c, 250, 1000, 200, 70, C.rock2));

    return (t, time) => {
      const T = time;
      swing(sunEl, 470, 140, T, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));
      frontW.shift(Math.sin(T * 0.5) * 14, 0);

      /* Jesus points out over the water */
      const point = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.1));
      jesus.set({ x: JX, y: JY, s: 1.04, flip: t < 1.9 || t > 2.95, armF: 14 + point * 76 + es(t, 2.6, 2.85) * 30, armB: 10 + point * 20 + es(t, 2.6, 2.85) * 40, head: -2, blink: blinkAt(T, 1) });
      pose(go, { x: JX - 40, y: JY - 236, s: es(t, 0.1, 0.28, ease.back), o: bump(t, 0.08, 0.6) > 0.05 ? 1 : 0 });

      /* Peter: to the rock, casts; pulls the fish; back up the beach to the collectors */
      const toRock = es(t, 0.15, 0.5);
      const back = es(t, 2.05, 2.5);
      const px = lerp(lerp(1010, ROCK[0], toRock), 970, back);
      const py = lerp(lerp(698, ROCK[1], toRock), 698, back);
      const cast = es(t, 0.5, 0.62);
      const pull = es(t, 1.05, 1.25);
      const holding = es(t, 1.3, 1.36) * (1 - es(t, 2.95, 3));
      const facing = t < 1.45;
      const give = es(t, 2.5, 2.7);
      const rodArm = 100 - cast * 20 + pull * 40;
      peter.set({ x: px, y: py, s: 1.0, flip: facing, walk: (toRock > 0 && toRock < 1) || (back > 0 && back < 1) ? px * 0.05 : undefined, amt: 0.9,
        armF: t < 1.3 ? (toRock > 0.9 ? rodArm : 14) : 70 + give * 20, armB: t < 1.3 ? 10 + pull * 30 : 10 + holding * 40 * (1 - give), head: -4 + bump(t, 1.4, 1.9) * 10, blink: blinkAt(T, 2) });
      // the rod in his hand, and the line
      const rodOn = es(t, 0.42, 0.5) * (1 - es(t, 1.3, 1.36));
      const [hx, hy] = handAt(px, py, 1.0, true, rodArm);
      const ra = -116 + cast * -10 + pull * 26;   // pointing up and out to the left
      pose(rodEl, { x: hx, y: hy, r: ra, o: rodOn });
      const tipX = hx + Math.cos((ra * PI) / 180) * 180, tipY = hy + Math.sin((ra * PI) / 180) * 180;
      const drop = es(t, 0.58, 0.75);
      const hookY = lerp(tipY + 20, 664, drop) - pull * 120;
      pose(lineEl, { x: tipX, y: tipY, sy: Math.max(0.01, (hookY - tipY) / 100), o: t > 0.55 && t < 1.3 ? 1 : 0 });
      pose(hookEl, { x: tipX, y: hookY, o: t > 0.55 && t < 1.3 ? 1 : 0 });
      // the fish swims up to the hook, bites, and is pulled out
      const swim = es(t, 0.55, 0.88);
      const fx = lerp(340, tipX - 46, swim), fy = lerp(672, hookY + 8, Math.min(1, swim * 1.3));
      const flyK = seg(t, 1.1, 1.32);
      const [ph, pv] = handAt(px, py, 1.0, true, 80);
      pose(fish, { x: flyK > 0 ? lerp(fx, ph - 20, flyK) : fx + Math.sin(T * 2) * 3 * (1 - swim), y: flyK > 0 ? lerp(fy, pv, flyK) - Math.sin(flyK * PI) * 70 : fy + Math.sin(T * 1.7) * 2, s: 1.2, r: flyK * -40 + (1 - swim) * Math.sin(T * 3) * 4, o: t < 1.33 ? 1 : 0 });
      // Peter holds it and opens its mouth
      const [ch, cv] = handAt(px, py, 1.0, facing, 70 + give * 20);
      const fishX = ch + (facing ? -44 : 44), fishY = cv - 8;
      pose(heldFish, { x: fishX, y: fishY, s: 1.4, sx: facing ? -1 : 1, r: facing ? 20 : -14, o: holding * (1 - es(t, 2.05, 2.1)) });
      const open = es(t, 1.35, 1.5);
      pose(hJaw, { x: 24, y: 2.3, r: open * 36 });
      pose(hCoin, { x: 32 + es(t, 1.45, 1.6) * 16, y: 0.6, o: 1 - es(t, 1.58, 1.62) });
      pose(jaw, { x: 24, y: 2.3 });
      pose(inCoin, { x: 32, y: 0.6 });
      // the coin: out of the fish into Peter's hand; then into the collector's hand
      const coinOut = es(t, 1.58, 1.62);
      const handover = es(t, 2.55, 2.8);
      const [gx, gy] = handAt(COLL[0].xe, 692, 0.98, true, 70);
      const mouthX = fishX + (facing ? -1 : 1) * 64, mouthY = fishY - 6;
      const lift = es(t, 1.6, 1.8);
      pose(coinEl, { x: lerp(lerp(mouthX, mouthX + 10, lift), lerp(ch, gx - 6, handover), es(t, 2.0, 2.2)), y: lerp(mouthY - lift * 40, lerp(cv - 14, gy - 12, handover), es(t, 2.0, 2.2)) - Math.sin(handover * PI) * 30, s: 1 + lift * 0.5 - es(t, 2.0, 2.2) * 0.3, o: coinOut });
      giveSp.forEach((el, i) => {
        const on = bump(t, 2.7 + i * 0.05, 3.0);
        pose(el, { x: gx - 6 + (i - 1) * 30, y: gy - 50 - (i % 2) * 20, s: on, r: T * 20, o: on });
      });
      const bg = es(t, 1.5, 1.72, ease.back);
      swing(big, 1050, lerp(-1000, 230, bg), T, 1.1, 0.8, 2);

      /* the collectors come along the beach */
      COLL.forEach((m) => {
        const x = kf(t, [[2.0, 1450 + m.i * 80], [2.5, m.xe]]);
        const take = m.i === 0 ? es(t, 2.55, 2.75) : 0;
        m.p.set({ x, y: 692 - m.i * 8, s: 0.98, flip: true, o: es(t, 1.95, 2.05), walk: t > 2 && t < 2.5 ? x * 0.05 : undefined, amt: 0.9, armF: 20 + take * 50, armB: 10, head: -4 + take * 6, blink: blinkAt(T, m.seed) });
      });

      S.cam.x = kf(t, [[0, 10], [0.6, -30], [1.9, -10], [2.5, 0]]);
      S.cam.z = 1.03 + es(t, 0.5, 0.9) * 0.05 + es(t, 1.3, 1.7) * 0.04 - es(t, 2.0, 2.4) * 0.07;
      S.cam.y = 14 + es(t, 0.5, 0.9) * 12 - es(t, 2, 2.4) * 70;
    };
  },
};
