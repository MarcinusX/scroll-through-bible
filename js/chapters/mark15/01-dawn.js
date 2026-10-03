// Mk 15,1a–b — dawn in the council chamber. Through the arched window the morning star fades and a cock
// crows on the sill; the chief priests, elders and scribes sit in their half-circle and raise their hands:
// the decision is sealed. Then the guards bind Jesus' wrists and lead Him away.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, town, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, priest, elder, scribe, guard, bonds, ropeLine, sealedScroll, voiceRings, SKIES, PI } from './lib.js';

const JX = 800, JY = 692;
const WX0 = 640, WX1 = 960, WY0 = 150, WY1 = 440;   // the arched window

/** a cock on the window sill (head in .ck-head, pivot at the neck); origin: feet */
function rooster(c) {
  const s = sheet();
  s.p(c.cut([[-26, -44], [-40, -70], [-30, -64], [-38, -86], [-24, -70], [-22, -88], [-12, -60]], 0.6, 4), C.teal); // tail
  s.p(c.cut([[-24, -40], [-12, -58], [6, -58], [18, -46], [16, -30], [4, -20], [-14, -22]], 0.5, 4), C.clay);
  s.p(c.cut([[-16, -40], [0, -48], [10, -40], [0, -32]], 0.4, 3), shade(C.clay, -0.18)); // wing
  s.x(c.ribbon([[-2, -20], [-4, 0]], 2) + c.ribbon([[6, -20], [8, 0]], 2), C.ochre);
  const h = sheet();
  h.p(c.cut([[-6, 4], [-4, -12], [4, -16], [10, -10], [8, 4]], 0.4, 3), C.clay);
  h.p(c.cut([[-4, -14], [-2, -21], [2, -17], [5, -22], [7, -15]], 0.3, 2), C.terracotta);
  h.x(c.poly([[9, -10], [16, -8], [9, -6]]), C.ochre);
  h.p(c.cut([[4, -4], [9, -4], [8, 4], [4, 2]], 0.2, 2), C.terracotta);
  h.x(c.poly(c.circ(5, -10, 1.3, 6)), C.ink);
  return `${s.out()}<g class="ck-head" transform="translate(12 -54)">${h.out()}</g>`;
}

export default {
  id: 'm15-dawn',
  beats: [
    { cover: true },
    { v: 1, text: 'Zaraz wczesnym rankiem arcykapłani wraz ze starszymi i uczonymi w Piśmie i cała Wysoka Rada powzięli uchwałę.' },
    { v: 1, cont: true, text: 'Kazali Jezusa związanego odprowadzić' },
  ],
  cam: { x: [0, 400], y: [-30, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const DAWN = SKIES.dawn;
    const sk = sky(S, ['#56557e', '#b98f98', '#e9b79c']);
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
    W.p(c.cut([[WX0 - 26, WY1], [WX1 + 26, WY1], [WX1 + 32, WY1 + 18], [WX0 - 32, WY1 + 18]], 0.4, 6), C.stone2); // sill
    W.p(c.cut([...c.arc((WX0 + WX1) / 2, WY0 + 160, (WX1 - WX0) / 2 + 22, 182, PI, 2 * PI, 18), ...c.arc((WX0 + WX1) / 2, WY0 + 160, (WX1 - WX0) / 2, 160, 2 * PI, PI, 18)], 0.4, 6), C.stone2);
    wallL.add(W.out());
    // oil lamps in niches, burnt low through the night
    const niches = [[380, 330], [1220, 330]].map(([x, y]) => {
      wallL.add(sheet().p(c.cut([[x - 34, y + 30], [x - 34, y - 20], ...c.arc(x, y - 20, 34, 34, PI, 2 * PI, 10), [x + 34, y + 30]], 0.4, 5), shade(C.stone2, -0.25)).out());
      const el = wallL.add(`<g transform="translate(${x} ${y + 30})"><circle class="glow" cx="4" cy="-22" r="90" fill="url(#warm-glow)"/><path d="${c.cut([[-18, 0], [-20, -6], [-12, -11], [8, -11], [16, -8], [22, -11], [24, -8], [16, -1], [-12, 1]], 0.3, 4)}" fill="${C.pot}"/><g class="flame" transform="translate(22 -10)"><path d="M0 0C-5 -4 -4 -11 0 -20C4 -11 5 -4 0 0Z" fill="${C.lampFlame}"/></g></g>`);
      return { glow: el.querySelector('.glow'), flame: el.querySelector('.flame') };
    });
    const ck = wallL.add(`<g>${rooster(c)}</g>`);
    const ckHead = ck.querySelector('.ck-head');
    const crow = voiceRings(wallL, c, { n: 3, color: C.cream, r: 16, w: 3, both: false });

    // morning light pouring through the window
    const shaftL = S.layer({ par: 0.3, sh: 1, flat: true });
    shaftL.add(`<path d="${c.poly([[WX0 + 10, WY1], [WX1 - 10, WY1], [WX1 + 260, 1000], [WX0 - 260, 1000]])}" fill="#ffe7b8" opacity=".22"/>`);

    const floorL = S.layer({ par: 0.3, sh: 2 });
    const F = sheet();
    F.p(c.cut([[-900, 540], [2500, 540], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.stone2, C.sand, 0.35));
    let fl = '';
    [580, 640, 720, 820].forEach((y) => { fl += c.ribbon([[-900, y], [2500, y]], 1.2); });
    F.x(fl, shade(C.stone2, -0.15), 'opacity=".4"');
    floorL.add(F.out());
    // a door on the right, where they lead Him out
    floorL.add(sheet().p(c.cut([[1330, 540], [1330, 330], ...c.arc(1390, 330, 60, 60, PI, 2 * PI, 10), [1450, 540]], 0.5, 6), C.soilDark).p(c.cut([[1316, 540], [1316, 320], [1330, 320], [1330, 540]], 0.3, 5) + c.cut([[1450, 540], [1450, 320], [1464, 320], [1464, 540]], 0.3, 5), C.stone2).out());

    /* ---------- the council in its half-circle ---------- */
    const benchB = S.layer({ par: 0.34, sh: 4 });
    benchB.add(sheet().p(c.cut([[300, 524], [300, 488], [1300, 488], [1300, 524]], 0.5, 10), C.stone2).p(c.cut([[300, 492], [1300, 492], [1300, 500], [300, 500]], 0.3, 10), shade(C.stone2, -0.1)).out());
    const mk = (i, pose) => (i % 3 === 0 ? priest(c, i / 3, { pose }) : i % 3 === 1 ? elder(c, i, { pose }) : scribe(c, i, { pose }));
    const council = [];
    const backXs = [380, 470, 560, 650, 950, 1040, 1130, 1220];
    backXs.forEach((x, i) => council.push({ p: S.puppet(benchB.add(mk(i + 1, 'sit'))), x, y: 494, s: 0.6, flip: x > 800, i, seed: c.rr(0, 9) }));
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

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const day = es(t, 0.4, 2.6);
      sk.blend(['#56557e', '#b98f98', '#e9b79c'], DAWN, day);
      starL.fade(1 - es(t, 0.6, 1.8) * 0.9);
      pose(mstar, { x: 860, y: 230, s: 1 + Math.sin(T * 2) * 0.08, o: 1 - es(t, 1.2, 2.2) });
      shaftL.fade(0.35 + day * 0.65);
      niches.forEach((n, i) => {
        const k = 1 - day * 0.55;
        pose(n.flame, { x: 22, y: -10, sy: k * (1 + Math.sin(T * 8 + i) * 0.08), sx: k });
        fade(n.glow, k * 0.8);
      });
      // the cock crows at first light
      const crowK = bump(t, 0.75, 1.35);
      pose(ck, { x: 900, y: WY1 + 2, s: 1 });
      pose(ckHead, { x: 12, y: -54, r: -crowK * 28 });
      crow(900 + 34, WY1 - 70, crowK, T, { speed: 0.8, spread: 1.6, dir: 1 });

      // v1a — the whole council raises its hands: resolved
      council.forEach((m) => {
        const up = es(t, 1.2 + (m.i % 7) * 0.05, 1.45 + (m.i % 7) * 0.05) * (1 - es(t, 2.05, 2.3));
        const turn = es(t, 1.05, 1.25);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armB: 20 + up * 80, armF: 20 + up * 88 + turn * 10, head: -4 + up * -6 + bump(t, 2.3, 3) * 6, blink: blinkAt(T, m.seed) });
      });
      const speak = bump(t, 1.0, 1.6);
      const hpK = [[1.0, [620, 672]], [1.3, [640, 668]], [2.2, [640, 668]], [2.6, [S.portrait ? 560 : 600, 672]]];   // phone: he steps out of the frame rather than being sliced by it as the camera follows the guards
      const [hx, hy] = kf(t, hpK);
      hp.set({ x: hx, y: hy, s: 0.98, flip: false, walk: moving(t, hpK) ? hx * 0.06 : undefined, armF: 30 + speak * 50 + es(t, 1.45, 1.7) * 30 * (1 - es(t, 2.1, 2.4)), armB: 10 + es(t, 1.35, 1.6) * 90 * (1 - es(t, 2.05, 2.3)), head: -4, blink: blinkAt(T, 2) });
      // the decree is sealed above them
      const dk = es(t, 1.5, 1.85, ease.back);
      const stamp = bump(t, 1.85, 2.05);
      pose(decree, { x: 800, y: lerp(560, 300, es(t, 1.5, 1.9)), s: dk * (1 + stamp * 0.15), r: -4 + stamp * 3, o: dk > 0.02 ? 1 - es(t, 2.2, 2.45) : 0 });

      // v1b — bound and led away
      const bind = es(t, 2.1, 2.18);
      const gK1 = [[2.0, [950, JY + 4]], [2.15, [880, JY + 4]], [2.35, [880, JY + 4]], [2.95, [1150, JY + 4]]];
      const gK2 = [[2.0, [1040, JY - 2]], [2.35, [1040, JY - 2]], [2.95, [1260, JY - 2]]];
      const jK = [[2.35, [JX, JY]], [2.95, [1000, JY]]];
      const [g1x, g1y] = kf(t, gK1), [g2x, g2y] = kf(t, gK2), [jx, jy] = kf(t, jK);
      const lead = es(t, 2.3, 2.4);
      g1.set({ x: g1x, y: g1y, s: 1, flip: t < 2.3, walk: moving(t, gK1) ? g1x * 0.06 : undefined, armF: 20 + bump(t, 2.1, 2.3) * 50 + lead * 60, armB: 10, head: 0, blink: blinkAt(T, 4) });
      g2.set({ x: g2x, y: g2y, s: 1, flip: t < 2.3, walk: moving(t, gK2) ? g2x * 0.06 : undefined, armF: 14, armB: 10, blink: blinkAt(T, 5) });
      const jw = moving(t, jK) ? jx * 0.05 : undefined;
      jFree.set({ x: jx, y: jy, s: 1.02, flip: false, o: 1 - bind, armF: 12 + Math.sin(T * 0.8) * 2, armB: 6, head: -4 + bump(t, 1.2, 2) * 6, blink: blinkAt(T) });
      jBound.set({ x: jx, y: jy, s: 1.02, flip: false, o: bind, walk: jw, amt: 0.6, armF: 30, armB: 28, head: 4, blink: blinkAt(T) });
      // the rope from His wrists to the guard's hand
      const [ax, ay] = hand(jx, jy, 1.02, false, 30);
      const [bx, by] = hand(g1x, g1y, 1, t < 2.3, 20 + bump(t, 2.1, 2.3) * 50 + lead * 60);
      const d = Math.hypot(bx - ax, by - ay);
      pose(rope, { x: ax, y: ay, r: (Math.atan2(by - ay, bx - ax) * 180) / PI, sx: d / 100, o: bind * (d > 12 ? 1 : 0) });

      S.cam.x = es(t, 2.3, 2.95) * (S.portrait ? 380 : 160);   // phone: follow far enough to keep the guard who leads Him off the thread
      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.04 + es(t, 2.2, 2.9) * 0.06;
      S.cam.y = es(t, 0.6, 1.4) * 20 + es(t, 2.2, 2.9) * 30;
    };
  },
};
