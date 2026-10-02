// Mt 9,9 — the call of Matthew, the Evangelist himself. By the lake road at the edge of Capernaum stands the
// toll booth; a fisherman pays his coin and a merchant waits with his bundle. Jesus, walking on with the four,
// sees a man named Matthew (his name comes down on a tag) sitting at the booth, counting coins onto the scale.
// "Follow me!" — a warm light crosses to him, the coin falls from his fingers. He gets up, the coins spill from
// the counter, and he walks after Jesus, taking only his writing tablet — and the name tag turns over: on its back
// the winged man, the sign of Matthew the Evangelist, and a golden book, the Gospel we are reading.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, house, sun, cloud, palm, olive, reeds, rock, grass, bush } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, hand, headAt, townsfolk, taxBooth, coin, coinStack, ledger, coinScale, spark, bubble, tag, goldBook, wingedMan, hangAt, tr, DIS4, MORNING } from './lib.js';

const PI = Math.PI;
const PAR = 0.6;
const Y = 700;                // the road
const BOOTH = 1010;
const CT = Y - 96;            // the counter top
const camFor = (x) => (x - 800) / PAR;

/** a wax writing tablet (two wooden leaves), held in the hand; origin at the hand */
function tablet(c) {
  const s = sheet();
  s.p(c.cut([[-4, -30], [26, -34], [28, 6], [-2, 8]], 0.4, 5), C.wood2);
  s.p(c.cut([[0, -26], [22, -29], [24, 2], [2, 4]], 0.3, 4), mix(C.ochre, C.wood3, 0.5));
  s.x(c.ribbon([[4, -20], [20, -22]], 1) + c.ribbon([[4, -13], [18, -15]], 1) + c.ribbon([[4, -6], [20, -8]], 1), C.inkSoft, 'opacity=".5"');
  return s.out();
}

export default {
  id: 'mt9-matthew',
  beats: [
    { v: 9, text: 'Odchodząc stamtąd, Jezus ujrzał człowieka imieniem Mateusz,' },
    { v: 9, cont: true, text: 'siedzącego w komorze celnej,' },
    { v: 9, cont: true, text: 'i rzekł do niego: «Pójdź za Mną!»' },
    { v: 9, cont: true, text: 'On wstał i poszedł za Nim.' },
  ],
  cam: { x: [camFor(700), camFor(980)], y: [-30, 70], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const sk = sky(S, MORNING);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 560, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 900, y: 130, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1350, y: 200, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.linen2, belly: C.cream }), { y: 240, speed: 45, scale: 0.45 });

    /* the far shore, the lake with boats, the town */
    S.layer({ par: 0.1, sh: 2 }).add(hillsWith(c, { y: 400, amps: [16, 7, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.duskViolet, 0.12), x0: -1200, x1: 2800, houses: 6, houseColor: C.plaster }).markup);
    const lake = S.layer({ par: 0.2, sh: 2 });
    lake.add(waterBand(c, { y: 428, color: mix(C.lake, C.skyBlue, 0.2), foamN: 26, x0: -1200, x1: 2900 }).markup);
    const w1 = S.layer({ par: 0.3, sh: 3, pad: 150 });
    w1.add(waveStrip(c, { y: 510, len: 140, amp: 7, color: C.lake2, x0: -1400, x1: 3000 }));
    const townL = S.layer({ par: 0.42, sh: 3 });
    const sfn = c.wave(560, [4, 2], [700, 160]);
    townL.add(sheet().p(c.ridge(sfn, -1400, 3000, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).out());
    let hs = '';
    [[1180, 90, 70], [1300, 110, 84], [1440, 90, 66], [1560, 120, 90], [1720, 100, 70]].forEach(([x, w, h], i) => { hs += house(c, x, sfn(x) + 6, w, h, { stairs: i % 2 === 0 }); });
    townL.add(hs + palm(c, 1250, sfn(1250) + 8, 180) + palm(c, 180, sfn(180) + 8, 170) + reeds(c, 40, sfn(40) + 8, 9, 60) + olive(c, 1650, sfn(1650) + 10, 0.8));

    /* the road */
    const road = S.layer({ par: PAR, sh: 3 });
    const rfn = c.wave(Y - 22, [3, 1.5], [700, 180]);
    const rs = sheet().p(c.ridge(rfn, -1200, 2800, 1700, 12, 1), mix(C.sand, C.cream, 0.25));
    let stones = '';
    for (let i = 0; i < 60; i++) { const x = c.rr(-900, 2400); stones += c.cut(c.blob(x, c.rr(Y, 1000), c.rr(8, 16), c.rr(4, 7), 8, 0.2), 0.4, 4); }
    rs.x(stones, C.sand2, 'opacity=".7"');
    road.add(rs.out() + grass(c, { x0: -900, x1: 600, y: Y - 22, fn: rfn, n: 16, h: 12, color: C.olive }) + grass(c, { x0: 1300, x1: 2400, y: Y - 22, fn: rfn, n: 14, h: 12, color: C.olive }));
    // a milestone of the road, with a little post and chain (the toll barrier)
    road.add(sheet().p(c.cut([[1180, Y - 4], [1184, Y - 70], [1196, Y - 78], [1208, Y - 70], [1212, Y - 4]], 0.4, 5), C.stone2).out());

    /* the tax booth, Matthew seated behind the counter */
    const boothL = S.layer({ par: PAR, sh: 4 });
    const B = taxBooth(c, 260, 256);
    boothL.add(`<g transform="translate(${BOOTH} ${Y})">${B.back}</g>`);
    const glow = boothL.add(`<g>${rays(c, { n: 12, r0: 40, r1: 120, spread: 0.05, color: '#fff3cf' })}<circle r="100" fill="url(#halo-glow)"/></g>`);
    const mSit = S.puppet(boothL.add(person(c, { ...CAST.matthew, pose: 'sit' })));
    const mUp = S.puppet(boothL.add(person(c, { ...CAST.matthew })));
    boothL.add(`<g transform="translate(${BOOTH} ${Y})">${B.front}</g>`);
    boothL.add(`<g transform="translate(${BOOTH + 58} ${CT})">${coinScale(c)}</g>`);
    const led = boothL.add(`<g>${ledger(c, 60)}</g>`);
    const stacks = [[BOOTH - 100, 6], [BOOTH - 76, 4], [BOOTH - 52, 7], [BOOTH + 100, 5]].map(([x, n], i) => ({ x, n, i, el: boothL.add(`<g>${coinStack(c, n)}</g>`) }));
    const loose = Array.from({ length: 9 }, (_, i) => ({ i, el: boothL.add(`<g>${coin(c, 7)}</g>`), x: BOOTH - 110 + i * 14 + c.rr(-4, 4), fx: BOOTH - 190 + c.rr(-60, 80), r: c.rr(-200, 200) }));
    const handCoin = boothL.add(`<g>${coin(c, 7)}</g>`);
    const payCoin = boothL.add(`<g>${coin(c, 7)}</g>`);

    /* the people on the road: a fisherman paying, a merchant with his bundle; Jesus and the four */
    const act = S.layer({ par: PAR, sh: 5 });
    const basket = sheet().p(c.cut([[-20, -2], [20, -2], [16, 18], [-16, 18]], 0.5, 5), C.basket).p(c.cut([[-18, -2], [-8, -12], [8, -12], [18, -4]], 0.4, 4), C.lake3).out();
    const fisher = S.puppet(act.add(person(c, townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather, holdB: `<g transform="translate(0 2)">${basket}</g>` }))));
    const bundle = sheet().p(c.cut(c.blob(0, 0, 34, 28, 12, 0.12), 0.6, 5), C.wheatRobe).x(c.ribbon([[-30, -6], [30, 8]], 3) + c.ribbon([[-6, -26], [8, 26]], 3), C.rope).out();
    const merchant = S.puppet(act.add(person(c, { ...townsfolk(c, { man: true, robe: C.ochreRobe, mantle: C.clayMantle, hairStyle: 'wrap', veil: C.linen2, beard: 'full' }), holdB: `<g transform="translate(-10 -40)">${bundle}</g>` })));
    const DIS = DIS4.map((k, i) => ({ k, i, off: [-96, -164, -232, -300][i], dy: [-4, 3, -3, 4][i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const mWalk = S.puppet(act.add(person(c, { ...CAST.matthew, holdF: `<g transform="translate(-4 -2)">${tablet(c)}</g>` })));

    /* light, words, the name tag and its back */
    const fx = S.layer({ par: PAR, sh: 6 });
    const sparks = [0, 1, 2, 3].map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Pójdź za Mną!', 'Follow me!')], { size: 26, dir: -1 })}</g>`);
    const fly = S.layer({ par: 0.3, sh: 6 });
    const nameF = fly.add(`<g>${hangThread()}${tag(c, [tr('Mateusz', 'Matthew'), tr('celnik', 'tax collector')], { size: 24, w: 170 })}</g>`);
    const nameB = fly.add(`<g>${hangThread()}${tag(c, [' ', ' ', tr('Mateusz Ewangelista', 'Matthew the Evangelist')], { size: 20, w: 230, fill: C.haloRim, face: mix(C.halo, C.cream, 0.4) })}<g transform="translate(0 44)">${wingedMan(c, 24)}</g></g>`);
    const book = fly.add(`<g>${goldBook(c, { w: 160, h: 96, title: tr('Ewangelia', 'The Gospel'), sub: tr('wg Mateusza', 'of Matthew') })}</g>`);
    function hangThread() { return `<path d="M0 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`; }

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 100, 920, 240, 90, C.rock2) + reeds(c, 280, 910, 12, 190, C.moss) + rock(c, 1650, 925, 260, 100, C.rock) + bush(c, 1480, 930, 200, C.sage, C.moss));

    // Jesus: along the road → stops before the booth → turns and leads on to the left
    const JK = [[-0.4, 260], [0.55, 740], [2.05, 740], [2.3, 790], [3.2, 790], [3.95, 560]];
    const coinT = (i) => 3.1 + i * 0.03;
    return (t, time) => {
      const T = time;
            swing(sunEl, 560, 150 - es(t, 0, 4) * 16, T, 1.1, 0.6);
      swing(cl1, 900 + Math.sin(T * 0.1) * 26, 130, T, 1.3, 0.6, 1);
      swing(cl2, 1350 + Math.sin(T * 0.12 + 2) * 26, 200, T, 1.3, 0.8, 2);
      birds(T, 1);
      w1.shift(((T * 16) % 140) - 70);

      /* v9a — He passes by and sees Matthew */
      const jx = kf(t, JK);
      const back = t > 3.2;
      const see = es(t, 0.5, 0.75) * (1 - es(t, 3.2, 3.3));
      const call = es(t, 2.05, 2.3) * (1 - es(t, 3.1, 3.3));
      jesus.set({
        x: jx, y: Y, s: 1.04, flip: back, walk: moving(t, JK) ? jx * 0.05 : undefined,
        armF: call * 88 + (back ? 30 : 0) + see * 10, armB: call * 24 + (back ? bump(t, 3.2, 3.9) * 60 : 0),
        head: -see * 3, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const lag = back ? -(0.05 + d.i * 0.035) : 0.1 + d.i * 0.05;
        const px = kf(t - lag, JK) + d.off * (back ? -0.2 : 1) + (back ? 60 + d.i * 50 : 0);
        d.p.set({ x: px, y: Y - 12 + d.dy, s: 0.86, flip: back, walk: moving(t - lag, JK) ? px * 0.05 + d.i : undefined, head: bump(t, 2.2, 3.1) * 6 * (d.i % 2 ? 1 : -1), armF: bump(t, 2.3, 3.1) * (d.i === 0 ? 50 : 0), blink: blinkAt(T, d.seed) });
      });
      // the name tag comes down over the booth
      const tagK = es(t, 0.45, 0.85, ease.out);
      const flipK = seg(t, 3.25, 3.5);
      const sx1 = Math.max(0, 1 - flipK * 2), sx2 = Math.max(0, flipK * 2 - 1);
      const ty = lerp(S.portrait ? -700 : -600, 250, tagK);
      const TX = S.portrait ? 960 : 1010, BKX = S.portrait ? 760 : 820;   // phone: the turned tag clear of the edge
      pose(nameF, { x: TX, y: ty, r: Math.sin(T * 0.9) * 2, sx: sx1 < 0.02 ? 0.02 : sx1, o: tagK > 0.01 && sx1 > 0.02 ? 1 : 0 });
      pose(nameB, { x: TX, y: ty, r: Math.sin(T * 0.9) * 2, sx: sx2 < 0.02 ? 0.02 : sx2, o: sx2 > 0.02 ? 1 : 0 });
      const bk = es(t, 3.45, 3.8, ease.back);
      pose(book, { x: BKX, y: lerp(S.portrait ? -700 : -500, 210, es(t, 3.35, 3.75, ease.out)) + Math.sin(T * 1.1) * 3, r: Math.sin(T * 0.7) * 2, s: 0.6 + bk * 0.4, o: t > 3.35 ? 1 : 0 });

      /* v9b — at the booth: the fisherman pays, Matthew counts */
      const fKeys = [[-0.3, BOOTH - 170], [1.9, BOOTH - 170], [2.4, BOOTH + 500]];
      const fxp = kf(t, fKeys, (u) => u);
      const fLeave = t > 1.9;
      fisher.set({ x: fxp, y: Y + 8, s: 0.98, flip: !fLeave, walk: fLeave && t < 2.4 ? fxp * 0.05 : undefined, armF: bump(t, 1.0, 1.6) * 80, armB: 30, o: 1 - seg(t, 2.3, 2.4), blink: blinkAt(T, 5) });
      const pk = es(t, 1.1, 1.4, ease.in);
      const [fhx, fhy] = hand(BOOTH - 170, Y + 8, 0.98, true, 80);
      pose(payCoin, { x: lerp(fhx, BOOTH - 60, pk), y: lerp(fhy, CT - 7, pk) - Math.sin(pk * PI) * 20, r: pk * 180, o: bump(t, 1.0, 1.1) > 0 || (t > 1.05 && t < 1.45) ? 1 : 0 });
      const mKeys = [[-0.3, 1650], [1.6, 1650], [2.2, BOOTH - 190], [3.0, BOOTH - 190], [3.4, BOOTH - 250]];
      const mxp = kf(t, mKeys);
      merchant.set({ x: mxp, y: Y + 10, s: 1, flip: true, walk: moving(t, mKeys) ? mxp * 0.05 : undefined, armF: 20 + bump(t, 3.1, 3.6) * 50, armB: 40, head: bump(t, 3.1, 3.7) * -8, o: seg(t, 1.6, 1.7), blink: blinkAt(T, 7) });

      /* v9c — "Follow me!" — Matthew looks up, the coin falls */
      const count = (1 - es(t, 2.1, 2.25)) * Math.max(0, Math.sin(t * 9));
      const look = es(t, 2.12, 2.3);
      const rise = es(t, 3.05, 3.12);
      mSit.set({ x: BOOTH + 12, y: Y - 40, s: 0.98, flip: true, o: 1 - rise, armF: 40 + count * 24 + bump(t, 0.6, 1.4) * 20 + look * 20, armB: 20 + look * 40, head: count * 4 * (1 - look) - look * 6, blink: blinkAt(T, 3) });
      const [hx, hy] = hand(BOOTH + 12, Y - 40, 0.98, true, 40 + count * 24 + bump(t, 0.6, 1.4) * 20 + look * 20, 0, 62);
      const drop = es(t, 2.25, 2.45, ease.in);
      pose(handCoin, { x: hx - drop * 6, y: lerp(hy, CT - 7, drop), r: drop * 90, o: 1 - es(t, 3.05, 3.2) });
      pose(led, { x: BOOTH + 94, y: CT, r: 0, o: 1 - es(t, 3.05, 3.12) });
      const sayK = es(t, 2.08, 2.28, ease.back) * (1 - es(t, 3.0, 3.1));
      pose(say, { x: jx + 60, y: Y - 240, s: sayK, o: sayK > 0.02 ? 1 : 0 });
      const [lhx, lhy] = headAt(BOOTH + 12, Y - 40, 0.98, true, 62);
      pose(glow, { x: lhx, y: lhy + 30, s: 0.6 + es(t, 2.2, 2.6) * 0.5, o: bump(t, 2.15, 3.5) * 0.6 });
      sparks.forEach((sp, i) => {
        const k = es(t, 2.25 + i * 0.1, 2.75 + i * 0.1);
        const [jhx] = hand(jx, Y, 1.04, false, 90);
        pose(sp, { x: lerp(jhx, lhx, k), y: lerp(Y - 150, lhy, k) - Math.sin(k * PI) * 40, s: 0.9, r: T * 40, o: bump(t, 2.25 + i * 0.1, 2.8 + i * 0.1) });
      });

      /* v9d — he gets up, leaves the money, and follows */
      const MK = [[3.12, BOOTH + 12], [3.35, BOOTH - 150], [3.95, 690]];
      const mx = kf(t, MK);
      mUp.set({ x: BOOTH + 12, y: Y - 8, s: 0.98, flip: true, o: rise * (1 - seg(t, 3.16, 3.2)), armF: 30, armB: 20, blink: blinkAt(T, 3) });
      mWalk.set({ x: mx, y: Y + 4, s: 0.98, flip: true, o: seg(t, 3.16, 3.2), walk: moving(t, MK) ? mx * 0.05 : undefined, armF: 30, armB: 14, head: 3, blink: blinkAt(T, 3) });
      stacks.forEach((st) => pose(st.el, { x: st.x, y: CT, r: es(t, coinT(st.i), coinT(st.i) + 0.1) * (st.i - 1.5) * 10 }));
      loose.forEach((l) => {
        const k = es(t, coinT(l.i), coinT(l.i) + 0.3, ease.in);
        pose(l.el, { x: lerp(l.x, l.fx, k), y: lerp(CT - 7, Y + 6, k) - Math.sin(k * PI) * 26, r: k * l.r, o: seg(t, 3.06, 3.1) });
      });

      /* camera: the road → the booth → following them */
      S.cam.x = kf(t, [[0, camFor(720)], [0.8, camFor(860)], [1.0, camFor(900)], [2.0, camFor(900)], [2.3, camFor(870)], [3.2, camFor(880)], [3.95, camFor(760)]]);
      S.cam.z = 1.02 + es(t, 0.9, 1.4) * 0.14 - es(t, 2.0, 2.3) * 0.06 - es(t, 3.2, 3.7) * 0.06;
      S.cam.y = 20 + es(t, 0.9, 1.4) * 40 - es(t, 2.0, 2.3) * 20 - es(t, 3.2, 3.7) * 50;
    };
  },
};
