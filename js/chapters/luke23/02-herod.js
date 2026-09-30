// Łk 23,7b–10 — Herod's hall in Jerusalem (Mark 6's Herod, his crown and his throne; through the tall windows
// the roofs of the city and the white sanctuary). A Roman soldier brings Jesus in bound; Herod on his throne sits
// up — and is very glad: he rises with open arms. He had long wanted to see Him: the stories he had heard float
// round him on little discs (loaves and fishes, a crutch thrown away, a light). He hopes for a sign: in his thought
// a star of wonder, and he waves towards Jesus — do something! He showers Him with questions: a flurry of little
// question marks… Jesus closes His eyes and says nothing, and the questions drop to the floor. The chief priests and
// scribes step forward and accuse Him vehemently: dark scraps fly and fall round His feet.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { disc, fishCut, withFace, faceBits, noble } from '../mark6/lib.js';
import { loaf } from '../mark2/lib.js';
import { kf, moving, hand, headAt, speech, thought, GLYPH, spark, priest, scribe, soldier, hguard, bonds, ropeLine, herodHall, candleSet, herodCrown, strip, HEROD, HALL, tr, PI } from './lib.js';

const JX = 780, JY = 704;
const HS = [1142, 652], HU = [1080, 664];   // Herod sitting on the throne / standing on the dais

/** a dark scrap of accusation (as in Mark 15) */
function accusation(c, i) {
  const w = c.rr(34, 48);
  const s = sheet().p(c.cut([[-w / 2, -9], [w / 2, -10], [w / 2 + 1, 9], [-w / 2 - 1, 10]], 0.6, 6), mix(C.storm2, C.rock3, 0.35));
  let d = '';
  let x = -w / 2 + 5;
  while (x < w / 2 - 7) { const l = c.rr(4, 9); d += c.ribbon([[x, c.rr(-2, 2)], [Math.min(x + l, w / 2 - 5), c.rr(-2, 2)]], 1.8); x += l + 3; }
  s.x(d, C.cream, 'opacity=".65"');
  return `<g>${s.out()}</g>`;
}
/** a crutch thrown away (small, for a disc) */
function crutch(c) {
  return sheet().p(c.ribbon([[0, -26], [0, 24]], 3.4) + c.ribbon([[-10, -26], [10, -26]], 4), C.wood2).out();
}

export default {
  id: 'lk23-herod',
  beats: [
    { v: 7, cont: true, text: 'odesłał Go do Heroda, który w tych dniach również przebywał w Jerozolimie.' },
    { v: 8, text: 'Na widok Jezusa Herod bardzo się ucieszył.' },
    { v: 8, cont: true, text: 'Od dawna bowiem chciał Go ujrzeć, ponieważ słyszał o Nim' },
    { v: 8, cont: true, text: 'i spodziewał się, że zobaczy jaki znak, zdziałany przez Niego.' },
    { v: 9, text: 'Zasypał Go też wieloma pytaniami,' },
    { v: 9, cont: true, text: 'lecz Jezus nic mu nie odpowiedział.' },
    { v: 10 },
  ],
  cam: { x: [-80, 190], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = herodHall(S);
    const P = H.charL;
    // the courtiers and Herod's guard behind, by the throne
    const court = [[1350, 0], [1420, 3]].map(([x, i], k) => ({ x, k, p: S.puppet(H.backL.add(person(c, noble(c, i)))), seed: c.rr(0, 9) }));
    const guards = [[1470, 0], [1540, 1]].map(([x, i], k) => ({ x, k, p: S.puppet(H.backL.add(hguard(c, i))), seed: c.rr(0, 9) }));
    const hMark = (o) => withFace(withFace(person(c, o), herodCrown(c)), faceBits(c));
    const hSit = S.puppet(P.add(hMark({ ...HEROD, pose: 'sit' })));
    const hUp = S.puppet(P.add(hMark({ ...HEROD })));
    const frown = [hSit, hUp].map((p) => p.el.querySelector('[data-part="sad"]'));
    const pr = [[470, 0, 'p'], [390, 1, 's'], [320, 2, 'p'], [250, 2, 's']].map(([x, i, k], j) => ({ x, j, p: S.puppet(P.add(k === 'p' ? priest(c, i) : scribe(c, i))), seed: c.rr(0, 9) }));
    const sol = S.puppet(P.add(soldier(c, 2)));
    const jB = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c) })));
    const jQ = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c), eyes: 'closed' })));
    const fx = H.fxL;
    const rope = fx.add(`<g>${ropeLine(c)}</g>`);
    const jTag = fx.add(`<g>${strip(c, tr('w Jerozolimie', 'in Jerusalem'), { size: 17 })}</g>`);
    const joy = [0, 1, 2, 3, 4].map((i) => fx.add(`<g>${spark(c, 9)}</g>`));
    // what he had heard: little discs of stories
    const NEWS = [
      `<g transform="translate(-8 4)">${loaf(c, 12)}</g><g transform="translate(12 -8) scale(.55)">${fishCut(c)}</g>`,
      `<g transform="rotate(24)">${crutch(c)}</g>`,
      `<circle r="20" fill="url(#halo-glow)"/><g transform="scale(1.1)">${GLYPH.star(c)}</g>`,
      `<g transform="scale(1.1)">${spark(c, 12, C.sun)}</g>`,
    ].map((inner, i) => ({ i, el: fx.add(`<g>${disc(c, inner, { r: 28 })}</g>`) }));
    const hope = fx.add(`<g>${thought(c, `<circle r="30" fill="url(#halo-glow)"/><g transform="scale(1.5)">${GLYPH.star(c)}</g>`, { w: 84, h: 64 })}</g>`);
    const qs = Array.from({ length: 12 }, (_, i) => ({ i, el: fx.add(`<g>${speech(c, `<g transform="scale(.8)">${GLYPH.q(c)}</g>`, { w: 36, h: 32, flip: true })}</g>`), dx: c.rr(-120, 110), dy: c.rr(-90, 40), r: c.rr(-20, 20), fl: c.rr(-40, 40) }));
    const hush = fx.add(`<g><path d="${c.poly(c.circ(-14, 0, 3.4, 8)) + c.poly(c.circ(0, 0, 3.4, 8)) + c.poly(c.circ(14, 0, 3.4, 8))}" fill="${C.inkSoft}" opacity=".6"/></g>`);
    const slips = Array.from({ length: 12 }, (_, i) => ({ i, el: fx.add(accusation(c, i)), from: i % 3, dx: c.rr(-110, 110), land: c.rr(-2, 14), r0: c.rr(-30, 30) }));

    return (t, time) => {
      const T = time;
      H.candles.forEach((cd) => candleSet(cd, 1, T));

      /* v7b — brought in to Herod, in Jerusalem */
      const jK = [[-0.3, [420, JY]], [0.55, [JX, JY]]];
      const [jx, jy] = kf(t, jK);
      const sK = [[-0.3, [300, JY + 4]], [0.55, [650, JY + 4]], [0.95, [650, JY + 4]], [1.5, [80, JY + 6]]];
      const [sx, sy] = kf(t, sK);
      const sArm = 40;
      sol.set({ x: sx, y: sy, s: 1, flip: t > 0.95, walk: moving(t, sK) ? sx * 0.06 : undefined, armF: sArm, armB: 8, blink: blinkAt(T, 3) });
      const [ax, ay] = hand(jx, jy, 1.02, false, 30);
      const [bx, by] = hand(sx, sy, 1, t > 0.95, sArm);
      const d = Math.hypot(bx - ax, by - ay);
      pose(rope, { x: ax, y: ay, r: (Math.atan2(by - ay, bx - ax) * 180) / PI, sx: d / 100, o: t < 0.95 && d > 12 ? 1 : 0 });
      const tk = es(t, 0.3, 0.55, ease.back) * (1 - es(t, 0.95, 1.1));
      pose(jTag, { x: 800, y: 470, s: tk, r: -2, o: tk > 0.02 ? 1 : 0 });

      /* Jesus: quiet; eyes closed when He gives no answer */
      const silent = es(t, 5.05, 5.12);
      jB.set({ x: jx, y: jy, s: 1.02, flip: false, o: 1 - silent, walk: moving(t, jK) ? jx * 0.05 : undefined, amt: 0.6, armF: 30, armB: 28, head: 3, blink: blinkAt(T) });
      jQ.set({ x: jx, y: jy, s: 1.02, flip: false, o: silent, armF: 30, armB: 28, head: 7 });

      /* Herod: sits up, then rises glad; waves for a sign; showers questions */
      const up = es(t, 1.05, 1.13);
      hSit.set({ x: HS[0], y: HS[1], s: 1.06, flip: true, o: 1 - up, armF: 20 + es(t, 0.4, 0.9) * 30, armB: 10, lean: -es(t, 0.4, 0.9) * 6, head: -4, blink: blinkAt(T, 1) });
      const glad = es(t, 1.15, 1.45) * (1 - es(t, 2.0, 2.3));
      const wave = es(t, 3.1, 3.35) * (1 - es(t, 3.9, 4.1));
      const askK = es(t, 4.05, 4.3) * (1 - es(t, 5.0, 5.3));
      const pique = es(t, 5.3, 5.8);
      const hx = HU[0] - askK * 30;
      hUp.set({ x: hx, y: HU[1], s: 1.06, flip: true, o: up, armF: 20 + glad * 100 + wave * 70 + askK * (60 + (T ? Math.sin(T * 6) * 14 : 0)) - pique * 10, armB: 10 + glad * 140 + askK * 30 + bump(t, 2.1, 2.9) * 40, lean: -glad * 4 - askK * 5 - wave * 4, head: -glad * 8 - bump(t, 2.1, 2.9) * 6 + pique * 6, blink: blinkAt(T, 1) });
      frown.forEach((el) => fade(el, pique));
      const [hhx, hhy] = headAt(HU[0], HU[1], 1.06, true);
      joy.forEach((j, i) => {
        const k = seg(t, 1.15 + i * 0.06, 1.75 + i * 0.06);
        const a = -PI / 2 + (i - 2) * 0.5;
        pose(j, { x: hhx + Math.cos(a) * (50 + k * 50), y: hhy - 10 + Math.sin(a) * (40 + k * 50), s: 0.6 + k * 0.6, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 });
      });
      /* v8b — the stories he had heard, circling him */
      const nk = es(t, 2.05, 2.4) * (1 - es(t, 2.9, 3.1));
      NEWS.forEach((n) => {
        const a = -PI * 0.92 + n.i * 0.42 + (T ? Math.sin(T * 0.6 + n.i) * 0.04 : 0);
        const r = 140 * nk;
        pose(n.el, { x: hhx - 10 + Math.cos(a) * r, y: hhy - 30 + Math.sin(a) * r, s: 0.3 + nk * 0.7, o: nk > 0.02 ? nk : 0 });
      });
      /* v8c — hoping to see a sign */
      const hk = es(t, 3.05, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(hope, { x: hhx - 60, y: hhy - 30, s: hk * 1.2, o: hk > 0.02 ? 1 : 0 });
      /* v9 — questions… that fall to the floor */
      const [jhx, jhy] = headAt(jx, jy, 1.02, false);
      qs.forEach((q) => {
        const k = seg(t, 4.08 + q.i * 0.05, 4.45 + q.i * 0.05);
        const drop = es(t, 5.12 + q.i * 0.02, 5.55 + q.i * 0.02, ease.in);
        const tx = lerp(jhx + 50, hhx - 90, (q.i % 6) / 5) + q.dx * 0.12, ty = jhy - 70 - Math.sin(((q.i % 6) / 5) * PI) * 60 + (q.i >= 6 ? -55 : 0) + q.dy * 0.15;
        const x = lerp(hhx - 50, tx, ease.out(k)), y = lerp(hhy - 10, ty, ease.out(k)) - Math.sin(k * PI) * 30;
        pose(q.el, { x: x + drop * q.fl, y: lerp(y, JY - 6, drop), s: 0.9 - drop * 0.3, r: q.r + drop * 80, o: k > 0 ? 1 - es(t, 5.6, 5.9) : 0 });
      });
      const b4 = es(t, 5.15, 5.35);
      pose(hush, { x: jhx + 40, y: jhy - 40, o: b4 * (1 - es(t, 5.95, 6.1)) });

      /* v10 — the chief priests and scribes, accusing vehemently */
      const acc = es(t, 6.05, 6.3);
      pr.forEach((m) => {
        const x = m.x + acc * 80;
        const shake = T ? Math.sin(T * 7 + m.j * 2) * 14 * acc : 0;
        m.p.set({ x, y: JY - 4 + (m.j % 2) * 8, s: 0.96, flip: false, walk: t > 6.05 && t < 6.3 ? x * 0.05 : undefined, armF: 20 + acc * (70 + (m.j % 2) * 20) + shake, armB: 10 + acc * (40 + (m.j % 3) * 40), head: -3 - acc * 5, lean: acc * 5, blink: blinkAt(T, m.seed) });
      });
      slips.forEach((sl) => {
        const k = seg(t, 6.1 + sl.i * 0.04, 6.4 + sl.i * 0.04);
        const src = pr[sl.from];
        const fx0 = src.x + acc * 80 + 40, fy0 = JY - 190;
        const lx = jx + sl.dx, ly = JY + 8 + sl.land;
        pose(sl.el, { x: lerp(fx0, lx, k), y: lerp(fy0, ly, k) - Math.sin(k * PI) * 100, r: sl.r0 + k * 200, o: k > 0 ? 1 : 0 });
      });

      /* the court watches */
      court.forEach((m) => m.p.set({ x: m.x, y: HALL.floor + 4, s: 0.9, flip: true, armF: 14 + bump(t, 2.1, 3.9) * 40, armB: 10, head: -4, blink: blinkAt(T, m.seed) }));
      guards.forEach((g) => g.p.set({ x: g.x, y: HALL.floor + 2, s: 0.94, flip: g.k === 1, armF: 16, armB: 8, blink: blinkAt(T, g.seed) }));

      S.cam.x = 20 + es(t, 0.9, 1.3) * 60 * (1 - es(t, 3.9, 4.3)) - es(t, 5.9, 6.3) * 70;
      S.cam.y = 20 + es(t, 0.9, 1.3) * 10;
      S.cam.z = 1.02 + es(t, 0.9, 1.3) * 0.04 * (1 - es(t, 3.9, 4.3)) + es(t, 4.9, 5.4) * 0.05 * (1 - es(t, 5.9, 6.3));
      if (S.portrait) S.cam.x += 90;
    };
  },
};
