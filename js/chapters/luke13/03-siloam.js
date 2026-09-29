// Łk 13,4–5 — "Or those eighteen on whom the tower in Siloam fell and killed them": another flat comes down —
// the lower city of Jerusalem, the pool of Siloam with its steps, and beside it a tall stone tower with eighteen
// small figures at its foot. The tower leans, falls in a cloud of dust and a scatter of blocks; when the dust sinks
// there is only a heap of stones. A disc "18" hangs on one side, a tag "Jerusalem" on the other, a question between
// them: were they more guilty than all who live there? "No, I tell you": the question becomes an equals sign.
// "But unless you repent, you will all perish in the same way": the flat goes up, an hourglass comes down beside
// Jesus and its sand runs, and the people on the slope bow their heads, hands on their hearts, one knot after another.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  teachSet, TG, flatY, flat, flatSky, tower, block, dustCloud, cairn, fig13, folk, numDisc, wordTag, question, equals, onString,
  hourglassParts, knot, crowdKnot, headAt, es, ease, bump, seg, tr, PI,
} from './lib.js';
import { makeCutter } from '../../core/paper.js';
import { house } from '../../assets/nature.js';

const { GY, JX, FX, FW, FH, K } = TG;
const X = (dx) => FX + dx * K;
const TWX = 70, TWY = 72;          // the tower's foot on the flat

export default {
  id: 'lk13-siloam',
  enter: 'fly',
  beats: [
    { v: 4 },
    { v: 5, text: 'Bynajmniej, powiadam wam;' },
    { v: 5, cont: true, text: 'lecz jeśli się nie nawrócicie, wszyscy tak samo zginiecie».' },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S);
    const c = S.c;

    /* the flat: the lower city, the pool of Siloam, the tower */
    const fl = sheet();
    const st = mix(C.stone, C.sand2, 0.3);
    // houses climbing behind
    let hs = '';
    for (let r = 0; r < 3; r++) for (let x = -FW / 2 - 20 + r * 18; x < FW / 2; x += c.rr(40, 58)) {
      const w = c.rr(28, 40), h = c.rr(20, 28), y = -36 + r * 28 - c.rr(0, 6);
      hs += house(c, x, y, w, h, { stairs: false, wall: r % 2 ? C.plaster : mix(C.plaster, C.sand, 0.3) });
    }
    fl.p(c.cut(c.rect(-FW / 2, 40, FW, 24), 0.4, 8), shade(st, -0.05));
    let cr = '';
    for (let x = -FW / 2; x < FW / 2; x += 18) cr += c.cut(c.rect(x, 32, 10, 9), 0.2, 3);
    fl.p(cr, shade(st, -0.05));
    fl.p(c.cut([[-FW / 2, 62], [FW / 2, 62], [FW / 2, FH / 2], [-FW / 2, FH / 2]], 0.5, 10), mix(C.sand, C.stone, 0.45));
    // the pool with its steps and colonnade
    fl.p(c.cut([[-200, 74], [-30, 74], [-40, 118], [-190, 118]], 0.4, 6), mix(C.stone2, C.sand2, 0.3));
    fl.p(c.cut([[-186, 82], [-44, 82], [-50, 114], [-180, 114]], 0.3, 6), C.lake2);
    fl.x(c.ribbon([[-170, 94], [-120, 93]], 2) + c.ribbon([[-100, 104], [-60, 103]], 2), C.foam, 'opacity=".6"');
    let cols = '';
    for (let x = -200; x <= -30; x += 24) cols += c.cut(c.rect(x - 3, 30, 7, 44), 0.2, 4);
    fl.p(cols + c.cut(c.rect(-206, 24, 182, 8), 0.3, 6), C.cream);
    const inner = flatSky(S, FW, FH, ['#dfd2b9', '#f4e6cc']) + hs + fl.out();
    const flatEl = T0.FL.add(flat(S, inner, { w: FW, h: FH }));
    const B = T0.bits;
    const heap = B.add(`<g opacity="0"><g transform="scale(1.3)">${cairn(c, 1)}</g><g transform="translate(-34 2)">${cairn(c, 0.6)}</g><g transform="translate(40 3)">${cairn(c, 0.55)}</g></g>`);
    const cc = makeCutter('lk13-eighteen');
    let people = '';
    for (let i = 0; i < 18; i++) { const r = i % 2, k = Math.floor(i / 2); people += `<g transform="translate(${-66 + k * 16 + r * 8} ${r * 8})">${fig13(cc, folk(cc, null), { s: 0.15, flip: k > 4, armF: cc.rr(0, 40) })}</g>`; }
    const eighteen = B.add(`<g>${people}</g>`);
    const towerEl = B.add(`<g>${tower(c, 0.5)}</g>`);
    const blocks = Array.from({ length: 7 }, (_, i) => ({ i, el: B.add(`<g opacity="0">${block(c, 14, 9)}</g>`), dx: -100 + i * 26 + c.rr(-6, 6), dy: c.rr(-4, 10), r: c.rr(-60, 60) }));
    const dust = B.add(`<g opacity="0">${dustCloud(c, 220)}</g>`);

    /* the tags: 18 — ? — Jerusalem */
    const tagL = S.layer({ par: 0.3, sh: 6 });
    const d18 = tagL.add(`<g>${onString(numDisc(c, '18', { r: 30 }), 1600)}</g>`);
    const dJ = tagL.add(`<g>${onString(`<g transform="translate(0 20)">${wordTag(c, tr('mieszkańcy Jerozolimy', 'those in Jerusalem'), { size: 19 })}</g>`, 1600)}</g>`);
    const q = tagL.add(`<g>${question(c)}</g>`);
    const eq = tagL.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 24, 20), 0.4, 4), C.cream).out()}${equals(c, 26, C.terracotta)}</g>`);

    /* v5b: the hourglass; the people kneel */
    const HG = hourglassParts(c, 150);
    const hgL = S.layer({ par: 0.34, sh: 6 });
    const hgFrame = hgL.add(`<g>${onString(`<g transform="translate(0 ${HG.h / 2})">${HG.frame}</g>`, 1600)}</g>`);
    const hgTop = hgL.add(`<g>${HG.top}</g>`), hgBot = hgL.add(`<g>${HG.bottom}</g>`), hgStream = hgL.add(`<g>${HG.stream}</g>`);
    const kneels = T0.groups.filter((g) => g.P === 'stand').map((g, j) => ({ g, j, sp: T0.crowdL.sprite(knot('lk13-t-' + g.k, g.n, { ...g.o, arms: [34, 48], armB: [8, 18], head: [20, 26] }), g.x, g.y) }));

    return (t, time) => {
      const T = time;
      T0.update(t, T);

      /* v4 — the flat; the tower falls on the eighteen */
      const kA = es(t, 0.02, 0.24, ease.out) * (1 - es(t, 2.0, 2.24, ease.in));
      const fy = flatY(kA), on = kA > 0.002 ? 1 : 0;
      const Y = (dy) => fy + dy * K;
      pose(flatEl, { x: FX, y: fy, s: K, o: on });
      const lean = es(t, 0.3, 0.38, ease.in) * 4 + es(t, 0.38, 0.52, ease.in) * 80;
      const gone = es(t, 0.5, 0.56);
      pose(towerEl, { x: X(TWX), y: Y(TWY), s: K, r: -lean, o: on * (1 - gone) });
      pose(eighteen, { x: X(TWX - 40), y: Y(TWY + 26), s: K, o: on * (1 - es(t, 0.5, 0.58)) });
      blocks.forEach((b) => {
        const k = seg(t, 0.44 + b.i * 0.012, 0.6 + b.i * 0.012);
        pose(b.el, { x: X(lerp(TWX - 30, TWX + b.dx, k)), y: Y(lerp(TWY - 120, TWY + 22 + b.dy, k) - Math.sin(k * PI) * 30), s: K, r: k * b.r, o: on * (k > 0 ? 1 : 0) });
      });
      const dk = seg(t, 0.46, 0.8);
      pose(dust, { x: X(TWX - 40), y: Y(TWY + 34), s: K * (0.4 + dk * 0.8), o: on * es(t, 0.46, 0.52) * (1 - es(t, 0.6, 0.8)) * 0.95 });
      pose(heap, { x: X(TWX - 40), y: Y(TWY + 30), s: K, o: on * es(t, 0.56, 0.62) });

      const tk = es(t, 0.62, 0.8, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      const ty = lerp(-700, 196, tk);
      pose(d18, { x: X(-150), y: ty + (T ? Math.sin(T * 0.9) * 2 : 0), r: T ? Math.sin(T * 0.8) * 2 : 0 });
      pose(dJ, { x: X(140), y: ty - 10 + (T ? Math.sin(T * 0.8 + 1) * 2 : 0), r: T ? Math.sin(T * 0.7 + 1) * 1.5 : 0 });
      const qk = es(t, 0.7, 0.82, ease.back) * (1 - es(t, 1.15, 1.25));
      pose(q, { x: X(0), y: ty + 10 + (T ? Math.sin(T * 2) * 3 : 0), s: qk * 1.2, o: qk > 0.02 ? 1 : 0 });
      const ek = es(t, 1.22, 1.4, ease.back) * (1 - es(t, 2.0, 2.15));
      pose(eq, { x: X(0), y: ty + 12, s: ek * 1.2, o: ek > 0.02 ? 1 : 0 });

      /* Jesus: speaks, shakes His head (v5a), turns to all (v5b) */
      const shake = bump(t, 1.05, 1.5) * Math.sin(t * 40) * 8;
      T0.jesus.set({ x: JX, y: GY, s: 1.06, flip: t < 1 || t > 2.4, armF: 20 + bump(t, 0.1, 0.9) * 40 + es(t, 2.1, 2.3) * 40, armB: 10 + bump(t, 0.1, 0.9) * 90 + es(t, 2.1, 2.3) * 110, head: shake - es(t, 2.1, 2.3) * 6, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, t < 1 || t > 2.4);
      T0.voice(hx, hy, bump(t, 0.02, 0.9) * 0.6 + bump(t, 1.02, 1.8) * 0.7 + bump(t, 2.02, 2.9) * 0.7, T, { spread: 1.8 });

      /* v5b — the hourglass runs; the people kneel */
      const hk = es(t, 2.1, 2.34, ease.out);
      const hx0 = 1010, hy0 = lerp(-900, 190, hk);
      pose(hgFrame, { x: hx0, y: hy0 + (T ? Math.sin(T * 0.8) * 2 : 0) });
      const run = es(t, 2.3, 3.0, (u) => u);
      pose(hgTop, { x: hx0, y: hy0 + HG.h / 2 - 2, sy: Math.max(0.02, 1 - run * 0.8), oy: -4, o: hk > 0.01 ? 1 : 0 });
      pose(hgBot, { x: hx0, y: hy0 + HG.h - 10, sy: Math.max(0.02, 0.15 + run * 0.85), o: hk > 0.01 ? 1 : 0 });
      pose(hgStream, { x: hx0, y: hy0 + HG.h / 2, o: hk > 0.9 ? 1 : 0 });
      T0.groups.forEach((g) => { if (g.P === 'stand') return; g.sp.set({ x: g.x, y: g.y }); });
      kneels.forEach((kn) => {
        const k = es(t, 2.45 + kn.j * 0.12, 2.52 + kn.j * 0.12);
        kn.g.sp.set({ x: kn.g.x, y: kn.g.y, o: 1 - k });
        kn.sp.set({ x: kn.g.x, y: kn.g.y, o: k });
      });

      S.cam.x = 0;
      S.cam.y = -12;
      S.cam.z = 1.03;
      void crowdKnot; void person; void CAST; void mix;
    };
  },
};
