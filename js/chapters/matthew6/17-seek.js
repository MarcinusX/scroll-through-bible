// Mt 6,31–33 — on the mountain again. "Do not say: what shall we eat? what shall we drink? what shall we wear?":
// the three questions pop up over the listeners on paper bubbles. "The Gentiles seek all these things": a plate comes
// down — little people run and run after a loaf, a jug and a cloak dangling ahead of them on strings, never catching
// them. "Your heavenly Father knows that you need them all": the plate goes up and the light of heaven opens, with all
// three held in its glow. "Seek first the Kingdom of God and His righteousness": a crown of light comes down over the
// hill and the disciples lift their faces to it — "and all these things will be given to you as well": the loaf, the
// jug and the cloak come down and are set beside them.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { mount, mountFront, plateBoard, pose3, folk, say, loaf, tunic, fatherLight, lightCrown, sparkle, tr, PI } from './lib.js';
import { jug } from '../mark2/lib.js';

const PX = 800, PY = 150, PW = 440, PH = 220;
const LX = 800, LY = 170;

export default {
  id: 'mt6-seek',
  beats: [
    { v: 31 },
    { v: 32, text: 'Bo o to wszystko poganie zabiegają.' },
    { v: 32, cont: true, text: 'Przecież Ojciec wasz niebieski wie, że tego wszystkiego potrzebujecie.' },
    { v: 33 },
  ],
  cam: { x: [-30, 30], y: [-70, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const M = mount(S, { sunAt: [1370, 120] });

    /* the three questions */
    const qL = S.layer({ par: 0.35, sh: 5 });
    const P = S.portrait;   // phone: the outer bubbles come in from the edge and the thread
    const Q = [
      [tr('co będziemy jeść?', 'what will we eat?'), P ? 560 : 460, 500, 1],
      [tr('co będziemy pić?', 'what will we drink?'), 760, 400, 1],
      [tr('czym się przyodziać?', 'what shall we wear?'), P ? 1010 : 1140, 500, -1],
    ].map(([txt, x, y, side], i) => ({ i, x, y, el: qL.add(`<g>${say(c, txt, { size: 20, side })}</g>`) }));

    /* heaven's light and the crown */
    const heavenL = S.layer({ par: 0.1, sh: 3 });
    const light = heavenL.add(`<g>${fatherLight(c, 48)}</g>`);
    const crownEl = hanging(heavenL, lightCrown(c, 50), { x: 0, y: 0, len: 1300 });

    /* the plate: the chase */
    const plateL = S.layer({ par: 0.12, sh: 6 });
    const board = plateL.add(`<g>${plateBoard(c, PW, PH, { fill: mix(C.parchment, C.dusk, 0.25), ground: mix(C.sand, C.clay, 0.3), gy: 0.8 })}</g>`);
    const runners = plateL.add(`<g>${pose3(c, [0, 1, 2].map((i) => ({ x: -110 + i * 60, y: (i % 2) * 6, s: 0.42, flip: false, o: folk(c, i !== 1), armF: 80 + i * 10, armB: 40, head: -8 })))}</g>`);
    const items = [loaf(c, 16), `<g transform="scale(.5)">${jug(c)}</g>`, `<g transform="scale(.6)">${tunic(c, C.dustyBlue)}</g>`];
    const BAIT = items.map((m, i) => ({ i, el: plateL.add(`<g><path d="M0 -600V-10" stroke="rgba(74,54,34,.55)" stroke-width="1" fill="none"/>${m}</g>`) }));
    const dust = [0, 1, 2].map(() => plateL.add(`<path d="${c.cut(c.blob(0, 0, 10, 6, 8, 0.3), 0.5, 3)}" fill="${mix(C.sand2, C.stone2, 0.4)}"/>`));

    /* what the Father knows, and adds */
    const giftL = S.layer({ par: 0.12, sh: 5 });
    const GIFTS = items.map((m, i) => ({ i, el: hanging(giftL, `<circle r="44" fill="url(#halo-glow)"/><g transform="scale(1.4)">${m}</g>`, { x: 0, y: 0, len: 1300 }) }));
    const sparks = [0, 1, 2, 3].map(() => giftL.add(`<g>${sparkle(c, 12)}</g>`));

    mountFront(S);

    return (t, time) => {
      const T = time;
      const up = es(t, 3.1, 3.4);
      M.pose(t, T, { armF: 20 + bump(t, 0.1, 0.9) * 50 + up * 30, armB: 10 + up * 120, head: -up * 14, blink: blinkAt(T) });
      M.listen(T, (d) => ({ head: (d.flip ? 3 : -3) - up * 18, armF: 16 + (d.i % 3) * 8 + up * 70, armB: 8 + up * 60, blink: blinkAt(T, d.seed) }));

      /* v31 — the three questions */
      Q.forEach((q) => {
        const k = es(t, 0.08 + q.i * 0.14, 0.26 + q.i * 0.14, ease.back) * (1 - es(t, 0.95, 1.1));
        pose(q.el, { x: q.x, y: q.y, s: k, r: (q.i - 1) * 3, o: k > 0.02 ? 1 : 0 });
      });

      /* v32a — the Gentiles chase them */
      const pk = es(t, 1.0, 1.3, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      const py = lerp(-560, PY, pk) + (T ? Math.sin(T * 0.8) * 2 : 0);
      const po = pk > 0.005 ? 1 : 0;
      pose(board, { x: PX, y: py, o: po });
      const gy = py + PH * 0.8 + 4;
      const run = T ? Math.sin(T * 8) : 0;
      pose(runners, { x: PX - 20 + (T ? Math.sin(T * 1.2) * 16 : 0), y: gy - Math.abs(run) * 3, o: po });
      BAIT.forEach((b) => {
        const x = PX + 80 + b.i * 50 + (T ? Math.sin(T * 1.2 + 0.6) * 22 : 0);
        pose(b.el, { x, y: py + 70 + (b.i % 2) * 20 + (T ? Math.sin(T * 2 + b.i) * 4 : 0), r: T ? Math.sin(T * 2 + b.i) * 8 : 0, o: po });
      });
      dust.forEach((d, i) => {
        const k = T ? (T * 1.3 + i / 3) % 1 : i / 3;
        pose(d, { x: PX - 150 - k * 40, y: gy - 4 - k * 10, s: 0.6 + k, o: po * (1 - k) * 0.8 });
      });

      /* v32b — the Father knows: the light, the three held in it */
      const hk = es(t, 2.02, 2.35);
      pose(light, { x: LX, y: LY, s: 0.7 + hk * 0.3, o: hk });
      const drop = es(t, 3.35, 3.7, ease.io);
      GIFTS.forEach((g) => {
        const k = es(t, 2.12 + g.i * 0.08, 2.42 + g.i * 0.08, ease.out);
        const hx = LX + (g.i - 1) * 170, hy = 330 + (g.i === 1 ? 30 : 0);
        const tx = [728, 880, 1062][g.i], ty = 668;
        pose(g.el, { x: lerp(hx, tx, drop), y: lerp(lerp(-420, hy, k), ty, drop), r: T ? Math.sin(T * 0.8 + g.i) * 2 : 0, o: k > 0.01 ? 1 : 0 });
      });
      /* v33 — the Kingdom first: the crown comes down; then the rest is added */
      const ck = es(t, 3.02, 3.3, ease.out);
      pose(crownEl, { x: LX, y: lerp(-300, 300, ck), r: T ? Math.sin(T * 0.7) * 1.4 : 0, o: ck > 0.01 ? 1 : 0 });
      pose(light, { x: LX, y: LY - ck * 30, s: 0.7 + hk * 0.3, o: hk });
      sparks.forEach((sp, i) => {
        const k = bump(t, 3.6 + i * 0.05, 3.95);
        pose(sp, { x: [733, 868, 1062, 800][i] + 10, y: 630 - k * 20, s: k, r: T * 40, o: k });
      });

      S.cam.z = 1.02 + es(t, 0.0, 0.5) * 0.02;
      S.cam.y = -30 - es(t, 0.95, 1.3) * 20 + es(t, 3.3, 3.7) * 30;
    };
  },
};
