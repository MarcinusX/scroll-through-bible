// Mt 25,24–25 — the third servant comes up with his dirty little bundle. "Lord, I knew you were a hard man": behind the
// master a great grey shadow of him rises on the wall, as the servant sees him, sickle in hand; "reaping where you did
// not sow, gathering where you did not scatter" — sheaves that are not his spring up at the shadow's feet. The servant
// trembles. "I was afraid, and I went and hid your talent in the ground": a round picture of the mound and the spade.
// "Here — you have what is yours": he puts the bundle on the table and unwraps one dull, earth-stained talent.
import { C, blinkAt, pose, lerp, sheet, mix, shade } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { estateSet, ES, RK, TSPOT, court, tablePos, pilePos, hardShadow, sheaf, mound, spade, bundle, plateOn, kf, moving } from './lib.js';

const SH = mix(C.storm2, C.plumRobe, 0.2);

export default {
  id: 'mt25-hard',
  parable: true,
  beats: [
    { v: 24, text: 'Przyszedł i ten, który otrzymał jeden talent, i rzekł:' },
    { v: 24, cont: true, text: '"Panie, wiedziałem, żeś jest człowiek twardy:' },
    { v: 24, cont: true, text: 'chcesz żąć tam, gdzie nie posiałeś, i zbierać tam, gdzieś nie rozsypał.' },
    { v: 25, text: 'Bojąc się więc, poszedłem i ukryłem twój talent w ziemi.' },
    { v: 25, cont: true, text: 'Oto masz swoją własność!"' },
  ],
  cam: { x: [-30, 60], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    const shL = S.layer({ par: E.P, sh: 0, flat: true });
    const shadow = shL.add(`<g>${hardShadow(c)}</g>`);
    const sheaves = [470, 540, 860].map((x, i) => ({ x, i, el: shL.add(`<g>${sheaf(c, 90).replace(/fill="#[0-9a-f]{6}"/gi, `fill="${SH}"`)}</g>`) }));
    shL.fade(0);
    const L = S.layer({ par: E.P, sh: 5 });
    const K = court(S, L);
    const fx = S.layer({ par: 0.3, sh: 6 });
    const hidden = fx.add(`<g>${plateOn(c, `<g transform="translate(0 26)">${sheet().p(c.cut([[-60, 0], [60, 0], [60, 24], [-60, 24]], 0.4, 8), mix(C.soil, C.clay, 0.4)).out()}${mound(c, 60, 20)}<g transform="translate(34 -4) rotate(200) scale(.5)">${spade(c, 100)}</g><g transform="translate(-6 16) scale(.5)">${bundle(c)}</g></g>`, { r: 56, face: mix(C.dawn, C.sage3, 0.4) })}</g>`);

    return (t, time) => {
      const T = time;
      E.update(T);
      E.joy(1);
      E.gateOpen(0);
      K.masterSit.set({ x: RK.MS, y: ES.G, s: 0.98, armF: 30, head: -2 - es(t, 4.3, 4.5) * 8, blink: blinkAt(T, 1) });
      K.masterStand.set({ o: 0 });
      K.s5.set({ x: RK.DOOR5, y: ES.G, s: 0.9, flip: false, armF: 30, head: -2, blink: blinkAt(T, 3) });
      K.s2.set({ x: RK.DOOR2, y: ES.G + 3, s: 0.9, flip: false, armF: 30, blink: blinkAt(T, 5) });
      K.g5.forEach((el, k) => { if (k > 9) { pose(el, { o: 0 }); return; } const [tx, ty] = tablePos(5, 5, k % 5); pose(el, { x: tx - 22 + (k < 5 ? 0 : 44), y: ty, s: 0.72 }); });
      K.g2.forEach((el, k) => { const [tx, ty] = tablePos(2, 2, k % 2); pose(el, { x: tx - 16 + (k < 2 ? 0 : 32), y: ty, s: 0.72 }); });

      /* v24a — the third comes up with his bundle */
      const IN = [[0.05, 1110], [0.45, 930]];
      const x0 = kf(t, IN, (u) => u);
      const fear = es(t, 1.0, 1.3) * (1 - es(t, 3.9, 4.1) * 0.6);
      const shake = T ? Math.sin(T * 31) * 1.6 * fear : 0;
      const put = es(t, 4.05, 4.25);
      K.s1.set({ x: x0 + shake, y: ES.G + 6, s: 0.9, flip: true, walk: moving(t, IN) ? x0 * 0.07 : undefined, armF: 56 - fear * 10 + put * 20, armB: 8 + fear * 20, head: 6 + fear * 10 - put * 6, lean: fear * 4, blink: blinkAt(T, 7) });
      K.s1k.set({ o: 0 });
      const [bx, by] = pilePos(x0 + shake, ES.G + 6, 0.9, true, 56 - fear * 10 + put * 20, 1, 0);
      const [tx, ty] = tablePos(1, 1, 0);
      const open = es(t, 4.3, 4.4);
      pose(K.pack, { x: lerp(bx, tx, put), y: lerp(by + 14, ty + 12, put) - Math.sin(put * Math.PI) * 24, s: 0.8, o: 1 - open });
      pose(K.dull, { x: tx, y: ty, s: 0.72, o: open });

      /* v24b–c — the hard man, as he sees him: a great shadow on the wall, reaping what others sowed */
      const sk = es(t, 1.05, 1.5) * (1 - es(t, 2.95, 3.2));
      shL.fade(sk * 0.55);
      pose(shadow, { x: 640, y: ES.G - 6, s: 1.9 + sk * 0.15, flip: false });
      sheaves.forEach((s) => { const k = es(t, 2.05 + s.i * 0.15, 2.3 + s.i * 0.15, ease.back); pose(s.el, { x: s.x, y: ES.G - 4, s: k * 1.2 }); });
      /* v25a — afraid, he hid it in the ground */
      const hk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.1));
      pose(hidden, { x: 930, y: lerp(-1500, 320, hk), r: Math.sin(T * 0.8) * 2, o: hk > 0.01 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.9, 1.3) * 0.04 * (1 - es(t, 2.9, 3.2)) + es(t, 3.9, 4.3) * 0.06;
      S.cam.x = -es(t, 0.9, 1.3) * 20 * (1 - es(t, 2.9, 3.2)) + es(t, 3.9, 4.3) * 30;
      S.cam.y = es(t, 3.9, 4.3) * 25;
    };
  },
};
