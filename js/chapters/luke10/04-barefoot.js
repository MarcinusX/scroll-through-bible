// Łk 10,4 — morning on the road at the foot of the hills; a village sits on the hill ahead, its lamp already lit.
// "Carry no purse, no bag, no sandals": the two sent ones stand before Jesus by a flat stone; the elder unties the
// purse from his belt and lays it on the stone, the young one swings the bag off his shoulder, and they step out of
// their sandals and set them side by side — and stand there barefoot. "And greet no one on the road": they set off
// up the road. Under a tree a rich traveller has spread a carpet with cups and a jug; he rises, bows low with open
// arms and begins the long, long greeting — slip after slip of fine words — and his servant comes with a cup. The two
// only lay a hand on their hearts in passing and walk straight on, their eyes on the village where He will come.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, town, olive, rock, grass, flowers, bush } from '../../assets/nature.js';
import { glow, villageLamp, barefoot, purse, bag, sandals, wordSlip, jug, cup, kf, moving, handAt, headAt, sparkle, DAY, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';

const GY = 748, JX = 720;
const AX = 920, BX = 1000;               // where the two stand before Him
const STONE = [836, 716];
const GREETER = { robe: C.tealRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.terracotta, beard: 'full', skin: C.skin2, belt: C.sun };
const SERVANT = { robe: C.linen2, hair: C.hair, hairStyle: 'short', beard: 'none', skin: C.skin4, belt: C.clay };
const CAMP = 1300, CY = GY - 36;

export default {
  id: 'lk10-barefoot',
  beats: [
    { v: 4, text: 'Nie noście z sobą trzosa ani torby, ani sandałów;' },
    { v: 4, cont: true, text: 'i nikogo w drodze nie pozdrawiajcie!' },
  ],
  cam: { x: [0, 660], y: [-10, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1300, y: 160, len: 900 });
    const cl = hanging(hangL, cloud(c, 190), { x: 640, y: 200, len: 900 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.18) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const hw = hillsWith(c, { y: 500, amps: [16, 7, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    // the village on its hill ahead (up the road), its lamp lit
    const hill = sheet().p(c.cut([[1060, 520], [1180, 450], [1300, 430], [1440, 460], [1560, 520]], 1, 10), mix(C.hillMid, C.sage2, 0.2)).out();
    mid.add(hw.markup + hill + town(c, { x: 1300, y: 450, n: 6, spread: 200, sc: 0.62 }));
    const lamp = mid.add(`<g>${villageLamp(c)}</g>`);
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = (x) => GY - 36 + 6 * Math.sin(x / 150);
    const road = [[-900, GY + 26], [600, GY + 14], [1300, GY + 6], [1700, 640], [1900, 560]];
    G.add(sheet().p(c.ridge(gfn, -900, 2800, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.3)).p(c.ribbon(c.cbez(road[0], [700, GY + 14], [1500, GY + 20], [1900, 600], 40), (u) => lerp(90, 40, u), 2), mix(C.sand, C.cream, 0.3)).out());
    G.add(grass(c, { x0: -800, x1: 2600, y: 0, fn: (x) => gfn(x) + 2, n: 60, h: 16, color: C.olive }) + flowers(c, { x0: -300, x1: 2200, y: 0, fn: (x) => gfn(x) + c.rr(8, 30), n: 20, h: 12 }));
    G.add(olive(c, 300, GY - 20, 1.2) + olive(c, CAMP + 170, CY - 20, 1.3) + bush(c, 520, GY - 10, 90, C.sage, C.moss));
    // the flat stone, and the rich traveller's carpet
    G.add(sheet().p(c.cut([[STONE[0] - 70, STONE[1]], [STONE[0] - 60, STONE[1] - 24], [STONE[0] + 64, STONE[1] - 26], [STONE[0] + 74, STONE[1]]], 0.8, 6), C.rock).x(c.ribbon([[STONE[0] - 50, STONE[1] - 20], [STONE[0] + 50, STONE[1] - 22]], 3), shade(C.rock, 0.3), 'opacity=".7"').out());
    const carpet = sheet().p(c.cut([[CAMP - 140, CY + 4], [CAMP - 120, CY - 18], [CAMP + 120, CY - 18], [CAMP + 140, CY + 4]], 0.5, 8), C.terracotta);
    let fr = '';
    for (let x = CAMP - 130; x < CAMP + 130; x += 12) fr += c.ribbon([[x, CY + 4], [x, CY + 12]], 2);
    carpet.p(fr, C.ochre).x(c.ribbon([[CAMP - 110, CY - 8], [CAMP + 110, CY - 8]], 3), C.sun, 'opacity=".7"');
    G.add(carpet.out() + `<g transform="translate(${CAMP + 60} ${CY - 16})">${jug(c, C.pot)}</g><g transform="translate(${CAMP + 20} ${CY - 16})">${cup(c, C.sun)}</g><g transform="translate(${CAMP - 20} ${CY - 16})">${cup(c, C.sun)}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const aura = P.add(`<g>${glow(150, 0.5)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const greeter = S.puppet(P.add(person(c, GREETER)));
    const greeterSit = S.puppet(P.add(person(c, { ...GREETER, pose: 'sit' })));
    const servant = S.puppet(P.add(person(c, { ...SERVANT, holdF: `<g transform="translate(0 -8)">${cup(c, C.sun)}</g>` })));
    const A = S.puppet(P.add(person(c, SENT_A)));
    const A2 = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const bagEl = P.add(`<g>${bag(c)}</g>`);
    const B = S.puppet(P.add(person(c, SENT_B)));
    const B2 = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const purseEl = P.add(`<g>${purse(c)}</g>`);
    const shoes = P.add(`<g>${sandals(c)}</g>`);
    const fx = S.layer({ par: 0.52, sh: 4 });
    const pops = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));
    const slips = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(30, 44))), seed: c.rr(0, 6) }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1300, 160, T, 1, 0.6);
      swing(cl, 640 + Math.sin(T * 0.1) * 20, 200, T, 1.2, 0.6, 1);
      pose(lamp, { x: 1304, y: 428, s: 0.9 + (T ? Math.sin(T * 3) * 0.03 : 0), o: 1 });

      /* v4a — the purse, the bag, the sandals */
      const tell = bump(t, 0.02, 0.9);
      jesus.set({ x: JX, y: GY, s: 1.04, flip: false, armF: 20 + tell * 50 + es(t, 1.05, 1.2) * 40 * (1 - es(t, 1.6, 1.8)), armB: 10 + es(t, 1.05, 1.2) * 30, head: -2, blink: blinkAt(T) });
      pose(aura, { x: JX, y: GY - 120, o: 0.5 });
      const barefootK = es(t, 0.66, 0.7);
      const walkK = [[1.02, 0], [1.98, 640]];
      const w = kf(t, walkK, (x) => x);
      const walking = moving(t, walkK);
      const nod = bump(t, 1.34, 1.6);
      const ax = AX + w, bx = BX + w;
      const Aset = { x: ax, y: GY, s: 0.98, flip: !(t > 1.02), walk: walking ? ax * 0.05 : undefined, armF: 14 + bump(t, 0.1, 0.36) * 50 + nod * 60, armB: 10 + bump(t, 0.1, 0.36) * 20, head: nod * 8, blink: blinkAt(T, 2) };
      A.set({ ...Aset, o: 1 - barefootK });
      A2.set({ ...Aset, o: barefootK });
      const Bset = { x: bx, y: GY + 4, s: 0.95, flip: !(t > 1.02), walk: walking ? bx * 0.05 + 1 : undefined, armF: 14 + bump(t, 0.34, 0.6) * 70 + nod * 60, armB: 10 + bump(t, 0.34, 0.6) * 80, head: nod * 8, blink: blinkAt(T, 3) };
      B.set({ ...Bset, o: 1 - barefootK });
      B2.set({ ...Bset, o: barefootK });

      // the purse: at his belt → lifted → onto the stone
      const pk = es(t, 0.14, 0.36);
      const [ahx, ahy] = handAt(AX, GY, 0.98, true, 14 + bump(t, 0.1, 0.36) * 50);
      const pOn = [AX - 22, GY - 96];
      const px = pk < 0.5 ? lerp(pOn[0], ahx, pk * 2) : lerp(ahx, STONE[0] - 36, (pk - 0.5) * 2);
      const py = pk < 0.5 ? lerp(pOn[1], ahy, pk * 2) : lerp(ahy, STONE[1] - 42, (pk - 0.5) * 2) - Math.sin((pk - 0.5) * 2 * PI) * 30;
      pose(purseEl, { x: px, y: py, s: 0.9, o: 1 });
      // the bag: on his back → swung off → onto the stone
      const bk = es(t, 0.36, 0.6);
      const bOn = [BX + 26, GY - 110];
      pose(bagEl, { x: lerp(bOn[0], STONE[0] + 20, bk), y: lerp(bOn[1], STONE[1] - 50, bk) - Math.sin(bk * PI) * 60, r: Math.sin(bk * PI) * -30, s: 0.95, o: 1 });
      // the sandals: at their feet → set side by side on the ground by the stone
      const sk = es(t, 0.62, 0.82);
      pose(shoes, { x: lerp(BX - 30, STONE[0] - 10, sk), y: lerp(GY - 10, STONE[1] - 16, sk) - Math.sin(sk * PI) * 40, s: 0.9, o: seg(t, 0.64, 0.68) });
      pops.forEach((p, i) => { const k = bump(t, 0.3 + i * 0.24, 0.5 + i * 0.24); pose(p, { x: STONE[0] - 36 + i * 30, y: STONE[1] - 80, s: k, r: T * 40, o: k }); });

      /* v4b — the long greeting; they walk on */
      const rise = es(t, 1.2, 1.35);
      const bow = bump(t, 1.35, 1.95);
      greeterSit.set({ x: CAMP - 40, y: CY - 4, s: 0.94, flip: true, armF: 30, armB: 10, head: 4, o: 1 - es(t, 1.12, 1.18), blink: blinkAt(T, 5) });
      greeter.set({ x: CAMP - 60, y: CY, s: 0.94, flip: true, o: es(t, 1.12, 1.18), armF: 20 + rise * 60, armB: 20 + rise * 90, lean: bow * 24, head: bow * 12, blink: blinkAt(T, 5) });
      const svK = [[1.3, CAMP + 200], [1.6, CAMP + 40]];
      const svx = kf(t, svK);
      servant.set({ x: svx, y: CY + 4, s: 0.86, flip: true, o: seg(t, 1.28, 1.34), walk: moving(t, svK) ? svx * 0.05 : undefined, armF: 40 + es(t, 1.45, 1.6) * 40, armB: 10, blink: blinkAt(T, 6) });
      const [gx, gy] = headAt(CAMP - 60, CY, 0.94, true);
      slips.forEach((sl) => {
        const k = ((t - 1.3) * 2.4 + sl.i / slips.length) % 1;
        const on = es(t, 1.3, 1.4) * (1 - es(t, 1.92, 2.0));
        const x = lerp(gx - 30, gx - 260, k), y = gy - 20 - k * 70 + Math.sin(k * 7 + sl.seed) * 16;
        pose(sl.el, { x, y, r: Math.sin(sl.seed + k * 5) * 12, s: 0.7 + k * 0.4, o: t > 1.3 ? on * Math.min(1, k * 4) * (1 - k) : 0 });
      });

      S.cam.x = kf(t, [[0, 60], [1.0, 60], [1.9, 640], [2, 640]], ease.sine);
      S.cam.y = kf(t, [[0, 30], [1, 30], [2, 10]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.06], [1.5, 1.02], [2, 1.02]]);
    };
  },
};
