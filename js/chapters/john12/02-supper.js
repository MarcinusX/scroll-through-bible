// J 12,2–3 — the supper in Lazarus' house. The lamps are lit and the dishes come down onto the low table. Martha
// bustles in with a platter; Lazarus, beside Jesus, lifts his cup to Him. Mary comes through the dark doorway
// with a tall alabaster jar — a pound of pure nard — kneels at His outstretched feet, pours it over them, loosens
// her hair and wipes them. Then the fragrance rises: curls of scent and sprigs of nard fill the whole house.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { supperRoom, SR, EVE, LAZ, MARY, TW, martha, mary, maryHair, outLegs, cushion, nardJar, nardSprig, curl, platter, jug, loaf, cup, grapes, bowl, nameTag, hanging, swing, kf, vis, hand, sparkle, tr, PI, FONT } from './lib.js';

export default {
  id: 'j12-supper',
  beats: [
    { v: 2, text: 'Urządzono tam dla Niego ucztę.' },
    { v: 2, cont: true, text: 'Marta posługiwała, a Łazarz był jednym z zasiadających z Nim przy stole.' },
    { v: 3, text: 'Maria zaś wzięła funt szlachetnego i drogocennego olejku nardowego' },
    { v: 3, cont: true, text: 'i namaściła Jezusowi nogi, a włosami swymi je otarła.' },
    { v: 3, cont: true, text: 'A dom napełnił się wonią olejku.' },
  ],
  cam: { x: [-60, 120], y: [-60, 80], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const R = supperRoom(S, { skyCols: EVE });
    const { FLOOR, SEAT, TOP, JX, MX } = SR;
    /* the guests behind the table: Martha (serving, behind them), Lazarus, Peter, John, Thomas, Judas */
    const mar = S.puppet(R.backL.add(martha(c, { holdF: `<g transform="rotate(80) translate(0 -6)">${platter(c)}</g>`, holdB: `<g transform="rotate(10)">${jug(c)}</g>` })));
    const looks = [LAZ, CAST.peter, CAST.john, CAST.thomas];
    const guests = looks.map((o, i) => ({ i, x: SR.GUESTS[i], p: S.puppet(R.backL.add(person(c, { ...o, pose: 'sit', holdF: i === 0 ? `<g transform="rotate(70)">${cup(c, C.clay)}</g>` : '' }))) }));
    const jud = S.puppet(R.backL.add(person(c, { ...TW.judas, pose: 'sit' })));
    /* the dishes come down onto the table */
    const dishes = [[960, cup(c)], [1000, loaf(c, 16)], [1055, grapes(c, 4.4)], [1110, bowl(c, { food: 'fruit', color: C.skyVeil })], [1160, loaf(c, 14)], [1205, cup(c, C.clay)], [905, bowl(c, { food: 'bread', color: C.stone2 })]]
      .map(([x, m], i) => ({ x, i, el: R.tableL.add(`<g>${m}</g>`) }));
    /* Jesus on a cushion at the end of the table, His feet stretched out towards the door */
    R.frontL.add(`<g transform="translate(${JX + 20} ${FLOOR + 2})">${cushion(c, 170)}</g>`);
    const legs = R.frontL.add(`<g>${outLegs(c, { robe: C.linen, skin: C.skin })}</g>`);
    const sheen = legs.querySelector('.sheen');
    const jesus = S.puppet(R.frontL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    /* Mary: walking in with the jar, kneeling (veiled), kneeling with her hair let down */
    const maryW = S.puppet(R.frontL.add(mary(c)));
    const maryK = S.puppet(R.frontL.add(mary(c, { pose: 'kneel' })));
    const maryH = S.puppet(R.frontL.add(maryHair(c, 'kneel')));
    const hairEl = maryH.el.querySelector('.lhair');
    const jar = R.fx.add(`<g><circle cy="-30" r="46" fill="url(#halo-glow)" opacity=".6"/>${nardJar(c, 56)}</g>`);
    const glint = R.fx.add(`<g>${sparkle(c, 12, C.star)}</g>`);
    const stream = R.fx.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [6, 20], [2, 46], 10), (u) => 5 - u * 2)}" fill="${C.wheat}" opacity=".9"/></g>`);
    const drops = Array.from({ length: 5 }, () => R.fx.add(`<g><path d="${c.cut([[0, -5], [3, 0], [0, 4], [-3, 0]], 0.1, 2)}" fill="${C.wheat}"/></g>`));
    // curls of fragrance rising from His feet
    const rise = Array.from({ length: 7 }, (_, i) => ({ i, dx: (i - 3) * 60 + c.rr(-20, 20), h: c.rr(260, 420), el: R.fx.add(`<g>${curl(c, 110, i % 2 ? '#f4dcef' : '#fbe6c4')}</g>`), sp: R.fx.add(`<g>${nardSprig(c, 30)}</g>`) }));
    const bloom = R.scentBack.add(`<g><circle r="170" fill="url(#halo-glow)"/><circle r="90" fill="url(#warm-glow)"/></g>`);
    /* labels */
    const tagL = S.layer({ par: 0.3, sh: 4 });
    const tagM = hanging(tagL, nameTag(c, tr('Marta', 'Martha'), { size: 17 }), { x: 1180, y: 440, len: 600 });
    const tagLz = hanging(tagL, nameTag(c, tr('Łazarz', 'Lazarus'), { size: 17 }), { x: 935, y: 440, len: 600 });
    const tagMa = hanging(tagL, nameTag(c, tr('Maria', 'Mary'), { size: 17 }), { x: 470, y: 420, len: 600 });
    const card = sheet().p(c.cut(c.rect(-86, -52, 172, 104), 0.5, 6), C.cream).p(c.cut(c.rect(-80, -46, 160, 92), 0.4, 6), C.parchment).out();
    const pound = hanging(tagL, `${card}<g transform="translate(-40 26) scale(.9)">${nardJar(c, 56)}</g><g transform="translate(-6 24)">${nardSprig(c, 40)}</g><g transform="translate(10 30) scale(.7)">${nardSprig(c, 40)}</g><text x="36" y="-12" text-anchor="middle" font-family="${FONT}" font-size="21" font-style="italic" fill="${C.ink}">${tr('funt', 'a pound')}</text><text x="36" y="14" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.plumRobe}">${tr('czystego', 'of pure')}</text><text x="36" y="34" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.plumRobe}">${tr('nardu', 'nard')}</text>`, { x: 560, y: 330, len: 600 });

    return (t, time) => {
      const T = time;
      const scent = es(t, 4.05, 4.7);
      R.update(t, T, { scent, lit: 1 });

      /* v2a — the supper is laid */
      dishes.forEach((d) => {
        const k = es(t, 0.15 + d.i * 0.07, 0.4 + d.i * 0.07, ease.back);
        vis(d.el, { x: d.x, y: TOP - 4 - (1 - k) * 240, o: k > 0.01 ? 1 : 0 });
      });
      /* v2b — Martha serves; Lazarus at the table with Him */
      const mIn = es(t, 1.0, 1.4);
      const mx = lerp(1420, 872, mIn);
      const serve = bump(t, 1.4, 1.95);
      mar.set({ x: mx, y: SEAT - 8, s: 0.96, flip: true, walk: mIn > 0 && mIn < 1 ? mx * 0.06 : undefined, armF: 70 + serve * 14, armB: 20 + serve * 20, lean: -serve * 6, head: 4 + scent * -8, blink: blinkAt(T, 3) });
      const toast = es(t, 1.45, 1.7) * (1 - es(t, 2.1, 2.3));
      guests.forEach((g) => {
        const lift = g.i === 0 ? toast : 0;
        const look = es(t, 2.2, 2.5) * (g.i === 0 ? 0 : 1);
        g.p.set({ x: g.x, y: SEAT, s: 0.92, flip: true, armF: 20 + lift * 60 + (g.i ? bump(t, 0.9, 1.6) * 20 : 0), armB: 10, head: -4 * look - scent * 10 + (g.i === 0 ? 3 : 0), blink: scent > 0.6 ? 0.9 : blinkAt(T, g.i + 1) });
      });
      jud.set({ x: SR.JUD, y: SEAT, s: 0.92, flip: true, armF: 14, head: -2 - scent * 4, blink: blinkAt(T, 7) });
      const tk = (a, b) => es(t, a, a + 0.3, ease.out) * (1 - es(t, b, b + 0.2, ease.in));
      const k1 = tk(1.3, 2.05), k2 = tk(1.5, 2.05), k3 = tk(2.3, 3.1);
      swing(tagM, 790, 380 - (1 - k1) * 600, k1 > 0.001 ? T : 0, 1.3, 0.8); fade(tagM, k1 > 0.001 ? 1 : 0);
      swing(tagLz, 935, 440 - (1 - k2) * 600, k2 > 0.001 ? T : 0, 1.3, 0.8, 2); fade(tagLz, k2 > 0.001 ? 1 : 0);
      swing(tagMa, 470, 440 - (1 - k3) * 600, k3 > 0.001 ? T : 0, 1.3, 0.8, 1); fade(tagMa, k3 > 0.001 ? 1 : 0);
      const pk = tk(2.35, 3.05);
      swing(pound, 700, 270 - (1 - pk) * 600, pk > 0.001 ? T : 0, 1, 0.7, 3); fade(pound, pk > 0.001 ? 1 : 0);

      /* Jesus */
      const bless = bump(t, 3.55, 4.1);
      jesus.set({ x: JX, y: FLOOR, s: 1.0, flip: true, armF: 20 + bless * 36 + toast * 20, armB: 12 + scent * 10, head: 4 + es(t, 2.5, 2.9) * 6 - scent * 6, blink: blinkAt(T) });
      pose(legs, { x: JX, y: FLOOR, sx: -1 });

      /* v3a — Mary comes in with the jar and kneels */
      const walk = es(t, 2.05, 2.6);
      const mxW = lerp(355, MX - 10, walk);
      const kneel = es(t, 2.62, 2.69);
      const hairDown = es(t, 3.5, 3.57);
      const armW = 62;
      maryW.set({ x: mxW, y: FLOOR, s: 1, o: es(t, 2.0, 2.06) * (1 - kneel), walk: walk > 0 && walk < 1 ? mxW * 0.06 : undefined, armF: armW, armB: 50, head: 2, blink: blinkAt(T, 4) });
      const pour = es(t, 3.05, 3.2) * (1 - es(t, 3.42, 3.52));
      const leanK = 18 + pour * 8;
      const armK = 58 + pour * 20;
      maryK.set({ x: MX, y: FLOOR, s: 1, o: kneel * (1 - hairDown), armF: armK, armB: 40 + pour * 30, lean: leanK, head: 6 + pour * 6, blink: blinkAt(T, 4) });
      const wipe = es(t, 3.58, 3.72) * (1 - es(t, 4.2, 4.5));
      const hlean = 20 + wipe * 22 + (T ? Math.sin(T * 3) * 2 * wipe : 0);
      const hhead = 8 + wipe * 16;
      maryH.set({ x: MX, y: FLOOR, s: 1, o: hairDown, armF: 60 + wipe * 16 + Math.sin(t * 20) * 6 * wipe, armB: 30 + wipe * 30, lean: hlean, head: hhead, blink: wipe > 0.3 || scent > 0.5 ? 1 : blinkAt(T, 4) });
      pose(hairEl, { r: -(hlean + hhead) * 0.85 });
      // the jar: in her hands, tipping over the feet, then set down beside her
      let jx, jy, jr = 0;
      if (kneel < 1) { const [hx, hy] = hand(mxW, FLOOR, 1, false, armW); jx = hx + 4; jy = hy + 8; }
      else { const [hx, hy] = hand(MX, FLOOR, 1, false, armK, leanK, 46); jx = hx; jy = hy + 6; jr = pour * 112; }
      const setDown = es(t, 3.48, 3.6);
      jx = lerp(jx, MX - 50, setDown); jy = lerp(jy, FLOOR + 4, setDown); jr = lerp(jr, 0, setDown);
      vis(jar, { x: jx, y: jy, r: jr, o: es(t, 2.0, 2.06) });
      vis(glint, { x: jx + 6, y: jy - 60, s: bump(t, 2.3, 2.9) * 1.2 + 0.01, r: t * 90, o: bump(t, 2.3, 2.9) });
      const fk = seg(t, 3.12, 3.45);
      const lip = [jx + Math.cos((jr - 90) * PI / 180 + 0.2) * 58, jy + Math.sin((jr - 90) * PI / 180 + 0.2) * 58];
      vis(stream, { x: lip[0], y: lip[1], sy: 0.6 + fk * 0.5, o: pour > 0.5 ? 1 : 0 });
      drops.forEach((d, i) => { const k = ((t * 3 + i / 5) % 1); vis(d, { x: JX - 134 + (i - 2) * 6, y: FLOOR - 26 + k * 24, o: pour > 0.5 ? 1 - k : 0 }); });
      fade(sheen, es(t, 3.2, 3.4) * 0.9);

      /* v3c — the house is filled with the fragrance */
      const bk = es(t, 3.95, 4.5);
      vis(bloom, { x: JX - 130, y: FLOOR - 60, s: 0.4 + bk * 2.4, o: bk * 0.8 });
      rise.forEach((r) => {
        const k = seg(t, 4.0 + r.i * 0.06, 4.9 + r.i * 0.04);
        const x = JX - 130 + r.dx * k * 2.2 + (T ? Math.sin(T * 0.8 + r.i) * 10 : 0), y = FLOOR - 30 - k * r.h;
        vis(r.el, { x, y, s: 0.5 + k * 0.9, r: (r.i - 3) * 6 * k, o: k > 0 ? (k < 0.8 ? 1 : (1 - k) / 0.2) : 0 });
        vis(r.sp, { x: x + 20, y: y - 40, s: 0.6 + k * 0.6, r: (r.i - 3) * 20 * k + t * 20, o: k > 0.05 ? Math.min(1, (1 - k) * 3) : 0 });
      });

      S.cam.x = kf(t, [[0, 60], [0.9, 60], [1.6, 110], [2.1, 40], [2.7, -30], [3.2, -50], [4.0, -40], [4.6, 30]]);
      S.cam.y = kf(t, [[0, 0], [1.6, 10], [2.7, 20], [3.3, 60], [4.0, 50], [4.6, -30]]);
      S.cam.z = kf(t, [[0, 1.0], [0.9, 1.02], [1.6, 1.1], [2.5, 1.06], [3.3, 1.2], [4.0, 1.18], [4.6, 1.0]]);
    };
  },
};
