// Łk 9,46–48 — evening in a village courtyard. "An argument arose among them, which of them was the greatest": over
// each disciple a thought comes up with a paper crown in it, and the crowns jostle and grow as they argue. Jesus knows
// the thoughts of their hearts — He looks from one to another, and the crowns tremble. He takes a little child who has
// come out of the house and sets him by His side, His hand on his shoulder. "Whoever receives this little child in my
// name receives me": Andrew kneels and opens his arms to the child, and a thread of light runs from the child to Jesus;
// "whoever receives me receives Him who sent me": the light goes on up from Jesus, and light comes down from above —
// only light. "For whoever is least among you all, this one will be great": the paper crowns fall to the floor, and a
// crown of light comes down over the child.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { yardSet, CHILD, TW9, thought, paperCrown, crownOfLight, halo, rayBurst, kf, headAt, hand, PI } from './lib.js';

const JX = 780, FY = 716;
const DIS = [
  { k: 'john', x: 640, y: FY + 6 }, { k: 'james', x: 560, y: FY + 14 }, { k: 'peter', x: 480, y: FY + 6 },
  { k: 'andrew', x: 990, y: FY + 6 }, { k: 'thomas', x: 1070, y: FY + 14 }, { k: 'matthew', x: 1150, y: FY + 6 },
];
const CX = 862;   // the child, by His side (Andrew kneels to him from the right)

export default {
  id: 'lk9-least',
  beats: [
    { v: 46 },
    { v: 47 },
    { v: 48, text: 'i rzekł do nich: «Kto przyjmie to dziecko w imię moje, Mnie przyjmuje;' },
    { v: 48, cont: true, text: 'a kto Mnie przyjmie, przyjmuje Tego, który Mnie posłał.' },
    { v: 48, cont: true, text: 'Kto bowiem jest najmniejszy wśród was wszystkich, ten jest wielki».' },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const Y = yardSet(S);
    const c = S.c;
    /* light from above (behind everyone) */
    const glowL = S.layer({ par: 0.45, sh: 1, flat: true });
    const above = glowL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 20, r1: 700, spread: 0.03, color: '#fff3cf', o: 0.55 })}</g>`);
    const aura = glowL.add(`<g opacity="0">${halo(170, 1)}</g>`);
    const thread = glowL.add(`<g opacity="0"><rect x="0" y="-4" width="1" height="8" fill="#fff0c2"/></g>`);
    const threadUp = glowL.add(`<g opacity="0"><rect x="-5" y="-600" width="10" height="600" fill="#fff0c2" opacity=".8"/></g>`);

    /* people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = DIS.map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const J = D.find((d) => d.k === 'andrew');
    J.kn = S.puppet(act.add(person(c, { ...TW9.andrew, pose: 'kneel' })));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const child = S.puppet(act.add(person(c, CHILD)));

    /* the crowns in their thoughts; the crowns fallen; the crown of light */
    const fx = S.layer({ par: 0.55, sh: 4 });
    D.forEach((d, i) => {
      d.th = fx.add(`<g opacity="0">${thought(c, '', { w: 62, h: 50 })}</g>`);
      d.cr = fx.add(`<g opacity="0">${paperCrown(c, 34)}</g>`);
    });
    const light = hanging(fx, `<g transform="scale(.6)">${crownOfLight(c, 50)}</g>`, { x: 0, y: -1500, len: 1000 });

    return (t, time) => {
      const T = time;
      Y.update(T);
      /* v46 — who is the greatest? */
      const argue = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.2) * 0.6);
      /* v47 — He knows their hearts; the child by His side */
      const look = bump(t, 1.0, 1.5);
      const cw = es(t, 1.2, 1.6, (u) => u);
      const cx = lerp(380, CX, cw);
      const take = es(t, 1.55, 1.7);
      const lookDir = look > 0.1 ? Math.sin(t * 12) > 0 : t > 1.6;
      jesus.set({ x: JX, y: FY, s: 1.04, flip: t < 1.6 ? !lookDir && look > 0.1 : false, armF: 20 + take * 40 + bump(t, 2.05, 2.9) * 30 + bump(t, 4.05, 4.9) * 40, armB: 10 + bump(t, 3.05, 3.9) * 120, head: -2 - bump(t, 3.05, 3.9) * 10, blink: blinkAt(T, 1) });
      child.set({ x: cx, y: FY + 8, s: 0.6, flip: false, walk: cw > 0 && cw < 1 ? t * 20 : undefined, o: t > 1.15 ? 1 : 0, armF: 10 + es(t, 2.2, 2.4) * 50, head: -10, blink: blinkAt(T, 8) });

      /* the disciples */
      const fall = es(t, 4.05, 4.4);
      D.forEach((d) => {
        const push = argue * Math.max(0, Math.sin(T * 2 + d.seed)) * (1 - fall);
        const kneel = d === J ? es(t, 2.05, 2.12) : 0;
        const bow = fall;
        d.p.set({ x: d.x, y: d.y, s: 0.94, flip: d.flip, o: 1 - kneel, armF: 20 + argue * 50 * (1 - fall) + push * 30, armB: argue * 40 * (d.i % 2) * (1 - fall), head: -4 - argue * 6 + bow * 14, lean: -argue * 4 * (1 - fall) + bow * 5, blink: blinkAt(T, d.seed) });
        const [hx, hy] = headAt(d.x, d.y, 0.94, d.flip);
        const up = es(t, 0.1 + d.i * 0.06, 0.3 + d.i * 0.06, ease.back) * (1 - es(t, 4.02, 4.12));
        const grow = 1 + argue * (0.15 + Math.sin(T * 2.4 + d.seed) * 0.12) + look * Math.sin(T * 30) * 0.05;
        const bx = hx + (d.flip ? -18 : 18), by = hy - 70;
        pose(d.th, { x: bx - 16, y: by + 58, s: up * grow, o: up > 0.01 ? 1 : 0 });
        // the crown: in the thought, then falling to the floor
        const fk = seg(t, 4.05 + d.i * 0.03, 4.4 + d.i * 0.03);
        const fx_ = bx + (d.flip ? 1 : -1) * fk * 30, fy = lerp(by, d.y + 10, ease.in(fk));
        pose(d.cr, { x: fx_, y: fy, s: (fk > 0 ? 0.9 : up * grow * 0.9), r: fk * (d.flip ? 120 : -120), o: (up > 0.01 || fk > 0) ? 1 - es(t, 4.8, 4.95) * 0 : 0 });
      });
      J.kn.set({ x: 944, y: FY + 10, s: 0.94, flip: true, o: es(t, 2.05, 2.12), armF: 60 + es(t, 2.1, 2.3) * 40, armB: 40 + es(t, 2.1, 2.3) * 70, head: -6, blink: blinkAt(T, J.seed) });

      /* v48a — the thread of light from the child to Jesus; v48b — and on up to Him who sent Him */
      const th = es(t, 2.25, 2.55);
      const [chx, chy] = headAt(CX, FY + 8, 0.6, false);
      const [jhx, jhy] = headAt(JX, FY, 1.04, false);
      const len = Math.hypot(jhx - chx, jhy - chy);
      pose(thread, { x: chx, y: chy, sx: Math.max(0.01, len * th), sy: 1, r: (Math.atan2(jhy - chy, jhx - chx) * 180) / PI, o: th * (1 - es(t, 4.8, 5.0)) });
      const up2 = es(t, 3.05, 3.35);
      pose(threadUp, { x: jhx, y: jhy - 30, sy: Math.max(0.01, up2), o: up2 * (1 - es(t, 4.8, 5.0)) });
      pose(above, { x: JX, y: -150, r: T * 2, o: es(t, 3.15, 3.45) * (1 - es(t, 4.8, 5.0) * 0.5) });
      pose(aura, { x: JX, y: FY - 150, o: 0.3 + es(t, 3.15, 3.45) * 0.6 });

      /* v48c — the least is great */
      const ck = es(t, 4.2, 4.5, ease.back);
      pose(light, { x: CX, y: lerp(-1500, FY - 128, ck), r: Math.sin(T * 0.8) * 2, oy: 0, o: ck > 0.002 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.6, 1.1], [3.0, 1.1], [3.3, 1.04], [4.0, 1.04], [4.5, 1.1]]);
      S.cam.y = kf(t, [[0, 40], [1.6, 50], [3.0, 50], [3.3, 20], [4.0, 20], [4.5, 50]]);
    };
  },
};
