// Łk 11,9–10 — back in the olive grove; Jesus stands on the knoll and the disciples sit round Him. Three painted panels
// come down one after another over His head, each with its word. "Ask, and it will be given you": a poor man stands
// with open hands under the sky, and a warm loaf comes down into them. "Seek, and you will find": at dusk a shepherd
// with his lantern goes from rock to rock — and there behind the last one is his lost lamb, and he lifts it up.
// "Knock, and it will be opened to you": a man knocks at a closed door in a wall; it swings open and light pours out
// round him. "For everyone who asks receives, who seeks finds, to the one who knocks it is opened": all three panels
// shine at once, and on each the one who asked, sought and knocked has more company — every one receives.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillSet, HL, panel, panelSky, panelGround, figure, loaf, lamb, lanternHeld, knockMarks, sparkle, glow, kf, moving, tr, PI } from './lib.js';

const PW = 248, PH = 176, PY = 300;
const PX = [526, 800, 1074];

export default {
  id: 'lk11-ask',
  beats: [
    { v: 9, text: 'I Ja wam powiadam: Proście, a będzie wam dane;' },
    { v: 9, cont: true, text: 'szukajcie, a znajdziecie;' },
    { v: 9, cont: true, text: 'kołaczcie, a otworzą wam.' },
    { v: 10 },
  ],
  cam: { x: [-20, 20], y: [-60, 30], z: [1, 1.08] },
  build(S) {
    const H = hillSet(S, { sky2: null });
    const c = H.c;
    const q = makeCutter('lk11-ask-panels');
    const PXs = S.portrait ? [800, 800, 800] : PX, PYs = S.portrait ? [-80, 130, 340] : [PY, PY, PY];
    const shineL = S.layer({ par: 0.3, sh: 0, flat: true });
    const PL = S.layer({ par: 0.3, sh: 6 });
    const B = S.layer({ par: 0.3, sh: 5 });

    /* panel 1 — ask: a poor man under the sky, hands open */
    const p1 = PL.add(panel(S, panelSky(S, PW, PH, ['#cfe0dc', '#f6e6c6']) + panelGround(q, PW, 40, mix(C.hillNear, C.sand, 0.3))
      + figure(q, { robe: mix(C.stone2, C.wood3, 0.3), mantle: null, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope }, { x: -10, y: 70, s: 0.56, armF: 70, armB: 60, head: -14 })
      + figure(q, { ...CAST.john, robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, beard: 'none' }, { x: -74, y: 74, s: 0.48, armF: 50, armB: 40, head: -10 }), { w: PW, h: PH, word: tr('Proście', 'Ask') }));
    const gift = B.add(`<g opacity="0">${glow(34, 0.9)}${loaf(q, 15)}</g>`);
    const gift2 = B.add(`<g opacity="0">${glow(30, 0.9)}${loaf(q, 13)}</g>`);

    /* panel 2 — seek: the shepherd with his lantern among the rocks, the lost lamb */
    const rocks = sheet().p(q.cut(q.blob(-70, 56, 34, 18, 10, 0.2), 0.8, 5) + q.cut(q.blob(20, 50, 30, 22, 10, 0.2), 0.8, 5) + q.cut(q.blob(86, 54, 36, 22, 10, 0.2), 0.8, 5), mix(C.rock2, C.duskViolet, 0.3)).out();
    const p2 = PL.add(panel(S, panelSky(S, PW, PH, ['#6f6c9a', '#e2a68e']) + panelGround(q, PW, 50, mix(C.sand2, C.duskViolet, 0.3)), { w: PW, h: PH, word: tr('Szukajcie', 'Seek') }));
    const lambEl = B.add(`<g opacity="0"><g transform="scale(.5)">${lamb(q)}</g></g>`);
    const rocksEl = B.add(`<g opacity="0">${rocks}</g>`);
    const shep = S.puppet(B.add(person(q, { robe: C.ochreRobe, mantle: mix(C.wood3, C.sand2, 0.4), hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.clayMantle, beard: 'full', skin: C.skin3, belt: C.leather, holdF: lanternHeld(q, 50) })));
    const found = B.add(`<g opacity="0">${sparkle(q, 12)}</g>`);

    /* panel 3 — knock: a wall with a closed door */
    const wall = sheet().p(q.cut([[-PW / 2 - 4, -40], [PW / 2 + 4, -44], [PW / 2 + 4, PH / 2 + 4], [-PW / 2 - 4, PH / 2 + 4]], 0.5, 8), mix(C.plaster, C.sand, 0.3))
      .p(q.cut([[20, 60], [20, -6], ...q.arc(50, -6, 30, 22, PI, 2 * PI, 8), [80, -6], [80, 60]], 0.4, 5), mix(C.soilDark, C.plumRobe, 0.3)).out();
    const p3 = PL.add(panel(S, panelSky(S, PW, PH, ['#c9dcd8', '#f3e2c2']) + wall + panelGround(q, PW, 60, mix(C.sand, C.stone, 0.4), 2), { w: PW, h: PH, word: tr('Kołaczcie', 'Knock') }));
    const doorLight = B.add(`<g opacity="0">${glow(60, 1, 'halo-glow')}<path d="${q.poly([[-30, 66], [-30, 0], ...q.arc(0, 0, 30, 22, PI, 2 * PI, 8), [30, 0], [30, 66]])}" fill="#fff4d2"/></g>`);
    const doorLeaf = B.add(`<g>${sheet().p(q.cut(q.rect(0, -88, 60, 88), 0.4, 5), C.wood).x(q.ribbon([[30, -80], [30, -6]], 1.4), shade(C.wood, -0.3), 'opacity=".6"').out()}</g>`);
    const knocker = S.puppet(B.add(person(q, { robe: C.tealRobe, mantle: C.wheatRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather })));
    const knocks = [0, 1].map(() => B.add(`<g opacity="0">${knockMarks(q, -1)}</g>`));
    const guests = S.puppet(B.add(person(q, { robe: C.mauve, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair, beard: 'none', skin: C.skin })));

    /* v10: the three shine */
    const halos = PX.map(() => shineL.add(`<g opacity="0"><rect x="${-PW / 2 - 30}" y="${-PH / 2 - 30}" width="${PW + 60}" height="${PH + 60}" rx="40" fill="url(#halo-glow)"/></g>`));
    const spark = PX.map(() => B.add(`<g opacity="0">${sparkle(q, 14)}</g>`));

    return (t, time) => {
      const T = time;
      H.heaven(0.55, 0, T);
      /* Jesus teaching, the disciples listening */
      const pointTo = kf(t, [[0, 0], [0.1, 1], [0.95, 1], [1.1, 2], [1.95, 2], [2.1, 3], [2.95, 3], [3.1, 4]]);
      const flip = pointTo < 1.5 && pointTo > 0.5;
      H.jesus.set({ x: HL.X, y: HL.KNOLL, s: 1.04, flip, armF: 20 + es(t, 0.05, 0.25) * 60 + es(t, 3.05, 3.25) * 10, armB: 8 + es(t, 3.05, 3.3) * 90, head: -8, blink: blinkAt(T) });
      H.jKneel.set({ o: 0 });
      pose(H.jGlow, { x: HL.X, y: HL.KNOLL - 110, s: 0.9, o: 0.4 });
      H.dis.forEach((d) => H.disc(d, 0, { head: -8, armF: 16 + es(t, 3.1 + d.i * 0.03, 3.3 + d.i * 0.03) * 40, armB: 8 + es(t, 3.1 + d.i * 0.03, 3.3 + d.i * 0.03) * 60, blink: blinkAt(T, d.seed) }));

      /* the panels come down, one per saying */
      const drop = (a) => es(t, a, a + 0.3, ease.out);
      const k1 = drop(0.02), k2 = drop(1.02), k3 = drop(2.02);
      const Yi = (i, k) => lerp(-1500, PYs[i], k);
      const place = (el, k, x, i) => pose(el, { x, y: Yi(i, k), r: T ? Math.sin(T * 0.7 + i * 1.7) * 0.6 * k : 0, o: k > 0.002 ? 1 : 0 });
      place(p1, k1, PXs[0], 0); place(p2, k2, PXs[1], 1); place(p3, k3, PXs[2], 2);
      const on = (k, el, dx, dy, o = 1, extra = {}, i = 0) => pose(el, { x: dx, y: Yi(i, k) + dy, o: k > 0.9 ? o : 0, ...extra });

      /* 1 — the loaf comes down into the open hands */
      const g1 = es(t, 0.32, 0.62, ease.out);
      on(k1, gift, PXs[0] + 22, 0, g1 > 0 ? 1 : 0, { y: Yi(0, k1) + lerp(-110, 8, g1) });
      const g2 = es(t, 3.1, 3.4, ease.out);
      on(k1, gift2, PXs[0] - 54, lerp(-110, 26, g2), g2 > 0 ? 1 : 0, { y: Yi(0, k1) + lerp(-110, 26, g2) });

      /* 2 — the shepherd seeks; the lamb is found */
      const SK = [[1.2, -96], [1.45, -40], [1.55, -40], [1.72, 44]];
      const sx = kf(t, SK);
      const lift = es(t, 1.74, 1.84);
      shep.set({ x: PXs[1] + sx, y: Yi(1, k2) + 66, s: 0.52, o: k2 > 0.9 ? 1 : 0, walk: moving(t, SK) ? sx * 0.2 : undefined, armF: 50 - lift * 20, armB: 10 + lift * 110, head: 10 - lift * 16, blink: blinkAt(T, 2) });
      on(k2, rocksEl, PXs[1], 0, 1, {}, 1);
      const lp = es(t, 1.72, 1.84, ease.back);
      on(k2, lambEl, PXs[1] + 84, 50 - lp * 34, 1, { y: Yi(1, k2) + 50 - lp * 34 });
      pose(found, { x: PXs[1] + 84, y: Yi(1, k2) + 4, s: bump(t, 1.74, 2.0), r: T * 40, o: k2 > 0.9 ? bump(t, 1.74, 2.0) : 0 });

      /* 3 — he knocks; the door opens and light pours out */
      const kk = t > 2.3 && t < 2.55 ? Math.abs(Math.sin((t - 2.3) * 40)) : 0;
      const open = es(t, 2.55, 2.68);
      knocker.set({ x: PXs[2] - 36, y: Yi(2, k3) + 64, s: 0.5, o: k3 > 0.9 ? 1 : 0, armF: 70 + kk * 20 - open * 20, armB: 10 + open * 90, head: -open * 6, lean: -open * 4, blink: blinkAt(T, 4) });
      knocks.forEach((kn, i) => pose(kn, { x: PXs[2] + 12, y: Yi(2, k3) + 16 + i * 14, s: 0.7, o: k3 > 0.9 ? bump(t, 2.3 + i * 0.1, 2.5 + i * 0.1) : 0 }));
      pose(doorLeaf, { x: PXs[2] + 20, y: Yi(2, k3) + 60, sx: Math.max(0.1, 1 - open * 0.9), o: k3 > 0.002 ? 1 : 0 });
      on(k3, doorLight, PXs[2] + 50, -6, open, {}, 2);

      /* v10 — everyone: all three shine; more come and receive */
      const all = es(t, 3.05, 3.35);
      halos.forEach((h, i) => pose(h, { x: PXs[i], y: PYs[i], o: all * 0.9 }));
      spark.forEach((sp, i) => pose(sp, { x: PXs[i] + 90, y: PYs[i] - 60, s: all, r: T * 30, o: all }));
      const gk = es(t, 3.2, 3.5);
      guests.set({ x: PXs[2] - 86 + gk * 20, y: Yi(2, k3) + 66, s: 0.46, o: k3 > 0.9 ? gk : 0, armF: 40 + gk * 20, armB: 20, head: -6, blink: blinkAt(T, 5) });

      S.cam.y = kf(t, [[0, -40], [3.0, -40], [3.3, -20]]);
      S.cam.z = kf(t, [[0, 1.02], [3.0, 1.02], [3.3, 1.0]]);
      S.cam.x = kf(t, [[0, -20], [1.0, -10], [1.5, 0], [2.0, 10], [2.5, 20], [3.0, 0]]);
      if (S.portrait) { S.cam.x = 0; S.cam.y = -60; S.cam.z = 1.0; }
    };
  },
};
