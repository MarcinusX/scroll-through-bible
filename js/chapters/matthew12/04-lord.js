// Mt 12,6–8 — back in the grain field. "Something greater than the Temple is here": a small golden model of the
// Temple comes down on its string beside Jesus — and the light round Him grows until the Temple looks small and bows
// towards Him. "I desire mercy, not sacrifice": a pair of scales hangs over the path, a heart on one pan and a smoking
// altar on the other; the heart sinks. The Pharisee who was pointing at the disciples lowers his finger, and a quiet
// light rests on them — the guiltless. "The Son of Man is Lord of the Sabbath": the Sabbath tag with its two candles
// comes down and hangs over Him in the light, and the Pharisees step back.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { sanctuary } from '../mark11/lib.js';
import { fieldSet, FP, kf, phOpts, scribeOpts, handAt, headAt, heart, altar, puff, scalesParts, poseScales, sabbathTag, glow, rayBurst, sparkle, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'mt12-lord',
  beats: [
    { v: 6 },
    { v: 7 },
    { v: 8 },
  ],
  cam: { x: [-20, 20], y: [-10, 40], z: [1, 1.12] },
  build(S) {
    const F = fieldSet(S);
    const c = F.c;

    /* hanging things */
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const temple = hanging(hangL, `<g data-k="tmpl">${sanctuary(c, 0.62)}</g>`, { x: 600, y: -400, len: 900 });
    const sc = scalesParts(c, { arm: 120, drop: 80 });
    const scl = { frame: hangL.add(`<g>${sc.frame}</g>`), beam: hangL.add(`<g>${sc.beam}</g>`), panL: hangL.add(`<g>${sc.pan}<g transform="translate(0 70)">${heart(c, 30)}</g></g>`), panR: hangL.add(`<g>${sc.pan}<g transform="translate(0 ${80 - 2}) scale(.42)">${altar(c, 150, 90)}</g><g data-k="smk" transform="translate(0 20)">${puff(c, 16)}</g></g>`) };
    const tag = hanging(hangL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: JX, y: -400, len: 900 });

    /* people on the path */
    const act = S.layer({ par: 0.6, sh: 5 });
    const aura = act.add(`<g opacity="0">${glow(230, 1, 'halo-glow')}</g>`);
    const rays = act.add(`<g opacity="0">${rayBurst(c, { n: 20, r0: 50, r1: 330, spread: 0.04, color: '#fff3cf', o: 0.45 })}</g>`);
    const disLight = act.add(`<g opacity="0">${glow(170, 0.8)}</g>`);
    const DIS = [{ k: 'james', x: 468 }, { k: 'peter', x: 552 }, { k: 'andrew', x: 636 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const PH = [{ x: 1000, o: phOpts(0) }, { x: 1090, o: scribeOpts(1) }, { x: 1170, o: phOpts(2) }].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, m.o))) }));
    const sparks = [0, 1, 2].map(() => act.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    F.front();

    return (t, time) => {
      const T = time;
      F.update(T);

      /* v6 — the Temple comes down; the light round Him grows; the Temple bows */
      const td = es(t, 0.05, 0.4, ease.back) * (1 - es(t, 0.95, 1.2));
      const bow = es(t, 0.55, 0.8);
      const small = 1 - bow * 0.3;
      pose(temple, { x: 640, y: lerp(-400, 390, td), r: Math.sin(T * 0.8) * 0.8 + bow * 14, s: small, oy: 0, o: td > 0.01 ? 1 : 0 });
      const light = es(t, 0.35, 0.7) * (1 - es(t, 1.0, 1.3) * 0.7) + es(t, 2.1, 2.5) * 0.7;
      pose(aura, { x: JX, y: FP - 150, s: 0.7 + light * 0.7, o: Math.min(1, light) });
      pose(rays, { x: JX, y: FP - 175, s: 0.5 + light * 0.6, r: T * 3, o: Math.min(1, light) * 0.9 });

      /* v7 — mercy outweighs sacrifice; the finger comes down; light on the guiltless */
      const sd = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 2.0, 2.25));
      const tilt = es(t, 1.35, 1.65, ease.back) * -16;
      poseScales(scl, 1000, lerp(-400, 250, sd), tilt + Math.sin(T * 0.9) * 0.8, sd > 0.01 ? 1 : 0, 1, 120);
      pose(S.$('smk'), { x: Math.sin(T * 1.3) * 3, y: 18 - ((T * 10) % 14), s: 1 + Math.sin(T * 2) * 0.08 });
      const point = es(t, -0.3, 0.1) * (1 - es(t, 1.55, 1.75));
      const inno = es(t, 1.6, 1.8);
      pose(disLight, { x: 552, y: FP - 110, o: inno * (1 - es(t, 2.6, 2.9) * 0.5) });
      sparks.forEach((sp, i) => {
        const k = es(t, 1.65 + i * 0.05, 1.8 + i * 0.05, ease.back) * (1 - es(t, 2.1, 2.3));
        const [hx, hy] = headAt(DIS[i].x, FP, 0.95, false);
        pose(sp, { x: hx + 22, y: hy - 30, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      /* v8 — the Sabbath comes down over Him */
      const sb = es(t, 2.12, 2.5, ease.back);
      pose(tag, { x: JX, y: lerp(-400, 212, sb), r: Math.sin(T * 0.9) * 0.8, oy: 0, o: sb > 0.01 ? 1 : 0 });
      const lord = es(t, 2.3, 2.55);

      /* people */
      const toPh = es(t, -0.2, 0.1);
      jesus.set({ x: JX, y: FP, s: 1.06, flip: false, armF: 14 + toPh * 20 + bump(t, 0.3, 0.9) * 40 * 0 + es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1)) * 60 + lord * 30, armB: 10 + bump(t, 0.35, 0.95) * 60 + lord * 50, head: -2 - lord * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const up = es(t, 2.35 + d.i * 0.05, 2.6 + d.i * 0.05);
        d.p.set({ x: d.x, y: FP + (d.i % 2 ? 6 : -4), s: 0.95, flip: false, armF: 10 + inno * 16 + up * 30, armB: 6 + up * (d.i === 1 ? 90 : 20), head: -2 - up * 8 + (1 - inno) * 6 * point, lean: (1 - inno) * 3 * point, blink: blinkAt(T, d.seed) });
      });
      PH.forEach((m) => {
        const back = es(t, 2.35 + m.i * 0.05, 2.7);
        m.p.set({ x: m.x + back * 40, y: FP + (m.i % 2 ? -6 : 4), s: 0.95, flip: true, armF: m.i === 0 ? 10 + point * 84 : 12, armB: m.i === 2 ? 30 : 8, head: m.i === 0 ? -point * 4 : 4 - back * 6, lean: -back * 4, blink: blinkAt(T, m.seed) });
      });

      S.cam.z = kf(t, [[-0.5, 1.04], [0.6, 1.08], [1.1, 1.05], [2.2, 1.05], [2.7, 1.1]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.6, 20], [1.1, 0], [2.2, 0], [2.7, 26]]);
    };
  },
};
