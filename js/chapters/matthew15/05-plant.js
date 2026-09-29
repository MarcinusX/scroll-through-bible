// Mt 15,12–14a — on the square, the Pharisees turn their backs, offended, little storm-clouds over their heads; Peter
// and John come up to Jesus: "Do you know that the Pharisees took offence?" He answers with a picture: a painted
// garden bed comes down, the young plants standing in a shaft of light (the Father who planted them: light, never a
// figure) — and the thorny weed that He did not plant is pulled up, roots and all, and whirls away. "Leave them!" —
// He lets them go with a wave of the hand; the Pharisees walk off, and the disciples turn back to Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { bush } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { squareSet, pharisee, headAt, hand, speech, thought, GLYPH, plateBoard, secretShaft, goodPlant, weed, dust, sparkle, voiceRings, kf, moving, PI } from './lib.js';

const FLOOR = 668;
const JX = 780;
const BW = 560, BH = 250, BY = 120;         // the garden board: width, height, top
const SOIL = 196;                           // the soil line inside the board

export default {
  id: 'mt15-plant',
  beats: [
    { v: 12 },
    { v: 13 },
    { v: 14, text: 'Zostawcie ich!' },
  ],
  cam: { x: [-40, 60], y: [-80, 30], z: [1, 1.12] },
  build(S) {
    const set = squareSet(S);
    const c = set.c;

    /* ---------- the Pharisees (right), Jesus, Peter and John ---------- */
    const L = S.layer({ par: 0.55, sh: 5 });
    const PH = [{ i: 0, x: 1010 }, { i: 3, x: 1066 }, { i: 1, x: 1118 }, { i: 4, x: 1170 }].map((m, j) => ({ ...m, j, seed: c.rr(0, 9), p: S.puppet(L.add(pharisee(c, m.i))) }));
    const DS = [{ o: CAST.andrew, x: 560 }, { o: CAST.james, x: 500 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const peter = S.puppet(L.add(person(c, CAST.peter)));
    const john = S.puppet(L.add(person(c, CAST.john)));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.55, sh: 6 });
    const storms = PH.map(() => fx.add(`<g>${thought(c, GLYPH.storm(c), { w: 56, h: 42 })}</g>`));
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-14 0) scale(.9)">${GLYPH.frown(c)}</g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 84, h: 52, flip: false })}</g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 30, color: shade(C.ochre, 0.3) });

    /* ---------- the garden board ---------- */
    const bL = S.layer({ par: 0.5, sh: 6 });
    const board = bL.add(`<g>${plateBoard(c, BW, BH, { fill: '#eef0dc', sky: '#dbe9e3', gy: 0.6 })}</g>`);
    const shaft = bL.add(`<g>${secretShaft(c, { w0: 30, w1: 260, h: 190 })}</g>`);
    const PL = [[-190, 84, C.cream], [-122, 100, C.lavender], [-54, 90, C.cream], [14, 104, C.jesusMantle]];
    const plants = bL.add(`<g>${PL.map(([x, h, f]) => `<g transform="translate(${x} ${SOIL})">${goodPlant(c, h, { flower: f })}</g>`).join('')}</g>`);
    const weedEl = bL.add(`<g>${weed(c, 104)}</g>`);
    const soil = sheet();
    soil.p(c.cut([[-BW / 2, SOIL - 6], ...Array.from({ length: 12 }, (_, i) => [-BW / 2 + (BW * (i + 0.5)) / 12, SOIL - 6 + c.rr(-4, 4)]), [BW / 2, SOIL - 6], [BW / 2, BH], [-BW / 2, BH]], 0.6, 8), mix(C.soil, C.clay, 0.45));
    let furrow = '';
    for (let i = 0; i < 3; i++) furrow += c.ribbon([[-BW / 2 + 10, SOIL + 12 + i * 14], [BW / 2 - 10, SOIL + 12 + i * 14 + c.rr(-2, 2)]], 2);
    soil.x(furrow, shade(mix(C.soil, C.clay, 0.45), -0.2), 'opacity=".6"');
    const soilEl = bL.add(`<g>${soil.out()}</g>`);
    const hole = bL.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 26, 8, 10, 0.2), 0.4, 3), C.soilDark).out()}</g>`);
    const puff = bL.add(`<g>${dust(c, 22, C.sand2)}</g>`);
    const glints = Array.from({ length: 4 }, (_, i) => bL.add(`<g>${sparkle(c, 10, C.star)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1340, 860, 200, C.sage, C.moss) + bush(c, 160, 870, 220, C.moss, C.sage));

    return (t, time) => {
      const T = time;
      set.update(T);

      /* v12 — the Pharisees turn away offended; Peter and John come to Jesus */
      const turn = es(t, 0.05, 0.2);
      const go = seg(t, 2.1, 2.95);
      PH.forEach((m) => {
        const x = m.x + ease.in(go) * (560 + m.j * 20);
        m.p.set({ x, y: FLOOR - 8 + (m.j % 2) * 6, s: 0.86, flip: turn < 0.5, walk: go > 0 && go < 1 ? x * 0.05 + m.j : undefined, armF: 40 * turn, armB: 30 * turn, head: -turn * 14, lean: turn * 3, blink: blinkAt(T, m.seed) });
        const k = es(t, 0.15 + m.j * 0.06, 0.35 + m.j * 0.06, ease.back) * (1 - es(t, 2.0, 2.15));
        const [hx, hy] = headAt(m.x, FLOOR - 8 + (m.j % 2) * 6, 0.86, false);
        pose(storms[m.j], { x: hx - 10, y: hy - 24, s: k * 0.85, o: k > 0.02 ? 1 : 0 });
      });
      const PK = [[0.0, 380], [0.45, 640]], JK_ = [[0.05, 320], [0.5, 580]];
      const px = kf(t, PK), jx = kf(t, JK_);
      const back = es(t, 2.2, 2.5);
      const lookAfter = es(t, 2.05, 2.25) * (1 - back);
      peter.set({ x: px, y: FLOOR + 4, s: 0.94, flip: lookAfter > 0.5, walk: moving(t, PK) ? px * 0.05 : undefined, armF: bump(t, 0.5, 0.95) * 70 + lookAfter * 60, armB: bump(t, 0.55, 0.95) * 30, head: bump(t, 1.1, 1.9) * -12, blink: blinkAt(T, 3) });
      john.set({ x: jx, y: FLOOR + 14, s: 0.92, flip: lookAfter > 0.5, walk: moving(t, JK_) ? jx * 0.05 : undefined, armF: 10, head: bump(t, 1.1, 1.9) * -12, blink: blinkAt(T, 6) });
      DS.forEach((d) => d.p.set({ x: d.x - 20 + seg(t, 0.1, 0.6) * 20, y: FLOOR - 4, s: 0.88, head: bump(t, 1.1, 1.9) * -10 + d.i * 3, blink: blinkAt(T, d.seed) }));
      const [ax, ay] = headAt(640, FLOOR + 4, 0.94, false);
      const aK = es(t, 0.45, 0.62, ease.back) * (1 - es(t, 0.98, 1.08));
      pose(ask, { x: ax + 20, y: ay - 26, s: aK, o: aK > 0.02 ? 1 : 0 });

      /* v13 — the garden: the plant the Father did not plant is uprooted */
      const toBoard = es(t, 1.02, 1.3) * (1 - es(t, 1.95, 2.1));
      const wave = bump(t, 2.05, 2.95);
      jesus.set({
        x: JX, y: FLOOR + 10, s: 1.02, flip: t < 0.9 ? false : false,
        armF: 16 + bump(t, 0.9, 1.1) * 20 + toBoard * 20 + wave * (70 + Math.sin(t * 30) * 12), armB: 10 + toBoard * 120, head: -toBoard * 12 + wave * 4, blink: blinkAt(T),
      });
      const [jhx, jhy] = headAt(JX, FLOOR + 10, 1.02, false);
      voice(jhx + 8, jhy + 4, bump(t, 2.02, 2.6), T, { dir: 1 });
      const bk = es(t, 1.0, 1.3, ease.out) * (1 - es(t, 2.0, 2.3, ease.in));
      const by = BY - (1 - bk) * 1150 + (T ? Math.sin(T * 0.8) * 2 : 0);
      pose(board, { x: 800, y: by });
      pose(plants, { x: 800, y: by });
      pose(soilEl, { x: 800, y: by });
      pose(shaft, { x: 800 - 88, y: by + SOIL - 2, o: es(t, 1.2, 1.4) * 0.95 });
      const up = es(t, 1.35, 1.55, ease.out);
      const fly = seg(t, 1.84, 2.0);
      const shake = up > 0.9 && fly === 0 && T ? Math.sin(T * 9) * 3 : 0;
      const wx = 800 + 170 + fly * 180, wy = by + SOIL - up * 84 - Math.sin(fly * PI) * 60 + fly * 30;
      pose(weedEl, { x: wx, y: wy, r: up * 8 + shake + fly * 120, s: 1 - fly * 0.4, o: 1 - seg(t, 1.92, 2.0) });
      pose(hole, { x: 970, y: by + SOIL - 2, o: es(t, 1.4, 1.55) });
      const pk = seg(t, 1.36, 1.72);
      pose(puff, { x: 970, y: by + SOIL - 10 - pk * 16, s: 0.5 + pk, o: Math.sin(pk * PI) * 0.9 });
      glints.forEach((g, i) => {
        const k = bump(t, 1.2 + i * 0.1, 1.95);
        pose(g, { x: 800 + PL[i][0], y: by + SOIL - PL[i][1] - 14, s: k * 0.9, r: T * 30 + i * 20, o: k });
      });

      S.cam.y = -es(t, 0.95, 1.3) * 40 * (1 - es(t, 1.95, 2.2));
      S.cam.x = es(t, 0.05, 0.6) * -20 + es(t, 2.1, 2.6) * 50;
      S.cam.z = 1 + es(t, 0.1, 0.8) * 0.06 - es(t, 0.95, 1.3) * 0.04 + es(t, 2.1, 2.6) * 0.02;
    };
  },
};
