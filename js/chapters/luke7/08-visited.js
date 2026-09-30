// Łk 7,16–17 — at the gate of Nain fear takes hold of them all: both crowds sink to their knees and cover their
// heads. Then they rise and praise God with lifted arms, light comes down on the whole road from above, and they
// cry out: "A great prophet has arisen among us!" — "God has visited his people!" The news goes out: runners set
// off down the road both ways, and on a map of the land let down from the flies little lights spring up town after
// town, through all Judea and the country round about.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  nainSet, NAIN, NP, BEARERS, WIDOW, YOUTH, carriedBier, mournerGroup, folkGroup, bubble, rayBurst, sparkle, cityIcon, hang2, headAt, kf, moving, tr, FONT, PI,
} from './lib.js';

const FEET = NAIN.FEET;
const RISEN = { ...YOUTH, robe: C.linen, belt: C.linen2 };
const MX = 800, MY = 230, MW = 660, MH = 190;           // the hanging map
// towns on the map (map coords, centre 0,0): [pl, en, x, y, delay]
const TOWNS = [
  ['Nain', 'Nain', -40, -40, 0], ['Kafarnaum', 'Capernaum', 30, -72, 0.08], ['Nazaret', 'Nazareth', -110, -48, 0.14], ['Sychar', 'Sychar', -60, 4, 0.2],
  ['Jerycho', 'Jericho', 80, 38, 0.28], ['Jerozolima', 'Jerusalem', -10, 52, 0.34], ['Betlejem', 'Bethlehem', -60, 72, 0.42], ['Hebron', 'Hebron', -150, 70, 0.5],
];

export default {
  id: 'lk7-visited',
  beats: [
    { v: 16 },
    { v: 17 },
  ],
  cam: { x: [-20, 110], y: [-120, 30], z: [0.98, 1.14] },
  build(S) {
    const N = nainSet(S);
    const c = S.c;
    /* light from above (behind everyone) */
    const LL = S.layer({ par: 0.3, sh: 0, flat: true });
    const beam = LL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 60, r1: 700, spread: 0.03, o: 0.28 })}</g>`);
    const beamGlow = LL.add(`<ellipse rx="700" ry="300" fill="url(#halo-glow)" opacity="0"/>`);
    /* the town crowd in three states: wailing, afraid, praising */
    const TL = S.layer({ par: 0.4, sh: 4 });
    const townX = [1260, 1470];
    const town = ['wail', 'fear', 'praise'].map((a) => [0, 1].map((i) => TL.sprite(mournerGroup(makeCutter('lk7-mourn' + i), 6, { s: 0.86, seed: i * 2, arms: a, pose: a === 'fear' ? 'kneel' : 'stand' }), townX[i], FEET - 4 - i * 6)));
    const P = S.layer({ par: 0.4, sh: 5 });
    const bear = BEARERS.map((o, i) => ({ i, far: i < 2, o, p: null }));
    bear.filter((b) => b.far).forEach((b) => { b.p = S.puppet(P.add(person(c, b.o))); });
    const bierEl = P.add(`<g>${carriedBier(c, NP.BW)}</g>`);
    bear.filter((b) => !b.far).forEach((b) => { b.p = S.puppet(P.add(person(c, b.o))); });
    const son = S.puppet(P.add(person(c, RISEN)));
    const widow = S.puppet(P.add(person(c, WIDOW)));
    N.addFront();
    const JL = S.layer({ par: 0.4, sh: 5 });
    const folX = [170, -80];
    const fol = ['walk', 'fear', 'praise'].map((a) => [0, 1].map((i) => JL.sprite(folkGroup(makeCutter('lk7-nf' + i), 6, { s: 0.86, arms: a, pose: a === 'fear' ? 'kneel' : 'stand' }), folX[i], FEET - 6 - i * 8)));
    const DIS = [CAST.peter, CAST.john, CAST.james, CAST.andrew].map((o, i) => ({ i, p: S.puppet(JL.add(person(c, o))), k: S.puppet(JL.add(person(c, { ...o, pose: 'kneel' }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const runners = [0, 1].map((i) => S.puppet(JL.add(person(c, { robe: [C.ochreRobe, C.tealRobe][i], hair: C.hair3, hairStyle: 'short', beard: 'none', skin: [C.skin3, C.skin2][i], belt: C.leather }))));
    const W = S.layer({ par: 0.42, sh: 3 });
    const cryA = W.add(`<g opacity="0">${bubble(c, [tr('Wielki prorok', 'A great prophet'), tr('powstał wśród nas!', 'has arisen among us!')], { size: 20, dir: -1 })}</g>`);
    const cryB = W.add(`<g opacity="0">${bubble(c, [tr('Bóg łaskawie nawiedził', 'God has visited'), tr('lud swój!', 'his people!')], { size: 20, dir: 1 })}</g>`);

    /* the map of the land, let down on two strings */
    const ML = S.layer({ par: 0.2, sh: 6 });
    const m = sheet();
    m.p(c.cut(c.rect(-MW / 2 - 8, -MH / 2 - 8, MW + 16, MH + 16), 0.5, 8), C.wood3);
    m.p(c.cut(c.rect(-MW / 2, -MH / 2, MW, MH), 0.5, 8), C.parchment);
    // the land, the lake, the Jordan and the Dead Sea, the coast on the left
    m.p(c.cut([[-MW / 2 + 60, -MH / 2 + 4], [MW / 2 - 60, -MH / 2 + 4], [MW / 2 - 40, MH / 2 - 4], [-MW / 2 + 20, MH / 2 - 4]], 1, 10), mix(C.hillNear, C.sand, 0.45));
    m.p(c.cut(c.blob(40, -70, 16, 12, 10, 0.1), 0.4, 4) + c.cut(c.blob(60, 58, 12, 26, 10, 0.1), 0.4, 4), C.lake2);
    m.p(c.ribbon([[42, -58], [50, -20], [44, 10], [58, 34]], 3), C.lake2);
    m.x(c.ribbon([[-230, -12], [230, -18]], 1.4) + c.ribbon([[-230, 24], [230, 20]], 1.4), shade(C.sand2, -0.2), 'opacity=".6"');
    const lbl = (x, y, t, sz = 17) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${sz}" font-style="italic" fill="${C.terracotta}">${t}</text>`;
    let tw = '';
    TOWNS.forEach(([pl, en, x, y]) => { tw += `<g transform="translate(${x} ${y}) scale(.26)">${cityIcon(c, 90, { tower: false })}</g>`; });
    const mapM = m.out() + tw + lbl(-250, -52, tr('Galilea', 'Galilee'), 20) + lbl(-250, 62, tr('Judea', 'Judea'), 22) + lbl(210, -52, tr('okoliczna kraina', 'the region around'), 16) + lbl(210, 62, tr('za Jordanem', 'beyond the Jordan'), 16);
    const map = ML.add(hang2(mapM, MW * 0.36, 400));
    const lights = TOWNS.map(([pl, en, x, y, d], i) => ({ x, y, d, i, el: ML.add(`<g opacity="0"><circle r="22" fill="url(#warm-glow)"/>${sparkle(c, 9, C.halo)}</g>`) }));

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v16 — fear takes hold of all; then they praise God */
      const fear = es(t, 0.06, 0.12) * (1 - es(t, 0.42, 0.48));
      const praise = es(t, 0.42, 0.48);
      const st = [1 - fear - praise, fear, praise];
      town.forEach((g, a) => g.forEach((sp, i) => sp.set({ x: townX[i], y: FEET - 4 - i * 6, s: 1 - i * 0.06, o: Math.max(0, st[a]) })));
      fol.forEach((g, a) => g.forEach((sp, i) => sp.set({ x: folX[i], y: FEET - 6 - i * 8, s: 1 - i * 0.08, o: Math.max(0, st[a]) })));
      DIS.forEach((d) => {
        const x = NP.DIS[Math.min(2, d.i)] - (d.i === 3 ? 80 : 0), y = FEET + (d.i % 2 ? 8 : -3);
        d.p.set({ x, y, s: 0.98, o: 1 - fear, armF: 12 + praise * 20, armB: 10 + praise * 155, head: -praise * 16, blink: blinkAt(T, d.seed) });
        d.k.set({ x, y, s: 0.98, o: fear, armF: 148, armB: 40, head: 24, blink: 1 });
      });
      const bx = NP.BX - 10;
      bear.forEach((b) => {
        const x = bx + (b.i % 2 ? 108 : -108) + (b.far ? 10 : 0);
        b.p.set({ x, y: FEET + (b.far ? -8 : 4), s: 0.94, flip: true, armF: b.far ? 20 : 26 + praise * 40, armB: 74 + praise * (b.far ? 20 : 80), head: -6 + fear * 20 - praise * 14, blink: blinkAt(T, b.i + 2) });
      });
      pose(bierEl, { x: bx, y: NP.BY + 52 });
      son.set({ x: 866, y: FEET + 6, s: 0.96, armF: 90 - praise * 30, armB: 80 + praise * 70, head: -4 - praise * 10, blink: blinkAt(T, 3) });
      widow.set({ x: 930, y: FEET + 2, s: 1.0, flip: true, armF: 96, armB: 80 + praise * 60, head: 4 - praise * 14, blink: blinkAt(T, 5) });
      jesus.set({ x: 680, y: FEET, s: 1.04, armF: 40 + praise * 20, armB: 10, head: -praise * 4, blink: blinkAt(T) });
      const lk = es(t, 0.45, 0.8);
      pose(beam, { x: 800, y: -300, s: 0.8 + lk * 0.2, o: lk * 0.7 });
      pose(beamGlow, { x: 800, y: 200, s: 0.7 + lk * 0.2, o: lk * 0.35 });
      const a = es(t, 0.52, 0.64, ease.back) * (1 - es(t, 1.0, 1.06));
      const b = es(t, 0.64, 0.76, ease.back) * (1 - es(t, 1.0, 1.06));
      pose(cryA, { x: S.portrait ? 520 : 440, y: S.portrait ? 470 : 490, s: a, o: a > 0.02 ? 1 : 0 });
      pose(cryB, { x: S.portrait ? 1090 : 1170, y: S.portrait ? 420 : 470, s: b, o: b > 0.02 ? 1 : 0 });

      /* v17 — the report goes out through all Judea and the region around */
      runners.forEach((r, i) => {
        const K = i ? [[1.05, 980], [2.0, 1250]] : [[1.05, 620], [2.0, 370]];
        const x = kf(t, K);
        r.set({ x, y: FEET + 30, s: 0.9, flip: !i, o: seg(t, 1.0, 1.06), walk: moving(t, K) ? x * 0.08 : undefined, amt: 1.6, armF: 40, armB: 30, lean: 8, blink: blinkAt(T, i) });
      });
      const mk = es(t, 1.0, 1.28, ease.out);
      const my = lerp(-900, MY, mk);
      pose(map, { x: MX, y: my, r: T ? Math.sin(T * 0.6) * 0.5 * mk : 0, o: my < -150 ? 0 : 1 });
      lights.forEach((l) => {
        const k = es(t, 1.3 + l.d, 1.42 + l.d, ease.back);
        pose(l.el, { x: MX + l.x, y: my + l.y - 8, s: k * (1 + (T ? Math.sin(T * 3 + l.i) * 0.08 : 0)), o: k > 0.02 && my > -150 ? 1 : 0 });
      });

      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.04], [1.3, 1.0]]);
      S.cam.y = kf(t, [[0, 20], [0.9, 0], [1.3, -90]]);
      S.cam.x = kf(t, [[0, 60], [1.3, 20]]);
    };
  },
};
