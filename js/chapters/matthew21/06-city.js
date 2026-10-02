// Mt 21,10–11 — through the gate into Jerusalem: the whole city is stirred. The street shivers, shutters fly open,
// faces look out of the windows and heads rise over the roof parapets; townsfolk hurry in from the lanes. "Who is
// this?" — question marks pop up all along the street. The crowds of pilgrims answer: "This is the prophet, Jesus,
// from Nazareth of Galilee" — and a plate comes down with the little hill town of Nazareth.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud, sun, cypress, palm } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { colt, jenny, coltRig, saddleCloaks, riderLeg, cityWall, sanctuary, frond, question, bubble, townsfolk, TWELVE_O, headAt, hungPlate, strip, pose3, folk4, sparkle, tr, DAY, PI } from './lib.js';

const ST = 692;          // the street
const JX = 790;

/** a tall town house front with its windows (x0..x1, top y); returns markup + window centres */
function houseRow(c, specs) {
  const s = sheet();
  const wins = [];
  const cols = [mix(C.plaster, C.sand, 0.25), mix(C.parchment, C.plaster, 0.4), mix(C.plaster2, C.sand2, 0.3), mix(C.sand, C.dawn, 0.35)];
  specs.forEach(([x0, x1, top], i) => {
    const col = cols[i % cols.length];
    s.p(c.cut([[x0, ST], [x0, top], [x1, top - c.rr(-4, 4)], [x1, ST]], 0.6, 10), col);
    // parapet
    let par = '';
    for (let x = x0 + 4; x < x1 - 12; x += 24) par += c.cut(c.rect(x, top - 14, 14, 14), 0.3, 4);
    s.p(par, col);
    // door
    const dx = (x0 + x1) / 2 + c.rr(-30, 30);
    s.p(c.cut([[dx - 26, ST], [dx - 26, ST - 80], ...c.arc(dx, ST - 80, 26, 22, PI, 2 * PI, 8), [dx + 26, ST]], 0.4, 5), mix(C.wood2, C.soilDark, 0.2));
    // windows: two rows
    for (let r = 0; r < 2; r++) {
      const wy = top + 50 + r * 90;
      if (wy > ST - 236) continue;
      for (let x = x0 + 40; x < x1 - 30; x += 90) wins.push([x + c.rr(-6, 6), wy]);
    }
  });
  let wd = '';
  wins.forEach(([x, y]) => { wd += c.cut([[x - 18, y + 26], [x - 18, y - 8], ...c.arc(x, y - 8, 18, 16, PI, 2 * PI, 8), [x + 18, y + 26]], 0.3, 4); });
  s.p(wd, mix(C.soilDark, C.wood2, 0.35));
  let sills = '';
  wins.forEach(([x, y]) => { sills += c.ribbon([[x - 22, y + 28], [x + 22, y + 28]], 5); });
  s.p(sills, C.wood2);
  return { markup: s.out(), wins };
}
/** a face at a window (origin: window centre) */
function windowFace(c, i) {
  const skin = [C.skin, C.skin2, C.skin3, C.skin4][i % 4];
  const s = sheet();
  s.p(c.cut(c.circ(0, 8, 12, 14), 0.3, 3), skin);
  if (i % 2) s.p(c.cut([[-15, 10], [-14, -4], ...c.arc(0, -2, 14, 13, PI, 2 * PI, 8), [14, -4], [15, 12], [10, 4], [-10, 4]], 0.3, 3), [C.skyVeil, C.blushVeil, C.linen2, C.ochreRobe][i % 4]);
  else s.p(c.cut([...c.arc(0, 4, 12.6, 10, PI, 2 * PI, 8)], 0.3, 3), [C.hair, C.hair2, C.hair3][i % 3]);
  s.x(c.poly(c.circ(-4, 8, 1.5, 6)) + c.poly(c.circ(4, 8, 1.5, 6)), C.ink);
  s.x(c.poly(c.ell(0, 15, 2.6, 2.2, 8)), shade(skin, -0.35));
  return s.out();
}
/** a pair of wooden shutters closed over a window (origin: window centre); each leaf is a separate piece */
function shutter(c, side) {
  const s = sheet();
  s.p(c.cut([[0, 26], [0, -22], [side * 18, -14], [side * 18, 26]], 0.3, 4), C.wood);
  s.x(c.ribbon([[side * 3, -8], [side * 3, 22]], 1.2) + c.ribbon([[side * 9, -10], [side * 9, 22]], 1.2) + c.ribbon([[side * 15, -12], [side * 15, 22]], 1.2), shade(C.wood, -0.25), 'opacity=".6"');
  return s.out();
}

export default {
  id: 'mt21-city',
  beats: [
    { v: 10, text: 'Gdy wjechał do Jerozolimy, poruszyło się całe miasto,' },
    { v: 10, cont: true, text: 'i pytano: «Kto to jest?»' },
    { v: 11 },
  ],
  cam: { x: [-40, 60], y: [-50, 40], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 120, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 420, y: 110, len: 700 });

    /* ---------- the Temple far up the street ---------- */
    const farL = S.layer({ par: 0.1, sh: 3 });
    let far = '';
    for (let x = -600; x < 2200; x += c.rr(40, 70)) { const h = c.rr(40, 110); if (Math.abs(x - 800) < 120) continue; far += c.cut(c.rect(x, 470 - h, c.rr(40, 64), h + 30), 0.4, 6); }
    farL.add(sheet().p(far, mix(C.plaster2, C.dune, 0.35)).out());
    farL.add(`<g transform="translate(800 470)">${sanctuary(c, 0.9)}</g>`);
    farL.add(cypress(c, 620, 480, 120) + cypress(c, 990, 480, 110) + palm(c, 1130, 490, 180));

    /* ---------- heads over the roof parapets (they rise into view behind the house fronts) ---------- */
    const roofL = S.layer({ par: 0.36, sh: 3 });
    const ROOF = [[330, 300], [420, 300], [545, 360], [1060, 360], [1215, 290], [1335, 290]];
    const roofers = ROOF.map(([x, y], i) => ({ x, y, i, seed: c.rr(0, 9), p: S.puppet(roofL.add(person(c, folk4(c)))) }));

    /* ---------- the street: houses either side, shivering as the city is stirred ---------- */
    const houseL = S.layer({ par: 0.36, sh: 4, pad: 20 });
    const left = houseRow(c, [[-500, 170, 250], [170, 470, 300], [470, 610, 360]]);
    const right = houseRow(c, [[990, 1130, 360], [1130, 1430, 290], [1430, 2100, 250]]);
    houseL.add(left.markup + right.markup);
    const wins = [...left.wins, ...right.wins].filter(([x]) => x > 180 && x < 1420);
    const faces = wins.map((w, i) => ({ w, i, el: houseL.add(`<g>${windowFace(c, i)}</g>`) }));
    const shut = wins.map((w, i) => ({ w, i, l: houseL.add(`<g>${shutter(c, 1)}</g>`), r: houseL.add(`<g>${shutter(c, -1)}</g>`) }));

    /* ---------- the paved street ---------- */
    const streetL = S.layer({ par: 0.45, sh: 3 });
    const st = sheet();
    st.p(c.cut([[-1400, ST - 6], [3000, ST - 6], [3000, 1800], [-1400, 1800]], 0.8, 30), mix(C.stone, C.sand, 0.4));
    let cob = '';
    for (let i = 0; i < 70; i++) cob += c.cut(c.blob(c.rr(-400, 2000), c.rr(ST + 10, ST + 200), c.rr(10, 18), c.rr(4, 7), 8, 0.2), 0.4, 4);
    st.x(cob, shade(C.stone, -0.12), 'opacity=".5"');
    streetL.add(st.out());

    /* ---------- townsfolk hurrying out of the lanes (sprites), the pilgrims behind Jesus ---------- */
    const crowdL = S.layer({ par: 0.47, sh: 4 });
    const town = [[1080, 0.78, true], [1300, 0.8, true], [560, 0.78, false]].map(([x, s, flip], i) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 36 + c.rr(-6, 6), y: c.rr(-4, 4) + (k % 2) * 10, s: 1, flip, head: c.rr(-8, 2), armF: c.rr(10, 60), o: folk4(c) }));
      return { i, x, s, sp: crowdL.sprite(`<g transform="scale(${s})">${pose3(c, mem)}</g>`, x, ST - 30) };
    });
    const pilgrims = [[330, 0.84], [170, 0.82]].map(([x, s], i) => {
      const mem = Array.from({ length: 4 }, (_, k) => ({ x: (k - 1.5) * 36 + c.rr(-6, 6), y: c.rr(-4, 4) + (k % 2) * 10, s: 1, flip: false, head: -6, armF: 30, armB: 150, o: { ...folk4(c), holdB: k % 2 ? `<g transform="rotate(-8)">${frond(c, 90)}</g>` : '' } }));
      return { i, x, s, sp: crowdL.sprite(`<g transform="scale(${s})">${pose3(c, mem)}</g>`, x, ST - 16) };
    });

    /* ---------- the questioners and the one who answers ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    // phone: the three who ask (and their question marks) stand in from under the progress thread
    const askers = [[1010, 4], [1110, -6], [1200, 6]].map(([x, dy], i) => ({ x: S.portrait ? 980 + (x - 1010) * 0.65 : x, y: ST + dy, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, folk4(c, i % 2 === 0)))) }));
    const answer = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...townsfolk(c, { man: true }), holdB: `<g transform="rotate(-8)">${frond(c, 96)}</g>` }))) };
    const dis = [TWELVE_O[0], TWELVE_O[2]].map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, o))) }));

    /* ---------- Jesus on the colt, the she-donkey ---------- */
    const jenL = S.layer({ par: 0.5, sh: 5 });
    const jRig = coltRig(jenL.add(jenny(c, { over: saddleCloaks(c, [TWELVE_O[5].mantle, TWELVE_O[8].mantle]) })));
    const jL = S.layer({ par: 0.5, sh: 5 });
    const cRig = coltRig(jL.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g>${riderLeg(c)}` })));
    const jRide = S.puppet(S.$('rider').firstElementChild);

    /* ---------- words ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const qs = [...askers.map((a) => [a.x, a.y, 0.94]), [1060, 250, 0.5], [420, 200, 0.5], [1335, 180, 0.5]].map(([x, y, s], i) => ({ i, x, y, s, el: fx.add(`<g>${question(c)}</g>`) }));
    const who = fx.add(`<g>${bubble(c, [tr('Kto to jest?', 'Who is this?')], { size: 21, tail: 1 })}</g>`);
    const ans = fx.add(`<g>${bubble(c, [tr('To jest prorok Jezus', 'This is the prophet Jesus'), tr('z Nazaretu w Galilei', 'from Nazareth of Galilee')], { size: 19, tail: -1 })}</g>`);
    const nazIcon = (() => {
      const s = sheet();
      s.p(c.cut([[-46, 26], [-36, -4], [-14, -18], [10, -20], [34, -8], [46, 26]], 0.5, 6), mix(C.hillMid, C.sage, 0.3));
      let h = '';
      [[-20, -14, 16, 14], [-2, -22, 18, 18], [16, -12, 14, 12], [-10, -4, 16, 12], [8, -2, 18, 13]].forEach(([x, y, w, hh]) => { h += c.cut(c.rect(x, y, w, hh), 0.3, 4); });
      s.p(h, C.plaster);
      s.x(c.poly(c.rect(2, -14, 3, 4)) + c.poly(c.rect(-15, -9, 3, 4)) + c.poly(c.rect(20, -7, 3, 4)), C.soilDark, 'opacity=".7"');
      s.p(c.cut(c.blob(-34, 8, 9, 7, 8, 0.2), 0.3, 3) + c.cut(c.blob(34, 10, 8, 7, 8, 0.2), 0.3, 3), C.olive);
      return s.out();
    })();
    const naz = fx.add(hungPlate(c, `<g transform="translate(0 -6) scale(1.2)">${nazIcon}</g><text x="0" y="46" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.ink}">${tr('Nazaret', 'Nazareth')}</text>`, { r: 66 }));
    const galTag = fx.add(`<g>${strip(c, tr('Galilea', 'Galilee'), { size: 16 })}</g>`);
    const glint = fx.add(`<g>${sparkle(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 120, T, 1, 0.7);
      swing(cl1, 420 + Math.sin(T * 0.1) * 24, 110, T, 1.2, 0.6, 1);

      /* v10a — He rides in; the whole city is stirred */
      const inK = es(t, 0.0, 0.55, ease.out);
      const cx = lerp(420, JX, inK);
      const riding = inK > 0 && inK < 1;
      cRig.set({ x: cx, y: ST + 6, s: 1, walk: riding ? cx * 0.06 : undefined, nod: Math.sin(T * 0.8) * 1.5, ear: Math.sin(T * 1.3) * 6 + bump(t, 1.05, 1.4) * 16, tail: Math.sin(T * 1.7) * 8 });
      jRig.set({ x: cx - 170, y: ST - 16, s: 1.02, walk: riding ? cx * 0.06 + 1 : undefined, nod: Math.sin(T * 0.7 + 1) * 1.5, ear: Math.sin(T * 1.1) * 6, tail: Math.sin(T * 1.5) * 8 });
      const bless = es(t, 2.1, 2.4);
      jRide.set({ x: 0, y: 0, s: 1, armF: 30 + bump(t, 0.6, 1.0) * 40 + bless * 50, armB: 20 + bless * 20, head: -2 + bump(t, 1.1, 1.8) * 6, blink: blinkAt(T) });
      pilgrims.forEach((g) => { const x = g.x - (1 - inK) * 380; g.sp.set({ x, y: ST - 16, s: 1, o: 1 }); });
      dis.forEach((d) => { const x = lerp(420, JX, inK) - 330 - d.i * 70 + 60; d.p.set({ x: x + 100, y: ST + 16 + d.i * 6, s: 0.92, walk: riding ? x * 0.05 + d.i : undefined, armF: bump(t, 2.1, 2.9) * 40, blink: blinkAt(T, d.seed) }); });
      // the street shivers, shutters fly open, faces look out, heads rise on the roofs
      const stir = bump(t, 0.35, 0.95);
      houseL.shift(Math.sin(t * 60) * 3 * stir, Math.cos(t * 47) * 1.5 * stir);
      shut.forEach((sh) => {
        const k = es(t, 0.4 + (sh.i % 5) * 0.06, 0.55 + (sh.i % 5) * 0.06, ease.back);
        const [x, y] = sh.w;
        let sx = 1 - 2 * k;
        if (Math.abs(sx) < 0.04) sx = sx < 0 ? -0.04 : 0.04;
        pose(sh.l, { x: x - 18, y, sx });
        pose(sh.r, { x: x + 18, y, sx });
      });
      faces.forEach((f) => { const k = es(t, 0.5 + (f.i % 5) * 0.06, 0.62 + (f.i % 5) * 0.06); pose(f.el, { x: f.w[0], y: f.w[1] + (1 - k) * 12, o: k }); });
      roofers.forEach((m) => {
        const k = es(t, 0.55 + m.i * 0.05, 0.8 + m.i * 0.05, ease.out);
        m.p.set({ x: m.x, y: m.y + 16 + (1 - k) * 70, s: 0.5, flip: m.x > JX, armF: es(t, 1.1, 1.3) * (m.i % 2 ? 70 : 20), head: -4, blink: blinkAt(T, m.seed) });
      });
      town.forEach((g) => {
        const k = es(t, 0.45 + g.i * 0.08, 0.95 + g.i * 0.08, ease.out);
        g.sp.set({ x: g.x + (g.x > JX ? 1 : -1) * (1 - k) * 420, y: ST - 30, s: 1, o: k > 0.01 ? 1 : 0 });
      });

      /* v10b — "Who is this?" */
      askers.forEach((m) => {
        const k = es(t, 0.6 + m.i * 0.06, 0.95 + m.i * 0.05, ease.out);
        const x = m.x + (1 - k) * 380;
        const ask = bump(t, 1.05, 2.1);
        m.p.set({ x, y: m.y, s: 0.94, flip: true, walk: k > 0 && k < 1 ? x * 0.06 + m.i : undefined, armF: ask * (m.i === 1 ? 80 : 30) + es(t, 2.4, 2.7) * 20, armB: ask * (m.i === 0 ? 60 : 0), head: -ask * 6 + es(t, 2.4, 2.7) * 8, blink: blinkAt(T, m.seed) });
      });
      qs.forEach((q) => {
        const k = es(t, 1.05 + q.i * 0.05, 1.25 + q.i * 0.05, ease.back) * (1 - es(t, 2.0, 2.2));
        const [hx, hy] = q.i < 3 ? headAt(askers[q.i].x, q.y, q.s, true) : [q.x, q.y];
        pose(q.el, { x: hx + 6, y: hy - (q.i < 3 ? 70 : 50) + Math.sin(T * 2 + q.i) * 3, s: k * (q.i < 3 ? 1 : 0.75), r: Math.sin(T * 1.5 + q.i) * 6, o: k > 0.02 ? 1 : 0 });
      });
      const [wx, wy] = headAt(askers[1].x, askers[1].y, 0.94, true);
      const wk = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(who, { x: wx - 60, y: wy - 100, s: wk, o: wk > 0.02 ? 1 : 0 });

      /* v11 — the crowds answer: the prophet Jesus, from Nazareth of Galilee */
      const aIn = es(t, 1.9, 2.2);
      const ax = lerp(480, 560, aIn);
      answer.p.set({ x: ax, y: ST + 10, s: 0.95, walk: aIn > 0 && aIn < 1 ? ax * 0.05 : undefined, armF: es(t, 2.1, 2.3) * 90, armB: 140, head: -4, blink: blinkAt(T, answer.seed), o: 1 });
      const [ahx, ahy] = headAt(ax, ST + 10, 0.95, false);
      const ak = es(t, 2.08, 2.3, ease.back);
      pose(ans, { x: ahx + 30, y: ahy - 40, s: ak, o: ak > 0.02 ? 1 : 0 });
      const nk = es(t, 2.25, 2.6, ease.out);
      pose(naz, { x: 1010, y: lerp(-800, 185, nk), r: T ? Math.sin(T * 0.9) * 1.5 : 0 });
      const gk = es(t, 2.4, 2.6, ease.back);
      pose(galTag, { x: 1010, y: 277, s: gk, o: gk > 0.02 ? 1 : 0 });
      pose(glint, { x: 970, y: 149, s: bump(t, 2.4, 2.9) * 1.2 + 0.001, r: t * 90, o: bump(t, 2.4, 2.9) });

      S.cam.x = -20 + es(t, 0, 0.55) * 30 + es(t, 1.0, 1.4) * 30 - es(t, 2.0, 2.4) * 20;
      S.cam.y = -10 - es(t, 0.4, 0.8) * 20 + es(t, 2.0, 2.4) * 10;
      S.cam.z = 1.06 - es(t, 0.4, 0.8) * 0.06;
    };
  },
};
