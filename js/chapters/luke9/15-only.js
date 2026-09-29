// Łk 9,37–40 — the next day, on the plain at the foot of the mountain (Mark 9's plain). Jesus comes down the path with
// Peter, James and John, and a great crowd hurries over the plain to meet Him. A man calls out of the crowd: "Teacher, I
// beg you, look at my son, for he is my only child" — he comes forward with his arm round the boy, and a tag comes
// down over them: my only one. "A spirit seizes him, he suddenly cries out, it convulses him until he foams": a small
// round plate is let down — the boy thrown on the ground, dark scraps whirling round him — and a dark wisp curls about
// the boy himself (kept small and quiet). "I begged your disciples to cast it out, and they couldn't": he turns to the
// disciples standing by, their hands lifted in vain in his bubble, crossed out, and they hang their heads.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { footSet, FATHER, BOY, TW9, bubble, speech, labelTag, heart, crossX, withFace, faceBits, lyingPerson, halo, kf, headAt, tr, PI } from './lib.js';
import { wisp } from '../mark3/lib.js';
import { paperHand } from '../mark9/lib.js';

const JX = 760, FY = 724;
const NINE = [{ k: 'thomas', x: 1160 }, { k: 'philip', x: 1230 }, { k: 'matthew', x: 1300 }];

export default {
  id: 'lk9-only',
  beats: [
    { v: 37 },
    { v: 38 },
    { v: 39 },
    { v: 40 },
  ],
  cam: { x: [-30, 60], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const F = footSet(S);
    const c = S.c;

    /* the plate of the fits */
    const plL = S.layer({ par: 0.3, sh: 5 });
    const plate = (() => {
      const s = sheet();
      s.p(c.cut(c.circ(0, 0, 86, 40), 0.5, 6), C.stone2);
      s.p(c.cut(c.circ(0, 0, 80, 40), 0.5, 6), mix(C.parchment, C.stone, 0.35));
      s.p(c.cut([[-72, 30], [72, 30], [56, 58], [-56, 58]], 0.4, 6), mix(C.sand2, C.stone2, 0.5));
      return s.out() + `<g transform="translate(-4 34) scale(.9)">${lyingPerson(c, { ...BOY, robe: mix(BOY.robe, C.stone2, 0.2) }, 0.44)}</g>`;
    })();
    const memo = hanging(plL, `<g transform="scale(1.35)">${plate}</g>`, { x: 0, y: -1500, len: 900 });
    const shards = plL.add(`<g opacity="0">${Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * PI * 2; return `<g transform="translate(${(Math.cos(a) * 40).toFixed(1)} ${(Math.sin(a) * 22).toFixed(1)}) rotate(${(a * 57).toFixed(0)})"><path d="${c.cut(c.blob(0, 0, 9, 5, 7, 0.4), 1.2, 3)}" fill="#3b3148"/></g>`; }).join('')}</g>`);
    const only = hanging(plL, `<g transform="scale(1.1)">${labelTag(tr('mój jedynak', 'my only child'), 18)}</g><g transform="translate(0 -30)">${heart(c, 10)}</g>`, { x: 0, y: -1500, len: 900 });

    /* people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const THREE = ['john', 'james', 'peter'].map((k, i) => ({ k, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[k]))) }));
    const N = NINE.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(withFace(person(c, TW9[d.k]), faceBits(c)))) }));
    N.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); });
    const boy = S.puppet(act.add(person(c, BOY)));
    const boyWisp = act.add(`<g opacity="0">${wisp(c, 1.2, '#463a52')}</g>`);
    const father = S.puppet(act.add(withFace(person(c, FATHER), faceBits(c))));
    const fSad = father.el.querySelector('[data-part="sad"]');
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.55, sh: 4 });
    const cry = fx.add(`<g opacity="0">${bubble(c, [tr('Nauczycielu,', 'Teacher,'), tr('spójrz na mego syna!', 'look at my son!')], { size: 19, tail: -1 })}</g>`);
    const couldnt = fx.add(`<g opacity="0">${speech(c, `<g transform="translate(-22 22)">${paperHand(c, C.skin2, 0.8)}</g><g transform="translate(2 24)">${paperHand(c, C.skin3, 0.8)}</g><g transform="translate(26 22)">${paperHand(c, C.skin, 0.8)}</g><g transform="translate(34 -18) scale(.6)">${crossX(c, 20)}</g>`, { w: 104, h: 72 })}</g>`);

    return (t, time) => {
      const T = time;
      F.update(T);
      /* v37 — down from the mountain; the crowd hurries to meet Him */
      const down = es(t, -0.1, 0.7, (u) => u);
      const jx = lerp(300, JX, down);
      jesus.set({ x: jx, y: FY - 20 * (1 - down), s: 1.02, walk: t < 0.7 ? t * 16 : undefined, flip: false, armF: 20 + bump(t, 0.7, 1.0) * 40 + bump(t, 1.3, 1.95) * 30, armB: 10 + bump(t, 0.7, 1.0) * 60, head: -2, blink: blinkAt(T, 1) });
      THREE.forEach((d) => {
        const x = lerp(160 - d.i * 70, 520 + d.i * 70, es(t, -0.1, 0.8, (u) => u));
        d.p.set({ x, y: FY + 6 - (d.i % 2) * 10, s: 0.94, walk: t < 0.8 ? t * 16 + d.i : undefined, armF: 20, blink: blinkAt(T, d.seed) });
      });
      F.crowd.forEach((m) => {
        const k = es(t, 0.1 + (m.i % 6) * 0.04, 0.6 + (m.i % 6) * 0.04, ease.out);
        m.sp.set({ x: lerp(m.x + 500, m.x - 40, k), y: m.y - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 24)) * 5 : 0), o: 1 });
      });
      N.forEach((d) => {
        const shame = es(t, 3.2, 3.5);
        d.p.set({ x: d.x, y: FY + 8 + (d.i % 2) * 8, s: 0.94, flip: true, armF: 20 - shame * 10, head: shame * 16, lean: shame * 6, blink: blinkAt(T, d.seed) });
        pose(d.sad, { o: shame });
      });

      /* v38 — the father and his only child */
      const out = es(t, 1.02, 1.3);
      const fx0 = lerp(1080, 930, out);
      const plead = bump(t, 1.2, 1.95);
      const toNine = es(t, 3.05, 3.2) * (1 - es(t, 3.85, 3.95));
      father.set({ x: fx0, y: FY + 4, s: 1.0, flip: toNine < 0.5, walk: out > 0 && out < 1 ? t * 16 : undefined, armF: 30 + plead * 70 + toNine * 70, armB: 40 + plead * 60, head: -4, blink: blinkAt(T, 3) });
      pose(fSad, { o: es(t, 2.05, 2.3) });
      const bx = lerp(1150, 1000, out);
      const shudder = bump(t, 2.1, 2.9) * Math.sin(T * 18) * 2;
      boy.set({ x: bx + shudder, y: FY + 10, s: 0.64, flip: true, walk: out > 0 && out < 1 ? t * 16 + 1 : undefined, armF: 10, armB: 10, head: 8 + bump(t, 2.1, 2.9) * 10, o: out > 0 ? 1 : 0, blink: blinkAt(T, 6) });
      const [fhx, fhy] = headAt(fx0, FY + 4, 1.0, true);
      const ck = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(cry, { x: fhx - 50, y: fhy - 30, s: ck, o: ck > 0.01 ? 1 : 0 });
      const ok = es(t, 1.3, 1.6, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(only, { x: 1010, y: lerp(-1500, 440, ok), r: Math.sin(T * 0.9) * 2, oy: 0, o: ok > 0.002 ? 1 : 0 });

      /* v39 — the plate of his fits; the wisp about him */
      const mk = es(t, 2.05, 2.35, ease.back) * (1 - es(t, 2.95, 3.2));
      const my = lerp(-1500, 290, mk);
      pose(memo, { x: 930, y: my, r: Math.sin(T * 0.8) * 1.5, oy: 0, o: mk > 0.002 ? 1 : 0 });
      pose(shards, { x: 930, y: my + 30, r: T * 30, s: 1.2 + Math.sin(T * 3) * 0.1, o: mk > 0.9 ? es(t, 2.3, 2.45) : 0 });
      const [bhx, bhy] = headAt(bx, FY + 10, 0.64, true);
      pose(boyWisp, { x: bhx + 18 + Math.sin(T * 1.4) * 4, y: bhy + 10, r: Math.sin(T * 1.1) * 12, o: es(t, 2.2, 2.4) * (1 - es(t, 3.9, 4.0) * 0.3) });

      /* v40 — the disciples could not */
      const nk = es(t, 3.08, 3.25, ease.back) * (1 - es(t, 3.9, 4.0));
      pose(couldnt, { x: fhx - 10, y: fhy - 40, s: nk, o: nk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -20], [0.7, 0], [1.0, 16], [3.0, 16], [3.3, 30]]);
      S.cam.z = kf(t, [[0, 1.02], [0.7, 1.04], [1.1, 1.1], [3.9, 1.1]]);
      S.cam.y = kf(t, [[0, 20], [1.1, 40]]);
    };
  },
};
