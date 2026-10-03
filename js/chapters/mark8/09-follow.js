// Mk 8,34–35 — "Whoever wants to come after me…": He calls the crowd; people set down their heavy bundles
// (deny themselves), small crosses come down onto their shoulders and they follow Him up the path.
// Saving one's life / losing it: one man locks his little light in a chest and it goes out;
// a woman gives hers away towards Him — and it comes back bright.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, sun, cloud, grass, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, man, bundle, smallCross, soulLight, spark, PI } from './lib.js';

const GY = 690;
// the path up the hill: front → hilltop
const PATH = [[760, 700], [860, 668], [960, 628], [1070, 584], [1190, 548], [1310, 520], [1420, 504]];
function along(u) {
  let tot = 0;
  const L = [];
  for (let i = 1; i < PATH.length; i++) { const l = Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]); L.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i] || i === L.length - 1) { const k = Math.min(1, d / L[i]); return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * k, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * k, PATH[i + 1][0] < PATH[i][0]]; }
    d -= L[i];
  }
  return [...PATH[PATH.length - 1], false];
}

export default {
  id: 'm8-follow',
  beats: [
    { v: 34, text: 'Potem przywołał do siebie tłum razem ze swoimi uczniami i rzekł im:' },
    { v: 34, cont: true, text: '«Jeśli kto chce pójść za Mną, niech się zaprze samego siebie,' },
    { v: 34, cont: true, text: 'niech weźmie krzyż swój i niech Mnie naśladuje!' },
    { v: 35, text: 'Bo kto chce zachować swoje życie, straci je;' },
    { v: 35, cont: true, text: 'a kto straci swe życie z powodu Mnie i Ewangelii, zachowa je.' },
  ],
  cam: { x: [-40, 140], y: [-40, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe0dc', '#f1e7cf', '#f7e6cc'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1260, y: 170, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 480, y: 160, len: 700 });

    /* ---------- the hill and its path ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
    const hillL = S.layer({ par: 0.5, sh: 3 });
    const hfn = (x) => 700 - Math.max(0, Math.min(1, (x - 640) / 700)) * 210 + Math.sin(x * 0.01) * 4;
    const hp = [];
    for (let x = -900; x <= 2500; x += 14) hp.push([x, hfn(x) + c.rr(-1, 1)]);
    hp.push([2500, 1700], [-900, 1700]);
    hillL.add(sheet().p(c.poly(hp), C.hillNear).out());
    hillL.add(sheet().p(c.ribbon(c.cbez(PATH[0], PATH[2], PATH[4], PATH[6], 30), (u) => 64 - u * 46, 2), C.sand).out());
    hillL.add(olive(c, 1440, 505, 0.9) + cypress(c, 1240, 520, 140) + cypress(c, 560, 700, 160) + grass(c, { x0: 600, x1: 1600, y: 600, fn: hfn, n: 30, h: 12, color: C.moss }) + flowers(c, { x0: 700, x1: 1500, y: 600, fn: hfn, n: 18 }));
    const topGlow = hillL.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);
    const frontL = S.layer({ par: 0.5, sh: 3 });
    frontL.add(sheet().p(c.ridge(c.wave(GY + 16, [4, 2], [600, 160]), -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out());

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    // followers: they come, set down their bundles, take up crosses, follow up the path
    const F = [
      { o: CAST.peter, x: 700, from: 300, bund: false }, { o: man(c), x: 640, from: 200, bund: true }, { o: crowdPerson(c), x: 580, from: 150, bund: false },
      { o: CAST.john, x: 905, from: 1400, bund: false }, { o: man(c), x: 970, from: 1450, bund: true }, { o: crowdPerson(c), x: 1035, from: 1500, bund: true },
      { o: CAST.andrew, x: 520, from: 100, bund: false },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9), u0: 0.06 + (i % 3) * 0.08 }));
    F.forEach((f) => {
      f.p = S.puppet(P.add(person(c, { ...f.o, holdB: '' })));
      if (f.bund) f.b = P.add(`<g>${bundle(c)}</g>`);
      f.cross = P.add(`<g>${smallCross(c, 92)}</g>`);
    });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    /* ---------- save / lose: two little lights ---------- */
    const V = S.layer({ par: 0.62, sh: 5 });
    const keeper = S.puppet(V.add(person(c, { ...man(c), robe: C.plumRobe, mantle: C.ochre, belt: C.sun })));
    const chestBase = V.add(`<g>${sheet().p(c.cut(c.rect(-36, -40, 72, 40), 0.4, 6), C.wood2).p(c.ribbon([[-36, -22], [36, -22]], 4) + c.cut(c.rect(-6, -30, 12, 12), 0.2, 3), C.sun).out()}</g>`);
    const lid = V.add(`<g>${sheet().p(c.cut([[-38, 0], [38, 0], [34, -14], [-34, -14]], 0.4, 5), shade(C.wood2, 0.1)).out()}</g>`);
    const lightA = V.add(`<g>${soulLight(c, 16)}</g>`);
    const giver = S.puppet(V.add(person(c, { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', robe: C.skyVeil, veil: C.linen })));
    const lightB = V.add(`<g>${soulLight(c, 16)}</g>`);
    const sparksB = Array.from({ length: 6 }, (_, i) => ({ i, el: V.add(`<g>${spark(c, 9)}</g>`) }));

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 100, 900, 220, C.sage, C.moss) + rock(c, 1540, 920, 240, 90, C.rock2));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#d6e3dc', '#f4ead0', '#fbeed3'], es(t, 2, 5));
      swing(sunEl, 1260, 170 - es(t, 0, 5) * 20, T, 1.1, 0.7);
      swing(cl1, 480 + Math.sin(T * 0.1) * 26, 160, T, 1.4, 0.6, 1);

      /* Jesus: calls them, speaks, then walks up the path */
      const up = es(t, 2.2, 2.95, (x) => x);
      const [jx, jy, jl] = along(up * 0.46);
      const climbing = t > 2.2 && t < 2.95;
      const call = bump(t, 0.02, 0.9);
      const speak = bump(t, 1.05, 1.95);
      const turnBack = es(t, 3.0, 3.2);
      pose(topGlow, { x: 1420, y: 500, s: 1 + es(t, 2.2, 3) * 0.6, o: 0.5 + es(t, 2.2, 3) * 0.5 });
      jesus.set({ x: jx, y: jy, s: lerp(0.95, 0.72, up), flip: climbing ? jl : turnBack > 0.5, walk: climbing ? (jx + jy) * 0.06 : undefined, armF: 16 + call * (70 + Math.sin(T * 6) * 16) + speak * 60 + bump(t, 2.0, 2.3) * 80 + turnBack * 30, armB: 8 + call * 30 + turnBack * 20, blink: blinkAt(T) });

      F.forEach((f) => {
        const come = seg(t, 0.05 + f.i * 0.04, 0.7 + f.i * 0.04);
        let x = lerp(f.from, f.x, ease.out(come)), y = GY + 10 + (f.i % 3) * 8, s = 0.86, flip = f.x > 800, walk;
        if (come > 0 && come < 1) walk = x * 0.05;
        const drop = f.bund ? es(t, 1.2 + f.i * 0.04, 1.45 + f.i * 0.04) : 0;
        const take = es(t, 2.02 + f.i * 0.03, 2.25 + f.i * 0.03);
        // follow up the path, one after another
        const fu = es(t, 2.3 + f.i * 0.05, 3.0, (x) => x);
        if (fu > 0) {
          const [ax, ay, al] = along(Math.max(0, up * 0.46 - 0.06 - f.i * 0.055));
          const k = Math.min(1, fu * 3);
          x = lerp(x, ax, k); y = lerp(y, ay + 4, k); s = lerp(0.86, lerp(0.86, 0.66, up), k);
          if (fu < 1) { walk = (x + y) * 0.06; flip = al; }
          else flip = false;
        }
        const bent = f.bund ? (1 - drop) * 10 : 0;
        f.p.set({ x, y, s, flip, walk, lean: (flip ? -1 : 1) * bent, armF: 20 + bump(t, 1.2, 1.9) * 20 + take * 60, armB: f.bund ? (1 - drop) * 40 : 10, head: bent + (t > 0.9 && t < 2 ? -6 : 0), blink: blinkAt(T, f.seed) });
        if (f.b) {
          // the bundle on the back, then set down on the ground
          const bx = x + (flip ? 16 : -16) * s, by = y - 120 * s;
          pose(f.b, { x: lerp(bx, f.x + (f.x > 800 ? 26 : -26), drop), y: lerp(by, GY + 26 + (f.i % 3) * 8, drop), s: s * 1.1, r: drop * 20, o: 1 });
        }
        const [hx, hy] = headAt(x, y, s, flip);
        const cy = lerp(hy - 300, hy + 44 * s, ease.out(take));
        pose(f.cross, { x: hx + (flip ? 10 : -10) * s, y: cy, s: s, r: (flip ? -1 : 1) * -28, o: take > 0.01 ? 1 : 0 });
      });

      /* v35 — save it and lose it / lose it and save it */
      const KX = S.portrait ? 625 : 470, GX = S.portrait ? 1080 : 1130, VY = GY + 60;
      const vIn = es(t, 2.95, 3.15);
      keeper.set({ x: KX - (1 - vIn) * 300, y: VY, s: 0.95, flip: false, walk: vIn < 1 && vIn > 0 ? KX * 0.05 + vIn * 10 : undefined, armF: 30 + bump(t, 3.2, 3.6) * 40, armB: 20 + bump(t, 3.2, 3.6) * 30, head: 16, lean: bump(t, 3.2, 3.6) * 10, blink: blinkAt(T, 4) });
      pose(chestBase, { x: KX + 80, y: VY, o: vIn });
      const shut = es(t, 3.45, 3.62);
      pose(lid, { x: KX + 80 - 38, y: VY - 40, r: -(1 - shut) * 100, ox: -38, o: vIn });
      const inBox = es(t, 3.2, 3.45);
      const dimA = es(t, 3.62, 3.9);
      pose(lightA, { x: lerp(KX + 40, KX + 80, inBox), y: lerp(VY - 110, VY - 26, inBox), s: (1 - dimA) * (1 - shut * 0.6) * (1 + Math.sin(T * 5) * 0.05), o: vIn * (1 - Math.max(dimA, shut * 0.9)) });
      giver.set({ x: GX + (1 - vIn) * 300, y: VY, s: 0.95, flip: true, walk: vIn < 1 && vIn > 0 ? GX * 0.05 + vIn * 10 : undefined, armF: 40 + es(t, 4.05, 4.3) * 60, armB: 30 + es(t, 4.05, 4.3) * 60, head: -es(t, 4.05, 4.4) * 16, blink: blinkAt(T, 5) });
      const give = es(t, 4.1, 4.45), back = es(t, 4.5, 4.85);
      const [tx, ty] = along(0.46);
      const bx = lerp(lerp(GX - 70, tx, give), GX - 50, back), by = lerp(lerp(VY - 130, ty - 150, give), VY - 160, back) - Math.sin(give * PI) * 60;
      pose(lightB, { x: bx, y: by, s: (1 - give * 0.4 * (1 - back)) + back * 1.2 + Math.sin(T * 4) * 0.04 * back, o: vIn });
      sparksB.forEach((sp) => {
        const a = (sp.i / 6) * PI * 2 + T * 0.8;
        pose(sp.el, { x: GX - 50 + Math.cos(a) * 70, y: VY - 160 + Math.sin(a) * 40, s: back * (0.7 + Math.sin(T * 4 + sp.i) * 0.3), o: back > 0.05 ? 1 : 0 });
      });

      S.cam.x = es(t, 2.2, 2.95) * 110 - es(t, 2.95, 3.3) * (S.portrait ? 0 : 60);   // phone: stay with Him up the hill
      S.cam.z = 1.06 + es(t, 0.9, 1.3) * 0.06 - es(t, 2.9, 3.3) * 0.08;
      S.cam.y = 20 + es(t, 0.9, 1.3) * 30 - es(t, 2.2, 2.9) * 40 + es(t, 2.9, 3.3) * 50;
    };
  },
};
