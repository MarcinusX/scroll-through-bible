// Mt 28,11 — Meanwhile (the two women still small on the far road): some of the guard come into the city, to the
// Temple court, helmets askew, and pour out everything to the chief priests — the ground shaking, a figure of
// lightning on the stone, the tomb open and empty — in a bubble of pictures. The chief priests freeze.
import { C, person, blinkAt, pose, lerp, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, MARYJ, templeCourt, courtFront, soldier, priest, speech, quakeGlyph, angelIcon, emptyTomb, headAt, withFace, faceBits, shakeLines, GLYPH } from './lib.js';

const FLOOR = 740;

export default {
  id: 'mt28-report',
  beats: [
    { v: 11 },
  ],
  cam: { x: [-40, 100], y: [0, 40], z: [0.9, 1.06] },
  build(S) {
    const c = S.c;
    const T = templeCourt(S, { sunAt: [1250, 150] });
    /* the two women, tiny on the far road over the hills */
    const farL = S.layer({ par: 0.09, sh: 1 });
    const tiny = [MAGD, MARYJ].map((o) => S.puppet(farL.add(person(c, o))));

    /* the chief priests */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const PR = [{ i: 0, x: 1000 }, { i: 1, x: 1110 }, { i: 2, x: 1210 }].map((p) => {
      const el = PL.add(withFace(priest(c, p.i), faceBits(c)));
      return { ...p, seed: c.rr(0, 9), p: S.puppet(el), angry: el.querySelector('[data-part="angry"]') };
    });
    /* the soldiers */
    const SO = [{ i: 0, x: 690 }, { i: 1, x: 590 }].map((s) => ({ ...s, seed: c.rr(0, 9), p: S.puppet(PL.add(soldier(c, s.i, { spear: false }))), sh: PL.add(`<g>${shakeLines(c, 24)}</g>`) }));
    /* the bubble of pictures */
    const fx = S.layer({ par: 0.52, sh: 6 });
    const bub = fx.add(`<g>${speech(c, '', { w: 330, h: 130 })}</g>`);
    const pics = [
      fx.add(`<g>${quakeGlyph(c, 60)}<g transform="translate(0 16)">${quakeGlyph(c, 44, C.clay)}</g></g>`),
      fx.add(`<g>${angelIcon(c, 1.1)}</g>`),
      fx.add(`<g>${emptyTomb(c, 1)}</g>`),
    ];
    const shock = PR.map(() => fx.add(`<g>${GLYPH.bang(c)}</g>`));
    courtFront(S, { xs: [210, 1400] });

    return (t, time) => {
      swing(T.sunEl, 1250, 150, time, 0.8, 0.5);
      swing(T.cl1, 470, 140, time, 1.2, 0.6, 1);
      /* the women on the far road */
      tiny.forEach((p, i) => { const x = lerp(1300, 900, seg(t, 0, 1)) + i * 16; p.set({ x, y: 402 + i * 2, s: 0.16, flip: true, walk: x * 0.3 + i, amt: 1 }); });

      /* the soldiers come in and tell everything */
      const inK = es(t, 0.02, 0.35, ease.out);
      const tell = es(t, 0.3, 0.4);
      SO.forEach((s, k) => {
        const x = lerp(s.x - 460, s.x, inK);
        const wave = Math.sin(t * 40 + k) * 0.5 + 0.5;
        s.p.set({ x, y: FLOOR + k * 6, s: 1.0, walk: inK < 1 ? x * 0.06 + k : undefined, amt: 1, armF: 30 + tell * (50 + wave * 40), armB: 10 + tell * (k ? 30 : 120) * (0.6 + wave * 0.4), head: -6 * tell, lean: 6 * (1 - inK), blink: blinkAt(time, s.seed) });
        const [hx, hy] = headAt(x, FLOOR + k * 6, 1.0, false);
        pose(s.sh, { x: hx, y: hy, o: tell * 0.8 });
      });
      const [bx, by] = headAt(SO[0].x, FLOOR, 1.0, false);
      const bk = es(t, 0.35, 0.5, ease.back);
      pose(bub, { x: bx + 30, y: by - 20, s: bk, o: bk > 0.01 ? 1 : 0 });
      pics.forEach((el, i) => {
        const k = es(t, 0.42 + i * 0.1, 0.52 + i * 0.1, ease.back);
        pose(el, { x: bx + 30 + 165 - 6 + (i - 1) * 100, y: by - 20 - 81 + (i === 2 ? 22 : i === 1 ? 6 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* the chief priests listen, and freeze */
      PR.forEach((p, k) => {
        const hear = es(t, 0.55 + k * 0.05, 0.75 + k * 0.05);
        p.p.set({ x: p.x, y: FLOOR - 4 + k * 4, s: 1.02, flip: true, armF: 16 + hear * (k === 0 ? 60 : 30), armB: 10 + hear * (k === 0 ? 110 : 60), head: -hear * 6 + (k === 2 ? hear * 10 : 0), lean: -hear * 6, blink: hear > 0.5 ? 0 : blinkAt(time, p.seed) });
        fade(p.angry, hear);
        const [hx, hy] = headAt(p.x, FLOOR - 4 + k * 4, 1.02, true);
        const sk = es(t, 0.7 + k * 0.05, 0.82 + k * 0.05, ease.back);
        pose(shock[k], { x: hx + 6, y: hy - 52, s: sk * 0.9, o: sk > 0.01 ? 1 : 0 });
      });

      S.cam.x = S.portrait ? 90 : 20;
      S.cam.y = 20;
      S.cam.z = S.portrait ? 0.92 : 1.02;
    };
  },
};
