// Mt 27,55–56 — the women watching from afar (Mark 15's cut). The crosses are small and quiet on the hill in the
// pale after-light; many women stand together on the road, one wiping a tear. A sepia memory hangs from the
// flies: walking with Him by the lake in Galilee, carrying bread and water — they had followed Him and served
// Him. Then the name tags come down: Mary Magdalene, Mary the mother of James and Joseph, and the mother of the
// sons of Zebedee.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { band, waterBand } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, nameTag, strip, withFace, faceBits, face, woman, golgothaSet, setCrosses, driftClouds, hanging, swing, LOOK, ZEBEDEE, GOL, SKIES, PI } from './lib.js';

const GY = 716;

export default {
  id: 'mt27-women',
  beats: [
    { v: 55, text: 'Było tam również wiele niewiast, które przypatrywały się z daleka.' },
    { v: 55, cont: true, text: 'Szły one za Jezusem z Galilei i usługiwały Mu.' },
    { v: 56 },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { pal: SKIES.after });
    const hd = G.crossC.querySelector('.hd'), hl = G.crossC.querySelector('.hl');
    const u = GOL.H / 240;
    pose(hd, { x: 0, y: -GOL.H + 50 * u, r: 28 });
    fade(hl, 0.5);

    /* many other women, further off */
    const P = G.P;
    const others = (S.portrait ? [[555, 650, false], [615, 640, false], [500, 646, false], [990, 648, true], [1045, 640, true], [935, 652, true], [680, 655, false]] : [[520, 650, false], [585, 640, false], [455, 646, false], [1010, 648, true], [1075, 640, true], [950, 652, true], [650, 655, false]]).map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(person(c, woman(c)))), seed: c.rr(0, 9) }));
    /* the three named women */
    const W3 = [
      { o: LOOK.maryJ, x: S.portrait ? 530 : 390, f: false, name: tr(['Maria, matka', 'Jakuba i Józefa'], ['Mary, mother of', 'James and Joses']) },
      { o: LOOK.magdalene, x: S.portrait ? 630 : 505, f: false, name: tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']) },
      { o: ZEBEDEE, x: S.portrait ? 1020 : 1110, f: true, name: tr(['matka synów', 'Zebedeusza'], ['mother of the sons', 'of Zebedee']) },
    ].map((w, i) => ({ ...w, i, p: S.puppet(P.add(withFace(person(c, w.o), faceBits(c)))), seed: c.rr(0, 9) }));
    const tagL = S.layer({ par: 0.6, sh: 5 });
    W3.forEach((w) => { w.tag = hanging(tagL, nameTag(c, w.name, { size: 16 }), { x: 0, y: -1500, len: 900 }); });

    /* a sepia memory: Galilee */
    const memL = S.layer({ par: 0.12, sh: 6 });
    const MW = 300, MH = 180;
    const cid = S.id('mem');
    const sep = (col) => mix(col, C.parchment, 0.45);
    let inner = `<rect x="${-MW / 2}" y="0" width="${MW}" height="${MH}" fill="${sep(C.skyBlue)}"/>`;
    inner += band(c, { y: 70, x0: -MW / 2 - 10, x1: MW / 2 + 10, bottom: MH + 10, amps: [6, 3, 1], lens: [200, 80, 30], color: sep(C.hillMid) }).markup;
    inner += waterBand(c, { y: 96, x0: -MW / 2 - 10, x1: MW / 2 + 10, bottom: MH + 10, color: sep(C.lake), foamN: 4, glints: false }).markup;
    inner += `<path d="${c.cut([[-MW / 2 - 10, 138], [MW / 2 + 10, 132], [MW / 2 + 10, MH + 10], [-MW / 2 - 10, MH + 10]], 0.6, 8)}" fill="${sep(C.sand)}"/>`;
    const fig = (o, x, s, hold = '') => `<g transform="translate(${x} 170) scale(${s})">${person(c, { ...o, holdF: hold })}</g>`;
    const basket = `<path d="${c.cut([[-12, -4], [12, -4], [9, 10], [-9, 10]], 0.3, 3)}" fill="${C.basket}"/><path d="${c.cut(c.ell(0, -5, 9, 4, 10), 0.2, 3)}" fill="${C.wheat}"/>`;
    const jugM = `<path d="${c.cut([[-5, -14], [5, -14], [8, -2], [6, 8], [-6, 8], [-8, -2]], 0.3, 3)}" fill="${C.pot}"/>`;
    inner += fig(LOOK.magdalene, -90, 0.52, basket) + fig(CAST.jesus, -10, 0.56) + fig(ZEBEDEE, 70, 0.5, jugM) + fig(LOOK.maryJ, 120, 0.48);
    inner += `<rect x="${-MW / 2}" y="0" width="${MW}" height="${MH}" fill="${C.parchment}" opacity=".28"/>`;
    const frame = sheet().p(c.cut(c.rect(-MW / 2 - 12, -12, MW + 24, MH + 24), 0.6, 8), mix(C.wood3, C.parchment, 0.3)).out();
    const mem = hanging(memL, `${frame}<defs><clipPath id="${cid}"><rect x="${-MW / 2}" y="0" width="${MW}" height="${MH}"/></clipPath></defs><g clip-path="url(#${cid})">${inner}</g><g transform="translate(0 ${MH + 30})">${strip(c, tr('z Galilei', 'from Galilee'), { size: 16 })}</g>`, { x: 0, y: -1500, len: 900 });
    pose(mem.querySelector('.obj'), { s: 0.82 });

    return (t, time) => {
      const T = time;
      driftClouds(G, T);
      setCrosses(G, 1, 1, 1);
      G.sk.blend(SKIES.after, SKIES.dusk, es(t, 0, 3) * 0.4);

      W3.forEach((w) => {
        const K = [[-0.3, [w.f ? 1400 : -100 - w.i * 60, GY]], [0.55 + w.i * 0.08, [w.x, GY]]];
        const [x, y] = kf(t, K);
        const grief = es(t, 0.5, 0.9);
        const wipe = w.i === 1 ? bump(t, 0.6, 1.0) : 0;
        w.p.set({ x, y, s: 1.08, flip: w.f, walk: moving(t, K) ? x * 0.05 : undefined, armF: 14 + wipe * 110 + (w.i === 0 ? grief * 40 : 0), armB: 8 + grief * 30, head: -8 + grief * 4, blink: blinkAt(T, w.seed) });
        face(w.p.el, 'sad', grief);
        face(w.p.el, 'tear', w.i === 1 ? es(t, 0.7, 0.9) * (1 - es(t, 1.9, 2.4)) : 0);
        const tk = es(t, 2.05 + w.i * 0.14, 2.4 + w.i * 0.14);
        const [hx, hy] = headAt(w.x, GY, 1.08, w.f);
        swing(w.tag, hx + (w.i === 0 ? -10 : w.i === 1 ? 60 : 0), hy - 190 - (1 - tk) * 700, T, 1.3, 0.9, w.i);
      });
      const mk = es(t, 1.05, 1.4) * (1 - es(t, 2.0, 2.3));
      swing(mem, S.portrait ? 800 : 1095, (S.portrait ? -70 : 250) - (1 - mk) * 800, T, 0.9, 0.7, 2);
      others.forEach((o) => {
        const k = es(t, 0.2 + o.i * 0.05, 0.5 + o.i * 0.05);
        o.p.set({ x: o.x + (o.f ? 1 : -1) * (1 - k) * 60, y: o.y, s: 0.8, flip: o.f, o: k, armF: 12 + (o.i % 3 === 0 ? 30 : 0), armB: 8, head: -6, blink: blinkAt(T, o.seed) });
      });
      S.cam.y = 20 + es(t, 0, 1) * 10 - es(t, 0.9, 1.4) * 30 * (1 - es(t, 2.0, 2.4));
      S.cam.z = 1.04 - es(t, 1.9, 2.5) * 0.02;
    };
  },
};
