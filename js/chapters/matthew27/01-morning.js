// Mt 27,1–2 — the curtains open on the council chamber at first light (Mark 15's chamber of hewn stone).
// The night lamps burn low; through the arched window the morning star fades. The chief priests and the elders
// of the people sit in their half-circle; they raise their hands together — resolved — and a sealed decree rises
// above them. Then the guards bind Jesus' wrists and lead Him out through the door, and a round portrait comes
// down on the fly-lines: the governor, Pontius Pilate.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, sheet, shade, mix } from '../kit.js';
import { band, town, stars } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, priest, elder, guard, bonds, ropeLine, sealedScroll, medallion, strip, hanging, swing, LOOK, SKIES, tr, PI } from './lib.js';

const JX = 800, JY = 692;
const WX0 = 640, WX1 = 960, WY0 = 150, WY1 = 440;   // the arched window

export default {
  id: 'mt27-morning',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [0, 170], y: [-30, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PRE = ['#56557e', '#b98f98', '#e9b79c'];
    const sk = sky(S, PRE);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    const mstar = starL.add(`<g><circle r="26" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 9, 2.6, 4, 0))}" fill="${C.star}"/></g>`);
    starL.add(stars(c, { x0: 600, x1: 1000, y0: 140, y1: 320, n: 14 }));
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: 400, amps: [12, 6, 2], lens: [700, 260, 100], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    far.add(town(c, { x: 800, y: 412, n: 8, spread: 300, sc: 0.5, wall: mix(C.plaster, C.duskViolet, 0.25), shadow: mix(C.plaster2, C.duskViolet, 0.35) }));

    /* ---------- the chamber of hewn stone ---------- */
    const wallL = S.layer({ par: 0.25, sh: 4 });
    const W = sheet();
    const arch = [[WX0, WY1], [WX0, WY0 + 160], ...c.arc((WX0 + WX1) / 2, WY0 + 160, (WX1 - WX0) / 2, 160, PI, 2 * PI, 18), [WX1, WY1]];
    W.p(c.cut([[-900, -1400], [2500, -1400], [2500, 540], [-900, 540]], 0.6, 20) + c.hole(arch, 0.5, 8), mix(C.stone, C.plaster2, 0.45));
    let blocks = '';
    for (let y = 60; y < 540; y += 42) for (let x = -900 + ((y / 42) % 2) * 60; x < 2500; x += 120) if (x + 110 < WX0 - 20 || x > WX1 + 20 || y > WY1 + 10) blocks += c.cut(c.rect(x + 3, y + 3, 112, 36), 0.4, 8);
    W.x(blocks, shade(C.stone, 0.12), 'opacity=".55"');
    W.p(c.cut([[WX0 - 26, WY1], [WX1 + 26, WY1], [WX1 + 32, WY1 + 18], [WX0 - 32, WY1 + 18]], 0.4, 6), C.stone2);
    W.p(c.cut([...c.arc((WX0 + WX1) / 2, WY0 + 160, (WX1 - WX0) / 2 + 22, 182, PI, 2 * PI, 18), ...c.arc((WX0 + WX1) / 2, WY0 + 160, (WX1 - WX0) / 2, 160, 2 * PI, PI, 18)], 0.4, 6), C.stone2);
    wallL.add(W.out());
    const niches = [[380, 330], [1220, 330]].map(([x, y]) => {
      wallL.add(sheet().p(c.cut([[x - 34, y + 30], [x - 34, y - 20], ...c.arc(x, y - 20, 34, 34, PI, 2 * PI, 10), [x + 34, y + 30]], 0.4, 5), shade(C.stone2, -0.25)).out());
      const el = wallL.add(`<g transform="translate(${x} ${y + 30})"><circle class="glow" cx="4" cy="-22" r="90" fill="url(#warm-glow)"/><path d="${c.cut([[-18, 0], [-20, -6], [-12, -11], [8, -11], [16, -8], [22, -11], [24, -8], [16, -1], [-12, 1]], 0.3, 4)}" fill="${C.pot}"/><g class="flame" transform="translate(22 -10)"><path d="M0 0C-5 -4 -4 -11 0 -20C4 -11 5 -4 0 0Z" fill="${C.lampFlame}"/></g></g>`);
      return { glow: el.querySelector('.glow'), flame: el.querySelector('.flame') };
    });
    const shaftL = S.layer({ par: 0.3, sh: 1, flat: true });
    shaftL.add(`<path d="${c.poly([[WX0 + 10, WY1], [WX1 - 10, WY1], [WX1 + 260, 1000], [WX0 - 260, 1000]])}" fill="#ffe7b8" opacity=".22"/>`);
    const floorL = S.layer({ par: 0.3, sh: 2 });
    const F = sheet();
    F.p(c.cut([[-900, 540], [2500, 540], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.stone2, C.sand, 0.35));
    let fl = '';
    [580, 640, 720, 820].forEach((y) => { fl += c.ribbon([[-900, y], [2500, y]], 1.2); });
    F.x(fl, shade(C.stone2, -0.15), 'opacity=".4"');
    floorL.add(F.out());
    floorL.add(sheet().p(c.cut([[1330, 540], [1330, 330], ...c.arc(1390, 330, 60, 60, PI, 2 * PI, 10), [1450, 540]], 0.5, 6), C.soilDark).p(c.cut([[1316, 540], [1316, 320], [1330, 320], [1330, 540]], 0.3, 5) + c.cut([[1450, 540], [1450, 320], [1464, 320], [1464, 540]], 0.3, 5), C.stone2).out());

    /* ---------- the chief priests and the elders of the people ---------- */
    const benchB = S.layer({ par: 0.34, sh: 4 });
    benchB.add(sheet().p(c.cut([[300, 524], [300, 488], [1300, 488], [1300, 524]], 0.5, 10), C.stone2).p(c.cut([[300, 492], [1300, 492], [1300, 500], [300, 500]], 0.3, 10), shade(C.stone2, -0.1)).out());
    const mk = (i, P) => (i % 2 === 0 ? priest(c, i / 2, { pose: P }) : elder(c, i, { pose: P }));
    const council = [];
    [380, 470, 560, 650, 950, 1040, 1130, 1220].forEach((x, i) => council.push({ p: S.puppet(benchB.add(mk(i + 1, 'sit'))), x, y: 494, s: 0.6, flip: x > 800, i, seed: c.rr(0, 9) }));
    const benchF = S.layer({ par: 0.42, sh: 5 });
    benchF.add(sheet().p(c.cut([[180, 600], [180, 562], [580, 574], [580, 610]], 0.5, 10) + c.cut([[1020, 574], [1420, 562], [1420, 600], [1020, 610]], 0.5, 10), shade(C.stone2, 0.05)).out());
    [[290, 566], [400, 569], [510, 572], [1090, 572], [1200, 569], [1310, 566]].forEach(([x, y], i) => council.push({ p: S.puppet(benchF.add(mk(i + 10, 'sit'))), x, y, s: 0.72, flip: x > 800, i: i + 8, seed: c.rr(0, 9) }));

    /* ---------- Jesus, the high priest, the guards ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    const hp = S.puppet(P.add(priest(c, 0)));
    const g1 = S.puppet(P.add(guard(c, 0)));
    const g2 = S.puppet(P.add(guard(c, 1)));
    const jFree = S.puppet(P.add(person(c, CAST.jesus)));
    const jBound = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c) })));
    const fx = S.layer({ par: 0.58, sh: 4 });
    const rope = fx.add(`<g>${ropeLine(c)}</g>`);
    const decree = fx.add(`<g><circle r="70" fill="url(#halo-glow)" opacity=".5"/>${sealedScroll(c, 80)}</g>`);
    // the governor, on the fly-lines
    const govL = S.layer({ par: 0.2, sh: 5 });
    const gov = hanging(govL, `${medallion(c, LOOK.pilate, { r: 54, rim: C.sun })}<g transform="translate(0 84)">${strip(c, tr('namiestnik', 'the governor'), { size: 15, fill: C.stone })}</g><g transform="translate(0 116)">${strip(c, tr('Poncjusz Piłat', 'Pontius Pilate'), { size: 19 })}</g>`, { x: 0, y: -1500, len: 900 });

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const day = es(t, 0.4, 2.6);
      sk.blend(PRE, SKIES.dawn, day);
      starL.fade(1 - es(t, 0.6, 1.8) * 0.9);
      pose(mstar, { x: 860, y: 230, s: 1 + Math.sin(T * 2) * 0.08, o: 1 - es(t, 1.2, 2.2) });
      shaftL.fade(0.35 + day * 0.65);
      niches.forEach((n, i) => {
        const k = 1 - day * 0.55;
        pose(n.flame, { x: 22, y: -10, sy: k * (1 + Math.sin(T * 8 + i) * 0.08), sx: k });
        fade(n.glow, k * 0.8);
      });

      /* v1 — they take counsel: the whole council raises its hands, the decree is sealed */
      council.forEach((m) => {
        const up = es(t, 1.2 + (m.i % 7) * 0.05, 1.45 + (m.i % 7) * 0.05) * (1 - es(t, 2.05, 2.3));
        const turn = es(t, 1.05, 1.25);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armB: 20 + up * 80, armF: 20 + up * 88 + turn * 10, head: -4 + up * -6 + bump(t, 2.3, 3) * 6, blink: blinkAt(T, m.seed) });
      });
      const speak = bump(t, 1.0, 1.6);
      const hpK = [[1.0, [620, 672]], [1.3, [640, 668]], [2.2, [640, 668]], [2.6, [600, 672]]];
      const [hx, hy] = kf(t, hpK);
      hp.set({ x: hx, y: hy, s: 0.98, flip: false, walk: moving(t, hpK) ? hx * 0.06 : undefined, armF: 30 + speak * 50 + es(t, 1.45, 1.7) * 30 * (1 - es(t, 2.1, 2.4)), armB: 10 + es(t, 1.35, 1.6) * 90 * (1 - es(t, 2.05, 2.3)), head: -4, blink: blinkAt(T, 2) });
      const dk = es(t, 1.5, 1.85, ease.back);
      const stamp = bump(t, 1.85, 2.05);
      pose(decree, { x: 800, y: lerp(560, 300, es(t, 1.5, 1.9)), s: dk * (1 + stamp * 0.15), r: -4 + stamp * 3, o: dk > 0.02 ? 1 - es(t, 2.2, 2.45) : 0 });

      /* v2 — bound, led away, handed over to the governor */
      const bind = es(t, 2.1, 2.18);
      const gK1 = [[2.0, [950, JY + 4]], [2.15, [880, JY + 4]], [2.35, [880, JY + 4]], [2.95, [1150, JY + 4]]];
      const gK2 = [[2.0, [1040, JY - 2]], [2.35, [1040, JY - 2]], [2.95, [1260, JY - 2]]];
      const jK = [[2.35, [JX, JY]], [2.95, [1000, JY]]];
      const [g1x, g1y] = kf(t, gK1), [g2x, g2y] = kf(t, gK2), [jx, jy] = kf(t, jK);
      const lead = es(t, 2.3, 2.4);
      g1.set({ x: g1x, y: g1y, s: 1, flip: t < 2.3, walk: moving(t, gK1) ? g1x * 0.06 : undefined, armF: 20 + bump(t, 2.1, 2.3) * 50 + lead * 60, armB: 10, blink: blinkAt(T, 4) });
      g2.set({ x: g2x, y: g2y, s: 1, flip: t < 2.3, walk: moving(t, gK2) ? g2x * 0.06 : undefined, armF: 14, armB: 10, blink: blinkAt(T, 5) });
      jFree.set({ x: jx, y: jy, s: 1.02, flip: false, o: 1 - bind, armF: 12, armB: 6, head: -4 + bump(t, 1.2, 2) * 6, blink: blinkAt(T) });
      jBound.set({ x: jx, y: jy, s: 1.02, flip: false, o: bind, walk: moving(t, jK) ? jx * 0.05 : undefined, amt: 0.6, armF: 30, armB: 28, head: 4, blink: blinkAt(T) });
      const [ax, ay] = hand(jx, jy, 1.02, false, 30);
      const [bx, by] = hand(g1x, g1y, 1, t < 2.3, 20 + bump(t, 2.1, 2.3) * 50 + lead * 60);
      const d = Math.hypot(bx - ax, by - ay);
      pose(rope, { x: ax, y: ay, r: (Math.atan2(by - ay, bx - ax) * 180) / PI, sx: d / 100, o: bind * (d > 12 ? 1 : 0) });
      const gk = es(t, 2.45, 2.9, ease.out);
      swing(gov, S.portrait ? 1010 : 1170, S.portrait ? 180 : 250 - (1 - gk) * 800, T, 1.1, 0.8, 1);

      S.cam.x = es(t, 2.3, 2.95) * 160;
      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.04 + es(t, 2.2, 2.9) * 0.06;
      S.cam.y = es(t, 0.6, 1.4) * 20 + es(t, 2.2, 2.9) * 30;
    };
  },
};
