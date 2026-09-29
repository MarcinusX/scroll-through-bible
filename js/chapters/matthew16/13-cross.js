// Mt 16,24–25 — on the hillside path. "If anyone would come after me, let him deny himself": the disciples, each with
// a heavy bundle of his own on his back, set them down. "…take up his cross and follow me": small crosses come down onto
// their shoulders and they follow Him up the path, one after another. "Whoever would save his life will lose it": a man
// clutches his jar with its little flame to his chest, locks it in a chest — and the flame goes out in a wisp of smoke.
// "Whoever loses his life for my sake will find it": a woman pours out her light towards Jesus up the path — and it
// comes back to her, her jar brimming and bright.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, mix } from '../kit.js';
import { band, olive, cypress, bush, rock, sun, cloud, grass, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { headAt, hand, bundle, smallCross, soulLight, spark, lightJar, pourStream, chest, folk4, DAY, PI } from './lib.js';

const GY = 690;
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
  id: 'mt16-cross',
  beats: [
    { v: 24, text: 'Wtedy Jezus rzekł do swoich uczniów: «Jeśli kto chce pójść za Mną, niech się zaprze samego siebie,' },
    { v: 24, cont: true, text: 'niech weźmie krzyż swój i niech Mnie naśladuje.' },
    { v: 25, text: 'Bo kto chce zachować swoje życie, straci je;' },
    { v: 25, cont: true, text: 'a kto straci swe życie z mego powodu, znajdzie je.' },
  ],
  cam: { x: [-40, 140], y: [-40, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAY);
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

    /* ---------- the disciples ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const F = [
      { o: CAST.peter, x: 700 }, { o: CAST.andrew, x: 640 }, { o: CAST.john, x: 580 },
      { o: CAST.james, x: 905 }, { o: CAST.matthew, x: 970 }, { o: CAST.thomas, x: 1035 },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9) }));
    F.forEach((f) => {
      f.p = S.puppet(P.add(person(c, { ...f.o })));
      f.b = P.add(`<g><g transform="scale(1.35)">${bundle(c)}</g></g>`);
      f.cross = P.add(`<g>${smallCross(c, 92)}</g>`);
    });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    /* ---------- save / lose: the jar of light ---------- */
    const V = S.layer({ par: 0.62, sh: 5 });
    const keeper = S.puppet(V.add(person(c, { ...folk4(c, true), robe: C.plumRobe, mantle: C.ochre, belt: C.sun })));
    const ch = chest(c);
    const chestBase = V.add(`<g>${ch.base}</g>`);
    const lid = V.add(`<g>${ch.lid}</g>`);
    const jarA = V.add(`<g>${lightJar(c, { h: 40 }).replace(/<circle class="glow"[^>]*\/>/, '').replace(/<path class="flame"[^>]*\/>/, '')}</g>`);
    const lightA = V.add(`<g>${soulLight(c, 13)}</g>`);
    const smoke = V.add(`<path d="${c.ribbon(c.qbez([0, 0], [14, -30], [-6, -60], 10), (u) => 7 - u * 4)}" fill="${C.stone2}" opacity=".8"/>`);
    const giver = S.puppet(V.add(person(c, { ...folk4(c, false), robe: C.skyVeil, veil: C.linen, veil2: C.stone })));
    const jarB = V.add(`<g>${lightJar(c, { h: 40, col: C.clay }).replace(/<circle class="glow"[^>]*\/>/, '').replace(/<path class="flame"[^>]*\/>/, '')}</g>`);
    const lightB = V.add(`<g>${soulLight(c, 13)}</g>`);
    const stream = V.add(`<g>${pourStream(c, 120, 30)}</g>`);
    const sparksB = Array.from({ length: 6 }, (_, i) => ({ i, el: V.add(`<g>${spark(c, 9)}</g>`) }));

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 100, 900, 220, C.sage, C.moss) + rock(c, 1540, 920, 240, 90, C.rock2));

    return (t, time) => {
      const T = time;
      sk.blend(DAY, ['#d6e3dc', '#f4ead0', '#fbeed3'], es(t, 1, 4));
      swing(sunEl, 1260, 170, T, 1.1, 0.7);
      swing(cl1, 480 + Math.sin(T * 0.1) * 26, 160, T, 1.4, 0.6, 1);

      /* Jesus: speaks, then walks up the path and turns back to them */
      const up = es(t, 1.3, 1.95, (x) => x);
      const [jx, jy, jl] = along(up * 0.46);
      const climbing = t > 1.3 && t < 1.95;
      const speak = bump(t, 0.05, 0.95);
      const turnBack = es(t, 1.98, 2.1);
      pose(topGlow, { x: 1420, y: 500, s: 1 + es(t, 1.3, 2) * 0.6, o: 0.5 + es(t, 1.3, 2) * 0.5 });
      jesus.set({ x: jx, y: jy, s: lerp(0.98, 0.74, up), flip: climbing ? jl : turnBack > 0.5, walk: climbing ? (jx + jy) * 0.06 : undefined, armF: 16 + speak * 50 + bump(t, 1.0, 1.3) * 80 + turnBack * 30, armB: 8 + speak * 40 + turnBack * 20, blink: blinkAt(T) });
      const [tx, ty] = along(0.46);

      /* the disciples set down their bundles (v24a), take up crosses and follow (v24b) */
      F.forEach((f) => {
        let x = f.x, y = GY + 10 + (f.i % 3) * 8, s = 0.86, flip = f.x > 800, walk;
        const drop = es(t, 0.4 + f.i * 0.05, 0.65 + f.i * 0.05);
        const take = es(t, 1.02 + f.i * 0.03, 1.25 + f.i * 0.03);
        const fu = es(t, 1.3 + f.i * 0.05, 1.98, (x) => x);
        let al = false;
        if (fu > 0) {
          const [ax, ay, a2] = along(Math.max(0, up * 0.46 - 0.06 - f.i * 0.055));
          al = a2;
          const k = Math.min(1, fu * 3);
          x = lerp(x, ax, k); y = lerp(y, ay + 4, k); s = lerp(0.86, lerp(0.86, 0.66, up), k);
          if (fu < 1) { walk = (x + y) * 0.06; flip = al; } else flip = false;
        }
        const bent = (1 - drop) * 10;
        f.p.set({ x, y, s, flip, walk, lean: (flip ? -1 : 1) * bent, armF: 20 + bump(t, 0.3, 0.9) * 20 + take * 60, armB: (1 - drop) * 40 + 10, head: bent + (t > 0.1 && t < 1 ? -4 : 0), blink: blinkAt(T, f.seed) });
        const bx = x + (flip ? 16 : -16) * s, by = y - 120 * s;
        pose(f.b, { x: lerp(bx, f.x + (f.x > 800 ? 34 : -34), drop), y: lerp(by, GY - 26 + (f.i % 3) * 8, drop), s: 0.95, r: drop * 20, o: 1 - es(t, 1.9, 2.05) });
        const [hx, hy] = headAt(x, y, s, flip);
        const cy = lerp(hy - 300, hy + 44 * s, ease.out(take));
        pose(f.cross, { x: hx + (flip ? 10 : -10) * s, y: cy, s, r: (flip ? -1 : 1) * -28, o: take > 0.01 ? 1 : 0 });
      });

      /* v25a — the keeper hugs his jar, locks it in a chest; its flame goes out */
      const KX = S.portrait ? 540 : 480, GX = S.portrait ? 1080 : 1120, VY = GY + 64;
      const vIn = es(t, 1.95, 2.15);
      keeper.set({ x: KX - (1 - vIn) * 300, y: VY, s: 0.95, flip: false, walk: vIn < 1 && vIn > 0 ? KX * 0.05 + vIn * 10 : undefined, armF: 40 + bump(t, 2.2, 2.5) * 20 + es(t, 2.3, 2.45) * 10, armB: 30 + bump(t, 2.2, 2.5) * 20, head: 14, lean: bump(t, 2.3, 2.55) * 10, blink: blinkAt(T, 4) });
      pose(chestBase, { x: KX + 86, y: VY, o: vIn });
      const shut = es(t, 2.45, 2.58);
      pose(lid, { x: KX + 86 - 41, y: VY - 44, r: -(1 - shut) * 100, o: vIn });
      const [kx, ky] = hand(KX - (1 - vIn) * 300, VY, 0.95, false, 50);
      const inBox = es(t, 2.28, 2.45);
      const jax = lerp(kx - 4, KX + 86, inBox), jay = lerp(ky + 20, VY - 6, inBox);
      pose(jarA, { x: jax, y: jay, s: 0.9, o: vIn * (1 - shut) });
      const out = es(t, 2.55, 2.8);
      pose(lightA, { x: jax, y: jay - 50, s: (1 - out) * (1 - inBox * 0.4) * (T ? 1 + Math.sin(T * 5) * 0.05 : 1), o: vIn * (1 - Math.max(out, shut * 0.95)) });
      const sm = seg(t, 2.52, 2.95);
      pose(smoke, { x: KX + 90, y: VY - 50 - sm * 30, s: 0.6 + sm * 0.6, o: Math.sin(sm * PI) * 0.8 });

      /* v25b — the giver pours out her light towards Him; it comes back to her, brighter */
      giver.set({ x: GX + (1 - vIn) * 300, y: VY, s: 0.95, flip: true, walk: vIn < 1 && vIn > 0 ? GX * 0.05 + vIn * 10 : undefined, armF: 50 + es(t, 3.05, 3.25) * 50 - es(t, 3.5, 3.7) * 30, armB: 30 + es(t, 3.5, 3.7) * 100, head: -es(t, 3.05, 3.3) * 14, blink: blinkAt(T, 5) });
      const tip = es(t, 3.05, 3.25) * (1 - es(t, 3.45, 3.6));
      const [gx, gy] = hand(GX + (1 - vIn) * 300, VY, 0.95, true, 50 + es(t, 3.05, 3.25) * 50 - es(t, 3.5, 3.7) * 30);
      pose(jarB, { x: gx + 2, y: gy + 22, s: 0.9, r: -tip * 80, o: vIn });
      pose(stream, { x: gx - 16, y: gy - 10, sx: -1, o: bump(t, 3.1, 3.5) });
      const give = es(t, 3.1, 3.4), back = es(t, 3.48, 3.75);
      const bx = lerp(lerp(gx, tx, give), gx, back), by = lerp(lerp(gy - 30, ty - 150, give), gy - 70, back) - Math.sin(give * PI) * 60;
      pose(lightB, { x: bx, y: by, s: (1 - give * 0.3 * (1 - back)) + back * 1.1 + (T ? Math.sin(T * 4) * 0.04 * back : 0), o: vIn });
      sparksB.forEach((sp) => {
        const a = (sp.i / 6) * PI * 2 + (T ? T * 0.8 : 0);
        pose(sp.el, { x: gx + Math.cos(a) * 70, y: gy - 70 + Math.sin(a) * 40, s: back * (0.7 + (T ? Math.sin(T * 4 + sp.i) * 0.3 : 0)), o: back > 0.05 ? 1 : 0 });
      });

      S.cam.x = es(t, 1.3, 1.95) * 110 - es(t, 1.95, 2.3) * 60;
      S.cam.z = 1.06 + es(t, 0.3, 0.7) * 0.06 - es(t, 1.9, 2.3) * 0.08;
      S.cam.y = 20 + es(t, 0.3, 0.7) * 30 - es(t, 1.3, 1.9) * 40 + es(t, 1.9, 2.3) * 50;
    };
  },
};
