// Mk 15,40–41 — the women watching from afar. The crosses are small and quiet on the hill in the pale
// after-light; in the foreground the women stand close together, one wiping a tear. Name tags come down for
// Mary Magdalene, Mary the mother of James the younger and Joses, and Salome. A sepia memory hangs from the
// flies: walking with Him by the lake in Galilee, carrying bread and water. Then many more women appear —
// all who came up with Him to Jerusalem.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { band, waterBand } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, nameTag, strip, withFace, faceBits, face, woman, golgothaSet, setCrosses, driftClouds, hanging, swing, LOOK, GOL, SKIES, PI } from './lib.js';

const GY = 716;

export default {
  id: 'm15-women',
  beats: [
    { v: 40, text: 'Były tam również niewiasty, które przypatrywały się z daleka,' },
    { v: 40, cont: true, text: 'między nimi Maria Magdalena, Maria, matka Jakuba Mniejszego i Józefa, i Salome.' },
    { v: 41, text: 'Kiedy przebywał w Galilei, one towarzyszyły Mu i usługiwały.' },
    { v: 41, cont: true, text: 'I było wiele innych, które razem z Nim przyszły do Jerozolimy.' },
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
    const others = [[520, 650, false], [585, 640, false], [455, 646, false], [1010, 648, true], [1075, 640, true], [950, 652, true], [650, 655, false]].map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(person(c, woman(c)))), seed: c.rr(0, 9) }));
    /* the three named women */
    const W3 = [
      { o: LOOK.maryJ, x: S.portrait ? 530 : 390, f: false, name: tr(['Maria, matka', 'Jakuba Mniejszego', 'i Józefa'], ['Mary, mother of', 'James the less', 'and of Joses']) },
      { o: LOOK.magdalene, x: S.portrait ? 630 : 505, f: false, name: tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']) },
      { o: LOOK.salome, x: S.portrait ? 1020 : 1110, f: true, name: tr('Salome', 'Salome') },
    ].map((w, i) => ({ ...w, i, p: S.puppet(P.add(withFace(person(c, w.o), faceBits(c)))), seed: c.rr(0, 9) }));
    const tagL = S.layer({ par: 0.6, sh: 5 });
    W3.forEach((w) => { w.tag = hanging(tagL, nameTag(c, w.name, { size: 16 }), { x: 0, y: 0, len: 900 }); });

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
    inner += fig(LOOK.magdalene, -90, 0.52, basket) + fig(CAST.jesus, -10, 0.56) + fig(LOOK.salome, 70, 0.5, jugM) + fig(LOOK.maryJ, 120, 0.48);
    inner += `<rect x="${-MW / 2}" y="0" width="${MW}" height="${MH}" fill="${C.parchment}" opacity=".28"/>`;
    const frame = sheet().p(c.cut(c.rect(-MW / 2 - 12, -12, MW + 24, MH + 24), 0.6, 8), mix(C.wood3, C.parchment, 0.3)).out();
    const mem = hanging(memL, `${frame}<defs><clipPath id="${cid}"><rect x="${-MW / 2}" y="0" width="${MW}" height="${MH}"/></clipPath></defs><g clip-path="url(#${cid})">${inner}</g><g transform="translate(0 ${MH + 30})">${strip(c, tr('w Galilei', 'in Galilee'), { size: 16 })}</g>`, { x: 0, y: 0, len: 900 });
    pose(mem.querySelector('.obj'), { s: 0.82 });

    return (t, time) => {
      const T = time;
      driftClouds(G, T);
      setCrosses(G, 1, 1, 1);
      G.sk.blend(SKIES.after, SKIES.dusk, es(t, 0, 4) * 0.4);

      W3.forEach((w) => {
        const K = [[-0.3, [w.f ? 1400 : -100 - w.i * 60, GY]], [0.55 + w.i * 0.08, [w.x, GY]]];
        const [x, y] = kf(t, K);
        const grief = es(t, 0.5, 0.9);
        const wipe = w.i === 1 ? bump(t, 0.6, 1.0) : 0;
        w.p.set({ x, y, s: 1.08, flip: w.f, walk: moving(t, K) ? x * 0.05 : undefined, armF: 14 + wipe * 110 + (w.i === 0 ? grief * 40 : 0), armB: 8 + grief * 30, head: -8 + grief * 4, blink: blinkAt(T, w.seed) });
        face(w.p.el, 'sad', grief);
        face(w.p.el, 'tear', w.i === 1 ? es(t, 0.7, 0.9) * (1 - es(t, 2.9, 3.4)) : 0);
        const tk = es(t, 1.05 + w.i * 0.14, 1.4 + w.i * 0.14);
        const [hx, hy] = headAt(w.x, GY, 1.08, w.f);
        swing(w.tag, hx + (w.i === 0 ? (S.portrait ? 30 : -10) : w.i === 1 ? 60 : 0), hy - 190 - (1 - tk) * 700, T, 1.3, 0.9, w.i);
      });
      const mk = es(t, 2.05, 2.4) * (1 - es(t, 3.1, 3.4));
      swing(mem, 800, 292 - (1 - mk) * 800, T, 0.9, 0.7, 2);
      others.forEach((o) => {
        const k = es(t, 3.05 + o.i * 0.06, 3.4 + o.i * 0.06);
        o.p.set({ x: o.x + (o.f ? 1 : -1) * (1 - k) * 60, y: o.y, s: 0.8, flip: o.f, o: k, armF: 12 + (o.i % 3 === 0 ? 30 : 0), armB: 8, head: -6, blink: blinkAt(T, o.seed) });
      });
      S.cam.y = 20 + es(t, 0, 1) * 10 - es(t, 1.9, 2.4) * 30 * (1 - es(t, 3.0, 3.4));
      S.cam.z = 1.04 - es(t, 2.9, 3.5) * 0.03;
    };
  },
};
