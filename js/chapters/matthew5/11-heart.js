// Mt 5,27–30 — told as symbolic paper theatre. "You shall not commit adultery": the old tablet comes down over a
// village well (the scene in old sepia). "But I tell you": a man at the roadside fixes his gaze on a woman drawing
// water — a dotted line of looking runs from his eye to her, and the paper heart in front of his chest goes dark.
// "If your right eye causes you to sin": a card with an eye, tied to a dark stone, comes down; paper scissors snip
// it away and it falls. Better to lose one member than the whole body in Gehenna: the man walks whole up the path
// through the lit gate of life, while far off the fire burns in its valley. The same again for the hand: the card
// is snipped away, and a second traveller goes up into the light.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cypress, olive, rock, grass, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, oldTablet, goldAnswer, heart, paperEye, paperHand, stumbleCard, lifeGate, firePit, scissors, snip, tagWord, man, tr, PI } from './lib.js';

const GATE = [800, 440];
const PATHG = [[620, 700], [700, 650], [640, 600], [720, 540], [770, 484], [800, 446]];
const WELL0 = [1010, 670];
const CARD = [990, 170];

function along(pts, u) {
  const L = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let x = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < L.length; i++) {
    if (x <= L[i] || i === L.length - 1) { const k = L[i] ? Math.min(1, x / L[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), pts[i + 1][0] < pts[i][0] ? -1 : 1]; }
    x -= L[i];
  }
  return [...pts[pts.length - 1], 1];
}

export default {
  id: 'mt5-heart',
  enter: 'fly',
  beats: [
    { v: 27 },
    { v: 28 },
    { v: 29, text: 'Jeśli więc prawe twoje oko jest ci powodem do grzechu, wyłup je i odrzuć od siebie.' },
    { v: 29, cont: true, text: 'Lepiej bowiem jest dla ciebie, gdy zginie jeden z twoich członków, niż żeby całe twoje ciało miało być wrzucone do piekła.' },
    { v: 30, text: 'I jeśli prawa twoja ręka jest ci powodem do grzechu, odetnij ją i odrzuć od siebie.' },
    { v: 30, cont: true, text: 'Lepiej bowiem jest dla ciebie, gdy zginie jeden z twoich członków, niż żeby całe twoje ciało miało iść do piekła.' },
  ],
  cam: { x: [-30, 40], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the well (and the woman beside it) and the valley of fire move in from the right edge
    const WELL = PH ? [925, 670] : WELL0;
    const FX = PH ? 1045 : 1150, FY = PH ? 506 : 540, FS = PH ? 0.75 : 1;
    sky(S, ['#c7d9d8', '#ebe3cd', '#f4e1c4']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl = hanging(hangL, cloud(c, 170), { x: 1180, y: 150, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.lavender, 0.25), x0: -1400, x1: 3000 }).markup);

    /* the valley of fire far off on the right */
    const fireL = S.layer({ par: 0.14, sh: 3 });
    const F = firePit(c, 200);
    fireL.add(PH ? `<g transform="translate(${FX} ${FY}) scale(${FS})">${F.pit}</g>` : `<g transform="translate(1150 540)">${F.pit}</g>`);
    const flames = F.flames.map((f, i) => ({ ...f, i, el: fireL.add(`<g>${f.m}</g>`) }));
    const fTag = fireL.add(`<g>${tagWord(c, tr('Gehenna', 'Gehenna'), { size: 16 })}</g>`);

    /* the hill of life with its lit gate, the path, the well */
    const land = S.layer({ par: 0.3, sh: 3 });
    const g = sheet();
    g.p(c.cut([[-1400, 600], [480, 580], [600, 520], [700, 462], [800, 440], [900, 462], [1000, 520], [1080, 574], [3000, 600], [3000, 1800], [-1400, 1800]], 1.2, 10), mix(C.hillNear, C.sage2, 0.4));
    g.p(c.ribbon(PATHG.map(([x, y]) => [x, y + 4]), (u) => 22 - u * 12, 2), mix(C.sand, C.hillNear, 0.3));
    g.p(c.cut([[-1400, 700], [3000, 694], [3000, 1800], [-1400, 1800]], 1, 20), mix(C.sand, C.sage2, 0.45));
    land.add(g.out());
    land.add(cypress(c, 690, 470, 90, C.moss2) + cypress(c, 910, 474, 80, C.moss2) + olive(c, 330, 700, 0.9) + olive(c, 1360, 700, 0.8) + rock(c, 1180, 700, 50, 16));
    const G = lifeGate(c, { w: 104, h: 150 });
    const gateGlow = land.add(`<g>${G.light}</g>`);
    land.add(`<g transform="translate(${GATE[0]} ${GATE[1]})">${G.arch}</g>`);
    const lTag = land.add(`<g>${tagWord(c, tr('życie', 'life'), { size: 18 })}</g>`);
    // the well
    const wl = sheet();
    wl.p(c.cut(c.rect(WELL[0] - 50, WELL[1] - 50, 100, 52), 0.6, 6), mix(C.stone, C.rock, 0.3));
    wl.p(c.cut(c.ell(WELL[0], WELL[1] - 50, 52, 9, 16), 0.4, 5), C.stone2);
    wl.p(c.ribbon([[WELL[0] - 44, WELL[1] - 50], [WELL[0] - 44, WELL[1] - 130]], 6) + c.ribbon([[WELL[0] + 44, WELL[1] - 50], [WELL[0] + 44, WELL[1] - 130]], 6) + c.ribbon([[WELL[0] - 52, WELL[1] - 128], [WELL[0] + 52, WELL[1] - 128]], 7), C.wood2);
    land.add(wl.out());

    /* people */
    const P = S.layer({ par: 0.34, sh: 5 });
    const woman = S.puppet(P.add(person(c, { ...LOOK.girl, robe: C.skyVeil, veil: C.blushVeil })));
    const jar = P.add(`<g>${sheet().p(c.cut([[-12, -40], [12, -40], [11, -34], [20, -24], [22, -10], [14, 0], [-14, 0], [-22, -10], [-20, -24], [-11, -34]], 0.4, 5), C.pot).out()}</g>`);
    const M = S.puppet(P.add(person(c, man(c, { robe: C.sageRobe, mantle: C.wood3 }))));
    const T2 = S.puppet(P.add(person(c, man(c, { robe: C.dustyBlue, mantle: null }))));
    const hRed = P.add(`<g>${heart(c, 13)}</g>`);
    const hDark = P.add(`<g>${heart(c, 13, mix(C.storm2, C.ink, 0.3))}</g>`);
    const gaze = P.add(`<g>${(() => { let d = ''; for (let i = 0; i < 14; i++) { const x0 = (i / 14) * 1000 + 15; d += c.poly([[x0, -1.8], [x0 + 40, -1.8], [x0 + 40, 1.8], [x0, 1.8]]); } return `<path d="${d}" fill="${C.terracotta}"/>`; })()}</g>`);

    /* the cards and the scissors, from the flies */
    const flyL = S.layer({ par: 0.2, sh: 6 });
    const cards = [`<g transform="scale(1.4)">${paperEye(c, 34)}</g>`, `<g transform="translate(0 20)">${paperHand(c, C.skin2, 1.3)}</g>`].map((icon, i) => ({ i, t0: 2 + i * 2, el: flyL.add(`<g><path d="M0 -2400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><g class="obj">${stumbleCard(c, icon)}</g></g>`) }));
    cards.forEach((cd) => { cd.obj = cd.el.querySelector('.obj'); });
    const sc = flyL.add(`<g>${scissors(c, 70)}</g>`);

    /* the old wash, the tablet, the answer */
    const wash = S.layer({ par: 0, sh: 1, flat: true });
    wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#c9ae86"/>`);
    const top = S.layer({ par: 0.3, sh: 6 });
    const tab = top.add(`<g>${oldTablet(c, tr(['Nie cudzołóż!'], ['You shall not', 'commit adultery']), { w: 300, size: 26 })}</g>`);
    const ans = top.add(`<g>${goldAnswer(c, tr('A Ja wam powiadam', 'But I tell you'), { size: 24 })}</g>`);

    return (t, time) => {
      const T = time;
      pose(cl, { x: 1180 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6) });

      /* v27 — the old saying */
      wash.fade(0.34 * (1 - es(t, 0.9, 1.2)));
      const tk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 1.0, 1.2));
      pose(tab, { x: 800, y: lerp(-500, 150, tk) - es(t, 1.0, 1.2) * 300, r: Math.sin(T * 0.8) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const ak = es(t, 1.06, 1.3, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(ans, { x: 800, y: lerp(-300, 180, ak) - es(t, 1.9, 2.1) * 300, r: Math.sin(T * 0.9) * 1.2, o: ak > 0.01 ? 1 : 0 });

      /* the woman at the well (she goes home after v28) */
      const home = es(t, 1.95, 2.4, (x) => x);
      const wx = lerp(WELL[0] + 80, 1400, home);
      woman.set({ x: wx, y: 700, s: 0.94, flip: home <= 0, walk: home > 0 && home < 1 ? wx * 0.05 : undefined, armF: 60 + (home > 0 ? 40 : 0), armB: home > 0 ? 150 : 20, head: 4, o: 1 - es(t, 2.3, 2.45), blink: blinkAt(T, 3) });
      pose(jar, home > 0 ? { x: wx + 10, y: 700 - 184, s: 0.9, o: 1 - es(t, 2.3, 2.45) } : { x: WELL[0] + 34, y: WELL[1] - 50, s: 0.9, o: 1 });

      /* v28 — the look, and the heart goes dark */
      const look = es(t, 1.2, 1.42) * (1 - es(t, 1.95, 2.1));
      const dark = es(t, 1.42, 1.62);
      const w1 = es(t, 3.05, 3.8, (x) => x);
      let mx = 600, my = 700, mdir = 1, mS = 1;
      if (w1 > 0) { [mx, my, mdir] = along(PATHG, w1); mS = lerp(1, 0.5, w1); }
      const inGate = es(t, 3.72, 3.88);
      M.set({ x: mx, y: my, s: mS, flip: mdir < 0, walk: w1 > 0 && w1 < 1 ? w1 * 40 : undefined, armF: 20 + bump(t, 2.3, 2.9) * 40, head: look * -2 + bump(t, 2.3, 2.9) * 10, o: 1 - inGate, blink: blinkAt(T, 1) });
      const hx = mx + 16 * mS, hy = my - 108 * mS;
      pose(hRed, { x: hx, y: hy, s: mS, o: es(t, 1.1, 1.2) * (1 - dark) * (1 - es(t, 2.1, 2.3)) });
      pose(hDark, { x: hx, y: hy, s: mS, o: dark * (1 - es(t, 2.1, 2.3)) });
      const ex = 600 + 12, ey = 700 - 170, tx = WELL[0] + 60, ty = 700 - 150;
      pose(gaze, { x: ex, y: ey, r: (Math.atan2(ty - ey, tx - ex) * 180) / PI, sx: (Math.hypot(tx - ex, ty - ey) / 1000) * look, sy: 1, o: look > 0.01 ? 1 : 0 });

      /* v29a / v30a — the cards come down and are snipped away; v29b / v30b — up into life */
      let scO = 0, snipK = 0;
      cards.forEach((cd) => {
        const down = es(t, cd.t0, cd.t0 + 0.28, ease.back);
        const fall = es(t, cd.t0 + 0.52, cd.t0 + 0.98);
        if (t > cd.t0 - 0.1 && t < cd.t0 + 1) { scO = es(t, cd.t0 + 0.24, cd.t0 + 0.32) * (1 - es(t, cd.t0 + 0.62, cd.t0 + 0.74)); snipK = bump(t, cd.t0 + 0.36, cd.t0 + 0.54); }
        const gone = es(t, cd.t0 + 0.95, cd.t0 + 1.2);
        pose(cd.el, { x: CARD[0], y: lerp(-800, CARD[1], down) - gone * 1300, r: Math.sin(T * 0.8 + cd.i) * 1.2 * (1 - fall), o: down > 0.001 ? 1 : 0 });
        pose(cd.obj, { x: fall * 150, y: fall * 360 - Math.sin(fall * PI) * 60, r: fall * 70, o: 1 - es(t, cd.t0 + 0.9, cd.t0 + 0.99) });
      });
      pose(sc, { x: CARD[0] - 62, y: CARD[1] - 8, r: 0, o: scO });
      snip(sc, 44 * (1 - snipK));

      const w2 = es(t, 5.05, 5.8, (x) => x);
      let x2 = 470, y2 = 706, d2 = 1, s2 = 0.96;
      const come = es(t, 3.9, 4.3, (x) => x);
      x2 = lerp(300, 560, come);
      if (w2 > 0) { [x2, y2, d2] = along([[560, 706], ...PATHG], w2); s2 = lerp(0.96, 0.5, w2); }
      T2.set({ x: x2, y: y2, s: s2, flip: d2 < 0, walk: (come > 0 && come < 1) || (w2 > 0 && w2 < 1) ? x2 * 0.06 + w2 * 30 : undefined, head: bump(t, 4.3, 4.9) * 10, armF: 10, o: es(t, 3.9, 4.0) * (1 - es(t, 5.72, 5.88)), blink: blinkAt(T, 2) });
      const gateOn = Math.max(bump(t, 3.6, 4.1), bump(t, 5.6, 6.1));
      pose(gateGlow, { x: GATE[0], y: GATE[1], s: 1 + gateOn * 0.2, o: 0.6 + gateOn * 0.4 });
      pose(lTag, { x: GATE[0], y: lerp(PH ? -600 : -400, 300, es(t, 3.1, 3.35, ease.back)), r: Math.sin(T * 1.1) * 2 });
      const flare = Math.max(bump(t, 3.3, 3.9), bump(t, 5.3, 5.9)) * 0.6 + es(t, 2.9, 3.2) * 0.5;
      flames.forEach((f) => pose(f.el, { x: FX + f.x * FS, y: FY + f.y * FS, sy: (0.4 + flare * 0.7 + Math.sin(T * 6 + f.i * 1.7) * 0.1) * FS, sx: (1 + Math.sin(T * 5 + f.i) * 0.08) * FS, o: 0.3 + es(t, 2.9, 3.2) * 0.6 }));
      pose(fTag, { x: FX, y: lerp(PH ? -600 : -400, 440, es(t, 3.3, 3.55, ease.back)), r: Math.sin(T * 1.2) * 2 });

      S.cam.x = es(t, 1.1, 1.4) * 20 * (1 - es(t, 2, 2.3)) + es(t, 3, 3.6) * 10;
      S.cam.z = 1.02 + es(t, 1.1, 1.4) * 0.03 * (1 - es(t, 2, 2.3));
      S.cam.y = -12;
    };
  },
};
