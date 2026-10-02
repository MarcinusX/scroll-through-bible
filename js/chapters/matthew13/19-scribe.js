// Mt 13,51–53 — back in Peter's house by lamplight. "Have you understood all this?" — the little plates of all the
// parables hang round Jesus; "Yes" — the disciples nod and a small light settles over each head. Then the scribe
// who has become a disciple of the Kingdom: Matthew (the one who writes it all down) goes to the storeroom chest
// and brings out things old and new — an old sepia scroll in one hand, a fresh loaf and grapes in the other. When
// Jesus has finished these parables He rises and goes out through the door into the dusk, the disciples after Him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { wheatStalk, fish } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  roomSet, chest, oldScroll, grapes, loaf, darnelStalk, leaven, pearl, mustardTree2, sowerPlate, speech, GLYPH, spark, headAt, hangAt, kf, moving, tr, PI,
} from './lib.js';

const JX = 800, JY = 724;

export default {
  id: 'mt13-scribe',
  beats: [
    { v: 51, text: 'Zrozumieliście to wszystko?»' },
    { v: 51, cont: true, text: 'Odpowiedzieli Mu: «Tak jest».' },
    { v: 52 },
    { v: 53 },
  ],
  cam: { x: [-80, 300], y: [-30, 60], z: [1, 1.16] },
  build(S) {
    const R = roomSet(S);
    const c = R.c;
    // phone: the outer disciples and Matthew close in, the plates make a narrower row, and for v52 the camera pans
    // right onto Matthew, his chest and the words "old" and "new"
    const P = S.portrait;

    /* the chest of things new and old, against the wall on the right */
    const chestL = S.layer({ par: 0.46, sh: 4 });
    const box = chestL.add(`<g transform="translate(${P ? 1150 : 1210} 666) scale(1.5)">${chest(c, { w: 90, h: 50 })}</g>`);
    const lid = box.querySelector('.lid'), glow = box.querySelector('.glow');

    /* people */
    const ppl = S.layer({ par: 0.5, sh: 5 });
    const SEATS = [
      { o: CAST.thomas, x: P ? 548 : 470, y: 700, s: 0.86 }, { o: CAST.andrew, x: P ? 600 : 560, y: 736, s: 0.94 }, { o: CAST.james, x: P ? 990 : 1040, y: 736, s: 0.94 },
      { o: CAST.peter, x: 650, y: 768, s: 1.0 }, { o: CAST.john, x: 950, y: 768, s: 1.0 },
    ].map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 6), p: S.puppet(ppl.add(person(c, { ...d.o, pose: 'sit' }))), st: S.puppet(ppl.add(person(c, d.o))) }));
    const mSit = S.puppet(ppl.add(person(c, { ...CAST.matthew, pose: 'sit' })));
    const mWalk = S.puppet(ppl.add(person(c, CAST.matthew)));
    const OLD = `<g transform="translate(0 6) rotate(-60) scale(1.5)">${oldScroll(c, 50)}</g>`;
    const NEW = `<g transform="translate(0 4) scale(1.6)"><circle r="34" fill="url(#warm-glow)"/><g transform="translate(-6 0)">${loaf(c, 16)}</g><g transform="translate(12 -4) scale(.9)">${grapes(c, 5)}</g></g>`;
    const mShow = S.puppet(ppl.add(person(c, { ...CAST.matthew, holdF: NEW, holdB: OLD })));
    const jSit = S.puppet(ppl.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jWalk = S.puppet(ppl.add(person(c, CAST.jesus)));

    /* fx: the parables round Him, the question, the lights of "yes", the words new and old */
    const fx = S.layer({ par: 0.52, sh: 6 });
    const tree = mustardTree2(c, { h: 420 });
    const ICONS = [
      `<g transform="scale(.8)">${sowerPlate(c)}</g>`,
      `<g transform="translate(-8 30) scale(.72)">${wheatStalk(c, { h: 58 }).replace('class="stalk"', '')}<g transform="translate(18 4)">${darnelStalk(c, { h: 46 })}</g></g>`,
      `<g transform="translate(0 30) scale(.12)">${tree.markup.replace(/class="(grow|branch|crown|trunk)"/g, '')}</g>`,
      `<circle r="18" fill="url(#warm-glow)"/>${leaven(c, 14)}`,
      `<g transform="translate(0 16)">${chest(c, { w: 56, h: 30 }).replace('class="glow" opacity="0"', 'opacity=".7"')}</g>`,
      pearl(14),
      `<g transform="scale(1.1)">${fish(c)}</g>`,
    ];
    const plates = ICONS.map((m, i) => {
      const a = (-0.5 + i / (ICONS.length - 1)) * 2.3;
      if (P) return { i, x: 800 + (-1 + (2 * i) / (ICONS.length - 1)) * 255, y: 360 - Math.cos(a) * 90 + (i % 2) * 28, el: hanging(fx, `<g transform="scale(.84)">${sheet().p(c.cut(c.circ(0, 0, 44, 30), 0.6, 5), C.cream).p(c.cut(c.circ(0, 0, 38, 28), 0.4, 5), C.parchment).out()}${m}</g>`, { x: 0, y: 0, len: 900 }) };
      return { i, x: 870 + Math.sin(a) * 330, y: 360 - Math.cos(a) * 90 + (i % 2) * 28, el: hanging(fx, `<g>${sheet().p(c.cut(c.circ(0, 0, 44, 30), 0.6, 5), C.cream).p(c.cut(c.circ(0, 0, 38, 28), 0.4, 5), C.parchment).out()}${m}</g>`, { x: 0, y: 0, len: 900 }) };
    });
    const ask = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 46, h: 40 })}</g>`);
    const yes = SEATS.map((d) => ({ d, el: fx.add(`<g>${spark(c, 11)}</g>`) }));
    const wOld = hanging(fx, tagW(c, tr('stare', 'old'), mix(C.parchment, C.dune, 0.4)), { x: 0, y: 0, len: 900 });
    const wNew = hanging(fx, tagW(c, tr('nowe', 'new'), C.halo), { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      pose(R.niche, { x: 780, y: 468, s: 1 + Math.sin(T * 7) * 0.03 });
      fade(R.pool, (0.45 + Math.sin(T * 3.1) * 0.03) * (1 - es(t, 3.4, 3.9) * 0.4));

      /* v51 — understood? yes */
      plates.forEach((p) => {
        const k = es(t, 0.02 + p.i * 0.05, 0.3 + p.i * 0.05, ease.back) * (1 - es(t, 1.9, 2.15));
        hangAt(p.el, p.x, lerp(-500, p.y, k), T, 1.6, 0.8, p.i);
      });
      const qk = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.05));
      const [jhx, jhy] = headAt(JX, JY, 1.04, false, 62);
      pose(ask, { x: jhx + 18, y: jhy - 28, s: qk, o: qk > 0.02 ? 1 : 0 });
      const nod = t > 1.05 && t < 1.7 ? Math.max(0, Math.sin((t - 1.05) * PI * 4)) : 0;
      const up = es(t, 3.2, 3.4);
      SEATS.forEach((d) => {
        const st = { x: d.x, y: d.y, s: d.s, flip: d.flip, blink: blinkAt(T, d.seed) };
        d.p.set({ ...st, o: 1 - up, armF: 20 + bump(t, 1.05, 1.9) * 60, armB: 10, head: -6 + nod * 12 });
        const wx = kf(t, [[3.35 + d.i * 0.05, d.x], [3.95, 330 + d.i * 30]]);
        d.st.set({ x: wx, y: d.y - 6, s: d.s, flip: true, o: up * (1 - seg(t, 3.9, 3.98)), walk: t > 3.35 && t < 3.95 ? wx * 0.05 : undefined, blink: blinkAt(T, d.seed) });
      });
      yes.forEach((y) => {
        const k = es(t, 1.15 + y.d.i * 0.05, 1.35 + y.d.i * 0.05, ease.back) * (1 - es(t, 2.0, 2.2));
        const [hx, hy] = headAt(y.d.x, y.d.y, y.d.s, y.d.flip, 62);
        pose(y.el, { x: hx, y: hy - 44, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 });
      });

      /* v52 — the scribe of the Kingdom brings out things new and old */
      const go = seg(t, 2.02, 2.08);
      const show = seg(t, 2.42, 2.48);
      mSit.set({ x: P ? 1015 : 1130, y: 700, s: 0.86, flip: true, o: 1 - go, armF: 20, head: -6, blink: blinkAt(T, 7) });
      const mx = kf(t, P ? [[2.05, 1015], [2.3, 1100], [2.5, 1100], [2.7, 1040]] : [[2.05, 1130], [2.3, 1150], [2.5, 1150], [2.7, 1080]]);
      mWalk.set({ x: mx, y: 706, s: 0.92, flip: false, o: go * (1 - show), walk: t > 2.05 && t < 2.3 ? mx * 0.05 : undefined, armF: 70 + bump(t, 2.25, 2.45) * 30, lean: bump(t, 2.28, 2.45) * 10, blink: blinkAt(T, 7) });
      mShow.set({ x: mx, y: 706, s: 0.92, flip: true, o: show * (1 - es(t, 3.2, 3.35)), armF: 120, armB: 110, head: -8, blink: blinkAt(T, 7) });
      const open = es(t, 2.22, 2.4) * (1 - es(t, 3.1, 3.3));
      pose(lid, { x: -46, y: -50, r: -open * 90 });
      fade(glow, open);
      const wo = es(t, 2.5, 2.7, ease.back) * (1 - es(t, 3.05, 3.25)), wn = es(t, 2.58, 2.78, ease.back) * (1 - es(t, 3.05, 3.25));
      hangAt(wOld, P ? 960 : 990, lerp(-500, 370, wo), T, 1.4, 0.8, 1);
      hangAt(wNew, P ? 1140 : 1180, lerp(-500, 350, wn), T, 1.4, 0.8, 2);

      /* v53 — He finishes and goes out; they follow */
      const jUp = es(t, 3.05, 3.15);
      const JK = [[3.12, 800], [3.75, 330]];
      const jx = kf(t, JK);
      jSit.set({ x: JX, y: JY, s: 1.04, o: 1 - jUp, armF: 30 + es(t, 2.1, 2.3) * 40 * (1 - es(t, 2.9, 3.05)), armB: 12 + bump(t, 0.2, 0.9) * 60, head: -6, blink: blinkAt(T) });
      jWalk.set({ x: jx, y: JY - 10, s: 1.04, flip: true, o: jUp * (1 - seg(t, 3.72, 3.8)), walk: moving(t, JK) ? jx * 0.05 : undefined, blink: blinkAt(T) });
      pose(R.doorLeaf, { x: 250, y: 646, sx: 1 - es(t, 3.0, 3.2) * 0.85 });

      S.cam.x = kf(t, [[0, 0], [2.0, 0], [2.3, P ? 300 : 20], [3.0, P ? 300 : 20], [3.4, -60]]);
      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.06], [2.0, 1.06], [2.3, 1.12], [3.0, 1.12], [3.4, 1.06]]);
      S.cam.y = kf(t, [[0, 0], [0.9, 20], [2.0, 20], [2.3, 40], [3.0, 40], [3.4, 30]]);
    };
  },
};
/** a word on a small cream strip (origin centre) */
function tagW(c, text, fill) {
  const w = text.length * 12 + 34;
  return `${sheet().p(c.cut([[-w / 2, -16], [w / 2, -17], [w / 2 + 2, 16], [-w / 2 - 1, 17]], 0.4, 5), fill).out()}<text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="24" font-style="italic" fill="${C.ink}">${text}</text>`;
}
