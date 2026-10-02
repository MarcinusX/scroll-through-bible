// Mt 6,25 — back on the mountain. Little grey worry-clouds hang over the listeners, each with its care painted on
// it: bread, a jug, a cloak. Jesus opens His hands: do not worry — and the clouds are drawn back up. "Is not life more
// than food, and the body more than clothing?": a great balance comes down; on one pan the little flame of a life, on
// the other the bread and the cloak — and the life goes down, heavier.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { mount, mountFront, worryCloud, loaf, tunic, soulLight, scalesParts, poseScales, tr, PI } from './lib.js';
import { jug } from '../mark2/lib.js';

const BX = 800, BY = 250, ARM = 150;

export default {
  id: 'mt6-worry',
  beats: [
    { v: 25, text: 'Dlatego powiadam wam: Nie troszczcie się zbytnio o swoje życie, o to, co macie jeść i pić, ani o swoje ciało, czym się macie przyodziać.' },
    { v: 25, cont: true, text: 'Czyż życie nie znaczy więcej niż pokarm, a ciało więcej niż odzienie?' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const M = mount(S, { sunAt: [1360, 120] });

    /* worry-clouds over the listeners */
    const cloudL = S.layer({ par: 0.4, sh: 4 });
    const icons = [
      `<g transform="translate(0 -12) scale(.9)">${loaf(c, 16)}</g>`,
      `<g transform="translate(0 0) scale(.5)">${jug(c)}</g>`,
      `<g transform="translate(0 -14) scale(.62)">${tunic(c, C.dustyBlue)}</g>`,
    ];
    // phone: all six clouds hang inside the screen (the outer two higher up, over the middle)
    const CLX = S.portrait ? [[525, 395, 0], [635, 320, 1], [960, 330, 2], [1010, 410, 0], [740, 220, 2], [880, 160, 1]] : [[520, 380, 0], [640, 330, 1], [960, 340, 2], [1080, 390, 0], [380, 420, 2], [1220, 430, 1]];
    const CL = CLX.map(([x, y, k], i) => ({ i, x, y, el: hanging(cloudL, `${worryCloud(c, 110)}<g transform="translate(0 -16)"><circle r="20" fill="${C.cream}" opacity=".85"/>${icons[k]}</g>`, { x: 0, y: 0, len: 900 }) }));

    /* the balance */
    const balL = S.layer({ par: 0.12, sh: 6 });
    const B = scalesParts(c, { arm: ARM, drop: 90 });
    const els = { frame: balL.add(`<g>${B.frame}</g>`), beam: balL.add(`<g>${B.beam}</g>`), panL: balL.add(`<g>${B.pan}<g transform="translate(0 70)">${soulLight(c, 20)}</g></g>`), panR: balL.add(`<g>${B.pan}<g transform="translate(-14 86)">${loaf(c, 22)}</g><g transform="translate(18 82) scale(.8)">${tunic(c, C.dustyBlue)}</g></g>`) };
    const lab = balL.add(`<g><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" font-style="italic" fill="${C.terracotta}">${tr('życie', 'life')}</text></g>`);

    mountFront(S);

    return (t, time) => {
      const T = time;
      const calm = es(t, 0.45, 0.7);
      const point = es(t, 1.05, 1.3);
      M.pose(t, T, { armF: 20 + calm * 50 + point * 30, armB: 10 + calm * 60 - point * 30, head: -point * 10, blink: blinkAt(T) });
      M.listen(T, (d) => ({ head: (d.flip ? 3 : -3) + (1 - calm) * 8 - point * 12, armF: 16 + (1 - calm) * 50 * (d.i % 2), blink: blinkAt(T, d.seed) }));
      CL.forEach((cl) => {
        const k = es(t, 0.02 + cl.i * 0.04, 0.3 + cl.i * 0.04, ease.out);
        const up = es(t, 0.72 + cl.i * 0.02, 1.0 + cl.i * 0.02, ease.in);
        pose(cl.el, { x: cl.x + (T ? Math.sin(T * 0.5 + cl.i) * 6 : 0), y: lerp(-400, cl.y, k) - up * 700, r: T ? Math.sin(T * 0.9 + cl.i) * 2 : 0, o: k > 0.01 && up < 0.99 ? 1 : 0 });
      });
      /* v25b — the balance comes down; life is heavier */
      const bk = es(t, 1.02, 1.35, ease.out);
      const tilt = es(t, 1.4, 1.7, ease.back) * 16;
      const by = lerp(-500, BY, bk);
      poseScales(els, BX, by, -tilt * -1 * -1, bk > 0.01 ? 1 : 0, 1, ARM);
      const r = (-tilt * PI) / 180;
      pose(lab, { x: BX - Math.cos(r) * ARM, y: by - Math.sin(r) * ARM + 132, o: es(t, 1.5, 1.7) });
      S.cam.z = 1 + es(t, 0.0, 0.6) * 0.04;
      S.cam.y = -30 - es(t, 1.0, 1.4) * 20;
    };
  },
};
