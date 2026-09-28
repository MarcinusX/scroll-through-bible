// Mt 6,5–6 — morning at a street corner, the synagogue further down the street. A hypocrite takes his stand on the
// corner step, spreads his arms and prays aloud; passers-by stop and look, and he glances round to see them see him.
// The wreath comes down on its string again — and dries at once. Then the camera moves along to a house cut open like
// a doll's house: the quiet man opens the door of the little store-room at the back, steps in, shuts the door and
// kneels in the dim room. "Your Father who sees in secret": the shaft of light comes in through the high window onto
// him, and the gold star comes down into his hands.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, palm, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  DAWN, NOON, hypocrite, QUIET, manOf, womanOf, synagogue, streetRow, street, wreath, dryLeaf, strip, doorPlank, secretShaft, rewardStar,
  addToHead, phylactery, handAt, kf, moving, tr, PI,
} from './lib.js';

const GY = 704;
const KX = 560;                       // the street corner
const RX0 = 1100, RX1 = 1500, RT = 440; // the room (cut away): left, right, ceiling
const DX = 1150, DW = 74, DH = 156;   // its door in the back wall (left edge, width, height)
const PRAYX = 1340;                   // where he kneels

export default {
  id: 'mt6-pray',
  enter: 'fly',
  beats: [
    { v: 5, text: 'Gdy się modlicie, nie bądźcie jak obłudnicy.' },
    { v: 5, cont: true, text: 'Oni lubią w synagogach i na rogach ulic wystawać i modlić się, żeby się ludziom pokazać.' },
    { v: 5, cont: true, text: 'Zaprawdę, powiadam wam: otrzymali już swoją nagrodę.' },
    { v: 6, text: 'Ty zaś, gdy chcesz się modlić, wejdź do swej izdebki, zamknij drzwi i módl się do Ojca twego, który jest w ukryciu.' },
    { v: 6, cont: true, text: 'A Ojciec twój, który widzi w ukryciu, odda tobie.' },
  ],
  cam: { x: [-320, 660], y: [-40, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, ['#cbdcd8', '#f1e3c8', '#f8e6c8']);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1180, y: 160, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 620, y: 200, len: 800 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [14, 6, 3], lens: [1000, 340, 120], color: C.hillFar, x1: 3200 }).markup);
    const hl = S.layer({ par: 0.16, sh: 3 });
    hl.add(hillsWith(c, { y: 470, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20, x1: 3200 }).markup);
    const row = S.layer({ par: 0.4, sh: 4 });
    row.add(streetRow(c, { base: 600, x1: 3400, skip: [[560, 900]] }) + `<g transform="translate(730 604) scale(.55)">${synagogue(c)}</g>` + palm(c, 900, 604, 150));

    /* the corner house (left) and the street */
    const cornerL = S.layer({ par: 0.8, sh: 4 });
    const cs = sheet();
    cs.p(c.cut([[-900, 330], [KX, 330], [KX, GY - 30], [-900, GY - 30]], 0.6, 12), C.plaster);
    cs.p(c.cut([[KX, 330], [KX + 90, 372], [KX + 90, GY - 44], [KX, GY - 30]], 0.5, 8), C.plaster2);
    cs.p(c.cut([[-900, 316], [KX + 6, 316], [KX + 96, 360], [KX + 96, 374], [KX, 334], [-900, 334]], 0.4, 10), C.roof);
    cs.p(c.cut([[KX - 20, 330], [KX + 8, 330], [KX + 8, GY - 30], [KX - 20, GY - 30]], 0.3, 8), shade(C.plaster, -0.06));
    cs.p(c.cut([[260, GY - 30], [260, 500], ...c.arc(310, 500, 50, 44, PI, 2 * PI, 10), [360, GY - 30]], 0.4, 6), C.wood2);
    cs.x(c.poly(c.rect(110, 430, 60, 46)), C.soilDark);
    cs.p(c.cut([[KX - 60, GY - 30], [KX + 70, GY - 30], [KX + 60, GY - 8], [KX - 70, GY - 8]], 0.4, 6), C.stone2);
    cornerL.add(cs.out());
    const ground = S.layer({ par: 0.8, sh: 3 });
    ground.add(street(c, { y: GY - 30, x1: 3200 }));

    /* the house cut open: the room at the back, its door, the high window */
    const roomL = S.layer({ par: 0.8, sh: 4 });
    const rs = sheet();
    const wall = mix(C.plaster2, C.clay, 0.18);
    rs.p(c.cut([[RX0 - 30, RT - 26], [RX1 + 30, RT - 26], [RX1 + 30, GY - 20], [RX0 - 30, GY - 20]], 0.5, 10), C.plaster);
    rs.p(c.cut([[RX0, RT], [RX1, RT], [RX1, GY - 24], [RX0, GY - 24]], 0.5, 10), wall);
    rs.p(c.cut([[RX0 - 40, RT - 40], [RX1 + 40, RT - 40], [RX1 + 40, RT - 20], [RX0 - 40, RT - 20]], 0.4, 10), C.roof);
    let beams = '';
    for (let x = RX0 + 10; x < RX1; x += 50) beams += c.cut(c.rect(x, RT, 12, 12), 0.2, 4);
    rs.p(beams, C.wood2);
    rs.p(c.cut(c.rect(RX0, GY - 30, RX1 - RX0, 10), 0.3, 8), shade(wall, -0.2));
    // shelf and jars
    rs.p(c.cut(c.rect(RX1 - 150, RT + 110, 120, 8), 0.3, 5), C.wood);
    let jars = '';
    [RX1 - 130, RX1 - 94, RX1 - 58].forEach((x, i) => { jars += c.cut([[x - 10, RT + 110], [x - 13, RT + 94], [x - 6, RT + 84 - i * 3], [x + 6, RT + 84 - i * 3], [x + 13, RT + 94], [x + 10, RT + 110]], 0.3, 4); });
    rs.p(jars, C.pot);
    rs.p(c.cut([[RX1 - 110, GY - 24], [RX1 - 124, GY - 60], [RX1 - 110, GY - 84], [RX1 - 80, GY - 84], [RX1 - 66, GY - 60], [RX1 - 80, GY - 24]], 0.4, 5), mix(C.pot, C.clay, 0.4));
    // the high window
    rs.p(c.cut(c.rect(PRAYX - 22, RT + 34, 44, 34), 0.3, 4), mix(C.skyBlue, C.cream, 0.4));
    rs.x(c.ribbon([[PRAYX, RT + 34], [PRAYX, RT + 68]], 3), C.wood2);
    // the doorway (the street's light behind it)
    rs.p(c.cut(c.rect(DX, GY - 24 - DH, DW, DH), 0.3, 6), mix(C.cream, C.sand, 0.3));
    rs.x(c.cut(c.rect(DX + 8, GY - 60, DW - 16, 36), 0.3, 4), C.sand2, 'opacity=".5"');
    roomL.add(rs.out());
    const dimRoom = roomL.add(`<g><path d="${c.poly([[RX0, RT + 12], [RX1, RT + 12], [RX1, GY - 20], [RX0, GY - 20]])}" fill="${mix(C.soilDark, C.plumRobe, 0.25)}" opacity=".2"/></g>`);
    const leaf = roomL.add(`<g>${doorPlank(c, DW, DH)}</g>`);

    /* the people */
    const act = S.layer({ par: 0.8, sh: 5 });
    const PASS = [
      { o: womanOf(c, { robe: C.tealRobe }), x0: -200, x1: 380, y: 22 },
      { o: manOf(c, { belt: C.leather }), x0: 1100, x1: 760, y: 30 },
      { o: manOf(c, { mantle: C.clayMantle }), x0: -300, x1: 300, y: 38 },
      { o: womanOf(c), x0: 1200, x1: 860, y: 16 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(act.add(person(c, m.o))), seed: c.rr(0, 9) }));
    const hypO = hypocrite(1);
    const hyp = S.puppet(act.add(addToHead(person(c, hypO), `<g transform="translate(-2 -4)">${phylactery(c, 1.1)}</g>`)));
    const wr = hanging(act, `<g data-k="p-wrG">${wreath(c, { r: 25 })}</g><g data-k="p-wrD" opacity="0">${wreath(c, { r: 25, dry: true })}</g>`, { x: 0, y: 0, len: 900 });
    const wrG = S.$('p-wrG'), wrD = S.$('p-wrD');
    const reward = act.add(`<g>${strip(c, tr('nagroda', 'their reward'), { size: 17 })}</g>`);
    const leaves = [0, 1, 2, 3, 4].map(() => act.add(`<g>${dryLeaf(c)}</g>`));
    const voice = [0, 1, 2].map(() => act.add(`<path d="${c.ribbon(c.arc(0, 0, 22, 22, -0.7, 0.7, 8), 4)}" fill="${C.clay}"/>`));

    /* the quiet man: walking in, then kneeling */
    const inL = S.layer({ par: 0.8, sh: 5 });
    const shaftL = S.layer({ par: 0.8, sh: 0, flat: true });
    const shaft = shaftL.add(`<g>${secretShaft(c, { w0: 40, w1: 170, h: 250 })}</g>`);
    const qw = S.puppet(inL.add(person(c, QUIET)));
    const qk = S.puppet(inL.add(person(c, { ...QUIET, pose: 'kneel', eyes: 'closed' })));
    const starEl = inL.add(`<g>${rewardStar(c, 15)}</g>`);
    // the front edges of the cut-open house (in front of him)
    const edge = S.layer({ par: 0.8, sh: 6 });
    const es_ = sheet();
    es_.p(c.cut([[RX0 - 40, RT - 30], [RX0 - 8, RT - 30], [RX0 - 8, GY - 16], [RX0 - 40, GY - 16]], 0.4, 8), shade(C.plaster, -0.04));
    es_.p(c.cut([[RX1 + 8, RT - 30], [RX1 + 40, RT - 30], [RX1 + 40, GY - 16], [RX1 + 8, GY - 16]], 0.4, 8), shade(C.plaster, -0.04));
    es_.p(c.cut([[RX0 - 50, GY - 22], [RX1 + 50, GY - 22], [RX1 + 50, GY - 4], [RX0 - 50, GY - 4]], 0.4, 10), C.stone2);
    edge.add(es_.out());

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1180, y: 160, r: T ? Math.sin(T * 0.6) : 0 });
      pose(cl, { x: 620 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 200, r: T ? Math.sin(T * 0.6 + 1) * 1.2 : 0 });

      /* v5a — the hypocrite takes his stand at the corner and spreads his arms */
      const HK = [[0.0, 150], [0.45, KX]];
      const hx = kf(t, HK);
      const onStep = es(t, 0.45, 0.55);
      const pray = es(t, 0.55, 0.8);
      const peek = bump(t, 1.35, 1.95) + bump(t, 2.1, 2.6) * 0.6;
      const off = es(t, 2.95, 3.15);
      hyp.set({ x: hx, y: GY - 12 - onStep * 16, s: 1.02, flip: onStep > 0.5 && peek < 0.4, walk: moving(t, HK) ? hx * 0.06 : undefined, armF: 14 + pray * 104, armB: 10 + pray * 150, head: -pray * 14 + peek * 12, blink: blinkAt(T, 1), o: 1 - off });
      const [mx, my] = [hx - 18, GY - 12 - 16 - 170];
      voice.forEach((v, i) => {
        const k = T ? (T * 0.7 + i / 3) % 1 : i / 3;
        const on = pray * (1 - es(t, 2.2, 2.5));
        pose(v, { x: mx - 10 - k * 70, y: my - k * 20, sx: -1, s: 0.6 + k * 0.9, o: on * (1 - k) * (1 - off) });
      });

      /* v5b — passers-by stop and look at him */
      PASS.forEach((m) => {
        const k = es(t, 1.02 + m.i * 0.05, 1.5 + m.i * 0.05);
        const x = lerp(m.x0, m.x1, k);
        const look = es(t, 1.45 + m.i * 0.05, 1.6 + m.i * 0.05);
        const faceHim = x > hx;
        m.p.set({ x, y: GY + m.y, s: 0.9, flip: k < 1 ? m.x1 < m.x0 : faceHim, walk: k > 0 && k < 1 ? x * 0.06 + m.i : undefined, armF: 14 + look * (m.i % 2 ? 40 : 20), armB: 10, head: -look * 8, blink: blinkAt(T, m.seed), o: seg(t, 1.0, 1.04) * (1 - off) });
      });

      /* v5c — the wreath, and it dries */
      const wk = es(t, 2.04, 2.32, ease.out);
      const hhx = hx + 2, hhy = GY - 28 - 167 * 1.02 + 4;
      pose(wr, { x: hhx, y: lerp(-500, hhy - 10, wk), r: T ? Math.sin(T * 0.9) * 1.5 * (1 - wk) : 0, o: wk > 0.01 ? 1 - off : 0 });
      const dry = es(t, 2.4, 2.64);
      fade(wrG, 1 - dry); fade(wrD, dry);
      const rk = es(t, 2.2, 2.36, ease.back);
      pose(reward, { x: hhx + 4, y: hhy - 54, s: rk, r: -4, o: rk > 0.02 ? 1 - off : 0 });
      leaves.forEach((l, i) => {
        const k = seg(t, 2.46 + i * 0.05, 2.96 + i * 0.02);
        pose(l, { x: hhx + (i - 2) * 12 + Math.sin(k * 6 + i) * 12, y: hhy + k * 190, r: k * 300 + i * 40, o: k > 0 && k < 1 ? 1 - off : 0 });
      });

      /* v6a — into the inner room: the door opens, he steps in, shuts it, kneels */
      const open = es(t, 3.02, 3.14) * (1 - es(t, 3.3, 3.42));
      pose(leaf, { x: DX, y: GY - 24, sx: 1 - open * 0.9 });
      const WK = [[3.08, DX + DW / 2], [3.26, DX + DW / 2 + 40], [3.42, DX + DW / 2 + 40], [3.56, PRAYX - 30]];
      const wx = kf(t, WK);
      const inside = seg(t, 3.06, 3.1);
      const kneel = es(t, 3.57, 3.63);
      const turnBack = t > 3.26 && t < 3.42;
      qw.set({ x: wx, y: GY - 20, s: 0.92, flip: turnBack, walk: moving(t, WK) ? wx * 0.06 : undefined, armF: 10 + bump(t, 3.28, 3.42) * 60, armB: 8, blink: blinkAt(T, 2), o: inside * (1 - kneel) });
      const recv = es(t, 4.3, 4.55);
      qk.set({ x: PRAYX - 30, y: GY - 20, s: 0.92, armF: 58 + recv * 16, armB: 64 + recv * 10, head: -8 - es(t, 4.05, 4.3) * 12, o: kneel });
      fade(dimRoom, es(t, 3.36, 3.56) * (1 - es(t, 4.05, 4.3) * 0.8));

      /* v6b — the light through the high window; the star into his hands */
      const sk = es(t, 4.02, 4.3);
      pose(shaft, { x: PRAYX - 22, y: GY - 24, sx: 0.3 + sk * 0.7, o: sk });
      const st = es(t, 4.2, 4.55, ease.out);
      const [rx, ry] = handAt(PRAYX - 30, GY - 20, 0.92, false, 70, 'kneel');
      pose(starEl, { x: rx + 6, y: lerp(RT + 50, ry - 12, st) + (T ? Math.sin(T * 2) * 3 : 0) * st, s: 0.8 + st * 0.3, r: T * 25, o: st > 0.01 ? 1 : 0 });

      /* camera: the corner, then across to the house */
      const pan = es(t, 2.9, 3.25);
      S.cam.x = lerp(-290, 640, pan);
      S.cam.z = 1.04 + es(t, 0.3, 0.9) * 0.04 - pan * 0.04 + es(t, 3.6, 4.2) * 0.1;
      S.cam.y = -10 + es(t, 3.6, 4.2) * 20;
    };
  },
};
